<template>
    <!-- {{ selectedProduct }} -->
  <div>
    <!-- Header -->
    <a-page-header 
      :title="selectedProduct.name" 
      @back="back_product_list"
    >
      <template #extra>
        <a-button > <template #icon> <ClockCircleOutlined/></template>Create Variation</a-button>
        <a-avatar style="background-color: #dc2626;">A</a-avatar>
      </template>
    </a-page-header>

    <!-- Main Content -->
    <a-row :gutter="[24, 24]">
      <!-- Left Column - 3D Model and Images -->
      <a-col :xs="24" :md="12">
        <!-- 3D Model Card -->
         <div style="position: relative; padding:10px;;">

            <canvas_3d_model_renderer_light
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

        <!-- Images Section -->
        <a-card title="Product Images" style="margin-top: 16px;">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <img 
              v-for="img in selectedProduct.images" 
              :key="img" 
              :src="$store.state.root_media_api + img.image"
              style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid #d9d9d9;"
              />
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
  </div>
</template>

<script>

import canvas_3d_model_renderer_light from "@/components/dashboard/business/my_products/canvas_3d_model_renderer_light.vue";
import {DeleteOutlined ,EditOutlined ,ClockCircleOutlined } from '@ant-design/icons-vue';
export default {
  name: "product_details_store_page_buisness_user",
  components: {
    canvas_3d_model_renderer_light,
    DeleteOutlined ,EditOutlined ,ClockCircleOutlined
  },
  props: {
    selectedProduct: Object
  },
  methods: {
    editProduct() {
      this.$emit('edit_product', this.selectedProduct.id)
    },
    deleteProduct() {

      this.$emit('delete_product', {"product_id":this.selectedProduct.id,"product_type":"Light"})

    },
    back_product_list() {
      this.$emit('back_product_list', this.selectedProduct.id)
    }
  }
}
</script>