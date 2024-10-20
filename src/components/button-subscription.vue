<script setup>
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/ProfileNFT.js";
import { watch } from "vue";
const props = defineProps(["id", "duration", "price"]);
const emit = defineEmits(["subscriptionSuccess"]);
const { writeContractAsync, data } = useWriteContract();

async function subscription() {
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
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) emit("subscriptionSuccess");
});
</script>
<!-- prettier-ignore -->
<template>
  <button class="c-card-payment__pay" @click="subscription" type="button">
    Subscribe for {{ props.price }} Graph per {{ props.duration }} year{{ props.duration == 1 ? "" : "s" }}
  </button>
</template>
