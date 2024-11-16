<script setup>
import { useUserStore } from "../../store/user.js";
import { useAccountStore } from "../../store/account.js";
import { useRouter } from "vue-router";
import { Loading } from "../";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useDisconnect,
} from "@wagmi/vue";
import { abi, contract } from "../../contracts/Sograph.js";
import { ref, watch } from "vue";
import { useErrorStore } from "../../store/error.js";
const errorStore = useErrorStore();
const { writeContractAsync, data, error } = useWriteContract();
const { disconnect } = useDisconnect();
const router = useRouter();
const { resetAccount } = useAccountStore();
const { removeUser } = useUserStore();
const isLoading = ref(false);

async function redeem() {
  isLoading.value = true;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "redeemProfile",
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
    isLoading.value = false;
  }
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    resetAccount();
    removeUser();
    disconnect();
    router.push({ path: "/" });
  }
  isLoading.value = false;
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-redeem u-flex-line">
    <p class="c-redeem__text">Redeem your profile and publications to your wallet</p>
    <button class="c-redeem__button u-flex-line" @click="redeem">
      <Loading v-if="isLoading" type="small"/>
      <template v-else>Redeem</template>
    </button>
  </div>
</template>
<style>
.c-line {
  width: 100%;
  height: 1px;
  background-color: var(--bg-color-quinary);
  margin-block: 8px;
}
.c-redeem {
  height: 80px;
  padding-inline: 24px;
  border-radius: var(--border-radius-default);
  background-color: var(--bg-color-secondary);
  gap: 40px;
}
.c-redeem__text {
  font-size: 1.2rem;
}
.c-redeem__button {
  height: 32px;
  border-radius: 8px;
  padding-inline: 16px;
  background-color: var(--color-red);
  font-size: 1.2rem;
  font-weight: 500;
  margin-left: auto;
}
.light-mode .c-redeem__button {
  color: var(--text-color-quinary);
}
</style>
