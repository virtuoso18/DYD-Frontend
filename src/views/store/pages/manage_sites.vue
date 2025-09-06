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
    ), url(${this.$store.state.root_api}${editData.business_picture}) center/cover no-repeat;
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
                <img :src="this.$store.state.root_api+editData.banner_picture" style="width:70px;height:70px" alt="">
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
            <manage_products/>
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
          Visualization
        </span>
      </template>
       <a-col :lg="8" :md="8" :xs="24" :sm="24" style="padding:5px;">
        <div style="border:1px solid rgba(0,0,0,0.1);padding: 5px;border-radius:10px;">

            
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
                
            </div>
        </a-col>
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
import manage_products from '@/components/store/manage_products.vue'
export default {
    name:'manage_sites',
    components:{
        manage_products
    },
    data(){ return {
        activeKey:'Visualization',
        user_generated_content:false,
        business_info: JSON.parse(localStorage.getItem('business_profile') || '{}'),
        isEditing: false,
        editStoreDescription: false,
        editServices: false,
        originalData: {},
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
    },
    methods: {
        
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

            const response = await fetch(`${this.$store.state.root_api}/Auth/api/business-profile/`, {
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
            
            const response = await fetch(`${this.$store.state.root_api}/Auth/api/business-profile/`, {
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