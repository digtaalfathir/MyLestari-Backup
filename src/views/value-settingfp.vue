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
          <!-- Growlight Tab Content -->
          <div v-if="tab.href === 'tabs-growlight'" key="1">
            <div class="bg-form-group border border-gray/300 rounded-lg p-4 mb-4">
              <div class="flex justify-between">
                <!-- Growlight Mode Buttons -->
                <label class="text-left gap-8 text-sm font-semibold leading-8">Mode</label>
                <div class="flex border border-gray-200 rounded">
                  <button @click="setGrowlightMode('auto')" :class="['text-xs rounded-l p-2 w-[64px] bg-gray-100', { 'switch-active': isActiveGrowlightMode('auto') }]">Auto</button>
                  <button @click="setGrowlightMode('manual')" :class="['text-xs rounded-l p-2 w-[64px] bg-gray-100', { 'switch-active': isActiveGrowlightMode('manual') }]">Manual</button>
                </div>
              </div>
            </div>

            <!-- Growlight Manual Mode Content -->
            <div v-if="d.growlight_mode === 'manual'" class="p-4">
              <div class="grid grid-cols-2 gap-4">
                <!-- Checkbox grow -->
                <div v-for="grow in 6" :key="'grow' + grow" class="bg-form-group border border-gray-300 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <p class="text-sm font-semibold leading-8">Grow({{ grow }})</p>
                    <div class="relative inline-block">
                      <label :for="'grow' + grow + '-switch'" class="flex items-center cursor-pointer">
                        <div class="relative">
                          <input type="checkbox" :id="'grow' + grow + '-switch'" v-model="checkboxes['grow' + grow]" class="sr-only" />
                          <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                          <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" :class="{ 'translate-x-full': checkboxes['grow' + grow] }"></div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Save Button -->
              <div class="flex justify-end mt-4">
                <button @click="postDataGrowlight" class="py-2 px-9 bg-primary border border-gray-300 text-white text-sm rounded-lg flex justify-center">Save</button>
              </div>
            </div>

            <!-- Growlight Auto Mode Content -->
            <div v-if="d.growlight_mode === 'auto'">
              <ul class="my-striped-list mt-4 mb-5 list-none bg-white border border-gray-300 rounded-lg shadow-sm">
                <li class="relative w-full gap-3 p-4 flex items-center justify-between bg-gray-100 rounded-t-lg">
                  <p class="text-left gap-8 text-lg font-semibold text-gray-700 text-sm">Growlight</p>
                  <button @click="addSchedule(0)" class="btn-icon btn-add bg-blue-500 text-white hover:bg-blue-600 rounded-md px-3 py-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 5v14m7-7H5" />
                    </svg>
                    <p class="text-sm font-semibold">Add</p>
                  </button>
                </li>
                <li v-for="(schedule, index) in growSchedule" :key="index" class="relative w-full p-4 flex items-center gap-4 border-b border-gray-200 last:border-b-0">
                  <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 font-semibold rounded-full">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1 grid grid-cols-1 gap-2">
                    <!-- On Time -->
                    <div class="relative">
                      <div
                        :class="{
                          'w-full text-center p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500': true,
                          'p-1': isMobile,
                          'p-2': !isMobile,
                        }"
                      >
                        <input
                          type="time"
                          v-model="schedule.onTime"
                          :disabled="!schedule.editable && !schedule.postMode"
                          :class="{
                            'bg-white': index % 2 === 0,
                            'rounded-md text-right': true,
                            'text-sm pr-10': isMobile,
                            'text-base pr-12': !isMobile,
                          }"
                        />
                      </div>
                      <span
                        :class="{
                          'absolute right-0 flex items-center pointer-events-none rounded-md bg-gray-200 text-gray-700': true,
                          'text-xs top-0 bottom-0 ml-end': isMobile,
                          'inset-y-0 text-sm': !isMobile,
                        }"
                      >
                        On Time
                      </span>
                    </div>

                    <!-- Off Time -->
                    <div class="relative">
                      <div
                        :class="{
                          'w-full text-center p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500': true,
                          'p-1': isMobile,
                          'p-2': !isMobile,
                        }"
                      >
                        <input
                          type="time"
                          v-model="schedule.offTime"
                          :disabled="!schedule.editable && !schedule.postMode"
                          :class="{
                            'bg-white': index % 2 === 0,
                            'rounded-md text-right': true,
                            'text-sm pr-10': isMobile,
                            'text-base pr-12': !isMobile,
                          }"
                        />
                      </div>
                      <span
                        :class="{
                          'absolute right-0 flex items-center pointer-events-none rounded-md bg-gray-200 text-gray-700': true,
                          'text-xs top-0 bottom-0 ml-end': isMobile,
                          'inset-y-0 text-sm': !isMobile,
                        }"
                      >
                        Off Time
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button v-if="schedule.postMode" @click="postScheduleGrow(index)" class="btn-icon btn-save bg-blue-500 text-white hover:bg-blue-600 rounded-md p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 5v14m7-7H5" />
                      </svg>
                    </button>
                    <button v-if="!schedule.postMode && !schedule.editable" @click="editSchedule(index, 0)" class="btn-icon btn-edit bg-yellow-400 text-white hover:bg-yellow-500 rounded-md p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          d="M17.414 2.586a2 2 0 010 2.828l-1.829 1.828-2.829-2.828 1.829-1.829a2 2 0 012.829 0zm-2.828 4.95l-2.828-2.828L4 12.414V15h2.586l8-8zm-7.182 7.485l1.007-2.518 1.511 1.51-2.518 1.008zm10.181-12.334a1 1 0 10-1.414-1.414l-1.828 1.828 2.828 2.828 1.828-1.828a1 1 0 000-1.414z"
                        />
                      </svg>
                    </button>
                    <button v-if="!schedule.postMode && schedule.editable" @click="saveScheduleGrow(index)" class="btn-icon btn-save bg-green-500 text-white hover:bg-green-600 rounded-md p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 16.172l-4.586-4.586a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.828 0L9 11.586l5.172-5.172a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.828L9 16.172z" />
                      </svg>
                    </button>
                    <button v-if="!schedule.postMode" @click="deleteScheduleGrow(index)" class="btn-icon btn-delete bg-red-500 text-white hover:bg-red-600 rounded-md p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fill-rule="evenodd"
                          d="M6.5 2a1.5 1.5 0 00-1.5 1.5V4h-2a.5.5 0 000 1h14a.5.5 0 000-1h-2v-.5A1.5 1.5 0 0013.5 2h-7zm9 3H4v10.5A1.5 1.5 0 005.5 17h9a1.5 1.5 0 001.5-1.5V5zm-2 3a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zm-4 .5a.5.5 0 011 0v6a.5.5 0 01-1 0v-6a.5.5.5 0 01.5-.5z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              </ul>
              <!-- Save Button -->
              <div class="flex justify-end">
                <button @click="saveDataGrowlight" class="py-2 px-9 bg-primary border border-gray-300 text-white text-sm rounded-lg flex justify-center">Save</button>
              </div>
            </div>
          </div>

          <!-- Irrigation Tab Content -->
          <div v-if="tab.href === 'tabs-irrigation'" key="1">
            <div class="bg-form-group border border-gray/300 rounded-lg p-4 mb-4">
              <div class="flex justify-between">
                <!-- Irrigation Mode Buttons -->
                <label class="text-left gap-8 text-sm font-semibold leading-8">Mode</label>
                <div class="flex border border-gray-200 rounded">
                  <button @click="setIrrigationMode('auto')" :class="['text-xs rounded-l p-2 w-[64px] bg-gray-100', { 'switch-active': isActiveIrrigationMode('auto') }]">Auto</button>
                  <button @click="setIrrigationMode('manual')" :class="['text-xs rounded-l p-2 w-[64px] bg-gray-100', { 'switch-active': isActiveIrrigationMode('manual') }]">Manual</button>
                </div>
              </div>
            </div>

            <!-- Irrigation Manual Mode Content -->
            <div v-if="d.irrigation_mode === 'manual'" class="p-4">
              <div class="grid grid-cols-2 gap-4"></div>
              <!-- plantPump Checkboxes -->
              <div class="bg-form-group border border-gray-300 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <p class="text-sm font-semibold leading-8">Plant Pump</p>
                  <div class="relative inline-block">
                    <label :for="'plantPump' + 1 + '-switch'" class="flex items-center cursor-pointer">
                      <div class="relative">
                        <input type="checkbox" :id="'plantPump' + 1 + '-switch'" v-model="checkboxes.plantPump" class="sr-only" />
                        <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                        <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" :class="{ 'translate-x-full': checkboxes.plantPump }"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <!-- Save Button -->
              <div class="flex justify-end mt-4">
                <button @click="postDataIrrigation" class="py-2 px-9 bg-primary border border-gray-300 text-white text-sm rounded-lg flex justify-center">Save</button>
              </div>
            </div>

            <!-- Irrigation Auto Mode Content -->
            <div v-if="d.irrigation_mode === 'auto'">
              <ul class="my-striped-list mt-4 mb-5 list-none bg-white border border-gray-300 rounded-lg shadow-sm">
                <li class="relative w-full gap-3 p-4 flex items-center justify-between bg-gray-100 rounded-t-lg">
                  <p class="text-left gap-8 text-lg font-semibold text-gray-700 text-sm">Irrigation</p>
                  <button @click="addSchedule(1)" class="btn-icon btn-add bg-blue-500 text-white hover:bg-blue-600 rounded-md px-3 py-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 5v14m7-7H5" />
                    </svg>
                    <p class="text-sm font-semibold">Add</p>
                  </button>
                </li>
                <li v-for="(schedule, index) in waterSchedule" :key="index" class="relative w-full p-4 flex items-center gap-4 border-b border-gray-200 last:border-b-0">
                  <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 font-semibold rounded-full">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1 grid grid-cols-1 gap-2">
                    <!-- On Time -->
                    <div class="relative">
                      <div
                        :class="{
                          'w-full text-center p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500': true,
                          'p-1': isMobile,
                          'p-2': !isMobile,
                        }"
                      >
                        <input
                          type="time"
                          v-model="schedule.onTime"
                          :disabled="!schedule.editable && !schedule.postMode"
                          :class="{
                            'bg-white': index % 2 === 0,
                            'rounded-md text-right': true,
                            'text-sm pr-10': isMobile,
                            'text-base pr-12': !isMobile,
                          }"
                        />
                      </div>
                      <span
                        :class="{
                          'absolute right-0 flex items-center pointer-events-none rounded-md bg-gray-200 text-gray-700': true,
                          'text-xs top-0 bottom-0 ml-end': isMobile,
                          'inset-y-0 text-sm': !isMobile,
                        }"
                      >
                        On Time
                      </span>
                    </div>

                    <!-- Off Time -->
                    <div class="relative">
                      <div
                        :class="{
                          'w-full text-center p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500': true,
                          'p-1': isMobile,
                          'p-2': !isMobile,
                        }"
                      >
                        <input
                          type="time"
                          v-model="schedule.offTime"
                          :disabled="!schedule.editable && !schedule.postMode"
                          :class="{
                            'bg-white': index % 2 === 0,
                            'rounded-md text-right': true,
                            'text-sm pr-10': isMobile,
                            'text-base pr-12': !isMobile,
                          }"
                        />
                      </div>
                      <span
                        :class="{
                          'absolute right-0 flex items-center pointer-events-none rounded-md bg-gray-200 text-gray-700': true,
                          'text-xs top-0 bottom-0 ml-end': isMobile,
                          'inset-y-0 text-sm': !isMobile,
                        }"
                      >
                        Off Time
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button v-if="schedule.postMode" @click="postSchedule(index)" class="btn-icon btn-save bg-blue-500 text-white hover:bg-blue-600 rounded-md p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 5v14m7-7H5" />
                      </svg>
                    </button>
                    <button v-if="!schedule.postMode && !schedule.editable" @click="editSchedule(index, 1)" class="btn-icon btn-edit bg-yellow-400 text-white hover:bg-yellow-500 rounded-md p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          d="M17.414 2.586a2 2 0 010 2.828l-1.829 1.828-2.829-2.828 1.829-1.829a2 2 0 012.829 0zm-2.828 4.95l-2.828-2.828L4 12.414V15h2.586l8-8zm-7.182 7.485l1.007-2.518 1.511 1.51-2.518 1.008zm10.181-12.334a1 1 0 10-1.414-1.414l-1.828 1.828 2.828 2.828 1.828-1.828a1 1 0 000-1.414z"
                        />
                      </svg>
                    </button>
                    <button v-if="!schedule.postMode && schedule.editable" @click="saveSchedule(index)" class="btn-icon btn-save bg-green-500 text-white hover:bg-green-600 rounded-md p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 16.172l-4.586-4.586a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.828 0L9 11.586l5.172-5.172a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.828L9 16.172z" />
                      </svg>
                    </button>
                    <button v-if="!schedule.postMode" @click="deleteSchedule(index)" class="btn-icon btn-delete bg-red-500 text-white hover:bg-red-600 rounded-md p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fill-rule="evenodd"
                          d="M6.5 2a1.5 1.5 0 00-1.5 1.5V4h-2a.5.5 0 000 1h14a.5.5 0 000-1h-2v-.5A1.5 1.5 0 0013.5 2h-7zm9 3H4v10.5A1.5 1.5 0 005.5 17h9a1.5 1.5 0 001.5-1.5V5zm-2 3a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zm-4 .5a.5.5 0 011 0v6a.5.5 0 01-1 0v-6a.5.5.5 0 01.5-.5z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              </ul>
              <!-- Save Button -->
              <div class="flex justify-end">
                <button @click="saveDataIrrigation" class="py-2 px-9 bg-primary border border-gray-300 text-white text-sm rounded-lg flex justify-center">Save</button>
              </div>
            </div>
          </div>

          <!-- Control Tab Content -->
          <div v-if="tab.href === 'tabs-control'" key="1">
            <div class="grid grid-cols-2 gap-4">
              <!-- dAB Checkboxes -->
              <div class="bg-form-group border border-gray-300 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <p class="text-sm font-semibold leading-8">dAB</p>
                  <div class="relative inline-block">
                    <label :for="'dAB' + 1 + '-switch'" class="flex items-center cursor-pointer">
                      <div class="relative">
                        <input type="checkbox" :id="'dAB' + 1 + '-switch'" v-model="checkboxes.dAB" class="sr-only" />
                        <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                        <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" :class="{ 'translate-x-full': checkboxes.dAB }"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- dPhUp Checkboxes -->
              <div class="bg-form-group border border-gray-300 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <p class="text-sm font-semibold leading-8">Ph Up</p>
                  <div class="relative inline-block">
                    <label :for="'dPhUp' + 1 + '-switch'" class="flex items-center cursor-pointer">
                      <div class="relative">
                        <input type="checkbox" :id="'dPhUp' + 1 + '-switch'" v-model="checkboxes.dPhUp" class="sr-only" />
                        <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                        <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" :class="{ 'translate-x-full': checkboxes.dPhUp }"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- co2 Checkboxes -->
              <div class="bg-form-group border border-gray-300 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <p class="text-sm font-semibold leading-8">CO2</p>
                  <div class="relative inline-block">
                    <label :for="'co2' + 1 + '-switch'" class="flex items-center cursor-pointer">
                      <div class="relative">
                        <input type="checkbox" :id="'co2' + 1 + '-switch'" v-model="checkboxes.co2" class="sr-only" />
                        <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                        <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" :class="{ 'translate-x-full': checkboxes.co2 }"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- dPhDown Checkboxes -->
              <div class="bg-form-group border border-gray-300 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <p class="text-sm font-semibold leading-8">Ph Down</p>
                  <div class="relative inline-block">
                    <label :for="'dPhDown' + 1 + '-switch'" class="flex items-center cursor-pointer">
                      <div class="relative">
                        <input type="checkbox" :id="'dPhDown' + 1 + '-switch'" v-model="checkboxes.dPhDown" class="sr-only" />
                        <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                        <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" :class="{ 'translate-x-full': checkboxes.dPhDown }"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- sensorPump Checkboxes -->
              <div class="bg-form-group border border-gray-300 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <p class="text-sm font-semibold leading-8">Sensor Pump</p>
                  <div class="relative inline-block">
                    <label :for="'sensorPump' + 1 + '-switch'" class="flex items-center cursor-pointer">
                      <div class="relative">
                        <input type="checkbox" :id="'sensorPump' + 1 + '-switch'" v-model="checkboxes.sensorPump" class="sr-only" />
                        <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                        <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" :class="{ 'translate-x-full': checkboxes.sensorPump }"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <!-- Save Button -->
            <div class="flex justify-end mt-4">
              <button @click="postDataControl" class="py-2 px-9 bg-primary border border-gray-300 text-white text-sm rounded-lg flex justify-center">Save</button>
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
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import HeaderBack from "@/components/HeaderBack.vue";

export default {
  name: "ValueSettingFp",
  components: {
    HeaderBack,
  },
  setup() {
    const url = "https://inamas.id/dev/faperta/?actuator",
      url2 = "https://inamas.id/dev/faperta/?watering_time ",
      url3 = "https://inamas.id/dev/faperta/?growlight_time",
      lastUpdate = ref(""),
      isMobile = ref(false),
      pendingChanges = ref([]),
      pendingChangesGrow = ref([]),
      waterSchedule = ref([]),
      growSchedule = ref([]),
      growlight_mode = ref("auto"),
      irrigation_mode = ref("auto");

    let loading = ref(false),
      notification = ref({
        visible: false,
        message: "",
        success: false,
      });

    const checkboxes = ref({
        dAB: false,
        dPhUp: false,
        dPhDown: false,
        co2: false,
        plantPump: false,
        sensorPump: false,
        grow1: false,
        grow2: false,
        grow3: false,
        grow4: false,
        grow5: false,
        grow6: false,
      }),
      activateCheckbox = (checkboxKey) => {
        if (checkboxKey in checkboxes.value) {
          checkboxes.value[checkboxKey] = true;
        }
      };

    const selectTab = (index) => {
        d.value.tabs.forEach((tab, i) => {
          tab.active = i === index;
        });
      },
      d = ref({
        tabs: [
          { active: true, name: "Growlight", href: "tabs-growlight" },
          { active: false, name: "Irrigation", href: "tabs-irrigation" },
          { active: false, name: "Control", href: "tabs-control" },
        ],
        growlight_mode: "auto",
        irrigation_mode: "auto",
      });

    const setGrowlightMode = (mode) => {
        updateDataGrowlight(mode);
        postmodeGrowlight(mode);
        d.value.growlight_mode = mode;
      },
      isActiveGrowlightMode = (mode) => {
        return d.value.growlight_mode === mode;
      },
      setIrrigationMode = (mode) => {
        updateDataIrrigation(mode);
        postmodeIrrigation(mode);
        d.value.irrigation_mode = mode;
      },
      isActiveIrrigationMode = (mode) => {
        return d.value.irrigation_mode === mode;
      },
      checkScreenSize = () => {
        isMobile.value = window.innerWidth <= 768; // Threshold for mobile view
      };

    function addSchedule(number) {
      if (number === 1) {
        waterSchedule.value.push({ onTime: "00:00", offTime: "00:00", postMode: true, editable: false });
      } else {
        growSchedule.value.push({ onTime: "00:00", offTime: "00:00", postMode: true, editable: false });
      }
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }

    function editSchedule(index, number) {
      if (number === 1) {
        waterSchedule.value[index].editable = true;
      } else {
        growSchedule.value[index].editable = true;
      }
    }

    function saveSchedule(index) {
      waterSchedule.value[index].editable = false;

      const existingChange = pendingChanges.value.find((change) => change.index === index && change.type === "edit");
      if (existingChange) {
        existingChange.schedule = { ...waterSchedule.value[index] };
      } else {
        pendingChanges.value.push({
          type: "edit",
          index,
          schedule: { ...waterSchedule.value[index] },
        });
      }
    }

    function saveScheduleGrow(index) {
      growSchedule.value[index].editable = false;

      const existingChange = pendingChangesGrow.value.find((change) => change.index === index && change.type === "edit");
      if (existingChange) {
        existingChange.schedule = { ...growSchedule.value[index] };
      } else {
        pendingChangesGrow.value.push({
          type: "edit",
          index,
          schedule: { ...growSchedule.value[index] },
        });
      }
    }

    function deleteSchedule(index) {
      pendingChanges.value.push({
        type: "delete",
        index,
        schedule: { ...waterSchedule.value[index] },
      });
      waterSchedule.value.splice(index, 1);
    }

    function deleteScheduleGrow(index) {
      pendingChangesGrow.value.push({
        type: "delete",
        index,
        schedule: { ...growSchedule.value[index] },
      });
      growSchedule.value.splice(index, 1);
    }

    function postSchedule(index) {
      pendingChanges.value.push({
        type: "post",
        index,
        schedule: { ...waterSchedule.value[index] },
      });
      waterSchedule.value[index].postMode = false;
    }

    function postScheduleGrow(index) {
      pendingChangesGrow.value.push({
        type: "post",
        index,
        schedule: { ...growSchedule.value[index] },
      });
      growSchedule.value[index].postMode = false;
    }

    function getMD5HashFromDate(date) {
      return CryptoJS.MD5(date).toString();
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
          if (data.advice.auto_growlight === 1) {
            setGrowlightMode("auto");
            isActiveGrowlightMode("auto");
          } else {
            setGrowlightMode("manual");
            isActiveGrowlightMode("manual");
            if (data.advice.grow1 === 1) {
              activateCheckbox("grow1");
            }
            if (data.advice.grow2 === 1) {
              activateCheckbox("grow2");
            }
            if (data.advice.grow3 === 1) {
              activateCheckbox("grow3");
            }
            if (data.advice.grow4 === 1) {
              activateCheckbox("grow4");
            }
            if (data.advice.grow5 === 1) {
              activateCheckbox("grow5");
            }
            if (data.advice.grow6 === 1) {
              activateCheckbox("grow6");
            }
          }

          if (data.advice.auto_watering === 1) {
            setIrrigationMode("auto");
            isActiveIrrigationMode("auto");
          } else {
            setIrrigationMode("manual");
            isActiveIrrigationMode("manual");
            if (data.advice.plantPump === 1) {
              activateCheckbox("plantPump");
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

    const getDataSchedule = () => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error("Gagal mengambil data: " + errorData.message);
            });
          }
          return response.json();
        })
        .then((responseData) => {
          waterSchedule.value = responseData.advice.watering_schedule.map((schedule) => ({
            onTime: schedule.ontime,
            offTime: schedule.offtime,
            id: schedule.id,
          }));
          growSchedule.value = responseData.advice.growlight_schedule.map((schedule1) => ({
            onTime: schedule1.ontime,
            offTime: schedule1.offtime,
            id: schedule1.id,
          }));
        })
        .catch((error) => {
          notification.value = {
            visible: true,
            message: "There was a problem with the fetch request: " + error.message,
            success: false,
          };
          setTimeout(() => {
            notification.value.visible = false;
          }, 2000);
        });
    };

    const updateDataGrowlight = (mode) => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error("Gagal mengambil data: " + errorData.message);
            });
          }
          return response.json();
        })
        .then((responseData) => {
          if (mode === "manual") {
            if (responseData.advice.grow1 === 1) {
              activateCheckbox("grow1");
            }
            if (responseData.advice.grow2 === 1) {
              activateCheckbox("grow2");
            }
            if (responseData.advice.grow3 === 1) {
              activateCheckbox("grow3");
            }
            if (responseData.advice.grow4 === 1) {
              activateCheckbox("grow4");
            }
            if (responseData.advice.grow5 === 1) {
              activateCheckbox("grow5");
            }
            if (responseData.advice.grow6 === 1) {
              activateCheckbox("grow6");
            }
          }
        })
        .catch((error) => {
          notification.value = {
            visible: true,
            message: "There was a problem with the fetch request: " + error.message,
            success: false,
          };
          setTimeout(() => {
            notification.value.visible = false;
          }, 2000);
        });
    };

    const updateDataIrrigation = (mode) => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error("Gagal mengambil data: " + errorData.message);
            });
          }
          return response.json();
        })
        .then((responseData) => {
          if (mode === "manual") {
            if (responseData.advice.plantPump === 1) {
              activateCheckbox("plantPump");
            }
          }
        })
        .catch((error) => {
          notification.value = {
            visible: true,
            message: "There was a problem with the fetch request: " + error.message,
            success: false,
          };
          setTimeout(() => {
            notification.value.visible = false;
          }, 2000);
        });
    };

    const updateDataControl = () => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error("Gagal mengambil data: " + errorData.message);
            });
          }
          return response.json();
        })
        .then((responseData) => {
          if (responseData.advice.dAB === 1) {
            activateCheckbox("dAB");
          }
          if (responseData.advice.dPhUp === 1) {
            activateCheckbox("dPhUp");
          }
          if (responseData.advice.dPhDown === 1) {
            activateCheckbox("dPhDown");
          }
          if (responseData.advice.co2 === 1) {
            activateCheckbox("co2");
          }
          if (responseData.advice.sensorPump === 1) {
            activateCheckbox("sensorPump");
          }
        })
        .catch((error) => {
          notification.value = {
            visible: true,
            message: "There was a problem with the fetch request: " + error.message,
            success: false,
          };
          setTimeout(() => {
            notification.value.visible = false;
          }, 2000);
        });
    };

    const activeTab = computed(() => {
      return d.value.tabs.find((tab) => tab.active) || {};
    });

    watch(
      () => activeTab.value.href,
      (newValue) => {
        if (newValue === "tabs-control") {
          updateDataControl();
        }
      }
    );

    const postDataGrowlight = () => {
      const utcDate = new Date(),
        utcPlus7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000),
        today = utcPlus7Date.toISOString().split("T")[0],
        key = getMD5HashFromDate(today),
        grow1SwitchValue = getCheckboxStatus("grow1-switch"),
        grow2SwitchValue = getCheckboxStatus("grow2-switch"),
        grow3SwitchValue = getCheckboxStatus("grow3-switch"),
        grow4SwitchValue = getCheckboxStatus("grow4-switch"),
        grow5SwitchValue = getCheckboxStatus("grow5-switch"),
        grow6SwitchValue = getCheckboxStatus("grow6-switch"),
        data = {
          [key]: {
            grow1: grow1SwitchValue,
            grow2: grow2SwitchValue,
            grow3: grow3SwitchValue,
            grow4: grow4SwitchValue,
            grow5: grow5SwitchValue,
            grow6: grow6SwitchValue,
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

    const postDataControl = () => {
      const utcDate = new Date(),
        utcPlus7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000),
        today = utcPlus7Date.toISOString().split("T")[0],
        key = getMD5HashFromDate(today),
        dABSwitchValue = getCheckboxStatus("dAB1-switch"),
        dPhUpSwitchValue = getCheckboxStatus("dPhUp1-switch"),
        dPhDownSwitchValue = getCheckboxStatus("dPhDown1-switch"),
        co2SwitchValue = getCheckboxStatus("co21-switch"),
        sensorPumpSwitchValue = getCheckboxStatus("sensorPump1-switch"),
        data = {
          [key]: {
            dAB: dABSwitchValue,
            dPhUp: dPhUpSwitchValue,
            dPhDown: dPhDownSwitchValue,
            co2: co2SwitchValue,
            sensorPump: sensorPumpSwitchValue,
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

    const postDataIrrigation = () => {
      const utcDate = new Date(),
        utcPlus7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000),
        today = utcPlus7Date.toISOString().split("T")[0],
        key = getMD5HashFromDate(today),
        plantPumpSwitchValue = getCheckboxStatus("plantPump1-switch"),
        data = {
          [key]: {
            plantPump: plantPumpSwitchValue,
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

    const saveDataIrrigation = () => {
      const utcDate = new Date();
      const today = utcDate.toISOString().split("T")[0];
      const key = getMD5HashFromDate(today);

      const requests = pendingChanges.value.map((change) => {
        const payloadput = {
          [key]: {
            id: change.schedule.id,
            ontime: change.schedule.onTime,
            offtime: change.schedule.offTime,
          },
        };

        const payloaddelete = {
          [key]: {
            id: change.schedule.id,
          },
        };

        const payloadpost = {
          [key]: {
            ontime: change.schedule.onTime,
            offtime: change.schedule.offTime,
          },
        };

        let request;

        if (change.type === "edit") {
          // console.log("PUT data", payloadput);
          request = fetch(url2, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payloadput),
          });
        } else if (change.type === "delete") {
          // console.log("DELETE data", payloaddelete);
          request = fetch(url2, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payloaddelete),
          });
        } else if (change.type === "post") {
          // console.log("POST data", payloadpost);
          request = fetch(url2, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payloadpost),
          });
        }

        return request
          .then((response) => {
            if (!response.ok) {
              return response.json().then((errorData) => {
                throw new Error("Failed to save data: " + errorData.message);
              });
            }
            return response.json();
          })
          .then((responseData) => {
            // console.log("Data saved successfully:", responseData);
            notification.value = {
              visible: true,
              message: "Berhasil menyimpan data",
              success: true,
            };
            pendingChanges.value = pendingChanges.value.filter((pendingChange) => pendingChange !== change);
          })
          .catch((error) => {
            notification.value = {
              visible: true,
              message: "Gagal menyimpan data: " + error.message,
              success: false,
            };
          })
          .finally(() => {
            loading.value = false;
            setTimeout(() => {
              notification.value.visible = false;
            }, 2000);
          });
      });
      Promise.allSettled(requests).then(() => {
        console.log("All save operations completed");
      });
    };

    const saveDataGrowlight = () => {
      const utcDate = new Date();
      const today = utcDate.toISOString().split("T")[0];
      const key = getMD5HashFromDate(today);

      const requests = pendingChangesGrow.value.map((change) => {
        const payloadput = {
          [key]: {
            id: change.schedule.id,
            ontime: change.schedule.onTime,
            offtime: change.schedule.offTime,
          },
        };

        const payloaddelete = {
          [key]: {
            id: change.schedule.id,
          },
        };

        const payloadpost = {
          [key]: {
            ontime: change.schedule.onTime,
            offtime: change.schedule.offTime,
          },
        };

        let request;

        if (change.type === "edit") {
          // console.log("PUT data", payloadput);
          request = fetch(url3, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payloadput),
          });
        } else if (change.type === "delete") {
          // console.log("DELETE data", payloaddelete);
          request = fetch(url3, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payloaddelete),
          });
        } else if (change.type === "post") {
          // console.log("POST data", payloadpost);
          request = fetch(url3, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payloadpost),
          });
        }

        return request
          .then((response) => {
            if (!response.ok) {
              return response.json().then((errorData) => {
                throw new Error("Failed to save data: " + errorData.message);
              });
            }
            return response.json();
          })
          .then((responseData) => {
            // console.log("Data saved successfully:", responseData);
            notification.value = {
              visible: true,
              message: "Berhasil menyimpan data",
              success: true,
            };
            pendingChanges.value = pendingChanges.value.filter((pendingChange) => pendingChange !== change);
          })
          .catch((error) => {
            notification.value = {
              visible: true,
              message: "Gagal menyimpan data: " + error.message,
              success: false,
            };
          })
          .finally(() => {
            loading.value = false;
            setTimeout(() => {
              notification.value.visible = false;
            }, 2000);
          });
      });
      Promise.allSettled(requests).then(() => {
        console.log("All save operations completed");
      });
    };

    const postmodeIrrigation = (mode) => {
      const utcDate = new Date();
      const utcPlus7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
      const today = utcPlus7Date.toISOString().split("T")[0];
      const key = getMD5HashFromDate(today);
      const payload =
        mode === "manual"
          ? {
              [key]: {
                auto_watering: 0,
              },
            }
          : {
              [key]: {
                auto_watering: 1,
              },
            };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error("Failed to post data: " + errorData.message);
            });
          }
          return response.json();
        })
        .then((responseData) => {
          console.log("Data mode Irrigation posted successfully:", responseData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    const postmodeGrowlight = (mode) => {
      const utcDate = new Date();
      const utcPlus7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
      const today = utcPlus7Date.toISOString().split("T")[0];
      const key = getMD5HashFromDate(today);
      const payload =
        mode === "manual"
          ? {
              [key]: {
                auto_growlight: 0,
              },
            }
          : {
              [key]: {
                auto_growlight: 1,
              },
            };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error("Failed to post data: " + errorData.message);
            });
          }
          return response.json();
        })
        .then((responseData) => {
          console.log("Data mode Growlight posted successfully:", responseData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    onMounted(() => {
      checkScreenSize();
      getDataSchedule();
      window.addEventListener("resize", checkScreenSize);
      getDataSetpoint();
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkScreenSize);
    });

    return {
      d,
      loading,
      isMobile,
      activeTab,
      selectTab,
      checkboxes,
      lastUpdate,
      addSchedule,
      editSchedule,
      growSchedule,
      postSchedule,
      saveSchedule,
      notification,
      waterSchedule,
      deleteSchedule,
      growlight_mode,
      pendingChanges,
      getDataSetpoint,
      irrigation_mode,
      getDataSchedule,
      postDataControl,
      activateCheckbox,
      setGrowlightMode,
      saveScheduleGrow,
      postScheduleGrow,
      setIrrigationMode,
      saveDataGrowlight,
      postDataGrowlight,
      updateDataControl,
      deleteScheduleGrow,
      postDataIrrigation,
      saveDataIrrigation,
      updateDataGrowlight,
      isActiveGrowlightMode,
      isActiveIrrigationMode,
      zt2: {
        modelClass: "my-form-input3 bg-gray-100 text-center px-3",
      },
    };
  },
};
</script>
