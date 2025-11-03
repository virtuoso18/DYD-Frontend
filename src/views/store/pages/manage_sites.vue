<template>
    <!-- {{business_info}} -->
    <div style=" padding:10px">
    
        <div style="background-color: white; padding:10px;border-radius:10px; border:2px solid rgba(128, 128, 128, 0.16); ">
<a-row>
    <a-col :span="20"> <h2>{{ isEditing ? 'Edit Site' : 'Manage Store' }}</h2></a-col>
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
            <div style="background: #f3f3f3;;border-radius:10px;padding:10px;">
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
         <div style="padding:10px;">
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

                                <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">

                                    <h1>
                                        4.5
                                    </h1>
                                    <a-rate :value="4"></a-rate>
                                    <h5>(25 Users)</h5>
                                </div>
                            </a-col>
                            <a-col :sm="12" :xs="12" :md="12" :lg="12" style="padding:5px">
                                <div style="display: flex;gap:5px;">
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
                    <img style="border-radius:10px;width:100%;height:200px;object-fit:cover" src="https://developers.google.com/static/maps/images/landing/hero_maps_static_api.png" alt="">
                </a-col>
            </a-row>
        </div>
        <br>
        
        
        </div>
<br>
        <div style="padding:10px;background-color: white;border-radius:10px;border:2px solid rgba(128, 128, 128, 0.16);">
            <h1>My Products</h1>
             <div v-if="our_products.length==0" style="text-align: center;">

    <a-empty description="Business product catalogue is empty."></a-empty>
    <router-link to="/my-store/manage-products">
        <a-button type="primary">Add Product</a-button>
    </router-link>
</div>
              <buisnes_products_sailing :products="our_products" v-else/> 
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
                          <a-col :span="14">
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
                            <!-- More Actions Dropdown -->
                            <a-dropdown
                              :trigger="['click']"
                              placement="bottomRight"
                            >
                              <a-button
                                type="text"
                                size="small"
                                style="padding: 2px"
                              >
                                <MoreOutlined
                                  style="font-size: 16px; color: #666"
                                />
                              </a-button>
                              <template #overlay>
                                <a-menu>
                                  <a-menu-item @click="editPost(post)">
                                    <EditOutlined style="margin-right: 8px" />
                                    Edit Post
                                  </a-menu-item>
                                  <a-menu-item @click="sharePost(post)">
                                    <ShareAltOutlined
                                      style="margin-right: 8px"
                                    />
                                    Share
                                  </a-menu-item>
                                  <a-menu-divider />
                                  <a-menu-item
                                    @click="confirmDelete(post)"
                                    style="color: #ff4d4f"
                                  >
                                    <DeleteOutlined style="margin-right: 8px" />
                                    Delete Post
                                  </a-menu-item>
                                </a-menu>
                              </template>
                            </a-dropdown>
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
  CloseOutlined,
} from "@ant-design/icons-vue";

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
        manage_products,
                 buisnes_products_sailing,
    },
    data(){ return {
        activeKey:'Visualization',
        user_generated_content:false,
        business_info: JSON.parse(localStorage.getItem('business_profile') || '{}'),
        isEditing: false,
        editStoreDescription: false,
        editServices: false,
        originalData: {},
        our_products:[],
        community_posts_virtualisations:[],
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
        this.loadBusinessProducts()
        this.loadPosts()
    },
    methods: {
        

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
          `${this.$store.state.root_api}community/api/my-posts/`,
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
          // Process posts data to match backend structure
          this.community_posts_virtualisations = data.data.map((post) => ({
            ...post,
            isLiked: false, // You'll need to check user's likes separately
            tags: post.tags || [], // Backend returns string array
            like_count: post.like_count || 0,
            comment_count: post.comment_count || 0,
            share_count: post.share_count || 0,
            view_count: post.view_count || 0,
          }));

          // No pagination in MyPostsAPI currently
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

        async loadBusinessProducts() {
            try {
                this.loading = true;
                this.error = null;
                
                const businessName = this.business_info.slug;
                
            const token = localStorage.getItem('token');
                
                const response = await fetch(`${this.$store.state.root_api}Auth/api/business/products-sold/${businessName}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                    });
        const result = await response.json();

                if (result.success) {
                    // console.log(result)
                    this.our_products = result.data;
                } else {
                    this.error = result.message || 'Business not found';
                }
            } catch (error) {
                console.error('Error loading business data:', error);
                if (error.response?.status === 404) {
                    this.error = 'Business not found';
                } else {
                    this.error = 'Failed to load business information';
                }
            } finally {
                this.loading = false;
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
            
            const response = await fetch(`${this.$store.state.root_api}Auth/api/business-profile/`, {
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