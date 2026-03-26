<template>
  <a-modal
    :open="visible"
    :closable="false"
    :footer="null"
    width="900px"
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
  Add New Floor Texture Product
</span>        </div>
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
                <div>
                
                  <!-- Left Column - Texture Image Preview -->
                 <a-col
                :xs="24"
                :sm="24"
                :md="24"
                :lg="24"
                >       
                
                <div className="lg:w-100" style="border: 2px solid #3b82f6; border-radius: 12px; padding: 16px; background: #f8faff; position: relative; min-height: 350px; display: flex; align-items: center; justify-content: center;">
                      <div v-if="primaryImage" style="height: 100%; display: flex; align-items: center; justify-content: center;">
                        <img 
                          :src="primaryImage.url" 
                          style="max-width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px;"
                          alt="Primary texture preview"
                        />
                      </div>
                      <div v-else style="height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af;">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom: 16px;">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21,15 16,10 5,21"></polyline>
                        </svg>
                        <p style="font-size: 14px; margin: 0; text-align: center;">Upload texture images to preview</p>
                      </div>
                    </div>
                
                    <p style="font-size: 12px; color: #6b7280; margin-top: 8px; text-align: center;">
                      Primary texture image preview
                    </p>
                
                    <!-- Multiple Images Gallery -->
                    <div v-if="selectedImages.length > 0" style="margin-top: 16px;">
                      <h4 style="font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #1f2937;">Product Images</h4>
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
                          <!-- Primary image star indicator -->
                          <div 
                            v-if="image.isPrimary"
                            style="position: absolute; left: -5px; bottom: -5px; background: #22c55e; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px;"
                          >
                            ★
                          </div>
                          <!-- Remove image button -->
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
                
                    
                      <!-- Pricing Information -->
                      <!-- <div style="margin-bottom: 20px;">
                        <h4 style="margin-bottom: 12px; font-size: 14px; font-weight: 500; color: #1f2937;">Pricing</h4>
                        <a-row :gutter="12"> -->
                          <!-- <a-col :span="12">
                            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Price per SQM <span style="color: red;">*</span></label>
                            <a-input-number 
                              v-model:value="form.price_per_sqm" 
                              :min="0"
                              :step="0.01"
                              placeholder="25.00"
                              style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                            />
                          </a-col>
                          <a-col :span="12">
                            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Sale Price per SQM</label>
                            <a-input-number 
                              v-model:value="form.sale_price_per_sqm" 
                              :min="0"
                              :step="0.01"
                              placeholder="20.00"
                              style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                            />
                          </a-col>
                          <a-col :span="12">
                            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Installation Cost / SQM</label>
                            <a-input-number 
                              v-model:value="form.installation_cost_per_sqm" 
                              :min="0"
                              :step="0.01"
                              placeholder="5.00"
                              style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                            />
                          </a-col> -->
                          <!-- Stock Quantity -->
                        <!-- <a-col :span="12" style="margin-top: 12px;">
                          <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Stock Quantity <span style="color: red;">*</span></label>
                          <a-input-number 
                            v-model:value="form.stock_quantity" 
                            :min="0"
                            :step="1"
                            placeholder="100"
                            style="width: 200px; border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
                          />
                        </a-col> -->
                        <!-- </a-row>
                      </div> -->
                
                      <!-- Color Selection and Stock -->
                      <!-- <a-row :gutter="12" style="margin-bottom: 16px;"> -->
                        <!-- Primary Color -->
                        <!-- <a-col :span="12">
                          <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Primary Color</label>
                          <a-popover trigger="click" placement="bottom">
                            <template #title>
                              <div style="display: flex; align-items: center; gap: 8px;">
                                <span>Pick Primary Color</span>
                                <input 
                                  type="color" 
                                  :value="form.primary_color || '#000000'"
                                  @input="form.primary_color = $event.target.value"
                                  style="width: 30px; height: 25px; border: none; border-radius: 4px; cursor: pointer;"
                                />
                              </div>
                            </template>
                            <template #content>
                              <div style="display: grid; grid-template-columns: repeat(6, 32px); gap: 8px; padding: 8px;">
                                <div
                                  v-for="(color, index) in presetColors"
                                  :key="index"
                                  @click="form.primary_color = color"
                                  :style="{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    backgroundColor: color,
                                    cursor: 'pointer',
                                    border: form.primary_color === color ? '3px solid #000' : '1px solid #e5e7eb'
                                  }"
                                ></div>
                              </div>
                            </template>
                            <a-input
                              v-model:value="form.primary_color"
                              readonly
                              style="width: 100%; border-radius: 6px; cursor: pointer; background: #f9fafb;"
                              :style="{ borderLeft: '24px solid ' + (form.primary_color || '#e5e7eb') }"
                            />
                          </a-popover>
                        </a-col> -->
                
                        <!-- Secondary Color -->
                        <!-- <a-col :span="12">
                          <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Secondary Color</label>
                          <a-popover trigger="click" placement="bottom">
                            <template #title>
                              <div style="display: flex; align-items: center; gap: 8px;">
                                <span>Pick Secondary Color</span>
                                <input 
                                  type="color" 
                                  :value="form.secondary_color || '#000000'"
                                  @input="form.secondary_color = $event.target.value"
                                  style="width: 30px; height: 25px; border: none; border-radius: 4px; cursor: pointer;"
                                />
                              </div>
                            </template>
                            <template #content>
                              <div style="display: grid; grid-template-columns: repeat(6, 32px); gap: 8px; padding: 8px;">
                                <div
                                  v-for="(color, index) in presetColors"
                                  :key="index"
                                  @click="form.secondary_color = color"
                                  :style="{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    backgroundColor: color,
                                    cursor: 'pointer',
                                    border: form.secondary_color === color ? '3px solid #000' : '1px solid #e5e7eb'
                                  }"
                                ></div>
                              </div>
                            </template>
                            <a-input
                              v-model:value="form.secondary_color"
                              readonly
                              style="width: 100%; border-radius: 6px; cursor: pointer; background: #f9fafb;"
                              :style="{ borderLeft: '24px solid ' + (form.secondary_color || '#e5e7eb') }"
                            />
                          </a-popover>
                        </a-col> -->
                
                        
                      <!-- </a-row> -->
                
                      <!-- Available Colors (Multiple Selection) -->
                      <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #374151;">Available Colors <span style="color: red;">*</span></label>
                        
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
                                  opacity: form.available_colors.includes(color) ? 0.5 : 1
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
                
                        <!-- Display Selected Available Colors -->
                        <div v-if="form.available_colors.length > 0" style="margin-top: 12px;">
                          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            <div 
                              v-for="(color, index) in form.available_colors" 
                              :key="index"
                              style="position: relative;"
                            >
                              <div
                                :style="{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  backgroundColor: color,
                                  border: '2px solid #e5e7eb',
                                  cursor: 'pointer',
                                  position: 'relative'
                                }"
                              ></div>
                              <!-- Remove color button -->
                              <a-button 
                                type="text" 
                                size="small" 
                                @click="removeAvailableColor(index)"
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
                
                  </a-col>
                </div>
                <div>
                
                  <!-- Right Column - Product Details -->
                <a-col
                :xs="24"
                :sm="24"
                :md="24"
                :lg="24"
                >          <div style="padding-left: 12px;">
                      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #1f2937;">Floor Texture Details</h3>
                
                      <!-- Upload Multiple Images Section -->
                      <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #374151;">Product Images <span style="color: red;">*</span></label>
                        <div style="display: flex; gap: 8px; align-items: center;">
                          <div style="width: 48px; height: 48px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer;" @click="uploadImages">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                              <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                          </div>
                          <span style="font-size: 12px; color: #6b7280;">Click to upload multiple images (Max 5)</span>
                        </div>
                      </div>
                
                      <!-- Title Field -->
                      <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Title <span style="color: red;">*</span></label>
                        <a-input 
                          v-model:value="form.title" 
                          placeholder="Modern Grey Concrete Texture"
                          style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
                        />
                      </div>
                
                      <!-- Description Field -->
                      <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Description<span style="color: red;">*</span></label>
                        <a-textarea 
                          v-model:value="form.description"
                          :rows="3"
                          placeholder="A durable and stylish concrete texture suitable for modern interiors."
                          style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb; resize: none;"
                        />
                      </div>
                <div style="margin-bottom: 16px;">
  <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">
    Room Type <span style="color: red;">*</span>
  </label>
  <a-select
    v-model:value="selectedRoomType"
    placeholder="Select room type"
    style="width: 100%;"
    :style="{ background: '#f3f4f6' }"
    :loading="loadingRoomTypes"
    :allow-clear="true"
    @change="handleRoomTypeChange"
  >
    <a-select-option v-for="rt in roomTypes" :key="rt.id" :value="rt.id">
      {{ rt.name }}
    </a-select-option>
  </a-select>
</div>
                      <!-- Texture Style, Brand, Model Number Row -->
                      <a-row :gutter="12" style="margin-bottom: 16px;">
                        <a-col :span="12">
                          <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Texture Style <span style="color: red;">*</span></label>
                          <a-select 
                            v-model:value="form.texture_style" 
                            placeholder="Modern"
                            style="width: 100%;"
                            :style="{ background: '#f3f4f6' }"
                          >
                            <a-select-option v-for="style in textureStyles" :key="style" :value="style">{{ style }}</a-select-option>
                          </a-select>
                        </a-col>
                
                          <a-col :span="12">
                            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Sale Price per SQM <span style="color: red;">*</span></label>
                            <a-input-number 
                              v-model:value="form.sale_price_per_sqm" 
                              :min="0"
                              :step="0.01"
                              placeholder="20.00"
                              style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                            />
                          </a-col>
                        <!-- <a-col :span="8">
                          <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Brand</label>
                          <a-input 
                            v-model:value="form.brand" 
                            placeholder="DYD Textures"
                            style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
                          />
                        </a-col> -->
                        <!-- <a-col :span="8">
                          <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Model Number</label>
                          <a-input 
                            v-model:value="form.model_number" 
                            placeholder="WTX-MGC-001"
                            style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
                          />
                        </a-col> -->
                      </a-row>
                
                      <!-- Material Composition, Thickness, Weight per SQM Row -->
                      <a-row :gutter="12" style="margin-bottom: 16px;">
                        <!-- <a-col :span="8">
                          <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Material</label>
                          <a-input 
                            v-model:value="form.material_composition" 
                            placeholder="Concrete, Acrylic"
                            style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
                          />
                        </a-col> -->
                        <!-- <a-col :span="8">
                          <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Thickness (mm)</label>
                          <a-input-number 
                            v-model:value="form.thickness" 
                            :min="0"
                            :step="0.01"
                            placeholder="2.5"
                            style="width: 100%; border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
                          />
                        </a-col> -->
                        <!-- <a-col :span="8">
                          <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Weight (kg/sqm)</label>
                          <a-input-number 
                            v-model:value="form.weight_per_sqm" 
                            :min="0"
                            :step="0.01"
                            placeholder="1.2"
                            style="width: 100%; border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
                          />
                        </a-col> -->
                      </a-row>
                
                      <!-- Dimensions (Pattern Size), Tile Dimensions, Coverage per Unit Row -->
                      <div style="margin-bottom: 20px;">
                        <!-- <h4 style="margin-bottom: 12px; font-size: 14px; font-weight: 500; color: #1f2937;">Pattern & Coverage</h4> -->
                        <a-row :gutter="12">
                          <!-- <a-col :span="12">
                            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Pattern Width (m)</label>
                            <a-input-number 
                              v-model:value="form.size_width" 
                              :min="0.01"
                              :step="0.01"
                              placeholder="10.00"
                              style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                            />
                          </a-col> -->
                          <!-- <a-col :span="12">
                            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Pattern Height (m)</label>
                            <a-input-number 
                              v-model:value="form.size_height" 
                              :min="0.01"
                              :step="0.01"
                              placeholder="10.00"
                              style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                            />
                          </a-col> -->
                          
                          <a-col :span="12">
                            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Size Width (cm) <span style="color: red;">*</span></label>
                            <a-input-number 
                              v-model:value="form.size_width" 
                              :min="0.01"
                              :step="0.01"
                              placeholder="100.00"
                              style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                            />
                          </a-col>
                          <a-col :span="12">
                            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Size Height (cm) <span style="color: red;">*</span></label>
                            <a-input-number 
                              v-model:value="form.size_height" 
                              :min="0.01"
                              :step="0.01"
                              placeholder="100.00"
                              style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                            />
                          </a-col>
                        </a-row>
                        <!-- <a-row :gutter="12" style="margin-top: 16px;"> -->
                           <!-- <a-col :span="8">
                            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Coverage / Unit (sqm)</label>
                            <a-input-number 
                              v-model:value="form.coverage_per_unit" 
                              :min="0.01"
                              :step="0.01"
                              placeholder="5.00"
                              style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                            />
                          </a-col>
                         
                          <a-col :span="8">
                            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Plank Length</label>
                            <a-input-number 
                              v-model:value="form.plunk_height" 
                              :min="0.01"
                              :step="0.01"
                              placeholder="5.00"
                              style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                            />
                          </a-col>
                          <a-col :span="8">
                            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Plank Width</label>
                             <a-input-number 
                              v-model:value="form.plunk_width" 
                              :min="0.01"
                              :step="0.01"
                              placeholder="5.00"
                              style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                            />
                          </a-col>
                           <a-col :span="24" style="margin-top: 12px;">
                            <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Seamless Pattern</label>
                            <a-switch v-model:checked="form.is_seamless" />
                          </a-col> -->
                        <!-- </a-row> -->
                      </div>
                
                    </div>
                  </a-col>
                </div>
                </div>
     
    </div>

    <!-- Hidden File Input -->
    <input ref="imageInput" type="file" style="display: none;" accept=".jpg,.jpeg,.png" multiple @change="handleImageUpload" />
  </a-modal>
</template>

<script>
import { defineComponent, ref, watch, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';
import { useRouter,useRoute } from 'vue-router';

export default defineComponent({
  name: "AddNewFloorTexture",
  props: {
    visible: { type: Boolean, default: false },
  },
  emits: ['update:visible', 'product-created', 'cancel','api-error'],
  setup(props, { emit }) {
    const isSaving = ref(false);
    const tempColor = ref('#000000');
    
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    // Streamlined form state with only active fields
    const form = reactive({
      title: 'DYD Floor Texture',
      description: '',
      texture_style: 'Modern',
      sale_price_per_sqm: null,
      // tile_width: 100.00,
      // tile_height: 100.00,
       width: 100.00,  // Changed from tile_width
      height: 100.00, // Changed from tile_height
      available_colors: [],
      is_active: true,
    });

    const selectedImages = ref([]);
    const imageInput = ref(null);
const selectedRoomType = ref(null);
const roomTypes = ref([]);
const loadingRoomTypes = ref(false);
const selectedRoomTypeName = ref(null);
    // Computed property for primary image
    const primaryImage = computed(() => {
      return selectedImages.value.find(img => img.isPrimary) || selectedImages.value[0] || null;
    });

    // Texture styles options
    const textureStyles = [
      'Modern', 
      'Traditional', 
      'Contemporary', 
      'Industrial', 
      'Rustic', 
      'Minimalist', 
      'Classic', 
      'Vintage'
    ];

    // Preset colors for color picker
    const presetColors = [
      '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
      '#FF00FF', '#00FFFF', '#C0C0C0', '#808080', '#800000', '#808000',
      '#008000', '#800080', '#008080', '#000080', '#FFA500', '#FFC0CB',
      '#A52A2A', '#DDA0DD', '#98FB98', '#F0E68C', '#DEB887', '#D2691E',
      '#FF6347', '#40E0D0', '#EE82EE', '#90EE90', '#FFB6C1', '#87CEEB'
    ];

    // Reset form function
    const resetForm = () => {
      form.title = 'DYD Floor Texture';
      form.description = '';
      form.texture_style = 'Modern';
      form.sale_price_per_sqm = null;
      form.tile_width = 100.00;
      form.tile_height = 100.00;
      form.available_colors = [];
      form.is_active = true;
      
      selectedImages.value = [];
      tempColor.value = '#000000';
      selectedRoomType.value = null;
selectedRoomTypeName.value = null;
    };

    // Image handling functions
    const uploadImages = () => {
      imageInput.value?.click();
    };

    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files);
      
      if (selectedImages.value.length + files.length > 5) {
        message.warning('Maximum 5 images allowed');
        return;
      }

      files.forEach(file => {
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageObj = {
              file,
              url: e.target.result,
              isPrimary: selectedImages.value.length === 0
            };
            selectedImages.value.push(imageObj);
          };
          reader.readAsDataURL(file);
        }
      });

      event.target.value = '';
    };
const loadRoomTypes = async () => {
  try {
    loadingRoomTypes.value = true;
    const token = localStorage.getItem('token');
    const response = await fetch(`${store.state.root_api}product/api/room-types/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    });
    const result = await response.json();
    roomTypes.value = result || [];
  } catch (error) {
    console.error('Error loading room types:', error);
    roomTypes.value = [];
  } finally {
    loadingRoomTypes.value = false;
  }
};

const handleRoomTypeChange = (value) => {
  const found = roomTypes.value.find(rt => rt.id === value);
  selectedRoomType.value = value;
  selectedRoomTypeName.value = found ? found.name : null;
};
    const setPrimaryImage = (image) => {
      selectedImages.value.forEach(img => img.isPrimary = false);
      image.isPrimary = true;
    };

    const removeImage = (index) => {
      const removedImage = selectedImages.value[index];
      selectedImages.value.splice(index, 1);
      
      if (removedImage.isPrimary && selectedImages.value.length > 0) {
        selectedImages.value[0].isPrimary = true;
      }
    };

    // Color handling functions
    const addAvailableColor = () => {
      if (tempColor.value && !form.available_colors.includes(tempColor.value)) {
        form.available_colors.push(tempColor.value);
        tempColor.value = '#000000';
      }
    };

    const addPresetColor = (color) => {
      if (!form.available_colors.includes(color)) {
        form.available_colors.push(color);
      }
    };

    const removeAvailableColor = (index) => {
      form.available_colors.splice(index, 1);
    };

    // Improved form validation
    const validateForm = () => {
      const errors = [];

      if (!form.title?.trim()) {
        errors.push('Title is required');
      }
      
      if (!form.texture_style) {
        errors.push('Texture Style is required');
      }

       // NEW: sale price per sqm
  if (form.sale_price_per_sqm === null || form.sale_price_per_sqm === undefined || form.sale_price_per_sqm <= 0) {
    errors.push('Sale Price per SQM is required and must be greater than 0');
  }

  // NEW: tile width
  if (form.size_width === null || form.size_width === undefined || form.size_width <= 0) {
    errors.push('Tile Width is required and must be greater than 0');
  }

  // NEW: tile height
  if (form.size_height === null || form.size_height === undefined || form.size_height <= 0) {
    errors.push('Tile Height is required and must be greater than 0');
  }
 
      
      if (form.available_colors.length === 0) {
        errors.push('At least one available color is required');
      }
      
      if (selectedImages.value.length === 0) {
        errors.push('At least one product image is required');
      }

      if (errors.length > 0) {
        message.error(errors[0]);
        return false;
      }
      
      return true;
    };
    
    // Improved save handler
    const handleSave = async () => {
      if (!validateForm()) return;

      isSaving.value = true;
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          message.error('Authentication token not found. Please login again.');
          return;
        }

        const formData = new FormData();
        
        Object.keys(form).forEach(key => {
          const value = form[key];
          if (value !== null && value !== '' && value !== undefined) {
            if (key === 'available_colors') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value);
            }
          }
        });

        selectedImages.value.forEach((image, index) => {
          formData.append('images', image.file);
          if (image.isPrimary) {
            formData.append('primary_image_index', index);
          }
        });

        if (selectedRoomTypeName.value) {
          formData.append('room_type_name', selectedRoomTypeName.value);
        }

        const response = await fetch(`${store.state.root_api}access-engine/api/business-products/add-product-floor-tile/?access-id=` + route.query.access_id, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
          },
          body: formData
        });

        // ✅ Parse JSON before checking response.ok so result is always in scope
        const result = await response.json();

        if (!response.ok) {
          const errorMsg = result.message || `Server error: ${response.status}`;
          emit('api-error', errorMsg);
          message.error(errorMsg);
          handleCancel();
          return;
        }

        if (result.success) {
          message.success('Floor texture product created successfully!');
          emit('product-created', result.data);
          handleCancel();
        } else {
          const errorMsg = result.message || 'Failed to create product. Please try again.';
          emit('api-error', errorMsg);  // 
          message.error(errorMsg);
          handleCancel();               // 
        }

      } catch (error) {
        console.error('Error saving floor texture:', error);

        let errorMsg = 'Failed to create product. Please try again.';
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMsg = 'Network error. Please check your internet connection.';
        }

        // ✅ result not in scope here, use errorMsg instead
        emit('api-error', errorMsg);
        message.error(errorMsg);

      } finally {
        isSaving.value = false;
      }
    };

    // Cancel handler
    const handleCancel = () => {
      resetForm();
      emit('update:visible', false);
      emit('cancel');
    };

    // Watch for modal visibility changes
    watch(() => props.visible, (newValue) => {
  if (!newValue) {
    resetForm();
  } else {
    loadRoomTypes(); // ← ADD THIS
  }
});

    return {
      form,
      selectedImages,
      primaryImage,
      imageInput,
      isSaving,
      tempColor,
      textureStyles,
      presetColors,

      selectedRoomType,
roomTypes,
loadingRoomTypes,
handleRoomTypeChange,
      handleSave,
      handleCancel,
      uploadImages,
      handleImageUpload,
      setPrimaryImage,
      removeImage,
      addAvailableColor,
      addPresetColor,
      removeAvailableColor,
    };
  }
});


</script>

<style scoped>
.add-product-modal {
  top: 20px;
}

.add-product-modal .ant-modal-body {
  padding: 24px;
  max-height: 80vh;
  overflow-y: auto;
}

.add-product-modal .ant-modal-header {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0;
}

.add-product-modal .ant-modal-title {
  font-size: 18px;
  font-weight: 600;
}

/* Custom scrollbar for modal body */
.add-product-modal .ant-modal-body::-webkit-scrollbar {
  width: 6px;
}

.add-product-modal .ant-modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.add-product-modal .ant-modal-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.add-product-modal .ant-modal-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Ensure input focus states are visible */
.add-product-modal input:focus,
.add-product-modal textarea:focus,
.add-product-modal .ant-select-focused {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
}

/* Image upload area styling */
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

/* Color picker improvements */
.color-picker-input {
  cursor: pointer !important;
}

.color-picker-input:hover {
  border-color: #3b82f6 !important;
}

/* Form section headers */
h3, h4 {
  color: #1f2937;
  margin: 0;
}

/* Required field indicator */
.required {
  color: #ef4444;
}

/* Image gallery improvements */
.image-gallery img {
  transition: all 0.2s ease;
}

.image-gallery img:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Button improvements */
.ant-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* Loading state */
.ant-btn-loading {
  pointer-events: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .add-product-modal {
    width: 95% !important;
    margin: 10px;
  }
  
  .add-product-modal .ant-modal-body {
    padding: 16px;
  }
}

/* Ant Design component customizations */
.ant-input-number {
  width: 100%;
}

.ant-select {
  border-radius: 6px;
}

.ant-switch-checked {
  background-color: #3b82f6;
}

/* Primary image indicator */
.primary-indicator {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
}
</style>