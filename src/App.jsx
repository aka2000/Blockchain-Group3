import React from "react";
import Connect from "./Connect";
import UpdateMessage from "./UpdateMessage";
import Query from "./Query";
import "./App.css";

function App() {
    const [publicKey, setPublicKey] = React.useState(null);
    return (
        <>
            <Connect setPublicKey={setPublicKey} />
            <div>
                {publicKey !== null && (
                    <>
                        Wallet connected: {publicKey}
                        <br />
                        <UpdateMessage publicKey={publicKey} />
                        <Query publicKey={publicKey} />
                    </>
                )}
            </div>
        </>
    );
}