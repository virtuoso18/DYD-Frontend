<template>
  <a-modal 
    v-model:open="localDrawRemovalModal" 
    title="Object Removal Tool" 
    width="90%"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <template #footer>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <!-- Mode Toggle -->
          <div class="mode-toggle">
            <span style="margin-right: 8px; font-weight: 500; font-size: 12px;">Mode:</span>
            <a-radio-group v-model:value="removalMode" button-style="solid" :disabled="isProcessing" size="small">
              <a-radio-button value="draw">
                <span>✏️ Draw</span>
              </a-radio-button>
              <a-radio-button value="sam2">
                <span>🎯 SAM-2</span>
              </a-radio-button>
               <a-radio-button value="sam3">
                <span>🎯 SAM-3</span>
              </a-radio-button>
            </a-radio-group>
          </div>

          <!-- Drawing Controls -->
          <template v-if="removalMode === 'draw'">
            <a-button @click="clearDrawing" :disabled="isProcessing" size="small">
              <template #icon><span>🗑️</span></template>
              Clear
            </a-button>
            <a-button @click="undoLastStroke" :disabled="drawingHistory.length === 0 || isProcessing" size="small">
              <template #icon><span>↶</span></template>
              Undo
            </a-button>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 12px; color: #666;">Brush:</span>
              <a-slider 
                v-model:value="brushSize" 
                :min="5" 
                :max="100" 
                :step="5"
                style="width: 120px;"
                :disabled="isProcessing"
              />
              <span style="font-size: 12px; color: #666; min-width: 40px;">{{ brushSize }}px</span>
            </div>
          </template>

          <!-- SAM-2 Controls -->
          <template v-if="removalMode === 'sam2'">
            <a-button @click="clearSAMPoints" :disabled="isProcessing || samPoints.length === 0" size="small">
              <template #icon><span>🗑️</span></template>
              Clear ({{ samPoints.length }})
            </a-button>
            <a-button @click="undoLastSAMPoint" :disabled="samPoints.length === 0 || isProcessing" size="small">
              <template #icon><span>↶</span></template>
              Undo
            </a-button>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span style="font-size: 12px; color: #666;">Confidence:</span>
              <a-slider 
                v-model:value="samConfidence" 
                :min="0" 
                :max="1" 
                :step="0.05"
                style="width: 120px;"
                :disabled="isProcessing"
              />
              <span style="font-size: 12px; color: #666; min-width: 40px;">{{ samConfidence.toFixed(2) }}</span>
            </div>
            <a-button 
              @click="fetchSAMMask" 
              :loading="isFetchingSAMMask"
              :disabled="samPoints.length === 0 || isProcessing"
              type="primary"
              size="small"
            >
              <template #icon><span>🎯</span></template>
              Detect
            </a-button>
          </template>


        <template v-if="removalMode === 'sam3'">
  <a-button @click="clearSAM3Masks" :disabled="isProcessing || !sam3MasksList || sam3MasksList.length === 0" size="small">
    <template #icon><span>🗑️</span></template>
    Clear ({{ sam3MasksList ? sam3MasksList.length : 0 }})
  </a-button>
  <a-button @click="undoLastSAM3Mask" :disabled="!sam3MasksList || sam3MasksList.length === 0 || isProcessing" size="small">
    <template #icon><span>↶</span></template>
    Undo
  </a-button>
  <div style="display: flex; gap: 8px; align-items: center;">
    <span style="font-size: 12px; color: #666;">Confidence:</span>
    <a-slider 
      v-model:value="samConfidence" 
      :min="0" 
      :max="1" 
      :step="0.05"
      style="width: 120px;"
      :disabled="isProcessing"
    />
    <span style="font-size: 12px; color: #666; min-width: 40px;">{{ samConfidence.toFixed(2) }}</span>
  </div>
  <div style="display: flex; gap: 8px; align-items: center;">
    <span style="font-size: 12px; color: #666;">Object</span>
    <a-input placeholder="type the object name here" v-model:value="sam3_text_prompt" style="width:100%"></a-input>
  </div>
  <a-button 
    @click="fetchSAM3Mask" 
    :loading="isFetchingSAMMask"
    :disabled="sam3_text_prompt.length===0 || isProcessing"
    type="primary"
    size="small"
  >
    <template #icon><span>🎯</span></template>
    Detect
  </a-button>
</template>
        </div>

        <div style="display: flex; gap: 10px;">
          <a-button @click="handleCancel" :disabled="isProcessing">Cancel</a-button>
          <a-button 
            type="primary" 
            @click="handleSubmit" 
            :loading="isProcessing"
            :disabled="!hasValidMask">
            Remove Area
          </a-button>
        </div>
      </div>
    </template>
    
    <div class="draw-removal-container">
      <!-- Instructions -->
      <div class="instructions-banner" :class="removalMode">
        <div class="instruction-content">
          <span class="mode-icon">{{ removalMode === 'sam2' ? '🎯' : '✏️' }}</span>
          <div class="instruction-text">
            <strong v-if="removalMode === 'draw'">Draw Mode:</strong>
            <strong v-else>SAM-2 Mode:</strong>
            <span v-if="removalMode === 'draw'">
              Paint over the areas you want to remove from the image
            </span>
            <span v-else>
              Click points on the object to segment it automatically
            </span>
          </div>
        </div>
        <div class="status-indicator">
          <span v-if="removalMode === 'sam2'">
            {{ samPoints.length }} point{{ samPoints.length !== 1 ? 's' : '' }} 
            <span v-if="samMaskGenerated" style="color: #4CAF50;">● Detected</span>
            <span v-else style="color: #ff9800;">○ Ready</span>
          </span>
          <span v-else>
            {{ drawingHistory.length }} stroke{{ drawingHistory.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <!-- Canvas Container -->
      <div class="canvas-wrapper" ref="canvasWrapper">
        <div class="canvas-overlay">
          <canvas
            ref="drawCanvas"
            @mousedown="handleCanvasMouseDown"
            @mousemove="handleCanvasMouseMove"
            @mouseup="handleCanvasMouseUp"
            @mouseleave="handleCanvasMouseLeave"
            @click="handleCanvasClick"
            :style="{ cursor: getCursorStyle() }"
          ></canvas>
          
          <!-- Custom cursor for drawing mode -->
          <div 
            v-if="showCursor && removalMode === 'draw'" 
            class="custom-cursor"
            :style="{
              left: cursorX + 'px',
              top: cursorY + 'px',
              width: (brushSize * displayScale) + 'px',
              height: (brushSize * displayScale) + 'px',
            }"
          ></div>

          <!-- SAM-2 point indicators -->
          <div 
            v-for="(point, index) in samPoints" 
            :key="'sam-point-' + index"
            class="sam-point-indicator"
            :class="{ 'point-active': index === samPoints.length - 1 }"
            :style="{
              left: point.displayX + 'px',
              top: point.displayY + 'px',
            }"
          >
            <span class="point-number">{{ index + 1 }}</span>
          </div>
        </div>
      </div>

      <!-- Processing Indicator -->
      <div v-if="isProcessing || isFetchingSAMMask" class="processing-overlay">
        <a-spin size="large" />
        <p>{{ isFetchingSAMMask ? 'Generating SAM mask...' : 'Processing removal request...' }}</p>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'DrawRemovalModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    baseImage: {
      type: String,
      required: true
    },
    roomId: {
      type: String,
      required: true
    }
  },
  
  data() {
    return {
      localDrawRemovalModal: false,
      removalMode: 'draw',
      
      canvas: null,
      ctx: null,
      baseImg: null,
      
      isDrawing: false,
      isProcessing: false,
      isFetchingSAMMask: false,
      
      
      brushSize: 20,
      brushColor: 'rgba(255, 0, 0, 0.6)',
      
      // Display scale factor
      displayScale: 1,
      
      // Drawing history
      drawingHistory: [],
      currentStroke: [],
      
      // SAM-2 state
      samPoints: [],
      samMask: null,
      samMaskGenerated: false,
      samConfidence: 0.8,

      sam3_text_prompt:'',
      sam3MasksList: [],           // New: store list of mask paths
      sam3CurrentMaskIndex: 0,      // New: track current mask index
      // Custom cursor
      showCursor: false,
      cursorX: 0,
      cursorY: 0
    }
  },
  
  computed: {
    hasValidMask() {
      if (this.removalMode === 'draw') {
        return this.drawingHistory.length > 0;
      } else {
        return this.samMaskGenerated && this.samMask !== null;
      }
    }
  },
  
  watch: {
    visible: {
      handler(newVal) {
        this.localDrawRemovalModal = newVal;
        if (newVal) {
          this.$nextTick(() => {
            this.initializeCanvas();
          });
        }
      },
      immediate: true
    },
    
    localDrawRemovalModal(newVal) {
      if (!newVal) {
        this.$emit('update:visible', false);
      }
    },
    
    baseImage: {
      handler() {
        if (this.localDrawRemovalModal) {
          this.loadBaseImage();
        }
      }
    },
    
    removalMode(newVal) {
      if (newVal === 'sam2') {
        this.clearDrawing();
      } else {
        this.clearSAMPoints();
      }
      this.redrawCanvas();
    }
  },
  
  methods: {
    async initializeCanvas() {
      this.canvas = this.$refs.drawCanvas;
      if (!this.canvas) {
        console.error('Canvas element not found');
        return;
      }
      
      this.ctx = this.canvas.getContext('2d');
      await this.loadBaseImage();
    },
    
    async loadBaseImage() {
      if (!this.baseImage || !this.ctx) return;
      
      try {
        this.baseImg = await this.createImageFromSrc(this.baseImage);
        this.setupCanvas();
        this.drawBaseImage();
      } catch (error) {
        console.error('Error loading base image:', error);
        this.$message.error('Failed to load image');
      }
    },
    
    createImageFromSrc(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
      });
    },
    
    setupCanvas() {
      if (!this.baseImg || !this.canvas) return;
      
      // Set canvas to EXACT image dimensions
      this.canvas.width = this.baseImg.width;
      this.canvas.height = this.baseImg.height;
      
      // Calculate display scale
      const wrapper = this.$refs.canvasWrapper;
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        const maxWidth = rect.width - 40;
        const maxHeight = rect.height - 40;
        
        const scaleX = maxWidth / this.baseImg.width;
        const scaleY = maxHeight / this.baseImg.height;
        this.displayScale = Math.min(scaleX, scaleY, 1);
        
        // Set canvas display size
        this.canvas.style.width = (this.baseImg.width * this.displayScale) + 'px';
        this.canvas.style.height = (this.baseImg.height * this.displayScale) + 'px';
      }
      
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    },
    
    drawBaseImage() {
      if (!this.baseImg || !this.ctx) return;
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw image at full resolution
      this.ctx.drawImage(this.baseImg, 0, 0, this.canvas.width, this.canvas.height);
      
      // Redraw overlays
      if (this.removalMode === 'draw') {
        this.redrawAllStrokes();
      } else if (this.removalMode === 'sam2' && this.samMaskGenerated) {
        this.drawSAMMask();
      }
    },
    
    getCanvasCoordinates(e) {
      const rect = this.canvas.getBoundingClientRect();
      
      // Get click position relative to canvas display
      const displayX = e.clientX - rect.left;
      const displayY = e.clientY - rect.top;
      
      // Convert to canvas coordinates (accounting for display scale)
      const canvasX = displayX / this.displayScale;
      const canvasY = displayY / this.displayScale;
      
      return { 
        canvasX: Math.round(canvasX), 
        canvasY: Math.round(canvasY),
        displayX,
        displayY
      };
    },
    
    getCursorStyle() {
      if (this.isProcessing || this.isFetchingSAMMask) return 'wait';
      if (this.removalMode === 'draw') return this.isDrawing ? 'none' : 'crosshair';
      if (this.removalMode === 'sam2') return 'pointer';
      return 'default';
    },
    
    // ==================== DRAWING MODE ====================
    
    handleCanvasMouseDown(e) {
      if (this.removalMode === 'draw') {
        this.startDrawing(e);
      }
    },
    
    handleCanvasMouseMove(e) {
      const { displayX, displayY, canvasX, canvasY } = this.getCanvasCoordinates(e);
      
      if (this.removalMode === 'draw') {
        this.cursorX = displayX;
        this.cursorY = displayY;
        this.showCursor = canvasX >= 0 && canvasX < this.canvas.width && 
                         canvasY >= 0 && canvasY < this.canvas.height;
        
        if (this.isDrawing) {
          this.draw(e);
        }
      }
    },
    
    handleCanvasMouseUp() {
      if (this.removalMode === 'draw') {
        this.stopDrawing();
      }
    },
    
    handleCanvasMouseLeave() {
      if (this.removalMode === 'draw') {
        this.stopDrawing();
        this.showCursor = false;
      }
    },
    
    handleCanvasClick(e) {
      if (this.removalMode === 'sam2') {
        this.addSAMPoint(e);
      }
    },
    
    startDrawing(e) {
      if (this.isProcessing) return;
      
      const { canvasX, canvasY } = this.getCanvasCoordinates(e);
      
      if (canvasX < 0 || canvasX >= this.canvas.width || 
          canvasY < 0 || canvasY >= this.canvas.height) return;
      
      this.isDrawing = true;
      this.currentStroke = [];
      this.currentStroke.push({ x: canvasX, y: canvasY });
      
      this.ctx.beginPath();
      this.ctx.moveTo(canvasX, canvasY);
    },
    
    draw(e) {
      if (!this.isDrawing || this.isProcessing) return;
      
      const { canvasX, canvasY } = this.getCanvasCoordinates(e);
      
      if (canvasX < 0 || canvasX >= this.canvas.width || 
          canvasY < 0 || canvasY >= this.canvas.height) {
        this.stopDrawing();
        return;
      }
      
      this.currentStroke.push({ x: canvasX, y: canvasY });
      
      this.ctx.strokeStyle = this.brushColor;
      this.ctx.lineWidth = this.brushSize;
      this.ctx.lineTo(canvasX, canvasY);
      this.ctx.stroke();
    },
    
    stopDrawing() {
      if (this.isDrawing && this.currentStroke.length > 0) {
        this.drawingHistory.push({
          points: [...this.currentStroke],
          brushSize: this.brushSize,
          brushColor: this.brushColor
        });
        this.currentStroke = [];
      }
      this.isDrawing = false;
    },
    
    clearDrawing() {
      this.drawingHistory = [];
      this.currentStroke = [];
      this.redrawCanvas();
    },
    
    undoLastStroke() {
      if (this.drawingHistory.length > 0) {
        this.drawingHistory.pop();
        this.redrawCanvas();
      }
    },
    
    redrawAllStrokes() {
      this.drawingHistory.forEach(stroke => {
        if (stroke.points.length === 0) return;
        
        this.ctx.strokeStyle = stroke.brushColor;
        this.ctx.lineWidth = stroke.brushSize;
        this.ctx.beginPath();
        this.ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        
        stroke.points.forEach(point => {
          this.ctx.lineTo(point.x, point.y);
        });
        
        this.ctx.stroke();
      });
    },
    
    // ==================== SAM-2 MODE ====================
    
    addSAMPoint(e) {
      if (this.isProcessing || this.isFetchingSAMMask) return;
      
      const { canvasX, canvasY, displayX, displayY } = this.getCanvasCoordinates(e);
      
      if (canvasX < 0 || canvasX >= this.canvas.width || 
          canvasY < 0 || canvasY >= this.canvas.height) return;
      
      this.samPoints.push({
        x: canvasX,
        y: canvasY,
        displayX: displayX,
        displayY: displayY
      });
      
      // Clear previous mask
      this.samMaskGenerated = false;
      this.samMask = null;
      
      console.log(`SAM Point ${this.samPoints.length}: Canvas(${canvasX},${canvasY}) Display(${displayX.toFixed(1)},${displayY.toFixed(1)})`);
      
      this.$message.info(`Point ${this.samPoints.length} added at (${canvasX}, ${canvasY})`);
    },
    
    clearSAMPoints() {
      this.samPoints = [];
      this.samMask = null;
      this.samMaskGenerated = false;
      this.redrawCanvas();
    },
    
    undoLastSAMPoint() {
      if (this.samPoints.length > 0) {
        this.samPoints.pop();
        this.samMaskGenerated = false;
        this.samMask = null;
        this.redrawCanvas();
      }
    },
    
    async fetchSAMMask() {
      if (this.samPoints.length === 0 || this.isFetchingSAMMask) return;
      
      this.isFetchingSAMMask = true;
      
      try {
        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = this.baseImg.width;
        imageCanvas.height = this.baseImg.height;
        const imageCtx = imageCanvas.getContext('2d');
        imageCtx.drawImage(this.baseImg, 0, 0);
        const imageBase64 = imageCanvas.toDataURL('image/png');
        
        const apiEndpoint = this.$store?.state?.root_api || '';
        const url = `${apiEndpoint}engine/sam2-segment/`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            room_id: this.roomId,
            image_base64: imageBase64,
            points: this.samPoints.map(p => ({ x: p.x, y: p.y })),
            confidence: this.samConfidence,
            image_dimensions: {
              width: this.baseImg.width,
              height: this.baseImg.height
            }
          })
        });
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.mask_base64) {
          this.samMask = result.mask_base64;
          this.samMaskGenerated = true;
          await this.drawSAMMask();
          this.$message.success('Mask generated successfully!');
        } else {
          throw new Error(result.message || 'Failed to generate mask');
        }
        
      } catch (error) {
        console.error('SAM-2 segmentation failed:', error);
        this.$message.error('Failed to generate SAM-2 mask. Please try again.');
      } finally {
        this.isFetchingSAMMask = false;
      }
    },
    
async fetchSAM3Mask() {
  this.isFetchingSAMMask = true;
  
  try {
    const apiEndpoint = this.$store?.state?.root_api || '';
    const url = `${apiEndpoint}engine/sam3-segment/`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        room_id: this.roomId,
        confidence: this.samConfidence,
        text_prompt: this.sam3_text_prompt,
      })
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.binary_masks_list && result.binary_masks_list.length > 0) {
      // Store all masks
      this.sam3MasksList = result.binary_masks_list;
      
      // Load all mask images and combine them
      this.samMask = await this.loadAndCombineAllMasks(apiEndpoint, result.binary_masks_list);
      this.samMaskGenerated = true;
      
      await this.drawSAMMask();
      this.$message.success(`Mask generated successfully! (${result.binary_masks_list.length} segmentations combined)`);
    } else {
      throw new Error(result.message || 'Failed to generate mask');
    }
    
  } catch (error) {
    console.error('SAM-3 segmentation failed:', error);
    this.$message.error('Failed to generate SAM-3 mask. Please try again.');
  } finally {
    this.isFetchingSAMMask = false;
  }
} ,

async loadImageAsBase64(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const base64 = canvas.toDataURL('image/png');
      resolve(base64);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image from URL: ${imageUrl}`));
    };
    
    img.src = imageUrl;
  });
} ,

async loadAndCombineAllMasks(apiEndpoint, maskPaths) {
  // Create a canvas to combine all masks
  const combinedCanvas = document.createElement('canvas');
  combinedCanvas.width = this.baseImg.width;
  combinedCanvas.height = this.baseImg.height;
  const combinedCtx = combinedCanvas.getContext('2d');
  
  // Initialize with black background
  combinedCtx.fillStyle = '#000000';
  combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
  
  // Load and composite each mask
  for (const maskPath of maskPaths) {
    const maskUrl = `${apiEndpoint}${maskPath}`;
    
    try {
      const maskImg = await this.createImageFromSrc(maskUrl);
      
      // Create temporary canvas for this mask
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = combinedCanvas.width;
      tempCanvas.height = combinedCanvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      // Draw mask at correct size
      tempCtx.drawImage(maskImg, 0, 0, combinedCanvas.width, combinedCanvas.height);
      
      // Get image data and composite with combined mask
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imageData.data;
      
      const combinedImageData = combinedCtx.getImageData(0, 0, combinedCanvas.width, combinedCanvas.height);
      const combinedData = combinedImageData.data;
      
      // OR operation: combine all white pixels from all masks
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 128) { // If this mask has white pixel
          combinedData[i] = 255;     // Set to white in combined
          combinedData[i + 1] = 255;
          combinedData[i + 2] = 255;
          combinedData[i + 3] = 255;
        }
      }
      
      combinedCtx.putImageData(combinedImageData, 0, 0);
      
    } catch (error) {
      console.error(`Failed to load mask: ${maskPath}`, error);
      // Continue with other masks if one fails
    }
  }
  
  // Convert combined mask to base64
  return combinedCanvas.toDataURL('image/png');
} ,

clearSAM3Masks() {
  this.sam3MasksList = [];
  this.sam3CurrentMaskIndex = 0;
  this.samMask = null;
  this.samMaskGenerated = false;
  this.sam3_text_prompt = '';
  this.redrawCanvas();
} ,

undoLastSAM3Mask() {
  if (this.sam3MasksList && this.sam3MasksList.length > 0) {
    // Remove the last mask from the list
    this.sam3MasksList.pop();
    
    if (this.sam3MasksList.length > 0) {
      // Reload and redraw remaining masks
      const apiEndpoint = this.$store?.state?.root_api || '';
      this.loadAndCombineAllMasks(apiEndpoint, this.sam3MasksList).then(combinedMask => {
        this.samMask = combinedMask;
        this.samMaskGenerated = true;
        this.drawSAMMask();
        this.$message.info(`Removed last mask. ${this.sam3MasksList.length} mask(s) remaining`);
      }).catch(error => {
        this.$message.error('Failed to update masks');
        console.error(error);
      });
    } else {
      // No masks left
      this.samMask = null;
      this.samMaskGenerated = false;
      this.redrawCanvas();
      this.$message.info('All masks cleared');
    }
  }
} ,

createImageFromSrc(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
} ,

    async drawSAMMask() {
      if (!this.samMask) return;
      
      try {
        const maskImg = await this.createImageFromSrc(this.samMask);
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.drawImage(maskImg, 0, 0, this.canvas.width, this.canvas.height);
        
        const imageData = tempCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 128) {
            data[i] = 255;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 120;
          } else {
            data[i + 3] = 0;
          }
        }
        
        tempCtx.putImageData(imageData, 0, 0);
        this.ctx.drawImage(tempCanvas, 0, 0);
        
      } catch (error) {
        console.error('Error drawing SAM mask:', error);
      }
    },
    
    // ==================== COMMON ====================
    
    redrawCanvas() {
      this.drawBaseImage();
    },
    
    async handleSubmit() {
      if (!this.hasValidMask || this.isProcessing) return;
      
      this.isProcessing = true;
      
      try {
        let maskBase64;
        
        if (this.removalMode === 'draw') {
          maskBase64 = await this.createDrawingMask();
        } else {
          maskBase64 = this.samMask;
        }
        
        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = this.baseImg.width;
        imageCanvas.height = this.baseImg.height;
        const imageCtx = imageCanvas.getContext('2d');
        imageCtx.drawImage(this.baseImg, 0, 0);
        const imageBase64 = imageCanvas.toDataURL('image/png');
        
        const requestData = {
          room_id: this.roomId,
          image_base64: imageBase64,
          mask_base64: maskBase64,
          removal_mode: this.removalMode,
          canvas_dimensions: {
            width: this.baseImg.width,
            height: this.baseImg.height
          }
        };
        
        this.$emit('submit-removal', requestData);
        await this.sendRemovalRequest(requestData);
        
      } catch (error) {
        console.error('Error submitting removal request:', error);
        this.$message.error('Failed to submit removal request');
        this.isProcessing = false;
      }
    },
    
    async createDrawingMask() {
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = this.canvas.width;
      maskCanvas.height = this.canvas.height;
      const maskCtx = maskCanvas.getContext('2d');
      
      maskCtx.fillStyle = '#000000';
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
      
      maskCtx.lineCap = 'round';
      maskCtx.lineJoin = 'round';
      
      this.drawingHistory.forEach(stroke => {
        if (stroke.points.length === 0) return;
        
        maskCtx.strokeStyle = '#FFFFFF';
        maskCtx.lineWidth = stroke.brushSize;
        maskCtx.beginPath();
        
        stroke.points.forEach((point, index) => {
          if (index === 0) {
            maskCtx.moveTo(point.x, point.y);
          } else {
            maskCtx.lineTo(point.x, point.y);
          }
        });
        
        maskCtx.stroke();
      });
      
      return maskCanvas.toDataURL('image/png');
    },
    
    async sendRemovalRequest(requestData) {
      try {
        const apiEndpoint = this.$store?.state?.root_api || '';
        const url = `${apiEndpoint}engine/remove-object/`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        
        this.$message.success('Object removed successfully!');
        this.$emit('removal-success', result);
        this.handleCancel();
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      } finally {
        this.isProcessing = false;
      }
    },
    
    handleCancel() {
      this.clearDrawing();
      this.clearSAMPoints();
      this.localDrawRemovalModal = false;
      this.$emit('update:visible', false);
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>
.draw-removal-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mode-toggle {
  display: flex;
  align-items: center;
}

.instructions-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: linear-gradient(90deg, #2a2a2a 0%, #353535 100%);
  color: #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 400;
  transition: background 0.3s ease;
  border: 1px solid #444;
}

.instructions-banner.sam2 {
  background: linear-gradient(90deg, #1a4d6d 0%, #245a7a 100%);
  border-color: #2a6b8f;
}

.instruction-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.instruction-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.instruction-text strong {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff;
}

.instruction-text span {
  font-size: 12px;
  color: #b0b0b0;
}

.mode-icon {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.status-indicator {
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 12px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
  letter-spacing: 0.3px;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 600px;
  /* background: #2a2a2a; */
  border-radius: 4px;
  overflow: auto;
  /* box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3); */
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid #444; */
}

.canvas-overlay {
  position: relative;
  display: inline-block;
}

canvas {
  display: block;
  image-rendering: crisp-edges;
}

.custom-cursor {
  position: absolute;
  border: 2px solid #ff4444;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1000;
  background: rgba(255, 68, 68, 0.15);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.sam-point-indicator {
  position: absolute;
  width: 20px;
  height: 20px;
  background: #ff4444;
  border: 2px solid white;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
}

.sam-point-indicator.point-active {
  animation: pulsePoint 1.5s ease-in-out infinite;
  background: #ff6666;
}

.point-number {
  color: white;
  font-size: 10px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

@keyframes pulsePoint {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.9;
  }
}

.processing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 30, 30, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  z-index: 100;
  border-radius: 4px;
}

.processing-overlay p {
  margin: 0;
  font-size: 16px;
  color: #e0e0e0;
  font-weight: 500;
}

:deep(.ant-modal-content) {
  background: #1a1a1a;
  color: #e0e0e0;
}

:deep(.ant-modal-header) {
  background: #2a2a2a;
  border-bottom: 1px solid #444;
}

:deep(.ant-modal-title) {
  color: #e0e0e0;
}

:deep(.ant-modal-footer) {
  background: #2a2a2a;
  border-top: 1px solid #444;
}

:deep(.ant-btn) {
  border-radius: 4px;
}

:deep(.ant-slider-track) {
  background: #1890ff;
}

:deep(.ant-slider-handle) {
  border-color: #1890ff;
}
</style>