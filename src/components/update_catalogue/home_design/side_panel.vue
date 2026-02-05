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
          <CloudUploadOutlined class="upload-icon"  />
          <div class="upload-text">Click / upload from camera / drag and drop</div>
          <div class="upload-hint">Support format: .png .jpeg</div>
        </div>
        
        <div v-if="uploading" class="uploading-content">
          <a-spin size="large" />
          <div class="uploading-text">Uploading...</div>
        </div>
        
        <!-- <div v-if="uploadedImage && !uploading" class="image-preview">
          <img :src="uploadedImage" alt="uploaded" />
        </div> -->
        <div v-if="uploadedImage && !uploading" class="image-preview">
  <img :src="uploadedImage" alt="uploaded" />
  <div class="delete-button" @click.stop="deleteImage">
    <DeleteOutlined />
  </div>
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
  :loading="generating"
  @click="handleGenerate"
>
  <a-icon type="thunderbolt" />
  {{ generating ? 'Generating...' : 'Generate' }}
</a-button>
  </div>
</template>

<script>
import { DeleteOutlined,CloudUploadOutlined  } from '@ant-design/icons-vue';
export default {
  name: 'SidePanel',
  components:{
    DeleteOutlined,CloudUploadOutlined 
  },
  props: {
  base_image_url: {
    type: String,
    default: ''
  }
},
watch: {
  base_image_url: {
    handler(newVal) {
      if (newVal) {
        this.uploadedImage = newVal
      }
    },
    immediate: true
  }
},
  data() {
    return {
      fileList: [],
       generating: false,
      uploadedImage: this.base_image_url || '',
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
     if (this.base_image_url) {
    this.uploadedImage = this.base_image_url
  }
  },
  methods: {
    startPolling(jobId) {
      if (!jobId) return Promise.reject("Invalid job id");

      this.stopPolling();
      this.loading = true;
      this.jobId = jobId;

      return new Promise((resolve, reject) => {
        const poll = async () => {
          try {
            this.generating = true
            const res = await fetch(
              `${this.$store.state.root_api}renderer/checkout-renderer/${jobId}/`,
            );

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            if (data.status === "Completed") {
              this.loading = false;
              this.stopPolling();
              resolve(data);
              this.$emit('home-design-generation-complete', data);
              this.$message.success('Image generated successfully!');
              this.generating = false
              return;
            }

            if (data.status === "failed") {
              this.loading = false;
              this.stopPolling();
              reject("Rendering failed");
              this.$message.success('Image generated successfully!');
              this.generating = false;
              return;
            }

            console.log("⏳ Rendering in progress...");
          } catch (err) {
            this.loading = false;
            this.stopPolling();
            reject(err);
            this.generating = false
          }finally{
            //this.generating = false
          }
        };

        // run immediately
        poll();

        // then every 3s
        this.pollTimer = setInterval(poll, 3000);
      });
    },

    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    },
     deleteImage() {
    this.uploadedImage = ''
    this.fileList = []
  },

  async handleGenerate() {
  // Validate that an image is selected
  if (!this.uploadedImage) {
    this.$message.warning('Please select an image first')
    return
  }

  // Show loading state (optional)
  this.generating = true // Add this to your data if you want loading state

  try {
    const payload = {
      room_id:this.$route.params.id,
      base64_image: this.uploadedImage,
      variations: this.selectedVariation,
      aspect_ratio: this.selectedAspectRatio,
      // Add any other data you need to send
    }
    console.log(payload)

    const response = await fetch(this.$store.state.root_api+'engine/generate-home-design-images/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload)
    })
    // console.log("response Here ")
    // console.log(response.status)
    if(response.status===402){
      let result = await response.json()
      // console.log(result )
       this.$emit('insufficient-credits',result.msg,result.buid) 
      this.generating = false
      return
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json();
    if (result?.renderer_id) {
          // ⏳ WAIT until polling completes
          // const finalImage = await this.startPolling(result.renderer_id);

      this.startPolling(result?.renderer_id);
          // ✅ ONLYJ() NOW update canvas
          
        }
    // Handle successful response
    // console.log('Generation successful:', result)
    // this.$message.success('Image generated successfully!')
    
    // Emit event to parent component or handle result as needed
    // this.$emit('home-design-generation-complete', result)
    
  } catch (error) {
    console.error('Generation failed:', error)
    this.$message.error('Failed to generate image. Please try again.');
    this.generating = false
  } 
},
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
  font-size: 38px;
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

.image-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
  position: relative; /* Add this */
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

/* Add this new CSS */
.delete-button {
  position: absolute;
  top: 8px;
  right: 16px;
  width: 24px;
  height: 24px;
  background: rgb(255, 45, 45);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 12px;
  transition: background-color 0.2s;
}

.delete-button:hover {
  background: rgba(255, 13, 13, 0.8);
}
</style>