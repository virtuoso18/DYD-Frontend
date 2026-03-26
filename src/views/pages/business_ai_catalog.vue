<template>
  
  
    <!-- Blur Overlay when modal is active -->
    <div 
      v-if="showPlanBlockModal" 
      class="plan-block-overlay"
    >
      <!-- Modal -->
      <div class="plan-block-modal">
        <div class="modal-content">
         <div class="mb-5 flex justify-center">
  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" stroke-width="2">
    <g>
      <circle cx="6" cy="12" r="3" fill="none" class="animate-pulse" style="animation-delay: 0s;"/>
      <circle cx="12" cy="12" r="3" fill="none" class="animate-pulse" style="animation-delay: 0.5s;"/>
      <circle cx="18" cy="12" r="3" fill="none" class="animate-pulse" style="animation-delay: 1s;"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke-dasharray="4 4" class="opacity-50"/>
    </g>
  </svg>
</div>
          <h2>Basic Plan Business</h2>
          <p>This business is belongs to basic plan, that doesn't have access to this mini site store page.</p>
          <!-- <p>Please upgrade to a premium plan to view this content.</p> -->
          
          <div class="modal-actions" >
            <!-- <a-button type="primary" size="large" @click="goToPricing">
              Upgrade Plan
            </a-button> -->
            <a-button  type="primary" size="large" @click="goBack">
              Go Back
            </a-button>
          </div>
        </div>
      </div>
    </div>


   <div v-else class="!p-0  ">
    <a-drawer
      title="Filters"
      placement="bottom"
      :open="isFilterDrawerOpen"
      :height="'70vh'"
      :closable="true"
      @close="closeFilterDrawer"
    >
      <div class="filter-sec">
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

          <!-- Category Filter - Checkboxes -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 13px; font-weight: 600; color: #262626; margin-bottom: 12px; margin-top: 0;">
              Categories ({{ categories.length }})
            </h3>
            <a-spin v-if="categoriesLoading" :spinning="categoriesLoading" />
            <a-checkbox-group 
              v-else
              v-model:value="selectedCategories" 
              style="width: 100%; display: flex; flex-direction: column; gap: 10px"
              @change="handleFilterChange"
            >
              <a-checkbox 
                v-for="cat in categories" 
                :key="cat.slug" 
                :value="cat.slug"
              >
                <span style="font-size: 13px;">{{ cat.name }} ({{ cat.count }})</span>
              </a-checkbox>
            </a-checkbox-group>
          </div>

          <a-divider />

          <!-- Price Range Filter -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 13px; font-weight: 600; color: #262626; margin-bottom: 12px; margin-top: 0;">
              Price Range
            </h3>
            <div style="display: flex; gap: 8px; align-items: center;">
              <a-input-number
                v-model:value="priceRange.min"
                placeholder="Min"
                :min="0"
                style="width: 100%"
                @change="handleFilterChange"
              />
              <span>-</span>
              <a-input-number
                v-model:value="priceRange.max"
                placeholder="Max"
                :min="0"
                style="width: 100%"
                @change="handleFilterChange"
              />
            </div>
          </div>

          <!-- Clear Filters Button -->
          <a-button 
            type="primary"
            danger
            style="width: 100%;" 
            @click="clearFilters"
          >
            Clear All Filters
          </a-button>
            </div>
    </a-drawer>
    <!-- Hero Section -->
   <div style="position: relative; overflow: hidden; height: 350px; width: 100%;">
  <!-- SKELETON -->
  <div
    v-if="!imageLoadedMap.heroBg"
    class="hero-skeleton"
  ></div>

  <!-- PRELOAD BACKGROUND IMAGE (INVISIBLE) -->
  <img
    :src="$store.state.root_media_api + businessProfile?.business_picture || heroBgImage"
    style="position:absolute;width:0;height:0;opacity:0;"
    @load="onHeroImageLoad"
    alt=""
  />

  <!-- REAL HERO SECTION -->
  <div
    v-show="imageLoadedMap.heroBg"
    class="hero-section"
    :style="{
      backgroundImage: `url(${$store.state.root_media_api + businessProfile?.business_picture || heroBgImage})`,
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
    <!-- Dark overlay -->
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.3);"></div>
    
    <!-- Content -->
    <div style="text-align: center; color: white; position: relative; z-index: 1;">
      <h1 style="color: white; font-size: 48px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); margin: 0;">
        {{ businessProfile?.name || 'Business Catalog' }}
      </h1>
      <p style="font-size: 18px; margin-top: 12px;">
        {{ businessProfile?.description || 'Explore our premium collection' }}
      </p>
    </div>
  </div>
</div>


    <!-- Main Container -->
    <a-row class="ai-catalog-container" style="min-height: 100vh; margin: 0; background-color: #f5f5f5;">
      <!-- Sidebar Filters -->
      
       <a-col 
    :xs="0" 
    :sm="0" 
    :md="6" 
    :lg="5" 
    style="
      background: #fff; 
      border-right: 1px solid #f0f0f0; 
      padding: 24px; 
      overflow-y: auto; 
      height: 100vh;
      position: sticky;
      top: 0;
      align-self: flex-start;
    "
  >
        <div style="padding-right: 8px;">
          <div style="display:flex;justify-content: space-between;"> 

            <h1 style="font-size: 24px; font-weight: 700; color: #000; margin-bottom: 24px; margin-top: 0;">Filters</h1>
            <!-- <router-link :to="'/start-new-catalogue'"> -->
              
        
      <!-- </router-link> -->
            
          </div>
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

          <!-- Category Filter - Checkboxes -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 13px; font-weight: 600; color: #262626; margin-bottom: 12px; margin-top: 0;">
              Categories ({{ categories.length }})
            </h3>
            <a-spin v-if="categoriesLoading" :spinning="categoriesLoading" />
            <a-checkbox-group 
              v-else
              v-model:value="selectedCategories" 
              style="width: 100%; display: flex; flex-direction: column; gap: 10px"
              @change="handleFilterChange"
            >
              <a-checkbox 
                v-for="cat in categories" 
                :key="cat.slug" 
                :value="cat.slug"
              >
                <span style="font-size: 13px;">{{ cat.name }} ({{ cat.count }})</span>
              </a-checkbox>
            </a-checkbox-group>
          </div>

          <a-divider />

          <!-- Price Range Filter -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 13px; font-weight: 600; color: #262626; margin-bottom: 12px; margin-top: 0;">
              Price Range
            </h3>
            <div style="display: flex; gap: 8px; align-items: center;">
              <a-input-number
                v-model:value="priceRange.min"
                placeholder="Min"
                :min="0"
                style="width: 100%"
                @change="handleFilterChange"
              />
              <span>-</span>
              <a-input-number
                v-model:value="priceRange.max"
                placeholder="Max"
                :min="0"
                style="width: 100%"
                @change="handleFilterChange"
              />
            </div>
          </div>

          <!-- Clear Filters Button -->
          <a-button 
            type="primary"
            danger
            style="width: 100%;" 
            @click="clearFilters"
          >
            Clear All Filters
          </a-button>
          
        </div>
      </a-col>
      <a-col :xs="24" 
    :sm="24" 
    :md="0" 
    :lg="0" >

      </a-col>

      <!-- Main Content Area -->
      <a-col :xs="24" :sm="24" :md="18" :lg="19" style="padding: 0; min-height: 100vh;">
        <div style="padding: 5px; background-color: #f5f5f5;">
          <!-- Header with Search & Info -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 32px; flex-wrap: wrap;">
            <div class="w-full">
              <div class="!flex  !justify-between">
              <h2 style="font-size: 20px; font-weight: 700; color: #000; margin: 0;">AI Catalog</h2> 
              <div class="!flex gap-3">
<a-button  @click="this.$router.push({
      name: 'new_catelogue',
      query: {
        brand: this.$route.params.business_slug,
      }
    })" size="medium" type="primary"  style="display: flex;justify-content: center; align-items: center;">
          <template #icon>
            <FormatPainterOutlined style="font-size:16px"/>
          </template>Start Simulation
        </a-button>
        <a-row>

          <a-col :sm="24" :xs="24" :md="0" :lg="0">
            
            <a-button size="medium" @click="openFilterDrawer" >
              <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                <path d="M21.6309 14.75C21.6309 15.64 21.3909 16.48 20.9509 17.2C20.1309 18.57 18.6209 19.5 16.8809 19.5C15.9409 19.5 15.0609 19.22 14.3209 18.73C13.7009 18.35 13.1909 17.82 12.8209 17.2C12.3809 16.48 12.1309 15.64 12.1309 14.75C12.1309 12.13 14.2609 10 16.8809 10C17.2409 10 17.5908 10.04 17.9208 10.12C20.0508 10.59 21.6309 12.49 21.6309 14.75Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.0293 14.7501L16.1993 15.9201L18.7292 13.5801" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path opacity="0.4" d="M20.6906 4.01999V6.23999C20.6906 7.04999 20.1805 8.06001 19.6805 8.57001L17.9205 10.12C17.5905 10.04 17.2406 10 16.8806 10C14.2606 10 12.1306 12.13 12.1306 14.75C12.1306 15.64 12.3806 16.48 12.8206 17.2C13.1906 17.82 13.7006 18.35 14.3206 18.73V19.07C14.3206 19.68 13.9205 20.49 13.4105 20.79L12.0005 21.7C10.6905 22.51 8.87054 21.6 8.87054 19.98V14.63C8.87054 13.92 8.46055 13.01 8.06055 12.51L4.22052 8.47C3.72052 7.96 3.31055 7.05001 3.31055 6.45001V4.12C3.31055 2.91 4.22057 2 5.33057 2H18.6705C19.7805 2 20.6906 2.90999 20.6906 4.01999Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              
            </a-button>
          </a-col>
          
        </a-row>
              </div>
              
        </div>
              <p style="color: #8a8a8a; margin: 8px 0 0 0;">
                Total: {{ pagination.total_items }} items
              </p>
            </div>
                

            <a-input
              v-model:value="searchQuery"
              placeholder="Search products..."
              allow-clear
               class="w-full sm:!w-[300px]"
              :loading="productsLoading"
              @input="handleSearch"
              @clear="handleSearch"
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
                <div class="product">
                 <div class="product-image-container" style="position: relative; overflow: hidden;">
  <!-- SKELETON -->
  <div
    v-if="!imageLoadedMap[product.id]"
    class="product-card-skeleton"
  ></div>

  <!-- PRELOAD (INVISIBLE) -->
  <img
    :src="$store.state.root_media_api + product.image"
    style="position:absolute;width:0;height:0;opacity:0;"
    @load="onProductImageLoad(product.id)"
    alt=""
  />

  <!-- REAL IMAGE -->
  <img
    v-show="imageLoadedMap[product.id]"
    :src="$store.state.root_media_api + product.image"
    :alt="product.name"
    class="product-image"
  />

  <!-- BADGES (stay on top with z-index) -->
  <div class="category-badge">{{ product.category_name || product.category }}</div>
  <div class="ar-badge">AR</div>
</div>


                  <a-row>
                    <a-col :span="24" style="padding-top: 10px">
                      <b>{{
                        truncateText(
                          product.name || "No title available",
                          22
                        )
                      }}</b>
                    </a-col>

                    <a-col :span="18"> Colors </a-col>

                    <a-col
                      span="6"
                      style="display: flex; justify-content: end; gap: 4px"
                    >
                      <div
                        v-for="(c, i) in product.colors_available.slice(0, 2)"
                        :key="i"
                        style="width: 20px; height: 20px; border-radius: 20px"
                        :style="{ background: c.color || c.color_hex }"
                      ></div>
                    </a-col>

                    <a-col span="12"> Price </a-col>

                    <a-col span="12" style="text-align: end">
                      <b>${{ product.price }}</b>
                    </a-col>
                    <a-col :span="24"><br></br></a-col>
                    <a-col span="20">
                      <a-button block @click="goto_product_Route(product)"
                        >Product Details</a-button
                      >
                    </a-col>

                    <!-- <a-col span="4" style="display:flex;justify-content: end;">
                      <a-button shape="circle" size="medium" style="display:flex;justify-content: center;align-items: center;">
                        <HeartOutlined style="font-size:18px" />
                      </a-button>
                    </a-col> -->
                    <a-col span="4" style="display:flex;justify-content: end;">
                      <a-button @click="toggleFavorite(product.product_id, product.type, product)" shape="circle" size="medium" style="display:flex;justify-content: center;align-items: center;" >
                      <template v-if="product.is_liked">
                        <HeartFilled style="color: red" />
                      </template>
                      <template v-else shape="circle" size="medium" style="display:flex;justify-content: center;align-items: center;">
                        <HeartOutlined />
                      </template>
                    </a-button>
                    </a-col>

                  </a-row>
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
import { HeartOutlined, HeartFilled,FormatPainterOutlined } from '@ant-design/icons-vue';
import heroBgImage from '@/assets/profesional-user-ai-catalog.jpg';

export default {
  name: 'business_catalog',
  components: {
    HeartOutlined,
    HeartFilled,
    FormatPainterOutlined
  },
  data() {
    return {
      showPlanBlockModal: false,
      isFilterDrawerOpen: false,
      heroBgImage,
      imageLoadedMap: {},
      imageLoadedMap: {
      heroBg: false, // ⬅️ ADD THIS
    },
      businessProfile: null,
      categories: [],
      products: [],
      favorites: [],
      
      // Filters
      selectedType: '',
      selectedCategories: [],
      priceRange: {
        min: null,
        max: null
      },
      searchQuery: '',
      
      // Pagination
      currentPage: 1,
      pagination: {
        current_page: 1,
        total_pages: 0,
        total_items: 0,
        per_page: 20,
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
    await this.loadBrandPurchasedPlanDetails();
      if (this.showPlanBlockModal===false){
        await this.loadBusinessProfile();
        await this.loadCategories();
        await this.loadProducts();
      }
  },
  methods: {
    
  goBack() {
    this.$router.go(-1);
  },

async loadBrandPurchasedPlanDetails() {
  try {
    // ✅ This file correctly uses route params — keep this
    const brandSlug = this.$route.params.business_slug;

    if (!brandSlug) {
      console.warn('⚠️ No brand slug found in route params');
      return;
    }

    const url = `${this.$store.state.root_api}subscription/api/get-business-plan-details/${brandSlug}/`;
    // const token = localStorage.getItem('token');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();

    console.log('📦 Plan Details Result:', result);
    console.log('🏷️ plan_name:', result.data?.plan_name);  // ✅ result.data

    // ✅ result.data.plan_name — NOT result.plan_name
    if (result.success && result.data) {
      const currentPlanName = result.data?.plan_name || 'unknown';
      this.business_available_actions = result.data; // ✅ result.data — NOT result.business_available_actions

      const planName = currentPlanName.toLowerCase();
      console.log("=========================");
      console.log(planName);
      if (planName==='basic') {
        console.log('✅ ACCESS GRANTED - Plan:', currentPlanName);
        this.showPlanBlockModal = true;
      } else {
        console.log('❌ BLOCKING ACCESS - Basic plan detected');
        this.showPlanBlockModal = false;
      }
    } else {
      // API returned but no data — don't block, allow access
      console.warn('⚠️ No plan data returned');
      this.showPlanBlockModal = false;
    }

  } catch (error) {
    console.error('❌ Error loading plan details:', error);
    // ✅ On error — do NOT block the whole page
    // Fail open — let user see the store
    this.showPlanBlockModal = false;
  }
},

   openFilterDrawer() {
      this.isFilterDrawerOpen = true
    },

    closeFilterDrawer() {
      this.isFilterDrawerOpen = false
    },
    truncateText(text, charLimit = 7) {
      if (!text) return '';
      if (text.length <= charLimit) return text;
      return text.slice(0, charLimit) + '...';
    },
    goto_product_Route(product) {
      this.$router.push({
        name: 'buisness_product',
        params: {
          buisness_name: this.$route.params.business_slug,
          product_type: product.type,
          product_id: product.id
        }
      });
    },

     onProductImageLoad(id) {
    this.imageLoadedMap[id] = false;
    setTimeout(() => {
      this.imageLoadedMap[id] = true;
    }, 1000); // 1s shimmer
  },

   onHeroImageLoad() {
    this.imageLoadedMap.heroBg = false;
    setTimeout(() => {
      this.imageLoadedMap.heroBg = true;
    }, 1000); // 1s shimmer
  },


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
          // Deduplicate categories by slug
          const uniqueCategories = Array.from(
            new Map(data.data.map(cat => [cat.slug, cat])).values()
          );
          this.categories = uniqueCategories;
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
        
        // Add multiple categories
        this.selectedCategories.forEach(cat => {
          params.append('categories', cat);
        });
        
        if (this.searchQuery) params.append('search', this.searchQuery);
        
        // Add price range
        if (this.priceRange.min !== null && this.priceRange.min !== undefined) {
          params.append('price_min', this.priceRange.min);
        }
        if (this.priceRange.max !== null && this.priceRange.max !== undefined) {
          params.append('price_max', this.priceRange.max);
        }

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
      this.selectedCategories = [];
      this.priceRange = { min: null, max: null };
      this.searchQuery = '';
      this.currentPage = 1;
      this.loadProducts();
    },

      async toggleFavorite(product_id, product_type, product) {
      try {
        const token = localStorage.getItem('token');
        
        // Check if user is authenticated
        if (!token) {
          this.$message.warning('Please login to add favorites');
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
              id: product.id,
              type: product_type,
            }),
          }
        );
        
        const data = await response.json();

        // Update the product's favorite status
        product.is_liked = data.favorited;
        
        // Show success message
        const message = data.favorited ? 'Added to favorites' : 'Removed from favorites';
        this.$message.success(message);

      } catch (error) {
        console.error("Favorite toggle failed", error);
        this.$message.error('Failed to update favorite');
      }
    }
  },
};
</script>

<style scoped>

.post-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0px;
  border-radius: 12px;
  background: white;
  /* transition: all 0.3s ease; */
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* transform: translateY(-2px); */
}

/* Fixed tags overlay positioning */
.tags-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 70%;
  z-index: 2;
}

.view-count-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  z-index: 2;
}

/* ✅ ADD THESE STYLES */
.plan-block-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(252, 250, 250, 0.436);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.plan-block-modal {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rotate-prohibited {
  animation: slowSpin 4s linear infinite;
}

@keyframes slowSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.plan-block-modal h2 {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 16px;
}

.plan-block-modal p {
  font-size: 16px;
  color: #595959;
  line-height: 1.6;
  margin-bottom: 12px;
}

.plan-block-modal p strong {
  color: #ff4d4f;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.modal-actions .ant-btn {
  min-width: 140px;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
}

.content-blurred {
  filter: blur(8px);
  pointer-events: none;
  user-select: none;
}

@media (max-width: 768px) {
  .plan-block-modal {
    padding: 30px 20px;
  }
  
  .plan-block-modal h2 {
    font-size: 22px;
  }
  
  .plan-block-modal p {
    font-size: 14px;
  }
  
  .modal-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .modal-actions .ant-btn {
    width: 100%;
  }
}


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

.head-section {
  display: flex;
  justify-content: space-between;
}

.product {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #ffffff;
}


.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-card-skeleton {
  width: 100%;
  height: 240px; /* match your product-image height */
  border-radius: 12px;
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: product-shimmer 1.6s infinite linear;
}

@keyframes product-shimmer {
  to {
    background-position-x: -200%;
  }
}

/* ENSURE BADGES STAY ON TOP */
.category-badge,
.ar-badge {
  position: absolute;
  z-index: 20;
}

.hero-skeleton {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: hero-shimmer 1.6s infinite linear;
}

@keyframes hero-shimmer {
  to {
    background-position-x: -200%;
  }
}



.products-list {
  padding-bottom: 20px;
}

.product-image-container {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  height: 230px;
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

@media (min-width: 576px) { .product-responsive { width: 50%; flex: 0 0 50%; } }
@media (min-width: 768px) { .product-responsive { width: 33.333%; flex: 0 0 33.333%; } }
@media (min-width: 992px) { .product-responsive { width: 25%; flex: 0 0 25%; } }
@media (min-width: 1200px) { .product-responsive { width: 20%; flex: 0 0 20%; } }
</style>