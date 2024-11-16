<script setup>
import { useAccountEffect } from "@wagmi/vue";
import { useRouter } from "vue-router";
import { Logo, ModalConnect, Chain } from "../components";
import { useAccountStore } from "../store/account.js";
import { useUserStore } from "../store/user.js";
import { useProfile } from "../composables/useProfile.js";
const router = useRouter();
const accountStore = useAccountStore();
const userStore = useUserStore();
const { getProfile } = useProfile();

useAccountEffect({
  async onConnect(data) {
    accountStore.setWallet(data.address);
    accountStore.setConnected();
    const result = await getProfile(data.address);
    if (result.success == false) {
      router.push({
        path: "/create",
      });
    } else if (result.success) {
      userStore.setUser(result.data);
      accountStore.setHasAccount();
      router.push({
        path: `/${result.data.handle ? result.data.handle : data.address}`,
      });
    }
  },
  onDisconnect() {
    accountStore.resetAccount();
  },
});
</script>
<!-- prettier-ignore -->
<template>
  <main class="home">
    <header class="header u-flex-line u-flex-line-center">
      <router-link to="/" class="header__logo">
        <logo/>
      </router-link>
      <nav class="header__nav u-flex-line">
        <a class="header__nav-item" target="_blank" href="https://faucet.sograph.app/">Faucet</a>
        <a class="header__nav-item" target="_blank" href="https://vote.sograph.app/">Vote</a>
        <a class="header__nav-item" target="_blank" href="https://docs.sograph.app/">Docs</a>
      </nav>
      <chain/>
    </header>
    <div class="u-flex-line-center">
      <modal-connect/>
    </div>
    <footer class="footer">
      <div class="footer__column">
        <logo class="footer__logo"/>
        <div class="footer__column-content">Social network built on Web3.</div>
      </div>
      <div class="footer__column">
        <div class="footer__column-head">Get Involved</div>
        <div class="footer__column-content">
          <a href="https://vote.sograph.app/" target="_blank" class="footer__link u-flex-line">Vote</a>
          <a href="#" class="footer__link u-flex-line">User Guide</a>
          <a href="https://docs.sograph.app/" target="_blank" class="footer__link u-flex-line">Docs</a>
        </div>
      </div>
      <div class="footer__column">
        <div class="footer__column-head">Use Graph</div>
        <div class="footer__column-content">
          <a href="https://faucet.sograph.app/" target="_blank" class="footer__link u-flex-line">Faucet</a>
          <a href="#" class="footer__link u-flex-line">Add to Metamask</a>
          <a href="https://testnet.bscscan.com/token/0xEA9810d6deF262Ba30a7F96a8B3b7B6C724bE532" target="_blank" class="footer__link u-flex-line">BNBChain Testnet</a>
        </div>
      </div>
      <div class="footer__column">
        <div class="footer__column-head">Social</div>
        <div class="footer__column-content">
          <a href="https://x.com/SographApp" target="_blank" class="footer__link u-flex-line">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M18 17H13.0625L9.19551 12.1062L4.76756 17.0003H2.3125L8.04974 10.6562L2 3H7.0625L10.5575 7.47359L14.5974 3H17.0509L11.6949 8.92946L18 17ZM13.7422 15.5782H15.1012L6.32587 4.34668H4.86719L13.7422 15.5782Z" fill="currentColor"/>
            </svg>
            Twitter
          </a>
          <a href="https://t.me/SographApp" target="_blank" class="footer__link u-flex-line">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
              <path d="M15.9683 0.276016C15.9427 0.155767 15.8538 0.058882 15.7363 0.0230158C15.526 -0.0189056 15.3084 -0.0033598 15.1063 0.0680158C15.1063 0.0680158 1.08725 5.10602 0.286252 5.66402C0.114252 5.78502 0.056252 5.85402 0.027252 5.93602C-0.110748 6.33602 0.320252 6.50902 0.320252 6.50902L3.93325 7.68602C3.99425 7.69702 4.05701 7.69325 4.11625 7.67502C4.93825 7.15602 12.3863 2.45302 12.8163 2.29502C12.8843 2.27502 12.9343 2.29502 12.9163 2.34402C12.7443 2.94402 6.31025 8.66302 6.27525 8.69802C6.2406 8.72696 6.2223 8.77104 6.22625 8.81602L5.88925 12.344C5.88925 12.344 5.74725 13.444 6.84525 12.344C7.62425 11.565 8.37225 10.919 8.74525 10.606C9.98725 11.464 11.3243 12.412 11.9013 12.906C12.0965 13.0962 12.3609 13.1984 12.6333 13.189C12.973 13.147 13.2516 12.8995 13.3333 12.567C13.3333 12.567 15.8943 2.29202 15.9793 0.909016C15.9873 0.774016 16.0003 0.692016 16.0003 0.592016C16.0039 0.48572 15.9931 0.37942 15.9683 0.276016Z" fill="currentColor"/>
            </svg>
            Telegram
          </a>
        </div>
      </div>
    </footer>
  </main>
</template>
<style>
.footer {
  padding-bottom: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.footer__column {
  display: grid;
  gap: 20px;
}
.footer__column-content {
  font-size: 1.5rem;
  color: var(--text-color-secondary);
  display: grid;
  gap: 16px;
}
.footer__logo {
  width: 80px;
}
.footer__link {
  gap: 10px;
  font-size: 1.4rem;
}
.light-mode .footer__link,
.light-mode .footer__column-content {
  font-weight: 500;
}
.footer__link svg {
  width: 18px;
  height: 18px;
  color: var(--color-icon-primary);
}
.home {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto minmax(61rem, 1fr) auto;
  grid-column: sidebar-start / main-end;
  padding-inline: 4rem;
}
.home__button {
  height: 87px;
  width: 370px;
  border: 1px solid var(--color-border-primary);
  color: var(--text-color-primary);
  border-radius: 16px;
  font-weight: 600;
  margin-bottom: 100px;
  gap: 16px;
}
.home__button:hover {
  animation: rotate 3ms alternate-reverse;
}
</style>
