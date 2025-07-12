const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleSwap", function () {
  it("debería desplegar correctamente", async function () {
    const SimpleSwap = await ethers.getContractFactory("SimpleSwap");
    const simpleSwap = await SimpleSwap.deploy();
    await simpleSwap.deployed();
    expect(simpleSwap.address).to.properAddress;
  });
  // Agrega más tests aquí para cubrir lógica de swap, precios, etc.
});
