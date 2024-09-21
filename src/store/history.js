import { defineStore } from "pinia";
import { ref } from "vue";

export const useHistoryStore = defineStore("history", () => {
  const history = ref([]);
  const isBack = ref(false);

  function setBack() {
    isBack.value = false;
  }

  function setHistory({ avatar, name, route, isProfile }) {
    history.value.push({
      avatar: avatar,
      name: name,
      route: route,
      isProfile: isProfile,
    });
  }

  function back() {
    if (history.value.length == 1) return null;
    isBack.value = true;
    return history.value.pop();
  }

  return { history, isBack, setHistory, back, setBack };
});
