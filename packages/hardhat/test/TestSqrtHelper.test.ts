import { expect } from "chai";
import { ethers } from "hardhat";
import { TestSqrtHelper } from "../typechain-types";

describe("TestSqrtHelper Coverage", function () {
  let sqrtHelper: TestSqrtHelper;

  beforeEach(async function () {
    const SqrtHelperFactory = await ethers.getContractFactory("TestSqrtHelper");
    sqrtHelper = await SqrtHelperFactory.deploy();
    await sqrtHelper.waitForDeployment();
  });

  describe("_sqrt function edge cases", function () {
    it("Should return 0 for input 0", async function () {
      const result = await sqrtHelper.testSqrt(0);
      expect(result).to.equal(0);
    });

    it("Should return 1 for input 1", async function () {
      const result = await sqrtHelper.testSqrt(1);
      expect(result).to.equal(1);
    });

    it("Should return 1 for input 2", async function () {
      const result = await sqrtHelper.testSqrt(2);
      expect(result).to.equal(1);
    });

    it("Should return 1 for input 3", async function () {
      const result = await sqrtHelper.testSqrt(3);
      expect(result).to.equal(1);
    });

    it("Should return 2 for input 4", async function () {
      const result = await sqrtHelper.testSqrt(4);
      expect(result).to.equal(2);
    });

    it("Should return correct values for larger numbers", async function () {
      expect(await sqrtHelper.testSqrt(16)).to.equal(4);
      expect(await sqrtHelper.testSqrt(25)).to.equal(5);
      expect(await sqrtHelper.testSqrt(100)).to.equal(10);
    });
  });
});
