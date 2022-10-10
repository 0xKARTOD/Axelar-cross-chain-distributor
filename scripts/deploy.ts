import hre from "hardhat"
import AxelarAddresses from "./AxelarAddresses.json"


//deploy script
async function deploy() {
    const networkName = hre.network.name;
    console.log("Deploying on chain:", networkName)
    console.log("Params:", AxelarAddresses[networkName])
    const Erc20Factory = await hre.ethers.getContractFactory("ERC20MegaVote")
    const erc20Contract = await Erc20Factory.deploy(
        "MVote",
        "MVOTE",
        AxelarAddresses[networkName].gateway,
        AxelarAddresses[networkName].gasService,
    )
    console.log("ERC20MegaVote deployed to", erc20Contract.address)

    const MasterFactory = await hre.ethers.getContractFactory("MegaVoteMaster")
    const masterContract = await MasterFactory.deploy(
        AxelarAddresses[networkName].gateway,
    )
    console.log("MegaVoteMaster deployed to", masterContract.address)

    await masterContract.createCampaign("Test Campaign");
}

deploy()
