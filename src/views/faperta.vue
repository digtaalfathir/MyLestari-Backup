<template>
  <MenuList :initialMenuList="menuList" />

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

  <!-- Environment Section -->
  <section class="h-full text-center text-black flex flex-col items-center px-5 border-b border-gray-300">
    <div class="w-full my-3">
      <div class="flex justify-between items-center">
        <h3 class="text-left"><strong>Environment</strong></h3>
        <p class="ml-2 text-gray-500 text-sm">Last Update: {{ lastUpdate }}</p>
      </div>
      <ul class="mt-4 mb-5 flex flex-wrap gap-4 justify-start list-none bg-white" data-tabs-toggle="#tab-content" role="tablist">
        <li v-for="(item, index) in environtment" :key="index" class="relative w-60 gap-3 sm:w-48 py-2 px-3 bg-gray-50 border border-gray-300 rounded min-h-16" role="presentation">
          <p class="text-xs mb-1">{{ item.name }}</p>
          <h5 :class="[item.isGreaterThan ? 'text-green-500' : 'text-red-500']" class="text-sm font-medium">
            {{ item.value }} <sup class="satuan-label">{{ item.satuan }}</sup>
          </h5>
        </li>
      </ul>
    </div>
  </section>

  <!-- Chart and Filters Section -->
  <section class="h-full text-center text-black flex flex-col items-center px-5">
    <div class="w-full my-3">
      <div v-if="!isMobile" class="flex items-center justify-end">
        <p class="text-gray-500 text-sm mr-2">{{ dateUpdate }}</p>
      </div>
      <div :class="['flex', isMobile ? 'flex-col items-center' : 'justify-between items-center']">
        <div class="flex items-center">
          <select :class="['my-form-select2 bg-white', isMobile ? 'w-80 mb-4' : 'mx-0 mb-0 w-40']" v-model="A" @change="onDropdownChange">
            <option v-for="option in modelOptions" :key="option.id" :value="option.name">
              {{ option.name }}
            </option>
          </select>
          <button class="ml-2 p-0 border border-gray-200 rounded-full py-0.5 px-3" @click="onSyncClick">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>

        <div v-if="!isMobile" class="flex flex-row justify-end mt-3 mb-2">
          <!-- Date Filters -->
          <div v-for="(filter, index) in env_date_filter" :key="index" class="mr-1">
            <div class="flex items-center">
              <button :class="['border border-gray-200 rounded-full py-0.5 px-3', { 'bg-gray-400': index === p }]" type="button" @click="handleDateFilterClick(filter.value, index)">
                {{ filter.name }}
              </button>
              <input v-if="filter.value === 'custom' && index === p" type="datetime-local" v-model="customDate" class="ml-2 border border-gray-200 rounded px-2" />
            </div>
          </div>
          <div class="mr-1">
            <div class="flex items-center">
              <button :class="['border border-gray-200 rounded-full py-0.5 px-3', { 'bg-gray-400': customDateActive }]" type="button" @click="toggleCustomDate()">Custom</button>
              <input v-if="customDateActive" type="datetime-local" v-model="customDate" class="ml-2 border border-gray-200 rounded px-2" />
            </div>
          </div>
        </div>

        <div v-if="isMobile" class="flex flex-col items-center mt-3 mb-2 w-full">
          <!-- Date Filters for Mobile in one row -->
          <div class="flex flex-wrap justify-center mb-2">
            <div v-for="(filter, index) in env_date_filter" :key="index" class="mb-2 mx-1">
              <button :class="['border border-gray-200 rounded-full py-0.5 px-3', { 'bg-gray-400': index === p }]" type="button" @click="handleDateFilterClick(filter.value, index)">
                {{ filter.name }}
              </button>
            </div>
            <div class="mr-1">
              <div class="flex items-center">
                <button :class="['border border-gray-200 rounded-full py-0.5 px-3', { 'bg-gray-400': customDateActive }]" type="button" @click="toggleCustomDate()">Custom</button>
              </div>
            </div>
          </div>
          <input v-if="customDateActive" type="datetime-local" v-model="customDate" class="ml-2 border border-gray-200 rounded px-2" />
        </div>
      </div>
      <div v-if="isMobile" class="flex items-center justify-center">
        <p class="text-gray-500 text-sm">{{ dateUpdate }}</p>
      </div>
    </div>
  </section>

  <div v-if="iscontentLoad" class="content-wrapper">
    <ContentLoaderComponent />
  </div>
  <div v-else>
    <!-- Chart Section -->
    <section class="h-full text-center text-black flex flex-col items-center px-5">
      <div class="w-full my-3">
        <div :class="{ loading: m }">
          <ApexChart :options="chartOptions" :series="S" height="400" type="line" width="100%" />
        </div>
      </div>
    </section>

    <!-- Summary Section -->
    <section class="h-full text-center text-black flex flex-col items-center px-5 border-b border-gray-300">
      <div class="w-full my-3">
        <div :class="{ loading: isLoading }">
          <ul class="my-white-list mt-4 mb-5 list-none bg-white border border-gray-300 rounded-lg shadow-md">
            <!-- Header Row -->
            <li class="w-full text-left p-3 border-b border-gray-300 flex justify-between bg-blue-500 rounded-t-lg">
              <div class="w-full grid grid-cols-8 gap-4 justify-between">
                <div v-if="isMobile" class="font-bold text-gray-700 flex items-center ml-2 text-sm">Param</div>
                <div v-if="!isMobile" class="font-bold text-gray-700 flex items-center ml-2">Parameter</div>
                <div v-for="(item, index) in envSummResult" :key="index" class="font-bold text-gray-700 flex items-center">
                  <span
                    :class="{
                      'text-sm ml-4': isMobile,
                      'ml-8': item.name === 'WL_Mid',
                      'ml-16': item.name === 'WL_High',
                    }"
                    v-if="isMobile"
                  >
                    {{ item.name }}
                  </span>
                  <span v-if="!isMobile">
                    {{ item.name }}
                  </span>
                </div>
              </div>
            </li>

            <!-- Data Rows -->
            <li v-for="(item, index) in envSumm" :key="index" class="w-full text-left p-3 border-b border-gray-300 flex justify-between hover:bg-gray-100 transition">
              <div class="w-full grid grid-cols-8 gap-4 justify-between">
                <div class="font-semibold text-gray-700 flex items-center ml-2">
                  <svg v-if="isMobile" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(item.name)" />
                  </svg>
                  <svg v-if="!isMobile" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(item.name)" />
                  </svg>
                  <span v-if="isMobile" class="text-sm">{{ item.value }}</span>
                  <span v-if="!isMobile">{{ item.value }}</span>
                </div>
                <div v-if="isMobile" class="font-semibold text-gray-700 text-sm ml-8">{{ item.wl_low }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700 ml-2">{{ item.wl_low }}</div>
                <div v-if="isMobile" class="font-semibold text-gray-700 text-sm ml-16">{{ item.wl_mid }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700 ml-2">{{ item.wl_mid }}</div>
                <div v-if="isMobile" class="font-semibold text-gray-700 text-sm ml-20">{{ item.wl_hig }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700 ml-2">{{ item.wl_hig }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ApexChart from "vue3-apexcharts";
import MenuList from "@/components/MenuList.vue";
import { ContentLoader } from "vue-content-loader";
import { ref, computed, onMounted, onUnmounted } from "vue";
import ContentLoaderComponent from "@/components/ContentLoaderComponent.vue";

export default {
  name: "Faperta",
  components: {
    MenuList,
    ApexChart,
    ContentLoader,
    ContentLoaderComponent,
  },

  setup() {
    const url1 = "https://inamas.id/dev/isolated/faperta/?sensor",
      url2 = "https://inamas.id/dev/petro/glasshouse/?setpoint",
      modelOptions = ref([{ id: 1, name: "Environment" }]),
      isLoading = ref(false),
      customDateActive = ref(false),
      iscontentLoad = ref(false), // Loading
      notification = ref({
        visible: false,
        message: "",
        success: false,
        loading: false,
      }),
      m = ref(false),
      p = ref(0),
      x = ref("1h"),
      W = ref({}), // Chart
      S = ref([]),
      A = ref("Environment"),
      lastUpdate = ref(""),
      isMobile = ref(false),
      customDate = ref("");

    let sensorDataGrupDummy = {
      "1h": generateSensorData(1, 5, 10),
      "3h": generateSensorData(3, 10, 30),
      "12h": generateSensorData(12, 15, 60),
      "1d": generateSensorData(24, 20, 120),
      "1w": generateSensorData(7 * 24, 30, 4 * 60),
      "1m": generateSensorData(30 * 24, 40, 24 * 60),
    };

    const menuList = [
        { id: 1, title: "Value Setting", route: { name: "value-setting-fp" }, icon: "value-setting.svg" },
        { id: 2, title: "Device Detail", route: { name: "" }, icon: "device-detail.svg" },
        { id: 3, title: "Detail Info", route: { name: "", params: { id: "1" } }, icon: "detail-info.svg" },
        { id: 4, title: "Feature Setting", route: { name: "" }, icon: "feature-setting.svg" },
        { id: 5, title: "Export Data", route: { name: "" }, icon: "export-data.svg" },
      ],
      environtment = ref([
        { name: "Water Level Low", satuan: "", value: "OFF", isGreaterThan: false, isLowerThan: false },
        { name: "Water Level Mid", satuan: "", value: "OFF", isGreaterThan: false, isLowerThan: false },
        { name: "Water Level High", satuan: "", value: "OFF", isGreaterThan: false, isLowerThan: false },
      ]),
      env_date_filter = ref([
        { name: "1h", value: "1h" },
        { name: "3h", value: "3h" },
        { name: "12h", value: "12h" },
        { name: "1d", value: "1d" },
        { name: "1w", value: "1w" },
        { name: "1m", value: "1m" },
      ]),
      envSummResult = ref([
        { name: "WL_Low", value: null },
        { name: "WL_Mid", value: null },
        { name: "WL_High", value: null },
      ]),
      envSumm = ref([
        { name: "Max", value: "Max", wl_low: 100, wl_mid: 100, wl_hig: 100 },
        { name: "Min", value: "Min", wl_low: 100, wl_mid: 100, wl_hig: 100 },
        { name: "Avg", value: "Avg", wl_low: 100, wl_mid: 100, wl_hig: 100 },
        { name: "Day", value: "Day", wl_low: 100, wl_mid: 100, wl_hig: 100 },
      ]);

    const dateUpdate = computed(() => {
      if (p.value === null) return "";
      const now = new Date(),
        customDateObj = new Date(customDate.value);
      let pastDate;

      const baseDate = customDateActive.value ? customDateObj : now;

      switch (env_date_filter.value[p.value].value) {
        case "1h":
        case "3h":
        case "12h":
          pastDate = new Date(baseDate.getTime());
          break;
        case "1d":
          pastDate = new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000);
          return `${formatDate(pastDate)} - ${formatDate(baseDate)}`;
        case "1w":
          pastDate = new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          return `${formatDate(pastDate)} - ${formatDate(baseDate)}`;
        case "1m":
          pastDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, baseDate.getDate());
          return `${formatDate(pastDate)} - ${formatDate(baseDate)}`;
        default:
          return "";
      }
      return formatDate(pastDate);
    });

    const updateChart = (data) => {
        S.value = [];
        const val = [
          { name: "WL_Low", data: [] },
          { name: "WL_Mid", data: [] },
          { name: "WL_High", data: [] },
        ];
        data.forEach((item) => {
          const time = new Date(item.created_at).getTime();
          const timeUTCPlus7 = time + 7 * 60 * 60 * 1000;

          if (item.wl_low !== null) {
            val[0].data.push({ x: timeUTCPlus7, y: parseFloat(item.wl_low) });
          }
          if (item.wl_mid !== null) {
            val[1].data.push({ x: timeUTCPlus7, y: parseFloat(item.wl_mid) });
          }
          if (item.wl_hig !== null) {
            val[2].data.push({ x: timeUTCPlus7, y: parseFloat(item.wl_hig) });
          }
        });
        S.value = val;
      },
      onDropdownChange = (event) => {
        A.value = event.target.value;
      },
      handleDateFilterClick = (value, index) => {
        p.value = index;
        x.value = value;
        if (value === "custom") {
        } else {
          updateChart(sensorDataGrupDummy[x.value]);
        }
      },
      chartOptions = ref({
        chart: {
          type: "line",
          height: 400,
        },
        xaxis: {
          type: "datetime",
          labels: {
            formatter: function (value) {
              const date = new Date(value);
              return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} ${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(
                2,
                "0"
              )}`;
            },
          },
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy HH:mm",
          },
        },
      });

    const getIconPath = (name) => {
      switch (name) {
        case "Max":
          return "M5 12l7-7 7 7M12 5v14";
        case "Min":
          return "M19 12l-7 7-7-7M12 19V5";
        case "Avg":
          return "M4 12h16M4 6h16M4 18h16";
        case "Day":
          return "M12 2v2m0 16v2m-6.364-3.636l1.414 1.414M4.222 4.222l1.414 1.414m12.728 12.728l1.414 1.414m-1.414-12.728l1.414-1.414M12 6a6 6 0 110 12 6 6 0 010-12z";
        default:
          return "M12 2a10 10 0 110 20 10 10 0 010-20z";
      }
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
      formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

    function toggleCustomDate() {
      customDateActive.value = !customDateActive.value;
      if (customDateActive.value === true) {
        placeHolderdate();
      }
    }
    function placeHolderdate() {
      const now = new Date();
      const formattedNow = formatDateTime(now);
      customDate.value = formattedNow;
    }
    function generateSensorData(totalHours, dataCount, intervalMinutes) {
      const data = [];
      const now = new Date();

      for (let i = 0; i < dataCount; i++) {
        const createdAt = new Date(now.getTime() - i * intervalMinutes * 60 * 1000).toISOString();
        data.push({
          wl_low: (80 + Math.floor(Math.random() * 10)).toString(),
          wl_mid: (40 + Math.floor(Math.random() * 20)).toString(),
          wl_hig: (75 + Math.floor(Math.random() * 15)).toString(),
          created_at: createdAt,
        });
      }

      return data;
    }

    async function getDatasetpoint(retries = 3, delay = 1000) {
      try {
        const response = await fetch(url2);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const percentValueTemp = (parseInt(data.advice.tempTh) * parseInt(data.advice.tempTol)) / 100;
        const percentValueHum = (parseInt(data.advice.humTh) * parseInt(data.advice.humTol)) / 100;
        templimitup = parseInt(data.advice.tempTh) + percentValueTemp;
        templimitdown = parseInt(data.advice.tempTh) - percentValueTemp;
        humlimitup = parseInt(data.advice.humTh) + percentValueHum;
        humlimitdown = parseInt(data.advice.humTh) - percentValueHum;
      } catch (error) {
        if (retries > 0) {
          notification.value = {
            visible: true,
            message: `Retrying getDatasetpoint... (${retries} retries left)`,
            success: false,
            loading: true,
          };
          await new Promise((res) => setTimeout(res, delay));
          return getDatasetpoint(retries - 1, delay * 5); // Increase delay for next retry
        } else {
          notification.value = {
            visible: true,
            message: "There was a problem with the fetch setpoint:" + error.message,
            success: false,
            loading: false,
          };
        }
      }
    }

    async function getDataEnvi(retries = 3, delay = 1000) {
      try {
        const response = await fetch(url1);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const advice = data.advice;
        updateEnvironmentData(advice);
        lastUpdate.value = new Date().toLocaleString();
      } catch (error) {
        if (retries > 0) {
          notification.value = {
            visible: true,
            message: `Retrying getDataEnvi... (${retries} retries left)`,
            success: false,
            loading: true,
          };
          await new Promise((res) => setTimeout(res, delay));
          return getDataEnvi(retries - 1, delay * 5); // Delay for next retry
        } else {
          notification.value = {
            visible: true,
            message: "There was a problem with the fetch environtment:" + error.message,
            success: false,
            loading: false,
          };
        }
      }
    }

    const updateEnvironmentData = (advice) => {
      if (advice.wl_low === "1") {
        environtment.value[0].isGreaterThan = true;
        environtment.value[0].value = "ON";
      } else if (advice.wl_low === "0") {
        environtment.value[0].isGreaterThan = false;
        environtment.value[0].value = "OFF";
      }

      if (advice.wl_mid === "1") {
        environtment.value[1].isGreaterThan = true;
        environtment.value[1].value = "ON";
      } else if (advice.wl_mid === "0") {
        environtment.value[1].isGreaterThan = false;
        environtment.value[1].value = "OFF";
      }

      if (advice.wl_hig === "1") {
        environtment.value[2].isGreaterThan = true;
        environtment.value[2].value = "ON";
      } else if (advice.wl_hig === "0") {
        environtment.value[2].isGreaterThan = false;
        environtment.value[2].value = "OFF";
      }
    };

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768; // Set true if width is <= 768px
    };

    async function onSyncClick() {
      iscontentLoad.value = true;
      updateChart(sensorDataGrupDummy["1h"]);
      setInterval(() => {
        iscontentLoad.value = false;
      }, 1000);
    }

    async function updateDataenvi() {
      await getDatasetpoint();
      getDataEnvi();
      lastUpdate.value = new Date().toLocaleString();
    }

    onMounted(() => {
      checkScreenSize(); // Initial check
      window.addEventListener("resize", checkScreenSize); // Listen to window resize

      notification.value = {
        visible: true,
        message: "Fetching data...",
        success: false,
        loading: true,
      };
      updateChart(sensorDataGrupDummy["1h"]);
      getDataEnvi();
      notification.value = {
        visible: true,
        message: "Berhasil menerima data",
        success: true,
        loading: false,
      };
      setTimeout(() => {
        notification.value.visible = false;
      }, 2000);
      setInterval(() => {
        getDataEnvi();
      }, 1000);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkScreenSize);
    });

    return {
      A,
      m,
      p,
      S,
      W,
      x,
      envSumm,
      menuList,
      isMobile,
      isLoading,
      customDate,
      dateUpdate,
      lastUpdate,
      getIconPath,
      updateChart,
      onSyncClick,
      chartOptions,
      environtment,
      modelOptions,
      notification,
      envSummResult,
      iscontentLoad,
      updateDataenvi,
      env_date_filter,
      customDateActive,
      toggleCustomDate,
      onDropdownChange,
      handleDateFilterClick,
    };
  },
};
</script>

<style scoped>
.bg-blue-500 {
  background-color: #def1e7;
}
</style>
