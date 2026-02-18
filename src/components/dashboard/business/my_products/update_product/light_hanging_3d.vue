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
              <a-button
                type="text"
                danger
                @click="remove3DModel"
                style="
                  position: absolute;
                  top: 12px;
                  right: 12px;
                  background: rgba(255, 255, 255, 0.9);
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  border-radius: 6px;
                  width: 32px;
                  height: 32px;
                  padding: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
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
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </template>
              </a-button>
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
              >Description <span style="color: red">*</span></label
            >
            <a-textarea
              v-model:value="productForm.description"
              :rows="4"
              placeholder="Product Description"
              style="border-radius: 8px; resize: none"
            />
          </div>

          <!-- Category, Type, Price -->
          <a-row :gutter="16" style="margin-bottom: 20px">
            <a-col :span="8">
              <label
                style="
                  display: block;
                  margin-bottom: 6px;
                  font-weight: 500;
                  font-size: 14px;
                  color: #374151;
                "
                >Category <span style="color: red">*</span></label
              >
              <a-select
                v-model:value="productForm.category_name"
                style="width: 100%"
                size="large"
              >
                <a-select-option
                  v-for="cat in categories_available"
                  :key="cat"
                  :value="cat"
                  >{{ cat }}</a-select-option
                >
              </a-select>
            </a-col>
            <a-col :span="8">
              <label
                style="
                  display: block;
                  margin-bottom: 6px;
                  font-weight: 500;
                  font-size: 14px;
                  color: #374151;
                "
                >Type <span style="color: red">*</span></label
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
            <a-col :span="8">
              <label
                style="
                  display: block;
                  margin-bottom: 6px;
                  font-weight: 500;
                  font-size: 14px;
                  color: #374151;
                "
                >Price <span style="color: red">*</span></label
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
                  >{{ dim }} <span style="color: red">*</span
                  ><span
                    style="
                      margin-left: 8px;
                      color: #9ca3af;
                      font-size: 13px;
                      min-width: 20px;
                    "
                    >( meter )</span
                  ></label
                >
                <div style="display: flex; align-items: center">
                  <a-input
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
            <a-col :span="12">
              <h4
                style="
                  margin-bottom: 16px;
                  font-weight: 500;
                  font-size: 14px;
                  color: #1f2937;
                "
              >
                Colors <span style="color: red">*</span>
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
                  style="position: relative"
                >
                  <div
                    @click="selectColor(color.color)"
                    :style="{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: color.color,
                      cursor: 'pointer',
                      border:
                        productForm.colors.primary_color === color.color
                          ? '3px solid #3b82f6'
                          : '2px solid #e5e7eb',
                    }"
                  ></div>
                  <a-button
                    type="text"
                    danger
                    size="small"
                    @click.stop="deleteColor(color.id)"
                    style="
                      position: absolute;
                      top: -8px;
                      right: -8px;
                      background: #ef4444;
                      color: white;
                      border-radius: 50%;
                      width: 16px;
                      height: 16px;
                      padding: 0;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <template #icon>
                      <svg
                        width="8"
                        height="8"
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
                      <div style="display: flex; align-items: center; gap: 8px">
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
                      style="border-radius: 6px; border: 2px dashed #d1d5db"
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
                <!-- Add Color -->
                <!-- <div style="position: relative;">
                  <input type="color" v-model="customColor" @change="addColor(customColor)" style="opacity: 0; position: absolute; width: 36px; height: 36px; cursor: pointer;" />
                  <div style="width: 36px; height: 36px; border-radius: 8px; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #f9fafb;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                </div> -->
              </div>
            </a-col>

            <a-col :span="12">
              <h4
                style="
                  margin-bottom: 16px;
                  font-weight: 500;
                  font-size: 14px;
                  color: #1f2937;
                "
              >
                Textures <span style="color: red">*</span>
              </h4>
              <div
                style="
                  display: flex;
                  gap: 12px;
                  align-items: center;
                  flex-wrap: wrap;
                "
              >
                <!-- Existing Textures -->
                <div
                  v-for="texture in selectedProduct.textures"
                  :key="texture.id"
                  style="position: relative"
                >
                  <div
                    @click="selectTexture(texture.id)"
                    :style="{
                      width: '48px',
                      height: '36px',
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
                  <a-button
                    type="text"
                    danger
                    size="small"
                    @click.stop="deleteTexture(texture.id)"
                    style="
                      position: absolute;
                      top: -8px;
                      right: -8px;
                      background: #ef4444;
                      color: white;
                      border-radius: 50%;
                      width: 16px;
                      height: 16px;
                      padding: 0;
                    "
                  >
                    <template #icon>
                      <svg
                        width="8"
                        height="8"
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

                <!-- Add Texture -->
                <div
                  @click="uploadTexture"
                  style="
                    width: 48px;
                    height: 36px;
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
                    width="16"
                    height="16"
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
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>

    <!-- Hidden File Inputs -->
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      accept=".glb,.gltf"
      @change="handle3DModelUpload"
    />
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
</template>

<script>
import canvas_3d_model_renderer from "@/components/dashboard/business/my_products/canvas_3d_model_renderer_light.vue";

export default {
  name: "edit_product_details_light_product_update_hanging_3D",
  components: { canvas_3d_model_renderer },
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
      productForm: {
        name: "",
        description: "",
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
    };
  },
  computed: {
    has3DModel() {
      return this.selectedProduct["3d_model"] || this.pending3DModel;
    },
  },
  mounted() {
    this.initializeForm();
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
    this.cleanupPreviews();
  },
  watch: {
    selectedProduct: {
      handler() {
        this.initializeForm();
      },
      deep: true,
    },
    productForm: {
      handler() {
        this.hasUnsavedChanges = true;
      },
      deep: true,
    },
  },
  methods: {
    initializeForm() {
      if (this.selectedProduct) {
        this.productForm = {
          name: this.selectedProduct.name || "",
          description: this.selectedProduct.description || "",
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
      }
    },

    get3DModelUrl() {
      return this.pending3DModel
        ? URL.createObjectURL(this.pending3DModel)
        : this.$store.state.root_media_api + this.selectedProduct["3d_model"];
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

    handle3DModelUpload(event) {
      const file = event.target.files[0];
      if (file && this.validate3DModelFile(file)) {
        this.pending3DModel = file;
        this.hasUnsavedChanges = true;
        this.$message.success(`3D Model "${file.name}" ready for upload.`);
      }
      event.target.value = "";
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

    handleTextureUpload(event) {
      const file = event.target.files[0];
      if (file && this.validateTextureFile(file)) {
        this.addTextureToProduct(file);
      }
      event.target.value = "";
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
      if (
        this.selectedProduct.colors.available_colors.some(
          (color) => color.color === colorHex,
        )
      ) {
        this.$message.warning("Color already exists");
        return;
      }

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
          });
          this.selectColor(colorHex);
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
              if (index !== -1) this.selectedProduct.textures.splice(index, 1);
              this.$message.success("Texture deleted successfully");
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
      // Name validation
      if (!this.productForm.name.trim()) {
        this.$message.error("Product name is required");
        return false;
      }

      // Description validation
      if (!this.productForm.description.trim()) {
        this.$message.error("Product description is required");
        return false;
      }

      // Category validation
      if (!this.productForm.category_name) {
        this.$message.error("Category is required");
        return false;
      }

      // Type validation
      if (!this.productForm.furniture_type) {
        this.$message.error("Type is required");
        return false;
      }

      // Price validation
      if (
        !this.productForm.pricing.price ||
        parseFloat(this.productForm.pricing.price) <= 0
      ) {
        this.$message.error("Valid price is required");
        return false;
      }

      // Sale price validation (if provided)
      if (
        this.productForm.pricing.sale_price &&
        parseFloat(this.productForm.pricing.sale_price) <= 0
      ) {
        this.$message.error("Sale price must be greater than 0 if provided");
        return false;
      }

      // Dimensions validation - all required
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

      // 3D Model validation
      if (!this.selectedProduct["3d_model"] && !this.pending3DModel) {
        this.$message.error("3D Model is required");
        return false;
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
          if (imageResult.success) {
            this.selectedProduct.images.push(...imageResult.data);
            this.cleanupPreviews(); // Clean up previews after successful upload
          }
        }

        // Update product details
        const productData = new FormData();
        productData.append("name", this.productForm.name);
        productData.append("description", this.productForm.description);
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
  },
};
</script>
