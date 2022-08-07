import {createPermitMessageData} from "../EIP/generatePermitData";
import {signData} from "../EIP/signEIP712TypedData";


const generateUniSwapPermitEIP712 = async function() {
    const {NAME: name, PRIVATE_KEY: signer} = process.env;
    const messageData = createPermitMessageData();
    const result = await signData(signer, fromAddress, messageData.typedData);
    console.log(`result:`, result);

    const r = result.slice(0, 66);
    const s = "0x" + result.slice(66, 130);
    const v = Number("0x" + result.slice(130, 132));
    let cleanRequest = {
        owner: messageData.message.owner,
        spender: messageData.message.spender,
        value: messageData.message.value,
        deadline: messageData.message.deadline
    };

    const requestPayload = Object.assign({}, cleanRequest, {
        v,
        r,
        s
    });
}

module.exports = {generateUniSwapPermitEIP712}