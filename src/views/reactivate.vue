<script setup>
import { ref, watch } from "vue";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "@wagmi/vue";
import { ButtonReactivate, Loading } from "../components";
import { contract as contractSograph } from "../contracts/Sograph.js";
import { abi, contract } from "../contracts/ProfileNFT.js";
const { writeContractAsync, data } = useWriteContract();
const isLoading = ref(false);
const reactivateProfileId = ref(null);
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
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    isLoading.value = false;
  }
});
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
            <loading v-if="isLoading" type="small"/>
            <template v-else>Approve</template>
          </button>
          <button-reactivate v-else :id="reactivateProfileId"/>
        </div>
      </form>
    </div>
  </div>
</template>

<style></style>
