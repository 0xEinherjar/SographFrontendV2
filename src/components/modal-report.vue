<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAccountStore } from "../store/account.js";
import { Icon } from "./";
import { abi, contract } from "../contracts/Voting.js";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
const props = defineProps(["account"]);
const accountStore = useAccountStore();
const { account } = storeToRefs(accountStore);
const active = ref(false);
const { writeContractAsync, data } = useWriteContract();
const reportType = ref([
  {
    code: 1,
    title: "Spam",
    description:
      "Report unwanted, repetitive, and unsolicited messages or content that may include advertisements, malicious links, or fraud attempts.",
  },
  {
    code: 2,
    title: "Violence Speech",
    description:
      "Report statements or content that incite, promote, or glorify violence against individuals or groups.",
  },
  {
    code: 3,
    title: "Child Abuse",
    description:
      "Report any content that exploits or abuses minors, including images, videos, or discussions of illicit or harmful activities.",
  },
  {
    code: 4,
    title: "Illegal Drugs",
    description:
      "Report any promotion, sale, or distribution of illegal substances, as well as discussions or content that encourage drug use.",
  },
  {
    code: 5,
    title: "Terrorism",
    description:
      "Report content that promotes, incites, or glorifies terrorist activities or organizations involved in acts of terrorism.",
  },
  {
    code: 6,
    title: "Other",
    description:
      "Use this option to report any other type of content that does not fall into the above categories but that you consider inappropriate or harmful.",
  },
]);

async function report(reason) {
  if (!account.value.isConnected) return;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "reportUser",
    args: [props.account, reason],
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    active.value = false;
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="dropdown__item u-flex-line" @click="active = true">
    <icon iconClass="c-icon--small" name="info"/>
    <span class="dropdown__item-text-grow">Report</span>
  </div>
  <teleport to="body">
    <div v-if="active" class="c-report--backdrop u-flex-line-center">
      <div class="c-report">
        <div class="c-report__header u-flex-line-between">
          <h3 class="c-report__title">Report Profile</h3>
          <button @click="active = false" type="button">
            <icon iconClass="c-icon" name="close"/>
          </button>
        </div>
        <div class="c-report__list">
          <button v-for="item in reportType" @click="report(item.code)" class="c-report__item" type="button">
            <span>{{ item.title }}</span>
            <div class="c-report__item-description">{{ item.description }}</div>
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
<style>
.c-report--backdrop {
  background-color: rgba(0, 0, 0, 0.9);
  position: fixed;
  inset: 0 0 0 0;
}

.c-report {
  width: min(520px, 100%);
  background-color: var(--bg-color-primary);
  overflow: hidden;
  border-radius: 16px;
  padding: 32px 24px;
  position: relative;
  display: grid;
  gap: 24px;
}
.c-report__header {
  padding-inline: 1.6rem;
}
.c-report__title {
  font-size: 2rem;
  font-weight: 500;
  line-height: 1;
}
.c-report__list {
  display: grid;
  max-height: 520px;
  overflow-y: auto;
}
.c-report__list::-webkit-scrollbar {
  width: 0;
}
.c-report__item {
  text-align: left;
  line-height: 140%;
  padding: 01.2rem 1.6rem;
  border-radius: 12px;
  display: grid;
  gap: 8px;
  transition: background 120ms ease-in;
}
.c-report__item:hover {
  background-color: var(--bg-color-secondary);
}
.c-report__item-description {
  font-size: 1.5rem;
  color: var(--text-color-secondary);
}
</style>
