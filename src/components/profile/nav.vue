<script setup>
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useUtils } from "../../composables/utils.js";
import { ModalReport, Icon } from "../";

const { truncateAddress, copyContent } = useUtils();
const route = useRoute();
const props = defineProps(["links", "address"]);
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
        <icon iconClass="c-icon" name="link"/>
        <div class="dropdown__group">
          <ul class="dropdown__menu">
            <li class="dropdown__item u-flex-line">
              <button type="button" @click="copyContent(props.address)">
                <icon iconClass="c-icon" name="copy"/>
              </button>
              <span class="dropdown__item-text-grow">{{ truncateAddress(props.address) }}</span>
            </li>
            <li v-if="props.links?.twitch">
              <a class="dropdown__item u-flex-line" :href="`https://twitch.tv/${props.links.twitch}`">
                <icon iconClass="c-icon" name="twitch"/>
                <span>{{ props.links.twitch }}</span>
              </a>
            </li>
            <li v-if="props.links?.twitter">
              <a class="dropdown__item u-flex-line" :href="`https://x.com/${props.links.twitter}`">
                <icon iconClass="c-icon" name="x"/>
                <span>{{ props.links.twitter }}</span>
              </a>
            </li>
            <li v-if="props.links?.youtube">
              <a class="dropdown__item u-flex-line" :href="`https://youtube.com/${props.links.youtube}`"></a>
              <icon iconClass="c-icon" name="youtube"/>
              <span>{{ props.links.youtube }}</span>
            </li>
            <li v-if="props.links?.instagram">
              <a class="dropdown__item u-flex-line" :href="`https://instagram.com/${props.links.instagram}`">
                <icon iconClass="c-icon" name="instagram"/>
                <span>{{ props.links.instagram }}</span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li class="profile__nav-actions-items dropdown">
        <icon iconClass="c-icon" name="more"/>
        <div class="dropdown__group">
          <ul class="dropdown__menu">
            <li>
              <modal-report :account="props.address"/>
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
  padding: 20px 24px;
  border-radius: 12px;
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
  gap: 8px;
  font-size: 1.4rem;
  cursor: pointer;
}
.dropdown__item-text-grow {
  flex-grow: 1;
}
.dropdown:hover .dropdown__group {
  display: block !important;
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
