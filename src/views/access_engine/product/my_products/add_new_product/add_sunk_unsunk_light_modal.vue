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
          <span className=" pr-2 sm:text-[18px]" style="font-weight: 600; color: #1f2937;">
            Add <span v-if="LightType=='sunk'">Sunk</span><span v-else>Un-Sunk</span> Magnetic Light
          </span>
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
        <a-col :xs="24" :sm="24" :md="10" :lg="10">
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

          <!-- Available Colors (Multiple Selection) -->
          <div style="margin-bottom: 20px; margin-top: 20px;">
            <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #374151;">Available Colors <span style="color: red;">*</span></label>
            
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
        <a-col :xs="24" :sm="24" :md="14" :lg="14">
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
              <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Description <span style="color: red;">*</span></label>
              <a-textarea 
                v-model:value="form.description"
                :rows="3"
                placeholder="High-quality magnetic light suitable for modern interiors."
                style="border-radius: 6px; background: #f3f4f6; border: 1px solid #e5e7eb; resize: none;"
              />
            </div>

            <!-- Room Type and Category Row -->
            <a-row :gutter="12" style="margin-bottom: 16px;">
              <!-- Room Type -->
              <a-col :span="12">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Room Type <span style="color: red;">*</span></label>
                <a-select
                  v-model:value="selectedRoomType"
                  placeholder="Select room type"
                  style="width: 100%;"
                  :style="{ background: '#f3f4f6' }"
                  :loading="loadingRoomTypes"
                  :allow-clear="true"
                  @change="handleRoomTypeChange"
                >
                  <a-select-option
                    v-for="rt in roomTypes"
                    :key="rt.id"
                    :value="rt.id"
                  >
                    {{ rt.name }}
                  </a-select-option>
                </a-select>
              </a-col>

              <!-- Category -->
              <a-col :span="12">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Category <span style="color: red;">*</span></label>
                <a-select
                  v-model:value="form.category_name"
                  placeholder="Search and select category"
                  style="width: 100%;"
                  mode="tags"
                  :style="{ background: '#f3f4f6' }"
                  :options="categoryOptions"
                  :loading="loadingCategories"
                  :filter-option="false"
                  :allow-clear="true"
                  show-search
                  :disabled="!selectedRoomType"
                  @search="handleCategorySearch"
                  @change="handleCategoryChange"
                  @focus="handleSelectFocus"
                >
                </a-select>
              </a-col>
            </a-row>

            <!-- Type and Price Row -->
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

            <!-- Dimensions Row -->
            <div style="margin-bottom: 20px;">
              <h4 style="margin-bottom: 12px; font-size: 14px; font-weight: 500; color: #1f2937;">Dimensions</h4>
              <a-row :gutter="12">
                <a-col :span="8">
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Width (cm)<span style="color: red;">*</span></label>
                  <a-input-number 
                    v-model:value="form.width" 
                    :min="0.01"
                    :step="0.1"
                    placeholder="10.0"
                    style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                  />
                </a-col>
                <a-col :span="8">
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Height (cm)<span style="color: red;">*</span></label>
                  <a-input-number 
                    v-model:value="form.height" 
                    :min="0.01"
                    :step="0.1"
                    placeholder="5.0"
                    style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                  />
                </a-col>
                <a-col :span="8">
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Length (cm)<span style="color: red;">*</span></label>
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

          </div>
        </a-col>

      </a-row>
    </div>

    <!-- Hidden File Input -->
    <input ref="imageInput" type="file" style="display: none;" accept=".jpg,.jpeg,.png" multiple @change="handleImageUpload" />
  </a-modal>
</template>

<script>
import { message } from 'ant-design-vue';

export default {
  name: "Add-Sunk-Unsunk-Light",
  props: {
    LightType: { type: String, default: "sunk" },
    visible: { type: Boolean, default: false },
  },
  emits: ['update:visible', 'product-created', 'cancel','api-error' ],

  data() {
    return {
      isSaving: false,
      tempColor: '#000000',

      // Room Type
      selectedRoomType: null,
      selectedRoomTypeName: null,
      roomTypes: [],
      loadingRoomTypes: false,

      // Category
      categoryOptions: [],
      allCategories: [],
      loadingCategories: false,
      categorySearchTimeout: null,

      // Form
      form: {
        name: '',
        description: '',
        category_name: [],
        furniture_type: 'Modern',
        price: null,
        brand: '',
        model_number: '',
        material: '',
        width: null,
        height: null,
        length: null,
        stock_quantity: 0,
        light_type: this.LightType,
        available_colors: [],
        is_active: true,
        is_featured: false
      },

      selectedImages: [],

      presetColors: [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
        '#FF00FF', '#00FFFF', '#C0C0C0', '#808080', '#800000', '#808000',
        '#008000', '#800080', '#008080', '#000080', '#FFA500', '#FFC0CB',
        '#A52A2A', '#DDA0DD', '#98FB98', '#F0E68C', '#DEB887', '#D2691E',
        '#FF6347', '#40E0D0', '#EE82EE', '#90EE90', '#FFB6C1', '#87CEEB'
      ],
    };
  },

  computed: {
    primaryImage() {
      return this.selectedImages.find(img => img.isPrimary) || this.selectedImages[0] || null;
    }
  },

  watch: {
    visible(newValue) {
      if (newValue) {
        this.loadRoomTypes();
      } else {
        this.resetForm();
      }
    },
    LightType(newValue) {
      this.form.light_type = newValue;
    }
  },

  methods: {
    // ===== Room Type Methods =====
    async loadRoomTypes() {
      try {
        this.loadingRoomTypes = true;
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.$store.state.root_api}product/api/room-types/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          }
        });
        const result = await response.json();
        this.roomTypes = result || [];
      } catch (error) {
        console.error('❌ Error loading room types:', error);
        this.roomTypes = [];
      } finally {
        this.loadingRoomTypes = false;
      }
    },

    handleRoomTypeChange(value) {
      const selected = this.roomTypes.find(rt => rt.id === value);
      this.selectedRoomType = value;
      this.selectedRoomTypeName = selected ? selected.name : null;
      // Reset category when room type changes
      this.form.category_name = [];
      this.categoryOptions = [];
      this.allCategories = [];
      if (value) {
        this.loadInitialCategories();
      }
    },

    // ===== Category Methods =====
    async loadInitialCategories() {
      try {
        this.loadingCategories = true;
        const token = localStorage.getItem('token');
        const roomTypeParam = this.selectedRoomType
          ? `?room_type=${encodeURIComponent(this.selectedRoomType)}`
          : '';
        const response = await fetch(
          `${this.$store.state.root_api}product/api/categories/${roomTypeParam}`,
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
          this.allCategories = result.data || [];
          this.categoryOptions = this.allCategories.map(cat => ({
            label: cat.name,
            value: cat.name,
            data: cat
          }));
        }
      } catch (error) {
        console.error('❌ Error loading categories:', error);
      } finally {
        this.loadingCategories = false;
      }
    },

    handleCategorySearch(searchValue) {
      if (this.categorySearchTimeout) clearTimeout(this.categorySearchTimeout);

      if (!searchValue || !searchValue.trim()) {
        this.categoryOptions = this.allCategories.map(cat => ({
          label: cat.name,
          value: cat.name,
          data: cat
        }));
        return;
      }

      this.loadingCategories = true;

      this.categorySearchTimeout = setTimeout(async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(
            `${this.$store.state.root_api}product/api/categories/?q=${encodeURIComponent(searchValue)}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
              }
            }
          );
          const result = await response.json();
          this.categoryOptions = result.success
            ? result.data.map(cat => ({ label: cat.name, value: cat.name, data: cat }))
            : [];
        } catch (error) {
          console.error('❌ Error searching categories:', error);
          this.categoryOptions = [];
        } finally {
          this.loadingCategories = false;
        }
      }, 300);
    },

    handleCategoryChange(value) {
      if (Array.isArray(value)) {
        this.form.category_name = value.length > 1 ? [value[value.length - 1]] : value;
      } else {
        this.form.category_name = value ? [value] : [];
      }
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

    // ===== Image Methods =====
    uploadImages() {
      this.$refs.imageInput?.click();
    },

    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      if (this.selectedImages.length + files.length > 5) {
        message.warning('Maximum 5 images allowed');
        return;
      }
      files.forEach(file => {
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedImages.push({
              file,
              url: e.target.result,
              isPrimary: this.selectedImages.length === 0
            });
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
      const removed = this.selectedImages[index];
      this.selectedImages.splice(index, 1);
      if (removed.isPrimary && this.selectedImages.length > 0) {
        this.selectedImages[0].isPrimary = true;
      }
    },

    // ===== Color Methods =====
    addAvailableColor() {
      if (this.tempColor && !this.form.available_colors.includes(this.tempColor)) {
        this.form.available_colors.push(this.tempColor);
        this.tempColor = '#000000';
      }
    },

    addPresetColor(color) {
      if (!this.form.available_colors.includes(color)) {
        this.form.available_colors.push(color);
      }
    },

    removeAvailableColor(index) {
      this.form.available_colors.splice(index, 1);
    },

    // ===== Validation =====
    validateForm() {
      const errors = [];
      if (!this.form.name?.trim()) errors.push('Please fill the Product Name field');
      if (!this.form.description?.trim()) errors.push('Please fill the Description field');
      if (!this.selectedRoomType) errors.push('Please select a Room Type');
      if (!this.form.category_name || this.form.category_name.length === 0) errors.push('Please select a Category');
      if (!this.form.furniture_type) errors.push('Please select a Type');
      if (!this.form.price || this.form.price <= 0) errors.push('Please enter a valid Price greater than 0');
      if (!this.form.width || this.form.width <= 0) errors.push('Please enter a valid Width greater than 0');
      if (!this.form.height || this.form.height <= 0) errors.push('Please enter a valid Height greater than 0');
      if (!this.form.length || this.form.length <= 0) errors.push('Please enter a valid Length greater than 0');
      if (this.form.available_colors.length === 0) errors.push('Please select at least one available color');
      if (this.selectedImages.length === 0) errors.push('Please upload at least one product image');
      if (errors.length > 0) { message.error(errors[0]); return false; }
      return true;
    },

    // ===== Save =====
    async handleSave() {
      if (!this.validateForm()) return;
      this.isSaving = true;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Authentication token not found. Please login again.');
          return;
        }

        const formData = new FormData();
        formData.append('name', this.form.name);
        formData.append('description', this.form.description || '');
        formData.append('furniture_type', this.form.furniture_type);
        formData.append('price', this.form.price);
        formData.append('light_type', this.form.light_type);

        const categoryDisplay = Array.isArray(this.form.category_name)
          ? (this.form.category_name[0] || '')
          : this.form.category_name;
        formData.append('category_name', categoryDisplay);
        formData.append('room_type_name', this.selectedRoomTypeName);

        if (this.form.width) formData.append('width', this.form.width);
        if (this.form.height) formData.append('height', this.form.height);
        if (this.form.length) formData.append('length', this.form.length);

        formData.append('available_colors', JSON.stringify(this.form.available_colors));

        this.selectedImages.forEach((image, index) => {
          formData.append('images', image.file);
          if (image.isPrimary) formData.append('primary_image_index', index);
        });

        // const response = await fetch(`${this.$store.state.root_api}product/api-product-owner/lights/`, {
       const response = await fetch(`${this.$store.state.root_api}access-engine/api/business-products/add-product-light/?access-id=`+this.$route.query.access_id, {
          method: 'POST',
          headers: { 'Authorization': `Token ${token}` },
          body: formData
        });

        
        const result = await response.json();

        if (result.success) {
          message.success('Light product created successfully!');
          this.$emit('product-created', result.data);
          this.handleCancel();
        } else {
          const errorMsg = result.message || 'Failed to create product';
          this.handleCancel(); // close the modal first
          this.$emit('api-error', errorMsg); // then bubble error up to parent
        }
      } catch (error) {
        console.error('Error saving light product:', error);
        message.error('Failed to create light. Please check your inputs and try again.');
      } finally {
        this.isSaving = false;
      }
    },

    // ===== Reset & Cancel =====
    resetForm() {
      this.selectedRoomType = null;
      this.selectedRoomTypeName = null;
      this.categoryOptions = [];
      this.allCategories = [];
      this.form.name = '';
      this.form.description = '';
      this.form.category_name = [];
      this.form.furniture_type = 'Modern';
      this.form.price = null;
      this.form.brand = '';
      this.form.model_number = '';
      this.form.material = '';
      this.form.width = null;
      this.form.height = null;
      this.form.length = null;
      this.form.stock_quantity = 0;
      this.form.light_type = this.LightType;
      this.form.available_colors = [];
      this.selectedImages = [];
      this.tempColor = '#000000';
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
.add-product-modal .ant-modal-body::-webkit-scrollbar { width: 6px; }
.add-product-modal .ant-modal-body::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
.add-product-modal .ant-modal-body::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
.add-product-modal .ant-modal-body::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
.add-product-modal input:focus,
.add-product-modal textarea:focus,
.add-product-modal .ant-select-focused {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
}
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
h3, h4 { color: #1f2937; margin: 0; }
.required { color: #ef4444; }
.image-gallery img { transition: all 0.2s ease; }
.image-gallery img:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.ant-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
.ant-btn-loading { pointer-events: none; }
@media (max-width: 768px) {
  .add-product-modal { width: 95% !important; margin: 10px; }
  .add-product-modal .ant-modal-body { padding: 16px; }
}
.ant-input-number { width: 100%; }
.ant-select { border-radius: 6px; }
.ant-switch-checked { background-color: #3b82f6; }
.primary-indicator { background: linear-gradient(45deg, #22c55e, #16a34a); box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3); }
</style>