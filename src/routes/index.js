import { createRouter, createWebHashHistory } from "vue-router";
import { storeToRefs } from "pinia";
import { useAccountStore } from "../store/account.js";
import Profile from "../views/profile.vue";
import Setting from "../views/setting.vue";
import Connect from "../views/connect.vue";
import Feed from "../views/feed.vue";
import Faucet from "../views/faucet.vue";
import Home from "../views/home.vue";
import Vote from "../views/votting.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: Home, meta: { auth: false } },
    { path: "/vote", component: Vote, meta: { auth: false } },
    { path: "/faucet", component: Faucet, meta: { auth: false } },
    { path: "/faucet", component: Faucet, meta: { auth: false } },
    { path: "/user/feed", component: Feed, meta: { auth: true } },
    { path: "/user/settings", component: Setting, meta: { auth: true } },
    { path: "/user/connect", component: Connect, meta: { auth: false } },
    { path: "/user/:profile", component: Profile, meta: { auth: false } },
  ],
});

router.beforeEach((to, from, next) => {
  const accountStore = useAccountStore();
  const { account } = storeToRefs(accountStore);
  if (to.meta?.auth && !account.value.hasAccount) {
    return next("/user/connect");
  }
  if (to.fullPath == "/" && account.value.hasAccount) {
    return next(`/user/${account.value.wallet}`);
  }
  next();
});

export default router;
