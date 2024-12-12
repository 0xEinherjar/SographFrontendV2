<script setup>
import { Avatar, Icon } from "../";
import { useUtils } from "../../composables/utils";
const props = defineProps(["type", "username"]);
const { isAddress, truncateAddress } = useUtils();
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-profile-placeholder u-flex-line">
    <avatar length="180px"/>
    <div>
      <div class="c-profile-placeholder__title">Profile {{ props.type == 'UserBanned' ? "Banned" : props.type == 'UserDisabled' ? "Disabled" : "Not Found" }}</div>
      <strong class="c-profile-placeholder__name u-font-500">{{ isAddress(props.username) ? truncateAddress(props.username) : `@${username}` }}</strong>
    </div>
  </div>
  <div v-if="props.type == 'UserBanned'" class="c-profile-placeholder__info u-flex-line-center">
    <icon iconClass="c-icon" name="info1"/>
    Banned profile. For more information, please visit the <a class="c-profile-placeholder__info-link u-font-500" href="https://voting.sograph.app/#/">voting</a> page.
  </div>
</template>
<style>
.c-profile-placeholder {
  gap: 40px;
  padding: 55px 40px 55px 0;
}
.c-profile-placeholder__title {
  font-size: 4rem;
  font-weight: 600;
  line-height: 5.4rem;
}
.c-profile-placeholder__name {
  font-size: 1.4rem;
  color: var(--text-color-secondary);
  margin-top: 4px;
}
.c-profile-placeholder__info {
  height: 56px;
  width: 100%;
  background-color: var(--bg-color-secondary);
  font-size: 1.5rem;
  border-radius: var(--border-radius-default);
}
.c-profile-placeholder__info > svg {
  color: var(--color-red) !important;
  margin-right: 8px;
}
.c-profile-placeholder__info-link {
  padding-inline: 5px;
  text-decoration: underline;
  height: 100%;
  line-height: 56px;
}
</style>
