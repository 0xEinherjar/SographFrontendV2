<script setup>
import { computed } from "vue";
import { useUtils } from "../composables/utils.js";
import Blockchain from "../infra/blockchain.js";
import { Avatar } from "./";
const { truncateAddress } = useUtils();
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
async function handleFollow(address) {
  const blockchain = new Blockchain();
  const result = await blockchain.follow(address);
  if (result.success) {
  }
}

async function handleUnfollow(address) {
  const blockchain = new Blockchain();
  const result = await blockchain.unfollow(address);
  if (result.success) {
  }
}
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
      <button v-if="props.isFollowing" class="c-user__action" type="button" @click="handleUnfollow(props.owner)">Following</button>
      <button v-else class="c-user__action" type="button" @click="handleFollow(props.owner)">Follow</button>
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
  color: rgba(189, 193, 198, 0.4);
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
</style>
