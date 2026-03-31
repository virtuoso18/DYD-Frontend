<template>
<!-- {{planDetails}}
{{planIsExpired}} -->
<!-- {{ brand_data }} -->
  <div class="ai-catalog-section">

    <div class="apply-section md:hidden ">
      <a-button type="primary" size="large" block class="apply-button" @click="updateItemRendering()">
        Apply
      </a-button>
    </div>
   
    <div class="ai-catalog-header ">
      <router-link :to="'/'+$route.query.brand">
        <div style="display: flex;gap:10px;">
          <a-avatar size="medium" style="border:1px solid rgba(0,0,0,0.2)" :src="this.$store.state.root_media_api+brand_data.business_picture"></a-avatar>
          <span class="!text-gray-700 py-3"  style="
          font-family: Poppins;
          font-weight: 700;
          font-style: normal;
          font-size: 16px;
          line-height: 20px;
          letter-spacing: 0;margin-top:-6px
          ">AI Catalog</span>
        </div>
      </router-link>
      <a-button size='small' type="default" class="see-all-link" @click="seeAllClicked">See all</a-button>
    </div>
    
    <!-- Fixed Search Bar -->
    <div class="search-section">
      <a-input 
        v-model:value="searchText" 
        placeholder="Search"
        class="search-input"
        @input="handleSearchChange"
      >
        <template #prefix>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 14L11.1 11.1" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
      </a-input>
      <div class="filter-icons">
        <!-- Filter Button -->
        <button @click="openFilterDrawer" class="filter-btn" :class="{ 'filter-btn--active-filters': hasActiveFilters }">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2.5 5H17.5M5.5 10H14.5M8.5 15H11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span v-if="activeFilterCount > 0" class="filter-badge">{{ activeFilterCount }}</span>
        </button>

        <!-- Grid View Toggle Button -->
        <button @click="showGrid = true" class="filter-btn" :class="{ active: showGrid }">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="3" width="6" height="6" stroke="#666" stroke-width="1.5"/>
            <rect x="11" y="3" width="6" height="6" stroke="#666" stroke-width="1.5"/>
            <rect x="3" y="11" width="6" height="6" stroke="#666" stroke-width="1.5"/>
            <rect x="11" y="11" width="6" height="6" stroke="#666" stroke-width="1.5"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Active Filter Chips -->
    <div v-if="hasActiveFilters" class="active-filters-bar">
      <div class="active-filters-chips">
        <span v-if="appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 500000" class="filter-chip">
          Price: ${{ appliedFilters.priceRange[0].toLocaleString('en-IN') }} – ${{ appliedFilters.priceRange[1].toLocaleString('en-IN') }}
          <button class="chip-remove" @click="removeFilter('price')">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </span>
       
      <span v-if="appliedFilters.selectedRoomTypes.length > 0" class="filter-chip">
        Room: {{ appliedFilters.selectedRoomTypes.length }} selected
        <button class="chip-remove" @click="removeFilter('selectedRoomTypes')">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </span>
        <span v-if="appliedFilters.selectedColors.length > 0" class="filter-chip">
          Colors: {{ appliedFilters.selectedColors.length }} selected
          <button class="chip-remove" @click="removeFilter('color')">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </span>
        <span v-if="activeStyleLabels.length > 0" class="filter-chip">
          Style: {{ activeStyleLabels.join(', ') }}
          <button class="chip-remove" @click="removeFilter('styles')">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </span>
        <span v-if="appliedFilters.sort_by" class="filter-chip">
          Sort: {{ sortByLabel }}
          <button class="chip-remove" @click="removeFilter('sort_by')">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </span>
        <button class="clear-all-btn" @click="clearAllFilters">Clear all</button>
      </div>
    </div>

    <!-- Scrollable Content Area -->
     <PlanBlockedOverlay
    :planDetails="planDetails"
    :planIsExpired="planIsExpired"
:brand="brand_data"  />
    <div class="scrollable-content">
      <!-- Loading initial -->
      <div v-if="loading && catalogItems.length === 0" class="loading">
        <a-spin />
      </div>

      <!-- Product Grid/List -->
      <div v-if="!loading || catalogItems.length > 0" class="product-container" :class="{ 'grid-view': showGrid, 'list-view': !showGrid }">
        
        <div v-for="(item, index) in catalogItems" :key="index" style="
background: #f2f2f2;
border: none;
height: 100%;
max-height: 250px;

border-radius: 4px;
padding:5px;
"
 @click="selectTexture(item.id)"
:style="selected_texture===item.id ? 'border:1px solid blue': ''">
          <div class="product-item">

           <div class="product-image" style="position: relative; overflow: hidden;">
  <!-- Skeleton -->
  <div
    v-if="!imageLoadedMap[item.id]"
    class="texture-image-skeleton"
  ></div>

  <!-- Preload image -->
  <img
    :src="$store.state.root_media_api + item.texture_image"
    style="position:absolute;width:0;height:0;opacity:0;"
    @load="onTextureImageLoad(item.id)"
    alt=""
  />
<div style="position:absolute;bottom:5px;right:5px;display:flex;gap:5px;background-color: rgba(0,0,0,0.1);padding:3px 5px;;border-radius:5px;">
                  <div v-for="color in item.colors_available.slice(0, 3)" :key="color.id" class="color-dot" style="width: 14px;height: 14px;" :style="{ backgroundColor: color.color_hex }"></div>
                </div>
                
  <!-- Visible image -->
  <img
    v-show="imageLoadedMap[item.id]"
    :src="$store.state.root_media_api + item.texture_image"
    :alt="item.title"
    class="texture-image"
  />
</div>

            <div class="product-info">
              <div class="product-name">{{ truncateText( item.title || 'No description available', 3) }}</div>
              
              <!-- <div class="product-details" style="display:flex;justify-content: space-between;">
                <span class="product-color">Colors </span>
                <div style="display: flex; gap: 4px; align-items: center; margin-left: 8px;">
                  <div v-for="color in item.colors_available.slice(0, 3)" :key="color.id" class="color-dot" :style="{ backgroundColor: color.color_hex }"></div>
                </div>
              </div> -->
              <div class="product-price">Price <span style="font-weight: 600;">$ {{ item.sale_price_per_sqm || 0 }}</span></div>
            </div>
          </div>

          <a-row>
            <a-col :span="18" style="padding-right:5px">
              <a-button  block type="default" @click.stop="this.$router.push('/'+item.business_slug+'/'+'floor'+'/'+item.id)"  style=" border: none;">
                Product Detail
              </a-button>
            </a-col>
            <a-col :span="6" style="">
              <a-button  block type="default" style="padding:0;display: flex;justify-content: center;align-items: center; border: none;" @click.stop="toggleLike(item.id, index)">
                  <HeartFilled v-if="item.is_liked" style="color: red; font-size: 18px;" />
                  <HeartOutlined v-else style="font-size: 18px;" />
              </a-button>
            </a-col>
          </a-row>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="catalogItems.length > 0 && paginationInfo.has_next" class="load-more-container">
        <a-button 
          block 
          type="default" 
          size="large"
          :loading="loadingMore"
          @click="loadMoreItems"
          class="load-more-btn"
        >
          {{ loadingMore ? 'Loading...' : 'Load More' }}
        </a-button>
      </div>

      <!-- No items message -->
      <div v-if="!loading && catalogItems.length === 0" class="no-items">
        <p>No products found</p>
      </div>
    </div>

    <div class="apply-section hidden md:block">
      <a-button type="primary" size="large" block class="apply-button" @click="updateItemRendering()">
        Apply
      </a-button>
    </div>

    <!-- ===== FILTER POPOVER (inline, slides from left) ===== -->
    <transition name="fade">
  <div
    v-if="showFilterDrawer && isMobile"
    class="filter-backdrop"
    @click="showFilterDrawer = false"
  />
</transition>

<!-- Filter Popover -->
<transition :name="isMobile ? 'filter-bottom' : 'filter-pop'">
  <div v-if="showFilterDrawer" class="filter-popover" :class="{ 'filter-popover--mobile': isMobile }">
   
   
        <div class="filter-drawer-header">
          <span class="filter-drawer-title">Filters</span>
          <button class="drawer-close-btn" @click="showFilterDrawer = false">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M1 1L17 17M17 1L1 17" stroke="#333" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="filter-drawer-body">

          <!-- Price Range (Slider) -->
          <div class="filter-group">
            <div class="filter-group-label">Price Range (per sqm)</div>
            <a-slider
              :min="0"
              :max="500000"
              v-model:value="draftFilters.priceRange"
              range
              :tip-formatter="(val) => '$' + val.toLocaleString('en-IN')"
            />
            <p class="price-range-label">
              ${{ draftFilters.priceRange[0].toLocaleString('en-IN') }} – ${{ draftFilters.priceRange[1].toLocaleString('en-IN') }}
            </p>
          </div>

                    
          <div class="filter-group" v-if="availableRoomTypes.length > 0">
            <div class="filter-group-label">Room Type</div>
            <div class="filter-style-options">
              <button
                v-for="room in availableRoomTypes"
                :key="room.id"
                class="sort-option-btn"
                :class="{ active: draftFilters.selectedRoomTypes.includes(room.id) }"
                @click="toggleDraftRoomType(room.id)"
              >
                {{ room.name }}
                <span style="opacity:0.6;font-size:11px;">({{ room.product_count }})</span>
              </button>
            </div>
          </div>
          
          <!-- Style Filter -->
          <div class="filter-group">
            <div class="filter-group-label">Style</div>
            <div class="filter-style-options">
              <button
                v-for="style in styleOptions" :key="style.value"
                class="sort-option-btn"
                :class="{ active: draftFilters.styles[style.value] }"
                @click="draftFilters.styles[style.value] = !draftFilters.styles[style.value]"
              >
                {{ style.label }}
              </button>
            </div>
          </div>


          <!-- Color Filter (Dynamic from API) -->
          <div class="filter-group">
            <div class="filter-group-label">Color</div>
            <div v-if="loadingColors" style="text-align:center;padding:10px;">
              <a-spin size="small" />
            </div>
            <div v-else class="filter-color-swatches">
              <button
                v-for="color in availableColors" :key="color.id"
                class="color-swatch-btn"
                :class="{ active: draftFilters.selectedColors.includes(color.color_hex) }"
                :title="color.title"
                @click="toggleDraftColor(color.color_hex)"
              >
                <span
                  class="swatch-circle"
                  :style="{ background: color.color_hex, border: color.color_hex === '#ffffff' || color.color_hex === '#FFFFFF' ? '1px solid #ddd' : 'none' }"
                >
                  <span
                    v-if="draftFilters.selectedColors.includes(color.color_hex)"
                    class="swatch-check"
                  >✓</span>
                </span>
                <span class="swatch-label">{{ color.title }}</span>
              </button>
              <div v-if="availableColors.length === 0" style="color:#999;font-size:12px;">
                No colors available
              </div>
            </div>
          </div>

        </div>

        <div class="filter-drawer-footer">
          <button class="btn-reset-filters" @click="resetDraftFilters">Reset</button>
          <button class="btn-apply-filters" @click="applyFilters">Apply</button>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import { HeartFilled, HeartOutlined } from '@ant-design/icons-vue';
import PlanBlockedOverlay from '../../update_catalogue/planExpired.vue';

export default {
  name: 'AiCatalog',
  
  props:{
    brand_data:Object,
    planDetails:Object,
    planIsExpired:Object,
  },
  data() {
    return {
      searchText: '',
          isMobile: window.innerWidth < 768,

      selected_texture: '',
      loading: false,
      loadingMore: false,
      loadingColors: false,
      error: null,
      imageLoadedMap: {},
      catalogItems: [],
      showGrid: true,
      currentPage: 1,
      pageSize: 20,
      paginationInfo: {
        total_count: 0,
        total_pages: 0,
        has_next: false,
        has_previous: false,
      },
      searchTimeout: null,
      likeTogglingIds: new Set(),

      // Dynamic colors from API
      availableColors: [],
      availableRoomTypes: [],

      // Filter Drawer
      showFilterDrawer: false,

      // Draft filters (inside drawer, not yet applied)
      draftFilters: {
        sort_by: '',
        priceRange: [0, 500000],
        selectedColors: [],
        selectedRoomTypes: [],
        styles: {
          modern: false,
          scandinavian: false,
          classic: false,
          minimalist: false,
          industrial: false,
          rustic: false,
          boho: false,
          other: false,
        },
      },

      // Applied filters (used in API calls)
      appliedFilters: {
        sort_by: '',
        priceRange: [0, 500000],
        selectedColors: [],
        selectedRoomTypes: [],
        styles: {
          modern: false,
          scandinavian: false,
          classic: false,
          minimalist: false,
          industrial: false,
          rustic: false,
          boho: false,
          other: false,
        },
      },

      sortOptions: [
        { label: 'Price: Low to High', value: 'price_asc' },
        { label: 'Price: High to Low', value: 'price_desc' },
        { label: 'Newest First', value: 'newest' },
        { label: 'Most Popular', value: 'popular' },
      ],

      styleOptions: [
        { label: 'Modern', value: 'modern' },
        { label: 'Scandinavian', value: 'scandinavian' },
        { label: 'Classic', value: 'classic' },
        { label: 'Minimalist', value: 'minimalist' },
        { label: 'Industrial', value: 'industrial' },
        { label: 'Rustic', value: 'rustic' },
        { label: 'Boho', value: 'boho' },
        { label: 'Other', value: 'other' },
      ],
    };
  },
  components: {
    HeartFilled,
    HeartOutlined,
    PlanBlockedOverlay
  },
  computed: {
    hasActiveFilters() {
      const f = this.appliedFilters;
      const priceChanged = f.priceRange[0] > 0 || f.priceRange[1] < 500000;
      const stylesActive = Object.values(f.styles).some(Boolean);
      return !!(f.sort_by || priceChanged || f.selectedColors.length > 0 || stylesActive || f.selectedRoomTypes.length > 0);
    },
    activeFilterCount() {
      const f = this.appliedFilters;
      let count = 0;
      if (f.sort_by) count++;
      if (f.priceRange[0] > 0 || f.priceRange[1] < 500000) count++;
      if (f.selectedColors.length > 0) count++;
      if (Object.values(f.styles).some(Boolean)) count++;
      if (f.selectedRoomTypes.length > 0) count++;
      return count;
    },
    sortByLabel() {
      const opt = this.sortOptions.find(o => o.value === this.appliedFilters.sort_by);
      return opt ? opt.label : '';
    },
    activeStyleLabels() {
      return this.styleOptions
        .filter(s => this.appliedFilters.styles[s.value])
        .map(s => s.label);
    },
  },
  mounted() {
    const route = this.$route;
    this.brand = route.query.brand;
    this.loadAvailableColors();

    if (this.brand) {
      console.log('Loading catalogue for brand:', this.brand);
      this.fetchCatalogItems(this.brand, 1);
    } else {
      console.log('Loading self products');
      this.fetchCatalogItems(null, 1);
    }

    if(this.$route.query.product_type=='floor' && this.$route.query.product_id){
      this.selectTexture(this.$route.query.product_id)
    }
  },
  methods: {
    truncateChars(text, limit = 11) {
      if (!text) return ''
      return text.length > limit
        ? text.slice(0, limit) + '...'
        : text
    },

    onTextureImageLoad(id) {
      this.imageLoadedMap[id] = false;
      setTimeout(() => {
        this.imageLoadedMap[id] = true;
      }, 1000);
    },

    // ---- Load colors from API ----
    async loadAvailableColors() {
      try {
        this.loadingColors = true;
        const brand = this.$route.query.brand;
        const url = brand
          ? `${this.$store.state.root_api}room/api/floors/colors/?brand=${brand}`
          : `${this.$store.state.root_api}room/api/floors/colors/`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          this.availableColors = data.data.map((color) => ({
            id: color.color_hex,
            title: color.title,
            color_hex: color.color_hex,
          }));
        }
        this.availableRoomTypes = data.room_types || [];
      } catch (error) {
        console.error('Failed to load colors:', error);
      } finally {
        this.loadingColors = false;
      }
    },

    // Toggle color in draft filters
    toggleDraftColor(hexCode) {
      const index = this.draftFilters.selectedColors.indexOf(hexCode);
      if (index > -1) {
        this.draftFilters.selectedColors.splice(index, 1);
      } else {
        this.draftFilters.selectedColors.push(hexCode);
      }
    },
    toggleDraftRoomType(roomTypeId) {
      const idx = this.draftFilters.selectedRoomTypes.indexOf(roomTypeId);
      if (idx > -1) this.draftFilters.selectedRoomTypes.splice(idx, 1);
      else          this.draftFilters.selectedRoomTypes.push(roomTypeId);
    },

    // Open drawer and sync draft from applied
    openFilterDrawer() {
      this.draftFilters = {
        sort_by: this.appliedFilters.sort_by,
        priceRange: [...this.appliedFilters.priceRange],
        selectedColors: [...this.appliedFilters.selectedColors],
        styles: { ...this.appliedFilters.styles },
        selectedRoomTypes: [...this.appliedFilters.selectedRoomTypes]
      };
      this.showFilterDrawer = true;
    },

    async fetchCatalogItems(brand = null, page = 1, isLoadMore = false) {
      if (page === 1 && !isLoadMore) {
        this.loading = true;
        this.catalogItems = [];
      } else {
        this.loadingMore = true;
      }

      try {
        let url = `${this.$store.state.root_api}room/api/floors/`;
        
        if (brand) {
          url = `${this.$store.state.root_api}room/api/load-brand-products/floors/${brand}`;
        }

        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}page=${page}&page_size=${this.pageSize}`;

        if (this.searchText) {
          url += `&search=${encodeURIComponent(this.searchText)}`;
        }

        // Price range
        const f = this.appliedFilters;
        url += `&price_per_sqm_min=${f.priceRange[0]}&price_per_sqm_max=${f.priceRange[1]}`;

        // Sort
        if (f.sort_by) url += `&sort_by=${encodeURIComponent(f.sort_by)}`;

        // Colors
        if (f.selectedColors.length > 0) {
          url += `&color_hex=${encodeURIComponent(f.selectedColors.join(','))}`;
        }

        // Room Type:
        if (f.selectedRoomTypes.length > 0) {
          url += `&room_type=${encodeURIComponent(f.selectedRoomTypes.join(','))}`;
        }

        // Styles
        const selectedStyles = this.styleOptions
          .filter(s => f.styles[s.value])
          .map(s => s.label);
        if (selectedStyles.length > 0) {
          url += `&texture_style=${encodeURIComponent(selectedStyles.join(','))}`;
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        console.log(data);

        if (data && data.data) {
          if (isLoadMore) {
            this.catalogItems = [...this.catalogItems, ...data.data];
          } else {
            this.catalogItems = data.data;
          }

          if (data.pagination) {
            this.paginationInfo = data.pagination;
            this.currentPage = data.pagination.page;
          }
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
        this.$message.error('Failed to load products');
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },

    loadMoreItems() {
      const nextPage = this.currentPage + 1;
      this.fetchCatalogItems(this.brand, nextPage, true);
    },

    handleSearchChange() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.fetchCatalogItems(this.brand, 1);
      }, 500);
    },

    truncateText(text, wordLimit) {
      if (!text) return '';
      const words = text.split(' ');
      if (words.length <= wordLimit) return text;
      return words.slice(0, wordLimit).join(' ') + '...';
    },

    seeAllClicked() {
      this.$emit('floor-see-all', true);
    },

    smoothMobileScrolltoTop(){
      if (window.innerWidth < 500) {
        const smoothScrollToTop = (duration = 800) => {
          const start = window.scrollY;
          const startTime = performance.now();

          const easeInOutCubic = (t) =>
            t < 0.5
              ? 4 * t * t * t
              : 1 - Math.pow(-2 * t + 2, 3) / 2;

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, start * (1 - ease));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        };

        smoothScrollToTop(900);
      }
    },

    selectTexture(uuid) {
      this.smoothMobileScrolltoTop()
      console.log(uuid);
      this.selected_texture = uuid;
      this.$emit('texture-floor-product-selected', this.selected_texture);
    },

    updateItemRendering() {
      this.$emit('texture-selected', this.selected_texture);
    },

    // ---- Filter Methods ----

    applyFilters() {
      this.appliedFilters = {
        sort_by: this.draftFilters.sort_by,
        priceRange: [...this.draftFilters.priceRange],
        selectedColors: [...this.draftFilters.selectedColors],
        styles: { ...this.draftFilters.styles },
        selectedRoomTypes: [...this.draftFilters.selectedRoomTypes],
      };
      this.showFilterDrawer = false;
      this.currentPage = 1;
      this.fetchCatalogItems(this.brand, 1);
    },

    resetDraftFilters() {
      this.draftFilters = {
        sort_by: '',
        priceRange: [0, 500000],
        selectedColors: [],
        selectedRoomTypes: [],
        styles: {
          modern: false,
          scandinavian: false,
          classic: false,
          minimalist: false,
          industrial: false,
          rustic: false,
          boho: false,
          other: false,
        },
      };
    },

    clearAllFilters() {
      const empty = {
        sort_by: '',
        priceRange: [0, 500000],
        selectedColors: [],
        selectedRoomTypes: [],
        styles: {
          modern: false,
          scandinavian: false,
          classic: false,
          minimalist: false,
          industrial: false,
          rustic: false,
          boho: false,
          other: false,
        },
      };
      this.appliedFilters = { ...empty, priceRange: [0, 500000], selectedColors: [], styles: { ...empty.styles } };
      this.draftFilters   = { ...empty, priceRange: [0, 500000], selectedColors: [], styles: { ...empty.styles } };
      this.currentPage = 1;
      this.fetchCatalogItems(this.brand, 1);
    },

    removeFilter(type) {
      if (type === 'price') {
        this.appliedFilters.priceRange = [0, 500000];
        this.draftFilters.priceRange   = [0, 500000];
      } else if (type === 'color') {
        this.appliedFilters.selectedColors = [];
        this.draftFilters.selectedColors   = [];
      } else if (type === 'styles') {
        const reset = { modern: false, scandinavian: false, classic: false, minimalist: false, industrial: false, rustic: false, boho: false, other: false };
        this.appliedFilters.styles = { ...reset };
        this.draftFilters.styles   = { ...reset };
      } else if (type === 'selectedRoomTypes') {
        this.appliedFilters.selectedRoomTypes = [];
        this.draftFilters.selectedRoomTypes   = [];
      }
      else {
        this.appliedFilters[type] = '';
        this.draftFilters[type]   = '';
      }
      this.currentPage = 1;
      this.fetchCatalogItems(this.brand, 1);
    },

    async toggleLike(itemId, itemIndex) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          this.$message.warning('Please login to add favorites');
          return;
        }

        this.likeTogglingIds.add(itemId);

        const response = await fetch(
          `${this.$store.state.root_api}likes/favorites/toggle/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${token}`,
            },
            body: JSON.stringify({
              id: itemId,
              type: 'floor_texture',
            }),
          }
        );

        const data = await response.json();

        this.catalogItems[itemIndex].is_liked = data.favorited;
        
        const message = data.favorited ? 'Added to favorites' : 'Removed from favorites';
        this.$message.success(message);

      } catch (error) {
        console.error("Like toggle failed", error);
        this.$message.error('Failed to update favorite');
      } finally {
        this.likeTogglingIds.delete(itemId);
      }
    }
  }
};
</script>

<style scoped>
.ai-catalog-section {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

@media (min-width: 640px) {
  .ai-catalog-section {
    height: 78vh;
  }
}

.ai-catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.see-all-link {
  color: #1890ff;
  text-decoration: none;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
}

.filter-icons {
  display: flex;
  gap: 8px;
}

/* ---- Filter & Toggle Buttons ---- */
.filter-btn {
  position: relative;
  padding: 5px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: background 0.18s, border-color 0.18s, color 0.18s;
}

.filter-btn:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

.filter-btn--active-filters {
  border-color: #3B63FB;
  color: #3B63FB;
}

.filter-btn.active {
  background: #3B63FB;
  border-color: #3B63FB;
}

.filter-btn.active svg path,
.filter-btn.active svg rect {
  stroke: white;
}

.filter-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #3B63FB;
  color: white;
  font-size: 10px;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* ---- Active Filter Chips ---- */
.active-filters-bar {
  margin-bottom: 8px;
  flex-shrink: 0;
}

.active-filters-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #3B63FB;
  border-radius: 20px;
  padding: 3px 10px 3px 10px;
  font-size: 12px;
  font-weight: 500;
}

.chip-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: #3B63FB;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.chip-remove:hover { opacity: 1; }

.clear-all-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ff4d4f;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 4px;
  transition: background 0.15s;
}

.clear-all-btn:hover { background: #fff1f0; }

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
}

.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.loading {
  text-align: center;
  padding: 40px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  flex: 1;
}

.product-container.list-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-container.grid-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.texture-image-skeleton {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: texture-shimmer 1.6s infinite linear;
}

@keyframes texture-shimmer {
  to {
    background-position-x: -200%;
  }
}

.texture-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.product-item {
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 5px;
}

.list-view .product-item {
  display: flex;
  align-items: stretch;
  padding: 0;
  min-height: 120px;
}

.list-view .product-image {
  width: 140px;
  height: 140px;
  position: relative;
  flex-shrink: 0;
}

.list-view .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-view .product-info {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.list-view .product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
}

.list-view .product-color {
  font-size: 12px;
  color: #666666;
  width: 100%;
  font-weight: 400;
}

.list-view .color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.list-view .product-price {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  display: flex;
  justify-content: space-between;
}

.grid-view .product-item {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.grid-view .product-image {
  width: 100%;
  height: 140px;
  position: relative;
}

.grid-view .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.grid-view .product-info {
  padding: 5px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.grid-view .product-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
  line-height: 1.4;
  text-align: left;
}

.grid-view .product-color {
  font-size: 11px;
  color: #666666;
  font-weight: 400;
}

.grid-view .color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.grid-view .product-price {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
  text-align: left;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
}

.apply-section {
  flex-shrink: 0;
  padding-top: 8px
}

.apply-button {
  height: 44px;
  border-radius: 6px;
  font-weight: 600;
}

.load-more-container {
  flex-shrink: 0;
  padding: 16px 0;
  margin-top: auto;
}

.load-more-btn {
  height: 40px;
  font-weight: 600;
  border-radius: 6px;
}

.no-items {
  text-align: center;
  padding: 40px;
  color: #999;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .apply-section {
    padding-bottom: 20px;
  }

  .list-view .product-image {
    width: 100px;
    height: 100px;
  }

  .list-view .product-info {
    padding: 12px 16px;
  }

  .list-view .product-name {
    font-size: 14px;
  }

  .grid-view .product-image {
    height: 120px;
  }

  .grid-view .product-info {
    
    padding: 5px;
    padding-bottom: 0px;
  }
}

/* ======= FILTER POPOVER (inline, slides from left) ======= */

.filter-popover {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 4px 0 20px rgba(0,0,0,0.10);
  border-radius: 4px;
}

.filter-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 14px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.filter-drawer-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  font-family: Poppins, sans-serif;
}

.drawer-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: background 0.15s;
}

.drawer-close-btn:hover { background: #f5f5f5; }

.filter-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filter-group {}

.filter-group-label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-style-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sort-option-btn {
  padding: 6px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
  font-weight: 500;
}

.sort-option-btn:hover { border-color: #3B63FB; color: #3B63FB; }

.sort-option-btn.active {
  background: #3B63FB;
  border-color: #3B63FB;
  color: white;
}

.price-range-label {
  margin-top: 6px;
  font-size: 12px;
  color: #666;
}

.filter-color-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.color-swatch-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 4px 6px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.color-swatch-btn:hover { border-color: #bbb; }

.color-swatch-btn.active { border-color: #3B63FB; }

.swatch-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.swatch-check {
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 0 3px rgba(0,0,0,0.5);
  line-height: 1;
}

.swatch-label {
  font-size: 10px;
  color: #666;
  white-space: nowrap;
}

.filter-drawer-footer {
  display: flex;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
  background: #fff;
}

.btn-reset-filters {
  flex: 1;
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

/* .btn-reset-filters:hover { border-color: #ff4d4f; color: #ff4d4f; } */

.btn-apply-filters {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #3B63FB;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-apply-filters:hover { background: #2a52e0; }

/* Filter popover slide-from-left animation */
.filter-pop-enter-active,
.filter-pop-leave-active {
  transition: transform 0.26s cubic-bezier(0.32, 0.72, 0, 1);
}

.filter-pop-enter-from,
.filter-pop-leave-to {
  transform: translateX(-100%);
}

.filter-pop-enter-to,
.filter-pop-leave-from {
  transform: translateX(0);
}













/* ── Backdrop ── */
.filter-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 998;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Mobile bottom drawer ── */
.filter-popover--mobile {
  position: fixed !important;
  top: auto !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 80vh !important;
  border-radius: 16px 16px 0 0 !important;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15) !important;
  z-index: 999 !important;
  -webkit-overflow-scrolling: touch;
}

/* drag handle */
.filter-popover--mobile .filter-drawer-header::before {
  content: '';
  display: block;
  width: 36px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  margin: 0 auto 12px;
}

/* ── Bottom slide animation ── */
.filter-bottom-enter-active,
.filter-bottom-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.filter-bottom-enter-from,
.filter-bottom-leave-to { transform: translateY(100%); }
.filter-bottom-enter-to,
.filter-bottom-leave-from { transform: translateY(0); }

/* ── Fix mobile page scroll being blocked ── */
@media (max-width: 767px) {
  .ai-catalog-section {
    height: auto !important;
    overflow: visible !important;
  }

  .scrollable-content {
    overflow: visible !important;
    height: auto !important;
  }
}
</style>