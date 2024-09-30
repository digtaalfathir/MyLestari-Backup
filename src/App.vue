<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import HeaderLayout from "./layout/HeaderLayout.vue";
import HeaderFooterLayout from "./layout/HeaderFooterLayout.vue";
import None from "./layout/NonHeaderFooterLayout.vue";

export default {
  computed: {
    layout() {
      const layout = this.$route.meta.layout;
      if (layout === "header-footer") {
        return HeaderFooterLayout;
      } else if (layout === "header") {
        return HeaderLayout;
      } else {
        return None;
      }
    },
  },
};
</script>

<style>
@import "./assets/";
</style>
