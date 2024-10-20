<script setup>
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/Sograph.js";
import { onMounted, ref, watch } from "vue";
import { Icon } from "./";
const { writeContractAsync, data } = useWriteContract();
const props = defineProps(["id", "hasShared", "totalShared", "isMyProfile"]);
const emit = defineEmits(["redeem"]);
const totalShared = ref(0);
const hasShared = ref(false);

async function share(id) {
  if (props.hasShared == false) {
    await writeContractAsync({
      abi: abi,
      address: contract,
      functionName: "share",
      args: [id],
    });
  } else {
    await writeContractAsync({
      abi: abi,
      address: contract,
      functionName: "unshare",
      args: [id],
    });
  }
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    if (hasShared.value == false) {
      totalShared.value += 1;
      hasShared.value = true;
    } else {
      totalShared.value -= 1;
      hasShared.value = false;
    }
  }
});
onMounted(() => {
  hasShared.value = props.hasShared;
  totalShared.value = Number(props.totalShared);
});
</script>
<!-- prettier-ignore -->
<template>
  <button class="c-post__action u-flex-line" @click="share(props.id)">
    <icon :iconClass="{'c-icon--small': true, 'is-shared': hasShared && props.isMyProfile }" name="share"/>
    <span class="c-post__action-count">{{ totalShared }}</span>
  </button>
</template>
