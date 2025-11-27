<template>
  <div>
    <Store_manager_web/>
    <Store_manager_mobile/>
  </div>
</template>

<script>
import Store_manager_mobile from "./store_manager_mobile.vue";
import Store_manager_web from "./store_manager_web.vue";

export default {
  components: {
    Store_manager_web,
    Store_manager_mobile,
  },
};
</script>
