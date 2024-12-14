<script setup>
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { Avatar, Loading, Icon } from "./";
import { pinPostToIPFS } from "../infra/pinata.js";
import { useUserStore } from "../store/user.js";
import { abi, contract } from "../contracts/Sograph.js";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { useErrorStore } from "../store/error.js";
const { data: hash, writeContractAsync, error } = useWriteContract();
const errorStore = useErrorStore();
const modal = ref(null);
const isLoading = ref(false);
const textarea = ref(null);
const attachmentURL = ref("");
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const form = ref({
  attachment: null,
  text: "",
});

function clear() {
  attachmentURL.value = "";
  form.value.attachment = null;
}

function getText() {
  if (textarea.value.innerText.length == 0) return "";
  return String(textarea.value.innerText).replace(/[\r|\n]/g, "\n");
}

const isFormDisabled = computed(() => {
  return form.value.attachment == null && form.value.text.length == 0;
});

function showPlaceholder(event) {
  if (String(event.target.innerText).trim().length > 0) {
    form.value.text = event.target.innerText;
    event.target.parentNode
      .querySelector(".c-create__textarea-placeholder")
      .classList.add("is-hidden");
  } else {
    form.value.text = "";
    event.target.parentNode
      .querySelector(".c-create__textarea-placeholder")
      .classList.remove("is-hidden");
  }
}

function onFileChange(event) {
  const file = event.target.files[0] || event.dataTransfer.files[0];
  if (!file) return;
  form.value.attachment = file;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    attachmentURL.value = reader.result;
  });
  reader.readAsDataURL(file);
}

async function create() {
  isLoading.value = true;
  const text = getText();
  try {
    const metadata = await pinPostToIPFS({
      attachment: form.value.attachment,
      text: text,
      createdAt: new Date().toISOString(),
    });
    if (metadata.success == false) {
      isLoading.value = false;
      return;
    }
    await writeContractAsync({
      abi: abi,
      address: contract,
      functionName: "createPost",
      args: [metadata.data],
    });
    form.value.attachment = null;
    form.value.text = "";
    attachmentURL.value = "";
  } catch (error) {
    console.log(error);
  }
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash,
});
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
    isLoading.value = false;
  }
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    isLoading.value = false;
    modal.value.close();
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <dialog class="c-create" ref="modal">
    <form class="c-create__form" @submit.prevent="create">
      <div class="c-create__header u-flex-line">
        <div class="c-create__author u-flex-line">
          <div class="c-create__text">From:</div>
          <avatar :avatar="user?.avatar" length="24px"/>
          <h4 class="c-create__author-name">{{ user?.name }}</h4>
        </div>
        <button class="c-card-payment__close" @click="modal.close()" type="button">
          <icon iconClass="c-icon" name="close"/>
        </button>
      </div>
      <div class="c-create__body">
        <div class="c-create__textarea">
          <div class="c-create__textarea-placeholder">What is new?</div>
          <div class="c-create__textarea-input" @keyup="showPlaceholder" contenteditable="true" ref="textarea"></div>
        </div>
        <div v-if="attachmentURL" class="c-create__attachment">
          <h5 class="c-create__attachment-title u-flex-line">
            <icon iconClass="c-icon" name="link"/>
            <span>Attachment</span>
          </h5>
          <ul class="c-create__attachment-previews u-flex-line">
            <li class="c-create__attachment-item">
              <img class="c-create__attachment-image" :src="attachmentURL"/>
              <span class="c-create__attachment-name u-text-ellipsis ">image<span class="c-create__attachment-type">.png</span></span>
            </li>
          </ul>
        </div>
      </div>
      <div class="c-create__footer u-flex-line">
        <button v-if="attachmentURL" @click="clear" class="c-create__clear u-flex-line" type="button">
          <span>Delete image</span>
          <icon name="trash"/>
        </button>
        <div class="c-create__footer-group u-flex-line">
          <input class="c-create__input-file" @change="onFileChange" type="file" accept="image/png, image/jpeg" name="image" id="image"/>
          <label class="c-create__file" for="image">
            <icon iconClass="c-icon" name="upload"/>
          </label>
          <button :disabled="isFormDisabled" class="c-create__submit u-flex-line" type="submit">
            <loading v-if="isLoading" type="small"/>
            <template v-else>Save</template>
          </button>
        </div>
      </div>
    </form>
  </dialog>
  <button class="c-button-write" @click="modal.showModal()" type="button">
    <icon iconClass="c-icon" name="edit"/>
    Write
  </button>
</template>
<style>
.c-button-write {
  height: 48px;
  padding-inline: 16px;
  border-radius: 12px;
  font-weight: 500;
  position: fixed;
  bottom: 32px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--bg-color-tertiary);
}
.c-create::backdrop {
  background-color: rgba(0, 0, 0, 0.9);
}
.c-create {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: none;
  width: min(520px, 100%);
  background-color: var(--bg-color-primary);
  overflow: hidden;
  border-radius: 16px;
  color: inherit;
}
.c-create__close {
  position: absolute;
  top: 16px;
  right: 16px;
}
.c-create__form {
  display: grid;
  gap: 32px;
  padding-top: 24px;
}
.c-create__header {
  padding-inline: 24px;
}
.c-create__author {
  gap: 8px;
}
.c-create__author-name {
  font-weight: 400;
}
.c-create__text {
  color: rgba(189, 193, 198, 0.4);
}
.c-create__body {
  padding-inline: 24px;
}
.c-create__input-title {
  background-color: var(--bg-color-secondary);
  height: 50px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;
  font-size: 1.7rem;
}
.c-create__input-title::placeholder {
  color: var(--text-color-primary);
  font-size: inherit;
}
.c-create__textarea {
  position: relative;
}
.c-create__textarea-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 2;
  min-height: 24px;
}
.c-create__textarea-input {
  min-height: 24px;
  max-height: 120px;
  position: relative;
  z-index: 3;
  outline: none;
  word-break: break-all;
  overflow-y: auto;
  color: var(--text-color-primary);
  font-size: 1.6rem;
}
.c-create__textarea-input::-webkit-scrollbar-track {
  background: transparent;
}
.c-create__textarea-input::-webkit-scrollbar-thumb {
  background-color: var(--bg-color-secondary);
  border-radius: 10px;
}
.c-create__textarea-input::-webkit-scrollbar {
  width: 6px;
}
.c-create__attachment {
  display: grid;
  gap: 16px;
  margin-top: 32px;
}
.c-create__attachment-title {
  gap: 8px;
  font-weight: 400;
  color: var(--text-color-secondary);
  font-size: 1.6rem;
}
.c-create__file {
  cursor: pointer;
}
.c-create__input-file {
  display: none;
}
.c-create__attachment-previews {
  gap: 16px;
}
.c-create__attachment-item {
  width: 110px;
}
.c-create__attachment-image {
  width: 100%;
  aspect-ratio: 9 / 9;
  border-radius: 8px;
  object-fit: cover;
}
.c-create__attachment-name {
  color: var(--text-color-secondary);
  font-size: 1.2rem;
  margin-top: 8px;
  display: block;
}
.c-create__attachment-type {
  opacity: 0.4;
}
.c-create__footer {
  background-color: var(--bg-color-secondary);
  height: 80px;
  padding-inline: 24px;
}
.c-create__footer-group {
  gap: 22px;
  margin-left: auto;
}
.c-create__clear {
  gap: 6px;
  color: #ff6370;
  font-size: 1.2rem;
}
.c-create__clear svg {
  width: 2rem;
  height: 2rem;
}
.c-create__submit {
  height: 32px;
  border-radius: 8px;
  padding-inline: 16px;
  background-color: #0177fb;
  font-size: 1.2rem;
  font-weight: 500;
}
.c-create__submit:disabled {
  cursor: default;
  pointer-events: none;
  background-color: var(--bg-color-tertiary);
}
</style>
