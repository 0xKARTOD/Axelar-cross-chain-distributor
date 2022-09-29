
import { getDefaultProvider } from "ethers";
import { wallet } from "../config/constants";

const {
  utils: { deployContract },
} = require("@axelar-network/axelar-local-dev");

// load contracts
const MessageSenderContract = require("../artifacts/contracts/MessageSender.sol/MessageSender.json");
const MessageReceiverContract = require("../artifacts/contracts/MessageReceiver.sol/MessageReceiver.json");

let chains = require("../local.json");


//deploy script
async function deploy() {
    /*
        DEPLOY ON CHAINS LIST
    */
    for (let i = 0; i < chains.length; i++) {
        const Chain = chains.find((chain: any) => chain.name === chains[i].name)
        
        const Provider = getDefaultProvider(Chain.rpc)
        const ConnectedWallet = wallet.connect(Provider)

        const Sender = await deployContract(
            ConnectedWallet,
            MessageSenderContract,
            [Chain.gateway, Chain.gasReceiver],
        )
        console.log("MessageSender deployed on ", Chain.name, ":", Sender.address)

        Chain.messageSender = Sender.address

        const Receiver = await deployContract(
            ConnectedWallet,
            MessageReceiverContract,
            [Chain.gateway, Chain.gasReceiver],
        )
        
        console.log(
            "MessageReceiver deployed on", Chain.name, ":",
            Receiver.address,
        )
        Chain.messageReceiver = Receiver.address
    }
}

deploy()