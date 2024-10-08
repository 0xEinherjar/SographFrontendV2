<script setup>
import { inject, onBeforeMount, ref } from "vue";
import { User, UserPlaceholder } from "../";
const blockchainClient = inject("blockchainClient");
const props = defineProps(["id", "isConnected"]);
const followings = ref([]);
const isLoading = ref(true);
const cursorPag = ref(0);
const lengthPag = ref(24);
const observer = ref(null);

async function fetchFollowings() {
  const { success, data, cursor } = await blockchainClient.getFollowings(
    props.id,
    cursorPag.value,
    lengthPag.value
  );
  if (success) {
    followings.value.unshift(...data);
    cursorPag.value = cursor;
    if (cursor == 0) {
      observer.value?.disconnect();
      return;
    }
  }
}

onBeforeMount(async () => {
  await fetchFollowings();
  isLoading.value = false;
  if (cursorPag.value != 0) {
    observer.value = new IntersectionObserver(async (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        const cursor = await fetchFollowings(cursorPag.value);
        if (cursor == 0) observer.value.disconnect();
      }
    });
    observer.value.observe(document.getElementById("followings-sentinel"));
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <template v-if="!isLoading">
    <div v-if="followings.length > 0" class="l-user">
      <template v-for="item in followings">
        <user :avatar="item.avatar" :name="item.name" :handle="item.handle" :hasSubscription="item.hasSubscription" :owner="item.owner" :isFollowing="item.isFollowing" :isConnected="props.isConnected"/>
      </template>
    </div>
    <div class="no-users" v-else>Not following anyone</div>
    <div id="followings-sentinel"></div>
  </template>
  <template v-else>
    <div class="l-user">
      <user-placeholder/>
      <user-placeholder/>
      <user-placeholder/>
    </div>
  </template>
</template>
