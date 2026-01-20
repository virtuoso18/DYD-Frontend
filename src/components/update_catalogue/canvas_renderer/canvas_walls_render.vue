
<template>

<div class="canvas-container" ref="canvasContainer">
    <!-- Loading Overlay -->
    
<div v-if="isLoading" class="scanning-loading-overlay">
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
      :class="{ 'disabled': isLoading }"
      style="position: absolute; top: 0; left: 0; z-index: 1;"
    ></canvas>

    <!-- Overlay Canvas for Highlights -->
    <canvas
      ref="overlayCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      class="overlay-canvas"
      :class="{ 'disabled': isLoading }"
      style="position: absolute; top: 0; left: 0; z-index: 2; pointer-events: none;"
    ></canvas>

    <!-- Floating Buttons for Wall Selection -->
    <div 
      v-if="showSelectionButtons && !isLoading && isReady" 
      class="floating-buttons" 
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    >
      <button
        v-for="region in maskRegions"
        :key="`wall-${region.maskIndex}`"
        class="wall-button"
        :class="{ 
          'selected': internalSelectedMasks.includes(region.maskIndex),
          'single-mode': selectionMode === 'single',
          'hovered': hoveredMask === region.maskIndex
        }"
        :style="{
          left: region.centerX + 'px',
          top: region.centerY + 'px',
          transform: 'translate(-50%, -50%)'
        }"
        @click="toggleWallSelection(region.maskIndex)"
        @mouseenter="highlightWall(region.maskIndex)"
        @mouseleave="removeHighlight"
        :title="`Wall ${region.maskIndex + 1}`"
      >
        <span class="wall-number">{{ region.maskIndex + 1 }}</span>
        <div v-if="internalSelectedMasks.includes(region.maskIndex)" class="checkmark">✓</div>
      </button>

       <a-button  style="top:20px;margin:auto;pointer-events: all;"
           class="control-btn"
           
           :class="{ 'active': allWallsSelected }"
           @click="toggleSelectAll"
           :disabled="isLoading"
           :title="allWallsSelected ? 'Unselect All' : 'Select All'"
         >
           <!-- <svg  width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
             <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm3.5-5L7 6.5 4.5 9 3 7.5 7 3.5 13 9.5 11.5 11z"/>
            </svg> -->
            <div v-if="allWallsSelected" style="
            width:16px;height:16px;
  background: red;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: white;
  font-weight: bold;
">X</div>
            <div v-else style="
            width:16px;height:16px;
  background: #52c41a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: white;
  font-weight: bold;
">✓</div>
           {{ allWallsSelected ? 'Unselect All' : 'Select All' }} 

         </a-button>
    </div>

    <!-- Selection Controls -->
    <!-- <div v-if="showSelectionButtons && !isLoading && isReady" class="selection-controls"> -->
      <!-- <div class="control-group"> -->
      
      <!-- </div> -->
      
      <!-- Selection Info -->
      <!-- <div class="selection-info" v-if="maskRegions.length > 0">
        <span class="selection-count">
          {{ internalSelectedMasks.length }} of {{ maskRegions.length }} walls selected
        </span>
        <span v-if="selectionMode === 'single'" class="selection-mode">Single Select</span>
        <span v-else class="selection-mode">Multiple Select</span>
      </div> -->
    <!-- </div> -->

    <!-- Processing Indicator -->
    <div v-if="processingMasks" class="processing-overlay">
      <div class="processing-content">
        <div class="processing-spinner"></div>
        <div class="processing-text">
          Processing wall masks...
        </div>
        <div class="processing-progress">
          {{ processingProgress }} / {{ processingTotal }}
        </div>
      </div>
    </div>

    <!-- Zoom Controls -->
    <div v-if="!isLoading" class="zoom-controls">
      <button @click="zoomIn" class="zoom-btn" title="Zoom In">+</button>
      <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
      <button @click="zoomOut" class="zoom-btn" title="Zoom Out">-</button>
      <button @click="resetZoomAndPan" class="zoom-btn reset-btn" title="Reset View">⌂</button>
    </div>

    <div class="rescale-controls" >

      <button
      @click="showFlatSurfaceModal = true"
  class="!px-2 !py-1  whitespace-nowrap !text-black rounded-md btn-text-style flex items-center justify-center"
  type="primary"
  :disabled="isLoading"
  title="Rescale Room Layout"
>
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- circular arrow -->
    <path
      d="M21 12a9 9 0 1 1-2.64-6.36"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      d="M21 3v6h-6"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</button>

    </div>

    

    <!-- Pan Instructions -->
    <div v-if="zoom > 1 && !isLoading" class="instructions">
      Click and drag to pan • Mouse wheel to zoom
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && !hasWallMasks && isReady" class="empty-state">
      <div class="empty-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
        <h3>No Wall Masks Available</h3>
        <p>Wall masks are required to enable wall selection functionality.</p>
      </div>
    </div>
  </div>
  <div className="hidden md:block ">

    <div  class="" style="display:flex;justify-content: space-between;padding-left:10px;padding-right:10px;background: white;">
      
   <div style="padding-top:5px;">
 <div style="display:flex;gap:5px;padding-top:5px;">
     <!-- <a-button 
           class="control-btn"
           :class="{ 'active': allWallsSelected }"
           @click="toggleSelectAll"
           :disabled="isLoading"
           :title="allWallsSelected ? 'Deselect All' : 'Select All'"
         >
           <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
             <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm3.5-5L7 6.5 4.5 9 3 7.5 7 3.5 13 9.5 11.5 11z"/>
           </svg>
           {{ allWallsSelected ? 'Deselect All' : 'Select All' }}
         </a-button> -->
         <!-- <a-button 
         class="control-btn clear-btn"
         @click="clearAllSelections"
         :disabled="internalSelectedMasks.length === 0 || isLoading"
         title="Clear Selection"
         
         >
         <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
           <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
         </svg>
         Clear
       </a-button> -->
       <a-button type='primary' :disabled="isLoading" @click="rescaleRoomLayout()"> 
         Rescale Room layout
       </a-button>
 
 </div>
 </div>
 <div>
   
 <div style="padding-top:5px;display:flex;gap:10px;">
 
   <a-button  class="toolbar-btn primary-btn" @click="reset_entire_room" :disabled="isLoading">
     Before
   </a-button>
   <a-button type="primary" class="toolbar-btn primary-btn" @click="reset_entire_room" :disabled="isLoading">
     After
   </a-button>
 </div>
       </div>
       <div style="padding-top:10px;">
         <a-button type="primary" class="toolbar-btn primary-btn" @click="$emit('Apply-Changes', 'Walls-Renerer')" :disabled="isLoading">
           Finalise Changes
         </a-button>
       </div>
     </div>
  </div>
  <div class="flex flex-wrap md:hidden justify-between px-3  bg-white">

  <!-- LEFT SIDE -->
  <div class="pt-1">
    <div class="flex gap-3 pt-1 pr-1">

      <!-- Select / Deselect All -->

      <!-- <button
  class="flex items-center gap-[3px] !px-4 !py-[6px] bg-[#4e70f9] !text-white whitespace-nowrap rounded-md btn-text-style !text-[12px]"
  :class="{ 'active': allWallsSelected }"
  @click="toggleSelectAll"
  :disabled="isLoading"
  :title="allWallsSelected ? 'Deselect All' : 'Select All'"
>
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm3.5-5L7 6.5 4.5 9 3 7.5 7 3.5 13 9.5 11.5 11z"/>
  </svg>

  {{ allWallsSelected ? 'Deselect All' : 'Select All' }}
</button> -->


      <!-- Clear Button -->
      <!-- <button
        class="control-btn clear-btn !px-4 !py-[2px] bg-[#4e70f9] !text-red rounded-md btn-text-style  !text-[12px]"
        @click="clearAllSelections"
        :disabled="internalSelectedMasks.length === 0 || isLoading"
        title="Clear Selection"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        Clear
      </button> -->

      <!-- Rescale -->
      <!-- <button
        class="!px-1 !py-[1px]  bg-[#4e70f9] whitespace-nowrap !text-white rounded-md btn-text-style  !text-[12px]"
        type="primary"
        :disabled="isLoading"
        @click="rescaleRoomLayout()"
      >
        Rescale Room layout
      </button> -->

    </div>
  </div>

  <!-- MIDDLE -->
  <!-- <div>
    <div class="!pt-2 flex gap-1  pr-1">
      <button
        class="toolbar-btn primary-btn !px-2 !py-[0px] bg-[#4e70f9] !text-white rounded-md btn-text-style  !text-[12px]"
        @click="reset_entire_room"
        :disabled="isLoading"
      >
        Before
      </button>

      <button
        type="primary"
        class="toolbar-btn primary-btn !px-2 !py-[2px] bg-[#4e70f9] !text-white rounded-md btn-text-style  !text-[12px]"
        @click="reset_entire_room"
        :disabled="isLoading"
      >
        After
      </button>
    </div>
  </div> -->

  <!-- RIGHT SIDE -->
  <div class="p-2 ">
 <a-button type="primary" @click="$emit('Apply-Changes', 'Walls-Renerer')" :disabled="isLoading">
           Finalise Changes
         </a-button>
         

</div>


<FlatSurfaceModal
      :isVisible="showFlatSurfaceModal"
      @close="showFlatSurfaceModal = false"
      @continue="handleFlatSurfaceContinue"
    />

</div>

</template>
<script>
import FlatSurfaceModal from '@/components/update_catalogue/FlatSurfaceModal.vue';

export default {
  name: 'walls_renderer',
  components: {
    FlatSurfaceModal
  },
  
// 1. Add maskUpdateTrigger as a prop in child component
props: {
  baseImage: {
    type: String,
    required: true
  },
  binaryMasks: {
    type: Array,
    default: () => []
  },
  selectedMasks: {
    type: Array,
    default: () => []
  },
  // ADD THIS NEW PROP
  maskUpdateTrigger: {
    type: Number,
    default: 0
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
  showSelectionButtons: {
    type: Boolean,
    default: true
  }
},


  data() {
    return {
      // Canvas elements
      canvas: null,
      ctx: null,
      overlayCanvas: null,
      overlayCtx: null,
      
      // Images
      baseImg: null,
      maskImages: [],
      
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
      
      // Mask processing
      maskRegions: [],
      maskImageData: [],
      hoveredMask: -1,
      isImagesLoaded: false,
      
      // Processing states
      processingMasks: false,
      processingProgress: 0,
      processingTotal: 0,
      
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
      showFlatSurfaceModal: false,
      
      // Internal selected masks (for immediate UI updates)
      internalSelectedMasks: []
      
    }
  },

  computed: {
    hasWallMasks() {
      return this.binaryMasks && this.binaryMasks.length > 0;
    },
    
    isReady() {
      return !this.isLoading && this.baseImg && this.isImagesLoaded;
    },
    
    allWallsSelected() {
      return this.maskRegions.length > 0 && 
             this.internalSelectedMasks.length === this.maskRegions.length;
    },
    
    someWallsSelected() {
      return this.internalSelectedMasks.length > 0 && 
             this.internalSelectedMasks.length < this.maskRegions.length;
    }
  },
  mounted() {
  this.setupResizeObserver();
  this.updateCanvasDimensions();
  this.initCanvas();
  this.setupEventListeners();
  this.internalSelectedMasks = [...this.selectedMasks];
  this.loadImages();
},

  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.removeEventListeners();
  },
  
// 2. Enhanced watch handlers in child component
watch: {
  baseImage: {
    handler(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log('🖼️ Base image changed, reloading...');
        this.loadImages();
      }
    },
    immediate: false
  },
  
  binaryMasks: {
    handler(newVal, oldVal) {
      // Check if the arrays are actually different
      const isDifferent = JSON.stringify(newVal) !== JSON.stringify(oldVal);
      
      if (isDifferent) {
        console.log('🧱 Binary masks changed, reloading...', newVal.length, 'masks');
        this.loadImages();
      }
    },
    deep: true,
    immediate: false
  },
  
  // ADD THIS NEW WATCHER FOR THE TRIGGER
  maskUpdateTrigger: {
    handler(newVal) {
      console.log('🔥 Mask update trigger activated:', newVal);
      this.loadImages();
    },
    immediate: false
  },
  
  selectedMasks: {
    handler(newVal) {
      this.internalSelectedMasks = [...newVal];
    },
    deep: true
  },
  
  isLoading(newVal) {
    if (newVal) {
      this.removeEventListeners();
    } else {
      this.setupEventListeners();
    }
  }
},


  
  methods: {

     handleFlatSurfaceContinue() {
      // Your rescale logic here
      this.rescaleRoomLayout()
      console.log('Continue with flat surface detection')
    },
    
    rescaleRoomLayout() {
      // Your existing rescale logic
      console.log('Rescaling room layout...')
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
            this.updateButtonPositions();
          });
        });
        
        if (this.$refs.canvasContainer) {
          this.resizeObserver.observe(this.$refs.canvasContainer);
        }
      } else {
        // Fallback for older browsers
        window.addEventListener('resize', this.handleWindowResize);
      }
    },

    handleWindowResize() {
      this.updateCanvasDimensions();
      this.$nextTick(() => {
        this.render();
        this.updateButtonPositions();
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
      
      if (!this.canvas) {
        console.error('Canvas ref not found');
        return;
      }
      
      this.ctx = this.canvas.getContext('2d');
      
      if (this.overlayCanvas) {
        this.overlayCtx = this.overlayCanvas.getContext('2d');
      }
      
      // Set initial background
      this.ctx.fillStyle = '#f0f0f0';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    },

    // ===================
    // EVENT LISTENERS
    // ===================
    
    setupEventListeners() {
      if (!this.canvas || this.isLoading) return;
      
      // Mouse events
      this.canvas.addEventListener('wheel', this.handleWheel, { passive: false });
      this.canvas.addEventListener('mousedown', this.handleMouseDown);
      this.canvas.addEventListener('mousemove', this.handleMouseMove);
      this.canvas.addEventListener('mouseup', this.handleMouseUp);
      this.canvas.addEventListener('mouseleave', this.handleMouseUp);
      this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
      
      // Touch events for mobile
      this.canvas.addEventListener('touchstart', this.handleTouchStart);
      this.canvas.addEventListener('touchmove', this.handleTouchMove);
      this.canvas.addEventListener('touchend', this.handleTouchEnd);
    },

    removeEventListeners() {
      if (!this.canvas) return;
      
      this.canvas.removeEventListener('wheel', this.handleWheel);
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseup', this.handleMouseUp);
      this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
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
        // Zoom towards mouse position
        const imageX = (mouseX - this.panX) / this.zoom;
        const imageY = (mouseY - this.panY) / this.zoom;
        
        this.zoom = newZoom;
        this.panX = mouseX - imageX * this.zoom;
        this.panY = mouseY - imageY * this.zoom;
        
        this.constrainPan();
        this.render();
        this.updateButtonPositions();
      }
    },

    handleMouseDown(e) {
      if (this.isLoading) return;
      
      if (e.button === 0 || e.button === 2) { // Left or right click
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
        this.updateButtonPositions();
        e.preventDefault();
      } else {
        // Update cursor based on zoom level
        this.canvas.style.cursor = this.zoom > 1 ? 'grab' : 'default';
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

    // Touch events for mobile devices
    handleTouchStart(e) {
      if (this.isLoading) return;
      //e.preventDefault();
      
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
     // e.preventDefault();
      
      if (this.isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.dragStartX;
        const deltaY = touch.clientY - this.dragStartY;
        
        this.panX = this.dragStartPanX + deltaX;
        this.panY = this.dragStartPanY + deltaY;
        
        this.constrainPan();
        this.render();
        this.updateButtonPositions();
      }
    },

    handleTouchEnd(e) {
      if (this.isLoading) return;
    //  e.preventDefault();
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
      
      // Calculate boundaries
      const maxPanX = Math.max(0, zoomedImageWidth + zoomedImageLeft - this.canvasWidth);
      const minPanX = Math.min(0, -zoomedImageLeft);
      const maxPanY = Math.max(0, zoomedImageHeight + zoomedImageTop - this.canvasHeight);
      const minPanY = Math.min(0, -zoomedImageTop);
      
      // Apply constraints
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
      this.updateButtonPositions();
    },

    resetZoomAndPan() {
      if (this.isLoading) return;
      
      this.zoom = 1;
      this.panX = 0;
      this.panY = 0;
      this.render();
      this.updateButtonPositions();
    },

    // ===================
    // IMAGE LOADING
    // ===================
    
// 3. Enhanced loadImages method in child component
async loadImages() {
  if (!this.baseImage) {
    console.warn('No base image provided');
    return;
  }
  
  console.log('🔄 Starting image reload process...');
  
  // Reset state immediately
  this.isImagesLoaded = false;
  this.maskRegions = [];
  this.maskImageData = [];
  
  // Clear any existing highlights
  this.removeHighlight();
  
  try {
    // Load base image first
    console.log('📸 Loading base image...');
    this.baseImg = await this.createImageFromSrc(this.baseImage);
    this.calculateImageDimensions();
    this.render();
    
    // Load wall masks if available
    if (this.hasWallMasks && this.showSelectionButtons) {
      console.log('🧱 Loading wall masks...', this.binaryMasks.length, 'masks');
      await this.loadWallMasks();
    }
    
    this.isImagesLoaded = true;
    
    // Force re-render
    this.render();
    this.updateButtonPositions();
    
    console.log('✅ Image loading completed successfully');
    
  } catch (error) {
    console.error('❌ Error loading images:', error);
    this.showErrorState();
  }
},

    async loadWallMasks() {
      console.log('🧱 Loading wall masks...');
      
      this.processingMasks = true;
      this.processingTotal = this.binaryMasks.length;
      this.processingProgress = 0;
      
      try {
        // Load all mask images in parallel
        const maskPromises = this.binaryMasks.map(async (maskSrc, index) => {
          try {
            const img = await this.createImageFromSrc(maskSrc);
            this.processingProgress = index + 1;
            return { img, index, src: maskSrc };
          } catch (error) {
            console.error(`Failed to load mask ${index}:`, error);
            return null;
          }
        });
        
        const maskResults = await Promise.all(maskPromises);
        this.maskImages = maskResults.filter(mask => mask !== null);
        
        // Process mask regions asynchronously
        await this.processMaskRegions();
        
      } catch (error) {
        console.error('Error loading wall masks:', error);
      } finally {
        this.processingMasks = false;
        this.processingProgress = 0;
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
        // Image is wider than canvas
        this.renderWidth = maxWidth;
        this.renderHeight = Math.round(maxWidth / imgAspectRatio);
        this.renderOffsetX = 0;
        this.renderOffsetY = Math.round((maxHeight - this.renderHeight) / 2);
      } else {
        // Image is taller than canvas
        this.renderHeight = maxHeight;
        this.renderWidth = Math.round(maxHeight * imgAspectRatio);
        this.renderOffsetX = Math.round((maxWidth - this.renderWidth) / 2);
        this.renderOffsetY = 0;
      }
      
      this.scaleX = this.renderWidth / this.baseImg.width;
      this.scaleY = this.renderHeight / this.baseImg.height;
    },

    // ===================
    // MASK PROCESSING
    // ===================
    
// 2. Add this new method to select all masks after they're processed
async processMaskRegions() {
  if (!this.showSelectionButtons) return;
  
  console.log('🚀 Processing mask regions...');
  
  this.maskRegions = [];
  this.maskImageData = [];
  
  const batchSize = 3;
  
  for (let i = 0; i < this.maskImages.length; i += batchSize) {
    const batch = this.maskImages.slice(i, i + batchSize);
    
    // Process batch
    await this.processMaskBatch(batch, i);
    
    // Yield to browser
    await this.yieldToBrowser();
  }
  
  // Resolve overlapping buttons
  this.maskRegions = this.resolveOverlappingButtons(this.maskRegions);
  
  // NEW: Auto-select all masks if none are currently selected
  if (this.internalSelectedMasks.length === 0) {
    this.selectAllWallsOnInit();
  }
  
  console.log(`✅ Processed ${this.maskRegions.length} wall masks`);
},

// 3. Add this new method for initial selection
selectAllWallsOnInit() {
  const allIndices = this.maskRegions.map(region => region.maskIndex);
  this.internalSelectedMasks = [...allIndices];
  this.emitSelectionChange();
  console.log('🔄 Auto-selected all walls on initialization');
},
    async processMaskBatch(maskBatch, startIndex) {
      return new Promise((resolve) => {
        setTimeout(() => {
          maskBatch.forEach((maskData, batchIndex) => {
            if (!maskData || !maskData.img) return;
            
            const globalIndex = startIndex + batchIndex;
            const result = this.processSingleMask(maskData, globalIndex);
            
            if (result) {
              this.maskRegions.push(result);
            }
          });
          resolve();
        }, 0);
      });
    },

    // processSingleMask(maskData, index) {
    //   try {
    //     const tempCanvas = document.createElement('canvas');
    //     tempCanvas.width = this.canvasWidth;
    //     tempCanvas.height = this.canvasHeight;
    //     const tempCtx = tempCanvas.getContext('2d');
        
    //     // Fill with black background
    //     tempCtx.fillStyle = '#000000';
    //     tempCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
    //     // Draw mask
    //     tempCtx.drawImage(
    //       maskData.img,
    //       this.renderOffsetX,
    //       this.renderOffsetY,
    //       this.renderWidth,
    //       this.renderHeight
    //     );
        
    //     const imageData = tempCtx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    //     this.maskImageData[index] = imageData;
        
    //     const center = this.findMaskCenter(imageData);
        
    //     if (center) {
    //       return {
    //         maskIndex: index,
    //         centerX: center.x,
    //         centerY: center.y,
    //         originalCenterX: center.x,
    //         originalCenterY: center.y,
    //         imageData: imageData
    //       };
    //     }
        
    //     return null;
        
    //   } catch (error) {
    //     console.error(`Error processing mask ${index}:`, error);
    //     return null;
    //   }
    // },

    processSingleMask(maskData, index) {
  const imgW = this.baseImg.width;
  const imgH = this.baseImg.height;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imgW;
  tempCanvas.height = imgH;

  const ctx = tempCanvas.getContext('2d');

  ctx.drawImage(maskData.img, 0, 0, imgW, imgH);

  const imageData = ctx.getImageData(0, 0, imgW, imgH);
  this.maskImageData[index] = imageData;

  const center = this.findMaskCenterImageSpace(imageData, imgW, imgH);

  return {
    maskIndex: index,
    imageX: center.x,   // 🔥 IMAGE SPACE
    imageY: center.y,   // 🔥 IMAGE SPACE
  };
},
findMaskCenterImageSpace(imageData, width, height) {
  const data = imageData.data;
  let sx = 0, sy = 0, count = 0;

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const i = (y * width + x) * 4;
      if (data[i] > 200) {
        sx += x;
        sy += y;
        count++;
      }
    }
  }

  if (!count) return null;
  return { x: sx / count, y: sy / count };
}
,

    findMaskCenter(imageData) {
      const data = imageData.data;
      let totalX = 0, totalY = 0, whitePixels = 0;
      
      // Sample every 4th pixel for performance
      const step = 4;
      
      for (let y = 0; y < this.canvasHeight; y += step) {
        for (let x = 0; x < this.canvasWidth; x += step) {
          const index = (y * this.canvasWidth + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          if (r > 200 && g > 200 && b > 200) {
            totalX += x;
            totalY += y;
            whitePixels++;
          }
        }
      }
      
      if (whitePixels > 0) {
        return {
          x: Math.round(totalX / whitePixels),
          y: Math.round(totalY / whitePixels)
        };
      }
      
      return null;
    },

    resolveOverlappingButtons(regions) {
      const buttonSize = 32;
      const minDistance = buttonSize + 8;
      const resolvedRegions = [];

      for (let i = 0; i < regions.length; i++) {
        let currentRegion = { ...regions[i] };
        let positionFound = false;
        let attempts = 0;
        const maxAttempts = 20;

        while (!positionFound && attempts < maxAttempts) {
          let hasOverlap = false;

          for (let j = 0; j < resolvedRegions.length; j++) {
            const distance = Math.sqrt(
              Math.pow(currentRegion.centerX - resolvedRegions[j].centerX, 2) +
              Math.pow(currentRegion.centerY - resolvedRegions[j].centerY, 2)
            );

            if (distance < minDistance) {
              hasOverlap = true;
              break;
            }
          }

          if (!hasOverlap) {
            positionFound = true;
            resolvedRegions.push(currentRegion);
          } else {
            const angle = (attempts * 45) % 360;
            const offset = Math.min(20 + (attempts * 5), 50);
            
            const newX = currentRegion.centerX + Math.cos(angle * Math.PI / 180) * offset;
            const newY = currentRegion.centerY + Math.sin(angle * Math.PI / 180) * offset;

            const margin = buttonSize / 2;
            currentRegion.centerX = Math.max(margin, Math.min(this.canvasWidth - margin, newX));
            currentRegion.centerY = Math.max(margin, Math.min(this.canvasHeight - margin, newY));
          }

          attempts++;
        }

        if (!positionFound) {
          const randomOffsetX = (Math.random() - 0.5) * 40;
          const randomOffsetY = (Math.random() - 0.5) * 40;
          currentRegion.centerX += randomOffsetX;
          currentRegion.centerY += randomOffsetY;
          
          const margin = buttonSize / 2;
          currentRegion.centerX = Math.max(margin, Math.min(this.canvasWidth - margin, currentRegion.centerX));
          currentRegion.centerY = Math.max(margin, Math.min(this.canvasHeight - margin, currentRegion.centerY));
          
          resolvedRegions.push(currentRegion);
        }
      }

      return resolvedRegions;
    },

    yieldToBrowser() {
      return new Promise(resolve => setTimeout(resolve, 0));
    },

    // ===================
    // WALL SELECTION
    // ===================
    
    toggleWallSelection(maskIndex) {
      if (this.isLoading) return;
      
      let updatedMasks = [...this.internalSelectedMasks];

      if (this.selectionMode === 'single') {
        updatedMasks = updatedMasks.includes(maskIndex) ? [] : [maskIndex];
      } else {
        const index = updatedMasks.indexOf(maskIndex);
        if (index > -1) {
          updatedMasks.splice(index, 1);
        } else {
          updatedMasks.push(maskIndex);
        }
      }

      this.internalSelectedMasks = updatedMasks;
      this.emitSelectionChange();
    },

    selectAllWalls() {
      if (this.isLoading || !this.showSelectionButtons) return;
      
      const allIndices = this.maskRegions.map(region => region.maskIndex);
      this.internalSelectedMasks = [...allIndices];
      this.emitSelectionChange();
    },

    clearAllSelections() {
      if (this.isLoading) return;
      
      this.internalSelectedMasks = [];
      this.removeHighlight();
      this.emitSelectionChange();
    },

    toggleSelectAll() {
      if (this.allWallsSelected) {
        this.clearAllSelections();
      } else {
        this.selectAllWalls();
      }
    },

    highlightWall(maskIndex) {
      if (this.isLoading || !this.showSelectionButtons) return;
      
      this.hoveredMask = maskIndex;
      this.drawWallHighlight(maskIndex);
    },

    removeHighlight() {
      this.hoveredMask = -1;
      if (this.overlayCtx) {
        this.overlayCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      }
    },

    // drawWallHighlight(maskIndex) {
    //   if (!this.maskImageData[maskIndex] || !this.overlayCtx) return;

    //   this.overlayCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    //   this.overlayCtx.save();
      
    //   this.overlayCtx.translate(this.panX, this.panY);
    //   this.overlayCtx.scale(this.zoom, this.zoom);
      
    //   const imageData = this.maskImageData[maskIndex];
    //   const data = imageData.data;
      
    //   this.overlayCtx.fillStyle = 'rgba(0, 255, 255, 0.3)';
      
    //   // Optimized highlighting - draw rectangles for consecutive pixels
    //   for (let y = 0; y < this.canvasHeight; y += 2) {
    //     let startX = -1;
    //     for (let x = 0; x < this.canvasWidth; x += 2) {
    //       const index = (y * this.canvasWidth + x) * 4;
    //       const r = data[index];
    //       const g = data[index + 1];
    //       const b = data[index + 2];
          
    //       if (r > 200 && g > 200 && b > 200) {
    //         if (startX === -1) startX = x;
    //       } else {
    //         if (startX !== -1) {
    //           this.overlayCtx.fillRect(
    //             startX / this.zoom, 
    //             y / this.zoom, 
    //             (x - startX) / this.zoom, 
    //             2 / this.zoom
    //           );
    //           startX = -1;
    //         }
    //       }
    //     }
    //     if (startX !== -1) {
    //       this.overlayCtx.fillRect(
    //         startX / this.zoom, 
    //         y / this.zoom, 
    //         (this.canvasWidth - startX) / this.zoom, 
    //         2 / this.zoom
    //       );
    //     }
    //   }
      
    //   this.overlayCtx.restore();
    // },
drawWallHighlight(maskIndex) {
  const imageData = this.maskImageData[maskIndex];
  if (!imageData || !this.overlayCtx) return;

  const ctx = this.overlayCtx;
  ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  ctx.save();

  // 1️⃣ Same pan + zoom as base image
  ctx.translate(this.panX, this.panY);
  ctx.scale(this.zoom, this.zoom);

  // 2️⃣ Move to image render position
  ctx.translate(this.renderOffsetX, this.renderOffsetY);

  // 3️⃣ Scale mask to rendered image size
  const scaleX = this.renderWidth / imageData.width;
  const scaleY = this.renderHeight / imageData.height;
  ctx.scale(scaleX, scaleY);

  const data = imageData.data;
  ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';

  const step = 2;

  for (let y = 0; y < imageData.height; y += step) {
    let startX = -1;

    for (let x = 0; x < imageData.width; x += step) {
      const idx = (y * imageData.width + x) * 4;
      const r = data[idx];

      if (r > 200) {
        if (startX === -1) startX = x;
      } else if (startX !== -1) {
        ctx.fillRect(
          startX,
          y,
          x - startX,
          step
        );
        startX = -1;
      }
    }

    if (startX !== -1) {
      ctx.fillRect(
        startX,
        y,
        imageData.width - startX,
        step
      );
    }
  }

  ctx.restore();
}

,
imageDataToCanvas(imageData) {
  const c = document.createElement('canvas');
  c.width = imageData.width;
  c.height = imageData.height;
  c.getContext('2d').putImageData(imageData, 0, 0);
  return c;
}
,
    // ===================
    // RENDERING
    // ===================
    
    render() {
      if (!this.canvas || !this.ctx) return;

      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      // Fill background
      this.ctx.fillStyle = '#f5f5f5';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      if (!this.baseImg) {
        this.showLoadingState();
        return;
      }
      
      this.ctx.save();
      
      // Apply transformations
      this.ctx.translate(this.panX, this.panY);
      this.ctx.scale(this.zoom, this.zoom);
      
      try {
        // Draw image
        this.ctx.drawImage(
          this.baseImg,
          this.renderOffsetX,
          this.renderOffsetY,
          this.renderWidth,
          this.renderHeight
        );
        
        // Add subtle border
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.lineWidth = 1 / this.zoom;
        this.ctx.strokeRect(
          this.renderOffsetX,
          this.renderOffsetY,
          this.renderWidth,
          this.renderHeight
        );
        
        // Show processing indicator if needed
        if (this.processingMasks) {
          this.drawProcessingIndicator();
        }
        
      } catch (error) {
        console.error('Error rendering image:', error);
        this.showErrorState();
      }
      
      this.ctx.restore();
    },

    showLoadingState() {
      this.ctx.fillStyle = '#f0f0f0';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.fillStyle = '#666';
      this.ctx.font = '18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Loading image...', this.canvasWidth / 2, this.canvasHeight / 2);
    },

    showErrorState() {
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

    drawProcessingIndicator() {
      this.ctx.save();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      
      const padding = 20;
      const x = this.canvasWidth - 250 - padding;
      const y = padding;
      const width = 250;
      const height = 35;
      
      // Background
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.roundRect(x, y, width, height, 15);
      this.ctx.fill();
      
      // Progress bar
      const progressX = x + 15;
      const progressY = y + 8;
      const progressWidth = width - 80;
      const progressHeight = 6;
      
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.roundRect(progressX, progressY, progressWidth, progressHeight, 3);
      this.ctx.fill();
      
      const progressPercent = this.processingTotal > 0 ? 
        (this.processingProgress / this.processingTotal) * 100 : 0;
      const fillWidth = (progressWidth * progressPercent) / 100;
      
      this.ctx.fillStyle = '#52c41a';
      this.ctx.roundRect(progressX, progressY, fillWidth, progressHeight, 3);
      this.ctx.fill();
      
      // Text
      this.ctx.fillStyle = 'white';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'left';
      this.ctx.fillText('Processing walls...', progressX, progressY - 2);
      
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`${Math.round(progressPercent)}%`, x + width - 15, y + 21);
      
      this.ctx.restore();
    },

    // updateButtonPositions() {
    //   if (!this.showSelectionButtons) return;
      
    //   this.maskRegions.forEach(region => {
    //     if (!region.originalCenterX) {
    //       region.originalCenterX = region.centerX;
    //       region.originalCenterY = region.centerY;
    //     }
        
    //     region.centerX = region.originalCenterX * this.zoom + this.panX;
    //     region.centerY = region.originalCenterY * this.zoom + this.panY;
    //   });
    // },
    updateButtonPositions() {
  this.maskRegions.forEach(r => {
    r.centerX =
      (r.imageX * this.scaleX + this.renderOffsetX) * this.zoom + this.panX;

    r.centerY =
      (r.imageY * this.scaleY + this.renderOffsetY) * this.zoom + this.panY;
  });
},


    // ===================
    // EVENT EMISSION
    // ===================
    rescaleRoomLayout(){
      this.$emit('rescale-room-layout', true);

    },
    emitSelectionChange() {
      const selectionData = {
        selectedMasks: [...this.internalSelectedMasks],
        selectionMode: this.selectionMode,
        maskSources: this.internalSelectedMasks.map(index => this.binaryMasks[index]),
        canvasDimensions: {
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
        },
        maskRegions: this.maskRegions.filter(region => 
          this.internalSelectedMasks.includes(region.maskIndex)
        )
      };
      
      // Emit to parent component
      this.$emit('selection-changed', selectionData);
      this.$emit('update:selectedMasks', this.internalSelectedMasks);
      
      console.log('🔄 Wall selection changed:', {
        selected: this.internalSelectedMasks.length,
        total: this.maskRegions.length
      });
    },

    // ===================
    // UTILITY METHODS
    // ===================
    
    getCanvasState() {
      return {
        zoom: this.zoom,
        panX: this.panX,
        panY: this.panY,
        canvasWidth: this.canvasWidth,
        canvasHeight: this.canvasHeight,
        renderWidth: this.renderWidth,
        renderHeight: this.renderHeight,
        renderOffsetX: this.renderOffsetX,
        renderOffsetY: this.renderOffsetY,
        selectedMasks: [...this.internalSelectedMasks],
        maskRegions: this.maskRegions
      };
    },

    getSelectedWallsData() {
      return {
        selectedMasks: [...this.internalSelectedMasks],
        selectedRegions: this.maskRegions.filter(region => 
          this.internalSelectedMasks.includes(region.maskIndex)
        ),
        maskSources: this.internalSelectedMasks.map(index => this.binaryMasks[index])
      };
    },

    // ===================
    // PUBLIC METHODS
    // ===================
    
    refreshCanvas() {
      console.log('🔄 Refreshing walls canvas...');
      this.loadImages();
    },

    updateImage(newImageSrc) {
      this.baseImage = newImageSrc;
      this.loadImages();
    },

    updateMasks(newMasks) {
      this.binaryMasks = newMasks;
      this.loadImages();
    },

    setSelectionMode(mode) {
      if (['single', 'multiple'].includes(mode)) {
        this.selectionMode = mode;
        
        // If switching to single mode and multiple are selected, keep only the first
        if (mode === 'single' && this.internalSelectedMasks.length > 1) {
          this.internalSelectedMasks = [this.internalSelectedMasks[0]];
          this.emitSelectionChange();
        }
      }
    },

    // ===================
    // DEBUG METHODS
    // ===================
    
    debugCanvasState() {
      console.log('🐛 Canvas Debug State:', {
        hasBaseImage: !!this.baseImg,
        maskCount: this.maskImages.length,
        regionCount: this.maskRegions.length,
        selectedCount: this.internalSelectedMasks.length,
        isLoading: this.isLoading,
        isImagesLoaded: this.isImagesLoaded,
        processingMasks: this.processingMasks,
        canvasDimensions: `${this.canvasWidth}x${this.canvasHeight}`,
        renderDimensions: `${this.renderWidth}x${this.renderHeight}`,
        zoom: this.zoom,
        pan: `${this.panX}, ${this.panY}`
      });
    }
  }
}

</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 83vh;
  min-height: 300px;
  overflow: hidden;
  background: #f5f5f5;
  /* border-radius: 8px; */
  border: 1px solid #e1e5e9;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
  border-radius: 8px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-left: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.btn-text-style {
  font-family: Poppins;
  font-weight: 300;
  font-style: Medium;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0%;
}

.main-canvas {
  display: block;
  transition: opacity 0.2s ease;
  cursor: default;
}

.main-canvas.disabled {
  opacity: 0.6;
  pointer-events: none;
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

.rescale-controls {
  position: absolute;
  bottom: 34px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  background:rgba(255, 255, 255, 0.6);
  padding: 8px 12px;
  border-radius: 20px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45); */
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
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  text-align: center;
  z-index: 5;
  pointer-events: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .zoom-controls {
    top: 8px;
    right: 8px;
    padding: 6px 8px;
    gap: 6px;
  }
  
  .zoom-btn {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
  
  .zoom-level {
    font-size: 11px;
    min-width: 32px;
  }
  
  .instructions {
    bottom: 8px;
    font-size: 10px;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .canvas-container {
    min-height: 250px;
  }
  
  .zoom-controls {
    top: 4px;
    right: 4px;
    padding: 4px 6px;
    gap: 4px;
  }
  
  .zoom-btn {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
  
  .zoom-level {
    font-size: 10px;
    min-width: 28px;
  }
  
  .instructions {
    bottom: 4px;
    font-size: 9px;
    padding: 4px 8px;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .zoom-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .main-canvas {
    touch-action: pan-y;
  }
}
/* Add these styles to your existing CSS */

/* Floating Buttons */
.floating-buttons {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10;
}

.wall-button {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(24, 144, 255, 0.9);
  border: 2px solid white;
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 15;
}

.wall-button:hover {
  background: rgba(24, 144, 255, 1);
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.wall-button.selected {
  background: rgba(82, 196, 26, 0.9);
  border-color: #52c41a;
}

.wall-button.selected:hover {
  background: rgba(82, 196, 26, 1);
}

.wall-button.single-mode.selected {
  background: rgba(255, 77, 79, 0.9);
  border-color: #ff4d4f;
}

.wall-button.hovered {
  transform: translate(-50%, -50%) scale(1.15);
}

.wall-number {
  font-size: 11px;
  font-weight: 600;
}

.checkmark {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  background: #52c41a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: white;
  font-weight: bold;
}

/* Selection Controls */
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
  max-width: 500px;
  width: 100%;     /* optional: ensures responsive shrink */
  padding: 10px;
  border-radius: 8px; /* optional: looks cleaner */
}


.control-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #333;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #1890ff;
  color: #1890ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.control-btn.active {
  background: #1890ff;
  border-color: #1890ff;
  color: white;
}

.control-btn.active:hover {
  background: #40a9ff;
  border-color: #40a9ff;
  color: white;
}

.control-btn.clear-btn {
  background: rgba(255, 255, 255, 0.95);
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.control-btn.clear-btn:hover:not(:disabled) {
  background: #ff4d4f;
  color: white;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.control-btn:disabled:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: #d9d9d9;
  color: #333;
  transform: none;
}

.selection-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 6px;
  font-size: 11px;
  min-width: 140px;
}

.selection-count {
  color: white;
  font-weight: 500;
}

.selection-mode {
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
}

/* Processing Overlay */
.processing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  border-radius: 10px;
}

.processing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.processing-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.processing-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.processing-progress {
  font-size: 12px;
  color: #666;
}

/* Empty State */
.empty-state {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.empty-content {
  text-align: center;
  color: #999;
  max-width: 300px;
}

.empty-content svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: #666;
}

.empty-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

/* Overlay Canvas */
.overlay-canvas {
  pointer-events: none;
}

.overlay-canvas.disabled {
  opacity: 0.5;
}

.zoom-level {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  min-width: 40px;
  text-align: center;
}

/* Instructions */
.instructions {
  position: absolute;
  bottom: 70px;
  right: 20px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  border-radius: 6px;
  font-size: 11px;
  z-index: 20;
}

/* Responsive Design */
@media (max-width: 768px) {
  .selection-controls {
    top: 10px;
    left: 10px;
  }
.canvas-container {
    height: 100%;
}
  .control-btn {
    padding: 6px 10px;
    font-size: 11px;
  }
  
  .wall-button {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }
  
  
  
  .zoom-btn {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .instructions {
    bottom: 50px;
    right: 10px;
    font-size: 10px;
  }
}

/* Animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Loading Spinner (if not already defined) */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 50;
  border-radius: 10px;
}

.loading-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
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
  background: rgba(20, 20, 20, 0.55);
  backdrop-filter: blur(0.1px); 
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