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

  <section :class="[{ container: isMobile, 'w-full': !isMobile }, 'pb-10 text-center bg-hero px-10']">
    <h1 v-if="isMobile" class="font-black mb-4">My Lestari</h1>
    <h1 v-else class="font-black mb-4 py-5 text-6xl mt-4">My Lestari</h1>

    <p v-if="isMobile">
      "My Lestari" adalah solusi aplikatif inovatif <br />
      yang dirancang untuk membantu pengguna <br />
      dalam memantau data secara real-time, <br />
      mengontrol perangkat dari jarak jauh, <br />
      melacak jurnal, dan mengelola gudang <br />
      dengan efisien
    </p>
    <p v-else class="p-5" style="font-size: 18px">
      "My Lestari" adalah solusi aplikatif inovatif yang dirancang untuk membantu pengguna dalam memantau data secara real-time, <br />
      mengontrol perangkat dari jarak jauh, melacak jurnal, dan mengelola gudang dengan efisien
    </p>

    <div v-if="isLoggedIn" class="mt-8 mb-8 flex space-x-4 justify-center">
      <router-link v-if="user.email === 'strawberryruko@gmail.com'" to="/faperta" class="rounded-md bg-primary px-5 py-3 text-sm font-medium text-white" aria-current="page"> Faperta </router-link>
      <router-link v-if="user.email === 'risetteknologipg@gmail.com'" to="/greenhouse" class="rounded-md bg-primary px-6 py-3 text-sm font-medium text-white" aria-current="page"> IFCS </router-link>
      <router-link v-if="user.email === 'risetteknologipg@gmail.com'" to="/glasshouse" class="rounded-md bg-primary px-3 py-3 text-sm font-medium text-white" aria-current="page"> Glasshouse </router-link>
    </div>

    <img v-if="isMobile" class="mt-5 mx-auto h-auto w-100" :src="bannerMobile" alt="My Lestari" />
    <img v-else class="mt-5 h-auto w-full border-b-8 border-r-8 border-green-500 rounded-lg" :src="bannerDesktop" alt="My Lestari" />
  </section>

  <section :class="containerClass">
    <h2 v-if="isMobile" class="font-extrabold mb-4">
      Kenapa perlu menggunakan <br />
      My Lestari
    </h2>
    <h2 v-else class="font-extrabold mb-4 text-4xl my-4 py-4">Kenapa perlu menggunakan My Lestari ?</h2>

    <p v-if="isMobile">
      Solusi aplikasi inovatif yang dirancang untuk <br />
      membantu pengguna dalam memantau data <br />
      secara real-time, mengontrol perangkat dari <br />
      jarak jauh, melacak jurnal, dan mengelola <br />
      gudang dengan efisien.
    </p>
    <p v-else class="text-lg">
      Solusi aplikasi inovatif yang dirancang untuk membantu pengguna dalam memantau data
      <br />secara real-time, mengontrol perangkat dari jarak jauh, melacak jurnal, dan mengelola gudang dengan efisien.
    </p>

    <img v-if="isMobile" :src="banner2" alt="My Lestari" class="mt-5 mx-auto h-auto w-100" />
    <img v-else :src="banner2" alt="My Lestari" class="mt-5 mx-auto h-auto w-100" />

    <div v-if="isMobile" class="border border-gray/300 p-4 mt-4 rounded-lg text-left">
      <h3 class="gap-8 font-bold leading-8">Real Time Data Monitoring</h3>
      <p>Pengguna dapat melacak kinerja perangkat atau sistem secara langsung, memungkinkan respons cepat terhadap perubahan atau masalah yang muncul.</p>
    </div>
    <div v-else class="text-center border border-gray/300 p-4 mt-4 rounded-lg">
      <h3 class="gap-8 font-bold leading-8 text-4xl py-5">Real Time Data Monitoring</h3>
      <p class="text-lg py-5">Pengguna dapat melacak kinerja perangkat atau sistem secara langsung, memungkinkan respons cepat terhadap perubahan atau masalah yang muncul.</p>
    </div>

    <img v-if="isMobile" :src="banner3" alt="My Lestari" class="mt-5 mx-auto h-auto w-100" />
    <img v-else :src="banner3" alt="My Lestari" class="mt-5 mx-auto h-auto w-100" />
  </section>

  <section :class="containerClass">
    <h2 v-if="isMobile" class="font-bold mb-4">Produk Inapulse</h2>
    <h2 v-else class="font-bold mb-4 py-4 text-4xl">Produk Inapulse</h2>

    <p v-if="isMobile">
      INAPULSE adalah sebuah alat yang didesain <br />
      untuk membantu pemantauan parameter <br />
      lingkungan pada sistem pertanian, perikanan, dan peternakan. Dilengkapi <br />
      dengan sistem pembacaan parameter pada sensor secara real time yang terhubung <br />
      dengan aplikasi MyLestari, INAPULSE diharapkan dapat digunakan untuk memantau kondisi lingkungan yang berkaitan <br />
      dengan pertumbuhan tanaman, kesehatan ikan, dan kesejahteraan hewan ternak.
    </p>
    <p v-else class="text-lg py-4 text-center">
      INAPULSE adalah sebuah alat yang didesain untuk membantu pemantauan parameter lingkungan pada sistem pertanian, perikanan, dan peternakan.
      <br />Dilengkapi dengan sistem pembacaan parameter pada sensor secara real time yang terhubung dengan aplikasi MyLestari, INAPULSE diharapkan dapat digunakan untuk memantau kondisi lingkungan yang berkaitan dengan pertumbuhan tanaman,
      kesehatan ikan, dan kesejahteraan hewan ternak.
    </p>

    <ul v-if="isMobile" class="mt-4 mb-5 flex justify-around list-none flex-row ps-0 bg-gray-100 border border-gray/300 rounded-lg" role="tablist" data-tabs-toggle="#tab-content">
      <li v-for="(tab, index) in tablist" :key="index" role="presentation" class="w-full">
        <a
          :href="'#' + tab.href"
          @click="tabClick(index)"
          class="block border-x-0 border-b-4 border-t-0 border-transparent px-2 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-black hover:isolate hover:border-transparent hover:bg-gray-100 focus:isolate focus:border-transparent dark:hover:bg-gray-500"
          role="tab"
          :aria-controls="tab.href"
          :aria-selected="tab.active ? 'true' : 'false'"
        >
          {{ tab.name }}
        </a>
      </li>
    </ul>
    <ul v-else class="mt-4 mb-5 flex justify-around bg-gray-100 list-none flex-row ps-0 bg-gray-100 border border-gray/300 rounded-lg" role="tablist" data-tabs-toggle="#tab-content">
      <li
        v-for="(tab, index) in tablist"
        :key="index"
        role="presentation"
        :class="['w-full lg:w-auto border-l lg:border-none border-l-gray-200 first:border-l-0', { 'tabs-active2': tab.active, 'first:tabs-active2-l last:tabs-active2-r': index === 0 || index === tablist.length - 1 }]"
      >
        <button
          :href="'#' + tab.href"
          @click="tabClick(index)"
          class="h-full w-full block pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-black p-4 rounded-none hover:text-primary focus:text-primary active:text-primary"
          role="tab"
          :aria-controls="tab.href"
          :aria-selected="tab.active ? 'true' : 'false'"
        >
          {{ tab.name }}
        </button>
      </li>
    </ul>

    <div :class="tabContentClass">
      <div v-for="tab in tablist" v-show="tab.active" :key="tab.href" class="p-4" :id="tab.href" role="tabpanel" :aria-labelledby="tab.href">
        <h2 class="text-left gap-8 font-bold leading-8">{{ tab.name }}</h2>
        <p class="text-left">{{ tab.content.desc }}</p>
        <img class="mt-5 custom-image" :src="'/' + tab.content.img" :alt="tab.name" />
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";

export default {
  name: "Welcome",
  setup() {
    const isMobile = ref(false),
      isLoggedIn = ref(false),
      user = ref(null),
      notification = ref({
        visible: false,
        message: "",
        success: false,
        loading: false,
      });

    // Cek apakah user sudah login
    const checkLogin = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        isLoggedIn.value = true;
        user.value = JSON.parse(storedUser);
        notification.value = {
          visible: true,
          message: "Login Success",
          success: true,
          loading: false,
        };
        setTimeout(() => {
          notification.value.visible = false;
        }, 2000);
      } else {
        isLoggedIn.value = false;
      }
    };

    const bannerDesktop = "./assets/banner1-hd.png",
      bannerMobile = "./assets/banner1.png",
      banner2 = ref("./assets/banner2.png"),
      banner3 = ref("./assets/banner3.png");

    const tablist = ref([
      {
        href: "tabs-air",
        name: "AIR QUALITY",
        active: true,
        content: {
          desc: "Menyesuaikan tingkat pemberian air yang baik pada tanaman berdasarkan parameter pengukuran seperti kelembapan relatif, suhu udara, dan co2.",
          img: "./assets/banner_air.png",
        },
      },
      {
        href: "tabs-soil",
        name: "SOIL QUALITY",
        active: false,
        content: {
          desc: "Mengetahui kualitas tanah berdasarkan parameter pengukuran seperti kelembapan tanah, ph tanah dan suhu tanah.",
          img: "./assets/banner_soil.png",
        },
      },
      {
        href: "tabs-water",
        name: "WATER QUALITY",
        active: false,
        content: {
          desc: "Mengetahui kualitas air berdasarkan parameter pengukuran seperti ph, do, suhu air, dan ammonium.",
          img: "./assets/banner_water.png",
        },
      },
    ]);

    const containerClass = computed(() => ({
      "container mx-auto": isMobile.value,
      "w-full": !isMobile.value,
      "py-10 text-center bg-white px-10": true,
    }));

    const tabContentClass = computed(() => ({
      "mt-4 mb-5 ps-0 bg-gray-100 border border-gray/300 rounded-lg": true,
    }));

    const tabClick = (index) => {
      tablist.value.forEach((tab, i) => {
        tab.active = i === index;
      });
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

    return {
      user,
      banner2,
      banner3,
      tablist,
      isMobile,
      tabClick,
      isLoggedIn,
      bannerMobile,
      notification,
      bannerDesktop,
      containerClass,
      tabContentClass,
    };
  },
};
</script>
