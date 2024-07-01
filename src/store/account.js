import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAccountStore = defineStore('account', () => {
  const account = ref({
    isConnected: false,
    hasAccount: false,
    wallet: null
  });

  if (localStorage.getItem("account")) {
    account.value = JSON.parse(localStorage.getItem("account"));
  }

  function setConnected() {
    account.value.isConnected = true;
    localStorage.setItem("account", JSON.stringify(account.value));
  }

  function setHasAccount() {
    account.value.hasAccount = true;
    localStorage.setItem("account", JSON.stringify(account.value));
  }

  function setWallet(wallet) {
    account.value.wallet = wallet;
    localStorage.setItem("account", JSON.stringify(account.value));
  }

  function resetAccount() {
    account.value.isConnected = false;
    account.value.hasAccount = false;
    account.value.wallet = null;
    localStorage.removeItem("account");
  }

  return { account, setConnected, setHasAccount, setWallet, resetAccount };
})