import { abi, contract } from "../contracts/Voting.js";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadVotingContract = () => {
  async function readVotingContract(functionName, args = []) {
    return await client.readContract({
      abi: abi,
      address: contract,
      functionName: functionName,
      args: args,
    });
  }

  return {
    readVotingContract,
  };
};
