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
    /// @notice Deploys the TokenA contract and sets the initial owner.
    /// @param initialOwner The address that will be assigned as the contract owner.
    constructor(address initialOwner)
        ERC20("TokenA", "TKA")
        Ownable(initialOwner)
    {}

    /// @notice Mints new tokens to a specified address.
    /// @dev Only callable by the contract owner.
    /// @param to The address to receive the newly minted tokens.
    /// @param amount The number of tokens to mint (in wei).
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}