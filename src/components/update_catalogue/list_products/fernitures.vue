<template>
  <div className="pt-8 sm:pt-2">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px; background: white; border-bottom: 1px solid #f0f0f0;">
      <span 
     
        style="
          font-family: Poppins;
          font-weight: 500;
          font-style: normal;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0;
        "
    
      
      >AI Catalog</span>
      <a-button size="small" type="default" @click="$emit('see-all-products', true)">See all</a-button>
    </div>
    
    <!-- Search Bar -->
    <div style="display: flex; gap: 8px; padding: 12px 16px; background: white; border-bottom: 1px solid #f0f0f0;">
      <a-input v-model:value="searchText" placeholder="Search products..." allow-clear style="flex: 1;" @input="handleSearchChange">
        <template #prefix>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#999" stroke-width="1.5"/>
            <path d="M14 14L11.1 11.1" stroke="#999" stroke-width="1.5"/>
          </svg>
        </template>
      </a-input>
      <a-button @click="showGrid = false" :type="!showGrid ? 'primary' : 'default'">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 10H15M2.5 5H17.5M7.5 15H12.5" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
      </a-button>
      <a-button @click="showGrid = true" :type="showGrid ? 'primary' : 'default'">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="3" width="6" height="6" stroke="currentcolor" stroke-width="1.5"/>
            <rect x="11" y="3" width="6" height="6" stroke="currentcolor" stroke-width="1.5"/>
            <rect x="3" y="11" width="6" height="6" stroke="currentcolor" stroke-width="1.5"/>
            <rect x="11" y="11" width="6" height="6" stroke="currentcolor" stroke-width="1.5"/>
          </svg>
      </a-button>
    </div>

    <!-- Scrollable Content -->
    <div class="overflow-y-auto p-[5px] bg-[#fafafa] md:h-[calc(76vh-120px)]">
      
      <!-- Furniture -->
      <a-collapse v-model:activeKey="productsActiveKey" style="margin-bottom: 12px;" v-if="furniture_products.length > 0">
        <a-collapse-panel key="products">
          <template #header>
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <span>Furniture</span>
              <a-badge :count="furnitureProductsPagination.total_count" />
            </div>
          </template>
          <a-empty v-if="!furniture_products.length" :image="simpleImage" />
          <div v-else :class="showGrid ? 'grid' : 'list'">
            <div v-for="item in filterItems(furniture_products, 'name')" :key="item.id"
                 class="item" :class="{selected: selected_texture === item.id}"
                 @click="selectfurnitureProduct('product', item.id, item['3d_model'], item.dimensions)">
              <img :src="$store.state.root_media_api + item.primary_image" :alt="item.name" />
              <div style="padding: 8px;">
                <div style="font-weight: 600; font-size: 13px;">{{ item.name }}</div>
                <div style="font-size: 11px; color: #999;">{{ truncate(item.description) }}</div>
              </div>
            </div>
          </div>
          <!-- Load More for Furniture -->
          <div v-if="furnitureProductsPagination.has_next" style="padding: 12px; text-align: center;">
            <a-button :loading="loadingFurniture" @click="loadMoreFurniture">
              {{ loadingFurniture ? 'Loading...' : 'Load More Furniture' }}
            </a-button>
          </div>
        </a-collapse-panel>
      </a-collapse>

      <!-- Lights -->
      <a-collapse v-model:activeKey="lightsActiveKey" v-if="lights.length > 0" style="margin-bottom: 12px;">
        <a-collapse-panel key="lights">
          <template #header>
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <span>Lights</span>
              <a-badge :count="lightsPagination.total_count" />
            </div>
          </template>
          <a-empty v-if="!lights.length" :image="simpleImage" />
          <div v-else :class="showGrid ? 'grid' : 'list'">
            <div v-for="item in filterItems(lights, 'name')" :key="item.id"
                 class="item" :class="{selected: selected_texture === item.id}"
                 @click="selectTexture('light', item.id, item['3d_model'], item.light_type)">
              <img :src="$store.state.root_media_api + item.primary_image" :alt="item.name" />
              <div style="padding: 8px;">
                <div style="font-weight: 600; font-size: 13px;">{{ item.name }}</div>
                <div style="font-size: 11px; color: #999;">{{ truncate(item.description) }}</div>
              </div>
            </div>
          </div>
          <!-- Load More for Lights -->
          <div v-if="lightsPagination.has_next" style="padding: 12px; text-align: center;">
            <a-button :loading="loadingLights" @click="loadMoreLights">
              {{ loadingLights ? 'Loading...' : 'Load More Lights' }}
            </a-button>
          </div>
        </a-collapse-panel>
      </a-collapse>
      
      <!-- Floors -->
      <a-collapse v-model:activeKey="floorsActiveKey" style="margin-bottom: 12px;" v-if="floors.length > 0">
        <a-collapse-panel key="floors">
          <template #header>
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <span>Floor Tiles</span>
              <a-badge :count="floorsPagination.total_count" />
            </div>
          </template>
          <a-empty v-if="!floors.length" :image="simpleImage" />
          <div v-else :class="showGrid ? 'grid' : 'list'">
            <div v-for="item in filterItems(floors)" :key="item.id" 
                 class="item" :class="{selected: selected_texture === item.id}"
                 @click="selectTexture('floor', item.id)">
              <img :src="$store.state.root_media_api + item.texture_image" :alt="item.title" />
              <div style="padding: 8px;">
                <div style="font-weight: 600; font-size: 13px;">{{ item.title }}</div>
                <div style="font-size: 11px; color: #999;">{{ truncate(item.description) }}</div>
              </div>
            </div>
          </div>
          <!-- Load More for Floors -->
          <div v-if="floorsPagination.has_next" style="padding: 12px; text-align: center;">
            <a-button :loading="loadingFloors" @click="loadMoreFloors">
              {{ loadingFloors ? 'Loading...' : 'Load More Floor Tiles' }}
            </a-button>
          </div>
        </a-collapse-panel>
      </a-collapse>

      <!-- Walls -->
      <a-collapse v-model:activeKey="wallsActiveKey" style="margin-bottom: 12px;" v-if="walls.length > 0">
        <a-collapse-panel key="walls">
          <template #header>
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <span>Wall Textures</span>
              <a-badge :count="wallsPagination.total_count" />
            </div>
          </template>
          <a-empty v-if="!walls.length" :image="simpleImage" />
          <div v-else :class="showGrid ? 'grid' : 'list'">
            <div v-for="item in filterItems(walls)" :key="item.id"
                 class="item" :class="{selected: selected_texture === item.id}"
                 @click="selectTexture('wall', item.id)">
              <img :src="$store.state.root_media_api + item.texture_image" :alt="item.title" />
              <div style="padding: 8px;">
                <div style="font-weight: 600; font-size: 13px;">{{ item.title }}</div>
                <div style="font-size: 11px; color: #999;">{{ truncate(item.description) }}</div>
              </div>
            </div>
          </div>
          <!-- Load More for Walls -->
          <div v-if="wallsPagination.has_next" style="padding: 12px; text-align: center;">
            <a-button :loading="loadingWalls" @click="loadMoreWalls">
              {{ loadingWalls ? 'Loading...' : 'Load More Wall Textures' }}
            </a-button>
          </div>
        </a-collapse-panel>
      </a-collapse>

    </div>
  </div>
</template>

<script>
import { Empty } from 'ant-design-vue';

export default {
  data() {
    return {
      searchText: '',
      showGrid: true,
      selected_texture: null,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      floors: [],
      walls: [],
      furniture_products: [],
      lights: [],
      floorsActiveKey: ['floors'],
      wallsActiveKey: ['walls'],
      productsActiveKey: ['products'],
      lightsActiveKey: ['lights'],
      pageSize: 20,
      
      // Pagination states
      floorsCurrentPage: 1,
      wallsCurrentPage: 1,
      furnitureCurrentPage: 1,
      lightsCurrentPage: 1,
      
      // Loading states
      loadingFloors: false,
      loadingWalls: false,
      loadingFurniture: false,
      loadingLights: false,
      
      // Pagination info
      floorsPagination: {
        total_count: 0,
        has_next: false,
        has_previous: false,
      },
      wallsPagination: {
        total_count: 0,
        has_next: false,
        has_previous: false,
      },
      furnitureProductsPagination: {
        total_count: 0,
        has_next: false,
        has_previous: false,
      },
      lightsPagination: {
        total_count: 0,
        has_next: false,
        has_previous: false,
      },
      
      searchTimeout: null,
    };
  },
  mounted() {
    const route = this.$route;
    this.catalogueId = route.params.id;
    this.brand = route.query.brand;

    if (this.brand) {
      console.log('Loading catalogue for brand:', this.brand);
      this.fetchData(this.brand);
    } else {
      console.log('Loading self products');
      this.fetchData();
    }
  },
  methods: {
    async fetchData(brand = null) {
      const endpoints = brand ? [
        { key: 'floors', url: `room/api/load-brand-products/floors/${brand}`, pagination: 'floorsPagination' },
        { key: 'walls', url: `room/api/load-brand-products/walls/${brand}`, pagination: 'wallsPagination' },
        { key: 'furniture_products', url: `product/api/load-brand-products/3d-products/${brand}`, pagination: 'furnitureProductsPagination' },
        { key: 'lights', url: `product/api/load-brand-products/lights/${brand}`, pagination: 'lightsPagination' }
      ] : [
        { key: 'floors', url: 'room/api/floors/', pagination: 'floorsPagination' },
        { key: 'walls', url: 'room/api/walls/', pagination: 'wallsPagination' },
        { key: 'furniture_products', url: 'product/api/3d-products/', pagination: 'furnitureProductsPagination' },
        { key: 'lights', url: 'product/api/lights/', pagination: 'lightsPagination' }
      ];

      const requests = endpoints.map(async ({ key, url, pagination }) => {
        try {
          const res = await fetch(`${this.$store.state.root_api}${url}?page=1&page_size=${this.pageSize}`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          });
          const data = await res.json();
          console.log("=========================================================================")
          console.log(key)
          console.log("=========================================================================")
          console.log(data)
          if (data?.data) {
            this[key] = data.data;
          }
          
          if (data?.pagination) {
            this[pagination] = data.pagination;
          }
        } catch (e) {
          console.error(`Failed to fetch ${key}:`, e);
        }
      });

      await Promise.all(requests);

      this.$emit('brand-products', {
        'floors': this.floors,
        'walls': this.walls,
        'furniture_products': this.furniture_products,
        'lights': this.lights
      });
    },

    async loadMoreFloors() {
      await this.loadMore('floors', 'room/api/load-brand-products/floors/', 'room/api/floors/', 'floorsCurrentPage', 'loadingFloors', 'floorsPagination');
    },

    async loadMoreWalls() {
      await this.loadMore('walls', 'room/api/load-brand-products/walls/', 'room/api/walls/', 'wallsCurrentPage', 'loadingWalls', 'wallsPagination');
    },

    async loadMoreFurniture() {
      await this.loadMore('furniture_products', 'product/api/load-brand-products/3d-products/', 'product/api/3d-products/', 'furnitureCurrentPage', 'loadingFurniture', 'furnitureProductsPagination');
    },

    async loadMoreLights() {
      await this.loadMore('lights', 'product/api/load-brand-products/lights/', 'product/api/lights/', 'lightsCurrentPage', 'loadingLights', 'lightsPagination');
    },

    async loadMore(dataKey, brandUrlPrefix, selfUrlPrefix, pageKey, loadingKey, paginationKey) {
      this[loadingKey] = true;
      try {
        const nextPage = this[pageKey] + 1;
        const url = this.brand 
          ? `${this.$store.state.root_api}${brandUrlPrefix}${this.brand}`
          : `${this.$store.state.root_api}${selfUrlPrefix}`;
        
        const fullUrl = `${url}?page=${nextPage}&page_size=${this.pageSize}${this.searchText ? `&search=${encodeURIComponent(this.searchText)}` : ''}`;
        
        const res = await fetch(fullUrl, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        
        if (data?.data) {
          this[dataKey] = [...this[dataKey], ...data.data];
          this[pageKey] = nextPage;
        }
        
        if (data?.pagination) {
          this[paginationKey] = data.pagination;
        }
      } catch (e) {
        console.error(`Failed to load more ${dataKey}:`, e);
        this.$message.error(`Failed to load more ${dataKey}`);
      } finally {
        this[loadingKey] = false;
      }
    },

    filterItems(items, field = 'title') {
      if (!this.searchText) return items;
      const s = this.searchText.toLowerCase();
      return items.filter(i => 
        (i[field]?.toLowerCase().includes(s)) || 
        (i.description?.toLowerCase().includes(s))
      );
    },

    truncate(text) {
      if (!text) return '';
      const words = text.split(' ');
      return words.length > 10 ? words.slice(0, 10).join(' ') + '...' : text;
    },

    handleSearchChange() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.floorsCurrentPage = 1;
        this.wallsCurrentPage = 1;
        this.furnitureCurrentPage = 1;
        this.lightsCurrentPage = 1;
        this.fetchData(this.brand);
      }, 500);
    },
    
    selectfurnitureProduct(type, id, model_url, dimensions = null) {
      this.selected_texture = id;
      this.$emit('product-selected', {
        'id': id,
        'type': type,
        'model_url': model_url,
        'width': dimensions?.width,
        'height': dimensions?.height,
        'depth': dimensions?.length
      });
    },

    selectTexture(type, id, model_url = null, light_type = null) {
      this.selected_texture = id;
      this.$emit('product-selected', {
        'id': id,
        'type': type,
        'model_url': model_url,
        'light_type': light_type
      });
    }
  }
};
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.list { display: grid; grid-template-columns: 1fr; gap: 10px; }

.grid .item > div { display: none; }

.item { background: white; border: 2px solid #f0f0f0; border-radius: 8px; cursor: pointer; overflow: hidden; }
.item:hover { border-color: #1890ff; }
.item.selected { border-color: #1890ff; box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1); }

.grid .item { display: flex; flex-direction: column; }
.list .item { display: flex; flex-direction: row; align-items: center; }

.item img { width: 100%; height: 100px; object-fit: cover; }
.list .item img { width: 100px; flex-shrink: 0; }
</style>