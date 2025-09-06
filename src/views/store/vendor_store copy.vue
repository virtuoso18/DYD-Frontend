<template>
    <!-- {{business_info}} -->
    <div style=" padding:10px">
    
        <div style="background-color: white; padding:10px;border-radius:10px; border:2px solid rgba(128, 128, 128, 0.16); ">
<a-row>
    <a-col :span="20"> <h2>Manage Store</h2></a-col>
    <a-col :span="4" style="display: flex;justify-content: end;"> <a-button type="primary">Edit</a-button></a-col>
</a-row>
            
            <div 
        :style="`
    background: linear-gradient(
      rgba(0,0,0,0.3), 
      rgba(0,0,0,0.3)
    ), url(${this.$store.state.root_api}${business_info.business_picture}) center/cover no-repeat;
    height:200px;
    display:flex;
    justify-content:center;
    align-items:center;
  `"
        >
            
        <div style="text-align:center">
            <!-- <div>{{business_info.name}}</div> -->
            <div><img :src="this.$store.state.root_api+business_info.banner_picture" style="width:70px;height:70px" alt=""></div>
            <div style="font-size:16px;font-weight:700;color:white">Hi Ashish,</div>
             <div style="font-size:16px;font-weight:700;color:white">Here is What Happening Your Buisness Today</div>
        </div>

        </div>
        <br>
        <div style="padding:10px;">
            <div style="background: #f3f3f3;;border-radius:10px;padding:10px;">
                <h1 style="font-size:18px">Your Lightning Store for perfect design</h1>
             <div>Welcome to ALUMA, your go-to lighting store specializing in advanced lighting solutions for homes and businesses.
With 14 years of experience in the industry, we offer a wide range of unique and stylish lighting fixtures, along with professional consultation services to bring your design vision to life.</div>
            </div>
        </div>
        <br>
         <div style="padding:10px;">
            <div style="background: #f3f3f3;;border-radius:10px;padding:10px;">
                <h1 style="font-size:16px">what do we offer ?</h1>
             <div>
                <ul>
                    <li>Architectural and Designer Lighting – A selection of modern, classic, and innovative lighting fixtures for every space</li>
                    <li>Advanced 3D Visualizations – See how your chosen lighting will look in your home with state-of-the-art visualization technology.</li>
                    <li>Personalized Professional Consultation – Our expert team will help you find the perfect lighting for your needs and design style.</li>
                    <li>Smart Lighting & Advanced Solutions – Integrating cutting-edge technologies to illuminate your space with style and efficiency</li>
                </ul>
                    
                    
                    
                    

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

    }}
}
</script>