<template>
  <!-- Upgrade Modal -->
  <a-modal 
    v-model:open="showUpgradeModal" 
    centered
    :closable="false"
    :footer="null"
    width="500px"
  >
    <div class="upgrade-modal-content">
      <div class="modal-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          <circle cx="12" cy="16" r="1" fill="#ff4d4f"></circle>
        </svg>
      </div>
      <h2 class="modal-title">Feature Locked</h2>
      <p class="modal-description">
        Your current plan <strong>({{ currentPlanName }})</strong> doesn't include the 
        <strong>Switch Furniture</strong> feature.
      </p>
      <p class="modal-subdescription">
        Upgrade to unlock AI-powered furniture replacement and many more premium features!
      </p>
      <div class="modal-actions">
        <a-button type="primary" size="large" @click="goToUpgrade" block>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          Upgrade Now
        </a-button>
        <a-button size="large" @click="showUpgradeModal = false" block>Maybe Later</a-button>
      </div>
    </div>
  </a-modal>

  <!-- Switch Furniture Modal -->
  <a-modal :open="swichFurnitureModel" centered @cancel="showSwitchFurnitureModel()">
    <p>
      Furniture switching will replace all similar furniture in the room with the selected item.
      If the room does not already contain this type of furniture, the AI will rearrange or remove
      existing items to create enough space for it.
    </p>
    <template #title>Switch Furniture</template>
    <template #footer>
      <a-row>
        <a-col :sm="0" :xs="0" :lg="24" :md="24">
          <a-button type="primary" @click="startFurrnitureSwitch">Start Furniture Switch</a-button>
        </a-col>
        <a-col :sm="24" :xs="24" :lg="0" :md="0">
          <a-button type="primary" @click="startFurrnitureSwitch_mobile">Start Furniture Switch</a-button>
        </a-col>
      </a-row>
    </template>
  </a-modal>

  <div class="pt-wrapper">
    <!-- Mobile apply row (top) -->
    <div class="apply-section md:hidden">
      <a-row>
        <a-col :span="12" style="padding:0px 0px 0px 5px">
          <a-button type="default" size="large" block @click="showSwitchFurnitureModel" :disabled="!selected_item">
            Switch Furniture
          </a-button>
        </a-col>
        <a-col :span="12" style="padding:0px 0px 0px 5px">
          <a-button :disabled="!selected_item" type="primary" size="large" block @click="$emit('trigger-render-3d-object_mobile')">
            Add 3D Object
          </a-button>
        </a-col>
      </a-row>
      <br>
    </div>

    <div class="ai-catalog-section !mx-1 py-2">

      <!-- Header -->
      <div class="ai-catalog-header">
        <router-link :to="'/'+$route.query.brand">
          <div style="display:flex;gap:10px;">
            <a-avatar size="medium" style="border:1px solid rgba(0,0,0,0.2)" :src="this.$store.state.root_media_api+brand_data.business_picture"></a-avatar>
            <span class="!text-gray-700 py-3" style="font-family:Poppins;font-weight:700;font-style:normal;font-size:16px;line-height:20px;letter-spacing:0;margin-top:-6px">AI Catalog</span>
          </div>
        </router-link>
        <a-button size='small' type="default" class="see-all-link" @click="seeAllClicked">See all</a-button>
      </div>

      <!-- Search Bar -->
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
            Category: {{ appliedFilters.selectedCategories.length }} selected
            <button class="chip-remove" @click="removeFilter('selectedCategories')">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </span>
          <span v-if="appliedFilters.selectedFurnitureTypes.length > 0" class="filter-chip">
            Type: {{ appliedFilters.selectedFurnitureTypes.length }} selected
            <button class="chip-remove" @click="removeFilter('selectedFurnitureTypes')">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </span>
          <span v-if="appliedFilters.selectedColors.length > 0" class="filter-chip">
            Colors: {{ appliedFilters.selectedColors.length }} selected
            <button class="chip-remove" @click="removeFilter('selectedColors')">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
          </span>
          <button class="clear-all-btn" @click="clearAllFilters">Clear all</button>
        </div>
      </div>

      <!-- Scrollable Content Area -->
      <div class="scrollable-content">
        <div v-if="loading && catalogItems.length === 0" class="loading">
          <a-spin />
        </div>

        <div v-if="!loading || catalogItems.length > 0" class="product-container" :class="{ 'grid-view': showGrid, 'list-view': !showGrid }">
          <div v-for="(item, index) in catalogItems" :key="index" @click="updateItemRendering(item['id'],item['3d_model'],item['dimensions']['width'],item['dimensions']['height'],item['dimensions']['length'],item['is_resizable'],item['colors_available'])" style="
   background: #f2f2f2;
  border: none;
  height: 100%;
max-height: 250px;

  border-radius: 4px;
  padding:5px;"
            :style="selected_item===item.id ? 'border:1px solid blue': ''">
<!-- {{ item.colors_available }} -->
            <!-- {{item['dimensions']['width']}},{{item['dimensions']['height']}},{{item['dimensions']['length'] }}   -->
            <div class="product-item">
              <div class="product-image" style="position:relative;overflow:hidden;">
                <div v-if="!imageLoadedMap[item.id]" class="product-primary-skeleton"></div>
                <img :src="$store.state.root_media_api + item.primary_image" style="position:absolute;width:0;height:0;opacity:0;" @load="onProductImageLoad(item.id)" alt="" />
                <div style="position:absolute;bottom:5px;right:5px;display:flex;gap:5px;background-color:rgba(0,0,0,0.1);padding:3px 5px;border-radius:5px;">
                  <div v-for="color in item.colors_available.slice(0, 2)" :key="color.id" class="color-dot" style="width:14px;height:14px;" :style="{ backgroundColor: color.color }"></div>
                </div>
                <img v-show="imageLoadedMap[item.id]" :src="$store.state.root_media_api + item.primary_image" :alt="item.name" class="product-primary-image" />
                <div style="position:absolute;top:10px;left:0;right:0;display:flex;justify-content:space-between;padding:0 10px;pointer-events:none;">
                  <div style="background-color:#f2f2f2;color:black;border-radius:6px;padding:2px 8px;font-size:12px;height:22px;display:flex;align-items:center;">
                    {{ item.category.name }}
                  </div>
                  <div style="background-color:#f2f2f2;border-radius:6px;font-size:12px;height:22px;display:flex;align-items:center;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.8307 2.5H9.16406C5.62853 2.5 3.86076 2.5 2.76241 3.59835C1.66406 4.6967 1.66406 6.46447 1.66406 10C1.66406 13.5355 1.66406 15.3033 2.76241 16.4017C3.86076 17.5 5.62853 17.5 9.16406 17.5H10.8307C14.3662 17.5 16.1341 17.5 17.2324 16.4017C18.3307 15.3033 18.3307 13.5355 18.3307 10C18.3307 6.46447 18.3307 4.6967 17.2324 3.59835C16.1341 2.5 14.3662 2.5 10.8307 2.5Z" stroke="#666666" stroke-linecap="round"/>
                      <path d="M5 11.6667L6.4622 8.40642C6.73323 7.80215 6.86874 7.5 7.08333 7.5C7.29792 7.5 7.43344 7.80215 7.70447 8.40642L9.16667 11.6667M11.6667 11.6667V10M11.6667 10V8.5C11.6667 8.02859 11.6667 7.79289 11.8131 7.64645C11.9596 7.5 12.1952 7.5 12.6667 7.5H13.75C14.4403 7.5 15 8.05964 15 8.75C15 9.44033 14.4403 10 13.75 10M11.6667 10H13.75M13.75 10L14.5833 11.6667" stroke="#666666" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="product-info">
                <div class="product-name truncate">{{ truncateText(item.name || 'No Name available', 2) }}</div>
                <div class="product-price">Price <span style="font-weight:600;">${{item.pricing.price}}</span></div>
              </div>
            </div>

            <a-row>
              <a-col :span="18" style="padding-right:5px">
                <a-button block type="default" @click="this.$router.push('/'+item.business_slug+'/'+'product'+'/'+item.id)" style="border:none;">
                  Product Detail
                </a-button>
              </a-col>
              <a-col :span="6">
                <a-button block type="default" style="padding:0;display:flex;justify-content:center;align-items:center;border:none;" @click.stop="toggleLike(item.id, index)">
                  <HeartFilled v-if="item.is_liked" style="color:red;" />
                  <HeartOutlined v-else style="font-size:18px;" />
                </a-button>
              </a-col>
            </a-row>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="catalogItems.length > 0 && paginationInfo.has_next" class="load-more-container">
          <a-button block type="default" size="large" :loading="loadingMore" @click="loadMoreItems" class="load-more-btn">
            {{ loadingMore ? 'Loading...' : 'Load More' }}
          </a-button>
        </div>

        <div v-if="!loading && catalogItems.length === 0" class="no-items">
          <p>No products found</p>
        </div>
      </div>

      <!-- Desktop apply row (bottom) -->
      <div class="apply-section hidden md:block">
        <a-row>
          <a-col :span="12" style="padding:0px 0px 0px 5px">
            <a-button type="default" size="large" block @click="showSwitchFurnitureModel" :disabled="!selected_item">
              Switch Furniture
            </a-button>
          </a-col>
          <a-col :span="12" style="padding:0px 0px 0px 5px">
            <a-button :disabled="!selected_item" type="primary" size="large" block @click="$emit('trigger-render-3d-object')">
              Add 3D Object
            </a-button>
          </a-col>
        </a-row>
      </div>

      <!-- ===== FILTER POPOVER ===== -->
<transition :name="isMobile ? 'filter-bottom' : 'filter-pop'">
        <div v-if="showFilterDrawer" class="filter-popover">

          <div class="filter-drawer-header">
            <span class="filter-drawer-title">Filters</span>
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
              <p style="margin-top:12px;color:#999;font-size:13px;">Loading filters…</p>
            </div>

            <template v-else>

              <!-- ── Price Range ── -->
              <div class="filter-group">
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
              </div>

              <!-- ── Category ── -->
              <div class="filter-group" v-if="availableCategories.length > 0">
                <div class="filter-group-label">Category</div>
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

              <!-- ── Furniture Type ── -->
              <div class="filter-group" v-if="availableFurnitureTypes.length > 0">
                <div class="filter-group-label">Furniture Type</div>
                <div class="filter-pills">
                  <button
                    v-for="type in availableFurnitureTypes"
                    :key="type.furniture_type"
                    class="filter-pill"
                    :class="{ active: draftFilters.selectedFurnitureTypes.includes(type.furniture_type) }"
                    @click="toggleDraftFurnitureType(type.furniture_type)"
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
            <button class="btn-reset-filters" @click="resetDraftFilters">Reset</button>
            <button class="btn-apply-filters" @click="applyFilters">Apply</button>
          </div>

        </div>
      </transition>

    </div>
  </div>
</template>

<script>
import { HeartFilled, HeartOutlined } from '@ant-design/icons-vue';

export default {
  name: 'AiCatalog',

  props: {
    brand_data: Object,
  },

  data() {
    return {
      // Upgrade modal
      showUpgradeModal: false,
      currentPlanName: undefined,
      business_available_actions: undefined,
      planLoading: false,
      planLoaded: false,

      swichFurnitureModel: false,
      searchText: '',
      selected_item: '',
      loading: false,
      loadingMore: false,
      error: null,
      catalogItems: [],
      showGrid: true,
      imageLoadedMap: {},
      currentPage: 1,
      pageSize: 20,
      paginationInfo: {
        total_count: 0,
        total_pages: 0,
        has_next: false,
        has_previous: false,
      },
      searchTimeout: null,

      // Filter options from API
      availableCategories: [],
      availableFurnitureTypes: [],
      availableColors: [],
      loadingFilterOptions: false,

      // Filter Drawer
      showFilterDrawer: false,

      // Draft filters (live inside drawer before Apply)
      draftFilters: {
        priceRange: [0, 500000],
        selectedCategories: [],
        selectedFurnitureTypes: [],
        selectedColors: [],
      },

      // Applied filters (used in API fetch calls)
      appliedFilters: {
        priceRange: [0, 500000],
        selectedCategories: [],
        selectedFurnitureTypes: [],
        selectedColors: [],
      },
    };
  },

  components: {
    HeartFilled,
    HeartOutlined,
  },

  computed: {
  isMobile() {
    return window.innerWidth < 768
  },
    hasActiveFilters() {
      const f = this.appliedFilters;
      return !!(
        f.priceRange[0] > 0 ||
        f.priceRange[1] < 500000 ||
        f.selectedCategories.length > 0 ||
        f.selectedFurnitureTypes.length > 0 ||
        f.selectedColors.length > 0
      );
    },
    activeFilterCount() {
      const f = this.appliedFilters;
      let count = 0;
      if (f.priceRange[0] > 0 || f.priceRange[1] < 500000) count++;
      if (f.selectedCategories.length > 0) count++;
      if (f.selectedFurnitureTypes.length > 0) count++;
      if (f.selectedColors.length > 0) count++;
      return count;
    },
  },

  async mounted() {
    const route = this.$route;
    this.brand = route.query.brand;

    if (this.brand) {
      await this.loadBrandPurchasedPlanDetails();
    }

    if (this.brand) {
      this.fetchCatalogItems(this.brand, 1);
    } else {
      this.fetchCatalogItems(null, 1);
    }

    if (this.$route.query.product_type === 'furniture' && this.$route.query.product_id) {
      this.updateItemRendering(this.$route.query.product_id, '', 0, 0, 0, false);
    }

    this.loadFilterOptions();
  },

  methods: {
    makeUnselectItem() {
      this.selected_item = '';
    },

    // ─── Filter Options API ───────────────────────────────────────────────────
    async loadFilterOptions() {
      try {
        this.loadingFilterOptions = true;

        const url = `${this.$store.state.root_api}product/api/filter-options/`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          this.availableColors         = data.data.colors          || [];
          this.availableCategories     = data.data.categories      || [];
          this.availableFurnitureTypes = data.data.furniture_types || [];
        }
      } catch (error) {
        console.error('Failed to load filter options:', error);
      } finally {
        this.loadingFilterOptions = false;
      }
    },

    // ─── Draft toggle helpers ─────────────────────────────────────────────────
    toggleDraftCategory(categoryId) {
      const idx = this.draftFilters.selectedCategories.indexOf(categoryId);
      if (idx > -1) this.draftFilters.selectedCategories.splice(idx, 1);
      else          this.draftFilters.selectedCategories.push(categoryId);
    },

    toggleDraftFurnitureType(typeValue) {
      const idx = this.draftFilters.selectedFurnitureTypes.indexOf(typeValue);
      if (idx > -1) this.draftFilters.selectedFurnitureTypes.splice(idx, 1);
      else          this.draftFilters.selectedFurnitureTypes.push(typeValue);
    },

    toggleDraftColor(hexCode) {
      const idx = this.draftFilters.selectedColors.indexOf(hexCode);
      if (idx > -1) this.draftFilters.selectedColors.splice(idx, 1);
      else          this.draftFilters.selectedColors.push(hexCode);
    },

    // ─── Drawer open / apply / reset ─────────────────────────────────────────
    openFilterDrawer() {
      // Sync draft from currently applied state
      this.draftFilters = {
        priceRange:             [...this.appliedFilters.priceRange],
        selectedCategories:     [...this.appliedFilters.selectedCategories],
        selectedFurnitureTypes: [...this.appliedFilters.selectedFurnitureTypes],
        selectedColors:         [...this.appliedFilters.selectedColors],
      };
      this.showFilterDrawer = true;
    },

    applyFilters() {
      this.appliedFilters = {
        priceRange:             [...this.draftFilters.priceRange],
        selectedCategories:     [...this.draftFilters.selectedCategories],
        selectedFurnitureTypes: [...this.draftFilters.selectedFurnitureTypes],
        selectedColors:         [...this.draftFilters.selectedColors],
      };
      this.showFilterDrawer = false;
      this.currentPage = 1;
      this.fetchCatalogItems(this.brand, 1);
    },

    resetDraftFilters() {
      this.draftFilters = {
        priceRange: [0, 500000],
        selectedCategories: [],
        selectedFurnitureTypes: [],
        selectedColors: [],
      };
    },

    clearAllFilters() {
      const empty = { priceRange: [0, 500000], selectedCategories: [], selectedFurnitureTypes: [], selectedColors: [] };
      this.appliedFilters = { ...empty, priceRange: [...empty.priceRange] };
      this.draftFilters   = { ...empty, priceRange: [...empty.priceRange] };
      this.currentPage = 1;
      this.fetchCatalogItems(this.brand, 1);
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
      this.fetchCatalogItems(this.brand, 1);
    },

    // ─── Plan details ─────────────────────────────────────────────────────────
    async loadBrandPurchasedPlanDetails() {
      if (this.planLoading || this.planLoaded) return;
      this.planLoading = true;
      try {
        const brandSlug = this.$route.query.brand;
        if (!brandSlug) {
          this.currentPlanName = null;
          this.business_available_actions = { switch_furniture: false };
          return;
        }
        const url = `${this.$store.state.root_api}subscription/api/get-business-plan-details/${brandSlug}/`;
        const response = await fetch(url, {
          method: 'GET',
          headers: { Authorization: `Token ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.success && result.data) {
          this.currentPlanName = result.data.plan_name;
          this.business_available_actions = result.data;
        } else {
          this.currentPlanName = null;
          this.business_available_actions = { switch_furniture: false };
        }
      } catch (error) {
        console.error('Error loading plan details:', error);
        this.currentPlanName = null;
        this.business_available_actions = { switch_furniture: false };
      } finally {
        this.planLoading = false;
        this.planLoaded = true;
      }
    },

    async showSwitchFurnitureModel() {
      if (!this.planLoaded) await this.loadBrandPurchasedPlanDetails();
      if (!this.business_available_actions.switch_furniture) {
        this.showUpgradeModal = true;
        return;
      }
      this.swichFurnitureModel = !this.swichFurnitureModel;
    },

    goToUpgrade() {
      this.showUpgradeModal = false;
      this.$router.push('/pricing');
    },

    startFurrnitureSwitch() {
      this.showSwitchFurnitureModel();
      this.$emit('trigger-switch-furniture');
    },

    startFurrnitureSwitch_mobile() {
      this.showSwitchFurnitureModel();
      this.$emit('trigger-switch-furniture_mobile');
    },

    // ─── Catalog fetch ────────────────────────────────────────────────────────
    async fetchCatalogItems(brand = null, page = 1, isLoadMore = false) {
      if (page === 1 && !isLoadMore) {
        this.loading = true;
        this.catalogItems = [];
      } else {
        this.loadingMore = true;
      }

      try {
        let url = `${this.$store.state.root_api}product/api/3d-products/`;
        if (brand) {
          url = `${this.$store.state.root_api}product/api/load-brand-products/3d-products/${brand}`;
        }

        const sep = url.includes('?') ? '&' : '?';
        url += `${sep}page=${page}&page_size=${this.pageSize}`;

        if (this.searchText) url += `&search=${encodeURIComponent(this.searchText)}`;

        // ── Filter params (matching FurnitureProducts.vue behaviour) ──
        const f = this.appliedFilters;

        url += `&price_min=${f.priceRange[0]}&price_max=${f.priceRange[1]}`;

        if (f.selectedCategories.length > 0) {
          // Map IDs → names, same as FurnitureProducts.vue
          const names = f.selectedCategories.map(id => {
            const cat = this.availableCategories.find(c => c.id === id);
            return cat ? cat.name : id;
          });
          url += `&category=${encodeURIComponent(names.join(','))}`;
        }

        if (f.selectedFurnitureTypes.length > 0) {
          url += `&furniture_type=${encodeURIComponent(f.selectedFurnitureTypes.join(','))}`;
        }

        if (f.selectedColors.length > 0) {
          url += `&color_hex=${encodeURIComponent(f.selectedColors.join(','))}`;
        }

        const response = await fetch(url, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        });

        const data = await response.json();

        if (data && data.data) {
          this.catalogItems = isLoadMore
            ? [...this.catalogItems, ...data.data]
            : data.data;

          if (data.pagination) {
            this.paginationInfo = data.pagination;
            this.currentPage    = data.pagination.page;
          }
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
        this.$message.error('Failed to load products');
      } finally {
        this.loading     = false;
        this.loadingMore = false;
      }
    },

    loadMoreItems() {
      this.fetchCatalogItems(this.brand, this.currentPage + 1, true);
    },

    handleSearchChange() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.fetchCatalogItems(this.brand, 1);
      }, 500);
    },

    // ─── Misc helpers ─────────────────────────────────────────────────────────
    truncateChars(text, limit = 11) {
      if (!text) return '';
      return text.length > limit ? text.slice(0, limit) + '...' : text;
    },

    truncateText(text, wordLimit) {
      if (!text) return '';
      const words = text.split(' ');
      if (words.length <= wordLimit) return text;
      return words.slice(0, wordLimit).join(' ') + '...';
    },

    onProductImageLoad(id) {
      this.imageLoadedMap[id] = false;
      setTimeout(() => { this.imageLoadedMap[id] = true; }, 1000);
    },

    seeAllClicked() {
      this.$emit('products-see-all', true);
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

            smoothScrollToTop(900); // 900ms = very smooth
          }
        },
    updateItemRendering(model_id, model_url, width, height, depth,is_resizable=false,colors_available={}) {
this.smoothMobileScrolltoTop()

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

            smoothScrollToTop(900); // 900ms = very smooth
          }
      this.selected_item = model_id;
      
      // console.log("model_id --->",  model_id);
      // console.log("model_url --->",  model_url);
      // console.log("width --->",  width);
      // console.log("height --->",  height);
      // console.log("depth --->",  depth);
      // console.log("is_resizable --->",  is_resizable);


      this.$emit('change-3d-model', {
        'model_uuid': model_id,
        'model_url': model_url,
        'is_resizable': is_resizable,
        'width': width,
        'height': height,
        'depth': depth,
         'colors_available':colors_available
      });
    },

    async toggleLike(itemId, itemIndex) {
      try {
        const token = localStorage.getItem('token');
        if (!token) { this.$message.warning('Please login to add favorites'); return; }
        const response = await fetch(`${this.$store.state.root_api}likes/favorites/toggle/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
          body: JSON.stringify({ id: itemId, type: 'product' }),
        });
        const data = await response.json();
        this.catalogItems[itemIndex].is_liked = data.favorited;
        this.$message.success(data.favorited ? 'Added to favorites' : 'Removed from favorites');
      } catch (error) {
        console.error('Like toggle failed', error);
        this.$message.error('Failed to update favorite');
      }
    },
  },
};
</script>

<style scoped>
.ai-catalog-section {
  display: flex;
  flex-direction: column;
  height: 78vh;
  position: relative;
  overflow: hidden;
}

/* ── Upgrade Modal ── */
.upgrade-modal-content { text-align: center; padding: 20px 10px; }
.modal-icon { margin-bottom: 20px; display: flex; justify-content: center; animation: iconBounce 2s ease-in-out infinite; }
@keyframes iconBounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
.modal-title { font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; font-family: 'Poppins', sans-serif; }
.modal-description { font-size: 16px; color: #595959; line-height: 1.6; margin-bottom: 12px; }
.modal-description strong { color: #ff4d4f; font-weight: 600; }
.modal-subdescription { font-size: 14px; color: #8c8c8c; line-height: 1.5; margin-bottom: 30px; }
.modal-actions { display: flex; flex-direction: column; gap: 12px; }
.modal-actions .ant-btn { height: 48px; font-size: 16px; font-weight: 600; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.modal-actions .ant-btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; box-shadow: 0 4px 15px rgba(102,126,234,0.4); }
.modal-actions .ant-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102,126,234,0.5); }
@media (max-width: 768px) { .modal-title{font-size:22px} .modal-description{font-size:14px} .modal-subdescription{font-size:13px} }

/* ── Header ── */
.ai-catalog-header { display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
.see-all-link { color: #1890ff; text-decoration: none; }

/* ── Search ── */
.search-section { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; flex-shrink: 0; }
.search-input { flex: 1; }
.filter-icons { display: flex; gap: 8px; }

/* ── Buttons ── */
.filter-btn {
  position: relative; padding: 5px;
  border: 1px solid #d9d9d9; background: white; border-radius: 6px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #666; transition: background 0.18s, border-color 0.18s, color 0.18s;
}
.filter-btn:hover { background: #f5f5f5; border-color: #bbb; }
.filter-btn.active { background: #3B63FB; border-color: #3B63FB; }
.filter-btn.active svg path, .filter-btn.active svg rect { stroke: white; }
.filter-btn--active-filters { border-color: #3B63FB; color: #3B63FB; }
.filter-badge {
  position: absolute; top: -6px; right: -6px;
  background: #3B63FB; color: white; font-size: 10px; font-weight: 700;
  width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; line-height: 1;
}

/* ── Active filter chips ── */
.active-filters-bar { margin-bottom: 8px; flex-shrink: 0; }
.active-filters-chips { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.filter-chip { display: inline-flex; align-items: center; gap: 5px; background: #eef2ff; border: 1px solid #c7d2fe; color: #3B63FB; border-radius: 20px; padding: 3px 10px; font-size: 12px; font-weight: 500; }
.chip-remove { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; color: #3B63FB; opacity: 0.7; transition: opacity 0.15s; }
.chip-remove:hover { opacity: 1; }
.clear-all-btn { background: none; border: none; cursor: pointer; color: #ff4d4f; font-size: 12px; font-weight: 600; padding: 3px 6px; border-radius: 4px; transition: background 0.15s; }
.clear-all-btn:hover { background: #fff1f0; }

/* ── Scrollable ── */
.scrollable-content {
  flex: 1;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;           /* ← add this, was only on md+ */
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 767px) {
  .ai-catalog-section {
    height: auto;             /* ← was 78vh, which clips content */
    min-height: 0;
    overflow: visible;        /* ← let the page scroll naturally */
  }

  .scrollable-content {
    overflow: visible;        /* ← don't trap scroll inside component */
    height: auto;
  }
}
.scrollable-content::-webkit-scrollbar { width: 6px; }
.scrollable-content::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
.scrollable-content::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
.scrollable-content::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

.loading { text-align: center; padding: 40px; flex: 1; display: flex; justify-content: center; align-items: center; }

/* ── Product grid/list ── */
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

.product-primary-skeleton { width: 100%; height: 240px; border-radius: 8px; background: linear-gradient(110deg,#e5e7eb 8%,#f9fafb 18%,#e5e7eb 33%); background-size: 200% 100%; animation: product-shimmer 1.6s infinite linear; }
@keyframes product-shimmer { to { background-position-x: -200%; } }
.product-primary-image { width: 100%; height: 240px; object-fit: cover; border-radius: 8px; }

.list-view .product-item { display: flex; align-items: stretch; padding: 0; min-height: 120px; }
.list-view .product-image { width: 140px; height: 140px; position: relative; flex-shrink: 0; }
.list-view .product-info { flex: 1; padding: 16px 20px; display: flex; flex-direction: column; justify-content: space-between; }
.list-view .product-name { font-size: 16px; font-weight: 600; color: #1a1a1a; line-height: 1.4; }
.list-view .product-price { font-size: 16px; font-weight: 600; color: #1890ff; }

.grid-view .product-item { display: flex; flex-direction: column; padding: 0; }
.grid-view .product-image { width: 100%; height: 140px; position: relative; }
.grid-view .product-info { padding: 5px; flex: 1; display: flex; flex-direction: column; }
.grid-view .product-name { font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 4px; line-height: 1.4; }
.grid-view .product-price { font-size: 14px; font-weight: 600; color: #1890ff; margin-top: auto; }

.apply-section { flex-shrink: 0; padding-top: 8px; padding-left: 10px; padding-right: 10px; }
.load-more-container { flex-shrink: 0; padding: 16px 0; margin-top: auto; }
.load-more-btn { height: 40px; font-weight: 600; border-radius: 6px; }
.no-items { text-align: center; padding: 40px; color: #999; flex: 1; display: flex; justify-content: center; align-items: center; }

@media (max-width: 768px) {
  .list-view .product-image { width: 100px; height: 100px; }
  .list-view .product-info { padding: 12px 16px; }
  .list-view .product-name { font-size: 14px; }
  .grid-view .product-image { height: 120px; }
  .grid-view .product-info { padding: 5px; padding-bottom: 0; }
}

/* ── FILTER POPOVER ── */
.filter-popover {
 position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 100%;
  background: #fff;
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 4px 0 20px rgba(0,0,0,0.10);
  border-radius: 4px;
}

/* ── MOBILE: bottom drawer ── */
@media (max-width: 767px) {
  .filter-popover {
    /* detach from parent, attach to viewport bottom */
    position: fixed;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 80vh;           /* takes up 80% of screen */
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -4px 24px rgba(0,0,0,0.15);
    z-index: 9999;          /* above everything */
    overflow: hidden;
  }

  /* Dim backdrop on mobile */
  .filter-popover::before {
    content: '';
    position: fixed;
    inset: 0;
    /* background: rgba(0,0,0,0.4); */
    z-index: -1;
  }

  /* Allow body scroll inside drawer */
  .filter-drawer-body {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
}

/* ── Bottom drawer animation (mobile) ── */
.filter-bottom-enter-active,
.filter-bottom-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.filter-bottom-enter-from,
.filter-bottom-leave-to {
  transform: translateY(100%);
}
.filter-bottom-enter-to,
.filter-bottom-leave-from {
  transform: translateY(0);
}

/* ── Keep desktop slide-left animation ── */
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
.filter-drawer-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px 14px; border-bottom: 1px solid #f0f0f0; flex-shrink: 0; }
.filter-drawer-title { font-size: 16px; font-weight: 700; color: #1a1a1a; font-family: Poppins, sans-serif; }
.drawer-close-btn { background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; border-radius: 6px; transition: background 0.15s; }
.drawer-close-btn:hover { background: #f5f5f5; }

.filter-drawer-body { flex: 1; overflow-y: auto; padding: 16px 20px; display: flex; flex-direction: column; gap: 24px; }

.filter-group-label { font-size: 13px; font-weight: 600; color: #444; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
.price-range-label { margin-top: 6px; font-size: 12px; color: #666; }

/* Pills (category + furniture type) */
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

/* Color swatches */
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

/* Footer */
.filter-drawer-footer { display: flex; gap: 10px; padding: 14px 20px; border-top: 1px solid #f0f0f0; flex-shrink: 0; background: #fff; }
.btn-reset-filters { flex: 1; padding: 10px; border: 1px solid #d9d9d9; border-radius: 8px; background: white; font-size: 14px; font-weight: 600; color: #666; cursor: pointer; transition: all 0.15s; }
.btn-reset-filters:hover { background: #f5f5f5; }
.btn-apply-filters { flex: 1; padding: 10px; border: none; border-radius: 8px; background: #3B63FB; font-size: 14px; font-weight: 600; color: white; cursor: pointer; transition: all 0.15s; }
.btn-apply-filters:hover { background: #2a52e0; }

/* Slide-in animation */
.filter-pop-enter-active, .filter-pop-leave-active { transition: transform 0.26s cubic-bezier(0.32, 0.72, 0, 1); }
.filter-pop-enter-from, .filter-pop-leave-to { transform: translateX(-100%); }
.filter-pop-enter-to, .filter-pop-leave-from { transform: translateX(0); }
</style>