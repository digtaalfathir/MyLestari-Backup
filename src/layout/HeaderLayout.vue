<template>
  <div>
    <Header></Header>
    <router-view />
  </div>
</template>

<script>
import Header from "../components/HeaderComponent.vue";

export default {
  name: "HeaderLayout",
  components: {
    Header,
  },
};
</script>
