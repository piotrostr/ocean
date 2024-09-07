"use client";

import Link from "next/link";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import type { NextPage } from "next";
import { decodeAbiParameters } from "viem";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const WORLD_COIN_APP_ID = "app_staging_6edbe9bc27b20867c422442bfe02c483";
const WORLD_COIN_ACTION_ID = "user-login";

const WorldCoinConnector = () => {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useScaffoldWriteContract("WORLD_ID");

  // this doesn't work, the staging connect works but then the verification fails
  // with `contract is not deployed` when testing with localhost:8545 hardhat optimism fork
  // leaving as is, will test on mainnet with proper identity later
  const onSuccess = async (result: ISuccessResult) => {
    const unpackedProof = decodeAbiParameters([{ type: "uint256[8]" }], result.proof as `0x${string}`)[0];
    console.log("submitting for on chain verification:", result);
    if (!address) return;

    try {
      const res = await writeContractAsync(
        {
          args: [address, BigInt(result.merkle_root), BigInt(result.nullifier_hash), unpackedProof],
          chainId: 31337, /// hardcode for now
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 receipt", txnReceipt);
          },
        },
      );
      console.log("on chain verification result:", res);
    } catch (e) {
      console.error("Error verifying with World ID", e);
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
