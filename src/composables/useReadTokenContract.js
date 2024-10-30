import { abi, contract } from "../contracts/Token.js";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadTokenContract = () => {
  async function readTokenContract(functionName, args = []) {
    return await client.readContract({
      abi: abi,
      address: contract,
      functionName: functionName,
      args: args,
    });
  }

  return {
    readTokenContract,
  };
};
