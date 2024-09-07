"use client";

import { useState } from "react";
import Link from "next/link";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

// TODO in prod this has to be handled properly, not a sensitive secret but a secret
const WORLD_COIN_APP_ID = "app_staging_d651fcb581dbdb7eec39299d402bff5d";
const WORLD_COIN_ACTION_ID = "user-login";

const WorldCoinConnector = () => {
  const { address } = useAccount();
  const [isPending, setIsPending] = useState(false);

  // this doesn't work, the staging connect works but then the verification fails
  // with `contract is not deployed` when testing with localhost:8545 hardhat optimism fork
  // leaving as is, will test on mainnet with proper identity later
  const onSuccess = async (result: ISuccessResult) => {
    console.log("verifying result", result);
    try {
      setIsPending(true);
      const res = await fetch("/api/verify", {
        method: "POST",
        body: JSON.stringify({ result, signal: address }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();
      console.log("proof verification result", data);
      setIsPending(false);
    } catch (e) {
      console.error(e);
      setIsPending(false);
    }
  };

  return (
    <IDKitWidget
      app_id={WORLD_COIN_APP_ID}
      action={WORLD_COIN_ACTION_ID}
      signal={address}
      onSuccess={onSuccess}
      autoClose={true}
    >
      {({ open }) => (
        <button onClick={open} disabled={isPending}>
          {isPending ? "Verifying..." : "Verify with World ID"}
        </button>
      )}
    </IDKitWidget>
  );
};

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <WorldCoinConnector />
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
