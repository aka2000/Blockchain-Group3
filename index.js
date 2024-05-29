const fs = require('fs')
const { RuntimeArgs, CLValueBuilder, Contracts, CasperClient, Keys } = require('casper-js-sdk')

const client = new CasperClient("http://3.208.91.63:7777/rpc")
const contract = new Contracts.Contract(client)
const keys = Keys.Ed25519.loadKeyPairFromPrivateFile("./keys/secret_key.pem")

const wasm = new Uint8Array(fs.readFileSync("contract/target/wasm32-unknown-unknown/release/contract.wasm"))

async function install() {
    const args = RuntimeArgs.fromMap({
    	"message": CLValueBuilder.string("Hello world!")
    })
    
    const deploy = contract.install(
        wasm,
        args,
        "20000000000",
        keys.publicKey,
        "casper-test",
        [keys]
    )
    
    try {
    	 return (await client.putDeploy(deploy))
    } catch(error) {
    	return error
    }
}

install().then(deployHash => console.log(deployHash)).catch(error => console.error(error))
