import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const WORLD_ID = "0x57f928158C3EE7CDad1e4D8642503c4D0201f611";
const APP_ID = "app_staging_6edbe9bc27b20867c422442bfe02c483";
const ACTION_ID = "user-login";

const deployMain: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Main", {
    from: deployer,
    args: [WORLD_ID, APP_ID, ACTION_ID],
    log: true,
    autoMine: true,
  });
};

export default deployMain;

deployMain.tags = ["Main"];
