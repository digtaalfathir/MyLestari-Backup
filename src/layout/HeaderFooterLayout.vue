<template>
  <div>
    <Header></Header>
    <router-view />
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "../components/WelcomeHeaderComponent.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "HeaderFooterLayout",
  components: {
    Header,
    Footer,
  },
};
</script>
