<template>
<div class="pt-wrapper">

    <div class="ai-catalog-section !mx-1 ">
      <!-- Fixed Header -->
      <!-- <div class="ai-catalog-header py-3">
        <span class="!text-gray-700"  style="
            font-family: Poppins;
            font-weight: 500;
            font-style: normal;
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 0;
          ">AI Catalog</span>
        <a-button size='small' type="default" class="see-all-link" @click="seeAllClicked">See all</a-button>
      </div> -->
  
      <div class="ai-catalog-header  ">
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
          <!-- {{ brand_data }} -->
            <!-- <b>  {{truncateChars(brand_data.name,limit=15)}}</b> -->
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
          <button @click="showGrid = false" class="filter-btn" :class="{ active: !showGrid }">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 10H15M2.5 5H17.5M7.5 15H12.5" stroke="#666" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
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
  
      <!-- Scrollable Content Area -->
      <div class="scrollable-content">
        <!-- Loading initial -->
        <div v-if="loading && catalogItems.length === 0" class="loading">
          <a-spin />
        </div>
  
        <!-- Product Grid/List -->
        <div v-if="!loading || catalogItems.length > 0" class="product-container" :class="{ 'grid-view': showGrid, 'list-view': !showGrid }">
          <div v-for="(item, index) in catalogItems" :key="index" @click="updateItemRendering(item['id'],item['3d_model'],item['dimensions']['width'],item['dimensions']['height'],item['dimensions']['depth'])" style="
   background: #f2f2f2;
  border: none;
  border-radius: 4px;
  padding:5px;"
            :style="selected_item===item.id ? 'border:1px solid blue': ''">
            
            <div class="product-item">
              <div class="product-image" style="position:relative;">
                <img :src="this.$store.state.root_media_api + item.primary_image"
                     :alt="item.name" />
  
                <!-- Tags -->
                <div style="
                     position:absolute;
                     top:10px;
                     left:0;
                     right:0;
                     display:flex;
                     justify-content:space-between;
                     padding:0 10px;
                     pointer-events:none;
                ">
                  <div style="
                       background-color:#f2f2f2;
                       color:black;
                       border-radius:6px;
                       padding:2px 8px;
                       font-size:12px;
                       height:22px;
                       display:flex;
                       align-items:center;
                  ">
                    {{ item.category.name }}
                  </div>
  
                  <div style="
                       background-color:#f2f2f2;
                       border-radius:6px;
                       font-size:12px;
                       height:22px;
                       display:flex;
                       align-items:center;
                  ">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.8307 2.5H9.16406C5.62853 2.5 3.86076 2.5 2.76241 3.59835C1.66406 4.6967 1.66406 6.46447 1.66406 10C1.66406 13.5355 1.66406 15.3033 2.76241 16.4017C3.86076 17.5 5.62853 17.5 9.16406 17.5H10.8307C14.3662 17.5 16.1341 17.5 17.2324 16.4017C18.3307 15.3033 18.3307 13.5355 18.3307 10C18.3307 6.46447 18.3307 4.6967 17.2324 3.59835C16.1341 2.5 14.3662 2.5 10.8307 2.5Z" stroke="#666666" stroke-linecap="round"/>
                      <path d="M5 11.6667L6.4622 8.40642C6.73323 7.80215 6.86874 7.5 7.08333 7.5C7.29792 7.5 7.43344 7.80215 7.70447 8.40642L9.16667 11.6667M11.6667 11.6667V10M11.6667 10V8.5C11.6667 8.02859 11.6667 7.79289 11.8131 7.64645C11.9596 7.5 12.1952 7.5 12.6667 7.5H13.75C14.4403 7.5 15 8.05964 15 8.75C15 9.44033 14.4403 10 13.75 10M11.6667 10H13.75M13.75 10L14.5833 11.6667" stroke="#666666" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
  
              <div class="product-info">
<div class="product-name truncate">
  {{ truncateText(item.name || 'No Name available', 2) }}
</div>
                <div class="product-details" style="display:flex;justify-content: space-between;">
                  <span class="product-color">Colors </span>
                  <div style="display: flex; gap: 4px; align-items: center; margin-left: 8px;">
                    <div v-for="color in item.colors_available.slice(0, 2)" :key="color.id" class="color-dot" :style="{ backgroundColor: color.color }"></div>
                  </div>
                </div>
                
                <div class="product-price">Price <span style="font-weight: 600;">${{item.pricing.price}}</span></div>
              </div>
            </div>
  
           <a-row>
                <a-col :span="18" style="padding-right:5px">
                  <a-button block type="default" @click="this.$router.push('/'+item.business_slug+'/'+'product'+'/'+item.id)"  style="border: none;">
                    Product Detail
                  </a-button>
                </a-col>
                <a-col :span="6" style="">
                  <a-button block type="default" style="padding:0;display: flex;justify-content: center;align-items: center;border: none;" @click.stop="toggleLike(item.id, index)">
                    <HeartFilled v-if="item.is_liked" style="color: red;" />
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
  
      <!-- Fixed Apply Button -->
  <div class="apply-section hidden md:block">
        <a-button type="primary" size="large" block  @click="$emit('trigger-render-3d-object')">
          Apply
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { HeartFilled, HeartOutlined } from '@ant-design/icons-vue';

export default {
  name: 'AiCatalog',
  
  props:{
    brand_data:Object
  },
  data() {
    return {
      searchText: '',
      selected_item: '',
      loading: false,
      loadingMore: false,
      error: null,
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
      productItems: []
    };
  },
  components: {
    HeartFilled,
    HeartOutlined
  },
  mounted() {
    const route = this.$route;
    this.brand = route.query.brand;

    if (this.brand) {
      console.log('Loading catalogue for brand:', this.brand);
      this.fetchCatalogItems(this.brand, 1);
    } else {
      console.log('Loading self products');
      this.fetchCatalogItems(null, 1);
    }
  },
  methods: {
      truncateChars(text, limit = 11) {
  if (!text) return ''
  return text.length > limit
    ? text.slice(0, limit) + '...'
    : text
},
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

        // Add pagination parameters
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}page=${page}&page_size=${this.pageSize}`;

        // Add search parameter if exists
        if (this.searchText) {
          url += `&search=${encodeURIComponent(this.searchText)}`;
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
            // Append new items to existing list
            this.catalogItems = [...this.catalogItems, ...data.data];
          } else {
            // Replace with new items
            this.catalogItems = data.data;
          }

          // Update pagination info
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
      // Debounce search to avoid too many API calls
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
      this.$emit('products-see-all', true);
    },

    updateItemRendering(model_id, model_url, width, height, depth) {
      this.selected_item = model_id;
      this.$emit('change-3d-model', {
        'model_uuid': model_id,
        'model_url': model_url,
        'width': width,
        'height': height,
        'depth': depth
      });
    },
    async toggleLike(itemId, itemIndex) {
    try {
      const token = localStorage.getItem('token');
      
      // Check if user is authenticated
      if (!token) {
        this.$message.warning('Please login to add favorites');
        return;
      }

      // Add to toggling set
     

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
            type: 'product', // Change type to 'product'
          }),
        }
      );

      const data = await response.json();

      // Update the item's like status
      this.catalogItems[itemIndex].is_liked = data.favorited;
      
      // Show success message
      const message = data.favorited ? 'Added to favorites' : 'Removed from favorites';
      this.$message.success(message);

    } catch (error) {
      console.error("Like toggle failed", error);
      this.$message.error('Failed to update favorite');
    } 
  }
  }
};
</script>

<style scoped>


/* only below 440px */
@media (max-width: 780px) {
  /* .pt-wrapper {
    padding-top: 3.5rem;
  } */
}

.ai-catalog-section {
  display: flex;
  flex-direction: column;
  height: 77vh; 
}

.ai-catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

/* only below 400px */
@media (max-width: 400px) {
  .ai-catalog-header {
    padding-top: 26px;
  }
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

.scrollable-content {
  flex: 1;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
}

@media (min-width:768px) {

  .scrollable-content {
     overflow-y: auto;
  }
  
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

.filter-btn {
  padding: 3px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-btn.active {
  background: #3B63FB;
  border-color: #3B63FB;
}

.filter-btn.active svg path,
.filter-btn.active svg rect {
  stroke: white;
}

.product-item {
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 5px;
}

.product-item:hover {
  /* box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); */
  /* transform: translateY(-2px); */
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

.list-view .product-subtitle {
  font-size: 13px;
  color: #8c8c8c;
  font-weight: 400;
}

.list-view .product-details {
  display: flex;
  align-items: center;
  gap: 8px;
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

.list-view .product-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff4d4f;
  color: white;
  font-size: 10px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
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

.grid-view .product-subtitle {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 400;
  text-align: left;
}

.grid-view .product-details {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-start;
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

.grid-view .product-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff4d4f;
  color: white;
  font-size: 9px;
  font-weight: 500;
  padding: 3px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}

.apply-section {
  flex-shrink: 0;
  padding-top: 8px;
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

.btn-prod-details {
  background-color: #f3f3f2;
  width: 100%;
  border: none;
  color: black;
  border-radius: 5px;
  padding: 2px;
  color: grey;
}

.btn-prod-details:hover {
  background-color: #f2f2f2;
}
</style>