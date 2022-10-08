import cn from "classnames";
import type { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import { wallet } from "../config/constants";

import {
  truncatedAddress,
  sendTokenToVote,
  getBalance,
  getVotingPower
} from "../uitils";

const Home: NextPage = () => {
  const [totalVPbalances, settotalVPbalances] = useState<string>();
  const [senderBalance, setSenderBalance] = useState<string>();
  const [VoteTxHash, setVoteTxHash] = useState<string>();
  const [CampaignID, setCampaignID] = useState<string>();
  const [loading, setLoading] = useState(false);


  const [DistributeTxHash, setDistributeTxHash] = useState<string>();
  const [recipientAddresses, setRecipientAddresses] = useState<string[]>([]);
  const [recipientAmounts, setrecipientAmounts] = useState<string[]>([]);
  const [recipientChain, setrecipientChain] = useState<string[]>([]);

  async function handleOnSubmitVote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const amount = formData.get("Voteamount") as string;

    setLoading(true);
    await sendTokenToVote(amount, setVoteTxHash).finally(
      () => {
        setLoading(false);
        handleRefreshSenderBalance();
        handleRefreshVotingPower();
      },
    );
  };

  async function RefreshRecipientsData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const amount = formData.get("Sendamount") as string;
    const chain = formData.get("chain") as string;
    const address = formData.get("address") as string;

    handleRefreshRecipients(address, chain, amount)
  };

  const handleRefreshVotingPower = useCallback(async () => {
    const _totalVPbalances = await getVotingPower("0")
    settotalVPbalances(_totalVPbalances);
  }, []);

  const handleRefreshSenderBalance = useCallback(async () => {
    const [_balance] = await getBalance([wallet.address], true);
    setSenderBalance(_balance);
  }, []);

  const handleRefreshRecipients = (address: string,chain: string, amount: string ) => {
    setRecipientAddresses([...recipientAddresses, address]);
    setrecipientAmounts([...recipientAmounts, amount]);
    setrecipientChain([...recipientChain, chain]);
  };

  useEffect(() => {
    handleRefreshSenderBalance();
    handleRefreshVotingPower();
  }, [handleRefreshSenderBalance, handleRefreshVotingPower]);

  return (
    <div>
        <div className="con row-span-1 card bg-dark text-white">
            <h1 className="text-4xl text-white font-medium text-center">
        
              Cross Chain Distributor and DAO voter
            </h1>
              <h2 className="text-white text-center">Built by Impossible JoJo team</h2>
          
          <div className="card-body mx-auto">
            <h2 className="card-title">
              Total voting power: {totalVPbalances} MVOTE.     
              Select a campaigns ID: 
              <form action="#">
                <select className="text-black" name="campaigns" id="Idcamp" /*onChange={SelectCampaignID}*/>
                  <option value="0">0</option>
                  <option value="1">1</option>
                </select>
              </form>
            
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
                Voting is a method for a group, such as a meeting or an electorate, in order to make a collective decision or express an opinion usually following discussions, debates or election campaigns.
              </div>
              <div className="card-body">
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
                        <span className="label-text">Token amount</span>
                      </label>
                      <div className="w-full input-group">
                        <input
                          disabled={loading}
                          required
                          name="Voteamount"
                          type="number"
                          placeholder="Enter amount to vote"
                          className="w-full input input-bordered"
                        />
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
                <h2 className="card-title">Connected wallet (Distributor):</h2>

                <p>
                  Sender ({truncatedAddress(wallet.address)}) balance:{" "} 
                  {senderBalance} MVOTE
                  {}
                </p>

                <label className="label">
                  <h2 className="card-title">Recepients:</h2>
                </label>

                  Address : {"    "}
                  <p>
                    {recipientAddresses.map((recipientAddress) => (
                      <span key={recipientAddress} className="mt-1">
                        {" "}
                        {truncatedAddress(recipientAddress)}
                        {", "}
                      </span>
                    ))}
                  </p>

                  Chains ID: {"    "}
                  <p>
                    {recipientChain.map((recipientChains) => (
                      <span key={recipientChains} className="mt-1">
                        {" "}
                        {(recipientChains)}
                        {", "}
                      </span>
                    ))}
                  </p>
                  Amounts : {"    "}
                  <p>
                    {recipientAmounts.map((recipientAmount) => (
                      <span key={recipientAmount} className="mt-1">
                        {" "}
                        {(recipientAmount).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                        {", "}
                      </span>
                    ))}
                  </p>

                <div className="justify-end mt-2 card-actions">
                  <form
                    className="flex flex-col w-full"
                    onSubmit={RefreshRecipientsData}
                    >
                    <div>
                      <label className="label">
                        <span className="label-text">Token amount</span>
                      </label>
                      <div className="w-full input-group">
                        <input
                          disabled={loading}
                          required
                          name="Sendamount"
                          type="number"
                          placeholder="Enter amount to send"
                          className="w-full input input-bordered"
                        />
                        <input
                          disabled={loading}
                          required
                          name="address"
                          type="text"
                          placeholder="Enter destination address"
                          className="w-full input input-bordered"
                        />
                        <input
                          disabled={loading}
                          required
                          name="chain"
                          type="text"
                          placeholder="Enter destination chain ID"
                          className="w-full input input-bordered"
                        />
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
                      //onSubmit={}
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

      </div>
  );
};

export default Home;
