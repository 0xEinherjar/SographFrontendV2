<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/Sograph";
import { useUtils } from "../composables/utils.js";
import { Avatar, Loading } from "./";
import { useErrorStore } from "../store/error.js";
import { useUserStore } from "../store/user.js";
import { storeToRefs } from "pinia";
const { user } = storeToRefs(useUserStore());
const errorStore = useErrorStore();
const { truncateAddress } = useUtils();
const { writeContractAsync, data, error } = useWriteContract();
const isFollowing = ref(false);
const isLoading = ref(false);
const props = defineProps([
  "avatar",
  "name",
  "handle",
  "owner",
  "hasSubscription",
  "isFollowing",
  "isConnected",
]);
const username = computed(() => {
  return Boolean(props.handle) ? props.handle : props.owner;
});
const isMyProfile = computed(() => {
  return user.value?.owner == props.owner;
});
async function follow(address) {
  isLoading.value = true;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "follow",
    args: [address],
  });
}

const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    isFollowing.value = !isFollowing.value;
    isLoading.value = false;
  }
});
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
    isLoading.value = false;
  }
});
onMounted(() => {
  isFollowing.value = props.isFollowing;
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-user">
    <router-link :to="`/${username}`">
      <avatar :avatar="props.avatar" length="104px"/>
    </router-link>
    <h4 class="c-user__name u-text-ellipsis">{{ props.name }}</h4>
    <span class="c-user__username u-text-ellipsis">{{ username.length == 42 ? truncateAddress(username) : `@${username}` }}</span>
    <button v-if="!props.isConnected" class="c-user__action" type="button">Follow</button>
    <template v-else>
      <button v-if="!isMyProfile" class="c-user__action u-flex-line-center" type="button" @click="follow(props.owner)">
        <template v-if="!isLoading">{{ isFollowing ? "Following" : "Follow"}}</template>
        <loading v-else type="small" theme="dark"/>
      </button>
      <button v-else class="c-user__action c-user__action--none" type="button">You</button>
    </template>
  </div>
</template>
<style>
.c-user {
  display: grid;
  gap: 4px;
  justify-items: center;
  width: max-content;
  max-width: 110px;
}
.c-user__name {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 500;
}
.c-user__username {
  font-size: 1.2rem;
  line-height: 1.8rem;
  font-weight: 500;
  color: var(--text-color-secondary);
}
.c-user__name,
.c-user__username {
  display: block;
  width: 100%;
  text-align: center;
}
.c-user__action {
  height: 32px;
  border-radius: 8px;
  padding-inline: 16px;
  font-size: 1.2rem;
  font-weight: 600;
  background-color: var(--text-color-primary);
  color: var(--bg-color-primary);
  margin-top: 12px;
  display: block;
}
.c-user__action--none {
  color: var(--text-color-primary);
  background-color: var(--bg-color-tertiary);
}
</style>
