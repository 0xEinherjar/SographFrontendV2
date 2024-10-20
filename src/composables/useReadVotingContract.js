import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { abi, contract } from "../contracts/Voting.js";

export const useReadVotingContract = () => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

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
