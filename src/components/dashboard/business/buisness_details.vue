<template>
<a-modal
  v-model:visible="verifyModalVisible"
  title="Verify Your Email"
  :footer="null"
  width="400px"
  @cancel="closeVerifyModal"
>
  <!-- Step 1: Confirmation -->
  <div v-if="verificationStep === 1">
    <p style="text-align: center; font-size: 14px; color: #666; margin-bottom: 10px;">
      A verification code will be sent to
    </p>
    <p style="text-align: center; font-weight: 600; font-size: 14px; color: #000; margin-bottom: 30px;">
      {{ businessInfo.email }}
    </p>

    <div style="display: flex; gap: 12px;">
      <a-button @click="closeVerifyModal" style="flex: 1;">
        Cancel
      </a-button>
      <a-button 
        type="primary" 
        @click="startVerification"
        :loading="verificationLoading"
        style="flex: 1;"
      >
        Send Code
      </a-button>
    </div>
  </div>

  <!-- Step 2: OTP Verification -->
  <div v-else-if="verificationStep === 2">
    <p style="text-align: center; font-size: 14px; color: #666; margin-bottom: 20px;">
      We sent a 6-digit code to {{ businessInfo.email }}
    </p>

    <a-input
      v-model:value="otpCode"
      placeholder="000000"
      maxlength="6"
      size="large"
      @keyup.enter="verifyOTP"
      style="text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace; margin-bottom: 20px;"
    />

    <div style="text-align: center; margin-bottom: 15px;">
      <span style="color: #666; font-size: 13px;">Expires in: </span>
      <span style="color: #ef4444; font-weight: 600; font-size: 14px;">{{ otpTimeRemaining }}s</span>
    </div>

    <a-progress
      :percent="otpProgress"
      :show-info="false"
      style="margin-bottom: 15px;"
    />

    <div style="text-align: center; margin-bottom: 20px;">
      <a-button 
        type="link" 
        :disabled="otpTimeRemaining > 0"
        @click="resendOTP"
        style="padding: 0; font-size: 14px;"
      >
        {{ otpTimeRemaining > 0 ? `Resend in ${otpTimeRemaining}s` : 'Resend Code' }}
      </a-button>
    </div>

    <a-alert
      v-if="otpError"
      type="error"
      :message="otpError"
      show-icon
      closable
      style="margin-bottom: 20px;"
      @close="otpError = ''"
    />

    <div style="display: flex; gap: 12px;">
      <a-button @click="goBackToStep1" style="flex: 1;">
        Back
      </a-button>
      <a-button 
        type="primary" 
        @click="verifyOTP"
        :loading="verifyingOTP"
        :disabled="otpCode.length !== 6"
        style="flex: 1;"
      >
        Verify
      </a-button>
    </div>
  </div>

  <!-- Step 3: Verification Complete -->
  <div v-else-if="verificationStep === 3">
    <div style="text-align: center; margin-bottom: 20px;">
      <p style="font-size: 14px; color: #10b981; font-weight: 600;">✓ Verified</p>
    </div>
    <p style="text-align: center; font-size: 14px; color: #666; margin-bottom: 25px;">
      Your email has been successfully verified
    </p>

    <a-button 
      type="primary" 
      @click="closeVerifyModal"
      style="width: 100%;"
    >
      Done
    </a-button>
  </div>
</a-modal>
<div class="business-details-container !py-3 !pr-2 ">
    <a-row class="main-content shadow-sm rounded-xl ">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" class="content-area">
        <div class="content-wrapper">
          <!-- {{ businessInfo.business_picture }} -->

          <!-- Header with Furniture Image -->
          <div class="header-banner" :style="backgroundImage ? 
              `background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${this.$store.state.root_media_api}${businessInfo.business_picture}) center/cover no-repeat` : 
              `background: url(${this.$store.state.root_media_api}${businessInfo.business_picture}) center/cover no-repeat;`">
            
            <!-- Background upload button (only show when editing) -->
            <a-upload
              v-if="isEditMode"
              :show-upload-list="false"
              :before-upload="handleBackgroundBeforeUpload"
              accept="image/*"
              class="background-upload-wrapper"
            >
              <a-button type="primary" class="background-upload-btn">
                <template #icon>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </template>
                Change Background
              </a-button>
            </a-upload>
            
            <div class="profile-section">
              <div class="profile-avatar">
                <img :src="avatarPreview || (this.$store.state.root_media_api + businessInfo.avatar)" alt="Business Avatar" />
                <a-upload
                  v-if="isEditMode"
                  :show-upload-list="false"
                  :before-upload="handleAvatarBeforeUpload"
                  accept="image/*"
                  class="avatar-upload-wrapper"
                >
                  <div class="camera-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path opacity="0.5" d="M9.77778 21H14.2222C17.3433 21 18.9038 21 20.0248 20.2646C20.51 19.9462 20.9267 19.5371 21.251 19.0607C22 17.9601 22 16.4279 22 13.3636C22 10.2994 22 8.76721 21.251 7.6666C20.9267 7.19014 20.51 6.78104 20.0248 6.46268C19.3044 5.99013 18.4027 5.82123 17.022 5.76086C16.3631 5.76086 15.7959 5.27068 15.6667 4.63636C15.4728 3.68489 14.6219 3 13.6337 3H10.3663C9.37805 3 8.52715 3.68489 8.33333 4.63636C8.20412 5.27068 7.63685 5.76086 6.978 5.76086C5.59733 5.82123 4.69555 5.99013 3.97524 6.46268C3.48995 6.78104 3.07328 7.19014 2.74902 7.6666C2 8.76721 2 10.2994 2 13.3636C2 16.4279 2 17.9601 2.74902 19.0607C3.07328 19.5371 3.48995 19.9462 3.97524 20.2646C5.09624 21 6.65675 21 9.77778 21Z" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M14.5197 10.6799L14.2397 10.4C13.0026 9.16288 10.9969 9.16288 9.75984 10.4C8.52276 11.637 8.52276 13.6427 9.75984 14.8798C10.9969 16.1169 13.0026 16.1169 14.2397 14.8798C14.7665 14.353 15.069 13.6868 15.1471 13M14.5197 10.6799L13 11M14.5197 10.6799V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </a-upload>
              </div>
            </div>
          </div>

          <!-- Business card section -->
          <div style="width:100%;max-width:600px;margin:auto;border:1px solid rgba(0,0,0,0.1);padding:20px;border-radius:10px;margin-top:20px">
            <h2>Upload Room Photo</h2>
            <p>Share the link with your customer for generating there room photo</p>

            <label>Copy Link</label>
            <a-input-group compact>
              <a-input :value="full_url()" style="width: calc(100% - 200px);color:blue" />
              <a-button type="primary" @click="copyLink">
                <a-space>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.33203 9.9987H2.66536C2.31174 9.9987 1.9726 9.85822 1.72256 9.60817C1.47251 9.35813 1.33203 9.01899 1.33203 8.66536V2.66536C1.33203 2.31174 1.47251 1.9726 1.72256 1.72256C1.9726 1.47251 2.31174 1.33203 2.66536 1.33203H8.66536C9.01899 1.33203 9.35813 1.47251 9.60817 1.72256C9.85822 1.9726 9.9987 2.31174 9.9987 2.66536V3.33203M7.33203 5.9987H13.332C14.0684 5.9987 14.6654 6.59565 14.6654 7.33203V13.332C14.6654 14.0684 14.0684 14.6654 13.332 14.6654H7.33203C6.59565 14.6654 5.9987 14.0684 5.9987 13.332V7.33203C5.9987 6.59565 6.59565 5.9987 7.33203 5.9987Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Copy
                </a-space>
              </a-button>
            </a-input-group>
            <br>
            <h4>or share via social media</h4>
            
  <a-space>
    <a-button type="text" style="padding:0">
 <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.515686 12.458C0.515117 14.5771 1.05247 16.6462 2.07423 18.4699L0.417969 24.7011L6.6066 23.0291C8.3183 23.9892 10.2361 24.4923 12.185 24.4925H12.1901C18.6238 24.4925 23.861 19.098 23.8637 12.4675C23.865 9.25453 22.6518 6.23328 20.4475 3.96025C18.2437 1.68742 15.3126 0.43506 12.1897 0.433594C5.75523 0.433594 0.518437 5.82778 0.515781 12.458" fill="url(#paint0_linear_7512_27616)"/>
<path d="M0.101512 12.4557C0.100848 14.651 0.657456 16.7941 1.71565 18.6832L0 25.1377L6.41053 23.4058C8.17684 24.3981 10.1655 24.9213 12.1891 24.9221H12.1943C18.8588 24.9221 24.2841 19.3335 24.287 12.4657C24.2881 9.13727 23.0313 6.00741 20.7483 3.65295C18.465 1.29879 15.4292 0.00136859 12.1943 0C5.52871 0 0.104168 5.58775 0.101512 12.4557ZM3.91922 18.3578L3.67986 17.9663C2.67366 16.3178 2.14257 14.4127 2.14333 12.4565C2.14541 6.74801 6.65407 2.10371 12.1981 2.10371C14.883 2.10489 17.4062 3.18333 19.304 5.14002C21.2017 7.09691 22.2459 9.6982 22.2453 12.4649C22.2428 18.1734 17.7341 22.8183 12.1943 22.8183H12.1904C10.3866 22.8173 8.61752 22.3181 7.07472 21.3749L6.70757 21.1505L2.90343 22.1782L3.91922 18.3578Z" fill="url(#paint1_linear_7512_27616)"/>
<path d="M9.17689 7.24832C8.95053 6.72992 8.71231 6.71946 8.49705 6.71037C8.32078 6.70255 8.11927 6.70313 7.91795 6.70313C7.71645 6.70313 7.38905 6.78124 7.11231 7.0926C6.83529 7.40424 6.05469 8.15736 6.05469 9.6891C6.05469 11.2208 7.13745 12.7013 7.28839 12.9092C7.43952 13.1167 9.37868 16.3607 12.4499 17.6086C15.0023 18.6457 15.5217 18.4395 16.0756 18.3874C16.6297 18.3356 17.8634 17.6345 18.1151 16.9075C18.367 16.1806 18.367 15.5575 18.2914 15.4273C18.2159 15.2976 18.0144 15.2197 17.7123 15.064C17.4101 14.9084 15.9245 14.1551 15.6476 14.0512C15.3706 13.9474 15.1691 13.8955 14.9676 14.2073C14.7661 14.5185 14.1875 15.2197 14.0111 15.4273C13.835 15.6354 13.6586 15.6613 13.3565 15.5056C13.0542 15.3494 12.0811 15.021 10.9266 13.9605C10.0284 13.1352 9.42195 12.1161 9.24568 11.8043C9.06941 11.4931 9.2268 11.3244 9.37831 11.1692C9.51407 11.0297 9.68056 10.8057 9.83179 10.6239C9.98244 10.4421 10.0327 10.3124 10.1335 10.1048C10.2343 9.89693 10.1839 9.7151 10.1084 9.55938C10.0327 9.40365 9.44557 7.86389 9.17689 7.24832Z" fill="white"/>
<defs>
<linearGradient id="paint0_linear_7512_27616" x1="1172.71" y1="2427.18" x2="1172.71" y2="0.433594" gradientUnits="userSpaceOnUse">
<stop stop-color="#1FAF38"/>
<stop offset="1" stop-color="#60D669"/>
</linearGradient>
<linearGradient id="paint1_linear_7512_27616" x1="1214.35" y1="2513.77" x2="1214.35" y2="0" gradientUnits="userSpaceOnUse">
<stop stop-color="#F9F9F9"/>
<stop offset="1" stop-color="white"/>
</linearGradient>
</defs>
</svg>
    </a-button>
   <a-button type="text" style="padding:0">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_7512_27620)">
<path d="M23.1179 11.5589C23.1179 5.17515 17.9427 0 11.5589 0C5.17515 0 0 5.17515 0 11.5589C0 17.3283 4.22696 22.1103 9.75285 22.9774V14.9002H6.81797V11.5589H9.75285V9.01236C9.75285 6.1154 11.4786 4.51521 14.1189 4.51521C15.3835 4.51521 16.7063 4.74097 16.7063 4.74097V7.58555H15.2488C13.8128 7.58555 13.365 8.47658 13.365 9.39073V11.5589H16.5708L16.0583 14.9002H13.365V22.9774C18.8909 22.1103 23.1179 17.3284 23.1179 11.5589Z" fill="#1877F2"/>
<path d="M16.0568 14.9006L16.5693 11.5594H13.3635V9.39115C13.3635 8.47691 13.8113 7.58597 15.2472 7.58597H16.7047V4.74139C16.7047 4.74139 15.3819 4.51562 14.1172 4.51562C11.477 4.51562 9.75129 6.11582 9.75129 9.01277V11.5594H6.81641V14.9006H9.75129V22.9779C10.3488 23.0715 10.9526 23.1184 11.5574 23.1183C12.1621 23.1184 12.766 23.0715 13.3635 22.9779V14.9006H16.0568Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_7512_27620">
<rect width="23.1179" height="23.1179" fill="white"/>
</clipPath>
</defs>
</svg>

   </a-button>
<a-button type="text" style="padding:0">
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_7512_27623)">
<path d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z" fill="url(#paint0_radial_7512_27623)"/>
<path d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z" fill="url(#paint1_radial_7512_27623)"/>
<path d="M10.0007 2.1875C7.87898 2.1875 7.61266 2.1968 6.77938 2.23469C5.94766 2.27281 5.37992 2.40445 4.8832 2.59766C4.3693 2.79719 3.93344 3.06414 3.49922 3.49852C3.06461 3.93281 2.79766 4.36867 2.5975 4.88234C2.40375 5.37922 2.27195 5.94719 2.23453 6.77852C2.19727 7.61188 2.1875 7.87828 2.1875 10.0001C2.1875 12.1219 2.19688 12.3873 2.23469 13.2206C2.27297 14.0523 2.40461 14.6201 2.59766 15.1168C2.79734 15.6307 3.0643 16.0666 3.49867 16.5008C3.93281 16.9354 4.36867 17.203 4.88219 17.4025C5.3793 17.5957 5.94711 17.7273 6.77867 17.7655C7.61203 17.8034 7.87813 17.8127 9.99977 17.8127C12.1217 17.8127 12.3872 17.8034 13.2205 17.7655C14.0522 17.7273 14.6205 17.5957 15.1177 17.4025C15.6313 17.203 16.0666 16.9354 16.5006 16.5008C16.9352 16.0666 17.2021 15.6307 17.4023 15.117C17.5944 14.6201 17.7263 14.0522 17.7653 13.2208C17.8027 12.3875 17.8125 12.1219 17.8125 10.0001C17.8125 7.87828 17.8027 7.61203 17.7653 6.77867C17.7263 5.94695 17.5944 5.3793 17.4023 4.88258C17.2021 4.36867 16.9352 3.93281 16.5006 3.49852C16.0661 3.06398 15.6315 2.79703 15.1172 2.59773C14.6191 2.40445 14.0511 2.27273 13.2194 2.23469C12.386 2.1968 12.1207 2.1875 9.99828 2.1875H10.0007ZM9.29984 3.59539C9.50789 3.59508 9.74 3.59539 10.0007 3.59539C12.0867 3.59539 12.3339 3.60289 13.1577 3.64031C13.9194 3.67516 14.3328 3.80242 14.6082 3.90938C14.9728 4.05094 15.2327 4.22023 15.506 4.49375C15.7795 4.76719 15.9487 5.02758 16.0906 5.39219C16.1976 5.66719 16.325 6.08063 16.3597 6.84234C16.3971 7.66594 16.4052 7.91328 16.4052 9.99828C16.4052 12.0833 16.3971 12.3307 16.3597 13.1542C16.3248 13.9159 16.1976 14.3294 16.0906 14.6045C15.9491 14.9691 15.7795 15.2287 15.506 15.502C15.2326 15.7754 14.973 15.9446 14.6082 16.0863C14.3331 16.1937 13.9194 16.3206 13.1577 16.3555C12.3341 16.3929 12.0867 16.401 10.0007 16.401C7.91461 16.401 7.66734 16.3929 6.84383 16.3555C6.08211 16.3203 5.66867 16.193 5.39305 16.0861C5.02852 15.9445 4.76805 15.7752 4.49461 15.5018C4.22117 15.2284 4.05195 14.9686 3.91 14.6038C3.80305 14.3287 3.67563 13.9153 3.64094 13.1536C3.60352 12.33 3.59602 12.0827 3.59602 9.99633C3.59602 7.91 3.60352 7.66398 3.64094 6.84039C3.67578 6.07867 3.80305 5.66523 3.91 5.38984C4.05164 5.02523 4.22117 4.76484 4.49469 4.49141C4.7682 4.21797 5.02852 4.04867 5.39313 3.9068C5.66852 3.79938 6.08211 3.67242 6.84383 3.63742C7.56453 3.60484 7.84383 3.59508 9.29984 3.59344V3.59539ZM14.171 4.89258C13.6534 4.89258 13.2335 5.31211 13.2335 5.82977C13.2335 6.34734 13.6534 6.76727 14.171 6.76727C14.6886 6.76727 15.1085 6.34734 15.1085 5.82977C15.1085 5.31219 14.6886 4.89227 14.171 4.89227V4.89258ZM10.0007 5.98797C7.78508 5.98797 5.98867 7.78438 5.98867 10.0001C5.98867 12.2158 7.78508 14.0113 10.0007 14.0113C12.2164 14.0113 14.0122 12.2158 14.0122 10.0001C14.0122 7.78445 12.2163 5.98797 10.0005 5.98797H10.0007ZM10.0007 7.39586C11.4389 7.39586 12.6049 8.56172 12.6049 10.0001C12.6049 11.4383 11.4389 12.6043 10.0007 12.6043C8.5625 12.6043 7.39656 11.4383 7.39656 10.0001C7.39656 8.56172 8.56242 7.39586 10.0007 7.39586Z" fill="white"/>
</g>
<defs>
<radialGradient id="paint0_radial_7512_27623" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(5.3125 21.5404) rotate(-90) scale(19.8215 18.4355)">
<stop stop-color="#FFDD55"/>
<stop offset="0.1" stop-color="#FFDD55"/>
<stop offset="0.5" stop-color="#FF543E"/>
<stop offset="1" stop-color="#C837AB"/>
</radialGradient>
<radialGradient id="paint1_radial_7512_27623" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-3.35008 1.4407) rotate(78.681) scale(8.86031 36.5225)">
<stop stop-color="#3771C8"/>
<stop offset="0.128" stop-color="#3771C8"/>
<stop offset="1" stop-color="#6600FF" stop-opacity="0"/>
</radialGradient>
<clipPath id="clip0_7512_27623">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>

</a-button>
<a-button type="text" style="padding:0">
  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.44175 17.9612V8.71017L2.57273 6.08545L0 4.62891V16.3286C0 17.232 0.731871 17.9612 1.63256 17.9612H5.44175Z" fill="#4285F4"/>
<path d="M18.5 17.9611H22.3092C23.2126 17.9611 23.9418 17.2292 23.9418 16.3286V4.62891L21.0277 6.2972L18.5 8.71008V17.9611Z" fill="#34A853"/>
<path d="M5.44117 8.71094L5.05078 5.09629L5.44117 1.63672L11.9712 6.53432L18.5013 1.63672L18.938 4.90951L18.5013 8.71094L11.9712 13.6085L5.44117 8.71094Z" fill="#EA4335"/>
<path d="M18.5 1.63712V8.71134L23.9418 4.63007V2.45335C23.9418 0.434511 21.6372 -0.716374 20.0238 0.49437L18.5 1.63712Z" fill="#FBBC04"/>
<path d="M0 4.63012L2.50276 6.50726L5.44175 8.71138V1.63716L3.91796 0.494413C2.30177 -0.716425 0 0.434554 0 2.4533V4.63012Z" fill="#C5221F"/>
</svg>

</a-button>
<a-button type="text" style="padding:0">
  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_7512_27634)">
<path d="M11.8594 6.48185C13.0268 7.31016 14.4569 7.79753 16.0015 7.79753V4.84739C15.7092 4.8475 15.4176 4.81722 15.1316 4.75702V7.07921C13.5872 7.07921 12.1572 6.5919 10.9896 5.76365V11.7841C10.9896 14.7959 8.52987 17.2372 5.49587 17.2372C4.36381 17.2372 3.31156 16.8975 2.4375 16.3148C3.43512 17.3274 4.82638 17.9554 6.3655 17.9554C9.39975 17.9554 11.8596 15.5141 11.8596 12.5022V6.48185H11.8594ZM12.9326 3.50552C12.3359 2.85858 11.9442 2.02251 11.8594 1.09818V0.71875H11.0351C11.2426 1.89353 11.9504 2.89718 12.9326 3.50552ZM4.3565 14.0037C4.02315 13.57 3.84297 13.0393 3.84381 12.4936C3.84381 11.1162 4.96887 9.9993 6.35694 9.9993C6.61558 9.99916 6.87269 10.0386 7.11925 10.1162V7.10006C6.83112 7.06089 6.54037 7.0442 6.24975 7.05034V9.39791C6.00307 9.3203 5.74582 9.2809 5.48706 9.2811C4.09906 9.2811 2.97406 10.3978 2.97406 11.7755C2.97406 12.7496 3.53637 13.5929 4.3565 14.0037Z" fill="#FF004F"/>
<path d="M10.989 5.76359C12.1567 6.59184 13.5865 7.07914 15.131 7.07914V4.75696C14.2688 4.57466 13.5057 4.12752 12.9318 3.50552C11.9497 2.89712 11.242 1.89347 11.0345 0.71875H8.86928V12.5021C8.86434 13.8758 7.74122 14.9881 6.35616 14.9881C5.54003 14.9881 4.81491 14.602 4.35572 14.0037C3.53572 13.5929 2.97334 12.7495 2.97334 11.7755C2.97334 10.398 4.09834 9.28116 5.48634 9.28116C5.75228 9.28116 6.00859 9.32225 6.24903 9.39798V7.05041C3.26828 7.11154 0.871094 9.52901 0.871094 12.5022C0.871094 13.9864 1.46803 15.3318 2.43691 16.3149C3.31097 16.8975 4.36316 17.2373 5.49528 17.2373C8.52934 17.2373 10.989 14.7958 10.989 11.7841L10.989 5.76359Z" fill="black"/>
<path d="M15.1297 4.75634V4.12858C14.3523 4.1297 13.5902 3.9136 12.9306 3.50497C13.5144 4.13945 14.2833 4.57698 15.1297 4.75647M11.0331 0.718138C11.0134 0.605891 10.9982 0.492895 10.9876 0.379428V0H7.998V11.7835C7.99325 13.1571 6.87013 14.2693 5.485 14.2693C5.09233 14.2699 4.70502 14.1788 4.35437 14.0033C4.81356 14.6014 5.53869 14.9875 6.35481 14.9875C7.73981 14.9875 8.86306 13.8753 8.86794 12.5016V0.7182L11.0331 0.718138ZM6.24788 7.04979V6.38137C5.99805 6.3475 5.7462 6.33054 5.49406 6.3306C2.45969 6.3306 0 8.77202 0 11.7835C0 13.6716 0.966688 15.3355 2.43569 16.3143C1.46681 15.3312 0.869875 13.9857 0.869875 12.5016C0.869875 9.52845 3.267 7.11093 6.24788 7.04979Z" fill="#00F2EA"/>
</g>
<defs>
<clipPath id="clip0_7512_27634">
<rect width="16" height="18" fill="white"/>
</clipPath>
</defs>
</svg>

</a-button>
  </a-space>
          </div>

          <!-- Business Details Form -->
          <div class="business-details-section" style="margin-top:10px;">
            <div class="section-header">
              <h3>Business Information</h3>
              <a-button type="text" class="edit-button" @click="toggleEditMode">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Edit
              </a-button>
            </div>

            <a-form layout="vertical" class="business-form">
              <a-row :gutter="[24, 24]">
                <!-- Name Field -->
                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <a-form-item label="Name">
                    <a-input 
                      v-model:value="businessInfo.name"
                      :disabled="!isEditMode"
                      placeholder="Business name"
                      class="form-input"
                    />
                  </a-form-item>
                </a-col>

                <!-- Email Field -->
                <!-- <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <a-form-item label="Email">
                    <a-input 
                      v-model:value="businessInfo.email"
                      :disabled="!isEditMode"
                      placeholder="john@example.com"
                      class="form-input"
                    />
                  </a-form-item>
                </a-col> -->
            

                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <a-form-item label="Email">
                    <div style="display: flex; gap: 10px; align-items: center;">
                      <a-input v-model:value="businessInfo.email" :disabled="!isEditMode || businessInfo.isEmailVerified" placeholder="john@example.com" style="flex: 1; padding: 10px 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 14px;" />
                      <a-button v-if="!businessInfo.isEmailVerified && !isEditMode" type="primary" danger @click="openVerifyModal" style="min-width: 120px; white-space: nowrap;">Verify Email</a-button>
                      <a-tag v-else-if="businessInfo.isEmailVerified" color="green" style="margin: 0; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 500;">✓ Verified</a-tag>
                    </div>
                  </a-form-item>
                  <div v-if="!businessInfo.isEmailVerified && !isEditMode" style="margin-top: 12px; padding: 12px; background: #fffbe6; border-left: 4px solid #faad14; border-radius: 4px; font-size: 13px; color: #8b6914;">
                    <p style="margin: 0 0 6px 0; font-weight: 600;">Email Not Verified</p>
                    <p style="margin: 0; line-height: 1.5;">Please verify your business email to ensure secure communication with your customers. After verification, your email cannot be modified.</p>
                  </div>
                </a-col>

                <!-- Phone Number Field -->
                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <a-form-item label="Phone Number">
                    <a-input 
                      v-model:value="businessInfo.phone"
                      :disabled="!isEditMode"
                      placeholder="+91 9876543210"
                      class="form-input"
                    />
                  </a-form-item>
                </a-col>

                <!-- Description Field -->
                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <a-form-item label="Description">
                    <a-textarea 
                      v-model:value="businessInfo.description"
                      :disabled="!isEditMode"
                      :rows="4"
                      placeholder="Tell us about your business..."
                      class="form-textarea"
                    />
                  </a-form-item>
                </a-col>

                <!-- What Do We Offer Field -->
                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <div>
                    <div style="background: #f3f3f3;;border-radius:10px;padding:10px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h1 v-if="!isEditMode" style="font-size:16px">
                          {{ editData.servicesTitle }}
                        </h1>
                        <a-input v-else 
                            v-model:value="editData.servicesTitle" 
                            style="font-size:16px; font-weight: bold; border: 1px dashed #ccc;" 
                            placeholder="Services title" />

                        <a-button v-if="isEditMode" 
                            type="text" 
                            @click="editServices = !editServices">
                            <template #icon>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </template>
                        </a-button>
                      </div>
                      <div v-if="!isEditMode || !editServices">
                        <ul>
                          <li v-for="(service, index) in editData.services" :key="index">{{ service }}</li>
                        </ul>
                      </div>
                      <div v-else>
                        <div v-for="(service, index) in editData.services" :key="index" style="display: flex; margin-bottom: 10px; align-items: center;">
                          <a-textarea 
                              v-model:value="editData.services[index]" 
                              :rows="2"
                              style="border: 1px dashed #ccc; margin-right: 10px;"
                              placeholder="Service description" />
                          <a-button type="text" danger @click="removeService(index)">
                            <template #icon>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                              </svg>
                            </template>
                          </a-button>
                        </div>
                        <a-button type="dashed" @click="addService" style="width: 100%;">
                          <template #icon>+</template>
                          Add Service
                        </a-button>
                      </div>
                    </div>
                  </div>
                </a-col>

                <!-- Social Handles -->
                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                  <a-form-item label="Social Handles">
                    <div class="social-handles">
                      <div class="social-input-group">
                        <div class="social-icon whatsapp"></div>
                        <a-input :disabled="!isEditMode" v-model:value="businessInfo.whatsapp" addon-before="https://wa.me/" class="social-input" />
                      </div>
                      <div class="social-input-group">
                        <div class="social-icon instagram"></div>
                        <a-input :disabled="!isEditMode" v-model:value="businessInfo.instagram" addon-before="https://instagram.com/" class="social-input" />
                      </div>
                      <div class="social-input-group">
                        <div class="social-icon facebook"></div>
                        <a-input :disabled="!isEditMode" v-model:value="businessInfo.facebook" addon-before="https://facebook.com/" class="social-input" />
                      </div>
                      <a-button type="link" class="add-social-btn" v-if="isEditMode">Add</a-button>
                    </div>
                  </a-form-item>
                </a-col>

                <!-- Website Link -->
                <a-col :xs="24" :sm="24" :md="12" :lg="12">
                  <a-form-item label="Website Link">
                    <a-input :disabled="!isEditMode" v-model:value="businessInfo.website" addon-before="Http://" addon-after=".com" />
                  </a-form-item>
                </a-col>

                <!-- Cart Link -->
                <a-col :xs="24" :sm="24" :md="12" :lg="12">
                  <a-form-item label="Cart Link">
                    <a-input :disabled="!isEditMode" v-model:value="businessInfo.cartLink" addon-before="Http://" addon-after=".com" />
                  </a-form-item>
                </a-col>
              </a-row>

              <!-- Save Button (only show when editing) -->
              <div v-if="isEditMode" class="form-actions">
                <a-button type="primary" @click="saveChanges" class="save-btn" :loading="saving">
                  Save Changes
                </a-button>
                <a-button @click="cancelEdit" class="cancel-btn">
                  Cancel
                </a-button>
              </div>
            </a-form>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'BusinessDetails',
  props: {
    user: {
      type: Object,
      required: true
    },
    profile: {
      type: Object,
      required: true
    },
    buisness_info: {
      type: Object,
      required: true
    }
  },

  async mounted() {
    await this.loadBusinessProfile();
  },
  
  data() {
    return {
      isEditMode: false,
      saving: false,
      avatarFile: null,
      backgroundFile: null,
      avatarPreview: null,
      backgroundImage: null,
      slug:'',
      businessInfo: {
        isEmailVerified: false,

        name: this.buisness_info.name || "",
        email: this.buisness_info.email,
        phone: this.buisness_info.phone_number,
        avatar: this.$store.state.root_media_api + this.buisness_info.banner_picture,
        description: this.buisness_info.description,
        services: this.buisness_info.services,
        whatsapp: 'https://wa.me/' + this.buisness_info.whatsapp_number,
        instagram: 'https://instagram.com/' + this.buisness_info.instagram_url,
        facebook: 'https://facebook.com/' + this.buisness_info.facebook_url,
        website: 'https://' + this.buisness_info.website_url,
        cartLink: 'https://',
      },
      // Verification modal data
    verifyModalVisible: false,
    verificationStep: 1,
    verificationLoading: false,
    otpCode: '',
    verifyingOTP: false,
    otpError: '',
    otpTimeRemaining: 600,
    otpTimer: null,
    otpProgress: 100,


      editServices: false,
      editData: {
        servicesTitle: 'what do we offer ?',
        services: [
          'Architectural and Designer Lighting – A selection of modern, classic, and innovative lighting fixtures for every space',
          'Advanced 3D Visualizations – See how your chosen lighting will look in your home with state-of-the-art visualization technology.',
          'Personalized Professional Consultation – Our expert team will help you find the perfect lighting for your needs and design style.',
          'Smart Lighting & Advanced Solutions – Integrating cutting-edge technologies to illuminate your space with style and efficiency'
        ]
      },
      originalBusinessInfo: {}
    }
  },

  watch: {
    'editData.services': {
      handler(newServices) {
        this.businessInfo.services = newServices.join('\n\n');
      },
      deep: true
    }
  },

  methods: {
    openVerifyModal() {
  this.verifyModalVisible = true;
  this.verificationStep = 1;
  this.otpCode = '';
  this.otpError = '';
},

closeVerifyModal() {
  this.verifyModalVisible = false;
  this.verificationStep = 1;
  this.otpCode = '';
  this.otpError = '';
  if (this.otpTimer) {
    clearInterval(this.otpTimer);
  }
},

async startVerification() {
  try {
    this.verificationLoading = true;
    const token = localStorage.getItem('token');

    const response = await fetch(`${this.$store.state.root_api}Auth/api/send-business-email-otp/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (result.success) {
      this.verificationStep = 2;
      this.otpTimeRemaining = 600;
      this.otpProgress = 100;
      this.startOTPTimer();
      this.$message.success('OTP sent to your email');
    } else {
      this.$message.error(result.message || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    this.$message.error('Failed to send OTP');
  } finally {
    this.verificationLoading = false;
  }
},

startOTPTimer() {
  if (this.otpTimer) {
    clearInterval(this.otpTimer);
  }

  this.otpTimer = setInterval(() => {
    this.otpTimeRemaining--;
    this.otpProgress = (this.otpTimeRemaining / 600) * 100;

    if (this.otpTimeRemaining <= 0) {
      clearInterval(this.otpTimer);
      this.otpError = 'OTP has expired. Please request a new one.';
      this.goBackToStep1();
    }
  }, 1000);
},

async verifyOTP() {
  if (this.otpCode.length !== 6) {
    this.$message.error('Please enter a valid 6-digit OTP');
    return;
  }

  try {
    this.verifyingOTP = true;
    this.otpError = '';
    const token = localStorage.getItem('token');

    const response = await fetch(`${this.$store.state.root_api}Auth/api/verify-business-email-otp/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        otp: this.otpCode
      })
    });

    const result = await response.json();

    if (result.success) {
      this.businessInfo.isEmailVerified = true;

      // Update localStorage with verified status
      const businessProfile = JSON.parse(localStorage.getItem('business_profile') || '{}');
      businessProfile.is_email_verified = true;
      localStorage.setItem('business_profile', JSON.stringify(businessProfile));
      

      this.verificationStep = 3;
      if (this.otpTimer) {
        clearInterval(this.otpTimer);
      }
      this.$message.success('Email verified successfully!');
    } else {
      this.otpError = result.message || 'Invalid OTP';
      this.$message.error(this.otpError);
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    this.otpError = 'Verification failed. Please try again.';
    this.$message.error(this.otpError);
  } finally {
    this.verifyingOTP = false;
  }
},

async resendOTP() {
  try {
    this.verificationLoading = true;
    const token = localStorage.getItem('token');

    const response = await fetch(`${this.$store.state.root_api}Auth/api/resend-business-email-otp/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (result.success) {
      this.otpCode = '';
      this.otpError = '';
      this.otpTimeRemaining = 600;
      this.otpProgress = 100;
      this.startOTPTimer();
      this.$message.success('OTP resent to your email');
    } else {
      this.$message.error(result.message || 'Failed to resend OTP');
    }
  } catch (error) {
    console.error('Error resending OTP:', error);
    this.$message.error('Failed to resend OTP');
  } finally {
    this.verificationLoading = false;
  }
},

goBackToStep1() {
  if (this.otpTimer) {
    clearInterval(this.otpTimer);
  }
  this.verificationStep = 1;
  this.otpCode = '';
  this.otpError = '';
},

async checkVerificationStatus() {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.$store.state.root_api}Auth/api/business-email-status/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    if (result.success) {
      this.businessInfo.isEmailVerified = result.data.is_verified;
    }
  } catch (error) {
    console.error('Error checking verification status:', error);
  }
},
    full_url() {
      if (typeof window !== 'undefined') {
        return `${window.location.origin}/${this.slug}`;
      }
      return `${this.$route.path}/${this.slug}`; // fallback for SSR
    },
    // Image upload handlers using Ant Design Upload component
    handleAvatarBeforeUpload(file) {
      // Validate file type
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('Please select an image file');
        return false;
      }

      // Validate file size (2MB limit)
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Avatar image must be smaller than 2MB');
        return false;
      }

      // Store file and create preview
      this.avatarFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);

      // Prevent auto upload
      return false;
    },

    handleBackgroundBeforeUpload(file) {
      // Validate file type
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('Please select an image file');
        return false;
      }

      // Validate file size (5MB limit)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error('Background image must be smaller than 5MB');
        return false;
      }

      // Store file and create preview
      this.backgroundFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.backgroundImage = e.target.result;
      };
      reader.readAsDataURL(file);

      // Prevent auto upload
      return false;
    },

    // Convert file to base64
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },

    // Copy link functionality
    copyLink() {
      const link =`${window.location.origin}/${this.slug}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(() => {
          this.$message.success('Link copied to clipboard!');
        }).catch(() => {
          this.fallbackCopyTextToClipboard(link);
        });
      } else {
        this.fallbackCopyTextToClipboard(link);
      }
    },

    fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        this.$message.success('Link copied to clipboard!');
      } catch (err) {
        this.$message.error('Failed to copy link');
      }
      document.body.removeChild(textArea);
    },

    addService() {
      this.editData.services.push('');
    },
        
    removeService(index) {
      if (this.editData.services.length > 1) {
        this.editData.services.splice(index, 1);
      } else {
        this.$message.warning('At least one service is required');
      }
    },

    toggleEditMode() {
      if (!this.isEditMode) {
        this.originalBusinessInfo = { ...this.businessInfo };
      }
      this.isEditMode = !this.isEditMode;
      
      // Reset image previews when entering edit mode
      if (this.isEditMode) {
        this.avatarPreview = null;
        this.backgroundImage = null;
        this.avatarFile = null;
        this.backgroundFile = null;
      }
    },

    cancelEdit() {
      this.businessInfo = { ...this.originalBusinessInfo };
      this.isEditMode = false;
      this.editServices = false;
      this.avatarPreview = null;
      this.backgroundImage = null;
      this.avatarFile = null;
      this.backgroundFile = null;
      this.$message.info('Changes cancelled');
    },
    
    async loadBusinessProfile() {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${this.$store.state.root_api}Auth/api/business-profile/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();
        if (result.success) {
          const data = result.data;
          this.slug=data.slug
          this.businessInfo = {
            name: data.name || "",
            email: data.email || "",
            phone: data.phone_number || "",
            avatar: data.banner_picture || "",
            business_picture: data.business_picture || "",
            description: data.description || "",
            services: data.buisness_info || "",
            isEmailVerified:data.is_email_verified||false,
            whatsapp: data.whatsapp_number ? `https://wa.me/${data.whatsapp_number}` : "",
            instagram: data.instagram_url ? `https://instagram.com/${data.instagram_url}` : "",
            facebook: data.facebook_url ? `https://facebook.com/${data.facebook_url}` : "",
            website: data.website_url ? `https://${data.website_url}` : "",
            cartLink: ""
          };
          console.log(this.businessInfo.business_picture)

          this.editData = {
            ...this.editData,
            servicesTitle: 'What do we offer?',
            services: Array.isArray(data.services_offered) ? data.services_offered : []
          };

          this.originalBusinessInfo = { ...this.businessInfo };
          
        } else {
          console.error('Failed to load business profile:', result.message);
          this.$message.error('Failed to load business profile');
        }
        
      } catch (error) {
        console.error('Error loading business profile:', error);
        this.$message.error('Network error while loading profile');
      }
    },

    async saveChanges() {
      try {
        this.saving = true;

        // Prepare data for API
        const payload = {
          name: this.businessInfo.name,
          email: this.businessInfo.email,
          phone_number: this.businessInfo.phone,
          description: this.businessInfo.description,
          buisness_info: this.businessInfo.services,
          services: this.editData.services,
          
          // Extract social media handles from URLs
          whatsapp_number: this.extractWhatsAppNumber(this.businessInfo.whatsapp),
          instagram_url: this.extractInstagramHandle(this.businessInfo.instagram),
          facebook_url: this.extractFacebookHandle(this.businessInfo.facebook),
          website_url: this.extractWebsiteUrl(this.businessInfo.website)
        };

        // Include image data if changed
        if (this.avatarFile) {
          payload.banner_picture = await this.fileToBase64(this.avatarFile);
        }
        if (this.backgroundFile) {
          payload.business_picture = await this.fileToBase64(this.backgroundFile);
        }

        const token = localStorage.getItem('token');

        const response = await fetch(`${this.$store.state.root_api}Auth/api/business-profile/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
          this.$message.success('Business details updated successfully!');
          this.isEditMode = false;
          this.editServices = false;
          
          // Reset image data after successful save
          this.avatarFile = null;
          this.backgroundFile = null;
          this.avatarPreview = null;
          this.backgroundImage = null;
          
          // Update original data after successful save
          this.originalBusinessInfo = { ...this.businessInfo };
          
          // Reload profile to get updated data
          await this.loadBusinessProfile();
          
        } else {
          this.$message.error(result.message || 'Failed to save changes');
        }
        
      } catch (error) {
        this.$message.error('Network error. Please try again.');
        console.error('Error saving changes:', error);
      } finally {
        this.saving = false;
      }
    },

    // Helper methods to extract handles from URLs
    extractWhatsAppNumber(whatsappUrl) {
      if (!whatsappUrl) return '';
      const match = whatsappUrl.match(/wa\.me\/(\+?[\d]+)/);
      return match ? match[1] : '';
    },

    extractInstagramHandle(instagramUrl) {
      if (!instagramUrl) return '';
      const match = instagramUrl.match(/instagram\.com\/([^\/\?]+)/);
      return match ? match[1] : '';
    },

    extractFacebookHandle(facebookUrl) {
      if (!facebookUrl) return '';
      const match = facebookUrl.match(/facebook\.com\/([^\/\?]+)/);
      return match ? match[1] : '';
    },

    extractWebsiteUrl(websiteUrl) {
      if (!websiteUrl) return '';
      return websiteUrl.replace(/^https?:\/\//, '');
    }
  }
}
</script>

<style scoped>
* {
    font-family: Poppins;
}
.business-details-container {
  min-height: 100vh;
  border:1px soild rgba(128, 128, 128, 0.997);
  padding: 0px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.content-wrapper {
  background: white;
  border-radius: 20px;
  overflow: hidden;
}

.header-banner {
  height: 200px;
  background: linear-gradient(135deg, #f0f4f8 0%, #e8f0fe 100%);
  background-color: red;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  pointer-events: none;
}

.profile-section {
  position: absolute;
  bottom: -50px;
  left: 40px;
}

.profile-avatar {
  position: relative;
  width: 100px;
  height: 100px;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.camera-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: #1890ff;
  border: 3px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.camera-overlay svg {
  color: white;
}

.camera-overlay:hover {
  background: #40a9ff;
  transform: scale(1.1);
}

.business-details-section {
  width:800px;
  margin:auto
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-header h3 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1890ff;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.edit-button:hover {
  background: #f0f9ff;
  color: #0969da;
}

.business-form {
  max-width: 100%;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 15px;
  background: #f9fafb;
  color: #6b7280;
  resize: none;
  box-sizing: border-box;
  transition: all 0.3s ease;
  line-height: 1.5;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.form-input:disabled,
.form-textarea:disabled {
  background: #fafafa;
  color: #666;
}

.social-handles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.social-icon.whatsapp {
  background: #25d366;
}

.social-icon.instagram {
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}

.social-icon.facebook {
  background: #1877f2;
}

.social-input {
  flex: 1;
  border-radius: 8px;
}

.add-social-btn {
  color: #1890ff;
  padding: 0;
  height: auto;
  font-weight: 500;
}

.form-actions {
  margin-top: 32px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.save-btn {
  background: #1890ff;
  border-color: #1890ff;
  border-radius: 8px;
  height: 40px;
  padding: 0 24px;
  font-weight: 500;
}

.cancel-btn {
  border-radius: 8px;
  height: 40px;
  padding: 0 24px;
  font-weight: 500;
}

.background-upload-wrapper {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.background-upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  height: 40px;
  padding: 0 16px;
}

.background-upload-btn:hover {
  background: #40a9ff !important;
  border-color: #40a9ff !important;
}

.avatar-upload-wrapper {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 50%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .business-details-container {
    padding: 10px;
  }
  
  .business-details-section {
    padding: 70px 24px 24px;
    width: 100%;
  }
  
  .profile-section {
    left: 24px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .section-header h3 {
    font-size: 24px;
  }
  
  .form-actions {
    justify-content: stretch;
  }
  
  .save-btn,
  .cancel-btn {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .business-details-section {
    padding: 70px 16px 20px;
  }
  
  .profile-section {
    left: 16px;
  }
  
  .profile-avatar {
    width: 80px;
    height: 80px;
  }
  
  .camera-overlay {
    width: 28px;
    height: 28px;
  }
  
  .social-input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .social-icon {
    width: 100%;
    height: 40px;
    border-radius: 8px 8px 0 0;
  }
  
  .social-input {
    border-radius: 0 0 8px 8px;
    border-top: none;
  }
}

/* Ant Design overrides */
:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
}

:deep(.ant-input:disabled) {
  background: #fafafa;
  color: #666;
}

:deep(.ant-input:focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

:deep(.ant-upload) {
  display: block !important;
}

:deep(.ant-upload .ant-btn) {
  border: none;
  box-shadow: none;
}
:deep(.ant-progress-text) {
  font-size: 12px !important;
} 
</style>