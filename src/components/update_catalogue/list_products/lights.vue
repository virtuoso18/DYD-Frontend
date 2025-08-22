<template>
  <div class="ai-catalog-section">
    <!-- Fixed Header -->
    <div class="ai-catalog-header">
      <span>AI Catalog</span>
      <a-button size='small' type="text" class="see-all-link" @click="seeAllClicked">See all</a-button>
    </div>
    
    <!-- Fixed Search Bar -->
    <div class="search-section">
      <a-input 
        v-model:value="searchText" 
        placeholder="Search"
        class="search-input"
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
      <!-- Loading -->
      <div v-if="loading" class="loading">
        <a-spin />
      </div>

      <!-- Product Grid/List -->
      <div v-if="!loading" class="product-container" :class="{ 'grid-view': showGrid, 'list-view': !showGrid }">
         <div v-for="(item, index) in filteredItems" :key="index" @click="updateItemRendering(item.id)" style="
  background: #ffffff;
  border: none;
  border-radius: 4px;
  padding:2px;
  border:1px solid rgba(128, 128, 128, 0.14);">
          <div  class="product-item">

          <div class="product-image">
            <img :src="item.image" :alt="item.title" />
            <!-- <img :src="this.$store.state.root_api+item.texture_image" :alt="item.title" /> -->
            <!-- <div class="product-tag">Ad</div> -->
          </div>
          <div class="product-info">
            <div style="display:flex;justify-content: space-between;" class="">
              <div style="background-color: grey;color :white;border-radius:5px;padding-left:5px;padding-right:5px;padding-top:1px;height:22px;font-size:12px">
                Modern Floor
              </div>
              <div style="padding:3px;border:1px solid grey;border-radius:5px;padding-left:5px;padding-right:5px;padding-top:1px;height:22px;font-size:12px">AR</div>
            </div>
            <div class="product-name">{{ item.title }}</div>
            <div class="product-subtitle">Brown melody'</div>
            <div class="product-details">
              <span class="product-color">Color {{ item.color }}</span>
              <div class="color-dot" :style="{ backgroundColor: 'red' }"></div>
            </div>
            <div class="product-price">Price <span style="font-weight: 600;">$399</span></div>
          </div>
          <!-- <div class="product-actions">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none" class="heart-icon">
              <path d="M17.5 6.25C17.5 3.625 15.375 1.5 12.75 1.5C11.25 1.5 9.9375 2.25 9.125 3.375H9.125C8.6875 4 8.375 4.75 8.25 5.5625C8.125 4.75 7.8125 4 7.375 3.375C6.5625 2.25 5.25 1.5 3.75 1.5C1.125 1.5 -1 3.625 -1 6.25C-1 9.125 1.625 11.75 5.25 15L9.125 18.5L13 15C16.625 11.75 19.25 9.125 17.5 6.25Z" stroke="#666" stroke-width="1.5"/>
            </svg>
          </div> -->
          </div>

          <a-row>
          <a-col :span="20" style="padding-right:5px">
            <button block type="primary" class="btn-prod-details" >
              Product Detail
            </button>
          </a-col>
          <a-col :span="4" style="">
            <button block type="primary"  class="btn-prod-details">
              <HeartOutlined />
            </button>
          </a-col>
        </a-row>
        </div>
      </div>
    </div>

    <!-- Fixed Apply Button -->
    <!-- <div class="apply-section">
      <a-button type="primary" size="large" block class="apply-button">
        Apply
      </a-button>
    </div> -->
  </div>
</template>

<script>
import { HeartFilled,HeartOutlined } from '@ant-design/icons-vue';
export default {
  name: 'AiCatalog',
  data() {
    return {
      searchText: '',
      loading: false,
      error: null,
      catalogItems: [
        { id:"abc",
          image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCRxeS2S5i8SPy_5IojY8t8Fotgzc8t8sPYA&s',
          title:"Magnetic Light",
          type:'strip'
          // color:"pink"
        },
        { id:"bcd",
          image:'https://image.made-in-china.com/202f0j00PhioLGqdfwbD/Magnetic-Light-System-Recessed-Suction-Lamp-60cm-Magnetic-LED-Track-Lighting.webp',
            title:"Magnetic strip",
          type:'strip',

          // color:"pink"
        }
      ],
      showGrid: false, // true for grid, false for list
      // Mock data
      productItems:[]
    };
  },
  components:{
    HeartFilled,HeartOutlined
  },
  computed: {
    filteredItems() {
      const items = this.catalogItems.length > 0 ? this.catalogItems : this.productItems;
      if (!this.searchText) return items;
      return items.filter(item => 
        item.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  },
  mounted() {
    // this.fetchCatalogItems();
  },
  methods: {
    async fetchCatalogItems() {
      this.loading = true;
      try {
        const url = `${this.$store.state.root_api}room/api/floors/`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        if (data && data.data) {
          this.catalogItems = data.data;
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        this.loading = false;
      }
    },
    seeAllClicked(){
      this.$emit('furniture-see-all', true);
    },
updateItemRendering(uuid){
      this.$emit('furniture-selected', uuid);

}
  }
};
</script>


<style scoped>
.ai-catalog-section {
  display: flex;
  flex-direction: column;
  height: 76vh; 
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
  background: #1890ff;
  border-color: #1890ff;
}

.filter-btn.active svg path,
.filter-btn.active svg rect {
  stroke: white;
}

/* Updated Product Item Styles */
.product-item {
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom:5px;  
}

.product-item:hover {
  /* box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); */
  /* transform: translateY(-2px); */
}

/* List View Styles */
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
  /* margin-bottom: 4px; */
  line-height: 1.4;
}

.list-view .product-subtitle {
  font-size: 13px;
  color: #8c8c8c;
  /* margin-bottom: 12px; */
  font-weight: 400;
}

.list-view .product-details {
  display: flex;
  align-items: center;
  gap: 8px;
  /* margin-bottom: 8px; */
}

.list-view .product-color {
  font-size: 12px;
  color: #666666;
  width:100%;
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

/* Grid View Styles */
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
  /* margin-bottom: 10px; */
  font-weight: 400;
  text-align: left;
}

.grid-view .product-details {
  display: flex;
  align-items: center;
  gap: 6px;
  /* margin-bottom: 8px; */
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

/* Apply Section */
.apply-section {
  flex-shrink: 0;
  padding-top: 16px;
}

.apply-button {
  height: 44px;
  border-radius: 6px;
  font-weight: 600;
}

/* Responsive adjustments */
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

.btn-prod-details{
  background-color: #f3f3f2;width:100%;border:none;color:black;border-radius:5px;padding:2px;color:grey;
}

.btn-prod-details:hover{
  background-color: #f2f2f2;
}
</style>