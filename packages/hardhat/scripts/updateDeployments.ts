import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

interface DeploymentConfig {
  network: string;
  SimpleSwap: string;
  TokenA?: string;
  TokenB?: string;
}

// Configuration for different networks
const deploymentConfigs: Record<string, DeploymentConfig> = {
  sepolia: {
    network: "sepolia",
    SimpleSwap: "0x06eA28a8ADf22736778A54802CeEbcBeC14B3B34",
    // TODO: Add TokenA and TokenB addresses when deployed on Sepolia
    TokenA: "0x0000000000000000000000000000000000000000", // Replace with actual address
    TokenB: "0x0000000000000000000000000000000000000000", // Replace with actual address
  },
};

function updateDeploymentAddress(network: string, contractName: string, newAddress: string) {
  const deploymentPath = join(__dirname, "..", "deployments", network, `${contractName}.json`);

  try {
    const deploymentData = JSON.parse(readFileSync(deploymentPath, "utf8"));
    deploymentData.address = newAddress;

    writeFileSync(deploymentPath, JSON.stringify(deploymentData, null, 2));
    console.log(`✅ Updated ${contractName} address to ${newAddress} for ${network}`);
  } catch (error) {
    console.error(`❌ Error updating ${contractName} for ${network}:`, error);
  }
}

function updateNetworkDeployments(networkConfig: DeploymentConfig) {
  console.log(`🚀 Updating deployments for ${networkConfig.network}...`);

  updateDeploymentAddress(networkConfig.network, "SimpleSwap", networkConfig.SimpleSwap);

  if (networkConfig.TokenA && networkConfig.TokenA !== "0x0000000000000000000000000000000000000000") {
    updateDeploymentAddress(networkConfig.network, "TokenA", networkConfig.TokenA);
  }

  if (networkConfig.TokenB && networkConfig.TokenB !== "0x0000000000000000000000000000000000000000") {
    updateDeploymentAddress(networkConfig.network, "TokenB", networkConfig.TokenB);
  }
}

// Main execution
const networkArg = process.argv[2];
if (!networkArg) {
  console.error("❌ Please specify a network: yarn update-deployments [network]");
  console.log("Available networks:", Object.keys(deploymentConfigs).join(", "));
  process.exit(1);
}

const config = deploymentConfigs[networkArg];
if (!config) {
  console.error(`❌ Network ${networkArg} not configured`);
  console.log("Available networks:", Object.keys(deploymentConfigs).join(", "));
  process.exit(1);
}

updateNetworkDeployments(config);
console.log("🎉 Deployment addresses updated successfully!");
