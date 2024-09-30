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
        <li v-for="(item, index) in environtment" :key="index" class="relative w-60 gap-3 py-2 px-3 bg-gray-50 border border-gray-300 rounded min-h-16" role="presentation">
          <p class="text-xs text-gray-500 mb-1">{{ isMobile ? getMobileLabel(item.name) : item.name }}</p>
          <h5 :class="[isMobile ? 'text-xs2' : 'text-sm']" class="text-gray-900 font-medium">
            {{ item.value }} <sup class="satuan-label">{{ item.satuan }}</sup>
          </h5>
          <h5 :class="[isMobile ? 'satuan-label1-mobile' : 'satuan-label1']">{{ item.isGreaterThan }}</h5>
          <h5 :class="[isMobile ? 'satuan-label2-mobile' : 'satuan-label2']">{{ item.isLowerThan }}</h5>
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
              <div class="w-full grid grid-cols-10 gap-4 justify-between">
                <div v-if="isMobile" class="font-bold text-gray-700 flex items-center ml-2 text-xs">Param</div>
                <div v-if="!isMobile" class="font-bold text-gray-700 flex items-center ml-2">Parameter</div>
                <div v-for="(item, index) in envSummResult" :key="index" class="font-bold text-gray-700 flex items-center">
                  <span
                    :class="{
                      'text-xs ml-8': isMobile,
                      'ml-12': item.name === 'RH(2)',
                      'ml-12': item.name === 'RH(3)',
                      'ml-12': item.name === 'RH(All)',
                    }"
                    v-if="isMobile"
                  >
                    <p class="">{{ isMobile ? getMobileLabel(item.name) : item.name }}</p>
                  </span>
                  <span v-if="!isMobile">
                    {{ item.name }}
                  </span>
                </div>
              </div>
            </li>

            <!-- Data Rows -->
            <li v-for="(item, index) in envSumm" :key="index" class="w-full text-left p-3 border-b border-gray-300 flex justify-between hover:bg-gray-100 transition">
              <div class="w-full grid grid-cols-10 gap-4 justify-between">
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
                <div v-if="isMobile" class="font-semibold text-gray-700 text-xs2 ml-8">{{ item.rh1 }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700">{{ item.rh1 }}</div>
                <div v-if="isMobile" class="font-semibold text-gray-700 text-xs2 ml-8">{{ item.temp1 }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700">{{ item.temp1 }}</div>
                <div v-if="isMobile" class="font-semibold text-gray-700 text-xs2 ml-8">{{ item.rh2 }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700">{{ item.rh2 }}</div>
                <div v-if="isMobile" class="font-semibold text-gray-700 text-xs2 ml-8">{{ item.temp2 }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700">{{ item.temp2 }}</div>
                <div v-if="isMobile" class="font-semibold text-gray-700 text-xs2 ml-8">{{ item.rh3 }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700">{{ item.rh3 }}</div>
                <div v-if="isMobile" class="font-semibold text-gray-700 text-xs2 ml-8">{{ item.temp3 }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700">{{ item.temp3 }}</div>
                <div v-if="isMobile" class="font-semibold text-gray-700 text-xs2 ml-8">{{ item.rh4 }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700">{{ item.rh4 }}</div>
                <div v-if="isMobile" class="font-semibold text-gray-700 text-xs2 ml-8">{{ item.temp4 }}</div>
                <div v-if="!isMobile" class="font-semibold text-gray-700">{{ item.temp4 }}</div>
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { ContentLoader } from "vue-content-loader";
import ContentLoaderComponent from "@/components/ContentLoaderComponent.vue";

export default {
  name: "Glasshouse",
  components: {
    MenuList,
    ApexChart,
    ContentLoader,
    ContentLoaderComponent,
  },

  setup() {
    const p = ref(0),
      W = ref({}), // Chart
      S = ref([]),
      x = ref("1h"),
      m = ref(false),
      A = ref("Environment"),
      lastUpdate = ref(""),
      customDate = ref(""),
      initialDate = ref(""),
      isMobile = ref(false),
      isLoading = ref(false),
      iscontentLoad = ref(true),
      customDateActive = ref(false),
      modelOptions = ref([{ id: 1, name: "Environment" }]),
      notification = ref({
        visible: false,
        message: "",
        success: false,
        loading: false,
      });

    let lastReadingTime = ref(null),
      templimitdown,
      templimitup,
      humlimitdown,
      humlimitup,
      url1 = "https://inamas.id/dev/petro/glasshouse/?lastdata",
      url2 = "https://inamas.id/dev/petro/glasshouse/?setpoint",
      url3 = "",
      sensorDataGrup = {
        "1h": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "3h": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "12h": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "1d": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "1w": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "1m": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
      };

    const getMobileLabel = (name) => {
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
      },
      getIconPath = (name) => {
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
      },
      env_date_filter = ref([
        { name: "1h", value: "1h" },
        { name: "3h", value: "3h" },
        { name: "12h", value: "12h" },
        { name: "1d", value: "1d" },
        { name: "1w", value: "1w" },
        { name: "1m", value: "1m" },
      ]),
      envSummResult = ref([
        { name: "RH(1)", value: null },
        { name: "Temp(1)", value: null },
        { name: "RH(2)", value: null },
        { name: "Temp(2)", value: null },
        { name: "RH(3)", value: null },
        { name: "Temp(3)", value: null },
        { name: "RH(All)", value: null },
        { name: "Temp(All)", value: null },
      ]),
      environtment = ref([
        { name: "Temp(1)", satuan: "°C", value: null, isGreaterThan: "", isLowerThan: "" },
        { name: "RH(1)", satuan: "%", value: null, isGreaterThan: "", isLowerThan: "" },
        { name: "Temp(2)", satuan: "°C", value: null, isGreaterThan: "", isLowerThan: "" },
        { name: "RH(2)", satuan: "%", value: null, isGreaterThan: "", isLowerThan: "" },
        { name: "Temp(3)", satuan: "°C", value: null, isGreaterThan: "", isLowerThan: "" },
        { name: "RH(3)", satuan: "%", value: null, isGreaterThan: "", isLowerThan: "" },
      ]),
      menuList = [
        { id: 1, title: "Value Setting", route: { name: "value-setting-gl" }, icon: "value-setting.svg" },
        { id: 2, title: "Device Detail", route: { name: "" }, icon: "device-detail.svg" },
        { id: 3, title: "Detail Info", route: { name: "", params: { id: "1" } }, icon: "detail-info.svg" },
        { id: 4, title: "Feature Setting", route: { name: "" }, icon: "feature-setting.svg" },
        { id: 5, title: "Export Data", route: { name: "" }, icon: "export-data.svg" },
      ],
      envSumm = ref([
        { name: "Max", value: "Max", rh1: null, temp1: null, rh2: null, temp2: null, rh3: null, temp3: null, rh4: 1, temp4: 1 },
        { name: "Min", value: "Min", rh1: null, temp1: null, rh2: null, temp2: null, rh3: null, temp3: null, rh4: null, temp4: null },
        { name: "Avg", value: "Avg", rh1: null, temp1: null, rh2: null, temp2: null, rh3: null, temp3: null, rh4: null, temp4: null },
        { name: "Day", value: "Day", rh1: null, temp1: null, rh2: null, temp2: null, rh3: null, temp3: null, rh4: null, temp4: null },
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

    const updateChart = (sensorData, date, custom) => {
        S.value = [];
        const val = [
          { name: "Temp(1)", data: sensorData.K1 },
          { name: "RH(1)", data: sensorData.T1 },
          { name: "Temp(2)", data: sensorData.K2 },
          { name: "RH(2)", data: sensorData.T2 },
          { name: "Temp(3)", data: sensorData.K3 },
          { name: "RH(3)", data: sensorData.T3 },
          { name: "", data: [] },
        ];

        let nowUpdate;
        if (custom) {
          nowUpdate = new Date(customDate.value); // Jika custom = true, gunakan customDate
        } else {
          nowUpdate = new Date(); // Jika custom = false, gunakan waktu saat ini
        }
        const nowplus7 = new Date(nowUpdate.getTime() + 7 * 60 * 60 * 1000);
        nowplus7.setSeconds(0, 0);

        // Define past time intervals
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

        // Add sample points for different time intervals
        if (date === "1h") {
          val[6].data.push({ x: nowplus7, y: parseFloat("") });
          val[6].data.push({ x: oneHourAgo, y: parseFloat("") });
        } else if (date === "3h") {
          val[6].data.push({ x: nowplus7, y: parseFloat("") });
          val[6].data.push({ x: threeHoursAgo, y: parseFloat("") });
        } else if (date === "12h") {
          val[6].data.push({ x: nowplus7, y: parseFloat("") });
          val[6].data.push({ x: twelveHoursAgo, y: parseFloat("") });
        } else if (date === "1d") {
          val[6].data.push({ x: nowplus7, y: parseFloat("") });
          val[6].data.push({ x: yesterday, y: parseFloat("") });
        } else if (date === "1w") {
          val[6].data.push({ x: nowplus7, y: parseFloat("") });
          val[6].data.push({ x: oneWeekAgo, y: parseFloat("") });
        } else if (date === "1m") {
          val[6].data.push({ x: nowplus7, y: parseFloat("") });
          val[6].data.push({ x: oneMonthAgo, y: parseFloat("") });
        }

        S.value = val;
      },
      handleDateChange = (newDate, oldDate) => {
        // console.log(`Date changed from ${oldDate} to ${newDate}`);
        updateUrl(true);
        onSyncCustom("1h", true);
        p.value = 0;
        x.value = "1h";
      },
      onDropdownChange = (event) => {
        A.value = event.target.value;
      },
      handleDateFilterClick = (value, index) => {
        p.value = index;
        x.value = value;

        if (customDateActive.value === false) {
          updateChart(sensorDataGrup[value], value, false);
        } else {
          updateChart(sensorDataGrup[value], value, true);
        }
        updateSummaries(sensorDataGrup, value);
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
        colors: ["#F08583", "#60ABA8", "#d6b2f0", "#fdd97c", "#b433ff", "#c1f0b2", "#FFFFFF"],
      });

    const fahrenheitToCelsius = (fahrenheit) => {
        const temp = parseFloat(fahrenheit);

        if (isNaN(temp)) {
          console.warn("Invalid temperature data:", fahrenheit);
          return null;
        }

        return parseFloat((((temp - 32) * 5) / 9).toFixed(2));
      },
      convertToUTCPlus7 = (utcTime) => {
        const utcPlus7 = new Date(utcTime + 7 * 60 * 60 * 1000);
        return utcPlus7.getTime();
      },
      convertToUTCPlus14 = (utcTime) => {
        const utcPlus14 = new Date(utcTime + 14 * 60 * 60 * 1000);
        return utcPlus14.getTime();
      },
      convertToUTCPlus21 = (utcTime) => {
        const utcPlus21 = new Date(utcTime + 21 * 60 * 60 * 1000);
        return utcPlus21.getTime();
      },
      formatDateToDDMMYYYY = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        return `${day}`;
      },
      formatDate = (date) => {
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

    function updateUrl(useCustomDate = false) {
      let selectedDate;
      if (useCustomDate && customDate.value) {
        selectedDate = new Date(customDate.value);
      } else {
        selectedDate = new Date();
      }

      const end1 = new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 19),
        end3 = new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 19);

      const lastMonth = new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)),
        start1 = new Date(selectedDate.getTime() - 17 * 60 * 60 * 1000).toISOString().slice(0, 19),
        start2 = new Date(lastMonth.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 19),
        start3 = new Date(lastMonth.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 19);

      if (useCustomDate) {
        url3 = `https://inamas.id/dev/petro/glasshouse/?dumpdata&start=${start2}&end=${end3}&limit=0&short=DESC`;
      } else {
        url3 = `https://inamas.id/dev/petro/glasshouse/?dumpdata&start=${start3}&end=${end3}&limit=0&short=DESC`;
      }
    }

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

    async function getDatasetpoint(retries = 3, delay = 1000) {
      try {
        const response = await fetch(url2);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const percentValueTemp = parseInt(data.advice.tempTol);
        const percentValueHum = parseInt(data.advice.humTol);
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
          return getDatasetpoint(retries - 1, delay * 5); // Delay for next retry
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
        const sensors = data.sensors;
        updateEnvironmentData(sensors);
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

    async function getDataSummary(value1, useCustom = false) {
      try {
        const response4 = await fetch(url3),
          data4 = await response4.json();

        if (useCustom) {
          processData(data4.sensors, true);
        } else {
          processData(data4.sensors);
        }

        updateChart(sensorDataGrup[value1], value1, useCustom);
        updateSummaries(sensorDataGrup, value1);

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
      } catch (error) {
        notification.value = {
          visible: true,
          message: "Error fetching data: " + error.message,
          success: false,
          loading: false,
        };
        setTimeout(() => {
          notification.value.visible = false;
        }, 2000);
      }
    }

    function processData(sensors, useCustom = false) {
      const sensorIds = Object.keys(sensors);
      let now;

      if (useCustom) {
        now = new Date(customDate.value);
        now.setUTCHours(now.getUTCHours() - 14);
      } else {
        now = new Date();
        now.setUTCHours(now.getUTCHours() - 14);
      }

      sensorIds.forEach((sensorId, index) => {
        const readings = sensors[sensorId];

        if (readings.length > 0) {
          readings.sort((a, b) => new Date(b.observed) - new Date(a.observed));

          let enIndex = getEnIndex(index);
          const processedTimeKeys = new Map();

          readings.forEach((reading) => {
            const readingTime = new Date(reading.observed);
            const convertedTime = convertToUTCPlus21(readingTime.getTime());
            const temperature = fahrenheitToCelsius(reading.temperature);
            const humidity = parseFloat(reading.humidity);

            // Determine the time interval: 1 minute for short-term, 10 minutes for long-term
            const isLongTerm = readingTime.getTime() <= now.getTime() - 24 * 60 * 60 * 1000; // More than 24 hours ago
            const interval = isLongTerm ? 60 : 1;

            const timeInterval = Math.floor(readingTime.getUTCMinutes() / interval) * interval;
            const timeKey = `${readingTime.getUTCFullYear()}-${String(readingTime.getUTCMonth() + 1).padStart(2, "0")}-${String(readingTime.getUTCDate()).padStart(2, "0")}-${String(readingTime.getUTCHours()).padStart(2, "0")}:${String(
              timeInterval
            ).padStart(2, "0")}`;

            if (!processedTimeKeys.has(timeKey)) {
              processedTimeKeys.set(timeKey, true);

              // Short-term data (1h, 3h, 12h, 1d) with 1-minute interval
              if (!isLongTerm) {
                const oneHourAgo = new Date(now);
                oneHourAgo.setHours(oneHourAgo.getHours() - 1);
                if (readingTime >= oneHourAgo && readingTime <= now) {
                  pushData(sensorDataGrup["1h"], enIndex, convertedTime, temperature, humidity);
                }

                const threeHoursAgo = new Date(now);
                threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
                if (readingTime >= threeHoursAgo && readingTime <= now) {
                  pushData(sensorDataGrup["3h"], enIndex, convertedTime, temperature, humidity);
                }

                const twelveHoursAgo = new Date(now);
                twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);
                if (readingTime >= twelveHoursAgo && readingTime <= now) {
                  pushData(sensorDataGrup["12h"], enIndex, convertedTime, temperature, humidity);
                }

                const oneDayAgo = new Date(now);
                oneDayAgo.setHours(oneDayAgo.getHours() - 24);
                if (readingTime >= oneDayAgo && readingTime <= now) {
                  pushData(sensorDataGrup["1d"], enIndex, convertedTime, temperature, humidity);
                }
              }

              // Long-term data (1w, 1m) with 10-minute interval
              const oneWeekAgo = new Date(now);
              oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
              if (readingTime >= oneWeekAgo && readingTime <= now) {
                pushData(sensorDataGrup["1w"], enIndex, convertedTime, temperature, humidity);
              }

              const oneMonthAgo = new Date(now);
              oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
              if (readingTime >= oneMonthAgo && readingTime <= now) {
                pushData(sensorDataGrup["1m"], enIndex, convertedTime, temperature, humidity);
              }
            }
          });
        }
      });
    }

    function getEnIndex(index) {
      if (index === 1) return 2;
      if (index === 2) return 1;
      return index;
    }

    const updateEnvironmentData = (sensors) => {
      const sensorIds = Object.keys(sensors);

      sensorIds.forEach((sensorId, index) => {
        const readings = sensors[sensorId];
        if (readings.length > 0) {
          readings.sort((a, b) => new Date(b.observed) - new Date(a.observed));

          const latestReading = readings[0];
          const temperatureCelsius = fahrenheitToCelsius(latestReading.temperature);

          let envIndex;
          if (index === 1) {
            envIndex = 2;
          } else if (index === 2) {
            envIndex = 1;
          } else {
            envIndex = index;
          }

          if (envIndex < environtment.value.length / 2) {
            environtment.value[envIndex * 2].value = temperatureCelsius;
            environtment.value[envIndex * 2 + 1].value = latestReading.humidity;

            // Compare temperature and humidity
            const tempGreaterThanThreshold = temperatureCelsius > templimitup;
            const tempLowerThanThreshold = temperatureCelsius < templimitdown;
            environtment.value[envIndex * 2].isGreaterThan = tempGreaterThanThreshold || tempLowerThanThreshold ? "." : "";
            environtment.value[envIndex * 2].isLowerThan = temperatureCelsius <= templimitup && temperatureCelsius >= templimitdown ? "." : "";

            const humGreaterThanThreshold = latestReading.humidity > humlimitup;
            const humLowerThanThreshold = latestReading.humidity < humlimitdown;
            environtment.value[envIndex * 2 + 1].isGreaterThan = humGreaterThanThreshold || humLowerThanThreshold ? "." : "";
            environtment.value[envIndex * 2 + 1].isLowerThan = latestReading.humidity <= humlimitup && latestReading.humidity >= humlimitdown ? "." : "";
          }
          lastReadingTime.value = latestReading.observed;
        }
      });
    };

    function pushData(target, index, convertedTime, temperature, humidity) {
      if (index === 0) {
        target.K1.push({ x: convertedTime, y: temperature });
        target.T1.push({ x: convertedTime, y: humidity });
      } else if (index === 1) {
        target.K2.push({ x: convertedTime, y: temperature });
        target.T2.push({ x: convertedTime, y: humidity });
      } else if (index === 2) {
        target.K3.push({ x: convertedTime, y: temperature });
        target.T3.push({ x: convertedTime, y: humidity });
      }
    }

    function updateSummaries(sensorDataGrup, group) {
      envSumm.value.forEach((summary) => {
        if (summary.name === "Max") {
          summary.temp1 = parseFloat(Math.max(...sensorDataGrup[group].K1.map((d) => d.y)).toFixed(2));
          summary.rh1 = parseFloat(Math.max(...sensorDataGrup[group].T1.map((d) => d.y)).toFixed(2));
          summary.temp2 = parseFloat(Math.max(...sensorDataGrup[group].K2.map((d) => d.y)).toFixed(2));
          summary.rh2 = parseFloat(Math.max(...sensorDataGrup[group].T2.map((d) => d.y)).toFixed(2));
          summary.temp3 = parseFloat(Math.max(...sensorDataGrup[group].K3.map((d) => d.y)).toFixed(2));
          summary.rh3 = parseFloat(Math.max(...sensorDataGrup[group].T3.map((d) => d.y)).toFixed(2));
          summary.temp4 = ((summary.temp1 + summary.temp2 + summary.temp3) / 3).toFixed(2);
          summary.rh4 = ((summary.rh1 + summary.rh2 + summary.rh3) / 3).toFixed(2);
        } else if (summary.name === "Min") {
          summary.temp1 = parseFloat(Math.min(...sensorDataGrup[group].K1.map((d) => d.y)).toFixed(2));
          summary.rh1 = parseFloat(Math.min(...sensorDataGrup[group].T1.map((d) => d.y)).toFixed(2));
          summary.temp2 = parseFloat(Math.min(...sensorDataGrup[group].K2.map((d) => d.y)).toFixed(2));
          summary.rh2 = parseFloat(Math.min(...sensorDataGrup[group].T2.map((d) => d.y)).toFixed(2));
          summary.temp3 = parseFloat(Math.min(...sensorDataGrup[group].K3.map((d) => d.y)).toFixed(2));
          summary.rh3 = parseFloat(Math.min(...sensorDataGrup[group].T3.map((d) => d.y)).toFixed(2));
          summary.temp4 = ((summary.temp1 + summary.temp2 + summary.temp3) / 3).toFixed(2);
          summary.rh4 = ((summary.rh1 + summary.rh2 + summary.rh3) / 3).toFixed(2);
        } else if (summary.name === "Avg") {
          summary.temp1 = parseFloat((sensorDataGrup[group].K1.reduce((acc, val) => acc + val.y, 0) / sensorDataGrup[group].K1.length).toFixed(2));
          summary.rh1 = parseFloat((sensorDataGrup[group].T1.reduce((acc, val) => acc + val.y, 0) / sensorDataGrup[group].T1.length).toFixed(2));
          summary.temp2 = parseFloat((sensorDataGrup[group].K2.reduce((acc, val) => acc + val.y, 0) / sensorDataGrup[group].K2.length).toFixed(2));
          summary.rh2 = parseFloat((sensorDataGrup[group].T2.reduce((acc, val) => acc + val.y, 0) / sensorDataGrup[group].T2.length).toFixed(2));
          summary.temp3 = parseFloat((sensorDataGrup[group].K3.reduce((acc, val) => acc + val.y, 0) / sensorDataGrup[group].K3.length).toFixed(2));
          summary.rh3 = parseFloat((sensorDataGrup[group].T3.reduce((acc, val) => acc + val.y, 0) / sensorDataGrup[group].T3.length).toFixed(2));
          summary.temp4 = ((summary.temp1 + summary.temp2 + summary.temp3) / 3).toFixed(2);
          summary.rh4 = ((summary.rh1 + summary.rh2 + summary.rh3) / 3).toFixed(2);
        } else if (summary.name === "Day") {
          const lastReadingTime = new Date();
          const formattedDate = formatDateToDDMMYYYY(lastReadingTime);
          summary.temp1 = formattedDate;
          summary.rh1 = formattedDate;
          summary.temp2 = formattedDate;
          summary.rh2 = formattedDate;
          summary.temp3 = formattedDate;
          summary.rh3 = formattedDate;
          summary.temp4 = formattedDate;
          summary.rh4 = formattedDate;
        }
      });
    }

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768; // Set true if width is <= 768px
    };

    async function onSyncClick() {
      iscontentLoad.value = true;
      customDateActive.value = false;
      sensorDataGrup = {
        "1h": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "3h": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "12h": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "1d": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "1w": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "1m": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
      };
      getDataSummary("1h");
      p.value = 0;
      x.value = "1h";
    }
    async function onSyncCustom(value1, useCustom = false) {
      iscontentLoad.value = true;
      sensorDataGrup = {
        "1h": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "3h": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "12h": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "1d": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "1w": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
        "1m": { K1: [], T1: [], K2: [], T2: [], K3: [], T3: [] },
      };
      getDataSummary(value1, useCustom);
    }

    async function updateDataenvi() {
      await getDatasetpoint();
      getDataEnvi();
      lastUpdate.value = new Date().toLocaleString();
    }

    onMounted(() => {
      placeHolderdate;
      updateUrl();
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      notification.value = {
        visible: true,
        message: "Fetching data...",
        success: false,
        loading: true,
      };
      updateDataenvi();
      getDataSummary("1h");
      setInterval(() => {
        updateDataenvi();
      }, 1000);
      setInterval(() => {
        getDataSummary("1h");
      }, 3600000);
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
      onSyncClick,
      updateChart,
      environtment,
      chartOptions,
      modelOptions,
      notification,
      envSummResult,
      iscontentLoad,
      getMobileLabel,
      updateDataenvi,
      env_date_filter,
      placeHolderdate,
      customDateActive,
      onDropdownChange,
      toggleCustomDate,
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
