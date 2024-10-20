<script setup>
import { ref, watch } from "vue";
import { Loading } from "../";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../../contracts/Sograph.js";
const props = defineProps(["id"]);
const { writeContractAsync, data } = useWriteContract();
const isLoading = ref(false);

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
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) isLoading.value = false;
});
</script>
<!-- prettier-ignore -->
<template>
  <button @click="reactivate" class="c-form__submit u-flex-line" type="submit">
    <loading v-if="isLoading" type="small"/>
    <template v-else>Add</template>
  </button>
</template>
