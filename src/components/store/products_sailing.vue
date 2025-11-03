<template>
  <div class="main">
    <div class="products-list">
      <a-row>
        <a-col
          v-for="product in products"
          :key="product.product_id"
          class="product-responsive"
          style="padding:5px;text-align: start;"
        >
          <div class="product">
            <div class="product-image-container">
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

              <a-col :span="18" >
                Colors
              </a-col>

              <a-col
                span="6"
                style="display: flex; justify-content: end; gap: 4px;"
              >
                <div
                  v-for="(c, i) in product.product_colors.slice(0,2)"
                  :key="i"
                  style="width:20px;height:20px;border-radius:20px;"
                  :style="{ background: c.color || c.color_hex }"
                ></div>
              </a-col>

              <a-col span="12">
                Price
              </a-col>

              <a-col span="12" style="text-align: end;">
                <b>${{ product.product_price }}</b>
              </a-col>

              <a-col span="17">
                
<a-button block @click="this.$router.push(this.$route.params.buisness_name+'/'+product.type+'/'+product.product_id)">Product Details</a-button>
              </a-col>

              <a-col span="1"></a-col>
              <a-col span="4">
                <a-button><HeartOutlined /></a-button>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
  
</template>




<script>
import {HeartOutlined} from '@ant-design/icons-vue'
export default {
  name: 'buisnes_products_sailing',
  components:{
    HeartOutlined
  },
  props:{
    products:Object
  },
  data() {
    return {
    }
  },
  methods: {
//     truncateText(text, wordLimit) {
//   if (!text) return '';
//   const words = text.split(' ');
//   if (words.length <= wordLimit) return text;
//   return words.slice(0, wordLimit).join(' ') + '...';
// },

truncateText(text, charLimit = 18) {
            if (!text) return '';
            if (text.length <= charLimit) return text;
            return text.slice(0, charLimit) + '...';
        },
    handleAddProduct() {
      console.log('Add product clicked');
      // Handle add product functionality
    },
    handleProductDetail(product) {
      console.log('Product detail clicked:', product);
      // Handle product detail navigation
    },
    toggleWishlist(product) {
      product.isWishlisted = !product.isWishlisted;
      const message = product.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist';
      this.$message.success(message);
    }
  }
}
</script>


<style scoped>
.main{
    /* padding:10px; */
    border-radius:20px;
    /* height: 100vh; */

    /* background: white; */
    /* border:2px solid rgba(128, 128, 128, 0.16); */
    /* margin-top:10px; */
    /* margin-bottom:10px; */
}
.head-section{
    display:flex;
    justify-content: space-between;
}
.product{
    padding:10px;
    margin-bottom:10px;
    border-radius:10px;
    background:#f3f2f4;
}
.products-list{
    padding-bottom:20px;
    
}
.product-image-container {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 16px; */
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
  width:50%;
  flex: 0 0 50%;
}

@media (min-width: 576px) { .product-responsive { width: 50%; flex: 0 0 50%; } }
@media (min-width: 768px) { .product-responsive { width: 33.333%; flex: 0 0 33.333%; } }
@media (min-width: 992px) { .product-responsive { width: 25%; flex: 0 0 25%; } }
@media (min-width: 1200px) { .product-responsive { width: 20%; flex: 0 0 20%; } }
</style>