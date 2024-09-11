<script setup>
const props = defineProps(["iconClass", "size", "name"]);
</script>
<!-- prettier-ignore -->
<template>
  <svg
    :class="props.iconClass"
    :width="props.size"
    :height="props.size"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    role="img"
  >
    <component :is="props.name"/>
  </svg>
</template>
