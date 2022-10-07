import { 
  Contract, 
  ethers, 
  getDefaultProvider, 
  providers 
} from "ethers";


import {
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GasToken,
  AddGasOptions,
  AxelarGMPRecoveryAPI
} from "@axelar-network/axelarjs-sdk";

import AxelarGatewayContract from "../artifacts/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol/IAxelarGateway.json";
import ERC20MegaVote from "../artifacts/contracts/ERC20MegaVote.sol/ERC20MegaVote.json";
import MegaVoteMaster from "../artifacts/contracts/MegaVoteMaster.sol/MegaVoteMaster.json";
import IERC20 from "../artifacts/contracts/lib/interfaces/IERC20.sol/IERC20.json";
import { wallet } from "../config/constants";

let chains = require("../config/testnet.json")

const binanceChain = chains.find(
  (chain: any) => chain.name === "Binance",
) as any;
const avalancheChain = chains.find(
  (chain: any) => chain.name === "Avalanche",
) as any;

if (!binanceChain || !avalancheChain) process.exit(0);

const useMetamask = false; // typeof window === 'object';


// Binance wallet
const binanceProvider = useMetamask
  ? new providers.Web3Provider((window as any).ethereum)
  : getDefaultProvider(binanceChain.rpc);
const binanceConnectedWallet = useMetamask
  ? (binanceProvider as providers.Web3Provider).getSigner()
  : wallet.connect(binanceProvider);

// Avax wallet
const avalancheProvider = getDefaultProvider(avalancheChain.rpc);
const avalancheConnectedWallet = wallet.connect(avalancheProvider);

//Gateway on Avax
const srcGatewayContract = new Contract(
  avalancheChain.gateway,
  AxelarGatewayContract.abi,
  avalancheConnectedWallet,
);

//Gateway on Binance
const destGatewayContract = new Contract(
  binanceChain.gateway,
  AxelarGatewayContract.abi,
  binanceConnectedWallet,
);

const sourceContract = new Contract(
  avalancheChain.ERC20MegaVote as string,
  ERC20MegaVote.abi,
  avalancheConnectedWallet,
);

const destContract = new Contract(
  binanceChain.MegaVoteMaster as string,
  MegaVoteMaster.abi,
  binanceConnectedWallet,
);

const tokenAddress = '0x011BEf8ED1F08daCA5073B76Ffb8a3398a77d94b';

// Functions:
export function truncatedAddress(address: string): string {
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 4)
  );
}

export async function getVotingPower(campaignId: string) {
  const campaignInfo = await destContract
    .campaigns(campaignId)

  var VP = Number((campaignInfo.totalVotes)._hex)

  return (VP/1e18).toString()
}

export async function sendTokenToVote(
  amount: string,
  onSent: (txhash: string) => void,
) {
  //const tokenAddress = '0x011BEf8ED1F08daCA5073B76Ffb8a3398a77d94b'

  const erc20 = new Contract(
    tokenAddress,
    IERC20.abi,
    avalancheConnectedWallet,
  );

  // Approve the token for the amount to be sent
  await erc20
    .approve(sourceContract.address, ethers.utils.parseUnits(amount, 18))
    .then((tx: any) => tx.wait());


  // Send the token
  const receipt = await sourceContract
  
  .vote(
    ethers.utils.parseUnits(amount, 18),
    0, //temp Campaning ID
    "binance",
    destContract.address
  )
  .then((tx: any) => tx.wait());

    
  const api = new AxelarGMPRecoveryAPI({ environment: Environment.TESTNET });
  
  // Optional gas
  const options: AddGasOptions = {
    amount: "200000000000000000", // Amount of gas to be added. If not specified, the sdk will calculate the amount automatically.
    evmWalletDetails: { useWindowEthereum: false, privateKey: wallet.privateKey }
  };

  const gasFees = await api
  .addNativeGas(
    EvmChain.AVALANCHE,
    receipt.transactionHash,
    options
  );

  //transaction:

  console.log({
    txHash: receipt.transactionHash,
    gasHash: gasFees.transaction?.transactionHash
  });
  onSent(receipt.transactionHash);

  // Wait destination contract to execute the transaction.
  return new Promise((resolve, reject) => {
    destContract.on("Executed", () => {
      destContract.removeAllListeners("Executed");
      resolve(null);
    });
  });
}




export async function getBalance(addresses: string[], isSource: boolean) {
  const contract = isSource ? srcGatewayContract : destGatewayContract;
  const connectedWallet = isSource
    ? avalancheConnectedWallet
    : binanceConnectedWallet;
  //const tokenAddress = '0x011BEf8ED1F08daCA5073B76Ffb8a3398a77d94b'
  const erc20 = new Contract(tokenAddress, IERC20.abi, connectedWallet);
  const balances = await Promise.all(
    addresses.map(async (address) => {
      const balance = await erc20.balanceOf(address);
      return ethers.utils.formatUnits(balance, 18);
    }),
  );
  return balances;
}