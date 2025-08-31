<template>
  <div class="canvas-container" ref="canvasContainer">
    <!-- Loading Overlay -->
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

    <!-- Selection Controls -->
    <div v-if="!isLoading && objectMaskCacheReady " class="selection-controls">
      <a-button class="toolbar-btn primary-btn" @click="make_room_empty">
        Remove All Furniture
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

    <!-- Debug Info -->
    <div v-if="showDebugInfo" class="debug-info">
      <div>Objects detected: {{ Object.keys(objectMasks || {}).length }}</div>
      <div>Cache ready: {{ objectMaskCacheReady }}</div>
      <div>Regions processed: {{ objectMaskRegions.length }}</div>
      <div>Selected: {{ selectedObjects.length }}</div>
    </div>
  </div>
  
  <div  class="" style="display:flex;justify-content: space-between;background: white;padding-left:10px;padding-right:10px;">
    <div style="display:flex;gap:5px;padding-top:5px;">
      <a-button
        @click="toggleSelection"
        class="control-btn"
        :disabled="objectMaskRegions.length === 0"
      >
        {{ selectedObjects.length === objectMaskRegions.length ? 'Clear Selection'+`(${selectedObjects.length})` : 'Select All' }}
      </a-button>

      <a-button 
        @click="removeSelectedObjects" 
        class="control-btn remove"
        :disabled="selectedObjects.length === 0"
      >
        Remove Selected ({{ selectedObjects.length }})
      </a-button>
      
      <a-button type="primary" class="toolbar-btn primary-btn" @click="reset_entire_room" 
      :disabled="isLoading">
        Reset room
      </a-button>
      
      <!-- <a-button type="primary" class="toolbar-btn primary-btn" @click="" :disabled="isLoading">
        Detect all furniture
      </a-button> -->
    </div>
    
    <div style="padding-top:10px;">
      <a-button type="primary" class="toolbar-btn primary-btn" @click="" :disabled="isLoading">
        Apply Changes
      </a-button>
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
      currentObjectMasksHash: '',
      
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
  
  computed: {
    objectMasksHash() {
      return JSON.stringify(this.objectMasks || {});
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
    baseImage: {
      handler() {
        console.log('Base image changed, reloading...');
        this.loadImage();
      },
      immediate: false
    },
    
    objectMasksHash: {
      handler(newHash, oldHash) {
        if (oldHash && newHash !== oldHash) {
          console.log('Object masks changed, clearing and reloading...');
          this.handleObjectMasksChange();
        }
      },
      immediate: false
    },
    
    cachedObjectImages: {
      handler(newCached, oldCached) {
        if (this.objectMaskCacheReady && newCached && newCached.size > 0) {
          const newSize = newCached ? newCached.size : 0;
          const oldSize = oldCached ? oldCached.size : 0;
          
          if (newSize !== oldSize) {
            console.log('Cached images changed, reloading from parent cache');
            this.loadFromParentCache();
          }
        }
      },
      deep: false
    },
    
    objectMaskCacheReady: {
      handler(isReady) {
        if (isReady && this.cachedObjectImages && this.cachedObjectImages.size > 0) {
          console.log('Cache became ready, loading from parent cache');
          this.loadFromParentCache();
        }
      },
      immediate: false
    },
    
    selectedObjects: {
      handler() {
        this.emitObjectSelectionChange();
        this.$nextTick(() => {
          this.render();
        });
      },
      deep: true
    }
  },
  
  methods: {
    // ===================
    // OBJECT MASKS CHANGE HANDLING
    // ===================
    
    async handleObjectMasksChange() {
      try {
        this.clearAllObjectState();
        this.removeObjectHighlight();
        this.render();
        
        if (this.objectMasks && Object.keys(this.objectMasks).length > 0) {
          this.currentObjectMasksHash = this.objectMasksHash;
          
          if (this.objectMaskCacheReady && this.cachedObjectImages && this.cachedObjectImages.size > 0) {
            console.log('Using parent cache for new masks');
            await this.loadFromParentCache();
          } else {
            console.log('Initializing new object mask cache');
            await this.initializeObjectMaskCache();
          }
        } else {
          console.log('No object masks to load');
          this.showEmptyFurnitureState();
        }
        
      } catch (error) {
        console.error('Error handling object masks change:', error);
        this.showEmptyFurnitureState();
      }
    },
    
    clearAllObjectState() {
      console.log('Clearing all object state...');
      
      this.objectMaskCache.clear();
      this.isCacheInitialized = false;
      this.objectMaskImages = [];
      this.objectMaskRegions = [];
      this.objectMaskImageData = [];
      this.selectedObjects = [];
      this.hoveredObject = null;
      this.objectMasksLoading = false;
      this.objectMasksLoadingProgress = 0;
    },
    
    // ===================
    // SELECTION CONTROLS
    // ===================
    
    toggleSelection() {
      if (this.selectedObjects.length === this.objectMaskRegions.length) {
        this.clearSelections();
      } else {
        this.selectAllObjects();
      }
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
      
      console.log('Removing selected objects:', this.selectedObjects);
      
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
      
      this.clearSelections();
    },
    
    make_room_empty() {
      this.$emit('make-room-empty', true)
    },
    
    reset_entire_room() {
      this.$emit('reset-entire-room', true)
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
      
      this.ctx.fillStyle = '#f0f0f0';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    },

    // ===================
    // EVENT LISTENERS
    // ===================
    
    setupEventListeners() {
      if (!this.canvas) return;
      
      this.canvas.addEventListener('wheel', this.handleWheel, { passive: false });
      this.canvas.addEventListener('mousedown', this.handleMouseDown);
      this.canvas.addEventListener('mousemove', this.handleMouseMove);
      this.canvas.addEventListener('mouseup', this.handleMouseUp);
      this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
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
      this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
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
        if (this.objectMaskCacheReady && this.objectMaskRegions.length > 0) {
          this.handleObjectHover(e);
        }
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
    
    handleMouseLeave(e) {
      this.handleMouseUp(e);
      this.removeObjectHighlight();
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
      this.removeObjectHighlight();
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
        await this.processInitialObjectMasks();
        
      } catch (error) {
        console.error('Error loading image:', error);
        this.showErrorState();
      }
    },
    
    async processInitialObjectMasks() {
      this.currentObjectMasksHash = this.objectMasksHash;
      
      if (this.objectMaskCacheReady && this.cachedObjectImages && this.cachedObjectImages.size > 0) {
        console.log('Loading from cached object images');
        await this.loadFromParentCache();
      } else if (this.objectMasks && Object.keys(this.objectMasks).length > 0) {
        console.log('Initializing object mask cache');
        await this.initializeObjectMaskCache();
      } else {
        this.showEmptyFurnitureState();
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
    
    async initializeObjectMaskCache() {
      if (this.isCacheInitialized || this.objectMasksLoading || !this.objectMasks || Object.keys(this.objectMasks).length === 0) {
        return;
      }

      this.isCacheInitialized = true;
      this.objectMasksLoading = true;
      this.objectMasksLoadingProgress = 0;
      
      console.log('Initializing object mask cache...');
      
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
        console.log('Object mask cache initialized');
        
        await this.loadFromCache();
        
      } catch (error) {
        console.error('Failed to initialize object mask cache:', error);
        this.objectMasksLoading = false;
        this.isCacheInitialized = false;
      }
    },

    async loadFromCache() {
      if (this.objectMaskCache.size === 0) {
        console.log('No cached masks to load');
        this.showEmptyFurnitureState();
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
      
      console.log(`Loaded ${loadedFromCache} object masks from cache`);
      
      await this.processObjectMaskRegions();
      this.render();
    },

    async loadFromParentCache() {
      if (!this.cachedObjectImages || this.cachedObjectImages.size === 0) {
        console.log('No parent cached images to load');
        this.showEmptyFurnitureState();
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
      
      console.log(`Loaded ${loadedFromParentCache} object masks from parent cache`);
      
      await this.processObjectMaskRegions();
      this.render();
    },

    clearObjectMaskCache() {
      console.log('Clearing object mask cache...');
      this.clearAllObjectState();
      this.removeObjectHighlight();
    },

    showEmptyFurnitureState() {
      this.clearAllObjectState();
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
      console.log('Starting object mask region processing...');
      
      this.objectMaskRegions = [];
      this.objectMaskImageData = [];
      
      if (!this.objectMaskImages.length) {
        console.log('No object mask images to process');
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
        
        console.log(`Processed ${this.objectMaskRegions.length} object masks`);
        
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

    highlightObject(objectKey) {
      const region = this.objectMaskRegions.find(r => r.objectKey === objectKey);
      if (!region || !this.overlayCtx) return;

      this.overlayCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.overlayCtx.save();
      
      this.overlayCtx.translate(this.panX, this.panY);
      this.overlayCtx.scale(this.zoom, this.zoom);
      
      const imageData = region.imageData;
      const data = imageData.data;
      
      const isSelected = this.selectedObjects.includes(objectKey);
      this.overlayCtx.fillStyle = isSelected ? 'rgba(255, 0, 0, 0.4)' : 'rgba(255, 165, 0, 0.4)';
      
      const step = Math.max(1, Math.floor(4 / this.zoom));
      
      for (let y = 0; y < this.canvasHeight; y += step) {
        let startX = -1;
        for (let x = 0; x < this.canvasWidth; x += step) {
          const index = (y * this.canvasWidth + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          if (r > 200 && g > 200 && b > 200) {
            if (startX === -1) startX = x;
          } else {
            if (startX !== -1) {
              this.overlayCtx.fillRect(startX / this.zoom, y / this.zoom, (x - startX) / this.zoom, step / this.zoom);
              startX = -1;
            }
          }
        }
        if (startX !== -1) {
          this.overlayCtx.fillRect(startX / this.zoom, y / this.zoom, (this.canvasWidth - startX) / this.zoom, step / this.zoom);
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
      console.log('Force refreshing object masks...');
      this.handleObjectMasksChange();
    }
  }
}
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 92%;
  overflow: hidden;
  background: #f5f5f5;
}

.main-canvas {
  display: block;
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

.selection-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  z-index: 6;
  background-color: rgba(255, 255, 255, 0.136);
  backdrop-filter: blur(5px);
  max-width: 700px;
  padding: 10px;
  border-radius: 8px;
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

/* Loading overlay styles */
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
    rgba(0,102,255,1) 0%,
    rgba(0,102,255,0.4) 20%,
    rgba(0,102,255,0.3) 30%,
    rgba(0,102,255,0.2) 35%,
    rgba(0,102,255,0.15) 40%,
    rgba(0,102,255,0.10) 50%,
    rgba(0,102,255,0.0) 100%
  );
  animation: moveWaveLeftToRight 3s linear infinite,
             waveFade 3s ease-in-out infinite;
  z-index: 2;
}

@keyframes moveWaveLeftToRight {
  from { transform: translateX(-100%); }
  to   { transform: translateX(50%); }
}

@keyframes waveFade {
  0%   { opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { opacity: 0; }
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