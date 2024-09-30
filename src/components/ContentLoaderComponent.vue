<template>
  <div><p class="text-sm font-semibold leading-8">‎</p></div>
  <div><p class="text-sm font-semibold leading-8">‎</p></div>
  <LineChartLoader />
  <div><p class="text-sm font-semibold leading-8">‎</p></div>
  <div><p class="text-sm font-semibold leading-8">‎</p></div>
  <TableLoader />
</template>

<script>
import TableLoader from "./TableLoader.vue";
import { ContentLoader } from "vue-content-loader";
import LineChartLoader from "./LineChartLoader.vue";

export default {
  name: "ContentLoaderComponent",
  components: {
    TableLoader,
    ContentLoader,
    LineChartLoader,
  },

  data() {
    return {};
  },
};
</script>
