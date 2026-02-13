<template>
  <div>
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 0 10px;">
      <div style="display: flex; align-items: center;">
        <a-button @click="cancel_edit_back_texture_list" type="text" style="padding: 4px; margin-right: 16px;" size="small">
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </template>
        </a-button>
        <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #1f2937;">Edit Floor Texture</h2>
      </div>
      <div style="display: flex; gap: 12px;">
        <a-button @click="cancel_edit_back_texture_list" style="border-radius: 8px;">Cancel</a-button>
        <a-button type="primary" @click="saveTexture" :loading="isSaving" style="border-radius: 8px;">
          {{ isSaving ? 'Saving...' : 'Save' }}
        </a-button>
      </div>
    </div>

    <a-row style="padding: 0 24px;">
      <!-- Left Column - Texture Image Preview -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12">
        <div style="margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">Texture Preview</h3>
        </div>
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 24px;">Primary texture image preview</p>
        
        <div style="padding-right: 24px;">
          <div style="margin-bottom: 32px;">
            <!-- Primary Texture Display -->
            <div style="border: 2px solid #3b82f6; border-radius: 12px; padding: 16px; background: #f8faff; position: relative; min-height: 300px; display: flex; align-items: center; justify-content: center;">
              <div v-if="primaryImage" style="height: 100%; display: flex; align-items: center; justify-content: center;">
                <img 
                  :src="primaryImage.url" 
                  style="max-width: 100%; max-height: 280px; object-fit: contain; border-radius: 8px;"
                  alt="Primary texture preview"
                />
              </div>
              <div v-else style="height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom: 16px;">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21,15 16,10 5,21"></polyline>
                </svg>
                <p style="font-size: 14px; margin: 0; text-align: center;">No texture image available</p>
              </div>
            </div>
          </div>
        </div>
      </a-col>

      <!-- Right Column - Images Gallery -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12">
        <h4 style="margin-bottom: 8px; font-weight: 500; font-size: 16px; color: #1f2937;">Product Images</h4>
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 16px;">Upload product images for display</p>
        
        <!-- Image Grid -->
        <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
          <!-- Existing Images -->
          <div v-for="img in selectedTexture.product_images" :key="img.id" style="position: relative;">
            <img :src="$store.state.root_media_api + img.image" @click="togglePrimaryImage(img.id)"
              style="width: 72px; height: 72px; border-radius: 8px; object-fit: cover; cursor: pointer;"
              :style="{ border: img.is_primary ? '3px solid #10b981' : '2px solid #e5e7eb' }"
            />
            <!-- Primary Badge -->
            <div v-if="img.is_primary" style="position: absolute; top: -6px; left: -6px; background: #10b981; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px;">★</div>
            <!-- Delete Button -->
           <a-button
  type="text"
  danger
  size="small"
  @click.stop="deleteImage(img.id)"
  class="!absolute -top-1.5 -right-1.5
         !flex !items-center !justify-center
         !bg-red-500 !text-white
         !rounded-full
         !w-5 !h-5 !min-w-5 !p-0"
>
  <svg
    class="w-3 h-3"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
</a-button>

          </div>

          <!-- Preview Images (Not yet saved) -->
          <div v-for="(preview, index) in imagePreviewsState" :key="'preview-' + index" style="position: relative;">
            <img :src="preview.url" style="width: 72px; height: 72px; border-radius: 8px; object-fit: cover; border: 2px solid #3b82f6; opacity: 0.8;" />
            <!-- Loading Overlay -->
            <div v-if="preview.uploading" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <div style="width: 16px; height: 16px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <!-- Remove Preview -->
            <a-button v-if="!preview.uploading" type="text" danger size="small" @click="removePreview(index)"
              style="position: absolute; top: -6px; right: -6px; background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; padding: 0; min-width: 20px;">
              <template #icon>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </template>
            </a-button>
          </div>
          
          <!-- Add More Images -->
          <div @click="uploadMoreImages" 
            style="width: 72px; height: 72px; border-radius: 8px; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #f9fafb;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
        </div>
      </a-col>

      <!-- Texture Details Section -->
      <a-col :span="24">
        <div style="padding-left: 24px; border-left: 1px solid #f3f4f6;">
          <h3 style="margin-bottom: 24px; font-weight: 600; font-size: 16px; color: #1f2937;">Floor Texture Details</h3>
          
          <!-- Title & Description -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Title <span style="color: red;">*</span></label>
            <a-input v-model:value="textureForm.title" placeholder="Floor Texture Title" style="border-radius: 8px;" size="large" />
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Description <span style="color: red;">*</span></label>
            <a-textarea v-model:value="textureForm.description" :rows="4" placeholder="Floor Texture Description" style="border-radius: 8px; resize: none;" />
          </div>

          <!-- Texture Style, Brand, Model Number -->
          <a-row :gutter="16" style="margin-bottom: 20px;">
            <a-col :span="6">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Texture Style <span style="color: red;">*</span></label>
              <a-select v-model:value="textureForm.texture_style" style="width: 100%;" size="large">
                <a-select-option v-for="style in textureStyles" :key="style" :value="style">{{ style }}</a-select-option>
              </a-select>
            </a-col>
             <a-col :span="6">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Sale Price per SQM <span style="color: red;">*</span></label>
              <a-input-number v-model:value="textureForm.sale_price_per_sqm" :min="0" :step="0.01" placeholder="20.00" suffix="$" style="width: 100%; border-radius: 8px;" size="large" />
            </a-col>
            <a-col :span="6">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Pattern Width (m) <span style="color: red;">*</span></label>
                <a-input-number v-model:value="textureForm.size_width" :min="0.01" :step="0.01" placeholder="10.00" style="width: 100%; border-radius: 6px;" />
              </a-col>
              <a-col :span="6">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Pattern Height (m) <span style="color: red;">*</span></label>
                <a-input-number v-model:value="textureForm.size_height" :min="0.01" :step="0.01" placeholder="10.00" style="width: 100%; border-radius: 6px;" />
              </a-col>
            <!-- <a-col :span="6">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Tile Width (cm)</label>
                <a-input-number v-model:value="textureForm.tile_width" :min="0.01" :step="0.01" placeholder="100.00" style="width: 100%; border-radius: 6px;" />
              </a-col>
              <a-col :span="6">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Tile Height (cm)</label>
                <a-input-number v-model:value="textureForm.tile_height" :min="0.01" :step="0.01" placeholder="100.00" style="width: 100%; border-radius: 6px;" />
              </a-col> -->
            <!-- <a-col :span="8">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Brand</label>
              <a-input v-model:value="textureForm.brand" placeholder="Brand Name" style="border-radius: 8px;" size="large" />
            </a-col>
            <a-col :span="8">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Model Number</label>
              <a-input v-model:value="textureForm.model_number" placeholder="Model Number" style="border-radius: 8px;" size="large" />
            </a-col> -->
            <br>

  <a-col :span="24">
    <h4 class="!pt-4" style="margin-bottom: 16px; font-weight: 500; font-size: 14px; color: #1f2937;">Available Colors <span style="color: red;">*</span></h4>
    <!-- Available Colors (Multiple Selection) -->
<div style="margin-bottom: 20px;">
  
  <!-- Color Picker for Available Colors -->
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
          @click="addColorFromTemp"
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
            opacity: isColorAlreadyAdded(color) ? 0.5 : 1
          }"
        ></div>
      </div>
    </template>
    <a-button style="border-radius: 6px; border: 2px dashed #d1d5db; display: flex;justify-content: space-between;gap:10px;align-items: center;">
      <!-- <template #icon> -->
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      <!-- </template> -->
      Add Colors
    </a-button>
  </a-popover>

  <!-- Display Selected Available Colors -->
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-top: 12px;">
    <!-- Existing Colors -->
    <div v-for="color in (selectedTexture?.associated_colors || [])" :key="color.id" style="position: relative;">
      <div 
        :style="{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          backgroundColor: color.color_hex, 
          cursor: 'pointer', 
          border: '2px solid #e5e7eb'
        }"
      ></div>
      <!-- Remove color button -->
     <a-button
  type="text"
  size="small"
  @click="deleteColor(color.id)"
  class="!absolute -top-2 -right-2
         !flex !items-center !justify-center
         !bg-red-500 !text-white
         !rounded-full
         !w-5 !h-5 !min-w-5 !p-0"
>
  <svg
    class="w-3 h-3"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
</a-button>

    </div>
  </div>
</div>
    
  </a-col>
          </a-row>

          <!-- Material, Thickness, Weight -->
          <!-- <a-row :gutter="16" style="margin-bottom: 20px;">
            <a-col :span="8">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Material</label>
              <a-input v-model:value="textureForm.material_composition" placeholder="Material Composition" style="border-radius: 8px;" size="large" />
            </a-col>
            <a-col :span="8">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Thickness (mm)</label>
              <a-input-number v-model:value="textureForm.thickness" :min="0" :step="0.01" placeholder="2.5" style="width: 100%; border-radius: 8px;" size="large" />
            </a-col>
            <a-col :span="8">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Weight (kg/sqm)</label>
              <a-input-number v-model:value="textureForm.weight_per_sqm" :min="0" :step="0.01" placeholder="1.2" style="width: 100%; border-radius: 8px;" size="large" />
            </a-col>
          </a-row> -->

          <!-- Pricing -->
          <!-- <a-row :gutter="16" style="margin-bottom: 20px;"> -->
            <!-- <a-col :span="6">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Price per SQM</label>
              <a-input-number v-model:value="textureForm.price_per_sqm" :min="0" :step="0.01" placeholder="25.00" suffix="$" style="width: 100%; border-radius: 8px;" size="large" />
            </a-col> -->
            <!-- <a-col :span="6">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Sale Price per SQM</label>
              <a-input-number v-model:value="textureForm.sale_price_per_sqm" :min="0" :step="0.01" placeholder="20.00" suffix="$" style="width: 100%; border-radius: 8px;" size="large" />
            </a-col> -->
            <!-- <a-col :span="6">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Installation Cost per SQM</label>
              <a-input-number v-model:value="textureForm.installation_cost_per_sqm" :min="0" :step="0.01" placeholder="2.00" suffix="$" style="width: 100%; border-radius: 8px;" size="large" />
            </a-col>
            <a-col :span="6">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Stock Quantity</label>
              <a-input-number v-model:value="textureForm.stock_quantity" :min="0" :step="1" placeholder="100" style="width: 100%; border-radius: 8px;" size="large" />
            </a-col> -->
          <!-- </a-row> -->

          <!-- Dimensions -->
          <!-- <div style="margin-bottom: 24px;"> -->
            <!-- <h4 style="margin-bottom: 16px; font-weight: 500; font-size: 14px; color: #1f2937;">Pattern & Coverage Dimensions</h4> -->
            <!-- <a-row :gutter="16"> -->
              <!-- <a-col :span="6">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Pattern Width (m)</label>
                <a-input-number v-model:value="textureForm.size_width" :min="0.01" :step="0.01" placeholder="10.00" style="width: 100%; border-radius: 6px;" />
              </a-col>
              <a-col :span="6">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Pattern Height (m)</label>
                <a-input-number v-model:value="textureForm.size_height" :min="0.01" :step="0.01" placeholder="10.00" style="width: 100%; border-radius: 6px;" />
              </a-col> -->
              <!-- <a-col :span="6">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Tile Width (cm)</label>
                <a-input-number v-model:value="textureForm.tile_width" :min="0.01" :step="0.01" placeholder="100.00" style="width: 100%; border-radius: 6px;" />
              </a-col>
              <a-col :span="6">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Tile Height (cm)</label>
                <a-input-number v-model:value="textureForm.tile_height" :min="0.01" :step="0.01" placeholder="100.00" style="width: 100%; border-radius: 6px;" />
              </a-col> -->
            <!-- </a-row> -->
            <!-- <a-row :gutter="16" style="margin-top: 16px;">
              <a-col :span="6">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Coverage per Unit (sqm)</label>
                <a-input-number v-model:value="textureForm.coverage_per_unit" :min="0.01" :step="0.01" placeholder="5.00" style="width: 100%; border-radius: 6px;" />
              </a-col>
              <a-col :span="6">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Seamless Pattern</label>
                <div style="margin-top: 8px;">
                  <a-switch v-model:checked="textureForm.is_seamless" />
                </div>
              </a-col>
            </a-row> -->
          <!-- </div> -->

          <!-- Colors -->
          <a-row :gutter="24">
  <!-- <a-col :span="12">
    <h4 style="margin-bottom: 16px; font-weight: 500; font-size: 14px; color: #1f2937;">Primary & Secondary Colors</h4>
    <a-row :gutter="12" style="margin-bottom: 16px;"> -->
      <!-- <a-col :span="12">
        <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Primary Color</label>
        <div style="display: flex; align-items: center; gap: 8px;">
            <a-popover trigger="click" placement="bottom">
                  <template #title>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span>Pick Primary Color</span>
                      <input 
                        type="color" 
                        :value="textureForm.primary_color || '#000000'"
                        @input="textureForm.primary_color = $event.target.value"
                        style="width: 30px; height: 25px; border: none; border-radius: 4px; cursor: pointer;"
                      />
                    </div>
                  </template>
                  <template #content>
                    <div style="display: grid; grid-template-columns: repeat(6, 32px); gap: 8px; padding: 8px;">
                      <div
                        v-for="(color, index) in presetColors"
                        :key="index"
                        @click="textureForm.primary_color = color"
                        :style="{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          backgroundColor: color,
                          cursor: 'pointer',
                          border: textureForm.primary_color === color ? '3px solid #000' : '1px solid #e5e7eb'
                        }"
                      ></div>
                    </div>
                  </template>
                  <a-input
                    v-model:value="textureForm.primary_color"
                    readonly
                    style="width: 100%; border-radius: 6px; cursor: pointer; background: #f9fafb;"
                    :style="{ borderLeft: '24px solid ' + (textureForm.primary_color || '#e5e7eb') }"
                  />
                </a-popover>


        </div> 
      </a-col>-->
      <!-- <a-col :span="12">
        <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Secondary Color</label>
        <div style="display: flex; align-items: center; gap: 8px;">
            <a-popover trigger="click" placement="bottom">
                  <template #title>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span>Pick Secondary Color</span>
                      <input 
                        type="color" 
                        :value="textureForm.secondary_color || '#000000'"
                        @input="textureForm.secondary_color = $event.target.value"
                        style="width: 30px; height: 25px; border: none; border-radius: 4px; cursor: pointer;"
                      />
                    </div>
                  </template>
                  <template #content>
                    <div style="display: grid; grid-template-columns: repeat(6, 32px); gap: 8px; padding: 8px;">
                      <div
                        v-for="(color, index) in presetColors"
                        :key="index"
                        @click="textureForm.secondary_color = color"
                        :style="{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          backgroundColor: color,
                          cursor: 'pointer',
                          border: textureForm.secondary_color === color ? '3px solid #000' : '1px solid #e5e7eb'
                        }"
                      ></div>
                    </div>
                  </template>
                  <a-input
                    v-model:value="textureForm.secondary_color"
                    readonly
                    style="width: 100%; border-radius: 6px; cursor: pointer; background: #f9fafb;"
                    :style="{ borderLeft: '24px solid ' + (textureForm.secondary_color || '#e5e7eb') }"
                  />
                </a-popover>


        </div>
      </a-col> -->
    <!-- </a-row>
  </a-col> -->
<!-- 
  <a-col :span="12">
    <h4 style="margin-bottom: 16px; font-weight: 500; font-size: 14px; color: #1f2937;">Available Colors</h4>
    
<div style="margin-bottom: 20px;">
  
  
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
          @click="addColorFromTemp"
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
            opacity: isColorAlreadyAdded(color) ? 0.5 : 1
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

  
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-top: 12px;">
    
    <div v-for="color in (selectedTexture?.associated_colors || [])" :key="color.id" style="position: relative;">
      <div 
        :style="{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          backgroundColor: color.color_hex, 
          cursor: 'pointer', 
          border: '2px solid #e5e7eb'
        }"
      ></div>
      
      <a-button 
        type="text" 
        size="small" 
        @click="deleteColor(color.id)"
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
    
  </a-col> -->
</a-row>
        </div>
      </a-col>
    </a-row>

    <!-- Hidden File Inputs -->
    <input ref="imageInput" type="file" style="display: none;" accept=".jpg,.jpeg,.png" multiple @change="handleImageUpload" />
  </div>
</template>

<script>
export default {
  name: "edit_Floor_texture_details_page",
  props: {
    selectedTexture: { type: Object, required: true }
  },
  data() {
    return {
      textureForm: {
        title: '',
        description: '',
        texture_style: '',
        brand: '',
        model_number: '',
        material_composition: '',
        thickness: null,
        weight_per_sqm: null,
        size_width: null,
        size_height: null,
        tile_width: null,
        tile_height: null,
        coverage_per_unit: null,
        is_seamless: false,
        price_per_sqm: null,
        sale_price_per_sqm: null,
        installation_cost_per_sqm: null,
        primary_color: '',
        secondary_color: '',
        stock_quantity: null,
      },
      tempColor: '#000000',

       presetColors : [
      '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
      '#FF00FF', '#00FFFF', '#C0C0C0', '#808080', '#800000', '#808000',
      '#008000', '#800080', '#008080', '#000080', '#FFA500', '#FFC0CB',
      '#A52A2A', '#DDA0DD', '#98FB98', '#F0E68C', '#DEB887', '#D2691E',
      '#FF6347', '#40E0D0', '#EE82EE', '#90EE90', '#FFB6C1', '#87CEEB'
    ],
      textureStyles: [
        'Modern', 'Traditional', 'Contemporary', 'Industrial', 
        'Rustic', 'Minimalist', 'Classic', 'Vintage'
      ],
      customColor: '#8B4513',
      isSaving: false,
      imagePreviewsState: [],
      hasUnsavedChanges: false
    }
  },
  computed: {
    primaryImage() {
      // Find primary image from existing images
      const primaryImg = this.selectedTexture.product_images?.find(img => img.is_primary);
      if (primaryImg) {
        return { url: this.$store.state.root_media_api + primaryImg.image };
      }
      // Fallback to texture_image if available
      if (this.selectedTexture.texture_image) {
        return { url: this.$store.state.root_media_api + this.selectedTexture.texture_image };
      }
      return null;
    }
  },
  mounted() {
    this.initializeForm();
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    this.cleanupPreviews();
  },
  watch: {
    selectedTexture: { 
      handler() { this.initializeForm(); }, 
      deep: true 
    },
    textureForm: { 
      handler() { this.hasUnsavedChanges = true; }, 
      deep: true 
    }
  },
  methods: {
    initializeForm() {
      if (this.selectedTexture) {
        this.textureForm = {
          title: this.selectedTexture.title || '',
          description: this.selectedTexture.description || '',
          texture_style: this.selectedTexture.texture_style || '',
          brand: this.selectedTexture.brand || '',
          model_number: this.selectedTexture.model_number || '',
          material_composition: this.selectedTexture.material_composition || '',
          thickness: this.selectedTexture.thickness || null,
          weight_per_sqm: this.selectedTexture.weight_per_sqm || null,
          size_width: this.selectedTexture.size_width || null,
          size_height: this.selectedTexture.size_height || null,
          tile_width: this.selectedTexture.tile_width || null,
          tile_height: this.selectedTexture.tile_height || null,
          coverage_per_unit: this.selectedTexture.coverage_per_unit || null,
          is_seamless: this.selectedTexture.is_seamless || false,
          price_per_sqm: this.selectedTexture.price_per_sqm || null,
          sale_price_per_sqm: this.selectedTexture.sale_price_per_sqm || null,
          installation_cost_per_sqm: this.selectedTexture.installation_cost_per_sqm || null,
          primary_color: this.selectedTexture.primary_color || '',
          secondary_color: this.selectedTexture.secondary_color || '',
          stock_quantity: this.selectedTexture.stock_quantity || null
        };
        this.hasUnsavedChanges = false;
        this.imagePreviewsState = [];
      }
    },

    handleBeforeUnload(e) {
      if (this.hasUnsavedChanges) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = message;
        return message;
      }
    },

    cancel_edit_back_texture_list() {
      if (this.hasUnsavedChanges) {
        this.$confirm({
          title: 'Unsaved Changes',
          content: 'You have unsaved changes. Are you sure you want to leave without saving?',
          okText: 'Leave',
          okType: 'danger',
          cancelText: 'Stay',
          onOk: () => this.$emit('cancel_edit_back_product_list', this.selectedTexture.id)
        });
      } else {
        this.$emit('cancel_edit_back_product_list', this.selectedTexture.id);
      }
    },

    // File Upload Methods
    uploadMoreImages() { 
      this.$refs.imageInput.click(); 
    },

    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (this.validateImageFile(file)) {
          const preview = { file, url: URL.createObjectURL(file), uploading: false };
          this.imagePreviewsState.push(preview);
        }
      });
      event.target.value = '';
    },

    removePreview(index) {
      const preview = this.imagePreviewsState[index];
      if (preview.url) URL.revokeObjectURL(preview.url);
      this.imagePreviewsState.splice(index, 1);
    },

    cleanupPreviews() {
      this.imagePreviewsState.forEach(preview => {
        if (preview.url) URL.revokeObjectURL(preview.url);
      });
      this.imagePreviewsState = [];
    },

    validateImageFile(file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.$message.error(`Invalid file type for ${file.name}. Please upload JPEG, JPG, or PNG files only.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.$message.error(`File ${file.name} is too large. Please upload files smaller than 10MB.`);
        return false;
      }
      return true;
    },


     addColorFromTemp() {
    if (this.tempColor && !this.isColorAlreadyAdded(this.tempColor)) {
      this.addColor(this.tempColor);
      this.tempColor = '#000000'; // Reset temp color
    } else if (this.isColorAlreadyAdded(this.tempColor)) {
      this.$message.warning('Color already exists');
    }
  },

  addPresetColor(color) {
    if (!this.isColorAlreadyAdded(color)) {
      this.addColor(color);
    } else {
      this.$message.warning('Color already exists');
    }
  },

  isColorAlreadyAdded(colorHex) {
    return this.selectedTexture?.associated_colors?.some(color => color.color_hex === colorHex) || false;
  },


    // Primary Image Toggle
    async togglePrimaryImage(imageId) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.$store.state.root_api}room/api-owner/floor/${this.selectedTexture.id}/images/${imageId}/set-primary/`, {
          method: 'PATCH',
          headers: { 'Authorization': `Token ${token}` }
        });

        const result = await response.json();
        if (result.success) {
          // Update local data
          this.selectedTexture.product_images.forEach(img => img.is_primary = false);
          const targetImage = this.selectedTexture.product_images.find(img => img.id === imageId);
          if (targetImage) targetImage.is_primary = true;
          this.$message.success('Primary image updated successfully');
        } else {
          this.$message.error(result.message || 'Failed to update primary image');
        }
      } catch (error) {
        this.$message.error('Error updating primary image');
        console.error('Error:', error);
      }
    },

    // Color Management
    async addColor(colorHex) {
    if (this.isColorAlreadyAdded(colorHex)) {
      this.$message.warning('Color already exists');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.$store.state.root_api}room/api-owner/floor/${this.selectedTexture.id}/colors/`, {
        method: 'POST',
        headers: { 
          'Authorization': `Token ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ color_hex: colorHex })
      });

      const result = await response.json();
      if (result.success) {
        this.selectedTexture.associated_colors.push({ 
          id: result.data.id, 
          color_hex: result.data.color_hex,
          title: result.data.title,
          is_active: true
        });
        this.$message.success('Color added successfully');
      } else {
        this.$message.error(result.message || 'Failed to add color');
      }
    } catch (error) {
      this.$message.error('Error adding color');
      console.error('Error adding color:', error);
    }
  },

    async deleteColor(colorId) {
      this.$confirm({
        title: 'Delete Color',
        content: 'Are you sure you want to delete this color?',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.$store.state.root_api}room/api-owner/floor/${this.selectedTexture.id}/colors/${colorId}/`, {
              method: 'DELETE',
              headers: { 'Authorization': `Token ${token}` }
            });

            const result = await response.json();
            if (result.success) {
              const index = this.selectedTexture.associated_colors.findIndex(color => color.id === colorId);
              if (index !== -1) {
                this.selectedTexture.associated_colors.splice(index, 1);
              }
              this.$message.success('Color deleted successfully');
            } else {
              this.$message.error(result.message || 'Failed to delete color');
            }
          } catch (error) {
            this.$message.error('Error deleting color');
            console.error('Error deleting color:', error);
          }
        }
      });
    },

    async deleteImage(imageId) {
      this.$confirm({
        title: 'Delete Image',
        content: 'Are you sure you want to delete this image?',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.$store.state.root_api}room/api-owner/floor/${this.selectedTexture.id}/images/${imageId}/`, {
              method: 'DELETE',
              headers: { 'Authorization': `Token ${token}` }
            });

            const result = await response.json();
            if (result.success) {
              const index = this.selectedTexture.product_images.findIndex(img => img.id === imageId);
              if (index !== -1) {
                this.selectedTexture.product_images.splice(index, 1);
              }
              this.$message.success('Image deleted successfully');
            } else {
              this.$message.error(result.message || 'Failed to delete image');
            }
          } catch (error) {
            this.$message.error('Error deleting image');
            console.error('Error deleting image:', error);
          }
        }
      });
    },

   validateForm() {
  // Title validation
  if (!this.textureForm.title.trim()) {
    this.$message.error('Title is required');
    return false;
  }
  
  // Description validation
  if (!this.textureForm.description.trim()) {
    this.$message.error('Description is required');
    return false;
  }
  
  // Texture Style validation
  if (!this.textureForm.texture_style) {
    this.$message.error('Texture Style is required');
    return false;
  }
  
  // Sale Price per SQM validation
  if (!this.textureForm.sale_price_per_sqm || parseFloat(this.textureForm.sale_price_per_sqm) <= 0) {
    this.$message.error('Sale Price per SQM is required and must be greater than 0');
    return false;
  }
  
  // Pattern Width validation
  if (!this.textureForm.size_width || parseFloat(this.textureForm.size_width) <= 0) {
    this.$message.error('Pattern Width is required and must be greater than 0');
    return false;
  }
  
  // Pattern Height validation
  if (!this.textureForm.size_height || parseFloat(this.textureForm.size_height) <= 0) {
    this.$message.error('Pattern Height is required and must be greater than 0');
    return false;
  }
  
  // Available Colors validation
  if (!this.selectedTexture?.associated_colors || this.selectedTexture.associated_colors.length === 0) {
    this.$message.error('At least one available color is required');
    return false;
  }
  
  return true;
},


    async saveTexture() {
      if (!this.hasUnsavedChanges && this.imagePreviewsState.length === 0) {
        this.$message.info('No changes to save');
        return;
      }

      if (!this.validateForm()) return;

      this.isSaving = true;

      try {
        const token = localStorage.getItem('token');

        // Upload pending images first if any
        if (this.imagePreviewsState.length > 0) {
          const formData = new FormData();
          this.imagePreviewsState.forEach(preview => {
            formData.append('images', preview.file);
            preview.uploading = true;
          });

          const imageResponse = await fetch(`${this.$store.state.root_api}room/api-owner/floor/${this.selectedTexture.id}/images/`, {
            method: 'POST',
            headers: { 'Authorization': `Token ${token}` },
            body: formData
          });

          const imageResult = await imageResponse.json();
          if (imageResult.success) {
            // Add new images to the existing array
            this.selectedTexture.product_images.push(...imageResult.data);
            this.cleanupPreviews();
          }
        }

        // Update texture details
        const textureData = new FormData();
        
        // Add all form fields
        Object.keys(this.textureForm).forEach(key => {
          if (this.textureForm[key] !== null && this.textureForm[key] !== '') {
            textureData.append(key, this.textureForm[key]);
          }
        });

        const response = await fetch(`${this.$store.state.root_api}room/api-owner/floors/${this.selectedTexture.id}/`, {
          method: 'PUT',
          headers: { 'Authorization': `Token ${token}` },
          body: textureData
        });

        const result = await response.json();

        if (result.success) {
          this.$message.success('Floor texture updated successfully');
          this.hasUnsavedChanges = false;
          // Update parent component with new data
          this.$emit('texture-updated', result.data);
        } else {
          this.$message.error(result.message || 'Failed to update Floor texture');
        }

      } catch (error) {
        console.error('Error saving Floor texture:', error);
        this.$message.error('Error saving Floor texture. Please try again.');
      } finally {
        this.isSaving = false;
      }
    }
  }
}
</script>