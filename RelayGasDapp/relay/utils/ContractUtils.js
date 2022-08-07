const {ethers} = require('hardhat');
const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' }
];


const ForwardRequest = [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'gas', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'data', type: 'bytes' },
];


function getInstanceFromABI(contractAbi, contractAddress) {
    return ethers.getContractAt(contractAbi, contractAddress);
}

function getInstance(name,address) {
    return ethers.getContractFactory(name).then(f => f.attach(address));
}

// gets the nonce and builds the request
async function buildRequest(forwarder, input) {
    const nonce = await forwarder.getNonce(input.from).then(nonce => nonce.toString());
    return {value: 0, gas: 1e6, nonce, ...input};
}

function getMetaTxTypeData(chainId, verifyingContract) {
    return {
        types: {
            EIP712Domain,
            ForwardRequest,
        },
        domain: {
            name: 'MinimalForwarder',
            version: '0.0.1',
            chainId,
            verifyingContract,
        },
        primaryType: 'ForwardRequest',
    }
};

async function buildTypedData(forwarder, request) {
    const chainId = await forwarder.provider.getNetwork().then(n => n.chainId);
    const typeData = getMetaTxTypeData(chainId, forwarder.address);
    return {...typeData, message: request};
}

module.exports = {getInstance,getInstanceFromABI, buildRequest, buildTypedData}