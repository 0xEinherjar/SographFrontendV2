<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user.js";
import {
  FormReactivatePost,
  FormHandle,
  FormUpdate,
  FormRedeem,
  Back,
  Sidebar,
} from "../components";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const sectionActive = ref("");
const content = ref(null);
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

const setFormValues = (source) => {
  Object.assign(form.value, source, {
    links: { ...source.links },
  });
  description.value = source.description;
  biography.value = source.biography;
};

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
          <form-update/>
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
          <form-redeem/>
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
  background-color: var(--bg-color-quinary);
  opacity: 0.6;
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
  color: var(--text-color-secondary);
}
.setting__nav-text.is-active {
  font-weight: 400;
  font-size: 1.5rem;
  color: var(--text-color-primary);
  opacity: 0.9;
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
