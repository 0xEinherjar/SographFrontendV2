<script setup>
import { ref, shallowRef } from "vue";
import profile from "./profile.vue";
import home from "./home.vue";
import Explore from "./explore.vue";
import Wallet from "./wallet.vue";
import More1 from "./more-1.vue";
import Setting from "./setting.vue";
import Sun from "./sun.vue";
import Close from "./close.vue";
import Chat from "./chat.vue";
import Send from "./send.vue";
import Upload from "./upload.vue";
import Link from "./link.vue";
const props = defineProps(["iconClass", "size", "name"]);
const compRef = shallowRef({
  profile: profile,
  home: home,
  explore: Explore,
  wallet: Wallet,
  more1: More1,
  setting: Setting,
  sun: Sun,
  close: Close,
  chat: Chat,
  send: Send,
  upload: Upload,
  link: Link,
});
</script>
<!-- prettier-ignore -->
<template>
  <svg
    :class="props.iconClass"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    role="img"
  >
    <component :is="compRef[props.name]"/>
  </svg>
</template>
