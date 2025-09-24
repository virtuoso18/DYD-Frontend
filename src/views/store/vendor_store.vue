<template>
<RequestCreateRoom 
      ref="roomModal"
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
                    height:200px;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                `"
            >
                <div style="text-align:center">
                    <div>
                        <img 
                            :src="this.$store.state.root_api + business_info.banner_picture" 
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
                </div>
            </div>

            <br>

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
                            <p><strong>Email:</strong> {{ business_info.email }}</p>
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
                <div style="text-align: center; padding: 20px;">
                    <p>Products will be displayed here</p>
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
                            <span>Visualization</span>
                        </template>
                        <a-col :lg="8" :md="8" :xs="24" :sm="24" style="padding:5px;">
                            <div style="border:1px solid rgba(0,0,0,0.1);padding: 5px;border-radius:10px;">
                                <img src="../../../assets/home_main_banner.jpg" style="width:100%;border-radius:10px" alt="">
                                <a-row style="padding-top:5px">
                                    <a-col :span="22">
                                        <a-tag>living room</a-tag>
                                        <a-tag>modern</a-tag>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-col>
                    </a-tab-pane>
                    <a-tab-pane key="User generated content">
                        <template #tab>
                            <span>User Generated Content</span>
                        </template>
                        <p>User generated content will be displayed here</p>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import RequestCreateRoom from '@/components/general_user/buisness_page/create_rewquest_modal.vue'
export default {
    name: 'business_page',
    components:{
         RequestCreateRoom
    },
    data() {
        return {
            activeKey: 'Visualization',
            business_info: {},
            loading: true,
            error: null,
            modal_create_request_to_buisness:true
        }
    },
    async mounted() {
        await this.loadBusinessData();
        this.showModal()
    },
    watch: {
        '$route'() {
            // Reload data when route changes
            this.loadBusinessData();
        }
    },
    methods: {
        showModal() {
            this.$refs.roomModal.openModal()
        },
        handleClose() {
            console.log('Modal closed')
        },
        handleSubmit(formData) {
            console.log('Form submitted:', formData)
        // Handle the submitted data (email, message, roomPhoto file)
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