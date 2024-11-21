<script setup>
import { useUtils } from "../composables/utils.js";
import { useAccountStore } from "../store/account.js";
import { useFavoriteStore } from "../store/favorite.js";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../store/user.js";
import { storeToRefs } from "pinia";
import {
  Avatar,
  Back,
  ButtonFollow,
  Sidebar,
  CreatePost,
  Post,
  PostPlaceholder,
  ProfileNav,
  ProfileAbout,
  Followers,
  Following,
  Icon,
  ProfilePlaceholder,
} from "../components";
import { useProfile } from "../composables/useProfile.js";
import { usePublication } from "../composables/usePublication.js";
const { getProfile: getProfile2 } = useProfile();
const { getPublication } = usePublication();
const userStore = useUserStore();
const favoriteStore = useFavoriteStore();
const { user } = storeToRefs(userStore);
const route = useRoute();
const profile = ref(null);
const navActive = ref("Publications");
const publications = ref([]);
const isLoadingPost = ref(true);
const isLoadingPostScroll = ref(false);
const isLoadingProfile = ref(true);
const accountStore = useAccountStore();
const { account } = storeToRefs(accountStore);
const { isAddress, truncateAddress, hashtagDecorator, makerLink } = useUtils();
const isFavorite = ref(false);
const observer = ref(null);
const cursorPag = ref(0);
const lengthPag = ref(15);
const profileErrorInfo = ref({ isBanned: null, username: "" });

function toggleFavorite() {
  if (isFavorite.value == false) {
    favoriteStore.setFavorite({
      id: profile.value.id,
      avatar: profile.value.avatar,
      name: profile.value.name,
      path: profile.value.handle || profile.value.owner,
    });
    isFavorite.value = true;
  } else {
    favoriteStore.removeFavorite(profile.value.id);
    isFavorite.value = false;
  }
}

const username = computed(() => {
  return !!profile.value.handle ? profile.value.handle : profile.value.owner;
});

const isMyProfile = computed(() => {
  return (
    String(user.value?.owner).toLocaleLowerCase() ==
    String(profile.value?.owner).toLocaleLowerCase()
  );
});

function profileNavActive(nav) {
  navActive.value = nav;
}

async function fetchPost(cursorParams) {
  isLoadingPostScroll.value = true;
  const { data, cursor } = await getPublication(
    profile.value.owner,
    cursorParams,
    lengthPag.value
  );
  cursorPag.value = cursor;
  publications.value.push(...data);
  isLoadingPostScroll.value = false;
  if (cursor == 0) {
    observer.value?.disconnect();
    return;
  }
}

async function getProfile() {
  let routeParam;
  if (route.params.profile.startsWith("@")) {
    routeParam = route.params.profile.replace("@", "");
  } else {
    routeParam = route.params.profile;
  }

  const result = await getProfile2(routeParam);
  isLoadingProfile.value = false;
  publications.value = [];
  if (result.success) {
    profile.value = result.data;
    cursorPag.value = result.data.postLength;
    result.data.isFollowing;
    isFavorite.value = favoriteStore.isFavorite(result.data.id);
    await fetchPost(cursorPag.value);
    isLoadingPost.value = false;
  } else {
    profile.value = null;
    publications.value = [];
    profileErrorInfo.value.type = result.message;
    profileErrorInfo.value.username = routeParam;
  }
}

watch(
  () => route.params.profile,
  async (_) => {
    await getProfile();
  }
);
onBeforeMount(async () => {
  await getProfile();
  if (cursorPag.value != 0) {
    observer.value = new IntersectionObserver(async (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        const cursor = await fetchPost(cursorPag.value);
        if (cursor == 0) observer.value.disconnect();
      }
    });
    observer.value.observe(document.getElementById("sentinel"));
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
      <template v-if="profile">
        <template v-if="account.hasAccount">
          <button-follow v-if="!isMyProfile" :isFollowing="profile?.isFollowing" :name="profile?.name" :profile="profile.owner"/>
        </template>
        <button v-else class="profile__button u-font-500" disabled>Follow {{ profile.name }}</button>
      </template>
    </div>
    <template v-if="!isLoadingProfile">
      <template v-if="profile">
        <div class="profile__header">
          <avatar :avatar="profile.avatar" length="180px"/>
          <div>
            <div class="profile__name-wrap u-flex-line">
              <h1 class="profile__name">{{ profile.name }}</h1>
              <icon v-if="profile.hasSubscription" iconClass="c-icon" name="verify"/>
              <svg v-if="!isMyProfile && account.hasAccount" @click="toggleFavorite" :class="{'is-active': isFavorite}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.7299 3.51014L15.4899 7.03014C15.7299 7.52014 16.3699 7.99014 16.9099 8.08014L20.0999 8.61014C22.1399 8.95014 22.6199 10.4301 21.1499 11.8901L18.6699 14.3701C18.2499 14.7901 18.0199 15.6001 18.1499 16.1801L18.8599 19.2501C19.4199 21.6801 18.1299 22.6201 15.9799 21.3501L12.9899 19.5801C12.4499 19.2601 11.5599 19.2601 11.0099 19.5801L8.01991 21.3501C5.87991 22.6201 4.57991 21.6701 5.13991 19.2501L5.84991 16.1801C5.97991 15.6001 5.74991 14.7901 5.32991 14.3701L2.84991 11.8901C1.38991 10.4301 1.85991 8.95014 3.89991 8.61014L7.08991 8.08014C7.61991 7.99014 8.25991 7.52014 8.49991 7.03014L10.2599 3.51014C11.2199 1.60014 12.7799 1.60014 13.7299 3.51014Z" stroke="#0177FB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <strong class="profile__address u-font-500">{{ isAddress(username) ? truncateAddress(username) : `@${username}` }}</strong>
            <p class="profile__infos u-flex-line-center">
              <span>{{ profile.followers }} <span class="u-text-secondary">{{ profile.followers == 1 ? 'follower' : 'followers' }}</span></span>
              <span>{{ profile.following }} <span class="u-text-secondary">{{ profile.following == 1 ? 'following' : 'followings' }}</span></span>
              <span>{{ profile.postLength }} <span class="u-text-secondary">{{ profile.postLength == 1 ? 'post' : 'posts' }}</span></span>
            </p>
            <p class="profile__description" v-html="makerLink(hashtagDecorator(profile.description))"></p>
          </div>
        </div>
        <profile-nav :address="profile.owner" :links="profile.links" @profile-nav="profileNavActive"/>
        <div v-if="profile.role == 2" class="profile__info u-flex-line-center">
          <icon iconClass="c-icon" name="info1"/>
          Profile under evaluation. Check the <a class="profile__info-link u-font-500" href="https://vote.sograph.app/#/">voting</a> page to learn more.
        </div>
        <template v-if="navActive == 'Publications'">
          <template v-if="!isLoadingPost">
            <section v-if="publications.length > 0" class="l-post">
              <template v-for="item of publications">
                <post
                  :userRepost="profile.name"
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
                  :hasLiked="item.hasLiked"
                  :hasShared="item.hasShared"
                  :isConnected="account.isConnected"
                  :isMyProfile="isMyProfile"
                />
              </template>
              <div class="sentinel" id="sentinel">
                <post-placeholder v-if="isLoadingPostScroll"/>
              </div>
            </section>
            <section v-else style="text-align: center; margin-top: 80px">
              No publications have been made yet.
            </section>
          </template>
          <template v-else>
            <section class="l-post">
              <post-placeholder />
            </section>
          </template>
        </template>
        <template v-else-if="navActive == 'Followers'">
          <followers :id="profile.id" :length="profile.followers" :isConnected="account.isConnected"/>
        </template>
        <template v-else-if="navActive == 'Following'">
          <following :id="profile.id" :length="profile.following" :isConnected="account.isConnected"/>
        </template>
        <template v-else-if="navActive == 'About'">
          <profile-about :profile="profile"/>
        </template>
      </template>
      <div v-else>
        <profile-placeholder :type="profileErrorInfo.type" :username="profileErrorInfo.username"/>
      </div>
    </template>
  </main>
</template>
<style>
.profile__info {
  height: 56px;
  width: 100%;
  background-color: var(--bg-color-secondary);
  font-size: 1.5rem;
  border-radius: 12px;
  margin-top: 40px;
}
.profile__info > svg {
  color: var(--color-yellow) !important;
  margin-right: 8px;
}
.profile__info-link {
  padding-inline: 5px;
  text-decoration: underline;
  height: 100%;
  line-height: 56px;
}
.profile__header {
  display: flex;
  padding: 55px 40px 55px 0;
  gap: 40px;
}
.profile__avatar {
  height: 180px;
  width: 180px;
  border-radius: 180px;
  object-fit: cover;
}
.profile__name-wrap {
  gap: 9px;
}
.profile__name-wrap svg {
  margin-top: 4px;
  cursor: pointer;
}
.profile__name-wrap svg.is-active {
  fill: var(--color-blue);
}
.profile__name {
  font-size: 4rem;
  font-weight: 600;
  line-height: 5.4rem;
}
.profile__address {
  font-size: 1.4rem;
  color: var(--text-color-secondary);
  margin-top: 4px;
}
.profile__infos,
.profile__description {
  margin-top: 11px;
  width: 100%;
  max-width: 650px;
}
.profile__infos {
  gap: 12px;
}
.profile__button {
  height: 48px;
  border-radius: 12px;
  background-color: var(--bg-color-tertiary);
  font-size: 1.5rem;
  padding-inline: 24px;
}
</style>
