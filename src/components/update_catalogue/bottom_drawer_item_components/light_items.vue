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
                  @change="applyFilters"
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
                  <div
                    v-else
                    style="
                      max-height: 200px;
                      overflow-y: auto;
                      padding-right: 8px;
                    "
                  >
                    <a-checkbox
                      v-for="category in availableCategories"
                      :key="category.id"
                      v-model:checked="filters.selectedCategories[category.id]"
                      @change="applyFilters"
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
                Light Type
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
                  No light types available
                </div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="0">
              <a-collapse v-model:activeKey="lightTypeKey">
                <a-collapse-panel key="1" header="Light Type">
                  <div
                    v-if="loadingFilters"
                    style="text-align: center; padding: 10px"
                  >
                    <a-spin size="small" />
                  </div>
                  <div
                    v-else
                    style="
                      max-height: 200px;
                      overflow-y: auto;
                      padding-right: 8px;
                    "
                  >
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
                      No light types available
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
            max-height: 300px;
            overflow-y: scroll;
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

        <!-- Clear Button -->
        <!-- <a-button block type="primary" @click="clearFilters"
          >Clear Filters</a-button
        > -->
      </a-col>

      <a-col style="margin: 5px 15px" :sm="24" :md="24" :lg="18">
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
            Showing {{ products.length }} of {{ pagination.total_count }} lights
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
              style="padding: 5px"
            >
              <div class="product">
                <div class="product-image-container">
                  <img
                    :src="getProductImage(product)"
                    :alt="product.name"
                    class="product-image"
                  />
                  <!-- Category Badge -->
                  <div class="category-badge">
                    {{ product.light_type || product.furniture_type }}
                  </div>
                  <!-- AR Badge -->
                  <div v-if="product['3d_model']" class="ar-badge">AR</div>
                </div>

                <a-row>
                  <a-col span="24">
                    <b>{{ product.name }}</b>
                  </a-col>

                  <a-col span="18"> Colors </a-col>

                  <a-col
                    span="6"
                    style="display: flex; justify-content: end; gap: 4px"
                  >
                    <div
                      v-for="color in product.colors_available.slice(0, 2)"
                      :key="color.id"
                      style="
                        width: 20px;
                        height: 20px;
                        border-radius: 20px;
                        border: 1px solid #ddd;
                      "
                      :style="{ backgroundColor: color.color }"
                    ></div>
                  </a-col>

                  <a-col span="12"> Price </a-col>

                  <a-col span="12" style="text-align: right">
                    ${{ getPrice(product) }}
                  </a-col>

                  <a-col span="17">
                    <a-button block @click="handleProductDetail(product)"
                      >Product Details</a-button
                    >
                  </a-col>

                  <a-col span="1"></a-col>
                  <a-col span="4">
                    <a-button
                      :type="isWishlisted(product.id) ? 'primary' : 'default'"
                      @click="toggleWishlist(product)"
                    >
                      <HeartOutlined />
                    </a-button>
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
import { HeartOutlined } from "@ant-design/icons-vue";

export default {
  name: "LightsProducts",
  components: {
    HeartOutlined,
  },
  data() {
    return {
      categoryKey: ["1"],
      lightTypeKey: ["1"],
      colourAcitveKey: ["1"],
      products: [],
      wishlisted: new Set(),
      loading: false,
      loadingFilters: false,
      availableColors: [],
      availableCategories: [],
      availableFurnitureTypes: [],
      pagination: {
        current_page: 1,
        page_size: 20,
        total_count: 0,
        total_pages: 1,
      },
      filters: {
        priceRange: [0, 500000],
        selectedCategories: {},
        selectedTypes: {},
        selectedColors: [],
      },
      filterTimeout: null,
    };
  },
  mounted() {
    this.loadFilterOptions();
    this.loadProducts();
  },
  methods: {
    /**
     * Load filter options from API
     */
    async loadFilterOptions() {
      try {
        this.loadingFilters = true;

        const url = `${this.$store.state.root_api}product/api/lights/filter-options/`;

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
        params.append("min_price", this.filters.priceRange[0]);
        params.append("max_price", this.filters.priceRange[1]);

        // Add selected categories
        const selectedCategoryIds = Object.keys(
          this.filters.selectedCategories
        ).filter((id) => this.filters.selectedCategories[id]);

        if (selectedCategoryIds.length > 0) {
          params.append("category_id", selectedCategoryIds.join(","));
        }

        // Add selected furniture types
        const selectedTypes = Object.keys(this.filters.selectedTypes).filter(
          (type) => this.filters.selectedTypes[type]
        );

        if (selectedTypes.length > 0) {
          params.append("furniture_type", selectedTypes.join(","));
        }

        // Add selected colors - send as comma-separated hex codes
        if (this.filters.selectedColors.length > 0) {
          params.append("color", this.filters.selectedColors.join(","));
        }
        let url = "";
        if (this.$route.query.brand) {
          url = `${
            this.$store.state.root_api
          }product/api/load-brand-products/lights/${
            this.$route.query.brand
          }/?${params.toString()}`;
        } else {
          url = `${
            this.$store.state.root_api
          }product/api/lights/?${params.toString()}`;
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

          // Update pagination info from response
          this.pagination.current_page = data.page || 1;
          this.pagination.page_size = data.page_size || 20;
          this.pagination.total_count = data.total_count || 0;
          this.pagination.total_pages = data.total_pages || 1;

          // Scroll to top when page changes
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
    handlePageChange(page) {
      this.pagination.current_page = page;
      this.loadProducts();
    },

    /**
     * Handle page size change
     */
    handlePageSizeChange(pageSize) {
      this.pagination.page_size = pageSize;
      this.pagination.current_page = 1;
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
     * Apply all filters (reset to page 1)
     */
    applyFilters() {
      this.pagination.current_page = 1;
      this.loadProducts();
    },

    /**
     * Clear all filters
     */
    clearFilters() {
      this.filters = {
        priceRange: [0, 500000],
        selectedCategories: {},
        selectedTypes: {},
        selectedColors: [],
      };

      this.availableCategories.forEach((cat) => {
        this.filters.selectedCategories[cat.id] = false;
      });

      this.availableFurnitureTypes.forEach((type) => {
        this.filters.selectedTypes[type.furniture_type] = false;
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
     * Check if product is wishlisted
     */
    isWishlisted(productId) {
      return this.wishlisted.has(productId);
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
    },

    /**
     * Handle product detail click
     */
    handleProductDetail(product) {
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
.main {
  padding: 10px;
  border-radius: 20px;
  background: white;
  border: 2px solid rgba(128, 128, 128, 0.16);
  margin-bottom: 10px;
}
.see-all-section {
  display: flex;
}

.product {
  padding: 10px;
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
