<script setup>
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useAccountStore } from "../store/account.js";
import { useUserStore } from "../store/user.js";
import {
  CreatePost,
  Post,
  PostPlaceholder,
  Sidebar,
  Back,
} from "../components";
import { usePublicationFollowing } from "../composables/usePublicationFollowingV2.js";
const { getPublicationFollowing } = usePublicationFollowing();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const accountStore = useAccountStore();
const { account } = storeToRefs(accountStore);
const publications = ref([]);
const isLoadingPost = ref(true);
const isLoadingPostScroll = ref(false);
const hasContentFetch = ref(true);
const observer = ref(null);
const cursorFollow = ref(0);

async function fetchPost() {
  isLoadingPostScroll.value = true;
  const { data, success, hasContent, newCursor } =
    await getPublicationFollowing(user.value.id, cursorFollow.value);
  cursorFollow.value = newCursor;
  if (success) {
    publications.value.push(...data);
    hasContentFetch.value = hasContent;
    if (!hasContent) {
      observer.value?.disconnect();
    }
  } else {
    observer.value?.disconnect();
  }
  isLoadingPostScroll.value = false;
  isLoadingPost.value = false;
}

onBeforeMount(async () => {
  cursorFollow.value = user.value.following;
  await fetchPost();
  if (hasContentFetch.value) {
    observer.value = new IntersectionObserver(async (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        const cursor = await fetchPost();
        if (cursor == 0) observer.value.disconnect();
      }
    });
    observer.value.observe(document.getElementById("sentinel-feed"));
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <create-post v-if="account.hasAccount"/>
  <sidebar/>
  <main class="main">
    <div class="l-header">
      <back/>
    </div>
    <template v-if="!isLoadingPost">
      <section v-if="publications.length > 0" class="l-post">
        <template v-for="item of publications">
          <post
            :userRepost="item.userRepostName"
            :userRepostPath="item.userRepostPath"
            :id="item.id"
            :name="item.authorName"
            :avatar="item.authorAvatar"
            :attachment="item.attachment"
            :handle="item.authorHandle"
            :text="item.text"
            :owner="item.owner"
            :authorHasSubscription="item.authorHasSubscription"
            :date="item.createdAt"
            :like="item.totalLike"
            :shared="item.totalShared"
            :comment="item.totalComments"
            :hasLiked="account.isConnected ? item.hasLiked : false"
            :hasShared="account.isConnected ? item.hasShared : false"
            :isConnected="account.isConnected"
            :isMyProfile="false"
          />
        </template>
        <div class="sentinel-feed" id="sentinel-feed">
          <post-placeholder v-if="isLoadingPostScroll"/>
        </div>
      </section>
      <div v-else style="text-align: center; margin-top: 80px">
        You don't have any publications in your feed yet.
      </div>
    </template>
    <section v-else class="l-post">
      <post-placeholder />
    </section>
  </main>
</template>
<style scoped>
.l-post {
  padding-top: 32px !important;
}
</style>
