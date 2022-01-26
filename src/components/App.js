import React, { Component } from "react";
import "./App.css";
// abi import
import Marketplace from "../abis/Marketplace.json";

import Web3 from "web3";

import Navbar from "./Navbar";
import Main from "./Main";

class App extends Component {
  async loadWeb3() {
    // 지갑 존재여부 체크 및 지갑 연결
    // modern dapp browsers...
    if (window.ethereum) {
      // console.log(window.ethereum);
      // web3.js FE에서 연동 구성
      // web3.js <-> metamask <-> ethereum client <-> ethereum p2p network

      // provider 설정(proxy 또는 websocket)
      window.web3 = new Web3(window.ethereum);
      // window.web3 = new Web3("ws://127.0.0.1:7545");
      // console.log(window.ethereum);

      // // web socket provider 설정
      // const eventProvider = new Web3.providers.WebsocketProvider(
      //   "ws://127.0.0.1:7545"
      // );
      // window.web3.setProvider(eventProvider);

      // 지갑 연결
      //await window.ethereum.enable(); // deprecated
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    }
    // // legacy browser // deprecated
    // else if (window.web3) {
    //   window.web3 = new Web3(window.web3.currentProvider)
    // }
    // non-dapp browsers...
    else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchaninData() {
    const web3 = window.web3;
    // console.log(web3);
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    // const accounts = await web3.eth.getAccounts(); // deprecated
    // console.log(accounts);
    this.setState({ account: accounts[0] });

    // networkId -> ganache: 5777
    const networkId = await web3.eth.net.getId();
    // console.log(networkId);

    // Marketplace.networks[networkId].address
    // 스마트 컨트랙트 주소
    const networkData = Marketplace.networks[networkId];
    if (networkData) {
      // 컨트랙트 객체 가져오기
      const marketplace = web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      // console.log(marketplace);
      this.setState({ marketplace });

      // 컨트랙트의 메서드 호출
      // ** productCount라는 변수의 값 조회
      const productCount = await marketplace.methods.productCount().call();
      this.setState({ productCount });
      // console.log(productCount.toString());

      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        this.setState({
          products: [...this.state.products, product],
        });
      }

      this.setState({ loading: false });
    } else {
      window.alert("Marketplace contract not deployed to detected network.");
    }
  }

  createProduct(name, price) {
    // 컨트랙트의 메서드 호출
    // send({from}) => msg.sender
    // this.setState({ loading: true });
    this.state.marketplace.methods
      .createProduct(name, price)
      .send({ from: this.state.account });
    // .once("receipt", (receipt) => {
    //   this.setState({ loading: false });
    // });

    // this.state.marketplace.events.ProductCreated({}, (error, data) => {
    //   if (error) console.log("Error: " + error);
    //   else console.log("Log data: " + data);
    // });
  }

  purchaseProduct(id, price) {
    // this.setState({ loading: true });
    this.state.marketplace.methods
      .purchaseProduct(id)
      .send({ from: this.state.account, value: price });
    // .once("receipt", (receipt) => {
    //   this.setState({ loading: false });
    // });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      products: [],
      loading: true,
    };

    this.createProduct = this.createProduct.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchaninData();
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <main
          role="main"
          className="col-lg-12 d-flex"
          style={{ marginTop: "40px" }}
        >
          {this.state.loading ? (
            <div id="loader" className="text-center">
              <p className="text-center">Loading...</p>
            </div>
          ) : (
            <Main
              account={this.state.account}
              products={this.state.products}
              createProduct={this.createProduct}
              purchaseProduct={this.purchaseProduct}
            />
          )}
        </main>
      </div>
    );
  }
}

export default App;
