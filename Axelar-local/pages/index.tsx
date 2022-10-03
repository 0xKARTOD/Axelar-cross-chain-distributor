import cn from "classnames";
import type { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";


const Home: NextPage = () => {

  return (
    <div>
      <div>
        <h1 className="text-4xl font-medium text-center">
        Cross Chain Disperse App (CCDA)
        </h1>
        <h2 className="text-base text-center">Built by Impossible JoJo team</h2>

        <div className="grid grid-cols-2 gap-20 mt-20 justify-items-center">
          {/* source chain card */}
          <div className="row-span-2 shadow-xl card w-96 bg-base-100">
            <figure
              className="h-64 bg-center bg-no-repeat bg-cover image-full"
              style={{ backgroundImage: "url('/assets/ethereum.gif')" }}
            />
            <div className="card-body">
              <h2 className="card-title">Ethereum (Token Sender)</h2>

              <p>
                Sender () balance:{" "}
                {}
              </p>

              <label className="label">
                <span className="label-text">Recepients</span>
              </label>

              <div className="justify-end mt-2 card-actions">
                <form
                  className="flex flex-col w-full"
                  //onSubmit={}
                >
                  <div>
                    <label className="label">
                      <span className="label-text">Token amount</span>
                    </label>
                    <div className="w-full input-group">
                      <input
                        name="amount"
                        type="number"
                        placeholder="Enter amount to send"
                        className="w-full input input-bordered"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Chain ID</span>
                    </label>
                    <div className="w-full input-group">
                      <input
                        name="chain"
                        type="text"
                        placeholder="Enter Chain ID for this address"
                        className="w-full input input-bordered"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">EVM Address</span>
                    </label>
                    <label className="w-full input-group">
                      <input
                        type="text"
                        placeholder="Enter address"
                        className="w-full input input-bordered"
                        //value={}
                      />
                    </label>
                  </div>
                </form>
                <button
                    type="button"
                      className="btn btn-primary"
                      //onClick={}
                    >
                    Add all information to the Disperse
                </button>
              </div>
            </div>
          </div>

          {/* Destination chain card */}
          <div className="row-span-1 shadow-xl card w-96 bg-base-100">
            <figure
              className="h-64 bg-center bg-no-repeat bg-cover image-full"
              style={{ backgroundImage: "url('/assets/axelar.gif')" }}
            />
            <div className="card-body">
              <h2 className="card-title">EVM Chains (Token Receivers)</h2>
              <div className="h-40">
                <div className="w-full max-w-xs form-control">
                  <div>
 
                  </div>
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
