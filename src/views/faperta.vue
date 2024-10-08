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
      <ul :class="[isMobile ? 'gap-2' : 'gap-4']" class="mt-4 mb-5 flex justify-start list-none bg-white" data-tabs-toggle="#tab-content" role="tablist">
        <li v-for="(item, index) in environtment" :key="index" class="relative w-60 sm:w-48 gap-3 py-2 px-3 bg-gray-50 border border-gray-300 rounded min-h-16" role="presentation">
          <template v-if="index < 3">
            <p class="text-xs text-gray-500 mb-1">{{ item.name }}</p>
            <h5 :class="[item.isGreaterThan ? 'text-green-500' : 'text-red-500']" class="text-sm font-medium">
              {{ item.value }} <sup class="satuan-label">{{ item.satuan }}</sup>
            </h5>
          </template>
          <template v-else>
            <p class="text-xs text-gray-500 mb-1">{{ item.name }}</p>
            <h5 class="text-gray-900 text-sm font-medium">
              {{ item.value }} <sup class="satuan-label">{{ item.satuan }}</sup>
            </h5>
          </template>
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
                      'ml-8': item.name === 'RH',
                      'ml-16': item.name === 'CO2',
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
                <div v-if="isMobile" class="font-semibold text-gray-700 text-sm ml-8">{{ item.temp }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700 ml-2">{{ item.temp }}</div>
                <div v-if="isMobile" class="font-semibold text-gray-700 text-sm ml-16">{{ item.hum }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700">{{ item.hum }}</div>
                <div v-if="isMobile" class="font-semibold text-gray-700 text-sm ml-20">{{ item.co2 }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700">{{ item.co2 }}</div>
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
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
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
    const url1 = "https://inamas.id/dev/faperta/?sensor",
      modelOptions = ref([{ id: 1, name: "Environment" }]),
      isLoading = ref(false),
      customDateActive = ref(false),
      iscontentLoad = ref(true), // Loading
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
      initialDate = ref(""),
      lastUpdate = ref(""),
      isMobile = ref(false),
      customDate = ref("");

    let url2 = "",
      sensorDataGrup = {
        "1h": [],
        "3h": [],
        "12h": [],
        "1d": [],
        "1w": [],
        "1m": [],
      },
      sensorDataGrupSummary = [];

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
        { name: "Temp", satuan: "°C", value: null, isGreaterThan: ".", isLowerThan: "" },
        { name: "RH", satuan: "%", value: null, isGreaterThan: ".", isLowerThan: "" },
        { name: "CO2", satuan: "ppm", value: null, isGreaterThan: ".", isLowerThan: "" },
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
        { name: "Temp", value: null },
        { name: "RH", value: null },
        { name: "CO2", value: null },
      ]),
      envSumm = ref([
        { name: "Max", value: "Max", temp: 100, hum: null, co2: null },
        { name: "Min", value: "Min", temp: null, hum: null, co2: null },
        { name: "Avg", value: "Avg", temp: null, hum: null, co2: null },
        { name: "Day", value: "Day", temp: null, hum: null, co2: null },
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
      }),
      getMobileLabel = (name) => {
        const mobileLabels = {
          "Temp(1)": "Tem1",
          "RH(1)": "RH1",
          "Temp(2)": "Tem2",
          "RH(2)": "RH2",
          "Temp(3)": "Tem3",
          "RH(3)": "RH3",
          "Temp(All)": "Tem",
          "RH(All)": "RH",
        };
        return mobileLabels[name] || name;
      };

    const updateChart = (groupedData, date, custom = false) => {
        S.value = [];

        const val = [
          { name: "Temp", data: [] },
          { name: "RH", data: [] },
          { name: "CO2", data: [] },
          { name: " ", data: [] },
        ];

        let nowUpdate;
        if (custom) {
          nowUpdate = new Date(customDate.value);
        } else {
          nowUpdate = new Date();
        }
        const nowplus7 = new Date(nowUpdate.getTime() + 7 * 60 * 60 * 1000);
        nowplus7.setSeconds(0, 0);
        const nowplus7fit = new Date(nowplus7.getTime() - 2 * 60 * 1000);

        const oneHourAgo = new Date(nowplus7);
        oneHourAgo.setHours(nowplus7.getHours() - 1);

        const threeHoursAgo = new Date(nowplus7);
        threeHoursAgo.setHours(nowplus7.getHours() - 3);

        const twelveHoursAgo = new Date(nowplus7);
        twelveHoursAgo.setHours(nowplus7.getHours() - 12);

        const yesterday = new Date(nowplus7);
        yesterday.setDate(nowplus7.getDate() - 1);

        const oneWeekAgo = new Date(nowplus7);
        oneWeekAgo.setDate(nowplus7.getDate() - 7);

        const oneMonthAgo = new Date(nowplus7);
        oneMonthAgo.setMonth(nowplus7.getMonth() - 1);

        if (date === "1h") {
          val[3].data.push({ x: nowplus7fit, y: parseFloat("") });
          val[3].data.push({ x: oneHourAgo, y: parseFloat("") });
        } else if (date === "3h") {
          val[3].data.push({ x: nowplus7fit, y: parseFloat("") });
          val[3].data.push({ x: threeHoursAgo, y: parseFloat("") });
        } else if (date === "12h") {
          val[3].data.push({ x: nowplus7fit, y: parseFloat("") });
          val[3].data.push({ x: twelveHoursAgo, y: parseFloat("") });
        } else if (date === "1d") {
          val[3].data.push({ x: nowplus7fit, y: parseFloat("") });
          val[3].data.push({ x: yesterday, y: parseFloat("") });
        } else if (date === "1w") {
          val[3].data.push({ x: nowplus7fit, y: parseFloat("") });
          val[3].data.push({ x: oneWeekAgo, y: parseFloat("") });
        } else if (date === "1m") {
          val[3].data.push({ x: nowplus7fit, y: parseFloat("") });
          val[3].data.push({ x: oneMonthAgo, y: parseFloat("") });
        }

        const uniqueTimeSet = new Set();

        groupedData.forEach((group) => {
          group.forEach((item) => {
            const time = new Date(item.created_at).getTime();
            const timeUTCPlus7 = time + 7 * 60 * 60 * 1000;

            const adjustedTime = new Date(timeUTCPlus7);
            const minutes = adjustedTime.getMinutes();
            if (date === "1m") {
              adjustedTime.setMinutes(Math.floor(minutes / 60) * 60, 0, 0);
            } else if (date === "1w") {
              adjustedTime.setMinutes(Math.floor(minutes / 10) * 60, 0, 0);
            } else {
              adjustedTime.setMinutes(Math.floor(minutes / 1) * 1, 0, 0);
            }

            const timeKey = adjustedTime.toISOString().slice(0, 16);

            if (!uniqueTimeSet.has(timeKey)) {
              uniqueTimeSet.add(timeKey);

              if (item.temp !== null) {
                val[0].data.push({ x: adjustedTime.getTime(), y: parseFloat(item.temp) });
              }
              if (item.hum !== null) {
                val[1].data.push({ x: adjustedTime.getTime(), y: parseFloat(item.hum) });
              }
              if (item.co2 !== null) {
                val[2].data.push({ x: adjustedTime.getTime(), y: parseFloat(item.co2) });
              }
            }
          });
        });
        S.value = val;
      },
      onDropdownChange = (event) => {
        A.value = event.target.value;
      },
      handleDateFilterClick = (value, index) => {
        p.value = index;
        x.value = value;

        if (customDateActive.value === false) {
          updateChart(sensorDataGrup[value], value);
        } else {
          updateChart(sensorDataGrup[value], value, true);
        }
        updateSummaries(sensorDataGrupSummary, value);
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
        colors: ["#3357FF", "#33FF57", "#ffc233", "#FFFFFF"],
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
      },
      formatDateToDDMMYYYY = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        return `${day}`;
      },
      handleDateChange = (newDate, oldDate) => {
        // console.log(`Date changed from ${oldDate} to ${newDate}`);
        updateUrl(true);
        onSyncCustom("1h", true);
        p.value = 0;
        x.value = "1h";
      };

    function toggleCustomDate() {
      customDateActive.value = !customDateActive.value;
      if (customDateActive.value === false) {
        updateUrl();
        onSyncCustom("1h");
        p.value = 0;
        x.value = "1h";
      } else {
        placeHolderdate();
      }
    }
    function placeHolderdate() {
      const now = new Date();
      const formattedNow = formatDateTime(now);
      customDate.value = formattedNow;
      initialDate.value = formattedNow;
    }

    function updateUrl(useCustomDate = false) {
      let selectedDate;
      if (useCustomDate && customDate.value) {
        selectedDate = new Date(customDate.value);
      } else {
        selectedDate = new Date();
      }
      const end1 = new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 19);

      const lastMonth = new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)),
        start1 = new Date(lastMonth.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 19),
        start2 = new Date(lastMonth.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 19);

      if (useCustomDate) {
        url2 = `https://inamas.id/dev/faperta/?getdata&start=${start1}&end=${end1}&limit=0&short=DESC`;
      } else {
        url2 = `https://inamas.id/dev/faperta/?getdata&start=${start2}&end=${end1}&limit=0&short=DESC`;
      }

      console.log("link", url2);
    }

    async function getDataEnvi(retries = 3, delay = 1000) {
      try {
        const response = await fetch(url1);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const advicewaterlevel = data.advice.waterlevel;
        const adviceenvicor = data.advice.envicor;
        updateEnvironmentData(advicewaterlevel);
        updateEnvicorData(adviceenvicor);
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

    async function updateEnvicorData(advice) {
      environtment.value[3].value = parseFloat(advice.temp);
      environtment.value[4].value = parseFloat(advice.hum);
      environtment.value[5].value = parseFloat(advice.co2);
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

    async function getDataSummary(value1, custom = false) {
      fetch(url2)
        .then((response) => response.json())
        .then((data) => {
          sensorDataGrup["1h"] = groupSensorDataByTimeframe(data.advice.envicor, "1h", custom);
          sensorDataGrup["3h"] = groupSensorDataByTimeframe(data.advice.envicor, "3h", custom);
          sensorDataGrup["12h"] = groupSensorDataByTimeframe(data.advice.envicor, "12h", custom);
          sensorDataGrup["1d"] = groupSensorDataByTimeframe(data.advice.envicor, "1d", custom);
          sensorDataGrup["1w"] = groupSensorDataByTimeframe(data.advice.envicor, "1w", custom);
          sensorDataGrup["1m"] = groupSensorDataByTimeframe(data.advice.envicor, "1m", custom);

          updateChart(sensorDataGrup[value1], value1, custom);

          const newSensorDataGrup = restructureSensorData(sensorDataGrup);
          sensorDataGrupSummary = newSensorDataGrup;

          updateSummaries(sensorDataGrupSummary, value1);

          iscontentLoad.value = false;
          notification.value = {
            visible: true,
            message: "Berhasil menerima data",
            success: true,
            loading: false,
          };
          setTimeout(() => {
            notification.value.visible = false;
          }, 2000);
        })
        .catch((error) => {
          notification.value = {
            visible: true,
            message: "Error fetching data:" + error.message,
            success: false,
            loading: false,
          };
        });
    }

    function updateSummaries(sensorDataGrup, group) {
      envSumm.value.forEach((summary) => {
        const sensors = ["temp", "hum", "co2"];

        sensors.forEach((sensor) => {
          const data = sensorDataGrup[group].map((d) => parseFloat(d[sensor]));

          if (summary.name === "Max") {
            const maxVal = data.reduce((max, val) => (val > max ? val : max), -Infinity);
            summary[sensor] = formatNumberWithK(maxVal);
          } else if (summary.name === "Min") {
            summary[sensor] = data.reduce((min, val) => (val < min ? val : min), Infinity).toFixed(1);
          } else if (summary.name === "Avg") {
            const avg = data.reduce((acc, val) => acc + val, 0) / data.length;
            summary[sensor] = formatNumberWithK(avg);
          } else if (summary.name === "Day") {
            const lastReadingTime = new Date();
            const formattedDate = formatDateToDDMMYYYY(lastReadingTime);
            summary[sensor] = formattedDate;
          }
        });
      });
    }

    function formatNumberWithK(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
      } else if (num >= 1000) {
        return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "k";
      }
      return num.toFixed(1);
    }

    function groupSensorDataByTimeframe(data, interval, custom = false) {
      const groupedData = [];

      let currentTime;
      if (custom) {
        currentTime = new Date(customDate.value).getTime();
      } else {
        currentTime = new Date().getTime();
      }

      let intervalMs;

      switch (
        interval // in millisecond
      ) {
        case "1h":
          intervalMs = 60 * 60 * 1000;
          break;
        case "3h":
          intervalMs = 3 * 60 * 60 * 1000;
          break;
        case "12h":
          intervalMs = 12 * 60 * 60 * 1000;
          break;
        case "1d":
          intervalMs = 24 * 60 * 60 * 1000;
          break;
        case "1w":
          intervalMs = 7 * 24 * 60 * 60 * 1000;
          break;
        case "1m":
          intervalMs = 30 * 24 * 60 * 60 * 1000;
          break;
        default:
          intervalMs = 60 * 60 * 1000;
      }

      let tempData = [];

      data.forEach((item) => {
        const time = new Date(item.created_at).getTime();
        const parsedItem = {
          ...item,
          temp: parseFloat(item.temp),
          hum: parseFloat(item.hum),
          co2: parseFloat(item.co2),
        };

        if (currentTime - time <= intervalMs) {
          tempData.push(parsedItem);
        } else if (tempData.length) {
          groupedData.push(tempData);
          tempData = [];
        }
      });

      if (tempData.length) {
        groupedData.push(tempData);
      }

      return groupedData;
    }

    function restructureSensorData(sensorDataGrup) {
      const newSensorDataGrup = {};

      for (const timeframe in sensorDataGrup) {
        newSensorDataGrup[timeframe] = sensorDataGrup[timeframe].length > 0 ? sensorDataGrup[timeframe][0] : [];
      }

      return newSensorDataGrup;
    }

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768; // Set true if width is <= 768px
    };

    async function onSyncClick() {
      iscontentLoad.value = true;
      sensorDataGrup = {
        "1h": [],
        "3h": [],
        "12h": [],
        "1d": [],
        "1w": [],
        "1m": [],
      };
      updateUrl();
      p.value = 0;
      x.value = "1h";
      customDateActive.value = false;
      getDataSummary("1h");
    }

    async function onSyncCustom(value1, useCustom = false) {
      iscontentLoad.value = true;
      sensorDataGrup = {
        "1h": [],
        "3h": [],
        "12h": [],
        "1d": [],
        "1w": [],
        "1m": [],
      };
      getDataSummary(value1, useCustom, true);
    }

    onMounted(() => {
      updateUrl();
      checkScreenSize(); // Initial check
      window.addEventListener("resize", checkScreenSize); // Listen to window resize
      notification.value = {
        visible: true,
        message: "Fetching data...",
        success: false,
        loading: true,
      };
      getDataEnvi();
      getDataSummary("1h");
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

    watch(customDate, (newValue, oldValue) => {
      if (newValue !== initialDate.value && customDateActive.value === true) {
        handleDateChange(newValue, oldValue);
      }
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
