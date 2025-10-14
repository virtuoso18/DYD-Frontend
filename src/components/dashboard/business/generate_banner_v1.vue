<template>
    <a-button @click="this.$router.push('/admin-generate-banner')"> generate banner</a-button>
  <div style="background: white; min-height: 100vh; padding: 20px;">
    <a-row :gutter="[16, 16]">
      <!-- Left Panel -->
      <a-col :sm="24" :xs="24" :md="8" :lg="6">
        <a-tabs v-model:activeKey="active_banner_tab"  style="padding: 0;">
          
          <!-- Banner Selection Tab -->
          <a-tab-pane key="list_banners">
            <template #tab>
              <span><CopyOutlined /></span>
            </template>
            
            <div style="padding: 12px;">
              <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #1f2937; text-transform: uppercase;">
                📋 Select Banner Template
              </h3>

              <div style="display:flex;gap:5px;justify-content: space-between;;">
                <div style="height:50px;width:50px;background: red;border:2px solid grey;border-radius:10px;display:flex;justify-content: center;align-items: center;">1:1</div>
                <div style="height:40px;width:70px;background: red;border:2px solid grey;border-radius:10px;display:flex;justify-content: center;align-items: center;">3:2</div>
                <div style="height:50px;width:40px;background: red;border:2px solid grey;border-radius:10px;display:flex;justify-content: center;align-items: center;">2:3</div>

            </div>
<br>              
              <!-- Loading State -->
              <div v-if="loadingBanners" style="text-align: center; padding: 20px;">
                <a-spin tip="Loading banners..." />
              </div>

              <!-- No Banners State -->
              <div v-else-if="banners.length === 0" 
                   style="padding: 16px; background: #f3f4f6; border-radius: 6px; text-align: center; color: #6b7280; font-size: 13px;">
                No banners available
              </div>
              
              <!-- Banner List -->
              <div v-else v-for="banner in banners" 
                   :key="banner.id" 
                   @click="selectBanner(banner)"
                   :style="{
                     padding: '12px',
                     marginBottom: '12px',
                     border: selected_banner?.id === banner.id ? '2px solid #667eea' : '2px solid #e5e7eb',
                     borderRadius: '8px',
                     cursor: 'pointer',
                     background: selected_banner?.id === banner.id ? '#eef2ff' : '#f9fafb',
                     transition: 'all 0.2s'
                   }">
                <img :src="banner.banner_image" 
                     style="width: 100%; border-radius: 6px; margin-bottom: 8px;" 
                     alt="Banner template">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 12px; color: #6b7280; font-weight: 600;">
                    Ratio: {{ banner.ratio }}
                  </span>
                  <span v-if="selected_banner?.id === banner.id" 
                        style="color: #10b981; font-size: 16px;">✓</span>
                </div>
              </div>
            </div>
          </a-tab-pane>

          <!-- Edit Content Tab -->
          <a-tab-pane key="change_contents" :disabled="!selected_banner">
            <template #tab>
              <span><PicRightOutlined /></span>
            </template>

            <div style="padding: 12px;">
              <!-- Text Elements -->
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #1f2937; text-transform: uppercase;">
                  📝 Edit Text
                </h3>
                
                <div v-if="textElements.length === 0" 
                     style="padding: 16px; background: #f3f4f6; border-radius: 6px; text-align: center; color: #6b7280; font-size: 13px;">
                  No text elements
                </div>
                
                <div v-else>
                  <div v-for="(text, index) in textElements" 
                       :key="index" 
                       style="padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 12px;">
                    <label style="display: block; font-size: 11px; font-weight: 600; color: #6b7280; margin-bottom: 6px; text-transform: uppercase;">
                      {{ text.fontFamily }} - {{ text.fontSize }}px
                    </label>
                    <input v-model="text.content"
                           type="text"
                           @input="updateCanvas"
                           style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; margin-bottom: 6px; box-sizing: border-box;" />
                    <small :style="{ color: text.color, fontSize: '11px' }">{{ text.color }}</small>
                  </div>
                </div>
              </div>

              <div style="height: 1px; background: #e5e7eb; margin: 20px 0;"></div>

              <!-- Product Areas -->
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #1f2937; text-transform: uppercase;">
                  🎭 Product Areas ({{ maskAreas.length }})
                </h3>
                
                <div v-if="maskAreas.length === 0" 
                     style="padding: 16px; background: #f3f4f6; border-radius: 6px; text-align: center; color: #6b7280; font-size: 13px;">
                  Loading masks...
                </div>
                
                <div v-else>
                  <div v-for="(mask, index) in maskAreas"
                       :key="mask.id"
                       @click="selectMask(index)"
                       :style="{
                         padding: '12px',
                         background: selectedMaskIndex === index ? '#eef2ff' : '#f9fafb',
                         border: selectedMaskIndex === index ? '2px solid #667eea' : '2px solid #e5e7eb',
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
                         @click.stop="triggerUpload(index)"
                         style="width: 100%; height: 80px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #9ca3af; border: 1px dashed #d1d5db; cursor: pointer;">
                      Click to add product
                    </div>
                  </div>
                </div>
              </div>

              <div style="height: 1px; background: #e5e7eb; margin: 20px 0;"></div>

              <!-- Generate Button -->
              <button @click="generateBanner"
                      :disabled="!canGenerate || isGenerating"
                      :style="{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: (!canGenerate || isGenerating) ? 'not-allowed' : 'pointer',
                        background: (!canGenerate || isGenerating) ? '#d1d5db' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        opacity: (!canGenerate || isGenerating) ? '0.6' : '1',
                        transition: 'all 0.2s'
                      }">
                {{ isGenerating ? '⏳ Processing...' : '✨ Generate Banner' }}
              </button>
            </div>
          </a-tab-pane>

          <!-- Confirm Render Tab -->
          <a-tab-pane key="confirm_render" :disabled="!finalBanner">
            <template #tab>
              <span><FileDoneOutlined /></span>
            </template>
            
            <div style="padding: 12px;">
              <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #1f2937;">
                🎉 Download Banner
              </h3>
              
              <button @click="downloadBanner" 
                      v-if="finalBanner"
                      style="width: 100%; padding: 12px 16px; font-size: 14px; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; background: #10b981; color: white; transition: all 0.2s;">
                💾 Download Banner
              </button>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>

      <!-- Right Panel - Canvas -->
      <a-col :sm="24" :xs="24" :md="16" :lg="18">
        <div v-if="!selected_banner" 
             style="width: 100%; height: 500px; background: white; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
          <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;">🎨</div>
          <p style="margin: 0; color: #6b7280; font-size: 16px;">Select a banner template to start editing</p>
        </div>

        <div v-else-if="bannerImg && maskAreas.length > 0 && finalBanner === null" 
             style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); display: flex; justify-content: center; align-items: center; min-height: 400px;">
          <div style="position: relative; display: inline-block;">
            <canvas ref="canvas"
                    @mousedown="handleMouseDown"
                    @mousemove="handleMouseMove"
                    @mouseup="handleMouseUp"
                    @mouseleave="handleMouseUp"
                    @wheel.prevent="handleWheel"
                    @dblclick="handleDoubleClick"
                    style="border: 2px solid #e5e7eb; border-radius: 8px; cursor: move; display: block; max-width: 100%; height: auto;"></canvas>

            <!-- Mask Overlays -->
            <div v-for="(mask, index) in maskAreas"
                 :key="`overlay-${mask.id}`"
                 @click.stop="selectMask(index)"
                 :style="getMaskOverlayStyle(index)">
              <div v-if="!mask.productImg" 
                   @click.stop="triggerUpload(index)"
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
        </div>

        <div v-else-if="!finalBanner" 
             style="width: 100%; height: 500px; background: white; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
          <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;">⏳</div>
          <p style="margin: 0; color: #6b7280;">Loading banner...</p>
        </div>

        <!-- Instructions -->
        <div v-if="bannerImg && maskAreas.length > 0 && !finalBanner" 
             style="text-align: center; font-size: 12px; color: #6b7280; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); margin-top: 16px;">
          💡 Click area number → Drag product • Scroll to zoom • Double-click to reset
        </div>

        <!-- Final Banner Result -->
        <div v-if="finalBanner" 
             style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
          <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700;">🎉 Your Final Banner</h3>
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: center;">
            <img :src="finalBanner" alt="Final Banner" style="max-width: 100%; height: auto; border-radius: 6px;" />
          </div>
          <button @click="downloadBanner" 
                  style="width: 100%; padding: 12px 16px; font-size: 14px; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; background: #10b981; color: white; transition: all 0.2s;">
            💾 Download Banner
          </button>
        </div>
      </a-col>
    </a-row>

    <!-- Hidden File Input -->
    <input ref="fileInput"
           type="file"
           accept="image/*"
           @change="handleFileUpload"
           style="display: none;" />
  </div>
</template>

<script>
import { CopyOutlined, PicRightOutlined, FileDoneOutlined } from '@ant-design/icons-vue';

export default {
  name: 'BannerProductEditor',
  components: { CopyOutlined, PicRightOutlined, FileDoneOutlined },
  
  data() {
    return {
      bannerImg: null,
      canvasWidth: 1200,
      canvasHeight: 600,
      displayScale: 1,
      
      banners: [],
      loadingBanners: false,
      
      selected_banner: null,
      active_banner_tab: 'list_banners',
      textElements: [],
      maskAreas: [],
      selectedMaskIndex: null,
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      currentUploadIndex: null,
      finalBanner: null,
      isGenerating: false
    };
  },
  
  computed: {
    canGenerate() {
      return this.bannerImg && this.maskAreas.some(m => m.productImg);
    }
  },
  
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.fetchBannerList();
  },
  
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  
  methods: {
    async fetchBannerList() {
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
        console.log(data)
        if (data.success) {
          this.banners = data.data.map(banner => ({
            id: banner.id,
            banner_id: banner.banner_id,
            banner_image: banner.banner_image,
            ratio: banner.ratio,
            is_active: banner.is_active,
            created_at: banner.created_at,
            text_data: JSON.parse(banner.text_data || '[]')
          }));
        } else {
          this.$message.error('Failed to load banners');
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        this.$message.error('Error loading banners');
      } finally {
        this.loadingBanners = false;
      }
    },

    async selectBanner(banner) {
      this.selected_banner = banner;
      this.textElements = JSON.parse(JSON.stringify(banner.text_data || []));
      this.maskAreas = [];
      this.finalBanner = null;
      this.active_banner_tab = 'change_contents';
      
      try {
        // Fetch full banner details including binary masks
        const response = await fetch(
          `${this.$store.state.root_api}generate_banner/api/banner/${banner.banner_id}/`,
          {
            method: 'GET',
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );

        const data = await response.json();
        if (data.success) {
          const fullBanner = data.data;
          
          // Load banner image
          await this.loadBannerImage(fullBanner.banner_image);
          
          // Load binary masks
          const maskUrls = fullBanner.binary_masks
            .sort((a, b) => a.order - b.order)
            .map(mask => mask.image);
          
          await this.loadMaskImages(maskUrls);
          
          this.$nextTick(() => {
            this.initCanvas();
          });
        } else {
          this.$message.error('Failed to load banner details');
        }
      } catch (error) {
        console.error('Error loading banner:', error);
        this.$message.error('Error loading banner details');
      }
    },
    
    loadBannerImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          this.bannerImg = img;
          this.canvasWidth = img.width;
          this.canvasHeight = img.height;
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });
    },
    
    async loadMaskImages(maskPaths) {
      this.maskAreas = await Promise.all(
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
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(maskImg, 0, 0, this.canvasWidth, this.canvasHeight);

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
    
    initCanvas() {
      const canvas = this.$refs.canvas;
      if (!canvas || !this.bannerImg) return;

      const container = canvas.parentElement.parentElement;
      const maxWidth = container.clientWidth - 40;
      const maxHeight = 700;

      const scaleX = maxWidth / this.canvasWidth;
      const scaleY = maxHeight / this.canvasHeight;
      this.displayScale = Math.min(scaleX, scaleY, 1);

      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      canvas.style.width = (this.canvasWidth * this.displayScale) + 'px';
      canvas.style.height = (this.canvasHeight * this.displayScale) + 'px';

      this.updateCanvas();
    },
    
    updateCanvas() {
      const canvas = this.$refs.canvas;
      if (!canvas || !this.bannerImg) return;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this.bannerImg, 0, 0);

      this.maskAreas.forEach(mask => {
        if (!mask.productImg || !mask.maskImg) return;

        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = this.canvasWidth;
        maskCanvas.height = this.canvasHeight;
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.drawImage(mask.maskImg, 0, 0);

        const productCanvas = document.createElement('canvas');
        productCanvas.width = this.canvasWidth;
        productCanvas.height = this.canvasHeight;
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

     this.textElements.forEach(text => {
  ctx.save();
  ctx.font = `${text.fontStyle || 'normal'} ${text.fontWeight || 'normal'} ${text.fontSize || 16}px ${text.fontFamily || 'Arial'}`;
  ctx.fillStyle = text.color || '#000000';
  ctx.fillText(text.content || '', text.x || 0, text.y || 0);
  ctx.restore();
});
    },
    
    getMaskOverlayStyle(index) {
      const mask = this.maskAreas[index];
      if (!mask || !mask.maskBounds) return { display: 'none' };

      const canvas = this.$refs.canvas;
      if (!canvas) return { display: 'none' };

      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width / this.canvasWidth;
      const scaleY = rect.height / this.canvasHeight;

      const isSelected = this.selectedMaskIndex === index;

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
    
    selectMask(index) {
      this.selectedMaskIndex = this.selectedMaskIndex === index ? null : index;
    },
    
    triggerUpload(index) {
      this.currentUploadIndex = index;
      this.$refs.fileInput.click();
    },
    
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file || this.currentUploadIndex === null) return;

      try {
        const url = URL.createObjectURL(file);
        const img = await this.loadImage(url);

        const mask = this.maskAreas[this.currentUploadIndex];
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

        this.updateCanvas();
        this.currentUploadIndex = null;
        event.target.value = '';
      } catch (error) {
        console.error('Error loading image:', error);
      }
    },
    
    handleMouseDown(e) {
      if (this.selectedMaskIndex === null) return;

      const mask = this.maskAreas[this.selectedMaskIndex];
      if (!mask || !mask.productImg) return;

      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      const scaleX = this.canvasWidth / rect.width;
      const scaleY = this.canvasHeight / rect.height;

      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      mask.transform.x = mouseX - this.dragStart.x;
      mask.transform.y = mouseY - this.dragStart.y;

      this.updateCanvas();
    },
    
    handleMouseUp() {
      this.isDragging = false;
    },
    
    handleWheel(e) {
      if (this.selectedMaskIndex === null) return;

      const mask = this.maskAreas[this.selectedMaskIndex];
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

      this.updateCanvas();
    },
    
    handleDoubleClick() {
      if (this.selectedMaskIndex === null) return;
      
      const mask = this.maskAreas[this.selectedMaskIndex];
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

      this.updateCanvas();
    },
    
    async generateBanner() {
      if (!this.canGenerate || this.isGenerating) return;
      
      this.isGenerating = true;
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = this.$refs.canvas;
        this.finalBanner = canvas.toDataURL('image/png');
        
        this.isGenerating = false;
        this.active_banner_tab = 'confirm_render';
      } catch (error) {
        console.error('Error generating banner:', error);
        this.isGenerating = false;
        this.$message.error('Failed to generate banner. Please try again.');
      }
    },
    
    downloadBanner() {
      if (!this.finalBanner) return;
      
      const link = document.createElement('a');
      link.download = `banner-${this.selected_banner.banner_id}-${Date.now()}.png`;
      link.href = this.finalBanner;
      link.click();
    },
    
    handleResize() {
      this.$nextTick(() => {
        this.initCanvas();
      });
    }
  }
};
</script> 