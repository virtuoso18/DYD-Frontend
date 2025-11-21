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
      <!-- {{rendered_modal_3D_id}}
      {{ modelDetails }} -->
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
        <a-col :span="10">
          <div style="position: relative; padding:10px;;">

            <canvas_3d_model_renderer 
            :glbModelUrl="this.$store.state.root_media_api + modelDetails['model_file']"
            :Model_instance_id="rendered_modal_3D_id"
            :isLoading="false"
            style="width: 100%; max-height:250px; height: 100%;border-radius: 10px"
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
              <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #374151;">Images used to create 3d model (<b>{{modelDetails['model_mode']}}</b>) </label>

            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
<img 
v-if="modelDetails['image_0']"
                  :src="this.$store.state.root_media_api+ modelDetails['image_0']" 
                  :style="{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb'

                  }"
                />
                <img 
                v-if="modelDetails['image_1']"
                  :src="this.$store.state.root_media_api+ modelDetails['image_1']" 
                  :style="{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb'

                  }"
                />
                <img 
                v-if="modelDetails['image_2']"
                  :src="this.$store.state.root_media_api+ modelDetails['image_2']" 
                  :style="{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb'

                  }"
                />
                <img 
                v-if="modelDetails['image_3']"
                  :src="this.$store.state.root_media_api+ modelDetails['image_3']" 
                  :style="{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb'

                  }"
                />
                </div>
          <!-- <div style="border: 2px solid #3b82f6; border-radius: 12px; padding: 16px; background: #f8faff; position: relative; min-height: 350px; display: flex; align-items: center; justify-content: center;">
            <div v-if="primaryImage" style="height: 100%; display: flex; align-items: center; justify-content: center;">
              <img 
                :src="primaryImage.url" 
                style="max-width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px;"
                alt="Primary product preview"
              />
            </div>
            
            
            <div v-else style="height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #9ca3af;">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom: 16px;">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
              <p style="font-size: 14px; margin: 0; text-align: center;">Upload images to preview product</p>
            </div>


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
          </div> -->

          
        </a-col>

        <!-- Right Column - Product Details -->
        <a-col :span="14">
          
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
                <!-- <span style="font-size: 12px; color: #6b7280;">Click to upload multiple images (Max 5)</span> -->
                 <!-- Primary image indicator text -->
          <!-- <p style="font-size: 12px; color: #6b7280; margin-top: 8px; text-align: center;">
            Primary product image preview
          </p> -->

          <!-- Multiple Images Gallery -->
          <div v-if="selectedImages.length > 0" style="margin-top: 16px;">
            <!-- <h4 style="font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #1f2937;">Product Images</h4> -->
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
                <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #374151;">Category <span style="color: red;">*</span></label>
                
                <a-select 
                  v-model:value="productForm.category_name" 
                  placeholder="Chair"
                  style="width: 100%;"
                  :style="{ background: '#f3f4f6' }"
                >
                
                  <a-select-option v-for="cat in categories_available" :key="cat.name" :value="cat.name">{{ cat.name }}</a-select-option>
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
                      :step="0.01"
                      placeholder="100"
                      style="width: 100%; border-radius: 4px; background: #f3f4f6; border: 1px solid #e5e7eb; font-size: 13px;"
                    />
                    <span style="margin-left: 6px; color: #9ca3af; font-size: 12px;">meter</span>
                  </div>
                </a-col>
                <a-col :span="8">
                  <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #6b7280;">Length</label>
                  <div style="display: flex; align-items: center;">
                    <a-input-number
                      v-model:value="productForm.dimensions.length" 
                      :min="0"
                      :step="0.01"
                      placeholder="30"
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
                      :step="0.01"
                      placeholder="30"
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
              
              <!-- Color Picker Popover -->
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
                        opacity: selectedColors.includes(color) ? 0.5 : 1
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
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
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
                    :style="{ 
                      width: '48px', 
                      height: '40px', 
                      backgroundImage: `url(${texture.url})`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center', 
                      borderRadius: '8px', 
                      border: '2px solid #e5e7eb', 
                      cursor: 'pointer' 
                    }"
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
            </div>

            <!-- PBR Files Section -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-size: 13px; color: #374151;">PBR Files</label>
              
              <!-- Upload PBR Button -->
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

              <!-- Selected PBR Files List -->
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

    <!-- Hidden File Inputs -->
     <input ref="pbrInput" type="file" style="display: none;" accept=".pbr,.zip,.rar,.7z,.tar,.gz" multiple @change="handlePbrUpload" />
    <input ref="imageInput" type="file" style="display: none;" accept=".jpg,.jpeg,.png" multiple @change="handleImageUpload" />
    <input ref="textureInput" type="file" style="display: none;" accept=".jpg,.jpeg,.png" multiple @change="handleTextureUpload" />
  </a-modal>
</template>

<script>
import { computed, ref, watch, onMounted } from 'vue';

import { useStore } from 'vuex';
import { useRouter,useRoute } from 'vue-router';
import canvas_3d_model_renderer from "@/components/store/canvas_3d_model_renderer.vue"

export default {
  name: "AddNewProduct_modal",
  props: {
    visible: { type: Boolean, default: false },
    rendered_modal_3D_id: { type: String, default: "" },
    types: { type: Array, default: () => ['Modern','Scandinavian','Classic','Minimalist','Industrial','Rustic','Boho','other'] }
  },
  components: {
    canvas_3d_model_renderer,
  },
  
  emits: ['update:visible', 'product-created', 'cancel'],
  setup(props, { emit }) {
    const isSaving = ref(false);
    const tempColor = ref('#000000');
    
    const store = useStore();
    
    const router = useRouter();
    const route = useRoute();
// 2. Add these refs in setup function (after existing refs):
const loading3dModelDetails = ref(false);
const modelDetails = ref(null);
const error = ref({ general: null });

const imageInput = ref(null);
const textureInput = ref(null);
    const categories_available = ref([]);

    const productForm = ref({
      name: '',
      description: '',
      category_name: '',
      furniture_type: '',
      pricing: { price: null },
      dimensions: { height: null, length: null, width: null }
    });

    const selectedImages = ref([]);
    const selectedColors = ref([]);
    const selectedTextures = ref([]);

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
      productForm.value = {
        name: '',
        description: '',
        category_name: '',
        furniture_type: '',
        pricing: { price: null },
        dimensions: { height: null, length: null, width: null }
      };
      selectedImages.value = [];
      selectedColors.value = [];
        selectedPbrFiles.value = [];

      selectedTextures.value = [];
      tempColor.value = '#000000';
    };

    
// 3. Add the improved API call function:
const get3dRenderedModelDetails = async (generated3dModelId) => {
  loading3dModelDetails.value = true;
  error.value.general = null;

  try {
    // Get the rendered_modal_3D_id from props
    const renderedModal3dId = props.rendered_modal_3D_id;
    
    if (!renderedModal3dId) {
      throw new Error('No rendered modal 3D ID provided');
    }

    const url = `${store.state.root_api}access-engine/api/business-products/business-access-get-rendered-3d-model-details/${renderedModal3dId}/?access-id=`+route.query.access_id;
    
    console.log('📡 Fetching generated 3d models history...', { generated3dModelId, renderedModal3dId });
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

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
      modelDetails.value = details;
      return details;
    } else {
      throw new Error(responseData.message || 'Failed to fetch 3D model details');
    }
    
  } catch (error) {
    console.error("❌ Failed to fetch 3D model details:", error);
    error.value.general = error.message;
    
    // Optional: Show user-friendly error message
    console.error('Error details:', {
      message: error.message,
      generated3dModelId,
      url: `products/get-rendered-3d-model-details/${props.rendered_modal_3D_id}/`
    });
  } finally {
    loading3dModelDetails.value = false;
  }
};


// 3. Add the improved API call function:
const fetch_Categories_available = async () => {
  try {
    const url = `${store.state.root_api}product/api/categories/`;
    
    console.log('📡 Fetching Product categories Available history...');
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

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
      console.log('ategories Available :', details);
      categories_available.value = details;
      return details;
    } else {
      throw new Error(responseData.message || 'Failed to categories Available model details');
    }
    
  } catch (error) {
    console.error("❌ Failed to categories Available model details:", error);    
    // Optional: Show user-friendly error message
    console.error('Error details:', {
      message: error.message,
      url: `product/categories/`
    });
  } 
};

// 4. Add onMounted lifecycle hook:
onMounted(async () => {
  // Only fetch if we have the required ID
  if (props.rendered_modal_3D_id) {
    console.log('🚀 Component mounted, fetching 3D model details...');
    await get3dRenderedModelDetails(props.rendered_modal_3D_id);
    await fetch_Categories_available();
  } else {
    console.warn('⚠️ No rendered_modal_3D_id provided on mount');
  }
});

// 5. Watch for changes in the rendered_modal_3D_id prop:
watch(() => props.rendered_modal_3D_id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    console.log('🔄 Modal ID changed, refetching details...', { newId, oldId });
    await get3dRenderedModelDetails(newId);
    await fetch_Categories_available();

  }
});
    // Image handling functions
    
const uploadImages = () => {
  imageInput.value?.click();
};

    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files);
      
      if (selectedImages.value.length + files.length > 5) {
        // You might want to use your message system here
        console.warn('Maximum 5 images allowed');
        return;
      }

      files.forEach(file => {
        if (validateImageFile(file)) {
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
      if (tempColor.value && !selectedColors.value.includes(tempColor.value)) {
        selectedColors.value.push(tempColor.value);
        tempColor.value = '#000000';
      }
    };

    const addPresetColor = (color) => {
      if (!selectedColors.value.includes(color)) {
        selectedColors.value.push(color);
      }
    };

    const removeColor = (index) => {
      selectedColors.value.splice(index, 1);
    };

    // Upload the PBR FIle here 
    // 1. Add these refs after the existing refs (around line 29):
const selectedPbrFiles = ref([]);
const pbrInput = ref(null);

// 2. Add PBR upload functions after the texture functions:
const uploadPbr = () => {
  pbrInput.value?.click();
};


const handlePbrUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    if (validatePbrFile(file)) {
      selectedPbrFiles.value.push({ 
        file, 
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      });
    }
  });
  event.target.value = '';
};

const validatePbrFile = (file) => {
  const validTypes = ['.pbr', '.zip', '.rar', '.7z', '.tar', '.gz'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

  if (!validTypes.includes(fileExtension)) {
    console.error(`Invalid file type for ${file.name}. Please upload PBR, ZIP, RAR, 7Z, TAR, or GZ files only.`);
    return false;
  }

  if (file.size > maxSize) {
    console.error(`File ${file.name} is too large. Please upload files smaller than 50MB.`);
    return false;
  }

  return true;
};

const removePbrFile = (index) => {
  selectedPbrFiles.value.splice(index, 1);
};

    // Texture handling functions
    
const uploadTexture = () => {
  textureInput.value?.click();
};

    const handleTextureUpload = (event) => {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (validateImageFile(file)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            selectedTextures.value.push({ 
              file, 
              url: e.target.result 
            });
          };
          reader.readAsDataURL(file);
        }
      });
      event.target.value = '';
    };

    const removeTexture = (index) => {
      selectedTextures.value.splice(index, 1);
    };

    const validateImageFile = (file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        console.error(`Invalid file type for ${file.name}. Please upload JPEG, JPG, or PNG files only.`);
        return false;
      }

      if (file.size > maxSize) {
        console.error(`File ${file.name} is too large. Please upload files smaller than 10MB.`);
        return false;
      }

      return true;
    };

    const validateForm = () => {
  if (!productForm.value.name?.trim()) {
    console.error('Product name is required');
    return false;
  }
  if (!productForm.value.category_name) {
    console.error('Category is required');
    return false;
  }
  if (!productForm.value.pricing.price || parseFloat(productForm.value.pricing.price) <= 0) {
    console.error('Valid price is required');
    return false;
  }
  if (selectedImages.value.length === 0) {
    console.error('At least one product image is required');
    return false;
  }
  if (!props.rendered_modal_3D_id) {
    console.error('3D model reference is required');
    return false;
  }
  return true;
};

    const handleSave = async () => {
  // if (!validateForm()) return;

  isSaving.value = true;

  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    // Add basic product data
    formData.append('name', productForm.value.name);
    formData.append('description', productForm.value.description || '');
    formData.append('category_name', productForm.value.category_name); // Changed from category_id
    formData.append('light_type', 'hanging');
    if (productForm.value.furniture_type) {
      formData.append('furniture_type', productForm.value.furniture_type);
    }
    formData.append('price', productForm.value.pricing.price);

    // Add the 3D model reference
    if (props.rendered_modal_3D_id) {
      formData.append('rendered_modal_3d_id', props.rendered_modal_3D_id);
    }

    // Add dimensions
    if (productForm.value.dimensions.height) {
      formData.append('height', productForm.value.dimensions.height);
    }
    if (productForm.value.dimensions.length) {
      formData.append('length', productForm.value.dimensions.length);
    }
    if (productForm.value.dimensions.width) {
      formData.append('width', productForm.value.dimensions.width);
    }

    // Add images
    selectedImages.value.forEach((image, index) => {
      formData.append('images', image.file);
      if (image.isPrimary) {
        formData.append('primary_image_index', index);
      }
    });

    // Add PBR files
    selectedPbrFiles.value.forEach(pbrFile => {
      formData.append('pbr_files', pbrFile.file);
    });

    // Add colors as JSON string
    if (selectedColors.value.length > 0) {
      formData.append('available_colors', JSON.stringify(selectedColors.value));
    }

    // Add textures
    selectedTextures.value.forEach(texture => {
      formData.append('textures', texture.file);
    });

    // Add optional fields
    if (productForm.value.short_description) {
      formData.append('short_description', productForm.value.short_description);
    }
    if (productForm.value.brand) {
      formData.append('brand', productForm.value.brand);
    }
    if (productForm.value.model_number) {
      formData.append('model_number', productForm.value.model_number);
    }
    if (productForm.value.material) {
      formData.append('material', productForm.value.material);
    }
    if (productForm.value.primary_color) {
      formData.append('primary_color', productForm.value.primary_color);
    }
    if (productForm.value.secondary_color) {
      formData.append('secondary_color', productForm.value.secondary_color);
    }

    // Debug: Log what we're sending
    console.log('📤 Sending product data:', {
      name: productForm.value.name,
      category_name: productForm.value.category_name,
      rendered_modal_3D_id: props.rendered_modal_3D_id,
      images_count: selectedImages.value.length,
      colors_count: selectedColors.value.length,
      textures_count: selectedTextures.value.length,
      pbr_files_count: selectedPbrFiles.value.length
    });

    

    const response = await fetch(`${store.state.root_api}access-engine/api/business-products/add-product-light/?access-id=`+route.query.access_id, {
      method: 'POST',
      headers: { 
        'Authorization': `Token ${token}` 
        // Don't set Content-Type when using FormData - browser will set it automatically
      },
      body: formData
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ Product created successfully:', result.data);
      
      // Show success message (you might want to use your app's notification system)
      console.log('Product created successfully!');
      
      // Emit events to parent component
      emit('product-created', result.data);
      emit('update:visible', false);
      resetForm();
      
      // Optional: Navigate to product list or product detail page
      // router.push('/products');
      
    } else {
      console.error('❌ API Error:', result.message || 'Failed to create product');
      throw new Error(result.message || 'Failed to create product');
    }

  } catch (error) {
    console.error('❌ Error creating product:', error);
    
    // Show error message (you might want to use your app's notification system)
    console.error('Error creating product. Please try again.');
    
  } finally {
    isSaving.value = false;
  }
};

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

    return {
      selectedPbrFiles,
  pbrInput,
      productForm,
      selectedImages,
      selectedColors,
      selectedTextures,
      primaryImage,
      isSaving,
      tempColor,
      presetColors,
      imageInput,
      textureInput,
  
      loading3dModelDetails,
      modelDetails,
      error,
      categories_available,
      get3dRenderedModelDetails,
        fetch_Categories_available,
  uploadPbr,
  handlePbrUpload,
  removePbrFile,
      uploadImages,
      handleImageUpload,
      setPrimaryImage,
      removeImage,
      addAvailableColor,
      addPresetColor,
      removeColor,
      uploadTexture,
      handleTextureUpload,
      removeTexture,
      handleSave,
      handleCancel
    };
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