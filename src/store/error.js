import { defineStore } from "pinia";
import { ref } from "vue";

export const useErrorStore = defineStore("error", () => {
  const error = ref("");

  function setError(_error) {
    error.value = _error;
    setTimeout(() => {
      error.value = "";
    }, 8000);
  }
  function removeError() {
    error.value = "";
  }

  return { error, setError, removeError };
});
