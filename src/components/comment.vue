<script setup>
import { useUtils } from "../composables/utils.js";
import Avatar from "./avatar.vue";
const { dateFormat } = useUtils();
// const { date } = defineProps(["date"]);
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-comment">
    <avatar length="24px"/>
    <div class="c-comment__info u-flex-line">
      <div class="c-comment__name">Chily Mii</div>
      <span class="c-comment__dot"></span>
      <time class="c-comment__time">{{ "Jul 15" }}</time>
      <!-- <time class="c-comment__time" :datetime="date">{{ dateFormat(date) }}</time> -->
    </div>
    <div class="c-comment__paragraph">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit magni, non enim nisi.
    </div>
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
  color: var(--text-color-tertiary);
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
