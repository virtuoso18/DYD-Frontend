<template>

  <div >

    <div class="ai-catalog-section p-1 ">
      <div class="apply-section  md:hidden">
        <a-button type="primary" size="large" block class="apply-button" @click="$emit('Apply_Light_mobile', 'magnetic-light-Renerer-apply_mobile')">
          {{ t('catalog.list_products.lights.apply') }}
        </a-button>
      </div>

      <div class="ai-catalog-header py-1 px-1">
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
          ">{{ t('catalog.list_products.lights.ai_catalog') }}</span>
        </div>
      </router-link>
      <a-button size='small' type="default" class="see-all-link" @click="seeAllClicked">{{ t('catalog.list_products.lights.see_all') }}</a-button>
    </div>
      
      <!-- Fixed Search Bar -->
      <div class="search-section">
        <a-input 
          v-model:value="searchText" 
         :placeholder="t('catalog.list_products.lights.search_placeholder')"
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
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </span>
          <span v-if="appliedFilters.selectedCategories.length > 0" class="filter-chip">
            {{ t('catalog.list_products.lights.category_selected', { count: appliedFilters.selectedCategories.length }) }}
            <button class="chip-remove" @click="removeFilter('selectedCategories')">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </span>
          <span v-if="appliedFilters.selectedLightTypes.length > 0" class="filter-chip">
          {{ t('catalog.list_products.lights.type_selected', {count: appliedFilters.selectedLightTypes.length}) }}
            <button class="chip-remove" @click="removeFilter('selectedLightTypes')">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </span>
          <span v-if="appliedFilters.selectedRoomTypes.length > 0" class="filter-chip">
        {{ t('catalog.list_products.lights.room_selected', {count: appliedFilters.selectedRoomTypes.length}) }}
          <button class="chip-remove" @click="removeFilter('selectedRoomTypes')">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
        </span>
          <span v-if="appliedFilters.selectedColors.length > 0" class="filter-chip">
            Colors: {{ appliedFilters.selectedColors.length }} selected
            <button class="chip-remove" @click="removeFilter('selectedColors')">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </span>
          <button class="clear-all-btn" @click="clearAllFilters">{{ t('catalog.list_products.lights.clear_all') }}</button>
        </div>
      </div>
  
      <!-- Scrollable Content Area -->
       <PlanBlockedOverlay
        :planDetails="planDetails"
        :planIsExpired="planIsExpired"
        :brand="brand_data"
      />
      <div class="scrollable-content">
        <!-- Loading initial -->
        <div v-if="loading && catalogItems.length === 0" class="loading">
          <a-spin />
        </div>
  
        <!-- Product Grid/List -->
        <div v-if="!loading || catalogItems.length > 0" class="product-container" :class="{ 'grid-view': showGrid, 'list-view': !showGrid }">
          <div v-for="(item, index) in catalogItems" :key="index" @click="updateItemRendering(item.id, item.light_type, item['3d_model'],item)" style="
           background: #f2f2f2;
            border: none;
            max-height:250px;
            border-radius: 4px;
            padding:5px;"
            :style="selected_light===item.id ? 'border:1px solid blue': ''">
            <div class="product-item">
            <div class="product-image" style="position: relative; overflow: hidden;">
  <!-- Skeleton -->
  <div
    v-if="!imageLoadedMap[item.id]"
    class="catalog-product-skeleton"
  ></div>

  <!-- Preload -->
  <img
    :src="$store.state.root_media_api + item.primary_image"
    style="position:absolute;width:0;height:0;opacity:0;"
    @load="onProductImageLoad(item.id)"
    alt=""
  />
      <div style="position:absolute;bottom:5px;right:5px;display:flex;gap:5px;background-color: rgba(0,0,0,0.1);padding:3px 5px;;border-radius:5px;">
        <div v-for="color in item.colors_available.slice(0, 2)" :key="color.id" class="color-dot" style="width: 14px;height: 14px;":style="{ backgroundColor: color.color }"></div>
      </div>
  <!-- Visible image -->
  <img
    v-show="imageLoadedMap[item.id]"
    :src="$store.state.root_media_api + item.primary_image"
    :alt="item.name"
    class="catalog-product-image"
  />
</div>

              <div class="product-info">
<div 
  class="product-name" 
  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;"
>
  {{ truncateChars(item.name || 'No name Available') }}
</div>
                <div class="product-price">
                  <span v-if="item.pricing.is_on_sale">
                   {{ t('catalog.list_products.lights.price') }}
                    <span style="text-decoration: line-through; color: #999; margin-left: 8px;">${{ item.pricing.price }}</span>
                  </span>
                  <span v-else style="font-weight:700 ;display: flex;justify-content: space-between;width:100%">
                    {{ t('catalog.list_products.lights.price') }} <span style="font-weight: 700;">${{ item.pricing.current_price }}</span>
                  </span>
                </div>
              </div>
            </div>
  
           <a-row>
              <a-col :span="24" style="padding-right:5px">
                <a-button block type="default" @click="this.$router.push('/'+item.business_slug+'/'+'product'+'/'+item.id)"  style="border: none;"  >
                {{ t('catalog.list_products.lights.product_detail') }}
                </a-button>
              </a-col>
              <!-- <a-col :span="6" style="">
                <a-button block type="default" style="padding:0;display: flex;justify-content: center;align-items: center;border: none;" @click.stop="toggleLike(item.id, index)">
                  <HeartFilled v-if="item.is_liked" style="color: red;" />
                  <HeartOutlined v-else style="font-size: 18px;" />
                </a-button>
              </a-col> -->
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
            {{ loadingMore ? t('catalog.list_products.lights.loading') : t('catalog.list_products.lights.load_more') }}
          </a-button>
        </div>
  
        <!-- No items message -->
        <div v-if="!loading && catalogItems.length === 0" class="no-items">
          <p>{{ t('catalog.list_products.lights.no_products') }}</p>
        </div>
      </div>

       <div class="apply-section hidden md:block">
        <a-button type="primary" size="large" block class="apply-button"  @click="$emit('Apply_Light', 'magnetic-light-Renerer-apply')">
          {{ t('catalog.list_products.lights.apply') }}
        </a-button>
      </div>

      <!-- ===== FILTER POPOVER ===== -->
      <!-- Backdrop (mobile only) -->
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
            <span class="filter-drawer-title">{{ t('catalog.list_products.lights.filters') }}</span>
            <button class="drawer-close-btn" @click="showFilterDrawer = false">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M1 1L17 17M17 1L1 17" stroke="#333" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="filter-drawer-body">

            <!-- Loading state for filter options -->
            <div v-if="loadingFilterOptions" style="text-align:center;padding:40px 0;">
              <a-spin />
              <p style="margin-top:12px;color:#999;font-size:13px;">{{ t('catalog.list_products.lights.loading_filters') }}</p>
            </div>

            <template v-else>

              <!-- ── Price Range ── -->
              <!-- <div class="filter-group">
                <div class="filter-group-label">Price Range</div>
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
              </div> -->
              <div class="filter-group" v-if="availableRoomTypes.length > 0">
              <div class="filter-group-label">{{ t('catalog.list_products.lights.room_type') }}</div>
              <div class="filter-pills">
                <button
                  v-for="room in availableRoomTypes"
                  :key="room.id"
                  class="filter-pill"
                  :class="{ active: draftFilters.selectedRoomTypes.includes(room.id) }"
                  @click="toggleDraftRoomType(room.id)"
                >
                  {{ room.name }}
                  <span class="pill-count">({{ room.product_count }})</span>
                </button>
              </div>
            </div>
              <!-- ── Category ── -->
              <div class="filter-group" v-if="availableCategories.length > 0">
                <div class="filter-group-label">{{ t('catalog.list_products.lights.category') }}</div>
                <div class="filter-pills">
                  <button
                    v-for="cat in availableCategories"
                    :key="cat.id"
                    class="filter-pill"
                    :class="{ active: draftFilters.selectedCategories.includes(cat.id) }"
                    @click="toggleDraftCategory(cat.id)"
                  >
                    {{ cat.name }}
                    <span class="pill-count">({{ cat.product_count }})</span>
                  </button>
                </div>
              </div>

              <!-- ── Light Type ── -->
              <div class="filter-group" v-if="availableLightTypes.length > 0">
                <div class="filter-group-label">{{ t('catalog.list_products.lights.light_type') }}</div>
                <div class="filter-pills">
                  <button
                    v-for="type in availableLightTypes"
                    :key="type.furniture_type"
                    class="filter-pill"
                    :class="{ active: draftFilters.selectedLightTypes.includes(type.furniture_type) }"
                    @click="toggleDraftLightType(type.furniture_type)"
                  >
                    {{ type.furniture_type }}
                    <span class="pill-count">({{ type.product_count }})</span>
                  </button>
                </div>
              </div>

              <!-- ── Colors ── -->
              <div class="filter-group" v-if="availableColors.length > 0">
                <div class="filter-group-label">Color</div>
                <div class="filter-color-swatches">
                  <button
                    v-for="color in availableColors"
                    :key="color.color"
                    class="color-swatch-btn"
                    :class="{ active: draftFilters.selectedColors.includes(color.color) }"
                    :title="color.color + ' (' + color.product_count + ' products)'"
                    @click="toggleDraftColor(color.color)"
                  >
                    <span
                      class="swatch-circle"
                      :style="{
                        background: color.color,
                        border: (color.color === '#ffffff' || color.color === '#FFFFFF')
                          ? '1px solid #ddd'
                          : '1px solid rgba(0,0,0,0.1)'
                      }"
                    >
                      <span v-if="draftFilters.selectedColors.includes(color.color)" class="swatch-check">✓</span>
                    </span>
                  </button>
                </div>
              </div>

            </template>
          </div>

          <div class="filter-drawer-footer">
            <button class="btn-reset-filters" @click="resetDraftFilters">{{ t('catalog.list_products.lights.reset') }}</button>
            <button class="btn-apply-filters" @click="applyFilters">{{ t('catalog.list_products.lights.apply') }}</button>
          </div>

        </div>
      </transition>

    </div>
  </div>
</template>

<script>
import { HeartFilled, HeartOutlined } from '@ant-design/icons-vue';
import PlanBlockedOverlay from '@/components/update_catalogue/planExpired.vue';
import { useI18n } from 'vue-i18n';
    

export default {
  name: 'AiCatalog',
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      searchText: '',
      selected_light: '',
      loading: false,
      loadingMore: false,
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
      productItems: [],
      showFilterDrawer: false,
      // Filter options from API
      availableCategories: [],
      availableLightTypes: [],
      availableColors: [],
      availableRoomTypes: [],
      loadingFilterOptions: false,

      draftFilters: {
        priceRange: [0, 500000],
        selectedCategories: [],
        selectedLightTypes: [],
        selectedColors: [],
        selectedRoomTypes: [],
      },

      appliedFilters: {
        priceRange: [0, 500000],
        selectedCategories: [],
        selectedLightTypes: [],
        selectedColors: [],
        selectedRoomTypes: [],
      },
    };
  },
  
  props:{
    brand_data:Object,
    planDetails:Object,
    planIsExpired:Object,
  },
  components: {
    HeartFilled,
    HeartOutlined,
    PlanBlockedOverlay
  },

  computed: {
    isMobile() {
    return window.innerWidth < 768;
  },
    hasActiveFilters() {
      const f = this.appliedFilters;
      return !!(
        f.priceRange[0] > 0 ||
        f.priceRange[1] < 500000 ||
        f.selectedCategories.length > 0 ||
        f.selectedLightTypes.length > 0 ||
        f.selectedColors.length > 0 ||
        f.selectedRoomTypes.length > 0   // ← add
      );
    },
    activeFilterCount() {
      const f = this.appliedFilters;
      let count = 0;
      if (f.priceRange[0] > 0 || f.priceRange[1] < 500000) count++;
      if (f.selectedCategories.length > 0) count++;
      if (f.selectedLightTypes.length > 0) count++;
      if (f.selectedColors.length > 0) count++;
      if (f.selectedRoomTypes.length > 0) count++;  // ← add
      return count;
    },
  },

  mounted() {
    const route = this.$route;
    this.brand = route.query.brand;

    if (this.brand) {
      console.log('Loading catalogue for brand:', this.brand);
      this.fetchLights(this.brand, 1);
    } else {
      console.log('Loading self products');
      this.fetchLights(null, 1);
    }

    this.loadFilterOptions();
  },
  methods: {
    truncateText(text, wordLimit) {
      if (!text) return '';
      const words = text.split(' ');
      if (words.length <= wordLimit) return text;
      return words.slice(0, wordLimit).join(' ') + '...';
    },

    truncateChars(text, limit = 11) {
      if (!text) return ''
      return text.length > limit ? text.slice(0, limit) + '...' : text
    },

    onProductImageLoad(id) {
      this.imageLoadedMap[id] = false;
      setTimeout(() => {
        this.imageLoadedMap[id] = true;
      }, 1000);
    },

    // ─── Filter Options API ───────────────────────────────────────────────────
    async loadFilterOptions() {
      try {
        this.loadingFilterOptions = true;
        const url = `${this.$store.state.root_api}product/api/lights/filter-options/`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
       if (data.success) {
          this.availableColors     = data.data.colors         || [];
          this.availableCategories = data.data.categories     || [];
          this.availableLightTypes = data.data.furniture_types || [];
          this.availableRoomTypes  = data.data.room_types     || [];  // ← add
        }
      } catch (error) {
        console.error('Failed to load filter options:', error);
      } finally {
        this.loadingFilterOptions = false;
      }
    },

    toggleDraftRoomType(roomTypeId) {
      const idx = this.draftFilters.selectedRoomTypes.indexOf(roomTypeId);
      const roomCategoryIds = this.availableCategories
        .filter(c => c.room_type_id === roomTypeId)
        .map(c => c.id);

      if (idx > -1) {
        this.draftFilters.selectedRoomTypes.splice(idx, 1);
        this.draftFilters.selectedCategories = this.draftFilters.selectedCategories
          .filter(catId => !roomCategoryIds.includes(catId));
      } else {
        this.draftFilters.selectedRoomTypes.push(roomTypeId);
        roomCategoryIds.forEach(catId => {
          if (!this.draftFilters.selectedCategories.includes(catId)) {
            this.draftFilters.selectedCategories.push(catId);
          }
        });
      }
    },

    toggleDraftCategory(categoryId) {
      const idx = this.draftFilters.selectedCategories.indexOf(categoryId);
      if (idx > -1) {
        this.draftFilters.selectedCategories.splice(idx, 1);
        const cat = this.availableCategories.find(c => c.id === categoryId);
        if (cat && cat.room_type_id) {
          const siblingsSelected = this.availableCategories.filter(c =>
            c.room_type_id === cat.room_type_id &&
            this.draftFilters.selectedCategories.includes(c.id)
          );
          if (siblingsSelected.length === 0) {
            this.draftFilters.selectedRoomTypes = this.draftFilters.selectedRoomTypes
              .filter(rtId => rtId !== cat.room_type_id);
          }
        }
      } else {
        this.draftFilters.selectedCategories.push(categoryId);
        const cat = this.availableCategories.find(c => c.id === categoryId);
        if (cat && cat.room_type_id) {
          const allSiblingIds = this.availableCategories
            .filter(c => c.room_type_id === cat.room_type_id).map(c => c.id);
          const allSelected = allSiblingIds.every(id =>
            this.draftFilters.selectedCategories.includes(id)
          );
          if (allSelected && !this.draftFilters.selectedRoomTypes.includes(cat.room_type_id)) {
            this.draftFilters.selectedRoomTypes.push(cat.room_type_id);
          }
        }
      }
    },

    toggleDraftLightType(typeValue) {
      const idx = this.draftFilters.selectedLightTypes.indexOf(typeValue);
      if (idx > -1) this.draftFilters.selectedLightTypes.splice(idx, 1);
      else          this.draftFilters.selectedLightTypes.push(typeValue);
    },

    toggleDraftColor(hexCode) {
      const idx = this.draftFilters.selectedColors.indexOf(hexCode);
      if (idx > -1) this.draftFilters.selectedColors.splice(idx, 1);
      else          this.draftFilters.selectedColors.push(hexCode);
    },

    // ─── Drawer open / apply / reset ─────────────────────────────────────────
    openFilterDrawer() {
      this.draftFilters = {
        priceRange:         [...this.appliedFilters.priceRange],
        selectedCategories: [...this.appliedFilters.selectedCategories],
        selectedLightTypes: [...this.appliedFilters.selectedLightTypes],
        selectedColors:     [...this.appliedFilters.selectedColors],
        selectedRoomTypes:  [...this.appliedFilters.selectedRoomTypes]
      };
      this.showFilterDrawer = true;
    },

    applyFilters() {
      this.appliedFilters = {
        priceRange:         [...this.draftFilters.priceRange],
        selectedCategories: [...this.draftFilters.selectedCategories],
        selectedLightTypes: [...this.draftFilters.selectedLightTypes],
        selectedColors:     [...this.draftFilters.selectedColors],
        selectedRoomTypes:  [...this.draftFilters.selectedRoomTypes]
      };
      this.showFilterDrawer = false;
      this.currentPage = 1;
      this.fetchLights(this.brand, 1);
    },

    resetDraftFilters() {
      this.draftFilters = {
        priceRange: [0, 500000],
        selectedCategories: [],
        selectedLightTypes: [],
        selectedColors: [],
        selectedRoomTypes: []
      };
    },

    clearAllFilters() {
      const empty = { priceRange: [0, 500000], selectedCategories: [], selectedLightTypes: [], selectedColors: [], selectedRoomTypes: [] };
      this.appliedFilters = { ...empty, priceRange: [...empty.priceRange] };
      this.draftFilters   = { ...empty, priceRange: [...empty.priceRange] };
      this.currentPage = 1;
      this.fetchLights(this.brand, 1);
    },

    removeFilter(type) {
      if (type === 'price') {
        this.appliedFilters.priceRange = [0, 500000];
        this.draftFilters.priceRange   = [0, 500000];
      } else {
        this.appliedFilters[type] = [];
        this.draftFilters[type]   = [];
      }
      this.currentPage = 1;
      this.fetchLights(this.brand, 1);
    },

    // ─── Lights fetch ─────────────────────────────────────────────────────────
    async fetchLights(brand = null, page = 1, isLoadMore = false) {
      if (page === 1 && !isLoadMore) {
        this.loading = true;
        this.catalogItems = [];
      } else {
        this.loadingMore = true;
      }

      try {
        // Build URLSearchParams to match the working LightsProducts component
        const params = new URLSearchParams();

        params.append('page', page);
        params.append('page_size', this.pageSize);

        if (this.searchText) {
          params.append('search', this.searchText);
        }

        // ── Price filters (matching LightsProducts: min_price / max_price) ──
        const f = this.appliedFilters;
        params.append('min_price', f.priceRange[0]);
        params.append('max_price', f.priceRange[1]);

        // ── Category: send comma-separated IDs (matching LightsProducts: category_id) ──
        if (f.selectedCategories.length > 0) {
          params.append('category_id', f.selectedCategories.join(','));
        }

        // ── Light/Furniture type: comma-separated strings (matching LightsProducts: furniture_type) ──
        if (f.selectedLightTypes.length > 0) {
          params.append('furniture_type', f.selectedLightTypes.join(','));
        }

        // ── Colors: comma-separated hex codes (matching LightsProducts: color) ──
        if (f.selectedColors.length > 0) {
          params.append('color', f.selectedColors.join(','));
        }

        if (f.selectedRoomTypes.length > 0) {
          params.append('room_type', f.selectedRoomTypes.join(','));
        }

        let url;
        if (brand) {
          url = `${this.$store.state.root_api}product/api/load-brand-products/lights/${brand}/?${params.toString()}`;
        } else {
          url = `${this.$store.state.root_api}product/api/lights/?${params.toString()}`;
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
       this.$message.error(this.t('catalog.list_products.lights.failed_to_load'));
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },

    loadMoreItems() {
      const nextPage = this.currentPage + 1;
      this.fetchLights(this.brand, nextPage, true);
    },

    handleSearchChange() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.fetchLights(this.brand, 1);
      }, 500);
    },

    seeAllClicked() {
      this.$emit('light-see-all', true);
    },

    updateItemRendering(uuid, type, model_3d_url,item) {
      this.selected_light = uuid;
      this.$emit('light-selected', {
        'uuid': uuid,
        'type': type,
        'model_3d_url': model_3d_url,
        'model_diamensions':{ width: item.dimensions.width, height: item.dimensions.height, depth: item.dimensions.length } 
      });
    },

    async toggleLike(itemId, itemIndex) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
           this.$message.warning(this.t('catalog.list_products.lights.login_to_favorite'));
          return;
        }
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
              type: 'light', 
            }),
          }
        );
        const data = await response.json();
        this.catalogItems[itemIndex].is_liked = data.favorited;
        const message = data.favorited ? this.t('catalog.list_products.lights.added_to_favorites') : this.t('catalog.list_products.lights.removed_from_favorites');
        this.$message.success(message);
      } catch (error) {
        console.error("Like toggle failed", error);
        this.$message.error(this.t('catalog.list_products.lights.failed_to_update_favorite'));
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
  overflow: visible;
}

@media (min-width: 640px) {
  .ai-catalog-section {
    height: 77vh;
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

/* ── Active filter chips ── */
.active-filters-bar { margin-bottom: 8px; flex-shrink: 0; }
.active-filters-chips { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.filter-chip { display: inline-flex; align-items: center; gap: 5px; background: #eef2ff; border: 1px solid #c7d2fe; color: #3B63FB; border-radius: 20px; padding: 3px 10px; font-size: 12px; font-weight: 500; }
.chip-remove { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; color: #3B63FB; opacity: 0.7; transition: opacity 0.15s; }
.chip-remove:hover { opacity: 1; }
.clear-all-btn { background: none; border: none; cursor: pointer; color: #ff4d4f; font-size: 12px; font-weight: 600; padding: 3px 6px; border-radius: 4px; transition: background 0.15s; }
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

.product-container { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1; }
.product-container.list-view { display: flex; flex-direction: column; gap: 12px; }
.product-container.grid-view { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.product-item { overflow: hidden; transition: all 0.3s ease; cursor: pointer; margin-bottom: 5px; }

.list-view .product-item { display: flex; align-items: stretch; padding: 0; min-height: 180px; }
.list-view .product-image { width: 140px; height: 140px; position: relative; flex-shrink: 0; }
.list-view .product-image img { width: 100%; height: 100%; object-fit: cover; }
.list-view .product-info { flex: 1; padding: 16px 20px; display: flex; flex-direction: column; justify-content: space-between; }
.list-view .product-name { font-size: 16px; font-weight: 600; color: #1a1a1a; line-height: 1.4; }
.list-view .product-details { display: flex; align-items: center; gap: 8px; }
.list-view .product-color { font-size: 12px; color: #666666; width: 100%; font-weight: 400; }
.list-view .color-dot { width: 12px; height: 12px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); }
.list-view .product-price { font-size: 16px; font-weight: 600; color: #1890ff; display: flex; justify-content: space-between; }

.grid-view .product-item { display: flex; flex-direction: column; padding: 0; }
.grid-view .product-image { width: 100%; height: 140px; position: relative; }
.grid-view .product-image img { width: 100%; height: 100%; object-fit: cover; }
.grid-view .product-info { padding: 5px; flex: 1; display: flex; flex-direction: column; }
.grid-view .product-name { font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 4px; line-height: 1.4; text-align: left; }
.grid-view .product-details { display: flex; align-items: center; gap: 6px; justify-content: flex-start; }
.grid-view .product-color { font-size: 11px; color: #666666; font-weight: 400; }
.grid-view .color-dot { width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); }
.grid-view .product-price { font-size: 14px; font-weight: 600; color: #1890ff; text-align: left; margin-top: auto; display: flex; justify-content: space-between; }

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
.filter-btn:hover { background: #f5f5f5; border-color: #bbb; }
.filter-btn.active {
  background: #3B63FB;
  border-color: #3B63FB;
}

.filter-btn.active svg path,
.filter-btn.active svg rect {
  stroke: white;
}

.filter-btn--active-filters { border-color: #3B63FB; color: #3B63FB; }

.filter-badge {
  position: absolute; top: -6px; right: -6px;
  background: #3B63FB; color: white; font-size: 10px; font-weight: 700;
  width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; line-height: 1;
}

.product-item {
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 5px;
}

.catalog-product-skeleton {
  width: 100%;
  height: 280px;
  border-radius: 12px;
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: catalog-shimmer 1.6s infinite linear;
}

.catalog-product-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 12px;
}

@keyframes catalog-shimmer {
  to { background-position-x: -200%; }
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
  padding-top: 16px;
}

@media (min-width: 300px) and (max-width: 900px) {
  .apply-section {
    padding-top: 0px;
  }
}

@media (min-width: 901px) {
  .apply-section {
    padding-top: 8px;
  }
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
    padding: 12px;
  }
}

/* ── FILTER POPOVER ── */
.filter-popover {
  position: absolute; top: 0; left: 0; bottom: 0; width: 100%;
  background: #fff; z-index: 50;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 4px 0 20px rgba(0,0,0,0.10); border-radius: 4px;
}

.filter-drawer-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px 14px; border-bottom: 1px solid #f0f0f0; flex-shrink: 0; }
.filter-drawer-title { font-size: 16px; font-weight: 700; color: #1a1a1a; font-family: Poppins, sans-serif; }
.drawer-close-btn { background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; border-radius: 6px; transition: background 0.15s; }
.drawer-close-btn:hover { background: #f5f5f5; }

.filter-drawer-body { flex: 1; overflow-y: auto; padding: 16px 20px; display: flex; flex-direction: column; gap: 24px; }

.filter-group-label { font-size: 13px; font-weight: 600; color: #444; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
.price-range-label { margin-top: 6px; font-size: 12px; color: #666; }

.filter-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.filter-pill {
  padding: 6px 12px; border: 1px solid #e0e0e0; border-radius: 20px;
  background: white; font-size: 12px; color: #555;
  cursor: pointer; transition: all 0.15s; font-weight: 500;
  display: flex; align-items: center; gap: 4px;
}
.filter-pill:hover { border-color: #3B63FB; color: #3B63FB; }
.filter-pill.active { background: #3B63FB; border-color: #3B63FB; color: white; }
.filter-pill.active .pill-count { color: rgba(255,255,255,0.7); }
.pill-count { font-size: 11px; color: #aaa; }

.filter-color-swatches { display: flex; flex-wrap: wrap; gap: 10px; }
.color-swatch-btn {
  background: none; border: 2px solid transparent; border-radius: 50%;
  padding: 2px; cursor: pointer; transition: border-color 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.color-swatch-btn:hover { border-color: #bbb; }
.color-swatch-btn.active { border-color: #3B63FB; }
.swatch-circle {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.swatch-check { color: white; font-size: 13px; font-weight: bold; text-shadow: 0 0 3px rgba(0,0,0,0.5); line-height: 1; }

.filter-drawer-footer { display: flex; gap: 10px; padding: 14px 20px; border-top: 1px solid #f0f0f0; flex-shrink: 0; background: #fff; }
.btn-reset-filters { flex: 1; padding: 10px; border: 1px solid #d9d9d9; border-radius: 8px; background: white; font-size: 14px; font-weight: 600; color: #666; cursor: pointer; transition: all 0.15s; }
.btn-reset-filters:hover { background: #f5f5f5; }
.btn-apply-filters { flex: 1; padding: 10px; border: none; border-radius: 8px; background: #3B63FB; font-size: 14px; font-weight: 600; color: white; cursor: pointer; transition: all 0.15s; }
.btn-apply-filters:hover { background: #2a52e0; }

.filter-pop-enter-active, .filter-pop-leave-active { transition: transform 0.26s cubic-bezier(0.32, 0.72, 0, 1); }
.filter-pop-enter-from, .filter-pop-leave-to { transform: translateX(-100%); }
.filter-pop-enter-to, .filter-pop-leave-from { transform: translateX(0); }



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