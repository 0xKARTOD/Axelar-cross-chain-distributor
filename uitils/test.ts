import { 
  BigNumber,
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
    AxelarGMPRecoveryAPI,
    AxelarRecoveryApi,
    AxelarGateway,
    ApproveGatewayResponse,
    ApproveGatewayError
  } from "@axelar-network/axelarjs-sdk";
  
  import AxelarGatewayContract from "../artifacts/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol/IAxelarGateway.json";
  import ERC20MegaVote from "../artifacts/contracts/ERC20MegaVote.sol/ERC20MegaVote.json";
  import MegaVoteMaster from "../artifacts/contracts/MegaVoteMaster.sol/MegaVoteMaster.json";
  import IERC20 from "../artifacts/contracts/lib/interfaces/IERC20.sol/IERC20.json";
  import { wallet } from "../config/constants";
import EVMClient from "@axelar-network/axelarjs-sdk/dist/src/libs/TransactionRecoveryApi/client/EVMClient";
  
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


  async function main() {
    var EvmChainSource = avalancheChain.AxelarName as EvmChain

    //console.log(EvmChain.AVALANCHE)
    //console.log(EvmChainSource)

    console.log(typeof(EvmChain.AVALANCHE))
    console.log(typeof(EvmChainSource))
  }

  main()