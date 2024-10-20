<script setup>
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/Sograph";
import { onMounted, watch, ref } from "vue";
const props = defineProps(["isFollowing", "name", "profile"]);
const { writeContractAsync, data } = useWriteContract();
const isFollowing = ref(false);
async function handleFollow() {
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "follow",
    args: [props.profile],
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    isFollowing.value = !isFollowing.value;
  }
});
onMounted(() => {
  isFollowing.value = props.isFollowing;
});
</script>
<!-- prettier-ignore -->
<template>
  <button class="profile__button u-font-500" @click="handleFollow(profile.owner)">
    {{ isFollowing ? "Following" : "Follow"}} {{ props.name }}
  </button>
</template>
