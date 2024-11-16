<script setup>
import { onMounted, ref } from "vue";
import { Icon } from "./";
import { BaseError, ContractFunctionRevertedError } from "viem";
import { storeToRefs } from "pinia";
import { useErrorStore } from "../store/error.js";
import { constants } from "../constant.js";
const errorStore = useErrorStore();
const { error } = storeToRefs(errorStore);
const message = ref("");

function formatError(_error) {
  if (_error instanceof BaseError) {
    const revertError = _error.walk(
      (err) => err instanceof ContractFunctionRevertedError
    );
    if (revertError instanceof ContractFunctionRevertedError) {
      return (
        constants.messageError[revertError.data?.errorName] ||
        constants.messageError.default
      );
    }
  }
  return "";
}
onMounted(() => {
  message.value = formatError(error.value);
});
</script>
<!-- prettier-ignore -->
<template>
  <Teleport to="body">
    <div class="c-toast u-flex-line-between">
      {{ message }}
      <icon @click="errorStore.removeError()" iconClass="c-icon" name="close"/>
    </div>
  </Teleport>
</template>
<style>
.c-toast {
  background-color: var(--color-red);
  border-radius: 12px;
  height: 56px;
  min-width: 150px;
  max-width: 600px;
  overflow: hidden;
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  gap: 16px;
  padding-inline: 16px;
  color: #f4f4f4;
  font-weight: 500;
  z-index: 1001;
}
.c-toast svg {
  color: var(--text-color-primary) !important;
  cursor: pointer;
}
</style>
