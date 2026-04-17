<template>
  <a-button v-if="mode === 'inline'" type="primary" @click="open = true">
    <slot name="label">{{ buttonLabel }}</slot>
  </a-button>

  <a-float-button
    v-else
    type="primary"
    @click="open = true"
    :tooltip="buttonLabel"
  />

  <!-- :title="drawerTitle" -->
  <a-drawer
  placement="bottom"
  :open="open"
  :height="'100%'"
  :width="'100%'"
  :closable="false"
  :header-style="{ display: 'none' }"
  :body-style="{ padding: 0, position: 'relative' }"
>
 <!-- Floating close button -->
  <a-button
    shape="circle"
    :icon="h(CloseOutlined)"
    @click="open = false"
    style="position: absolute; top: 16px; right: 16px; z-index: 10;"
  />
  <a-button
    shape="circle"
    :icon="h(LeftCircleOutlined )"
    @click="this.$router.back()"
    style="position: absolute; top: 16px; right: 66px; z-index: 10;"
  />
    <!-- :destroy-on-close="true" -->
    <!-- :closable="true" -->
    <!-- @close="open = false" -->
    <template #title></template>
    <template #extra>
      <!-- <a-space>
        <a-button @click="open = false">Cancel</a-button>
        <a-button type="primary" @click="open = false">Confirm</a-button>
      </a-space> -->
    </template>

    <!-- The router-view lives here, inside the drawer -->
    <router-view />
  </a-drawer>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { CloseOutlined,LeftCircleOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  mode:        { type: String, default: 'floating' },
  buttonLabel: { type: String, default: '🪄 Open' },
  drawerTitle: { type: String, default: 'My App' },
  brand:       { type: String, default: null },
  windowName:  { type: String, default: null },
  productType: { type: String, default: null },
  productId:   { type: String, default: null },
})

const open = ref(false)
const router = useRouter()

// On mount, navigate to / with the props as query params
// so StartNewCatalogue receives them via route.query
onMounted(() => {
  router.replace({
    name: 'api-start-new-catalogue',
    query: {
      brand:        props.brand       || undefined,
      window_name:  props.windowName  || undefined,
      product_type: props.productType || undefined,
      product_id:   props.productId   || undefined,
    },
  })
})
</script>