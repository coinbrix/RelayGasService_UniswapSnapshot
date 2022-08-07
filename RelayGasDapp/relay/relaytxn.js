const {buildRequest, buildTypedData, getInstanceFromABI,getInstance} = require("./utils/ContractUtils");
const {
    uniswapRouterAddress,
    userIRCToken,
    amountOutMin,
    MinimalForwarderAddress,
    RegistryAddress, UNISWAP_ADDRESS
} = require("./utils/ConstantContracts");
const {createPermitMessageData} = require("./EIP/generatePermitData");
const {MinimalForwarderAbi, RegistryAbi} = require("./ContractABI/NeobrixDeployedABI");
const {UniSwapAbi} = require("./ContractABI/ExternalContractABI");
const {handler} = require("./utils/RelayHandler");
var relaytxn = require('express').Router();


relaytxn.post('/generatepermittypeddata', async function (req, res) {
    const SECOND = 1000;
    const deadline = Math.trunc((Date.now() + 10000000 * SECOND) / SECOND);
    const uniSwapContract = await getInstanceFromABI(UniSwapAbi, UNISWAP_ADDRESS);
    const nonce = await uniSwapContract.nonces(req.body.fromAddress).then(nonce => nonce.toString());
    const messageData = createPermitMessageData(req.body.fromAddress, RegistryAddress, req.body.value, nonce, deadline);
    res.send(JSON.stringify(messageData))
})


relaytxn.post('/createmetatxn', async function (req, res) {
    const signedUserPermitMetaData = req.body
    const metaTxnInitiator = signedUserPermitMetaData.owner;
    const forwarder = await getInstanceFromABI(MinimalForwarderAbi, MinimalForwarderAddress);
    const registry = await getInstanceFromABI(RegistryAbi, RegistryAddress);
    const uniswapExchangeData = registry.interface.encodeFunctionData('swap',
        [uniswapRouterAddress, signedUserPermitMetaData.owner, userIRCToken,
            Number(signedUserPermitMetaData.value), amountOutMin,
            signedUserPermitMetaData.owner, signedUserPermitMetaData.deadline,
            signedUserPermitMetaData.v, signedUserPermitMetaData.r,
            signedUserPermitMetaData.s])

    const request = await buildRequest(forwarder, {
        to: registry.address, from: metaTxnInitiator, data:uniswapExchangeData
    });

    const metaTxnEIP712TypedData = await buildTypedData(forwarder, request)
    res.send(JSON.stringify(metaTxnEIP712TypedData))
})

relaytxn.post('/relaymetatxn', async function (req, res) {
    const payload = req.body
    require('dotenv').config();
    const { RELAYER_API_KEY: apiKey, RELAYER_API_SECRET: apiSecret } = process.env;
    console.log("payload",payload)
    handler({ apiKey, apiSecret, request: { body: payload } })
        .then(() => process.exit(0))
        .catch(error => { console.error(error); process.exit(1); });
})

module.exports = relaytxn