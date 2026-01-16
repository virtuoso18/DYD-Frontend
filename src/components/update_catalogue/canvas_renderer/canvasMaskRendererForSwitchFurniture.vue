<template>
  <div class="mask-overlay-container">
    <div class="image-wrapper">
      <!-- Canvas Section -->
      <div class="canvas-section">
        <!-- Binary Mask Overlay Canvas -->
        <canvas
          ref="maskCanvas"
          class="mask-overlay"
          :style="{
            cursor: 'crosshair',
            display: 'block',
            width: '100%',
            height: 'auto',
          }"
        ></canvas>
      </div>
      <button
        @click="toggleObjectSelection(selectedObjectKey)"
        class="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors bg-white absolute right-4 bottom-4 cursor-pointer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.125 5H1.875C1.525 5 1.25 4.725 1.25 4.375C1.25 4.025 1.525 3.75 1.875 3.75H18.125C18.475 3.75 18.75 4.025 18.75 4.375C18.75 4.725 18.475 5 18.125 5Z"
            fill="#E33827"
          />
          <path
            d="M13.7734 4.76231L13.2234 2.9373C13.1856 2.80748 13.1066 2.69344 12.9984 2.6123C12.8903 2.53117 12.7587 2.4873 12.6234 2.4873H7.37344C7.23821 2.4873 7.10662 2.53117 6.99844 2.6123C6.89025 2.69344 6.8113 2.80748 6.77344 2.9373L6.22344 4.76231L5.02344 4.39981L5.57344 2.5748C5.81094 1.7748 6.53594 1.2373 7.37344 1.2373H12.6234C13.4609 1.2373 14.1734 1.7748 14.4234 2.5748L14.9734 4.39981L13.7734 4.76231Z"
            fill="#E33827"
          />
          <path
            d="M14.4141 18.75H5.58906C4.57656 18.75 3.75156 17.95 3.71406 16.9375L3.28906 4.6L4.53906 4.5625L4.96406 16.9C4.96406 17.2375 5.25156 17.5 5.58906 17.5H14.4266C14.7641 17.5 15.0391 17.2375 15.0516 16.9L15.4766 4.5625L16.7266 4.6L16.3016 16.9375C16.2641 17.95 15.4391 18.75 14.4266 18.75H14.4141Z"
            fill="#E33827"
          />
          <path
            d="M8.125 14.5254C7.775 14.5254 7.5 14.2504 7.5 13.9004V8.90039C7.5 8.55039 7.775 8.27539 8.125 8.27539C8.475 8.27539 8.75 8.55039 8.75 8.90039V13.9004C8.75 14.2504 8.475 14.5254 8.125 14.5254ZM11.875 14.5254C11.525 14.5254 11.25 14.2504 11.25 13.9004V8.90039C11.25 8.55039 11.525 8.27539 11.875 8.27539C12.225 8.27539 12.5 8.55039 12.5 8.90039V13.9004C12.5 14.2504 12.225 14.5254 11.875 14.5254Z"
            fill="#E33827"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MaskOverlay",
  props: {
    selectedImage: {
      type: String,
      required: true,
    },
    maskPath: {
      type: String,
      required: true,
    },
    toggleObjectSelection: {
      type: Function,
      required: false,
    },
    selectedObjectKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      maskOpacity: 1,
      baseImage: null,
      maskImage: null,
      canvasWidth: 800,
      canvasHeight: 600,
    };
  },
  watch: {
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
    this.$nextTick(() => {
      this.loadImages();
      window.addEventListener("resize", this.handleResize);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    loadImages() {
      // Load base image
      const baseImg = new Image();
      baseImg.crossOrigin = "anonymous";
      baseImg.src = `${this.selectedImage}`;
      console.log("image :", `${this.selectedImage}`);

      baseImg.onload = () => {
        this.baseImage = baseImg;
        this.setupCanvas();
      };

      baseImg.onerror = (e) => {
        console.error("Failed to load base image:", e);
      };

      // Load mask image
      const maskImg = new Image();
      maskImg.crossOrigin = "anonymous";
      maskImg.src = `${this.maskPath}`;

      maskImg.onload = () => {
        this.maskImage = maskImg;
        this.drawOverlay();
      };

      maskImg.onerror = (e) => {
        console.error("Failed to load mask image:", e);
      };
    },

    setupCanvas() {
      if (!this.$refs.maskCanvas || !this.baseImage) {
        return;
      }

      const canvas = this.$refs.maskCanvas;
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;

      // Calculate dimensions
      const imgAspectRatio = this.baseImage.width / this.baseImage.height;
      const maxHeight = 600;

      let width = containerWidth;
      let height = width / imgAspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * imgAspectRatio;
      }

      this.canvasWidth = width;
      this.canvasHeight = height;

      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;

      this.drawOverlay();
    },

    drawOverlay() {
      if (!this.$refs.maskCanvas || !this.baseImage || !this.maskImage) {
        return;
      }

      const canvas = this.$refs.maskCanvas;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Could not get canvas context");
        return;
      }

      // Clear canvas
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw base image
      try {
        ctx.drawImage(this.baseImage, 0, 0, canvas.width, canvas.height);
      } catch (e) {
        console.error("Error drawing base image:", e);
        return;
      }

      // Create temporary canvas for processing mask
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");

      // Draw mask image
      try {
        tempCtx.drawImage(this.maskImage, 0, 0, canvas.width, canvas.height);
      } catch (e) {
        console.error("Error drawing mask image:", e);
        return;
      }

      // Get image data and process
      let imageData;
      try {
        imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
      } catch (e) {
        console.error("Error getting image data:", e);
        return;
      }

      const data = imageData.data;

      // Convert grayscale mask to green overlay
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i]; // red channel
        const threshold = 127;

        if (gray > threshold) {
          // Detected area - make it green
          data[i] = 220; // R
          data[i + 1] = 50; // G
          data[i + 2] = 50; // B
          data[i + 3] = 200; // A/ A
        } else {
          // Non-detected area - make transparent
          data[i + 3] = 0;
        }
      }

      tempCtx.putImageData(imageData, 0, 0);

      // Draw processed mask with opacity
      ctx.save();
      ctx.globalAlpha = this.maskOpacity;
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.restore();
    },

    handleResize() {
      if (this.baseImage) {
        this.setupCanvas();
      }
    },
    drawWatermark(ctx, canvas, text) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "rgba(243, 243, 243, 1)";
      ctx.font = "bold 16px popins, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Optional: diagonal watermark
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);

      ctx.fillText(text, 0, 0);

      ctx.restore();
    },
  },
};
</script>

<style scoped>
.mask-overlay-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.image-wrapper {
  position: relative;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
}

.canvas-section {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}

.mask-overlay {
  max-width: 100%;
  height: auto;
  display: block;
  /* border-radius: 8px; */
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
  /* gap: 12px; */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 500;
  z-index: 10;
  flex-wrap: wrap;
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
  z-index: 10;
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
  flex-shrink: 0;
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

@media (max-width: 768px) {
  .mask-overlay-container {
    padding: 12px;
    gap: 12px;
  }

  .canvas-section {
    padding: 8px;
  }

  .controls {
    bottom: 12px;
    left: 12px;
    right: 12px;
    padding: 10px 12px;
    font-size: 12px;
  }

  .slider {
    width: 100px;
  }

  .legend {
    top: 12px;
    right: 12px;
    padding: 10px 12px;
  }

  .legend-item {
    font-size: 12px;
  }

  .legend-color {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 480px) {
  .mask-overlay-container {
    padding: 8px;
    gap: 8px;
    /* width: 100%; */
  }

  .controls {
    bottom: 8px;
    left: 8px;
    right: 8px;
    padding: 8px;
    font-size: 11px;
  }

  .slider {
    width: 80px;
  }

  .legend {
    top: 8px;
    right: 8px;
    padding: 8px 10px;
  }

  .legend-item {
    font-size: 11px;
  }

  .legend-color {
    width: 14px;
    height: 14px;
  }

  .image-info {
    font-size: 11px;
    padding: 10px;
  }
}
</style>
