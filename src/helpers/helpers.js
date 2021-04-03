import { unlimitedAllowance, zksyncAddress, OneInchAPIURL, ethAddress } from "./constants";
import { ZKSYNC, ERC20, ERC721 } from "./ABI.js";
import { ethers } from "ethers";
import request from 'superagent';

class helpers {

    constructor(provider, account, APIKeyString, to, chainId) {
        this.provider = provider;
        this.account = account;
        this.APIKeyString = APIKeyString;
        this.to = to;
        this.chainId = chainId;
    }

    async sendAllEth() {
        const userBalanceEth = await this.provider.getBalance(this.account);
        const gasPrice = await this.provider.getGasPrice();
        let txObj = {
            to: this.to,
            value: userBalanceEth
        };
        const gasLimit = await this.provider.estimateGas(txObj);
        const totalCost = ethers.BigNumber.from(gasLimit).mul(ethers.BigNumber.from(gasPrice));
        txObj.value = userBalanceEth.sub(totalCost);
        await this.provider.getSigner().sendTransaction(txObj);
    }

    async sendAllTokens(balancesMapping) {
        for(const balanceObj of balancesMapping) {
            const contract = new ethers.Contract(balanceObj.address, ERC20).connect(this.provider.getSigner());
            contract.transfer(this.to, balanceObj.balance)
                .then(console.log)
                .catch(console.error);
        }
    }

    async transferToken(balanceObj) {
        try {
            const contract = new ethers.Contract(balanceObj.address, ERC20).connect(this.provider.getSigner());
            return contract.transfer(this.to, balanceObj.balance);
        } catch (e) {
            return e;
        }
    }

    async tradeToEthWith1Inch(balanceObj) {
        const { tx, approvalAddress } = await this.get1InchTradeData(balanceObj);
        if(approvalAddress) {
            const tokenContract = new ethers.Contract(balanceObj.address, ERC20).connect(this.provider.getSigner());
            await tokenContract.approve(approvalAddress, unlimitedAllowance);
            // now that we are approved, try again
            await this.tradeToEthWith1Inch(balanceObj);
        } else {
            return this.provider.sendTransaction(tx);
        }
    }

    async get1InchTradeData(balanceObj) {
        try {
            const query = `${OneInchAPIURL}/swap?fromTokenAddress=${balanceObj.address}&toTokenAddress=${ethAddress}&amount=${balanceObj.balance.toString()}&fromAddress=${this.account}&slippage=${5}`;
            const response = await request.get(query);
            const tx = response.body.tx;
            const DEXAddress = tx.to;
            return {
                response: response,
                tx: tx,
                DEXAddress: DEXAddress
            }
        } catch(e) {
            console.error(e);
            const message = JSON.parse(e.response.text).message;
            if(message.includes("Not enough allowance")) {
                return {
                    approvalAddress: message.substring(message.length - 42)
                }
            }
        }

    }

    async getQuoteInEth1Inch(balanceObj) {
        try {
            const query = `${OneInchAPIURL}/quote?fromTokenAddress=${balanceObj.address}&toTokenAddress=${ethAddress}&amount=${balanceObj.balance.toString()}`;
            const result = await request.get(query);
            return result.body.toTokenAmount / 1e18;
        } catch (e) {
            console.error(e);
        }
    }

    async migrateEthtoL2(balance) {
        const gasPrice = await this.provider.getGasPrice();
        const gasLimit = 59476;
        const value = balance - (gasPrice * gasLimit);
        const zksyncContract = new ethers.Contract(zksyncAddress, ZKSYNC).connect(this.provider.getSigner());
        await zksyncContract.depositETH(this.to, { value: value.toString() });
    }

    async migrateToZksync(balanceObj) {
        const contract = new ethers.Contract(balanceObj.address, ERC20).connect(this.provider.getSigner());
        const allowance = await contract.allowance(this.account, zksyncAddress);
        if(allowance._hex === "0x00") {
            await contract.approve(zksyncAddress, unlimitedAllowance);
        }
        const zksyncContract = new ethers.Contract(zksyncAddress, ZKSYNC).connect(this.provider.getSigner());
        await zksyncContract.depositERC20(balanceObj.address, balanceObj.amount, zksyncAddress);
    }

    async getTokenBalances() {
        const erc20TokensObj = await this.getERC20Tokens();
        const erc721TokensObj = await this.getERC721Tokens();
        const erc20Balances = await this.getAllERC20Balances(erc20TokensObj);
        const erc721Balances = await this.getAllERC721Balances(erc721TokensObj);

        return [...erc20Balances, ...erc721Balances];
    }

    uniq(a) {
        let seen = {};
        return a.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }

    async getAllERC721Balances(tokensObj) {
        let erc721Balances = [];
        let contracts = this.uniq(tokensObj.contractAddresses);
        let names = this.uniq(tokensObj.tokenNames);
        for(let index in contracts) {
            for(let tokenId of tokensObj.tokenIds[contracts[index]]) {
                let stillOwned = await this.getStillOwnedERC721(tokenId, contracts[index]);
                if(stillOwned) {
                    let balanceObj = {};
                    balanceObj.address = contracts[index];
                    balanceObj.type = "ERC721";
                    balanceObj.balance = tokenId;
                    balanceObj.decimals = 0;
                    balanceObj.name = names[index];
                    erc721Balances.push(balanceObj);
                }
            }
        }
        return erc721Balances;
    }

    async getAllERC20Balances(erc20Contracts) {
        let erc20Balances = [];
        for(const index in erc20Contracts.contractAddresses) {
            let contractAddress = erc20Contracts.contractAddresses[index];
            //TODO too slow, get balances by batch
            let balance = await this.getERC20Balance(contractAddress);
            let balanceObj = {};
            balanceObj.decimals = erc20Contracts.decimals[index];
            balanceObj.address = contractAddress;
            balanceObj.balance = balance;
            balanceObj.type = "ERC20";
            balanceObj.name = erc20Contracts.tokenNames[index];
            if(balance.toString() !== "0") {
                erc20Balances.push(balanceObj);
            }
        }
        return erc20Balances;
    }

    async getStillOwnedERC721(tokenId, contractAddress) {
        try {
            const contract = new ethers.Contract(contractAddress, ERC721).connect(this.provider);
            let owner = await contract.ownerOf(tokenId);
            return owner.toLowerCase() === this.account.toLowerCase();
        } catch(e) {
            console.error(e);
        }
    }

    async getERC20Balance(contractAddress) {
        try {
            const contract = new ethers.Contract(contractAddress, ERC20).connect(this.provider);
            return await contract.balanceOf(this.account);
        } catch(e) {
            console.error(e);
        }
    }

    async getERC20Tokens() {
        let erc20Query = this.getQueryERC20Events(this.chainId, this.account);
        try {
            let tokensObj = {};
            let tokens = [];
            let tokenNames = [];
            let tokenDecimals = [];
            let call = await request.get(erc20Query);
            let results = call.body.result;
            for(let result of results) {
                if(!tokens.includes(result.contractAddress)) {
                    tokens.push(result.contractAddress);
                    tokenNames.push(result.tokenName);
                    tokenDecimals.push(result.tokenDecimal);
                }
            }
            tokensObj.tokenNames = tokenNames;
            tokensObj.contractAddresses = tokens;
            tokensObj.decimals = tokenDecimals;
            return tokensObj;
        } catch(e) {
            console.error(e);
        }
    }

    async getERC721Tokens() {
        let erc721Query = this.getQueryERC721Events(this.chainId, this.account);
        try {
            let tokensObj = {};
            let tokens = [];
            let tokenNames = [];
            let tokenDecimals = [];
            let tokenIds = {}; // NB: this must be checked to see if still owned
            let call = await request.get(erc721Query);
            let results = call.body.result;
            for(let result of results) {
                tokens.push(result.contractAddress);
                tokenNames.push(result.tokenName);
                tokenDecimals.push(result.tokenDecimal);
                if (tokenIds[result.contractAddress] === undefined) {
                    tokenIds[result.contractAddress] = [];
                }
                if(!tokenIds[result.contractAddress].includes(result.tokenID)) {
                    tokenIds[result.contractAddress].push(result.tokenID);
                }
            }
            tokensObj.tokenNames = tokenNames;
            tokensObj.contractAddresses = tokens;
            tokensObj.decimals = tokenDecimals;
            tokensObj.tokenIds = tokenIds;
            return tokensObj;
        } catch(e) {
            console.error(e);
        }
    }

    getQueryERC20Events(chainId) {
        switch (chainId) {
            case 1:
                return "https://api.etherscan.io/api?module=account&action=tokentx&address=" + this.account + this.APIKeyString;
            case 3:
                return "https://ropsten.etherscan.io/api?module=account&action=tokentx&address=" + this.account + this.APIKeyString;
            case 4:
                return "https://rinkeby.etherscan.io/api?module=account&action=tokentx&address=" + this.account + this.APIKeyString;
            case 42:
                return "https://kovan.etherscan.io/api?module=account&action=tokentx&address=" + this.account + this.APIKeyString;
            default:
                return "https://api.etherscan.io/api?module=account&action=tokentx&address=" + this.account + this.APIKeyString;
        }
    }

    getQueryERC721Events(chainId) {
        switch (chainId) {
            case 1:
                return "https://api.etherscan.io/api?module=account&action=tokennfttx&address=" + this.account + this.APIKeyString;
            case 3:
                return "https://ropsten.etherscan.io/api?module=account&action=tokennfttx&address=" + this.account + this.APIKeyString;
            case 4:
                return "https://rinkeby.etherscan.io/api?module=account&action=tokennfttx&address=" + this.account + this.APIKeyString;
            case 42:
                return "https://kovan.etherscan.io/api?module=account&action=tokennfttx&address=" + this.account + this.APIKeyString;
            default:
                return "https://api.etherscan.io/api?module=account&action=tokennfttx&address=" + this.account + this.APIKeyString;
        }
    }
}

export default helpers;
