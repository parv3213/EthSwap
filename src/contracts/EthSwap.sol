pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint256 public rate = 100;

    event TokenPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // Redemption rate = # of token they receive for 1 ether
        // Amount of Ethereum * Redemption rate
        uint256 tokenAmount = msg.value * rate;

        // require that the ethSwap has enough token balance
        require(token.balanceOf(address(this)) >= tokenAmount);

        // transer tokens to user
        token.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }
}
