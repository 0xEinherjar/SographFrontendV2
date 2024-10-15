<script setup>
import { computed } from "vue";
import { useUtils } from "../../composables/utils.js";
import { Icon } from "../";
const { profile } = defineProps(["profile"]);
const { truncateAddress } = useUtils();

const biography = computed(() => {
  return String(profile.biography).split("\n");
});

const date = computed(() => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
  }).format(new Date(profile.createdAt));
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="about">
    <section v-if="profile?.biography" class="about__section">
      <h4 class="about__title u-font-500">Biography</h4>
      <p class="about__paragraph">
        <template v-for="item in biography">
          <template v-if="item.length > 0">{{ item }}</template>
          <template v-else><br></template>
        </template>
      </p>
    </section>
    <ul class="about__list u-flex-line">
      <li class="about__list-item u-font-500 u-flex-line">
        <icon iconClass="c-icon" name="profile1"/>
        <span>{{ profile?.following }} <span class="about__list-text">Following</span></span>
      </li>
      <li class="about__list-item u-font-500 u-flex-line">
        <icon iconClass="c-icon" name="profile1"/>
        <span>{{ profile?.followers }} <span class="about__list-text">Followers</span></span>
      </li>
    </ul>
    <section class="about__section">
      <h4 class="about__title u-font-500">Links</h4>
      <ul class="about__list u-flex-line">
        <li v-if="profile" class="about__list-item u-font-500 u-flex-line">
          <icon iconClass="c-icon" name="link"/>
          <span>@{{ profile?.handle ? profile?.handle : truncateAddress(profile?.owner) }}</span>
        </li>
        <li v-if="profile.links.twitter" class="about__list-item u-font-500 u-flex-line">
          <icon iconClass="c-icon" name="x"/>
          <span>{{ profile.links.twitter }}</span>
        </li>
        <li v-if="profile.links.twitch" class="about__list-item u-font-500 u-flex-line">
          <icon iconClass="c-icon" name="twitch"/>
          <span>{{ profile.links.twitch }}</span>
        </li>
        <li v-if="profile.links.youtube" class="about__list-item u-font-500 u-flex-line">
          <icon iconClass="c-icon" name="youtube"/>
          <span>{{ profile.links.youtube }}</span>
        </li>
      </ul>
    </section>
    <ul class="about__details u-flex-line">
      <li v-if="profile.hasSubscription" class="about__details-item u-font-500 u-flex-line">
        <icon iconClass="c-icon" name="verify"/>
        <span>Premium</span>
      </li>
      <li v-else class="about__details-item u-font-500 u-flex-line">
        <icon iconClass="c-icon" name="profile"/>
        <span>Member only</span>
      </li>
      <li class="about__details-item u-font-500 u-flex-line">
        <icon iconClass="c-icon" name="calendar"/>
        <span>Member since {{ date }}</span>
      </li>
      <li v-if="profile?.location" class="about__details-item u-font-500 u-flex-line">
        <icon iconClass="c-icon" name="location"/>
        <span>{{ profile.location }}</span>
      </li>
    </ul>
  </div>
</template>
<style>
.about {
  padding-block: 42px;
  display: grid;
  gap: 42px;
}
.about__section {
  display: grid;
  gap: 24px;
}
.about__paragraph {
  color: var(--text-color-secondary);
  width: min(780px, 100%);
}
.about__list {
  gap: 40px;
}
.about__details-item,
.about__list-item {
  gap: 12px;
}
.about__list-text {
  color: var(--text-color-secondary);
  opacity: 0.4;
  margin-left: 2px;
}
.about__details {
  padding: 24px 32px;
  background-color: var(--bg-color-secondary);
  gap: 32px;
  border-radius: 12px;
}
</style>
