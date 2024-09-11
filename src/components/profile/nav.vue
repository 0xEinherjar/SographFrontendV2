<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useUtils } from "../../composables/utils.js";
import ModalReport from "../modal-report.vue";

const { truncateAddress, copyContent } = useUtils();
const route = useRoute();
const { links, address } = defineProps(["links", "address"]);
const emit = defineEmits(["profile-nav"]);

function profileNav(router) {
  document.querySelectorAll(".profile__nav-item").forEach((item) => {
    item.classList.remove("is-active");
  });
  router.target.classList.add("is-active");
  emit("profile-nav", router.target.dataset.nav);
}

watch(
  () => route.params.profile,
  async (_) => {
    document.querySelectorAll(".profile__nav-item").forEach((item) => {
      item.classList.remove("is-active");
      if (item.dataset.nav === "Publications") item.classList.add("is-active");
    });
    emit("profile-nav", "Publications");
  }
);
</script>
<!-- prettier-ignore -->
<template>
  <nav class="profile__nav u-flex-line-between">
    <ul class="profile__nav-list u-flex-line">
      <li class="profile__nav-item is-active" data-nav="Publications" @click="profileNav">Publications</li>
      <li class="profile__nav-item" data-nav="Followers" @click="profileNav">Followers</li>
      <li class="profile__nav-item" data-nav="Following" @click="profileNav">Following</li>
      <li class="profile__nav-item" data-nav="About" @click="profileNav">About</li>
    </ul>
    <ul class="profile__nav-actions u-flex-line">
      <li class="profile__nav-actions-items dropdown">
        <svg class="c-icon--outline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.9902 17.5H16.5002C19.5202 17.5 22.0002 15.03 22.0002 12C22.0002 8.98 19.5302 6.5 16.5002 6.5H14.9902" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 6.5H7.5C4.47 6.5 2 8.97 2 12C2 15.02 4.47 17.5 7.5 17.5H9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path opacity="0.4" d="M8 12H16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="dropdown__group">
          <ul class="dropdown__menu">
            <li class="dropdown__item">
              <span class="dropdown__item-text-grow">{{ truncateAddress(address) }}</span>
              <button type="button" @click="copyContent(address)">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="#F4F4F4"/>
                  <path opacity="0.4" d="M17.1 2H12.9C9.45001 2 8.05001 3.37 8.01001 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V15.99C20.63 15.95 22 14.55 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="#F4F4F4"/>
                </svg>
              </button>
            </li>
            <li v-if="links?.twitch" class="dropdown__item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M5.03976 2H20.4998C21.0498 2 21.4998 2.45 21.4998 3V13.59C21.4998 13.86 21.3898 14.11 21.2098 14.3L16.7998 18.71C16.6098 18.9 16.3598 19 16.0898 19H12.0398C11.7098 19 11.3898 19.17 11.2098 19.45L9.79977 21.56C9.60977 21.84 9.29977 22.01 8.96977 22.01H7.50977C6.95977 22.01 6.50977 21.56 6.50977 21.01V20.01C6.50977 19.46 6.05977 19.01 5.50977 19.01H3.50977C2.95977 19.01 2.50977 18.56 2.50977 18.01V5.31C2.50977 5.11 2.56976 4.91999 2.67976 4.75999L4.21977 2.46001C4.38977 2.17001 4.69976 2 5.03976 2Z" fill="#BDC1C6"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 7.14006V12.8501C8.5 13.1701 8.76001 13.4201 9.07001 13.4201H10.21C10.53 13.4201 10.78 13.1601 10.78 12.8501V7.14006C10.78 6.82006 10.52 6.57007 10.21 6.57007H9.07001C8.76001 6.57007 8.5 6.83006 8.5 7.14006Z" fill="#BDC1C6"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.21 7.14006V12.8501C14.21 13.1701 14.47 13.4201 14.78 13.4201H15.92C16.24 13.4201 16.49 13.1601 16.49 12.8501V7.14006C16.49 6.82006 16.23 6.57007 15.92 6.57007H14.78C14.47 6.57007 14.21 6.83006 14.21 7.14006Z" fill="#BDC1C6"/>
              </svg>
              <span>{{ links.twitch }}</span>
            </li>
            <li v-if="links?.twitter" class="dropdown__item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28004 9.09 5.11004 7.38 3.00004 4.79C2.63004 5.42 2.42004 6.16 2.42004 6.94C2.42004 8.43 3.17004 9.75 4.33004 10.5C3.62004 10.5 2.96004 10.3 2.38004 10V10.03C2.38004 12.11 3.86004 13.85 5.82004 14.24C5.19077 14.4122 4.53013 14.4362 3.89004 14.31C4.16165 15.1625 4.69358 15.9084 5.41106 16.4429C6.12854 16.9775 6.99549 17.2737 7.89004 17.29C6.37367 18.4904 4.49404 19.1393 2.56004 19.13C2.22004 19.13 1.88004 19.11 1.54004 19.07C3.44004 20.29 5.70004 21 8.12004 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z" fill="#BDC1C6"/>
              </svg>
              <span>{{ links.twitter }}</span>
            </li>
            <li v-if="links?.youtube" class="dropdown__item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4" d="M17 20H7C4 20 2 18 2 15V9C2 6 4 4 7 4H17C20 4 22 6 22 9V15C22 18 20 20 17 20Z" fill="#BDC1C6"/>
                <path d="M11.4196 9.49009L13.8896 10.9701C14.8296 11.5401 14.8296 12.4601 13.8896 13.0301L11.4196 14.5101C10.4196 15.1101 9.59961 14.6501 9.59961 13.4801V10.5101C9.59961 9.3501 10.4196 8.89009 11.4196 9.49009Z" fill="#BDC1C6"/>
              </svg>
              <span>{{ links.youtube }}</span>
            </li>
            <li v-if="links?.instagram" class="dropdown__item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4" d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z" fill="#BDC1C6"/>
                <path d="M12.0001 15.88C14.143 15.88 15.8801 14.1429 15.8801 12C15.8801 9.85713 14.143 8.12 12.0001 8.12C9.85725 8.12 8.12012 9.85713 8.12012 12C8.12012 14.1429 9.85725 15.88 12.0001 15.88Z" fill="#BDC1C6"/>
                <path d="M17 7.50003C16.73 7.50003 16.48 7.40003 16.29 7.21003C16.2 7.11003 16.13 7.00003 16.08 6.88003C16.03 6.76003 16 6.63003 16 6.50003C16 6.37003 16.03 6.24003 16.08 6.12003C16.13 5.99003 16.2 5.89003 16.29 5.79003C16.52 5.56003 16.87 5.45003 17.19 5.52003C17.26 5.53003 17.32 5.55003 17.38 5.58003C17.44 5.60003 17.5 5.63003 17.56 5.67003C17.61 5.70003 17.66 5.75003 17.71 5.79003C17.8 5.89003 17.87 5.99003 17.92 6.12003C17.97 6.24003 18 6.37003 18 6.50003C18 6.63003 17.97 6.76003 17.92 6.88003C17.87 7.00003 17.8 7.11003 17.71 7.21003C17.61 7.30003 17.5 7.37003 17.38 7.42003C17.26 7.47003 17.13 7.50003 17 7.50003Z" fill="#BDC1C6"/>
              </svg>
              <span>{{ links.instagram }}</span>
            </li>
          </ul>
        </div>
      </li>
      <li class="profile__nav-actions-items dropdown">
        <svg class="c-icon--outline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z" stroke-width="1.5"/>
          <path d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" stroke-width="1.5"/>
          <path opacity="0.4" d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" stroke-width="1.5"/>
        </svg>
        <div class="dropdown__group">
          <ul class="dropdown__menu">
            <li>
              <modal-report :account="address"/>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>
<style>
.dropdown {
  position: relative;
}
.dropdown__group {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--bg-color-secondary);
  padding: 16px 24px;
  border-radius: 8px;
  min-width: 180px;
  width: max-content;
  display: none;
}
.dropdown__menu {
  display: grid;
  gap: 24px;
}
.dropdown__item {
  color: var(--text-color-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.4rem;
  cursor: pointer;
}
.dropdown__item-text-grow {
  flex-grow: 1;
}
.dropdown__item svg {
  height: 20px;
  width: 20px;
}
.dropdown:hover .dropdown__group {
  display: block !important;
}
.profile__nav {
  padding-right: 40px;
}
.profile__nav-actions,
.profile__nav-list {
  gap: 32px;
}
.profile__nav-item {
  color: var(--text-color-tertiary);
  line-height: 2.4rem;
  cursor: pointer;
}
.profile__nav-item.is-active {
  color: var(--text-color-primary);
  opacity: 1;
}
</style>
