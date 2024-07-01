<script setup>
import { onBeforeMount, ref } from "vue";
import Blockchain from "../../infra/blockchain.js";
import { useUserStore } from "../../store/user.js";
import Loading from "../loading.vue";
const { userHandle } = defineProps(["userHandle"]);
const userStore = useUserStore();
const handle = ref("");
const handleNote = ref("username");
const isAvailable = ref(false);
const isLoading = ref(false);
const isCorrect = ref(null);

async function isHandleAvailable() {
  if (handle.value.length == 0) {
    isCorrect.value = null;
    return;
  }
  if (handle.value.length <= 3) {
    if (userHandle.length > 0) {
      handleNote.value = userHandle;
    } else {
      handleNote.value = "username";
    }
    isAvailable.value = false;
    isCorrect.value = false;
    return;
  }
  handleNote.value = handle.value;
  const blockchain = new Blockchain();
  const result = await blockchain.isHandleAvailable(handle.value);
  if (result.success) {
    isCorrect.value = true;
    isAvailable.value = result.isAvailable;
  }
}

async function updateHandle() {
  isLoading.value = true;
  const blockchain = new Blockchain();
  const result = await blockchain.updateHandle(handle.value);
  if (result.success) userStore.updateHandle(handle.value);
  isLoading.value = false;
}

onBeforeMount(() => {
  if (userHandle.length > 0) {
    handle.value = userHandle;
    handleNote.value = userHandle;
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <form class="c-form" @submit.prevent="updateHandle">
    <div class="c-form__field">
      <label class="c-form__label" for="username" >Handle</label>
      <input class="c-form__input" :class="{'u-text-danger': isCorrect === false}" type="text" @input="isHandleAvailable" v-model="handle" name="username" id="username" placeholder="@username">
      <span class="c-form__note">Your Sograph URL: https://sograph.app/#/<span class="c-form__note-emphasis">{{ handleNote }}</span></span>
    </div>
    <div class="c-form__footer">
      <button class="c-form__submit u-flex-line" :disabled="!isAvailable" type="submit">
        <loading v-if="isLoading" type="small"/>
        <template v-else>Save</template>
      </button>
    </div>
  </form>
</template>
