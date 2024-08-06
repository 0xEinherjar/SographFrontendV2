<script setup>
import { ref } from "vue";

const isLight = ref(false);
// function toggleLightMode() {
//   if (!isLight.value) {
//     document.querySelector("html").classList.add("light-mode");
//     isLight.value = true;
//   } else {
//     document.querySelector("html").classList.remove("light-mode");
//     isLight.value = false;
//   }
// }
</script>
<!-- prettier-ignore -->
<template>
  <span class="c-toggle" :class="{'is-active': isLight}" @click="toggleLightMode" role="button"></span>
</template>
<style>
.c-toggle {
  height: 14px;
  width: 34px;
  border-radius: 14px;
  background-color: rgba(1, 119, 251, 0.25);
  position: relative;
  transition: 0.7s all ease;
}
.c-toggle.is-active {
  background-color: rgba(189, 193, 198, 0.25);
}
.c-toggle::before {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: #0177fb;
  transition: 0.7s all ease;
}
.c-toggle.is-active::before {
  left: 0;
  background-color: #bdc1c6;
}
</style>
