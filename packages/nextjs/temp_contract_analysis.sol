// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleSwap
 * @notice An optimized automated market maker (AMM) for token swapping without fees
 * @dev Implements constant product formula x * y = k without any fees using structs for gas optimization.
 * This contract allows users to add/remove liquidity and swap between two tokens using single storage access per function.
 * @author Eduardo Moreno - Optimized Version
 * @custom:security-contact eduardomoreno2503@gmail.com
 */
contract SimpleSwap {

    /// @notice Struct to store all reserve and liquidity data for a trading pair
    /// @dev Packs related data together to minimize storage slots and gas costs
    struct PairData {
        uint256 reserveA;           /// @dev Reserve amount of tokenA in the pair
        uint256 reserveB;           /// @dev Reserve amount of tokenB in the pair  
        uint256 totalLiquidity;     /// @dev Total liquidity tokens issued for this pair
    }

    /// @notice Struct to cache storage values during function execution
    /// @dev Used to minimize storage reads/writes within functions by loading data once
    struct LocalPairData {
        uint256 reserveA;           /// @dev Local cache of tokenA reserve
        uint256 reserveB;           /// @dev Local cache of tokenB reserve
        uint256 totalLiquidity;     /// @dev Local cache of total liquidity
        bool isFirstProvision;      /// @dev Flag indicating if this is the first liquidity provision
    }

    /// @notice Maps a deterministic token pair hash to its PairData
    /// @dev Uses keccak256(abi.encodePacked(tokenA, tokenB)) as key for deterministic ordering
    /// to ensure that a pair (tokenA, tokenB) always maps to the same data regardless of input order
    mapping(bytes32 => PairData) public pairs;

    /// @notice Stores liquidity token balances for each user in each pair
    /// @dev Maps pair hash => user address => liquidity balance
    mapping(bytes32 => mapping(address => uint256)) public liquidityBalances;

    /// @notice Emitted when tokens are swapped
    /// @param tokenIn The address of the token sent into the swap
    /// @param tokenOut The address of the token received from the swap
    /// @param amountIn The amount of tokenIn that was swapped
    /// @param amountOut The amount of tokenOut that was received
    event Swap(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);

    /// @notice Emitted when liquidity is added or removed from a pair
    /// @param tokenA The address of the first token in the pair
    /// @param tokenB The address of the second token in the pair
    /// @param amountA The amount of tokenA involved in the liquidity action
    /// @param amountB The amount of tokenB involved in the liquidity action
    /// @param liquidity The amount of liquidity tokens minted (if added) or burned (if removed)
    /// @param isAdded True if liquidity was added, false if removed
    event LiquidityAction(address indexed tokenA, address indexed tokenB, uint256 amountA, uint256 amountB, uint256 liquidity, bool isAdded);

    /**
     * @notice Internal function to get a deterministic hash for a token pair
     * @dev Ensures consistent ordering of token addresses (tokenA < tokenB) before hashing
     * to guarantee the same hash for (A, B) and (B, A)
     * @param tokenA Address of the first token
     * @param tokenB Address of the second token
     * @return pairHash The keccak256 hash of the ordered token addresses
     * @return reversed True if tokenA and tokenB were reversed to maintain order, false otherwise
     */
    function _getPairHash(address tokenA, address tokenB) public pure returns (bytes32 pairHash, bool reversed) {
        if (tokenA < tokenB) {
            return (keccak256(abi.encodePacked(tokenA, tokenB)), false);
        } else {
            return (keccak256(abi.encodePacked(tokenB, tokenA)), true);
        }
    }

    /**
     * @notice Internal function to load pair data from storage into a LocalPairData struct
     * @dev Reads all relevant pair data in a single storage access to minimize gas costs
     * Handles token order reversal for consistent data loading
     * @param tokenA Address of the first token
     * @param tokenB Address of the second token
     * @return localData A LocalPairData struct containing the reserves, total liquidity, and first provision status
     * @return pairHash The deterministic hash of the token pair
     * @return reversed True if tokenA and tokenB were reversed during hash calculation
     */
    function _loadPairData(address tokenA, address tokenB) internal view returns (LocalPairData memory localData, bytes32 pairHash, bool reversed) {
        (pairHash, reversed) = _getPairHash(tokenA, tokenB);
        PairData storage pairData = pairs[pairHash]; // Single storage read

        // Populate localData based on original or reversed order
        if (reversed) {
            localData = LocalPairData({
                reserveA: pairData.reserveB,
                reserveB: pairData.reserveA,
                totalLiquidity: pairData.totalLiquidity,
                isFirstProvision: pairData.totalLiquidity == 0
            });
        } else {
            localData = LocalPairData({
                reserveA: pairData.reserveA,
                reserveB: pairData.reserveB,
                totalLiquidity: pairData.totalLiquidity,
                isFirstProvision: pairData.totalLiquidity == 0
            });
        }
    }

    /**
     * @notice Internal function to save updated pair data from a LocalPairData struct to storage
     * @dev Updates all relevant pair data in a single storage write to minimize gas costs
     * Handles token order reversal to save data consistently
     * @param pairHash The deterministic hash of the token pair
     * @param reversed True if tokenA and tokenB were reversed during hash calculation
     * @param localData A LocalPairData struct containing the updated reserves and total liquidity
     */
    function _savePairData(bytes32 pairHash, bool reversed, LocalPairData memory localData) internal {
        PairData storage pairData = pairs[pairHash]; // Single storage write
        
        // Save data back to storage, respecting the original order
        if (reversed) {
            pairData.reserveA = localData.reserveB;
            pairData.reserveB = localData.reserveA;
        } else {
            pairData.reserveA = localData.reserveA;
            pairData.reserveB = localData.reserveB;
        }
        pairData.totalLiquidity = localData.totalLiquidity;
    }

    /**
     * @notice Internal function to calculate the amount of liquidity tokens to mint
     * @dev For the first liquidity provision, it uses the square root of the product of amounts
     * For subsequent provisions, it calculates the proportional liquidity based on existing reserves
     * @param amountA The amount of the first token being added
     * @param amountB The amount of the second token being added
     * @param localData The current LocalPairData containing reserves and total liquidity
     * @return The calculated amount of liquidity tokens to mint
     */
    function _calculateLiquidity(
        uint256 amountA,
        uint256 amountB,
        LocalPairData memory localData
    ) internal pure returns (uint256) {
        if (localData.isFirstProvision) {
            // First liquidity provision: liquidity is sqrt(amountA * amountB)
            return _sqrt(amountA * amountB);
        }
        // Subsequent liquidity provision: calculate proportional liquidity
        return _min(
            (amountA * localData.totalLiquidity) / localData.reserveA,
            (amountB * localData.totalLiquidity) / localData.reserveB
        );
    }

    /**
     * @notice Adds liquidity to a token pair pool
     * @dev Transfers `amountADesired` and `amountBDesired` from `msg.sender` to the contract,
     * calculates the liquidity tokens to mint, updates reserves, and emits a `LiquidityAction` event
     * Requires `amountADesired` and `amountBDesired` to be at least `amountAMin` and `amountBMin` respectively
     * @param tokenA Address of the first token
     * @param tokenB Address of the second token
     * @param amountADesired Amount of first token to add
     * @param amountBDesired Amount of second token to add
     * @param amountAMin Minimum amount of first token to add, to prevent front-running
     * @param amountBMin Minimum amount of second token to add, to prevent front-running
     * @param to Address that will receive the liquidity tokens
     * @param deadline Maximum timestamp until which the transaction is valid
     * @return amountA The actual amount of first token added
     * @return amountB The actual amount of second token added
     * @return liquidity The amount of liquidity tokens minted
     */
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        require(block.timestamp <= deadline, "expired");
        require(amountADesired >= amountAMin && amountBDesired >= amountBMin, "min amt");

        (LocalPairData memory data, bytes32 hash, bool rev) = _loadPairData(tokenA, tokenB);
        
        liquidity = _calculateLiquidity(amountADesired, amountBDesired, data);

        _transferFrom(tokenA, msg.sender, address(this), amountADesired);
        _transferFrom(tokenB, msg.sender, address(this), amountBDesired);

        // Update reserves and total liquidity in local data
        data.reserveA += amountADesired;
        data.reserveB += amountBDesired;
        data.totalLiquidity += liquidity;

        _savePairData(hash, rev, data);
        liquidityBalances[hash][to] += liquidity;

        emit LiquidityAction(tokenA, tokenB, amountADesired, amountBDesired, liquidity, true);
        return (amountADesired, amountBDesired, liquidity);
    }

    /**
     * @notice Removes liquidity from a token pair pool
     * @dev Burns `liquidity` tokens from `msg.sender` and transfers proportional amounts of `tokenA` and `tokenB`
     * back to the `to` address. Updates reserves and total liquidity, and emits a `LiquidityAction` event
     * Requires the received amounts to be at least `amountAMin` and `amountBMin`
     * @param tokenA Address of the first token
     * @param tokenB Address of the second token
     * @param liquidity Amount of liquidity tokens to burn
     * @param amountAMin Minimum amount of first token to receive, to prevent front-running
     * @param amountBMin Minimum amount of second token to receive, to prevent front-running
     * @param to Address that will receive the tokens
     * @param deadline Maximum timestamp until which the transaction is valid
     * @return amountA The actual amount of first token returned
     * @return amountB The actual amount of second token returned
     */
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB) {
        require(block.timestamp <= deadline, "expired");
        
        // Load data once to check liquidity balance before further calculations
        (LocalPairData memory data, bytes32 hash, bool rev) = _loadPairData(tokenA, tokenB);
        require(liquidityBalances[hash][msg.sender] >= liquidity, "insuf liq");

        amountA = (liquidity * data.reserveA) / data.totalLiquidity;
        amountB = (liquidity * data.reserveB) / data.totalLiquidity;
        require(amountA >= amountAMin && amountB >= amountBMin, "min amt");

        // Update reserves and total liquidity in local data
        data.reserveA -= amountA;
        data.reserveB -= amountB;
        data.totalLiquidity -= liquidity;

        _savePairData(hash, rev, data);
        liquidityBalances[hash][msg.sender] -= liquidity;

        _transfer(tokenA, to, amountA);
        _transfer(tokenB, to, amountB);

        emit LiquidityAction(tokenA, tokenB, amountA, amountB, liquidity, false);
    }

    /**
     * @notice Swaps an exact amount of input tokens for output tokens
     * @dev Transfers `amountIn` of `path[0]` from `msg.sender` to the contract,
     * calculates the output amount of `path[1]`, transfers `amountOut` to `to` address,
     * updates reserves, and emits a `Swap` event
     * Requires `amountOut` to be at least `amountOutMin`
     * @param amountIn Amount of input tokens to swap
     * @param amountOutMin Minimum amount of output tokens to receive, to prevent front-running
     * @param path Array containing [tokenIn, tokenOut] addresses
     * @param to Address that will receive the output tokens
     * @param deadline Maximum timestamp until which the transaction is valid
     */
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external {
        require(block.timestamp <= deadline, "expired");
        require(path.length == 2, "bad path");

        // Load data once
        (LocalPairData memory data, bytes32 hash, bool rev) = _loadPairData(path[0], path[1]);
        
        // Load pair data and calculate output without any fees



        // No fees applied - using direct amountIn for AMM calculation

        uint256 amountOut = getAmountOut(amountIn, data.reserveA, data.reserveB);
        require(amountOut >= amountOutMin, "min out");

        _transferFrom(path[0], msg.sender, address(this), amountIn);

        // Update reserves in local data
        data.reserveA += amountIn; // Add input amount to reserves
        data.reserveB -= amountOut;

        _savePairData(hash, rev, data);
        _transfer(path[1], to, amountOut);

        emit Swap(path[0], path[1], amountIn, amountOut);
    }

    /**
     * @notice Gets the current price of tokenA in terms of tokenB
     * @dev Calculates the price based on the current reserves of the pair
     * The price is returned as a fixed-point number with 18 decimal places (wei equivalent)
     * @param tokenA Address of the first token
     * @param tokenB Address of the second token
     * @return price Price of tokenA in terms of tokenB, scaled by 1e18
     */
    function getPrice(address tokenA, address tokenB) external view returns (uint256 price) {
        (LocalPairData memory data,,) = _loadPairData(tokenA, tokenB);
        // Ensure reserves are not zero to prevent division by zero
        require(data.reserveA > 0, "zero reserve");
        return (data.reserveB * 1e18) / data.reserveA;
    }

    /**
     * @notice Gets the current reserve amounts for a token pair
     * @dev Retrieves the amounts of tokenA and tokenB held in the contract's reserves for a given pair
     * @param tokenA Address of the first token
     * @param tokenB Address of the second token
     * @return reserveA The current reserve amount of the first token
     * @return reserveB The current reserve amount of the second token
     */
    function getReserves(address tokenA, address tokenB) external view returns (uint256 reserveA, uint256 reserveB) {
        (LocalPairData memory data,,) = _loadPairData(tokenA, tokenB);
        return (data.reserveA, data.reserveB);
    }

    /**
     * @notice Calculates the output amount for a swap given an input amount and current reserves
     * @dev Implements the constant product formula (x * y = k) to determine the amount of output tokens
     * received for a given amount of input tokens
     * @param amountIn Amount of input tokens
     * @param reserveIn Reserve of the input token
     * @param reserveOut Reserve of the output token
     * @return amountOut Amount of output tokens to receive
     */
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256) {
        require(amountIn > 0, "bad amt");
        require(reserveIn > 0, "bad amt");
        require(reserveOut > 0, "bad amt");
        return (amountIn * reserveOut) / (reserveIn + amountIn);
    }

    /**
     * @dev Internal function to handle `transferFrom` operations for ERC-20 tokens
     * Assumes the `token` address is a valid ERC-20 contract
     * @param token The address of the ERC-20 token contract
     * @param from The address from which tokens are transferred
     * @param to The address to which tokens are transferred
     * @param amount The amount of tokens to transfer
     */
    function _transferFrom(address token, address from, address to, uint256 amount) internal {
        (bool success,) = token.call(
            abi.encodeWithSignature("transferFrom(address,address,uint256)", from, to, amount)
        );
        require(success, "tf fail");
    }

    /**
     * @dev Internal function to handle `transfer` operations for ERC-20 tokens
     * Assumes the `token` address is a valid ERC-20 contract
     * @param token The address of the ERC-20 token contract
     * @param to The address to which tokens are transferred
     * @param amount The amount of tokens to transfer
     */
    function _transfer(address token, address to, uint256 amount) internal {
        (bool success,) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", to, amount)
        );
        require(success, "t fail");
    }

    /**
     * @dev Internal function to calculate the integer square root of a number
     * Used for initial liquidity calculation
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

    /**
     * @dev Internal function to return the minimum of two unsigned integers
     * @param x The first number
     * @param y The second number
     * @return The smaller of x and y
     */
    function _min(uint256 x, uint256 y) internal pure returns (uint256) {
        return x < y ? x : y;
    }
}
