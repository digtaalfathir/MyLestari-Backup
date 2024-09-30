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

      <!-- Content -->
      <div id="tab-content" class="mt-4 lg:mt-0 mb-5 ps-0 lg:border-x lg:border-b lg:border-gray-300 lg:rounded-b-lg lg:p-4">
        <div v-for="tab in d.tabs" :key="tab.href" :id="tab.href" role="tabpanel" :aria-labelledby="tab.href" v-show="tab.active">
          <!-- GH Type Tab Content -->
          <div v-if="tab.href === 'tabs-ghtype'" key="1">
            <div class="bg-form-group border border-gray-300 rounded-lg p-6 mb-4">
              <div class="flex items-center justify-between">
                <label class="text-left text-sm font-semibold leading-6 mr-4">Type</label>
                <!-- Dropdown -->
                <div class="dropdown-wrapper">
                  <select :class="['my-form-select3', 'dropdown-custom']" v-model="A" @change="onDropdownChange" @focus="isDropdownOpen = true" @blur="isDropdownOpen = false">
                    <option v-for="option in modelOptions" :key="option.id" :value="option.name">
                      {{ option.name }}
                    </option>
                  </select>
                  <span :class="['dropdown-arrow', isDropdownOpen ? 'up' : 'down']"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Dosing Tab Content -->
          <div v-if="tab.href === 'tabs-dosing'" key="1">
            <div class="bg-form-group border border-gray/300 rounded-lg p-4 mb-4">
              <div class="flex justify-between">
                <!-- Dosing Mode Buttons -->
                <label class="text-left gap-8 text-sm font-semibold leading-8">Mode</label>
                <div class="flex border border-gray-200 rounded">
                  <button @click="setDosingMode('auto')" :class="['text-xs rounded-l p-2 w-[64px] bg-gray-100', { 'switch-active': isActiveDosingMode('auto') }]">Auto</button>
                  <button @click="setDosingMode('manual')" :class="['text-xs rounded-l p-2 w-[64px] bg-gray-100', { 'switch-active': isActiveDosingMode('manual') }]">Manual</button>
                </div>
              </div>
            </div>

            <!-- Dosing Manual Mode Content -->
            <div v-if="d.dosing_mode === 'manual'" class="p-4">
              <div class="grid grid-cols-2 gap-4">
                <!-- EC Checkboxes -->
                <div class="flex flex-col gap-4">
                  <div v-for="ec in 1" :key="'ec' + ec" class="bg-form-group border border-gray-300 rounded-lg p-4">
                    <div class="flex justify-between items-center">
                      <p :class="{ 'font-semibold leading-8': isMobile, 'text-base font-semibold leading-8': !isMobile }" class="relative text-sm">
                        EC Pump
                        <span
                          :class="{
                            display: isMobile ? 'block' : 'inline',
                            marginTop: isMobile ? '0.1rem' : '2.5',
                            fontSize: isMobile ? '0.875rem' : '1.5',
                          }"
                          class="arrow-size"
                        >
                          ▲
                        </span>
                      </p>
                      <div class="relative inline-block">
                        <label :for="'ec' + ec + '-switch'" class="flex items-center cursor-pointer">
                          <div class="relative">
                            <input type="checkbox" :id="'ec' + ec + '-switch'" class="sr-only" v-model="checkboxes.ecpump" />
                            <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- phUp Checkboxes -->
                <div class="flex flex-col gap-4">
                  <div v-for="phup in 1" :key="'phup' + phup" class="bg-form-group border border-gray-300 rounded-lg p-4">
                    <div class="flex justify-between items-center">
                      <p :class="{ 'text-sm font-semibold leading-8': isMobile, 'text-base font-semibold leading-8': !isMobile }" class="relative text-sm">
                        PH UP
                        <span
                          :class="{
                            display: isMobile ? 'block' : 'inline',
                            marginTop: isMobile ? '0.1rem' : '2.5',
                            fontSize: isMobile ? '0.875rem' : '1.5',
                          }"
                          class="arrow-size"
                        >
                          ▲
                        </span>
                      </p>
                      <div class="relative inline-block">
                        <label :for="'phup' + phup + '-switch'" class="flex items-center cursor-pointer">
                          <div class="relative">
                            <input type="checkbox" :id="'phup' + phup + '-switch'" class="sr-only" v-model="checkboxes.phup" />
                            <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Sub Checkboxes -->
                <div class="flex flex-col gap-4">
                  <div v-for="sub in 1" :key="'sub' + sub" class="bg-form-group border border-gray-300 rounded-lg p-4">
                    <div class="flex justify-between items-center text-sm">
                      <p
                        :style="{
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          fontWeight: '600',
                          lineHeight: '1.25rem',
                          marginBottom: isMobile ? '0.1rem' : '0',
                        }"
                        class="relative"
                      >
                        Sensor Pump
                        <span
                          :style="{
                            display: isMobile ? 'block' : 'inline',
                            marginTop: isMobile ? '0.1rem' : '0',
                            fontSize: isMobile ? '0.75rem' : '1rem',
                          }"
                        >
                        </span>
                      </p>
                      <div class="relative inline-block">
                        <label :for="'sub' + sub + '-switch'" class="flex items-center cursor-pointer">
                          <div class="relative">
                            <input type="checkbox" :id="'sub' + sub + '-switch'" class="sr-only" v-model="checkboxes.subpump" />
                            <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- phdown Checkboxes -->
                <div class="flex flex-col gap-4">
                  <div v-for="phdown in 1" :key="'phdown' + phdown" class="bg-form-group border border-gray-300 rounded-lg p-4">
                    <div class="flex justify-between items-center">
                      <p :class="{ 'text-sm font-semibold leading-8': isMobile, 'text-base font-semibold leading-8': !isMobile }" class="relative text-sm">
                        PH Down
                        <span
                          :class="{
                            display: isMobile ? 'block' : 'inline',
                            marginTop: isMobile ? '0.1rem' : '2.5',
                            fontSize: isMobile ? '0.875rem' : '1.5',
                          }"
                          class="arrow-size2"
                        >
                          ▼
                        </span>
                      </p>

                      <div class="relative inline-block">
                        <label :for="'phdown' + phdown + '-switch'" class="flex items-center cursor-pointer">
                          <div class="relative">
                            <input type="checkbox" :id="'phdown' + phdown + '-switch'" class="sr-only" v-model="checkboxes.phdown" />
                            <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dosing Auto Mode Content -->
            <div v-if="d.dosing_mode === 'auto'">
              <ul class="my-striped-list mt-4 mb-5 list-none bg-white border border-gray/300 rounded-b-lg">
                <li class="relative w-full gap-3 p-3">
                  <p class="text-left gap-8 text-sm font-semibold leading-8">EC</p>
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
                        Treshold
                      </p>
                      <input type="number" placeholder="00.0" :class="zt2.modelClass" id="ecthInput" />
                      <span class="unit-labelx">μS</span>
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
                      <input type="number" placeholder="00.0" :class="zt2.modelClass" id="ecToleInput" />
                      <span class="unit-labelx">μS</span>
                    </div>
                  </div>
                </li>
              </ul>
              <ul class="my-striped-list mt-4 mb-5 list-none bg-white border border-gray/300 rounded-b-lg">
                <li class="relative w-full gap-3 p-3">
                  <p class="text-left gap-8 text-sm font-semibold leading-8">Ph</p>
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
                        Treshold
                      </p>
                      <input type="number" placeholder="00.0" :class="zt2.modelClass" id="phthInput" />
                      <span class="unit-labelx"></span>
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
                      <input type="number" step="0.1" placeholder="00.0" :class="zt2.modelClass" id="phToleInput" />
                      <span class="unit-labelx"></span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- Save Button -->
            <div class="flex justify-end">
              <button @click="postDataDosing" class="py-2 px-9 bg-primary border border-gray-300 text-white text-sm rounded-lg flex justify-center">Save</button>
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
              <div class="grid grid-cols-2 gap-4">
                <!-- JetPump Checkboxes -->
                <div class="flex flex-col gap-4">
                  <div v-for="jetpump in 1" :key="'jetpump' + jetpump" class="bg-form-group border border-gray-300 rounded-lg p-4">
                    <div class="flex justify-between items-center">
                      <p
                        :style="{
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          fontWeight: '600',
                          lineHeight: '1.25rem',
                          marginBottom: isMobile ? '0.1rem' : '0',
                        }"
                        class="relative text-sm font-semibold leading-8"
                      >
                        Jet Pump
                      </p>
                      <div class="relative inline-block">
                        <label :for="'jetpump' + jetpump + '-switch'" class="flex items-center cursor-pointer">
                          <div class="relative">
                            <input type="checkbox" :id="'jetpump' + jetpump + '-switch'" class="sr-only" v-model="checkboxes.jetpump" />
                            <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- BoosterPump Checkboxes -->
                <div class="flex flex-col gap-4">
                  <div v-for="boostpump in 1" :key="'boostpump' + boostpump" :class="{ 'bg-form-disabled': !boosterAvailable, 'bg-form-group': boosterAvailable }" class="border border-gray-300 rounded-lg p-4">
                    <div class="flex justify-between items-center">
                      <p
                        :class="{ 'text-disabled': !boosterAvailable }"
                        :style="{
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          fontWeight: '600',
                          lineHeight: '1.25rem',
                          marginBottom: isMobile ? '0.1rem' : '0',
                        }"
                        class="relative text-sm font-semibold leading-8"
                      >
                        Booster Pump
                      </p>
                      <div class="relative inline-block">
                        <label :for="'boostpump' + boostpump + '-switch'" class="flex items-center cursor-pointer">
                          <div :class="{ 'disabled-checkbox': !boosterAvailable }" class="relative">
                            <input type="checkbox" :id="'boostpump' + boostpump + '-switch'" class="sr-only" :disabled="!boosterAvailable" v-model="checkboxes.boostpump" />
                            <div class="dot-bg block bg-gray-300 w-14 h-8 rounded-full transition"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Save Button -->
              <div class="flex justify-end mt-4">
                <button @click="postIrigationManual" class="py-2 px-9 bg-primary border border-gray-300 text-white text-sm rounded-lg flex justify-center">Save</button>
              </div>
            </div>

            <!-- Irrigation Auto Mode Content -->
            <div v-if="d.irrigation_mode === 'auto'">
              <div v-if="!isNFT === true">
                <ul class="my-striped-list mt-4 mb-5 list-none bg-white border border-gray-300 rounded-lg shadow-sm">
                  <li class="relative w-full gap-3 p-4 flex items-center justify-between bg-gray-100 rounded-t-lg">
                    <p class="text-left gap-8 text-lg font-semibold text-gray-700 text-sm">Irrigation</p>
                    <button @click="addSchedule" class="btn-icon btn-add bg-blue-500 text-white hover:bg-blue-600 rounded-md px-3 py-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 5v14m7-7H5" />
                      </svg>
                      <p class="text-sm font-semibold">Add</p>
                    </button>
                  </li>
                  <li v-for="(schedule, index) in waterSchedules" :key="index" class="relative w-full p-4 flex items-center gap-4 border-b border-gray-200 last:border-b-0">
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
                      <button v-if="!schedule.postMode && !schedule.editable" @click="editSchedule(index)" class="btn-icon btn-edit bg-yellow-400 text-white hover:bg-yellow-500 rounded-md p-2">
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
                  <button @click="saveData" class="py-2 px-9 bg-primary border border-gray-300 text-white text-sm rounded-lg flex justify-center">Save</button>
                </div>
              </div>
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
import { ref, onMounted, onUnmounted } from "vue";
import HeaderBack from "@/components/HeaderBack.vue";

export default {
  name: "ValueSettingGr",
  components: {
    HeaderBack,
  },
  setup() {
    const url1 = "https://inamas.id/dev/petro/greenhouse/?setpoint",
      url2 = "https://inamas.id/dev/petro/greenhouse/?watering_time",
      router = useRouter(),
      goBack = () => {
        router.back();
      },
      A = ref(""), // Dropdown
      isNFT = ref(false),
      dosing_mode = ref("auto"),
      waterSchedules = ref([]),
      pendingChanges = ref([]),
      isDropdownOpen = ref(false),
      irrigation_mode = ref("auto"),
      boosterAvailable = ref(true),
      lastUpdate = ref(""),
      isMobile = ref(false);

    let loading = ref(false),
      notification = ref({
        visible: false,
        message: "",
        success: false,
      });

    const d = ref({
        tabs: [
          { active: true, name: "GH Type", href: "tabs-ghtype" },
          { active: false, name: "Dosing Nutrisi", href: "tabs-dosing" },
          { active: false, name: "Irrigation", href: "tabs-irrigation" },
        ],
        dosing_mode: "auto",
        irrigation_mode: "auto",
      }),
      modelOptions = ref([
        { id: 1, name: "NFT" },
        { id: 2, name: "Drip System" },
      ]),
      checkScreenSize = () => {
        isMobile.value = window.innerWidth <= 768; // Threshold for mobile view
      };

    const checkboxes = ref({
        ecpump: false,
        phup: false,
        phdown: false,
        subpump: false,
        jetpump: false,
        boostpump: false,
      }),
      activateCheckbox = (checkboxKey) => {
        if (checkboxKey in checkboxes.value) {
          checkboxes.value[checkboxKey] = true;
        }
      };

    const onDropdownChange = (event) => {
        A.value = event.target.value;
        postGHType(event.target.value);
      },
      selectTab = (index) => {
        d.value.tabs.forEach((tab, i) => {
          tab.active = i === index;
        });
      };

    const setDosingMode = (mode) => {
        d.value.dosing_mode = mode;
        updateDataDosing(mode);
      },
      isActiveDosingMode = (mode) => {
        return d.value.dosing_mode === mode;
      },
      setIrrigationMode = (mode) => {
        d.value.irrigation_mode = mode;
        updateDataIrrigation(mode);
        postmodeIrrigation(mode);
      },
      isActiveIrrigationMode = (mode) => {
        return d.value.irrigation_mode === mode;
      };

    function addSchedule() {
      waterSchedules.value.push({ onTime: "00:00", offTime: "00:00", postMode: true, editable: false });
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }

    function editSchedule(index) {
      waterSchedules.value[index].editable = true;
    }

    function saveSchedule(index) {
      waterSchedules.value[index].editable = false;

      const existingChange = pendingChanges.value.find((change) => change.index === index && change.type === "edit");
      if (existingChange) {
        existingChange.schedule = { ...waterSchedules.value[index] };
      } else {
        pendingChanges.value.push({
          type: "edit",
          index,
          schedule: { ...waterSchedules.value[index] },
        });
      }
    }

    function deleteSchedule(index) {
      pendingChanges.value.push({
        type: "delete",
        index,
        schedule: { ...waterSchedules.value[index] },
      });
      waterSchedules.value.splice(index, 1);
    }

    function postSchedule(index) {
      pendingChanges.value.push({
        type: "post",
        index,
        schedule: { ...waterSchedules.value[index] },
      });
      waterSchedules.value[index].postMode = false;
    }

    function getMD5HashFromDate(date) {
      return CryptoJS.MD5(date).toString();
    }

    function getInputValue(id) {
      const inputElement = document.getElementById(id);
      return inputElement ? parseFloat(inputElement.value) : 0;
    }

    function getCheckboxStatus(id) {
      const checkboxElement = document.getElementById(id);
      return checkboxElement ? (checkboxElement.checked ? 1 : 0) : 0;
    }

    const getDataSetpoint = () => {
      fetch(url1)
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error("Gagal mengambil data: " + errorData.message);
            });
          }
          return response.json();
        })
        .then((responseData) => {
          waterSchedules.value = responseData.advice.watering_schedule.map((schedule) => ({
            onTime: schedule.ontime,
            offTime: schedule.offtime,
            id: schedule.id,
          }));
          boosterAvailable.value = responseData.advice.booster_available;
          if (responseData.advice.typeGh === "1") {
            isNFT.value = true;
          } else if (responseData.advice.typeGh === "2") {
            isNFT.value = false;
          }
          if (responseData.advice.auto_dosing === "1") {
            setDosingMode("auto");
            isActiveDosingMode("auto");
            if (responseData.advice.ecTh !== undefined) {
              document.getElementById("ecthInput").value = responseData.advice.ecTh;
            }
            if (responseData.advice.phTh !== undefined) {
              document.getElementById("phthInput").value = responseData.advice.phTh;
            }
            if (responseData.advice.ecTol !== undefined) {
              document.getElementById("ecToleInput").value = responseData.advice.ecTol;
            }
            if (responseData.advice.phTol !== undefined) {
              document.getElementById("phToleInput").value = responseData.advice.phTol;
            }
          } else {
            setDosingMode("manual");
            isActiveDosingMode("manual");
          }

          if (responseData.advice.auto_watering === "1") {
            setIrrigationMode("auto");
            isActiveIrrigationMode("auto");
          } else {
            setIrrigationMode("manual");
            isActiveIrrigationMode("manual");
          }

          if (responseData.advice.typeGh === "1") {
            A.value = "NFT";
          } else if (responseData.advice.typeGh === "2") {
            A.value = "Drip System";
          }
          lastUpdate.value = responseData.advice.updated_at;
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

    const updateDataDosing = (mode) => {
      fetch(url1)
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error("Gagal mengambil data: " + errorData.message);
            });
          }
          return response.json();
        })
        .then((responseData) => {
          if (mode === "auto") {
            if (responseData.advice.ecTh !== undefined) {
              document.getElementById("ecthInput").value = responseData.advice.ecTh;
            }
            if (responseData.advice.phTh !== undefined) {
              document.getElementById("phthInput").value = responseData.advice.phTh;
            }
            if (responseData.advice.ecTol !== undefined) {
              document.getElementById("ecToleInput").value = responseData.advice.ecTol;
            }
            if (responseData.advice.phTol !== undefined) {
              document.getElementById("phToleInput").value = responseData.advice.phTol;
            }
          } else {
            if (responseData.advice.ec_pump === "1") {
              activateCheckbox("ecpump");
            }
            if (responseData.advice.phup_pump === "1") {
              activateCheckbox("phup");
            }
            if (responseData.advice.phdown_pump === "1") {
              activateCheckbox("phdown");
            }
            if (responseData.advice.sub_pump === "1") {
              activateCheckbox("subpump");
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    const postDataDosing = () => {
      const utcDate = new Date();
      const utcPlus7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
      const today = utcPlus7Date.toISOString().split("T")[0];
      const key = getMD5HashFromDate(today),
        ecpumpSwitchValue = getCheckboxStatus("ec1-switch"),
        subpumpSwitchValue = getCheckboxStatus("sub1-switch"),
        phuppumpSwitchValue = getCheckboxStatus("phup1-switch"),
        phdownpumpSwitchValue = getCheckboxStatus("phdown1-switch"),
        ecThValueInput = getInputValue("ecthInput"),
        ecTolValueInput = getInputValue("ecToleInput"),
        phThValueInput = getInputValue("phthInput"),
        phTolValueInput = getInputValue("phToleInput");
      const payload =
        d.value.dosing_mode === "manual"
          ? {
              [key]: {
                auto_dosing: 0,
                ec_pump: ecpumpSwitchValue,
                phup_pump: phuppumpSwitchValue,
                phdown_pump: phdownpumpSwitchValue,
                sub_pump: subpumpSwitchValue,
              },
            }
          : {
              [key]: {
                auto_dosing: 1,
                ecTh: ecThValueInput,
                phTh: phThValueInput,
                ecTol: ecTolValueInput,
                phTol: phTolValueInput,
              },
            };

      console.log("data", payload);
      loading.value = true;
      fetch(url1, {
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
          notification.value = {
            visible: true,
            message: "Berhasil menyimpan data",
            success: true,
          };
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
    };

    const updateDataIrrigation = (mode) => {
      fetch(url1)
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
            if (responseData.advice.jet_pump === "1") {
              activateCheckbox("jetpump");
            }
            if (responseData.advice.booster_pump === "1") {
              activateCheckbox("boostpump");
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
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

      fetch(url1, {
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
          console.log("Data posted successfully:", responseData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    const postGHType = (type) => {
      const utcDate = new Date();
      const utcPlus7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
      const today = utcPlus7Date.toISOString().split("T")[0];
      const key = getMD5HashFromDate(today);
      const payload =
        type === "NFT"
          ? {
              [key]: {
                typeGh: 1,
              },
            }
          : {
              [key]: {
                typeGh: 2,
              },
            };

      fetch(url1, {
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
          getDataSetpoint();
          notification.value = {
            visible: true,
            message: "Berhasil mengubah mode",
            success: true,
          };
          setTimeout(() => {
            notification.value.visible = false;
          }, 2000);
        })
        .catch((error) => {
          notification.value = {
            visible: true,
            message: "Gagal mengubah mode: " + error.message,
            success: false,
          };
          setTimeout(() => {
            notification.value.visible = false;
          }, 2000);
        });
    };

    const postIrigationManual = () => {
      const utcDate = new Date();
      const utcPlus7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);
      const today = utcPlus7Date.toISOString().split("T")[0];
      const key = getMD5HashFromDate(today),
        jetpumpSwitchValue = getCheckboxStatus("jetpump1-switch"),
        boostpumpSwitchValue = getCheckboxStatus("boostpump1-switch");
      const payload = {
        [key]: {
          auto_watering: 0,
          jet_pump: jetpumpSwitchValue,
          booster_pump: boostpumpSwitchValue,
        },
      };

      loading.value = true;
      fetch(url1, {
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
          notification.value = {
            visible: true,
            message: "Berhasil menyimpan data",
            success: true,
          };
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
    };

    const saveData = () => {
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

    onMounted(() => {
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      getDataSetpoint();
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkScreenSize);
    });

    return {
      checkboxes,
      activateCheckbox,
      editSchedule,
      saveSchedule,
      deleteSchedule,
      getDataSetpoint,
      updateDataDosing,
      updateDataIrrigation,
      dosing_mode,
      irrigation_mode,
      selectTab,
      setDosingMode,
      isActiveDosingMode,
      setIrrigationMode,
      isActiveIrrigationMode,
      postDataDosing,
      postGHType,
      loading,
      notification,
      d,
      waterSchedules,
      addSchedule,
      boosterAvailable,
      pendingChanges,
      saveData,
      postSchedule,
      postIrigationManual,
      modelOptions,
      A,
      onDropdownChange,
      isDropdownOpen,
      isNFT,
      lastUpdate,
      isMobile,
      zt2: {
        modelClass: "my-form-input3 bg-gray-100 text-center px-3",
        modelId: "your-input-id",
      },
    };
  },
};
</script>
