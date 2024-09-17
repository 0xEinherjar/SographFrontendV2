<script setup>
import { computed, inject, onMounted, ref } from "vue";
import { useUtils } from "../composables/utils.js";
import { Avatar, Comments, Icon } from "./";
const { dateFormat } = useUtils();
const props = defineProps([
  "id",
  "name",
  "avatar",
  "attachment",
  "handle",
  "text",
  "owner",
  "authorHasSubscription",
  "date",
  "like",
  "shared",
  "comment",
  "hasLiked",
  "hasShared",
  "isConnected",
  "isMyProfile",
  "userRepost",
]);
const blockchainClient = inject("blockchainClient");

const isCommentActive = ref(false);
const post = ref({
  hasLiked: null,
  totalLiked: 0,
  hasShared: null,
  totalShared: 0,
  totalComment: 0,
});
const textPost = computed(() => {
  return String(props.text).split("\n");
});
async function redeemPost(_id) {
  const result = await blockchainClient.redeemPost(_id);
}
async function handleShare(_id) {
  if (post.value.hasShared == false) {
    const result = await blockchainClient.share(_id);
    if (result.success) {
      post.value.totalShared += 1;
      post.value.hasShared = true;
    }
  } else {
    const result = await blockchainClient.unshare(_id);
    if (result.success) {
      post.value.totalShared -= 1;
      post.value.hasShared = false;
    }
  }
}

async function handleLike(_id) {
  const result = await blockchainClient.like(_id);
  if (result.success) {
    if (post.value.hasLiked == false) {
      post.value.totalLiked += 1;
      post.value.hasLiked = true;
    } else {
      post.value.totalLiked -= 1;
      post.value.hasLiked = false;
    }
  }
}
onMounted(() => {
  post.value.hasLiked = props.hasLiked;
  post.value.totalLiked = Number(props.like);
  post.value.hasShared = props.hasShared;
  post.value.totalShared = Number(props.shared);
  post.value.totalComment = Number(props.comment);
});
</script>
<!-- prettier-ignore -->
<template>
  <article class="c-post">
    <div v-if="props.hasShared" class="c-post__reposted u-flex-line">
      <icon iconClass="c-icon--small" name="share"/>
      <span>{{ props.userRepost }} reposted</span>
    </div>
    <div class="u-flex-line-between">
      <div class="c-post__info u-flex-line">
        <div class="c-post__author u-flex-line">
          <avatar :avatar="props.avatar" length="28px"/>
          <h3 class="c-post__author-name">{{ props.name }}</h3>
        </div>
        <span class="c-post__dot"></span>
        <time class="c-post__time" :datetime="props.date">{{ dateFormat(props.date) }}</time>
      </div>
      <button v-if="props.isMyProfile" class="post__dropdown">
        <icon iconClass="c-icon--small" name="more"/>
        <ul class="post__dropdown-menu">
          <li><button @click="redeemPost(props.id)">Redeem</button></li>
        </ul>
      </button>
    </div>
    <div v-if="props.attachment" class="c-post__attachment">
      <img class="c-post__image" :src="props.attachment" alt="" />
    </div>
    <p v-if="props.text.length" class="c-post__paragraph">
      <template v-for="item in textPost">
        <template v-if="item.length > 0">{{ item }}</template>
        <template v-else><br /></template>
      </template>
    </p>
    <div class="u-flex-line-between">
      <div class="c-post__actions u-flex-line">
        <template v-if="props.isConnected">
          <button class="c-post__action u-flex-line" @click="isCommentActive = true">
            <icon iconClass="c-icon--small" name="chat"/>
            <span class="c-post__action-count">{{ post.totalComment }}</span>
          </button>
          <button class="c-post__action u-flex-line" @click="handleLike(props.id)">
            <icon :iconClass="{'c-icon--small': true, 'c-icon--fill-none': true, 'is-liked': post.hasLiked }" name="like"/>
            <span class="c-post__action-count">{{ post.totalLiked }}</span>
          </button>
          <button class="c-post__action u-flex-line" @click="handleShare(props.id)">
            <icon :iconClass="{'c-icon--small': true, 'is-shared': post.hasShared && props.isMyProfile }" name="share"/>
            <span class="c-post__action-count">{{ post.totalShared }}</span>
          </button>
        </template>
        <template v-else>
          <button class="c-post__action u-flex-line">
            <icon iconClass="c-icon--small" name="chat"/>
            <span class="c-post__action-count">{{ post.totalComment }}</span>
          </button>
          <button class="c-post__action u-flex-line">
            <icon iconClass="c-icon--small" name="like"/>
            <span class="c-post__action-count">{{ post.totalLiked }}</span>
          </button>
          <button class="c-post__action u-flex-line">
            <icon iconClass="c-icon--small" name="share"/>
            <span class="c-post__action-count">{{ post.totalShared }}</span>
          </button>
        </template>
      </div>
      <span class="c-post__id">#{{ props.id }}</span>
    </div>
    <Comments v-if="isCommentActive" @close="isCommentActive = false" :id="props.id" :totalComments="post.totalComment"/>
  </article>
</template>

<style>
.c-post {
  width: min(500px, 100%);
  margin-inline: auto;
  display: grid;
  gap: 18px;
}
.c-post__id {
  font-weight: 500;
  font-size: 1.5rem;
}
.c-post__reposted {
  gap: 12px;
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(244, 244, 244, 0.4);
}
.c-post__reposted .c-icon--small {
  height: 1.6rem !important;
  width: 1.6rem !important;
}
.post__dropdown {
  position: relative;
}
.post__dropdown-menu {
  display: none;
  position: absolute;
  top: 98%;
  right: 0;
  background-color: var(--bg-color-secondary);
  padding: 10px 20px;
  border-radius: 8px;
  width: 180px;
  color: var(--text-color-secondary);
  font-size: 1.4rem;
  text-align: left;
  z-index: 2;
}
.post__dropdown:hover .post__dropdown-menu {
  display: block;
}
.c-post__attachment {
  width: 100%;
  aspect-ratio: 456/400;
  overflow: hidden;
  border-radius: 20px;
}
.c-post__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.c-post__title {
  font-size: 2.8rem;
  font-weight: 500;
  line-height: 135%;
}
.c-post__paragraph {
  opacity: 0.8;
}
.c-post__author-name {
  font-size: 1.5rem;
  font-weight: 500;
  margin-left: 16px;
}
.c-post__dot {
  height: 2px;
  width: 2px;
  border-radius: 50%;
  background-color: var(--bg-color-quaternary);
  opacity: 0.7;
}
.c-post__info {
  gap: 8px;
}
.c-post__time {
  font-size: 1.5rem;
  color: var(--text-color-tertiary);
}
.c-post__actions {
  gap: 48px;
}
.c-post__action {
  gap: 8px;
}
.c-post__action-count {
  color: var(--text-color-tertiary);
  font-size: 1.5rem;
}
.c-post__icon {
  fill: none;
  stroke: #f4f4f4;
  height: 2rem;
  width: 2rem;
}
.is-liked {
  color: var(--color-red) !important;
  fill: var(--color-red) !important;
}
.is-shared {
  stroke: var(--color-green) !important;
}
</style>
