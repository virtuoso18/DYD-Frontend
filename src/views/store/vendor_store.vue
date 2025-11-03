<template>
<RequestCreateRoom 
      ref="roomModal"
      :canMessageBusiness="canMessageBusiness"
      @close="handleClose"
      @submit="handleSubmit"
    />

    <div style="padding:10px">
        <!-- Loading State -->
        <div v-if="loading" style="text-align: center; padding: 50px;">
            <a-spin size="large" />
            <p>Loading business information...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" style="text-align: center; padding: 50px;">
            <a-result
                status="404"
                title="Business Not Found"
                :sub-title="error"
            >
                <template #extra>
                    <a-button type="primary" @click="$router.push('/')">Back Home</a-button>
                </template>
            </a-result>
        </div>
        <!-- Business Content -->
        <div v-else style="background-color: white; padding:10px;border-radius:10px; border:2px solid rgba(128, 128, 128, 0.16);">
            
            <a-row>
                <a-col :span="24"> 
                    <h2>{{ business_info.name }}</h2>
                </a-col>
            </a-row>
            
            <!-- Banner Section -->
            <div 
                :style="`
                    background: linear-gradient(
                        rgba(0,0,0,0.3), 
                        rgba(0,0,0,0.3)
                    ), url(${this.$store.state.root_media_api}${business_info.business_picture}) center/cover no-repeat;
                    height:250px;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                `"
            >
                <div style="text-align:center">
                    <div>
                        <img 
                        :src="this.$store.state.root_media_api + business_info.banner_picture" 
                        style="width:70px;height:70px;border-radius:50%" 
                        alt="Business Logo"
                        >
                    </div>
                    <div style="font-size:20px;font-weight:700;color:white;margin-top:10px">
                        {{ business_info.name }}
                    </div>
                    <div style="font-size:16px;font-weight:400;color:white">
                        {{ business_info.description }}
                    </div>
<div v-if="this.userProfile?.id === this.currentUser?.id">
      <a-alert message=" Your Business Public Page" type="info" />
</div>
<div v-else>

    <a-button style="margin-top:10px;"  @click="startchat_with_buisness_user()"
    type="primary"
    size="medium"
    v-if="canMessageBusiness"
    >
    <MessageOutlined />
    Message Business
</a-button>
<a-button v-else
                style="margin-top:10px;" 
                type="primary"
                @click="$router.push('/login')"
                size="medium">
                <MessageOutlined /> Login to Message
            </a-button>
        </div>
    </div>
            </div>
            
           
            <br>
            <div style="max-width:1200px;margin:auto">
            <!-- Business Info Section -->
            <div style="padding:10px;">
                <div style="background: #f3f3f3;border-radius:10px;padding:10px;">
                    <h1 style="font-size:18px">{{ business_info.buisness_info_title }}</h1>
                    <div>{{ business_info.buisness_info }}</div>
                </div>
            </div>

            <br>

            <!-- Services Section -->
            <div style="padding:10px;" v-if="business_info.services_offered && business_info.services_offered.length > 0">
                <div style="background: #f3f3f3;border-radius:10px;padding:10px;">
                    <h1 style="font-size:16px">What do we offer?</h1>
                    <div>
                        <ul>
                            <li v-for="(service, index) in business_info.services_offered" :key="index">
                                {{ service }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <br>

            <!-- Contact & Social Media Section -->
            <div style="padding:10px;">
                <div style="background: #f3f3f3;border-radius:10px;padding:10px;">
                    <h1 style="font-size:16px">Contact Information</h1>
                    <a-row :gutter="16">
                        <a-col :sm="24" :md="12">
                            <p ><strong>Email:</strong> {{ business_info.email }}</p>
                            <p><strong>Phone:</strong> {{ business_info.phone_number }}</p>
                            <p v-if="business_info.whatsapp_number"><strong>WhatsApp:</strong> {{ business_info.whatsapp_number }}</p>
                        </a-col>
                        <a-col :sm="24" :md="12">
                            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                <a-button v-if="business_info.facebook_url" type="link" :href="business_info.facebook_url" target="_blank">
                                    Facebook
                                </a-button>
                                <a-button v-if="business_info.instagram_url" type="link" :href="business_info.instagram_url" target="_blank">
                                    Instagram
                                </a-button>
                                <a-button v-if="business_info.twitter_url" type="link" :href="business_info.twitter_url" target="_blank">
                                    Twitter
                                </a-button>
                                <a-button v-if="business_info.linkedin_url" type="link" :href="business_info.linkedin_url" target="_blank">
                                    LinkedIn
                                </a-button>
                                <a-button v-if="business_info.website_url" type="link" :href="business_info.website_url" target="_blank">
                                    Website
                                </a-button>
                            </div>
                        </a-col>
                    </a-row>
                </div>
            </div>

            <br>

            <!-- Reviews Section (Static for now) -->
            <div>
                <a-row>
                    <a-col :sm="24" :xs="24" :md="12" :lg="12">
                        <a-row style="padding-top:50px">
                            <a-col :sm="12" :xs="12" :md="12" :lg="12" style="border-right: 2px solid rgba(0,0,0,0.3);display: flex;justify-content: center;align-items: center;padding-top:20px">
                                <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
                                    <h1>4.5</h1>
                                    <a-rate :value="4" disabled></a-rate>
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
                                    1<a-progress :percent="70" size="small" status="exception" />
                                </div>
                            </a-col>
                        </a-row>
                    </a-col>
                    
                    <a-col :sm="24" :xs="24" :md="12" :lg="12" style="padding:10px;">
                        <img 
                            style="border-radius:10px;width:100%;height:200px;object-fit:cover" 
                            src="https://developers.google.com/static/maps/images/landing/hero_maps_static_api.png" 
                            alt="Location Map"
                        >
                    </a-col>
                </a-row>
            </div>

            <br>

            <!-- Products Section -->
            <div style="padding:10px;background-color: white;border-radius:10px;border:2px solid rgba(128, 128, 128, 0.16);">
                <h1>Our Products</h1>
                <!-- You can add products component here if needed -->
                <div style="text-align: center; padding: 0px;">
                    <!-- <p>Products will be displayed here</p> -->
                     <div v-if="our_products.length==0">
    <a-empty description="Business product catalogue is empty."></a-empty>
</div>
                   <buisnes_products_sailing :products="our_products" v-else/> 
                </div>
            </div>

            <br>

            <!-- User Generated Content -->
            <div style="padding:10px;background-color: white;border-radius:10px;border:2px solid rgba(128, 128, 128, 0.16);">
                <div style="padding:10px;background: #f2f2f3;border-radius:10px">
                    <h3>Gallery</h3>
                    <p>Business showcase and user content</p>
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
        </div>
        </div>
    </div>
</template>

<script>

import RequestCreateRoom from '@/components/general_user/buisness_page/create_request_modal.vue'
import buisnes_products_sailing from '@/components/general_user/buisness_page/products_sailing.vue'
import {   EyeOutlined,
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
  } from '@ant-design/icons-vue';
export default {
    name: 'business_page',
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
         RequestCreateRoom,
         buisnes_products_sailing,
         MessageOutlined
    },
   computed: {
        hasToken() {
        return localStorage.getItem("token") !== null;
        },
        canMessageBusiness() {
        return (
            this.hasToken &&
            this.userProfile?.id !== this.currentUser?.id
        );
        }
    },
    data() {
        return {
            userProfile: null,
            activeKey: 'Visualization',
            business_info: {},
            our_products:[],
        community_posts_virtualisations:[],
            currentUser: JSON.parse(localStorage.getItem('user') ),

            loading: true,
            error: null,
            modal_create_request_to_buisness:true
        }
    },
    async mounted() {
        await this.loadBusinessData();
        await this.loadBusinessProducts();
        this.showModal()
        this.loadPosts()
    },
    watch: {
        '$route'() {
            // Reload data when route changes
            this.loadBusinessData();
        }
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
        const businessName = this.$route.params.buisness_name;

        const response = await fetch(
          `${this.$store.state.root_api}community/api/business-community-posts/${businessName}`,
          {
            method: "GET",
            headers: {
            //   Authorization: `Token ${localStorage.getItem("token")}`,
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

         async startchat_with_buisness_user() {
        const selectedUser = this.userProfile

      // const selectedUser = this.allUsers.find((user) => user.id == this.selectedUserId)
      // if (!selectedUser) {
      //   console.error('Selected user not found')
      //   return
      // }
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

        if (this.currentUser.user_type === 'User') {
        this.$router.push({
            path: '/user-dashboard/my-messages',
            query: { chatId: data.room_id }  // Pass the room ID in query
        })
        }

        if (this.currentUser.user_type === 'Business' || this.currentUser.user_type === 'Professional') {
        this.$router.push({
            path: '/my-store/messages',
            query: { chatId: data.room_id }  // Pass the room ID in query
        })
        }


        // Add to rooms list if newly created
        // if (data.created) {
        //   this.userRooms.push(room)
        // }

        // // Select the room
        // this.selectRoom(room.id, room.name)

        // // Join websocket room
        // if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        //   this.websocket.send(
        //     JSON.stringify({
        //       action: 'join_room',
        //       roomId: room.id,
        //     }),
        //   )
        // }

        // this.selectedUserId = ''
      } catch (error) {
        console.error('Error creating/finding room:', error)
      }
    },
        showModal() {
            this.$refs.roomModal.openModal()
        },
        handleClose() {
            // this.$refs.roomModal.CloseModal()

        },
        async handleSubmit(formData) {
            console.log('Form submitted:', formData)
            
            try {
                // Show loading state (if using Ant Design)
                const loadingMessage = this.$message.loading('Submitting room request...', 0)
                
                // Create FormData object for file upload
                const apiFormData = new FormData()
                
                // Append form fields to FormData
                apiFormData.append('email', formData.email)
                apiFormData.append('message', formData.message || '')
                apiFormData.append('buisess_name_slug', this.$route.params.buisness_name || '')
                apiFormData.append('room_image', formData.roomPhoto)
                
                // Optional: Add business_id if you have it
                // apiFormData.append('business_id', formData.business_id)
                
                // Make API request
                const response = await fetch(this.$store.state.root_api + 'room_request/api/room-request/', {
                    method: 'POST',
                    body: apiFormData,
                    headers: {
                        // Don't set Content-Type header - let browser set it with boundary for FormData
                        // 'Content-Type': 'multipart/form-data', // DON'T SET THIS

                        // Add authentication token if required
                        ...(localStorage.getItem('token') && {
                            'Authorization': `Token ${localStorage.getItem('token')}`
                        })
                    }
                })
                
                // Parse response
                const result = await response.json()
                
                // Hide loading message
                loadingMessage()
                
                if (response.ok && result.success) {
                    // Success response
                    console.log('Room request created successfully:', result.data)
                    
                    // Show success message
                    this.$message.success(result.message || 'Room request submitted successfully!')
                    
                    // Optional: Store request ID for tracking
                    if (result.data && result.data.request_id) {
                        // You can store this in localStorage or vuex store for tracking
                        localStorage.setItem('latest_room_request_id', result.data.request_id)
                    }
                    
                    // Close modal or redirect user
                    // this.handleClose() // Assuming you have this method
                    
                    return result.data
                    
                } else {
                    // Handle API errors
                    console.error('API Error:', result)
                    
                    if (result.errors) {
                        // Handle validation errors
                        let errorMessages = []
                        Object.keys(result.errors).forEach(field => {
                            if (Array.isArray(result.errors[field])) {
                                errorMessages = [...errorMessages, ...result.errors[field]]
                            } else {
                                errorMessages.push(result.errors[field])
                            }
                        })
                        
                        this.$message.error(errorMessages.join(', '))
                    } else {
                        this.$message.error(result.message || 'Failed to submit room request')
                    }
                    
                    return null
                }
                
            } catch (error) {
                console.error('Network Error:', error)
                
                // Hide loading if it exists
                this.$message.destroy()
                
                // Handle network errors
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    this.$message.error('Network error. Please check your connection and try again.')
                } else if (error.name === 'AbortError') {
                    this.$message.error('Request timed out. Please try again.')
                } else {
                    this.$message.error('An unexpected error occurred. Please try again.')
                }
                
                return null
            }
        },

        async loadBusinessProducts() {
            try {
                this.loading = true;
                this.error = null;
                
                const businessName = this.$route.params.buisness_name;
                
            const token = localStorage.getItem('token');
                
                const response = await fetch(`${this.$store.state.root_api}Auth/api/business/products-sold/${businessName}`, {
                    method: 'GET',
                    headers: {
                        // 'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                    });
        const result = await response.json();

                if (result.success) {
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
        async loadBusinessData() {
            try {
                this.loading = true;
                this.error = null;
                
                const businessName = this.$route.params.buisness_name;
                
            const token = localStorage.getItem('token');
                
                const response = await fetch(`${this.$store.state.root_api}Auth/api/business/public/${businessName}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                    });
        const result = await response.json();
                this.userProfile=result.data.user_id_buisness_owner
                if (result.success) {
                    this.business_info = result.data;
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
.ant-btn-primary {
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.ant-btn-primary:hover {
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transform: translateY(-1px);
}

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