<template>
    <div>
        <div style="max-width: 1200px;margin:auto">
            <show_floorTexture_product :selectedTexture="selectedProduct" v-if="(selectedProduct !== null) && (product_type==='floor')" />
            <show_wallTexture_product :selectedTexture="selectedProduct" v-if="(selectedProduct !== null) && (product_type==='wall')" />
            <show_furniture_product :selectedProduct="selectedProduct" v-if="(selectedProduct !== null) && (product_type==='product') && (selectedProduct.category.name !=='Light')" />
            
            <show_Light_product_3D :selectedProduct="selectedProduct" v-if="selectedProduct && (product_type==='product') && selectedProduct.category.name === 'Light' && selectedProduct.light_type=='hanging'" @back_product_list="backToList" />
            <show_Light_product_sunk :selectedProduct="selectedProduct" v-if="selectedProduct && (product_type==='product') && selectedProduct.category.name ==='Light' && selectedProduct.light_type=='sunk'" @back_product_list="backToList" />
            <show_Light_product_unsunk :selectedProduct="selectedProduct" v-if="selectedProduct && (product_type==='product') && selectedProduct.category.name ==='Light' && selectedProduct.light_type=='unsunk'" @back_product_list="backToList" />
            
            <br>
            
            <!-- Products Section -->
            <div style="padding:10px;background-color: white;border-radius:10px;border:2px solid rgba(128, 128, 128, 0.16);">
                <h3>View more Products</h3>
                
                <div style="text-align: center; padding: 0px;">
                    <!-- Loading State -->
                    <div v-if="loading" style="padding: 40px;">
                        <a-spin size="large" />
                    </div>
                    
                    <!-- Products Display -->
                    <buisnes_products_sailing v-else :products="our_products" /> 
                    
                    <!-- Pagination -->
                    <div v-if="!loading && totalProducts > 0" style="margin-top: 20px; padding: 20px; text-align: center;">
                        <a-pagination
                            v-model:current="currentPage"
                            v-model:pageSize="pageSize"
                            :total="totalProducts"
                            :show-size-changer="true"
                            :show-total="total => `Total ${total} products`"
                            :page-size-options="['10', '20', '30', '50', '100']"
                            @change="handlePageChange"
                            @showSizeChange="handlePageSizeChange"
                        />
                    </div>
                    
                    <!-- Empty State -->
                    <div v-if="!loading && our_products.length === 0" style="padding: 40px;">
                        <a-empty description="No products found" />
                    </div>
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

// different Light Products Details Component 
import show_Light_product_sunk from '@/components/general_user/product_details/light_product_sunk.vue'
import show_Light_product_unsunk from '@/components/general_user/product_details/light_product_ununk.vue'
import show_Light_product_3D from '@/components/general_user/product_details/light_product_3d.vue'

import buisnes_products_sailing from '@/components/general_user/buisness_page/products_sailing.vue'

export default {
    name: 'products_details',
    components: {
        buisnes_products_sailing,
        show_floorTexture_product,
        show_wallTexture_product,
        show_furniture_product,
        show_Light_product_sunk,
        show_Light_product_unsunk,
        show_Light_product_3D,
    },
    data() {
        return {
            selectedProduct: null,
            product_id: this.$route.params.product_id,
            product_type: this.$route.params.product_type,
            buisness_name: this.$route.params.buisness_name,
            our_products: [],
            
            // Pagination data
            currentPage: 1,
            pageSize: 10,
            totalProducts: 0,
            loading: false,
            error: null
        }
    },
    mounted() {
        this.fetchProductDetails()
        this.loadBusinessProducts()
    },
    methods: {
        async loadBusinessProducts(page = 1, page_size = null) {
            try {
                this.loading = true;
                this.error = null;
                
                const token = localStorage.getItem('token');
                
                // Build URL with pagination parameters
                const params = new URLSearchParams({
                    page: page,
                    page_size: page_size || this.pageSize
                });
                
                const url = `${this.$store.state.root_api}Auth/api/business/products-sold/${this.buisness_name}?${params}`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const result = await response.json();
                
                console.log('Pagination Response:', result);
                
                if (result.results && result.results.success) {
                    this.our_products = result.results.data;
                    this.totalProducts = result.count || 0;
                } else {
                    this.error = result.message || 'Business not found';
                    this.our_products = [];
                    this.totalProducts = 0;
                }
            } catch (error) {
                console.error('Error loading business data:', error);
                this.error = 'Failed to load business information';
                this.our_products = [];
                this.totalProducts = 0;
            } finally {
                this.loading = false;
            }
        },
        
        handlePageChange(page, pageSize) {
            console.log('Page changed to:', page);
            this.currentPage = page;
            this.loadBusinessProducts(page, pageSize);
            
            // Optional: Scroll to top of products section
            this.scrollToProducts();
        },
        
        handlePageSizeChange(current, size) {
            console.log('Page size changed to:', size);
            this.pageSize = size;
            this.currentPage = 1; // Reset to first page when changing page size
            this.loadBusinessProducts(1, size);
            
            // Optional: Scroll to top of products section
            this.scrollToProducts();
        },
        
        scrollToProducts() {
            // Smooth scroll to products section
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },

        async fetchProductDetails() {
            try {
                let url_product_details = `${this.$store.state.root_api}product/api/light-details/${this.product_id}/`
                
                if (this.product_type === 'wall') {
                    url_product_details = `${this.$store.state.root_api}product/api/wall-details/${this.product_id}/`
                }
                if (this.product_type === 'floor') {
                    url_product_details = `${this.$store.state.root_api}product/api/floor-details/${this.product_id}/`
                }
                if (this.product_type === 'product') {
                    url_product_details = `${this.$store.state.root_api}product/api/product-details/${this.product_id}/`
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

<style scoped>
/* Optional: Add custom styling for pagination */
.ant-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>