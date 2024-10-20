<script setup>
import { ref } from "vue";
import { Icon } from "./";
import { useChainId, useConnect } from "@wagmi/vue";
import MetaMaskIcon from "../assets/metaMask.webp";
import BinanceIcon from "../assets/binanceWallet.webp";
import CoinbaseIcon from "../assets/coinbaseWallet.webp";
const { connectors, connect } = useConnect();
const chainId = useChainId();
const open = ref(false);
const walletIcon = ref({
  coinbaseWallet: CoinbaseIcon,
  metaMask: MetaMaskIcon,
  binanceWallet: BinanceIcon,
});
</script>
<!-- prettier-ignore -->
<template>
  <Teleport to="body">
    <div v-if="open" class="c-connect--backdrop u-flex-line-center">
      <div class="c-connect">
        <div class="u-flex-line-between">
          <h3 class="c-connect__title">Connect Wallet</h3>
          <icon @click="open = false" iconClass="c-icon--small" name="close"/>
        </div>
        <div class="c-connect__wallets">
          <div v-for="connector in connectors.filter(item => item.type != 'injected')" @click="connect({ connector, chainId })" class="c-connect__wallet u-flex-line">
            <img class="c-connect__wallet-image" :src="walletIcon[connector.type]" alt="Image Wallet">
            {{ connector.name }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
  <button class="home__button" type="button" @click="open = true">Connect</button>
</template>
<style>
.c-connect--backdrop {
  position: fixed;
  inset: 0 0 0 0;
  background-color: rgba(20, 20, 20, 0.8);
  z-index: 100;
}
.c-connect {
  border-radius: 20px;
  background-color: var(--bg-color-primary);
  padding: 24px;
  width: min(360px, 100%);
  display: grid;
  gap: 24px;
}
.c-connect__title {
  font-weight: 700;
  font-size: 1.5rem;
}
.c-connect__wallets {
  display: grid;
  gap: 8px;
}
.c-connect__wallet {
  background-color: rgba(255, 255, 255, 0.02);
  padding: 16px;
  border-radius: 12px;
  gap: 16px;
  font-weight: 500;
  cursor: pointer;
}
.c-connect__wallet-image {
  height: 40px;
  width: 40px;
  object-fit: cover;
  border-radius: 12px;
}
</style>
