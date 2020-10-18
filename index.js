const Ethers = require('ethers');
const provider = new Ethers.providers.Web3Provider(web3.currentProvider);
const { ERC20 } = require("./ABI");
let account = null;
let chainId = null;
let transactionObjectsBatched = null;

$(() => {

    const parentElement = $('#results');

    window.ethereum.enable().then((accounts) => {
        account = accounts[0];
        chainId = window.ethereum.getChainId();
        init();
    }).catch((err) => {
        alert(JSON.stringify(err));
    });

    $("#sweepAll").click(() => {

    });

    function init() {

    }

    async function getTokenBalances() {
        let erc20Query = getQueryERC20Events(chainId, account);
        let erc20Contracts = await getTokensContracts(erc20Query);
        let erc721Query = getQueryERC721Events(chainId, account);
        let erc721Contracts = await getTokensContracts(erc721Query);
        let erc20Balances = await getAllERC20Balances(erc20Contracts);
        let erc721Balances = await getAllERC721Balances(erc721Contracts);
        let balancesMapping = Object.assign(erc20Balances, erc721Balances);
        transactionObjectsBatched = getBatchTransactions(balancesMapping)
    }

    function getBatchTransactions(balancesMapping) {

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

    async function getAllERC20Balances(tokenAddresses) {
        let erc20Balances = [];
        for(let tokenAddress of tokenAddresses) {
            let balance = await getERC20Balance(chainId, tokenAddress);
            let balanceObj = {};
            balanceObj.address = tokenAddress;
            balanceObj.balance = balance;
            balanceObj.type = "ERC20";
            erc20Balances.push(balanceObj);
        }
        return erc20Balances;
    }

    async function getERC721Balance(query) {
        let tokenIds = [];
        try {
            let results = await $.get(query).result;
            for(let result of results) {
                let stillOwned = await getStillOwnedERC721(result.tokenID, result.contractAddress, account);
                if(stillOwned) {
                    tokenIds.push(result.tokenID);
                }
            }
            return tokenIds;
        } catch(e) {
            alert(e);
        }
    }

    async function getStillOwnedERC721(tokenId, contractAddress) {
        try {
            const contract = new Ethers.Contract(contractAddress, ERC20, provider);
            return await contract.ownerOf(tokenId) === account;
        } catch(e) {
            alert(e);
        }
    }

    async function getERC20Balance(contractAddress) {
        try {
            const contract = new Ethers.Contract(contractAddress, ERC20, provider);
            return await contract.balanceOf(account);
        } catch(e) {
            alert(e);
        }
    }

    //get's all the tokens a user has interacted with
    async function getTokensContracts(query) {
        try {
            let tokens = [];
            let results = await $.get(query).result;
            for(let result of results) {
                if(!tokens.includes(result.contractAddress)) {
                    tokens.push(result.contractAddress);
                }
            }
            return tokens;
        } catch(e) {
            alert(e);
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

    function render(balancesOfType, type) {
        let keys = Object.keys(balancesOfType);
        for(let key of keys) {
            parentElement.append(
                `<div class="grid-container">
                    <div class="grid-items">${key}</div>
                    <div class="grid-items">${0}</div>
                    <div class="grid-items">
                        <button class="btn btn-primary" id="${key}"> Transfer</button>
                    </div>
                </div>`
            );
            const elementId = `#${key}`;
        }
    }

});

