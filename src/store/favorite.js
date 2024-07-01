import { defineStore } from "pinia";
import { onBeforeMount, ref } from "vue";

export const useFavoriteStore = defineStore("favorite", () => {
  const favorite = ref([]);

  onBeforeMount(() => {
    if (localStorage.getItem("favorite")) {
      favorite.value = JSON.parse(localStorage.getItem("favorite"));
    }
  });

  function isFavorite(id) {
    if (!favorite.value.length) return false;
    for (const user of favorite.value) {
      if (user.id == id) return true;
    }
    return false;
  }

  function setFavorite(user) {
    if (favorite.value.length >= 5) return;
    favorite.value.push(user);
    localStorage.setItem("favorite", JSON.stringify(favorite.value));
  }

  function removeFavorite(id) {
    if (!favorite.value.length) return;
    favorite.value = favorite.value.filter((user) => user.id != id);
    localStorage.setItem("favorite", JSON.stringify(favorite.value));
  }

  return { favorite, isFavorite, setFavorite, removeFavorite };
});
