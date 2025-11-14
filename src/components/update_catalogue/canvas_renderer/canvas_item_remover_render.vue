<template>
  <a-drawer
  v-if="selectedObjectForSwitch"
  :title="'select '+formatObjectName(selectedObjectForSwitch)+' furniture which you wanted to switch with here. '"
  :placement="'bottom'"
  :closable="true"
    :open="openSelectObjectModal"
    height="90%"
    style="
  border-top-left-radius: 20px;;
  border-top-right-radius: 20px;;
"
    @close="openSelectFurnitureModel"
    >
    <template #extra> <div class="head-section"> 
          <a-button @click="handleSwitchFurnitureClicked" type="primary" > 
            <div style="display: flex;gap:10px;;justify-content: center;align-items:center;"><svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.25 14.2288C3.35489 14.2288 2.49645 13.893 1.86351 13.2952C1.23058 12.6975 0.875 11.8867 0.875 11.0413C0.875 10.196 1.23058 9.38521 1.86351 8.78744C2.49645 8.18967 3.35489 7.85384 4.25 7.85384C5.14511 7.85384 6.00355 8.18967 6.63649 8.78744C7.26942 9.38521 7.625 10.196 7.625 11.0413C7.625 11.8867 7.26942 12.6975 6.63649 13.2952C6.00355 13.893 5.14511 14.2288 4.25 14.2288ZM11.75 7.14551C11.3068 7.14551 10.8679 7.06306 10.4584 6.90287C10.049 6.74269 9.67691 6.5079 9.36351 6.21191C9.05012 5.91592 8.80152 5.56454 8.63191 5.17781C8.4623 4.79109 8.375 4.3766 8.375 3.95801C8.375 3.53942 8.4623 3.12493 8.63191 2.7382C8.80152 2.35148 9.05012 2.00009 9.36351 1.7041C9.67691 1.40812 10.049 1.17333 10.4584 1.01314C10.8679 0.852955 11.3068 0.770508 11.75 0.770508C12.6451 0.770508 13.5035 1.10633 14.1365 1.7041C14.7694 2.30188 15.125 3.11263 15.125 3.95801C15.125 4.80339 14.7694 5.61414 14.1365 6.21191C13.5035 6.80968 12.6451 7.14551 11.75 7.14551ZM1.25 4.66634C1.25 3.72703 1.64509 2.8262 2.34835 2.162C3.05161 1.49781 4.00544 1.12467 5 1.12467H7.25V2.54134H5C4.40326 2.54134 3.83097 2.76522 3.40901 3.16374C2.98705 3.56225 2.75 4.10276 2.75 4.66634V6.79134H1.25V4.66634ZM13.25 8.20801V10.333C13.25 10.8966 13.0129 11.4371 12.591 11.8356C12.169 12.2341 11.5967 12.458 11 12.458H8.75V13.8747H11C11.9946 13.8747 12.9484 13.5015 13.6517 12.8373C14.3549 12.1732 14.75 11.2723 14.75 10.333V8.20801H13.25Z" fill="white"/>
</svg>
&nbsp;
Switch Furniture</div></a-button>
    </div>
    </template>
    <a-row>
      <a-col :span="4">
        <div style="display:flex;flex-direction: column;">

          <a-checkbox v-model:checked="Furnitures_Checkbox">Furnitures</a-checkbox>
          <a-checkbox v-model:checked="Lights_Checkbox">Lights</a-checkbox>
        </div>

        
      </a-col>
      <a-col :span="20">
        <switch_furniture    ref="switchFurnitureRef"
 :furniture_name="formatObjectName(selectedObjectForSwitch)" :furnitures="Furnitures_Checkbox" :lights="Lights_Checkbox"/>
      </a-col>
    </a-row>
    
  </a-drawer>

  <DrawRemovalModal 
    :visible="draw_removal_modal"
    :baseImage="baseImage"
    :roomId="this.$route.params.id"
    @update:visible="draw_removal_modal = $event"
    @submit-removal="handleDrawnAreaRemoval"
    @removal-success="handleRemovalSuccess"
    @cancel="draw_removal_modal = false"
  />

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

    <!-- Drawing Mode Controls -->
    
<!-- Updated Drawing Mode Controls Template -->
<div v-if="drawingMode && selectedObjectForSwitch" class="drawing-mode-controls">
  <!-- Header with Minimize/Maximize Button -->
  <div class="drawing-header">
    <div class="header-top">
      <h3>{{ formatObjectName(selectedObjectForSwitch) }}</h3>
      <button 
        @click="isDrawingControlsMinimized = !isDrawingControlsMinimized"
        class="minimize-btn"
        :title="isDrawingControlsMinimized ? 'Maximize' : 'Minimize'"
      >
        {{ isDrawingControlsMinimized ? '⊞' : '−' }}
      </button>
    </div>
  </div>

  <!-- Collapsible Content -->
 <div v-if="!isDrawingControlsMinimized" class="drawing-content">
  <!-- Mode Toggle Buttons -->
  <!-- <div class="mode-toggle"> -->
    <button 
      @click="isBrushMode = true"
      :class="['mode-btn', { active: isBrushMode }]"
      title="Brush Mode"
    >
      🖌️ Brush
    </button>
    <button 
      @click="isBrushMode = false"
      :class="['mode-btn', { active: !isBrushMode }]"
      title="Deselect Mode"
    >
      ✕ Deselect
    </button>
  <!-- </div> -->

  <!-- Divider -->
  <div class="divider"></div>

  <!-- Brush Size Control - Vertical (only show in brush mode) -->
  <div v-if="isBrushMode" class="brush-control">
    <label>Brush Size</label>
    <div class="size-display">{{ brushSize }}px</div>
    <input 
      type="range" 
      min="5" 
      max="50" 
      :value="brushSize"
      @input="changeBrushSize($event.target.value)"
      class="brush-slider vertical"
    />
    <div class="size-buttons">
      <button @click="brushSize = Math.max(5, brushSize - 2)" class="size-btn">−</button>
      <button @click="brushSize = Math.min(50, brushSize + 2)" class="size-btn">+</button>
    </div>
  </div>

  <!-- Divider -->
  <div class="divider"></div>

  <!-- Drawing Actions - Vertical -->
  <div class="drawing-actions">
    <button 
      @click="undoDrawing"
      :disabled="!canUndo || !isBrushMode"
      class="drawing-btn"
      title="Undo (Ctrl+Z)"
    >
      ↶ Undo
    </button>
    
    <button 
      @click="redoDrawing"
      :disabled="!canRedo || !isBrushMode"
      class="drawing-btn"
      title="Redo (Ctrl+Y)"
    >
      ↷ Redo
    </button>
    
    <button 
      @click="resetDrawing"
      class="drawing-btn reset-btn"
      title="Clear all drawings"
    >
      🔄 Reset
    </button>
  </div>

  <!-- Divider -->
  <div class="divider"></div>

  <!-- Submit Controls - Vertical -->
  <div class="submit-actions">
    <button 
      @click="submitDrawnMask"
      :disabled="switchingInProgress"
      class="drawing-btn submit-btn"
    >
      {{ switchingInProgress ? '⟳' : '✓' }} Apply
    </button>
    
    <button 
      @click="closeSwitchFurnitureMode"
      :disabled="switchingInProgress"
      class="drawing-btn cancel-btn"
    >
      ✕ Cancel
    </button>
  </div>
</div>
</div>

    <!-- Selection Controls (only show when not in drawing mode) -->
    <div v-if="!isLoading && objectMaskCacheReady && !drawingMode" class="selection-controls">
      <a-button 
        v-if="canShowSwitchButton"
        class="toolbar-btn primary-btn" 
        @click="openSwitchFurnitureMode"
      >
        🔄 Switch Furniture
      </a-button>
      
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
      <span v-if="!drawingMode">Click and drag to pan • Mouse wheel to zoom • Click objects to select</span>
      <span v-else>Draw on the furniture area to refine its boundaries</span>
    </div>

    <!-- Debug Info -->
    <div v-if="showDebugInfo" class="debug-info">
      <div>Objects detected: {{ Object.keys(objectMasks || {}).length }}</div>
      <div>Cache ready: {{ objectMaskCacheReady }}</div>
      <div>Regions processed: {{ objectMaskRegions.length }}</div>
      <div>Selected: {{ selectedObjects.length }}</div>
      <div v-if="drawingMode">Drawing Mode: Active</div>
    </div>
  </div>
  
  <div class="bottom-toolbar" style="display:flex;justify-content: space-between;background: white;padding-left:10px;padding-right:10px;">
    <div style="display:flex;gap:5px;padding-top:5px;">
      <a-button 
        @click="DrawRemoval_model" 
        style="display:flex;gap:5px;gap:10px;"
      >
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.6273 8.3374C15.6172 4.66839 14.7102 2.1779 11.3058 2C8.83147 2.04724 6.27908 3.38042 4.24174 5.44289C2.53199 7.17373 0.848545 9.65267 1.46654 12.012C1.603 12.5329 1.86906 12.8879 2.28937 13.2219C3.41888 14.1194 4.52754 14.1984 6.66281 13.6742C8.8252 13.0171 10.1658 12.0272 11.2962 11.0145M11.2962 11.0145C11.2973 11.0134 11.2985 11.0123 11.2997 11.0113C11.3019 11.0094 11.3005 11.0058 11.2976 11.0058C11.2955 11.0058 11.2939 11.008 11.2947 11.01C11.2952 11.0115 11.2957 11.013 11.2962 11.0145ZM11.2962 11.0145C11.5431 11.7446 11.3867 12.3963 10.9616 13.6742" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Draw removal
      </a-button>

      <a-button
        @click="toggleSelection"
        class="control-btn"
        :disabled="objectMaskRegions.length === 0 || drawingMode"
      >
        {{ selectedObjects.length === objectMaskRegions.length ? 'Clear Selection'+`(${selectedObjects.length})` : 'Select All' }}
      </a-button>

      <a-button 
        @click="removeSelectedObjects" 
        class="control-btn remove"
        :disabled="selectedObjects.length === 0 || drawingMode"
      >
        Remove Selected ({{ selectedObjects.length }})
      </a-button>
      
      <a-button type="primary" class="toolbar-btn primary-btn" @click="reset_entire_room" 
      :disabled="isLoading || drawingMode">
        Reset room
      </a-button>
    </div>
    
    <div style="padding-top:10px;">
      <a-button type="primary" class="toolbar-btn primary-btn" @click="$emit('Apply-Changes', 'all-tab')" :disabled="isLoading || drawingMode">
        Apply Changes
      </a-button>
    </div>
  </div>
</template>

<script>
import  DrawRemovalModal from '@/components/update_catalogue/canvas_renderer/draw_removal_area_room.vue'
import switch_furniture from '@/components/update_catalogue/bottom_drawer_item_components/switch_furniture.vue'

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
  components:{
    DrawRemovalModal,
    switch_furniture
  },

  data() {
    return {
      draw_removal_modal:false,
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
      processingTotal: 0,
      
      // Drawing mode state
      drawingMode: false,
      drawingCanvas: null,
      drawingCtx: null,
      drawingHistory: [],
      currentDrawingHistoryIndex: -1,
      brushSize: 10,
        brushColor: 'rgba(255, 0, 0, 0.08)',  // Very light/transparent
      
      openSelectObjectModal:false,
      Furnitures_Checkbox:true,
      Lights_Checkbox:false,
      isDrawing: false,
          isBrushMode: true,  // Track if brush is active or deselect mode is active

      selectedObjectForSwitch: null,
        isDrawingControlsMinimized: false,  

      // Backend communication
      switchingInProgress: false
    }
  },
  
  computed: { 
    // canShowSwitchButton() {
    //   return this.selectedObjects.length >= 1 && !this.drawingMode;
    // },
    // Replace the canShowSwitchButton computed property with this
canShowSwitchButton() {
  if (this.selectedObjects.length === 0 || this.drawingMode) {
    return false;
  }
  
  // Check if all selected objects are from the same category
  if (this.selectedObjects.length > 0) {
    const firstKey = this.selectedObjects[0];
    const baseKey = this.getBaseKeyName(firstKey);
    
    // All selected objects must have the same base key
    const allSameCategory = this.selectedObjects.every(key => 
      this.getBaseKeyName(key) === baseKey
    );
    
    return allSameCategory;
  }
  
  return false;
},
    
    canUndo() {
      return this.currentDrawingHistoryIndex > 0;
    },
    
    canRedo() {
      return this.currentDrawingHistoryIndex < this.drawingHistory.length - 1;
    },
    
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
     handleSwitchFurnitureClicked() {
    const selectedFurniture = this.$refs.switchFurnitureRef.selected_furniture
    console.log('Selected furniture:', selectedFurniture)
    this.openSelectFurnitureModel()
    renderFurnitureSwitching(selectedFurniture)
    // Use the selected furniture as needed
  },
  // render the furniture switching 
   async renderFurnitureSwitching(product_selected){
      if (!this.drawingCanvas || !this.selectedObjectForSwitch) return;
      
    this.switchingInProgress = true;
    
    // Create a merged binary mask of all selected objects + drawing
    const mergedMaskBlob = await this.createMergedBinaryMask();
    
    if (!mergedMaskBlob) {
      throw new Error('Failed to create merged mask');
    }
    
    const formData = new FormData();
    formData.append('mask', mergedMaskBlob, 'refined-mask.png');
    formData.append('product_selected', product_selected.id);
    formData.append('room_id', this.$route.params.id);
    formData.append('object_keys', JSON.stringify(this.selectedObjects));
    formData.append('base_key', this.selectedObjectForSwitch);
    formData.append('original_mask_paths', JSON.stringify(
      this.selectedObjects.reduce((acc, key) => {
        acc[key] = this.objectMasks[key];
        return acc;
      }, {})
    ));
    formData.append('canvas_dimensions', JSON.stringify(this.getCanvasDimensions()));
    
    const response = await fetch(`${this.$store.state.root_api}engine/furniture-switch`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.$store.state.authToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    this.$emit('furniture-switched', {
      objectKeys: this.selectedObjects,
      baseKey: this.selectedObjectForSwitch,
      result: result
    });
    
    },
    validateSelectionSameCategory() {
  if (this.selectedObjects.length === 0) {
    return false;
  }
  
  const baseKeys = new Set(this.selectedObjects.map(key => this.getBaseKeyName(key)));
  
  if (baseKeys.size > 1) {
    this.$message.error('Please select furniture items from the same category');
    return false;
  }
  
  return true;
},
    // =================== SWITCH FURNITURE LOGIC ===================
    
    openSwitchFurnitureMode() {
      if (this.selectedObjects.length === 0) return;
      
      const firstSelectedKey = this.selectedObjects[0];
      const baseKey = this.getBaseKeyName(firstSelectedKey);
      
      const allMatchingKeys = this.objectMaskRegions
        .map(region => region.objectKey)
        .filter(key => this.getBaseKeyName(key) === baseKey);
      
      this.selectedObjects = [...new Set(allMatchingKeys)];
      this.selectedObjectForSwitch = baseKey;
      
      this.drawingMode = true;
      this.initializeDrawingCanvas();
    },
    
    closeSwitchFurnitureMode() {
      this.drawingMode = false;
      this.selectedObjectForSwitch = null;
      this.clearDrawingCanvas();
      this.drawingHistory = [];
      this.currentDrawingHistoryIndex = -1;
      
      this.render();
    },
    
    getBaseKeyName(key) {
      return key.replace(/_\d+$/, '');
    },
    
    // =================== DRAWING CANVAS SETUP ===================
    
    // initializeDrawingCanvas() {
    //   if (!this.drawingCanvas) {
    //     this.drawingCanvas = document.createElement('canvas');
    //     this.drawingCanvas.width = this.canvasWidth;
    //     this.drawingCanvas.height = this.canvasHeight;
    //     this.drawingCanvas.className = 'drawing-overlay-canvas';
    //     this.drawingCanvas.style.position = 'absolute';
    //     this.drawingCanvas.style.top = '0';
    //     this.drawingCanvas.style.left = '0';
    //     this.drawingCanvas.style.zIndex = '3';
    //     this.drawingCanvas.style.cursor = 'crosshair';
    //     this.drawingCanvas.style.pointerEvents = 'auto';
        
    //     this.$refs.canvasContainer.appendChild(this.drawingCanvas);
    //   }
      
    //   this.drawingCtx = this.drawingCanvas.getContext('2d');
    //   this.drawingCanvas.width = this.canvasWidth;
    //   this.drawingCanvas.height = this.canvasHeight;
      
    //   this.saveDrawingState();
    //   this.setupDrawingEventListeners();
    // },
    
    
// Replace initializeDrawingCanvas with this to show highlight on all selected objects
initializeDrawingCanvas() {
  if (!this.drawingCanvas) {
    this.drawingCanvas = document.createElement('canvas');
    this.drawingCanvas.width = this.canvasWidth;
    this.drawingCanvas.height = this.canvasHeight;
    this.drawingCanvas.className = 'drawing-overlay-canvas';
    this.drawingCanvas.style.position = 'absolute';
    this.drawingCanvas.style.top = '0';
    this.drawingCanvas.style.left = '0';
    this.drawingCanvas.style.zIndex = '3';
    this.drawingCanvas.style.cursor = 'crosshair';
    this.drawingCanvas.style.pointerEvents = 'auto';
    
    this.$refs.canvasContainer.appendChild(this.drawingCanvas);
  }
  
  this.drawingCtx = this.drawingCanvas.getContext('2d');
  this.drawingCanvas.width = this.canvasWidth;
  this.drawingCanvas.height = this.canvasHeight;
  
  // Draw highlight for all selected objects on the drawing canvas
  this.drawSelectedFurnitureHighlight();
  
  this.saveDrawingState();
  this.setupDrawingEventListeners();
},

// Add this new method to highlight all selected furniture
drawSelectedFurnitureHighlight() {
  if (!this.drawingCtx) return;
  
  // Clear canvas first
  this.drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  
  // Highlight ONLY selected objects
  this.selectedObjects.forEach(objectKey => {
    const region = this.objectMaskRegions.find(r => r.objectKey === objectKey);
    
    if (region && region.imageData) {
      const imageData = region.imageData;
      const data = imageData.data;
      
      // Draw red highlight with 0.2 opacity
      this.drawingCtx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      
      const step = 1; // Use step 1 for smooth highlight
      
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
              this.drawingCtx.fillRect(startX, y, (x - startX), step);
              startX = -1;
            }
          }
        }
        if (startX !== -1) {
          this.drawingCtx.fillRect(startX, y, (this.canvasWidth - startX), step);
        }
      }
    }
  });
}
,
    clearDrawingCanvas() {
      if (this.drawingCtx) {
        this.drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      }
      
      this.removeDrawingEventListeners();
      
      if (this.drawingCanvas && this.drawingCanvas.parentNode) {
        this.drawingCanvas.parentNode.removeChild(this.drawingCanvas);
        this.drawingCanvas = null;
        this.drawingCtx = null;
      }
    },
    
    // =================== DRAWING EVENT LISTENERS ===================
    
    setupDrawingEventListeners() {
      if (!this.drawingCanvas) return;
      
      this.drawingCanvas.addEventListener('mousedown', this.handleDrawingMouseDown);
      this.drawingCanvas.addEventListener('mousemove', this.handleDrawingMouseMove);
      this.drawingCanvas.addEventListener('mouseup', this.handleDrawingMouseUp);
      this.drawingCanvas.addEventListener('mouseleave', this.handleDrawingMouseLeave);
      this.drawingCanvas.addEventListener('touchstart', this.handleDrawingTouchStart, { passive: false });
      this.drawingCanvas.addEventListener('touchmove', this.handleDrawingTouchMove, { passive: false });
      this.drawingCanvas.addEventListener('touchend', this.handleDrawingTouchEnd);
    },
    
    removeDrawingEventListeners() {
      if (!this.drawingCanvas) return;
      
      this.drawingCanvas.removeEventListener('mousedown', this.handleDrawingMouseDown);
      this.drawingCanvas.removeEventListener('mousemove', this.handleDrawingMouseMove);
      this.drawingCanvas.removeEventListener('mouseup', this.handleDrawingMouseUp);
      this.drawingCanvas.removeEventListener('mouseleave', this.handleDrawingMouseLeave);
      this.drawingCanvas.removeEventListener('touchstart', this.handleDrawingTouchStart);
      this.drawingCanvas.removeEventListener('touchmove', this.handleDrawingTouchMove);
      this.drawingCanvas.removeEventListener('touchend', this.handleDrawingTouchEnd);
    },
    
    // =================== DRAWING MOUSE HANDLERS ===================
    
    // handleDrawingMouseDown(e) {
    //   if (!this.drawingMode || !this.drawingCtx) return;
    //   e.preventDefault();
      
    //   this.isDrawing = true;
    //   const rect = this.drawingCanvas.getBoundingClientRect();
    //   const x = e.clientX - rect.left;
    //   const y = e.clientY - rect.top;
      
    //   this.drawingCtx.beginPath();
    //   this.drawingCtx.moveTo(x, y);
    // },
    
    // handleDrawingMouseMove(e) {
    //   if (!this.isDrawing || !this.drawingCtx) return;
    //   e.preventDefault();
      
    //   const rect = this.drawingCanvas.getBoundingClientRect();
    //   const x = e.clientX - rect.left;
    //   const y = e.clientY - rect.top;
      
    //   this.drawBrushStroke(x, y);
    // },
    
    // handleDrawingMouseUp(e) {
    //   if (!this.drawingMode) return;
    //   e.preventDefault();
      
    //   if (this.isDrawing) {
    //     this.isDrawing = false;
    //     this.drawingCtx.closePath();
    //     this.saveDrawingState();
    //   }
    // },
    
// Also update handleDrawingMouseDown to reset alpha
handleDrawingMouseDown(e) {
  if (!this.drawingMode || !this.drawingCtx) return;
  e.preventDefault();
  
  const rect = this.drawingCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // In deselect mode
  if (!this.isBrushMode) {
    for (let i = this.objectMaskRegions.length - 1; i >= 0; i--) {
      const region = this.objectMaskRegions[i];
      
      if (this.selectedObjects.includes(region.objectKey) && 
          this.isPointInObjectMask(x, y, region.index)) {
        this.toggleObjectSelection(region.objectKey);
        break;
      }
    }
    return; // Don't start drawing in deselect mode
  }
  
  // In brush mode - start drawing
  if (this.isBrushMode) {
    this.isDrawing = true;
    this.drawingCtx.globalAlpha = 0.3;  // Set alpha before drawing
    const ctx = this.drawingCtx;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
},
handleDrawingMouseMove(e) {
  if (!this.isDrawing || !this.drawingCtx || !this.isBrushMode) return;
  e.preventDefault();
  
  const rect = this.drawingCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  this.drawBrushStroke(x, y);
},

handleDrawingMouseUp(e) {
  if (!this.drawingMode) return;
  e.preventDefault();
  
  if (this.isDrawing && this.isBrushMode) {
    this.isDrawing = false;
    this.drawingCtx.closePath();
    this.saveDrawingState();
  }
}
,
    handleDrawingMouseLeave(e) {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.drawingCtx.closePath();
        this.saveDrawingState();
      }
    },
    
    // =================== DRAWING TOUCH HANDLERS ===================
    
    handleDrawingTouchStart(e) {
      if (!this.drawingMode) return;
      e.preventDefault();
      
      if (e.touches.length === 1) {
        this.isDrawing = true;
        const rect = this.drawingCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        this.drawingCtx.beginPath();
        this.drawingCtx.moveTo(x, y);
      }
    },
    
    handleDrawingTouchMove(e) {
      if (!this.isDrawing) return;
      e.preventDefault();
      
      const rect = this.drawingCanvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      this.drawBrushStroke(x, y);
    },
    
    handleDrawingTouchEnd(e) {
      if (!this.drawingMode) return;
      e.preventDefault();
      
      if (this.isDrawing) {
        this.isDrawing = false;
        this.drawingCtx.closePath();
        this.saveDrawingState();
      }
    },
    
    // =================== DRAWING UTILITIES ===================
    
// Update drawBrushStroke to use the new brush color

// Replace your drawBrushStroke method with this
drawBrushStroke(x, y) {
  if (!this.drawingCtx) return;
  
  this.drawingCtx.globalAlpha = 0.3;  // Set transparency to 30%
  this.drawingCtx.strokeStyle = '#FF0000';  // Pure red
  this.drawingCtx.lineWidth = this.brushSize;
  this.drawingCtx.lineCap = 'round';
  this.drawingCtx.lineJoin = 'round';
  this.drawingCtx.lineTo(x, y);
  this.drawingCtx.stroke();
  this.drawingCtx.globalAlpha = 1.0;  // Reset alpha
},

    // Update saveDrawingState to preserve highlight
saveDrawingState() {
  if (!this.drawingCanvas) return;
  
  const imageData = this.drawingCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  
  // Remove any redo history if we're at the end
  if (this.currentDrawingHistoryIndex < this.drawingHistory.length - 1) {
    this.drawingHistory = this.drawingHistory.slice(0, this.currentDrawingHistoryIndex + 1);
  }
  
  this.drawingHistory.push(imageData);
  this.currentDrawingHistoryIndex = this.drawingHistory.length - 1;
},
    
    undoDrawing() {
      if (!this.canUndo) return;
      
      this.currentDrawingHistoryIndex--;
      this.restoreDrawingState();
    },
    
    redoDrawing() {
      if (!this.canRedo) return;
      
      this.currentDrawingHistoryIndex++;
      this.restoreDrawingState();
    },
    
    // restoreDrawingState() {
    //   if (!this.drawingCtx || this.currentDrawingHistoryIndex < 0) return;
      
    //   const imageData = this.drawingHistory[this.currentDrawingHistoryIndex];
    //   this.drawingCtx.putImageData(imageData, 0, 0);
    // },
    
    
    
// Also update your restoreDrawingState to properly refresh after undo/redo
restoreDrawingState() {
  if (!this.drawingCtx || this.currentDrawingHistoryIndex < 0) return;
  
  // First clear canvas
  this.drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  
  // Redraw highlight for only selected objects
  this.drawSelectedFurnitureHighlight();
  
  // Then restore drawing state
  const imageData = this.drawingHistory[this.currentDrawingHistoryIndex];
  
  // Blend the saved drawing on top of the highlight
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = this.canvasWidth;
  tempCanvas.height = this.canvasHeight;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.putImageData(imageData, 0, 0);
  
  this.drawingCtx.drawImage(tempCanvas, 0, 0);
},

// Update resetDrawing to also respect current selections
resetDrawing() {
  if (!this.drawingCtx) return;
  
  this.drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  
  // Redraw highlight for only selected objects
  this.drawSelectedFurnitureHighlight();
  
  this.drawingHistory = [];
  this.currentDrawingHistoryIndex = -1;
  this.saveDrawingState();
},
    // =================== MASK GENERATION & SUBMISSION ===================
    
    // async submitDrawnMask() {
    //   if (!this.drawingCanvas || !this.selectedObjectForSwitch) return;
      
    //   try {
    //     this.switchingInProgress = true;
        
    //     const maskBlob = await new Promise(resolve => {
    //       this.drawingCanvas.toBlob(resolve, 'image/png');
    //     });
        
    //     const formData = new FormData();
    //     formData.append('mask', maskBlob, 'refined-mask.png');
    //     formData.append('room_id', this.$route.params.id);
    //     formData.append('object_keys', JSON.stringify(this.selectedObjects));
    //     formData.append('base_key', this.selectedObjectForSwitch);
    //     formData.append('original_mask_paths', JSON.stringify(
    //       this.selectedObjects.reduce((acc, key) => {
    //         acc[key] = this.objectMasks[key];
    //         return acc;
    //       }, {})
    //     ));
    //     formData.append('canvas_dimensions', JSON.stringify(this.getCanvasDimensions()));
        
    //     const response = await fetch(`${this.$store.state.root_api}/api/furniture/switch`, {
    //       method: 'POST',
    //       body: formData,
    //       headers: {
    //         'Authorization': `Bearer ${this.$store.state.authToken}`
    //       }
    //     });
        
    //     if (!response.ok) {
    //       throw new Error(`Backend error: ${response.statusText}`);
    //     }
        
    //     const result = await response.json();
        
    //     this.$emit('furniture-switched', {
    //       objectKeys: this.selectedObjects,
    //       baseKey: this.selectedObjectForSwitch,
    //       result: result
    //     });
        
    //     this.closeSwitchFurnitureMode();
    //     this.$message.success('Furniture switched successfully!');
        
    //   } catch (error) {
    //     console.error('Error submitting mask:', error);
    //     this.$message.error('Failed to switch furniture. Please try again.');
    //   } finally {
    //     this.switchingInProgress = false;
    //   }
    // },
    
    openSelectFurnitureModel () {
      
      this.openSelectObjectModal = !this.openSelectObjectModal

    },
    // Replace submitDrawnMask with this
    async submitDrawnMask() {
      if (!this.drawingCanvas || !this.selectedObjectForSwitch) return;
      
  try {
    this.switchingInProgress = true;
    
    // Create a merged binary mask of all selected objects + drawing
    const mergedMaskBlob = await this.createMergedBinaryMask();
    
    if (!mergedMaskBlob) {
      throw new Error('Failed to create merged mask');
    }
    
    // Download the merged mask
    this.downloadMask(mergedMaskBlob, `${this.selectedObjectForSwitch}-merged-mask.png`);
    
    // Optionally, also send to backend if needed
    // Uncomment the code below if you want to send to backend as well
    /*
    const formData = new FormData();
    formData.append('mask', mergedMaskBlob, 'refined-mask.png');
    formData.append('room_id', this.$route.params.id);
    formData.append('object_keys', JSON.stringify(this.selectedObjects));
    formData.append('base_key', this.selectedObjectForSwitch);
    formData.append('original_mask_paths', JSON.stringify(
      this.selectedObjects.reduce((acc, key) => {
        acc[key] = this.objectMasks[key];
        return acc;
      }, {})
    ));
    formData.append('canvas_dimensions', JSON.stringify(this.getCanvasDimensions()));
    
    const response = await fetch(`${this.$store.state.root_api}/api/furniture/switch`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.$store.state.authToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    this.$emit('furniture-switched', {
      objectKeys: this.selectedObjects,
      baseKey: this.selectedObjectForSwitch,
      result: result
    });
    */
    
    this.closeSwitchFurnitureMode();
    this.$message.success('Merged binary mask downloaded successfully!');
    
  } catch (error) {
    console.error('Error submitting mask:', error);
    this.$message.error('Failed to create merged mask. Please try again.');
  } finally {
    this.switchingInProgress = false;
  }
},

// Add this new method to create merged binary mask
// async createMergedBinaryMask() {
//   try {
//     // Create a white canvas (base for binary mask)
//     const mergedCanvas = document.createElement('canvas');
//     mergedCanvas.width = this.canvasWidth;
//     mergedCanvas.height = this.canvasHeight;
//     const mergedCtx = mergedCanvas.getContext('2d');
    
//     // Start with black background
//     mergedCtx.fillStyle = '#000000';
//     mergedCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
//     // Merge all selected object masks
//     this.selectedObjects.forEach(objectKey => {
//       const region = this.objectMaskRegions.find(r => r.objectKey === objectKey);
      
//       if (region && region.imageData) {
//         const imageData = region.imageData;
//         const data = imageData.data;
        
//         // Draw white pixels for all masked areas
//         mergedCtx.fillStyle = '#FFFFFF';
        
//         for (let y = 0; y < this.canvasHeight; y++) {
//           let startX = -1;
//           for (let x = 0; x < this.canvasWidth; x++) {
//             const index = (y * this.canvasWidth + x) * 4;
//             const r = data[index];
//             const g = data[index + 1];
//             const b = data[index + 2];
            
//             // Check if pixel is white (masked area)
//             if (r > 200 && g > 200 && b > 200) {
//               if (startX === -1) startX = x;
//             } else {
//               if (startX !== -1) {
//                 mergedCtx.fillRect(startX, y, (x - startX), 1);
//                 startX = -1;
//               }
//             }
//           }
//           if (startX !== -1) {
//             mergedCtx.fillRect(startX, y, (this.canvasWidth - startX), 1);
//           }
//         }
//       }
//     });
    
//     // Now overlay the user's drawing on top of the merged mask
//     // Get the drawing canvas data
//     const drawingImageData = this.drawingCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
//     const drawingData = drawingImageData.data;
    
//     // Get the merged mask data
//     const mergedImageData = mergedCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
//     const mergedData = mergedImageData.data;
    
//     // Blend drawing with merged mask
//     for (let i = 0; i < drawingData.length; i += 4) {
//       const r = drawingData[i];
//       const g = drawingData[i + 1];
//       const b = drawingData[i + 2];
//       const a = drawingData[i + 3];
      
//       // If drawing pixel is red (user drew), make it white in final mask
//       if (r > 200 && g < 100 && b < 100 && a > 100) {
//         mergedData[i] = 255;     // R
//         mergedData[i + 1] = 255; // G
//         mergedData[i + 2] = 255; // B
//         mergedData[i + 3] = 255; // A
//       }
//     }
    
//     // Put the merged data back
//     mergedCtx.putImageData(mergedImageData, 0, 0);
    
//     // Convert canvas to blob
//     return new Promise((resolve, reject) => {
//       mergedCanvas.toBlob(
//         (blob) => {
//           if (blob) {
//             resolve(blob);
//           } else {
//             reject(new Error('Failed to create blob'));
//           }
//         },
//         'image/png'
//       );
//     });
    
//   } catch (error) {
//     console.error('Error creating merged mask:', error);
//     throw error;
//   }
// },

async createMergedBinaryMask() {
  try {
    // Create canvas with BASE IMAGE dimensions, not canvas dimensions
    const mergedCanvas = document.createElement('canvas');
    mergedCanvas.width = this.baseImg.width;   // Use original image width
    mergedCanvas.height = this.baseImg.height; // Use original image height
    const mergedCtx = mergedCanvas.getContext('2d');
    
    // Start with black background
    mergedCtx.fillStyle = '#000000';
    mergedCtx.fillRect(0, 0, this.baseImg.width, this.baseImg.height);
    
    // Merge all selected object masks
    this.selectedObjects.forEach(objectKey => {
      const region = this.objectMaskRegions.find(r => r.objectKey === objectKey);
      
      if (region && region.imageData) {
        const imageData = region.imageData;
        const data = imageData.data;
        
        // Draw white pixels for all masked areas
        mergedCtx.fillStyle = '#FFFFFF';
        
        // Scale calculations based on original image
        const scaleX = this.baseImg.width / this.canvasWidth;
        const scaleY = this.baseImg.height / this.canvasHeight;
        
        for (let y = 0; y < this.canvasHeight; y++) {
          let startX = -1;
          for (let x = 0; x < this.canvasWidth; x++) {
            const index = (y * this.canvasWidth + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            // Check if pixel is white (masked area)
            if (r > 200 && g > 200 && b > 200) {
              if (startX === -1) startX = x;
            } else {
              if (startX !== -1) {
                // Scale coordinates to original image size
                const scaledX = Math.round(startX * scaleX);
                const scaledY = Math.round(y * scaleY);
                const scaledWidth = Math.round((x - startX) * scaleX);
                const scaledHeight = Math.round(scaleY);
                
                mergedCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
                startX = -1;
              }
            }
          }
          if (startX !== -1) {
            const scaledX = Math.round(startX * scaleX);
            const scaledY = Math.round(y * scaleY);
            const scaledWidth = Math.round((this.canvasWidth - startX) * scaleX);
            const scaledHeight = Math.round(scaleY);
            
            mergedCtx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
          }
        }
      }
    });
    
    // Now overlay the user's drawing on top of the merged mask
    const drawingImageData = this.drawingCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    const drawingData = drawingImageData.data;
    
    const mergedImageData = mergedCtx.getImageData(0, 0, this.baseImg.width, this.baseImg.height);
    const mergedData = mergedImageData.data;
    
    // Scale coordinates for drawing overlay
    const scaleX = this.baseImg.width / this.canvasWidth;
    const scaleY = this.baseImg.height / this.canvasHeight;
    
    for (let y = 0; y < this.canvasHeight; y++) {
      for (let x = 0; x < this.canvasWidth; x++) {
        const canvasIndex = (y * this.canvasWidth + x) * 4;
        const r = drawingData[canvasIndex];
        const g = drawingData[canvasIndex + 1];
        const b = drawingData[canvasIndex + 2];
        const a = drawingData[canvasIndex + 3];
        
        // If drawing pixel is red (user drew), make it white in final mask
        if (r > 200 && g < 100 && b < 100 && a > 100) {
          const scaledX = Math.round(x * scaleX);
          const scaledY = Math.round(y * scaleY);
          const mergedIndex = (scaledY * this.baseImg.width + scaledX) * 4;
          
          mergedData[mergedIndex] = 255;     // R
          mergedData[mergedIndex + 1] = 255; // G
          mergedData[mergedIndex + 2] = 255; // B
          mergedData[mergedIndex + 3] = 255; // A
        }
      }
    }
    
    // Put the merged data back
    mergedCtx.putImageData(mergedImageData, 0, 0);
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      mergedCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png'
      );
    });
    
  } catch (error) {
    console.error('Error creating merged mask:', error);
    throw error;
  }
},

// Add this new method to download the mask
downloadMask(blob, filename) {
  try {
    // Create blob URL
    const blobUrl = URL.createObjectURL(blob);
    
    // Create temporary link element
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up blob URL
    URL.revokeObjectURL(blobUrl);
    
    console.log(`Merged mask downloaded as ${filename}`);
    
  } catch (error) {
    console.error('Error downloading mask:', error);
    throw error;
  }
},
    changeBrushSize(newSize) {
      this.brushSize = newSize;
    },

    handleRemovalSuccess() {
      this.$emit('handle_removal_completed', true)
    },

    // =================== OBJECT MASKS CHANGE HANDLING ===================
    
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
    
    // =================== SELECTION CONTROLS ===================
    
    DrawRemoval_model() {
      this.draw_removal_modal = true
    },
    
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
    
    // =================== INITIALIZATION ===================
    
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

    // =================== EVENT LISTENERS ===================
    
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

    // =================== MOUSE & TOUCH HANDLERS ===================
    
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

    // =================== ZOOM & PAN CONTROLS ===================
    
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

    // =================== IMAGE LOADING ===================
    
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

    // =================== OBJECT MASK CACHING ===================
    
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

    // =================== OBJECT MASK PROCESSING ===================
    
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

    // =================== OBJECT INTERACTION ===================
//     handleObjectClick(e) {
//   // Allow clicking even in drawing mode to deselect
//   if (this.isLoading || this.isDragging || this.objectMasksLoading) return;
  
//   if (!this.objectMaskRegions || this.objectMaskRegions.length === 0) {
//     return;
//   }
  
//   const rect = this.canvas.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;
  
//   for (let i = this.objectMaskRegions.length - 1; i >= 0; i--) {
//     const region = this.objectMaskRegions[i];
    
//     if (this.isPointInObjectMask(x, y, region.index)) {
//       // In drawing mode, only allow deselection (removing from selection)
//       if (this.drawingMode) {
//         // Only allow toggling OFF, not adding new items
//         if (this.selectedObjects.includes(region.objectKey)) {
//           this.toggleObjectSelection(region.objectKey);
//         }
//         // If item is not selected and we're in drawing mode, do nothing
//       } else {
//         // Normal mode - allow full toggle
//         this.toggleObjectSelection(region.objectKey);
//       }
//       break;
//     }
//   }
// },


// Update handleObjectClick to properly clear highlight on deselection
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
      if (this.drawingMode) {
        if (this.selectedObjects.includes(region.objectKey)) {
          this.toggleObjectSelection(region.objectKey);
        }
      } else {
        this.toggleObjectSelection(region.objectKey);
      }
      break;
    }
  }
},   
// Update handleObjectHover to show highlight for deselectable items only in drawing mode
// handleObjectHover(e) {
//   if (this.isLoading || this.isDragging || this.objectMasksLoading) return;
  
//   const rect = this.canvas.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;
  
//   let foundObject = null;
  
//   for (let i = this.objectMaskRegions.length - 1; i >= 0; i--) {
//     const region = this.objectMaskRegions[i];
    
//     if (this.isPointInObjectMask(x, y, region.index)) {
//       foundObject = region.objectKey;
//       break;
//     }
//   }
  
//   if (foundObject !== this.hoveredObject) {
//     this.hoveredObject = foundObject;
    
//     if (foundObject) {
//       // In drawing mode, only highlight if it's already selected (can be deselected)
//       if (this.drawingMode && !this.selectedObjects.includes(foundObject)) {
//         this.removeObjectHighlight();
//         this.canvas.style.cursor = 'default';
//       } else {
//         this.highlightObject(foundObject);
//         this.canvas.style.cursor = 'pointer';
//       }
//     } else {
//       this.removeObjectHighlight();
//       this.canvas.style.cursor = this.zoom > 1 ? 'grab' : 'default';
//     }
//   }
// },


// Update handleObjectHover to properly clear overlays
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
      if (this.drawingMode && !this.selectedObjects.includes(foundObject)) {
        // In drawing mode and not selected - clear and don't highlight
        this.overlayCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.canvas.style.cursor = 'default';
      } else {
        // Can interact - show highlight
        this.highlightObject(foundObject);
        this.canvas.style.cursor = 'pointer';
      }
    } else {
      // No object hovered - clear overlay
      this.overlayCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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

    // toggleObjectSelection(objectKey) {
    //   let updatedObjects = [...this.selectedObjects];
    //   const index = updatedObjects.indexOf(objectKey);
      
    //   if (this.selectionMode === 'single') {
    //     updatedObjects = updatedObjects.includes(objectKey) ? [] : [objectKey];
    //   } else {
    //     if (index > -1) {
    //       updatedObjects.splice(index, 1);
    //     } else {
    //       updatedObjects.push(objectKey);
    //     }
    //   }
      
    //   this.selectedObjects = updatedObjects;
    // },
    // Replace your toggleObjectSelection method with this
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
  
  // IMPORTANT: Refresh the drawing canvas highlight immediately
  this.$nextTick(() => {
    if (this.drawingMode && this.drawingCtx) {
      // Clear the drawing canvas
      this.drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      // Redraw only the currently selected objects
      this.drawSelectedFurnitureHighlight();
      
      // Save the updated state
      this.saveDrawingState();
    }
    
    this.removeObjectHighlight();
  });
},


// Update the highlightObject method to handle multiple selections better
highlightObject(objectKey) {
  const region = this.objectMaskRegions.find(r => r.objectKey === objectKey);
  if (!region || !this.overlayCtx) return;

  // Only highlight if the object is selected OR not in drawing mode
  const isSelected = this.selectedObjects.includes(objectKey);
  
  // If in drawing mode and object is not selected, don't show highlight
  if (this.drawingMode && !isSelected) {
    this.overlayCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    return;
  }

  // Clear before drawing
  this.overlayCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  
  this.overlayCtx.save();
  
  this.overlayCtx.translate(this.panX, this.panY);
  this.overlayCtx.scale(this.zoom, this.zoom);
  
  const imageData = region.imageData;
  const data = imageData.data;
  
  // Use different colors for selected vs hovered
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

    // highlightObject(objectKey) {
    //   const region = this.objectMaskRegions.find(r => r.objectKey === objectKey);
    //   if (!region || !this.overlayCtx) return;

    //   this.overlayCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    //   this.overlayCtx.save();
      
    //   this.overlayCtx.translate(this.panX, this.panY);
    //   this.overlayCtx.scale(this.zoom, this.zoom);
      
    //   const imageData = region.imageData;
    //   const data = imageData.data;
      
    //   const isSelected = this.selectedObjects.includes(objectKey);
    //   this.overlayCtx.fillStyle = isSelected ? 'rgba(255, 0, 0, 0.4)' : 'rgba(255, 165, 0, 0.4)';
      
    //   const step = Math.max(1, Math.floor(4 / this.zoom));
      
    //   for (let y = 0; y < this.canvasHeight; y += step) {
    //     let startX = -1;
    //     for (let x = 0; x < this.canvasWidth; x += step) {
    //       const index = (y * this.canvasWidth + x) * 4;
    //       const r = data[index];
    //       const g = data[index + 1];
    //       const b = data[index + 2];
          
    //       if (r > 200 && g > 200 && b > 200) {
    //         if (startX === -1) startX = x;
    //       } else {
    //         if (startX !== -1) {
    //           this.overlayCtx.fillRect(startX / this.zoom, y / this.zoom, (x - startX) / this.zoom, step / this.zoom);
    //           startX = -1;
    //         }
    //       }
    //     }
    //     if (startX !== -1) {
    //       this.overlayCtx.fillRect(startX / this.zoom, y / this.zoom, (this.canvasWidth - startX) / this.zoom, step / this.zoom);
    //     }
    //   }
      
    //   this.overlayCtx.restore();
    // },

    // removeObjectHighlight() {
    //   this.hoveredObject = null;
    //   if (this.overlayCtx) {
    //     this.overlayCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    //   }
    // },
    
// Update removeObjectHighlight to be more thorough
removeObjectHighlight() {
  this.hoveredObject = null;
  if (this.overlayCtx) {
    // Clear the entire overlay canvas
    this.overlayCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    // Make sure to clear saved state
    this.overlayCtx.restore();
  }
},

    // =================== RENDERING ===================
    
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

    // =================== UTILITY METHODS ===================
    
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

    // =================== EVENT EMISSION ===================
    
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

    // =================== PUBLIC API METHODS ===================
    
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





























/* Drawing Mode Styles - Vertical Right Panel */
.drawing-mode-controls {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
  width: 100px;
  max-height: 90vh;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.drawing-mode-controls.minimized {
  width: 100px;
}

.drawing-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.drawing-header h3 {
  margin: 0;
  font-size: 13px;
  color: white;
  font-weight: 600;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  white-space: nowrap;
  flex: 1;
}

.minimize-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.minimize-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.drawing-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  max-height: calc(90vh - 52px);
}

/* Brush Control - Vertical */
.brush-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.brush-control label {
  font-size: 11px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.size-display {
  font-size: 12px;
  font-weight: bold;
  color: #1890ff;
  background: #e6f7ff;
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 40px;
  text-align: center;
}

.brush-slider {
  width: 5px;
  height: 100px;
  border-radius: 5px;
  background: #ddd;
  outline: none;
  -webkit-appearance: slider-vertical;
  appearance: slider-vertical;
  cursor: pointer;
}

.brush-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1890ff;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border: 2px solid white;
}

.brush-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1890ff;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.size-buttons {
  display: flex;
  gap: 4px;
}

.size-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  transition: all 0.2s;
}

.size-btn:hover {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

/* Divider */
.divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, transparent, #ddd, transparent);
}

/* Drawing Actions - Vertical */
.drawing-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Submit Actions - Vertical */
.submit-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Drawing Buttons - Full Width */
.drawing-btn {
  width: 100%;
  padding: 8px 6px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: #f0f0f0;
  color: #333;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.drawing-btn:hover:not(:disabled) {
  background: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.drawing-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.drawing-btn:active:not(:disabled) {
  transform: translateY(0);
}

.drawing-btn.submit-btn {
  background: #52c41a;
  color: white;
}

.drawing-btn.submit-btn:hover:not(:disabled) {
  background: #389e0d;
}

.drawing-btn.cancel-btn {
  background: #ff4d4f;
  color: white;
}

.drawing-btn.cancel-btn:hover:not(:disabled) {
  background: #cf1322;
}

.drawing-btn.reset-btn {
  background: #faad14;
  color: white;
}

.drawing-btn.reset-btn:hover:not(:disabled) {
  background: #d48806;
}

/* Instructions */
.drawing-instructions {
  font-size: 10px;
  color: #999;
  text-align: center;
  line-height: 1.3;
  padding: 8px 4px;
  background: #f9f9f9;
  border-radius: 4px;
}

/* Scrollbar styling */
.drawing-content::-webkit-scrollbar {
  width: 4px;
}

.drawing-content::-webkit-scrollbar-track {
  background: transparent;
}

.drawing-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

.drawing-content::-webkit-scrollbar-thumb:hover {
  background: #999;
}
/* Mode Toggle Buttons */
.mode-toggle {
  display: flex;
  gap: 4px;
  width: 100%;
}

.mode-btn {
  flex: 1;
  padding: 8px 6px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
  white-space: nowrap;
}

.mode-btn:hover {
  background: #e0e0e0;
  border-color: #999;
}

.mode-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.mode-btn.active:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}
</style>