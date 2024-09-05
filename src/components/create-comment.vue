<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import Avatar from "./avatar.vue";
import { useUserStore } from "../store/user.js";
import Post from "../infra/post.js";
import { pinCommentToIPFS } from "../infra/pinata.js";
const props = defineProps(["id"]);
const emit = defineEmits(["new-comment"]);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const commentLength = ref(0);
const text = ref("");

function showPlaceholder(event) {
  commentLength.value = event.target.innerText.length;
  if (event.target.innerText.length > 0) {
    text.value = event.target.innerText;
    event.target.parentNode
      .querySelector(".c-create-comment__textarea-placeholder")
      .classList.add("is-hidden");
  } else {
    text.value = "";
    event.target.parentNode
      .querySelector(".c-create-comment__textarea-placeholder")
      .classList.remove("is-hidden");
  }
}

async function create() {
  if (text.value.length == 0) return;
  const data = {
    text: text.value,
    createdAt: new Date().toISOString(),
  };
  const metadata = await pinCommentToIPFS(data);
  if (metadata.success == false) return;
  const post = new Post();
  const { success } = await post.comment(props.id, metadata.data);
  if (success) {
    emit(
      "new-comment",
      Object.assign(data, {
        authorName: user.value.name,
        authorAvatar: user.value.avatar,
      })
    );
  }
}
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-create-comment">
    <avatar length="32px" :avatar="user.avatar"/>
    <div class="c-create-comment__textarea">
      <span class="c-create-comment__textarea-placeholder">Write a comment</span>
      <div @keyup="showPlaceholder" class="c-create-comment__textarea-input" contenteditable="true"></div>
    </div>
    <span class="c-create-comment__counter u-flex-line">{{ commentLength }}/400</span>
    <button class="c-create-comment__send u-flex-line" @click="create">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.51002 4.23013L18.07 8.51013C21.91 10.4301 21.91 13.5701 18.07 15.4901L9.51002 19.7701C3.75002 22.6501 1.40002 20.2901 4.28002 14.5401L5.15002 12.8101C5.40002 12.3001 5.40002 11.7101 5.15002 11.2001L4.28002 9.46013C1.40002 3.71013 3.76002 1.35013 9.51002 4.23013Z"/>
        <path d="M14.8399 12.75H9.43994C9.02994 12.75 8.68994 12.41 8.68994 12C8.68994 11.59 9.02994 11.25 9.43994 11.25H14.8399C15.2499 11.25 15.5899 11.59 15.5899 12C15.5899 12.41 15.2499 12.75 14.8399 12.75Z" fill="#F4F4F4"/>
      </svg>
    </button>
  </div>
</template>
<style>
:root {
  --textarea-min-height: 32px;
}
.c-create-comment {
  gap: 10px;
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid rgba(244, 244, 244, 0.3);
  border-top: 1px solid rgba(244, 244, 244, 0.3);
  padding-top: 24px;
  padding-bottom: 24px;
}
.c-create-comment__counter {
  height: 32px;
  font-size: 1.4rem;
  color: var(--text-color-secondary);
}
.c-create-comment__textarea {
  position: relative;
  flex-grow: 1;
  margin-left: 6px;
}
.c-create-comment__textarea-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 2;
  min-height: var(--textarea-min-height);
  line-height: var(--textarea-min-height);
  color: var(--text-color-secondary);
}
.c-create-comment__textarea-input {
  min-height: var(--textarea-min-height);
  max-height: 120px;
  position: relative;
  z-index: 3;
  outline: none;
  word-break: break-all;
  overflow-y: auto;
  color: var(--text-color-primary);
  font-size: 1.6rem;
  padding-top: 4px;
}
.c-create-comment__textarea-input::-webkit-scrollbar-track {
  background: transparent;
}
.c-create-comment__textarea-input::-webkit-scrollbar-thumb {
  background-color: var(--bg-color-tertiary);
  border-radius: 10px;
}
.c-create-comment__textarea-input::-webkit-scrollbar {
  width: 6px;
}
.c-create-comment__send {
  padding: 4px 0 4px 4px;
}
.c-create-comment__send svg {
  fill: var(--bg-color-tertiary);
}
.c-create-comment__send.is-active svg {
  fill: var(--color-blue);
}
.c-create-comment__send svg {
  height: 2.4rem;
  width: 2.4rem;
}
</style>
