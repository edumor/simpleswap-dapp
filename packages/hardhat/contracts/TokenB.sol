// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/// @title TokenB ERC20 Token
/// @author
/// @notice This contract implements an ERC20 token with burn, mint, pause capabilities, and ownership control.
/// @dev Inherits from OpenZeppelin ERC20, ERC20Burnable, Ownable, and Pausable contracts.
/// @custom:security-contact eduardomoreno2503@gmail.com
contract TokenB is ERC20, ERC20Burnable, Ownable, Pausable {
    /// @notice Allows any user to mint a small amount of tokens to their own address (faucet).
    /// @dev This function is public and can be called by anyone. Intended for testnet use only.
    /// @custom:faucet
    function faucet() public {
        uint256 amount = 1000 * 10 ** decimals(); // 1000 tokens per call
        _mint(msg.sender, amount);
    }
    /// @notice Deploys the TokenB contract and sets the initial owner.
    /// @param initialOwner The address that will be assigned as the contract owner.
    constructor(address initialOwner) ERC20("TokenB", "TKB") Ownable(initialOwner) {}

    /// @notice Mints new tokens to a specified address.
    /// @dev Public faucet: anyone can mint up to 1 token (1e18 wei) per call for themselves.
    /// @param to The address to receive the newly minted tokens.
    /// @param amount The number of tokens to mint.
    function mint(address to, uint256 amount) public {
        address contractOwner = owner(); // Cache owner to avoid multiple reads
        // For testing: allow owner to mint any amount to any address
        if (msg.sender == contractOwner) {
            _mint(to, amount);
        } else {
            require(amount <= 1e18, "max 1 token");
            require(to == msg.sender, "self only");
            _mint(to, amount);
        }
    }

    /// @notice Pauses all token transfers.
    /// @dev Only callable by the contract owner.
    function pause() public onlyOwner {
        _pause();
    }

    /// @notice Unpauses all token transfers.
    /// @dev Only callable by the contract owner.
    function unpause() public onlyOwner {
        _unpause();
    }

    /// @dev Overrides _update to block transfers when paused.
    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        super._update(from, to, value);
    }
}
