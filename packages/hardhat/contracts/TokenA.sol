// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title TokenA ERC20 Token
/// @author Eduardo Moreno
/// @notice This contract implements a basic ERC20 token with mint and burn functionality.
/// @dev Inherits from OpenZeppelin ERC20, ERC20Burnable, and Ownable contracts.
/// @custom:security-contact eduardomoreno2503@gmail.com
contract TokenA is ERC20, ERC20Burnable, Ownable {
    /// @notice Allows any user to mint a small amount of tokens to their own address (faucet).
    /// @dev This function is public and can be called by anyone. Intended for testnet use only.
    /// @custom:faucet
    function faucet() public {
        uint256 amount = 1000 * 10**decimals(); // 1000 tokens per call
        _mint(msg.sender, amount);
    }
    /// @notice Deploys the TokenA contract and sets the initial owner.
    /// @param initialOwner The address that will be assigned as the contract owner.
    constructor(address initialOwner)
        ERC20("TokenA", "TKA")
        Ownable(initialOwner)
    {}

    /// @notice Mints new tokens to a specified address.
    /// @dev Public faucet: anyone can mint up to 1 token (1e18 wei) per call for themselves.
    /// @param to The address to receive the newly minted tokens.
    /// @param amount The number of tokens to mint (in wei).
    function mint(address to, uint256 amount) public {
        require(amount <= 1e18, "Max faucet amount is 1 token");
        require(to == msg.sender, "Can only mint to self");
        _mint(to, amount);
    }
}