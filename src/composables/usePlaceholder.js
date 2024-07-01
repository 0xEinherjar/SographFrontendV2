import { ref } from "vue"
export const usePlaceholder = () => {
  const showPlaceholder = ref(true);
  
  function verifyPlaceholder(event) {
    if (event.target.innerText.length > 0) {
      showPlaceholder.value = false;
    } else {
      showPlaceholder.value = true;
    }
  }

  return { verifyPlaceholder, showPlaceholder };
}