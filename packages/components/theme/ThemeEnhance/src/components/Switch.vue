<script setup lang="ts" name="Switch">
const check = defineModel({ default: false });

const handleClick = () => {
  check.value = !check.value;
};
</script>

<template>
  <span class="core" :class="{ check: check }" @click="handleClick">
    <div class="action"></div>
  </span>
</template>

<style lang="scss" scoped>
.core {
  display: inline-flex;
  position: relative;
  align-items: center;
  min-width: 40px;
  height: 20px;
  border: 1px solid #dcdfe6;
  outline: none;
  border-radius: 10px;
  box-sizing: border-box;
  background: #dcdfe6;
  cursor: pointer;
  transition:
    border-color 0.3s,
    background-color 0.3s;

  .action {
    position: absolute;
    left: 1px;
    border-radius: 100%;
    transition: all 0.3s;
    width: 16px;
    height: 16px;
    background-color: var(--vp-c-white);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #dcdfe6;
  }

  &.check {
    border-color: var(--vp-c-brand-1);
    background-color: var(--vp-c-brand-1);

    .action {
      left: calc(100% - 17px);
      color: var(--vp-c-brand-1);
    }
  }
}
</style>
