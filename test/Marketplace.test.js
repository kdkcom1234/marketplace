const { assert } = require("chai");

require("chai")
  .use(require("chai-as-promised"))
  .should();

const Marketplace = artifacts.require("./Marketplace.sol");

// 테스트 체인내의 주소 목록
// [deployer, seller, buyer]
contract("Marketplace", ([deployer, seller, buyer]) => {
  let marketplace;

  before(async () => {
    marketplace = await Marketplace.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await marketplace.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await marketplace.name();
      assert.equal(name, "Dapp University Marketplace");
    });
  });

  describe("product", async () => {
    let result, productCount;

    before(async () => {
      // { from: seller } 누가 실행했는지 넣어주는 데이터
      result = await marketplace.createProduct(
        "iPhone X",
        web3.utils.toWei("1", "Ether"),
        {
          from: seller,
        }
      );
      productCount = await marketplace.productCount();
    });

    it("creates products", async () => {
      // SUCCESS
      assert.equal(productCount, 1);

      //console.log(result.logs);
      const event = result.logs[0].args;
      assert.equal(
        event.id.toNumber(),
        productCount.toNumber(),
        "id is correct"
      );
      assert.equal(event.name, "iPhone X", "name is correct");
      assert.equal(event.price, "1000000000000000000", "price is correct");
      assert.equal(event.owner, seller, "owner is correct");
      assert.equal(event.purchased, false, "purchased is correct");

      // FAILURE: Product must have a name
      await await marketplace.createProduct(
        "",
        web3.utils.toWei("1", "Ether"),
        { from: seller }
      ).should.be.rejected;
      // FAILURE: Product must have a price
      await await marketplace.createProduct("iPhone X", 0, { from: seller })
        .should.be.rejected;
    });
  });
});
