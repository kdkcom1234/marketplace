import React, { Component } from "react";
import logo from "../logo.png";
import "./App.css";
// abi import
import Marketplace from "../abis/Marketplace.json";

import Web3 from "web3";
import Navbar from "./Navbar";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      products: [],
      loading: true,
    };
  }

  async loadWeb3() {
    // 지갑 존재여부 체크 및 지갑 연결
    // modern dapp browsers...
    if (window.ethereum) {
      // console.log(window.ethereum);
      // web3.js FE에서 연동 구성
      // web3.js <-> metamask <-> ethereum client <-> ethereum p2p network

      // provider 설정(proxy 또는 websocket)
      window.web3 = new Web3(window.ethereum);

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
    // : smart contract address
    const networkData = Marketplace.networks[networkId];
    if (networkData) {
      const marketplace = web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      console.log(marketplace);
    } else {
      window.alert("Marketplace contract not deployed to detected network.");
    }
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchaninData();
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN{" "}
                  <u>
                    <b>NOW! </b>
                  </u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
