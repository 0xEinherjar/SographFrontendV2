<script setup>
import { inject, ref } from "vue";
import { Loading } from "../";
const blockchainClient = inject("blockchainClient");
const postClient = inject("postClient");
const postId = ref("");
const isLoading = ref(false);

async function reactivate() {
  if (!Number(postId.value)) return;
  isLoading.value = true;
  const { success } = await postClient.approve(postId.value);
  if (success) await blockchainClient.reactivatePost([postId.value]);
  isLoading.value = false;
}
</script>
<!-- prettier-ignore -->
<template>
  <form class="c-form-add u-flex-line" @submit.prevent="reactivate">
    <input v-model="postId" class="c-form__input" type="text" placeholder="Enter the PostNFT ID">
    <button class="c-form__submit u-flex-line" :disabled="!postId" type="submit">
      <loading v-if="isLoading" type="small"/>
      <template v-else>Add</template>
    </button>
  </form>
</template>
<style>
.c-form-add {
  border-radius: var(--border-radius-default);
  background-color: var(--bg-color-secondary);
  padding: 32px 24px;
  gap: 24px;
}
.c-form-add > .c-form__submit {
  margin-left: 0 !important;
}
.c-form-add > .c-form__input {
  flex-grow: 1;
  height: 32px !important;
}
</style>
