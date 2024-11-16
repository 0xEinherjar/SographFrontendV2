<script setup></script>
<!-- prettier-ignore -->
<template>
  <button type="button" class="c-chain"><span class=""></span>BSC Testnet</button>
</template>
<style>
.c-chain {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #28292b;
  height: 48px;
  border-radius: 12px;
  color: var(--text-color-primary);
  font-size: 1.5rem;
  font-weight: 500;
  padding-inline: 24px;
  white-space: nowrap;
}
.light-mode .c-chain {
  background-color: #f3f8fd;
}
.c-chain span {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #2fc687;
}
</style>
