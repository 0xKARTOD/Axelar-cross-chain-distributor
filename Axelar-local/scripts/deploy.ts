import '@nomiclabs/hardhat-ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import hre from "hardhat"
import chains from "../local.json"


//deploy script
async function deploy() {
    /*
        DEPLOY ON CHAINS LIST
    */
    const chainId = hre.network.config.chainId
    const chainInfo = chains.find(chain => chain.chainId == chainId)
    if (!chainInfo) return
    const [signer] = await hre.ethers.getSigners()

    const MessageSenderFactory = await hre.ethers.getContractFactory("MessageSender")
    const messageSender = await MessageSenderFactory.deploy(chainInfo.gateway, chainInfo.gasReceiver)
    console.log("Deployed contract to:", messageSender.address)
    console.log("Gateway:", chainInfo.gateway)
    console.log("Gas Receiver:", chainInfo.gasReceiver)
    console.log("Signed by:", signer.address)
    console.log("On chain:", chainId)

    const MessageReceiverFactory = await hre.ethers.getContractFactory("MessageReceiver")
    const messageReceiver = await MessageReceiverFactory.deploy(chainInfo.gateway, chainInfo.gasReceiver)
    console.log("Deployed contract to:", messageSender.address)
    console.log("Gateway:", chainInfo.gateway)
    console.log("Gas Receiver:", chainInfo.gasReceiver)
    console.log("Signed by:", signer.address)
    console.log("On chain:", chainId)
}

deploy()
