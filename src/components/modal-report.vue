<script setup>
import { ref } from "vue";
const active = ref(false);
</script>
<!-- prettier-ignore -->
<template>
  <div class="dropdown__item" @click="active = true">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#f4f4f4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path opacity="0.34" d="M12 8V13" stroke="#f4f4f4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path opacity="0.34" d="M11.9941 16H12.0031" stroke="#f4f4f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="dropdown__item-text-grow">Report</span>
  </div>
  <teleport to="body">
    <div v-if="active" class="c-report--backdrop u-flex-line-center">
      <div class="c-report">
        <div class="c-report__header u-flex-line-between">
          <h3 class="c-report__title c-soon">Report Profile</h3>
          <button @click="active = false" type="button">
            <svg class="c-icon--outline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.4">
                <path d="M9.16992 14.8299L14.8299 9.16992" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.8299 14.8299L9.16992 9.16992" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="c-report__list">
          <button class="c-report__item" type="button">
            <span>Spam</span>
            <div class="c-report__item-description">Report unwanted, repetitive, and unsolicited messages or content that may include advertisements, malicious links, or fraud attempts.</div>
          </button>
          <button class="c-report__item" type="button">
            <span>Violence Speech</span>
            <div class="c-report__item-description">Report statements or content that incite, promote, or glorify violence against individuals or groups.</div>
          </button>
          <button class="c-report__item" type="button">
            <span>Child Abuse</span>
            <div class="c-report__item-description">Report any content that exploits or abuses minors, including images, videos, or discussions of illicit or harmful activities.</div>
          </button>
          <button class="c-report__item" type="button">
            <span>Illegal Drugs</span>
            <div class="c-report__item-description">Report any promotion, sale, or distribution of illegal substances, as well as discussions or content that encourage drug use.</div>
          </button>
          <button class="c-report__item" type="button">
            <span>Terrorism</span>
            <div class="c-report__item-description">Report content that promotes, incites, or glorifies terrorist activities or organizations involved in acts of terrorism.</div>
          </button>
          <button class="c-report__item" type="button">
            <span>Other</span>
            <div class="c-report__item-description">Use this option to report any other type of content that does not fall into the above categories but that you consider inappropriate or harmful.</div>
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
  max-height: 541px;
  overflow-y: auto;
}
.c-report__list::-webkit-scrollbar-track {
  background: transparent;
}
.c-report__list::-webkit-scrollbar-thumb {
  background-color: var(--bg-color-secondary);
  border-radius: 10px;
}
.c-report__list::-webkit-scrollbar {
  width: 6px;
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
.c-report__title.c-soon::before {
  right: -26%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
