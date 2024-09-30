<template>
  <div v-if="visible" :class="['notification', type]" class="fixed bottom-5 right-5 p-4 rounded shadow-lg">
    <h3 class="font-bold">{{ title }}</h3>
    <p>{{ desc }}</p>
    <button @click="closeNotification" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded">{{ confirmCaption }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      type: "info", // 'success' or 'error'
      title: "",
      desc: "",
      confirmCaption: "Oke, Mengerti",
    };
  },
  methods: {
    showNotification({ type, title, desc, confirmCaption }) {
      this.type = type;
      this.title = title;
      this.desc = desc;
      this.confirmCaption = confirmCaption;
      this.visible = true;
    },
    closeNotification() {
      this.visible = false;
    },
  },
};
</script>

<style scoped>
.notification {
  transition: opacity 0.3s ease;
}
.notification.info {
  background-color: #2196f3;
  color: #fff;
}
.notification.success {
  background-color: #4caf50;
  color: #fff;
}
.notification.error {
  background-color: #f44336;
  color: #fff;
}
</style>
