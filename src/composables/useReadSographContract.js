import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { abi, contract } from "../contracts/Sograph.js";

export const useReadSographContract = () => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

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
