<script setup>
import { ref, watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { Loading } from "../";
import ButtonReactivate from "./button-reactivate.vue";
import { abi, contract } from "../../contracts/PostNFT.js";
import { contract as contractSograph } from "../../contracts/Sograph.js";
const { writeContractAsync, data } = useWriteContract();
const postId = ref("");
const isLoading = ref(false);

async function reactivate() {
  if (!Number(postId.value)) return;
  isLoading.value = true;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "approve",
    args: [contractSograph, postId.value],
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    isLoading.value = false;
  }
});
</script>
<!-- prettier-ignore -->
<template>
    <form class="c-form" @submit.prevent="reactivate">
    <div class="c-form__field">
      <label class="c-form__label" for="username">Publication Id</label>
      <input class="c-form__input" type="text" v-model="postId" placeholder="Enter the PostNFT ID">
    </div>
    <div class="c-form__footer">
      <button v-if="!isSuccess" class="c-form__submit u-flex-line" :disabled="!postId" type="submit">
        <loading v-if="isLoading" type="small"/>
        <template v-else>Approve</template>
      </button>
      <button-reactivate v-else :id="postId"/>
    </div>
  </form>
</template>
