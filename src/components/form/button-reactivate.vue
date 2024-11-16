<script setup>
import { ref, watch } from "vue";
import { Loading } from "../";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "@wagmi/vue";
import { abi, contract } from "../../contracts/Sograph.js";
import { useProfile } from "../../composables/useProfile.js";
import { useRouter } from "vue-router";
import { useUserStore } from "../../store/user.js";
import { useAccountStore } from "../../store/account.js";
import { useErrorStore } from "../../store/error.js";
const errorStore = useErrorStore();
const props = defineProps(["id"]);
const { writeContractAsync, data, error } = useWriteContract();
const isLoading = ref(false);
const { getProfile } = useProfile();
const router = useRouter();
const userStore = useUserStore();
const accountStore = useAccountStore();
const { address } = useAccount();

async function reactivate() {
  if (!Number(props.id)) return;
  isLoading.value = true;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "reactivatePost",
    args: [[props.id]],
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
  isLoading.value = false;
  if (newIsSuccess) {
    const profile = await getProfile(address.value);
    if (!profile.success) return;
    accountStore.setWallet(address.value);
    accountStore.setConnected();
    userStore.setUser(profile.data);
    accountStore.setHasAccount();
    router.push({
      path: `/${profile.data.handle ? profile.data.handle : address.value}`,
    });
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <button @click="reactivate" class="c-form__submit u-flex-line" type="submit">
    <loading v-if="isLoading" type="small"/>
    <template v-else>Add</template>
  </button>
</template>
