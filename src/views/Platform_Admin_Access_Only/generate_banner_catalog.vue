<template>
  <div class="banner-editor">
    <a-row :gutter="20">
      <!-- Left Sidebar - Controls -->
      <a-col :span="6">
        <a-card title="Banner Creator" size="small" class="sticky-card">
          <a-steps :current="currentStep" finish-status="finish" size="small" style="margin-bottom: 20px;">
            <a-step title="Image" />
            <a-step title="Masks" />
            <a-step title="Text" />
            <a-step title="Save" />
          </a-steps>

          <!-- Step 1: Upload Banner Image -->
          <div v-if="currentStep === 0" class="step-content">
            <h4>1. Upload Banner Image</h4>
            <div class="upload-zone" @click="$refs.bannerInput.click()" :class="{ 'has-image': bannerImage }">
              <div v-if="bannerImage" style="text-align: center;">
                <div style="font-size: 24px; margin-bottom: 8px;">✓</div>
                <p style="margin: 0; font-size: 12px; color: #666;">Image loaded</p>
                <small style="color: #999;">Click to change</small>
              </div>
              <div v-else style="text-align: center;">
                <div style="font-size: 32px; margin-bottom: 8px;">📷</div>
                <p style="margin: 0; font-size: 13px; font-weight: 500;">Click to upload</p>
                <small style="color: #999;">Recommended: 1200x600px+</small>
              </div>
            </div>
            <input ref="bannerInput" type="file" accept="image/*" @change="handleBannerUpload" style="display: none;" />

            <a-form layout="vertical" style="margin-top: 16px;">
              <a-form-item label="Banner ID">
                <a-input v-model:value="bannerId" placeholder="e.g., banner_summer_2024" />
              </a-form-item>
              <a-form-item label="Aspect Ratio">
                <a-select v-model:value="bannerRatio">
                  <a-select-option value="3:2">3:2 (Widescreen)</a-select-option>
                  <a-select-option value="1:1">1:1 (Ultra Wide)</a-select-option>
                  <a-select-option value="2:3">2:3 (Standard)</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>

            <a-button type="primary" block style="margin-top: 16px;" @click="nextStep" :disabled="!bannerImage || !bannerId">
              Next: Add Masks →
            </a-button>
          </div>

          <!-- Step 2: Add Masks -->
          <div v-if="currentStep === 1" class="step-content">
            <h4>2. Create Mask Layers</h4>
            <a-alert message="Draw areas where products will appear. Each mask = one product slot." type="info" show-icon style="margin-bottom: 16px; font-size: 11px;" />

            <a-button type="primary" block style="margin-bottom: 12px;" @click="addMaskSquare">
              + Add Mask Area
            </a-button>

            <div v-if="maskSquares.length === 0" style="text-align: center; padding: 20px; color: #999;">
              <p style="margin: 0;">No mask areas yet</p>
              <small>Add masks for product placement</small>
            </div>

            <div v-else class="masks-list">
              <div v-for="(mask, idx) in maskSquares" :key="idx" class="mask-item" @click="selectMask(idx)" :class="{ active: selectedMaskIdx === idx }">
                <div style="flex: 1;">
                  <strong>Mask {{ idx + 1 }}</strong>
                  <small style="display: block; color: #666; margin-top: 2px;">{{ Math.round(mask.width) }}×{{ Math.round(mask.height) }}px</small>
                </div>
                <a-button type="text" danger size="small" @click.stop="deleteMask(idx)">Remove</a-button>
              </div>
            </div>

            <div v-if="selectedMaskIdx !== null" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e0e0e0;">
              <h5 style="margin: 0 0 12px 0;">Edit Mask {{ selectedMaskIdx + 1 }}</h5>
              <a-form layout="vertical" size="small">
                <a-form-item label="Width (px)">
                  <a-slider v-model:value="maskSquares[selectedMaskIdx].width" :min="50" :max="1000" @change="updateCanvas" />
                </a-form-item>
                <a-form-item label="Height (px)">
                  <a-slider v-model:value="maskSquares[selectedMaskIdx].height" :min="50" :max="600" @change="updateCanvas" />
                </a-form-item>
                <a-form-item label="Rounded Corners (px)">
                  <a-slider v-model:value="maskSquares[selectedMaskIdx].borderRadius" :min="0" :max="50" @change="updateCanvas" />
                </a-form-item>
              </a-form>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 20px;">
              <a-button @click="currentStep = 0" style="flex: 1;">← Back</a-button>
              <a-button type="primary" block style="flex: 1;" @click="nextStep" :disabled="maskSquares.length === 0">
                Next: Add Text →
              </a-button>
            </div>
          </div>

          <!-- Step 3: Add Text -->
          <div v-if="currentStep === 2" class="step-content">
            <h4>3. Add Text Elements</h4>
            <a-alert message="Drag text on canvas to reposition" type="info" show-icon style="margin-bottom: 16px; font-size: 11px;" />
            
            <a-button type="primary" block style="margin-bottom: 12px;" @click="addText">
              + Add Text
            </a-button>

            <div v-if="textElements.length === 0" style="text-align: center; padding: 20px; color: #999;">
              <p style="margin: 0;">No text yet</p>
              <small>Add text to continue</small>
            </div>

            <div v-else class="texts-list">
              <div v-for="(text, idx) in textElements" :key="idx" class="text-item" @click="selectText(idx)" :class="{ active: selectedTextIdx === idx }">
                <div style="flex: 1;">
                  <strong>{{ text.content || 'Text ' + (idx + 1) }}</strong>
                  <small style="display: block; color: #666; margin-top: 2px;">{{ text.fontSize }}px • {{ text.fontFamily }}</small>
                </div>
                <a-button type="text" danger size="small" @click.stop="deleteText(idx)">Remove</a-button>
              </div>
            </div>

            <div v-if="selectedTextIdx !== null" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e0e0e0;">
              <h5 style="margin: 0 0 12px 0;">Edit Text</h5>
              <a-form layout="vertical" size="small">
                <a-form-item label="Text Content">
                  <a-input v-model:value="textElements[selectedTextIdx].content" placeholder="Enter text..." @input="updateCanvas" />
                </a-form-item>
                <a-form-item label="Font Size">
                  <a-slider v-model:value="textElements[selectedTextIdx].fontSize" :min="12" :max="120" @change="updateCanvas" />
                </a-form-item>
                <a-form-item label="Font Family">
                  <a-select v-model:value="textElements[selectedTextIdx].fontFamily" @change="updateCanvas">
                    <a-select-option value="Arial">Arial</a-select-option>
                    <a-select-option value="Helvetica">Helvetica</a-select-option>
                    <a-select-option value="Times New Roman">Times New Roman</a-select-option>
                    <a-select-option value="Georgia">Georgia</a-select-option>
                    <a-select-option value="Verdana">Verdana</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="Color">
                  <input type="color" v-model="textElements[selectedTextIdx].color" @input="updateCanvas" style="width: 100%; height: 32px; cursor: pointer; border: 1px solid #d9d9d9; border-radius: 2px;" />
                </a-form-item>
                <a-form-item label="Font Weight">
                  <a-select v-model:value="textElements[selectedTextIdx].fontWeight" @change="updateCanvas">
                    <a-select-option value="normal">Normal</a-select-option>
                    <a-select-option value="bold">Bold</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 20px;">
              <a-button @click="currentStep = 1" style="flex: 1;">← Back</a-button>
              <a-button type="primary" block style="flex: 1;" @click="nextStep">
                Next: Save →
              </a-button>
            </div>
          </div>

          <!-- Step 4: Save Banner -->
          <div v-if="currentStep === 3" class="step-content">
            <h4>4. Save Banner</h4>
            <a-alert message="Review and save your banner" type="info" show-icon style="margin-bottom: 16px; font-size: 11px;" />

            <div style="background: #f5f5f5; padding: 12px; border-radius: 4px; margin-bottom: 16px;">
              <div style="font-size: 12px; margin-bottom: 6px;"><strong>Banner Summary:</strong></div>
              <div style="font-size: 11px; color: #666;">
                <div>ID: {{ bannerId }}</div>
                <div>Size: {{ canvasWidth }}×{{ canvasHeight }}px</div>
                <div>Masks: {{ maskSquares.length }}</div>
                <div>Text: {{ textElements.length }}</div>
              </div>
            </div>

            <a-button type="primary" block size="large" @click="saveBanner" :loading="isSaving" style="margin-bottom: 12px;">
              {{ isSaving ? 'Saving...' : '💾 Save Banner to Database' }}
            </a-button>

            <a-button type="dashed" block @click="downloadAllMasks" :disabled="maskSquares.length === 0">
              Download All Masks (ZIP)
            </a-button>

            <div style="display: flex; gap: 8px; margin-top: 16px;">
              <a-button @click="currentStep = 2" style="flex: 1;">← Back</a-button>
              <a-button @click="resetForm" style="flex: 1;">Start Over</a-button>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- Right Side - Canvas Preview -->
      <a-col :span="18">
        <a-card title="Preview" size="small">
          <div class="canvas-wrapper">
            <canvas 
              ref="canvas" 
              @mousedown="handleMouseDown"
              @mousemove="handleMouseMove"
              @mouseup="handleMouseUp"
              @mouseleave="handleMouseUp"
              :style="{
                cursor: isDraggingText ? 'grabbing' : isDraggingMask ? 'move' : 'crosshair',
                border: '2px solid #ddd',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }"
            ></canvas>
          </div>

          <div style="margin-top: 12px; font-size: 11px; color: #666;">
            <span v-if="bannerImage">Canvas: {{ canvasWidth }}×{{ canvasHeight }}px ({{ displayRatio }})</span>
            <span v-else>Upload banner to start</span>
            <span v-if="selectedTextIdx !== null" style="margin-left: 16px; color: #1890ff;">
              💡 Drag text on canvas to reposition
            </span>
          </div>
        </a-card>

        <!-- Saved Banners List -->
        <a-card title="Saved Banners" size="small" style="margin-top: 16px;">
          <a-spin :spinning="loadingBanners">
            <a-empty v-if="bannersList.length === 0" description="No banners saved yet" />
            <a-list v-else :data-source="bannersList" :bordered="false">
              <template #renderItem="{ item }">
                <a-list-item>
                  <div style="display: flex; justify-content: space-between; width: 100%;">
                    <div>
                      <strong>{{ item.banner_id }}</strong>
                      <p style="margin: 4px 0 0 0; font-size: 11px; color: #666;">
                        {{ item.ratio }} • {{ item.binary_masks_count }} masks • {{ item.text_data?.length || 0 }} text
                      </p>
                    </div>
                    <a-space>
                      <a-button type="text" size="small" @click="editBanner(item.banner_id)">Edit</a-button>
                      <a-button type="text" danger size="small" @click="deleteBannerRecord(item.banner_id)">Delete</a-button>
                    </a-space>
                  </div>
                </a-list-item>
              </template>
            </a-list>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'BannerEditor',
  data() {
    return {
      currentStep: 0,
      bannerId: '',
      bannerRatio: '3:2',
      bannerImage: null,
      canvasWidth: 1000,
      canvasHeight: 400,
      displayWidth: 1000,
      displayHeight: 400,
      scaleRatio: 1,
      displayRatio: '3:2',

      maskSquares: [],
      selectedMaskIdx: null,
      isDraggingMask: false,
      dragOffset: { x: 0, y: 0 },

      textElements: [],
      selectedTextIdx: null,
      isDraggingText: false,
      draggedTextIdx: null,

      isDrawing: false,
      isSaving: false,
      loadingBanners: false,
      bannersList: [],
    };
  },

  mounted() {
    this.initCanvas();
    this.fetchBannerList();
    window.addEventListener('resize', this.initCanvas);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.initCanvas);
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas;
      if (!canvas || !this.bannerImage) return;

      const container = canvas.parentElement;
      const maxWidth = container.clientWidth - 40;
      const maxHeight = 500;

      const scaleX = maxWidth / this.canvasWidth;
      const scaleY = maxHeight / this.canvasHeight;
      this.scaleRatio = Math.min(scaleX, scaleY, 1.5);

      this.displayWidth = Math.round(this.canvasWidth * this.scaleRatio);
      this.displayHeight = Math.round(this.canvasHeight * this.scaleRatio);

      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      canvas.style.width = this.displayWidth + 'px';
      canvas.style.height = this.displayHeight + 'px';

      this.updateCanvas();
    },

    handleBannerUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          this.bannerImage = img;
          this.canvasWidth = img.width;
          this.canvasHeight = img.height;
          this.$nextTick(() => this.initCanvas());
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },

    nextStep() {
      if (this.currentStep < 3) this.currentStep++;
    },

    addMaskSquare() {
      this.maskSquares.push({
        x: this.canvasWidth / 2 - 100,
        y: this.canvasHeight / 2 - 75,
        width: 200,
        height: 150,
        borderRadius: 0
      });
      this.selectedMaskIdx = this.maskSquares.length - 1;
      this.updateCanvas();
    },

    selectMask(idx) {
      this.selectedMaskIdx = this.selectedMaskIdx === idx ? null : idx;
      this.selectedTextIdx = null;
    },

    deleteMask(idx) {
      this.maskSquares.splice(idx, 1);
      if (this.selectedMaskIdx === idx) this.selectedMaskIdx = null;
      this.updateCanvas();
    },

    addText() {
      this.textElements.push({
        content: 'New Text',
        x: this.canvasWidth / 2,
        y: this.canvasHeight / 2,
        fontSize: 48,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        color: '#000000'
      });
      this.selectedTextIdx = this.textElements.length - 1;
      this.selectedMaskIdx = null;
      this.updateCanvas();
    },

    selectText(idx) {
      this.selectedTextIdx = this.selectedTextIdx === idx ? null : idx;
      this.selectedMaskIdx = null;
    },

    deleteText(idx) {
      this.textElements.splice(idx, 1);
      if (this.selectedTextIdx === idx) this.selectedTextIdx = null;
      this.updateCanvas();
    },

    handleMouseDown(e) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / this.scaleRatio;
      const y = (e.clientY - rect.top) / this.scaleRatio;

      // Check if clicking on text first (text has priority)
      for (let i = this.textElements.length - 1; i >= 0; i--) {
        const text = this.textElements[i];
        const ctx = this.$refs.canvas.getContext('2d');
        ctx.font = `${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
        const metrics = ctx.measureText(text.content);
        
        const textWidth = metrics.width;
        const textHeight = text.fontSize;
        const textLeft = text.x - textWidth / 2;
        const textTop = text.y - textHeight;
        
        if (x >= textLeft && x <= textLeft + textWidth && 
            y >= textTop && y <= textTop + textHeight) {
          this.selectedTextIdx = i;
          this.selectedMaskIdx = null;
          this.isDraggingText = true;
          this.draggedTextIdx = i;
          this.dragOffset = { x: x - text.x, y: y - text.y };
          this.updateCanvas();
          return;
        }
      }

      // Then check masks
      for (let i = this.maskSquares.length - 1; i >= 0; i--) {
        const m = this.maskSquares[i];
        if (x >= m.x && x <= m.x + m.width && y >= m.y && y <= m.y + m.height) {
          this.selectedMaskIdx = i;
          this.selectedTextIdx = null;
          this.isDraggingMask = true;
          this.dragOffset = { x: x - m.x, y: y - m.y };
          this.updateCanvas();
          return;
        }
      }
    },

    handleMouseMove(e) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / this.scaleRatio;   
      const y = (e.clientY - rect.top) / this.scaleRatio;

      if (this.isDraggingText && this.draggedTextIdx !== null) {
        const text = this.textElements[this.draggedTextIdx];
        text.x = x - this.dragOffset.x;
        text.y = y - this.dragOffset.y;
        this.updateCanvas();
      } else if (this.isDraggingMask && this.selectedMaskIdx !== null) {
        const m = this.maskSquares[this.selectedMaskIdx];
        m.x = Math.max(0, Math.min(x - this.dragOffset.x, this.canvasWidth - m.width));
        m.y = Math.max(0, Math.min(y - this.dragOffset.y, this.canvasHeight - m.height));
        this.updateCanvas();
      }
    },

    handleMouseUp() {
      this.isDraggingMask = false;
      this.isDraggingText = false;
      this.draggedTextIdx = null;
    },

    updateCanvas() {
      const canvas = this.$refs.canvas;
      if (!canvas || !this.bannerImage) return;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw banner
      ctx.drawImage(this.bannerImage, 0, 0, canvas.width, canvas.height);

      // Draw masks
      this.maskSquares.forEach((mask, idx) => {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.strokeStyle = this.selectedMaskIdx === idx ? '#00ff00' : '#ff0000';
        ctx.lineWidth = this.selectedMaskIdx === idx ? 3 : 2;

        ctx.beginPath();
        ctx.moveTo(mask.x + mask.borderRadius, mask.y);
        ctx.lineTo(mask.x + mask.width - mask.borderRadius, mask.y);
        ctx.quadraticCurveTo(mask.x + mask.width, mask.y, mask.x + mask.width, mask.y + mask.borderRadius);
        ctx.lineTo(mask.x + mask.width, mask.y + mask.height - mask.borderRadius);
        ctx.quadraticCurveTo(mask.x + mask.width, mask.y + mask.height, mask.x + mask.width - mask.borderRadius, mask.y + mask.height);
        ctx.lineTo(mask.x + mask.borderRadius, mask.y + mask.height);
        ctx.quadraticCurveTo(mask.x, mask.y + mask.height, mask.x, mask.y + mask.height - mask.borderRadius);
        ctx.lineTo(mask.x, mask.y + mask.borderRadius);
        ctx.quadraticCurveTo(mask.x, mask.y, mask.x + mask.borderRadius, mask.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw mask number
        ctx.fillStyle = this.selectedMaskIdx === idx ? '#00ff00' : '#ff0000';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`M${idx + 1}`, mask.x + 5, mask.y + 20);
      });

      // Draw text
      this.textElements.forEach((text, idx) => {
        ctx.font = `${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
        ctx.fillStyle = text.color;
        ctx.textAlign = 'center';
        ctx.fillText(text.content, text.x, text.y);

        if (this.selectedTextIdx === idx) {
          const metrics = ctx.measureText(text.content);
          ctx.strokeStyle = '#0066ff';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(text.x - metrics.width / 2 - 5, text.y - text.fontSize - 5, metrics.width + 10, text.fontSize + 10);
          ctx.setLineDash([]);
        }
      });
    },

    async downloadAllMasks() {
      // Download individual masks for verification
      for (let i = 0; i < this.maskSquares.length; i++) {
        const canvas = this.createMaskCanvas(i);
        const link = document.createElement('a');
        link.download = `${this.bannerId}_mask_${i + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    },

    createMaskCanvas(maskIndex) {
      const mask = this.maskSquares[maskIndex];
      const canvas = document.createElement('canvas');
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      const ctx = canvas.getContext('2d');

      // Black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // White mask for this specific mask only
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(mask.x + mask.borderRadius, mask.y);
      ctx.lineTo(mask.x + mask.width - mask.borderRadius, mask.y);
      ctx.quadraticCurveTo(mask.x + mask.width, mask.y, mask.x + mask.width, mask.y + mask.borderRadius);
      ctx.lineTo(mask.x + mask.width, mask.y + mask.height - mask.borderRadius);
      ctx.quadraticCurveTo(mask.x + mask.width, mask.y + mask.height, mask.x + mask.width - mask.borderRadius, mask.y + mask.height);
      ctx.lineTo(mask.x + mask.borderRadius, mask.y + mask.height);
      ctx.quadraticCurveTo(mask.x, mask.y + mask.height, mask.x, mask.y + mask.height - mask.borderRadius);
      ctx.lineTo(mask.x, mask.y + mask.borderRadius);
      ctx.quadraticCurveTo(mask.x, mask.y, mask.x + mask.borderRadius, mask.y);
      ctx.closePath();
      ctx.fill();

      return canvas;
    },

    async saveBanner() {
      if (!this.bannerId || !this.bannerImage) {
        this.$message.error('Please complete all required fields');
        return;
      }

      this.isSaving = true;

      try {
        // Convert banner image to blob
        const bannerBlob = await this.canvasToBlob(this.bannerImage);
        const bannerFile = new File([bannerBlob], `${this.bannerId}.png`, { type: 'image/png' });

        // Prepare form data
        const formData = new FormData();
        formData.append('banner_id', this.bannerId);
        formData.append('ratio', this.bannerRatio);
        formData.append('is_active', 'true');
        formData.append('banner_image', bannerFile);
        formData.append('text_data', JSON.stringify(this.textElements));

        // Create banner first
        const createResponse = await fetch(
          `${this.$store.state.root_api}generate_banner/api/banner/create/`,
          {
            method: 'POST',
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` },
            body: formData
          }
        );

        const createData = await createResponse.json();

        if (!createData.success) {
          throw new Error(createData.message || 'Failed to create banner');
        }

        // Now add each mask separately
        if (this.maskSquares.length > 0) {
          for (let i = 0; i < this.maskSquares.length; i++) {
            const maskCanvas = this.createMaskCanvas(i);
            const maskDataUrl = maskCanvas.toDataURL('image/png');
            
            const maskResponse = await fetch(
              `${this.$store.state.root_api}generate_banner/api/banner/${this.bannerId}/add-mask/`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                  image: maskDataUrl, 
                  order: i 
                })
              }
            );

            const maskData = await maskResponse.json();
            if (!maskData.success) {
              console.error(`Failed to add mask ${i + 1}:`, maskData.message);
            }
          }
        }

        this.$message.success(`Banner saved with ${this.maskSquares.length} masks!`);
        await this.fetchBannerList();
        this.resetForm();
      } catch (error) {
        console.error('Error:', error);
        this.$message.error(error.message || 'Failed to save banner');
      } finally {
        this.isSaving = false;
      }
    },

    async canvasToBlob(img) {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(resolve, 'image/png');
      });
    },

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
        if (data.success) {
          this.bannersList = data.data;
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        this.loadingBanners = false;
      }
    },

    async deleteBannerRecord(bannerId) {
      this.$confirm({
        title: 'Delete Banner',
        content: `Delete "${bannerId}" and all its masks?`,
        onOk: async () => {
          try {
            await fetch(
              `${this.$store.state.root_api}generate_banner/api/banner/${bannerId}/delete/`,
              {
                method: 'DELETE',
                headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
              }
            );
            this.$message.success('Banner deleted');
            await this.fetchBannerList();
          } catch (error) {
            this.$message.error('Failed to delete banner');
          }
        }
      });
    },

    async editBanner(bannerId) {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}generate_banner/api/banner/${bannerId}/`,
          {
            method: 'GET',
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
          }
        );

        const data = await response.json();
        if (data.success) {
          this.$message.info('Edit feature: Load banner data to edit');
          // TODO: Implement edit functionality
          // You can populate the form with data.data
        }
      } catch (error) {
        this.$message.error('Failed to load banner');
      }
    },

    resetForm() {
      this.currentStep = 0;
      this.bannerId = '';
      this.bannerImage = null;
      this.maskSquares = [];
      this.textElements = [];
      this.selectedMaskIdx = null;
      this.selectedTextIdx = null;
      this.updateCanvas();
    }
  }
};
</script>

<style scoped>
.banner-editor {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.sticky-card {
  position: sticky;
  top: 20px;
}

.step-content {
  padding: 4px;
}

.upload-zone {
  width: 100%;
  height: 160px;
  border: 3px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  background: #f9fafb;
  position: relative;
}

.upload-zone:hover {
  border-color: #667eea;
  background: #eef2ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.upload-zone.has-image {
  border-color: #10b981;
  border-style: solid;
}

.canvas-wrapper {
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: auto;
  min-height: 500px;
  max-height: 85vh;
  width: 100%;
}

canvas {
  max-width: 100%;
  height: auto;
}

.masks-list,
.texts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
  padding: 2px;
}

.mask-item,
.text-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 4px;
  background: #f9f9f9;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.mask-item:hover,
.text-item:hover {
  background: #f0f0f0;
  border-color: #d0d0d0;
  transform: translateX(4px);
}

.mask-item.active,
.text-item.active {
  background: #e6f7ff;
  border-color: #0066ff;
  box-shadow: 0 2px 8px rgba(0, 102, 255, 0.2);
}

.masks-list::-webkit-scrollbar,
.texts-list::-webkit-scrollbar {
  width: 6px;
}

.masks-list::-webkit-scrollbar-track,
.texts-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.masks-list::-webkit-scrollbar-thumb,
.texts-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.masks-list::-webkit-scrollbar-thumb:hover,
.texts-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>