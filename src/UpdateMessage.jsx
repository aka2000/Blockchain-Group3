import { useState } from "react";
import { Contracts, CasperClient, RuntimeArgs, CLValueBuilder, CLPublicKey, DeployUtil } from "casper-js-sdk";
import axios from "axios";
import { getProvider } from "./casper-wallet";

const provider = getProvider();

const UpdateMessage = (props) => {
    const [message, setMessage] = useState("");

    return (
        <>
            <input
                id="message"
                type="text"
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value);
                }}
            />
            <button onClick={() => updateMessage(props, message)}>Update Message</button>
        </>
    );

    const NODE_URL = "http://65.108.127.242:7777/rpc";
const NETWORK_NAME = "casper-test"; // "casper" for mainnet
const CONTRACT_HASH = "hash-75143aa708275b7dead20ac2cc06c1c3eccff4ffcf1eb9aebb8cce7c35cea041";

const updateMessage = (props, message) => {
    const casperClient = new CasperClient(NODE_URL);
    const contract = new Contracts.Contract(casperClient);
    contract.setContractHash(CONTRACT_HASH);
    const runtimeArguments = RuntimeArgs.fromMap({
        message: CLValueBuilder.string(message),
    });
    const deploy = contract.callEntrypoint(
        "update_message",
        runtimeArguments,
        CLPublicKey.fromHex(props.publicKey),
        NETWORK_NAME,
        "1000000000", // 1 CSPR (10^9 Motes)
    );
    const deployJSON = DeployUtil.deployToJson(deploy);
    provider
        .sign(JSON.stringify(deployJSON), props.publicKey)
        .then((signedDeploy) => {
            // Initiates sign request
            axios
                .post("/sendDeploy", signedDeploy, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    alert(response.data);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        })
        .catch((error) => {
            console.error(error.message);
        });
};
};


export default UpdateMessage;