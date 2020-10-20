const Ethers = require('ethers');
const provider = new Ethers.providers.Web3Provider(web3.currentProvider);
const { ERC20, ERC721 } = require("./ABI");
let account = null;
let chainId = null;
let to = null;

$(() => {

    const parentElement = $('#results');

    window.ethereum.enable().then((accounts) => {
        account = accounts[0];
        chainId = window.ethereum.chainId;
    }).catch(console.error);

    $("#ready").click(async () => {
        to = $("#transferTo").val();
        parentElement.append(`
        <div class="grid-container">
            <div class="grid-items">ETH</div>
            <div class="grid-items">${await provider.getBalance(account) / 1e+18}</div>
            <div class="grid-items">Ether</div>
            <div class="grid-items">
                <button class="btn btn-danger" id="sweepAllETH">Sweep All ETH</button>
            </div>
        </div>
        <div class="grid-container">
            <div class="grid-items">ALL</div>
            <div class="grid-items">ALL</div>
            <div class="grid-items">ALL</div>
            <div class="grid-items">
                <button class="btn btn-danger" id="sweepAllTokens">Sweep All Tokens</button>
            </div>
        </div>`);
        const _ = init();
    });

    async function init() {
        let balancesMapping = await getTokenBalances();
        render(balancesMapping);
        setSweepButtons(balancesMapping);
    }

    function setSweepButtons(balancesMapping) {
        $("#sweepAllTokens").click(() => {
            balancesMapping.map((balanceObj) => {
                let contract = new Ethers.Contract(balanceObj.address, ERC20).connect(provider.getSigner());
                contract.transfer(to, balanceObj.balance);
            });
        });
        $("#sweepAllETH").click(() => {
            sendAllEth().then(console.log).catch(console.error);
        });
    }

    async function sendAllEth() {
        const userBalanceEth = await provider.getBalance(account);
        const gasPrice = await provider.getGasPrice();
        let txObj = {
            to: to,
            value: userBalanceEth
        };
        const gasLimit = await provider.estimateGas(txObj);
        const totalCost = Ethers.BigNumber.from(gasLimit).mul(Ethers.BigNumber.from(gasPrice));
        txObj.value = userBalanceEth.sub(totalCost);
        provider.getSigner().sendTransaction(txObj);
    }

    async function getTokenBalances() {
        let erc20Query = getQueryERC20Events(chainId, account);
        let erc20Contracts = await getTokensContracts(erc20Query);
        // let erc721Query = getQueryERC721Events(chainId, account);
        /// let erc721Contracts = await getTokensContracts(erc721Query);
        let erc20Balances = await getAllERC20Balances(erc20Contracts);
        // let erc721Balances = await getAllERC721Balances(erc721Contracts);
        return  erc20Balances; //Object.assign(erc20Balances, erc721Balances);
    }

    async function getAllERC721Balances(tokenAddresses) {
        let erc721Balances = [];
        for(let tokenAddress of tokenAddresses) {
            let tokenIds = await getERC721Balance(""); //TODO
            for(let tokenId of tokenIds) {
                let balanceObj = {};
                balanceObj.address = tokenAddress;
                balanceObj.balance = tokenId;
                balanceObj.type = "ERC721";
                erc721Balances.push(balanceObj);
            }
        }
        return erc721Balances;
    }

    async function getAllERC20Balances(erc20Contracts) {
        let erc20Balances = [];
        for(let index in erc20Contracts.contractAddresses) {
            let contractAddress = erc20Contracts.contractAddresses[index];
            let balance = await getERC20Balance(contractAddress);
            let balanceObj = {};
            balanceObj.address = contractAddress;
            balanceObj.balance = balance;
            balanceObj.type = "ERC20";
            balanceObj.name = erc20Contracts.tokenNames[index];
            if(erc20Contracts.decimals[index] == 0) {
                balanceObj.decimals = 1;
            } else {
                balanceObj.decimals = "1e+" + erc20Contracts.decimals[index];
            }
            if(balance != 0) {
                erc20Balances.push(balanceObj);
            }
        }
        return erc20Balances;
    }

    async function getERC721Balance(query) {
        let tokenIds = [];
        try {
            let call = await $.get(query);
            let results = call.result;
            for(let result of results) {
                let stillOwned = await getStillOwnedERC721(result.tokenID, result.contractAddress, account);
                if(stillOwned) {
                    tokenIds.push(result.tokenID);
                }
            }
            return tokenIds;
        } catch(e) {
            console.error(e);
        }
    }

    async function getStillOwnedERC721(tokenId, contractAddress) {
        try {
            const contract = new Ethers.Contract(contractAddress, ERC20).connect(provider);
            return await contract.ownerOf(tokenId) === account;
        } catch(e) {
            console.error(e);
        }
    }

    async function getERC20Balance(contractAddress) {
        try {
            const contract = new Ethers.Contract(contractAddress, ERC20).connect(provider);
            return await contract.balanceOf(account);
        } catch(e) {
            console.error(e);
        }
    }

    //get's all the tokens a user has interacted with
    async function getTokensContracts(query) {
        try {
            let tokensObj = {};
            let tokens = [];
            let tokenNames = [];
            let tokenDecimals = [];
            let call = await $.get(query);
            let results = call.result;
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

    function getQueryERC20Events(chainId) {
        switch (chainId) {
            case 1:
                return "https://api.etherscan.io/api?module=account&action=tokentx&address=" + account;
            case 3:
                return "https://ropsten.etherscan.io/api?module=account&action=tokentx&address=" + account;
            case 4:
                return "https://rinkeby.etherscan.io/api?module=account&action=tokentx&address=" + account;
            case 42:
                return "https://kovan.etherscan.io/api?module=account&action=tokentx&address=" + account;
            default:
                return "https://api.etherscan.io/api?module=account&action=tokentx&address=" + account;
        }
    }

    function getQueryERC721Events(chainId) {
        switch (chainId) {
            case 1:
                return "https://api.etherscan.io/api?module=account&action=tokennfttx&address=" + account;
            case 3:
                return "https://ropsten.etherscan.io/api?module=account&action=tokennfttx&address=" + account;
            case 4:
                return "https://rinkeby.etherscan.io/api?module=account&action=tokennfttx&address=" + account;
            case 42:
                return "https://kovan.etherscan.io/api?module=account&action=tokennfttx&address=" + account;
            default:
                return "https://api.etherscan.io/api?module=account&action=tokennfttx&address=" + account;
        }
    }

    function getEtherScanPage(chainId) {
        switch (chainId) {
            case 1:
                return "https://etherscan.io/address/";
            case 3:
                return "https://ropsten.etherscan.io/address/";
            case 4:
                return "https://rinkeby.etherscan.io/address/";
            case 42:
                return "https://kovan.etherscan.io/address/";
            default:
                return "https://etherscan.io/address/";
        }
    }

    function render(balancesMapping) {
        let index = 0;
        for(let balanceObj of balancesMapping) {
            parentElement.append(
                `<div class="grid-container">
                    <div class="grid-items">${balanceObj.name}</div>
                    <div class="grid-items">${parseInt(balanceObj.balance) / parseFloat(balanceObj.decimals)}</div>
                    <div class="grid-items">${balanceObj.type}</div>
                    <div class="grid-items">
                        <button class="btn btn-primary" id="${index}"> Transfer</button>
                    </div>
                </div>`
            );
            const elementId = `#${index}`;
            setOnClick(elementId, balanceObj);
            index++;
        }
    }

    function setOnClick(id, balanceObj) {
        $(id).click(() => {
            const contract = new Ethers.Contract(balanceObj.address, ERC20).connect(provider.getSigner(account));
            contract.transfer(to, balanceObj.balance).then((result) => {
                console.log(result);
            }).catch(console.error);
        })
    }

});

