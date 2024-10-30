import { abi, contract } from "../contracts/Sograph.js";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadSographContract = () => {
  async function readSographContract(functionName, args = [], account) {
    return await client.readContract({
      abi: abi,
      address: contract,
      functionName: functionName,
      args: args,
      account: account,
    });
  }

  return {
    readSographContract,
  };
};
