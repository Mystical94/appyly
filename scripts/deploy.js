// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners()
  const NAME = "DotName"
  const SYMBOL = "DOTN"

  // Deploy contract
  const DotName = await ethers.getContractFactory("DotName")
  const dotName = await DotName.deploy(NAME, SYMBOL)
  await dotName.deployed();

  console.log(`Deployed Domain Contract at: ${dotName.address}\n`)

  // List domains
  const names = ["buyit.go","compareit.go", "better.go", "newyear.go", "google.go", "microsoft.go", "amazon.go", "facebook.go", "dotname.go", "oz.go","godaddy.go", "mlh.go", "ebuy.go", "cobalt.go", "oxygen.go", "wall.go"]
  const costs = [tokens(0.35), tokens(0.15), tokens(0.23), tokens(0.5), tokens(100), tokens(100), tokens(90), tokens(95), tokens(100000), tokens(0.111),tokens(50), tokens(100), tokens(0.3), tokens(0.35), tokens(0.23), tokens(0.111)]

  for (var i = 0; i < 16; i++) {
    const transaction = await dotName.connect(deployer).list(names[i], costs[i])
    await transaction.wait()

    console.log(`Listed Domain ${i + 1}: ${names[i]}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
