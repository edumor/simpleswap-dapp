import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// Ya no necesitamos importar 'utils' si usamos 'hre.ethers' directamente
// import { utils } from "ethers";

/**
 * Despliega los contratos TokenA, TokenB y SimpleSwap en la red local.
 * Incluye minteo inicial de tokens y adición de aprobación para facilitar las pruebas.
 * La lógica para añadir liquidez inicial está comentada, ya que su firma
 * debe coincidir exactamente con la función addLiquidity de tu SimpleSwap.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deploySimpleSwapAndTokens: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // *** NUEVA LÍNEA AÑADIDA AQUÍ ***
  // Obtenemos los signers disponibles; el primero es generalmente el deployer
  const [deployerSigner] = await hre.ethers.getSigners();
  // También puedes obtener el signer específico así, si getNamedAccounts().deployer es una dirección
  // const deployerSigner = await hre.ethers.getSigner(deployer);

  console.log(`\nDesplegando contratos con la cuenta: ${deployer}`);

  // --- 1. Desplegar TokenA ---
  console.log("🚀 Desplegando TokenA...");
  const tokenA = await deploy("TokenA", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });
  console.log("✅ TokenA desplegado en:", tokenA.address);

  // --- 2. Desplegar TokenB ---
  console.log("🚀 Desplegando TokenB...");
  const tokenB = await deploy("TokenB", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });
  console.log("✅ TokenB desplegado en:", tokenB.address);

  // --- 3. Desplegar SimpleSwap ---
  console.log("🚀 Desplegando SimpleSwap...");
  const simpleSwap = await deploy("SimpleSwap", {
    from: deployer,
    log: true,
    autoMine: true,
  });
  console.log("✅ SimpleSwap desplegado en:", simpleSwap.address);

  // --- 4. Interacciones post-despliegue (para facilitar pruebas) ---
  // Obtener instancias de contrato para interactuar
  // *** CAMBIOS EN LAS SIGUIENTES 3 LÍNEAS ***
  // Ahora pasamos el objeto deployerSigner en lugar de la cadena 'deployer'
  const tokenAContract = await hre.ethers.getContractAt("TokenA", tokenA.address, deployerSigner);
  const tokenBContract = await hre.ethers.getContractAt("TokenB", tokenB.address, deployerSigner);
  // const simpleSwapContract = await hre.ethers.getContractAt("SimpleSwap", simpleSwap.address, deployerSigner); // Eliminado porque no se usa

  // 4.1 Mintear tokens iniciales para la cuenta del deployer
  const initialMintAmount = hre.ethers.parseEther("1000");
  console.log(`\nMinteando ${hre.ethers.formatEther(initialMintAmount)} TokenA a ${deployer}...`);
  await tokenAContract.mint(deployer, initialMintAmount);
  console.log("✅ TokenA minteado.");

  console.log(`Minteando ${hre.ethers.formatEther(initialMintAmount)} TokenB a ${deployer}...`);
  await tokenBContract.mint(deployer, initialMintAmount);
  console.log("✅ TokenB minteado.");

  // 4.2 Aprobar que SimpleSwap pueda gastar los tokens del deployer para añadir liquidez o swaps
  const liquidityAmount = hre.ethers.parseEther("500");
  console.log(
    `\nAprobando ${hre.ethers.formatEther(liquidityAmount)} TokenA para SimpleSwap (${simpleSwap.address})...`,
  );
  await tokenAContract.approve(simpleSwap.address, liquidityAmount);
  console.log("✅ Aprobación de TokenA para SimpleSwap completada.");

  console.log(`Aprobando ${hre.ethers.formatEther(liquidityAmount)} TokenB para SimpleSwap (${simpleSwap.address})...`);
  await tokenBContract.approve(simpleSwap.address, liquidityAmount);
  console.log("✅ Aprobación de TokenB para SimpleSwap completada.");

  // 4.3 Añadir liquidez inicial al pool SimpleSwap (sección comentada)
  /*
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  console.log("🚀 Añadiendo liquidez inicial a SimpleSwap...");
  await simpleSwapContract.addLiquidity(
    tokenA.address,
    tokenB.address,
    hre.ethers.parseEther("500"),
    hre.ethers.parseEther("500"),
    0,
    0,
    deployer,
    deadline
  );
  console.log("✅ Liquidez inicial añadida a SimpleSwap.");
  */

  console.log("\nDespliegue y configuración inicial completados con éxito!");
};

export default deploySimpleSwapAndTokens;

deploySimpleSwapAndTokens.tags = ["SimpleSwap", "TokenA", "TokenB"];
