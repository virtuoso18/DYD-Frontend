<template>
    <div>
        <!-- {{product_id}}<br>
        {{buisness_name}}<br>
        {{ product_type }}<br> -->

        
        <!-- {{ selectedProduct }} -->
<div style="max-width: 1200px;margin:auto">
            <show_floorTexture_product  :selectedTexture="selectedProduct" v-if="(selectedProduct !== null)  && (product_type==='floor')"  />
            <show_wallTexture_product  :selectedTexture="selectedProduct" v-if="(selectedProduct !== null)  && (product_type==='wall')"  />
            <show_furniture_product  :selectedProduct="selectedProduct" v-if="(selectedProduct !== null )&&  (product_type==='product') && (selectedProduct.category.name !=='Light')"  />
            <!-- {{selectedProduct.category}} -->
             <!-- {{ selectedProduct.light_type }} -->
            <show_Light_product_3D  :selectedProduct="selectedProduct" v-if="selectedProduct &&  (product_type==='product') && selectedProduct.category.name === 'Light' &&  selectedProduct.light_type=='hanging' "  @back_product_list="backToList" />
            <show_Light_product_sunk  :selectedProduct="selectedProduct" v-if="selectedProduct &&  (product_type==='product') && selectedProduct.category.name ==='Light' &&  selectedProduct.light_type=='sunk'"  @back_product_list="backToList" />
            <show_Light_product_unsunk  :selectedProduct="selectedProduct" v-if="selectedProduct &&  (product_type==='product') && selectedProduct.category.name ==='Light' &&  selectedProduct.light_type=='unsunk'"  @back_product_list="backToList" />
<br>
<!-- Products Section -->
          <div style="padding:10px;background-color: white;border-radius:10px;border:2px solid rgba(128, 128, 128, 0.16);">
              <h3>View more Products</h3>
              <!-- You can add products component here if needed -->
              <div style="text-align: center; padding: 0px;">
                  <!-- <p>Products will be displayed here</p> -->
                 <buisnes_products_sailing :products="our_products"/> 
              </div>
          </div>

        </div>

            <br>
    </div>
</template>
<script>

// show existing
import show_floorTexture_product from '@/components/general_user/product_details/floor_texture.vue' 
import show_wallTexture_product from '@/components/general_user/product_details/wall_texture.vue'
import show_furniture_product from '@/components/general_user/product_details/furniture_product.vue'

// differentt Light Products Details Component 
import show_Light_product_sunk from '@/components/general_user/product_details/light_product_sunk.vue'
import show_Light_product_unsunk from '@/components/general_user/product_details/light_product_ununk.vue'
import show_Light_product_3D from '@/components/general_user/product_details/light_product_3d.vue'

import buisnes_products_sailing from '@/components/general_user/buisness_page/products_sailing.vue'
export default {
    name:'products_details',
    components:{
        buisnes_products_sailing,
        show_floorTexture_product,
        show_wallTexture_product,
        show_furniture_product,
        show_Light_product_sunk,
        show_Light_product_unsunk,
        show_Light_product_3D,
    },
    data(){
        return {
            selectedProduct:null,
            product_id:this.$route.params.product_id,
            product_type:this.$route.params.product_type,
            buisness_name:this.$route.params.buisness_name,
            our_products:[]
        }
    },
    mounted(){
        this.fetchProductDetails()
        this.loadBusinessProducts()
    },
    methods:{
        async loadBusinessProducts() {
            try {
                this.loading = true;
                this.error = null;
                
                const businessName = this.$route.params.buisness_name;
                
            const token = localStorage.getItem('token');
                
                const response = await fetch(`${this.$store.state.root_api}Auth/api/business/products-sold/${this.product_type}/${this.buisness_name}/${this.product_id}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
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

        async fetchProductDetails() {
            try {
                let url_product_details=`${this.$store.state.root_api}product/api/light-details/${this.product_id}/`
                
                if (this.product_type === 'wall'){
                    url_product_details=`${this.$store.state.root_api}product/api/wall-details/${this.product_id}/`
                }
                if (this.product_type === 'floor'){
                    url_product_details=`${this.$store.state.root_api}product/api/floor-details/${this.product_id}/`
                }
                if (this.product_type === 'product'){
                   url_product_details=`${this.$store.state.root_api}product/api/product-details/${this.product_id}/`

                }
                const token = localStorage.getItem('token');
                const response = await fetch(`${url_product_details}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                const result = await response.json();
                console.log(result)
                if (result.success) {
                    const data = result.data;
                    this.selectedProduct = data;
                }
            } catch (error) {
                console.error('Error loading business profile:', error);
            }
        },
    }
}
</script>