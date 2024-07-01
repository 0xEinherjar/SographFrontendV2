<script setup>
import Back from "../components/back.vue";
import Sidebar from "../components/sidebar.vue";
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import FormHandle from "../components/form/handle.vue";
import Avatar from "../components/avatar.vue";
import Loading from "../components/loading.vue";
import { useUserStore } from "../store/user.js";
import { useAccountStore } from "../store/account.js";
import { pinProfileToIPFS } from "../infra/pinata.js";
import Blockchain from "../infra/blockchain.js";
import { useRouter } from "vue-router";

const router = useRouter();
const accountStore = useAccountStore();
const { resetAccount } = accountStore;
const userStore = useUserStore();
const { removeUser } = userStore;
const { user } = storeToRefs(userStore);
const sectionActive = ref("");
const content = ref(null);
const isLoading = ref(false);
const avatarURL = ref("");
const description = ref("");
const biography = ref("");
const form = ref({
  avatar: null,
  name: "",
  description: "",
  createdAt: "",
  biography: "",
  location: "",
  links: {
    twitter: "",
    youtube: "",
    twitch: "",
    instagram: "",
  },
});

function onFileChange(event) {
  const file = event.target.files[0] || event.dataTransfer.files[0];
  if (!file) return;
  form.value.avatar = file;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    avatarURL.value = reader.result;
  });
  reader.readAsDataURL(file);
}

function removeAvatar() {
  form.value.avatar = null;
  avatarURL.value = "";
}

async function redeem() {
  const blockchain = new Blockchain();
  const result = await blockchain.redeemProfile();
  if (result.success) {
    resetAccount();
    removeUser();
    router.push({ path: "/" });
  }
}

function restore() {
  form.value.biography = user.value.biography;
  form.value.description = user.value.description;
  form.value.name = user.value.name;
  form.value.createdAt = user.value.createdAt;
  form.value.location = user.value.location;
  form.value.links.instagram = user.value.links.instagram;
  form.value.links.twitch = user.value.links.twitch;
  form.value.links.twitter = user.value.links.twitter;
  form.value.links.youtube = user.value.links.youtube;
}

async function update() {
  isLoading.value = true;
  const metadata = await pinProfileToIPFS({
    avatar: form.value.avatar,
    name: form.value.name,
    description: description.value,
    createdAt: form.value.createdAt,
    biography: biography.value,
    location: form.value.location,
    links: {
      twitter: form.value.links.twitter,
      youtube: form.value.links.youtube,
      twitch: form.value.links.twitch,
      instagram: form.value.links.instagram,
    },
  });
  if (metadata.success == false) {
    isLoading.value = false;
    return;
  }
  const blockchain = new Blockchain();
  const result = await blockchain.update(metadata.data);
  if (result.success) {
    const resultgetProfile = await blockchain.getProfile(user.value.owner);
    if (resultgetProfile.success) {
      userStore.setUser(resultgetProfile.data);
    }
  }
  isLoading.value = false;
}

const changeFormCounter = computed(() => {
  let counter = 0;
  if (biography.value != user.value.biography) counter += 1;
  if (description.value != user.value.description) counter += 1;
  if (form.value.name != user.value.name) counter += 1;
  if (form.value.avatar != user.value.avatar) counter += 1;
  if (form.value.createdAt != user.value.createdAt) counter += 1;
  if (form.value.location != user.value.location) counter += 1;
  if (form.value.links.instagram != user.value.links.instagram) counter += 1;
  if (form.value.links.twitch != user.value.links.twitch) counter += 1;
  if (form.value.links.twitter != user.value.links.twitter) counter += 1;
  if (form.value.links.youtube != user.value.links.youtube) counter += 1;
  return counter;
});

function showPlaceholder(event) {
  if (event.target.id == "description") {
    description.value = String(event.target.innerText).replace(
      /[\r|\n]/g,
      "\n"
    );
  } else if (event.target.id == "biography") {
    biography.value = String(event.target.innerText).replace(/[\r|\n]/g, "\n");
  }
  if (event.target.innerText.length > 0) {
    event.target.parentNode
      .querySelector(".c-form__textarea-placeholder")
      .classList.add("is-hidden");
  } else {
    event.target.parentNode
      .querySelector(".c-form__textarea-placeholder")
      .classList.remove("is-hidden");
  }
}

onMounted(() => {
  biography.value = user.value.biography;
  description.value = user.value.description;
  form.value.avatar = user.value.avatar;
  form.value.biography = user.value.biography;
  form.value.description = user.value.description;
  form.value.name = user.value.name;
  form.value.createdAt = user.value.createdAt;
  form.value.location = user.value.location;
  form.value.links.instagram = user.value.links.instagram;
  form.value.links.twitch = user.value.links.twitch;
  form.value.links.twitter = user.value.links.twitter;
  form.value.links.youtube = user.value.links.youtube;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sectionActive.value = entry.target.getAttribute("id");
        }
      });
    },
    {
      threshold: 0.7,
    }
  );

  content.value.querySelectorAll("section").forEach((section) => {
    observer.observe(section);
  });
});
function scrollMeTo(refName) {
  const top = document.getElementById(refName).offsetTop;
  window.scrollTo(0, top);
}
</script>
<!-- prettier-ignore -->
<template>
  <sidebar/>
  <main class="main">
    <div class="l-header">
      <back/>
    </div>
    <div class="setting">
      <div class="setting__content" ref="content">
        <section class="setting__section" id="settings">
          <h3 class="setting__title">Account Settings</h3>
          <form class="c-form" @submit.prevent="update">
            <div class="c-form__attachment">
              <img v-if="avatarURL" class="c-form__avatar" :src="avatarURL" alt="profile avatar"/>
              <avatar v-else :avatar="user.avatar" length="40px"/>
              <label class="c-form__attachment-label" for="avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.4">
                    <path d="M9 17V11L7 13" stroke="#BDC1C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 11L11 13" stroke="#BDC1C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="#BDC1C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 10H18C15 10 14 9 14 6V2L22 10Z" stroke="#BDC1C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Upload avatar</span>
              </label>
              <input class="c-form__file" @change="onFileChange" type="file" accept="image/png, image/jpeg" name="avatar" id="avatar"/>
              <button v-if="avatarURL" type="button" @click="removeAvatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="#FF6370" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path opacity="0.34" d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#FF6370" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.85 9.13989L18.2 19.2099C18.09 20.7799 18 21.9999 15.21 21.9999H8.79002C6.00002 21.9999 5.91002 20.7799 5.80002 19.2099L5.15002 9.13989" stroke="#FF6370" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path opacity="0.34" d="M10.33 16.5H13.66" stroke="#FF6370" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path opacity="0.34" d="M9.5 12.5H14.5" stroke="#FF6370" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="c-form__field">
              <label class="c-form__label" for="name">Name</label>
              <input class="c-form__input--name" type="text" name="name" id="name" v-model="form.name" placeholder="Enter your name"/>
            </div>
            <div class="c-form__field">
              <label class="c-form__label">Description</label>
              <div class="c-form__textarea">
                <span class="c-form__textarea-placeholder" :class="{ 'is-hidden': form.description.length > 0 }" >Brief introduction for your profile...</span>
                <div class="c-form__textarea-input" @keyup="showPlaceholder" id="description" contenteditable="true">
                  {{ form.description }}
                </div>
              </div>
            </div>
            <div class="c-form__field">
              <label class="c-form__label">Biography</label>
              <div class="c-form__textarea">
                <span
                  class="c-form__textarea-placeholder"
                  :class="{ 'is-hidden': form.biography.length > 0 }"
                  >Brief description for your profile...</span
                >
                <div
                  class="c-form__textarea-input"
                  @keyup="showPlaceholder"
                  id="biography"
                  contenteditable="true"
                >
                  <template v-for="item in String(form.biography).split('\n')">
                    <template v-if="item.length > 0">{{ item }}</template>
                    <template v-else><br /></template>
                  </template>
                </div>
              </div>
            </div>
            <div class="c-form__field">
              <label class="c-form__label" for="location">Location</label>
              <input
                class="c-form__input"
                type="text"
                name="location"
                id="location"
                v-model="form.location"
                placeholder="Location"
              />
            </div>
            <div class="c-form__group">
              <div class="c-form__field">
                <label class="c-form__label" for="twitter">Twitter</label>
                <input
                  class="c-form__input"
                  type="text"
                  name="twitter"
                  id="twitter"
                  v-model="form.links.twitter"
                  placeholder="@username"
                />
              </div>
              <div class="c-form__field">
                <label class="c-form__label" for="twitch">Twitch</label>
                <input
                  class="c-form__input"
                  type="text"
                  name="twitch"
                  id="twitch"
                  v-model="form.links.twitch"
                  placeholder="@username"
                />
              </div>
            </div>
            <div class="c-form__footer">
              <button
                v-if="changeFormCounter > 0"
                @click="restore"
                type="button"
                class="c-form__restore"
              >
                <span>Delete {{ changeFormCounter }} modifications</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                    stroke="#FF6370"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    opacity="0.34"
                    d="M7.08301 4.14175L7.26634 3.05008C7.39967 2.25841 7.49967 1.66675 8.90801 1.66675H11.0913C12.4997 1.66675 12.608 2.29175 12.733 3.05841L12.9163 4.14175"
                    stroke="#FF6370"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15.7087 7.6167L15.167 16.0084C15.0753 17.3167 15.0003 18.3334 12.6753 18.3334H7.32533C5.00033 18.3334 4.92533 17.3167 4.83366 16.0084L4.29199 7.6167"
                    stroke="#FF6370"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    opacity="0.34"
                    d="M8.6084 13.75H11.3834"
                    stroke="#FF6370"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    opacity="0.34"
                    d="M7.91699 10.4167H12.0837"
                    stroke="#FF6370"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                class="c-form__submit u-flex-line"
                :disabled="changeFormCounter == 0"
                type="submit"
              >
                <loading v-if="isLoading" type="small" />
                <template v-else>Save</template>
              </button>
            </div>
          </form>
        </section>
        <div v-if="user.hasSubscription" class="c-line"></div>
        <section v-if="user.hasSubscription" class="setting__section" id="handle">
          <h3 class="setting__title">Update handle</h3>
          <form-handle :user-handle="user.handle" />
        </section>
        <div class="c-line"></div>
        <section class="setting__section" id="redeem">
          <h3 class="setting__title">Redeem Zone</h3>
          <div class="c-redeem u-flex-line">
            <p class="c-redeem__text">Redeem your profile and publications to your wallet</p>
            <button class="c-redeem__button u-flex-line" @click="redeem">Redeem</button>
          </div>
        </section>
      </div>
      <aside class="setting__nav">
        <h5 class="setting__nav-caption">On this page</h5>
        <div class="setting__nav-list">
          <span class="setting__nav-pointer"></span>
          <a @click="scrollMeTo('settings')" :class="{'is-active' : sectionActive == 'settings'}" class="setting__nav-text">Account Settings</a>
          <template v-if="user.hasSubscription">
            <span class="setting__nav-pointer"></span>
            <a @click="scrollMeTo('handle')" :class="{'is-active' : sectionActive == 'handle'}" class="setting__nav-text">Update Handle</a>
          </template>
          <span class="setting__nav-pointer"></span>
          <a @click="scrollMeTo('redeem')" :class="{'is-active' : sectionActive == 'redeem'}" class="setting__nav-text">Redeem Zone</a>
        </div>
      </aside>
    </div>
  </main>
</template>
<style>
.c-line {
  width: 100%;
  height: 1px;
  background-color: #bdc1c6;
  margin-block: 8px;
}
.c-redeem {
  height: 80px;
  padding-inline: 24px;
  border-radius: 8px;
  background-color: var(--bg-color-secondary);
  gap: 40px;
}
.c-redeem__text {
  font-size: 1.2rem;
}
.c-redeem__button {
  height: 32px;
  border-radius: 8px;
  padding-inline: 16px;
  background-color: var(--color-red);
  font-size: 1.2rem;
  font-weight: 500;
  margin-left: auto;
}
.setting {
  padding-block: 32px;
  display: flex;
  align-items: flex-start;
  gap: 56px;
}
.setting__nav {
  min-width: 160px;
  position: sticky;
  top: 32px;
  flex-shrink: 0;
  width: min(292px, 100%);
}
.setting__nav-caption {
  font-size: 1.2rem;
  line-height: 1;
  font-weight: 500;
  color: #bdc1c6;
  text-transform: uppercase;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
}
.setting__nav-list {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  gap: 32px 16px;
  position: relative;
}
.setting__nav-list::before {
  content: "";
  position: absolute;
  width: 1px;
  grid-column: 1/2;
  justify-self: center;
  height: 100%;
  background-color: rgba(189, 193, 198, 0.6);
  z-index: -1;
}
.setting__nav-pointer {
  justify-self: center;
  height: 9px;
  width: 9px;
  border-radius: 50%;
  border: 1px solid #f4f4f4;
  background-color: #1a1b1d;
  box-shadow: 0 0 0 4px #1a1b1d;
}
.setting__nav-pointer:has(+ .setting__nav-text.is-active) {
  height: 15px;
  width: 15px;
}
.setting__nav-text {
  font-size: 1.4rem;
  line-height: 1.6rem;
  color: rgba(189, 193, 198, 0.6);
}
.setting__nav-text.is-active {
  font-weight: 400;
  font-size: 1.5rem;
  color: rgba(189, 193, 198, 1);
}
.setting__content {
  flex-grow: 1;
  display: grid;
  gap: 40px;
}
.setting__section {
  width: 100%;
  margin-inline: auto;
  display: grid;
  gap: 32px;
}
.setting__title {
  font-size: 1.7rem;
  line-height: 1.8rem;
  font-weight: 500;
}
</style>
