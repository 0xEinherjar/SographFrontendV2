<script setup>
import { inject, onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import { Icon } from "./";
import { useUserStore } from "../store/user.js";
const blockchainClient = inject("blockchainClient");
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const modal = ref(null);
const minPrice = ref(0);
const price = ref(0);
const duration = ref(1);

async function subscription() {
  const approveResult = await blockchainClient.approveToken(price.value);
  if (!approveResult.success) {
    modal.value.close();
    return;
  }
  const result = await blockchainClient.subscription(
    user.value.id,
    duration.value
  );
  if (result.success) {
    userStore.updateSubscription();
    modal.value.close();
  }
}

function counterDuration(operator) {
  if (operator == "-") {
    if (duration.value == 1) return;
    duration.value -= 1;
    price.value = duration.value * minPrice.value;
  } else {
    duration.value += 1;
    price.value = duration.value * minPrice.value;
  }
}
onBeforeMount(async () => {
  const result = await blockchainClient.getPriceSubscription();
  minPrice.value = result;
  price.value = result;
});
</script>
<!-- prettier-ignore -->
<template>
  <dialog class="c-card-payment" ref="modal">
    <div class="c-card-payment__content">
      <button class="c-card-payment__close" @click="modal.close()" type="button">
        <icon iconClass="c-icon" name="close"/>
      </button>
      <div class="c-card-payment__header">
        <h3 class="c-card-payment__title">Sograph Premium</h3>
        <p class="c-card-payment__subtitle">
          Subscribe to Sograph Premium and access exclusive features that take your experience to the next level!
        </p>
      </div>
      <ul class="c-card-payment__list">
        <li class="c-card-payment__list-item">
          <div class="c-card-payment__list-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" fill="#F4F4F4"/>
              <path d="M20.9597 17.84L19.3297 18.39C18.8797 18.54 18.5197 18.89 18.3697 19.35L17.8197 20.98C17.3497 22.39 15.3697 22.36 14.9297 20.95L13.0797 15C12.7197 13.82 13.8097 12.72 14.9797 13.09L20.9397 14.94C22.3397 15.38 22.3597 17.37 20.9597 17.84Z" fill="#4F5D7F"/>
            </svg>
          </div>
          <div>
            <h5 class="c-card-payment__list-title">Personalized identifier</h5>
            <p class="c-card-payment__list-text">
              Personalize your handle to make it easier for people to find you!
            </p>
          </div>
        </li>
        <li class="c-card-payment__list-item">
          <div class="c-card-payment__list-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7499 2.45007C11.4399 1.86007 12.5699 1.86007 13.2699 2.45007L14.8499 3.81007C15.1499 4.07007 15.7099 4.28007 16.1099 4.28007H17.8099C18.8699 4.28007 19.7399 5.15007 19.7399 6.21007V7.91007C19.7399 8.30007 19.9499 8.87007 20.2099 9.17007L21.5699 10.7501C22.1599 11.4401 22.1599 12.5701 21.5699 13.2701L20.2099 14.8501C19.9499 15.1501 19.7399 15.7101 19.7399 16.1101V17.8101C19.7399 18.8701 18.8699 19.7401 17.8099 19.7401H16.1099C15.7199 19.7401 15.1499 19.9501 14.8499 20.2101L13.2699 21.5701C12.5799 22.1601 11.4499 22.1601 10.7499 21.5701L9.16988 20.2101C8.86988 19.9501 8.30988 19.7401 7.90988 19.7401H6.17988C5.11988 19.7401 4.24988 18.8701 4.24988 17.8101V16.1001C4.24988 15.7101 4.03988 15.1501 3.78988 14.8501L2.43988 13.2601C1.85988 12.5701 1.85988 11.4501 2.43988 10.7601L3.78988 9.17007C4.03988 8.87007 4.24988 8.31007 4.24988 7.92007V6.20007C4.24988 5.14007 5.11988 4.27007 6.17988 4.27007H7.90988C8.29988 4.27007 8.86988 4.06007 9.16988 3.80007L10.7499 2.45007Z" fill="#F4F4F4"/>
              <path d="M10.7499 2.45007C11.4399 1.86007 12.5699 1.86007 13.2699 2.45007L14.8499 3.81007C15.1499 4.07007 15.7099 4.28007 16.1099 4.28007H17.8099C18.8699 4.28007 19.7399 5.15007 19.7399 6.21007V7.91007C19.7399 8.30007 19.9499 8.87007 20.2099 9.17007L21.5699 10.7501C22.1599 11.4401 22.1599 12.5701 21.5699 13.2701L20.2099 14.8501C19.9499 15.1501 19.7399 15.7101 19.7399 16.1101V17.8101C19.7399 18.8701 18.8699 19.7401 17.8099 19.7401H16.1099C15.7199 19.7401 15.1499 19.9501 14.8499 20.2101L13.2699 21.5701C12.5799 22.1601 11.4499 22.1601 10.7499 21.5701L9.16988 20.2101C8.86988 19.9501 8.30988 19.7401 7.90988 19.7401H6.17988C5.11988 19.7401 4.24988 18.8701 4.24988 17.8101V16.1001C4.24988 15.7101 4.03988 15.1501 3.78988 14.8501L2.43988 13.2601C1.85988 12.5701 1.85988 11.4501 2.43988 10.7601L3.78988 9.17007C4.03988 8.87007 4.24988 8.31007 4.24988 7.92007V6.20007C4.24988 5.14007 5.11988 4.27007 6.17988 4.27007H7.90988C8.29988 4.27007 8.86988 4.06007 9.16988 3.80007L10.7499 2.45007Z" fill="#F4F4F4"/>
              <path d="M10.7901 15.17C10.5901 15.17 10.4001 15.09 10.2601 14.95L7.84006 12.53C7.55006 12.24 7.55006 11.76 7.84006 11.47C8.13006 11.18 8.61006 11.18 8.90006 11.47L10.7901 13.36L15.0901 9.06003C15.3801 8.77003 15.8601 8.77003 16.1501 9.06003C16.4401 9.35003 16.4401 9.83003 16.1501 10.12L11.3201 14.95C11.1801 15.09 10.9901 15.17 10.7901 15.17Z" fill="#4F5D7F"/>
            </svg>
          </div>
          <div>
            <h5 class="c-card-payment__list-title">Badge</h5>
            <p class="c-card-payment__list-text">
              Show off your Sograph subscription with a badge on your profile.
            </p>
          </div>
        </li>
        <li class="c-card-payment__list-item">
          <div class="c-card-payment__list-box c-soon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z" fill="#F4F4F4"/>
              <path d="M14.2602 12L12.7502 11.47V8.08H13.1102C13.9202 8.08 14.5802 8.79 14.5802 9.66C14.5802 10.07 14.9202 10.41 15.3302 10.41C15.7402 10.41 16.0802 10.07 16.0802 9.66C16.0802 7.96 14.7502 6.58 13.1102 6.58H12.7502V6C12.7502 5.59 12.4102 5.25 12.0002 5.25C11.5902 5.25 11.2502 5.59 11.2502 6V6.58H10.6002C9.12016 6.58 7.91016 7.83 7.91016 9.36C7.91016 11.15 8.95016 11.72 9.74016 12L11.2502 12.53V15.91H10.8902C10.0802 15.91 9.42016 15.2 9.42016 14.33C9.42016 13.92 9.08016 13.58 8.67016 13.58C8.26016 13.58 7.92016 13.92 7.92016 14.33C7.92016 16.03 9.25016 17.41 10.8902 17.41H11.2502V18C11.2502 18.41 11.5902 18.75 12.0002 18.75C12.4102 18.75 12.7502 18.41 12.7502 18V17.42H13.4002C14.8802 17.42 16.0902 16.17 16.0902 14.64C16.0802 12.84 15.0402 12.27 14.2602 12ZM10.2402 10.59C9.73016 10.41 9.42016 10.24 9.42016 9.37C9.42016 8.66 9.95016 8.09 10.6102 8.09H11.2602V10.95L10.2402 10.59ZM13.4002 15.92H12.7502V13.06L13.7602 13.41C14.2702 13.59 14.5802 13.76 14.5802 14.63C14.5802 15.34 14.0502 15.92 13.4002 15.92Z" fill="#4F5D7F"/>
            </svg>
          </div>
          <div>
            <h5 class="c-card-payment__list-title">No transaction fee</h5>
            <p class="c-card-payment__list-text">
              Engage seamlessly without needing to open your wallet for transaction confirmations.
            </p>
          </div>
        </li>
      </ul>
      <div class="c-card-payment__footer u-flex-line">
        <div class="c-card-payment__count u-flex-line">
          <button class="c-card-payment__count-button" @click="counterDuration('-')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <path fill-rule="evenodd" d="M0 12a1.5 1.5 0 0 1 1.5-1.5h21a1.5 1.5 0 0 1 0 3h-21A1.5 1.5 0 0 1 0 12" clip-rule="evenodd"></path>
            </svg>
          </button>
          <span class="c-card-payment__count-text">{{ duration }} year{{ duration == 1 ? "" : "s" }}</span>
          <button class="c-card-payment__count-button" @click="counterDuration('+')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <path fill-rule="evenodd" d="M13.5 1.5a1.5 1.5 0 0 0-3 0v9h-9a1.5 1.5 0 0 0 0 3h9v9a1.5 1.5 0 0 0 3 0v-9h9a1.5 1.5 0 0 0 0-3h-9z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        <button class="c-card-payment__pay" @click="subscription" type="button">
          Subscribe for {{ price }} Graph per {{ duration }} year{{ duration == 1 ? "" : "s" }}
        </button>
      </div>
    </div>
  </dialog>
  <div @click="modal.showModal()" class="sidebar__item">
    <icon iconClass="c-icon" name="star"/>
    <span class="sidebar__text">Subscription</span>
  </div>
</template>
<style>
.c-card-payment::backdrop {
  background-color: rgba(0, 0, 0, 0.9);
}
.c-card-payment {
  background-color: var(--bg-color-primary);
  border-radius: 16px;
  overflow: hidden;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(580px, 100%);
  z-index: 2;
  color: inherit;
  border: none;
  overflow-y: auto;
}
.c-card-payment::-webkit-scrollbar {
  width: 0;
}
.c-card-payment__content {
  padding-top: 40px;
  display: grid;
  gap: 56px;
  position: relative;
}
.c-card-payment__close {
  position: absolute;
  top: 20px;
  right: 20px;
}
.c-card-payment__header {
  padding-inline: 40px;
  display: grid;
  gap: 16px;
}
.c-card-payment__title {
  font-size: 2.1rem;
  font-weight: 600;
  line-height: 2.1rem;
  text-align: center;
}
.c-card-payment__subtitle {
  font-size: 1.5rem;
  color: var(--text-color-secondary);
  text-align: center;
}
.c-card-payment__list {
  display: grid;
  gap: 32px;
  padding-inline: 40px;
}
.c-card-payment__list-item {
  display: flex;
  gap: 24px;
}
.c-card-payment__list-box {
  background-color: var(--bg-color-secondary);
  height: 50px;
  width: 50px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.c-card-payment__list-box svg {
  height: 22px;
  width: 22px;
}
.c-card-payment__list-title {
  font-size: 1.5rem;
  line-height: 1.5rem;
  font-weight: 400;
}
.c-card-payment__list-text {
  font-size: 1.5rem;
  color: var(--text-color-tertiary);
  margin-top: 6px;
}

.c-card-payment__footer {
  background-color: var(--bg-color-secondary);
  padding-block: 32px;
  padding-inline: 40px;
  display: grid;
  gap: 32px;
}
.c-card-payment__pay {
  background-color: var(--bg-color-quaternary);
  border-radius: 12px;
  height: 48px;
  width: 100%;
  color: var(--text-color-quinary);
  font-size: 1.4rem;
  font-weight: 500;
}
.c-card-payment__count {
  border-radius: 12px;
  height: 48px;
  width: 100%;
  background-color: var(--bg-color-primary);
  padding-inline: 8px;
}
.c-card-payment__count-button {
  border-radius: 32px;
  display: grid;
  place-items: center;
}
.c-card-payment__count-button svg {
  transform: scale(0.55);
  fill: var(--text-color-primary);
}
.c-card-payment__count-text {
  flex-grow: 1;
  text-align: center;
  font-size: 1.4rem;
}
</style>
