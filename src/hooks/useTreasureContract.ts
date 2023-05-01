import treasureTokenAddress from "../contracts/treasure-contract-address.json";
import treasureTokenArtifacts from "../contracts/treasure-token.json";
import { JsonRpcSigner, ethers } from "ethers";

export const useTreasureContract = (signer: JsonRpcSigner | null) => {
  if (!signer) {
    return { treasureContract: null };
  }
  const contract = new ethers.Contract(
    treasureTokenAddress.Token,
    treasureTokenArtifacts.abi,
    signer
  );
  return { treasureContract: contract };
};
