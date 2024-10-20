<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/Sograph.js";
import { Avatar, Icon } from "./";
import { useUserStore } from "../store/user.js";
import { pinCommentToIPFS } from "../infra/pinata.js";
const { writeContractAsync, data } = useWriteContract();
const props = defineProps(["id"]);
const emit = defineEmits(["new-comment"]);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const commentLength = ref(0);
const text = ref("");
const content = ref({
  text: "",
  createdAt: null,
});

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
  content.value.text = text.value;
  content.value.createdAt = new Date().toISOString();
  const metadata = await pinCommentToIPFS(content.value);
  if (metadata.success == false) return;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "comment",
    args: [props.id, metadata.data],
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    emit(
      "new-comment",
      Object.assign(
        {
          text: content.value.text,
          createdAt: content.value.createdAt,
        },
        {
          authorName: user.value.name,
          authorAvatar: user.value.avatar,
        }
      )
    );
    text.value = "";
    content.value.createdAt = null;
    content.value.text = "";
  }
});
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
      <icon iconClass="c-icon" name="send"/>
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
  border-bottom: 1px solid var(--color-border-primary);
  border-top: 1px solid var(--color-border-primary);
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
</style>
