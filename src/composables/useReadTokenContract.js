import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { abi, contract } from "../contracts/Token.js";

export const useReadTokenContract = () => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

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
