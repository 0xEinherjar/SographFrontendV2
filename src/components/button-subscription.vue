<script setup>
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { ref, watch } from "vue";
import { abi, contract } from "../contracts/ProfileNFT.js";
import { Loading } from "./";
import { useErrorStore } from "../store/error.js";
const errorStore = useErrorStore();
const props = defineProps(["id", "duration", "price"]);
const emit = defineEmits(["subscriptionSuccess"]);
const { writeContractAsync, data, error } = useWriteContract();
const isLoading = ref(false);

async function subscription() {
  isLoading.value = true;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "subscription",
    args: [props.id, props.duration],
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
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
    isLoading.value = false;
  }
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    emit("subscriptionSuccess");
    isLoading.value = false;
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <button class="c-card-payment__pay u-flex-line-center" @click="subscription" type="button">
    <template v-if="!isLoading">Subscribe for {{ props.price }} Graph per {{ props.duration }} year{{ props.duration == 1 ? "" : "s" }}</template>
    <loading v-else type="small" theme="dark"/>
  </button>
</template>
