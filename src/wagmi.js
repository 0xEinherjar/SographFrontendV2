import { http, createConfig } from "@wagmi/vue";
import { bscTestnet } from "@wagmi/vue/chains";
import { metaMask, coinbaseWallet } from "@wagmi/vue/connectors";
import { getWagmiConnectorV2 } from "@binance/w3w-wagmi-connector-v2";

const binanceWallet = getWagmiConnectorV2();

export const config = createConfig({
  chains: [bscTestnet],
  connectors: [metaMask(), binanceWallet(), coinbaseWallet()],
  transports: {
    [bscTestnet.id]: http(),
  },
});
