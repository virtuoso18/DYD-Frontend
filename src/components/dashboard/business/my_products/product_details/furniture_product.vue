<template>
  <div>
    <!-- Header -->
    <a-page-header 
      :title="selectedProduct.name" 
      @back="back_product_list"
    >
      <template #extra>
        <a-button  @click="createVariation()" style="display:flex;justify-content: center;align-items:center;font-size:16px"> <FileSyncOutlined /><span style="margin-top:-4px">Create Variation</span></a-button>
        
      </template>
    </a-page-header>

    <!-- Main Content -->
    <a-row :gutter="[24, 24]">
      <!-- Left Column - 3D Model and Images -->
      <a-col :xs="24" :md="12">
        <!-- 3D Model Card -->
         <div style="position: relative; padding:10px;;"  v-if="activeView === '3d'">

            <canvas_3d_model_renderer 
            :glbModelUrl="selected3DModelUrl"
            :Model_instance_id="selectedProduct.id"
            :isLoading="false"
            style="width: 100%; max-height:500px; height: 100%;border-radius: 10px"
            />
            <div
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
<!-- Texture Preview Card -->
<a-card 
  v-if="activeTextureView !== null && selectedProduct.textures[activeTextureView]" 
  :title="t('productDetails.texturePreview')" 
  style="margin-bottom: 24px;"
>
  <div style="width: 100%; max-height: 300px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 8px;">
    <img 
      :src="$store.state.root_media_api + selectedProduct.textures[activeTextureView].texture"
      style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;"
    />
  </div>
</a-card>
<div 
  v-else-if="activeView === 'image' && activeImageIndex !== null"
  style="width: 100%; max-height:500px; height: 100%; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #f5f5f5;">
  <img 
    :src="$store.state.root_media_api + selectedProduct.images[activeImageIndex].image"
    style="width: 100%; height: 100%; object-fit: contain; border-radius: 10px;"
  />
</div>
        <!-- Images Section -->
        <a-card :title="t('productDetails.productImages')" style="margin-top: 16px;">
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
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <img 
  v-for="(img, index) in selectedProduct.images" 
  @click="handleImageClick(index)"
  :key="index" 
  :src="$store.state.root_media_api + img.image"
  :style="{
    width: '80px', 
    height: '80px', 
    borderRadius: '8px', 
    objectFit: 'cover',
    border: activeView === 'image' && activeImageIndex === index ? '3px solid #1890ff' : '1px solid #d9d9d9',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }"
/>
              <!-- <div 
                style="width: 80px; height: 80px; border: 2px dashed #d9d9d9; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fafafa;"
              >
                <a-icon type="plus" style="color: #bfbfbf;" />
              </div> -->
          </div></div>
        </a-card>
        <!-- Product Variants Section - ADD THIS ENTIRE BLOCK -->
        <div v-if="selectedProduct.variants && selectedProduct.variants.length > 0" style="margin-bottom: 24px;">
          <div style="margin-bottom: 12px; font-weight: 500; font-size: 16px;">
            Available Variants ({{ selectedProduct.variants.length }})
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px;">
            <div
              v-for="variant in selectedProduct.variants"
              :key="variant.id"
              @click="selectVariant(variant.id)"
              :style="{
                border: selectedVariantId === variant.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: selectedVariantId === variant.id ? '#e6f7ff' : '#fff'
              }"
            >
              <img 
                :src="$store.state.root_media_api + variant.primary_image" 
                :style="{
                  width: '100%',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }"
              />
              <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                {{ variant.name }}
              </div>
              <div style="display: flex; gap: 4px; margin-bottom: 4px;">
                <div
                  v-if="variant.primary_color"
                  :style="{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    backgroundColor: variant.primary_color,
                    border: '1px solid #e0e0e0'
                  }"
                >
              </div>
                <div
                  v-if="variant.secondary_color"
                  :style="{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    backgroundColor: variant.secondary_color,
                    border: '1px solid #e0e0e0'
                  }"
                ></div>
              </div>
              <div style="font-size: 14px; font-weight: 700; color: #1890ff;">
                ${{ variant.pricing.current_price }}
              </div>
              <!-- <a-tag 
                v-if="!variant.stock.is_in_stock" 
                color="red" 
                size="small"
                style="margin-top: 4px;"
              >
                Out of Stock
              </a-tag>
              <a-tag 
                v-else-if="variant.pricing.is_on_sale" 
                color="orange" 
                size="small"
                style="margin-top: 4px;"
              >
                On Sale
              </a-tag> -->
            </div>
          </div>
        </div>

      </a-col>

      <!-- Right Column - Product Details -->
      <a-col :xs="24" :md="12">
        <a-card>
          <!-- Product Title and Description -->
          <a-tag color="blue" style="margin-bottom: 16px;">{{ t('productDetails.productDetails') }}</a-tag>
          <h1 style="font-size: 28px; margin-bottom: 16px;">{{ selectedProduct.name }}</h1>
          <p style="color: #666; line-height: 1.6; margin-bottom: 24px;">
            {{ selectedProduct.description }}
          </p>

          <!-- Basic Info -->
          <a-row :gutter="16" style="margin-bottom: 24px;">
            <a-col :span="12">
              <a-statistic 
                :title="t('productDetails.category')" 
                :value="selectedProduct.category.name" 
                :value-style="{ fontSize: '16px', fontWeight: '600' }"
              />
            </a-col>
            <a-col :span="12">
              <a-statistic 
                :title="t('productDetails.type')" 
                :value="selectedProduct.furniture_type" 
                :value-style="{ fontSize: '16px', fontWeight: '600' }"
              />
            </a-col>
          </a-row>
<a-row>
  <a-col :span="12">
          <!-- Dimensions -->
          <a-descriptions :title="t('productDetails.dimensions')" :column="1" size="small" style="margin-bottom: 24px;">
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.width" 
              :label="t('productDetails.width')"
            >
              {{ selectedProduct.dimensions.width }} meter
            </a-descriptions-item>
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.height" 
              :label="t('productDetails.height')"
            >
              {{ selectedProduct.dimensions.height }} meter
            </a-descriptions-item>
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.length" 
              :label="t('productDetails.length')"
            >
              {{ selectedProduct.dimensions.length }} meter
            </a-descriptions-item>
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.depth" 
              :label="t('productDetails.depth')"
            >
              {{ selectedProduct.dimensions.depth }} meter
            </a-descriptions-item>
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.weight" 
              label="Weight"
            >
              {{ selectedProduct.dimensions.weight }} meter
            </a-descriptions-item>
          </a-descriptions>
</a-col>
  <a-col :span="12" v-if="business_available_actions !== null && business_available_actions?.ar_available_for_products ">
    
          <h4>AR Product</h4>
          <!-- icon='@/assets/apply_changes_img.png' -->
          <a-qrcode
          error-level="H"
          icon="/apply_changes_img.png"
          :value="windowLocation + '/ar-product/' + selectedProduct.id"
/>
<!-- <a-button @click="this.$router.push('/ar-product/' + selectedProduct.id)">AR</a-button> -->

  </a-col>
</a-row>
          <!-- Colors and Textures -->
        <a-row :gutter="16" style="margin-bottom: 24px;">
          <a-col :span="12">
            <div style="margin-bottom: 8px; font-weight: 500;">{{ t('productDetails.colors') }}:</div>
            <a-alert 
              v-if="showColorAlert"
              type="warning"
              :message="`${t('productDetails.colorAlertMsg')} ${selectedColorHex}`"
              closable
              @close="showColorAlert = false"
              style="margin-bottom: 12px;"
            />
            <div style="display: flex; gap: 10px; align-items: center;">
              <div v-for="(color, index) in selectedProduct.colors.available_colors"
                :key="index"
                @click="selectColor(index, color)"
                :class="[
                  'w-6 h-6 rounded-full transition-all cursor-pointer',
                  color.model_file_colored_product 
                    ? 'border-2 hover:shadow-md' 
                    : 'outline outline-2 outline-red-500 outline-offset-2 hover:shadow-[0_0_8px_rgba(239,68,68,0.3)]',
                  selectedColorIndex === index ? 'border-blue-500 border-2' : 'border-gray-100'
                ]"
                :style="{ backgroundColor: color.color }"
              ></div>
            </div>
          </a-col>
          <a-col :span="12">
            <div style="margin-bottom: 8px; font-weight: 500;" v-if="selectedProduct.textures.length">{{ t('productDetails.textures') }}:</div>
            <div style="display: flex; gap: 6px;flex-wrap: wrap;">
              <img 
                v-for="(texture, index) in selectedProduct.textures" 
                :key="index"
                @click.stop="openTextureModal(index)"
                :src="$store.state.root_media_api + texture.texture" 
                alt="" 
                :style="{
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '4px',
                  border: activeTextureView === index ? '3px solid #1890ff' : '1px solid #d9d9d9',
                  cursor: 'pointer',
                  objectFit: 'cover',
                  transition: 'all 0.3s ease'
                }"
              />
            </div>
            
          </a-col>
        </a-row>

        
          <!-- Price Section -->
          <a-card size="small" style="margin-bottom: 24px; background: #fafafa;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div>
                <div style="color: #666; font-size: 14px;">{{ t('productDetails.price') }}</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span 
                    v-if="selectedProduct.pricing.price"
                    :style="selectedProduct.pricing.is_on_sale 
                            ? 'text-decoration: line-through; color: #999; font-size: 18px;' 
                            : 'color: #1890ff; font-size: 24px; font-weight: 700;'"
                  >
                    ${{ selectedProduct.pricing.price }}
                  </span>
                  <!-- <span 
                    v-if="selectedProduct.pricing.sale_price && selectedProduct.pricing.is_on_sale"
                    style="color: #ff4d4f; font-size: 24px; font-weight: 700;"
                  >
                    ${{ selectedProduct.pricing.sale_price }}
                  </span>
                  <span 
                    v-if="selectedProduct.pricing.current_price && !selectedProduct.pricing.is_on_sale"
                    style="color: #1890ff; font-size: 24px; font-weight: 700;"
                  >
                    ${{ selectedProduct.pricing.current_price }}
                  </span> -->
                </div>
              </div>
              <a-tag 
                v-if="selectedProduct.pricing.is_on_sale" 
                color="red"
                style="margin-left: auto;"
              >
                On Sale
              </a-tag>
            </div>
          </a-card>

          <!-- Action Buttons -->
          <a-row :gutter="12">
            <a-col :span="12">
              <a-button 
                type="primary" 
                block
                @click="editProduct()"
                style="display:flex;justify-content: center;gap:10px;"
              > <EditOutlined style="font-size:16px;padding-top:4px"/>
                Edit Product
              </a-button>
            </a-col>
            <a-col :span="12">
              <a-button 
                type="default" 
                danger
                block
                @click="deleteProduct()"
                style="display:flex;justify-content: center;gap:5px;"
              > <template #icon> <DeleteOutlined  style="font-size:16px;padding-top:4px"/></template>
                Delete Product
              </a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
     <!-- Texture Modal -->
    <TextureModal 
      :isOpen="showTextureModal"
      :textures="formattedTextures"
      :initialIndex="selectedTextureIndex"
      @close="closeTextureModal"
      @apply="applyTexture"
    />
  </div>
</template>

<script>
import canvas_3d_model_renderer from "@/components/store/canvas_3d_model_renderer.vue"
import qr_icon from '@/assets/apply_changes_img.png'
import {DeleteOutlined ,EditOutlined ,ClockCircleOutlined,
  FileSyncOutlined
 } from '@ant-design/icons-vue';
import TextureModal from "./TextureModal.vue";
import { useI18n } from "vue-i18n";
export default {
  name: "product_details_store_page_buisness_user",
   setup() {
    const { t, locale } = useI18n();
    return { t, locale };
  },
  components: {
    canvas_3d_model_renderer,TextureModal,
    DeleteOutlined ,EditOutlined ,ClockCircleOutlined,
    FileSyncOutlined,qr_icon
  },
   props: {
    selectedProduct: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      // subscription the business holds with respect to the pricing plan 
      currentPlanName:'',
      business_available_actions:null,
      is_expired_or_un_active_business_plan:true,

      windowLocation : window.location.origin,
      activeImageIndex: null,
      activeTextureView: null,
      activeView: '3d',
      showTextureModal: false,
      selectedTextureIndex: 0,
      prepopulatedProductData: null,
      isCreatingVariation: false,
      selectedVariantId: null,
      selectedColorIndex: null,
      showColorAlert: false
    }
  },

  computed: {
    selected3DModelUrl() {
      if (this.selectedColorIndex !== null && 
          this.selectedProduct.colors && 
          this.selectedProduct.colors.available_colors[this.selectedColorIndex] &&
          this.selectedProduct.colors.available_colors[this.selectedColorIndex].model_file_colored_product) {
        return this.$store.state.root_media_api + this.selectedProduct.colors.available_colors[this.selectedColorIndex].model_file_colored_product;
      }
      return this.$store.state.root_media_api + this.selectedProduct['3d_model'];
    },
    
    formattedTextures() {
      if (!this.selectedProduct.textures || this.selectedProduct.textures.length === 0) {
        return [];
      }
      
      return this.selectedProduct.textures.map(texture => ({
        image: this.$store.state.root_media_api + texture.texture,
        name: texture.name || 'Texture',
        composition: texture.composition || '100% Polyester',
        origin: texture.origin || 'Made in Italy',
        colors: texture.colors || [
          { hex: '#D4A574' },
          { hex: '#3F5E6B' },
          { hex: '#4A4A4A' }
        ]
      }));
    }
  },
  async mounted() {
      await this.loadBrandPurchasedPlanDetails();

  },
 methods: {
// ✅ Plan loader
    async loadBrandPurchasedPlanDetails() {
      if (this.planLoading || this.planLoaded) return;
      this.planLoading = true;
      
      try {
        const brandSlug =JSON.parse(localStorage.getItem("business_profile")).slug
        if (!brandSlug) {
          this.currentPlanName = null;
          return;
        }
        const url = `${this.$store.state.root_api}subscription/api/get-business-plan-details/${brandSlug}/`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result.success && result.data) {
          this.currentPlanName = result.data.plan_name;
          
          this.business_available_actions = result.data;
          this.is_expired_or_un_active_business_plan=result.is_expired
          
          console.log("✅ Plan loaded:", this.currentPlanName);
        } else {
          this.currentPlanName = null;
        }
      } catch (error) {
        console.error("Plan load failed:", error);
        this.currentPlanName = null;
      } finally {
        this.planLoading = false;
        this.planLoaded = true;
      }
    },

  handleImageClick(index) {
      this.activeView = 'image';
      this.activeImageIndex = index;
      this.activeTextureView = null;
    },
    selectVariant(variantId) {
    this.selectedVariantId = variantId;
    this.$emit('select_variant', variantId);
  },
   selectColor(index,color) {
      this.selectedColorIndex = index;
      this.activeView = '3d'; 
      if (!color.model_file_colored_product) {
      this.selectedColorHex = color.color; 
      this.showColorAlert = true;

    } else {
      this.showColorAlert = false;
    }
    },


    openTextureModal(index) {
      console.log('Opening texture modal, index:', index);
      console.log('Textures available:', this.selectedProduct.textures);
      console.log('Formatted textures:', this.formattedTextures);
      
      this.selectedTextureIndex = index;
      
      // Use nextTick to ensure DOM updates before showing modal
      this.$nextTick(() => {
        this.showTextureModal = true;
        console.log('Modal state set to:', this.showTextureModal);
      });
    },


    closeTextureModal() {
      this.showTextureModal = false;
    },


    applyTexture(data) {
      console.log('Applied texture:', data);
      this.activeTextureView = data.index;
      this.activeView = null;
      this.activeImageIndex = null;
      
      // Emit to parent or save to API
      this.$emit('texture-changed', {
        productId: this.selectedProduct.id,
        textureIndex: data.index,
        selectedColor: data.color
      });
      
      this.closeTextureModal();
    },


    editProduct() {
      this.$emit('edit_product', this.selectedProduct.id)
    },
   createVariation() {
        this.$emit('create_variation', this.selectedProduct);
    },


    deleteProduct() {
      this.$emit('delete_product', {
        "product_id": this.selectedProduct.id,
        "product_type": "Furniture"
      })
    },


    back_product_list() {
      this.$emit('back_product_list', this.selectedProduct.id)
    }
  }
}
</script>