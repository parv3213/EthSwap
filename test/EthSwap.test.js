const { assert } = require('chai');

const Token = artifacts.require('Token');
const EthSwap = artifacts.require('EthSwap');

require('chai')
	.use(require('chai-as-promised'))
	.should();

contract('EthSwap', (accounts) => {
	describe('EthSwap Deployement', async () => {
		it('Contract has a name', async () => {
			let ethSwap = await EthSwap.new();
			const name = await ethSwap.name();
			assert.equal(name, 'EthSwap Instant Exchange');
		});
	});
});
