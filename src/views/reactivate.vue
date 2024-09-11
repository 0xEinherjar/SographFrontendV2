<script setup>
import { useWeb3ModalAccount } from "@web3modal/ethers/vue";
import { inject, ref } from "vue";
import { useRouter } from "vue-router";
import { useAccountStore } from "../store/account.js";
import { useUserStore } from "../store/user.js";
import { Loading } from "../components";
const blockchainClient = inject("blockchainClient");
const isLoading = ref(false);
const reactivateProfileId = ref(null);
const router = useRouter();
const accountStore = useAccountStore();
const userStore = useUserStore();
const { address } = useWeb3ModalAccount();
const form = ref({
  name: "",
  description: "",
  avatar: null,
});

async function reactivateProfile() {
  if (!reactivateProfileId || !address.value) return;
  isLoading.value = true;
  await blockchainClient.approve(reactivateProfileId.value);
  const reactivateResult = await blockchainClient.reactivateProfile(
    reactivateProfileId.value
  );
  if (!reactivateResult.success) return;
  const profileResult = await blockchainClient.getProfile(address.value);
  if (!profileResult.success) return;
  accountStore.setWallet(address.value);
  accountStore.setConnected();
  userStore.setUser(profileResult.data);
  accountStore.setHasAccount();
  isLoading.value = false;
  router.push({
    path: `/${
      profileResult.data.handle ? profileResult.data.handle : address.value
    }`,
  });
}
</script>
<!-- prettier-ignore -->
<template>
  <div class="connect">
    <div class="connect__form">
      <h3 class="connect__title">Reactivate Account</h3>
      <form class="c-form" @submit.prevent="reactivateProfile()">
        <div class="c-form__field">
          <label class="c-form__label" for="name">Profile id</label>
          <input class="c-form__input" v-model="reactivateProfileId" type="text" name="name" id="name" placeholder="Enter with your profile id"/>
        </div>
        <div class="c-form__footer">
          <span class="c-form__info"></span>
          <button class="c-form__submit u-flex-line" :disabled="!reactivateProfileId" type="submit">
            <loading v-if="isLoading" type="small"/>
            <template v-else>Reactivate</template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style></style>
