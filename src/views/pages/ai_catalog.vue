<template>
  <div class="business-profiles-container">
    
    <!-- Replace the existing top div with this -->
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
  <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #111; letter-spacing: -0.4px;">
    All Business Accounts
  </h2>

  <div style="display: flex; align-items: center; gap: 10px;">
    
    <!-- 🔍 Search Field -->
    <div style="position: relative; display: flex; align-items: center;">
      <svg
        style="position: absolute; left: 12px; width: 16px; height: 16px; color: #9ca3af; pointer-events: none; z-index: 1;"
        fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        v-model="value"
        @keyup.enter="onSearch(value)"
        @input="onSearch(value)"
        type="text"
        placeholder="Search businesses..."
        style="
          padding: 9px 14px 9px 36px;
          width: 230px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 13.5px;
          color: #111;
          background: #fafafa;
          outline: none;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          font-family: inherit;
        "
        @focus="e => { e.target.style.borderColor='#1890ff'; e.target.style.background='#fff'; e.target.style.boxShadow='0 0 0 3px rgba(24,144,255,0.1)'; }"
        @blur="e => { e.target.style.borderColor='#e5e7eb'; e.target.style.background='#fafafa'; e.target.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)'; }"
      />
    </div>

    <!-- ↕ Sort Dropdown -->
    <div style="position: relative; display: flex; align-items: center;">
      <svg
        style="position: absolute; left: 11px; width: 15px; height: 15px; color: #6b7280; pointer-events: none; z-index: 1;"
        fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
      >
        <path d="M3 6h18M6 12h12M9 18h6"/>
      </svg>
      <select
        v-model="sort_order"
        style="
          appearance: none;
          padding: 9px 32px 9px 34px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 13.5px;
          color: #111;
          background: #fafafa;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          font-family: inherit;
          font-weight: 500;
        "
        @focus="e => { e.target.style.borderColor='#1890ff'; e.target.style.background='#fff'; e.target.style.boxShadow='0 0 0 3px rgba(24,144,255,0.1)'; }"
        @blur="e => { e.target.style.borderColor='#e5e7eb'; e.target.style.background='#fafafa'; e.target.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)'; }"
      >
        <option value="New Business First">🆕 Newest First</option>
        <option value="Old Business First">🕐 Oldest First</option>
      </select>
      <!-- Custom chevron arrow -->
      <svg
        style="position: absolute; right: 10px; width: 14px; height: 14px; color: #9ca3af; pointer-events: none;"
        fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </div>

  </div>
</div>

    <!-- Business Profiles List -->
    <div class="profiles-list">
      <div v-if="all_businesses.length > 0" class="profiles-grid">
        <div
          v-for="business in all_businesses"
          :key="business.id"
          class="business-card"
        >
          <!-- Your business card content here -->
          <!-- Background image covering 100% width of card with centered overlay image -->
          <div
            class="business-bg-container relative"
            :class="{ 'image-loaded': imageLoadedMap[business.id] }"
          >
            <!-- FULL CONTAINER SHIMMER -->
            <div
              v-if="!imageLoadedMap[business.id]"
              class="business-bg-shimmer"
            ></div>

            <!-- YOUR ORIGINAL BG + IMG -->
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
                position: 'relative',
                zIndex: 1,

              }"
            >
              <!-- YOUR ORIGINAL BANNER IMG -->
              <img
                :src="`${this.$store.state.root_media_api}/media/${business.banner_picture}`"
                @load="onBusinessImagesLoad(business.id)"
                style="
                  width: 70px;
                  height: 70px;
                  border: 1px solid rgba(0, 0, 0, 0.2);
                  margin-bottom: -45%;
                  margin-left: -75%;
                  position: relative;
                  z-index: 10;
                  border-radius: 50%;
                  object-fit: cover;
                "
                alt="Business Banner"
              />
            </div>
          </div>

          <!-- {{business.business_picture}} -->
          <!-- <br><br> -->
          <div>
            <a-row>
              <a-col :span="6"></a-col>
              <a-col :span="18">
                <h3 style="color: black">{{ business.name }}</h3>
                <!-- {{ business.slug }} -->

                <a-button
                  @click="
                    $router.push('/explore-business-cataloges/' + business.slug)
                  "
                  type="primary"
                  block
                  >Show Products
                </a-button>
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
        <select
          v-model.number="current_page"
          @change="fetch_All_Business_Accounts"
          class="page-select"
        >
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
import { HeartOutlined, HeartFilled } from "@ant-design/icons-vue";

export default {
  name: "ai_catalog",
  components: {
    HeartOutlined,
    HeartFilled,
  },
  data() {
    return {
      all_businesses: [],
      current_page: 1,
      imageLoadedMap: {},
      total_pages: 1,
      items_per_page: 20,
      total_count: 0,
      loading: false,

      value: '',                              // ✅ for a-input-search v-model
      sort_order: 'New Business First',       // ✅ for a-select v-model with default
    };
  },
  mounted() {
    this.fetch_All_Business_Accounts();
  },
  watch: {
  sort_order(newVal) {
    this.reset_and_fetch();
  }
},
  computed: {},
  methods: {
    async fetch_All_Business_Accounts() {
  try {
    this.loading = true;

    // ✅ Build query params with search and sort
    const params = new URLSearchParams({
      page: this.current_page,
      page_size: this.items_per_page,
      search: this.value || '',           // search input value
      sort: this.sort_order || 'New Business First',  // sort dropdown value
    });

    const response = await fetch(
      `${this.$store.state.root_api}Auth/api/fetch-all-busines-profiles/?${params}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

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

// ✅ Hook up search and sort to re-fetch
onSearch(val) {
  this.value = val;
  this.reset_and_fetch();
},

    onBusinessImagesLoad(id) {
      // Preload BG image first
      const bgImg = new Image();
      bgImg.onload = () => {
        // Wait 2s minimum, then show images
        setTimeout(() => {
          this.imageLoadedMap[id] = true;
        }, 2000);
      };
      bgImg.onerror = () => {
        // Even on error, wait 2s
        setTimeout(() => {
          this.imageLoadedMap[id] = true;
        }, 2000);
      };
      bgImg.src = `${this.$store.state.root_media_api}/media/${this.all_businesses.find((b) => b.id === id)?.business_picture}`;
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
  max-width: 1200px;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.business-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

.business-bg-container {
  height: 150px;
  border-radius: 10px;
}

.business-bg-shimmer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(110deg, #f3f4f6 8%, #e5e7eb 18%, #f3f4f6 33%);
  background-size: 200% 100%;
  border-radius: 10px;
  animation: shimmer 1.6s infinite linear;
  z-index: 1;
}

@keyframes shimmer {
  to {
    background-position-x: -200%;
  }
}

.business-bg-container.image-loaded .business-bg-shimmer {
  opacity: 0;
  transition: opacity 0.3s ease-out;
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
