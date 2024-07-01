import { defineStore } from "pinia";
import { ref } from "vue";

export const useModeratorStore = defineStore("moderator", () => {
  const moderator = ref({
    isConnected: false,
    wallet: null,
  });

  if (localStorage.getItem("moderator")) {
    moderator.value = JSON.parse(localStorage.getItem("moderator"));
  }

  function setConnected() {
    moderator.value.isConnected = true;
    localStorage.setItem("moderator", JSON.stringify(moderator.value));
  }

  function setWallet(wallet) {
    moderator.value.wallet = wallet;
    localStorage.setItem("moderator", JSON.stringify(moderator.value));
  }

  function resetModerator() {
    moderator.value.isConnected = false;
    moderator.value.wallet = null;
    localStorage.removeItem("moderator");
  }

  return {
    moderator,
    setConnected,
    setWallet,
    resetModerator,
  };
});
