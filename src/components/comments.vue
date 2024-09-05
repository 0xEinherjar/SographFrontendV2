<script setup>
import { ref, onBeforeMount } from "vue";
import Comment from "./comment.vue";
import CreateComment from "./create-comment.vue";
import IconClose from "./icons/close.vue";
import Post from "../infra/post.js";
const props = defineProps(["id"]);
const comments = ref([]);
function newComment(data) {
  comments.value.unshift(data);
}
onBeforeMount(async () => {
  const post = new Post();
  const { data } = await post.getComments(props.id, 0, 20);
  comments.value = data;
});
</script>
<!-- prettier-ignore -->
<template>
  <!-- <Teleport to="body"> -->
    <div class="c-comments-layer">
      <div class="c-comments">
        <div class="u-flex-line-between">
          <div class="c-comments__title u-flex-line">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 9C17 12.87 13.64 16 9.5 16L8.57001 17.12L8.02 17.78C7.55 18.34 6.65 18.22 6.34 17.55L5 14.6C3.18 13.32 2 11.29 2 9C2 5.13 5.36 2 9.5 2C12.52 2 15.13 3.67001 16.3 6.07001C16.75 6.96001 17 7.95 17 9Z" stroke="#f4f4f4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path opacity="0.4" d="M22.0003 12.86C22.0003 15.15 20.8203 17.1801 19.0003 18.4601L17.6603 21.41C17.3503 22.08 16.4503 22.2101 15.9803 21.6401L14.5003 19.86C12.0803 19.86 9.92031 18.7901 8.57031 17.1201L9.50031 16.0001C13.6403 16.0001 17.0003 12.8701 17.0003 9.00006C17.0003 7.95006 16.7503 6.96007 16.3003 6.07007C19.5703 6.82007 22.0003 9.58005 22.0003 12.86Z" stroke="#f4f4f4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path opacity="0.4" d="M7 9H12" stroke="#f4f4f4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Comments <span class="c-comments__counter">{{ comments.length }}</span></span>
          </div>
          <button class="c-comments__close" @click="$emit('close')" type="button">
            <icon-close />
          </button>
        </div>
        <create-comment @new-comment="newComment" :id="props.id"/>
        <div v-if="comments?.length > 0" class="c-comments__list">
          <template v-for="item in comments">
            <comment :date="item.createdAt" :text="item.text" :name="item.authorName" :avatar="item.authorAvatar"/>
          </template>
        </div>
        <div v-else class="c-comments__note">No comments have been made yet.</div>
      </div>
    </div>
  <!-- </Teleport> -->
</template>
<style>
.c-comments-layer {
  position: fixed;
  inset: 0 0 0 0;
  display: grid;
  place-items: center;
  background-color: rgba(26, 27, 29, 0.85);
  overflow-y: auto;
  z-index: 2;
}
.c-comments {
  width: min(500px, 100%);
  padding: 32px 24px;
  background-color: #28292b;
  border-radius: 20px;
  margin-block: 40px;
  display: grid;
  gap: 32px;
  position: relative;
}
.c-comments__title {
  gap: 8px;
  font-size: 1.6rem;
}
.c-comments__title svg {
  height: 2.2rem;
  width: 2.2rem;
}
.c-comments__counter {
  opacity: 0.4;
}
.c-comments__list {
  display: grid;
  gap: 32px;
  max-height: 400px;
  overflow-y: auto;
}
.c-comments__list::-webkit-scrollbar-track {
  background: transparent;
}
.c-comments__list::-webkit-scrollbar-thumb {
  background-color: var(--bg-color-tertiary);
  border-radius: 10px;
}
.c-comments__list::-webkit-scrollbar {
  width: 6px;
}
.c-comments__note {
  font-size: 1.4rem;
  text-align: center;
}
</style>
