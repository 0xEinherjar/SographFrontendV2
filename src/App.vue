<script setup>
import { storeToRefs } from "pinia";
import { useErrorStore } from "./store/error.js";
const errorStore = useErrorStore();
const { error } = storeToRefs(errorStore);
import { Toast } from "./components";
</script>
<!-- prettier-ignore -->
<template>
  <toast v-if="error"/>
  <router-view></router-view>
</template>
<style></style>
