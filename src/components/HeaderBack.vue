<template>
  <div class="text-left flex items-center mb-3">
    <div class="flex items-center space-x-3">
      <button @click="goBack" class="flex items-center">
        <img :src="to" alt="Arrow Icon" width="24" height="24" />
      </button>
      <!-- Title -->
      <h3 class="text-lg font-bold ml-2">{{ title }}</h3>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "HeaderBack",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const router = useRouter();
    const goBack = () => {
      router.back();
    };

    return {
      goBack,
      to: "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M11.6484%2020.0481C11.1798%2020.5168%2010.42%2020.5168%209.95138%2020.0481L2.75137%2012.8481C2.28274%2012.3795%202.28274%2011.6197%202.75137%2011.1511L9.95138%203.95108C10.42%203.48245%2011.1798%203.48245%2011.6484%203.95108C12.1171%204.41971%2012.1171%205.17951%2011.6484%205.64814L6.49696%2010.7996H20.3999C21.0626%2010.7996%2021.5999%2011.3369%2021.5999%2011.9996C21.5999%2012.6624%2021.0626%2013.1996%2020.3999%2013.1996L6.49696%2013.1996L11.6484%2018.3511C12.1171%2018.8197%2012.1171%2019.5795%2011.6484%2020.0481Z'%20fill='%234B5563'/%3e%3c/svg%3e",
    };
  },
};
</script>
