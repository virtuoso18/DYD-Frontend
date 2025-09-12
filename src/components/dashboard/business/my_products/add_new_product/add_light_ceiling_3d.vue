<template>
   <add_new_furniture 
        v-model:visible="showAddProduct"
        :types="['Modern','Scandinavian','Classic','Minimalist','Industrial','Rustic','Boho','other',]"
        @product-created="onProductCreated"
        @cancel="onCancel"
        :rendered_modal_3D_id="model_instance_id"
    />
  <a-row>
    <a-col :span="6">
      <!-- @processing-generate="processinggenerate_loading" -->
<sidepanel_3d_tab

          @generated="new3DModelGenerated"
          @queue-updated="get_3d_rendered_model_details"
          />
          

    </a-col>
    
    <a-col :span="12">
      
  <object_viewer_3d_tab 
  :glbModelUrl="generated3dModel_url"
  :isLoading="processing_generate_is_Loading"
  :Model_instance_id="model_instance_id"
  @clicked-add-product="add_new_product"
  />
    </a-col>
    <a-col :span="6">

      
<models_3d_generate_history 
  :list_history_generated_3d_models="list_history_generated_3d_models"
  :loading_generated_models_history="loading_generated_models_history"
  @clicked-model="clicked_history_model"
  />
    </a-col>
  </a-row>
  
  </template>
<script>

// 3d Panel Tab 
import sidepanel_3d_tab from '@/components/dashboard/business/my_products/add_new_product/add_light_3d_model_gen/side_panel_3d.vue'
import object_viewer_3d_tab from '@/components/dashboard/business/my_products/add_new_product/add_light_3d_model_gen/canvas_renderer.vue'
import models_3d_generate_history from '@/components/dashboard/business/my_products/add_new_product/add_light_3d_model_gen/generate_history.vue'
import add_new_furniture from '@/components/dashboard/business/my_products/add_new_product/add_light_modal.vue'

export default {
  name:"add_Furniture"
,
data(){
  return { //  3dTab 
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
},
methods:{
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
  this.generated3dModel_url=this.$store.state.root_api+ e.media_url
  this.model_instance_id=e.new3d_model_instance

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
      
      this.generated3dModel_url=this.$store.state.root_api+ responseData.new_model.model_file_url
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