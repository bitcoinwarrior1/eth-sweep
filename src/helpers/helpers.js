const { ERC20, ERC721 } = require("./ABI.js");
const { ethers } = require("ethers");
const request = require('superagent');

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

    async transferToken(to, balanceObj) {
        try {
            const contract = new ethers.Contract(balanceObj.address, ERC20).connect(this.provider.getSigner());
            return contract.transfer(to, balanceObj.balance);
        } catch (e) {
            return e;
        }
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

    //get's all the tokens a user has interacted with
    async getERC20Tokens() {
        let erc20Query = this.getQueryERC20Events(this.chainId, this.account);
        try {
            let tokensObj = {};
            let tokens = [];
            let tokenNames = [];
            let tokenDecimals = [];
            let call = await request(erc20Query);
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
            let call = await request(erc721Query);
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
