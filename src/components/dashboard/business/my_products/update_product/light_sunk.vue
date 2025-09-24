<template>
  <div>
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 0 10px;">
      <div style="display: flex; align-items: center;">
        <a-button @click="cancel_edit_back_product_list" type="text" style="padding: 4px; margin-right: 16px;" size="small">
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </template>
        </a-button>
        <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #1f2937;">Edit {{ selectedProduct.category?.name || 'Product' }}</h2>
      </div>
      <div style="display: flex; gap: 12px;">
        <a-button @click="cancel_edit_back_product_list" style="border-radius: 8px;">Cancel</a-button>
        <a-button type="primary" @click="saveProduct" :loading="isSaving" style="border-radius: 8px;">
          {{ isSaving ? 'Saving...' : 'Save' }}
        </a-button>
      </div>
    </div>

    <a-row style="padding: 0 24px;">
      <!-- Left Column - Product Image Preview -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12">
        <div style="margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">Product Preview</h3>
        </div>
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 24px;">Primary product image preview</p>
        
        <div style="padding-right: 24px;">
          <div style="margin-bottom: 32px;">
            <!-- Primary Product Display -->
            <div style="border: 2px solid #3b82f6; border-radius: 12px; padding: 16px; background: #f8faff; position: relative; min-height: 300px; display: flex; align-items: center; justify-content: center;">
              <div v-if="primaryImage" style="height: 100%; display: flex; align-items: center; justify-content: center;">
                <img 
                  :src="primaryImage.url" 
                  style="max-width: 100%; max-height: 280px; object-fit: contain; border-radius: 8px;"
                  alt="Primary product preview"
                />
              </div>
              <div v-else style="height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom: 16px;">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21,15 16,10 5,21"></polyline>
                </svg>
                <p style="font-size: 14px; margin: 0; text-align: center;">No product image available</p>
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
          <div v-for="img in selectedProduct.images" :key="img.id" style="position: relative;">
            <img :src="$store.state.root_media_api + img.image" @click="togglePrimaryImage(img.id)"
              style="width: 72px; height: 72px; border-radius: 8px; object-fit: cover; cursor: pointer;"
              :style="{ border: img.is_primary ? '3px solid #10b981' : '2px solid #e5e7eb' }"
            />
            <!-- Primary Badge -->
            <div v-if="img.is_primary" style="position: absolute; top: -6px; left: -6px; background: #10b981; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px;">★</div>
            <!-- Delete Button -->
            <a-button type="text" danger size="small" @click.stop="deleteImage(img.id)"
              style="position: absolute; top: -6px; right: -6px; background: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; padding: 0; min-width: 20px;">
              <template #icon>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </template>
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

      <!-- Product Details Section -->
      <a-col :span="24">
        <div style="padding-left: 24px; border-left: 1px solid #f3f4f6;">
          <h3 style="margin-bottom: 24px; font-weight: 600; font-size: 16px; color: #1f2937;">{{ selectedProduct.category?.name || 'Product' }} Details</h3>
          
          <!-- Title & Description -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Product Name</label>
            <a-input v-model:value="productForm.name" placeholder="Product Name" style="border-radius: 8px;" size="large" />
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Description</label>
            <a-textarea v-model:value="productForm.description" :rows="4" placeholder="Product Description" style="border-radius: 8px; resize: none;" />
          </div>

          <!-- Basic Info -->
          <a-row  style="margin-bottom: 20px;">
            <a-col :span="12">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Furniture Type</label>
              <a-select v-model:value="productForm.furniture_type" style="width: 100%;" size="large" placeholder="Select Type">
                <a-select-option v-for="type in furnitureTypes" :key="type" :value="type">{{ type }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="12">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Price</label>
                <a-input-number v-model:value="productForm.pricing.price" :min="0" :step="0.01" placeholder="0.00" suffix="$" style="width: 100%; border-radius: 8px;" size="large" />
            
          </a-col>
           
          </a-row>

          <!-- Dimensions -->
          <div style="margin-bottom: 24px;">
            <h4 style="margin-bottom: 16px; font-weight: 500; font-size: 14px; color: #1f2937;">Dimensions</h4>
            <a-row >
              <a-col :span="8">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Width (cm)</label>
                <a-input-number v-model:value="productForm.dimensions.width" :min="0.01" :step="0.01" placeholder="0.00" style="width: 100%; border-radius: 6px;" />
              </a-col>
              <a-col :span="8">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Height (cm)</label>
                <a-input-number v-model:value="productForm.dimensions.height" :min="0.01" :step="0.01" placeholder="0.00" style="width: 100%; border-radius: 6px;" />
              </a-col>
              <a-col :span="8">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 13px; color: #6b7280;">Length (cm)</label>
                <a-input-number v-model:value="productForm.dimensions.length" :min="0.01" :step="0.01" placeholder="0.00" style="width: 100%; border-radius: 6px;" />
              </a-col>
           
            </a-row>
          </div>

          
          <!-- Available Colors -->
          <a-col :span="24">
            <h4 style="margin-bottom: 16px; font-weight: 500; font-size: 14px; color: #1f2937;">Available Colors</h4>
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
              <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-top: 12px;">
                <!-- Existing Colors -->
                <div v-for="color in (selectedProduct?.colors?.available_colors || [])" :key="color.id" style="position: relative;">
                  <div 
                    :style="{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      backgroundColor: color.color, 
                      cursor: 'pointer', 
                      border: '2px solid #e5e7eb'
                    }"
                  ></div>
                  <!-- Remove color button -->
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
          </a-col>
        </div>
      </a-col>
    </a-row>

    <!-- Hidden File Inputs -->
    <input ref="imageInput" type="file" style="display: none;" accept=".jpg,.jpeg,.png" multiple @change="handleImageUpload" />
  </div>
</template>

<script>
export default {
  name: "edit_product_update_component_sunk_light",
  props: {
    selectedProduct: { type: Object, required: true }
  },
  data() {
    return {
      productForm: {
        name: '',
        description: '',
        short_description: '',
        furniture_type: '',
        light_type: '',
        brand: '',
        model_number: '',
        material: '',
        dimensions: {
          width: null,
          height: null,
          length: null,
          depth: null,
          weight: null
        },
        pricing: {
          price: null,
          sale_price: null,
          current_price: null,
          is_on_sale: false
        },
        stock: {
          quantity: null,
          minimum_stock: null,
          is_in_stock: false,
          is_low_stock: false
        },
        status: {
          is_active: true,
          is_featured: false
        }
      },
      tempColor: '#000000',
      presetColors: [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
        '#FF00FF', '#00FFFF', '#C0C0C0', '#808080', '#800000', '#808000',
        '#008000', '#800080', '#008080', '#000080', '#FFA500', '#FFC0CB',
        '#A52A2A', '#DDA0DD', '#98FB98', '#F0E68C', '#DEB887', '#D2691E',
        '#FF6347', '#40E0D0', '#EE82EE', '#90EE90', '#FFB6C1', '#87CEEB'
      ],
      furnitureTypes: [
        'Modern', 'Traditional', 'Contemporary', 'Industrial', 
        'Rustic', 'Minimalist', 'Classic', 'Vintage'
      ],
      lightTypes: [
        'sunk', 'pendant', 'ceiling', 'wall', 'floor', 'table', 'accent', 'outdoor'
      ],
      isSaving: false,
      imagePreviewsState: [],
      hasUnsavedChanges: false
    }
  },
  computed: {
    primaryImage() {
      // Find primary image from existing images
      const primaryImg = this.selectedProduct.images?.find(img => img.is_primary);
      if (primaryImg) {
        return { url: this.$store.state.root_media_api + primaryImg.image };
      }
      // Fallback to primary_image if available
      if (this.selectedProduct.primary_image) {
        return { url: this.$store.state.root_media_api + this.selectedProduct.primary_image };
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
    selectedProduct: { 
      handler() { this.initializeForm(); }, 
      deep: true 
    },
    productForm: { 
      handler() { this.hasUnsavedChanges = true; }, 
      deep: true 
    }
  },
  methods: {
    initializeForm() {
      if (this.selectedProduct) {
        this.productForm = {
          name: this.selectedProduct.name || '',
          description: this.selectedProduct.description || '',
          short_description: this.selectedProduct.short_description || '',
          furniture_type: this.selectedProduct.furniture_type || '',
          light_type: this.selectedProduct.light_type || '',
          brand: this.selectedProduct.brand || '',
          model_number: this.selectedProduct.model_number || '',
          material: this.selectedProduct.material || '',
          dimensions: {
            width: this.selectedProduct.dimensions?.width || null,
            height: this.selectedProduct.dimensions?.height || null,
            length: this.selectedProduct.dimensions?.length || null,
            depth: this.selectedProduct.dimensions?.depth || null,
            weight: this.selectedProduct.dimensions?.weight || null
          },
          pricing: {
            price: this.selectedProduct.pricing?.price || null,
            sale_price: this.selectedProduct.pricing?.sale_price || null,
            current_price: this.selectedProduct.pricing?.current_price || null,
            is_on_sale: this.selectedProduct.pricing?.is_on_sale || false
          },
          stock: {
            quantity: this.selectedProduct.stock?.quantity || null,
            minimum_stock: this.selectedProduct.stock?.minimum_stock || null,
            is_in_stock: this.selectedProduct.stock?.is_in_stock || false,
            is_low_stock: this.selectedProduct.stock?.is_low_stock || false
          },
          status: {
            is_active: this.selectedProduct.status?.is_active ?? true,
            is_featured: this.selectedProduct.status?.is_featured || false
          }
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

    cancel_edit_back_product_list() {
      if (this.hasUnsavedChanges) {
        this.$confirm({
          title: 'Unsaved Changes',
          content: 'You have unsaved changes. Are you sure you want to leave without saving?',
          okText: 'Leave',
          okType: 'danger',
          cancelText: 'Stay',
          onOk: () => this.$emit('cancel_edit_back_product_list', this.selectedProduct.id)
        });
      } else {
        this.$emit('cancel_edit_back_product_list', this.selectedProduct.id);
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
      return this.selectedProduct?.colors?.available_colors?.some(color => color.color === colorHex) || false;
    },

    // Primary Image Toggle - Updated API endpoint
    async togglePrimaryImage(imageId) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/images/${imageId}/set-primary/`, {
          method: 'PATCH',
          headers: { 'Authorization': `Token ${token}` }
        });

        const result = await response.json();
        if (result.success) {
          // Update local data
          this.selectedProduct.images.forEach(img => img.is_primary = false);
          const targetImage = this.selectedProduct.images.find(img => img.id === imageId);
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

    // Color Management - Updated API endpoint
    async addColor(colorHex) {
      if (this.isColorAlreadyAdded(colorHex)) {
        this.$message.warning('Color already exists');
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/colors/`, {
          method: 'POST',
          headers: { 
            'Authorization': `Token ${token}`, 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ color: colorHex })
        });

        const result = await response.json();
        if (result.success) {
          // Ensure colors object exists
          if (!this.selectedProduct.colors) {
            this.selectedProduct.colors = { available_colors: [] };
          }
          if (!this.selectedProduct.colors.available_colors) {
            this.selectedProduct.colors.available_colors = [];
          }
          
          this.selectedProduct.colors.available_colors.push({ 
            id: result.data.id, 
            color: result.data.color
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
            const response = await fetch(`${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/colors/${colorId}/`, {
              method: 'DELETE',
              headers: { 'Authorization': `Token ${token}` }
            });

            const result = await response.json();
            if (result.success) {
              const index = this.selectedProduct.colors.available_colors.findIndex(color => color.id === colorId);
              if (index !== -1) {
                this.selectedProduct.colors.available_colors.splice(index, 1);
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
            const response = await fetch(`${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/images/${imageId}/`, {
              method: 'DELETE',
              headers: { 'Authorization': `Token ${token}` }
            });

            const result = await response.json();
            if (result.success) {
              const index = this.selectedProduct.images.findIndex(img => img.id === imageId);
              if (index !== -1) {
                this.selectedProduct.images.splice(index, 1);
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
      if (!this.productForm.name.trim()) {
        this.$message.error('Product name is required');
        return false;
      }
      if (!this.productForm.furniture_type) {
        this.$message.error('Furniture type is required');
        return false;
      }
      if (this.productForm.pricing.price && parseFloat(this.productForm.pricing.price) <= 0) {
        this.$message.error('Price must be greater than 0 if provided');
        return false;
      }
      if (this.productForm.pricing.sale_price && parseFloat(this.productForm.pricing.sale_price) <= 0) {
        this.$message.error('Sale price must be greater than 0 if provided');
        return false;
      }
      if (this.productForm.stock.quantity !== null && this.productForm.stock.quantity < 0) {
        this.$message.error('Stock quantity must be 0 or greater');
        return false;
      }

      // Validate dimensions if provided
      const dimensionFields = ['width', 'height', 'length', 'depth', 'weight'];
      for (let field of dimensionFields) {
        if (this.productForm.dimensions[field] !== null && parseFloat(this.productForm.dimensions[field]) <= 0) {
          this.$message.error(`${field} must be greater than 0 if provided`);
          return false;
        }
      }
      return true;
    },

    async saveProduct() {
      if (!this.hasUnsavedChanges && this.imagePreviewsState.length === 0) {
        this.$message.info('No changes to save');
        return;
      }

      if (!this.validateForm()) return;

      this.isSaving = true;

      try {
        const token = localStorage.getItem('token');

        // Upload pending images first if any - Updated API endpoint
        if (this.imagePreviewsState.length > 0) {
          const formData = new FormData();
          this.imagePreviewsState.forEach(preview => {
            formData.append('images', preview.file);
            preview.uploading = true;
          });

          const imageResponse = await fetch(`${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/images/`, {
            method: 'POST',
            headers: { 'Authorization': `Token ${token}` },
            body: formData
          });

          const imageResult = await imageResponse.json();
          if (imageResult.success) {
            // Add new images to the existing array
            this.selectedProduct.images.push(...imageResult.data);
            this.cleanupPreviews();
          }
        }

        // Update product details - Updated API endpoint and structure
        const productData = new FormData();
        productData.append('name', this.productForm.name);
        productData.append('description', this.productForm.description);
        productData.append('furniture_type', this.productForm.furniture_type);
        
        if (this.productForm.light_type) {
          productData.append('light_type', this.productForm.light_type);
        }

        // Add pricing
        if (this.productForm.pricing.price) {
          productData.append('price', this.productForm.pricing.price);
        }

        // Add dimensions
        ['height', 'length', 'width'].forEach(dim => {
          if (this.productForm.dimensions[dim]) {
            productData.append(dim, this.productForm.dimensions[dim]);
          }
        });

        const response = await fetch(`${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/`, {
          method: 'PUT',
          headers: { 'Authorization': `Token ${token}` },
          body: productData
        });

        const result = await response.json();

        if (result.success) {
          this.$message.success('Product updated successfully');
          this.hasUnsavedChanges = false;
          // Update parent component with new data
          this.$emit('product-updated', result.data);
        } else {
          this.$message.error(result.message || 'Failed to update product');
        }

      } catch (error) {
        console.error('Error saving product:', error);
        this.$message.error('Error saving product. Please try again.');
      } finally {
        this.isSaving = false;
      }
    }
  }
}
</script>


<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>