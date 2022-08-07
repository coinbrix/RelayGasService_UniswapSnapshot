/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

module.exports = {
    solidity: "0.8.9",
    defaultNetwork: "goerli",
    networks: {
        goerli: {
            url: "https://goerli.infura.io/v3/6e7ca448d795493f91950111bb891da3",
            accounts: [process.env.PRIVATE_KEY]
        }
    }
};
