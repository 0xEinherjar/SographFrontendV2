import { defineStore } from "pinia";
import { ref } from "vue";

export const useHistoryStore = defineStore("history", () => {
  const history = ref({
    avatar: null,
    name: null,
    route: "",
    isProfile: false,
  });

  function setHistory({ avatar, name, route, isProfile }) {
    history.value.avatar = avatar ?? null;
    history.value.name = name;
    history.value.route = route;
    history.value.isProfile = isProfile ?? false;
  }

  return { history, setHistory };
});
