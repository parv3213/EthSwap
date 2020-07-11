const { default: Web3 } = require("web3");
const { assert } = require("chai");

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");
require("chai")
	.use(require("chai-as-promised"))
	.should();

const tokens = (n) => {
	return web3.utils.toWei(n, "ether");
};

contract("EthSwap", ([deployer, investor]) => {
	let token, ethSwap;

	before(async () => {
		token = await Token.new();
		ethSwap = await EthSwap.new(token.address);
		// Transfer all the tokens to EthSwap (1 M)
		await token.transfer(ethSwap.address, tokens("1000000"));
	});

	describe("Token Deployement", async () => {
		it("Contract has a name", async () => {
			const name = await token.name();
			assert.equal(name, "DApp Token");
		});
	});

	describe("EthSwap Deployement", async () => {
		it("Contract has a name", async () => {
			const name = await ethSwap.name();
			assert.equal(name, "EthSwap Instant Exchange");
		});

		it("Contract has tokens", async () => {
			const balance = await token.balanceOf(ethSwap.address);
			assert.equal(balance.toString(), tokens("1000000"));
		});
	});

	describe("buyTokens()", async () => {
		let result;

		before(async () => {
			// Purchase before each example
			result = await ethSwap.buyTokens({ from: investor, value: tokens("1") });
		});

		it("Allows users to instatly buy token from ethSwap for a fixed price", async () => {
			// Check Investor balance
			let inverstorBalance = await token.balanceOf(investor);
			assert.equal(inverstorBalance.toString(), tokens("100"));

			// Check ethSwap balance
			let ethSwapBalance;
			ethSwapBalance = await token.balanceOf(ethSwap.address);
			assert.equal(ethSwapBalance.toString(), tokens("999900"));
			ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
			assert.equal(ethSwapBalance.toString(), tokens("1"));

			// Check the event details
			const event = result.logs[0].args;
			assert.equal(event.account, investor);
			assert.equal(event.token, token.address);
			assert.equal(event.amount.toString(), tokens("100"));
			assert.equal(event.rate.toString(), "100");
		});
	});

	describe("sellTokens()", async () => {
		let result;

		before(async () => {
			// Investor must approve the purchase
			await token.approve(ethSwap.address, tokens("100"), { from: investor });
			result = await ethSwap.sellTokens(tokens("100"), { from: investor });
		});
		it("Allows users to instantly sell tokens to ethSwap for a fixed price", async () => {
			let inverstorBalance = await token.balanceOf(investor);
			assert.equal(inverstorBalance.toString(), tokens("0"));

			// Check ethSwap balance
			let ethSwapBalance;
			ethSwapBalance = await token.balanceOf(ethSwap.address);
			assert.equal(ethSwapBalance.toString(), tokens("1000000"));
			ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
			assert.equal(ethSwapBalance.toString(), tokens("0"));

			// Check the event details
			const event = result.logs[0].args;
			assert.equal(event.account, investor);
			assert.equal(event.token, token.address);
			assert.equal(event.amount.toString(), tokens("100"));
			assert.equal(event.rate.toString(), "100");

			// Failure: inverstors cannot sell more tokens than they have
			await ethSwap.sellTokens(tokens("500"), { from: investor }).should.be.rejected;
		});
	});
});
