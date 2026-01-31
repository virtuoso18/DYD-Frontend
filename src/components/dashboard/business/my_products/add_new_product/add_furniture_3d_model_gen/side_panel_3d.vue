<template>
  <!-- TEXTURE MODAL -->
  <a-modal
    v-model:open="openTextureModal"
    width="60%"
    style="max-width: 500px"
    title="Apply Texture"
    :footer="null"
    centered
  >
    <div style="display: flex; flex-direction: column; gap: 16px">
      <!-- Upload Area -->
      <div
        style="
          border: 2px dashed #d9d9d9;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        "
        :style="
          textureImage ? { borderColor: '#1890ff', background: '#f0f8ff' } : {}
        "
        @click="triggerTextureFileInput()"
      >
        <!-- No texture selected -->
        <div v-if="!textureImage">
          <PlusOutlined
            style="
              font-size: 30px;
              color: #1890ff;
              margin-bottom: 8px;
              display: block;
            "
          />
          <p style="margin: 8px 0; font-weight: 500">
            Click to select texture image
          </p>
          <small style="color: #999">PNG, JPG formats supported</small>
        </div>

        <!-- Texture preview -->
        <div
          v-else
          style="position: relative; display: flex; justify-content: center"
        >
          <div>
            <img
              :src="textureImage"
              alt="Texture preview"
              style="max-width: 100%; max-height: 150px; border-radius: 4px"
            />
            <p style="margin: 8px 0; color: #666">Texture Selected ✓</p>
          </div>
        </div>
      </div>

      <!-- Remove button -->
      <div v-if="textureImage" style="text-align: center">
        <a-button danger @click="removeSelectedTexture()">
          Change Texture
        </a-button>
      </div>

      <!-- Apply & Cancel buttons -->
      <div style="display: flex; gap: 8px">
        <a-button block @click="closeTextureModal()"> Cancel </a-button>
        <a-button
          type="primary"
          block
          @click="applyTextureToImage()"
          :disabled="!textureImage"
          :loading="isApplyingTexture"
        >
          <!-- <div style="display: flex;justify-content: center;align-items: center;gap:10px;"> -->
          Apply Texture
          <!-- <span style="display: flex;justify-content: center;align-items: center;"> -->
          (⚡20 )
          <!-- </span> -->
          <!-- </div> -->
        </a-button>
      </div>
    </div>
  </a-modal>
  <!-- Multi-View Queue Modal -->
  <a-modal
    v-model:open="openMultiViewQueueModal"
    width="80%"
    :footer="null"
    :closable="true"
    centered
    title="Add Multi-View Item to Queue"
    class="multiview-queue-modal"
  >
    <div class="multiview-queue-content">
      <!-- Multi-View Images Grid -->
      <div class="multiview-queue-grid">
        <a-row :gutter="[16, 16]">
          <a-col
            :span="12"
            v-for="(view, index) in multiViewQueueImages"
            :key="index"
          >
            <div
              class="multiview-queue-upload-area"
              :class="{
                'has-image': view.image,
                processing: multiViewQueueProcessingBg && view.image,
                required: view.required && !view.image,
              }"
              @click="
                !multiViewQueueProcessingBg && triggerMultiViewQueueInput(index)
              "
            >
              <div
                v-if="!view.image && !view.uploading"
                class="multiview-queue-placeholder"
              >
                <div class="view-label">
                  {{ view.label }}
                  <span v-if="view.required" class="required-indicator">*</span>
                </div>
                <PlusOutlined />
              </div>

              <div v-if="view.uploading" class="uploading">
                <a-spin size="small" />
                <small>Uploading...</small>
              </div>

              <div v-if="view.image" class="multiview-queue-image">
                <img :src="view.image" :alt="view.label" />

                <!-- Background removal loading overlay -->
                <div
                  v-if="multiViewQueueProcessingBg"
                  class="bg-processing-overlay small"
                >
                  <a-spin size="small" />
                  <small>Processing...</small>
                </div>

                <div
                  class="multiview-queue-actions"
                  v-if="!multiViewQueueProcessingBg"
                >
                  <a-button
                    type="primary"
                    size="small"
                    shape="circle"
                    @click.stop="editMultiViewQueueImage(index)"
                  >
                    <template #icon>
                      <EditOutlined />
                    </template>
                  </a-button>
                  <a-button
                    type="primary"
                    :danger="true"
                    size="small"
                    shape="circle"
                    @click.stop="removeMultiViewQueueImage(index)"
                  >
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                  </a-button>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>

      <!-- Image Count Info -->
      <div class="multiview-queue-info">
        <a-alert
          :message="`${multiViewQueueImageCount} image(s) uploaded. Front view is required.`"
          :type="hasValidMultiViewQueue ? 'success' : 'warning'"
          show-icon
        />
      </div>

      <!-- Remove Background Button -->
      <div
        v-if="multiViewQueueImageCount > 0"
        class="multiview-queue-bg-section"
      >
        <a-button
          block
          @click="removeMultiViewQueueBackground"
          :loading="multiViewQueueProcessingBg"
          :disabled="multiViewQueueProcessingBg"
        >
          <template #icon v-if="!multiViewQueueProcessingBg">
            <ScissorOutlined />
          </template>
          {{
            multiViewQueueProcessingBg
              ? "Removing Background..."
              : "Remove Background from All Images"
          }}
        </a-button>
      </div>

      <!-- Action Buttons -->
      <div class="multiview-queue-modal-actions">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-button block @click="closeMultiViewQueueModal">
              Cancel
            </a-button>
          </a-col>
          <a-col :span="12">
            <a-button
              type="primary"
              block
              @click="addMultiViewToQueue"
              :disabled="!hasValidMultiViewQueue"
            >
              Add to Queue
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </a-modal>

  <!-- Queue Status Modal -->
  <a-modal
    v-model:open="openQueueModal"
    width="80%"
    :footer="null"
    :closable="true"
    centered
    title="Render Queue Status"
    class="queue-modal"
  >
    <div class="queue-content">
      <div class="queue-header">
        <a-row>
          <a-col :xs="24" :sm="12" :md="8" :lg="8">
            <a-statistic title="Total Items" :value="queueItemsCount" />
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="8">
            <a-statistic
              title="Processing"
              :value="processingQueueItems.length"
            />
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="8">
            <a-statistic title="Pending" :value="pendingQueueItems.length" />
          </a-col>
          <!-- <a-col :span="6">
           <a-button type="primary" @click="showAddToQueueModal" :disabled="!canAddToQueue">
            Add to Queue
          </a-button> 
        </a-col> -->
        </a-row>
      </div>

      <div class="queue-list">
        <a-row :gutter="[16, 16]">
          <a-col
            v-for="item in queueItems"
            :key="item.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
          >
            <!-- border: 1px solid rgba(0,0,0,0.1); -->
            <!-- box-shadow: 0 2px 8px rgba(0,0,0,0.06); -->
            <div
              style="
                transition: all 0.3s ease;
                height: 100%;
                display: flex;
                flex-direction: column;
              "
            >
              <!-- @mouseenter="$event.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; $event.currentTarget.style.transform = 'translateY(-2px)';"
    @mouseleave="$event.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; $event.currentTarget.style.transform = 'translateY(0)';" -->
              <!-- Image and Status Section -->
              <a-row
                :gutter="[16, 8]"
                style="
                  padding: 12px;
                  background: #f3f2f3;
                  border-radius: 10px;
                  margin: 0;
                "
              >
                <!-- Image Column (Full width on mobile, half on desktop) -->
                <a-col
                  :xs="24"
                  :sm="24"
                  :md="12"
                  :lg="12"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <div style="text-align: center">
                    <img
                      :src="item.images_preview[0]"
                      alt="Preview"
                      style="
                        max-width: 100px;
                        max-height: 100px;
                        border-radius: 8px;
                        object-fit: cover;
                        margin-bottom: 8px;
                      "
                    />
                    <div>
                      <a-tag
                        :color="getQueueStatusColor(item.status)"
                        style="margin: 0"
                      >
                        {{ getQueueStatusText(item.status) }}
                      </a-tag>
                    </div>
                  </div>
                </a-col>

                <!-- Content Column (Full width on mobile, half on desktop) -->
                <a-col :xs="24" :sm="24" :md="12" :lg="12">
                  <div style="flex: 1">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #999">
                      <strong>Created:</strong>
                      {{ formatQueueTime(item.created_at) }}
                    </p>
                    <p
                      v-if="item.started_at"
                      style="margin: 0 0 8px 0; font-size: 12px; color: #999"
                    >
                      <strong>Started:</strong>
                      {{ formatQueueTime(item.started_at) }}
                    </p>
                    <p
                      v-if="item.completed_at"
                      style="margin: 0 0 8px 0; font-size: 12px; color: #999"
                    >
                      <strong>Completed:</strong>
                      {{ formatQueueTime(item.completed_at) }}
                    </p>
                    <p
                      v-if="item.error_message"
                      style="margin: 0 0 8px 0; font-size: 12px; color: #ff4d4f"
                    >
                      <!-- {{ item.error_message }} -->
                      🔴 Failed (Error)
                    </p>
                  </div>
                  <div
                    style="
                      padding: 12px;
                      display: flex;
                      gap: 8px;
                      flex-direction: column;
                    "
                  >
                    <a-button
                      v-if="item.status === 'pending'"
                      type="primary"
                      danger
                      block
                      size="small"
                      @click="removeFromQueue(item.id)"
                    >
                      Remove
                    </a-button>
                    <a-button
                      v-if="
                        item.status === 'completed' && item.generated_model_id
                      "
                      type="primary"
                      block
                      size="small"
                      @click="view_result(item.generated_model_id)"
                    >
                      View Result
                    </a-button>
                  </div>
                </a-col>
              </a-row>

              <!-- Buttons Section -->
            </div>
          </a-col>
        </a-row>

        <!-- <a-list :data-source="queueItems" item-layout="horizontal">
        <template #renderItem="{ item }">
          
          <a-list-item>
            <template #actions>
              <a-button 
                v-if="item.status === 'pending'" 
                type="link" 
                danger 
                @click="removeFromQueue(item.id)"
              >
                Remove
              </a-button>
              <a-button 
                v-if="item.status === 'completed' && item.generated_model_id" 
                type="link"
            @click="view_result(item.generated_model_id)"
                
              >
                View Result
              </a-button>
            </template>
            
            <a-list-item-meta>
              <template #title>
                <div class="queue-item-title">
                  <a-tag :color="getQueueStatusColor(item.status)">
                    {{ getQueueStatusText(item.status) }}
                  </a-tag>
                  <span>Position: {{ item.queue_position }}</span>
                  <span style="margin-left: 16px;">{{ item.model_mode }}</span>
                </div>
              </template>
              <template #description>
                <div style="display:flex;gap:20px;">

                  <div>
                    
                   
                    <img 
                    :src="item.images_preview[0]" 
                    alt="Preview" 
                    style="max-width: 100px; max-height: 100px;" 
                    />

                  </div>
                  <div>
                  <p style="margin:0">Created: {{ formatQueueTime(item.created_at) }}</p>
                  <p v-if="item.started_at" style="margin:0">Started: {{ formatQueueTime(item.started_at) }}</p>
                  <p v-if="item.completed_at" style="margin:0">Completed: {{ formatQueueTime(item.completed_at) }}</p>
                  <p v-if="item.error_message"  style="margin:0"class="error-msg">Error: {{ item.error_message }}</p>
                </div>
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list> -->

        <div v-if="queueItems.length === 0" class="empty-queue">
          <a-empty description="No items in queue" />
        </div>
      </div>
    </div>
  </a-modal>

  <a-modal
    v-model:open="openAddToQueueModal"
    width="60%"
    :footer="null"
    :closable="true"
    centered
    title="Add Item to Render Queue"
    class="add-queue-modal"
  >
    <div class="add-queue-content">
      <!-- Image Upload Section -->
      <div class="queue-upload-section">
        <div
          class="queue-upload-area"
          :class="{
            'has-image': queueImageUpload,
            processing: queueImageProcessingBg,
          }"
          @click="!queueImageProcessingBg && triggerQueueImageInput()"
        >
          <div
            v-if="!queueImageUpload && !queueImageUploading"
            class="upload-placeholder"
          >
            <div class="upload-icon">
              <PlusOutlined />
            </div>
            <div class="upload-text">
              <p>Click to upload image for 3D generation</p>
              <small>Support format: png, jpeg</small>
            </div>
          </div>

          <div v-if="queueImageUploading" class="uploading">
            <a-spin />
            <p>Uploading...</p>
          </div>

          <div v-if="queueImageUpload" class="image-preview">
            <img :src="queueImageUpload" alt="Queue image" />

            <!-- Background removal loading overlay -->
            <div v-if="queueImageProcessingBg" class="bg-processing-overlay">
              <a-spin />
              <p>Removing background...</p>
            </div>

            <div class="image-actions" v-if="!queueImageProcessingBg">
              <a-button
                type="primary"
                shape="circle"
                @click.stop="editQueueImage()"
              >
                <template #icon>
                  <EditOutlined />
                </template>
              </a-button>
              <a-button
                type="primary"
                :danger="true"
                shape="circle"
                @click.stop="queueImageUpload = null"
              >
                <template #icon>
                  <DeleteOutlined />
                </template>
              </a-button>
            </div>
          </div>
        </div>

        <!-- Remove Background Button -->
        <div v-if="queueImageUpload" class="queue-action-section">
          <a-button
            block
            @click="removeQueueImageBackground"
            :loading="queueImageProcessingBg"
            :disabled="queueImageProcessingBg"
          >
            <template #icon v-if="!queueImageProcessingBg">
              <ScissorOutlined />
            </template>
            {{
              queueImageProcessingBg
                ? "Removing Background..."
                : "Remove Background"
            }}
          </a-button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="queue-modal-actions">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-button block @click="closeAddToQueueModal"> Cancel </a-button>
          </a-col>
          <a-col :span="12">
            <a-button
              type="primary"
              block
              @click="addToQueue"
              :disabled="!queueImageUpload"
            >
              Add to Queue
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </a-modal>

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
        <div
          class=""
          style="
            display: flex;
            justify-content: space-between;
            justify-content: space-between;
          "
        >
          <span>Edit Photo</span>
          <div class="">
            <a-button @click="resetCanvas" type="default"> Reset </a-button>
            <a-button @click="closeEditModal" style="margin: 0 8px">
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
                style="width: 100px; margin: 0 10px"
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
        <a-button
          @click="$router.back()"
          type="text"
          style="padding: 4px; margin-right: 16px"
          size="small"
        >
          <template #icon>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </template>
        </a-button>

        <span class="title">Add New Product</span>
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
          :class="{
            'has-image': mainImage,
            processing: isProcessingBg && mainImage,
          }"
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
              <a-button
                type="primary"
                shape="circle"
                @click.stop="editImage('main')"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <template #icon> </template>
                <EditOutlined />
              </a-button>
              <a-button
                type="primary"
                :danger="true"
                shape="circle"
                @click.stop="removeImage('main')"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <template #icon> </template>
                <DeleteOutlined />
              </a-button>
            </div>
          </div>
        </div>

        <!-- Remove Background Button -->
        <div v-if="mainImage" class="action-section">
          <a-button
            block
            @click="removeBackground"
            :loading="isProcessingBg"
            :disabled="isProcessingBg"
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 10px;
            "
          >
            <ScissorOutlined v-if="!isProcessingBg" />
            {{
              isProcessingBg ? "Removing Background..." : "Remove Background"
            }}
          </a-button>
        </div>

        <!-- Add Texture Section - UPDATED UI -->
        <div class="texture-section">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
            "
          >
            <p style="margin: 0; font-weight: 500">
              Textures ({{ textures_available.length }})
            </p>
            <a-button
              type="primary"
              size="small"
              @click="openTexturModal()"
              :disabled="!mainImage"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <template #icon> </template>
              <PlusOutlined />
              Add Texture
            </a-button>
          </div>

          <!-- Texture Grid -->
          <div>
            <div className="flex !flex-row flex-wrap gap-8 gap-y-2">
              <a-col
                v-if="textures_available.length > 0"
                span="4"
                v-for="(texture, index) in textures_available"
                :key="index"
              >
                <div
                  style="
                    position: relative;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 2px solid #e8e8e8;
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-left: 5px;
                    width: 80px;

                    height: 80px;
                    aspect-ratio: 1;
                  "
                  :style="
                    texture.is_active
                      ? {
                          borderColor: '#52c41a',
                          boxShadow: '0 0 0 2px #f6ffed',
                        }
                      : {}
                  "
                  @click="activateTexture(index)"
                >
                  <!-- Texture Image -->
                  <img
                    :src="texture.main_image_texture_applied"
                    alt="Texture result"
                    style="width: 100%; height: 100%; object-fit: cover"
                  />

                  <!-- Active Checkmark Overlay -->
                  <div
                    v-if="texture.is_active"
                    @click.stop="deactivateTexture(index)"
                    style="
                      position: absolute;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                      background: rgba(82, 196, 26, 0.2);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 32px;
                      color: #52c41a;
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="800px"
                      height="800px"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="8"
                        fill="currentColor"
                        fill-opacity="0.24"
                      />
                      <path
                        d="M8.5 11L10.7929 13.2929C11.1834 13.6834 11.8166 13.6834 12.2071 13.2929L19.5 6"
                        stroke="#52c41a"
                        stroke-width="1.6"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>

                  <!-- Delete Button - Top Right Corner -->
                  <div class="delete-fab" @click.stop="deleteTexture(index)">
                    <DeleteOutlined />
                  </div>
                </div>
              </a-col>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="textures_available.length === 0"
            style="
              text-align: center;
              padding: 20px 20px;
              color: #999;
              background: #fafafa;
              border-radius: 6px;
            "
          >
            <p style="margin: 0; font-size: 12px">No textures applied yet</p>
          </div>
        </div>

        <!-- Upload More Images -->

        <!-- Update your existing "Upload more images" section to show queue info -->
        <div class="more-images-section">
          <div class="section-header" style="padding: 0 10px">
            <p>Upload more images</p>
            <a-button
              type="link"
              @click="showQueueModal"
              style="
                padding: 0;
                display: flex;
                gap: 10px;
                justify-content: center;
                align-items: center;
              "
            >
              View Queue
              <a-badge :count="queueItemsCount" size="23" />
            </a-button>
          </div>
          <!-- <div class="more-images-upload" @click="showAddToQueueModal">
    <CameraOutlined />
  </div> -->
          <div class="upload-option" @click="showAddToQueueModal">
            <CameraOutlined />
            <small>Single View</small>
          </div>

          <!-- Queue status indicator -->
          <div v-if="queueItemsCount > 0" class="queue-status-indicator">
            <div class="queue-stats">
              <span class="queue-stat">
                <a-tag color="orange"
                  >{{ pendingQueueItems.length }} Pending</a-tag
                >
              </span>
              <span class="queue-stat">
                <a-tag color="blue"
                  >{{ processingQueueItems.length }} Processing</a-tag
                >
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Multi View Mode -->
      <div v-else class="multi-view">
        <a-row :gutter="[8, 8]">
          <a-col :span="12" v-for="(view, index) in views" :key="index">
            <div
              class="view-upload-area"
              :class="{
                'has-image': view.image,
                processing: isProcessingBg && view.image,
              }"
              @drop="handleDrop($event, index)"
              @dragover.prevent
              @dragenter.prevent
              @click="!isProcessingBg && triggerFileInput(index)"
            >
              <div
                v-if="!view.image && !view.uploading"
                class="view-placeholder"
              >
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
                  <a-button
                    type="primary"
                    size="medium"
                    shape="circle"
                    @click.stop="editImage(index)"
                  >
                    <template #icon>
                      <EditOutlined />
                    </template>
                  </a-button>
                  <a-button
                    type="primary"
                    :danger="true"
                    shape="circle"
                    @click.stop="removeImage(index)"
                  >
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
          <a-button
            block
            @click="removeBackground"
            :loading="isProcessingBg"
            :disabled="isProcessingBg"
          >
            <template #icon v-if="!isProcessingBg">
              <ScissorOutlined />
            </template>
            {{
              isProcessingBg ? "Removing Background..." : "Remove Background"
            }}
          </a-button>
        </div>

        <!-- Add Texture Section -->
        <!-- <div class="texture-section">
          <p>Add Texture</p>
          <div class="texture-upload" @click="!isProcessingBg && triggerFileInput('texture')">
            <PlusOutlined />
          </div>
        </div> -->

        <!-- Update the existing "Upload more images" section to include multi-view option -->
        <div class="more-images-section">
          <div class="section-header" style="padding: 0 10px 0 0">
            <p>Upload more images</p>
            <a-badge :count="queueItemsCount" :offset="[10, 0]">
              <a-button type="link" @click="showQueueModal" style="padding: 0">
                View Queue
              </a-button>
            </a-badge>
          </div>

          <div class="upload-options">
            <div class="upload-option" @click="showMultiViewQueueModal">
              <div class="multi-view-icon">
                <CameraOutlined />
                <CameraOutlined />
              </div>
              <small>Multi View</small>
            </div>
          </div>

          <!-- Queue status indicator -->
          <div v-if="queueItemsCount > 0" class="queue-status-indicator">
            <div class="queue-stats">
              <span class="queue-stat">
                <a-tag color="orange"
                  >{{ pendingQueueItems.length }} Pending</a-tag
                >
              </span>
              <span class="queue-stat">
                <a-tag color="blue"
                  >{{ processingQueueItems.length }} Processing</a-tag
                >
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <!-- Credit Display -->
      <div class="credits">
        <svg
          width="17"
          height="18"
          viewBox="0 0 17 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.5013 1.91602C4.58918 1.91602 1.41797 5.08722 1.41797 8.99935C1.41797 12.9115 4.58918 16.0827 8.5013 16.0827C12.4134 16.0827 15.5846 12.9115 15.5846 8.99935C15.5846 5.08722 12.4134 1.91602 8.5013 1.91602ZM8.5013 2.62435C8.5013 4.3151 7.82965 5.93661 6.63411 7.13215C5.43856 8.3277 3.81706 8.99935 2.1263 8.99935C3.81706 8.99935 5.43856 9.671 6.63411 10.8665C7.82965 12.0621 8.5013 13.6836 8.5013 15.3743C8.5013 13.6836 9.17295 12.0621 10.3685 10.8665C11.564 9.671 13.1855 8.99935 14.8763 8.99935C13.1855 8.99935 11.564 8.3277 10.3685 7.13215C9.17295 5.93661 8.5013 4.3151 8.5013 2.62435Z"
            fill="#3B63FB"
          />
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
          {{ isGenerating ? "Generating..." : "Generate" }}
        </a-button>
      </div>
    </div>

    <!-- Hidden File Inputs -->

    <input
      ref="fileInput-texture-select"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleTextureFileSelect"
    />

    <!-- Add hidden file inputs for multi-view queue -->
    <input
      ref="fileInput-mv-queue-0"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleMultiViewQueueUpload($event, 0)"
    />
    <input
      ref="fileInput-mv-queue-1"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleMultiViewQueueUpload($event, 1)"
    />
    <input
      ref="fileInput-mv-queue-2"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleMultiViewQueueUpload($event, 2)"
    />
    <input
      ref="fileInput-mv-queue-3"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleMultiViewQueueUpload($event, 3)"
    />
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
      ref="fileInput-queue"
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      style="display: none"
      @change="handleQueueImageUpload"
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
  ThunderboltOutlined,
} from "@ant-design/icons-vue";

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
    ThunderboltOutlined,
  },
  data() {
    return {
      // TEXTURE DATA
      openTextureModal: false,
      textureImage: null,
      isApplyingTexture: false,
      originalMainImage: null,

      textures_available: [
        // Structure:
        // {
        //   texture_file_selected: '',
        //   main_image_texture_applied: '',
        //   is_active: false,
        //   original_main_image: ''
        // }
      ],

      openEditImage_modal: false,
      multiView: false,
      mainImage: null,
      credits: 10,
      isProcessingBg: false,
      isGenerating: false,
      completedItemsCount: 0,
      completedItemIds: [],
      isInitialLoad: true,

      uploading: {
        main: false,
      },
      views: [
        { label: "Front side", image: null, uploading: false },
        { label: "Back side", image: null, uploading: false },
        { label: "Left side", image: null, uploading: false },
        { label: "Right side", image: null, uploading: false },
      ],
      extraViews: [
        { label: "Front side", image: null, uploading: false },
        { label: "Back side", image: null, uploading: false },
      ],
      // Edit modal data
      currentEditingKey: null,
      currentEditingImage: null,
      originalImageData: null,
      canvasWidth: 800,
      canvasHeight: 600,
      isDrawing: false,
      brushSize: 20,
      brushMode: "erase", // 'erase' or 'restore'
      canvas: null,
      ctx: null,

      // Queue-related properties
      openQueueModal: false,
      openAddToQueueModal: false,
      queueItems: [],
      queuePollingInterval: null,

      // Modal for adding items to queue
      queueImageUpload: null,
      queueImageUploading: false,
      queueImageProcessingBg: false,

      // Canvas for queue modal editing (reuse existing canvas variables)
      queueCanvasWidth: 800,
      queueCanvasHeight: 600,

      // multiview renderer :

      openMultiViewQueueModal: false,
      multiViewQueueImages: [
        { label: "Front side", image: null, uploading: false, required: true },
        { label: "Back side", image: null, uploading: false, required: false },
        { label: "Left side", image: null, uploading: false, required: false },
        { label: "Right side", image: null, uploading: false, required: false },
      ],
      multiViewQueueProcessingBg: false,
    };
  },

  // Add these lifecycle hooks:
  mounted() {
    // Initialize completed count on first load
    this.initializeCompletedCount();
    // Start queue polling when component mounts
    this.startQueuePolling();
  },

  beforeUnmount() {
    // Clean up polling when component unmounts
    this.stopQueuePolling();
  },
  computed: {
    hasValidMultiViewQueue() {
      // At minimum, front view is required
      return this.multiViewQueueImages[0].image !== null;
    },

    multiViewQueueImageCount() {
      return this.multiViewQueueImages.filter((view) => view.image).length;
    },
    hasAnyImage() {
      return (
        this.views.some((view) => view.image) ||
        this.extraViews.some((view) => view.image)
      );
    },
    queueItemsCount() {
      return this.queueItems.length;
    },

    pendingQueueItems() {
      return this.queueItems.filter((item) => item.status === "pending");
    },

    processingQueueItems() {
      return this.queueItems.filter((item) => item.status === "processing");
    },

    canAddToQueue() {
      return (
        this.queueItems.filter(
          (item) => item.status === "pending" || item.status === "processing",
        ).length < 4
      );
    },
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
            const res = await fetch(
              `${this.$store.state.root_api}renderer/checkout-renderer/${jobId}/`,
            );

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            if (data.status === "Completed") {
              this.canvasLoading = false;
              this.stopPolling();
              resolve(data.finalised_result_wall_processed_image);
              // Add to textures_available list
              const newTexture = {
                texture_file_selected: this.textureImage,
                main_image_texture_applied:
                  this.$store.state.root_media_api +
                  data.finalised_result_wall_processed_image +
                  "?t=" +
                  Date.now(),
                is_active: false,
                original_main_image: this.originalMainImage, // Store reference to original
              };

              this.textures_available.push(newTexture);

              // Automatically activate the newly applied texture
              this.activateTexture(this.textures_available.length - 1);
              this.isApplyingTexture = false;
              this.closeTextureModal();
              // this.base_image_url =
              //     this.$store.state.root_media_api +
              //     data.finalised_result_wall_processed_image +
              //     '?t=' +
              //     Date.now()

              //   this.forceCanvasUpdate();
              //   this.$message.success('Applied Effect successfully!');
              return;
            }

            if (data.status === "failed") {
              this.canvasLoading = false;

              this.stopPolling();
              reject("Rendering failed");
              return;
            }

            console.log("⏳ Rendering in progress...");
          } catch (err) {
            this.loading = false;
            this.stopPolling();
            reject(err);
            this.canvasLoading = false;
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
    goBack() {
      this.$emit("back");
    },

    // Texture Methods
    openTexturModal() {
      if (!this.mainImage) {
        this.$message.warning("Please upload a main image first");
        return;
      }
      this.openTextureModal = true;
    },

    closeTextureModal() {
      this.openTextureModal = false;
      this.textureImage = null;
    },

    triggerTextureFileInput() {
      this.$refs["fileInput-texture-select"].click();
    },

    handleTextureFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          this.$message.error("File size must be less than 10MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          this.textureImage = e.target.result;
          console.log("Texture file loaded");
        };
        reader.onerror = (error) => {
          console.error("File reading error:", error);
          this.$message.error("Failed to read file");
        };
        reader.readAsDataURL(file);
      }
    },

    removeSelectedTexture() {
      this.textureImage = null;
    },

    async applyTextureToImage() {
      if (!this.textureImage) {
        this.$message.warning("Please select a texture image");
        return;
      }

      if (!this.mainImage) {
        this.$message.warning("Please upload a main image first");
        return;
      }

      this.isApplyingTexture = true;

      try {
        // Ensure main_image and texture_image are valid base64 strings
        let mainImageData = this.mainImage;
        let textureImageData = this.textureImage;

        // Check if they already have data URI prefix
        if (!mainImageData.startsWith("data:")) {
          mainImageData = `data:image/png;base64,${mainImageData}`;
        }
        if (!textureImageData.startsWith("data:")) {
          textureImageData = `data:image/png;base64,${textureImageData}`;
        }

        const payload = {
          main_image: mainImageData,
          texture_image: textureImageData,
        };

        console.log("Sending texture application request...");

        console.log("Main image length:", mainImageData.length);
        console.log("Texture image length:", textureImageData.length);

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}engine/apply-texture/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );

        if (response.status === 402) {
          this.openTextureModal = false;
          const result = await response.json();
          this.$emit("insufficient-credits", result.msg);
          return;
        }

        if (response.ok) {
          const result = await response.json();

          // console.log('Texture applied successfully')
          // console.log('Response:', result);

          this.startPolling(result?.renderer_id);

          // Add to textures_available list
          // const newTexture = {
          //   texture_file_selected: this.textureImage,
          //   main_image_texture_applied: result.textured_image,
          //   is_active: false,
          //   original_main_image: this.originalMainImage
          // }

          // this.textures_available.push(newTexture)

          // // Automatically activate the newly applied texture
          // this.activateTexture(this.textures_available.length - 1)

          // this.$message.success('Texture applied successfully!')
          // this.closeTextureModal()
        } else {
          const error = await response.json();
          console.error("API Error Response:", error);
          console.error("Response Status:", response.status);
          this.$message.error(error.msg || "Failed to apply texture");
          this.isApplyingTexture = false;
        }
      } catch (error) {
        console.error("Error applying texture:", error);
        this.$message.error("Failed to apply texture: " + error.message);
        this.isApplyingTexture = false;
      }
    },

    activateTexture(index) {
      if (!this.textures_available[index]) return;

      // Deactivate all other textures
      this.textures_available.forEach((texture, i) => {
        if (i !== index) {
          texture.is_active = false;
        }
      });

      // Activate selected texture
      this.textures_available[index].is_active = true;
      this.mainImage =
        this.textures_available[index].main_image_texture_applied;

      this.$forceUpdate();
      this.$message.success("Texture activated");
    },

    deactivateTexture(index) {
      if (!this.textures_available[index]) return;

      const texture = this.textures_available[index];

      // Revert to original image
      if (texture.original_main_image) {
        this.mainImage = texture.original_main_image;
      }

      // Mark as inactive
      texture.is_active = false;

      this.$forceUpdate();
      this.$message.info("Texture deactivated - reverted to original image");
    },

    deleteTexture(index) {
      const wasActive = this.textures_available[index].is_active;
      this.textures_available.splice(index, 1);

      if (wasActive && this.textures_available.length > 0) {
        // Activate first texture if deleted one was active
        this.activateTexture(0);
      } else if (wasActive) {
        // No textures left, revert to original
        if (this.originalMainImage) {
          this.mainImage = this.originalMainImage;
        }
      }

      this.$message.success("Texture deleted");
    },
    // Add this new method:

    view_result(generated_model_id) {
      this.$emit("queue-updated", generated_model_id);
      this.openQueueModal = false;
    },
    // Update your initializeCompletedCount method:
    async initializeCompletedCount() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}engine/queue-status-add-new-product/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          },
        );

        if (response.ok) {
          const result = await response.json();
          const queueItems = result.queue || [];
          const completedItems = queueItems.filter(
            (item) => item.status === "completed" && item.generated_model_id,
          );

          this.completedItemsCount = completedItems.length;
          this.completedItemIds = completedItems.map((item) => item.id);

          // Set flag to false after initialization is complete
          this.isInitialLoad = false;
        }
      } catch (error) {
        console.error("Failed to initialize completed count:", error);
        // Still set flag to false even on error
        this.isInitialLoad = false;
      }
    },

    editImage(key) {
      this.currentEditingKey = key;

      // Get the current image based on key
      let imageData = null;
      if (key === "main") {
        imageData = this.mainImage;
      } else if (typeof key === "number") {
        imageData = this.views[key].image;
      }

      if (!imageData) {
        this.$message.warning("No image to edit");
        return;
      }

      this.currentEditingImage = imageData;
      this.openEditImage_modal = true;

      // Wait for modal to be rendered, then setup canvas
      this.$nextTick(() => {
        this.setupCanvas();
      });
    },

    // Multi-View Queue Methods
    showMultiViewQueueModal() {
      if (!this.canAddToQueue) {
        this.$message.warning("Queue is full. Maximum 4 items allowed.");
        return;
      }
      this.openMultiViewQueueModal = true;
      this.resetMultiViewQueueImages();
    },

    closeMultiViewQueueModal() {
      this.openMultiViewQueueModal = false;
      this.resetMultiViewQueueImages();
      this.multiViewQueueProcessingBg = false;
    },

    resetMultiViewQueueImages() {
      this.multiViewQueueImages.forEach((view) => {
        view.image = null;
        view.uploading = false;
      });
    },

    triggerMultiViewQueueInput(index) {
      const refName = `fileInput-mv-queue-${index}`;
      const input = this.$refs[refName];
      if (input) {
        input.click();
      }
    },

    async handleMultiViewQueueUpload(event, index) {
      const file = event.target.files[0];
      if (!file) return;

      this.multiViewQueueImages[index].uploading = true;

      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          this.multiViewQueueImages[index].image = e.target.result;
          this.multiViewQueueImages[index].uploading = false;
          this.$forceUpdate();
        }, 1000);
      };
      reader.readAsDataURL(file);
    },

    removeMultiViewQueueImage(index) {
      this.multiViewQueueImages[index].image = null;
      this.$forceUpdate();
    },

    editMultiViewQueueImage(index) {
      if (!this.multiViewQueueImages[index].image) return;

      this.currentEditingImage = this.multiViewQueueImages[index].image;
      this.currentEditingKey = `mv-queue-${index}`;
      this.openEditImage_modal = true;

      this.$nextTick(() => {
        this.setupCanvas();
      });
    },

    async removeMultiViewQueueBackground() {
      const imagesToProcess = [];

      this.multiViewQueueImages.forEach((view, index) => {
        if (view.image) {
          imagesToProcess.push({ type: `view-${index}`, data: view.image });
        }
      });

      if (imagesToProcess.length === 0) {
        this.$message.warning("Please upload at least one image");
        return;
      }

      this.multiViewQueueProcessingBg = true;

      try {
        const payload = {
          images: imagesToProcess,
          multiView: true,
        };
        const token = localStorage.getItem("token");

        const response = await fetch(
          this.$store.state.root_api + "engine/remove-images-bg/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );

        if (response.ok) {
          const result = await response.json();
          if (!result.error && result.data && result.data.images) {
            result.data.images.forEach((processedImage) => {
              if (
                processedImage.data_removed_bg &&
                processedImage.type.startsWith("view-")
              ) {
                const viewIndex = parseInt(processedImage.type.split("-")[1]);
                if (this.multiViewQueueImages[viewIndex]) {
                  this.multiViewQueueImages[viewIndex].image =
                    processedImage.data_removed_bg;
                }
              }
            });

            this.$forceUpdate();
            this.$message.success("Background removed successfully!");
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Background removal failed");
        }
      } catch (error) {
        console.error("Background removal error:", error);
        this.$message.error(error.message || "Failed to remove background");
      } finally {
        this.multiViewQueueProcessingBg = false;
      }
    },

    async addMultiViewToQueue() {
      if (!this.hasValidMultiViewQueue) {
        this.$message.warning("Please upload at least the front view image");
        return;
      }

      try {
        const imagesToUpload = [];

        this.multiViewQueueImages.forEach((view, index) => {
          if (view.image) {
            imagesToUpload.push({ type: `view-${index}`, data: view.image });
          }
        });

        const payload = {
          images: imagesToUpload,
          multiView: true,
          room_id: this.$route.params.id,
        };
        const token = localStorage.getItem("token");

        const response = await fetch(
          this.$store.state.root_api +
            "engine/hy-2.0-mv-3D-gen-add-new-product/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );

        if (response.ok) {
          const result = await response.json();
          this.$message.success("Multi-view item added to queue successfully!");
          this.closeMultiViewQueueModal();
          this.fetchQueueStatus();
        } else {
          const error = await response.json();
          throw new Error(error.msg || "Failed to add to queue");
        }
      } catch (error) {
        console.error("Add multi-view to queue error:", error);
        this.$message.error(
          error.message || "Failed to add multi-view item to queue",
        );
      }
    },

    // Replace your existing fetchQueueStatus method with this:

    // Update your fetchQueueStatus method:
    async fetchQueueStatus() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}engine/queue-status-add-new-product/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          },
        );

        if (response.ok) {
          const result = await response.json();
          this.queueItems = result.queue || [];

          // Get current completed items with generated_model_id
          const currentCompletedItems = this.queueItems.filter(
            (item) => item.status === "completed" && item.generated_model_id,
          );

          // Only check for newly completed items if not initial load
          if (!this.isInitialLoad) {
            // Find newly completed items by comparing with previous IDs
            const newlyCompletedItems = currentCompletedItems.filter(
              (item) => !this.completedItemIds.includes(item.id),
            );

            // Emit for each newly completed item
            if (newlyCompletedItems.length > 0) {
              newlyCompletedItems.forEach((item) => {
                this.$emit("queue-updated", item.generated_model_id);
                console.log(
                  `New completed item: Model ID: ${item.generated_model_id}`,
                );
              });
            }
          }

          // Update tracking
          this.completedItemsCount = currentCompletedItems.length;
          this.completedItemIds = currentCompletedItems.map((item) => item.id);
        }
      } catch (error) {
        console.error("Failed to fetch queue status:", error);
      }
    },

    startQueuePolling() {
      this.fetchQueueStatus();
      this.queuePollingInterval = setInterval(() => {
        this.fetchQueueStatus();
      }, 3000); // Poll every 3 seconds
    },
    stopQueuePolling() {
      if (this.queuePollingInterval) {
        clearInterval(this.queuePollingInterval);
        this.queuePollingInterval = null;
      }
    },

    showQueueModal() {
      this.openQueueModal = true;
      this.startQueuePolling();
    },

    closeQueueModal() {
      this.openQueueModal = false;
      this.stopQueuePolling();
    },

    showAddToQueueModal() {
      if (!this.canAddToQueue) {
        this.$message.warning("Queue is full. Maximum 4 items allowed.");
        return;
      }
      this.openAddToQueueModal = true;
      this.queueImageUpload = null;
    },

    closeAddToQueueModal() {
      this.openAddToQueueModal = false;
      this.queueImageUpload = null;
      this.queueImageUploading = false;
      this.queueImageProcessingBg = false;
    },

    async handleQueueImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.queueImageUploading = true;

      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          this.queueImageUpload = e.target.result;
          this.queueImageUploading = false;
        }, 1000);
      };
      reader.readAsDataURL(file);
    },

    triggerQueueImageInput() {
      const input = this.$refs["fileInput-queue"];
      if (input) {
        input.click();
      }
    },

    async removeQueueImageBackground() {
      if (!this.queueImageUpload) return;

      this.queueImageProcessingBg = true;

      try {
        const payload = {
          images: [{ type: "main", data: this.queueImageUpload }],
          multiView: false,
        };
        const token = localStorage.getItem("token");

        const response = await fetch(
          this.$store.state.root_api + "engine/remove-images-bg/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );

        if (response.ok) {
          const result = await response.json();
          if (!result.error && result.data && result.data.images) {
            const processedImage = result.data.images.find(
              (img) => img.type === "main",
            );
            if (processedImage && processedImage.data_removed_bg) {
              this.queueImageUpload = processedImage.data_removed_bg;
              this.$message.success("Background removed successfully!");
            }
          }
        }
      } catch (error) {
        console.error("Background removal error:", error);
        this.$message.error("Failed to remove background");
      } finally {
        this.queueImageProcessingBg = false;
      }
    },

    async addToQueue() {
      if (!this.queueImageUpload) {
        this.$message.warning("Please upload an image first");
        return;
      }

      try {
        const payload = {
          images: [{ type: "main", data: this.queueImageUpload }],
          multiView: false,
          room_id: this.$route.params.id,
        };

        const token = localStorage.getItem("token");
        const response = await fetch(
          this.$store.state.root_api +
            "engine/hy-2.0-sv-3D-gen-add-new-product/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );

        if (response.ok) {
          const result = await response.json();
          this.$message.success("Item added to queue successfully!");
          this.closeAddToQueueModal();
          this.fetchQueueStatus();
        } else {
          const error = await response.json();
          throw new Error(error.msg || "Failed to add to queue");
        }
      } catch (error) {
        console.error("Add to queue error:", error);
        this.$message.error(error.message || "Failed to add item to queue");
      }
    },

    async removeFromQueue(queueId) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          this.$store.state.root_api + "engine/queue-status-add-new-product/",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ queue_id: queueId }),
          },
        );

        if (response.ok) {
          this.$message.success("Item removed from queue");
          this.fetchQueueStatus();
        } else {
          const error = await response.json();
          throw new Error(error.msg || "Failed to remove from queue");
        }
      } catch (error) {
        console.error("Remove from queue error:", error);
        this.$message.error(
          error.message || "Failed to remove item from queue",
        );
      }
    },

    editQueueImage() {
      if (!this.queueImageUpload) return;

      this.currentEditingImage = this.queueImageUpload;
      this.openEditImage_modal = true;

      this.$nextTick(() => {
        this.setupCanvas();
      });
    },
    setupCanvas() {
      const canvas = this.$refs.editCanvas;
      if (!canvas) return;

      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");

      // Create image object
      const img = new Image();
      img.onload = () => {
        // Calculate canvas dimensions to maintain aspect ratio
        const maxWidth = 800;
        const maxHeight = 600;

        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        this.canvasWidth = width;
        this.canvasHeight = height;

        // Wait for canvas size to update
        this.$nextTick(() => {
          this.canvas.width = width;
          this.canvas.height = height;

          // Draw image on canvas
          this.ctx.drawImage(img, 0, 0, width, height);

          // Store original image data for restore functionality
          this.originalImageData = this.ctx.getImageData(0, 0, width, height);
        });
      };

      img.src = this.currentEditingImage;
    },

    getMousePos(e) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      let clientX, clientY;

      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    },

    startDrawing(e) {
      e.preventDefault();
      this.isDrawing = true;
      this.draw(e);
    },

    draw(e) {
      if (!this.isDrawing || !this.ctx) return;

      e.preventDefault();
      const pos = this.getMousePos(e);

      this.ctx.save();

      if (this.brushMode === "erase") {
        // Erase mode - set composite operation to destination-out
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.fillStyle = "rgba(0,0,0,1)";
      } else {
        // Restore mode - copy from original image
        this.ctx.globalCompositeOperation = "source-over";

        // Get circular area from original image
        const imageData = this.ctx.createImageData(
          this.brushSize * 2,
          this.brushSize * 2,
        );
        const originalData = this.originalImageData.data;
        const canvasWidth = this.originalImageData.width;

        for (let dy = -this.brushSize; dy < this.brushSize; dy++) {
          for (let dx = -this.brushSize; dx < this.brushSize; dx++) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= this.brushSize) {
              const srcX = Math.floor(pos.x + dx);
              const srcY = Math.floor(pos.y + dy);

              if (
                srcX >= 0 &&
                srcX < canvasWidth &&
                srcY >= 0 &&
                srcY < this.originalImageData.height
              ) {
                const srcIndex = (srcY * canvasWidth + srcX) * 4;
                const destX = dx + this.brushSize;
                const destY = dy + this.brushSize;
                const destIndex = (destY * (this.brushSize * 2) + destX) * 4;

                imageData.data[destIndex] = originalData[srcIndex]; // R
                imageData.data[destIndex + 1] = originalData[srcIndex + 1]; // G
                imageData.data[destIndex + 2] = originalData[srcIndex + 2]; // B
                imageData.data[destIndex + 3] = originalData[srcIndex + 3]; // A
              }
            }
          }
        }

        // Create temporary canvas for the brush
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = this.brushSize * 2;
        tempCanvas.height = this.brushSize * 2;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.putImageData(imageData, 0, 0);

        // Draw the restored area
        this.ctx.drawImage(
          tempCanvas,
          pos.x - this.brushSize,
          pos.y - this.brushSize,
        );
        this.ctx.restore();
        return;
      }

      // Draw brush stroke
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, this.brushSize, 0, 2 * Math.PI);
      this.ctx.fill();

      this.ctx.restore();
    },

    stopDrawing(e) {
      if (e) e.preventDefault();
      this.isDrawing = false;
    },

    resetCanvas() {
      if (!this.ctx || !this.originalImageData) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.putImageData(this.originalImageData, 0, 0);
    },

    saveEditedImage() {
      if (!this.canvas) return;

      // Convert canvas to data URL
      const editedImageData = this.canvas.toDataURL("image/png");

      // Update the appropriate image
      if (this.currentEditingKey === "main") {
        this.mainImage = editedImageData;
      } else if (typeof this.currentEditingKey === "number") {
        this.views[this.currentEditingKey].image = editedImageData;
        this.$forceUpdate();
      } else if (
        this.currentEditingKey &&
        this.currentEditingKey.startsWith("mv-queue-")
      ) {
        const index = parseInt(this.currentEditingKey.split("-")[2]);
        this.multiViewQueueImages[index].image = editedImageData;
        this.$forceUpdate();
      }

      this.closeEditModal();
      this.$message.success("Image edited successfully!");
    },

    closeEditModal() {
      this.openEditImage_modal = false;
      this.currentEditingKey = null;
      this.currentEditingImage = null;
      this.originalImageData = null;
      this.isDrawing = false;
    },

    triggerFileInput(key) {
      const refName = `fileInput-${key}`;
      const input = this.$refs[refName];
      if (input) {
        input.click();
      } else {
        console.error(`File input not found for key: ${key}`);
      }
    },

    handleFileSelect(event, key) {
      const file = event.target.files[0];
      if (file) {
        this.uploadFile(file, key);
      }
    },

    handleDrop(event, key) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        this.uploadFile(file, key);
      }
    },

    // uploadFile(file, key) {
    //   console.log('Uploading file for key:', key)

    //   // Set uploading state
    //   if (key === 'main') {
    //     this.uploading.main = true
    //   } else if (typeof key === 'number') {
    //     this.views[key].uploading = true
    //   } else if (key.toString().startsWith('extra-')) {
    //     const index = parseInt(key.toString().split('-')[1])
    //     this.extraViews[index].uploading = true
    //   }

    //   // Simulate upload with FileReader
    //   const reader = new FileReader()
    //   reader.onload = (e) => {
    //     setTimeout(() => {
    //       if (key === 'main') {
    //         this.mainImage = e.target.result
    //         this.uploading.main = false
    //       } else if (typeof key === 'number') {
    //         this.views[key].image = e.target.result
    //         this.views[key].uploading = false
    //         this.$forceUpdate()
    //       } else if (key.toString().startsWith('extra-')) {
    //         const index = parseInt(key.toString().split('-')[1])
    //         this.extraViews[index].image = e.target.result
    //         this.extraViews[index].uploading = false
    //         this.$forceUpdate()
    //       }
    //       console.log('Upload completed for key:', key)
    //     }, 1000)
    //   }
    //   reader.readAsDataURL(file)
    // },

    uploadFile(file, key) {
      console.log("Uploading file for key:", key);

      // Set uploading state
      if (key === "main") {
        this.uploading.main = true;
      } else if (typeof key === "number") {
        this.views[key].uploading = true;
      } else if (key.toString().startsWith("extra-")) {
        const index = parseInt(key.toString().split("-")[1]);
        this.extraViews[index].uploading = true;
      }

      // Simulate upload with FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          if (key === "main") {
            this.mainImage = e.target.result;
            this.originalMainImage = e.target.result; // STORE ORIGINAL
            this.uploading.main = false;
          } else if (typeof key === "number") {
            this.views[key].image = e.target.result;
            this.views[key].uploading = false;
            this.$forceUpdate();
          } else if (key.toString().startsWith("extra-")) {
            const index = parseInt(key.toString().split("-")[1]);
            this.extraViews[index].image = e.target.result;
            this.extraViews[index].uploading = false;
            this.$forceUpdate();
          }
          console.log("Upload completed for key:", key);
        }, 1000);
      };
      reader.readAsDataURL(file);
    },
    removeImage(key) {
      if (key === "main") {
        this.mainImage = null;
      } else if (typeof key === "number") {
        this.views[key].image = null;
      } else if (key.toString().startsWith("extra-")) {
        const index = parseInt(key.toString().split("-")[1]);
        this.extraViews[index].image = null;
      }
    },

    async removeBackground() {
      console.log("Remove background");

      this.isProcessingBg = true;

      try {
        const imagesToUpload = [];

        if (!this.multiView && this.mainImage) {
          imagesToUpload.push({ type: "main", data: this.mainImage });
        }

        if (this.multiView) {
          this.views.forEach((view, index) => {
            if (view.image) {
              imagesToUpload.push({ type: `view-${index}`, data: view.image });
            }
          });

          this.extraViews.forEach((view, index) => {
            if (view.image) {
              imagesToUpload.push({
                type: `extra-view-${index}`,
                data: view.image,
              });
            }
          });
        }

        if (imagesToUpload.length === 0) {
          this.$message.warning("Please upload at least one image");
          return;
        }

        const payload = {
          images: imagesToUpload,
          multiView: this.multiView,
          credits: this.credits,
        };

        const token = localStorage.getItem("token");
        const response = await fetch(
          this.$store.state.root_api + "engine/remove-images-bg/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );

        if (response.ok) {
          const result = await response.json();
          console.log(result);

          if (!result.error && result.data && result.data.images) {
            result.data.images.forEach((processedImage) => {
              if (processedImage.data_removed_bg) {
                if (!this.multiView && processedImage.type === "main") {
                  this.mainImage = processedImage.data_removed_bg;
                }

                if (this.multiView) {
                  if (processedImage.type.startsWith("view-")) {
                    const viewIndex = parseInt(
                      processedImage.type.split("-")[1],
                    );
                    if (this.views[viewIndex]) {
                      this.views[viewIndex].image =
                        processedImage.data_removed_bg;
                    }
                  }

                  if (processedImage.type.startsWith("extra-view-")) {
                    const extraIndex = parseInt(
                      processedImage.type.split("-")[2],
                    );
                    if (this.extraViews[extraIndex]) {
                      this.extraViews[extraIndex].image =
                        processedImage.data_removed_bg;
                    }
                  }
                }
              }
            });

            if (result.data.credits !== undefined) {
              this.credits = result.data.credits;
            }

            this.$forceUpdate();
            this.$message.success("Background removed successfully!");
          } else {
            throw new Error(result.msg || "Failed to process images");
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Background removal failed");
        }
      } catch (error) {
        console.error("Background removal error:", error);
        this.$message.error(error.message || "Failed to remove background");
      } finally {
        this.isProcessingBg = false;
      }
    },
    getQueueStatusColor(status) {
      const colors = {
        pending: "#faad14",
        processing: "#1890ff",
        completed: "#52c41a",
        failed: "#f5222d",
      };
      return colors[status] || "#d9d9d9";
    },

    getQueueStatusText(status) {
      const texts = {
        pending: "Pending",
        processing: "Processing...",
        completed: "Completed",
        failed: "Failed",
      };
      return texts[status] || status;
    },

    formatQueueTime(timeString) {
      if (!timeString) return "N/A";
      return new Date(timeString).toLocaleTimeString();
    },
    async getURLToBase64(url) {
      const res = await fetch(url);
      const blob = await res.blob();

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    },
    async generateObject() {
      // If in multi-view mode and no images, show multi-view queue modal
      if (this.multiView && !this.hasAnyImage) {
        this.showMultiViewQueueModal();
        return;
      }

      // If in single-view mode and no main image, show single view queue modal
      if (!this.multiView && !this.mainImage) {
        this.showAddToQueueModal();
        return;
      }

      // Continue with existing immediate generation logic
      this.isGenerating = true;
      this.$emit("processing-generate", true);

      try {
        const imagesToUpload = [];

        if (!this.multiView && this.mainImage) {
          imagesToUpload.push({ type: "main", data: this.mainImage });
        }

        if (this.multiView) {
          this.views.forEach((view, index) => {
            if (view.image) {
              imagesToUpload.push({ type: `view-${index}`, data: view.image });
            }
          });

          this.extraViews.forEach((view, index) => {
            if (view.image) {
              imagesToUpload.push({
                type: `extra-view-${index}`,
                data: view.image,
              });
            }
          });
        }

        if (imagesToUpload.length === 0) {
          this.$message.warning("Please upload at least one image");
          return;
        }

        const payload = {
          images: imagesToUpload,
          multiView: this.multiView,
          credits: this.credits,
          room_id: this.$route.params.id,
        };
        const token = localStorage.getItem("token");

        console.log(payload);
        let response = null;

        if (this.multiView) {
          response = await fetch(
            this.$store.state.root_api +
              "engine/hy-2.0-mv-3D-gen-add-new-product/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
              body: JSON.stringify(payload),
            },
          );
        } else {
          response = await fetch(
            this.$store.state.root_api +
              "engine/hy-2.0-sv-3D-gen-add-new-product/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
              body: JSON.stringify(payload),
            },
          );
        }

        if (response.status === 402) {
          this.openTextureModal = false;
          const result = await response.json();
          this.$emit("insufficient-credits", result.msg);
          return;
        }
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          this.$message.success("Item added to queue successfully!");
          // this.fetchQueueStatus()
          this.$emit("generated", result);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Generation failed");
        }
      } catch (error) {
        console.error("Generation error:", error);
        this.$message.error(error.message || "Failed to add to queue");
      } finally {
        this.isGenerating = false;
        this.$emit("processing-generate", false);
      }
    },
  },
};
</script>

<style scoped>
.image-to-3d-container {
  padding: 16px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 160vh; /* below md */
  margin: 0 auto;
}

/* md and above (≥768px) */
@media (min-width: 768px) {
  .image-to-3d-container {
    height: 90vh;
    overflow-y: auto;
  }
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  height: auto;
  max-height: 400px;
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
  margin: auto;
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
  /* align-items: center; */
  /* justify-content: space-between; */
  /* gap:10px; */
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

.texture-section,
.more-images-section {
  margin: 5px 0;
}

.texture-section p,
.more-images-section p {
  margin-bottom: 8px;
  font-size: 14px;
}

.texture-upload,
.more-images-upload {
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

.texture-upload:hover,
.more-images-upload:hover {
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

/* Queue Modal Styles */
.queue-modal .ant-modal-body {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.queue-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.queue-header {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.queue-list {
  min-height: 300px;
}

.queue-item-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-msg {
  color: #f5222d;
  margin: 0;
  font-size: 12px;
}

.empty-queue {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

/* Add to Queue Modal Styles */
.add-queue-modal .ant-modal-body {
  padding: 24px;
}

.add-queue-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.queue-upload-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.queue-upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
  position: relative;
}

.queue-upload-area:hover {
  border-color: #1890ff;
}

.queue-upload-area.has-image {
  border-color: #1890ff;
  padding: 0;
}

.queue-upload-area.processing {
  cursor: not-allowed;
}

.queue-action-section {
  margin: 16px 0;
}

.queue-modal-actions {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* Updated More Images Section */
.more-images-section {
  margin: 16px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-header p {
  margin: 0;
  font-size: 14px;
}

.queue-status-indicator {
  margin-top: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.queue-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.queue-stat {
  display: inline-block;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .queue-modal {
    width: 95% !important;
  }

  .add-queue-modal {
    width: 95% !important;
  }

  .queue-header .ant-row {
    gap: 8px;
  }

  .queue-item-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .queue-stats {
    justify-content: center;
  }
}

/* Loading states */
.queue-upload-area .uploading,
.queue-upload-area .bg-processing-overlay {
  text-align: center;
}

.queue-upload-area .uploading p,
.queue-upload-area .bg-processing-overlay p {
  margin: 8px 0 0;
  color: #666;
}

/* Image preview in queue modal */
.queue-upload-area .image-preview {
  width: 100%;
  height: 100%;
  max-height: 190px;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
}

.queue-upload-area .image-preview img {
  width: 100%;
  height: 100%;
  max-height: 190px;
  object-fit: contain;
}

/* Queue list item animations */
.ant-list-item {
  transition: background-color 0.3s ease;
}

.ant-list-item:hover {
  background-color: #fafafa;
  border-radius: 6px;
}

/* Multi-View Queue Modal Styles */
.multiview-queue-modal .ant-modal-body {
  padding: 24px;
  max-height: 80vh;
  overflow-y: auto;
}

.multiview-queue-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.multiview-queue-grid {
  margin-bottom: 16px;
}

.multiview-queue-upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: #fafafa;
}

.multiview-queue-upload-area:hover {
  border-color: #1890ff;
  background: #f0f8ff;
}

.multiview-queue-upload-area.has-image {
  border-color: #1890ff;
  padding: 0;
  background: white;
}

.multiview-queue-upload-area.processing {
  cursor: not-allowed;
}

.multiview-queue-upload-area.required {
  border-color: #faad14;
  background: #fffbf0;
}

.multiview-queue-placeholder {
  text-align: center;
  color: #666;
}

.view-label {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.required-indicator {
  color: #ff4d4f;
  font-weight: bold;
  margin-left: 2px;
}

.multiview-queue-placeholder .anticon {
  font-size: 24px;
  color: #1890ff;
}

.multiview-queue-image {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
}

.multiview-queue-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.multiview-queue-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}

.delete-fab {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  background: rgb(242, 15, 15);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.25s ease;
  z-index: 10;
}

.delete-fab:hover {
  background: rgba(239, 68, 68, 0.9);
  transform: scale(1.1);
}

.multiview-queue-info {
  margin: 16px 0;
}

.multiview-queue-bg-section {
  margin: 16px 0;
}

.multiview-queue-modal-actions {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* Updated More Images Section with Options */
.upload-options {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;
}

.upload-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  width: 100%;
  background: #fafafa;
}

.upload-option:hover {
  border-color: #1890ff;
  color: #1890ff;
  background: #f0f8ff;
}

.upload-option small {
  font-size: 11px;
  font-weight: 500;
}

.multi-view-icon {
  position: relative;
  display: inline-block;
}

.multi-view-icon .anticon:first-child {
  position: relative;
  z-index: 2;
}

.multi-view-icon .anticon:last-child {
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: 1;
  opacity: 0.6;
}

/* Background processing overlay for multi-view */
.multiview-queue-upload-area .bg-processing-overlay.small {
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

.multiview-queue-upload-area .bg-processing-overlay.small small {
  margin: 4px 0 0;
  font-size: 10px;
}

/* Loading states for multi-view queue */
.multiview-queue-upload-area .uploading {
  text-align: center;
  color: #666;
}

.multiview-queue-upload-area .uploading small {
  margin: 4px 0 0;
  font-size: 11px;
}

/* Responsive Design for Multi-View Queue */
@media (max-width: 768px) {
  .multiview-queue-modal {
    width: 95% !important;
  }

  .multiview-queue-upload-area {
    height: 120px;
  }

  .view-label {
    font-size: 11px;
  }

  .multiview-queue-placeholder .anticon {
    font-size: 20px;
  }

  .upload-options {
    flex-direction: column;
    gap: 8px;
  }

  .upload-option {
    min-width: auto;
    width: 100%;
  }

  .multiview-queue-actions {
    top: 4px;
    right: 4px;
    gap: 2px;
  }

  .multiview-queue-actions .ant-btn {
    font-size: 12px;
    height: 28px;
    width: 28px;
  }
}

@media (max-width: 576px) {
  .multiview-queue-grid .ant-col {
    span: 24 !important;
    margin-bottom: 12px;
  }

  .multiview-queue-upload-area {
    height: 100px;
  }
}

/* Enhanced Queue Status Display */
.queue-status-indicator {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Alert styling for multi-view info */
.multiview-queue-info .ant-alert {
  border-radius: 6px;
}

.multiview-queue-info .ant-alert-success {
  background: #f6ffed;
  border-color: #b7eb8f;
}

.multiview-queue-info .ant-alert-warning {
  background: #fffbe6;
  border-color: #ffe58f;
}

/* Improved button styling */
.multiview-queue-bg-section .ant-btn {
  height: 40px;
  font-weight: 500;
}

.multiview-queue-modal-actions .ant-btn {
  height: 40px;
  font-weight: 500;
}
</style>
