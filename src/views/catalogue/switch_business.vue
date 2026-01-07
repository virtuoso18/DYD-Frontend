<template>
  <div class="business-profiles-container">
    
    
    <!-- Business Profiles List -->
    <div class="profiles-list">
      <div v-if="all_businesses.length > 0" class="profiles-grid">
        <div v-for="business in all_businesses" :key="business.id" class="business-card">
          <!-- Your business card content here -->
          <!-- Background image covering 100% width of card with centered overlay image -->
<div 
  :style="{
    backgroundImage: `url(${this.$store.state.root_media_api}/media/${business.business_picture})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '150px',
    borderRadius: '10px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  }"
>
  <!-- Centered banner picture with negative margin -->
  <img 
    :src="`${this.$store.state.root_media_api}/media/${business.banner_picture}`" 
    style="width: 70px; height: 70px;border:1px solid rgba(0,0,0,0.2); margin-bottom: -45%;margin-left: -75%; position: relative; z-index: 10; border-radius: 50%; object-fit: cover;"
    alt="Business Banner"
  >
</div>
           <!-- {{business.business_picture}} -->
<!-- <br><br> -->
 <div>
<a-row>
  <a-col :span="6"></a-col>
  <a-col :span="18">

    <h3 style="color:black">{{ business.name }}</h3>
    <!-- {{ business.slug }} -->

    <a-button  @click="clickBusiness(business.slug)" type="primary" block style="display: flex;gap:10px;justify-content: center; align-items: center;" :loading="loading"><SwapOutlined/> Switch Brand </a-button>
  </a-col>
</a-row>
 </div>
        </div>
      </div>
      <div v-else class="no-data">
        <p>No business profiles found</p>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-container" v-if="total_pages > 1">
      <button 
        @click="previous_page" 
        :disabled="current_page === 1"
        class="btn btn-prev"
      >
        Previous
      </button>
      
      <div class="page-info">
        <span>Page {{ current_page }} of {{ total_pages }}</span>
        <select v-model.number="current_page" @change="fetch_All_Business_Accounts" class="page-select">
          <option v-for="page in total_pages" :key="page" :value="page">
            Go to page {{ page }}
          </option>
        </select>
      </div>

      <button 
        @click="next_page" 
        :disabled="current_page === total_pages"
        class="btn btn-next"
      >
        Next
      </button>
    </div>

    <!-- Items per page selector -->
    <div class="items-per-page">
      <label for="items-select">Items per page:</label>
      <select 
        id="items-select"
        v-model.number="items_per_page" 
        @change="reset_and_fetch"
        class="items-select"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
  </div>
</template>

<script>
import { HeartOutlined, HeartFilled , SwapOutlined} from '@ant-design/icons-vue';

export default {
  name: 'ai_catalog',
  components: {
    HeartOutlined,
    HeartFilled,
    SwapOutlined
  },
  data() {
    return {

      all_businesses: [],
      current_page: 1,
      total_pages: 1,
      items_per_page: 10,
      total_count: 0,
      loading: false,
    };
  },
  mounted() {
    this.fetch_All_Business_Accounts();
  },
  computed: {},
  methods: {
    clickBusiness(business_slug){
        this.loading=true;
        this.$emit('switch-brand-profesional-user', business_slug)
    },
    async fetch_All_Business_Accounts() {
      try {
        this.loading = true;
        const response = await fetch(
          `${this.$store.state.root_api}Auth/api/fetch-all-busines-profiles/?page=${this.current_page}&page_size=${this.items_per_page}`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log(data);
        
        if (data.success) {
          this.all_businesses = data.data;
          this.total_count = data.total_count;
          this.total_pages = data.total_pages;
          this.current_page = data.current_page;
        }
      } catch (error) {
        console.error("Failed to load business profiles:", error);
      } finally {
        this.loading = false;
      }
    },

    next_page() {
      if (this.current_page < this.total_pages) {
        this.current_page++;
        this.fetch_All_Business_Accounts();
      }
    },

    previous_page() {
      if (this.current_page > 1) {
        this.current_page--;
        this.fetch_All_Business_Accounts();
      }
    },

    reset_and_fetch() {
      this.current_page = 1;
      this.fetch_All_Business_Accounts();
    },
  },
};
</script>

<style scoped>
.business-profiles-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.profiles-list {
  margin-bottom: 30px;
}

.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.business-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
  transition: transform 0.2s;
}

.business-card:hover {
  border: 1px solid #2200ff;

  /* transform: translateY(-4px); */
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); */
}

.business-card h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #1890ff;
}

.business-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #1890ff;
  background-color: white;
  color: #1890ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn:hover:not(:disabled) {
  background-color: #1890ff;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #ddd;
  color: #ddd;
}

.page-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.items-per-page {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.items-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #1890ff;
  font-size: 16px;
}
</style>