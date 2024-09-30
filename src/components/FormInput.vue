<template>
  <div class="relative mb-3 mt-5">
    <input
      :readonly="modelReadOnly"
      :value="modelValue"
      :type="type === 'password' && isPasswordVisible ? 'text' : type"
      @input="$emit('update:modelValue', $event.target.value)"
      :id="modelId"
      :class="['focus:outline-none focus:ring-0 border-gray/300 peer', modelClass]"
      placeholder=" "
    />
    <label :for="modelId" class="my-form-label -translate-y-4 origin-[0] my-form-label-peer">{{ modelName }}</label>

    <!-- Tombol Toggle Password -->
    <button v-if="type === 'password'" @click="togglePasswordVisibility" type="button" class="absolute top-1 end-0 p-3.5 rounded-e-md">
      <svg
        v-if="isPasswordVisible"
        class="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      <svg v-else class="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
        <line x1="2" x2="22" y1="2" y2="22"></line>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "text",
    },
    modelValue: {
      type: String,
      default: "",
    },
    modelId: {
      type: String,
      default: "",
    },
    modelName: {
      type: String,
      default: "",
    },
    modelClass: {
      type: String,
      default: "my-form-input",
    },
    modelReadOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isPasswordVisible: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
  },
};
</script>
