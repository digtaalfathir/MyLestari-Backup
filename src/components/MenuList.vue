<template>
  <main>
    <section class="h-full text-center text-black flex flex-col items-center px-5 dashboard-header1">
      <div class="w-full my-3">
        <ul class="mt-4 mb-5 p-5 grid grid-cols-5 gap-4 justify-around list-none">
          <li v-for="item in menuList" :key="item.id" class="w-full bg-white border border-gray-300 rounded-lg py-3 px-2" role="presentation">
            <router-link :to="item.route">
              <img :src="`/assets/${item.icon}`" alt="" class="mx-auto" />
              <p class="my-line-height-menu">{{ item.title }}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "MenuList",
  props: {
    initialMenuList: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const menuList = ref([]);

    onMounted(() => {
      menuList.value = props.initialMenuList;
    });

    return {
      menuList,
    };
  },
};
</script>
