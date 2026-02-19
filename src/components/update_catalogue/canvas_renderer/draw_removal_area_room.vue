<template>
  <div>
    <!-- Desktop Modal -->
    <a-modal
    centered
      v-if="!isMobile"
      v-model:open="localVisible"
      title="Object Removal Tool"
      width="95%"
      :maskClosable="false"
      @cancel="handleCancel"
      class="removal-modal"
    >
      <template #footer> </template>

      <a-row>
        <a-col :span="18">
          <div class="removal-container-desktop">
            <div class="instructions-banner" :class="removalMode">
              <div class="instruction-content">
                <span class="mode-icon">{{ getModeIcon() }}</span>
                <div class="instruction-text">
                  <strong class="font-poppins">{{ getModeTitle() }}</strong>
                  <span class="font-poppins">{{ getModeInstructions() }}</span>
                </div>
              </div>
              <div class="status-indicator">
                <span v-if="removalMode === 'sam2'">
                  {{ samPoints.length }} point{{
                    samPoints.length !== 1 ? "s" : ""
                  }}
                  <span
                    v-if="samMaskGenerated"
                    style="color: #4caf50; margin-left: 8px"
                    >● Detected</span
                  >
                  <span v-else style="color: #ff9800; margin-left: 8px"
                    >○ Ready</span
                  >
                </span>
                <span v-else-if="removalMode === 'sam3'">
                  {{ sam3MasksList.length }} mask{{
                    sam3MasksList.length !== 1 ? "s" : ""
                  }}
                  <span
                    v-if="samMaskGenerated"
                    style="color: #4caf50; margin-left: 8px"
                    >● Detected</span
                  >
                  <span v-else style="color: #ff9800; margin-left: 8px"
                    >○ Ready</span
                  >
                </span>
                <span v-else>
                  {{ drawingHistory.length }} stroke{{
                    drawingHistory.length !== 1 ? "s" : ""
                  }}
                </span>
              </div>
            </div>

            <div class="canvas-wrapper-desktop" ref="canvasWrapper">
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

                <!-- SAM Points Indicators -->
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

            <!-- Processing Overlay -->
            <div
              v-if="isProcessing || isFetchingSAMMask"
              class="processing-overlay"
            >
              <a-spin size="large" />
              <p>
                {{
                  isFetchingSAMMask
                    ? "Generating mask..."
                    : "Processing removal request..."
                }}
              </p>
            </div>
          </div>
        </a-col>
        <a-col :span="6" class="py-2 px-4">
          <div class="control-sec-panel-desktop">
            <div class="left-controls">
              <div class="mode-section">
                <span class="control-label font-poppins">Mode:</span>
                <a-radio-group
                  v-model:value="removalMode"
                  button-style="solid"
                  :disabled="isProcessing"
                  size="small"
                >
                  <a-radio-button value="draw">✏️ Draw</a-radio-button>
                  <a-radio-button value="sam2">🎯 SAM-2</a-radio-button>
                  <a-radio-button value="sam3">🎯 SAM-3</a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <div class="sm:min-h-[300px]"></div>

            <div class="right-controls">
              <div class="clearfix w-full">
                <!-- Draw Mode Controls -->
                <template v-if="removalMode === 'draw'">
                  <div class="control-group flex justify-between w-full">
                    <a-button
                      class="w-2/5 button-flex-with-center font-poppins"
                      @click="clearDrawing"
                      :disabled="isProcessing || drawingHistory.length === 0"
                      size="small"
                    >
                      <template #icon><DeleteOutlined /></template>
                      Clear
                    </a-button>
                    <a-button
                      class="w-2/5 button-flex-with-center"
                      @click="undoLastStroke"
                      :disabled="drawingHistory.length === 0 || isProcessing"
                      size="small"
                    >
                      <template #icon><UndoOutlined /></template>
                      Undo
                    </a-button>
                  </div>

                  <div class="control-group">
                    <span class="control-label font-poppins">Brush:</span>
                    <a-slider
                      v-model:value="brushSize"
                      :min="5"
                      :max="100"
                      :step="5"
                      style="width: 150px"
                      :disabled="isProcessing"
                    />
                    <span class="value-label">{{ brushSize }}px</span>
                  </div>

                  <div class="control-group w-full">
                    <a-button
                      class="w-full font-poppins"
                      :type="useEraser ? 'primary' : 'default'"
                      @click="toggleEraser"
                      :disabled="isProcessing"
                      size="small"

                    >
                      🧹 Eraser
                    </a-button>
                  </div>
                </template>

                <!-- SAM-2 Mode Controls -->
                <template v-if="removalMode === 'sam2'">
                  <div class="control-group flex justify-between w-full">
                    <a-button
                      class="w-2/5 button-flex-with-center"
                      @click="clearSAMPoints"
                      :disabled="isProcessing || samPoints.length === 0"
                      size="small"
                    >
                      <template #icon><DeleteOutlined /></template>
                      Clear ({{ samPoints.length }})
                    </a-button>
                    <a-button
                      class="w-2/5 button-flex-with-center"
                      @click="undoLastSAMPoint"
                      :disabled="samPoints.length === 0 || isProcessing"
                      size="small"
                    >
                      <template #icon><UndoOutlined /></template>
                      Undo
                    </a-button>
                  </div>

                  <div class="control-group flex items-center justify-between">
                    <span class="control-label">Confidence:</span>
                    <a-slider
                      v-model:value="samConfidence"
                      :min="0"
                      :max="1"
                      :step="0.05"
                      style="width: 100px"
                      :disabled="isProcessing"
                    />
                    <span class="value-label">{{
                      samConfidence.toFixed(2)
                    }}</span>
                  </div>

                  <a-button
                    class="w-full"
                    @click="fetchSAMMask"
                    :loading="isFetchingSAMMask"
                    :disabled="samPoints.length === 0 || isProcessing"
                    type="primary"
                    size="small"
                  >
                    🎯 Detect
                  </a-button>
                </template>

                <!-- SAM-3 Mode Controls -->
                <template v-if="removalMode === 'sam3'">
                  <div class="control-group w-full flex justify-between">
                    <a-button
                      class="w-2/5 button-flex-with-center"
                      @click="clearSAM3Masks"
                      :disabled="isProcessing || sam3MasksList.length === 0"
                      size="small"
                    >
                      <template #icon><DeleteOutlined /></template>
                      Clear ({{ sam3MasksList.length }})
                    </a-button>
                    <a-button
                      class="w-2/5 button-flex-with-center"
                      @click="undoLastSAM3Mask"
                      :disabled="sam3MasksList.length === 0 || isProcessing"
                      size="small"
                    >
                      <template #icon><UndoOutlined /></template>
                      Undo
                    </a-button>
                  </div>

                  <div class="control-group">
                    <span class="control-label">Confidence:</span>
                    <a-slider
                      v-model:value="samConfidence"
                      :min="0"
                      :max="1"
                      :step="0.05"
                      style="width: 130px"
                      :disabled="isProcessing"
                    />
                    <span class="value-label">{{
                      samConfidence.toFixed(2)
                    }}</span>
                  </div>
                  <div class="w-full mb-4" style="margin: 5px 0px;">
                    <a-textarea
                    rows="4"
                      v-model:value="sam3TextPrompt"
                      placeholder="e.g., person, chair, table..."
                      :disabled="isProcessing"
                      size="small"
                    />
                  </div>

                  <a-button
                   class="w-full my-4"
                    @click="fetchSAM3Mask"
                    :loading="isFetchingSAMMask"
                    :disabled="!sam3TextPrompt || isProcessing"
                    type="primary"
                    size="small"
                  >
                    🎯 Detect
                  </a-button>
                </template>
              </div>
              <div class="cancel-remove-sec w-full flex justify-between">
                <a-button
                  class="2/5 font-poppins"
                  @click="handleCancel"
                  :disabled="isProcessing"
                >
                  Cancel
                </a-button>
                <a-button
                  clas="w-2/5 font-poppins"
                  type="primary"
                  @click="handleSubmit"
                  :loading="isProcessing"
                  :disabled="!hasValidMask"
                >
                  ✨ Remove Area
                </a-button>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-modal>

    <!-- Mobile Drawer -->
   <a-drawer
  v-else
  v-model:open="localVisible"
  title="Object Removal Tool"
  placement="bottom"
  :height="'95vh'"
  @close="handleCancel"
  :body-style="{ padding: '16px', overflow: 'auto' }"
  class="removal-drawer font-poppins"
>
  <div class="flex flex-col !gap-3 !h-full">
    <!-- Mode Toggle -->
    <div class="!px-3 !py-3 flex items-center justify-between bg-white border border-gray-200 rounded">
      <span class="!text-[13px] font-poppins !font-medium !text-gray-600 whitespace-nowrap">Mode:</span>
      <a-radio-group
        v-model:value="removalMode"
        button-style="solid"
        :disabled="isProcessing"
        size="small"
        class="font-poppins"
      >
        <a-radio-button value="draw">✏️ Draw</a-radio-button>
        <a-radio-button value="sam2">🎯 SAM-2</a-radio-button>
        <a-radio-button value="sam3">🎯 SAM-3</a-radio-button>
      </a-radio-group>
    </div>

    <!-- Instructions -->
    <div
      class="flex items-center justify-between !px-4 !py-3 rounded border text-[13px] font-normal transition-colors"
      :class="{
        'bg-gradient-to-r from-gray-100 to-white border-gray-200 !text-gray-900': removalMode === 'draw',
        'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 !text-gray-900': removalMode === 'sam2' || removalMode === 'sam3'
      }"
    >
      <div class="flex items-center !gap-3">
        <span class="text-2xl drop-shadow-md">{{ getModeIcon() }}</span>
        <div class="flex flex-col !gap-1">
          <strong class="!text-[12px] font-poppins font-medium uppercase tracking-[0.5px] !text-gray-900">
            {{ getModeTitle() }}
          </strong>
          <span class="!text-[12px] font-poppins !text-gray-600">
            {{ getModeInstructions() }}
          </span>
        </div>
      </div>
      <span
        class="bg-white/60 !px-3 !py-1 rounded !text-[11px] !font-medium border border-black/10 tracking-[0.3px] whitespace-nowrap !text-gray-900"
      >
        {{ removalMode.toUpperCase() }}
      </span>
    </div>

    <!-- Canvas -->
    <div
      class="relative w-full !h-[800px] rounded border border-gray-200  flex items-center justify-center bg-gray-100 !my-3"
      ref="canvasWrapperMobile"
    >
      <div class="relative inline-block ">
        <canvas
          ref="drawCanvasMobile"
          @mousedown="handleCanvasMouseDown"
          @mousemove="handleCanvasMouseMove"
          @mouseup="handleCanvasMouseUp"
          @mouseleave="handleCanvasMouseLeave"
          @click="handleCanvasClick"
          @touchstart="handleCanvasMouseDown"
          @touchmove="handleCanvasMouseMove"
          @touchend="handleCanvasMouseUp"
          :style="{ cursor: getCursorStyle() }"
          class="block rounded-sm "
        ></canvas>

        <!-- Draw Mode Cursor -->
        <div
          v-if="showCursor && removalMode === 'draw'"
          class="absolute rounded-full pointer-events-none z-[1000] shadow-[0_0_0_1px_rgba(255,255,255,0.5)] transition-[transform,opacity] duration-75 ease-out"
          :style="{
            left: cursorX + 'px',
            top: cursorY + 'px',
            width: brushSize * displayScale + 'px',
            height: brushSize * displayScale + 'px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: useEraser ? '#ffffff' : '#ff4444',
            background: useEraser
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 68, 68, 0.15)',
            transform: 'translate(-50%, -50%)'
          }"
        ></div>

        <!-- SAM Points -->
        <div
          v-for="(point, index) in samPoints"
          :key="'sam-point-' + index"
          class="absolute w-6 h-6 bg-red-500 border-2 border-white rounded-full pointer-events-none z-[1000] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-200"
          :class="{
            'animate-[pulsePoint_1.5s_ease-in-out_infinite] bg-red-400':
              index === samPoints.length - 1
          }"
          :style="{
            left: point.displayX + 'px',
            top: point.displayY + 'px',
            transform: 'translate(-50%, -50%)'
          }"
        >
          <span class="!text-white text-[11px] font-bold drop-shadow">
            {{ index + 1 }}
          </span>
        </div>
      </div>
    </div>

    <!-- Controls Panel -->
    <div class="!p-4 bg-white rounded border border-gray-200">
      <!-- Draw Controls -->
      <template v-if="removalMode === 'draw'">
        <div class="flex flex-col !gap-3">
          <div class="flex flex-wrap !gap-3">
            <a-button
              @click="clearDrawing"
              :disabled="isProcessing || drawingHistory.length === 0"
              size="small"
              block
              class="flex font-poppins justify-center items-center"
            >
              <template #icon><DeleteOutlined /></template>
              Clear
            </a-button>
            <a-button
              @click="undoLastStroke"
              :disabled="drawingHistory.length === 0 || isProcessing"
              size="small"
              block
              class="flex font-poppins justify-center items-center"
            >
              <template #icon><UndoOutlined /></template>
              Undo
            </a-button>
          </div>

          <div class="flex flex-wrap items-center !gap-3">
            <span class="!text-[13px] font-poppins !font-medium !text-gray-600">
              Brush: {{ brushSize }}px
            </span>
            <a-slider
              class="flex-1"
              v-model:value="brushSize"
              :min="5"
              :max="100"
              :step="5"
              :disabled="isProcessing"
            />
          </div>

          <div class="flex font-poppins flex-wrap !gap-3">
            <a-button
              :type="useEraser ? 'primary' : 'default'"
              @click="toggleEraser"
              :disabled="isProcessing"
              block
              class="font-poppins"
            >
              🧹 {{ useEraser ? "Eraser On" : "Eraser" }}
            </a-button>
          </div>
        </div>
      </template>

      <!-- SAM-2 Controls -->
      <template v-if="removalMode === 'sam2'">
        <div class="flex flex-col !gap-3">
          <div class="flex flex-wrap !gap-3">
            <a-button
              @click="clearSAMPoints"
              :disabled="isProcessing || samPoints.length === 0"
              size="small"
              block
              class="flex font-poppins justify-center items-center"
            >
              <template #icon><DeleteOutlined /></template>
              Clear ({{ samPoints.length }})
            </a-button>
            <a-button
              @click="undoLastSAMPoint"
              :disabled="samPoints.length === 0 || isProcessing"
              size="small"
              block
              class="flex font-poppins justify-center items-center"
            >
              <template #icon><UndoOutlined /></template>
              Undo
            </a-button>
          </div>

          <div class="flex flex-wrap items-center !gap-3">
            <span class="!text-[13px] font-poppins !font-medium !text-gray-600">
              Confidence: {{ samConfidence.toFixed(2) }}
            </span>
            <a-slider
              class="flex-1"
              v-model:value="samConfidence"
              :min="0"
              :max="1"
              :step="0.05"
              :disabled="isProcessing"
            />
          </div>

          <a-button
            @click="fetchSAMMask"
            :loading="isFetchingSAMMask"
            :disabled="samPoints.length === 0 || isProcessing"
            type="primary"
            block
            class="font-poppins"
          >
            🎯 Detect
          </a-button>
        </div>
      </template>

      <!-- SAM-3 Controls -->
      <template v-if="removalMode === 'sam3'">
        <div class="flex flex-col !gap-3">
          <div class="flex flex-wrap !gap-3">
            <a-button
              @click="clearSAM3Masks"
              :disabled="isProcessing || sam3MasksList.length === 0"
              size="small"
              block
              class="flex font-poppins justify-center items-center"
            >
              <DeleteOutlined />
              Clear ({{ sam3MasksList.length }})
            </a-button>
            <a-button
              @click="undoLastSAM3Mask"
              :disabled="sam3MasksList.length === 0 || isProcessing"
              size="small"
              block
              class="flex font-poppins justify-center items-center"
            >
              <template #icon><UndoOutlined /></template>
              Undo
            </a-button>
          </div>

          <div class="flex flex-wrap items-center !gap-3">
            <span class="!text-[13px] font-poppins !font-medium !text-gray-600">
              Confidence: {{ samConfidence.toFixed(2) }}
            </span>
            <a-slider
              class="flex-1"
              v-model:value="samConfidence"
              :min="0"
              :max="1"
              :step="0.05"
              :disabled="isProcessing"
            />
          </div>

          <a-input
            v-model:value="sam3TextPrompt"
            placeholder="e.g., person, chair, table..."
            :disabled="isProcessing"
            size="small"
          />

          <a-button
            @click="fetchSAM3Mask"
            :loading="isFetchingSAMMask"
            :disabled="!sam3TextPrompt || isProcessing"
            type="primary"
            block
            class="font-poppins"
          >
            🎯 Detect
          </a-button>
        </div>
      </template>
    </div>

    <!-- Action Buttons -->
    <div class="flex !gap-3 !my-4 !pb-4">
      <a-button
       @click="handleCancel"
        :disabled="isProcessing"
         block
         class="font-poppins"
         
         >
        Cancel
      </a-button>
      <a-button
        type="primary"
        @click="handleSubmit"
        :loading="isProcessing"
        :disabled="!hasValidMask"
        block
        class="font-poppins"
      >
        ✨ Remove Area
      </a-button>
    </div>

    <!-- Processing Overlay -->
    <div
      v-if="isProcessing || isFetchingSAMMask"
      class="absolute inset-0 bg-white/95 flex flex-col items-center justify-center !gap-4 z-[100] rounded-md backdrop-blur-sm"
    >
      <a-spin size="large" />
      <p class="!m-0 !text-[14px] !text-gray-900 !font-medium">
        {{ isFetchingSAMMask ? "Generating mask..." : "Processing removal..." }}
      </p>
    </div>
  </div>
</a-drawer>

  </div>
</template>

<script>
import { DeleteOutlined, UndoOutlined } from "@ant-design/icons-vue";

export default {
  name: "ObjectRemovalTool",
  components: {
    DeleteOutlined,
    UndoOutlined,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    baseImage: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      localVisible: false,
      removalMode: "draw",

      canvas: null,
      ctx: null,
      baseImg: null,

      isDrawing: false,
      isProcessing: false,
      isFetchingSAMMask: false,

      brushSize: 20,
      brushColor: "rgba(255, 0, 0, 0.6)",
      displayScale: 1,

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
      isMobile: false,
    };
  },

  computed: {
    hasValidMask() {
      if (this.removalMode === "draw") {
        return this.drawingHistory.length > 0;
      } else {
        return this.samMaskGenerated && this.samMask !== null;
      }
    },
  },

  watch: {
    visible(newVal) {
      this.localVisible = newVal;
      if (newVal) {
        this.$nextTick(() => {
          this.initializeCanvas();
        });
      }
    },

    localVisible(newVal) {
      if (!newVal) {
        this.$emit("update:visible", false);
      }
    },

    baseImage() {
      if (this.localVisible) {
        this.loadBaseImage();
      }
    },

    removalMode(newVal) {
      if (newVal === "draw") {
        this.clearSAMPoints();
        this.clearSAM3Masks();
      } else if (newVal === "sam2") {
        this.clearDrawing();
        this.clearSAM3Masks();
      } else {
        this.clearDrawing();
        this.clearSAMPoints();
      }
      this.redrawCanvas();
    },
  },

  mounted() {
    this.isMobile = window.innerWidth < 1024;
    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth < 1024;
    });
  },

  methods: {
    getModeIcon() {
      if (this.removalMode === "draw") return "✏️";
      if (this.removalMode === "sam2") return "🎯";
      return "🎯";
    },

    getModeTitle() {
      if (this.removalMode === "draw") return "Draw Mode";
      if (this.removalMode === "sam2") return "SAM-2 Mode";
      return "SAM-3 Mode";
    },

    getModeInstructions() {
      if (this.removalMode === "draw")
        return "Paint over the areas you want to remove";
      if (this.removalMode === "sam2")
        return "Click points on the object to segment it";
      return "Enter object name and click detect";
    },

    toggleEraser() {
      this.useEraser = !this.useEraser;
      this.$message.info(this.useEraser ? "Eraser mode ON" : "Brush mode ON");
    },

    async initializeCanvas() {
      // Wait for refs to be available
      await this.$nextTick();

      let canvas;
      if (this.isMobile) {
        canvas = this.$refs.drawCanvasMobile;
      } else {
        canvas = this.$refs.drawCanvas;
      }

      if (!canvas) {
        console.error("Canvas element not found");
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
        this.drawBaseImage();
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

      const wrapper = this.isMobile
        ? this.$refs.canvasWrapperMobile
        : this.$refs.canvasWrapper;
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        const maxWidth = rect.width - 20;
        const maxHeight = rect.height - 20;

        const scaleX = maxWidth / this.baseImg.width;
        const scaleY = maxHeight / this.baseImg.height;
        this.displayScale = Math.min(scaleX, scaleY, 1);

        this.canvas.style.width = this.baseImg.width * this.displayScale + "px";
        this.canvas.style.height =
          this.baseImg.height * this.displayScale + "px";
      }

      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
    },

    drawBaseImage() {
      if (!this.baseImg || !this.ctx) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(
        this.baseImg,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      if (this.removalMode === "draw") {
        this.redrawAllStrokes();
      } else if (
        (this.removalMode === "sam2" || this.removalMode === "sam3") &&
        this.samMaskGenerated
      ) {
        this.drawSAMMask();
      }
    },

   getCanvasCoordinates(e) {
      const rect = this.canvas.getBoundingClientRect();
      let clientX, clientY;
      if(e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const displayX = clientX - rect.left;
      const displayY = clientY - rect.top;
      const canvasX = displayX / this.displayScale;
      const canvasY = displayY / this.displayScale;
      return {
        canvasX: Math.round(canvasX),
        canvasY: Math.round(canvasY),
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

    // ==================== DRAWING MODE ====================

    handleCanvasMouseDown(e) {
      if (this.removalMode === "draw") {
        this.startDrawing(e);
      }
    },

    handleCanvasMouseMove(e) {
      const { displayX, displayY, canvasX, canvasY } =
        this.getCanvasCoordinates(e);

      if (this.removalMode === "draw") {
        this.cursorX = displayX;
        this.cursorY = displayY;
        this.showCursor =
          canvasX >= 0 &&
          canvasX < this.canvas.width &&
          canvasY >= 0 &&
          canvasY < this.canvas.height;

        if (this.isDrawing) {
          this.draw(e);
        }
      } else if (this.removalMode === "sam2") {
        this.cursorX = displayX;
        this.cursorY = displayY;
      }
    },

    handleCanvasMouseUp() {
      if (this.removalMode === "draw") {
        this.stopDrawing();
      }
    },

    handleCanvasMouseLeave() {
      if (this.removalMode === "draw") {
        this.stopDrawing();
        this.showCursor = false;
      }
    },

    handleCanvasClick(e) {
      if (this.removalMode === "sam2" || this.removalMode === "sam3") {
        if (this.removalMode === "sam2") {
          this.addSAMPoint(e);
        }
      }
    },

    startDrawing(e) {
      if (this.isProcessing) return;

      const { canvasX, canvasY } = this.getCanvasCoordinates(e);

      if (
        canvasX < 0 ||
        canvasX >= this.canvas.width ||
        canvasY < 0 ||
        canvasY >= this.canvas.height
      )
        return;

      this.isDrawing = true;
      this.currentStroke = [];
      this.currentStroke.push({ x: canvasX, y: canvasY });

      this.ctx.beginPath();
      this.ctx.moveTo(canvasX, canvasY);
    },

    draw(e) {
      if (!this.isDrawing || this.isProcessing) return;

      const { canvasX, canvasY } = this.getCanvasCoordinates(e);

      if (
        canvasX < 0 ||
        canvasX >= this.canvas.width ||
        canvasY < 0 ||
        canvasY >= this.canvas.height
      ) {
        this.stopDrawing();
        return;
      }

      this.currentStroke.push({ x: canvasX, y: canvasY });

      if (this.useEraser) {
        this.ctx.clearRect(
          canvasX - this.brushSize / 2,
          canvasY - this.brushSize / 2,
          this.brushSize,
          this.brushSize
        );
      } else {
        this.ctx.strokeStyle = this.brushColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineTo(canvasX, canvasY);
        this.ctx.stroke();
      }
    },

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
      this.redrawCanvas();
      // this.$message.info("Drawing cleared");
    },

    undoLastStroke() {
      if (this.drawingHistory.length > 0) {
        this.drawingHistory.pop();
        this.redrawCanvas();
        this.$message.info("Last stroke removed");
      }
    },

    redrawAllStrokes() {
      this.drawingHistory.forEach((stroke) => {
        if (stroke.points.length === 0) return;

        if (stroke.isEraser) {
          this.ctx.clearRect(
            stroke.points[0].x - stroke.brushSize / 2,
            stroke.points[0].y - stroke.brushSize / 2,
            stroke.brushSize,
            stroke.brushSize
          );
        } else {
          this.ctx.strokeStyle = stroke.brushColor;
          this.ctx.lineWidth = stroke.brushSize;
          this.ctx.beginPath();
          this.ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

          stroke.points.forEach((point) => {
            this.ctx.lineTo(point.x, point.y);
          });

          this.ctx.stroke();
        }
      });
    },

    // ==================== SAM-2 MODE ====================

    addSAMPoint(e) {
      if (this.isProcessing || this.isFetchingSAMMask) return;

      const { canvasX, canvasY, displayX, displayY } =
        this.getCanvasCoordinates(e);

      if (
        canvasX < 0 ||
        canvasX >= this.canvas.width ||
        canvasY < 0 ||
        canvasY >= this.canvas.height
      )
        return;

      this.samPoints.push({
        x: canvasX,
        y: canvasY,
        displayX: displayX,
        displayY: displayY,
      });

      this.samMaskGenerated = false;
      this.samMask = null;

      this.$message.info(`Point ${this.samPoints.length} added`);
    },

    clearSAMPoints() {
      this.samPoints = [];
      this.samMask = null;
      this.samMaskGenerated = false;
      this.redrawCanvas();
      // this.$message.info("Points cleared");
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
      if (this.samPoints.length === 0 || this.isFetchingSAMMask) return;

      this.isFetchingSAMMask = true;

      try {
        const imageCanvas = document.createElement("canvas");
        imageCanvas.width = this.baseImg.width;
        imageCanvas.height = this.baseImg.height;
        const imageCtx = imageCanvas.getContext("2d");
        imageCtx.drawImage(this.baseImg, 0, 0);
        const imageBase64 = imageCanvas.toDataURL("image/png");

        const apiEndpoint = this.$store?.state?.root_api || "";
        const url = `${apiEndpoint}engine/sam2-segment/`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room_id: this.roomId,
            image_base64: imageBase64,
            points: this.samPoints.map((p) => ({ x: p.x, y: p.y })),
            confidence: this.samConfidence,
            image_dimensions: {
              width: this.baseImg.width,
              height: this.baseImg.height,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.mask_base64) {
          this.samMask = result.mask_base64;
          this.samMaskGenerated = true;
          await this.drawSAMMask();
          this.$message.success("Mask generated successfully!");
        } else {
          throw new Error(result.message || "Failed to generate mask");
        }
      } catch (error) {
        console.error("SAM-2 segmentation failed:", error);
        this.$message.error("Failed to generate mask");
      } finally {
        this.isFetchingSAMMask = false;
      }
    },

    // ==================== SAM-3 MODE ====================

    async fetchSAM3Mask() {
      this.isFetchingSAMMask = true;

      try {
        const apiEndpoint = this.$store?.state?.root_api || "";
        const url = `${apiEndpoint}engine/sam3-segment/`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room_id: this.roomId,
            confidence: this.samConfidence,
            text_prompt: this.sam3TextPrompt,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        if (
          result.success &&
          result.binary_masks_list &&
          result.binary_masks_list.length > 0
        ) {
          this.sam3MasksList = result.binary_masks_list;
          this.samMask = await this.loadAndCombineAllMasks(
            apiEndpoint,
            result.binary_masks_list
          );
          this.samMaskGenerated = true;

          await this.drawSAMMask();
          this.$message.success(
            `${result.binary_masks_list.length} masks detected!`
          );
        } else {
          throw new Error(result.message || "Failed to generate mask");
        }
      } catch (error) {
        console.error("SAM-3 segmentation failed:", error);
        this.$message.error("Failed to generate mask");
      } finally {
        this.isFetchingSAMMask = false;
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
        const maskUrl = `${apiEndpoint}${maskPath}`;

        try {
          const maskImg = await this.createImageFromSrc(maskUrl);

          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = combinedCanvas.width;
          tempCanvas.height = combinedCanvas.height;
          const tempCtx = tempCanvas.getContext("2d");

          tempCtx.drawImage(
            maskImg,
            0,
            0,
            combinedCanvas.width,
            combinedCanvas.height
          );

          const imageData = tempCtx.getImageData(
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
          );
          const data = imageData.data;

          const combinedImageData = combinedCtx.getImageData(
            0,
            0,
            combinedCanvas.width,
            combinedCanvas.height
          );
          const combinedData = combinedImageData.data;

          for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 128) {
              combinedData[i] = 255;
              combinedData[i + 1] = 255;
              combinedData[i + 2] = 255;
              combinedData[i + 3] = 255;
            }
          }

          combinedCtx.putImageData(combinedImageData, 0, 0);
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
      this.redrawCanvas();
      // this.$message.info("Masks cleared");
    },

    undoLastSAM3Mask() {
      if (this.sam3MasksList && this.sam3MasksList.length > 0) {
        this.sam3MasksList.pop();

        if (this.sam3MasksList.length > 0) {
          const apiEndpoint = this.$store?.state?.root_api || "";
          this.loadAndCombineAllMasks(apiEndpoint, this.sam3MasksList)
            .then((combinedMask) => {
              this.samMask = combinedMask;
              this.samMaskGenerated = true;
              this.drawSAMMask();
              this.$message.info(
                `${this.sam3MasksList.length} mask(s) remaining`
              );
            })
            .catch((error) => {
              this.$message.error("Failed to update masks");
              console.error(error);
            });
        } else {
          this.samMask = null;
          this.samMaskGenerated = false;
          this.redrawCanvas();
          this.$message.info("All masks cleared");
        }
      }
    },

    async drawSAMMask() {
      if (!this.samMask) return;

      try {
        const maskImg = await this.createImageFromSrc(this.samMask);

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext("2d");

        tempCtx.drawImage(maskImg, 0, 0, this.canvas.width, this.canvas.height);

        const imageData = tempCtx.getImageData(
          0,
          0,
          this.canvas.width,
          this.canvas.height
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

    redrawCanvas() {
      this.drawBaseImage();
    },

    async handleSubmit() {
      if (!this.hasValidMask || this.isProcessing) return;

      this.isProcessing = true;

      try {
        let maskBase64;

        if (this.removalMode === "draw") {
          maskBase64 = await this.createDrawingMask();
        } else {
          maskBase64 = this.samMask;
        }

        const imageCanvas = document.createElement("canvas");
        imageCanvas.width = this.baseImg.width;
        imageCanvas.height = this.baseImg.height;
        const imageCtx = imageCanvas.getContext("2d");
        imageCtx.drawImage(this.baseImg, 0, 0);
        const imageBase64 = imageCanvas.toDataURL("image/png");

        const requestData = {
          room_id: this.roomId,
          image_base64: imageBase64,
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
      }
    },

    async createDrawingMask() {
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = this.canvas.width;
      maskCanvas.height = this.canvas.height;
      const maskCtx = maskCanvas.getContext("2d");

      maskCtx.fillStyle = "#000000";
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      maskCtx.lineCap = "round";
      maskCtx.lineJoin = "round";

      this.drawingHistory.forEach((stroke) => {
        if (stroke.points.length === 0) return;

        if (!stroke.isEraser) {
          maskCtx.strokeStyle = "#FFFFFF";
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
        }
      });

      return maskCanvas.toDataURL("image/png");
    },

    async sendRemovalRequest(requestData) {
      try {
        const apiEndpoint = this.$store?.state?.root_api || "";
        const url = `${apiEndpoint}engine/remove-object/`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: 'Token ' + localStorage.getItem('token'),

          },
          body: JSON.stringify(requestData),
        });
        
        const result = await response.json();
        if (response.status == 402) {
          this.$emit("insufficient-credits", result.msg,result.buid);
          return;
        }

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }


        this.$message.success("Object removed successfully!");
        this.$emit("removal-success", result);
        this.handleCancel();
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      } finally {
        this.isProcessing = false;
      }
    },

    handleCancel() {
      this.clearDrawing();
      this.clearSAMPoints();
      this.clearSAM3Masks();
      this.localVisible = false;
      this.$emit("update:visible", false);
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');


.removal-drawer :deep(.ant-drawer-title),
.removal-drawer :deep(.ant-drawer-header-title) {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  font-weight: 600 !important;
  font-size: 18px !important;
}
.font-poppins {
  font-family: 'Poppins', 'Segoe UI',
    system-ui, sans-serif !important;
}





.removal-modal :deep(.ant-modal-header) {
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  padding: 16px;
}

.removal-modal :deep(.ant-modal-title) {
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 600;
}

.removal-modal :deep(.ant-modal-content) {
  background: #fafafa;
  color: #1a1a1a;
  padding: 0;
}

.removal-modal :deep(.ant-modal-footer) {
  background: #ffffff;
  border-top: 1px solid #e8e8e8;
}

.removal-drawer :deep(.ant-drawer-header) {
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
}

.removal-drawer :deep(.ant-drawer-title) {
  color: #1a1a1a;
}

.removal-drawer :deep(.ant-drawer-content) {
  background: #fafafa;
  color: #1a1a1a;
}

.control-sec-panel-desktop {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.button-flex-with-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.left-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.right-controls {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.control-group {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.mode-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-label {
  font-size: 13px;
  font-weight: 500;
  color: #595959;
  white-space: nowrap;
}

.value-label {
  font-size: 12px;
  color: #8c8c8c;
  min-width: 45px;
  text-align: right;
}

.removal-container-desktop {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.removal-container-mobile {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.mobile-mode-section {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.instructions-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(90deg, #f5f5f5 0%, #ffffff 100%);
  color: #1a1a1a;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 400;
  transition: background 0.3s ease;
  border: 1px solid #e8e8e8;
}

.instructions-banner.sam2,
.instructions-banner.sam3 {
  background: linear-gradient(90deg, #e6f7ff 0%, #f0f5ff 100%);
  border-color: #91d5ff;
}

.instruction-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.instruction-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.instruction-text strong {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #1a1a1a;
}

.instruction-text span {
  font-size: 12px;
  color: #595959;
}

.mode-icon {
  font-size: 24px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.status-indicator {
  background: rgba(255, 255, 255, 0.6);
  padding: 6px 12px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid rgba(0, 0, 0, 0.1);
  letter-spacing: 0.3px;
  white-space: nowrap;
  color: #1a1a1a;
}

.canvas-wrapper-desktop {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 4px;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
}

.canvas-wrapper-mobile {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 4px;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  margin: 12px 0;
}

.canvas-overlay {
  position: relative;
  display: inline-block;
}

canvas {
  display: block;
  image-rendering: crisp-edges;
  border-radius: 2px;
}

.custom-cursor {
  position: absolute;
  border: 2px solid #ff4444;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1000;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
  transition: all 0.05s ease-out;
}

.sam-point-indicator {
  position: absolute;
  width: 24px;
  height: 24px;
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
  font-size: 11px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

@keyframes pulsePoint {
  0%,
  100% {
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
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  z-index: 100;
  border-radius: 4px;
  backdrop-filter: blur(2px);
}

.processing-overlay p {
  margin: 0;
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.mobile-controls-panel {
  padding: 16px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.control-row > button {
  flex: 1;
  min-width: 100px;
}

.mobile-action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.mobile-action-buttons button {
  flex: 1;
}

:deep(.ant-btn) {
  border-radius: 4px;
  font-weight: 500;
}

:deep(.ant-btn-primary) {
  background: #1890ff;
  border-color: #1890ff;
}

:deep(.ant-slider-track) {
  background: #1890ff;
}

:deep(.ant-slider-handle) {
  border-color: #1890ff;
  background: #1890ff;
}

:deep(.ant-radio-group) {
  display: inline-flex;
  /* gap: 8px; */
}

:deep(.ant-input) {
  background: #ffffff;
  border-color: #e8e8e8;
  color: #1a1a1a;
}

:deep(.ant-input::placeholder) {
  color: #bfbfbf;
}

:deep(.ant-input:focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

@media (max-width: 1024px) {
  .footer-controls {
    flex-direction: column;
    gap: 12px;
  }

  .left-controls {
    width: 100%;
    flex-direction: column;
  }

  .right-controls {
    width: 100%;
  }
}
</style>
