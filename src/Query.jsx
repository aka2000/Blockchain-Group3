import axios from "axios";
import { CLPublicKey } from "casper-js-sdk";

const Query = (props) => {
    return <button onClick={() => query(props)}>Query</button>;
};

const query = (props) => {
    const accountHash = CLPublicKey.fromHex(props.publicKey).toAccountHashStr().substring(13);
    axios
        .get("/queryMessage?accountHash=" + accountHash)
        .then((response) => {
            alert(response.data);
        })
        .catch((error) => {
            console.error(error.message);
        });
};

export default Query;