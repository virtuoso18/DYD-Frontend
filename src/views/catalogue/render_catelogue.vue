<template>
  <a-drawer
    title="AI catalog products used in room."
    :placement="'bottom'"
    :closable="true"
    :open="openSeeAll_used_products"
    height="90%"
    style="
  border-top-left-radius: 20px;;
  border-top-right-radius: 20px;;
"
    @close="openSeeAll_used_products=false"
    >
    <template #extra> <div class="head-section">
    
    </div>
    </template>
      <!-- {{ products_used }} -->
        <!-- <floor_textures_bottom_drawer_menu :products="seeAll_Floor"/> -->
          <a-row>
            <a-col span="24" style="display: flex;justify-content: center;align-items: center;height:70vh;">
              <a-empty description="You have not used any product in this room here."></a-empty>
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
                <div
                  class="product-image-container"
                  @click="viewProduct(product)"
                >
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
                      v-for="(color, index) in product.product_colors.slice(
                        0,
                        2
                      )"
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
                    style="
                      display: flex;
                      justify-content: end;
                      font-weight: 700;
                    "
                  >
                    <!-- <del style="font-size: 10px;">${{ product.pricing.price }}</del> -->
                    ${{ product.product_price }}
                  </a-col>

                  <a-col span="17">
                    <a-button block @click="this.$router.push('/'+product.business_slug+'/'+product.type+'/'+product.product_id)"
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
      <div :style="'padding:10px;font-size: 18px;color:blue;font-weight:bold;background-color:#f3f2f3;'">
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
    <div style="display: flex; align-items: center; flex-direction: column; justify-content: center;">
      <div style="width: 100%; text-align: start; margin-bottom: 20px;">
        <h3 style="margin: 0; font-size: 24px; font-weight: 600;">Share on Community</h3>
        <p style="margin: 5px 0; color: #666;">Share your amazing design with the community!</p>
      </div>
      
      <a-row style="width: 100%" :gutter="20">
        <!-- Image Preview -->
        <a-col :sm="24" :xs="24" :lg="10" :md="10">
          <div style="position: relative;">
            <img
              :src="base_image_url"
              style="border-radius: 12px; width: 100%; max-height: 400px; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
              alt="Room Design"
            />
            <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); border-radius: 8px; padding: 5px 10px; color: white; font-size: 12px;">
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
          style="display: flex; justify-content: space-between; flex-direction: column; min-height: 400px;"
        >
          <div style="flex: 1;">
            <!-- Title Input -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">
                Post Title <span style="color: red;">*</span>
              </label>
              <a-input
                v-model:value="shareForm.title"
                placeholder="Give your design an attractive title..."
                size="large"
                :maxlength="200"
                show-count
                style="border-radius: 8px;"
              />
            </div>

            <!-- Tags Section -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">
                Tags
                <span style="color: #666; font-weight: 400; font-size: 12px;">(Help others discover your design)</span>
              </label>
              
              <!-- Tag Select -->
              <a-select
                v-model:value="shareForm.selectedTags"
                mode="tags"
                placeholder="Select existing tags or create new ones..."
                style="width: 100%; border-radius: 8px;"
                size="large"
                :options="availableTags"
                :loading="tagsLoading"
                @search="handleTagSearch"
                @select="handleTagSelect"
                :filter-option="false"
                :not-found-content="tagsLoading ? 'Loading...' : 'No tags found - type to create new'"
              >
                <template #tagRender="{ label, value, closable, onClose, option }">
                  <a-tag
                    :color="option?.color || getRandomTagColor()"
                    :closable="closable"
                    @close="onClose"
                    style="margin: 2px; padding: 4px 8px; border-radius: 6px;"
                  >
                    {{ label }}
                  </a-tag>
                </template>
              </a-select>
              
              <!-- Popular Tags -->
              <div v-if="popularTags.length > 0" style="margin-top: 10px;">
                <span style="font-size: 12px; color: #666; margin-bottom: 8px; display: block;">Popular tags:</span>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  <a-tag
                    v-for="tag in popularTags.slice(0, 8)"
                    :key="tag.value"
                    :color="tag.color"
                    style="cursor: pointer; border-radius: 12px; margin: 0;"
                    @click="addPopularTag(tag)"
                  >
                    {{ tag.label }}
                  </a-tag>
                </div>
              </div>
            </div>

            <!-- Room Info Display -->
            <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#666">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <span style="font-weight: 500; color: #333;">Room Details</span>
              </div>
              <div style="display: flex; gap: 15px; font-size: 14px; color: #666;">
                <span><strong>Type:</strong> {{ room_type || 'Living Room' }}</span>
                <span><strong>Style:</strong> {{ room_design_type || 'Modern' }}</span>
                <span v-if="products_used"><strong>Products:</strong> {{ products_used.length }} items</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px; margin-top: 20px;">
            <a-button 
              type="default" 
              size="large" 
              style="flex: 1; border-radius: 8px; height: 48px;"
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
              style="flex: 2; border-radius: 8px; height: 48px; display: flex; justify-content: center; align-items: center; gap: 8px;"
            >
              <svg v-if="!shareLoading" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.125 5.64648C17.125 6.95816 16.0617 8.02148 14.75 8.02148C13.4383 8.02148 12.375 6.95816 12.375 5.64648C12.375 4.33481 13.4383 3.27148 14.75 3.27148C16.0617 3.27148 17.125 4.33481 17.125 5.64648Z" stroke="white" stroke-width="1.5"/>
                <path d="M7.625 10C7.625 11.3117 6.56167 12.375 5.25 12.375C3.93833 12.375 2.875 11.3117 2.875 10C2.875 8.68829 3.93833 7.625 5.25 7.625C6.56167 7.625 7.625 8.68829 7.625 10Z" stroke="white" stroke-width="1.5"/>
                <path d="M17.125 14.3535C17.125 15.6652 16.0617 16.7285 14.75 16.7285C13.4383 16.7285 12.375 15.6652 12.375 14.3535C12.375 13.0418 13.4383 11.9785 14.75 11.9785C16.0617 11.9785 17.125 13.0418 17.125 14.3535Z" stroke="white" stroke-width="1.5"/>
                <path d="M7.40625 9.00937L12.5521 6.63477M7.40625 10.9889L12.5521 13.3635" stroke="white" stroke-width="1.5"/>
              </svg>
              {{ shareLoading ? 'Sharing...' : 'Share on Community' }}
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
    <div style="display: flex; align-items: center; flex-direction: column; justify-content: center;">
      <div style="width: 100%; text-align: start; margin-bottom: 20px;">
        <h3 style="margin: 0; font-size: 24px; font-weight: 600;">Save To My Designes</h3>
        <p style="margin: 5px 0; color: #666;">Save your amazing design in your my design!</p>
      </div>
      
      <a-row style="width: 100%" :gutter="20">
        <!-- Image Preview -->
        <a-col :sm="24" :xs="24" :lg="10" :md="10">
          <div style="position: relative;">
            <img
              :src="base_image_url"
              style="border-radius: 12px; width: 100%; max-height: 400px; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
              alt="Room Design"
            />
            <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); border-radius: 8px; padding: 5px 10px; color: white; font-size: 12px;">
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
          style="display: flex; justify-content: space-between; flex-direction: column; min-height: 400px;"
        >
          <div style="flex: 1;">
            <!-- Title Input -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">
                Describe Room <span style="color: red;">*</span>
              </label>
              <a-input
                v-model:value="description_room"
                placeholder="Give your design an attractive descriptionhere ..."
                size="large"
                :maxlength="200"
                show-count
                style="border-radius: 8px;"
              />
            </div>
            

            <!-- Room Info Display -->
            <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#666">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <span style="font-weight: 500; color: #333;">Room Details</span>
              </div>
              <div style="display: flex; gap: 15px; font-size: 14px; color: #666;">
                <span><strong>Style:</strong> 
                  <a-select v-model:value="room_design_type_select">
                    <a-option-select value="Modern">Modern</a-option-select>
                    <a-option-select value="Classic">Classic</a-option-select>
                    <a-option-select value="Rustic">Rustic</a-option-select>
                    <a-option-select value="Industrial">Industrial</a-option-select>
                    <a-option-select value="Minimalist">Minimalist</a-option-select>
                    <a-option-select value="Traditional">Traditional</a-option-select>
                    <a-option-select value="Contemporary">Contemporary</a-option-select>
                    <a-option-select value="Vintage">Vintage</a-option-select>
                  </a-select>
                  <!-- {{ room_type || 'Living Room' }} -->
                </span>
                <span><strong>Room Type:</strong> 
                  <a-select v-model:value="room_type_select">
                    <a-option-select value="Living Room">Living Room</a-option-select>
                    <a-option-select value="Dinning Room">Dinning Room</a-option-select>
                    <a-option-select value="Kitchen">Kitchen</a-option-select>
                    <a-option-select value="Home Office">Home Office</a-option-select>
                    <a-option-select value="Bedroom">Bedroom</a-option-select>
                    <a-option-select value="Office">Office</a-option-select>
                    <a-option-select value="Rest Room">Rest Room</a-option-select>
                  </a-select>
                  <!-- {{ room_design_type || 'Modern' }} -->
                </span>
                <span v-if="products_used"><strong>Products:</strong> {{ products_used.length }} items</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px; margin-top: 20px;">
            <a-button 
              type="default" 
              size="large" 
              style="flex: 1; border-radius: 8px; height: 48px;"
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
              style="flex: 2; border-radius: 8px; height: 48px; display: flex; justify-content: center; align-items: center; gap: 8px;"
            >
              <svg v-if="!shareLoading" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.125 5.64648C17.125 6.95816 16.0617 8.02148 14.75 8.02148C13.4383 8.02148 12.375 6.95816 12.375 5.64648C12.375 4.33481 13.4383 3.27148 14.75 3.27148C16.0617 3.27148 17.125 4.33481 17.125 5.64648Z" stroke="white" stroke-width="1.5"/>
                <path d="M7.625 10C7.625 11.3117 6.56167 12.375 5.25 12.375C3.93833 12.375 2.875 11.3117 2.875 10C2.875 8.68829 3.93833 7.625 5.25 7.625C6.56167 7.625 7.625 8.68829 7.625 10Z" stroke="white" stroke-width="1.5"/>
                <path d="M17.125 14.3535C17.125 15.6652 16.0617 16.7285 14.75 16.7285C13.4383 16.7285 12.375 15.6652 12.375 14.3535C12.375 13.0418 13.4383 11.9785 14.75 11.9785C16.0617 11.9785 17.125 13.0418 17.125 14.3535Z" stroke="white" stroke-width="1.5"/>
                <path d="M7.40625 9.00937L12.5521 6.63477M7.40625 10.9889L12.5521 13.3635" stroke="white" stroke-width="1.5"/>
              </svg>
              {{ shareLoading ? 'Sharing...' : 'Save To My Designes' }}
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>


  <div v-if="!rendering_started" style="background-color: #f3f3f3;">
    <a-row style="padding: 20px;  padding-top: 30px">
      <a-col :span="8" style="display: flex; align-items: center">
        <button
          style="
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 14px;
          "
        >
          ← &nbsp;Back to edit
        </button>
      </a-col>
      <a-col
        :span="8"
        style="display: flex; justify-content: center; align-items: center"
      >
        <div style="display: flex; gap: 0; border-radius: 20px; width: 100%; max-width: 150px;z-index:2">
  <a-button 
    :type="currentView === 'before' ? 'primary' : 'default'"
    @click="showBefore"
    :disabled="rendering_started"
  > 
    Before 
  </a-button>
  <a-button 
    :type="currentView === 'after' ? 'primary' : 'default'"
    @click="showAfter"
    :disabled="rendering_started"
  > 
    After 
  </a-button>
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
            font-size: 14px;
          "
        >
          ⚪ Support
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
     <div style="position: relative; display: inline-block;">

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
  <div v-else style="background-color: #f3f3f3;min-height:90.5vh;">
    <a-row>
      <a-col
        :lg="18"
        :md="18"
        :sm="24"
        :xs="24"
        style="
          display: flex;
          justify-content: start;
          padding-top:20px;
          flex-direction: column;
          align-items: center;
        "
      >
        <div style="display: flex; gap: 0; border-radius: 20px; width: 100%; max-width: 150px; margin-bottom: 10px;">
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
</div>

        <div style="display: flex; flex-direction: column">
         <div v-if="loading" class="scanning-loading-overlay" style="
              padding: 10px;
              border: 1px solid rgba(0, 0, 0, 0.1);
              border-radius: 10px;
              width: 800px;
              height: 500px;
            ">
      <div class="loading-screen" :style="{ backgroundImage: base_image_url ? `url(${base_image_url})` : 'none' }">
        <div class="wave-overlay"></div>
        <div class="loading-text">
          <div class="process-text">Plaease Wait We Are Rendering the Final Results</div>
        </div>
      </div>
    </div>
         
    <div style="position: relative; display: inline-block;" v-else>

  
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

      <a-col :lg="6" :md="6" :sm="24" :xs="24" style="background-color: white;padding:10px;" v-if="is_client_requested_room === false && !this.$route.query.business_staff">
        <div>
          <h3 style="text-align:center">
            Congratulation!<br/>
            Your photo already set.
          </h3>

          <div
            style="
              background-color: #f3f2f2;
              border-radius: 10px;
              padding: 10px;
              margin-bottom:10px;
            "
          >
            <a-row style="margin-bottom: 10px">
              <a-col :span="6">
                <img :src="base_image_url" style="width: 100%" alt="" />
              </a-col>
              <a-col :span="18" style="padding-left: 10px">
                <h2 style="margin: 0; font-size: 14px;color: #000;">Share your project</h2>
                <p style="margin: 0; font-size: 12px; font-weight: 500; color: #000;">
                  Tell your community about the project you created
                </p>
              </a-col>
            </a-row>
            <a-button
              type="primary"
              @click="openShareOnComunity()"
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
              Share on community</a-button
            >
          </div>
          

          <div
  style="
    background-color: #f5f5f5;
    border-radius: 12px;
    margin-bottom:10px;
    padding: 20px;
    font-family: 'Inter', sans-serif;
    color: #111;
  "
>
  <!-- Title -->
  <h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #000;">
    Detail Staging
  </h3>

  <!-- Room type -->
  <div style="margin-bottom: 5px;">
    <p style="margin: 0; font-size: 13px; color: #888;">Room type</p>
    <p style="margin: 0; font-size: 14px; font-weight: 500; color: #000;">
      {{room_design_type_select}}
    </p>
  </div>

  <!-- Style -->
  <div style="margin-bottom: 5px;">
    <p style="margin: 0; font-size: 13px; color: #888;">Style</p>
    <p style="margin: 0; font-size: 14px; font-weight: 500; color: #000;">
      {{room_type_select}}
    </p>
  </div>

  <!-- Divider -->
  <hr style="border: none; border-top: 1px solid #ddd; margin: 5px 0;" />

  <!-- Product Section -->
  <div>
    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #000;">
      Product
    </p>

    <a-row align="middle" style="margin-bottom: 10px;" v-if="products_used.length">
      <a-col :span="4">
        <img
          :src="$store.state.root_media_api + products_used[0].product_image"
          alt=""
          style="width: 42px; height: 42px; border-radius: 6px; object-fit: cover;"
        />
      </a-col>
      <a-col :span="20">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #000;">
          {{ products_used[0].product_title }}
        </p>
        <a
          href="#"
          style="font-size: 13px; color: #2563eb; text-decoration: none;"
          @click="this.$router.push('/'+products_used[0].business_slug+'/'+products_used[0].type+'/'+products_used[0].product_id)"
        >
          Product Detail
        </a>
      </a-col>
    </a-row>
    <a-row align="middle" style="margin-bottom: 10px;" v-else>
      <a-col :span="24">
      <a-empty description="No Products Used In room."></a-empty>  
      </a-col>
      
    </a-row>
  </div>

  <!-- Catalog link -->
  <div
    style="
      
    "
  >
    <a-button
      block
      style="
        font-size: 14px;
        font-weight: 500;
        color: #2563eb;
        text-decoration: none;
      "
       @click="show_all_catalogue_products_used_in_room()"
    >
      See all catalog products
    </a-button>
  </div>

  <!-- Add to Cart -->
  <a-button
    style=" display:flex;justify-content: center;
      text-align: center;
      margin-top: 14px;
      font-size: 14px;
      font-weight: 500;
      color: #2563eb;
      cursor: pointer;
    "
    type="text"
    block
  >
   <ShoppingCartOutlined style="font-size:20px" />
    Add to Cart
  </a-button>
</div>



          <div
            style="
              background-color: #f3f2f2;
              border-radius: 10px;
              padding: 10px;
            "
          >
          <a-row style="margin-bottom: 10px;">
            <a-col :span="20">
                <a-button type="primary" @click="open_SaveToMyDesignes=true" style="
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                height: auto;
                border-radius: 8px;" block>
                    Save To My Design
                </a-button>
            </a-col>
            <a-col :span="4" style="padding-left:5px">
                <a-button  @click="toggleLikeRoom" style="
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                height: auto;
                border-radius: 8px;" 

                >
                <!-- Filled red heart when liked -->
<svg v-if="liked_room" width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.2518 24.4363C11.1484 22.2025 5 17.0956 5 12.5C5 9.46241 7.31579 7 10.5 7C12.15 7 13.8 7.52941 16 9.64704C18.2 7.52941 19.85 7 21.5 7C24.6842 7 27 9.46241 27 12.5C27 17.0956 20.8517 22.2025 17.7482 24.4363C16.7039 25.1879 15.2961 25.1879 14.2518 24.4363Z" 
          fill="#ff4d4f" 
          stroke="#ff4d4f" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
</svg>

<!-- Outline heart when not liked -->
<svg v-else width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.2518 24.4363C11.1484 22.2025 5 17.0956 5 12.5C5 9.46241 7.31579 7 10.5 7C12.15 7 13.8 7.52941 16 9.64704C18.2 7.52941 19.85 7 21.5 7C24.6842 7 27 9.46241 27 12.5C27 17.0956 20.8517 22.2025 17.7482 24.4363C16.7039 25.1879 15.2961 25.1879 14.2518 24.4363Z" 
          stroke="black" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
</svg>

                </a-button>
            </a-col>
            <!-- <a-col>
            </a-col> -->
        </a-row>

        <a-button type="default" block style="
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                height: auto;
                border-radius: 8px;">

            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14.5V4.5M12 14.5C11.2998 14.5 9.99153 12.5057 9.5 12M12 14.5C12.7002 14.5 14.0085 12.5057 14.5 12" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 16.5C20 18.982 19.482 19.5 17 19.5H7C4.518 19.5 4 18.982 4 16.5" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Download Raw Files
        </a-button>
          </div>
        </div>
      </a-col>
      
      <a-col :lg="6" :md="6" :sm="24" :xs="24" style="background-color: white;padding:10px;" v-else-if="is_client_requested_room === false && this.$route.query.business_staff">
         <div style="display: flex;flex-direction: column;justify-content: space-between;height:87vh;">
          <div>

            <h3 style="text-align:center">
              Congratulation!<br/>
              Your photo already set.
            </h3>
            
            <div
            style="
              
              border-radius: 10px;
              padding: 10px;
              margin-bottom:10px;
              "
          >
          <div style="display: flex; gap: 15px; font-size: 14px; color: #666;">
            <div>
                <strong>Style:</strong> 
                <a-select v-model:value="room_design_type_select">
                  <a-option-select value="Modern">Modern</a-option-select>
                  <a-option-select value="Classic">Classic</a-option-select>
                  <a-option-select value="Rustic">Rustic</a-option-select>
                  <a-option-select value="Industrial">Industrial</a-option-select>
                  <a-option-select value="Minimalist">Minimalist</a-option-select>
                  <a-option-select value="Traditional">Traditional</a-option-select>
                  <a-option-select value="Contemporary">Contemporary</a-option-select>
                  <a-option-select value="Vintage">Vintage</a-option-select>
                </a-select>
                <!-- {{ room_type || 'Living Room' }} -->
              

              </div>
              <div>

                <strong>Room Type:</strong> 
                <a-select v-model:value="room_type_select">
                  <a-option-select value="Living Room">Living Room</a-option-select>
                  <a-option-select value="Dinning Room">Dinning Room</a-option-select>
                  <a-option-select value="Kitchen">Kitchen</a-option-select>
                  <a-option-select value="Home Office">Home Office</a-option-select>
                  <a-option-select value="Bedroom">Bedroom</a-option-select>
                  <a-option-select value="Office">Office</a-option-select>
                  <a-option-select value="Rest Room">Rest Room</a-option-select>
                </a-select>
                <!-- {{ room_design_type || 'Modern' }} -->
              </div>
              <div v-if="products_used"><strong>Products:</strong> <div>{{ products_used.length }} items</div></div>
            </div>
            <br>
          <a-label>
            Add Description
          </a-label>
          <a-textarea :rows="5" v-model:value="description_room" placeholder="describe the room here "></a-textarea>
          <a-button  :disabled="!description_room.trim()" block type="primary" size="large" style="margin-top:10px;padding: 8px 16px;" @click="Business_staff_Submit_Client_request()">Submit Request</a-button>
        </div>
      </div>
        </div>
      </a-col>
      <a-col :lg="6" :md="6" :sm="24" :xs="24" style="background-color: white;padding:10px;" v-else>
        <div style="display: flex;flex-direction: column;justify-content: space-between;height:87vh;">
          <div>

            <h3 style="text-align:center">
              Congratulation!<br/>
              Your photo already set.
            </h3>
            
            <div
            style="
              
              border-radius: 10px;
              padding: 10px;
              margin-bottom:10px;
              "
          >
          <div style="display: flex; gap: 15px; font-size: 14px; color: #666;">
            <div>
                <strong>Style:</strong> 
                <a-select v-model:value="room_design_type_select">
                  <a-option-select value="Modern">Modern</a-option-select>
                  <a-option-select value="Classic">Classic</a-option-select>
                  <a-option-select value="Rustic">Rustic</a-option-select>
                  <a-option-select value="Industrial">Industrial</a-option-select>
                  <a-option-select value="Minimalist">Minimalist</a-option-select>
                  <a-option-select value="Traditional">Traditional</a-option-select>
                  <a-option-select value="Contemporary">Contemporary</a-option-select>
                  <a-option-select value="Vintage">Vintage</a-option-select>
                </a-select>
                <!-- {{ room_type || 'Living Room' }} -->
              

              </div>
              <div>

                <strong>Room Type:</strong> 
                <a-select v-model:value="room_type_select">
                  <a-option-select value="Living Room">Living Room</a-option-select>
                  <a-option-select value="Dinning Room">Dinning Room</a-option-select>
                  <a-option-select value="Kitchen">Kitchen</a-option-select>
                  <a-option-select value="Home Office">Home Office</a-option-select>
                  <a-option-select value="Bedroom">Bedroom</a-option-select>
                  <a-option-select value="Office">Office</a-option-select>
                  <a-option-select value="Rest Room">Rest Room</a-option-select>
                </a-select>
                <!-- {{ room_design_type || 'Modern' }} -->
              </div>
              <div v-if="products_used"><strong>Products:</strong> <div>{{ products_used.length }} items</div></div>
            </div>
            <br>
          <a-label>
            Add Description
          </a-label>
          <a-textarea :rows="5" v-model:value="description_room" placeholder="describe the room here "></a-textarea>
          <a-button  :disabled="!description_room.trim()" block type="primary" size="large" style="margin-top:10px;padding: 8px 16px;" @click="Submit_Client_request()">Submit Request</a-button>
        </div>
      </div>
          


          <div
          >
          <a-row style="margin-bottom: 10px;">
            <a-col :span="20">
                <a-button type="primary" @click="open_SaveToMyDesignes=true" style="
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                height: auto;
                border-radius: 8px;" block>
                    Save To My Design
                </a-button>
            </a-col>
            <a-col :span="4" style="padding-left:5px">
                <a-button style="
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                height: auto;
                border-radius: 8px;" 
                                @click="toggleLikeRoom">
                  
                  
                <!-- Filled red heart when liked -->
<svg v-if="liked_room" width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.2518 24.4363C11.1484 22.2025 5 17.0956 5 12.5C5 9.46241 7.31579 7 10.5 7C12.15 7 13.8 7.52941 16 9.64704C18.2 7.52941 19.85 7 21.5 7C24.6842 7 27 9.46241 27 12.5C27 17.0956 20.8517 22.2025 17.7482 24.4363C16.7039 25.1879 15.2961 25.1879 14.2518 24.4363Z" 
          fill="#ff4d4f" 
          stroke="#ff4d4f" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
</svg>

<!-- Outline heart when not liked -->
<svg v-else width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.2518 24.4363C11.1484 22.2025 5 17.0956 5 12.5C5 9.46241 7.31579 7 10.5 7C12.15 7 13.8 7.52941 16 9.64704C18.2 7.52941 19.85 7 21.5 7C24.6842 7 27 9.46241 27 12.5C27 17.0956 20.8517 22.2025 17.7482 24.4363C16.7039 25.1879 15.2961 25.1879 14.2518 24.4363Z" 
          stroke="black" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
</svg>

                </a-button>
            </a-col>
            <!-- <a-col>
            </a-col> -->
        </a-row>

        <a-button type="default" block style="
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                height: auto;
                border-radius: 8px;">

            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14.5V4.5M12 14.5C11.2998 14.5 9.99153 12.5057 9.5 12M12 14.5C12.7002 14.5 14.0085 12.5057 14.5 12" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 16.5C20 18.982 19.482 19.5 17 19.5H7C4.518 19.5 4 18.982 4 16.5" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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

import { h } from "vue";

export default {
  name: "render_catalogue",
  components: {
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
      openSeeAll_used_products:false,
      liked_room:false,
      base_image_url: "",
      main_image: "",
      currentView: 'after',
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
      room_type: '',
      room_design_type: '',
      
      // Share form data
      shareForm: {
        title: '',
        selectedTags: []
      },
      
      // Tags data
      availableTags: [],
      popularTags: [],
      tagsLoading: false,
      tagSearchTimeout: null,
      
      // UI states
      shareLoading: false,
      description_room: '',
      tags_room: [],
      room_design_type_select: 'Modern',
      room_type_select: 'Living Room',
      open_SaveToMyDesignes: false,
      
      // Tag colors for random assignment
      tagColors: [
        '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
        '#13c2c2', '#eb2f96', '#fa8c16', '#a0d911', '#2f54eb'
      ]
    };
  },
  
  computed: {
    displayImage() {
      return this.currentView === 'before' ? this.main_image : this.base_image_url;
    }
  },
  
  mounted() {
    this.fetchRoom();
    this.FetchFinalResults();
    this.loadAvailableTags();
  },
  
  methods: {
    show_all_catalogue_products_used_in_room(){
      this.openSeeAll_used_products=true
    },
    showBefore() {
      this.currentView = 'before';
    },
    
    showAfter() {
      this.currentView = 'after';
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
        title: `My ${this.room_type || 'Room'} Design`,
        selectedTags: []
      };
    },

    async loadAvailableTags() {
      this.tagsLoading = true;
      try {
        const response = await fetch(`${this.$store.state.root_api}community/api/tags/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        if (data.success) {
          this.availableTags = data.data.map(tag => ({
            label: tag.name,
            value: tag.id,
            color: tag.color,
            post_count: tag.post_count
          }));
          
          this.popularTags = this.availableTags
            .sort((a, b) => (b.post_count || 0) - (a.post_count || 0))
            .slice(0, 10);
            
          this.addSuggestedTags();
        }
      } catch (error) {
        console.error('Failed to load tags:', error);
        this.$message.error('Failed to load tags');
      } finally {
        this.tagsLoading = false;
      }
    },
    
    addSuggestedTags() {
      const suggestedTags = [];
      
      if (this.room_type) {
        suggestedTags.push({
          label: this.room_type.toLowerCase().replace('_', ' '),
          value: `room_${this.room_type.toLowerCase()}`,
          color: this.getRandomTagColor(),
          isNew: true
        });
      }
      
      if (this.room_design_type) {
        suggestedTags.push({
          label: this.room_design_type.toLowerCase(),
          value: `style_${this.room_design_type.toLowerCase()}`,
          color: this.getRandomTagColor(),
          isNew: true
        });
      }

      suggestedTags.forEach(tag => {
        if (!this.availableTags.some(t => t.label === tag.label)) {
          this.availableTags.unshift(tag);
        }
      });
    },
    
    handleTagSearch(value) {
      if (this.tagSearchTimeout) {
        clearTimeout(this.tagSearchTimeout);
      }
      
      this.tagSearchTimeout = setTimeout(() => {
        if (value && !this.availableTags.some(tag => 
          tag.label.toLowerCase().includes(value.toLowerCase())
        )) {
          const newTag = {
            label: value,
            value: `new_${Date.now()}`,
            color: this.getRandomTagColor(),
            isNew: true
          };
          
          this.availableTags.unshift(newTag);
        }
      }, 500);
    },

    handleTagSelect(value, option) {
      console.log('Selected tag:', value, option);
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
        this.$message.error('Please enter a title for your post');
        return;
      }

      this.shareLoading = true;

      try {
        const tagIds = await this.createNewTags();

        const postData = {
          title: this.shareForm.title,
          room_id: this.$route.params.id,
          tag_ids: tagIds
        };

        const response = await fetch(`${this.$store.state.root_api}community/api/posts/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });

        const data = await response.json();

        if (data.success) {
          this.$message.success('Your design has been shared on community!');
          this.closeShareModal();
        } else {
          throw new Error(data.message || 'Failed to share post');
        }

      } catch (error) {
        console.error('Failed to share on community:', error);
        this.$message.error(error.message || 'Failed to share your design');
      } finally {
        this.shareLoading = false;
      }
    },

    async createNewTags() {
      const tagIds = [];
      
      for (const tagValue of this.shareForm.selectedTags) {
        const existingTag = this.availableTags.find(t => t.value === tagValue);
        
        if (existingTag && !existingTag.isNew) {
          tagIds.push(existingTag.value);
        } else {
          try {
            const tagName = existingTag ? existingTag.label : tagValue;
            const response = await fetch(`${this.$store.state.root_api}community/api/tags/`, {
              method: 'POST',
              headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: tagName,
                color: this.getRandomTagColor(),
                description: `Tag for ${tagName} designs`
              })
            });

            const data = await response.json();
            if (data.success) {
              tagIds.push(data.data.id);
            }
          } catch (error) {
            console.error('Failed to create tag:', error);
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

    handleImageError() {
      this.error.room = "Failed to load the room image";
    },

    handleImageLoad() {
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
            request: 'render_better_quality'
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (responseData && this.is_ready) {
          console.log("✅ Rendering started!");
          this.base_image_url = this.$store.state.root_media_api + responseData.final_image_output;
        } else {
          this.error.room = "Room is not ready yet. Please try again later.";
        }
      } catch (error) {
        console.error("❌ Failed to start rendering:", error);
        this.error.room = error.message;
        this.showError("Failed to Start Rendering", error.message);
      } finally {
        this.loading = false;
      }
    },

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
            request: 'save_to_my_designes',
            description_room: this.description_room,
            room_design_type_select: this.room_design_type_select,
            room_type_select: this.room_type_select,
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (responseData && this.is_ready) {
          this.$router.push('/business-dashboard/my-designs');
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
        return this.$message?.error('Please add some description to describe the room.', 3);
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
            request: 'submit_client_request',
            description_room: this.description_room,
            room_design_type_select: this.room_design_type_select,
            room_type_select: this.room_type_select,
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (responseData && this.is_ready) {
          this.$router.push('/business-dashboard/my-designs');
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
        return this.$message?.error('Please add some description to describe the room.', 3);
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
            request: 'business_staff_submit_client_request',
            description_room: this.description_room,
            room_design_type_select: this.room_design_type_select,
            room_type_select: this.room_type_select,
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (responseData && this.is_ready) {
          this.$router.push('/access-business/manage-customer-requests?brand=' + this.$route.query.brand);
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
            this.base_image_url = this.$store.state.root_media_api + responseData.data.image;
            this.main_image = this.$store.state.root_media_api + responseData.data.main_image;
            this.is_client_requested_room = responseData.data.is_client_requested_room;
            console.log("✅ Room data loaded:", this.base_image_url);
          } else {
            this.error.room = "Room is not ready yet. Please try again later.";
          }
        } else {
          this.error.room = "No room data found";
        }
      } catch (error) {
        console.error("❌ Failed to fetch room:", error);
        this.error.room = error.message;
        this.showError("Failed to Load Room", error.message);
      } finally {
        this.loading = false;
      }
    },
async toggleLikeRoom(){

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
            "id": roomId,
            "type":"room",
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
          console.log(" ====================  ====================  ==================== ")
          console.log(responseData)
          if (responseData) {
            this.liked_room=responseData.favorited
        }
        // if (responseData && responseData.data) {
        //   this.products_used = responseData.data.products_used || [];
        //   this.room_type = responseData.data.room_type || '';
        //   this.room_design_type = responseData.data.room_design_type || '';
        // }
      } catch (error) {
        console.warn("⚠️ Could not fetch final results:", error.message);
      } 
          console.log(" ====================  ====================  ==================== ")

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
          this.room_type = responseData.room_type || '';
          this.room_design_type = responseData.room_design_type || '';
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
  content: '';
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
    rgba(0,102,255,1) 0%,   /* bold vertical scanning line */
    rgba(0,102,255,0.4) 20%,
    rgba(0,102,255,0.3) 30%, /* fade tail after the bold line */
    rgba(0,102,255,0.2) 35%,
    rgba(0,102,255,0.15) 40%,
    rgba(0,102,255,0.10) 50%,
    rgba(0,102,255,0.0) 100%
  );
  animation: moveWaveLeftToRight 3s linear infinite,
             waveFade 3s ease-in-out infinite; /* fade control */
  z-index: 2;
}

@keyframes moveWaveLeftToRight {
  from { transform: translateX(-100%); }
  to   { transform: translateX(50%); }
}

@keyframes waveFade {
  0%   { opacity: 0; }   /* invisible before entering */
  10%  { opacity: 1; }   /* fade in */
  90%  { opacity: 1; }   /* stay visible */
  100% { opacity: 0; }   /* fade out before reset */
}

.loading-text {
  position: relative;
  color: #fff;
  text-align: center;
  z-index: 3;
  text-shadow: 0 2px 6px rgba(0,0,0,0.6);
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

</style>

