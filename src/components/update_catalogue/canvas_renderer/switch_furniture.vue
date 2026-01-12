<!-- SwitchFurnitureModal.vue - Improved Child Component -->
<template>
  <a-modal
    v-model:visible="isVisible"
    :title="`Refine ${formatObjectName(baseKey)} Boundaries`"
    width="90%"
    :centered="true"
    :body-style="{ padding: '12px', height: '80vh', overflow: 'hidden' }"
    :footer="null"
    @cancel="handleClose"
  >
    <a-row>
      <a-col :span="18">
        <!-- Canvas Container -->
        <div
          class="modal-canvas-container"
          ref="modalCanvasContainer"
          style="flex: 1; position: relative; overflow: hidden; border-radius: 8px; background: #f5f5f5;"
        >
          <!-- Main Canvas (Image) -->
          <canvas
            ref="modalCanvas"
            :width="modalCanvasWidth"
            :height="modalCanvasHeight"
            class="modal-main-canvas"
            :class="{ disabled: isLoading }"
          ></canvas>

          <!-- Overlay Canvas (Highlights) -->
          <canvas
            ref="modalOverlayCanvas"
            :width="modalCanvasWidth"
            :height="modalCanvasHeight"
            class="modal-overlay-canvas"
            :class="{ disabled: isLoading }"
            style="position: absolute; top: 0; left: 0; z-index: 2; pointer-events: none;"
          ></canvas>

          <!-- Drawing Canvas (User Brush Strokes) -->
          <canvas
            ref="drawingCanvasRef"
            :width="modalCanvasWidth"
            :height="modalCanvasHeight"
            class="modal-drawing-canvas"
            :class="{ disabled: isLoading }"
            style="position: absolute; top: 0; left: 0; z-index: 3; cursor: crosshair;"
          ></canvas>

          <!-- Zoom Controls -->
          <div class="modal-zoom-controls">
            <button @click="modalZoomIn" class="modal-zoom-btn" title="Zoom In">+</button>
            <span class="modal-zoom-level">{{ Math.round(modalZoom * 100) }}%</span>
            <button @click="modalZoomOut" class="modal-zoom-btn" title="Zoom Out">−</button>
            <button @click="modalResetZoomAndPan" class="modal-zoom-btn reset-btn" title="Reset View">
              ⌂
            </button>
          </div>
        </div>
      </a-col>
      <a-col :span="6">
        <!-- Control Panel -->
        <div class="modal-control-panel">
          <!-- Mode Toggle -->
          <div style="display: flex; gap: 8px;">
            <button
              @click="isBrushMode = true"
              :class="['modal-mode-btn', { active: isBrushMode }]"
              title="Brush Mode"
            >
              🖌️ Brush
            </button>
            <button
              @click="isBrushMode = false"
              :class="['modal-mode-btn', { active: !isBrushMode }]"
              title="Deselect Mode"
            >
              ✕ Deselect
            </button>
          </div>

          <!-- Brush Size Control (only in brush mode) -->
          <div v-if="isBrushMode" style="display: flex; gap: 8px; align-items: center;">
            <label style="font-size: 12px; font-weight: 600; min-width: 60px;">Brush:</label>
            <input
              type="range"
              min="5"
              max="50"
              :value="brushSize"
              @input="changeBrushSize($event.target.value)"
              class="modal-brush-slider"
              style="flex: 1;"
            />
            <span style="font-size: 11px; min-width: 30px; text-align: right;">{{ brushSize }}px</span>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 8px;">
            <button
              @click="undoDrawing"
              :disabled="!canUndo || !isBrushMode"
              class="modal-action-btn undo-btn"
              title="Undo"
            >
              ↶ Undo
            </button>

            <button
              @click="redoDrawing"
              :disabled="!canRedo || !isBrushMode"
              class="modal-action-btn redo-btn"
              title="Redo"
            >
              ↷ Redo
            </button>

            <button
              @click="resetDrawing"
              class="modal-action-btn reset-btn"
              title="Reset"
            >
              🔄 Reset
            </button>
          </div>

          <!-- Submit Actions -->
          <div style="display: flex; gap: 8px;">
            <a-button
              type="primary"
              class="modal-submit-btn"
              @click="handleApplyChanges"
              :loading="isProcessing"
              style="flex: 1;"
            >
              ✓ Apply & Select Furniture
            </a-button>

            <a-button
              danger
              style="flex: 1;"
              @click="handleClose"
              :disabled="isProcessing"
            >
              ✕ Cancel
            </a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
export default {
  name: 'SwitchFurnitureModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    baseImage: {
      type: String,
      required: true,
    },
    baseKey: {
      type: String,
      required: true,
    },
    selectedObjects: {
      type: Array,
      required: true,
    },
    objectMaskRegions: {
      type: Array,
      required: true,
    },
    objectMaskImageData: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible', 'apply-changes', 'close'],
  data() {
    return {
      // ========== PERFORMANCE & PIXELATION SETTINGS ==========
      highlightPixelStep: 3,
      hoverPixelStep: 3,

      // Canvas references
      modalCanvas: null,
      modalCanvasCtx: null,
      modalOverlayCanvas: null,
      modalOverlayCtx: null,
      drawingCanvas: null,
      drawingCtx: null,
      modalCanvasWidth: 800,
      modalCanvasHeight: 600,
      resizeObserver: null,

      // Image rendering
      baseImg: null,
      modalRenderWidth: 800,
      modalRenderHeight: 600,
      modalRenderOffsetX: 0,
      modalRenderOffsetY: 0,
      modalScaleX: 1,
      modalScaleY: 1,

      // Zoom and pan
      modalZoom: 1,
      modalMinZoom: 1.0,
      modalMaxZoom: 5,
      modalPanX: 0,
      modalPanY: 0,
      modalIsDragging: false,
      modalDragStartX: 0,
      modalDragStartY: 0,
      modalDragStartPanX: 0,
      modalDragStartPanY: 0,

      // Drawing
      drawingHistory: [],
      currentDrawingHistoryIndex: -1,
      brushSize: 10,
      isDrawing: false,
      isBrushMode: true,
      lastDrawX: 0,
      lastDrawY: 0,

      // State
      isProcessing: false,
      hoveredObject: null,
    };
  },

  computed: {
    isVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit('update:visible', value);
      },
    },

    canUndo() {
      return this.currentDrawingHistoryIndex > 0;
    },

    canRedo() {
      return this.currentDrawingHistoryIndex < this.drawingHistory.length - 1;
    },
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.initializeModal();
        });
      } else {
        this.cleanupModal();
      }
    },

    baseImage() {
      if (this.visible) {
        this.loadImage();
      }
    },
  },

  methods: {
    // ============== INITIALIZATION ==============

    async initializeModal() {
      try {
        await this.loadImage();
        this.$nextTick(() => {
          this.initializeCanvases();
          this.setupEventListeners();
          this.renderImage();
          this.drawSelectedFurnitureHighlight();
          this.saveDrawingState();
        });
      } catch (error) {
        console.error('Error initializing modal:', error);
        this.$message.error('Failed to initialize modal');
      }
    },

    cleanupModal() {
      this.removeEventListeners();
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      if (this.drawingCtx) {
        this.drawingCtx.clearRect(0, 0, this.modalCanvasWidth, this.modalCanvasHeight);
      }
      if (this.modalOverlayCtx) {
        this.modalOverlayCtx.clearRect(0, 0, this.modalCanvasWidth, this.modalCanvasHeight);
      }
      this.drawingHistory = [];
      this.currentDrawingHistoryIndex = -1;
      this.modalZoom = 1;
      this.modalPanX = 0;
      this.modalPanY = 0;
      this.isDrawing = false;
      this.hoveredObject = null;
    },

    // ============== CANVAS INITIALIZATION ==============

    initializeCanvases() {
      const container = this.$refs.modalCanvasContainer;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      this.modalCanvasWidth = Math.floor(rect.width);
      this.modalCanvasHeight = Math.floor(rect.height);

      this.modalCanvas = this.$refs.modalCanvas;
      this.modalOverlayCanvas = this.$refs.modalOverlayCanvas;
      this.drawingCanvas = this.$refs.drawingCanvasRef;

      if (!this.modalCanvas || !this.modalOverlayCanvas || !this.drawingCanvas) {
        console.error('Canvas refs not found');
        return;
      }

      this.modalCanvasCtx = this.modalCanvas.getContext('2d');
      this.modalOverlayCtx = this.modalOverlayCanvas.getContext('2d');
      this.drawingCtx = this.drawingCanvas.getContext('2d');

      // Set physical sizes - MUST match display size
      this.modalCanvas.width = this.modalCanvasWidth;
      this.modalCanvas.height = this.modalCanvasHeight;
      this.modalOverlayCanvas.width = this.modalCanvasWidth;
      this.modalOverlayCanvas.height = this.modalCanvasHeight;
      this.drawingCanvas.width = this.modalCanvasWidth;
      this.drawingCanvas.height = this.modalCanvasHeight;

      // Setup resize observer to handle modal resizing
      this.setupResizeObserver();
    },

    setupResizeObserver() {
      if (typeof ResizeObserver === 'undefined' || !this.$refs.modalCanvasContainer) return;

      this.resizeObserver = new ResizeObserver(() => {
        const rect = this.$refs.modalCanvasContainer.getBoundingClientRect();
        const newWidth = Math.floor(rect.width);
        const newHeight = Math.floor(rect.height);

        // Only update if size actually changed
        if (newWidth !== this.modalCanvasWidth || newHeight !== this.modalCanvasHeight) {
          this.modalCanvasWidth = newWidth;
          this.modalCanvasHeight = newHeight;

          // Resize all canvases
          if (this.modalCanvas) {
            this.modalCanvas.width = this.modalCanvasWidth;
            this.modalCanvas.height = this.modalCanvasHeight;
          }
          if (this.modalOverlayCanvas) {
            this.modalOverlayCanvas.width = this.modalCanvasWidth;
            this.modalOverlayCanvas.height = this.modalCanvasHeight;
          }
          if (this.drawingCanvas) {
            this.drawingCanvas.width = this.modalCanvasWidth;
            this.drawingCanvas.height = this.modalCanvasHeight;
          }

          // Re-render everything
          this.$nextTick(() => {
            this.renderImage();
            this.drawSelectedFurnitureHighlight();
            this.syncOverlayTransform();
          });
        }
      });

      this.resizeObserver.observe(this.$refs.modalCanvasContainer);
    },

    // ============== IMAGE LOADING ==============

    async loadImage() {
      if (!this.baseImage) {
        console.warn('No base image provided');
        return;
      }

      try {
        this.baseImg = await this.createImageFromSrc(this.baseImage);
        this.calculateImageDimensions();
        // Re-render highlight after image loads
        this.$nextTick(() => {
          this.drawSelectedFurnitureHighlight();
        });
      } catch (error) {
        console.error('Error loading image:', error);
        this.$message.error('Failed to load image');
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

      const maxWidth = this.modalCanvasWidth;
      const maxHeight = this.modalCanvasHeight;

      const imgAspectRatio = this.baseImg.width / this.baseImg.height;
      const canvasAspectRatio = maxWidth / maxHeight;

      if (imgAspectRatio > canvasAspectRatio) {
        this.modalRenderWidth = maxWidth;
        this.modalRenderHeight = Math.round(maxWidth / imgAspectRatio);
        this.modalRenderOffsetX = 0;
        this.modalRenderOffsetY = Math.round((maxHeight - this.modalRenderHeight) / 2);
      } else {
        this.modalRenderHeight = maxHeight;
        this.modalRenderWidth = Math.round(maxHeight * imgAspectRatio);
        this.modalRenderOffsetX = Math.round((maxWidth - this.modalRenderWidth) / 2);
        this.modalRenderOffsetY = 0;
      }

      this.modalScaleX = this.modalRenderWidth / this.baseImg.width;
      this.modalScaleY = this.modalRenderHeight / this.baseImg.height;
    },

    // ============== RENDERING ==============

    renderImage() {
      if (!this.modalCanvas || !this.modalCanvasCtx) return;

      this.modalCanvasCtx.clearRect(0, 0, this.modalCanvasWidth, this.modalCanvasHeight);
      this.modalCanvasCtx.fillStyle = '#f5f5f5';
      this.modalCanvasCtx.fillRect(0, 0, this.modalCanvasWidth, this.modalCanvasHeight);

      if (!this.baseImg) return;

      this.modalCanvasCtx.save();
      this.modalCanvasCtx.translate(this.modalPanX, this.modalPanY);
      this.modalCanvasCtx.scale(this.modalZoom, this.modalZoom);

      try {
        this.modalCanvasCtx.drawImage(
          this.baseImg,
          this.modalRenderOffsetX,
          this.modalRenderOffsetY,
          this.modalRenderWidth,
          this.modalRenderHeight
        );
      } catch (error) {
        console.error('Error rendering image:', error);
      }

      this.modalCanvasCtx.restore();
    },

    drawSelectedFurnitureHighlight() {
      if (!this.drawingCtx || !this.selectedObjects.length || !this.objectMaskImageData.length) return;

      // Clear drawing canvas first
      this.drawingCtx.clearRect(0, 0, this.modalCanvasWidth, this.modalCanvasHeight);

      this.selectedObjects.forEach((objectKey) => {
        // Find by objectKey in the region, then use that index
        const region = this.objectMaskRegions.find((r) => r.objectKey === objectKey);
        
        if (region && region.index !== undefined && this.objectMaskImageData[region.index]) {
          const imageData = this.objectMaskImageData[region.index].imageData;
          
          // Verify imageData dimensions match canvas
          if (imageData.width !== this.modalCanvasWidth || imageData.height !== this.modalCanvasHeight) {
            console.warn(`Image data size mismatch for ${objectKey}: expected ${this.modalCanvasWidth}x${this.modalCanvasHeight}, got ${imageData.width}x${imageData.height}`);
            return;
          }

          const data = imageData.data;

          // Red highlight for selected objects
          this.drawingCtx.fillStyle = 'rgba(255, 100, 100, 0.25)';

          const step = 1; // Smooth highlight on drawing canvas

          for (let y = 0; y < this.modalCanvasHeight; y += step) {
            let startX = -1;
            for (let x = 0; x < this.modalCanvasWidth; x += step) {
              const index = (y * this.modalCanvasWidth + x) * 4;
              const r = data[index];
              const g = data[index + 1];
              const b = data[index + 2];

              if (r > 200 && g > 200 && b > 200) {
                if (startX === -1) startX = x;
              } else {
                if (startX !== -1) {
                  this.drawingCtx.fillRect(startX, y, x - startX, step);
                  startX = -1;
                }
              }
            }
            if (startX !== -1) {
              this.drawingCtx.fillRect(startX, y, this.modalCanvasWidth - startX, step);
            }
          }
        }
      });
    },

    drawPersistentSelectionHighlight() {
      if (!this.modalOverlayCtx || this.selectedObjects.length === 0) return;

      this.modalOverlayCtx.clearRect(0, 0, this.modalCanvasWidth, this.modalCanvasHeight);

      this.modalOverlayCtx.save();
      this.modalOverlayCtx.translate(this.modalPanX, this.modalPanY);
      this.modalOverlayCtx.scale(this.modalZoom, this.modalZoom);

      this.selectedObjects.forEach((objectKey) => {
        const region = this.objectMaskRegions.find((r) => r.objectKey === objectKey);

        if (region && region.imageData) {
          const imageData = region.imageData;
          const data = imageData.data;

          this.modalOverlayCtx.fillStyle = 'rgba(255, 0, 0, 0.4)';

          const step = this.highlightPixelStep;

          for (let y = 0; y < this.modalCanvasHeight; y += step) {
            let startX = -1;
            for (let x = 0; x < this.modalCanvasWidth; x += step) {
              const index = (y * this.modalCanvasWidth + x) * 4;
              const r = data[index];
              const g = data[index + 1];
              const b = data[index + 2];

              if (r > 200 && g > 200 && b > 200) {
                if (startX === -1) startX = x;
              } else {
                if (startX !== -1) {
                  this.modalOverlayCtx.fillRect(startX, y, x - startX, step);
                  startX = -1;
                }
              }
            }
            if (startX !== -1) {
              this.modalOverlayCtx.fillRect(startX, y, this.modalCanvasWidth - startX, step);
            }
          }
        }
      });

      this.modalOverlayCtx.restore();
    },

    drawHoverHighlight(objectKey) {
      const region = this.objectMaskRegions.find((r) => r.objectKey === objectKey);
      if (!region || !this.modalOverlayCtx) return;

      this.modalOverlayCtx.save();
      this.modalOverlayCtx.translate(this.modalPanX, this.modalPanY);
      this.modalOverlayCtx.scale(this.modalZoom, this.modalZoom);

      const imageData = region.imageData;
      const data = imageData.data;

      this.modalOverlayCtx.fillStyle = 'rgba(255, 165, 0, 0.4)';

      const step = this.hoverPixelStep;

      for (let y = 0; y < this.modalCanvasHeight; y += step) {
        let startX = -1;
        for (let x = 0; x < this.modalCanvasWidth; x += step) {
          const index = (y * this.modalCanvasWidth + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];

          if (r > 200 && g > 200 && b > 200) {
            if (startX === -1) startX = x;
          } else {
            if (startX !== -1) {
              this.modalOverlayCtx.fillRect(startX, y, x - startX, step);
              startX = -1;
            }
          }
        }
        if (startX !== -1) {
          this.modalOverlayCtx.fillRect(startX, y, this.modalCanvasWidth - startX, step);
        }
      }

      this.modalOverlayCtx.restore();
    },

    syncOverlayTransform() {
      if (!this.modalOverlayCtx) return;

      if (this.selectedObjects.length > 0) {
        this.drawPersistentSelectionHighlight();
      } else if (this.hoveredObject) {
        this.drawHoverHighlight(this.hoveredObject);
      } else {
        this.modalOverlayCtx.clearRect(0, 0, this.modalCanvasWidth, this.modalCanvasHeight);
      }
    },

    // ============== DRAWING FUNCTIONS ==============

    drawBrushStroke(x, y, isStart = false) {
      if (!this.drawingCtx) return;

      this.drawingCtx.globalAlpha = 0.4;
      this.drawingCtx.strokeStyle = '#FF4444';
      this.drawingCtx.lineWidth = this.brushSize;
      this.drawingCtx.lineCap = 'round';
      this.drawingCtx.lineJoin = 'round';

      if (isStart) {
        this.drawingCtx.beginPath();
        this.drawingCtx.moveTo(x, y);
      } else {
        this.drawingCtx.lineTo(x, y);
        this.drawingCtx.stroke();
      }

      this.drawingCtx.globalAlpha = 1.0;
    },

    saveDrawingState() {
      if (!this.drawingCanvas) return;

      const imageData = this.drawingCtx.getImageData(0, 0, this.modalCanvasWidth, this.modalCanvasHeight);

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

    restoreDrawingState() {
      if (!this.drawingCtx || this.currentDrawingHistoryIndex < 0) return;

      this.drawingCtx.clearRect(0, 0, this.modalCanvasWidth, this.modalCanvasHeight);
      this.drawSelectedFurnitureHighlight();

      const imageData = this.drawingHistory[this.currentDrawingHistoryIndex];
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.modalCanvasWidth;
      tempCanvas.height = this.modalCanvasHeight;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.putImageData(imageData, 0, 0);

      this.drawingCtx.drawImage(tempCanvas, 0, 0);
    },

    resetDrawing() {
      if (!this.drawingCtx) return;

      this.drawingCtx.clearRect(0, 0, this.modalCanvasWidth, this.modalCanvasHeight);
      this.drawSelectedFurnitureHighlight();
      this.drawingHistory = [];
      this.currentDrawingHistoryIndex = -1;
      this.saveDrawingState();
    },

    changeBrushSize(newSize) {
      this.brushSize = parseInt(newSize);
    },

    // ============== ZOOM & PAN ==============

    setupEventListeners() {
      if (!this.drawingCanvas || !this.modalCanvas) return;

      this.boundHandleWheel = this.handleWheel.bind(this);
      this.boundHandleMouseDown = this.handleMouseDown.bind(this);
      this.boundHandleMouseMove = this.handleMouseMove.bind(this);
      this.boundHandleMouseUp = this.handleMouseUp.bind(this);
      this.boundHandleMouseLeave = this.handleMouseLeave.bind(this);

      // Zoom on main canvas
      this.modalCanvas.addEventListener('wheel', this.boundHandleWheel, { passive: false });
      this.modalCanvas.addEventListener('mousedown', this.boundHandleMouseDown);
      this.modalCanvas.addEventListener('mousemove', this.boundHandleMouseMove);
      this.modalCanvas.addEventListener('mouseup', this.boundHandleMouseUp);
      this.modalCanvas.addEventListener('mouseleave', this.boundHandleMouseLeave);

      // Drawing on drawing canvas
      this.drawingCanvas.addEventListener('mousedown', this.boundHandleMouseDown);
      this.drawingCanvas.addEventListener('mousemove', this.boundHandleMouseMove);
      this.drawingCanvas.addEventListener('mouseup', this.boundHandleMouseUp);
      this.drawingCanvas.addEventListener('mouseleave', this.boundHandleMouseLeave);
    },

    removeEventListeners() {
      if (!this.modalCanvas || !this.drawingCanvas) return;

      this.modalCanvas.removeEventListener('wheel', this.boundHandleWheel);
      this.modalCanvas.removeEventListener('mousedown', this.boundHandleMouseDown);
      this.modalCanvas.removeEventListener('mousemove', this.boundHandleMouseMove);
      this.modalCanvas.removeEventListener('mouseup', this.boundHandleMouseUp);
      this.modalCanvas.removeEventListener('mouseleave', this.boundHandleMouseLeave);

      this.drawingCanvas.removeEventListener('mousedown', this.boundHandleMouseDown);
      this.drawingCanvas.removeEventListener('mousemove', this.boundHandleMouseMove);
      this.drawingCanvas.removeEventListener('mouseup', this.boundHandleMouseUp);
      this.drawingCanvas.removeEventListener('mouseleave', this.boundHandleMouseLeave);
    },

    handleWheel(e) {
      e.preventDefault();

      const rect = this.modalCanvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(this.modalMinZoom, Math.min(this.modalMaxZoom, this.modalZoom * zoomFactor));

      if (newZoom !== this.modalZoom) {
        const imageX = (mouseX - this.modalPanX) / this.modalZoom;
        const imageY = (mouseY - this.modalPanY) / this.modalZoom;

        this.modalZoom = newZoom;
        this.modalPanX = mouseX - imageX * this.modalZoom;
        this.modalPanY = mouseY - imageY * this.modalZoom;

        this.constrainPan();
        this.renderImage();
        this.syncOverlayTransform();
      }
    },

    handleMouseDown(e) {
      const rect = this.drawingCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (this.isBrushMode && e.target === this.drawingCanvas) {
        this.isDrawing = true;
        this.lastDrawX = x;
        this.lastDrawY = y;
        this.drawBrushStroke(x, y, true);
        e.preventDefault();
      } else if (!this.isBrushMode) {
        this.modalIsDragging = true;
        this.modalDragStartX = e.clientX;
        this.modalDragStartY = e.clientY;
        this.modalDragStartPanX = this.modalPanX;
        this.modalDragStartPanY = this.modalPanY;
        this.drawingCanvas.style.cursor = 'grabbing';
        e.preventDefault();
      }
    },

    handleMouseMove(e) {
      const rect = this.drawingCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (this.isDrawing && this.isBrushMode) {
        this.drawBrushStroke(x, y, false);
      } else if (this.modalIsDragging && !this.isBrushMode) {
        const deltaX = e.clientX - this.modalDragStartX;
        const deltaY = e.clientY - this.modalDragStartY;

        this.modalPanX = this.modalDragStartPanX + deltaX;
        this.modalPanY = this.modalDragStartPanY + deltaY;

        this.constrainPan();
        this.renderImage();
        this.syncOverlayTransform();
        e.preventDefault();
      }
    },

    handleMouseUp(e) {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveDrawingState();
        e.preventDefault();
      }

      if (this.modalIsDragging) {
        this.modalIsDragging = false;
        this.drawingCanvas.style.cursor = this.isBrushMode ? 'crosshair' : (this.modalZoom > 1 ? 'grab' : 'default');
        e.preventDefault();
      }
    },

    handleMouseLeave(e) {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveDrawingState();
      }
      this.handleMouseUp(e);
    },

    constrainPan() {
      if (!this.baseImg) return;

      const zoomedImageWidth = this.modalRenderWidth * this.modalZoom;
      const zoomedImageHeight = this.modalRenderHeight * this.modalZoom;
      const zoomedImageLeft = this.modalRenderOffsetX * this.modalZoom;
      const zoomedImageTop = this.modalRenderOffsetY * this.modalZoom;

      const maxPanX = Math.max(0, zoomedImageWidth + zoomedImageLeft - this.modalCanvasWidth);
      const minPanX = Math.min(0, -zoomedImageLeft);
      const maxPanY = Math.max(0, zoomedImageHeight + zoomedImageTop - this.modalCanvasHeight);
      const minPanY = Math.min(0, -zoomedImageTop);

      this.modalPanX = Math.max(-maxPanX, Math.min(minPanX, this.modalPanX));
      this.modalPanY = Math.max(-maxPanY, Math.min(minPanY, this.modalPanY));
    },

    modalZoomIn() {
      const newZoom = Math.min(this.modalMaxZoom, this.modalZoom * 1.2);
      if (newZoom !== this.modalZoom) {
        this.zoomToCenter(newZoom);
      }
    },

    modalZoomOut() {
      const newZoom = Math.max(this.modalMinZoom, this.modalZoom / 1.2);
      if (newZoom !== this.modalZoom) {
        this.zoomToCenter(newZoom);
      }
    },

    zoomToCenter(newZoom) {
      const centerX = this.modalCanvasWidth / 2;
      const centerY = this.modalCanvasHeight / 2;

      const imageX = (centerX - this.modalPanX) / this.modalZoom;
      const imageY = (centerY - this.modalPanY) / this.modalZoom;

      this.modalZoom = newZoom;
      this.modalPanX = centerX - imageX * this.modalZoom;
      this.modalPanY = centerY - imageY * this.modalZoom;

      this.constrainPan();
      this.renderImage();
      this.syncOverlayTransform();
    },

    modalResetZoomAndPan() {
      this.modalZoom = 1;
      this.modalPanX = 0;
      this.modalPanY = 0;
      this.renderImage();
      this.syncOverlayTransform();
    },

    // ============== EVENT HANDLERS ==============

    async handleApplyChanges() {
      try {
        this.isProcessing = true;

        const drawingBlob = await new Promise((resolve) => {
          this.drawingCanvas.toBlob(resolve, 'image/png');
        });

        this.$emit('apply-changes', {
          drawingBlob,
          selectedObjects: this.selectedObjects,
          baseKey: this.baseKey,
        });

        this.$message.success('Furniture refined successfully!');
        this.handleClose();
      } catch (error) {
        console.error('Error applying changes:', error);
        this.$message.error('Failed to apply changes');
      } finally {
        this.isProcessing = false;
      }
    },

    handleClose() {
      this.$emit('close');
      this.isVisible = false;
    },

    formatObjectName(objectKey) {
      if (!objectKey) return '';
      return objectKey.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    },
  },
};
</script>

<style scoped>
.modal-canvas-container {
  position: relative;
  width: 100%;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
}

.modal-main-canvas {
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
  z-index: 1;
}

.modal-overlay-canvas {
  border-radius: 8px;
  pointer-events: none;
}

.modal-drawing-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.modal-zoom-controls {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.95);
  padding: 6px 10px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 5;
}

.modal-zoom-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: #1890ff;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.modal-zoom-btn:hover {
  background: #40a9ff;
  transform: scale(1.05);
}

.modal-zoom-btn.reset-btn {
  font-size: 10px;
}

.modal-zoom-level {
  font-size: 11px;
  font-weight: 500;
  color: #666;
  min-width: 32px;
  text-align: center;
}

.modal-control-panel {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #e0e0e0;
  height: 100%;
  overflow-y: auto;
}

.modal-mode-btn {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  background: #fafafa;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
}

.modal-mode-btn:hover {
  border-color: #40a9ff;
  background: #e6f7ff;
}

.modal-mode-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.modal-brush-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: slider-horizontal;
  appearance: slider-horizontal;
}

.modal-brush-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #1890ff;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  border: 2px solid white;
}

.modal-brush-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #1890ff;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.modal-action-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: #fafafa;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.modal-action-btn:hover:not(:disabled) {
  background: #e0e0e0;
  border-color: #999;
}

.modal-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-action-btn.undo-btn:hover:not(:disabled) {
  background: #e6f7ff;
  border-color: #40a9ff;
}

.modal-action-btn.redo-btn:hover:not(:disabled) {
  background: #e6f7ff;
  border-color: #40a9ff;
}

.modal-action-btn.reset-btn:hover:not(:disabled) {
  background: #fff7e6;
  border-color: #faad14;
}

.modal-submit-btn {
  border-radius: 6px;
  font-weight: 600;
  height: 36px;
}

.modal-main-canvas.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.modal-overlay-canvas.disabled {
  opacity: 0.5;
}

.modal-drawing-canvas.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>