<template>
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
        
        <div v-for="(item, index) in catalogItems" :key="index" style="
background: #f2f2f2;
border: none;
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

  <!-- Visible image -->
  <img
    v-show="imageLoadedMap[item.id]"
    :src="$store.state.root_media_api + item.texture_image"
    :alt="item.title"
    class="texture-image"
  />
</div>

            <div class="product-info">
              <div style="display:flex;justify-content: space-between;" class="">
                <div style="background-color: grey;color :white;border-radius:5px;padding-left:5px;padding-right:5px;padding-top:1px;height:22px;font-size:12px">
                  Floor
                </div>
                <div class="!text-gray-700" style="padding:3px;border:1px solid grey;border-radius:5px;padding-left:5px;padding-right:5px;padding-top:1px;height:22px;font-size:12px">AR</div>
              </div>
              <div class="product-name">{{ truncateText( item.title || 'No description available', 3) }}</div>
              
              <div class="product-details" style="display:flex;justify-content: space-between;">
                <span class="product-color">Colors </span>
                <div style="display: flex; gap: 4px; align-items: center; margin-left: 8px;">
                  <div v-for="color in item.colors_available.slice(0, 3)" :key="color.id" class="color-dot" :style="{ backgroundColor: color.color_hex }"></div>
                </div>
              </div>
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
      selected_texture: '',
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
      likeTogglingIds: new Set(), // Track items being toggled
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

 onTextureImageLoad(id) {
    this.imageLoadedMap[id] = false;
    setTimeout(() => {
      this.imageLoadedMap[id] = true;
    }, 1000);
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
      this.$emit('floor-see-all', true);
    },

    selectTexture(uuid) {
      console.log(uuid);
      this.selected_texture = uuid;
    },

    updateItemRendering() {
      this.$emit('texture-selected', this.selected_texture);
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

        // Update the item's like status
        this.catalogItems[itemIndex].is_liked = data.favorited;
        
        // Show success message
        const message = data.favorited ? 'Added to favorites' : 'Removed from favorites';
        this.$message.success(message);

      } catch (error) {
        console.error("Like toggle failed", error);
        this.$message.error('Failed to update favorite');
      } finally {
        // Remove from toggling set
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
  height: 200px; /* adjust to match your product-image height */
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
  height: 200px; /* match skeleton height */
  object-fit: cover;
  border-radius: 8px;
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
  padding-bottom: 20px;}
 
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
</style>