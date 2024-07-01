<script setup>
import Avatar from "./avatar.vue";
import { useHistoryStore } from "../store/history.js";
import { storeToRefs } from "pinia";
import { watch } from "vue";
import Blockchain from "../infra/blockchain.js";

const historyStore = useHistoryStore();
const { history } = storeToRefs(historyStore);
watch(
  () => history.value.name,
  async (_) => {
    if (history.value.isProfile) {
      const blockchain = new Blockchain();
      const result = await blockchain.getProfile(history.value.name);
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
  <router-link :to="history.route || '#'" class="c-back" role="button">
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.40625 12.4498L5.33125 8.3748C4.85 7.89355 4.85 7.10605 5.33125 6.6248L9.40625 2.5498" stroke="#BDC1C6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="c-back__text">back to</span>
    <template v-if="history.route || history.isProfile">
      <avatar v-if="history.isProfile" class="c-back__avatar" :avatar="history.avatar" length="26px" radius="8px"/>
      <svg v-if="history.name == 'Feed'" class="c-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M10.0703 2.81986L3.14027 8.36985C2.36027 8.98985 1.86027 10.2999 2.03027 11.2799L3.36027 19.2398C3.60027 20.6598 4.96026 21.8099 6.40026 21.8099H17.6003C19.0303 21.8099 20.4003 20.6498 20.6403 19.2398L21.9703 11.2799C22.1303 10.2999 21.6303 8.98985 20.8603 8.36985L13.9303 2.82984C12.8603 1.96984 11.1303 1.96986 10.0703 2.81986Z"/>
        <path d="M12 15.5C13.3807 15.5 14.5 14.3807 14.5 13C14.5 11.6193 13.3807 10.5 12 10.5C10.6193 10.5 9.5 11.6193 9.5 13C9.5 14.3807 10.6193 15.5 12 15.5Z"/>
      </svg>
      <svg v-if="history.name == 'Explorer'" class="c-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
        <path d="M14.3251 14.3268C16.2074 12.4445 16.6918 9.877 15.407 8.59219C14.1221 7.30738 11.5547 7.79174 9.67238 9.67405C7.79007 11.5564 7.30571 14.1238 8.59052 15.4086C9.87533 16.6934 12.4428 16.2091 14.3251 14.3268Z"/>
      </svg>
      <svg v-if="history.name == 'Settings'" class="c-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"/>
        <path d="M12 15.25C13.7949 15.25 15.25 13.7949 15.25 12C15.25 10.2051 13.7949 8.75 12 8.75C10.2051 8.75 8.75 10.2051 8.75 12C8.75 13.7949 10.2051 15.25 12 15.25Z"/>
      </svg>
      <h6 class="c-back__name">{{ history.name }}</h6>
    </template>
    <template v-else>
      <svg class="c-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M10.0703 2.81986L3.14027 8.36985C2.36027 8.98985 1.86027 10.2999 2.03027 11.2799L3.36027 19.2398C3.60027 20.6598 4.96026 21.8099 6.40026 21.8099H17.6003C19.0303 21.8099 20.4003 20.6498 20.6403 19.2398L21.9703 11.2799C22.1303 10.2999 21.6303 8.98985 20.8603 8.36985L13.9303 2.82984C12.8603 1.96984 11.1303 1.96986 10.0703 2.81986Z"/>
        <path d="M12 15.5C13.3807 15.5 14.5 14.3807 14.5 13C14.5 11.6193 13.3807 10.5 12 10.5C10.6193 10.5 9.5 11.6193 9.5 13C9.5 14.3807 10.6193 15.5 12 15.5Z"/>
      </svg>
      <h6 class="c-back__name">Feed</h6>
    </template>
  </router-link>
</template>
<style>
.c-back {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.c-back__text {
  font-size: 1.4rem;
  color: #bdc1c6;
  margin-left: 4px;
}
.c-back > .c-icon,
.c-back__avatar {
  margin-inline: 12px;
}
.c-back__name {
  font-size: 1.4rem;
  font-weight: 500;
  color: #f4f4f4;
}
</style>
