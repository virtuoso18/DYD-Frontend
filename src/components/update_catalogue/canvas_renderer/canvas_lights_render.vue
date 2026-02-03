<template>
  <div class="magnetic-light-designer">
    <!-- Loading Overlay -->
    <!-- Main Canvas Container -->
    <div class="canvas-container" ref="canvasContainer">
      <div v-if="isLoading" class="scanning-loading-overlay">
        <div
          class="loading-screen"
          :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
        >
          <div class="wave-overlay"></div>
          <div class="loading-text">
            <div class="process-text">Loading Room...</div>
          </div>
        </div>
      </div>

      <!-- Background Canvas -->
      <canvas
        ref="canvas"
        :width="canvasWidth"
        :height="canvasHeight"
        class="main-canvas"
        :class="{ disabled: isLoading }"
      ></canvas>

      <!-- Depth Visualization Canvas -->
      <canvas
        v-if="depthMask && showDepth"
        ref="depthCanvas"
        :width="canvasWidth"
        :height="canvasHeight"
        class="depth-canvas"
      ></canvas>

      <!-- Light Components -->
      <div
        v-for="light in lights"
        :key="light.id"
        class="light-fixture"
        :class="[
          `light-${light.type}`,
          {
            selected: light.id === selectedLightId,
            dragging: isDraggingLight && draggedLight?.id === light.id,
          },
        ]"
        :style="getLightStyle(light)"
        @mousedown="startLightDrag($event, light)"
        @dblclick="openLightEditor(light)"
      >
        <div class="light-body">
          <div class="light-glow"></div>
          <div
            class="light-indicator"
            v-if="light.id === selectedLightId"
          ></div>
        </div>
      </div>

      <!-- Navigation Controls -->
      <div class="navigation-controls">
        <div v-if="!isLoading" class="zoom-controls">
          <button @click="zoomIn" class="zoom-btn" title="Zoom In">+</button>
          <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
          <button @click="zoomOut" class="zoom-btn" title="Zoom Out">-</button>
          <button
            @click="resetView"
            class="zoom-btn reset-btn"
            title="Reset View"
          >
            ⌂
          </button>
        </div>
      </div>

      <!-- Help Text -->
      <!-- <div class="help-text" v-if="!isLoading">
        <span v-if="trackMode">{{ trackModeHelp }}</span>
        <span v-else-if="lights.length === 0">Draw magnetic tracks, then add lights</span>
        <span v-else>Drag lights along tracks • Double-click to edit</span>
      </div> -->
    </div>

    <div
      v-if="!isLoading"
      class="main-toolbar m-0 max-w-full overflow-x-hidden"
    >
      <!-- Track Tools Section -->

      <div>
       
      </div>
      <a-row>
        <a-col :span=24 > <div class="tool-section stats-section flex-none">
          <a-row>
            <a-col :sm="24" :xs="24" :md="6" :lg="6">
              
<div class="tool-section">
          <h4>Track Tools</h4>
          <div class="button-group flex flex-wrap gap-2">
            <button
              @click="toggleTrackMode"
              :class="{ active: trackMode }"
              type="primary"
              size="small"
              class="flex gap-2 flex-1 min-w-0 border rounded-md border-gray-300 p-1"
            >
              <svg viewBox="0 0 20 20" width="15" height="15" class="mt-0.5">
                <path
                  fill="currentColor"
                  d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"
                />
              </svg>
              <span
                class="whitespace-nowrap overflow-hidden text-[#666666] text-ellipsis"
              >
                {{ trackMode ? "Exit Track Mode" : "Draw Tracks" }}
              </span>
            </button>
            <button
              @click="clearTracks"
              class="flex gap-2 flex-1 min-w-0 border rounded-md border-gray-300 p-1"
              size="small"
              :disabled="tracks.length === 0"
              :danger="true"
            >
              <svg viewBox="0 0 20 20" width="15" height="15" class="mt-0.5">
                <path
                  fill="currentColor"
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                />
              </svg>
              <span class="whitespace-nowrap text-[#666666]">Clear Tracks</span>
            </button>
          </div>
        </div>
        
            </a-col>
            <a-col :sm="24" :xs="24" :md="12" :lg="12" style="margin-top:10px">
              <a-row>
            <a-col  :sm="8" :xs="8" :lg="12" :md="12">
               <div class="stats flex gap-4">
            <div class="stat">
              <span class="stat-label">Tracks</span>
              <span class="stat-value">{{ tracks.length }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Lights</span>
              <span class="stat-value">{{ lights.length }}</span>
            </div>
            <div >
              
            </div>
          </div>
              </a-col>
              
            <a-col  :sm="8" :xs="8" :lg="12" :md="12">
              <h4>Add Lights</h4>
          <div style="display:flex;gap:10px">

            <a-button   siize="small" @click="selectedLight = 'rectangle'">

🟧
            </a-button>
            <a-button siize="small" @click="selectedLight = 'circular'">

🟡
            </a-button>

            </div>
              </a-col>
              
            <a-col :sm="8" :xs="8" :lg="0" :md="0" >
              <div style="display: flex;flex-direction: column;justify-content: end;">

                <a-button type="primary" @click="openLightEditorModal">Set Light Size</a-button>
              </div>

              </a-col>
            </a-row>

              

</a-col>
            <a-col :sm="24" :xs="24" :md="6" :lg="6" style="margin-top:10px">
              <a-button
              type="primary"
              block
            @click="$emit('Apply-Changes', 'sunk-magnetic-light-Renerer')"
          >
            Finalise Changes
          </a-button>
</a-col>
          </a-row>
         
        </div>
 
        </a-col>
        <!-- <a-col :span=6 style="display: flex;justify-content: center;align-items: end;">
              
      
        </a-col> -->
      </a-row>
     <br>
      

      <div>
        <!-- Stats and Apply Button Section -->
        <div class="flex flex-wrap gap-3 items-center">
          <!-- <a-button 
       @click="saveRoom" 
       type="primary"
       size="large"
       class="m-0 text-white flex-1 min-w-0"
       :disabled="lights.length === 0"
     >
       Save 
     </a-button> -->

          
        </div>
      </div>
    </div>
    <!-- Light Editor Modal -->
  </div>
  <div v-if="editingLight" class="modal-overlay" @click="closeEditor">
    <div class="light-editor" @click.stop>
      <div class="editor-header">
        <h3>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          Edit {{ editingLight.type }} Light #{{
            lights.findIndex((l) => l.id === editingLight.id) + 1
          }}
        </h3>
        <button @click="closeEditor" class="close-btn">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>

      <div class="editor-content">
        <!-- Appearance Settings -->
        <div class="editor-section">
          <h4>Appearance</h4>
          <div class="editor-grid">
            <div class="editor-item">
              <label>Light Width (along track)</label>
              <div class="input-group">
                <input
                  type="range"
                  v-model.number="editingLight.width"
                  :min="editingLight.minWidth || getTrackWidth()"
                  :max="
                    editingLight.maxWidth ||
                    getTrackLength(editingLight.track) * 0.8
                  "
                  class="slider"
                />
                <span class="value">{{ editingLight.width }}px</span>
              </div>
              <div class="range-info">
                <small
                  >Track: {{ getTrackWidth() }}px | Max:
                  {{
                    Math.round(
                      editingLight.maxWidth ||
                        getTrackLength(editingLight.track) * 0.8
                    )
                  }}px</small
                >
              </div>
            </div>
            <div class="editor-item">
              <label>Brightness</label>
              <div class="input-group">
                <input
                  type="range"
                  v-model.number="editingLight.brightness"
                  min="0.1"
                  max="1"
                  step="0.1"
                  class="slider"
                />
                <span class="value"
                  >{{ Math.round(editingLight.brightness * 100) }}%</span
                >
              </div>
            </div>
            <div class="editor-item">
              <label>Color Temperature</label>
              <div class="input-group">
                <input
                  type="range"
                  v-model.number="editingLight.temperature"
                  min="2700"
                  max="6500"
                  step="100"
                  class="slider"
                />
                <span class="value">{{ editingLight.temperature }}K</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Position & Rotation -->
        <div class="editor-section">
          <h4>Position</h4>
          <div class="editor-grid">
            <div class="editor-item">
              <label>Track Position</label>
              <div class="input-group">
                <input
                  type="range"
                  v-model.number="editingLight.trackPosition"
                  min="0"
                  max="1"
                  step="0.01"
                  class="slider"
                />
                <span class="value"
                  >{{ Math.round(editingLight.trackPosition * 100) }}%</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="editor-actions">
          <button @click="duplicateLight" class="action-btn secondary">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
              />
            </svg>
            Duplicate
          </button>
          <button @click="resetLight" class="action-btn secondary">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8z"
              />
            </svg>
            Reset
          </button>
          <button @click="deleteLight" class="action-btn danger">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import { defineEmits } from "vue";

// Define the emit
const emit = defineEmits(["magentic-lights-added"]);
const route = useRoute();
const store = useStore();

// Props
const props = defineProps({
  baseImage: {
    type: String,
    required: true,
  },
  selectedlightuuid: {
    type: String,
    required: true,
  },
  depthMask: {
    type: String,
    default: null,
  },
});

// ===================
// STATE MANAGEMENT
// ===================
// Canvas and UI References
const canvasContainer = ref(null);
const canvas = ref(null);
const depthCanvas = ref(null);
const ctx = ref(null);
const depthCtx = ref(null);

// Canvas Dimensions
const canvasWidth = ref(800);
const canvasHeight = ref(600);

// Loading and Images
const isLoading = ref(true);
const backgroundImage = ref(null);
const depthMaskImage = ref(null);

// View Controls
const zoom = ref(1);
const minZoom = ref(1);
const maxZoom = ref(5);
const panX = ref(0);
const panY = ref(0);
const showDepth = ref(false);

// Image rendering properties
const renderWidth = ref(800);
const renderHeight = ref(600);
const renderOffsetX = ref(0);
const renderOffsetY = ref(0);

// Track System
const tracks = ref([]);
const trackMode = ref(false);
const currentTrack = ref(null);
const isDrawingTrack = ref(false);

// Light System
const lights = ref([]);
const lightCounter = ref(0);
const selectedLightId = ref(null);
const selectedLightType = ref("rectangular");
const editingLight = ref(null);

// Default Settings
const defaultSettings = ref({
  height: 8, // Fixed height for track alignment
  brightness: 0.8,
  temperature: 4000,
});

// Interaction State
const isDragging = ref(false);
const isDraggingLight = ref(false);
const draggedLight = ref(null);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragStartPanX = ref(0);
const dragStartPanY = ref(0);

// Long press timer for mobile
const longPressTimer = ref(null);
const resizeMode = ref(false);
const resizingLight = ref(null);
const resizeStartPos = ref(0);
const touchedLight = ref(null);

const isPinching = ref(false);
const touchDistance = ref(0);
const pinchStartZoom = ref(1);

const touchStartPos = ref(null);
const MOVE_THRESHOLD = 8;
// Computed Properties
const selectedLight = computed(
  () => lights.value.find((light) => light.id === selectedLightId.value) || null
);

const trackModeHelp = computed(() => {
  if (isDrawingTrack.value) {
    return "Click to set end point of track (move mouse to preview)";
  }
  return "Click first point to start drawing a magnetic track";
});

// ===================
// LIFECYCLE
// ===================

onMounted(async () => {
  await initializeCanvas();
  await loadImages();
  setupEventListeners();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  removeEventListeners();
  window.removeEventListener("resize", handleResize);
});

watch([() => props.baseImage, () => props.depthMask], loadImages);

// Watch for editing light changes to update position
watch(
  () => editingLight.value?.trackPosition,
  (newPosition) => {
    if (editingLight.value && newPosition !== undefined) {
      updateLightPositionOnTrack(editingLight.value);
    }
  }
);

// ===================
// Export room Light layer
// ===================

async function saveRoom() {
  if (!backgroundImage.value || lights.value.length === 0) {
    console.warn("No background image or lights to save");
    return;
  }

  try {
    // Create an offscreen canvas with the exact dimensions of the base image
    const exportCanvas = document.createElement("canvas");
    const exportCtx = exportCanvas.getContext("2d");

    // Set canvas size to match the original image dimensions
    exportCanvas.width = backgroundImage.value.width;
    exportCanvas.height = backgroundImage.value.height;

    // Calculate scaling factors to map from our render coordinates to original image coordinates
    const scaleX = backgroundImage.value.width / renderWidth.value;
    const scaleY = backgroundImage.value.height / renderHeight.value;

    // Clear canvas with transparent background
    exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Set up coordinate system
    exportCtx.save();

    // Draw tracks at original image scale
    tracks.value.forEach((track) => {
      drawTrackToExport(exportCtx, track, scaleX, scaleY);
    });

    // Draw lights at original image scale
    lights.value.forEach((light) => {
      drawLightToExport(exportCtx, light, scaleX, scaleY);
    });

    exportCtx.restore();

    // Convert canvas to base64
    const base64Data = exportCanvas.toDataURL("image/png");

    // Send to server via POST request
    const response = await fetch(
      store.state.root_api + "engine/mearj-room-lights/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          image: base64Data,
          product_id: props.selectedlightuuid,
          room_id: route.params.id,
          timestamp: Date.now(),
          // Add any additional metadata you want to send
          metadata: {
            lightsCount: lights.value.length,
            tracksCount: tracks.value.length,
            dimensions: {
              width: backgroundImage.value.width,
              height: backgroundImage.value.height,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    emit("magentic-lights-added", result);
    console.log("Room saved to server successfully!", result);

    // Optional: Still provide local download as backup
    // Uncomment the lines below if you want both server upload AND local download
    /*
    const blob = await new Promise(resolve => {
      exportCanvas.toBlob(resolve, 'image/png', 1.0);
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `magnetic-lights-room-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    */
  } catch (error) {
    console.error("Error saving room:", error);
    // You might want to show a user-friendly error message here
    throw error;
  }
}

// Helper function to draw tracks for export
function drawTrackToExport(exportCtx, track, scaleX, scaleY) {
  // Convert track coordinates to original image scale, accounting for render offset
  const x1 = (track.x1 - renderOffsetX.value) * scaleX;
  const y1 = (track.y1 - renderOffsetY.value) * scaleY;
  const x2 = (track.x2 - renderOffsetX.value) * scaleX;
  const y2 = (track.y2 - renderOffsetY.value) * scaleY;

  // Skip tracks that are outside the image bounds
  if (x1 < 0 && x2 < 0) return;
  if (y1 < 0 && y2 < 0) return;
  if (x1 > exportCtx.canvas.width && x2 > exportCtx.canvas.width) return;
  if (y1 > exportCtx.canvas.height && y2 > exportCtx.canvas.height) return;

  // Draw track shadow/glow
  exportCtx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  exportCtx.lineWidth = Math.max(6 * Math.min(scaleX, scaleY), 2);
  exportCtx.lineCap = "round";
  exportCtx.beginPath();
  exportCtx.moveTo(x1, y1);
  exportCtx.lineTo(x2, y2);
  exportCtx.stroke();

  // Draw main track line
  exportCtx.strokeStyle = "#000000";
  exportCtx.lineWidth = Math.max(3 * Math.min(scaleX, scaleY), 1);
  exportCtx.lineCap = "round";
  exportCtx.beginPath();
  exportCtx.moveTo(x1, y1);
  exportCtx.lineTo(x2, y2);
  exportCtx.stroke();

  // Draw endpoints
  const endpointSize = Math.max(2 * Math.min(scaleX, scaleY), 1);
  exportCtx.fillStyle = "#000000";
  exportCtx.beginPath();
  exportCtx.arc(x1, y1, endpointSize, 0, 2 * Math.PI);
  exportCtx.fill();
  exportCtx.beginPath();
  exportCtx.arc(x2, y2, endpointSize, 0, 2 * Math.PI);
  exportCtx.fill();
}

// Helper function to draw lights for export
function drawLightToExport(exportCtx, light, scaleX, scaleY) {
  // Convert light coordinates to original image scale, accounting for render offset
  const x = (light.x - renderOffsetX.value) * scaleX;
  const y = (light.y - renderOffsetY.value) * scaleY;

  // Skip lights outside image bounds
  if (
    x < 0 ||
    y < 0 ||
    x > exportCtx.canvas.width ||
    y > exportCtx.canvas.height
  ) {
    return;
  }

  const width = light.width * Math.min(scaleX, scaleY);
  const height = light.height * Math.min(scaleX, scaleY);

  // Get depth scaling if available
  let depthScale = 1;
  if (depthMaskImage.value) {
    const depth = getDepthAtPosition(light.x, light.y);
    depthScale = 0.7 + depth * 0.5;
  }

  const finalWidth = width * depthScale;
  const finalHeight = height * depthScale;

  exportCtx.save();

  // Move to light position
  exportCtx.translate(x, y);

  // Apply track alignment rotation
  const trackAngle = getTrackAngle(light.track);
  exportCtx.rotate(trackAngle);

  // Create light glow effect
  const glowSize = Math.max(finalWidth, finalHeight) * 1.5;
  const glowGradient = exportCtx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
  const lightColor = getLightColor(light.temperature);
  const glowAlpha = light.brightness * 0.3;

  glowGradient.addColorStop(
    0,
    `${lightColor}${Math.round(glowAlpha * 255)
      .toString(16)
      .padStart(2, "0")}`
  );
  glowGradient.addColorStop(
    0.3,
    `${lightColor}${Math.round(glowAlpha * 0.5 * 255)
      .toString(16)
      .padStart(2, "0")}`
  );
  glowGradient.addColorStop(1, "transparent");

  // Draw glow
  exportCtx.fillStyle = glowGradient;
  exportCtx.beginPath();
  exportCtx.arc(0, 0, glowSize, 0, 2 * Math.PI);
  exportCtx.fill();

  // Draw main light body
  exportCtx.fillStyle = lightColor;
  exportCtx.globalAlpha = light.brightness;

  if (light.type === "circular") {
    exportCtx.beginPath();
    exportCtx.arc(0, 0, Math.min(finalWidth, finalHeight) / 2, 0, 2 * Math.PI);
    exportCtx.fill();
  } else {
    // Rectangular - aligned with track
    exportCtx.fillRect(
      -finalWidth / 2,
      -finalHeight / 2,
      finalWidth,
      finalHeight
    );
  }

  // Draw light border/edge
  exportCtx.globalAlpha = 1;
  exportCtx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  exportCtx.lineWidth = Math.max(1, Math.min(scaleX, scaleY) * 0.5);

  if (light.type === "circular") {
    exportCtx.beginPath();
    exportCtx.arc(0, 0, Math.min(finalWidth, finalHeight) / 2, 0, 2 * Math.PI);
    exportCtx.stroke();
  } else {
    exportCtx.strokeRect(
      -finalWidth / 2,
      -finalHeight / 2,
      finalWidth,
      finalHeight
    );
  }

  exportCtx.restore();
}

//helper to find light at position
function findLightAtPosition(pos, threshold = 20) {
  return lights.value.find((light) => {
    const dx = pos.x - light.x;
    const dy = pos.y - light.y;
    return Math.sqrt(dx * dx + dy * dy) < threshold / zoom.value;
  });
}

// ===================
// INITIALIZATION
// ===================

async function initializeCanvas() {
  await nextTick();
  if (canvas.value) {
    ctx.value = canvas.value.getContext("2d");
  }
  if (depthCanvas.value) {
    depthCtx.value = depthCanvas.value.getContext("2d");
  }
  handleResize();
}

async function loadImages() {
  isLoading.value = true;

  try {
    if (props.baseImage) {
      backgroundImage.value = await loadImage(props.baseImage);
      calculateImageDimensions();
    }

    if (props.depthMask) {
      depthMaskImage.value = await loadImage(props.depthMask);
    }

    redrawCanvas();
  } catch (error) {
    console.error("Error loading images:", error);
  } finally {
    isLoading.value = false;
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function calculateImageDimensions() {
  if (!backgroundImage.value) return;

  const maxWidth = canvasWidth.value;
  const maxHeight = canvasHeight.value;

  const imgAspectRatio =
    backgroundImage.value.width / backgroundImage.value.height;

  // Always fit to width first (100% width)
  renderWidth.value = maxWidth;
  renderHeight.value = Math.round(maxWidth / imgAspectRatio);
  renderOffsetX.value = 0;

  // If calculated height exceeds available height, fit to height instead
  if (renderHeight.value > maxHeight) {
    renderHeight.value = maxHeight;
    renderWidth.value = Math.round(maxHeight * imgAspectRatio);
    renderOffsetX.value = Math.round((maxWidth - renderWidth.value) / 2);
    renderOffsetY.value = 0;
  } else {
    // Center vertically if height is less than container
    renderOffsetY.value = Math.round((maxHeight - renderHeight.value) / 2);
  }
}

// ===================
// EVENT HANDLING
// ===================

function setupEventListeners() {
  if (!canvas.value) return;

  canvas.value.addEventListener("wheel", handleWheel, { passive: false });
  canvas.value.addEventListener("mousedown", handleMouseDown);
  canvas.value.addEventListener("mousemove", handleMouseMove);
  canvas.value.addEventListener("mouseup", handleMouseUp);
  canvas.value.addEventListener("mouseleave", handleMouseUp);
  canvas.value.addEventListener("contextmenu", handleRightClick);

  //for mobile
  canvas.value.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  canvas.value.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });
  canvas.value.addEventListener("touchend", handleTouchEnd);
  canvas.value.addEventListener("touchcancel", handleTouchEnd);

  document.addEventListener("mousemove", handleGlobalMouseMove);
  document.addEventListener("mouseup", handleGlobalMouseUp);
}

function removeEventListeners() {
  if (!canvas.value) return;

  canvas.value.removeEventListener("wheel", handleWheel);
  canvas.value.removeEventListener("mousedown", handleMouseDown);
  canvas.value.removeEventListener("mousemove", handleMouseMove);
  canvas.value.removeEventListener("mouseup", handleMouseUp);
  canvas.value.removeEventListener("mouseleave", handleMouseUp);
  canvas.value.removeEventListener("contextmenu", handleRightClick);

  document.removeEventListener("mousemove", handleGlobalMouseMove);
  document.removeEventListener("mouseup", handleGlobalMouseUp);
}

function handleResize() {
  if (canvasContainer.value) {
    canvasWidth.value = canvasContainer.value.offsetWidth;
    canvasHeight.value = canvasContainer.value.offsetHeight;

    if (backgroundImage.value) {
      calculateImageDimensions();
    }

    redrawCanvas();
  }
}

function handleWheel(e) {
  if (isLoading.value) return;
  e.preventDefault();

  const rect = canvas.value.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
  const newZoom = Math.max(
    minZoom.value,
    Math.min(maxZoom.value, zoom.value * zoomFactor)
  );

  if (newZoom !== zoom.value) {
    const imageX = (mouseX - panX.value) / zoom.value;
    const imageY = (mouseY - panY.value) / zoom.value;

    zoom.value = newZoom;
    panX.value = mouseX - imageX * zoom.value;
    panY.value = mouseY - imageY * zoom.value;

    redrawCanvas();
  }
}

function handleMouseDown(e) {
  if (isLoading.value) return;
  let clientX, clientY;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const pos = getMousePos({ clientX: clientX, clientY: clientY });

  if (trackMode.value) {
    handleTrackClick(pos);
    return;
  }

  // Start panning
  isDragging.value = true;
  dragStartX.value = clientX;
  dragStartY.value = clientY;
  dragStartPanX.value = panX.value;
  dragStartPanY.value = panY.value;
}

function handleMouseMove(e) {
  let clientX, clientY;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  if (isDragging.value && !trackMode.value) {
    const deltaX = clientX - dragStartX.value;
    const deltaY = clientY - dragStartY.value;

    panX.value = dragStartPanX.value + deltaX;
    panY.value = dragStartPanY.value + deltaY;

    redrawCanvas();
  } else if (trackMode.value && isDrawingTrack.value && currentTrack.value) {
    // Update the preview line in real-time while drawing
    const pos = getMousePos({ clientX: clientX, clientY: clientY });
    currentTrack.value.x2 = pos.x;
    currentTrack.value.y2 = pos.y;
    redrawCanvas();
  }

  // Update cursor style
  updateCursor(e);
}

function updateCursor(e) {
  if (!canvas.value) return;

  if (trackMode.value) {
    if (isDrawingTrack.value) {
      canvas.value.style.cursor = "crosshair";
    } else {
      canvas.value.style.cursor = "copy";
    }
  } else {
    const pos = getMousePos({ clientX: e.clientX, clientY: e.clientY });
    const nearestTrack = findNearestTrack(pos.x, pos.y);
    if (nearestTrack) {
      canvas.value.style.cursor = "pointer";
    } else if (isDragging.value) {
      canvas.value.style.cursor = "grabbing";
    } else {
      canvas.value.style.cursor = "grab";
    }
  }
}

function handleMouseUp() {
  isDragging.value = false;
}

function handleRightClick(e) {
  e.preventDefault();

  if (trackMode.value) return;

  const pos = getMousePos({ clientX: e.clientX, clientY: e.clientY });
  const nearestTrack = findNearestTrack(pos.x, pos.y);

  if (nearestTrack) {
    createLight(nearestTrack, pos.x, pos.y);
  }
}

function handleGlobalMouseMove(e) {
  if (isDraggingLight.value && draggedLight.value) {
    const rect = canvas.value.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panX.value) / zoom.value;
    const mouseY = (e.clientY - rect.top - panY.value) / zoom.value;

    const projected = projectPointOnTrack(
      mouseX,
      mouseY,
      draggedLight.value.track
    );

    draggedLight.value.x = projected.x;
    draggedLight.value.y = projected.y;
    draggedLight.value.trackPosition = projected.position;

    // Update light alignment to track angle
    updateLightAlignment(draggedLight.value);
  }
}

function handleGlobalMouseUp() {
  if (isDraggingLight.value) {
    isDraggingLight.value = false;
    draggedLight.value = null;
  }
}

function getMousePos({ clientX, clientY }) {
  const rect = canvas.value.getBoundingClientRect();
  const x = (clientX - rect.left - panX.value) / zoom.value;
  const y = (clientY - rect.top - panY.value) / zoom.value;
  return { x, y };
}

//for mobile handling
// function handleTouchStart(e) {
//   e.preventDefault();

//   if (e.touches.length !== 1) return;

//   const touch = e.touches[0];
//   const fakeMouseEvent = {
//     clientX: touch.clientX,
//     clientY: touch.clientY,
//     preventDefault: () => {},
//     stopPropagation: () => {}
//   };

//   handleMouseDown(fakeMouseEvent);
// }

// function handleTouchStart(e) {
//   e.preventDefault();
//   if (!e.touches || e.touches.length !== 1) return;
//   if (e.touches.length === 2) {
//     log.value = "Pinch init";
//     isPinching.value = true;
//     touchDistance.value = getTouchDistance(e.touches[0], e.touches[1]);
//     pinchStartZoom.value = zoom.value;
//     clearTimeout(longPressTimer.value);
//     return;
//   }
//   const touch = e.touches[0];
//   const pos = getMousePos({ clientX: touch.clientX, clientY: touch.clientY });

//   const touchedLight = findLightAtPosition(pos);

//   longPressTimer.value = setTimeout(() => {
//     // 🔥 LONG PRESS ON EXISTING LIGHT
//     if (touchedLight) {
//       resizeMode.value = true;
//       resizingLight.value = touchedLight;
//       resizeStartPos.value = touchedLight.trackPosition;

//       openLightEditor(touchedLight); // open modal
//       return;
//     }

//     // Long press on track → create new light
//     handleRightClick({
//       clientX: touch.clientX,
//       clientY: touch.clientY,
//       preventDefault: () => {},
//     });
//   }, 600);

//   handleMouseDown({
//     clientX: touch.clientX,
//     clientY: touch.clientY,
//     preventDefault: () => {},
//   });

//   // log.value="Pinch started";
//   if (isPinching.value && e.touches.length === 2) {
//     log.value = "Pinch started1";
//     const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
//     const scale = currentDistance / touchDistance.value;
//     const newZoom = Math.max(
//       minZoom.value,
//       Math.min(maxZoom.value, pinchStartZoom.value * scale)
//     );

//     if (newZoom !== zoom.value) {
//       const centerPoint = getTouchCenterPoint(e.touches[0], e.touches[1]);
//       const rect = canvas.value.getBoundingClientRect();
//       const mouseX = centerPoint.x - rect.left;
//       const mouseY = centerPoint.y - rect.top;

//       const imageX = (mouseX - panX.value) / zoom.value;
//       const imageY = (mouseY - panY.value) / zoom.value;

//       zoom.value = newZoom;
//       panX.value = mouseX - imageX * zoom.value;
//       panY.value = mouseY - imageY * zoom.value;

//       redrawCanvas();
//       console.log("🔍 Zooming:", Math.round(zoom.value * 100) + "%");
//     }
//     return;
//   }
// }

function handleTouchStart(e) {
  e.preventDefault();
  if (!e.touches) return;

  /* ---------- PINCH (2 fingers) ---------- */
  if (e.touches.length === 2) {
    isPinching.value = true;
    touchDistance.value = getTouchDistance(e.touches[0], e.touches[1]);
    pinchStartZoom.value = zoom.value;
    clearTimeout(longPressTimer.value);
    return;
  }

  /* ---------- SINGLE TOUCH ---------- */
  if (e.touches.length !== 1) return;

  const touch = e.touches[0];
  const pos = getMousePos({ clientX: touch.clientX, clientY: touch.clientY });
  touchedLight.value = findLightAtPosition(pos);

  // Save touch start position (for movement threshold)
  touchStartPos.value = {
    x: touch.clientX,
    y: touch.clientY,
  };

  clearTimeout(longPressTimer.value);

  /* ---------- LONG PRESS ---------- */
  longPressTimer.value = setTimeout(
    () => {
      if (touchedLight.value) {
        resizeMode.value = true;
        resizingLight.value = touchedLight.value;
        resizeStartPos.value = touchedLight.value.trackPosition;
        openLightEditor(touchedLight.value);
        return;
      }

      // Long press on track
      handleRightClick({
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => {},
      });
    },
    touchedLight.value ? 1000 : 600
  );

  /* ---------- DRAG INIT ---------- */
  if (touchedLight.value) {
    startLightDrag(
      { preventDefault: () => {}, stopPropagation: () => {} },
      touchedLight.value
    );
    return;
  }

  handleMouseDown({
    clientX: touch.clientX,
    clientY: touch.clientY,
    preventDefault: () => {},
  });
}

// function handleTouchMove(e) {
//   e.preventDefault();

//   if (e.touches.length !== 1) return;

//   const touch = e.touches[0];
//   const fakeMouseEvent = {
//     clientX: touch.clientX,
//     clientY: touch.clientY,
//     preventDefault: () => {},
//     stopPropagation: () => {}
//   };

//   handleMouseMove(fakeMouseEvent);
// }

// function handleTouchEnd(e) {
//   e.preventDefault();
//   handleMouseUp();
//   handleGlobalMouseUp();
// }

function handleTouchMove(e) {
  e.preventDefault();

  /* ---------- PINCH ZOOM ---------- */
  if (isPinching.value && e.touches.length === 2) {
    const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
    const scale = currentDistance / touchDistance.value;
    const newZoom = Math.max(
      minZoom.value,
      Math.min(maxZoom.value, pinchStartZoom.value * scale)
    );

    if (newZoom !== zoom.value) {
      const center = getTouchCenterPoint(e.touches[0], e.touches[1]);
      const rect = canvas.value.getBoundingClientRect();

      const mouseX = center.x - rect.left;
      const mouseY = center.y - rect.top;

      const imageX = (mouseX - panX.value) / zoom.value;
      const imageY = (mouseY - panY.value) / zoom.value;

      zoom.value = newZoom;
      panX.value = mouseX - imageX * zoom.value;
      panY.value = mouseY - imageY * zoom.value;

      redrawCanvas();
    }
    return;
  }

  if (!e.touches || e.touches.length !== 1) return;

  const touch = e.touches[0];

  /* ---------- CANCEL LONG PRESS ON REAL MOVE ---------- */
  if (touchStartPos.value) {
    const dx = touch.clientX - touchStartPos.value.x;
    const dy = touch.clientY - touchStartPos.value.y;

    if (Math.sqrt(dx * dx + dy * dy) > MOVE_THRESHOLD) {
      clearTimeout(longPressTimer.value);
    }
  }

  /* ---------- DRAG LIGHT ---------- */
  if (isDraggingLight.value && draggedLight.value) {
    const rect = canvas.value.getBoundingClientRect();

    const mouseX = (touch.clientX - rect.left - panX.value) / zoom.value;
    const mouseY = (touch.clientY - rect.top - panY.value) / zoom.value;

    const projected = projectPointOnTrack(
      mouseX,
      mouseY,
      draggedLight.value.track
    );

    draggedLight.value.x = projected.x;
    draggedLight.value.y = projected.y;
    draggedLight.value.trackPosition = projected.position;

    updateLightAlignment(draggedLight.value);
    return;
  }

  /* ---------- RESIZE LIGHT ---------- */
  if (resizeMode.value && resizingLight.value) {
    const pos = getMousePos({
      clientX: touch.clientX,
      clientY: touch.clientY,
    });

    const projected = projectPointOnTrack(
      pos.x,
      pos.y,
      resizingLight.value.track
    );

    const trackLength = getTrackLength(resizingLight.value.track);

    let newWidth =
      Math.abs(projected.position - resizeStartPos.value) * trackLength * 2;

    newWidth = Math.max(
      resizingLight.value.minWidth,
      Math.min(newWidth, resizingLight.value.maxWidth)
    );

    resizingLight.value.width = newWidth;
    redrawCanvas();
    return;
  }

  /* ---------- NORMAL PAN ---------- */
  handleMouseMove({
    clientX: touch.clientX,
    clientY: touch.clientY,
    preventDefault: () => {},
  });
}

// function handleTouchEnd(e) {
//   clearTimeout(longPressTimer);
//   handleMouseUp();
// }

function handleTouchEnd(e) {
  e.preventDefault();
  clearTimeout(longPressTimer.value);

  if (resizeMode.value) {
    resizeMode.value = false;
    resizingLight.value = null;
    return;
  }

  handleMouseUp();
  handleGlobalMouseUp();
}

function openLightEditorModal() {
  console.log("first");
  if (selectedLight.value) {
    console.log("second");
    editingLight.value = { ...selectedLight.value };
    resizeMode.value = true;
    resizingLight.value = touchedLight.value;
    resizeStartPos.value = touchedLight.value.trackPosition;
    openLightEditor(touchedLight.value);
  }
}

// ===================
// TRACK MANAGEMENT
// ===================

function getTrackLength(track) {
  const deltaX = track.x2 - track.x1;
  const deltaY = track.y2 - track.y1;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function getTrackWidth() {
  // Return the visual width of the magnetic track (4px from drawTrack function)
  return 4;
}

function toggleTrackMode() {
  trackMode.value = !trackMode.value;
  isDrawingTrack.value = false;
  currentTrack.value = null;
}

function handleTrackClick(pos) {
  if (!isDrawingTrack.value) {
    // Start new track
    currentTrack.value = {
      x1: pos.x,
      y1: pos.y,
      x2: pos.x, // Initialize with same position
      y2: pos.y,
    };
    isDrawingTrack.value = true;
    redrawCanvas(); // Immediate redraw to show start point
  } else {
    // Complete track
    currentTrack.value.x2 = pos.x;
    currentTrack.value.y2 = pos.y;

    // Only add track if it has some length
    const trackLength = Math.sqrt(
      Math.pow(currentTrack.value.x2 - currentTrack.value.x1, 2) +
        Math.pow(currentTrack.value.y2 - currentTrack.value.y1, 2)
    );

    if (trackLength > 10) {
      // Minimum track length
      tracks.value.push({ ...currentTrack.value });
    }

    isDrawingTrack.value = false;
    currentTrack.value = null;
    redrawCanvas();
  }
}

function clearTracks() {
  tracks.value = [];
  lights.value = [];
  lightCounter.value = 0;
  selectedLightId.value = null;
  redrawCanvas();
}

function findNearestTrack(x, y, threshold = 30) {
  let nearestTrack = null;
  let minDistance = threshold / zoom.value;

  tracks.value.forEach((track) => {
    const distance = distanceToLine(
      x,
      y,
      track.x1,
      track.y1,
      track.x2,
      track.y2
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestTrack = track;
    }
  });

  return nearestTrack;
}

function distanceToLine(px, py, x1, y1, x2, y2) {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = lenSq !== 0 ? dot / lenSq : 0;

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

function projectPointOnTrack(px, py, track) {
  const { x1, y1, x2, y2 } = track;

  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  let position = lenSq !== 0 ? dot / lenSq : 0;
  position = Math.max(0, Math.min(1, position));

  return {
    x: x1 + position * C,
    y: y1 + position * D,
    position,
  };
}

// ===================
// LIGHT MANAGEMENT & ALIGNMENT
// ===================

function setLightType(type) {
  selectedLightType.value = type;
}

function createLight(track, x, y) {
  const projected = projectPointOnTrack(x, y, track);
  const trackLength = getTrackLength(track);
  const trackWidth = getTrackWidth();

  // Default light width should match track width, but allow it to be longer along the track
  const defaultWidth = Math.min(trackWidth * 6, trackLength * 0.3); // Start with reasonable size

  const light = {
    id: ++lightCounter.value,
    type: selectedLightType.value,
    track: track,
    x: projected.x,
    y: projected.y,
    trackPosition: projected.position,
    width: defaultWidth,
    height: trackWidth, // Height matches track width for perfect alignment
    maxWidth: trackLength * 0.8, // Maximum width is 80% of track length
    minWidth: trackWidth, // Minimum width is track width
    brightness: defaultSettings.value.brightness,
    temperature: defaultSettings.value.temperature,
    rotation: 0, // Will be calculated from track angle
    tiltX: 0,
    tiltY: 0,
  };

  // Align light with track
  updateLightAlignment(light);

  lights.value.push(light);
  selectedLightId.value = light.id;
}

function updateLightAlignment(light) {
  // Calculate track angle and align light rotation
  light.rotation = getTrackAngleDegrees(light.track);
}

function updateLightPositionOnTrack(light) {
  const { x1, y1, x2, y2 } = light.track;
  const position = light.trackPosition;

  light.x = x1 + position * (x2 - x1);
  light.y = y1 + position * (y2 - y1);

  // Maintain alignment with track
  updateLightAlignment(light);
}

function getTrackAngle(track) {
  const deltaX = track.x2 - track.x1;
  const deltaY = track.y2 - track.y1;
  return Math.atan2(deltaY, deltaX);
}

function getTrackAngleDegrees(track) {
  const angle = getTrackAngle(track);
  return (angle * 180) / Math.PI;
}

function startLightDrag(e, light) {
  e.preventDefault();
  e.stopPropagation();

  selectedLightId.value = light.id;
  isDraggingLight.value = true;
  draggedLight.value = light;
}

function openLightEditor(light) {
  editingLight.value = { ...light }; // Create a copy to avoid direct mutation
  selectedLightId.value = light.id;
}

function closeEditor() {
  if (editingLight.value) {
    // Apply changes back to the original light
    const originalLight = lights.value.find(
      (l) => l.id === editingLight.value.id
    );
    if (originalLight) {
      Object.assign(originalLight, editingLight.value);
      updateLightPositionOnTrack(originalLight);
    }
  }
  editingLight.value = null;
}

function duplicateLight() {
  if (!editingLight.value) return;

  // Find a new position slightly offset along the track
  let newPosition = editingLight.value.trackPosition + 0.1;
  if (newPosition > 1) newPosition = editingLight.value.trackPosition - 0.1;
  if (newPosition < 0) newPosition = 0.5;

  const trackLength = getTrackLength(editingLight.value.track);
  const trackWidth = getTrackWidth();

  const newLight = {
    ...editingLight.value,
    id: ++lightCounter.value,
    trackPosition: newPosition,
    height: trackWidth, // Ensure height matches track width
    maxWidth: trackLength * 0.8,
    minWidth: trackWidth,
  };

  // Ensure width is within track constraints
  newLight.width = Math.max(
    newLight.minWidth,
    Math.min(newLight.width, newLight.maxWidth)
  );

  updateLightPositionOnTrack(newLight);
  updateLightAlignment(newLight);

  lights.value.push(newLight);
  editingLight.value = newLight;
  selectedLightId.value = newLight.id;
}

function resetLight() {
  if (!editingLight.value) return;

  const trackLength = getTrackLength(editingLight.value.track);
  const trackWidth = getTrackWidth();

  editingLight.value.width = Math.min(trackWidth * 6, trackLength * 0.3);
  editingLight.value.height = trackWidth;
  editingLight.value.brightness = defaultSettings.value.brightness;
  editingLight.value.temperature = defaultSettings.value.temperature;
  updateLightAlignment(editingLight.value);
}

function deleteLight() {
  if (!editingLight.value) return;

  const lightIndex = lights.value.findIndex(
    (l) => l.id === editingLight.value.id
  );
  if (lightIndex > -1) {
    lights.value.splice(lightIndex, 1);
  }

  editingLight.value = null;
  selectedLightId.value = null;
}

function getLightStyle(light) {
  const screenX = light.x * zoom.value + panX.value;
  const screenY = light.y * zoom.value + panY.value;
  const scale = zoom.value;

  // Apply depth scaling if depth mask is available
  let depthScale = 1;
  if (depthMaskImage.value) {
    const depth = getDepthAtPosition(light.x, light.y);
    depthScale = 0.7 + depth * 0.5;
  }

  // Calculate track angle for proper alignment
  const trackAngle = getTrackAngleDegrees(light.track);

  const transforms = [
    `translate(${screenX}px, ${screenY}px)`,
    `translate(-50%, -50%)`, // Center the light on its position
    `rotate(${trackAngle}deg)`, // Align with track direction
    `scale(${scale * depthScale})`,
  ];

  return {
    position: "absolute",
    left: "0",
    top: "0",
    width: light.width + "px",
    height: light.height + "px",
    transform: transforms.join(" "),
    transformOrigin: "center center",
    opacity: light.brightness,
    "--light-temperature": getLightColor(light.temperature),
    pointerEvents: trackMode.value ? "none" : "auto",
  };
}

function getLightColor(temperature) {
  // Convert color temperature to RGB
  if (temperature <= 3000) {
    return "#ffcc99"; // Warm white
  } else if (temperature <= 4000) {
    return "#fff3e6"; // Neutral warm
  } else if (temperature <= 5000) {
    return "#ffffff"; // Pure white
  } else {
    return "#e6f3ff"; // Cool white
  }
}

function getDepthAtPosition(x, y) {
  if (!depthMaskImage.value) return 0.5;

  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = depthMaskImage.value.width;
  tempCanvas.height = depthMaskImage.value.height;
  tempCtx.drawImage(depthMaskImage.value, 0, 0);

  const maskX = Math.floor(
    ((x - renderOffsetX.value) / renderWidth.value) * depthMaskImage.value.width
  );
  const maskY = Math.floor(
    ((y - renderOffsetY.value) / renderHeight.value) *
      depthMaskImage.value.height
  );

  const clampedX = Math.max(0, Math.min(maskX, depthMaskImage.value.width - 1));
  const clampedY = Math.max(
    0,
    Math.min(maskY, depthMaskImage.value.height - 1)
  );

  const imageData = tempCtx.getImageData(clampedX, clampedY, 1, 1);
  return imageData.data[0] / 255;
}

// ===================
// VIEW CONTROLS
// ===================

function zoomIn() {
  if (isLoading.value) return;
  const newZoom = Math.min(maxZoom.value, zoom.value * 1.2);
  if (newZoom !== zoom.value) {
    zoomToCenter(newZoom);
  }
}

function zoomOut() {
  if (isLoading.value) return;
  const newZoom = Math.max(minZoom.value, zoom.value / 1.2);
  if (newZoom !== zoom.value) {
    zoomToCenter(newZoom);
  }
}

function zoomToCenter(newZoom) {
  const centerX = canvasWidth.value / 2;
  const centerY = canvasHeight.value / 2;

  const imageX = (centerX - panX.value) / zoom.value;
  const imageY = (centerY - panY.value) / zoom.value;

  zoom.value = newZoom;
  panX.value = centerX - imageX * zoom.value;
  panY.value = centerY - imageY * zoom.value;

  redrawCanvas();
}

function resetView() {
  zoom.value = 1;
  panX.value = 0;
  panY.value = 0;
  redrawCanvas();
}

function toggleDepth() {
  showDepth.value = !showDepth.value;
  if (showDepth.value && depthMaskImage.value) {
    redrawDepthCanvas();
  }
}

function getTouchDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function getTouchCenterPoint(touch1, touch2) {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
}
// ===================
// CANVAS RENDERING
// ===================

function redrawCanvas() {
  if (!ctx.value) return;

  ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

  // Background
  ctx.value.fillStyle = "#f3f2f7";
  ctx.value.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

  ctx.value.save();
  ctx.value.translate(panX.value, panY.value);
  ctx.value.scale(zoom.value, zoom.value);

  // Draw background image
  if (backgroundImage.value) {
    ctx.value.drawImage(
      backgroundImage.value,
      renderOffsetX.value,
      renderOffsetY.value,
      renderWidth.value,
      renderHeight.value
    );
  }

  // Draw tracks
  tracks.value.forEach((track) => {
    drawTrack(track);
  });

  // Draw current track being drawn with enhanced visuals
  if (isDrawingTrack.value && currentTrack.value) {
    const hasEndPoint =
      currentTrack.value.x2 !== undefined &&
      (currentTrack.value.x2 !== currentTrack.value.x1 ||
        currentTrack.value.y2 !== currentTrack.value.y1);

    if (hasEndPoint) {
      // Draw preview track line
      ctx.value.strokeStyle = "rgba(255, 149, 0, 0.8)";
      ctx.value.lineWidth = 6 / zoom.value;
      ctx.value.lineCap = "round";
      ctx.value.setLineDash([8 / zoom.value, 4 / zoom.value]);
      ctx.value.beginPath();
      ctx.value.moveTo(currentTrack.value.x1, currentTrack.value.y1);
      ctx.value.lineTo(currentTrack.value.x2, currentTrack.value.y2);
      ctx.value.stroke();
      ctx.value.setLineDash([]);

      // Draw track length indicator
      const length = Math.sqrt(
        Math.pow(currentTrack.value.x2 - currentTrack.value.x1, 2) +
          Math.pow(currentTrack.value.y2 - currentTrack.value.y1, 2)
      );

      const midX = (currentTrack.value.x1 + currentTrack.value.x2) / 2;
      const midY = (currentTrack.value.y1 + currentTrack.value.y2) / 2;

      // Length label background
      ctx.value.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.value.fillRect(
        midX - 25 / zoom.value,
        midY - 8 / zoom.value,
        50 / zoom.value,
        16 / zoom.value
      );

      // Length text
      ctx.value.fillStyle = "white";
      ctx.value.font = `${10 / zoom.value}px Arial`;
      ctx.value.textAlign = "center";
      ctx.value.fillText(
        `${Math.round(length)}px`,
        midX,
        midY + 3 / zoom.value
      );
      ctx.value.textAlign = "left";
    }

    // Draw start point with pulsing animation
    const startPointSize = 8 / zoom.value;
    const pulseSize =
      startPointSize + (Math.sin(Date.now() * 0.005) * 2) / zoom.value;

    // Outer glow
    ctx.value.fillStyle = "rgba(255, 149, 0, 0.3)";
    ctx.value.beginPath();
    ctx.value.arc(
      currentTrack.value.x1,
      currentTrack.value.y1,
      pulseSize + 4 / zoom.value,
      0,
      2 * Math.PI
    );
    ctx.value.fill();

    // Main start point
    ctx.value.fillStyle = "#363636";
    ctx.value.beginPath();
    ctx.value.arc(
      currentTrack.value.x1,
      currentTrack.value.y1,
      startPointSize,
      0,
      2 * Math.PI
    );
    ctx.value.fill();

    // Inner highlight
    ctx.value.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.value.beginPath();
    ctx.value.arc(
      currentTrack.value.x1,
      currentTrack.value.y1,
      startPointSize * 0.4,
      0,
      2 * Math.PI
    );
    ctx.value.fill();

    // Draw end point if mouse is positioned
    if (hasEndPoint) {
      ctx.value.fillStyle = "#363636";
      ctx.value.strokeStyle = "white";
      ctx.value.lineWidth = 2 / zoom.value;
      ctx.value.beginPath();
      ctx.value.arc(
        currentTrack.value.x2,
        currentTrack.value.y2,
        6 / zoom.value,
        0,
        2 * Math.PI
      );
      ctx.value.fill();
      ctx.value.stroke();
    }
  }

  ctx.value.restore();
}

function drawTrack(track) {
  if (!ctx.value) return;

  // Track shadow/glow effect - BLACK
  ctx.value.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.value.lineWidth = 8 / zoom.value;
  ctx.value.lineCap = "round";
  ctx.value.beginPath();
  ctx.value.moveTo(track.x1, track.y1);
  ctx.value.lineTo(track.x2, track.y2);
  ctx.value.stroke();

  // Main track line - BLACK COLOR
  ctx.value.strokeStyle = "#000000";
  ctx.value.lineWidth = 4 / zoom.value;
  ctx.value.lineCap = "round";
  ctx.value.beginPath();
  ctx.value.moveTo(track.x1, track.y1);
  ctx.value.lineTo(track.x2, track.y2);
  ctx.value.stroke();

  // Track endpoints - BLACK
  const endpointSize = 3 / zoom.value;
  ctx.value.fillStyle = "#000000";
  ctx.value.beginPath();
  ctx.value.arc(track.x1, track.y1, endpointSize, 0, 2 * Math.PI);
  ctx.value.fill();
  ctx.value.beginPath();
  ctx.value.arc(track.x2, track.y2, endpointSize, 0, 2 * Math.PI);
  ctx.value.fill();
}

function redrawDepthCanvas() {
  if (!depthCtx.value || !depthMaskImage.value) return;

  depthCtx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

  depthCtx.value.save();
  depthCtx.value.translate(panX.value, panY.value);
  depthCtx.value.scale(zoom.value, zoom.value);

  depthCtx.value.drawImage(
    depthMaskImage.value,
    renderOffsetX.value,
    renderOffsetY.value,
    renderWidth.value,
    renderHeight.value
  );

  depthCtx.value.restore();
}

defineExpose({
  saveRoom,
});
</script>

<style scoped>
/* Alternative Solution 2: Use CSS Grid Layout */
.magnetic-light-designer {
  /* position: relative; */
  height: 100%;
  /* background: #1a1a1a; */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
  /* display: grid; */
  grid-template-rows: 1fr auto; /* Canvas takes remaining space, toolbar is auto-sized */
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: white;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Canvas Container */
.canvas-container {
  position: relative;
  flex: 1;
  background: #f5f5f5;
  overflow: hidden;
  height: calc(100vh - 140px); /* Responsive height */
  min-height: 400px;
}


.main-canvas {
  display: block;
  cursor: grab;
  transition: opacity 0.3s ease;
  height: 100%;
}

.main-canvas:active {
  cursor: grabbing;
}

.main-canvas.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.depth-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  opacity: 0.6;
  mix-blend-mode: multiply;
}

/* Light Fixtures */
.light-fixture {
  position: absolute;
  cursor: move;
  z-index: 100;
  transition: all 0.2s ease;
  transform-style: preserve-3d;
}

.light-fixture.dragging {
  cursor: grabbing;
  z-index: 101;
}

.light-body {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background: var(--light-temperature, #ffffff);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.9),
    0 0 16px rgba(255, 255, 240, 0.6), 0 0 32px rgba(255, 255, 240, 0.4);
}

.light-rectangular .light-body {
  border-radius: 3px;
}

.light-circular .light-body {
  border-radius: 50%;
}

.light-square .light-body {
  border-radius: 2px;
}

.light-fixture:hover .light-body {
  box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.95),
    0 0 20px rgba(255, 255, 240, 0.8), 0 0 40px rgba(255, 255, 240, 0.6);
  transform: translateZ(2px);
}

.light-fixture.selected .light-body {
  border: 2px solid #007aff;
  box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.9),
    0 0 16px rgba(255, 255, 240, 0.6), 0 0 32px rgba(255, 255, 240, 0.4),
    0 0 8px #007aff, 0 0 16px rgba(0, 122, 255, 0.3);
}

.light-glow {
  position: absolute;
  inset: -4px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 240, 0.3) 0%,
    transparent 70%
  );
  border-radius: inherit;
  pointer-events: none;
}

.light-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 12px;
  height: 12px;
  background: #007aff;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Navigation Controls */
.navigation-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  z-index: 200;
}

/* .zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  padding: 8px 12px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
} */

.nav-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.nav-btn.active {
  background: #007aff;
  color: white;
}

.reset-btn {
  background: rgba(255, 149, 0, 0.8);
}

.reset-btn:hover {
  background: rgba(255, 149, 0, 1);
}

.zoom-level {
  font-size: 12px;
  font-weight: 600;
  color: white;
  min-width: 40px;
  text-align: center;
}

/* Help Text */
.help-text {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  z-index: 200;
  pointer-events: none;
  backdrop-filter: blur(8px);
}

/* Main Toolbar */
.main-toolbar {
  /* position: absolute; */
  /* gap: 24px; */
  padding: 5px 5px;
  padding-bottom:0px;
  background: white;
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.tool-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.tool-section h4 {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.button-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tool-btn:hover {
  background: #f8f8f8;
  border-color: #007aff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tool-btn.active {
  background: #007aff;
  color: white;
  border-color: #007aff;
}

.tool-btn.primary.active {
  background: #ff9500;
  border-color: #ff9500;
}

.tool-btn.danger {
  color: #ff3b30;
  border-color: #ff3b30;
}

.tool-btn.danger:hover {
  background: #ff3b30;
  color: white;
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.tool-btn:disabled:hover {
  background: white;
  border-color: #ddd;
  transform: none;
}

/* Light Type Buttons */
.light-type {
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  min-width: 60px;
}

.light-preview {
  width: 24px;
  height: 16px;
  background: linear-gradient(to bottom, #ffffff, #f0f0f0);
  border: 1px solid #ccc;
  margin-bottom: 4px;
}

.light-preview.rectangular {
  border-radius: 2px;
}

.light-preview.circular {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.light-preview.square {
  width: 20px;
  height: 20px;
  border-radius: 2px;
}

/* Settings Grid */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  min-width: 200px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-item label {
  font-size: 11px;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.slider {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #007aff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #007aff;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.value {
  font-size: 11px;
  font-weight: 600;
  color: #333;
  min-width: 35px;
  text-align: right;
}

/* Stats Section */
.stats-section {
  margin-left: auto;
}

.stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #007aff;
}

/* Light Editor Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.light-editor {
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.editor-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.editor-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.editor-section {
  margin-bottom: 24px;
}

.editor-section:last-child {
  margin-bottom: 0;
}

.editor-section h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.editor-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.editor-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.editor-item label {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.editor-actions {
  display: flex;
  gap: 8px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  background: white;
  color: #333;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn.secondary {
  background: #f8f9fa;
  border-color: #e9ecef;
}

.action-btn.secondary:hover {
  background: #e9ecef;
}

.action-btn.danger {
  background: #ff3b30;
  color: white;
  border-color: #ff3b30;
}

.action-btn.danger:hover {
  background: #e6342a;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-toolbar {
    flex-wrap: wrap;
    gap: 16px;
  }

  .settings-grid {
    /* grid-template-columns: 1fr; */
  }

  .stats {
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .main-toolbar {
    padding: 12px 16px;
    gap: 12px;
  }

  .navigation-controls {
    display:none;
    top: 40px;
    right: 12px;
    gap: 6px;
  }

  .zoom-controls {
    padding: 6px 10px;
  }

  .nav-btn {
    width: 28px;
    height: 28px;
  }

  .light-editor {
    width: 95%;
    max-width: none;
    margin: 16px;
  }

  .editor-grid {
    grid-template-columns: 1fr;
  }

  .editor-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .main-toolbar {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
  }

  .tool-section {
    width: 100%;
  }

  .button-group {
    justify-content: center;
    flex-wrap: wrap;
  }

  .settings-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats {
    justify-content: center;
  }

  .help-text {
    font-size: 11px;
    padding: 6px 12px;
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
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 20, 20, 0.55);
  backdrop-filter: blur(0.1px);
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
    rgba(0, 102, 255, 1) 0%,
    /* bold vertical scanning line */ rgba(0, 102, 255, 0.4) 20%,
    rgba(0, 102, 255, 0.3) 30%,
    /* fade tail after the bold line */ rgba(0, 102, 255, 0.2) 35%,
    rgba(0, 102, 255, 0.15) 40%,
    rgba(0, 102, 255, 0.1) 50%,
    rgba(0, 102, 255, 0) 100%
  );
  animation: moveWaveLeftToRight 3s linear infinite,
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

.stats-and-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats {
  display: flex;
  gap: 16px;
}


/* Desktop */
@media (min-width: 769px) {
  .canvas-container {
    height: calc(100vh - 140px);
  }
}

/* Tablet */
@media (min-width: 400px) and (max-width: 768px) {
  .canvas-container {
    height: calc(100vh - 180px);
  }
}

/* Mobile */
@media (max-width: 399px) {
  .canvas-container {
    height: calc(100vh - 220px);
  }
}

@media (max-width: 768px) {

  .stats-and-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
