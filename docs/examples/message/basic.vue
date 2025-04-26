<script lang="ts" setup>
import { TkMessage } from "vitepress-theme-teek";
import { h } from "vue";

const open1 = () => {
  TkMessage("This is a message.");
};

const open2 = () => {
  TkMessage({
    message: "Congrats, this is a success message.",
    type: "success",
  });
};
const open3 = () => {
  TkMessage({
    message: "Warning, this is a warning message.",
    type: "warning",
  });
};
const open4 = () => {
  TkMessage.error("Oops, this is a error message.");
};

const openVn = () => {
  TkMessage({
    message: h("p", { style: "line-height: 1; font-size: 14px" }, [
      h("span", null, "Message can be "),
      h("i", { style: "color: teal" }, "VNode"),
    ]),
  });
};

const open5 = () => {
  TkMessage({ message: "Congrats, this is a success message.", type: "success", plain: true });
};
</script>

<template>
  <div class="message-container">
    <button @click="open2">Success</button>
    <button @click="open3">Warning</button>
    <button @click="open1">Message</button>
    <button @click="open4">Error</button>
    <button @click="openVn">VNode</button>

    <button @click="open5">Plain Success</button>
  </div>
</template>

<style scoped>
.message-container {
  display: flex;
  gap: 20px;
}
</style>
