<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const formSearch = ref("");

function search() {
  if (!formSearch.value) return;
  router.push({ path: `/${formSearch.value.toLowerCase()}` });
  formSearch.value = "";
}
</script>
<!-- prettier-ignore -->
<template>
  <form class="search u-flex-line" @submit.prevent="search">
    <button class="search__button u-flex-line">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" fill="#9AA0A6"/>
        <path d="M21.2996 22.0001C21.1196 22.0001 20.9396 21.9301 20.8096 21.8001L18.9496 19.9401C18.6796 19.6701 18.6796 19.2301 18.9496 18.9501C19.2196 18.6801 19.6596 18.6801 19.9396 18.9501L21.7996 20.8101C22.0696 21.0801 22.0696 21.5201 21.7996 21.8001C21.6596 21.9301 21.4796 22.0001 21.2996 22.0001Z" fill="#9AA0A6"/>
      </svg>
    </button>
    <input class="search__input" type="text" v-model="formSearch" placeholder="Search">
    <span class="search__badge"><span>s</span></span>
  </form>
</template>
<style>
.search {
  gap: 16px;
  height: 48px;
  width: 100%;
  border-radius: 12px;
  background-color: var(--bg-color-secondary);
  padding-inline: 16px;
}
.search__input {
  width: 100%;
  height: 100%;
}
.search__button {
  height: 100%;
}
.search__badge {
  background-color: rgba(189, 193, 198, 0.4);
  height: 20px;
  width: 20px;
  border-radius: 4px;
  color: var(--text-color-secondary);
  flex-shrink: 0;
  font-size: 1.4rem;
  line-height: 1;
  display: grid;
  place-items: center;
  padding-bottom: 2px;
}
</style>
