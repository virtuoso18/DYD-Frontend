<template>
   <a-modal
    v-model:open="isShowInstructionModal"
    title="Instructions"
    @ok="closeInstructionModal"
    :width="500"
  >
    <div class="instruction-item" v-for="item in instructionConfig" :key="item">
      <span class="instruction">{{ item?.key }}</span>
      <img :src="item?.value" alt="gesture" class="gesture-icon" />
    </div>
  </a-modal>
  <div class="canvas-container" ref="canvasContainer">
    <img
        class="absolute top-[5px] right-[10px] cursor-pointer z-9 w-[25px] md:hidden"
        src="../../../assets/icons/informationIcon.svg"
        alt="instruction"
        @click="showInstructionModal"
        title="see instruction"
      />
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="scanning-loading-overlay">
      <div
        class="loading-screen"
        :style="{
          backgroundImage: backgroundImageUrl
            ? `url(${backgroundImageUrl})`
            : 'none',
        }"
      >
        <div class="wave-overlay"></div>
        <div class="loading-text">
          <div class="process-text">{{ loadingMessage }}</div>
        </div>
      </div>
    </div>

    <!-- Main Canvas -->
    <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      class="main-canvas"
      :class="{ disabled: isLoading }"
    ></canvas>

    <!-- Zoom Controls -->
    <!-- <div v-if="!isLoading" class="zoom-controls">
      <button @click="zoomIn" class="zoom-btn" title="Zoom In">+</button>
      <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
      <button @click="zoomOut" class="zoom-btn" title="Zoom Out">-</button>
      <button
      @click="resetZoomAndPan"
      class="zoom-btn reset-btn"
      title="Reset View"
      >
      ⌂
    </button>
  </div> -->
    

    <!-- Pan Instructions -->
    <div v-if="zoom > 1 && !isLoading && !isTouchDevice" class="instructions">
      Click and drag to pan • Mouse wheel to zoom
    </div>
    <div v-else-if="zoom > 1 && !isLoading && isTouchDevice" class="instructions">
      Pinch in to zoom in & Pinch out to zoom out
    </div>
  </div>
  <div
    class="apply-wrapper"
    style="
      display: flex;
      justify-content: space-between;
      padding-left: 10px;
      padding-right: 10px;
    "
  >
    <div style="display: flex; gap: 5px; padding-top: 10px">
      <a-button
        :disabled="isLoading"
        class="toolbar-btn primary-btn"
        @click="reset_entire_room"
      >
        Before
      </a-button>
      <a-button
        :disabled="isLoading"
        type="primary"
        class="toolbar-btn primary-btn"
        @click="reset_entire_room"
      >
        After
      </a-button>
    </div>
    <div style="padding-top: 10px">
      <a-button
        :disabled="isLoading"
        type="primary"
        class="toolbar-btn primary-btn"
        @click="$emit('Apply-Changes', 'floor-Renerer')"
      >
        Finalise Changes
      </a-button>
    </div>
  </div>
</template>

<script>
import ZoomInIcon from "@/assets/icons/zoomout.png";
import ZoomOutIcon from "@/assets/icons/zoomin.png";
export default {
  name: "floor_renderer",
  props: {
    baseImage: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    backgroundImageUrl: {
      type: String,
      default: "",
    },
    loadingMessage: {
      type: String,
      default: "Loading Room...",
    },
  },

  data() {
    return {
      isShowInstructionModal: false,
      instructionConfig: [
        {
          key: "Pinch out zoom out",
          value: ZoomInIcon,
        },
        { key: "Pinch in to zoom", value: ZoomOutIcon },
      ],
      isTouchDevice: false,
      canvas: null,
      ctx: null,
      baseImg: null,
      internalLoading: false,

      // Canvas dimensions
      canvasWidth: 800,
      canvasHeight: 500,
      containerWidth: 800,
      containerHeight: 500,

      // Image rendering properties
      renderWidth: 800,
      renderHeight: 500,
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
    };
  },

  computed: {
    // Combined loading state - either from parent or internal
    isCurrentlyLoading() {
      return this.isLoading || this.internalLoading;
    },
  },

  mounted() {
    this.setupResizeObserver();
    this.updateCanvasDimensions();
    this.initCanvas();
    this.setupEventListeners();
    this.loadImage();
    this.isTouchDevice = this.checkTouchDevice();
  },

  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.removeEventListeners();
  },

  watch: {
    baseImage() {
      this.loadImage();
    },

    // Watch for loading state changes to update event listeners
    isLoading(newVal) {
      console.log("Floor renderer loading state changed from parent:", newVal);
      if (newVal) {
        this.removeEventListeners();
      } else {
        this.$nextTick(() => {
          this.setupEventListeners();
        });
      }
    },

    internalLoading(newVal) {
      console.log("Floor renderer internal loading state changed:", newVal);
      if (newVal) {
        this.removeEventListeners();
      } else {
        this.$nextTick(() => {
          this.setupEventListeners();
        });
      }
    },
  },

  methods: {
     showInstructionModal() {
      this.isShowInstructionModal = true;
    },
    closeInstructionModal() {
      this.isShowInstructionModal = false;
    },
    checkTouchDevice() {
      return (
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0) ||
        ("ontouchstart" in window &&
          window.matchMedia &&
          window.matchMedia("(pointer: coarse)").matches)
      );
    },
    // ===================
    // INITIALIZATION
    // ===================

    setupResizeObserver() {
      if (typeof ResizeObserver !== "undefined") {
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
        // Fallback for older browsers
        window.addEventListener("resize", this.handleWindowResize);
      }
    },

    handleWindowResize() {
      this.updateCanvasDimensions();
      this.$nextTick(() => {
        this.render();
      });
    },

    // updateCanvasDimensions() {
    //   if (this.$refs.canvasContainer) {
    //     const rect = this.$refs.canvasContainer.getBoundingClientRect();
    //     this.containerWidth = Math.floor(rect.width);
    //     this.containerHeight = Math.floor(rect.height);
    //     this.canvasWidth = this.containerWidth;
    //     this.canvasHeight = this.containerHeight;
    //   }
    // },
    updateCanvasDimensions() {
      if (this.$refs.canvasContainer) {
        const rect = this.$refs.canvasContainer.getBoundingClientRect();
        this.containerWidth = Math.floor(rect.width);
        this.containerHeight = Math.floor(rect.height);
        this.canvasWidth = this.containerWidth;
        this.canvasHeight = this.containerHeight;

        // ===== ADD DPI SCALING WHEN DIMENSIONS CHANGE =====
        if (this.canvas) {
          const dpr = window.devicePixelRatio || 1;

          // Update canvas resolution
          this.canvas.width = this.canvasWidth * dpr;
          this.canvas.height = this.canvasHeight * dpr;

          // Update display size
          this.canvas.style.width = this.canvasWidth + "px";
          this.canvas.style.height = this.canvasHeight + "px";

          // Re-apply context scaling
          if (this.ctx) {
            this.ctx.scale(dpr, dpr);
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = "high";
          }
        }
        // ===== END DPI SCALING SECTION =====
      }
    },

    initCanvas() {
      this.canvas = this.$refs.canvas;

      if (!this.canvas) {
        console.error("Canvas ref not found");
        return;
      }

      // ===== ADD HIGH-DPI SUPPORT =====
      const dpr = window.devicePixelRatio || 1;

      // Set canvas internal resolution (physical pixels)
      this.canvas.width = this.canvasWidth * dpr;
      this.canvas.height = this.canvasHeight * dpr;

      // Set display size (CSS pixels)
      this.canvas.style.width = this.canvasWidth + "px";
      this.canvas.style.height = this.canvasHeight + "px";

      this.ctx = this.canvas.getContext("2d", {
        alpha: false,
        willReadFrequently: false,
      });

      // Scale context to match DPI
      this.ctx.scale(dpr, dpr);

      // Enable high-quality image rendering
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";
      // ===== END HIGH-DPI SECTION =====

      // Set initial background
      this.ctx.fillStyle = "#f0f0f0";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    },

    // ===================
    // EVENT LISTENERS
    // ===================

    setupEventListeners() {
      if (!this.canvas || this.isCurrentlyLoading) return;

      console.log("Setting up floor renderer event listeners");

      // Mouse events
      this.canvas.addEventListener("wheel", this.handleWheel, {
        passive: false,
      });
      this.canvas.addEventListener("mousedown", this.handleMouseDown);
      this.canvas.addEventListener("mousemove", this.handleMouseMove);
      this.canvas.addEventListener("mouseup", this.handleMouseUp);
      this.canvas.addEventListener("mouseleave", this.handleMouseUp);
      this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());

      // Touch events for mobile
      this.canvas.addEventListener("touchstart", this.handleTouchStart);
      this.canvas.addEventListener("touchmove", this.handleTouchMove);
      this.canvas.addEventListener("touchend", this.handleTouchEnd);
    },

    removeEventListeners() {
      if (!this.canvas) return;

      console.log("Removing floor renderer event listeners");

      this.canvas.removeEventListener("wheel", this.handleWheel);
      this.canvas.removeEventListener("mousedown", this.handleMouseDown);
      this.canvas.removeEventListener("mousemove", this.handleMouseMove);
      this.canvas.removeEventListener("mouseup", this.handleMouseUp);
      this.canvas.removeEventListener("mouseleave", this.handleMouseUp);
      this.canvas.removeEventListener("touchstart", this.handleTouchStart);
      this.canvas.removeEventListener("touchmove", this.handleTouchMove);
      this.canvas.removeEventListener("touchend", this.handleTouchEnd);

      if (typeof ResizeObserver === "undefined") {
        window.removeEventListener("resize", this.handleWindowResize);
      }
    },

    // ===================
    // MOUSE & TOUCH HANDLERS
    // ===================

    handleWheel(e) {
      if (this.isCurrentlyLoading) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(
        this.minZoom,
        Math.min(this.maxZoom, this.zoom * zoomFactor),
      );

      if (newZoom !== this.zoom) {
        // Zoom towards mouse position
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
      if (this.isCurrentlyLoading) {
        e.preventDefault();
        return;
      }

      if (e.button === 0 || e.button === 2) {
        // Left or right click
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.dragStartPanX = this.panX;
        this.dragStartPanY = this.panY;
        this.canvas.style.cursor = "grabbing";
        e.preventDefault();
      }
    },

    handleMouseMove(e) {
      if (this.isCurrentlyLoading) {
        e.preventDefault();
        return;
      }

      if (this.isDragging) {
        const deltaX = e.clientX - this.dragStartX;
        const deltaY = e.clientY - this.dragStartY;

        this.panX = this.dragStartPanX + deltaX;
        this.panY = this.dragStartPanY + deltaY;

        this.constrainPan();
        this.render();
        e.preventDefault();
      } else {
        // Update cursor based on zoom level
        this.canvas.style.cursor = this.zoom > 1 ? "grab" : "default";
      }
    },

    handleMouseUp(e) {
      if (this.isCurrentlyLoading) {
        e.preventDefault();
        return;
      }

      if (this.isDragging) {
        this.isDragging = false;
        this.canvas.style.cursor = this.zoom > 1 ? "grab" : "default";
        e.preventDefault();
      }
    },

    // Touch events for mobile devices
    handleTouchStart(e) {
      if (this.isLoading) return;

      // ALWAYS allow page scroll with single touch
      if (e.touches.length === 1) {
        this.isDragging = false;
        return; // Don't prevent default - allow scroll
      }

      e.preventDefault(); // Prevent ONLY for two-finger gestures

      if (e.touches.length === 2) {
        // Two fingers - prepare for zoom OR pan
        this.isDragging = false;
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        // Calculate initial distance
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        this.lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
        this.initialTouchDistance = this.lastTouchDistance;
        this.lastPinchZoom = this.zoom;

        // Store center point for two-finger panning
        this.twoFingerPanStartX = (touch1.clientX + touch2.clientX) / 2;
        this.twoFingerPanStartY = (touch1.clientY + touch2.clientY) / 2;
        this.dragStartPanX = this.panX;
        this.dragStartPanY = this.panY;
        this.twoFingerPanning = false;
      }
    },

    handleTouchMove(e) {
      if (this.isLoading) return;

      // ALWAYS allow page scroll with single touch
      if (e.touches.length === 1) {
        return; // Don't prevent default - allow scroll
      }

      e.preventDefault(); // Prevent ONLY for two-finger gestures

      if (e.touches.length === 2) {
        // Two fingers - detect zoom OR pan
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        // Calculate current distance
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        // Calculate distance change threshold (5% of initial distance)
        const distanceThreshold = this.initialTouchDistance * 0.05;
        const distanceChange = Math.abs(
          currentDistance - this.initialTouchDistance,
        );

        if (distanceChange > distanceThreshold) {
          // ZOOM MODE - distance changed significantly
          this.twoFingerPanning = false;

          if (this.lastTouchDistance > 0) {
            const zoomFactor = currentDistance / this.lastTouchDistance;
            const newZoom = Math.max(
              this.minZoom,
              Math.min(this.maxZoom, this.lastPinchZoom * zoomFactor),
            );

            if (newZoom !== this.zoom) {
              const centerX = (touch1.clientX + touch2.clientX) / 2;
              const centerY = (touch1.clientY + touch2.clientY) / 2;
              const rect = this.canvas.getBoundingClientRect();
              const canvasCenterX = centerX - rect.left;
              const canvasCenterY = centerY - rect.top;

              const imageX = (canvasCenterX - this.panX) / this.zoom;
              const imageY = (canvasCenterY - this.panY) / this.zoom;

              this.zoom = newZoom;
              this.panX = canvasCenterX - imageX * this.zoom;
              this.panY = canvasCenterY - imageY * this.zoom;

              this.constrainPan();
              this.render();
            }
          }
        } else {
          // PAN MODE - distance stayed constant
          this.twoFingerPanning = true;

          const centerX = (touch1.clientX + touch2.clientX) / 2;
          const centerY = (touch1.clientY + touch2.clientY) / 2;

          const deltaX = centerX - this.twoFingerPanStartX;
          const deltaY = centerY - this.twoFingerPanStartY;

          this.panX = this.dragStartPanX + deltaX;
          this.panY = this.dragStartPanY + deltaY;

          this.constrainPan();
          this.render();
        }
      }
    },

    handleTouchEnd(e) {
      if (this.isLoading) return;

      // ALWAYS allow scroll with single touch
      if (e.touches.length <= 1) {
        this.isDragging = false;
        this.lastTouchDistance = 0;
        this.twoFingerPanning = false;
        this.initialTouchDistance = 0;
        return; // Don't prevent default
      }

      e.preventDefault(); // Prevent ONLY when still using two fingers

      if (e.touches.length === 0) {
        this.isDragging = false;
        this.lastTouchDistance = 0;
        this.twoFingerPanning = false;
        this.initialTouchDistance = 0;
        this.removeObjectHighlight();
      }
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
      const maxPanX = Math.max(
        0,
        zoomedImageWidth + zoomedImageLeft - this.canvasWidth,
      );
      const minPanX = Math.min(0, -zoomedImageLeft);
      const maxPanY = Math.max(
        0,
        zoomedImageHeight + zoomedImageTop - this.canvasHeight,
      );
      const minPanY = Math.min(0, -zoomedImageTop);

      // Apply constraints
      this.panX = Math.max(-maxPanX, Math.min(minPanX, this.panX));
      this.panY = Math.max(-maxPanY, Math.min(minPanY, this.panY));
    },

    zoomIn() {
      if (this.isCurrentlyLoading) return;

      const newZoom = Math.min(this.maxZoom, this.zoom * 1.2);
      if (newZoom !== this.zoom) {
        this.zoomToCenter(newZoom);
      }
    },

    zoomOut() {
      if (this.isCurrentlyLoading) return;

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
      if (this.isCurrentlyLoading) return;

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
        console.warn("No base image provided");
        return;
      }

      // Use internal loading state for image loading only
      this.internalLoading = true;

      try {
        this.baseImg = await this.createImageFromSrc(this.baseImage);
        this.calculateImageDimensions();
        this.render();
      } catch (error) {
        console.error("Error loading image:", error);
        this.showErrorState();
      } finally {
        this.internalLoading = false;
      }
    },

    createImageFromSrc(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => resolve(img);
        img.onerror = (error) =>
          reject(new Error(`Failed to load image: ${src}`));

        img.src = src;
      });
    },

    //     calculateImageDimensions() {
    //   if (!this.baseImg) return;

    //   const maxWidth = this.canvasWidth;
    //   const maxHeight = this.canvasHeight;

    //   const imgAspectRatio = this.baseImg.width / this.baseImg.height;

    //   // Always fit to width first (100% width)
    //   this.renderWidth = maxWidth;
    //   this.renderHeight = Math.round(maxWidth / imgAspectRatio);
    //   this.renderOffsetX = 0;

    //   // If calculated height exceeds available height, fit to height instead
    //   if (this.renderHeight > maxHeight) {
    //     this.renderHeight = maxHeight;
    //     this.renderWidth = Math.round(maxHeight * imgAspectRatio);
    //     this.renderOffsetX = Math.round((maxWidth - this.renderWidth) / 2);
    //     this.renderOffsetY = 0;
    //   } else {
    //     // Center vertically if height is less than container
    //     this.renderOffsetY = Math.round((maxHeight - this.renderHeight) / 2);
    //   }

    //   this.scaleX = this.renderWidth / this.baseImg.width;
    //   this.scaleY = this.renderHeight / this.baseImg.height;
    // },

    // ===================
    // RENDERING
    // ===================

    // render() {
    //   if (!this.canvas || !this.ctx) return;

    //   // Clear canvas
    //   this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    //   // Fill background
    //   this.ctx.fillStyle = '#f5f5f5';
    //   this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    //   if (!this.baseImg) return;

    //   this.ctx.save();

    //   // Apply transformations
    //   this.ctx.translate(this.panX, this.panY);
    //   this.ctx.scale(this.zoom, this.zoom);

    //   try {
    //     // Draw image
    //     this.ctx.drawImage(
    //       this.baseImg,
    //       this.renderOffsetX,
    //       this.renderOffsetY,
    //       this.renderWidth,
    //       this.renderHeight
    //     );

    //     // Add subtle border
    //     this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    //     this.ctx.lineWidth = 1 / this.zoom;
    //     this.ctx.strokeRect(
    //       this.renderOffsetX,
    //       this.renderOffsetY,
    //       this.renderWidth,
    //       this.renderHeight
    //     );

    //   } catch (error) {
    //     console.error('Error rendering image:', error);
    //     this.showErrorState();
    //   }

    //   this.ctx.restore();
    // },

    calculateImageDimensions() {
      if (!this.baseImg) return;

      const maxWidth = this.canvasWidth;
      const maxHeight = this.canvasHeight;

      // ===== USE naturalWidth/naturalHeight FOR ACCURACY =====
      const imgAspectRatio =
        this.baseImg.naturalWidth / this.baseImg.naturalHeight;
      // ===== END =====

      // Always fit to width first (100% width)
      this.renderWidth = maxWidth;
      this.renderHeight = Math.round(maxWidth / imgAspectRatio);
      this.renderOffsetX = 0;

      // If calculated height exceeds available height, fit to height instead
      if (this.renderHeight > maxHeight) {
        this.renderHeight = maxHeight;
        this.renderWidth = Math.round(maxHeight * imgAspectRatio);
        this.renderOffsetX = Math.round((maxWidth - this.renderWidth) / 2);
        this.renderOffsetY = 0;
      } else {
        // Center vertically if height is less than container
        this.renderOffsetY = Math.round((maxHeight - this.renderHeight) / 2);
      }

      // ===== USE naturalWidth/naturalHeight FOR SCALING =====
      this.scaleX = this.renderWidth / this.baseImg.naturalWidth;
      this.scaleY = this.renderHeight / this.baseImg.naturalHeight;
      // ===== END =====
    },
    render() {
      if (!this.canvas || !this.ctx) return;

      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      // Fill background
      this.ctx.fillStyle = "#f5f5f5";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      if (!this.baseImg) return;

      this.ctx.save();

      // Apply transformations
      this.ctx.translate(this.panX, this.panY);
      this.ctx.scale(this.zoom, this.zoom);

      // ===== HIGH QUALITY SETTINGS =====
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";
      // ===== END QUALITY SETTINGS =====

      try {
        // Draw image
        this.ctx.drawImage(
          this.baseImg,
          this.renderOffsetX,
          this.renderOffsetY,
          this.renderWidth,
          this.renderHeight,
        );

        // Add subtle border
        this.ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        this.ctx.lineWidth = 1 / this.zoom;
        this.ctx.strokeRect(
          this.renderOffsetX,
          this.renderOffsetY,
          this.renderWidth,
          this.renderHeight,
        );
      } catch (error) {
        console.error("Error rendering image:", error);
        this.showErrorState();
      }

      this.ctx.restore();
    },
    showErrorState() {
      if (!this.ctx) return;

      this.ctx.fillStyle = "#ffcccc";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.fillStyle = "#cc0000";
      this.ctx.font = "20px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Error loading image",
        this.canvasWidth / 2,
        this.canvasHeight / 2,
      );
    },

    // ===================
    // PUBLIC METHODS
    // ===================

    updateImage(newImageSrc) {
      this.baseImage = newImageSrc;
      this.loadImage();
    },

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
      };
    },

    // ===================
    // UTILITY METHODS
    // ===================

    // Method to get current loading status
    getLoadingStatus() {
      return {
        isLoading: this.isLoading, // From parent
        internalLoading: this.internalLoading, // Internal
        isCurrentlyLoading: this.isCurrentlyLoading, // Combined
      };
    },
  },
};
</script>

<style scoped>
.apply-wrapper {
}
.canvas-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 140px);
  min-height: 300px;
  overflow: hidden;
  background: #f5f5f5;
  border: 1px solid #e1e5e9;
  /* ===== ADD FOR MOBILE OPTIMIZATION ===== */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  /* ===== END ===== */
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .canvas-container {
    height: calc(100vh - 180px);
  }
}

@media screen and (min-width: 400px) and (max-width: 770px) {
  .canvas-container {
    height: calc(100vh - 160px);
  }
}

@media screen and (min-width: 200px) and (max-width: 400px) {
  .canvas-container {
    height: calc(100vh - 190px);
  }
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 16px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}
.main-canvas {
  display: block;
  transition: opacity 0.2s ease;
  cursor: default;
  /* ===== ADD THESE FOR CRISP RENDERING ===== */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  /* ===== END ===== */
}

.main-canvas.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.zoom-controls {
  position: absolute;
  top: 40px;
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
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 12px;
  text-align: center;
  z-index: 5;
  pointer-events: none;
}

/* modal */
.instruction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.instruction-item:last-child {
  border-bottom: none;
}

.instruction {
  font-weight: 500;
  color: #333;
  flex: 1;
}

.gesture-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-left: 20px;
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
    min-height: 280px;
  }

  .zoom-controls {
    display:none
    /* top: 2px;
    right: 2px;
    padding: 4px 6px;
    gap: 4px; */
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

/* Updated scanning loading overlay to fit canvas only */
.scanning-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  /* border-radius: 10px; */
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
  /* border-radius: 10px; */
}

.loading-screen::before {
  content: "";
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
    rgba(0, 102, 255, 1) 0%,
    /* bold vertical scanning line */ rgba(0, 102, 255, 0.4) 20%,
    rgba(0, 102, 255, 0.3) 30%,
    /* fade tail after the bold line */ rgba(0, 102, 255, 0.2) 35%,
    rgba(0, 102, 255, 0.15) 40%,
    rgba(0, 102, 255, 0.1) 50%,
    rgba(0, 102, 255, 0) 100%
  );
  animation:
    moveWaveLeftToRight 3s linear infinite,
    waveFade 3s ease-in-out infinite; /* fade control */
  z-index: 2;
}

@keyframes moveWaveLeftToRight {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(50%);
  }
}

@keyframes waveFade {
  0% {
    opacity: 0;
  } /* invisible before entering */
  10% {
    opacity: 1;
  } /* fade in */
  90% {
    opacity: 1;
  } /* stay visible */
  100% {
    opacity: 0;
  } /* fade out before reset */
}

.loading-text {
  position: relative;
  color: #fff;
  text-align: center;
  z-index: 3;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
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
