<script setup>
import { computed } from "vue";
import { useUtils } from "../composables/utils.js";
import Blockchain from "../infra/blockchain.js";
const { truncateAddress } = useUtils();
const {
  avatar,
  name,
  handle,
  owner,
  hasSubscription,
  isFollowing,
  isConnected,
} = defineProps([
  "avatar",
  "name",
  "handle",
  "owner",
  "hasSubscription",
  "isFollowing",
  "isConnected",
]);
const username = computed(() => {
  return Boolean(handle) ? handle : owner;
});
async function handleFollow(address) {
  const blockchain = new Blockchain();
  const result = await blockchain.follow(address);
  if (result.success) {
    profile.value.isFollowing = true;
    profile.value.followers += 1;
  }
}

async function handleUnfollow(address) {
  const blockchain = new Blockchain();
  const result = await blockchain.unfollow(address);
  if (result.success) {
    profile.value.isFollowing = false;
    profile.value.followers -= 1;
  }
}
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-user">
    <router-link :to="`/user/${username}`">
      <img v-if="avatar" class="c-user__image" :src="avatar" alt="" />
      <div v-else class="c-user__image-placeholder">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.4" d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="#BDC1C6"/>
          <path d="M17.08 14.1499C14.29 12.2899 9.73996 12.2899 6.92996 14.1499C5.65996 14.9999 4.95996 16.1499 4.95996 17.3799C4.95996 18.6099 5.65996 19.7499 6.91996 20.5899C8.31996 21.5299 10.16 21.9999 12 21.9999C13.84 21.9999 15.68 21.5299 17.08 20.5899C18.34 19.7399 19.04 18.5999 19.04 17.3599C19.03 16.1299 18.34 14.9899 17.08 14.1499Z" fill="#BDC1C6"/>
        </svg>
      </div>
    </router-link>
    <h4 class="c-user__name u-text-ellipsis">{{ name }}</h4>
    <span class="c-user__username u-text-ellipsis">{{ username.length == 42 ? truncateAddress(username) : `@${username}` }}</span>
    <button v-if="isFollowing" class="c-user__action" type="button" @click="handleUnfollow(owner)">Following</button>
    <button v-else class="c-user__action" type="button" @click="handleFollow(owner)">Follow</button>
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
.c-user__image {
  height: 104px;
  width: 104px;
  border-radius: 50%;
  object-fit: cover;
}
.c-user__image-placeholder {
  height: 104px;
  width: 104px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color-tertiary);
}
.c-user__image-placeholder svg {
  height: 40px;
  width: 40px;
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
