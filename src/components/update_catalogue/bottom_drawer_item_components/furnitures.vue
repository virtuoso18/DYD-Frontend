<template>
  <div class="main">
    <a-row class="see-all-section">
      <a-col :sm="24" :md="24" :lg="4">
        <!-- Price Filter -->
        <div
          style="
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;
          "
        >
          <div class="flex justify-between">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600">
              Price
            </h4>
            <img
              class="w-[24px] cursor-pointer"
              @click="clearFilters"
              src="../../../assets/icons/ClearfilterIcon.svg"
              alt="clear filter"
            />
          </div>
          <a-slider
            :min="0"
            :max="500000"
            v-model:value="filters.priceRange"
            range
            @change="handlePriceChange"
          />
          <p style="margin-top: 8px; font-size: 12px; color: #666">
            ${{ filters.priceRange[0].toLocaleString("en-IN") }} - ${{
              filters.priceRange[1].toLocaleString("en-IN")
            }}
          </p>
        </div>

        <!-- Room Type Filter -->
        <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
          <a-row>
            <a-col :xs="0" :sm="0" :md="0" :lg="24">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Room Type</h4>
              <div v-if="loadingFilters" style="text-align: center; padding: 10px">
                <a-spin size="small" />
              </div>
              <div v-else style="max-height: 200px; overflow-y: auto; padding-right: 8px">
                <a-checkbox
                  v-for="room in availableRoomTypes"
                  :key="room.id"
                  v-model:checked="filters.selectedRoomTypes[room.id]"
                  @change="onRoomTypeChange(room.id)"
                  style="display: flex; align-items: center; margin-bottom: 8px"
                >
                  <span>{{ room.name }}
                    <span style="color: #999; font-size: 11px; margin-left: 4px">({{ room.product_count }})</span>
                  </span>
                </a-checkbox>
                <div v-if="availableRoomTypes.length === 0" style="color: #999; font-size: 12px">
                  No room types available
                </div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="0">
              <a-collapse v-model:activeKey="roomTypeKey">
                <a-collapse-panel key="1" header="Room Type">
                  <div v-if="loadingFilters" style="text-align: center; padding: 10px">
                    <a-spin size="small" />
                  </div>
                  <div v-else style="padding-right: 8px">
                    <a-checkbox
                      v-for="room in availableRoomTypes"
                      :key="room.id"
                      v-model:checked="filters.selectedRoomTypes[room.id]"
                      @change="onRoomTypeChange(room.id)"
                      style="display: flex; align-items: center; margin-bottom: 8px"
                    >
                      <span>{{ room.name }}
                        <span style="color: #999; font-size: 11px; margin-left: 4px">({{ room.product_count }})</span>
                      </span>
                    </a-checkbox>
                    <div v-if="availableRoomTypes.length === 0" style="color: #999; font-size: 12px">
                      No room types available
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </a-col>
          </a-row>
        </div>

        <!-- Category Filter -->
        <div
          style="
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;
          "
        >
          <a-row>
            <a-col :xs="0" :sm="0" :md="0" :lg="24">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600">
                Category
              </h4>
              <div
                v-if="loadingFilters"
                style="text-align: center; padding: 10px"
              >
                <a-spin size="small" />
              </div>
              <div
                v-else
                style="max-height: 200px; overflow-y: auto; padding-right: 8px"
              >
                <a-checkbox
                  v-for="category in availableCategories"
                  :key="category.id"
                  v-model:checked="filters.selectedCategories[category.id]"
                  @change="onCategoryChange(category.id)"
                  style="display: flex; align-items: center; margin-bottom: 8px"
                >
                  <span
                    >{{ category.name }}
                    <span style="color: #999; font-size: 11px; margin-left: 4px"
                      >({{ category.product_count }})</span
                    ></span
                  >
                </a-checkbox>
                <div
                  v-if="availableCategories.length === 0"
                  style="color: #999; font-size: 12px"
                >
                  No categories available
                </div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="0">
              <a-collapse v-model:activeKey="categoryKey">
                <a-collapse-panel key="1" header="Category">
                  <div
                    v-if="loadingFilters"
                    style="text-align: center; padding: 10px"
                  >
                    <a-spin size="small" />
                  </div>
                  <div v-else style="padding-right: 8px">
                    <a-checkbox
                      v-for="category in availableCategories"
                      :key="category.id"
                      v-model:checked="filters.selectedCategories[category.id]"
                      @change="onCategoryChange(category.id)"
                      style="
                        display: flex;
                        align-items: center;
                        margin-bottom: 8px;
                      "
                    >
                      <span
                        >{{ category.name }}
                        <span
                          style="color: #999; font-size: 11px; margin-left: 4px"
                          >({{ category.product_count }})</span
                        ></span
                      >
                    </a-checkbox>
                    <div
                      v-if="availableCategories.length === 0"
                      style="color: #999; font-size: 12px"
                    >
                      No categories available
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </a-col>
          </a-row>
        </div>

        

        <!-- Furniture Type Filter -->
        <div
          style="
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;
          "
        >
          <a-row>
            <a-col :xs="0" :sm="0" :md="0" :lg="24">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600">
                Furniture Type
              </h4>
              <div
                v-if="loadingFilters"
                style="text-align: center; padding: 10px"
              >
                <a-spin size="small" />
              </div>
              <div
                v-else
                style="max-height: 200px; overflow-y: auto; padding-right: 8px"
              >
                <a-checkbox
                  v-for="type in availableFurnitureTypes"
                  :key="type.furniture_type"
                  v-model:checked="filters.selectedTypes[type.furniture_type]"
                  @change="applyFilters"
                  style="display: flex; align-items: center; margin-bottom: 8px"
                >
                  <span
                    >{{ type.furniture_type }}
                    <span style="color: #999; font-size: 11px; margin-left: 4px"
                      >({{ type.product_count }})</span
                    ></span
                  >
                </a-checkbox>
                <div
                  v-if="availableFurnitureTypes.length === 0"
                  style="color: #999; font-size: 12px"
                >
                  No furniture types available
                </div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="0">
              <a-collapse v-model:activeKey="furnitureTypeKey">
                <a-collapse-panel key="1" header="Furniture Type">
                  <div
                    v-if="loadingFilters"
                    style="text-align: center; padding: 10px"
                  >
                    <a-spin size="small" />
                  </div>
                  <div v-else style="padding-right: 8px">
                    <a-checkbox
                      v-for="type in availableFurnitureTypes"
                      :key="type.furniture_type"
                      v-model:checked="
                        filters.selectedTypes[type.furniture_type]
                      "
                      @change="applyFilters"
                      style="
                        display: flex;
                        align-items: center;
                        margin-bottom: 8px;
                      "
                    >
                      <span
                        >{{ type.furniture_type }}
                        <span
                          style="color: #999; font-size: 11px; margin-left: 4px"
                          >({{ type.product_count }})</span
                        ></span
                      >
                    </a-checkbox>
                    <div
                      v-if="availableFurnitureTypes.length === 0"
                      style="color: #999; font-size: 12px"
                    >
                      No furniture types available
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </a-col>
          </a-row>
        </div>

        <!-- Colors Filter -->
        <div
          style="
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;
          "
        >
          <a-collapse v-model:activeKey="colourAcitveKey">
            <a-collapse-panel key="1" header="Colors">
              <div
                v-if="loadingFilters"
                style="text-align: center; padding: 10px"
              >
                <a-spin size="small" />
              </div>
              <div v-else style="display: flex; gap: 8px; flex-wrap: wrap">
                <div
                  v-for="color in availableColors"
                  :key="color.color"
                  @click="toggleColorFilter(color.color)"
                  :style="{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: color.color,
                    border: filters.selectedColors.includes(color.color)
                      ? '3px solid #1890ff'
                      : '2px solid #ddd',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }"
                  :title="`${color.color} (${color.product_count} products)`"
                >
                  <div
                    v-if="filters.selectedColors.includes(color.color)"
                    style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      color: white;
                      font-size: 16px;
                      font-weight: bold;
                      text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
                    "
                  >
                    ✓
                  </div>
                </div>
                <div
                  v-if="availableColors.length === 0"
                  style="
                    color: #999;
                    font-size: 12px;
                    width: 100%;
                    text-align: center;
                  "
                >
                  No colors available
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>

        <!-- Width Filter -->
        <!-- <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Width (m)</h4>
          <a-slider 
            :min="0" 
            :max="5" 
            :step="0.1"
            v-model:value="filters.widthRange" 
            range 
            @change="handleSizeChange"
          />
          <p style="margin-top: 8px; font-size: 12px; color: #666;">
            {{ filters.widthRange[0] }}m - {{ filters.widthRange[1] }}m
          </p>
        </div> -->

        <!-- Height Filter -->
        <!-- <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Height (m)</h4>
          <a-slider 
            :min="0" 
            :max="5" 
            :step="0.1"
            v-model:value="filters.heightRange" 
            range 
            @change="handleSizeChange"
          />
          <p style="margin-top: 8px; font-size: 12px; color: #666;">
            {{ filters.heightRange[0] }}m - {{ filters.heightRange[1] }}m
          </p>
        </div> -->

        <!-- Depth Filter -->
        <!-- <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Depth (m)</h4>
          <a-slider 
            :min="0" 
            :max="5" 
            :step="0.1"
            v-model:value="filters.depthRange" 
            range 
            @change="handleSizeChange"
          />
          <p style="margin-top: 8px; font-size: 12px; color: #666;">
            {{ filters.depthRange[0] }}m - {{ filters.depthRange[1] }}m
          </p>
        </div> -->

        <!-- Clear Button -->
        <!-- <a-button block type="primary" @click="clearFilters"
          >Clear Filters</a-button
        > -->
      </a-col>

      <a-col :sm="24" :md="24" :lg="20">
        <!-- Results Header -->
        <div
          v-if="!loading"
          style="
            padding: 0 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="color: #666; font-size: 14px">
            Showing {{ products.length }} of
            {{ pagination.total_count }} products
          </div>
          <div style="display: flex; gap: 8px; align-items: center">
            <span style="color: #666; font-size: 12px">Page Size:</span>
            <a-select
              v-model:value="pagination.page_size"
              @change="handlePageSizeChange"
              style="width: 80px"
            >
              <a-select-option :value="20">20</a-select-option>
              <a-select-option :value="40">40</a-select-option>
              <a-select-option :value="60">60</a-select-option>
              <a-select-option :value="80">80</a-select-option>
              <a-select-option :value="100">100</a-select-option>
            </a-select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" style="text-align: center; padding: 40px">
          <a-spin size="large" />
        </div>

        <!-- Products List -->
        <div v-else class="products-list">
          <a-row>
            <a-col
              v-for="product in products"
              :key="product.id"
              class="product-responsive"
              style="padding: 5px"
            >
              <div class="product">
                <div
                  class="product-image-container"
                  style="position: relative; overflow: hidden"
                >
                  <!-- Skeleton (YOUR EXACT CSS) -->
                  <div
                    v-if="!imageLoadedMap[product.id]"
                    class="product-skeleton"
                  ></div>

                  <!-- Preload -->
                  <img
                    :src="getProductImage(product)"
                    style="position: absolute; width: 0; height: 0; opacity: 0"
                    @load="onProductImageLoad(product.id)"
                    alt=""
                  />

                  <!-- Visible -->
                  <img
                    v-show="imageLoadedMap[product.id]"
                    :src="getProductImage(product)"
                    :alt="product.name"
                    class="product-image"
                  />

                  <!-- Badges (z-index stays above) -->
                  <div class="category-badge">
                    {{ getCategoryName(product) }}
                  </div>
                  <div class="ar-badge">AR</div>
                </div>

                <a-row>
                  <a-col span="24">
                    <b class="product-name">
                      {{ product.name }}
                    </b>
                  </a-col>

                  <a-col span="12"> Colors </a-col>

                  <a-col
                    span="12"
                    style="display: flex; justify-content: end; gap: 4px"
                  >
                    <div
                      v-for="color in product.colors_available.slice(0, 3)"
                      :key="color.id"
                      style="
                        width: 20px;
                        height: 20px;
                        border-radius: 20px;
                        border: 1px solid #ddd;
                      "
                      :style="{ backgroundColor: color.color }"
                      :title="`Color ${color.color}`"
                    ></div>
                  </a-col>

                  <a-col span="12"> Price </a-col>

                  <a-col span="12" style="text-align: right">
                    ${{ getPrice(product) }}
                  </a-col>

                  <a-col
                    span="24"
                    style="
                      font-size: 11px;
                      color: #666;
                      margin-bottom: 4px;
                      max-width: 100%;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                    "
                  >
                    Dimensions: {{ getDimensions(product) }}
                  </a-col>

               <a-col span="24">
  <div style="display: flex; gap: 8px; align-items: center;">
    
    <a-button
      block
      class="product-detail-btn"
      style="flex: 1;"
      @click="handleProductDetail(product)"
    >
      Product Details
    </a-button>

    <!-- Fixed: removed nested a-col, just a plain a-button -->
    <a-button
      type="default"
      style="padding: 0; width: 36px; display: flex; justify-content: center; align-items: center; border: none; flex-shrink: 0;"
      @click.stop="toggleLike(product.id, products.indexOf(product))"
    >
      <HeartFilled v-if="product.is_liked" style="color: red; font-size: 18px;" />
      <HeartOutlined v-else style="font-size: 18px;" />
    </a-button>

      
          </div>          
        </a-col>

 

                </a-row>
              </div>
            </a-col>
          </a-row>

          <!-- No Results -->
          <div
            v-if="products.length === 0"
            style="text-align: center; padding: 40px; color: #999"
          >
            <p>No products found matching your filters.</p>
          </div>

          <!-- Pagination -->
          <div
            v-if="pagination.total_pages > 1"
            style="display: flex; justify-content: center; margin-top: 30px"
          >
            <a-pagination
              v-model:current="pagination.current_page"
              v-model:page-size="pagination.page_size"
              :total="pagination.total_count"
              :show-size-changer="false"
              :show-total="
                (total, range) => `${range[0]}-${range[1]} of ${total} items`
              "
              @change="handlePageChange"
            />
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { HeartFilled, HeartOutlined } from "@ant-design/icons-vue";

export default {
  name: "FurnitureProducts",
  components: {
    HeartOutlined,HeartFilled
  },
  data() {
    return {
      colourAcitveKey: ["1"],
      categoryKey: ["1"],
      furnitureTypeKey: ["1"],
      roomTypeKey: ["1"],
      products: [],
      wishlisted: new Set(),
      loading: false,
      imageLoadedMap: {},
      loadingFilters: false,
      availableColors: [],
      availableCategories: [],
      availableFurnitureTypes: [],
      availableRoomTypes: [],
      pagination: {
        current_page: 1,
        page_size: 20,
        total_count: 0,
        total_pages: 1,
      },
      filters: {
        priceRange: [0, 500000],
        widthRange: [0, 5],
        heightRange: [0, 5],
        depthRange: [0, 5],
        selectedCategories: {},
        selectedTypes: {},
        selectedColors: [],
        selectedRoomTypes: {}
      },
      filterTimeout: null,
    };
  },
  mounted() {
    this.loadFilterOptions();
    this.loadProducts();
   
  },
  methods: {
      onRoomTypeChange(roomId) {
      const isSelected = this.filters.selectedRoomTypes[roomId];
      // Auto-select / deselect all categories belonging to this room type
      this.availableCategories
        .filter(c => c.room_type_id === roomId)
        .forEach(c => {
          this.filters.selectedCategories[c.id] = isSelected;
        });
      this.applyFilters();
    },

    onCategoryChange(categoryId) {
      // Sync parent room type: deselect it if any of its categories are unchecked
      const cat = this.availableCategories.find(c => c.id === categoryId);
      if (cat && cat.room_type_id) {
        const allSelected = this.availableCategories
          .filter(c => c.room_type_id === cat.room_type_id)
          .every(c => this.filters.selectedCategories[c.id]);
        this.filters.selectedRoomTypes[cat.room_type_id] = allSelected;
      }
      this.applyFilters();
    },
      async toggleFavorite(product, product_type) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}likes/favorites/toggle/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              id: product.id,
              type: product_type,
            }),
          },
        );

        const data = await response.json();
        if (this.selectedProduct.is_favorited) {
        }
        this.selectedProduct.is_favorited = data.favorited;
      } catch (error) {
        console.error("Favorite toggle failed", error);
      }
    },
       async toggleLike(itemId, itemIndex) {
        try {
          const token = localStorage.getItem('token');
          if (!token) { this.$message.warning('Please login to add favorites'); return; }
          const response = await fetch(`${this.$store.state.root_api}likes/favorites/toggle/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` },
            body: JSON.stringify({ id: itemId, type: 'product' }), 
          });
          const data = await response.json();
          this.products[itemIndex].is_liked = data.favorited;  // changed catalogItems → products
          this.$message.success(data.favorited ? 'Added to favorites' : 'Removed from favorites');
        } catch (error) {
          console.error("Like toggle failed", error);
          this.$message.error('Failed to update favorite');
        }
      },
    /**
     * Load filter options from API
     */
    async loadFilterOptions() {
      try {
        this.loadingFilters = true;

        const url = `${this.$store.state.root_api}product/api/filter-options/`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          this.availableColors = data.data.colors || [];
          this.availableCategories = data.data.categories || [];
          this.availableFurnitureTypes = data.data.furniture_types || [];

          this.filters.selectedCategories = {};
          this.availableCategories.forEach((cat) => {
            this.filters.selectedCategories[cat.id] = false;
          });

          this.filters.selectedTypes = {};
          this.availableFurnitureTypes.forEach((type) => {
            this.filters.selectedTypes[type.furniture_type] = false;
          });
          this.availableRoomTypes = data.data.room_types || [];

        this.filters.selectedRoomTypes = {};
        this.availableRoomTypes.forEach((room) => {
          this.filters.selectedRoomTypes[room.id] = false;
        });
        } else {
          this.$message.error("Failed to load filter options");
        }
      } catch (error) {
        console.error("Failed to load filter options:", error);
        this.$message.error("Error loading filter options");
      } finally {
        this.loadingFilters = false;
      }
    },

    onProductImageLoad(id) {
      this.imageLoadedMap[id] = false;
      setTimeout(() => {
        this.imageLoadedMap[id] = true;
      }, 1000);
    },

    /**
     * Toggle color filter selection
     */
    toggleColorFilter(hexCode) {
      const index = this.filters.selectedColors.indexOf(hexCode);
      if (index > -1) {
        this.filters.selectedColors.splice(index, 1);
      } else {
        this.filters.selectedColors.push(hexCode);
      }
      this.applyFilters();
    },

    /**
     * Load products with filters and pagination
     */
    async loadProducts() {
      try {
        this.loading = true;

        const params = new URLSearchParams();

        // Add pagination parameters
        params.append("page", this.pagination.current_page);
        params.append("page_size", this.pagination.page_size);

        // Add price range
        params.append("price_min", this.filters.priceRange[0]);
        params.append("price_max", this.filters.priceRange[1]);

        // Add dimension ranges
        if (this.filters.widthRange[0] > 0 || this.filters.widthRange[1] < 5) {
          params.append("width_min", this.filters.widthRange[0]);
          params.append("width_max", this.filters.widthRange[1]);
        }

        if (
          this.filters.heightRange[0] > 0 ||
          this.filters.heightRange[1] < 5
        ) {
          params.append("height_min", this.filters.heightRange[0]);
          params.append("height_max", this.filters.heightRange[1]);
        }

        if (this.filters.depthRange[0] > 0 || this.filters.depthRange[1] < 5) {
          params.append("depth_min", this.filters.depthRange[0]);
          params.append("depth_max", this.filters.depthRange[1]);
        }

        // Add selected categories
        const selectedCategories = Object.keys(this.filters.selectedCategories)
          .filter((id) => this.filters.selectedCategories[id])
          .map((id) => {
            const category = this.availableCategories.find(
              (cat) => cat.id === id,
            );
            return category ? category.name : id;
          });

        if (selectedCategories.length > 0) {
          params.append("category", selectedCategories.join(","));
        }

        // Add selected furniture types
        const selectedTypes = Object.keys(this.filters.selectedTypes).filter(
          (type) => this.filters.selectedTypes[type],
        );

        if (selectedTypes.length > 0) {
          params.append("furniture_type", selectedTypes.join(","));
        }

        // Add selected colors
        if (this.filters.selectedColors.length > 0) {
          params.append("color_hex", this.filters.selectedColors.join(","));
        }
        const selectedRoomTypes = Object.keys(this.filters.selectedRoomTypes)
          .filter(id => this.filters.selectedRoomTypes[id]);

        if (selectedRoomTypes.length > 0) {
          params.append("room_type", selectedRoomTypes.join(","));
        }

        let url = "";
        if (this.$route.query.brand) {
          url = `${
            this.$store.state.root_api
          }product/api/load-brand-products/3d-products/${
            this.$route.query.brand
          }/?${params.toString()}`;
        } else {
          url = `${
            this.$store.state.root_api
          }product/api/3d-products/?${params.toString()}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          this.products = data.data || [];
          const p = data.pagination || {};
          this.pagination.current_page = p.page || 1;
          this.pagination.page_size = p.page_size || 20;
          this.pagination.total_count = p.total_count || 0;
          this.pagination.total_pages = p.total_pages || 1;

          // this.addInitWishListed();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          this.$message.error(data.message || "Failed to load products");
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        this.$message.error("Error loading products");
      } finally {
        this.loading = false;
      }
    },

    /**
     * Handle page change
     */
    handlePageChange(page, pageSize) {
      this.pagination.current_page = page;
      this.pagination.page_size = pageSize;
      this.loadProducts();
    },

    /**
     * Handle page size change
     */
    handlePageSizeChange(pageSize) {
      this.pagination.page_size = pageSize;
      this.pagination.current_page = 1; // Reset to first page
      this.loadProducts();
    },

    /**
     * Handle price range change with debounce
     */
    handlePriceChange() {
      clearTimeout(this.filterTimeout);
      this.filterTimeout = setTimeout(() => {
        this.applyFilters();
      }, 500);
    },

    /**
     * Handle size range change with debounce
     */
    handleSizeChange() {
      clearTimeout(this.filterTimeout);
      this.filterTimeout = setTimeout(() => {
        this.applyFilters();
      }, 500);
    },

    /**
     * Apply all filters (reset to page 1)
     */
    applyFilters() {
      this.pagination.current_page = 1; // Reset to first page when filters change
      this.loadProducts();
    },

    /**
     * Clear all filters
     */
    clearFilters() {
      this.filters = {
        priceRange: [0, 500000],
        widthRange: [0, 5],
        heightRange: [0, 5],
        depthRange: [0, 5],
        selectedCategories: {},
        selectedTypes: {},
        selectedColors: [],
        selectedRoomTypes: {}
      };

      this.availableCategories.forEach((cat) => {
        this.filters.selectedCategories[cat.id] = false;
      });

      this.availableFurnitureTypes.forEach((type) => {
        this.filters.selectedTypes[type.furniture_type] = false;
      });
      this.availableRoomTypes.forEach((room) => {
        this.filters.selectedRoomTypes[room.id] = false;
      });

      this.pagination.current_page = 1;
      this.loadProducts();
    },

    /**
     * Get the proper image URL from product
     */
    getProductImage(product) {
      if (product.primary_image) {
        if (product.primary_image.startsWith("/")) {
          return `${this.$store.state.root_media_api}${product.primary_image}`;
        }
        return product.primary_image;
      }
      return "https://via.placeholder.com/300x300?text=No+Image";
    },

    /**
     * Get category name from product
     */
    getCategoryName(product) {
      if (product.category && product.category.name) {
        return product.category.name;
      }
      if (product.furniture_type) {
        return product.furniture_type;
      }
      return "Furniture";
    },

    /**
     * Get formatted price
     */
    getPrice(product) {
      if (product.pricing) {
        const price =
          product.pricing.current_price || product.pricing.price || 0;
        return parseInt(price).toLocaleString("en-IN");
      }
      return "0";
    },

    /**
     * Get dimensions string
     */
    getDimensions(product) {
      if (!product.dimensions) return "N/A";

      const dims = product.dimensions;
      const parts = [];

      if (dims.width) parts.push(`W: ${dims.width}m`);
      if (dims.height) parts.push(`H: ${dims.height}m`);
      if (dims.depth) parts.push(`D: ${dims.depth}m`);
      if (dims.length) parts.push(`L: ${dims.length}m`);

      return parts.length > 0 ? parts.join(" | ") : "N/A";
    },

    /**
     * Check if product is wishlisted
     */
    isWishlisted(productId) {
      return this.wishlisted.has(productId);
    },
     
    addInitWishListed(){
      this.products.forEach((product) => {
        if (product.is_favorited) {
          this.wishlisted.add(product.id);
        }
      });
    },

    /**
     * Toggle wishlist status
     */
    toggleWishlist(product) {
      if (this.wishlisted.has(product.id)) {
        this.wishlisted.delete(product.id);
        this.$message.success("Removed from wishlist");
      } else {
        this.wishlisted.add(product.id);
        this.$message.success("Added to wishlist");
      }
      this.toggleFavorite(product, "product");
    },

    /**
     * Handle product detail click
     */
    handleProductDetail(product) {
      // console.log(product)
      this.$router.push({
        name: "buisness_product",
        params: {
          buisness_name: product.business_slug,
          product_type: "product",
          product_id: product.id,
        },
      });
    },
  },
};
</script>

<style scoped>
@media (min-width: 768px) {
  .main {
    padding: 10px;
    border-radius: 20px;
    background: white;
    border: 2px solid rgba(128, 128, 128, 0.16);
    margin-bottom: 10px;
  }
}

.product {
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f3f2f4;
}

.products-list {
  padding-bottom: 20px;
}

.product-image-container {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.product-skeleton {
  width: 100%;
  height: 240px;
  border-radius: 12px;
  background: linear-gradient(110deg, #e5e7eb 8%, #f9fafb 18%, #e5e7eb 33%);
  background-size: 200% 100%;
  animation: product-shimmer 1.6s infinite linear;
}

@keyframes product-shimmer {
  to {
    background-position-x: -200%;
  }
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-name {
  display: -webkit-box;
  -webkit-line-clamp: 1; /* max 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.product-detail-btn {
  white-space: nowrap;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 4px 8px;
  font-weight: 500;
  color: #030c20;
  background: transparent;
  transition: color 0.2s ease;
  font-size: 12px;
  height: auto; /* override antd */
}

.product-detail-btn:hover {
  color: #1d4ed8;
  border-color: #1d4ed8;
}

/* sm and above */
@media (min-width: 640px) {
  .product-detail-btn {
    font-size: 14px;
  }
}

.ar-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #e5e7eb;
  color: #374151;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.product-responsive {
  width: 50%;
  flex: 0 0 50%;
}

@media (min-width: 576px) {
  .product-responsive {
    width: 50%;
    flex: 0 0 50%;
  }
}

@media (min-width: 768px) {
  .product-responsive {
    width: 33.333%;
    flex: 0 0 33.333%;
  }
}

@media (min-width: 992px) {
  .product-responsive {
    width: 25%;
    flex: 0 0 25%;
  }
}

@media (min-width: 1200px) {
  .product-responsive {
    width: 20%;
    flex: 0 0 20%;
  }
}
@media screen and (max-width: 768px) {
  .see-all-section {
    display: flex;
    flex-direction: column;
  }
}
</style>