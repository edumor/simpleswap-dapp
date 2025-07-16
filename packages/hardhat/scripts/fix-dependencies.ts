import { execSync } from "child_process";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";

console.log("🔧 Fixing dependency issues for Vercel deployment...");

try {
  const cwd = process.cwd();
  const nodeModulesPath = join(cwd, "node_modules");
  const yarnLockPath = join(cwd, "yarn.lock");

  console.log("📦 Removing node_modules...");
  if (existsSync(nodeModulesPath)) {
    execSync("rmdir /s /q node_modules", { stdio: "inherit", cwd });
  }

  console.log("🗑️ Removing yarn.lock...");
  if (existsSync(yarnLockPath)) {
    unlinkSync(yarnLockPath);
  }

  console.log("🔄 Installing dependencies with fresh lockfile...");
  execSync("yarn install", { stdio: "inherit", cwd });

  console.log("✅ Dependencies fixed successfully!");
  console.log("🚀 Now you can commit the new yarn.lock file to fix Vercel deployment");
} catch (error) {
  console.error("❌ Error fixing dependencies:", error);
  console.log("\n💡 Manual fix steps:");
  console.log("1. Delete node_modules folder");
  console.log("2. Delete yarn.lock file");
  console.log('3. Run "yarn install"');
  console.log("4. Commit the new yarn.lock file");
  process.exit(1);
}
