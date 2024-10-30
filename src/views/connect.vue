<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useUtils } from "../composables/utils.js";
import { useAccountStore } from "../store/account.js";
import { useUserStore } from "../store/user.js";
import { pinProfileToIPFS } from "../infra/pinata.js";
import { Loading, Icon, Avatar } from "../components";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "@wagmi/vue";
import { abi, contract } from "../contracts/Sograph.js";
import { useProfile } from "../composables/useProfile.js";
const { address } = useAccount();
const { data, writeContractAsync } = useWriteContract();
const isLoading = ref(false);
const avatarURL = ref("");
const form = ref({
  name: "",
  description: "",
  avatar: null,
  links: {
    twitter: "",
  },
});
const router = useRouter();
const enableForm = ref(false);
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

function checkForm() {
  if (
    form.value.name.length >= 3 &&
    form.value.name.length <= 50 &&
    form.value.description.length <= 400 &&
    address.value
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
      links: form.value.links,
      createdAt: new Date().toISOString(),
    });
    if (metadata.success == false) {
      isLoading.value = false;
      return;
    }
    await writeContractAsync({
      abi: abi,
      address: contract,
      functionName: "createProfile",
      args: [metadata.data],
    });
  } catch (error) {}
  isLoading.value = false;
}

async function enableFormCreate() {
  enableForm.value = true;
}

const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
const { getProfile } = useProfile();
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    accountStore.setWallet(address.value);
    accountStore.setConnected();
    accountStore.setHasAccount();
    const profile = await getProfile(address.value);

    if (profile.success) {
      userStore.setUser(profile.data);
      router.push({ path: `/${address.value}` });
    }
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="connect u-flex-line-center">
    <div v-if="!enableForm" class="connect__box">
      <button class="connect__button" @click="enableFormCreate" type="button">
        Create Profile
      </button>
      <div class="connect__spacer u-flex-line">
        <span class="connect__spacer-line"></span>
        <span class="connect__spacer-text">or</span>
        <span class="connect__spacer-line"></span>
      </div>
      <router-link class="connect__button1 u-flex-line-center" to="/reactivate">
        Reactivate profile
      </router-link>
    </div>
    <div v-if="enableForm" class="connect__form">
      <h3 class="connect__title">Create Account</h3>
      <form class="c-form" @submit.prevent="create">
        <div class="c-form__attachment">
          <avatar length="40px" :avatar="avatarURL"/>
          <label class="c-form__attachment-label" for="avatar">
            <icon iconClass="c-icon" name="upload"/>
            <span>Upload avatar</span>
          </label>
          <input class="c-form__file" @change="onFileChange" type="file" accept="image/png, image/jpeg" name="avatar" id="avatar"/>
          <button type="button" @click="avatarURL = ''">
            <icon iconClass="c-icon u-text-danger" name="trash"/>
          </button>
        </div>
        <div class="c-form__field">
          <label class="c-form__label">Wallet</label>
          <button class="c-form__connect c-form__connect--address" type="button">
            {{ truncateAddress(address) }}
          </button>
        </div>
        <div class="c-form__field">
          <label class="c-form__label" for="name">Name</label>
          <input class="c-form__input" v-model="form.name" type="text" name="name" id="name" placeholder="Enter your name"/>
        </div>
        <div class="c-form__field">
          <label class="c-form__label" for="description">Description</label>
          <input class="c-form__input" v-model="form.description" type="text" name="description" id="description" placeholder="Brief description for your profile..."/>
        </div>
        <div class="c-form__footer">
          <span class="c-form__info"></span>
          <button class="c-form__submit u-flex-line" :disabled="!checkForm()" type="submit">
            <loading v-if="isLoading" type="small"/>
            <template v-else>Create</template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<style>
.connect {
  grid-column: sidebar / main-end;
  flex-direction: column;
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
  gap: 8px;
  width: 70%;
}
.connect__spacer-line {
  flex-grow: 1;
  height: 1px;
  background-color: var(--bg-color-quaternary);
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
  border: 1px solid var(--bg-color-quaternary);
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
  color: var(--text-color-quinary);
  background-color: var(--bg-color-quaternary);
}
</style>
