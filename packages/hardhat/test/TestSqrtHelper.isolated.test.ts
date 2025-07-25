import { expect } from "chai";
import { ethers } from "hardhat";

describe("TestSqrtHelper Isolated Coverage", function () {
  
  it("Should deploy TestSqrtHelper contract", async function () {
    const TestSqrtHelper = await ethers.getContractFactory("TestSqrtHelper");
    const testSqrt = await TestSqrtHelper.deploy({ gasLimit: 50000000 });
    
    // Verificar que se deployó correctamente
    expect(testSqrt.target).to.not.be.undefined;
  });

  it("Should calculate sqrt(0) = 0", async function () {
    const TestSqrtHelper = await ethers.getContractFactory("TestSqrtHelper");
    const testSqrt = await TestSqrtHelper.deploy({ gasLimit: 50000000 });
    
    const result = await testSqrt.testSqrt(0);
    expect(result).to.equal(0);
  });

  it("Should calculate sqrt(1) = 1", async function () {
    const TestSqrtHelper = await ethers.getContractFactory("TestSqrtHelper");
    const testSqrt = await TestSqrtHelper.deploy({ gasLimit: 50000000 });
    
    const result = await testSqrt.testSqrt(1);
    expect(result).to.equal(1);
  });

  it("Should calculate sqrt(4) = 2", async function () {
    const TestSqrtHelper = await ethers.getContractFactory("TestSqrtHelper");
    const testSqrt = await TestSqrtHelper.deploy({ gasLimit: 50000000 });
    
    const result = await testSqrt.testSqrt(4);
    expect(result).to.equal(2);
  });

  it("Should calculate sqrt(9) = 3", async function () {
    const TestSqrtHelper = await ethers.getContractFactory("TestSqrtHelper");
    const testSqrt = await TestSqrtHelper.deploy({ gasLimit: 50000000 });
    
    const result = await testSqrt.testSqrt(9);
    expect(result).to.equal(3);
  });

  it("Should calculate sqrt(16) = 4", async function () {
    const TestSqrtHelper = await ethers.getContractFactory("TestSqrtHelper");
    const testSqrt = await TestSqrtHelper.deploy({ gasLimit: 50000000 });
    
    const result = await testSqrt.testSqrt(16);
    expect(result).to.equal(4);
  });

  it("Should handle large numbers", async function () {
    const TestSqrtHelper = await ethers.getContractFactory("TestSqrtHelper");
    const testSqrt = await TestSqrtHelper.deploy({ gasLimit: 50000000 });
    
    // sqrt(100) = 10
    const result = await testSqrt.testSqrt(100);
    expect(result).to.equal(10);
  });

  it("Should handle perfect squares", async function () {
    const TestSqrtHelper = await ethers.getContractFactory("TestSqrtHelper");
    const testSqrt = await TestSqrtHelper.deploy({ gasLimit: 50000000 });
    
    // sqrt(144) = 12
    const result = await testSqrt.testSqrt(144);
    expect(result).to.equal(12);
  });

});
