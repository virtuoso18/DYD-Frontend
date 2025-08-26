<template>
  <div class="canvas-container" ref="canvasContainer">
    <!-- Loading Overlay -->
    <!-- <div v-if="isLoading || objectMasksLoading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">
        {{ objectMasksLoading ? `Loading furniture detection... ${objectMasksLoadingProgress}%` : 'Loading image...' }}
      </div>
      <div v-if="objectMasksLoading" class="loading-progress-bar">
        <div class="progress-fill" :style="{ width: objectMasksLoadingProgress + '%' }"></div>
      </div>
    </div> -->
    <!-- 1. ADD THIS TO YOUR TEMPLATE (replace the existing loading overlay) -->
<div v-if="isLoading || objectMasksLoading" class="scanning-loading-overlay">
  <div class="loading-screen" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="wave-overlay"></div>
    <div class="loading-text">
      <div class="process-text">Loading Room...</div>
    </div>
  </div>
</div>

    <!-- Main Canvas -->
    <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      class="main-canvas"
      :class="{ 
        'disabled': isLoading,
        'furniture-mode': true
      }"
    ></canvas>

    <!-- Hover overlay for object highlighting -->
    <canvas
      ref="overlayCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      class="overlay-canvas"
      :class="{ 'disabled': isLoading }"
      style="position: absolute; top: 0; left: 0; z-index: 2; pointer-events: none;"
    ></canvas>

    <!-- Object Selection Indicators -->
    <div 
      v-if="!isLoading && selectedObjects.length > 0" 
      class="object-indicators"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    >
      <div
        v-for="(objectKey, index) in selectedObjects"
        :key="objectKey"
        class="object-indicator"
        :style="{
          left: '20px',
          top: (20 + index * 35) + 'px'
        }"
      >
        <span class="object-name">{{ formatObjectName(objectKey) }}</span>
        <button 
          class="remove-object-btn" 
          @click="toggleObjectSelection(objectKey)"
          title="Remove selection"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Mode Indicator -->
    <!-- <div 
      v-if="!isLoading" 
      class="mode-indicator furniture-mode"
    >
      <span class="mode-text">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.59 13.83V16.13M13.79 13.83V16.13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M15.32 7.70C15.32 6.27 15.32 5.55 15.01 5.02C14.81 4.67 14.52 4.38 14.17 4.18C13.64 3.87 12.92 3.87 11.49 3.87H6.89C5.46 3.87 4.74 3.87 4.21 4.18C3.86 4.38 3.57 4.67 3.37 5.02C3.06 5.55 3.06 6.27 3.06 7.70" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M15.32 7.70C14.48 7.70 13.79 8.39 13.79 9.23V10.77C13.79 11.40 13.66 11.53 13.03 11.53H5.36C4.73 11.53 4.59 11.40 4.59 10.77V9.23C4.59 8.39 3.91 7.70 3.06 7.70C2.21 7.70 1.53 8.39 1.53 9.23C1.53 9.80 1.84 10.30 2.29 10.56V10.77C2.29 12.21 2.29 12.93 2.74 13.38C3.19 13.83 3.92 13.83 5.36 13.83H13.03C14.47 13.83 15.19 13.83 15.64 13.38C16.09 12.93 16.09 12.21 16.09 10.77V10.56C16.55 10.30 16.86 9.80 16.86 9.23C16.86 8.39 16.17 7.70 15.32 7.70Z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        Furniture Selection Mode
      </span>
      <span class="mode-hint">
        {{ objectMaskCacheReady ? 'Click on objects to select for removal' : 'Loading object detection...' }}
      </span>
    </div> -->

    <!-- Selection Controls -->
    <div v-if="!isLoading && objectMaskCacheReady " class="selection-controls">
      <button
  @click="toggleSelection"
  class="control-btn"
  :disabled="objectMaskRegions.length === 0"
>
  {{ selectedObjects.length === objectMaskRegions.length ? 'Clear Selection'+`(${selectedObjects.length})` : 'Select All' }}
</button>

      <button 
        @click="removeSelectedObjects" 
        class="control-btn remove"
        :disabled="selectedObjects.length === 0"
      >
        Remove Selected ({{ selectedObjects.length }})
      </button>
      <a-button type="primary" class="toolbar-btn primary-btn" @click="make_room_empty">
            Make room empty
          </a-button>
        <a-button type="primary" class="toolbar-btn primary-btn" @click="reset_entire_room">
            Reset room
         </a-button>
        <a-button type="primary" class="toolbar-btn primary-btn" @click="reset_entire_room">
            Detect all furniture
         </a-button>
    </div>

    <!-- Zoom Controls -->
    <div v-if="!isLoading" class="zoom-controls">
      <button @click="zoomIn" class="zoom-btn" title="Zoom In">+</button>
      <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
      <button @click="zoomOut" class="zoom-btn" title="Zoom Out">-</button>
      <button @click="resetZoomAndPan" class="zoom-btn reset-btn" title="Reset View">⌂</button>
    </div>

    <!-- Pan Instructions -->
    <div v-if="zoom > 1 && !isLoading" class="instructions">
      Click and drag to pan • Mouse wheel to zoom • Click objects to select
    </div>

    <!-- Debug Info (remove in production) -->
    <div v-if="showDebugInfo" class="debug-info">
      <div>Objects detected: {{ Object.keys(objectMasks || {}).length }}</div>
      <div>Cache ready: {{ objectMaskCacheReady }}</div>
      <div>Regions processed: {{ objectMaskRegions.length }}</div>
      <div>Selected: {{ selectedObjects.length }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item_remove_renderer',
  props: {
    baseImage: {
      type: String,
      required: true
    },
    objectMasks: {
      type: Object,
      default: () => ({})
    },
    cachedObjectImages: {
      type: Map,
      default: () => new Map()
    },
    objectMaskCacheReady: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    selectionMode: {
      type: String,
      default: 'multiple',
      validator: value => ['single', 'multiple'].includes(value)
    },
    showDebugInfo: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      canvas: null,
      ctx: null,
      overlayCanvas: null,
      overlayCtx: null,
      baseImg: null,
      
      // Object mask processing
      objectMaskImages: [],
      objectMaskRegions: [],
      objectMaskImageData: [],
      hoveredObject: null,
      selectedObjects: [],
      
      // Object mask caching system
      objectMaskCache: new Map(),
      isCacheInitialized: false,
      objectMasksLoading: false,
      objectMasksLoadingProgress: 0,
      
      // Canvas dimensions
      canvasWidth: 800,
      canvasHeight: 600,
      containerWidth: 800,
      containerHeight: 600,
      
      // Image rendering properties
      renderWidth: 800,
      renderHeight: 600,
      renderOffsetX: 0,
      renderOffsetY: 0,
      scaleX: 1,
      scaleY: 1,
      
      // Zoom and pan functionality
      zoom: 1,
      minZoom: 1.0,
      maxZoom: 5,
      panX: 0,
      panY: 0,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      dragStartPanX: 0,
      dragStartPanY: 0,
      
      // Resize observer
      resizeObserver: null,
      
      // Processing states
      processingObjects: false,
      processingCurrent: 0,
      processingTotal: 0
    }
  },
  
  mounted() {
    this.setupResizeObserver();
    this.updateCanvasDimensions();
    this.initCanvas();
    this.setupEventListeners();
    this.loadImage();
  },
  
  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.removeEventListeners();
    this.clearObjectMaskCache();
  },
  
  watch: {
    baseImage() {
      this.loadImage();
    },
    objectMasks: {
      handler(newVal, oldVal) {
        console.log('🪑 ObjectMasks prop changed:', {
          old: Object.keys(oldVal || {}).length,
          new: Object.keys(newVal || {}).length
        });
        
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          console.log('🔄 Object masks changed, refreshing...');
          this.handleObjectMasksUpdate(newVal || {});
        }
      },
      deep: true,
      immediate: false
    },
    cachedObjectImages: {
      handler(newCached) {
        if (newCached && newCached.size > 0 && this.objectMaskCacheReady) {
          console.log('📦 Using cached object images from parent');
          this.loadFromParentCache();
        }
      },
      deep: true
    },
    objectMaskCacheReady(isReady) {
      if (isReady && this.cachedObjectImages && this.cachedObjectImages.size > 0) {
        console.log('✅ Cache became ready, loading from parent cache');
        this.loadFromParentCache();
      }
    },
    selectedObjects: {
      handler() {
        this.emitObjectSelectionChange();
      },
      deep: true
    }
  },
  
  methods: {
    toggleSelection() {
    if (this.selectedObjects.length === this.objectMaskRegions.length) {
      // All selected → clear them
      this.clearSelections();
    } else {
      // Not all selected → select all
      this.selectAllObjects();
    }
  },
    // ===================
    // INITIALIZATION
    // ===================
    
    setupResizeObserver() {
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => {
          this.updateCanvasDimensions();
          this.$nextTick(() => {
            this.render();
          });
        });
        
        if (this.$refs.canvasContainer) {
          this.resizeObserver.observe(this.$refs.canvasContainer);
        }
      } else {
        window.addEventListener('resize', this.handleWindowResize);
      }
    },

    handleWindowResize() {
      this.updateCanvasDimensions();
      this.$nextTick(() => {
        this.render();
      });
    },
    
    updateCanvasDimensions() {
      if (this.$refs.canvasContainer) {
        const rect = this.$refs.canvasContainer.getBoundingClientRect();
        this.containerWidth = Math.floor(rect.width);
        this.containerHeight = Math.floor(rect.height);
        this.canvasWidth = this.containerWidth;
        this.canvasHeight = this.containerHeight;
      }
    },

    initCanvas() {
      this.canvas = this.$refs.canvas;
      this.overlayCanvas = this.$refs.overlayCanvas;
      
      if (!this.canvas || !this.overlayCanvas) {
        console.error('Canvas refs not found');
        return;
      }
      
      this.ctx = this.canvas.getContext('2d');
      this.overlayCtx = this.overlayCanvas.getContext('2d');
      
      // Set initial background
      this.ctx.fillStyle = '#f0f0f0';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    },

    // ===================
    // EVENT LISTENERS
    // ===================
    
    setupEventListeners() {
      if (!this.canvas || this.isLoading) return;
      
      this.canvas.addEventListener('wheel', this.handleWheel, { passive: false });
      this.canvas.addEventListener('mousedown', this.handleMouseDown);
      this.canvas.addEventListener('mousemove', this.handleMouseMove);
      this.canvas.addEventListener('mouseup', this.handleMouseUp);
      this.canvas.addEventListener('mouseleave', this.handleMouseUp);
      this.canvas.addEventListener('click', this.handleObjectClick);
      this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
      this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
      this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
      this.canvas.addEventListener('touchend', this.handleTouchEnd);
    },

    removeEventListeners() {
      if (!this.canvas) return;
      
      this.canvas.removeEventListener('wheel', this.handleWheel);
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseup', this.handleMouseUp);
      this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
      this.canvas.removeEventListener('click', this.handleObjectClick);
      this.canvas.removeEventListener('touchstart', this.handleTouchStart);
      this.canvas.removeEventListener('touchmove', this.handleTouchMove);
      this.canvas.removeEventListener('touchend', this.handleTouchEnd);
      
      if (typeof ResizeObserver === 'undefined') {
        window.removeEventListener('resize', this.handleWindowResize);
      }
    },

    // ===================
    // MOUSE & TOUCH HANDLERS
    // ===================
    
    handleWheel(e) {
      if (this.isLoading) return;
      e.preventDefault();
      
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * zoomFactor));
      
      if (newZoom !== this.zoom) {
        const imageX = (mouseX - this.panX) / this.zoom;
        const imageY = (mouseY - this.panY) / this.zoom;
        
        this.zoom = newZoom;
        this.panX = mouseX - imageX * this.zoom;
        this.panY = mouseY - imageY * this.zoom;
        
        this.constrainPan();
        this.render();
      }
    },

    handleMouseDown(e) {
      if (this.isLoading) return;
      
      if (e.button === 0 || e.button === 2) {
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.dragStartPanX = this.panX;
        this.dragStartPanY = this.panY;
        this.canvas.style.cursor = 'grabbing';
        e.preventDefault();
      }
    },

    handleMouseMove(e) {
      if (this.isLoading) return;
      
      if (this.isDragging) {
        const deltaX = e.clientX - this.dragStartX;
        const deltaY = e.clientY - this.dragStartY;
        
        this.panX = this.dragStartPanX + deltaX;
        this.panY = this.dragStartPanY + deltaY;
        
        this.constrainPan();
        this.render();
        e.preventDefault();
      } else {
        this.handleObjectHover(e);
      }
    },

    handleMouseUp(e) {
      if (this.isLoading) return;
      
      if (this.isDragging) {
        this.isDragging = false;
        this.canvas.style.cursor = this.zoom > 1 ? 'grab' : 'default';
        e.preventDefault();
      }
    },

    handleTouchStart(e) {
      if (this.isLoading) return;
      e.preventDefault();
      
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        this.isDragging = true;
        this.dragStartX = touch.clientX;
        this.dragStartY = touch.clientY;
        this.dragStartPanX = this.panX;
        this.dragStartPanY = this.panY;
      }
    },

    handleTouchMove(e) {
      if (this.isLoading) return;
      e.preventDefault();
      
      if (this.isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.dragStartX;
        const deltaY = touch.clientY - this.dragStartY;
        
        this.panX = this.dragStartPanX + deltaX;
        this.panY = this.dragStartPanY + deltaY;
        
        this.constrainPan();
        this.render();
      }
    },

    handleTouchEnd(e) {
      if (this.isLoading) return;
      e.preventDefault();
      this.isDragging = false;
    },

    // ===================
    // ZOOM & PAN CONTROLS
    // ===================
    
    constrainPan() {
      if (!this.baseImg) return;
      
      const zoomedImageWidth = this.renderWidth * this.zoom;
      const zoomedImageHeight = this.renderHeight * this.zoom;
      const zoomedImageLeft = this.renderOffsetX * this.zoom;
      const zoomedImageTop = this.renderOffsetY * this.zoom;
      
      const maxPanX = Math.max(0, zoomedImageWidth + zoomedImageLeft - this.canvasWidth);
      const minPanX = Math.min(0, -zoomedImageLeft);
      const maxPanY = Math.max(0, zoomedImageHeight + zoomedImageTop - this.canvasHeight);
      const minPanY = Math.min(0, -zoomedImageTop);
      
      this.panX = Math.max(-maxPanX, Math.min(minPanX, this.panX));
      this.panY = Math.max(-maxPanY, Math.min(minPanY, this.panY));
    },

    zoomIn() {
      if (this.isLoading) return;
      
      const newZoom = Math.min(this.maxZoom, this.zoom * 1.2);
      if (newZoom !== this.zoom) {
        this.zoomToCenter(newZoom);
      }
    },

    zoomOut() {
      if (this.isLoading) return;
      
      const newZoom = Math.max(this.minZoom, this.zoom / 1.2);
      if (newZoom !== this.zoom) {
        this.zoomToCenter(newZoom);
      }
    },

    zoomToCenter(newZoom) {
      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;
      
      const imageX = (centerX - this.panX) / this.zoom;
      const imageY = (centerY - this.panY) / this.zoom;
      
      this.zoom = newZoom;
      this.panX = centerX - imageX * this.zoom;
      this.panY = centerY - imageY * this.zoom;
      
      this.constrainPan();
      this.render();
    },

    resetZoomAndPan() {
      if (this.isLoading) return;
      
      this.zoom = 1;
      this.panX = 0;
      this.panY = 0;
      this.render();
    },

    // ===================
    // IMAGE LOADING
    // ===================
    
    async loadImage() {
      if (!this.baseImage) {
        console.warn('No base image provided');
        return;
      }
      
      try {
        this.baseImg = await this.createImageFromSrc(this.baseImage);
        this.calculateImageDimensions();
        this.render();
        
        // Load object masks if available
        if (this.objectMaskCacheReady && this.cachedObjectImages && this.cachedObjectImages.size > 0) {
          console.log('📦 Loading from cached object images');
          this.loadFromParentCache();
        } else if (this.objectMasks && Object.keys(this.objectMasks).length > 0) {
          console.log('🔄 Initializing object mask cache');
          await this.initializeObjectMaskCache();
        }
        
      } catch (error) {
        console.error('Error loading image:', error);
        this.showErrorState();
      }
    },

    createImageFromSrc(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(new Error(`Failed to load image: ${src}`));
        
        img.src = src;
      });
    },

    calculateImageDimensions() {
      if (!this.baseImg) return;
      
      const maxWidth = this.canvasWidth;
      const maxHeight = this.canvasHeight;
      
      const imgAspectRatio = this.baseImg.width / this.baseImg.height;
      const canvasAspectRatio = maxWidth / maxHeight;
      
      if (imgAspectRatio > canvasAspectRatio) {
        this.renderWidth = maxWidth;
        this.renderHeight = Math.round(maxWidth / imgAspectRatio);
        this.renderOffsetX = 0;
        this.renderOffsetY = Math.round((maxHeight - this.renderHeight) / 2);
      } else {
        this.renderHeight = maxHeight;
        this.renderWidth = Math.round(maxHeight * imgAspectRatio);
        this.renderOffsetX = Math.round((maxWidth - this.renderWidth) / 2);
        this.renderOffsetY = 0;
      }
      
      this.scaleX = this.renderWidth / this.baseImg.width;
      this.scaleY = this.renderHeight / this.baseImg.height;
    },

    // ===================
    // OBJECT MASK CACHING
    // ===================
    
    async handleObjectMasksUpdate(newObjectMasks) {
      console.log('🔄 Handling object masks update');
      this.clearObjectMaskCache();
      
      if (Object.keys(newObjectMasks).length > 0) {
        await this.initializeObjectMaskCache();
      } else {
        this.showEmptyFurnitureState();
      }
    },

    async initializeObjectMaskCache() {
      if (this.isCacheInitialized || !this.objectMasks || Object.keys(this.objectMasks).length === 0) {
        return;
      }

      this.isCacheInitialized = true;
      this.objectMasksLoading = true;
      this.objectMasksLoadingProgress = 0;
      
      console.log('🚀 Initializing object mask cache...');
      
      const objectEntries = Object.entries(this.objectMasks);
      const totalMasks = objectEntries.length;
      
      try {
        const loadingPromises = objectEntries.map(async ([objectKey, maskPath], index) => {
          try {
            const fullPath = this.$store ? `${this.$store.state.root_api}${maskPath}` : maskPath;
            const img = await this.loadImageWithPromise(fullPath, 8000);
            
            this.objectMaskCache.set(objectKey, {
              image: img,
              objectKey,
              maskPath,
              fullPath,
              loaded: true,
              loadedAt: Date.now(),
              index
            });
            
            this.objectMasksLoadingProgress = Math.round(((index + 1) / totalMasks) * 100);
            return { success: true, objectKey };
            
          } catch (error) {
            console.error(`Failed to cache mask ${objectKey}:`, error.message);
            return { success: false, objectKey, error: error.message };
          }
        });
        
        await Promise.allSettled(loadingPromises);
        
        this.objectMasksLoading = false;
        console.log('✅ Object mask cache initialized');
        
        this.loadFromCache();
        
      } catch (error) {
        console.error('Failed to initialize object mask cache:', error);
        this.objectMasksLoading = false;
        this.isCacheInitialized = false;
      }
    },

    loadFromCache() {
      if (this.objectMaskCache.size === 0) {
        console.log('📭 No cached masks to load');
        return;
      }

      this.objectMaskImages = [];
      let loadedFromCache = 0;
      
      this.objectMaskCache.forEach((cachedMask, objectKey) => {
        if (cachedMask.loaded && cachedMask.image) {
          this.objectMaskImages.push({
            img: cachedMask.image,
            objectKey: cachedMask.objectKey,
            maskPath: cachedMask.maskPath,
            index: this.objectMaskImages.length
          });
          loadedFromCache++;
        }
      });
      
      console.log(`📦 Loaded ${loadedFromCache} object masks from cache`);
      
      this.processObjectMaskRegions().then(() => {
        this.render();
      });
    },

    loadFromParentCache() {
      if (!this.cachedObjectImages || this.cachedObjectImages.size === 0) {
        console.log('📭 No parent cached images to load');
        return;
      }

      this.objectMaskImages = [];
      let loadedFromParentCache = 0;
      
      this.cachedObjectImages.forEach((cachedImage, objectKey) => {
        if (cachedImage) {
          this.objectMaskImages.push({
            img: cachedImage,
            objectKey: objectKey,
            maskPath: this.objectMasks[objectKey] || '',
            index: this.objectMaskImages.length
          });
          loadedFromParentCache++;
        }
      });
      
      console.log(`📦 Loaded ${loadedFromParentCache} object masks from parent cache`);
      
      this.processObjectMaskRegions().then(() => {
        this.render();
      });
    },

    clearObjectMaskCache() {
      console.log('🧹 Clearing object mask cache...');
      
      this.objectMaskCache.clear();
      this.isCacheInitialized = false;
      
      this.objectMaskImages = [];
      this.objectMaskRegions = [];
      this.objectMaskImageData = [];
      
      this.objectMasksLoading = false;
      this.objectMasksLoadingProgress = 0;
      
      this.hoveredObject = null;
      this.selectedObjects = [];
      this.removeObjectHighlight();
    },

    showEmptyFurnitureState() {
      this.objectMaskImages = [];
      this.objectMaskRegions = [];
      this.objectMaskImageData = [];
      this.hoveredObject = null;
      this.selectedObjects = [];
      this.removeObjectHighlight();
      this.render();
    },

    loadImageWithPromise(src, timeout = 8000) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timeout loading: ${src}`));
        }, timeout);
        
        img.onload = () => {
          clearTimeout(timeoutId);
          resolve(img);
        };
        
        img.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error(`Failed to load: ${src}`));
        };
        
        img.src = src;
      });
    },

    // ===================
    // OBJECT MASK PROCESSING
    // ===================
    
    async processObjectMaskRegions() {
      console.log('🚀 Starting object mask region processing...');
      
      this.objectMaskRegions = [];
      this.objectMaskImageData = [];
      
      if (!this.objectMaskImages.length) {
        console.log('📭 No object mask images to process');
        return;
      }

      const batchSize = 3;
      const totalMasks = this.objectMaskImages.length;
      let processedCount = 0;
      
      this.$emit('processing-progress', { current: 0, total: totalMasks });
      
      try {
        for (let i = 0; i < this.objectMaskImages.length; i += batchSize) {
          const batch = this.objectMaskImages.slice(i, i + batchSize);
          
          await this.processMaskBatch(batch, i);
          
          processedCount += batch.length;
          this.$emit('processing-progress', { 
            current: processedCount, 
            total: totalMasks 
          });
          
          await this.yieldToBrowser();
        }
        
        console.log(`✅ Processed ${this.objectMaskRegions.length} object masks`);
        
      } catch (error) {
        console.error('Error in object mask processing:', error);
      } finally {
        this.$emit('processing-complete');
      }
    },

    async processMaskBatch(maskBatch, startIndex) {
      return new Promise((resolve) => {
        setTimeout(() => {
          maskBatch.forEach((maskData, batchIndex) => {
            if (!maskData || !maskData.img) return;
            
            const globalIndex = startIndex + batchIndex;
            this.processSingleObjectMask(maskData, globalIndex);
          });
          resolve();
        }, 0);
      });
    },

    processSingleObjectMask(maskData, index) {
      try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvasWidth;
        tempCanvas.height = this.canvasHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.fillStyle = '#000000';
        tempCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        tempCtx.drawImage(
          maskData.img, 
          this.renderOffsetX, 
          this.renderOffsetY, 
          this.renderWidth, 
          this.renderHeight
        );
        
        const imageData = tempCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        
        this.objectMaskImageData[index] = {
          imageData: imageData,
          objectKey: maskData.objectKey,
          index: index
        };
        
        const bounds = this.findObjectBoundsOptimized(imageData);
        
        if (bounds) {
          this.objectMaskRegions.push({
            objectKey: maskData.objectKey,
            index: index,
            bounds: bounds,
            imageData: imageData
          });
        }
        
      } catch (error) {
        console.error(`Error processing mask ${index}:`, error);
      }
    },

    findObjectBoundsOptimized(imageData) {
      const data = imageData.data;
      let minX = this.canvasWidth, maxX = 0;
      let minY = this.canvasHeight, maxY = 0;
      let hasWhitePixels = false;
      
      const step = 2;
      
      for (let y = 0; y < this.canvasHeight; y += step) {
        let rowHasWhite = false;
        
        for (let x = 0; x < this.canvasWidth; x += step) {
          const index = (y * this.canvasWidth + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          if (r > 200 && g > 200 && b > 200) {
            hasWhitePixels = true;
            rowHasWhite = true;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
        }
        
        if (hasWhitePixels && !rowHasWhite && y > maxY + step * 10) {
          break;
        }
      }
      
      return hasWhitePixels ? { minX, maxX, minY, maxY } : null;
    },

    yieldToBrowser() {
      return new Promise(resolve => {
        setTimeout(resolve, 0);
      });
    },

    // ===================
    // OBJECT INTERACTION
    // ===================
    
    handleObjectClick(e) {
      if (this.isLoading || this.isDragging || this.objectMasksLoading) return;
      
      if (!this.objectMaskRegions || this.objectMaskRegions.length === 0) {
        return;
      }
      
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      for (let i = this.objectMaskRegions.length - 1; i >= 0; i--) {
        const region = this.objectMaskRegions[i];
        
        if (this.isPointInObjectMask(x, y, region.index)) {
          this.toggleObjectSelection(region.objectKey);
          break;
        }
      }
    },

    handleObjectHover(e) {
      if (this.isLoading || this.isDragging || this.objectMasksLoading) return;
      
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      let foundObject = null;
      
      for (let i = this.objectMaskRegions.length - 1; i >= 0; i--) {
        const region = this.objectMaskRegions[i];
        
        if (this.isPointInObjectMask(x, y, region.index)) {
          foundObject = region.objectKey;
          break;
        }
      }
      
      if (foundObject !== this.hoveredObject) {
        this.hoveredObject = foundObject;
        
        if (foundObject) {
          this.highlightObject(foundObject);
          this.canvas.style.cursor = 'pointer';
        } else {
          this.removeObjectHighlight();
          this.canvas.style.cursor = this.zoom > 1 ? 'grab' : 'default';
        }
      }
    },

    isPointInObjectMask(x, y, maskIndex) {
      if (!this.objectMaskImageData[maskIndex]) return false;
      
      const canvasX = Math.round((x - this.panX) / this.zoom);
      const canvasY = Math.round((y - this.panY) / this.zoom);
      
      if (canvasX < 0 || canvasX >= this.canvasWidth || canvasY < 0 || canvasY >= this.canvasHeight) {
        return false;
      }
      
      const imageData = this.objectMaskImageData[maskIndex].imageData;
      const index = (canvasY * this.canvasWidth + canvasX) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      
      return r > 200 && g > 200 && b > 200;
    },

    toggleObjectSelection(objectKey) {
      let updatedObjects = [...this.selectedObjects];
      const index = updatedObjects.indexOf(objectKey);
      
      if (this.selectionMode === 'single') {
        updatedObjects = updatedObjects.includes(objectKey) ? [] : [objectKey];
      } else {
        if (index > -1) {
          updatedObjects.splice(index, 1);
        } else {
          updatedObjects.push(objectKey);
        }
      }
      
      this.selectedObjects = updatedObjects;
    },

    selectAllObjects() {
      if (this.isLoading || this.objectMasksLoading) return;
      
      this.selectedObjects = this.objectMaskRegions.map(region => region.objectKey);
    },

    clearSelections() {
      if (this.isLoading) return;
      
      this.selectedObjects = [];
      this.removeObjectHighlight();
    },

    removeSelectedObjects() {
      if (this.selectedObjects.length === 0) return;
      
      console.log('🗑️ Removing selected objects:', this.selectedObjects);
      
      this.$emit('objects-selected-for-removal', {
        selectedObjects: [...this.selectedObjects],
        objectMasks: this.selectedObjects.reduce((acc, key) => {
          if (this.objectMasks[key]) {
            acc[key] = this.objectMasks[key];
          }
          return acc;
        }, {}),
        canvasDimensions: this.getCanvasDimensions()
      });
      
      // Clear selections after emitting
      this.clearSelections();
    },
      make_room_empty() {
      this.$emit('make-room-empty',true)
    },
      reset_entire_room() {
      this.$emit('reset-entire-room', true)
    },

    highlightObject(objectKey) {
      const region = this.objectMaskRegions.find(r => r.objectKey === objectKey);
      if (!region || !this.overlayCtx) return;

      this.overlayCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.overlayCtx.save();
      
      this.overlayCtx.translate(this.panX, this.panY);
      this.overlayCtx.scale(this.zoom, this.zoom);
      
      const imageData = region.imageData;
      const data = imageData.data;
      
      // Use different colors for selected vs hovered
      const isSelected = this.selectedObjects.includes(objectKey);
      this.overlayCtx.fillStyle = isSelected ? 'rgba(255, 0, 0, 0.4)' : 'rgba(255, 165, 0, 0.4)';
      
      for (let y = 0; y < this.canvasHeight; y += 2) {
        let startX = -1;
        for (let x = 0; x < this.canvasWidth; x += 2) {
          const index = (y * this.canvasWidth + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          if (r > 200 && g > 200 && b > 200) {
            if (startX === -1) startX = x;
          } else {
            if (startX !== -1) {
              this.overlayCtx.fillRect(startX / this.zoom, y / this.zoom, (x - startX) / this.zoom, 2 / this.zoom);
              startX = -1;
            }
          }
        }
        if (startX !== -1) {
          this.overlayCtx.fillRect(startX / this.zoom, y / this.zoom, (this.canvasWidth - startX) / this.zoom, 2 / this.zoom);
        }
      }
      
      this.overlayCtx.restore();
    },

    removeObjectHighlight() {
      this.hoveredObject = null;
      if (this.overlayCtx) {
        this.overlayCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      }
    },

    // ===================
    // RENDERING
    // ===================
    
    render() {
      if (!this.canvas || !this.ctx) return;

      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      this.ctx.fillStyle = '#f5f5f5';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      if (!this.baseImg) return;
      
      this.ctx.save();
      
      this.ctx.translate(this.panX, this.panY);
      this.ctx.scale(this.zoom, this.zoom);
      
      try {
        this.ctx.drawImage(
          this.baseImg,
          this.renderOffsetX,
          this.renderOffsetY,
          this.renderWidth,
          this.renderHeight
        );
        
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.lineWidth = 1 / this.zoom;
        this.ctx.strokeRect(
          this.renderOffsetX,
          this.renderOffsetY,
          this.renderWidth,
          this.renderHeight
        );
        
        // Draw selected object outlines
        this.drawSelectedObjectOutlines();
        
      } catch (error) {
        console.error('Error rendering image:', error);
        this.showErrorState();
      }
      
      this.ctx.restore();
    },

    drawSelectedObjectOutlines() {
      if (this.selectedObjects.length === 0) return;
      
      this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
      this.ctx.lineWidth = 2 / this.zoom;
      
      this.selectedObjects.forEach(objectKey => {
        const region = this.objectMaskRegions.find(r => r.objectKey === objectKey);
        if (region && region.bounds) {
          const { minX, maxX, minY, maxY } = region.bounds;
          this.ctx.strokeRect(
            minX / this.zoom,
            minY / this.zoom,
            (maxX - minX) / this.zoom,
            (maxY - minY) / this.zoom
          );
        }
      });
    },

    showErrorState() {
      if (!this.ctx) return;
      
      this.ctx.fillStyle = '#ffcccc';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.fillStyle = '#cc0000';
      this.ctx.font = '20px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        'Error loading image',
        this.canvasWidth / 2,
        this.canvasHeight / 2
      );
    },

    // ===================
    // UTILITY METHODS
    // ===================
    
    formatObjectName(objectKey) {
      return objectKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    getCanvasDimensions() {
      return {
        width: this.canvasWidth,
        height: this.canvasHeight,
        renderWidth: this.renderWidth,
        renderHeight: this.renderHeight,
        renderOffsetX: this.renderOffsetX,
        renderOffsetY: this.renderOffsetY,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        zoom: this.zoom,
        panX: this.panX,
        panY: this.panY
      };
    },

    // ===================
    // EVENT EMISSION
    // ===================
    
    emitObjectSelectionChange() {
      this.$emit('object-selection-changed', {
        selectedObjects: [...this.selectedObjects],
        selectionMode: this.selectionMode,
        objectMasks: this.selectedObjects.reduce((acc, key) => {
          if (this.objectMasks[key]) {
            acc[key] = this.objectMasks[key];
          }
          return acc;
        }, {}),
        canvasDimensions: this.getCanvasDimensions()
      });
    },

    // ===================
    // PUBLIC API METHODS
    // ===================
    
    updateImage(newImageSrc) {
      this.baseImage = newImageSrc;
      this.loadImage();
    },

    getCanvasState() {
      return {
        ...this.getCanvasDimensions(),
        selectedObjects: [...this.selectedObjects],
        objectRegions: this.objectMaskRegions.length,
        cacheReady: this.objectMaskCacheReady
      };
    },

    forceRefreshObjectMasks(newObjectMasks) {
      console.log('🔄 Force refreshing object masks...');
      this.handleObjectMasksUpdate(newObjectMasks || {});
    }
  }
}
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* border-radius: 10px; */
  background: #f5f5f5;
}

.main-canvas {
  display: block;
  /* border-radius: 10px; */
  transition: opacity 0.3s ease;
}

.main-canvas.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.main-canvas.furniture-mode {
  cursor: crosshair;
}

.overlay-canvas {
  border-radius: 10px;
  transition: opacity 0.3s ease;
}

.overlay-canvas.disabled {
  opacity: 0.5;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(245, 245, 245, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 10px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 16px;
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.loading-progress-bar {
  width: 200px;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  margin-top: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1890ff;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.object-indicators {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 5;
}

.object-indicator {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 150px;
}

.object-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.remove-object-btn {
  background: rgba(255, 0, 0, 0.8);
  border: none;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  pointer-events: all;
}

.remove-object-btn:hover {
  background: rgba(255, 0, 0, 1);
}

.mode-indicator {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 6;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mode-indicator.furniture-mode {
  background: rgba(139, 69, 19, 0.9);
}

.mode-text {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-hint {
  font-size: 12px;
  opacity: 0.9;
  font-style: italic;
}
.selection-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%); /* shifts box back by half its width */
  
  display: flex;
  flex-direction: row;
  justify-content: center; /* centers buttons inside */
  align-items: center;
  
  gap: 8px;
  z-index: 6;
  background-color: rgba(255, 255, 255, 0.136);
  backdrop-filter: blur(5px);
  max-width: 700px;
  width: 100%;     /* optional: ensures responsive shrink */
  padding: 10px;
  border-radius: 8px; /* optional: looks cleaner */
}


.control-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.select-all {
  background: #52c41a;
  color: white;
}

.control-btn.select-all:hover:not(:disabled) {
  background: #389e0d;
}

.control-btn.clear {
  background: #faad14;
  color: white;
}

.control-btn.clear:hover:not(:disabled) {
  background: #d48806;
}

.control-btn.remove {
  background: #ff4d4f;
  color: white;
}

.control-btn.remove:hover:not(:disabled) {
  background: #cf1322;
}


.zoom-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 5;
}

.zoom-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: #1890ff;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.zoom-btn:hover {
  background: #40a9ff;
  transform: scale(1.05);
}

.zoom-btn:active {
  transform: scale(0.95);
}

.zoom-btn.reset-btn {
  font-size: 12px;
}

.zoom-level {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  min-width: 36px;
  text-align: center;
}


.instructions {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 6;
}

.debug-info {
  position: absolute;
  bottom: 80px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 10px;
  border-radius: 6px;
  font-size: 11px;
  z-index: 6;
  font-family: monospace;
}

.debug-info div {
  margin-bottom: 2px;
}




































/* Updated scanning loading overlay to fit canvas only */
.scanning-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  border-radius: 10px;
  overflow: hidden;
}

.loading-screen {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 10px;
}

.loading-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: rgba(0, 0, 0, 0.05); */
  z-index: 1;
}
.wave-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to left,
    rgba(0,102,255,1) 0%,   /* bold vertical scanning line */
    rgba(0,102,255,0.4) 20%,
    rgba(0,102,255,0.3) 30%, /* fade tail after the bold line */
    rgba(0,102,255,0.2) 35%,
    rgba(0,102,255,0.15) 40%,
    rgba(0,102,255,0.10) 50%,
    rgba(0,102,255,0.0) 100%
  );
  animation: moveWaveLeftToRight 3s linear infinite,
             waveFade 3s ease-in-out infinite; /* fade control */
  z-index: 2;
}

@keyframes moveWaveLeftToRight {
  from { transform: translateX(-100%); }
  to   { transform: translateX(50%); }
}

@keyframes waveFade {
  0%   { opacity: 0; }   /* invisible before entering */
  10%  { opacity: 1; }   /* fade in */
  90%  { opacity: 1; }   /* stay visible */
  100% { opacity: 0; }   /* fade out before reset */
}

.loading-text {
  position: relative;
  color: #fff;
  text-align: center;
  z-index: 3;
  text-shadow: 0 2px 6px rgba(0,0,0,0.6);
  background: rgba(0, 0, 0, 0.3);
  padding: 20px 30px;
  border-radius: 10px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.process-text {
  font-size: 18px;
  opacity: 0.9;
  letter-spacing: 1px;
  text-transform: uppercase;
}
</style>
