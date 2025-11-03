<template>
    
    <!-- Updated child component -->
    <add_new_product_mockup
      :open_AddToProduct="open_AddToProduct"
      :product_mockup_images="product_mockup_images" 
      :selected_product_mockups_group="selected_product_mockups_group"
      @update:open_AddToProduct="open_AddToProduct = $event"
      @apply-mockup="handleApplyMockup"
    />
   
          <div style="background:white;display:flex;align-items:center;justify-content:space-between;padding:5px 10px;height:40px;;background-color: #f3f3f6;" v-if="closeShareMenu">
  
  <!-- Left: Share section -->
  <div style="display:flex;align-items:center;gap:8px;" >
    <span style="font-size:16px;color:#444;">Share on social:</span>
    <svg width="20" height="20" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.443867 10.773C0.443375 12.6053 0.908 14.3944 1.79148 15.9713L0.359375 21.3591L5.71044 19.9134C7.19048 20.7436 8.84874 21.1786 10.5339 21.1787H10.5383C16.1013 21.1787 20.6296 16.5143 20.632 10.7812C20.6331 8.00309 19.5841 5.39073 17.6781 3.42533C15.7726 1.46011 13.2382 0.377244 10.5379 0.375977C4.97429 0.375977 0.446246 5.04012 0.443949 10.773" fill="url(#paint0_linear_7100_26150)"/>
<path d="M0.0877734 10.77C0.0871992 12.6682 0.568476 14.5212 1.48345 16.1546L0 21.7356L5.54293 20.238C7.07019 21.0961 8.78973 21.5485 10.5395 21.5491H10.544C16.3065 21.5491 20.9975 16.7169 21 10.7786C21.001 7.90064 19.9142 5.19437 17.9402 3.15857C15.966 1.12301 13.341 0.00118336 10.544 0C4.78045 0 0.0900703 4.8315 0.0877734 10.77ZM3.38879 15.8733L3.18183 15.5348C2.3118 14.1093 1.85259 12.4621 1.85325 10.7706C1.85505 5.83474 5.75351 1.819 10.5473 1.819C12.8687 1.82001 15.0504 2.7525 16.6914 4.44437C18.3323 6.13641 19.2352 8.38565 19.2346 10.7779C19.2325 15.7138 15.3339 19.73 10.544 19.73H10.5405C8.98086 19.7292 7.45123 19.2976 6.11723 18.482L5.79977 18.288L2.51048 19.1767L3.38879 15.8733Z" fill="url(#paint1_linear_7100_26150)"/>
<path d="M7.93012 6.26731C7.73439 5.81907 7.52841 5.81002 7.34228 5.80216C7.18987 5.7954 7.01563 5.79591 6.84156 5.79591C6.66733 5.79591 6.38424 5.86344 6.14495 6.13266C5.90542 6.40213 5.23047 7.05331 5.23047 8.37775C5.23047 9.70219 6.16669 10.9822 6.2972 11.162C6.42788 11.3415 8.1046 14.1464 10.7601 15.2255C12.9671 16.1222 13.4162 15.9438 13.8952 15.8989C14.3742 15.8541 15.441 15.2479 15.6586 14.6192C15.8764 13.9907 15.8764 13.4519 15.8111 13.3393C15.7458 13.2272 15.5716 13.1598 15.3103 13.0252C15.049 12.8907 13.7645 12.2393 13.5251 12.1495C13.2855 12.0597 13.1114 12.0149 12.9371 12.2845C12.7629 12.5536 12.2626 13.1598 12.1101 13.3393C11.9578 13.5193 11.8053 13.5417 11.5441 13.407C11.2827 13.272 10.4413 12.988 9.44302 12.071C8.66635 11.3575 8.142 10.4763 7.98959 10.2067C7.83718 9.93759 7.97327 9.7917 8.10427 9.65756C8.22166 9.53694 8.36562 9.34321 8.49638 9.18607C8.62664 9.02886 8.67012 8.91669 8.75724 8.73716C8.84444 8.55745 8.8008 8.40024 8.73558 8.26559C8.67012 8.13094 8.16243 6.79957 7.93012 6.26731Z" fill="white"/>
<defs>
<linearGradient id="paint0_linear_7100_26150" x1="1013.99" y1="2098.69" x2="1013.99" y2="0.375977" gradientUnits="userSpaceOnUse">
<stop stop-color="#1FAF38"/>
<stop offset="1" stop-color="#60D669"/>
</linearGradient>
<linearGradient id="paint1_linear_7100_26150" x1="1050" y1="2173.56" x2="1050" y2="0" gradientUnits="userSpaceOnUse">
<stop stop-color="#F9F9F9"/>
<stop offset="1" stop-color="white"/>
</linearGradient>
</defs>
</svg>

    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_7100_26154)">
<path d="M20 10C20 4.47719 15.5228 0 10 0C4.47719 0 0 4.47719 0 10C0 14.9913 3.65687 19.1284 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2147 3.90625C13.3088 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.9499 6.5625 11.5625 7.33336 11.5625 8.12422V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3431 19.1284 20 14.9913 20 10Z" fill="#1877F2"/>
<path d="M13.8926 12.8906L14.3359 10H11.5625V8.12422C11.5625 7.33328 11.9499 6.5625 13.1922 6.5625H14.4531V4.10156C14.4531 4.10156 13.3088 3.90625 12.2146 3.90625C9.93047 3.90625 8.4375 5.29063 8.4375 7.79688V10H5.89844V12.8906H8.4375V19.8785C8.95439 19.9595 9.4768 20.0001 10 20C10.5232 20.0001 11.0456 19.9595 11.5625 19.8785V12.8906H13.8926Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_7100_26154">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>

<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_7100_26157)">
<path d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z" fill="url(#paint0_radial_7100_26157)"/>
<path d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z" fill="url(#paint1_radial_7100_26157)"/>
<path d="M10.0007 2.1875C7.87898 2.1875 7.61266 2.1968 6.77938 2.23469C5.94766 2.27281 5.37992 2.40445 4.8832 2.59766C4.3693 2.79719 3.93344 3.06414 3.49922 3.49852C3.06461 3.93281 2.79766 4.36867 2.5975 4.88234C2.40375 5.37922 2.27195 5.94719 2.23453 6.77852C2.19727 7.61188 2.1875 7.87828 2.1875 10.0001C2.1875 12.1219 2.19688 12.3873 2.23469 13.2206C2.27297 14.0523 2.40461 14.6201 2.59766 15.1168C2.79734 15.6307 3.0643 16.0666 3.49867 16.5008C3.93281 16.9354 4.36867 17.203 4.88219 17.4025C5.3793 17.5957 5.94711 17.7273 6.77867 17.7655C7.61203 17.8034 7.87813 17.8127 9.99977 17.8127C12.1217 17.8127 12.3872 17.8034 13.2205 17.7655C14.0522 17.7273 14.6205 17.5957 15.1177 17.4025C15.6313 17.203 16.0666 16.9354 16.5006 16.5008C16.9352 16.0666 17.2021 15.6307 17.4023 15.117C17.5944 14.6201 17.7262 14.0522 17.7653 13.2208C17.8027 12.3875 17.8125 12.1219 17.8125 10.0001C17.8125 7.87828 17.8027 7.61203 17.7653 6.77867C17.7262 5.94695 17.5944 5.3793 17.4023 4.88258C17.2021 4.36867 16.9352 3.93281 16.5006 3.49852C16.0661 3.06398 15.6315 2.79703 15.1172 2.59773C14.6191 2.40445 14.0511 2.27273 13.2194 2.23469C12.386 2.1968 12.1207 2.1875 9.99828 2.1875H10.0007ZM9.29984 3.59539C9.50789 3.59508 9.74 3.59539 10.0007 3.59539C12.0867 3.59539 12.3339 3.60289 13.1577 3.64031C13.9194 3.67516 14.3328 3.80242 14.6082 3.90938C14.9728 4.05094 15.2327 4.22023 15.506 4.49375C15.7795 4.76719 15.9487 5.02758 16.0906 5.39219C16.1976 5.66719 16.325 6.08063 16.3597 6.84234C16.3971 7.66594 16.4052 7.91328 16.4052 9.99828C16.4052 12.0833 16.3971 12.3307 16.3597 13.1542C16.3248 13.9159 16.1976 14.3294 16.0906 14.6045C15.9491 14.9691 15.7795 15.2287 15.506 15.502C15.2326 15.7754 14.973 15.9446 14.6082 16.0863C14.3331 16.1937 13.9194 16.3206 13.1577 16.3555C12.3341 16.3929 12.0867 16.401 10.0007 16.401C7.91461 16.401 7.66734 16.3929 6.84383 16.3555C6.08211 16.3203 5.66867 16.193 5.39305 16.0861C5.02852 15.9445 4.76805 15.7752 4.49461 15.5018C4.22117 15.2284 4.05195 14.9686 3.91 14.6038C3.80305 14.3287 3.67562 13.9153 3.64094 13.1536C3.60352 12.33 3.59602 12.0827 3.59602 9.99633C3.59602 7.91 3.60352 7.66398 3.64094 6.84039C3.67578 6.07867 3.80305 5.66523 3.91 5.38984C4.05164 5.02523 4.22117 4.76484 4.49469 4.49141C4.7682 4.21797 5.02852 4.04867 5.39312 3.9068C5.66852 3.79938 6.08211 3.67242 6.84383 3.63742C7.56453 3.60484 7.84383 3.59508 9.29984 3.59344V3.59539ZM14.171 4.89258C13.6534 4.89258 13.2335 5.31211 13.2335 5.82977C13.2335 6.34734 13.6534 6.76727 14.171 6.76727C14.6886 6.76727 15.1085 6.34734 15.1085 5.82977C15.1085 5.31219 14.6886 4.89227 14.171 4.89227V4.89258ZM10.0007 5.98797C7.78508 5.98797 5.98867 7.78438 5.98867 10.0001C5.98867 12.2158 7.78508 14.0113 10.0007 14.0113C12.2164 14.0113 14.0122 12.2158 14.0122 10.0001C14.0122 7.78445 12.2163 5.98797 10.0005 5.98797H10.0007ZM10.0007 7.39586C11.4389 7.39586 12.6049 8.56172 12.6049 10.0001C12.6049 11.4383 11.4389 12.6043 10.0007 12.6043C8.5625 12.6043 7.39656 11.4383 7.39656 10.0001C7.39656 8.56172 8.56242 7.39586 10.0007 7.39586Z" fill="white"/>
</g>
<defs>
<radialGradient id="paint0_radial_7100_26157" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(5.3125 21.5404) rotate(-90) scale(19.8215 18.4355)">
<stop stop-color="#FFDD55"/>
<stop offset="0.1" stop-color="#FFDD55"/>
<stop offset="0.5" stop-color="#FF543E"/>
<stop offset="1" stop-color="#C837AB"/>
</radialGradient>
<radialGradient id="paint1_radial_7100_26157" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-3.35008 1.4407) rotate(78.681) scale(8.86031 36.5225)">
<stop stop-color="#3771C8"/>
<stop offset="0.128" stop-color="#3771C8"/>
<stop offset="1" stop-color="#6600FF" stop-opacity="0"/>
</radialGradient>
<clipPath id="clip0_7100_26157">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>

  </div>

  <!-- Middle: Buttons -->
  <div style="display:flex;align-items:center;gap:12px;">
    <a-button style="border:none;background:#f9f9f9;padding:5px 12px;border-radius:6px;cursor:pointer;
                   color:#2a5afc;display:flex;align-items:center;gap:6px;font-size:16px;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 14.5V4.5M12 14.5C11.2998 14.5 9.99153 12.5057 9.5 12M12 14.5C12.7002 14.5 14.0085 12.5057 14.5 12" stroke="#3B63FB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 16.5C20 18.982 19.482 19.5 17 19.5H7C4.518 19.5 4 18.982 4 16.5" stroke="#3B63FB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
 Download
    </a-button>
  </div>

  <!-- Right: Close button -->
  <div @click="closeShareMenu=false">
    <div  style="padding:none;outline:none;margin:none;" @click="onClose_drawer_modal"><svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.760742 12.5071C0.760742 6.6112 0.760742 3.66325 2.68209 1.83162C4.60346 -1.56944e-07 7.69583 0 13.8806 0C20.0653 0 23.1577 -1.56944e-07 25.0791 1.83162C27.0004 3.66325 27.0004 6.6112 27.0004 12.5071C27.0004 18.403 27.0004 21.351 25.0791 23.1826C23.1577 25.0142 20.0653 25.0142 13.8806 25.0142C7.69583 25.0142 4.60346 25.0142 2.68209 23.1826C0.760742 21.351 0.760742 18.403 0.760742 12.5071Z" fill="#E33827"/>
<path d="M18.1919 8.39785L9.57176 16.6154M18.1919 16.6154L9.57176 8.39785" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
  </div>
</div>


<div class="main-panel" :style="{ minHeight: panelHeight }">
            <div class="image-grid" :class="gridClass">

      <div 
        v-for="(image, index) in images"  
        :key="index"
        class="image-container"
        :class="getImageClass(index)"
      >
        <a-image :src="this.$store.state.root_media_api+image" :alt="`Generated image ${index + 1}`" />
        <!-- <a-image :src="this.$store.state.root_media_api+'/'+image" :alt="`Generated image ${index + 1}`" /> -->
      </div>
    </div>
    
    <div style="display:flex;justify-content:space-between" v-if="selected_product_mockups_group">
       <a-button type="primary" @click="addToProduct()">
          <a-space>
              <svg width="20" height="20" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.4987 5.83398V11.1673M11.1654 8.50065H5.83203" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.16797 8.49935C2.16797 5.51379 2.16797 4.02101 3.09546 3.09351C4.02296 2.16602 5.51574 2.16602 8.5013 2.16602C11.4868 2.16602 12.9796 2.16602 13.9072 3.09351C14.8346 4.02101 14.8346 5.51379 14.8346 8.49935C14.8346 11.4849 14.8346 12.9777 13.9072 13.9052C12.9796 14.8327 11.4868 14.8327 8.5013 14.8327C5.51574 14.8327 4.02296 14.8327 3.09546 13.9052C2.16797 12.9777 2.16797 11.4849 2.16797 8.49935Z" stroke="white"/>
</svg>

             Add To Product
            </a-space>
            </a-button>

        <a-button type="text" @click="regenerateImages">
          <a-space>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 3.5C12.2 2.2 10.2 1.5 8 1.5C4.1 1.5 1 4.6 1 8.5C1 12.4 4.1 15.5 8 15.5C11.4 15.5 14.2 13.1 14.9 9.9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                  <path d="M11 1.5L13.5 3.5L11.5 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Regenerate
            </a-space>
            </a-button>
    </div>
    
    <!-- Demo controls for testing different image counts -->
    <!-- <div class="demo-controls">
      <button @click="setImageCount(1)" class="demo-btn">1 Image</button>
      <button @click="setImageCount(2)" class="demo-btn">2 Images</button>
      <button @click="setImageCount(3)" class="demo-btn">3 Images</button>
      <button @click="setImageCount(4)" class="demo-btn">4 Images</button>
    </div> -->
  </div>
</template>

<script>
import add_new_product_mockup from '@/components/update_catalogue/edit_image/add_product_image.vue'
export default {
  name: "AdaptiveImageGrid",
  components:{
    add_new_product_mockup 
  },
  props:{
    product_mockup_images: {
      type: Object,
      default: () => ({})
    },
    selected_product_mockups_group: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      closeShareMenu: true,
      allImages:[],
      images: [],

      // add to product modal
      open_AddToProduct:false,
    }
  },
  watch: {
    product_mockup_images: {
      handler(newVal) {
        if (newVal && newVal.images) {
          this.updateImages();
        }
      },
      immediate: true,
      deep: true
    }
  },
computed: {
  
      panelHeight() {
        return this.closeShareMenu ? 'calc(90vh - 50px)' : '90vh';
      },
    gridClass() {
      const count = this.images.length;
      return `grid-${count}`;
    }
  },
  methods: {
    addToProduct(){
      this.open_AddToProduct=true
  },
  
    handleApplyMockup(result) {
      console.log('Apply mockup:', result);
      // Handle the result from child component
      // result contains: mockup_image, product, mockup_group
      // Example: Send to API or update state
      this.applyMockupToProduct(result);
    },
    
    async applyMockupToProduct(data) {
  console.log('Applying mockup with data:', data);
  
  try {
    // Validate required data
    if (!data.product || !data.product.id) {
      throw new Error('Product information is missing');
    }
    
    if (!data.mockup_group || !data.mockup_group.id) {
      throw new Error('Mockup group information is missing');
    }
    
    if (!data.mockup_indices || !Array.isArray(data.mockup_indices) || data.mockup_indices.length === 0) {
      throw new Error('No mockup indices selected');
    }
    
    // Prepare the payload to match your backend expectations
    const payload = {
      product: {
        id: data.product.id,
        title: data.product.title,
        category: data.product.category,
        product_type: data.product.product_type,
        image: data.product.image,
        price: data.product.price,
        is_active: data.product.is_active,
        description: data.product.description
      },
      mockup_group: {
        id: data.mockup_group.id,
        date: data.mockup_group.date,
        input_image: data.mockup_group.input_image,
        images: data.mockup_group.images
      },
      mockup_indices: data.mockup_indices,
      mockup_images: data.mockup_images || []
    };
    
    console.log('Sending payload:', payload);
    
    // Make API call using fetch
    const response = await fetch(
      `${this.$store.state.root_api}engine/apply-new-mockups-to-product/`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}` // Adjust based on your auth setup
        },
        body: JSON.stringify(payload)
      }
    );
    
    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log('Response:', responseData);
    
    // Handle success response
    if (responseData && responseData.created_images) {
      this.$message.success(`Mockup applied successfully! Created ${responseData.total_created} new product images.`);
      
      // Optionally emit event or update local state
      this.$emit('mockup-applied', {
        productId: data.product.id,
        createdImages: responseData.created_images
      });
      
      return responseData;
    } else {
      this.$message.success('Mockup applied to product successfully!');
      return responseData;
    }
    
  } catch (error) {
    console.error('Error applying mockup:', error);
    
    // Handle different types of errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Network error
      this.$message.error('Network error: Please check your connection');
    } else {
      // Server error or validation error
      this.$message.error(error.message || 'Failed to apply mockup to product');
    }
    
    throw error; // Re-throw for caller to handle if needed
  }
},

    
    updateImages() {
  if (this.product_mockup_images && this.product_mockup_images.images) {
    const imageUrls = Object.values(this.product_mockup_images.image_paths || {})
      .filter(url => url !== null && url !== undefined && url !== ""); // filter invalid
    this.allImages = imageUrls;
    this.images = imageUrls;
  } else {
    this.allImages = [];
    this.images = [];
  }
},

    setImageCount(count) {
      this.images = this.allImages.slice(0, count);
    },
    getImageClass(index) {
      const count = this.images.length;
      // Special classes for 3-image layout
      if (count === 3) {
        return index === 0 ? 'large-image' : 'small-image';
      }
      return '';
    },
    regenerateImages() {
      // Simulate regeneration by shuffling images
      const shuffled = [...this.allImages].sort(() => Math.random() - 0.5);
      this.images = shuffled.slice(0, this.images.length);
    }
  },
  mounted() {
    // Initialize images when component is mounted
    this.updateImages();
  }
}
</script>

<style scoped>
/* Fade transition for image grid */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  z-index: 100;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e9ecef;
  border-top: 3px solid #2a5afc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}

.main-panel {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: min-height 0.3s ease;
  position: relative; /* For loading overlay */
}

.panel-expanded {
  min-height: 90vh; /* Full height when share menu is hidden */
}

.panel-collapsed {
  min-height: calc(100vh - 50px); /* Reduced height when share menu is visible */
}
.image-grid {
  display: grid;
  /* gap: 8px; */
  flex: 1;
  margin-bottom: 32px;
  width: 100%;
  max-width: 900px;
  /* max-height: 300px;   restrict grid height */
  overflow-y: auto;    /* allow scrolling if content exceeds 700px */
  margin-left: auto;
  margin-right: auto;
}

/* Single image - centered, aspect ratio maintained */
.grid-1 {
  grid-template-columns: 1fr;
  max-width: 450px;

  justify-content: center;
}

/* Two images - side by side */
.grid-2 {
  grid-template-columns: 1fr 1fr;
}

/* Three images - one large on left, two stacked on right */
.grid-3 {
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  min-height: 400px;
}

/* Four images - 2x2 grid */
.grid-4 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  max-height: 450px;

}

.image-container {
  position: relative;
  background: #ffffff;
  /* border-radius: 12px; */
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 200px;
  cursor: pointer;
}

.image-container:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Target Ant Design Vue image component structure */
.image-container :deep(.ant-image) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}

.image-container :deep(.ant-image-img) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
}

.image-container :deep(.ant-image img) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
}

/* Fallback for any img tags */
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Special classes for 3-image layout */
.grid-3 .large-image {
  grid-row: 1 / 3;
  min-height: 400px;
}

.grid-3 .small-image {
  min-height: 190px;
}

.regenerate-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  border-top: 1px solid #e9ecef;
}

.regenerate-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 24px;
  color: #495057;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.regenerate-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.regenerate-btn:active {
  transform: translateY(0px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.regenerate-btn svg {
  color: #6c757d;
  transition: transform 0.3s ease;
}

.regenerate-btn:hover svg {
  transform: rotate(180deg);
}

/* Demo controls - remove in production */
.demo-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.demo-btn {
  padding: 8px 16px;
  background: #e9ecef;
  border: none;
  border-radius: 6px;
  color: #495057;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-btn:hover {
  background: #dee2e6;
}

/* Responsive design */
@media (max-width: 768px) {
  .main-panel {
    padding: 16px;
  }
  
  .image-grid {
    gap: 12px;
    max-width: 100%;
    margin-bottom: 24px;
  }
  
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  
  .grid-3 .large-image {
    grid-row: auto;
    min-height: 200px;
  }
  
  .grid-3 .small-image {
    min-height: 200px;
  }
  
  .image-container {
    min-height: 200px;
  }
  
  .demo-controls {
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .main-panel {
    padding: 12px;
  }
  
  .image-grid {
    gap: 8px;
  }
  
  .image-container {
    min-height: 180px;
    border-radius: 8px;
  }
}

/* Loading animation */
.image-container.loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Smooth entrance animation */
.image-container {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.image-container:nth-child(1) { animation-delay: 0.1s; }
.image-container:nth-child(2) { animation-delay: 0.2s; }
.image-container:nth-child(3) { animation-delay: 0.3s; }
.image-container:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>