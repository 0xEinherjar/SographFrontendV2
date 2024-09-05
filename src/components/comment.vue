<script setup>
import { useUtils } from "../composables/utils.js";
import Avatar from "./avatar.vue";
const { dateFormat } = useUtils();
const props = defineProps(["date", "text", "name", "avatar"]);
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-comment">
    <avatar length="24px" :avatar="props.avatar"/>
    <div class="c-comment__info u-flex-line">
      <div class="c-comment__name">{{ props.name }}</div>
      <span class="c-comment__dot"></span>
      <time class="c-comment__time" :datetime="props.date">{{ dateFormat(props.date) }}</time>
    </div>
    <div class="c-comment__paragraph">{{ props.text }}</div>
  </div>
</template>
<style>
.c-comment {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 10px;
}
.c-comment__info {
  gap: 8px;
}
.c-comment__name {
  font-weight: 500;
  font-size: 1.4rem;
  line-height: 1.9rem;
}
.c-comment__author {
  gap: 10px;
}
.c-comment__paragraph {
  font-size: 1.5rem;
  grid-column: 2/3;
  color: var(--text-color-quaternary);
}
.c-comment__dot {
  height: 2px;
  width: 2px;
  border-radius: 50%;
  background-color: var(--bg-color-quaternary);
  opacity: 0.7;
}
.c-comment__time {
  font-size: 1.4rem;
  opacity: 0.4;
}
</style>
