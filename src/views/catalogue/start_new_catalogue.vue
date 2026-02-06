<template>
   <!-- Purchase Credits Modal -->
  <a-modal
    v-model:open="showCreditModal"
    title=""
    centered
    width="380px"
    footer=""
  >
    <div style="text-align: center; padding: 10px; border-radius: 12px">
      <!-- Icon wrapper -->
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          margin: 0 auto 18px auto;
          border-radius: 50%;
          background: rgba(59, 99, 251, 0.12);
        "
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20C15.523 20 20 15.523 20 10C20 4.477 15.523 0 10 0ZM10 1C10 3.38695 9.05179 5.67613 7.36396 7.36396C5.67613 9.05179 3.38695 10 1 10C3.38695 10 5.67613 10.9482 7.36396 12.636C9.05179 14.3239 10 16.6131 10 19C10 16.6131 10.9482 14.3239 12.636 12.636C14.3239 10.9482 16.6131 10 19 10C16.6131 10 14.3239 9.05179 12.636 7.36396C10.9482 5.67613 10 3.38695 10 1Z"
            fill="#3B63FB"
          />
        </svg>
      </div>

      <!-- Heading -->
      <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 10px">
        Insufficient Credits
      </h2>

      <!-- Message -->
      <p
        style="
          font-size: 15px;
          line-height: 1.5;
          color: #555;
          margin-bottom: 25px;
        "
      >
        {{ creditErrorMessage }}
      </p>
      <!-- CTA button -->
      <a-button v-if="currentUser.user_type!=='User'"
        type="primary"
        block
        size="large"
        style="height: 46px; font-size: 16px; border-radius: 8px"
        @click="goToPurchaseCredits"
      >
        Purchase Credits
      </a-button>
      
      <a-button v-else
        type="primary"
        block
        size="large"
        :loading="LoadingMessageButton"
        style="height: 46px; font-size: 16px; border-radius: 8px; display: flex;justify-content: center;align-items: center;"
        @click="startchat_with_buisness_user"
      >
        <MessageOutlined style="font-size: 16px;"/>
    Message Business
      </a-button>
    </div>
  </a-modal>


  <div class="home-container">
    <!-- Loading Modal - Direct in DOM -->
     <!-- Loading Modal - Direct in DOM --><Transition name="modal-fade">
      <div
        v-if="showLoadingModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;"
      >
        <div class="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-11/12 mx-4">
          <div class="flex flex-col items-center justify-center">
            <!-- Building SVG Icon -->
            <div class="mb-8 animate-pulse-slow">
              <svg width="120" height="136" viewBox="0 0 120 136" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_7680_52339)">
                  <path d="M32.6554 135.997H13.2641V95.3268L2.13775 98.2749V135.779H0V96.6333L13.2641 93.1325V83.0822L30.5176 78.1911V33.4841L76.1509 0V49.5646L95.155 55.0587V93.1157L120 102.831V135.779H117.862V104.272L95.155 95.3938V135.846H74.0132V84.8243L93.0173 92.2615V56.65L76.1509 51.7756V78.6936L63.3918 82.0772V135.913H42.553V87.5881L32.6554 90.2011V135.997ZM15.4019 133.87H30.5176V90.7707L15.4019 94.774V133.87ZM44.6907 133.769H61.2372V82.63L44.6907 87.0018V133.769ZM76.1509 133.719H93.0173V94.5563L76.1509 87.9566V133.719ZM15.4019 84.6903V92.563L30.5176 88.5596V80.4021L15.4019 84.6903ZM32.6554 79.7991V88.0068L42.553 85.3938V77.0018L32.6554 79.7991ZM44.6907 76.382V84.8075L61.2372 80.4356V71.6919L44.6907 76.382ZM63.375 68.8611V79.8661L73.9964 77.052V51.1559L44.6739 42.6801V74.171L63.375 68.8611ZM32.6554 34.5729V77.5881L42.553 74.774V39.8493L74.0132 48.9448V4.22111L32.6554 34.5729Z" fill="#0C0C0C"/>
                  <path d="M83.2037 48.9282L80.7461 48.1912L81.0659 3.38379L83.2037 5.51109V48.9282Z" fill="#0C0C0C"/>
                  <path d="M89.6173 50.6363L87.2607 49.782L87.4796 8.49219L89.6173 10.2007V50.6363Z" fill="#0C0C0C"/>
                </g>
                <defs>
                  <clipPath id="clip0_7680_52339">
                    <rect width="120" height="136" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            
            <p class="text-lg text-gray-700 mb-10 font-medium">Loading...</p>
            
            <div class="text-center">
              <p class="text-sm text-gray-500 mt-2 mb-2">Powered By</p>
              <h2 class="text-4xl font-bold text-black tracking-wider">D.Y.D</h2>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Instructions Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showInstructionsModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;"
        @click.self="showInstructionsModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative">
          <button
            @click="showInstructionsModal = false"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <div class="pt-12 px-3 pb-6">
            <h2 class="text-xl font-bold text-center mb-8"></h2>
            
            <div  v-if="!modalPreviewImage"  class="border-2 border-dashed border-gray-300 rounded-xl p-5 mb-6">
              <div class="flex items-center gap-3 mb-4">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_7680_52365)">
                    <path d="M17.9362 14.8169C17.9362 15.2305 17.7719 15.6272 17.4794 15.9197C17.1869 16.2122 16.7902 16.3765 16.3766 16.3765H2.33991C1.92627 16.3765 1.52957 16.2122 1.23708 15.9197C0.944591 15.6272 0.780273 15.2305 0.780273 14.8169V6.23893C0.780273 5.82529 0.944591 5.42859 1.23708 5.1361C1.52957 4.84361 1.92627 4.67929 2.33991 4.67929H5.45917L7.01881 2.33984H11.6977L13.2573 4.67929H16.3766C16.7902 4.67929 17.1869 4.84361 17.4794 5.1361C17.7719 5.42859 17.9362 5.82529 17.9362 6.23893V14.8169Z" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9.35852 13.2571C11.0812 13.2571 12.4778 11.8605 12.4778 10.1378C12.4778 8.4151 11.0812 7.01855 9.35852 7.01855C7.6358 7.01855 6.23926 8.4151 6.23926 10.1378C6.23926 11.8605 7.6358 13.2571 9.35852 13.2571Z" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_7680_52365">
                      <rect width="18.7156" height="18.7156" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <p class="text-[14px] !font-family-poppins text-gray-700">Upload the picture of your space here.</p>
              </div>

              <div class="flex items-center gap-3 mb-4">
                <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.21193 13.4677C2.81866 13.7015 1.75052 14.0482 1.16804 14.4559C0.585558 14.8635 0.520238 15.3101 0.981863 15.7284C1.44349 16.1467 2.40715 16.5141 3.72798 16.7755C4.41096 16.9107 5.17038 17.0137 5.97282 17.0817M12.387 13.4667C13.7812 13.7 14.8506 14.0465 15.4346 14.454C16.0186 14.8615 16.0856 15.3081 15.6256 15.7265C15.1655 16.1449 14.2032 16.5126 12.8834 16.7743C12.1989 16.9101 11.4373 17.0135 10.6325 17.0817M8.30265 7.13925V12.1958M8.30265 7.13925L13.3859 4.14732M8.30265 7.13925L3.21937 4.14732M7.87904 0.791234C8.14117 0.639901 8.46413 0.639901 8.72626 0.791234L13.3819 3.47914C13.644 3.63048 13.8055 3.91016 13.8055 4.21285V9.58867C13.8055 9.89136 13.644 10.171 13.3819 10.3224L8.72626 13.0103C8.46413 13.1616 8.14117 13.1616 7.87904 13.0103L3.22344 10.3224C2.96131 10.171 2.79983 9.89136 2.79983 9.58867V4.21285C2.79983 3.91016 2.96131 3.63048 3.22344 3.47914L7.87904 0.791234Z" stroke="#606367" stroke-width="1.35554" stroke-linecap="round"/>
                </svg>
                <p class="text-[14px] !font-family-poppins text-gray-700">Try our products in space</p>
              </div>

              <div class="flex items-center gap-3 mb-4">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.8169 2.33887H3.89948C3.03812 2.33887 2.33984 3.03714 2.33984 3.8985V14.8159C2.33984 15.6773 3.03812 16.3756 3.89948 16.3756H14.8169C15.6783 16.3756 16.3765 15.6773 16.3765 14.8159V3.8985C16.3765 3.03714 15.6783 2.33887 14.8169 2.33887Z" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.62871 7.79843C7.27473 7.79843 7.79843 7.27473 7.79843 6.62871C7.79843 5.98269 7.27473 5.45898 6.62871 5.45898C5.98269 5.45898 5.45898 5.98269 5.45898 6.62871C5.45898 7.27473 5.98269 7.79843 6.62871 7.79843Z" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16.3765 11.6969L12.4774 7.79785L3.89941 16.3758" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="text-[14px] !font-family-poppins text-gray-700">Clean the camera</p>
              </div>

              <div class="flex items-center gap-3 relative">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.57838 14.8159C12.0238 14.8159 14.8169 12.0228 14.8169 8.5774C14.8169 5.13195 12.0238 2.33887 8.57838 2.33887C5.13293 2.33887 2.33984 5.13195 2.33984 8.5774C2.33984 12.0228 5.13293 14.8159 8.57838 14.8159Z" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16.3776 16.3766L12.9854 12.9844" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.57812 6.23828V10.9172" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.23926 8.57715H10.9182" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="text-[14px] !font-family-poppins text-gray-700">Take the picture at 0.5 zoom.</p>
              </div>
            </div>
            
            <br>
            <!-- Hidden file input for modal -->
            <input 
              ref="modalFileInput"
              type="file" 
              accept=".png,.jpg,.jpeg"
              @change="handleModalFileUploadChange"
              class="hidden"
            />

            <!-- Show preview if image is selected, else show upload button -->
            <div v-if="!modalPreviewImage" class="space-y-3">
              <button 
                @click="triggerFileUpload"
                :disabled="uploading"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed !text-white font-medium py-3 px-4 text-[14px] !font-family-poppins rounded-lg flex items-center justify-center gap-2 transition-colors mb-5"
              >
                <svg v-if="uploading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>

                <svg v-else width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_7680_52390)">
                    <path d="M17.9362 21.0542C17.9362 21.4679 17.7719 21.8646 17.4794 22.157C17.1869 22.4495 16.7902 22.6138 16.3766 22.6138H2.33991C1.92627 22.6138 1.52957 22.4495 1.23708 22.157C0.944591 21.8646 0.780273 21.4679 0.780273 21.0542V12.4762C0.780273 12.0626 0.944591 11.6659 1.23708 11.3734C1.52957 11.0809 1.92627 10.9166 2.33991 10.9166H5.45917L7.01881 8.57715H11.6977L13.2573 10.9166H16.3766C16.7902 10.9166 17.1869 11.0809 17.4794 11.3734C17.7719 11.6659 17.9362 12.0626 17.9362 12.4762V21.0542Z" stroke="white" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9.35755 19.4954C11.0803 19.4954 12.4768 18.0988 12.4768 16.3761C12.4768 14.6534 11.0803 13.2568 9.35755 13.2568C7.63482 13.2568 6.23828 14.6534 6.23828 16.3761C6.23828 18.0988 7.63482 19.4954 9.35755 19.4954Z" stroke="white" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <path d="M22.8937 8.43H20.5683V10.7882H19.6403V8.43H17.3258V7.58936H19.6403V5.22027H20.5683V7.58936H22.8937V8.43Z" fill="white"/>
                  <defs>
                    <clipPath id="clip0_7680_52390">
                      <rect width="18.7156" height="18.7156" fill="white" transform="translate(0 6.23828)"/>
                    </clipPath>
                  </defs>
                </svg>

                {{ uploading ? 'Processing...' : 'Upload a picture' }}
              </button>

              <!-- <div class="text-start">
                <p class="text-xs text-center text-gray-500 mb-4">You don't have any pictures? - try our sample pictures</p>
                
                <div 
                  @click="handleSampleClick" 
                  class="inline-block cursor-pointer hover:scale-105 transition-transform"
                >
                  <img 
                    v-if="exampleImages.length > 0"
                    :src="$store.state.root_media_api + exampleImages[0].image" 
                    alt="Room 01" 
                    class="w-40 h-28 object-cover rounded-lg shadow-md mb-2"
                  />
                  <p class="text-sm font-medium text-gray-700">Room 01</p>
                </div>
              </div> -->
            </div>
            <!-- Preview state - show when image is selected -->
            <div v-else class="space-y-4">
              <!-- {{ !modalPreviewImage }} -->
              
              <img 
                :src="modalPreviewImage" 
                alt="Selected room"
                class="w-full h-48 object-cover rounded-xl shadow-lg"
              />
              
              <div class="bg-gray-50 rounded-xl p-4 text-center">
                <p class="text-sm text-gray-600 mb-2">Image selected and ready</p>
                <p class="text-xs text-gray-500">Size: {{ (modalFile?.size / 1024 / 1024).toFixed(2) }} MB</p>
              </div>

              <div class="space-y-2 flex gap-2">
                <button
                  @click="resetModalPreview"
                  class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 text-[14px] !font-family-poppins rounded-lg transition-colors"
                >
                  Change Room Image
                </button>

                <button
                  @click="saveAndContinue"
                  :disabled="uploading"
                  class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed !text-white font-semibold py-3 px-4 text-[14px] !font-family-poppins rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <svg v-if="uploading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ uploading ? 'Processing...' : 'Continue' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mobile Drawer (Hidden on desktop) -->
<Transition name="drawer-slide">
  <div
    v-if="showImageDrawer"
    class="fixed inset-0 z-[10000] md:hidden"
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;"
  >
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="closeDrawer"
    ></div>

    <!-- Drawer Content (Your existing mobile code) -->
    <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col">
      <!-- Drawer Handle -->
      <div class="flex justify-center py-3 border-b border-gray-200">
        <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
      </div>

      <!-- Scrollable Content -->
      <div class="overflow-y-auto flex-1 pb-6">
        <!-- Image Preview -->
        <div class="px-4 pt-4">
          
            <router-link :to="'/'+selectedImage.brand">
            <span class="text-sm font-semibold text-gray-700" style="font-weight:600;"><a-avatar size="18" style="border:1px solid rgba(0,0,0,0.2)" :src="this.$store.state.root_media_api+selectedImage.brand_banner"></a-avatar> {{selectedImage.brand_name}}</span>
          </router-link>
          <br>
          <br>
          <img 
            v-if="selectedImage"
            :src="$store.state.root_media_api + selectedImage.image"
            alt="Selected room"
            class="w-full h-64 object-cover rounded-xl shadow-lg"
          />
        </div>

        <!-- Image Details -->
        <div class="px-6 mt-6">
          <br>
                      <div class="flex items-center justify-between ">
              <h4 class="text-base font-bold font-family-poppins text-gray-900">Project Stats</h4>
            </div>
          <!-- Detected Objects Header -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 !my-4">
            <h3 class="text-lg font-bold font-family-poppins text-gray-900 !mb-2">Detected Objects</h3>
            <p class="text-sm text-gray-600">
              Tap on any detected objects (green boxes) to replace or delete it.
            </p>
          </div>

          <!-- Project Stats -->
          <div class="!my-4">


            <!-- Stats Cards -->
            <div class="grid grid-cols-3 h-20 gap-3">
              <div class="bg-white rounded-xl  border border-gray-200 p-2 flex flex-col items-center justify-center text-center">
                <p class="text-2xl font-bold !font-family-poppins text-gray-900 leading-none ">{{  selectedImage.objects_detected }}</p>
                <p class="text-xs !font-family-poppins text-gray-600">Objects</p>
              </div>
              <div class="bg-white rounded-xl  border border-gray-200 p-2 flex flex-col items-center justify-center text-center">
                <p class="text-2xl font-bold !font-family-poppins text-blue-600 leading-none ">0</p>
                <p class="text-xs font-family-poppins text-gray-600">Products</p>
              </div>
              <div class="bg-white rounded-xl border border-gray-200 p-2 flex flex-col items-center justify-center text-center">
                <p class="text-2xl font-bold !font-family-poppins text-green-600 leading-none">0</p>
                <p class="text-xs !font-family-poppins text-gray-600">Replaced</p>
              </div>
            </div>
          </div>

          <!-- Manage Objects Button -->
         <div className="gap-2">

  <button
    @click="showObjectManagement = true"
    class="w-full !mt-12 bg-[#F2F2F2] hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 18C3.71667 18 3.47934 17.904 3.288 17.712C3.09667 17.52 3.00067 17.2827 3 17C2.99934 16.7173 3.09534 16.48 3.288 16.288C3.48067 16.096 3.718 16 4 16H20C20.2833 16 20.521 16.096 20.713 16.288C20.905 16.48 21.0007 16.7173 21 17C20.9993 17.2827 20.9033 17.5203 20.712 17.713C20.5207 17.9057 20.2833 18.0013 20 18H4ZM4 13C3.71667 13 3.47934 12.904 3.288 12.712C3.09667 12.52 3.00067 12.2827 3 12C2.99934 11.7173 3.09534 11.48 3.288 11.288C3.48067 11.096 3.718 11 4 11H20C20.2833 11 20.521 11.096 20.713 11.288C20.905 11.48 21.0007 11.7173 21 12C20.9993 12.2827 20.9033 12.5203 20.712 12.713C20.5207 12.9057 20.2833 13.0013 20 13H4ZM4 8C3.71667 8 3.47934 7.904 3.288 7.712C3.09667 7.52 3.00067 7.28267 3 7C2.99934 6.71733 3.09534 6.48 3.288 6.288C3.48067 6.096 3.718 6 4 6H20C20.2833 6 20.521 6.096 20.713 6.288C20.905 6.48 21.0007 6.71733 21 7C20.9993 7.28267 20.9033 7.52033 20.712 7.713C20.5207 7.90567 20.2833 8.00133 20 8H4Z" fill="#333333"/>
  </svg>
  
    Manage Detected Objects
  </button>
  <br>
  <!-- {{showImageDrawer_test_room}} -->

  <!-- Use This Room Button -->
  <button
     v-if="showImageDrawer_test_room"
            @click="handleSampleClick"
                  class="w-full bg-blue-600 pt-3  !text-white hover:bg-blue-500 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"

  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>
    Use This Room
  </button>
  <button
     v-else
            @click="useSelectedRoom"
                  class="w-full bg-blue-600 pt-3  !text-white hover:bg-blue-500 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"

  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>
    Use This Room
  </button>
</div>
        </div>
      </div>
    </div>
  </div>
</Transition>

<!-- Desktop Modal (Hidden on mobile) -->
<Transition name="modal-fade">
  <div
    v-if="showImageDrawer"
    class="hidden md:flex fixed inset-0 z-[10000] items-center justify-center p-4"
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;"
    @click.self="closeDrawer"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Modal Header -->
      <div  class="flex items-center justify-between px-6 py-2 border-b border-gray-200">
            
                  <router-link :to="'/'+selectedImage.brand" v-if="!showImageDrawer_test_room">
                    <span   class="text-sm font-semibold text-gray-700" style="font-weight:600;gap:10px;display: flex;font-size: 18px;display: flex;align-items: center;"><a-avatar size="18" style="border:1px solid rgba(0,0,0,0.2)" :src="this.$store.state.root_media_api+selectedImage.brand_banner"></a-avatar> {{selectedImage.brand_name}}</span>
                  </router-link>
                  <span  v-else class="text-sm font-semibold text-gray-700" style="font-weight:600;gap:10px;display: flex;font-size: 18px;display: flex;align-items: center;"><img  style="border:1px solid rgba(0,0,0,0.2);width:35px;height:35px;border-radius:100%"  src="../../assets/apply_changes_img.png"/>DYD Example Room</span>
        <button
          @click="closeDrawer"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Two Column Layout -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Left Side - Image -->
        <div class="w-1/2 p-6 flex items-center justify-center bg-gray-50">
          <img 
            v-if="selectedImage"
            :src="$store.state.root_media_api + selectedImage.image"
            alt="Selected room"
            class="w-full h-full object-contain rounded-xl "
          />
        </div>
        <!-- {{ $store.state.root_media_api + selectedImage.image }} -->

        <!-- Vertical Divider -->
        <div class="w-px bg-gray-200"></div>

        <!-- Right Side - Content -->
        <div class="w-1/2 flex flex-col overflow-hidden">
          <!-- Scrollable Content Area -->
          <div class="flex-1 overflow-y-auto p-6">
            
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-base font-bold text-gray-900">Project Stats</h4>
                
                
              </div>

            <!-- Detected Objects Header -->
            <div class="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Detected Objects</h3>
              <p class="text-sm text-gray-600">
                Tap on any detected objects (green boxes) to replace or delete it.
              </p>
            </div>
<br>
            <!-- Project Stats -->
            <div class="mb-6">

              <div class="grid grid-cols-3 font-family-poppins gap-3">
                <div class="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col items-center justify-center text-center">
                  <p class="text-2xl font-bold text-gray-900 leading-none mb-1">{{ selectedImage.objects_detected }}</p>
                  <p class="text-xs text-gray-600">Objects</p>
                </div>
                <div class="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col items-center justify-center text-center">
                  <p class="text-2xl font-bold text-blue-600 leading-none mb-1">{{ selectedImage.used_products }}</p>
                  <p class="text-xs text-gray-600">Products</p>
                </div>
                <div class="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col items-center justify-center text-center">
                  <p class="text-2xl font-bold text-green-600 leading-none mb-1">0</p>
                  <p class="text-xs text-gray-600">Replaced</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons - Fixed at Bottom -->
          <div class="flex gap-2 px-6 py-4 border-t border-gray-200 bg-white space-y-3">
            <button 
              @click="showObjectManagement = true"
              class="w-full bg-gray-500 hover:bg-gray-700 !text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <!-- Manage Objects -->
              Show Objects
            </button>
            <!-- @click="useSelectedRoom" -->
            <!-- @click="useSelectedRoom" -->
             <!-- {{ showImageDrawer_test_room }} -->
            <button
            v-if="showImageDrawer_test_room"
            @click="handleSampleClick"

              class="w-full bg-blue-600 pt-3  !text-white hover:bg-blue-500 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Continue
            </button>
            <button
            v-else
            @click="useSelectedRoom"

              class="w-full bg-blue-600 pt-3  !text-white hover:bg-blue-500 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</Transition>



    <!-- Object Management Drawer (Slides from right) -->
   <Transition name="slide-right">
  <div
    v-if="showObjectManagement"
    class="fixed inset-0 z-[10001] flex items-center justify-center"
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;"
  >
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/60 backdrop-blur-sm"
      @click="showObjectManagement = false"
    ></div>

    <!-- Drawer/Modal Content -->
    <!-- Full width on mobile, centered modal on desktop -->
    <div class="absolute md:relative inset-y-0 md:inset-y-auto right-0 md:right-auto w-full  md:max-w-xl md:rounded-2xl bg-white shadow-2xl flex flex-col md:max-h-[85vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white sticky top-0 z-10 md:rounded-t-2xl">
        <h3 class="text-lg font-bold text-gray-900">Detected Objects</h3>
        <button
          @click="showObjectManagement = false"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Scrollable Objects List -->
      <div class="flex-1 overflow-y-auto px-4 pb-6">
        <div class="!mt-4 space-y-3">
         

          <!-- Empty state -->
          <div v-if="detectedObjects.length === 0" class="text-center flex flex-wrap justify-center">

            <!-- {{ this.$store.state.root_media_api }} -->
              <!-- <a-row >
                <a-col :span="12"    > --> 

                  <MaskOverlay
                    v-if = "selectedImage.binary_masks"
                    v-for="(obj, index) in selectedImage.binary_masks"
                    :selectedImage="selectedImage "
                    :maskPath="obj"
                    :title="index"
                    :key="obj.id"
                    :handleRemoveObject="removeObject"
                  />
                <!-- </a-col>
              </a-row> -->
          
          <div v-else>

            <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-500 font-medium">All objects removed!</p>
            <p class="text-sm text-gray-400 mt-1">Room is clean and ready</p>
          </div>
        </div>
        </div>
      </div>

      <!-- Bottom Action Buttons -->
      <!-- <div class="flex gap-2 px-4 py-4 border-t border-gray-200 bg-white space-y-3 md:rounded-b-2xl">
       
        <button
          @click="showObjectManagement = false"
          class="w-full bg-gray-200  hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-4 rounded-xl transition-colors"
        >
          Cancel
        </button>
         <button
          @click="saveObjectChanges"
          class="w-full bg-blue-600 !font-family-poppins hover:bg-blue-700 !text-white font-semibold py-3.5 px-4 rounded-xl transition-colors"
        >
          Save Changes
        </button>
      </div> -->
    </div>
  </div>
</Transition>


    <!-- Background video -->
    <div class="video-background">
      <video autoplay muted loop playsinline class="video-element">
        <source src="../../assets/GettyImages-1285221354.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Rest of your content... -->
    <div class="content-wrapper">
      <h1 class="main-heading">
        Create an AI Catalog with our<br />
        <span class="highlight">stunning Virtual Staging Technology</span>
      </h1>

      <!-- Upload Section -->
      <div class="upload-row px-2 sm:px-0">
        <a-upload-dragger
          v-model:fileList="fileList"
          name="base_image"
          :multiple="false"
          :beforeUpload="beforeUpload"
          :customRequest="customUpload"
          accept=".png,.jpg,.jpeg"
          class="upload-dragger"
          :disabled="uploading"
        >
          <div class="upload-dragger-inner">
            <p class="upload-instruction">Click or drag image to upload</p>
            <p class="upload-hint">PNG or JPEG only</p>
            <a-button type="primary" :loading="uploading">
              <CloudUploadOutlined style="font-size:20px;" />&nbsp; 
              {{ uploading ? 'Processing...' : 'Upload An Image' }}
            </a-button>
          </div>
        </a-upload-dragger>
      </div>

      <!-- History -->
       <div v-if="your_history.length">

      <p class="history-label pl-2"><a-spin v-if="loading_user_history_rooms" /> Your History </p>
      <div class="grid grid-cols-3 sm:grid-cols-3 gap-1 sm:gap-2 px-5 max-w-[1300px]">
       <div
  v-for="histry_card in your_history"
  :key="histry_card.id"
  class="p-[5px]"
>
  <div 
  @click="openImageDrawer(histry_card)" 
  class="cursor-pointer hover:opacity-80 transition-opacity"
>
  <div
    class="history-image-wrapper"
  >
    <!-- Skeleton -->
    <div
      v-if="!imageLoadedMap[histry_card.id]"
      class="history-image-skeleton"
    ></div>

    <!-- Preload image -->
    <img
      :src="$store.state.root_media_api + histry_card.image"
      style="position:absolute;width:0;height:0;opacity:0;"
      @load="onHistoryImageLoad(histry_card.id)"
      alt=""
    />

    <!-- Visible image -->
    <img
      v-show="imageLoadedMap[histry_card.id]"
      :src="$store.state.root_media_api + histry_card.image"
      alt="Example"
      class="example-image w-full !h-32 sm:!h-48 object-cover rounded-lg"
      style="display:block;"
    />

    <!-- Brand badge (unchanged, stays on top) -->
    <div
      v-if="histry_card.brand_banner"
      class="history-brand-badge"
    >
      <a-avatar :src="$store.state.root_media_api + histry_card.brand_banner"></a-avatar>
    </div>
  </div>
</div>

</div>

      </div>
       </div>

      <!-- Examples -->
      <!-- Examples Section -->
<p class="example-label !text-center pl-3 sm:pl-0">
  <a-spin v-if="loading_Example_rooms"/> Use an our example room image
</p>

<!-- Room Type Filter Tabs -->
<div class="flex justify-center mb-4">
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4">
    <button
      v-for="roomType in roomTypes"
      :key="roomType.value"
      @click="selectedRoomType = roomType.value"
      :class="[
        'px-4 md:px-8 py-2 rounded-lg font-medium !font-family-poppins text-sm whitespace-nowrap transition-all',
        selectedRoomType === roomType.value
          ? '!bg-blue-600 !text-white shadow-md'
          : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'
      ]"
    >
      {{ roomType.label }}
    </button>
  </div>
</div>

<!-- Example Images Grid -->
<div class="px-3 pb-6 sm:px-5 max-w-[1300px] mx-auto">
  
  <div class="grid grid-cols-3 gap-3 sm:gap-4">
    <div
      v-for="example in filteredExampleImages"
      :key="example.id"
      class="relative"
    >
     <div 
  class="image-wrapper cursor-pointer" 
  @click="openImageDrawer_test_room(example)"
>
  <div class="example-image-container">
    <!-- Skeleton -->
    <div
      v-if="!imageLoadedMap[example.id]"
      class="example-image-skeleton"
    ></div>

    <!-- Preload image -->
    <img
      :src="$store.state.root_media_api + example.image"
      style="position:absolute;width:0;height:0;opacity:0;"
      @load="onExampleImageLoad(example.id)"
      alt=""
    />

    <!-- Visible image -->
    <img
      v-show="imageLoadedMap[example.id]"
      :src="$store.state.root_media_api + example.image"
      :alt="example.demo_room_type || 'Room'"
      class="w-full h-32 sm:h-48 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
      :class="{ 'opacity-40': loading }"
    />

    <!-- Room Type Badge (stays on top) -->
    <div class="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold z-10">
      {{ example.demo_room_type }}
    </div>

    <!-- Existing spinner overlay (unchanged) -->
    <div v-if="loading" class="loader-overlay">
      <a-spin />
    </div>
  </div>
</div>

    </div>
  </div>

  <!-- Empty State -->
  <div v-if="filteredExampleImages.length === 0 && !loading_Example_rooms" class="text-center py-12">
    <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
    <p class="text-gray-500 font-medium">No {{ selectedRoomType }} images found</p>
  </div>
</div>

    </div>
  </div>
</template>


<script>
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import MaskOverlay from "@/components/update_catalogue/start_new_catalog/mask_overlay.vue"
import {   
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  ShareAltOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  PushpinOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue'

export default {
  components: {
    EyeOutlined,
        HeartOutlined,
        HeartFilled,
        MessageOutlined,
        ShareAltOutlined,
        MoreOutlined,
        EditOutlined,
        DeleteOutlined,
        PushpinOutlined,
        ArrowLeftOutlined,
        CloseOutlined,
    CloudUploadOutlined,
    MaskOverlay
  },
  
  data() {
    return {
      currentUser:JSON.parse(localStorage.getItem('user')),
      LoadingMessageButton:false,
      buid:null,
      showCreditModal: false,
      creditErrorMessage: "",

      showLoadingModal: false,
      showInstructionsModal: false,
      showImageDrawer: false,
      showObjectManagement: false,
      selectedImage: null,
      detectedObjects: [],
      loading: false,
      imageLoadedMap: {},
      loading_Example_rooms: true,
      loading_user_history_rooms: true,
      fileList: [],
      uploading: false,
      uploadResult: null,
      uploadError: null,
      your_history: [],
      exampleImages: [],
      
      // NEW: Modal file preview states
      modalPreviewImage: null,
      modalFile: null,
      showImageDrawer_test_room:false,
      
      // Room type filter
      selectedRoomType: 'all',
      roomTypes: [
        { label: 'All', value: 'all' },
        { label: 'Living room', value: 'Living room' },
        { label: 'Kitchen', value: 'Kitchen' },
        { label: 'Bedroom', value: 'Bedroom' },
        { label: 'Dining room', value: 'Dining room' }
      ]
    };
  },

  computed: {
   filteredExampleImages() {
    if (this.selectedRoomType === 'all') {
      return this.exampleImages;
    }
    // Filter by demo_room_type from API response
    return this.exampleImages.filter(
      img => img.demo_room_type === this.selectedRoomType
    );
  }
  },

  mounted() {
    const hasVisited = false
    console.log('Has visited before:', hasVisited);
    
    if (!hasVisited) {
      console.log('First time visit - showing modals');
      this.showLoadingModal = true;
      
      setTimeout(() => {
        console.log('Hiding loading, showing instructions');
        this.showLoadingModal = false;
        this.showInstructionsModal = true;
        localStorage.setItem('hasVisitedHome', 'true');
      }, 2000);
    }
    
    this.fetchExampleRooms();
    this.fetchUserHistoryRooms();
  },
  
  methods: {
  goToPurchaseCredits() {
      this.showCreditModal = false;
      this.$router.push("/pricing"); // or your actual route
    },
    async startchat_with_buisness_user() {
            const selectedUser = this.buid
            this.LoadingMessageButton=true
            const payload = JSON.stringify({
                type: 'DM',
                members: [this.currentUser.id, parseInt(selectedUser.id)],
                name: `${this.currentUser.first_name} & ${selectedUser.first_name}`,
            })
            try {
                const response = await fetch(`${this.$store.state.root_api}chat/chats`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Token ' + localStorage.getItem('token'),
                    },
                    body: payload,
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                const room = data.room || data

                // if (this.currentUser.user_type === 'User') {
                
                if (this.currentUser.user_type === 'User') {
                    this.$router.push({
                        path: '/user-dashboard/my-messages',
                        query: { chatId: data.room_id }
                    })
                }

                if (this.currentUser.user_type === 'Business' ) {
                    this.$router.push({
                        path: '/my-store/messages',
                        query: { chatId: data.room_id }
                    })
                }
                  if (this.currentUser.user_type === 'Professional') {
                    this.$router.push({
                        path: '/professional-dashboard/my-messages',
                        query: { chatId: data.room_id }
                    })
                }
                // }

            } catch (error) {
                console.error('Error creating/finding room:', error)
            }
            this.LoadingMessageButton=false
      },

    // NEW METHOD: Trigger modal file input
    triggerFileUpload() {
      if (!this.uploading) {
        this.$refs.modalFileInput.click();
      }
    },

    // NEW METHOD: Handle file selection from modal
    handleModalFileUploadChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      const isValid = this.beforeUpload(file);
      if (!isValid) {
        this.$refs.modalFileInput.value = '';
        return;
      }

      // Store file and create preview
      this.modalFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.modalPreviewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    // NEW METHOD: Reset preview and allow user to select another image
    resetModalPreview() {
      this.modalPreviewImage = null;
      this.modalFile = null;
      this.$refs.modalFileInput.value = '';
    },

     onHistoryImageLoad(id) {
    this.imageLoadedMap[id] = false;
    setTimeout(() => {
      this.imageLoadedMap[id] = true;
    }, 1000);
  },

   onExampleImageLoad(id) {
    this.imageLoadedMap[id] = false;
    setTimeout(() => {
      this.imageLoadedMap[id] = true;
    }, 1000);
  },

    // NEW METHOD: Save and continue - fires the API with the selected image
    async saveAndContinue() {
      if (!this.modalFile) {
        this.$message.error('Please select an image first');
        return;
      }

      this.uploading = true;
      
      try {
        const formData = new FormData();
        formData.append('base_image', this.modalFile);
        
        if (this.$route.query.brand) {
          formData.append('business_owner', this.$route.query.brand);
          console.log(this.$route.query.brand);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000);

        const response = await fetch(this.$store.state.root_api + 'engine/new-room/', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const responseData = await response.json();

        
        if (responseData.error) {
          this.showInstructionsModal = false
          this.creditErrorMessage = responseData.msg;
          this.showCreditModal = true;
          this.buid=responseData.buid;
          return;
        }

        if (response.ok && !responseData.error) {
          this.uploadResult = responseData;
          this.$message.success('Room processed successfully!');
          
          // Close the instructions modal
          this.showInstructionsModal = false;
          
          this.$emit('upload-success', responseData);
          
          // Navigate to update catalogue page
          if (this.$route.query.brand) {
            this.$router.push({ 
              name: 'update_catelogue',  
              params: { id: responseData.room_id },
              query: {
                brand: this.$route.query.brand,
              } 
            });
          } else {
            this.$router.push({ 
              name: 'update_catelogue', 
              params: { id: responseData.room_id } 
            });
          }
        } else {
          const errorMsg = responseData.msg || `HTTP ${response.status}: Upload failed`;
          this.uploadError = errorMsg;
          this.$message.error(errorMsg);
        }
      } catch (error) {
        console.error('Upload error:', error);
        
        let errorMessage = 'Upload failed';
        
        if (error.name === 'AbortError') {
          errorMessage = 'Upload timeout - file may be too large or processing is taking too long';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network error - please check your connection';
        } else {
          errorMessage = error.message || 'Unknown error occurred';
        }

        this.uploadError = errorMessage;
        this.$message.error(errorMessage);
      } finally {
        this.uploading = false;
      }
    },

    // EXISTING METHODS (Keep all your existing methods)
    openImageDrawer(historyCard) {
      this.selectedImage = historyCard;
      this.showImageDrawer = true;
      
      if (historyCard.detected_objects && historyCard.detected_objects.length > 0) {
        this.detectedObjects = historyCard.detected_objects;
      } else {
        // this.fetchDetectedObjects(historyCard.id);
        this.detectedObjects = [];
      }
    },
    openImageDrawer_test_room(historyCard) {
      this.selectedImage = historyCard;
      this.showImageDrawer = true;
      this.showImageDrawer_test_room = true;
      
      if (historyCard.detected_objects && historyCard.detected_objects.length > 0) {
        this.detectedObjects = historyCard.detected_objects;
      } else {
        // this.fetchDetectedObjects(historyCard.id);
        this.detectedObjects = [];
      }
    },
    async fetchDetectedObjects(roomId) {
      try {
        const url = `${this.$store.state.root_api}room/api/detected-objects/${roomId}/`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
          },
        });
        const data = await response.json();
        
        if (data && data.data) {
          this.detectedObjects = data.data;
        } else {
          this.detectedObjects = [];
        }
      } catch (error) {
        console.error("Failed to fetch detected objects:", error);
        this.detectedObjects = [];
      }
    },

    closeDrawer() {
      this.showImageDrawer = false;
      this.showImageDrawer_test_room=false;
      this.showObjectManagement = false;
      setTimeout(() => {
        this.selectedImage = null;
        this.detectedObjects = [];
      }, 300);
    },

    removeObject(index) {
      this.detectedObjects.splice(index, 1);
      this.$message.success('Object removed successfully!');
    },

    saveObjectChanges() {
      this.$message.success('Changes saved successfully!');
      this.showObjectManagement = false;
    },

    useSelectedRoom() {
      if (this.selectedImage) {
        this.showImageDrawer = false;
        
        if (this.$route.query.brand) {
          this.$router.push({ 
            name: 'update_catelogue', 
            params: { id: this.selectedImage.id },
            query: {
              brand: this.selectedImage.brand || this.$route.query.brand,
            } 
          });
        } else {
          this.$router.push({ 
            name: 'update_catelogue', 
            params: { id: this.selectedImage.id } 
          });
        }
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'Just now';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    },

    handleSampleClick(room_id) {
      this.showInstructionsModal = false;
     if (this.selectedImage) {
        this.showImageDrawer = false;
        this.startTestRoom(this.selectedImage.id);
      }
    },

    async fetchExampleRooms() {
      this.loading_Example_rooms = true;
      try {
        const url = `${this.$store.state.root_api}room/api/example-rooms/`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
          },
        });
        const data = await response.json();
        console.log(data);
        if (data && data.data) {
          this.exampleImages = data.data;
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        this.loading_Example_rooms = false;
      }
    },

    async startTestRoom(room_id) {
      console.log(room_id);
      this.loading = true;
      try {
        let url = `${this.$store.state.root_api}room/api/start-example-room/${room_id}`;
        if(this.$route.query.brand){
          url = `${this.$store.state.root_api}room/api/start-example-room/${room_id}?brand=${this.$route.query.brand}`;

        }
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
          },
        });
        const data = await response.json();
        console.log(data);
        if (data && data.data) {
          this.exampleImages = data.data;
          
          if (this.$route.query.brand) {
            this.$router.push({ 
              name: 'update_catelogue', 
              params: { id: this.exampleImages.id },
              query: {
                brand: this.$route.query.brand,
              } 
            });
          } else {
            this.$router.push({ 
              name: 'update_catelogue', 
              params: { id: this.exampleImages.id } 
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchUserHistoryRooms() {
      this.loading_user_history_rooms = true;
      try {
        const url = `${this.$store.state.root_api}room/api/user-history-rooms/`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
          },
        });
        const data = await response.json();
        console.log(data);
        if (data && data.data) {
          this.your_history = data.data;
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        this.loading_user_history_rooms = false;
      }
    },

    beforeUpload(file) {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size / 1024 / 1024 < 10;
      
      if (!isImage) {
        this.$message.error("Only image files allowed!");
        return false;
      }

      if (!isValidSize) {
        this.$message.error("Image must be smaller than 10MB!");
        return false;
      }

      this.uploadResult = null;
      this.uploadError = null;
      
      return true;
    },

    async customUpload({ file, onSuccess, onError }) {
      this.uploading = true;
      
      try {
        const formData = new FormData();
        formData.append('base_image', file);
        
        if (this.$route.query.brand) {
          formData.append('business_owner', this.$route.query.brand);
          console.log(this.$route.query.brand);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000);

        const response = await fetch(this.$store.state.root_api + 'engine/new-room/', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const responseData = await response.json();
        
        if (responseData.error) {
          this.creditErrorMessage = responseData.msg;
          this.showCreditModal = true;
          this.buid=responseData.buid;
          return;
        }
        
        
        if (response.ok && !responseData.error) {
          this.uploadResult = responseData;
          this.$message.success('Room processed successfully!');
          onSuccess(responseData);
          
          this.$emit('upload-success', responseData);
          
          if (this.$route.query.brand) {
            this.$router.push({ 
              name: 'update_catelogue',  
              params: { id: responseData.room_id },
              query: {
                brand: this.$route.query.brand,
              } 
            });
          } else {
            this.$router.push({ 
              name: 'update_catelogue', 
              params: { id: responseData.room_id } 
            });
          }
        } else {
          const errorMsg = responseData.msg || `HTTP ${response.status}: Upload failed`;
          this.uploadError = errorMsg;
          this.$message.error(errorMsg);
          onError(new Error(errorMsg));
        }
      } catch (error) {
        console.error('Upload error:', error);
        
        let errorMessage = 'Upload failed';
        
        if (error.name === 'AbortError') {
          errorMessage = 'Upload timeout - file may be too large or processing is taking too long';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network error - please check your connection';
        } else {
          errorMessage = error.message || 'Unknown error occurred';
        }

        this.uploadError = errorMessage;
        this.$message.error(errorMessage);
        onError(error);
      } finally {
        this.uploading = false;
      }
    },

    retryUpload() {
      if (this.fileList.length > 0) {
        const file = this.fileList[0];
        this.customUpload({
          file: file.originFileObj || file,
          onSuccess: () => {},
          onError: () => {}
        });
      }
    },

    resetUpload() {
      this.fileList = [];
      this.uploadResult = null;
      this.uploadError = null;
      this.uploading = false;
    }
  }
};
</script>


<style scoped>

  /* Loading Modal Styles */


.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.building-icon {
  margin-bottom: 30px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.loading-text {
  font-size: 18px;
  color: #333;
  margin-bottom: 40px;
  font-weight: 500;
}

.powered-by {
  text-align: center;
}

.powered-by p {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.powered-by h2 {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin: 0;
  letter-spacing: 2px;
}

/* Instructions Modal Styles */
:deep(.instructions-modal-wrapper .ant-modal-content) {
  border-radius: 16px;
  padding: 24px;
}

.instructions-content {
  padding: 10px;
}

.instructions-title {
  font-size: 20px;
  font-weight: 700;
  color: #000;
  margin-bottom: 24px;
  text-align: center;
}

.instruction-list {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  position: relative;
}

.instruction-item:last-child {
  margin-bottom: 0;
}

.icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #333;
  flex-shrink: 0;
}

/* Hide scrollbar for room type tabs */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Improve image wrapper */
.image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
}

.loader-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
}


.instruction-item p {
  margin: 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.badge {
  position: absolute;
  right: 0;
  background: #e91e63;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.upload-btn {
  background: #4361ee;
  border-radius: 8px;
  height: 48px;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 20px;
}

.upload-btn:hover {
  background: #3651d4;
}

.sample-section {
  text-align: center;
}

.sample-text {
  font-size: 13px;
  color: #666;
  margin-bottom: 16px;
}

.sample-image {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.sample-image:hover {
  transform: scale(1.02);
}


.history-image-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 200px;              /* match your image height */
  border-radius: 10px;
  overflow: hidden;
}

@media (max-width:450px) {

  .history-image-wrapper {

     height: 130px;
  }

}

.history-image-skeleton {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: history-shimmer 1.6s infinite linear;
}

@keyframes history-shimmer {
  to {
    background-position-x: -200%;
  }
}

.history-brand-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 2;
  color: white;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 6px;
}

/* BELOW 450px */
@media (max-width: 450px) {
  .history-brand-badge {
    bottom: 10px;
    padding: 4px 4px;
  }
}


.example-image-container {
  position: relative;
  width: 100%;
  height: 128px;        /* h-32 base */
  height: 192px;        /* sm:h-48 */
  border-radius: 12px;  /* rounded-xl */
  overflow: hidden;
}

.example-image-skeleton {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: example-shimmer 1.6s infinite linear;
}

@keyframes example-shimmer {
  to {
    background-position-x: -200%;
  }
}



.sample-image img {
  width: 160px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
}

.sample-label {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  margin: 0;
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Custom animation for loading icon */
@keyframes pulse-slow {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

/* Main Container */
.home-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #ffffff;
}

/* Background Video */
.video-background {
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
  z-index: 0;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* filter: brightness(0.6); */
}
.video-background::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 350px; /* More height for a smoother gradient */
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.8) 25%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  z-index: 1;
}

/* Foreground Content */
.content-wrapper {
  position: relative;
  z-index: 1;
  /* padding: 100px 20px 60px; */
  text-align: center;
  max-width: 1000px;
  margin: auto;
  margin-top:-250px;
  /* background: linear-gradient(to bottom, rgba(255,255,255,0.65) 10%, rgba(255,255,255,1) 90%); */
  /* backdrop-filter: blur(8px); */
}

/* Title */
.main-heading {
  font-size: 32px;
  font-weight: bold;
  color: #222;
  margin-bottom: 32px;
  line-height: 1.4;
}

.highlight {
  font-weight: 800;
  color: #111;
}

/* Upload Row */
.upload-row {
  display: flex;
  justify-content: center;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.upload-box {
  background: #ffffff;
  border: 2px dashed #ccc;
  border-radius: 14px;
  padding: 30px 20px;
  width: 340px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.upload-text {
  font-size: 13px;
  color: #444;
  margin-bottom: 12px;
}

.upload-text a {
  color: #007bff;
  text-decoration: none;
}

.upload-button {
  background-color: #2f54eb;
  color: white;
  padding: 10px 22px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.upload-button:hover {
  background-color: #1d39c4;
}

/* Action Buttons */
.action-btn {
  background: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.3s;
}

.action-btn:hover {
  background: #f0f0f0;
}

/* Example Images */
.example-label {
  
  font-size: 18px;
  margin-bottom: 20px;
  text-align:start;
  font-weight: 700;
  color: #444;
}



/* Example Images */
.history-label {
  font-size: 18px;
  margin-bottom: 20px;
  text-align:start;
  font-weight: 700;
  color: #444;
}
.example-images {
  display: grid;
  
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 0 20px;
  max-width: 1300px;
  margin: auto;
}

.example-image {
  width: 100%;
  height: 230px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  cursor: pointer;
}

@media (max-width: 510px) {
  .example-image {
    height: 100px;

  }
}


.example-image:hover {
  transform: scale(1.05);
}
.upload-dragger {

  background: #ffffff;
  border: 2px dashed #ccc;
  border-radius: 14px;
  width: 440px;
  padding: 10px;
  height: 180px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  transition: border 0.3s ease;
}

.upload-dragger:hover {
  border-color: #2f54eb;
}

.upload-dragger-inner {
    height:100%;
    /* text-align: center; */
  
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 10px;
  color: #2f54eb;
}

.upload-instruction {
  font-size: 14px;
  font-weight: 500;
  color: #444;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}









.image-wrapper {
  position: relative;
  width: 100%;
}

.example-image {
  width: 100%;
  border-radius: 10px;
  display: block;
  cursor: pointer;
}

.example-image.dimmed {
  opacity: 0.4;
  pointer-events: none;
}

.loader-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
}

</style>
