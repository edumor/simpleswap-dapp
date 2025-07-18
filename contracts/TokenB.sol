// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/// @title TokenB ERC20 Token
/// @author Eduardo Moreno
/// @notice This contract implements an ERC20 token with burn, mint, pause capabilities, and ownership control.
/// @dev Inherits from OpenZeppelin ERC20, ERC20Burnable, Ownable, and Pausable contracts.
/// @custom:security-contact eduardomoreno2503@gmail.com
contract TokenB is ERC20, ERC20Burnable, Ownable, Pausable {
    
    /// @notice Error thrown when caller is not the owner
    error NotOwner();
    
    /// @notice Error thrown when contract is paused
    error IsPaused();
    /// @notice Deploys the TokenB contract and sets the initial owner.
    /// @param initialOwner The address that will be assigned as the contract owner.
    constructor(address initialOwner)
        ERC20("TokenB", "TKB")
        Ownable(initialOwner)
    {}

    /// @notice Mints new tokens to a specified address.
    /// @dev Only callable by the contract owner.
    /// @param to The address to receive the newly minted tokens.
    /// @param amount The number of tokens to mint.
    function mint(address to, uint256 amount) public {
        if (msg.sender != owner()) revert NotOwner();
        _mint(to, amount);
    }

    /// @notice Pauses all token transfers.
    /// @dev Only callable by the contract owner.
    function pause() public {
        if (msg.sender != owner()) revert NotOwner();
        _pause();
    }

    /// @notice Unpauses all token transfers.
    /// @dev Only callable by the contract owner.
    function unpause() public {
        if (msg.sender != owner()) revert NotOwner();
        _unpause();
    }

    /// @notice Internal function that handles token transfers with pause functionality.
    /// @dev Overrides _update to block transfers when paused.
    /// @param from The address tokens are transferred from (zero address for minting).
    /// @param to The address tokens are transferred to (zero address for burning).
    /// @param value The amount of tokens to transfer.
    function _update(address from, address to, uint256 value) internal override {
        if (paused()) revert IsPaused();
        super._update(from, to, value);
    }
}