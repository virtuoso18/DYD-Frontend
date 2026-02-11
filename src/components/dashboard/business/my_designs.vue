<template>
  <div
    v-if="isLoading"
    class="spinner-sec w-full h-[80vh] flex justify-center items-center"
  >
    <a-spin tip="Loading..."> </a-spin>
  </div>

  <div
    v-else="!isLoading"
    class="sm:main sm:border border-gray-200 bg-white !mb-5 sm:translate-y-3 sm:rounded-2xl min-h-[100vh]"
  >
    <!-- TABS VIEW - Only show when view_type is 'all' -->
    <a-row v-if="view_type == 'all'">
      <a-col :span="24">
        <h2
          class="!px-3 !pt-3 sm:translate-y-2 sm:p-0 !font-[Poppins] font-medium text-[16px] leading-[24px] text-gray-700 tracking-[0]"
        >
          My Designes
        </h2>
      </a-col>

      <!-- TAB SECTION -->
      <a-col :span="24" style="padding: 10px 16px">
        <a-tabs v-model:activeKey="activeTab">
          <!-- ROOM DESIGNES TAB -->
          <a-tab-pane key="room_designes" tab="Room Designes">
            <!-- Empty State for Room Designes -->
            <a-col
              :span="24"
              v-if="my_designes.length === 0"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 80vh;
                text-align: center;
                padding: 60px 20px;
              "
            >
              <a-empty description="No room designs available yet">
                <template #description>
                  <p style="color: #666; font-size: 16px">
                    You haven't created any room designs yet.
                  </p>
                  <p style="color: #999; font-size: 14px">
                    Start creating your first room design!
                  </p>
                </template>
              </a-empty>
            </a-col>

            <!-- Room Designes List -->
            <a-row type="flex" :wrap="true" v-if="my_designes.length > 0">
              <a-col
                :lg="8"
                :md="12"
                :sm="24"
                :xs="24"
                style="padding: 0px 8px; display: flex; margin-bottom: 10px"
                v-for="design in my_designes"
                :key="design.id"
              >
                <div
                  class="cursor-pointer w-full"
                  style="
                    border: 2px solid rgba(0, 0, 0, 0.07);
                    border-radius: 14px;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden;
                  "
                >
                  <div class="h-9/10 relative" style="flex-shrink: 0">
                    <!-- Image Skeleton -->
                    <div
                      v-if="!imageLoadedMap[design.id]"
                      class="design-skeleton w-full h-[240px] rounded-lg"
                    ></div>

                    <!-- Community Post Tags -->
                    <div
                      v-if="
                        design.shared_on_community_my_design &&
                        design.community_posts &&
                        design.community_posts.length > 0
                      "
                    >
                      <div
                        class="tag-sec absolute left-2 top-1 flex gap-1 px-2 py-1"
                        style="z-index: 10; flex-wrap: wrap"
                      >
                        <div
                          class="px-2 py-1 bg-[#181A1B80] text-white rounded-md text-xs sm:text-sm"
                        >
                          {{ design.room_type }}
                        </div>
                        <div
                          class="px-2 py-1 bg-[#181A1B80] text-white rounded-md text-xs sm:text-sm"
                        >
                          {{ design.room_design_type }}
                        </div>
                      </div>

                      <div
                        class="view-count-sec absolute right-4 top-1 flex drop-shadow-md"
                        style="z-index: 10; gap: 1px"
                      >
                        <img
                          src="../../../assets/icons/eye.svg"
                          style="width: 32px; height: 28px"
                          alt=""
                        />
                        <span class="flex items-center text-white drop-shadow-md text-xs sm:text-sm">
                          {{ design.community_posts[0].view_count }}
                        </span>
                      </div>
                    </div>

                    <!-- Image -->
                    <img
                      v-if="design.image"
                      :src="$store.state.root_media_api + design.image"
                      :class="{ 'image-loaded': imageLoadedMap[design.id] }"
                      @load="onImageLoad(design.id)"
                      style="
                        width: 100%;
                        border-radius: 10px;
                        height: 240px;
                        object-fit: cover;
                      "
                      @click="handleImageClick(design)"
                      alt=""
                    />
                  </div>

                  <!-- Community Post Info -->
                  <div
                    v-if="
                      design.shared_on_community_my_design &&
                      design.community_posts &&
                      design.community_posts.length > 0
                    "
                    class="h-1/10 flex mx-4 sm:mx-6 my-4 sm:my-6 p-1"
                    style="flex-shrink: 0"
                  >
                    <div class="flex w-5/7 gap-2 items-center">
                      <img
                        class="w-6 h-6 rounded-full flex-shrink-0"
                        :src="
                          design.community_posts[0].profile_picture
                            ? $store.state.root_media_api +
                              design.community_posts[0].profile_picture
                            : '/default-avatar.png'
                        "
                        alt="Design Image"
                      />
                      <div class="text-sm sm:text-base truncate ml-2 sm:ml-3">
                        {{ design.community_posts[0].post_owner }}
                      </div>
                    </div>
                    <div class="flex justify-around w-2/7 items-center">
                      <div class="flex gap-1 items-center min-w-0">
                        <img
                          src="../../../assets/icons/commentIcon.svg"
                          alt=""
                          style="width: 16px; height: 16px; flex-shrink: 0"
                        />
                        <span class="text-xs sm:text-sm">
                          {{ design.community_posts[0].comment_count }}
                        </span>
                      </div>
                      <div class="flex gap-1 items-center min-w-0">
                        <HeartFilled
                          v-if="design.community_posts[0].is_liked"
                          style="color: #ff4d4f; font-size: 16px"
                        />
                        <HeartOutlined v-else style="font-size: 16px" />
                        <span class="text-xs sm:text-sm">
                          {{ design.community_posts[0].like_count }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Non-Community Post Tags -->
                  <div class="h-8 !mx-2" v-else>
                    <a-tag style="border: none; background: #F2F2F2">
                      Room : {{ design.room_type }}
                    </a-tag>
                    <a-tag style="border: none; background: #F2F2F2">
                      Style : {{ design.room_design_type }}
                    </a-tag>
                  </div>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>

          <!-- HOME DESIGNES TAB -->
          <a-tab-pane key="home_designes" tab="Home Designes" force-render>
            <!-- Empty State for Home Designes -->
            <a-col
              :span="24"
              v-if="home_designs.length === 0"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 80vh;
                text-align: center;
                padding: 60px 20px;
              "
            >
              <a-empty description="No home designs available yet">
                <template #description>
                  <p style="color: #666; font-size: 16px">
                    You haven't created any home designs yet.
                  </p>
                  <p style="color: #999; font-size: 14px">
                    Start creating your first home design!
                  </p>
                </template>
              </a-empty>
            </a-col>

            <!-- Home Designes Cards List -->
            <a-row type="flex" :wrap="true" v-if="home_designs.length > 0">
              <a-col
                :lg="8"
                :md="12"
                :sm="24"
                :xs="24"
                style="padding: 0px 8px; display: flex; margin-bottom: 10px"
                v-for="design in home_designs"
                :key="design.id"
              >
                <div
                  class="cursor-pointer w-full"
                  style="
                    border: 2px solid rgba(0, 0, 0, 0.07);
                    border-radius: 14px;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                  "
                  @click="showHomeDesignDetails(design)"
                  @mouseenter="$event.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'"
                  @mouseleave="$event.currentTarget.style.boxShadow = 'none'"
                >
                  <div class="h-8.59/10 relative" style="flex-shrink: 0">
                    <!-- Image Skeleton -->
                    <div
                      v-if="!imageLoadedMap[design.id]"
                      class="design-skeleton w-full h-[240px] rounded-lg"
                    ></div>

                    <!-- Home Design Tags -->
                    <div class="tag-sec absolute left-2 top-1 flex gap-1 px-2 py-1" style="z-index: 10">
                      <div class="px-2 py-1 bg-[#181A1B80] text-white rounded-md text-xs sm:text-sm">
                        {{ design.home_design_room_type || 'Room' }}
                      </div>
                      <div class="px-2 py-1 bg-[#181A1B80] text-white rounded-md text-xs sm:text-sm">
                        {{ design.home_design_room_style || 'Style' }}
                      </div>
                    </div>

                    <!-- Main Image -->
                    <img
                      v-if="design.image_0"
                      :src="$store.state.root_media_api + design.image_0"
                      :class="{ 'image-loaded': imageLoadedMap[design.id] }"
                      @load="onImageLoad(design.id)"
                      style="
                        width: 100%;
                        border-radius: 10px;
                        height: 240px;
                        object-fit: cover;
                      "
                      alt=""
                    />
                  </div>

                  <!-- Design Info -->
                  <div class="h-7.4 !mx-2 !my-2">
                    <a-tag style="border: none; background: #F2F2F2">
                      Type : {{ design.home_design_room_type }}
                    </a-tag>
                    <a-tag style="border: none; background: #F2F2F2">
                      Style : {{ design.home_design_room_style }}
                    </a-tag>
                  </div>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>

    <!-- ROOM DESIGN DETAILS VIEW -->
    <a-row v-if="view_type == 'room_details' && selected_design">
      <a-row>
        <div class="w-full flex p-3 justify-between items-center">
          <!-- Back Button -->
          <button
            @click="goback"
            class="flex items-center gap-2 !text-gray-700 text-lg hover:text-black cursor-pointer"
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
            <b>Back</b>
          </button>

          <!-- Right Side Buttons -->
          <div class="flex items-center gap-3 hide-below-md">
            <!-- Edit Button -->
            <button
              v-if="!start_edit"
              @click="edit_Design"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 border border-gray-300 cursor-pointer"
              style="
                font-family: var(--font-family-main);
                color: var(--text-color-secondary);
              "
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 20h9"></path>
                <path
                  d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"
                ></path>
              </svg>
              Edit
            </button>

            <!-- Delete Button -->
            <button
              @click="delete_Design"
              class="px-4 py-2 !text-red-600 hover:text-red-700 border rounded-md flex items-center gap-2 cursor-pointer"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_6921_12619)">
                  <path
                    d="M13.5938 3.75H1.40625C1.14375 3.75 0.9375 3.54375 0.9375 3.28125C0.9375 3.01875 1.14375 2.8125 1.40625 2.8125H13.5938C13.8562 2.8125 14.0625 3.01875 14.0625 3.28125C14.0625 3.54375 13.8562 3.75 13.5938 3.75Z"
                    fill="#E33827"
                  />
                  <path
                    d="M10.332 3.57344L9.91953 2.20469C9.89113 2.10732 9.83192 2.02179 9.75078 1.96094C9.66964 1.90008 9.57095 1.86719 9.46953 1.86719H5.53203C5.43061 1.86719 5.33192 1.90008 5.25078 1.96094C5.16964 2.02179 5.11043 2.10732 5.08203 2.20469L4.66953 3.57344L3.76953 3.30156L4.18203 1.93281C4.36016 1.33281 4.90391 0.929688 5.53203 0.929688H9.46953C10.0977 0.929688 10.632 1.33281 10.8195 1.93281L11.232 3.30156L10.332 3.57344Z"
                    fill="#E33827"
                  />
                  <path
                    d="M10.8086 14.0625H4.18984C3.43047 14.0625 2.81172 13.4625 2.78359 12.7031L2.46484 3.45L3.40234 3.42188L3.72109 12.675C3.72109 12.9281 3.93672 13.125 4.18984 13.125H10.818C11.0711 13.125 11.2773 12.9281 11.2867 12.675L11.6055 3.42188L12.543 3.45L12.2242 12.7031C12.1961 13.4625 11.5773 14.0625 10.818 14.0625H10.8086Z"
                    fill="#E33827"
                  />
                  <path
                    d="M6.09375 10.8945C5.83125 10.8945 5.625 10.6883 5.625 10.4258V6.67578C5.625 6.41328 5.83125 6.20703 6.09375 6.20703C6.35625 6.20703 6.5625 6.41328 6.5625 6.67578V10.4258C6.5625 10.6883 6.35625 10.8945 6.09375 10.8945ZM8.90625 10.8945C8.64375 10.8945 8.4375 10.6883 8.4375 10.4258V6.67578C8.4375 6.41328 8.64375 6.20703 8.90625 6.20703C9.16875 6.20703 9.375 6.41328 9.375 6.67578V10.4258C9.375 10.6883 9.16875 10.8945 8.90625 10.8945Z"
                    fill="#E33827"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_6921_12619">
                    <rect width="15" height="15" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Delete
            </button>
          </div>
        </div>

        <a-col :xs="24" :sm="24" :md="12" :lg="12" style="padding: 10px">
          <a-image
            :src="$store.state.root_media_api + selected_design.data.image"
            style="
              width: 100%;
              height: 100%;
              max-height: 700px;
              border-radius: 10px;
              object-fit: cover;
            "
            alt=""
          />
        </a-col>
        <a-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          style="padding: 10px"
          v-if="!start_edit"
        >
          <span
            style="
              font-family: var(--font-family-main);
              color: var(--text-color-secondary);
            "
          >
            {{ selected_design.data.room_description }}
          </span>
          <div class="flex gap-3" style="margin: 10px 0px">
            <div class="bg-gray-200 px-2 py-1 rounded-md text-gray-1000">
              {{ selected_design.data.room_type }}
            </div>
            <div class="bg-gray-200 px-2 py-1 rounded-md text-gray-1000">
              {{ selected_design.data.room_design_type }}
            </div>
          </div>
          <div class="control-button-sec hide-above-md flex gap-2">
            <a-button
              type="primary"
              @click="edit_Design"
              class="w-[193px] bg-[#3B63FB]"
              >Edit</a-button
            >
            <a-button
              type="primary"
              class="w-[193px] bg-[#E33827] flex items-center"
              danger
              @click="delete_Design"
            >
              Delete
            </a-button>

            <button
              v-if="start_edit"
              @click="save_Design"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer"
              style="
                font-family: var(--font-family-main);
                color: var(--text-color-secondary);
              "
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Save
            </button>

            <button
              v-if="start_edit"
              @click="close_Design"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 flex items-center gap-2 cursor-pointer"
              style="
                font-family: var(--font-family-main);
                color: var(--text-color-secondary);
              "
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Close
            </button>
          </div>

          <br />
          <br />
          <p
            style="
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 4px;
              color: #666;
            "
          >
            Created From
          </p>

          <router-link
            :to="'/' + selected_design.data.business_slug"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 6px 10px;
              border-radius: 6px;
              text-decoration: none;
              color: #333;
              font-weight: 600;
              transition: background 1.2s ease;
            "
          >
            <a-avatar
              :src="
                $store.state.root_media_api +
                selected_design.data.business_picture
              "
              style="flex-shrink: 0"
            />

            <span style="font-size: 15px; font-weight: 600">{{
              selected_design.data.business_name
            }}</span>
          </router-link>

          <div
            class="w-full max-w-xl mx-auto bg-gray-100 rounded-2xl border border-gray-200 !mt-4 p-6"
          >
            <!-- Header -->
            <div class="flex items-start gap-4 mb-6">
              <!-- Image -->
              <div class="flex-shrink-0">
                <img
                  :src="
                    $store.state.root_media_api +
                    selected_design.data.image
                  "
                  alt="Project"
                  class="w-24 h-18 rounded-lg object-fill"
                />
              </div>

              <!-- Text Content -->
              <div class="flex-1">
                <h2
                  class="text-xl font-bold text-gray-900 mb-2"
                  style="
                    font-family: var(--font-family-main);
                    color: var(--text-color-secondary);
                  "
                >
                  Share your project
                </h2>
                <p class="text-gray-600 text-sm leading-relaxed">
                  Tell your community about the project you created
                </p>
              </div>
            </div>

            <!-- Share Button -->
            <a-button
              type="primary"
              @click="shareOnCommunity"
              size="large"
              block
              style="
                margin-top: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
              "
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span
                class="text-white"
                style="font-family: var(--font-family-main)"
                >Share on community</span
              >
            </a-button>
          </div>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" style="padding: 10px" v-else>
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
            <a-textarea
              v-model:value="description_room"
              placeholder="Give your design an attractive descriptionhere ..."
              size="large"
              :rows="4"
              :maxlength="200"
              show-count
              style="border-radius: 8px"
            />
          </div>

          <div style="display: flex; gap: 15px; font-size: 14px; color: #666">
            <span
              ><strong>Style:</strong>
              <a-select v-model:value="room_design_type_select">
                <a-select-option value="Modern">Modern</a-select-option>
                <a-select-option value="Classic">Classic</a-select-option>
                <a-select-option value="Rustic">Rustic</a-select-option>
                <a-select-option value="Industrial">Industrial</a-select-option>
                <a-select-option value="Minimalist">Minimalist</a-select-option>
                <a-select-option value="Traditional">Traditional</a-select-option>
                <a-select-option value="Contemporary">Contemporary</a-select-option>
                <a-select-option value="Vintage">Vintage</a-select-option>
              </a-select>
            </span>
            <span
              ><strong>Room Type:</strong>
              <a-select v-model:value="room_type_select">
                <a-select-option value="Living Room">Living Room</a-select-option>
                <a-select-option value="Dinning Room">Dinning Room</a-select-option>
                <a-select-option value="Kitchen">Kitchen</a-select-option>
                <a-select-option value="Home Office">Home Office</a-select-option>
                <a-select-option value="Bedroom">Bedroom</a-select-option>
                <a-select-option value="Office">Office</a-select-option>
                <a-select-option value="Rest Room">Rest Room</a-select-option>
              </a-select>
            </span>
            <span v-if="selected_design.data.products_used"
              ><strong>Products:</strong>
              {{ selected_design.data.products_used.length }} items</span
            >
          </div>
          <div style="display: flex; gap: 15px; margin-top: 10px">
            <!-- Save Button -->
            <button
              v-if="start_edit"
              @click="save_Design"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer"
              style="
                font-family: var(--font-family-main);
                color: var(--text-white);
              "
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Save
            </button>

            <!-- Close Button -->
            <button
              v-if="start_edit"
              @click="close_Design"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 flex items-center gap-2 cursor-pointer"
              style="
                font-family: var(--font-family-main);
                color: var(--text-color-secondary);
              "
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Close
            </button>
          </div>
        </a-col>

        <a-col :span="24">
          <h3 class="px-4 my-4 text-[20px] text-[#1A1A1A]">
            Product used to create room
          </h3>
          <a-row>
            <a-col
              v-for="product in selected_design.data.products_used"
              :key="product.id"
              class="product-responsive"
              style="padding: 4px"
            >
              <div class="product" style="padding: 3px">
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

                <a-row>
                  <a-col
                    :span="24"
                    class="overflow-x-auto whitespace-nowrap hide-scrollbar"
                    style="max-width: 200px"
                  >
                    <b class="font-light !text-gray-700 inline-block">
                      {{ product.product_title }}
                    </b>
                  </a-col>

                  <a-col span="18" class="font-light !text-gray-700">
                    Color
                  </a-col>
                  <a-col span="6" style="display: flex; justify-content: end">
                    <div
                      v-for="(color, index) in product.product_colors.slice(
                        0,
                        2,
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
                    ></div>
                  </a-col>

                  <a-col class="!text-gray-700" span="12"> Price </a-col>

                  <a-col
                    class="!text-gray-700"
                    span="12"
                    style="
                      display: flex;
                      justify-content: end;
                      font-weight: 700;
                    "
                  >
                    ${{ product.product_price }}
                  </a-col>

                  <div class="flex items-center gap-2 w-full">
                    <!-- Product Details Button - 75% width -->
                    <div class="w-3/4">
                      <button
                        @click="goto_product_Route(product)"
                        class="w-full py-2 px-4 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap"
                        style="
                          font-family: Poppins, sans-serif;
                          font-size: 12px;
                        "
                      >
                        Product Details
                      </button>
                    </div>

                    <!-- Like Button - 25% width -->
                    <div class="w-1/4 flex items-end justify-end">
                      <button
                        @click="
                          toggleFavorite(
                            product.product_id,
                            product.product_type,
                            product,
                          )
                        "
                        class="bg-white !py-2.5 border border-gray-300 rounded hover:bg-gray-50 hover:border-blue-500 transition-colors flex items-center justify-center"
                        style="padding: 2px 12px"
                      >
                        <template v-if="product.is_favorited">
                          <HeartFilled style="color: red" />
                        </template>
                        <template v-else>
                          <HeartOutlined />
                        </template>
                      </button>
                    </div>
                  </div>
                </a-row>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-row>

    <!-- HOME DESIGN DETAILS VIEW (Image Gallery) - NEW LAYOUT -->
    <a-row v-if="view_type == 'home_design_details' && selected_home_design" class="w-full">
      <!-- Header with Back Button -->
      <a-col :span="24" class="!p-4">
        <div class="flex items-center justify-between mb-6">
          <!-- Back Button -->
          <button
            @click="goBackFromHomeDesign"
            class="flex items-center gap-2 !text-gray-700 text-lg hover:text-black cursor-pointer"
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
<h2          class="!p-4 sm:p-0 !font-[Poppins] font-medium text-[16px] leading-[24px] text-gray-700 tracking-[0]">Back</h2>
          </button>

          <!-- Regenerate Button -->
          <button 
            @click="regenerateImages"
            class="flex items-center justify-center !gap-2 !bg-blue-600 hover:!bg-blue-700 !text-white !px-5 !py-2 !rounded-lg !font-medium !text-sm transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 3.5C12.2 2.2 10.2 1.5 8 1.5C4.1 1.5 1 4.6 1 8.5C1 12.4 4.1 15.5 8 15.5C11.4 15.5 14.2 13.1 14.9 9.9"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
              />
              <path
                d="M11 1.5L13.5 3.5L11.5 6"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Regenerate
          </button>
        </div>
      </a-col>

      <!-- Main Large Image -->
      <a-col :span="24" class="!p-4">
  <div class="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
    <!-- Image Section - Left -->
    <div class="w-full lg:w-3/5 order-1">
      <div class="w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg mx-auto">
        <img
          :src="$store.state.root_media_api + mainHomeDesignImage"
          alt="Room Design"
          class="w-full h-auto max-h-[600px] object-cover"
        />
      </div>
    </div>

    <!-- Details Section - Right -->
    <div class="w-full lg:w-2/5 order-2 flex flex-col">
      <!-- Header Row -->
      <div class="bg-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-200 mb-6">
        <div class="flex flex-wrap justify-between items-start gap-4 mb-6">
          <h3 class="text-xl lg:text-2xl font-bold text-gray-900">Design Details</h3>
          <div class="flex gap-4 flex-wrap">
           
          </div>
        </div>

        <!-- All data in horizontal row -->
        <div class="flex flex-wrap gap-4 items-end">
          <div class="bg-white p-4 rounded-xl border border-gray-200 flex-1 min-w-[140px]">
            <p class="text-xs text-gray-500 mb-2 font-medium uppercase">Room Type</p>
            <p class="font-semibold text-gray-900">{{ selected_home_design.home_design_room_type }}</p>
          </div>
          <div class="bg-white p-4 rounded-xl border border-gray-200 flex-1 min-w-[140px]">
            <p class="text-xs text-gray-500 mb-2 font-medium uppercase">Design Style</p>
            <p class="font-semibold text-gray-900">{{ selected_home_design.home_design_room_style }}</p>
          </div>
          <div class="bg-white p-4 rounded-xl border border-gray-200 flex-1 min-w-[140px]">
            <p class="text-xs text-gray-500 mb-2 font-medium uppercase">Created At</p>
            <p class="font-semibold text-gray-900">{{ formatDate(selected_home_design.created_at) }}</p>
          </div>
          <div class="bg-white p-[22px] rounded-xl border border-gray-200 flex-1 min-w-[120px]">
            <p class="text-xs text-gray-500 mb-2 font-medium uppercase">Status</p>
            <a-tag
              v-if="selected_home_design.is_my_design_saved"
              color="green"
              class="!font-medium"
            >
              ✓ Saved
            </a-tag>
            <a-tag v-else color="default" class="!font-medium">Not Saved</a-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</a-col>


      <!-- Thumbnail Gallery -->
      <a-col :span="24" class="sm:!p-4">
        <div class="flex justify-start">
          <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2 max-w-3xl w-full px-2">
             <div
              v-if="selected_home_design.input_image"
              @click="mainHomeDesignImage = selected_home_design.input_image"
              :class="[
                'flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden border-3 cursor-pointer transition-all relative',
                mainHomeDesignImage === selected_home_design.input_image
                  ? 'border-blue-600 shadow-md'
                  : 'border-gray-300 hover:border-blue-400'
              ]"
            >
              <img
                :src="$store.state.root_media_api + selected_home_design.input_image"
                alt="Original Image"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <span class="text-white text-xs font-bold">Before</span>
              </div>
            </div>
            <!-- Image 0 -->
            <div
              v-if="selected_home_design.image_0"
              @click="mainHomeDesignImage = selected_home_design.image_0"
              :class="[
                'flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden border-3 cursor-pointer transition-all',
                mainHomeDesignImage === selected_home_design.image_0
                  ? 'border-blue-600 shadow-md'
                  : 'border-gray-300 hover:border-blue-400'
              ]"
            >
              <img
                :src="$store.state.root_media_api + selected_home_design.image_0"
                alt="Design Image 1"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Image 1 -->
            <div
              v-if="selected_home_design.image_1"
              @click="mainHomeDesignImage = selected_home_design.image_1"
              :class="[
                'flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden border-3 cursor-pointer transition-all',
                mainHomeDesignImage === selected_home_design.image_1
                  ? 'border-blue-600 shadow-md'
                  : 'border-gray-300 hover:border-blue-400'
              ]"
            >
              <img
                :src="$store.state.root_media_api + selected_home_design.image_1"
                alt="Design Image 2"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Image 2 -->
            <div
              v-if="selected_home_design.image_2"
              @click="mainHomeDesignImage = selected_home_design.image_2"
              :class="[
                'flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden border-3 cursor-pointer transition-all',
                mainHomeDesignImage === selected_home_design.image_2
                  ? 'border-blue-600 shadow-md'
                  : 'border-gray-300 hover:border-blue-400'
              ]"
            >
              <img
                :src="$store.state.root_media_api + selected_home_design.image_2"
                alt="Design Image 3"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Image 3 -->
            <div
              v-if="selected_home_design.image_3"
              @click="mainHomeDesignImage = selected_home_design.image_3"
              :class="[
                'flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden border-3 cursor-pointer transition-all',
                mainHomeDesignImage === selected_home_design.image_3
                  ? 'border-blue-600 shadow-md'
                  : 'border-gray-300 hover:border-blue-400'
              ]"
            >
              <img
                :src="$store.state.root_media_api + selected_home_design.image_3"
                alt="Design Image 4"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Input Image (Before) -->
           
          </div>
        </div>
      </a-col>

      <!-- Design Info Card -->
      <a-col :span="24"   class="!p-4">
          <a-col :span="24">
          <h3 class="px-4 my-4 text-[20px] text-[#1A1A1A]">
            Product used to create room
          </h3>
          <a-row>
            <a-col
              v-for="product in selected_home_design.products_used"
              :key="product.id"
              class="product-responsive"
              style="padding: 4px"
            >
              <div class="product" style="padding: 3px">
  <!-- ✨ FIXED: Added position relative and proper structure -->
  <div
    class="product-image-container"
    @click="viewProduct(product)"
    style="position: relative; overflow: hidden;"
  >
    <!-- ✨ Skeleton Loader -->
    <div
      v-if="!imageLoadedMap[product.product_id]"
      class="product-skeleton"
    ></div>

    <!-- ✨ Invisible Preloader -->
    <img
      :src="$store.state.root_media_api + product.product_image"
      style="position: absolute; width: 0; height: 0; opacity: 0"
      @load="onProductImageLoad(product.product_id)"
      alt=""
    />

    <!-- ✨ Actual Image with v-show -->
    <img
      v-show="imageLoadedMap[product.product_id]"
      :src="$store.state.root_media_api + product.product_image"
      :alt="product.product_title"
      class="product-image"
    />

    <!-- ✨ Badges - Only show after image loads -->
    <div 
      v-show="imageLoadedMap[product.product_id]"
      class="category-badge"
    >
      {{ product.category_name }}
    </div>
    
    <div 
      v-show="imageLoadedMap[product.product_id]"
      class="ar-badge"
    >
      AR
    </div>
  </div>

  <a-row class="p-2">
    <a-col
      :span="24"
      class="overflow-x-auto whitespace-nowrap hide-scrollbar"
      style="max-width: 200px"
    >
      <b class="font-light !text-gray-700 inline-block">
        {{ product.product_title }}
      </b>
    </a-col>

    <a-col span="18" class="font-light !text-gray-700">
      Color
    </a-col>
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
      ></div>
    </a-col>

    <a-col class="!text-gray-700" span="12"> Price </a-col>

    <a-col
      class="!text-gray-700"
      span="12"
      style="
        display: flex;
        justify-content: end;
        font-weight: 700;
      "
    >
      ${{ product.product_price }}
    </a-col>

    <div class="flex items-center gap-2 w-full">
      <!-- Product Details Button - 75% width -->
      <div class="w-3/4">
        <button
          @click="goto_product_Route_home_design(product)"
          class="w-full py-2 px-4 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap"
          style="
            font-family: Poppins, sans-serif;
            font-size: 12px;
          "
        >
          Product Details
        </button>
      </div>

      <!-- Like Button - 25% width -->
      <div class="w-1/4 flex items-end justify-end">
        <button
          @click="
            toggleFavorite(
              product.product_id,
              product.product_type,
              product,
            )
          "
          class="bg-white !py-2.5 border border-gray-300 rounded hover:bg-gray-50 hover:border-blue-500 transition-colors flex items-center justify-center"
          style="padding: 2px 12px"
        >
          <template v-if="product.is_favorited">
            <HeartFilled style="color: red" />
          </template>
          <template v-else>
            <HeartOutlined />
          </template>
        </button>
      </div>
    </div>
  </a-row>
</div>

            </a-col>
          </a-row>
        </a-col>

      
      </a-col>
    </a-row>

    <!-- Share On Community Modal -->
    <ShareOnCommunity
      :open="open_ShareOnCommunity"
      :imageUrl="selectedDesignImage"
      :roomId="selected_design?.data?.id || null"
      :roomType="selected_design?.data?.room_type"
      :roomDesignType="selected_design?.data?.room_design_type"
      :productCount="selected_design?.data?.products_used?.length || 0"
      :apiBaseUrl="$store.state.root_api"
      @success="handleShareSuccess"
      @update:close="closeShareOnCommunityModel"
    />

    <!-- Comments Modal -->
    <CommentsModal
      v-if="selectedPost"
      :isOpen="showCommentsModal"
      :post="selectedPost"
      @close="closeCommentsModal"
      @commentAdded="handleCommentAdded"
      @likeToggled="handleLikeToggled"
    />
  </div>
</template>

<script>
import {
  MoreOutlined,
  HeartOutlined,
  DeleteOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  CloseOutlined,
  HeartFilled,
} from "@ant-design/icons-vue";
import ShareOnCommunity from "@/views/catalogue/share_on_community.vue";
import CommentsModal from "@/views/pages/CommentsModal.vue";

export default {
  name: "my_designes",
  data() {
    return {
      // Room designes data
      my_designes: [],
      
      // Home designes data
      home_designs: [],
      selected_home_design: null,
      mainHomeDesignImage: "",

      // View states
      view_type: "all",
      activeTab: "room_designes",
      imageLoadedMap: {},

      // Room design details state
      selected_design: null,
      start_edit: false,
      description_room: "",
      room_design_type_select: "",
      room_type_select: "",

      // Community share state
      open_ShareOnCommunity: false,
      selectedDesignImage: "",
      selectedDesign: null,
      showCommentsModal: false,
      selectedPost: null,

      // Loading state
      isLoading: true,
    };
  },

  components: {
    MoreOutlined,
    HeartOutlined,
    DeleteOutlined,
    HeartFilled,
    EditOutlined,
    ArrowLeftOutlined,
    SaveOutlined,
    CloseOutlined,
    ShareOnCommunity,
    CommentsModal,
  },

  mounted() {
    this.loadMyDesignes();
    this.loadHomeDesigns();
  },

  methods: {
    async loadMyDesignes() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}engine/my-rendered-designes/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const result = await response.json();
        if (result) {
          this.my_designes = result.data || [];
        }
      } catch (error) {
        console.error("Error loading room designs:", error);
        this.$message.error("Network error while loading designs");
      }
    },

      onProductImageLoad(id) {
    this.imageLoadedMap[id] = false;
    setTimeout(() => {
      this.imageLoadedMap[id] = true;
    }, 2000);
  },

    async loadHomeDesigns() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}engine/home-designs/my-created/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const result = await response.json();
        if (result && result.data) {
          this.home_designs = result.data;
        }
      } catch (error) {
        console.error("Error loading home designs:", error);
      } finally {
        this.isLoading = false;
      }
    },

    showHomeDesignDetails(design) {
      this.selected_home_design = design;
      this.mainHomeDesignImage = design.image_0 || design.input_image || "";
      this.view_type = "home_design_details";
    },

    goBackFromHomeDesign() {
      this.view_type = "all";
      this.selected_home_design = null;
      this.mainHomeDesignImage = "";
    },

    regenerateImages() {
      this.$message.info("Regenerating images...");
    },

    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    onImageLoad(id) {
      this.imageLoadedMap[id] = true;
    },

    handleImageClick(design) {
      if (
        design.shared_on_community_my_design &&
        design.community_posts &&
        design.community_posts.length > 0
      ) {
        this.viewPost(design);
      } else {
        this.show_design_details(design.id);
      }
    },

    show_design_details(design_id) {
      this.view_type = "room_details";
      this.loadDesignDetails(design_id);
    },

    async loadDesignDetails(design_id) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}engine/my-rendered-designes/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              design_id: design_id,
              type: "design_details",
            }),
          },
        );
        const result = await response.json();
        this.selected_design = result;
        this.description_room = this.selected_design.data.room_description;
        this.room_design_type_select = this.selected_design.data.room_design_type;
        this.room_type_select = this.selected_design.data.room_type;
      } catch (error) {
        console.error("Error loading design details:", error);
      }
    },

    goback() {
      this.view_type = "all";
      this.selected_design = null;
    },

    edit_Design() {
      this.start_edit = true;
    },

    close_Design() {
      this.start_edit = false;
    },

    async save_Design() {
      if (!this.description_room.trim()) {
        this.$message.error("Please provide a room description");
        return;
      }
      if (!this.room_design_type_select) {
        this.$message.error("Please select a design style");
        return;
      }
      if (!this.room_type_select) {
        this.$message.error("Please select a room type");
        return;
      }

      this.isLoading = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}engine/my-rendered-designes/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              type: "save_design_details",
              design_id: this.selected_design.data.id,
              description_room: this.description_room.trim(),
              room_design_type_select: this.room_design_type_select,
              room_type_select: this.room_type_select,
            }),
          },
        );
        const responseData = await response.json();
        if (responseData.success || responseData.status === "success") {
          this.$message.success("Design updated successfully");
          this.selected_design.data.room_description = this.description_room.trim();
          this.selected_design.data.room_design_type = this.room_design_type_select;
          this.selected_design.data.room_type = this.room_type_select;
          this.start_edit = false;
          await this.loadMyDesignes();
        }
      } catch (error) {
        this.$message.error("Failed to save design changes");
      } finally {
        this.isLoading = false;
      }
    },

    async delete_Design() {
      this.$confirm({
        title: "Delete Design",
        content: "Are you sure you want to delete this design?",
        okText: "Yes, Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            const response = await fetch(
              `${this.$store.state.root_api}engine/my-rendered-designes/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Token ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  type: "delete_specific_design",
                  design_id: this.selected_design.data.id,
                }),
              },
            );
            const responseData = await response.json();
            if (responseData.success || responseData.status === "success") {
              this.$message.success("Design deleted successfully");
              this.view_type = "all";
              this.selected_design = null;
              await this.loadMyDesignes();
            }
          } catch (error) {
            this.$message.error("Failed to delete design");
          }
        },
      });
    },

    viewPost(design) {
      const firstPost = design.community_posts[0];
      this.selectedPost = {
        id: firstPost.id,
        title: firstPost.title,
        content: firstPost.content,
        image: this.$store.state.root_media_api + design.image,
        userName: firstPost.post_owner,
        userAvatar: this.$store.state.root_media_api + (firstPost.profile_picture || ""),
        description: firstPost.content || design.room_description || "",
        tags: [design.room_type, design.room_design_type],
        views: firstPost.view_count,
        likes: firstPost.like_count,
        is_liked: firstPost.is_liked || false,
        comment_count: firstPost.comment_count,
        post_image: this.$store.state.root_media_api + firstPost.post_image,
        created_at: firstPost.created_at,
        updated_at: firstPost.updated_at,
        apiBaseUrl: this.$store.state.root_api,
      };
      this.showCommentsModal = true;
    },

    closeCommentsModal() {
      this.showCommentsModal = false;
      this.selectedPost = null;
    },

    handleCommentAdded() {
      this.loadMyDesignes();
    },

    handleLikeToggled() {
      this.loadMyDesignes();
    },

    closeShareOnCommunityModel() {
      this.open_ShareOnCommunity = false;
    },

    async toggleFavorite(product_id, product_type, product) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.$message.warning("Please login to add favorites");
          return;
        }
        const response = await fetch(
          `${this.$store.state.root_api}likes/favorites/toggle/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              id: product_id,
              type: product_type,
            }),
          },
        );
        const data = await response.json();
        product.is_favorited = data.favorited;
        const message = data.favorited
          ? "Added to favorites"
          : "Removed from favorites";
        this.$message.success(message);
      } catch (error) {
        this.$message.error("Failed to update favorite");
      }
    },

    goto_product_Route(product) {
    
      let product_type = "product";
      if (product.product_type == "light") {
        product_type = "product";
      } else if (product.product_type == "floor_texture") {
        product_type = "floor";
      } else if (product.product_type == "wall_texture") {
        product_type = "wall";
      } else {
        product_type = product.product_type;
      }
      this.$router.push({
        name: "buisness_product",
        params: {
          buisness_name: this.selected_design.data.business_slug,
          product_type: product_type,
          product_id: product.product_id,
        },
      });
    },
goto_product_Route_home_design(product) {
    console.log(product);
      let product_type = "product";
      if (product.type == "light") {
        product_type = "product";
      } else if (product.type == "floor_texture") {
        product_type = "floor";
      } else if (product.type == "wall_texture") {
        product_type = "wall";
      } else {
        product_type = product.type;
      }
      this.$router.push({
        name: "buisness_product",
        params: {
          buisness_name: product.business_slug,
          product_type: product.type,
          product_id: product.product_id,
        },
      });
    },

    

    viewProduct(product) {
      console.log("Viewing product:", product);
    },

    shareOnCommunity() {
      if (!this.selected_design || !this.selected_design.data) {
        this.$message.error("Design data not available");
        return;
      }
      this.selectedDesignImage =
        this.$store.state.root_media_api + this.selected_design.data.image;
      this.selectedDesign = this.selected_design;
      this.open_ShareOnCommunity = true;
    },

    handleShareSuccess() {
      this.open_ShareOnCommunity = false;
      this.loadMyDesignes();
      if (this.selected_design && this.selected_design.data) {
        this.loadDesignDetails(this.selected_design.data.id);
      }
    },
  },
};
</script>

<style scoped>
.main {
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
  border: 1px solid rgba(128, 128, 128, 0.167);
  padding: 10px;
  background-color: white;
}

.design-skeleton {
  background: linear-gradient(110deg, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.6s infinite linear;
}

@keyframes skeleton-shimmer {
  to {
    background-position-x: -200%;
  }
}

.image-loaded {
  z-index: 5;
}

.product {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f3f2f4;
}

.product-image-container {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

/* Product Skeleton Shimmer */
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

/* Product Image Container */
.product-image-container {
  position: relative;
  width: 100%;
  min-height: 200px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Category and AR Badges */
.category-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  z-index: 10;
}

.ar-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  z-index: 10;
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

.no-scrollbar {
  scrollbar-width: none;      /* Firefox */
  -ms-overflow-style: none;   /* IE & Edge */
}

.no-scrollbar::-webkit-scrollbar {
  display: none;              /* Chrome, Safari */
}


.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
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

@media screen and (max-width: 768px) {
  .hide-below-md {
    display: none;
  }
}

@media screen and (min-width: 769px) {
  .hide-above-md {
    display: none;
  }
}
</style>