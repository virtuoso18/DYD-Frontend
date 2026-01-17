<template>
  <a-modal
      v-model:open="showConsentModal"
      title="Clear Cart?"
      :closable="false"
      :maskClosable="false"
    >
      <p>Your cart contains items from a different seller. Do you want to clear the cart first in order to add this item?</p>
      <template #footer>
        <a-button @click="handleConsentNo" :disabled="clearingCart">No</a-button>
        <a-button type="primary" @click="handleConsentYes" :loading="clearingCart">Yes</a-button>
      </template>
    </a-modal>

    <!-- {{ selectedProduct }} -->
  <div>
    <!-- Header -->
    <a-page-header 
      :title="selectedProduct.name" 
      @back="this.$router.back()"
    >
    <!--   <template #extra>
        <a-button > <template #icon> <ClockCircleOutlined/></template>Create Variation</a-button>
        <a-avatar style="background-color: #dc2626;">A</a-avatar>
      </template> -->
    </a-page-header>

    <!-- Main Content -->
    <a-row :gutter="[24, 24]">
      <!-- Left Column - 3D Model and Images -->
      <a-col :xs="24" :md="12">
        <!-- 3D Model Card -->
         <div style="position: relative; padding:10px;;"  v-if="activeView === '3d'">

            <canvas_3d_model_renderer 
             

            :glbModelUrl="$store.state.root_media_api + selectedProduct['3d_model']"
            :Model_instance_id="selectedProduct.id"
            :isLoading="false"
            style="width: 100%; max-height:500px; height: 100%;border-radius: 10px"
            />
            
            <div 
  @click="activeView = '3d'"
            style="position: absolute; bottom: 15px; right: 15px; background: white; padding: 8px 12px; border-radius: 6px; border: 1px solid #e9ecef; font-size: 12px; font-weight: 600; cursor: pointer;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" style="margin-right: 5px; vertical-align: middle;">
            <path
            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z">
        </path>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
    3D View
</div>

</div>
<div 
            v-else-if="activeView === 'image' && activeImageIndex !== null"
            style="width: 100%; max-height:500px; height: 100%; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #f5f5f5;">
            <img 
              :src="$store.state.root_media_api + selectedProduct.images[activeImageIndex].image"
              style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;"
            />
          </div>
        <!-- Images Section -->
        <a-card title="Product Images" style="margin-top: 16px;">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <div 
  @click="activeView = '3d'"
  :style="{
    height:'80px',
    width:'80px',
    border: activeView === '3d' ? '3px solid #1890ff' : '1px solid rgba(0,0,0,0.1)',
    borderRadius:'10px',
    display:'flex',
    flexDirection: 'center',
    justifyContent: 'center',
    alignItems:'center',
    fontSize:'30px',
    fontWeight:'700',
    color: activeView === '3d' ? '#1890ff' : 'grey',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }"
>
  3D
</div>
              <div
  v-for="(img, index) in selectedProduct.images" 
  :key="index"
  @click="handleImageClick(index)"
  :style="{
    width: '80px', 
    height: '80px', 
    borderRadius: '8px', 
    border: activeView === 'image' && activeImageIndex === index ? '3px solid #1890ff' : '1px solid #d9d9d9',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    overflow: 'hidden'
  }"
>
  <img 
    :src="$store.state.root_media_api + img.image"
    style="width: 100%; height: 100%; object-fit: cover;"
  />
</div>
              <!-- <div 
                style="width: 80px; height: 80px; border: 2px dashed #d9d9d9; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fafafa;"
              >
                <a-icon type="plus" style="color: #bfbfbf;" />
              </div> -->
          </div>
        </a-card>
      </a-col>

      <!-- Right Column - Product Details -->
      <a-col :xs="24" :md="12">
        <a-card>
          <!-- Product Title and Description -->
          <a-tag color="blue" style="margin-bottom: 16px;">Product Details</a-tag>
          <h1 style="font-size: 28px; margin-bottom: 16px;">{{ selectedProduct.name }}</h1>
          <p style="color: #666; line-height: 1.6; margin-bottom: 24px;">
            {{ selectedProduct.description }}
          </p>

          <!-- Basic Info -->
          <a-row :gutter="16" style="margin-bottom: 24px;">
            <a-col :span="12">
              <a-statistic 
                title="Category" 
                :value="selectedProduct.category.name" 
                :value-style="{ fontSize: '16px', fontWeight: '600' }"
              />
            </a-col>
            <a-col :span="12">
              <a-statistic 
                title="Type" 
                :value="selectedProduct.furniture_type" 
                :value-style="{ fontSize: '16px', fontWeight: '600' }"
              />
            </a-col>
          </a-row>

          
          <!-- Dimensions -->
           <div style="margin-bottom: 20px;">
            <h4 style="font-weight:normal">Dimensions</h4>
            <span v-if="selectedProduct.dimensions.width"  style="font-weight:bold"> {{ selectedProduct.dimensions.width }} m W X&nbsp;</span> 
          <span v-if="selectedProduct.dimensions.height" style="font-weight:bold" >{{ selectedProduct.dimensions.height }} m H X&nbsp;</span>  
          <span v-if="selectedProduct.dimensions.length" style="font-weight:bold" >{{ selectedProduct.dimensions.length }} m L&nbsp;</span>
            </div>

          <!-- <a-descriptions title="Dimensions" :column="1" size="small" style="margin-bottom: 24px;">
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.width" 
              label="Width"
            >
              {{ selectedProduct.dimensions.width }}
            </a-descriptions-item>
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.height" 
              label="Height"
            >
              {{ selectedProduct.dimensions.height }}
            </a-descriptions-item>
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.length" 
              label="Length"
            >
              {{ selectedProduct.dimensions.length }}
            </a-descriptions-item>
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.depth" 
              label="Depth"
            >
              {{ selectedProduct.dimensions.depth }}
            </a-descriptions-item>
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.weight" 
              label="Weight"
            >
              {{ selectedProduct.dimensions.weight }}
            </a-descriptions-item>
          </a-descriptions> -->

          <!-- Colors and Textures -->
          <a-row :gutter="16" style="margin-bottom: 24px;">
            <a-col :span="12">
              <div style="margin-bottom: 8px; font-weight: 500;">Colors:</div>
              <div style="display: flex; gap: 6px; align-items: center;">
                <div
                  v-for="(color, index) in selectedProduct.colors.available_colors"
                  :key="index"
                  :style="{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: color.color,
                    border: '2px solid #f0f0f0'
                  }"
                ></div>
              </div>
            </a-col>
            <a-col :span="12">
              <div style="margin-bottom: 8px; font-weight: 500;">Textures:</div>
              <div style="display: flex; gap: 6px;flex-wrap: wrap;">
                <img 
                  v-for="texture in selectedProduct.textures" 
                  :key="texture" 
                  :src="$store.state.root_media_api + texture.texture" 
                  alt="" 
                  style="width: 40px; height: 40px; border-radius: 4px; border: 1px solid #d9d9d9; object-fit: cover;"
                />
              </div>
            </a-col>
          </a-row>

          <!-- Price Section -->
          
          
          <div>
                <div style="color: #666; font-size: 14px;">Price</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span 
                    v-if="selectedProduct.pricing.price"
                    :style="selectedProduct.pricing.is_on_sale 
                            ? 'text-decoration: line-through; color: #999; font-size: 18px;' 
                            : 'color: #1890ff; font-size: 24px; font-weight: 700;'"
                  >
                    ${{ selectedProduct.pricing.price }}
                  </span>
                
                </div>
              </div>
              <br>
              <a-row>
                <!-- <a-col :span="12" style="padding-left:10px;padding-right:10px">
                  <a-button type="primary" block > Check in your room</a-button>
                </a-col> -->
                 <a-col :span="12">
                    <!-- Simple Add to Cart Button -->
                    <a-button 
                      type="primary" 
                      block
                      @click="addToCart"
                      :loading="cartLoading"
                      style="display:flex;gap:10px;justify-content: center;align-items: center;"
                    >

                      <!-- <template #icon> -->
                        <svg v-if="!cartLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="9" cy="21" r="1"/>
                          <circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                      <!-- </template> -->
                      Add to Cart
                    </a-button>
                </a-col>

                <a-col :span="12" >
                  
                  <a-button type="default" block style="display: flex;justify-content: center;align-items: center;gap:10px;">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.001 2C17.524 2 22.001 6.477 22.001 12C22.001 17.523 17.524 22 12.001 22C10.2337 22.003 8.49757 21.5353 6.97099 20.645L2.00499 22L3.35699 17.032C2.46595 15.5049 1.99789 13.768 2.00099 12C2.00099 6.477 6.47799 2 12.001 2ZM8.59299 7.3L8.39299 7.308C8.26368 7.31691 8.13734 7.35087 8.02099 7.408C7.91257 7.46951 7.81355 7.5463 7.72699 7.636C7.60699 7.749 7.53899 7.847 7.46599 7.942C7.09611 8.4229 6.89696 9.01331 6.89999 9.62C6.90199 10.11 7.02999 10.587 7.22999 11.033C7.63899 11.935 8.31199 12.89 9.19999 13.775C9.41399 13.988 9.62399 14.202 9.84999 14.401C10.9534 15.3724 12.2683 16.073 13.69 16.447L14.258 16.534C14.443 16.544 14.628 16.53 14.814 16.521C15.1052 16.5056 15.3895 16.4268 15.647 16.29C15.7778 16.2223 15.9056 16.1489 16.03 16.07C16.03 16.07 16.0723 16.0413 16.155 15.98C16.29 15.88 16.373 15.809 16.485 15.692C16.569 15.6053 16.639 15.5047 16.695 15.39C16.773 15.227 16.851 14.916 16.883 14.657C16.907 14.459 16.9 14.351 16.897 14.284C16.893 14.177 16.804 14.066 16.707 14.019L16.125 13.758C16.125 13.758 15.255 13.379 14.723 13.137C14.6673 13.1128 14.6077 13.0989 14.547 13.096C14.4786 13.0888 14.4094 13.0965 14.3442 13.1184C14.279 13.1403 14.2192 13.176 14.169 13.223C14.164 13.221 14.097 13.278 13.374 14.154C13.3325 14.2098 13.2753 14.2519 13.2098 14.2751C13.1443 14.2982 13.0733 14.3013 13.006 14.284C12.9408 14.2666 12.877 14.2446 12.815 14.218C12.691 14.166 12.648 14.146 12.563 14.11C11.9889 13.8599 11.4574 13.5215 10.988 13.107C10.862 12.997 10.745 12.877 10.625 12.761C10.2316 12.3842 9.88874 11.958 9.60499 11.493L9.54599 11.398C9.50425 11.3338 9.47003 11.265 9.44399 11.193C9.40599 11.046 9.50499 10.928 9.50499 10.928C9.50499 10.928 9.74799 10.662 9.86099 10.518C9.97099 10.378 10.064 10.242 10.124 10.145C10.242 9.955 10.279 9.76 10.217 9.609C9.93699 8.925 9.64766 8.24467 9.34899 7.568C9.28999 7.434 9.11499 7.338 8.95599 7.319C8.90199 7.31233 8.84799 7.307 8.79399 7.303C8.65972 7.2953 8.52508 7.29664 8.39099 7.307L8.59299 7.3Z" fill="#03B739"/>
                      </svg>
              link to the WhatsApp
            </a-button>

                </a-col>
                
               
              </a-row>
          
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import canvas_3d_model_renderer from "@/components/dashboard/business/my_products/canvas_3d_model_renderer_light.vue"
import {DeleteOutlined ,EditOutlined ,ClockCircleOutlined } from '@ant-design/icons-vue';
export default {
  name: "product_details_store_page_buisness_user",
  components: {
    canvas_3d_model_renderer,
    DeleteOutlined ,EditOutlined ,ClockCircleOutlined
  },
  data() {
  return {
    activeView: '3d',        // Track current view: '3d' or 'image'
    activeImageIndex: null,   // Track which image is selected
    
      cartLoading: false,
      showConsentModal: false,
      clearingCart: false,
      pendingCartItem: null
  }
},
  props: {
    selectedProduct: Object
  },
  methods: {
    
  
    async addToCart() {
      if (!this.selectedProduct || !this.selectedProduct.id) {
        this.$message.error('Product not found');
        return;
      }

      this.cartLoading = true;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}cart/add/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              product_type: 'light',
              product_id: this.selectedProduct.id,
              quantity: 1
            })
          }
        );
        
        const result = await response.json();
        
        if (response.ok) {
          this.$message.success('Added to cart!');
        } else {
          // Check if we need to show consent popup
          if (result.show_consent_popup) {
            this.pendingCartItem = {
              product_type: 'light',
              product_id: this.selectedProduct.id,
              quantity: 1
            };
            this.showConsentModal = true;
          } else {
            this.$message.warning(result.error || result.errors?.[0]?.error || 'Failed to add to cart');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        this.$message.error('Error adding to cart');
      } finally {
        this.cartLoading = false;
      }
    },

    async handleConsentYes() {
      this.clearingCart = true;
      
      try {
        const token = localStorage.getItem('token');
        
        // Clear the cart
        const clearResponse = await fetch(
          `${this.$store.state.root_api}cart/clear/`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (clearResponse.ok) {
          // Cart cleared successfully, now add the new item
          const addResponse = await fetch(
            `${this.$store.state.root_api}cart/add/`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(this.pendingCartItem)
            }
          );
          
          const result = await addResponse.json();
          
          if (addResponse.ok) {
            this.$message.success('Cart cleared and item added successfully!');
            this.showConsentModal = false;
            this.pendingCartItem = null;
          } else {
            this.$message.error(result.error || 'Failed to add item after clearing cart');
          }
        } else {
          this.$message.error('Failed to clear cart');
        }
      } catch (error) {
        console.error('Error:', error);
        this.$message.error('Error clearing cart');
      } finally {
        this.clearingCart = false;
      }
    },

    handleConsentNo() {
      this.showConsentModal = false;
      this.pendingCartItem = null;
      this.$message.info('Item was not added to cart');
    },

    handleImageClick(index) {
      this.activeView = 'image';
      this.activeImageIndex = index;
    },


    handleImageClick(index) {
  this.activeView = 'image';
  this.activeImageIndex = index;
},
    editProduct() {
      this.$emit('edit_product', this.selectedProduct.id)
    },
    deleteProduct() {
      this.$emit('delete_product', this.selectedProduct.id)
    },
    back_product_list() {
      this.$emit('back_product_list', this.selectedProduct.id)
    }
  }
}
</script>