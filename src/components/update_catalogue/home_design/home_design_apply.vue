<template>
 <a-modal v-model:open="open_products_used_model" centered title="All catalog products used for this home design " style="width:100%;max-width:900px;" @ok="handleOk">
  <template #footer></template>
  
    <a-row>
      <a-col
        span="24"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 70vh;
        "
        v-if="!products_used.length"
      >
        <a-empty
          description="You have not used any product in this room here."
        ></a-empty>
      </a-col>
      <a-col
        :lg="6"
        :md="8"
        :sm="12"
        :xs="12"
        v-for="product in products_used"
        :key="product.id"
        class="product-responsive"
        style="padding: 5px;"
      >
        <!-- {{product.product_colors}} -->
        <div class="product" style="">
          <div class="product-image-container" @click="viewProduct(product)">
            <img
              :src="$store.state.root_media_api + product.product_image"
              :alt="product.product_title"
              class="product-image"
            />
            <!-- Category Badge -->
            <div class="category-badge">{{ product.category_name }}</div>
            <!-- AR Badge -->
            <div class="ar-badge">AR</div>
          </div>
          <!-- {{ truncateText(product.description || 'No description available', 8) }} -->

          <a-row>
            <a-col span="24">
              <b>{{ product.product_title }}</b>
            </a-col>

            <a-col span="18"> Color </a-col>

            <a-col span="6" style="display: flex; justify-content: end">
              <div
                v-for="(color, index) in product.product_colors.slice(0, 2)"
                :key="index"
                style="
                  width: 20px;
                  height: 20px;
                  border-radius: 20px;
                  margin-left: 2px;
                "
                :style="
                  'background:' +
                  (color.color_hex ? color.color_hex : color.color)
                "
              >
                <!-- {{ color }} -->
              </div>
            </a-col>

            <a-col span="12"> Price </a-col>

            <a-col
              span="12"
              style="display: flex; justify-content: end; font-weight: 700"
            >
              <!-- <del style="font-size: 10px;">${{ product.pricing.price }}</del> -->
              ${{ product.product_price }}
            </a-col>

            <a-col span="19">
              <a-button
              size="medium"
                block
                @click="
                  this.$router.push(
                    '/' +
                      product.business_slug +
                      '/' +
                      product.type +
                      '/' +
                      product.product_id,
                  )
                "
                >Product Details</a-button
              >
            </a-col>

            <!-- <a-col span="1"></a-col> -->

            <a-col span="4">
              <a-button style="display: flex;justify-content: center;align-items: center;"><HeartOutlined /></a-button>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>    
  
  
  

    </a-modal>
    

  <div class="min-h-screen !bg-gray-50">
    <!-- Mobile & Desktop Layout -->
    <div class="max-w-[1400px] !mx-auto !p-4 md:!p-6">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] !gap-6">
        
        <!-- LEFT SECTION - Image Preview -->
        <div class="space-y-4">
          <!-- Back Button & Before/After Toggle -->
          <div class="flex items-center justify-between !mb-4">
            <button 
              @click="$router.go(-1)"
              class="flex items-center !gap-2 !text-gray-700 hover:!text-gray-900 !font-medium"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Back
            </button>

            <!-- Before/After Toggle -->
           
          </div>

          <!-- Main Image -->
          <div class="!bg-white !rounded-2xl overflow-hidden !shadow-sm">
            <img 
              :src="activeView === 'before' ? beforeImage : afterImage" 
              alt="Room Design"
              class="w-full h-auto max-h-[500px] md:max-h-[600px] object-cover"
            />
          </div>

          <!-- Thumbnail Carousel + Regenerate -->
          <div class="sm:flex sm:items-center sm:justify-between !gap-4">
            <!-- Thumbnails -->
            <div class="flex !gap-3 overflow-x-auto !mt-3 flex-1">
              <div 
                v-for="(thumb, index) in thumbnails" 
                :key="index"
                @click="selectThumbnail(index)"
                :class="[
                  'min-w-[80px] w-[80px] h-[80px] md:min-w-[100px] md:w-[100px] md:h-[100px] !rounded-lg overflow-hidden cursor-pointer !border-2 transition-all',
                  selectedThumb === index ? '!border-blue-600' : '!border-gray-200'
                ]"
              >
                <img :src="this.$store.state.root_media_api +thumb" alt="Thumbnail" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Regenerate Button -->
            <button 
              @click="regenerateImages"
              class="flex items-center justify-center w-full sm:justify-start sm:w-auto !text-center !mt-6 sm:!mt-0 !gap-2 !bg-blue-600 hover:!bg-blue-700 !text-white !px-5 !py-3 !rounded-lg !font-medium !text-sm whitespace-nowrap transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13.5 3.5C12.2 2.2 10.2 1.5 8 1.5C4.1 1.5 1 4.6 1 8.5C1 12.4 4.1 15.5 8 15.5C11.4 15.5 14.2 13.1 14.9 9.9"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
                <path
                  d="M11 1.5L13.5 3.5L11.5 6"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Regenerate
            </button>
          </div>
        </div>

        <!-- RIGHT SECTION - Details & Actions -->
        <div class="space-y-4">
          <!-- Congratulations Card -->
          <div class="!bg-white !p-6 ">
            <h2 class="!text-xl md:!text-2xl text-center !font-semibold !text-gray-900 !mb-1">
              Congratulation!
            </h2>
            <p class="!text-gray-600 text-center !text-sm md:!text-base">
              Your photo already set.
            </p>
          </div>

          <!-- Share Project Card -->
          <div class="!bg-[#F2F2F2] rounded-xl  !p-6 ">
            <div class="flex !gap-4">
              <img 
                :src="afterImage" 
                alt="Project Preview" 
                class="w-20 h-20 !rounded-lg object-cover flex-shrink-0"
              />
              <div>
                <h3 class="!font-semibold !text-gray-900 !mb-1">
                  Share your project
                </h3>
                <p class="!text-sm !text-gray-600">
                  Tell your community about the project you created
                </p>
              </div>
            </div>
          </div>
<div className="!bg-[#F2F2F2] !mt-4 rounded-xl">

    <!-- Detail Staging Card -->
    <div class=" !p-6 ">
      <h3 class="!font-bold !text-gray-900 !mb-4">Detail Staging</h3>
      
      <div class="space-y-3">
        <div>
          <p class="!text-sm !text-gray-500 !mb-1">Room type</p>
          <p class="!font-medium !text-gray-900">{{ roomType }}</p>
        </div>
        
        <div>
          <p class="!text-sm !text-gray-500 !mb-1">Style</p>
          <p class="!font-medium !text-gray-900">{{ style }}</p>
        </div>
      </div>
    </div>

    <!-- Product Card -->
    <div class=" !p-6 ">
      <h3 class="!font-bold !text-gray-900 !mb-4">Product</h3>
      
      <div class="flex !gap-4 !mb-4" v-if="products_used.length">
        <!-- {{ products_used?  products_used[0].business_slug :''}}
        {{ products_used?  products_used[0].product_title :''}}
        {{ products_used?  products_used[0].product_colors :''}} -->
        <img 
          :src="this.$store.state.root_media_api+products_used[0].product_image" 
          alt="Product" 
          class="w-16 h-16 object-cover !rounded-lg flex-shrink-0"
        />
        <div class="flex-1">
          <h4 class="!font-semibold !text-gray-900 !mb-1">
            {{ products_used[0].product_title }}
          </h4>
          <a-button type="text"
             @click="this.$router.push('/' +products_used[0].business_slug +'/' +products_used[0].type +'/' +products_used[0].product_id,)"
            class="!text-sm !text-blue-600 hover:!text-blue-700 !font-medium"
          >
            Product Detail
        </a-button>
        </div>
      </div>

      


      <button 
        @click="open_products_used_model=true"
        class="w-full flex items-center justify-center !gap-2 !bg-white !border !border-blue-600 !text-blue-600 hover:!bg-blue-50 !px-4 !py-3 !rounded-lg !font-medium transition-all"
      >
        <!-- <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 11V6L4 11H9ZM9 11V16L14 11H9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 16L4 21M9 16L14 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg> -->
        See all catalog products
      </button>

    <a
  @click="AddHomeDesignItemstocart"
  class="
    flex items-center justify-center gap-2
    !text-sm !mt-4
    !text-blue-600 hover:!text-blue-700
    !font-medium
    !mb-4
    cursor-pointer
  "
>
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.75 0.75H3.38636L5.15273 9.57523C5.213 9.87867 5.37808 10.1512 5.61906 10.3452C5.86005 10.5392 6.1616 10.6423 6.47091 10.6364H12.8773C13.1866 10.6423 13.4881 10.5392 13.7291 10.3452C13.9701 10.1512 14.1352 9.87867 14.1955 9.57523L15.25 4.04545H4.04545M6.68182 13.9318C6.68182 14.2958 6.38673 14.5909 6.02273 14.5909C5.65872 14.5909 5.36364 14.2958 5.36364 13.9318C5.36364 13.5678 5.65872 13.2727 6.02273 13.2727C6.38673 13.2727 6.68182 13.5678 6.68182 13.9318ZM13.9318 13.9318C13.9318 14.2958 13.6367 14.5909 13.2727 14.5909C12.9087 14.5909 12.6136 14.2958 12.6136 13.9318C12.6136 13.5678 12.9087 13.2727 13.2727 13.2727C13.6367 13.2727 13.9318 13.5678 13.9318 13.9318Z"
      stroke="#3B63FB"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <span>Add to cart</span>
</a>

    </div>
</div>

          <!-- Save to My Design Button -->
          <button 
            @click="saveToMyDesign"
            class="w-full !mt-3 !bg-blue-600 hover:!bg-blue-700 !text-white !px-6 !py-4 !rounded-lg  !text-base transition-all !shadow-sm"
          >
            Save to My Design
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

import {    HeartOutlined} from "@ant-design/icons-vue";
export default {
  name: 'HomeDesignApplyChanges',
  data() {
    return {
      activeView: 'after',
      selectedThumb: 0,
      open_products_used_model:false,
      beforeImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
      thumbnails: [ ],
      products_used: [ ],
      roomType: 'Dinning Room',
      style: 'Modern',
      product: {
        name: 'Decaly Coral',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=80&h=80&fit=crop',
      },
      addingToCart : false
    };
  },
    components: {
    HeartOutlined,
  },
  mounted(){
    this.getHomeDesignItem(this.$route.params.id)
  },
  methods: {
    async getHomeDesignItem(home_design_id){
    this.loading = true;
    this.error = null;
    try {
        const response = await fetch(this.$store.state.root_api + 'engine/get-home-design-history/'+home_design_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`,
            }
            // Remove body for GET request
        });

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        
        // Return the data if success is true
        if (result.success) {
          console.log("result images ", result);
           this.thumbnails=result.images
           this.afterImage=this.$store.state.root_media_api + this.thumbnails[0].replace('w=100&h=100', 'w=800&h=600');
           this.products_used=result.products_used
          //  this.afterImage=result.input_image
        } else {
            throw new Error(result.message || 'Failed to fetch home design');
        }
        
    } catch (error) {
        console.error('Error fetching history home design rendered Item:', error);
        throw error; // Re-throw so caller can handle it
    } finally {
        this.loading = false;
    }
},
    selectThumbnail(index) {
      console.log(this.selectedThumb);
      this.selectedThumb =  index;
      this.afterImage = this.$store.state.root_media_api + this.thumbnails[index].replace('w=100&h=100', 'w=800&h=600');
    },
    
    regenerateImages() {
      this.$message.info('Regenerating images...');
    },
    
    // addToCart() {
    //   this.$message.success('Product added to cart!');
    // },
       async AddHomeDesignItemstocart() {
      this.addingToCart = true;

      try {
        const response = await fetch(
          `${this.$store.state.root_api}cart/add-home-design/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              products_used: this.products_used
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          this.$message.success("Home Design items added to cart successfully!");
        } else {
          this.$message.error(data.message || "Failed to add items to cart");
        }
      } catch (error) {
        console.error("Failed to add home design items to cart:", error);
        this.$message.error("An error occurred while adding items to cart");
      } finally {
        this.addingToCart = false;
      }
    },

    saveToMyDesign() {
      this.$message.success('Design saved successfully!');
    }
  }
};
</script>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}

.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

























.product {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f3f2f4;
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
  width: 50%;
  flex: 0 0 50%;
}
</style>
