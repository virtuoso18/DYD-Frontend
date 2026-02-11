<template>

  <a-modal
    :open="visible"
    :closable="false"
    :footer="null"
    width="1000px"
    centered
    @cancel="handleCancel"
    :mask-closable="false"
    class="add-product-modal"
  >
  
    <!-- Custom Header -->
    <template #title>
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0;">
        <div style="display: flex; align-items: center;">
          <a-button type="text" @click="handleCancel" style="padding: 4px; margin-right: 12px;" size="small">
            <template #icon>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </template>
          </a-button>
          <span className="sm:text-[18px] text-[14px] !font-semibold text-[#1f2937]">
            Add New Product</span>
        </div>
        <div style="display: flex; gap: 12px;">
          <a-button @click="handleCancel" style="border-radius: 6px;">Cancel</a-button>
          <a-button type="primary" @click="handleSave" :loading="isSaving" style="border-radius: 6px;">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </a-button>
        </div>
      </div>
    </template>

    <div style="padding: 0;">
        <div className="flex flex-col sm:flex-row justify-evenly">

          <a-row>
  
            <!-- Left Column - 3D Model Preview -->
                        <a-col
      :xs="24"
      :sm="24"
      :md="10"
      :lg="10"
    >
              <div style="position: relative; padding:10px;">
    
                <!-- 3D Model Upload Area (shown when no model is uploaded) -->
                <!-- <div 
                  v-if="!local3dModelUrl"
                  @drop.prevent="handleModelDrop"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @click="upload3dModel"
                  :style="{
                    border: isDragging ? '2px solid #3b82f6' : '2px dashed #d1d5db',
                    borderRadius: '12px',
                    padding: '40px 16px',
                    background: isDragging ? '#f8faff' : '#f9fafb',
                    minHeight: '250px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }"
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" style="margin-bottom: 16px;">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  <p style="font-size: 14px; color: #374151; font-weight: 500; margin-bottom: 8px;">Drag and drop 3D model here or click to upload</p>
                  <p style="font-size: 12px; color: #6b7280; margin: 0;">Supported file format: .gltf / .glb</p>
                  <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0;">File size: 50MB</p>
                </div> -->
    <router-link 
  v-if="!local3dModelUrl"
  :to="'/my-products/add-new-furniture'"
  :style="{
    border: isDragging ? '2px solid #3b82f6' : '2px dashed #d1d5db',
    borderRadius: '12px',
    padding: '40px 16px',
    background: isDragging ? '#f8faff' : '#f9fafb',
    minHeight: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }"
>
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" style="margin-bottom: 16px;">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>

  <p style="font-size: 14px; color: #374151; font-weight: 500; margin-bottom: 8px;text-align:center">
    Select an existing 3D model or click <br>to Generate with DYD AI
  </p>
  <!-- <p style="font-size: 12px; color: #6b7280; margin: 0;">
    Or create a new model
  </p> -->
</router-link>
    
                <!-- 3D Model Renderer (shown when model is uploaded) -->
                <div v-else style="position: relative;">
                  <canvas_3d_model_renderer 
                    :glbModelUrl="local3dModelUrl"
                    :Model_instance_id="'local-preview-' + Date.now()"
                    :isLoading="false"
                    style="width: 100%; max-height:250px; height: 100%;border-radius: 10px"
                  />
                  <div
                    style="position: absolute; bottom: 75px; right: 15px; background: white; padding: 8px 12px; border-radius: 6px; border: 1px solid #e9ecef; font-size: 12px; font-weight: 600; cursor: pointer;">
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
                  
                  <!-- Change Model Button -->
                  <a-button 
                    @click="upload3dModel"
                    style="position: absolute; top: 10px; right: 10px; background: white; border-radius: 6px; font-size: 11px;"
                    size="small"
                  >
                    Change Model
                  </a-button>
    
                  <!-- Display uploaded model info -->
                  <div style="margin-top: 12px; padding: 8px 12px; background: #f8faff; border: 1px solid #e5e7eb; border-radius: 6px;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"></path>
                        </svg>
                        <div>
                          <div style="font-size: 12px; font-weight: 500; color: #1f2937;">{{ uploaded3dModelFile?.name }}</div>
                          <div style="font-size: 11px; color: #6b7280;">{{ uploaded3dModelFile?.size }}</div>
                          <div v-if="uploaded3dModelFile?.isGenerated" style="font-size: 10px; color: #10b981; font-weight: 500; margin-top: 2px;">
                            📤 Generated Model
                          </div>
                        </div>
                      </div>
                      <a-button 
                        type="text" 
                        size="small" 
                        @click="remove3dModel"
                        style="color: #ef4444; padding: 4px;"
                      >
                        <template #icon>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </template>
                      </a-button>
                    </div>
                  </div>
                </div>
    
               <label style="display: block; margin-top: 16px; margin-bottom: 8px; font-size: 13px; color: #374151;">
      Images used to create 3d model (<b>{{modelDetails?.model_mode || 'N/A'}}</b>) 
    </label>
    
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      <img 
        v-if="modelDetails?.image_0"
        :src="this.$store.state.root_media_api + modelDetails.image_0" 
        :style="{
          width: '60px',
          height: '60px',
          objectFit: 'contain',
          borderRadius: '8px',
          border: '2px solid #e5e7eb'
        }"
      />
      <img 
        v-if="modelDetails?.image_1"
        :src="this.$store.state.root_media_api + modelDetails.image_1" 
        :style="{
          width: '60px',
          height: '60px',
          objectFit: 'contain',
          borderRadius: '8px',
          border: '2px solid #e5e7eb'
        }"
      />
      <img 
        v-if="modelDetails?.image_2"
        :src="this.$store.state.root_media_api + modelDetails.image_2" 
        :style="{
          width: '60px',
          height: '60px',
          objectFit: 'contain',
          borderRadius: '8px',
          border: '2px solid #e5e7eb'
        }"
      />
      <img 
        v-if="modelDetails?.image_3"
        :src="this.$store.state.root_media_api + modelDetails.image_3" 
        :style="{
          width: '60px',
          height: '60px',
          objectFit: 'contain',
          borderRadius: '8px',
          border: '2px solid #e5e7eb'
        }"
      />
    </div>
              </div>
               <select3d_model_for_color 
                 :list_history_generated_3d_models="list_history_generated_3d_models"
                 :loading_generated_models_history="loading_generated_models_history" 
                 @clicked-model="clickedModel"
               />
               <div v-if="list_history_generated_3d_models.length > 0" style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
    <p style="font-size: 12px; color: #6b7280; margin: 0;">
      Showing {{ list_history_generated_3d_models.length }} of {{ pagination.totalCount }} models
    </p>
    
    <a-button 
      v-if="pagination.hasMoreModels"
      @click="loadMoreModels"
      :loading="loadingMoreModels"
      style="border-radius: 6px;"
    >
      <template #icon>
        <svg 
          v-if="!loadingMoreModels"
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </template>
      {{ loadingMoreModels ? 'Loading...' : 'Load More Models' }}
    </a-button>
    
    <p v-else style="font-size: 12px; color: #10b981; margin: 0;">
      ✓ All models loaded
    </p>
  </div>
</div>
            </a-col>
          
          
  
            <!-- Right Column - Product Details (keeping existing code) -->
                        <a-col
      :xs="24"
      :sm="24"
      :md="14"
      :lg="14"
    >
              <div style="padding-left: 12px;">
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #1f2937;">Product Details</h3>
    
                <!-- Upload Multiple Images Section -->
                <div style="margin-bottom: 20px;">
                  <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #374151;">Product Images <span style="color: red;">*</span><span style="font-size: 12px; color: #6b7280;">&nbsp;(Click to upload multiple images Max 5)</span></label>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer;margin-top:14px;" @click="uploadImages">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                      </svg>
                    </div>
    
                    <div v-if="selectedImages.length > 0" style="margin-top: 16px;">
                      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        <div 
                          v-for="(image, index) in selectedImages" 
                          :key="index"
                          style="position: relative; cursor: pointer;"
                          @click="setPrimaryImage(image)"
                        >
                          <img 
                            :src="image.url" 
                            :style="{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: image.isPrimary ? '2px solid #22c55e' : '2px solid #e5e7eb'
                            }"
                          />
                          <div 
                            v-if="image.isPrimary"
                            style="position: absolute; left: -5px; bottom: -5px; background: #22c55e; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px;"
                          >
                            ★
                          </div>
                          <a-button 
                            type="text" 
                            size="small" 
                            @click.stop="removeImage(index)"
                            style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; padding: 0; min-width: 20px;"
                          >
                            <template #icon>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </template>
                          </a-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    
                <!-- Name Field -->
                <div style="margin-bottom: 16px;">
                  <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Name <span style="color: red;">*</span></label>
                  <a-input 
                    v-model:value="productForm.name" 
                    placeholder="Decaly Coral"
                    style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
                  />
                </div>
    
                <!-- Description Field -->
                <div style="margin-bottom: 16px;">
                  <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Description</label>
                  <a-textarea 
                    v-model:value="productForm.description"
                    :rows="3"
                    placeholder="Living room lighting, interior lighting, pendant lighting
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
                    style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb; resize: none;"
                  />
                </div>
    
                <!-- Category, Type, Price Row -->
                <a-row :gutter="12" style="margin-bottom: 16px;">
                  <a-col :span="8">
           
                 
                       
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">
        Category <span style="color: red;">*</span>
      </label>
      
      <a-select
        v-model:value="productForm.category_name"
        placeholder="Search and select category"
        style="width: 100%;"
        mode="tags"
        :style="{ background: '#f3f4f6' }"
        :options="categoryOptions"
        :loading="loadingCategories"
        :filter-option="false"
        :allow-clear="true"
        show-search
        @search="handleCategorySearch"
        @change="handleCategoryChange"
        @focus="handleSelectFocus"
      >
      </a-select>
      
    </div>
                  </a-col>
                  <a-col :span="8">
                    <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Type</label>
                    <a-select 
                      v-model:value="productForm.furniture_type" 
                      placeholder="Modern"
                      style="width: 100%;"
                      :style="{ background: '#f3f4f6' }"
                    >
                      <a-select-option v-for="type in types" :key="type" :value="type">{{ type }}</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="8">
                    <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Price <span style="color: red;">*</span></label>
                    <a-input-number
                      v-model:value="productForm.pricing.price" 
                      :min="0"
                      :step="0.01"
                      placeholder="680"
                      style="width: 100%; border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
                    />
                  </a-col>
                </a-row>
    
                <!-- Dimensions Section -->
                <div style="margin-bottom: 20px;">
                  <h4 style="margin-bottom: 12px; font-size: 14px; font-weight: 500; color: #1f2937;">Dimensions</h4>
                  <a-row :gutter="8">
                    <a-col :span="8">
                      <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Height</label>
                      <div style="display: flex; align-items: center;">
                        <a-input-number
                          v-model:value="productForm.dimensions.height" 
                          :min="0"
                           @keypress="allowOnlyDecimal"
                            @paste="handlePaste"
                          :step="0.01"
                          placeholder="0.8"
                          style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                        />
                        <span style="margin-left: 6px; color: #9ca3af; font-size: 12px;">meter</span>
                      </div>
                    </a-col>
                    <a-col :span="8">
                      <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Length/Depth</label>
                      <div style="display: flex; align-items: center;">
                        <a-input-number
                          v-model:value="productForm.dimensions.length" 
                          :min="0"
                           @keypress="allowOnlyDecimal"
                            @paste="handlePaste"
                          :step="0.01"
                          placeholder="0.5"
                          style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                        />
                        <span style="margin-left: 6px; color: #9ca3af; font-size: 12px;">meter</span>
                      </div>
                    </a-col>
                    <a-col :span="8">
                      <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Width</label>
                      <div style="display: flex; align-items: center;">
                        <a-input-number
                          v-model:value="productForm.dimensions.width" 
                          :min="0"
                           @keypress="allowOnlyDecimal"
                            @paste="handlePaste"
                          :step="0.01"
                          placeholder="1.8"
                          style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                        />
                        <span style="margin-left: 6px; color: #9ca3af; font-size: 12px;">meter</span>
                      </div>
                    </a-col>
                  </a-row>
                </div>
    
                <!-- Available Colors Section -->
                <div style="margin-bottom: 20px;">
                                      <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #374151;">Available Colors</label>
                                      
                                      <a-popover trigger="click" placement="bottom">
                                        <template #title>
                                          <div style="display: flex; align-items: center; gap: 8px;">
                                            <span>Add Available Colors</span>
                                            <input 
                                              type="color" 
                                              :value="tempColor"
                                              @input="tempColor = $event.target.value"
                                              style="width: 30px; height: 25px; border: none; border-radius: 4px; cursor: pointer;"
                                            />
                                            <a-button 
                                              type="primary" 
                                              size="small" 
                                              @click="addAvailableColor"
                                              style="margin-left: 8px;"
                                            >
                                              Add
                                            </a-button>
                                          </div>
                                        </template>
                                        <template #content>
                                          <div style="display: grid; grid-template-columns: repeat(6, 32px); gap: 8px; padding: 8px;">
                                            <div
                                              v-for="(color, index) in presetColors"
                                              :key="index"
                                              @click="addPresetColor(color)"
                                              :style="{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '6px',
                                                backgroundColor: color,
                                                cursor: 'pointer',
                                                border: '1px solid #e5e7eb',
                                                opacity: selectedColors.some(c => c.value === color) ? 0.5 : 1
                                              }"
                                            ></div>
                                          </div>
                                        </template>
                                        <a-button style="border-radius: 6px; border: 2px dashed #d1d5db;">
                                          <template #icon>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                              <line x1="12" y1="5" x2="12" y2="19"></line>
                                              <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                          </template>
                                          Add Colors
                                        </a-button>
                                      </a-popover>
                        
                                      <div v-if="selectedColors.length > 0" style="margin-top: 12px;">
                                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                          <div 
                                            v-for="(color, index) in selectedColors" 
                                            :key="index"
                                            style="position: relative;"
                                          >
                                            <div
                                              :style="{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: color.value,
                                                border: color.isPrimary ? '2px solid #22c55e' : '2px solid #e5e7eb',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                transition: 'all 0.2s ease'
                                              }"
                                              @click="setPrimaryColor(color)"
                                            ></div>
                                            <div 
                                              v-if="color.isPrimary"
                                              style="position: absolute; left: -5px; bottom: -5px; background: #22c55e; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);"
                                            >
                                              ★
                                            </div>
                                            <a-button 
                                              type="text" 
                                              size="small" 
                                              @click="removeColor(index)"
                                              style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; padding: 0; min-width: 20px;"
                                            >
                                              <template #icon>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                              </template>
                                            </a-button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
    
                <!-- Textures Section -->
                 <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #374151;">Texture Images</label>
                                  
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 12px;">
            
            <!-- Select from pre-uploaded textures -->
            <a-popover trigger="click" placement="bottom">
              <!-- Upload custom texture -->
            
              <template #title>
                <a-button 
              @click="uploadTexture"
              style="border-radius: 6px; border: 2px dashed #d1d5db;"
            >
              <template #icon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </template>
              Upload Custom
            </a-button>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span>Select Texture from Library</span>
                  <a-spin v-if="loadingTextures" size="small" style="margin-left: 8px;" />
                </div>
              </template>
              <template #content>
                <div v-if="loadingTextures" style="text-align: center; padding: 20px;">
                  <a-spin />
                </div>
                <div v-else-if="availableTextures.length === 0" style="text-align: center; padding: 20px; color: #6b7280;">
                  <p style="font-size: 12px; margin: 0;">No textures available</p>
                </div>
                <div v-else style="display: grid; grid-template-columns: repeat(4, 60px); gap: 8px; max-height: 300px; overflow-y: auto; padding: 8px;">
                  <div
                    v-for="(texture, index) in availableTextures"
                    :key="index"
                    @click="addPresetTexture(texture)"
                    :style="{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      backgroundImage: `url('${getTextureUrl(texture.url)}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                      border: selectedTextures.some(t => t.id === texture.id) ? '2px solid #22c55e' : '2px solid #e5e7eb',
                      opacity: selectedTextures.some(t => t.id === texture.id) ? 0.6 : 1,
                      transition: 'all 0.2s ease'
                    }"
                    :title="texture.name"
                  >
                    <div v-if="selectedTextures.some(t => t.id === texture.id)" 
                      style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); border-radius: 6px;">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </template>
              <a-button style="border-radius: 6px; border: 2px dashed #d1d5db;">
                <template #icon>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </template>
                Select Texture
              </a-button>
            </a-popover>

            <!-- Upload custom texture -->
            <!-- <a-button 
              @click="uploadTexture"
              style="border-radius: 6px; border: 2px dashed #d1d5db;"
            >
              <template #icon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </template>
              Upload Custom
            </a-button> -->
          </div>
                    
                                  <!-- Selected textures display -->
          <div v-if="selectedTextures.length > 0" style="margin-top: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <div 
                v-for="(texture, index) in selectedTextures" 
                :key="index" 
                style="position: relative;"
              >
                <div 
                  :style="{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundImage: `url('${getTextureUrl(texture.url)}')`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    borderRadius: '8px', 
                    border: '2px solid #e5e7eb', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }"
                  :title="texture.name || 'Texture'"
                ></div>
                <!-- Custom texture indicator (uploaded by user) -->
                <div 
                  v-if="!texture.id"
                  style="position: absolute; left: -5px; bottom: -5px; background: #8b5cf6; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px; box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);"
                  title="Custom uploaded texture"
                >
                  📤
                </div>
                <a-button 
                  type="text" 
                  size="small" 
                  @click="removeTexture(index)"
                  style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; padding: 0; min-width: 20px;"
                >
                  <template #icon>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </template>
                </a-button>
              </div>
            </div>
          </div>
      </div>
    
                <!-- PBR Files Section -->
                <div style="margin-bottom: 20px;">
                  <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #374151;">PBR Files</label>
                  
                  <div style="cursor: pointer;" @click="uploadPbr">
                    <div style="width: 100%; height: 48px; background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17,8 12,3 7,8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <span style="font-size: 12px; color: #6b7280;">Upload PBR files (.pbr, .zip, .rar, etc.)</span>
                    </div>
                  </div>
    
                  <div v-if="selectedPbrFiles.length > 0" style="margin-top: 12px;">
                    <div v-for="(pbrFile, index) in selectedPbrFiles" :key="index" 
                        style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #f8faff; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 6px;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"></path>
                        </svg>
                        <div>
                          <div style="font-size: 13px; font-weight: 500; color: #1f2937;">{{ pbrFile.name }}</div>
                          <div style="font-size: 11px; color: #6b7280;">{{ pbrFile.size }}</div>
                        </div>
                      </div>
                      <a-button 
                        type="text" 
                        size="small" 
                        @click="removePbrFile(index)"
                        style="color: #ef4444; padding: 4px;"
                      >
                        <template #icon>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </template>
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
     
    </div>

    <!-- Hidden File Inputs -->
    <input ref="modelInput" type="file" style="display: none;" accept=".gltf,.glb" @change="handle3dModelUpload" />
    <input ref="pbrInput" type="file" style="display: none;" accept=".pbr,.zip,.rar,.7z,.tar,.gz" multiple @change="handlePbrUpload" />
    <input ref="imageInput" type="file" style="display: none;" accept=".jpg,.jpeg,.png" multiple @change="handleImageUpload" />
    <input ref="textureInput" type="file" style="display: none;" accept=".jpg,.jpeg,.png" multiple @change="handleTextureUpload" />
  </a-modal>
</template>

<script>
// ============================================================================
// UPDATED SCRIPT SECTION - AddNewProduct_variation_modal.vue
// ============================================================================

import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import canvas_3d_model_renderer from "@/components/store/canvas_3d_model_renderer.vue"
import select3d_model_for_color from '@/components/dashboard/business/my_products/add_color_3d_model/dyd_generated.vue'

export default {
  name: "AddNewProduct_variation_modal",
  props: {
    visible: { type: Boolean, default: false },
    rendered_modal_3D_id: { type: String, default: "" },
    types: { type: Array, default: () => ['Modern','Scandinavian','Classic','Minimalist','Industrial','Rustic','Boho','other'] },
    defaultValues: { 
      type: Object, 
      default: () => ({
        name: 'demo product',
        description: 'description sample',
        category_name: 'Chair',
        furniture_type: '',
        pricing: { price: 10 },
        dimensions: { height: 1, length: 1, width: 2 },
        images: [],
        colors: [],
        textures: [],
        pbrFiles: [],
        modelUrl: null
      })
    },
    prepopulatedData: { 
      type: Object, 
      default: () => null
    },
  },

  components: {
    canvas_3d_model_renderer,
    select3d_model_for_color
  },

  emits: ['update:visible', 'product-created', 'cancel'],
  
  data() {
    return {
      isSaving: false,
      tempColor: '#000000',
      isDragging: false,
      
      // 3D Model refs
      local3dModelUrl: this.defaultValues.modelUrl || null,
      uploaded3dModelFile: null,
      model_data_instance_id: '',

      loading3dModelDetails: false,
      modelDetails: null,
      error: { general: null },
      availableTextures: [],
      loadingTextures: false,
      loading_generated_models_history: true,
      list_history_generated_3d_models: [],

      // ========== NEW: Pagination Properties ==========
      pagination: {
        currentOffset: 0,      // Current pagination offset
        pageSize: 8,          // Models per page
        totalCount: 0,         // Total available models
        hasMoreModels: false   // Whether more models exist
      },
      loadingMoreModels: false, // Loading state for "Load More" button
      // ===============================================

      // Form data
      productForm: {
        name: '',
        description: '',
        category_name: [],
        furniture_type: '',
        pricing: { price: null },
        dimensions: { height: null, length: null, width: null }
      },
      
      // Collections
      selectedImages: this.defaultValues.images || [],
      selectedColors: (this.defaultValues.colors || []).map((color, index) => ({
        value: typeof color === 'string' ? color : color.value,
        isPrimary: index === 0
      })),
      selectedTextures: this.defaultValues.textures || [],
      selectedPbrFiles: this.defaultValues.pbrFiles || [],
      categories_available: [],

      // Category search related
      categoryOptions: [],
      allCategories: [],
      loadingCategories: false,
      categorySearchError: null,
      categorySearchTimeout: null,
      
      presetColors: [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
        '#FF00FF', '#00FFFF', '#C0C0C0', '#808080', '#800000', '#808000',
        '#008000', '#800080', '#008080', '#000080', '#FFA500', '#FFC0CB',
        '#A52A2A', '#DDA0DD', '#98FB98', '#F0E68C', '#DEB887', '#D2691E',
        '#FF6347', '#40E0D0', '#EE82EE', '#90EE90', '#FFB6C1', '#87CEEB'
      ]
    }
  },

  computed: {
    primaryImage() {
      return this.selectedImages.find(img => img.isPrimary) || this.selectedImages[0] || null;
    },
    categoryNameDisplay() {
      if (Array.isArray(this.productForm.category_name)) {
        return this.productForm.category_name[0] || '';
      }
      return this.productForm.category_name || '';
    }
  },

  watch: {
    visible(newValue) {
      if (!newValue) {
        this.resetForm();
      } else {
        // ========== NEW: Reset pagination when modal opens ==========
        this.pagination.currentOffset = 0;
        this.pagination.totalCount = 0;
        this.pagination.hasMoreModels = false;
        this.list_history_generated_3d_models = [];
        // ===========================================================
        
        this.loadAvailableTextures();
        this.fetch3d_models_generated_by_user(); // Load first batch
      }
    },
    rendered_modal_3D_id(newId, oldId) {
      if (newId && newId !== oldId) {
        console.log('🔄 Modal ID changed, refetching details...', { newId, oldId });
        this.get3dRenderedModelDetails(newId);
        this.loadInitialCategories();
      }
    },
    defaultValues: {
      handler(newValues) {
        this.initializeFormWithDefaults(newValues);
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    if (this.prepopulatedData) {
      this.initializeFormWithDefaults(this.prepopulatedData);
    }
    
    if (this.rendered_modal_3D_id) {
      console.log('🚀 Component mounted, fetching 3D model details...');
      this.get3dRenderedModelDetails(this.rendered_modal_3D_id);
    }
    
    this.loadInitialCategories();
    this.loadAvailableTextures();
    
    // ========== NEW: Initialize pagination ==========
    this.pagination.currentOffset = 0;
    this.fetch3d_models_generated_by_user(); // Load first batch
    // =============================================
  },

  methods: {
    // ========== NEW: Load More Models Method ==========
    /**
     * Loads the next batch of 3D models from the API
     * Appends them to the existing list for infinite scroll effect
     */
    async loadMoreModels() {
      // Prevent multiple simultaneous requests
      if (this.loadingMoreModels || !this.pagination.hasMoreModels) {
        console.warn('⚠️ Cannot load more: already loading or no more models');
        return;
      }

      this.loadingMoreModels = true;

      try {
        const limit = this.pagination.pageSize;
        const offset = this.pagination.currentOffset;
        
        const url = `${this.$store.state.root_api}engine/generated-3d-models-list/?limit=${limit}&offset=${offset}`;

        console.log('📡 Loading more 3D models...', { 
          offset: offset,
          limit: limit,
          currentTotal: this.list_history_generated_3d_models.length
        });

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        // Append new models to the list
        if (!responseData.results?.error && responseData.results?.models) {
          const newModels = responseData.results.models;
          const previousCount = this.list_history_generated_3d_models.length;
          
          // Append new models
          this.list_history_generated_3d_models.push(...newModels);

          // Update offset for next request
          this.pagination.currentOffset += this.pagination.pageSize;

          // Check if more models exist
          this.pagination.hasMoreModels = this.list_history_generated_3d_models.length < this.pagination.totalCount;

          console.log('✅ More models loaded:', {
            newModelsCount: newModels.length,
            previousCount: previousCount,
            totalLoaded: this.list_history_generated_3d_models.length,
            totalAvailable: this.pagination.totalCount,
            hasMore: this.pagination.hasMoreModels
          });

          this.$message.success(`Loaded ${newModels.length} more models`);

        } else {
          throw new Error(responseData.results?.message || 'Failed to parse response');
        }

      } catch (error) {
        console.error('❌ Error loading more models:', error);
        this.$message.error('Failed to load more models: ' + error.message);

      } finally {
        this.loadingMoreModels = false;
      }
    },
    // ================================================

    /**
     * Handle model selection from the history list
     */
    async clickedModel(modelData) {
      console.log('🎯 Model clicked:', modelData);
      
      if (!modelData) {
        console.warn('⚠️ No model data provided');
        return;
      }

      this.model_data_instance_id = modelData.new3d_model_instance;
      const mediaUrl = modelData.media_url || modelData.url;

      if (!mediaUrl) {
        console.error('❌ No media URL in model data');
        return;
      }

      const fixedUrl = mediaUrl.replace(/\\/g, '/');
      const fullUrl = this.$store.state.root_media_api + fixedUrl;
      
      console.log('📥 Fetching model file from:', fullUrl);

      try {
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch model: HTTP ${response.status}`);
        }

        const blob = await response.blob();
        console.log('✅ File fetched, size:', blob.size, 'bytes');

        const fileName = modelData.name || 'model.glb';
        const file = new File([blob], fileName, { type: blob.type });
        
        this.local3dModelUrl = fullUrl;
        this.uploaded3dModelFile = {
          file: file,
          name: modelData.name || 'Generated Model',
          size: (blob.size / 1024 / 1024).toFixed(2) + ' MB',
          isGenerated: true,
          generatedUrl: fixedUrl,
          modelId: modelData.id
        };

        console.log('✅ 3D Model loaded successfully');

      } catch (error) {
        console.error('❌ Error fetching model file:', error);
        this.$message.error('Failed to load model file: ' + error.message);
      }
    },

    /**
     * Fetch generated 3D models with pagination support
     */
    async fetch3d_models_generated_by_user() {
      this.loading_generated_models_history = true;

      try {
          
        const limit = this.pagination.pageSize;
        const offset = this.pagination.currentOffset;
        
        const url = `${this.$store.state.root_api}engine/generated-3d-models-list/?limit=${limit}&offset=${offset}`;

        console.log('📡 Fetching 3D models history...', { 
          offset: offset,
          limit: limit 
        });

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        
        console.log('✅ API Response received:', {
          totalCount: responseData.count,
          modelsCount: responseData.results?.models?.length || 0
        });

        // ========== NEW: Handle paginated response ==========
        if (!responseData.results?.error) {
          // On first load (offset=0), initialize the list
          if (this.pagination.currentOffset === 0) {
            this.list_history_generated_3d_models = responseData.results.models || [];
            console.log('📌 First batch loaded');
          } else {
            // On "Load More", append to existing list
            this.list_history_generated_3d_models.push(...(responseData.results.models || []));
            console.log('📌 Additional batch appended');
          }

          // Update pagination info from API response
          this.pagination.totalCount = responseData.count || 0;

          // Calculate if more models exist
          this.pagination.hasMoreModels = this.list_history_generated_3d_models.length < this.pagination.totalCount;
          this.pagination.currentOffset = this.pagination.currentOffset + this.pagination.pageSize
          console.log('✅ Pagination Status:', {
            loaded: this.list_history_generated_3d_models.length,
            total: this.pagination.totalCount,
            hasMore: this.pagination.hasMoreModels,
            // nextOffset: this.pagination.currentOffset + this.pagination.pageSize
          });

        } else {
          throw new Error(responseData.results?.message || 'Failed to fetch models');
        }

      } catch (error) {
        console.error('❌ Failed to fetch 3D models:', error);
        this.error.general = error.message;
        this.$message.error('Failed to fetch 3D models: ' + error.message);

      } finally {
        this.loading_generated_models_history = false;
      }
    },

    /**
     * Load available textures for the product
     */
    async loadAvailableTextures() {
      try {
        this.loadingTextures = true;
        const store = this.$store;
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${store.state.root_api}product/api/products/user-textures/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          }
        });
        
        const result = await response.json();
        console.log('📦 Available textures:', result);
        
        if (result.results?.success) {
          const textureArray = result.results.data || [];
          this.availableTextures = textureArray.map(texture => ({
            id: texture?.id,
            url: texture?.image_url || texture?.url,
          }));
          
          console.log('✅ Textures loaded:', this.availableTextures.length);
        }
      } catch (error) {
        console.error('❌ Error loading textures:', error);
        this.availableTextures = [];
      } finally {
        this.loadingTextures = false;
      }
    },

    addPresetTexture(texture) {
      if (!this.selectedTextures.some(t => t.id === texture.id)) {
        this.selectedTextures.push({
          id: texture?.id,
          url: texture?.url,
        });
      } else {
        const index = this.selectedTextures.findIndex(t => t.id === texture.id);
        if (index > -1) {
          this.selectedTextures.splice(index, 1);
        }
      }
    },

    getTextureUrl(texture) {
      if (texture && texture.startsWith('data:')) {
        return texture;
      }
      if (texture) {
        return `${this.$store.state.root_media_api}${texture}`;
      }
      return '';
    },

    handlePaste(e) {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      let cleanValue = pastedText.replace(/[^0-9.]/g, '');
      
      const parts = cleanValue.split('.');
      if (parts.length > 2) {
        cleanValue = parts[0] + '.' + parts.slice(1).join('');
      }
      
      const input = e.target;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const currentValue = input.value;
      
      input.value = currentValue.substring(0, start) + cleanValue + currentValue.substring(end);
      input.dispatchEvent(new Event('input'));
    },

    allowOnlyDecimal(e) {
      const char = String.fromCharCode(e.keyCode);
      const value = e.target.value;
      
      if (!/[0-9]/.test(char) && char !== '.') {
        e.preventDefault();
        return;
      }
      
      if (char === '.' && value.includes('.')) {
        e.preventDefault();
        return;
      }
    },

    initializeFormWithDefaults(defaults) {
      this.productForm = {
        name: defaults.name || '',
        description: defaults.description || '',
        category_name: defaults.category_name || [],
        furniture_type: defaults.furniture_type || '',
        pricing: { 
          price: defaults.price || null 
        },
        dimensions: { 
          height: defaults.height || null,
          length: defaults.length || null,
          width: defaults.width || null
        },
      };

      this.selectedImages = defaults.images || [];
      this.selectedColors = (defaults.colors || []).map((color, index) => ({
        value: typeof color === 'string' ? color : color.value,
        isPrimary: index === 0
      }));
      this.selectedTextures = defaults.textures || [];
      this.selectedPbrFiles = defaults.pbrFiles || [];
      
      if (defaults.modelUrl) {
        this.local3dModelUrl = defaults.modelUrl;
      }

      if (defaults.category_name) {
        if (typeof defaults.category_name === 'string') {
          this.productForm.category_name = [defaults.category_name];
        }
        this.handleCategoryPreSelect(defaults.category_name);
      }
    },

    async handleCategoryPreSelect(categoryName) {
      if (this.allCategories.length > 0) {
        const foundCategory = this.allCategories.find(
          cat => cat.name === categoryName
        );
        
        if (foundCategory) {
          const exists = this.categoryOptions.some(
            opt => opt.value === foundCategory.name
          );
          
          if (!exists) {
            this.categoryOptions.unshift({
              label: foundCategory.name,
              value: foundCategory.name,
              data: foundCategory
            });
          }
        }
      }
    },

    async loadInitialCategories() {
      try {
        this.loadingCategories = true;
        const store = this.$store;
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${store.state.root_api}product/api/categories/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          }
        });
        
        const result = await response.json();
        
        if (result.success) {
          this.allCategories = result.data || [];
          this.categoryOptions = this.allCategories.map(cat => ({
            label: cat.name,
            value: cat.name,
            data: cat
          }));
          
          console.log('✅ Categories loaded:', this.allCategories.length);
        }
      } catch (error) {
        console.error('❌ Error loading categories:', error);
        this.categorySearchError = 'Error loading categories';
      } finally {
        this.loadingCategories = false;
      }
    },

    async handleCategorySearch(searchValue) {
      console.log('🔍 Searching categories:', searchValue);
      
      if (this.categorySearchTimeout) {
        clearTimeout(this.categorySearchTimeout);
      }
      
      if (!searchValue || searchValue.trim().length === 0) {
        this.categoryOptions = this.allCategories.map(cat => ({
          label: cat.name,
          value: cat.name,
          data: cat
        }));
        return;
      }
      
      this.loadingCategories = true;
      this.categorySearchError = null;
      
      this.categorySearchTimeout = setTimeout(async () => {
        try {
          const store = this.$store;
          const token = localStorage.getItem('token');
          
          const response = await fetch(
            `${store.state.root_api}product/api/categories/search/?q=${encodeURIComponent(searchValue)}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
              }
            }
          );
          
          const result = await response.json();
          
          if (result.success) {
            this.categoryOptions = result.data.map(cat => ({
              label: cat.name,
              value: cat.name,
              data: cat
            }));
          }
        } catch (error) {
          console.error('❌ Error searching categories:', error);
          this.categorySearchError = 'Error searching categories';
          this.categoryOptions = [];
        } finally {
          this.loadingCategories = false;
        }
      }, 300);
    },

    handleSelectFocus() {
      if (this.categoryOptions.length === 0) {
        this.categoryOptions = this.allCategories.map(cat => ({
          label: cat.name,
          value: cat.name,
          data: cat
        }));
      }
    },
    
    handleCategoryChange(value) {
      this.categorySearchError = null;
      
      if (Array.isArray(value)) {
        if (value.length > 1) {
          this.productForm.category_name = [value[value.length - 1]];
        } else if (value.length === 1) {
          this.productForm.category_name = value;
        } else {
          this.productForm.category_name = [];
        }
      } else {
        this.productForm.category_name = value ? [value] : [];
      }
    },
    
    upload3dModel() {
      this.$refs.modelInput?.click();
    },

    handle3dModelUpload(event) {
      const file = event.target.files[0];
      if (file && this.validate3dModelFile(file)) {
        this.process3dModelFile(file);
      }
      event.target.value = '';
    },

    handleModelDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file && this.validate3dModelFile(file)) {
        this.process3dModelFile(file);
      }
    },

    validate3dModelFile(file) {
      const validTypes = ['.gltf', '.glb'];
      const maxSize = 50 * 1024 * 1024;
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      if (!validTypes.includes(fileExtension)) {
        console.error(`Invalid file type: ${file.name}`);
        return false;
      }

      if (file.size > maxSize) {
        console.error(`File too large: ${file.name}`);
        return false;
      }

      return true;
    },

    process3dModelFile(file) {
      const url = URL.createObjectURL(file);
      this.local3dModelUrl = url;
      this.uploaded3dModelFile = {
        file: file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      };
      console.log('✅ 3D Model loaded:', file.name);
    },

    remove3dModel() {
      if (this.local3dModelUrl) {
        URL.revokeObjectURL(this.local3dModelUrl);
      }
      this.local3dModelUrl = null;
      this.uploaded3dModelFile = null;
      console.log('🗑️ 3D Model removed');
    },

    async get3dRenderedModelDetails(generated3dModelId) {
      this.loading3dModelDetails = true;
      this.error.general = null;

      try {
        const store = this.$store;
        const renderedModal3dId = this.rendered_modal_3D_id;
        
        if (!renderedModal3dId) {
          throw new Error('No rendered modal 3D ID provided');
        }

        const url = `${store.state.root_api}product/api-product-owner/get-rendered-3d-model-details/${renderedModal3dId}/`;
        const token = localStorage.getItem('token');

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        
        if (responseData.success) {
          const details = responseData.data || {};
          console.log('✅ 3D Model Details:', details);
          this.modelDetails = details;
          return details;
        }
        
      } catch (error) {
        console.error("❌ Error fetching 3D model details:", error);
        this.error.general = error.message;
      } finally {
        this.loading3dModelDetails = false;
      }
    },

    resetForm() {
      this.initializeFormWithDefaults(this.defaultValues);
      
      if (!this.defaultValues.modelUrl && this.local3dModelUrl) {
        URL.revokeObjectURL(this.local3dModelUrl);
        this.local3dModelUrl = null;
        this.uploaded3dModelFile = null;
      }
    },

    uploadImages() {
      this.$refs.imageInput?.click();
    },

    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      
      if (this.selectedImages.length + files.length > 5) {
        console.warn('Maximum 5 images allowed');
        return;
      }

      files.forEach(file => {
        if (this.validateImageFile(file)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageObj = {
              file,
              url: e.target.result,
              isPrimary: this.selectedImages.length === 0
            };
            this.selectedImages.push(imageObj);
          };
          reader.readAsDataURL(file);
        }
      });
      event.target.value = '';
    },

    setPrimaryImage(image) {
      this.selectedImages.forEach(img => img.isPrimary = false);
      image.isPrimary = true;
    },

    removeImage(index) {
      const removedImage = this.selectedImages[index];
      this.selectedImages.splice(index, 1);
      
      if (removedImage.isPrimary && this.selectedImages.length > 0) {
        this.selectedImages[0].isPrimary = true;
      }
    },

    addAvailableColor() {
      if (this.tempColor && !this.selectedColors.some(c => c.value === this.tempColor)) {
        const colorObj = {
          value: this.tempColor,
          isPrimary: this.selectedColors.length === 0
        };
        this.selectedColors.push(colorObj);
        this.tempColor = '#000000';
      }
    },

    addPresetColor(color) {
      if (!this.selectedColors.some(c => c.value === color)) {
        const colorObj = {
          value: color,
          isPrimary: this.selectedColors.length === 0
        };
        this.selectedColors.push(colorObj);
      }
    },

    setPrimaryColor(color) {
      this.selectedColors.forEach(c => c.isPrimary = false);
      color.isPrimary = true;
    },

    removeColor(index) {
      const removedColor = this.selectedColors[index];
      this.selectedColors.splice(index, 1);
      
      if (removedColor.isPrimary && this.selectedColors.length > 0) {
        this.selectedColors[0].isPrimary = true;
      }
    },

    uploadPbr() {
      this.$refs.pbrInput?.click();
    },

    handlePbrUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (this.validatePbrFile(file)) {
          this.selectedPbrFiles.push({ 
            file, 
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
          });
        }
      });
      event.target.value = '';
    },

    validatePbrFile(file) {
      const validTypes = ['.pbr', '.zip', '.rar', '.7z', '.tar', '.gz'];
      const maxSize = 50 * 1024 * 1024;
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      if (!validTypes.includes(fileExtension)) {
        console.error(`Invalid PBR file type: ${file.name}`);
        return false;
      }

      if (file.size > maxSize) {
        console.error(`PBR file too large: ${file.name}`);
        return false;
      }

      return true;
    },

    removePbrFile(index) {
      this.selectedPbrFiles.splice(index, 1);
    },

    uploadTexture() {
      this.$refs.textureInput?.click();
    },

    handleTextureUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (this.validateImageFile(file)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedTextures.push({ 
              id: null,
              file, 
              name: file.name,
              url: e.target.result 
            });
          };
          reader.readAsDataURL(file);
        }
      });
      event.target.value = '';
    },

    removeTexture(index) {
      this.selectedTextures.splice(index, 1);
    },

    validateImageFile(file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        console.error(`Invalid image file type: ${file.name}`);
        return false;
      }

      if (file.size > maxSize) {
        console.error(`Image file too large: ${file.name}`);
        return false;
      }

      return true;
    },

    validateForm() {
      if (!this.productForm.name?.trim()) {
        console.error('Product name is required');
        return false;
      }
      if (!this.productForm.category_name) {
        console.error('Category is required');
        return false;
      }
      if (!this.productForm.pricing.price || parseFloat(this.productForm.pricing.price) <= 0) {
        console.error('Valid price is required');
        return false;
      }
      if (this.selectedImages.length === 0) {
        this.$message.error('At least one product image is required');
        return false;
      }
      if (!this.local3dModelUrl && !this.rendered_modal_3D_id) {
        console.error('3D model is required');
        return false;
      }
      return true;
    },

    async handleSave() {
      if (!this.validateForm()) return;

      this.isSaving = true;

      try {
        const store = this.$store;
        const token = localStorage.getItem('token');
        const formData = new FormData();
        
        formData.append('variation_id', this.prepopulatedData.id);
        formData.append('name', this.productForm.name);
        formData.append('description', this.productForm.description || '');
        formData.append('category_name', this.categoryNameDisplay);
        
        if (this.productForm.furniture_type) {
          formData.append('furniture_type', this.productForm.furniture_type);
        }
        
        formData.append('price', this.productForm.pricing.price);
        
        if (this.uploaded3dModelFile) {
          formData.append('rendered_modal_3d_id', this.model_data_instance_id);
        }

        if (this.productForm.dimensions.height) {
          formData.append('height', this.productForm.dimensions.height);
        }
        if (this.productForm.dimensions.length) {
          formData.append('length', this.productForm.dimensions.length);
        }
        if (this.productForm.dimensions.width) {
          formData.append('width', this.productForm.dimensions.width);
        }

        this.selectedImages.forEach((image, index) => {
          formData.append('images', image.file);
          if (image.isPrimary) {
            formData.append('primary_image_index', index);
          }
        });

        this.selectedPbrFiles.forEach(pbrFile => {
          formData.append('pbr_files', pbrFile.file);
        });

        if (this.selectedColors.length > 0) {
          const colorsData = this.selectedColors.map(c => ({
            value: c.value,
            isPrimary: c.isPrimary
          }));
          formData.append('available_colors', JSON.stringify(colorsData));
        }

        const textureIds = [];
        this.selectedTextures.forEach((texture) => {
          if (texture.file) {
            formData.append('textures', texture.file);
          } else if (texture.id) {
            textureIds.push(texture.id);
          }
        });

        if (textureIds.length > 0) {
          formData.append('texture_ids', JSON.stringify(textureIds));
        }

        const response = await fetch(`${store.state.root_api}product/api-product-owner/products/`, {
          method: 'POST',
          headers: { 
            'Authorization': `Token ${token}` 
          },
          body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
          console.log('✅ Product created:', result.data);
          this.$emit('product-created', result.data);
          this.$emit('update:visible', false);
          this.resetForm();
        } else {
          throw new Error(result.message || 'Failed to create product');
        }

      } catch (error) {
        console.error('❌ Error creating product:', error);
        this.$message.error('Error creating product. Please try again.');
      } finally {
        this.isSaving = false;
      }
    },

    handleCancel() {
      this.resetForm();
      this.$emit('update:visible', false);
      this.$emit('cancel');
    }
  }
};
</script>

<style scoped>
.add-product-modal :deep(.ant-modal-header) {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.add-product-modal :deep(.ant-modal-body) {
  padding: 24px;
  max-height: 80vh;
  overflow-y: auto;
}

.add-product-modal :deep(.ant-select-selector) {
  background: #f3f4f6 !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 6px !important;
}

.add-product-modal :deep(.ant-input) {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
}

.add-product-modal :deep(.ant-input-number) {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
}

.add-product-modal :deep(.ant-input:focus),
.add-product-modal :deep(.ant-input-number:focus),
.add-product-modal :deep(.ant-input-number-focused) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* Custom scrollbar for modal body */
.add-product-modal :deep(.ant-modal-body::-webkit-scrollbar) {
  width: 6px;
}

.add-product-modal :deep(.ant-modal-body::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

.add-product-modal :deep(.ant-modal-body::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 3px;
}

.add-product-modal :deep(.ant-modal-body::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}

/* Image gallery improvements */
.image-gallery img {
  transition: all 0.2s ease;
}

.image-gallery img:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Primary image indicator */
.primary-indicator {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .add-product-modal {
    width: 95% !important;
    margin: 10px;
  }
  
  .add-product-modal :deep(.ant-modal-body) {
    padding: 16px;
  }
}

/* Button improvements */
.ant-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* Color picker improvements */
.color-picker-input {
  cursor: pointer !important;
}

.color-picker-input:hover {
  border-color: #3b82f6 !important;
}

/* Upload area styling */
.image-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-upload-area:hover {
  border-color: #3b82f6;
  background-color: #f8faff;
}
</style>