<script setup>
const { length, radius, avatar } = defineProps(["length", "radius", "avatar"]);
import Icon from "./icons/icon.vue";
</script>
<!-- prettier-ignore -->
<template>
  <img v-if="avatar" class="c-avatar" :src="avatar" :style="{width: length, height: length, 'border-radius': radius || length}" alt="User avatar">
  <div v-else class="c-avatar--placeholder" :style="{width: length, height: length, 'border-radius': radius || length}">
    <icon iconClass="c-icon1" name="profile"/>
  </div>
</template>
<style>
.c-avatar {
  flex-shrink: 0;
  object-fit: cover;
}
.c-avatar--placeholder {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background-color: var(--bg-color-tertiary);
}
.c-avatar--placeholder svg {
  height: 40%;
  width: 40%;
}
</style>
