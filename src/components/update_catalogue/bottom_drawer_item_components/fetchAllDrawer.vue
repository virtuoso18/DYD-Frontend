<template>
  <!-- Fetch All Drawer -->
<a-drawer
  title="AI All Products"
  :placement="'bottom'"
  :closable="true"
  :open="openSeeAll_products"
  height="90%"
  style="border-top-left-radius: 20px; border-top-right-radius: 20px;"
  @close="onClose_drawer_modal"
>
  <template #extra>
    <div class="head-section">
      <a-button type="primary" style="margin-right: 8px;">
        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
          <path d="M4.25 14.2288C3.35489 14.2288 2.49645 13.893 1.86351 13.2952C1.23058 12.6975 0.875 11.8867 0.875 11.0413C0.875 10.196 1.23058 9.38521 1.86351 8.78744C2.49645 8.18967 3.35489 7.85384 4.25 7.85384C5.14511 7.85384 6.00355 8.18967 6.63649 8.78744C7.26942 9.38521 7.625 10.196 7.625 11.0413C7.625 11.8867 7.26942 12.6975 6.63649 13.2952C6.00355 13.893 5.14511 14.2288 4.25 14.2288ZM11.75 7.14551C11.3068 7.14551 10.8679 7.06306 10.4584 6.90287C10.049 6.74269 9.67691 6.5079 9.36351 6.21191C9.05012 5.91592 8.80152 5.56454 8.63191 5.17781C8.4623 4.79109 8.375 4.3766 8.375 3.95801C8.375 3.53942 8.4623 3.12493 8.63191 2.7382C8.80152 2.35148 9.05012 2.00009 9.36351 1.7041C9.67691 1.40812 10.049 1.17333 10.4584 1.01314C10.8679 0.852955 11.3068 0.770508 11.75 0.770508C12.6451 0.770508 13.5035 1.10633 14.1365 1.7041C14.7694 2.30188 15.125 3.11263 15.125 3.95801C15.125 4.80339 14.7694 5.61414 14.1365 6.21191C13.5035 6.80968 12.6451 7.14551 11.75 7.14551ZM1.25 4.66634C1.25 3.72703 1.64509 2.8262 2.34835 2.162C3.05161 1.49781 4.00544 1.12467 5 1.12467H7.25V2.54134H5C4.40326 2.54134 3.83097 2.76522 3.40901 3.16374C2.98705 3.56225 2.75 4.10276 2.75 4.66634V6.79134H1.25V4.66634ZM13.25 8.20801V10.333C13.25 10.8966 13.0129 11.4371 12.591 11.8356C12.169 12.2341 11.5967 12.458 11 12.458H8.75V13.8747H11C11.9946 13.8747 12.9484 13.5015 13.6517 12.8373C14.3549 12.1732 14.75 11.2723 14.75 10.333V8.20801H13.25Z" fill="white"/>
        </svg>
        Switch Filters
      </a-button>
    </div>
  </template>

  <a-row :gutter="16">
    <!-- Left Sidebar - Filters -->
    <a-col :span="4">
      <div class="filters-section">
        <div class="filter-group">
          <h4>Room Type</h4>
          <a-select 
            v-model:value="filterRoomType" 
            placeholder="All Rooms"
            style="width: 100%"
          >
            <a-select-option value="">All Rooms</a-select-option>
            <a-select-option value="floor">Floor</a-select-option>
            <a-select-option value="wall">Wall</a-select-option>
            <a-select-option value="furniture">Furniture</a-select-option>
            <a-select-option value="light">Light</a-select-option>
          </a-select>
        </div>
        
        <div class="filter-group">
          <h4>Brand</h4>
          <a-select 
            v-model:value="filterBrand" 
            placeholder="All Brand"
            style="width: 100%"
          >
            <a-select-option value="">All Brand</a-select-option>
          </a-select>
        </div>

        <div class="filter-group">
          <h4>Store-specific categories</h4>
          <a-checkbox-group v-model:value="filterCategories" @change="updateFilter">
            <div class="checkbox-item">
              <a-checkbox value="sofa-sets">Sofa Sets</a-checkbox>
            </div>
            <div class="checkbox-item">
              <a-checkbox value="sale">Sale</a-checkbox>
            </div>
            <div class="checkbox-item">
              <a-checkbox value="beds">Beds</a-checkbox>
            </div>
            <div class="checkbox-item">
              <a-checkbox value="dining-sets">Dining Sets</a-checkbox>
            </div>
            <div class="checkbox-item">
              <a-checkbox value="armchairs">Armchairs / TV Chairs</a-checkbox>
            </div>
            <div class="checkbox-item">
              <a-checkbox value="youth-sofasice">Youth Sofasice</a-checkbox>
            </div>
            <div class="checkbox-item">
              <a-checkbox value="sofa-beds">Sofa Beds</a-checkbox>
            </div>
            <div class="checkbox-item">
              <a-checkbox value="kids-youth">Kids & Youth</a-checkbox>
            </div>
            <div class="checkbox-item">
              <a-checkbox value="mattresses">Mattresses</a-checkbox>
            </div>
            <div class="checkbox-item">
              <a-checkbox value="wardrobes">Wardrobes</a-checkbox>
            </div>
            <div class="checkbox-item">
              <a-checkbox value="coffee-tables">Coffee Tables & Sideboards</a-checkbox>
            </div>
            <div class="checkbox-item">
              <a-checkbox value="rugs">Rugs</a-checkbox>
            </div>
            <div class="checkbox-item">
              <a-checkbox value="recent-furniture">Recent Furniture</a-checkbox>
            </div>
          </a-checkbox-group>
        </div>
      </div>
    </a-col>

    <!-- Right Side - Products Tabs -->
    <a-col :span="20">
      <a-tabs v-model:activeKey="activeTab" class="products-tabs">
        
       
        <!-- Floor Textures Tab -->
        <a-tab-pane key="floor" class="tab-pane-content">
          <template #tab>
            <span>🟫 Floor Textures</span>
          </template>
          <div class="products-section">
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
    if (this.seeAll_Floor && this.seeAll_Floor.length > 0) {
      this.activeTab = 'floor'
    } else if (this.seeAll_Walls && this.seeAll_Walls.length > 0) {
      this.activeTab = 'wall'
    } else if (this.seeAll_furnitures && this.seeAll_furnitures.length > 0) {
      this.activeTab = 'furniture'
    } else if (this.seeAll_Lights && this.seeAll_Lights.length > 0) {
      this.activeTab = 'light'
    }
  },
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
  padding: 16px 0;
  max-height: 75vh;
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