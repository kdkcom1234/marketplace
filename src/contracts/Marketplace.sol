pragma solidity ^0.5.0;

contract Marketplace {
  string public name;

  uint public productCount = 0;
  mapping(uint => Product) public products;

  struct Product {
    uint id;
    string name;
    uint price;
    address owner;
    bool purchased;
  }

  event ProductCreated(
    uint id,
    string name,
    uint price,
    address owner,
    bool purchased
);

  constructor() public {
    name = "Dapp University Marketplace";
  }
  
  function createProduct(string memory _name, uint _price) public {
    // make sure parameters are correct
    // Require a valid name
    require(bytes(_name).length > 0);
    // Require a valid price
    require(_price > 0);

    // increment Productcount
    productCount ++;

    // create the product
    // msg.sender: 함수 실행자
    products[productCount] = Product(productCount, _name, _price, msg.sender, false);
    
    // trigger an event
    emit ProductCreated(productCount, _name, _price, msg.sender, false);

  }
}