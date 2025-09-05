<template>
<div class="main">
    <div class="products-list">
        <a-row >
<a-col v-for="product in products" :key="product.id" 
       class="product-responsive" style="padding:5px;">
                <div  class="product">
                   <div class="product-image-container">
              <img 
                :src="product.image" 
                :alt="product.name"
                class="product-image"
              />
              <!-- Category Badge -->
              <div class="category-badge">{{ product.category }}</div>
              <!-- AR Badge -->
              <div class="ar-badge">AR</div>
            </div>

                <a-row>

                    <a-col span="24">
<b>{{product.name}}</b>
                    </a-col>
                    
                    <a-col span="18">
Color
                    </a-col>
                    
                    <a-col span="6" style="display: flex;justify-content: end;">
<div style="width:20px;height:20px;;border-radius:20px;" :style="'background:'+product.color"></div>
<div style="width:20px;height:20px;;border-radius:20px;" :style="'background:pink'"></div>
                    </a-col>
                    <a-col span="12">
Price
                    </a-col>
                    
                    <a-col span="12">
{{product.price}}
                    </a-col>

                     <a-col span="17">
<a-button  block>Product Details</a-button>
                    </a-col>
                    
                    <a-col span="1"></a-col>
                    <a-col span="4">
<a-button ><HeartOutlined /></a-button>

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
  name: 'MyProducts',
  components:{
    HeartOutlined
  },
  data() {
    return {
      products: [
        {
          id: 1,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: false
        },
        {
          id: 2,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: false
        },
        {
          id: 3,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: false
        },
        {
          id: 4,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: true
        },
        {
          id: 3,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: false
        },
        {
          id: 4,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: true
        },
        {
          id: 3,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: false
        },
        {
          id: 4,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: true
        },
        {
          id: 5,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: false
        },
        {
          id: 6,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: false
        },
        {
          id: 7,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: false
        },
        {
          id: 8,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: false
        },
        {
          id: 9,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: false
        },
        {
          id: 10,
          name: 'Chamaro Sky',
          category: 'Modern Chair',
          price: 660,
          color: '#6B7280',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          brandLogo: 'https://via.placeholder.com/60x30/FFB800/FFFFFF?text=LOGO',
          brand: 'Brand',
          isWishlisted: false
        }
      ]
    }
  },
  methods: {
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
    padding:10px;
    border-radius:20px;
    /* height: 100vh; */

    background: white;
    /* border:2px solid rgba(128, 128, 128, 0.16); */
    margin-top:10px;
    margin-bottom:10px;
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
    padding-bottom:10px;
    
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