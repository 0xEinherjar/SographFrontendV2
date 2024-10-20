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
import { usePublicationFollowing } from "../composables/usePublicationFollowing.js";
const { getPublicationFollowing } = usePublicationFollowing();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const accountStore = useAccountStore();
const { account } = storeToRefs(accountStore);
const publications = ref([]);
const isLoadingPost = ref(true);

onBeforeMount(async () => {
  const { success, data } = await getPublicationFollowing(user.value.id);
  if (success) {
    publications.value = data;
  }
  isLoadingPost.value = false;
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
            :userRepost="user.name"
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
