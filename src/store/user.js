import { defineStore } from 'pinia';
import { onBeforeMount, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  
  onBeforeMount(() => {
    if (localStorage.getItem("user")) {            
      user.value = JSON.parse(localStorage.getItem("user"));
    }
  })

  function setUser(_user) {        
    user.value = _user;        
    localStorage.setItem("user", JSON.stringify(_user));
  }

  function removeUser() {
    user.value = null;
    localStorage.removeItem("user");
  }

  function updateSubscription() {
    user.value.hasSubscription = true;
    localStorage.setItem("user", JSON.stringify(user.value));
  }

  function updateHandle(handle) {
    user.value.handle = handle;
    localStorage.setItem("user", JSON.stringify(user.value));
  }

  function updateUser(params) {
    // user.value.avatar = params.avatar;
    // user.value.name = params.name;
    // user.value.biography = params.biography;
    // user.value.description = params.description;
    // user.value.location = params.location;
    // user.value.links.twitter = params.links.twitter;
    // user.value.links.youtube = params.links.youtube;
    // user.value.links.twitch = params.links.twitch;
    // user.value.links.instagram = params.links.instagram;
    // localStorage.setItem("user", JSON.stringify(user.value));
  }

  return { user, setUser, removeUser, updateUser, updateSubscription, updateHandle };
})