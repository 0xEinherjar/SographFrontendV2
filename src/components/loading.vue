<script setup>
const { type, theme } = defineProps(["type", "theme"]);
</script>
<template>
  <div
    class="c-loader"
    :class="{
      'c-loader--small': type == 'small',
      'c-loader--medium': type == 'medium',
      'c-loader--dark': theme == 'dark',
    }"
  ></div>
</template>
<style>
.c-loader {
  display: inline-block;
  border-radius: 50%;
  border-style: solid;
  border-color: rgba(244, 244, 244, 0.3);
  border-top-color: #f4f4f4;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}
.c-loader--small {
  height: 16px;
  width: 16px;
  border-width: 2px;
}
.c-loader--medium {
  height: 24px;
  width: 24px;
  border-width: 3px;
}
.c-loader--dark {
  border-color: rgba(40, 41, 43, 0.3);
  border-top-color: #28292b;
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
