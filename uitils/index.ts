import { 
  Contract, 
  ethers, 
  getDefaultProvider, 
  providers 
} from "ethers";


import {
  Environment,
  EvmChain,
  AddGasOptions,
  AxelarGMPRecoveryAPI,
  AxelarQueryAPI,
  GasToken
} from "@axelar-network/axelarjs-sdk";

import ERC20MegaVote from "../artifacts/contracts/ERC20MegaVote.sol/ERC20MegaVote.json";
import MegaVoteMaster from "../artifacts/contracts/MegaVoteMaster.sol/MegaVoteMaster.json";
import IERC20 from "../artifacts/contracts/lib/interfaces/IERC20.sol/IERC20.json";
import { wallet } from "../config/constants";

let chains = require("../config/testnet.json")

const sourceChain = chains.find(
  (chain: any) => chain.name === "Avalanche",
) as any;

const useMetamask = false; // typeof window === 'object';

// Avax wallet
const sourceProvider = getDefaultProvider(sourceChain.rpc);
const sourceConnectedWallet = wallet.connect(sourceProvider);

const sourceContract = new Contract(
  sourceChain.ERC20MegaVote as string,
  ERC20MegaVote.abi,
  sourceConnectedWallet,
);

const tokenAddress = sourceChain.ERC20MegaVote


//EVM chains:

const EvmChainSource = sourceChain.AxelarName as EvmChain

// Functions:
export function truncatedAddress(address: string): string {
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 4)
  );
}

export async function getVotingPower(campaignId: string, Destchain: string) {

  const destinationChain = chains.find(
    (chain: any) => chain.AxelarName === Destchain,
  ) as any;
  // Dest Wallet

  const destinationProvider = useMetamask
    ? new providers.Web3Provider((window as any).ethereum)
    : getDefaultProvider(destinationChain.rpc);

  const destinationConnectedWallet = useMetamask
    ? (destinationProvider as providers.Web3Provider).getSigner()
    : wallet.connect(destinationProvider);

  const destContract = new Contract(
    destinationChain.MegaVoteMaster as string,
    MegaVoteMaster.abi,
    destinationConnectedWallet,
  );

  const campaignInfo = await destContract
    .campaigns(campaignId)

  var VP = Number((campaignInfo.totalVotes)._hex)

  return (VP/1e18).toString()
}

export async function sendTokenToVote(
  amount: string,
  Destchain: string,
  campaignId: string,
  onSent: (txhash: string) => void,
) {

  const destinationChain = chains.find(
    (chain: any) => chain.AxelarName === Destchain,
  ) as any;
  // Dest Wallet

  const erc20 = new Contract(
    tokenAddress,
    IERC20.abi,
    sourceConnectedWallet,
  );

  // Approve the token for the amount to be sent
  await erc20
    .approve(sourceContract.address, ethers.utils.parseUnits(amount, 18))
    .then((tx: any) => tx.wait());

  // Send the token
  const receipt = await sourceContract
  
  .vote(
    ethers.utils.parseUnits(amount, 18),
    campaignId,
    Destchain,
    destinationChain.MegaVoteMaster
  )
  .then((tx: any) => tx.wait());

    
  const api = new AxelarGMPRecoveryAPI({ environment: Environment.TESTNET });
  const sdk = new AxelarQueryAPI({ environment: Environment.TESTNET });

    // Calculate how much gas to pay to Axelar to execute the transaction at the destination chain
  const gasamount = await sdk.estimateGasFee(
    EvmChain.AVALANCHE,
    Destchain as EvmChain,
    GasToken.AVAX,
    1000000,
    2
  );
  // Optional gas
  const options: AddGasOptions = {
    amount: gasamount, // Amount of gas to be added. If not specified, the sdk will calculate the amount automatically.
    evmWalletDetails: { useWindowEthereum: false, privateKey: wallet.privateKey }
  };

  const gasFees = await api
  .addNativeGas(
    EvmChainSource,
    receipt.transactionHash,
    options
  );
  
  //transaction:

  console.log({
    txHash: receipt.transactionHash,
    gasHash: gasFees.transaction?.transactionHash
  });
  onSent(receipt.transactionHash);
}


export async function sendTokenToDistribute(
  amount: string[],
  chain: string[],
  recipient: string[],
  onSent: (txhash: string) => void,
) {

  const erc20 = new Contract(
    tokenAddress,
    IERC20.abi,
    sourceConnectedWallet,
  );
  
  var total = 0

  for (let i = 0; i < amount.length; i++) {
    total += Number(amount[i])
  }

  // Approve the token for the amount to be sent
  await erc20
    .approve(sourceContract.address, ethers.utils.parseUnits(total.toString(), 18))
    .then((tx: any) => tx.wait());

  // Preparation
  var uniqueChains = chain.filter((v, i, a) => a.indexOf(v) === i)

  // Distribute tokens
  for (const Chain of uniqueChains) {
    var TempChain = chains.find(
      (chain: any) => chain.AxelarName === Chain,
    ) as any;

    console.log(Chain, ":")

    var TempRecipients = []

    for (let i = 0; i < chain.length; i++) {
      if (chain[i] === Chain) {
        TempRecipients.push(recipient[i])
      }
    }

    var TempAmount = []

    for (let i = 0; i < chain.length; i++) {
      if (chain[i] === Chain) {
        TempAmount.push(ethers.utils.parseUnits(amount[i], 18))
      }
    }

    const EvmChainDest = TempChain.AxelarName as EvmChain

    const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

    const receipt = await sourceContract
      .transferRemote(
        Chain,
        TempChain.ERC20MegaVote,
        TempRecipients,
        TempAmount
      )
      .then((tx: any) => tx.wait());
    
    const sdk = new AxelarGMPRecoveryAPI({ environment: Environment.TESTNET });
        
    const gasamount = await api.estimateGasFee(
      EvmChainSource,
      EvmChainDest,
      GasToken.AVAX,
      1000000,
      2
    );

    const options: AddGasOptions = {
      amount: gasamount, // Amount of gas to be added. If not specified, the sdk will calculate the amount automatically.
      evmWalletDetails: { useWindowEthereum: false, privateKey: wallet.privateKey }
    };

    const gasFees = await sdk
    .addNativeGas(
        EvmChainSource,
        receipt.transactionHash,
        options
    );
    
    console.log({
      txHash: receipt.transactionHash
    });
    onSent(receipt.transactionHash);
  }
}



export async function getBalance(addresses: string[]) {
  const connectedWallet = sourceConnectedWallet
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