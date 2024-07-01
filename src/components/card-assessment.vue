<script setup>
import Avatar from "./avatar.vue";
import Vote from "../infra/vote.js";
import { useUtils } from "../composables/utils.js";
import { onMounted, ref } from "vue";
import { useModeratorStore } from "../store/moderator.js";
import { storeToRefs } from "pinia";

const {
  reason,
  proposer,
  profile,
  executed,
  state,
  id,
  voteEnd,
  voteStart,
  profileAvatar,
  profileName,
  profileHandle,
} = defineProps([
  "reason",
  "proposer",
  "profile",
  "executed",
  "state",
  "id",
  "voteEnd",
  "voteStart",
  "profileAvatar",
  "profileName",
  "profileHandle",
]);

const { isAddress, truncateAddress, copyContent } = useUtils();
const moderatorStore = useModeratorStore();
const { moderator } = storeToRefs(moderatorStore);
const executedAssessment = ref(null);

function selectVote(event) {
  document
    .querySelectorAll(".assessment__card-vote-option")
    .forEach((target) => {
      target.classList.remove("is-active");
    });
  event.target.classList.add("is-active");
}

function formatDateCard() {
  const voteStartDate = voteStart * 1000;
  const voteEndDate = voteEnd * 1000;
  const now = Date.now();
  let p = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "numeric",
    hour12: true,
  })
    .formatToParts(voteEndDate)
    .reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
  if (voteStartDate > now) {
    return `Start at ${p.month}/${p.day}/${p.year}, ${p.hour}:${p.minute} ${p.dayPeriod}`;
  } else if (voteEndDate > now) {
    return `End at ${p.month}/${p.day}/${p.year}, ${p.hour}:${p.minute} ${p.dayPeriod}`;
  } else {
    return `Finish at ${p.month}/${p.day}/${p.year}, ${p.hour}:${p.minute} ${p.dayPeriod}`;
  }
}

function verifyPeriod() {
  const voteStartDate = voteStart * 1000;
  const voteEndDate = voteEnd * 1000;
  const now = Date.now();
  if (voteStartDate > now) {
    return 1;
  } else if (voteEndDate > now) {
    return 2;
  } else {
    return 3;
  }
}

async function vote() {
  let voteTarget = 0;
  document
    .querySelectorAll(".assessment__card-vote-option")
    .forEach((target) => {
      if (target.classList.contains("is-active")) {
        const voteText = target.innerText;
        if (voteText == "For") voteTarget = 1;
        if (voteText == "Against") voteTarget = 2;
        if (voteText == "Abstain") voteTarget = 3;
      }
    });
  if (voteTarget != 0) {
    const vote = new Vote();
    await vote.vote({ id: id, option: voteTarget });
  }
}

async function execute(id) {
  const vote = new Vote();
  const { success } = await vote.executeAssessment({ id: id });
  if (success) executedAssessment.value = true;
}
onMounted(() => {
  executedAssessment.value = executed;
});
</script>
<!-- prettier-ignore -->
<template>
<div class="assessment__card">
  <header class="assessment__card-header">
    <avatar :avatar="profileAvatar" length="52px"/>
    <div v-if="isAddress(profileName)" class="assessment__card-name assessment__card-name--address">
      {{ truncateAddress(profileName) }}
      <button type="button" @click="copyContent(profileName)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="#F4F4F4"/>
          <path opacity="0.4" d="M17.1 2H12.9C9.45001 2 8.05001 3.37 8.01001 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V15.99C20.63 15.95 22 14.55 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="#F4F4F4"/>
        </svg>
      </button>
    </div>
    <div v-else class="assessment__card-name">{{ profileName }}</div>
    <router-link v-if="state != 4" :to="`/user/${profileHandle || profile}`" class="assessment__card-button assessment__card-button--default" type="button">View</router-link>
    <button v-if="state == 2" class="assessment__card-button assessment__card-button--active" type="button">Active</button>
    <button v-if="state == 1" class="assessment__card-button assessment__card-button--pending" type="button">Pending</button>
    <button v-if="state == 5" class="assessment__card-button assessment__card-button--reestablished" type="button">Reestablished</button>
    <button v-if="state == 4" class="assessment__card-button assessment__card-button--banned" type="button">Banned</button>
  </header>
  <div class="assessment__card-content">
    <h5 class="">Reason</h5>
    <p class="assessment__card-paragraph">{{ reason }}</p>
  </div>
  <div class="assessment__card-info">
    <div class="assessment__card-info-group">
      <span class="assessment__card-info-dot" :class="`assessment__card-info-dot-${verifyPeriod()}`"></span>
      {{ formatDateCard() }}
    </div>
    <div class="assessment__card-info-group">
      <span class="assessment__card-info-text-secondary">Proposer:</span>
      <span>{{ truncateAddress(proposer) }}</span>
    </div>
  </div>
  <template v-if="moderator.isConnected">
    <div v-if="state == 2" class="assessment__card-vote">
      <div class="assessment__card-vote-group">
        <button @click="selectVote" class="assessment__card-vote-option" type="button">For</button>
        <button @click="selectVote" class="assessment__card-vote-option" type="button">Against</button>
        <button @click="selectVote" class="assessment__card-vote-option" type="button">Abstain</button>
      </div>
      <button @click="vote" class="assessment__card-vote-action" type="button">Vote</button>
    </div>
    <button v-if="state != 2 && state != 1 && !executedAssessment" @click="execute(id)" class="assessment__card-button-execute">Execute</button>
  </template>
  <template v-else>
    <div v-if="state == 2" class="assessment__card-vote">
      <div class="assessment__card-vote-group">
        <button class="assessment__card-vote-option" type="button">For</button>
        <button class="assessment__card-vote-option" type="button">Against</button>
        <button class="assessment__card-vote-option" type="button">Abstain</button>
      </div>
      <button class="assessment__card-vote-action" type="button">Vote</button>
    </div>
    <button v-if="state != 2 && state != 1 && !executedAssessment" class="assessment__card-button-execute">Execute</button>
  </template>
</div>
</template>
<style>
.assessment__card-button-execute {
  height: 48px;
  border-radius: 12px;
  background-color: #f4f4f4;
  color: #28292b;
  width: 100%;
  font-size: 1.5rem;
  font-weight: 500;
}
.assessment__card {
  padding: 4.8rem;
  border-radius: 12px;
  border: 1px solid #f4f4f4;
  display: grid;
  gap: 48px;
}
.assessment__card-header {
  display: flex;
  align-items: center;
  gap: 2.4rem;
}
.assessment__card-name {
  font-size: 2.4rem;
  font-weight: 500;
  flex-grow: 1;
}
.assessment__card-name--address {
  display: flex;
  align-items: center;
  gap: 12px;
}
.assessment__card-button {
  height: 32px;
  padding-inline: 16px;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.assessment__card-button--default {
  background-color: #f4f4f4;
  color: var(--bg-color-primary);
}
.assessment__card-button--active {
  background-color: var(--color-green);
  color: var(--text-color-primary);
}
.assessment__card-button--reestablished {
  background-color: var(--color-blue);
  color: var(--text-color-primary);
}
.assessment__card-button--pending {
  background-color: var(--color-yellow);
  color: var(--bg-color-primary);
}
.assessment__card-button--banned {
  background-color: var(--color-red);
  color: var(--text-color-primary);
}
.assessment__card-content {
  display: grid;
  gap: 10px;
}
.assessment__card-paragraph {
  color: var(--text-color-secondary);
}
.assessment__card-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.4rem;
  font-weight: 500;
}
.assessment__card-info-dot {
  height: 8px;
  width: 8px;
  border-radius: 50%;
}
.assessment__card-info-dot-1 {
  background-color: var(--color-yellow);
}
.assessment__card-info-dot-2 {
  background-color: var(--color-green);
}
.assessment__card-info-dot-3 {
  background-color: var(--color-red);
}
.assessment__card-info-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.assessment__card-info-text-secondary {
  color: #bdc1c6;
}
.assessment__card-vote {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.assessment__card-vote-group {
  display: flex;
  align-items: center;
  gap: 16px;
}
.assessment__card-vote-option,
.assessment__card-vote-action {
  height: 32px;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 500;
  padding-inline: 16px;
}
.assessment__card-vote-option {
  border: 1px solid #f4f4f4;
}
.assessment__card-vote-option.is-active,
.assessment__card-vote-action {
  background-color: #f4f4f4;
  color: #28292b;
}
</style>
