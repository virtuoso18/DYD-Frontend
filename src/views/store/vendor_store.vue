<template>

  <CommentsModal
      :isOpen="showCommentsModal"
      :post="selectedPost || {}"
      @close="closeModal"
      @commentAdded="handleCommentAdded"
      @likeToggled="handleLikeToggled"
    />

  
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
                    <div style="display:flex;justify-content: center;">
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

    <a-button                 style="margin-top:10px;display: flex;justify-content: center;align-items: center;" 
 @click="startchat_with_buisness_user()"
    type="primary"
    size="medium"
    v-if="canMessageBusiness"
    >
    <MessageOutlined />
    Message Business
</a-button>
<a-button v-else
                style="margin-top:10px;display: flex;justify-content: center;align-items: center;" 
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
                    <a-col :sm="24" :xs="24" :md="12" :lg="12" v-if="!this.business_info.is_profesional_user_site">
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
                    
                    <a-col :sm="24" :xs="24" :md="this.business_info.is_profesional_user_site ? 24:12" :lg="this.business_info.is_profesional_user_site ? 24:12" style="padding:10px;" >
                        
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

            <!-- Products Section -->
            <!-- Replace the Products Section in your template with this -->
<!-- Products Section -->
<div style="padding:10px;background-color: white;border-radius:10px;border:2px solid rgba(128, 128, 128, 0.16);" v-if="!this.business_info.is_profesional_user_site">
    <h1>Our Products</h1>
    
    <div style="text-align: center; padding: 10px;">
        <!-- Loading State for first page -->
        <div v-if="loading && productsPage === 1" style="text-align: center; padding: 30px;">
            <a-spin size="large" />
            <p style="margin-top: 10px;">Loading products...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error && productsPage === 1" style="padding: 20px;">
            <a-alert 
                :message="error" 
                type="error" 
                show-icon
                closable
            />
        </div>

        <!-- Empty State -->
        <div v-else-if="our_products.length === 0 && !loading" style="padding: 40px;">
            <a-empty 
                description="No products available"
                style="margin: 20px 0;"
            />
        </div>

        <!-- Products Display -->
        <div v-else>
            <!-- Debug info (remove in production) -->
            <!-- <div style="background: #f0f0f0; padding: 10px; margin-bottom: 10px; border-radius: 5px; text-align: left; font-size: 12px;">
                <p>Total Products: {{ our_products.length }} | Page: {{ productsPage }} | Has More: {{ hasMoreProducts }}</p>
            </div> -->

            <!-- Products Grid Component -->
            <buisnes_products_sailing 
                v-if="our_products.length > 0"
                :products="our_products"
            />

            <!-- Fallback: Display products as list if component fails -->
            <div v-if="our_products.length === 0" style="padding: 20px;">
                <p>No products to display</p>
            </div>

            <!-- Load More Button -->
            <div v-if="our_products.length > 0" style="margin-top: 30px; text-align: center;">
                <div v-if="hasMoreProducts" style="margin-bottom: 20px;">
                    <a-button
                        type="primary"
                        size="large"
                        @click="loadMoreProducts"
                        :loading="isLoadingMoreProducts"
                        >
                        <!-- style="padding: 10px 40px; border-radius: 8px; font-weight: 600;" -->
                        <span v-if="!isLoadingMoreProducts">
                            Show More Products ({{ totalProducts - our_products.length }} remaining)
                        </span>
                        <span v-else>
                            Loading...
                        </span>
                    </a-button>
                </div>

                <!-- Pagination Info -->
                <div style="color: #666; font-size: 14px; margin-top: 10px;">
                    <p v-if="hasMoreProducts">
                        Showing {{ our_products.length }} of {{ totalProducts }} products
                    </p>
                    <p v-else style="color: #999;">
                        <a-icon type="check-circle" /> All {{ totalProducts }} products loaded
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

            <br>

            <!-- User Generated Content -->
            <div style="padding:10px;background-color: white;border-radius:10px;border:2px solid rgba(128, 128, 128, 0.16);"  v-if="currentUser.user_type !='User'">
                <!-- <div style="padding:10px;background: #f2f2f3;border-radius:10px">
                    <h3>Gallery</h3>
                    <p>Business showcase and user content</p>
                </div> -->
                
    
                
                
      
        <h3>
          <!-- <apple-outlined /> -->
          Community Post Visualizations
        </h3>
      
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
                          <a-col :span="19" style="display:flex;gap:10px;">
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
                          <a-col :span="5" style="display: flex;justify-content: end;">
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
                                @click="openCommentsModal(post)"
                              >
                                <MessageOutlined />
                                <span>{{
                                  formatNumber(post.comment_count)
                                }}</span>
                              </div>
                              <!-- <div class="stat-item" @click="sharePost(post)">
                                <ShareAltOutlined />
                                <span>{{
                                  formatNumber(post.share_count)
                                }}</span>
                              </div> -->
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
    

            </div>
        </div>
        </div>
    </div>
</template>
<script>
import CommentsModal from '@/views/pages/CommentsModal.vue';
import RequestCreateRoom from '@/components/general_user/buisness_page/create_request_modal.vue'
import buisnes_products_sailing from '@/components/general_user/buisness_page/products_sailing.vue'
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
} from '@ant-design/icons-vue'

import MapLocationViewer from '@/components/store/map_location_viewer.vue'
export default {
    name: 'business_page',
    components: {
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
                MapLocationViewer,
        CommentsModal
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
    
            userProfile: null,
            activeKey: 'Visualization',
            business_info: {},
            our_products: [],
            community_posts_virtualisations: [],
          showCommentsModal: false,
          selectedPost: null,
         
            currentUser: JSON.parse(localStorage.getItem('user') || '{}'),

            // Pagination states
            productsPage: 1,
            productsPerPage: 10,
            totalProducts: 0,
            totalPagesProducts: 0,
            isLoadingMoreProducts: false,
            hasMoreProducts: false,
            
            businessLocation: {
                latitude: 0,
                longitude: 0,
                address: 'Business Location'
            },
            businessLocationReady: false,
            
            loading: true,
            error: null,
            modal_create_request_to_buisness: true
        }
    },
    async mounted() {
        try {
            await this.loadBusinessData();
            this.loadBusinessRatings()
            this.fetchCommunityPosts()
        } catch (error) {
            console.error('Error in mounted:', error);
            this.error = 'Failed to load page data';
        }
    },
    watch: {
        '$route'() {
            this.productsPage = 1;
            this.hasMoreProducts = false;
            this.our_products = [];
            this.loadBusinessData();
            this.loadBusinessProducts(1);
          }
    },
    methods: {
      async fetchCommunityPosts(page = 1) {
    try {
      debugger
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${this.$store.state.root_api}community/api/business-community-posts/${this.$route.params.buisness_name}?page=${page}&page_size=12`,
            {
                method: 'GET',
                headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
            }
        );
        const result = await response.json();
        if (result.success) {
            this.community_posts_virtualisations = result.data;
            // Update pagination info from response if available
            if (result.total_count !== undefined) {
                this.postsPagination.totalCount = result.total_count;
                this.postsPagination.totalPages = result.total_pages;
                this.postsPagination.currentPage = result.page;
            }
        }
    } catch (error) {
        console.error('Error loading community posts:', error);
        this.$message.error('Error loading community posts');
    }
},

async handlePostsPageChange(page) {
    this.postsPagination.currentPage = page;
    await this.fetchCommunityPosts(page);
},



openCommentsModal(post) {
    this.viewPost(post);
},

viewPost(post) {
    // Transform your post data to match modal props
    this.selectedPost = {
        id: post.id,
        image: this.$store.state.root_media_api + post.post_image,
        userName: post.post_by,
        userAvatar: this.$store.state.root_media_api + post.user_profile,
        description: post.description || post.content,
        tags: post.tags || [],
        views: post.view_count,
        likes: post.like_count,
        is_liked: post.is_liked || false,
        comment_count: post.comment_count
    }
    
    this.showCommentsModal = true;
},

closeModal() {
    this.showCommentsModal = false;
    this.selectedPost = null;
},

async handleCommentAdded() {
    // Refresh the post data or update comment count
    await this.fetchCommunityPosts();
},

async handleLikeToggled() {
    // Refresh the post data when like is toggled in modal
   await this.fetchCommunityPosts();
},

sharePost(post) {
    // Share functionality
    console.log('Sharing post:', post);
    // Add your share logic here
},


        
    async loadBusinessRatings() {
        try {
            this.loadingRatings = true;
            this.ratingsError = null;
            console.log(this.$route.params.buisness_name)
            const businessSlug = this.$route.params.buisness_name; // Use existing business slug
            
            let headers= {
              'Content-Type': 'application/json'
            }
            const token = localStorage.getItem('token');
            if(token){
                    headers['Authorization']= `Token ${token}`
            }

            const response = await fetch(
                `${this.$store.state.root_api}room/api/business-ratings/?business_slug=${businessSlug}`,
                {
                    method: 'GET',
                    headers:headers
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
    
    // Calculate percentage for progress bars
    calculatePercentage(count) {
        if (this.businessRatings.total_ratings === 0) return 0;
        return Math.round((count / this.businessRatings.total_ratings) * 100);
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

        async startchat_with_buisness_user() {
            const selectedUser = this.userProfile

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
                        query: { chatId: data.room_id }
                    })
                }

                if (this.currentUser.user_type === 'Business' ) {
                    this.$router.push({
                        path: '/my-store/messages',
                        query: { chatId: data.room_id }
                    })
                }
                  if (this.currentUser.user_type === 'Professional') {
                    this.$router.push({
                        path: '/professional-dashboard/my-messages',
                        query: { chatId: data.room_id }
                    })
                }

            } catch (error) {
                console.error('Error creating/finding room:', error)
            }
        },

        showModal() {
            this.$refs.roomModal.openModal()
        },

        handleClose() {
            // Modal close handler
        },

        async handleSubmit(formData) {
            console.log('Form submitted:', formData)
            
            try {
                const loadingMessage = this.$message.loading('Submitting room request...', 0)
                
                const apiFormData = new FormData()
                apiFormData.append('email', formData.email)
                apiFormData.append('message', formData.message || '')
                apiFormData.append('buisess_name_slug', this.$route.params.buisness_name || '')
                apiFormData.append('room_image', formData.roomPhoto)
                
                const response = await fetch(this.$store.state.root_api + 'room_request/api/room-request/', {
                    method: 'POST',
                    body: apiFormData,
                    headers: {
                        ...(localStorage.getItem('token') && {
                            'Authorization': `Token ${localStorage.getItem('token')}`
                        })
                    }
                })
                
                const result = await response.json()
                loadingMessage()
                
                if (response.ok && result.success) {
                    console.log('Room request created successfully:', result.data)
                    this.$message.success(result.message || 'Room request submitted successfully!')
                    
                    if (result.data && result.data.request_id) {
                        localStorage.setItem('latest_room_request_id', result.data.request_id)
                    }
                    
                    return result.data
                    
                } else {
                    console.error('API Error:', result)
                    
                    if (result.errors) {
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
                this.$message.destroy()
                
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

        async loadBusinessProducts(pageNumber = 1) {
            try {
                if (pageNumber === 1) {
                    this.loading = true;
                    this.error = null;
                    this.our_products = [];
                } else {
                    this.isLoadingMoreProducts = true;
                }

                const businessName = this.$route.params.buisness_name;
                
                
                const headers = {
                  'Content-Type': 'application/json',
                };
                
                let token=localStorage.getItem('token')
                // If token exists, add Authorization header
                if (token) {
                  headers['Authorization'] = `Token ${token}`;
                }
                const response = await fetch(
                  `${this.$store.state.root_api}Auth/api/business/products-sold/${businessName}?page=${pageNumber}&page_size=10`,
                  {
                      method: 'GET',
                      headers: headers, 
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

                    this.error = null;
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

        async loadBusinessData() {
            try {
                this.loading = true;
                this.error = null;
                
                // const businessName = this.$route.params.buisness_name;
                // const token_available = localStorage.getItem('token') ? true:false
                // const response = await fetch(`${this.$store.state.root_api}Auth/api/business/public/${businessName}`, {
                //     method: 'GET',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         token_available ?  'Authorization': 'Token ' + localStorage.getItem('token')
                        
                //     }
                // });
                const businessName = this.$route.params.buisness_name;
                const token = localStorage.getItem('token');

                const headers = {
                  'Content-Type': 'application/json',
                };

                // If token exists, add Authorization header
                if (token) {
                  headers['Authorization'] = `Token ${token}`;
                }

                const response = await fetch(
                  `${this.$store.state.root_api}Auth/api/business/public/${businessName}`,
                  {
                    method: 'GET',
                    headers: headers,
                  }
                );

                const result = await response.json();
                this.userProfile = result.data?.user_id_buisness_owner;
                  console.log(result)
                if (result.success) {
                    this.business_info = result.data;
                    if (this.business_info.is_profesional_user_site){
                     console.log('theProfesionalUserSiteHere')
                    }
                    else{
                      await this.loadBusinessProducts(1);
                      this.showModal();
                    }
                    // Set business location
                    this.businessLocation = {
                        latitude: result.data.lattitude || 40.7128,
                        longitude: result.data.longitude || -74.0060,
                        address: result.data.address || `${result.data.latitude}, ${result.data.longitude}` || 'Business Location'
                    }
                    
                    this.businessLocationReady = true
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