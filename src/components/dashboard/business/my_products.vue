<template>
  <div>
    <br /><a-modal
      v-model:open="open_add_newProductModal"
      title="Select how you wanted to add product"
      @ok="handleOk"
      centered
      :width="480"
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        "
      >
        <!-- AI Generation Option -->
        <a-button
          type="default"
          block
          size="large"
          @click="add_Product_For('DYD_AI')"
          style="
            height: auto;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
          "
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 100 100"
            style="flex-shrink: 0"
          >
            <!-- AI Brain Icon with Animation -->
            <defs>
              <linearGradient
                id="aiGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style="stop-color: #667eea; stop-opacity: 1"
                />
                <stop
                  offset="100%"
                  style="stop-color: #764ba2; stop-opacity: 1"
                />
              </linearGradient>
            </defs>

            <!-- Brain outline -->
            <path
              d="M50 20 C35 20 25 30 25 40 C25 45 27 50 30 53 L30 70 C30 75 35 80 40 80 L60 80 C65 80 70 75 70 70 L70 53 C73 50 75 45 75 40 C75 30 65 20 50 20 Z"
              fill="url(#aiGradient)"
              opacity="0.3"
            />

            <!-- Neural connections -->
            <circle cx="40" cy="40" r="3" fill="#fff">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50" cy="35" r="3" fill="#fff">
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="60" cy="40" r="3" fill="#fff">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="45" cy="50" r="3" fill="#fff">
              <animate
                attributeName="opacity"
                values="0.7;0.3;0.7"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="55" cy="50" r="3" fill="#fff">
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>

            <!-- Connecting lines -->
            <line
              x1="40"
              y1="40"
              x2="50"
              y2="35"
              stroke="#fff"
              stroke-width="1"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="50"
              y1="35"
              x2="60"
              y2="40"
              stroke="#fff"
              stroke-width="1"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.6;0.3;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="40"
              y1="40"
              x2="45"
              y2="50"
              stroke="#fff"
              stroke-width="1"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.4;0.9;0.4"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="60"
              y1="40"
              x2="55"
              y2="50"
              stroke="#fff"
              stroke-width="1"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>

            <!-- Sparkle effect -->
            <circle cx="35" cy="30" r="2" fill="#fff">
              <animate
                attributeName="r"
                values="0;2;0"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="65" cy="35" r="2" fill="#fff">
              <animate
                attributeName="r"
                values="0;2;0"
                dur="3s"
                begin="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                begin="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <span style="flex: 1; text-align: left; font-size: 14px"
            >Generate 3D Model with DYD AI</span
          >
        </a-button>

        <!-- Local Upload Option -->
        <a-button
          type="default"
          block
          size="large"
          @click="add_Product_For('local_system')"
          style="
            height: auto;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
          "
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 100 100"
            style="flex-shrink: 0"
          >
            <!-- Upload Icon with Animation -->
            <defs>
              <linearGradient
                id="uploadGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style="stop-color: #48bb78; stop-opacity: 1"
                />
                <stop
                  offset="100%"
                  style="stop-color: #38a169; stop-opacity: 1"
                />
              </linearGradient>
            </defs>

            <!-- Folder -->
            <path
              d="M20 35 L20 75 C20 78 22 80 25 80 L75 80 C78 80 80 78 80 75 L80 40 C80 37 78 35 75 35 L55 35 L50 30 L25 30 C22 30 20 32 20 35 Z"
              fill="url(#uploadGradient)"
              opacity="0.3"
              stroke="#48bb78"
              stroke-width="2"
            />

            <!-- Upload Arrow -->
            <g transform="translate(50, 55)">
              <!-- Arrow shaft -->
              <rect x="-3" y="-15" width="6" height="25" fill="#48bb78" rx="2">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,5; 0,-2; 0,5"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </rect>

              <!-- Arrow head -->
              <path d="M0,-20 L-8,-10 L8,-10 Z" fill="#48bb78">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,5; 0,-2; 0,5"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </path>
            </g>

            <!-- Document icon inside folder -->
            <rect
              x="35"
              y="55"
              width="12"
              height="15"
              fill="#fff"
              opacity="0.6"
              rx="1"
            />
            <line
              x1="37"
              y1="59"
              x2="45"
              y2="59"
              stroke="#48bb78"
              stroke-width="1"
              opacity="0.8"
            />
            <line
              x1="37"
              y1="62"
              x2="45"
              y2="62"
              stroke="#48bb78"
              stroke-width="1"
              opacity="0.8"
            />
            <line
              x1="37"
              y1="65"
              x2="43"
              y2="65"
              stroke="#48bb78"
              stroke-width="1"
              opacity="0.8"
            />
          </svg>
          <span style="flex: 1; text-align: left; font-size: 14px"
            >Upload 3D Model from Local System</span
          >
        </a-button>
      </div>

      <template #footer></template>
    </a-modal>
    <a-modal
      v-model:open="open_add_newLightModal"
      title="Select how you wanted to add The Light product"
      @ok="handleOk"
      centered
      :width="480"
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        "
      >
        <!-- AI Generation Option -->
        <a-button
          type="default"
          block
          size="large"
          @click="add_Product_Light_For('DYD_AI')"
          style="
            height: auto;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
          "
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 100 100"
            style="flex-shrink: 0"
          >
            <!-- AI Brain Icon with Animation -->
            <defs>
              <linearGradient
                id="aiGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style="stop-color: #667eea; stop-opacity: 1"
                />
                <stop
                  offset="100%"
                  style="stop-color: #764ba2; stop-opacity: 1"
                />
              </linearGradient>
            </defs>

            <!-- Brain outline -->
            <path
              d="M50 20 C35 20 25 30 25 40 C25 45 27 50 30 53 L30 70 C30 75 35 80 40 80 L60 80 C65 80 70 75 70 70 L70 53 C73 50 75 45 75 40 C75 30 65 20 50 20 Z"
              fill="url(#aiGradient)"
              opacity="0.3"
            />

            <!-- Neural connections -->
            <circle cx="40" cy="40" r="3" fill="#fff">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50" cy="35" r="3" fill="#fff">
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="60" cy="40" r="3" fill="#fff">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="45" cy="50" r="3" fill="#fff">
              <animate
                attributeName="opacity"
                values="0.7;0.3;0.7"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="55" cy="50" r="3" fill="#fff">
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>

            <!-- Connecting lines -->
            <line
              x1="40"
              y1="40"
              x2="50"
              y2="35"
              stroke="#fff"
              stroke-width="1"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="50"
              y1="35"
              x2="60"
              y2="40"
              stroke="#fff"
              stroke-width="1"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.6;0.3;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="40"
              y1="40"
              x2="45"
              y2="50"
              stroke="#fff"
              stroke-width="1"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.4;0.9;0.4"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="60"
              y1="40"
              x2="55"
              y2="50"
              stroke="#fff"
              stroke-width="1"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>

            <!-- Sparkle effect -->
            <circle cx="35" cy="30" r="2" fill="#fff">
              <animate
                attributeName="r"
                values="0;2;0"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="65" cy="35" r="2" fill="#fff">
              <animate
                attributeName="r"
                values="0;2;0"
                dur="3s"
                begin="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                begin="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <span style="flex: 1; text-align: left; font-size: 15px"
            >Generate 3D Light Model with DYD AI</span
          >
        </a-button>

        <!-- Local Upload Option -->
        <a-button
          type="default"
          block
          size="large"
          @click="add_Product_Light_For('local_system')"
          style="
            height: auto;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
          "
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 100 100"
            style="flex-shrink: 0"
          >
            <!-- Upload Icon with Animation -->
            <defs>
              <linearGradient
                id="uploadGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style="stop-color: #48bb78; stop-opacity: 1"
                />
                <stop
                  offset="100%"
                  style="stop-color: #38a169; stop-opacity: 1"
                />
              </linearGradient>
            </defs>

            <!-- Folder -->
            <path
              d="M20 35 L20 75 C20 78 22 80 25 80 L75 80 C78 80 80 78 80 75 L80 40 C80 37 78 35 75 35 L55 35 L50 30 L25 30 C22 30 20 32 20 35 Z"
              fill="url(#uploadGradient)"
              opacity="0.3"
              stroke="#48bb78"
              stroke-width="2"
            />

            <!-- Upload Arrow -->
            <g transform="translate(50, 55)">
              <!-- Arrow shaft -->
              <rect x="-3" y="-15" width="6" height="25" fill="#48bb78" rx="2">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,5; 0,-2; 0,5"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </rect>

              <!-- Arrow head -->
              <path d="M0,-20 L-8,-10 L8,-10 Z" fill="#48bb78">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,5; 0,-2; 0,5"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </path>
            </g>

            <!-- Document icon inside folder -->
            <rect
              x="35"
              y="55"
              width="12"
              height="15"
              fill="#fff"
              opacity="0.6"
              rx="1"
            />
            <line
              x1="37"
              y1="59"
              x2="45"
              y2="59"
              stroke="#48bb78"
              stroke-width="1"
              opacity="0.8"
            />
            <line
              x1="37"
              y1="62"
              x2="45"
              y2="62"
              stroke="#48bb78"
              stroke-width="1"
              opacity="0.8"
            />
            <line
              x1="37"
              y1="65"
              x2="43"
              y2="65"
              stroke="#48bb78"
              stroke-width="1"
              opacity="0.8"
            />
          </svg>
          <span style="flex: 1; text-align: left; font-size: 15px"
            >Upload 3D Model from Local System</span
          >
        </a-button>
      </div>

      <template #footer></template>
    </a-modal>

    <!-- {{ show_add_new_light_product_locally_3d_model }} -->
    <add_furniture_modal_local_3d_model
      v-model:visible="show_add_new_product_locally_3d_model"
      :types="[
        'Modern',
        'Scandinavian',
        'Classic',
        'Minimalist',
        'Industrial',
        'Rustic',
        'Boho',
        'other',
      ]"
      @product-created="onProductCreated"
      @cancel="onCancel"
      :rendered_modal_3D_id="model_instance_id"
    />

    <add_furniture_modal_local_3d_model_create_variation
      v-model:visible="show_add_new_product_locally_3d_model_create_variation"
      :types="[
        'Modern',
        'Scandinavian',
        'Classic',
        'Minimalist',
        'Industrial',
        'Rustic',
        'Boho',
        'other',
      ]"
      @product-created="onProductCreated"
      @cancel="onCancel"
      :rendered_modal_3D_id="model_instance_id"
      :prepopulatedData="prepopulatedProductData"
      :isEditing="false"
      :isVariation="isCreatingVariation"
      :baseProductId="selectedProduct?.id"
      
      v-if="prepopulatedProductData"
    />

    <add_light_modal_local_3d_model
      v-model:visible="show_add_new_light_product_locally_3d_model"
      :types="[
        'Modern',
        'Scandinavian',
        'Classic',
        'Minimalist',
        'Industrial',
        'Rustic',
        'Boho',
        'other',
      ]"
      @product-created="onLightProductCreated"
      @cancel="onCancel"
      :rendered_modal_3D_id="model_instance_id"
    />

    <!-- <add_furniture_modal_local_3d_model v-model:visible="show_add_new_product_locally_3d_model" 
        :types="['Modern','Scandinavian','Classic','Minimalist','Industrial','Rustic','Boho','other',]"
        @product-created="onProductCreated"
        @cancel="onCancel"
        :rendered_modal_3D_id="model_instance_id"
        /> -->

    <!-- this.fetchMyProducts() -->

    <add_new_floorTexture
      v-model:visible="show_add_new_floor_texture"
      @product-created="this.fetchMyFloorTextureProducts()"
    />

    <add_new_wallTexture
      v-model:visible="show_add_new_wall_texture"
      @product-created="this.fetchMyWallTextureProducts()"
    />
    <add_new_Light
      v-model:visible="show_add_new_light"
      @cancel="clicked_cancel_add_new_light"
      @add-3d-light="addLightProduct()"
      @product-created="this.fetchMyLights()"
    />

    <div
      class="sm:p-[10px] -translate-y-[1%] min-h-[100vh] md:min-h-[136vh] xl:min-h-[170vh] 2xl:min-h-[150vh] bg-white rounded-2xl sm:border border-black/10"
    >
      <!-- Product List/Grid View -->
      <div v-if="currentView === 'list'">
        <!-- Header Section -->

        <!--for desktop-->
        <div class="hidden md:flex justify-between items-center mb-5">
          <!-- Title -->
          <h2
            class="m-0 text-lg whitespace-nowrap px-2 lg:text-2xl font-semibold"
          >
            My Products
            <span class="text-gray-500 text-base">
              ({{
                products.length + wall.length + floor.length + myLights.length
              }})
            </span>
          </h2>

          <!-- Right Side Buttons -->
          <div
            class="flex justify-between items-end sm:flex-col sm:w-full xl:flex-row"
          >
            <div className="flex flex-row gap-6">
              <!-- View Toggle Buttons -->
              <div
                style="
                  display: flex;
                  border: 1px solid #ddd;
                  border-radius: 6px;
                  overflow: hidden;
                "
              >
                <a-button
                  @click="viewMode = 'grid'"
                  :style="{
                    padding: '8px 12px',
                    border: 'none',
                    background: viewMode === 'grid' ? '#3B63FB' : 'white',
                    color: viewMode === 'grid' ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style="margin-right: 4px"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                  </svg>
                  <!-- Grid -->
                </a-button>
                <a-button
                  @click="viewMode = 'table'"
                  :style="{
                    padding: '8px 12px',
                    border: 'none',
                    background: viewMode === 'table' ? '#3B63FB' : 'white',
                    color: viewMode === 'table' ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    style="margin-right: 4px"
                  >
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  <!-- List -->
                </a-button>
              </div>

              <!-- Search -->
              <div class="relative">
                <input
                  type="text"
                  placeholder="Search Product"
                  v-model="searchQuery"
                  class="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md w-[200px] outline-none text-sm"
                />
                <svg
                  class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>

            <div className="flex flex-row gap-2 ">
              <!-- Wall Button -->
              <button
                type="primary"
                @click="show_add_new_wall_texture = true"
                class="flex items-center gap-2 px-3 py-2 !text-white rounded-md bg-[#3B63FB]"
                style="font-family: var(--font-family-main)"
              >
                <!-- Paste any SVG here -->
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="3" width="8" height="8" rx="1" />
                  <rect x="13" y="3" width="8" height="8" rx="1" />
                  <rect x="3" y="13" width="8" height="8" rx="1" />
                  <rect x="13" y="13" width="8" height="8" rx="1" />
                </svg>
                Wall
              </button>

              <!-- Floor Button -->
              <button
                type="primary"
                @click="show_add_new_floor_texture = true"
                class="flex items-center gap-2 px-3 py-2 !text-white rounded-md bg-[#3B63FB]"
                style="font-family: var(--font-family-main)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>

                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="3" y1="15" x2="21" y2="15"></line>

                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                </svg>
                Floor
              </button>

              <!-- Light Button -->
              <button
                type="primary"
                @click="show_add_new_light = true"
                class="flex items-center gap-2 px-3 py-2 !text-white rounded-md bg-[#3B63FB]"
                style="font-family: var(--font-family-main)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <!-- bulb outline -->
                  <path
                    d="M12 2a6 6 0 0 0-4.472 10.04c.46.5.872 1.28.872 2.16 0 1.1-.2 2.2-.6 3h6.4c-.4-.8-.6-1.9-.6-3 0-.88.41-1.66.87-2.16A6 6 0 0 0 12 2z"
                  />
                  <!-- filament / detail -->
                  <path d="M10 14h4" />
                  <!-- base -->
                  <path d="M9 19h6v2H9z" />
                </svg>
                Light
              </button>

              <!-- Add Product Button -->
              <button
                @click="addProduct()"
                type="primary"
                class="flex items-center gap-2 px-3 py-2 !text-white whitespace-nowrap rounded-md bg-[#3B63FB]"
                style="font-family: var(--font-family-main)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <!-- box -->
                  <path
                    d="M21 8v8a2 2 0 0 1-1 1.73L12 21l-8-3.27A2 2 0 0 1 3 16V8"
                  />
                  <path d="M12 3v5" />
                  <path d="M3.27 6.96L12 10l8.73-3.04" />
                  <!-- plus -->
                  <path d="M12 12v6" />
                  <path d="M9 15h6" />
                </svg>
                Add Product
              </button>
            </div>
          </div>
        </div>
        <!--for mobile-->
        <div
          class="flex md:hidden flex-wrap items-center justify-between mb-5 w-full gap-3"
          style="padding: 2px"
        >
          <!-- Title -->
          <h2
            className="!mt-4 sm:mt-6 text-lg lg:text-2xl font-semibold px-2 whitespace-nowrap"
          >
            My Products
            <span class="text-gray-500 text-base">
              ({{
                products.length + wall.length + floor.length + myLights.length
              }})
            </span>
          </h2>

          <!-- Right Side Controls -->
          <div class="flex flex-wrap items-center gap-3 w-auto sm:w-full">
            <!-- View Toggle Buttons and Search -->
            <div class="flex flex-wrap items-center gap-3 w-auto sm:w-full">
              <!-- View Toggle Buttons -->
              <div
                class="flex border border-gray-200 rounded-md overflow-hidden"
              >
                <button
                  @click="viewMode = 'grid'"
                  :class="[
                    'flex items-center px-3 py-2 font-semibold text-xs transition',
                    viewMode === 'grid'
                      ? 'bg-blue-600 !text-white'
                      : 'bg-white !text-gray-600',
                  ]"
                  style="font-family: var(--font-family-main)"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="mr-1"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                  </svg>
                  Grid
                </button>
                <button
                  @click="viewMode = 'table'"
                  :class="[
                    'flex items-center px-3 py-2 font-semibold text-xs transition ',
                    viewMode === 'table'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white !text-gray-600',
                  ]"
                  style="font-family: var(--font-family-main); color: white"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="mr-1"
                  >
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  List
                </button>
              </div>
              <!-- Search Input -->
              <div class="relative">
                <input
                  type="text"
                  placeholder="Search Product"
                  v-model="searchQuery"
                  class="pl-8 pr-3 py-2 border border-gray-300 rounded-md w-48 outline-none text-sm"
                />
                <svg
                  class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 sm:flex-col sm:w-full">
              <!-- Wall Button -->
              <button
                type="button"
                @click="show_add_new_wall_texture = true"
                class="flex items-center gap-2 px-1.5 py-1.5 !text-white rounded-md bg-blue-600 font-medium whitespace-nowrap w-auto sm:w-32"
                style="font-family: var(--font-family-main)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="3" width="8" height="8" rx="1" />
                  <rect x="13" y="3" width="8" height="8" rx="1" />
                  <rect x="3" y="13" width="8" height="8" rx="1" />
                  <rect x="13" y="13" width="8" height="8" rx="1" />
                </svg>
                Wall
              </button>
              <!-- Floor Button -->
              <button
                type="button"
                @click="show_add_new_floor_texture = true"
                class="flex items-center gap-2 px-1.5 py-1.5 !text-white rounded-md bg-blue-600 font-medium whitespace-nowrap w-auto sm:w-32"
                style="font-family: var(--font-family-main)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="3" y1="15" x2="21" y2="15"></line>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                </svg>
                Floor
              </button>
              <!-- Light Button -->
              <button
                type="button"
                @click="show_add_new_light = true"
                class="flex items-center gap-2 px-1.5 py-1.5 !text-white rounded-md bg-blue-600 font-medium whitespace-nowrap w-auto sm:w-32"
                style="font-family: var(--font-family-main)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M12 2a6 6 0 0 0-4.472 10.04c.46.5.872 1.28.872 2.16 0 1.1-.2 2.2-.6 3h6.4c-.4-.8-.6-1.9-.6-3 0-.88.41-1.66.87-2.16A6 6 0 0 0 12 2z"
                  />
                  <path d="M10 14h4" />
                  <path d="M9 19h6v2H9z" />
                </svg>
                Light
              </button>
              <!-- Add Product Button -->
              <button
                type="button"
                @click="addProduct()"
                class="flex items-center gap-2 px-1.5 py-1.5 !text-white rounded-md bg-blue-600 font-medium whitespace-nowrap w-auto sm:w-32"
                style="font-family: var(--font-family-main)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M21 8v8a2 2 0 0 1-1 1.73L12 21l-8-3.27A2 2 0 0 1 3 16V8"
                  />
                  <path d="M12 3v5" />
                  <path d="M3.27 6.96L12 10l8.73-3.04" />
                  <path d="M12 12v6" />
                  <path d="M9 15h6" />
                </svg>
                Add Product
              </button>
            </div>
          </div>
        </div>

        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="sm:main">
          <div class="products-list" style="padding: 2px">
            <a-tabs v-model:activeKey="active_tab">
              <a-tab-pane
                key="Furniture"
                tab="Furniture"
              >
                <div
                  v-if="isLoading"
                  class="spinner-sec w-full h-[80vh] flex justify-center items-center"
                >
                  <a-spin tip="Loading..."> </a-spin>
                </div>
                <div v-else>
                  <div
                    v-if="!filteredProducts.length"
                    style="
                      height: 70vh;
                      gap: 10px;
                      flex-direction: column;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <a-empty :description="'No Furniture Available'"></a-empty>

                    <a-button type="primary" @click="addProduct()">
                      Add Furniture
                    </a-button>
                  </div>

                  <a-row v-else>
                    <a-col
                      v-for="product in filteredProducts"
                      :key="product.id"
                      class="product-responsive p-1 sm:p-2"
                      style="padding: 5px"
                    >
                     <div class="product" style="padding: 5px">
  <div
    class="product-image-container"
    @click="viewProduct(product)"
    style="position: relative; overflow: hidden;"
  >
    <!-- Skeleton -->
    <div
      v-if="!imageLoadedMap[product.id]"
      class="product-skeleton"
    ></div>

    <!-- Preloader -->
    <img
      :src="$store.state.root_media_api + product.primary_image"
      style="position: absolute; width: 0; height: 0; opacity: 0"
      @load="onProductImageLoad(product.id)"
      alt=""
    />

    <!-- Actual Image -->
    <img
      v-show="imageLoadedMap[product.id]"
      :src="$store.state.root_media_api + product.primary_image"
      :alt="product.name"
      class="product-image"
    />

    <!-- Badges -->
    <div v-show="imageLoadedMap[product.id]" class="category-badge">
      {{ product.category.name }}
    </div>
    <div v-show="imageLoadedMap[product.id]" class="ar-badge">AR</div>
  </div>

  <a-row>
    <a-col span="24">
      <b class="block w-full truncate" :title="product.name">
        {{ product.name || "No name available" }}
      </b>
    </a-col>

    <a-col span="16" style="font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 400;">
      Color
    </a-col>

    <a-col span="8" style="display: flex; justify-content: end">
      <div
        v-for="(color, index) in product.colors.slice(0, 2)"
        :key="index"
        style="width: 20px; height: 20px; border-radius: 20px; margin-left: 2px;"
        :style="'background:' + color"
      ></div>
    </a-col>

    <a-col span="12" style="font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 400;">
      Price
    </a-col>

    <a-col span="12" style="display: flex; justify-content: end; font-weight: 700;">
      ${{ product.pricing.price }}
    </a-col>

    <a-col span="18">
      <a-button block @click="viewProduct(product)" style="display: flex; justify-content: center">
        Product Details
      </a-button>
    </a-col>

    <a-col :span="1"></a-col>
    <a-col span="5" style="display: flex; align-items: end; justify-content: end;">
      <a-button
        @click="toggleFavorite(product, 'product')"
        style="padding: 2px 12px; display: flex; align-items: center; justify-content: center;"
      >
        <template v-if="product.is_favorited">
          <HeartFilled style="color: red" />
        </template>
        <template v-else>
          <HeartOutlined />
        </template>
      </a-button>
    </a-col>
  </a-row>
</div>

                    </a-col>
                  </a-row>

                  <div
                    v-if="filteredProducts.length > 0"
                    style="
                      display: flex;
                      justify-content: center;
                      margin-top: 20px;
                      margin-bottom: 20px;
                    "
                  >
                    <a-pagination
                      v-model:current="productsPagination.currentPage"
                      :total="productsPagination.totalCount"
                      :page-size="productsPagination.pageSize"
                      @change="handleProductsPageChange"
                      show-total
                      :show-size-changer="false"
                    />
                  </div>
                </div>
              </a-tab-pane>
              <a-tab-pane
                key="Wall"
                tab="Wall"
                v-if="wall.length > 0"
                force-render
              >
                <!-- {{ wall }} -->
                <div
                  style="
                    height: 70vh;
                    gap: 20px;
                    flex-direction: column;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                  v-if="wall.length === 0"
                >
                  <a-empty
                    :description="'No Wall Textures Available'"
                  ></a-empty>
                  <a-button
                    type="primary"
                    @click="show_add_new_wall_texture = true"
                  >
                    Add Wall Texture
                  </a-button>
                </div>
                <a-row>
                  <a-col
                    v-for="product in wall"
                    :key="product.id"
                    class="product-responsive"
                    style="padding: 5px"
                  >
                   <div class="product" style="padding: 5px">
  <div
    class="product-image-container"
    @click="viewProduct(product)"
    style="position: relative; overflow: hidden;"
  >
    <!-- Skeleton -->
    <div
      v-if="!imageLoadedMap[product.id]"
      class="product-skeleton"
    ></div>

    <!-- Preloader -->
    <img
      :src="$store.state.root_media_api + (product.product_images.length > 0 ? product.product_images[0].image : product.texture_image)"
      style="position: absolute; width: 0; height: 0; opacity: 0"
      @load="onProductImageLoad(product.id)"
      alt=""
    />

    <!-- Actual Image -->
    <img
      v-show="imageLoadedMap[product.id]"
      :src="$store.state.root_media_api + (product.product_images.length > 0 ? product.product_images[0].image : product.texture_image)"
      :alt="product.title"
      class="product-image"
    />

    <!-- Badges -->
    <div v-show="imageLoadedMap[product.id]" class="category-badge">
      {{ product.texture_style }}
    </div>
    <div v-show="imageLoadedMap[product.id]" class="ar-badge">AR</div>
  </div>

  <a-row style="margin-top: 10px">
    <a-col span="24">
      <b>{{ truncateText(product.title || "No title available", 19) }}</b>
    </a-col>

    <a-col span="18">Colors</a-col>
    <a-col span="6" style="display: flex; justify-content: end">
      <div
        v-for="(color, index) in product.associated_colors.slice(0, 2)"
        :key="index"
        :style="{
          background: color.color_hex,
          width: '20px',
          height: '20px',
          borderRadius: '20px',
          marginLeft: '2px',
        }"
      ></div>
    </a-col>

    <a-col span="12" style="margin-top: 4px">Price</a-col>
    <a-col span="12" style="margin-top: 4px; width: 100%; display: flex; justify-content: end;">
      <span style="font-size: 14px; font-weight: 600; margin-left: 4px;">
        ${{ product.sale_price_per_sqm || 0 }}
      </span>
    </a-col>

    <a-col span="17">
      <a-button block @click="viewProduct(product)" style="display: flex; justify-content: center">
        Product Details
      </a-button>
    </a-col>

    <a-col :span="1"></a-col>
    <a-col span="6" style="display: flex; align-items: end; justify-content: end;">
      <a-button
        @click="toggleFavorite(product, 'wall_texture')"
        style="padding: 2px 12px; display: flex; align-items: center; justify-content: center;"
      >
        <template v-if="product.is_favorited">
          <HeartFilled style="color: red" />
        </template>
        <template v-else>
          <HeartOutlined />
        </template>
      </a-button>
    </a-col>
  </a-row>
</div>

                  </a-col>
                </a-row>

                <!-- Pagination for Wall -->
                <div
                  v-if="wall.length > 0"
                  style="
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                    margin-bottom: 20px;
                  "
                >
                  <a-pagination
                    v-model:current="wallPagination.currentPage"
                    :total="wallPagination.totalCount"
                    :page-size="wallPagination.pageSize"
                    @change="handleWallPageChange"
                    show-total
                    :show-size-changer="false"
                  />
                </div>
              </a-tab-pane>
              <a-tab-pane key="Floor" tab="Floor" v-if="floor.length > 0">
                <!-- {{ floor }} -->
                <div
                  style="
                    height: 70vh;
                    gap: 20px;
                    flex-direction: column;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                  v-if="floor.length === 0"
                >
                  <a-empty
                    :description="'No Floor Textures Available'"
                  ></a-empty>

                  <a-button
                    type="primary"
                    @click="show_add_new_floor_texture = true"
                  >
                    Add Floor Texture
                  </a-button>
                </div>
                <a-row v-else>
                  <a-col
                    v-for="product in floor"
                    :key="product.id"
                    class="product-responsive"
                    style="padding: 5px"
                  >
                   <div class="product" style="padding: 4px">
  <div
    class="product-image-container"
    @click="viewProduct(product)"
    style="position: relative; overflow: hidden;"
  >
    <!-- Skeleton -->
    <div
      v-if="!imageLoadedMap[product.id]"
      class="product-skeleton"
    ></div>

    <!-- Preloader -->
    <img
      :src="$store.state.root_media_api + (product.product_images.length > 0 ? product.product_images[0].image : product.texture_image)"
      style="position: absolute; width: 0; height: 0; opacity: 0"
      @load="onProductImageLoad(product.id)"
      alt=""
    />

    <!-- Actual Image -->
    <img
      v-show="imageLoadedMap[product.id]"
      :src="$store.state.root_media_api + (product.product_images.length > 0 ? product.product_images[0].image : product.texture_image)"
      :alt="product.title"
      class="product-image"
    />

    <!-- Badges -->
    <div v-show="imageLoadedMap[product.id]" class="category-badge">
      {{ product.texture_style }}
    </div>
    <div v-show="imageLoadedMap[product.id]" class="ar-badge">AR</div>
  </div>

  <a-row style="margin-top: 10px">
    <a-col span="24">
      <b>{{ product.title }}</b>
    </a-col>

    <a-col span="18">Colors</a-col>
    <a-col span="6" style="display: flex; justify-content: end">
      <div
        v-for="(color, index) in product.associated_colors.slice(0, 2)"
        :key="index"
        :style="{
          background: color.color_hex,
          width: '20px',
          height: '20px',
          borderRadius: '20px',
          marginLeft: '2px',
        }"
      ></div>
    </a-col>

    <a-col span="12" style="margin-top: 4px">Price</a-col>
    <a-col span="12" style="margin-top: 4px">
      <span style="font-size: 14px; font-weight: 600; margin-left: 4px; display: flex; justify-content: end;">
        ${{ product.sale_price_per_sqm || 0 }}
      </span>
    </a-col>

    <a-col span="17">
      <a-button block @click="viewProduct(product)" style="font-family: 'Poppins', sans-serif; font-size: 12px; display: flex; justify-content: center; align-items: center;">
        Product Details
      </a-button>
    </a-col>

    <a-col :span="1"></a-col>
    <a-col span="6" style="display: flex; align-items: end; justify-content: end;">
      <a-button
        @click="toggleFavorite(product, 'floor_texture')"
        style="padding: 2px 12px; display: flex; align-items: center; justify-content: center;"
      >
        <template v-if="product.is_favorited">
          <HeartFilled style="color: red" />
        </template>
        <template v-else>
          <HeartOutlined />
        </template>
      </a-button>
    </a-col>
  </a-row>
</div>

                  </a-col>
                </a-row>

                <!-- Pagination for Floor -->
                <div
                  v-if="floor.length > 0"
                  style="
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                    margin-bottom: 20px;
                  "
                >
                  <a-pagination
                    v-model:current="floorPagination.currentPage"
                    :total="floorPagination.totalCount"
                    :page-size="floorPagination.pageSize"
                    @change="handleFloorPageChange"
                    show-total
                    :show-size-changer="false"
                  />
                </div>
              </a-tab-pane>
              <a-tab-pane key="Lights" tab="Lights" v-if="myLights.length > 0">
                <div
                  v-if="myLights.length === 0"
                  style="
                    height: 70vh;
                    gap: 20px;
                    flex-direction: column;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <!-- required light configuration solution to add new light product -->
                  <!-- <br>❌ un-sunk light <br>
                                ❌ 3D Lamp light draggabe everywhere <br>                             
                                ✅ sunk light <br>
                                ✅ sticked ceiling 3D light <br>                              -->
                  <a-empty :description="'No Lights Available'"></a-empty>

                  <a-button type="primary" @click="show_add_new_light = true">
                    Add Lights Product
                  </a-button>
                </div>

                <a-row v-else>
                  <a-col
                    v-for="product in myLights"
                    :key="product.id"
                    class="product-responsive"
                    style="padding: 5px"
                  >
                   <div class="product" style="padding: 4px">
  <div
    class="product-image-container"
    @click="viewProduct(product)"
    style="position: relative; overflow: hidden;"
  >
    <!-- Skeleton -->
    <div
      v-if="!imageLoadedMap[product.id]"
      class="product-skeleton"
    ></div>

    <!-- Preloader -->
    <img
      :src="$store.state.root_media_api + product.primary_image"
      style="position: absolute; width: 0; height: 0; opacity: 0"
      @load="onProductImageLoad(product.id)"
      alt=""
    />

    <!-- Actual Image -->
    <img
      v-show="imageLoadedMap[product.id]"
      :src="$store.state.root_media_api + product.primary_image"
      :alt="product.name"
      class="product-image"
    />

    <!-- Badges -->
    <div v-show="imageLoadedMap[product.id]" class="category-badge">
      {{ product.category.name }}
    </div>
    <div v-show="imageLoadedMap[product.id]" class="ar-badge">AR</div>
  </div>

  <a-row>
    <a-col span="24">
      <b>{{ truncateText(product.name || "No Name available", 19) }}</b>
    </a-col>

    <a-col span="18">Color</a-col>
    <a-col span="6" style="display: flex; justify-content: end">
      <div
        v-for="(color, index) in product.colors.slice(0, 2)"
        :key="index"
        style="width: 20px; height: 20px; border-radius: 20px; margin-left: 2px;"
        :style="'background:' + color"
      ></div>
    </a-col>

    <a-col span="12">Price</a-col>
    <a-col span="12" style="display: flex; justify-content: end">
      <b>${{ product.pricing.price }}</b>
    </a-col>

    <a-col span="18" style="font-family: 'Poppins', sans-serif; font-size: 13px; padding-right: 5px;">
      <a-button block @click="viewProduct(product)" style="display: flex; width: 100%; align-items: center; justify-content: center;">
        Product Details
      </a-button>
    </a-col>

    <a-col span="6" style="display: flex; align-items: end; justify-content: end;">
      <a-button
        @click="toggleFavorite(product, 'product')"
        style="padding: 2px 12px; display: flex; align-items: center; justify-content: center;"
      >
        <template v-if="product.is_favorited">
          <HeartFilled style="color: red" />
        </template>
        <template v-else>
          <HeartOutlined />
        </template>
      </a-button>
    </a-col>
  </a-row>
</div>

                  </a-col>
                </a-row>

                <!-- Pagination for Lights -->
                <div
                  v-if="myLights.length > 0"
                  style="
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                    margin-bottom: 20px;
                  "
                >
                  <a-pagination
                    v-model:current="lightsPagination.currentPage"
                    :total="lightsPagination.totalCount"
                    :page-size="lightsPagination.pageSize"
                    @change="handleLightsPageChange"
                    show-total
                    :show-size-changer="false"
                  />
                </div>
              </a-tab-pane>

              <a-tab-pane
                key="Furniture"
                tab="Furniture"
                v-if="filteredProducts.length === 0"
              >
                <div
                  v-if="!filteredProducts.length"
                  style="
                    height: 70vh;
                    gap: 20px;
                    flex-direction: column;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <a-empty :description="'No Furniture Available'"></a-empty>

                  <a-button type="primary" @click="addProduct()">
                    Add Furniture
                  </a-button>
                </div>
              </a-tab-pane>
              <a-tab-pane
                key="Wall"
                tab="Wall"
                v-if="wall.length === 0"
                force-render
              >
                <!-- {{ wall }} -->
                <div
                  style="
                    height: 70vh;
                    gap: 20px;
                    flex-direction: column;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                  v-if="wall.length === 0"
                >
                  <a-empty
                    :description="'No Wall Textures Available'"
                  ></a-empty>
                  <a-button
                    type="primary"
                    @click="show_add_new_wall_texture = true"
                  >
                    Add Wall Texture
                  </a-button>
                </div>
              </a-tab-pane>
              <a-tab-pane key="Floor" tab="Floor" v-if="floor.length === 0">
                <!-- {{ floor }} -->
                <div
                  style="
                    height: 70vh;
                    gap: 20px;
                    flex-direction: column;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                  v-if="floor.length === 0"
                >
                  <a-empty
                    :description="'No Floor Textures Available'"
                  ></a-empty>

                  <a-button
                    type="primary"
                    @click="show_add_new_floor_texture = true"
                  >
                    Add Floor Texture
                  </a-button>
                </div></a-tab-pane
              >
              <a-tab-pane
                key="Lights"
                tab="Lights"
                v-if="myLights.length === 0"
              >
                <div
                  v-if="myLights.length === 0"
                  style="
                    height: 70vh;
                    gap: 20px;
                    flex-direction: column;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <!-- required light configuration solution to add new light product -->
                  <!-- <br>❌ un-sunk light <br>
                                    ❌ 3D Lamp light draggabe everywhere <br>                             
                                    ✅ sunk light <br>
                                    ✅ sticked ceiling 3D light <br>                              -->
                  <a-empty :description="'No Lights Available'"></a-empty>

                  <a-button type="primary" @click="show_add_new_light = true">
                    Add Lights Product
                  </a-button>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>

        <!-- Table View -->
        <div v-if="viewMode === 'table'" class="main">
          <a-tabs v-model:activeKey="active_tab">
            <a-tab-pane
              key="Furniture"
              tab="Furniture"
              v-if="filteredProducts.length > 0"
            >
              <div
                v-if="!filteredProducts.length"
                style="
                  height: 70vh;
                  gap: 20px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <a-empty :description="'No Furniture Available'"></a-empty>

                <a-button type="primary" @click="addProduct()">
                  Add Furniture
                </a-button>
              </div>
              <div v-else>
                <a-table
                  :columns="columns"
                  :data-source="filteredProducts"
                  row-key="id"
                  :scroll="{ x: 800 }"
                  :pagination="{
                    current: productsPagination.currentPage,
                    pageSize: productsPagination.pageSize,
                    total: productsPagination.totalCount,
                    onChange: handleProductsPageChange,
                    showTotal: (total) => `Total ${total} items`,
                  }"
                  style="
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                  "
                >
                  <!-- <a-table :columns="columns" :data-source="filteredProducts" row-key="id" :pagination="false"
                        :scroll="{ x: 800 }" style="background: white; border-radius: 8px; overflow: hidden; cursor:pointer"> -->
                  <template #bodyCell="{ column, record, index }">
                    <template v-if="column.key === 'serial'">
                      <span style="font-weight: 600; color: #666">{{
                        index + 1
                      }}</span>
                    </template>

                    <template v-if="column.key === 'product'">
                      <div
                        @click="viewProduct(record)"
                        style="
                          display: flex;
                          gap: 12px;
                          align-items: center;
                          cursor: pointer;
                        "
                      >
                        <img
                          :src="
                            $store.state.root_media_api + record.primary_image
                          "
                          style="
                            width: 60px;
                            height: 60px;
                            border-radius: 8px;
                            object-fit: cover;
                          "
                        />
                        <div>
                          <div
                            style="
                              font-weight: 600;
                              color: #333;
                              margin-bottom: 4px;
                            "
                          >
                            {{
                              truncateText(
                                record.name || "No title available",
                                13
                              )
                            }}
                          </div>
                          <!-- <a href="#" style="color: #4F46E5; font-size: 12px; text-decoration: none;">Contact
                                            Info</a> -->
                          <!-- {{ record }} -->
                          <div
                            style="
                              font-size: 12px;
                              color: #666;
                              margin-top: 2px;
                            "
                          >
                            {{
                              truncateText(
                                record.description ||
                                  "No description available",
                                19
                              )
                            }}
                          </div>
                        </div>
                      </div>
                    </template>

                    <template v-if="column.key === 'category'">
                      <span>{{ record.category.name }}</span>
                    </template>

                    <template v-if="column.key === 'type'">
                      <span>{{ record.furniture_type }}</span>
                    </template>

                    <template v-if="column.key === 'createDate'">
                      <span>{{ formatDate(record.created_at) }}</span>
                    </template>

                    <template v-if="column.key === 'dimensions'">
                      <span style="font-size: 12px">{{
                        record.diamenstions
                      }}</span>
                    </template>

                    <template v-if="column.key === 'colors'">
                      <div style="display: flex; gap: 3px">
                        <div
                          style="display: flex; align-items: center; gap: 6px"
                        >
                          <div
                            v-for="(color, index) in record.colors.slice(0, 3)"
                            :key="index"
                            :style="{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: color,
                            }"
                          ></div>

                          <span v-if="record.colors.length > 3">...</span>
                        </div>
                      </div>
                    </template>

                    <template v-if="column.key === 'price'">
                      <span style="font-weight: 600; color: #333"
                        >${{ record.pricing.price }}</span
                      >
                      <!-- <span style="font-weight: 600; color: #333;"><del style="font-size: 10px;">${{ record.pricing.price }}</del>&nbsp;${{ record.pricing.sale_price }}</span> -->
                    </template>

                    <template v-if="column.key === 'actions'">
                      <div style="display: flex; gap: 5px">
                        <button
                          style="
                            background: #f1f5f9;
                            border: 1px solid #cbd5e1;
                            color: #64748b;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                            cursor: pointer;
                          "
                        >
                          AR
                        </button>
                        <button
                          @click="viewProduct(record)"
                          style="
                            background: #4f46e5;
                            color: white;
                            border: none;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                            cursor: pointer;
                          "
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                            ></path>
                            <path
                              d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                            ></path>
                          </svg>
                        </button>
                        <!-- <button @click="deleteProduct(record)"
                                        style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2">
                                            <polyline points="3,6 5,6 21,6"></polyline>
                                            <path
                                                d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2">
                                            </path>
                                        </svg>
                                    </button> -->
                      </div>
                    </template>
                  </template>
                </a-table>
              </div>
            </a-tab-pane>
            <a-tab-pane
              key="Wall"
              tab="Wall"
              v-if="wall.length > 0"
              force-render
            >
              <div
                style="
                  height: 70vh;
                  gap: 20px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                v-if="wall.length === 0"
              >
                <a-empty :description="'No Wall Textures Available'"></a-empty>
                <a-button
                  type="primary"
                  @click="show_add_new_wall_texture = true"
                >
                  Add Wall Texture
                </a-button>
              </div>
              <a-table
                v-else
                :columns="columns"
                :data-source="wall"
                row-key="id"
                :pagination="false"
                :scroll="{ x: 800 }"
                style="
                  background: white;
                  border-radius: 8px;
                  overflow: hidden;
                  cursor: pointer;
                "
              >
                <template #bodyCell="{ column, record, index }">
                  <!-- Serial -->
                  <template v-if="column.key === 'serial'">
                    <span style="font-weight: 600; color: #666">{{
                      index + 1
                    }}</span>
                  </template>

                  <!-- Product -->
                  <template v-if="column.key === 'product'">
                    <div
                      @click="viewProduct(record)"
                      style="
                        display: flex;
                        gap: 12px;
                        align-items: center;
                        cursor: pointer;
                      "
                    >
                      <img
                        :src="
                          $store.state.root_media_api +
                          (record.product_images.length > 0
                            ? record.product_images[0].image
                            : record.texture_image)
                        "
                        style="
                          width: 60px;
                          height: 60px;
                          border-radius: 8px;
                          object-fit: cover;
                        "
                      />
                      <div>
                        <div
                          style="
                            font-weight: 600;
                            color: #333;
                            margin-bottom: 4px;
                          "
                        >
                          {{
                            truncateText(
                              record.title || "No title available",
                              13
                            )
                          }}
                        </div>
                        <!-- <a href="#" style="color: #4F46E5; font-size: 12px; text-decoration: none;">Contact Info</a> -->
                        <div
                          style="font-size: 12px; color: #666; margin-top: 2px"
                        >
                          {{
                            truncateText(
                              record.description || "No description available",
                              19
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Category (use texture style) -->
                  <template v-if="column.key === 'Style'">
                    <span>{{ record.texture_style }}</span>
                  </template>

                  <!-- Category (use texture style) -->
                  <template v-if="column.key === 'category'">
                    <span>Wall</span>
                  </template>

                  <!-- Type (brand / model) -->
                  <template v-if="column.key === 'type'">
                    <span>{{
                      record.brand || record.model_number || "Texture"
                    }}</span>
                  </template>

                  <!-- Created Date -->
                  <template v-if="column.key === 'createDate'">
                    <span>{{ formatDate(record.created_at) }}</span>
                  </template>

                  <!-- Dimensions -->
                  <template v-if="column.key === 'dimensions'">
                    <span style="font-size: 12px">
                      {{ record.size_width }} x {{ record.size_height }} cm
                    </span>
                  </template>

                  <!-- Colors -->
                  <template v-if="column.key === 'colors'">
                    <div style="display: flex; align-items: center; gap: 6px">
                      <div
                        v-for="(color, index) in record.associated_colors.slice(
                          0,
                          3
                        )"
                        :key="index"
                        :style="{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: color.color_hex,
                        }"
                      ></div>
                      <span v-if="record.associated_colors.length > 3"
                        >...</span
                      >
                    </div>
                  </template>

                  <!-- Price -->
                  <template v-if="column.key === 'price'">
                    <span style="font-weight: 600; color: #333">
                      <!-- <del v-if="record.is_on_sale" style="font-size: 10px;">${{ record.price_per_sqm }}</del>
                                        &nbsp;${{ record.current_price_per_sqm }} -->
                      ${{ record.sale_price_per_sqm || 0 }}
                    </span>
                  </template>

                  <!-- Actions -->
                  <template v-if="column.key === 'actions'">
                    <div style="display: flex; gap: 5px">
                      <button
                        style="
                          background: #f1f5f9;
                          border: 1px solid #cbd5e1;
                          color: #64748b;
                          padding: 4px 8px;
                          border-radius: 4px;
                          font-size: 12px;
                          cursor: pointer;
                        "
                      >
                        AR
                      </button>
                      <button
                        @click="viewProduct(record)"
                        style="
                          background: #4f46e5;
                          color: white;
                          border: none;
                          padding: 4px 8px;
                          border-radius: 4px;
                          font-size: 12px;
                          cursor: pointer;
                        "
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                          ></path>
                          <path
                            d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                          ></path>
                        </svg>
                      </button>
                      <!-- <button @click="deleteProduct(record)"
                                        style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;"
                                        >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="3,6 5,6 21,6"></polyline>
                                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                                        </svg>
                                        </button> -->
                    </div>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane key="Floor" tab="Floor" v-if="floor.length > 0">
              <!-- {{ floor }} -->
              <div
                style="
                  height: 70vh;
                  gap: 20px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                v-if="floor.length === 0"
              >
                <a-empty :description="'No Floor Textures Available'"></a-empty>

                <a-button
                  type="primary"
                  @click="show_add_new_floor_texture = true"
                >
                  Add Floor Texture
                </a-button>
              </div>

              <a-table
                v-else
                :columns="columns"
                :data-source="floor"
                row-key="id"
                :pagination="false"
                :scroll="{ x: 1000 }"
                style="
                  background: white;
                  border-radius: 8px;
                  overflow: hidden;
                  cursor: pointer;
                "
              >
                <template #bodyCell="{ column, record, index }">
                  <!-- Serial -->
                  <template v-if="column.key === 'serial'">
                    <span style="font-weight: 600; color: #666">{{
                      index + 1
                    }}</span>
                  </template>

                  <!-- Product -->
                  <template v-if="column.key === 'product'">
                    <div
                      @click="viewProduct(record)"
                      style="
                        display: flex;
                        gap: 12px;
                        align-items: center;
                        cursor: pointer;
                      "
                    >
                      <img
                        :src="
                          $store.state.root_media_api +
                          (record.product_images?.length
                            ? record.product_images[0].image
                            : record.texture_image)
                        "
                        style="
                          width: 60px;
                          height: 60px;
                          border-radius: 8px;
                          object-fit: cover;
                        "
                      />
                      <div>
                        <div
                          style="
                            font-weight: 600;
                            color: #333;
                            margin-bottom: 4px;
                          "
                        >
                          {{
                            truncateText(
                              record.title || "No title available",
                              13
                            )
                          }}
                        </div>
                        <!-- <a href="#" style="color: #4F46E5; font-size: 12px; text-decoration: none;">Contact Info</a> -->
                        <div
                          style="font-size: 12px; color: #666; margin-top: 2px"
                        >
                          {{
                            truncateText(
                              record.description || "No description available",
                              19
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Category (Texture Style) -->
                  <template v-if="column.key === 'category'">
                    <span>{{ record.texture_style || "-" }}</span>
                  </template>

                  <!-- Type (Brand / Model) -->
                  <template v-if="column.key === 'type'">
                    <span>{{
                      record.brand || record.model_number || "Floor Tile"
                    }}</span>
                  </template>

                  <!-- Created Date -->
                  <template v-if="column.key === 'createDate'">
                    <span>{{ formatDate(record.created_at) }}</span>
                  </template>

                  <!-- Dimensions -->
                  <template v-if="column.key === 'dimensions'">
                    <span style="font-size: 12px">
                      <template v-if="record.size_width && record.size_height">
                        {{ record.size_width }} x {{ record.size_height }} cm
                      </template>
                      <template v-else>-</template>
                    </span>
                  </template>

                  <!-- Colors -->
                  <template v-if="column.key === 'colors'">
                    <div style="display: flex; align-items: center; gap: 6px">
                      <div
                        v-for="(color, i) in record.associated_colors?.slice(
                          0,
                          3
                        )"
                        :key="i"
                        :style="{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: color.color_hex,
                        }"
                      ></div>
                      <span v-if="record.associated_colors?.length > 3"
                        >...</span
                      >
                    </div>
                  </template>

                  <!-- Price -->
                  <template v-if="column.key === 'price'">
                    <span style="font-weight: 600; color: #333">
                      <template v-if="record.is_on_sale">
                        <del style="font-size: 10px; color: #999"
                          >${{ record.price_per_sqm }}</del
                        >
                        &nbsp;${{
                          record.sale_price_per_sqm ||
                          record.current_price_per_sqm
                        }}
                      </template>
                      <template v-else>
                        <!-- ${{ record.current_price_per_sqm || record.price_per_sqm }} -->

                        ${{ record.sale_price_per_sqm || 0 }}
                      </template>
                    </span>
                  </template>

                  <!-- Actions -->
                  <template v-if="column.key === 'actions'">
                    <div style="display: flex; gap: 5px">
                      <button
                        style="
                          background: #f1f5f9;
                          border: 1px solid #cbd5e1;
                          color: #64748b;
                          padding: 4px 8px;
                          border-radius: 4px;
                          font-size: 12px;
                          cursor: pointer;
                        "
                      >
                        AR
                      </button>
                      <button
                        @click="viewProduct(record)"
                        style="
                          background: #4f46e5;
                          color: white;
                          border: none;
                          padding: 4px 8px;
                          border-radius: 4px;
                          font-size: 12px;
                          cursor: pointer;
                        "
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                          ></path>
                          <path
                            d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                          ></path>
                        </svg>
                      </button>
                      <!-- <button @click="deleteProduct(record)"
                                            style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="3,6 5,6 21,6"></polyline>
                                                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                                            </svg>
                                            </button> -->
                    </div>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane key="Lights" tab="Lights" v-if="myLights.length > 0">
              <div
                v-if="myLights.length === 0"
                style="
                  height: 70vh;
                  gap: 20px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <a-empty :description="'No Lights Available'"></a-empty>

                <a-button type="primary" @click="show_add_new_light = true">
                  Add Lights Product
                </a-button>
              </div>
              <div v-else>
                <a-table
                  :columns="columns"
                  :data-source="myLights"
                  row-key="id"
                  :scroll="{ x: 800 }"
                  :pagination="{
                    current: lightsPagination.currentPage,
                    pageSize: lightsPagination.pageSize,
                    total: lightsPagination.totalCount,
                    onChange: handleLightsPageChange,
                    showTotal: (total) => `Total ${total} items`,
                  }"
                  style="
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                  "
                >
                  <!-- 
                                <a-table :columns="columns" :data-source="myLights" row-key="id" :pagination="false"
:scroll="{ x: 800 }" style="background: white; border-radius: 8px; overflow: hidden; cursor:pointer"> -->
                  <template #bodyCell="{ column, record, index }">
                    <template v-if="column.key === 'serial'">
                      <span style="font-weight: 600; color: #666">{{
                        index + 1
                      }}</span>
                    </template>

                    <template v-if="column.key === 'product'">
                      <div
                        @click="viewProduct(record)"
                        style="
                          display: flex;
                          gap: 12px;
                          align-items: center;
                          cursor: pointer;
                        "
                      >
                        <img
                          :src="
                            $store.state.root_media_api + record.primary_image
                          "
                          style="
                            width: 60px;
                            height: 60px;
                            border-radius: 8px;
                            object-fit: cover;
                          "
                        />
                        <div>
                          <div
                            style="
                              font-weight: 600;
                              color: #333;
                              margin-bottom: 4px;
                            "
                          >
                            {{
                              truncateText(
                                record.name || "No title available",
                                13
                              )
                            }}
                          </div>
                          <!-- <a href="#" style="color: #4F46E5; font-size: 12px; text-decoration: none;">Contact
                                            Info</a> -->
                          <!-- {{ record }} -->
                          <div
                            style="
                              font-size: 12px;
                              color: #666;
                              margin-top: 2px;
                            "
                          >
                            {{
                              truncateText(
                                record.description ||
                                  "No description available",
                                19
                              )
                            }}
                          </div>
                        </div>
                      </div>
                    </template>

                    <template v-if="column.key === 'category'">
                      <span>{{ record.category.name }}</span>
                    </template>

                    <template v-if="column.key === 'type'">
                      <span>{{ record.light_type }}</span>
                    </template>

                    <template v-if="column.key === 'createDate'">
                      <span>{{ formatDate(record.created_at) }}</span>
                    </template>

                    <template v-if="column.key === 'dimensions'">
                      <span style="font-size: 12px">{{
                        record.diamenstions
                      }}</span>
                    </template>

                    <template v-if="column.key === 'colors'">
                      <div style="display: flex; gap: 3px">
                        <div
                          style="display: flex; align-items: center; gap: 6px"
                        >
                          <div
                            v-for="(color, index) in record.colors.slice(0, 3)"
                            :key="index"
                            :style="{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: color,
                            }"
                          ></div>

                          <span v-if="record.colors.length > 3">...</span>
                        </div>
                      </div>
                    </template>

                    <template v-if="column.key === 'price'">
                      <span style="font-weight: 600; color: #333"
                        >${{ record.pricing.price }}</span
                      >
                      <!-- <span style="font-weight: 600; color: #333;"><del style="font-size: 10px;">${{ record.pricing.price }}</del>&nbsp;${{ record.pricing.sale_price }}</span> -->
                    </template>

                    <template v-if="column.key === 'actions'">
                      <div style="display: flex; gap: 5px">
                        <button
                          style="
                            background: #f1f5f9;
                            border: 1px solid #cbd5e1;
                            color: #64748b;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                            cursor: pointer;
                          "
                        >
                          AR
                        </button>
                        <button
                          @click="viewProduct(record)"
                          style="
                            background: #4f46e5;
                            color: white;
                            border: none;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                            cursor: pointer;
                          "
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                            ></path>
                            <path
                              d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                            ></path>
                          </svg>
                        </button>
                        <!-- <button @click="deleteProduct(record)"
                                        style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2">
                                            <polyline points="3,6 5,6 21,6"></polyline>
                                            <path
                                                d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2">
                                            </path>
                                        </svg>
                                    </button> -->
                      </div>
                    </template>
                  </template>
                </a-table>
              </div>
            </a-tab-pane>

            <a-tab-pane
              key="Furniture"
              tab="Furniture"
              v-if="filteredProducts.length === 0"
            >
              <div
                v-if="!filteredProducts.length"
                style="
                  height: 70vh;
                  gap: 20px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <a-empty :description="'No Furniture Available'"></a-empty>

                <a-button type="primary" @click="addProduct()">
                  Add Furniture
                </a-button>
              </div>
            </a-tab-pane>
            <a-tab-pane
              key="Wall"
              tab="Wall"
              v-if="wall.length === 0"
              force-render
            >
              <!-- {{ wall }} -->
              <div
                style="
                  height: 70vh;
                  gap: 20px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                v-if="wall.length === 0"
              >
                <a-empty :description="'No Wall Textures Available'"></a-empty>
                <a-button
                  type="primary"
                  @click="show_add_new_wall_texture = true"
                >
                  Add Wall Texture
                </a-button>
              </div>
            </a-tab-pane>
            <a-tab-pane key="Floor" tab="Floor" v-if="floor.length === 0">
              <!-- {{ floor }} -->
              <div
                style="
                  height: 70vh;
                  gap: 20px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
                v-if="floor.length === 0"
              >
                <a-empty :description="'No Floor Textures Available'"></a-empty>

                <a-button
                  type="primary"
                  @click="show_add_new_floor_texture = true"
                >
                  Add Floor Texture
                </a-button>
              </div></a-tab-pane
            >
            <a-tab-pane key="Lights" tab="Lights" v-if="myLights.length === 0">
              <div
                v-if="myLights.length === 0"
                style="
                  height: 70vh;
                  gap: 20px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <!-- required light configuration solution to add new light product -->
                <!-- <br>❌ un-sunk light <br>
                                    ❌ 3D Lamp light draggabe everywhere <br>                             
                                    ✅ sunk light <br>
                                    ✅ sticked ceiling 3D light <br>                              -->
                <a-empty :description="'No Lights Available'"></a-empty>

                <a-button type="primary" @click="show_add_new_light = true">
                  Add Lights Product
                </a-button>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <!-- {{ selectedProduct.category }} -->

      <!-- Product Details View -->

      <!-- Product Details View with Spinner -->
      <div
        v-if="currentView === 'details'"
        style="max-width: 1200px; padding: 3px"
      >
        <!-- Spinner/Loader While Loading -->
        <div
          v-if="isLoading"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 70vh;
            flex-direction: column;
            gap: 20px;
          "
        >
          <!-- Ant Design Spin Component -->
          <a-spin size="large" />

          <!-- Optional: Custom Loading Text -->
          <p style="color: #666; font-size: 16px; font-weight: 500">
            Loading product details...
          </p>
        </div>

        <!-- Product Details Content -->
        <div v-else>
          <show_floorTexture_product
            :selectedTexture="selectedProduct"
            v-if="active_tab === 'Floor' && selectedProduct"
            @edit_texture="editProduct"
            @delete_texture="delete_product"
            @back_product_list="backToList"
          />
          <show_wallTexture_product
            :selectedTexture="selectedProduct"
            v-if="active_tab === 'Wall' && selectedProduct"
            @edit_texture="editProduct"
            @delete_texture="delete_product"
            @back_product_list="backToList"
          />
          <!-- <show_furniture_product  
            :selectedProduct="selectedProduct" 
            v-if="active_tab === 'Furniture' && selectedProduct" 
            @edit_product="editProduct" 
            @delete_product="delete_product" 
            @back_product_list="backToList" 
        /> -->
          <show_furniture_product
            :selectedProduct="selectedProduct"
            v-if="active_tab === 'Furniture' && selectedProduct"
            @edit_product="editProduct"
            @create_variation="createVariation"
            @delete_product="delete_product"
            @back_product_list="backToList"
            @select_variant="handleVariantSelection"
          />

          <!-- Different Light Products Details Component -->
          <show_Light_product_3D
            :selectedProduct="selectedProduct"
            v-if="
              active_tab === 'Lights' &&
              selectedProduct &&
              selectedProduct.is_ceiling_light_product &&
              selectedProduct.light_type == 'hanging'
            "
            @edit_product="editProduct"
            @delete_product="delete_product"
            @back_product_list="backToList"
          />
          <show_Light_product_sunk
            :selectedProduct="selectedProduct"
            v-if="
              active_tab === 'Lights' &&
              selectedProduct &&
              selectedProduct.is_ceiling_light_product &&
              selectedProduct.light_type == 'sunk'
            "
            @edit_product="editProduct"
            @delete_product="delete_product"
            @back_product_list="backToList"
          />
          <show_Light_product_unsunk
            :selectedProduct="selectedProduct"
            v-if="
              active_tab === 'Lights' &&
              selectedProduct &&
              selectedProduct.is_ceiling_light_product &&
              selectedProduct.light_type == 'unsunk'
            "
            @edit_product="editProduct"
            @delete_product="delete_product"
            @back_product_list="backToList"
          />
        </div>
      </div>

      <!-- Edit Product View -->
      <div v-if="currentView === 'edit'" style="max-width: 1200px">
        <edit_floorTexture
          :selectedTexture="selectedProduct"
          v-if="active_tab === 'Floor' && selectedProduct"
          :categories_available="categories_available"
          :types="types"
          @cancel_edit_back_product_list="backToList"
        />
        <edit_wallTexture
          :selectedTexture="selectedProduct"
          v-if="active_tab === 'Wall' && selectedProduct"
          :categories_available="categories_available"
          :types="types"
          @cancel_edit_back_product_list="backToList"
        />
        <edit_furniture
          :selectedProduct="selectedProduct"
          v-if="active_tab === 'Furniture' && selectedProduct"
          :categories_available="categories_available"
          :types="types"
          @cancel_edit_back_product_list="backToList"
        />
        <!-- <edit_furniture :selectedProduct="selectedProduct" v-if="selectedProduct" :categories_available="categories_available" :types="types" @cancel_edit_back_product_list="backToList" /> -->

        <!-- <edit_Light :selectedProduct="selectedProduct" v-if="active_tab===  'Lights' && selectedProduct" :categories_available="categories_available" :types="types" @cancel_edit_back_product_list="backToList" /> -->

        <edit_Light_hanging_3d
          :selectedProduct="selectedProduct"
          v-if="
            active_tab === 'Lights' &&
            selectedProduct &&
            selectedProduct.is_ceiling_light_product &&
            selectedProduct.light_type == 'hanging'
          "
          :categories_available="categories_available"
          :types="types"
          @cancel_edit_back_product_list="backToList"
        />
        <edit_Light_sunk
          :selectedProduct="selectedProduct"
          v-if="
            active_tab === 'Lights' &&
            selectedProduct &&
            selectedProduct.is_ceiling_light_product &&
            selectedProduct.light_type == 'sunk'
          "
          :categories_available="categories_available"
          :types="types"
          @cancel_edit_back_product_list="backToList"
        />
        <edit_Light_unsunk
          :selectedProduct="selectedProduct"
          v-if="
            active_tab === 'Lights' &&
            selectedProduct &&
            selectedProduct.is_ceiling_light_product &&
            selectedProduct.light_type == 'unsunk'
          "
          :categories_available="categories_available"
          :types="types"
          @cancel_edit_back_product_list="backToList"
        />
      </div>

      <!-- Hidden file inputs for image uploads -->
      <input
        ref="mainImageInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleMainImageChange"
      />
      <input
        ref="galleryImageInput"
        type="file"
        accept="image/*"
        multiple
        style="display: none"
        @change="handleGalleryImageChange"
      />
    </div>
    <br />
  </div>
</template>

<script>
import {
  HeartOutlined,
  HeartFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import product_details from "@/components/store/product_details.vue";
// import edit_product from '@/components/store/edit_product.vue'
// import add_new_product from '@/components/store/add_new_product.vue'

import { Modal } from "ant-design-vue";

import { createVNode } from "vue";

// add new
import add_new_floorTexture from "@/components/dashboard/business/my_products/add_new_product/add_floor_texture.vue";
import add_new_wallTexture from "@/components/dashboard/business/my_products/add_new_product/add_wall_texture.vue";
import add_new_Light from "@/components/dashboard/business/my_products/add_new_product/add_light.vue";
import add_new_furniture from "@/components/dashboard/business/my_products/add_new_product/add_furniture.vue";

// update_existing
import edit_floorTexture from "@/components/dashboard/business/my_products/update_product/floor_texture.vue";
import edit_wallTexture from "@/components/dashboard/business/my_products/update_product/wall_texture.vue";
import edit_furniture from "@/components/dashboard/business/my_products/update_product/furniture.vue";

import edit_Light from "@/components/dashboard/business/my_products/update_product/light.vue";
import edit_Light_hanging_3d from "@/components/dashboard/business/my_products/update_product/light_hanging_3d.vue";
import edit_Light_sunk from "@/components/dashboard/business/my_products/update_product/light_sunk.vue";
import edit_Light_unsunk from "@/components/dashboard/business/my_products/update_product/light_unsunk.vue";

// show existing
import show_floorTexture_product from "@/components/dashboard/business/my_products/product_details/floor_texture.vue";
import show_wallTexture_product from "@/components/dashboard/business/my_products/product_details/wall_texture.vue";
import show_furniture_product from "@/components/dashboard/business/my_products/product_details/furniture_product.vue";

// differentt Light Products Details Component
import show_Light_product_sunk from "@/components/dashboard/business/my_products/product_details/light_product_sunk.vue";
import show_Light_product_unsunk from "@/components/dashboard/business/my_products/product_details/light_product_ununk.vue";
import show_Light_product_3D from "@/components/dashboard/business/my_products/product_details/light_product_3d.vue";
import add_furniture_modal_local_3d_model from "@/components/dashboard/business/my_products/add_new_product/add_furniture_modal_local_3d_model.vue";
import add_furniture_modal_local_3d_model_create_variation from "@/components/dashboard/business/my_products/add_new_product/add_furniture_modal_local_3d_model_create_variation.vue";
import add_light_modal_local_3d_model from "@/components/dashboard/business/my_products/add_new_product/add_light_modal_local_3d_model.vue";

export default {
  name: "UnifiedProducts",
  components: {
    HeartOutlined,
    HeartFilled,
    ExclamationCircleOutlined,
    product_details,
    // edit_product,
    // add_new_product,

    // add new Create API show the modal
    add_new_floorTexture,
    add_new_wallTexture,
    add_new_Light,
    add_new_furniture,
    add_furniture_modal_local_3d_model,
    add_furniture_modal_local_3d_model_create_variation,
    add_light_modal_local_3d_model,

    // edit_update
    edit_floorTexture,
    edit_wallTexture,
    edit_Light,
    edit_furniture,

    // show_product_details
    show_floorTexture_product,
    show_wallTexture_product,
    show_furniture_product,

    // show_Light_product,
    show_Light_product_sunk,
    show_Light_product_unsunk,
    show_Light_product_3D,

    // update_Light_product,
    edit_Light_hanging_3d,
    edit_Light_sunk,
    edit_Light_unsunk,
  },
  data() {
    return {
      prepopulatedProductData: null,
      isCreatingVariation: false,
      currentView: "list", // 'list', 'details', 'edit'
      viewMode: "grid", // 'grid', 'table'
      active_tab: "Furniture",
      searchQuery: "",
      isLoading: false,
      selectedProduct: null,
      imageLoadedMap: {}, // ✨ ADD THIS
    
    prepopulatedProductData: null,
    isCreatingVariation: false,

      // popup for the add new product where user will need to choose the local 3d model or the DYD generated 3d model there
      open_add_newProductModal: false,
      show_add_new_product_locally_3d_model: false,
      show_add_new_product_locally_3d_model_create_variation: false,
      open_add_newLightModal: false,
      show_add_new_light_product_locally_3d_model: false,

      editingProduct: null,
      originalProduct: null,
      showAddProduct: false,
      show_add_new_floor_texture: false,
      show_add_new_wall_texture: false,
      show_add_new_light: false,
      categories_available: [],
      types: [],
      columns: [
        {
          title: "",
          key: "serial",
          width: 40,
        },
        {
          title: "Product",
          key: "product",
          width: 200,
        },
        {
          title: "Category",
          key: "category",
          width: 70,
        },
        {
          title: "Type",
          key: "type",
          width: 70,
        },
        {
          title: "Create date",
          key: "createDate",
          width: 120,
        },
        {
          title: "Size",
          key: "dimensions",
          width: 100,
        },
        {
          title: "Color",
          key: "colors",
          width: 80,
        },
        {
          title: "Price",
          key: "price",
          width: 40,
        },
        {
          title: "AR/VR",
          key: "actions",
          width: 80,
        },
      ],
      products: [],
      wall: [],
      floor: [],
      myLights: [],

      // Pagination states for Products
      productsPagination: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
      },

      // Pagination states for Lights
      lightsPagination: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
      },

      // Pagination states for Wall
      wallPagination: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
      },

      // Pagination states for Floor
      floorPagination: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
      },
    };
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) return this.products;
      return this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.category.name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          product.furniture_type
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
      );
    },
  },
  mounted() {
    this.fetchMyProducts();
    this.fetchMyLights();
    this.fetchMyWallTextureProducts();
    this.fetchMyFloorTextureProducts();
  },
  methods: {
    createVariation() {
      
      console.log("Creating variation for:", this.selectedProduct);

      if (!this.selectedProduct) {
        this.$message.error("No product selected");
        return;
      }

      // console.log(this.selectedProduct.furniture_type)
      try {
        // Prepare prepopulated data
        this.prepopulatedProductData = {
          id: this.selectedProduct.id,
          name: `${this.selectedProduct.name} - Variation`,
          description: this.selectedProduct.description || "",
          category_name: this.selectedProduct.category?.name || "",
          furniture_type: this.selectedProduct.furniture_type || "",
          price: this.selectedProduct.pricing?.price || null,
          height: this.selectedProduct.dimensions?.height || null,
          length: this.selectedProduct.dimensions?.length || null,
          width: this.selectedProduct.dimensions?.width || null,
          available_colors: this.selectedProduct.colors || [],
          images:
            this.selectedProduct.product_images?.map((img) => ({
              url: img.image,
              id: img.id,
              name: `Image ${img.id}`,
              isExisting: true,
            })) || [],
          model_url: this.selectedProduct.model_3d || null,
          // Mark as base product ID for variation
          base_product_id: this.selectedProduct.id,
          is_variation: true,
        };

        this.isEditingVariation = true;
        this.show_add_new_product_locally_3d_model_create_variation = true;

        console.log("Prepopulated data set:", this.prepopulatedProductData);
      } catch (error) {
        console.error("Error creating variation:", error);
        this.$message.error("Failed to prepare variation data");
      }
    },

    onProductImageLoad(id) {
    this.imageLoadedMap[id] = false;
    setTimeout(() => {
      this.imageLoadedMap[id] = true;
    }, 2000);
  },
    handleVariantSelection(variantId) {
      // Call your existing fetchProductDetails method with the variant ID
      this.fetchProductDetails(variantId);
    },
    async toggleFavorite(product, product_type) {
      try {
        const token = localStorage.getItem("token");
        console.log(product);
        const response = await fetch(
          `${this.$store.state.root_api}likes/favorites/toggle/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              id: product.id,
              type: product_type,
            }),
          }
        );

        const data = await response.json();

        product.is_favorited = data.favorited;
      } catch (error) {
        console.error("Favorite toggle failed", error);
      }
    },

    delete_product(e) {
      console.log("clicked delete");
      console.log(e);
      if (e["product_type"] == "wall") {
        this.deleteWallTexture(e["product_id"]);
      }
      if (e["product_type"] == "Floor") {
        this.deleteFloorTexture(e["product_id"]);
      }
      if (e["product_type"] == "Light") {
        this.deleteLight(e["product_id"]);
      }
      if (e["product_type"] == "Furniture") {
        this.deleteFurniture(e["product_id"]);
      }
    },

    deleteWallTexture(product_id) {
      Modal.confirm({
        title: "Delete Wall Texture",
        icon: createVNode(ExclamationCircleOutlined),
        content:
          "Are you sure you want to delete this wall texture? This action cannot be undone.",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            let url_delete_product = `${this.$store.state.root_api}room/api-owner/walls/${product_id}/`;

            const token = localStorage.getItem("token");
            const response = await fetch(`${url_delete_product}`, {
              method: "DELETE",
              headers: {
                Authorization: `Token ${token}`,
              },
            });

            if (response.ok) {
              this.$message.success("Wall texture deleted successfully");
              this.currentView = "list";
              this.selectedProduct = null;
              this.fetchMyWallTextureProducts();
            } else {
              this.$message.error("Failed to delete wall texture");
              console.error("Delete failed with status:", response.status);
            }
          } catch (error) {
            this.$message.error("Error deleting wall texture");
            console.error("Error deleting wall texture:", error);
          }
        },
        onCancel() {
          console.log("Delete cancelled");
        },
      });
    },

    deleteFloorTexture(product_id) {
      console.log("clicked on delete FloorTexture");
      Modal.confirm({
        title: "Delete Floor Texture",
        icon: createVNode(ExclamationCircleOutlined),
        content:
          "Are you sure you want to delete this floor texture? This action cannot be undone.",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            let url_delete_product = `${this.$store.state.root_api}room/api-owner/floors/${product_id}/`;

            const token = localStorage.getItem("token");
            const response = await fetch(`${url_delete_product}`, {
              method: "DELETE",
              headers: {
                Authorization: `Token ${token}`,
              },
            });

            if (response.ok) {
              this.$message.success("Floor texture deleted successfully");
              this.currentView = "list";
              this.selectedProduct = null;
              this.fetchMyFloorTextureProducts();
            } else {
              this.$message.error("Failed to delete floor texture");
              console.error("Delete failed with status:", response.status);
            }
          } catch (error) {
            this.$message.error("Error deleting floor texture");
            console.error("Error deleting floor texture:", error);
          }
        },
        onCancel() {
          console.log("Delete cancelled");
        },
      });
    },

    deleteLight(product_id) {
      Modal.confirm({
        title: "Delete Light",
        icon: createVNode(ExclamationCircleOutlined),
        content:
          "Are you sure you want to delete this light? This action cannot be undone.",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            let url_delete_product = `${this.$store.state.root_api}product/api-product-owner/lights/${product_id}/`;

            const token = localStorage.getItem("token");
            const response = await fetch(`${url_delete_product}`, {
              method: "DELETE",
              headers: {
                Authorization: `Token ${token}`,
              },
            });

            if (response.ok) {
              this.$message.success("Light deleted successfully");
              this.currentView = "list";
              this.selectedProduct = null;
              this.fetchMyLights();
            } else {
              this.$message.error("Failed to delete light");
              console.error("Delete failed with status:", response.status);
            }
          } catch (error) {
            this.$message.error("Error deleting light");
            console.error("Error deleting light:", error);
          }
        },
        onCancel() {
          console.log("Delete cancelled");
        },
      });
    },

    deleteFurniture(product_id) {
      Modal.confirm({
        title: "Delete Furniture",
        icon: createVNode(ExclamationCircleOutlined),
        content:
          "Are you sure you want to delete this furniture? This action cannot be undone.",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            let url_delete_product = `${this.$store.state.root_api}product/api-product-owner/products/${product_id}/`;

            const token = localStorage.getItem("token");
            const response = await fetch(`${url_delete_product}`, {
              method: "DELETE",
              headers: {
                Authorization: `Token ${token}`,
              },
            });

            if (response.ok) {
              this.$message.success("Furniture deleted successfully");
              this.currentView = "list";
              this.selectedProduct = null;
              this.fetchMyProducts();
            } else {
              this.$message.error("Failed to delete furniture");
              console.error("Delete failed with status:", response.status);
            }
          } catch (error) {
            this.$message.error("Error deleting furniture");
            console.error("Error deleting furniture:", error);
          }
        },
        onCancel() {
          console.log("Delete cancelled");
        },
      });
    },

    clicked_cancel_add_new_light() {
      this.show_add_new_light = false;
    },

    handleProductsPageChange(page) {
      this.productsPagination.currentPage = page;
      this.fetchMyProducts(page);
    },

    handleLightsPageChange(page) {
      this.lightsPagination.currentPage = page;
      this.fetchMyLights(page);
    },

    handleWallPageChange(page) {
      this.wallPagination.currentPage = page;
      this.fetchMyWallTextureProducts(page);
    },

    handleFloorPageChange(page) {
      this.floorPagination.currentPage = page;
      this.fetchMyFloorTextureProducts(page);
    },
    //         truncateText(text, wordLimit) {
    //   if (!text) return '';
    //   const words = text.split(' ');
    //   if (words.length <= wordLimit) return text;
    //   return words.slice(0, wordLimit).join(' ') + '...';
    // },

    truncateText(text, charLimit = 7) {
      if (!text) return "";
      if (text.length <= charLimit) return text;
      return text.slice(0, charLimit) + "...";
    },
    filteredProductsByType(type) {
      const filtered = this.filteredProducts.filter(
        (product) =>
          product.furniture_type === type || product.category.name === type
      );
      return filtered;
    },
    formatDate(isoString) {
      const date = new Date(isoString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    },
    // async fetchMyProducts() {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await fetch(`${this.$store.state.root_api}product/api-product-owner/products/`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Token ${token}`
    //             }
    //         });
    //         const result = await response.json();
    //         if (result.success) {
    //             const data = result.data;
    //             this.products = data
    //         }
    //     } catch (error) {
    //         console.error('Error loading business profile:', error);
    //     }
    // },
    async fetchMyProducts(page = 1) {
      try {
        this.isLoading = true;
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}product/api-product-owner/products/?page=${page}&page_size=${this.productsPagination.pageSize}`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          this.products = result.data;
          // Update pagination info from response
          this.productsPagination.totalCount = result.total_count;
          this.productsPagination.totalPages = result.total_pages;
          this.productsPagination.currentPage = result.page;
        }
      } catch (error) {
        console.error("Error loading products:", error);
        this.$message.error("Error loading products");
      } finally {
        this.isLoading = false;
      }
    },
    //  async fetchMyLights() {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await fetch(`${this.$store.state.root_api}product/api-product-owner/lights/`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Token ${token}`
    //             }
    //         });
    //         const result = await response.json();
    //         if (result.success) {
    //             const data = result.data;
    //             this.myLights = data
    //         }
    //     } catch (error) {
    //         console.error('Error loading business profile:', error);
    //     }
    // },
    async fetchMyLights(page = 1) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}product/api-product-owner/lights/?page=${page}&page_size=${this.lightsPagination.pageSize}`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          this.myLights = result.data;
          // Update pagination info from response
          this.lightsPagination.totalCount = result.total_count;
          this.lightsPagination.totalPages = result.total_pages;
          this.lightsPagination.currentPage = result.page;
        }
      } catch (error) {
        console.error("Error loading lights:", error);
        this.$message.error("Error loading lights");
      }
    },
    // async fetchMyWallTextureProducts() {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await fetch(`${this.$store.state.root_api}room/api-owner/wall/`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Token ${token}`
    //             }
    //         });
    //         const result = await response.json();
    //         if (result.success) {
    //             const data = result.data;
    //             this.wall = data
    //         }
    //     } catch (error) {
    //         console.error('Error loading business profile:', error);
    //     }
    // },
    async fetchMyWallTextureProducts(page = 1) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}room/api-owner/wall/?page=${page}&page_size=${this.wallPagination.pageSize}`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          this.wall = result.data;
          this.wallPagination.totalCount = result.total_count;
          this.wallPagination.totalPages = result.total_pages;
          this.wallPagination.currentPage = result.page;
        }
      } catch (error) {
        console.error("Error loading wall textures:", error);
        this.$message.error("Error loading wall textures");
      }
    },
    // async fetchMyFloorTextureProducts() {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await fetch(`${this.$store.state.root_api}room/api-owner/floor/`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Token ${token}`
    //             }
    //         });
    //         const result = await response.json();
    //         if (result.success) {
    //             const data = result.data;
    //             this.floor = data
    //         }
    //     } catch (error) {
    //         console.error('Error loading business profile:', error);
    //     }
    // },
    async fetchMyFloorTextureProducts(page = 1) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}room/api-owner/floor/?page=${page}&page_size=${this.floorPagination.pageSize}`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          this.floor = result.data;
          this.floorPagination.totalCount = result.total_count;
          this.floorPagination.totalPages = result.total_pages;
          this.floorPagination.currentPage = result.page;
        }
      } catch (error) {
        console.error("Error loading floor textures:", error);
        this.$message.error("Error loading floor textures");
      }
    },

    async fetchProductDetails(product_id) {
      try {
        let url_product_details = `${this.$store.state.root_api}product/api-product-owner/products/${product_id}`;

        if (this.active_tab === "Wall") {
          url_product_details = `${this.$store.state.root_api}room/api-owner/walls/${product_id}`;
        }
        if (this.active_tab === "Floor") {
          url_product_details = `${this.$store.state.root_api}room/api-owner/floors/${product_id}`;
        }
        if (this.active_tab === "Lights") {
          url_product_details = `${this.$store.state.root_api}product/api-product-owner/lights/${product_id}`;
        }

        const token = localStorage.getItem("token");
        const response = await fetch(`${url_product_details}`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const result = await response.json();
        if (result.success) {
          const data = result.data;
          this.selectedProduct = data;
          this.categories_available = result.categories_available;
          this.types = result.types;

          // Hide loader after data is loaded
          this.isLoading = false;
        } else {
          this.$message.error("Failed to load product details");
          this.isLoading = false;
          this.backToList();
        }
      } catch (error) {
        console.error("Error loading product details:", error);
        this.$message.error("Error loading product details");
        this.isLoading = false;
        this.backToList();
      }
    },

    viewProduct(product) {
      this.isLoading = true;
      this.currentView = "details";

      // Fetch product details
      this.fetchProductDetails(product.id);
    },
    backToList() {
      this.currentView = "list";
      this.selectedProduct = null;
    },
    editProduct(product) {
      this.editingProduct = JSON.parse(JSON.stringify(product));
      this.originalProduct = product;
      this.currentView = "edit";
    },
    cancelEdit() {
      this.editingProduct = null;
      this.originalProduct = null;
      if (this.selectedProduct) {
        this.currentView = "details";
      } else {
        this.currentView = "list";
      }
    },
    saveProduct() {
      if (this.editingProduct) {
        const index = this.products.findIndex(
          (p) => p.id === this.editingProduct.id
        );
        if (index !== -1) {
          this.editingProduct.dimensions = `${this.editingProduct.length} in W x ${this.editingProduct.height} H`;
          this.editingProduct.fullDimensions = `${this.editingProduct.length} in W x ${this.editingProduct.width} In D x ${this.editingProduct.height} in H`;
          this.products.splice(index, 1, this.editingProduct);
          this.selectedProduct = this.editingProduct;
        }
      }
      this.editingProduct = null;
      this.originalProduct = null;
      this.currentView = this.selectedProduct ? "details" : "list";
    },
    deleteProduct(product) {
      if (confirm(`Are you sure you want to delete ${product.name}?`)) {
        const index = this.products.findIndex((p) => p.id === product.id);
        if (index !== -1) {
          this.products.splice(index, 1);
        }
        if (this.selectedProduct && this.selectedProduct.id === product.id) {
          this.selectedProduct = null;
          this.currentView = "list";
        }
      }
    },
    addProduct() {
      this.open_add_newProductModal = true;
      // this.showAddProduct = !this.showAddProduct
      // this.$router.push("/my-products/add-new-furniture");
    },
    addLightProduct() {
      this.open_add_newLightModal = true;
      // this.showAddProduct = !this.showAddProduct

      // this.$router.push("/my-products/add-new-furniture");
    },
    add_Product_For(selected_add_newProductModal) {
      if (selected_add_newProductModal === "DYD_AI") {
        this.$router.push("/my-products/add-new-furniture");
      } else {
        this.show_add_new_product_locally_3d_model = true;
        console.log(selected_add_newProductModal);
      }
    },
    add_Product_Light_For(selected_add_newProductModal) {
      if (selected_add_newProductModal === "DYD_AI") {
        // this.$router.push("/my-products/add-new-furniture");
        this.$router.push("/my-products/add-new-light");
      } else {
        this.show_add_new_light_product_locally_3d_model = true;
        console.log(selected_add_newProductModal);
      }
    },
    // Event handlers from add_new_product component
    onProductCreated(newProduct) {
      // this.products.push(newProduct);
      this.showAddProduct = false;
      this.fetchMyProducts(); // Refresh the list
      this.fetchProductDetails(newProduct.id)
    },
    onLightProductCreated(newLightProduct) {
      // this.myLights.push(newLightProduct);
      this.open_add_newLightModal = false;
      this.show_add_new_light_product_locally_3d_model = false;
      this.show_add_new_light = false;
      this.fetchMyLights();
    },
    onCancel() {
      this.showAddProduct = false;
    },
    // Image handling methods
    handleMainImageChange(event) {
      const file = event.target.files[0];
      if (file && this.editingProduct) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editingProduct.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleGalleryImageChange(event) {
      const files = Array.from(event.target.files);
      if (files.length && this.editingProduct) {
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.editingProduct.gallery.push(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    },
  },
};
</script>

<style scoped>
.main {
  padding: 10px;
  border-radius: 20px;
  /* height: 100vh; */
  min-height: 85vh;
  background: white;
  border: 2px solid rgba(128, 128, 128, 0.16);
  margin-top: 10px;
  margin-bottom: 10px;
}
.head-section {
  display: flex;
  justify-content: space-between;
}
.product {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f3f2f4;
}
.products-list {
  padding-bottom: 20px;
}
.product-image-container {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 16px; */
}

.product-skeleton {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(110deg, #e5e7eb 8%, #f9fafb 18%, #e5e7eb 33%);
  background-size: 200% 100%;
  animation: product-shimmer 1.6s infinite linear;
  border-radius: 8px;
}

@keyframes product-shimmer {
  to {
    background-position-x: -200%;
  }
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ar-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #e5e7eb;
  color: #374151;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.product-responsive {
  width: 50%;
  flex: 0 0 50%;
}

@media (min-width: 576px) {
  .product-responsive {
    width: 50%;
    flex: 0 0 50%;
  }
}
@media (min-width: 768px) {
  .product-responsive {
    width: 33.333%;
    flex: 0 0 33.333%;
  }
}
@media (min-width: 992px) {
  .product-responsive {
    width: 25%;
    flex: 0 0 25%;
  }
}
@media (min-width: 1200px) {
  .product-responsive {
    width: 20%;
    flex: 0 0 20%;
  }
}
</style>