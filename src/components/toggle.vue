<template>
  <span class="c-toggle" role="button"></span>
</template>
<style>
.c-toggle {
  height: 14px;
  width: 34px;
  border-radius: 14px;
  background-color: rgba(1, 119, 251, 0.25);
  position: relative;
}
.c-toggle::before {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: #0177fb;
}
</style>
