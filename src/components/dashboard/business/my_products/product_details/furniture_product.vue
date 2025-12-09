<template>
  <div>
    <!-- Header -->
    <a-page-header 
      :title="selectedProduct.name" 
      @back="back_product_list"
    >
      <template #extra>
        <a-button  @click="createVariation()"> <template #icon> <ClockCircleOutlined/></template>Create Variation</a-button>
                <a-avatar style="background-color: #dc2626;">A</a-avatar>
      </template>
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
  title="Texture Preview" 
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
      
      <div>
         <!-- Add Product Variations  -->
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
                ></div>
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
            </div>
          </div>
        </div>
      </div>
      
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
          <a-descriptions title="Dimensions" :column="1" size="small" style="margin-bottom: 24px;">
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.width" 
              label="Width"
            >
              {{ selectedProduct.dimensions.width }} meter
            </a-descriptions-item>
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.height" 
              label="Height"
            >
              {{ selectedProduct.dimensions.height }} meter
            </a-descriptions-item>
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.length" 
              label="Length"
            >
              {{ selectedProduct.dimensions.length }} meter
            </a-descriptions-item>
            <a-descriptions-item 
              v-if="selectedProduct.dimensions.depth" 
              label="Depth"
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
              <div style="display: flex; gap: 6px;">
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
              > <template #icon> <EditOutlined/></template>
                Edit Product
              </a-button>
            </a-col>
            <a-col :span="12">
              <a-button 
                type="default" 
                danger
                block
                @click="deleteProduct()"
              > <template #icon> <DeleteOutlined/></template>
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
import {DeleteOutlined ,EditOutlined ,ClockCircleOutlined } from '@ant-design/icons-vue';
import TextureModal from "./TextureModal.vue";
export default {
  name: "product_details_store_page_buisness_user",
  components: {
    canvas_3d_model_renderer,TextureModal,
    DeleteOutlined ,EditOutlined ,ClockCircleOutlined
  },
   props: {
    selectedProduct: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      activeImageIndex: null,
      activeTextureView: null,
      activeView: '3d',
      showTextureModal: false,
      selectedTextureIndex: 0,

      prepopulatedProductData: null,
      isCreatingVariation: false,
      selectedVariantId: null,
    }
  },

  computed: {
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

 methods: {
   selectVariant(variantId) {
    this.selectedVariantId = variantId;
    this.$emit('select_variant', variantId);
  },
   createVariation() {
        this.$emit('create_variation', this.selectedProduct);
    },
    handleImageClick(index) {
      this.activeView = 'image';
      this.activeImageIndex = index;
      this.activeTextureView = null;
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