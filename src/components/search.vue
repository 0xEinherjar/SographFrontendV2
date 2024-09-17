<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { Icon } from "./";

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
      <icon iconClass="c-icon" name="search"/>
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
