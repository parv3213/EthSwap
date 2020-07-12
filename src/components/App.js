import React, { Component } from "react";
import Web3 from "web3";
import Token from "../abis/Token.json";
import EthSwap from "../abis/EthSwap.json";
import Navbar from "./Navbar";
import "./App.css";

class App extends Component {
	async componentDidMount() {
		await this.loadWeb3();
		await this.loadBlockchainData();
	}

	async loadBlockchainData() {
		const web3 = window.web3;

		// get account
		const accounts = await web3.eth.getAccounts();
		this.setState({ account: accounts[0] });

		// Set EthSwap balance
		const ethBalance = await web3.eth.getBalance(this.state.account);
		this.setState({ ethBalance });

		// Load Network ID
		const networkId = await web3.eth.net.getId();

		// Load Token
		const tokenData = Token.networks[networkId];
		if (tokenData) {
			const token = new web3.eth.Contract(Token.abi, tokenData.address);
			this.setState({ token });
			let tokenBalance = await token.methods.balanceOf(this.state.account).call();
			this.setState({ tokenBalance: tokenBalance.toString() });
		} else {
			window.alert("Token Network not detected");
		}

		// Load EthSwap
		const ethSwapData = EthSwap.networks[networkId];
		if (ethSwapData) {
			const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
			this.setState({ ethSwap });
		} else {
			window.alert("EthSwap Network not detected");
		}
	}

	async loadWeb3() {
		// Modern dapp browsers...
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		}
		// Non-dapp browsers...
		else {
			window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
		}
	}

	// react state
	constructor(props) {
		super(props);
		this.state = {
			account: "",
			token: {},
			ethSwap: {},
			tokenBalance: "0",
			ethBalance: "0",
		};
	}

	render() {
		return (
			<div>
				<Navbar account={this.state.account} />
				<div className="container-fluid mt-5">
					<div className="row">
						<main role="main" className="col-lg-12 d-flex text-center">
							<div className="content mr-auto ml-auto">
								<a href="http://www.dappuniversity.com/bootcamp" target="_blank" rel="noopener noreferrer"></a>
								<h1>Hello World</h1>
							</div>
						</main>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
