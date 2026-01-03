<template>
  <div class="mask-overlay-container">
    <div class="image-wrapper">
      <!-- Base Image -->
      <img
        :src="`${$store.state.root_media_api}${selectedImage}`"
        alt="Base Image"
        class="base-image"
        @load="onImageLoad"
      />

      <!-- Binary Mask Overlay -->
      <canvas
        ref="maskCanvas"
        class="mask-overlay"
        :style="{ cursor: 'crosshair' }"
      ></canvas>

      <!-- Opacity Slider Control -->
      <div class="controls">
        <label for="opacitySlider">Mask Opacity:</label>
        <input
          id="opacitySlider"
          v-model.number="maskOpacity"
          type="range"
          min="0"
          max="1"
          step="0.1"
          class="slider"
        />
        <span>{{ Math.round(maskOpacity * 100) }}%</span>
      </div>

      <!-- Legend -->
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color" style="background-color: rgba(76, 175, 80, 0.6);"></div>
          <span>Detected Area</span>
        </div>
      </div>
    </div>

    <!-- Image Info -->
    <div class="image-info">
      <p><strong>Base Image:</strong> {{ selectedImage.image }}</p>
      <p><strong>Mask Path:</strong> {{ obj }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaskOverlay',
  props: {
    selectedImage: {
      type: Object,
      required: true,
      // e.g., { image: 'path/to/image.jpg', ... }
    },
    maskPath: {
      type: String,
      required: true,
      // e.g., 'media/Room_Layout/.../mask_file.png'
    },
  },
  data() {
    return {
      maskOpacity: 0.6,
      baseImage: null,
      maskImage: null,
      canvasWidth: 0,
      canvasHeight: 0,
    };
  },
  computed: {
    obj() {
      return this.maskPath ? `${this.$store.state.root_api}${this.maskPath}` : '';
    },
  },
  watch: {
    maskOpacity() {
      this.drawOverlay();
    },
    selectedImage: {
      handler() {
        this.loadImages();
      },
      deep: true,
    },
    maskPath() {
      this.loadImages();
    },
  },
  mounted() {
    this.loadImages();
  },
  methods: {
    loadImages() {
      // Load base image
      this.baseImage = new Image();
      this.baseImage.src = `${this.$store.state.root_media_api}${this.selectedImage.image}`;
      this.baseImage.onload = () => {
        this.canvasWidth = this.baseImage.width;
        this.canvasHeight = this.baseImage.height;
        this.$refs.maskCanvas.width = this.canvasWidth;
        this.$refs.maskCanvas.height = this.canvasHeight;
      };
      this.baseImage.onerror = () => {
        console.error('Failed to load base image');
      };

      // Load mask image
      this.maskImage = new Image();
      this.maskImage.src = this.obj;
      this.maskImage.onload = () => {
        this.drawOverlay();
      };
      this.maskImage.onerror = () => {
        console.error('Failed to load mask image');
      };
    },

    drawOverlay() {
      if (!this.$refs.maskCanvas || !this.baseImage || !this.maskImage) {
        return;
      }

      const canvas = this.$refs.maskCanvas;
      const ctx = canvas.getContext('2d');

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw base image
      ctx.drawImage(this.baseImage, 0, 0, canvas.width, canvas.height);

      // Apply mask overlay with green highlight for detected areas
      ctx.save();
      ctx.globalAlpha = this.maskOpacity;

      // Create temporary canvas for processing mask
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');

      // Draw mask image
      tempCtx.drawImage(this.maskImage, 0, 0, canvas.width, canvas.height);

      // Get image data and process
      const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert grayscale mask to green overlay
      // White/light areas (detected) become green, black/dark areas become transparent
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i]; // red channel (grayscale value)
        const threshold = 127;

        if (gray > threshold) {
          // Detected area - make it green
          data[i] = 76; // R
          data[i + 1] = 175; // G
          data[i + 2] = 80; // B
          data[i + 3] = 200; // A (opacity)
        } else {
          // Non-detected area - make transparent
          data[i + 3] = 0;
        }
      }

      tempCtx.putImageData(imageData, 0, 0);

      // Draw processed mask onto main canvas
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.restore();
    },

    onImageLoad() {
      this.drawOverlay();
    },
  },
};
</script>

<style scoped>
.mask-overlay-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  max-width: 100%;
}

.image-wrapper {
  position: relative;
  display: inline-block;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.base-image {
  display: block;
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
}

.mask-overlay {
  position: absolute;
  top: 0;
  left: 0;
  max-width: 100%;
  max-height: 600px;
  cursor: crosshair;
}

.controls {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 500;
}

.slider {
  width: 120px;
  cursor: pointer;
}

.legend {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.image-info {
  background-color: white;
  padding: 12px 16px;
  border-radius: 6px;
  border-left: 4px solid #4caf50;
  font-size: 13px;
}

.image-info p {
  margin: 4px 0;
  word-break: break-all;
}

.image-info strong {
  color: #333;
}
</style>