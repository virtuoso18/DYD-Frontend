<template>
  <div class="image-to-3d-container">
    <!-- Edit Image Modal -->
    <a-modal 
      v-model:open="openEditImage_modal" 
      width="60%" 
      :footer="null"
      :closable="false"
      centered
      class="edit-image-modal"
    >
    <template #title>
      <div class="" style="display: flex;justify-content: space-between;justify-content: space-between;">
        <span>Edit Photo</span>
         <div class="">
            <a-button @click="resetCanvas" type="default">
              Reset
            </a-button>
            <a-button @click="closeEditModal" style="margin: 0 8px;">
              Cancel
            </a-button>
            <a-button @click="saveEditedImage" type="primary">
              Save Changes
            </a-button>
          </div>
      </div>
    </template>
      <div class="edit-modal-content">
        <div class="canvas-container">
          <canvas
            ref="editCanvas"
            :width="canvasWidth"
            :height="canvasHeight"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
            @touchstart="startDrawing"
            @touchmove="draw"
            @touchend="stopDrawing"
          ></canvas>
        </div>
        
        <div class="edit-controls">
          <div class="brush-settings">
            <div class="setting-group">
              <label>Brush Size:</label>
              <a-slider
                v-model:value="brushSize"
                :min="5"
                :max="50"
                :step="5"
                style="width: 100px; margin: 0 10px;"
              />
              <span>{{ brushSize }}px</span>
            </div>
            
            <div class="setting-group">
              <label>Brush Type:</label>
              <a-radio-group v-model:value="brushMode" button-style="solid">
                <a-radio-button value="erase">Erase</a-radio-button>
                <a-radio-button value="restore">Restore</a-radio-button>
              </a-radio-group>
            </div>
          </div>
          
         
        </div>
      </div>
    </a-modal>

    <div>
      <!-- Header -->
      <div class="header">
        <span class="title">Image to 3d Object</span>
      </div>

      <!-- Multi-view Toggle -->
      <div class="multi-view-section">
        <span>Multi-view</span>
        <a-switch v-model:checked="multiView" :disabled="isProcessingBg" />
      </div>

      <!-- Single View Mode -->
      <div v-if="!multiView" class="single-view">
        <div 
          class="upload-area" 
          :class="{ 'has-image': mainImage, 'processing': isProcessingBg && mainImage }"
          @drop="handleDrop($event, 'main')"
          @dragover.prevent
          @dragenter.prevent
          @click="!isProcessingBg && triggerFileInput('main')"
        >
          <div v-if="!mainImage && !uploading.main" class="upload-placeholder">
            <div class="upload-icon">
              <PlusOutlined />
            </div>
            <div class="upload-text">
              <p>Click / Upload from camera / drag and drop</p>
              <small>Support format: png, jpeg</small>
            </div>
          </div>
          
          <div v-if="uploading.main" class="uploading">
            <a-spin />
            <p>Uploading...</p>
          </div>
          
          <div v-if="mainImage" class="image-preview">
            <img :src="mainImage" alt="Uploaded image" />
            
            <!-- Background removal loading overlay -->
            <div v-if="isProcessingBg" class="bg-processing-overlay">
              <a-spin />
              <p>Removing background...</p>
            </div>
            
            <div class="image-actions" v-if="!isProcessingBg">
              <a-button type="primary" shape="circle" @click.stop="editImage('main')">
                <template #icon>
                  <EditOutlined />
                </template>
              </a-button>
              <a-button type="primary" :danger="true" shape="circle" @click.stop="removeImage('main')">
                <template #icon>
                  <DeleteOutlined />
                </template>
              </a-button>
            </div>
          </div>
        </div>

        <!-- Remove Background Button -->
        <div v-if="mainImage" class="action-section">
          <a-button block @click="removeBackground" :loading="isProcessingBg" :disabled="isProcessingBg">
            <template #icon v-if="!isProcessingBg">
              <ScissorOutlined />
            </template>
            {{ isProcessingBg ? 'Removing Background...' : 'Remove Background' }}
          </a-button>
        </div>

        <!-- Add Texture Section -->
        <div class="texture-section">
          <p>Add Texture</p>
          <div class="texture-upload" @click="!isProcessingBg && triggerFileInput('texture')">
            <PlusOutlined />
          </div>
        </div>

        <!-- Upload More Images -->
        <div class="more-images-section">
          <p>Upload more images</p>
          <div class="more-images-upload" @click="triggerFileInput('more')">
            <CameraOutlined />
          </div>
        </div>
      </div>

      <!-- Multi View Mode -->
      <div v-else class="multi-view">
        <a-row :gutter="[8, 8]">
          <a-col :span="12" v-for="(view, index) in views" :key="index">
            <div 
              class="view-upload-area"
              :class="{ 'has-image': view.image, 'processing': isProcessingBg && view.image }"
              @drop="handleDrop($event, index)"
              @dragover.prevent
              @dragenter.prevent
              @click="!isProcessingBg && triggerFileInput(index)"
            >
              <div v-if="!view.image && !view.uploading" class="view-placeholder">
                <p>{{ view.label }}</p>
              </div>
              
              <div v-if="view.uploading" class="uploading">
                <a-spin size="small" />
                <small>Uploading...</small>
              </div>
              
              <div v-if="view.image" class="view-image">
                <img :src="view.image" :alt="view.label" />
                
                <!-- Background removal loading overlay -->
                <div v-if="isProcessingBg" class="bg-processing-overlay small">
                  <a-spin size="small" />
                  <small>Removing...</small>
                </div>
                
                <div class="view-actions" v-if="!isProcessingBg">
                  <a-button type="primary" size="medium" shape="circle" @click.stop="editImage(index)">
                    <template #icon>
                      <EditOutlined />
                    </template>
                  </a-button>
                  <a-button type="primary" :danger="true" shape="circle" @click.stop="removeImage(index)">
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                  </a-button>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>

        <!-- Remove Background Button for Multi-view -->
        <div v-if="hasAnyImage" class="action-section">
          <a-button block @click="removeBackground" :loading="isProcessingBg" :disabled="isProcessingBg">
            <template #icon v-if="!isProcessingBg">
              <ScissorOutlined />
            </template>
            {{ isProcessingBg ? 'Removing Background...' : 'Remove Background' }}
          </a-button>
        </div>

        <!-- Add Texture Section -->
        <div class="texture-section">
          <p>Add Texture</p>
          <div class="texture-upload" @click="!isProcessingBg && triggerFileInput('texture')">
            <PlusOutlined />
          </div>
        </div>
      </div>
    </div>

    <div>
      <!-- Credit Display -->
      <div class="credits">
        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.5013 1.91602C4.58918 1.91602 1.41797 5.08722 1.41797 8.99935C1.41797 12.9115 4.58918 16.0827 8.5013 16.0827C12.4134 16.0827 15.5846 12.9115 15.5846 8.99935C15.5846 5.08722 12.4134 1.91602 8.5013 1.91602ZM8.5013 2.62435C8.5013 4.3151 7.82965 5.93661 6.63411 7.13215C5.43856 8.3277 3.81706 8.99935 2.1263 8.99935C3.81706 8.99935 5.43856 9.671 6.63411 10.8665C7.82965 12.0621 8.5013 13.6836 8.5013 15.3743C8.5013 13.6836 9.17295 12.0621 10.3685 10.8665C11.564 9.671 13.1855 8.99935 14.8763 8.99935C13.1855 8.99935 11.564 8.3277 10.3685 7.13215C9.17295 5.93661 8.5013 4.3151 8.5013 2.62435Z" fill="#3B63FB"/>
        </svg>
        <span>{{ credits }}</span>
      </div>

      <!-- Generate Button -->
      <div class="generate-section">
        <a-button 
          type="primary" 
          block 
          size="large" 
          @click="generateObject"
          :loading="isGenerating"
          :disabled="isProcessingBg || isGenerating"
        >
          <template #icon v-if="!isGenerating">
            <ThunderboltOutlined />
          </template>
          {{ isGenerating ? 'Generating...' : 'Generate' }}
        </a-button>
      </div>
    </div>

    <!-- Hidden File Inputs -->
    <input
      ref="fileInput-main"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleFileSelect($event, 'main')"
    />
    <input
      ref="fileInput-texture"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleFileSelect($event, 'texture')"
    />
    <input
      ref="fileInput-more"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleFileSelect($event, 'more')"
    />
    <input
      ref="fileInput-0"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleFileSelect($event, 0)"
    />
    <input
      ref="fileInput-1"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleFileSelect($event, 1)"
    />
    <input
      ref="fileInput-2"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleFileSelect($event, 2)"
    />
    <input
      ref="fileInput-3"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleFileSelect($event, 3)"
    />
    <input
      ref="fileInput-extra-0"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleFileSelect($event, 'extra-0')"
    />
    <input
      ref="fileInput-extra-1"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleFileSelect($event, 'extra-1')"
    />
  </div>
</template>

<script>
import {
  LeftOutlined,
  DownloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ScissorOutlined,
  CameraOutlined,
  CreditCardOutlined,
  ThunderboltOutlined
} from '@ant-design/icons-vue'

export default {
  name: "sidepanel_3d_tab",
  components: {
    LeftOutlined,
    DownloadOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ScissorOutlined,
    CameraOutlined,
    CreditCardOutlined,
    ThunderboltOutlined
  },
  data() {
    return {
      openEditImage_modal: false,
      multiView: false,
      mainImage: null,
      credits: 10,
      isProcessingBg: false,
      isGenerating: false,
      uploading: {
        main: false
      },
      views: [
        { label: 'Front side', image: null, uploading: false },
        { label: 'Back side', image: null, uploading: false },
        { label: 'Left side', image: null, uploading: false },
        { label: 'Right side', image: null, uploading: false }
      ],
      extraViews: [
        { label: 'Front side', image: null, uploading: false },
        { label: 'Back side', image: null, uploading: false }
      ],
      // Edit modal data
      currentEditingKey: null,
      currentEditingImage: null,
      originalImageData: null,
      canvasWidth: 800,
      canvasHeight: 600,
      isDrawing: false,
      brushSize: 20,
      brushMode: 'erase', // 'erase' or 'restore'
      canvas: null,
      ctx: null
    }
  },
  computed: {
    hasAnyImage() {
      return this.views.some(view => view.image) || this.extraViews.some(view => view.image)
    }
  },
  methods: {
    goBack() {
      this.$emit('back')
    },
    
    editImage(key) {
      this.currentEditingKey = key
      
      // Get the current image based on key
      let imageData = null
      if (key === 'main') {
        imageData = this.mainImage
      } else if (typeof key === 'number') {
        imageData = this.views[key].image
      }
      
      if (!imageData) {
        this.$message.warning('No image to edit')
        return
      }
      
      this.currentEditingImage = imageData
      this.openEditImage_modal = true
      
      // Wait for modal to be rendered, then setup canvas
      this.$nextTick(() => {
        this.setupCanvas()
      })
    },
    
    setupCanvas() {
      const canvas = this.$refs.editCanvas
      if (!canvas) return
      
      this.canvas = canvas
      this.ctx = canvas.getContext('2d')
      
      // Create image object
      const img = new Image()
      img.onload = () => {
        // Calculate canvas dimensions to maintain aspect ratio
        const maxWidth = 800
        const maxHeight = 600
        
        let { width, height } = img
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
        
        this.canvasWidth = width
        this.canvasHeight = height
        
        // Wait for canvas size to update
        this.$nextTick(() => {
          this.canvas.width = width
          this.canvas.height = height
          
          // Draw image on canvas
          this.ctx.drawImage(img, 0, 0, width, height)
          
          // Store original image data for restore functionality
          this.originalImageData = this.ctx.getImageData(0, 0, width, height)
        })
      }
      
      img.src = this.currentEditingImage
    },
    
    getMousePos(e) {
      const rect = this.canvas.getBoundingClientRect()
      const scaleX = this.canvas.width / rect.width
      const scaleY = this.canvas.height / rect.height
      
      let clientX, clientY
      
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }
      
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      }
    },
    
    startDrawing(e) {
      e.preventDefault()
      this.isDrawing = true
      this.draw(e)
    },
    
    draw(e) {
      if (!this.isDrawing || !this.ctx) return
      
      e.preventDefault()
      const pos = this.getMousePos(e)
      
      this.ctx.save()
      
      if (this.brushMode === 'erase') {
        // Erase mode - set composite operation to destination-out
        this.ctx.globalCompositeOperation = 'destination-out'
        this.ctx.fillStyle = 'rgba(0,0,0,1)'
      } else {
        // Restore mode - copy from original image
        this.ctx.globalCompositeOperation = 'source-over'
        
        // Get circular area from original image
        const imageData = this.ctx.createImageData(this.brushSize * 2, this.brushSize * 2)
        const originalData = this.originalImageData.data
        const canvasWidth = this.originalImageData.width
        
        for (let dy = -this.brushSize; dy < this.brushSize; dy++) {
          for (let dx = -this.brushSize; dx < this.brushSize; dx++) {
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance <= this.brushSize) {
              const srcX = Math.floor(pos.x + dx)
              const srcY = Math.floor(pos.y + dy)
              
              if (srcX >= 0 && srcX < canvasWidth && srcY >= 0 && srcY < this.originalImageData.height) {
                const srcIndex = (srcY * canvasWidth + srcX) * 4
                const destX = dx + this.brushSize
                const destY = dy + this.brushSize
                const destIndex = (destY * (this.brushSize * 2) + destX) * 4
                
                imageData.data[destIndex] = originalData[srcIndex]     // R
                imageData.data[destIndex + 1] = originalData[srcIndex + 1] // G
                imageData.data[destIndex + 2] = originalData[srcIndex + 2] // B
                imageData.data[destIndex + 3] = originalData[srcIndex + 3] // A
              }
            }
          }
        }
        
        // Create temporary canvas for the brush
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = this.brushSize * 2
        tempCanvas.height = this.brushSize * 2
        const tempCtx = tempCanvas.getContext('2d')
        tempCtx.putImageData(imageData, 0, 0)
        
        // Draw the restored area
        this.ctx.drawImage(tempCanvas, pos.x - this.brushSize, pos.y - this.brushSize)
        this.ctx.restore()
        return
      }
      
      // Draw brush stroke
      this.ctx.beginPath()
      this.ctx.arc(pos.x, pos.y, this.brushSize, 0, 2 * Math.PI)
      this.ctx.fill()
      
      this.ctx.restore()
    },
    
    stopDrawing(e) {
      if (e) e.preventDefault()
      this.isDrawing = false
    },
    
    resetCanvas() {
      if (!this.ctx || !this.originalImageData) return
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.putImageData(this.originalImageData, 0, 0)
    },
    
    saveEditedImage() {
      if (!this.canvas) return
      
      // Convert canvas to data URL
      const editedImageData = this.canvas.toDataURL('image/png')
      
      // Update the appropriate image
      if (this.currentEditingKey === 'main') {
        this.mainImage = editedImageData
      } else if (typeof this.currentEditingKey === 'number') {
        this.views[this.currentEditingKey].image = editedImageData
        this.$forceUpdate()
      }
      
      this.closeEditModal()
      this.$message.success('Image edited successfully!')
    },
    
    closeEditModal() {
      this.openEditImage_modal = false
      this.currentEditingKey = null
      this.currentEditingImage = null
      this.originalImageData = null
      this.isDrawing = false
    },
    
    triggerFileInput(key) {
      const refName = `fileInput-${key}`
      const input = this.$refs[refName]
      if (input) {
        input.click()
      } else {
        console.error(`File input not found for key: ${key}`)
      }
    },

    handleFileSelect(event, key) {
      const file = event.target.files[0]
      if (file) {
        this.uploadFile(file, key)
      }
    },

    handleDrop(event, key) {
      event.preventDefault()
      const file = event.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        this.uploadFile(file, key)
      }
    },

    uploadFile(file, key) {
      console.log('Uploading file for key:', key)
      
      // Set uploading state
      if (key === 'main') {
        this.uploading.main = true
      } else if (typeof key === 'number') {
        this.views[key].uploading = true
      } else if (key.toString().startsWith('extra-')) {
        const index = parseInt(key.toString().split('-')[1])
        this.extraViews[index].uploading = true
      }

      // Simulate upload with FileReader
      const reader = new FileReader()
      reader.onload = (e) => {
        setTimeout(() => {
          if (key === 'main') {
            this.mainImage = e.target.result
            this.uploading.main = false
          } else if (typeof key === 'number') {
            this.views[key].image = e.target.result
            this.views[key].uploading = false
            this.$forceUpdate()
          } else if (key.toString().startsWith('extra-')) {
            const index = parseInt(key.toString().split('-')[1])
            this.extraViews[index].image = e.target.result
            this.extraViews[index].uploading = false
            this.$forceUpdate()
          }
          console.log('Upload completed for key:', key)
        }, 1000)
      }
      reader.readAsDataURL(file)
    },

    removeImage(key) {
      if (key === 'main') {
        this.mainImage = null
      } else if (typeof key === 'number') {
        this.views[key].image = null
      } else if (key.toString().startsWith('extra-')) {
        const index = parseInt(key.toString().split('-')[1])
        this.extraViews[index].image = null
      }
    },

    async removeBackground() {
      console.log('Remove background')
      
      this.isProcessingBg = true
      
      try {
        const imagesToUpload = []
        
        if (!this.multiView && this.mainImage) {
          imagesToUpload.push({ type: 'main', data: this.mainImage })
        }
        
        if (this.multiView) {
          this.views.forEach((view, index) => {
            if (view.image) {
              imagesToUpload.push({ type: `view-${index}`, data: view.image })
            }
          })
          
          this.extraViews.forEach((view, index) => {
            if (view.image) {
              imagesToUpload.push({ type: `extra-view-${index}`, data: view.image })
            }
          })
        }

        if (imagesToUpload.length === 0) {
          this.$message.warning('Please upload at least one image')
          return
        }
        
        const payload = {
          images: imagesToUpload,
          multiView: this.multiView,
          credits: this.credits
        }

        const response = await fetch(this.$store.state.root_api + 'engine/remove-images-bg/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          const result = await response.json()
          console.log(result)
          
          if (!result.error && result.data && result.data.images) {
            result.data.images.forEach(processedImage => {
              if (processedImage.data_removed_bg) {
                if (!this.multiView && processedImage.type === 'main') {
                  this.mainImage = processedImage.data_removed_bg
                }
                
                if (this.multiView) {
                  if (processedImage.type.startsWith('view-')) {
                    const viewIndex = parseInt(processedImage.type.split('-')[1])
                    if (this.views[viewIndex]) {
                      this.views[viewIndex].image = processedImage.data_removed_bg
                    }
                  }
                  
                  if (processedImage.type.startsWith('extra-view-')) {
                    const extraIndex = parseInt(processedImage.type.split('-')[2])
                    if (this.extraViews[extraIndex]) {
                      this.extraViews[extraIndex].image = processedImage.data_removed_bg
                    }
                  }
                }
              }
            })
            
            if (result.data.credits !== undefined) {
              this.credits = result.data.credits
            }
            
            this.$forceUpdate()
            this.$message.success('Background removed successfully!')
          } else {
            throw new Error(result.msg || 'Failed to process images')
          }
        } else {
          const errorData = await response.json()
          throw new Error(errorData.msg || 'Background removal failed')
        }
      } catch (error) {
        console.error('Background removal error:', error)
        this.$message.error(error.message || 'Failed to remove background')
      } finally {
        this.isProcessingBg = false
      }
    },

    async generateObject() {
      this.isGenerating = true
      this.$emit('processing-generate', true)
      
      try {
        const imagesToUpload = []
        
        if (!this.multiView && this.mainImage) {
          imagesToUpload.push({ type: 'main', data: this.mainImage })
        }
        
        if (this.multiView) {
          this.views.forEach((view, index) => {
            if (view.image) {
              imagesToUpload.push({ type: `view-${index}`, data: view.image })
            }
          })
          
          this.extraViews.forEach((view, index) => {
            if (view.image) {
              imagesToUpload.push({ type: `extra-view-${index}`, data: view.image })
            }
          })
        }

        if (imagesToUpload.length === 0) {
          this.$message.warning('Please upload at least one image')
          return
        }

        const payload = {
          images: imagesToUpload,
          multiView: this.multiView,
          credits: this.credits,
          room_id: this.$route.params.id
        }

        console.log(payload)
        let response = null

        if (this.multiView) {
          response = await fetch(this.$store.state.root_api + 'engine/hy-2.0-mv-3D-gen/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
        } else {
          response = await fetch(this.$store.state.root_api + 'engine/hy-2.0-sv-3D-gen/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
        }
        
        if (response.ok) {
          const result = await response.json()
          console.log(result)
          this.$message.success('3D object generated successfully!')
          this.$emit('generated', result)
        } else {
          throw new Error('Generation failed')
        }
      } catch (error) {
        console.error('Generation error:', error)
        this.$message.error('Failed to generate 3D object')
      } finally {
        this.isGenerating = false
        this.$emit('processing-generate', false)
      }
    }
  }
}
</script>

<style scoped>
.image-to-3d-container {
  padding: 16px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  margin: 0 auto;
}

/* Edit Modal Styles */
.edit-image-modal .ant-modal-body {
  padding: 20px;
}

.edit-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.canvas-container {
  border: 2px solid #d9d9d9;
  border-radius: 8px;
  padding: 10px;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  overflow: auto;
}

.canvas-container canvas {
  cursor: crosshair;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-width: 100%;
  height: auto;
  max-height:400px
}

.edit-controls {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  
  /* max-width: 600px; */
}

.brush-settings {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin:auto;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.setting-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-group label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.edit-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  font-weight: 500;
  font-size: 16px;
}

.multi-view-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #d9d9d9;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
  position: relative;
  margin-bottom: 16px;
}

.upload-area:hover {
  border-color: #1890ff;
}

.upload-area.has-image {
  border-color: #1890ff;
  padding: 0;
}

.upload-area.processing {
  cursor: not-allowed;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  width: 60px;
  height: 60px;
  background: #ff4d4f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
  font-size: 24px;
}

.upload-text p {
  margin: 0 0 8px;
  font-size: 14px;
}

.upload-text small {
  color: #8c8c8c;
}

.uploading {
  text-align: center;
}

.uploading p {
  margin: 8px 0 0;
}

.image-preview {
  width: 100%;
  height: 100%;
  max-height: 190px;
  margin: auto;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  max-height: 190px;
  object-fit: contain;
}

.image-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}

.bg-processing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 10;
}

.bg-processing-overlay p {
  margin: 8px 0 0;
  font-size: 14px;
}

.bg-processing-overlay.small {
  font-size: 12px;
}

.bg-processing-overlay.small small {
  margin: 4px 0 0;
  font-size: 10px;
}

.action-section {
  margin: 16px 0;
}

.texture-section, .more-images-section {
  margin: 5px 0;
}

.texture-section p, .more-images-section p {
  margin-bottom: 8px;
  font-size: 14px;
}

.texture-upload, .more-images-upload {
  width: 40px;
  height: 40px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #8c8c8c;
}

.texture-upload:hover, .more-images-upload:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.view-upload-area {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
  position: relative;
}

.view-upload-area:hover {
  border-color: #1890ff;
}

.view-upload-area.has-image {
  border-color: #1890ff;
  padding: 0;
}

.view-upload-area.processing {
  cursor: not-allowed;
}

.view-placeholder {
  text-align: center;
}

.view-placeholder p {
  margin: 0;
  font-size: 12px;
  color: #8c8c8c;
}

.view-image {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.view-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.view-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 2px;
}

.add-more-section {
  margin: 20px 0;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.add-more-section p {
  margin-bottom: 12px;
  font-size: 14px;
  color: #1890ff;
}

.credits {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 10px 0;
  color: #1890ff;
}

.generate-section {
  margin-top: 20px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .edit-modal-content {
    gap: 15px;
  }
  
  .brush-settings {
    flex-direction: column;
    gap: 15px;
  }
  
  .setting-group {
    flex-direction: column;
    text-align: center;
  }
  
  .canvas-container {
    padding: 5px;
  }
  
  .edit-actions {
    flex-direction: column;
  }
}
</style>