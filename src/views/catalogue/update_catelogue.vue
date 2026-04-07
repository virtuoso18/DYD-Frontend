<template>
    <!-- <hr> {{ planDetails?.plan_name  }}
    <hr> {{ planDetails }}
    <hr> {{ planIsExpired }} 
    <hr> -->
  <!-- show Rendering Failed Model  -->
  <a-modal
    v-model:open="showFailedRenderingModel"
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
        Failed Rendering
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
        {{ failure_reason }}
      </p>
      <!-- CTA button -->
      <!-- <a-button
        v-if="currentUser.user_type !== 'User'"
        type="primary"
        block
        size="large"
        style="height: 46px; font-size: 16px; border-radius: 8px"
        @click="goToPurchaseCredits"
      >
        Purchase Credits
      </a-button>

      <a-button
        v-else
        type="primary"
        block
        size="large"
        :loading="LoadingMessageButton"
        style="
          height: 46px;
          font-size: 16px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
        @click="startchat_with_buisness_user"
      >
        <MessageOutlined style="font-size: 16px" />
        Message Business
      </a-button> -->
    </div>
  </a-modal>
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

      <!-- CTA button -->
      <a-button
        v-if="currentUser.user_type !== 'User'"
        type="primary"
        block
        size="large"
        style="height: 46px; font-size: 16px; border-radius: 8px"
        @click="goToPurchaseCredits"
      >
        Purchase Credits
      </a-button>

      <a-button
        v-else
        type="primary"
        block
        size="large"
        :loading="LoadingMessageButton"
        style="
          height: 46px;
          font-size: 16px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
        @click="startchat_with_buisness_user"
      >
        <MessageOutlined style="font-size: 16px" />
        Message Business
      </a-button>
    </div>
  </a-modal>

  <PlanUpgradeModal
    :visible="showPlanUpgradeModal"
    @update:visible="handlePlanUpgradeModalClose"
    @upgrade="handlePlanUpgrade"
  />

  <!-- Walls Drawer -->
  <a-drawer
    :placement="'bottom'"
    :closable="true"
    :open="openSeeAll_Walls"
    height="90%"
    :bodyStyle="{ padding: '0 0px 0px' }"
    style="
      border-top-left-radius: 20px;

      border-top-right-radius: 20px;
    "
    @close="onClose_drawer_modal"
  >
    <template #title>
      <div style="display: flex; gap: 10px">
        <router-link :to="'/' + this.$route.query.brand">
          <div style="display: flex; gap: 10px">
            <a-avatar
              size="medium"
              style="margin-top: 6px; border: 1px solid rgba(0, 0, 0, 0.2)"
              :src="
                this.$store.state.root_media_api + brand_data.business_picture
              "
            ></a-avatar>
            <span
              class="!text-gray-700 py-3"
              style="
                font-family: Poppins;
                font-weight: 700;
                font-style: normal;
                font-size: 16px;
                line-height: 20px;
                letter-spacing: 0;
              "
              >{{ brand_data.name }} AI Catalog Wall Textures</span
            >
            <!-- {{ brand_data }} -->
            <!-- <b>  {{truncateChars(brand_data.name,limit=15)}}</b> -->
          </div>
        </router-link>
        <div
          style="display: flex; margin-top: 5px"
          v-if="user?.user_type === 'Professional'"
        >
          <a-button
            tooltip="switch brand"
            @click="showSwitchBrandPanel"
            style="display: flex; justify-content: center; align-items: center"
            shape="circle"
            ><SwapOutlined
          /></a-button>
        </div>
      </div>
    </template>
    <template #extra>
      <div class="head-section">
        <a-button
          type="primary"
          style="
            display: flex;
            justify-content: center;
            gap: 10px;
            color: white;
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
              d="M12 15.575C11.8667 15.575 11.7417 15.5543 11.625 15.513C11.5083 15.4717 11.4 15.4007 11.3 15.3L7.7 11.7C7.5 11.5 7.404 11.2667 7.412 11C7.42 10.7333 7.516 10.5 7.7 10.3C7.9 10.1 8.13767 9.996 8.413 9.988C8.68833 9.98 8.92567 10.0757 9.125 10.275L11 12.15V5C11 4.71667 11.096 4.47934 11.288 4.288C11.48 4.09667 11.7173 4.00067 12 4C12.2827 3.99934 12.5203 4.09534 12.713 4.288C12.9057 4.48067 13.0013 4.718 13 5V12.15L14.875 10.275C15.075 10.075 15.3127 9.979 15.588 9.987C15.8633 9.995 16.1007 10.0993 16.3 10.3C16.4833 10.5 16.5793 10.7333 16.588 11C16.5967 11.2667 16.5007 11.5 16.3 11.7L12.7 15.3C12.6 15.4 12.4917 15.471 12.375 15.513C12.2583 15.555 12.1333 15.5757 12 15.575ZM6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18V16C4 15.7167 4.096 15.4793 4.288 15.288C4.48 15.0967 4.71733 15.0007 5 15C5.28267 14.9993 5.52033 15.0953 5.713 15.288C5.90567 15.4807 6.00133 15.718 6 16V18H18V16C18 15.7167 18.096 15.4793 18.288 15.288C18.48 15.0967 18.7173 15.0007 19 15C19.2827 14.9993 19.5203 15.0953 19.713 15.288C19.9057 15.4807 20.0013 15.718 20 16V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H6Z"
              fill="white"
            />
          </svg>
          Download
        </a-button>
      </div>
    </template>
    <div className="md:p-3 p-1">
      <wall_textures_bottom_drawer_menu :products="seeAll_Walls" />
    </div>
  </a-drawer>
  <!-- Floor Drawer -->
  <a-drawer
    placement="bottom"
    :closable="true"
    :open="openSeeAll_Floor"
    height="90%"
    :bodyStyle="{ padding: '0' }"
    class="!rounded-tl-2xl !rounded-tr-2xl"
    @close="onClose_drawer_modal"
  >
    <template #title>
      <div class="flex items-center gap-2 flex-wrap">
        <router-link
          :to="'/' + this.$route.query.brand"
          class="flex items-center gap-2 min-w-0"
        >
          <a-avatar
            size="medium"
            class="!mt-1 !border !border-black/20 flex-shrink-0"
            :src="
              this.$store.state.root_media_api + brand_data.business_picture
            "
          />
          <span
            class="!text-gray-700 font-[Poppins] !font-semibold !text-xs sm:!text-base !leading-5 truncate"
          >
            {{ brand_data.name }} AI Catalog Floor Textures
          </span>
        </router-link>

        <div
          v-if="user?.user_type === 'Professional'"
          class="flex items-center !ml-1 flex-shrink-0"
        >
          <a-button
            shape="circle"
            class="!flex !items-center !justify-center"
            @click="showSwitchBrandPanel"
          >
            <SwapOutlined />
          </a-button>
        </div>
      </div>
    </template>

    <template #extra>
      <a-button
        type="primary"
        class="!flex !items-center !justify-center !gap-2"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15.575C11.8667 15.575 11.7417 15.5543 11.625 15.513C11.5083 15.4717 11.4 15.4007 11.3 15.3L7.7 11.7C7.5 11.5 7.404 11.2667 7.412 11C7.42 10.7333 7.516 10.5 7.7 10.3C7.9 10.1 8.13767 9.996 8.413 9.988C8.68833 9.98 8.92567 10.0757 9.125 10.275L11 12.15V5C11 4.71667 11.096 4.47934 11.288 4.288C11.48 4.09667 11.7173 4.00067 12 4C12.2827 3.99934 12.5203 4.09534 12.713 4.288C12.9057 4.48067 13.0013 4.718 13 5V12.15L14.875 10.275C15.075 10.075 15.3127 9.979 15.588 9.987C15.8633 9.995 16.1007 10.0993 16.3 10.3C16.4833 10.5 16.5793 10.7333 16.588 11C16.5967 11.2667 16.5007 11.5 16.3 11.7L12.7 15.3C12.6 15.4 12.4917 15.471 12.375 15.513C12.2583 15.555 12.1333 15.5757 12 15.575ZM6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18V16C4 15.7167 4.096 15.4793 4.288 15.288C4.48 15.0967 4.71733 15.0007 5 15C5.28267 14.9993 5.52033 15.0953 5.713 15.288C5.90567 15.4807 6.00133 15.718 6 16V18H18V16C18 15.7167 18.096 15.4793 18.288 15.288C18.48 15.0967 18.7173 15.0007 19 15C19.2827 14.9993 19.5203 15.0953 19.713 15.288C19.9057 15.4807 20.0013 15.718 20 16V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H6Z"
            fill="white"
          />
        </svg>
        <span className="!hidden sm:!flex">Download</span>
      </a-button>
    </template>

    <div class="p-1 md:p-3">
      <floor_textures_bottom_drawer_menu :products="seeAll_Floor" />
    </div>
  </a-drawer>

  <!-- Furniture Drawer -->
  <a-drawer
    :placement="'bottom'"
    :closable="true"
    :open="openSeeAll_furnitures"
    height="90%"
    :bodyStyle="{ padding: '0 0px 0px' }"
    style="border-top-left-radius: 20px; border-top-right-radius: 20px"
    @close="onClose_drawer_modal"
  >
    <template #title>
      <div style="display: flex; gap: 10px">
        <router-link :to="'/' + this.$route.query.brand">
          <div style="display: flex; gap: 10px">
            <a-avatar
              size="medium"
              style="margin-top: 6px; border: 1px solid rgba(0, 0, 0, 0.2)"
              :src="
                this.$store.state.root_media_api + brand_data.business_picture
              "
            ></a-avatar>
            <span
              class="!text-gray-700 py-3"
              style="
                font-family: Poppins;
                font-weight: 700;
                font-style: normal;
                font-size: 16px;
                line-height: 20px;
                letter-spacing: 0;
              "
              >{{ brand_data.name }} AI Catalog Furnitures</span
            >
            <!-- {{ brand_data }} -->
            <!-- <b>  {{truncateChars(brand_data.name,limit=15)}}</b> -->
          </div>
        </router-link>
        <div
          style="display: flex; margin-top: 5px"
          v-if="user?.user_type === 'Professional'"
        >
          <a-button
            tooltip="switch brand"
            @click="showSwitchBrandPanel"
            style="display: flex; justify-content: center; align-items: center"
            shape="circle"
            ><SwapOutlined
          /></a-button>
        </div>
      </div>
    </template>

    <template #extra>
      <div class="head-section">
        <a-button
          type="primary"
          style="
            display: flex;
            justify-content: center;
            gap: 10px;
            color: white;
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
              d="M12 15.575C11.8667 15.575 11.7417 15.5543 11.625 15.513C11.5083 15.4717 11.4 15.4007 11.3 15.3L7.7 11.7C7.5 11.5 7.404 11.2667 7.412 11C7.42 10.7333 7.516 10.5 7.7 10.3C7.9 10.1 8.13767 9.996 8.413 9.988C8.68833 9.98 8.92567 10.0757 9.125 10.275L11 12.15V5C11 4.71667 11.096 4.47934 11.288 4.288C11.48 4.09667 11.7173 4.00067 12 4C12.2827 3.99934 12.5203 4.09534 12.713 4.288C12.9057 4.48067 13.0013 4.718 13 5V12.15L14.875 10.275C15.075 10.075 15.3127 9.979 15.588 9.987C15.8633 9.995 16.1007 10.0993 16.3 10.3C16.4833 10.5 16.5793 10.7333 16.588 11C16.5967 11.2667 16.5007 11.5 16.3 11.7L12.7 15.3C12.6 15.4 12.4917 15.471 12.375 15.513C12.2583 15.555 12.1333 15.5757 12 15.575ZM6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18V16C4 15.7167 4.096 15.4793 4.288 15.288C4.48 15.0967 4.71733 15.0007 5 15C5.28267 14.9993 5.52033 15.0953 5.713 15.288C5.90567 15.4807 6.00133 15.718 6 16V18H18V16C18 15.7167 18.096 15.4793 18.288 15.288C18.48 15.0967 18.7173 15.0007 19 15C19.2827 14.9993 19.5203 15.0953 19.713 15.288C19.9057 15.4807 20.0013 15.718 20 16V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H6Z"
              fill="white"
            />
          </svg>
          <!-- Download -->
        </a-button>
      </div>
    </template>

    <div className="md:p-3 p-1">
      <furnitures_bottom_drawer_menu :products="seeAll_furnitures" />
    </div>
  </a-drawer>
  <!-- Lights Drawerr -->
  <a-drawer
    :placement="'bottom'"
    :closable="true"
    :open="openSeeAll_Lights"
    height="90%"
    :bodyStyle="{ padding: '0 0px 0px' }"
    style="border-top-left-radius: 20px; border-top-right-radius: 20px"
    @close="onClose_drawer_modal"
  >
    <template #title>
      <div style="display: flex; gap: 10px">
        <router-link :to="'/' + this.$route.query.brand">
          <div style="display: flex; gap: 10px">
            <a-avatar
              size="medium"
              style="margin-top: 6px; border: 1px solid rgba(0, 0, 0, 0.2)"
              :src="
                this.$store.state.root_media_api + brand_data.business_picture
              "
            ></a-avatar>
            <span
              class="!text-gray-700 py-3"
              style="
                font-family: Poppins;
                font-weight: 700;
                font-style: normal;
                font-size: 16px;
                line-height: 20px;
                letter-spacing: 0;
              "
              >{{ brand_data.name }} AI Catalog LightS</span
            >
            <!-- {{ brand_data }} -->
            <!-- <b>  {{truncateChars(brand_data.name,limit=15)}}</b> -->
          </div>
        </router-link>
        <div
          style="display: flex; margin-top: 5px"
          v-if="user?.user_type === 'Professional'"
        >
          <a-button
            tooltip="switch brand"
            @click.stop="showSwitchBrandPanel"
            style="display: flex; justify-content: center; align-items: center"
            shape="circle"
            ><SwapOutlined
          /></a-button>
        </div>
      </div>
    </template>
    <template #extra>
      <div class="head-section">
        <a-button
          type="primary"
          style="
            display: flex;
            justify-content: center;
            gap: 10px;
            color: white;
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
              d="M12 15.575C11.8667 15.575 11.7417 15.5543 11.625 15.513C11.5083 15.4717 11.4 15.4007 11.3 15.3L7.7 11.7C7.5 11.5 7.404 11.2667 7.412 11C7.42 10.7333 7.516 10.5 7.7 10.3C7.9 10.1 8.13767 9.996 8.413 9.988C8.68833 9.98 8.92567 10.0757 9.125 10.275L11 12.15V5C11 4.71667 11.096 4.47934 11.288 4.288C11.48 4.09667 11.7173 4.00067 12 4C12.2827 3.99934 12.5203 4.09534 12.713 4.288C12.9057 4.48067 13.0013 4.718 13 5V12.15L14.875 10.275C15.075 10.075 15.3127 9.979 15.588 9.987C15.8633 9.995 16.1007 10.0993 16.3 10.3C16.4833 10.5 16.5793 10.7333 16.588 11C16.5967 11.2667 16.5007 11.5 16.3 11.7L12.7 15.3C12.6 15.4 12.4917 15.471 12.375 15.513C12.2583 15.555 12.1333 15.5757 12 15.575ZM6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18V16C4 15.7167 4.096 15.4793 4.288 15.288C4.48 15.0967 4.71733 15.0007 5 15C5.28267 14.9993 5.52033 15.0953 5.713 15.288C5.90567 15.4807 6.00133 15.718 6 16V18H18V16C18 15.7167 18.096 15.4793 18.288 15.288C18.48 15.0967 18.7173 15.0007 19 15C19.2827 14.9993 19.5203 15.0953 19.713 15.288C19.9057 15.4807 20.0013 15.718 20 16V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H6Z"
              fill="white"
            />
          </svg>
          Download
        </a-button>
      </div>
    </template>
    <div className="md:p-3 p-1">
      <light_items_bottom_drawer_menu :products="seeAll_Lights" />
    </div>
  </a-drawer>

  <!-- Switch Brand Drawer -->
  <a-drawer
    :placement="'bottom'"
    :closable="true"
    :open="openSeeAll_brands_panel"
    height="90%"
    :bodyStyle="{ padding: '0 0px 0px' }"
    style="
      border-top-left-radius: 20px;

      border-top-right-radius: 20px;
    "
    @close="onClose_drawer_modal"
  >
    <template #title>
      <div style="display: flex; gap: 10px">
        <span
          class="!text-gray-700 py-3"
          style="
            font-family: Poppins;
            font-weight: 700;
            font-style: normal;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0;
          "
          >Explore DYD's Best AI Catalog Brands</span
        >
        <!-- {{ brand_data }} -->
        <!-- <b>  {{truncateChars(brand_data.name,limit=15)}}</b> -->
      </div>
    </template>
    <template #extra>
      <div class="head-section">
        <a-button
          type="primary"
          style="
            display: flex;
            justify-content: center;
            gap: 10px;
            color: white;
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
              d="M12 15.575C11.8667 15.575 11.7417 15.5543 11.625 15.513C11.5083 15.4717 11.4 15.4007 11.3 15.3L7.7 11.7C7.5 11.5 7.404 11.2667 7.412 11C7.42 10.7333 7.516 10.5 7.7 10.3C7.9 10.1 8.13767 9.996 8.413 9.988C8.68833 9.98 8.92567 10.0757 9.125 10.275L11 12.15V5C11 4.71667 11.096 4.47934 11.288 4.288C11.48 4.09667 11.7173 4.00067 12 4C12.2827 3.99934 12.5203 4.09534 12.713 4.288C12.9057 4.48067 13.0013 4.718 13 5V12.15L14.875 10.275C15.075 10.075 15.3127 9.979 15.588 9.987C15.8633 9.995 16.1007 10.0993 16.3 10.3C16.4833 10.5 16.5793 10.7333 16.588 11C16.5967 11.2667 16.5007 11.5 16.3 11.7L12.7 15.3C12.6 15.4 12.4917 15.471 12.375 15.513C12.2583 15.555 12.1333 15.5757 12 15.575ZM6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18V16C4 15.7167 4.096 15.4793 4.288 15.288C4.48 15.0967 4.71733 15.0007 5 15C5.28267 14.9993 5.52033 15.0953 5.713 15.288C5.90567 15.4807 6.00133 15.718 6 16V18H18V16C18 15.7167 18.096 15.4793 18.288 15.288C18.48 15.0967 18.7173 15.0007 19 15C19.2827 14.9993 19.5203 15.0953 19.713 15.288C19.9057 15.4807 20.0013 15.718 20 16V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H6Z"
              fill="white"
            />
          </svg>
          Download
        </a-button>
      </div>
    </template>
    <div className="md:p-3 p-1">
      <switch_business @switch-brand-profesional-user="switchRoomBrand" />
    </div>
  </a-drawer>

  <!-- Fetch All Drawer  -->
  <fetch_all_drawer_component
    :user_type="user?.user_type"
    @switch-brand-profesional="showSwitchBrandPanel"
    :openSeeAll_products="openSeeAll_products"
    :seeAll_Floor="seeAll_Floor"
    :seeAll_Walls="seeAll_Walls"
    :seeAll_furnitures="seeAll_furnitures"
    :seeAll_Lights="seeAll_Lights"
    @close="onClose_drawer_modal"
    :brand_data="brand_data"
  />

  <a-drawer
    title="Change Room  "
    :placement="'bottom'"
    :closable="true"
    :open="openSeeAll_ChangeRoom"
    height="90%"
    style="border-top-left-radius: 20px; border-top-right-radius: 20px"
    @close="onClose_drawer_modal"
  >
    <template #extra>
      <div class="head-section">
        <!-- <a-button type="primary"> <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.25 14.2288C3.35489 14.2288 2.49645 13.893 1.86351 13.2952C1.23058 12.6975 0.875 11.8867 0.875 11.0413C0.875 10.196 1.23058 9.38521 1.86351 8.78744C2.49645 8.18967 3.35489 7.85384 4.25 7.85384C5.14511 7.85384 6.00355 8.18967 6.63649 8.78744C7.26942 9.38521 7.625 10.196 7.625 11.0413C7.625 11.8867 7.26942 12.6975 6.63649 13.2952C6.00355 13.893 5.14511 14.2288 4.25 14.2288ZM11.75 7.14551C11.3068 7.14551 10.8679 7.06306 10.4584 6.90287C10.049 6.74269 9.67691 6.5079 9.36351 6.21191C9.05012 5.91592 8.80152 5.56454 8.63191 5.17781C8.4623 4.79109 8.375 4.3766 8.375 3.95801C8.375 3.53942 8.4623 3.12493 8.63191 2.7382C8.80152 2.35148 9.05012 2.00009 9.36351 1.7041C9.67691 1.40812 10.049 1.17333 10.4584 1.01314C10.8679 0.852955 11.3068 0.770508 11.75 0.770508C12.6451 0.770508 13.5035 1.10633 14.1365 1.7041C14.7694 2.30188 15.125 3.11263 15.125 3.95801C15.125 4.80339 14.7694 5.61414 14.1365 6.21191C13.5035 6.80968 12.6451 7.14551 11.75 7.14551ZM1.25 4.66634C1.25 3.72703 1.64509 2.8262 2.34835 2.162C3.05161 1.49781 4.00544 1.12467 5 1.12467H7.25V2.54134H5C4.40326 2.54134 3.83097 2.76522 3.40901 3.16374C2.98705 3.56225 2.75 4.10276 2.75 4.66634V6.79134H1.25V4.66634ZM13.25 8.20801V10.333C13.25 10.8966 13.0129 11.4371 12.591 11.8356C12.169 12.2341 11.5967 12.458 11 12.458H8.75V13.8747H11C11.9946 13.8747 12.9484 13.5015 13.6517 12.8373C14.3549 12.1732 14.75 11.2723 14.75 10.333V8.20801H13.25Z" fill="white"/>
</svg>

Switch Furniture</a-button> -->
      </div>
    </template>

    <!-- Examples -->
    <p class="history-label">Your History</p>
    <div class="example-images">
      <a-row>
        <a-col
          span="8"
          v-for="histry_card in your_history_change_room"
          :key="id"
          style="padding: 5px"
        >
          <div class="relative" style="overflow: hidden">
            <!-- Skeleton -->
            <div
              v-if="!imageLoadedMap[histry_card.id]"
              class="example-skeleton"
            ></div>

            <!-- Preload image -->
            <img
              :src="$store.state.root_media_api + histry_card.image"
              style="position: absolute; width: 0; height: 0; opacity: 0"
              @load="onHistoryImageLoad(histry_card.id)"
              alt=""
            />

            <!-- Visible image -->
            <img
              v-show="imageLoadedMap[histry_card.id]"
              @click="goToCatalogue(histry_card.id)"
              :src="$store.state.root_media_api + histry_card.image"
              class="example-image"
            />
          </div>
        </a-col>
      </a-row>
    </div>
    <div style="display: flex; justify-content: center; padding: 16px 0">
      <a-pagination
        :current="Math.floor(history_current_offset / history_limit) + 1"
        :total="history_total_count"
        :pageSize="history_limit"
        :showSizeChanger="false"
        @change="(page) => fetchUserHistoryRooms((page - 1) * history_limit)"
      />
    </div>

    <!-- Examples -->
    <p class="history-label">Use an example room</p>
    <div class="example-images">
      <a-row>
        <a-col
          span="8"
          v-for="example in exampleImages_changeRoom"
          :key="id"
          style="padding: 5px"
        >
          <img
            @click="startTestRoom(example.id)"
            :src="this.$store.state.root_media_api + example.image"
            class="example-image"
          />
        </a-col>
      </a-row>
    </div>
  </a-drawer>

  <add_new_furniture
    v-model:visible="showAddProduct"
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
  <a-row class="no-select">
    <a-col :sm="24" :xs="24" :md="0" :lg="0">
      <div class="controls-container">
        <!-- Top Action Buttons -->
        <div class="action-buttons">
          <div
            type="primary"
            :class="
              active_tab_image === 'item_replacement'
                ? 'action-btn active'
                : 'action-btn'
            "
            @click="selectActiveTab('item_replacement')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4.59 13.83V16.13M13.79 13.83V16.13"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
              />
              <path
                d="M15.32 7.70C15.32 6.27 15.32 5.55 15.01 5.02C14.81 4.67 14.52 4.38 14.17 4.18C13.64 3.87 12.92 3.87 11.49 3.87H6.89C5.46 3.87 4.74 3.87 4.21 4.18C3.86 4.38 3.57 4.67 3.37 5.02C3.06 5.55 3.06 6.27 3.06 7.70"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M15.32 7.70C14.48 7.70 13.79 8.39 13.79 9.23V10.77C13.79 11.40 13.66 11.53 13.03 11.53H5.36C4.73 11.53 4.59 11.40 4.59 10.77V9.23C4.59 8.39 3.91 7.70 3.06 7.70C2.21 7.70 1.53 8.39 1.53 9.23C1.53 9.80 1.84 10.30 2.29 10.56V10.77C2.29 12.21 2.29 12.93 2.74 13.38C3.19 13.83 3.92 13.83 5.36 13.83H13.03C14.47 13.83 15.19 13.83 15.64 13.38C16.09 12.93 16.09 12.21 16.09 10.77V10.56C16.55 10.30 16.86 9.80 16.86 9.23C16.86 8.39 16.17 7.70 15.32 7.70Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
            <span
              className="pl-1"
              style="
                font-family: Poppins;
                font-weight: 400;
                font-size: 12px;
                line-height: 20px;
                letter-spacing: 0%;
                text-align: center;
              "
              >Item Replace</span
            >
          </div>
          <div
            :class="
              active_tab_image === 'home_design'
                ? 'action-btn active'
                : 'action-btn'
            "
            @click="selectActiveTab('home_design')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M11.65 11.68V6.32C11.65 4.74 11.65 3.96 11.16 3.47C10.68 2.98 9.90 2.98 8.35 2.98H5.71C4.15 2.98 3.38 2.98 2.89 3.47C2.41 3.96 2.41 4.74 2.41 6.32V11.68C2.41 13.25 2.41 14.04 2.89 14.53C3.38 15.02 4.15 15.02 5.71 15.02H8.35C9.90 15.02 10.68 15.02 11.16 14.53C11.65 14.04 11.65 13.25 11.65 11.68Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M7.63 15.02H11.73C13.01 15.02 13.66 15.02 14.06 14.63C14.46 14.24 14.46 13.61 14.46 12.35V7.66C14.46 6.40 14.46 5.77 14.06 5.38C13.66 4.98 13.01 4.98 11.73 4.98"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M9.24 8.10V9.70"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            <span
              className="pl-1"
              style="
                font-family: Poppins;
                font-weight: 400;
                font-size: 12px;
                line-height: 20px;
                letter-spacing: 0%;
                text-align: center;
              "
              >Home Design</span
            >
          </div>
        </div>

        <!-- Category Tabs -->
        <div
          class="category-section"
          v-if="active_tab_image === 'item_replacement'"
        >
          <div class="category-tabs" style="padding-bottom: 5px">
            <div
              :class="
                select_replace === 'All'
                  ? 'category-tab active'
                  : 'category-tab'
              "
              @click="selectCategory('All')"
            >
              <svg
                width="1.875em"
                height="1.5em"
                viewBox="13 1 38 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 3L43.5 9.5L43.5 23L32 29L20.5 23L20.5 9.5L32 3ZM32 3V16.5"
                  stroke="currentColor"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M32 16.5L43.5 23L32 29L20.5 23L32 16.5Z"
                  fill="url(#paint0_linear_1_56)"
                  stroke="currentColor"
                  stroke-linejoin="round"
                ></path>
                <defs>
                  <linearGradient
                    id="paint0_linear_1_56"
                    x1="32"
                    y1="16.5"
                    x2="32"
                    y2="29"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#00000033" stop-opacity="0"></stop>
                    <stop offset="1" stop-color="#00000033"></stop>
                  </linearGradient>
                </defs>
              </svg>
              All
            </div>
           
            <div
              :class="
                select_replace === 'Furniture'
                  ? 'category-tab active'
                  : 'category-tab'
              "
              @click="selectCategory('Furniture')"
              v-if="brand_furniture_products.length > 0 && brand_is_saling_furniture"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4.59 13.83V16.13M13.79 13.83V16.13"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M15.32 7.70C15.32 6.27 15.32 5.55 15.01 5.02C14.81 4.67 14.52 4.38 14.17 4.18C13.64 3.87 12.92 3.87 11.49 3.87H6.89C5.46 3.87 4.74 3.87 4.21 4.18C3.86 4.38 3.57 4.67 3.37 5.02C3.06 5.55 3.06 6.27 3.06 7.70"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M15.32 7.70C14.48 7.70 13.79 8.39 13.79 9.23V10.77C13.79 11.40 13.66 11.53 13.03 11.53H5.36C4.73 11.53 4.59 11.40 4.59 10.77V9.23C4.59 8.39 3.91 7.70 3.06 7.70C2.21 7.70 1.53 8.39 1.53 9.23C1.53 9.80 1.84 10.30 2.29 10.56V10.77C2.29 12.21 2.29 12.93 2.74 13.38C3.19 13.83 3.92 13.83 5.36 13.83H13.03C14.47 13.83 15.19 13.83 15.64 13.38C16.09 12.93 16.09 12.21 16.09 10.77V10.56C16.55 10.30 16.86 9.80 16.86 9.23C16.86 8.39 16.17 7.70 15.32 7.70Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </svg>
              Furniture
            </div>
             <div
              :class="
                select_replace === 'Floor'
                  ? 'category-tab active'
                  : 'category-tab'
              "
              @click="selectCategory('Floor')"
              v-if="brand_floors.length > 0 && brand_is_saling_floor"
            >
              <svg
                width="1.875em"
                height="1.5em"
                viewBox="13 1 38 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 3L43.5 9.5L43.5 23L32 29L20.5 23L20.5 9.5L32 3ZM32 3V16.5"
                  stroke="currentColor"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M32 16.5L43.5 23L32 29L20.5 23L32 16.5Z"
                  fill="url(#paint0_linear_1_56)"
                  stroke="currentColor"
                  stroke-linejoin="round"
                ></path>
                <defs>
                  <linearGradient
                    id="paint0_linear_1_56"
                    x1="32"
                    y1="16.5"
                    x2="32"
                    y2="29"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#00000033" stop-opacity="0"></stop>
                    <stop offset="1" stop-color="#00000033"></stop>
                  </linearGradient>
                </defs>
              </svg>
              Floor
            </div>
            <div
              :class="
                select_replace === 'Wall'
                  ? 'category-tab active'
                  : 'category-tab'
              "
              @click="selectCategory('Wall')"
              v-if="brand_walls.length > 0 && brand_is_saling_wall"
            >
              <svg
                width="1.875em"
                height="1.5em"
                viewBox="13 1 38 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 29L43.5 23L43.5 9.5L32 3L20.5 9.5L20.5 23L32 29Z"
                  stroke="currentColor"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M43.5 9.5L32 3V16.25L43.5 23L43.5 9.5Z"
                  fill="url(#paint0_linear_2_147)"
                  stroke="currentColor"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M32 3L20.5 9.5L20.5 23L32 16.25L32 3Z"
                  fill="url(#paint1_linear_2_147)"
                  stroke="currentColor"
                  stroke-linejoin="round"
                ></path>
                <defs>
                  <linearGradient
                    id="paint0_linear_2_147"
                    x1="43.5"
                    y1="13"
                    x2="32"
                    y2="13"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#00000033"></stop>
                    <stop
                      offset="1"
                      stop-color="#00000033"
                      stop-opacity="0"
                    ></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_2_147"
                    x1="20.5"
                    y1="14.5"
                    x2="32"
                    y2="14.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#00000033"></stop>
                    <stop
                      offset="1"
                      stop-color="#00000033"
                      stop-opacity="0"
                    ></stop>
                  </linearGradient>
                </defs>
              </svg>
              Wall
            </div>
            <div
              :class="
                select_replace === 'Lights'
                  ? 'category-tab active'
                  : 'category-tab'
              "
              @click="selectCategory('Lights')"
              v-if="brand_lights.length > 0 && brand_is_saling_light"
            >
              <BulbOutlined style="font-size: 14px" /> Lights
            </div>

            <div
              :class="'category-tab deactive'"
              v-if="brand_floors.length === 0 && brand_is_saling_floor
"
            >
              <svg
                width="1.875em"
                height="1.5em"
                viewBox="13 1 38 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 3L43.5 9.5L43.5 23L32 29L20.5 23L20.5 9.5L32 3ZM32 3V16.5"
                  stroke="currentColor"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M32 16.5L43.5 23L32 29L20.5 23L32 16.5Z"
                  fill="url(#paint0_linear_1_56)"
                  stroke="currentColor"
                  stroke-linejoin="round"
                ></path>
                <defs>
                  <linearGradient
                    id="paint0_linear_1_56"
                    x1="32"
                    y1="16.5"
                    x2="32"
                    y2="29"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#00000033" stop-opacity="0"></stop>
                    <stop offset="1" stop-color="#00000033"></stop>
                  </linearGradient>
                </defs>
              </svg>
              Floor
            </div>
            <div
              :class="'category-tab deactive'"
              v-if="brand_furniture_products.length === 0 && brand_is_saling_furniture"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4.59 13.83V16.13M13.79 13.83V16.13"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M15.32 7.70C15.32 6.27 15.32 5.55 15.01 5.02C14.81 4.67 14.52 4.38 14.17 4.18C13.64 3.87 12.92 3.87 11.49 3.87H6.89C5.46 3.87 4.74 3.87 4.21 4.18C3.86 4.38 3.57 4.67 3.37 5.02C3.06 5.55 3.06 6.27 3.06 7.70"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M15.32 7.70C14.48 7.70 13.79 8.39 13.79 9.23V10.77C13.79 11.40 13.66 11.53 13.03 11.53H5.36C4.73 11.53 4.59 11.40 4.59 10.77V9.23C4.59 8.39 3.91 7.70 3.06 7.70C2.21 7.70 1.53 8.39 1.53 9.23C1.53 9.80 1.84 10.30 2.29 10.56V10.77C2.29 12.21 2.29 12.93 2.74 13.38C3.19 13.83 3.92 13.83 5.36 13.83H13.03C14.47 13.83 15.19 13.83 15.64 13.38C16.09 12.93 16.09 12.21 16.09 10.77V10.56C16.55 10.30 16.86 9.80 16.86 9.23C16.86 8.39 16.17 7.70 15.32 7.70Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </svg>
              Furniture
            </div>
            <div
              :class="'category-tab deactive'"
              v-if="brand_walls.length === 0 && brand_is_saling_wall"
            >
              <svg
                width="1.875em"
                height="1.5em"
                viewBox="13 1 38 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 29L43.5 23L43.5 9.5L32 3L20.5 9.5L20.5 23L32 29Z"
                  stroke="currentColor"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M43.5 9.5L32 3V16.25L43.5 23L43.5 9.5Z"
                  fill="url(#paint0_linear_2_147)"
                  stroke="currentColor"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M32 3L20.5 9.5L20.5 23L32 16.25L32 3Z"
                  fill="url(#paint1_linear_2_147)"
                  stroke="currentColor"
                  stroke-linejoin="round"
                ></path>
                <defs>
                  <linearGradient
                    id="paint0_linear_2_147"
                    x1="43.5"
                    y1="13"
                    x2="32"
                    y2="13"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#00000033"></stop>
                    <stop
                      offset="1"
                      stop-color="#00000033"
                      stop-opacity="0"
                    ></stop>
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_2_147"
                    x1="20.5"
                    y1="14.5"
                    x2="32"
                    y2="14.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#00000033"></stop>
                    <stop
                      offset="1"
                      stop-color="#00000033"
                      stop-opacity="0"
                    ></stop>
                  </linearGradient>
                </defs>
              </svg>
              Wall
            </div>
            <div
              :class="'category-tab deactive'"
              v-if="brand_lights.length === 0 && brand_is_saling_light"
            >
              <BulbOutlined style="font-size: 14px" /> Lights
            </div>
          </div>

          <!-- <div
            class="bg-[#f3f3f6] flex items-center justify-between px-2.5 py-1.5 h-10"
            v-if="
              current_tab === 'image' &&
              closeShareMenu &&
              !(current_tab === 'image' && active_tab_image === 'home_design')
            "
          > -->
          <!-- Left: Share section -->
          <!-- <div class="flex items-center gap-2">
              <span class="text-[16px] text-gray-700">Share on social:</span>
              <img src="/whatsapp.svg" alt="Whatsapp" class="w-5 h-5" />
              <img src="/logos_facebook.svg" alt="Facebook" class="w-5 h-5" />
              <img src="/instagram.svg" alt="Instagram" class="w-5 h-5" />
            </div> -->

          <!-- // Middle: Buttons  -->
          <!-- <div class="flex items-center gap-3">
              
              <button
                class="border-none bg-[#f9f9f9] px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer !text-blue-800 !text-[12px] hover:bg-[#eaeaea] transition"
                @click="downloadImage"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24">
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
                Download
              </button>
              
            </div> -->

          <!-- Right: Close button -->
          <!-- <div>
    <button 
      class="p-0 outline-none m-0 cursor-pointer" 
      @click="onClose_drawer_modal"
      aria-label="Close"
    >
      <svg class="w-7 h-7" fill="none" viewBox="0 0 27 26">
        <path d="M0.760742 12.5071C0.760742 6.6112 0.760742 3.66325 2.68209 1.83162C4.60346 -1.56944e-07 7.69583 0 13.8806 0C20.0653 0 23.1577 -1.56944e-07 25.0791 1.83162C27.0004 3.66325 27.0004 6.6112 27.0004 12.5071C27.0004 18.403 27.0004 21.351 25.0791 23.1826C23.1577 25.0142 20.0653 25.0142 13.8806 25.0142C7.69583 25.0142 4.60346 25.0142 2.68209 23.1826C0.760742 21.351 0.760742 18.403 0.760742 12.5071Z" fill="#E33827"/>
        <path d="M18.1919 8.39785L9.57176 16.6154M18.1919 16.6154L9.57176 8.39785" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div> -->
          <!-- </div> -->

          <div
            v-if="LockCanvasOperation === false"
            class="canvas-painting-sec"
            :class="
              (current_tab == 'image' &&
              active_tab_image === 'item_replacement' &&
              select_replace === 'Lights' &&
              selected_light_type === 'sunk'
                ? 'light-height-adjuster'
                : '') ||
              (current_tab == 'image' &&
              active_tab_image === 'item_replacement' &&
              select_replace === 'Lights' &&
              selected_light_type === 'hanging'
                ? 'light-3d-height-adjuster'
                : '') ||
              (current_tab == 'image' &&
              active_tab_image === 'item_replacement' &&
              select_replace === 'Floor'
                ? 'mobile-floor-height-adjuster'
                : '') ||
              (current_tab == 'image' &&
              active_tab_image === 'item_replacement' &&
              select_replace === 'Wall'
                ? 'mobile-wall-height-adjuster'
                : '') ||
              (current_tab == 'image' &&
              active_tab_image === 'item_replacement' &&
              select_replace === 'Lights' &&
              selected_light_type === ''
                ? 'mobile-unselected-light-height-adjuster'
                : '') ||
              (current_tab === 'image' &&
              active_tab_image === 'item_replacement' &&
              select_replace === 'Furniture'
                ? item_replacement_renderer_3d_model_url
                  ? 'mobile-furniture-selected-height-adjuster'
                  : 'mobile-furniture-nonselected-height-adjuster'
                : '')
            "
          >
            <canvas_floor_render
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Floor'
              "
              :baseImage="base_image_url"
              :isLoading="canvasLoading"
              :key="canvasKey"
              @Apply-Changes="ApplyChanges"
            />
            <canvas_item_remover_render
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'All'
              "
              :baseImage="base_image_url"
              :objectMasks="binaryMasks_objects_detected"
              :cachedObjectImages="cachedObjectImages"
              :objectMaskCacheReady="objectMaskCacheReady"
              :isLoading="canvasLoading"
              :selectionMode="selectionMode"
              :showDebugInfo="false"
              :key="canvasKey"
              :new_room_rendering_completed_percentage="
                new_room_rendering_completed_percentage
              "
              @object-selection-changed="onObjectSelectionChanged"
              @objects-selected-for-removal="onObjectsSelectedForRemoval"
              @processing-progress="onProcessingProgress"
              @processing-complete="onProcessingComplete"
              @make-room-empty="makeRoomEmpty"
              @reset-entire-room="resetChangesinBaseImage"
              @Apply-Changes="ApplyChanges"
              @handle_removal_completed="fetchRoom()"
              @furniture-switching-started="furniture_Switching_started"
              @furniture-switched="furniture_Switched"
              @insufficient-credits="throw_Insufficient_credits"
            />
            <!-- @redetect-objects-room="fetch_redetect_ObjectsBinary_Masks" -->
            <!-- ceiling light renderer -->
            <img
              :src="this.base_image_url"
              style="width: 100%; height: 100%; object-fit: contain"
              alt=""
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Lights' &&
                selected_light_type === ''
              "
            />
            <canvas_lights_render
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Lights' &&
                selected_light_type === 'sunk'
              "
              :baseImage="base_image_url"
              :isLoading="canvasLoading"
              :selectedlightuuid="selectedlightuuid"
              :depthMask="depthMask"
              :key="canvasKey"
              @magentic-lights-added="magneticLightsMearjed"
              @insufficient-credits="throw_Insufficient_credits"
              @Apply-Changes="ApplyChanges"
              ref="canvas_sunk_magnetic_lights_render_mobile"
            />
            <canvas_unsunk_lights_render
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Lights' &&
                selected_light_type === 'unsunk'
              "
              :baseImage="base_image_url"
              :isLoading="canvasLoading"
              :selectedlightuuid="selectedlightuuid"
              :depthMask="depthMask"
              :key="canvasKey"
              @magentic-lights-added="magneticLightsMearjed"
              @Apply-Changes="ApplyChanges"
            />

            <!-- glbUrl="http://127.0.0.1:8000/media/products/ceiling_lamp_disk.glb" -->
            <!-- <ceiling_3d_object_renderer
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Lights' &&
                selected_light_type === 'hanging'
              "
              :glbUrl="model_3d_url"
              :selectedlightuuid="selectedlightuuid"
              :baseImageUrl="base_image_url"
              :floorMaskUrl="depthMask"
              :roll="ceiling_roll"
              :pitch="ceiling_pitch"
              :yaw="ceiling_yaw"
              @model-3d-light-added="magneticLightsMearjed"
              @Apply-Changes="ApplyChanges"
              ref="canvas_ceiling_3d_object_light_renderer"
              @insufficient-credits="throw_Insufficient_credits"
            /> -->
            <ceiling_3d_object_renderer
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Lights' &&
                selected_light_type === 'hanging'
              "
              v-bind="active_room_ptcld_cords"
              :glbUrl="model_3d_url"
              :selectedlightuuid="selectedlightuuid"
              :debug="debug"
              :baseImageUrl="base_image_url"
              :ceilingMaskUrl="
                this.$store.state.root_media_api +
                active_room_ptcld_cords.CEILING_MASK
              "
              :TARGET_DIMS="selected_3dlight_model_diamensions"
              :roll="ceiling_roll"
              :pitch="ceiling_pitch"
              :yaw="ceiling_yaw"
              @model-3d-light-added="magneticLightsMearjed"
              @Apply-Changes="ApplyChanges"
              ref="canvas_ceiling_3d_object_light_renderer_mobile"
              @insufficient-credits="throw_Insufficient_credits"
            />

            <!-- ceiling light renderer -->

            <canvas_walls_render
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Wall'
              "
              :baseImage="base_image_url"
              :binaryMasks="binaryMaskList"
              :isLoading="canvasLoading"
              :maskUpdateTrigger="maskUpdateTrigger"
              @update:selectedMasks="selected_wall_masks"
              @rescale-room-layout="rescaleWallMask()"
              :key="canvasKey"
              @Apply-Changes="ApplyChanges"
            />

            <!-- glbUrl="http://127.0.0.1:8000/media/products/3d_models/046-cp7.glb" -->
            <!-- {{ floor_3d_model_grid }} -->
            <!-- {{ canvasLoading }} -->
            <!-- <items_replacement_renderer
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Furniture'
              "
              @model-transform-updated="handle3DModelTransformUpdate"
              :glbUrl="item_replacement_renderer_3d_model_url"
              @update:isLoading="StartEndCanvasLoading"
              :isLoading="canvasLoading"
              :is_resizable="is_resizable"
              :product_id="selected_3d_product_model"
              :modelDimensions="{
                width: selected_model_width,
                height: selected_model_height,
                depth: selected_model_depth,
              }"
              :baseImageUrl="base_image_url"
              :floorData="floor_3d_model_grid"
              :depthMaskUrl="depthMask"
              :floorMaskUrl="floor_Mask"
              :roll="floor_roll"
              :pitch="floor_pitch"
              :yaw="floor_yaw"
              ref="floor_item_3d_renderer"
              @add-3d-furniture-to-room-start-polling="
                updateBaskeImageURL_CANVAS
              "
              @Apply-Changes="ApplyChanges"
              @insufficient-credits="throw_Insufficient_credits"
            /> 
            -->
            
<!-- {{ active_room_ptcld_cords }} -->
            <items_replacement_renderer
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Furniture'
              "
              ref="floor_item_3d_renderer_mobile"
              :key="base_image_url"
              :debug="debug"
              v-bind="active_room_ptcld_cords"
              :isLoading="canvasLoading"
              :TARGET_DIMS="{
                width: selected_model_width,
                height: selected_model_height,
                depth: selected_model_depth,
              }"
              :BASE_ROOT_MAIN_IMAGE="base_image_url"
              :CHAIR_MODEL="item_replacement_renderer_3d_model_url"
              
              :is_resizable="is_resizable"
              @switch-to-original-primary-3d-model="switch_to_original_primary_3d_model"
              :colors_available_for_3d_model="colors_available_for_3d_model"
              :switched_color="switched_color"
              @switch-3d-model-change-color="switched_3D_model_same_product_different_color"

              @model-transform-updated="handle3DModelTransformUpdate"
              @update:isLoading="StartEndCanvasLoading"
              @add-3d-furniture-to-room-start-polling="
                updateBaskeImageURL_CANVAS
              "
              :product_id="selected_3d_product_model"
              @Apply-Changes="ApplyChanges"
              @insufficient-credits="throw_Insufficient_credits"
@update-dimensions="update_3d_product_diamensions"
@reset_target_dimensions="reset_target_dimensions"
              @unselect-object="unselect_currrent_selected_object"

            >
            </items_replacement_renderer>

            <!-- :glbModelUrl="this.$store.state.root_media_api+'/media/3d-Rendered-Models/temp/8a36f84a-39e3-40f3-a194-05c5a46c0c2d/HY-2.0-3D-Textured-model_00023_.glb '" -->
            <a-row v-if="current_tab == '3d'">
              <a-col :sm="0" :xs="0" :md="16" :lg="16">
                <object_viewer_3d_tab
                  v-if="current_tab == '3d'"
                  :glbModelUrl="generated3dModel_url"
                  :isLoading="processing_generate_is_Loading"
                  :Model_instance_id="model_instance_id"
                  @clicked-add-product="add_new_product"
                />
              </a-col>

              <a-col :sm="0" :xs="0" :md="8" :lg="8">
                <models_3d_generate_history
                  v-if="current_tab == '3d'"
                  :list_history_generated_3d_models="
                    list_history_generated_3d_models
                  "
                  :loading_generated_models_history="
                    loading_generated_models_history
                  "
                  @clicked-model="new3DModelGenerated"
                />
              </a-col>
            </a-row>

            <a-row
              v-if="
                current_tab == 'image' && active_tab_image === 'home_design'
              "
            >
              <a-col :sm="24" :xs="24" :md="16" :lg="16">
                <main_panel_home_design
                  v-if="
                    current_tab == 'image' && active_tab_image === 'home_design'
                  "
                  :home_design_images="home_design_images"
                  @updateBaseImageUrlForHomeDesign="
                    updateBaseImageUrlForHomeDesign
                  "
                />
              </a-col>

              <a-col :sm="24" :xs="24" :md="8" :lg="8">
                <history_panel_home_design
                  v-if="
                    current_tab == 'image' && active_tab_image === 'home_design'
                  "
                  @home-design-history-clicked="home_design_history_clicked"
                  ref="home_design_history"
                />
              </a-col>
            </a-row>

            <a-row v-if="current_tab == 'edit_image'">
              <a-col :sm="0" :xs="0" :md="16" :lg="16">
                <main_panel_edit_image
                  v-if="current_tab == 'edit_image'"
                  :product_mockup_images="product_mockup_images"
                  :selected_product_mockups_group="
                    selected_product_mockups_group
                  "
                />
              </a-col>

              <a-col :sm="0" :xs="0" :md="8" :lg="8">
                <history_panel_edit_image
                  v-if="current_tab == 'edit_image'"
                  @product-mockup-history-clicked="
                    product_mockup_history_clicked
                  "
                  ref="product_mockup_history"
                />
              </a-col>
            </a-row>
          </div>

          <div v-else>
            <div
              style="
                /* position: fixed; */
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
              "
            >
              <!-- Image container -->
              <div
                style="
                  position: relative;
                  background: #fff;

                  max-height: 90vh;
                  max-width: 90vw;
                "
              >
                <img
                  :src="base_image_url"
                  style="
                    max-height: 89vh;
                    max-width: 80vw;
                    object-fit: contain;
                    display: block;
                    margin: auto;
                  "
                />

                <!-- Center warning overlay -->
                <div
                  style="
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.55);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    color: #fff;
                    font-size: 18px;
                    font-weight: 500;
                    padding: 24px;
                  "
                >
                  <div>
                    <p
                      style="
                        font-size: 14px;
                        font-weight: 600;
                        margin-bottom: 12px;
                      "
                    >
                      ⚠️ Privacy Notice
                    </p>
                    <p style="font-size: 12px">
                      Please upload a room image <b>without people</b>.<br />
                      Images containing persons are <b>not processed</b> as per
                      our privacy policies.
                    </p>
                    <!-- <a-button type="primary" @click="this.$route.query.brand ? this.$router.push('/start-new-catalogue?brand='+this.$route.query.brand ):this.$router.push('/start-new-catalogue') " style="align-items: center;"><CloudUploadOutlined style="font-size: 18px;" /> Upload new Image</a-button> -->

                    <a-space>
                      <a-button
                        size="small"
                        type="primary"
                        @click="
                          this.$route.query.brand
                            ? this.$router.push(
                                '/start-new-catalogue?brand=' +
                                  this.$route.query.brand,
                              )
                            : this.$router.push('/start-new-catalogue')
                        "
                        style="
                          align-items: center;
                          display: flex;
                          justify-content: center;
                        "
                        ><CloudUploadOutlined style="font-size: 18px" /> Upload
                        new Image</a-button
                      >
                      <a-button
                        size="small"
                        type="default"
                        @click="RoomRemovePerson"
                        :loading="canvasLoading"
                        style="
                          align-items: center;
                          display: flex;
                          justify-content: center;
                        "
                        ><UserDeleteOutlined style="font-size: 18px" /> Remove
                        persons</a-button
                      >
                    </a-space>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Catalog Section -->
          <div style="">
            <ai_catalog_item_replacement_3d_products
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Furniture'
              "
              :planDetails="planDetails"
              :planIsExpired="planIsExpired"
              :brand_data="brand_data"
              @products-see-all="furnituresSeeAll"
              @trigger-render-3d-object="execute3DRederer"
              @trigger-switch-furniture="executeswitchFurniture"
              @trigger-render-3d-object_mobile="execute3DRederer_mobile"
              @trigger-switch-furniture_mobile="executeswitchFurniture_mobile"
              ref="furniture_products_list_mobile"
              @change-3d-model="change3dModel"
            />

            <floor
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Floor'
              "
              :planDetails="planDetails"
              :planIsExpired="planIsExpired"
              @texture-selected="floorTextureSelected"
              @texture-floor-product-selected="texture_floor_selected"
              ref="floor_products_list_mobile"
              :brand_data="brand_data"
              @floor-see-all="floorSeeAll"
            ></floor>
            <walls
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Wall'
              "
              :planDetails="planDetails"
              :planIsExpired="planIsExpired"
              @texture-selected="wallTextureSelected"
              ref="wall_products_list_mobile"
              @texture-wall-product-selected="texture_wall_selected"
              :brand_data="brand_data"
              @walls-see-all="wallsSeeAll"
            ></walls>
            <fernitures
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'All'
              "
              :planDetails="planDetails"
              :planIsExpired="planIsExpired"
              @product-selected="product_selected_all_tabs_section"
              :brand_data="brand_data"
              @see-all-products="SeeAllProducts"
              @brand-products="get_all_products_tabs_available"
            >
            </fernitures>
            <lights
              v-if="
                current_tab == 'image' &&
                active_tab_image === 'item_replacement' &&
                select_replace === 'Lights'
              "
              :planDetails="planDetails"
              :planIsExpired="planIsExpired"
              @light-selected="lightSelected"
              ref="lights_list_mobile"
              :brand_data="brand_data"
              @light-see-all="lightsSeeAll"
              @Apply_Light="Apply_ceiling_light"
              @Apply_Light_mobile="Apply_ceiling_light_mobile"
            >
            </lights>
          </div>
        </div>
        <div class="category-section" v-if="active_tab_image === 'home_design'">
          <main_panel_home_design
            v-if="
              current_tab == 'image' &&
              active_tab_image === 'home_design' &&
              home_design_images
            "
            @updateBaseImageUrlForHomeDesign="updateBaseImageUrlForHomeDesign"
            :home_design_images="home_design_images"
          />

          <side_panel_home_design
            :base_image_url="sideFinalImage || base_image_url"
            :home_design_access="planDetails?.home_design || false"
            :plan_details="planDetails"
            :planIsExpired="planIsExpired"
            :brand_data="brand_data"
            @home-design-generation-complete="newhome_designes_generated"
            @insufficient-credits="throw_Insufficient_credits"
            @show-upgrade-modal="showPlanUpgradeModal = true"
          />

          <history_panel_home_design
            v-if="current_tab == 'image' && active_tab_image === 'home_design'"
            @home-design-history-clicked="home_design_history_clicked"
            ref="home_design_history"
          />
          <!-- main_panel_home_design
                history_panel_home_design -->
          <!-- <div class="tab-content-placeholder">
              <h3>Item Replacement </h3>
              <p>Item Replacement tools will be displayed here</p>
            </div> -->
        </div>
      </div>
    </a-col>
    <a-col :sm="0" :xs="0" :md="24" :lg="24">
      <div>
        <!-- {{ user }} -->
        <div class="main_panel">
          <a-row class="full-height">
            <!-- Left Sidebar - Tool Icons -->
            <a-col
              :span="user?.user_type === 'Business' ? 1 : 0"
              class="left-sidebar"
            >
              <div class="tool-icons">
                <div
                  :class="
                    current_tab === 'image' ? 'tool-item active' : 'tool-item '
                  "
                  @click="changeCurrentTab('image')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <circle
                      cx="8.5"
                      cy="8.5"
                      r="1.5"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <polyline
                      points="21,15 16,10 5,21"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                  <span>Image</span>
                </div>
                <div
                  :class="
                    current_tab === '3d' ? 'tool-item active' : 'tool-item '
                  "
                  @click="changeCurrentTab('3d')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                  <span>3D</span>
                </div>
                <div
                  :class="
                    current_tab === 'edit_image'
                      ? 'tool-item active'
                      : 'tool-item'
                  "
                  @click="changeCurrentTab('edit_image')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path
                      d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                  <span>Edit Image</span>
                </div>
              </div>
            </a-col>

            <!-- Middle Panel - Controls -->
            <!-- (user?.user_type !=='User' && user?.user_type !=='Professional' )? 6 :7 -->
            <a-col
              :span="
                user?.user_type === 'Business' || user?.user_type === 'User'
                  ? 6
                  : 7
              "
              class="middle-panel"
              v-if="current_tab == 'image'"
            >
              <div class="controls-container">
                <!-- Top Action Buttons -->
                <div class="action-buttons">
                  <div
                    type="primary"
                    :class="
                      active_tab_image === 'item_replacement'
                        ? 'action-btn active'
                        : 'action-btn'
                    "
                    @click="selectActiveTab('item_replacement')"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M4.59 13.83V16.13M13.79 13.83V16.13"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M15.32 7.70C15.32 6.27 15.32 5.55 15.01 5.02C14.81 4.67 14.52 4.38 14.17 4.18C13.64 3.87 12.92 3.87 11.49 3.87H6.89C5.46 3.87 4.74 3.87 4.21 4.18C3.86 4.38 3.57 4.67 3.37 5.02C3.06 5.55 3.06 6.27 3.06 7.70"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M15.32 7.70C14.48 7.70 13.79 8.39 13.79 9.23V10.77C13.79 11.40 13.66 11.53 13.03 11.53H5.36C4.73 11.53 4.59 11.40 4.59 10.77V9.23C4.59 8.39 3.91 7.70 3.06 7.70C2.21 7.70 1.53 8.39 1.53 9.23C1.53 9.80 1.84 10.30 2.29 10.56V10.77C2.29 12.21 2.29 12.93 2.74 13.38C3.19 13.83 3.92 13.83 5.36 13.83H13.03C14.47 13.83 15.19 13.83 15.64 13.38C16.09 12.93 16.09 12.21 16.09 10.77V10.56C16.55 10.30 16.86 9.80 16.86 9.23C16.86 8.39 16.17 7.70 15.32 7.70Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                      /></svg> &nbsp; Item Replace
                  </div>
                  <div
                    :class="
                      active_tab_image === 'home_design'
                        ? 'action-btn active'
                        : 'action-btn'
                    "
                    @click="selectActiveTab('home_design')"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M11.65 11.68V6.32C11.65 4.74 11.65 3.96 11.16 3.47C10.68 2.98 9.90 2.98 8.35 2.98H5.71C4.15 2.98 3.38 2.98 2.89 3.47C2.41 3.96 2.41 4.74 2.41 6.32V11.68C2.41 13.25 2.41 14.04 2.89 14.53C3.38 15.02 4.15 15.02 5.71 15.02H8.35C9.90 15.02 10.68 15.02 11.16 14.53C11.65 14.04 11.65 13.25 11.65 11.68Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                      <path
                        d="M7.63 15.02H11.73C13.01 15.02 13.66 15.02 14.06 14.63C14.46 14.24 14.46 13.61 14.46 12.35V7.66C14.46 6.40 14.46 5.77 14.06 5.38C13.66 4.98 13.01 4.98 11.73 4.98"
                        stroke="currentColor"
                        stroke-width="1.5"
                      />
                      <path
                        d="M9.24 8.10V9.70"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      /></svg>&nbsp; Home Design
                  </div>
                </div>

                <!-- Category Tabs -->
                <div
                  class="category-section"
                  v-if="active_tab_image === 'item_replacement'"
                >
                  <!-- {{brand_floors}}
                {{brand_walls}}
                {{brand_furniture_products}}
                {{brand_lights}} -->
                  <div class="category-tabs">
                    <div
                      :class="
                        select_replace === 'All'
                          ? 'category-tab active'
                          : 'category-tab'
                      "
                      @click="selectCategory('All')"
                    >
                      <svg
                        width="1.875em"
                        height="1.5em"
                        viewBox="13 1 38 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M32 3L43.5 9.5L43.5 23L32 29L20.5 23L20.5 9.5L32 3ZM32 3V16.5"
                          stroke="currentColor"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M32 16.5L43.5 23L32 29L20.5 23L32 16.5Z"
                          fill="url(#paint0_linear_1_56)"
                          stroke="currentColor"
                          stroke-linejoin="round"
                        ></path>
                        <defs>
                          <linearGradient
                            id="paint0_linear_1_56"
                            x1="32"
                            y1="16.5"
                            x2="32"
                            y2="29"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop
                              stop-color="#00000033"
                              stop-opacity="0"
                            ></stop>
                            <stop offset="1" stop-color="#00000033"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      All
                    </div>
                  
                    <div
                      :class="
                        select_replace === 'Furniture'
                          ? 'category-tab active'
                          : 'category-tab'
                      "
                      @click="selectCategory('Furniture')"
                      v-if="brand_furniture_products.length > 0 && brand_is_saling_furniture"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4.59 13.83V16.13M13.79 13.83V16.13"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M15.32 7.70C15.32 6.27 15.32 5.55 15.01 5.02C14.81 4.67 14.52 4.38 14.17 4.18C13.64 3.87 12.92 3.87 11.49 3.87H6.89C5.46 3.87 4.74 3.87 4.21 4.18C3.86 4.38 3.57 4.67 3.37 5.02C3.06 5.55 3.06 6.27 3.06 7.70"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M15.32 7.70C14.48 7.70 13.79 8.39 13.79 9.23V10.77C13.79 11.40 13.66 11.53 13.03 11.53H5.36C4.73 11.53 4.59 11.40 4.59 10.77V9.23C4.59 8.39 3.91 7.70 3.06 7.70C2.21 7.70 1.53 8.39 1.53 9.23C1.53 9.80 1.84 10.30 2.29 10.56V10.77C2.29 12.21 2.29 12.93 2.74 13.38C3.19 13.83 3.92 13.83 5.36 13.83H13.03C14.47 13.83 15.19 13.83 15.64 13.38C16.09 12.93 16.09 12.21 16.09 10.77V10.56C16.55 10.30 16.86 9.80 16.86 9.23C16.86 8.39 16.17 7.70 15.32 7.70Z"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />
                      </svg>
                      Furniture
                    </div>
                      <div
                      :class="
                        select_replace === 'Floor'
                          ? 'category-tab active'
                          : 'category-tab'
                      "
                      @click="selectCategory('Floor')"
                      v-if="brand_floors.length > 0 && brand_is_saling_floor"
                    >
                      <svg
                        width="1.875em"
                        height="1.5em"
                        viewBox="13 1 38 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M32 3L43.5 9.5L43.5 23L32 29L20.5 23L20.5 9.5L32 3ZM32 3V16.5"
                          stroke="currentColor"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M32 16.5L43.5 23L32 29L20.5 23L32 16.5Z"
                          fill="url(#paint0_linear_1_56)"
                          stroke="currentColor"
                          stroke-linejoin="round"
                        ></path>
                        <defs>
                          <linearGradient
                            id="paint0_linear_1_56"
                            x1="32"
                            y1="16.5"
                            x2="32"
                            y2="29"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop
                              stop-color="#00000033"
                              stop-opacity="0"
                            ></stop>
                            <stop offset="1" stop-color="#00000033"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      Floor
                    </div>
                    <div
                      :class="
                        select_replace === 'Wall'
                          ? 'category-tab active'
                          : 'category-tab'
                      "
                      @click="selectCategory('Wall')"
                      v-if="brand_walls.length > 0 && brand_is_saling_wall"
                    >
                      <svg
                        width="1.875em"
                        height="1.5em"
                        viewBox="13 1 38 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M32 29L43.5 23L43.5 9.5L32 3L20.5 9.5L20.5 23L32 29Z"
                          stroke="currentColor"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M43.5 9.5L32 3V16.25L43.5 23L43.5 9.5Z"
                          fill="url(#paint0_linear_2_147)"
                          stroke="currentColor"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M32 3L20.5 9.5L20.5 23L32 16.25L32 3Z"
                          fill="url(#paint1_linear_2_147)"
                          stroke="currentColor"
                          stroke-linejoin="round"
                        ></path>
                        <defs>
                          <linearGradient
                            id="paint0_linear_2_147"
                            x1="43.5"
                            y1="13"
                            x2="32"
                            y2="13"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#00000033"></stop>
                            <stop
                              offset="1"
                              stop-color="#00000033"
                              stop-opacity="0"
                            ></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint1_linear_2_147"
                            x1="20.5"
                            y1="14.5"
                            x2="32"
                            y2="14.5"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#00000033"></stop>
                            <stop
                              offset="1"
                              stop-color="#00000033"
                              stop-opacity="0"
                            ></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      Wall
                    </div>
                    <div
                      :class="
                        select_replace === 'Lights'
                          ? 'category-tab active'
                          : 'category-tab'
                      "
                      @click="selectCategory('Lights')"
                      v-if="brand_lights.length > 0 && brand_is_saling_light"
                    >
                      <BulbOutlined style="font-size: 14px" /> Lights
                    </div>

                    <div
                      :class="'category-tab deactive'"
                      v-if="brand_floors.length === 0 && brand_is_saling_floor"
                    >
                      <svg
                        width="1.875em"
                        height="1.5em"
                        viewBox="13 1 38 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M32 3L43.5 9.5L43.5 23L32 29L20.5 23L20.5 9.5L32 3ZM32 3V16.5"
                          stroke="currentColor"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M32 16.5L43.5 23L32 29L20.5 23L32 16.5Z"
                          fill="url(#paint0_linear_1_56)"
                          stroke="currentColor"
                          stroke-linejoin="round"
                        ></path>
                        <defs>
                          <linearGradient
                            id="paint0_linear_1_56"
                            x1="32"
                            y1="16.5"
                            x2="32"
                            y2="29"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop
                              stop-color="#00000033"
                              stop-opacity="0"
                            ></stop>
                            <stop offset="1" stop-color="#00000033"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      Floor
                    </div>
                    <div
                      :class="'category-tab deactive'"
                      v-if="brand_furniture_products.length === 0 && brand_is_saling_furniture"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4.59 13.83V16.13M13.79 13.83V16.13"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M15.32 7.70C15.32 6.27 15.32 5.55 15.01 5.02C14.81 4.67 14.52 4.38 14.17 4.18C13.64 3.87 12.92 3.87 11.49 3.87H6.89C5.46 3.87 4.74 3.87 4.21 4.18C3.86 4.38 3.57 4.67 3.37 5.02C3.06 5.55 3.06 6.27 3.06 7.70"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                        <path
                          d="M15.32 7.70C14.48 7.70 13.79 8.39 13.79 9.23V10.77C13.79 11.40 13.66 11.53 13.03 11.53H5.36C4.73 11.53 4.59 11.40 4.59 10.77V9.23C4.59 8.39 3.91 7.70 3.06 7.70C2.21 7.70 1.53 8.39 1.53 9.23C1.53 9.80 1.84 10.30 2.29 10.56V10.77C2.29 12.21 2.29 12.93 2.74 13.38C3.19 13.83 3.92 13.83 5.36 13.83H13.03C14.47 13.83 15.19 13.83 15.64 13.38C16.09 12.93 16.09 12.21 16.09 10.77V10.56C16.55 10.30 16.86 9.80 16.86 9.23C16.86 8.39 16.17 7.70 15.32 7.70Z"
                          stroke="currentColor"
                          stroke-width="1.5"
                        />
                      </svg>
                      Furniture
                    </div>
                    <div
                      :class="'category-tab deactive'"
                      v-if="brand_walls.length === 0 && brand_is_saling_wall"
                    >
                      <svg
                        width="1.875em"
                        height="1.5em"
                        viewBox="13 1 38 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M32 29L43.5 23L43.5 9.5L32 3L20.5 9.5L20.5 23L32 29Z"
                          stroke="currentColor"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M43.5 9.5L32 3V16.25L43.5 23L43.5 9.5Z"
                          fill="url(#paint0_linear_2_147)"
                          stroke="currentColor"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M32 3L20.5 9.5L20.5 23L32 16.25L32 3Z"
                          fill="url(#paint1_linear_2_147)"
                          stroke="currentColor"
                          stroke-linejoin="round"
                        ></path>
                        <defs>
                          <linearGradient
                            id="paint0_linear_2_147"
                            x1="43.5"
                            y1="13"
                            x2="32"
                            y2="13"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#00000033"></stop>
                            <stop
                              offset="1"
                              stop-color="#00000033"
                              stop-opacity="0"
                            ></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint1_linear_2_147"
                            x1="20.5"
                            y1="14.5"
                            x2="32"
                            y2="14.5"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#00000033"></stop>
                            <stop
                              offset="1"
                              stop-color="#00000033"
                              stop-opacity="0"
                            ></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      Wall
                    </div>
                    <div
                      :class="'category-tab deactive'"
                      v-if="brand_lights.length === 0 && brand_is_saling_light"
                    >
                      <BulbOutlined style="font-size: 14px" /> Lights
                    </div>
                  </div>

                  <!-- AI Catalog Section -->
                  <div style="">
                    <ai_catalog_item_replacement_3d_products
                      v-if="
                        current_tab == 'image' &&
                        active_tab_image === 'item_replacement' &&
                        select_replace === 'Furniture'
                      "
                      :planDetails="planDetails"
                      :planIsExpired="planIsExpired"
                      :brand_data="brand_data"
                      @products-see-all="furnituresSeeAll"
                      @trigger-render-3d-object="execute3DRederer"
                      @trigger-switch-furniture="executeswitchFurniture"
                      @trigger-render-3d-object_mobile="execute3DRederer_mobile"
                      @trigger-switch-furniture_mobile="
                        executeswitchFurniture_mobile
                      "
                      ref="furniture_products_list"
                      @change-3d-model="change3dModel"
                    />
                    <floor
                      v-if="
                        current_tab == 'image' &&
                        active_tab_image === 'item_replacement' &&
                        select_replace === 'Floor'
                      "
                      :planDetails="planDetails"
                      :planIsExpired="planIsExpired"
                      @texture-selected="floorTextureSelected"
                      ref="floor_products_list"
                      @texture-floor-product-selected="texture_floor_selected"
                      :brand_data="brand_data"
                      @floor-see-all="floorSeeAll"
                    ></floor>
                    <!-- style="height:100%;max-height:77vh" -->
                    <walls
                      v-if="
                        current_tab == 'image' &&
                        active_tab_image === 'item_replacement' &&
                        select_replace === 'Wall'
                      "
                      :planDetails="planDetails"
                      :planIsExpired="planIsExpired"
                      @texture-selected="wallTextureSelected"
                      ref="wall_products_list"
                      :brand_data="brand_data"
                      @texture-wall-product-selected="texture_wall_selected"
                      @walls-see-all="wallsSeeAll"
                    ></walls>
                    <fernitures
                      v-if="
                        current_tab == 'image' &&
                        active_tab_image === 'item_replacement' &&
                        select_replace === 'All'
                      "
                      :planDetails="planDetails"
                      :planIsExpired="planIsExpired"
                      @product-selected="product_selected_all_tabs_section"
                      @brand-products="get_all_products_tabs_available"
                      @see-all-products="SeeAllProducts"
                      :brand_data="brand_data"
                    >
                    </fernitures>
                    <lights
                      v-if="
                        current_tab == 'image' &&
                        active_tab_image === 'item_replacement' &&
                        select_replace === 'Lights'
                      "
                      :planDetails="planDetails"
                      :planIsExpired="planIsExpired"
                      @light-selected="lightSelected"
                      @products-see-all="lightsSeeAll"
                      ref="lights_list"
                      :brand_data="brand_data"
                      @light-see-all="lightsSeeAll"
                      @Apply_Light="Apply_ceiling_light"
                      @Apply_Light_mobile="Apply_ceiling_light_mobile"
                    >
                    </lights>
                  </div>
                </div>
                <div
                class="category-section"
                v-if="active_tab_image === 'home_design'"
                >
                  <side_panel_home_design
                    :base_image_url="sideFinalImage || base_image_url"
                    :home_design_access="planDetails?.home_design || false"
                    :plan_details="planDetails"
                    :planIsExpired="planIsExpired"
                    :brand_data="brand_data"
                    @home-design-generation-complete="
                      newhome_designes_generated
                    "
                    @insufficient-credits="throw_Insufficient_credits"
                    @show-upgrade-modal="showPlanUpgradeModal = true"
                  />

                  <!-- main_panel_home_design
                history_panel_home_design -->
                  <!-- <div class="tab-content-placeholder">
              <h3>Item Replacement </h3>
              <p>Item Replacement tools will be displayed here</p>
            </div> -->
                </div>
              </div>
            </a-col>

            <a-col :span="6" class="middle-panel" v-if="current_tab == '3d'">
              <sidepanel_3d_tab
                @queue-updated="get_3d_rendered_model_details"
                @processing-generate="processinggenerate_loading"
                @generated="new3DModelGenerated"
                @insufficient-credits="throw_Insufficient_credits"
              />
              <!-- <div class="tab-content-placeholder">
              <h3>3D Tools</h3>
              <p>3D editing tools will be displayed here</p>
            </div> -->
            </a-col>

            <a-col
              :span="6"
              class="middle-panel"
              v-if="current_tab == 'edit_image'"
            >
              <side_panel_edit_image
                :base_image_url="''"
                @product-mockup-generation-complete="
                  new_product_mockup_generated
                "
                @insufficient-credits="throw_Insufficient_credits"
              />

              <!-- <div class="tab-content-placeholder">
              <h3>Edit Image</h3>
              <p>Image editing tools will be displayed here</p>
            </div> -->
            </a-col>

            <!-- Right Panel - Canvas -->

            <a-col
              :span="user?.user_type !== 'User' ? 17 : 18"
              class="canvas-panel"
            >
              <div
                v-if="
                  current_tab === 'image' && active_tab_image != 'home_design'
                "
                style="
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 5px 10px;
                  height: 40px;
                  position: absolute;
                  right: 10;
                  z-index: 1;
                "
              >
                <!-- Left: Close button -->
                <div class="right-social-ctrl-sec">
                  <div
                    class="right-socialShare-contrl-icon"
                    :class="{ show: isCollapsed }"
                    style="padding: none; outline: none; margin: none"
                    @click="toggleSocialShare"
                  >
                    <svg
                      class="w-6 h-6 text-gray-800 dark:text-black"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      v-if="isCollapsed"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16.153 19 21 12l-4.847-7H3l4.848 7L3 19h13.153Z"
                      />
                    </svg>
                    <svg
                      width="27"
                      height="26"
                      viewBox="0 0 27 26"
                      fill="none"
                      class="dark:text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      v-if="!isCollapsed"
                    >
                      <path
                        d="M0.760742 12.5071C0.760742 6.6112 0.760742 3.66325 2.68209 1.83162C4.60346 -1.56944e-07 7.69583 0 13.8806 0C20.0653 0 23.1577 -1.56944e-07 25.0791 1.83162C27.0004 3.66325 27.0004 6.6112 27.0004 12.5071C27.0004 18.403 27.0004 21.351 25.0791 23.1826C23.1577 25.0142 20.0653 25.0142 13.8806 25.0142C7.69583 25.0142 4.60346 25.0142 2.68209 23.1826C0.760742 21.351 0.760742 18.403 0.760742 12.5071Z"
                        fill="#E33827"
                      />
                      <path
                        d="M18.1919 8.39785L9.57176 16.6154M18.1919 16.6154L9.57176 8.39785"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  class="socialShares-sec"
                  :class="{ collapsed: isCollapsed }"
                  style="
                    width: 98%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 5px 10px;
                    height: 40px;
                  "
                  v-if="
                    current_tab === 'image' &&
                    closeShareMenu &&
                    !(
                      current_tab === 'image' &&
                      active_tab_image === 'home_design'
                    )
                  "
                >
                  <!-- Middle: Share section -->
                  <div
                    style="
                      border: 1px solid rgba(0, 0, 0, 0.2);

                      background: #f9f9f9;
                      padding: 3px 12px;
                      border-radius: 6px;
                      cursor: pointer;
                      color: #2a5afc;
                      display: flex;
                      align-items: center;
                      gap: 6px;
                      font-size: 16px;
                    "
                  >
                    <span style="font-size: 16px; color: #444"
                      >Share on social:</span
                    >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 21 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.443867 10.773C0.443375 12.6053 0.908 14.3944 1.79148 15.9713L0.359375 21.3591L5.71044 19.9134C7.19048 20.7436 8.84874 21.1786 10.5339 21.1787H10.5383C16.1013 21.1787 20.6296 16.5143 20.632 10.7812C20.6331 8.00309 19.5841 5.39073 17.6781 3.42533C15.7726 1.46011 13.2382 0.377244 10.5379 0.375977C4.97429 0.375977 0.446246 5.04012 0.443949 10.773"
                        fill="url(#paint0_linear_7100_26150)"
                      />
                      <path
                        d="M0.0877734 10.77C0.0871992 12.6682 0.568476 14.5212 1.48345 16.1546L0 21.7356L5.54293 20.238C7.07019 21.0961 8.78973 21.5485 10.5395 21.5491H10.544C16.3065 21.5491 20.9975 16.7169 21 10.7786C21.001 7.90064 19.9142 5.19437 17.9402 3.15857C15.966 1.12301 13.341 0.00118336 10.544 0C4.78045 0 0.0900703 4.8315 0.0877734 10.77ZM3.38879 15.8733L3.18183 15.5348C2.3118 14.1093 1.85259 12.4621 1.85325 10.7706C1.85505 5.83474 5.75351 1.819 10.5473 1.819C12.8687 1.82001 15.0504 2.7525 16.6914 4.44437C18.3323 6.13641 19.2352 8.38565 19.2346 10.7779C19.2325 15.7138 15.3339 19.73 10.544 19.73H10.5405C8.98086 19.7292 7.45123 19.2976 6.11723 18.482L5.79977 18.288L2.51048 19.1767L3.38879 15.8733Z"
                        fill="url(#paint1_linear_7100_26150)"
                      />
                      <path
                        d="M7.93012 6.26731C7.73439 5.81907 7.52841 5.81002 7.34228 5.80216C7.18987 5.7954 7.01563 5.79591 6.84156 5.79591C6.66733 5.79591 6.38424 5.86344 6.14495 6.13266C5.90542 6.40213 5.23047 7.05331 5.23047 8.37775C5.23047 9.70219 6.16669 10.9822 6.2972 11.162C6.42788 11.3415 8.1046 14.1464 10.7601 15.2255C12.9671 16.1222 13.4162 15.9438 13.8952 15.8989C14.3742 15.8541 15.441 15.2479 15.6586 14.6192C15.8764 13.9907 15.8764 13.4519 15.8111 13.3393C15.7458 13.2272 15.5716 13.1598 15.3103 13.0252C15.049 12.8907 13.7645 12.2393 13.5251 12.1495C13.2855 12.0597 13.1114 12.0149 12.9371 12.2845C12.7629 12.5536 12.2626 13.1598 12.1101 13.3393C11.9578 13.5193 11.8053 13.5417 11.5441 13.407C11.2827 13.272 10.4413 12.988 9.44302 12.071C8.66635 11.3575 8.142 10.4763 7.98959 10.2067C7.83718 9.93759 7.97327 9.7917 8.10427 9.65756C8.22166 9.53694 8.36562 9.34321 8.49638 9.18607C8.62664 9.02886 8.67012 8.91669 8.75724 8.73716C8.84444 8.55745 8.8008 8.40024 8.73558 8.26559C8.67012 8.13094 8.16243 6.79957 7.93012 6.26731Z"
                        fill="white"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_7100_26150"
                          x1="1013.99"
                          y1="2098.69"
                          x2="1013.99"
                          y2="0.375977"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#1FAF38" />
                          <stop offset="1" stop-color="#60D669" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_7100_26150"
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
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_7100_26154)">
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
                        <clipPath id="clip0_7100_26154">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_7100_26157)">
                        <path
                          d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z"
                          fill="url(#paint0_radial_7100_26157)"
                        />
                        <path
                          d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z"
                          fill="url(#paint1_radial_7100_26157)"
                        />
                        <path
                          d="M10.0007 2.1875C7.87898 2.1875 7.61266 2.1968 6.77938 2.23469C5.94766 2.27281 5.37992 2.40445 4.8832 2.59766C4.3693 2.79719 3.93344 3.06414 3.49922 3.49852C3.06461 3.93281 2.79766 4.36867 2.5975 4.88234C2.40375 5.37922 2.27195 5.94719 2.23453 6.77852C2.19727 7.61188 2.1875 7.87828 2.1875 10.0001C2.1875 12.1219 2.19688 12.3873 2.23469 13.2206C2.27297 14.0523 2.40461 14.6201 2.59766 15.1168C2.79734 15.6307 3.0643 16.0666 3.49867 16.5008C3.93281 16.9354 4.36867 17.203 4.88219 17.4025C5.3793 17.5957 5.94711 17.7273 6.77867 17.7655C7.61203 17.8034 7.87813 17.8127 9.99977 17.8127C12.1217 17.8127 12.3872 17.8034 13.2205 17.7655C14.0522 17.7273 14.6205 17.5957 15.1177 17.4025C15.6313 17.203 16.0666 16.9354 16.5006 16.5008C16.9352 16.0666 17.2021 15.6307 17.4023 15.117C17.5944 14.6201 17.7262 14.0522 17.7653 13.2208C17.8027 12.3875 17.8125 12.1219 17.8125 10.0001C17.8125 7.87828 17.8027 7.61203 17.7653 6.77867C17.7262 5.94695 17.5944 5.3793 17.4023 4.88258C17.2021 4.36867 16.9352 3.93281 16.5006 3.49852C16.0661 3.06398 15.6315 2.79703 15.1172 2.59773C14.6191 2.40445 14.0511 2.27273 13.2194 2.23469C12.386 2.1968 12.1207 2.1875 9.99828 2.1875H10.0007ZM9.29984 3.59539C9.50789 3.59508 9.74 3.59539 10.0007 3.59539C12.0867 3.59539 12.3339 3.60289 13.1577 3.64031C13.9194 3.67516 14.3328 3.80242 14.6082 3.90938C14.9728 4.05094 15.2327 4.22023 15.506 4.49375C15.7795 4.76719 15.9487 5.02758 16.0906 5.39219C16.1976 5.66719 16.325 6.08063 16.3597 6.84234C16.3971 7.66594 16.4052 7.91328 16.4052 9.99828C16.4052 12.0833 16.3971 12.3307 16.3597 13.1542C16.3248 13.9159 16.1976 14.3294 16.0906 14.6045C15.9491 14.9691 15.7795 15.2287 15.506 15.502C15.2326 15.7754 14.973 15.9446 14.6082 16.0863C14.3331 16.1937 13.9194 16.3206 13.1577 16.3555C12.3341 16.3929 12.0867 16.401 10.0007 16.401C7.91461 16.401 7.66734 16.3929 6.84383 16.3555C6.08211 16.3203 5.66867 16.193 5.39305 16.0861C5.02852 15.9445 4.76805 15.7752 4.49461 15.5018C4.22117 15.2284 4.05195 14.9686 3.91 14.6038C3.80305 14.3287 3.67562 13.9153 3.64094 13.1536C3.60352 12.33 3.59602 12.0827 3.59602 9.99633C3.59602 7.91 3.60352 7.66398 3.64094 6.84039C3.67578 6.07867 3.80305 5.66523 3.91 5.38984C4.05164 5.02523 4.22117 4.76484 4.49469 4.49141C4.7682 4.21797 5.02852 4.04867 5.39312 3.9068C5.66852 3.79938 6.08211 3.67242 6.84383 3.63742C7.56453 3.60484 7.84383 3.59508 9.29984 3.59344V3.59539ZM14.171 4.89258C13.6534 4.89258 13.2335 5.31211 13.2335 5.82977C13.2335 6.34734 13.6534 6.76727 14.171 6.76727C14.6886 6.76727 15.1085 6.34734 15.1085 5.82977C15.1085 5.31219 14.6886 4.89227 14.171 4.89227V4.89258ZM10.0007 5.98797C7.78508 5.98797 5.98867 7.78438 5.98867 10.0001C5.98867 12.2158 7.78508 14.0113 10.0007 14.0113C12.2164 14.0113 14.0122 12.2158 14.0122 10.0001C14.0122 7.78445 12.2163 5.98797 10.0005 5.98797H10.0007ZM10.0007 7.39586C11.4389 7.39586 12.6049 8.56172 12.6049 10.0001C12.6049 11.4383 11.4389 12.6043 10.0007 12.6043C8.5625 12.6043 7.39656 11.4383 7.39656 10.0001C7.39656 8.56172 8.56242 7.39586 10.0007 7.39586Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <radialGradient
                          id="paint0_radial_7100_26157"
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
                          id="paint1_radial_7100_26157"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(-3.35008 1.4407) rotate(78.681) scale(8.86031 36.5225)"
                        >
                          <stop stop-color="#3771C8" />
                          <stop offset="0.128" stop-color="#3771C8" />
                          <stop
                            offset="1"
                            stop-color="#6600FF"
                            stop-opacity="0"
                          />
                        </radialGradient>
                        <clipPath id="clip0_7100_26157">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>

                  <!-- Right: Buttons -->
                  <div style="display: flex; align-items: center; gap: 12px">
                    <a-button
                      @click="Change_Room_SeeAll()"
                      style="
                        border: 1px solid rgba(0, 0, 0, 0.2);

                        background: #f9f9f9;
                        padding: 5px 12px;
                        border-radius: 6px;
                        cursor: pointer;
                        color: #2a5afc;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 16px;
                      "
                    >
                      <svg
                        width="19"
                        height="20"
                        viewBox="0 0 19 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.625 15.5417V10.2114C16.625 9.78192 16.5376 9.35689 16.3682 8.9622C16.1987 8.56752 15.9508 8.21143 15.6394 7.9156L10.5909 3.12048C10.2967 2.84093 9.90627 2.68506 9.5004 2.68506C9.09452 2.68506 8.70414 2.84093 8.40988 3.12048L3.36062 7.9156C3.04922 8.21143 2.80126 8.56752 2.63182 8.9622C2.46238 9.35689 2.375 9.78192 2.375 10.2114V15.5417C2.375 15.9617 2.54181 16.3644 2.83875 16.6613C3.13568 16.9582 3.53841 17.1251 3.95833 17.1251H15.0417C15.4616 17.1251 15.8643 16.9582 16.1613 16.6613C16.4582 16.3644 16.625 15.9617 16.625 15.5417Z"
                          stroke="#3B63FB"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      Change Room
                    </a-button>
                    <a-button
                      style="
                        border: 1px solid rgba(0, 0, 0, 0.2);
                        background: #f9f9f9;
                        padding: 5px 12px;
                        border-radius: 6px;
                        cursor: pointer;
                        color: #2a5afc;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 16px;
                      "
                      @click="downloadImage"
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
                      <!-- Download -->
                    </a-button>
                  </div>
                </div>
              </div>

              <div
                v-if="
                  current_tab === 'image' && active_tab_image === 'home_design'
                "
                style="
                  width: 67%;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 5px 10px;
                  height: 40px;
                  position: absolute;
                  right: 10;
                  z-index: 1;
                "
              >
                <!-- Left: Close button -->
                <div class="right-social-ctrl-sec">
                  <div
                    class="right-socialShare-contrl-icon"
                    :class="{ show: isCollapsed }"
                    style="padding: none; outline: none; margin: none"
                    @click="toggleSocialShare"
                  >
                    <svg
                      class="w-6 h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      v-if="isCollapsed"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16.153 19 21 12l-4.847-7H3l4.848 7L3 19h13.153Z"
                      />
                    </svg>
                    <svg
                      width="27"
                      height="26"
                      viewBox="0 0 27 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      v-if="!isCollapsed"
                    >
                      <path
                        d="M0.760742 12.5071C0.760742 6.6112 0.760742 3.66325 2.68209 1.83162C4.60346 -1.56944e-07 7.69583 0 13.8806 0C20.0653 0 23.1577 -1.56944e-07 25.0791 1.83162C27.0004 3.66325 27.0004 6.6112 27.0004 12.5071C27.0004 18.403 27.0004 21.351 25.0791 23.1826C23.1577 25.0142 20.0653 25.0142 13.8806 25.0142C7.69583 25.0142 4.60346 25.0142 2.68209 23.1826C0.760742 21.351 0.760742 18.403 0.760742 12.5071Z"
                        fill="#E33827"
                      />
                      <path
                        d="M18.1919 8.39785L9.57176 16.6154M18.1919 16.6154L9.57176 8.39785"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  class="socialShares-sec"
                  :class="{ collapsed: isCollapsed }"
                  style="
                    width: 98%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 5px 10px;
                    height: 40px;
                  "
                  v-if="
                    current_tab === 'image' &&
                    closeShareMenu &&
                    active_tab_image === 'home_design'
                  "
                >
                  <!-- Middle: Share section -->
                  <div
                    style="
                      border: 1px solid rgba(0, 0, 0, 0.2);
                      background: #ffffff;
                      padding: 3px 12px;
                      border-radius: 6px;
                      cursor: pointer;
                      color: #2a5afc;
                      display: flex;
                      align-items: center;
                      gap: 6px;
                      font-size: 16px;
                    "
                  >
                    <span style="font-size: 16px; color: #444"
                      >Share on social:</span
                    >
                    <img src="/whatsapp.svg" alt="Whatsapp" class="w-5 h-5" />
                    <img
                      src="/logos_facebook.svg"
                      alt="Facebook"
                      class="w-5 h-5"
                    />
                    <img src="/instagram.svg" alt="Instagram" class="w-5 h-5" />
                  </div>
                  <!-- Right: Buttons -->
                  <div style="display: flex; align-items: center; gap: 12px">
                    <!-- <a-button
                      @click="Change_Room_SeeAll()"
                      style="
                        border: 1px solid rgba(0, 0, 0, 0.2);
                        background: #ffffff;
                        padding: 5px 12px;
                        border-radius: 6px;
                        cursor: pointer;
                        color: #2a5afc;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 16px;
                      "
                    >
                      <svg
                        width="19"
                        height="20"
                        viewBox="0 0 19 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.625 15.5417V10.2114C16.625 9.78192 16.5376 9.35689 16.3682 8.9622C16.1987 8.56752 15.9508 8.21143 15.6394 7.9156L10.5909 3.12048C10.2967 2.84093 9.90627 2.68506 9.5004 2.68506C9.09452 2.68506 8.70414 2.84093 8.40988 3.12048L3.36062 7.9156C3.04922 8.21143 2.80126 8.56752 2.63182 8.9622C2.46238 9.35689 2.375 9.78192 2.375 10.2114V15.5417C2.375 15.9617 2.54181 16.3644 2.83875 16.6613C3.13568 16.9582 3.53841 17.1251 3.95833 17.1251H15.0417C15.4616 17.1251 15.8643 16.9582 16.1613 16.6613C16.4582 16.3644 16.625 15.9617 16.625 15.5417Z"
                          stroke="#3B63FB"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      Change Room
                    </a-button> -->
                    <a-button
                      style="
                        border: 1px solid rgba(0, 0, 0, 0.2);
                        background: #ffffff;
                        padding: 5px 12px;
                        border-radius: 6px;
                        cursor: pointer;
                        color: #2a5afc;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 16px;
                      "
                      @click="downloadImage"
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
                      Download
                    </a-button>
                  </div>
                </div>
              </div>

              <!-- Show loading state when room is not ready -->
              <!-- <div v-if="!is_ready || canvasLoading" class="canvas-loading-container">
              <div class="loading-content">
                <a-spin size="large" />
                <h3 style="margin-top: 16px;">
                  {{ roomLoadingMessage }}
                </h3>
                <p v-if="roomRetryCount > 0" style="margin-top: 8px; color: #666;">
                  Retry attempt: {{ roomRetryCount }}
                </p>
                <div v-if="roomLoadingProgress" style="margin-top: 12px; width: 300px;">
                  <a-progress :percent="roomLoadingProgress" status="active" />
                </div>
              </div>
            </div>
  
            <template v-else>
              
            </template> -->
              <!-- {{this.base_image_url}} -->
              <!-- {{ this.binaryMaskList }} -->
              <!-- {{ this.binaryMasks_objects_detected }} -->

              <!-- Alternative: If you want to show loading for all canvas components -->
              <div
                :style="{
                  width: '100%',
                  height: '100%',
                }"
                v-if="LockCanvasOperation === false"
              >
                <canvas_floor_render
                  v-if="
                    current_tab == 'image' &&
                    active_tab_image === 'item_replacement' &&
                    select_replace === 'Floor'
                  "
                  :baseImage="base_image_url"
                  :isLoading="canvasLoading"
                  :key="canvasKey"
                  @Apply-Changes="ApplyChanges"
                />
                <canvas_item_remover_render
                  v-if="
                    current_tab == 'image' &&
                    active_tab_image === 'item_replacement' &&
                    select_replace === 'All'
                  "
                  :baseImage="base_image_url"
                  :objectMasks="binaryMasks_objects_detected"
                  :cachedObjectImages="cachedObjectImages"
                  :objectMaskCacheReady="objectMaskCacheReady"
                  :isLoading="canvasLoading"
                  :selectionMode="selectionMode"
                  :showDebugInfo="false"
                  :key="canvasKey"
                  :new_room_rendering_completed_percentage="
                    new_room_rendering_completed_percentage
                  "
                  @object-selection-changed="onObjectSelectionChanged"
                  @objects-selected-for-removal="onObjectsSelectedForRemoval"
                  @processing-progress="onProcessingProgress"
                  @processing-complete="onProcessingComplete"
                  @make-room-empty="makeRoomEmpty"
                  @reset-entire-room="resetChangesinBaseImage"
                  @Apply-Changes="ApplyChanges"
                  @handle_removal_completed="fetchRoom()"
                  @furniture-switching-started="furniture_Switching_started"
                  @furniture-switched="furniture_Switched"
                  @insufficient-credits="throw_Insufficient_credits"
                />
                <!-- @redetect-objects-room="fetch_redetect_ObjectsBinary_Masks" -->
                <!-- ceiling light renderer -->
                <img
                  :src="this.base_image_url"
                  style="width: 100%; height: 100%; object-fit: contain"
                  alt=""
                  v-if="
                    current_tab == 'image' &&
                    active_tab_image === 'item_replacement' &&
                    select_replace === 'Lights' &&
                    selected_light_type === ''
                  "
                />
                <canvas_lights_render
                  v-if="
                    current_tab == 'image' &&
                    active_tab_image === 'item_replacement' &&
                    select_replace === 'Lights' &&
                    selected_light_type === 'sunk'
                  "
                  :baseImage="base_image_url"
                  :isLoading="canvasLoading"
                  :selectedlightuuid="selectedlightuuid"
                  :depthMask="depthMask"
                  :key="canvasKey"
                  @insufficient-credits="throw_Insufficient_credits"
                  @magentic-lights-added="magneticLightsMearjed"
                  @Apply-Changes="ApplyChanges"
                  ref="canvas_sunk_magnetic_lights_render"
                />
                <canvas_unsunk_lights_render
                  v-if="
                    current_tab == 'image' &&
                    active_tab_image === 'item_replacement' &&
                    select_replace === 'Lights' &&
                    selected_light_type === 'unsunk'
                  "
                  :baseImage="base_image_url"
                  :isLoading="canvasLoading"
                  :selectedlightuuid="selectedlightuuid"
                  :depthMask="depthMask"
                  :key="canvasKey"
                  @magentic-lights-added="magneticLightsMearjed"
                  @Apply-Changes="ApplyChanges"
                />

                <!-- glbUrl="http://127.0.0.1:8000/media/products/ceiling_lamp_disk.glb" -->
                <!-- <ceiling_3d_object_renderer
                  v-if="
                    current_tab == 'image' &&
                    active_tab_image === 'item_replacement' &&
                    select_replace === 'Lights' &&
                    selected_light_type === 'hanging'
                  "
                  :glbUrl="model_3d_url"
                  :selectedlightuuid="selectedlightuuid"
                  :baseImageUrl="base_image_url"
                  :floorMaskUrl="depthMask"
                  :roll="ceiling_roll"
                  :pitch="ceiling_pitch"
                  :yaw="ceiling_yaw"
                  @model-3d-light-added="magneticLightsMearjed"
                  @Apply-Changes="ApplyChanges"
                  ref="canvas_ceiling_3d_object_light_renderer"
                  @insufficient-credits="throw_Insufficient_credits"
                /> -->
                <ceiling_3d_object_renderer
                  v-if="
                    current_tab == 'image' &&
                    active_tab_image === 'item_replacement' &&
                    select_replace === 'Lights' &&
                    selected_light_type === 'hanging'
                  "
                  v-bind="active_room_ptcld_cords"
                  :glbUrl="model_3d_url"
                  :selectedlightuuid="selectedlightuuid"
                  :debug="debug"
                  :baseImageUrl="base_image_url"
                  :ceilingMaskUrl="
                    this.$store.state.root_media_api +
                    active_room_ptcld_cords.CEILING_MASK
                  "
                  :TARGET_DIMS="selected_3dlight_model_diamensions"
                  :roll="ceiling_roll"
                  :pitch="ceiling_pitch"
                  :yaw="ceiling_yaw"
                  @model-3d-light-added="magneticLightsMearjed"
                  @Apply-Changes="ApplyChanges"
                  ref="canvas_ceiling_3d_object_light_renderer"
                  @insufficient-credits="throw_Insufficient_credits"
                />

                <!-- ceiling light renderer -->

                <canvas_walls_render
                  v-if="
                    current_tab == 'image' &&
                    active_tab_image === 'item_replacement' &&
                    select_replace === 'Wall'
                  "
                  :baseImage="base_image_url"
                  :binaryMasks="binaryMaskList"
                  :isLoading="canvasLoading"
                  :maskUpdateTrigger="maskUpdateTrigger"
                  @update:selectedMasks="selected_wall_masks"
                  @rescale-room-layout="rescaleWallMask()"
                  :key="canvasKey"
                  @Apply-Changes="ApplyChanges"
                />

                <!-- glbUrl="http://127.0.0.1:8000/media/products/3d_models/046-cp7.glb" -->
                <!-- {{ floor_3d_model_grid }} -->
                <!-- <items_replacement_renderer
                  v-if="
                    current_tab == 'image' &&
                    active_tab_image === 'item_replacement' &&
                    select_replace === 'Furniture'
                  "
                    @model-transform-updated="handle3DModelTransformUpdate"
                    @update:isLoading="StartEndCanvasLoading"

                  :glbUrl="item_replacement_renderer_3d_model_url"
                  :is_resizable="is_resizable"
                  :isLoading="canvasLoading"
                  :product_id="selected_3d_product_model"
                  :modelDimensions="{
                    width: selected_model_width,
                    height: selected_model_height,
                    depth: selected_model_depth,
                  }"
                  :baseImageUrl="base_image_url"
                  :floorData="floor_3d_model_grid"
                  :depthMaskUrl="depthMask"
                  :floorMaskUrl="floor_Mask"
                  :roll="floor_roll"
                  :pitch="floor_pitch"
                  :yaw="floor_yaw"
                  ref="floor_item_3d_renderer"
                  @add-3d-furniture-to-room-start-polling="
                    updateBaskeImageURL_CANVAS
                  "
                  @Apply-Changes="ApplyChanges"
                  @insufficient-credits="throw_Insufficient_credits"
                /> -->
               
<!-- {{ active_room_ptcld_cords }} -->
                <items_replacement_renderer
                  v-if="
                    current_tab == 'image' &&
                    active_tab_image === 'item_replacement' &&
                    select_replace === 'Furniture'
                  "
                  ref="floor_item_3d_renderer"
                  :key="base_image_url"
                  :debug="debug"
                  v-bind="active_room_ptcld_cords"
                  :isLoading="canvasLoading"
                  :TARGET_DIMS="{
                    width: selected_model_width,
                    height: selected_model_height,
                    depth: selected_model_depth,
                  }"
                  :BASE_ROOT_MAIN_IMAGE="base_image_url"
                  :CHAIR_MODEL="item_replacement_renderer_3d_model_url"
                  :is_resizable="is_resizable"
                  @switch-to-original-primary-3d-model="switch_to_original_primary_3d_model"
                  :colors_available_for_3d_model="colors_available_for_3d_model"
                  :switched_color="switched_color"
                  @switch-3d-model-change-color="switched_3D_model_same_product_different_color"

                  @model-transform-updated="handle3DModelTransformUpdate"
                  @update:isLoading="StartEndCanvasLoading"
                  @add-3d-furniture-to-room-start-polling="
                    updateBaskeImageURL_CANVAS
                  "
                  @update-dimensions="update_3d_product_diamensions"
                  @reset_target_dimensions="reset_target_dimensions"

                  :product_id="selected_3d_product_model"
                  @Apply-Changes="ApplyChanges"
                  @insufficient-credits="throw_Insufficient_credits"

                  @unselect-object="unselect_currrent_selected_object"
                >
                </items_replacement_renderer>

                <!-- :glbModelUrl="this.$store.state.root_media_api+'/media/3d-Rendered-Models/temp/8a36f84a-39e3-40f3-a194-05c5a46c0c2d/HY-2.0-3D-Textured-model_00023_.glb '" -->
                <a-row v-if="current_tab == '3d'">
                  <a-col :sm="0" :xs="0" :md="16" :lg="16">
                    <object_viewer_3d_tab
                      v-if="current_tab == '3d'"
                      :glbModelUrl="generated3dModel_url"
                      :isLoading="processing_generate_is_Loading"
                      :Model_instance_id="model_instance_id"
                      @clicked-add-product="add_new_product"
                    />
                  </a-col>

                  <a-col :sm="0" :xs="0" :md="8" :lg="8">
                    <models_3d_generate_history
                      v-if="current_tab == '3d'"
                      :list_history_generated_3d_models="
                        list_history_generated_3d_models
                      "
                      :loading_generated_models_history="
                        loading_generated_models_history
                      "
                      @clicked-model="new3DModelGenerated"
                    />
                  </a-col>
                </a-row>

                <a-row
                  v-if="
                    current_tab == 'image' && active_tab_image === 'home_design'
                  "
                >
                  <a-col :sm="0" :xs="0" :md="16" :lg="16">
                    <main_panel_home_design
                      v-if="
                        current_tab == 'image' &&
                        active_tab_image === 'home_design'
                      "
                      :home_design_images="home_design_images"
                      @updateBaseImageUrlForHomeDesign="
                        updateBaseImageUrlForHomeDesign
                      "
                    />
                  </a-col>

                  <a-col :sm="0" :xs="0" :md="8" :lg="8">
                    <history_panel_home_design
                      v-if="
                        current_tab == 'image' &&
                        active_tab_image === 'home_design'
                      "
                      @home-design-history-clicked="home_design_history_clicked"
                      ref="home_design_history"
                    />
                  </a-col>
                </a-row>

                <a-row v-if="current_tab == 'edit_image'">
                  <a-col :sm="0" :xs="0" :md="16" :lg="16">
                    <main_panel_edit_image
                      v-if="current_tab == 'edit_image'"
                      :product_mockup_images="product_mockup_images"
                      :selected_product_mockups_group="
                        selected_product_mockups_group
                      "
                    />
                  </a-col>

                  <a-col :sm="0" :xs="0" :md="8" :lg="8">
                    <history_panel_edit_image
                      v-if="current_tab == 'edit_image'"
                      @product-mockup-history-clicked="
                        product_mockup_history_clicked
                      "
                      ref="product_mockup_history"
                    />
                  </a-col>
                </a-row>
              </div>
              <div v-else>
                <div
                  style="
                    /* position: fixed; */
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                  "
                >
                  <!-- Image container -->
                  <div
                    style="
                      position: relative;
                      background: #fff;

                      max-height: 90vh;
                      max-width: 90vw;
                    "
                  >
                    <img
                      :src="base_image_url"
                      style="
                        max-height: 89vh;
                        max-width: 80vw;
                        object-fit: contain;
                        display: block;
                        margin: auto;
                      "
                    />

                    <!-- Center warning overlay -->
                    <div
                      style="
                        position: absolute;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.55);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        color: #fff;
                        font-size: 18px;
                        font-weight: 500;
                        padding: 24px;
                      "
                    >
                      <div>
                        <p
                          style="
                            font-size: 20px;
                            font-weight: 600;
                            margin-bottom: 12px;
                          "
                        >
                          ⚠️ Privacy Notice
                        </p>
                        <p>
                          Please upload a room image
                          <b>without people</b>.<br />
                          Images containing persons are <b>not processed</b> as
                          per our privacy policies.
                        </p>
                        <a-space>
                          <a-button
                            type="primary"
                            @click="
                              this.$route.query.brand
                                ? this.$router.push(
                                    '/start-new-catalogue?brand=' +
                                      this.$route.query.brand,
                                  )
                                : this.$router.push('/start-new-catalogue')
                            "
                            style="
                              align-items: center;
                              display: flex;
                              justify-content: center;
                            "
                            ><CloudUploadOutlined style="font-size: 18px" />
                            Upload new Image</a-button
                          >
                          <a-button
                            type="default"
                            @click="RoomRemovePerson"
                            :loading="canvasLoading"
                            style="
                              align-items: center;
                              display: flex;
                              justify-content: center;
                            "
                            ><UserDeleteOutlined style="font-size: 18px" />
                            Remove persons</a-button
                          >
                        </a-space>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>

        <!-- Global Error Modal -->
        <a-modal
          v-model:visible="showErrorModal"
          title="Error"
          :footer="null"
          @ok="showErrorModal = false"
        >
          <a-alert
            :message="modalError.title"
            :description="modalError.description"
            type="error"
            show-icon
          />
          <div style="margin-top: 16px; text-align: right">
            <a-button @click="showErrorModal = false">Close</a-button>
            <a-button
              v-if="modalError.retry"
              type="primary"
              @click="modalError.retry()"
              style="margin-left: 8px"
            >
              Retry
            </a-button>
          </div>
        </a-modal>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import switch_business from "@/views/catalogue/switch_business.vue";
import {
  BulbOutlined,
  CloudUploadOutlined,
  UserDeleteOutlined,
  SwapOutlined,
  MessageOutlined,
} from "@ant-design/icons-vue";
import canvas_floor_render from "@/components/update_catalogue/canvas_renderer/canvas_floor_render.vue";
import canvas_item_remover_render from "@/components/update_catalogue/canvas_renderer/canvas_item_remover_render.vue";
import canvas_lights_render from "@/components/update_catalogue/canvas_renderer/canvas_lights_render.vue";
import canvas_unsunk_lights_render from "@/components/update_catalogue/canvas_renderer/canvas_unsunk_lights_render.vue";
import canvas_walls_render from "@/components/update_catalogue/canvas_renderer/canvas_walls_render.vue";
import items_replacement_renderer from "@/components/update_catalogue/item_replacement/items_replacement_3d_model_renderer.vue";
import add_new_furniture from "@/components/dashboard/business/my_products/add_new_product/add_furniture_modal.vue";
import sidepanel_3d_tab from "@/components/update_catalogue/tab_3d/side_panel_3d.vue";
import object_viewer_3d_tab from "@/components/update_catalogue/tab_3d/canvas_renderer.vue";
import models_3d_generate_history from "@/components/update_catalogue/tab_3d/generate_history.vue";
import fernitures from "@/components/update_catalogue/list_products/fernitures.vue";
import walls from "@/components/update_catalogue/list_products/walls.vue";
import floor from "@/components/update_catalogue/list_products/floor.vue";
import lights from "@/components/update_catalogue/list_products/lights.vue";
import side_panel_home_design from "@/components/update_catalogue/home_design/side_panel.vue";
import main_panel_home_design from "@/components/update_catalogue/home_design/main_panel.vue";
import history_panel_home_design from "@/components/update_catalogue/home_design/history_panel.vue";
import side_panel_edit_image from "@/components/update_catalogue/edit_image/side_panel.vue";
import main_panel_edit_image from "@/components/update_catalogue/edit_image/main_panel.vue";
import history_panel_edit_image from "@/components/update_catalogue/edit_image/history_panel.vue";
import ceiling_3d_object_renderer from "@/components/update_catalogue/renderer_3d_objects/ceiling_3d_renderer.vue";

import wall_textures_bottom_drawer_menu from "@/components/update_catalogue/bottom_drawer_item_components/wall_textures.vue";
import floor_textures_bottom_drawer_menu from "@/components/update_catalogue/bottom_drawer_item_components/floor_textures.vue";
import furnitures_bottom_drawer_menu from "@/components/update_catalogue/bottom_drawer_item_components/furnitures.vue";
import light_items_bottom_drawer_menu from "@/components/update_catalogue/bottom_drawer_item_components/light_items.vue";
import fetch_all_drawer_component from "@/components/update_catalogue/bottom_drawer_item_components/fetchAllDrawer.vue";

import ai_catalog_item_replacement_3d_products from "@/components/update_catalogue/list_products/item_replacement_3d_products.vue";
import PlanUpgradeModal from "./PlanUpgradeModal.vue";
import { update } from "three/examples/jsm/libs/tween.module.js";

export default {
  name: "update_catelogue",

  data() {
    return {
      brand_is_saling_floor:false,
      brand_is_saling_furniture:false,
      brand_is_saling_wall:false,
      brand_is_saling_light:false,

      history_total_count: 0,
      history_current_offset: 0,
      history_limit: 12,

      active_room_ptcld_cords: null,
      debug: false,
      currentUser: JSON.parse(localStorage.getItem("user")),
      LoadingMessageButton: false,
      buid: null,
      creditErrorMessage: "",
      showCreditModal: false,
      showFailedRenderingModel: false,
      failure_reason: "",

      showPlanUpgradeModal: false,
      preserved3DModelTransform: null,
      planDetails: null,
      planIsExpired:false,
      LockCanvasOperation: false,
      brand: "",
      brand_data: {
        name: "DYD",
        business_picture: "/media/default/banner.jpg",
        banner_picture: "/media/default/banner.jpg",
      },
      isCollapsed: false,
      user: JSON.parse(localStorage.getItem("user")),
      // profile: JSON.parse(localStorage.getItem('profile')),
      // business_info: JSON.parse(localStorage.getItem('business_profile') || '{}'),

      // UI State
      select_replace: "All",
      current_tab: "image",
      imageLoadedMap: {},
      active_tab_image: "item_replacement",
      selectedlightuuid: "",
      selected_light_type: "",
      model_3d_url: "",
      primary_model_3d_url: "",
      item_replacement_renderer_3d_model_url: "",
      is_resizable: false,
      selected_3d_product_model: "",
      colors_available_for_3d_model:null,
      switched_color:null,
      maskUpdateTrigger: 0,
      // selected 3d model width,height,depth
      selected_model_width: 0,
      selected_model_height: 0,
      selected_model_depth: 0,
      main_object_dims:null,
      
      // 3D Tab
      generated3dModel_url: "",
      model_instance_id: "",
      processing_generate_is_Loading: false,
      list_history_generated_3d_models: [],
      loading_generated_models_history: false,

      // Brand Products
      brand_floors: [],
      brand_walls: [],
      brand_furniture_products: [],
      brand_lights: [],

      // 3D Room Coordinates
      floor_roll: 0,
      floor_pitch: 0,
      floor_yaw: 0,
      ceiling_roll: 0,
      ceiling_pitch: 0,
      ceiling_yaw: 0,
      selected_3dlight_model_diamensions: {
        width: 0.5,
        height: 0.3,
        depth: 0.5,
      },

      // Room Data
      base_image_url: "",
      tempBaseImageUrl: "",
      sideFinalImage: "",
      depthMask: "",
      floor_Mask: "",
      floor_3d_model_grid: null,

      // Modals See All
      openSeeAll_products: false,
      seeAll_products: [],
      openSeeAll_furnitures: false,
      seeAll_furnitures: [],
      openSeeAll_Walls: false,
      seeAll_Walls: [],
      openSeeAll_Floor: false,
      seeAll_Floor: [],
      openSeeAll_Lights: false,
      seeAll_Lights: [],

      openSeeAll_ChangeRoom: false,
      closeShareMenu: true,
      showAddProduct: false,

      // Change Room
      your_history_change_room: [],
      exampleImages_changeRoom: [],

      // Binary Masks
      binaryMaskList: [],
      binaryMask_List_media: [],
      selectedMasks: [],
      allWallsBinaryMasks: [],
      selected_binarymasks_walls: [],

      // Object Detection
      binaryMasks_objects_detected: {},
      allObjectsBinaryMasks: [],
      selected_objects_binary_masks: [],

      // Canvas Control
      canvasKey: 0,
      canvasLoading: true,
      selectionMode: "multiple",
      showSelectionButtons: true,

      // Cache Management
      objectMaskCache: new Map(),
      cachedObjectImages: new Map(),
      objectMaskCacheReady: false,
      objectMaskLoadingProgress: 0,
      objectMaskLoadingTotal: 0,
      preloadingStarted: false,
      cacheInitializationPromise: null,

      // Room States
      is_rendered_walls_mask: false,
      is_rendered_objects_mask: false,
      new_room_rendering_completed_percentage: null,

      is_ready: false,
      roomRetryCount: 0,
      roomLoadingMessage: "Initializing room data...",
      roomLoadingProgress: 0,
      maxRetryAttempts: 200,
      roomPollingInterval: null,

      // Home Design & Product Mockup
      home_design_images: null,
      product_mockup_images: null,
      selected_product_mockups_group: null,

      // Loading States
      loading: {
        room: false,
        binaryMasks: false,
        canvas: false,
        objectMasks: false,
      },

      // Error Handling
      error: {
        general: null,
        room: null,
        binaryMasks: null,
        objectMasks: null,
      },
      showErrorModal: false,
      modalError: {
        title: "",
        description: "",
        retry: null,
      },

      // API Tracking
      abortControllers: new Map(),

      // Processing States
      processingObjects: false,
      processingCurrent: 0,
      processingTotal: 0,
      processingProgress: 0,

      openSeeAll_brands_panel: false,
    };
  },

  computed: {
    objectMasksLoadingStatus() {
      if (
        !this.binaryMasks_objects_detected ||
        Object.keys(this.binaryMasks_objects_detected).length === 0
      ) {
        return { loaded: 0, total: 0, percentage: 100, isEmpty: true };
      }

      const total = Object.keys(this.binaryMasks_objects_detected).length;
      const loaded = this.cachedObjectImages?.size || 0;
      const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;

      return { loaded, total, percentage, isEmpty: false };
    },

    canShowItemReplacement() {
      return (
        this.current_tab === "image" &&
        this.active_tab_image === "item_replacement" &&
        this.is_ready &&
        !this.canvasLoading
      );
    },

    itemReplacementStatus() {
      const status = this.objectMasksLoadingStatus;

      if (status.isEmpty) {
        return {
          message: "No objects detected in the room",
          type: "info",
          showCanvas: true,
        };
      } else if (!this.objectMaskCacheReady) {
        return {
          message: `Loading object detection... ${status.percentage}%`,
          type: "loading",
          showCanvas: false,
        };
      } else {
        return {
          message: `${status.total} objects ready for selection`,
          type: "success",
          showCanvas: true,
        };
      }
    },
  },

  async mounted() {
    this.loadBrandPurchasedPlanDetails();

    await this.initializeComponent();
    if (this.$route.query.home_design) {
      this.goto_home_design_show(this.$route.query.home_design);
      // console.log(this.$route.query.home_design)
    }
    if (
      (this.$route.query.window_name === "furniture" ||
        this.$route.query.window_name === "light") &&
      (this.$route.query.product_type === "furniture" ||
        this.$route.query.product_type === "light") &&
      this.$route.query.product_id
    ) {
      this.loadProductDetailsAndInitialize();
    }
  },

  beforeUnmount() {
    if (this.roomPollingInterval) {
      clearInterval(this.roomPollingInterval);
    }
    this.abortControllers.forEach((controller) => controller.abort());
    this.clearAllCaches();
  },

  methods: {
    update_3d_product_diamensions(e){
      console.log(e);
      this.selected_model_width=e.width 
      this.selected_model_height=e.height 
      this.selected_model_depth=e.depth 
      // debugger
    },
    reset_target_dimensions(e){
      console.log(e);
      this.selected_model_width=this.main_object_dims.width;
      this.selected_model_height=this.main_object_dims.height;
      this.selected_model_depth=this.main_object_dims.depth;
      // debugger
    },
    switch_to_original_primary_3d_model(e){
      this.switched_color=null
      this.item_replacement_renderer_3d_model_url=this.primary_model_3d_url
    },
    switched_3D_model_same_product_different_color(e){
      
      this.switched_color=e
      this.item_replacement_renderer_3d_model_url=this.$store.state.root_media_api+e['3d_model_available']
    },
    unselect_currrent_selected_object(){
       this.selected_model_width = 0.00;
        this.selected_model_height = 0.00;
        this.selected_model_depth = 0.00;
      
        this.is_resizable = false;
        this.selected_3d_product_model ='';
        this.item_replacement_renderer_3d_model_url = "";
       this.$refs.furniture_products_list_mobile.makeUnselectItem()
       this.$refs.furniture_products_list.makeUnselectItem()
        const { product_type, product_id, ...remainingQuery } = this.$route.query;
        this.$router.replace({
          query: remainingQuery
        });

    },
    // Existing method - REFACTOR IT
    async loadProductDetails() {
      try {
        // const url = `${this.$store.state.root_api}product/api/product-details/${this.product_id}/`;
        const url = `${this.$store.state.root_api}product/api/product-details/${this.$route.query.product_id}/`;

        console.log("📡 Fetching from:", url);

        const token = localStorage.getItem("token");
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("Invalid response format");
        }

        const data = result.data;
        // console.log(data);
        // debugger
        return {
          // model_url: this.$store.state.root_media_api + data['3d_model'],
          model_url: this.$store.state.root_media_api + data["model_file"],

          is_resizable: data.is_resizable,
          dimensions: {
            width: data.dimensions.width,
            height: data.dimensions.height,
            depth: data.dimensions.length,
          },
          is_ceiling_light_product: data.is_ceiling_light_product,
          light_type: data.light_type,
        };
      } catch (error) {
        console.error("❌ Error loading product details:", error);
        throw error;
      }
    },
    async loadProductDetailsAndInitialize() {
      try {
        this.canvasLoading = true;

        this.loadingText = "Loading product details...";

        const productData = await this.loadProductDetails();

        if (!productData) {
          throw new Error("Failed to load product details");
        }
        //  console.log(productData);
        //   debugger
        console.log("✅ Product data loaded:", productData);

        // Set original dimensions (NEVER MODIFY THESE)
        this.modelDimensions = {
          width: parseFloat(productData.dimensions.width),
          height: parseFloat(productData.dimensions.height),
          depth: parseFloat(productData.dimensions.depth),
        };

        console.log("📏 Original dimensions:", this.modelDimensions);

        if (this.$route.query.window_name == "furniture") {
          this.selected_model_width = this.modelDimensions.width;
          this.selected_model_height = this.modelDimensions.height;
          this.selected_model_depth = this.modelDimensions.depth;
          this.item_replacement_renderer_3d_model_url = productData.model_url;
          // console.log(this.item_replacement_renderer_3d_model_url);
        }

        if (this.$route.query.window_name == "light") {
          this.model_3d_url = productData.model_url;
          this.selectedlightuuid = this.$route.query.product_id;
          this.selected_3dlight_model_diamensions = {
            width: productData.dimensions.width,
            height: productData.dimensions.height,
            depth: productData.dimensions.length,
          };
          // is_ceiling_light_product
          // light_type
        }

        // debugger
        this.canvasLoading = false;
      } catch (error) {
        console.error("❌ Failed to load product:", error);
        this.canvasLoading = false;
      }
    },
    texture_floor_selected(e) {
      this.$router.replace({
        query: {
          ...this.$route.query, // keep existing query params
          product_type: "floor",
          product_id: e,
          window_name: "floor",
        },
      });
    },
    texture_wall_selected(e) {
      this.$router.replace({
        query: {
          ...this.$route.query, // keep existing query params
          product_type: "wall",
          product_id: e,
          window_name: "wall",
        },
      });
    },

    checkHomeDesignAccess() {
      if (!this.planDetails) {
        console.warn("Plan details not loaded yet");
        return false;
      }

      return this.planDetails.home_design === true;
    },

    async loadBrandPurchasedPlanDetails() {
      try {
        const url = `${this.$store.state.root_api}subscription/api/get-business-plan-details/${this.$route.query.brand}/`;

        console.log(" Fetching from:", url);

        const token = localStorage.getItem("token");
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          this.planDetails = result.data;
          this.planIsExpired = result.is_expired;
          
          // ==================================================================
          // Plan is not purchased 
          // ==================================================================
          if (result.planDetails.plan_name ===null){
            this.planIsExpired = true;
          }
          // ==================================================================
          // Plan is not purchased 
          // ==================================================================
          
          console.log("✅ Plan details loaded:", this.planDetails);
        }

        console.log(result);
      } catch (error) {
        console.error(" Error loading product details:", error);
        throw error;
      }
    },

    handle3DModelTransformUpdate(transform) {
      this.preserved3DModelTransform = transform;
      console.log("📌 Preserved 3D transform:", transform);
    },
    async startchat_with_buisness_user() {
      const selectedUser = this.buid;
      this.LoadingMessageButton = true;
      const payload = JSON.stringify({
        type: "DM",
        members: [this.currentUser.id, parseInt(selectedUser.id)],
        name: `${this.currentUser.first_name} & ${selectedUser.first_name}`,
      });
      try {
        const response = await fetch(
          `${this.$store.state.root_api}chat/chats`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + localStorage.getItem("token"),
            },
            body: payload,
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const room = data.room || data;

        // if (this.currentUser.user_type === 'User') {

        if (this.currentUser.user_type === "User") {
          this.$router.push({
            path: "/user-dashboard/my-messages",
            query: { chatId: data.room_id },
          });
        }

        if (this.currentUser.user_type === "Business") {
          this.$router.push({
            path: "/my-store/messages",
            query: { chatId: data.room_id },
          });
        }
        if (this.currentUser.user_type === "Professional") {
          this.$router.push({
            path: "/professional-dashboard/my-messages",
            query: { chatId: data.room_id },
          });
        }
        // }
      } catch (error) {
        console.error("Error creating/finding room:", error);
      }
      this.LoadingMessageButton = false;
    },

    handlePlanUpgrade(selectedPlan) {
      console.log(`User selected to upgrade to: ${selectedPlan}`);
    },

    StartEndCanvasLoading(e) {
      this.canvasLoading = e;
    },
    async switchRoomBrand(brand_slug) {
      try {
        const url = `${this.$store.state.root_api}room/api/switch-room-brand/${this.$route.params.id}/${brand_slug}/`;

        const responseData = await this.makeApiRequest(
          url,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
          "switch-the-room-brand",
        );

        if (responseData?.success) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Failed to switch room brand:", error);
      }
    },

    onHistoryImageLoad(id) {
      this.imageLoadedMap[id] = false;
      setTimeout(() => {
        this.imageLoadedMap[id] = true;
      }, 2000);
    },

    goto_home_design_show() {
      this.active_tab_image = "home_design";
    },
    toggleSocialShare() {
      this.isCollapsed = !this.isCollapsed;
    },
    throw_Insufficient_credits(message, buid = null) {
      // @insufficient-credits="throw_Insufficient_credits"
      // if(response.status==402){
      //    const result = await response.json()
      //    this.$emit('insufficient-credits',result.msg)
      //  }
      this.canvasLoading = false;
      this.processing_generate_is_Loading = false;
      this.creditErrorMessage = message;
      this.buid = buid;
      this.showCreditModal = true;
    },

    throw_failed_rendering(message) {
      // @insufficient-credits="throw_Insufficient_credits"
      // if(response.status==402){
      //    const result = await response.json()
      //    this.$emit('insufficient-credits',result.msg)
      //  }
      this.canvasLoading = false;
      this.processing_generate_is_Loading = false;
      this.failure_reason = message;

      this.showFailedRenderingModel = true;
    },

    furniture_Switching_started(e) {
      this.canvasLoading = true;
    },
    furniture_Switched(e) {
      this.canvasLoading = false;
      this.binaryMasks_objects_detected = e.result.objects_detected_masks || {};
      this.base_image_url =
        this.$store.state.root_media_api + e.result.final_output;

      this.forceCanvasUpdate();
      this.$message?.success(`Room Objects Switched !`);
    },

    get_all_products_tabs_available(e) {
      // console.log("==========================================")
      // console.log("==========================================")
      // console.log("==========================================")
      // console.log("==========================================")
      // console.log(e)

      this.brand_floors = e.floors;
      this.brand_walls = e.walls;
      this.brand_furniture_products = e.furniture_products;
      this.brand_lights = e.lights;

      // 👇 ADD THIS CODE HERE 👇
      if (this.$route.query.window_name === "All") {
        this.select_replace = "All";
      }
      if (this.$route.query.window_name === "furniture") {
        this.select_replace = "Furniture";
      }
      if (this.$route.query.window_name === "floor") {
        this.select_replace = "Floor";
      }
      if (this.$route.query.window_name === "wall") {
        this.select_replace = "Wall";
      }
      if (this.$route.query.window_name === "light") {
        this.select_replace = "Lights";
      }
    },
    async rescaleWallMask(e) {
      // 2. FLOOR TEXTURE METHOD (corrected)
      this.canvasLoading = true;

      try {
        const url = `${this.$store.state.root_api}engine/rescale-room-layout/`;
        const requestBody = {
          room_id: this.$route.params.id,
        };

        const responseData = await this.makeApiRequest(
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(requestBody),
          },
          "rescale-room-walls-layout",
        );

        if (responseData.error) {
          this.creditErrorMessage = responseData.msg;
          this.showCreditModal = true;
          this.buid = responseData.buid;

          return;
        }

        if (responseData) {
          // await this.fetchBinaryWallMasks();
          // this.forceCanvasUpdate();
          this.startPollingResetWallBinaryMask(responseData?.renderer_id);
          // this.$message.success("Floor texture applied successfully!");
        } else {
          throw new Error("No final output received from server");
        }
      } catch (error) {
        console.error("Failed to apply floor texture:", error);
        this.showError(
          "Failed to Apply Floor Texture",
          error.message ||
            "An error occurred while applying the floor texture.",
          () => this.floorTextureSelected(texture_id),
        );
      }
    },
    // ==========================================
    // INITIALIZATION
    // ==========================================
    async initializeComponent() {
      console.log("🚀 Initializing component...");

      this.canvasLoading = true;
      this.loading.canvas = true;
      this.roomLoadingMessage = "Loading room data...";

      try {
        await this.fetchRoom();

        if (this.is_ready) {
          this.roomLoadingMessage = "Loading room configurations...";
          await Promise.all([
            this.fetchBinaryWallMasks(),
            // this.fetchRoom_floor_3d_cords(),
            this.fetch3d_models_generated_by_room(),
          ]);

          console.log("✅ Component initialized");
        }
      } catch (error) {
        console.error("❌ Initialization failed:", error);
        this.showError("Initialization Failed", error.message, () =>
          this.initializeComponent(),
        );
      } finally {
        if (this.is_ready) {
          this.loading.canvas = false;
          this.canvasLoading = false;
        }
      }
    },

    // ==========================================
    // API UTILITIES
    // ==========================================
    createAbortController(key) {
      if (this.abortControllers.has(key)) {
        this.abortControllers.get(key).abort();
      }

      const controller = new AbortController();
      this.abortControllers.set(key, controller);
      return controller;
    },

    async makeApiRequest(url, options = {}, requestKey) {
      const controller = this.createAbortController(requestKey);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        if (!response.ok && response.status !== 402) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        // if (!response.ok) {
        //   throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        // }

        const data = await response.json();
        this.abortControllers.delete(requestKey);
        return data;
      } catch (error) {
        this.abortControllers.delete(requestKey);

        if (error.name === "AbortError") {
          console.log(`Request ${requestKey} cancelled`);
          return null;
        }
        throw error;
      }
    },

    syncBrandAndReload(brand) {
      if (!brand) return;

      const currentBrand = this.$route.query.brand;

      // If same → do nothing
      if (currentBrand === brand) return;

      // Build new URL with updated query
      const newQuery = {
        ...this.$route.query,
        brand,
      };

      const resolved = this.$router.resolve({
        path: this.$route.path,
        query: newQuery,
      });

      // FULL page refresh
      window.location.href = resolved.href;
    },
    // ==========================================
    // ROOM DATA FETCHING
    // ==========================================
    async fetchRoom() {
      console.log("📡 Fetching room...");

      try {
        const roomId = this.$route.params.id;
        const url = `${this.$store.state.root_api}room/api/room/${roomId}/`;

        const responseData = await this.makeApiRequest(
          url,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
          "room",
        );

        if (responseData?.data) {
          this.is_rendered_walls_mask =
            responseData.data.is_rendered_walls_mask;
          this.is_rendered_objects_mask =
            responseData.data.is_rendered_objects_mask;
            
            this.brand_is_saling_floor=responseData.data.brand_is_saling_floor
            this.brand_is_saling_furniture=responseData.data.brand_is_saling_furniture
            this.brand_is_saling_wall=responseData.data.brand_is_saling_wall
            this.brand_is_saling_light=responseData.data.brand_is_saling_light

          if (responseData?.data?.brand) {
            this.brand = responseData.data.brand;
            this.brand_data = {
              name: responseData.data.brand_name,
              business_picture: responseData.data.brand_banner_logo,
              banner_picture: responseData.data.brand_avatar_logo,
              brand_email:responseData.data.brand_email,
              brand_id:responseData.data.brand_id,
              // what products is sailing by brand 
              brand_is_saling_floor:responseData.data.brand_is_saling_floor,
              brand_is_saling_furniture:responseData.data.brand_is_saling_furniture,
              brand_is_saling_wall:responseData.data.brand_is_saling_wall,
              brand_is_saling_light:responseData.data.brand_is_saling_light,
            };


            // console.log("+-----------------------------=================-------------------=================")
            // console.log(this.brand_data)
            this.syncBrandAndReload(this.brand);
          }

          this.new_room_rendering_completed_percentage =
            responseData.data.completed_percentage;
          this.base_image_url =
            this.$store.state.root_media_api + responseData.data.main_image;
          this.is_ready = responseData.data.is_ready;

          if (!this.is_ready) {
            this.roomRetryCount++;

            if (this.roomRetryCount >= this.maxRetryAttempts) {
              throw new Error(
                `Room not ready after ${this.maxRetryAttempts} attempts`,
              );
            }

            this.roomLoadingMessage = `Preparing room... (${this.roomRetryCount}/${this.maxRetryAttempts})`;
            this.roomLoadingProgress = Math.round(
              (this.roomRetryCount / this.maxRetryAttempts) * 100,
            );
            this.startRoomPolling();
          } else {
            console.log(responseData.data);
            this.base_image_url =
              this.$store.state.root_media_api + responseData.data.image;
            this.depthMask =
              this.$store.state.root_media_api + responseData.data.depth_mask;
            this.floor_Mask =
              this.$store.state.root_media_api + responseData.data.floor_mask;

            this.roomLoadingProgress = 100;
            // console.log("===================================================")
            // console.log(this.$store.state.root_media_api + responseData.data.floor_3d_model_grid)
            this.load_the_fileData(
              this.$store.state.root_media_api +
                responseData.data.floor_3d_model_grid,
            );
this.$nextTick(() => {
              this.forceCanvasUpdate();
            });
            if (this.roomPollingInterval) {
              clearInterval(this.roomPollingInterval);
              this.roomPollingInterval = null;
            }
          }
        }
      } catch (error) {
        console.error("❌ Room fetch failed:", error);
        if (this.roomPollingInterval) {
          clearInterval(this.roomPollingInterval);
          this.roomPollingInterval = null;
        }
        this.showError("Failed to Load Room", error.message, () => {
          this.roomRetryCount = 0;
          this.fetchRoom();
        });
      }
    },

    //     async load_the_fileData(floor_3d_model_grid_url){
    //         this.isLoading = true;

    //   try {
    //     const response = await fetch(floor_3d_model_grid_url)

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`)
    //     }

    //     this.floor_3d_model_grid = await response.json()
    //     console.log("--------------------------------------------")
    //     console.log("--------------------------------------------"+this.floor_3d_model_grid_url)
    //   } catch (error) {
    //     console.error('Error loading floor data:', error)
    //   }
    //       this.isLoading = false;

    // },
    // async load_the_fileData(floor_3d_model_grid_url) {
    //   this.isLoading = true;

    //   try {
    //     const response = await fetch(floor_3d_model_grid_url);

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     this.floor_3d_model_grid = await response.json();
    //     console.log("Loaded floor grid:", this.floor_3d_model_grid);
    //   } catch (error) {
    //     console.error("Error loading floor data:", error);
    //   } finally {
    //     this.isLoading = false;
    //   }
    // },
    async load_the_fileData(floor_3d_model_grid_url) {
      this.isLoading = true;

      try {
        const response = await fetch(floor_3d_model_grid_url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.floor_3d_model_grid = await response.json();

        // 🔍 DIAGNOSTIC: Log floor dimensions
        console.log("=== FLOOR DATA LOADED ===");
        console.log(
          "Floor plane height:",
          this.floor_3d_model_grid.floor_plane?.height,
        );
        console.log("Floor bounds:", this.floor_3d_model_grid.floor_bounds);
        console.log(
          "Camera position:",
          this.floor_3d_model_grid.camera?.position,
        );
        console.log("Full floor data:", this.floor_3d_model_grid);
      } catch (error) {
        console.error("Error loading floor data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    startRoomPolling() {
      if (this.roomPollingInterval) {
        clearInterval(this.roomPollingInterval);
      }

      this.roomPollingInterval = setInterval(async () => {
        await this.fetchRoom();

        if (this.is_ready || this.roomRetryCount >= this.maxRetryAttempts) {
          clearInterval(this.roomPollingInterval);
          this.roomPollingInterval = null;

          if (this.is_ready) {
            await this.fetchBinaryWallMasks();
            this.loading.canvas = false;
            this.canvasLoading = false;
            this.forceCanvasUpdate();
          }
        }
      }, 3000);
    },

    async fetchRoom_floor_3d_cords() {
      try {
        const roomId = this.$route.params.id;
        const url = `${this.$store.state.root_api}engine/get-room-floor-3d-cords/${roomId}`;

        const responseData = await this.makeApiRequest(
          url,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
          "floor_3d_cords",
        );

        if (responseData?.data_floor && responseData.data_ceiling) {
          this.floor_roll = responseData.data_floor.roll;
          this.floor_pitch = responseData.data_floor.pitch;
          this.floor_yaw = responseData.data_floor.yaw;
          this.ceiling_roll = responseData.data_ceiling.roll;
          this.ceiling_pitch = responseData.data_ceiling.pitch;
          this.ceiling_yaw = responseData.data_ceiling.yaw;
        }
      } catch (error) {
        console.error("❌ Failed to fetch 3D coords:", error);
      }
    },

    // ==========================================
    // BINARY MASKS FETCHING
    // ==========================================
    async fetchBinaryWallMasks() {
      this.loading.binaryMasks = true;

      try {
        const roomId = this.$route.params.id;
        const url = `${this.$store.state.root_api}engine/new-room/?room_id=${roomId}`;

        const responseData = await this.makeApiRequest(
          url,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
          "binaryMasks",
        );

        if (responseData) {
          const binary_masks = responseData.binary_masks || [];
          this.allWallsBinaryMasks = binary_masks;
          this.binaryMask_List_media = binary_masks;
          this.binaryMaskList = binary_masks.map(
            (path) => `${this.$store.state.root_media_api}${path}`,
          );
          this.selectedMasks = Array.from(
            { length: this.binaryMaskList.length },
            (_, i) => i,
          );

          // this.active_room_ptcld_cords={
          //       // Camera intrinsics
          //       CAM_IMG_W: 1600,
          //       CAM_IMG_H: 1200,
          //       CAM_FX: 1.3832 * 1600,
          //       CAM_FY: 1.8443 * 1200,
          //       CAM_CX: 0.5 * 1600,
          //       CAM_CY: 0.5 * 1200,
          //       CAM_Z_SIGN: -1,
          //       MASK_ERODE_PX: 10,

          //       CAM_FOV_V: 30.0,
          //       // Asset paths
          //       POINTCLOUD: 'pointcloud_voxel_0_1m.ply',
          //       FLOOR_MASK: 'floor_mask.png',

          //       // Chair target dimensions
          //       // TARGET_DIMS: { width: 0.63, height: 0.94, depth: 0.57 },
          //       // BASE_ROOT_MAIN_IMAGE: '/room.jpg',
          //       // CHAIR_MODEL: 'sofa_1.glb',
          //     }
          this.active_room_ptcld_cords = responseData.active_room_ptcld_cords;
          this.active_room_ptcld_cords.POINTCLOUD =
            this.$store.state.root_media_api +
            this.active_room_ptcld_cords.POINTCLOUD;
          this.active_room_ptcld_cords.FLOOR_MASK =
            this.$store.state.root_media_api +
            this.active_room_ptcld_cords.FLOOR_MASK;

          this.binaryMasks_objects_detected =
            { ...responseData.objects_detected_masks } || {};
          this.allObjectsBinaryMasks = { ...this.binaryMasks_objects_detected };

          Object.entries(this.binaryMasks_objects_detected).forEach(
            ([key, value]) => {
              const baseKey = key.replace(/_\d+$/, "").trim().toLowerCase();

              if (baseKey === "person") {
                //   console.log('Person detected → key:', key, 'value:', value)
                //    this.$message?.error(
                //   'Human presence detected. For privacy, submit an image without people.',
                //   2
                // )
                // this.$message?.error(value)
                this.LockCanvasOperation = true;
              }
            },
          );
          this.maskUpdateTrigger += 1;

          this.$nextTick(() => {
            this.forceCanvasUpdate();
            setTimeout(() => this.forceCanvasUpdate(), 100);
          });

          if (Object.keys(this.binaryMasks_objects_detected).length > 0) {
            this.initializeObjectMaskCache();
          } else {
            this.objectMaskCacheReady = true;
          }
        }
      } catch (error) {
        console.error("❌ Failed to fetch masks:", error);
        this.showError("Failed to Load Masks", error.message, () =>
          this.fetchBinaryWallMasks(),
        );
      } finally {
        this.loading.binaryMasks = false;
      }
    },

    async fetch3d_models_generated_by_room() {
      this.loading_generated_models_history = true;

      try {
        const roomId = this.$route.params.id;
        const url = `${this.$store.state.root_api}engine/generated-3d-models-history/${roomId}`;

        const responseData = await this.makeApiRequest(
          url,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
          "fetch_generated_3d_models",
        );

        if (responseData) {
          this.list_history_generated_3d_models = responseData.models || [];
        }
      } catch (error) {
        console.error("❌ Failed to fetch 3D models:", error);
      } finally {
        this.loading_generated_models_history = false;
      }
    },

    // ==========================================
    // OBJECT MASK CACHING
    // ==========================================
    async initializeObjectMaskCache() {
      if (this.preloadingStarted) {
        return this.cacheInitializationPromise;
      }

      this.preloadingStarted = true;
      console.log("🚀 Starting object mask caching...");

      this.cacheInitializationPromise = this.performObjectMaskCaching();

      this.cacheInitializationPromise
        .then(() => console.log("✅ Caching completed"))
        .catch((error) => console.error("❌ Caching failed:", error));

      return this.cacheInitializationPromise;
    },

    async performObjectMaskCaching() {
      const objectEntries = Object.entries(
        this.binaryMasks_objects_detected,
      ).filter(([key, path]) => {
        // Skip invalid paths
        if (!path || typeof path !== "string") return false;
        return true;
      });

      this.objectMaskLoadingTotal = objectEntries.length;
      this.objectMaskLoadingProgress = 0;

      this.objectMaskCache.clear();
      this.cachedObjectImages.clear();

      const CHUNK_SIZE = 2;
      const chunks = this.createChunks(objectEntries, CHUNK_SIZE);
      let processedCount = 0;

      try {
        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
          const chunk = chunks[chunkIndex];

          await Promise.allSettled(
            chunk.map(([objectKey, maskPath]) =>
              this.loadAndCacheObjectMask(objectKey, maskPath),
            ),
          );

          processedCount += chunk.length;
          this.objectMaskLoadingProgress = Math.round(
            (processedCount / this.objectMaskLoadingTotal) * 100,
          );

          if (chunkIndex < chunks.length - 1) {
            await this.delay(25);
          }
        }

        this.objectMaskCacheReady = true;

        if (this.select_replace === "All") {
          this.$message?.success("Furniture detection ready!", 2);
        }
      } catch (error) {
        console.error("Caching error:", error);
        throw error;
      }
    },

    async loadAndCacheObjectMask(objectKey, maskPath) {
      try {
        const fullUrl = `${this.$store.state.root_media_api}/${maskPath}`;
        const img = await this.loadImageWithTimeout(fullUrl, 8000);

        const cacheData = {
          image: img,
          url: fullUrl,
          objectKey: objectKey,
          maskPath: maskPath,
          loaded: true,
          cachedAt: Date.now(),
        };

        this.objectMaskCache.set(objectKey, cacheData);
        this.cachedObjectImages.set(objectKey, img);

        return cacheData;
      } catch (error) {
        console.warn(`Failed to cache ${objectKey}:`, error.message);

        const errorData = {
          image: null,
          url: fullUrl,
          objectKey: objectKey,
          loaded: false,
          error: error.message,
        };

        this.objectMaskCache.set(objectKey, errorData);
        throw error;
      }
    },

    loadImageWithTimeout(src, timeout = 8000) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        const timeoutId = setTimeout(
          () => reject(new Error(`Timeout: ${src}`)),
          timeout,
        );

        img.onload = () => {
          clearTimeout(timeoutId);
          resolve(img);
        };

        img.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error(`Failed to load: ${src}`));
        };

        img.src = src;
      });
    },

    // ==========================================
    // OBJECT REMOVAL (canvas_item_remover_render)
    // ==========================================
    onObjectSelectionChanged(selectionData) {
      this.selected_objects_binary_masks = selectionData.selectedObjects;

      if (selectionData.selectedObjects.length > 0) {
        this.$message?.success(
          `Selected ${selectionData.selectedObjects.length} objects`,
          2,
        );
      }
    },

    async onObjectsSelectedForRemoval(removalData) {
      console.log("🗑️ Removing objects:", removalData);

      try {
        this.canvasLoading = true;

        const result = await this.removeObjectsFromRoom(removalData);

        if (result.error) {
          this.creditErrorMessage = result.msg;
          this.showCreditModal = true;
          this.buid = result.buid;
          return;
        }

        if (!result.error) {
          this.binaryMasks_objects_detected =
            result.objects_detected_masks || {};
          this.base_image_url =
            this.$store.state.root_media_api + result.final_output;

          this.forceCanvasUpdate();
          this.$message?.success(
            `Removed ${removalData.selectedObjects.length} objects!`,
            3,
          );

          if (Object.keys(this.binaryMasks_objects_detected).length > 0) {
            await this.refreshObjectMaskCache();
          }
        } else {
          throw new Error(result.message || "Failed to remove objects");
        }
      } catch (error) {
        console.error("❌ Object removal failed:", error);
        this.$message?.error(`Failed: ${error.message}`, 4);
        this.showError("Object Removal Failed", error.message);
      } finally {
        this.canvasLoading = false;
      }
    },

    async removeObjectsFromRoom(removalData) {
      const roomId = this.$route.params.id;
      const url = `${this.$store.state.root_api}engine/room-remove-object/`;

      const requestData = {
        room_id: roomId,
        binary_mask_key: removalData.selectedObjects,
        object_masks: removalData.objectMasks,
        canvas_dimensions: removalData.canvasDimensions,
      };

      return await this.makeApiRequest(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestData),
        },
        "removeObjects",
      );
    },

    async RoomRemovePerson(removalData) {
      console.log("🗑️ Removing objects:", removalData);

      try {
        this.canvasLoading = true;

        const result = await this.removePersonsFromRoom(removalData);

        if (result.error) {
          this.creditErrorMessage = result.msg;
          this.showCreditModal = true;
          return;
        }

        if (!result.error) {
          this.binaryMasks_objects_detected =
            result.objects_detected_masks || {};
          this.base_image_url =
            this.$store.state.root_media_api + result.final_output;

          this.forceCanvasUpdate();
          this.$message?.success(`Removed persons from room!`, 3);

          if (Object.keys(this.binaryMasks_objects_detected).length > 0) {
            await this.refreshObjectMaskCache();
          }
          this.LockCanvasOperation = false;
        } else {
          throw new Error(result.message || "Failed to remove objects");
        }
      } catch (error) {
        console.error("❌ Object removal failed:", error);
        this.$message?.error(`Failed: ${error.message}`, 4);
        this.showError("Object Removal Failed", error.message);
      } finally {
        this.canvasLoading = false;
      }
    },

    async removePersonsFromRoom(removalData) {
      const roomId = this.$route.params.id;
      const url = `${this.$store.state.root_api}engine/room-remove-person/${roomId}`;

      // const requestData = {
      //   room_id: roomId,
      //   binary_mask_key: removalData.selectedObjects,
      //   object_masks: removalData.objectMasks,
      //   canvas_dimensions: removalData.canvasDimensions
      // };

      return await this.makeApiRequest(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          // body: JSON.stringify(requestData)
        },
        "removePersons",
      );
    },

    async makeRoomEmpty() {
      this.canvasLoading = true;

      try {
        const url = `${this.$store.state.root_api}engine/make-room-empty/`;
        const requestBody = { room_id: this.$route.params.id };

        const responseData = await this.makeApiRequest(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestBody),
        });
        if (responseData.error) {
          this.creditErrorMessage = responseData.msg;
          this.buid = responseData.buid;

          this.throw_Insufficient_credits(this.creditErrorMessage);
        }

        if (responseData?.renderer_id) {
          this.startPolling(responseData.renderer_id);
          // console.log("IIIIIIIIIIIIIMMMMMMMMMMMMM",finalImage);
          //    this.base_image_url =
          //     this.$store.state.root_media_api +
          //     finalImage +
          //     '?t=' +
          //     Date.now()

          // this.forceCanvasUpdate()

          // this.$message.success('Room emptied successfully!')
          // this.base_image_url = this.$store.state.root_media_api + responseData.final_output;
          // await this.fetchBinaryWallMasks();
          // this.forceCanvasUpdate();
          // this.$message.success('Room emptied successfully!');
        }
      } catch (error) {
        console.error("❌ Failed to empty room:", error);
        this.canvasLoading = true;
      }
    },

    async resetChangesinBaseImage() {
      this.canvasLoading = true;

      try {
        const url = `${this.$store.state.root_api}engine/reset-room/`;
        const requestBody = { room_id: this.$route.params.id };

        const responseData = await this.makeApiRequest(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (responseData?.final_output) {
          this.base_image_url =
            this.$store.state.root_media_api + responseData.final_output;
          await this.fetchBinaryWallMasks();
          this.forceCanvasUpdate();
          this.$message.success("Room reset successfully!");
        }
      } catch (error) {
        console.error("❌ Reset failed:", error);
      } finally {
        this.canvasLoading = false;
      }
    },

    async refreshObjectMaskCache() {
      console.log("🔄 Refreshing cache...");

      try {
        this.clearAllCaches();

        if (Object.keys(this.binaryMasks_objects_detected).length > 0) {
          await this.initializeObjectMaskCache();
        }
      } catch (error) {
        console.error("Cache refresh failed:", error);
      }
    },

    // ==========================================
    // Start Polling
    // ==========================================

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
              this.base_image_url =
                this.$store.state.root_media_api +
                data.finalised_result_wall_processed_image +
                "?t=" +
                Date.now();

              this.forceCanvasUpdate();
              return;
            }

            if (data.status === "Failed") {
              this.canvasLoading = false;
              //  hadller model failed Rendering
              try{
                this.unselect_currrent_selected_object()
              }catch{
                console.log("no 3d item found");
              }
              this.throw_failed_rendering(
                data.failure_reason_if_rendering_failed,
              );
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

    startPollingResetWallBinaryMask(jobId) {
      if (!jobId) return Promise.reject("Invalid job id");

      this.stopPolling();
      this.loading = true;
      this.jobId = jobId;

      return new Promise((resolve, reject) => {
        const poll = async () => {
          try {
            const res = await fetch(
              `${this.$store.state.root_api}renderer/rescale-room-layout/${jobId}/`,
            );

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            if (data.status === "Completed") {
              this.canvasLoading = false;
              //this.stopPolling();
              //resolve(data.finalised_result_wall_processed_image);
              //this.base_image_url =
              //this.$store.state.root_media_api +
              //data.finalised_result_wall_processed_image +
              //"?t=" +
              //Date.now();
              // this.fetchBinaryWallMasks();

              window.location.reload();
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

    // ==========================================
    // WALL & FLOOR TEXTURES
    // ==========================================
    selected_wall_masks(masks) {
      this.selected_binarymasks_walls = masks;
    },

    async wallTextureSelected(texture_id) {
      if (this.selected_binarymasks_walls.length === 0) {
        this.$message.warning("Please select at least one wall");
        return;
      }

      this.canvasLoading = true;

      try {
        const url = `${this.$store.state.root_api}engine/room-wall-apply-mask-texture/`;
        const requestBody = {
          texture_id: texture_id,
          selectedMasks: this.selected_binarymasks_walls,
          room_id: this.$route.params.id,
          binaryMask_List_media: this.binaryMask_List_media,
        };

        const responseData = await this.makeApiRequest(
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(requestBody),
          },
          "applyWallTexture",
        );

        if (responseData.error) {
          this.creditErrorMessage = responseData.msg;
          this.showCreditModal = true;
          this.buid = responseData.buid;

          return;
        }

        if (responseData.renderer_id) {
          // ⏳ WAIT until polling completes
          await this.startPolling(responseData.renderer_id);

          // ✅ ONLY NOW update canvas
          // this.base_image_url =
          //   this.$store.state.root_media_api +
          //   finalImage +
          //   '?t=' +
          //   Date.now()

          // this.forceCanvasUpdate()
          // this.$message.success('Wall texture applied!')
        }
      } catch (error) {
        console.error("❌ Wall texture failed:", error);
        // this.showError("Failed to Apply Wall Texture", error.message);
      } finally {
        this.canvasLoading = false;
      }
    },
    goToPurchaseCredits() {
      this.showCreditModal = false;
      this.$router.push("/pricing"); // or your actual route
    },
    async floorTextureSelected(texture_id) {
      this.canvasLoading = true;

      try {
        const url = `${this.$store.state.root_api}engine/room-floor-changer/`;
        const requestBody = {
          texture_id: texture_id,
          room_id: this.$route.params.id,
        };

        const responseData = await this.makeApiRequest(
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(requestBody),
          },
          "applyFloorTexture",
        );

        if (responseData.error) {
          this.creditErrorMessage = responseData.msg;
          this.showCreditModal = true;
          this.buid = responseData.buid;

          return;
        }

        // if (responseData?.final_output) {
        //   this.base_image_url = this.$store.state.root_media_api + responseData.final_output + '?t=' + Date.now();
        //   this.forceCanvasUpdate();
        //   this.$message.success('Floor texture applied!');
        // }

        if (responseData.renderer_id) {
          // ⏳ WAIT until polling completes
          await this.startPolling(responseData.renderer_id);

          // ✅ ONLY NOW update canvas
          // this.base_image_url =
          //   this.$store.state.root_media_api +
          //   finalImage +
          //   '?t=' +
          //   Date.now()

          // this.forceCanvasUpdate()
          // this.$message.success('Floor texture applied!')
        }
      } catch (error) {
        console.error("❌ Floor texture failed:", error);
        // this.showError("Failed to Apply Floor Texture", error.message);
      } finally {
        this.canvasLoading = false;
      }
    },

    // ==========================================
    // UI METHODS
    // ==========================================
    changeCurrentTab(tab) {
      this.current_tab = tab;
      this.generated3dModel_url = "";
      this.processing_generate_is_Loading = false;
      this.model_instance_id = "";
    },

    selectActiveTab(tab) {
      // Always switch to the tab first (allow page to show)
      this.active_tab_image = tab;
      this.select_replace = "All";

      // Then check access and show modal if needed
      // if (tab === "home_design") {
      //   if (!this.checkHomeDesignAccess()) {
      //     this.showPlanUpgradeModal = true;
      //   }
      // }
    },

    handlePlanUpgradeModalClose(visible) {
      this.showPlanUpgradeModal = visible;

      // DON'T redirect or change tab when modal closes
      // User can stay on home_design page regardless
    },

    selectCategory(category) {
      this.select_replace = category;
      this.canvasLoading=false
      
      // this.item_replacement_renderer_3d_model_url = "";
      this.selected_model_width = 0.0;
      this.selected_model_height = 0.0;
      this.selected_model_depth = 0.0;

      if (category === "All") {
        this.showSelectionButtons = false;
        this.selectedMasks = [];

        if (this.objectMaskCacheReady && this.cachedObjectImages.size > 0) {
          this.switchToFurnitureModeWithCache();
        } else if (this.preloadingStarted && this.cacheInitializationPromise) {
          this.showFurnitureLoadingState();
          this.waitForCacheAndSwitch();
        } else {
          this.showFurnitureLoadingState();
          this.initializeObjectMaskCache().then(() => {
            if (this.select_replace === "All") {
              this.switchToFurnitureModeWithCache();
            }
          });
        }

        const query = { ...this.$route.query };
        delete query.product_id; // ✅ remove it
        delete query.product_type; // ✅ remove it
        delete query.selected_light_type; // ✅ remove it
        this.$router.replace({
          query: {
            ...query,
            window_name: "all",
          },
        });
      } else if (category === "Wall") {
        this.showSelectionButtons = true;
        this.selected_objects_binary_masks = [];
        
        const query = { ...this.$route.query };
        delete query.product_id; // ✅ remove it
        delete query.product_type; // ✅ remove it
        delete query.selected_light_type; // ✅ remove it

        this.$router.replace({
          query: {
            ...query,
            window_name: "wall",
          },
        });
      } else if (category === "Floor") {
        this.showSelectionButtons = false;
        this.selectedMasks = [];
        this.selected_objects_binary_masks = [];

        const query = { ...this.$route.query };
        delete query.product_id; // ✅ remove it
        delete query.product_type; // ✅ remove it
        delete query.selected_light_type; // ✅ remove it

        this.$router.replace({
          query: {
            ...query,
            window_name: "floor",
          },
        });
      } else if (category === "Lights") {
        this.showSelectionButtons = false;
        this.selectedMasks = [];
        this.selected_objects_binary_masks = [];

        const query = { ...this.$route.query };
        delete query.product_id; // ✅ remove it
        delete query.product_type; // ✅ remove it
        delete query.selected_light_type; // ✅ remove it

        this.$router.replace({
          query: {
            ...query,
            window_name: "light",
          },
        });
      } else if (category === "Furniture") {
        const query = { ...this.$route.query };
        delete query.product_id; // ✅ remove it
        delete query.product_type; // ✅ remove it
        delete query.selected_light_type; // ✅ remove it

        this.$router.replace({
          query: {
            ...query,
            window_name: "furniture",
          },
        });
      }

      this.forceCanvasUpdate();
    },

    switchToFurnitureModeWithCache() {
      this.$nextTick(() => {
        if (this.cachedObjectImages && this.cachedObjectImages.size > 0) {
          this.$message?.destroy();
          this.$message?.success(
            `Furniture mode ready! (${this.cachedObjectImages.size} items)`,
            2,
          );
        } else if (
          Object.keys(this.binaryMasks_objects_detected).length === 0
        ) {
          this.$message?.info("No furniture objects detected", 2);
        }

        this.forceCanvasUpdate();
      });
    },

    showFurnitureLoadingState() {
      this.$message?.loading("Loading furniture detection...", 0);
    },

    async waitForCacheAndSwitch() {
      try {
        await this.cacheInitializationPromise;
        if (this.select_replace === "All") {
          this.$message?.destroy();
          this.switchToFurnitureModeWithCache();
        }
      } catch (error) {
        this.$message?.destroy();
        this.$message?.error("Failed to load furniture detection", 3);
      }
    },

    forceCanvasUpdate() {
      this.canvasKey += 1;
      this.maskUpdateTrigger += 1;

      this.$nextTick(() => {
        this.$emit("masks-updated", {
          binaryMasks: this.binaryMaskList,
          selectedMasks: this.selectedMasks,
          timestamp: Date.now(),
        });
      });
    },

    onProcessingProgress(progress) {
      this.processingCurrent = progress.current;
      this.processingTotal = progress.total;
      this.processingProgress =
        this.processingTotal > 0
          ? Math.round((this.processingCurrent / this.processingTotal) * 100)
          : 0;
    },

    onProcessingComplete() {
      this.processingObjects = false;
      this.processingCurrent = 0;
      this.processingTotal = 0;
      this.processingProgress = 0;
      this.$message?.success("Processing completed!", 2);
    },

    // ==========================================
    // DRAWER MODALS
    // ==========================================

    showSwitchBrandPanel() {
      this.openSeeAll_brands_panel = true;
      this.openSeeAll_Walls = false;
      this.openSeeAll_Floor = false;
      // this.closeShareMenu = false;
      this.openSeeAll_products = false;
      this.openSeeAll_ChangeRoom = false;
      this.openSeeAll_furnitures = false;
      this.openSeeAll_Lights = false;
      // this.fetchData('all', 'seeAll_products');
      // fetch_all_brands_list
    },
    SeeAllProducts(e) {
      this.openSeeAll_products = true;
      this.fetchData("all", "seeAll_products");
    },

    furnituresSeeAll(e) {
      this.openSeeAll_furnitures = true;
      this.fetchData("furniture_products", "seeAll_furnitures");
    },

    wallsSeeAll() {
      this.openSeeAll_Walls = true;
      this.fetchData("walls", "seeAll_Walls");
    },

    floorSeeAll() {
      this.openSeeAll_Floor = true;
      this.fetchData("floors", "seeAll_Floor");
    },

    lightsSeeAll() {
      this.openSeeAll_Lights = true;
      this.fetchData("lights", "seeAll_Lights");
    },
    async fetchData(product_type, dataKey) {
      const brand = this.$route.query.brand;

      // Endpoint mapping for different product types
      const endpointMap = {
        floors: {
          branded: `room/api/load-brand-products/floors/${brand}`,
          all: "room/api/floors/",
        },
        walls: {
          branded: `room/api/load-brand-products/walls/${brand}`,
          all: "room/api/walls/",
        },
        furniture_products: {
          branded: `product/api/load-brand-products/3d-products/${brand}`,
          all: "product/api/3d-products/",
        },
        lights: {
          branded: `product/api/load-brand-products/lights/${brand}`,
          all: "product/api/lights/",
        },
      };

      // If product_type is 'all', fetch all product types
      if (product_type === "all") {
        const endpoints = [
          { key: "floors", dataKey: "seeAll_Floor" },
          { key: "walls", dataKey: "seeAll_Walls" },
          { key: "furniture_products", dataKey: "seeAll_furnitures" },
          { key: "lights", dataKey: "seeAll_Lights" },
        ];

        const requests = endpoints.map(({ key, dataKey }) =>
          this.fetchSingleProductType(key, dataKey, brand, endpointMap),
        );

        await Promise.all(requests);
      } else {
        // Fetch only the specific product type
        await this.fetchSingleProductType(
          product_type,
          dataKey,
          brand,
          endpointMap,
        );
      }
    },

    async fetchSingleProductType(productType, dataKey, brand, endpointMap) {
      try {
        // Determine which URL to use (branded or all)
        const urlKey = brand ? "branded" : "all";
        const endpoint = endpointMap[productType]?.[urlKey];

        if (!endpoint) {
          console.warn(`Unknown product type: ${productType}`);
          return;
        }

        // Build the full URL
        const url = `${this.$store.state.root_api}${endpoint}`;

        console.log(`📡 Fetching ${productType}:`, url);

        // Make the API request
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Handle different response formats
        if (data?.data && Array.isArray(data.data)) {
          this[dataKey] = data.data;
          console.log(`✅ Loaded ${dataKey}:`, data.data.length, "products");
        } else if (Array.isArray(data)) {
          // Direct array response
          this[dataKey] = data;
          console.log(`✅ Loaded ${dataKey}:`, data.length, "products");
        } else if (data?.results && Array.isArray(data.results)) {
          // Django REST pagination format
          this[dataKey] = data.results;
          console.log(`✅ Loaded ${dataKey}:`, data.results.length, "products");
        } else {
          console.warn(`Unexpected data format for ${dataKey}:`, data);
          this[dataKey] = [];
        }
      } catch (error) {
        console.error(`❌ Failed to fetch ${dataKey}:`, error);
        this[dataKey] = [];
        this.$message?.error(`Failed to load ${dataKey}`);
      }
    },
    product_selected_all_tabs_section(e) {
      // console.log("product tabs selections")
      // console.log(e)

      if (e.type === "floor") {
        this.selectCategory("Floor");
        this.$nextTick(() => {
          if (
            this.select_replace === "Floor" &&
            (this.$refs.floor_products_list ||
              this.$refs.floor_products_list_mobile)
          ) {
            this.$refs.floor_products_list.selectTexture(e.id);
            this.$refs.floor_products_list_mobile.selectTexture(e.id);

            this.$router.replace({
              query: {
                ...this.$route.query, // keep existing query params
                product_type: "floor",
                product_id: e.id,
                window_name: "floor",
              },
            });
          }
        });
      }

      if (e.type === "product") {
        this.selectCategory("Furniture");
        console.log("------------------------------------------");
        this.selected_model_width = e.width;
        this.selected_model_height = e.height;
        this.selected_model_depth = e.depth;
        this.is_resizable = e.is_resizable;
        this.selected_3d_product_model = e.id;
        this.colors_available_for_3d_model=e.colors_available
        console.log(this.colors_available_for_3d_model);
        // debugger
        console.log(e);
        console.log(
          " >>------------------------------------------> selected_model_width ",
          this.selected_model_width,
        );
        console.log(
          " >>------------------------------------------> selected_model_height ",
          this.selected_model_height,
        );
        console.log(
          " >>------------------------------------------> selected_model_depth ",
          this.selected_model_depth,
        );
        console.log(
          " >>------------------------------------------> selected_3d_product_model ",
          this.selected_3d_product_model,
        );
        console.log(
          " >>------------------------------------------> is_resizable ",
          this.is_resizable,
        );

        this.$nextTick(() => {
          if (
            this.select_replace === "Furniture" &&
            (this.$refs.furniture_products_list ||
              this.$refs.furniture_products_list_mobile)
          ) {
            this.$router.replace({
              query: {
                ...this.$route.query, // keep existing query params
                product_type: "furniture",
                product_id: e.id,
              },
            });
            // this.item_replacement_renderer_3d_model_url = this.$store.state.root_media_api + e.model_url;
            // console.log(this.item_replacement_renderer_3d_model_url)
            this.$refs.furniture_products_list.updateItemRendering(
              e.id,
              e.model_url,
              e.width,
              e.height,
              e.depth,
              e.is_resizable,
              e.colors_available
            );
            this.$refs.furniture_products_list_mobile.updateItemRendering(
              e.id,
              e.model_url,
              e.width,
              e.height,
              e.depth,
              e.is_resizable,
              e.colors_available
            );

            //  const f={
            //   'width':e.width,
            //   'height':e.height,
            //   'depth':e.depth,
            //   'is_resizable':e.is_resizable,
            //   'model_uuid':e.id,
            //   'model_url':e.model_url
            // }
            // this.change3dModel(f)
          }
        });
      }

      if (e.type === "wall") {
        this.selectCategory("Wall");
        this.$nextTick(() => {
          if (
            this.current_tab === "image" &&
            this.active_tab_image === "item_replacement" &&
            this.select_replace === "Wall" &&
            (this.$refs.wall_products_list ||
              this.$refs.wall_products_list_mobile)
          ) {
            // console.log(this.$refs)
            this.$refs.wall_products_list.selectTexture(e.id);
            this.$refs.wall_products_list_mobile.selectTexture(e.id);

            this.$router.replace({
              query: {
                ...this.$route.query, // keep existing query params
                product_type: "wall",
                product_id: e.id,
                window_name: "wall",
              },
            });
          }
        });
      }

      if (e.type === "light") {
        this.selectCategory("Lights");
        this.$nextTick(() => {
          if (
            this.select_replace === "Lights" &&
            (this.$refs.lights_list || this.$refs.lights_list_mobile)
          ) {
            this.$refs.lights_list.updateItemRendering(
              e.id,
              e.light_type,
              e.model_url,
            );
            this.$refs.lights_list_mobile.updateItemRendering(
              e.id,
              e.light_type,
              e.model_url,
            );

            this.$router.replace({
              query: {
                ...this.$route.query, // keep existing query params
                product_type: "light",
                product_id: e.id,
                window_name: "light",
              },
            });
          }
        });
      }
    },

    fetchAllBusinessProducts() {},

    async Change_Room_SeeAll() {
      await Promise.all([
        this.fetchExampleRooms(),
        this.fetchUserHistoryRooms(),
      ]);
      this.openSeeAll_ChangeRoom = true;
    },

    onClose_drawer_modal() {
      this.openSeeAll_brands_panel = false;
      this.openSeeAll_Walls = false;
      this.openSeeAll_Floor = false;
      // this.closeShareMenu = false;
      this.openSeeAll_products = false;
      this.openSeeAll_ChangeRoom = false;
      this.openSeeAll_furnitures = false;
      this.openSeeAll_Lights = false;
    },

    async fetchExampleRooms() {
      try {
        const url = `${this.$store.state.root_api}room/api/example-rooms/`;
        const response = await this.makeApiRequest(
          url,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
          "exampleRooms",
        );

        if (response?.data) {
          this.exampleImages_changeRoom = response.data;
        }
      } catch (error) {
        console.error("Failed to fetch example rooms:", error);
      }
    },

    async fetchUserHistoryRooms(offset = 0) {
      try {
        const limit = 12; // items per page
        const url = `${this.$store.state.root_api}room/api/user-history-rooms/?limit=${limit}&offset=${offset}`;
        const response = await this.makeApiRequest(
          url,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
          "historyRooms",
        );

        if (response?.results?.data) {
          this.your_history_change_room = response.results.data;
          this.history_total_count = response.count; // total records
          this.history_current_offset = offset; // current offset
          this.history_limit = limit;
        }
      } catch (error) {
        console.error("Failed to fetch history rooms:", error);
      }
    },

    goToCatalogue(id) {
      this.openSeeAll_ChangeRoom = false;
      this.$router
        .push({
          path: `/update-catalogue/${id}`,
          query: { t: Date.now() },
        })
        .then(() => {
          this.$router.go(0);
        });
    },

    async startTestRoom(room_id) {
      try {
        const url = `${this.$store.state.root_api}room/api/start-example-room/${room_id}`;
        const response = await this.makeApiRequest(
          url,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          },
          "startTestRoom",
        );

        if (response?.data) {
          this.$router
            .push({
              name: "update_catelogue",
              params: { id: response.data.id },
              query: { t: Date.now() },
            })
            .then(() => {
              this.$router.go(0);
            });
        }
      } catch (error) {
        console.error("Failed to start test room:", error);
      }
    },

    // ==========================================
    // 3D MODEL METHODS
    // ==========================================
    async new3DModelGenerated(e) {
      this.generated3dModel_url =
        this.$store.state.root_media_api + e.media_url;
      this.model_instance_id = e.new3d_model_instance;
      await this.fetch3d_models_generated_by_room();
    },

    async get_3d_rendered_model_details(generated_3d_model_id) {
      this.loading_generated_models_history = true;

      try {
        const roomId = this.$route.params.id;
        const url = `${this.$store.state.root_api}engine/generated-3d-models-history/${roomId}`;
        const payload = { model_3d_id: generated_3d_model_id };

        const responseData = await this.makeApiRequest(
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          },
          "get_3d_model_details",
        );

        if (responseData?.new_model) {
          this.generated3dModel_url =
            this.$store.state.root_media_api +
            responseData.new_model.model_file_url;
          this.model_instance_id = responseData.new_model.id;
          this.processing_generate_is_Loading = false;
          this.list_history_generated_3d_models = responseData.models || [];
        }
      } catch (error) {
        console.error("Failed to fetch 3D model details:", error);
      } finally {
        this.loading_generated_models_history = false;
      }
    },

    processinggenerate_loading() {
      this.processing_generate_is_Loading = true;
    },

    change3dModel(e) {
      console.log("🔧 Changing 3D model with dimensions:", e);
      const width = parseFloat(e.width);
      const height = parseFloat(e.height);
      const depth = parseFloat(e.depth);
      if (width !== 0.0 || height !== 0.0 || depth !== 0.0) {
        // ✅ Parse dimensions safely

        // ✅ Safety check for unrealistic dimensions
        if (width > 50 || height > 50 || depth > 50) {
          console.warn("⚠️ Unrealistic dimensions detected:", {
            width,
            height,
            depth,
          });
          this.$message.warning("This product has unusual dimensions");
        }

        console.log("📏 Setting dimensions ------ > :", {
          width,
          height,
          depth,
        });
        console.log("📏 Setting dimensions:", { width, height, depth });

        // ✅ Set dimensions
        this.selected_model_width = width;
        this.selected_model_height = height;
        this.selected_model_depth = depth;

        this.main_object_dims={
          width: this.selected_model_width,
          height: this.selected_model_height,
          depth: this.selected_model_depth,
        }

        this.is_resizable = e.is_resizable;
        this.selected_3d_product_model = e.model_uuid;
        this.primary_model_3d_url = this.$store.state.root_media_api + e.model_url;

        this.colors_available_for_3d_model=e.colors_available

        
        this.$router.replace({
          query: {
            ...this.$route.query, // keep existing query params
            product_type: "furniture",
            product_id: e.model_uuid,
          },
        });

        // ✅ CRITICAL: Clear the model URL first to force unmount
        // if(this.item_replacement_renderer_3d_model_url===""){
        //   this.item_replacement_renderer_3d_model_url = "";
        //     }
        // ✅ Then set the new URL on next tick to force remount
        this.$nextTick(() => {
          console.log("🎨 Loading model URL:", e.model_url);
          if (e.model_url !== "") {
            this.item_replacement_renderer_3d_model_url =
              this.$store.state.root_media_api + e.model_url;
          }
        });
      }
    },

    // execute3DRederer() {
    //   this.$refs.floor_item_3d_renderer.renderItem();
    // },

    // ==========================================================================
    // Furniture Apply 3D Object
    // ==========================================================================
    execute3DRederer() {
      if (this.$refs.floor_item_3d_renderer) {
        // Pass preserved state to child before rendering
        if (this.preserved3DModelTransform) {
          this.$refs.floor_item_3d_renderer.restoreModelTransform(
            this.preserved3DModelTransform,
          );
        }
        this.$refs.floor_item_3d_renderer.renderItem();
      }
    },
    executeswitchFurniture() {
      console.log("execute switch furniture");
      this.$refs.floor_item_3d_renderer.switchFurniture();
    },
    // ==========================================================================

    // ==========================================================================
    // Furniture Apply 3D Object Mobile
    // ==========================================================================
    execute3DRederer_mobile() {
      if (this.$refs.floor_item_3d_renderer_mobile) {
        // Pass preserved state to child before rendering
        if (this.preserved3DModelTransform) {
          this.$refs.floor_item_3d_renderer_mobile.restoreModelTransform(
            this.preserved3DModelTransform,
          );
        }
        this.$refs.floor_item_3d_renderer_mobile.renderItem();
      }
    },
    executeswitchFurniture_mobile() {
      console.log("execute switch furniture");
      this.$refs.floor_item_3d_renderer_mobile.switchFurniture();
    },
    // ==========================================================================

    smoothMobileScrolltoTop() {
      if (window.innerWidth < 500) {
        const smoothScrollToTop = (duration = 800) => {
          const start = window.scrollY;
          const startTime = performance.now();

          const easeInOutCubic = (t) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, start * (1 - ease));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        };

        smoothScrollToTop(900); // 900ms = very smooth
      }
    },
    // ==========================================
    // LIGHTS METHODS
    // ==========================================
    lightSelected(e) {
      this.smoothMobileScrolltoTop();

      this.selectedlightuuid = e.uuid;
      this.selected_light_type = e.type;
      this.model_3d_url = this.$store.state.root_media_api + e.model_3d_url;
      this.selected_3dlight_model_diamensions = e.model_diamensions;

      this.$router.replace({
        query: {
          ...this.$route.query, // keep existing query params
          product_type: "light",
          selected_light_type: e.type,
          product_id: e.uuid,
        },
      });
    },

    Apply_ceiling_light() {
      if (
        this.select_replace === "Lights" &&
        this.selected_light_type === "sunk"
      ) {
        this.$refs.canvas_sunk_magnetic_lights_render.saveRoom();
      }
      if (
        this.select_replace === "Lights" &&
        this.selected_light_type === "hanging"
      ) {
        this.$refs.canvas_ceiling_3d_object_light_renderer.downloadCurrentSceneImage();
      }
    },

    Apply_ceiling_light_mobile() {
      if (
        this.select_replace === "Lights" &&
        this.selected_light_type === "sunk"
      ) {
        this.$refs.canvas_sunk_magnetic_lights_render_mobile.saveRoom();
      }
      if (
        this.select_replace === "Lights" &&
        this.selected_light_type === "hanging"
      ) {
        this.$refs.canvas_ceiling_3d_object_light_renderer_mobile.downloadCurrentSceneImage();
      }
    },

    async magneticLightsMearjed(e) {
      // console.log(e)
      this.base_image_url =
        this.$store.state.root_media_api + e.image_url + "?p=" + Date.now();
      // debugger
      this.forceCanvasUpdate();
    },

    // ==========================================
    // HOME DESIGN METHODS
    // ==========================================
    home_design_history_clicked(images, id, input_image) {
      this.home_design_images = {
        error: false,
        home_design_id: id,
        prompt_id: null,
        generated_count: images.length,
        images: images,
        image_paths: images,
        msg: "Home design variations changed successfully",
      };
      this.tempBaseImageUrl = this.$store.state.root_media_api + input_image;
    },

    updateBaseImageUrlForHomeDesign() {
      this.sideFinalImage = this.tempBaseImageUrl + "?t=" + Date.now();
    },

    newhome_designes_generated(e) {
      this.home_design_images = e;
      this.$refs.home_design_history.fetchGenerateHistory();
    },

    // ==========================================
    // PRODUCT MOCKUP METHODS
    // ==========================================
    product_mockup_history_clicked(images) {
      this.selected_product_mockups_group = images;
      this.product_mockup_images = {
        error: false,
        home_design_id: null,
        prompt_id: null,
        generated_count: images.images.length,
        images: images.images,
        image_paths: images.images,
        msg: "Product mockup changed successfully",
      };
    },

    new_product_mockup_generated(e) {
      this.product_mockup_images = e;
      this.$refs.product_mockup_history.fetchGenerateHistory();
    },

    // ==========================================
    // PRODUCT METHODS
    // ==========================================
    add_new_product() {
      this.showAddProduct = true;
    },

    onProductCreated() {
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);

      if (user.is_business) {
        this.$router.push("/business-dashboard/my-products");
      } else if (user.is_professional) {
        this.$router.push("/professional-dashboard/my-products");
      }
    },

    async updateBaskeImageURL_CANVAS(renderer_id) {
      // ⏳ WAIT until polling completes
      await this.startPolling(renderer_id);
      this.unselect_currrent_selected_object()
      // ✅ ONLY NOW update canvas
      // this.base_image_url =
      //   this.$store.state.root_media_api +
      //   finalImage +
      //   '?t=' +
      //   Date.now()
      //   console.log("===============> "+this.base_image_url)

      // this.forceCanvasUpdate()

      //  this.canvasLoading = false;

      // this.base_image_url = this.$store.state.root_media_api + imageUrl;
      // this.forceCanvasUpdate();
    },

    // ==========================================
    // UTILITY METHODS
    // ==========================================
    createChunks(array, chunkSize) {
      const chunks = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    },

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    clearAllCaches() {
      if (this.objectMaskCache) {
        this.objectMaskCache.clear();
      }
      if (this.cachedObjectImages) {
        this.cachedObjectImages.clear();
      }
      this.objectMaskCacheReady = false;
      this.preloadingStarted = false;
      this.cacheInitializationPromise = null;
    },

    async downloadImage() {
      const response = await fetch(this.base_image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "room-design.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    },

    ApplyChanges() {
      // console.log("======================================================")
      // console.log(this.$route.query.client_request ==='true')

      // this.$router.push('/update-catalogue/render-results/' + this.$route.params.id+'?brand='+this.$route.query.brand+((this.$route.query.client_request ==='true')?'&client_request=true':"") );
      this.$router.push({
        name: "render_catelogue", // Use route name, not path
        params: {
          id: this.$route.params.id,
        },
        query: {
          brand: this.$route.query.brand,
          // Only add client_request if it's 'true'
          ...(this.$route.query.client_request === "true" && {
            client_request: "true",
          }),
          ...(this.$route.query.business_staff === "true" && {
            business_staff: "true",
          }),
        },
      });
    },

    // ==========================================
    // ERROR HANDLING
    // ==========================================
    showError(title, description, retryFunction = null) {
      this.modalError = {
        title,
        description,
        retry: retryFunction,
      };
      this.showErrorModal = true;
    },
  },

  components: {
    SwapOutlined,
    BulbOutlined,
    PlanUpgradeModal,
    CloudUploadOutlined,
    UserDeleteOutlined,
    MessageOutlined,

    // switch Business
    switch_business,

    // canvas Renderer
    canvas_floor_render,
    canvas_item_remover_render, // All
    canvas_lights_render, // 3d Light
    canvas_unsunk_lights_render, // unsunk Light
    canvas_walls_render, // walls
    items_replacement_renderer, // all

    // List Views
    fernitures,
    walls,
    floor,
    lights,
    ai_catalog_item_replacement_3d_products,
    //  Bottom Drawer Menues
    wall_textures_bottom_drawer_menu,
    floor_textures_bottom_drawer_menu,
    furnitures_bottom_drawer_menu,
    light_items_bottom_drawer_menu,
    fetch_all_drawer_component,

    ceiling_3d_object_renderer,

    // Home Design
    side_panel_home_design,
    main_panel_home_design,
    history_panel_home_design,

    // Edit Image Create Mockup
    side_panel_edit_image,
    main_panel_edit_image,
    history_panel_edit_image,

    // 3d Tab
    sidepanel_3d_tab,
    object_viewer_3d_tab,
    add_new_furniture,
    models_3d_generate_history,
  },
};
</script>

<style scoped>
/* .canvas-painting-sec{
  width: 100%;
  height:70vh;
} */

/* Example Images */
.history-label {
  font-size: 18px;
  margin-bottom: 20px;
  text-align: start;
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

.example-skeleton {
  width: 100%;
  height: 240px; /* match .example-image height */
  border-radius: 8px;
  background: linear-gradient(110deg, #e5e7eb 8%, #f9fafb 18%, #e5e7eb 33%);
  background-size: 200% 100%;
  animation: example-shimmer 1.6s infinite linear;
}

@keyframes example-shimmer {
  to {
    background-position-x: -200%;
  }
}

/* keep your existing image styling */
.example-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
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

.example-image:hover {
  transform: scale(1.05);
}

.main_panel {
  height: 90vh;
  background: #f5f5f5;
}

.full-height {
  height: 100%;
}

/* Left Sidebar Styles */
.left-sidebar {
  background: #f8f9fa;
  border-right: 1px solid #e5e5e5;
  padding: 20px 8px;
}

.tool-icons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 100%;
  text-align: center;
  color: #666;
}

.tool-item:hover {
  background: #f0f0f0;
}

.tool-item.active {
  /* background: #e6f7ff; */
  color: #3b63fb;
}

.tool-item span {
  font-size: 10px;
  line-height: 10px;
  font-weight: 500;
}

/* Middle Panel Styles */
/* .middle-panel {
  background: #fff;
  border-right: 1px solid #e5e5e5;
  overflow-y: auto;
} */

/* Make sure the middle panel uses full height */
.middle-panel {
  background: #fff;
  border-right: 1px solid #e5e5e5;
  /*overflow: auto; /* Change from overflow-y: auto to hidden */
  height: 100%;
}

.controls-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Action Buttons */
.action-buttons {
  /* padding: 16px; */
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  width: 100%;
  /* flex-direction: column; */
  /* gap: 8px; */
}

.action-btn {
  height: 44px;
  width: 100%;
  /* border-radius: 8px; */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 16px;
  font-weight: 500;
  border: 1px solid #d9d9d9;
}

.action-btn.active {
  background: #3b63fb;
  border-color: #3b63fb;
  color: white;
}

/* Category Section */
.category-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.category-tabs {
  display: flex;
  /* justify-content: space-around; */
  flex-wrap: wrap;
  padding: 5px 5px 0;
  gap: 3px;

  /* border-bottom: 1px solid #f0f0f0; */
}

.category-tab {
  padding: 7px;
  font-size: 11px;
  font-weight: 500;
  gap: 2px;

  display: flex;
  color: #666;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-radius: 6px 6px 6px 6px;
  transition: all 0.2s ease;
}

.category-tab.active {
  color: #ffffff;
  background: #3b63fb;
  /* border-bottom: 2px solid #3B63FB; */
}

.category-tab.deactive {
  color: #6b7280; /* soft grey text */
  background: #f3f4f6; /* light neutral background */
  border: 1px solid #d1d5db;
  cursor: not-allowed;
  opacity: 0.75;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
}

/* AI Catalog Section */
.ai-catalog-section {
  padding: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ai-catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.ai-catalog-header span {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.see-all-link {
  font-size: 14px;
  color: #3b63fb;
  text-decoration: none;
}

.see-all-link:hover {
  color: #40a9ff;
}

/* Search Section */
.search-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  border-radius: 8px;
}

.filter-icons {
  display: flex;
  gap: 8px;
  cursor: pointer;
}

.filter-icons svg:hover {
  opacity: 0.7;
}

/* Product List */
.product-list {
  /* flex: 1; */
  height: 50vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.product-item:hover {
  border-color: #3b63fb;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.product-image {
  position: relative;
  width: 60px;
  height: 60px;
  margin-right: 12px;
}

.product-image img {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  object-fit: cover;
  background: #f5f5f5;
}

.product-tag {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #3b63fb;
  color: white;
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 10px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.product-subtitle {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}

.product-details {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.product-color {
  font-size: 12px;
  color: #666;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #e5e5e5;
}

.product-price {
  font-size: 13px;
  color: #3b63fb;
  font-weight: 500;
}

.product-actions {
  padding: 4px;
}

.heart-icon {
  cursor: pointer;
  transition: all 0.2s ease;
}

.heart-icon:hover {
  stroke: #ff4d4f;
}

/* Apply Section */
.apply-section {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.apply-button {
  height: 44px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
}

.canvas-panel {
  position: relative;
  width: 100%;
  height: 100%; /* ✅ Ensure full height */
  display: flex;
  flex-direction: column;
}

/* Tab Content Placeholder */
.tab-content-placeholder {
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.tab-content-placeholder h3 {
  margin-bottom: 12px;
  color: #666;
}

/* Ant Design Overrides */
:deep(.ant-input) {
  border-radius: 8px;
  border: 1px solid #d9d9d9;
}

:deep(.ant-input:focus) {
  border-color: #3b63fb;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

:deep(.ant-btn-primary) {
  background: #3b63fb;
  border-color: #3b63fb;
}

:deep(.ant-btn-primary:hover) {
  background: #40a9ff;
  border-color: #40a9ff;
}

.right-socialShare-contrl-icon {
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.3s ease;
  opacity: 1;
}
.right-socialShare-contrl-icon.show {
  transform: scale(1);
}
.socialShares-sec {
  transform-origin: left 20px;
  transition: transform 0.4s ease;
}
.socialShares-sec.collapsed {
  transform: scale(0);
  height: 20px;
}

@media (max-width: 500px) {
  .light-height-adjuster {
    height: 80vh;
  }
  .light-3d-height-adjuster {
    height: 100%;
  }
  .mobile-floor-height-adjuster {
    height: 100%;
  }

  .mobile-wall-height-adjuster {
    height: 100%;
  }
  .mobile-unselected-light-height-adjuster {
    height: 100%;
  }
  .mobile-furniture-nonselected-height-adjuster {
    height: 100%;
  }
  .mobile-furniture-selected-height-adjuster {
    height: 100%;
  }
}
.no-select{
  user-select:none;
  -webkit-user-select:none;
  -ms-user-select:none;
  pointer-events:auto;
}

</style>
