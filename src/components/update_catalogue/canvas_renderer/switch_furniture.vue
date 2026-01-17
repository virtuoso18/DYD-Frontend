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
    <a-row style="height: 100%">
      <a-col style="height: 100%; position: relative" :span="16">
        <div class="canvas-wrapper" ref="container">
          <canvas ref="imageCanvas"></canvas>

          <canvas
            ref="drawCanvas"
            class="draw-layer"
            @mousedown="startDraw"
            @mousemove="draw"
            @mouseup="stopDraw"
            @mouseleave="stopDraw"
          ></canvas>

          <!-- TOOLBAR -->
          <div v-if="isBrushMode" class="canvas-toolbar">
            <!-- Brush value -->
            <div class="brush-value">{{ brushSize }}px</div>

            <!-- Vertical range -->
            <input
              type="range"
              min="5"
              max="50"
              :value="brushSize"
              @input="changeBrushSize($event.target.value)"
              class="vertical-slider"
            />

            <!-- Actions -->
            <div class="tool-actions">
              <button @click="undoDrawing" :disabled="!canUndo" title="Undo">
                ↶
              </button>

              <button @click="redoDrawing" :disabled="!canRedo" title="Redo">
                ↷
              </button>

              <button @click="resetDrawing" title="Reset">🔄</button>
            </div>
          </div>
        </div>
      </a-col>

      <a-col style="height: 100%" :span="8">
        <!-- Control Panel -->
        <div class="modal-control-panel">
          <!-- Mode Toggle -->
          <div style="display: flex; gap: 8px">
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
              ✕ Un-select
            </button>
          </div>

          <a-row style="overflow-y: scroll">
            <a-col
              :span="12"
              v-if="catalogItems_Furnitures?.length > 0 && isBrushMode"
              v-for="product in catalogItems_Furnitures"
            >
              <SuggestetdSwitchFurniture
                :product="product"
                :selected_furniture="selected_furniture"
                :selectFurniture="selectFurniture"
              />
            </a-col>

            <a-col
              :span="12"
              v-if="selectedObjects && !isBrushMode"
              v-for="selectedObj in selectedObjects"
            >
              <selectedImage_mask_overlay
                :selectedImage="baseImage"
                :maskPath="maskWithUrl[selectedObj]"
                :selectedObjectKey="selectedObj"
                :toggleObjectSelection="toggleObjectSelection"
              />
            </a-col>
          </a-row>

          <div class="control-button-sec">
            <!-- Submit Actions -->
            <div style="display: flex; flex-direction: column; gap: 8px">
              <a-alert v-if="!selected_furniture" message="Please Select Furniture Product" type="info" />
              <a-button
                type="primary"
                class="modal-submit-btn"
                @click="handleSwitchFurniture"
                :loading="isProcessing"
                style="flex: 1"
                :disabled="!selected_furniture"
              >
                ✓ Apply & Select Furniture
              </a-button>

              <!-- <a-button
                class="cancel-button"
                danger
                style="flex: 1"
                @click="handleClose"
                :disabled="isProcessing"
              >
                ✕ Cancel
              </a-button> -->
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import SuggestetdSwitchFurniture from "./SuggestetdSwitchFurniture.vue";
import selectedImage_mask_overlay from "@/components/update_catalogue/canvas_renderer/canvasMaskRendererForSwitchFurniture.vue";
export default {
  name: "SwitchFurnitureModal",
  components: {
    selectedImage_mask_overlay,
    SuggestetdSwitchFurniture,
  },
  props: {
    visible: Boolean,
    baseImage: String,
    baseKey: String,
    selectedObjects: Array,
    objectMaskRegions: Array,
    objectMaskImageData: Array,
    isLoading: Boolean,
    toggleObjectSelection: Function,
    TotalObjects: Object,
    openSelectFurnitureModel: Function,
    handleSwitchFurnitureClicked: Function,
    renderFurnitureSwitching:Function
  },
  emits: ["update:visible", "apply-changes", "close"],
  data() {
    return {
      imageCanvas: null,
      drawCanvas: null,
      imageCtx: null,
      drawCtx: null,

      img: null,
      canvasWidth: 0,
      canvasHeight: 0,

      isBrushMode: true,
      isDrawing: false,
      brushSize: 10,
      _imgTransform: {},

      /* MASKING STATE */
      maskImages: {}, // key -> Image
      maskWithUrl: {},
      //history stack
      undoStack: [],
      redoStack: [],
      maxHistory: 100,

      //furniture
      selected_furniture: null,
      catalogItems_Furnitures: [],
      catalogItems_Lights: [],
    };
  },

  computed: {
    isVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },

    canUndo() {
      return this.undoStack.length > 0;
    },

    canRedo() {
      return this.redoStack.length > 0;
    },
  },

  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          requestAnimationFrame(async () => {
            await this.initCanvas();
            await this.loadSelectedMasks();
            this.renderBaseWithMasks();
          });
        });
      }
    },

    // ADD THIS
    selectedObjects: {
      handler() {
        this.$nextTick(async () => {
          await this.loadSelectedMasks();
          this.renderBaseWithMasks();
        });
      },
      deep: true,
    },
  },
  mounted() {
    if (this.$route.query.brand) {
      this.fetchCatalogItems(this.$route.query.brand);
    } else {
      this.fetchCatalogItems();
    }
    this.fetchLights();
  },
  methods: {
    saveState() {
      if (!this.drawCanvas) return;

      const snapshot = this.drawCanvas.toDataURL();

      this.undoStack.push(snapshot);

      // limit memory
      if (this.undoStack.length > this.maxHistory) {
        this.undoStack.shift();
      }

      // once new draw happens → redo is invalid
      this.redoStack = [];
    },
    /* ================= CANVAS INIT ================= */

    async initCanvas() {
      const container = this.$refs.container;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      this.canvasWidth = rect.width;
      this.canvasHeight = rect.height;

      this.imageCanvas = this.$refs.imageCanvas;
      this.drawCanvas = this.$refs.drawCanvas;

      this.imageCanvas.width = this.canvasWidth;
      this.imageCanvas.height = this.canvasHeight;
      this.drawCanvas.width = this.canvasWidth;
      this.drawCanvas.height = this.canvasHeight;

      this.imageCtx = this.imageCanvas.getContext("2d");
      this.drawCtx = this.drawCanvas.getContext("2d");

      await this.loadImage();
    },

    loadImage() {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          this.img = img;
          resolve();
        };
        img.onerror = reject;
        img.src = this.baseImage;
      });
    },

    /* ================= MASK LOADING ================= */
    loadSelectedMasks() {
      this.maskImages = {};

      const promises = this.selectedObjects.map((key) => {
        return new Promise((resolve) => {
          const maskImg = new Image();
          maskImg.crossOrigin = "anonymous";
          maskImg.src = this.$store.state.root_api + this.TotalObjects[key];

          maskImg.onload = () => {
            this.maskImages[key] = maskImg;
            this.maskWithUrl[key] =
              this.$store.state.root_api + this.TotalObjects[key];
            resolve();
          };

          maskImg.onerror = () => resolve();
        });
      });

      return Promise.all(promises);
    },

    renderBaseWithMasks() {
      if (!this.imageCtx || !this.img) return;

      const ctx = this.imageCtx;
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      /* Base image */
      const scale = Math.min(
        this.canvasWidth / this.img.width,
        this.canvasHeight / this.img.height
      );

      const w = this.img.width * scale;
      const h = this.img.height * scale;
      const x = (this.canvasWidth - w) / 2;
      const y = (this.canvasHeight - h) / 2;

      // STORE TRANSFORM
      this._imgTransform = { x, y, w, h };

      ctx.drawImage(this.img, x, y, w, h);

      /* Draw masks */
      this.drawMasks();
    },

    drawMasks() {
      const { x, y, w, h } = this._imgTransform;
      const ctx = this.imageCtx;

      this.selectedObjects.forEach((key) => {
        const mask = this.maskImages[key];
        if (!mask) return;

        const off = document.createElement("canvas");
        off.width = w;
        off.height = h;

        const offCtx = off.getContext("2d");

        // Draw mask with SAME size as base image
        offCtx.drawImage(mask, 0, 0, w, h);

        const imgData = offCtx.getImageData(0, 0, w, h);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const isObject = r > 200 && g > 200 && b > 200;

          if (isObject) {
            data[i] = 255;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 180;
          } else {
            data[i + 3] = 0;
          }
        }

        offCtx.putImageData(imgData, 0, 0);

        // DRAW AT SAME OFFSET AS IMAGE
        ctx.drawImage(off, x, y);
      });
    },
    /* ================= DRAW (UNCHANGED) ================= */

    startDraw(e) {
      if (!this.isBrushMode) return;
      const x = e.offsetX;
      const y = e.offsetY;
      if (!this.isInsideImage(x, y)) return;
      this.isDrawing = true;
      this.drawCtx.beginPath();
      this.drawCtx.moveTo(e.offsetX, e.offsetY);
    },

    draw(e) {
      if (!this.isDrawing || !this.isBrushMode) return;
      const inside = this.isInsideImage(e.offsetX, e.offsetY);
      this.drawCanvas.style.cursor = inside ? "crosshair" : "not-allowed";

      const x = e.offsetX;
      const y = e.offsetY;
      if (!this.isInsideImage(x, y)) {
        this.stopDraw();
        return;
      }

      this.drawCtx.strokeStyle = "rgba(255,0,0,0.5)";
      this.drawCtx.lineWidth = this.brushSize;
      this.drawCtx.lineCap = "round";
      this.drawCtx.lineJoin = "round";

      this.drawCtx.lineTo(e.offsetX, e.offsetY);
      this.drawCtx.stroke();
    },

    stopDraw() {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      this.drawCtx.closePath();
      this.saveState();
    },

    /* ================= UI ================= */

    handleClose() {
      this.$emit("close");
      this.isVisible = false;
    },

    formatObjectName(key) {
      if (!key) return "";
      return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    },

    changeBrushSize(val) {
      this.brushSize = val;
    },
    isInsideImage(x, y) {
      const { x: ix, y: iy, w, h } = this._imgTransform;
      return x >= ix && x <= ix + w && y >= iy && y <= iy + h;
    },

    createCombinedMaskCanvas({ inverse = false } = {}) {
      /* =======================
     SAFETY GUARDS
  ======================= */
      if (!this.img || !this.img.naturalWidth || !this.img.naturalHeight) {
        console.error("Base image not loaded");
        return null;
      }

      const imgW = this.img.naturalWidth;
      const imgH = this.img.naturalHeight;

      /* =======================
     EXPORT CANVAS (REAL SIZE)
  ======================= */
      const canvas = document.createElement("canvas");
      canvas.width = imgW;
      canvas.height = imgH;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, imgW, imgH);

      /* =======================
     UI → IMAGE SCALE FACTOR
  ======================= */
      const { x, y, w, h } = this._imgTransform;

      const scaleX = imgW / w;
      const scaleY = imgH / h;

      /* =======================
      MERGE API MASKS
  ======================= */
      this.selectedObjects.forEach((key) => {
        const mask = this.maskImages[key];
        if (!mask) return;

        const off = document.createElement("canvas");
        off.width = imgW;
        off.height = imgH;

        const offCtx = off.getContext("2d");

        // draw mask at REAL resolution
        offCtx.drawImage(mask, 0, 0, imgW, imgH);

        const imgData = offCtx.getImageData(0, 0, imgW, imgH);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const isObject = data[i] > 200;

          if (isObject) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
          } else {
            data[i + 3] = 0;
          }
        }

        offCtx.putImageData(imgData, 0, 0);
        ctx.drawImage(off, 0, 0);
      });

      /* =======================
      MERGE USER DRAWING
     (UI → IMAGE SPACE)
  ======================= */
      if (this.drawCanvas) {
        const drawOff = document.createElement("canvas");
        drawOff.width = imgW;
        drawOff.height = imgH;

        const dCtx = drawOff.getContext("2d");

        // Map UI drawing → image pixels
        dCtx.drawImage(
          this.drawCanvas,
          x,
          y,
          w,
          h, // source (UI image area)
          0,
          0,
          imgW,
          imgH // destination (real image)
        );

        // convert red → white
        const dImg = dCtx.getImageData(0, 0, imgW, imgH);
        const dData = dImg.data;

        for (let i = 0; i < dData.length; i += 4) {
          if (dData[i + 3] > 0) {
            dData[i] = 255;
            dData[i + 1] = 255;
            dData[i + 2] = 255;
            dData[i + 3] = 255;
          }
        }

        dCtx.putImageData(dImg, 0, 0);
        ctx.drawImage(drawOff, 0, 0);
      }

      /* =======================
      INVERSE (OPTIONAL)
  ======================= */
      if (inverse) {
        const imgData = ctx.getImageData(0, 0, imgW, imgH);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            data[i + 3] = 0;
          } else {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
          }
        }

        ctx.putImageData(imgData, 0, 0);
      }

      return canvas;
    },
    handleSwitchFurniture() {
      const canvas = this.createCombinedMaskCanvas({ inverse: false });
      canvas.toBlob((blob) => {
        this.renderFurnitureSwitching(this.selected_furniture,blob);
        // this.openSelectFurnitureModel(blob);
      });
    },
    applyAndDownloadNormalMask() {
      const canvas = this.createCombinedMaskCanvas({ inverse: false });
      this.downloadMask(canvas, "combined_mask.png");
    },
    downloadMask(canvas, filename) {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
      }, "image/png");
    },
    //==== undo redo and reset section =====
    undoDrawing() {
      if (!this.canUndo) return;

      const lastState = this.undoStack.pop();

      // save current for redo
      this.redoStack.push(this.drawCanvas.toDataURL());

      this.restoreCanvas(lastState);
    },
    redoDrawing() {
      if (!this.canRedo) return;

      const nextState = this.redoStack.pop();

      // save current for undo
      this.undoStack.push(this.drawCanvas.toDataURL());

      this.restoreCanvas(nextState);
    },
    restoreCanvas(dataUrl) {
      const img = new Image();
      img.onload = () => {
        this.drawCtx.clearRect(
          0,
          0,
          this.drawCanvas.width,
          this.drawCanvas.height
        );
        this.drawCtx.drawImage(img, 0, 0);
      };
      img.src = dataUrl;
    },
    resetDrawing() {
      if (!this.drawCanvas) return;

      this.drawCtx.clearRect(
        0,
        0,
        this.drawCanvas.width,
        this.drawCanvas.height
      );

      this.undoStack = [];
      this.redoStack = [];
    },
    async fetchCatalogItems(brand = null) {
      try {
        let url = `${this.$store.state.root_api}product/api/3d-products/`;
        if (brand) {
          url = `${this.$store.state.root_api}product/api/load-brand-products/3d-products/${brand}`;
        }

        const response = await fetch(url, {
          method: "GET",
          // body: formData,
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log("Furniture Data:", data);

        if (data && data.data) {
          this.catalogItems_Furnitures = data.data;
        }
      } catch (error) {
        console.error("Failed to fetch furniture:", error);
      }
    },
    async fetchLights(brand = null) {
      try {
        let url = `${this.$store.state.root_api}product/api/lights/`;
        if (brand) {
          url = `${this.$store.state.root_api}product/api/load-brand-products/lights/${brand}`;
        }

        const response = await fetch(url, {
          method: "GET",
          // body: formData,
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log("Lights Data:", data);

        if (data && data.data) {
          this.catalogItems_Lights = data.data;
        }
      } catch (error) {
        console.error("Failed to fetch lights:", error);
      }
    },
    viewProduct(product) {
      console.log("Product detail clicked:", product);
      // Handle product detail navigation
    },
    selectFurniture(product) {
      this.selected_furniture = product;
    },
  },
};
</script>

<style scoped>
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
  /* background: #f5f5f5; */
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #e0e0e0;
  height: 100%;
  overflow-y: auto;
  justify-content: space-between;
}
.control-button-sec {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.action-button-sec {
  width: 100%;
  justify-content: space-around;
  margin: 10px 2px;
  flex-wrap: wrap;
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
  padding: 6px 6px;
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
  width: 100%;
  border-radius: 6px;
  font-weight: 600;
  height: 36px;
}
.cancel-button {
  width: 100%;
}

.modal-overlay-canvas.disabled {
  opacity: 0.5;
}

.modal-drawing-canvas.disabled {
  opacity: 0.5;
  pointer-events: none;
}
.unselectObjecBtn {
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
}
.unselectObjecBtn:hover {
  background-color: #333;
  color: white;
}
.unselectObjecBtn > span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
}
.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  /* margin-right: 10px; */
  /* min-width: 70vw; */
  /*  min-height: 50vh; */
}
.canvas-wrapper canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.canvas-toolbar {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  width: 48px;

  /* background: rgba(255, 255, 255, 0.95); */
  border-radius: 12px;
  padding: 8px 6px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12); */
  z-index: 10;
}

/* Brush size label */
.brush-value {
  font-size: 11px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

/* Vertical slider */
.vertical-slider {
  writing-mode: bt-lr; /* Firefox */
  -webkit-appearance: slider-vertical; /* Chrome / Edge */
  width: 6px;
  height: 120px;
  cursor: pointer;
}

/* Action buttons */
.tool-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tool-actions button {
  width: 32px;
  height: 32px;

  border-radius: 8px;
  border: none;
  background: #f5f5f5;

  font-size: 16px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.2s ease;
}

.tool-actions button:hover:not(:disabled) {
  background: #e6f0ff;
  color: #2952eb;
}

.tool-actions button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
