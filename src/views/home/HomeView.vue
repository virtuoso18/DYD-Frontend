<template>
  <div>
    <!-- main banner section -->
    <a-row>
      <a-col :sm="24" :xs="24" :md="24" :lg="24">
        <div
          class="!h-[600px] md:!h-[800px]"
          :style="{
            backgroundImage: `url(${bannerImage})`,
            backgroundPosition: 'center 60%',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',

            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }"
        >
          <div style="text-align: center">
            <div
              class="banner-text"
              style="
                border-radius: 10px;
                font-weight: 900;
                padding-top: 20px;
                margin-bottom: 24px;
              "
            >
              <div className="hidden md:block">
                <div
                  class="my-2 text-center tracking-[-0.02em]"
                  style="
                    font-family:
                      Proza Libre,
                      sans-serif;
                    font-weight: 700;
                    font-style: normal;
                    font-size: 44px;
                    line-height: 52px;
                  "
                >
    {{ t('line1') }}
                </div>

                <div
                  class="my-2 text-center tracking-[-0.02em]"
                  style="
      font-family: 'Proza Libre', sans-serif;
                    font-weight: 700;
                    font-style: normal;
                    font-size: 44px;
                    line-height: 52px;
                  "
                >
    {{ t('line2') }}
                </div>
              </div>


              <div className="md:hidden">
                <div
                  class="my-2 text-[32px] !font-bold text-[#111111] !text-center !tracking-[-0.02em]"
                  style="font-family: Proza Libre, sans-serif"
                >
                  {{ t("line1") }} {{ t("line2") }}
                </div>

                <div
                  class="hidden lg:block text-center text-2xl text-gray-600 my-2"
                >
                  {{ t("line2") }}
                </div>
              </div>

              <!-- <div class="md:hidden inline-flex items-center !mt-4 relative">
  <span class="bg-[#3b63fb] text-white px-8 py-3 rounded-lg font-bold !text-[28px] relative z-0 shadow-lg">
    DYD AI Technology
  </span>
  
  <span class="absolute -left-2 -bottom-3 text-white text-xl z-10 -rotate-12">✦</span>
  
  <span class="absolute -right-2 bottom-0 text-white !text-xl z-10 rotate-12">✦</span>
    <span class="absolute -right-3 bottom-4 text-white text-sm z-10 rotate-12">✦</span>

</div> -->
            </div>

            <a-button
              v-if="!isLogedIn"
              type="primary"
              size="large"
              style="
                position: relative;
                width: 210px;
                height: 64px;
                font-size: 28px;
              "
            >
              <span
                style="
                  position: absolute;
                  left: -10px;
                  bottom: -10px;
                  font-size: 23px;
                "
                >✦</span
              >
              <span
                style="
                  position: absolute;
                  top: 0px;
                  right: -5px;
                  font-size: 15px;
                "
                >✦</span
              >
              <span
                style="
                  position: absolute;
                  top: 15px;
                  right: 5px;
                  font-size: 30px;
                "
                >✦</span
              >
              Join Us
            </a-button>

            <br />

            <div
              className="hidden md:block"
              style="
                font-size: 16px;
                font-weight: 500;
                color: #111827;
                text-decoration: underline;
                transform: translateY(260px);
              "
              @click="handleAuthorizeClick('tryDemo')"
            >
              Click Try Demo
            </div>

            <div
              class="md:hidden text-base font-medium text-gray-900 underline md:translate-y-0 -translate-y-0 cursor-pointer"
              @click="handleAuthorizeClick('tryDemo')"
            >
              Click Try Demo
            </div>
          </div>
        </div>
      </a-col>
      <a-col :sm="24" :xs="24" :md="24" :lg="24">
        <div></div>
        <a-row :gutter="[10, 10]" style="width: 100%">
          <!-- First Card - 95% Cheaper -->
          <a-col
            :xs="12"
            :sm="12"
            :md="4"
            :lg="4"
            style="border-radius: 10px; padding-top: 20px; padding-left: 12px"
          >
            <div
              class="w-full h-[168px] bg-[#f9f9f9] border border-[#cccccc] rounded-[22px] flex flex-col items-center justify-center"
            >
              <h1
                class="card-number sm:!text-[48px] !text-[40px] font-semibold m-0"
              >
                95%
              </h1>
              <p class="card-label text-[16px] mt-2">Cheaper</p>
            </div>
          </a-col>

          <!-- Second Card - 10,000+ Users -->
          <a-col
            :xs="12"
            :sm="12"
            :md="4"
            :lg="4"
            style="border-radius: 22px; padding-top: 20px; padding-left: 5px"
          >
            <div
              style="
                background-color: #f9f9f9;
                width: 100%;
                height: 168px;
                border: 1px solid #cccccc;
                border-radius: 22px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <h1
                class="card-number sm:!text-[48px] !text-[40px]"
                style="margin: 0; font-weight: 600; white-space: nowrap"
              >
                10,000+
              </h1>
              <p class="card-label" style="font-size: 16px; margin: 8px 0 0 0">
                Users
              </p>
            </div>
          </a-col>

          <!-- Third Card - Features -->
          <a-col
            :xs="24"
            :sm="24"
            :md="16"
            :lg="16"
  class="rounded-[10px] pt-[2px] md:pt-[20px] pb-[40px] pr-0" style="padding-left: 12px"

          >
            <div
              style="
                width: 100%;
                height: 168px;
                background: #f9f9f9;
                border: 1px solid #cccccc;
                border-radius: 22px;
                display: flex;
                justify-content: space-around;
                align-items: center;
              "
            >
              <!-- Feature 1 -->
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  gap: 12px;
                "
              >
                <svg
                  width="43"
                  height="54"
                  viewBox="0 0 43 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.7727 19.6367L19.0089 22.977C20.6295 27.3571 21.4401 29.5471 23.0377 31.1447C24.6353 32.7423 26.825 33.5527 31.2052 35.1734L34.5455 36.4094L31.2052 37.6455C26.825 39.2662 24.6353 40.0766 23.0377 41.6742C21.4401 43.2718 20.6295 45.4618 19.0089 49.8419L17.7727 53.1822L16.5366 49.8419C14.9159 45.4618 14.1054 43.2718 12.5078 41.6742C10.9102 40.0766 8.72049 39.2662 4.34029 37.6455L1 36.4094L4.34029 35.1734C8.72049 33.5527 10.9102 32.7423 12.5078 31.1447C14.1054 29.5471 14.9159 27.3571 16.5366 22.977L17.7727 19.6367Z"
                    fill="black"
                    stroke="white"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M31.4355 0.5C31.648 0.5 31.837 0.634412 31.9072 0.834961L32.6855 3.06152C33.7211 6.02498 34.199 7.36003 35.1143 8.3291C36.0256 9.29383 37.2756 9.79574 40.0752 10.8926L42.1787 11.7158C42.3702 11.7909 42.496 11.976 42.4961 12.1816C42.4961 12.3874 42.3702 12.5724 42.1787 12.6475L40.0752 13.4717C37.2754 14.5686 36.0256 15.0703 35.1143 16.0352C34.199 17.0042 33.7211 18.3383 32.6855 21.3018L31.9072 23.5283C31.8371 23.729 31.6481 23.8633 31.4355 23.8633C31.223 23.8633 31.034 23.729 30.9639 23.5283L30.1855 21.3018C29.15 18.3383 28.6721 17.0042 27.7568 16.0352C26.8455 15.0703 25.5957 14.5686 22.7959 13.4717L20.6924 12.6475C20.5009 12.5724 20.375 12.3873 20.375 12.1816C20.3751 11.976 20.5009 11.7909 20.6924 11.7158L22.7959 10.8926C25.5955 9.79574 26.8455 9.2938 27.7568 8.3291C28.6721 7.36003 29.15 6.02498 30.1855 3.06152L30.9639 0.834961L30.9951 0.762695C31.0813 0.602674 31.2497 0.500022 31.4355 0.5Z"
                    fill="#3B63FB"
                  />
                </svg>
                <span style="font-size: 14px; font-weight: 500"
                  >Instant results</span
                >
              </div>

              <!-- Feature 2 -->
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  gap: 12px;
                "
              >
                <svg
                  width="58"
                  height="66"
                  viewBox="0 0 58 66"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M29 23.7732L57 38L29 52.2268L0.999995 38L29 23.7732Z"
                    fill="white"
                    stroke="black"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M29 13.7732L57 28L29 42.2268L0.999995 28L29 13.7732Z"
                    fill="white"
                    stroke="black"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M28.6562 2.83419C28.9151 2.73946 29.2042 2.75559 29.4531 2.88204L57.4531 17.1086C57.7886 17.2791 57.9998 17.6239 58 18.0002C58 18.3766 57.7886 18.7212 57.4531 18.8918L29.4531 33.1184C29.1685 33.263 28.8315 33.263 28.5469 33.1184L0.546875 18.8918C0.211422 18.7212 -2.03761e-08 18.3765 0 18.0002C0.000174813 17.6239 0.211404 17.2791 0.546875 17.1086L28.5469 2.88204L28.6562 2.83419Z"
                    fill="#3B63FB"
                  />
                </svg>
                <span style="font-size: 14px; font-weight: 500"
                  >Multi-view staging</span
                >
              </div>

              <!-- Feature 3 -->
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  gap: 12px;
                "
              >
                <svg
                  width="65"
                  height="46"
                  viewBox="0 0 65 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5742 41.8577H52.5971C55.5259 41.8577 58.3347 40.6802 60.4057 38.5843C62.4766 36.4884 63.6401 33.6458 63.6401 30.6817V23.0006C63.6401 21.3335 62.9857 19.7347 61.821 18.5559C60.6562 17.3771 59.0764 16.7148 57.4292 16.7148C55.782 16.7148 54.2022 17.3771 53.0374 18.5559C51.8727 19.7347 51.2183 21.3335 51.2183 23.0006V26.772C51.2183 27.4388 50.9566 28.0783 50.4907 28.5499C50.0248 29.0214 49.3929 29.2863 48.734 29.2863H16.4374C15.7785 29.2863 15.1466 29.0214 14.6807 28.5499C14.2148 28.0783 13.953 27.4388 13.953 26.772V23.0006C13.953 21.3335 13.2987 19.7347 12.1339 18.5559C10.9691 17.3771 9.38936 16.7148 7.74213 16.7148C6.09491 16.7148 4.51514 17.3771 3.35038 18.5559C2.18561 19.7347 1.53125 21.3335 1.53125 23.0006V30.6817C1.53125 33.6458 2.6947 36.4884 4.76566 38.5843C6.83661 40.6802 9.64543 41.8577 12.5742 41.8577Z"
                    stroke="black"
                    stroke-width="2"
                  />
                  <path
                    d="M57.4293 16.7143C57.4293 13.7914 57.4293 12.3331 57.1901 11.12C56.7109 8.68116 55.5278 6.44093 53.7905 4.68264C52.0531 2.92436 49.8395 1.727 47.4297 1.242C46.231 1 44.7901 1 41.9021 1H23.2694C20.3813 1 18.9404 1 17.7417 1.242C15.3319 1.727 13.1183 2.92436 11.381 4.68264C9.64364 6.44093 8.46053 8.68116 7.98131 11.12C7.74219 12.3331 7.74219 13.7914 7.74219 16.7143"
                    stroke="black"
                    stroke-width="2"
                  />
                  <path
                    d="M57.4293 45.0022V41.8594M7.74219 45.0022V41.8594"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
                <span style="font-size: 14px; font-weight: 500"
                  >Furniture removal</span
                >
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <!-- <catalog/> -->
    <!-- Unlock the potential section -->
    <a-row
      style="padding-left: 10px; padding-right: 10px; padding-bottom: 10px"
    >
      <a-col
        :span="24"
        style="
          font-size: 24px;
          font-weight: bold;
          margin: auto;
          width: 100%;
          text-align: center;
        "
      >
        <div class="banner-text">Unlock the potential of</div>
        <div class="banner-text !ml-1">
          <span
            style="
              background-color: #3b63fb;
              color: white;
              border-radius: 10px;
              padding-left: 10px;
              padding-right: 10px;
              font-weight: bold;
              position: relative;
            "
            >DYD
            <span
              style="
                color: #3b63fb;
                position: absolute;
                bottom: 15px;
                left: -20px;
                font-size: 20px;
              "
              >✦</span
            >
            <span
              style="
                color: black;
                position: absolute;
                bottom: -20px;
                left: -15px;
                font-size: 35px;
              "
              >✦</span
            >
          </span>
          for your needs.
        </div>
        <br />

        <div
          class="relative w-full max-w-[900px] rounded-xl overflow-hidden shadow-2xl"
          :style="{
            'max-height': '600px',
            'margin-left': imageContainerFullWidth ? '0' : 'auto',
            'margin-right': imageContainerFullWidth ? '0' : 'auto',
          }"
        >
          <!-- ORIGINAL IMAGE -->
          <img
            src="../../assets/homepagegenrated.png"
            class="w-full h-auto max-h-[600px] object-cover !rounded-md z-10"
            alt="Room image"
          />

          <!-- BINARY MASK OVERLAY (blue furniture) -->
          <img
            v-if="showFurnitureMask"
            src="../../assets/gen4.png"
            class="absolute inset-0 w-full -translate-x-[0.4%] h-full object-cover cursor-pointer mix-blend-multiply"
            style="filter: brightness(0.9) saturate(4.8)"
            @click="
              showProductModal = true;
              toggleImageContainerWidth();
            "
          />

          <!-- Product Selection Modal -->

          <!-- SHIMMER (MEDIUM z-30 - over image during processing) -->
          <!-- SHIMMER (MEDIUM z-30) -->
          <div
            v-if="isProcessing"
            :key="stepKey"
            class="absolute inset-0 animate-shimmer-overlay !z-30"
          ></div>

          <!-- PROCESS BUTTON (HIGH z-50 - always on top) -->
          <div className="hidden md:block">
            <a-button
              type="primary"
              @click="handleAuthorizeClick('processPhoto')"
              class="ai-glow-btn !absolute sm:!bottom-14 bottom-2 left-1/2 -translate-x-1/2 sm:w-[309px] sm:h-14 h-10 !z-10 !flex !items-center !justify-center gap-[2px] !border-none backdrop-blur-sm transition-all duration-500 group hover:text-gray-700"
              :class="{
                'animate-auto-glow opacity-90 scale-[0.98]': isProcessing,
              }"
            >
              <span
                class="text-white sm:font-semibold sm:text-base tracking-wide z-10 hover:text-gray-700"
              >
                Process photo
              </span>

              <img
                src="/ai-generative.svg"
                alt="AI"
                class="w-6 h-6 flex-shrink-0 z-10 group-hover:brightness-0 group-hover:invert"
              />
            </a-button>
          </div>

          <!-- DETECTING BUTTON (HIGHEST z-60) -->
          <!-- WRAPPER for button positioning -->
          <div
            class="absolute inset-0 flex items-center justify-center z-60 pointer-events-none"
          >
            <a-button
              v-if="isProcessing"
              type="primary"
              class="w-[280px] !h-10 bg-gradient-to-r from-gray-400 to-gray-500 animate-pulse-flash border-none text-white !text-lg !font-poppins rounded-2xl shadow-2xl backdrop-blur-lg flex items-center justify-center pointer-events-auto !mx-auto"
            >
              Detecting Furniture...
            </a-button>
          </div>
        </div>

        <div className="md:hidden !mt-4">
          <a-button
            type="primary"
            @click="handleAuthorizeClick('processPhoto')"
            class="ai-glow-btn !absolute sm:!bottom-14 bottom-2 left-1/2 -translate-x-1/2 w-full sm:h-14 h-10 !z-10 !flex !items-center !justify-center gap-[2px] !border-none backdrop-blur-sm transition-all duration-500 group hover:text-gray-700"
            :class="{
              'animate-auto-glow opacity-90 scale-[0.98]': isProcessing,
            }"
          >
            <span
              class="text-white sm:font-semibold sm:text-base tracking-wide z-10 hover:text-gray-700"
            >
              Process photo
            </span>

            <img
              src="/ai-generative.svg"
              alt="AI"
              class="w-6 h-6 flex-shrink-0 z-10 group-hover:brightness-0 group-hover:invert"
            />
          </a-button>
        </div>

        <div v-if="showProductModal" class="lg:hidden w-full !mt-2 z-30 pb-6">
          <div
            class="w-full !bg-[#f2f2f2] !rounded-3xl max-h-[380px] overflow-scroll no-scrollbar border border-gray-300 transform transition-all duration-300"
            :class="
              showProductModal
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-4'
            "
          >
            <!-- Mobile Header -->
            <div
              class="!px-6 !py-2 border-b border-gray-800 flex items-center justify-between"
            >
              <h2 class="!text-[16px] !font-poppins font-normal !text-gray-700">
                Select Product to replace
              </h2>
              <button
                @click="closeProductTab"
                class="!text-gray-700 hover:scale-105 !text-4xl leading-none"
              >
                ×
              </button>
            </div>

            <!-- 2-Grid Products -->
            <div class="!overflow-y-auto no-scrollbar !px-6 !py-4">
              <div class="grid grid-cols-2 gap-4">
                <div
                  v-for="(product, index) in products.slice(0, 4)"
                  :key="index"
                  class="bg-white !rounded-xl !p-3 border border-gray-300 hover:border-gray-400 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <div
                    class="w-full h-24 bg-white !rounded-lg overflow-hidden !mb-3"
                  >
                    <img
                      :src="product.image"
                      class="!w-full !h-full object-cover"
                    />
                  </div>
                  <h3 class="!text-gray-700 !text-sm !font-semibold !mb-1">
                    {{ product.name }}
                  </h3>
                  <p class="!text-gray-400 !text-xs !mb-2">
                    {{ product.color }}
                  </p>
                  <p class="!text-blue-500 !text-sm !font-bold">
                    {{ product.price }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />
      </a-col>
    </a-row>

    <!-- Unlock the potential section -->

    <a-row style="padding-left: 10px; background: #f2f2f2; padding-right: 10px">
      <a-col :span="24" style="max-width: 1200px; margin: auto; padding: 10px">
        <div>
          <br />
          <br />
          <br />

          <div
            style="color: black; margin: 0; padding: 0"
            class="banner-text !text-[26px] md:!text-[48px]"
          >
            The Smart Platform for Virtual Staging
          </div>
          <div
            style="color: black; margin: 0; padding: 0"
            class="banner-text !text-[26px] md:!text-[48px]"
          >
            and Realistic Home Design
          </div>
          <div
            style="color: black; margin: 0; padding: 0"
            class="banner-text !text-[26px] md:!text-[48px]"
          >
            Visualizations
          </div>
          <div
            class="text-[14px] md:text-[20px] !mt-4 text-[#333333] font-poppins font-normal leading-[20px] tracking-[0]"
          >
            DYD is an advanced AI platform for business owners, store owners,
            <br />interior designers, and architects, offering interactive,
            <br />personalized virtual staging visualizations to showcase
            products effectively.
          </div>
        </div>
      </a-col>
      <a-col :span="24" style="max-width: 1200px; margin: auto">
        <a-row>
          <a-col :sm="24" :xs="23" :md="12" :lg="12" class="pl-2">
            <br />
            <div
              style="
                border-radius: 20px;
                background-color: white;
                border: 2px dashed #b3b3b3;
                height: 220px;
                width: 100%;
                height: 70%;
                max-height: 300px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 18px;
                font-family: Poppins, sans-serif;
              "
            >
               <input
                type="file"
                ref="fileTryFree"
                accept="image/*"
                style="display: none"
                @change="handleHomeFileUpload"
                :key="fileRefKey"
              />
              <span v-if="!selectedFileDataTryFree"
                ><svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5333 4.70117V15.147M12.5333 4.70117C11.8019 4.70117 10.4353 6.78438 9.92188 7.31262M12.5333 4.70117C13.2647 4.70117 14.6314 6.78438 15.1448 7.31262"
                    stroke="black"
                    stroke-width="1.88285"
                    stroke-linecap="square"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M20.8929 17.2363C20.8929 19.829 20.3519 20.3701 17.7592 20.3701H7.31342C4.72078 20.3701 4.17969 19.829 4.17969 17.2363"
                    stroke="black"
                    stroke-width="1.88285"
                    stroke-linecap="square"
                    stroke-linejoin="round"
                  />
                </svg>
                <br />
                Drag & drop Image
              <br />
              <br />
              <a-button
                @click="handleHomeFileUploadTryFree"
                type="primary"
                class="font-poppins"
              >
                Click to upload
              </a-button>
              </span>
              <span v-else class="w-full h-full p-2 relative">
                <img :src="selectedFileDataTryFree" class="w-full h-full !mb-2 object-cover rounded-lg" alt=""/>
                <a-button type="primary" @click="handleHomeFileUploadTryFree" class="absolute bottom-16 left-[28%] sm:left-[30%] md:left-[40%]">Change Room Image</a-button>
                <!-- <button
                  class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed !text-white font-semibold py-3 px-4 text-[14px] !font-family-poppins rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <svg
                    class="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {{ uploading ? "Processing..." : "Continue" }}
                </button> -->
              
              </span>
            </div>
          </a-col>

          <a-col :sm="24" :xs="24" :md="12" :lg="12">
            <div className="md:pl-12">

              <div
                style="
                  border-radius: 20px;
                  height: 400px;
                  max-width: 450px;

                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  font-size: 18px;
                  padding: 0px;
                "
              >
                <p>or use an example image</p>
                <div class="">
                  <a-space
                    class="no-scrollbar overflow-x-auto sm:overflow-x-visible"
                    style="max-width: 350px"
                  >
  
                    <a-button class="!px-2 !py-1 text-sm">
                      Living Room
                    </a-button>
  <a-button class="!px-1 !py-1 text-sm">
        Kitchen</a-button>
      <a-button class="!px-1 !py-1 text-sm">
  
        
        Bedroom</a-button>
                    <a-button class="!px-2 !py-1 text-sm">
  
        Dianing Room</a-button>
     <a-button class="!px-2 !py-1 text-sm">
  
        Outdoor</a-button>
                  </a-space>
                </div>

                <br />
<div class="flex gap-[10px] overflow-x-auto md:overflow-x-visible w-full">

                  <img
                    src="../../assets/home_main_banner.jpg"
                    style="border-radius: 10px; width: 124px; height: 91px"
                    alt=""
                  />
                  <img
                    src="../../assets/home_main_banner.jpg"
                    style="border-radius: 10px; width: 124px; height: 91px"
                    alt=""
                  />
                  <img
                    src="../../assets/home_main_banner.jpg"
                    style="border-radius: 10px; width: 124px; height: 91px"
                    alt=""
                  />
                  <img
                    src="../../assets/home_main_banner.jpg"
                    style="border-radius: 10px; width: 124px; height: 91px"
                    alt=""
                  />
                </div>
                <br />
                <div className=" w-full md:pl-18">
                  <a-button
                    @click="handleTryFreeNavigateSimulation"
                    type="primary"
                    block
                    style="
                      height: 48px;
                      background-color: #3b63fb;
                      font-family: Poppins, sans-serif;
                    "
                    >Try For Free</a-button
                  >
                  <h6
                    class="text-[12px] text-center text-[#333333] font-poppins font-normal !mt-[20px]"
                  >
                    No credit card Needed
                  </h6>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <br />
    <a-row style="background: #3b63fb; height: 300px">
      <a-col
        :sm="12"
        :xs="12"
        :md="6"
        :lg="6"
        style="
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        "
      >
        <div class="banner-text" style="color: white">30+</div>
        <h3>Partnered Brands</h3>
        <svg
          width="35"
          height="35"
          viewBox="0 0 35 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.5 2.91797C14.4769 2.91797 10.0369 3.74514 9.17292 7.13526C8.40831 10.1353 8.58613 12.2802 10.4907 14.8277L21.7109 29.8363C22.8397 31.3461 23.4042 32.1011 24.1685 32.0843C24.933 32.0676 25.4624 31.2887 26.5213 29.7307L27.2923 28.5963C28.6159 26.6487 29.2778 25.6748 29.1514 24.6223C29.0251 23.5699 28.1508 22.7735 26.4021 21.1807L9.91537 5.83464"
            stroke="white"
          />
          <path
            d="M17.4948 2.91797C20.5178 2.91797 24.9578 3.74514 25.8219 7.13526C26.5865 10.1353 26.4087 12.2802 24.5041 14.8277L22.5053 17.5013M25.0794 5.83464L17.4948 12.8945M17.4948 24.2037L13.2838 29.8363C12.155 31.3461 11.5906 32.1011 10.8262 32.0843C10.0618 32.0676 9.53239 31.2887 8.47357 29.7307L7.70256 28.5963C6.37891 26.6487 5.71704 25.6748 5.84338 24.6223C5.96971 23.5699 6.84404 22.7735 8.5927 21.1807L12.5456 17.5013"
            stroke="white"
          />
        </svg>
      </a-col>
      <a-col
        :sm="12"
        :xs="12"
        :md="6"
        :lg="6"
        style="
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        "
      >
        <div class="banner-text" style="color: white">2020</div>
        <h3>Ecommerce Since</h3>
        <svg
          width="35"
          height="35"
          viewBox="0 0 35 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.6667 23.3346H22.2588C28.8033 23.3346 29.7986 19.2233 31.0056 13.227C31.3539 11.4975 31.528 10.6327 31.1093 10.0566C30.6906 9.48047 29.8881 9.48047 28.2831 9.48047H8.75"
            stroke="white"
            stroke-width="1.25"
            stroke-linecap="round"
          />
          <path
            d="M11.6615 23.3346L7.83877 5.12724C7.51418 3.82883 6.34755 2.91797 5.0092 2.91797H3.64062"
            stroke="white"
            stroke-width="1.25"
            stroke-linecap="round"
          />
          <path
            d="M12.95 23.332H12.35C10.3618 23.332 8.75 25.011 8.75 27.082C8.75 27.4272 9.01862 27.707 9.35 27.707H25.5208"
            stroke="white"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.3125 32.082C16.5206 32.082 17.5 31.1027 17.5 29.8945C17.5 28.6864 16.5206 27.707 15.3125 27.707C14.1044 27.707 13.125 28.6864 13.125 29.8945C13.125 31.1027 14.1044 32.082 15.3125 32.082Z"
            stroke="white"
            stroke-width="1.25"
          />
          <path
            d="M25.5156 32.082C26.7237 32.082 27.7031 31.1027 27.7031 29.8945C27.7031 28.6864 26.7237 27.707 25.5156 27.707C24.3075 27.707 23.3281 28.6864 23.3281 29.8945C23.3281 31.1027 24.3075 32.082 25.5156 32.082Z"
            stroke="white"
            stroke-width="1.25"
          />
        </svg>
      </a-col>
      <a-col
        :sm="12"
        :xs="12"
        :md="6"
        :lg="6"
        style="
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        "
      >
        <div class="banner-text" style="color: white">10M+</div>
        <h3>Global Impressions</h3>
        <svg
          width="35"
          height="35"
          viewBox="0 0 35 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.5052 32.0846C25.5594 32.0846 32.0885 25.5555 32.0885 17.5013C32.0885 9.44715 25.5594 2.91797 17.5052 2.91797C9.45106 2.91797 2.92188 9.44715 2.92188 17.5013C2.92188 25.5555 9.45106 32.0846 17.5052 32.0846Z"
            stroke="white"
            stroke-width="1.25"
          />
          <path
            d="M11.0781 17.5C12.1091 9.25911 14.4636 3.5 17.2031 3.5C19.9427 3.5 22.2971 9.25911 23.3281 17.5"
            stroke="white"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M11.0781 17.5C12.1091 25.7409 14.4636 31.5 17.2031 31.5C19.9427 31.5 22.2971 25.7409 23.3281 17.5"
            stroke="white"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2.92188 17.5H11.0885M32.0885 17.5H23.3385"
            stroke="white"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a-col>
      <a-col
        :sm="12"
        :xs="12"
        :md="6"
        :lg="6"
        style="
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        "
      >
        <div class="banner-text" style="color: white">75%</div>
        <h3>Faster Sales</h3>
        <svg
          width="21"
          height="29"
          viewBox="0 0 21 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.57749 15.4823H4.90818C2.7444 15.4823 1.66251 15.4823 1.20136 14.7689C0.740202 14.0556 1.1796 13.0618 2.05839 11.0741L4.70036 5.09846C5.49937 3.29125 5.89888 2.38764 6.67391 1.88132C7.44894 1.375 8.43256 1.375 10.4 1.375H13.447C15.837 1.375 17.0319 1.375 17.4825 2.15572C17.9333 2.93644 17.3405 3.97941 16.1547 6.06534L14.5915 8.81524C14.0021 9.85222 13.7074 10.3707 13.7114 10.7951C13.7168 11.3467 14.0101 11.8549 14.4839 12.1331C14.8485 12.3474 15.4425 12.3474 16.6306 12.3474C18.1325 12.3474 18.8836 12.3474 19.2747 12.6074C19.7828 12.9451 20.0488 13.5495 19.9556 14.1547C19.8838 14.6205 19.3787 15.179 18.3683 16.2962L10.2963 25.2221C8.71081 26.9753 7.91806 27.8519 7.38572 27.5745C6.85337 27.297 7.10902 26.1407 7.62027 23.8278L8.62185 19.2973C9.01108 17.5362 9.20577 16.6557 8.73764 16.069C8.26952 15.4823 7.37216 15.4823 5.57749 15.4823Z"
            stroke="white"
            stroke-width="1.25"
            stroke-linejoin="round"
          />
        </svg>
      </a-col>
    </a-row>

    <br />

    <div className="listing-step hidden lg:block" ref="listingStep">
      <div class="header">
        <h1 class="banner-text">Get listing-ready results in seconds</h1>
        <p class="header-text">
          Turn your property photos into stunning visuals in three simple
        </p>
        <p class="header-text">
          steps to attract buyers and enhance your listings.
        </p>
      </div>
      <div class="section-container">
        <!-- Header -->

        <!-- Steps Wrapper -->
        <div class="steps-wrapper">
          <!-- Step 1 Text -->
          <div class="step-text-container">
            <div class="step-content">
              <h2 class="step-title">Upload</h2>
              <p class="step-description">We support both furnished</p>
              <p class="step-description">and unfurnished photos.</p>
            </div>
          </div>

          <!-- Step 1 Image -->
          <div class="step-image-container">
            <div class="image-box step1-box">
              <!-- Step Number -->
              <span class="step-number step1-number">
                <img src="/01 (1).svg" alt="Share" />
              </span>

              <!-- Normal content always visible -->
              <div class="upload-sec">
                <img src="/upload-04.svg" alt="Share" />
                <div class="upload-instruction">
                  <span class="drag-text">Drag and drop</span>
                </div>
              </div>

              <!-- Overlay: initially not present -->
              <div
                v-if="overlayVisible"
                class="overlay-box"
                :class="{ shrink: overlayShrink }"
              >
                <img class="overlay-img" :src="step1Img" alt="overlay" />
              </div>
            </div>
          </div>

          <!-- SVG Line 1 -->
          <div class="svg-line line1">
            <img src="/firstline.svg" alt="line" class="line-image" />
          </div>

          <!-- Step 2 Image -->
          <div class="step-image-container step2-image">
            <div class="image-box step2-box">
              <!-- Step Number on Top Right -->
              <span class="step-number step2-number"
                ><img src="/02.svg" alt="Share"
              /></span>
              <div class="step-2-wave-container">
                <!-- OLD image stays behind -->
                <img class="step2-img base" :src="step2Img" alt="" />

                <!-- NEW image fades in on top -->
                <img
                  class="step2-img top"
                  :class="{ show: step2ShowNewImg }"
                  :src="step3Img"
                  alt=""
                />

                <!-- wave overlay -->
                <div
                  v-if="step2ShowWave"
                  class="step2-wave-overlay"
                  :key="step2WaveKey"
                  @animationend="step2OnWaveEnd"
                ></div>
              </div>

              <div class="ai-badge">
                <span><img src="/addingfurniture.svg" alt="Share" /></span>
                Adding furniture..
              </div>
            </div>
          </div>

          <!-- Step 2 Text -->
          <div class="step-text-container step2-text">
            <div class="step-content">
              <div class="step2-content-inner">
                <h2 class="step-title">AI Finished</h2>
                <p class="step-description">Our AI redesigns your space</p>
                <p class="step-description">in 15 seconds.</p>
              </div>
            </div>
          </div>

          <!-- SVG Line 2 -->
          <div class="svg-line line2">
            <img src="/secondline.svg" alt="line" class="line-image" />
          </div>

          <!-- Step 3 Text -->
          <div class="step-text-container step3-text">
            <div class="step-content">
              <h2 class="step-title" style="font-size: 32px; font-weight: 500">
                Download & Share
              </h2>
              <p class="step-description">Download the staged photo</p>
              <p class="step-description">and share it anywhere.</p>
            </div>
          </div>

          <!-- Step 3 Image -->
          <div class="step-image-container step3-image">
            <div class="image-box step3-box">
              <!-- 03 Number -->
              <span class="step-number step3-number"
                ><img src="/03.svg" alt="Share"
              /></span>
              <div>
                <img
                  class="phase-3-image"
                  src="../../assets/homePhase3.png"
                  alt=""
                />
              </div>
              <!-- Buttons half inside / half outside -->
              <div class="action-buttons">
                <button class="action-btn">
                  <img src="/download.svg" alt="Download" />
                </button>
                <button class="action-btn">
                  <img src="/share.svg" alt="Share" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />

    <div
      class="lg:hidden w-full bg-white py-12 px-4 sm:px-6 lg:px-8"
      ref="listingStepMobile"
    >
      <!-- Header Section -->
      <div class="text-center mb-16">
        <h1
          class="banner-text"
        >
          Get listing-ready results in seconds
        </h1>
        <p class="!font-poppins text-base text-gray-500 leading-relaxed">
          Turn your property photos into stunning visuals in three simple
        </p>
        <p class="font-poppins text-base text-gray-500 leading-relaxed">
          steps to attract buyers and enhance your listings.
        </p>
      </div>

      <!-- Steps Container -->
      <div class="max-w-6xl mx-auto px-3 sm:px-6 relative">
        <!-- Step 1: Upload -->
        <div
          class="flex flex-col lg:flex-row items-center gap-8 mb-24 lg:mb-32"
        >
          <!-- Step 1 Text -->
          <div class="flex w-full justify-between pt-12 items-start">
            <!-- LEFT SIDE -->
            <div>
              <h2
  class="!text-black !mb-2  lg:!mt-0"
                style="
    font-family: 'Poppins', sans-serif;
                  font-weight: 600;
                  font-style: normal; /* 'SemiBold' is not valid in CSS; use weight 600 */
                  font-size: 24px;
                  line-height: 32px;
                  letter-spacing: -0.02em; /* -2% = -0.02em */
                "
              >
                Upload
              </h2>

              <p class="font-poppins text-gray-500 leading-snug">
                We support both furnished
              </p>
              <p class="font-poppins text-gray-500 leading-snug">
                and unfurnished photos.
              </p>
            </div>

            <!-- RIGHT SIDE -->
            <div className="">
              <img
                src="/01 (1).svg"
                alt="Step 1"
                class="w-20 h-20 sm:w-24 sm:h-24"
              />
            </div>
          </div>

          <!-- Step 1 Image -->
          <div class="w-full lg:w-1/2 flex justify-center">
            <div class="relative w-full max-w-md">
              <!-- Image Box -->
              <div class="image-box step1-box">
                <!-- Step Number -->
                <!-- Normal content always visible -->

                <!-- Overlay: initially not present -->
                <div
                  v-if="overlayVisible"
                  class="overlay-box"
                  :class="{ shrink: overlayShrink }"
                >
                  <img class="overlay-img" :src="step1Img" alt="overlay" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: AI Finished -->
        <div
          class="flex flex-col lg:flex-row-reverse items-center gap-8 pt-24 relative z-10"
        >
          <!-- Step 2 Text -->
          <div class="flex w-full justify-between pt-6 items-start">
            <!-- LEFT SIDE -->
            <div>
              <h2
  class="!text-black !mb-2  lg:!mt-0"
                style="
    font-family: 'Poppins', sans-serif;
                  font-weight: 600;
                  font-style: normal; /* 'SemiBold' is not valid in CSS; use weight 600 */
                  font-size: 24px;
                  line-height: 32px;
                  letter-spacing: -0.02em; /* -2% = -0.02em */
                "
              >
                AI Finished
              </h2>
              <p class="font-poppins text-gray-500 leading-snug">
                Our AI redesigns your space
              </p>
              <p class="font-poppins text-gray-500 leading-snug">
                in 15 seconds.
              </p>
            </div>

            <!-- RIGHT SIDE -->
            <div className="">
              <img
                src="/02.svg"
                alt="Step 1"
                class="w-20 h-20 sm:w-24 sm:h-24"
              />
            </div>
          </div>

          <!-- Step 2 Image -->
          <div class="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div class="relative w-full max-w-sm">
              <!-- Step Number -->

              <!-- Image Box -->
              <div
                class="rounded-2xl w-full aspect-video sm:aspect-auto sm:h-64 flex items-center justify-center relative bg-cover bg-center"
              >
                <div class="step-2-wave-container">
                  <!-- OLD image stays behind -->
                  <img class="step2-img base" :src="step2Img" alt="" />

                  <!-- NEW image fades in on top -->
                  <img
                    class="step2-img top"
                    :class="{ show: step2ShowNewImg }"
                    :src="step3Img"
                    alt=""
                  />

                  <!-- wave overlay -->
                  <div
                    v-if="step2ShowWave"
                    class="step2-wave-overlay"
                    :key="step2WaveKey"
                    @animationend="step2OnWaveEnd"
                  ></div>
                </div>
                <!-- AI Badge -->
                <div
                  class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white !px-4 py-2 rounded-lg flex items-center gap-2 font-poppins text-xs font-semibold shadow-lg z-30"
                >
                  <img
                    src="/addingfurniture.svg"
                    alt="Adding"
                    class="w-4 h-4"
                  />
                  <span className="whitespace-nowrap">Adding furniture..</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Download & Share -->
        <div
          class="flex flex-col lg:flex-row items-center pt-14 gap-8 relative z-10"
        >
          <!-- Step 3 Text -->
          <div class="flex w-full justify-between pt-12 items-start">
            <!-- LEFT SIDE -->
            <div>
              <h2
  class="!text-black !mb-2  lg:!mt-0"
                style="
    font-family: 'Poppins', sans-serif;
                  font-weight: 600;
                  font-style: normal; /* 'SemiBold' is not valid in CSS; use weight 600 */
                  font-size: 24px;
                  line-height: 32px;
                  letter-spacing: -0.02em; /* -2% = -0.02em */
                "
              >
                Download & Share
              </h2>
              <p class="font-poppins text-gray-500 leading-snug">
                Download the staged photo
              </p>
              <p class="font-poppins text-gray-500 leading-snug">
                and share it anywhere.
              </p>
            </div>

            <!-- RIGHT SIDE -->
            <div className="">
              <img
                src="/03.svg"
                alt="Step 1"
                class="w-20 h-20 sm:w-24 sm:h-24"
              />
            </div>
          </div>

          <!-- Step 3 Image -->
          <div class="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div class="relative w-full max-w-sm">
              <!-- Step Number -->

              <!-- Image Box -->
              <div
                class="rounded-2xl w-full aspect-video sm:aspect-auto sm:h-64 flex items-center justify-center relative bg-cover bg-center"
                :style="{ backgroundImage: `url(${step3Img})` }"
              >
                <!-- Action Buttons -->
                <div class="action-buttons">
                  <button class="action-btn">
                    <img src="/download.svg" alt="Download" />
                  </button>
                  <button class="action-btn">
                    <img src="/share.svg" alt="Share" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="pb-18"
      :style="{
        backgroundImage: `url(${swiper_bg})`,
        backgroundPosition: 'center 90%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '800px',
        width: '100%',
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'end',
      }"
    >
      <div style="text-align: center; width: 100%; padding-top: 100px">
        <!-- <div>{{ business_info.name }}</div> -->
        <div class="banner-text">Swap the furniture to</div>
        <div class="banner-text">match your vision</div>

        <!-- <h1>SWIPER-CHAIRS-HERE</h1> -->

        <swiper
          style="margin-top: 50px"
          :modules="modules"
          :slides-per-view="1"
          :space-between="50"
          navigation
          Autoplay
          :pagination="{ clickable: true }"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
        >
          <swiper-slide>
            <div
              style="
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <img
                src="../../assets/ch_1_home_page.png"
                style="max-width: 450px; width: 100%; object-fit: contain"
                alt=""
              />
              <!-- <a-row>
      <a-col :sm="24" :xs="24" :md="12" :lg="12">
      </a-col>
      <a-col :sm="24" :xs="24" :md="12" :lg="12">
        <div class="banner-text">Swap the furniture to</div>
    <div class="banner-text">match your vision</div>
      </a-col>
    </a-row> -->
            </div>
          </swiper-slide>
          <swiper-slide>
            <div
              style="
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <img
                src="../../assets/ch_2_home_page.png"
                style="max-width: 350px; width: 100%; object-fit: contain"
                alt=""
              />
              <!-- <a-row>
          <a-col :sm="24" :xs="24" :md="12" :lg="12">
          </a-col>
          <a-col :sm="24" :xs="24" :md="12" :lg="12">
            <div class="banner-text">Swap the furniture to</div>
    <div class="banner-text">match your vision</div>
          </a-col>
        </a-row> -->
            </div>
          </swiper-slide>
          <swiper-slide>
            <div
              style="
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <img
                src="../../assets/ch_3_home_page.png"
                style="max-width: 400px; width: 100%; object-fit: contain"
                alt=""
              />
              <!-- <a-row>
          <a-col :sm="24" :xs="24" :md="12" :lg="12">
          </a-col>
          <a-col :sm="24" :xs="24" :md="12" :lg="12">
            <div class="banner-text">Swap the furniture to</div>
    <div class="banner-text">match your vision</div>
          </a-col>
        </a-row> -->
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <button
      @click="handleAuthorizeClick('viewInAr')"
      class="bg-[#3B63FB] px-6 whitespace-nowrap rounded-md py-2 -translate-y-14 translate-x-[80%] sm:translate-x-[180%] lg:translate-x-[330%] xl:translate-x-[430%] !text-white z-9999"
    >
      <span class="inline-block align-middle mr-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 6H7M12.1 19L10.08 17M12.1 19L10.08 21M12.1 19C7.05 19 2.81 17 2 15M15.131 18.771C18.602 18.231 21.266 16.79 22 15M7 3H17C18.87 3 19.804 3 20.5 3.402C20.956 3.66529 21.3347 4.04398 21.598 4.5C22 5.196 22 6.13 22 8C22 9.87 22 10.804 21.598 11.5C21.3347 11.956 20.956 12.3347 20.5 12.598C19.804 13 18.87 13 17 13H16.606C15.919 13 15.576 13 15.255 12.929C14.8248 12.8335 14.4209 12.6443 14.072 12.375C13.812 12.173 13.592 11.91 13.152 11.382C12.802 10.962 12.626 10.752 12.425 10.657C12.292 10.5946 12.1469 10.5622 12 10.5622C11.8531 10.5622 11.708 10.5946 11.575 10.657C11.374 10.751 11.199 10.961 10.848 11.382C10.408 11.91 10.188 12.173 9.928 12.375C9.57915 12.6443 9.17524 12.8335 8.745 12.929C8.425 13 8.081 13 7.394 13H7C5.13 13 4.196 13 3.5 12.598C3.04398 12.3347 2.66529 11.956 2.402 11.5C2 10.804 2 9.87 2 8C2 6.13 2 5.196 2.402 4.5C2.66529 4.04398 3.04398 3.66529 3.5 3.402C4.196 3 5.13 3 7 3Z"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>

      <span class="inline-block pl-2 align-middle"> View on AR </span>
    </button>

    <!-- virtual staging part  -->

    <br />
    <div class="flex items-center justify-center">
      <div class="max-w-[1200px] mx-auto px-4 md:px-6 py-6 sm:py-12">
        <!-- Header -->
        <h1
          class="text-center text-black mb-12"
          style="
    font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-style: normal;
            font-size: 30px;
            line-height: 52px;
            letter-spacing: -0.02em;
          "
        >
          Our Services
        </h1>

        <!-- Virtual Staging Section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <!-- Image with Before/After Slider -->
          <div class="lg:col-span-6 order-1">
            <div
              ref="virtualStagingContainer"
              class="md-room-size relative w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg cursor-col-resize"
              @mousedown="startDrag('virtualStaging', $event)"
              @touchstart="startDrag('virtualStaging', $event)"
            >
              <!-- Before Image -->
              <img
                :src="virtualStagingImages[0]"
                alt="Before Virtual Staging"
                class="absolute inset-0 w-full h-full object-cover select-none"
                draggable="false"
              />

              <!-- After Image (Clipped) -->
              <div
                class="absolute inset-0 overflow-hidden"
                :style="{
                  clipPath: `inset(0 ${100 - virtualStagingSliderPosition}% 0 0)`,
                }"
              >
                <img
                  :src="virtualStagingImages[1]"
                  alt="After Virtual Staging"
                  class="absolute inset-0 w-full h-full object-cover select-none"
                  draggable="false"
                />
              </div>

              <!-- Slider Handle -->
              <div
                class="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize"
                :style="{ left: virtualStagingSliderPosition + '%' }"
              >
                <div
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-gray-600 absolute left-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <svg
                    class="w-4 h-4 text-gray-600 absolute right-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              <!-- Navigation Arrows -->
              <div class="absolute top-4 left-4 z-20">
                <button
                  @click.stop="prevVirtualStagingImage"
                  class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <svg
                    class="w-5 h-5 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>

              <div class="absolute top-4 right-4 z-20">
                <button
                  @click.stop="nextVirtualStagingImage"
                  class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <svg
                    class="w-5 h-5 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <!-- Before/After Labels -->
            </div>
          </div>

          <!-- Content -->
          <div class="lg:col-span-6 order-2 !mb-4 flex flex-col justify-center">
            <h2
              style="
                text-align: left;
                color: var(--Black-Black-100, #000000);
        font-family: 'Poppins', sans-serif;

                font-style: normal; /* Bold handled by weight */
                font-size: 26px;
                line-height: 34px;
                letter-spacing: -0.02em; /* -2% */
              "
            >
              Virtual Staging
            </h2>

            <p class="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
              With the help of virtual staging, you can create realistic,
              digital previews of spaces, providing a cost-effective solution
              for real estate and design.
            </p>

            <button
              class="w-fit bg-blue-600 !text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              @click="handleAuthorizeClick('tryVirtualStagging')"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.28387 8.51768L7.85167 7.08548C7.65647 6.89028 7.55887 6.79268 7.45353 6.74048C7.2532 6.64119 7.018 
              6.64119 6.8176 6.74048C6.71233 6.79268 6.61471 6.89028 6.41949 7.08548C6.22425 7.28075 6.12664 7.37835 
              6.07446 7.48361C5.97518 7.68401 5.97518 7.91921 6.07446 8.11955C6.12664 8.22488 6.22425 8.32248 6.41949 
              8.51768L7.85167 9.94988M9.28387 8.51768L13.5805 12.8143C13.7757 13.0095 13.8733 13.1071 13.9255 13.2125C14.0248 
              13.4128 14.0248 13.648 13.9255 13.8484C13.8733 13.9537 13.7757 14.0513 13.5805 14.2465C13.3853 14.4417 
              13.2877 14.5393 13.1824 14.5915C12.982 14.6908 12.7468 14.6908 12.5465 14.5915C12.4411 14.5393 12.3435 
              14.4417 12.1483 14.2465L7.85167 9.94988M9.28387 8.51768L7.85167 9.94988"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Try Virtual Staging
            </button>
          </div>
        </div>

        <!-- 3D Rendering Section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Content -->
          <div
            class="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-center"
          >
            <h2
              style="
                text-align: left;
                color: var(--Black-Black-100, #000000);
        font-family: 'Poppins', sans-serif;


                font-style: normal; /* Bold handled by weight */
                font-size: 26px;
                line-height: 34px;
                letter-spacing: -0.02em; /* -2% */
              "
>              3D Rendering
            </h2>

            <p class="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
              We are helping you create stunning 3D renderings of furniture by
              transforming 3D models into realistic, detailed images using
              advanced software.
            </p>

            <button
              class="w-fit bg-blue-600 !text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              @click="handleAuthorizeClick('try3DRendering')"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.28387 8.51768L7.85167 7.08548C7.65647 6.89028 7.55887 6.79268 7.45353 6.74048C7.2532 6.64119 
              7.018 6.64119 6.8176 6.74048C6.71233 6.79268 6.61471 6.89028 6.41949 7.08548C6.22425 7.28075 6.12664 
              7.37835 6.07446 7.48361C5.97518 7.68401 5.97518 7.91921 6.07446 8.11955C6.12664 8.22488 6.22425 8.32248 
              6.41949 8.51768L7.85167 9.94988M9.28387 8.51768L13.5805 12.8143C13.7757 13.0095 13.8733 13.1071 
              13.9255 13.2125C14.0248 13.4128 14.0248 13.648 13.9255 13.8484C13.8733 13.9537 13.7757 14.0513 
              13.5805 14.2465C13.3853 14.4417 13.2877 14.5393 13.1824 14.5915C12.982 14.6908 12.7468 14.6908 
              12.5465 14.5915C12.4411 14.5393 12.3435 14.4417 12.1483 14.2465L7.85167 9.94988M9.28387 8.51768L7.85167 9.94988"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Try 3D Rendering
            </button>
          </div>

          <!-- Image with Before/After Slider -->
          <div class="lg:col-span-6 order-1 lg:order-2">
            <div
              ref="rendering3DContainer"
              class="md-room-size relative w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg cursor-col-resize"
              @mousedown="startDrag('rendering3D', $event)"
              @touchstart="startDrag('rendering3D', $event)"
            >
              <!-- Before Image -->
              <img
                :src="rendering3DImages[0]"
                alt="Before 3D Rendering"
                class="absolute inset-0 w-full h-full object-cover select-none"
                draggable="false"
              />

              <!-- After Image (Clipped) -->
              <div
                class="absolute inset-0 overflow-hidden"
                :style="{
                  clipPath: `inset(0 ${100 - rendering3DSliderPosition}% 0 0)`,
                }"
              >
                <img
                  :src="rendering3DImages[1]"
                  alt="After 3D Rendering"
                  class="absolute inset-0 w-full h-full object-cover select-none"
                  draggable="false"
                />
              </div>

              <!-- Slider Handle -->
              <div
                class="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize"
                :style="{ left: rendering3DSliderPosition + '%' }"
              >
                <div
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-gray-600 absolute left-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <svg
                    class="w-4 h-4 text-gray-600 absolute right-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              <!-- Navigation Arrows -->
              <div class="absolute top-4 left-4 z-20">
                <button
                  @click.stop="prevRendering3DImage"
                  class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <svg
                    class="w-5 h-5 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>

              <div class="absolute top-4 right-4 z-20">
                <button
                  @click.stop="nextRendering3DImage"
                  class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <svg
                    class="w-5 h-5 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <!-- Before/After Labels -->
              <div
                class="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-semibold"
              >
                Before
              </div>
              <div
                class="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-semibold"
              >
                After
              </div>
            </div>
          </div>
        </div>

        <!-- object removing -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 !mt-4 mb-20">
          <!-- Image with Before/After Slider -->
          <div class="lg:col-span-6 order-1">
            <div
              ref="objectRemovalContainer"
              class="md-room-size relative w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg cursor-col-resize"
              @mousedown="startDrag('objectRemoval', $event)"
              @touchstart="startDrag('objectRemoval', $event)"
            >
              <!-- Before Image -->
              <img
                :src="RemovingObjectImages[0]"
                alt="Before Virtual Staging"
                class="absolute inset-0 w-full h-full object-cover select-none"
                draggable="false"
              />

              <!-- After Image (Clipped) -->
              <div
                class="absolute inset-0 overflow-hidden"
                :style="{
                  clipPath: `inset(0 ${100 - removeObjectSliderPosition}% 0 0)`,
                }"
              >
                <img
                  :src="RemovingObjectImages[1]"
                  alt="After Virtual Staging"
                  class="absolute inset-0 w-full h-full object-cover select-none"
                  draggable="false"
                />
              </div>

              <!-- Slider Handle -->
              <div
                class="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize"
                :style="{ left: removeObjectSliderPosition + '%' }"
              >
                <div
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-gray-600 absolute left-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <svg
                    class="w-4 h-4 text-gray-600 absolute right-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              <!-- Navigation Arrows -->
              <div class="absolute top-4 left-4 z-20">
                <button
                  @click.stop="prevRemoveObectImage"
                  class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <svg
                    class="w-5 h-5 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>

              <div class="absolute top-4 right-4 z-20">
                <button
                  @click.stop="nextRemoveObjectImage"
                  class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <svg
                    class="w-5 h-5 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <!-- Before/After Labels -->
            </div>
          </div>

          <!-- Content -->
          <div class="lg:col-span-6 order-2 flex flex-col justify-center">
            <h2
              style="
                text-align: left;
                color: var(--Black-Black-100, #000000);
        font-family: 'Poppins', sans-serif;

                font-style: normal; /* Bold handled by weight */
                font-size: 26px;
                line-height: 34px;
                letter-spacing: -0.02em; /* -2% */
              "
            >
              Object Removal
            </h2>

            <p class="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
              With the help of object removal, you can eliminate unwanted
              furniture, clutter, or distractions from room images, creating
              clean and spacious interiors that highlight the true potential of
              any space.
            </p>

            <button
              class="w-fit bg-blue-600 !text-white !px-2 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              @click="handleAuthorizeClick('tryVirtualStagging')"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.28387 8.51768L7.85167 7.08548C7.65647 6.89028 7.55887 6.79268 7.45353 6.74048C7.2532 6.64119 7.018 
              6.64119 6.8176 6.74048C6.71233 6.79268 6.61471 6.89028 6.41949 7.08548C6.22425 7.28075 6.12664 7.37835 
              6.07446 7.48361C5.97518 7.68401 5.97518 7.91921 6.07446 8.11955C6.12664 8.22488 6.22425 8.32248 6.41949 
              8.51768L7.85167 9.94988M9.28387 8.51768L13.5805 12.8143C13.7757 13.0095 13.8733 13.1071 13.9255 13.2125C14.0248 
              13.4128 14.0248 13.648 13.9255 13.8484C13.8733 13.9537 13.7757 14.0513 13.5805 14.2465C13.3853 14.4417 
              13.2877 14.5393 13.1824 14.5915C12.982 14.6908 12.7468 14.6908 12.5465 14.5915C12.4411 14.5393 12.3435 
              14.4417 12.1483 14.2465L7.85167 9.94988M9.28387 8.51768L7.85167 9.94988"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Try Clean Room
            </button>
          </div>
        </div>

        <!-- change floor  -->
        <div class="floor-change-sec grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Content -->
          <div
            class="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-center"
          >
            <h2
              style="
                text-align: left;
                color: var(--Black-Black-100, #000000);
        font-family: 'Poppins', sans-serif;

                font-style: normal; /* Bold handled by weight */
                font-size: 26px;
                line-height: 34px;
                letter-spacing: -0.02em; /* -2% */
              "
>               Floor Changing
            </h2>

            <p class="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
              We help you change the look of your floors by updating materials,
              colors, and styles, creating clean, modern, and realistic
              interiors that feel fresh and inviting.
            </p>

            <button
              class="w-fit bg-blue-600 !text-white !px-3 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              @click="handleAuthorizeClick('try3DRendering')"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.28387 8.51768L7.85167 7.08548C7.65647 6.89028 7.55887 6.79268 7.45353 6.74048C7.2532 6.64119 
              7.018 6.64119 6.8176 6.74048C6.71233 6.79268 6.61471 6.89028 6.41949 7.08548C6.22425 7.28075 6.12664 
              7.37835 6.07446 7.48361C5.97518 7.68401 5.97518 7.91921 6.07446 8.11955C6.12664 8.22488 6.22425 8.32248 
              6.41949 8.51768L7.85167 9.94988M9.28387 8.51768L13.5805 12.8143C13.7757 13.0095 13.8733 13.1071 
              13.9255 13.2125C14.0248 13.4128 14.0248 13.648 13.9255 13.8484C13.8733 13.9537 13.7757 14.0513 
              13.5805 14.2465C13.3853 14.4417 13.2877 14.5393 13.1824 14.5915C12.982 14.6908 12.7468 14.6908 
              12.5465 14.5915C12.4411 14.5393 12.3435 14.4417 12.1483 14.2465L7.85167 9.94988M9.28387 8.51768L7.85167 9.94988"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Try Change Floor
            </button>
          </div>

          <!-- Image with Before/After Slider -->
          <div class="lg:col-span-6 order-1 lg:order-2">
            <div
              ref="FloorRemovalContainer"
              class="floor-repersentation-sec md-room-size relative w-full h-[350px] md:h-[400px] rounded-2xl shadow-lg cursor-col-resize"
              @mousedown="startDrag('floorChange', $event)"
              @touchstart="startDrag('floorChange', $event)"
            >
              <!-- Before Image -->
              <img
                :src="FloorChangeImages[0]"
                alt="Before 3D Rendering"
                class="absolute inset-0 w-full h-full object-cover select-none rounded-xl"
                draggable="false"
              />
              <img
                class="floor-image"
                :src="FloorChangeConfig[this.floorChangeImageIndex]"
                alt=" "
              />

              <!-- After Image (Clipped) -->
              <div
                class="absolute inset-0 overflow-hidden"
                :style="{
                  clipPath: `inset(0 ${100 - floorChangeSliderPosition}% 0 0)`,
                }"
              >
                <img
                  :src="FloorChangeImages[1]"
                  alt="After 3D Rendering"
                  class="absolute inset-0 w-full h-full object-cover select-none rounded-xl"
                  draggable="false"
                />
              </div>

              <!-- Slider Handle -->
              <div
                class="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize"
                :style="{ left: floorChangeSliderPosition + '%' }"
              >
                <div
                  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-gray-600 absolute left-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <svg
                    class="w-4 h-4 text-gray-600 absolute right-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              <!-- Navigation Arrows -->
              <div class="absolute top-4 left-4 z-20">
                <button
                  @click.stop="prevRenderingFloorImage"
                  class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <svg
                    class="w-5 h-5 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>

              <div class="absolute top-4 right-4 z-20">
                <button
                  @click.stop="nextRenderingFloorImage"
                  class="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <svg
                    class="w-5 h-5 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <!-- Before/After Labels -->
              <div
                class="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-semibold"
              >
                Before
              </div>
              <div
                class="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-semibold"
              >
                After
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br /><br />

    <br /><br />
    <div className="hidden sm:block" style="background: #f2f2f2">
      <div style="max-width: 1300px; margin: auto">
        <div
          style="
            padding: 40px 10px;
            text-align: center;
            overflow: hidden;
            position: relative;
          "
        >
          <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 40px">
            See What Customers Love About Us
          </h1>

          <swiper
            style="
              margin-top: 20px;
              padding-bottom: 50px;
              overflow: visible;
              cursor: pointer;
            "
            :modules="modules"
            :slides-per-view="slidesPerView"
            :space-between="30"
            :centered-slides="true"
            :initial-slide="2"
            navigation
            :pagination="{ clickable: true }"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
          >
            <swiper-slide v-for="(review, index) in reviews" :key="index">
              <div
                style="
                  padding: 20px;
                  border-radius: 12px;
                  text-align: left;
                  width: 100%;
                  max-width: 280px;
                  margin: auto;
                "
              >
                <div
                  style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                  "
                >
                  <img
                    :src="review.avatar"
                    alt=""
                    style="
                      width: 40px;
                      height: 40px;
                      border-radius: 50%;
                      object-fit: cover;
                      margin-right: 10px;
                    "
                  />
                  <div>
                    <h3
                      style="
                        margin: 0;
                        font-size: 16px;
                        font-weight: 600;
                        color: #111;
                      "
                    >
                      {{ review.name }}
                    </h3>
                    <p style="margin: 0; font-size: 13px; color: #666">
                      {{ review.role }}
                    </p>
                  </div>
                </div>
                <p
                  style="
                    font-size: 14px;
                    line-height: 1.5;
                    color: #333;
                    margin: 0;
                  "
                >
                  “{{ review.text }}”
                </p>
              </div>
            </swiper-slide>
          </swiper>

          <!-- Fade effect overlays -->
          <div
            style="
              position: absolute;
              top: 0;
              left: 0;
              width: 200px;
              height: 100%;
              background: linear-gradient(to right, #f3f3f3, transparent);
              z-index: 5;
              pointer-events: none;
            "
          ></div>
          <div
            style="
              position: absolute;
              top: 0;
              right: 0;
              width: 200px;
              height: 100%;
              background: linear-gradient(to left, #f3f3f3, transparent);
              z-index: 5;
              pointer-events: none;
            "
          ></div>
        </div>
      </div>
    </div>

    <div style="padding: 10px; max-width: 1200px; margin: auto">
      <br /><br /><br />
      <h1
        style="
          text-align: center;
          color: var(--Black-Black-100, #000000);
        font-family: 'Poppins', sans-serif;

          font-weight: 700;
          font-style: normal; /* Bold handled by weight */
          font-size: 26px;
          line-height: 34px;
          letter-spacing: -0.02em; /* -2% */
        "
      >
        Got questions? We have answers
      </h1>
      <br />
   <div style="margin: 50px auto; max-width: 800px;">
        <a-collapse
          v-model:activeKey="expand_faq"
          accordion
          class="faq-collapse"
      style="background: #fff; border: none;"
        >
      <a-collapse-panel 
        key="1" 
        style="font-size: 18px; font-weight: 400;"
      >
            <template #header>
              <span
                :style="{
                  fontSize: expand_faq === '1' ? '20px' : '18px',
                  fontWeight: expand_faq === '1' ? '600' : '400',
                  fontFamily: 'Poppins, sans-serif',
              transition: 'all 0.3s ease'
                }"
              >
                What is virtual staging?
              </span>
            </template>
        <p style="margin: 0; color: #444; font-family: 'Poppins', sans-serif; font-weight: 400; font-size: 16px; line-height: 24px; letter-spacing: 0px;">
          Virtual staging is a process of using computer technology to furnish and decorate real estate photos digitally.
            </p>
          </a-collapse-panel>

          <a-collapse-panel key="2" style="font-size: 18px; font-weight: 400">
            <template #header>
              <span
                :style="{
                  fontSize: expand_faq === '2' ? '20px' : '18px',
                  fontWeight: expand_faq === '2' ? '600' : '400',
                  fontFamily: 'Poppins, sans-serif',
                  transition: 'all 0.3s ease',
                }"
              >
                Why should I pick virtual staging over physical staging?
              </span>
            </template>
        <p style="margin: 0; color: #444; font-family: 'Poppins', sans-serif; font-weight: 400; font-size: 16px; line-height: 24px; letter-spacing: 0px;">
          Virtual staging offers several advantages over physical staging. It's more cost-effective, as it eliminates the need for furniture rentals and setup. It's also faster, allowing for quicker turnaround times and adjustments to suit different buyer preferences. Additionally, virtual staging is highly flexible, enabling you to create multiple design styles and settings without the physical limitations of a space.
            </p>
          </a-collapse-panel>

          <a-collapse-panel key="3" style="font-size: 18px; font-weight: 400">
            <template #header>
              <span
                :style="{
                  fontSize: expand_faq === '3' ? '20px' : '18px',
                  fontWeight: expand_faq === '3' ? '600' : '400',
                  fontFamily: 'Poppins, sans-serif',
                  transition: 'all 0.3s ease',
                }"
              >
                What is AI virtual staging?
              </span>
            </template>
        <p style="margin: 0; color: #444; font-family: 'Poppins', sans-serif; font-weight: 400; font-size: 16px; line-height: 24px; letter-spacing: 0px;">
          AI virtual staging uses artificial intelligence models to automatically place furniture and décor in photos, saving time while creating realistic results.
            </p>
          </a-collapse-panel>

          <a-collapse-panel key="4" style="font-size: 18px; font-weight: 400">
            <template #header>
              <span
                :style="{
                  fontSize: expand_faq === '4' ? '20px' : '18px',
                  fontWeight: expand_faq === '4' ? '600' : '400',
                  fontFamily: 'Poppins, sans-serif',
                  transition: 'all 0.3s ease',
                }"
              >
                What kind of photos do you support?
              </span>
            </template>
        <p style="margin: 0; color: #444; font-family: 'Poppins', sans-serif; font-weight: 400; font-size: 16px; line-height: 24px; letter-spacing: 0px;">
          We support wide-angle interior property photos such as living rooms, bedrooms, dining areas, and more.
            </p>
          </a-collapse-panel>

          <a-collapse-panel key="5" style="font-size: 18px; font-weight: 400">
            <template #header>
              <span
                :style="{
                  fontSize: expand_faq === '5' ? '20px' : '18px',
                  fontWeight: expand_faq === '5' ? '600' : '400',
                  fontFamily: 'Poppins, sans-serif',
                  transition: 'all 0.3s ease',
                }"
              >
                How long does it take to virtually stage by AI?
              </span>
            </template>
        <p style="margin: 0; color: #444; font-family: 'Poppins', sans-serif; font-weight: 400; font-size: 16px; line-height: 24px; letter-spacing: 0px;">
          AI staging usually takes just a few minutes, depending on the complexity of the design and processing load.
            </p>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
    <div>
      <h1
        style="
          text-align: center;
          color: var(--Black-Black-100, #000000);
        font-family: 'Poppins', sans-serif;

          font-weight: 700;
          font-style: normal; /* Bold handled by weight */
          font-size: 26px;
          line-height: 34px;
          letter-spacing: -0.02em; /* -2% */
        "
      >
        Feel free to contact us
      </h1>

      <p
        class="font-poppins text-center !mx-4 md:!mx-0 text-gray-500 leading-snug"
      >
        Revolutionizing Interior Design with Virtual Technology & AI
      </p>
    </div>
    <div class="flex justify-center items-center !mx-4">
      <div
        class="bg-white p-6 sm:p-6 rounded-xl shadow-[0_20px_60px_rgba(59,130,246,0.7)] max-w-[450px] w-full border-t-[4px] border-blue-500 blue-glow-border"
      >
        <form @submit.prevent="submitForm" class="flex flex-col gap-5">
          <div class="flex gap-2 sm:gap-4">
            <input
              type="text"
              placeholder="Enter name"
              v-model="form.name"
              class="flex-1 py-3 px-1 sm:px-3.5 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              style="width: 100%"
            />
            <input
              type="email"
              placeholder="Your email"
              v-model="form.email"
              class="flex-1 py-3 px-1 sm:px-3.5 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              style="width: 100%"
            />
          </div>

          <textarea
            placeholder="Your text"
            v-model="form.message"
            class="w-full min-h-[120px] py-3 px-3.5 border border-gray-300 rounded-md text-sm resize-y outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          ></textarea>

          <button
            type="submit"
            class="bg-blue-500 !text-white py-3.5 border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-300 w-full hover:bg-blue-600 active:scale-95"
          >
            Send now
          </button>
        </form>
      </div>
    </div>
    <br />
    <br />
    <br />
  </div>
  <!-- DESKTOP: Compact Right Tab -->
  <div
    v-if="showProductModal"
    class="hidden lg:block absolute right-8 top-325 w-[500px] h-[580px] z-40 pointer-events-auto"
  >
    <div
      class="w-full h-full bg-[#f2f2f2] !rounded-xl transform transition-all duration-300 overflow-hidden"
      :class="showProductModal ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Desktop Header -->
      <div class="!px-6 !py-5 border-b border-gray-400">
        <div class="flex items-center justify-between mb-3">
          <h2 class="!text-md !text-gray-700">Select Product to replace</h2>
          <button
            @click="closeProductTab"
            class="!text-gray-700 hover:scale-105 !text-4xl leading-none"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Desktop Product Cards -->
      <div
        class="h-[calc(100%-100px)] overflow-y-auto no-scrollbar !px-6 !py-4 space-y-4"
      >
        <div
          v-for="(product, index) in products"
          :key="index"
          class="bg-white !rounded-xl !p-2 !mt-2 border border-gray-200 hover:border-blue-500 transition-all"
        >
          <!-- Product Row -->
          <div class="flex gap-4 mb-4">
            <!-- Product Image -->
            <div
              class="w-34 h-38 bg-white !rounded-lg flex-shrink-0 overflow-hidden"
            >
              <img
                :src="product.image"
                :alt="product.name"
                class="!w-full !h-full object-cover"
              />
            </div>

            <!-- Product Info -->
            <div class="flex-1">
              <h3 class="!text-gray-600 !text-medium mb-1">
                {{ product.name }}
              </h3>
              <p class="!text-gray-400 !text-sm mb-2">{{ product.color }}</p>

              <!-- Color Selector -->
              <div class="flex items-center gap-2 mb-2">
                <span class="!text-gray-400 !text-xs">Color</span>
                <div class="flex gap-1 !p-1">
                  <div
                    class="w-4 h-4 bg-gray-500 !rounded-full border-2 border-white cursor-pointer"
                  ></div>
                  <div
                    class="w-4 h-4 bg-white !rounded-full border-2 border-gray-600 cursor-pointer"
                  ></div>
                </div>
              </div>

              <!-- Price -->
              <div class="flex flex-row gap-4 !pt-3">
                <p class="!text-gray-400 !text-xs mb-1">Price :</p>
                <p class="!text-blue-500 !text-md">{{ product.price }}</p>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div
            class="w-full flex items-center justify-between !mt-3 !pt-3 border-t border-gray-300"
          >
            <button
              class="w-full !mr-2 !py-2 bg-gray-700 hover:bg-gray-600 !rounded-lg !text-white !text-sm !font-medium transition-colors"
            >
              Product Detail
            </button>

            <button
              class="flex items-center gap-2 !text-gray-700 hover:!text-red-500 transition-colors"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bannerImage from "@/assets/home_main_banner.jpg";
import { useI18n } from "vue-i18n";

import swiper_bg from "@/assets/bg-swiper.jpg";

// import Swiper core and required modules
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import catalog from "@/views/newhome/catalog.vue";
import ServicesShowcase from "@/views/newhome/ServicesShowcase.vue";
import step3Img from "@/assets/homePhase3.png";
import step2Img from "@/assets/homePhase2.png";
import step1Img from "@/assets/homePhase1.png";
import virtualStaggingbeforeImg from "@/assets/virtual-stagging-before.png";
import virtualStaggingAfterImg from "@/assets/virtual-stagging-after.png";
import ThreeDRenderingBefore from "@/assets/3dRenderingBefore.png";
import ThreeDRenderingAfter from "@/assets/3dRenderginAfter.png";
import room2BeforeVS from "@/assets/room2BeforeVS.jpg";
import room2AfterVS from "@/assets/room2AfterVS.jpg";
import room3BeforeVs from "@/assets/room3BeforeVS.jpg";
import room3AfterVS from "@/assets/room3AfterVS.jpg";
import room1BeforeOR from "@/assets/room1BeforeRO.jpg";
import room1AfterOR from "@/assets/room1AfterRO.jpg";
import room2BeforeOR from "@/assets/room2BeforeOR.jpg";
import room2AfterOR from "@/assets/room2AfterOR.jpg";
import room3BeforeOR from "@/assets/room3BeforeOR.jpg";
import room3AfterOR from "@/assets/room3AfterOR.jpg";
import room2Before3d from "@/assets/room2Before3d.png";
import room2After3D from "@/assets/room2After3D.jpg";
import room3Before3d from "@/assets/room3Before3d.png";
import room3After3d from "@/assets/room3After3d.jpg";
import room1BeforeFC from "@/assets/room1BeforeFC.jpg";
import room1AfterFC from "@/assets/room1AfterFC.jpg";
import room1TileFC from "@/assets/room1Floor.png";
// import room2BeforeFC from "@/assets/room2BeforeFC.jpg";
import room2AfterFC from "@/assets/room2AfterFC.jpg";
import room2Floor from "@/assets/room2Floor.png";
import room3After from "@/assets/room3AfterFC.jpg";
import room3TileFC from "@/assets/room3TileFC.png";
import room4AfterFC from "@/assets/room4AfterFC.jpg";
import room4Tile from "@/assets/room4Tile.png";

export default {
  name: "Home",

  components: {
    ServicesShowcase,
    Swiper,
    SwiperSlide,
    catalog,
  },

  setup() {
    // initialize vue-i18n for translations
    const { t } = useI18n();

    const onSwiper = (swiper) => console.log(swiper);
    const onSlideChange = () => console.log("slide change");

    return {
      t,
      onSwiper,
      onSlideChange,
      modules: [Navigation, Pagination, Scrollbar, A11y, Autoplay],
    };
  },

  data() {
    return {
      isLogedIn: localStorage.getItem("token") ? true : false,
      bannerImage,
      selectedFileData: null,
      fileRefKey:Number(new Date()),
      swiper_bg,
      expand_faq: undefined,
      slidesPerView: window.innerWidth <= 768 ? 1 : 4,
      //stepper image---
      step3Img,
      step2Img,
      step1Img,
      imageContainerFullWidth: false, // 👈 Add this

      showProductModal: false,
      selectedProduct: "Modern Chair", // Dynamic from mask area
      isProcessing: false, // ⬅️ ADD THIS
      showFurnitureMask: false,
      imageSrc: "../../assets/home_main_banner.jpg", // ⬅️ your image
      altText: "Room image",

      overlayVisible: false,
      overlayShrink: false,
      // 2nd step----------
      step2CurrentImg: step2Img,
      step2ShowWave: false,
      step2WaveKey: 0,
      stepKey: 0,

      step2Fading: false,
      step2ShowNewImg: false,
      isListingStepInView: false,
      observer: null,

      // Form data
      form: {
        name: "",
        email: "",
        message: "",
      },

      // Reviews data
      reviews: [
        {
          name: "Amy Lang",
          role: "Home Stager",
          text: "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces that attract potential buyers regularly.",
          avatar:
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        },
        {
          name: "Troy Sinclair",
          role: "Real Estate Photographer",
          text: "It has taken our real estate marketing to the next level! Our buyers love the virtual staging.",
          avatar:
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        },
        {
          name: "John Doe",
          role: "Interior Designer",
          text: "This tool made it so easy to stage homes and present them to clients with realistic visuals.",
          avatar:
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        },
        {
          name: "Sarah Lee",
          role: "Realtor",
          text: "My listings now stand out. Clients are impressed with how professional everything looks.",
          avatar:
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        },
        {
          name: "David Kim",
          role: "Architect",
          text: "An incredible platform for showcasing designs and spaces realistically.",
          avatar:
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        },
      ],

      products: [
        {
          name: "Chamaro Sky",
          color: "Chamaro Sky",
          price: "$60",
          image:
            "https://cdn.decornation.in/wp-content/uploads/2020/07/modern-dining-table-chairs.jpg",
        },
        {
          name: "Chamaro Sky",
          color: "Chamaro Sky",
          price: "$60",
          image:
            "https://imagecdn.99acres.com//microsite/wp-content/blogs.dir/6161/files/2024/05/Armchair-Home-Interiors.jpg",
        },
        {
          name: "Modern Chair",
          color: "Chamaro Sky",
          price: "$60",
          image: "chair3.jpg",
        },
      ],

      // Image slider functionality
      isDragging: null,

      // current VS slider position
      stepVSSliderIndex: 0,
      stepVSSliderPoints: [50, 25, 85],
      virtualStagingSliderPosition: 50,
      stepVSSliderIntervalId: null,

      step3DSliderIndex: 0,
      step3DSliderPoints: [85, 25],
      rendering3DSliderPosition: 85,
      step3DSliderIntervalId: null,
      step3DSliderAnimFrameId: null,

      objectRemovalSliderIndex: 0,
      objectRemovalSliderPoints: [25, 85],
      removeObjectSliderPosition: 50,
      objectRemovalSliderIntervalId: null,
      objectRemovalSliderAnimFrameId: null,

      floorChangeSliderIndex: 1,
      floorChangeSliderPoints: [85, 25],
      floorChangeSliderPosition: 85,
      floorChangeSliderIntervalId: null,
      floorChangeSliderAnimFrameId: null,

      // Current displayed images
      virtualStagingImages: [virtualStaggingAfterImg, virtualStaggingbeforeImg],
      rendering3DImages: [room2After3D, room2Before3d],
      RemovingObjectImages: [room1AfterOR, room1BeforeOR],
      FloorChangeImages: [room1AfterFC, room1BeforeFC],
      FloorChangeConfig: [room1TileFC, room2Floor, room3TileFC, room4Tile],

      // Image sets for navigation
      virtualStagingImageSet: [
        [virtualStaggingAfterImg, virtualStaggingbeforeImg],
        [room2AfterVS, room2BeforeVS],
        [room3AfterVS, room3BeforeVs],
      ],

      rendering3DImageSet: [
        [room2After3D, room2Before3d],
        [room3After3d, room3Before3d],
        [ThreeDRenderingAfter, ThreeDRenderingBefore],
      ],

      removeObjectImageSet: [
        [room1AfterOR, room1BeforeOR],
        [room3AfterOR, room3BeforeOR],
        [room2AfterOR, room2BeforeOR],
      ],

      renderingFloorImageSet: [
        [room1AfterFC, room1BeforeFC],
        [room2AfterFC, room1BeforeFC],
        [room3After, room1BeforeFC],
        [room4AfterFC, room1BeforeFC],
      ],

      virtualStagingImageIndex: 0,
      rendering3DImageIndex: 0,
      removeObjectImageIndex: 0,
      floorChangeImageIndex: 0,
      redictConfig: {
        tryDemo: "/start-new-catalogue?brand=sdlc",
        processPhoto: "/start-new-catalogue?brand=sdlc",
        uploadImage: "/start-new-catalogue?brand=sdlc",
        tryForFree: "/start-new-catalogue?brand=sdlc",
        viewInAr: "/ar-product/838bac54-afe9-438f-b12b-4557a9b2fc43",
        tryVirtualStagging: "/start-new-catalogue?brand=sdlc",
        try3DRendering: "/my-products/add-new-furniture",
      },
    };
  },
  computed: {
    selectedFileDataTryFree() {
      const file= this.$store.state.HomePageTryFeeSelectedFile 
      return file ? URL.createObjectURL(file) : ""
    },
  },
  mounted() {
    this.startServiceSection();

    // Auto-start animation on mobile
    if (window.innerWidth < 1024) {
      this.startStepAnimation();
    } else {
      // Use observer only on desktop
      this.observer = new IntersectionObserver(
        ([entry]) => {
          this.isListingStepInView = entry.isIntersecting;
          if (this.isListingStepInView) {
            this.startStepAnimation();
          } else {
            this.stopStepAnimation();
          }
        },
        { threshold: 0.3 },
      );

      if (this.$refs.listingStep) {
        this.observer.observe(this.$refs.listingStep);
      }
    }
  },

  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
  },

  methods: {
    handleHomeFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  this.fileRefKey = Number(new Date());
  this.$store.commit("setSelectedFile", file);

  // const reader = new FileReader();

  // reader.onload = (e) => {
  //   console.log("File loaded");
  //   this.$store.commit("setSelectedFile", e.target.result);
  // };

  // reader.readAsDataURL(file); // 🔥 THIS WAS MISSING
},
    handleHomeFileUploadTryFree() {
      
      // This opens the file selector
      this.$refs.fileTryFree.click();
    },
    handleTryFreeNavigateSimulation() {
      this.$router.push({
        path: "/start-new-catalogue",
        query: {
          brand: "dyd-testing",
          source: 'try-free'
        },
      });
    },
    // start services sliding window animation
    // start service section Animation
    startServiceSection() {
      this.startStepVSSliderAnimation();
      this.startStep3DSliderAnimation();
      this.startObjectRemovalSliderAnimation();
      this.startFloorChangeSliderAnimation();
    },
    //vs
    startStepVSSliderAnimation() {
      if (this.stepVSSliderIntervalId) return;

      this.virtualStagingSliderPosition = 25;
      this.stepVSSliderPoints = [25, 85];
      this.stepVSSliderIndex = 1;

      const pauseTime = 1000;
      const moveDuration = 1500;

      const smoothMoveEaseOutEnds = (
        target,
        duration = moveDuration,
        onDone,
      ) => {
        cancelAnimationFrame(this.stepVSSliderAnimFrameId);

        const start = this.virtualStagingSliderPosition;
        const diff = target - start;
        const startTime = performance.now();

        const animate = (now) => {
          const t = Math.min((now - startTime) / duration, 1);

          const ease =
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          this.virtualStagingSliderPosition = +(start + diff * ease).toFixed(2);

          if (t < 1) {
            this.stepVSSliderAnimFrameId = requestAnimationFrame(animate);
          } else {
            onDone && onDone();
          }
        };

        this.stepVSSliderAnimFrameId = requestAnimationFrame(animate);
      };

      const runNext = () => {
        const nextValue = this.stepVSSliderPoints[this.stepVSSliderIndex];
        this.stepVSSliderIndex =
          (this.stepVSSliderIndex + 1) % this.stepVSSliderPoints.length;

        setTimeout(() => {
          smoothMoveEaseOutEnds(nextValue, moveDuration, runNext);
        }, pauseTime);
      };

      setTimeout(() => {
        smoothMoveEaseOutEnds(85, moveDuration, runNext);
      }, pauseTime);

      this.stepVSSliderIntervalId = true;
    },

    stopStepVSSliderAnimation() {
      this.stepVSSliderIntervalId = null;
      cancelAnimationFrame(this.stepVSSliderAnimFrameId);
      this.stepVSSliderAnimFrameId = null;
    },
    //end VS

    // 3D rendering start
    startStep3DSliderAnimation() {
      if (this.step3DSliderIntervalId) return;

      this.rendering3DSliderPosition = 85;
      this.step3DSliderPoints = [85, 25];
      this.step3DSliderIndex = 1;

      const pauseTime = 1000;
      const moveDuration = 1500;

      const smoothMoveEaseOutEnds = (
        target,
        duration = moveDuration,
        onDone,
      ) => {
        cancelAnimationFrame(this.step3DSliderAnimFrameId);

        const start = this.rendering3DSliderPosition;
        const diff = target - start;
        const startTime = performance.now();

        const animate = (now) => {
          const t = Math.min((now - startTime) / duration, 1);

          const ease =
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          this.rendering3DSliderPosition = +(start + diff * ease).toFixed(2);

          if (t < 1) {
            this.step3DSliderAnimFrameId = requestAnimationFrame(animate);
          } else {
            onDone && onDone();
          }
        };

        this.step3DSliderAnimFrameId = requestAnimationFrame(animate);
      };

      const runNext = () => {
        const nextValue = this.step3DSliderPoints[this.step3DSliderIndex];
        this.step3DSliderIndex =
          (this.step3DSliderIndex + 1) % this.step3DSliderPoints.length;

        setTimeout(() => {
          smoothMoveEaseOutEnds(nextValue, moveDuration, runNext);
        }, pauseTime);
      };

      setTimeout(() => {
        smoothMoveEaseOutEnds(25, moveDuration, runNext);
      }, pauseTime);

      this.step3DSliderIntervalId = true;
    },

    stopStep3DSliderAnimation() {
      this.step3DSliderIntervalId = null;
      cancelAnimationFrame(this.step3DSliderAnimFrameId);
      this.step3DSliderAnimFrameId = null;
    },
    // 3d rendering end

    //object removal start
    startObjectRemovalSliderAnimation() {
      if (this.objectRemovalSliderIntervalId) return;

      // Start at mid position
      this.removeObjectSliderPosition = 50;
      this.objectRemovalSliderPoints = [25, 85];
      this.objectRemovalSliderIndex = 0; // next move → 25

      const pauseTime = 1000; // ⭐ pause at ends
      const moveDuration = 1500; // ⭐ move duration

      const smoothMove = (target, duration = moveDuration, onDone) => {
        cancelAnimationFrame(this.objectRemovalSliderAnimFrameId);

        const start = this.removeObjectSliderPosition;
        const diff = target - start;
        const startTime = performance.now();

        const animate = (now) => {
          const t = Math.min((now - startTime) / duration, 1);
          const ease =
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          this.removeObjectSliderPosition = +(start + diff * ease).toFixed(2);

          if (t < 1) {
            this.objectRemovalSliderAnimFrameId =
              requestAnimationFrame(animate);
          } else {
            onDone && onDone();
          }
        };

        this.objectRemovalSliderAnimFrameId = requestAnimationFrame(animate);
      };

      const runNext = () => {
        const nextValue =
          this.objectRemovalSliderPoints[this.objectRemovalSliderIndex];
        this.objectRemovalSliderIndex =
          (this.objectRemovalSliderIndex + 1) %
          this.objectRemovalSliderPoints.length;

        setTimeout(() => {
          smoothMove(nextValue, moveDuration, runNext);
        }, pauseTime);
      };

      // Start first move from 50 → 25
      smoothMove(25, moveDuration, runNext);

      this.objectRemovalSliderIntervalId = true;
    },

    stopObjectRemovalSliderAnimation() {
      this.objectRemovalSliderIntervalId = null;
      cancelAnimationFrame(this.objectRemovalSliderAnimFrameId);
      this.objectRemovalSliderAnimFrameId = null;
    },
    //end object removal end

    // start floor chage
    startFloorChangeSliderAnimation() {
      if (this.floorChangeSliderIntervalId) return;

      // Start at the end like 3D slider
      this.floorChangeSliderPosition = 85;
      this.floorChangeSliderPoints = [85, 25];
      this.floorChangeSliderIndex = 1; // next move → 25

      const pauseTime = 1000; // pause at ends
      const moveDuration = 1500; // move duration

      const smoothMoveFloorChange = (
        target,
        duration = moveDuration,
        onDone,
      ) => {
        cancelAnimationFrame(this.floorChangeSliderAnimFrameId);

        const start = this.floorChangeSliderPosition;
        const diff = target - start;
        const startTime = performance.now();

        const animate = (now) => {
          const t = Math.min((now - startTime) / duration, 1);
          const ease =
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          this.floorChangeSliderPosition = +(start + diff * ease).toFixed(2);

          if (t < 1) {
            this.floorChangeSliderAnimFrameId = requestAnimationFrame(animate);
          } else {
            onDone && onDone();
          }
        };

        this.floorChangeSliderAnimFrameId = requestAnimationFrame(animate);
      };

      const runNext = () => {
        const nextValue =
          this.floorChangeSliderPoints[this.floorChangeSliderIndex];
        this.floorChangeSliderIndex =
          (this.floorChangeSliderIndex + 1) %
          this.floorChangeSliderPoints.length;

        setTimeout(() => {
          smoothMoveFloorChange(nextValue, moveDuration, runNext);
        }, pauseTime);
      };

      // Start first move: 85 → 25 after pause
      setTimeout(() => {
        smoothMoveFloorChange(25, moveDuration, runNext);
      }, pauseTime);

      this.floorChangeSliderIntervalId = true;
    },

    stopFloorChangeSliderAnimation() {
      this.floorChangeSliderIntervalId = null;
      cancelAnimationFrame(this.floorChangeSliderAnimFrameId);
      this.floorChangeSliderAnimFrameId = null;
    },
    //  end floor chage

    // end services sliding window animation
    //start steper animation
    stopStepAnimation() {
      clearInterval(this.intervalId);
    },
    startStepAnimation() {
      this.runCycle();
      this.step2RunWave();

      this.intervalId = setInterval(this.runCycle, 8000);
    },
    step2RunWave() {
      this.step2ShowNewImg = false;
      this.step2ShowWave = false;

      setTimeout(() => {
        this.step2ShowWave = true;
        this.step2WaveKey++;
      }, 1000);
    },

    step2OnWaveEnd() {
      // show new image smoothly (crossfade)
      this.step2ShowNewImg = true;

      // remove wave
      this.step2ShowWave = false;

      // loop again after 2 sec
      setTimeout(() => {
        this.step2RunWave();
      }, 2000);
    },
    runCycle() {
      // Step 1: start hidden
      this.overlayVisible = false;
      this.overlayShrink = false;

      // Step 2: show full
      setTimeout(() => {
        this.overlayVisible = true;
        this.overlayShrink = false;
      }, 2000);

      // Step 3: shrink to small
      setTimeout(() => {
        this.overlayShrink = true;
      }, 4000);

      // Step 4: go back to full again
      setTimeout(() => {
        this.overlayShrink = false; // full again
      }, 6000);

      // Step 5: hide
      setTimeout(() => {
        this.overlayVisible = false;
        this.overlayShrink = false;
      }, 8000);
    },
    // end step animation
    handleAuthorizeClick(action) {
      if (action === "processPhoto") {
        // Show processing state
        this.isProcessing = true;

        // Simulate processing (replace with your API call)
        setTimeout(() => {
          this.isProcessing = false;
          // Your navigation logic here
          this.$router.push(this.redictConfig);
        }, 9000); // 4s processing demo

        return; // Don't trigger original login logic
      }

      // Original logic for other actions
      if (!this.isLogedIn) {
        this.$router.push({
          path: "/login",
          query: { redirect: this.redictConfig[action] },
        });
      } else {
        this.$router.push(this.redictConfig[action]);
      }
    },

    handleAuthorizeClick(action) {
      if (action === "processPhoto") {
        this.isProcessing = true;

        // Simulate AI detection
        setTimeout(() => {
          this.showFurnitureMask = true; // Show blue mask
          setTimeout(() => {
            this.isProcessing = false;
          }, 1500);
        }, 2500);
      }
    },

    toggleImageContainerWidth() {
      this.imageContainerFullWidth = true; // 👈 true = full width (no mx-auto)
    },

    closeProductTab() {
      this.showProductModal = false;
      this.imageContainerFullWidth = false; // 👈 false = mx-auto (centered)
    },

    // Form submission
    submitForm() {
      console.log("Form submitted:", this.form);
      alert("Message sent!");
    },
    stopCorrespondingAnimation(slider) {
      if (slider === "virtualStaging") {
        this.stopStepVSSliderAnimation();
      } else if (slider === "rendering3D") {
        this.stopStep3DSliderAnimation();
      } else if (slider === "objectRemoval") {
        this.stopObjectRemovalSliderAnimation();
      } else if (slider === "floorChange") {
        this.stopFloorChangeSliderAnimation();
      }
    },
    // Image slider drag functionality
    startDrag(slider, event) {
      this.stopCorrespondingAnimation(slider);
      this.isDragging = slider;
      this.handleDrag(slider, event);

      if (event.type === "mousedown") {
        document.addEventListener("mousemove", this.onDrag);
        document.addEventListener("mouseup", this.stopDrag);
      } else {
        document.addEventListener("touchmove", this.onDrag);
        document.addEventListener("touchend", this.stopDrag);
      }
    },

    onDrag(event) {
      if (!this.isDragging) return;
      this.handleDrag(this.isDragging, event);
    },

    handleDrag(slider, event) {
      const containerMap = {
        virtualStaging: this.$refs.virtualStagingContainer,
        rendering3D: this.$refs.rendering3DContainer,
        objectRemoval: this.$refs.objectRemovalContainer,
        floorChange: this.$refs.FloorRemovalContainer,
      };

      const positionMap = {
        virtualStaging: "virtualStagingSliderPosition",
        rendering3D: "rendering3DSliderPosition",
        objectRemoval: "removeObjectSliderPosition",
        floorChange: "floorChangeSliderPosition",
      };

      const container = containerMap[slider];
      console.log("container:", slider);
      if (!container) return;
      console.log("container:****", container);
      const rect = container.getBoundingClientRect();
      const x = event.type.includes("mouse")
        ? event.clientX
        : event.touches[0].clientX;

      const position = ((x - rect.left) / rect.width) * 100;
      const clampedPosition = Math.max(0, Math.min(100, position));
      console.log("poooo", clampedPosition);

      this[positionMap[slider]] = clampedPosition;
    },

    stopDrag() {
      this.isDragging = null;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.stopDrag);
      document.removeEventListener("touchmove", this.onDrag);
      document.removeEventListener("touchend", this.stopDrag);
    },

    // Virtual Staging Navigation
    nextVirtualStagingImage() {
      this.virtualStagingImageIndex =
        (this.virtualStagingImageIndex + 1) %
        this.virtualStagingImageSet.length;
      this.virtualStagingImages =
        this.virtualStagingImageSet[this.virtualStagingImageIndex];
      this.virtualStagingSliderPosition = 50;
    },

    prevVirtualStagingImage() {
      this.virtualStagingImageIndex =
        this.virtualStagingImageIndex === 0
          ? this.virtualStagingImageSet.length - 1
          : this.virtualStagingImageIndex - 1;
      this.virtualStagingImages =
        this.virtualStagingImageSet[this.virtualStagingImageIndex];
      this.virtualStagingSliderPosition = 50;
    },

    // 3D Rendering Navigation
    nextRendering3DImage() {
      this.rendering3DImageIndex =
        (this.rendering3DImageIndex + 1) % this.rendering3DImageSet.length;
      this.rendering3DImages =
        this.rendering3DImageSet[this.rendering3DImageIndex];
      this.rendering3DSliderPosition = 50;
    },

    prevRendering3DImage() {
      this.rendering3DImageIndex =
        this.rendering3DImageIndex === 0
          ? this.rendering3DImageSet.length - 1
          : this.rendering3DImageIndex - 1;
      this.rendering3DImages =
        this.rendering3DImageSet[this.rendering3DImageIndex];
      310310;
      this.rendering3DSliderPosition = 50;
    },

    nextRemoveObjectImage() {
      this.removeObjectImageIndex =
        (this.removeObjectImageIndex + 1) % this.removeObjectImageSet.length;
      this.RemovingObjectImages =
        this.removeObjectImageSet[this.removeObjectImageIndex];
      this.removeObjectSliderPosition = 50;
    },

    prevRemoveObectImage() {
      this.removeObjectImageIndex =
        this.removeObjectImageIndex === 0
          ? this.removeObjectImageSet.length - 1
          : this.removeObjectImageIndex - 1;
      this.RemovingObjectImages =
        this.removeObjectImageSet[this.removeObjectImageIndex];
      this.removeObjectSliderPosition = 50;
    },

    //remove floor
    // 3D Rendering Navigation
    nextRenderingFloorImage() {
      this.floorChangeImageIndex =
        (this.floorChangeImageIndex + 1) % this.renderingFloorImageSet.length;
      this.FloorChangeImages =
        this.renderingFloorImageSet[this.floorChangeImageIndex];
      this.floorChangeSliderPosition = 50;
    },

    prevRenderingFloorImage() {
      this.floorChangeImageIndex =
        this.floorChangeImageIndex === 0
          ? this.renderingFloorImageSet.length - 1
          : this.floorChangeImageIndex - 1;
      this.FloorChangeImages =
        this.renderingFloorImageSet[this.floorChangeImageIndex];
      this.floorChangeSliderPosition = 50;
    },

    tryVirtualStaging() {
      console.log("Try Virtual Staging clicked");
      // Add your navigation or action here
    },

    try3DRendering() {
      console.log("Try 3D Rendering clicked");
      // Add your navigation or action here
    },
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },

  beforeUnmount() {
    // Clean up event listeners
    this.stopDrag();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Proza+Libre:wght@400;500;600;700;800;900&display=swap");

.banner-text {
  font-family: "Poppins", sans-serif;

  font-size: 26px;
  line-height: 1.2;
}

@media (min-width: 450px) {
  .banner-text {
    font-size: 26px;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .banner-text {
    font-size: 36px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .banner-text {
    font-size: 48px;
  }
}

@import url("https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;700&family=Poppins:wght@400;700&display=swap");

/* Example class for number (95%) */
.card-number {
  font-family: "Public Sans", sans-serif !important;
  font-weight: 700;
  font-size: 46px;
  line-height: 52px;
  color: #3b63fb;
  margin: 0;
  text-align: center;
}

/* Example class for text (Cheaper) */
.card-label {
  font-family: "Poppins", sans-serif !important;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: -2%;
  color: #000;
  margin: 4px 0 0 0;
  text-align: center;
}

@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap");

.icon-text {
  font-family: "Poppins", sans-serif !important;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  margin-top: 10px;
  text-align: center;
}

@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap");

:deep(.font-poppins) {
  font-family: "Poppins", sans-serif !important;
}

@import url("https://fonts.googleapis.com/css2?family=Proza+Libre:wght@400;600;700&family=Rubik:wght@500&display=swap");

.section-container {
  background-color: white;
  max-width: 1200px;
  margin: 0;
  padding: 40px 12px;
  position: relative;
  font-family: "Proza Libre", sans-serif;
}

/* Header Styles */
.header {
  text-align: center;
  margin-bottom: 64px;
}

.header-title {
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 20px;
  margin: 0 auto; /* centers the h1 */
  text-align: center; /* ensures text stays centered */
}
.header-text {
  font-size: 16px;
  color: #6b7280;
}

/* Steps Wrapper */
.steps-wrapper {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: start;
}

/* Step Text Container */
.step-text-container {
  width: 50%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
}

.step-content {
  position: relative;
}

.step-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  margin-top: 80px;
  color: #000;
}

.step-description {
  color: #6b7280;
  line-height: 1.2;
}

/* Step Image Container */
.step-image-container {
  width: 50%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Image Box */
.image-box {
  width: 415px;
  height: 275px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Step 1 Specific */
.step1-box {
  background-color: black;
  border-radius: 16px;
}

.upload-sec {
  width: 175px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.upload-instruction {
  width: 100%;
}

.second-phase-image {
  border-radius: 22px;
}
.step1-number {
  font-size: 125px;
  font-weight: 300;
  color: #d1d5db;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
}

.drag-text {
  color: #9ca3af;
  font-size: 14px;
}

.overlay-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: -24px;
  left: 0;
  transition:
    transform 0.9s ease,
    width 0.9s ease,
    height 0.9s ease,
    top 0.9s ease,
    left 0.9s ease;
  /* top: 80px;
  left: 225px; */
  /* width: 274px;
  height: 213px; */
  /* background-image: url("/thirdcardbg.svg"); */
  border-radius: 16px;
  transform: translateY(24px);
  overflow: hidden;
}
.overlay-img {
  width: 100%;
  height: 100%;
}

.phase-1-image {
  position: absolute;
  border-radius: 22px;
  width: 100%;
  height: 100%;
}

/* SVG Lines */
.svg-line {
  position: absolute;
  width: 260px;
  height: 320px;
  display: flex;
  justify-content: center;
  z-index: 0;
}

.line1 {
  left: 50%;
  transform: translate(8%, 80px);
}

.line2 {
  left: 50%;
  top: 760px;
  transform: translate(10%, -75%);
}

.line-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Step 2 Specific */
.step2-image {
  transform: translateX(320px);
  margin-top: 120px;
}

.step2-box {
  background-image: url("/thirdcardbg.svg");
}

.step2-number {
  font-size: 125px;
  color: #4b5563;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

/* Blue furniture glow */
.home_main_banner_mask {
  filter: hue-rotate(220deg) /* Blue tint */ brightness(1.4) /* Brighter */
    saturate(1.8) /* Vivid */ drop-shadow(0 0 15px rgba(59, 130, 246, 0.8));
}

.ai-badge {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
  background-color: #4f6ef7;
  color: white;
  padding: 10px 18px;
  border-radius: 6px;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  z-index: 10;
}

/* @keyframes shimmer-single-line {
  0% {
    transform: translateX(-7960%);
    box-shadow: 
      0 0 25px rgba(103, 58, 183, 0.8),     
      -120px 0 80px rgba(237, 6, 245, 0.3),
      -200px 0 120px rgba(237, 6, 245, 0.1),
      0 60px 85px rgba(59, 130, 246, 0.8);
  }
  
  50% {
    transform: translateX(7920%);
    box-shadow: 
      0 0 25px rgba(103, 58, 183, 0.8),     
      120px 0 80px rgba(59, 130, 246, 0.3),
      200px 0 120px rgba(59, 130, 246, 0.1),
      0 60px 85px rgba(59, 130, 246, 0.8);
  }
  
  100% {
    transform: translateX(-7920%);
    box-shadow: 
      0 0 25px rgba(103, 58, 183, 0.8),
      -120px 0 80px rgba(237, 6, 245, 0.3),
      -200px 0 120px rgba(237, 6, 245, 0.1),
      0 60px 85px rgba(59, 130, 246, 0.8);
  }
} */

@keyframes shimmer-single-line {
  0% {
    left: -80px; /* Start LEFT */
  }
  48% {
    left: 110%; /* Go RIGHT */
  }
  52% {
    left: 110%; /* Pause RIGHT */
  }
  100% {
    left: -80px; /* Return LEFT */
  }
}

/* overlay container */
.animate-shimmer-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* IMPORTANT: no background / no background-size here */
}

/* the moving line */
.animate-shimmer-overlay {
  position: absolute;
  top: 0;
  left: -80px; /* Animation controls this */
  width: 80px;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(0, 123, 255, 0),
    rgba(50, 36, 243, 0.4),
    rgba(0, 123, 255, 0.9)
  );
  animation: shimmer-single-line 4s ease-in-out infinite; /* 4s full cycle */
  border-radius: 2px;
  pointer-events: none;
}

.faq-collapse.ant-collapse {
  border: none;
}

.faq-collapse .ant-collapse-item {
  border-bottom: none !important;
}

/* Target each collapse panel */
.faq-collapse .ant-collapse-item {
  position: relative;
}

/* Divider line */
.faq-collapse .ant-collapse-item:not(:last-child)::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.35),
    /* dark left */ rgba(0, 0, 0, 0.15) 40%,
    rgba(0, 0, 0, 0.05) 70%,
    rgba(0, 0, 0, 0) 100% /* fade right */
  );
}

.step2-text {
  transform: translateX(40px);
  margin-top: 80px;
}

.step2-content-inner {
  transform: translateX(160px);
}

/* Step 3 Specific */
.step3-text {
  margin-top: 120px;
}

.step3-bg-number {
  font-size: 80px;
  font-weight: 300;
  color: #d1d5db;
  position: absolute;
  top: -40px;
  left: -20px;
  z-index: -10;
}

.step3-image {
  margin-top: 144px;
}

.step3-box {
  background-image: url("/thirdcardbg.svg");
  height: 274px;
}

@keyframes pulse-flash {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(156, 163, 175, 0.5);
    transform: scale(1);
    background: linear-gradient(to right, #9ca3af, #6b7280);
  }
  50% {
    transform: scale(1);
    background: linear-gradient(to right, #6b7280, #0168f7);
  }
}

.animate-pulse-flash {
  animation: pulse-flash 1.2s ease-in-out infinite;
}

.step3-number {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  font-size: 110px;
  font-weight: 500;
  color: #4b5563;
  line-height: 1;
  font-family: "Rubik", sans-serif;
}

.phase-3-image {
  border-radius: 22px;
}

::v-deep .ant-collapse-header {
  font-size: 18px !important;
  font-weight: 400 !important;
}

.action-buttons {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
  display: flex;
  gap: 10px;

  animation: actionBtnFloat 2.5s ease-in-out infinite;
}
.ai-glow-btn {
  background: linear-gradient(120deg, #0332ed, #207ded, #3b63fb);
  background-size: 200% 200%;
  animation: gradient-shine 8s ease infinite;
}

/* Soft breathing glow */
.ai-glow-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: inherit;
  filter: blur(14px);
  opacity: 0.35;
  z-index: 0;
  animation: glow-pulse 4s ease-in-out infinite;
}

/* Gradient movement */
@keyframes gradient-shine {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Very subtle glow pulse */
@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.25;
  }
  50% {
    opacity: 0.4;
  }
}

.action-btn {
  background: transparent !important;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Step Number */
.step-number {
  position: absolute;
  z-index: 9;
}

.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.product-card {
  background-color: #111827; /* gray-900 */
  border-radius: 12px; /* rounded-xl */
  padding: 16px; /* p-4 */
  border: 1px solid #1f2937; /* gray-800 */
  transition: all 0.2s ease;
}

.product-card:hover {
  border-color: #4b5563; /* gray-600 */
  transform: translateY(-2px);
}

.card-glow-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}

.card-glow-wrapper::after {
  content: "";
  position: absolute;
  bottom: -40px;
  width: 85%;
  height: 120px;
  background: radial-gradient(
    ellipse at center,
    rgba(59, 130, 246, 0.45) 0%,
    rgba(59, 130, 246, 0.25) 35%,
    rgba(59, 130, 246, 0.08) 60%,
    rgba(59, 130, 246, 0) 75%
  );
  filter: blur(25px);
  z-index: 0;
}

.dyad-button {
  position: relative;
  width: 100%;
  max-width: 250px;
  height: 45px;
  background: #3b63fb;
  border: none;
  border-radius: 12px;
  color: white;
  margin: auto;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  overflow: hidden;
}

.dyad-button:hover {
  background: #2952ea;
  color: white;

  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 99, 251, 0.3);
}

.dyad-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(59, 99, 251, 0.2);
}

.button-content {
  position: relative;
  z-index: 2;
}

/* Star decorations */
.star {
  position: absolute;
  color: white;
}

.star-1 {
  top: 15px;
  right: 18px;
  font-size: 24px;
}

.star-2 {
  top: 8px;
  right: 8px;
  font-size: 16px;
}

.star-3 {
  bottom: 8px;
  left: 12px;
  font-size: 24px;
}

/* Custom star shapes using CSS */
.css-star {
  position: absolute;
  color: white;
}

.css-star::before {
  content: "✦";
  display: inline-block;
}

.css-star-1 {
  top: 15px;
  right: 18px;
  font-size: 24px;
}

.css-star-2 {
  top: 8px;
  right: 8px;
  font-size: 16px;
}

.css-star-3 {
  bottom: 8px;
  left: 12px;
  font-size: 20px;
}

/* Alternative using Unicode stars */
.unicode-star::before {
  content: "✨";
}

.unicode-star-alt::before {
  content: "⭐";
}

.unicode-star-sparkle::before {
  content: "✦";
}

.banner-text {
  font-weight: 700;
  color: black;
  font-size: 32px;
}
.floor-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  position: absolute;
  z-index: -1;
  right: -65px;
  top: -65px;
  border-radius: 16px;
  border: 0.5px solid gainsboro;
}

@media (min-width: 1024px) {
  .banner-text {
    font-size: 44px;
  }
}
@media screen and (max-width: 1023px) {
  .overlay-box {
    top: -24px;
    left: 0px;
  }
  .floor-repersentation-sec {
    margin-top: 50px;
    width: 85%;
  }
  /* .overlay-box.shrink{
     top: 80px;        
    left: auto;       
    right: -100px;
  } */
}
@media screen and (max-width: 768px) {
  .md-room-size {
    height: 220px;
    margin-bottom: 10px;
  }
  .floor-repersentation-sec {
    margin-top: 30px;
  }
  .overlay-box.shrink {
    width: 218px;
    height: 180px;
    top: 120px !important;
    left: auto;
    right: 0px !important;
    /* transform: scale(1); */
  }
}

@media screen and (max-width: 480px) and (min-width: 320px) {
  /* .floor-image {
    width: 100px;
    height: 100px;
    top: -50px;
    right: -50px;
  } */
  .image-box {
    width: 301px !important;
    height: 219px;
  }

  /* .overlay-box{
    width: 100%;
    height:100%;
  } */

  .overlay-box.shrink {
    width: 218px;
    height: 170px;
    top: 80px !important;
    left: auto !important;
    right: -10px !important;
    transform: scale(1);
  }
}

.overlay-box.shrink {
  top: 40px;
  left: 230px;

  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);

  /* IMPORTANT: keep transform scale 1, because we are resizing width/height */
  transform: scale(1);
}

.step-2-wave-container {
  position: relative;
  width: 100%;
  height: 275px;
  overflow: hidden;
  border-radius: 14px;
}
.step2-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* old image always visible */
.step2-img.base {
  opacity: 1;
  z-index: 1;
}

/* new image starts hidden */
.step2-img.top {
  opacity: 0;
  z-index: 2;
  transition: opacity 0.5s ease-in-out;
}

/* when wave ends, new image fades in */
.step2-img.top.show {
  opacity: 1;
}

.step2-wave-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease-in-out;
}
.step2-wave-image.img-fade {
  opacity: 0;
}

@keyframes step2WaveMove {
  0% {
    left: -80px;
  }
  100% {
    left: 110%;
  }
}

.step2-wave-overlay {
  position: absolute;
  top: 0;
  left: -80px;
  width: 80px;
  height: 100%;
  z-index: 10;
  background: linear-gradient(
    90deg,
    rgba(0, 123, 255, 0),
    rgba(0, 123, 255, 0.4),
    rgba(0, 123, 255, 0.9)
  );

  animation: step2WaveMove 2.5s ease-in-out forwards;
}

@keyframes actionBtnFloat {
  0%,
  15% {
    transform: translate(-50%, 50%);
  }
  50% {
    transform: translate(-50%, -10%);
  }
  85%,
  100% {
    transform: translate(-50%, 50%);
  }
}
</style>
