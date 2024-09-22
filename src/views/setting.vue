<script setup>
import { computed, inject, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user.js";
import { useAccountStore } from "../store/account.js";
import { pinProfileToIPFS } from "../infra/pinata.js";
import { useRouter } from "vue-router";
import { useDisconnect } from "@web3modal/ethers/vue";
import {
  FormReactivatePost,
  FormHandle,
  Avatar,
  Loading,
  Back,
  Sidebar,
  Icon,
} from "../components";

const blockchainClient = inject("blockchainClient");
const { disconnect } = useDisconnect();
const router = useRouter();
const accountStore = useAccountStore();
const { resetAccount } = accountStore;
const userStore = useUserStore();
const { removeUser, setUser } = userStore;
const { user } = storeToRefs(userStore);
const sectionActive = ref("");
const content = ref(null);
const isLoading = ref(false);
const isAddLinkActive = ref(false);
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
  reader.onload = () => (avatarURL.value = reader.result);
  reader.readAsDataURL(file);
}

function removeAvatar() {
  form.value.avatar = null;
  avatarURL.value = "";
}

async function redeem() {
  const result = await blockchainClient.redeemProfile();
  if (result.success) {
    resetAccount();
    removeUser();
    disconnect();
    router.push({ path: "/" });
  }
}

const setFormValues = (source) => {
  Object.assign(form.value, source, {
    links: { ...source.links },
  });
  description.value = source.description;
  biography.value = source.biography;
};

function restore() {
  setFormValues(user.value);
}

async function update() {
  isLoading.value = true;

  const metadata = await pinProfileToIPFS(
    Object.assign({}, form.value, {
      description: description.value,
      biography: biography.value,
    })
  );
  if (metadata.success) {
    const result = await blockchainClient.update(metadata.data);
    if (result.success) {
      const profile = await blockchainClient.getProfile(user.value.owner);
      if (profile.success) setUser(profile.data);
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

function showPlaceholder({ target: { id, innerText, parentNode } }) {
  if (id == "description") {
    description.value = String(innerText).replace(/[\r|\n]/g, "\n");
  } else if (id == "biography") {
    biography.value = String(innerText).replace(/[\r|\n]/g, "\n");
  }
  parentNode
    .querySelector(".c-form__textarea-placeholder")
    .classList.toggle("is-hidden", innerText.length > 0);
}

function scrollMeTo(refName) {
  const top = document.getElementById(refName).offsetTop;
  window.scrollTo({ top, behavior: "smooth" });
}

onMounted(() => {
  setFormValues(user.value);
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
          <h3 class="setting__title u-font-500">Account Settings</h3>
          <form class="c-form" @submit.prevent="update">
            <div class="c-form__attachment">
              <avatar :avatar="avatarURL || user.avatar" length="40px"/>
              <label class="c-form__attachment-label" for="avatar">
                <icon iconClass="c-icon" name="upload"/>
                <span>Upload avatar</span>
              </label>
              <input class="c-form__file" @change="onFileChange" type="file" accept="image/png, image/jpeg" name="avatar" id="avatar"/>
              <button v-if="avatarURL" type="button" @click="removeAvatar">
                <icon iconClass="c-icon u-text-danger" name="trash"/>
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
                <span class="c-form__textarea-placeholder" :class="{ 'is-hidden': form.biography.length > 0 }">
                  Brief description for your profile...
                </span>
                <div class="c-form__textarea-input" @keyup="showPlaceholder" id="biography" contenteditable="true">
                  <template v-for="item in String(form.biography).split('\n')">
                    <template v-if="item.length > 0">{{ item }}</template>
                    <template v-else><br /></template>
                  </template>
                </div>
              </div>
            </div>
            <div class="c-form__field">
              <label class="c-form__label" for="location">Location</label>
              <input class="c-form__input" type="text" name="location" id="location" v-model="form.location" placeholder="Location"/>
            </div>
            <div @click="isAddLinkActive = !isAddLinkActive" :class="{ 'is-active': isAddLinkActive }" class="c-form__expand u-flex-line-center">
              Add links social
              <icon iconClass="c-form__expand-icon" name="arrow"/>
            </div>
            <template v-if="isAddLinkActive">
              <div class="c-form__group">
                <div class="c-form__field">
                  <label class="c-form__label" for="twitter">Twitter</label>
                  <input class="c-form__input" type="text" name="twitter" id="twitter" v-model="form.links.twitter" placeholder="@username"/>
                </div>
                <div class="c-form__field">
                  <label class="c-form__label" for="twitch">Twitch</label>
                  <input class="c-form__input" type="text" name="twitch" id="twitch" v-model="form.links.twitch" placeholder="@username"/>
                </div>
              </div>
              <div class="c-form__group">
                <div class="c-form__field">
                  <label class="c-form__label" for="twitter">Youtube</label>
                  <input class="c-form__input" type="text" name="twitter" id="twitter" v-model="form.links.youtube" placeholder="@username"/>
                </div>
                <div class="c-form__field">
                  <label class="c-form__label" for="twitch">Instagram</label>
                  <input class="c-form__input" type="text" name="twitch" id="twitch" v-model="form.links.instagram" placeholder="@username"/>
                </div>
              </div>
            </template>
            <div class="c-form__footer">
              <button v-if="changeFormCounter > 0" @click="restore" type="button" class="c-form__restore u-flex-line">
                <span>Delete {{ changeFormCounter }} modifications</span>
                <icon iconClass="c-icon--small" name="trash"/>
              </button>
              <button class="c-form__submit u-flex-line" :disabled="changeFormCounter == 0" type="submit">
                <loading v-if="isLoading" type="small" />
                <template v-else>Save</template>
              </button>
            </div>
          </form>
        </section>
        <div v-if="user.hasSubscription" class="c-line"></div>
        <section v-if="user.hasSubscription" class="setting__section" id="handle">
          <h3 class="setting__title u-font-500">Update handle</h3>
          <form-handle :user-handle="user.handle" />
        </section>
        <div class="c-line"></div>
        <section class="setting__section" id="add-post">
          <h3 class="setting__title u-font-500">Reactivate Publication</h3>
          <form-reactivate-post/>
        </section>
        <div class="c-line"></div>
        <section class="setting__section" id="redeem">
          <h3 class="setting__title u-font-500">Redeem Zone</h3>
          <div class="c-redeem u-flex-line">
            <p class="c-redeem__text">Redeem your profile and publications to your wallet</p>
            <button class="c-redeem__button u-flex-line" @click="redeem">Redeem</button>
          </div>
        </section>
      </div>
      <aside class="setting__nav">
        <h5 class="setting__nav-caption u-flex-line">On this page</h5>
        <div class="setting__nav-list">
          <span class="setting__nav-pointer"></span>
          <a @click="scrollMeTo('settings')" :class="{'is-active' : sectionActive == 'settings'}" class="setting__nav-text">Account Settings</a>
          <template v-if="user.hasSubscription">
            <span class="setting__nav-pointer"></span>
            <a @click="scrollMeTo('handle')" :class="{'is-active' : sectionActive == 'handle'}" class="setting__nav-text">Update Handle</a>
          </template>
          <span class="setting__nav-pointer"></span>
          <a @click="scrollMeTo('add-post')" :class="{'is-active' : sectionActive == 'add-post'}" class="setting__nav-text">Reactivate Publication</a>
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
  background-color: var(--bg-color-quinary);
  margin-block: 8px;
}
.c-redeem {
  height: 80px;
  padding-inline: 24px;
  border-radius: var(--border-radius-default);
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
  color: var(--text-color-secondary);
  text-transform: uppercase;
  margin-bottom: 32px;
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
  border: 1px solid var(--bg-color-quaternary);
  background-color: var(--bg-color-primary);
  box-shadow: 0 0 0 4px var(--bg-color-primary);
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
}
</style>
