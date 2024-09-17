<template>
  <div class="c-comment-placeholder">
    <div class="c-comment-placeholder__details u-flex-line">
      <div class="c-comment-placeholder__avatar"></div>
      <div class="c-comment-placeholder__name"></div>
      <div class="c-comment-placeholder__data"></div>
    </div>
    <div class="c-comment-placeholder__texts">
      <div class="c-comment-placeholder__text"></div>
      <div class="c-comment-placeholder__text"></div>
    </div>
  </div>
</template>
<style>
.c-comment-placeholder {
  width: min(500px, 100%);
  margin-inline: auto;
  display: grid;
  gap: 8px;
}
.c-comment-placeholder__avatar,
.c-comment-placeholder__name,
.c-comment-placeholder__data,
.c-comment-placeholder__text {
  background-color: var(--bg-color-secondary);
  position: relative;
  overflow: hidden;
}
.c-comment-placeholder__avatar::before,
.c-comment-placeholder__name::before,
.c-comment-placeholder__data::before,
.c-comment-placeholder__text::before {
  content: "";
  display: block;
  height: 50vh;
  width: 50vw;
  position: absolute;
  animation: is-passing 0.6s ease-in infinite;
  background: linear-gradient(to right, transparent, #4e4f51 50%, transparent);
  z-index: 5;
}
.c-comment-placeholder__texts {
  display: grid;
  gap: 10px;
  padding-left: 40px;
}
.c-comment-placeholder__text {
  height: 1.2rem;
  border-radius: 4px;
}
.c-comment-placeholder__text:nth-child(1) {
  width: 90%;
}
.c-comment-placeholder__text:nth-child(2) {
  width: 100%;
}
.c-comment-placeholder__avatar {
  height: 24px;
  width: 24px;
  border-radius: 50%;
}
.c-comment-placeholder__name {
  height: 1rem;
  width: 50px;
  margin-left: 16px;
  border-radius: 4px;
}
.c-comment-placeholder__data {
  height: 1rem;
  width: 30px;
  margin-left: 16px;
  border-radius: 4px;
}
.c-comment-placeholder__details {
  margin-top: 8px;
}
@keyframes is-passing {
  from {
    transform: translateX(-100%);
  }
}
</style>
