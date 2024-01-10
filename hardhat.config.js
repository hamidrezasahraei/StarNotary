require("@nomicfoundation/hardhat-toolbox");

const INFURA_API_KEY = "";
const GORELI_PRIVATE_KEY = "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    goreli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [GORELI_PRIVATE_KEY]
    }
  }
};
