<script setup>
import { Icon } from "./";
import { storeToRefs } from "pinia";
import { useErrorStore } from "../store/error.js";
const errorStore = useErrorStore();
const { error } = storeToRefs(errorStore);
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-toast u-flex-line-between">
    {{ error }} 
    <icon @click="errorStore.removeError()" iconClass="c-icon" name="close"/>
  </div>
</template>
<style>
.c-toast {
  background-color: var(--color-red);
  border-radius: 12px;
  height: 56px;
  min-width: 150px;
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  gap: 16px;
  padding-inline: 16px;
  color: #ffffff;
  font-weight: 500;
}
.c-toast svg {
  color: var(--text-color-primary) !important;
  cursor: pointer;
}
</style>
