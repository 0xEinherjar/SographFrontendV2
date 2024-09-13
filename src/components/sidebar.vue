<script setup>
import { Avatar, Logo, CardPayment, UserInfo, Toggle, Search, Icon } from "./";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user.js";
import { useAccountStore } from "../store/account.js";
import { computed } from "vue";
import { useFavoriteStore } from "../store/favorite.js";
const favoriteStore = useFavoriteStore();
const { favorite } = storeToRefs(favoriteStore);
const userStore = useUserStore();
const accountStore = useAccountStore();
const { user } = storeToRefs(userStore);
const { account } = storeToRefs(accountStore);

const pathProfile = computed(() => {
  return user.value?.handle ? user.value?.handle : user.value?.owner;
});
</script>
<!-- prettier-ignore -->
<template>
  <aside class="sidebar">
    <div class="sidebar__inner">
      <div class="sidebar__wrapper">
        <user-info v-if="account.hasAccount"/>
        <router-link v-else to="/" class="sidebar__logo u-flex-line">
          <logo/>
        </router-link>
        <search/>
        <section class="sidebar__collapse">
          <h6 class="sidebar__caption">Overview</h6>
          <ul class="sidebar__list">
            <template v-if="account.hasAccount">
              <li>
                <router-link class="sidebar__item" to="/feed">
                  <icon iconClass="c-icon1" name="home"/>
                  <span class="sidebar__text">Feed</span>
                </router-link>
              </li>
              <li>
                <router-link class="sidebar__item" :to="`/${pathProfile}`">
                  <icon iconClass="c-icon1" name="profile"/>
                  <span class="sidebar__text">Profile</span>
                </router-link>
              </li>
              <li>
                <card-payment />
              </li>
            </template>
            <li>
              <router-link class="sidebar__item" to="#">
                <icon iconClass="c-icon1" name="explore"/>
                <span class="sidebar__text c-soon">Explorer</span>
              </router-link>
            </li>
            <li>
              <a class="sidebar__item" href="https://faucet.sograph.app/">
                <icon iconClass="c-icon1" name="wallet"/>
                <span class="sidebar__text">Faucet</span>
              </a>
            </li>
          </ul>
          <input class="sidebar__collapse-checkbox" type="checkbox" id="collapse">
          <label class="sidebar__collapse-button" role="button" for="collapse">
            <icon iconClass="c-icon1" name="more1"/>
            <span class="sidebar__collapse-text show-more">Show More</span>
            <span class="sidebar__collapse-text show-less">Show Less</span>
          </label>
        </section>
        <router-link v-if="!account.hasAccount" class="sidebar__connect u-flex-line-center" to="/">Connect</router-link>
        <section v-if="account.hasAccount && favorite.length">
          <h6 class="sidebar__caption">Favorite Profile</h6>
          <ul class="sidebar__list">
            <li v-for="user of favorite">
              <router-link class="sidebar__link" :to="`/${user.path}`">
                <avatar :avatar="user.avatar" length="28px"/>
                <span class="sidebar__text">{{ user.name }}</span>
              </router-link>
            </li>
          </ul>
        </section>
      </div>
      <ul class="sidebar__list">
        <li v-if="account.hasAccount">
          <router-link class="sidebar__item" to="/settings">
            <icon iconClass="c-icon1" name="setting"/>
            <span class="sidebar__text">Settings</span>
          </router-link>
        </li>
        <li class="sidebar__item">
          <icon iconClass="c-icon1" name="sun"/>
          <span class="sidebar__text">Dark Mode</span>
          <toggle/>
        </li>
      </ul>
    </div>
  </aside>
</template>
<style>
:root {
  --list-item-height: 48;
  --gap: 4;
  --max-item: 2;
}
.sidebar {
  grid-column: sidebar;
  position: relative;
}
.sidebar__inner {
  padding: 32px 24px;
  position: sticky;
  top: 0;
  left: 0;
  overflow-y: auto;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.sidebar__inner::-webkit-scrollbar {
  width: 0;
}
.sidebar__wrapper {
  display: grid;
  grid-gap: 32px;
  margin-bottom: 32px;
  flex-grow: 1;
  grid-auto-rows: min-content;
}
.sidebar__logo {
  height: 40px;
  padding-inline: 16px;
}
.sidebar__caption {
  font-size: 1.2rem;
  line-height: 1.2rem;
  margin-bottom: 12px;
  margin-left: 16px;
  font-weight: 400;
  pointer-events: none;
  color: rgba(189, 193, 198, 0.8);
}
.light-mode .sidebar__caption {
  color: #292d32cc;
}
.sidebar__list {
  display: flex;
  flex-direction: column;
  gap: calc(var(--gap) * 1px);
}
.sidebar__item,
.sidebar__link {
  height: calc(var(--list-item-height) * 1px);
  padding-inline: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  cursor: pointer;
}
.sidebar__text {
  flex-grow: 1;
  color: var(--text-color-primary);
}
.light-mode .sidebar__text {
  color: var(--text-color-primary);
  font-weight: 500;
}
.sidebar__collapse > .sidebar__list {
  height: calc(
    ((var(--list-item-height) + var(--gap)) * var(--max-item) - var(--gap)) *
      1px
  );
  overflow: hidden;
}
.sidebar__collapse > .sidebar__list:has(+ .sidebar__collapse-checkbox:checked) {
  height: auto;
}
.show-less,
.sidebar__collapse-checkbox {
  display: none;
}
.sidebar__collapse-button {
  height: calc(var(--list-item-height) * 1px);
  padding-inline: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 4px;
  cursor: pointer;
  user-select: none;
}
.sidebar__collapse-text {
  flex-shrink: 1;
  color: var(--text-color-tertiary);
}
.sidebar__collapse-checkbox:checked + .sidebar__collapse-button > .show-more {
  display: none;
}
.sidebar__collapse-checkbox:checked + .sidebar__collapse-button > .show-less {
  display: inline-block;
}
.sidebar__connect {
  height: 48px;
  border-radius: 12px;
  background-color: var(--text-color-primary);
  color: var(--bg-color-primary);
  font-weight: 500;
  cursor: pointer;
  width: calc(100% - 32px);
  margin-inline: auto;
}
</style>
