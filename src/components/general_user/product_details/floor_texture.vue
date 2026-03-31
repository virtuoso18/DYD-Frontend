<template>
  <a-modal
    v-model:open="showConsentModal"
    title="Clear Cart?"
    :closable="false"
    :maskClosable="false"
  >
    <p>
      Your cart contains items from a different seller. Do you want to clear the
      cart first in order to add this item?
    </p>
    <template #footer>
      <a-button @click="handleConsentNo" :disabled="clearingCart">No</a-button>
      <a-button type="primary" @click="handleConsentYes" :loading="clearingCart"
        >Yes</a-button
      >
    </template>
  </a-modal>
  <!-- {{ selectedTexture }} -->
  <div>
    <!-- Header -->
    <a-page-header :title="selectedTexture.title" @back="this.$router.back()">
      <!-- <template #extra>
        <a-button> 
          <template #icon> 
            <ClockCircleOutlined/>
          </template>
          Create Variation
        </a-button>
      </template> -->
    </a-page-header>

    <!-- Main Content -->
    <a-row :gutter="[24, 24]">
      <!-- Left Column - Texture Images -->
      <a-col :xs="24" :md="12">
        <!-- Main Texture Image -->
        <div style="position: relative; padding: 10px">
          <img
            :src="$store.state.root_api + mainImageSrc"
            :alt="selectedTexture.title"
            style="
              width: 100%;
              max-height: 500px;
              height: 400px;
              border-radius: 10px;
              object-fit: cover;
              border: 1px solid #e9ecef;
            "
          />
          <div
            style="
              position: absolute;
              bottom: 15px;
              right: 15px;
              background: white;
              padding: 8px 12px;
              border-radius: 6px;
              border: 1px solid #e9ecef;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              style="margin-right: 5px; vertical-align: middle"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21,15 16,10 5,21"></polyline>
            </svg>
            Texture View
          </div>
        </div>

        <!-- Additional Images Section -->
        <a-card
          title="Product Images"
          style="margin-top: 16px"
          v-if="
            selectedTexture.product_images &&
            selectedTexture.product_images.length > 0
          "
        >
          <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <div
              v-for="img in selectedTexture.product_images"
              :key="img.id"
              style="position: relative; cursor: pointer"
              @click="selectMainImage(img.image)"
            >
              <img
                :src="this.$store.state.root_media_api + img.image"
                :alt="img.alt_text"
                style="
                  width: 80px;
                  height: 80px;
                  border-radius: 8px;
                  object-fit: cover;
                  border: 1px solid #d9d9d9;
                "
              />
              <!-- Primary image indicator -->
              <div
                v-if="img.is_primary"
                style="
                  position: absolute;
                  top: 4px;
                  right: 4px;
                  background: #52c41a;
                  color: white;
                  border-radius: 50%;
                  width: 16px;
                  height: 16px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                "
              >
                ★
              </div>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- Right Column - Texture Details -->
      <a-col :xs="24" :md="12">
        <a-card>
          <!-- Texture Title and Description -->
          <div class="!flex !justify-between">
            <a-tag color="blue" style="margin-bottom: 16px">
              {{ selectedTexture.texture_owner_display ? "Floor" : "Floor" }}
              Texture Details
            </a-tag>
            <div class="!flex gap-2">
              <a-button
                type="primary"
                shape="circle"
                size="large"
                title="Add to Cart"
                :disabled="anonyomusUser === null"
                block
                @click="addToCart"
                :loading="cartLoading"
                style="
                  display: flex;
                  gap: 10px;
                  justify-content: center;
                  align-items: center;
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  
                >
                  <path
                    d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M13 13V11M13 11V9M13 11H15M13 11H11"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M2 3L2.26121 3.09184C3.5628 3.54945 4.2136 3.77826 4.58584 4.32298C4.95808 4.86771 4.95808 5.59126 4.95808 7.03836V9.76C4.95808 12.7016 5.02132 13.6723 5.88772 14.5862C6.75412 15.5 8.14857 15.5 10.9375 15.5H12M16.2404 15.5C17.8014 15.5 18.5819 15.5 19.1336 15.0504C19.6853 14.6008 19.8429 13.8364 20.158 12.3075L20.6578 9.88275C21.0049 8.14369 21.1784 7.27417 20.7345 6.69708C20.2906 6.12 18.7738 6.12 17.0888 6.12H11.0235M4.95808 6.12H7"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </a-button>
              <a-button
                shape="circle"
                @click="toggleFavorite(selectedProduct, 'floor_texture')"
                :disabled="anonyomusUser === null"
                type="default"
                block
                size="large"
                style="
                  display: flex;
                  gap: 10px;
                  justify-content: center;
                  align-items: center;
                "
              >
                <div
                  style="
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    align-items: center;
                  "
                  v-if="selectedProduct?.is_favorited"
                >
                  <HeartFilled
                    class="!text-red-500 text-[16px] -translate-y-0.5 leading-none"
                  />
                </div>
                <div
                  style="
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    align-items: center;
                  "
                  v-else
                >
                  <HeartOutlined
                    class="text-[16px] leading-none text-gray-600"
                  />
                </div>
              </a-button>
            </div>
           
          </div>
          <h1 style="font-size: 28px; margin-bottom: 16px">
            {{ selectedTexture.title }}
          </h1>
          <p
            v-if="selectedTexture.description"
            style="color: #666; line-height: 1.6; margin-bottom: 24px"
          >
            {{ selectedTexture.description }}
          </p>

          <!-- Basic Info -->
          <a-row :gutter="16" style="margin-bottom: 24px">
            <a-col :span="12">
              <a-statistic
                title="Style"
                :value="selectedTexture.texture_style || 'Not specified'"
                :value-style="{ fontSize: '16px', fontWeight: '600' }"
              />
            </a-col>
            <a-col :span="12">
              <a-statistic
                title="Created By"
                :value="selectedTexture.texture_owner_display || 'Unknown'"
                :value-style="{ fontSize: '16px', fontWeight: '600' }"
              />
            </a-col>
          </a-row>

          <div style="margin-bottom: 20px">
            <h4 style="font-weight: normal">Dimensions</h4>
            <span v-if="selectedTexture.size_width" style="font-weight: bold">
              {{ selectedTexture.size_width }} m in W X&nbsp;</span
            >
            <span v-if="selectedTexture.size_width" style="font-weight: bold">
              {{ selectedTexture.size_width }} m in H X&nbsp;</span
            >
          </div>

          <!-- Technical Specifications (Only show if data exists) -->
          <!-- <a-descriptions title="Technical Specifications" :column="1" size="small" style="margin-bottom: 24px;">
            <a-descriptions-item v-if="selectedTexture.size_width" label="Size Width">
              {{ selectedTexture.size_width }} cm
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedTexture.size_width" label="Size Height">
              {{ selectedTexture.size_width }} cm
            </a-descriptions-item> -->
          <!-- <a-descriptions-item v-if="selectedTexture.tile_width" label="Tile Width">
              {{ selectedTexture.tile_width }} cm
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedTexture.tile_height" label="Tile Height">
              {{ selectedTexture.tile_height }} cm
            </a-descriptions-item> -->
          <!-- <a-descriptions-item v-if="selectedTexture.created_at" label="Created">
              {{ formatDate(selectedTexture.created_at) }}
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedTexture.updated_at" label="Last Updated">
              {{ formatDate(selectedTexture.updated_at) }}
            </a-descriptions-item> -->
          <!-- </a-descriptions> -->

          <!-- Colors Section -->
          <div
            style="margin-bottom: 24px"
            v-if="
              selectedTexture.associated_colors &&
              selectedTexture.associated_colors.length > 0
            "
          >
            <div style="margin-bottom: 8px; font-weight: 500">
              Available Colors:
            </div>
            <div
              style="
                display: flex;
                gap: 8px;
                align-items: center;
                flex-wrap: wrap;
              "
            >
              <a-tooltip
                v-for="color in selectedTexture.associated_colors"
                :key="color.id"
                :title="color.title + ' (' + color.color_hex + ')'"
              >
                <div
                  :style="{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: color.color_hex,
                    border: '2px solid #f0f0f0',
                    cursor: 'pointer',
                  }"
                ></div>
              </a-tooltip>
            </div>
          </div>

          <!-- Status Information -->
          <!-- <a-row :gutter="16" style="margin-bottom: 24px;">
            <a-col :span="8">
              <div style="margin-bottom: 8px; color: #666; font-size: 14px;">Status</div>
              <a-tag :color="selectedTexture.is_active ? 'green' : 'red'">
                {{ selectedTexture.is_active ? 'Active' : 'Inactive' }}
              </a-tag>
            </a-col>
            <a-col :span="8" v-if="selectedTexture.is_in_stock !== undefined">
              <div style="margin-bottom: 8px; color: #666; font-size: 14px;">Stock Status</div>
              <a-tag :color="selectedTexture.is_in_stock ? 'green' : 'red'">
                {{ selectedTexture.is_in_stock ? 'In Stock' : 'Out of Stock' }}
              </a-tag>
            </a-col>
            <a-col :span="8">
              <div style="margin-bottom: 8px; color: #666; font-size: 14px;">Features</div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <a-tag v-if="selectedTexture.is_featured" color="gold" size="small">Featured</a-tag>
                <a-tag v-if="selectedTexture.is_premium" color="purple" size="small">Premium</a-tag>
                <a-tag v-if="selectedTexture.is_on_sale" color="red" size="small">On Sale</a-tag>
              </div>
            </a-col>
          </a-row> -->

          <div>
            <div style="color: #666; font-size: 14px">Price</div>
            <div style="display: flex; align-items: center; gap: 8px">
              <span
                v-if="selectedTexture.sale_price_per_sqm"
                style="color: #1890ff; font-size: 24px; font-weight: 700"
              >
                ${{ selectedTexture.sale_price_per_sqm }}
              </span>
            </div>
          </div>
          <br />
          <a-row :gutter="8">
            <a-col :span="10">
              <!-- Simple Add to Cart Button 
                    <a-button 
                      type="primary" 
                      block
                      @click="addToCart"
                      :loading="cartLoading"
                      style="display:flex;gap:10px;justify-content: center;align-items: center;"
                    >

                      <!-- <template #icon> 
                        <svg v-if="!cartLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="9" cy="21" r="1"/>
                          <circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                      <!-- </template> -
                      Add to Cart
                    </a-button> -->
              <a-button
                type="primary"
                block
                @click="this.handleSeeInRoom"
                style="
                  display: flex;
                  gap: 10px;
                  justify-content: center;
                  align-items: center;
                "
              >
                See in your room
              </a-button>
            </a-col>

            <a-col :span="10">
               <a-button
              type="default"
              block
              @click="openWhatsApp"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
              "
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.001 2C17.524 2 22.001 6.477 22.001 12C22.001 17.523 17.524 22 12.001 22C10.2337 22.003 8.49757 21.5353 6.97099 20.645L2.00499 22L3.35699 17.032C2.46595 15.5049 1.99789 13.768 2.00099 12C2.00099 6.477 6.47799 2 12.001 2ZM8.59299 7.3L8.39299 7.308C8.26368 7.31691 8.13734 7.35087 8.02099 7.408C7.91257 7.46951 7.81355 7.5463 7.72699 7.636C7.60699 7.749 7.53899 7.847 7.46599 7.942C7.09611 8.4229 6.89696 9.01331 6.89999 9.62C6.90199 10.11 7.02999 10.587 7.22999 11.033C7.63899 11.935 8.31199 12.89 9.19999 13.775C9.41399 13.988 9.62399 14.202 9.84999 14.401C10.9534 15.3724 12.2683 16.073 13.69 16.447L14.258 16.534C14.443 16.544 14.628 16.53 14.814 16.521C15.1052 16.5056 15.3895 16.4268 15.647 16.29C15.7778 16.2223 15.9056 16.1489 16.03 16.07C16.03 16.07 16.0723 16.0413 16.155 15.98C16.29 15.88 16.373 15.809 16.485 15.692C16.569 15.6053 16.639 15.5047 16.695 15.39C16.773 15.227 16.851 14.916 16.883 14.657C16.907 14.459 16.9 14.351 16.897 14.284C16.893 14.177 16.804 14.066 16.707 14.019L16.125 13.758C16.125 13.758 15.255 13.379 14.723 13.137C14.6673 13.1128 14.6077 13.0989 14.547 13.096C14.4786 13.0888 14.4094 13.0965 14.3442 13.1184C14.279 13.1403 14.2192 13.176 14.169 13.223C14.164 13.221 14.097 13.278 13.374 14.154C13.3325 14.2098 13.2753 14.2519 13.2098 14.2751C13.1443 14.2982 13.0733 14.3013 13.006 14.284C12.9408 14.2666 12.877 14.2446 12.815 14.218C12.691 14.166 12.648 14.146 12.563 14.11C11.9889 13.8599 11.4574 13.5215 10.988 13.107C10.862 12.997 10.745 12.877 10.625 12.761C10.2316 12.3842 9.88874 11.958 9.60499 11.493L9.54599 11.398C9.50425 11.3338 9.47003 11.265 9.44399 11.193C9.40599 11.046 9.50499 10.928 9.50499 10.928C9.50499 10.928 9.74799 10.662 9.86099 10.518C9.97099 10.378 10.064 10.242 10.124 10.145C10.242 9.955 10.279 9.76 10.217 9.609C9.93699 8.925 9.64766 8.24467 9.34899 7.568C9.28999 7.434 9.11499 7.338 8.95599 7.319C8.90199 7.31233 8.84799 7.307 8.79399 7.303C8.65972 7.2953 8.52508 7.29664 8.39099 7.307L8.59299 7.3Z"
                  fill="#03B739"
                />
              </svg>
              Contact on WhatsApp
            </a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons-vue";
import { computed } from "vue";

export default {
  name: "TextureDetails",
  components: {
    ClockCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    HeartOutlined,
    HeartFilled,
  },
  props: {
    selectedTexture: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cartLoading: false,
      showConsentModal: false,
      anonyomusUser:localStorage.getItem('token'),

      cartLoading: false,
      showConsentModal: false,
      clearingCart: false,
      pendingCartItem: null,
    };
  },
  setup(props, { emit }) {
    // Computed property for main image source
    const mainImageSrc = computed(() => {
      if (props.selectedTexture.texture_image) {
        return getImageUrl(props.selectedTexture.texture_image);
      }

      // Fallback to primary product image
      if (
        props.selectedTexture.product_images &&
        props.selectedTexture.product_images.length > 0
      ) {
        const primaryImage = props.selectedTexture.product_images.find(
          (img) => img.is_primary,
        );
        if (primaryImage) {
          return getImageUrl(primaryImage.image);
        }
        return getImageUrl(props.selectedTexture.product_images[0].image);
      }

      return "/placeholder-texture.jpg"; // Fallback placeholder
    });

    // Helper function to get full image URL
    const getImageUrl = (imagePath) => {
      if (!imagePath) return "/placeholder-texture.jpg";

      // If it's already a full URL, return as is
      if (imagePath.startsWith("http")) {
        return imagePath;
      }

      // If it starts with '/', remove it to avoid double slashes
      const cleanPath = imagePath.startsWith("/")
        ? imagePath.slice(1)
        : imagePath;
      return `${cleanPath}`;
    };

    // Format date helper
    const formatDate = (dateString) => {
      if (!dateString) return "Unknown";
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        return "Invalid Date";
      }
    };

    // Select main image
    const selectMainImage = (imagePath) => {
      console.log("Selected image:", imagePath);
    };

    // Navigation and actions
    const back_texture_list = () => {
      emit("back_product_list", props.selectedTexture.id);
    };

    const editTexture = () => {
      emit("edit_texture", props.selectedTexture.id);
    };

    const deleteTexture = () => {
      emit("delete_product", { product_id: props.selectedTexture.id });
    };

    return {
      mainImageSrc,
      getImageUrl,
      formatDate,
      selectMainImage,
      back_texture_list,
      editTexture,
      deleteTexture,
    };
  },
  methods: { 
    openWhatsApp() {
      const businessPhone = this.selectedTexture?.product_business_owner_phone;

      const productName = this.selectedTexture.name;
      const productLink = `${this.windowLocation}/store/${this.$route.params.buisness_name}/product/${this.selectedTexture.id}`;

      const message =
        `Hi, I'm interested in this Floor Tiles I saw on DYD.%0A` +
        `%F0%9F%AA%91 Floor Tiles: ${encodeURIComponent(productName)}%0A` +
        `%F0%9F%94%97 Link: ${encodeURIComponent(productLink)}`;

      const url = businessPhone
        ? `https://wa.me/${businessPhone.replace(/\D/g, '')}?text=${message}`
        : `https://wa.me/?text=${message}`;

      window.open(url, '_blank');
    },
    async toggleFavorite(product, product_type) {
      try {
        const token = localStorage.getItem("token");
        console.log(product);
        const response = await fetch(
          `${this.$store.state.root_api}likes/favorites/toggle/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              id: product.id,
              type: product_type,
            }),
          }
        );

        const data = await response.json();

        product.is_favorited = data.favorited;
      } catch (error) {
        console.error("Favorite toggle failed", error);
      }
    },
    handleSeeInRoom() {
      const businessName = this.$route.params.buisness_name;
      const window_name = this.$route.params.window_name;
      const product_type = this.$route.params.product_type;
      const product_id = this.$route.params.product_id;
      this.$router.push({
        path: "/start-new-catalogue",
        query: {
          brand: businessName,
          window_name: "furniture",
          product_type: product_type,
          product_id: product_id,
        },
      });
    },
    async addToCart() {
      if (!this.selectedTexture || !this.selectedTexture.id) {
        this.$message.error("Product not found");
        return;
      }

      this.cartLoading = true;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.$store.state.root_api}cart/add/`, {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_type: "floor_texture",
            product_id: this.selectedTexture.id,
            quantity: 1,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          this.$message.success("Added to cart!");
        } else {
          // Check if we need to show consent popup
          if (result.show_consent_popup) {
            this.pendingCartItem = {
              product_type: "floor_texture",
              product_id: this.selectedTexture.id,
              quantity: 1,
            };
            this.showConsentModal = true;
          } else {
            this.$message.warning(
              result.error ||
                result.errors?.[0]?.error ||
                "Failed to add to cart",
            );
          }
        }
      } catch (error) {
        console.error("Error:", error);
        this.$message.error("Error adding to cart");
      } finally {
        this.cartLoading = false;
      }
    },

    async handleConsentYes() {
      this.clearingCart = true;

      try {
        const token = localStorage.getItem("token");

        // Clear the cart
        const clearResponse = await fetch(
          `${this.$store.state.root_api}cart/clear/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (clearResponse.ok) {
          // Cart cleared successfully, now add the new item
          const addResponse = await fetch(
            `${this.$store.state.root_api}cart/add/`,
            {
              method: "POST",
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(this.pendingCartItem),
            },
          );

          const result = await addResponse.json();

          if (addResponse.ok) {
            this.$message.success("Cart cleared and item added successfully!");
            this.showConsentModal = false;
            this.pendingCartItem = null;
          } else {
            this.$message.error(
              result.error || "Failed to add item after clearing cart",
            );
          }
        } else {
          this.$message.error("Failed to clear cart");
        }
      } catch (error) {
        console.error("Error:", error);
        this.$message.error("Error clearing cart");
      } finally {
        this.clearingCart = false;
      }
    },

    handleConsentNo() {
      this.showConsentModal = false;
      this.pendingCartItem = null;
      this.$message.info("Item was not added to cart");
    },

    handleImageClick(index) {
      this.activeView = "image";
      this.activeImageIndex = index;
    },
  },
};
</script>

<style scoped>
.ant-descriptions-item-label {
  font-weight: 500;
}

.ant-statistic-title {
  font-size: 14px;
  color: #666;
}

.ant-card-head-title {
  font-weight: 600;
}
</style>