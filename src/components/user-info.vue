<script setup>
import { storeToRefs } from "pinia";
import { useAccountStore } from "../store/account.js";
import { useUserStore } from "../store/user.js";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { Avatar, Icon } from "./";
import { useDisconnect } from "@wagmi/vue";

const { disconnect } = useDisconnect();
const router = useRouter();
const accountStore = useAccountStore();
const userStore = useUserStore();
const { resetAccount } = accountStore;
const { removeUser } = userStore;
const { user } = storeToRefs(userStore);

const pathProfile = computed(() => {
  return user.value?.handle ? user.value?.handle : user.value?.owner;
});

function logout() {
  const path = pathProfile.value;
  resetAccount();
  removeUser();
  disconnect();
  router.push({ path: `/${path}` });
}
</script>
<!-- prettier-ignore -->
<template>
  <header class="c-user-info u-flex-line-between">
    <div class="c-user-info__left u-flex-line">
      <h3 class="c-user-info__name u-text-ellipsis">{{ user.name }}</h3>
      <icon iconClass="c-icon" name="arrow"/>
      <ul class="c-user-info__dropdown">
        <li><button class="c-user-info__dropdown-item" @click="logout" type="button">Logout</button></li>
      </ul>
    </div>
    <div class="c-user-info__avatar-wrapper">
      <avatar :avatar="user.avatar" length="40px"/>
      <span class="c-user-info__status"></span>
    </div>
  </header>
</template>
<style>
.c-user-info {
  padding-inline: 16px;
}
.c-user-info__left {
  gap: 8px;
  position: relative;
  height: 100%;
}
.c-user-info__left svg {
  margin-top: 2px;
  stroke: var(--color-icon-primary);
  height: 1.4rem;
  width: 1.4rem;
}
.c-user-info__name {
  font-size: 2.1rem;
  font-weight: 500;
  max-width: 150px;
}
.c-user-info__avatar-wrapper {
  position: relative;
  display: flex;
}
.c-user-info__status {
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background-color: var(--color-green);
  border: 3px solid var(--bg-color-primary);
  position: absolute;
  bottom: -2px;
  right: -1px;
}
.c-user-info__dropdown {
  position: absolute;
  top: 100%;
  left: -4px;
  background-color: var(--bg-color-tertiary);
  padding: 24px 32px;
  border-radius: 12px;
  width: 220px;
  display: none;
  z-index: 5;
  gap: 24px;
}
.c-user-info__dropdown-item {
  width: 100%;
  text-align: left;
}
.c-user-info__left:hover .c-user-info__dropdown {
  display: grid;
}
</style>
