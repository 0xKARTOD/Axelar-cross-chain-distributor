import { getDefaultProvider } from "ethers";
import { wallet } from "../config/constants";


const {
  utils: { deployContract },
} = require("@axelar-network/axelar-local-dev");

// load contracts
const MegaDisperse = require("../artifacts/contracts/MegaDisperse.sol/MegaDisperse.json");

let chains = require("../local.json");


//deploy script
async function deploy() {
    /*
        DEPLOY ON CHAINS LIST
    */
    
    for (const Chain of chains) {
        //const Chain = chains.find((chain: any) => chain.name === chains[i].name)
        
        const Provider = getDefaultProvider(Chain.rpc)
        const ConnectedWallet = wallet.connect(Provider)
        
        const Disperse = await deployContract(
            ConnectedWallet,
            MegaDisperse,
            [Chain.gateway, Chain.gasReceiver]
        )
        
        console.log(
            "MegaDisperse deployed on", Chain.name, ":",
            Disperse.address,
        )
    }
}

deploy();