const hre = require("hardhat");

async function main() {
  
  const starNotary = await hre.ethers.deployContract("StarNotary");

  await starNotary.waitForDeployment();

  console.log(`deployed to ${starNotary.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
