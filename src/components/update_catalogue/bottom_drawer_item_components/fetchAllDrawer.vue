<template>
  <!-- Fetch All Drawer -->
<a-drawer

  title="AI All Products"
  :placement="'bottom'"
  :closable="true"
  :open="openSeeAll_products"
  height="90%"
  style="border-top-left-radius: 20px; border-top-right-radius: 20px; padding-top: 0"
  :bodyStyle="{ padding: '0 0px 0px' }"  
  @close="onClose_drawer_modal"
>

     <template #extra> <div class="head-section" >
          <a-button type="primary" style="display:flex;justify-content:center;gap:10px;color:white"> 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 15.575C11.8667 15.575 11.7417 15.5543 11.625 15.513C11.5083 15.4717 11.4 15.4007 11.3 15.3L7.7 11.7C7.5 11.5 7.404 11.2667 7.412 11C7.42 10.7333 7.516 10.5 7.7 10.3C7.9 10.1 8.13767 9.996 8.413 9.988C8.68833 9.98 8.92567 10.0757 9.125 10.275L11 12.15V5C11 4.71667 11.096 4.47934 11.288 4.288C11.48 4.09667 11.7173 4.00067 12 4C12.2827 3.99934 12.5203 4.09534 12.713 4.288C12.9057 4.48067 13.0013 4.718 13 5V12.15L14.875 10.275C15.075 10.075 15.3127 9.979 15.588 9.987C15.8633 9.995 16.1007 10.0993 16.3 10.3C16.4833 10.5 16.5793 10.7333 16.588 11C16.5967 11.2667 16.5007 11.5 16.3 11.7L12.7 15.3C12.6 15.4 12.4917 15.471 12.375 15.513C12.2583 15.555 12.1333 15.5757 12 15.575ZM6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18V16C4 15.7167 4.096 15.4793 4.288 15.288C4.48 15.0967 4.71733 15.0007 5 15C5.28267 14.9993 5.52033 15.0953 5.713 15.288C5.90567 15.4807 6.00133 15.718 6 16V18H18V16C18 15.7167 18.096 15.4793 18.288 15.288C18.48 15.0967 18.7173 15.0007 19 15C19.2827 14.9993 19.5203 15.0953 19.713 15.288C19.9057 15.4807 20.0013 15.718 20 16V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H6Z" fill="white"/>
</svg>
Download
          </a-button>
    </div>
    </template>

  <a-row >
    

    <!-- Right Side - Products Tabs -->
    <a-col :span="24">
      <div className="md:p-4">

        <a-tabs v-model:activeKey="activeTab" class="products-tabs">
          
         
          <!-- Floor Textures Tab -->
          <a-tab-pane key="floor" class="tab-pane-content">
            <template #tab>
              <span>🟫 Floor Textures</span>
            </template>
            <div class="sm:products-section">
              <div v-if="seeAll_Floor && seeAll_Floor.length > 0">
                <floor_textures_bottom_drawer_menu :products="seeAll_Floor" />
              </div>
              <div v-else class="empty-state">
                <a-empty description="No floor textures available" />
              </div>
            </div>
          </a-tab-pane>
  
          <!-- Wall Textures Tab -->
          <a-tab-pane key="wall" class="tab-pane-content">
            <template #tab>
              <span>🟪 Wall Textures</span>
            </template>
            <div class="products-section">
              <div v-if="seeAll_Walls && seeAll_Walls.length > 0">
                <wall_textures_bottom_drawer_menu :products="seeAll_Walls" />
              </div>
              <div v-else class="empty-state">
                <a-empty description="No wall textures available" />
              </div>
            </div>
          </a-tab-pane>
  
          <!-- Furniture Tab -->
          <a-tab-pane key="furniture" class="tab-pane-content">
            <template #tab>
              <span>🪑 Furniture</span>
            </template>
            <div class="products-section">
              <div v-if="seeAll_furnitures && seeAll_furnitures.length > 0">
                <furnitures_bottom_drawer_menu :products="seeAll_furnitures" />
              </div>
              <div v-else class="empty-state">
                <a-empty description="No furniture products available" />
              </div>
            </div>
          </a-tab-pane>
  
          <!-- Lights Tab -->
          <a-tab-pane key="light" class="tab-pane-content">
            <template #tab>
              <span>💡 Lights</span>
            </template>
            <div class="products-section">
              <div v-if="seeAll_Lights && seeAll_Lights.length > 0">
                <light_items_bottom_drawer_menu :products="seeAll_Lights" />
              </div>
              <div v-else class="empty-state">
                <a-empty description="No lights available" />
              </div>
            </div>
          </a-tab-pane>
  
        </a-tabs>
      </div>
    </a-col>
  </a-row>
</a-drawer>
</template>

<script>

import wall_textures_bottom_drawer_menu from '@/components/update_catalogue/bottom_drawer_item_components/wall_textures.vue'
import floor_textures_bottom_drawer_menu from '@/components/update_catalogue/bottom_drawer_item_components/floor_textures.vue'
import furnitures_bottom_drawer_menu from '@/components/update_catalogue/bottom_drawer_item_components/furnitures.vue'
import light_items_bottom_drawer_menu from '@/components/update_catalogue/bottom_drawer_item_components/light_items.vue'

export default {
  name: 'FetchAllDrawer',
  props: {
    openSeeAll_products: Boolean,
    seeAll_Floor: Array,
    seeAll_Walls: Array,
    seeAll_furnitures: Array,
    seeAll_Lights: Array,
    onClose_drawer_modal: Function
  },
  components:{
    wall_textures_bottom_drawer_menu,
    floor_textures_bottom_drawer_menu,
    furnitures_bottom_drawer_menu,
    light_items_bottom_drawer_menu,
  },
  data() {
    return {
      filterRoomType: '',
      filterBrand: '',
      filterCategories: [],
      activeTab: null
    }
  }, mounted() {
//     console.log(this.seeAll_Floor)
// console.log(this.seeAll_Walls)
// console.log(this.seeAll_furnitures)
// console.log(this.seeAll_Lights)
  // Pick the first available tab in priority order
  this.activeTab =
    (this.seeAll_Floor?.length > 0 && 'floor') ||
    (this.seeAll_Walls?.length > 0 && 'wall') ||
    (this.seeAll_furnitures?.length > 0 && 'furniture') ||
    (this.seeAll_Lights?.length > 0 && 'light') ||
    'furniture' // fallback default
}
,
  computed: {
    hasProducts() {
      return (
        (this.seeAll_Floor && this.seeAll_Floor.length > 0) ||
        (this.seeAll_Walls && this.seeAll_Walls.length > 0) ||
        (this.seeAll_furnitures && this.seeAll_furnitures.length > 0) ||
        (this.seeAll_Lights && this.seeAll_Lights.length > 0)
      )
    }
  },
  methods: {
    updateFilter() {
      console.log('Filters updated:', {
        roomType: this.filterRoomType,
        brand: this.filterBrand,
        categories: this.filterCategories
      })
    }
  }
}
</script>

<style scoped>
.head-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}



.filters-section {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  height: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-group h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #262626;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.products-tabs {
  height: 100%;
}

.tab-pane-content {
  padding: 0;
}

.products-section {
  /* padding: 16px 0; */
  max-height: 60vh;
  overflow-y: auto;
}

.products-section::-webkit-scrollbar {
  width: 6px;
}

.products-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.products-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.products-section::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.product-category {
  margin-bottom: 40px;
}

.category-title {
  font-size: 18px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

/* Scrollbar styling for the entire drawer */
:deep(.ant-drawer-body) {
  padding: 16px;
}

:deep(.ant-tabs-tab) {
  margin-right: 0 !important;
}

:deep(.ant-tabs-tab-remove) {
  margin-left: 8px;
}
</style>