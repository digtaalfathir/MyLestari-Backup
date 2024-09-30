<template>
  <header class="py-5 text-left border-b-2 border-gray-200 dashboard-header1">
    <div class="flex px-5 w-full justify-between items-center">
      <!-- Logo -->
      <router-link to="/">
        <img :src="logoSrc" alt="Logo" :style="logoStyle" />
      </router-link>

      <!-- Company name -->
      <span :class="[isMobile ? 'text-sm px-2 py-1' : 'py-2 px-3']" class="border border-gray-300 bg-white rounded-full font-bold float-right mb-3">
        {{ companyName }}
      </span>
    </div>
  </header>
</template>

<script>
import { useRoute } from "vue-router";
import { ref, onMounted, onUnmounted, computed } from "vue";

export default {
  name: "HeaderComponent",
  setup() {
    const logoSrc = "./../logo.png",
      route = useRoute(),
      companyName = ref(""),
      isMobile = ref(false);

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768; // Threshold for mobile view
    };

    onMounted(() => {
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      if (route.name === "argonomis_dashboard_faperta") {
        companyName.value = "FAPERTA UGM";
      } else {
        companyName.value = "PT. Petrokimia Gresik";
      }
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkScreenSize);
    });

    const logoStyle = computed(() => ({
      height: isMobile.value ? "30px" : "40px", // Adjust logo size based on screen size
      width: "auto",
      marginBottom: "10px", // Add some space below the logo
    }));

    return {
      logoSrc,
      isMobile,
      logoStyle,
      companyName,
    };
  },
};
</script>
