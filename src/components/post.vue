<script setup>
import { computed, onMounted, ref } from "vue";
import Blockchain from "../infra/blockchain.js";
import { useUtils } from "../composables/utils.js";
import Avatar from "./avatar.vue";
import Comments from "./comments.vue";
const { dateFormat } = useUtils();
const {
  id,
  name,
  avatar,
  handle,
  attachment,
  text,
  owner,
  authorHasSubscription,
  date,
  like,
  shared,
  comment,
  hasLiked,
  hasShared,
  isConnected,
  isMyProfile,
  userRepost,
} = defineProps([
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
const isCommentActive = ref(false);
const post = ref({
  hasLiked: null,
  totalLiked: 0,
  hasShared: null,
  totalShared: 0,
  totalComment: 0,
});
const textPost = computed(() => {
  return String(text).split("\n");
});
async function redeemPost(_id) {
  const blockchain = new Blockchain();
  const result = await blockchain.redeemPost(_id);
}
async function handleShare(_id) {
  const blockchain = new Blockchain();
  if (post.value.hasShared == false) {
    const result = await blockchain.share(_id);
    if (result.success) {
      post.value.totalShared += 1;
      post.value.hasShared = true;
    }
  } else {
    const result = await blockchain.unshare(_id);
    if (result.success) {
      post.value.totalShared -= 1;
      post.value.hasShared = false;
    }
  }
}

async function handleLike(_id) {
  const blockchain = new Blockchain();
  const result = await blockchain.like(_id);
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
  post.value.hasLiked = hasLiked;
  post.value.totalLiked = Number(like);
  post.value.hasShared = hasShared;
  post.value.totalShared = Number(shared);
  post.value.totalComment = Number(comment);
});
</script>
<!-- prettier-ignore -->
<template>
  <article class="c-post">
    <div v-if="hasShared" class="c-post__reposted u-flex-line">
      <svg  class="c-post__icon" width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.83337 11C1.83337 5.93998 5.90337 1.83331 11 1.83331C17.1142 1.83331 20.1667 6.92998 20.1667 6.92998M20.1667 6.92998V2.34665M20.1667 6.92998H16.0967" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path opacity="0.4" d="M20.0658 11C20.0658 16.06 15.9592 20.1667 10.8992 20.1667C5.83917 20.1667 2.75 15.07 2.75 15.07M2.75 15.07H6.89333M2.75 15.07V19.6533" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>{{ userRepost }} reposted</span>
    </div>
    <div class="u-flex-line-between">
      <div class="c-post__info u-flex-line">
        <div class="c-post__author u-flex-line">
          <avatar :avatar="avatar" length="28px"/>
          <h3 class="c-post__author-name">{{ name }}</h3>
        </div>
        <span class="c-post__dot"></span>
        <time class="c-post__time" :datetime="date">{{ dateFormat(date) }}</time>
      </div>
      <button v-if="isMyProfile" class="post__dropdown">
        <svg  class="c-post__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z" stroke-width="1.5"/>
          <path d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" stroke-width="1.5"/>
          <path opacity="0.4" d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" stroke-width="1.5"/>
        </svg>
        <ul class="post__dropdown-menu">
          <li><button @click="redeemPost(id)">Redeem</button></li>
        </ul>
      </button>
    </div>
    <div v-if="attachment" class="c-post__attachment">
      <img class="c-post__image" :src="attachment" alt="" />
    </div>
    <p v-if="text.length" class="c-post__paragraph">
      <template v-for="item in textPost">
        <template v-if="item.length > 0">{{ item }}</template>
        <template v-else><br /></template>
      </template>
    </p>
    <div class="u-flex-line-between">
      <div class="c-post__actions u-flex-line">
        <template v-if="isConnected">
          <button class="c-post__action u-flex-line" @click="isCommentActive = true">
            <svg class="c-post__icon"  width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5833 8.24998C15.5833 11.7975 12.5033 14.6666 8.70825 14.6666L7.85576 15.6933L7.35159 16.2983C6.92076 16.8117 6.09575 16.7016 5.81158 16.0875L4.58325 13.3833C2.91492 12.21 1.83325 10.3491 1.83325 8.24998C1.83325 4.70248 4.91325 1.83331 8.70825 1.83331C11.4766 1.83331 13.8691 3.36415 14.9416 5.56415C15.3541 6.37999 15.5833 7.28748 15.5833 8.24998Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path opacity="0.4" d="M20.1668 11.7883C20.1668 13.8875 19.0851 15.7483 17.4168 16.9217L16.1885 19.6258C15.9043 20.24 15.0793 20.3592 14.6484 19.8367L13.2918 18.205C11.0734 18.205 9.09346 17.2241 7.85596 15.6933L8.70845 14.6666C12.5034 14.6666 15.5834 11.7975 15.5834 8.24997C15.5834 7.28747 15.3543 6.37998 14.9418 5.56415C17.9393 6.25165 20.1668 8.78163 20.1668 11.7883Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path opacity="0.4" d="M6.41675 8.25H11.0001" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="c-post__action-count">{{ post.totalComment }}</span>
          </button>
          <button class="c-post__action u-flex-line" @click="handleLike(id)">
            <svg class="c-post__icon" :class="{ 'c-post__icon--liked': post.hasLiked }" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.4" d="M19.86 8.09009C19.86 8.51009 19.83 8.92009 19.78 9.31009C19.32 9.11009 18.82 9.00009 18.29 9.00009C17.07 9.00009 15.99 9.59008 15.32 10.4901C14.64 9.59008 13.56 9.00009 12.34 9.00009C10.29 9.00009 8.63 10.6701 8.63 12.7401C8.63 15.4201 10.05 17.4701 11.63 18.8601C11.58 18.8901 11.53 18.9001 11.48 18.9201C11.18 19.0301 10.68 19.0301 10.38 18.9201C7.79 18.0301 2 14.3501 2 8.09009C2 5.33009 4.21999 3.1001 6.95999 3.1001C8.58999 3.1001 10.03 3.88009 10.93 5.09009C11.84 3.88009 13.28 3.1001 14.9 3.1001C17.64 3.1001 19.86 5.33009 19.86 8.09009Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M22 12.74C22 17.42 17.67 20.18 15.73 20.84C15.5 20.92 15.13 20.92 14.9 20.84C14.07 20.56 12.8 19.89 11.63 18.86C10.05 17.47 8.63 15.42 8.63 12.74C8.63 10.67 10.29 9 12.34 9C13.56 9 14.64 9.58999 15.32 10.49C15.99 9.58999 17.07 9 18.29 9C18.82 9 19.32 9.11 19.78 9.31C21.09 9.89 22 11.2 22 12.74Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="c-post__action-count">{{ post.totalLiked }}</span>
          </button>
          <button class="c-post__action u-flex-line" @click="handleShare(id)">
            <svg class="c-post__icon" :class="{ 'c-post__icon--shared': post.hasShared && isMyProfile }" width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.83337 11C1.83337 5.93998 5.90337 1.83331 11 1.83331C17.1142 1.83331 20.1667 6.92998 20.1667 6.92998M20.1667 6.92998V2.34665M20.1667 6.92998H16.0967" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path opacity="0.4" d="M20.0658 11C20.0658 16.06 15.9592 20.1667 10.8992 20.1667C5.83917 20.1667 2.75 15.07 2.75 15.07M2.75 15.07H6.89333M2.75 15.07V19.6533" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="c-post__action-count">{{ post.totalShared }}</span>
          </button>
        </template>
        <template v-else>
          <button class="c-post__action u-flex-line">
            <svg class="c-post__icon"  width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5833 8.24998C15.5833 11.7975 12.5033 14.6666 8.70825 14.6666L7.85576 15.6933L7.35159 16.2983C6.92076 16.8117 6.09575 16.7016 5.81158 16.0875L4.58325 13.3833C2.91492 12.21 1.83325 10.3491 1.83325 8.24998C1.83325 4.70248 4.91325 1.83331 8.70825 1.83331C11.4766 1.83331 13.8691 3.36415 14.9416 5.56415C15.3541 6.37999 15.5833 7.28748 15.5833 8.24998Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path opacity="0.4" d="M20.1668 11.7883C20.1668 13.8875 19.0851 15.7483 17.4168 16.9217L16.1885 19.6258C15.9043 20.24 15.0793 20.3592 14.6484 19.8367L13.2918 18.205C11.0734 18.205 9.09346 17.2241 7.85596 15.6933L8.70845 14.6666C12.5034 14.6666 15.5834 11.7975 15.5834 8.24997C15.5834 7.28747 15.3543 6.37998 14.9418 5.56415C17.9393 6.25165 20.1668 8.78163 20.1668 11.7883Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path opacity="0.4" d="M6.41675 8.25H11.0001" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="c-post__action-count">{{ post.totalComment }}</span>
          </button>
          <button class="c-post__action u-flex-line">
            <svg class="c-post__icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.4" d="M19.86 8.09009C19.86 8.51009 19.83 8.92009 19.78 9.31009C19.32 9.11009 18.82 9.00009 18.29 9.00009C17.07 9.00009 15.99 9.59008 15.32 10.4901C14.64 9.59008 13.56 9.00009 12.34 9.00009C10.29 9.00009 8.63 10.6701 8.63 12.7401C8.63 15.4201 10.05 17.4701 11.63 18.8601C11.58 18.8901 11.53 18.9001 11.48 18.9201C11.18 19.0301 10.68 19.0301 10.38 18.9201C7.79 18.0301 2 14.3501 2 8.09009C2 5.33009 4.21999 3.1001 6.95999 3.1001C8.58999 3.1001 10.03 3.88009 10.93 5.09009C11.84 3.88009 13.28 3.1001 14.9 3.1001C17.64 3.1001 19.86 5.33009 19.86 8.09009Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M22 12.74C22 17.42 17.67 20.18 15.73 20.84C15.5 20.92 15.13 20.92 14.9 20.84C14.07 20.56 12.8 19.89 11.63 18.86C10.05 17.47 8.63 15.42 8.63 12.74C8.63 10.67 10.29 9 12.34 9C13.56 9 14.64 9.58999 15.32 10.49C15.99 9.58999 17.07 9 18.29 9C18.82 9 19.32 9.11 19.78 9.31C21.09 9.89 22 11.2 22 12.74Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="c-post__action-count">{{ post.totalLiked }}</span>
          </button>
          <button class="c-post__action u-flex-line">
            <svg  class="c-post__icon" width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.83337 11C1.83337 5.93998 5.90337 1.83331 11 1.83331C17.1142 1.83331 20.1667 6.92998 20.1667 6.92998M20.1667 6.92998V2.34665M20.1667 6.92998H16.0967" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path opacity="0.4" d="M20.0658 11C20.0658 16.06 15.9592 20.1667 10.8992 20.1667C5.83917 20.1667 2.75 15.07 2.75 15.07M2.75 15.07H6.89333M2.75 15.07V19.6533" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="c-post__action-count">{{ post.totalShared }}</span>
          </button>
        </template>
      </div>
      <span class="c-post__id">#{{ id }}</span>
    </div>
    <Comments v-if="isCommentActive" @close="isCommentActive = false" :id="id" counter="0"/>
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
.c-post__reposted .c-post__icon {
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
.light-mode .c-post__icon {
  stroke: var(--color-icon-primary);
}
.c-post__icon--liked {
  fill: var(--color-red) !important;
  stroke: var(--color-red) !important;
}
.c-post__icon--shared {
  stroke: var(--color-green) !important;
}
</style>
