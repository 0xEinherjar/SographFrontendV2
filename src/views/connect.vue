<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMetamask } from "../composables/metamask.js";
import { useUtils } from "../composables/utils.js";
import { useAccountStore } from "../store/account.js";
import { useUserStore } from "../store/user.js";
import { pinProfileToIPFS } from "../infra/pinata.js";
import Blockchain from "../infra/blockchain.js";
import loading from "../components/loading.vue";
const isLoading = ref(false);
const avatarURL = ref("");
const wallet = ref("");
const reactivateProfileId = ref(null);
const form = ref({
  name: "",
  description: "",
  avatar: null,
});
const router = useRouter();
const { connect } = useMetamask();
const enableForm = ref(false);
const enableReactivate = ref(false);
const { truncateAddress } = useUtils();
const accountStore = useAccountStore();
const userStore = useUserStore();

function onFileChange(event) {
  const file = event.target.files[0] || event.dataTransfer.files[0];
  if (!file) return;
  form.value.avatar = file;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    avatarURL.value = reader.result;
  });
  reader.readAsDataURL(file);
}

async function handleConnect() {
  const address = await connect();
  if (!address) return;
  accountStore.setWallet(address);
  accountStore.setConnected();
  wallet.value = address;
  const blockchain = new Blockchain();
  const result = await blockchain.getProfile(address);
  if (result.success == false && result?.message == "NOT_FOUND") {
    enableForm.value = true;
  } else if (result.success) {
    userStore.setUser(result.data);
    accountStore.setHasAccount();
    router.push({
      path: `/${result.data.handle ? result.data.handle : address}`,
    });
  }
}

async function reactivateProfile() {
  if (!reactivateProfileId) return;
  const address = await connect();
  if (!address) return;
  const blockchain = new Blockchain();
  await blockchain.approve(reactivateProfileId.value);
  const reactivateResult = await blockchain.reactivateProfile(
    reactivateProfileId.value
  );
  if (!reactivateResult.success) return;
  const profileResult = await blockchain.getProfile(address);
  if (!profileResult.success) return;
  accountStore.setWallet(address);
  accountStore.setConnected();
  userStore.setUser(profileResult.data);
  accountStore.setHasAccount();
  router.push({
    path: `/${profileResult.data.handle ? profileResult.data.handle : address}`,
  });
}

function checkForm() {
  if (
    form.value.name.length >= 3 &&
    form.value.name.length <= 50 &&
    form.value.description.length <= 400 &&
    wallet.value
  )
    return true;
  return false;
}
async function create() {
  if (!checkForm()) return;
  isLoading.value = true;
  try {
    const metadata = await pinProfileToIPFS({
      avatar: form.value.avatar,
      name: form.value.name,
      description: form.value.description,
      createdAt: new Date().toISOString(),
    });
    if (metadata.success == false) {
      isLoading.value = false;
      return;
    }
    const blockchain = new Blockchain();
    const result = await blockchain.createProfile(metadata.data);
    if (result.success) {
      accountStore.setHasAccount();
      const profile = await blockchain.getProfile(wallet.value);
      if (profile.success) userStore.setUser(profile.data);
      router.push({ path: `/${wallet.value}` });
    }
  } catch (error) {}
  isLoading.value = false;
}
</script>
<!-- prettier-ignore -->
<template>
  <div class="connect">
    <div v-if="!enableForm && !enableReactivate" class="connect__box">
      <button class="connect__button" @click="handleConnect" type="button">
        Connect Wallet
      </button>
      <div class="connect__spacer">
        <span class="connect__spacer-line"></span>
        <span class="connect__spacer-text">or</span>
        <span class="connect__spacer-line"></span>
      </div>
      <button class="connect__button1" @click="enableReactivate = !enableReactivate" type="button">
        Reactivate profile
      </button>
    </div>
    <div v-if="enableForm" class="connect__form">
      <h3 class="connect__title">Create Account</h3>
      <form class="c-form" @submit.prevent="create">
        <div class="c-form__attachment">
          <img
            v-if="avatarURL"
            class="c-form__avatar"
            :src="avatarURL"
            alt=""
          />
          <div v-else class="c-form__placeholder">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z"
                fill="#BDC1C6"
              />
              <path
                d="M17.08 14.1499C14.29 12.2899 9.73996 12.2899 6.92996 14.1499C5.65996 14.9999 4.95996 16.1499 4.95996 17.3799C4.95996 18.6099 5.65996 19.7499 6.91996 20.5899C8.31996 21.5299 10.16 21.9999 12 21.9999C13.84 21.9999 15.68 21.5299 17.08 20.5899C18.34 19.7399 19.04 18.5999 19.04 17.3599C19.03 16.1299 18.34 14.9899 17.08 14.1499Z"
                fill="#BDC1C6"
              />
            </svg>
          </div>
          <label class="c-form__attachment-label" for="avatar">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.4">
                <path
                  d="M9 17V11L7 13"
                  stroke="#BDC1C6"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 11L11 13"
                  stroke="#BDC1C6"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <path
                d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14"
                stroke="#BDC1C6"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22 10H18C15 10 14 9 14 6V2L22 10Z"
                stroke="#BDC1C6"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Upload avatar</span>
          </label>
          <input
            class="c-form__file"
            @change="onFileChange"
            type="file"
            accept="image/png, image/jpeg"
            name="avatar"
            id="avatar"
          />
          <button type="button" @click="avatarURL = ''">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
                stroke="#FF6370"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                opacity="0.34"
                d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
                stroke="#FF6370"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M18.85 9.13989L18.2 19.2099C18.09 20.7799 18 21.9999 15.21 21.9999H8.79002C6.00002 21.9999 5.91002 20.7799 5.80002 19.2099L5.15002 9.13989"
                stroke="#FF6370"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                opacity="0.34"
                d="M10.33 16.5H13.66"
                stroke="#FF6370"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                opacity="0.34"
                d="M9.5 12.5H14.5"
                stroke="#FF6370"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <div class="c-form__field">
          <label class="c-form__label">Wallet</label>
          <button
            class="c-form__connect c-form__connect--address"
            type="button"
          >
            {{ truncateAddress(wallet) }}
          </button>
        </div>
        <div class="c-form__field">
          <label class="c-form__label" for="name">Name</label>
          <input
            class="c-form__input"
            v-model="form.name"
            type="text"
            name="name"
            id="name"
            placeholder="Enter your name"
          />
        </div>
        <div class="c-form__field">
          <label class="c-form__label" for="description">Description</label>
          <input
            class="c-form__input"
            v-model="form.description"
            type="text"
            name="description"
            id="description"
            placeholder="Brief description for your profile..."
          />
        </div>
        <div class="c-form__footer">
          <span class="c-form__info"></span>
          <button
            class="c-form__submit u-flex-line"
            :disabled="!checkForm()"
            type="submit"
          >
            <loading v-if="isLoading" type="small" />
            <template v-else>Create</template>
          </button>
        </div>
      </form>
    </div>
    <div v-if="enableReactivate" class="connect__form">
      <h3 class="connect__title">Reactivate Account</h3>
      <form class="c-form" @submit.prevent="reactivateProfile()">
        <div class="c-form__field">
          <label class="c-form__label" for="name">Profile id</label>
          <input class="c-form__input" v-model="reactivateProfileId" type="text" name="name" id="name" placeholder="Enter with your profile id"/>
        </div>
        <div class="c-form__footer">
          <span class="c-form__info"></span>
          <button class="c-form__submit u-flex-line" :disabled="!reactivateProfileId" type="submit">
            <!-- <loading v-if="isLoading" type="small" />
            <template v-else>Create</template> -->
            Reactivate
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.connect {
  grid-column: sidebar / main-end;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;
  min-height: 100vh;
  padding-block: 100px;
  width: min(480px, 100%);
  margin-inline: auto;
}
.connect__box {
  display: grid;
  gap: 24px;
  width: 100%;
  justify-items: center;
}
.connect__spacer {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 70%;
}
.connect__spacer-line {
  flex-grow: 1;
  height: 1px;
  background-color: #f4f4f4;
  opacity: 0.4;
}
.connect__spacer-text {
  font-size: 1.1rem;
  text-transform: uppercase;
}
.connect__button1 {
  height: 56px;
  border-radius: 12px;
  width: 70%;
  margin-block: auto;
  font-size: 1.5rem;
  color: #f4f4f4;
  border: 1px solid #f4f4f4;
}
.connect__form {
  width: min(480px, 100%);
  display: grid;
  gap: 48px;
}
.connect__title {
  font-size: 2.1rem;
  line-height: 2.4rem;
  font-weight: 500;
  text-align: center;
}
.connect__button {
  height: 56px;
  border-radius: 12px;
  width: 70%;
  margin-block: auto;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1b1d;
  background-color: #f4f4f4;
}
</style>
