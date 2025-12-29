
<template>
<a-modal :open="get_businesss_location_map_modal"   @close="get_businesss_location_map_modal=false" >
   <MapLocationSelector 
      @location-confirmed="handleLocationConfirmed"
      @location-cancelled="get_businesss_location_map_modal=false"
    />
    <template #footer>
    </template>
</a-modal>
<!-- {{business_access_recieved }} -->
<!-- {{business_info}} -->
<div
  style="padding:1px; font-family: 'Poppins' !important;"
  v-if="business_access_recieved.read"
>
    
        <div>
<div class="grid grid-cols-12 items-center w-full pb-4">
  <!-- Left Side (20 / 24 → ~ col-span-10) -->
  <div class="col-span-10">
    <h2
  class="text-[16px] leading-[24px] tracking-[0] font-medium"
  style="font-family: 'Poppins';"
>
  {{ isEditing ? 'Edit Site' : 'Manage Store' }}
</h2>

  </div>

  <!-- Right Side (4 / 24 → ~ col-span-2) -->
  <div 
    class="col-span-2 flex justify-end"
    v-if="business_access_recieved.update"
  >
    <!-- If NOT Editing -->
    <button 
      v-if="!isEditing" 
      @click="enableEdit"
      class="bg-blue-600 !text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      style="font-family: 'Poppins';"
    >
      Edit
    </button>

    <!-- If Editing -->
    <div 
      v-else 
      class="flex gap-3"
    >
      <button 
        @click="cancelEdit"
        class="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
        style="font-family: 'Poppins';"
      >
        Cancel
      </button>

      <button 
        @click="saveChanges"
        class="bg-blue-600 !text-white whitespace-nowrap px-4 py-2 rounded-md hover:bg-blue-700 transition"
        style="font-family: 'Poppins';"
      >
        Save Changes
      </button>
    </div>
  </div>
</div>

            
            <div 
        :style="`
    background: linear-gradient(
      rgba(0,0,0,0.3), 
      rgba(0,0,0,0.3)
    ), url(${this.$store.state.root_media_api}${editData.business_picture}) center/cover no-repeat;
    height:200px;
    display:flex;
    justify-content:center;
    align-items:center;
    position: relative;
  `"
  style="font-family: 'Poppins';"
        >
            
<div style="text-align:center; font-family: 'Poppins';">
            <!-- <div>{{business_info.name}}</div> -->
            <div style="position: relative; display: inline-block;">
                <img :src="this.$store.state.root_media_api+editData.banner_picture" style="width:70px;height:70px" alt="">
                <a-button v-if="isEditing" 
                    type="primary" 
                    shape="circle" 
                    size="small" 
                    @click="changeBannerImage"
                    style="position: absolute; top: -5px; right: -5px; z-index: 10;">
                    <template #icon><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></template>
                </a-button>
            </div>
            <div style="font-size:16px;font-weight:700;color:white;font-family: 'Poppins';">Hi Ashish,</div>
             <div style="font-size:16px;font-weight:700;color:white">{{ editData.welcomeMessage }}</div>
        </div>

        <!-- Background image edit button -->
       <a-button 
  v-if="isEditing"
  @click="changeBackgroundImage"
  style="
    position: absolute; 
    top: 10px; 
    right: 10px; 
    z-index: 10;
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 4px;
  "
>
  <template #icon>
    <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.8335 13H9.1665C11.5072 13 12.678 13 13.5187 12.4692C13.8816 12.2403 14.1941 11.9448 14.4382 11.5996C15 10.8052 15 9.69801 15 7.48513C15 5.27224 15 4.16508 14.4382 3.37064C14.1941 3.02541 13.8816 2.72992 13.5187 2.50108C12.9787 2.15947 12.3022 2.03742 11.2665 1.99408C10.7722 1.99408 10.347 1.6402 10.2502 1.18159C10.1763 0.845659 9.9842 0.544614 9.70639 0.329331C9.42857 0.114047 9.08209 -0.00227125 8.7255 3.36055e-05H6.2745C5.5335 3.36055e-05 4.89525 0.494755 4.74975 1.18159C4.653 1.6402 4.22775 1.99408 3.7335 1.99408C2.6985 2.03742 2.022 2.16019 1.48125 2.50108C1.11865 2.73 0.806455 3.02548 0.5625 3.37064C0 4.16508 0 5.27152 0 7.48513C0 9.69873 4.47035e-08 10.8045 0.56175 11.5996C0.80475 11.9434 1.11675 12.2388 1.48125 12.4692C2.322 13 3.49275 13 5.8335 13ZM7.5 4.53052C5.77425 4.53052 4.37475 5.85291 4.37475 7.4844C4.37475 9.1159 5.775 10.4405 7.5 10.4405C9.225 10.4405 10.6252 9.11734 10.6252 7.48585C10.6252 5.85435 9.225 4.53052 7.5 4.53052ZM7.5 5.71207C6.465 5.71207 5.625 6.5058 5.625 7.48513C5.625 8.46373 6.465 9.25745 7.5 9.25745C8.535 9.25745 9.375 8.46373 9.375 7.48513C9.375 6.50652 8.535 5.71207 7.5 5.71207ZM11.0415 5.1213C11.0415 4.79485 11.3212 4.53052 11.667 4.53052H12.4995C12.8445 4.53052 13.125 4.79485 13.125 5.1213C13.1234 5.27939 13.0567 5.43041 12.9396 5.54118C12.8224 5.65196 12.6644 5.71342 12.5002 5.71207H11.667C11.5856 5.71284 11.5049 5.69816 11.4295 5.66888C11.354 5.63961 11.2853 5.5963 11.2272 5.54144C11.1691 5.48658 11.1228 5.42124 11.0909 5.34915C11.0591 5.27707 11.0423 5.19964 11.0415 5.1213Z" fill="white"/>
    </svg>
  </template>
</a-button>


        </div>
        <br>
        <div style="padding:10px;">
            <div style="background: #f3f3f3;;border-radius:10px;padding:10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h1 v-if="!isEditing" style="font-size:18px;font-family: 'Poppins';">{{ editData.storeTitle }}</h1>
                    <a-input v-else 
                        v-model:value="editData.storeTitle" 
                        style="font-size:18px; font-weight: bold; border: 1px dashed #ccc;" 
                        placeholder="Store title" />
                    <a-button v-if="isEditing" 
                        type="text" 
                        @click="editStoreDescription = !editStoreDescription">
                        <template #icon><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></template>
                    </a-button>
                </div>
                <div v-if="!isEditing || !editStoreDescription">{{ editData.storeDescription }}</div>
                <a-textarea v-else 
                    v-model:value="editData.storeDescription" 
                    :rows="4"
                    style="border: 1px dashed #ccc;"
                    placeholder="Store description" />
            </div>
        </div>
        <br>
         <div style="padding:10px;">
            <div style="background: #f3f3f3;;border-radius:10px;padding:10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h1 v-if="!isEditing" style="font-size:16px; font-family: 'Poppins';">{{ editData.servicesTitle }}</h1>
                    <a-input v-else 
                        v-model:value="editData.servicesTitle" 
                        style="font-size:16px; font-weight: bold; border: 1px dashed #ccc; font-family: 'Poppins';" 
                        placeholder="Services title" />
                    <a-button v-if="isEditing" 
                        type="text" 
                        @click="editServices = !editServices">
                        <template #icon><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></template>
                    </a-button>
                </div>
                <div v-if="!isEditing || !editServices">
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
                            <template #icon><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"></polyline><path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path></svg></template>
                        </a-button>
                    </div>
                    <a-button type="dashed" @click="addService" style="width: 100%;">
                        <template #icon>+</template>
                        Add Service
                    </a-button>
                </div>
            </div>
        </div>
        <br>
        <div>
            <a-row>
                <a-col :sm="24" :xs="24" :md="12" :lg="12" style="">
                    <a-row style="padding-top:50px">
                        
                            <a-col :sm="12" :xs="12" :md="12" :lg="12" style="border-right: 2px solid rgba(0,0,0,0.3) ;display: flex;justify-content: center;align-items: center;padding-top:20px">

                                <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;font-family: 'Poppins';">

                                   <h1
  style="
    font-family: Poppins;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    letter-spacing: 0%;
    text-align: center;
  "
>
  4.5
</h1>

                                    <a-rate :value="4"></a-rate>
                                    <h5 className="pt-2">(25 Users)</h5>
                                </div>
                            </a-col>
<a-col 
  :sm="12" 
  :xs="12" 
  :md="12" 
  :lg="12" 
  style="padding:5px; font-family:'Poppins';"
>                                <div style="display: flex;gap:5px;">
                                    5<a-progress :percent="50" size="small" status="active" />
                                </div>
                                                                <div style="display: flex;gap:5px;">
                                4<a-progress :percent="50" size="small" status="active" />
                                                                </div>
                                                                <div style="display: flex;gap:5px;">
                                                                3<a-progress :percent="30" size="small" />
                                                                </div>
                                                                                                <div style="display: flex;gap:5px;">
                                                                2<a-progress :percent="30" size="small" />
                                                                 </div>
                                                                                                 <div style="display: flex;gap:5px;">
                                  1  <a-progress :percent="70" size="small" status="exception" />
                                                                  </div>
                            </a-col>
                    </a-row>
                </a-col>
                
                         
                <a-col :sm="24" :xs="24" :md="12" :lg="12" style="padding:10px;">
                  <!-- shape="circle"  -->
                  <a-button v-if="business_access_recieved.update"
                  type="primary" 
                  size="medium" 
                  @click="get_businesss_location_map_modal=true"
                  style="position: absolute; bottom: 20px; right: 20px; z-index: 5;"
                  >
                  <div style="display:flex;gap:10px;justify-content: center;align-items: center;">
    <EnvironmentOutlined /> <div className="!text-white" style="
  font-family: 'Poppins';
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  color: var(--text-color);
">
  Update Location
</div>

  </div>
  </a-button>
  
  <!-- Display Business Location Map -->
  <div v-if="businessLocationReady" style="border-radius:10px; width:100%; height:200px; overflow: hidden;">
    <MapLocationViewer 
      :latitude="businessLocation.latitude" 
      :longitude="businessLocation.longitude"
      :address="businessLocation.address"
      :readOnly="true"
    />
  </div>
  
  <!-- Loading State -->
  <div v-else style="border-radius:10px; width:100%; height:200px; display: flex; align-items: center; justify-content: center; background: #f0f0f0;">
    <a-spin size="large" />
  </div>
</a-col>
            </a-row>
        </div>
        <br>
        
        
        </div>
        <br>
                <!-- My Products Section -->
<div style="padding:10px;padding-top:0;background-color: white;border-radius:10px;border:2px solid rgba(128, 128, 128, 0.16);">
  <a-row>
    <a-col :span="18" style="padding-top:20px">      
      <b><h2>My Products</h2></b>
      </a-col>
      <a-col :span="6" v-if="access_recieved.product.create">
        <!-- Add Product Button -->
                <div style="margin-top: 20px;">
                    <router-link :to="'/access-business/manage-products?brand='+this.$route.query.brand">
                        <a-button type="primary" style="width: 100%;">
                            <template #icon>+&nbsp;</template>
                            Add More Products
                        </a-button>
                    </router-link>
                </div>
      </a-col>
    </a-row>
    <div style="padding: 10px;">
        <!-- Loading Spinner on First Load -->
        <div v-if="loading && productsPage === 1" style="text-align: center; padding: 40px;">
            <a-spin size="large" />
            <p style="margin-top: 15px; color: #666;">Loading products...</p>
        </div>

        <!-- Empty State (no products and not loading) -->
        <div v-else-if="our_products.length === 0 && !loading && productsPage === 1" style="text-align: center; padding: 60px 20px;">
            <a-empty 
                description="Business product catalogue is empty."
                style="margin: 20px 0;"
            />
            <router-link to="/my-store/manage-products">
                <a-button type="primary">Add Product</a-button>
            </router-link>
        </div>

        <!-- Products Loaded Successfully -->
        <div v-else style="width: 100%;">
            <!-- Debug Info (optional - remove in production) -->
            <div v-if="our_products.length > 0" style="background: #f9f9f9; border: 1px solid #e8e8e8; padding: 12px; margin-bottom: 15px; border-radius: 6px; font-size: 12px; color: #666;">
                <strong>Products Status:</strong> Showing {{ our_products.length }} of {{ totalProducts }} | Page {{ productsPage }} | More Available: {{ hasMoreProducts ? 'Yes' : 'No' }}
            </div>

            <!-- Products Grid Component -->
            <div v-if="our_products.length > 0">
                <buisnes_products_sailing 
                    :products="our_products"
                />
            </div>

            <!-- Fallback - List products if component doesn't render -->
            <div v-else-if="our_products.length === 0" style="text-align: center; padding: 30px;">
                <p style="color: #999;">No products to display on this page</p>
            </div>

            <!-- Load More Section -->
            <div v-if="our_products.length > 0" style="margin-top: 30px; text-align: center;">
                <!-- More Products Button -->
                <transition name="fade">
                    <div v-if="hasMoreProducts" style="margin-bottom: 20px;">
                        <a-button
                            type="primary"
                            size="large"
                            @click="loadMoreProducts"
                            :loading="isLoadingMoreProducts"
                            :disabled="isLoadingMoreProducts"
                            >
                            <!-- style="padding: 12px 50px; border-radius: 8px; font-weight: 600; font-size: 15px;" -->
                            <span v-if="!isLoadingMoreProducts">
                                Show More Products ({{ totalProducts - our_products.length }} remaining)
                            </span>
                            <span v-else>
                                Loading...
                            </span>
                        </a-button>
                    </div>
                </transition>

                <!-- Pagination Info -->
                <div style="color: #888; font-size: 13px; margin-top: 12px; line-height: 1.6;">
                    <p v-if="hasMoreProducts">
                        📊 Showing {{ our_products.length }} of {{ totalProducts }} products
                    </p>
                    <p v-else style="color: #aaa;">
                        ✅ All {{ totalProducts }} products loaded
                    </p>
                </div>

                
            </div>
        </div>
    </div>
</div>
      
        <br>
        <div style="padding:10px;background-color: white;border-radius:10px;border:2px solid rgba(128, 128, 128, 0.16);">
            <div style="padding:10px;background: #f2f2f3;;border-radius:10px">
                <a-row>
                    <a-col :sm="24" :xs="24" :md="20" :lg="20">
                        <h3>User Generated Content</h3> 
                    <p>Toggle on to allow your User generated content to be shown to other users.</p>
                    </a-col>
                    <a-col :sm="24" :xs="24" :md="4" :lg="4" style="display: flex;justify-content: end;">
                          <a-switch v-model:checked="user_generated_content" />
                    </a-col>
                    
                </a-row>
            </div>
   
                 
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="Visualization">
      <template #tab>
        <span>
          <!-- <apple-outlined /> -->
          Community Post Visualizations
        </span>
      </template>
       <!-- <a-col :lg="8" :md="8" :xs="24" :sm="24" style="padding:5px;"> -->
        <!-- {{community_posts_virtualisations}} -->
<div v-if="community_posts_virtualisations.length==0">
    <a-empty description="No Community Posts Available "></a-empty>
</div>
           <a-row v-else >
                <a-col
                  v-for="post in community_posts_virtualisations"
                  :key="post.id"
                  :lg="8"
                  :md="8"
                  :xs="24"
                  :sm="24"
                  >
                  <div style="padding: 2px">
                    <div class="post-card">
                      <!-- Post Image -->
                      <div style="position: relative">
                        <img
                          :src="
                            $store.state.root_media_api + post.post_image ||
                            require('../../../assets/home_main_banner.jpg')
                          "
                          style="
                            width: 100%;
                            height: 200px;
                            object-fit: cover;
                            border-radius: 10px;padding:5px;
                            cursor: pointer;
                          "
                          :alt="post.title"
                          @click="viewPost(post)"
                        />

                        <!-- Tags - Fixed for string array -->
                        <div class="tags-overlay">
                          <template v-if="post.tags && post.tags.length > 0">
                            <a-tag
                              v-for="(tag, index) in post.tags.slice(0, 3)"
                              :key="index"
                              color="blue"
                              style="
                                margin: 2px;
                                border-radius: 12px;
                                font-size: 11px;
                              "
                            >
                              {{ tag }}
                            </a-tag>
                            <a-tag
                              v-if="post.tags.length > 3"
                              style="
                                margin: 2px;
                                border-radius: 12px;
                                font-size: 11px;
                                background: rgba(0, 0, 0, 0.6);
                                color: white;
                                border: none;
                              "
                            >
                              +{{ post.tags.length - 3 }}
                            </a-tag>
                          </template>
                        </div>

                        <!-- View Count Overlay -->
                        <div class="view-count-overlay">
                          <EyeOutlined style="margin-right: 4px" />
                          {{ formatNumber(post.view_count) }}
                        </div>

                        <!-- Pinned Badge -->
                        <div v-if="post.is_pinned" class="pinned-badge">
                          <PushpinOutlined />
                          Pinned
                        </div>
                      </div>

                      <!-- Post Content -->
                      <div style="padding: 5px">
                        <!-- Actions Row -->
                        <a-row style="align-items: center">
                          <a-col :span="14" style="display:flex;gap:10px;">
                            <img
                              :src="
                                this.$store.state.root_media_api + post.user_profile
                              "
                              style="
                                width: 40px;
                                height: 40px;
                                border-radius: 100%;
                                border:1px solid rgba(0,0,0,0.2)
                              "
                              alt=""
                            />
                            <span style="font-size: 16px;font-weight:600">{{
                              truncateText(post.post_by, 15)
                            }}</span>
                          </a-col>
                          <a-col :span="10" style="display: flex">
                            <!-- Post Stats -->
                            <div class="post-stats">
                              <div class="stat-item" @click="toggleLike(post)">
                                <HeartFilled
                                  v-if="post.isLiked"
                                  style="color: #ff4d4f"
                                />
                                <HeartOutlined v-else />
                                <span>{{ formatNumber(post.like_count) }}</span>
                              </div>
                              <div
                                class="stat-item"
                                @click="openCommentsModal(post)"
                              >
                                <MessageOutlined />
                                <span>{{
                                  formatNumber(post.comment_count)
                                }}</span>
                              </div>
                              <div class="stat-item" @click="sharePost(post)">
                                <ShareAltOutlined />
                                <span>{{
                                  formatNumber(post.share_count)
                                }}</span>
                              </div>
                            </div>
                           
                          </a-col>
                        </a-row>
                      </div>
                    </div>
                  </div>
                </a-col>
              </a-row>
        <!-- <div style="border:1px solid rgba(0,0,0,0.1);padding: 5px;border-radius:10px;">

            
            <img src="../../../assets/home_main_banner.jpg" style="width:100%;border-radius:10px" alt="">
            <a-row style="padding-top:5px">
                    <a-col :span="22" >
                        <a-tag>living room </a-tag>
                        <a-tag>modern</a-tag>
                    </a-col>
                    <a-col :span="2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 16 16" fill="#000000" class="bi bi-three-dots-vertical">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                    </a-col>
                </a-row>
                
            </div> -->
        <!-- </a-col> -->
    </a-tab-pane>
    <a-tab-pane key="User generated content">
      <template #tab>
        <span>
          <!-- <android-outlined /> -->
          User generated content
        </span>
      </template>
        User_generated_content_here

    </a-tab-pane>
  </a-tabs>

        </div>

        <!-- Hidden file inputs for image uploads -->
        <input ref="backgroundImageInput" type="file" accept="image/*" style="display: none" @change="handleBackgroundImageChange">
        <input ref="bannerImageInput" type="file" accept="image/*" style="display: none" @change="handleBannerImageChange">
    </div>

    <div v-else style="height:90vh;display:flex;justify-content: center;align-items: center;">
        <a-empty description="You Dont Have Access To Read this page "></a-empty>
    </div>
</template>

<script>


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
        EnvironmentOutlined,

  ArrowLeftOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import MapLocationSelector from '@/components/store/map_business_location.vue'
import MapLocationViewer from '@/components/store/map_location_viewer.vue'

import manage_products from '@/components/store/manage_products.vue'
import buisnes_products_sailing from '@/components/store/products_sailing.vue'

export default {
    name:'manage_sites',
      components:{
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
        EnvironmentOutlined,

        manage_products,
        buisnes_products_sailing,
        MapLocationSelector,
MapLocationViewer
    },
     props:{
        access_recieved:Object
    },
    data(){ return {
        business_access_recieved:this.access_recieved.business,

        
            businessLocation: {
                latitude: 0,
                longitude: 0,
                address: 'Business Location'
            },
            businessLocationReady: false,


        activeKey:'Visualization',
        user_generated_content:false,
        business_info: JSON.parse(localStorage.getItem('business_profile') || '{}'),
        isEditing: false,
        editStoreDescription: false,
        editServices: false,
        originalData: {},
            // Products and pagination states
            our_products:[],
            community_posts_virtualisations:[],

            // Pagination states for products
            productsPage: 1,
            productsPerPage: 10,
            totalProducts: 0,
            totalPagesProducts: 0,
            isLoadingMoreProducts: false,
            hasMoreProducts: false,
            loading: false,
            error: null,
            get_businesss_location_map_modal:false,
        editData: {
            business_picture: '',
            banner_picture: '',
            welcomeMessage: 'Here is What Happening Your Business Today',
            storeTitle: 'Your Lightning Store for perfect design',
            storeDescription: 'Welcome to ALUMA, your go-to lighting store specializing in advanced lighting solutions for homes and businesses. With 14 years of experience in the industry, we offer a wide range of unique and stylish lighting fixtures, along with professional consultation services to bring your design vision to life.',
            servicesTitle: 'what do we offer ?',
            services: [
                'Architectural and Designer Lighting – A selection of modern, classic, and innovative lighting fixtures for every space',
                'Advanced 3D Visualizations – See how your chosen lighting will look in your home with state-of-the-art visualization technology.',
                'Personalized Professional Consultation – Our expert team will help you find the perfect lighting for your needs and design style.',
                'Smart Lighting & Advanced Solutions – Integrating cutting-edge technologies to illuminate your space with style and efficiency'
            ]
        }
    }},
    mounted() {
        // Initialize editData with business_info
        if (this.business_info) {
            this.editData = {
                ...this.editData,
                business_picture: this.business_info.business_picture || this.editData.business_picture,
                banner_picture: this.business_info.banner_picture || this.editData.banner_picture,
                // Add other business_info fields as needed
            }
        }
        this.loadBusinessProfile()
        this.loadBusinessProducts(1); // Load first page
        this.loadPosts();
        this.loadBusinessLocation();
        // this.handleLocationConfirmed();
    },
    methods: {
         // Add this new method to load business location from database
        async loadBusinessLocation() {
            try {
                const token = localStorage.getItem('token')
                const response = await fetch(
                    `${this.$store.state.root_api}access-engine/api/business-site/change-business-profile-location/?access-id=`+this.$route.query.access_id,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )

                const result = await response.json()

                if (result.success && result.data) {
                    const data = result.data
                    console.log(data)
                    // Set business location
                    this.businessLocation = {
                        latitude: data.latitude || 40.7128,
                        longitude: data.longitude || -74.0060,
                        address: data.business_address || `${data.latitude}, ${data.longitude}` || 'Business Location'
                    }
                    
                    this.businessLocationReady = true
                    console.log('Business location loaded:', this.businessLocation)
                }
            } catch (error) {
                console.error('Error loading business location:', error)
                this.businessLocationReady = true // Show map anyway with default location
            }
        },

     async handleLocationConfirmed(locationData) {
            console.log('Location Confirmed:', locationData)
            
            // Update business location
            this.businessLocation = {
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                address: locationData.address,
            }
            
            // Close modal
            this.get_businesss_location_map_modal = false
            
            try {
                const token = localStorage.getItem('token')
                const response = await fetch(
                    `${this.$store.state.root_api}access-engine/api/business-site/change-business-profile-location/?access-id=`+this.$route.query.access_id,
                    {
                        method: 'POST',
                        body:JSON.stringify(this.businessLocation),
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )

                const result = await response.json()

                if (result.success && result.data) {
                    const data = result.data
                    
                    // Set business location
                    this.businessLocation = {
                        latitude: data.latitude || 40.7128,
                        longitude: data.longitude || -74.0060,
                        address: data.business_address || `${data.latitude}, ${data.longitude}` || 'Business Location'
                    }
                    
                    this.businessLocationReady = true
                    console.log('Business location loaded:', this.businessLocation)
                }
            } catch (error) {
                console.error('Error loading business location:', error)
                this.businessLocationReady = true // Show map anyway with default location
            }

            // Show success message
            this.$message.success('Business location updated successfully!')
        },
        // Utility methods
        formatNumber(num) {
            if (!num || num === 0) return "0";
            if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
            if (num >= 1000) return (num / 1000).toFixed(1) + "K";
            return num.toString();
        },

        formatDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) return "Yesterday";
            if (diffDays <= 7) return `${diffDays} days ago`;
            if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
            return date.toLocaleDateString();
        },

        truncateText(text, length) {
            if (!text || text.length <= length) return text;
            return text.substring(0, length) + "...";
        },
        async loadPosts() {
            try {
                const response = await fetch(
                    // `${this.$store.state.root_api}community/api/my-posts/`,
                    `${this.$store.state.root_api}access-engine/api/business-community-posts/business-posts/?access-id=`+this.$route.query.access_id,
                                        {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await response.json();

                if (data.success) {
                    this.community_posts_virtualisations = data.data.map((post) => ({
                        ...post,
                        isLiked: false,
                        tags: post.tags || [],
                        like_count: post.like_count || 0,
                        comment_count: post.comment_count || 0,
                        share_count: post.share_count || 0,
                        view_count: post.view_count || 0,
                    }));

                    this.hasMore = false;
                } else {
                    throw new Error(data.message || "Failed to load posts");
                }
            } catch (error) {
                console.error("Failed to load posts:", error);
                this.$message.error("Failed to load posts");
            } finally {
                this.loading = false;
            }
        },

        async loadBusinessProducts(pageNumber = 1) {
            try {
                if (pageNumber === 1) {
                    this.loading = true;
                    this.error = null;
                    this.our_products = [];
                } else {
                    this.isLoadingMoreProducts = true;
                }

                const businessName = this.business_info.slug;
                const token = localStorage.getItem('token');

                const response = await fetch(
                    `${this.$store.state.root_api}Auth/api/business/products-sold/${businessName}?page=${pageNumber}&page_size=10&access-id=${this.$route.query.access_id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const result = await response.json();
                console.log('Products API Response:', result);

                // Extract products data
                let productsData = [];
                let totalCount = 0;
                let hasNextPage = false;

                // Check for nested results with success/data structure (YOUR API FORMAT)
                if (result.results && result.results.data && Array.isArray(result.results.data)) {
                    console.log('✅ Using nested Django REST + success format');
                    productsData = result.results.data;
                    totalCount = result.count || 0;
                    hasNextPage = result.next !== null && result.next !== undefined;
                }
                // Check Django REST Pagination format (results as array)
                else if (result.results && Array.isArray(result.results)) {
                    console.log('✅ Using Django REST format');
                    productsData = result.results;
                    totalCount = result.count || 0;
                    hasNextPage = result.next !== null && result.next !== undefined;
                } 
                // Fallback to success + data format
                else if (result.success && result.data && Array.isArray(result.data)) {
                    console.log('✅ Using success + data format');
                    productsData = result.data;
                    totalCount = result.total || result.data.length;
                    hasNextPage = false;
                }
                // Direct array in data
                else if (Array.isArray(result.data)) {
                    console.log('✅ Using direct data array format');
                    productsData = result.data;
                    totalCount = result.data.length;
                    hasNextPage = false;
                }
                // Direct array response
                else if (Array.isArray(result)) {
                    console.log('✅ Using direct array format');
                    productsData = result;
                    totalCount = result.length;
                    hasNextPage = false;
                }

                console.log('Extracted data:', { 
                    productsCount: productsData.length, 
                    totalCount, 
                    hasNextPage,
                    currentPage: pageNumber 
                });

                if (productsData.length > 0) {
                    // Append products to existing list
                    if (pageNumber === 1) {
                        this.our_products = productsData;
                    } else {
                        this.our_products = [...this.our_products, ...productsData];
                    }

                    // Update pagination state
                    this.totalProducts = totalCount;
                    this.totalPagesProducts = Math.ceil(totalCount / 10);
                    this.productsPage = pageNumber;

                    // Determine if there are more products
                    if (hasNextPage) {
                        this.hasMoreProducts = true;
                    } else if (productsData.length < 10) {
                        this.hasMoreProducts = false;
                    } else {
                        this.hasMoreProducts = true;
                    }

                    console.log('✅ Products loaded:', {
                        displayed: this.our_products.length,
                        total: this.totalProducts,
                        hasMore: this.hasMoreProducts
                    });

                } else {
                    console.warn('⚠️ No products in response');
                    if (pageNumber === 1) {
                        this.our_products = [];
                        this.totalProducts = 0;
                        this.hasMoreProducts = false;
                    }
                }

            } catch (error) {
                console.error('❌ Error loading products:', error);
                if (pageNumber === 1) {
                    this.error = `Failed to load products: ${error.message}`;
                    this.our_products = [];
                    this.totalProducts = 0;
                }
                this.hasMoreProducts = false;

            } finally {
                this.loading = false;
                this.isLoadingMoreProducts = false;
            }
        },

        async loadMoreProducts() {
            console.log('Load More clicked:', {
                isLoading: this.isLoadingMoreProducts,
                hasMore: this.hasMoreProducts,
                currentPage: this.productsPage
            });

            if (!this.isLoadingMoreProducts && this.hasMoreProducts) {
                await this.loadBusinessProducts(this.productsPage + 1);
            } else {
                console.warn('⚠️ Cannot load more - isLoading:', this.isLoadingMoreProducts, 'hasMore:', this.hasMoreProducts);
            }
        },

    async saveChanges() {
        try {
            // Prepare data for API
            const payload = {
                storeTitle: this.editData.storeTitle,
                storeDescription: this.editData.storeDescription,
                welcomeMessage: this.editData.welcomeMessage,
                services: this.editData.services,
                business_picture: this.editData.business_picture,
                banner_picture: this.editData.banner_picture
            };

            // Get auth token from localStorage
            const token = localStorage.getItem('token');

            const response = await fetch(`${this.$store.state.root_api}access-engine/api/business-site/business-profile/?access-id=`+this.$route.query.access_id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                this.$message.success('Changes saved successfully!');
                this.isEditing = false;
                this.editStoreDescription = false;
                this.editServices = false;
                
                // Update localStorage
                const updatedBusinessInfo = {
                    ...this.business_info,
                    ...payload
                };
                localStorage.setItem('business_profile', JSON.stringify(updatedBusinessInfo));
                this.business_info = updatedBusinessInfo;
                
            } else {
                this.$message.error(result.message || 'Failed to save changes');
            }
            
        } catch (error) {
            this.$message.error('Network error. Please try again.');
            console.error('Error saving changes:', error);
        }
    },

    async loadBusinessProfile() {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${this.$store.state.root_api}access-engine/api/business-site/business-profile/?access-id=`+this.$route.query.access_id, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                const data = result.data;
                console.log(data)
                this.editData = {
                    ...this.editData,
                    business_picture: data.business_picture || this.editData.business_picture,
                    banner_picture: data.banner_picture || this.editData.banner_picture,
                    welcomeMessage: data.description || this.editData.welcomeMessage,
                    storeTitle: data.buisness_info_title || this.editData.storeTitle,
                    storeDescription: data.buisness_info || this.editData.storeDescription,
                    services: data.services_offered || this.editData.services
                };

                // Update localStorage
                localStorage.setItem('business_profile', JSON.stringify(data));
                this.business_info = data;
            }
            
        } catch (error) {
            console.error('Error loading business profile:', error);
        }
    },

        enableEdit() {
            this.isEditing = true;
            // Create a deep copy of current data for restoration if needed
            this.originalData = JSON.parse(JSON.stringify(this.editData));
        },
        
        cancelEdit() {
            this.isEditing = false;
            this.editStoreDescription = false;
            this.editServices = false;
            // Restore original data
            this.editData = JSON.parse(JSON.stringify(this.originalData));
        },
        
        // async saveChanges() {
        //     try {
        //         // Here you would typically make an API call to save the data
        //         // For now, we'll just update localStorage and show success message
                
        //         // Update business_info with new data
        //         const updatedBusinessInfo = {
        //             ...this.business_info,
        //             business_picture: this.editData.business_picture,
        //             banner_picture: this.editData.banner_picture,
        //             // Add other fields as needed
        //         };
                
        //         localStorage.setItem('business_profile', JSON.stringify(updatedBusinessInfo));
        //         this.business_info = updatedBusinessInfo;
                
        //         // You can add your API call here
        //         // await this.updateBusinessProfile(this.editData);
                
        //         this.$message.success('Changes saved successfully!');
        //         this.isEditing = false;
        //         this.editStoreDescription = false;
        //         this.editServices = false;
                
        //     } catch (error) {
        //         this.$message.error('Failed to save changes. Please try again.');
        //         console.error('Error saving changes:', error);
        //     }
        // },
        
        changeBackgroundImage() {
            this.$refs.backgroundImageInput.click();
        },
        
        changeBannerImage() {
            this.$refs.bannerImageInput.click();
        },
        
        handleBackgroundImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.editData.business_picture = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        
        handleBannerImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.editData.banner_picture = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        
        addService() {
            this.editData.services.push('');
        },
        
        removeService(index) {
            this.editData.services.splice(index, 1);
        }
    }
}
</script>

<style scoped>

.post-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0px;
  border-radius: 12px;
  background: white;
  /* transition: all 0.3s ease; */
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* transform: translateY(-2px); */
}

/* Fixed tags overlay positioning */
.tags-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 70%;
  z-index: 2;
}

.view-count-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  z-index: 2;
}

.pinned-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #1890ff;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 2;
}

.post-stats {
  display: flex;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 16px;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: #666;
}

.stat-item:hover {
  background-color: #f5f5f5;
}

.stat-item.large {
  padding: 8px 16px;
  font-size: 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  margin: 0 8px 8px 0;
}

.stat-item.large:hover {
  background-color: #e9ecef;
}

.stat-item span {
  font-size: 13px;
  font-weight: 500;
}

.stat-item.large span {
  font-size: 14px;
  font-weight: 600;
}

/* Post Detail Modal Styles */

.post-image-container {
  position: relative;
  margin-bottom: 16px;
}

.post-detail-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 12px;
}

.post-detail-tags {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 60%;
}

.post-detail-actions {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 6px;
  padding: 0px 0;
  border-bottom: 1px solid #f0f0f0;
}

.post-description {
  padding: 0 0 20px 0;
}

.post-description h3 {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
  line-height: 1.3;
}

.post-description p {
  font-size: 16px;
  color: #595959;
  line-height: 1.6;
  margin-bottom: 16px;
}

.post-meta {
  font-size: 14px;
  color: #8c8c8c;
}

/* Comments Section */
.comments-section {
  height: 100%;
  /* max-height: 600px;
    overflow-y: auto; */
  padding: 0 16px;
}

.comments-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.add-comment {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.comments-list {
  space: 16px;
}

.comment-item {
  display: flex;
  margin-bottom: 16px;
  padding: 12px;
  background: #f2f2f2;
  /* border-radius: 12px; */
  /* border-left: 3px solid #1890ff; */
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.comment-author {
  font-weight: 600;
  font-size: 14px;
  color: #262626;
}

.comment-date {
  font-size: 12px;
  color: #8c8c8c;
}

.comment-text {
  font-size: 14px;
  color: #595959;
  line-height: 1.5;
  margin: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .main {
    padding: 12px;
    margin-top: 5px;
  }

  .post-card {
    padding: 10px;
  }

  .post-stats {
    gap: 12px;
  }

  .tags-overlay {
    max-width: 60%;
  }

  .post-detail-tags {
    max-width: 50%;
  }

  .post-detail-actions {
    justify-content: center;
  }

  .stat-item.large {
    padding: 6px 12px;
    font-size: 14px;
    margin: 0 4px 8px 0;
  }

  .comments-section {
    padding: 0 8px;
    margin-top: 20px;
  }

  .post-description h3 {
    font-size: 20px;
  }

  .post-description p {
    font-size: 14px;
  }
}

/* Custom scrollbar for comments */
.comments-section::-webkit-scrollbar {
  width: 6px;
}

.comments-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.comments-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.comments-section::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation for post cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-card {
  animation: fadeInUp 0.6s ease-out;
}

/* Loading states */
.ant-spin-container {
  transition: opacity 0.3s;
}

.ant-spin-blur {
  opacity: 0.5;
  pointer-events: none;
}

/* Tags styling improvements */
.ant-tag {
  font-size: 11px !important;
  padding: 2px 8px !important;
  border-radius: 12px !important;
  border: none !important;
  font-weight: 500 !important;
}

/* Modal improvements */
.ant-modal-content {
  border-radius: 16px;
  overflow: hidden;
}

.ant-modal-header {
  border-radius: 16px 16px 0 0;
  border-bottom: 1px solid #f0f0f0;
}

.ant-modal-body {
  padding: 0;
}

/* Improved hover effects */
.post-card img {
  transition: transform 0.3s ease;
}

.post-card:hover img {
  transform: scale(1.01);
}

/* Better button styling */

.head-section {
  display: flex;
  justify-content: space-between;
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
    width: 33.33%;
    flex: 0 0 33.33%;
  }
}
</style>