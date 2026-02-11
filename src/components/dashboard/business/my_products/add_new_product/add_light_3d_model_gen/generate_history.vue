<template>
    <div className="bg-white h-full sm:h-[90vh] p-2.5 sm:overflow-y-scroll">
    <h4>Generate History</h4>
    
    <div v-if="loading_generated_models_history" style="text-align:center;padding:50px;">
      <a-spin size="large" />
    </div>
    
    <div v-else>
        <div v-if="list_history_generated_3d_models.length ===0" style="display: flex;justify-content: center;align-items: center;height:80vh;">
            <svg width="86" height="55" viewBox="0 0 86 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- SVG content stays the same -->
              <path d="M7.5 49H6.408L2.016 42.34V49H0.924V40.624H2.016L6.408 47.272V40.624H7.5V49ZM12.2295..." fill="#8C8C8C"/>
              <path d="M45.2526 0.0058169C36.7692..." fill="#CCCCCC"/>
            </svg>
        </div>
        
      <a-row 
        v-for="(model, index) in list_history_generated_3d_models" 
        :key="model.id"
        style="border-bottom:1px solid #f0f0f0;align-items:center;"
        @click="this.$emit('clicked-model', {'new3d_model_instance':model.id,'media_url':model.model_file_url})"
        class="card-history"
      >
      
        <a-col :span="5">
          <!-- ✨ ADDED: Container with position relative -->
          <div style="position: relative; width: 60px; height: 60px; overflow: hidden; border-radius: 4px;">
            
            <!-- ✨ ADDED: Shimmer skeleton -->
            <div
              v-if="!imageLoadedMap[model.id]"
              class="model-thumbnail-skeleton"
            ></div>

            <!-- ✨ ADDED: Invisible preloader -->
            <img
              :src="$store.state.root_media_api + getMainImage(model)"
              style="position: absolute; width: 0; height: 0; opacity: 0"
              @load="onModelImageLoad(model.id)"
              alt=""
            />

            <!-- ✨ MODIFIED: Actual image with v-show -->
            <img
              v-show="imageLoadedMap[model.id]"
              :src="$store.state.root_media_api + getMainImage(model)" 
              style="width:60px;height:60px;object-fit:cover;border-radius:4px;border:1px solid rgba(0,0,0,0.2)" 
              alt=""
            />
          </div>
        </a-col>
        
        <a-col :span="11">
          <div style="font-size:14px;font-weight:500;margin-bottom:4px;">Generated</div>
          <div style="font-size:12px;color:#666;">{{ formatDate(model.created_at) }}</div>
        </a-col>
        
        <a-col :span="6" style="text-align:right;">
          <a-button 
            type="text" 
            size="small" 
            @click.stop="addProduct(model)" 
            style="display:flex;align-items:center;gap:6px;padding:4px 8px;color:#3B63FB;font-size:13px;height:auto;border:none;"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.0026 5.33203V10.6654M10.6693 7.9987H5.33594" stroke="#3B63FB" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1.66406 8.0013C1.66406 5.01574 1.66406 3.52296 2.59156 2.59546C3.51906 1.66797 5.01184 1.66797 7.9974 1.66797C10.9829 1.66797 12.4757 1.66797 13.4033 2.59546C14.3307 3.52296 14.3307 5.01574 14.3307 8.0013C14.3307 10.9868 14.3307 12.4796 13.4033 13.4072C12.4757 14.3346 10.9829 14.3346 7.9974 14.3346C5.01184 14.3346 3.51906 14.3346 2.59156 13.4072C1.66406 12.4796 1.66406 10.9868 1.66406 8.0013Z" stroke="#3B63FB"/>
            </svg>
            Add Product
          </a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'models_3d_generate_history',
  
  // ✨ ADDED: data() with imageLoadedMap
  data() {
    return {
      imageLoadedMap: {}
    };
  },
  
  props: {
    list_history_generated_3d_models: Array,
    loading_generated_models_history: Boolean
  },
  
  methods: {
    getMainImage(model) {
      if (model.available_images && model.available_images.length > 0) {
        return model.available_images[0];
      }
      
      if (model.images) {
        for (let i = 0; i <= 3; i++) {
          const imageKey = `image_${i}`;
          if (model.images[imageKey] && model.images[imageKey] !== null) {
            return model.images[imageKey];
          }
        }
      }
      
      return '';
    },
    
    // ✨ ADDED: Image load handler
    onModelImageLoad(id) {
      this.imageLoadedMap[id] = false;
      setTimeout(() => {
        this.imageLoadedMap[id] = true;
      }, 3000); // 3 second shimmer display
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    
    addProduct(model) {
      this.$emit('add-product', model);
    }
  }
}
</script>

<style scoped>
.card-history {
    border-radius:10px;
    background-color: #fdfdfd;
    padding:5px;
    margin-bottom:10px;
    cursor: pointer;
}

.card-history:hover {
    border-radius:10px;
    background-color: #f3f2f2;
    padding:5px;
    margin-bottom:10px;
}

/* ✨ ADDED: Shimmer skeleton styles */
.model-thumbnail-skeleton {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: linear-gradient(110deg, #e5e7eb 8%, #f9fafb 18%, #e5e7eb 33%);
  background-size: 200% 100%;
  animation: model-shimmer 1.6s infinite linear;
}

@keyframes model-shimmer {
  to {
    background-position-x: -200%;
  }
}
</style>
