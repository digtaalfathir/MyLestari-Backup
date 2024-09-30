<template>
  <!-- Loading overlay -->
  <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
  </div>

  <!-- Notification -->
  <transition name="fade">
    <div v-if="notification.visible" :class="['notification', notification.success ? 'success' : 'error']">
      <div class="notification-icon">
        <svg v-if="notification.success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="notification-svg">
          <path d="M9 16.172l-4.586-4.586a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.828 0L9 11.586l5.172-5.172a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.828L9 16.172z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="notification-svg">
          <path d="M12 2v20M2 12h20" />
        </svg>
      </div>
      <div class="notification-message">{{ notification.message }}</div>
      <button class="notification-close" @click="notification.visible = false">×</button>
    </div>
  </transition>

  <!-- Title -->
  <div class="h-full text-center text-black flex flex-col items-center px-5">
    <div class="w-full my-3">
      <!-- HeaderBack -->
      <HeaderBack title="Value Setting" />

      <!-- Tabs -->
      <ul class="mt-4 flex justify-around lg:justify-start list-none flex-row ps-0 bg-gray-100 lg:bg-white border border-gray/300 rounded-lg lg:rounded-t-lg lg:rounded-b-none" role="tablist" data-tabs-toggle="#tab-content">
        <li
          v-for="(tab, index) in d.tabs"
          :key="index"
          role="presentation"
          :class="['w-full lg:w-auto border-l lg:border-none border-l-gray-200 first:border-l-0', { 'tabs-active2': tab.active, 'first:tabs-active2-l last:tabs-active2-r': index === 0 || index === d.tabs.length - 1 }]"
        >
          <button
            :href="'#' + tab.href"
            @click="selectTab(index)"
            class="h-full w-full block pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-black p-4 rounded-none hover:text-primary focus:text-primary active:text-primary"
            role="tab"
            :aria-controls="tab.href"
            :aria-selected="tab.active.toString()"
          >
            {{ tab.name }}
          </button>
        </li>
      </ul>

      <div id="tab-content" class="mt-4 lg:mt-0 mb-5 ps-0 lg:border-x lg:border-b lg:border-gray-300 lg:rounded-b-lg lg:p-4">
        <div v-for="tab in d.tabs" :key="tab.href" :id="tab.href" role="tabpanel" :aria-labelledby="tab.href" v-show="tab.active">
          <!-- Fan and Chiller Tab Content -->
          <div v-if="tab.href === 'tabs-fan'" key="1">
            <div class="bg-form-group border border-gray/300 rounded-lg p-4 mb-4">
              <div class="flex justify-between">
                <!-- Fan Mode Buttons -->
                <label class="text-left gap-8 text-sm font-semibold leading-8">Mode</label>
                <div class="flex border border-gray-200 rounded">
                  <button @click="setFanMode('auto')" :class="['text-xs rounded-l p-2 w-[64px] bg-gray-100', { 'switch-active': isActiveFanMode('auto') }]">Auto</button>
                  <button @click="setFanMode('manual')" :class="['text-xs rounded-l p-2 w-[64px] bg-gray-100', { 'switch-active': isActiveFanMode('manual') }]">Manual</button>
                </div>
              </div>
            </div>

            <!-- Fan Manual Mode Content -->
            <div v-if="d.fan_mode === 'manual'" class="p-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-4">
                  <div v-for="fan in 4" :key="'fan' + fan" class="bg-form-group border border-gray-300 rounded-lg p-4">
                    <div class="flex justify-between items-center">
                      <p class="text-sm font-semibold leading-8">Fan ({{ fan }})</p>
                      <div class="relative inline-block">
                        <label :for="'fan' + fan + '-switch'" class="flex items-center cursor-pointer">
                          <div class="relative">
                            <input type="checkbox" :id="'fan' + fan + '-switch'" v-model="fanStates[fan]" class="sr-only" />
                            <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" :class="{ 'translate-x-full': fanStates[fan] }"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-4">
                  <div v-for="chiller in 4" :key="'chiller' + chiller" class="bg-form-group border border-gray-300 rounded-lg p-4">
                    <div class="flex justify-between items-center">
                      <p class="text-sm font-semibold leading-8">Chiller({{ chiller }})</p>
                      <div class="relative inline-block">
                        <label :for="'chiller' + chiller + '-switch'" class="flex items-center cursor-pointer">
                          <div class="relative">
                            <!-- Bind v-model to checkbox state -->
                            <input type="checkbox" :id="'chiller' + chiller + '-switch'" v-model="chillerStates[chiller]" class="sr-only" />
                            <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" :class="{ 'translate-x-full': chillerStates[chiller] }"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fan Auto Mode Content -->
            <div v-if="d.fan_mode === 'auto'">
              <!-- Temperature Content -->
              <ul class="my-striped-list mt-4 mb-5 list-none bg-white border border-gray/300 rounded-b-lg">
                <li class="relative w-full gap-3 p-3">
                  <p class="text-left gap-8 text-sm font-semibold leading-8">Temperature</p>
                </li>
                <li class="relative w-full gap-3 p-3">
                  <div class="grid grid-cols-2 gap-4 justify-around">
                    <div class="input-containerx">
                      <p
                        class="text-center gap-8 font-semibold leading-8 text-sm2"
                        :style="{
                          marginLeft: isMobile ? '-0.5rem' : '0',
                          marginRight: isMobile ? '0' : '2.5rem',
                        }"
                      >
                        Target
                      </p>
                      <input type="number" placeholder="00.0" :class="zt2.modelClass" id="tempInput" />
                      <span class="unit-labelx">°C</span>
                    </div>
                    <div class="input-containerx">
                      <p
                        class="text-center gap-8 font-semibold leading-8 text-sm2"
                        :style="{
                          marginLeft: isMobile ? '-0.5rem' : '0',
                          marginRight: isMobile ? '0' : '2.5rem',
                        }"
                      >
                        Tolerance
                      </p>
                      <input type="number" placeholder="00.0" :class="zt2.modelClass" id="tempToleInput" />
                      <span class="unit-labelx">°C</span>
                    </div>
                  </div>
                </li>
              </ul>
              <!-- Humidity Content -->
              <ul class="my-striped-list mt-4 mb-5 list-none bg-white border border-gray/300 rounded-b-lg">
                <li class="relative w-full gap-3 p-3">
                  <p class="text-left gap-8 text-sm font-semibold leading-8">Humidity</p>
                </li>
                <li class="relative w-full gap-3 p-3">
                  <div class="grid grid-cols-2 gap-4 justify-around">
                    <div class="input-containerx">
                      <p
                        class="text-center gap-8 font-semibold leading-8 text-sm2"
                        :style="{
                          marginLeft: isMobile ? '-0.5rem' : '0',
                          marginRight: isMobile ? '0' : '2.5rem',
                        }"
                      >
                        Target
                      </p>
                      <input type="number" placeholder="00.0" :class="zt2.modelClass" id="humInput" />
                      <span class="unit-labelx">%</span>
                    </div>
                    <div class="input-containerx">
                      <p
                        class="text-center gap-8 font-semibold leading-8 text-sm2"
                        :style="{
                          marginLeft: isMobile ? '-0.5rem' : '0',
                          marginRight: isMobile ? '0' : '2.5rem',
                        }"
                      >
                        Tolerance
                      </p>
                      <input type="number" placeholder="00.0" :class="zt2.modelClass" id="humToleInput" />
                      <span class="unit-labelx">%</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- Save Button -->
            <div class="flex justify-end">
              <button @click="postData" class="py-2 px-9 bg-primary border border-gray-300 text-white text-sm rounded-lg flex justify-center">Save</button>
            </div>
          </div>
        </div>
      </div>
      <p class="flex justify-end mr-2 text-gray-500 text-sm">Last Update : {{ lastUpdate }}</p>
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import { useRouter } from "vue-router";
import HeaderBack from "@/components/HeaderBack.vue";
import { ref, onMounted, reactive, watch, onUnmounted } from "vue";

export default {
  name: "ValueSettingGl",
  components: {
    HeaderBack,
  },
  setup() {
    const url = "https://inamas.id/dev/petro/glasshouse/?setpoint",
      router = useRouter(),
      fan_mode = ref("auto"),
      lastUpdate = ref(""),
      isMobile = ref(false);

    let loading = ref(false),
      notification = ref({
        visible: false,
        message: "",
        success: false,
      }),
      isFanOpen = ref(false),
      isChillerOpen = ref(false);

    const toggleFanCheckboxes = () => {
        isFanOpen.value = !isFanOpen.value;
      },
      toggleChillerCheckboxes = () => {
        isChillerOpen.value = !isChillerOpen.value;
      },
      activateCheckbox = (type, index) => {
        if (type === "fan" && fanStates.hasOwnProperty(index)) {
          fanStates[index] = true;
        } else if (type === "chiller" && chillerStates.hasOwnProperty(index)) {
          chillerStates[index] = true;
        }
      },
      nonactivateCheckbox = (type, index) => {
        if (type === "fan" && fanStates.hasOwnProperty(index)) {
          fanStates[index] = false;
        } else if (type === "chiller" && chillerStates.hasOwnProperty(index)) {
          chillerStates[index] = false;
        }
      },
      checkScreenSize = () => {
        isMobile.value = window.innerWidth <= 768; // Threshold for mobile view
      };

    const fanStates = reactive({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      }),
      chillerStates = reactive({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      });

    const selectTab = (index) => {
        d.value.tabs.forEach((tab, i) => {
          tab.active = i === index;
        });
      },
      d = ref({
        tabs: [{ active: true, name: "Fan and Chiller", href: "tabs-fan" }],
        fan_mode: "auto",
      });

    const setFanMode = (mode) => {
        updateDataSetpoint(mode);
        isFanOpen.value = false;
        isChillerOpen.value = false;
        d.value.fan_mode = mode;
      },
      isActiveFanMode = (mode) => {
        return d.value.fan_mode === mode;
      };

    function getMD5HashFromDate(date) {
      return CryptoJS.MD5(date).toString();
    }

    function getInputValue(id) {
      const inputElement = document.getElementById(id);
      return inputElement ? parseInt(inputElement.value, 10) : 0;
    }

    function getCheckboxStatus(id) {
      const checkboxElement = document.getElementById(id);
      return checkboxElement ? (checkboxElement.checked ? 1 : 0) : 0;
    }

    function getDataSetpoint() {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.advice.auto === "1") {
            setFanMode("auto");
            isActiveFanMode("auto");
            if (data.advice.tempTh !== undefined) {
              document.getElementById("tempInput").value = data.advice.tempTh;
            }
            if (data.advice.humTh !== undefined) {
              document.getElementById("humInput").value = data.advice.humTh;
            }
            if (data.advice.tempTol !== undefined) {
              document.getElementById("tempToleInput").value = data.advice.tempTol;
            }
            if (data.advice.humTol !== undefined) {
              document.getElementById("humToleInput").value = data.advice.humTol;
            }
          } else {
            setFanMode("manual");
            isActiveFanMode("manual");
            if (data.advice.fan1 === "1") {
              activateCheckbox("fan", 1);
            }
            if (data.advice.fan2 === "1") {
              activateCheckbox("fan", 2);
            }
            if (data.advice.fan3 === "1") {
              activateCheckbox("fan", 3);
            }
            if (data.advice.fan4 === "1") {
              activateCheckbox("fan", 4);
            }
            if (data.advice.chiller1 === "1") {
              activateCheckbox("chiller", 1);
            }
            if (data.advice.chiller2 === "1") {
              activateCheckbox("chiller", 2);
            }
            if (data.advice.chiller3 === "1") {
              activateCheckbox("chiller", 3);
            }
            if (data.advice.chiller4 === "1") {
              activateCheckbox("chiller", 4);
            }
          }

          lastUpdate.value = data.advice.updated_at;
        })
        .catch((error) => {
          notification.value = {
            visible: true,
            message: "Gagal menerima data: " + error.message,
            success: false,
          };
          setTimeout(() => {
            notification.value.visible = false;
          }, 2000);
        });
    }

    function updateDataSetpoint(mode) {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          nonactivateCheckbox("fan", 5);
          nonactivateCheckbox("chiller", 5);
          if (mode === "auto") {
            if (data.advice.tempTh !== undefined) {
              document.getElementById("tempInput").value = data.advice.tempTh;
            }
            if (data.advice.humTh !== undefined) {
              document.getElementById("humInput").value = data.advice.humTh;
            }
            if (data.advice.tempTol !== undefined) {
              document.getElementById("tempToleInput").value = data.advice.tempTol;
            }
            if (data.advice.humTol !== undefined) {
              document.getElementById("humToleInput").value = data.advice.humTol;
            }
          } else {
            if (data.advice.fan1 === "1") {
              activateCheckbox("fan", 1);
            }
            if (data.advice.fan2 === "1") {
              activateCheckbox("fan", 2);
            }
            if (data.advice.fan3 === "1") {
              activateCheckbox("fan", 3);
            }
            if (data.advice.fan4 === "1") {
              activateCheckbox("fan", 4);
            }
            if (data.advice.fan1 === "1" && data.advice.fan2 === "1" && data.advice.fan3 === "1" && data.advice.fan4 === "1") {
              activateCheckbox("fan", 5);
            }
            if (data.advice.chiller1 === "1") {
              activateCheckbox("chiller", 1);
            }
            if (data.advice.chiller2 === "1") {
              activateCheckbox("chiller", 2);
            }
            if (data.advice.chiller3 === "1") {
              activateCheckbox("chiller", 3);
            }
            if (data.advice.chiller4 === "1") {
              activateCheckbox("chiller", 4);
            }
            if (data.advice.chiller1 === "1" && data.advice.chiller2 === "1" && data.advice.chiller3 === "1" && data.advice.chiller4 === "1") {
              activateCheckbox("chiller", 5);
            }
          }
        })
        .catch((error) => {
          notification.value = {
            visible: true,
            message: "Gagal menerima data: " + error.message,
            success: false,
          };
          setTimeout(() => {
            notification.value.visible = false;
          }, 2000);
        });
    }

    const postData = () => {
      const utcDate = new Date(),
        utcPlus7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000),
        today = utcPlus7Date.toISOString().split("T")[0],
        key = getMD5HashFromDate(today),
        tempInputValue = getInputValue("tempInput"),
        humInputValue = getInputValue("humInput"),
        tempToleInputValue = getInputValue("tempToleInput"),
        humToleInputValue = getInputValue("humToleInput"),
        fan1SwitchValue = getCheckboxStatus("fan1-switch"),
        fan2SwitchValue = getCheckboxStatus("fan2-switch"),
        fan3SwitchValue = getCheckboxStatus("fan3-switch"),
        fan4SwitchValue = getCheckboxStatus("fan4-switch"),
        chiller1SwitchValue = getCheckboxStatus("chiller1-switch"),
        chiller2SwitchValue = getCheckboxStatus("chiller2-switch"),
        chiller3SwitchValue = getCheckboxStatus("chiller3-switch"),
        chiller4SwitchValue = getCheckboxStatus("chiller4-switch"),
        data =
          d.value.fan_mode === "manual"
            ? {
                [key]: {
                  auto: 0,
                  fan1: fan1SwitchValue,
                  fan2: fan2SwitchValue,
                  fan3: fan3SwitchValue,
                  fan4: fan4SwitchValue,
                  chiller1: chiller1SwitchValue,
                  chiller2: chiller2SwitchValue,
                  chiller3: chiller3SwitchValue,
                  chiller4: chiller4SwitchValue,
                },
              }
            : {
                [key]: {
                  auto: 1,
                  tempTh: tempInputValue,
                  humTh: humInputValue,
                  tempTol: tempToleInputValue,
                  humTol: humToleInputValue,
                },
              };

      loading.value = true;
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error("Gagal mengirim data: " + errorData.message);
            });
          }
          return response.json();
        })
        .then(() => {
          notification.value = {
            visible: true,
            message: "Berhasil mengirim data",
            success: true,
          };
        })
        .catch((error) => {
          notification.value = {
            visible: true,
            message: "Gagal mengirim data: " + error.message,
            success: false,
          };
        })
        .finally(() => {
          loading.value = false;
          setTimeout(() => {
            notification.value.visible = false;
          }, 2000);
        });
    };

    onMounted(() => {
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      getDataSetpoint();
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkScreenSize);
    });

    return {
      getDataSetpoint,
      updateDataSetpoint,
      fan_mode,
      selectTab,
      setFanMode,
      isActiveFanMode,
      postData,
      loading,
      notification,
      fanStates,
      chillerStates,
      activateCheckbox,
      toggleFanCheckboxes,
      isFanOpen,
      toggleChillerCheckboxes,
      isChillerOpen,
      lastUpdate,
      isMobile,
      d,
      zt2: {
        modelClass: "my-form-input3 bg-gray-100 text-center px-3",
      },
    };
  },
};
</script>
