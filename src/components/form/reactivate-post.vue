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
    <form class="c-form" @submit.prevent="reactivate">
    <div class="c-form__field">
      <label class="c-form__label" for="username">Publication Id</label>
      <input class="c-form__input" type="text" v-model="postId" placeholder="Enter the PostNFT ID">
    </div>
    <div class="c-form__footer">
      <button class="c-form__submit u-flex-line" :disabled="!postId" type="submit">
        <loading v-if="isLoading" type="small"/>
        <template v-else>Add</template>
      </button>
    </div>
  </form>
</template>
