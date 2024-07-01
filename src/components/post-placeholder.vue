<template>
  <div class="c-post-placeholder">
    <div class="c-post-placeholder__details u-flex-line">
      <div class="c-post-placeholder__avatar"></div>
      <div class="c-post-placeholder__name"></div>
      <div class="c-post-placeholder__icon c-post-placeholder__ml"></div>
    </div>
    <div class="c-post-placeholder__texts">
      <div class="c-post-placeholder__text"></div>
      <div class="c-post-placeholder__text"></div>
      <div class="c-post-placeholder__text"></div>
    </div>
    <div class="c-post-placeholder__action">
      <div class="c-post-placeholder__icon"></div>
      <div class="c-post-placeholder__icon"></div>
      <div class="c-post-placeholder__icon"></div>
    </div>
  </div>
</template>
<style>
.c-post-placeholder {
  width: min(500px, 100%);
  margin-inline: auto;
  display: grid;
  gap: 18px;
}
.c-post-placeholder__avatar,
.c-post-placeholder__name,
.c-post-placeholder__icon,
.c-post-placeholder__text {
  background-color: var(--bg-color-secondary);
  position: relative;
  overflow: hidden;
}
.c-post-placeholder__avatar::before,
.c-post-placeholder__name::before,
.c-post-placeholder__icon::before,
.c-post-placeholder__text::before {
  content: "";
  display: block;
  height: 50vh;
  width: 50vw;
  position: absolute;
  animation: is-passing 0.6s ease-in infinite;
  background: linear-gradient(to right, transparent, #4e4f51 50%, transparent);
  z-index: 5;
}
.c-post-placeholder__texts {
  display: grid;
  gap: 10px;
}
.c-post-placeholder__text {
  height: 1.2rem;
  border-radius: 4px;
}
.c-post-placeholder__text:nth-child(1) {
  width: 90%;
}
.c-post-placeholder__text:nth-child(2) {
  width: 100%;
}
.c-post-placeholder__text:nth-child(3) {
  width: 30%;
}
.c-post-placeholder__avatar {
  height: 28px;
  width: 28px;
  border-radius: 50%;
}
.c-post-placeholder__name {
  height: 1rem;
  width: 50px;
  margin-left: 16px;
  border-radius: 4px;
}
.c-post-placeholder__action {
  display: flex;
  align-items: center;
  gap: 48px;
}
.c-post-placeholder__icon {
  height: 24px;
  width: 40px;
  border-radius: 4px;
}
.c-post-placeholder__ml {
  margin-left: auto;
}
.c-post-placeholder__info {
  gap: 16px;
}
.c-post-placeholder__details {
  margin-top: 8px;
}
@keyframes is-passing {
  from {
    transform: translateX(-100%);
  }
}
</style>
