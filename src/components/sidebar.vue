<script setup>
import Search from "./search.vue";
import Toggle from "./toggle.vue";
import Avatar from "./avatar.vue";
import UserInfo from "./user-info.vue";
import CardPayment from "./card-payment.vue";
import Logo from "./logo.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/user.js";
import { useAccountStore } from "../store/account.js";
import { computed } from "vue";
import { useFavoriteStore } from "../store/favorite.js";
const favoriteStore = useFavoriteStore();
const { favorite } = storeToRefs(favoriteStore);
const userStore = useUserStore();
const accountStore = useAccountStore();
const { user } = storeToRefs(userStore);
const { account } = storeToRefs(accountStore);

const pathProfile = computed(() => {
  return user.value?.handle ? user.value?.handle : user.value?.owner;
});
</script>
<!-- prettier-ignore -->
<template>
  <aside class="sidebar">
    <div class="sidebar__inner">
      <div class="sidebar__wrapper">
        <user-info v-if="account.hasAccount"/>
        <router-link v-else to="/" class="sidebar__logo u-flex-line">
          <logo/>
        </router-link>
        <search/>
        <section class="sidebar__collapse">
          <h6 class="sidebar__caption">Overview</h6>
          <ul class="sidebar__list">
            <template v-if="account.hasAccount">
              <li>
                <router-link class="sidebar__item" to="/feed">
                  <svg class="c-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.4" d="M10.0703 2.81986L3.14027 8.36985C2.36027 8.98985 1.86027 10.2999 2.03027 11.2799L3.36027 19.2398C3.60027 20.6598 4.96026 21.8099 6.40026 21.8099H17.6003C19.0303 21.8099 20.4003 20.6498 20.6403 19.2398L21.9703 11.2799C22.1303 10.2999 21.6303 8.98985 20.8603 8.36985L13.9303 2.82984C12.8603 1.96984 11.1303 1.96986 10.0703 2.81986Z"/>
                    <path d="M12 15.5C13.3807 15.5 14.5 14.3807 14.5 13C14.5 11.6193 13.3807 10.5 12 10.5C10.6193 10.5 9.5 11.6193 9.5 13C9.5 14.3807 10.6193 15.5 12 15.5Z"/>
                  </svg>
                  <span class="sidebar__text">Feed</span>
                </router-link>
              </li>
              <li>
                <router-link class="sidebar__item" :to="`/${pathProfile}`">
                  <svg class="c-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.4" d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z"/>
                    <path d="M17.08 14.1499C14.29 12.2899 9.73996 12.2899 6.92996 14.1499C5.65996 14.9999 4.95996 16.1499 4.95996 17.3799C4.95996 18.6099 5.65996 19.7499 6.91996 20.5899C8.31996 21.5299 10.16 21.9999 12 21.9999C13.84 21.9999 15.68 21.5299 17.08 20.5899C18.34 19.7399 19.04 18.5999 19.04 17.3599C19.03 16.1299 18.34 14.9899 17.08 14.1499Z"/>
                  </svg>
                  <span class="sidebar__text">Profile</span>
                </router-link>
              </li>
              <li>
                <card-payment />
              </li>
            </template>
            <li>
              <router-link class="sidebar__item" to="#">
                <svg class="c-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.4" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
                  <path d="M14.3251 14.3268C16.2074 12.4445 16.6918 9.877 15.407 8.59219C14.1221 7.30738 11.5547 7.79174 9.67238 9.67405C7.79007 11.5564 7.30571 14.1238 8.59052 15.4086C9.87533 16.6934 12.4428 16.2091 14.3251 14.3268Z"/>
                </svg>
                <span class="sidebar__text c-soon">Explorer</span>
              </router-link>
            </li>
            <li>
              <a class="sidebar__item" href="https://faucet.sograph.app/">
                <svg class="c-icon" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.4" d="M19.9416 12.6049H21.9077V11.2033C21.9077 9.18843 20.2628 7.54346 18.2479 7.54346H7.07386C5.05903 7.54346 3.41406 9.18843 3.41406 11.2033V15.4568C4.08567 14.9215 4.93249 14.6003 5.84744 14.6003C7.99855 14.6003 9.74084 16.3425 9.74084 18.4937C9.74084 19.2237 9.53644 19.9147 9.1763 20.4988C8.97189 20.8492 8.70909 21.1606 8.40735 21.4137H18.2479C20.2628 21.4137 21.9077 19.7687 21.9077 17.7539V16.5956H20.0584C19.0071 16.5956 18.0435 15.8267 17.9559 14.7754C17.8975 14.1622 18.1311 13.588 18.5399 13.1889C18.9001 12.819 19.3965 12.6049 19.9416 12.6049Z"/>
                  <path d="M15.4349 3.84478V7.5435H7.07386C5.05903 7.5435 3.41406 9.18847 3.41406 11.2033V7.63113C3.41406 6.47284 4.12461 5.44105 5.20502 5.03224L12.9334 2.11219C14.1404 1.66445 15.4349 2.55022 15.4349 3.84478Z"/>
                  <path d="M22.9417 13.5978V15.6029C22.9417 16.1383 22.5134 16.5762 21.9683 16.5957H20.0605C19.0093 16.5957 18.0457 15.8268 17.9581 14.7755C17.8997 14.1623 18.1333 13.588 18.5421 13.189C18.9022 12.8191 19.3987 12.605 19.9437 12.605H21.9683C22.5134 12.6244 22.9417 13.0624 22.9417 13.5978Z"/>
                  <path d="M14.6079 12.4102H7.79447C7.39539 12.4102 7.06445 12.0793 7.06445 11.6802C7.06445 11.2811 7.39539 10.9502 7.79447 10.9502H14.6079C15.007 10.9502 15.3379 11.2811 15.3379 11.6802C15.3379 12.0793 15.007 12.4102 14.6079 12.4102Z"/>
                  <path d="M8.60071 15.7408C7.95374 15.0939 7.12782 14.7222 6.27438 14.6259C5.13874 14.4951 3.96182 14.8736 3.0946 15.7408C2.57841 16.257 2.23428 16.8902 2.07598 17.5579C1.75249 18.8311 2.08974 20.2421 3.0946 21.2469C3.78975 21.9421 4.67761 22.3206 5.593 22.3688C5.98531 22.4032 6.39138 22.3688 6.78369 22.2656C7.45131 22.1073 8.08451 21.7631 8.60071 21.2469C10.1218 19.7259 10.1218 17.2619 8.60071 15.7408ZM5.13185 17.0348C5.13185 16.6356 5.46221 16.3052 5.8614 16.3052C6.26748 16.3121 6.59096 16.6356 6.59784 17.0417L6.59099 17.7643L7.28614 17.7574C7.69221 17.7643 8.0157 18.0878 8.02258 18.4939C8.0157 18.9 7.69221 19.2235 7.28613 19.2303L6.59099 19.2234L6.59785 19.9461C6.59097 20.3522 6.26748 20.6757 5.86141 20.6826C5.66181 20.6757 5.48289 20.5931 5.35212 20.4623C5.22135 20.3315 5.13873 20.1526 5.13185 19.953L5.13187 19.2234L4.37479 19.2234C4.16831 19.2234 3.98934 19.1409 3.85857 19.0101C3.7278 18.8793 3.64523 18.7004 3.64523 18.4939C3.64523 18.0947 3.9756 17.7643 4.37479 17.7643L5.13187 17.7643L5.13185 17.0348Z"/>
                </svg>
                <span class="sidebar__text">Faucet</span>
              </a>
            </li>
          </ul>
          <input class="sidebar__collapse-checkbox" type="checkbox" id="collapse">
          <label class="sidebar__collapse-button" role="button" for="collapse">
            <svg class="c-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z" fill-opacity="0.4"/>
              <path d="M5 9.625C3.69289 9.625 2.625 10.6929 2.625 12C2.625 13.3071 3.69289 14.375 5 14.375C6.30711 14.375 7.375 13.3071 7.375 12C7.375 10.6929 6.30711 9.625 5 9.625Z" stroke="#BDC1C6" stroke-opacity="0.4" stroke-width="0.75"/>
              <path d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" fill-opacity="0.4"/>
              <path d="M19 9.625C17.6929 9.625 16.625 10.6929 16.625 12C16.625 13.3071 17.6929 14.375 19 14.375C20.3071 14.375 21.375 13.3071 21.375 12C21.375 10.6929 20.3071 9.625 19 9.625Z" stroke="#BDC1C6" stroke-opacity="0.4" stroke-width="0.75"/>
            </svg>
            <span class="sidebar__collapse-text show-more">Show More</span>
            <span class="sidebar__collapse-text show-less">Show Less</span>
          </label>
        </section>
        <router-link v-if="!account.hasAccount" class="sidebar__connect u-flex-line-center" to="/">Connect</router-link>
        <section v-if="account.hasAccount && favorite.length">
          <h6 class="sidebar__caption">Favorite Profile</h6>
          <ul class="sidebar__list">
            <li v-for="user of favorite">
              <router-link class="sidebar__link" :to="`/${user.path}`">
                <avatar :avatar="user.avatar" length="28px"/>
                <span class="sidebar__text">{{ user.name }}</span>
              </router-link>
            </li>
          </ul>
        </section>
      </div>
      <ul class="sidebar__list">
        <li v-if="account.hasAccount">
          <router-link class="sidebar__item" to="/settings">
            <svg class="c-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.4" d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"/>
              <path d="M12 15.25C13.7949 15.25 15.25 13.7949 15.25 12C15.25 10.2051 13.7949 8.75 12 8.75C10.2051 8.75 8.75 10.2051 8.75 12C8.75 13.7949 10.2051 15.25 12 15.25Z"/>
            </svg>
            <span class="sidebar__text">Settings</span>
          </router-link>
        </li>
        <li class="sidebar__item">
          <svg  class="c-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.4" d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z"/>
            <path d="M12 22.96C11.45 22.96 11 22.55 11 22V21.92C11 21.37 11.45 20.92 12 20.92C12.55 20.92 13 21.37 13 21.92C13 22.47 12.55 22.96 12 22.96ZM19.14 20.14C18.88 20.14 18.63 20.04 18.43 19.85L18.3 19.72C17.91 19.33 17.91 18.7 18.3 18.31C18.69 17.92 19.32 17.92 19.71 18.31L19.84 18.44C20.23 18.83 20.23 19.46 19.84 19.85C19.65 20.04 19.4 20.14 19.14 20.14ZM4.86 20.14C4.6 20.14 4.35 20.04 4.15 19.85C3.76 19.46 3.76 18.83 4.15 18.44L4.28 18.31C4.67 17.92 5.3 17.92 5.69 18.31C6.08 18.7 6.08 19.33 5.69 19.72L5.56 19.85C5.37 20.04 5.11 20.14 4.86 20.14ZM22 13H21.92C21.37 13 20.92 12.55 20.92 12C20.92 11.45 21.37 11 21.92 11C22.47 11 22.96 11.45 22.96 12C22.96 12.55 22.55 13 22 13ZM2.08 13H2C1.45 13 1 12.55 1 12C1 11.45 1.45 11 2 11C2.55 11 3.04 11.45 3.04 12C3.04 12.55 2.63 13 2.08 13ZM19.01 5.99C18.75 5.99 18.5 5.89 18.3 5.7C17.91 5.31 17.91 4.68 18.3 4.29L18.43 4.16C18.82 3.77 19.45 3.77 19.84 4.16C20.23 4.55 20.23 5.18 19.84 5.57L19.71 5.7C19.52 5.89 19.27 5.99 19.01 5.99ZM4.99 5.99C4.73 5.99 4.48 5.89 4.28 5.7L4.15 5.56C3.76 5.17 3.76 4.54 4.15 4.15C4.54 3.76 5.17 3.76 5.56 4.15L5.69 4.28C6.08 4.67 6.08 5.3 5.69 5.69C5.5 5.89 5.24 5.99 4.99 5.99ZM12 3.04C11.45 3.04 11 2.63 11 2.08V2C11 1.45 11.45 1 12 1C12.55 1 13 1.45 13 2C13 2.55 12.55 3.04 12 3.04Z"/>
          </svg>
          <span class="sidebar__text">Dark Mode</span>
          <toggle/>
        </li>
      </ul>
    </div>
  </aside>
</template>
<style>
:root {
  --list-item-height: 48;
  --gap: 4;
  --max-item: 2;
}
.sidebar {
  grid-column: sidebar;
  position: relative;
}
.sidebar__inner {
  padding: 32px 24px;
  position: sticky;
  top: 0;
  left: 0;
  overflow-y: auto;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.sidebar__inner::-webkit-scrollbar {
  width: 0;
}
.sidebar__wrapper {
  display: grid;
  grid-gap: 32px;
  margin-bottom: 32px;
  flex-grow: 1;
  grid-auto-rows: min-content;
}
.sidebar__logo {
  height: 40px;
  padding-inline: 16px;
}
.sidebar__caption {
  font-size: 1.2rem;
  line-height: 1.2rem;
  margin-bottom: 12px;
  margin-left: 16px;
  font-weight: 400;
  pointer-events: none;
  color: rgba(189, 193, 198, 0.8);
}
.light-mode .sidebar__caption {
  color: #292d32cc;
}
.sidebar__list {
  display: flex;
  flex-direction: column;
  gap: calc(var(--gap) * 1px);
}
.sidebar__item,
.sidebar__link {
  height: calc(var(--list-item-height) * 1px);
  padding-inline: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  cursor: pointer;
}
.sidebar__text {
  flex-grow: 1;
  color: var(--text-color-primary);
}
.light-mode .sidebar__text {
  color: var(--text-color-primary);
  font-weight: 500;
}
.sidebar__collapse > .sidebar__list {
  height: calc(
    ((var(--list-item-height) + var(--gap)) * var(--max-item) - var(--gap)) *
      1px
  );
  overflow: hidden;
}
.sidebar__collapse > .sidebar__list:has(+ .sidebar__collapse-checkbox:checked) {
  height: auto;
}
.show-less,
.sidebar__collapse-checkbox {
  display: none;
}
.sidebar__collapse-button {
  height: calc(var(--list-item-height) * 1px);
  padding-inline: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 4px;
  cursor: pointer;
  user-select: none;
}
.sidebar__collapse-text {
  flex-shrink: 1;
  color: var(--text-color-tertiary);
}
.sidebar__collapse-checkbox:checked + .sidebar__collapse-button > .show-more {
  display: none;
}
.sidebar__collapse-checkbox:checked + .sidebar__collapse-button > .show-less {
  display: inline-block;
}
.sidebar__connect {
  height: 48px;
  border-radius: 12px;
  background-color: var(--text-color-primary);
  color: var(--bg-color-primary);
  font-weight: 500;
  cursor: pointer;
  width: calc(100% - 32px);
  margin-inline: auto;
}
</style>
