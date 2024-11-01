import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

export const usePublicClient = () => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(
      "https://special-special-telescope.base-sepolia.quiknode.pro/0c45fdba0a2cb850c282df0417a217f67ea8fbc6"
    ),
  });

  return { client };
};
