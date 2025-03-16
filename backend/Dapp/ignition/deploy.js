const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();
  const AssestContract = await hre.ethers.getContractFactory("AssestMarket");

  const asstMarket = await AssestContract.deploy();

  await asstMarket.deployed();

  const data = {
    address: asstMarket.address,
    abi: JSON.parse(asstMarket.interface.format('json'))
  }
 
  //Replace this:
    //This writes the ABI and address to the mktplace.json
    // fs.writeFileSync('./src/Marketplace.json', JSON.stringify(data))

  //By this:
    // Automatically copy the Marketplace.json file to frontend/src/
    const frontendPath = path.join(__dirname, '../../../frontend/src/AssestContract.json');
    fs.writeFileSync(frontendPath, JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
