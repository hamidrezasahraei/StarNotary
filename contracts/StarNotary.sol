// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {

    struct Star{
        string name;
    }
    
    mapping (uint256 => Star) public tokenIdToStarInfo;
    mapping (uint256 => uint256) public starsForSale;

    constructor() ERC721("Star Notary Token", "SNT") {}

    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);
        tokenIdToStarInfo[_tokenId] = newStar;
        _mint(msg.sender, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 price)  public {
        require(ownerOf(_tokenId) == msg.sender);
        starsForSale[_tokenId] = price;
    }

    // Function that allows you to convert an address into a payable address
    function _make_payable(address x) internal pure returns (address payable) {
        return payable(x);
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value >= starCost, "You need to have enough Ether");
        transferFrom(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        address payable ownerAddressPayable = _make_payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
        if(msg.value > starCost) {
            address payable buyerAddressPayable = payable(msg.sender);
            buyerAddressPayable.transfer(msg.value - starCost);
        }
    }

    function lookUptokenIdToStarInfo (uint _tokenId) public view returns (Star memory) {
        //1. You should return the Star saved in tokenIdToStarInfo mapping
        return tokenIdToStarInfo[_tokenId];
    }

    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        //1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        //2. You don't have to check for the price of the token (star)
        //3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId2)
        //4. Use _transferFrom function to exchange the tokens.
        require(ownerOf(_tokenId1) == msg.sender || ownerOf(_tokenId2) == msg.sender, "You must own one of the stars!");
        if(ownerOf(_tokenId1) == msg.sender) {
            address targetAddress = ownerOf(_tokenId2);
            transferFrom(msg.sender, targetAddress, _tokenId1);
            transferFrom(targetAddress, msg.sender, _tokenId2);
        } else {
            address targetAddress = ownerOf(_tokenId1);
            transferFrom(targetAddress, msg.sender, _tokenId1);
            transferFrom(msg.sender, targetAddress, _tokenId2);
        }
    }

    function transferStar(address _to1, uint256 _tokenId) public {
        //1. Check if the sender is the ownerOf(_tokenId)
        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        require(ownerOf(_tokenId) == msg.sender);
        transferFrom(msg.sender, _to1, _tokenId);
    }
}