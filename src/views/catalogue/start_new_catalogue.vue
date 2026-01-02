<template>
  <div class="home-container">
    <!-- Loading Modal - Direct in DOM -->
    <Transition name="modal-fade">
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
        
        <!-- IMAGE PREVIEW SECTION -->
        <div v-if="pendingImage" class="mb-6">
          <img 
            :src="pendingImage.preview" 
            alt="Selected room"
            class="w-full h-64 object-cover rounded-xl shadow-lg mb-4"
          />
          
          <button 
            @click="changePendingImage"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors mb-3"
          >
            Change Image
          </button>

          <button 
            @click="processPendingImage"
            :disabled="uploadingModal"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <svg v-if="uploadingModal" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ uploadingModal ? 'Processing...' : 'Continue' }}
          </button>
        </div>

        <!-- UPLOAD INSTRUCTIONS SECTION -->
        <div v-else>
          <div class="border-2 border-dashed border-gray-300 rounded-xl p-5 mb-6">
            <div class="flex items-center gap-3 mb-4">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_7680_52365)">
                  <path d="M17.9362 14.8169C17.9362 15.2305 17.7719 15.6272 17.4794 15.9197C17.1869 16.2122 16.7902 16.3765 16.3766 16.3765H2.33991C1.92627 16.3765 1.52957 16.2122 1.23708 15.9197C0.944591 15.6272 0.780273 15.2305 0.780273 14.8169V6.23893C0.780273 5.82529 0.944591 5.42859 1.23708 5.1361C1.52957 4.84361 1.92627 4.67929 2.33991 4.67929H5.45917L7.01881 2.33984H11.6977L13.2573 4.67929H16.3766C16.7902 4.67929 17.1869 4.84361 17.4794 5.1361C17.7719 5.42859 17.9362 5.82529 17.9362 6.23893V14.8169Z" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.35852 13.2571C11.0812 13.2571 12.4778 11.8605 12.4778 10.1378C12.4778 8.4151 11.0812 7.01855 9.35852 7.01855C7.6358 7.01855 6.23926 8.4151 6.23926 10.1378C6.23926 11.8605 7.6358 13.2571 9.35852 13.2571Z" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
              </svg>
              <p class="text-[14px] text-gray-700">Upload the picture of your space here.</p>
            </div>

            <div class="flex items-center gap-3 mb-4">
              <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.21193 13.4677C2.81866 13.7015 1.75052 14.0482 1.16804 14.4559C0.585558 14.8635 0.520238 15.3101 0.981863 15.7284C1.44349 16.1467 2.40715 16.5141 3.72798 16.7755C4.41096 16.9107 5.17038 17.0137 5.97282 17.0817M12.387 13.4667C13.7812 13.7 14.8506 14.0465 15.4346 14.454C16.0186 14.8615 16.0856 15.3081 15.6256 15.7265C15.1655 16.1449 14.2032 16.5126 12.8834 16.7743C12.1989 16.9101 11.4373 17.0135 10.6325 17.0817M8.30265 7.13925V12.1958M8.30265 7.13925L13.3859 4.14732M8.30265 7.13925L3.21937 4.14732M7.87904 0.791234C8.14117 0.639901 8.46413 0.639901 8.72626 0.791234L13.3819 3.47914C13.644 3.63048 13.8055 3.91016 13.8055 4.21285V9.58867C13.8055 9.89136 13.644 10.171 13.3819 10.3224L8.72626 13.0103C8.46413 13.1616 8.14117 13.1616 7.87904 13.0103L3.22344 10.3224C2.96131 10.171 2.79983 9.89136 2.79983 9.58867V4.21285C2.79983 3.91016 2.96131 3.63048 3.22344 3.47914L7.87904 0.791234Z" stroke="#606367" stroke-width="1.35554" stroke-linecap="round"/>
              </svg>
              <p class="text-[14px] text-gray-700">Try our products in space</p>
            </div>

            <div class="flex items-center gap-3 mb-4">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.8169 2.33887H3.89948C3.03812 2.33887 2.33984 3.03714 2.33984 3.8985V14.8159C2.33984 15.6773 3.03812 16.3756 3.89948 16.3756H14.8169C15.6783 16.3756 16.3765 15.6773 16.3765 14.8159V3.8985C16.3765 3.03714 15.6783 2.33887 14.8169 2.33887Z" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.62871 7.79843C7.27473 7.79843 7.79843 7.27473 7.79843 6.62871C7.79843 5.98269 7.27473 5.45898 6.62871 5.45898C5.98269 5.45898 5.45898 5.98269 5.45898 6.62871C5.45898 7.27473 5.98269 7.79843 6.62871 7.79843Z" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16.3765 11.6969L12.4774 7.79785L3.89941 16.3758" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="text-[14px] text-gray-700">Clean the camera</p>
            </div>

            <div class="flex items-center gap-3 relative">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.57838 14.8159C12.0238 14.8159 14.8169 12.0228 14.8169 8.5774C14.8169 5.13195 12.0238 2.33887 8.57838 2.33887C5.13293 2.33887 2.33984 5.13195 2.33984 8.5774C2.33984 12.0228 5.13293 14.8159 8.57838 14.8159Z" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16.3776 16.3766L12.9854 12.9844" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.57812 6.23828V10.9172" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.23926 8.57715H10.9182" stroke="#606367" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="text-[14px] text-gray-700">Take the picture at 0.5 zoom.</p>
            </div>
          </div>

          <input 
            ref="fileInput"
            type="file" 
            accept=".png,.jpg,.jpeg"
            @change="handleModalFileUpload"
            class="hidden"
          />

          <button 
            @click="triggerFileUpload"
            :disabled="uploading"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 text-[14px] rounded-lg flex items-center justify-center gap-2 transition-colors mb-5"
          >
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_7680_52390)">
                <path d="M17.9362 21.0542C17.9362 21.4679 17.7719 21.8646 17.4794 22.157C17.1869 22.4495 16.7902 22.6138 16.3766 22.6138H2.33991C1.92627 22.6138 1.52957 22.4495 1.23708 22.157C0.944591 21.8646 0.780273 21.4679 0.780273 21.0542V12.4762C0.780273 12.0626 0.944591 11.6659 1.23708 11.3734C1.52957 11.0809 1.92627 10.9166 2.33991 10.9166H5.45917L7.01881 8.57715H11.6977L13.2573 10.9166H16.3766C16.7902 10.9166 17.1869 11.0809 17.4794 11.3734C17.7719 11.6659 17.9362 12.0626 17.9362 12.4762V21.0542Z" stroke="white" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.35755 19.4954C11.0803 19.4954 12.4768 18.0988 12.4768 16.3761C12.4768 14.6534 11.0803 13.2568 9.35755 13.2568C7.63482 13.2568 6.23828 14.6534 6.23828 16.3761C6.23828 18.0988 7.63482 19.4954 9.35755 19.4954Z" stroke="white" stroke-width="1.55963" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <path d="M22.8937 8.43H20.5683V10.7882H19.6403V8.43H17.3258V7.58936H19.6403V5.22027H20.5683V7.58936H22.8937V8.43Z" fill="white"/>
            </svg>
            Upload a picture
          </button>

          <div class="text-start">
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
          <img 
            v-if="selectedImage"
            :src="$store.state.root_media_api + selectedImage.image"
            alt="Selected room"
            class="w-full h-64 object-cover rounded-xl shadow-lg"
          />
        </div>

        <!-- Image Details -->
        <div class="px-6 mt-6">
          <!-- Detected Objects Header -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 !my-4">
            <h3 class="text-lg font-bold font-family-poppins text-gray-900 !mb-2">Detected Objects</h3>
            <p class="text-sm text-gray-600">
              Tap on any detected objects (green boxes) to replace or delete it.
            </p>
          </div>

          <!-- Project Stats -->
          <div class="!my-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-base font-bold font-family-poppins text-gray-900">Project Stats</h4>
              
              <div class="flex items-center gap-2">
                <svg width="37" height="16" viewBox="0 0 37 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="37" height="16.003" fill="url(#pattern0_9503_73952)"/>
<defs>
<pattern id="pattern0_9503_73952" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_9503_73952" transform="matrix(0.0019802 0 0 0.00478932 0.00495049 0.0162791)"/>
</pattern>
<image id="image0_9503_73952" width="500" height="202" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>

                <span class="text-[10px] font-semibold !font-family-poppins text-gray-700">
                  
                  
                  Aluma AI Catalog</span>
              </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-3 h-20 gap-3">
              <div class="bg-white rounded-xl  border border-gray-200 p-2 flex flex-col items-center justify-center text-center">
                <p class="text-2xl font-bold !font-family-poppins text-gray-900 leading-none ">{{ detectedObjects.length }}</p>
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
  
  <!-- Use This Room Button -->
  <button
    @click="useSelectedRoom"
    class="w-full mt-3 bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3.5 px-4 !mt-3 flex items-center justify-center gap-2 transition-colors"
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
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900"></h2>
        <button
          @click="closeDrawer"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="overflow-y-auto flex-1 p-6">
        <!-- Image Preview -->
        <img 
          v-if="selectedImage"
          :src="$store.state.root_media_api + selectedImage.image"
          alt="Selected room"
          class="w-full h-80 object-cover rounded-xl shadow-lg mb-6"
        />

        <!-- Detected Objects Header -->
        <div class="bg-white rounded-xl border border-gray-200 p-4 !my-4">
          <h3 class="text-lg font-bold text-gray-900 mb-2">Detected Objects</h3>
          <p class="text-sm text-gray-600">
            Tap on any detected objects (green boxes) to replace or delete it.
          </p>
        </div>

        <!-- Project Stats -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-base font-bold text-gray-900">Project Stats</h4>
            <span class="text-sm font-semibold text-gray-700">Aluma AI Catalog</span>
          </div>

          <div class="grid grid-cols-3 h-24 !font-family-poppins gap-4">
            <div class="bg-white rounded-xl  border border-gray-200 p-3 flex flex-col items-center justify-center text-center">
              <p class="text-3xl font-bold !font-family-poppins text-gray-900 leading-none mb-2">{{ selectedImage.objects_detected }}</p>
              <p class="text-sm text-gray-600">Objects</p>
            </div>
            <div class="bg-white rounded-xl  border border-gray-200 p-3 flex flex-col items-center justify-center text-center">
              <p class="text-3xl font-bold text-blue-600 leading-none mb-2">0</p>
              <p class="text-sm text-gray-600">Products</p>
            </div>
            <div class="bg-white rounded-xl  border border-gray-200 p-3 flex flex-col items-center justify-center text-center">
              <p class="text-3xl font-bold text-green-600 leading-none mb-2">0</p>
              <p class="text-sm text-gray-600">Replaced</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 !mt-12">
          <button
            @click="showObjectManagement = true"
            class="flex-1 bg-gray-200 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Manage Objects
          </button>
          <button
            @click="useSelectedRoom"
            class="flex-1 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
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
          <div 
            v-for="(obj, index) in selectedImage.binary_masks" 
            :key="obj.id"
            class="!mb-2 flex items-center justify-between bg-white shadow-sm rounded-xl px-4 hover:border-red-300 transition-colors"
          >
          {{index}}
          {{obj}}
            <div class="flex items-center gap-3">
              <div>
                <p class="font-semibold font-family-poppins pt-2 text-gray-900">{{ obj.name }}</p>
                <p class="text-sm text-gray-500">Confidence: {{ obj.confidence }}%</p>
              </div>
            </div>

            <button
              @click="removeObject(index)"
              class="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.125 5H1.875C1.525 5 1.25 4.725 1.25 4.375C1.25 4.025 1.525 3.75 1.875 3.75H18.125C18.475 3.75 18.75 4.025 18.75 4.375C18.75 4.725 18.475 5 18.125 5Z" fill="#E33827"/>
                <path d="M13.7734 4.76231L13.2234 2.9373C13.1856 2.80748 13.1066 2.69344 12.9984 2.6123C12.8903 2.53117 12.7587 2.4873 12.6234 2.4873H7.37344C7.23821 2.4873 7.10662 2.53117 6.99844 2.6123C6.89025 2.69344 6.8113 2.80748 6.77344 2.9373L6.22344 4.76231L5.02344 4.39981L5.57344 2.5748C5.81094 1.7748 6.53594 1.2373 7.37344 1.2373H12.6234C13.4609 1.2373 14.1734 1.7748 14.4234 2.5748L14.9734 4.39981L13.7734 4.76231Z" fill="#E33827"/>
                <path d="M14.4141 18.75H5.58906C4.57656 18.75 3.75156 17.95 3.71406 16.9375L3.28906 4.6L4.53906 4.5625L4.96406 16.9C4.96406 17.2375 5.25156 17.5 5.58906 17.5H14.4266C14.7641 17.5 15.0391 17.2375 15.0516 16.9L15.4766 4.5625L16.7266 4.6L16.3016 16.9375C16.2641 17.95 15.4391 18.75 14.4266 18.75H14.4141Z" fill="#E33827"/>
                <path d="M8.125 14.5254C7.775 14.5254 7.5 14.2504 7.5 13.9004V8.90039C7.5 8.55039 7.775 8.27539 8.125 8.27539C8.475 8.27539 8.75 8.55039 8.75 8.90039V13.9004C8.75 14.2504 8.475 14.5254 8.125 14.5254ZM11.875 14.5254C11.525 14.5254 11.25 14.2504 11.25 13.9004V8.90039C11.25 8.55039 11.525 8.27539 11.875 8.27539C12.225 8.27539 12.5 8.55039 12.5 8.90039V13.9004C12.5 14.2504 12.225 14.5254 11.875 14.5254Z" fill="#E33827"/>
              </svg>
            </button>
          </div>

          <!-- Empty state -->
          <div v-if="detectedObjects.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-500 font-medium">All objects removed!</p>
            <p class="text-sm text-gray-400 mt-1">Room is clean and ready</p>
          </div>
        </div>
      </div>

      <!-- Bottom Action Buttons -->
      <div class="px-4 py-4 border-t border-gray-200 bg-white space-y-3 md:rounded-b-2xl">
        <button
          @click="saveObjectChanges"
          class="w-full bg-blue-600 !font-family-poppins hover:bg-blue-700 !text-white font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-lg"
        >
          Save Changes
        </button>
        <button
          @click="showObjectManagement = false"
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-4 rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
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
      <p class="history-label pl-2"><a-spin v-if="loading_user_history_rooms" /> Your History </p>
      <div class="grid grid-cols-3 sm:grid-cols-3 gap-1 sm:gap-2 px-5 max-w-[1300px]">
        <div
          v-for="histry_card in your_history"
          :key="histry_card.id"
          class="p-[5px]"
        >
          <router-link
            :to="
              $route.query.brand
                ? (histry_card.brand ? `/update-catalogue/${histry_card.id}?brand=${histry_card.brand}` : `/update-catalogue/${histry_card.id}?brand=${$route.query.brand}`)
                : `/update-catalogue/${histry_card.id}`
            "
          >
            <img
              :src="$store.state.root_media_api + histry_card.image"
              alt="Example"
              class="example-image"
            />
          </router-link>
        </div>
      </div>

      <!-- Examples -->
      <!-- Examples Section -->
<p class="example-label !text-center pl-3 sm:pl-0">
  <a-spin v-if="loading_Example_rooms"/> or use an example image
</p>

<!-- Room Type Filter Tabs -->
<div class="px-1 sm:px-0 mb-4 max-w-[1300px] ">
  <div class="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
    <button
      v-for="roomType in roomTypes"
      :key="roomType.value"
      @click="selectedRoomType = roomType.value"
      :class="[
        'px-3 md:px-8 py-2 rounded-lg font-medium !font-family-poppins text-sm whitespace-nowrap transition-all',
        selectedRoomType === roomType.value
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700  hover:border-blue-400'
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
        @click="openImageDrawer(example)"
      >
        <img
          :src="$store.state.root_media_api + example.image"
          :alt="example.room_type || 'Room'"
          class="w-full h-32 sm:h-48 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
          :class="{ 'opacity-40': loading }"
        />
        <div v-if="loading" class="loader-overlay">
          <a-spin />
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

export default {
  components: {
    CloudUploadOutlined
  },
  
 data() {
  return {
    showLoadingModal: false,
    showInstructionsModal: false,
    showImageDrawer: false,
    showObjectManagement: false,
    selectedImage: null,
    detectedObjects: [],
    loading: false,
    loading_Example_rooms: true,
    loading_user_history_rooms: true,
    fileList: [],
    uploading: false,
    uploadResult: null,
    uploadError: null,
    your_history: [],
    exampleImages: [],
    
    // NEW: Room type filter
    selectedRoomType: 'all',
    roomTypes: [
      { label: 'Living room', value: 'living_room' },
      { label: 'Kitchen', value: 'kitchen' },
      { label: 'Bedroom', value: 'bedroom' },
      { label: 'Dining room', value: 'dining_room' }
    ],
    pendingImage: null,
      uploadingModal: false,
      fileInput: null
  };
},

computed: {
  filteredExampleImages() {
    if (this.selectedRoomType === 'all') {
      return this.exampleImages;
    }
    return this.exampleImages.filter(
      img => img.room_type === this.selectedRoomType
    );
  }
},


  
  mounted() {
    // const hasVisited = localStorage.getItem('hasVisitedHome');
    const hasVisited = false;
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
     // Trigger file upload from button
   

    openImageDrawer(image) {
      this.selectedImage = image;
      this.showImageDrawer = true;
      
      // Simulate detected objects - Replace with actual API call
      this.detectedObjects = [
        { id: 1, name: 'Sofa', confidence: 95 },
        { id: 2, name: 'Coffee Table', confidence: 88 },
        { id: 3, name: 'Lamp', confidence: 92 },
        { id: 4, name: 'Plant', confidence: 85 },
        { id: 5, name: 'Rug', confidence: 78 }
      ];
    },

    closeDrawer() {
      this.showImageDrawer = false;
      this.showObjectManagement = false;
      setTimeout(() => {
        this.selectedImage = null;
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
        this.startTestRoom(this.selectedImage.id);
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

    // triggerFileUpload() {
    //   if (!this.uploading) {
    //     this.$refs.fileInput.click();
    //   }
    // },
     triggerFileUpload() {
      if (!this.uploading && !this.uploadingModal) {
        this.$refs.fileInput.click();
      }
    },

   // Handle file selection from input
    async handleModalFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file
      const isValid = this.beforeUpload(file);
      if (!isValid) {
        this.$refs.fileInput.value = '';
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.pendingImage = {
          file: file,
          preview: e.target.result,
          fileName: file.name
        };
      };
      reader.readAsDataURL(file);

      // Reset file input
      this.$refs.fileInput.value = '';
    },


      // Handle sample image click
    async handleSampleClick() {
      if (this.exampleImages.length > 0) {
        this.showInstructionsModal = false;
        this.startTestRoom(this.exampleImages[0].id);
      }
    },
     // Process the pending image (fire API)
    async processPendingImage() {
      if (!this.pendingImage || !this.pendingImage.file) return;

      this.uploadingModal = true;

      try {
        const formData = new FormData();
        formData.append('base_image', this.pendingImage.file);

        if (this.$route.query.brand) {
          formData.append('business_owner', this.$route.query.brand);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000);

        const response = await fetch(
          this.$store.state.root_api + 'engine/new-room/',
          {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            },
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);
        const responseData = await response.json();

        if (response.ok && !responseData.error) {
          this.$message.success('Room processed successfully!');
          
          // Close modal
          this.showInstructionsModal = false;
          this.pendingImage = null;

          // Navigate to update catalogue
          if (this.$route.query.brand) {
            this.$router.push({
              name: 'update_catelogue',
              params: { id: responseData.room_id },
              query: { brand: this.$route.query.brand }
            });
          } else {
            this.$router.push({
              name: 'update_catelogue',
              params: { id: responseData.room_id }
            });
          }
        } else {
          const errorMsg = responseData.msg || `HTTP ${response.status}: Upload failed`;
          this.$message.error(errorMsg);
        }
      } catch (error) {
        console.error('Upload error:', error);

        let errorMessage = 'Upload failed';

        if (error.name === 'AbortError') {
          errorMessage = 'Upload timeout - file may be too large';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network error - please check your connection';
        } else {
          errorMessage = error.message || 'Unknown error occurred';
        }

        this.$message.error(errorMessage);
      } finally {
        this.uploadingModal = false;
      }
    },
 // Allow user to change selected image
    changePendingImage() {
      this.pendingImage = null;
      this.$refs.fileInput.click();
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
        const url = `${this.$store.state.root_api}room/api/start-example-room/${room_id}`;
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
:deep(.loading-modal-wrapper .ant-modal-content) {
  border-radius: 20px;
  padding: 40px 20px;
}

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
