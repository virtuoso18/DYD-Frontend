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
          <span style="font-size: 18px; font-weight: 600; color: #1f2937;">Add New Product</span>
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
        <!-- Left Column - 3D Model Preview -->
        <a-col :span="11">
          <div style="border: 2px solid #3b82f6; border-radius: 12px; padding: 16px; background: #f8faff; position: relative; min-height: 350px;">
            <!-- 3D Model Display -->
            <div v-if="selectedImages.length > 0" style="height: 100%; display: flex; align-items: center; justify-content: center;">
              <img 
                :src="selectedImages[0].url" 
                style="max-width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px;"
                alt="Product preview"
              />
            </div>
            
            <!-- Upload State -->
            <div v-else style="height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af;">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom: 16px;">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
              <p style="font-size: 14px; margin: 0; text-align: center;">Upload images to preview product</p>
            </div>

            <!-- Close button -->
            <a-button 
              type="text" 
              @click="handleCancel"
              style="position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.9); border-radius: 50%; width: 32px; height: 32px; padding: 0;"
            >
              <template #icon>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </template>
            </a-button>
          </div>

          <!-- Images used to create 3D model text -->
          <p style="font-size: 12px; color: #6b7280; margin-top: 8px; text-align: center;">
            Images used to create 3D model
          </p>
        </a-col>

        <!-- Right Column - Product Details -->
        <a-col :span="13">
          <div style="padding-left: 12px;">
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #1f2937;">Product Details</h3>

            <!-- Upload Image Section -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #374151;">Upload Image</label>
              <div style="display: flex; gap: 8px; align-items: center;">
                <!-- Camera Icon Placeholder -->
                <div style="width: 48px; height: 48px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer;" @click="uploadImages">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </div>
                
                <!-- Uploaded Image Preview -->
                <div v-for="(image, index) in selectedImages.slice(0, 1)" :key="index" style="position: relative;">
                  <img :src="image.url" style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px; border: 2px solid #e5e7eb;" />
                  <a-button 
                    type="text" 
                    size="small" 
                    @click="removeImage(index)"
                    style="position: absolute; top: -6px; right: -6px; background: #ef4444; color: white; border-radius: 50%; width: 18px; height: 18px; padding: 0; min-width: 18px;"
                  >
                    <template #icon>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </template>
                  </a-button>
                </div>
              </div>
            </div>

            <!-- Name Field -->
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Name</label>
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
                <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Category</label>
                <a-select 
                  v-model:value="productForm.category_name" 
                  placeholder="Chair"
                  style="width: 100%;"
                  :style="{ background: '#f3f4f6' }"
                >
                  <a-select-option v-for="cat in categories_available" :key="cat" :value="cat">{{ cat }}</a-select-option>
                </a-select>
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
                <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Price</label>
                <a-input 
                  v-model:value="productForm.pricing.price" 
                  placeholder="680"
                  style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb;"
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
                    <a-input 
                      v-model:value="productForm.dimensions.height" 
                      placeholder="100"
                      style="border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                    />
                    <span style="margin-left: 6px; color: #9ca3af; font-size: 12px;">cm</span>
                  </div>
                </a-col>
                <a-col :span="8">
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Length</label>
                  <div style="display: flex; align-items: center;">
                    <a-input 
                      v-model:value="productForm.dimensions.length" 
                      placeholder="30"
                      style="border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                    />
                    <span style="margin-left: 6px; color: #9ca3af; font-size: 12px;">cm</span>
                  </div>
                </a-col>
                <a-col :span="8">
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Width</label>
                  <div style="display: flex; align-items: center;">
                    <a-input 
                      v-model:value="productForm.dimensions.width" 
                      placeholder="30"
                      style="border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                    />
                    <span style="margin-left: 6px; color: #9ca3af; font-size: 12px;">cm</span>
                  </div>
                </a-col>
              </a-row>
            </div>

            <!-- Colors and Textures Row -->
            <a-row :gutter="16">
              <a-col :span="12">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <h4 style="margin: 0; font-size: 14px; font-weight: 500; color: #1f2937;">Color</h4>
                  <label style="font-size: 12px; color: #6b7280;">Upload pbr</label>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <!-- Add Color Button -->
                  <div style="position: relative; cursor: pointer;" @click="openColorPicker">
                    <div style="width: 40px; height: 40px; background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </div>
                  </div>

                  <!-- Selected Colors -->
                  <div v-for="(color, index) in selectedColors" :key="index" style="position: relative;">
                    <div 
                      :style="{ width: '40px', height: '40px', backgroundColor: color, borderRadius: '8px', border: '2px solid #e5e7eb', cursor: 'pointer' }"
                      @click="selectPrimaryColor(color)"
                    ></div>
                    <a-button 
                      type="text" 
                      size="small" 
                      @click="removeColor(index)"
                      style="position: absolute; top: -6px; right: -6px; background: #ef4444; color: white; border-radius: 50%; width: 18px; height: 18px; padding: 0; min-width: 18px;"
                    >
                      <template #icon>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </template>
                    </a-button>
                  </div>
                </div>
              </a-col>

              <a-col :span="12">
                <h4 style="margin-bottom: 12px; font-size: 14px; font-weight: 500; color: #1f2937;">Texture</h4>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <!-- Add Texture Button -->
                  <div style="cursor: pointer;" @click="uploadTexture">
                    <div style="width: 48px; height: 40px; background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </div>
                  </div>

                  <!-- Selected Textures -->
                  <div v-for="(texture, index) in selectedTextures" :key="index" style="position: relative;">
                    <div 
                      :style="{ width: '48px', height: '40px', backgroundImage: `url(${texture.url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', border: '2px solid #e5e7eb', cursor: 'pointer' }"
                    ></div>
                    <a-button 
                      type="text" 
                      size="small" 
                      @click="removeTexture(index)"
                      style="position: absolute; top: -6px; right: -6px; background: #ef4444; color: white; border-radius: 50%; width: 18px; height: 18px; padding: 0; min-width: 18px;"
                    >
                      <template #icon>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </template>
                    </a-button>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- Hidden File Inputs -->
    <input ref="imageInput" type="file" style="display: none;" accept=".jpg,.jpeg,.png" multiple @change="handleImageUpload" />
    <input ref="colorInput" type="color" style="display: none;" @change="handleColorChange" />
    <input ref="textureInput" type="file" style="display: none;" accept=".jpg,.jpeg,.png" multiple @change="handleTextureUpload" />
  </a-modal>
</template>

<script>
export default {
  name: "AddNewProduct",
  props: {
    visible: { type: Boolean, default: false },
    categories_available: { type: Array, default: () => [] },
    types: { type: Array, default: () => [] }
  },
  emits: ['update:visible', 'product-created', 'cancel'],
  data() {
    return {
      isSaving: false,
      productForm: {
        name: '',
        description: '',
        category_name: '',
        furniture_type: '',
        pricing: { price: '' },
        dimensions: { height: '', length: '', width: '' }
      },
      selectedImages: [],
      selectedColors: [],
      selectedTextures: []
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.resetForm();
      }
    }
  },
  methods: {
    resetForm() {
      this.productForm = {
        name: '',
        description: '',
        category_name: '',
        furniture_type: '',
        pricing: { price: '' },
        dimensions: { height: '', length: '', width: '' }
      };
      this.selectedImages = [];
      this.selectedColors = [];
      this.selectedTextures = [];
    },

    handleCancel() {
      this.$emit('update:visible', false);
      this.$emit('cancel');
    },

    uploadImages() {
      this.$refs.imageInput.click();
    },

    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (this.validateImageFile(file)) {
          this.selectedImages.push({ file, url: URL.createObjectURL(file) });
        }
      });
      event.target.value = '';
    },

    removeImage(index) {
      const image = this.selectedImages[index];
      if (image.url) URL.revokeObjectURL(image.url);
      this.selectedImages.splice(index, 1);
    },

    openColorPicker() {
      this.$refs.colorInput.click();
    },

    handleColorChange(event) {
      const color = event.target.value;
      if (!this.selectedColors.includes(color)) {
        this.selectedColors.push(color);
      }
    },

    removeColor(index) {
      this.selectedColors.splice(index, 1);
    },

    selectPrimaryColor(color) {
      this.productForm.primary_color = color;
    },

    uploadTexture() {
      this.$refs.textureInput.click();
    },

    handleTextureUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (this.validateImageFile(file)) {
          this.selectedTextures.push({ file, url: URL.createObjectURL(file) });
        }
      });
      event.target.value = '';
    },

    removeTexture(index) {
      const texture = this.selectedTextures[index];
      if (texture.url) URL.revokeObjectURL(texture.url);
      this.selectedTextures.splice(index, 1);
    },

    validateImageFile(file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        this.$message.error(`Invalid file type for ${file.name}. Please upload JPEG, JPG, or PNG files only.`);
        return false;
      }

      if (file.size > maxSize) {
        this.$message.error(`File ${file.name} is too large. Please upload files smaller than 10MB.`);
        return false;
      }

      return true;
    },

    validateForm() {
      if (!this.productForm.name.trim()) {
        this.$message.error('Product name is required');
        return false;
      }
      if (!this.productForm.description.trim()) {
        this.$message.error('Product description is required');
        return false;
      }
      if (!this.productForm.category_name) {
        this.$message.error('Category is required');
        return false;
      }
      if (!this.productForm.pricing.price || parseFloat(this.productForm.pricing.price) <= 0) {
        this.$message.error('Valid price is required');
        return false;
      }
      if (this.selectedImages.length === 0) {
        this.$message.error('At least one product image is required');
        return false;
      }
      return true;
    },

    async handleSave() {
      if (!this.validateForm()) return;

      this.isSaving = true;

      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        // Add basic product data
        formData.append('name', this.productForm.name);
        formData.append('description', this.productForm.description);
        formData.append('category_name', this.productForm.category_name);
        formData.append('furniture_type', this.productForm.furniture_type);
        formData.append('price', this.productForm.pricing.price);

        // Add dimensions
        if (this.productForm.dimensions.height) {
          formData.append('height', this.productForm.dimensions.height);
        }
        if (this.productForm.dimensions.length) {
          formData.append('length', this.productForm.dimensions.length);
        }
        if (this.productForm.dimensions.width) {
          formData.append('width', this.productForm.dimensions.width);
        }

        // Add images
        this.selectedImages.forEach((image, index) => {
          formData.append('images', image.file);
          if (index === 0) formData.append('primary_image_index', '0'); // First image as primary
        });

        // Add colors
        this.selectedColors.forEach(color => {
          formData.append('colors', color);
        });

        // Add textures
        this.selectedTextures.forEach(texture => {
          formData.append('textures', texture.file);
        });

        const response = await fetch(`${this.$store.state.root_api}product/api-product-owner/products/`, {
          method: 'POST',
          headers: { 'Authorization': `Token ${token}` },
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          this.$message.success('Product created successfully');
          this.$emit('product-created', result.data);
          this.$emit('update:visible', false);
          this.resetForm();
        } else {
          this.$message.error(result.message || 'Failed to create product');
        }

      } catch (error) {
        console.error('Error creating product:', error);
        this.$message.error('Error creating product. Please try again.');
      } finally {
        this.isSaving = false;
      }
    }
  },

  beforeUnmount() {
    // Cleanup object URLs
    this.selectedImages.forEach(image => {
      if (image.url) URL.revokeObjectURL(image.url);
    });
    this.selectedTextures.forEach(texture => {
      if (texture.url) URL.revokeObjectURL(texture.url);
    });
  }
}
</script>

<style scoped>
.add-product-modal :deep(.ant-modal-header) {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.add-product-modal :deep(.ant-modal-body) {
  padding: 24px;
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

.add-product-modal :deep(.ant-input:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
</style>