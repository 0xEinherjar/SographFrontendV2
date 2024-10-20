<script setup>
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/Sograph";
import { watch } from "vue";
const props = defineProps(["id"]);
const emit = defineEmits(["reactivate"]);
const { writeContractAsync, data } = useWriteContract();

async function reactivate() {
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "reactivateProfile",
    args: [props.id],
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    console.log("reactivate event");

    emit("reactivate");
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <button class="c-form__submit u-flex-line" @click="reactivate">
    Reactivate
  </button>
</template>
