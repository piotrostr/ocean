import { ISuccessResult, verifyCloudProof } from "@worldcoin/idkit";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { result, signal }: { result: ISuccessResult; signal: string } = req.body;
  const app_id = process.env.WORLD_COIN_APP_ID;
  const action = process.env.WORLD_COIN_ACTION_ID;
  if (!action) {
    return res.status(500).send("Missing required environment variable: WORLD_COIN_ACTION_ID");
  }
  if (!app_id) {
    return res.status(500).send("Missing required environment variable: WORLD_COIN_APP_ID");
  }
  if (!app_id.startsWith("app_")) {
    return res.status(500).send("Invalid APP_ID");
  }

  try {
    const response = await verifyCloudProof(result, app_id as `app_${string}`, action, signal);

    if (response.success) {
      // This is where you should perform backend actions if the verification succeeds
      // Such as, setting a user as "verified" in a database
      res.status(200).json(response);
    } else {
      // This is where you should handle errors from the World ID /verify endpoint.
      // Usually these errors are due to a user having already verified.
      res.status(400).json(response);
    }
  } catch (error) {
    console.error("Error verifying World ID proof:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
