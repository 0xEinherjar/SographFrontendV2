<script setup>
import { shallowRef } from "vue";
import * as Icon from "./";
const props = defineProps(["iconClass", "size", "name"]);
const compRef = shallowRef({
  profile: Icon.Profile,
  home: Icon.Home,
  explore: Icon.Explore,
  wallet: Icon.Wallet,
  more1: Icon.More1,
  more: Icon.More,
  setting: Icon.Setting,
  sun: Icon.Sun,
  close: Icon.Close,
  chat: Icon.Chat,
  send: Icon.Send,
  upload: Icon.Upload,
  link: Icon.Link,
  edit: Icon.Edit,
  trash: Icon.Trash,
  star: Icon.Star,
  info: Icon.Info,
  info1: Icon.Info1,
  like: Icon.Like,
  share: Icon.Share,
  search: Icon.Search,
  arrow: Icon.Arrow,
  copy: Icon.Copy,
  youtube: Icon.Youtube,
  instagram: Icon.Instagram,
  twitch: Icon.Twitch,
  x: Icon.X,
  profile1: Icon.Profile1,
  calendar: Icon.Calendar,
  location: Icon.Location,
  verify: Icon.Verify,
});
</script>
<!-- prettier-ignore -->
<template>
  <svg :class="props.iconClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" role="img">
    <component :is="compRef[props.name]"/>
  </svg>
</template>
