<template>
  <div class="table-loader">
    <div class="table-row header">
      <div class="table-cell"></div>
      <div class="table-cell"></div>
      <div class="table-cell"></div>
      <div class="table-cell"></div>
    </div>
    <div class="table-row" v-for="n in 5" :key="n">
      <div class="table-cell shimmer"></div>
      <div class="table-cell shimmer"></div>
      <div class="table-cell shimmer"></div>
      <div class="table-cell shimmer"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableLoader",
};
</script>

<style scoped>
.table-loader {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.table-row {
  display: flex;
  align-items: center;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.header .table-cell {
  background-color: #f0f0f0;
  font-weight: bold;
  color: #888;
  text-align: center;
}

.table-cell {
  flex: 1;
  padding: 10px 15px;
  box-sizing: border-box;
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  height: 100%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
