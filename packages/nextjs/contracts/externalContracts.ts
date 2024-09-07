import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  // optimism mainnet
  10: {
    WORLD_ID: {
      // WORLD_ID ENS optimism.id.worldcoin.eth
      address: "0x57f928158C3EE7CDad1e4D8642503c4D0201f611",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "_worldId",
              type: "address",
              internalType: "contract IWorldID",
            },
            {
              name: "_appId",
              type: "string",
              internalType: "string",
            },
            {
              name: "_actionId",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "verifyAndExecute",
          inputs: [
            {
              name: "signal",
              type: "address",
              internalType: "address",
            },
            {
              name: "root",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "nullifierHash",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "proof",
              type: "uint256[8]",
              internalType: "uint256[8]",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "event",
          name: "verified",
          inputs: [
            {
              name: "nullifierHash",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "error",
          name: "DuplicateNullifier",
          inputs: [
            {
              name: "nullifierHash",
              type: "uint256",
              internalType: "uint256",
            },
          ],
        },
      ],
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
