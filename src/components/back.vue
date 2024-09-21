<script setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Avatar, Icon } from "./";
import { useHistoryStore } from "../store/history.js";
const router = useRouter();
const historyStore = useHistoryStore();
const { history } = storeToRefs(historyStore);

function back() {
  const lastRoute = historyStore.back();
  if (!lastRoute) return;
  router.push({ path: `/${lastRoute.route}` });
}
const lastPath = computed(() => {
  return history.value.at(-1);
});
</script>
<!-- prettier-ignore -->
<template>
  <div @click="back" class="c-back u-flex-line" role="button">
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.40625 12.4498L5.33125 8.3748C4.85 7.89355 4.85 7.10605 5.33125 6.6248L9.40625 2.5498" stroke="#BDC1C6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="c-back__text">back to</span>
    <template v-if="lastPath.isProfile">
      <avatar v-if="lastPath.isProfile" class="c-back__avatar" :avatar="lastPath.avatar" length="26px" radius="8px"/>
    </template>
    <template v-else>
      <icon v-if="lastPath.name == 'feed'" iconClass="c-icon" name="home"/>
      <icon v-if="lastPath.name == 'explorer'" iconClass="c-icon" name="explore"/>
      <icon v-if="lastPath.name == 'settings'" iconClass="c-icon" name="setting"/>
    </template>
    <h6 class="c-back__name">{{ lastPath.name }}</h6>
    <!-- <template v-else>
      <icon v-if="lastPath.name == 'Feed'" iconClass="c-icon" name="home"/>
      <h6 class="c-back__name">Feed</h6>
    </template> -->
  </div>
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
