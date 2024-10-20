<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "@wagmi/vue";
import { useAccountStore } from "../store/account.js";
import { useUserStore } from "../store/user.js";
import { ButtonReactivate } from "../components";
import { useProfile } from "../composables/useProfile.js";
import { contract as contractSograph } from "../contracts/Sograph.js";
import { abi, contract } from "../contracts/ProfileNFT.js";
const { getProfile } = useProfile();
const { writeContractAsync, data } = useWriteContract();
const isLoading = ref(false);
const reactivateProfileId = ref(null);
const router = useRouter();
const accountStore = useAccountStore();
const userStore = useUserStore();
const { address } = useAccount();

async function reactivateProfile() {
  if (!reactivateProfileId || !address.value) return;
  isLoading.value = true;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "approve",
    args: [contractSograph, reactivateProfileId.value],
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
async function reactivate() {
  console.log("chamou");
  console.log(address.value);

  const profile = await getProfile(address.value);
  console.log(profile);

  if (!profile.success) return;
  accountStore.setWallet(address.value);
  accountStore.setConnected();
  userStore.setUser(profile.data);
  accountStore.setHasAccount();
  isLoading.value = false;
  router.push({
    path: `/${profile.data.handle ? profile.data.handle : address.value}`,
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
          <button v-if="!isSuccess" class="c-form__submit u-flex-line" :disabled="!reactivateProfileId" type="submit">
            Approve
          </button>
          <button-reactivate v-else :id="reactivateProfileId" @reactivate="reactivate"/>
        </div>
      </form>
    </div>
  </div>
</template>

<style></style>
