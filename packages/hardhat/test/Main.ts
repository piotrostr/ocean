import { ethers } from "hardhat";
import { Main } from "../typechain-types";

const WORLD_ID = "0x57f928158C3EE7CDad1e4D8642503c4D0201f611";
const APP_ID = "app_staging_6edbe9bc27b20867c422442bfe02c483";
const ACTION_ID = "user-login";

type Proof = [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];
function hexToBigIntArray(hexString: string): Proof {
  // Remove '0x' prefix if present
  hexString = hexString.replace(/^0x/, "");

  // Split the string into pairs of characters
  const pairs = hexString.match(/.{1,64}/g);
  if (!pairs) throw new Error("Invalid hex string");

  // Convert each pair to a decimal number and create a BigInt
  const res = pairs.map(pair => BigInt("0x" + pair));
  if (res.length !== 8) throw new Error("Invalid proof length");
  return res as Proof;
}

describe("Main", function () {
  // We define a fixture to reuse the same setup in every test.

  let ocean: Main;
  before(async () => {
    const oceanFactory = await ethers.getContractFactory("Main");
    ocean = (await oceanFactory.deploy(WORLD_ID, APP_ID, ACTION_ID)) as Main;
    await ocean.waitForDeployment();
  });

  describe("Proof", function () {
    it("Should verify proofs correctly", async function () {
      const address = "0x8c116Ea6A80EE2D90Bc983a4Bd3154b5a370A2eC";
      const result = {
        proof:
          "0x0bb8551d2c27688f4eb832ba576bb422b93d0d8bd4eba3371fbae96501d373c30923ffce081bbff2e6f9305b5da6406e6737146aa0ef06b7a2c40a10246d6229036e0ec923131768555b221fbf01dcadc8a045a3a4467c342c44e9ebaf8e6b4c26af2c8007f12ec5164aad49aa9f3976de18e84a8cf715bfd7a6050f6b5805ba1019af944e7c775d5cf0f583ab103ed2a68669c91eba68db37558d3475cfeb6e169afcf6b908568ef17aaf0ee10916a9358b6081e344b71d13d728f7a0fbac351081600852895f6478ad4ebf34308a1e8a91fbfe0e6c8f26ca563aef73e868b6067bb2ef0567f35d9e16c1c4d41e9293e7443ddcbc9992dc50b958536ee8e58c",
        merkle_root: "0x24ff3b33a36656135c9aaf8efa6a98c6f3237d3c806988942ef48f5adffd1290",
        nullifier_hash: "0x14fecf6d83b46742082ab5bd6026e8bfd1366137d61cd03f2c8f215eabfa7764",
        verification_level: "orb",
      };
      await ocean.verifyAndExecute(
        address,
        BigInt(result.merkle_root),
        BigInt(result.nullifier_hash),
        hexToBigIntArray(result.proof),
      );
    });
  });
});
