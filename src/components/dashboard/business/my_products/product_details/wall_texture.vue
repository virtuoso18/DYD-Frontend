<template>
  <!-- {{ selectedTexture }} -->
  <div>
    <!-- Header -->
    <a-page-header 
      :title="selectedTexture.title" 
      @back="back_texture_list"
    >
      <template #extra>
        <!-- <a-button> 
          <template #icon> 
            <ClockCircleOutlined/>
          </template>
          {{ t('texture_details.createVariation') }}
        </a-button> -->
      </template>
    </a-page-header>

    <!-- Main Content -->
    <a-row :gutter="[24, 24]">
      <!-- Left Column - Texture Images -->
      <a-col :xs="24" :md="12">
        <!-- Main Texture Image -->
        <div style="position: relative; padding: 10px;">
          <img 
            :src="$store.state.root_api+mainImageSrc"
            :alt="selectedTexture.title"
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
            {{ t('texture_details.textureView') }}
          </div>
        </div>

        <!-- Additional Images Section -->
        <a-card :title="t('texture_details.productImages')" style="margin-top: 16px;" v-if="selectedTexture.product_images && selectedTexture.product_images.length > 0">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <div 
              v-for="img in selectedTexture.product_images" 
              :key="img.id"
              style="position: relative; cursor: pointer;"
              @click="selectMainImage(img.image)"
            >
              <img 
                :src="$store.state.root_media_api +img.image"
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

      <!-- Right Column - Texture Details -->
      <a-col :xs="24" :md="12">
        <a-card>
          <!-- Texture Title and Description -->
          <a-tag color="blue" style="margin-bottom: 16px;">
            {{ selectedTexture.texture_owner_display ? t('texture_details.wallTextureDetails') : t('texture_details.floorTextureDetails') }}
          </a-tag>
          <h1 style="font-size: 28px; margin-bottom: 16px;">{{ selectedTexture.title }}</h1>
          <p v-if="selectedTexture.description" style="color: #666; line-height: 1.6; margin-bottom: 24px;">
            {{ selectedTexture.description }}
          </p>

          <!-- Basic Info -->
          <a-row :gutter="16" style="margin-bottom: 24px;">
            <a-col :span="12">
              <a-statistic 
                :title="t('texture_details.style')" 
                :value="selectedTexture.texture_style || t('texture_details.notSpecified')" 
                :value-style="{ fontSize: '16px', fontWeight: '600' }"
              />
            </a-col>
            <a-col :span="12">
              <a-statistic 
                :title="t('texture_details.createdBy')" 
                :value="selectedTexture.texture_owner_display || t('texture_details.unknown')" 
                :value-style="{ fontSize: '16px', fontWeight: '600' }"
              />
            </a-col>
          </a-row>

          <!-- Technical Specifications (Only show if data exists) -->
          <a-descriptions :title="t('texture_details.technicalSpecifications')" :column="1" size="small" style="margin-bottom: 24px;">
            <a-descriptions-item v-if="selectedTexture.tile_width" :label="t('texture_details.tileWidth')">
              {{ selectedTexture.tile_width }} cm
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedTexture.tile_height" :label="t('texture_details.tileHeight')">
              {{ selectedTexture.tile_height }} cm
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedTexture.created_at" :label="t('texture_details.created')">
              {{ formatDate(selectedTexture.created_at) }}
            </a-descriptions-item>
            <a-descriptions-item v-if="selectedTexture.updated_at" :label="t('texture_details.lastUpdated')">
              {{ formatDate(selectedTexture.updated_at) }}
            </a-descriptions-item>
          </a-descriptions>

          <!-- Colors Section -->
          <div style="margin-bottom: 24px;" v-if="selectedTexture.associated_colors && selectedTexture.associated_colors.length > 0">
            <div style="margin-bottom: 8px; font-weight: 500;">{{ t('texture_details.availableColors') }}</div>
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
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
                    cursor: 'pointer'
                  }"
                ></div>
              </a-tooltip>
            </div>
          </div>

          <!-- Price Section (Only show if price data exists) -->
          <a-card 
            v-if="selectedTexture.sale_price_per_sqm || selectedTexture.current_price_per_sqm || selectedTexture.total_cost_per_sqm"
            size="small" 
            style="margin-bottom: 24px; background: #fafafa;"
          >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <div>
                <div style="color: #666; font-size: 14px;">{{ t('texture_details.pricePerSqm') }}</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span 
                    v-if="selectedTexture.current_price_per_sqm"
                    style="font-size: 24px; font-weight: 700; color: #1890ff;"
                  >
                    ${{ selectedTexture.current_price_per_sqm }}
                  </span>
                  <span 
                    v-else-if="selectedTexture.sale_price_per_sqm"
                    style="font-size: 24px; font-weight: 700; color: #1890ff;"
                  >
                    ${{ selectedTexture.sale_price_per_sqm }}
                  </span>
                </div>
              </div>
              <div style="margin-left: auto;">
                <a-tag 
                  v-if="selectedTexture.is_on_sale && selectedTexture.discount_percentage" 
                  color="red"
                  style="font-size: 12px; font-weight: 600;"
                >
                  {{ Math.round(selectedTexture.discount_percentage) }}% {{ t('texture_details.off') }}
                </a-tag>
              </div>
            </div>
            
            <a-row :gutter="16" v-if="selectedTexture.total_cost_per_sqm">
              <a-col :span="12">
                <div style="color: #666; font-size: 12px;">{{ t('texture_details.totalCostPerSqm') }}</div>
                <div style="font-weight: 600; color: #1890ff;">${{ selectedTexture.total_cost_per_sqm }}</div>
              </a-col>
              <a-col :span="12" v-if="selectedTexture.total_coverage_area">
                <div style="color: #666; font-size: 12px;">{{ t('texture_details.coverageArea') }}</div>
                <div style="font-weight: 600;">${{ selectedTexture.total_coverage_area }} m²</div>
              </a-col>
            </a-row>
          </a-card>

          <!-- Action Buttons -->
          <a-row :gutter="12">
            <a-col :span="12">
              <a-button 
                type="primary" 
                block
                @click="editTexture"
                class="!flex !items-center !justify-center !gap-2"
              >
                <EditOutlined />
                <span>{{ t('texture_details.editTexture') }}</span>
              </a-button>
            </a-col>
            <a-col :span="12">
              <a-button  
                type="default"
                danger
                block
                @click="deleteTexture"
                class="!flex !items-center !justify-center !gap-2"
              >
                <DeleteOutlined />
                <span>{{ t('texture_details.deleteTexture') }}</span>
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'TextureDetails',
  components: {
    ClockCircleOutlined,
    EditOutlined,
    DeleteOutlined,
  },
  props: {
    selectedTexture: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const { t, locale } = useI18n();

    // Computed property for main image source
    const mainImageSrc = computed(() => {
      if (props.selectedTexture.texture_image) {
        return getImageUrl(props.selectedTexture.texture_image);
      }
      
      // Fallback to primary product image
      if (props.selectedTexture.product_images && props.selectedTexture.product_images.length > 0) {
        const primaryImage = props.selectedTexture.product_images.find(img => img.is_primary);
        if (primaryImage) {
          return getImageUrl(primaryImage.image);
        }
        return getImageUrl(props.selectedTexture.product_images[0].image);
      }
      
      return '/placeholder-texture.jpg'; // Fallback placeholder
    });

    // Helper function to get full image URL
    const getImageUrl = (imagePath) => {
      if (!imagePath) return '/placeholder-texture.jpg';
      
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
      if (!dateString) return t('texture_details.unknown');
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return t('texture_details.invalidDate');
      }
    };

    // Select main image
    const selectMainImage = (imagePath) => {
      console.log('Selected image:', imagePath);
    };

    // Navigation and actions
    const back_texture_list = () => {
      emit('back_product_list', props.selectedTexture.id)
    };

    const editTexture = () => {
      emit('edit_texture', props.selectedTexture.id)
    };

    const deleteTexture = () => {
      emit('delete_texture', { product_id: props.selectedTexture.id, product_type: "wall" })
    };

    return {
      t,
      locale,
      mainImageSrc,
      getImageUrl,
      formatDate,
      selectMainImage,
      back_texture_list,
      editTexture,
      deleteTexture
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