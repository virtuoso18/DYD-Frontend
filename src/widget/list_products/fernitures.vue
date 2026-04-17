<template>
<!-- {{ planDetails  }}
{{ planIsExpired }} -->
<!-- {{ brand_data }} -->
  <!-- <div className="pt-3 sm:pt-2"> -->
  <div class="catalog-root">  
    <!-- Header -->
    <div class="ai-catalog-header pt-2 !mx-1 ">
      <div class=" flex gap-2">
        <router-link :to="'/'+$route.query.brand">
          <div style="display: flex;gap:10px;">
            <a-avatar size="medium" style="border:1px solid rgba(0,0,0,0.2)" :src="this.$store.state.root_media_api+brand_data.business_picture"></a-avatar>
            <span class="!text-gray-700 py-3"  style="
            font-family: Poppins;
            font-weight: 700;
            font-style: normal;
            font-size: 16px;
            line-height: 18px;
            letter-spacing: 0;margin-top:-6px
            ">AI Catalog</span>
          </div>
        </router-link>
      </div>

      <a-button size='small' type="default" class="see-all-link"  @click="$emit('see-all-products', true)">See all</a-button>
    </div>
    
    <!-- Search Bar -->
    <div style="display: flex; gap: 8px; padding-left:8px;padding-right:8px; background: white; border-bottom: 1px solid #f0f0f0;">
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
    <div class="overflow-y-auto p-[5px] bg-[#fafafa] md:h-[calc(76vh-80px)]">
      <PlanBlockedOverlay
          :planDetails="planDetails"
          :planIsExpired="planIsExpired"
          :brand="brand_data"
        />
      
      <!-- Furniture -->
      <a-collapse v-model:activeKey="productsActiveKey" style="margin-bottom: 12px;" v-if="(furniture_products.length > 0 || initialLoadingFurniture) && brand_data?.brand_is_saling_furniture">
        <a-collapse-panel key="products">
          <template #header>
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <span>Furniture</span>
              <a-badge :count="furnitureProductsPagination.total_count" />
            </div>
          </template>
          
          <!-- Skeleton Loader for Furniture -->
          <div v-if="initialLoadingFurniture" :class="showGrid ? 'grid' : 'list'">
            <div v-for="n in 6" :key="'skeleton-furniture-' + n" class="skeleton-card">
              <div class="shimmer-skeleton"></div>
            </div>
          </div>

          <a-empty v-else-if="!furniture_products.length" :image="simpleImage" />
          
          <div v-else :class="showGrid ? 'grid' : 'list'">
            <div v-for="item in filterItems(furniture_products, 'name')" 
            
              :key="item.id"
              class="item relative overflow-hidden w-full h-[100px] cursor-pointer"
              :class="{ 'ring-2 ring-blue-500 shadow-lg': selected_texture === item.id }"
              @click="selectfurnitureProduct('product', item.id, item['3d_model'], item.dimensions,item.is_resizable,item.colors_available)"
              style="position:relative !important; overflow:hidden !important;"
              >
              <!-- Image Shimmer -->
              <div 
                v-if="!imageLoadedMap[item.id]"
                class="absolute inset-0 z-[100] shimmer-effect"
              ></div>

              <!-- Image -->
              <img 
                :src="$store.state.root_media_api + item.primary_image"
                :alt="item.name"
                class="furniture-image absolute inset-0 w-full h-full object-contain z-[50]"
                @load="onImageLoad(item.id)"
              />

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
      <a-collapse v-model:activeKey="lightsActiveKey" v-if="(lights.length > 0 || initialLoadingLights) && brand_data?.brand_is_saling_light" style="margin-bottom: 12px;">
        <a-collapse-panel key="lights">
          <template #header>
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <span>Lights</span>
              <a-badge :count="lightsPagination.total_count" />
            </div>
          </template>
          
          <!-- Skeleton Loader for Lights -->
          <div v-if="initialLoadingLights" :class="showGrid ? 'grid' : 'list'">
            <div v-for="n in 6" :key="'skeleton-lights-' + n" class="skeleton-card">
              <div class="shimmer-skeleton"></div>
            </div>
          </div>

          <a-empty v-else-if="!lights.length" :image="simpleImage" />
          
          <div v-else :class="showGrid ? 'grid' : 'list'">
            <div v-for="item in filterItems(lights, 'name')" :key="item.id"
                 class="item relative overflow-hidden w-full h-[100px] cursor-pointer" 
                 :class="{selected: selected_texture === item.id}"
                 @click="selectTexture('light', item.id, item['3d_model'], item.light_type)"
                 style="position:relative !important; overflow:hidden !important;">
              
              <!-- Image Shimmer -->
              <div 
                v-if="!imageLoadedMap[item.id]"
                class="absolute inset-0 z-[100] shimmer-effect"
              ></div>

              <img 
                :src="$store.state.root_media_api + item.primary_image" 
                :alt="item.name"
                class="furniture-image absolute inset-0 w-full h-full object-contain z-[50]"
                @load="onImageLoad(item.id)" />
              
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
      <a-collapse v-model:activeKey="floorsActiveKey" style="margin-bottom: 12px;" v-if="(floors.length > 0 || initialLoadingFloors) && brand_data?.brand_is_saling_floor">
        <a-collapse-panel key="floors">
          <template #header>
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <span>Floor Tiles</span>
              <a-badge :count="floorsPagination.total_count" />
            </div>
          </template>
          
          <!-- Skeleton Loader for Floors -->
          <div v-if="initialLoadingFloors" :class="showGrid ? 'grid' : 'list'">
            <div v-for="n in 6" :key="'skeleton-floors-' + n" class="skeleton-card">
              <div class="shimmer-skeleton"></div>
            </div>
          </div>

          <a-empty v-else-if="!floors.length" :image="simpleImage" />
          
          <div v-else :class="showGrid ? 'grid' : 'list'">
            <div v-for="item in filterItems(floors)" :key="item.id" 
                 class="item relative overflow-hidden w-full h-[100px] cursor-pointer" 
                 :class="{selected: selected_texture === item.id}"
                 @click="selectTexture('floor', item.id)"
                 style="position:relative !important; overflow:hidden !important;">
              
              <!-- Image Shimmer -->
              <div 
                v-if="!imageLoadedMap[item.id]"
                class="absolute inset-0 z-[100] shimmer-effect"
              ></div>

              <img 
                :src="$store.state.root_media_api + item.texture_image" 
                :alt="item.title"
                class="furniture-image absolute inset-0 w-full h-full object-contain z-[50]"
                @load="onImageLoad(item.id)" />
              
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
      <a-collapse v-model:activeKey="wallsActiveKey" style="margin-bottom: 12px;" v-if="(walls.length > 0 || initialLoadingWalls ) && brand_data?.brand_is_saling_wall">
        <a-collapse-panel key="walls">
          <template #header>
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <span>Wall Textures</span>
              <a-badge :count="wallsPagination.total_count" />
            </div>
          </template>
          
          <!-- Skeleton Loader for Walls -->
          <div v-if="initialLoadingWalls" :class="showGrid ? 'grid' : 'list'">
            <div v-for="n in 6" :key="'skeleton-walls-' + n" class="skeleton-card">
              <div class="shimmer-skeleton"></div>
            </div>
          </div>

          <a-empty v-else-if="!walls.length" :image="simpleImage" />
          
          <div v-else :class="showGrid ? 'grid' : 'list'">
            <div v-for="item in filterItems(walls)" :key="item.id"
                 class="item relative overflow-hidden w-full h-[100px] cursor-pointer" 
                 :class="{selected: selected_texture === item.id}"
                 @click="selectTexture('wall', item.id)"
                 style="position:relative !important; overflow:hidden !important;">
              
              <!-- Image Shimmer -->
              <div 
                v-if="!imageLoadedMap[item.id]"
                class="absolute inset-0 z-[100] shimmer-effect"
              ></div>

              <img 
                :src="$store.state.root_media_api + item.texture_image" 
                :alt="item.title"
                class="furniture-image absolute inset-0 w-full h-full object-contain z-[50]"
                @load="onImageLoad(item.id)" />
              
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
import PlanBlockedOverlay from '@/components/update_catalogue/planExpired.vue';

export default {
  name:"AllFurnituresScreen",
  data() {
    return {
      searchText: '',
      showGrid: true,
      selected_texture: null,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      floors: [],
      imageLoadedMap: {},
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
      
      // Initial loading states for skeleton
      initialLoadingFloors: true,
      initialLoadingWalls: true,
      initialLoadingFurniture: true,
      initialLoadingLights: true,
      
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
  components: { PlanBlockedOverlay },

  props: {
    brand_data: Object,
    planDetails:Object,
    planIsExpired:Object,
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
    truncateChars(text, limit = 11) {
      if (!text) return ''
      return text.length > limit
        ? text.slice(0, limit) + '...'
        : text
    },
    
    async fetchData(brand = null) {
      const endpoints = brand ? [
        { key: 'floors', url: `room/api/load-brand-products/floors/${brand}`, pagination: 'floorsPagination', loading: 'initialLoadingFloors' },
        { key: 'walls', url: `room/api/load-brand-products/walls/${brand}`, pagination: 'wallsPagination', loading: 'initialLoadingWalls' },
        { key: 'furniture_products', url: `product/api/load-brand-products/3d-products/${brand}`, pagination: 'furnitureProductsPagination', loading: 'initialLoadingFurniture' },
        { key: 'lights', url: `product/api/load-brand-products/lights/${brand}`, pagination: 'lightsPagination', loading: 'initialLoadingLights' }
      ] : [
        { key: 'floors', url: 'room/api/floors/', pagination: 'floorsPagination', loading: 'initialLoadingFloors' },
        { key: 'walls', url: 'room/api/walls/', pagination: 'wallsPagination', loading: 'initialLoadingWalls' },
        { key: 'furniture_products', url: 'product/api/3d-products/', pagination: 'furnitureProductsPagination', loading: 'initialLoadingFurniture' },
        { key: 'lights', url: 'product/api/lights/', pagination: 'lightsPagination', loading: 'initialLoadingLights' }
      ];

      const requests = endpoints.map(async ({ key, url, pagination, loading }) => {
        try {
          const res = await fetch(`${this.$store.state.root_api}${url}?page=1&page_size=${this.pageSize}`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          });
          const data = await res.json();
          
          if (data?.data) {
            this[key] = data.data;
          }
          
          if (data?.pagination) {
            this[pagination] = data.pagination;
          }
          
          // Set loading to false after data is fetched
          this[loading] = false;
        } catch (e) {
          console.error(`Failed to fetch ${key}:`, e);
          this[loading] = false;
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

    onImageLoad(id) {
      this.imageLoadedMap[id] = true;
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
        // Reset initial loading states for search
        this.initialLoadingFloors = true;
        this.initialLoadingWalls = true;
        this.initialLoadingFurniture = true;
        this.initialLoadingLights = true;
        
        this.floorsCurrentPage = 1;
        this.wallsCurrentPage = 1;
        this.furnitureCurrentPage = 1;
        this.lightsCurrentPage = 1;
        this.fetchData(this.brand);
      }, 500);
    },
    
    // selectfurnitureProduct(type, id, model_url, dimensions = null) {
    //   this.selected_texture = id;
    //   this.$emit('product-selected', {
    //     'id': id,
    //     'type': type,
    //     'model_url': model_url,
    //     'width': dimensions?.width,
    //     'height': dimensions?.height,
    //     'depth': dimensions?.length
    //   });
    // },
selectfurnitureProduct(type, id, model_url, dimensions = null,is_resizable=false,colors_available={}) {
  this.selected_texture = id;
  
  console.log('📦 Product selected:', {
    id,
    type,
    dimensions
  });
  
  this.$emit('product-selected', {
    'id': id,
    'type': type,
    'model_url': model_url,
    'width': dimensions?.width || 1.0,
    'height': dimensions?.height || 1.0,
    'depth': dimensions?.length || dimensions?.depth || 1.0 , // ✅ Check both fields
    'is_resizable':is_resizable,
    'colors_available':colors_available,
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

.ai-catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

/* Shimmer Effect for Images */
.shimmer-effect {
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  ) !important;
  background-size: 200% 100% !important;
  animation: shimmer 8s infinite linear !important;
  border-radius: 8px !important;
}

/* Skeleton Card Container */
.skeleton-card {
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  height: 120px;
}

.grid .skeleton-card {
  width: 100%;
  aspect-ratio: 95/100;
  height: auto;
}

.list .skeleton-card {
  width: 100%;
  height: 120px;
}

/* Shimmer Skeleton for Loading State */
.shimmer-skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: shimmer 8s infinite linear;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position-x: 0%; }
  100% { background-position-x: -200%; }
}

.furniture-image {
  border-radius: 8px !important;
}

.see-all-link {
  color: #1890ff;
  text-decoration: none;
}




.catalog-root {
  position: relative;
  padding-top: 0.75rem; /* replaces the lost pt-3 */
}

@media (min-width: 640px) {
  .catalog-root {
    padding-top: 0.5rem; /* sm:pt-2 */
  }
}</style>
