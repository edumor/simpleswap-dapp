import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Correct contract addresses for Sepolia
const CORRECT_ADDRESSES = {
  SimpleSwap: "0x5F1C2c20248BA5A444256c21592125EaF08b23A1",
  TokenA: "0x5578bD42d6bb30c0c23D4D693bBAE8A89e1D3397",
  TokenB: "0x52fC6d0924cC27fC192E877C7013687A2a8F5683"
};

function updateMainReadme() {
  const readmePath = join(__dirname, "..", "..", "..", "README.md");
  
  try {
    let content = readFileSync(readmePath, "utf8");
    
    // Update SimpleSwap address - replace the old address with correct one
    content = content.replace(
      "0x0c6A578c49aFc1337d61d75299B80b50d10d20D1",
      CORRECT_ADDRESSES.SimpleSwap
    );
    
    // Also update the etherscan link in the documentation section
    content = content.replace(
      "https://sepolia.etherscan.io/address/0x7659B6f3B1fFc79a26728e43fE8Dd9613e35Bc18",
      `https://sepolia.etherscan.io/address/${CORRECT_ADDRESSES.SimpleSwap}`
    );
    
    writeFileSync(readmePath, content);
    console.log("✅ Main README.md updated successfully!");
    console.log(`✅ SimpleSwap address updated to: ${CORRECT_ADDRESSES.SimpleSwap}`);
    console.log("✅ All Etherscan links updated");
    
  } catch (error) {
    console.error("❌ Error updating main README:", error);
  }
}

// Execute the update
updateMainReadme();
