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
          <span style="font-size: 18px; font-weight: 600; color: #1f2937;">Add <span v-if="LightType=='sunk'">Sunk</span><span v-else>Un-Sunk</span> Magnetic Light </span>
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
      <a-row :gutter="24">
        <!-- Left Column - Image Preview -->
        <a-col :span="11">
          <div style="border: 2px solid #3b82f6; border-radius: 12px; padding: 16px; background: #f8faff; position: relative; min-height: 350px; display: flex; align-items: center; justify-content: center;">
            <div v-if="primaryImage" style="height: 100%; display: flex; align-items: center; justify-content: center;">
              <img 
                :src="primaryImage.url" 
                style="max-width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px;"
                alt="Primary image preview"
              />
            </div>
            <div v-else style="height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af;">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom: 16px;">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
              <p style="font-size: 14px; margin: 0; text-align: center;">Upload product images to preview</p>
            </div>
          </div>

          <p style="font-size: 12px; color: #6b7280; margin-top: 8px; text-align: center;">
            Primary image preview
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

          <!-- Available Colors (Multiple Selection) -->
          <div style="margin-bottom: 20px; margin-top: 20px;">
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

        <!-- Right Column - Product Details -->
        <a-col :span="13">
          <div style="padding-left: 12px;">
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #1f2937;">Light Product Details</h3>

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

            <!-- Product Name Field -->
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Product Name <span style="color: red;">*</span></label>
              <a-input 
                v-model:value="form.name" 
                placeholder="Modern LED Magnetic Light"
                style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
              />
            </div>

            <!-- Description Field -->
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Description</label>
              <a-textarea 
                v-model:value="form.description"
                :rows="3"
                placeholder="High-quality magnetic light suitable for modern interiors."
                style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb; resize: none;"
              />
            </div>

            <!-- Category and Light Type Row -->
            <a-row :gutter="12" style="margin-bottom: 16px;">
              <a-col :span="12">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Type <span style="color: red;">*</span></label>
                <a-select 
                  v-model:value="form.furniture_type" 
                  placeholder="Select Category"
                  style="width: 100%;"
                  :style="{ background: '#f3f4f6' }"
                >
                  <a-select-option value='Modern'>Modern</a-select-option>
                  
                  <a-select-option value='Traditional'>Traditional</a-select-option>
                  
                  <a-select-option value='Contemporary'>Contemporary</a-select-option>
                  
                  <a-select-option value='Industrial'>Industrial</a-select-option>
                  
                  <a-select-option value='Rustic'>Rustic</a-select-option>
                  
                  <a-select-option value='Minimalist'>Minimalist</a-select-option>
                  
                  <a-select-option value='Classic'>Classic</a-select-option>
                  
                  <a-select-option value='Vintage'>Vintage</a-select-option>
                  
                </a-select>
              </a-col>
              <a-col :span="12">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Price <span style="color: red;">*</span></label>
                <a-input-number 
                  v-model:value="form.price" 
                  :min="0"
                  :step="0.01"
                  placeholder="299.00"
                  style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                />
              </a-col>
            </a-row>

            <!-- Brand and Model Number Row -->
            <!-- <a-row :gutter="12" style="margin-bottom: 16px;">
              <a-col :span="12">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Brand</label>
                <a-input 
                  v-model:value="form.brand" 
                  placeholder="DYD Lights"
                  style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
                />
              </a-col>
              <a-col :span="12">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Model Number</label>
                <a-input 
                  v-model:value="form.model_number" 
                  placeholder="DYD-LED-001"
                  style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
                />
              </a-col>
            </a-row> -->

            <!-- Price and Regular Price Row -->
            <!-- <a-row :gutter="12" style="margin-bottom: 16px;">
              <a-col :span="12">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Regular Price <span style="color: red;">*</span></label>
                <a-input-number 
                  v-model:value="form.price" 
                  :min="0"
                  :step="0.01"
                  placeholder="399.00"
                  style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                />
              </a-col>
              <a-col :span="12">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Material</label>
                <a-input 
                  v-model:value="form.material" 
                  placeholder="Aluminum, LED"
                  style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
                />
              </a-col>
            </a-row> -->

            <!-- Dimensions Row -->
            <div style="margin-bottom: 20px;">
              <h4 style="margin-bottom: 12px; font-size: 14px; font-weight: 500; color: #1f2937;">Dimensions</h4>
              <a-row :gutter="12">
                <a-col :span="8">
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Width (cm)</label>
                  <a-input-number 
                    v-model:value="form.width" 
                    :min="0.01"
                    :step="0.1"
                    placeholder="10.0"
                    style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                  />
                </a-col>
                <a-col :span="8">
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Height (cm)</label>
                  <a-input-number 
                    v-model:value="form.height" 
                    :min="0.01"
                    :step="0.1"
                    placeholder="5.0"
                    style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                  />
                </a-col>
                <a-col :span="8">
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Length (cm)</label>
                  <a-input-number 
                    v-model:value="form.length" 
                    :min="0.01"
                    :step="0.1"
                    placeholder="50.0"
                    style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                  />
                </a-col>
              </a-row>
            </div>

            <!-- Stock Quantity -->
            <!-- <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Stock Quantity</label>
              <a-input-number 
                v-model:value="form.stock_quantity" 
                :min="0"
                :step="1"
                placeholder="100"
                style="width: 200px; border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
              />
            </div> -->

          </div>
        </a-col>
      </a-row>
    </div>

    <!-- Hidden File Input -->
    <input ref="imageInput" type="file" style="display: none;" accept=".jpg,.jpeg,.png" multiple @change="handleImageUpload" />
  </a-modal>
</template>

<script>
import { defineComponent, ref, computed, reactive, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';

import { useRouter,useRoute } from 'vue-router';
export default defineComponent({
  name: "Add-Sunk-Unsunk-Light",
  props: {
    LightType: { type: String, default: "sunk" },
    visible: { type: Boolean, default: false },
  },
  emits: ['update:visible', 'product-created', 'cancel'],
  setup(props, { emit }) {
    const isSaving = ref(false);
    const tempColor = ref('#000000');
    const store = useStore();
    
    const router = useRouter();
    const route = useRoute();

    // Form data that matches your Django API expectations
    const form = reactive({
      name: '',
      description: '',
      category_name: 'Light',
      furniture_type: 'Modern',
      price: null,
      sale_price_per_sqm: null,
      brand: '',
      model_number: '',
      material: '',
      width: null,
      height: null,
      length: null,
      stock_quantity: 0,
      light_type: props.LightType,
      available_colors: [],
      is_active: true,
      is_featured: false
    });

    const selectedImages = ref([]);
    const imageInput = ref(null);

    // Computed property for primary image
    const primaryImage = computed(() => {
      return selectedImages.value.find(img => img.isPrimary) || selectedImages.value[0] || null;
    });

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
      form.name = '';
      form.description = '';
      form.category_name = 'Light';
      form.furniture_type = 'light';
      form.price = null;
      form.sale_price_per_sqm = null;
      form.brand = '';
      form.model_number = '';
      form.material = '';
      form.width = null;
      form.height = null;
      form.length = null;
      form.stock_quantity = 0;
      form.light_type = props.LightType;
      form.available_colors = [];
      selectedImages.value = [];
      tempColor.value = '#000000';
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

    // Form validation
    const validateForm = () => {
      const errors = [];

      if (!form.name?.trim()) {
        errors.push('Product name is required');
      }
      
      // if (!form.category_name) {
      //   errors.push('Category is required');
      // }
      
      // if (!form.price || form.price <= 0) {
      //   errors.push('Regular price must be greater than 0');
      // }
      
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
    
    // Save handler - Updated to use the lights endpoint
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
        
        // Add form fields that match your Django API
        formData.append('name', form.name);
        formData.append('description', form.description || '');


        // formData.append('category_name', form.category_name);
        formData.append('furniture_type', form.furniture_type);
        formData.append('price', form.price);
        
        // if (form.sale_price_per_sqm) {
        //   formData.append('sale_price', form.sale_price_per_sqm);
        // }
        
        // if (form.brand) {
        //   formData.append('brand', form.brand);
        // }
        
        // if (form.model_number) {
        //   formData.append('model_number', form.model_number);
        // }
        
        // if (form.material) {
        //   formData.append('material', form.material);
        // }
        
        // Add dimensions
        if (form.width) {
          formData.append('width', form.width);
        }
        if (form.height) {
          formData.append('height', form.height);
        }
        if (form.length) {
          formData.append('length', form.length);
        }
        
        // Add light type
        formData.append('light_type', form.light_type);
        
        // Add stock quantity
        // formData.append('stock_quantity', form.stock_quantity);
        
        // Add status fields
        // formData.append('is_active', form.is_active);
        // formData.append('is_featured', form.is_featured);

        // Add available colors
        formData.append('available_colors', JSON.stringify(form.available_colors));

        // Add images with primary image index
        selectedImages.value.forEach((image, index) => {
          formData.append('images', image.file);
          if (image.isPrimary) {
            formData.append('primary_image_index', index);
          }
        });
        
        // Make API call to your lights endpoint
        const response = await fetch(`${store.state.root_api}access-engine/api/business-products/add-product-sunk-unsunk-light/?access-id=`+route.query.access_id, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          message.success('Light product created successfully!');
          emit('product-created', result.data);
          handleCancel();
        } else {
          console.error('API Error:', result.message);
          message.error(result.message || 'Failed to create product. Please try again.');
        }
        
      } catch (error) {
        console.error('Error saving light product:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          message.error('Network error. Please check your internet connection.');
        } else if (error.message.includes('HTTP error')) {
          message.error('Server error. Please try again later.');
        } else {
          message.error('Failed to create product. Please try again.');
        }
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
      }
    });

    // Watch for LightType prop changes
    watch(() => props.LightType, (newValue) => {
      form.light_type = newValue;
    });

    return {
      form,
      selectedImages,
      primaryImage,
      imageInput,
      isSaving,
      tempColor,
      presetColors,
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