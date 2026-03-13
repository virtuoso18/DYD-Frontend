<template>
  <div class="canvas-wrapper-desktop" ref="canvasWrapper">
    <div v-if="isLoading" class="scanning-loading-overlay">
      <div class="loading-screen">
        <div class="wave-overlay"></div>
        <div class="loading-text">
          {{ currentMessage }}
          <!-- <div class="lottieFile-sec">
            <DotLottieVue
              style="height: auto; width: 250px;"
              autoplay
              loop
              speed=0.5
              src="https://lottie.host/7665c805-0ebe-4178-aca1-8828e05d3707/5tbkJuNDQ9.lottie"
            />
          </div> -->
        </div>
      </div>
    </div>
    <div class="canvas-overlay" ref="canvasOverlay">
      <canvas
        ref="drawCanvas"
        @mousedown="handleCanvasMouseDown"
        @mousemove="handleCanvasMouseMove"
        @mouseup="handleCanvasMouseUp"
        @mouseleave="handleCanvasMouseLeave"
        @click="handleCanvasClick"
        @touchstart="handleCanvasTouchStartSAM2"
        @touchstart.prevent="handleCanvasTouchStart"
        @touchmove.prevent="handleCanvasTouchMove"
        @touchend.prevent="handleCanvasTouchEnd"
        :style="{ cursor: getCursorStyle() }"
      ></canvas>

      <!-- Draw Mode Cursor -->
      <div
        v-if="showCursor && removalMode === 'draw'"
        class="custom-cursor"
        :style="{
          left: cursorX + 'px',
          top: cursorY + 'px',
          width: brushSize * displayScale + 'px',
          height: brushSize * displayScale + 'px',
          borderColor: useEraser ? '#ffffff' : '#ff4444',
          background: useEraser
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(255, 68, 68, 0.15)',
        }"
      ></div>

      <!-- SAM Points Indicators — positioned relative to canvas top-left -->
      <div
        v-for="(point, index) in samPoints"
        :key="'sam-point-' + index"
        class="sam-point-indicator"
        :class="{ 'point-active': index === samPoints.length - 1 }"
        :style="{
          left: point.displayX + canvasOffsetInOverlay.x + 'px',
          top: point.displayY + canvasOffsetInOverlay.y + 'px',
        }"
      >
        <span class="point-number">{{ index + 1 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CanvasForSAMAndDraw",

  props: {
    baseImage: { type: String, required: true },
    roomId: { type: String, required: true },
    initialMode: {
      type: String,
      default: "draw",
      validator: (v) => ["draw", "sam2", "sam3"].includes(v),
    },
  },

  data() {
    return {
      removalMode: "draw",
      canvas: null,
      ctx: null,
      baseImg: null,

      isDrawing: false,
      isProcessing: false,
      isFetchingSAMMask: false,
      isDestroyed: false,

      brushSize: 20,
      brushColor: "rgba(255, 0, 0, 0.6)",

      // displayScale = CSS pixels per canvas pixel
      displayScale: 1,

      // Where the canvas top-left sits inside .canvas-overlay
      // Used to offset SAM point dot positions
      canvasOffsetInOverlay: { x: 0, y: 0 },

      drawingHistory: [],
      currentStroke: [],

      samPoints: [],
      samMask: null,
      samMaskGenerated: false,
      samConfidence: 0.8,

      sam3TextPrompt: "",
      sam3MasksList: [],
      sam3CurrentMaskIndex: 0,

      showCursor: false,
      cursorX: 0,
      cursorY: 0,
      useEraser: false,

      _resizeHandler: null,

      isLoading: false,
      loadingMessages: [
        "Preparing image...",
        "Analyzing mask...",
        "Analyzing selection...",
        "Removing object...",
        "Rebuilding background...",
        "Refining details...",
        "Generating image...",
      ],
      currentMessage: "",
      messageIndex: 0,
      messageTimer: null,
    };
  },

  computed: {
    hasValidMask() {
      if (this.removalMode === "draw") return this.drawingHistory.length > 0;
      return this.samMaskGenerated && this.samMask !== null;
    },
  },

  watch: {
    removalMode(newVal) {
      if (newVal === "draw") {
        this.clearSAMPoints();
        this.clearSAM3Masks();
      } else if (newVal === "sam2") {
        this.clearDrawing();
        this.clearSAM3Masks();
      } else if (newVal === "sam3") {
        this.clearDrawing();
        this.clearSAMPoints();
      }
      this.redrawCanvas();
    },
  },

  mounted() {
    this.removalMode = this.initialMode;
    this._resizeHandler = () => this.onResize();
    window.addEventListener("resize", this._resizeHandler);
    this.$nextTick(() => this.initializeCanvas());
  },

  beforeUnmount() {
    this.isDestroyed = true;
    if (this._resizeHandler) {
      window.removeEventListener("resize", this._resizeHandler);
    }
    this.canvas = null;
    this.ctx = null;
    this.baseImg = null;
  },

  methods: {
    findNearestSAMPoint(displayX, displayY) {
  // SAM point indicator is 24px wide (radius = 12px in display space)
  const HIT_RADIUS = 16; // slightly generous for touch
  for (let i = this.samPoints.length - 1; i >= 0; i--) {
    const pt = this.samPoints[i];
    const dx = displayX - pt.displayX;
    const dy = displayY - pt.displayY;
    if (Math.sqrt(dx * dx + dy * dy) <= HIT_RADIUS) {
      return i;
    }
  }
  return -1;
},
    startLoadingMessages() {
      this.messageIndex = 0;
      this.currentMessage = this.loadingMessages[this.messageIndex];

      this.messageTimer = setInterval(() => {
        this.messageIndex =
          (this.messageIndex + 1) % this.loadingMessages.length;

        this.currentMessage = this.loadingMessages[this.messageIndex];
      }, 3000);
    },
    stopLoadingMessages() {
      clearInterval(this.messageTimer);
    },

    // handleCanvasTouchStartSAM2(e) {
    //   if (this.removalMode !== "sam2") return;
    //   e.preventDefault();

    //   if (this.isProcessing || this.isFetchingSAMMask) {
    //     this.$message.warning("Processing...");
    //     return;
    //   }

    //   const touch = e.touches[0];
    //   const { canvasX, canvasY, displayX, displayY } =
    //     this.getCanvasCoordinates(touch);

    //   if (this.isOutOfBounds(canvasX, canvasY)) return;
    //   if (this.samPoints.length >= 10) return;

    //   this.samPoints.push({ x: canvasX, y: canvasY, displayX, displayY });
    //   this.samMask = null;
    //   this.redrawCanvas();

    //   if (navigator.vibrate) navigator.vibrate(100);
    //   this.$message.success(`Point ${this.samPoints.length} added`);
    // },
    handleCanvasTouchStartSAM2(e) {
  if (this.removalMode !== "sam2") return;
  e.preventDefault();

  if (this.isProcessing || this.isFetchingSAMMask) {
    this.$message.warning("Processing...");
    return;
  }

  const touch = e.touches[0];
  const { canvasX, canvasY, displayX, displayY } =
    this.getCanvasCoordinates(touch);

  if (this.isOutOfBounds(canvasX, canvasY)) return;

  // Check if tap lands on an existing point — if so, remove it
  const hitIndex = this.findNearestSAMPoint(displayX, displayY);
  if (hitIndex !== -1) {
    this.samPoints.splice(hitIndex, 1);
    this.samMaskGenerated = false;
    this.samMask = null;
    this.redrawCanvas();
    if (navigator.vibrate) navigator.vibrate(50);
    this.$message.info(`Point ${hitIndex + 1} removed`);
    return;
  }

  // Otherwise add a new point (max 10)
  if (this.samPoints.length >= 10) return;
  this.samPoints.push({ x: canvasX, y: canvasY, displayX, displayY });
  this.samMask = null;
  this.redrawCanvas();

  if (navigator.vibrate) navigator.vibrate(100);
  this.$message.success(`Point ${this.samPoints.length} added`);
},
    // ==================== INIT ====================
    async triggerRemoval() {
      await this.handleSubmit();
    },
    async initializeCanvas() {
      await this.$nextTick();
      const canvas = this.$refs.drawCanvas;
      if (!canvas) {
        setTimeout(() => this.initializeCanvas(), 100);
        return;
      }
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      await this.loadBaseImage();
    },

    async loadBaseImage() {
      if (!this.baseImage || !this.ctx) return;
      try {
        this.baseImg = await this.createImageFromSrc(this.baseImage);
        this.setupCanvas();
        await this.drawBaseImage();
      } catch (error) {
        console.error("Error loading base image:", error);
        this.$message.error("Failed to load image");
      }
    },

    createImageFromSrc(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = src;
      });
    },

    setupCanvas() {
      if (!this.baseImg || !this.canvas) return;

      this.canvas.width = this.baseImg.width;
      this.canvas.height = this.baseImg.height;

      const wrapper = this.$refs.canvasWrapper;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();

      // Use only width for scale — height of wrapper may be taller than image
      const scaleX = rect.width / this.baseImg.width;
      const scaleY = rect.height / this.baseImg.height;
      this.displayScale = Math.min(scaleX, scaleY, 1);

      const displayW = Math.floor(this.baseImg.width * this.displayScale);
      const displayH = Math.floor(this.baseImg.height * this.displayScale);

      this.canvas.style.width = displayW + "px";
      this.canvas.style.height = displayH + "px";

      // ADD THIS BACK
      this.$nextTick(() => this.updateCanvasOffsetInOverlay());

      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
    },

    // setupCanvas() {
    //   if (!this.baseImg || !this.canvas) return;

    //   // Internal canvas resolution = image resolution
    //   this.canvas.width = this.baseImg.width;
    //   this.canvas.height = this.baseImg.height;

    //   const wrapper = this.$refs.canvasWrapper;
    //   if (!wrapper) return;

    //   const rect = wrapper.getBoundingClientRect();
    //   const scaleX = rect.width / this.baseImg.width;
    //   const scaleY = rect.height / this.baseImg.height;

    //   // displayScale: how many CSS px per canvas px (object-fit: contain logic)
    //   this.displayScale = Math.min(scaleX, scaleY, 1);

    //   const displayW = Math.floor(this.baseImg.width * this.displayScale);
    //   const displayH = Math.floor(this.baseImg.height * this.displayScale);

    //   this.canvas.style.width = displayW + "px";
    //   this.canvas.style.height = displayH + "px";

    //   // Calculate where canvas sits inside overlay (for dot positioning)
    //   this.$nextTick(() => this.updateCanvasOffsetInOverlay());

    //   this.ctx.lineCap = "round";
    //   this.ctx.lineJoin = "round";
    // },

    onResize() {
      if (!this.baseImg || !this.canvas) return;
      this.setupCanvas();
      this.redrawCanvas();
    },

    // Track canvas top-left offset inside .canvas-overlay
    // This is needed because overlay uses flexbox centering
    updateCanvasOffsetInOverlay() {
      if (!this.canvas || !this.$refs.canvasOverlay) return;
      const overlayRect = this.$refs.canvasOverlay.getBoundingClientRect();
      const canvasRect = this.canvas.getBoundingClientRect();
      this.canvasOffsetInOverlay = {
        x: canvasRect.left - overlayRect.left,
        y: canvasRect.top - overlayRect.top,
      };
    },

    // ==================== COORDINATES ====================

    // KEY FIX: canvas internal size != CSS display size
    // displayScale tells us exactly how to convert display px -> canvas px
    // getCanvasCoordinates(e) {
    //   const rect = this.canvas.getBoundingClientRect();
    //   const clientX = e.touches?.length ? e.touches[0].clientX : e.clientX;
    //   const clientY = e.touches?.length ? e.touches[0].clientY : e.clientY;

    //   // Position relative to canvas element top-left (CSS pixels)
    //   const displayX = clientX - rect.left;
    //   const displayY = clientY - rect.top;

    //   // Convert CSS pixels to canvas pixels using displayScale
    //   const canvasX = Math.round(displayX / this.displayScale);
    //   const canvasY = Math.round(displayY / this.displayScale);

    //   return { canvasX, canvasY, displayX, displayY };
    // },

    getCanvasCoordinates(e) {
      // ALWAYS use canvas getBoundingClientRect directly
      // This automatically accounts for scroll, offset, flex centering etc.
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches?.length ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches?.length ? e.touches[0].clientY : e.clientY;

      // These are already relative to the canvas element's actual rendered position
      const displayX = clientX - rect.left;
      const displayY = clientY - rect.top;

      // Canvas internal px = display px / scale
      // rect.width is the CSS display width, canvas.width is internal resolution
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      return {
        canvasX: Math.round(displayX * scaleX),
        canvasY: Math.round(displayY * scaleY),
        displayX,
        displayY,
      };
    },

    getCursorStyle() {
      if (this.isProcessing || this.isFetchingSAMMask) return "wait";
      if (this.removalMode === "draw")
        return this.isDrawing ? "none" : "crosshair";
      return "pointer";
    },

    isOutOfBounds(canvasX, canvasY) {
      if (!this.canvas) return true;
      return (
        canvasX < 0 ||
        canvasX >= this.canvas.width ||
        canvasY < 0 ||
        canvasY >= this.canvas.height
      );
    },

    // ==================== DRAWING MODE ====================

    handleCanvasMouseDown(e) {
      if (this.removalMode === "draw") this.startDrawing(e);
    },

    handleCanvasMouseMove(e) {
      const { displayX, displayY, canvasX, canvasY } =
        this.getCanvasCoordinates(e);

      // Offset by where canvas sits inside overlay
      const canvasRect = this.canvas.getBoundingClientRect();
      const overlayRect = this.$refs.canvasOverlay.getBoundingClientRect();
      const offsetX = canvasRect.left - overlayRect.left;
      const offsetY = canvasRect.top - overlayRect.top;

      if (this.removalMode === "draw") {
        this.cursorX = displayX + offsetX;
        this.cursorY = displayY + offsetY;
        this.showCursor = !this.isOutOfBounds(canvasX, canvasY);
        if (this.isDrawing) this.draw(e);
      }
    },

    //     handleCanvasMouseMove(e) {
    //   const { displayX, displayY, canvasX, canvasY } = this.getCanvasCoordinates(e);
    //   const canvasRect = this.canvas.getBoundingClientRect();
    //   const overlayRect = this.$refs.canvasOverlay.getBoundingClientRect();
    //   const offsetX = canvasRect.left - overlayRect.left;
    //   const offsetY = canvasRect.top - overlayRect.top;

    //   this.cursorX = displayX + offsetX;
    //   this.cursorY = displayY + offsetY;

    //   if (this.removalMode === "draw") {
    //     this.showCursor = !this.isOutOfBounds(canvasX, canvasY);
    //     if (this.isDrawing) this.draw(e);
    //   } else if (this.removalMode === "sam2" || this.removalMode === "sam3") {
    //     this.showCursor = !this.isOutOfBounds(canvasX, canvasY);
    //   }
    // },

    handleCanvasMouseUp() {
      if (this.removalMode === "draw") this.stopDrawing();
    },

    handleCanvasMouseLeave() {
      if (this.removalMode === "draw") {
        this.stopDrawing();
        this.showCursor = false;
      }
    },

    handleCanvasClick(e) {
      if (this.removalMode === "sam2") this.addSAMPoint(e);
    },

    startDrawing(e) {
      if (this.isProcessing) return;
      const { canvasX, canvasY } = this.getCanvasCoordinates(e);
      if (this.isOutOfBounds(canvasX, canvasY)) return;

      this.isDrawing = true;
      this.currentStroke = [{ x: canvasX, y: canvasY }];

      // Reset path completely — prevents carrying over old path state
      this.ctx.beginPath();
      this.ctx.moveTo(canvasX, canvasY);
    },

    // startDrawing(e) {
    //   if (this.isProcessing) return;
    //   const { canvasX, canvasY } = this.getCanvasCoordinates(e);
    //   if (this.isOutOfBounds(canvasX, canvasY)) return;
    //   this.isDrawing = true;
    //   this.currentStroke = [{ x: canvasX, y: canvasY }];
    //   this.ctx.beginPath();
    //   this.ctx.moveTo(canvasX, canvasY);
    // },

    draw(e) {
      if (!this.isDrawing || this.isProcessing) return;
      const { canvasX, canvasY } = this.getCanvasCoordinates(e);
      if (this.isOutOfBounds(canvasX, canvasY)) {
        this.stopDrawing();
        return;
      }

      const lastPoint = this.currentStroke[this.currentStroke.length - 1];
      this.currentStroke.push({ x: canvasX, y: canvasY });

      if (this.useEraser) {
        this.ctx.clearRect(
          canvasX - this.brushSize / 2,
          canvasY - this.brushSize / 2,
          this.brushSize,
          this.brushSize,
        );
      } else {
        // Draw only the NEW segment from last point to current point
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.brushColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.moveTo(lastPoint.x, lastPoint.y);
        this.ctx.lineTo(canvasX, canvasY);
        this.ctx.stroke();
      }
    },
    // draw(e) {
    //   if (!this.isDrawing || this.isProcessing) return;
    //   const { canvasX, canvasY } = this.getCanvasCoordinates(e);
    //   if (this.isOutOfBounds(canvasX, canvasY)) {
    //     this.stopDrawing();
    //     return;
    //   }
    //   this.currentStroke.push({ x: canvasX, y: canvasY });
    //   if (this.useEraser) {
    //     this.ctx.clearRect(
    //       canvasX - this.brushSize / 2,
    //       canvasY - this.brushSize / 2,
    //       this.brushSize,
    //       this.brushSize,
    //     );
    //   } else {
    //     this.ctx.strokeStyle = this.brushColor;
    //     this.ctx.lineWidth = this.brushSize;
    //     this.ctx.lineTo(canvasX, canvasY);
    //     this.ctx.stroke();
    //   }
    // },

    stopDrawing() {
      if (this.isDrawing && this.currentStroke.length > 0) {
        this.drawingHistory.push({
          points: [...this.currentStroke],
          brushSize: this.brushSize,
          brushColor: this.brushColor,
          isEraser: this.useEraser,
        });
        this.currentStroke = [];
      }
      this.isDrawing = false;
    },

    clearDrawing() {
      this.drawingHistory = [];
      this.currentStroke = [];
    },

    undoLastStroke() {
      if (this.drawingHistory.length > 0) {
        this.drawingHistory.pop();
        this.redrawCanvas();
        this.$message.info("Last stroke removed");
      }
    },

    handleCanvasTouchStart(e) {
      if (this.removalMode === "draw") {
        this.startDrawing(e.touches[0]);
      }
    },

    handleCanvasTouchMove(e) {
      if (this.removalMode === "draw") {
        const touch = e.touches[0];
        const { displayX, displayY, canvasX, canvasY } =
          this.getCanvasCoordinates(touch);
        const canvasRect = this.canvas.getBoundingClientRect();
        const overlayRect = this.$refs.canvasOverlay.getBoundingClientRect();
        const offsetX = canvasRect.left - overlayRect.left;
        const offsetY = canvasRect.top - overlayRect.top;
        this.cursorX = displayX + offsetX;
        this.cursorY = displayY + offsetY;
        this.showCursor = !this.isOutOfBounds(canvasX, canvasY);
        if (this.isDrawing) this.draw(touch);
      }
    },

    handleCanvasTouchEnd() {
      if (this.removalMode === "draw") {
        this.stopDrawing();
        this.showCursor = false;
      }
    },

    redrawAllStrokes() {
      this.drawingHistory.forEach((stroke) => {
        if (!stroke.points.length) return;
        if (stroke.isEraser) {
          // Replay ALL eraser points
          stroke.points.forEach((p) => {
            this.ctx.clearRect(
              p.x - stroke.brushSize / 2,
              p.y - stroke.brushSize / 2,
              stroke.brushSize,
              stroke.brushSize,
            );
          });
        } else {
          this.ctx.strokeStyle = stroke.brushColor;
          this.ctx.lineWidth = stroke.brushSize;
          this.ctx.beginPath();
          this.ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          stroke.points.forEach((p) => this.ctx.lineTo(p.x, p.y));
          this.ctx.stroke();
        }
      });
    },

    // ==================== SAM-2 MODE ====================

    // addSAMPoint(e) {
    //   if (this.isProcessing || this.isFetchingSAMMask) return;
    //   const { canvasX, canvasY, displayX, displayY } =
    //     this.getCanvasCoordinates(e);
    //   if (this.isOutOfBounds(canvasX, canvasY)) return;

    //   // displayX/Y are relative to canvas element — correct for dot positioning
    //   this.samPoints.push({ x: canvasX, y: canvasY, displayX, displayY });

    //   if (!this.samMaskGenerated) this.samMask = null;

    //   this.redrawCanvas();
    //   // this.$message.info(`Point ${this.samPoints.length} added`);
    // },

    addSAMPoint(e) {
  if (this.isProcessing || this.isFetchingSAMMask) return;
  const { canvasX, canvasY, displayX, displayY } =
    this.getCanvasCoordinates(e);
  if (this.isOutOfBounds(canvasX, canvasY)) return;

  // Check if click lands on an existing point — if so, remove it
  const hitIndex = this.findNearestSAMPoint(displayX, displayY);
  if (hitIndex !== -1) {
    this.samPoints.splice(hitIndex, 1);
    this.samMaskGenerated = false;
    this.samMask = null;
    this.redrawCanvas();
    this.$message.info(`Point ${hitIndex + 1} removed`);
    return;
  }

  // Otherwise add a new point (max 10)
  if (this.samPoints.length >= 10) return;
  this.samPoints.push({ x: canvasX, y: canvasY, displayX, displayY });
  if (!this.samMaskGenerated) this.samMask = null;
  this.redrawCanvas();
},

    clearSAMPoints() {
      this.samPoints = [];
      this.samMask = null;
      this.samMaskGenerated = false;
    },

    undoLastSAMPoint() {
      if (this.samPoints.length > 0) {
        this.samPoints.pop();
        this.samMaskGenerated = false;
        this.samMask = null;
        this.redrawCanvas();
        this.$message.info("Last point removed");
      }
    },

    async fetchSAMMask() {
      if (!this.samPoints.length || this.isFetchingSAMMask) return;
      this.$emit("sam_rendering_results", true);

      this.isFetchingSAMMask = true;
      try {
        this.isLoading = true;
        this.startLoadingMessages();
        const imageCanvas = document.createElement("canvas");
        imageCanvas.width = this.baseImg.width;
        imageCanvas.height = this.baseImg.height;
        imageCanvas.getContext("2d").drawImage(this.baseImg, 0, 0);

        const apiEndpoint = this.$store?.state?.root_api || "";
        const response = await fetch(`${apiEndpoint}engine/sam2-segment/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room_id: this.roomId,
            image_base64: imageCanvas.toDataURL("image/png"),
            points: this.samPoints.map((p) => ({ x: p.x, y: p.y })),
            confidence: this.samConfidence,
            image_dimensions: {
              width: this.baseImg.width,
              height: this.baseImg.height,
            },
          }),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const result = await response.json();
        if (this.isDestroyed) return;

        if (result.success && result.mask_base64) {
          this.samMask = result.mask_base64;
          this.samMaskGenerated = true;
          await this.redrawCanvas(); 
          this.samPoints=[];
          this.$emit("mask-ready", true);
          this.$message.success("Mask generated successfully!");
        } else {
          throw new Error(result.message || "Failed to generate mask");
        }
      } catch (error) {
        if (!this.isDestroyed) {
          console.error("SAM-2 segmentation failed:", error);
          this.$message.error("Failed to generate mask");
        }
      } finally {
        if (!this.isDestroyed) this.isFetchingSAMMask = false;
        this.isLoading = false;
        this.stopLoadingMessages();
        this.$emit("sam_rendering_results", false);
        // this.$emit('mask-ready',false);  // ← ADD THIS, remove the this.hasMaskReady = true line
      }
    },

    // ==================== SAM-3 MODE ====================
async detectObjectFromMask(imageSrc) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const threshold = 10
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const brightness = (r + g + b) / 3
        if (brightness > threshold) { 
          resolve(true)
          return
        }
      }
      resolve(false)
    }
    img.onerror = () => resolve(false)
    img.src = imageSrc
  })
},
    async fetchSAM3Mask(prompttext) {
      this.$emit("sam_rendering_results", true);

      this.isFetchingSAMMask = true;
      try {
        this.isLoading = true;
        const apiEndpoint = this.$store?.state?.root_api || "";
        const response = await fetch(`${apiEndpoint}engine/sam3-segment/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room_id: this.roomId,
            confidence: this.samConfidence,
            text_prompt: prompttext,
          }),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const result = await response.json();
        if (this.isDestroyed) return;
        const maskUrl=this.$store?.state?.root_api + result.binary_masks_list[0];
         const isAnyObject = await this.detectObjectFromMask(maskUrl)
         if(!isAnyObject){
            this.$message.error(
            `${result.binary_masks_list.length} masks detected!`,
          );
          return;
         }
        if (result.success && result.binary_masks_list?.length) {
          this.sam3MasksList = result.binary_masks_list;
          this.samMask = await this.loadAndCombineAllMasks(
            apiEndpoint,
            result.binary_masks_list,
          );
          this.samMaskGenerated = true;
          await this.redrawCanvas();
          this.$emit("mask-ready", true);

          this.$message.success(
            `${result.binary_masks_list.length} masks detected!`,
          );
        } else {
          throw new Error(result.message || "Failed to generate mask");
        }
      } catch (error) {
        if (!this.isDestroyed) {
          console.error("SAM-3 segmentation failed:", error);
          this.$message.error("Failed to generate mask");
        }
      } finally {
        if (!this.isDestroyed) this.isFetchingSAMMask = false;
        this.isLoading = false;
        this.$emit("sam_rendering_results", false);
        // this.$emit('mask-ready',false);  // ← ADD THIS, remove the this.hasMaskReady = true line
      }
    },

    async loadAndCombineAllMasks(apiEndpoint, maskPaths) {
      const combinedCanvas = document.createElement("canvas");
      combinedCanvas.width = this.baseImg.width;
      combinedCanvas.height = this.baseImg.height;
      const combinedCtx = combinedCanvas.getContext("2d");
      combinedCtx.fillStyle = "#000000";
      combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

      for (const maskPath of maskPaths) {
        try {
          const maskImg = await this.createImageFromSrc(
            `${apiEndpoint}${maskPath}`,
          );
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = combinedCanvas.width;
          tempCanvas.height = combinedCanvas.height;
          const tempCtx = tempCanvas.getContext("2d");
          tempCtx.drawImage(
            maskImg,
            0,
            0,
            combinedCanvas.width,
            combinedCanvas.height,
          );

          const src = tempCtx.getImageData(
            0,
            0,
            tempCanvas.width,
            tempCanvas.height,
          );
          const dst = combinedCtx.getImageData(
            0,
            0,
            combinedCanvas.width,
            combinedCanvas.height,
          );
          for (let i = 0; i < src.data.length; i += 4) {
            if (src.data[i] > 128) {
              dst.data[i] =
                dst.data[i + 1] =
                dst.data[i + 2] =
                dst.data[i + 3] =
                  255;
            }
          }
          combinedCtx.putImageData(dst, 0, 0);
        } catch (error) {
          console.error(`Failed to load mask: ${maskPath}`, error);
        }
      }
      return combinedCanvas.toDataURL("image/png");
    },

    clearSAM3Masks() {
      this.sam3MasksList = [];
      this.sam3CurrentMaskIndex = 0;
      this.samMask = null;
      this.samMaskGenerated = false;
      this.sam3TextPrompt = "";
    },

    undoLastSAM3Mask() {
      if (!this.sam3MasksList?.length) return;
      this.sam3MasksList.pop();
      if (this.sam3MasksList.length > 0) {
        const apiEndpoint = this.$store?.state?.root_api || "";
        this.loadAndCombineAllMasks(apiEndpoint, this.sam3MasksList)
          .then((combinedMask) => {
            if (this.isDestroyed) return;
            this.samMask = combinedMask;
            this.samMaskGenerated = true;
            this.redrawCanvas();
            this.$message.info(
              `${this.sam3MasksList.length} mask(s) remaining`,
            );
          })
          .catch(() => {
            if (!this.isDestroyed)
              this.$message.error("Failed to update masks");
          });
      } else {
        this.samMask = null;
        this.samMaskGenerated = false;
        this.redrawCanvas();
        this.$message.info("All masks cleared");
      }
    },

    // ==================== RENDERING ====================

    async drawSAMMask() {
      if (!this.samMask || !this.canvas || this.isDestroyed) return;
      try {
        const maskImg = await this.createImageFromSrc(this.samMask);
        if (this.isDestroyed) return;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(maskImg, 0, 0, this.canvas.width, this.canvas.height);

        const imageData = tempCtx.getImageData(
          0,
          0,
          this.canvas.width,
          this.canvas.height,
        );
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
        console.error("Error drawing mask:", error);
      }
    },

    async drawBaseImage() {
      if (!this.baseImg || !this.ctx || this.isDestroyed) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(
        this.baseImg,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );

      if (this.removalMode === "draw") {
        this.redrawAllStrokes();
      } else if (
        (this.removalMode === "sam2" || this.removalMode === "sam3") &&
        this.samMaskGenerated
      ) {
        await this.drawSAMMask();
      }
    },

    async redrawCanvas() {
      await this.drawBaseImage();
    },

    // ==================== SUBMIT ====================

    async handleSubmit() {
      if (!this.hasValidMask || this.isProcessing) return;
      this.isProcessing = true;
      this.isLoading = true;
      this.startLoadingMessages();
      try {
        const maskBase64 =
          this.removalMode === "draw"
            ? await this.createDrawingMask()
            : this.samMask;

        const imageCanvas = document.createElement("canvas");
        imageCanvas.width = this.baseImg.width;
        imageCanvas.height = this.baseImg.height;
        imageCanvas.getContext("2d").drawImage(this.baseImg, 0, 0);

        const requestData = {
          room_id: this.roomId,
          image_base64: imageCanvas.toDataURL("image/png"),
          mask_base64: maskBase64,
          removal_mode: this.removalMode,
          canvas_dimensions: {
            width: this.baseImg.width,
            height: this.baseImg.height,
          },
        };

        this.$emit("submit-removal", requestData);
        await this.sendRemovalRequest(requestData);
      } catch (error) {
        console.error("Error submitting removal request:", error);
        this.$message.error("Failed to submit removal request");
        this.isProcessing = false;
      } finally {
        this.isLoading = false;
        this.stopLoadingMessages();
        this.$emit("update-processing", false);
      }
    },

    // For draw mode — convert canvas brush strokes to binary mask base64
    async createDrawingMask() {
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = this.baseImg.width;
      maskCanvas.height = this.baseImg.height;
      const maskCtx = maskCanvas.getContext("2d");

      // Black background = keep
      maskCtx.fillStyle = "#000000";
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      // Scale from canvas-internal px to original image px
      // canvas internal resolution = this.baseImg dimensions (set in setupCanvas)
      // so scaleX/scaleY = 1.0 — but we keep it explicit for safety
      const scaleX = this.baseImg.width / this.canvas.width;
      const scaleY = this.baseImg.height / this.canvas.height;

      // Replay all non-eraser strokes as WHITE on the mask
      maskCtx.lineCap = "round";
      maskCtx.lineJoin = "round";

      this.drawingHistory.forEach((stroke) => {
        if (!stroke.points.length) return;

        if (stroke.isEraser) {
          // Eraser = paint BLACK (erase the mask area)
          maskCtx.globalCompositeOperation = "source-over";
          maskCtx.strokeStyle = "#000000";
          maskCtx.lineWidth = stroke.brushSize * scaleX;
          maskCtx.beginPath();
          maskCtx.moveTo(
            stroke.points[0].x * scaleX,
            stroke.points[0].y * scaleY,
          );
          stroke.points.forEach((p) =>
            maskCtx.lineTo(p.x * scaleX, p.y * scaleY),
          );
          maskCtx.stroke();
        } else {
          // Brush = paint WHITE (mark area to remove)
          maskCtx.globalCompositeOperation = "source-over";
          maskCtx.strokeStyle = "#ffffff";
          maskCtx.lineWidth = stroke.brushSize * scaleX;
          maskCtx.beginPath();
          maskCtx.moveTo(
            stroke.points[0].x * scaleX,
            stroke.points[0].y * scaleY,
          );
          stroke.points.forEach((p) =>
            maskCtx.lineTo(p.x * scaleX, p.y * scaleY),
          );
          maskCtx.stroke();
        }
      });

      return maskCanvas.toDataURL("image/png");
    },
    clearAll() {
      // Clear all drawing/mask state
      this.drawingHistory = [];
      this.currentStroke = [];
      this.samPoints = [];
      this.samMask = null;
      this.samMaskGenerated = false;
      this.sam3MasksList = [];
      this.sam3CurrentMaskIndex = 0;
      this.sam3TextPrompt = "";
      this.hasMaskReady = false;
      this.isProcessing = false;
      this.isFetchingSAMMask = false;

      // Redraw canvas with just the base image (no overlays)
      this.redrawCanvas();

      // Emit that mask is no longer ready
      this.$emit("mask-ready", false);
    },
    async sendRemovalRequest(requestData) {
      try {
        const apiEndpoint = this.$store?.state?.root_api || "";
        const response = await fetch(`${apiEndpoint}engine/remove-object/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + localStorage.getItem("token"),
          },
          body: JSON.stringify(requestData),
        });

        const result = await response.json();

        if (response.status === 402) {
          this.$emit("insufficient-credits", result.msg, result.buid);
          return;
        }
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        this.$message.success("Object removed successfully!");

        // ← CLEAR CANVAS BEFORE EMITTING SUCCESS
        this.clearAll();
        console.log(result);
        debugger;

        this.$emit("removal-success", result);
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      } finally {
        if (!this.isDestroyed) this.isProcessing = false;
      }
    },
  },
};
</script>

<style scoped>
.canvas-wrapper-desktop {
  position: relative;
  width: 100%;
  height: 100%;
}

.canvas-overlay {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 85vh;
}

/* JS controls canvas size via style.width/height — no CSS override */
.canvas-overlay canvas {
  pointer-events: all;
  display: block;
  flex-shrink: 0;
  /* cursor: none !important; */
}

.sam-point-indicator {
  position: absolute;
  width: 24px;
  height: 24px;
  background: rgba(255, 68, 68, 0.9);
  border: 2px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.sam-point-indicator.point-active {
  background: rgba(255, 0, 0, 1);
  transform: translate(-50%, -50%) scale(1.2);
}

.point-number {
  color: white;
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
}

.custom-cursor {
  position: absolute;
  border: 2px solid;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 10;
}

/*animation wave */
/* Loading overlay styles */
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
    rgba(0, 102, 255, 0.4) 20%,
    rgba(0, 102, 255, 0.3) 30%,
    rgba(0, 102, 255, 0.2) 35%,
    rgba(0, 102, 255, 0.15) 40%,
    rgba(0, 102, 255, 0.1) 50%,
    rgba(0, 102, 255, 0) 100%
  );
  animation:
    moveWaveLeftToRight 3s linear infinite,
    waveFade 3s ease-in-out infinite;
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
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.loading-text {
  position: relative;
  color: #fff;
  text-align: center;
  z-index: 3;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  /* background: rgba(0, 0, 0, 0.3); */
  padding: 20px 30px;
  border-radius: 10px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
