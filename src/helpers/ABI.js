module.exports = {
    ERC20: [
        "function balanceOf(address owner) view returns (uint256)",
        "function transfer(address to, uint amount) returns (bool)",
        "function allowance(address spender, address owner) view returns(uint256)",
        "function approve(address spender, uint amount) returns (bool)"
    ],

    ERC721: [
        "function ownerOf(uint256 _tokenId) external view returns (address)"
    ]
};
