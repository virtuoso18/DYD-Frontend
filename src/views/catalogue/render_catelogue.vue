<template>
  <BusinessRatingModal
    :isOpen="showRatingModal"
    :businessSlug="this.$route.query.brand"
    @close="showRatingModal = false"
    @ratingSubmitted="handleRatingSubmitted"
  />
  <a-drawer
    title="AI catalog products used in room."
    :placement="'bottom'"
    :closable="true"
    :open="openSeeAll_used_products"
    height="90%"
    style="border-top-left-radius: 20px; border-top-right-radius: 20px"
    @close="openSeeAll_used_products = false"
  >
    <template #extra> <div class="head-section"></div> </template>
    <!-- {{ products_used }} -->
    <!-- <floor_textures_bottom_drawer_menu :products="seeAll_Floor"/> -->
    <a-row>
      <a-col
        span="24"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 70vh;
        "
        v-if="!products_used.length"
      >
        <a-empty
          description="You have not used any product in this room here."
        ></a-empty>
      </a-col>
      <a-col
        :lg="4"
        :md="6"
        :sm="12"
        :xs="12"
        v-for="product in products_used"
        :key="product.id"
        class="product-responsive"
        style="padding: 5px"
      >
        <!-- {{product.product_colors}} -->
        <div class="product">
          <div class="product-image-container" @click="viewProduct(product)">
            <img
              :src="$store.state.root_media_api + product.product_image"
              :alt="product.product_title"
              class="product-image"
            />
            <!-- Category Badge -->
            <div class="category-badge">{{ product.category_name }}</div>
            <!-- AR Badge -->
            <div class="ar-badge">AR</div>
          </div>
          <!-- {{ truncateText(product.description || 'No description available', 8) }} -->

          <a-row>
            <a-col span="24">
              <b>{{ product.product_title }}</b>
            </a-col>

            <a-col span="18"> Color </a-col>

            <a-col span="6" style="display: flex; justify-content: end">
              <div
                v-for="(color, index) in product.product_colors.slice(0, 2)"
                :key="index"
                style="
                  width: 20px;
                  height: 20px;
                  border-radius: 20px;
                  margin-left: 2px;
                "
                :style="
                  'background:' +
                  (color.color_hex ? color.color_hex : color.color)
                "
              >
                <!-- {{ color }} -->
              </div>
            </a-col>

            <a-col span="12"> Price </a-col>

            <a-col
              span="12"
              style="display: flex; justify-content: end; font-weight: 700"
            >
              <!-- <del style="font-size: 10px;">${{ product.pricing.price }}</del> -->
              ${{ product.product_price }}
            </a-col>

            <a-col span="17">
              <a-button
                block
                @click="
                  this.$router.push(
                    '/' +
                      product.business_slug +
                      '/' +
                      product.type +
                      '/' +
                      product.product_id,
                  )
                "
                >Product Details</a-button
              >
            </a-col>

            <a-col span="1"></a-col>
            <a-col span="4">
              <a-button><HeartOutlined /></a-button>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </a-drawer>

  <a-modal v-model:open="open_RenderNowModal" title="" footer="" centered>
    <div
      style="display:flex;align-items:center';flex-direction:column;justify-content:center; text-align:center"
    >
      <h1>Rendering</h1>
      <p>
        When the final results are ready, you’ll be notified via<br />
        email and on the My Design page.
      </p>
      <div
        :style="'padding:10px;font-size: 18px;color:blue;font-weight:bold;background-color:#f3f2f3;'"
      >
        <p>
          Estimated rendering time: 2-5 minutes <br />(larger images may take
          longer)
        </p>
      </div>
      <br />
      <div style="align-self: center">
        <a-button
          type="primary"
          @click="startRendering()"
          style="
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            height: auto;
            border-radius: 8px;
          "
        >
          <svg
            width="16"
            height="18"
            viewBox="0 0 16 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.63549 7.77344L7.08768 8.99532C7.68052 10.5976 7.97702 11.3987 8.56142 11.9831C9.14583 12.5675 9.94682 12.8639 11.5491 13.4568L12.771 13.9089L11.5491 14.3611C9.94682 14.9539 9.14583 15.2504 8.56142 15.8348C7.97702 16.4192 7.68052 17.2203 7.08768 18.8225L6.63549 20.0444L6.18331 18.8225C5.59047 17.2203 5.29397 16.4192 4.70956 15.8348C4.12516 15.2504 3.32417 14.9539 1.72188 14.3611L0.5 13.9089L1.72188 13.4568C3.32417 12.8639 4.12516 12.5675 4.70956 11.9831C5.29397 11.3987 5.59047 10.5976 6.18331 8.99532L6.63549 7.77344Z"
              fill="white"
              stroke="white"
              stroke-linejoin="round"
            />
            <path
              d="M11.6365 0.955078L11.9212 1.76967C12.2945 2.83783 12.4812 3.3719 12.8491 3.7615C13.2171 4.15111 13.7214 4.34873 14.7303 4.74398L15.4996 5.04541L14.7303 5.34683C13.7214 5.74208 13.2171 5.93971 12.8491 6.32931C12.4812 6.71891 12.2945 7.25299 11.9212 8.32115L11.6365 9.13574L11.3518 8.32115C10.9785 7.25299 10.7919 6.71891 10.4239 6.32931C10.0559 5.93971 9.55162 5.74208 8.54277 5.34683L7.77344 5.04541L8.54277 4.74398C9.55162 4.34873 10.0559 4.15111 10.4239 3.7615C10.7919 3.3719 10.9785 2.83783 11.3518 1.76967L11.6365 0.955078Z"
              fill="white"
              stroke="white"
              stroke-linejoin="round"
            />
          </svg>
          Render Now</a-button
        >
      </div>
    </div>
  </a-modal>

  <!-- Enhanced Share on Community Modal -->
  <a-modal
    v-model:open="open_ShareOnComunity"
    title=""
    footer=""
    centered
    style="width: 100%; max-width: 900px"
    :closable="true"
  >
    <div
      style="
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
      "
    >
      <div style="width: 100%; text-align: start; margin-bottom: 20px">
        <h3 style="margin: 0; font-size: 24px; font-weight: 600">
          Share on Community
        </h3>
        <p style="margin: 5px 0; color: #666">
          Share your amazing design with the community!
        </p>
      </div>

      <a-row style="width: 100%" :gutter="20">
        <!-- Image Preview -->
        <a-col :sm="24" :xs="24" :lg="10" :md="10">
          <div style="position: relative">
            <img
              :src="base_image_url"
              style="
                border-radius: 12px;
                width: 100%;
                max-height: 400px;
                object-fit: cover;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              "
              alt="Room Design"
            />
            <div
              style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 8px;
                padding: 5px 10px;
                color: white;
                font-size: 12px;
              "
            >
              Preview
            </div>
          </div>
        </a-col>

        <!-- Form Section -->
        <a-col
          :sm="24"
          :xs="24"
          :lg="14"
          :md="14"
          style="
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            min-height: 400px;
          "
        >
          <div style="flex: 1">
            <!-- Title Input -->
            <div style="margin-bottom: 20px">
              <label
                style="
                  display: block;
                  margin-bottom: 8px;
                  font-weight: 500;
                  color: #333;
                "
              >
                Post Title <span style="color: red">*</span>
              </label>
              <a-input
                v-model:value="shareForm.title"
                placeholder="Give your design an attractive title..."
                size="large"
                :maxlength="200"
                show-count
                style="border-radius: 8px"
              />
            </div>

            <!-- Tags Section -->
            <div style="margin-bottom: 20px">
              <label
                style="
                  display: block;
                  margin-bottom: 8px;
                  font-weight: 500;
                  color: #333;
                "
              >
                Tags
                <span style="color: #666; font-weight: 400; font-size: 12px"
                  >(Help others discover your design)</span
                >
              </label>

              <!-- Tag Select -->
              <a-select
                v-model:value="shareForm.selectedTags"
                mode="tags"
                placeholder="Select existing tags or create new ones..."
                style="width: 100%; border-radius: 8px"
                size="large"
                :options="availableTags"
                :loading="tagsLoading"
                @search="handleTagSearch"
                @select="handleTagSelect"
                :filter-option="false"
                :not-found-content="
                  tagsLoading
                    ? 'Loading...'
                    : 'No tags found - type to create new'
                "
              >
                <template
                  #tagRender="{ label, value, closable, onClose, option }"
                >
                  <a-tag
                    :color="option?.color || getRandomTagColor()"
                    :closable="closable"
                    @close="onClose"
                    style="margin: 2px; padding: 4px 8px; border-radius: 6px"
                  >
                    {{ label }}
                  </a-tag>
                </template>
              </a-select>

              <!-- Popular Tags -->
              <div v-if="popularTags.length > 0" style="margin-top: 10px">
                <span
                  style="
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 8px;
                    display: block;
                  "
                  >Popular tags:</span
                >
                <div style="display: flex; flex-wrap: wrap; gap: 6px">
                  <a-tag
                    v-for="tag in popularTags.slice(0, 8)"
                    :key="tag.value"
                    :color="tag.color"
                    style="cursor: pointer; border-radius: 12px; margin: 0"
                    @click="addPopularTag(tag)"
                  >
                    {{ tag.label }}
                  </a-tag>
                </div>
              </div>
            </div>

            <!-- Room Info Display -->
            <div
              style="
                background: #f8f9fa;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
              "
            >
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  margin-bottom: 8px;
                "
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#666">
                  <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                  />
                </svg>
                <span style="font-weight: 500; color: #333">Room Details</span>
              </div>
              <div
                style="display: flex; gap: 15px; font-size: 14px; color: #666"
              >
                <span
                  ><strong>Type:</strong> {{ room_type || "Living Room" }}</span
                >
                <span
                  ><strong>Style:</strong>
                  {{ room_design_type || "Modern" }}</span
                >
                <span v-if="products_used"
                  ><strong>Products:</strong>
                  {{ products_used.length }} items</span
                >
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px; margin-top: 20px">
            <a-button
              type="default"
              size="large"
              style="flex: 1; border-radius: 8px; height: 48px"
              @click="closeShareModal"
            >
              Cancel
            </a-button>
            <a-button
              type="primary"
              size="large"
              :loading="shareLoading"
              :disabled="!shareForm.title.trim()"
              @click="shareOnCommunity"
              style="
                flex: 2;
                border-radius: 8px;
                height: 48px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
              "
            >
              <svg
                v-if="!shareLoading"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M17.125 5.64648C17.125 6.95816 16.0617 8.02148 14.75 8.02148C13.4383 8.02148 12.375 6.95816 12.375 5.64648C12.375 4.33481 13.4383 3.27148 14.75 3.27148C16.0617 3.27148 17.125 4.33481 17.125 5.64648Z"
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M7.625 10C7.625 11.3117 6.56167 12.375 5.25 12.375C3.93833 12.375 2.875 11.3117 2.875 10C2.875 8.68829 3.93833 7.625 5.25 7.625C6.56167 7.625 7.625 8.68829 7.625 10Z"
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M17.125 14.3535C17.125 15.6652 16.0617 16.7285 14.75 16.7285C13.4383 16.7285 12.375 15.6652 12.375 14.3535C12.375 13.0418 13.4383 11.9785 14.75 11.9785C16.0617 11.9785 17.125 13.0418 17.125 14.3535Z"
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M7.40625 9.00937L12.5521 6.63477M7.40625 10.9889L12.5521 13.3635"
                  stroke="white"
                  stroke-width="1.5"
                />
              </svg>
              {{ shareLoading ? "Sharing..." : "Share on Community" }}
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>

  <!-- Enhanced Share on Community Modal -->
  <a-modal
    v-model:open="open_SaveToMyDesignes"
    title=""
    footer=""
    centered
    style="width: 100%; max-width: 900px"
    :closable="true"
  >
    <div
      style="
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
      "
    >
      <div style="width: 100%; text-align: start; margin-bottom: 20px">
        <h3 style="margin: 0; font-size: 24px; font-weight: 600">
          Save To My Designes
        </h3>
        <p style="margin: 5px 0; color: #666">
          Save your amazing design in your my design!
        </p>
      </div>

      <a-row style="width: 100%" :gutter="20">
        <!-- Image Preview -->
        <a-col :sm="24" :xs="24" :lg="10" :md="10">
          <div style="position: relative">
            <img
              :src="base_image_url"
              style="
                border-radius: 12px;
                width: 100%;
                max-height: 400px;
                object-fit: cover;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              "
              alt="Room Design"
            />
            <div
              style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 8px;
                padding: 5px 10px;
                color: white;
                font-size: 12px;
              "
            >
              Preview
            </div>
          </div>
        </a-col>

        <!-- Form Section -->
        <a-col
          :sm="24"
          :xs="24"
          :lg="14"
          :md="14"
          style="
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            min-height: 400px;
          "
        >
          <div style="flex: 1">
            <!-- Title Input -->
            <div style="margin-bottom: 20px">
              <label
                style="
                  display: block;
                  margin-bottom: 8px;
                  font-weight: 500;
                  color: #333;
                "
              >
                Describe Room <span style="color: red">*</span>
              </label>
              <a-input
                v-model:value="description_room"
                placeholder="Give your design an attractive descriptionhere ..."
                size="large"
                :maxlength="200"
                show-count
                style="border-radius: 8px"
              />
            </div>

            <!-- Room Info Display -->
            <div
              style="
                background: #f8f9fa;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
              "
            >
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  margin-bottom: 8px;
                "
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#666">
                  <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                  />
                </svg>
                <span style="font-weight: 500; color: #333">Room Details</span>
              </div>
              <div
                style="display: flex; gap: 15px; font-size: 14px; color: #666"
              >
                <span
                  ><strong>Style:</strong>
                  <a-select v-model:value="room_design_type_select">
                    <a-option-select value="Modern">Modern</a-option-select>
                    <a-option-select value="Classic">Classic</a-option-select>
                    <a-option-select value="Rustic">Rustic</a-option-select>
                    <a-option-select value="Industrial"
                      >Industrial</a-option-select
                    >
                    <a-option-select value="Minimalist"
                      >Minimalist</a-option-select
                    >
                    <a-option-select value="Traditional"
                      >Traditional</a-option-select
                    >
                    <a-option-select value="Contemporary"
                      >Contemporary</a-option-select
                    >
                    <a-option-select value="Vintage">Vintage</a-option-select>
                  </a-select>
                  <!-- {{ room_type || 'Living Room' }} -->
                </span>
                <span
                  ><strong>Room Type:</strong>
                  <a-select v-model:value="room_type_select">
                    <a-option-select value="Living Room"
                      >Living Room</a-option-select
                    >
                    <a-option-select value="Dinning Room"
                      >Dinning Room</a-option-select
                    >
                    <a-option-select value="Kitchen">Kitchen</a-option-select>
                    <a-option-select value="Home Office"
                      >Home Office</a-option-select
                    >
                    <a-option-select value="Bedroom">Bedroom</a-option-select>
                    <a-option-select value="Office">Office</a-option-select>
                    <a-option-select value="Rest Room"
                      >Rest Room</a-option-select
                    >
                  </a-select>
                  <!-- {{ room_design_type || 'Modern' }} -->
                </span>
                <span v-if="products_used"
                  ><strong>Products:</strong>
                  {{ products_used.length }} items</span
                >
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px; margin-top: 20px">
            <a-button
              type="default"
              size="large"
              style="flex: 1; border-radius: 8px; height: 48px"
              @click="closeShareModal"
            >
              Cancel
            </a-button>
            <a-button
              type="primary"
              size="large"
              :loading="shareLoading"
              :disabled="!description_room.trim()"
              @click="SaveToMyDesignes"
              style="
                flex: 2;
                border-radius: 8px;
                height: 48px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
              "
            >
              <svg
                v-if="!shareLoading"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M17.125 5.64648C17.125 6.95816 16.0617 8.02148 14.75 8.02148C13.4383 8.02148 12.375 6.95816 12.375 5.64648C12.375 4.33481 13.4383 3.27148 14.75 3.27148C16.0617 3.27148 17.125 4.33481 17.125 5.64648Z"
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M7.625 10C7.625 11.3117 6.56167 12.375 5.25 12.375C3.93833 12.375 2.875 11.3117 2.875 10C2.875 8.68829 3.93833 7.625 5.25 7.625C6.56167 7.625 7.625 8.68829 7.625 10Z"
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M17.125 14.3535C17.125 15.6652 16.0617 16.7285 14.75 16.7285C13.4383 16.7285 12.375 15.6652 12.375 14.3535C12.375 13.0418 13.4383 11.9785 14.75 11.9785C16.0617 11.9785 17.125 13.0418 17.125 14.3535Z"
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M7.40625 9.00937L12.5521 6.63477M7.40625 10.9889L12.5521 13.3635"
                  stroke="white"
                  stroke-width="1.5"
                />
              </svg>
              {{ shareLoading ? "Sharing..." : "Save To My Designes" }}
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>

  <div
    className="hidden lg:block"
    v-if="!rendering_started"
    style="background-color: #f3f3f3"
  >
    <a-row style="padding: 20px; padding-top: 30px">
      <a-col :span="8" style="display: flex; align-items: center">
        <button
          @click="$router.back()"
          style="
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
          "
        >
          <svg
            width="7"
            height="13"
            viewBox="0 0 7 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.08594 0.75L0.752604 6.08333L6.08594 11.4167"
              stroke="#1A1A1A"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span
            style="
              font-family: Poppins;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              letter-spacing: 0%;
            "
          >
            Back to edit
          </span>
        </button>
      </a-col>
      <a-col
        :span="8"
        style="display: flex; justify-content: center; align-items: center"
      >
        <div
          class="relative inline-flex items-center translate-y-6 bg-gray-100 rounded-xl p-1 w-full max-w-[150px] z-[2]"
        >
          <!-- Sliding background indicator -->
          <div
            class="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-blue-600 rounded-xl shadow-lg transition-all duration-300 ease-in-out"
            :class="
              currentView === 'after' ? 'left-[calc(50%+0.125rem)]' : 'left-1'
            "
          ></div>

          <!-- Before Button -->
          <button
            @click="showBefore"
            :disabled="rendering_started"
            class="relative z-10 flex-1 px-1 sm:px-2 py-2 font-medium rounded-xl transition-colors duration-300 font-poppins flex items-center justify-center min-w-0 overflow-hidden"
            style="
              font-family: Poppins;
              font-weight: 400;
              font-size: 10px;
              line-height: 20px;
              letter-spacing: 0%;
              text-align: center;
            "
            :class="[
              currentView === 'before' ? '!text-white' : 'text-gray-700',
              rendering_started
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer',
            ]"
          >
            <span class="whitespace-nowrap">Before</span>
          </button>

          <!-- After Button -->
          <button
            @click="showAfter"
            :disabled="rendering_started"
            class="relative z-10 flex-1 px-1 sm:px-2 py-2 font-medium rounded-xl transition-colors duration-300 font-poppins flex items-center justify-center min-w-0 overflow-hidden"
            style="
              font-family: Poppins;
              font-weight: 400;
              font-size: 10px;
              line-height: 20px;
              letter-spacing: 0%;
              text-align: center;
            "
            :class="[
              currentView === 'after' ? '!text-white' : 'text-gray-700',
              rendering_started
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer',
            ]"
          >
            <span class="whitespace-nowrap">After</span>
          </button>
        </div>
      </a-col>
      <a-col
        :span="8"
        style="display: flex; justify-content: flex-end; align-items: center"
      >
        <button
          style="
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.98514 1.71483C7.50739 1.7062 7.03262 1.79187 6.58802 1.96693C6.14341 2.14198 5.73769 2.403 5.39407 2.73503C5.05046 3.06706 4.7757 3.46359 4.58551 3.90193C4.39533 4.34026 4.29345 4.8118 4.28571 5.28955V10.2859C4.28571 10.589 4.16531 10.8797 3.95098 11.094C3.73665 11.3083 3.44596 11.4287 3.14286 11.4287H1.71429C1.25963 11.4287 0.823594 11.2481 0.502103 10.9267C0.180612 10.6052 0 10.1692 0 9.71452L0 7.4289C0 6.97426 0.180612 6.53824 0.502103 6.21676C0.823594 5.89528 1.25963 5.71468 1.71429 5.71468H2.57143V5.26898C2.58186 4.5666 2.73055 3.87315 3.00902 3.22824C3.28749 2.58333 3.69028 1.99959 4.19439 1.51036C4.69849 1.02113 5.29404 0.635999 5.94701 0.376953C6.59998 0.117906 7.2976 -0.00997706 8 0.000607193C8.70241 -0.00997706 9.40002 0.117906 10.053 0.376953C10.706 0.635999 11.3015 1.02113 11.8056 1.51036C12.3097 1.99959 12.7125 2.58333 12.991 3.22824C13.2695 3.87315 13.4181 4.5666 13.4286 5.26898V5.71468H14.2857C14.7404 5.71468 15.1764 5.89528 15.4979 6.21676C15.8194 6.53824 16 6.97426 16 7.4289V9.71452C16 10.1692 15.8194 10.6052 15.4979 10.9267C15.1764 11.2481 14.7404 11.4287 14.2857 11.4287H13.4286V12.0002C13.4287 12.7724 13.1445 13.5177 12.6302 14.0938C12.1158 14.6699 11.4074 15.0364 10.64 15.1235C10.491 15.3895 10.2737 15.611 10.0105 15.7651C9.74733 15.9192 9.44782 16.0003 9.14286 16H7.42857C6.97392 16 6.53788 15.8194 6.21639 15.4979C5.8949 15.1764 5.71429 14.7404 5.71429 14.2858C5.71429 13.8311 5.8949 13.3951 6.21639 13.0736C6.53788 12.7522 6.97392 12.5716 7.42857 12.5716H9.14286C9.76229 12.5716 10.3051 12.8995 10.6057 13.3921C10.9207 13.3197 11.2019 13.1426 11.4032 12.8898C11.6046 12.637 11.7142 12.3234 11.7143 12.0002V5.28841C11.7064 4.8082 11.6035 4.3343 11.4114 3.89412C11.2193 3.45394 10.9418 3.0562 10.595 2.7239C10.2483 2.39159 9.83908 2.13132 9.39111 1.95812C8.94313 1.78492 8.46527 1.70223 7.98514 1.71483Z"
              fill="#1A1A1A"
            />
          </svg>
          <span
            style="
              font-family: Poppins;
              font-weight: 400;
              font-size: 16px;
              line-height: 20px;
              letter-spacing: 0%;
              text-align: center;
            "
          >
            Support
          </span>
        </button>
      </a-col>
    </a-row>
    <div
      style="
        display: flex;
        justify-content: center;
        padding-top: 20px;
        margin-top: -85px;
      "
    >
      <div
        style="
          padding: 15px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          background: white;
        "
      >
        <div style="position: relative; display: inline-block">
          <div
            v-if="imageLoading"
            style="
              width: 100%;
              max-width: 800px;
              height: 500px;
              background: linear-gradient(
                90deg,
                #f0f0f0 25%,
                #e0e0e0 50%,
                #f0f0f0 75%
              );
              background-size: 200% 100%;
              animation: skeleton-loading 1.5s infinite;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <div style="text-align: center; color: #999">
              <div style="font-size: 16px; margin-bottom: 8px">
                <LoadingOutlined style="font-size: 32px" />
              </div>
              <div style="font-family: Poppins; font-size: 14px">
                Loading your render...
              </div>
            </div>
          </div>

          <!-- Actual Image -->
          <div
            class="relative"
            style="
              overflow: hidden;
              width: 100%;
              max-width: 800px;
              min-width: 300px;
            "
          >
            <!-- Skeleton -->
            <div
              v-if="!imageLoadedMap['room']"
              class="room-render-skeleton"
            ></div>

            <!-- Preload image -->
            <img
              :src="displayImage"
              style="position: absolute; width: 0; height: 0; opacity: 0"
              @load="onRoomImageLoad"
              @error="handleImageError"
              alt=""
            />

            <!-- Visible image -->
            <img
              v-show="imageLoadedMap['room']"
              :src="displayImage"
              alt="Room Render"
              class="room-render-image"
            />
          </div>

          <!-- {{ this.$store.state.root_media_api+brand_banner_logo }} -->
          <img
            :src="this.$store.state.root_media_api + brand_banner_logo"
            alt="Apply Changes"
            v-show="!imageLoading"
            style="
              position: absolute;
              bottom: 10px;
              right: 10px;
              width: 60px;
              height: 60px;
              border-radius: 10px;
            "
          />
        </div>

        <div
          style="
            display: flex;
            gap: 15px;
            padding-top: 15px;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
          "
        >
          <div
            style="
              padding: 12px 16px;
              background: #f2f9fa;
              border-radius: 8px;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              gap: 12px;
            "
          >
            <span style="color: #666; font-size: 14px; font-weight: 500"
              >Share on social:</span
            >

            <svg
              width="21"
              height="22"
              viewBox="0 0 21 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.443867 10.774C0.443375 12.6063 0.908 14.3953 1.79148 15.9722L0.359375 21.3601L5.71044 19.9144C7.19048 20.7446 8.84874 21.1796 10.5339 21.1797H10.5383C16.1013 21.1797 20.6296 16.5153 20.632 10.7822C20.6331 8.00407 19.5841 5.39171 17.6781 3.42631C15.7726 1.46108 13.2382 0.378221 10.5379 0.376953C4.97429 0.376953 0.446246 5.04109 0.443949 10.774"
                fill="url(#paint0_linear_7489_34286)"
              />
              <path
                d="M0.0877734 10.77C0.0871992 12.6682 0.568476 14.5212 1.48345 16.1546L0 21.7356L5.54293 20.238C7.07019 21.0961 8.78973 21.5485 10.5395 21.5491H10.544C16.3065 21.5491 20.9975 16.7169 21 10.7786C21.001 7.90064 19.9142 5.19437 17.9402 3.15857C15.966 1.12301 13.341 0.00118336 10.544 0C4.78045 0 0.0900703 4.8315 0.0877734 10.77ZM3.38879 15.8733L3.18183 15.5348C2.3118 14.1093 1.85259 12.4621 1.85325 10.7706C1.85505 5.83474 5.75351 1.819 10.5473 1.819C12.8687 1.82001 15.0504 2.7525 16.6914 4.44437C18.3323 6.13641 19.2352 8.38565 19.2346 10.7779C19.2325 15.7138 15.3339 19.73 10.544 19.73H10.5405C8.98086 19.7292 7.45123 19.2976 6.11723 18.482L5.79977 18.288L2.51048 19.1767L3.38879 15.8733Z"
                fill="url(#paint1_linear_7489_34286)"
              />
              <path
                d="M7.93402 6.26829C7.7383 5.82004 7.53232 5.811 7.34619 5.80314C7.19377 5.79638 7.01954 5.79688 6.84547 5.79688C6.67123 5.79688 6.38814 5.86442 6.14886 6.13364C5.90933 6.4031 5.23438 7.05429 5.23438 8.37873C5.23438 9.70317 6.1706 10.9832 6.30111 11.163C6.43179 11.3425 8.1085 14.1474 10.764 15.2264C12.971 16.1232 13.4201 15.9448 13.8991 15.8998C14.3782 15.855 15.4449 15.2488 15.6625 14.6202C15.8803 13.9917 15.8803 13.4529 15.815 13.3403C15.7497 13.2282 15.5755 13.1608 15.3142 13.0262C15.0529 12.8917 13.7684 12.2403 13.529 12.1504C13.2894 12.0607 13.1153 12.0159 12.941 12.2854C12.7668 12.5546 12.2665 13.1608 12.114 13.3403C11.9617 13.5203 11.8092 13.5427 11.548 13.408C11.2866 13.2729 10.4452 12.989 9.44693 12.072C8.67025 11.3584 8.14591 10.4773 7.9935 10.2077C7.84108 9.93857 7.97717 9.79268 8.10818 9.65854C8.22556 9.53792 8.36953 9.34418 8.50029 9.18705C8.63055 9.02983 8.67403 8.91767 8.76114 8.73813C8.84834 8.55843 8.8047 8.40121 8.73949 8.26656C8.67403 8.13191 8.16634 6.80054 7.93402 6.26829Z"
                fill="white"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_7489_34286"
                  x1="1013.99"
                  y1="2098.69"
                  x2="1013.99"
                  y2="0.376953"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#1FAF38" />
                  <stop offset="1" stop-color="#60D669" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_7489_34286"
                  x1="1050"
                  y1="2173.56"
                  x2="1050"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#F9F9F9" />
                  <stop offset="1" stop-color="white" />
                </linearGradient>
              </defs>
            </svg>

            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_7489_34290)">
                <path
                  d="M20 10C20 4.47719 15.5228 0 10 0C4.47719 0 0 4.47719 0 10C0 14.9913 3.65687 19.1284 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2147 3.90625C13.3088 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.9499 6.5625 11.5625 7.33336 11.5625 8.12422V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3431 19.1284 20 14.9913 20 10Z"
                  fill="#1877F2"
                />
                <path
                  d="M13.8926 12.8906L14.3359 10H11.5625V8.12422C11.5625 7.33328 11.9499 6.5625 13.1922 6.5625H14.4531V4.10156C14.4531 4.10156 13.3088 3.90625 12.2146 3.90625C9.93047 3.90625 8.4375 5.29063 8.4375 7.79688V10H5.89844V12.8906H8.4375V19.8785C8.95439 19.9595 9.4768 20.0001 10 20C10.5232 20.0001 11.0456 19.9595 11.5625 19.8785V12.8906H13.8926Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_7489_34290">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_7489_34293)">
                <path
                  d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z"
                  fill="url(#paint0_radial_7489_34293)"
                />
                <path
                  d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z"
                  fill="url(#paint1_radial_7489_34293)"
                />
                <path
                  d="M10.0007 2.1875C7.87898 2.1875 7.61266 2.1968 6.77938 2.23469C5.94766 2.27281 5.37992 2.40445 4.8832 2.59766C4.3693 2.79719 3.93344 3.06414 3.49922 3.49852C3.06461 3.93281 2.79766 4.36867 2.5975 4.88234C2.40375 5.37922 2.27195 5.94719 2.23453 6.77852C2.19727 7.61188 2.1875 7.87828 2.1875 10.0001C2.1875 12.1219 2.19688 12.3873 2.23469 13.2206C2.27297 14.0523 2.40461 14.6201 2.59766 15.1168C2.79734 15.6307 3.0643 16.0666 3.49867 16.5008C3.93281 16.9354 4.36867 17.203 4.88219 17.4025C5.3793 17.5957 5.94711 17.7273 6.77867 17.7655C7.61203 17.8034 7.87813 17.8127 9.99977 17.8127C12.1217 17.8127 12.3872 17.8034 13.2205 17.7655C14.0522 17.7273 14.6205 17.5957 15.1177 17.4025C15.6313 17.203 16.0666 16.9354 16.5006 16.5008C16.9352 16.0666 17.2021 15.6307 17.4023 15.117C17.5944 14.6201 17.7262 14.0522 17.7653 13.2208C17.8027 12.3875 17.8125 12.1219 17.8125 10.0001C17.8125 7.87828 17.8027 7.61203 17.7653 6.77867C17.7262 5.94695 17.5944 5.3793 17.4023 4.88258C17.2021 4.36867 16.9352 3.93281 16.5006 3.49852C16.0661 3.06398 15.6315 2.79703 15.1172 2.59773C14.6191 2.40445 14.0511 2.27273 13.2194 2.23469C12.386 2.1968 12.1207 2.1875 9.99828 2.1875H10.0007ZM9.29984 3.59539C9.50789 3.59508 9.74 3.59539 10.0007 3.59539C12.0867 3.59539 12.3339 3.60289 13.1577 3.64031C13.9194 3.67516 14.3328 3.80242 14.6082 3.90938C14.9728 4.05094 15.2327 4.22023 15.506 4.49375C15.7795 4.76719 15.9487 5.02758 16.0906 5.39219C16.1976 5.66719 16.325 6.08063 16.3597 6.84234C16.3971 7.66594 16.4052 7.91328 16.4052 9.99828C16.4052 12.0833 16.3971 12.3307 16.3597 13.1542C16.3248 13.9159 16.1976 14.3294 16.0906 14.6045C15.9491 14.9691 15.7795 15.2287 15.506 15.502C15.2326 15.7754 14.973 15.9446 14.6082 16.0863C14.3331 16.1937 13.9194 16.3206 13.1577 16.3555C12.3341 16.3929 12.0867 16.401 10.0007 16.401C7.91461 16.401 7.66734 16.3929 6.84383 16.3555C6.08211 16.3203 5.66867 16.193 5.39305 16.0861C5.02852 15.9445 4.76805 15.7752 4.49461 15.5018C4.22117 15.2284 4.05195 14.9686 3.91 14.6038C3.80305 14.3287 3.67562 13.9153 3.64094 13.1536C3.60352 12.33 3.59602 12.0827 3.59602 9.99633C3.59602 7.91 3.60352 7.66398 3.64094 6.84039C3.67578 6.07867 3.80305 5.66523 3.91 5.38984C4.05164 5.02523 4.22117 4.76484 4.49469 4.49141C4.7682 4.21797 5.02852 4.04867 5.39312 3.9068C5.66852 3.79938 6.08211 3.67242 6.84383 3.63742C7.56453 3.60484 7.84383 3.59508 9.29984 3.59344V3.59539ZM14.171 4.89258C13.6534 4.89258 13.2335 5.31211 13.2335 5.82977C13.2335 6.34734 13.6534 6.76727 14.171 6.76727C14.6886 6.76727 15.1085 6.34734 15.1085 5.82977C15.1085 5.31219 14.6886 4.89227 14.171 4.89227V4.89258ZM10.0007 5.98797C7.78508 5.98797 5.98867 7.78438 5.98867 10.0001C5.98867 12.2158 7.78508 14.0113 10.0007 14.0113C12.2164 14.0113 14.0122 12.2158 14.0122 10.0001C14.0122 7.78445 12.2163 5.98797 10.0005 5.98797H10.0007ZM10.0007 7.39586C11.4389 7.39586 12.6049 8.56172 12.6049 10.0001C12.6049 11.4383 11.4389 12.6043 10.0007 12.6043C8.5625 12.6043 7.39656 11.4383 7.39656 10.0001C7.39656 8.56172 8.56242 7.39586 10.0007 7.39586Z"
                  fill="white"
                />
              </g>
              <defs>
                <radialGradient
                  id="paint0_radial_7489_34293"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(5.3125 21.5404) rotate(-90) scale(19.8215 18.4355)"
                >
                  <stop stop-color="#FFDD55" />
                  <stop offset="0.1" stop-color="#FFDD55" />
                  <stop offset="0.5" stop-color="#FF543E" />
                  <stop offset="1" stop-color="#C837AB" />
                </radialGradient>
                <radialGradient
                  id="paint1_radial_7489_34293"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(-3.35008 1.4407) rotate(78.681) scale(8.86031 36.5225)"
                >
                  <stop stop-color="#3771C8" />
                  <stop offset="0.128" stop-color="#3771C8" />
                  <stop offset="1" stop-color="#6600FF" stop-opacity="0" />
                </radialGradient>
                <clipPath id="clip0_7489_34293">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <svg
              width="24"
              height="19"
              viewBox="0 0 24 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.44175 18.8596V9.60861L2.57273 6.98388L0 5.52734V17.2271C0 18.1304 0.731871 18.8596 1.63256 18.8596H5.44175Z"
                fill="#4285F4"
              />
              <path
                d="M18.5 18.8596H22.3092C23.2126 18.8596 23.9418 18.1276 23.9418 17.227V5.52734L21.0277 7.19564L18.5 9.60852V18.8596Z"
                fill="#34A853"
              />
              <path
                d="M5.44508 9.60938L5.05469 5.99473L5.44508 2.53516L11.9751 7.43275L18.5052 2.53516L18.9419 5.80795L18.5052 9.60938L11.9751 14.507L5.44508 9.60938Z"
                fill="#EA4335"
              />
              <path
                d="M18.5 2.53555V9.60978L23.9418 5.52851V3.35179C23.9418 1.33295 21.6372 0.182064 20.0238 1.39281L18.5 2.53555Z"
                fill="#FBBC04"
              />
              <path
                d="M0 5.52855L2.50276 7.4057L5.44175 9.60982V2.5356L3.91796 1.39285C2.30177 0.182013 0 1.33299 0 3.35174V5.52855Z"
                fill="#C5221F"
              />
            </svg>
          </div>

          <div style="display: flex; gap: 12px; align-items: center">
            <a-button
              type="default"
              style="
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                height: auto;
                border-radius: 8px;
              "
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 14.5V4.5M12.5 14.5C11.7998 14.5 10.4915 12.5057 10 12M12.5 14.5C13.2002 14.5 14.5085 12.5057 15 12"
                  stroke="currentcolor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20.5 16.5C20.5 18.982 19.982 19.5 17.5 19.5H7.5C5.018 19.5 4.5 18.982 4.5 16.5"
                  stroke="currentcolor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Download Now</a-button
            >

            <a-button
              type="primary"
              @click="openRenderNowModal()"
              style="
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                height: auto;
                border-radius: 8px;
              "
            >
              <svg
                width="16"
                height="18"
                viewBox="0 0 16 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.63549 7.77344L7.08768 8.99532C7.68052 10.5976 7.97702 11.3987 8.56142 11.9831C9.14583 12.5675 9.94682 12.8639 11.5491 13.4568L12.771 13.9089L11.5491 14.3611C9.94682 14.9539 9.14583 15.2504 8.56142 15.8348C7.97702 16.4192 7.68052 17.2203 7.08768 18.8225L6.63549 20.0444L6.18331 18.8225C5.59047 17.2203 5.29397 16.4192 4.70956 15.8348C4.12516 15.2504 3.32417 14.9539 1.72188 14.3611L0.5 13.9089L1.72188 13.4568C3.32417 12.8639 4.12516 12.5675 4.70956 11.9831C5.29397 11.3987 5.59047 10.5976 6.18331 8.99532L6.63549 7.77344Z"
                  fill="white"
                  stroke="white"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.6365 0.955078L11.9212 1.76967C12.2945 2.83783 12.4812 3.3719 12.8491 3.7615C13.2171 4.15111 13.7214 4.34873 14.7303 4.74398L15.4996 5.04541L14.7303 5.34683C13.7214 5.74208 13.2171 5.93971 12.8491 6.32931C12.4812 6.71891 12.2945 7.25299 11.9212 8.32115L11.6365 9.13574L11.3518 8.32115C10.9785 7.25299 10.7919 6.71891 10.4239 6.32931C10.0559 5.93971 9.55162 5.74208 8.54277 5.34683L7.77344 5.04541L8.54277 4.74398C9.55162 4.34873 10.0559 4.15111 10.4239 3.7615C10.7919 3.3719 10.9785 2.83783 11.3518 1.76967L11.6365 0.955078Z"
                  fill="white"
                  stroke="white"
                  stroke-linejoin="round"
                />
              </svg>
              Render Now</a-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="block lg:hidden" v-if="!rendering_started">
    <a-row style="padding: 20px; padding-top: 30px" :gutter="[16, 16]">
      <!-- Back to edit button - Left -->
      <a-col
        :xs="12"
        :sm="12"
        :md="12"
        style="display: flex; align-items: center"
      >
        <button
          @click="$router.back()"
          style="
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
          "
        >
          <svg
            width="6"
            height="11"
            viewBox="0 0 6 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.75 9.75L0.75 5.25L4.75 0.75"
              stroke="#1A1A1A"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span
            style="
              font-family: Poppins;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              letter-spacing: 0%;
            "
          >
            Back to edit
          </span>
        </button>
      </a-col>

      <!-- Support button - Right -->
      <a-col
        :xs="12"
        :sm="12"
        :md="12"
        style="display: flex; justify-content: flex-end; align-items: center"
      >
        <button
          style="
            background: #f2f2f2;
            border: 1px solid transparent;
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            border-radius: 6px;
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.98514 1.71483C7.50739 1.7062 7.03262 1.79187 6.58802 1.96693C6.14341 2.14198 5.73769 2.403 5.39407 2.73503C5.05046 3.06706 4.7757 3.46359 4.58551 3.90193C4.39533 4.34026 4.29345 4.8118 4.28571 5.28955V10.2859C4.28571 10.589 4.16531 10.8797 3.95098 11.094C3.73665 11.3083 3.44596 11.4287 3.14286 11.4287H1.71429C1.25963 11.4287 0.823594 11.2481 0.502103 10.9267C0.180612 10.6052 0 10.1692 0 9.71452L0 7.4289C0 6.97426 0.180612 6.53824 0.502103 6.21676C0.823594 5.89528 1.25963 5.71468 1.71429 5.71468H2.57143V5.26898C2.58186 4.5666 2.73055 3.87315 3.00902 3.22824C3.28749 2.58333 3.69028 1.99959 4.19439 1.51036C4.69849 1.02113 5.29404 0.635999 5.94701 0.376953C6.59998 0.117906 7.2976 -0.00997706 8 0.000607193C8.70241 -0.00997706 9.40002 0.117906 10.053 0.376953C10.706 0.635999 11.3015 1.02113 11.8056 1.51036C12.3097 1.99959 12.7125 2.58333 12.991 3.22824C13.2695 3.87315 13.4181 4.5666 13.4286 5.26898V5.71468H14.2857C14.7404 5.71468 15.1764 5.89528 15.4979 6.21676C15.8194 6.53824 16 6.97426 16 7.4289V9.71452C16 10.1692 15.8194 10.6052 15.4979 10.9267C15.1764 11.2481 14.7404 11.4287 14.2857 11.4287H13.4286V12.0002C13.4287 12.7724 13.1445 13.5177 12.6302 14.0938C12.1158 14.6699 11.4074 15.0364 10.64 15.1235C10.491 15.3895 10.2737 15.611 10.0105 15.7651C9.74733 15.9192 9.44782 16.0003 9.14286 16H7.42857C6.97392 16 6.53788 15.8194 6.21639 15.4979C5.8949 15.1764 5.71429 14.7404 5.71429 14.2858C5.71429 13.8311 5.8949 13.3951 6.21639 13.0736C6.53788 12.7522 6.97392 12.5716 7.42857 12.5716H9.14286C9.76229 12.5716 10.3051 12.8995 10.6057 13.3921C10.9207 13.3197 11.2019 13.1426 11.4032 12.8898C11.6046 12.637 11.7142 12.3234 11.7143 12.0002V5.28841C11.7064 4.8082 11.6035 4.3343 11.4114 3.89412C11.2193 3.45394 10.9418 3.0562 10.595 2.7239C10.2483 2.39159 9.83908 2.13132 9.39111 1.95812C8.94313 1.78492 8.46527 1.70223 7.98514 1.71483Z"
              fill="#1A1A1A"
            />
          </svg>
          <span
            style="
              font-family: Poppins;
              font-weight: 400;
              font-size: 14px;
              line-height: 20px;
              letter-spacing: 0%;
              text-align: center;
            "
          >
            Support
          </span>
        </button>
      </a-col>

      <!-- Mobile: Share on social - Full width on mobile -->
    </a-row>
    <div className="flex flex-row justify-between">
      <div
        style="
          padding: 12px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 40%;
          justify-content: center;
        "
      >
        <span style="color: #666; font-size: 12px; font-weight: 500"
          >Share:</span
        >
        <svg
          width="21"
          height="22"
          viewBox="0 0 21 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.443867 10.772C0.443375 12.6043 0.908 14.3934 1.79148 15.9703L0.359375 21.3581L5.71044 19.9124C7.19048 20.7426 8.84874 21.1776 10.5339 21.1778H10.5383C16.1013 21.1778 20.6296 16.5134 20.632 10.7802C20.6331 8.00211 19.5841 5.38976 17.6781 3.42436C15.7726 1.45913 13.2382 0.376268 10.5379 0.375C4.97429 0.375 0.446246 5.03914 0.443949 10.772"
            fill="url(#paint0_linear_7920_80738)"
          />
          <path
            d="M0.0877734 10.77C0.0871992 12.6682 0.568476 14.5212 1.48345 16.1546L0 21.7356L5.54293 20.238C7.07019 21.0961 8.78973 21.5485 10.5395 21.5491H10.544C16.3065 21.5491 20.9975 16.7169 21 10.7786C21.001 7.90064 19.9142 5.19437 17.9402 3.15857C15.966 1.12301 13.341 0.00118336 10.544 0C4.78045 0 0.0900703 4.8315 0.0877734 10.77ZM3.38879 15.8733L3.18183 15.5348C2.3118 14.1093 1.85259 12.4621 1.85325 10.7706C1.85505 5.83474 5.75351 1.819 10.5473 1.819C12.8687 1.82001 15.0504 2.7525 16.6914 4.44437C18.3323 6.13641 19.2352 8.38565 19.2346 10.7779C19.2325 15.7138 15.3339 19.73 10.544 19.73H10.5405C8.98086 19.7292 7.45123 19.2976 6.11723 18.482L5.79977 18.288L2.51048 19.1767L3.38879 15.8733Z"
            fill="url(#paint1_linear_7920_80738)"
          />
          <path
            d="M7.93402 6.26438C7.7383 5.81614 7.53232 5.80709 7.34619 5.79923C7.19377 5.79247 7.01954 5.79298 6.84547 5.79298C6.67123 5.79298 6.38814 5.86051 6.14886 6.12973C5.90933 6.3992 5.23438 7.05039 5.23438 8.37482C5.23438 9.69926 6.1706 10.9793 6.30111 11.1591C6.43179 11.3386 8.1085 14.1435 10.764 15.2225C12.971 16.1193 13.4201 15.9409 13.8991 15.8959C14.3782 15.8511 15.4449 15.2449 15.6625 14.6163C15.8803 13.9878 15.8803 13.449 15.815 13.3364C15.7497 13.2242 15.5755 13.1569 15.3142 13.0223C15.0529 12.8877 13.7684 12.2364 13.529 12.1465C13.2894 12.0568 13.1153 12.012 12.941 12.2815C12.7668 12.5507 12.2665 13.1569 12.114 13.3364C11.9617 13.5164 11.8092 13.5388 11.548 13.4041C11.2866 13.269 10.4452 12.9851 9.44693 12.0681C8.67025 11.3545 8.14591 10.4733 7.9935 10.2038C7.84108 9.93466 7.97717 9.78877 8.10818 9.65463C8.22556 9.53401 8.36953 9.34028 8.50029 9.18314C8.63055 9.02593 8.67403 8.91376 8.76114 8.73423C8.84834 8.55452 8.8047 8.39731 8.73949 8.26266C8.67403 8.12801 8.16634 6.79664 7.93402 6.26438Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_7920_80738"
              x1="1013.99"
              y1="2098.69"
              x2="1013.99"
              y2="0.375"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#1FAF38" />
              <stop offset="1" stop-color="#60D669" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_7920_80738"
              x1="1050"
              y1="2173.56"
              x2="1050"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#F9F9F9" />
              <stop offset="1" stop-color="white" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_7489_34290)">
            <path
              d="M20 10C20 4.47719 15.5228 0 10 0C4.47719 0 0 4.47719 0 10C0 14.9913 3.65687 19.1284 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2147 3.90625C13.3088 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.9499 6.5625 11.5625 7.33336 11.5625 8.12422V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3431 19.1284 20 14.9913 20 10Z"
              fill="#1877F2"
            />
            <path
              d="M13.8926 12.8906L14.3359 10H11.5625V8.12422C11.5625 7.33328 11.9499 6.5625 13.1922 6.5625H14.4531V4.10156C14.4531 4.10156 13.3088 3.90625 12.2146 3.90625C9.93047 3.90625 8.4375 5.29063 8.4375 7.79688V10H5.89844V12.8906H8.4375V19.8785C8.95439 19.9595 9.4768 20.0001 10 20C10.5232 20.0001 11.0456 19.9595 11.5625 19.8785V12.8906H13.8926Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_7489_34290">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z"
            fill="url(#paint0_radial_7920_80746)"
          />
          <path
            d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z"
            fill="url(#paint1_radial_7920_80746)"
          />
          <path
            d="M10.0007 2.1875C7.87898 2.1875 7.61266 2.1968 6.77938 2.23469C5.94766 2.27281 5.37992 2.40445 4.8832 2.59766C4.3693 2.79719 3.93344 3.06414 3.49922 3.49852C3.06461 3.93281 2.79766 4.36867 2.5975 4.88234C2.40375 5.37922 2.27195 5.94719 2.23453 6.77852C2.19727 7.61188 2.1875 7.87828 2.1875 10.0001C2.1875 12.1219 2.19688 12.3873 2.23469 13.2206C2.27297 14.0523 2.40461 14.6201 2.59766 15.1168C2.79734 15.6307 3.0643 16.0666 3.49867 16.5008C3.93281 16.9354 4.36867 17.203 4.88219 17.4025C5.3793 17.5957 5.94711 17.7273 6.77867 17.7655C7.61203 17.8034 7.87813 17.8127 9.99977 17.8127C12.1217 17.8127 12.3872 17.8034 13.2205 17.7655C14.0522 17.7273 14.6205 17.5957 15.1177 17.4025C15.6313 17.203 16.0666 16.9354 16.5006 16.5008C16.9352 16.0666 17.2021 15.6307 17.4023 15.117C17.5944 14.6201 17.7262 14.0522 17.7653 13.2208C17.8027 12.3875 17.8125 12.1219 17.8125 10.0001C17.8125 7.87828 17.8027 7.61203 17.7653 6.77867C17.7262 5.94695 17.5944 5.3793 17.4023 4.88258C17.2021 4.36867 16.9352 3.93281 16.5006 3.49852C16.0661 3.06398 15.6315 2.79703 15.1172 2.59773C14.6191 2.40445 14.0511 2.27273 13.2194 2.23469C12.386 2.1968 12.1207 2.1875 9.99828 2.1875H10.0007ZM9.29984 3.59539C9.50789 3.59508 9.74 3.59539 10.0007 3.59539C12.0867 3.59539 12.3339 3.60289 13.1577 3.64031C13.9194 3.67516 14.3328 3.80242 14.6082 3.90938C14.9728 4.05094 15.2327 4.22023 15.506 4.49375C15.7795 4.76719 15.9487 5.02758 16.0906 5.39219C16.1976 5.66719 16.325 6.08063 16.3597 6.84234C16.3971 7.66594 16.4052 7.91328 16.4052 9.99828C16.4052 12.0833 16.3971 12.3307 16.3597 13.1542C16.3248 13.9159 16.1976 14.3294 16.0906 14.6045C15.9491 14.9691 15.7795 15.2287 15.506 15.502C15.2326 15.7754 14.973 15.9446 14.6082 16.0863C14.3331 16.1937 13.9194 16.3206 13.1577 16.3555C12.3341 16.3929 12.0867 16.401 10.0007 16.401C7.91461 16.401 7.66734 16.3929 6.84383 16.3555C6.08211 16.3203 5.66867 16.193 5.39305 16.0861C5.02852 15.9445 4.76805 15.7752 4.49461 15.5018C4.22117 15.2284 4.05195 14.9686 3.91 14.6038C3.80305 14.3287 3.67562 13.9153 3.64094 13.1536C3.60352 12.33 3.59602 12.0827 3.59602 9.99633C3.59602 7.91 3.60352 7.66398 3.64094 6.84039C3.67578 6.07867 3.80305 5.66523 3.91 5.38984C4.05164 5.02523 4.22117 4.76484 4.49469 4.49141C4.7682 4.21797 5.02852 4.04867 5.39312 3.9068C5.66852 3.79938 6.08211 3.67242 6.84383 3.63742C7.56453 3.60484 7.84383 3.59508 9.29984 3.59344V3.59539ZM14.171 4.89258C13.6534 4.89258 13.2335 5.31211 13.2335 5.82977C13.2335 6.34734 13.6534 6.76727 14.171 6.76727C14.6886 6.76727 15.1085 6.34734 15.1085 5.82977C15.1085 5.31219 14.6886 4.89227 14.171 4.89227V4.89258ZM10.0007 5.98797C7.78508 5.98797 5.98867 7.78438 5.98867 10.0001C5.98867 12.2158 7.78508 14.0113 10.0007 14.0113C12.2164 14.0113 14.0122 12.2158 14.0122 10.0001C14.0122 7.78445 12.2163 5.98797 10.0005 5.98797H10.0007ZM10.0007 7.39586C11.4389 7.39586 12.6049 8.56172 12.6049 10.0001C12.6049 11.4383 11.4389 12.6043 10.0007 12.6043C8.5625 12.6043 7.39656 11.4383 7.39656 10.0001C7.39656 8.56172 8.56242 7.39586 10.0007 7.39586Z"
            fill="white"
          />
          <defs>
            <radialGradient
              id="paint0_radial_7920_80746"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(5.3125 21.5404) rotate(-90) scale(19.8215 18.4355)"
            >
              <stop stop-color="#FFDD55" />
              <stop offset="0.1" stop-color="#FFDD55" />
              <stop offset="0.5" stop-color="#FF543E" />
              <stop offset="1" stop-color="#C837AB" />
            </radialGradient>
            <radialGradient
              id="paint1_radial_7920_80746"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(-3.35008 1.4407) rotate(78.681) scale(8.86031 36.5225)"
            >
              <stop stop-color="#3771C8" />
              <stop offset="0.128" stop-color="#3771C8" />
              <stop offset="1" stop-color="#6600FF" stop-opacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <!-- Mobile: Download button - Full width on mobile -->
      <div>
        <button
          className="!text-blue-500"
          block
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px 16px;
            height: auto;
            border-radius: 8px;
          "
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 14.5V4.5M12 14.5C11.2998 14.5 9.99153 12.5057 9.5 12M12 14.5C12.7002 14.5 14.0085 12.5057 14.5 12"
              stroke="#3B63FB"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M20 16.5C20 18.982 19.482 19.5 17 19.5H7C4.518 19.5 4 18.982 4 16.5"
              stroke="#3B63FB"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          Download Now
        </button>
      </div>
    </div>

    <!-- Image Container with Before/After Toggle -->
    <div
      style="
        display: flex;
        justify-content: center;
        padding-top: 60px;
        margin-top: -25px;
      "
    >
     <div
  style="
    padding: 15px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    background: white;
  "
>
  <div style="position: relative; display: inline-block; width: 100%;">
    <!-- Skeleton - EXACT same dimensions as visible image -->
    <div
      v-if="!imageLoadedMap['room']"
      class=""
      style="
        width: 100%;
        max-width: 800px;
        height: 200px !important;
        aspect-ratio: 16/10;
        max-height: 300px;
        object-fit: cover;
        display: block;
        border-radius: 8px;
      "
    ></div>

    <!-- Preload image (hidden) -->
    <img
      :src="displayImage"
      style="position: absolute; width: 0; height: 0; opacity: 0"
      @load="onRoomImageLoad"
      @error="handleImageError"
      alt=""
    />

    <!-- Visible image -->
    <img
      v-show="imageLoadedMap['room']"
      :src="displayImage"
      alt="Room Render"
      style="
        width: 100%;
        max-width: 800px;
        height: auto;
        max-height: 500px;
        object-fit: cover;
        display: block;
        border-radius: 8px;
        transition: opacity 0.3s ease-in-out;
      "
    />

          <!-- Before/After Toggle - Positioned on Image -->
          <div
            style="
              position: absolute;
              top: 20px;
              left: 50%;
              transform: translateX(-50%);
              z-index: 10;
            "
          >
            <div
              class="relative inline-flex items-center bg-gray-100 rounded-xl !px-4 sm:p-1 w-full h-9 max-w-[100px]"
            >
              <!-- Sliding background indicator -->
              <div
                class="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-blue-600 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
                :class="
                  currentView === 'after'
                    ? 'left-[calc(50%+0.125rem)]'
                    : 'left-1'
                "
              ></div>

              <!-- Before Button -->
              <button
                @click="showBefore"
                :disabled="rendering_started"
                class="relative z-10 flex-1 px-1 sm:px-2 py-2 font-medium rounded-xl transition-colors duration-300 font-poppins flex items-center justify-center min-w-0 overflow-hidden"
                style="
                  font-family: Poppins;
                  font-weight: 400;
                  font-size: 8px;
                  line-height: 20px;
                  letter-spacing: 0%;
                  text-align: center;
                "
                :class="[
                  currentView === 'before' ? '!text-white' : 'text-gray-700',
                  rendering_started
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer',
                ]"
              >
                <span class="whitespace-nowrap">Before</span>
              </button>

              <!-- After Button -->
              <button
                @click="showAfter"
                :disabled="rendering_started"
                class="relative z-10 flex-1 px-1 sm:px-2 py-2 font-medium rounded-xl transition-colors duration-300 font-poppins flex items-center justify-center min-w-0 overflow-hidden"
                style="
                  font-family: Poppins;
                  font-weight: 400;
                  font-size: 8px;
                  line-height: 20px;
                  letter-spacing: 0%;
                  text-align: center;
                "
                :class="[
                  currentView === 'after' ? '!text-white' : 'text-gray-700',
                  rendering_started
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer',
                ]"
              >
                <span class="whitespace-nowrap pl-4 sm:pl-0">After</span>
              </button>
            </div>
          </div>

          <!-- Apply Changes Icon -->
          <img
            src="../../assets/apply_changes_img.png"
            alt="Apply Changes"
            style="
              position: absolute;
              bottom: 10px;
              right: 10px;
              width: 60px;
              height: 60px;
            "
          />
        </div>

        <!-- Desktop Actions (hidden on mobile) -->
        <div
          class="hidden md:flex"
          style="
            gap: 15px;
            padding-top: 15px;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
          "
        >
          <div
            style="
              padding: 12px 16px;
              background: #f2f9fa;
              border-radius: 8px;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              gap: 12px;
            "
          >
            <span style="color: #666; font-size: 14px; font-weight: 500"
              >Share on social:</span
            >
            <!-- Social icons SVGs here -->
          </div>

          <div style="display: flex; gap: 12px; align-items: center">
            <a-button
              type="default"
              style="
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                height: auto;
                border-radius: 8px;
              "
            >
              <!-- SVG here -->
              Download Now
            </a-button>

            <a-button
              type="primary"
              @click="openRenderNowModal()"
              style="
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                height: auto;
                border-radius: 8px;
              "
            >
              <!-- SVG here -->
              Render Now
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: Render Now button - Full width below image -->
    <a-row
      :gutter="[16, 16]"
      class="md:hidden"
      style="padding: 0 20px; padding-top: 20px"
    >
      <a-col :span="24">
        <a-button
          type="primary"
          block
          @click="openRenderNowModal()"
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 16px;
            height: auto;
            border-radius: 8px;
          "
        >
          <svg
            width="16"
            height="21"
            viewBox="0 0 16 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.63549 7.31641L7.08768 8.53829C7.68052 10.1405 7.97702 10.9416 8.56142 11.526C9.14583 12.1105 9.94682 12.4069 11.5491 12.9998L12.771 13.4519L11.5491 13.904C9.94682 14.4969 9.14583 14.7933 8.56142 15.3778C7.97702 15.9622 7.68052 16.7633 7.08768 18.3655L6.63549 19.5874L6.18331 18.3655C5.59047 16.7633 5.29397 15.9622 4.70956 15.3778C4.12516 14.7933 3.32417 14.4969 1.72188 13.904L0.5 13.4519L1.72188 12.9998C3.32417 12.4069 4.12516 12.1105 4.70956 11.526C5.29397 10.9416 5.59047 10.1405 6.18331 8.53829L6.63549 7.31641Z"
              fill="white"
              stroke="white"
              stroke-linejoin="round"
            />
            <path
              d="M11.6365 0.5L11.9212 1.31459C12.2945 2.38275 12.4812 2.91682 12.8491 3.30643C13.2171 3.69603 13.7214 3.89365 14.7303 4.2889L15.4996 4.59033L14.7303 4.89176C13.7214 5.287 13.2171 5.48463 12.8491 5.87423C12.4812 6.26384 12.2945 6.79791 11.9212 7.86607L11.6365 8.68066L11.3518 7.86607C10.9785 6.79791 10.7919 6.26384 10.4239 5.87423C10.0559 5.48463 9.55162 5.287 8.54277 4.89176L7.77344 4.59033L8.54277 4.2889C9.55162 3.89365 10.0559 3.69603 10.4239 3.30643C10.7919 2.91682 10.9785 2.38275 11.3518 1.31459L11.6365 0.5Z"
              fill="white"
              stroke="white"
              stroke-linejoin="round"
            />
          </svg>
          <span
            style="
              font-family: Poppins;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              letter-spacing: 0%;
              text-align: center;
            "
          >
            Render Now
          </span>
        </a-button>
      </a-col>
    </a-row>
  </div>

  <div v-else style="background-color: #f3f3f3; min-height: 90.5vh">
    <a-row>
      <a-col
        :lg="18"
        :md="18"
        :sm="24"
        :xs="24"
        style="
          display: flex;
          justify-content: start;
          padding-top: 20px;
          flex-direction: column;
          align-items: center;
        "
      >
        <!-- <div style="display: flex; gap: 0; border-radius: 20px; width: 100%; max-width: 150px; margin-bottom: 10px;">
  <a-button 
    :type="currentView === 'before' ? 'primary' : 'default'"
    @click="showBefore"
    :disabled="loading"
  > 
    Before 
  </a-button>
  <a-button 
    :type="currentView === 'after' ? 'primary' : 'default'"
    @click="showAfter"
    :disabled="loading"
  > 
    After 
  </a-button>
</div> -->
        <div
          class="relative inline-flex items-center translate-y-6 bg-gray-100 rounded-xl p-1 w-full max-w-[150px] z-[200]"
        >
          <!-- Sliding background indicator -->
          <div
            class="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-blue-600 rounded-xl shadow-lg transition-all duration-300 ease-in-out"
            :class="
              currentView === 'after' ? 'left-[calc(50%+0.125rem)]' : 'left-1'
            "
          ></div>

          <!-- Before Button -->
          <button
            @click="showBefore"
            :disabled="loading"
            class="relative z-10 flex-1 px-1 sm:px-2 py-2 font-medium rounded-xl transition-colors duration-300 font-poppins flex items-center justify-center min-w-0 overflow-hidden"
            style="
              font-family: Poppins;
              font-weight: 400;
              font-size: 10px;
              line-height: 20px;
              letter-spacing: 0%;
              text-align: center;
            "
            :class="[
              currentView === 'before' ? '!text-white' : 'text-gray-700',
              loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            ]"
          >
            <span class="whitespace-nowrap">Before</span>
          </button>

          <!-- After Button -->
          <button
            @click="showAfter"
            :disabled="loading"
            class="relative z-10 flex-1 px-1 sm:px-2 py-2 font-medium rounded-xl transition-colors duration-300 font-poppins flex items-center justify-center min-w-0 overflow-hidden"
            style="
              font-family: Poppins;
              font-weight: 400;
              font-size: 10px;
              line-height: 20px;
              letter-spacing: 0%;
              text-align: center;
            "
            :class="[
              currentView === 'after' ? '!text-white' : 'text-gray-700',
              loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            ]"
          >
            <span class="whitespace-nowrap">After</span>
          </button>
        </div>

        <div style="display: flex; flex-direction: column">
          <div
            v-if="loading"
            class="scanning-loading-overlay !w-full !max-w-[800px] h-[500px] max-h-[70vh] !p-2.5 border border-black/10 rounded-[10px] !overflow-hidden z-10 mx-auto"
            style="
              padding: 10px;
              border: 1px solid rgba(0, 0, 0, 0.1);
              border-radius: 10px;
              width: 800px;
              height: 500px;
            "
          >

 <div class="w-full h-full">
              <div
              class="loading-screen "
              :style="{
                backgroundImage: base_image_url
                  ? `url(${base_image_url})`
                  : 'none',
              }"
            >
              <div class="wave-overlay"></div>
              <div class="loading-text">
                <div class="process-text">
                  Plaease Wait We Are Rendering the Final Results
                </div>
              </div>
            </div>
          </div>
          </div>

          <div style="position: relative; display: inline-block" v-else>
            <img
              :src="displayImage"
              alt="Room Render"
              style="
                width: 100%;
                max-width: 800px;
                height: 100%;
                max-height: 500px;
                object-fit: cover;
                display: block;
                border-radius: 8px;
                transition: opacity 0.3s ease-in-out;
              "
              @error="handleImageError"
              @load="handleImageLoad"
            />

            <!-- <img 
    src="../../assets/apply_changes_img.png" 
    alt="Apply Changes"
    style="
      position: absolute;
      bottom: 10px;
      right: 10px;
      width: 60px;
      height: 60px;
    "
  /> -->
            <img
              :src="this.$store.state.root_media_api + brand_banner_logo"
              alt="Apply Changes"
              v-show="!imageLoading"
              style="
                position: absolute;
                bottom: 10px;
                right: 10px;
                width: 60px;
                height: 60px;
                border-radius: 10px;
              "
            />
          </div>
          <div style="display: flex; gap: 10px; align-self: end">
            <a-switch
              style="margin-top: 5px"
              size="small"
              v-model:checked="notify_me_when_ready"
            />
            <p>Notify Me When Ready</p>
          </div>
        </div>
      </a-col>

      <a-col
        :lg="6"
        :md="6"
        :sm="24"
        :xs="24"
        style="
          background-color: white;
          padding: 10px;
          display: flex;
          flex-direction: column;
          min-height: 87vh;
        "
        v-if="
          is_client_requested_room === false &&
          !this.$route.query.business_staff
        "
      >
        <h3 style="text-align: center; margin: 0 0 15px 0">
          Congratulation!<br />
          Your photo already set.
        </h3>

        <!-- Share Section - Only shows when user hasn't posted -->
        <div
          v-if="user.user_type != 'User'"
          style="
            background-color: #f3f2f2;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 10px;
          "
        >
          <a-row style="margin-bottom: 10px">
            <a-col :span="6">
              <img :src="base_image_url" style="width: 100%" alt="" />
            </a-col>
            <a-col :span="18" style="padding-left: 10px">
              <h2 style="margin: 0; font-size: 14px; color: #000">
                Share your project
              </h2>
              <p
                style="
                  margin: 0;
                  font-size: 12px;
                  font-weight: 500;
                  color: #000;
                "
              >
                Tell your community about the project you created
              </p>
            </a-col>
          </a-row>
          <a-button
            v-if="is_Posted_On_Community"
            type="default"
            @click="gotoMyCommunity"
            block
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 8px;
              padding: 4px 16px;
              height: auto;
              border-radius: 8px;
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28px"
              height="28px"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20 12C20 9.19974 20 7.79961 19.455 6.73005C18.9757 5.78924 18.2108 5.02433 17.27 4.54497C16.2004 4 14.8003 4 12 4C9.19974 4 7.79961 4 6.73005 4.54497C5.78924 5.02433 5.02433 5.78924 4.54497 6.73005C4 7.79961 4 9.19974 4 12V18C4 18.9428 4 19.4142 4.29289 19.7071C4.58579 20 5.05719 20 6 20H12C14.8003 20 16.2004 20 17.27 19.455C18.2108 18.9757 18.9757 18.2108 19.455 17.27C20 16.2004 20 14.8003 20 12Z"
                fill="green"
                fill-opacity="0.24"
              />
              <path
                d="M8.5 12.5L15.5 12.5"
                stroke="#222222"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.5 15.5L13.5 15.5"
                stroke="#222222"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path d="M17.5 3.5V9.5" stroke="#222222" stroke-linecap="round" />
              <path
                d="M14.5 6.5H20.5"
                stroke="#222222"
                stroke-linecap="round"
              />
            </svg>
            Shared on community
          </a-button>
          <a-button
            v-else
            type="primary"
            @click="openShareOnComunity()"
            block
            :disabled="loading"
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 8px;
              padding: 8px 16px;
              height: auto;
              border-radius: 8px;
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.125 5.64648C17.125 6.95816 16.0617 8.02148 14.75 8.02148C13.4383 8.02148 12.375 6.95816 12.375 5.64648C12.375 4.33481 13.4383 3.27148 14.75 3.27148C16.0617 3.27148 17.125 4.33481 17.125 5.64648Z"
                stroke="white"
                stroke-width="1.5"
              />
              <path
                d="M7.625 10C7.625 11.3117 6.56167 12.375 5.25 12.375C3.93833 12.375 2.875 11.3117 2.875 10C2.875 8.68829 3.93833 7.625 5.25 7.625C6.56167 7.625 7.625 8.68829 7.625 10Z"
                stroke="white"
                stroke-width="1.5"
              />
              <path
                d="M17.125 14.3535C17.125 15.6652 16.0617 16.7285 14.75 16.7285C13.4383 16.7285 12.375 15.6652 12.375 14.3535C12.375 13.0418 13.4383 11.9785 14.75 11.9785C16.0617 11.9785 17.125 13.0418 17.125 14.3535Z"
                stroke="white"
                stroke-width="1.5"
              />
              <path
                d="M7.40625 9.00937L12.5521 6.63477M7.40625 10.9889L12.5521 13.3635"
                stroke="white"
                stroke-width="1.5"
              />
            </svg>
            Share on community
          </a-button>
        </div>

        <!-- Detail Staging Card - Flexible -->
        <div
          style="
            background-color: #f5f5f5;
            border-radius: 12px;
            margin-bottom: 10px;
            padding: 20px;
            font-family: Inter, sans-serif;
            color: #111;
            flex: 1;
            overflow-y: auto;
          "
        >
          <h3
            style="
              margin: 0 0 5px 0;
              font-size: 16px;
              font-weight: 600;
              color: #000;
            "
          >
            Detail Staging
          </h3>

          <div style="margin-bottom: 5px">
            <p style="margin: 0; font-size: 13px; color: #888">Room type</p>
            <p
              style="margin: 0; font-size: 14px; font-weight: 500; color: #000"
            >
              {{ room_design_type_select }}
            </p>
          </div>

          <div style="margin-bottom: 5px">
            <p style="margin: 0; font-size: 13px; color: #888">Style</p>
            <p
              style="margin: 0; font-size: 14px; font-weight: 500; color: #000"
            >
              {{ room_type_select }}
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 5px 0" />

          <div>
            <p
              style="
                margin: 0 0 8px 0;
                font-size: 14px;
                font-weight: 600;
                color: #000;
              "
            >
              Product
            </p>

            <a-row
              align="middle"
              style="margin-bottom: 10px"
              v-if="products_used.length"
            >
              <a-col :span="4">
                <img
                  :src="
                    $store.state.root_media_api + products_used[0].product_image
                  "
                  alt=""
                  style="
                    width: 42px;
                    height: 42px;
                    border-radius: 6px;
                    object-fit: cover;
                  "
                />
              </a-col>
              <a-col :span="20">
                <p
                  style="
                    margin: 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                  {{ products_used[0].product_title }}
                </p>
                <a
                  href="#"
                  style="font-size: 13px; color: #2563eb; text-decoration: none"
                  @click="
                    this.$router.push(
                      '/' +
                        products_used[0].business_slug +
                        '/' +
                        products_used[0].type +
                        '/' +
                        products_used[0].product_id,
                    )
                  "
                >
                  Product Detail
                </a>
              </a-col>
            </a-row>
            <a-row align="middle" style="margin-bottom: 10px" v-else>
              <a-col :span="24">
                <a-empty description="No Products Used In room."></a-empty>
              </a-col>
            </a-row>
          </div>

          <a-button
            block
            style="
              font-size: 14px;
              font-weight: 500;
              color: #2563eb;
              text-decoration: none;
              margin-bottom: 10px;
            "
            @click="show_all_catalogue_products_used_in_room()"
          >
            See all catalog products
          </a-button>

          <a-button
            style="
              display: flex;
              justify-content: center;
              text-align: center;
              font-size: 14px;
              font-weight: 500;
              color: #2563eb;
              cursor: pointer;
            "
            type="text"
            block
            @click="AddRoomitemstocart"
          >
            <ShoppingCartOutlined style="font-size: 20px" />
            Add to Cart
          </a-button>
        </div>

        <!-- Save & Download Card - Fixed at bottom -->
        <div
          style="background-color: #f3f2f2; border-radius: 10px; padding: 10px"
        >
          <a-row style="margin-bottom: 10px">
            <a-col :span="20">
              <a-button
                type="default"
                @click="gotoMyDesignes"
                v-if="SavedToMyDesignes"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 8px;
                  padding: 4px 16px;
                  height: auto;

                  border-radius: 8px;
                "
                block
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 8H17.8C18.9201 8 19.4802 8 19.908 8.21799C20.2843 8.40973 20.5903 8.71569 20.782 9.09202C21 9.51984 21 10.0799 21 11.2V16.8C21 17.9201 21 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 18.4802 3 17.9201 3 16.8V8Z"
                    fill="green"
                    fill-opacity="0.24"
                  />
                  <path
                    d="M3 8C3 7.06812 3 6.60218 3.15224 6.23463C3.35523 5.74458 3.74458 5.35523 4.23463 5.15224C4.60218 5 5.06812 5 6 5H8.34315C9.16065 5 9.5694 5 9.93694 5.15224C10.3045 5.30448 10.5935 5.59351 11.1716 6.17157L13 8H3Z"
                    fill="green"
                    fill-opacity="0.24"
                  />
                  <path
                    d="M9 13.5L10.8939 15.3939C10.9525 15.4525 11.0475 15.4525 11.1061 15.3939L15 11.5"
                    stroke="#000"
                  />
                </svg>
                Saved To My Designes
              </a-button>

              <a-button
                type="primary"
                @click="open_SaveToMyDesignes = true"
                v-else
                :disabled="loading"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 8px;
                  padding: 8px 16px;
                  height: auto;
                  border-radius: 8px;
                "
                block
              >
                Save To My Design
              </a-button>
            </a-col>
            <a-col :span="4" style="padding-left: 5px">
              <a-button
                @click="toggleLikeRoom"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 8px;
                  padding: 8px 16px;
                  height: auto;
                  border-radius: 8px;
                "
              >
                <svg
                  v-if="liked_room"
                  width="22"
                  height="22"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.2518 24.4363C11.1484 22.2025 5 17.0956 5 12.5C5 9.46241 7.31579 7 10.5 7C12.15 7 13.8 7.52941 16 9.64704C18.2 7.52941 19.85 7 21.5 7C24.6842 7 27 9.46241 27 12.5C27 17.0956 20.8517 22.2025 17.7482 24.4363C16.7039 25.1879 15.2961 25.1879 14.2518 24.4363Z"
                    fill="#ff4d4f"
                    stroke="#ff4d4f"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg
                  v-else
                  width="22"
                  height="22"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.2518 24.4363C11.1484 22.2025 5 17.0956 5 12.5C5 9.46241 7.31579 7 10.5 7C12.15 7 13.8 7.52941 16 9.64704C18.2 7.52941 19.85 7 21.5 7C24.6842 7 27 9.46241 27 12.5C27 17.0956 20.8517 22.2025 17.7482 24.4363C16.7039 25.1879 15.2961 25.1879 14.2518 24.4363Z"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a-button>
            </a-col>
          </a-row>

          <a-button
            type="default"
            block
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 8px;
              padding: 8px 16px;
              height: auto;
              border-radius: 8px;
            "
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 14.5V4.5M12 14.5C11.2998 14.5 9.99153 12.5057 9.5 12M12 14.5C12.7002 14.5 14.0085 12.5057 14.5 12"
                stroke="currentcolor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20 16.5C20 18.982 19.482 19.5 17 19.5H7C4.518 19.5 4 18.982 4 16.5"
                stroke="currentcolor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Download Raw Files
          </a-button>
        </div>
      </a-col>

      <a-col
        :lg="6"
        :md="6"
        :sm="24"
        :xs="24"
        style="background-color: white; padding: 10px"
        v-else-if="
          is_client_requested_room === false && this.$route.query.business_staff
        "
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 87vh;
          "
        >
          <div>
            <h3 style="text-align: center">
              Congratulation!<br />
              Your photo already set.
            </h3>

            <div
              style="border-radius: 10px; padding: 10px; margin-bottom: 10px"
            >
              <div
                style="display: flex; gap: 15px; font-size: 14px; color: #666"
              >
                <div>
                  <strong>Style:</strong>
                  <a-select v-model:value="room_design_type_select">
                    <a-option-select value="Modern">Modern</a-option-select>
                    <a-option-select value="Classic">Classic</a-option-select>
                    <a-option-select value="Rustic">Rustic</a-option-select>
                    <a-option-select value="Industrial"
                      >Industrial</a-option-select
                    >
                    <a-option-select value="Minimalist"
                      >Minimalist</a-option-select
                    >
                    <a-option-select value="Traditional"
                      >Traditional</a-option-select
                    >
                    <a-option-select value="Contemporary"
                      >Contemporary</a-option-select
                    >
                    <a-option-select value="Vintage">Vintage</a-option-select>
                  </a-select>
                  <!-- {{ room_type || 'Living Room' }} -->
                </div>
                <div>
                  <strong>Room Type:</strong>
                  <a-select v-model:value="room_type_select">
                    <a-option-select value="Living Room"
                      >Living Room</a-option-select
                    >
                    <a-option-select value="Dinning Room"
                      >Dinning Room</a-option-select
                    >
                    <a-option-select value="Kitchen">Kitchen</a-option-select>
                    <a-option-select value="Home Office"
                      >Home Office</a-option-select
                    >
                    <a-option-select value="Bedroom">Bedroom</a-option-select>
                    <a-option-select value="Office">Office</a-option-select>
                    <a-option-select value="Rest Room"
                      >Rest Room</a-option-select
                    >
                  </a-select>
                  <!-- {{ room_design_type || 'Modern' }} -->
                </div>
                <div v-if="products_used">
                  <strong>Products:</strong>
                  <div>{{ products_used.length }} items</div>
                </div>
              </div>
              <br />
              <a-label> Add Description </a-label>
              <a-textarea
                :rows="5"
                v-model:value="description_room"
                placeholder="describe the room here "
              ></a-textarea>
              <a-button
                :disabled="!description_room.trim()"
                block
                type="primary"
                size="large"
                style="margin-top: 10px; padding: 8px 16px"
                @click="Business_staff_Submit_Client_request()"
                >Submit Request</a-button
              >
            </div>
          </div>
        </div>
      </a-col>
      <a-col
        :lg="6"
        :md="6"
        :sm="24"
        :xs="24"
        style="background-color: white; padding: 10px"
        v-else
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 87vh;
          "
        >
          <div>
            <h3 style="text-align: center">
              Congratulation!<br />
              Your photo already set.
            </h3>

            <div
              style="border-radius: 10px; padding: 10px; margin-bottom: 10px"
            >
              <div
                style="display: flex; gap: 15px; font-size: 14px; color: #666"
              >
                <div>
                  <strong>Style:</strong>
                  <a-select v-model:value="room_design_type_select">
                    <a-option-select value="Modern">Modern</a-option-select>
                    <a-option-select value="Classic">Classic</a-option-select>
                    <a-option-select value="Rustic">Rustic</a-option-select>
                    <a-option-select value="Industrial"
                      >Industrial</a-option-select
                    >
                    <a-option-select value="Minimalist"
                      >Minimalist</a-option-select
                    >
                    <a-option-select value="Traditional"
                      >Traditional</a-option-select
                    >
                    <a-option-select value="Contemporary"
                      >Contemporary</a-option-select
                    >
                    <a-option-select value="Vintage">Vintage</a-option-select>
                  </a-select>
                  <!-- {{ room_type || 'Living Room' }} -->
                </div>
                <div>
                  <strong>Room Type:</strong>
                  <a-select v-model:value="room_type_select">
                    <a-option-select value="Living Room"
                      >Living Room</a-option-select
                    >
                    <a-option-select value="Dinning Room"
                      >Dinning Room</a-option-select
                    >
                    <a-option-select value="Kitchen">Kitchen</a-option-select>
                    <a-option-select value="Home Office"
                      >Home Office</a-option-select
                    >
                    <a-option-select value="Bedroom">Bedroom</a-option-select>
                    <a-option-select value="Office">Office</a-option-select>
                    <a-option-select value="Rest Room"
                      >Rest Room</a-option-select
                    >
                  </a-select>
                  <!-- {{ room_design_type || 'Modern' }} -->
                </div>
                <div v-if="products_used">
                  <strong>Products:</strong>
                  <div>{{ products_used.length }} items</div>
                </div>
              </div>
              <br />
              <a-label> Add Description </a-label>
              <a-textarea
                :rows="5"
                v-model:value="description_room"
                placeholder="describe the room here "
              ></a-textarea>
              <a-button
                :disabled="!description_room.trim()"
                block
                type="primary"
                size="large"
                style="margin-top: 10px; padding: 8px 16px"
                @click="Submit_Client_request()"
                >Submit Request</a-button
              >
            </div>
          </div>

          <div>
            <a-row style="margin-bottom: 10px">
              <a-col :span="20">
                <a-button
                  type="primary"
                  @click="open_SaveToMyDesignes = true"
                  :disabled="loading"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    height: auto;
                    border-radius: 8px;
                  "
                  block
                >
                  Save To My Design
                </a-button>
              </a-col>
              <a-col :span="4" style="padding-left: 5px">
                <a-button
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    height: auto;
                    border-radius: 8px;
                  "
                  @click="toggleLikeRoom"
                >
                  <!-- Filled red heart when liked -->
                  <svg
                    v-if="liked_room"
                    width="22"
                    height="22"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.2518 24.4363C11.1484 22.2025 5 17.0956 5 12.5C5 9.46241 7.31579 7 10.5 7C12.15 7 13.8 7.52941 16 9.64704C18.2 7.52941 19.85 7 21.5 7C24.6842 7 27 9.46241 27 12.5C27 17.0956 20.8517 22.2025 17.7482 24.4363C16.7039 25.1879 15.2961 25.1879 14.2518 24.4363Z"
                      fill="#ff4d4f"
                      stroke="#ff4d4f"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <!-- Outline heart when not liked -->
                  <svg
                    v-else
                    width="22"
                    height="22"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.2518 24.4363C11.1484 22.2025 5 17.0956 5 12.5C5 9.46241 7.31579 7 10.5 7C12.15 7 13.8 7.52941 16 9.64704C18.2 7.52941 19.85 7 21.5 7C24.6842 7 27 9.46241 27 12.5C27 17.0956 20.8517 22.2025 17.7482 24.4363C16.7039 25.1879 15.2961 25.1879 14.2518 24.4363Z"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </a-button>
              </a-col>
              <!-- <a-col>
            </a-col> -->
            </a-row>

            <a-button
              type="default"
              block
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                height: auto;
                border-radius: 8px;
              "
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 14.5V4.5M12 14.5C11.2998 14.5 9.99153 12.5057 9.5 12M12 14.5C12.7002 14.5 14.0085 12.5057 14.5 12"
                  stroke="currentcolor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20 16.5C20 18.982 19.482 19.5 17 19.5H7C4.518 19.5 4 18.982 4 16.5"
                  stroke="currentcolor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Download Raw Files
            </a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  LeftOutlined,
  QuestionCircleOutlined,
  HomeOutlined,
  HeartOutlined,
  WhatsAppOutlined,
  InstagramOutlined,
  MailOutlined,
  DownloadOutlined,
  ThunderboltOutlined,
  LoadingOutlined,
  ShoppingCartOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import BusinessRatingModal from "@/components/store/ratings.vue";
import { h } from "vue";

export default {
  name: "render_catalogue",
  components: {
    BusinessRatingModal,
    LeftOutlined,
    QuestionCircleOutlined,
    HomeOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
    WhatsAppOutlined,
    InstagramOutlined,
    MailOutlined,
    DownloadOutlined,
    ThunderboltOutlined,
    LoadingOutlined,
    ReloadOutlined,
  },
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      imageLoading: true, // ADD THIS
      SavedToMyDesignes: false,

      brand_name: "",
      brand_avatar_logo: "",
      brand_banner_logo: "",
      imageLoadedMap: {},

      showRatingModal: false,
      openSeeAll_used_products: false,
      is_Posted_On_Community: false,
      liked_room: false,
      base_image_url: "",
      main_image: "",
      currentView: "after",
      rendering_started: false,
      products_used: [],
      loading: false,
      downloading: false,
      open_RenderNowModal: false,
      is_client_requested_room: false,
      error: {
        room: null,
      },
      is_ready: true,
      notify_me_when_ready: false,

      // Share on community post
      open_ShareOnComunity: false,
      room_type: "",
      room_design_type: "",

      // Share form data
      shareForm: {
        title: "",
        selectedTags: [],
      },

      // Tags data
      availableTags: [],
      popularTags: [],
      tagsLoading: false,
      tagSearchTimeout: null,

      // UI states
      shareLoading: false,
      description_room: "",
      tags_room: [],
      room_design_type_select: "Modern",
      room_type_select: "Living Room",
      open_SaveToMyDesignes: false,

      // Tag colors for random assignment
      tagColors: [
        "#1890ff",
        "#52c41a",
        "#faad14",
        "#f5222d",
        "#722ed1",
        "#13c2c2",
        "#eb2f96",
        "#fa8c16",
        "#a0d911",
        "#2f54eb",
      ],
    };
  },

  computed: {
    displayImage() {
      return this.currentView === "before"
        ? this.main_image
        : this.base_image_url;
    },
  },

  mounted() {
    this.fetchRoom();
    this.FetchFinalResults();
    this.loadAvailableTags();
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
              this.loading = false;
              this.stopPolling();
              resolve(data.finalised_result_wall_processed_image);
              return;
            }

            if (data.status === "failed") {
              this.loading = false;
              this.stopPolling();
              reject("Rendering failed");
              return;
            }
          } catch (err) {
            this.loading = false;
            this.stopPolling();
            reject(err);
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
    gotoMyDesignes() {
      if (this.user.user_type == "Business") {
        this.$router.push("/business-dashboard/my-designs");
      }
      if (this.user.user_type == "Professional") {
        this.$router.push("/professional-dashboard/my-designs");
      }
      if (this.user.user_type == "User") {
        this.$router.push("/user-dashboard/my-designs");
      }
    },
    gotoMyCommunity() {
      if (this.user.user_type == "Business") {
        this.$router.push("/business-dashboard/comunity");
      }
      if (this.user.user_type == "Professional") {
        this.$router.push("/professional-dashboard/my-community-posts");
      }
    },
    async AddRoomitemstocart() {
      this.addingToCart = true;

      try {
        const response = await fetch(
          `${this.$store.state.root_api}cart/add-room/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              room_id: this.$route.params.id,
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          this.$message.success("Room items added to cart successfully!");
        } else {
          this.$message.error(data.message || "Failed to add items to cart");
        }
      } catch (error) {
        console.error("Failed to add room items to cart:", error);
        this.$message.error("An error occurred while adding items to cart");
      } finally {
        this.addingToCart = false;
      }
    },

    show_all_catalogue_products_used_in_room() {
      this.openSeeAll_used_products = true;
    },
    showBefore() {
      this.currentView = "before";
    },

    showAfter() {
      this.currentView = "after";
    },

    startRendering() {
      this.open_RenderNowModal = false;
      this.rendering_started = true;
      this.startRendering_API_CALL();
    },

    openRenderNowModal() {
      this.open_RenderNowModal = true;
    },

    openShareOnComunity() {
      this.open_ShareOnComunity = true;
    },

    closeShareModal() {
      this.open_ShareOnComunity = false;
      this.resetShareForm();
    },

    resetShareForm() {
      this.shareForm = {
        title: `My ${this.room_type || "Room"} Design`,
        selectedTags: [],
      };
    },

    async loadAvailableTags() {
      this.tagsLoading = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}community/api/tags/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (data.success) {
          this.availableTags = data.data.map((tag) => ({
            label: tag.name,
            value: tag.id,
            color: tag.color,
            post_count: tag.post_count,
          }));

          this.popularTags = this.availableTags
            .sort((a, b) => (b.post_count || 0) - (a.post_count || 0))
            .slice(0, 10);

          this.addSuggestedTags();
        }
      } catch (error) {
        console.error("Failed to load tags:", error);
        this.$message.error("Failed to load tags");
      } finally {
        this.tagsLoading = false;
      }
    },

    addSuggestedTags() {
      const suggestedTags = [];

      if (this.room_type) {
        suggestedTags.push({
          label: this.room_type.toLowerCase().replace("_", " "),
          value: `room_${this.room_type.toLowerCase()}`,
          color: this.getRandomTagColor(),
          isNew: true,
        });
      }

      if (this.room_design_type) {
        suggestedTags.push({
          label: this.room_design_type.toLowerCase(),
          value: `style_${this.room_design_type.toLowerCase()}`,
          color: this.getRandomTagColor(),
          isNew: true,
        });
      }

      suggestedTags.forEach((tag) => {
        if (!this.availableTags.some((t) => t.label === tag.label)) {
          this.availableTags.unshift(tag);
        }
      });
    },

    handleTagSearch(value) {
      if (this.tagSearchTimeout) {
        clearTimeout(this.tagSearchTimeout);
      }

      this.tagSearchTimeout = setTimeout(() => {
        if (
          value &&
          !this.availableTags.some((tag) =>
            tag.label.toLowerCase().includes(value.toLowerCase()),
          )
        ) {
          const newTag = {
            label: value,
            value: `new_${Date.now()}`,
            color: this.getRandomTagColor(),
            isNew: true,
          };

          this.availableTags.unshift(newTag);
        }
      }, 500);
    },

    handleTagSelect(value, option) {
      console.log("Selected tag:", value, option);
    },

    addPopularTag(tag) {
      if (!this.shareForm.selectedTags.includes(tag.value)) {
        this.shareForm.selectedTags.push(tag.value);
      }
    },

    getRandomTagColor() {
      return this.tagColors[Math.floor(Math.random() * this.tagColors.length)];
    },

    async shareOnCommunity() {
      if (!this.shareForm.title.trim()) {
        this.$message.error("Please enter a title for your post");
        return;
      }

      this.shareLoading = true;

      try {
        const tagIds = await this.createNewTags();

        const postData = {
          title: this.shareForm.title,
          room_id: this.$route.params.id,
          tag_ids: tagIds,
        };

        const response = await fetch(
          `${this.$store.state.root_api}community/api/posts/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          },
        );

        const data = await response.json();

        if (data.success) {
          this.$message.success("Your design has been shared on community!");
          this.closeShareModal();
          this.is_Posted_On_Community = true;
        } else {
          throw new Error(data.message || "Failed to share post");
        }
      } catch (error) {
        console.error("Failed to share on community:", error);
        this.$message.error(error.message || "Failed to share your design");
      } finally {
        this.shareLoading = false;
      }
    },

    async createNewTags() {
      const tagIds = [];

      for (const tagValue of this.shareForm.selectedTags) {
        const existingTag = this.availableTags.find(
          (t) => t.value === tagValue,
        );

        if (existingTag && !existingTag.isNew) {
          tagIds.push(existingTag.value);
        } else {
          try {
            const tagName = existingTag ? existingTag.label : tagValue;
            const response = await fetch(
              `${this.$store.state.root_api}community/api/tags/`,
              {
                method: "POST",
                headers: {
                  Authorization: `Token ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: tagName,
                  color: this.getRandomTagColor(),
                  description: `Tag for ${tagName} designs`,
                }),
              },
            );

            const data = await response.json();
            if (data.success) {
              tagIds.push(data.data.id);
            }
          } catch (error) {
            console.error("Failed to create tag:", error);
          }
        }
      }

      return tagIds;
    },

    handleBack() {
      this.$router.go(-1);
    },

    handleDownload() {
      if (!this.base_image_url) return;

      this.downloading = true;

      try {
        const link = document.createElement("a");
        link.href = this.base_image_url;
        link.download = `room-render-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.$message.success("Download started!");
      } catch (error) {
        this.$message.error("Download failed. Please try again.");
        console.error("Download error:", error);
      } finally {
        this.downloading = false;
      }
    },

    handleRenderNow() {
      this.$router.push({ name: "render" });
    },

    shareOnSocial(platform) {
      if (!this.base_image_url) return;

      const shareText = "Check out my room render!";
      const shareUrl = encodeURIComponent(window.location.href);
      const imageUrl = encodeURIComponent(this.base_image_url);

      let url = "";

      switch (platform) {
        case "whatsapp":
          url = `https://wa.me/?text=${shareText} ${shareUrl}`;
          break;
        case "facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
          break;
        case "instagram":
          this.$message.info("Please save the image and share it on Instagram");
          return;
        case "gmail":
          url = `mailto:?subject=${shareText}&body=Check out this room render: ${shareUrl}`;
          break;
        default:
          return;
      }

      window.open(url, "_blank", "width=600,height=400");
    },

    onRoomImageLoad() {
      this.imageLoadedMap["room"] = false;
      setTimeout(() => {
        this.imageLoadedMap["room"] = true;
      }, 1000);
    },

    handleImageError() {
      this.imageLoading = false; // Add this line

      this.error.room = "Failed to load the room image";
    },

    handleImageLoad() {
      this.imageLoading = false; // Add this line

      console.log("✅ Image loaded successfully");
    },

    showError(title, message) {
      this.$notification.error({
        message: title,
        description: message,
        duration: 5,
      });
    },

    async startRendering_API_CALL() {
      console.log("📡 Starting rendering...");
      this.loading = true;
      this.imageLoading = true;
      this.error.room = null;

      try {
        const roomId = this.$route.params.id;
        const url = `${this.$store.state.root_api}engine/render-final-result/${roomId}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            request: "render_better_quality",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (responseData.renderer_id) {
          // ⏳ WAIT until polling completes
          const finalImage = await this.startPolling(responseData.renderer_id);

          // ✅ ONLY NOW update canvas
          this.base_image_url =
            this.$store.state.root_media_api + finalImage + "?t=" + Date.now();

          // this.forceCanvasUpdate();
          this.$message.success("texture applied!");
        }

        // console.log("=========================== ===========================  ===========================  ===========================  =========================== ")
        // console.log("=========================== ===========================  ===========================  ===========================  =========================== ")
        // console.log(responseData)
        // if (responseData && this.is_ready) {

        //   this.base_image_url = this.$store.state.root_media_api + responseData.final_image_output;
        // } else {
        //   this.error.room = "Room is not ready yet. Please try again later.";
        //   this.imageLoading = false;
        // }
      } catch (error) {
        console.error("❌ Failed to start rendering:", error);
        this.error.room = error.message;
        this.imageLoading = false;
        this.showError("Failed to Start Rendering", error.message);
      } finally {
        this.loading = false;
      }
    },

    // async SaveToMyDesignes() {
    //   console.log("📡 Saving to my designs...");
    //   this.loading = true;
    //   this.error.room = null;

    //   try {
    //     const roomId = this.$route.params.id;
    //     const url = `${this.$store.state.root_api}engine/render-final-result/${roomId}`;

    //     const response = await fetch(url, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Token ${localStorage.getItem("token")}`,
    //       },
    //       body: JSON.stringify({
    //         request: 'save_to_my_designes',
    //         description_room: this.description_room,
    //         room_design_type_select: this.room_design_type_select,
    //         room_type_select: this.room_type_select,
    //       })
    //     });

    //     if (!response.ok) {
    //       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    //     }

    //     const responseData = await response.json();

    //     if (responseData && this.is_ready) {
    //       this.$router.push('/business-dashboard/my-designs');
    //     } else {
    //       this.error.room = "Room is not ready yet. Please try again later.";
    //     }
    //   } catch (error) {
    //     console.error("❌ Failed to save:", error);
    //     this.error.room = error.message;
    //     this.showError("Failed to Save", error.message);
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    async SaveToMyDesignes() {
      console.log("📡 Saving to my designs...");
      this.loading = true;
      this.error.room = null;

      try {
        const roomId = this.$route.params.id;
        const url = `${this.$store.state.root_api}engine/render-final-result/${roomId}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            request: "save_to_my_designes",
            description_room: this.description_room,
            room_design_type_select: this.room_design_type_select,
            room_type_select: this.room_type_select,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (responseData && this.is_ready) {
          this.$message.success("Design saved successfully!");
          this.open_SaveToMyDesignes = false; // Close the save modal

          this.SavedToMyDesignes = true;
          // Show rating modal after successful save (if not rated in this session)

          this.showRatingModal = true;
        } else {
          this.error.room = "Room is not ready yet. Please try again later.";
        }
      } catch (error) {
        console.error("❌ Failed to save:", error);
        this.error.room = error.message;
        this.showError("Failed to Save", error.message);
      } finally {
        this.loading = false;
      }
    },

    async Submit_Client_request() {
      console.log("📡 Submitting client request...");

      if (this.description_room.trim() === "") {
        return this.$message?.error(
          "Please add some description to describe the room.",
          3,
        );
      }

      this.loading = true;
      this.error.room = null;

      try {
        const roomId = this.$route.params.id;
        const url = `${this.$store.state.root_api}engine/render-final-result/${roomId}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            request: "submit_client_request",
            description_room: this.description_room,
            room_design_type_select: this.room_design_type_select,
            room_type_select: this.room_type_select,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (responseData && this.is_ready) {
          this.$router.push("/business-dashboard/my-designs");
        } else {
          this.error.room = "Room is not ready yet. Please try again later.";
        }
      } catch (error) {
        console.error("❌ Failed to submit request:", error);
        this.error.room = error.message;
        this.showError("Failed to Submit Request", error.message);
      } finally {
        this.loading = false;
      }
    },

    async Business_staff_Submit_Client_request() {
      console.log("📡 Business staff submitting client request...");

      if (this.description_room.trim() === "") {
        return this.$message?.error(
          "Please add some description to describe the room.",
          3,
        );
      }

      this.loading = true;
      this.error.room = null;

      try {
        const roomId = this.$route.params.id;
        const url = `${this.$store.state.root_api}engine/render-final-result/${roomId}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            request: "business_staff_submit_client_request",
            description_room: this.description_room,
            room_design_type_select: this.room_design_type_select,
            room_type_select: this.room_type_select,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (responseData && this.is_ready) {
          this.$router.push(
            "/access-business/manage-customer-requests?brand=" +
              this.$route.query.brand,
          );
        } else {
          this.error.room = "Room is not ready yet. Please try again later.";
        }
      } catch (error) {
        console.error("❌ Failed to submit request:", error);
        this.error.room = error.message;
        this.showError("Failed to Submit Request", error.message);
      } finally {
        this.loading = false;
      }
    },

    async fetchRoom() {
      console.log("📡 Fetching room data...");
      this.loading = true;
      this.imageLoading = true;
      this.error.room = null;

      try {
        const roomId = this.$route.params.id;
        const url = `${this.$store.state.root_api}room/api/room/${roomId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (responseData && responseData.data) {
          if (this.is_ready) {
            console.log("✅ Room is ready!");
            this.base_image_url =
              this.$store.state.root_media_api + responseData.data.image;
            this.main_image =
              this.$store.state.root_media_api + responseData.data.main_image;
            this.is_client_requested_room =
              responseData.data.is_client_requested_room;

            this.brand_name = responseData.data.brand_name;
            this.brand_avatar_logo = responseData.data.brand_avatar_logo;
            this.brand_banner_logo = responseData.data.brand_banner_logo;
            console.log("✅ Room data loaded:", this.base_image_url);
          } else {
            this.error.room = "Room is not ready yet. Please try again later.";
            this.imageLoading = false;
          }
        } else {
          this.error.room = "No room data found";
          this.imageLoading = false;
        }
      } catch (error) {
        console.error("❌ Failed to fetch room:", error);
        this.error.room = error.message;
        this.imageLoading = false;
        this.showError("Failed to Load Room", error.message);
      } finally {
        this.loading = false;
      }
    },
    async toggleLikeRoom() {
      try {
        const roomId = this.$route.params.id;
        const url = `${this.$store.state.root_api}likes/favorites/toggle/`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            id: roomId,
            type: "room",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log(
          " ====================  ====================  ==================== ",
        );
        console.log(responseData);
        if (responseData) {
          this.liked_room = responseData.favorited;
        }
        // if (responseData && responseData.data) {
        //   this.products_used = responseData.data.products_used || [];
        //   this.room_type = responseData.data.room_type || '';
        //   this.room_design_type = responseData.data.room_design_type || '';
        // }
      } catch (error) {
        console.warn("⚠️ Could not fetch final results:", error.message);
      }
      console.log(
        " ====================  ====================  ==================== ",
      );
    },
    async FetchFinalResults() {
      console.log("📡 Fetching final results...");
      this.loading = true;
      this.error.room = null;

      try {
        const roomId = this.$route.params.id;
        const url = `${this.$store.state.root_api}engine/render-final-result/${roomId}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        // console.log(" ====================  ====================  ==================== ")
        // console.log(responseData)
        if (responseData) {
          this.products_used = responseData.products_used || [];
          this.room_type = responseData.room_type || "";
          this.room_design_type = responseData.room_design_type || "";
        }
        // if (responseData && responseData.data) {
        //   this.products_used = responseData.data.products_used || [];
        //   this.room_type = responseData.data.room_type || '';
        //   this.room_design_type = responseData.data.room_design_type || '';
        // }
      } catch (error) {
        console.warn("⚠️ Could not fetch final results:", error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Updated scanning loading overlay to fit canvas only */
.scanning-loading-overlay {
  width: 100%;
  height: 100%;
  z-index: 10;
  border-radius: 10px;
  overflow: hidden;
}

.room-render-skeleton {
  width: 100%;
  min-height: 500px;
  max-width: 700px;
  min-width: 700px;
  max-height: 500px;
  border-radius: 8px;
  background: linear-gradient(110deg, #e5e7eb 8%, #f9fafb 18%, #e5e7eb 33%);
  background-size: 200% 100%;
  animation: room-shimmer 1.6s infinite linear;
}

@keyframes room-shimmer {
  to {
    background-position-x: -200%;
  }
}

.room-render-image {
  width: 100%;
  max-width: 800px;
  min-width: 300px;
  height: 100%;
  max-height: 500px;
  min-height: 300px;
  object-fit: cover;
  display: block;
  border-radius: 8px;
}

.loading-screen {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 10px;
}

.loading-screen::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: rgba(0, 0, 0, 0.05); */
  z-index: 1;
}
.wave-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to left,
    rgba(0, 102, 255, 1) 0%,
    /* bold vertical scanning line */ rgba(0, 102, 255, 0.4) 20%,
    rgba(0, 102, 255, 0.3) 30%,
    /* fade tail after the bold line */ rgba(0, 102, 255, 0.2) 35%,
    rgba(0, 102, 255, 0.15) 40%,
    rgba(0, 102, 255, 0.1) 50%,
    rgba(0, 102, 255, 0) 100%
  );
  animation:
    moveWaveLeftToRight 3s linear infinite,
    waveFade 3s ease-in-out infinite; /* fade control */
  z-index: 2;
}

@keyframes moveWaveLeftToRight {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(50%);
  }
}

@keyframes waveFade {
  0% {
    opacity: 0;
  } /* invisible before entering */
  10% {
    opacity: 1;
  } /* fade in */
  90% {
    opacity: 1;
  } /* stay visible */
  100% {
    opacity: 0;
  } /* fade out before reset */
}

.loading-text {
  position: relative;
  color: #fff;
  text-align: center;
  z-index: 3;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.3);
  padding: 20px 30px;
  border-radius: 10px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.process-text {
  font-size: 18px;
  opacity: 0.9;
  letter-spacing: 1px;
  text-transform: uppercase;
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

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
