//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AssestMarket  is ERC721URIStorage {

    address payable owner;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listPrice = 0.01 ether;

    constructor() ERC721("AssestMarket", "ASSM") {
        owner = payable(msg.sender);
    }

    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    mapping(uint256 => ListedToken) private idToListedToken;

    // 1 - Allows the contract owner to update the listing price
    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    // 2 - Mint a new Assest, list it for sale, and set its price

    function createToken(uint256 price) public payable returns (uint) {
        require(msg.value == listPrice, "Send enough ether to list");
        require(price > 0, "Price must be greater than zero");

        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();
        _safeMint(msg.sender, currentTokenId);

        idToListedToken[currentTokenId] = ListedToken(
            currentTokenId,
            payable(msg.sender),
            payable(msg.sender),
            price,
            false
        );

        return currentTokenId;
    }


    
    function createListedToken(uint256 tokenId, uint256 price) public payable {
        require(msg.sender == ownerOf(tokenId), "You are not the owner of this Assest");
        require(price > 0, "Price must be greater than zero");
        require(msg.value == listPrice, "Send enough ether to list");

        // Transfer Assest to contract as escrow
        _transfer(msg.sender, address(this), tokenId);

        // Store Assest details and mark as listed
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(msg.sender), // Owner remains the user
            payable(msg.sender), // Seller is the user listing the Assest
            price,
            true // Mark as listed
        );
    }

    
    // 4 - Retrieve all listed Assests
    function getAllAssest() public view returns (ListedToken[] memory) {
        uint assCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](assCount);

        uint currentIndex = 0;

        for (uint i = 0; i < assCount; i++) {
            uint currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }

        return tokens;
    }

    //   PROFILE PAGE
    // 5 - Retrieve Assests owned or listed by the caller 
    function fetchUserAssest() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        // Get a count of all the Assests that belong to the user
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToListedToken[i + 1].owner == msg.sender || idToListedToken[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        // Once you have the count, create an array then store all the Assests in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToListedToken[i + 1].owner == msg.sender || idToListedToken[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // 6 - Execute the sale of an Assests, transferring ownership and funds
    function executeSale(uint256 tokenId) public payable {
        ListedToken storage item = idToListedToken[tokenId];

        require(item.currentlyListed, "This Assest is not listed for sale");
        require(msg.value == item.price, "Incorrect ETH amount sent");
        require(msg.sender != item.seller, "Seller cannot buy their own Assest");

        // Transfer Assests to the buyer
        _transfer(address(this), msg.sender, tokenId);

        // Transfer funds to the seller
        payable(item.seller).transfer(msg.value);

        // Update Assest ownership
        item.owner = payable(msg.sender);
        item.seller = payable(msg.sender);
        item.currentlyListed = false;

        _itemsSold.increment();

        // Send platform fee to the contract owner
        payable(owner).transfer(listPrice);
    }



    function cancelTrade(uint256 tokenId) public {
        ListedToken storage item = idToListedToken[tokenId];
        require(msg.sender == item.owner, "Only the seller can cancel the trade");
        require(item.currentlyListed, "Assest is not listed");

        // Return Assest to seller
        _transfer(address(this), item.owner, tokenId);

        // Mark as unlisted
        item.currentlyListed = false;
    }


}
