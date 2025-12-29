<template>
  <add_sunk_unsunk_light
    :LightType="light_type"
    :visible="sunk_unsunk_light_modal"
    @update:visible="cancelClicked"
    @product-created="product_created_sunk_unsunk_light"
  />
  <a-modal
    :open="visible"
    :closable="false"
    :footer="null"
    width="1000px"
    centered
    @cancel="handleCancel"
    :mask-closable="false"
    class="add-product-modal"
  >
  
    <!-- Custom Header -->
    <template #title>
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0;">
        <div style="display: flex; align-items: center;">
          <a-button type="text" @click="handleCancel" style="" size="small">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 20 20" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="#0F1729"/>
</svg>
            </template>
          </a-button>
          <span style="font-size: 18px; font-weight: 600; color: #1f2937;margin-left:10px">Add New Light</span>
        </div>
        <!-- <div style="display: flex; gap: 12px;">
          <a-button @click="handleCancel" style="border-radius: 6px;">Cancel</a-button>
          <a-button type="primary" @click="handleSave" :loading="isSaving" style="border-radius: 6px;">
            {{ isSaving ? 'Saving...' : 'Save' }}
          </a-button>
        </div> -->
      </div>
    </template>

    <div class="light-selection-container">
      <div class="header-section">
        <h2 class="selection-title">Choose Your Light Type</h2>
        <p class="selection-subtitle">Select the type of light fixture you want to add to your collection</p>
      </div>
      
      <div class="light-options-grid">
        <!-- Ceiling Hanging 3D Light -->
        <div class="light-option-card" @click="add3DLightProductClicked()">
          <div class="light-image-container">
            <div class="light-illustration ceiling-light">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <!-- Ceiling mount -->
                <rect x="45" y="10" width="30" height="8" rx="4" fill="#8B5CF6"/>
                <!-- Chain/cord -->
                <line x1="60" y1="18" x2="60" y2="35" stroke="#6B7280" stroke-width="2"/>
                <!-- Light fixture body -->
                <ellipse cx="60" cy="50" rx="25" ry="15" fill="#F59E0B"/>
                <ellipse cx="60" cy="48" rx="22" ry="12" fill="#FCD34D"/>
                <!-- Light rays -->
                <g opacity="0.6">
                  <line x1="60" y1="65" x2="60" y2="90" stroke="#FEF3C7" stroke-width="3"/>
                  <line x1="45" y1="75" x2="30" y2="95" stroke="#FEF3C7" stroke-width="2"/>
                  <line x1="75" y1="75" x2="90" y2="95" stroke="#FEF3C7" stroke-width="2"/>
                  <line x1="35" y1="65" x2="20" y2="75" stroke="#FEF3C7" stroke-width="2"/>
                  <line x1="85" y1="65" x2="100" y2="75" stroke="#FEF3C7" stroke-width="2"/>
                </g>
              </svg>
            </div>
            <div class="light-glow ceiling-glow"></div>
          </div>
          <div class="light-info">
            <h3 class="light-title">Ceiling Hanging 3D Light</h3>
            <p class="light-description">Perfect for dining rooms, living spaces, and ambient lighting</p>
            <div class="light-features">
              <span class="feature-tag">3D Design</span>
              <span class="feature-tag">Adjustable Height</span>
            </div>
          </div>
        </div>

        <!-- Sunk Magnetic Light -->
        <div class="light-option-card" @click="showModalSunkUnsunk('sunk')">
          <div class="light-image-container">
            <div class="light-illustration sunk-light">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <!-- Ceiling surface -->
                <rect x="0" y="40" width="120" height="8" fill="#E5E7EB"/>
                <!-- Recessed housing -->
                <ellipse cx="60" cy="44" rx="30" ry="6" fill="#9CA3AF"/>
                <!-- Light fixture (recessed) -->
                <ellipse cx="60" cy="46" rx="25" ry="5" fill="#374151"/>
                <ellipse cx="60" cy="45" rx="20" ry="4" fill="#6366F1"/>
                <!-- Light beam (downward) -->
                <g opacity="0.7">
                  <polygon points="45,48 75,48 85,90 35,90" fill="url(#sunkGradient)"/>
                </g>
                <!-- Magnetic indicators -->
                <circle cx="40" cy="35" r="3" fill="#EF4444"/>
                <circle cx="80" cy="35" r="3" fill="#EF4444"/>
                <defs>
                  <linearGradient id="sunkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#6366F1;stop-opacity:0.8"/>
                    <stop offset="100%" style="stop-color:#6366F1;stop-opacity:0.1"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="light-glow sunk-glow"></div>
          </div>
          <div class="light-info">
            <h3 class="light-title">Sunk Magnetic Light</h3>
            <p class="light-description">Flush-mounted lighting with magnetic installation system</p>
            <div class="light-features">
              <span class="feature-tag">Recessed</span>
              <span class="feature-tag">Magnetic Mount</span>
            </div>
          </div>
        </div>

        <!-- Unsunk Magnetic Light -->
    <div class="light-option-card relative overflow-hidden cursor-not-allowed" @click.prevent>
  <!-- Diagonal "Coming Soon" Banner -->
  <div class="absolute top-6 -right-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-12 py-1 rotate-45 z-20 shadow-lg">
    COMING SOON
  </div>
  
  <div class="light-image-container blur-[2px] opacity-70 pointer-events-none">
    <div class="light-illustration unsunk-light">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <!-- Ceiling surface -->
        <rect x="0" y="40" width="120" height="8" fill="#E5E7EB"/>
        <!-- Surface-mounted base -->
        <ellipse cx="60" cy="48" rx="28" ry="8" fill="#374151"/>
        <!-- Light fixture (surface mounted) -->
        <ellipse cx="60" cy="55" rx="22" ry="12" fill="#10B981"/>
        <ellipse cx="60" cy="53" rx="18" ry="10" fill="#34D399"/>
        <!-- Light beam (directional) -->
        <g opacity="0.7">
          <polygon points="42,65 78,65 85,95 35,95" fill="url(#unsunkGradient)"/>
        </g>
        <!-- Magnetic indicators -->
        <circle cx="35" cy="45" r="3" fill="#EF4444"/>
        <circle cx="85" cy="45" r="3" fill="#EF4444"/>
        <!-- Surface mount screws -->
        <circle cx="45" cy="42" r="1.5" fill="#6B7280"/>
        <circle cx="75" cy="42" r="1.5" fill="#6B7280"/>
        <defs>
          <linearGradient id="unsunkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#10B981;stop-opacity:0.8"/>
            <stop offset="100%" style="stop-color:#10B981;stop-opacity:0.1"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div class="light-glow unsunk-glow"></div>
  </div>
  
  <div class="light-info opacity-70">
    <h3 class="light-title">Unsunk Magnetic Light</h3>
    <p class="light-description">Surface-mounted lighting with easy magnetic attachment</p>
    <div class="light-features">
      <span class="feature-tag opacity-50">Surface Mount</span>
      <span class="feature-tag opacity-50">Easy Install</span>
    </div>
  </div>
</div>


      </div>
      
      <div class="help-section">
        <div class="help-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>Need help choosing? Each light type serves different purposes and installation methods.</span>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import add_sunk_unsunk_light from '@/views/access_engine/product/my_products/add_new_product/add_sunk_unsunk_light_modal.vue'
export default {
  name: "AddNewLight",
  components:{
    add_sunk_unsunk_light
  },
  props: {
    visible: { type: Boolean, default: false },
    categories_available: { type: Array, default: () => [] },
    types: { type: Array, default: () => [] }
  },
  emits: ['update:visible', 'product-created', 'cancel','add-3d-light'],
  data() {
    return {
      isSaving: false,
      light_type:'',
      sunk_unsunk_light_modal:false,
      productForm: {
        name: '',
        description: '',
        category_name: '',
        furniture_type: '',
        pricing: { price: '' },
        dimensions: { height: '', length: '', width: '' }
      },
      selectedImages: [],
      selectedColors: [],
      selectedTextures: []
    }
  },
  methods: {
    product_created_sunk_unsunk_light(){
      this.$emit('product-created',true);

    },
    add3DLightProductClicked(){
      this.$emit('add-3d-light',true);      
    },
    showModalSunkUnsunk(LightType){
      this.light_type=LightType
      this.sunk_unsunk_light_modal= !this.sunk_unsunk_light_modal
      this.$emit('cancel');
      // this.visible=false
    },
    cancelClicked(){
      this.light_type=''
      this.sunk_unsunk_light_modal= !this.sunk_unsunk_light_modal
      this.$emit('cancel');
      // this.visible=true
    },
    handleCancel() {
      this.$emit('cancel');
    },
    handleSave() {
      // Save logic here
    }
  }
}
</script>

<style scoped>
.add-product-modal :deep(.ant-modal-header) {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.add-product-modal :deep(.ant-modal-body) {
  padding: 24px;
}

.light-selection-container {
  padding: 0;
}

.header-section {
  text-align: center;
  margin-bottom: 32px;
}

.selection-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.selection-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.light-options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.light-option-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.light-option-card:hover {
  transform: translateY(-4px);
  border-color: #3b82f6;
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.1);
}

.light-option-card:hover .light-glow {
  opacity: 1;
}

.light-image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
  margin-bottom: 20px;
}

.light-illustration {
  position: relative;
  z-index: 2;
}

.light-glow {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.ceiling-glow {
  background: radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(245, 158, 11, 0) 70%);
}

.sunk-glow {
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%);
}

.unsunk-glow {
  background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%);
}

.light-info {
  text-align: center;
}

.light-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.light-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.light-features {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-tag {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.help-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

.help-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  color: #6b7280;
  font-size: 14px;
}

.help-card svg {
  flex-shrink: 0;
  color: #3b82f6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .light-options-grid {
    grid-template-columns: 1fr;
  }
  
  .selection-title {
    font-size: 20px;
  }
}

/* Animation for SVG elements */
.light-illustration svg {
  animation: gentle-pulse 2s ease-in-out infinite alternate;
}

@keyframes gentle-pulse {
  0% { opacity: 0.8; }
  100% { opacity: 1; }
}

.ceiling-light:hover svg {
  animation: ceiling-swing 1.5s ease-in-out infinite;
}

@keyframes ceiling-swing {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(2deg); }
}

.sunk-light:hover svg g,
.unsunk-light:hover svg g {
  animation: light-flicker 1s ease-in-out infinite;
}

@keyframes light-flicker {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.9; }
}
</style>