const Ethers = require('ethers');
const provider = new Ethers.providers.Web3Provider(web3.currentProvider);
const { ERC20, ERC721 } = require("./ABI");
let account = null;
let chainId = null;
let to = null;
const APIKeyString = "&apikey=ANVBH7JCNH1BVHJ1NPB5FH1WKP5C6YSYJW";

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
        let erc20TokensObj = await getERC20Tokens();
        let erc721TokensObj = await getERC721Tokens();
        let erc20Balances = await getAllERC20Balances(erc20TokensObj);
        let erc721Balances = await getAllERC721Balances(erc721TokensObj);
        return Object.assign(erc20Balances, erc721Balances);
    }

    function uniq(a) {
        let seen = {};
        return a.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }

    async function getAllERC721Balances(tokensObj) {
        let erc721Balances = [];
        let contracts = uniq(tokensObj.contractAddresses);
        let names = uniq(tokensObj.tokenNames);
        for(let index in contracts) {
            for(let tokenId of tokensObj.tokenIds[contracts[index]]) {
                let stillOwned = await getStillOwnedERC721(tokenId, contracts[index]);
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

    async function getStillOwnedERC721(tokenId, contractAddress) {
        try {
            const contract = new Ethers.Contract(contractAddress, ERC721).connect(provider);
            let owner = await contract.ownerOf(tokenId);
            let stillOwned = owner.toLowerCase() === account.toLowerCase();
            return stillOwned;
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
    async function getERC20Tokens() {
        let erc20Query = getQueryERC20Events(chainId, account);
        try {
            let tokensObj = {};
            let tokens = [];
            let tokenNames = [];
            let tokenDecimals = [];
            let call = await $.get(erc20Query);
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

    //get's all the tokens a user has interacted with
    async function getERC721Tokens() {
        let erc721Query = getQueryERC721Events(chainId, account);
        try {
            let tokensObj = {};
            let tokens = [];
            let tokenNames = [];
            let tokenDecimals = [];
            let tokenIds = {}; // NB: this must be checked to see if still owned
            let call = await $.get(erc721Query);
            let results = call.result;
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

    function getQueryERC20Events(chainId) {
        switch (chainId) {
            case 1:
                return "https://api.etherscan.io/api?module=account&action=tokentx&address=" + account + APIKeyString;
            case 3:
                return "https://ropsten.etherscan.io/api?module=account&action=tokentx&address=" + account + APIKeyString;
            case 4:
                return "https://rinkeby.etherscan.io/api?module=account&action=tokentx&address=" + account + APIKeyString;
            case 42:
                return "https://kovan.etherscan.io/api?module=account&action=tokentx&address=" + account + APIKeyString;
            default:
                return "https://api.etherscan.io/api?module=account&action=tokentx&address=" + account + APIKeyString;
        }
    }

    function getQueryERC721Events(chainId) {
        switch (chainId) {
            case 1:
                return "https://api.etherscan.io/api?module=account&action=tokennfttx&address=" + account + APIKeyString;
            case 3:
                return "https://ropsten.etherscan.io/api?module=account&action=tokennfttx&address=" + account + APIKeyString;
            case 4:
                return "https://rinkeby.etherscan.io/api?module=account&action=tokennfttx&address=" + account + APIKeyString;
            case 42:
                return "https://kovan.etherscan.io/api?module=account&action=tokennfttx&address=" + account + APIKeyString;
            default:
                return "https://api.etherscan.io/api?module=account&action=tokennfttx&address=" + account + APIKeyString;
        }
    }

    function render(balancesMapping) {
        let index = 0;
        for(let balanceObj of balancesMapping) {
            let balance = balanceObj.balance;
            if(balanceObj.type === "ERC20") {
                balance = parseInt(balanceObj.balance) / parseFloat(balanceObj.decimals);
            }
            parentElement.append(
                `<div class="grid-container">
                    <div class="grid-items">${balanceObj.name}</div>
                    <div class="grid-items">${balance}</div>
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

