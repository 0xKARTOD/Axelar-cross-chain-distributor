import cn from "classnames";
import type { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import { wallet } from "../config/constants";

import {
  truncatedAddress,
  sendTokenToVote,
  getBalance,
  getVotingPower,
  sendTokenToDistribute
} from "../uitils";

const Home: NextPage = () => {
  const [totalVPbalances, settotalVPbalances] = useState<string>();
  const [senderBalance, setSenderBalance] = useState<string>();
  const [VoteTxHash, setVoteTxHash] = useState<string>();
  const [loading, setLoading] = useState(false);


  const [DistributeTxHash, setDistributeTxHash] = useState<string>();
  const [recipientAddresses, setRecipientAddresses] = useState<string[]>([]);
  const [recipientAmounts, setrecipientAmounts] = useState<string[]>([]);
  const [recipientChain, setrecipientChain] = useState<string[]>([]);

  /*DISTRIBUTE PART*/

  async function handleOnSubmitDistribute(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();


    setLoading(true);
    await sendTokenToDistribute(recipientAmounts,recipientChain,recipientAddresses, setDistributeTxHash).finally(
      () => {
        setLoading(false);
        handleRefreshSenderBalance();
      },
    );
  };

  async function RefreshRecipientsData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const amount = formData.get("Sendamount") as string;
    const chain = formData.get("DestinationChainDistributor") as string;
    const address = formData.get("address") as string;

    handleRefreshRecipients(address, chain, amount)
  };

  /*VOTE PART*/

  async function handleOnSubmitVote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const amount = formData.get("Voteamount") as string;
    const destchain = formData.get("DestinationChainVote") as string;
    const campId = formData.get("VoteID") as string;

    setLoading(true);
    await sendTokenToVote(amount, destchain, campId, setVoteTxHash).finally(
      () => {
        setLoading(false);
        handleRefreshSenderBalance();
      },
    );
  };

  async function handleRefreshCampaignInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const ID = formData.get("CampID") as string;
    const ChainDest = formData.get("DestinationChain") as string;
    //const ChainDest = "avalanche";

    handleRefreshVotingPower(ID, ChainDest)
  };

  const handleRefreshVotingPower = useCallback(async (CampaignID: string, DestinationChain: string) => {
    const _totalVPbalances = await getVotingPower(CampaignID, DestinationChain)
    settotalVPbalances(_totalVPbalances);
  }, []);

  const handleRefreshSenderBalance = useCallback(async () => {
    const [_balance] = await getBalance([wallet.address]);
    setSenderBalance(_balance);
  }, []);

  const handleRefreshRecipients = (address: string,chain: string, amount: string ) => {
    setRecipientAddresses([...recipientAddresses, address]);
    setrecipientAmounts([...recipientAmounts, amount]);
    setrecipientChain([...recipientChain, chain]);
  };

  useEffect(() => {
    const FirstID = "0"
    handleRefreshSenderBalance();
    handleRefreshVotingPower(FirstID, "binance");
  }, [handleRefreshSenderBalance, handleRefreshVotingPower]);

  return (
    <div>
      <div className="con row-span-1 card text-white">
        <h1 className="text-4xl text-white font-bold text-center">
          Cross Chain<br></br> 
          Distributor & DAO voter
        </h1>
        <h2 className="text-white text-center">Built by Impossible JoJo team</h2>
          
        <div className="card-body mx-auto">
          <div className="center-text-black-border">
            To get the total voting power for a particular campaign,<br></br>
            select chain from the list below and aslo write the campaign ID.<br></br>
             And press "SELECT".<br></br>
          </div>
          <figure
            className="center-text-picture"
          />
          <h2 className="card-title mx-auto">
            Select a campaign ID: 
          </h2>
          <div className="form-control">
            <form
              className="flex flex-col w-full"
              onSubmit={handleRefreshCampaignInfo}
            >
              <div>
                <div className="w-full input-group">
                  <input
                    disabled={loading}
                    required
                    name="CampID"
                    type="number"
                    placeholder="Enter Campaign ID"
                    className="text-field__input"
                  />
                  <select className="select_list" name="DestinationChain">
                    <option value="binance">Binance</option>
                    <option value="avalanche">Avalanche</option>
                  </select>
                  <button
                    className={cn("btn btn-primary", {
                      loading,
                      "opacity-30":
                      loading,
                      "opacity-100":
                      !loading,
                    })}
                      type="submit"
                  >
                    SELECT
                  </button>
                </div>
              </div>
            </form>
          </div>
          <h2 className="card-title mx-auto">
            Total voting power: {totalVPbalances} MVOTE.
          </h2>
        </div>
      </div>

      <div className="col">
        <div className="gap-20 mt-10 justify-items-center ">
          {/* Voter part */}
          <div className="row-span-2 shadow-xl card w-100 bg-base-100">
            <div className="card-body">
              <h1 className="text-4xl font-medium text-center">
                Cross Chain DAO voter
              </h1>
            </div>
            <div className="card-body">
              <p className="center-text">
                In this part you can vote for a certain proposal.
              </p>
              <p>
                Steps for voting:<br></br>
                - Input the specific campaign ID and amount at the input line<br></br>
                - Select Chain<br></br>
                - Press "VOTE"<br></br>
              </p>
              <h2 className="card-title">Connected wallet (Voter):</h2>

                <p>
                  Voter ({truncatedAddress(wallet.address)}) balance:{" "} 
                  {senderBalance} MVOTE
                  {}
                </p>
                <div className="justify-end mt-2 card-actions">
                  <form
                    className="flex flex-col w-full"
                    onSubmit={handleOnSubmitVote}
                  >
                    <div>
                      <label className="label">
                        <span className="label-text">Proposal Information:</span>
                      </label>
                      <div className="w-full input-group">
                        <input
                          disabled={loading}
                          required
                          name="Voteamount"
                          type="number"
                          placeholder="Enter amount"
                          className="w-full input input-bordered"
                        />
                        <input
                          disabled={loading}
                          required
                          name="VoteID"
                          type="number"
                          placeholder="Enter Campaign"
                          className="w-full input input-bordered"
                        />
                        <select disabled={loading} required className="select_list" name="DestinationChainVote">
                          <option value="binance">Binance</option>
                          <option value="avalanche">Avalanche</option>
                        </select>
                        <button
                          className={cn("btn btn-primary", {
                            loading,
                            "opacity-30":
                            loading,
                            "opacity-100":
                            !loading,
                          })}
                            type="submit"
                        >
                          VOTE
                        </button>
                      </div>
                    </div>
                    {VoteTxHash && (
                        <a
                          href={`https://testnet.axelarscan.io/gmp/${VoteTxHash}`}
                          className="mt-2 link link-accent"
                          target="blank"
                        >
                          Track your vote at axelarscan
                        </a>
                    )}
                  </form>
                </div>
            </div>
          </div>
        </div>
      </div>
          


      <div className="col">
        <div className="gap-20 mt-10 justify-items-center">
            {/* Distributor part */}
          <div className="row-span-2 shadow-xl card w-100 bg-base-100">
            <div className="card-body">
              <h1 className="text-4xl font-medium text-center">
                Cross Chain Distributor
              </h1>
            </div>
            <div className="card-body">
              <p className="center-text">
                Before you start voting, you need to distribute tokens to users.
              </p>
              <p>
                In this case you need to: <br></br>
                - Input the specific address, chains and amounts below <br></br>
                - After each entry, press "ADD" <br></br>
                - And click on "DISTRIBUTE TOKENS" <br></br>
              </p>
              <h2 className="card-title">Connected wallet (Distributor):</h2>

              <p>
                Sender ({truncatedAddress(wallet.address)}) balance:{" "} 
                {senderBalance} MVOTE
                {}
              </p>

              <label className="label">
                <h2 className="card-title">Recepients:</h2>
              </label>

              <div className="h-20">
                <div className="w-full max-w-xs form-control">
                  <div>
                    {recipientAddresses.map((recipientAddress, i) => (
                      <div
                        key={recipientAddress}
                        className="flex justify-between"
                      >
                        <span>{truncatedAddress(recipientAddress)}</span>
                        <span className="font-bold">
                          {". "}
                          {"Chain ID : "}
                          {recipientChain[i]}
                          {"; "}
                          {" Amount : "}
                          {recipientAmounts[i] || `0.00`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="justify-end mt-2 card-actions">
                <form
                  className="flex flex-col w-full"
                  onSubmit={RefreshRecipientsData}
                  >
                  <div>
                    <label className="label">
                      <span className="label-text">Recepient Information</span>
                    </label>
                    <div className="w-full input-group">
                      <input
                        disabled={loading}
                        required
                        name="Sendamount"
                        type="number"
                        placeholder="Enter amount"
                        className="w-full input input-bordered"
                      />
                      <input
                        disabled={loading}
                        required
                        name="address"
                        type="text"
                        placeholder="Enter address"
                        className="w-full input input-bordered"
                      />
                      <select disabled={loading} required className="select_list" name="DestinationChainDistributor">
                        <option value="binance">Binance</option>
                        <option value="avalanche">Avalanche</option>
                      </select>
                      <button
                        className={cn("btn btn-primary", {
                          loading,
                          "opacity-30":
                          loading,
                          "opacity-100":
                          !loading,
                        })}
                          type="submit"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                  {DistributeTxHash && (
                    <a
                      href={`https://testnet.axelarscan.io/gmp/${DistributeTxHash}`}
                      className="mt-2 link link-accent"
                      target="blank"
                      >
                      Track your token send at axelarscan
                    </a>
                  )}
                </form>
                <div className="justify-end mt-2 card-actions">
                  <form
                    className="flex flex-col w-full"
                    onSubmit={handleOnSubmitDistribute}
                    >
                    <button
                      className={cn("btn btn-primary", {
                        loading,
                        "opacity-30":
                        loading,
                        "opacity-100":
                        !loading,
                      })}
                        type="submit"
                    >
                      DISTRIBUTE TOKENS
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p>
        -
      </p>
      
    </div>
  );
};

export default Home;