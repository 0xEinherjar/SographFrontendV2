<script setup>
import { onBeforeMount, ref } from "vue";
import { User, UserPlaceholder } from "../";
const blockchainClient = inject("blockchainClient");
const { id, isConnected } = defineProps(["id", "isConnected"]);
const followings = ref([]);
const isLoading = ref(true);
onBeforeMount(async () => {
  const { success, data, cursor } = await blockchainClient.getFollowings(
    id,
    0,
    20
  );
  if (success) followings.value = data;
  isLoading.value = false;
});
</script>
<!-- prettier-ignore -->
<template>
  <template v-if="!isLoading">
    <div v-if="followings.length > 0" class="l-user">
      <template v-for="item in followings">
        <user :avatar="item.avatar" :name="item.name" :handle="item.handle" :hasSubscription="item.hasSubscription" :owner="item.owner" :isFollowing="item.isFollowing" :isConnected="isConnected"/>
      </template>
    </div>
    <div class="no-users" v-else>Not following anyone</div>
  </template>
  <template v-else>
    <div class="l-user">
      <user-placeholder/>
      <user-placeholder/>
      <user-placeholder/>
    </div>
  </template>
</template>
