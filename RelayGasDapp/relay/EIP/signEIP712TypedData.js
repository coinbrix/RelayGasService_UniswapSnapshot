
const signData = async function (signer, from, data) {

    if (typeof (signer) === 'string') {
        const privateKey = Buffer.from(signer.replace(/^0x/, ''), 'hex');
        return ethSigUtil.signTypedMessage(privateKey, {data});
    }

    const isHardhat = data.domain.chainId == 31337;
    const [method, argData] = isHardhat
        ? ['eth_signTypedData_v4', JSON.stringify(data)]
        : ['eth_signTypedData_v4', JSON.stringify(data)]
    return await signer.send(method, [from, argData]);
};

module.exports = {signData}