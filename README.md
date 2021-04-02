# eth-sweep
A simple web tool that allows you to sweep your wallet of ETH, erc20 & erc721 tokens. 

## Features 
* Send all your ETH
* Send all your ERC20 tokens 
* Send all your ERC721 tokens 
* Migrate your ETH to layer 2 (zksync)
* Migrate approved tokens to layer 2 (zksync)
* Swap your tokens for ETH

## Limitations 
* If you deposit tokens somewhere they will not be visible unless they themselves are tokenised e.g. cDAI
* Sending all your eth should be done after the tokens are swept as it is impossible to exactly calculate how much eth you will need in gas fees. 

## Resources
* [ZkSync Layer 2 wallet](https://wallet.zksync.io/) (Used as the layer 2 solution when migrating tokens/ETH)
* [1Inch exchange](https://1inch.exchange/) (The DEX used to swap tokens for ETH)
