import { abi, contract } from "../contracts/PostNFT.js";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadPostContract = () => {
  async function readPostContract(functionName, args = []) {
    return await client.readContract({
      abi: abi,
      address: contract,
      functionName: functionName,
      args: args,
    });
  }

  return {
    readPostContract,
  };
};
