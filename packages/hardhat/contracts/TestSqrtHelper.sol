// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SimpleSwapVerifier.sol";

/**
 * @title TestSqrtHelper
 * @notice Helper contract to test internal _sqrt function
 */
contract TestSqrtHelper {
    /**
     * @dev Public wrapper for _sqrt function to enable testing
     * @param y The number for which to calculate the square root
     * @return z The integer square root of y
     */
    function testSqrt(uint256 y) external pure returns (uint256 z) {
        return _sqrt(y);
    }

    /**
     * @dev Internal function to calculate the integer square root of a number
     * Used for liquidity calculation
     * @param y The number for which to calculate the square root
     * @return z The integer square root of y
     */
    function _sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
