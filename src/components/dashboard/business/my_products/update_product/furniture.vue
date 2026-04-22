<template>
  <div>
    <!-- {{ selectedProduct }} -->
    <!-- Header -->
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding: 0 10px;
      "
    >
      <div style="display: flex; align-items: center">
        <a-button
          @click="cancel_edit_back_product_list"
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
        <h2
          style="margin: 0; font-size: 20px; font-weight: 600; color: #1f2937"
        >
          Edit Product
        </h2>
      </div>
      <div style="display: flex; gap: 12px">
        <a-button
          @click="cancel_edit_back_product_list"
          style="border-radius: 8px"
          >Cancel</a-button
        >
        <a-button
          type="primary"
          @click="saveProduct"
          :loading="isSaving"
          style="border-radius: 8px"
        >
          {{ isSaving ? "Saving..." : "Save" }}
        </a-button>
      </div>
    </div>

    <a-row style="padding: 0 24px">
      <!-- Left Column - 3D Model -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12">
        <div style="margin-bottom: 8px">
          <h3
            style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937"
          >
            3D Model
          </h3>
        </div>
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 24px">
          Upload 3D model (.glb, .gltf up to 50MB)
        </p>
        <div style="padding-right: 24px">
          <div style="margin-bottom: 32px">
            <!-- 3D Model Display -->
            <div v-if="has3DModel" style="position: relative; padding: 10px">
              <canvas_3d_model_renderer
                :glbModelUrl="get3DModelUrl()"
                :Model_instance_id="selectedProduct.id"
                style="
                  width: 100%;
                  max-height: 500px;
                  height: 100%;
                  border-radius: 10px;
                "
              />
 
            </div>

            <!-- Upload 3D Model Area -->
            <div
              v-else
              @click="upload3DModel"
              @dragover.prevent="dragOver"
              @dragleave.prevent="dragLeave"
              @drop.prevent="drop3DModel"
              style="
                width: 100%;
                height: 300px;
                border-radius: 12px;
                background: #f9fafb;
                border: 2px dashed #d1d5db;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
              "
              :style="{
                borderColor: isDragOver ? '#3b82f6' : '#d1d5db',
                background: isDragOver ? '#eff6ff' : '#f9fafb',
              }"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                stroke-width="1"
                style="margin-bottom: 16px"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <p
                style="
                  color: #6b7280;
                  font-size: 14px;
                  margin: 0 0 4px 0;
                  font-weight: 500;
                "
              >
                {{
                  isDragOver
                    ? "Drop 3D model here"
                    : "Drag and drop 3D model here, or click to upload"
                }}
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0">
                Supported: .glb, .gltf (50MB max)
              </p>
            </div>
          </div>
        </div>
        <div
          style="
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            background: #f8faff;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          "
        >
          <div style="display: flex; align-items: center; gap: 8px">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              stroke-width="2"
            >
              <path
                d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
              ></path>
            </svg>
            <span style="font-size: 13px; font-weight: 500; color: #374151"
              >Model Resizable</span
            >
          </div>

          <a-switch
            v-model:checked="is_resizable"
            @change="handleResizableChange"
            style="background-color: #3b82f6"
          />
        </div>
      </a-col>

      <!-- Right Column - Images -->
      <a-col :xs="24" :sm="24" :md="12" :lg="12">
        <h4
          style="
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 16px;
            color: #1f2937;
          "
        >
          Product Images
        </h4>
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 16px">
          Upload product images for display
        </p>

        <!-- Image Grid -->
        <div
          style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px"
        >
          <!-- Existing Images -->
          <div
            v-for="img in selectedProduct.images"
            :key="img.id"
            style="position: relative"
          >
            <img
              :src="$store.state.root_media_api + img.image"
              @click="togglePrimaryImage(img.id)"
              style="
                width: 72px;
                height: 72px;
                border-radius: 8px;
                object-fit: cover;
                cursor: pointer;
              "
              :style="{
                border: img.is_primary
                  ? '3px solid #10b981'
                  : '2px solid #e5e7eb',
              }"
            />
            <!-- Primary Badge -->
            <div
              v-if="img.is_primary"
              style="
                position: absolute;
                top: -6px;
                left: -6px;
                background: #10b981;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
              "
            >
              ★
            </div>
            <!-- Delete Button -->
            <a-button
              v-if="!img.is_primary"
              type="text"
              danger
              size="small"
              @click.stop="deleteImage(img.id)"
              style="
                position: absolute;
                top: -6px;
                right: -6px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                padding: 0;
                min-width: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
              "
            >
              <template #icon>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  style="display: block"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </template>
            </a-button>
          </div>

          <!-- Preview Images (Not yet saved) -->
          <div
            v-for="(preview, index) in imagePreviewsState"
            :key="'preview-' + index"
            style="position: relative"
          >
            <img
              :src="preview.url"
              style="
                width: 72px;
                height: 72px;
                border-radius: 8px;
                object-fit: cover;
                border: 2px solid #3b82f6;
                opacity: 0.8;
              "
            />
            <!-- Loading Overlay -->
            <div
              v-if="preview.uploading"
              style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div
                style="
                  width: 16px;
                  height: 16px;
                  border: 2px solid #ffffff;
                  border-top: 2px solid transparent;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                "
              ></div>
            </div>
            <!-- Remove Preview -->
            <a-button
              v-if="!preview.uploading"
              type="text"
              danger
              size="small"
              @click="removePreview(index)"
              style="
                position: absolute;
                top: -6px;
                right: -6px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                padding: 0;
                min-width: 20px;
              "
            >
              <template #icon>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </template>
            </a-button>
          </div>

          <!-- Add More Images -->
          <div
            @click="uploadMoreImages"
            style="
              width: 72px;
              height: 72px;
              border-radius: 8px;
              border: 2px dashed #d1d5db;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              background: #f9fafb;
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              stroke-width="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
        </div>
        <!-- <h4 style="margin-bottom: 8px; font-weight: 500; font-size: 16px; color: #1f2937;">3d  Images</h4> -->
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 16px">
          Images used to create 3d model
        </p>

        <!-- Image Grid -->
        <div
          style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px"
        >
          <!-- Existing Images -->

          <img
            :src="$store.state.root_media_api + selectedProduct.image_0"
            v-if="selectedProduct.image_0"
            style="
              width: 72px;
              height: 72px;
              border-radius: 8px;
              object-fit: cover;
              cursor: pointer;
            "
            :style="{ border: '2px solid #e5e7eb' }"
          />
          <img
            :src="$store.state.root_media_api + selectedProduct.image_1"
            v-if="selectedProduct.image_1"
            style="
              width: 72px;
              height: 72px;
              border-radius: 8px;
              object-fit: cover;
              cursor: pointer;
            "
            :style="{ border: '2px solid #e5e7eb' }"
          /><img
            :src="$store.state.root_media_api + selectedProduct.image_2"
            v-if="selectedProduct.image_2"
            style="
              width: 72px;
              height: 72px;
              border-radius: 8px;
              object-fit: cover;
              cursor: pointer;
            "
            :style="{ border: '2px solid #e5e7eb' }"
          /><img
            :src="$store.state.root_media_api + selectedProduct.image_3"
            v-if="selectedProduct.image_3"
            style="
              width: 72px;
              height: 72px;
              border-radius: 8px;
              object-fit: cover;
              cursor: pointer;
            "
            :style="{ border: '2px solid #e5e7eb' }"
          />

          <!-- Preview Images (Not yet saved) -->
          <div
            v-for="(preview, index) in imagePreviewsState"
            :key="'preview-' + index"
            style="position: relative"
          >
            <img
              :src="preview.url"
              style="
                width: 72px;
                height: 72px;
                border-radius: 8px;
                object-fit: cover;
                border: 2px solid #3b82f6;
                opacity: 0.8;
              "
            />
            <!-- Loading Overlay -->
            <div
              v-if="preview.uploading"
              style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div
                style="
                  width: 16px;
                  height: 16px;
                  border: 2px solid #ffffff;
                  border-top: 2px solid transparent;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                "
              ></div>
            </div>
            <!-- Remove Preview -->
            <a-button
              v-if="!preview.uploading"
              type="text"
              danger
              size="small"
              @click="removePreview(index)"
              style="
                position: absolute;
                top: -6px;
                right: -6px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                padding: 0;
                min-width: 20px;
              "
            >
              <template #icon>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </template>
            </a-button>
          </div>
        </div>
      </a-col>

      <!-- Product Details Section -->
      <a-col :span="24">
        <div style="padding-left: 24px; border-left: 1px solid #f3f4f6">
          <h3
            style="
              margin-bottom: 24px;
              font-weight: 600;
              font-size: 16px;
              color: #1f2937;
            "
          >
            Product Details
          </h3>

          <!-- Name & Description -->
          <div style="margin-bottom: 20px">
            <label
              style="
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                font-size: 14px;
                color: #374151;
              "
              >Name<span style="color: red">*</span></label
            >
            <a-input
              v-model:value="productForm.name"
              :maxlength="50"
              show-count
              placeholder="Product Name"
              style="border-radius: 8px"
              size="large"
            />
          </div>

          <div style="margin-bottom: 20px">
            <label
              style="
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                font-size: 14px;
                color: #374151;
              "
              >Description<span style="color: red">*</span></label
            >
            <a-textarea
              v-model:value="productForm.description"
              :rows="4"
              placeholder="Product Description"
              :maxlength="100"
              show-count
              style="border-radius: 8px; resize: none"
            />
          </div>
          <div style="margin-bottom: 20px">
          <label
            style="
              display: block;
              margin-bottom: 6px;
              font-weight: 500;
              font-size: 14px;
              color: #374151;
            "
          >
            Original Product Link
            <span style="font-size: 12px; color: #6b7280">&nbsp;(Optional)</span>
          </label>
          <a-input
            v-model:value="productForm.original_item_link"
            placeholder="https://example.com/product/..."
            style="border-radius: 8px"
            size="large"
          />
        </div>

          <!-- Category, Type, Price -->
          <a-row :gutter="16" style="margin-bottom: 20px">
            <a-col :span="6">
  <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">
    Room Type<span style="color: red">*</span>
  </label>
  <a-select
    v-model:value="selectedRoomTypeName"
    style="width: 100%"
    size="large"
    :loading="loadingRoomTypes"
    :allow-clear="true"
    @change="handleRoomTypeChange"
  >
    <a-select-option v-for="rt in roomTypes" :key="rt.id" :value="rt.id">
     
      {{ rt.name }}
    </a-select-option>
  </a-select>
            </a-col>

            <!-- Category -->
            <a-col :span="6">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">
                Category<span style="color: red">*</span>
              </label>
              <a-select
                v-model:value="productForm.category_name"
                style="width: 100%"
                size="large"
                mode="tags"
                :options="categoryOptions"
                :loading="loadingCategories"
                :filter-option="false"
                :allow-clear="true"
                show-search
                :disabled="!selectedRoomType"
                @search="handleCategorySearch"
                @change="handleCategoryChange"
                @focus="handleSelectFocus"
              />
            </a-col>
            <a-col :span="6">
              <label
                style="
                  display: block;
                  margin-bottom: 6px;
                  font-weight: 500;
                  font-size: 14px;
                  color: #374151;
                "
                >Type<span style="color: red">*</span></label
              >
              <a-select
                v-model:value="productForm.furniture_type"
                style="width: 100%"
                size="large"
              >
                <a-select-option
                  v-for="type in types"
                  :key="type"
                  :value="type"
                  >{{ type }}</a-select-option
                >
              </a-select>
            </a-col>
            <a-col :span="6">
              <label
                style="
                  display: block;
                  margin-bottom: 6px;
                  font-weight: 500;
                  font-size: 14px;
                  color: #374151;
                "
                >Price<span style="color: red">*</span></label
              >
              <a-input
                v-model:value="productForm.pricing.price"
                placeholder="680"
                suffix="$"
                style="border-radius: 8px"
                size="large"
              />
            </a-col>
          </a-row>

          <!-- <a-row :gutter="16" style="margin-bottom: 24px;">
            <a-col :span="8">
              <label style="display: block; margin-bottom: 6px; font-weight: 500; font-size: 14px; color: #374151;">Sale Price</label>
              <a-input v-model:value="productForm.pricing.sale_price" placeholder="600" suffix="$" style="border-radius: 8px;" size="large" />
            </a-col>
          </a-row> -->

          <!-- Dimensions -->
          <div style="margin-bottom: 24px">
            <h4
              style="
                margin-bottom: 16px;
                font-weight: 500;
                font-size: 14px;
                color: #1f2937;
              "
            >
              Dimensions
            </h4>

            <a-row :gutter="16">
              <a-col
                :span="8"
                v-for="dim in ['height', 'length', 'width']"
                :key="dim"
              >
                <label
                  style="
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    font-size: 13px;
                    color: #6b7280;
                    text-transform: capitalize;
                  "
                >
                  {{ dim }}<span style="color: red">*</span>
                  <span
                    style="
                      margin-left: 8px;
                      color: #9ca3af;
                      font-size: 13px;
                      min-width: 20px;
                    "
                  >
                    ( meter )
                  </span>
                </label>

                <div style="display: flex; align-items: center">
                  <a-input
                    type="text"
                    inputmode="decimal"
                    oninput="
                      this.value = this.value
                        .replace(/[^0-9.]/g, '')
                        .replace(/(\..*)\./g, '$1')
                    "
                    v-model:value="productForm.dimensions[dim]"
                    :placeholder="dim === 'height' ? '100' : '30'"
                    style="border-radius: 6px"
                  />
                </div>
              </a-col>
            </a-row>
          </div>

          <!-- Colors & Textures -->
          <a-row :gutter="24">
            <!-- Colors Section - Updated -->
            <a-col :span="12">
              <h4
                style="
                  margin-bottom: 16px;
                  font-weight: 500;
                  font-size: 14px;
                  color: #1f2937;
                "
              >
                Colors<span style="color: red">*</span>
              </h4>
              <div
                style="
                  display: flex;
                  gap: 12px;
                  align-items: center;
                  flex-wrap: wrap;
                  margin-bottom: 12px;
                "
              >
                <!-- Existing Colors -->
                <div
                  v-for="color in selectedProduct.colors.available_colors"
                  :key="color.id"
                  style="
                    position: relative;
                    margin-right: 12px;
                    margin-bottom: 12px;
                  "
                >
                  <!-- Primary Badge -->
                  <div
                    v-if="color.is_primary"
                    style="
                      position: absolute;
                      top: -6px;
                      left: -6px;
                      background: #10b981;
                      color: white;
                      border-radius: 50%;
                      width: 20px;
                      height: 20px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 10px;
                      z-index: 2;
                    "
                  >
                    ★
                  </div>

                  <!-- Color Box Container -->
                  <div style="position: relative">
                    <!-- Color Box -->
                    <div
                      @click="setPrimaryColor(color.id, color.color)"
                      :style="{
                        width: '58px',
                        height: '58px',
                        borderRadius: '5px',
                        backgroundColor: color.color,
                        cursor: 'pointer',
                        border:
                          productForm.colors.primary_color === color.color ||
                          color.is_primary
                            ? '3px solid #3b82f6'
                            : '2px solid #e5e7eb',
                        boxShadow: color.is_primary
                          ? '0 0 8px rgba(59, 130, 246, 0.5)'
                          : 'none',
                      }"
                    ></div>

                    <!-- Edit Icon (Bottom Right Corner) -->
                    <div
                      @click.stop="openColorEditPopup(color)"
                      style="
                        position: absolute;
                        bottom: -4px;
                        right: -4px;
                        background: white;
                        border: 1px solid #d1d5db;
                        border-radius: 50%;
                        width: 18px;
                        height: 18px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 10px;
                        z-index: 1;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        transition: all 0.2s;
                      "
                      @mouseenter="
                        (e) => (e.target.style.transform = 'scale(1.1)')
                      "
                      @mouseleave="
                        (e) => (e.target.style.transform = 'scale(1)')
                      "
                      :title="
                        color.model_file_colored_product
                          ? 'Edit 3D model'
                          : 'Add 3D model'
                      "
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        :stroke="
                          color.model_file_colored_product
                            ? '#10b981'
                            : '#6b7280'
                        "
                        stroke-width="2"
                        style="display: block"
                      >
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        ></path>
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Delete Button (Top Right Corner) -->
                  <div
                    @click.stop="deleteColor(color.id)"
                    v-if="!color.is_primary"
                    style="
                      position: absolute;
                      top: -8px;
                      right: -8px;
                      background: #ef4444;
                      color: #fff;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      font-size: 14px;
                      font-weight: bold;
                      cursor: pointer;
                      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                      z-index: 2;
                      transition: all 0.2s;
                    "
                    @mouseenter="
                      (e) => (e.target.style.transform = 'scale(1.1)')
                    "
                    @mouseleave="(e) => (e.target.style.transform = 'scale(1)')"
                    title="Delete color"
                  >
                    ×
                  </div>
                </div>

                <!-- Add Color Button -->
                <div style="position: relative">
                  <input
                    type="color"
                    v-model="customColor"
                    @change="addColor(customColor)"
                    style="
                      opacity: 0;
                      position: absolute;
                      width: 36px;
                      height: 36px;
                      cursor: pointer;
                    "
                  />
                  <div style="margin-bottom: 20px">
                    <label
                      style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 13px;
                        color: #374151;
                      "
                      >Available Colors<span style="color: red">*</span></label
                    >

                    <a-popover trigger="click" placement="bottom">
                      <template #title>
                        <div
                          style="display: flex; align-items: center; gap: 8px"
                        >
                          <span>Add Available Colors</span>
                          <input
                            type="color"
                            :value="tempColor"
                            @input="tempColor = $event.target.value"
                            @change="addColor(tempColor)"
                            style="
                              width: 30px;
                              height: 25px;
                              border: none;
                              border-radius: 4px;
                              cursor: pointer;
                            "
                          />
                          <a-button
                            type="primary"
                            size="small"
                            @click="addAvailableColor"
                            style="margin-left: 8px"
                          >
                            Add
                          </a-button>
                        </div>
                      </template>
                      <template #content>
                        <div
                          style="
                            display: grid;
                            grid-template-columns: repeat(6, 32px);
                            gap: 8px;
                            padding: 8px;
                          "
                        >
                          <div
                            v-for="(color, index) in presetColors"
                            :key="index"
                            @click="addColor(color)"
                            :style="{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: color,
                              cursor: 'pointer',
                              border: '1px solid #e5e7eb',
                              opacity: selectedColors?.some(
                                (c) => c.value === color,
                              )
                                ? 0.5
                                : 1,
                            }"
                          ></div>
                        </div>
                      </template>
                      <a-button
                        class="!flex !justify-center !align-center"
                        style="border-radius: 6px; border: 2px dashed #d1d5db;display: flex;justify-content: center;align-items: center;gap:10px;"
                      >
                        
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        
                        Add Colors
                      </a-button>
                    </a-popover>

                    <div
                      v-if="selectedColors?.length > 0"
                      style="margin-top: 12px"
                    >
                      <div style="display: flex; flex-wrap: wrap; gap: 8px">
                        <div
                          v-for="(color, index) in selectedColors"
                          :key="index"
                          style="position: relative"
                        >
                          <div
                            :style="{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              backgroundColor: color.value,
                              border: color.isPrimary
                                ? '2px solid #22c55e'
                                : '2px solid #e5e7eb',
                              cursor: 'pointer',
                              position: 'relative',
                              transition: 'all 0.2s ease',
                            }"
                            @click="setPrimaryColor(color)"
                          ></div>
                          <div
                            v-if="color.isPrimary"
                            style="
                              position: absolute;
                              left: -5px;
                              bottom: -5px;
                              background: #22c55e;
                              color: white;
                              border-radius: 50%;
                              width: 20px;
                              height: 20px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              font-size: 12px;
                              box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
                            "
                          >
                            ★
                          </div>
                          <a-button
                            type="text"
                            size="small"
                            @click="removeColor(index)"
                            style="
                              position: absolute;
                              top: -8px;
                              right: -8px;
                              background: #ef4444;
                              color: white;
                              border-radius: 50%;
                              width: 20px;
                              height: 20px;
                              padding: 0;
                              min-width: 20px;
                            "
                          >
                            <template #icon>
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="3"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </template>
                          </a-button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <div style="margin-top:-5px;width: 58px; height: 58px; border-radius: 8px; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #f9fafb;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div> -->
                </div>
              </div>
            </a-col>

            <a-col :span="12">
              <div
                class="flex flex-wrap"
                style="
                  display: flex;
                  align-items: center;
                  gap: 12px;
                "
              >
                <h4
                  style="
                    margin-bottom: 16px;
                    font-weight: 500;
                    font-size: 14px;
                    color: #1f2937;
                  "
                >
                  Textures<span style="color: red">*</span>
                </h4>
              </div>
              <div
                style="
                  display: flex;
                  gap: 12px;
                  align-items: center;
                  flex-wrap: wrap;
                  margin-bottom: 16px;
                "
              >
                <!-- Existing Textures -->
                <div
                  v-for="texture in selectedProduct.textures"
                  :key="texture.id"
                  style="
                    position: relative;
                    width: 48px;
                    height: 36px;
                    margin-right: 10px;
                  "
                >
                  <!-- Texture Box -->
                  <div
                    @click="selectTexture(texture.id)"
                    :style="{
                      width: '58px',
                      height: '58px',
                      borderRadius: '8px',
                      backgroundImage: `url(${$store.state.root_media_api + texture.texture})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border:
                        selectedTexture === texture.id
                          ? '3px solid #3b82f6'
                          : '2px solid #e5e7eb',
                      cursor: 'pointer',
                    }"
                  ></div>

                  <!-- Delete Button -->
                  <div
                    @click.stop="deleteTexture(texture.id)"
                    style="
                      position: absolute;
                      top: -6px;
                      right: -6px;
                      background: #ef4444;
                      color: #fff;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      font-size: 14px;
                      font-weight: bold;
                      line-height: 1;
                      cursor: pointer;
                      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    "
                  >
                    ×
                  </div>
                </div>
              </div>
              <div class="!flex gap-1">
<!-- Add Texture from Library -->
                <a-popover trigger="click" placement="bottom">
                  <template #title>
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                      "
                    >
                      <span>Select Texture from Library</span>
                      <a-spin
                        v-if="loadingAvailableTextures || loadingMoreTextures"
                        size="small"
                        style="margin-left: 8px"
                      />
                    </div>
                  </template>
                  <template #content>
                    <div
                      v-if="loadingAvailableTextures"
                      style="text-align: center; padding: 20px"
                    >
                      <a-spin />
                    </div>
                    <div
                      v-else-if="availableTexturesLibrary.length === 0"
                      style="text-align: center; padding: 20px; color: #6b7280"
                    >
                      <p style="font-size: 12px; margin: 0">
                        No textures available in library
                      </p>
                    </div>
                    <div
                      v-else
                      style="
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                      "
                    >
                      <div
                        style="
                          display: grid;
                          grid-template-columns: repeat(4, 60px);
                          gap: 8px;
                          max-height: 300px;
                          overflow-y: auto;
                          padding: 8px;
                        "
                      >
                        <div
                          v-for="(texture, index) in availableTexturesLibrary"
                          :key="index"
                          @click="addTextureFromLibrary(texture)"
                          :style="{
                            width: '60px',
                            height: '60px',
                            borderRadius: '8px',
                            backgroundImage: `url('${getTextureUrl(texture.url)}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            cursor: 'pointer',
                            border: '2px solid #e5e7eb',
                            opacity: isTextureSelected(texture.id) ? 0.5 : 1,
                            transition: 'all 0.2s ease',
                          }"
                          :title="texture.name || 'Texture'"
                        >
                          <div
                            v-if="isTextureSelected(texture.id)"
                            style="
                              width: 100%;
                              height: 100%;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              background: rgba(0, 0, 0, 0.3);
                              border-radius: 6px;
                            "
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="white"
                              stroke="white"
                              stroke-width="2"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="hasMoreTextures"
                        style="
                          display: flex;
                          justify-content: center;
                          padding: 12px;
                          border-top: 1px solid #f0f0f0;
                        "
                      >
                        <a-button
                          @click="loadMoreTextures"
                          :loading="loadingMoreTextures"
                          style="width: 100%"
                          size="small"
                        >
                          {{ loadingMoreTextures ? "Loading..." : "Load More" }}
                        </a-button>
                      </div>
                    </div>
                  </template>
                  <a-button
                    style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      gap: 5px;
                      border-radius: 6px;
                      border: 2px dashed #d1d5db;
                      margin-top: 25px;
                    "
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>

                    Select Texture
                  </a-button>
                </a-popover>

                <!-- Upload Custom Texture -->
                <a-button
                  @click="uploadTexture"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 5px;
                    border-radius: 6px;
                    border: 2px dashed #d1d5db;
                    margin-top: 25px;
                  "
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
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </template>
                  Upload Custom
                </a-button>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>

    <!-- Hidden File Inputs -->
    <input
      ref="imageInput"
      type="file"
      style="display: none"
      accept=".jpg,.jpeg,.png"
      multiple
      @change="handleImageUpload"
    />
    <input
      ref="textureInput"
      type="file"
      style="display: none"
      accept=".jpg,.jpeg,.png,.hdr,.exr"
      @change="handleTextureUpload"
    />
  </div>
  <!-- Color Edit Popup -->
  <!-- Color Edit Popup -->
  <a-modal
    v-model:visible="colorEditPopupVisible"
    centered
    style="width: 900px; min-height: 500px"
  >
    <template #title>
      <!-- <div style="display:flex;gap:10px;flex-direction: row;font-weight:bold">
      <div 
      :style="{
        width: '20px',
        height: '20px',
        borderRadius: '12px',
        backgroundColor: editingColor?.color,
        border: '2px solid #e5e7eb'
      }"
    ></div> <h3 style="margin-top:-3px;">Add 3D model with color</h3>
  </div> -->
    </template>
    <template #footer>
      <a-button @click="closeColorEditPopup">Cancel</a-button>

      <a-button
        type="primary"
        @click="updateColor"
        :disabled="!uploaded3dModelFile"
        >Update</a-button
      >
    </template>
    <div style="text-align: center">
      <!-- {{editingColor}} -->
      <a-row>
        <!-- 3D Model Section -->
        <a-col :xs="24" :sm="12" :md="12" :lg="12">
          <div style="display: flex; gap: 10px">
            <div
              :style="{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: editingColor?.color,

                border: '2px solid #e5e7eb',
              }"
            ></div>
            <div>
              <div style="text-align: left">
                <h3
                  style="
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2937;
                  "
                >
                  3D Model
                </h3>
              </div>
              <p style="color: #6b7280; font-size: 13px; text-align: left">
                Upload 3D model (.glb, .gltf up to 50MB)
              </p>
            </div>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12" :md="12" :lg="12">
          <div style="display: flex; justify-content: center">
            <!-- <div>

        <a-radio-group v-model:value="upload3dModelFrom">
          <a-radio-button value="LocalDevice">Local System</a-radio-button>
          <a-radio-button value="Generated3d_Models_History">DYD AI Generated</a-radio-button>
        </a-radio-group>
      </div> -->
          </div>

          <!-- Selected Color Display -->
        </a-col>
        <a-col
          :span="24"
          v-if="upload3dModelFrom !== 'Generated3d_Models_History'"
          style="min-height: 400px"
        >
          <div style="">
            <div style="">
              <!-- 3D Model Display (when model exists) -->
              <div
                v-if="hasColorModel"
                style="position: relative; padding: 10px"
              >
                <canvas_3d_model_renderer
                  :glbModelUrl="
                    get3DColorModelUrl(editingColor.model_file_colored_product)
                  "
                  :Model_instance_id="selectedProduct.id"
                  style="
                    width: 100%;
                    max-height: 300px;
                    height: 100%;
                    border-radius: 10px;
                  "
                />

                <!-- Change Model Button -->
                <a-button
                  @click="triggerFileInput"
                  style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: white;
                    border-radius: 6px;
                    font-size: 11px;
                  "
                  size="small"
                >
                  Change Model
                </a-button>

                <!-- Delete Button -->
                <!-- <a-button 
              type="text" 
              danger 
              @click="removeColorModel"
              style="
                position: absolute; 
                top: 12px; 
                right: 80px;
                background: rgba(255,255,255,0.9); 
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                border-radius: 6px; 
                width: 30px; 
                height: 30px; 
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
              "
            >
              <template #icon>
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                  style="display: block;"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </template>
            </a-button> -->
              </div>

              <!-- Upload 3D Model Area (when no model exists) -->
              <div
                v-else
                @click="triggerFileInput"
                @dragover.prevent="dragOver"
                @dragleave.prevent="dragLeave"
                @drop.prevent="dropColorModel"
                style="
                  width: 100%;
                  height: 300px;
                  border-radius: 12px;
                  background: #f9fafb;
                  border: 2px dashed #d1d5db;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                "
                :style="{
                  borderColor: isDragOver ? '#3b82f6' : '#d1d5db',
                  background: isDragOver ? '#eff6ff' : '#f9fafb',
                }"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  stroke-width="1"
                  style="margin-bottom: 16px"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <p
                  style="
                    color: #6b7280;
                    font-size: 14px;
                    margin: 0 0 4px 0;
                    font-weight: 500;
                  "
                >
                  {{
                    isDragOver
                      ? "Drop 3D model here"
                      : "Drag and drop 3D model here, or click to upload"
                  }}
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0">
                  Supported: .glb, .gltf (50MB max)
                </p>
              </div>
            </div>
          </div>
        </a-col>
        <a-col
          :span="24"
          v-if="upload3dModelFrom === 'Generated3d_Models_History'"
          style="min-height: 400px"
        >
          <a-row>
            <a-col :sm="24" :xs="24" :md="12" :lg="12">
              <history_model_preview_3d
                :glbModelUrl="this.selected_color_model_url"
                :Model_instance_id="selectedProduct.id"
                style="
                  width: 100%;
                  min-height: 300px;
                  height: 100%;
                  border-radius: 10px;
                "
              />
            </a-col>
            <a-col :sm="24" :xs="24" :md="12" :lg="12">
              <select3d_model_for_color
                :list_history_generated_3d_models="
                  list_history_generated_3d_models
                "
                :loading_generated_models_history="
                  loading_generated_models_history
                "
                @clicked-model="clickedModel"
              />
            </a-col>
          </a-row>
<!-- {{ selected_model_uuid_primary_key }} -->
          <!-- {{list_history_generated_3d_models }} -->

          <div></div>
        </a-col>
        <!-- Add this inside the Color Edit Popup modal, after the 3D Model section -->
        <a-col
          :span="24"
          style="
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #f0f0f0;
          "
        >
          <h4
            style="
              margin-bottom: 16px;
              font-weight: 600;
              font-size: 14px;
              color: #1f2937;
            "
          >
            Associated Texture
          </h4>

          <div
            v-if="
              selectedProduct.textures && selectedProduct.textures.length > 0
            "
          >
            <p style="color: #6b7280; font-size: 13px; margin-bottom: 12px">
              Select a texture to associate with this color
            </p>

            <!-- Texture Grid -->
            <div
              style="
                display: flex;
                gap: 12px;
                align-items: center;
                flex-wrap: wrap;
              "
            >
              <!-- No Texture Option -->
              <div
                @click="selectColorTexture(null)"
                :style="{
                  width: '58px',
                  height: '58px',
                  borderRadius: '8px',
                  background: '#f9fafb',
                  border:
                    editingColor?.selected_texture_id === null
                      ? '3px solid #3b82f6'
                      : '2px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }"
                style="cursor: pointer"
                title="No texture"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  stroke-width="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>

              <!-- Existing Textures -->
              <div
                v-for="texture in selectedProduct.textures"
                :key="texture.id"
                @click="selectColorTexture(texture.id)"
                :style="{
                  width: '58px',
                  height: '58px',
                  borderRadius: '8px',
                  backgroundImage: `url(${$store.state.root_media_api + texture.texture})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border:
                    editingColor?.selected_texture_id === texture.id
                      ? '3px solid #3b82f6'
                      : '2px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow:
                    editingColor?.selected_texture_id === texture.id
                      ? '0 0 8px rgba(59, 130, 246, 0.5)'
                      : 'none',
                }"
              ></div>
            </div>
          </div>

          <div
            v-else
            style="
              padding: 16px;
              background: #f9fafb;
              border-radius: 8px;
              text-align: center;
            "
          >
            <p style="color: #6b7280; margin: 0; font-size: 13px">
              No textures available. Add textures to the product first.
            </p>
          </div>
        </a-col>
      </a-row>

      <!-- Buttons -->
    </div>

    <!-- Hidden File Input for Color Model -->
    <input
      ref="colorFileInput"
      type="file"
      style="display: none"
      accept=".glb,.gltf"
      @change="handleColorModelUpload"
    />
  </a-modal>
</template>

<script>
import canvas_3d_model_renderer from "@/components/store/canvas_3d_model_renderer.vue";
import history_model_preview_3d from "@/components/dashboard/business/my_products/add_color_3d_model/history_model_preview_3d.vue";
import select3d_model_for_color from "@/components/dashboard/business/my_products/add_color_3d_model/dyd_generated.vue";
export default {
  name: "edit_product_details_store_page_business_user",
  components: {
    canvas_3d_model_renderer,
    history_model_preview_3d,
    select3d_model_for_color,
  },
  props: {
    selectedProduct: { type: Object, required: true },
    categories_available: { type: Array, required: true },
    types: { type: Array, required: true },
  },
  data() {
    return {
      presetColors: [
        "#000000",
        "#FFFFFF",
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#FF00FF",
        "#00FFFF",
        "#C0C0C0",
        "#808080",
        "#800000",
        "#808000",
        "#008000",
        "#800080",
        "#008080",
        "#000080",
        "#FFA500",
        "#FFC0CB",
        "#A52A2A",
        "#DDA0DD",
        "#98FB98",
        "#F0E68C",
        "#DEB887",
        "#D2691E",
        "#FF6347",
        "#40E0D0",
        "#EE82EE",
        "#90EE90",
        "#FFB6C1",
        "#87CEEB",
      ],
      selected_model_uuid_primary_key:'',
      loading_generated_models_history: true,
      list_history_generated_3d_models: [],
      selected_color_model_url: "",
      model_instance_id_generated_history: "",

      upload3dModelFrom: "Generated3d_Models_History",
      editingColor: null,
      uploaded3dModelFile: null,
      colorModelDragOver: false,
      colorEditPopupVisible: false,
      productForm: {
        name: "",
        description: "",
        original_item_link: "",
        category_name: "",
        furniture_type: "",
        pricing: { price: "", sale_price: "" },
        dimensions: { height: "", length: "", width: "", depth: "" },
        colors: { primary_color: "" },
      },
      selectedTexture: null,
      customColor: "#8B4513",
      isDragOver: false,
      isSaving: false,
      pending3DModel: null,
      imagePreviewsState: [],
      hasUnsavedChanges: false,
      local3dModelUrl: null,
      is_resizable: false,
      availableTexturesLibrary: [],
      loadingAvailableTextures: false,
      pendingTextureAdditions: [],
      texturesPaginationOffset: 0,
      texturesPaginationLimit: 10,
      hasMoreTextures: false,
      loadingMoreTextures: false,
      // Room type & category
      selectedRoomType: null,
      selectedRoomTypeName: null,
      roomTypes: [],
      loadingRoomTypes: false,
      categoryOptions: [],
      allCategories: [],
      loadingCategories: false,
      categorySearchTimeout: null,
    };
  },
  computed: {
    has3DModel() {
      return this.selectedProduct["3d_model"] || this.pending3DModel;
    },
    hasColorModel() {
      return (
        this.editingColor?.model_file_colored_product ||
        this.uploaded3dModelFile
      );
    },
  },
 async mounted() {
  await this.loadRoomTypes();  // Wait for room types to load first
  this.initializeForm();       // Then initialize the form with the loaded room types
  this.fetch3d_models_generated_by_user();
  this.loadAvailableTexturesLibrary();
  window.addEventListener("beforeunload", this.handleBeforeUnload);
},
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
    this.cleanupPreviews();
  },
  watch: {
  selectedProduct: {
  async handler() {
    if (this.roomTypes.length === 0) {
      await this.loadRoomTypes(); // ensure roomTypes loaded before initializing
    }
    this.initializeForm();
    this.loadAvailableTexturesLibrary();
  },
  deep: true,
  immediate: false, // ← don't fire on component creation, let mounted() handle it
},
  productForm: {
    handler() {
      this.hasUnsavedChanges = true;
    },
    deep: true,
  },
},
  methods: {
    async loadRoomTypes() {
  try {
    this.loadingRoomTypes = true;
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.$store.state.root_api}product/api/room-types/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }
    });
    const result = await response.json();
    this.roomTypes = result || [];
  } catch (error) {
    console.error('Error loading room types:', error);
    this.roomTypes = [];
  } finally {
    this.loadingRoomTypes = false;
  }
},

handleRoomTypeChange(value) {
  const selectedRoom = this.roomTypes.find(rt => rt.id === value);
  this.selectedRoomType = value;
  this.selectedRoomTypeName = selectedRoom ? selectedRoom.name : null;
  
  // Properly reset the category
  this.productForm.category_name =[];  
  this.categoryOptions = [];
  this.allCategories = [];
  
  if (value) {
    this.loadInitialCategories();
  }
},

async loadInitialCategories() {
  try {
    this.loadingCategories = true;
    const token = localStorage.getItem('token');
    const roomTypeParam = this.selectedRoomType ? `?room_type=${encodeURIComponent(this.selectedRoomType)}` : '';
    const response = await fetch(`${this.$store.state.root_api}product/api/categories/${roomTypeParam}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }
    });
    const result = await response.json();
    if (result.success) {
      this.allCategories = result.data || [];
      this.categoryOptions = this.allCategories.map(cat => ({
        label: cat.name,
        value: cat.name,
        data: cat
      }));
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  } finally {
    this.loadingCategories = false;
  }
},

async handleCategorySearch(searchValue) {
  if (this.categorySearchTimeout) clearTimeout(this.categorySearchTimeout);
  if (!searchValue?.trim()) {
    this.categoryOptions = this.allCategories.map(cat => ({ label: cat.name, value: cat.name }));
    return;
  }
  this.loadingCategories = true;
  this.categorySearchTimeout = setTimeout(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${this.$store.state.root_api}product/api/categories/?q=${encodeURIComponent(searchValue)}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` } }
      );
      const result = await response.json();
      this.categoryOptions = result.success
        ? result.data.map(cat => ({ label: cat.name, value: cat.name }))
        : [];
    } catch (error) {
      this.categoryOptions = [];
    } finally {
      this.loadingCategories = false;
    }
  }, 300);
},

handleSelectFocus() {
  if (this.categoryOptions.length === 0) {
    this.categoryOptions = this.allCategories.map(cat => ({ label: cat.name, value: cat.name }));
  }
},

 handleCategoryChange(value) {
    console.log('Category changed:', value);
   
    
   
    if (Array.isArray(value)) {
     
      if (value.length > 1) {
        console.log('⚠️ Only one category allowed, keeping last selected');
        this.productForm.category_name = [value[value.length - 1]];
      } else if (value.length === 1) {
        console.log('✅ Category selected:', value[0]);
        this.productForm.category_name = value;
      } else {
        console.log('🗑️ Category cleared');
        this.productForm.category_name = [];
      }
    } else {
      
      this.productForm.category_name = value ? [value] : [];
    }
    
    console.log('Final value stored:', this.productForm.category_name);
  },
    addAvailableColor() {
      if (
        this.tempColor &&
        !this.selectedColors.some((c) => c.value === this.tempColor)
      ) {
        // Create color object with isPrimary flag
        const colorObj = {
          value: this.tempColor,
          isPrimary: this.selectedColors.length === 0, // First color is primary
        };
        this.selectedColors.push(colorObj);
        this.tempColor = "#000000";
      }
    },
    async loadAvailableTexturesLibrary() {
      try {
        this.loadingAvailableTextures = true;
        this.texturesPaginationOffset = 0;
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `${this.$store.state.root_api}product/api/products/user-textures/?limit=${this.texturesPaginationLimit}&offset=${this.texturesPaginationOffset}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result) {
          this.availableTexturesLibrary = (result.results.data || []).map(
            (texture) => ({
              id: texture?.id,
              name: texture?.name || "Texture",
              url: texture?.image_url || texture?.url,
            }),
          );

          // Check if there are more textures available
          this.hasMoreTextures = result.next !== null;
          this.texturesPaginationOffset += this.texturesPaginationLimit;

          console.log(
            " Available textures loaded:",
            this.availableTexturesLibrary.length,
          );
          console.log(" Has more textures:", this.hasMoreTextures);
        } else {
          console.warn(" Failed to load textures or no data returned");
          this.availableTexturesLibrary = [];
          this.hasMoreTextures = false;
        }
      } catch (error) {
        console.error(" Error loading available textures:", error);
        this.$message.error("Failed to load texture library");
        this.availableTexturesLibrary = [];
        this.hasMoreTextures = false;
      } finally {
        this.loadingAvailableTextures = false;
      }
    },
    getTextureUrl(texturePath) {
      if (!texturePath) return "";

      // If it's already a full URL or data URL, return as is
      if (texturePath.startsWith("http") || texturePath.startsWith("data:")) {
        return texturePath;
      }

      // Otherwise append the base API URL
      return `${this.$store.state.root_media_api}${texturePath}`;
    },
    isTextureSelected(textureId) {
      return (
        this.selectedProduct.textures.some((t) => t.id === textureId) ||
        this.pendingTextureAdditions.some((t) => t.id === textureId)
      );
    },
    async addTextureFromLibrary(texture) {
      try {
        // Check if already added
        if (this.isTextureSelected(texture.id)) {
          this.$message.warning("This texture is already added to the product");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const formData = new FormData();
        formData.append("texture_ids", JSON.stringify([texture.id]));

        // Call the API to add texture from library
        const response = await fetch(
          `${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/textures/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              // 'Content-Type': 'application/json'
            },
            body: formData,
          },
        );

        const result = await response.json();

        if (result.success) {
          // Add the texture to the product's texture list
          if (result.data && result.data.length > 0) {
            result.data.forEach((textureData) => {
              this.selectedProduct.textures.push({
                id: textureData.id,
                texture: textureData.texture,
              });
            });

            this.$message.success("Texture added successfully");
            this.hasUnsavedChanges = true;
          }
        } else {
          this.$message.error(result.message || "Failed to add texture");
          console.error("API Error:", result);
        }
      } catch (error) {
        console.error("Error adding texture from library:", error);
        this.$message.error("Error adding texture. Please try again.");
      }
    },
    async loadMoreTextures() {
      try {
        this.loadingMoreTextures = true;
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `${this.$store.state.root_api}product/api/products/user-textures/?limit=${this.texturesPaginationLimit}&offset=${this.texturesPaginationOffset}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result) {
          const newTextures = (result.results.data || []).map((texture) => ({
            id: texture?.id,
            name: texture?.name || "Texture",
            url: texture?.image_url || texture?.url,
          }));

          // Append new textures to existing list
          this.availableTexturesLibrary.push(...newTextures);

          // Check if there are more textures available
          this.hasMoreTextures = result.next !== null;
          this.texturesPaginationOffset += this.texturesPaginationLimit;

          console.log(
            " More textures loaded. Total now:",
            this.availableTexturesLibrary.length,
          );
          console.log(" Has more textures:", this.hasMoreTextures);
        } else {
          this.hasMoreTextures = false;
        }
      } catch (error) {
        console.error("❌ Error loading more textures:", error);
        this.$message.error("Failed to load more textures");
      } finally {
        this.loadingMoreTextures = false;
      }
    },
    handleResizableChange(value) {
      this.is_resizable = value;
    },
    clickedModel(e) {
      this.selected_model_uuid_primary_key= e['new3d_model_instance']
      const fixedUrl = e["media_url"].replace(/\\/g, "/");
      this.selected_color_model_url =
        this.$store.state.root_media_api + fixedUrl;

      this.uploaded3dModelFile = {
        file: null,
        isGenerated: true,
        generatedUrl: fixedUrl,
      };
    },
    async urlToFile(url, filename) {
      // Fetch from URL
      const response = await fetch(this.$store.state.root_media_api + url);

      // Convert to Blob
      const blob = await response.blob();

      const file = new File([blob], filename, {
        type: blob.type,
      });

      return file;
    },

    // 3. Enhanced fetch3d Models History  method with immediate update the History
    async fetch3d_models_generated_by_user() {
      this.loading_generated_models_history = true;

      try {
        const url = `${this.$store.state.root_api}engine/generated-3d-models-user-history/`;

        console.log("📡 Fetching generated 3D models history...");

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        });

        // 🔴 Handle HTTP errors
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // ✅ Parse JSON
        const responseData = await response.json();

        // ✅ Safely extract data
        this.list_history_generated_3d_models = responseData.models ?? [];
      } catch (error) {
        console.error("❌ Failed to fetch history generated 3D Models:", error);

        this.error.general = error.message;

        this.showError(
          "Failed to fetch history generated 3D Models",
          error.message,
          () => this.fetch3d_models_generated_by_user(),
        );
      } finally {
        this.loading_generated_models_history = false;
      }
    },
    async setPrimaryColor(colorId, colorHex) {
      try {
        const token = localStorage.getItem("token");

        // Call API to set primary color
        const response = await fetch(
          `${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/colors/${colorId}/set-primary/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );

        const result = await response.json();

        if (result.success) {
          // Update all colors to remove primary status
          this.selectedProduct.colors.available_colors.forEach((color) => {
            color.is_primary = false;
          });

          // Set the selected color as primary
          const selectedColor =
            this.selectedProduct.colors.available_colors.find(
              (c) => c.id === colorId,
            );
          if (selectedColor) {
            selectedColor.is_primary = true;
            this.productForm.colors.primary_color = colorHex;
          }

          this.$message.success("Primary color updated successfully");
        } else {
          this.$message.error(result.message || "Failed to set primary color");
        }
      } catch (error) {
        console.error("Error setting primary color:", error);
        this.$message.error("Error setting primary color");
      }
    },

    openColorEditPopup(color) {
      this.editingColor = {
        ...color,
        selected_texture_id: color.selected_texture_id || null,
      };
      this.uploaded3dModelFile = null;
      this.local3dModelUrl = null;
      this.colorEditPopupVisible = true;
    },

    async updateColor() {
      if (
        !this.uploaded3dModelFile &&
        !this.editingColor?.model_file_colored_product
      ) {
        this.$message.warning("Please upload a 3D model file");
        return;
      }

      if (!this.editingColor) {
        this.$message.error("No color selected");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        let fileToUpload = this.uploaded3dModelFile.file;

        if (this.uploaded3dModelFile.isGenerated && !fileToUpload) {
          const originalFileName = this.uploaded3dModelFile.generatedUrl
            .split("/")
            .pop();

          fileToUpload = await this.urlToFile(
            this.uploaded3dModelFile.generatedUrl,
            originalFileName,
          );
        }

        // formData.append("model_file_colored_product", fileToUpload);
        formData.append("selected_file_id_model_file_colored_product", this.selected_model_uuid_primary_key);

        // Add texture association
        if (
          this.editingColor.selected_texture_id !== null &&
          this.editingColor.selected_texture_id !== undefined
        ) {
          formData.append("texture_id", this.editingColor.selected_texture_id);
        } else {
          formData.append("texture_id", ""); // Empty to remove texture association
        }

        const response = await fetch(
          `${this.$store.state.root_api}product/api-product-owner/products/colors/${this.editingColor.id}/update-model/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Token ${token}`,
            },
            body: formData,
          },
        );

        const result = await response.json();

        if (result.success) {
          if (this.uploaded3dModelFile) {
            this.editingColor.model_file_colored_product =
              result.data.model_file_colored_product;
          }

          this.editingColor.selected_texture_id =
            result.data.selected_texture_id || null;

          const colorIndex =
            this.selectedProduct.colors.available_colors.findIndex(
              (c) => c.id === this.editingColor.id,
            );
          if (colorIndex !== -1) {
            if (this.uploaded3dModelFile) {
              this.selectedProduct.colors.available_colors[
                colorIndex
              ].model_file_colored_product =
                result.data.model_file_colored_product;
            }
            this.selectedProduct.colors.available_colors[
              colorIndex
            ].selected_texture_id = result.data.selected_texture_id || null;
          }

          this.$message.success("Color model and texture updated successfully");

          this.uploaded3dModelFile = null;
          this.local3dModelUrl = null;
          this.colorEditPopupVisible = false;
        } else {
          this.$message.error(result.message || "Failed to update color model");
        }
      } catch (error) {
        console.error("Error updating color model:", error);
        this.$message.error("Error updating color model. Please try again.");
      }
    },
   initializeForm() {
  if (this.selectedProduct) {
    this.productForm = {
      name: this.selectedProduct.name || "",
      description: this.selectedProduct.description || "",
      original_item_link: this.selectedProduct.original_item_link || "",
      category_name: this.selectedProduct.category?.name || "",
      furniture_type: this.selectedProduct.furniture_type || "",
      pricing: {
        price: this.selectedProduct.pricing?.price?.toString() || "",
        sale_price:
          this.selectedProduct.pricing?.sale_price?.toString() || "",
      },
      dimensions: {
        height: this.selectedProduct.dimensions?.height?.toString() || "",
        length: this.selectedProduct.dimensions?.length?.toString() || "",
        width: this.selectedProduct.dimensions?.width?.toString() || "",
        depth: this.selectedProduct.dimensions?.depth?.toString() || "",
      },
      colors: {
        primary_color: this.selectedProduct.colors?.primary_color || "",
      },
    };
    this.hasUnsavedChanges = false;
    this.imagePreviewsState = [];
    this.pending3DModel = null;
    this.is_resizable = this.selectedProduct?.is_resizable || false;
    
    // FIX: Access room_type correctly from the API response
    if (this.selectedProduct?.room_type) {
      this.selectedRoomType = this.selectedProduct.room_type.id || null;
      this.selectedRoomTypeName = this.selectedProduct.room_type.name || null;
      
      // Log to verify values
      console.log('Setting room type:', {
        id: this.selectedRoomType,
        name: this.selectedRoomTypeName,
        availableRoomTypes: this.roomTypes
      });
      
      // Load categories for this room type
      if (this.selectedRoomType) {
        this.loadInitialCategories();
      }
    } else {
      this.selectedRoomType = null;
      this.selectedRoomTypeName = null;
    }
  }
},

    get3DModelUrl() {
      return this.pending3DModel
        ? URL.createObjectURL(this.pending3DModel)
        : this.$store.state.root_media_api + this.selectedProduct["3d_model"];
    },

    get3DColorModelUrl(url) {
      if (this.local3dModelUrl) {
        return this.local3dModelUrl;
      }

      if (!url) {
        console.warn("URL is empty or undefined");
        return "";
      }

      const baseUrl = this.$store.state.root_media_api;
      const cleanUrl = url.startsWith("/") ? url : `/${url}`;

      return `${baseUrl}${cleanUrl}`;
    },

    handleBeforeUnload(e) {
      if (this.hasUnsavedChanges) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        e.returnValue = message;
        return message;
      }
    },

    cancel_edit_back_product_list() {
      if (this.hasUnsavedChanges) {
        this.$confirm({
          title: "Unsaved Changes",
          content:
            "You have unsaved changes. Are you sure you want to leave without saving?",
          okText: "Leave",
          okType: "danger",
          cancelText: "Stay",
          onOk: () =>
            this.$emit(
              "cancel_edit_back_product_list",
              this.selectedProduct.id,
            ),
        });
      } else {
        this.$emit("cancel_edit_back_product_list", this.selectedProduct.id);
      }
    },
    selectColorTexture(textureId) {
      if (this.editingColor) {
        this.editingColor.selected_texture_id = textureId;
        this.$message.success(
          textureId ? "Texture selected" : "Texture removed",
        );
      }
    },

    // File Upload Methods
    upload3DModel() {
      this.$refs.fileInput.click();
    },
    uploadMoreImages() {
      this.$refs.imageInput.click();
    },
    uploadTexture() {
      this.$refs.textureInput.click();
    },

    // handle3DModelUpload(event) {
    //   const file = event.target.files[0];
    //   if (file && this.validate3DModelFile(file)) {
    //     this.pending3DModel = file;
    //     this.hasUnsavedChanges = true;
    //     this.$message.success(`3D Model "${file.name}" ready for upload.`);
    //   }
    //   event.target.value = '';
    // },

    process3dModelFile(file) {
      if (this.local3dModelUrl) {
        URL.revokeObjectURL(this.local3dModelUrl);
      }

      // Create new URL
      const url = URL.createObjectURL(file);
      this.local3dModelUrl = url; // Vue reactivity automatically detects this change

      this.uploaded3dModelFile = {
        file: file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      };

      console.log(" 3D Model loaded locally:", file.name);
    },

    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        if (this.validateImageFile(file)) {
          const preview = {
            file,
            url: URL.createObjectURL(file),
            uploading: false,
          };
          this.imagePreviewsState.push(preview);
        }
      });
      event.target.value = "";
    },

    async handleTextureUpload(event) {
      const file = event.target.files[0];

      if (!file) {
        return;
      }

      if (!this.validateTextureFile(file)) {
        event.target.value = "";
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const formData = new FormData();
        formData.append("texture", file);

        // Call the API to add custom texture
        const response = await fetch(
          `${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/textures/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
            },
            body: formData,
          },
        );

        const result = await response.json();

        if (result.success) {
          // Add the texture to the product's texture list
          if (result.data && result.data.length > 0) {
            result.data.forEach((textureData) => {
              this.selectedProduct.textures.push({
                id: textureData.id,
                texture: textureData.texture,
              });
            });

            this.$message.success("Custom texture uploaded successfully");
            this.hasUnsavedChanges = true;
          }
        } else {
          this.$message.error(result.message || "Failed to upload texture");
          console.error("API Error:", result);
        }
      } catch (error) {
        console.error("Error uploading texture:", error);
        this.$message.error("Error uploading texture. Please try again.");
      } finally {
        event.target.value = "";
      }
    },

    validateTextureFile(file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      const maxSize = 20 * 1024 * 1024; // 20MB

      if (!validTypes.includes(file.type)) {
        this.$message.error(
          "Invalid texture file type. Please upload JPEG, JPG, or PNG files only.",
        );
        return false;
      }

      if (file.size > maxSize) {
        this.$message.error(
          "Texture file size too large. Please upload files smaller than 20MB.",
        );
        return false;
      }

      return true;
    },

    removePreview(index) {
      const preview = this.imagePreviewsState[index];
      if (preview.url) URL.revokeObjectURL(preview.url);
      this.imagePreviewsState.splice(index, 1);
    },

    cleanupPreviews() {
      this.imagePreviewsState.forEach((preview) => {
        if (preview.url) URL.revokeObjectURL(preview.url);
      });
      this.imagePreviewsState = [];
    },

    // Validation Methods
    validate3DModelFile(file) {
      const validExtensions = [".glb", ".gltf"];
      const extension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));
      if (!validExtensions.includes(extension)) {
        this.$message.error(
          "Invalid file type. Please upload .glb or .gltf files only.",
        );
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        this.$message.error(
          "File size too large. Please upload files smaller than 50MB.",
        );
        return false;
      }
      return true;
    },

    handle3dModelUpload(event) {
      const file = event.target.files[0];
      if (file && this.validate3DModelFile(file)) {
        this.process3dModelFile(file);
      }
      event.target.value = "";
    },

    validateImageFile(file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        this.$message.error(
          `Invalid file type for ${file.name}. Please upload JPEG, JPG, or PNG files only.`,
        );
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.$message.error(
          `File ${file.name} is too large. Please upload files smaller than 10MB.`,
        );
        return false;
      }
      return true;
    },

    validateTextureFile(file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        this.$message.error(
          "Invalid texture file type. Please upload JPEG, JPG, or PNG files only.",
        );
        return false;
      }
      if (file.size > 20 * 1024 * 1024) {
        this.$message.error(
          "Texture file size too large. Please upload files smaller than 20MB.",
        );
        return false;
      }
      return true;
    },

    // Drag and Drop
    dragOver(event) {
      event.preventDefault();
      this.isDragOver = true;
    },
    dragLeave(event) {
      event.preventDefault();
      this.isDragOver = false;
    },
    drop3DModel(event) {
      event.preventDefault();
      this.isDragOver = false;
      const file = event.dataTransfer.files[0];
      if (file && this.validate3DModelFile(file)) {
        this.pending3DModel = file;
        this.hasUnsavedChanges = true;
        this.$message.success(`3D Model "${file.name}" ready for upload.`);
      }
    },

    // UI Actions
    remove3DModel() {
      this.$confirm({
        title: "Remove 3D Model",
        content: "Are you sure you want to remove the 3D model?",
        okText: "Remove",
        okType: "danger",
        cancelText: "Cancel",
        onOk: () => {
          this.pending3DModel = null;
          this.hasUnsavedChanges = true;
          this.$message.success("3D Model will be removed when you save.");
        },
      });
    },

    selectColor(colorValue) {
      this.productForm.colors.primary_color = colorValue;
      this.hasUnsavedChanges = true;
    },

    selectTexture(textureId) {
      this.selectedTexture = textureId;
    },

    // Primary Image Toggle
    async togglePrimaryImage(imageId) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/images/${imageId}/set-primary/`,
          {
            method: "PATCH",
            headers: { Authorization: `Token ${token}` },
          },
        );

        const result = await response.json();
        if (result.success) {
          // Update local data - remove primary from all, set on selected
          this.selectedProduct.images.forEach(
            (img) => (img.is_primary = false),
          );
          const targetImage = this.selectedProduct.images.find(
            (img) => img.id === imageId,
          );
          if (targetImage) targetImage.is_primary = true;
          this.$message.success("Primary image updated successfully");
        } else {
          this.$message.error(
            result.message || "Failed to update primary image",
          );
        }
      } catch (error) {
        this.$message.error("Error updating primary image");
        console.error("Error:", error);
      }
    },

    // API Methods
    async addColor(colorHex) {
      console.log("change ho gaya :", colorHex,this.selectedProduct.colors.available_colors);
      if (
        this.selectedProduct.colors.available_colors.some(
          (color) => color.color === colorHex,
        )
      ) {
        console.log("color alradyyyyyyyyyyyyyyy");
        this.$message.warning("Color already exists");
        return;
      }
     console.log("aaaaaaaaabout to ddddddddddddddddddddddddaaaaaaaaaaaa");
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/colors/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ color: colorHex }),
          },
        );

        const result = await response.json();
        if (result.success) {
          this.selectedProduct.colors.available_colors.push({
            id: result.data.id,
            color: result.data.color,
            is_primary: result.data.is_primary || false,
          });

          // If this is the first color, set it as primary automatically
          if (this.selectedProduct.colors.available_colors.length === 1) {
            await this.setPrimaryColor(result.data.id, colorHex);
          }

          this.$message.success("Color added successfully");
        } else {
          this.$message.error(result.message || "Failed to add color");
        }
      } catch (error) {
        this.$message.error("Error adding color");
        console.error("Error adding color:", error);
      }
    },

    async addTextureToProduct(textureFile) {
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("texture", textureFile);

        const response = await fetch(
          `${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/textures/`,
          {
            method: "POST",
            headers: { Authorization: `Token ${token}` },
            body: formData,
          },
        );

        const result = await response.json();
        if (result.success) {
          this.selectedProduct.textures.push({
            id: result.data.id,
            texture: result.data.texture,
          });
          this.$message.success("Texture added successfully");
        } else {
          this.$message.error(result.message || "Failed to add texture");
        }
      } catch (error) {
        this.$message.error("Error adding texture");
        console.error("Error adding texture:", error);
      }
    },

    // Delete Methods
    async deleteImage(imageId) {
      this.$confirm({
        title: "Delete Image",
        content: "Are you sure you want to delete this image?",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(
              `${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/images/${imageId}/`,
              {
                method: "DELETE",
                headers: { Authorization: `Token ${token}` },
              },
            );

            const result = await response.json();
            if (result.success) {
              const index = this.selectedProduct.images.findIndex(
                (img) => img.id === imageId,
              );
              if (index !== -1) this.selectedProduct.images.splice(index, 1);
              this.$message.success("Image deleted successfully");
            } else {
              this.$message.error(result.message || "Failed to delete image");
            }
          } catch (error) {
            this.$message.error("Error deleting image");
            console.error("Error deleting image:", error);
          }
        },
      });
    },

    async deleteColor(colorId) {
      const colorToDelete = this.selectedProduct.colors.available_colors.find(
        (c) => c.id === colorId,
      );

      if (colorToDelete && colorToDelete.is_primary) {
        this.$message.error(
          "Cannot delete primary color. Set another color as primary first.",
        );
        return;
      }

      this.$confirm({
        title: "Delete Color",
        content: "Are you sure you want to delete this color?",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(
              `${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/colors/${colorId}/`,
              {
                method: "DELETE",
                headers: { Authorization: `Token ${token}` },
              },
            );

            const result = await response.json();
            if (result.success) {
              const index =
                this.selectedProduct.colors.available_colors.findIndex(
                  (color) => color.id === colorId,
                );
              if (index !== -1)
                this.selectedProduct.colors.available_colors.splice(index, 1);
              this.$message.success("Color deleted successfully");
            } else {
              this.$message.error(result.message || "Failed to delete color");
            }
          } catch (error) {
            this.$message.error("Error deleting color");
            console.error("Error deleting color:", error);
          }
        },
      });
    },

    async deleteTexture(textureId) {
      this.$confirm({
        title: "Delete Texture",
        content: "Are you sure you want to delete this texture?",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(
              `${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/textures/${textureId}/`,
              {
                method: "DELETE",
                headers: { Authorization: `Token ${token}` },
              },
            );

            const result = await response.json();
            if (result.success) {
              const index = this.selectedProduct.textures.findIndex(
                (texture) => texture.id === textureId,
              );
              if (index !== -1) {
                this.selectedProduct.textures.splice(index, 1);
              }
              this.$message.success("Texture deleted successfully");
              this.hasUnsavedChanges = true;
            } else {
              this.$message.error(result.message || "Failed to delete texture");
            }
          } catch (error) {
            this.$message.error("Error deleting texture");
            console.error("Error deleting texture:", error);
          }
        },
      });
    },

    // Form Validation & Save
    validateForm() {
      if (!this.productForm.name.trim()) {
        this.$message.error("Product name is required");
        return false;
      }
      if (!this.productForm.description.trim()) {
        this.$message.error("Product description is required");
        return false;
      }
      if (!this.productForm.category_name) {
        this.$message.error("Category is required");
        return false;
      }
      if (!this.productForm.furniture_type) {
        this.$message.error("Type is required");
        return false;
      }
      if (
        !this.productForm.pricing.price ||
        parseFloat(this.productForm.pricing.price) <= 0
      ) {
        this.$message.error("Valid price is required");
        return false;
      }
      if (
        this.productForm.pricing.sale_price &&
        parseFloat(this.productForm.pricing.sale_price) <= 0
      ) {
        this.$message.error("Sale price must be greater than 0 if provided");
        return false;
      }

      // Dimensions validation
      const dimensions = ["height", "length", "width"];
      for (let dim of dimensions) {
        if (
          !this.productForm.dimensions[dim] ||
          parseFloat(this.productForm.dimensions[dim]) <= 0
        ) {
          this.$message.error(
            `${dim.charAt(0).toUpperCase() + dim.slice(1)} is required and must be greater than 0`,
          );
          return false;
        }
      }

      // Colors validation
      if (
        !this.selectedProduct.colors.available_colors ||
        this.selectedProduct.colors.available_colors.length === 0
      ) {
        this.$message.error("At least one color is required");
        return false;
      }

      // Textures validation
      if (
        !this.selectedProduct.textures ||
        this.selectedProduct.textures.length === 0
      ) {
        this.$message.error("At least one texture is required");
        return false;
      }

      return true;
    },

    async saveProduct() {
      if (
        !this.hasUnsavedChanges &&
        !this.pending3DModel &&
        this.imagePreviewsState.length === 0
      ) {
        this.$message.info("No changes to save");
        return;
      }

      if (!this.validateForm()) return;

      this.isSaving = true;

      try {
        const token = localStorage.getItem("token");

        // Upload pending images first
        if (this.imagePreviewsState.length > 0) {
          const formData = new FormData();
          this.imagePreviewsState.forEach((preview) => {
            formData.append("images", preview.file);
            preview.uploading = true;
          });

          const imageResponse = await fetch(
            `${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/images/`,
            {
              method: "POST",
              headers: { Authorization: `Token ${token}` },
              body: formData,
            },
          );
          const imageResult = await imageResponse.json();

          console.log("+===============================");
          console.log(imageResult);
          if (imageResponse.status === 403) {
            this.$notification.error({
              message: "Request Refused",
              description:
                imageResult?.detail ||
                "The server refused to process this request.",
              placement: "bottomRight",
            });
            return;
          }

          if (imageResult.success) {
            this.selectedProduct.images.push(...imageResult.data);
            this.cleanupPreviews(); // Clean up previews after successful upload
          }
        }

        // Update product details
        const productData = new FormData();
        productData.append("name", this.productForm.name);
        productData.append("description", this.productForm.description);
        productData.append("original_item_link", this.productForm.original_item_link || "");
        productData.append("category_name", this.productForm.category_name);
        productData.append("furniture_type", this.productForm.furniture_type);
        productData.append("price", this.productForm.pricing.price);

        if (this.productForm.pricing.sale_price) {
          productData.append("sale_price", this.productForm.pricing.sale_price);
        }

        // Add dimensions
        ["height", "length", "width", "depth"].forEach((dim) => {
          if (this.productForm.dimensions[dim]) {
            productData.append(dim, this.productForm.dimensions[dim]);
          }
        });

        if (this.productForm.colors.primary_color) {
          productData.append(
            "primary_color",
            this.productForm.colors.primary_color,
          );
        }

        if (this.pending3DModel) {
          productData.append("model_file", this.pending3DModel);
        }

        productData.append(
          "is_resizable",
          this.is_resizable ? "True" : "False",
        );
        if (this.selectedRoomTypeName) {
          productData.append('room_type_name', this.selectedRoomTypeName);
        }

        const response = await fetch(
          `${this.$store.state.root_api}product/api-product-owner/products/${this.selectedProduct.id}/`,
          {
            method: "PUT",
            headers: { Authorization: `Token ${token}` },
            body: productData,
          },
        );

        const result = await response.json();

        if (result.success) {
          this.$message.success("Product updated successfully");
          this.hasUnsavedChanges = false;
          this.pending3DModel = null;
          this.$emit("product-updated", result.data);
        } else {
          this.$message.error(result.message || "Failed to update product");
        }
      } catch (error) {
        console.error("Error saving product:", error);
        this.$message.error("Error saving product. Please try again.");
      } finally {
        this.isSaving = false;
      }
    },
    triggerFileInput() {
      this.$refs.colorFileInput.click();
    },

    closeColorEditPopup() {
      this.colorEditPopupVisible = false;
      this.uploaded3dModelFile = null;
      this.local3dModelUrl = null;
      this.editingColor = null;
    },

    handleColorModelUpload(event) {
      const file = event.target.files[0];
      if (file && this.validate3DModelFile(file)) {
        this.processColorModelFile(file);
      }
      event.target.value = "";
    },

    processColorModelFile(file) {
      if (this.local3dModelUrl) {
        URL.revokeObjectURL(this.local3dModelUrl);
      }

      const url = URL.createObjectURL(file);
      this.local3dModelUrl = url;

      this.uploaded3dModelFile = {
        file: file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      };

      console.log("✅ Color 3D Model loaded locally:", file.name);
    },

    dropColorModel(event) {
      event.preventDefault();
      this.colorModelDragOver = false;
      const file = event.dataTransfer.files[0];
      if (file && this.validate3DModelFile(file)) {
        this.processColorModelFile(file);
      }
    },

    removeColorModel() {
      this.$confirm({
        title: "Remove 3D Model",
        content: "Are you sure you want to remove the 3D model for this color?",
        okText: "Remove",
        okType: "danger",
        cancelText: "Cancel",
        onOk: () => {
          this.uploaded3dModelFile = null;
          this.local3dModelUrl = null;
          this.$message.success("3D Model will be removed when you save.");
        },
      });
    },
  },
};
</script>