<script setup>
import { useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/Sograph.js";
const { writeContractAsync } = useWriteContract();
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
</script>
<!-- prettier-ignore -->
<template>
  <button @click="redeemPost(props.id)">Redeem</button>
</template>
