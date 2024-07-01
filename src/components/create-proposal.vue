<script setup>
import { computed, ref } from "vue";
import loading from "./loading.vue";
import Vote from "../infra/vote.js";
const show = ref(false);
const form = ref({
  profile: "",
  reason: "",
});
const isLoading = ref(false);

const isFormDisabled = computed(() => {
  let counter = 0;
  if (form.value.profile.length > 0) counter += 1;
  if (form.value.reason.length > 0) counter += 1;
  return counter;
});

function showPlaceholder(event) {
  form.value.reason = String(event.target.innerText).replace(/[\r|\n]/g, " ");
  if (event.target.innerText.length > 0) {
    event.target.parentNode
      .querySelector(".c-form__textarea-placeholder")
      .classList.add("is-hidden");
  } else {
    event.target.parentNode
      .querySelector(".c-form__textarea-placeholder")
      .classList.remove("is-hidden");
  }
}

async function create() {
  isLoading.value = true;
  try {
    const vote = new Vote();
    const { success } = await vote.createAssessment({
      profile: form.value.profile,
      reason: form.value.reason,
    });
    if (success) {
      form.value.profile = "";
      form.value.reason = "";
      show.value = false;
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
}
</script>
<!-- prettier-ignore -->
<template>
  <div v-if="show" class="create-proposal">
    <div class="create-proposal__header">
      <h3 class="create-proposal__title">Ban Proposal</h3>
      <button class="create-proposal__close" type="button" @click="show = false">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.4">
            <path d="M9.16992 14.8299L14.8299 9.16992" stroke="#F4F4F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14.8299 14.8299L9.16992 9.16992" stroke="#F4F4F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#F4F4F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <form class="c-form create-proposal__form" @submit.prevent="create">
      <div class="c-form__field">
        <label class="c-form__label" for="name">Profile Address</label>
        <input class="c-form__input--name" type="text" v-model="form.profile" name="address" id="address" placeholder="Profile Address"/>
      </div>
      <div class="c-form__field">
        <label class="c-form__label">Reason</label>
        <div class="c-form__textarea">
          <span class="c-form__textarea-placeholder" :class="{ 'is-hidden': form.reason.length > 0 }" >Brief reason for your profile...</span>
          <div class="c-form__textarea-input" @keyup="showPlaceholder" id="description" contenteditable="true">
          </div>
        </div>
      </div>
      <div class="c-form__footer">
        <button class="c-form__submit u-flex-line" :disabled="isFormDisabled == 0" type="submit">
          <loading v-if="isLoading" type="small" />
          <template v-else>Save</template>
        </button>
      </div>
    </form>
  </div>
  <button @click="show = true" class="header__button u-flex-line u-flex-line-center" type="button">Create an assessment</button>
</template>
<style>
.create-proposal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-color-primary);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 48px;
}
.create-proposal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(480px, 100%);
}
.create-proposal__title {
  font-size: 2.1rem;
  font-weight: 500;
}
.create-proposal__form {
  width: min(480px, 100%);
}
</style>
