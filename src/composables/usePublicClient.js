import { createPublicClient, http } from "viem";
import { bscTestnet } from "viem/chains";

export const usePublicClient = () => {
  const client = createPublicClient({
    chain: bscTestnet,
    transport: http(),
  });

  return { client };
};
