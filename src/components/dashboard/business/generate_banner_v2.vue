<template>
  <div style="background-color: white; border-radius: 15px; min-height: 90vh; border: 1px solid rgba(0,0,0,0.2); padding: 20px;">
    
    <!-- Header Section -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #1f2937;">
          🎨 My Banners
        </h2>
        <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Create and manage your custom banners</p>
      </div>
      <a-button @click="this.$router.push('/admin-generate-banner')" type="dashed" size="small">
        Admin Panel
      </a-button>
    </div>

    <!-- Aspect Ratio Filter -->
    <div style="margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <span style="font-size: 13px; font-weight: 600; color: #6b7280;">Filter by Aspect Ratio:</span>
        
        <div @click="selectedAspectRatio = 'all'"
             :style="{
               padding: '8px 16px',
               background: selectedAspectRatio === 'all' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f3f4f6',
               color: selectedAspectRatio === 'all' ? 'white' : '#6b7280',
               borderRadius: '8px',
               cursor: 'pointer',
               fontSize: '12px',
               fontWeight: '600',
               transition: 'all 0.2s',
               border: selectedAspectRatio === 'all' ? 'none' : '2px solid #e5e7eb'
             }">
          All
        </div>

        <div @click="selectedAspectRatio = '1:1'"
             :style="{
               width: '50px',
               height: '50px',
               background: selectedAspectRatio === '1:1' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f3f4f6',
               color: selectedAspectRatio === '1:1' ? 'white' : '#6b7280',
               border: selectedAspectRatio === '1:1' ? 'none' : '2px solid #e5e7eb',
               borderRadius: '10px',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               cursor: 'pointer',
               fontSize: '12px',
               fontWeight: '600',
               transition: 'all 0.2s'
             }">
          1:1
        </div>

        <div @click="selectedAspectRatio = '16:9'"
             :style="{
               width: '70px',
               height: '40px',
               background: selectedAspectRatio === '16:9' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f3f4f6',
               color: selectedAspectRatio === '16:9' ? 'white' : '#6b7280',
               border: selectedAspectRatio === '16:9' ? 'none' : '2px solid #e5e7eb',
               borderRadius: '10px',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               cursor: 'pointer',
               fontSize: '12px',
               fontWeight: '600',
               transition: 'all 0.2s'
             }">
          16:9
        </div>

        <div @click="selectedAspectRatio = '2:3'"
             :style="{
               width: '40px',
               height: '60px',
               background: selectedAspectRatio === '2:3' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f3f4f6',
               color: selectedAspectRatio === '2:3' ? 'white' : '#6b7280',
               border: selectedAspectRatio === '2:3' ? 'none' : '2px solid #e5e7eb',
               borderRadius: '10px',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               cursor: 'pointer',
               fontSize: '12px',
               fontWeight: '600',
               transition: 'all 0.2s'
             }">
          2:3
        </div>

        <div @click="selectedAspectRatio = '4:3'"
             :style="{
               width: '60px',
               height: '45px',
               background: selectedAspectRatio === '4:3' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f3f4f6',
               color: selectedAspectRatio === '4:3' ? 'white' : '#6b7280',
               border: selectedAspectRatio === '4:3' ? 'none' : '2px solid #e5e7eb',
               borderRadius: '10px',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               cursor: 'pointer',
               fontSize: '12px',
               fontWeight: '600',
               transition: 'all 0.2s'
             }">
          4:3
        </div>
      </div>
    </div>

    <!-- Banners Grid -->
    <a-spin :spinning="loadingBanners || loadingMyBanners">
      <a-row :gutter="[16, 16]">
        
        <!-- My Generated Banners -->
        <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="banner in filteredMyBanners" :key="banner.id">
          <div style="position: relative; background: white; border-radius: 12px; overflow: hidden; border: 2px solid #e5e7eb; transition: all 0.3s; cursor: pointer; height: 100%;" 
               @mouseenter="hoveredBanner = banner.id"
               @mouseleave="hoveredBanner = null">
            
            <div style="position: relative; width: 100%; padding-top: 75%; background: #f3f4f6; overflow: hidden;">
              <img :src="banner.final_banner" 
                   style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" 
                   alt="Generated Banner">
              
              <!-- Badge -->
              <div style="position: absolute; top: 8px; right: 8px; background: #10b981; color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);">
                My Banner
              </div>
            </div>

            <div style="padding: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 600; color: #667eea;">
                  {{ getBannerRatio(banner.banner) }}
                </span>
                <span style="font-size: 11px; color: #9ca3af;">
                  {{ formatDate(banner.created_at) }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div style="display: flex; gap: 6px; margin-top: 8px;">
                <a-button type="primary" size="small" block @click="downloadMyBanner(banner)">
                  <template #icon>💾</template>
                  Download
                </a-button>
                <a-button size="small" @click="shareMyBanner(banner)">
                  <template #icon>🔗</template>
                </a-button>
                <a-button danger size="small" @click="deleteMyBanner(banner.id)">
                  <template #icon>🗑️</template>
                </a-button>
              </div>
            </div>
          </div>
        </a-col>

        <!-- Create New Banner Card (+ Button) -->
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <div @click="showCreateModal = true"
               style="height: 100%; min-height: 300px; background: linear-gradient(135deg, #667eea22 0%, #764ba222 100%); border: 3px dashed #667eea; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s;"
               @mouseenter="hoveredCreate = true"
               @mouseleave="hoveredCreate = false">
            <div :style="{
              fontSize: '64px',
              marginBottom: '12px',
              transition: 'all 0.3s',
              transform: hoveredCreate ? 'scale(1.2) rotate(90deg)' : 'scale(1)'
            }">➕</div>
            <h3 style="margin: 0; color: #667eea; font-size: 16px; font-weight: 700;">Create New Banner</h3>
            <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 12px;">Click to start</p>
          </div>
        </a-col>
      </a-row>

      <!-- Empty State -->
      <div v-if="filteredMyBanners.length === 0 && !loadingMyBanners" 
           style="text-align: center; padding: 60px 20px; background: #f9fafb; border-radius: 12px; margin-top: 20px;">
        <div style="font-size: 64px; margin-bottom: 16px; opacity: 0.5;">🎨</div>
        <h3 style="margin: 0 0 8px 0; color: #6b7280; font-size: 18px; font-weight: 600;">No Banners Yet</h3>
        <p style="margin: 0; color: #9ca3af; font-size: 14px;">Create your first banner to get started!</p>
      </div>
    </a-spin>

    <!-- Create Banner Modal -->
    <a-modal v-model:open="showCreateModal" 
             title="Create New Banner" 
             :width="1200"
             :footer="null"
             :destroyOnClose="true">
      
      <a-steps :current="currentStep" style="margin-bottom: 24px;" size="small">
        <a-step title="Select Template" />
        <a-step title="Customize" />
        <a-step title="Preview & Save" />
      </a-steps>

      <!-- Step 1: Select Aspect Ratio & Template -->
      <div v-if="currentStep === 0">
        <h4 style="margin: 0 0 16px 0;">Choose Aspect Ratio</h4>
        
        <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px;">
          <div v-for="ratio in availableRatios" 
               :key="ratio"
               @click="selectRatioForCreation(ratio)"
               :style="{
                 padding: '16px 24px',
                 background: creationAspectRatio === ratio ? '#667eea' : '#f3f4f6',
                 color: creationAspectRatio === ratio ? 'white' : '#6b7280',
                 border: creationAspectRatio === ratio ? 'none' : '2px solid #e5e7eb',
                 borderRadius: '10px',
                 cursor: 'pointer',
                 fontSize: '16px',
                 fontWeight: '600',
                 transition: 'all 0.2s'
               }">
            {{ ratio }}
          </div>
        </div>

        <div v-if="creationAspectRatio">
          <h4 style="margin: 0 0 16px 0;">Select Template</h4>
          
          <div v-if="loadingTemplates" style="text-align: center; padding: 40px;">
            <a-spin tip="Loading templates..." />
          </div>

          <a-row :gutter="[16, 16]" v-else>
            <a-col :xs="24" :sm="12" :md="8" v-for="template in filteredTemplates" :key="template.id">
              <div @click="selectTemplate(template)"
                   :style="{
                     border: selectedTemplate?.id === template.id ? '3px solid #667eea' : '2px solid #e5e7eb',
                     borderRadius: '10px',
                     overflow: 'hidden',
                     cursor: 'pointer',
                     transition: 'all 0.2s',
                     background: selectedTemplate?.id === template.id ? '#eef2ff' : 'white'
                   }">
                <img :src="template.banner_image" 
                     style="width: 100%; height: 150px; object-fit: cover;" 
                     alt="Template">
                <div style="padding: 10px; text-align: center;">
                  <span style="font-size: 12px; font-weight: 600; color: #667eea;">
                    {{ template.banner_id }}
                  </span>
                  <div v-if="selectedTemplate?.id === template.id" 
                       style="margin-top: 4px; color: #10b981; font-size: 16px;">✓</div>
                </div>
              </div>
            </a-col>
          </a-row>

          <a-button type="primary" 
                    @click="nextStep" 
                    :disabled="!selectedTemplate"
                    style="margin-top: 20px; width: 100%;">
            Next: Customize Banner →
          </a-button>
        </div>
      </div>

      <!-- Step 2: Customize Banner -->
      <div v-if="currentStep === 1">
        <a-spin :spinning="!workingBannerImg" tip="Loading banner...">
          <a-row :gutter="16">
            <!-- Left Panel: Controls -->
            <a-col :span="8">
              <div style="max-height: 600px; overflow-y: auto; padding-right: 8px;">
                
                <!-- Text Elements -->
                <div style="margin-bottom: 20px;">
                  <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700;">📝 Edit Text</h4>
                  
                  <div v-if="workingTextElements.length === 0" 
                       style="padding: 16px; background: #f3f4f6; border-radius: 6px; text-align: center; color: #6b7280; font-size: 12px;">
                    No text elements
                  </div>
                  
                  <div v-else>
                    <div v-for="(text, index) in workingTextElements" 
                         :key="index" 
                         style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 12px;">
                      <label style="display: block; font-size: 11px; font-weight: 600; color: #6b7280; margin-bottom: 6px;">
                        Text {{ index + 1 }}
                      </label>
                      <a-input v-model:value="text.content"
                               placeholder="Enter text..."
                               @input="updateWorkingCanvas"
                               style="margin-bottom: 8px;" />
                      <div style="display: flex; gap: 6px; font-size: 11px; color: #9ca3af;">
                        <span>{{ text.fontFamily }} • {{ text.fontSize }}px</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style="height: 1px; background: #e5e7eb; margin: 20px 0;"></div>

                <!-- Product Areas -->
                <div>
                  <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700;">
                    🎭 Product Areas ({{ workingMaskAreas.length }})
                  </h4>
                  
                  <div v-for="(mask, index) in workingMaskAreas" 
                       :key="mask.id"
                       @click="selectWorkingMask(index)"
                       :style="{
                         padding: '12px',
                         background: selectedWorkingMaskIndex === index ? '#eef2ff' : '#f9fafb',
                         border: selectedWorkingMaskIndex === index ? '2px solid #667eea' : '2px solid #e5e7eb',
                         borderRadius: '6px',
                         cursor: 'pointer',
                         marginBottom: '10px',
                         transition: 'all 0.2s'
                       }">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                      <span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #667eea; color: white; border-radius: 50%; font-size: 12px; font-weight: 700;">
                        {{ index + 1 }}
                      </span>
                      <span style="font-size: 13px; font-weight: 600; color: #1f2937; flex: 1;">
                        {{ mask.name }}
                      </span>
                      <span v-if="mask.productImg" style="color: #10b981; font-size: 16px;">✓</span>
                    </div>
                    
                    <div v-if="mask.productPreview" 
                         style="width: 100%; height: 80px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                      <img :src="mask.productPreview" :alt="mask.name" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                    </div>
                    
                    <div v-else 
                         @click.stop="triggerProductUpload(index)"
                         style="width: 100%; height: 80px; background: #f3f4f6; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px; color: #9ca3af; border: 1px dashed #d1d5db; cursor: pointer;">
                      <span style="font-size: 24px; margin-bottom: 4px;">🛍️</span>
                      <span>Click to add product</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 8px; margin-top: 16px;">
                <a-button @click="currentStep = 0" style="flex: 1;">← Back</a-button>
                <a-button type="primary" @click="nextStep" style="flex: 2;">Preview →</a-button>
              </div>
            </a-col>

            <!-- Right Panel: Canvas -->
            <a-col :span="16">
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 600px;">
                <div v-if="workingBannerImg" style="position: relative; display: inline-block;">
                  <canvas ref="workingCanvas"
                          @mousedown="handleWorkingMouseDown"
                          @mousemove="handleWorkingMouseMove"
                          @mouseup="handleWorkingMouseUp"
                          @mouseleave="handleWorkingMouseUp"
                          @wheel.prevent="handleWorkingWheel"
                          @dblclick="handleWorkingDoubleClick"
                          style="border: 2px solid #e5e7eb; border-radius: 8px; cursor: move; display: block; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></canvas>

                  <!-- Mask Overlays for working canvas -->
                  <div v-for="(mask, index) in workingMaskAreas"
                       :key="`working-overlay-${mask.id}`"
                       @click.stop="selectWorkingMask(index)"
                       :style="getWorkingMaskOverlayStyle(index)">
                    <div v-if="!mask.productImg" 
                         @click.stop="triggerProductUpload(index)"
                         style="display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 14px; background: white; border: 2px solid #667eea; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); transition: all 0.2s; pointer-events: auto;">
                      <span style="font-size: 24px;">🛍️</span>
                      <span style="font-size: 11px; font-weight: 600; color: #667eea;">Add Product</span>
                    </div>
                    <div v-else 
                         style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: #10b981; color: white; border-radius: 50%; font-size: 14px; font-weight: 700; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3); pointer-events: auto;">
                      {{ index + 1 }}
                    </div>
                  </div>
                </div>
                
                <div v-else style="text-align: center; color: #9ca3af;">
                  <div style="font-size: 48px; margin-bottom: 12px;">⏳</div>
                  <p style="margin: 0;">Loading banner template...</p>
                </div>
              </div>

              <div v-if="workingBannerImg" style="text-align: center; font-size: 11px; color: #6b7280; margin-top: 12px;">
                💡 Click area → Upload product • Drag to reposition • Scroll to zoom • Double-click to reset
                <br>
                <span style="font-weight: 600; color: #667eea;">
                  Canvas: {{ workingCanvasWidth }}×{{ workingCanvasHeight }}px
                </span>
              </div>
            </a-col>
          </a-row>
        </a-spin>
      </div>

      <!-- Step 3: Preview & Save -->
      <div v-if="currentStep === 2">
        <div style="text-align: center;">
          <h3 style="margin: 0 0 20px 0;">Preview Your Banner</h3>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; display: inline-block;">
            <img v-if="previewBanner" 
                 :src="previewBanner" 
                 alt="Preview" 
                 style="max-width: 100%; height: auto; border-radius: 6px; border: 2px solid #e5e7eb;" />
          </div>

          <div style="display: flex; gap: 12px; justify-content: center;">
            <a-button @click="currentStep = 1" size="large">← Back to Edit</a-button>
            <a-button type="primary" 
                      size="large"
                      :loading="isSaving"
                      @click="saveGeneratedBanner">
              {{ isSaving ? 'Saving...' : '💾 Save Banner' }}
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- Hidden File Input -->
    <input ref="productFileInput"
           type="file"
           accept="image/*"
           @change="handleProductUpload"
           style="display: none;" />
  </div>
</template>

<script>
import { CopyOutlined, PicRightOutlined, FileDoneOutlined } from '@ant-design/icons-vue';

export default {
  name: 'BannerProductEditor_End_user',
  components: { CopyOutlined, PicRightOutlined, FileDoneOutlined },
  
  data() {
    return {
      // Filter & Display
      selectedAspectRatio: 'all',
      hoveredBanner: null,
      hoveredCreate: false,
      
      // My Banners
      myBanners: [],
      loadingMyBanners: false,
      
      // Template Banners
      templateBanners: [],
      loadingBanners: false,
      
      // Modal
      showCreateModal: false,
      currentStep: 0,
      
      // Creation Flow
      creationAspectRatio: null,
      selectedTemplate: null,
      loadingTemplates: false,
      availableRatios: ['1:1', '16:9', '2:3', '4:3', '2:1'],
      
      // Working Canvas
      workingBannerImg: null,
      workingCanvasWidth: 1200,
      workingCanvasHeight: 600,
      workingDisplayScale: 1,
      workingTextElements: [],
      workingMaskAreas: [],
      selectedWorkingMaskIndex: null,
      isDraggingWorking: false,
      dragStartWorking: { x: 0, y: 0 },
      currentProductUploadIndex: null,
      
      // Preview & Save
      previewBanner: null,
      isSaving: false
    };
  },
  
  computed: {
    filteredMyBanners() {
      if (this.selectedAspectRatio === 'all') {
        return this.myBanners;
      }
      return this.myBanners.filter(b => this.getBannerRatio(b.banner) === this.selectedAspectRatio);
    },
    
    filteredTemplates() {
      if (!this.creationAspectRatio) return [];
      return this.templateBanners.filter(b => b.ratio === this.creationAspectRatio);
    }
  },
  
  mounted() {
    this.fetchMyBanners();
    this.fetchTemplateBanners();
  },
  
  methods: {
    // ========== Fetch Data ==========
    async fetchMyBanners() {
      this.loadingMyBanners = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}generate_banner/api/my-banners/`,
          {
            method: 'GET',
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );

        const data = await response.json();
        if (data.success) {
          this.myBanners = data.data;
        }
      } catch (error) {
        console.error('Error fetching my banners:', error);
      } finally {
        this.loadingMyBanners = false;
      }
    },
    
    async fetchTemplateBanners() {
      this.loadingBanners = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}generate_banner/api/banner/list/`,
          {
            method: 'GET',
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );

        const data = await response.json();
        if (data.success) {
          this.templateBanners = data.data.map(banner => ({
            id: banner.id,
            banner_id: banner.banner_id,
            banner_image: banner.banner_image,
            ratio: banner.ratio,
            is_active: banner.is_active,
            text_data: banner.text_data
          }));
        }
      } catch (error) {
        console.error('Error fetching template banners:', error);
      } finally {
        this.loadingBanners = false;
      }
    },
    
    // ========== Creation Flow ==========
    selectRatioForCreation(ratio) {
      this.creationAspectRatio = ratio;
      this.selectedTemplate = null;
    },
    
    async selectTemplate(template) {
      this.selectedTemplate = template;
    },
    
    async nextStep() {
      if (this.currentStep === 0 && this.selectedTemplate) {
        // Load template details and wait for canvas to be ready
        this.currentStep = 1; // Move to step 1 first to render canvas
        await this.$nextTick(); // Wait for DOM to update
        await this.loadTemplateForEditing();
      } else if (this.currentStep === 1) {
        // Generate preview
        this.generatePreview();
        this.currentStep = 2;
      }
    },
    
    async loadTemplateForEditing() {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}generate_banner/api/banner/${this.selectedTemplate.banner_id}/`,
          {
            method: 'GET',
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );

        const data = await response.json();
        if (data.success) {
          const fullBanner = data.data;
          
          // Parse text data
          this.workingTextElements = typeof fullBanner.text_data === 'string' 
            ? JSON.parse(fullBanner.text_data || '[]')
            : (fullBanner.text_data || []);
          
          // Load banner image FIRST
          await this.loadWorkingBannerImage(fullBanner.banner_image);
          
          // Initialize canvas IMMEDIATELY after image loads
          await this.$nextTick();
          this.initWorkingCanvas();
          
          // Load binary masks
          const maskUrls = fullBanner.binary_masks
            .sort((a, b) => a.order - b.order)
            .map(mask => mask.image);
          
          await this.loadWorkingMaskImages(maskUrls);
          
          // Update canvas again after masks load
          await this.$nextTick();
          this.updateWorkingCanvas();
        }
      } catch (error) {
        console.error('Error loading template:', error);
        this.$message.error('Failed to load template');
      }
    },
    
    loadWorkingBannerImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          this.workingBannerImg = img;
          this.workingCanvasWidth = img.width;
          this.workingCanvasHeight = img.height;
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });
    },
    
    async loadWorkingMaskImages(maskPaths) {
      this.workingMaskAreas = await Promise.all(
        maskPaths.map(async (path, idx) => {
          try {
            const maskImg = await this.loadImage(path);
            const bounds = this.calculateMaskBounds(maskImg);
            return {
              id: idx + 1,
              name: `Product Area ${idx + 1}`,
              maskImg: maskImg,
              maskBounds: bounds,
              productImg: null,
              productPreview: null,
              transform: {
                x: bounds.x,
                y: bounds.y,
                width: 0,
                height: 0,
                scale: 1
              }
            };
          } catch (error) {
            console.error(`Failed to load mask ${idx + 1}`);
            return null;
          }
        })
      ).then(areas => areas.filter(a => a !== null));
    },
    
    loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    },
    
    calculateMaskBounds(maskImg) {
      const canvas = document.createElement('canvas');
      canvas.width = this.workingCanvasWidth;
      canvas.height = this.workingCanvasHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(maskImg, 0, 0, this.workingCanvasWidth, this.workingCanvasHeight);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

          if (brightness > 127) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    },
    
    // ========== Working Canvas ==========
    initWorkingCanvas() {
      const canvas = this.$refs.workingCanvas;
      if (!canvas || !this.workingBannerImg) {
        console.warn('Canvas or banner image not ready');
        return;
      }

      // Set canvas to EXACT image dimensions
      this.workingCanvasWidth = this.workingBannerImg.width;
      this.workingCanvasHeight = this.workingBannerImg.height;
      
      canvas.width = this.workingCanvasWidth;
      canvas.height = this.workingCanvasHeight;

      // Calculate display scale to fit container while maintaining aspect ratio
      const container = canvas.parentElement;
      const maxWidth = 700;
      const maxHeight = 600;

      const scaleX = maxWidth / this.workingCanvasWidth;
      const scaleY = maxHeight / this.workingCanvasHeight;
      this.workingDisplayScale = Math.min(scaleX, scaleY, 1);

      // Set display size (CSS)
      canvas.style.width = Math.round(this.workingCanvasWidth * this.workingDisplayScale) + 'px';
      canvas.style.height = Math.round(this.workingCanvasHeight * this.workingDisplayScale) + 'px';

      console.log('Canvas initialized:', {
        actualSize: `${this.workingCanvasWidth}x${this.workingCanvasHeight}`,
        displaySize: `${Math.round(this.workingCanvasWidth * this.workingDisplayScale)}x${Math.round(this.workingCanvasHeight * this.workingDisplayScale)}`,
        scale: this.workingDisplayScale
      });

      // Draw immediately
      this.updateWorkingCanvas();
    },
    
    updateWorkingCanvas() {
      const canvas = this.$refs.workingCanvas;
      if (!canvas || !this.workingBannerImg) {
        console.warn('Cannot update canvas - canvas or image missing');
        return;
      }

      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw banner image at EXACT size
      ctx.drawImage(this.workingBannerImg, 0, 0, canvas.width, canvas.height);

      // Draw products with masks
      this.workingMaskAreas.forEach(mask => {
        if (!mask.productImg || !mask.maskImg) return;

        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = this.workingCanvasWidth;
        maskCanvas.height = this.workingCanvasHeight;
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.drawImage(mask.maskImg, 0, 0);

        const productCanvas = document.createElement('canvas');
        productCanvas.width = this.workingCanvasWidth;
        productCanvas.height = this.workingCanvasHeight;
        const productCtx = productCanvas.getContext('2d');

        const w = mask.transform.width * mask.transform.scale;
        const h = mask.transform.height * mask.transform.scale;

        productCtx.drawImage(mask.productImg, mask.transform.x, mask.transform.y, w, h);

        const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);
        const productData = productCtx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < maskData.data.length; i += 4) {
          const brightness = (maskData.data[i] + maskData.data[i + 1] + maskData.data[i + 2]) / 3;
          if (brightness > 127) {
            currentData.data[i] = productData.data[i];
            currentData.data[i + 1] = productData.data[i + 1];
            currentData.data[i + 2] = productData.data[i + 2];
            currentData.data[i + 3] = productData.data[i + 3];
          }
        }
        ctx.putImageData(currentData, 0, 0);
      });

      // Draw text
      this.workingTextElements.forEach(text => {
        ctx.save();
        ctx.font = `${text.fontStyle || 'normal'} ${text.fontWeight || 'normal'} ${text.fontSize || 16}px ${text.fontFamily || 'Arial'}`;
        ctx.fillStyle = text.color || '#000000';
        ctx.fillText(text.content || '', text.x || 0, text.y || 0);
        ctx.restore();
      });
    },
    
    getWorkingMaskOverlayStyle(index) {
      const mask = this.workingMaskAreas[index];
      if (!mask || !mask.maskBounds) return { display: 'none' };

      const canvas = this.$refs.workingCanvas;
      if (!canvas) return { display: 'none' };

      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width / this.workingCanvasWidth;
      const scaleY = rect.height / this.workingCanvasHeight;

      const isSelected = this.selectedWorkingMaskIndex === index;

      return {
        position: 'absolute',
        left: (mask.maskBounds.x * scaleX) + 'px',
        top: (mask.maskBounds.y * scaleY) + 'px',
        width: (mask.maskBounds.width * scaleX) + 'px',
        height: (mask.maskBounds.height * scaleY) + 'px',
        border: `3px ${isSelected ? 'solid' : 'dashed'} ${isSelected ? '#10b981' : '#667eea'}`,
        background: `rgba(102, 126, 234, ${isSelected ? '0.1' : '0.05'})`,
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        pointerEvents: 'auto',
        zIndex: 10
      };
    },
    
    selectWorkingMask(index) {
      this.selectedWorkingMaskIndex = this.selectedWorkingMaskIndex === index ? null : index;
    },
    
    triggerProductUpload(index) {
      this.currentProductUploadIndex = index;
      this.$refs.productFileInput.click();
    },
    
    async handleProductUpload(event) {
      const file = event.target.files[0];
      if (!file || this.currentProductUploadIndex === null) return;

      try {
        const url = URL.createObjectURL(file);
        const img = await this.loadImage(url);

        const mask = this.workingMaskAreas[this.currentProductUploadIndex];
        mask.productImg = img;
        mask.productPreview = url;

        const padding = 0.9;
        const scaleX = (mask.maskBounds.width * padding) / img.width;
        const scaleY = (mask.maskBounds.height * padding) / img.height;
        const optimalScale = Math.min(scaleX, scaleY, 1);

        const scaledWidth = img.width * optimalScale;
        const scaledHeight = img.height * optimalScale;

        mask.transform = {
          x: mask.maskBounds.x + (mask.maskBounds.width - scaledWidth) / 2,
          y: mask.maskBounds.y + (mask.maskBounds.height - scaledHeight) / 2,
          width: img.width,
          height: img.height,
          scale: optimalScale
        };

        this.updateWorkingCanvas();
        this.currentProductUploadIndex = null;
        event.target.value = '';
      } catch (error) {
        console.error('Error loading image:', error);
        this.$message.error('Failed to load product image');
      }
    },
    
    handleWorkingMouseDown(e) {
      if (this.selectedWorkingMaskIndex === null) return;

      const mask = this.workingMaskAreas[this.selectedWorkingMaskIndex];
      if (!mask || !mask.productImg) return;

      const canvas = this.$refs.workingCanvas;
      const rect = canvas.getBoundingClientRect();
      const scaleX = this.workingCanvasWidth / rect.width;
      const scaleY = this.workingCanvasHeight / rect.height;

      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      this.isDraggingWorking = true;
      this.dragStartWorking = { 
        x: mouseX - mask.transform.x, 
        y: mouseY - mask.transform.y 
      };
    },
    
    handleWorkingMouseMove(e) {
      if (!this.isDraggingWorking || this.selectedWorkingMaskIndex === null) return;

      const mask = this.workingMaskAreas[this.selectedWorkingMaskIndex];
      if (!mask || !mask.productImg) return;

      const canvas = this.$refs.workingCanvas;
      const rect = canvas.getBoundingClientRect();
      const scaleX = this.workingCanvasWidth / rect.width;
      const scaleY = this.workingCanvasHeight / rect.height;

      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      mask.transform.x = mouseX - this.dragStartWorking.x;
      mask.transform.y = mouseY - this.dragStartWorking.y;

      this.updateWorkingCanvas();
    },
    
    handleWorkingMouseUp() {
      this.isDraggingWorking = false;
    },
    
    handleWorkingWheel(e) {
      if (this.selectedWorkingMaskIndex === null) return;

      const mask = this.workingMaskAreas[this.selectedWorkingMaskIndex];
      if (!mask || !mask.productImg) return;

      e.preventDefault();

      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const oldScale = mask.transform.scale;
      const newScale = Math.max(0.1, Math.min(5, oldScale + delta));

      const centerX = mask.transform.x + (mask.transform.width * oldScale) / 2;
      const centerY = mask.transform.y + (mask.transform.height * oldScale) / 2;

      mask.transform.scale = newScale;
      mask.transform.x = centerX - (mask.transform.width * newScale) / 2;
      mask.transform.y = centerY - (mask.transform.height * newScale) / 2;

      this.updateWorkingCanvas();
    },
    
    handleWorkingDoubleClick() {
      if (this.selectedWorkingMaskIndex === null) return;
      
      const mask = this.workingMaskAreas[this.selectedWorkingMaskIndex];
      if (!mask || !mask.productImg) return;

      const padding = 0.9;
      const scaleX = (mask.maskBounds.width * padding) / mask.productImg.width;
      const scaleY = (mask.maskBounds.height * padding) / mask.productImg.height;
      const optimalScale = Math.min(scaleX, scaleY, 1);

      const scaledWidth = mask.productImg.width * optimalScale;
      const scaledHeight = mask.productImg.height * optimalScale;

      mask.transform = {
        x: mask.maskBounds.x + (mask.maskBounds.width - scaledWidth) / 2,
        y: mask.maskBounds.y + (mask.maskBounds.height - scaledHeight) / 2,
        width: mask.productImg.width,
        height: mask.productImg.height,
        scale: optimalScale
      };

      this.updateWorkingCanvas();
    },
    
    // ========== Preview & Save ==========
    generatePreview() {
      const canvas = this.$refs.workingCanvas;
      if (!canvas) return;
      
      this.previewBanner = canvas.toDataURL('image/png');
    },
    
    // async saveGeneratedBanner() {
    //   this.isSaving = true;
      
    //   try {
    //     const canvas = this.$refs.workingCanvas;
    //     const finalBannerDataUrl = canvas.toDataURL('image/png');
        
    //     // Convert data URL to blob
    //     const response = await fetch(finalBannerDataUrl);
    //     const blob = await response.blob();
    //     const finalBannerFile = new File([blob], `banner_${Date.now()}.png`, { type: 'image/png' });
        
    //     // Prepare form data
    //     const formData = new FormData();
    //     formData.append('banner_id', this.selectedTemplate.banner_id);
    //     formData.append('text_data', JSON.stringify(this.workingTextElements));
    //     formData.append('final_banner', finalBannerFile);
        
    //     // Also save raw banner (banner image without products)
    //     const rawCanvas = document.createElement('canvas');
    //     rawCanvas.width = this.workingCanvasWidth;
    //     rawCanvas.height = this.workingCanvasHeight;
    //     const rawCtx = rawCanvas.getContext('2d');
    //     rawCtx.drawImage(this.workingBannerImg, 0, 0);
        
    //     // Draw text on raw banner
    //     this.workingTextElements.forEach(text => {
    //       rawCtx.save();
    //       rawCtx.font = `${text.fontStyle || 'normal'} ${text.fontWeight || 'normal'} ${text.fontSize || 16}px ${text.fontFamily || 'Arial'}`;
    //       rawCtx.fillStyle = text.color || '#000000';
    //       rawCtx.fillText(text.content || '', text.x || 0, text.y || 0);
    //       rawCtx.restore();
    //     });
        
    //     const rawBannerDataUrl = rawCanvas.toDataURL('image/png');
    //     const rawResponse = await fetch(rawBannerDataUrl);
    //     const rawBlob = await rawResponse.blob();
    //     const rawBannerFile = new File([rawBlob], `raw_banner_${Date.now()}.png`, { type: 'image/png' });
        
    //     formData.append('raw_banner', rawBannerFile);
        
    //     // Save to backend
    //     const saveResponse = await fetch(
    //       `${this.$store.state.root_api}generate_banner/api/generate-banner/`,
    //       {
    //         method: 'POST',
    //         headers: { 'Authorization': `Token ${localStorage.getItem('token')}` },
    //         body: formData
    //       }
    //     );

    //     const saveData = await saveResponse.json();
        
    //     if (saveData.success) {
    //       this.$message.success('Banner saved successfully!');
    //       await this.fetchMyBanners();
    //       this.resetCreationFlow();
    //       this.showCreateModal = false;
    //     } else {
    //       throw new Error(saveData.message || 'Failed to save banner');
    //     }
    //   } catch (error) {
    //     console.error('Error saving banner:', error);
    //     this.$message.error(error.message || 'Failed to save banner');
    //   } finally {
    //     this.isSaving = false;
    //   }
    // },
    
async saveGeneratedBanner() {
  try {
    this.isSaving = true;

    // Check if preview exists
    if (!this.previewBanner) {
      this.$message.error('Preview not found. Please generate the banner first.');
      this.isSaving = false;
      return;
    }

    // Use the existing preview base64 data
    const imageData = this.previewBanner;

    // Example API call — adjust endpoint and payload to match your backend
    const response = await fetch(`${this.$store.state.root_api}generate_banner/api/save-banner/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        final_banner: imageData,
        template_id: this.selectedTemplate?.id,
        ratio: this.creationAspectRatio
      })
    });

    const data = await response.json();

    if (data.success) {
      this.$message.success('Banner saved successfully!');
      this.showCreateModal = false;
      this.fetchMyBanners?.(); // refresh list if exists
    } else {
      this.$message.error('Failed to save banner.');
    }
  } catch (error) {
    console.error('Error saving banner:', error);
    this.$message.error('An unexpected error occurred.');
  } finally {
    this.isSaving = false;
  }
},

    resetCreationFlow() {
      this.currentStep = 0;
      this.creationAspectRatio = null;
      this.selectedTemplate = null;
      this.workingBannerImg = null;
      this.workingTextElements = [];
      this.workingMaskAreas = [];
      this.selectedWorkingMaskIndex = null;
      this.previewBanner = null;
    },
    
    // ========== My Banners Actions ==========
    downloadMyBanner(banner) {
      const link = document.createElement('a');
      link.download = `my-banner-${banner.id}.png`;
      link.href = banner.final_banner;
      link.click();
    },
    
    shareMyBanner(banner) {
      const shareUrl = banner.final_banner;
      
      if (navigator.share) {
        navigator.share({
          title: 'My Banner',
          text: 'Check out my custom banner!',
          url: shareUrl
        }).catch(err => console.log('Error sharing:', err));
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
          this.$message.success('Link copied to clipboard!');
        }).catch(() => {
          this.$message.error('Failed to copy link');
        });
      }
    },
    
    async deleteMyBanner(bannerId) {
      this.$confirm({
        title: 'Delete Banner',
        content: 'Are you sure you want to delete this banner? This action cannot be undone.',
        okText: 'Delete',
        okType: 'danger',
        onOk: async () => {
          try {
            const response = await fetch(
              `${this.$store.state.root_api}generate_banner/api/generate-banner/${bannerId}/`,
              {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
              }
            );

            const data = await response.json();
            
            if (data.success) {
              this.$message.success('Banner deleted successfully');
              await this.fetchMyBanners();
            } else {
              throw new Error(data.message || 'Failed to delete banner');
            }
          } catch (error) {
            console.error('Error deleting banner:', error);
            this.$message.error('Failed to delete banner');
          }
        }
      });
    },
    
    // ========== Utility ==========
    getBannerRatio(bannerId) {
      const template = this.templateBanners.find(b => b.banner_id === bannerId);
      return template ? template.ratio : 'Unknown';
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
};
</script>

<style scoped>
/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>