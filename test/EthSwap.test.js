const { default: Web3 } = require("web3");

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");
require("chai")
	.use(require("chai-as-promised"))
	.should();

const tokens = (n) => {
	return web3.utils.toWei(n, "ether");
};

contract("EthSwap", (accounts) => {
	let token, ethSwap;

	before(async () => {
		token = await Token.new();
		ethSwap = await EthSwap.new();
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
});
