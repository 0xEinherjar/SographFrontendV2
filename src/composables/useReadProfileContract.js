import { abi, contract } from "../contracts/ProfileNFT.js";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadProfileContract = () => {
  async function readProfileContract(functionName, args = []) {
    return await client.readContract({
      abi: abi,
      address: contract,
      functionName: functionName,
      args: args,
    });
  }

  return {
    readProfileContract,
  };
};
