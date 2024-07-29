<script setup>
import { onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import Avatar from "../components/avatar.vue";
import CreateProposal from "../components/create-proposal.vue";
import CardAssessment from "../components/card-assessment.vue";
import { useModeratorStore } from "../store/moderator.js";
import { useMetamask } from "../composables/metamask.js";
import Vote from "../infra/vote.js";
import Token from "../infra/token.js";

const moderatorStore = useModeratorStore();
const { moderator } = storeToRefs(moderatorStore);
const { connect } = useMetamask();
const select = ref("Stake");
const filter = ref("All");
const amountVote = ref();
const valueMinParticipation = ref(0);
const participant = ref({
  isActive: false,
  balance: 0,
  amountToken: 0,
});
const stats = ref({
  banned: 0,
  reestablished: 0,
  total: 0,
});
const assessment = ref([]);
function panelSelect(param) {
  select.value = param;
}
async function handleConnect() {
  const address = await connect();
  if (!address) return;
  moderatorStore.setWallet(address);
  moderatorStore.setConnected();
  await getParticipant();
  await balanceOfParticipant();
}
function filterAssessment(param) {
  filter.value = param;
}
async function handleAction() {
  if (!amountVote.value) return;
  const vote = new Vote();
  const token = new Token();
  const { data: decimals } = await token.decimals();
  const amount = amountVote.value * 10 ** decimals;
  if (select.value == "Stake") {
    if (amountVote.value < valueMinParticipation.value) return;
    await token.approve({ address: Vote.address, amount: amount });
    const { success } = await vote.stake({ amount: amount });
    if (success) {
      await getParticipant();
      await balanceOfParticipant();
    }
  } else {
    const { success } = await vote.withdraw({ amount: amount });
    if (success) {
      await getParticipant();
      await balanceOfParticipant();
    }
  }
}
function max() {
  if (select.value == "Stake") {
    amountVote.value = participant.value.amountToken;
  } else {
    amountVote.value = participant.value.balance;
  }
}
async function getParticipant() {
  const vote = new Vote();
  const { data, success } = await vote.getParticipant();
  const token = new Token();
  const tokenResult = await token.decimals();
  if (success) {
    participant.value.balance = data.balance / 10 ** tokenResult.data;
    participant.value.isActive = data.isActive;
  }
}
async function balanceOfParticipant() {
  const token = new Token();
  const tokenResult = await token.balanceOfParticipant();
  if (tokenResult.success) {
    participant.value.amountToken = tokenResult.data;
  }
}
async function minParticipation() {
  const vote = new Vote();
  const resultVote = await vote.getMinParticipation();
  const token = new Token();
  const resultToken = await token.decimals();
  valueMinParticipation.value = resultVote.data / 10 ** resultToken.data;
}
onBeforeMount(async () => {
  if (moderator.value.isConnected) {
    await getParticipant();
    await balanceOfParticipant();
  }
  await minParticipation();
  const vote = new Vote();
  const { success, data } = await vote.getAssessments();
  if (success) {
    for (const item of data) {
      assessment.value.push({
        id: item.id,
        voteEnd: item.voteEnd,
        voteStart: item.voteStart,
        reason: item.reason,
        proposer: item.proposer,
        profile: item.profile,
        executed: item.executed,
        state: item.state,
        profileAvatar: item.profileAvatar,
        profileName: item.profileName,
        profileHandle: item.profileHandle,
      });
      if (item.executed) {
        if (item.state == 4) stats.value.banned += 1;
        if (item.state == 5) stats.value.reestablished += 1;
      }
    }
    stats.value.total = data.length;
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="assessment">
    <header class="header u-flex-line">
      <router-link to="/" class="header__logo">
        <svg width="87" height="21" viewBox="0 0 87 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.93395 4.22088C8.8544 3.51491 8.52628 2.96804 7.94957 2.58026C7.37287 2.1875 6.64702 1.99112 5.77202 1.99112C5.1456 1.99112 4.60369 2.09055 4.14631 2.28942C3.68892 2.48331 3.33345 2.75178 3.0799 3.09482C2.83132 3.43288 2.70703 3.81818 2.70703 4.25071C2.70703 4.61364 2.79155 4.92685 2.96058 5.19034C3.13459 5.45384 3.3608 5.67507 3.6392 5.85405C3.92259 6.02805 4.22585 6.17472 4.54901 6.29403C4.87216 6.40838 5.18288 6.50284 5.48118 6.57742L6.97266 6.9652C7.45987 7.08452 7.95952 7.24609 8.47159 7.44993C8.98367 7.65376 9.45845 7.92223 9.89595 8.25533C10.3335 8.58842 10.6864 9.00107 10.9549 9.49325C11.2283 9.98544 11.3651 10.5746 11.3651 11.2607C11.3651 12.1257 11.1413 12.8938 10.6939 13.565C10.2514 14.2362 9.6076 14.7656 8.76243 15.1534C7.92223 15.5412 6.90554 15.7351 5.71236 15.7351C4.56889 15.7351 3.57955 15.5536 2.74432 15.1907C1.90909 14.8278 1.25533 14.3132 0.783026 13.647C0.310724 12.9759 0.0497159 12.1804 0 11.2607H2.31179C2.35653 11.8125 2.53551 12.2724 2.84872 12.6403C3.1669 13.0032 3.57209 13.2741 4.06428 13.4531C4.56143 13.6271 5.10582 13.7141 5.69744 13.7141C6.34872 13.7141 6.92791 13.6122 7.43501 13.4084C7.94709 13.1996 8.34979 12.9112 8.64311 12.5433C8.93643 12.1705 9.0831 11.7354 9.0831 11.2383C9.0831 10.7859 8.95384 10.4155 8.69531 10.1271C8.44176 9.83878 8.09624 9.60014 7.65874 9.41122C7.22621 9.2223 6.73651 9.05575 6.18963 8.91158L4.38494 8.41939C3.16193 8.08629 2.19247 7.59659 1.47656 6.95028C0.765625 6.30398 0.410156 5.44886 0.410156 4.38494C0.410156 3.50497 0.648793 2.73686 1.12607 2.08061C1.60334 1.42436 2.24965 0.914773 3.06499 0.551847C3.88033 0.183949 4.80007 0 5.82422 0C6.85831 0 7.7706 0.181463 8.56108 0.54439C9.35653 0.907316 9.98295 1.40696 10.4403 2.04332C10.8977 2.67472 11.1364 3.40057 11.1562 4.22088H8.93395Z" fill="white"/>
          <path d="M18.7646 15.7127C17.6908 15.7127 16.7536 15.4666 15.9532 14.9744C15.1528 14.4822 14.5313 13.7937 14.0889 12.9087C13.6464 12.0238 13.4252 10.9897 13.4252 9.80646C13.4252 8.61825 13.6464 7.57919 14.0889 6.68928C14.5313 5.79936 15.1528 5.10831 15.9532 4.61612C16.7536 4.12394 17.6908 3.87784 18.7646 3.87784C19.8385 3.87784 20.7757 4.12394 21.5761 4.61612C22.3765 5.10831 22.998 5.79936 23.4404 6.68928C23.8829 7.57919 24.1041 8.61825 24.1041 9.80646C24.1041 10.9897 23.8829 12.0238 23.4404 12.9087C22.998 13.7937 22.3765 14.4822 21.5761 14.9744C20.7757 15.4666 19.8385 15.7127 18.7646 15.7127ZM18.7721 13.8409C19.4681 13.8409 20.0448 13.657 20.5022 13.2891C20.9596 12.9212 21.2977 12.4315 21.5164 11.82C21.7401 11.2085 21.852 10.5348 21.852 9.79901C21.852 9.06818 21.7401 8.39702 21.5164 7.78551C21.2977 7.16903 20.9596 6.67436 20.5022 6.30149C20.0448 5.92862 19.4681 5.74219 18.7721 5.74219C18.0711 5.74219 17.4894 5.92862 17.0271 6.30149C16.5697 6.67436 16.2291 7.16903 16.0054 7.78551C15.7867 8.39702 15.6773 9.06818 15.6773 9.79901C15.6773 10.5348 15.7867 11.2085 16.0054 11.82C16.2291 12.4315 16.5697 12.9212 17.0271 13.2891C17.4894 13.657 18.0711 13.8409 18.7721 13.8409Z" fill="white"/>
          <path d="M31.3956 20.0156C30.4858 20.0156 29.7028 19.8963 29.0465 19.6577C28.3952 19.419 27.8633 19.1033 27.4506 18.7106C27.038 18.3178 26.7298 17.8878 26.5259 17.4205L28.4425 16.63C28.5767 16.8487 28.7557 17.0799 28.9794 17.3235C29.2081 17.5721 29.5163 17.7834 29.9041 17.9574C30.2969 18.1314 30.8015 18.2184 31.418 18.2184C32.2631 18.2184 32.9616 18.0121 33.5135 17.5994C34.0653 17.1918 34.3413 16.5405 34.3413 15.6456V13.3935H34.1996C34.0653 13.6371 33.8714 13.908 33.6179 14.2063C33.3693 14.5046 33.0263 14.7631 32.5888 14.9819C32.1513 15.2006 31.582 15.31 30.881 15.31C29.9762 15.31 29.1609 15.0987 28.435 14.6761C27.7141 14.2486 27.1424 13.6197 26.7198 12.7894C26.3022 11.9542 26.0934 10.9276 26.0934 9.70952C26.0934 8.49148 26.2997 7.44744 26.7124 6.57742C27.13 5.70739 27.7017 5.04119 28.4276 4.57884C29.1534 4.11151 29.9762 3.87784 30.896 3.87784C31.6069 3.87784 32.1811 3.99716 32.6186 4.2358C33.0561 4.46946 33.3967 4.7429 33.6403 5.05611C33.8888 5.36932 34.0803 5.64524 34.2145 5.88388H34.3786V4.02699H36.5636V15.7351C36.5636 16.7195 36.3349 17.5273 35.8775 18.1587C35.4201 18.7901 34.8011 19.2575 34.0206 19.5607C33.245 19.864 32.37 20.0156 31.3956 20.0156ZM31.3732 13.4606C32.0146 13.4606 32.5565 13.3114 32.9989 13.0131C33.4464 12.7099 33.7844 12.2773 34.0131 11.7156C34.2468 11.1488 34.3636 10.4702 34.3636 9.67969C34.3636 8.90909 34.2493 8.23047 34.0206 7.64382C33.7919 7.05717 33.4563 6.59979 33.0139 6.27166C32.5714 5.93857 32.0245 5.77202 31.3732 5.77202C30.7021 5.77202 30.1428 5.94602 29.6953 6.29403C29.2479 6.63707 28.9098 7.1044 28.6811 7.69602C28.4574 8.28764 28.3455 8.94886 28.3455 9.67969C28.3455 10.4304 28.4599 11.0891 28.6886 11.6559C28.9173 12.2227 29.2553 12.6651 29.7028 12.9833C30.1552 13.3015 30.712 13.4606 31.3732 13.4606Z" fill="white"/>
          <path d="M39.554 15.4815V4.02699H41.7092V5.84659H41.8285C42.0373 5.23011 42.4052 4.74538 42.9322 4.3924C43.4641 4.03445 44.0657 3.85547 44.7369 3.85547C44.8761 3.85547 45.0401 3.86044 45.229 3.87038C45.4229 3.88033 45.5746 3.89276 45.6839 3.90767V6.04048C45.5945 6.01563 45.4354 5.98828 45.2067 5.95845C44.978 5.92365 44.7493 5.90625 44.5206 5.90625C43.9936 5.90625 43.5238 6.01811 43.1111 6.24183C42.7035 6.46058 42.3803 6.76634 42.1417 7.15909C41.9031 7.54688 41.7837 7.98935 41.7837 8.48651V15.4815H39.554Z" fill="white"/>
          <path d="M50.8445 15.7351C50.1186 15.7351 49.4624 15.6009 48.8757 15.3324C48.2891 15.0589 47.8242 14.6637 47.4812 14.1467C47.1431 13.6296 46.9741 12.9957 46.9741 12.245C46.9741 11.5987 47.0984 11.0668 47.3469 10.6491C47.5955 10.2315 47.9311 9.90092 48.3537 9.65732C48.7763 9.41371 49.2486 9.22976 49.7706 9.10547C50.2926 8.98118 50.8246 8.88672 51.3665 8.82209C52.0526 8.74254 52.6094 8.67791 53.0369 8.6282C53.4645 8.57351 53.7752 8.48651 53.9691 8.36719C54.163 8.24787 54.2599 8.05398 54.2599 7.78551V7.73331C54.2599 7.08203 54.076 6.57742 53.7081 6.21946C53.3452 5.86151 52.8033 5.68253 52.0824 5.68253C51.3317 5.68253 50.7401 5.84908 50.3075 6.18217C49.88 6.5103 49.5842 6.87571 49.4201 7.27841L47.3246 6.80114C47.5732 6.10511 47.9361 5.54332 48.4134 5.11577C48.8956 4.68324 49.4499 4.37003 50.0764 4.17614C50.7028 3.97727 51.3615 3.87784 52.0526 3.87784C52.5099 3.87784 52.9947 3.93253 53.5067 4.0419C54.0238 4.14631 54.506 4.3402 54.9535 4.62358C55.4059 4.90696 55.7763 5.31215 56.0646 5.83913C56.353 6.36115 56.4972 7.03977 56.4972 7.875V15.4815H54.3196V13.9155H54.2301C54.0859 14.2038 53.8697 14.4872 53.5813 14.7656C53.293 15.044 52.9226 15.2752 52.4702 15.4592C52.0178 15.6431 51.4759 15.7351 50.8445 15.7351ZM51.3292 13.9453C51.9457 13.9453 52.4727 13.8235 52.9102 13.5799C53.3526 13.3363 53.6882 13.0181 53.9169 12.6254C54.1506 12.2276 54.2674 11.8026 54.2674 11.3501V9.87358C54.1879 9.95313 54.0337 10.0277 53.805 10.0973C53.5813 10.1619 53.3253 10.2191 53.0369 10.2688C52.7486 10.3136 52.4677 10.3558 52.1942 10.3956C51.9208 10.4304 51.6921 10.4602 51.5082 10.4851C51.0756 10.5398 50.6804 10.6317 50.3224 10.761C49.9695 10.8903 49.6861 11.0767 49.4723 11.3203C49.2635 11.5589 49.1591 11.8771 49.1591 12.2749C49.1591 12.8267 49.3629 13.2443 49.7706 13.5277C50.1783 13.8061 50.6978 13.9453 51.3292 13.9453Z" fill="white"/>
          <path d="M59.4671 19.777V4.02699H61.6446V5.88388H61.8311C61.9603 5.64524 62.1468 5.36932 62.3904 5.05611C62.634 4.7429 62.972 4.46946 63.4046 4.2358C63.8371 3.99716 64.4088 3.87784 65.1198 3.87784C66.0445 3.87784 66.8698 4.11151 67.5956 4.57884C68.3215 5.04617 68.8907 5.71982 69.3034 6.59979C69.721 7.47976 69.9298 8.53871 69.9298 9.77663C69.9298 11.0146 69.7235 12.076 69.3108 12.9609C68.8982 13.8409 68.3314 14.5195 67.6105 14.9968C66.8896 15.4691 66.0669 15.7053 65.1421 15.7053C64.4461 15.7053 63.8769 15.5884 63.4344 15.3548C62.9969 15.1211 62.6539 14.8477 62.4053 14.5344C62.1567 14.2212 61.9653 13.9428 61.8311 13.6992H61.6968V19.777H59.4671ZM61.6521 9.75426C61.6521 10.5597 61.7689 11.2656 62.0026 11.8722C62.2362 12.4787 62.5743 12.9535 63.0168 13.2965C63.4593 13.6346 64.0012 13.8036 64.6425 13.8036C65.3087 13.8036 65.8655 13.6271 66.3129 13.2741C66.7604 12.9162 67.0985 12.4315 67.3271 11.82C67.5608 11.2085 67.6776 10.5199 67.6776 9.75426C67.6776 8.99858 67.5633 8.31996 67.3346 7.7184C67.1109 7.11683 66.7728 6.64205 66.3204 6.29403C65.873 5.94602 65.3137 5.77202 64.6425 5.77202C63.9962 5.77202 63.4493 5.93857 63.0019 6.27166C62.5594 6.60476 62.2238 7.0696 61.9951 7.66619C61.7664 8.26278 61.6521 8.95881 61.6521 9.75426Z" fill="white"/>
          <path d="M74.6578 8.6804V15.4815H72.428V0.208807H74.6279V5.89134H74.7696C75.0381 5.27486 75.4482 4.78516 76.0001 4.42223C76.5519 4.0593 77.2728 3.87784 78.1627 3.87784C78.9482 3.87784 79.6343 4.03942 80.221 4.36257C80.8126 4.68572 81.27 5.16797 81.5931 5.8093C81.9213 6.44567 82.0853 7.24112 82.0853 8.19567V15.4815H79.8556V8.46413C79.8556 7.62394 79.6393 6.97266 79.2068 6.5103C78.7742 6.04297 78.1727 5.8093 77.4021 5.8093C76.8751 5.8093 76.4028 5.92117 75.9852 6.14489C75.5725 6.36861 75.2469 6.69673 75.0083 7.12926C74.7746 7.55682 74.6578 8.07386 74.6578 8.6804Z" fill="white"/>
          <path d="M83.9261 16.9815C83.9261 16.1531 84.5977 15.4815 85.4261 15.4815C86.2546 15.4815 86.9261 16.1531 86.9261 16.9815C86.9261 17.81 86.2546 18.4815 85.4261 18.4815C84.5977 18.4815 83.9261 17.81 83.9261 16.9815Z" fill="#0177FB"/>
        </svg>
      </router-link>
      <div class="header__right">
        <button @click="handleConnect" v-if="!moderator.isConnected" type="button" class="header__button u-flex-line u-flex-line-center">Connect</button>
        <CreateProposal v-if="moderator.isConnected && participant.isActive"/>
        <div v-if="moderator.isConnected" class="header__dropdown u-flex-line">
          <button class="header__user u-flex-line" type="button">
            <avatar length="40px"/>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5999 7.45825L11.1666 12.8916C10.5249 13.5333 9.4749 13.5333 8.83324 12.8916L3.3999 7.45825" stroke="#F4F4F4" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="header__submenu header__submenu--vote">
            <ul class="header__submenu-list">
              <li class="header__submenu-item">
                <button @click="moderatorStore.resetModerator()" type="button">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
    <div class="assessment__header">
      <div class="assessment__header-title">Ban Proposals</div>
      <!-- <div class="assessment__header-filter">
        <div class="assessment__header-filter-placeholder">
          {{ filter }}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.6101 9.92251L8.76756 6.13501H4.56006C3.84006 6.13501 3.48006 7.00501 3.99006 7.51501L7.87506 11.4C8.49756 12.0225 9.51006 12.0225 10.1326 11.4L11.6101 9.92251Z" fill="#BDC1C6"/>
            <path d="M13.4401 6.13501H8.76758L11.6101 9.92251L14.0176 7.51501C14.5201 7.00501 14.1601 6.13501 13.4401 6.13501Z" fill="#BDC1C6"/>
          </svg>
        </div>
        <div class="assessment__header-filter-group">
          <div class="assessment__header-filter-option" @click="filterAssessment('All')">All</div>
          <div class="assessment__header-filter-option" @click="filterAssessment('Active')">Active</div>
          <div class="assessment__header-filter-option" @click="filterAssessment('Ending')">Ending</div>
          <div class="assessment__header-filter-option" @click="filterAssessment('Pending')">Pending</div>
        </div>
      </div> -->
    </div>
    <div class="assessment__content">
      <aside class="assessment__aside">
        <div v-if="moderator.isConnected" class="assessment__panel">
          <div class="assessment__panel-header">
            <div class="assessment__panel-text assessment__panel-text--fluid">Account balance</div>
            <div class="assessment__panel-text">
              {{ participant.balance }}
              <span class="assessment__panel-text-secondary">Graph</span>
            </div>
          </div>
          <div class="assessment__panel-select">
            <div class="assessment__panel-select-placeholder">
              {{ select }}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6101 9.92251L8.76755 6.13501H4.56006C3.84006 6.13501 3.48006 7.00501 3.99006 7.51501L7.87506 11.4C8.49756 12.0225 9.51006 12.0225 10.1326 11.4L11.6101 9.92251Z" fill="#BDC1C6"/>
                <path d="M13.4401 6.13501H8.76758L11.6101 9.92251L14.0176 7.51501C14.5201 7.00501 14.1601 6.13501 13.4401 6.13501Z" fill="#BDC1C6"/>
              </svg>
            </div>
            <div class="assessment__panel-select-options">
              <div class="assessment__panel-select-option" @click="panelSelect('Stake')">Stake</div>
              <div class="assessment__panel-select-option" @click="panelSelect('Withdraw')">Withdraw</div>
            </div>
          </div>
          <div class="assessment__panel-field">
            <input v-if="select=='Stake'" class="assessment__panel-field-input" type="text" v-model="amountVote" :placeholder="`Minimum of ${valueMinParticipation} Graph`">
            <input v-else class="assessment__panel-field-input" type="text" v-model="amountVote" name="" id="" placeholder="0">
            <button class="assessment__panel-field-button" type="button" @click="max">Max</button>
          </div>
          <button @click="handleAction" class="assessment__panel-button assessment__panel-button-primary" type="button">Confirm</button>
          <span class="assessment__panel-line"></span>
          <button class="assessment__panel-button assessment__panel-button-primary c-soon" type="button">Claim Rewards</button>
          <button v-if="participant.isActive" class="assessment__panel-button assessment__panel-button-active" type="button">Active</button>
          <button v-else class="assessment__panel-button assessment__panel-button-no-active" type="button">No active</button>
        </div>
        <div class="assessment__stats">
          <div class="assessment__stats-row">
            Total proposals: <span>{{ stats.total }}</span>
          </div>
          <div class="assessment__stats-row">
            Total bans: <span>{{ stats.banned }}</span>
          </div>
          <div class="assessment__stats-row">
            Total reestablish: <span>{{ stats.reestablished }}</span>
          </div>
        </div>
      </aside>
      <div class="assessment__list">
        <template v-for="item of assessment">
          <card-assessment 
            :reason="item.reason" 
            :proposer="item.proposer"
            :profile="item.profile"
            :executed="item.executed"
            :state="item.state"
            :id="item.id"
            :voteEnd="item.voteEnd"
            :voteStart="item.voteStart"
            :profileAvatar="item.profileAvatar"
            :profileName="item.profileName"
            :profileHandle="item.profileHandle"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<style>
.assessment {
  grid-column: sidebar-start / main-end;
  padding-inline: 4rem;
}
.header__submenu--vote {
  top: 39px;
}
.assessment__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block: 22px 48px;
}
.assessment__header-title {
  font-size: 2.4rem;
  font-weight: 500;
}
.assessment__header-filter {
  font-size: 1.5rem;
  font-weight: 500;
  position: relative;
}
.assessment__header-filter-group {
  overflow: hidden;
  border-radius: 12px;
  position: absolute;
  top: 100%;
  min-width: 100%;
  right: 0;
  background-color: #4e4f51;
  display: none;
}
.assessment__header-filter:hover .assessment__header-filter-group {
  display: block;
}
.assessment__header-filter-option {
  height: 48px;
  line-height: 48px;
  padding-inline: 16px;
}
.assessment__header-filter-option:hover {
  background-color: #bdc1c6;
  color: #28292b;
  font-weight: 500;
}
.assessment__header-filter-placeholder {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 160px;
  gap: 16px;
  padding-inline: 16px;
  border-radius: 12px;
  height: 48px;
  border: 1px solid #f4f4f4;
}
.assessment__content {
  display: flex;
  gap: 48px;
  margin-bottom: 40px;
  align-items: flex-start;
}
.assessment__panel-select {
  cursor: pointer;
  position: relative;
}
.assessment__panel-select-options {
  position: absolute;
  top: 100%;
  width: 100%;
  right: 0;
  background-color: #4e4f51;
  border-radius: 12px;
  overflow: hidden;
  display: none;
}
.assessment__panel-select:hover .assessment__panel-select-options {
  display: block;
}
.assessment__panel-select-option {
  padding-inline: 16px;
  height: 48px;
  line-height: 48px;
}
.assessment__panel-select-option:hover {
  background-color: #bdc1c6;
  color: #28292b;
  font-weight: 500;
}
.assessment__panel-select-placeholder {
  height: 48px;
  border-radius: 12px;
  background-color: #4e4f51;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-inline: 16px;
  font-size: 1.5rem;
  font-weight: 500;
}
.assessment__panel-button {
  height: 48px;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 600;
}
.assessment__panel-button-primary {
  background-color: #f4f4f4;
  color: #28292b;
}
.assessment__panel-button-primary.c-soon::before {
  top: 10px;
  right: 29%;
}
.assessment__panel-line {
  height: 1px;
  background-color: #f4f4f4;
  opacity: 0.6;
}
.assessment__panel-button-no-active {
  background-color: rgba(255, 99, 112, 0.2);
  color: #f4f4f4;
  font-weight: 500;
}
.assessment__panel-button-active {
  background-color: rgba(1, 119, 251, 0.2);
  color: #f4f4f4;
  font-weight: 500;
}
.assessment__aside {
  flex-shrink: 0;
  display: grid;
  gap: 48px;
}
.assessment__stats {
  background-color: #28292b;
  display: grid;
  padding: 24px;
  width: 400px;
  border-radius: 12px;
  gap: 16px;
}
.assessment__stats-row {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  gap: 4px;
}
.assessment__stats-row span {
  color: #e8eaed;
  opacity: 0.6;
}
.assessment__panel {
  background-color: #28292b;
  display: grid;
  gap: 40px;
  padding: 24px;
  width: 400px;
  border-radius: 12px;
}
.assessment__panel-header {
  display: flex;
  align-items: center;
  gap: 16px;
}
.assessment__panel-icon {
  border-radius: 12px;
  height: 48px;
  width: 48px;
  background-color: #f4f4f4;
}
.assessment__panel-text {
  font-size: 1.5rem;
  color: #f4f4f4;
}
.assessment__panel-text-secondary {
  text-transform: uppercase;
  color: #e8eaed;
  opacity: 0.6;
}
.assessment__panel-text--fluid {
  flex-grow: 1;
}
.assessment__panel-field {
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid #f4f4f4;
}
.assessment__panel-field-input {
  flex-grow: 1;
  height: 100%;
}
.assessment__list {
  display: grid;
  gap: 48px;
  width: 100%;
}
</style>
