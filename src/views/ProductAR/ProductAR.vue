<template>
  <div class="ar-section-rendering">
    <div class="ar-section"></div>

    <div class="ar-controller">
      <!-- ICON 1 -->
      <div
        class="control-icon"
        :class="{ active: activeIndex === 0 }"
        @click="setActive(0)"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.57365 9.72704L4.46408 12.8086C4.04948 13.2017 3.30954 14.2273 3.22025 15.1668C3.12635 16.1547 4.09309 17.572 4.46408 18.1146C5.43111 19.5287 5.82048 20.3134 6.95174 21.6518C7.56609 22.3786 9.22561 23.8274 11.9271 24.01C13.9437 24.1462 15.9511 24.1335 16.9024 24.01C17.5555 23.9251 19.1412 23.6562 20.6338 22.2413C22.1265 20.8265 22.4996 18.5076 22.4996 17.525V8.09236C22.4996 7.50282 22.1265 6.32374 20.6338 6.32374C19.1412 6.32374 18.7681 7.50282 18.7681 8.09236V12.2192M7.57365 15.1668V5.7342C7.57365 5.14466 7.9468 3.96558 9.4394 3.96558C10.9319 3.96558 11.3052 5.14466 11.3052 5.7342M11.3052 5.7342V11.04M11.3052 5.7342V3.37604C11.3052 2.7865 11.6782 1.60742 13.1709 1.60742C14.6635 1.60742 15.0366 2.7865 15.0366 3.37604V5.7342M15.0366 5.7342V11.04M15.0366 5.7342C15.0366 5.14466 15.4098 3.96558 16.9024 3.96558C18.3949 3.96558 18.7681 5.14466 18.7681 5.7342V8.6819"
            :stroke="activeIndex === 0 ? '#FFFFFF' : '#1A1A1A'"
            stroke-width="1.60714"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <!-- ICON 2 -->
      <div
        class="control-icon"
        :class="{ active: activeIndex === 1 }"
        @click="setActive(1)"
      >
        <svg
          width="24"
          height="21"
          viewBox="0 0 24 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.5577 10.9888C23.7557 5.09219 22.2981 1.08962 16.8267 0.803711C12.8501 0.879632 8.74804 3.02224 5.47376 6.33692C2.72594 9.11864 0.0204015 13.1026 1.01361 16.8944C1.23292 17.7316 1.66052 18.3021 2.33602 18.8389C4.15129 20.2813 5.93307 20.4083 9.36476 19.5658C12.84 18.5098 14.9946 16.9189 16.8113 15.2912M16.8113 15.2912C16.8131 15.2895 16.815 15.2878 16.817 15.2861C16.8204 15.2831 16.8181 15.2773 16.8135 15.2773C16.8101 15.2773 16.8076 15.2809 16.8088 15.2841C16.8097 15.2865 16.8104 15.2889 16.8113 15.2912ZM16.8113 15.2912C17.2081 16.4647 16.9568 17.512 16.2735 19.5658"
            :stroke="activeIndex === 1 ? '#FFFFFF' : '#1A1A1A'"
            stroke-width="1.60714"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <!-- ICON 3 -->
      <div
        class="control-icon"
        :class="{ active: activeIndex === 2 }"
        @click="setActive(2)"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.57101 3.31865C8.57101 3.31865 4.32145 2.93738 3.6294 3.62942C2.93734 4.32146 3.31868 8.57101 3.31868 8.57101"
            :stroke="activeIndex === 2 ? '#FFFFFF' : '#1A1A1A'"
            stroke-width="1.60714"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.57101 22.3949C8.57101 22.3949 4.32145 22.7763 3.6294 22.0842C2.93734 21.3921 3.31868 17.1426 3.31868 17.1426"
            :stroke="activeIndex === 2 ? '#FFFFFF' : '#1A1A1A'"
            stroke-width="1.60714"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17.1436 3.31865C17.1436 3.31865 21.3932 2.93738 22.0852 3.62942C22.7772 4.32146 22.3959 8.57101 22.3959 8.57101"
            :stroke="activeIndex === 2 ? '#FFFFFF' : '#1A1A1A'"
            stroke-width="1.60714"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17.1436 22.3949C17.1436 22.3949 21.3932 22.7763 22.0852 22.0842C22.7772 21.3921 22.3959 17.1426 22.3959 17.1426"
            :stroke="activeIndex === 2 ? '#FFFFFF' : '#1A1A1A'"
            stroke-width="1.60714"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.0117 10.7115L21.4957 4.22754"
            :stroke="activeIndex === 2 ? '#FFFFFF' : '#1A1A1A'"
            stroke-width="1.60714"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10.7118 15.0039L3.90039 21.8378"
            :stroke="activeIndex === 2 ? '#FFFFFF' : '#1A1A1A'"
            stroke-width="1.60714"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10.7111 10.7171L4.12012 4.13477"
            :stroke="activeIndex === 2 ? '#FFFFFF' : '#1A1A1A'"
            stroke-width="1.60714"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.9775 15.0039L21.9937 21.9638"
            :stroke="activeIndex === 2 ? '#FFFFFF' : '#1A1A1A'"
            stroke-width="1.60714"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <div class="ar-image-download-section">
      <a-button type="primary" size="large" class="render-model-btn" block>
        Render model
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductARView",
  data() {
    return {
      activeIndex: null, // none active initially
    };
  },
  methods: {
    setActive(index) {
      this.activeIndex = index;
    },
  },
};
</script>

<style scoped>
.ar-section-rendering {
  min-width: 350px;
}
.ar-section {
  margin: 10px 0;
  width: 100%;
  height: 85vh;
  min-height: 350px;
  border: 1px solid gainsboro;
}
.ar-controller {
  margin: 4px 0;
  display: flex;
  justify-content: center;
  gap: 5px;
}
.ar-image-download-section {
  display: flex;
  justify-content: center;
}
.render-model-btn {
  max-width: 250px;
}
.control-icon {
  width: 35px;
  height: 35px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 9px;
  transition: all 0.3s ease;
  cursor: pointer;
}
/* Hover effect */
.control-icon:hover {
  background-color: #3b63fb;
}
.control-icon:hover svg path {
  stroke: #ffffff;
}
/* Active effect (clicked) */
.control-icon.active {
  background-color: #3b63fb;
}
.control-icon.active svg path {
  stroke: #ffffff;
}
</style>