<template>
  <!-- Notification -->
  <transition name="fade">
    <div v-if="notification.visible" :class="['notification', notification.success ? 'success' : notification.loading ? 'loading' : 'error']">
      <div class="notification-icon">
        <svg v-if="notification.success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="notification-svg">
          <path d="M9 16.172l-4.586-4.586a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.828 0L9 11.586l5.172-5.172a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.828L9 16.172z" />
        </svg>
        <svg v-else-if="notification.loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="notification-svg">
          <circle cx="11" cy="11" r="7" stroke-width="2" stroke="currentColor" fill="none" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" stroke-width="2" stroke="currentColor" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="notification-svg">
          <path d="M12 2v20M2 12h20" />
        </svg>
      </div>
      <div class="notification-message">{{ notification.message }}</div>
      <button class="notification-close" @click="notification.visible = false">×</button>
    </div>
  </transition>

  <main class="text-center mx-auto px-2 text-black flex flex-col items-center justify-center h-screen" :class="{ 'w-full max-w-md': !isMobile }">
    <h1 v-if="isMobile" class="font-bold mb-4">Login</h1>
    <h1 v-else class="font-bold mb-4 text-5xl">Login</h1>
    <form id="form-login" class="w-full" method="POST" @submit.prevent="onSubmit">
      <div class="mt-4 mb-5 bg-white">
        <FormInput v-model="form.email" modelClass="my-form-input" modelId="email" modelName="Email" />
        <FormInput v-model="form.password" modelClass="my-form-input" modelId="password" modelName="Password" type="password" />
        <button type="submit" class="block rounded-lg h-12 px-5 pb-2.5 pt-3 w-full bg-primary text-white">Login</button>
      </div>
      <div class="relative mb-3 mt-5 bg-gray-200 rounded-lg">
        <p class="py-4">
          Don't have an account?
          <router-link to="/login" class="font-semibold">Register</router-link>
        </p>
      </div>
    </form>
  </main>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import FormInput from "@/components/FormInput.vue";

export default {
  name: "LoginView",
  components: {
    FormInput,
  },
  setup() {
    const isMobile = ref(false),
      notification = ref({
        visible: false,
        message: "",
        success: false,
        loading: false,
      });
    const form = ref({
      email: "",
      password: "",
    });
    const router = useRouter();

    const validUsers = ref([
      { email: "strawberryruko@gmail.com", password: "12345678" },
      { email: "risetteknologipg@gmail.com", password: "RisetInastek" },
    ]);

    onMounted(() => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (localStorage.getItem("loggedOut")) {
        notification.value = {
          visible: true,
          message: "Successfully logged out",
          success: true,
          loading: false,
        };
        setTimeout(() => {
          notification.value.visible = false;
        }, 2000);
        localStorage.removeItem("loggedOut");
      }

      if (token && user) {
        router.push("/");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("x_signature");
        localStorage.removeItem("expired");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user");
      }
    });

    const onSubmit = () => {
      const user = validUsers.value.find((u) => u.email === form.value.email && u.password === form.value.password);
      if (user) {
        localStorage.setItem("token", "dummy-token");
        localStorage.setItem("user", JSON.stringify(user));

        router.push("/");
      } else {
        notification.value = {
          visible: true,
          message: "Login Failed",
          success: false,
          loading: false,
        };
        setTimeout(() => {
          notification.value.visible = false;
        }, 2000);
      }
    };

    return {
      form,
      isMobile,
      onSubmit,
      notification,
    };
  },
};
</script>
