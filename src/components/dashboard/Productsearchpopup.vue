<template>
  <div>
    <!-- Search Trigger Bar -->
    <div class="search-trigger" @click="openPopup" > 
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <span class="trigger-text">Search products...</span>
    </div>

    <!-- Overlay + Popup -->
    <Teleport to="body">
      <div v-if="isOpen" class="psp-overlay" @click.self="closePopup">
        <div class="psp-popup">

          <!-- Search Bar -->
          <div class="psp-search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              ref="searchInputRef"
              v-model="query"
              type="text"
              placeholder="Search products, categories, types..."
              @input="onSearchInput"
            />
            <button class="psp-close-btn" @click="closePopup">✕</button>
          </div>

          <!-- Tabs -->
          <a-tabs
            v-model:activeKey="activeTab"
            size="small"
            class="psp-ant-tabs"
            :tabBarStyle="{ margin: 0, padding: '0 12px', borderBottom: '1px solid #F3F4F6' }"
            @change="onTabChange"
          >
            <a-tab-pane v-for="tab in tabs" :key="tab.key">
              <template #tab>
                <span class="psp-tab-label">
                  {{ tab.label }}
                  <span v-if="tabMeta[tab.key]?.total > 0" class="psp-tab-count">
                    {{ tabMeta[tab.key].total }}
                  </span>
                </span>
              </template>

              <!-- Filter chips bar -->
              <div v-if="hasActiveFilters(tab.key)" class="psp-active-filters-bar">
                <div class="psp-active-filters-chips">
                  <span
                    v-for="chip in activeFilterChips(tab.key)"
                    :key="chip.key"
                    class="psp-filter-chip"
                  >
                    {{ chip.label }}
                    <button class="psp-chip-remove" @click="removeFilter(tab.key, chip.key)">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </span>
                  <button class="psp-clear-all-btn" @click="clearAllFilters(tab.key)">Clear all</button>
                </div>
              </div>

              <!-- Results area -->
              <div class="psp-results-area">
                <!-- Loading -->
                <div v-if="tabMeta[tab.key]?.loading && tabMeta[tab.key]?.items.length === 0" class="psp-empty">
                  <a-spin tip="Searching..."></a-spin>
                </div>

                <!-- Empty -->
                <div
                  v-else-if="!tabMeta[tab.key]?.loading && tabMeta[tab.key]?.items.length === 0"
                  class="psp-empty"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" style="margin-bottom: 8px;">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <span>No products found<template v-if="query"> for "{{ query }}"</template></span>
                </div>

                <!-- Results list -->
                <template v-else>
                  <div
                    v-for="item in tabMeta[tab.key]?.items"
                    :key="item.id"
                    class="psp-result-item"
                    @click="selectProduct(item, tab.key)"
                  >
                    <!-- Thumbnail -->
                    <div class="psp-thumb">
                      <img
                        v-if="item._imageUrl"
                        :src="item._imageUrl"
                        :alt="item._name"
                      />
                      <span v-else class="psp-thumb-fallback">
                        {{ item._name?.charAt(0)?.toUpperCase() }}
                      </span>
                    </div>

                    <!-- Info -->
                    <div class="psp-result-info">
                      <div class="psp-result-name">
                        <span v-html="highlight(item._name)"></span>
                        <span class="psp-badge" :class="'psp-badge-' + tab.key.toLowerCase()">
                          {{ tab.label }}
                        </span>
                      </div>
                      <div class="psp-result-meta">
                        <span v-html="highlight(item._category)"></span>
                        <template v-if="item._type"> · <span v-html="highlight(item._type)"></span></template>
                      </div>
                      <div v-if="item._colors?.length" class="psp-colors">
                        <div
                          v-for="(color, ci) in item._colors.slice(0, 4)"
                          :key="ci"
                          class="psp-color-dot"
                          :style="{ background: color }"
                        ></div>
                        <span v-if="item._colors.length > 4" class="psp-color-more">+{{ item._colors.length - 4 }}</span>
                      </div>
                    </div>

                    <!-- Price -->
                    <div class="psp-result-price">${{ item._price }}</div>
                  </div>
                </template>

                <!-- Load more -->
                <div v-if="tabMeta[tab.key]?.hasNext" class="psp-load-more">
                  <a-button
                    block
                    type="default"
                    size="small"
                    :loading="tabMeta[tab.key]?.loadingMore"
                    @click="loadMore(tab.key)"
                  >
                    {{ tabMeta[tab.key]?.loadingMore ? 'Loading...' : 'Load more' }}
                  </a-button>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>

          <!-- Filter button row -->
          <div class="psp-filter-row">
            <button
              class="psp-filter-btn"
              :class="{ 'psp-filter-btn--active': hasActiveFilters(activeTab) }"
              @click="openFilterDrawer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M2.5 5H17.5M5.5 10H14.5M8.5 15H11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Filters
              <span v-if="activeFilterCount(activeTab) > 0" class="psp-filter-badge">
                {{ activeFilterCount(activeTab) }}
              </span>
            </button>
          </div>

          <!-- FILTER DRAWER (overlays the popup) -->
          <transition name="filter-pop">
            <div v-if="showFilterDrawer" class="psp-filter-drawer">

              <div class="psp-drawer-header">
                <span class="psp-drawer-title">Filters</span>
                <button class="psp-drawer-close" @click="showFilterDrawer = false">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M1 1L17 17M17 1L1 17" stroke="#333" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>

              <div class="psp-drawer-body">
                <div v-if="filterOptions[activeTab]?.loading" style="text-align:center;padding:40px 0">
                  <a-spin /><p style="margin-top:12px;color:#999;font-size:13px">Loading filters…</p>
                </div>

                <template v-else>

                  <!-- ── Furniture filters ── -->
                  <template v-if="activeTab === 'furniture'">

                    <!-- Room type -->
                    <div v-if="filterOptions.furniture.roomTypes.length > 0" class="psp-filter-group">
                      <div class="psp-filter-group-label">Room Type</div>
                      <div class="psp-filter-pills">
                        <button
                          v-for="room in filterOptions.furniture.roomTypes"
                          :key="room.id"
                          class="psp-filter-pill"
                          :class="{ active: draftFilters.furniture.selectedRoomTypes.includes(room.id) }"
                          @click="toggleDraftRoomType(room.id)"
                        >
                          {{ room.name }}
                          <!-- <span class="psp-pill-count">({{ room.product_count }})</span> -->
                        </button>
                      </div>
                    </div>

                    <!-- Category -->
                    <div v-if="filterOptions.furniture.categories.length > 0" class="psp-filter-group">
                      <div class="psp-filter-group-label">Category</div>
                      <div class="psp-filter-pills">
                        <button
                          v-for="cat in filterOptions.furniture.categories"
                          :key="cat.id"
                          class="psp-filter-pill"
                          :class="{ active: draftFilters.furniture.selectedCategories.includes(cat.id) }"
                          @click="toggleDraftCategory(cat.id)"
                        >
                          {{ cat.name }}
                          <!-- <span class="psp-pill-count">({{ cat.product_count }})</span> -->
                        </button>
                      </div>
                    </div>

                    <!-- Furniture type -->
                    <div v-if="filterOptions.furniture.furnitureTypes.length > 0" class="psp-filter-group">
                      <div class="psp-filter-group-label">Furniture Type</div>
                      <div class="psp-filter-pills">
                        <button
                          v-for="type in filterOptions.furniture.furnitureTypes"
                          :key="type.furniture_type"
                          class="psp-filter-pill"
                          :class="{ active: draftFilters.furniture.selectedFurnitureTypes.includes(type.furniture_type) }"
                          @click="toggleDraftFurnitureType(type.furniture_type)"
                        >
                          {{ type.furniture_type }}
                          <!-- <span class="psp-pill-count">({{ type.product_count }})</span> -->
                        </button>
                      </div>
                    </div>

                    <!-- Colors -->
                    <!-- <div v-if="filterOptions.furniture.colors.length > 0" class="psp-filter-group">
                      <div class="psp-filter-group-label">Color</div>
                      <div class="psp-filter-color-swatches">
                        <button
                          v-for="color in filterOptions.furniture.colors"
                          :key="color.color"
                          class="psp-color-swatch-btn"
                          :class="{ active: draftFilters.furniture.selectedColors.includes(color.color) }"
                          :title="color.color + ' (' + color.product_count + ')'"
                          @click="toggleDraftColor('furniture', color.color)"
                        >
                          <span
                            class="psp-swatch-circle"
                            :style="{
                              background: color.color,
                              border: (color.color === '#ffffff' || color.color === '#FFFFFF')
                                ? '1px solid #ddd' : '1px solid rgba(0,0,0,0.1)'
                            }"
                          >
                            <span v-if="draftFilters.furniture.selectedColors.includes(color.color)" class="psp-swatch-check">✓</span>
                          </span>
                        </button>
                      </div>
                    </div> -->
                  </template>

                  <!-- ── Wall filters ── -->
                  <template v-else-if="activeTab === 'wall'">

                    <!-- Room Type -->
                    <div v-if="filterOptions.wall.roomTypes.length > 0" class="psp-filter-group">
                      <div class="psp-filter-group-label">Room Type</div>
                      <div class="psp-filter-pills">
                        <button
                          v-for="room in filterOptions.wall.roomTypes"
                          :key="room.id"
                          class="psp-filter-pill"
                          :class="{ active: draftFilters.wall.selectedRoomTypes.includes(room.id) }"
                          @click="toggleDraftWallRoomType(room.id)"
                        >
                          {{ room.name }}
                          <!-- <span class="psp-pill-count">({{ room.product_count }})</span> -->
                        </button>
                      </div>
                    </div>

                    <!-- Style -->
                    <div class="psp-filter-group">
                      <div class="psp-filter-group-label">Style</div>
                      <div class="psp-filter-pills">
                        <button
                          v-for="style in wallStyleOptions"
                          :key="style.value"
                          class="psp-filter-pill"
                          :class="{ active: draftFilters.wall.styles[style.value] }"
                          @click="draftFilters.wall.styles[style.value] = !draftFilters.wall.styles[style.value]"
                        >
                          {{ style.label }}
                        </button>
                      </div>
                    </div>

                    <!-- Colors -->
                    <div class="psp-filter-group">
                      <div class="psp-filter-group-label">Color</div>
                      <div v-if="filterOptions.wall.loadingColors" style="text-align:center;padding:10px;">
                        <a-spin size="small" />
                      </div>
                      <!-- <div v-else class="psp-filter-color-swatches">
                        <button
                          v-for="color in filterOptions.wall.colors"
                          :key="color.color_hex"
                          class="psp-color-swatch-btn"
                          :class="{ active: draftFilters.wall.selectedColors.includes(color.color_hex) }"
                          :title="color.title"
                          @click="toggleDraftColor('wall', color.color_hex)"
                        >
                          <span
                            class="psp-swatch-circle"
                            :style="{
                              background: color.color_hex,
                              border: (color.color_hex === '#ffffff' || color.color_hex === '#FFFFFF')
                                ? '1px solid #ddd' : '1px solid rgba(0,0,0,0.1)'
                            }"
                          >
                            <span v-if="draftFilters.wall.selectedColors.includes(color.color_hex)" class="psp-swatch-check">✓</span>
                          </span>
                        </button>
                        <div v-if="filterOptions.wall.colors.length === 0" style="color:#999;font-size:12px;">
                          No colors available
                        </div>
                      </div> -->
                    </div>
                  </template>

                  <!-- ── Floor filters ── -->
                  <template v-else-if="activeTab === 'floor'">

                    <!-- Room Type -->
                    <div v-if="filterOptions.floor.roomTypes.length > 0" class="psp-filter-group">
                      <div class="psp-filter-group-label">Room Type</div>
                      <div class="psp-filter-pills">
                        <button
                          v-for="room in filterOptions.floor.roomTypes"
                          :key="room.id"
                          class="psp-filter-pill"
                          :class="{ active: draftFilters.floor.selectedRoomTypes.includes(room.id) }"
                          @click="toggleDraftFloorRoomType(room.id)"
                        >
                          {{ room.name }}
                          <!-- <span class="psp-pill-count">({{ room.product_count }})</span> -->
                        </button>
                      </div>
                    </div>

                    <!-- Style -->
                    <div class="psp-filter-group">
                      <div class="psp-filter-group-label">Style</div>
                      <div class="psp-filter-pills">
                        <button
                          v-for="style in floorStyleOptions"
                          :key="style.value"
                          class="psp-filter-pill"
                          :class="{ active: draftFilters.floor.styles[style.value] }"
                          @click="draftFilters.floor.styles[style.value] = !draftFilters.floor.styles[style.value]"
                        >
                          {{ style.label }}
                        </button>
                      </div>
                    </div>

                    <!-- Colors -->
                    <!-- <div class="psp-filter-group">
                      <div class="psp-filter-group-label">Color</div>
                      <div v-if="filterOptions.floor.loadingColors" style="text-align:center;padding:10px;">
                        <a-spin size="small" />
                      </div>
                      <div v-else class="psp-filter-color-swatches">
                        <button
                          v-for="color in filterOptions.floor.colors"
                          :key="color.color_hex"
                          class="psp-color-swatch-btn"
                          :class="{ active: draftFilters.floor.selectedColors.includes(color.color_hex) }"
                          :title="color.title"
                          @click="toggleDraftColor('floor', color.color_hex)"
                        >
                          <span
                            class="psp-swatch-circle"
                            :style="{
                              background: color.color_hex,
                              border: (color.color_hex === '#ffffff' || color.color_hex === '#FFFFFF')
                                ? '1px solid #ddd' : '1px solid rgba(0,0,0,0.1)'
                            }"
                          >
                            <span v-if="draftFilters.floor.selectedColors.includes(color.color_hex)" class="psp-swatch-check">✓</span>
                          </span>
                        </button>
                        <div v-if="filterOptions.floor.colors.length === 0" style="color:#999;font-size:12px;">
                          No colors available
                        </div>
                      </div>
                    </div> -->

                    <!-- Price Range -->
                    <div class="psp-filter-group">
                      <div class="psp-filter-group-label">Price Range (per sqm)</div>
                      <a-slider
                        :min="0"
                        :max="500000"
                        v-model:value="draftFilters.floor.priceRange"
                        range
                        :tip-formatter="(val) => '$' + val.toLocaleString()"
                      />
                      <p style="margin-top:6px;font-size:12px;color:#666;">
                        ${{ draftFilters.floor.priceRange[0].toLocaleString() }} – ${{ draftFilters.floor.priceRange[1].toLocaleString() }}
                      </p>
                    </div>

                  </template>

                  <!-- ── Lights filters ── -->
                  <template v-else-if="activeTab === 'lights'">

                    <!-- Room Type -->
                    <div v-if="filterOptions.lights.roomTypes.length > 0" class="psp-filter-group">
                      <div class="psp-filter-group-label">Room Type</div>
                      <div class="psp-filter-pills">
                        <button
                          v-for="room in filterOptions.lights.roomTypes"
                          :key="room.id"
                          class="psp-filter-pill"
                          :class="{ active: draftFilters.lights.selectedRoomTypes.includes(room.id) }"
                          @click="toggleDraftLightRoomType(room.id)"
                        >
                          {{ room.name }}
                          <!-- <span class="psp-pill-count">({{ room.product_count }})</span> -->
                        </button>
                      </div>
                    </div>

                    <!-- Category -->
                    <div v-if="filterOptions.lights.categories.length > 0" class="psp-filter-group">
                      <div class="psp-filter-group-label">Category</div>
                      <div class="psp-filter-pills">
                        <button
                          v-for="cat in filterOptions.lights.categories"
                          :key="cat.id"
                          class="psp-filter-pill"
                          :class="{ active: draftFilters.lights.selectedCategories.includes(cat.id) }"
                          @click="toggleDraftLightCategory(cat.id)"
                        >
                          {{ cat.name }}
                          <!-- <span class="psp-pill-count">({{ cat.product_count }})</span> -->
                        </button>
                      </div>
                    </div>

                    <!-- Light Type -->
                    <div v-if="filterOptions.lights.lightTypes.length > 0" class="psp-filter-group">
                      <div class="psp-filter-group-label">Light Type</div>
                      <div class="psp-filter-pills">
                        <button
                          v-for="type in filterOptions.lights.lightTypes"
                          :key="type.furniture_type"
                          class="psp-filter-pill"
                          :class="{ active: draftFilters.lights.selectedLightTypes.includes(type.furniture_type) }"
                          @click="toggleDraftLightType(type.furniture_type)"
                        >
                          {{ type.furniture_type }}
                          <!-- <span class="psp-pill-count">({{ type.product_count }})</span> -->
                        </button>
                      </div>
                    </div>

                    <!-- No filters available yet -->
                    <div
                      v-if="!filterOptions.lights.loading &&
                            filterOptions.lights.roomTypes.length === 0 &&
                            filterOptions.lights.categories.length === 0 &&
                            filterOptions.lights.lightTypes.length === 0"
                      style="color:#999;font-size:13px;text-align:center;padding:20px 0"
                    >
                      No filter options available
                    </div>

                  </template>

                </template>
              </div>

              <div class="psp-drawer-footer">
                <button class="psp-btn-reset" @click="resetDraftFilters">Reset</button>
                <button class="psp-btn-apply" @click="applyFilters">Apply</button>
              </div>
            </div>
          </transition>

          <!-- Footer hint -->
          <div class="psp-footer">
            Press <kbd>Esc</kbd> to close &nbsp;·&nbsp; Click a product to view details
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: 'ProductSearchPopup',

  props: {
    rootMediaApi: { type: String, default: '' },
    brand:        { type: String, default: null },
  },

  emits: ['select'],

  data() {
    return {
      isOpen:           false,
      query:            '',
      activeTab:        'furniture',
      showFilterDrawer: false,
      searchTimeout:    null,

      tabs: [
        { key: 'furniture', label: 'Furniture' },
        { key: 'wall',      label: 'Wall'      },
        { key: 'floor',     label: 'Floor'     },
        { key: 'lights',    label: 'Lights'    },
      ],

      wallStyleOptions: [
        { label: 'Modern',       value: 'modern'       },
        { label: 'Scandinavian', value: 'scandinavian' },
        { label: 'Classic',      value: 'classic'      },
        { label: 'Minimalist',   value: 'minimalist'   },
        { label: 'Industrial',   value: 'industrial'   },
        { label: 'Rustic',       value: 'rustic'       },
        { label: 'Boho',         value: 'boho'         },
        { label: 'Other',        value: 'other'        },
      ],

      floorStyleOptions: [
        { label: 'Modern',       value: 'modern'       },
        { label: 'Scandinavian', value: 'scandinavian' },
        { label: 'Classic',      value: 'classic'      },
        { label: 'Minimalist',   value: 'minimalist'   },
        { label: 'Industrial',   value: 'industrial'   },
        { label: 'Rustic',       value: 'rustic'       },
        { label: 'Boho',         value: 'boho'         },
        { label: 'Other',        value: 'other'        },
      ],

      tabMeta: {
        furniture: { items: [], total: 0, page: 1, hasNext: false, loading: false, loadingMore: false },
        wall:      { items: [], total: 0, page: 1, hasNext: false, loading: false, loadingMore: false },
        floor:     { items: [], total: 0, page: 1, hasNext: false, loading: false, loadingMore: false },
        lights:    { items: [], total: 0, page: 1, hasNext: false, loading: false, loadingMore: false },
      },

      filterOptions: {
        furniture: { loading: false, loaded: false, roomTypes: [], categories: [], furnitureTypes: [], colors: [] },
        wall:      { loading: false, loaded: false, loadingColors: false, roomTypes: [], colors: [] },
        floor:     { loading: false, loaded: false, loadingColors: false, roomTypes: [], colors: [] },
        // ── ADDED: expanded lights filter options ──
        lights:    { loading: false, loaded: false, roomTypes: [], categories: [], lightTypes: [] },
      },

      draftFilters: {
        furniture: {
          selectedRoomTypes: [], selectedCategories: [], selectedFurnitureTypes: [], selectedColors: [],
        },
        wall: {
          selectedRoomTypes: [],
          selectedColors: [],
          styles: {
            modern: false, scandinavian: false, classic: false, minimalist: false,
            industrial: false, rustic: false, boho: false, other: false,
          },
        },
        floor: {
          priceRange:        [0, 500000],
          selectedColors:    [],
          selectedRoomTypes: [],
          styles: {
            modern: false, scandinavian: false, classic: false, minimalist: false,
            industrial: false, rustic: false, boho: false, other: false,
          },
        },
        // ── ADDED: lights draft filters ──
        lights: {
          selectedRoomTypes:  [],
          selectedCategories: [],
          selectedLightTypes: [],
        },
      },

      appliedFilters: {
        furniture: {
          selectedRoomTypes: [], selectedCategories: [], selectedFurnitureTypes: [], selectedColors: [],
        },
        wall: {
          selectedRoomTypes: [],
          selectedColors: [],
          styles: {
            modern: false, scandinavian: false, classic: false, minimalist: false,
            industrial: false, rustic: false, boho: false, other: false,
          },
        },
        floor: {
          priceRange:        [0, 500000],
          selectedColors:    [],
          selectedRoomTypes: [],
          styles: {
            modern: false, scandinavian: false, classic: false, minimalist: false,
            industrial: false, rustic: false, boho: false, other: false,
          },
        },
        // ── ADDED: lights applied filters ──
        lights: {
          selectedRoomTypes:  [],
          selectedCategories: [],
          selectedLightTypes: [],
        },
      },
    };
  },

  methods: {
    // ─── Open / close ──────────────────────────────────────────────────────────
    openPopup() {
      this.isOpen = true;
      this.$nextTick(() => this.$refs.searchInputRef?.focus());
      this.fetchTab(this.activeTab, 1);
      this.loadFilterOptions(this.activeTab);
    },

    closePopup() {
      this.isOpen           = false;
      this.query            = '';
      this.showFilterDrawer = false;
      this.activeTab        = 'furniture';
      Object.keys(this.tabMeta).forEach(tab => {
        this.tabMeta[tab].items   = [];
        this.tabMeta[tab].page    = 1;
        this.tabMeta[tab].hasNext = false;
      });
    },

    // ─── Tab change ────────────────────────────────────────────────────────────
    onTabChange(tab) {
      this.showFilterDrawer = false;
      if (this.tabMeta[tab].items.length === 0) {
        this.fetchTab(tab, 1);
      }
      this.loadFilterOptions(tab);
    },

    // ─── Search debounce ───────────────────────────────────────────────────────
    onSearchInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchTab(this.activeTab, 1);
      }, 500);
    },

    // ─── Master fetch dispatcher ───────────────────────────────────────────────
    async fetchTab(tab, page = 1, isLoadMore = false) {
      const meta = this.tabMeta[tab];

      if (page === 1 && !isLoadMore) {
        meta.loading = true;
        meta.items   = [];
        meta.page    = 1;
      } else {
        meta.loadingMore = true;
      }

      try {
        let rawItems   = [];
        let pagination = { has_next: false, total_count: 0 };

        if      (tab === 'furniture') ({ rawItems, pagination } = await this.fetchFurniture(page));
        else if (tab === 'wall')      ({ rawItems, pagination } = await this.fetchWall(page));
        else if (tab === 'floor')     ({ rawItems, pagination } = await this.fetchFloor(page));
        else if (tab === 'lights')    ({ rawItems, pagination } = await this.fetchLights(page));

        const normalized = rawItems.map(item => this.normalizeItem(item, tab));

        meta.items   = isLoadMore ? [...meta.items, ...normalized] : normalized;
        meta.hasNext = pagination.has_next;
        meta.total   = pagination.total_count;
        meta.page    = page;

      } catch (err) {
        console.error(`[ProductSearchPopup] fetchTab(${tab}) failed`, err);
      } finally {
        meta.loading     = false;
        meta.loadingMore = false;
      }
    },

    loadMore(tab) {
      this.fetchTab(tab, this.tabMeta[tab].page + 1, true);
    },

    // ─── Per-tab fetchers ──────────────────────────────────────────────────────

    async fetchFurniture(page) {
      const f     = this.appliedFilters.furniture;
      const api   = this.$store.state.root_api;
      const brand = this.brand || this.$route?.query?.brand;

      let url = brand
        ? `${api}product/api/load-brand-products/3d-products/${brand}`
        : `${api}product/api/3d-products/`;

      const sep = url.includes('?') ? '&' : '?';
      url += `${sep}page=${page}&page_size=20`;

      if (this.query) url += `&search=${encodeURIComponent(this.query)}`;
      if (f.selectedCategories.length > 0) {
        const names = f.selectedCategories.map(id => {
          const cat = this.filterOptions.furniture.categories.find(c => c.id === id);
          return cat ? cat.name : id;
        });
        url += `&category=${encodeURIComponent(names.join(','))}`;
      }
      if (f.selectedFurnitureTypes.length > 0)
        url += `&furniture_type=${encodeURIComponent(f.selectedFurnitureTypes.join(','))}`;
      if (f.selectedColors.length > 0)
        url += `&color_hex=${encodeURIComponent(f.selectedColors.join(','))}`;
      if (f.selectedRoomTypes.length > 0)
        url += `&room_type=${encodeURIComponent(f.selectedRoomTypes.join(','))}`;

      const res  = await fetch(url, { headers: { Authorization: `Token ${localStorage.getItem('token')}` } });
      const data = await res.json();
      return { rawItems: data.data || [], pagination: data.pagination || {} };
    },

    async fetchWall(page) {
      const f     = this.appliedFilters.wall;
      const api   = this.$store.state.root_api;
      const brand = this.brand || this.$route?.query?.brand;

      let url = brand
        ? `${api}room/api/load-brand-products/walls/${brand}`
        : `${api}room/api/walls/`;

      const sep = url.includes('?') ? '&' : '?';
      url += `${sep}page=${page}&page_size=20`;

      if (this.query) url += `&search=${encodeURIComponent(this.query)}`;

      if (f.selectedColors.length > 0)
        url += `&color_hex=${encodeURIComponent(f.selectedColors.join(','))}`;

      if (f.selectedRoomTypes.length > 0)
        url += `&room_type=${encodeURIComponent(f.selectedRoomTypes.join(','))}`;

      const selectedStyles = this.wallStyleOptions
        .filter(s => f.styles[s.value])
        .map(s => s.label);
      if (selectedStyles.length > 0)
        url += `&texture_style=${encodeURIComponent(selectedStyles.join(','))}`;

      const res  = await fetch(url, { headers: { Authorization: `Token ${localStorage.getItem('token')}` } });
      const data = await res.json();
      return { rawItems: data.data || [], pagination: data.pagination || {} };
    },

    async fetchFloor(page) {
      const f     = this.appliedFilters.floor;
      const api   = this.$store.state.root_api;
      const brand = this.brand || this.$route?.query?.brand;

      let url = brand
        ? `${api}room/api/load-brand-products/floors/${brand}`
        : `${api}room/api/floors/`;

      const sep = url.includes('?') ? '&' : '?';
      url += `${sep}page=${page}&page_size=20`;

      if (this.query) url += `&search=${encodeURIComponent(this.query)}`;

      url += `&price_per_sqm_min=${f.priceRange[0]}&price_per_sqm_max=${f.priceRange[1]}`;

      if (f.selectedColors.length > 0)
        url += `&color_hex=${encodeURIComponent(f.selectedColors.join(','))}`;

      if (f.selectedRoomTypes.length > 0)
        url += `&room_type=${encodeURIComponent(f.selectedRoomTypes.join(','))}`;

      const selectedStyles = this.floorStyleOptions
        .filter(s => f.styles[s.value])
        .map(s => s.label);
      if (selectedStyles.length > 0)
        url += `&texture_style=${encodeURIComponent(selectedStyles.join(','))}`;

      const res  = await fetch(url, { headers: { Authorization: `Token ${localStorage.getItem('token')}` } });
      const data = await res.json();
      return { rawItems: data.data || [], pagination: data.pagination || {} };
    },

    // ── ADDED: full lights fetcher with filter params (mirrors AiCatalog's fetchLights) ──
    async fetchLights(page) {
      const f     = this.appliedFilters.lights;
      const api   = this.$store.state.root_api;
      const brand = this.brand || this.$route?.query?.brand;

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('page_size', 20);

      if (this.query)                      params.append('search',        this.query);
      if (f.selectedCategories.length > 0) params.append('category_id',   f.selectedCategories.join(','));
      if (f.selectedLightTypes.length > 0) params.append('furniture_type', f.selectedLightTypes.join(','));
      if (f.selectedRoomTypes.length > 0)  params.append('room_type',      f.selectedRoomTypes.join(','));

      const url = brand
        ? `${api}product/api/load-brand-products/lights/${brand}/?${params.toString()}`
        : `${api}product/api/lights/?${params.toString()}`;

      const res  = await fetch(url, { headers: { Authorization: `Token ${localStorage.getItem('token')}` } });
      const data = await res.json();
      return { rawItems: data.data || [], pagination: data.pagination || {} };
    },

    // ─── Normalize raw API items ───────────────────────────────────────────────
    normalizeItem(raw, tab) {
      const api = this.rootMediaApi || this.$store.state.root_media_api || '';

      if (tab === 'furniture' || tab === 'lights') {
        return {
          id:        raw.id,
          _raw:      raw,
          _name:     raw.name || 'Untitled',
          _category: raw.category?.name || '',
          _type:     raw.furniture_type || raw.light_type || '',
          _price:    raw.pricing?.price ?? 0,
          _colors:   (raw.colors_available || []).map(c => c.color),
          _imageUrl: raw.primary_image ? api + raw.primary_image : '',
        };
      }

      if (tab === 'wall' || tab === 'floor') {
        const img = raw.product_images?.length ? raw.product_images[0].image : raw.texture_image;
        return {
          id:        raw.id,
          _raw:      raw,
          _name:     raw.title || 'Untitled',
          _category: tab === 'wall' ? 'Wall' : 'Floor',
          _type:     raw.texture_style || '',
          _price:    raw.sale_price_per_sqm ?? 0,
          _colors:   (raw.colors_available || []).map(c => c.color_hex),
          _imageUrl: img ? api + img : '',
        };
      }

      return { id: raw.id, _raw: raw, _name: 'Unknown', _category: '', _type: '', _price: 0, _colors: [], _imageUrl: '' };
    },

    // ─── Filter options loader ─────────────────────────────────────────────────
    async loadFilterOptions(tab) {
      const fo = this.filterOptions[tab];
      if (!fo || fo.loaded || fo.loading) return;

      fo.loading = true;
      try {
        if (tab === 'furniture') {
          const url  = `${this.$store.state.root_api}product/api/filter-options/`;
          const res  = await fetch(url, { headers: { Authorization: `Token ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } });
          const data = await res.json();
          if (data.success) {
            fo.colors         = data.data.colors          || [];
            fo.categories     = data.data.categories      || [];
            fo.furnitureTypes = data.data.furniture_types || [];
            fo.roomTypes      = data.data.room_types      || [];
          }
        }

        else if (tab === 'wall') {
          fo.loadingColors = true;
          const brand = this.brand || this.$route?.query?.brand;
          const url   = brand
            ? `${this.$store.state.root_api}room/api/walls/colors/?brand=${brand}`
            : `${this.$store.state.root_api}room/api/walls/colors/`;

          const res  = await fetch(url, { headers: { Authorization: `Token ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } });
          const data = await res.json();
          if (data.success) {
            fo.colors    = data.data.map(c => ({ id: c.color_hex, title: c.title, color_hex: c.color_hex }));
            fo.roomTypes = data.room_types || [];
          }
          fo.loadingColors = false;
        }

        else if (tab === 'floor') {
          fo.loadingColors = true;
          const brand = this.brand || this.$route?.query?.brand;
          const url   = brand
            ? `${this.$store.state.root_api}room/api/floors/colors/?brand=${brand}`
            : `${this.$store.state.root_api}room/api/floors/colors/`;

          const res  = await fetch(url, { headers: { Authorization: `Token ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } });
          const data = await res.json();
          if (data.success) {
            fo.colors    = data.data.map(c => ({ id: c.color_hex, title: c.title, color_hex: c.color_hex }));
            fo.roomTypes = data.room_types || [];
          }
          fo.loadingColors = false;
        }

        // ── ADDED: lights filter options (mirrors AiCatalog's loadFilterOptions) ──
        else if (tab === 'lights') {
          const url  = `${this.$store.state.root_api}product/api/lights/filter-options/`;
          const res  = await fetch(url, { headers: { Authorization: `Token ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } });
          const data = await res.json();
          if (data.success) {
            fo.categories = data.data.categories      || [];
            fo.lightTypes = data.data.furniture_types || [];
            fo.roomTypes  = data.data.room_types      || [];
          }
        }

        fo.loaded = true;
      } catch (err) {
        console.error(`[ProductSearchPopup] loadFilterOptions(${tab}) failed`, err);
        if (tab === 'wall')  this.filterOptions.wall.loadingColors  = false;
        if (tab === 'floor') this.filterOptions.floor.loadingColors = false;
      } finally {
        fo.loading = false;
      }
    },

    // ─── Filter drawer open / apply / reset ───────────────────────────────────
    async openFilterDrawer() {
      const applied = this.appliedFilters[this.activeTab];
      const draft   = this.draftFilters[this.activeTab];

      await this.loadFilterOptions(this.activeTab);

      if (this.activeTab === 'furniture') {
        draft.selectedRoomTypes      = [...applied.selectedRoomTypes];
        draft.selectedCategories     = [...applied.selectedCategories];
        draft.selectedFurnitureTypes = [...applied.selectedFurnitureTypes];
        draft.selectedColors         = [...applied.selectedColors];
      } else if (this.activeTab === 'wall') {
        draft.selectedRoomTypes = [...applied.selectedRoomTypes];
        draft.selectedColors    = [...applied.selectedColors];
        draft.styles            = { ...applied.styles };
      } else if (this.activeTab === 'floor') {
        draft.priceRange        = [...applied.priceRange];
        draft.selectedRoomTypes = [...applied.selectedRoomTypes];
        draft.selectedColors    = [...applied.selectedColors];
        draft.styles            = { ...applied.styles };
      }
      // ── ADDED: sync lights draft from applied ──
      else if (this.activeTab === 'lights') {
        draft.selectedRoomTypes  = [...applied.selectedRoomTypes];
        draft.selectedCategories = [...applied.selectedCategories];
        draft.selectedLightTypes = [...applied.selectedLightTypes];
      }

      this.showFilterDrawer = true;
    },

    applyFilters() {
      const draft   = this.draftFilters[this.activeTab];
      const applied = this.appliedFilters[this.activeTab];

      if (this.activeTab === 'furniture') {
        applied.selectedRoomTypes      = [...draft.selectedRoomTypes];
        applied.selectedCategories     = [...draft.selectedCategories];
        applied.selectedFurnitureTypes = [...draft.selectedFurnitureTypes];
        applied.selectedColors         = [...draft.selectedColors];
      } else if (this.activeTab === 'wall') {
        applied.selectedRoomTypes = [...draft.selectedRoomTypes];
        applied.selectedColors    = [...draft.selectedColors];
        applied.styles            = { ...draft.styles };
      } else if (this.activeTab === 'floor') {
        applied.priceRange        = [...draft.priceRange];
        applied.selectedRoomTypes = [...draft.selectedRoomTypes];
        applied.selectedColors    = [...draft.selectedColors];
        applied.styles            = { ...draft.styles };
      }
      // ── ADDED: copy lights draft → applied ──
      else if (this.activeTab === 'lights') {
        applied.selectedRoomTypes  = [...draft.selectedRoomTypes];
        applied.selectedCategories = [...draft.selectedCategories];
        applied.selectedLightTypes = [...draft.selectedLightTypes];
      }

      this.showFilterDrawer = false;
      this.fetchTab(this.activeTab, 1);
    },

    resetDraftFilters() {
      if (this.activeTab === 'furniture') {
        this.draftFilters.furniture = {
          selectedRoomTypes: [], selectedCategories: [], selectedFurnitureTypes: [], selectedColors: [],
        };
      } else if (this.activeTab === 'wall') {
        this.draftFilters.wall = {
          selectedRoomTypes: [],
          selectedColors: [],
          styles: { modern: false, scandinavian: false, classic: false, minimalist: false, industrial: false, rustic: false, boho: false, other: false },
        };
      } else if (this.activeTab === 'floor') {
        this.draftFilters.floor = {
          priceRange:        [0, 500000],
          selectedColors:    [],
          selectedRoomTypes: [],
          styles: { modern: false, scandinavian: false, classic: false, minimalist: false, industrial: false, rustic: false, boho: false, other: false },
        };
      }
      // ── ADDED: reset lights draft ──
      else if (this.activeTab === 'lights') {
        this.draftFilters.lights = {
          selectedRoomTypes:  [],
          selectedCategories: [],
          selectedLightTypes: [],
        };
      }
    },

    clearAllFilters(tab) {
      if (tab === 'furniture') {
        const empty = { selectedRoomTypes: [], selectedCategories: [], selectedFurnitureTypes: [], selectedColors: [] };
        this.appliedFilters.furniture = { ...empty };
        this.draftFilters.furniture   = { ...empty };
      } else if (tab === 'wall') {
        const empty = {
          selectedRoomTypes: [],
          selectedColors: [],
          styles: { modern: false, scandinavian: false, classic: false, minimalist: false, industrial: false, rustic: false, boho: false, other: false },
        };
        this.appliedFilters.wall = { ...empty, styles: { ...empty.styles } };
        this.draftFilters.wall   = { ...empty, styles: { ...empty.styles } };
      } else if (tab === 'floor') {
        const empty = {
          priceRange:        [0, 500000],
          selectedColors:    [],
          selectedRoomTypes: [],
          styles: { modern: false, scandinavian: false, classic: false, minimalist: false, industrial: false, rustic: false, boho: false, other: false },
        };
        this.appliedFilters.floor = { ...empty, styles: { ...empty.styles } };
        this.draftFilters.floor   = { ...empty, styles: { ...empty.styles } };
      }
      // ── ADDED: clear lights filters ──
      else if (tab === 'lights') {
        const empty = { selectedRoomTypes: [], selectedCategories: [], selectedLightTypes: [] };
        this.appliedFilters.lights = { ...empty };
        this.draftFilters.lights   = { ...empty };
      }
      this.fetchTab(tab, 1);
    },

    removeFilter(tab, filterKey) {
      if (tab === 'furniture') {
        this.appliedFilters.furniture[filterKey] = [];
        this.draftFilters.furniture[filterKey]   = [];
      } else if (tab === 'wall') {
        if (filterKey === 'styles') {
          const reset = { modern: false, scandinavian: false, classic: false, minimalist: false, industrial: false, rustic: false, boho: false, other: false };
          this.appliedFilters.wall.styles = { ...reset };
          this.draftFilters.wall.styles   = { ...reset };
        } else {
          this.appliedFilters.wall[filterKey] = [];
          this.draftFilters.wall[filterKey]   = [];
        }
      } else if (tab === 'floor') {
        if (filterKey === 'styles') {
          const reset = { modern: false, scandinavian: false, classic: false, minimalist: false, industrial: false, rustic: false, boho: false, other: false };
          this.appliedFilters.floor.styles = { ...reset };
          this.draftFilters.floor.styles   = { ...reset };
        } else if (filterKey === 'priceRange') {
          this.appliedFilters.floor.priceRange = [0, 500000];
          this.draftFilters.floor.priceRange   = [0, 500000];
        } else {
          this.appliedFilters.floor[filterKey] = [];
          this.draftFilters.floor[filterKey]   = [];
        }
      }
      // ── ADDED: remove individual lights filter ──
      else if (tab === 'lights') {
        this.appliedFilters.lights[filterKey] = [];
        this.draftFilters.lights[filterKey]   = [];
      }
      this.fetchTab(tab, 1);
    },

    // ─── Active filter chip helpers ────────────────────────────────────────────
    hasActiveFilters(tab) {
      if (tab === 'furniture') {
        const f = this.appliedFilters.furniture;
        return !!(f.selectedRoomTypes.length || f.selectedCategories.length || f.selectedFurnitureTypes.length || f.selectedColors.length);
      }
      if (tab === 'wall') {
        const f = this.appliedFilters.wall;
        return !!(f.selectedRoomTypes.length || f.selectedColors.length || Object.values(f.styles).some(Boolean));
      }
      if (tab === 'floor') {
        const f = this.appliedFilters.floor;
        const priceChanged = f.priceRange[0] > 0 || f.priceRange[1] < 500000;
        return !!(priceChanged || f.selectedRoomTypes.length || f.selectedColors.length || Object.values(f.styles).some(Boolean));
      }
      // ── ADDED: lights active filter check ──
      if (tab === 'lights') {
        const f = this.appliedFilters.lights;
        return !!(f.selectedRoomTypes.length || f.selectedCategories.length || f.selectedLightTypes.length);
      }
      return false;
    },

    activeFilterCount(tab) {
      if (tab === 'furniture') {
        const f = this.appliedFilters.furniture;
        return [f.selectedRoomTypes, f.selectedCategories, f.selectedFurnitureTypes, f.selectedColors].filter(a => a.length > 0).length;
      }
      if (tab === 'wall') {
        const f = this.appliedFilters.wall;
        let count = 0;
        if (f.selectedRoomTypes.length)            count++;
        if (f.selectedColors.length)               count++;
        if (Object.values(f.styles).some(Boolean)) count++;
        return count;
      }
      if (tab === 'floor') {
        const f = this.appliedFilters.floor;
        let count = 0;
        if (f.priceRange[0] > 0 || f.priceRange[1] < 500000) count++;
        if (f.selectedRoomTypes.length)                       count++;
        if (f.selectedColors.length)                          count++;
        if (Object.values(f.styles).some(Boolean))            count++;
        return count;
      }
      // ── ADDED: lights active filter count ──
      if (tab === 'lights') {
        const f = this.appliedFilters.lights;
        let count = 0;
        if (f.selectedRoomTypes.length)  count++;
        if (f.selectedCategories.length) count++;
        if (f.selectedLightTypes.length) count++;
        return count;
      }
      return 0;
    },

    activeFilterChips(tab) {
      const chips = [];
      if (tab === 'furniture') {
        const f = this.appliedFilters.furniture;
        if (f.selectedRoomTypes.length)      chips.push({ key: 'selectedRoomTypes',     label: `Room: ${f.selectedRoomTypes.length} selected` });
        if (f.selectedCategories.length)     chips.push({ key: 'selectedCategories',    label: `Category: ${f.selectedCategories.length} selected` });
        if (f.selectedFurnitureTypes.length) chips.push({ key: 'selectedFurnitureTypes',label: `Type: ${f.selectedFurnitureTypes.length} selected` });
        if (f.selectedColors.length)         chips.push({ key: 'selectedColors',        label: `Colors: ${f.selectedColors.length} selected` });
      } else if (tab === 'wall') {
        const f = this.appliedFilters.wall;
        if (f.selectedRoomTypes.length)            chips.push({ key: 'selectedRoomTypes', label: `Room: ${f.selectedRoomTypes.length} selected` });
        if (f.selectedColors.length)               chips.push({ key: 'selectedColors',    label: `Colors: ${f.selectedColors.length} selected` });
        if (Object.values(f.styles).some(Boolean)) chips.push({ key: 'styles',            label: `Style: ${Object.values(f.styles).filter(Boolean).length} selected` });
      } else if (tab === 'floor') {
        const f = this.appliedFilters.floor;
        if (f.priceRange[0] > 0 || f.priceRange[1] < 500000)
          chips.push({ key: 'priceRange',        label: `Price: $${f.priceRange[0].toLocaleString()} – $${f.priceRange[1].toLocaleString()}` });
        if (f.selectedRoomTypes.length)
          chips.push({ key: 'selectedRoomTypes', label: `Room: ${f.selectedRoomTypes.length} selected` });
        if (f.selectedColors.length)
          chips.push({ key: 'selectedColors',    label: `Colors: ${f.selectedColors.length} selected` });
        if (Object.values(f.styles).some(Boolean))
          chips.push({ key: 'styles',            label: `Style: ${Object.values(f.styles).filter(Boolean).length} selected` });
      }
      // ── ADDED: lights active filter chips ──
      else if (tab === 'lights') {
        const f = this.appliedFilters.lights;
        if (f.selectedRoomTypes.length)
          chips.push({ key: 'selectedRoomTypes',  label: `Room: ${f.selectedRoomTypes.length} selected` });
        if (f.selectedCategories.length)
          chips.push({ key: 'selectedCategories', label: `Category: ${f.selectedCategories.length} selected` });
        if (f.selectedLightTypes.length)
          chips.push({ key: 'selectedLightTypes', label: `Type: ${f.selectedLightTypes.length} selected` });
      }
      return chips;
    },

    // ─── Draft filter toggles ─────────────────────────────────────────────────
    toggleDraftRoomType(roomTypeId) {
      const draft      = this.draftFilters.furniture;
      const cats       = this.filterOptions.furniture.categories;
      const idx        = draft.selectedRoomTypes.indexOf(roomTypeId);
      const roomCatIds = cats.filter(c => c.room_type_id === roomTypeId).map(c => c.id);

      if (idx > -1) {
        draft.selectedRoomTypes.splice(idx, 1);
        draft.selectedCategories = draft.selectedCategories.filter(id => !roomCatIds.includes(id));
      } else {
        draft.selectedRoomTypes.push(roomTypeId);
        roomCatIds.forEach(id => { if (!draft.selectedCategories.includes(id)) draft.selectedCategories.push(id); });
      }
    },

    toggleDraftCategory(categoryId) {
      const draft = this.draftFilters.furniture;
      const cats  = this.filterOptions.furniture.categories;
      const idx   = draft.selectedCategories.indexOf(categoryId);

      if (idx > -1) {
        draft.selectedCategories.splice(idx, 1);
        const cat = cats.find(c => c.id === categoryId);
        if (cat?.room_type_id) {
          const siblingsSelected = cats.filter(c => c.room_type_id === cat.room_type_id && draft.selectedCategories.includes(c.id));
          if (siblingsSelected.length === 0)
            draft.selectedRoomTypes = draft.selectedRoomTypes.filter(id => id !== cat.room_type_id);
        }
      } else {
        draft.selectedCategories.push(categoryId);
        const cat = cats.find(c => c.id === categoryId);
        if (cat?.room_type_id) {
          const allSiblingIds = cats.filter(c => c.room_type_id === cat.room_type_id).map(c => c.id);
          const allSelected   = allSiblingIds.every(id => draft.selectedCategories.includes(id));
          if (allSelected && !draft.selectedRoomTypes.includes(cat.room_type_id))
            draft.selectedRoomTypes.push(cat.room_type_id);
        }
      }
    },

    toggleDraftFurnitureType(typeValue) {
      const arr = this.draftFilters.furniture.selectedFurnitureTypes;
      const idx = arr.indexOf(typeValue);
      if (idx > -1) arr.splice(idx, 1); else arr.push(typeValue);
    },

    toggleDraftWallRoomType(roomTypeId) {
      const arr = this.draftFilters.wall.selectedRoomTypes;
      const idx = arr.indexOf(roomTypeId);
      if (idx > -1) arr.splice(idx, 1); else arr.push(roomTypeId);
    },

    toggleDraftFloorRoomType(roomTypeId) {
      const arr = this.draftFilters.floor.selectedRoomTypes;
      const idx = arr.indexOf(roomTypeId);
      if (idx > -1) arr.splice(idx, 1); else arr.push(roomTypeId);
    },

    // ── ADDED: lights-specific draft toggles (with category↔roomType sync) ──
    toggleDraftLightRoomType(roomTypeId) {
      const draft      = this.draftFilters.lights;
      const cats       = this.filterOptions.lights.categories;
      const idx        = draft.selectedRoomTypes.indexOf(roomTypeId);
      const roomCatIds = cats.filter(c => c.room_type_id === roomTypeId).map(c => c.id);

      if (idx > -1) {
        draft.selectedRoomTypes.splice(idx, 1);
        draft.selectedCategories = draft.selectedCategories.filter(id => !roomCatIds.includes(id));
      } else {
        draft.selectedRoomTypes.push(roomTypeId);
        roomCatIds.forEach(id => { if (!draft.selectedCategories.includes(id)) draft.selectedCategories.push(id); });
      }
    },

    toggleDraftLightCategory(categoryId) {
      const draft = this.draftFilters.lights;
      const cats  = this.filterOptions.lights.categories;
      const idx   = draft.selectedCategories.indexOf(categoryId);

      if (idx > -1) {
        draft.selectedCategories.splice(idx, 1);
        const cat = cats.find(c => c.id === categoryId);
        if (cat?.room_type_id) {
          const siblingsSelected = cats.filter(c => c.room_type_id === cat.room_type_id && draft.selectedCategories.includes(c.id));
          if (siblingsSelected.length === 0)
            draft.selectedRoomTypes = draft.selectedRoomTypes.filter(id => id !== cat.room_type_id);
        }
      } else {
        draft.selectedCategories.push(categoryId);
        const cat = cats.find(c => c.id === categoryId);
        if (cat?.room_type_id) {
          const allSiblingIds = cats.filter(c => c.room_type_id === cat.room_type_id).map(c => c.id);
          const allSelected   = allSiblingIds.every(id => draft.selectedCategories.includes(id));
          if (allSelected && !draft.selectedRoomTypes.includes(cat.room_type_id))
            draft.selectedRoomTypes.push(cat.room_type_id);
        }
      }
    },

    toggleDraftLightType(typeValue) {
      const arr = this.draftFilters.lights.selectedLightTypes;
      const idx = arr.indexOf(typeValue);
      if (idx > -1) arr.splice(idx, 1); else arr.push(typeValue);
    },

    toggleDraftColor(tab, hexCode) {
      const arr = this.draftFilters[tab].selectedColors;
      const idx = arr.indexOf(hexCode);
      if (idx > -1) arr.splice(idx, 1); else arr.push(hexCode);
    },

    // ─── Select product ────────────────────────────────────────────────────────
    selectProduct(item, tab) {
      this.$emit('select', item._raw, tab);
      this.closePopup();
    },

    // ─── Highlight matched text ────────────────────────────────────────────────
    highlight(text) {
      if (!text) return '';
      const q = this.query.trim();
      if (!q) return this.escapeHtml(text);
      const escaped  = this.escapeHtml(text);
      const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return escaped.replace(new RegExp(`(${escapedQ})`, 'gi'), '<mark class="psp-hl">$1</mark>');
    },

    escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },

    handleKeydown(e) {
      if (e.key === 'Escape') this.closePopup();
    },
  },

  mounted() {
    document.addEventListener('keydown', this.handleKeydown);
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
  },
};
</script>

<style scoped>
/* ── Trigger ── */
.search-trigger {
  display: flex; align-items: center; gap: 8px; padding: 6px 12px;
  border: 1px solid #D1D5DB; border-radius: 6px; background: white;
  cursor: pointer; width: 100%; font-size: 13px; color: #9CA3AF;
  transition: border-color 0.15s; font-family: var(--font-family-main, 'Poppins', sans-serif);
}
.search-trigger:hover { border-color: #3B63FB; }
.trigger-text { flex: 1; }

/* ── Overlay ── */
.psp-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: flex-start; justify-content: center;
  padding-top: 72px; z-index: 9999;
}

/* ── Popup ── */
.psp-popup {
  background: white; border-radius: 12px; border: 1px solid #E5E7EB;
  width: 560px; max-width: 95vw; overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  font-family: var(--font-family-main, 'Poppins', sans-serif);
  position: relative;
}

/* ── Search bar ── */
.psp-search-bar {
  display: flex; align-items: center; gap: 10px; padding: 14px 16px;
  border-bottom: 1px solid #F3F4F6;
}
.psp-search-bar input {
  flex: 1; border: none; outline: none; font-size: 14px;
  background: transparent; color: #111827; font-family: inherit;
}
.psp-search-bar input::placeholder { color: #9CA3AF; }
.psp-close-btn {
  width: 28px; height: 28px; border-radius: 50%; border: 1px solid #E5E7EB;
  background: none; cursor: pointer; display: flex; align-items: center;
  justify-content: center; color: #6B7280; font-size: 12px;
  flex-shrink: 0; transition: background 0.15s;
}
.psp-close-btn:hover { background: #F3F4F6; }

/* ── Tabs overrides ── */
.psp-ant-tabs :deep(.ant-tabs-nav) { margin: 0; }
.psp-ant-tabs :deep(.ant-tabs-nav::before) { border-bottom-color: #F3F4F6; }
.psp-ant-tabs :deep(.ant-tabs-tab) {
  font-size: 12px; font-weight: 500; padding: 9px 4px;
  font-family: var(--font-family-main, 'Poppins', sans-serif);
}
.psp-ant-tabs :deep(.ant-tabs-ink-bar) { background: #3B63FB; }
.psp-ant-tabs :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) { color: #3B63FB; }
.psp-ant-tabs :deep(.ant-tabs-content-holder) { overflow: hidden; }

.psp-tab-label { display: flex; align-items: center; gap: 5px; }
.psp-tab-count {
  background: #EEF2FF; color: #4F46E5; font-size: 10px; font-weight: 600;
  padding: 1px 5px; border-radius: 10px;
}

/* ── Active filter chips ── */
.psp-active-filters-bar { padding: 6px 12px 0; }
.psp-active-filters-chips { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.psp-filter-chip {
  display: inline-flex; align-items: center; gap: 5px;
  background: #eef2ff; border: 1px solid #c7d2fe; color: #3B63FB;
  border-radius: 20px; padding: 3px 10px; font-size: 12px; font-weight: 500;
}
.psp-chip-remove {
  background: none; border: none; cursor: pointer; padding: 0;
  display: flex; align-items: center; color: #3B63FB; opacity: 0.7;
  transition: opacity 0.15s;
}
.psp-chip-remove:hover { opacity: 1; }
.psp-clear-all-btn {
  background: none; border: none; cursor: pointer; color: #ff4d4f;
  font-size: 12px; font-weight: 600; padding: 3px 6px;
  border-radius: 4px; transition: background 0.15s;
}
.psp-clear-all-btn:hover { background: #fff1f0; }

/* ── Results area ── */
.psp-results-area {
  max-height: 360px; overflow-y: auto; padding: 6px 8px;
}

/* ── Result item ── */
.psp-result-item {
  display: flex; align-items: center; gap: 12px; padding: 10px 8px;
  border-radius: 8px; cursor: pointer; transition: background 0.12s;
}
.psp-result-item:hover { background: #F9FAFB; }

/* ── Thumbnail ── */
.psp-thumb {
  width: 52px; height: 52px; border-radius: 8px; background: #F3F4F6;
  border: 1px solid #E5E7EB; flex-shrink: 0; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.psp-thumb img { width: 100%; height: 100%; object-fit: cover; }
.psp-thumb-fallback { font-size: 20px; font-weight: 600; color: #9CA3AF; }

/* ── Info ── */
.psp-result-info { flex: 1; min-width: 0; }
.psp-result-name {
  display: flex; align-items: center; gap: 6px; font-size: 13px;
  font-weight: 500; color: #111827; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.psp-result-meta { font-size: 11px; color: #6B7280; margin-top: 2px; }

/* ── Colors ── */
.psp-colors { display: flex; align-items: center; gap: 3px; margin-top: 5px; }
.psp-color-dot { width: 12px; height: 12px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); }
.psp-color-more { font-size: 10px; color: #9CA3AF; }

/* ── Price ── */
.psp-result-price { font-size: 13px; font-weight: 600; color: #111827; flex-shrink: 0; }

/* ── Badges ── */
.psp-badge { display: inline-block; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 500; flex-shrink: 0; }
.psp-badge-furniture { background: #EFF6FF; color: #1D4ED8; }
.psp-badge-wall      { background: #F0FDF4; color: #15803D; }
.psp-badge-floor     { background: #FFFBEB; color: #B45309; }
.psp-badge-lights    { background: #F5F3FF; color: #6D28D9; }

/* ── Highlight ── */
:deep(.psp-hl) { background: #FEF08A; border-radius: 2px; padding: 0 1px; }

/* ── Empty state ── */
.psp-empty {
  padding: 48px 16px; text-align: center; color: #9CA3AF; font-size: 13px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}

/* ── Load more ── */
.psp-load-more { padding: 10px 0; }

/* ── Filter button row ── */
.psp-filter-row {
  display: flex; padding: 8px 12px; border-top: 1px solid #F3F4F6;
}
.psp-filter-btn {
  position: relative; display: flex; align-items: center; gap: 6px;
  padding: 6px 14px; border: 1px solid #d9d9d9; background: white;
  border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;
  color: #555; transition: all 0.15s; font-family: inherit;
}
.psp-filter-btn:hover { background: #f5f5f5; border-color: #bbb; }
.psp-filter-btn--active { border-color: #3B63FB; color: #3B63FB; }
.psp-filter-badge {
  position: absolute; top: -6px; right: -6px;
  background: #3B63FB; color: white; font-size: 10px; font-weight: 700;
  width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; line-height: 1;
}

/* ── Footer hint ── */
.psp-footer {
  padding: 8px 16px; border-top: 1px solid #F3F4F6;
  font-size: 11px; color: #9CA3AF; display: flex; align-items: center;
}
.psp-footer kbd {
  display: inline-block; background: #F3F4F6; border: 1px solid #D1D5DB;
  border-radius: 3px; padding: 1px 5px; font-size: 10px;
  font-family: inherit; color: #374151;
}

/* ── Filter drawer ── */
.psp-filter-drawer {
  position: absolute; inset: 0; background: #fff; z-index: 10;
  display: flex; flex-direction: column; overflow: hidden; border-radius: 12px;
}
.psp-drawer-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 20px 14px; border-bottom: 1px solid #f0f0f0; flex-shrink: 0;
}
.psp-drawer-title { font-size: 16px; font-weight: 700; color: #1a1a1a; font-family: Poppins, sans-serif; }
.psp-drawer-close {
  background: none; border: none; cursor: pointer; padding: 4px;
  display: flex; align-items: center; border-radius: 6px; transition: background 0.15s;
}
.psp-drawer-close:hover { background: #f5f5f5; }
.psp-drawer-body {
  flex: 1; overflow-y: auto; padding: 16px 20px;
  display: flex; flex-direction: column; gap: 24px;
}

/* ── Filter groups ── */
.psp-filter-group {}
.psp-filter-group-label {
  font-size: 13px; font-weight: 600; color: #444; margin-bottom: 10px;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.psp-filter-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.psp-filter-pill {
  padding: 6px 12px; border: 1px solid #e0e0e0; border-radius: 20px;
  background: white; font-size: 12px; color: #555; cursor: pointer;
  transition: all 0.15s; font-weight: 500; display: flex; align-items: center; gap: 4px;
}
.psp-filter-pill:hover { border-color: #3B63FB; color: #3B63FB; }
.psp-filter-pill.active { background: #3B63FB; border-color: #3B63FB; color: white; }
.psp-filter-pill.active .psp-pill-count { color: rgba(255,255,255,0.7); }
.psp-pill-count { font-size: 11px; color: #aaa; }

/* ── Color swatches ── */
.psp-filter-color-swatches { display: flex; flex-wrap: wrap; gap: 10px; }
.psp-color-swatch-btn {
  background: none; border: 2px solid transparent; border-radius: 50%;
  padding: 2px; cursor: pointer; transition: border-color 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.psp-color-swatch-btn:hover { border-color: #bbb; }
.psp-color-swatch-btn.active { border-color: #3B63FB; }
.psp-swatch-circle {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.psp-swatch-check { color: white; font-size: 13px; font-weight: bold; text-shadow: 0 0 3px rgba(0,0,0,0.5); line-height: 1; }

/* ── Drawer footer ── */
.psp-drawer-footer {
  display: flex; gap: 10px; padding: 14px 20px; border-top: 1px solid #f0f0f0;
  flex-shrink: 0; background: #fff;
}
.psp-btn-reset {
  flex: 1; padding: 10px; border: 1px solid #d9d9d9; border-radius: 8px;
  background: white; font-size: 14px; font-weight: 600; color: #666;
  cursor: pointer; transition: all 0.15s;
}
.psp-btn-reset:hover { background: #f5f5f5; }
.psp-btn-apply {
  flex: 1; padding: 10px; border: none; border-radius: 8px;
  background: #3B63FB; font-size: 14px; font-weight: 600; color: white;
  cursor: pointer; transition: all 0.15s;
}
.psp-btn-apply:hover { background: #2a52e0; }

/* ── Filter drawer slide-in animation ── */
.filter-pop-enter-active, .filter-pop-leave-active {
  transition: transform 0.26s cubic-bezier(0.32, 0.72, 0, 1);
}
.filter-pop-enter-from, .filter-pop-leave-to { transform: translateX(-100%); }
.filter-pop-enter-to, .filter-pop-leave-from { transform: translateX(0); }

@media (max-width: 768px) {
  .psp-overlay { padding-top: 0; align-items: flex-end; }
  .psp-popup { width: 100%; max-width: 100%; border-radius: 16px 16px 0 0; }
  .psp-filter-drawer { border-radius: 16px 16px 0 0; }
}
</style>