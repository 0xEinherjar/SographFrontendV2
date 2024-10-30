<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../../store/user.js";
import { pinProfileToIPFS } from "../../infra/pinata.js";
import { Avatar, Loading, Icon } from "../";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../../contracts/Sograph.js";
import { useProfile } from "../../composables/useProfile.js";
const { writeContractAsync, data } = useWriteContract();
const { getProfile } = useProfile();
const userStore = useUserStore();
const { setUser } = userStore;
const { user } = storeToRefs(userStore);
const isAddLinkActive = ref(false);
const avatarURL = ref("");
const description = ref("");
const biography = ref("");
const form = ref({
  avatar: null,
  name: "",
  description: "",
  createdAt: "",
  biography: "",
  location: "",
  links: {
    twitter: "",
    youtube: "",
    twitch: "",
    instagram: "",
  },
});

function onFileChange(event) {
  const file = event.target.files[0] || event.dataTransfer.files[0];
  if (!file) return;
  form.value.avatar = file;
  const reader = new FileReader();
  reader.onload = () => (avatarURL.value = reader.result);
  reader.readAsDataURL(file);
}

function removeAvatar() {
  form.value.avatar = null;
  avatarURL.value = "";
}

const setFormValues = (source) => {
  Object.assign(form.value, source, {
    links: { ...source.links },
  });
  description.value = source.description;
  biography.value = source.biography;
};

function restore() {
  setFormValues(user.value);
}

async function update() {
  const metadata = await pinProfileToIPFS(
    Object.assign({}, form.value, {
      description: description.value,
      biography: biography.value,
    })
  );
  if (metadata.success) {
    await writeContractAsync({
      abi: abi,
      address: contract,
      functionName: "updateProfile",
      args: [metadata.data],
    });
  }
}

const { isSuccess, isLoading } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    const profile = await getProfile(user.value.owner);
    if (profile.success) setUser(profile.data);
  }
});

const changeFormCounter = computed(() => {
  let counter = 0;
  if (biography.value != user.value.biography) counter += 1;
  if (description.value != user.value.description) counter += 1;
  if (form.value.name != user.value.name) counter += 1;
  if (form.value.avatar != user.value.avatar) counter += 1;
  if (form.value.createdAt != user.value.createdAt) counter += 1;
  if (form.value.location != user.value.location) counter += 1;
  if (form.value.links.instagram != user.value.links.instagram) counter += 1;
  if (form.value.links.twitch != user.value.links.twitch) counter += 1;
  if (form.value.links.twitter != user.value.links.twitter) counter += 1;
  if (form.value.links.youtube != user.value.links.youtube) counter += 1;
  return counter;
});

function showPlaceholder({ target: { id, innerText, parentNode } }) {
  if (id == "description") {
    description.value = String(innerText).replace(/[\r|\n]/g, "\n");
  } else if (id == "biography") {
    biography.value = String(innerText).replace(/[\r|\n]/g, "\n");
  }
  parentNode
    .querySelector(".c-form__textarea-placeholder")
    .classList.toggle("is-hidden", innerText.length > 0);
}

onMounted(() => {
  setFormValues(user.value);
});
</script>
<!-- prettier-ignore -->
<template>
  <form class="c-form" @submit.prevent="update">
    <div class="c-form__attachment">
      <avatar :avatar="avatarURL || user.avatar" length="40px"/>
      <label class="c-form__attachment-label" for="avatar">
        <icon iconClass="c-icon" name="upload"/>
        <span>Upload avatar</span>
      </label>
      <input class="c-form__file" @change="onFileChange" type="file" accept="image/png, image/jpeg" name="avatar" id="avatar"/>
      <button v-if="avatarURL" type="button" @click="removeAvatar">
        <icon iconClass="c-icon u-text-danger" name="trash"/>
      </button>
    </div>
    <div class="c-form__field">
      <label class="c-form__label" for="name">Name</label>
      <input class="c-form__input--name" type="text" name="name" id="name" v-model="form.name" placeholder="Enter your name"/>
    </div>
    <div class="c-form__field">
      <label class="c-form__label">Description</label>
      <div class="c-form__textarea">
        <span class="c-form__textarea-placeholder" :class="{ 'is-hidden': form.description.length > 0 }" >Brief introduction for your profile...</span>
        <div class="c-form__textarea-input" @keyup="showPlaceholder" id="description" contenteditable="true">
          {{ form.description }}
        </div>
      </div>
    </div>
    <div class="c-form__field">
      <label class="c-form__label">Biography</label>
      <div class="c-form__textarea">
        <span class="c-form__textarea-placeholder" :class="{ 'is-hidden': form.biography.length > 0 }">
          Brief description for your profile...
        </span>
        <div class="c-form__textarea-input" @keyup="showPlaceholder" id="biography" contenteditable="true">
          <template v-for="item in String(form.biography).split('\n')">
            <template v-if="item.length > 0">{{ item }}</template>
            <template v-else><br /></template>
          </template>
        </div>
      </div>
    </div>
    <div class="c-form__field">
      <label class="c-form__label" for="location">Location</label>
      <input class="c-form__input" type="text" name="location" id="location" v-model="form.location" placeholder="Location"/>
    </div>
    <div @click="isAddLinkActive = !isAddLinkActive" :class="{ 'is-active': isAddLinkActive }" class="c-form__expand u-flex-line">
      Show more option
      <icon iconClass="c-form__expand-icon" name="arrow"/>
    </div>
    <template v-if="isAddLinkActive">
      <div class="c-form__group">
        <div class="c-form__field">
          <label class="c-form__label" for="twitter">Twitter</label>
          <input class="c-form__input" type="text" name="twitter" id="twitter" v-model="form.links.twitter" placeholder="@username"/>
        </div>
        <div class="c-form__field">
          <label class="c-form__label" for="twitch">Twitch</label>
          <input class="c-form__input" type="text" name="twitch" id="twitch" v-model="form.links.twitch" placeholder="@username"/>
        </div>
      </div>
      <div class="c-form__group">
        <div class="c-form__field">
          <label class="c-form__label" for="twitter">Youtube</label>
          <input class="c-form__input" type="text" name="twitter" id="twitter" v-model="form.links.youtube" placeholder="@username"/>
        </div>
        <div class="c-form__field">
          <label class="c-form__label" for="twitch">Instagram</label>
          <input class="c-form__input" type="text" name="twitch" id="twitch" v-model="form.links.instagram" placeholder="@username"/>
        </div>
      </div>
    </template>
    <div class="c-form__footer">
      <button v-if="changeFormCounter > 0" @click="restore" type="button" class="c-form__restore u-flex-line">
        <span>Delete {{ changeFormCounter }} modifications</span>
        <icon iconClass="c-icon--small u-text-danger" name="trash"/>
      </button>
      <button class="c-form__submit u-flex-line" :disabled="changeFormCounter == 0" type="submit">
        <loading v-if="isLoading" type="small" />
        <template v-else>Save</template>
      </button>
    </div>
  </form>
</template>
