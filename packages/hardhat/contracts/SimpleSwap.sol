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
    /// @notice Address of the contract owner who can pause/unpause the contract
    address public owner;
    
    /// @notice Flag indicating if the contract is paused for emergency situations
    bool public paused;

    /// @notice Struct to store all reserve and liquidity data for a trading pair
    /// @dev Packs related data together to minimize storage slots and gas costs
    struct PairData {
        uint256 reserveA; /// @dev Reserve amount of tokenA in the pair
        uint256 reserveB; /// @dev Reserve amount of tokenB in the pair
        uint256 totalLiquidity; /// @dev Total liquidity tokens issued for this pair
    }

    /// @notice Struct to cache storage values during function execution
    /// @dev Used to minimize storage reads/writes within functions by loading data once
    struct LocalPairData {
        uint256 reserveA; /// @dev Local cache of tokenA reserve
        uint256 reserveB; /// @dev Local cache of tokenB reserve
        uint256 totalLiquidity; /// @dev Local cache of total liquidity
        bool isFirstProvision; /// @dev Flag indicating if this is the first liquidity provision
    }

    /// @notice Struct for addLiquidity function parameters
    /// @dev Groups related parameters to reduce function signature complexity
    struct AddLiquidityParams {
        address tokenA; /// @dev Address of the first token
        address tokenB; /// @dev Address of the second token
        uint256 amountADesired; /// @dev Desired amount of tokenA to add
        uint256 amountBDesired; /// @dev Desired amount of tokenB to add
        uint256 amountAMin; /// @dev Minimum amount of tokenA to add (slippage protection)
        uint256 amountBMin; /// @dev Minimum amount of tokenB to add (slippage protection)
        address to; /// @dev Address that will receive the liquidity tokens
        uint256 deadline; /// @dev Maximum timestamp until which the transaction is valid
    }

    /// @notice Struct for removeLiquidity function parameters
    /// @dev Groups related parameters to reduce function signature complexity
    struct RemoveLiquidityParams {
        address tokenA; /// @dev Address of the first token
        address tokenB; /// @dev Address of the second token
        uint256 liquidity; /// @dev Amount of liquidity tokens to burn
        uint256 amountAMin; /// @dev Minimum amount of tokenA to receive (slippage protection)
        uint256 amountBMin; /// @dev Minimum amount of tokenB to receive (slippage protection)
        address to; /// @dev Address that will receive the tokens
        uint256 deadline; /// @dev Maximum timestamp until which the transaction is valid
    }

    /// @notice Struct for swapExactTokensForTokens function parameters
    /// @dev Groups related parameters to reduce function signature complexity
    struct SwapParams {
        uint256 amountIn; /// @dev Amount of input tokens to swap
        uint256 amountOutMin; /// @dev Minimum amount of output tokens to receive
        address[] path; /// @dev Array containing [tokenIn, tokenOut] addresses
        address to; /// @dev Address that will receive the output tokens
        uint256 deadline; /// @dev Maximum timestamp until which the transaction is valid
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
    event LiquidityAction(
        address indexed tokenA,
        address indexed tokenB,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidity,
        bool isAdded
    );

    /// @notice Emitted when the contract is paused
    /// @param account The address that triggered the pause
    event Paused(address account);

    /// @notice Emitted when the contract is unpaused
    /// @param account The address that triggered the unpause
    event Unpaused(address account);

    /// @notice Emitted when ownership is transferred
    /// @param previousOwner The address of the previous owner
    /// @param newOwner The address of the new owner
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /// @notice Modifier to restrict access to owner-only functions
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /// @notice Modifier to check if the contract is not paused
    modifier whenNotPaused() {
        _checkNotPaused();
        _;
    }

    /// @notice Internal function to check if caller is owner with single storage read
    /// @dev Caches owner to ensure single storage access per call
    function _checkOwner() internal view {
        address currentOwner = owner; // Cache storage read
        require(msg.sender == currentOwner, "not owner");
    }

    /// @notice Internal function to check if contract is not paused with single storage read
    /// @dev Caches paused state to ensure single storage access per call
    function _checkNotPaused() internal view {
        bool isPaused = paused; // Cache storage read
        require(!isPaused, "paused");
    }

    /// @notice Constructor to set the initial owner
    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

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
    function _loadPairData(
        address tokenA,
        address tokenB
    ) internal view returns (LocalPairData memory localData, bytes32 pairHash, bool reversed) {
        (pairHash, reversed) = _getPairHash(tokenA, tokenB);
        PairData storage pairData = pairs[pairHash]; // Single storage read

        // Cache totalLiquidity to avoid multiple reads
        uint256 totalLiq = pairData.totalLiquidity;
        
        // Populate localData based on original or reversed order
        if (reversed) {
            localData = LocalPairData({
                reserveA: pairData.reserveB,
                reserveB: pairData.reserveA,
                totalLiquidity: totalLiq,
                isFirstProvision: totalLiq == 0
            });
        } else {
            localData = LocalPairData({
                reserveA: pairData.reserveA,
                reserveB: pairData.reserveB,
                totalLiquidity: totalLiq,
                isFirstProvision: totalLiq == 0
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
        return
            _min(
                (amountA * localData.totalLiquidity) / localData.reserveA,
                (amountB * localData.totalLiquidity) / localData.reserveB
            );
    }

        /**
     * @notice Internal function for adding liquidity using struct parameters
     * @dev Uses struct parameters to reduce function signature complexity and improve gas efficiency.
     * @param params Struct containing all liquidity addition parameters
     * @return amountA The actual amount of first token added
     * @return amountB The actual amount of second token added
     * @return liquidity The amount of liquidity tokens minted
     */
    function _addLiquidityInternal(AddLiquidityParams memory params) 
        internal returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        require(block.timestamp <= params.deadline, "expired");
        require(params.amountADesired >= params.amountAMin && params.amountBDesired >= params.amountBMin, "min amt");

        (LocalPairData memory data, bytes32 hash, bool rev) = _loadPairData(params.tokenA, params.tokenB);

        liquidity = _calculateLiquidity(params.amountADesired, params.amountBDesired, data);

        _transferFrom(params.tokenA, msg.sender, address(this), params.amountADesired);
        _transferFrom(params.tokenB, msg.sender, address(this), params.amountBDesired);

        // Update reserves and liquidity
        data.reserveA += params.amountADesired;
        data.reserveB += params.amountBDesired;
        data.totalLiquidity += liquidity;

        // Store updated pair data
        _savePairData(hash, rev, data);

        // Update user's liquidity balance
        liquidityBalances[hash][params.to] += liquidity;

        emit LiquidityAction(params.tokenA, params.tokenB, params.amountADesired, params.amountBDesired, liquidity, true);

        amountA = params.amountADesired;
        amountB = params.amountBDesired;
    }

    /**
     * @notice Adds liquidity to a trading pair using struct parameters for gas optimization
     * @dev External wrapper for struct-based liquidity addition
     * @param params Struct containing all liquidity addition parameters
     * @return amountA The actual amount of first token added
     * @return amountB The actual amount of second token added
     * @return liquidity The amount of liquidity tokens minted
     */
    function addLiquidity(AddLiquidityParams calldata params) 
        external whenNotPaused returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        return _addLiquidityInternal(params);
    }

    /**
     * @notice Legacy addLiquidity function with individual parameters for backward compatibility
     * @dev Wrapper function that creates struct and calls the optimized version
     * @param tokenA Address of the first token
     * @param tokenB Address of the second token
     * @param amountADesired Desired amount of tokenA to add
     * @param amountBDesired Desired amount of tokenB to add
     * @param amountAMin Minimum amount of tokenA to add (slippage protection)
     * @param amountBMin Minimum amount of tokenB to add (slippage protection)
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
    ) external whenNotPaused returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        AddLiquidityParams memory params = AddLiquidityParams({
            tokenA: tokenA,
            tokenB: tokenB,
            amountADesired: amountADesired,
            amountBDesired: amountBDesired,
            amountAMin: amountAMin,
            amountBMin: amountBMin,
            to: to,
            deadline: deadline
        });
        return _addLiquidityInternal(params);
    }

    /**
     * @notice Internal function for removing liquidity using struct parameters
     * @dev Uses struct parameters to reduce function signature complexity.
     * @param params Struct containing all liquidity removal parameters
     * @return amountA Amount of first token received
     * @return amountB Amount of second token received
     */
    function _removeLiquidityInternal(RemoveLiquidityParams memory params) 
        internal returns (uint256 amountA, uint256 amountB) {
        require(block.timestamp <= params.deadline, "expired");

        (LocalPairData memory data, bytes32 hash, bool rev) = _loadPairData(params.tokenA, params.tokenB);

        // Load current user liquidity balance once
        uint256 userLiquidity = liquidityBalances[hash][msg.sender];
        require(userLiquidity >= params.liquidity, "insuf liq");

        // Calculate amounts to return
        amountA = (params.liquidity * data.reserveA) / data.totalLiquidity;
        amountB = (params.liquidity * data.reserveB) / data.totalLiquidity;

        require(amountA >= params.amountAMin && amountB >= params.amountBMin, "min return");

        // Update liquidity balance and total liquidity (single write)
        liquidityBalances[hash][msg.sender] = userLiquidity - params.liquidity;
        data.totalLiquidity -= params.liquidity;

        // Update reserves
        data.reserveA -= amountA;
        data.reserveB -= amountB;

        // Store updated pair data
        _savePairData(hash, rev, data);

        // Transfer tokens to user
        _transfer(params.tokenA, params.to, amountA);
        _transfer(params.tokenB, params.to, amountB);

        emit LiquidityAction(params.tokenA, params.tokenB, amountA, amountB, params.liquidity, false);
    }

    /**
     * @notice Removes liquidity from a trading pair using struct parameters for gas optimization
     * @dev External wrapper for struct-based liquidity removal
     * @param params Struct containing all liquidity removal parameters
     * @return amountA Amount of first token received
     * @return amountB Amount of second token received
     */
    function removeLiquidity(RemoveLiquidityParams calldata params) 
        external whenNotPaused returns (uint256 amountA, uint256 amountB) {
        return _removeLiquidityInternal(params);
    }

    /**
     * @notice Legacy removeLiquidity function with individual parameters for backward compatibility
     * @dev Wrapper function that creates struct and calls the optimized version
     * @param tokenA Address of the first token
     * @param tokenB Address of the second token
     * @param liquidity Amount of liquidity tokens to burn
     * @param amountAMin Minimum amount of tokenA to receive
     * @param amountBMin Minimum amount of tokenB to receive
     * @param to Address that will receive the tokens
     * @param deadline Maximum timestamp until which the transaction is valid
     * @return amountA Amount of first token received
     * @return amountB Amount of second token received
     */
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external whenNotPaused returns (uint256 amountA, uint256 amountB) {
        RemoveLiquidityParams memory params = RemoveLiquidityParams({
            tokenA: tokenA,
            tokenB: tokenB,
            liquidity: liquidity,
            amountAMin: amountAMin,
            amountBMin: amountBMin,
            to: to,
            deadline: deadline
        });
        return _removeLiquidityInternal(params);
    }

    /**
     * @notice Internal function for swapping tokens using struct parameters
     * @dev Uses struct parameters to reduce function signature complexity.
     * @param params Struct containing all swap parameters
     */
    function _swapExactTokensForTokensInternal(SwapParams memory params) internal {
        require(block.timestamp <= params.deadline, "expired");
        require(params.path.length == 2, "bad path");

        // Load data once
        (LocalPairData memory data, bytes32 hash, bool rev) = _loadPairData(params.path[0], params.path[1]);

        // Calculate output without any fees
        uint256 amountOut = getAmountOut(params.amountIn, data.reserveA, data.reserveB);
        require(amountOut >= params.amountOutMin, "min out");

        _transferFrom(params.path[0], msg.sender, address(this), params.amountIn);

        // Update reserves in local data
        data.reserveA += params.amountIn; // Add input amount to reserves
        data.reserveB -= amountOut;

        _savePairData(hash, rev, data);
        _transfer(params.path[1], params.to, amountOut);

        emit Swap(params.path[0], params.path[1], params.amountIn, amountOut);
    }

    /**
     * @notice Swaps tokens using struct parameters for gas optimization
     * @dev External wrapper for struct-based token swapping
     * @param params Struct containing all swap parameters
     */
    function swapExactTokensForTokens(SwapParams calldata params) external whenNotPaused {
        _swapExactTokensForTokensInternal(params);
    }

    /**
     * @notice Legacy swapExactTokensForTokens function with individual parameters for backward compatibility
     * @dev Wrapper function that creates struct and calls the optimized version
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
    ) external whenNotPaused {
        SwapParams memory params = SwapParams({
            amountIn: amountIn,
            amountOutMin: amountOutMin,
            path: path,
            to: to,
            deadline: deadline
        });
        _swapExactTokensForTokensInternal(params);
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
        (LocalPairData memory data, , ) = _loadPairData(tokenA, tokenB);
        // Ensure reserves are not zero to prevent division by zero
        require(data.reserveA > 0, "no reserves");
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
        (LocalPairData memory data, , ) = _loadPairData(tokenA, tokenB);
        return (data.reserveA, data.reserveB);
    }

    /**
     * @notice Gets the total liquidity tokens for a token pair
     * @dev Returns the total amount of liquidity tokens issued for a given pair
     * @param tokenA Address of the first token
     * @param tokenB Address of the second token
     * @return totalLiquidity Total liquidity tokens for the pair
     */
    function getTotalLiquidity(address tokenA, address tokenB) external view returns (uint256 totalLiquidity) {
        (LocalPairData memory data, , ) = _loadPairData(tokenA, tokenB);
        return data.totalLiquidity;
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
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) public pure returns (uint256) {
        require(amountIn > 0, "zero amt");
        require(reserveIn > 0, "zero reserve");
        require(reserveOut > 0, "zero reserve");
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
        (bool success, ) = token.call(
            abi.encodeWithSelector(0x23b872dd, from, to, amount)
        );
        require(success, "transfer fail");
    }

    /**
     * @dev Internal function to handle `transfer` operations for ERC-20 tokens
     * Assumes the `token` address is a valid ERC-20 contract
     * @param token The address of the ERC-20 token contract
     * @param to The address to which tokens are transferred
     * @param amount The amount of tokens to transfer
     */
    function _transfer(address token, address to, uint256 amount) internal {
        (bool success, ) = token.call(abi.encodeWithSelector(0xa9059cbb, to, amount));
        require(success, "transfer fail");
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

    /**
     * @notice Pauses the contract, preventing new swaps and liquidity operations
     * @dev Only the owner can call this function during emergency situations
     */
    function pause() external onlyOwner {
        bool currentPaused = paused; // Cache storage read
        require(!currentPaused, "already paused");
        paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @notice Unpauses the contract, allowing normal operations to resume
     * @dev Only the owner can call this function to resume operations
     */
    function unpause() external onlyOwner {
        bool currentPaused = paused; // Cache storage read
        require(currentPaused, "not paused");
        paused = false;
        emit Unpaused(msg.sender);
    }

    /**
     * @notice Transfers ownership of the contract to a new account
     * @dev Only the current owner can call this function
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "zero addr");
        address currentOwner = owner; // Cache current owner to avoid multiple storage reads
        require(newOwner != currentOwner, "same owner");
        emit OwnershipTransferred(currentOwner, newOwner);
        owner = newOwner;
    }

    /**
     * @notice Estimates the gas cost for a swap operation
     * @dev Provides gas estimation without executing the actual swap
     * @param amountIn Amount of input tokens to swap
     * @param path Array containing [tokenIn, tokenOut] addresses
     * @return gasEstimate Estimated gas cost for the swap operation
     */
    function estimateSwapGas(
        uint256 amountIn,
        address[] calldata path
    ) external view returns (uint256 gasEstimate) {
        require(path.length == 2, "bad path");
        
        (LocalPairData memory data, , ) = _loadPairData(path[0], path[1]);
        require(data.reserveA > 0 && data.reserveB > 0, "no liquidity");
        
        uint256 amountOut = getAmountOut(amountIn, data.reserveA, data.reserveB);
        require(amountOut > 0, "zero output");
        
        // Base gas cost for swap operation (empirically determined)
        return 85000; // Approximate gas cost for swapExactTokensForTokens
    }

    /**
     * @notice Advanced slippage protection with custom tolerance
     * @dev Calculates minimum output with slippage tolerance in basis points
     * @param amountIn Amount of input tokens
     * @param path Array containing [tokenIn, tokenOut] addresses  
     * @param slippageBps Slippage tolerance in basis points (100 = 1%)
     * @return amountOutMin Minimum output amount considering slippage
     */
    function calculateMinOutputWithSlippage(
        uint256 amountIn,
        address[] calldata path,
        uint256 slippageBps
    ) external view returns (uint256 amountOutMin) {
        require(path.length == 2, "bad len");
        require(slippageBps <= 5000, "max 50% slip"); // Max 50% slippage
        
        (LocalPairData memory data, , ) = _loadPairData(path[0], path[1]);
        uint256 amountOut = getAmountOut(amountIn, data.reserveA, data.reserveB);
        
        // Apply slippage: amountOut * (10000 - slippageBps) / 10000
        return (amountOut * (10000 - slippageBps)) / 10000;
    }
}
