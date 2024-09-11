import { createRouter, createWebHashHistory } from "vue-router";
import { storeToRefs } from "pinia";
import { useAccountStore } from "../store/account.js";
import { useHistoryStore } from "../store/history.js";
import { Profile, Setting, Connect, Feed, Home, Reactivate } from "../views";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: Home, meta: { auth: false } },
    { path: "/feed", component: Feed, meta: { auth: true } },
    { path: "/settings", component: Setting, meta: { auth: true } },
    { path: "/create", component: Connect, meta: { auth: true } },
    { path: "/reactivate", component: Reactivate, meta: { auth: true } },
    { path: "/:profile", component: Profile, meta: { auth: false } },
  ],
});

router.beforeEach((to, from, next) => {
  const historyStore = useHistoryStore();
  const previousPath = from.fullPath.split("/")[1];
  if (previousPath == "feed") {
    historyStore.setHistory({
      name: "Feed",
      route: from.fullPath,
      isProfile: false,
    });
  } else if (previousPath == "settings") {
    historyStore.setHistory({
      name: "Settings",
      route: from.fullPath,
      isProfile: false,
    });
  } else if (previousPath == "explorer") {
    historyStore.setHistory({
      name: "Explorer",
      path: from.fullPath,
      isProfile: false,
    });
  } else {
    historyStore.setHistory({
      name: previousPath,
      path: from.fullPath,
      isProfile: true,
    });
  }
  const accountStore = useAccountStore();
  const { account } = storeToRefs(accountStore);
  const path = to.fullPath;
  const hasAccountAndIsConnected =
    (path == "/create" || path == "/reactivate" || path == "/") &&
    account.value.hasAccount &&
    account.value.isConnected;
  if (hasAccountAndIsConnected) {
    return next(`/${account.value.wallet}`);
  }
  if (
    (path == "/create" || path == "/reactivate") &&
    !account.value.isConnected
  ) {
    return next("/");
  }
  if (
    to.meta?.auth &&
    !account.value.hasAccount &&
    path != "/create" &&
    path != "/reactivate"
  ) {
    return next("/");
  }
  next();
});

export default router;
