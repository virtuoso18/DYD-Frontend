<template>
  <div>
    <!-- Header -->
    <a-page-header 
      :title="selectedProduct.name" 
      @back="back_product_list"
    >
      <template #extra>
        <a-button> 
          <template #icon> 
            <ClockCircleOutlined/>
          </template>
          Create Variation
        </a-button>
      </template>
    </a-page-header>

    <!-- Main Content -->
    <a-row :gutter="[24, 24]">
      <!-- Left Column - Product Images -->
      <a-col :xs="24" :md="12">
        <!-- Main Product Image -->
        <div style="position: relative; padding: 10px;">
          <img 
            :src="$store.state.root_api + mainImageSrc"
            :alt="selectedProduct.name"
            style="width: 100%; max-height: 500px; height: 400px; border-radius: 10px; object-fit: cover; border: 1px solid #e9ecef;"
          />
          <div
            style="position: absolute; bottom: 15px; right: 15px; background: white; padding: 8px 12px; border-radius: 6px; border: 1px solid #e9ecef; font-size: 12px; font-weight: 600; cursor: pointer;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" style="margin-right: 5px; vertical-align: middle;">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21,15 16,10 5,21"></polyline>
            </svg>
            Product View
          </div>
        </div>

        <!-- Additional Images Section -->
        <a-card title="Product Images" style="margin-top: 16px;" v-if="selectedProduct.images && selectedProduct.images.length > 0">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <div 
              v-for="img in selectedProduct.images" 
              :key="img.id"
              style="position: relative; cursor: pointer;"
              @click="selectMainImage(img.image)"
            >
              <img 
                :src="$store.state.root_media_api + img.image"
                :alt="img.alt_text"
                style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid #d9d9d9;"
              />
              <!-- Primary image indicator -->
              <div 
                v-if="img.is_primary"
                style="position: absolute; top: 4px; right: 4px; background: #52c41a; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px;"
              >
                ★
              </div>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- Right Column - Product Details -->
      <a-col :xs="24" :md="12">
        <a-card>
          <!-- Product Title and Description -->
          <a-tag color="blue" style="margin-bottom: 16px;">
            {{ selectedProduct.category?.name || 'Product' }} Details
          </a-tag>
          <h1 style="font-size: 28px; margin-bottom: 16px;">{{ selectedProduct.name }}</h1>
          <p v-if="selectedProduct.description" style="color: #666; line-height: 1.6; margin-bottom: 24px;">
            {{ selectedProduct.description }}
          </p>
          <p v-else-if="selectedProduct.short_description" style="color: #666; line-height: 1.6; margin-bottom: 24px;">
            {{ selectedProduct.short_description }}
          </p>

          <!-- Basic Info -->
          <a-row :gutter="16" style="margin-bottom: 24px;">
            <a-col :span="12">
              <a-statistic 
                title="Category" 
                :value="selectedProduct.category?.name || 'Not specified'" 
                :value-style="{ fontSize: '16px', fontWeight: '600' }"
              />
            </a-col>
            <a-col :span="12">
              <a-statistic 
                title="Furniture Type" 
                :value="selectedProduct.furniture_type || 'Not specified'" 
                :value-style="{ fontSize: '16px', fontWeight: '600' }"
              />
            </a-col>
          </a-row>

          <!-- Technical Specifications -->
          <a-descriptions title="Technical Specifications" :column="1" size="small" style="margin-bottom: 24px;">
            <a-descriptions-item v-if="selectedProduct.dimensions?.width" label="Width">
              {{ selectedProduct.dimensions.width }} cm
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedProduct.dimensions?.height" label="Height">
              {{ selectedProduct.dimensions.height }} cm
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedProduct.dimensions?.length" label="Length">
              {{ selectedProduct.dimensions.length }} cm
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedProduct.dimensions?.depth" label="Depth">
              {{ selectedProduct.dimensions.depth }} cm
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedProduct.dimensions?.weight" label="Weight">
              {{ selectedProduct.dimensions.weight }} kg
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedProduct.model_number" label="Model Number">
              {{ selectedProduct.model_number }}
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedProduct.brand" label="Brand">
              {{ selectedProduct.brand }}
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedProduct.material" label="Material">
              {{ selectedProduct.material }}
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedProduct.created_at" label="Created">
              {{ formatDate(selectedProduct.created_at) }}
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedProduct.updated_at" label="Last Updated">
              {{ formatDate(selectedProduct.updated_at) }}
            </a-descriptions-item>
          </a-descriptions>

          <!-- Colors Section -->
          <div style="margin-bottom: 24px;" v-if="selectedProduct.colors?.available_colors && selectedProduct.colors.available_colors.length > 0">
            <div style="margin-bottom: 8px; font-weight: 500;">Available Colors:</div>
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <a-tooltip 
                v-for="color in selectedProduct.colors.available_colors" 
                :key="color.id"
                :title="color.color"
              >
                <div
                  :style="{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: color.color,
                    border: '2px solid #f0f0f0',
                    cursor: 'pointer'
                  }"
                ></div>
              </a-tooltip>
            </div>
          </div>
         
          <!-- Price Section -->
          <a-card 
            v-if="selectedProduct.pricing"
            size="small" 
            style="margin-bottom: 24px; background: #fafafa;"
          >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <div>
                <div style="color: #666; font-size: 14px;">Price</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span 
                    style="font-size: 24px; font-weight: 700; color: #1890ff;"
                  >
                    ${{ selectedProduct.pricing.current_price || selectedProduct.pricing.price }}
                  </span>
                  <span 
                    v-if="selectedProduct.pricing.sale_price && selectedProduct.pricing.is_on_sale"
                    style="font-size: 16px; color: #999; text-decoration: line-through;"
                  >
                    ${{ selectedProduct.pricing.price }}
                  </span>
                </div>
              </div>

            </div>
          </a-card>

          <!-- Additional Information -->


          <!-- Action Buttons -->
          <a-row :gutter="12">
            <a-col :span="12">
              <a-button 
              v-if="product_access_recieved.update"
                type="primary" 
                block
                @click="editProduct()"
              > 
                <template #icon> 
                  <EditOutlined/>
                </template>
                Edit Product
              </a-button>
            </a-col>
            <a-col :span="12">
              <a-button 
              v-if="product_access_recieved.delete"
                type="default" 
                danger
                block
                @click="deleteProduct()"
              > 
                <template #icon> 
                  <DeleteOutlined/>
                </template>
                Delete Product
              </a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { ClockCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue';

export default {
    name:"product_details_component",
    components: {
        ClockCircleOutlined,
        EditOutlined,
        DeleteOutlined,
    },
    props: {
        selectedProduct: {
        type: Object,
        required: true
        }
    },
  setup(props, { emit }) {
    // Reactive ref for current main image
    const currentMainImage = ref(null);

    // Computed property for main image source
    const mainImageSrc = computed(() => {
      // If user has selected a different image, use that
      if (currentMainImage.value) {
        return getImageUrl(currentMainImage.value);
      }

      // Use primary_image if available
      if (props.selectedProduct.primary_image) {
        return getImageUrl(props.selectedProduct.primary_image);
      }
      
      // Fallback to primary product image from images array
      if (props.selectedProduct.images && props.selectedProduct.images.length > 0) {
        const primaryImage = props.selectedProduct.images.find(img => img.is_primary);
        if (primaryImage) {
          return getImageUrl(primaryImage.image);
        }
        return getImageUrl(props.selectedProduct.images[0].image);
      }
      
      return '/placeholder-product.jpg'; // Fallback placeholder
    });

    // Helper function to get full image URL
    const getImageUrl = (imagePath) => {
      if (!imagePath) return '/placeholder-product.jpg';
      
      // If it's already a full URL, return as is
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      
      // If it starts with '/', remove it to avoid double slashes
      const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      return `${cleanPath}`;
    };

    // Format date helper
    const formatDate = (dateString) => {
      if (!dateString) return 'Unknown';
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'Invalid Date';
      }
    };

    // Select main image
    const selectMainImage = (imagePath) => {
      currentMainImage.value = imagePath;
      console.log('Selected image:', imagePath);
    };

    // Navigation and actions
    const back_product_list = () => {
      emit('back_product_list', props.selectedProduct.id)
    };

    const editProduct = () => {
      emit('edit_product', props.selectedProduct.id)
    };

    const deleteProduct = () => {
      // emit('delete_product', props.selectedProduct.id)
      emit('delete_product', {"product_id":props.selectedProduct.id,"product_type":"Light"})

    };

    return {
      mainImageSrc,
      getImageUrl,
      formatDate,
      selectMainImage,
      back_product_list,
      editProduct,
      deleteProduct
    };
  }
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