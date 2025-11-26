<template>
  <div>
    
    
    <div style="padding:10px;background:white;border-radius:10px;border: 1px solid rgba(0,0,0,0.1)">
           

                <!-- Grid View -->
                <div v-if="viewMode === 'grid'" class="main">
                    <div class="products-list">
                        <a-tabs v-model:activeKey="active_tab">
                            <a-tab-pane key="Furniture" tab="Furniture" >
                            <div v-if="!filteredProducts?.length"  style="height:70vh;gap:20px;;flex-direction:column;display: flex;justify-content: center;align-items: center;">
                                  <a-empty :description="'No Furniture Available'"></a-empty>

                                <a-button type="primary" @click="addProduct()">
                                    Add Furniture
                                </a-button>
                            </div>

                                <a-row v-else>
                                    <a-col v-for="product in filteredProducts" :key="product.id" 
                                        class="product-responsive" style="padding:5px;">
                                        <div class="product">
                                            <div class="product-image-container" @click="viewProduct(product)">
                                                <img 
                                                    :src="$store.state.root_media_api + product.image" 
                                                    :alt="product.name"
                                                    class="product-image"
                                                />
                                                <!-- Category Badge -->
                                                <div class="category-badge">{{ product.category }}</div>
                                              
                                               
                                            </div>
                                            <!-- {{ truncateText(product.description || 'No description available', 8) }} -->

                                            <a-row>
                                                <a-col span="24">
                                                    <!-- <b>{{product.name}}</b> -->
                                                    <b>{{ truncateText(product.name || 'No name available', 19) }}</b>

                                                </a-col>
                                                
                                              
                                            

                                                <a-col span="17">
                                                    <a-button block @click="viewProduct(product)">Product Details</a-button>
                                                </a-col>
                                                
                                                <a-col span="1"></a-col>
                                                <a-col span="4">
                                                    <a-button><HeartFilled /></a-button>
                                                </a-col>
                                            </a-row>
                                        </div>
                                    </a-col>
                                </a-row>
                            
                            <div v-if="filteredProducts?.length > 0" style="display: flex; justify-content: center; margin-top: 20px; margin-bottom: 20px;">
    <a-pagination 
        v-model:current="productsPagination.currentPage"
        :total="productsPagination.totalCount"
        :page-size="productsPagination.pageSize"
        @change="handleProductsPageChange"
        show-total
        :show-size-changer="false"
    />
</div>
                            </a-tab-pane>
                            <a-tab-pane key="rooms" tab="rooms" >
                            <div v-if="!filteredrooms?.length"  style="height:70vh;gap:20px;;flex-direction:column;display: flex;justify-content: center;align-items: center;">
                                  <a-empty :description="'No rooms Available'"></a-empty>

                              
                            </div>

                                <a-row v-else>
                                    <a-col v-for="product in filteredrooms" :key="product.id" 
                                        class="product-responsive" style="padding:5px;">
                                        <div class="product">
                                            <div class="product-image-container" @click="viewProduct(product)">
                                                <img 
                                                    :src="$store.state.root_media_api + product.image" 
                                                    :alt="product.name"
                                                    class="product-image"
                                                />
                                                <!-- Category Badge -->
                                                <div class="category-badge">{{ product.category }}</div>
                                              
                                               
                                            </div>
                                            <!-- {{ truncateText(product.description || 'No description available', 8) }} -->

                                            <a-row>
                                                <a-col span="24">
                                                    <!-- <b>{{product.name}}</b> -->
                                                    <b>{{ truncateText(product.name || 'No name available', 19) }}</b>

                                                </a-col>
                                                
                                              
                                            

                                                <a-col span="17">
                                                    <a-button block @click="viewProduct(product)">Product Details</a-button>
                                                </a-col>
                                                
                                                <a-col span="1"></a-col>
                                                <a-col span="4">
                                                    <a-button><HeartFilled/></a-button>
                                                </a-col>
                                            </a-row>
                                        </div>
                                    </a-col>
                                </a-row>
                            
                            <div v-if="filteredrooms?.length > 0" style="display: flex; justify-content: center; margin-top: 20px; margin-bottom: 20px;">
                                    <a-pagination 
                                        v-model:current="roomPagination.currentPage"
                                        :total="roomPagination.totalCount"
                                        :page-size="roomPagination.pageSize"
                                        @change="handleProductsPageChange"
                                        show-total
                                        :show-size-changer="false"
                                    />
                            </div>
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                </div>

                <!-- Table View -->
               
        
  </div>
  </div>
</template>

<script>
import {HeartOutlined,ExclamationCircleOutlined,HeartFilled} from '@ant-design/icons-vue'
import product_details from '@/components/store/product_details.vue'
// import edit_product from '@/components/store/edit_product.vue'
// import add_new_product from '@/components/store/add_new_product.vue'

import { Modal } from 'ant-design-vue';

import { createVNode } from 'vue';

// add new
import add_new_floorTexture from '@/components/dashboard/business/my_products/add_new_product/add_floor_texture.vue' 
import add_new_wallTexture from '@/components/dashboard/business/my_products/add_new_product/add_wall_texture.vue'
import add_new_Light from '@/components/dashboard/business/my_products/add_new_product/add_light.vue'
import add_new_furniture from '@/components/dashboard/business/my_products/add_new_product/add_furniture.vue'


// update_existing
import edit_floorTexture from '@/components/dashboard/business/my_products/update_product/floor_texture.vue' 
import edit_wallTexture from '@/components/dashboard/business/my_products/update_product/wall_texture.vue'
import edit_furniture from '@/components/dashboard/business/my_products/update_product/furniture.vue'

import edit_Light from '@/components/dashboard/business/my_products/update_product/light.vue'
import edit_Light_hanging_3d from '@/components/dashboard/business/my_products/update_product/light_hanging_3d.vue'
import edit_Light_sunk from '@/components/dashboard/business/my_products/update_product/light_sunk.vue'
import edit_Light_unsunk from '@/components/dashboard/business/my_products/update_product/light_unsunk.vue'

// show existing
import show_floorTexture_product from '@/components/dashboard/business/my_products/product_details/floor_texture.vue' 
import show_wallTexture_product from '@/components/dashboard/business/my_products/product_details/wall_texture.vue'
import show_furniture_product from '@/components/dashboard/business/my_products/product_details/furniture_product.vue'

// differentt Light Products Details Component 
import show_Light_product_sunk from '@/components/dashboard/business/my_products/product_details/light_product_sunk.vue'
import show_Light_product_unsunk from '@/components/dashboard/business/my_products/product_details/light_product_ununk.vue'
import show_Light_product_3D from '@/components/dashboard/business/my_products/product_details/light_product_3d.vue'
import add_furniture_modal_local_3d_model from '@/components/dashboard/business/my_products/add_new_product/add_furniture_modal_local_3d_model.vue'
import add_light_modal_local_3d_model from '@/components/dashboard/business/my_products/add_new_product/add_light_modal_local_3d_model.vue'

export default {
    name: 'my_wishlist',
    components:{
        HeartOutlined,
        HeartFilled,
        ExclamationCircleOutlined,
        product_details,
        // edit_product,
        // add_new_product,

        // add new Create API show the modal 
        add_new_floorTexture,
        add_new_wallTexture,
        add_new_Light,
        add_new_furniture,
        add_furniture_modal_local_3d_model,
        add_light_modal_local_3d_model,

        // edit_update
        edit_floorTexture,
        edit_wallTexture,
        edit_Light,
        edit_furniture,

        // show_product_details
        show_floorTexture_product,
        show_wallTexture_product,
        show_furniture_product,


        // show_Light_product,
        show_Light_product_sunk,
        show_Light_product_unsunk,
        show_Light_product_3D,

        // update_Light_product,
        edit_Light_hanging_3d,
        edit_Light_sunk,
        edit_Light_unsunk,
    },
    data() {
        return {
            currentView: 'list', // 'list', 'details', 'edit'
            viewMode: 'grid', // 'grid', 'table'
            active_tab: "Furniture",
            searchQuery: '',
            selectedProduct: null,

            // popup for the add new product where user will need to choose the local 3d model or the DYD generated 3d model there
            open_add_newProductModal:false,
            show_add_new_product_locally_3d_model:false,
            
            open_add_newLightModal:false,
            show_add_new_light_product_locally_3d_model:false,

            editingProduct: null,
            originalProduct: null,
            showAddProduct: false,
            show_add_new_floor_texture: false,
            show_add_new_wall_texture: false,
            show_add_new_light: false,
            categories_available: [],
            types: [],
            columns: [
                {
                    title: '',
                    key: 'serial',
                    width: 40,
                },
                {
                    title: 'Product',
                    key: 'product',
                    width: 200,
                },
                {
                    title: 'Category',
                    key: 'category',
                    width: 70,
                },
                {
                    title: 'Type',
                    key: 'type',
                    width: 70,
                },
                {
                    title: 'Create date',
                    key: 'createDate',
                    width: 120,
                },
                {
                    title: 'Size',
                    key: 'dimensions',
                    width: 100,
                },
                {
                    title: 'Color',
                    key: 'colors',
                    width: 80,
                },
                {
                    title: 'Price',
                    key: 'price',
                    width: 40,
                },
                {
                    title: 'AR/VR',
                    key: 'actions',
                    width: 80,
                },
            ],
            products: [],
            wall:[],
            floor:[],
            myLights:[],


        // Pagination states for Products
        productsPagination: {
            currentPage: 1,
            pageSize: 20,
            totalCount: 0,
            totalPages: 0
        },
        
        // Pagination states for Lights
        lightsPagination: {
            currentPage: 1,
            pageSize: 20,
            totalCount: 0,
            totalPages: 0
        },
        
        // Pagination states for Wall
        wallPagination: {
            currentPage: 1,
            pageSize: 20,
            totalCount: 0,
            totalPages: 0
        },
        
        // Pagination states for Floor
        floorPagination: {
            currentPage: 1,
            pageSize: 20,
            totalCount: 0,
            totalPages: 0
        },
        roomPagination: {
            currentPage: 1,
            pageSize: 20,
            totalCount: 0,
            totalPages: 0
        },
        }
    },
    computed: {
        filteredProducts() {
            console.log('reached inside filtered products')
            if (!this.searchQuery) return this.products;
            return this.products.filter(product =>
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.category.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.furniture_type.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        filteredrooms() {
            console.log('reached inside filtered rooms')
            if (!this.searchQuery) return this.rooms;
            return this.rooms.filter(room =>
                room.name.toLowerCase().includes(this.searchQuery.toLowerCase()) 
                
            );
        }
    },
    mounted() {
        this.fetchMyProducts()
        // this.fetchMyLights()
        // this.fetchMyWallTextureProducts()
        // this.fetchMyFloorTextureProducts()
        this.fetchMyRooms()
    },
    methods: {

          delete_product(e){
            console.log('clicked delete')
            console.log(e)
            if (e['product_type'] =='wall'){
                this.deleteWallTexture(e['product_id'])
            }
            if (e ['product_type']=='Floor'){
                this.deleteFloorTexture(e['product_id'])
            }
            if (e['product_type'] =='Light'){
                this.deleteLight(e['product_id'])
            }
            if (e['product_type'] =='Furniture'){
                this.deleteFurniture(e['product_id'])
            }
        },

        deleteWallTexture(product_id){
            Modal.confirm({
                title: 'Delete Wall Texture',
                icon: createVNode(ExclamationCircleOutlined),
                content: 'Are you sure you want to delete this wall texture? This action cannot be undone.',
                okText: 'Delete',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: async () => {
                    try {
                        let url_delete_product = `${this.$store.state.root_api}room/api-owner/walls/${product_id}/`

                        const token = localStorage.getItem('token');
                        const response = await fetch(`${url_delete_product}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Token ${token}`
                            }
                        });

                        if (response.ok) {
                            this.$message.success('Wall texture deleted successfully');
                            this.currentView = 'list'
                            this.selectedProduct = null
                            this.fetchMyWallTextureProducts()
                        } else {
                            this.$message.error('Failed to delete wall texture');
                            console.error('Delete failed with status:', response.status);
                        }
                    } catch (error) {
                        this.$message.error('Error deleting wall texture');
                        console.error('Error deleting wall texture:', error);
                    }
                },
                onCancel() {
                    console.log('Delete cancelled');
                }
            });
        },

        deleteFloorTexture(product_id){
            console.log("clicked on delete FloorTexture")
            Modal.confirm({
                title: 'Delete Floor Texture',
                icon: createVNode(ExclamationCircleOutlined),
                content: 'Are you sure you want to delete this floor texture? This action cannot be undone.',
                okText: 'Delete',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: async () => {
                    try {
                        let url_delete_product = `${this.$store.state.root_api}room/api-owner/floors/${product_id}/`

                        const token = localStorage.getItem('token');
                        const response = await fetch(`${url_delete_product}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Token ${token}`
                            }
                        });

                        if (response.ok) {
                            this.$message.success('Floor texture deleted successfully');
                            this.currentView = 'list'
                            this.selectedProduct = null
                            this.fetchMyFloorTextureProducts()
                        } else {
                            this.$message.error('Failed to delete floor texture');
                            console.error('Delete failed with status:', response.status);
                        }
                    } catch (error) {
                        this.$message.error('Error deleting floor texture');
                        console.error('Error deleting floor texture:', error);
                    }
                },
                onCancel() {
                    console.log('Delete cancelled');
                }
            });
        },

        deleteLight(product_id){
            Modal.confirm({
                title: 'Delete Light',
                icon: createVNode(ExclamationCircleOutlined),
                content: 'Are you sure you want to delete this light? This action cannot be undone.',
                okText: 'Delete',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: async () => {
                    try {
                        let url_delete_product = `${this.$store.state.root_api}product/api-product-owner/lights/${product_id}/`

                        const token = localStorage.getItem('token');
                        const response = await fetch(`${url_delete_product}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Token ${token}`
                            }
                        });

                        if (response.ok) {
                            this.$message.success('Light deleted successfully');
                            this.currentView = 'list'
                            this.selectedProduct = null
                            this.fetchMyLights()
                        } else {
                            this.$message.error('Failed to delete light');
                            console.error('Delete failed with status:', response.status);
                        }
                    } catch (error) {
                        this.$message.error('Error deleting light');
                        console.error('Error deleting light:', error);
                    }
                },
                onCancel() {
                    console.log('Delete cancelled');
                }
            });
        },

        deleteFurniture(product_id){
            Modal.confirm({
                title: 'Delete Furniture',
                icon: createVNode(ExclamationCircleOutlined),
                content: 'Are you sure you want to delete this furniture? This action cannot be undone.',
                okText: 'Delete',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: async () => {
                    try {
                        let url_delete_product = `${this.$store.state.root_api}product/api-product-owner/products/${product_id}/`

                        const token = localStorage.getItem('token');
                        const response = await fetch(`${url_delete_product}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Token ${token}`
                            }
                        });

                        if (response.ok) {
                            this.$message.success('Furniture deleted successfully');
                            this.currentView = 'list'
                            this.selectedProduct = null
                            this.fetchMyProducts()
                        } else {
                            this.$message.error('Failed to delete furniture');
                            console.error('Delete failed with status:', response.status);
                        }
                    } catch (error) {
                        this.$message.error('Error deleting furniture');
                        console.error('Error deleting furniture:', error);
                    }
                },
                onCancel() {
                    console.log('Delete cancelled');
                }
            });
        },

        clicked_cancel_add_new_light(){
            this.show_add_new_light=false
        },

        handleProductsPageChange(page) {
    this.productsPagination.currentPage = page;
    this.fetchMyProducts(page);
},

handleLightsPageChange(page) {
    this.lightsPagination.currentPage = page;
    this.fetchMyLights(page);
},

handleWallPageChange(page) {
    this.wallPagination.currentPage = page;
    this.fetchMyWallTextureProducts(page);
},

handleFloorPageChange(page) {
    this.floorPagination.currentPage = page;
    this.fetchMyFloorTextureProducts(page);
},
handleRoomsPageChange(page) {
    this.roomPagination.currentPage = page;
    this.fetchMyrooms(page);
},

//         truncateText(text, wordLimit) {
//   if (!text) return '';
//   const words = text.split(' ');
//   if (words.length <= wordLimit) return text;
//   return words.slice(0, wordLimit).join(' ') + '...';
// },

truncateText(text, charLimit = 7) {
            if (!text) return '';
            if (text.length <= charLimit) return text;
            return text.slice(0, charLimit) + '...';
        },
        filteredProductsByType(type) {
            const filtered = this.filteredProducts.filter(product => 
                product.furniture_type === type || product.category.name === type
            );
            return filtered;
        },
        formatDate(isoString) {
            const date = new Date(isoString);
            const options = { year: "numeric", month: "long", day: "numeric" };
            return date.toLocaleDateString("en-US", options);
        },
        // async fetchMyProducts() {
        //     try {
        //         const token = localStorage.getItem('token');
        //         const response = await fetch(`${this.$store.state.root_api}product/api-product-owner/products/`, {
        //             method: 'GET',
        //             headers: {
        //                 'Authorization': `Token ${token}`
        //             }
        //         });
        //         const result = await response.json();
        //         if (result.success) {
        //             const data = result.data;
        //             this.products = data
        //         }
        //     } catch (error) {
        //         console.error('Error loading business profile:', error);
        //     }
        // },

        // async addFaveroitProduct(productid, product_type){
        //     // product_type = light / room / furniture / wall_texture / floor_texture 
        //     try {
        //         console.log('reached inside fetch my products ')
        //         const token = localStorage.getItem('token');
        //         const response = await fetch(
        //             `${this.$store.state.root_api}likes/favorites/toggle/`,
        //             {
        //                 method: 'POST',
        //                 body: JSON.stringify({
        //                     id: productid,
        //                     prodyct_type: product_type
        //                 }),
        //                 headers: {
        //                     'Authorization': `Token ${token}`
        //                 }
        //             }
        //         );
        //         const result = await response.json();
        //         if (result.success) {
        //             console.log('result:- ',result.data)
        //             this.products = result.data;
        //             // Update pagination info from response
        //             this.productsPagination.totalCount = result.total_count;
        //             this.productsPagination.totalPages = result.total_pages;
        //             this.productsPagination.currentPage = result.page;
        //         }
        //     } catch (error) {
        //         console.error('Error loading products:', error);
        //         this.$message.error('Error loading products');
        //     }
        // },

        async fetchMyProducts(page = 1) {
    try {
        console.log('reached inside fetch my products ')
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${this.$store.state.root_api}likes/favorites/?page=${page}&page_size=${this.productsPagination.pageSize}&item_type=furniture,wall_texture,floor_texture`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`
                }
            }
        );
        const result = await response.json();
        if (result.success) {
            console.log('result:- ',result.data)
            this.products = result.data;
            // Update pagination info from response
            this.productsPagination.totalCount = result.total_count;
            this.productsPagination.totalPages = result.total_pages;
            this.productsPagination.currentPage = result.page;
        }
    } catch (error) {
        console.error('Error loading products:', error);
        this.$message.error('Error loading products');
    }
},
     async fetchMyRooms(page = 1) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${this.$store.state.root_api}likes/favorites/?page=${page}&page_size=${this.roomPagination.pageSize}&item_type=room`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`
                }
            }
        );
        const result = await response.json();
        if (result.success) {
            this.rooms = result.data;
            this.roomPagination.totalCount = result.total_count;
            this.roomPagination.totalPages = result.total_pages;
            this.roomPagination.currentPage = result.page;
        }
    } catch (error) {
        console.error('Error loading room ', error);
        this.$message.error('Error loading room ');
    }
},
        //  async fetchMyLights() {
        //     try {
        //         const token = localStorage.getItem('token');
        //         const response = await fetch(`${this.$store.state.root_api}product/api-product-owner/lights/`, {
        //             method: 'GET',
        //             headers: {
        //                 'Authorization': `Token ${token}`
        //             }
        //         });
        //         const result = await response.json();
        //         if (result.success) {
        //             const data = result.data;
        //             this.myLights = data
        //         }
        //     } catch (error) {
        //         console.error('Error loading business profile:', error);
        //     }
        // },
        async fetchMyLights(page = 1) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${this.$store.state.root_api}product/api-product-owner/lights/?page=${page}&page_size=${this.lightsPagination.pageSize}&is_favorite=true`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`
                }
            }
        );
        const result = await response.json();
        if (result.success) {
            this.myLights = result.data;
            // Update pagination info from response
            this.lightsPagination.totalCount = result.total_count;
            this.lightsPagination.totalPages = result.total_pages;
            this.lightsPagination.currentPage = result.page;
        }
    } catch (error) {
        console.error('Error loading lights:', error);
        this.$message.error('Error loading lights');
    }
},
        // async fetchMyWallTextureProducts() {
        //     try {
        //         const token = localStorage.getItem('token');
        //         const response = await fetch(`${this.$store.state.root_api}room/api-owner/wall/`, {
        //             method: 'GET',
        //             headers: {
        //                 'Authorization': `Token ${token}`
        //             }
        //         });
        //         const result = await response.json();
        //         if (result.success) {
        //             const data = result.data;
        //             this.wall = data
        //         }
        //     } catch (error) {
        //         console.error('Error loading business profile:', error);
        //     }
        // },
        async fetchMyWallTextureProducts(page = 1) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${this.$store.state.root_api}room/api-owner/wall/?page=${page}&page_size=${this.wallPagination.pageSize}&is_favorite=true`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`
                }
            }
        );
        const result = await response.json();
        if (result.success) {
            this.wall = result.data;
            this.wallPagination.totalCount = result.total_count;
            this.wallPagination.totalPages = result.total_pages;
            this.wallPagination.currentPage = result.page;
        }
    } catch (error) {
        console.error('Error loading wall textures:', error);
        this.$message.error('Error loading wall textures');
    }
},
        // async fetchMyFloorTextureProducts() {
        //     try {
        //         const token = localStorage.getItem('token');
        //         const response = await fetch(`${this.$store.state.root_api}room/api-owner/floor/`, {
        //             method: 'GET',
        //             headers: {
        //                 'Authorization': `Token ${token}`
        //             }
        //         });
        //         const result = await response.json();
        //         if (result.success) {
        //             const data = result.data;
        //             this.floor = data
        //         }
        //     } catch (error) {
        //         console.error('Error loading business profile:', error);
        //     }
        // },
        async fetchMyFloorTextureProducts(page = 1) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `${this.$store.state.root_api}room/api-owner/floor/?page=${page}&page_size=${this.floorPagination.pageSize}&is_favorite=true`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`
                }
            }
        );
        const result = await response.json();
        if (result.success) {
            this.floor = result.data;
            this.floorPagination.totalCount = result.total_count;
            this.floorPagination.totalPages = result.total_pages;
            this.floorPagination.currentPage = result.page;
        }
    } catch (error) {
        console.error('Error loading floor textures:', error);
        this.$message.error('Error loading floor textures');
    }
},
        async fetchProductDetails(product_id) {
            try {
                let url_product_details=`${this.$store.state.root_api}product/api-product-owner/products/${product_id}`
                if (this.active_tab === 'Wall'){
                    url_product_details=`${this.$store.state.root_api}room/api-owner/walls/${product_id}`
                }
                if (this.active_tab === 'Floor'){
                    url_product_details=`${this.$store.state.root_api}room/api-owner/floors/${product_id}`
                }
                if (this.active_tab === 'Light'){
                    url_product_details=`${this.$store.state.root_api}room/api-owner/lights/${product_id}`
                }
                const token = localStorage.getItem('token');
                const response = await fetch(`${url_product_details}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                const result = await response.json();
                if (result.success) {
                    const data = result.data;
                    console.log(data)
                    this.selectedProduct = data;
                    this.categories_available = result.categories_available
                    this.types = result.types
                }
            } catch (error) {
                console.error('Error loading business profile:', error);
            }
        },
        viewProduct(product) {
            this.fetchProductDetails(product.id)
            this.currentView = 'details';
        },
        backToList() {
            this.currentView = 'list';
            this.selectedProduct = null;
        },
        editProduct(product) {
            this.editingProduct = JSON.parse(JSON.stringify(product));
            this.originalProduct = product;
            this.currentView = 'edit';
        },
        cancelEdit() {
            this.editingProduct = null;
            this.originalProduct = null;
            if (this.selectedProduct) {
                this.currentView = 'details';
            } else {
                this.currentView = 'list';
            }
        },
        saveProduct() {
            if (this.editingProduct) {
                const index = this.products.findIndex(p => p.id === this.editingProduct.id);
                if (index !== -1) {
                    this.editingProduct.dimensions = `${this.editingProduct.length} in W x ${this.editingProduct.height} H`;
                    this.editingProduct.fullDimensions = `${this.editingProduct.length} in W x ${this.editingProduct.width} In D x ${this.editingProduct.height} in H`;
                    this.products.splice(index, 1, this.editingProduct);
                    this.selectedProduct = this.editingProduct;
                }
            }
            this.editingProduct = null;
            this.originalProduct = null;
            this.currentView = this.selectedProduct ? 'details' : 'list';
        },
        deleteProduct(product) {
            if (confirm(`Are you sure you want to delete ${product.name}?`)) {
                const index = this.products.findIndex(p => p.id === product.id);
                if (index !== -1) {
                    this.products.splice(index, 1);
                }
                if (this.selectedProduct && this.selectedProduct.id === product.id) {
                    this.selectedProduct = null;
                    this.currentView = 'list';
                }
            }
        },
        addProduct() {
        this.open_add_newProductModal=true
            // this.showAddProduct = !this.showAddProduct
        // this.$router.push("/my-products/add-new-furniture");
        },
        addLightProduct() {
        this.open_add_newLightModal=true
            // this.showAddProduct = !this.showAddProduct
        
        // this.$router.push("/my-products/add-new-furniture");
            
        },
        add_Product_For(selected_add_newProductModal){
            if (selected_add_newProductModal ==='DYD_AI'){
            this.$router.push("/my-products/add-new-furniture");}
        else{
            this.show_add_new_product_locally_3d_model=true
            console.log(selected_add_newProductModal)
        }
        },
        add_Product_Light_For(selected_add_newProductModal){
            if (selected_add_newProductModal ==='DYD_AI'){
            // this.$router.push("/my-products/add-new-furniture");
            this.$router.push('/my-products/add-new-light');
        }
        else{
            this.show_add_new_light_product_locally_3d_model=true
            console.log(selected_add_newProductModal)
        }
        },
        // Event handlers from add_new_product component
        onProductCreated(newProduct) {
            this.products.push(newProduct);
            this.showAddProduct = false;
            this.fetchMyProducts(); // Refresh the list
        },
        onLightProductCreated(newLightProduct){
            this.myLights.push(newLightProduct);
            this.open_add_newLightModal=false;
            this.show_add_new_light_product_locally_3d_model=false;
            this.show_add_new_light=false;
            this.fetchMyLights()
        },
        onCancel() {
            this.showAddProduct = false;
        },
        // Image handling methods
        handleMainImageChange(event) {
            const file = event.target.files[0];
            if (file && this.editingProduct) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.editingProduct.image = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        handleGalleryImageChange(event) {
            const files = Array.from(event.target.files);
            if (files.length && this.editingProduct) {
                files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.editingProduct.gallery.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                });
            }
        }
    }
}
</script>


<style scoped>
.main{
    padding:10px;
    border-radius:20px;
    /* height: 100vh; */
  min-height:85vh;
    background: white;
    border:2px solid rgba(128, 128, 128, 0.16);
    margin-top:10px;
    margin-bottom:10px;
}
.head-section{
    display:flex;
    justify-content: space-between;
}
.product{
    padding:10px;
    margin-bottom:10px;
    border-radius:10px;
    background:#f3f2f4;
}
.products-list{
    padding-bottom:20px;
    
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
  width:50%;
  flex: 0 0 50%;
}

@media (min-width: 576px) { .product-responsive { width: 50%; flex: 0 0 50%; } }
@media (min-width: 768px) { .product-responsive { width: 33.333%; flex: 0 0 33.333%; } }
@media (min-width: 992px) { .product-responsive { width: 25%; flex: 0 0 25%; } }
@media (min-width: 1200px) { .product-responsive { width: 20%; flex: 0 0 20%; } }
</style>