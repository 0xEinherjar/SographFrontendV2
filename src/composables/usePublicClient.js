import { createPublicClient, http } from "viem";
import { bscTestnet } from "viem/chains";

export const usePublicClient = () => {
  const client = createPublicClient({
    chain: bscTestnet,
    transport: http(
      "https://special-special-telescope.bsc-testnet.quiknode.pro/0c45fdba0a2cb850c282df0417a217f67ea8fbc6"
    ),
  });

  return { client };
};
