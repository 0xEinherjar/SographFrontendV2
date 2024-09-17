<script setup>
import { storeToRefs } from "pinia";
import { inject, watch } from "vue";
import { Avatar, Icon } from "./";
import { useHistoryStore } from "../store/history.js";
const blockchainClient = inject("blockchainClient");

const historyStore = useHistoryStore();
const { history } = storeToRefs(historyStore);
watch(
  () => history.value.name,
  async (_) => {
    if (history.value.isProfile) {
      const result = await blockchainClient.getProfile(history.value.name);
      if (result.success) {
        historyStore.setHistory({
          avatar: result.data.avatar,
          name: result.data.name,
          isProfile: true,
          route: result.data.handle || result.data.owner,
        });
      }
    }
  }
);
</script>
<!-- prettier-ignore -->
<template>
  <router-link :to="history.route || '#'" class="c-back u-flex-line" role="button">
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.40625 12.4498L5.33125 8.3748C4.85 7.89355 4.85 7.10605 5.33125 6.6248L9.40625 2.5498" stroke="#BDC1C6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="c-back__text">back to</span>
    <template v-if="history.route || history.isProfile">
      <avatar v-if="history.isProfile" class="c-back__avatar" :avatar="history.avatar" length="26px" radius="8px"/>
      <icon v-if="history.name == 'Feed'" iconClass="c-icon" name="home"/>
      <icon v-if="history.name == 'Explorer'" iconClass="c-icon" name="explore"/>
      <icon v-if="history.name == 'Settings'" iconClass="c-icon" name="setting"/>
      <h6 class="c-back__name">{{ history.name }}</h6>
    </template>
    <template v-else>
      <icon v-if="history.name == 'Feed'" iconClass="c-icon" name="home"/>
      <h6 class="c-back__name">Feed</h6>
    </template>
  </router-link>
</template>
<style>
.c-back {
  cursor: pointer;
  font-size: 1.4rem;
}
.c-back__text {
  color: var(--text-color-primary);
  margin-left: 4px;
}
.c-back > .c-icon,
.c-back__avatar {
  margin-inline: 12px;
}
.c-back__name {
  font-weight: 500;
}
</style>
