<template>
  <header class="pt-4 text-left">
    <div class="flex px-5 w-full justify-between items-center" :class="containerClass">
      <img :src="logoSrc" alt="Company Logo" :style="logoStyle" />

      <button v-if="isLoggedIn" @click="logout" class="rounded-md bg-primary px-5 py-3 text-sm font-medium text-white" :class="{ 'text-sm mb-2': isMobile, 'text-base': !isMobile }">Logout</button>
      <button v-else @click="goToLogin" class="rounded-md bg-primary px-5 py-3 text-sm font-medium text-white" :class="{ 'text-sm mb-2': isMobile, 'text-base': !isMobile }">Login</button>
    </div>
  </header>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted, onUnmounted } from "vue";

export default {
  name: "WelcomeHeaderComponent",
  setup() {
    const logoSrc = "./../logo.png",
      router = useRouter(),
      isMobile = ref(false),
      isLoggedIn = ref(false),
      companyName = ref("PT. Petrokimia Gresik");

    const checkLogin = () => {
      const token = localStorage.getItem("token");
      isLoggedIn.value = !!token;
    };

    const goToLogin = () => {
      router.push("/login");
    };

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.setItem("loggedOut", "true");
      isLoggedIn.value = false;
      router.push("/login");
    };

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    onMounted(() => {
      checkScreenSize();
      checkLogin();
      window.addEventListener("resize", checkScreenSize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkScreenSize);
    });

    const containerClass = computed(() => ({
      flex: true,
      "items-center": true,
      "justify-between": true,
      "px-5": true,
      "w-full": true,
      "flex-row": !isMobile.value,
      "flex-row": isMobile.value,
    }));

    const logoStyle = computed(() => ({
      height: isMobile.value ? "30px" : "40px",
      width: "auto",
      marginBottom: "10px",
    }));

    const companyNameClass = computed(() => ({
      border: true,
      "py-2": true,
      "px-3": true,
      "bg-white": true,
      "font-bold": true,
      "rounded-full": true,
      "border-gray-300": true,
      "text-sm": isMobile.value,
      "text-base": !isMobile.value,
    }));

    return {
      logout,
      logoSrc,
      isMobile,
      goToLogin,
      logoStyle,
      isLoggedIn,
      companyName,
      containerClass,
      companyNameClass,
    };
  },
};
</script>
