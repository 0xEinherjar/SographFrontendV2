import { http, createConfig } from "@wagmi/vue";
import { baseSepolia } from "@wagmi/vue/chains";
import { metaMask, coinbaseWallet } from "@wagmi/vue/connectors";
import { getWagmiConnectorV2 } from "@binance/w3w-wagmi-connector-v2";

const binanceWallet = getWagmiConnectorV2();

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [metaMask(), binanceWallet(), coinbaseWallet()],
  transports: {
    [baseSepolia.id]: http(
      "https://special-special-telescope.base-sepolia.quiknode.pro/0c45fdba0a2cb850c282df0417a217f67ea8fbc6"
    ),
  },
});
