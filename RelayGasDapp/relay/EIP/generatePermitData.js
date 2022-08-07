const {UNISWAP_ADDRESS, UNISWAP_NAME} = require("../utils/ConstantContracts");

const createPermitMessageData =  function (
    fromAddress,
    spender,
    value,
    nonce,
    deadline
) {
    const message = {
        owner: fromAddress,
        spender: spender,
        value: value,
        nonce: nonce,
        deadline: deadline
    };

    const typedData = {
        types: {
            EIP712Domain: [
                {
                    name: "name",
                    type: "string",
                },
                {
                    name: "chainId",
                    type: "uint256",
                },
                {
                    name: "verifyingContract",
                    type: "address",
                },
            ],
            Permit: [
                {
                    name: "owner",
                    type: "address",
                },
                {
                    name: "spender",
                    type: "address",
                },
                {
                    name: "value",
                    type: "uint256",
                },
                {
                    name: "nonce",
                    type: "uint256",
                },
                {
                    name: "deadline",
                    type: "uint256",
                }
            ],
        },
        primaryType: "Permit",
        domain: {
            name: UNISWAP_NAME,
            chainId: 5,
            verifyingContract: UNISWAP_ADDRESS,
        },
        message: message,
    };

    return {
        typedData,
        message,
    };
};

module.exports = {createPermitMessageData}