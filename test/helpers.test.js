const { parseEther } = require("@ethersproject/units");
const { expect } = require("chai/index");
const Helpers = require('../src/helpers/helpers');
const { ethers } = require('ethers');
const { nullAddress } = require("../src/helpers/constants");

describe("helper tests", () => {

    before(() => {
        this.helpers = new Helpers(
           new ethers.providers.InfuraProvider("mainnet"),
            "0x42ea529282DDE0AA87B42d9E83316eb23FE62c3f",
           "&apikey=ANVBH7JCNH1BVHJ1NPB5FH1WKP5C6YSYJW",
           "0x9F885908bF9DF0d083245Ac34F39a28b493136be",
           1
       );
       this.balanceObj = {
            address: "0x6b175474e89094c44da98b954eedeac495271d0f",
            balance: parseEther("1")
        };
    });

    it("gets all erc20 tokens", async () => {
        const erc20Tokens = await this.helpers.getERC20Tokens();
        expect(erc20Tokens.tokenNames.length > 0);
        expect(erc20Tokens.decimals.includes("18"));
        expect(erc20Tokens.contractAddresses.includes("0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"))
    });

    it("gets all erc721 tokens", async () => {
        const erc721Tokens = await this.helpers.getERC721Tokens();
        expect(erc721Tokens.contractAddresses.length > 0);
        expect(!erc721Tokens.decimals.includes("18"));
        expect(erc721Tokens.tokenIds["0x06012c8cf97bead5deae237070f9587f8e7a266d"].length !== 0);
    });

    it("gets all the users tokens properly", async () => {
       const tokens = await this.helpers.getTokenBalances();
       expect(tokens.length > 0);
       expect(tokens[0].decimals !== undefined);
    });

    it("can get a quote from 1inch", async () => {
        const quote = await this.helpers.getQuoteInEth1Inch(this.balanceObj);
        expect(!!quote);
    });

    it("returns an approval address instead of order", async() => {
        const { approvalAddress } = await this.helpers.get1InchTradeData(this.balanceObj);
        expect(approvalAddress === "0x11111112542d85b3ef69ae05771c2dccff4faa26");
    })

});
