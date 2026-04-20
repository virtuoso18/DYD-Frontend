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
              Price per Sq.m
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

        <!-- Texture Style Filter -->
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
                Style
              </h4>
              <div
                style="max-height: 200px; overflow-y: auto; padding-right: 8px"
              >
                <a-checkbox v-model:checked="filters.styles.modern" @change="applyFilters" style="display: flex; margin-bottom: 8px">Modern</a-checkbox>
                <a-checkbox v-model:checked="filters.styles.scandinavian" @change="applyFilters" style="display: flex; margin-bottom: 8px">Scandinavian</a-checkbox>
                <a-checkbox v-model:checked="filters.styles.classic" @change="applyFilters" style="display: flex; margin-bottom: 8px">Classic</a-checkbox>
                <a-checkbox v-model:checked="filters.styles.minimalist" @change="applyFilters" style="display: flex; margin-bottom: 8px">Minimalist</a-checkbox>
                <a-checkbox v-model:checked="filters.styles.industrial" @change="applyFilters" style="display: flex; margin-bottom: 8px">Industrial</a-checkbox>
                <a-checkbox v-model:checked="filters.styles.rustic" @change="applyFilters" style="display: flex; margin-bottom: 8px">Rustic</a-checkbox>
                <a-checkbox v-model:checked="filters.styles.boho" @change="applyFilters" style="display: flex; margin-bottom: 8px">Boho</a-checkbox>
                <a-checkbox v-model:checked="filters.styles.other" @change="applyFilters" style="display: flex; margin-bottom: 8px">Other</a-checkbox>
              </div>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="0">
              <a-collapse v-model:activeKey="styleActiveKey">
                <a-collapse-panel key="1" header="Style">
                  <div style="padding-right: 8px">
                    <a-checkbox v-model:checked="filters.styles.modern" @change="applyFilters" style="display: flex; margin-bottom: 8px">Modern</a-checkbox>
                    <a-checkbox v-model:checked="filters.styles.scandinavian" @change="applyFilters" style="display: flex; margin-bottom: 8px">Scandinavian</a-checkbox>
                    <a-checkbox v-model:checked="filters.styles.classic" @change="applyFilters" style="display: flex; margin-bottom: 8px">Classic</a-checkbox>
                    <a-checkbox v-model:checked="filters.styles.minimalist" @change="applyFilters" style="display: flex; margin-bottom: 8px">Minimalist</a-checkbox>
                    <a-checkbox v-model:checked="filters.styles.industrial" @change="applyFilters" style="display: flex; margin-bottom: 8px">Industrial</a-checkbox>
                    <a-checkbox v-model:checked="filters.styles.rustic" @change="applyFilters" style="display: flex; margin-bottom: 8px">Rustic</a-checkbox>
                    <a-checkbox v-model:checked="filters.styles.boho" @change="applyFilters" style="display: flex; margin-bottom: 8px">Boho</a-checkbox>
                    <a-checkbox v-model:checked="filters.styles.other" @change="applyFilters" style="display: flex; margin-bottom: 8px">Other</a-checkbox>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </a-col>
          </a-row>
        </div>

        <!-- ✅ Room Type Filter (only shown when room types are available from API) -->
        <div
          v-if="availableRoomTypes.length > 0"
          style="
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;
          "
        >
          <a-row>
            <!-- Desktop: always visible -->
            <a-col :xs="0" :sm="0" :md="0" :lg="24">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600">
                Room Type
              </h4>
              <div style="max-height: 200px; overflow-y: auto; padding-right: 8px">
                <a-checkbox
                  v-for="room in availableRoomTypes"
                  :key="room.id"
                  :checked="filters.selectedRoomTypes.includes(room.id)"
                  @change="toggleRoomType(room.id)"
                  style="display: flex; margin-bottom: 8px"
                >
                  {{ room.name }}
                  <span style="opacity: 0.5; font-size: 11px; margin-left: 4px">
                    ({{ room.product_count }})
                  </span>
                </a-checkbox>
              </div>
            </a-col>
            <!-- Mobile: collapsible -->
            <a-col :xs="24" :sm="24" :md="24" :lg="0">
              <a-collapse v-model:activeKey="roomTypeActiveKey">
                <a-collapse-panel key="1" header="Room Type">
                  <div style="padding-right: 8px">
                    <a-checkbox
                      v-for="room in availableRoomTypes"
                      :key="room.id"
                      :checked="filters.selectedRoomTypes.includes(room.id)"
                      @change="toggleRoomType(room.id)"
                      style="display: flex; margin-bottom: 8px"
                    >
                      {{ room.name }}
                      <span style="opacity: 0.5; font-size: 11px; margin-left: 4px">
                        ({{ room.product_count }})
                      </span>
                    </a-checkbox>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </a-col>
          </a-row>
        </div>

        <!-- Colors Filter -->
        <!-- <div
          style="
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;
          "
        >
          <a-collapse v-model:activeKey="colourAcitveKey">
            <a-collapse-panel key="1" header="Colors">
              <div
                v-if="loadingColors"
                style="text-align: center; padding: 10px"
              >
                <a-spin size="small" />
              </div>
              <div v-else style="display: flex; gap: 8px; flex-wrap: wrap">
                <div
                  v-for="color in availableColors"
                  :key="color.id"
                  @click="toggleColorFilter(color.color_hex)"
                  :style="{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: color.color_hex,
                    border: filters.selectedColors.includes(color.color_hex)
                      ? '3px solid #1890ff'
                      : '2px solid #ddd',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                  }"
                  :title="color.title || 'Color'"
                >
                  <div
                    v-if="filters.selectedColors.includes(color.color_hex)"
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
        </div> -->
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
            Showing {{ products.length }} of {{ pagination.total_count }} floor
            textures
          </div>
          <div style="display: flex; gap: 8px; align-items: center">
            <span style="color: #666; font-size: 12px">Page Size:</span>
            <a-select
              v-model:value="pagination.page_size"
              @change="handlePageSizeChange"
              style="width: 80px"
            >
              <a-select-option :value="12">12</a-select-option>
              <a-select-option :value="20">20</a-select-option>
              <a-select-option :value="40">40</a-select-option>
              <a-select-option :value="60">60</a-select-option>
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
              style="padding: 3px"
            >
              <div class="product">
                <div
                  class="product-image-container"
                  style="position: relative; overflow: hidden"
                >
                  <!-- Skeleton -->
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
                    :alt="product.title"
                    class="product-image"
                  />

                  <!-- Badges -->
                  <div class="category-badge">Floor</div>
                  <div class="ar-badge">AR</div>
                </div>

                <a-row>
                  <a-col span="24">
                    <b>{{ product.title }}</b>
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
                      :style="{ backgroundColor: color.color_hex }"
                      :title="color.title"
                    ></div>
                  </a-col>

                  <a-col span="12"> Price per Sq.m </a-col>

                  <a-col span="12" style="text-align: right">
                    ${{ formatPrice(product.sale_price_per_sqm) }}
                  </a-col>

                  <a-col
                    span="24"
                    style="font-size: 11px; color: #666; margin-bottom: 4px"
                  >
                    Size: {{ product.size_width }}x{{ product.size_height }}cm |
                    Grid: {{ product.columns }}x{{ product.rows }}
                  </a-col>

                  <a-col span="24">
                    <a-button
                      block
                      @click="handleProductDetail(product)"
                      >Product Details</a-button
                    >
                  </a-col>

                  <!-- <a-col span="1"></a-col>
                  <a-col span="4">
                  <a-button block type="default" style="padding:0;display: flex;justify-content: center;align-items: center; border: none;" 
                    @click.stop="toggleLike(product.id, products.indexOf(product))">
                    <HeartFilled v-if="product.is_liked" style="color: red; font-size: 18px;" />
                    <HeartOutlined v-else style="font-size: 18px;" />
                  </a-button>
                </a-col> -->
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
              :total="pagination.total_count"
              :page-size="pagination.page_size"
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
import { HeartOutlined,HeartFilled } from "@ant-design/icons-vue";

export default {
  name: "FloorTextures",
  components: {
    HeartOutlined,HeartFilled
  },
  data() {
    return {
      styleActiveKey: ["1"],
      colourAcitveKey: ["1"],
      roomTypeActiveKey: [], // collapsed by default on mobile
      products: [],
      wishlisted: new Set(),
      loading: false,
      imageLoadedMap: {},
      loadingColors: false,
      availableColors: [],
      availableRoomTypes: [], // ✅ NEW
      pagination: {
        current_page: 1,
        page_size: 20,
        total_count: 0,
        total_pages: 1,
      },
      filters: {
        priceRange: [0, 500000],
        selectedColors: [],
        selectedRoomTypes: [], // ✅ NEW
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
      filterTimeout: null,
    };
  },
  mounted() {
    // this.loadAvailableColors();
    this.loadProducts();
  },
  methods: {
    async toggleLike(itemId, itemIndex) {
  try {
    const token = localStorage.getItem('token');
    if (!token) { this.$message.warning('Please login to add favorites'); return; }
    const response = await fetch(`${this.$store.state.root_api}likes/favorites/toggle/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Token ${token}` },
      body: JSON.stringify({ id: itemId, type: 'floor_texture' }),  // changed to floor_texture
    });
    const data = await response.json();
    this.products[itemIndex].is_liked = data.favorited;  // changed catalogItems → products
    this.$message.success(data.favorited ? 'Added to favorites' : 'Removed from favorites');
  } catch (error) {
    console.error("Like toggle failed", error);
    this.$message.error('Failed to update favorite');
  }
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
        this.selectedProduct.is_favorited = data.favorited;
      } catch (error) {
        console.error("Favorite toggle failed", error);
      }
    },

    /**
     * Load available colors and room types.
     *
     * Strategy:
     *  1. Try the dedicated GET /room/api/floors/colors/ endpoint first.
     *     - On success use data.data for colors and data.room_types for room types.
     *  2. If the dedicated endpoint returns no colors (empty array or missing),
     *     fall back to fetching the full product list and extracting unique
     *     colors client-side.
     */
    async loadAvailableColors() {
      try {
        this.loadingColors = true;
        const brand = this.$route.query.brand;

        // ── Step 1: dedicated colors endpoint ─────────────────────────────
        const colorsUrl = brand
          ? `${this.$store.state.root_api}room/api/floors/colors/?brand=${brand}`
          : `${this.$store.state.root_api}room/api/floors/colors/`;

        const colorsResponse = await fetch(colorsUrl, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const colorsData = await colorsResponse.json();

        if (
          colorsData.success &&
          Array.isArray(colorsData.data) &&
          colorsData.data.length > 0
        ) {
          // Dedicated endpoint returned colors — use them directly
          this.availableColors = colorsData.data.map((color) => ({
            id: color.color_hex,
            title: color.title || "Color",
            color_hex: color.color_hex,
          }));

          // Room types live on the same response
          this.availableRoomTypes = Array.isArray(colorsData.room_types)
            ? colorsData.room_types
            : [];

          console.log(
            "Colors loaded from dedicated endpoint:",
            this.availableColors.length,
            "| Room types:",
            this.availableRoomTypes.length,
          );
        } else {
          // ── Step 2: fallback — extract colors from full product list ─────
          console.warn(
            "Dedicated colors endpoint returned no data, falling back to product list extraction.",
          );

          const fallbackUrl = brand
            ? `${this.$store.state.root_api}room/api/load-brand-products/floors/${brand}/?page=1&page_size=1000`
            : `${this.$store.state.root_api}room/api/floors/?page=1&page_size=1000`;

          const fallbackResponse = await fetch(fallbackUrl, {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          const fallbackData = await fallbackResponse.json();

          if (fallbackData.success && Array.isArray(fallbackData.data)) {
            const colorMap = new Map();

            fallbackData.data.forEach((product) => {
              if (
                product.colors_available &&
                Array.isArray(product.colors_available)
              ) {
                product.colors_available.forEach((color) => {
                  if (color.color_hex && !colorMap.has(color.color_hex)) {
                    colorMap.set(color.color_hex, {
                      id: color.id || color.color_hex,
                      title: color.title || "Color",
                      color_hex: color.color_hex,
                    });
                  }
                });
              }
            });

            this.availableColors = Array.from(colorMap.values());
            console.log(
              "Colors extracted from product list (fallback):",
              this.availableColors.length,
            );
          }

          // Room types are not available via the fallback
          this.availableRoomTypes = [];
        }
      } catch (error) {
        console.error("Failed to load colors:", error);
        this.availableColors = [];
        this.availableRoomTypes = [];
      } finally {
        this.loadingColors = false;
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
     * ✅ NEW: Toggle room type filter selection
     */
    toggleRoomType(roomTypeId) {
      const index = this.filters.selectedRoomTypes.indexOf(roomTypeId);
      if (index > -1) {
        this.filters.selectedRoomTypes.splice(index, 1);
      } else {
        this.filters.selectedRoomTypes.push(roomTypeId);
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

        // Pagination
        params.append("page", this.pagination.current_page);
        params.append("page_size", this.pagination.page_size);

        // Price range
        params.append("price_per_sqm_min", this.filters.priceRange[0]);
        params.append("price_per_sqm_max", this.filters.priceRange[1]);

        // Texture styles
        const selectedStyles = [];
        if (this.filters.styles.modern) selectedStyles.push("Modern");
        if (this.filters.styles.scandinavian) selectedStyles.push("Scandinavian");
        if (this.filters.styles.classic) selectedStyles.push("Classic");
        if (this.filters.styles.minimalist) selectedStyles.push("Minimalist");
        if (this.filters.styles.industrial) selectedStyles.push("Industrial");
        if (this.filters.styles.rustic) selectedStyles.push("Rustic");
        if (this.filters.styles.boho) selectedStyles.push("Boho");
        if (this.filters.styles.other) selectedStyles.push("Other");

        if (selectedStyles.length > 0) {
          params.append("texture_style", selectedStyles.join(","));
        }

        // Colors
        if (this.filters.selectedColors.length > 0) {
          params.append("color_hex", this.filters.selectedColors.join(","));
        }

        // ✅ NEW: Room types
        if (this.filters.selectedRoomTypes.length > 0) {
          params.append("room_type", this.filters.selectedRoomTypes.join(","));
        }

        let url = "";
        if (this.$route.query.brand) {
          url = `${this.$store.state.root_api}room/api/load-brand-products/floors/${this.$route.query.brand}/?${params.toString()}`;
        } else {
          url = `${this.$store.state.root_api}room/api/floors/?${params.toString()}`;
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
          this.products = data.data;
          const pag = data.pagination || {};
          this.pagination.current_page = pag.page || data.page || 1;
          this.pagination.page_size = pag.page_size || data.page_size || 20;
          this.pagination.total_count = pag.total_count || data.total_count || 0;
          this.pagination.total_pages = pag.total_pages || data.total_pages || 1;

          this.addInitWishListed();
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

    handlePageChange(page) {
      this.pagination.current_page = page;
      this.loadProducts();
    },

    handlePageSizeChange(pageSize) {
      this.pagination.page_size = pageSize;
      this.pagination.current_page = 1;
      this.loadProducts();
    },

    handlePriceChange() {
      clearTimeout(this.filterTimeout);
      this.filterTimeout = setTimeout(() => {
        this.applyFilters();
      }, 500);
    },

    applyFilters() {
      this.pagination.current_page = 1;
      this.loadProducts();
    },

    clearFilters() {
      this.filters = {
        priceRange: [0, 500000],
        selectedColors: [],
        selectedRoomTypes: [], // ✅ also reset room types
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
      this.pagination.current_page = 1;
      this.loadProducts();
    },

    getProductImage(product) {
      if (product.texture_image) {
        if (product.texture_image.startsWith("/")) {
          return `${this.$store.state.root_media_api}${product.texture_image}`;
        }
        return product.texture_image;
      }
      return "https://via.placeholder.com/300x300?text=No+Image";
    },

    formatPrice(price) {
      if (!price) return "0";
      return parseInt(price).toLocaleString("en-IN");
    },

    isWishlisted(productId) {
      return this.wishlisted.has(productId);
    },

    toggleWishlist(product) {
      if (this.wishlisted.has(product.id)) {
        this.wishlisted.delete(product.id);
        this.$message.success("Removed from wishlist");
      } else {
        this.wishlisted.add(product.id);
        this.$message.success("Added to wishlist");
      }
      this.toggleFavorite(product, "floor_texture");
    },

    addInitWishListed() {
      this.products.forEach((product) => {
        if (product.is_favorited) {
          this.wishlisted.add(product.id);
        }
      });
    },

    handleProductDetail(product) {
      this.$router.push({
        name: "buisness_product",
        params: {
          buisness_name: product.business_slug,
          product_type: "floor",
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

.see-all-section {
  display: flex;
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
  height: auto;
}

.product-detail-btn:hover {
  color: #1d4ed8;
  border-color: #1d4ed8;
}

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
    flex-direction: column;
  }
}
</style>