<template>
  <div class="main">
    <div class="products-list">
      <a-row>
        <a-col 
          v-for="product in products"
          :key="product.product_id"
          class="product-responsive"
          :span="12"
          sm="8"
          style="padding:5px;text-align: start;"
        >
          <div class="product">
            <div class="product-image-container" @click="goto_product_Route(product)">
              <img
                :src="this.$store.state.root_media_api + product.product_image"
                :alt="product.product_title"
                class="product-image"
              />
              <!-- Category Badge -->
              <div class="category-badge">{{ product.category_name }}</div>
              <!-- AR Badge -->
              <div class="ar-badge">AR</div>
            </div>

            <a-row>
              <a-col :span="24" style="padding-top:10px;">
                <b>{{ truncateText(product.product_title || 'No title available', 22) }}</b>
              </a-col>

              <a-col :xs="16" :sm="16" :md="16" :lg="12" :xl="12">
                Colors
              </a-col>

              <a-col
                :xs="8" :sm="8" :md="8" :lg="12" :xl="12"
                style="display: flex; justify-content: end; gap: 4px;"
              >
                <div
                  v-for="(c, i) in product.product_colors.slice(0,2)"
                  :key="i"
                  :style="{ width: colorCircleSize, height: colorCircleSize, borderRadius: '50%', background: c.color || c.color_hex }"
                ></div>
              </a-col>

              <a-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                Price
              </a-col>

              <a-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" style="text-align: end;">
                <b>${{ product.product_price }}</b>
              </a-col>

              <a-col :xs="16" :sm="16" :md="16" :lg="17" :xl="17">
                <a-button block @click="goto_product_Route(product)">
                  Product Details
                </a-button>
              </a-col>
              
              <a-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1"></a-col>
              <a-col :xs="7" :sm="7" :md="7" :lg="4" :xl="4">
                <a-button @click="toggleFavorite(product.product_id, product.type, product)" style="display: flex;justify-content: center;align-items: center; width: 100%;">
                  <template v-if="product.is_favorited">
                    <HeartFilled style="color: red" />
                  </template>
                  <template v-else>
                    <HeartOutlined />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { HeartOutlined, HeartFilled } from '@ant-design/icons-vue'

export default {
  name: 'buisnes_products_sailing',
  components: {
    HeartOutlined,
    HeartFilled
  },
  props: {
    products: Object
  },
  data() {
    return {
      colorCircleSize: '20px'
    }
  },
  mounted() {
    this.updateColorCircleSize();
    window.addEventListener('resize', this.updateColorCircleSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateColorCircleSize);
  },
  watch: {
    '$route.params.product_id'(newVal, oldVal) {
      if (newVal !== oldVal) {
        window.location.reload()
      }
    },
  },

  methods: {
    updateColorCircleSize() {
      const width = window.innerWidth;
      if (width < 576) {
        this.colorCircleSize = '14px';
      } else if (width < 768) {
        this.colorCircleSize = '16px';
      } else if (width < 992) {
        this.colorCircleSize = '18px';
      } else if (width < 1200) {
        this.colorCircleSize = '19px';
      } else {
        this.colorCircleSize = '20px';
      }
    },
    goto_product_Route(product){
      let product_type = product.type
      if(product.type === 'light'){
        product_type = 'product'
      }
      if(product.type === 'floor_texture'){
        product_type = 'floor'
      }        
      if(product.type === 'wall_texture'){
        product_type = 'wall'
      }
      this.$router.push({
        name: 'buisness_product',
        params: {
          buisness_name: this.$route.params.buisness_name,
          product_type: product_type,
          product_id: product.product_id
        }
      })
    },
    truncateText(text, charLimit = 18) {
      if (!text) return '';
      if (text.length <= charLimit) return text;
      return text.slice(0, charLimit) + '...';
    },
    
    handleAddProduct() {
      console.log('Add product clicked');
    },
    
    handleProductDetail(product) {
      console.log('Product detail clicked:', product);
      this.$router.push(
        '/' + this.$route.params.buisness_name + '/' + 
        product.product_type + '/' + product.product_id
      );
    },
    
    async toggleFavorite(product_id, product_type, product) {
      try {
        const token = localStorage.getItem('token');
        
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
              id: product_id,
              type: product_type,
            }),
          }
        );
        
        const data = await response.json();
        product.is_favorited = data.favorited;
        
        const message = data.favorited ? 'Added to favorites' : 'Removed from favorites';
        this.$message.success(message);

      } catch (error) {
        console.error("Favorite toggle failed", error);
        this.$message.error('Failed to update favorite');
      }
    }
  }
}
</script>

<style scoped>
.main {
  border-radius: 20px;
}

.head-section {
  display: flex;
  justify-content: space-between;
}

.product {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f3f2f4;
  min-width: 160px;
  max-width: 250px;
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
  cursor: pointer;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.product-image-container:hover .product-image {
  transform: scale(1.05);
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

@media (max-width: 575px) {
  .product-image-container {
    height: 140px;
  }
  
  .product {
    padding: 8px;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .product-image-container {
    height: 160px;
  }
  
  .product {
    padding: 9px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .product-image-container {
    height: 170px;
  }
  
  .product {
    padding: 10px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .product-image-container {
    height: 175px;
  }
  
  .product {
    padding: 10px;
  }
}

@media (min-width: 1200px) {
  .product-image-container {
    height: 180px;
  }
  
  .product {
    padding: 10px;
  }
}
</style>