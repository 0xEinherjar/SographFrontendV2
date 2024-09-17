<script setup>
import { ref, onBeforeMount, inject } from "vue";
import { Comment, CreateComment, Icon, CommentPlaceholder } from "./";
const postClient = inject("postClient");
const props = defineProps(["id", "totalComments"]);
const isLoading = ref(true);
const cursorPag = ref(0);
const lengthPag = ref(10);
const comments = ref([]);

const newComment = (data) => comments.value.unshift(data);

async function fetchComments() {
  const { data, cursor } = await postClient.getComments(
    props.id,
    cursorPag.value,
    lengthPag.value
  );
  comments.value.unshift(...data);
  cursorPag.value = cursor;
}
onBeforeMount(async () => {
  await fetchComments();
  isLoading.value = false;
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-comments-layer">
    <div class="c-comments">
      <div class="u-flex-line-between">
        <div class="c-comments__title u-flex-line">
          <icon iconClass="c-icon" name="chat"/>
          <span>Comments <span class="c-comments__counter">{{ props.totalComments }}</span></span>
        </div>
        <button class="c-comments__close" @click="$emit('close')" type="button">
          <icon iconClass="c-icon" name="close"/>
        </button>
      </div>
      <create-comment @new-comment="newComment" :id="props.id"/>
      <template v-if="!isLoading">
        <div v-if="comments?.length > 0" class="c-comments__list">
          <template v-for="item in comments">
            <comment :date="item.createdAt" :text="item.text" :name="item.authorName" :avatar="item.authorAvatar"/>
          </template>
          <button v-if="cursorPag != 0" @click="fetchComments" class="sentinel-comment" type="button">Load more comments</button>
        </div>
        <div v-else class="c-comments__note">No comments have been made yet.</div>
      </template>
      <template v-else>
        <comment-placeholder/>
      </template>
    </div>
  </div>
</template>
<style>
.sentinel-comment {
  padding-bottom: 8px;
  font-size: 1.4rem;
  font-weight: 500;
}
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
