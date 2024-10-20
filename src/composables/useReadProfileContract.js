import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { abi, contract } from "../contracts/ProfileNFT.js";

export const useReadProfileContract = () => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

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
