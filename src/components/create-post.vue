<script setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import loading from "./loading.vue";
import Avatar from "../components/avatar.vue";
import Blockchain from "../infra/blockchain.js";
import { pinPostToIPFS } from "../infra/pinata.js";
import { useUserStore } from "../store/user.js";
const modal = ref(null);
const form = ref({
  attachment: null,
  text: "",
});
const isLoading = ref(false);
const textarea = ref(null);
const attachmentURL = ref("");
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

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
  if (event.target.innerText.length > 0) {
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
    const blockchain = new Blockchain();
    await blockchain.createPost(metadata.data);
    form.value.attachment = null;
    form.value.text = "";
    attachmentURL.value = "";
    modal.value.close();
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
}
</script>
<!-- prettier-ignore -->
<template>
  <dialog class="c-create" ref="modal">
    <form class="c-create__form" @submit.prevent="create">
      <div class="c-create__header">
        <div class="c-create__author">
          <div class="c-create__text">From:</div>
          <avatar :avatar="user?.avatar" length="24px"/>
          <h4 class="c-create__author-name">{{ user?.name }}</h4>
        </div>
        <button class="c-card-payment__close" @click="modal.close()" type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.4">
              <path d="M9.16992 14.8299L14.8299 9.16992" stroke="#F4F4F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14.8299 14.8299L9.16992 9.16992" stroke="#F4F4F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#F4F4F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="c-create__body">
        <div class="c-create__textarea">
          <div class="c-create__textarea-placeholder">What is new?</div>
          <div class="c-create__textarea-input" @keyup="showPlaceholder" contenteditable="true" ref="textarea"></div>
        </div>
        <div v-if="attachmentURL" class="c-create__attachment">
          <h5 class="c-create__attachment-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.99 17.5H16.5C19.52 17.5 22 15.03 22 12C22 8.98 19.53 6.5 16.5 6.5H14.99" stroke="#0177FB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 6.5H7.5C4.47 6.5 2 8.97 2 12C2 15.02 4.47 17.5 7.5 17.5H9" stroke="#0177FB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path opacity="0.4" d="M8 12H16" stroke="#0177FB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Attachment</span>
          </h5>
          <ul class="c-create__attachment-previews">
            <li class="c-create__attachment-item">
              <img class="c-create__attachment-image" :src="attachmentURL" />
              <span class="c-create__attachment-name"
                >Einherjar<span class="c-create__attachment-type"
                  >.png</span
                ></span
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="c-create__footer">
        <button v-if="attachmentURL" @click="clear" class="c-create__clear" type="button">
          <span>Delete image</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 4.98356C14.725 4.70856 11.9333 4.56689 9.15 4.56689C7.5 4.56689 5.85 4.65023 4.2 4.81689L2.5 4.98356" stroke="#FF6370" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path opacity="0.34" d="M7.08325 4.1415L7.26659 3.04984C7.39992 2.25817 7.49992 1.6665 8.90825 1.6665H11.0916C12.4999 1.6665 12.6083 2.2915 12.7333 3.05817L12.9166 4.1415" stroke="#FF6370" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.7084 7.6167L15.1667 16.0084C15.0751 17.3167 15.0001 18.3334 12.6751 18.3334H7.32508C5.00008 18.3334 4.92508 17.3167 4.83341 16.0084L4.29175 7.6167" stroke="#FF6370" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path opacity="0.34" d="M8.6084 13.75H11.3834" stroke="#FF6370" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path opacity="0.34" d="M7.91675 10.4165H12.0834" stroke="#FF6370" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="c-create__footer-group">
          <input class="c-create__input-file" @change="onFileChange" type="file" accept="image/png, image/jpeg" name="image" id="image"/>
          <label class="c-create__file" for="image">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.4">
                <path d="M9 17V11L7 13" stroke="#BDC1C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 11L11 13" stroke="#BDC1C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="#BDC1C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 10H18C15 10 14 9 14 6V2L22 10Z" stroke="#BDC1C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </label>
          <button :disabled="isFormDisabled" class="c-create__submit u-flex-line" type="submit">
            <loading v-if="isLoading" type="small" />
            <template v-else>Save</template>
          </button>
        </div>
      </div>
    </form>
  </dialog>
  <button class="c-button-write" @click="modal.showModal()" type="button">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M21 22H3C2.59 22 2.25 21.66 2.25 21.25C2.25 20.84 2.59 20.5 3 20.5H21C21.41 20.5 21.75 20.84 21.75 21.25C21.75 21.66 21.41 22 21 22Z" fill="#F4F4F4"/>
      <path opacity="0.4" d="M19.0201 3.47991C17.0801 1.53991 15.1801 1.48991 13.1901 3.47991L11.9801 4.68991C11.8801 4.78991 11.8401 4.94991 11.8801 5.08991C12.6401 7.73991 14.7601 9.85991 17.4101 10.6199C17.4501 10.6299 17.4901 10.6399 17.5301 10.6399C17.6401 10.6399 17.7401 10.5999 17.8201 10.5199L19.0201 9.30991C20.0101 8.32991 20.4901 7.37991 20.4901 6.41991C20.5001 5.42991 20.0201 4.46991 19.0201 3.47991Z" fill="#F4F4F4"/>
      <path d="M15.6098 11.53C15.3198 11.39 15.0398 11.25 14.7698 11.09C14.5498 10.96 14.3398 10.82 14.1298 10.67C13.9598 10.56 13.7598 10.4 13.5698 10.24C13.5498 10.23 13.4798 10.17 13.3998 10.09C13.0698 9.81005 12.6998 9.45005 12.3698 9.05005C12.3398 9.03005 12.2898 8.96005 12.2198 8.87005C12.1198 8.75005 11.9498 8.55005 11.7998 8.32005C11.6798 8.17005 11.5398 7.95005 11.4098 7.73005C11.2498 7.46005 11.1098 7.19005 10.9698 6.91005C10.8298 6.61005 10.7198 6.32005 10.6198 6.05005L4.33983 12.33C4.20983 12.46 4.08983 12.71 4.05983 12.88L3.51983 16.71C3.41983 17.39 3.60983 18.03 4.02983 18.46C4.38983 18.81 4.88983 19 5.42983 19C5.54983 19 5.66983 18.99 5.78983 18.97L9.62983 18.43C9.80983 18.4 10.0598 18.28 10.1798 18.15L16.4598 11.87C16.1798 11.77 15.9098 11.66 15.6098 11.53Z" fill="#F4F4F4"/>
    </svg>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 24px;
}
.c-create__author {
  display: flex;
  align-items: center;
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
  display: flex;
  align-items: center;
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
  display: flex;
  align-items: center;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
.c-create__attachment-type {
  opacity: 0.4;
}
.c-create__footer {
  background-color: var(--bg-color-secondary);
  height: 80px;
  padding-inline: 24px;
  display: flex;
  align-items: center;
}
.c-create__footer-group {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-left: auto;
}
.c-create__clear {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ff6370;
  font-size: 1.2rem;
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
