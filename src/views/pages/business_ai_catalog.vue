<template>
  <div>
    <!-- Hero Section -->
    <div 
      class="hero-section"
      :style="{
        backgroundImage: `url(${this.$store.state.root_media_api+businessProfile?.business_picture || heroBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        height: '350px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }"
    >
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.3);"></div>
      <div style="text-align: center; color: white; position: relative; z-index: 1;">
        <h1 style="color: white; font-size: 48px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); margin: 0;">
          {{ businessProfile?.name || 'Business Catalog' }}
        </h1>
        <p style="font-size: 18px; margin-top: 12px;">
          {{ businessProfile?.description || 'Explore our premium collection' }}
        </p>
      </div>
    </div>

    <!-- Main Container -->
    <a-row class="ai-catalog-container" style="min-height: 100vh; margin: 0; background-color: #f5f5f5;">
      <!-- Sidebar Filters -->
      <a-col :xs="0" :sm="0" :md="6" :lg="5" style="background: #fff; border-right: 1px solid #f0f0f0; padding: 24px; overflow-y: auto; max-height: 100vh;">
        <div style="padding-right: 8px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #000; margin-bottom: 24px; margin-top: 0;">Filters</h1>

          <!-- Product Type Filter -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 13px; font-weight: 600; color: #262626; margin-bottom: 8px; margin-top: 0;">Product Type</h3>
            <a-select
              v-model:value="selectedType"
              placeholder="All Types"
              style="width: 100%"
              @change="handleFilterChange"
            >
              <a-select-option value="">All Types</a-select-option>
              <a-select-option value="product">Furniture</a-select-option>
              <a-select-option value="wall">Wall Textures</a-select-option>
              <a-select-option value="floor">Floor Textures</a-select-option>
            </a-select>
          </div>

          <!-- Category Filter -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 13px; font-weight: 600; color: #262626; margin-bottom: 8px; margin-top: 0;">
              Category ({{ categories.length }})
            </h3>
            <a-select
              v-model:value="selectedCategory"
              placeholder="All Categories"
              style="width: 100%"
              :loading="categoriesLoading"
              @change="handleFilterChange"
            >
              <a-select-option value="">All Categories</a-select-option>
              <a-select-option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
                {{ cat.name }} ({{ cat.count }})
              </a-select-option>
            </a-select>
          </div>

          <a-divider />

          <!-- Price Range Filter (Future) -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 13px; font-weight: 600; color: #262626; margin-bottom: 12px; margin-top: 0;">
              Stock Status
            </h3>
            <a-checkbox-group v-model:value="stockFilters" style="width: 100%; display: flex; flex-direction: column; gap: 8px">
              <a-checkbox value="in_stock">In Stock</a-checkbox>
              <a-checkbox value="on_sale">On Sale</a-checkbox>
            </a-checkbox-group>
          </div>

          <!-- Clear Filters Button -->
          <a-button 
            type="default" 
            style="width: 100%;" 
            @click="clearFilters"
          >
            Clear All Filters
          </a-button>
        </div>
      </a-col>

      <!-- Main Content Area -->
      <a-col :xs="24" :sm="24" :md="18" :lg="19" style="padding: 0;  min-height: 100vh;">
        <div style="padding: 24px; background-color: #f5f5f5;">
          <!-- Header with Search & Info -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 32px; flex-wrap: wrap;">
            <div>
              <h2 style="font-size: 28px; font-weight: 700; color: #000; margin: 0;">Products</h2>
              <p style="color: #8a8a8a; margin: 8px 0 0 0;">
                Total: {{ pagination.total_items }} items
              </p>
            </div>
            <a-input-search
              v-model:value="searchQuery"
              placeholder="Search products..."
              allow-clear
              style="width: 300px"
              :loading="productsLoading"
              @search="handleSearch"
            />
          </div>

          <!-- Loading State -->
          <a-spin v-if="productsLoading" tip="Loading products..." style="display: flex; justify-content: center; padding: 48px;">
          </a-spin>

          <!-- Products Grid -->
          <div v-else>
            <a-row :gutter="[24, 24]" style="margin: 0;">
              <a-col
                v-for="product in products"
                :key="`${product.type}-${product.id}`"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
              >
              <!-- {{product}} -->
                <div
                  style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); transition: all 0.3s ease; background: #fff; cursor: pointer; height: 100%;"
                  @mouseenter="$event.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)'"
                  @mouseleave="$event.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)'"
                >
                  <!-- Product Image -->
                  <div style="position: relative; width: 100%; height: 200px; background: linear-gradient(135deg, #8b6239 0%, #5c3d1f 100%); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <img 
                      v-if="product.image" 
                      :src="this.$store.state.root_media_api+product.image" 
                      style="width: 100%; height: 100%; object-fit: cover;"
                      :alt="product.name"
                    />
                    <div v-else style="color: rgba(255,255,255,0.5); font-size: 12px;">No image</div>
                    
                    <!-- Badges -->
                    <span 
                      v-if="product.type === 'product'"
                      style="position: absolute; top: 12px; left: 12px; background: #fff; color: #262626; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600; z-index: 2;"
                    >
                      {{ product.furniture_type || product.type }}
                    </span>
                    <span 
                      v-else
                      style="position: absolute; top: 12px; left: 12px; background: #fff; color: #262626; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600; z-index: 2;"
                    >
                      {{ product.style || product.type }}
                    </span>

                    <!-- Sale Badge -->
                    <span 
                      v-if="product.is_on_sale"
                      style="position: absolute; top: 12px; right: 12px; background: #ff4d4f; color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; z-index: 2;"
                    >
                      SALE
                    </span>

                    <!-- Stock Badge -->
                    <span 
                      v-if="!product.is_in_stock"
                      style="position: absolute; bottom: 12px; left: 12px; background: rgba(0,0,0,0.6); color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600; z-index: 2;"
                    >
                      Out of Stock
                    </span>
                  </div>

                  <!-- Product Details -->
                  <div style="padding: 16px;">
                    <h4 style="font-size: 14px; font-weight: 600; color: #262626; margin: 0 0 8px 0; line-height: 1.4;">
                      {{ product.name }}
                    </h4>
                    
                    <!-- Category & Brand -->
                    <p style="font-size: 11px; color: #8a8a8a; margin: 0 0 8px 0;">
                      {{ product.category }}
                      <span v-if="product.brand">• {{ product.brand }}</span>
                    </p>

                    <!-- Price -->
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                      <span style="font-size: 14px; font-weight: 700; color: #0066cc;">
                        ${{ product.price.toFixed(2) }}
                      </span>
                      <span 
                        v-if="product.sale_price && product.is_on_sale"
                        style="font-size: 12px; color: #8a8a8a; text-decoration: line-through;"
                      >
                        ${{ product.sale_price.toFixed(2) }}
                      </span>
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: flex; gap: 8px;">
                      <a-button type="default" style="flex: 1; height: 32px;">
                        Details
                      </a-button>
                      <a-button
                        :type="favorites.includes(product.id) ? 'primary' : 'default'"
                        danger
                        @click="toggleFavorite(product.id)"
                        style="height: 32px; width: 40px;"
                      >
                        <HeartOutlined v-if="!favorites.includes(product.id)" />
                        <HeartFilled v-else />
                      </a-button>
                    </div>
                  </div>
                </div>
              </a-col>
            </a-row>

            <!-- Empty State -->
            <a-empty 
              v-if="products.length === 0 && !productsLoading" 
              description="No products found" 
              style="margin-top: 48px"
            />

            <!-- Pagination -->
            <div v-if="products.length > 0 && pagination.total_pages > 1" style="display: flex; justify-content: center; margin-top: 48px; padding-bottom: 24px;">
              <a-pagination
                v-model:current="currentPage"
                :total="pagination.total_items"
                :page-size="pagination.per_page"
                :show-total="(total, range) => `${range[0]}-${range[1]} of ${total}`"
                @change="handlePageChange"
              />
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { HeartOutlined, HeartFilled } from '@ant-design/icons-vue';
import heroBgImage from '@/assets/profesional-user-ai-catalog.jpg';

export default {
  name: 'business_catalog',
  components: {
    HeartOutlined,
    HeartFilled,
  },
  data() {
    return {
      heroBgImage,
      businessProfile: null,
      categories: [],
      products: [],
      favorites: [],
      
      // Filters
      selectedType: '',
      selectedCategory: '',
      stockFilters: [],
      searchQuery: '',
      
      // Pagination
      currentPage: 1,
      pagination: {
        current_page: 1,
        total_pages: 0,
        total_items: 0,
        per_page: 12,
        has_next: false,
        has_previous: false
      },
      
      // Loading states
      productsLoading: false,
      categoriesLoading: false,
    };
  },
  computed: {
    businessSlug() {
      return this.$route.params.business_slug;
    }
  },
  watch: {
    currentPage(newPage) {
      this.fetchProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  async mounted() {
    await this.loadBusinessProfile();
    await this.loadCategories();
    await this.loadProducts();
  },
  methods: {
    async loadBusinessProfile() {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}Auth/api/business/${this.businessSlug}/profile/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to load profile');
        
        const data = await response.json();
        if (data.success) {
          this.businessProfile = data.data;
        }
      } catch (error) {
        console.error('Error loading business profile:', error);
        this.$message.error('Failed to load business profile');
      }
    },

    async loadCategories() {
      this.categoriesLoading = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}Auth/api/business/${this.businessSlug}/categories/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to load categories');
        
        const data = await response.json();
        if (data.success) {
          this.categories = data.data;
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        this.$message.error('Failed to load categories');
      } finally {
        this.categoriesLoading = false;
      }
    },

    async fetchProducts() {
      this.productsLoading = true;
      try {
        const params = new URLSearchParams({
          page: this.currentPage,
          per_page: this.pagination.per_page,
        });

        if (this.selectedType) params.append('type', this.selectedType);
        if (this.selectedCategory) params.append('category', this.selectedCategory);
        if (this.searchQuery) params.append('search', this.searchQuery);

        const response = await fetch(
          `${this.$store.state.root_api}Auth/api/business/${this.businessSlug}/products/?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to load products');
        
        const data = await response.json();
        if (data.success) {
          this.products = data.data;
          this.pagination = data.pagination;
        }
      } catch (error) {
        console.error('Error loading products:', error);
        this.$message.error('Failed to load products');
      } finally {
        this.productsLoading = false;
      }
    },

    async loadProducts() {
      this.currentPage = 1;
      await this.fetchProducts();
    },

    async handleFilterChange() {
      this.currentPage = 1;
      await this.fetchProducts();
    },

    async handleSearch() {
      this.currentPage = 1;
      await this.fetchProducts();
    },

    async handlePageChange(page) {
      this.currentPage = page;
    },

    clearFilters() {
      this.selectedType = '';
      this.selectedCategory = '';
      this.stockFilters = [];
      this.searchQuery = '';
      this.currentPage = 1;
      this.loadProducts();
    },

    toggleFavorite(id) {
      const index = this.favorites.indexOf(id);
      if (index > -1) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(id);
      }
    },
  },
};
</script>

<style scoped>
.ai-catalog-container {
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 32px !important;
  }
  
  .hero-section p {
    font-size: 14px !important;
  }
}
</style>