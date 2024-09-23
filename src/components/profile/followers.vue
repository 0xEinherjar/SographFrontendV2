<script setup>
import { inject, onBeforeMount, ref } from "vue";
import { User, UserPlaceholder } from "../";
const blockchainClient = inject("blockchainClient");
const props = defineProps(["id", "isConnected"]);
const followers = ref([]);
const isLoading = ref(true);
const cursorPag = ref(0);
const lengthPag = ref(24);
const observer = ref(null);

async function fetchFollowers() {
  const { success, data, cursor } = await blockchainClient.getFollowers(
    props.id,
    cursorPag.value,
    lengthPag.value
  );
  if (success) {
    followers.value.unshift(...data);
    cursorPag.value = cursor;
    if (cursor == 0) {
      observer.value?.disconnect();
      return;
    }
  }
}
onBeforeMount(async () => {
  await fetchFollowers();
  isLoading.value = false;
  if (cursorPag.value != 0) {
    observer.value = new IntersectionObserver(async (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        const cursor = await fetchFollowers(cursorPag.value);
        if (cursor == 0) observer.value.disconnect();
      }
    });
    observer.value.observe(document.getElementById("followers-sentinel"));
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <template v-if="!isLoading">
    <div v-if="followers.length > 0" class="l-user">
      <template v-for="item in followers">
        <user :avatar="item.avatar" :name="item.name" :handle="item.handle" :hasSubscription="item.hasSubscription" :owner="item.owner" :isFollowing="item.isFollowing" :isConnected="props.isConnected"/>
      </template>
    </div>
    <div v-else class="no-users">Not followed by anyone</div>
    <div id="followers-sentinel"></div>
  </template>
  <template v-else>
    <div class="l-user">
      <user-placeholder/>
      <user-placeholder/>
      <user-placeholder/>
    </div>
  </template>
</template>
<style></style>
