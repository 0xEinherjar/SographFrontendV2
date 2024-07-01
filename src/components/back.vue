<script setup>
import Avatar from "./avatar.vue";
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-back" role="button">
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.40625 12.4498L5.33125 8.3748C4.85 7.89355 4.85 7.10605 5.33125 6.6248L9.40625 2.5498" stroke="#BDC1C6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="c-back__text">back to</span>
    <avatar class="c-back__avatar" length="26px" radius="8px"/>
    <h6 class="c-back__name">Jacob Jones</h6>
  </div>
</template>
<style>
.c-back {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.c-back__text {
  font-size: 1.4rem;
  color: #bdc1c6;
  margin-left: 4px;
}
.c-back__avatar {
  margin-inline: 12px;
}
.c-back__name {
  font-size: 1.4rem;
  font-weight: 500;
  color: #f4f4f4;
}
</style>
