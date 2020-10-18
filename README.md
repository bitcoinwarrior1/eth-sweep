# DEX-liquidity-migrator
Find and migrate your liquidity to CoFix

## Requirements

### Remove liquidity from existing platforms
- Find all services that hold the users tokens that are eligible for CoFix and the NEST oracle e.g. Compound DAI, Uniswap USDT:ETH etc
- Find user's native balances that aren't in a DeFi platform but are supported by CoFix and the NEST oracle e.g. USDT
- Allow user to remove the liquidity from the platform 

### Move liquidity to CoFix
- After removing, show a button that allows the user to transfer it into CoFix
- If it is just a native balance like USDT, simply transfer to CoFix
- If it is a service like Compound, withdraw followed by transfer to CoFix
- If it is a service like Uniswap, remove Liquidity from the pool and place each pair one by one into CoFix (TODO see if it is possible to put them in as a pair instead)

NB: CoFix does not require a pair deposit, the user can deposit a single coin into the pool 


