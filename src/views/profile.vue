<script setup>
import Back from "../components/back.vue";
// import ProfileHeader from "../components/profile/header.vue";
import Sidebar from "../components/sidebar.vue";
import Avatar from "../components/avatar.vue";
import CreatePost from "../components/create-post.vue";
import Post from "../components/post.vue";
import PostPlaceholder from "../components/post-placeholder.vue";
import ProfileNav from "../components/profile/nav.vue";
import Followers from "../components/profile/followers.vue";
import Following from "../components/profile/following.vue";
import ProfileAbout from "../components/profile/about.vue";
import { useUtils } from "../composables/utils.js";
import { useAccountStore } from "../store/account.js";
import { useFavoriteStore } from "../store/favorite.js";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import Blockchain from "../infra/blockchain.js";
import { useUserStore } from "../store/user.js";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const favoriteStore = useFavoriteStore();
const { user } = storeToRefs(userStore);
const route = useRoute();
const profile = ref(null);
const navActive = ref("Publications");
const profileErrorInfo = ref("");
const publications = ref([]);
const isLoadingPost = ref(true);
const isLoadingProfile = ref(true);
const accountStore = useAccountStore();
const { account } = storeToRefs(accountStore);
const { isAddress, truncateAddress, hashtagDecorator } = useUtils();
const isFavorite = ref(false);

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

async function handleFollow(address) {
  const blockchain = new Blockchain();
  const result = await blockchain.follow(address);
  if (result.success) {
    profile.value.isFollowing = true;
    profile.value.followers += 1;
  }
}

async function handleUnfollow(address) {
  const blockchain = new Blockchain();
  const result = await blockchain.unfollow(address);
  if (result.success) {
    profile.value.isFollowing = false;
    profile.value.followers -= 1;
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

async function getProfile() {
  const blockchain = new Blockchain();
  const result = await blockchain.getProfile(route.params.profile);
  isLoadingProfile.value = false;
  publications.value = [];
  if (result.success) {
    profile.value = result.data;
    result.data.isFollowing;
    const { data, cursor } = await blockchain.getPost(
      profile.value.owner,
      0,
      20
    );
    publications.value = data;
    isLoadingPost.value = false;
  } else {
    profile.value = null;
    publications.value = [];
    if (result.message == "BANNED") {
      profileErrorInfo.value = "Profile banned";
      return;
    }
    profileErrorInfo.value = "Profile not found";
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
  if (profile.value) {
    isFavorite.value = favoriteStore.isFavorite(profile.value.id);
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
          <button v-if="!isMyProfile && !profile?.isFollowing == true" class="profile__button" @click="handleFollow(profile.owner)">
            Follow {{ profile?.name }}
          </button>
          <button v-if="!isMyProfile && profile?.isFollowing == true" class="profile__button" @click="handleUnfollow(profile.owner)">
            Following
          </button>
        </template>
        <button v-else class="profile__button" disabled>Follow {{ profile.name }}</button>
      </template>
    </div>
    <template v-if="!isLoadingProfile">
      <template v-if="profile">
        <div class="profile__header">
          <avatar :avatar="profile.avatar" length="180px"/>
          <div>
            <div class="profile__name-wrap">
              <h1 class="profile__name">{{ profile.name }}</h1>
              <svg v-if="profile.hasSubscription" class="profile__badge" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.7499 2.45007C11.4399 1.86007 12.5699 1.86007 13.2699 2.45007L14.8499 3.81007C15.1499 4.07007 15.7099 4.28007 16.1099 4.28007H17.8099C18.8699 4.28007 19.7399 5.15007 19.7399 6.21007V7.91007C19.7399 8.30007 19.9499 8.87007 20.2099 9.17007L21.5699 10.7501C22.1599 11.4401 22.1599 12.5701 21.5699 13.2701L20.2099 14.8501C19.9499 15.1501 19.7399 15.7101 19.7399 16.1101V17.8101C19.7399 18.8701 18.8699 19.7401 17.8099 19.7401H16.1099C15.7199 19.7401 15.1499 19.9501 14.8499 20.2101L13.2699 21.5701C12.5799 22.1601 11.4499 22.1601 10.7499 21.5701L9.16988 20.2101C8.86988 19.9501 8.30988 19.7401 7.90988 19.7401H6.17988C5.11988 19.7401 4.24988 18.8701 4.24988 17.8101V16.1001C4.24988 15.7101 4.03988 15.1501 3.78988 14.8501L2.43988 13.2601C1.85988 12.5701 1.85988 11.4501 2.43988 10.7601L3.78988 9.17007C4.03988 8.87007 4.24988 8.31007 4.24988 7.92007V6.20007C4.24988 5.14007 5.11988 4.27007 6.17988 4.27007H7.90988C8.29988 4.27007 8.86988 4.06007 9.16988 3.80007L10.7499 2.45007Z" fill="#6B6BFF"/>
                <path d="M10.7499 2.45007C11.4399 1.86007 12.5699 1.86007 13.2699 2.45007L14.8499 3.81007C15.1499 4.07007 15.7099 4.28007 16.1099 4.28007H17.8099C18.8699 4.28007 19.7399 5.15007 19.7399 6.21007V7.91007C19.7399 8.30007 19.9499 8.87007 20.2099 9.17007L21.5699 10.7501C22.1599 11.4401 22.1599 12.5701 21.5699 13.2701L20.2099 14.8501C19.9499 15.1501 19.7399 15.7101 19.7399 16.1101V17.8101C19.7399 18.8701 18.8699 19.7401 17.8099 19.7401H16.1099C15.7199 19.7401 15.1499 19.9501 14.8499 20.2101L13.2699 21.5701C12.5799 22.1601 11.4499 22.1601 10.7499 21.5701L9.16988 20.2101C8.86988 19.9501 8.30988 19.7401 7.90988 19.7401H6.17988C5.11988 19.7401 4.24988 18.8701 4.24988 17.8101V16.1001C4.24988 15.7101 4.03988 15.1501 3.78988 14.8501L2.43988 13.2601C1.85988 12.5701 1.85988 11.4501 2.43988 10.7601L3.78988 9.17007C4.03988 8.87007 4.24988 8.31007 4.24988 7.92007V6.20007C4.24988 5.14007 5.11988 4.27007 6.17988 4.27007H7.90988C8.29988 4.27007 8.86988 4.06007 9.16988 3.80007L10.7499 2.45007Z" fill="#6B6BFF"/>
                <path d="M10.7901 15.17C10.5901 15.17 10.4001 15.09 10.2601 14.95L7.84006 12.53C7.55006 12.24 7.55006 11.76 7.84006 11.47C8.13006 11.18 8.61006 11.18 8.90006 11.47L10.7901 13.36L15.0901 9.06003C15.3801 8.77003 15.8601 8.77003 16.1501 9.06003C16.4401 9.35003 16.4401 9.83003 16.1501 10.12L11.3201 14.95C11.1801 15.09 10.9901 15.17 10.7901 15.17Z" fill="#C5CEDD"/>
              </svg>
              <svg v-if="account.hasAccount" @click="toggleFavorite" :class="{'is-active': isFavorite}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.7299 3.51014L15.4899 7.03014C15.7299 7.52014 16.3699 7.99014 16.9099 8.08014L20.0999 8.61014C22.1399 8.95014 22.6199 10.4301 21.1499 11.8901L18.6699 14.3701C18.2499 14.7901 18.0199 15.6001 18.1499 16.1801L18.8599 19.2501C19.4199 21.6801 18.1299 22.6201 15.9799 21.3501L12.9899 19.5801C12.4499 19.2601 11.5599 19.2601 11.0099 19.5801L8.01991 21.3501C5.87991 22.6201 4.57991 21.6701 5.13991 19.2501L5.84991 16.1801C5.97991 15.6001 5.74991 14.7901 5.32991 14.3701L2.84991 11.8901C1.38991 10.4301 1.85991 8.95014 3.89991 8.61014L7.08991 8.08014C7.61991 7.99014 8.25991 7.52014 8.49991 7.03014L10.2599 3.51014C11.2199 1.60014 12.7799 1.60014 13.7299 3.51014Z" stroke="#0177FB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <strong class="profile__address">{{ isAddress(username) ? truncateAddress(username) : `@${username}` }}</strong>
            <p class="profile__description" v-html="hashtagDecorator(profile.description)"></p>
          </div>
        </div>
        <profile-nav :address="profile.owner" :links="profile.links" @profile-nav="profileNavActive"/>
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
                  :hasLiked="account.isConnected ? item.hasLiked : false"
                  :hasShared="account.isConnected ? item.hasShared : false"
                  :isConnected="account.isConnected"
                  :isMyProfile="isMyProfile"
                />
              </template>
            </section>
            <section v-else style="text-align: center; margin-top: 80px">
              No has publications
            </section>
          </template>
          <template v-else>
            <section class="l-post">
              <post-placeholder />
            </section>
          </template>
        </template>
        <template v-else-if="navActive == 'Followers'">
          <followers :id="profile.id" :isConnected="account.isConnected"/>
        </template>
        <template v-else-if="navActive == 'Following'">
          <following :id="profile.id" :isConnected="account.isConnected"/>
        </template>
        <template v-else-if="navActive == 'About'">
          <profile-about :profile="profile"/>
        </template>
      </template>
      <div v-else style="text-align: center; margin-top: 40px">
        {{ profileErrorInfo }}
      </div>
    </template>
  </main>
</template>
<style>
.profile__button {
  height: 48px;
  border-radius: 12px;
  background-color: #4e4f51;
  color: #f4f4f4;
  font-size: 1.5rem;
  font-weight: 500;
  padding-inline: 24px;
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
  display: flex;
  align-items: center;
  gap: 9px;
}
.profile__name-wrap svg {
  margin-top: 4px;
}
.profile__name-wrap svg.is-active {
  fill: #0177fb;
}
.profile__name {
  font-size: 4rem;
  font-weight: 600;
  color: #f4f4f4;
  line-height: 5.4rem;
}
.profile__address {
  font-size: 1.4rem;
  font-weight: 500;
  color: #bdc1c6;
  margin-top: 4px;
}
.profile__description {
  font-size: 1.6rem;
  color: #f4f4f4;
  line-height: 150%;
  margin-top: 11px;
  width: 100%;
  max-width: 650px;
}
.profile__button {
  height: 48px;
  border-radius: 12px;
  background-color: #4e4f51;
  color: #f4f4f4;
  font-size: 1.5rem;
  font-weight: 500;
  padding-inline: 24px;
}
</style>
