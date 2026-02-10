<template>
  <!-- All Products Used Modal -->
  <a-modal 
    v-model:open="open_products_used_model" 
    centered 
    title="All catalog products used for this home design" 
    style="width: 100%; max-width: 900px;"
    @ok="handleOk"
  >
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
        <a-empty description="You have not used any product in this room here."></a-empty>
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
        <div class="product">
          <div class="product-image-container" @click="viewProduct(product)">
            <img
              :src="$store.state.root_media_api + product.product_image"
              :alt="product.product_title"
              class="product-image"
            />
            <div class="category-badge">{{ product.category_name }}</div>
            <div class="ar-badge">AR</div>
          </div>

          <a-row>
            <a-col span="24">
              <b>{{ product.product_title }}</b>
            </a-col>

            <a-col span="18">Color</a-col>

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
                :style="'background:' + (color.color_hex ? color.color_hex : color.color)"
              ></div>
            </a-col>

            <a-col span="12">Price</a-col>

            <a-col span="12" style="display: flex; justify-content: end; font-weight: 700">
              ${{ product.product_price }}
            </a-col>

            <a-col span="19">
              <a-button
                size="medium"
                block
                @click="this.$router.push('/' + product.business_slug + '/' + product.type + '/' + product.product_id)"
              >
                Product Details
              </a-button>
            </a-col>

            <a-col span="4">
              <a-button style="display: flex; justify-content: center; align-items: center;">
                <HeartOutlined />
              </a-button>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </a-modal>

  <!-- Save to My Designs Modal -->
  <a-modal
    v-model:open="open_SaveToMyDesignes"
    title=""
    footer=""
    centered
    style="width: 100%; max-width: 900px"
    :closable="true"
  >
    <div style="display: flex; align-items: center; flex-direction: column; justify-content: center;">
      <div style="width: 100%; text-align: start; margin-bottom: 20px">
        <h3 style="margin: 0; font-size: 24px; font-weight: 600">Save To My Designs</h3>
        <p style="margin: 5px 0; color: #666">Save your amazing design in your my designs!</p>
      </div>

      <a-row style="width: 100%" :gutter="20">
        <!-- Image Preview -->
        <a-col :sm="24" :xs="24" :lg="10" :md="10">
          <div style="position: relative">
            <img
              :src="afterImage"
              style="
                border-radius: 12px;
                width: 100%;
                max-height: 400px;
                object-fit: cover;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              "
              alt="Room Design"
            />
            <div
              style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 8px;
                padding: 5px 10px;
                color: white;
                font-size: 12px;
              "
            >
              Preview
            </div>
          </div>
        </a-col>

        <!-- Form Section -->
        <a-col
          :sm="24"
          :xs="24"
          :lg="14"
          :md="14"
          style="
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            min-height: 400px;
          "
        >
          <div style="flex: 1">
            <!-- Title Input -->
            <!-- <div style="margin-bottom: 20px">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">
                Describe Room <span style="color: red">*</span>
              </label>
              <a-input
                v-model:value="form.description_room"
                placeholder="Give your design an attractive description here ..."
                size="large"
                :maxlength="200"
                show-count
                style="border-radius: 8px"
              />
            </div> -->

            <!-- Room Info Display -->
            <div
              style="
                background: #f8f9fa;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
              "
            >
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#666">
                  <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                  />
                </svg>
                <span style="font-weight: 500; color: #333">Room Details</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 15px; font-size: 14px; color: #666">
                <!-- Style Select -->
                <div>
                  <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #333;">
                    <strong>Style:</strong>
                  </label>
                  <a-select 
                    v-model:value="form.home_design_room_style"
                    style="width: 100%"
                  >
                    <a-select-option value="Modern">Modern</a-select-option>
                    <a-select-option value="Classic">Classic</a-select-option>
                    <a-select-option value="Rustic">Rustic</a-select-option>
                    <a-select-option value="Industrial">Industrial</a-select-option>
                    <a-select-option value="Minimalist">Minimalist</a-select-option>
                    <a-select-option value="Traditional">Traditional</a-select-option>
                    <a-select-option value="Contemporary">Contemporary</a-select-option>
                    <a-select-option value="Vintage">Vintage</a-select-option>
                  </a-select>
                </div>

                <!-- Room Type Select -->
                <div>
                  <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #333;">
                    <strong>Room Type:</strong>
                  </label>
                  <a-select 
                    v-model:value="form.home_design_room_type"
                    style="width: 100%"
                  >
                    <a-select-option value="Living Room">Living Room</a-select-option>
                    <a-select-option value="Dinning Room">Dinning Room</a-select-option>
                    <a-select-option value="Kitchen">Kitchen</a-select-option>
                    <a-select-option value="Home Office">Home Office</a-select-option>
                    <a-select-option value="Bedroom">Bedroom</a-select-option>
                    <a-select-option value="Office">Office</a-select-option>
                    <a-select-option value="Rest Room">Rest Room</a-select-option>
                  </a-select>
                </div>

                <!-- Product Count -->
                <div v-if="products_used.length">
                  <strong>Products:</strong>
                  {{ products_used.length }} items
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px; margin-top: 20px">
            <a-button
              type="default"
              size="large"
              style="flex: 1; border-radius: 8px; height: 48px"
              @click="closeShareModal"
            >
              Cancel
            </a-button>
            <a-button
              type="primary"
              size="large"
              :loading="saveLoading"
              :disabled="!form.home_design_room_type || !form.home_design_room_style"
              @click="SaveToMyDesignes"
              style="
                flex: 2;
                border-radius: 8px;
                height: 48px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
              "
            >
              <svg v-if="!saveLoading" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M17.125 5.64648C17.125 6.95816 16.0617 8.02148 14.75 8.02148C13.4383 8.02148 12.375 6.95816 12.375 5.64648C12.375 4.33481 13.4383 3.27148 14.75 3.27148C16.0617 3.27148 17.125 4.33481 17.125 5.64648Z"
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M7.625 10C7.625 11.3117 6.56167 12.375 5.25 12.375C3.93833 12.375 2.875 11.3117 2.875 10C2.875 8.68829 3.93833 7.625 5.25 7.625C6.56167 7.625 7.625 8.68829 7.625 10Z"
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M17.125 14.3535C17.125 15.6652 16.0617 16.7285 14.75 16.7285C13.4383 16.7285 12.375 15.6652 12.375 14.3535C12.375 13.0418 13.4383 11.9785 14.75 11.9785C16.0617 11.9785 17.125 13.0418 17.125 14.3535Z"
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M7.40625 9.00937L12.5521 6.63477M7.40625 10.9889L12.5521 13.3635"
                  stroke="white"
                  stroke-width="1.5"
                />
              </svg>
              {{ saveLoading ? "Saving..." : "Save To My Designs" }}
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>

  <div class="min-h-screen !bg-gray-50">
    <!-- Mobile & Desktop Layout -->
    <div class="max-w-[1400px] !mx-auto !p-4 md:!p-6">
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] !gap-6">
        
        <!-- LEFT SECTION - Image Preview -->
        <div class="space-y-4">
          <!-- Back Button -->
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
          </div>

          <!-- Main Image -->
          <div class="!bg-white !rounded-2xl overflow-hidden !shadow-sm">
            <img 
              :src="afterImage" 
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
                <img :src="$store.state.root_media_api + thumb" alt="Thumbnail" class="w-full h-full object-cover" />
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
          <div class="!bg-white !p-6 !rounded-lg">
            <h2 class="!text-xl md:!text-2xl text-center !font-semibold !text-gray-900 !mb-1">
              Congratulation!
            </h2>
            <p class="!text-gray-600 text-center !text-sm md:!text-base">
              Your photo already set.
            </p>
          </div>

          <!-- Share Project Card -->
          <div class="!bg-[#F2F2F2] rounded-xl !p-6">
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

          <!-- Detail Staging & Product Card -->
          <div class="!bg-[#F2F2F2] !rounded-xl">
            <!-- Detail Staging Card -->
            <div class="!p-6 !border-b !border-gray-200">
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
            <div class="!p-6">
              <h3 class="!font-bold !text-gray-900 !mb-4">Product</h3>
              
              <div class="flex !gap-4 !mb-4" v-if="products_used.length">
                <img 
                  :src="$store.state.root_media_api + products_used[0].product_image" 
                  alt="Product" 
                  class="w-16 h-16 object-cover !rounded-lg flex-shrink-0"
                />
                <div class="flex-1">
                  <h4 class="!font-semibold !text-gray-900 !mb-1">
                    {{ products_used[0].product_title }}
                  </h4>
                  <a-button 
                    type="text"
                    @click="this.$router.push('/' + products_used[0].business_slug + '/' + products_used[0].type + '/' + products_used[0].product_id)"
                    class="!text-sm !text-blue-600 hover:!text-blue-700 !font-medium !p-0"
                  >
                    Product Detail
                  </a-button>
                </div>
              </div>

              <button 
                @click="open_products_used_model = true"
                class="w-full flex items-center justify-center !gap-2 !bg-white !border !border-blue-600 !text-blue-600 hover:!bg-blue-50 !px-4 !py-3 !rounded-lg !font-medium transition-all !mb-4"
              >
                See all catalog products
              </button>

              <a
                @click="AddHomeDesignItemstocart"
                class="
                  flex items-center justify-center gap-2
                  !text-sm
                  !text-blue-600 hover:!text-blue-700
                  !font-medium
                  cursor-pointer
                  !mb-4
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
            @click="open_SaveToMyDesignes = true"
            class="w-full !mt-3 !bg-blue-600 hover:!bg-blue-700 !text-white !px-6 !py-4 !rounded-lg !text-base transition-all !shadow-sm"
          >
            Save to My Design
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { HeartOutlined } from "@ant-design/icons-vue";

export default {
  name: 'HomeDesignApplyChanges',
  data() {
    return {
      // Modal states
      open_products_used_model: false,
      open_SaveToMyDesignes: false,

      // Images
      beforeImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
      thumbnails: [],
      selectedThumb: 0,

      // Products and design data
      products_used: [],
      roomType: 'Dinning Room',
      style: 'Modern',

      // Form data for saving design
      form: {
        description_room: '',
        home_design_room_type: 'Living Room',
        home_design_room_style: 'Modern'
      },

      // Loading states
      saveLoading: false,
      loading: false,
      addingToCart: false,

      // Error handling
      error: {
        room: null
      }
    };
  },

  components: {
    HeartOutlined,
  },

  mounted() {
    const homeDesignId = this.$route.params.id;
    if (homeDesignId) {
      this.getHomeDesignItem(homeDesignId);
    }
  },

  methods: {
    /**
     * Fetch home design details including images and products
     */
    async getHomeDesignItem(home_design_id) {
      this.loading = true;
      this.error.room = null;

      try {
        const response = await fetch(
          `${this.$store.state.root_api}engine/get-home-design-history/${home_design_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('token')}`,
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          this.thumbnails = result.images;
          // Convert thumbnail URL from 100x100 to 800x600
          this.afterImage = this.$store.state.root_media_api + this.thumbnails[0].replace('w=100&h=100', 'w=800&h=600');
          this.products_used = result.products_used || [];
          
          // Set default room type and style from data if available
          if (result.home_design_room_type) {
            this.form.home_design_room_type = result.home_design_room_type;
            this.roomType = result.home_design_room_type;
          }
          if (result.home_design_room_style) {
            this.form.home_design_room_style = result.home_design_room_style;
            this.style = result.home_design_room_style;
          }
        } else {
          throw new Error(result.message || 'Failed to fetch home design');
        }
      } catch (error) {
        console.error('Error fetching home design:', error);
        this.error.room = error.message;
        this.$message.error('Failed to load home design');
      } finally {
        this.loading = false;
      }
    },

    /**
     * Save design to my designs
     */
    async SaveToMyDesignes() {
      // Validate required fields
      // if (!this.form.description_room.trim()) {
      //   this.$message.error('Please provide a room description');
      //   return;
      // }

      if (!this.form.home_design_room_type) {
        this.$message.error('Please select a room type');
        return;
      }

      if (!this.form.home_design_room_style) {
        this.$message.error('Please select a design style');
        return;
      }

      this.saveLoading = true;
      this.error.room = null;

      try {
        const homeDesignId = this.$route.params.id;
        const url = `${this.$store.state.root_api}engine/home-designs-add-new-home-design-to-my-design/save/`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            home_design_id: homeDesignId,
            home_design_room_type: this.form.home_design_room_type,
            home_design_room_style: this.form.home_design_room_style,
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        if (responseData && !responseData.error) {
          this.$message.success('Design saved successfully!');
          this.open_SaveToMyDesignes = false;
          
          // Reset form after successful save
          this.form.description_room = '';
          
          // Optional: Navigate to my designs or show success
          // this.$router.push('/my-designs');
        } else {
          throw new Error(responseData.message || 'Failed to save design');
        }
      } catch (error) {
        console.error('Error saving design:', error);
        this.error.room = error.message;
        this.$message.error(error.message || 'Failed to save design');
      } finally {
        this.saveLoading = false;
      }
    },

    /**
     * Select thumbnail and update main image
     */
    selectThumbnail(index) {
      this.selectedThumb = index;
      this.afterImage = this.$store.state.root_media_api + this.thumbnails[index].replace('w=100&h=100', 'w=800&h=600');
    },

    /**
     * Regenerate images (placeholder)
     */
    regenerateImages() {
      this.$message.info('Regenerating images...');
    },

    /**
     * Add home design items to cart
     */
    async AddHomeDesignItemstocart() {
      if (!this.products_used || this.products_used.length === 0) {
        this.$message.warning('No products to add to cart');
        return;
      }

      this.addingToCart = true;

      try {
        const response = await fetch(
          `${this.$store.state.root_api}cart/add-home-design/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              products_used: this.products_used
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          this.$message.success('Home design items added to cart successfully!');
        } else {
          this.$message.error(data.message || 'Failed to add items to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.$message.error('An error occurred while adding items to cart');
      } finally {
        this.addingToCart = false;
      }
    },

    /**
     * Close save modal
     */
    closeShareModal() {
      this.open_SaveToMyDesignes = false;
      this.form.description_room = '';
    },

    /**
     * Handle modal ok button (not used with custom footer)
     */
    handleOk() {
      this.open_products_used_model = false;
    },

    /**
     * View product details
     */
    viewProduct(product) {
      console.log('Viewing product:', product);
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

.product-image-container {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
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