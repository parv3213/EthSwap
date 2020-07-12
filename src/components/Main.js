import React, { Component } from "react";
import ethLogo from "../eth-logo.png";
import tokenLogo from "../token-logo.png";

class Main extends Component {
	render() {
		return (
			<div id="content">
				<div className="card mb-4">
					<div className="card-body">
						<form className="mb-5">
							<div>
								<label className="float-left">
									<b>Input</b>
								</label>
								<span className="float-right text-muted">
									Balance: {window.web3.utils.fromWei(this.props.ethBalance, "Ether")}
								</span>
							</div>
							<div className="input-group mb-4">
								<input type="text" placeholder="0" className="form-control form-control-lg" required />
								<div className="input-group-append">
									<div className="input-group-text">
										<img src={ethLogo} height="32" alt="" />
										&nbsp;&nbsp;&nbsp; ETH
									</div>
								</div>
							</div>
							<div>
								<label className="float-left">
									<b>Output</b>
								</label>
								<span className="float-right text-muted">Balance: {this.props.tokenBalance}</span>
							</div>
							<div className="input-group mb-2">
								<input type="text" placeholder="0" className="form-control form-control-lg" disabled />
								<div className="input-group-append">
									<div className="input-group-text">
										<img src={tokenLogo} height="32" alt="" />
										&nbsp; DApp
									</div>
								</div>
							</div>
							<div className="mb-5">
								<span className="float-left text-muted">
									<b>Exchange Rate</b>
								</span>
								<span className="float-right text-muted">1ETH = 100 DApp</span>
							</div>
							<button type="submit" className="btn btn-primary btn-block btn-lg">
								SWAP!
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Main;
