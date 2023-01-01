const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("DotName", () => {
  let dotName
  let deployer, owner1

  const NAME = "DotName"
  const SYMBOL = "DOTN"

  beforeEach(async () => {
    // Setup accounts
    [deployer, owner1] = await ethers.getSigners()

    // Deploy contract
    const DotName = await ethers.getContractFactory("DotName")
    dotName = await DotName.deploy(NAME, SYMBOL)

    // List a domain
    const transaction = await dotName.connect(deployer).list("jack.eth", tokens(10))
    await transaction.wait()
  })

  describe("Deployment", () => {
    it("Sets the name", async () => {
      const result = await dotName.name()
      expect(result).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
      const result = await dotName.symbol()
      expect(result).to.equal(SYMBOL)
    })

    it("Sets the owner", async () => {
      const result = await dotName.owner()
      expect(result).to.equal(deployer.address)
    })

    it("Returns the max supply", async () => {
      const result = await dotName.maxSupply()
      expect(result).to.equal(1)
    })

    it("Returns the total supply", async () => {
      const result = await dotName.totalSupply()
      expect(result).to.equal(0)
    })
  })

  describe("Domain", () => {
    it('Returns domain attributes', async () => {
      const domain = await dotName.getDomain(1)
      expect(domain.name).to.be.equal("jack.eth")
      expect(domain.cost).to.be.equal(tokens(10))
      expect(domain.isOwned).to.be.equal(false)
    })
  })

  describe("Minting", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')

    beforeEach(async () => {
      const transaction = await dotName.connect(owner1).mint(ID, { value: AMOUNT })
      await transaction.wait()
    })

    it('Updates the owner', async () => {
      const owner = await dotName.ownerOf(ID)
      expect(owner).to.be.equal(owner1.address)
    })

    it('Updates the domain status', async () => {
      const domain = await dotName.getDomain(ID)
      expect(domain.isOwned).to.be.equal(true)
    })

    it('Updates the contract balance', async () => {
      const result = await dotName.getBalance()
      expect(result).to.be.equal(AMOUNT)
    })
  })

  describe("Withdrawing", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await dotName.connect(owner1).mint(ID, { value: AMOUNT })
      await transaction.wait()

      transaction = await dotName.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await dotName.getBalance()
      expect(result).to.equal(0)
    })
  })
})
