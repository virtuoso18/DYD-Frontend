<template>
  <a-modal
  v-model:open="showCreditModal"
  title=""
  centered
  width="380px"
  footer=""
>

  <div
    style="
      text-align:center;
      padding:10px;
      border-radius:12px;
    "
  >

    <!-- Icon wrapper -->
    <div
      style="
        display:flex;
        align-items:center;
        justify-content:center;
        width:70px;
        height:70px;
        margin:0 auto 18px auto;
        border-radius:50%;
        background:rgba(59, 99, 251, 0.12);
      "
    >
      <svg width="34" height="34" viewBox="0 0 20 20" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20C15.523 20 20 15.523 20 10C20 4.477 15.523 0 10 0ZM10 1C10 3.38695 9.05179 5.67613 7.36396 7.36396C5.67613 9.05179 3.38695 10 1 10C3.38695 10 5.67613 10.9482 7.36396 12.636C9.05179 14.3239 10 16.6131 10 19C10 16.6131 10.9482 14.3239 12.636 12.636C14.3239 10.9482 16.6131 10 19 10C16.6131 10 14.3239 9.05179 12.636 7.36396C10.9482 5.67613 10 3.38695 10 1Z"
          fill="#3B63FB"/>
      </svg>
    </div>

    <!-- Heading -->
    <h2
      style="
        font-size:20px;
        font-weight:600;
        margin-bottom:10px;
      "
    >
      Insufficient Credits
    </h2>

    <!-- Message -->
    <p
      style="
        font-size:15px;
        line-height:1.5;
        color:#555;
        margin-bottom:25px;
      "
    >
      {{ creditErrorMessage }}
    </p>

    <!-- CTA button -->
    <a-button 
      type="primary"
      block
      size="large"
      style="
        height:46px;
        font-size:16px;
        border-radius:8px;
      "
      @click="goToPurchaseCredits"
    >
      Purchase Credits
    </a-button>

  </div>
</a-modal>

   <add_new_furniture 
        v-model:visible="showAddProduct"
        :types="['Modern','Scandinavian','Classic','Minimalist','Industrial','Rustic','Boho','other',]"
        @product-created="onProductCreated"
        @cancel="onCancel"
        :rendered_modal_3D_id="model_instance_id"
    />
 <div class="flex flex-col md:flex-row w-full">
  <!-- Center Panel (First on Mobile, Middle on Desktop) - 12/24 = 50% width -->
  <div class="w-full md:order-2 md:w-6/12">
    <object_viewer_3d_tab 
      :glbModelUrl="generated3dModel_url"
      :isLoading="processing_generate_is_Loading"
      :Model_instance_id="model_instance_id"
      @clicked-add-product="add_new_product"
    />
  </div>
  
  <!-- Left Panel (Second on Mobile, First on Desktop) - 6/24 = 25% width -->
  <div class="w-full md:order-1 md:w-3/12 bg-white text-black">
    <sidepanel_3d_tab 
      @generated="new3DModelGenerated"
      @queue-updated="get_3d_rendered_model_details"
      @insufficient-credits="throw_Insufficient_credits"
    />
  </div>
  
  <!-- Right Panel (Third on Mobile, Third on Desktop) - 6/24 = 25% width -->
  <div class="w-full md:order-3 md:w-3/12 pt-4 md:pt-0">
    <models_3d_generate_history 
      :list_history_generated_3d_models="list_history_generated_3d_models"
      :loading_generated_models_history="loading_generated_models_history"
      @clicked-model="clicked_history_model"
    />
  </div>
</div>


  
  </template>
<script>

// 3d Panel Tab 
import sidepanel_3d_tab from '@/components/dashboard/business/my_products/add_new_product/add_furniture_3d_model_gen/side_panel_3d.vue'
import object_viewer_3d_tab from '@/components/dashboard/business/my_products/add_new_product/add_furniture_3d_model_gen/canvas_renderer.vue'
import models_3d_generate_history from '@/components/dashboard/business/my_products/add_new_product/add_furniture_3d_model_gen/generate_history.vue'
import add_new_furniture from '@/components/dashboard/business/my_products/add_new_product/add_furniture_modal.vue'

export default {
  name:"add_Furniture"
,
data(){
  return { //  3dTab 
    
       showCreditModal: false,
      creditErrorMessage: "",

      generated3dModel_url: '',
      model_instance_id:'',
      processing_generate_is_Loading:false,
      list_history_generated_3d_models:[],
      loading_generated_models_history:false,
      
      // API request tracking
      abortControllers: new Map(),

      // modal
      showAddProduct:false
      
}
},
components:{
  sidepanel_3d_tab,
  object_viewer_3d_tab,
  models_3d_generate_history,
  add_new_furniture
},
mounted(){
  this.fetch3d_models_generated_by_user()
  if( this.$route.query['product-3d-model']){
    this.loadHistoryModel()
  }
},
methods:{
  async loadHistoryModel(){
    // console.log("======================================================")
    // console.log("=======================   Need To Load 3d Model Here ===============================")
    // console.log("======================================================")
    
    
  this.loading_generated_models_history= true;

  try {
    const url = `${this.$store.state.root_api}engine/generated-3d-models-user-history/${this.$route.query['product-3d-model']}`;
    // const payload = {
    //       'model_3d_id': this.$route.query['product-3d-model'],
    //     }
    console.log('📡 Fetching generated 3d models hisrtory ...');
    const responseData = await this.makeApiRequest(url, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
    // body: JSON.stringify(payload)
    }, 'fetch_generated_3d_model');
    
    if (responseData) {
      
      this.generated3dModel_url=this.$store.state.root_media_api+ responseData.data.model_file_url
      this.model_instance_id=responseData.data.id
        generated_3d_model_id 
        let e={        
          processing_generate_is_Loading:false,
          generated3dModel_url:this.generated3dModel_url,
          model_instance_id:this.model_instance_id,
        }
        this.clicked_history_model(e)
}
  } catch (error) {
    console.error("❌ Failed to fetch history generated 3d Models :", error);
    this.error.general = error.message;
    this.showError('Failed to fetch history generated 3d Models', error.message, () => this.fetch3d_models_generated_by_room());
  } finally {
    this.loading_generated_models_history = false;
  }
    
// let e={        processing_generate_is_Loading
//     generated3dModel_url
//     model_instance_id
// }
// this.clicked_history_model(e)
  },
  throw_Insufficient_credits(message){
      // @insufficient-credits="throw_Insufficient_credits"
      // if(response.status==402){
      //    const result = await response.json()
      //    this.$emit('insufficient-credits',result.msg) 
      //  }
      
      this.creditErrorMessage = message;
      this.showCreditModal = true;
    },

  onProductCreated(e){
this.$router.push('/business-dashboard/my-products')
  },
  add_new_product(e){
    console.log(e)
    this.showAddProduct=true
  },
// processinggenerate_loading(e){
// this.processing_generate_is_Loading=e
// this.processing_generate_is_Loading=e
// },

clicked_history_model(e){
  this.processing_generate_is_Loading=false
  this.generated3dModel_url=this.$store.state.root_media_api+ e.media_url
  this.model_instance_id=e.new3d_model_instance

   window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })

},
async new3DModelGenerated(e){
//   {
//     "error": false,
//     "msg": "3D model generation successful",
//     "output_path": "C:\\Users\\adminay\\Documents\\AI-Applications\\002 webapp - ComfyUI\\comfyui_api_backend\\media\\3d-Rendered-Models/e25444e1-a6f5-4423-b573-dc9f4a90c52d\\Hy3D_00076_.glb",
//     "media_url": "/media/3d-Rendered-Models/e25444e1-a6f5-4423-b573-dc9f4a90c52d/Hy3D_00076_.glb",
//     "model_id": "e25444e1-a6f5-4423-b573-dc9f4a90c52d"
// }
this.processing_generate_is_Loading=true
// this.processing_generate_is_Loading=e

  // this.generated3dModel_url=this.$store.state.root_api+ e.media_url
  // this.model_instance_id=e.new3d_model_instance

// await this.fetch3d_models_generated_by_user()

},

    createAbortController(key) {
      // Cancel existing request if any
      if (this.abortControllers.has(key)) {
        this.abortControllers.get(key).abort();
      }
      
      const controller = new AbortController();
      this.abortControllers.set(key, controller);
      return controller;
    },
    async makeApiRequest(url, options = {}, requestKey) {
      const controller = this.createAbortController(requestKey);
      
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        this.abortControllers.delete(requestKey);
        return data;
      } catch (error) {
        this.abortControllers.delete(requestKey);
        
        if (error.name === 'AbortError') {
          console.log(`Request ${requestKey} was cancelled`);
          return null;
        }
        
        throw error;
      }
    },

// 3. Enhanced fetch3d Models History  method with immediate update the History 
async get_3d_rendered_model_details(generated_3d_model_id) {
  this.loading_generated_models_history= true;

  try {
    const url = `${this.$store.state.root_api}engine/generated-3d-models-user-history/`;
    const payload = {
          'model_3d_id': generated_3d_model_id,

        }
    console.log('📡 Fetching generated 3d models hisrtory ...');
    const responseData = await this.makeApiRequest(url, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
    body: JSON.stringify(payload)
    }, 'fetch_generated_3d_models');
    
    if (responseData) {
      
      this.generated3dModel_url=this.$store.state.root_media_api+ responseData.new_model.model_file_url
      this.model_instance_id=responseData.new_model.id
      this.processing_generate_is_Loading=false
      
      // Process wall masks first
      const generated_models = responseData.models || [];
      console.log(generated_models)
      this.list_history_generated_3d_models = generated_models;
      
    }
  } catch (error) {
    console.error("❌ Failed to fetch history generated 3d Models :", error);
    this.error.general = error.message;
    this.showError('Failed to fetch history generated 3d Models', error.message, () => this.fetch3d_models_generated_by_room());
  } finally {
    this.loading_generated_models_history = false;
  }
},



// 3. Enhanced fetch3d Models History  method with immediate update the History 
async fetch3d_models_generated_by_user() {
  this.loading_generated_models_history= true;

  try {
    const url = `${this.$store.state.root_api}engine/generated-3d-models-user-history/`;
    
    console.log('📡 Fetching generated 3d models hisrtory ...');
    const responseData = await this.makeApiRequest(url, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
    }, 'fetch_generated_3d_models');
    
    if (responseData) {
      // Process wall masks first
      const generated_models = responseData.models || [];
      console.log(generated_models)
      this.list_history_generated_3d_models = generated_models;
      
    }
  } catch (error) {
    console.error("❌ Failed to fetch history generated 3d Models :", error);
    this.error.general = error.message;
    this.showError('Failed to fetch history generated 3d Models', error.message, () => this.fetch3d_models_generated_by_room());
  } finally {
    this.loading_generated_models_history = false;
  }
},

}
} 
</script>