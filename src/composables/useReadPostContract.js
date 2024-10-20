import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { abi, contract } from "../contracts/PostNFT.js";

export const useReadPostContract = () => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

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
