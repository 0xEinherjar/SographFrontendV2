<script setup>
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/Sograph.js";
import { onMounted, ref, watch } from "vue";
import { Icon } from "./";
const { writeContractAsync, data } = useWriteContract();
const props = defineProps(["id", "hasLiked", "totalLiked"]);
const emit = defineEmits(["redeem"]);
const totalLiked = ref(0);
const hasLiked = ref(false);
async function like(id) {
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "like",
    args: [id],
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    if (hasLiked.value == false) {
      totalLiked.value += 1;
      hasLiked.value = true;
    } else {
      totalLiked.value -= 1;
      hasLiked.value = false;
    }
  }
});
onMounted(() => {
  hasLiked.value = props.hasLiked;
  totalLiked.value = Number(props.totalLiked);
});
</script>
<!-- prettier-ignore -->
<template>
  <button class="c-post__action u-flex-line" @click="like(props.id)">
    <icon :iconClass="{'c-icon--small': true, 'c-icon--fill-none': true, 'is-liked': hasLiked }" name="like"/>
    <span class="c-post__action-count">{{ totalLiked }}</span>
  </button>
</template>
