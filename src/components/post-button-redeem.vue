<script setup>
import { useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/Sograph.js";
import { useErrorStore } from "../store/error.js";
import { watch } from "vue";
const errorStore = useErrorStore();
const { writeContractAsync, error } = useWriteContract();
const props = defineProps(["id"]);
const emit = defineEmits(["redeem"]);

async function redeemPost(id) {
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "redeemPost",
    args: [id],
  });
}
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <button @click="redeemPost(props.id)">Redeem</button>
</template>
