module.exports = {
    ERC20: [
        "function balanceOf(address owner) view returns (uint256)",
        "function transfer(address to, uint amount) returns (bool)",
        "function allowance(address spender, address owner) view returns(uint256)",
        "function approve(address spender, uint amount) returns (bool)"
    ],

    ERC721: [
        "function ownerOf(uint256 _tokenId) external view returns (address)"
    ],

    ZKSYNC: [
        "function depositERC20(address _token, uint104 _amount, address _zkSyncAddress)",
        "function depositETH(address _franklinAddr) payable"
    ]
};
