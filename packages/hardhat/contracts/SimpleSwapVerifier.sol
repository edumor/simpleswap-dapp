// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface ISimpleSwap {
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity);

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;

    function getPrice(address tokenA, address tokenB) external view returns (uint256 price);
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) external view returns (uint256);
}

/**
 * @title SimpleSwapVerifier
 * @notice Verificador funcional para contratos SimpleSwap
 * @author Eduardo Moreno
 */
contract SimpleSwapVerifier {
    string[] public authors;
    mapping(string => bool) public authorExists;

    event VerificationCompleted(address indexed swapContract, string author, bool success);

    /// @notice Verifica un contrato SimpleSwap
    function verify(
        address swapContract,
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        uint256 amountIn,
        string memory author
    ) external {
        require(amountA > 0 && amountB > 0, "Invalid liquidity amounts");
        require(amountIn > 0 && amountIn <= amountA, "Invalid swap amount");
        require(IERC20(tokenA).balanceOf(address(this)) >= amountA, "Insufficient token A");
        require(IERC20(tokenB).balanceOf(address(this)) >= amountB, "Insufficient token B");

        // Fase 1: Liquidez
        _testLiquidity(swapContract, tokenA, tokenB, amountA, amountB);

        // Fase 2: Swap
        uint256 liquidity = _testSwap(swapContract, tokenA, tokenB, amountA, amountB, amountIn);

        // Fase 3: Remover liquidez
        _testRemoveLiquidity(swapContract, tokenA, tokenB, liquidity);

        // Agregar autor
        if (!authorExists[author]) {
            authors.push(author);
            authorExists[author] = true;
        }

        emit VerificationCompleted(swapContract, author, true);
    }

    function _testLiquidity(
        address swapContract,
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB
    ) private returns (uint256 liquidity) {
        // Aprobar tokens
        require(IERC20(tokenA).approve(swapContract, amountA), "TokenA approve failed");
        require(IERC20(tokenB).approve(swapContract, amountB), "TokenB approve failed");

        // Agregar liquidez
        (uint256 aAdded, uint256 bAdded, uint256 liq) = ISimpleSwap(swapContract).addLiquidity(
            tokenA,
            tokenB,
            amountA,
            amountB,
            amountA,
            amountB,
            address(this),
            block.timestamp + 300
        );

        require(aAdded == amountA && bAdded == amountB, "addLiquidity amounts mismatch");
        require(liq > 0, "addLiquidity returned zero liquidity");

        // Verificar precio
        uint256 price = ISimpleSwap(swapContract).getPrice(tokenA, tokenB);
        uint256 expectedPrice = (bAdded * 1e18) / aAdded;
        require(price == expectedPrice, "getPrice incorrect");

        return liq;
    }

    function _testSwap(
        address swapContract,
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        uint256 amountIn
    ) private returns (uint256 liquidity) {
        // Calcular salida esperada
        uint256 expectedOut = ISimpleSwap(swapContract).getAmountOut(amountIn, amountA, amountB);
        require(expectedOut > 0, "getAmountOut returned zero");

        // Aprobar para swap
        require(IERC20(tokenA).approve(swapContract, amountIn), "TokenA swap approve failed");

        // Ejecutar swap
        uint256 balanceBBefore = IERC20(tokenB).balanceOf(address(this));
        address[] memory path = new address[](2);
        path[0] = tokenA;
        path[1] = tokenB;

        ISimpleSwap(swapContract).swapExactTokensForTokens(
            amountIn,
            expectedOut,
            path,
            address(this),
            block.timestamp + 300
        );

        uint256 balanceBAfter = IERC20(tokenB).balanceOf(address(this));
        require(balanceBAfter >= balanceBBefore + expectedOut, "swapExactTokensForTokens failed");

        // Retornar una aproximación más realista de la liquidez
        // Usar la misma formula que SimpleSwap para primera provisión
        uint256 liquidityCalculated = _sqrt(amountA * amountB);
        return liquidityCalculated;
    }

    function _testRemoveLiquidity(address swapContract, address tokenA, address tokenB, uint256 liquidity) private {
        (uint256 aOut, uint256 bOut) = ISimpleSwap(swapContract).removeLiquidity(
            tokenA,
            tokenB,
            liquidity,
            0,
            0,
            address(this),
            block.timestamp + 300
        );
        require(aOut + bOut > 0, "removeLiquidity returned zero tokens");
    }

    /// @notice Obtiene la cantidad de autores verificados
    function getAuthorsCount() external view returns (uint256) {
        return authors.length;
    }

    /// @notice Permite que cualquiera deposite tokens para verificaciones
    function depositTokens(address token, uint256 amount) external {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "transfer fail");
    }

    /// @notice Permite al owner retirar tokens en caso de emergencia
    function withdrawTokens(address token, uint256 amount, address to) external {
        // Solo para emergencias - en un contrato real agregarías control de acceso
        require(IERC20(token).transfer(to, amount), "withdraw fail");
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
