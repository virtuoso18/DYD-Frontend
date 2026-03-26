<template>
<a-modal :open="get_businesss_location_map_modal"   @close="get_businesss_location_map_modal=false" >
   <MapLocationSelector 
      @location-confirmed="handleLocationConfirmed"
      @location-cancelled="get_businesss_location_map_modal=false"
    />
    <template #footer>
    </template>
</a-modal>
<!-- {{business_info}} -->
    <div >
    
        <div style="background-color: white;border-radius:10px; ">
<a-row>
    <a-col :span="20">
      
<h2
              class="m-0 text-lg whitespace-nowrap px-2 lg:text-2xl font-semibold"

>
  {{ isEditing ? 'Edit Site' : 'Manage Store' }}
</h2>
    
    </a-col>
    <a-col :span="4" style="display: flex;justify-content: end;"> 
        <a-button v-if="!isEditing" type="primary" @click="enableEdit">Edit</a-button>
        <div v-else style="display: flex; gap: 10px;">
            <a-button @click="cancelEdit">Cancel</a-button>
            <a-button type="primary" @click="saveChanges">Save Changes</a-button>
        </div>
    </a-col>
</a-row>
            
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
        >
            
        <div style="text-align:center">
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
            <div style="font-size:16px;font-weight:700;color:white">Hi Ashish,</div>
             <div style="font-size:16px;font-weight:700;color:white">{{ editData.welcomeMessage }}</div>
        </div>

        <!-- Background image edit button -->
        <a-button v-if="isEditing" 
            type="primary" 
            @click="changeBackgroundImage"
            style="position: absolute; top: 10px; right: 10px; z-index: 10;">
            <template #icon><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></template>
        </a-button>

        </div>
        <br>
        <div style="padding:10px;">
            <div class="!text-gray-700" style="background: #f3f3f3;;border-radius:10px;padding:10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h1 v-if="!isEditing" style="font-size:18px">{{ editData.storeTitle }}</h1>
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
         <div class="!text-gray-700"  style="padding:10px;">
            <div style="background: #f3f3f3;;border-radius:10px;padding:10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h1 v-if="!isEditing" style="font-size:16px">{{ editData.servicesTitle }}</h1>
                    <a-input v-else 
                        v-model:value="editData.servicesTitle" 
                        style="font-size:16px; font-weight: bold; border: 1px dashed #ccc;" 
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
                <div v-if="!loadingRatings" style="display: flex;flex-direction: column;justify-content: center;align-items: center">
                    <h1>
                        {{ businessRatings.average }}
                    </h1>
                    <a-rate :value="Math.round(businessRatings.average)" disabled></a-rate>
                    <h5>({{ businessRatings.unique_users }} {{ businessRatings.unique_users === 1 ? 'User' : 'Users' }})</h5>
                </div>
                
                <!-- Loading state -->
                <div v-else style="display: flex;flex-direction: column;justify-content: center;align-items: center">
                    <a-spin size="large" />
                    <p style="margin-top: 10px; color: #666;">Loading ratings...</p>
                </div>
            </a-col>

            <!-- Rating Distribution -->
            <a-col :sm="12" :xs="12" :md="12" :lg="12" style="padding:5px">
                <!-- 5 Star -->
                <div style="display: flex;gap:5px; align-items: center; margin-bottom: 8px;">
                    <span style="min-width: 20px; text-align: right;">5</span>
                    <a-progress 
                        :percent="calculatePercentage(businessRatings.distribution['5_star'])" 
                        size="small" 
                        :status="businessRatings.distribution['5_star'] > 0 ? 'active' : 'normal'"
                        style="flex: 1;"
                    />
                    <span style="min-width: 30px; text-align: right; font-size: 12px; color: #666;">
                        {{ businessRatings.distribution['5_star'] }}
                    </span>
                </div>

                <!-- 4 Star -->
                <div style="display: flex;gap:5px; align-items: center; margin-bottom: 8px;">
                    <span style="min-width: 20px; text-align: right;">4</span>
                    <a-progress 
                        :percent="calculatePercentage(businessRatings.distribution['4_star'])" 
                        size="small"
                        :status="businessRatings.distribution['4_star'] > 0 ? 'active' : 'normal'"
                        style="flex: 1;"
                    />
                    <span style="min-width: 30px; text-align: right; font-size: 12px; color: #666;">
                        {{ businessRatings.distribution['4_star'] }}
                    </span>
                </div>

                <!-- 3 Star -->
                <div style="display: flex;gap:5px; align-items: center; margin-bottom: 8px;">
                    <span style="min-width: 20px; text-align: right;">3</span>
                    <a-progress 
                        :percent="calculatePercentage(businessRatings.distribution['3_star'])" 
                        size="small"
                        style="flex: 1;"
                    />
                    <span style="min-width: 30px; text-align: right; font-size: 12px; color: #666;">
                        {{ businessRatings.distribution['3_star'] }}
                    </span>
                </div>

                <!-- 2 Star -->
                <div style="display: flex;gap:5px; align-items: center; margin-bottom: 8px;">
                    <span style="min-width: 20px; text-align: right;">2</span>
                    <a-progress 
                        :percent="calculatePercentage(businessRatings.distribution['2_star'])" 
                        size="small"
                        style="flex: 1;"
                    />
                    <span style="min-width: 30px; text-align: right; font-size: 12px; color: #666;">
                        {{ businessRatings.distribution['2_star'] }}
                    </span>
                </div>

                <!-- 1 Star -->
                <div style="display: flex;gap:5px; align-items: center;">
                    <span style="min-width: 20px; text-align: right;">1</span>
                    <a-progress 
                        :percent="calculatePercentage(businessRatings.distribution['1_star'])" 
                        size="small" 
                        :status="businessRatings.distribution['1_star'] > 0 ? 'exception' : 'normal'"
                        style="flex: 1;"
                    />
                    <span style="min-width: 30px; text-align: right; font-size: 12px; color: #666;">
                        {{ businessRatings.distribution['1_star'] }}
                    </span>
                </div>
            </a-col>
        </a-row>
    </a-col>
                
               
                
               
<a-col :sm="24" :xs="24" :md="12" :lg="12" style="padding:10px;">
  <!-- shape="circle"  -->
  <a-button 
    type="primary" 
    size="medium" 
    @click="get_businesss_location_map_modal=true"
    style="position: absolute; bottom: 20px; right: 20px; z-index: 5;"
  >
  <div style="display:flex;gap:10px;justify-content: center;align-items: center;">

    <EnvironmentOutlined /> <div>Update Location</div>
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
<div class="!text-gray-700"  style="padding:10px;padding-top:0;background-color: white;border-radius:10px;border:2px solid rgba(128, 128, 128, 0.16);">
  <a-row>
    <a-col :span="18" style="padding-top:20px">      
      <b><h2>My Products</h2></b>
      <!-- {{ business_info }} -->
      </a-col>
      <a-col :span="6">
        <!-- Add Product Button -->
                <div style="margin-top: 20px;">
                                        <router-link :to="'/access-business/manage-products?access_id='+this.$route.query.access_id+'&&brand='+this.$route.query.brand">

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
        <div class="!text-gray-700"  v-else style="width: 100%;">
            <!-- Debug Info (optional - remove in production) -->
            <div v-if="our_products.length > 0" style="background: #f9f9f9; border: 1px solid #e8e8e8; padding: 12px; margin-bottom: 15px; border-radius: 6px; font-size: 12px; color: #666;">
                <strong>Products Status:</strong> Showing {{ our_products.length }} of {{ totalProducts }} | Page {{ productsPage }} | More Available: {{ hasMoreProducts ? 'Yes' : 'No' }}
            </div>

            <!-- Products Grid Component -->
            <div v-if="our_products.length > 0">
              <!-- hello world -->
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
            <!-- <div style="padding:10px;background: #f2f2f3;;border-radius:10px">
                <a-row>
                    <a-col :sm="24" :xs="24" :md="20" :lg="20">
                        <h3>User Generated Content</h3> 
                    <p>Toggle on to allow your User generated content to be shown to other users.</p>
                    </a-col>
                    <a-col :sm="24" :xs="24" :md="4" :lg="4" style="display: flex;justify-content: end;">
                          <a-switch v-model:checked="user_generated_content" />
                    </a-col>
                    
                </a-row>
            </div> -->
            
            <div>
               <!-- <a-col :lg="8" :md="8" :xs="24" :sm="24" style="padding:5px;"> -->
        <!-- {{community_posts_virtualisations}} -->
         <h3> Community Post Visualizations</h3>
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
                    <div class="post-card" @click="openCommentsModal(post)">
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
                              <div class="stat-item" >
                                <HeartFilled
                                  v-if="post.is_liked"
                                  style="color: #ff4d4f"
                                />
                                <HeartOutlined v-else />
                                <span>{{ formatNumber(post.like_count) }}</span>
                              </div>
                              <div
                                class="stat-item"
                              
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
                            <!-- More Actions Dropdown -->
                            
                          </a-col>
                        </a-row>
                      </div>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
 

        </div>

        <!-- Hidden file inputs for image uploads -->
        <input ref="backgroundImageInput" type="file" accept="image/*" style="display: none" @change="handleBackgroundImageChange">
        <input ref="bannerImageInput" type="file" accept="image/*" style="display: none" @change="handleBannerImageChange">
    </div>
    <CommentsModal 
    :isOpen="showCommentsModal" 
    :post="selectedPost"
    @close="showCommentsModal = false"
    @commentAdded="onCommentAdded"
    @likeToggled="onLikeToggled"
/>
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
  ArrowLeftOutlined,
  EnvironmentOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";

import manage_products from '@/components/store/manage_products.vue'
import buisnes_products_sailing from '@/components/store/products_sailing.vue'
import MapLocationSelector from '@/components/store/map_business_location.vue'
import MapLocationViewer from '@/components/store/map_location_viewer.vue'
import CommentsModal from "@/views/pages/CommentsModal.vue";
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
        EnvironmentOutlined,
        CloseOutlined,
        manage_products,
        buisnes_products_sailing,
        MapLocationSelector,
        MapLocationViewer,
        CommentsModal,
    },
    data(){ 
        return {
           businessRatings: {
             average: 0,
             unique_users: 0,
             total_ratings: 0,
             distribution: {
                  '1_star': 0,
                  '2_star': 0,
                  '3_star': 0,
                  '4_star': 0,
                  '5_star': 0
              },
              ratings: []
            },
            loadingRatings: false,
            ratingsError: null,
    
            showCommentsModal: false,
            selectedPost: null,
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
            
            businessLocation: {
                latitude: 0,
                longitude: 0,
                address: 'Business Location'
            },
            businessLocationReady: false,


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
        }
    },
    mounted() {
      // Initialize editData with business_info
      this.loadBusinessProfile();
       
        

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
                address: locationData.address
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
                
                console.log('data---->',data)

                if (data.success) {
                    this.community_posts_virtualisations = data.data.map((post) => ({
                        ...post,
                        // is_liked: false,
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
                console.log("=============================")
                console.log(this.business_info?.slug)
                const businessName = this.business_info?.slug;
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
                const payload = {
                    storeTitle: this.editData.storeTitle,
                    storeDescription: this.editData.storeDescription,
                    welcomeMessage: this.editData.welcomeMessage,
                    services: this.editData.services,
                    business_picture: this.editData.business_picture,
                    banner_picture: this.editData.banner_picture
                };

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
                    console.log(data);
                    this.editData = {
                        ...this.editData,
                        business_picture: data.business_picture || this.editData.business_picture,
                        banner_picture: data.banner_picture || this.editData.banner_picture,
                        welcomeMessage: data.description || this.editData.welcomeMessage,
                        storeTitle: data.buisness_info_title || this.editData.storeTitle,
                        storeDescription: data.buisness_info || this.editData.storeDescription,
                        services: data.services_offered || this.editData.services
                    };

                    localStorage.setItem('business_profile', JSON.stringify(data));
                    this.business_info = data;

                     if (this.business_info) {
                          this.editData = {
                              ...this.editData,
                              business_picture: this.business_info.business_picture || this.editData.business_picture,
                              banner_picture: this.business_info.banner_picture || this.editData.banner_picture,
                          }
                          this.loadBusinessProducts(1); // Load first page
                          this.loadPosts();
                          this.loadBusinessLocation();
                          this.loadBusinessRatings();
                      }
                }
                
            } catch (error) {
                console.error('Error loading business profile:', error);
            }
        },

        enableEdit() {
            this.isEditing = true;
            this.originalData = JSON.parse(JSON.stringify(this.editData));
        },
        
        cancelEdit() {
            this.isEditing = false;
            this.editStoreDescription = false;
            this.editServices = false;
            this.editData = JSON.parse(JSON.stringify(this.originalData));
        },
        
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
        },
        
    async loadBusinessRatings() {
        try {
            this.loadingRatings = true;
            this.ratingsError = null;
            
            const token = localStorage.getItem('token');
            const businessSlug = this.business_info?.slug; // Use existing business slug
            
            const response = await fetch(
                `${this.$store.state.root_api}room/api/business-ratings/?business_slug=${businessSlug}`,
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
            
            if (result.success && result.data) {
                this.businessRatings = {
                    average: result.data.statistics.average || 0,
                    unique_users: result.data.statistics.unique_users || 0,
                    total_ratings: result.data.statistics.total_ratings || 0,
                    distribution: result.data.statistics.distribution || {
                        '1_star': 0,
                        '2_star': 0,
                        '3_star': 0,
                        '4_star': 0,
                        '5_star': 0
                    },
                    ratings: result.data.ratings || []
                };
                
                console.log('✅ Business ratings loaded:', this.businessRatings);
            } else {
                throw new Error(result.message || 'Failed to fetch ratings');
            }
            
        } catch (error) {
            console.error('❌ Error loading business ratings:', error);
            this.ratingsError = error.message;
            // Set default values on error
            this.businessRatings = {
                average: 0,
                unique_users: 0,
                total_ratings: 0,
                distribution: {
                    '1_star': 0,
                    '2_star': 0,
                    '3_star': 0,
                    '4_star': 0,
                    '5_star': 0
                },
                ratings: []
            };
        } finally {
            this.loadingRatings = false;
        }
    },
            async openCommentsModal(post) {
        this.selectedPost = { 
            ...post,
            userName: post.post_by,
            userAvatar: this.$store.state.root_media_api + post.user_profile,
            image: this.$store.state.root_media_api + post.post_image,
            views: post.view_count,
            likes: post.like_count,
            comments: post.comment_count,
            title: post.title || 'Post',
            content: post.content || post.description || 'No description available.',
            description: post.content || post.description || 'No description available.',
            tags: post.tags || [],
            created_at: post.created_at || new Date().toISOString(),
            is_liked: post.is_liked || false,
            id: post.id
        };
        
        this.showCommentsModal = true;
        
        // Load comments for this post
        await this.loadModalComments(post.id);
    },
    
    // Load comments for modal
    async loadModalComments(postId, page = 1) {
        try {
            this.loadingModalComments = true;
            const response = await fetch(
                `${this.$store.state.root_api}community/api/comments/?post_id=${postId}&page=${page}`,
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
                if (page === 1) {
                    this.modalComments = data.data;
                } else {
                    this.modalComments.push(...data.data);
                }
                this.hasMoreModalComments = page < data.total_pages;
                this.modalCommentsPage = page;
            }
        } catch (error) {
            console.error("Failed to load comments:", error);
            this.$message.error("Failed to load comments");
        } finally {
            this.loadingModalComments = false;
        }
    },
    
    // Calculate percentage for progress bars
    calculatePercentage(count) {
        if (this.businessRatings.total_ratings === 0) return 0;
        return Math.round((count / this.businessRatings.total_ratings) * 100);
    },
    // Load more comments in modal
    async loadMoreModalComments() {
        if (this.selectedPost && this.hasMoreModalComments) {
            await this.loadModalComments(this.selectedPost.id, this.modalCommentsPage + 1);
        }
    },
    
    // Add comment in modal
    async addModalComment() {
        if (!this.newModalComment.trim() || !this.selectedPost) return;

        try {
            this.addingModalComment = true;
            const response = await fetch(
                `${this.$store.state.root_api}community/api/comments/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        post_id: this.selectedPost.id,
                        content: this.newModalComment.trim(),
                    }),
                }
            );

            const data = await response.json();
            if (data.success) {
                // Clear input
                this.newModalComment = "";

                // Reload comments
                await this.loadModalComments(this.selectedPost.id);

                // Update comment count in the main list
                this.selectedPost.comments += 1;
                const postIndex = this.community_posts_virtualisations.findIndex(
                    (p) => p.id === this.selectedPost.id
                );
                if (postIndex !== -1) {
                    this.community_posts_virtualisations[postIndex].comment_count = this.selectedPost.comments;
                }

                this.$message.success("Comment added successfully!");
            }
        } catch (error) {
            console.error("Failed to add comment:", error);
            this.$message.error("Failed to add comment");
        } finally {
            this.addingModalComment = false;
        }
    },
    
    // Handle comment added event
    onCommentAdded() {
        this.loadPosts(); // Reload posts to update comment counts
    },
    
    // Handle like toggled event
    onLikeToggled() {
        this.loadPosts(); // Reload posts to update like counts
    },
    
    // Update your existing toggleLike method to work with the modal
    async toggleLike(post) {
        try {
            const response = await fetch(
                `${this.$store.state.root_api}community/api/posts/like/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        post_id: post.id,
                    }),
                }
            );

            const data = await response.json();
            if (data.success) {
                post.is_liked = data.data.action === 'liked';
                post.like_count = data.data.like_count;
                
                // If this is the currently selected post in modal, update it too
                if (this.selectedPost && this.selectedPost.id === post.id) {
                    this.selectedPost.is_liked = post.is_liked;
                    this.selectedPost.likes = post.like_count;
                }
                
                this.$message.success(post.is_liked ? "Post liked!" : "Post unliked!");
            }
        } catch (error) {
            console.error("Failed to toggle like:", error);
            this.$message.error("Failed to update like");
        }
    },
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