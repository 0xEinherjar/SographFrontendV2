<script setup>
import { onMounted } from "vue";
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3ModalProvider,
} from "@web3modal/ethers/vue";
import Blockchain from "./infra/blockchain.js";
import Token from "./infra/token.js";
import Post from "./infra/post.js";
import Report from "./infra/report.js";

const projectId = import.meta.env.VITE_PROJECT_ID;

const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const testnet = {
  chainId: 97,
  name: "BNB Testnet",
  currency: "tBNB",
  explorerUrl: "https://testnet.bscscan.com",
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
};

const ethersConfig = defaultConfig({
  metadata,
  auth: {
    email: false,
    socials: false,
  },
});

const modal = createWeb3Modal({
  ethersConfig,
  chains: [testnet],
  projectId,
  allWallets: "HIDE",
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4",
    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
  ],
  excludeWalletIds: [
    "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
  ],
});

const { walletProvider } = useWeb3ModalProvider();

onMounted(() => {
  window.setTimeout(() => {
    if (walletProvider.value) {
      const blockchain = new Blockchain();
      blockchain.setProvider(walletProvider.value);
      blockchain.hasClient();
      const post = new Post();
      post.setProvider(walletProvider.value);
      const token = new Token();
      token.setProvider(walletProvider.value);
      const report = new Report();
      report.setProvider(walletProvider.value);
    }
  }, 300);
});
</script>
<!-- prettier-ignore -->
<template>
  <router-view></router-view>
</template>
<style></style>
