<template>
  <div style="margin-top:15px;background-color:white;border-radius:15px;border:1px solid rgba(0,0,0,0.1);padding:20px;">
    <a-button type="text" @click="this.$emit('back-button-clicked',true)" 
             style="padding:8px 12px;margin-bottom:20px;border-radius:8px;display:flex;align-items:center;color:#666;font-weight:500;transition:all 0.3s;"
             onmouseover="this.style.backgroundColor='#f5f5f5'" 
             onmouseout="this.style.backgroundColor='transparent'">
      <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:8px;">
        <path d="M5 10L1 5.5L5 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {{ selected_request.email }}
    </a-button>
    
    <a-row :gutter="[16, 16]" style="padding:10px;background-color: #f3f2f2;border-radius:10px;">
      <a-col :sm="24":xs="24" :md="6" :lg="6">
        <a-image 
          :src="this.$store.state.root_media_api+selected_request.image_url" 
          style="width:100%;max-width:200px;border-radius:10px;object-fit:cover;"
        />
      </a-col>
      <a-col :sm="24" :md="18" :lg="18">
       
         <div style="margin-bottom:16px;">
          <div style="display: flex;justify-content: space-between;">

            <p style="margin-bottom:8px;color:#666;font-size:14px;"><b style="color:#333;">Request by:</b> {{ selected_request.email }}</p>
            <p style="margin-bottom:0;color:#666;font-size:14px;"><b style="color:#333;">Request date:</b> {{ formatDate(selected_request.created_at) }}</p>
          </div>
          <p style="margin-bottom:8px;color:#666;font-size:14px;"><b style="color:#333;">Requested to:</b> {{ selected_request.requested_to }}</p>
        </div>
        <p style="color:#333;line-height:1.5;">{{ selected_request.message }}</p>
      </a-col>
    </a-row>


    <div style="margin-top:30px;" v-if="selected_request.status=='Completed'">
      <h3 style="margin-bottom:5px;font-size:18px;font-weight:600;">Generated Design</h3>
      <p style="color:#666;font-size:14px;margin-bottom:16px;">{{ formatDate(selected_request.created_at) }}</p>
      
      <a-row :gutter="[24, 24]">
        <a-col :sm="24" :md="14" :lg="14">
          <a-image 
            :src="this.$store.state.root_media_api+selected_request.generated_image" 
            style="width:100%;border-radius:12px;object-fit:cover;"
          />
        </a-col>
        
        <a-col :sm="24" :xs="24" :md="10" :lg="10">
          <h3 style="margin-bottom:16px;font-size:16px;font-weight:600;">Products use in Design</h3>
          
          <div v-for="product in products_used" :key="product.id" 
               style="background:#ffffff;border-radius:12px;padding:16px;margin-bottom:16px;">
            
            <a-row :gutter="[12, 12]">
              <a-col :span="8">
                <div style="position:relative;" @click="viewProduct(product)">
                  <img 
                    :src="$store.state.root_media_api + product.product_image"
                    :alt="product.product_title"
                    style="width:100%;height:120px;object-fit:cover;border-radius:8px;cursor:pointer;"
                  />
                </div>
              </a-col>
              
              <a-col :span="16">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                  <span style="background:#f4f5f7;color:#000;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:500;">
                    {{ product.category_name }}
                  </span>
                  <span style="background:#f0f0f0;color:#666;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:600;">
                    AR
                  </span>
                </div>
                
                <h4 style="font-size:14px;font-weight:600;margin-bottom:8px;line-height:1.3;">
                  {{ product.product_title }}
                </h4>
                
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                  <span style="font-size:12px;color:#666;">Color</span>
                  <div style="display:flex;">
                    <div v-for="(color, index) in product.product_colors.slice(0,2)" :key="index"
                         style="width:16px;height:16px;border-radius:50%;margin-left:4px;border:1px solid #ddd;"
                         :style="`background:${color.color_hex || color.color}`">
                    </div>
                  </div>
                </div>
                
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-size:12px;color:#666;">Price</span>
                  <span style="font-weight:700;font-size:16px;color:#1890ff;">${{ product.product_price }}</span>
                </div>
              </a-col>
            </a-row>
            
            <a-row style="margin-top:12px;" >
              <a-col :span="20">
                <a-button size="large" block @click="viewProduct(product)" 
                         style="border:1px solid #d9d9d9;color:#000; background-color: #f2f2f2;border:none;;">
                  Product Detail
                </a-button>
              </a-col>
              <a-col :span="4" style="display: flex;justify-content: center;">
                <a-button size="large" style="border:1px solid #d9d9d9; ; background-color: #f2f2f2;border:none;display:flex;justify-content:center;align-items: center;color:#000;">
                  <HeartOutlined style="color:#666;" />
                </a-button>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </div>
    <div v-else>
        <br>
        <div style="height:40vh;display: flex;flex-direction: column;justify-content: center;align-items: center;background: #f3f2f2;">

            <svg width="41" height="50" viewBox="0 0 41 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M19 12C8.5063 12 0 20.5063 0 31C0 41.4937 8.5063 50 19 50C29.4937 50 38 41.4937 38 31C38 20.5063 29.4937 12 19 12ZM19 13.9C19 18.4352 17.1984 22.7847 13.9915 25.9915C10.7847 29.1984 6.4352 31 1.9 31C6.4352 31 10.7847 32.8016 13.9915 36.0085C17.1984 39.2153 19 43.5648 19 48.1C19 43.5648 20.8016 39.2153 24.0085 36.0085C27.2153 32.8016 31.5648 31 36.1 31C31.5648 31 27.2153 29.1984 24.0085 25.9915C20.8016 22.7847 19 18.4352 19 13.9Z" fill="#8C8C8C"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M34.918 0C31.6042 0 28.918 2.6862 28.918 6C28.918 9.3138 31.6042 12 34.918 12C38.2318 12 40.918 9.3138 40.918 6C40.918 2.6862 38.2318 0 34.918 0ZM34.918 0.6C34.918 2.03217 34.349 3.40568 33.3363 4.41838C32.3236 5.43107 30.9501 6 29.518 6C30.9501 6 32.3236 6.56893 33.3363 7.58162C34.349 8.59432 34.918 9.96783 34.918 11.4C34.918 9.96783 35.4869 8.59432 36.4996 7.58162C37.5123 6.56893 38.8858 6 40.318 6C38.8858 6 37.5123 5.43107 36.4996 4.41838C35.4869 3.40568 34.918 2.03217 34.918 0.6Z" fill="#CCCCCC"/>
            </svg><br>
            <h4>Thanks for Staying With Us</h4>
            <p>We’re crafting your design — it will be ready shortly</p>
        </div>

    </div>
  </div>
</template>

<script>
import { HeartOutlined } from '@ant-design/icons-vue'

export default {
  name: "selectedRequest",
  components: {
    HeartOutlined
  },
  props: {
    selected_request: Object
  },
  data() {
    return {
      products_used: []
    }
  },
  mounted() {
    this.loadUsedProducts()
  },
  methods: {
    async loadUsedProducts() {
      try {
        this.loadingProductsUsed = true;
        const response = await fetch(
          `${this.$store.state.root_api}room_request/api/get-products-used-in-room-request/${this.selected_request.id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          this.products_used = data.data;
        }
      } catch (error) {
        console.error("Failed to load products used:", error);
      } finally {
        this.loadingProductsUsed = false;
      }
    },
    
    viewProduct(product) {
      // Add your view product logic here
      console.log('View product:', product);
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit'
      };
      
      return date.toLocaleDateString('en-US', options);
    }
  }
}
</script>

<style scoped>
</style>