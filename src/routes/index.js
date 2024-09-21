import { createRouter, createWebHashHistory } from "vue-router";
import { storeToRefs } from "pinia";
import { useAccountStore } from "../store/account.js";
import { useHistoryStore } from "../store/history.js";
import { Profile, Setting, Connect, Feed, Home, Reactivate } from "../views";
import Blockchain from "../infra/blockchain.js";
const blockchain = new Blockchain();

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

router.beforeEach(async (to, from, next) => {
  const historyStore = useHistoryStore();
  const { isBack } = storeToRefs(historyStore);
  const previousPath = from.fullPath.split("/")[1];
  const defaultRoute = ["feed", "settings", "explorer"];
  const addProfileHistory = async (path) => {
    const result = await blockchain.getProfile(path);
    if (result.success) {
      historyStore.setHistory({
        avatar: result.data.avatar,
        name: result.data.name,
        isProfile: true,
        route: result.data.handle || result.data.owner,
      });
    } else {
      historyStore.setHistory({
        avatar: null,
        name: path,
        isProfile: true,
        route: path,
      });
    }
  };
  if (!isBack.value) {
    if (defaultRoute.some((item) => item == previousPath)) {
      historyStore.setHistory({
        name: previousPath,
        route: previousPath,
        isProfile: false,
      });
    } else if (previousPath == "" && to.fullPath) {
      const toPath = to.fullPath.split("/")[1];
      if (defaultRoute.some((item) => item == toPath)) {
        historyStore.setHistory({
          name: toPath,
          path: toPath,
          isProfile: false,
        });
      } else {
        await addProfileHistory(toPath);
      }
    } else {
      await addProfileHistory(previousPath);
    }
  } else {
    historyStore.setBack();
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
