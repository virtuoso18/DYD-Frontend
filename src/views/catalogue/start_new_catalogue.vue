<template>
  <div class="home-container">
    <!-- Background video -->
    <div class="video-background">
      <video autoplay
  muted
  loop
  playsinline class="video-element">
        <source src="../../assets/GettyImages-1285221354.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Foreground content -->
    <div class="content-wrapper">
      <h1 class="main-heading">
        Create an AI Catalog with our<br />
        <span class="highlight">stunning Virtual Staging Technology</span>
      </h1>

     <!-- Upload Section -->
<div class="upload-row">
  <button class="action-btn">Image to 3D</button>

  <a-upload-dragger
      v-model:fileList="fileList"
      name="base_image"
      :multiple="false"
      :beforeUpload="beforeUpload"
      :customRequest="customUpload"
      accept=".png,.jpg,.jpeg"
      class="upload-dragger"
      :disabled="uploading"
    >
      <div class="upload-dragger-inner">
        <p class="upload-instruction">Click or drag image to upload</p>
        <p class="upload-hint">PNG or JPEG only</p>
        <a-button type="primary" :loading="uploading">
          <CloudUploadOutlined style="font-size:20px;" />&nbsp; 
          {{ uploading ? 'Processing...' : 'Upload An Image' }}
        </a-button>
      </div>
    </a-upload-dragger>


  <button class="action-btn">Upload 3D object</button>
</div>


      <!-- Examples -->
      <p class="history-label">Your History </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 px-5 max-w-[1300px] mx-auto">
  <div
    v-for="histry_card in your_history"
    :key="histry_card.id"
    class="p-[5px]"
  >
  <!-- {{ histry_card.brand }} -->
    <!-- {{ $route.query.brand }} -->

    <!-- <router-link
      :to="
        $route.query.brand
          ? `/update-catalogue/${histry_card.id}?brand=${$route.query.brand}`
          : `/update-catalogue/${histry_card.id}`
      "
    > -->
    <router-link
      :to="
        $route.query.brand
          ? (histry_card.brand ? `/update-catalogue/${histry_card.id}?brand=${histry_card.brand}` : `/update-catalogue/${histry_card.id}?brand=${$route.query.brand}`)
          : `/update-catalogue/${histry_card.id}`
      "
    >
      <img
        :src="$store.state.root_media_api + histry_card.image"
        alt="Example"
        class="example-image"
      />
    </router-link>
  </div>
</div>


      <!-- Examples -->
      <p class="example-label">Use an example image</p>
      <div class="example-images">
        <a-row>

          <a-col span="8" v-for="example in exampleImages" :key="id" style="padding:5px;">
            
              <img  @click="startTestRoom(example.id)" :src="this.$store.state.root_media_api+example.image" class="example-image" />
          </a-col>
        </a-row>
      </div>


    </div>
  </div>
</template>

<script>
import { CloudUploadOutlined } from '@ant-design/icons-vue';
// import axios from 'axios';

export default {
  components: {
    CloudUploadOutlined
  },
  data() {
    return {
      fileList: [],
      uploading: false,
      uploadResult: null,
      uploadError: null,
      your_history: [],
      exampleImages: []
    };
  },
  
  mounted() {
    this.fetchExampleRooms();
    this.fetchUserHistoryRooms();
  },
  methods: {
    async fetchExampleRooms() {
      this.loading = true;
      try {
        const url = `${this.$store.state.root_api}room/api/example-rooms/`;
        const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('token')}`
        },
      }, );
        const data = await response.json();
        console.log(data)
        if (data && data.data) {
          this.exampleImages = data.data;
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        this.loading = false;
      }
    },
    async startTestRoom(room_id) {
      console.log(room_id)
      this.loading = true;
      try {
        const url = `${this.$store.state.root_api}room/api/start-example-room/${room_id}`;
        const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('token')}`
        },
      }, );
        const data = await response.json();
        console.log(data)
        if (data && data.data) {
          this.exampleImages = data.data;
          
          if (this.$route.query.brand){
            this.$router.push({ name: 'update_catelogue', params: { id: this.exampleImages.id },query: {
              brand: this.$route.query.brand,
            } });
          }else{

            this.$router.push({ name: 'update_catelogue', params: { id: this.exampleImages.id } });
          }

        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchUserHistoryRooms() {
      this.loading = true;
      try {
        const url = `${this.$store.state.root_api}room/api/user-history-rooms/`;
        const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
              'Authorization': `Token ${localStorage.getItem('token')}`
        },
      }, );
        const data = await response.json();
        console.log(data)
        if (data && data.data) {
          this.your_history = data.data;
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        this.loading = false;
      }
    },
      beforeUpload(file) {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size / 1024 / 1024 < 10; // 10MB limit
      
      if (!isImage) {
        this.$message.error("Only image files allowed!");
        return false;
      }

      if (!isValidSize) {
        this.$message.error("Image must be smaller than 10MB!");
        return false;
      }

      // Reset previous results
      this.uploadResult = null;
      this.uploadError = null;
      
      return true;
    },

    async customUpload({ file, onSuccess, onError }) {
      this.uploading = true;
      
      try {
        // Create FormData for multipart upload
        const formData = new FormData();
        formData.append('base_image', file);
        if(this.$route.query.brand){
          formData.append('business_owner',this.$route.query.brand);
          
          console.log(this.$route.query.brand)
          // return 
        }
        

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes timeout

        // Make API call to Django endpoint using fetch
        const response = await fetch(this.$store.state.root_api+'engine/new-room/', {
          method: 'POST',
          body: formData,
          headers: {
            // Don't set Content-Type manually - let browser set it for multipart/form-data
            // Add your authentication token if needed
            'Authorization': `Token ${localStorage.getItem('token')}`
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Parse JSON response
        const responseData = await response.json();

        // Handle successful response
        if (response.ok && !responseData.error) {
          this.uploadResult = responseData;
          this.$message.success('Room processed successfully!');
          onSuccess(responseData);
          
          // Emit event to parent component if needed
          this.$emit('upload-success', responseData);
          //  this.$router.push({ name: 'update_catelogue', params: { id: responseData.room_id } });
          if (this.$route.query.brand){
            this.$router.push({ name: 'update_catelogue',  params: { id: responseData.room_id },query: {
              brand: this.$route.query.brand,
            } });
          }else{
            this.$router.push({ name: 'update_catelogue', params: { id: responseData.room_id } });
          }
        } else {
          // Handle API error response
          const errorMsg = responseData.msg || `HTTP ${response.status}: Upload failed`;
          this.uploadError = errorMsg;
          this.$message.error(errorMsg);
          onError(new Error(errorMsg));
        }

      } catch (error) {
        console.error('Upload error:', error);
        
        let errorMessage = 'Upload failed';
        
        if (error.name === 'AbortError') {
          // Timeout error
          errorMessage = 'Upload timeout - file may be too large or processing is taking too long';
        } else if (error.message.includes('fetch')) {
          // Network error
          errorMessage = 'Network error - please check your connection';
        } else {
          errorMessage = error.message || 'Unknown error occurred';
        }

        this.uploadError = errorMessage;
        this.$message.error(errorMessage);
        onError(error);
      } finally {
        this.uploading = false;
      }
    },

    // Method to retry upload
    retryUpload() {
      if (this.fileList.length > 0) {
        const file = this.fileList[0];
        this.customUpload({
          file: file.originFileObj || file,
          onSuccess: () => {},
          onError: () => {}
        });
      }
    },

    // Method to clear results and reset component
    resetUpload() {
      this.fileList = [];
      this.uploadResult = null;
      this.uploadError = null;
      this.uploading = false;
    }
  }
};

</script>

<style scoped>
/* Main Container */
.home-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #ffffff;
}

/* Background Video */
.video-background {
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
  z-index: 0;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* filter: brightness(0.6); */
}
.video-background::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 350px; /* More height for a smoother gradient */
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.8) 25%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  z-index: 1;
}

/* Foreground Content */
.content-wrapper {
  position: relative;
  z-index: 1;
  /* padding: 100px 20px 60px; */
  text-align: center;
  max-width: 1000px;
  margin: auto;
  margin-top:-250px;
  /* background: linear-gradient(to bottom, rgba(255,255,255,0.65) 10%, rgba(255,255,255,1) 90%); */
  /* backdrop-filter: blur(8px); */
}

/* Title */
.main-heading {
  font-size: 32px;
  font-weight: bold;
  color: #222;
  margin-bottom: 32px;
  line-height: 1.4;
}

.highlight {
  font-weight: 800;
  color: #111;
}

/* Upload Row */
.upload-row {
  display: flex;
  justify-content: center;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.upload-box {
  background: #ffffff;
  border: 2px dashed #ccc;
  border-radius: 14px;
  padding: 30px 20px;
  width: 340px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.upload-text {
  font-size: 13px;
  color: #444;
  margin-bottom: 12px;
}

.upload-text a {
  color: #007bff;
  text-decoration: none;
}

.upload-button {
  background-color: #2f54eb;
  color: white;
  padding: 10px 22px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.upload-button:hover {
  background-color: #1d39c4;
}

/* Action Buttons */
.action-btn {
  background: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.3s;
}

.action-btn:hover {
  background: #f0f0f0;
}

/* Example Images */
.example-label {
  
  font-size: 18px;
  margin-bottom: 20px;
  text-align:start;
  font-weight: 700;
  color: #444;
}



/* Example Images */
.history-label {
  font-size: 18px;
  margin-bottom: 20px;
  text-align:start;
  font-weight: 700;
  color: #444;
}
.example-images {
  display: grid;
  
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 0 20px;
  max-width: 1300px;
  margin: auto;
}

.example-image {
  width: 100%;
  height: 230px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  cursor: pointer;
}

.example-image:hover {
  transform: scale(1.05);
}
.upload-dragger {

  background: #ffffff;
  border: 2px dashed #ccc;
  border-radius: 14px;
  width: 440px;
  padding: 10px;
  height: 180px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  transition: border 0.3s ease;
}

.upload-dragger:hover {
  border-color: #2f54eb;
}

.upload-dragger-inner {
    height:100%;
    /* text-align: center; */
  
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 10px;
  color: #2f54eb;
}

.upload-instruction {
  font-size: 14px;
  font-weight: 500;
  color: #444;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}

</style>
