<template>
  <div class="side-panel">
    <!-- Image Upload Area -->
    <div class="upload-area">
      <a-upload-dragger
        v-model="fileList"
        :before-upload="beforeUpload"
        :show-upload-list="false"
        accept="image/*"
        class="upload-dragger"
      >
        <div v-if="!uploadedImage && !uploading" class="upload-content">
          <a-icon type="download" class="upload-icon" />
          <div class="upload-text">Click / upload from camera / drag and drop</div>
          <div class="upload-hint">Support format: .png .jpeg</div>
        </div>
        
        <div v-if="uploading" class="uploading-content">
          <a-spin size="large" />
          <div class="uploading-text">Uploading...</div>
        </div>
        
        <div v-if="uploadedImage && !uploading" class="image-preview">
          <img :src="uploadedImage" alt="uploaded" />
        </div>
      </a-upload-dragger>
    </div>

    <!-- Variations -->
    <div class="section">
      <div class="section-title">Variations</div>
      <div class="variations-row">
        <a-button 
          v-for="num in [1, 2, 3, 4]" 
          :key="num"
          :type="selectedVariation === num ? 'primary' : 'default'"
          size="small"
          @click="selectVariation(num)"
        >
          {{ num }}
        </a-button>
      </div>
    </div>

    <!-- Aspect Ratio -->
    <div class="section">
      <div class="section-title">Aspect ratio</div>
      <div class="aspect-options">
        <a-checkbox 
          v-for="ratio in aspectRatios" 
          :key="ratio.value"
          :checked="selectedAspectRatio === ratio.value"
          @change="handleAspectRatioChange(ratio.value)"
        >
          {{ ratio.label }}
        </a-checkbox>
      </div>
    </div>

    <!-- Credits -->
    <div class="credits-section">
      <a-icon type="credit-card" />
      <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.5013 1.91602C4.58918 1.91602 1.41797 5.08722 1.41797 8.99935C1.41797 12.9115 4.58918 16.0827 8.5013 16.0827C12.4134 16.0827 15.5846 12.9115 15.5846 8.99935C15.5846 5.08722 12.4134 1.91602 8.5013 1.91602ZM8.5013 2.62435C8.5013 4.3151 7.82965 5.93661 6.63411 7.13215C5.43856 8.3277 3.81706 8.99935 2.1263 8.99935C3.81706 8.99935 5.43856 9.671 6.63411 10.8665C7.82965 12.0621 8.5013 13.6836 8.5013 15.3743C8.5013 13.6836 9.17295 12.0621 10.3685 10.8665C11.564 9.671 13.1855 8.99935 14.8763 8.99935C13.1855 8.99935 11.564 8.3277 10.3685 7.13215C9.17295 5.93661 8.5013 4.3151 8.5013 2.62435Z" fill="#3B63FB"/>
</svg>

      <span>1500</span>
    </div>

    <!-- Generate Button -->
    <a-button 
      type="primary" 
      size="large" 
      block
      class="generate-button"
      @click="handleGenerate"
    >
      <a-icon type="thunderbolt" />
      Generate
    </a-button>
  </div>
</template>

<script>
export default {
  name: 'SidePanel',
  data() {
    return {
      fileList: [],
      uploadedImage: '',
      uploading: false,
      selectedVariation: 4,
      selectedAspectRatio: '3:2',
      aspectRatios: [
        { label: '1:1', value: '1:1' },
        { label: '3:2', value: '3:2' },
        { label: '2:3', value: '2:3' }
      ]
    }
  },
  mounted() {
    // Component mounted
  },
  methods: {
    beforeUpload(file) {
      this.uploading = true
      
      setTimeout(() => {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.uploadedImage = e.target.result
          this.uploading = false
        }
        reader.readAsDataURL(file)
      }, 1500)
      
      return false
    },
    
    selectVariation(num) {
      this.selectedVariation = num
    },
    
    handleAspectRatioChange(value) {
      this.selectedAspectRatio = value
    },
    
    handleGenerate() {
      console.log('Generate clicked', {
        variation: this.selectedVariation,
        aspectRatio: this.selectedAspectRatio,
        image: this.uploadedImage
      })
    }
  }
}
</script>

<style scoped>
.side-panel {
  width: 100%;
  /* padding: 20px; */
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-right: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  min-height: 80vh;
}

.upload-area {
  margin-bottom: 10px;
}

.upload-dragger {
  /* border: 2px dashed #d9d9d9 !important; */
  background: #fafafa !important;
  border-radius: 8px !important;
  /* height: 200px; */
  height: 100%;
  max-height: 150px;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* padding: 20px; */
}

.upload-icon {
  font-size: 28px;
  color: #1890ff;
  margin-bottom: 16px;
}

.upload-text {
  color: #1890ff;
  font-size: 14px;
  margin-bottom: 8px;
  text-align: center;
  line-height: 1.4;
}

.upload-hint {
  color: #8c8c8c;
  font-size: 12px;
  text-align: center;
}

.uploading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.uploading-text {
  margin-top: 16px;
  color: #595959;
  font-size: 14px;
}

.image-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 8px; */
  /* padding: 8px; */
  padding-left: 8px;
  padding-right: 8px;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

.section {
  margin-bottom: 15px;
}

.section-title {
  color: #262626;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.variations-row {
  display: flex;
  gap: 8px;
}

.aspect-options {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.credits-section {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1890ff;
  font-size: 16px;
  font-weight: 500;
  margin: auto 0 24px 0;
  gap: 8px;
}

.generate-button {
  height: 44px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
}
</style>