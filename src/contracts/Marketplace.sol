pragma solidity ^0.5.0;

contract Marketplace {
  string public name;

  uint public productCount = 0;
  mapping(uint => Product) public products;

  struct Product {
    uint id;
    string name;
    uint price;
    address payable owner;
    bool purchased;
  }

  event ProductCreated(
    uint id,
    string name,
    uint price,
    address payable owner,
    bool purchased
  );

  event ProductPurchased(
    uint id,
    string name,
    uint price,
    address payable owner,
    bool purchased
  );  

  constructor() public {
    name = "Dapp University Marketplace";
  }
  
  // public: 외부에서 함수 액세스 가능하게
  // memory: storage에 내용을 저장하지 않고 함수 내부에서만 사용, gas 절약
  function createProduct(string memory _name, uint _price) public {
    // make sure parameters are correct
    // Require a valid name
    require(bytes(_name).length > 0);
    // Require a valid price
    require(_price > 0);

    // increment Productcount
    // 제품 id로 사용
    productCount ++;

    // create the product
    // msg.sender: 함수 실행자
    products[productCount] = Product(productCount, _name, _price, msg.sender, false);
    
    // trigger an event
    emit ProductCreated(productCount, _name, _price, msg.sender, false);
  }

  // function payable: 함수에서 msg.value를 사용하고 싶다면 적어야함
  function purchaseProduct(uint _id) public payable {

    // -- FETCHING DATA --
    // Fetch the product
    Product memory _product = products[_id];
    // Fetch the owner
    // address payable: 이더를 전송할 수 있는 send(), trasfer()를 사용하기 위함 
    address payable  _seller = _product.owner;

    // -- VALIDATION LOGIC --
    // Make sure the product has a valid id
    require(_product.id > 0 && _product.id <= productCount);
    // Require that there is enough Ether in the transaction
    require(msg.value >= _product.price);
    // Require that the product has not been purchased already
    require(!_product.purchased);
    // Require that the buyer is not the seller
    require(_seller != msg.sender);    
    
    // -- PURCHASE LOGIC --
    // **(중요)Transfer ownership to the buyer
    _product.owner = msg.sender;
    // Mark as purchased
    _product.purchased = true;
    // Update the product
    products[_id] = _product;
    // **(중요)Pay the seller by sending the Ether
    address(_seller).transfer(msg.value);

    // Trigger an event
    emit ProductPurchased(_id, _product.name, _product.price, msg.sender, true);    
  }
}