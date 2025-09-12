<template>
    <br>
<add_new_product 
    v-model:visible="showAddProduct"
    :categories_available="categories_available"
    :types="types"
    @product-created="onProductCreated"
    @cancel="onCancel"
  />
      <div style="padding:10px;background:white;border-radius:10px;border: 1px solid rgba(0,0,0,0.1)">
        <!-- Product List View -->
        <div v-if="currentView === 'list'">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 24px; font-weight: 600;">Manage Products <span
                        style="color: #666; font-size: 16px;">({{ products.length }})</span></h2>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <div style="position: relative;">
                        <input type="text" placeholder="Search Product" v-model="searchQuery"
                            style="padding: 5px 12px 5px 35px; border: 1px solid #ddd; border-radius: 6px; width: 200px;outline:none">
                        <svg style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #999;"
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </div>
                    <a-button @click="addProduct" type="primary">
                        <span style="margin-right: 5px;">+</span> Add Product
                    </a-button>
                </div>
            </div>

            <!-- Product Table Header -->

            <a-table :columns="columns" :data-source="filteredProducts" row-key="id" :pagination="false"
                :scroll="{ x: 800 }" style="background: white; border-radius: 8px; overflow: hidden; cursor:pointer">
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.key === 'serial'">
                        <span style="font-weight: 600; color: #666;">{{ index + 1 }}</span>
                    </template>

                    <template v-if="column.key === 'product'">
                        <div @click="viewProduct(record)"
                            style="display: flex; gap: 12px; align-items: center; cursor: pointer;">
                            <img :src="this.$store.state.root_api + record.primary_image"
                                style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">
                            <div>
                                <div style="font-weight: 600; color: #333; margin-bottom: 4px;">{{ record.name }}</div>
                                <a href="#" style="color: #4F46E5; font-size: 12px; text-decoration: none;">Contact
                                    Info</a>
                                <div style="font-size: 12px; color: #666; margin-top: 2px;">{{ record.short_description
                                    }}</div>
                            </div>
                        </div>
                    </template>

                    <template v-if="column.key === 'category'">
                        <span>{{ record.category.name }}</span>
                    </template>

                    <template v-if="column.key === 'type'">
                        <span>{{ record.furniture_type }}</span>
                    </template>

                    <template v-if="column.key === 'createDate'">
                        <span>{{ formatDate(record.created_at) }}</span>
                    </template>

                    <template v-if="column.key === 'dimensions'">
                        <span style="font-size: 12px;">{{ record.diamenstions }}</span>
                    </template>

                    <template v-if="column.key === 'colors'">
                        <div style="display: flex; gap: 3px;">
                           <div style="display: flex; align-items: center; gap: 6px;">
  <div
    v-for="(color, index) in record.colors.slice(0, 3)"
    :key="index"
    :style="{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: color }"
  ></div>

  <span v-if="record.colors.length > 3">...</span>
</div>
                        </div>
                    </template>

                    <template v-if="column.key === 'price'">
                        <span style="font-weight: 600; color: #333;"><del style="font-size: 10px;">${{ record.pricing.price }}</del>&nbsp;${{ record.pricing.sale_price }}</span>
                    </template>

                    <template v-if="column.key === 'actions'">
                        <div style="display: flex; gap: 5px;">
                            <button
                                style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #64748b; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">AR</button>
                            <button @click="editProduct(record)"
                                style="background: #4F46E5; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button @click="deleteProduct(record)"
                                style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <polyline points="3,6 5,6 21,6"></polyline>
                                    <path
                                        d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </template>
                </template>
            </a-table>

        </div>

        <!-- Product Details View -->
        <div v-if="currentView === 'details'" style="max-width: 1200px;">
            <!-- {{selectedProduct}} -->
            <product_details :selectedProduct="selectedProduct" v-if="selectedProduct" @edit_product="editProduct" @delete_product="delete_product" @back_product_list="backToList"/>
        </div>

        <!-- Edit Product View -->
        <div v-if="currentView === 'edit'" style="max-width: 1200px;">
            <!-- {{selectedProduct}} -->
            <edit_product :selectedProduct="selectedProduct" v-if="selectedProduct" :categories_available="categories_available" :types="types" @cancel_edit_back_product_list="backToList" />
        </div>

        <!-- Hidden file inputs for image uploads -->
        <input ref="mainImageInput" type="file" accept="image/*" style="display: none" @change="handleMainImageChange">
        <input ref="galleryImageInput" type="file" accept="image/*" multiple style="display: none"
            @change="handleGalleryImageChange">
    </div>
    <br>

</template>

<script>
import product_details from '@/components/store/product_details.vue'
import edit_product from '@/components/store/edit_product.vue'
import add_new_product from '@/components/store/add_new_product.vue'
export default {
    name: 'manage_products',
    components:{
        product_details,
        edit_product,
        add_new_product
    },
    data() {
        return {
            currentView: 'list', // 'list', 'details', 'edit'
            searchQuery: '',
            selectedProduct: null,
            editingProduct: null,
            originalProduct: null,
      
            showAddProduct: false,
             
            categories_available:[],
            types:[],
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
         products: []

        }
    },
    computed: {
        filteredProducts() {
            if (!this.searchQuery) return this.products;
            return this.products.filter(product =>
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.type.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    },
    mounted() {
        this.fetchMyProducts()
    },
    methods: {
        formatDate(isoString) {
            const date = new Date(isoString);
            const options = { year: "numeric", month: "long", day: "numeric" };
            return date.toLocaleDateString("en-US", options);
        },
        async fetchMyProducts() {

            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${this.$store.state.root_api}/product/api-product-owner/products/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });

                const result = await response.json();

                if (result.success) {
                    const data = result.data;
                    // console.log(data)
                    this.products = data
                }

            } catch (error) {
                console.error('Error loading business profile:', error);
            }
        },


        async fetchProductDetails(product_id) {

            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${this.$store.state.root_api}/product/api-product-owner/products/${product_id}`, {
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
                    this.categories_available=result.categories_available
                    this.types=result.types
                    // console.log(data)


                }

            } catch (error) {
                console.error('Error loading business profile:', error);
            }
        },
        viewProduct(product) {
            this.fetchProductDetails(product.id)
            // this.selectedProduct = product;
            // console.log(product.id)
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
                // Find and update the product in the array
                const index = this.products.findIndex(p => p.id === this.editingProduct.id);
                if (index !== -1) {
                    // Update dimensions string
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
            this.showAddProduct= !this.showAddProduct
            // const newId = Math.max(...this.products.map(p => p.id)) + 1;
            // const newProduct = {
            //     id: newId,
            //     name: 'New Product',
            //     description: 'Product description',
            //     longDescription: 'Detailed product description',
            //     category: 'Chair',
            //     type: 'Modern',
            //     createDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            //     dimensions: '24 in W x 36 H',
            //     fullDimensions: '24 in W x 24 In D x 36 in H',
            //     colors: ['#8B4513'],
            //     colorOptions: [{ name: 'Brown', hex: '#8B4513' }],
            //     textures: ['pattern1'],
            //     price: 100,
            //     image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            //     gallery: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'],
            //     height: 36,
            //     length: 24,
            //     width: 24,
            //     availableColors: ['#8B4513'],
            //     availableTextures: ['pattern1']
            // };

            // this.products.push(newProduct);
            // this.editProduct(newProduct);
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
        },

        addGalleryImage() {
            this.$refs.galleryImageInput.click();
        },

        removeGalleryImage(index) {
            if (this.editingProduct) {
                this.editingProduct.gallery.splice(index, 1);
            }
        },

        addColor() {
            const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            if (this.editingProduct) {
                this.editingProduct.availableColors.push(randomColor);
            }
        },

        removeColor(index) {
            if (this.editingProduct && this.editingProduct.availableColors.length > 1) {
                this.editingProduct.availableColors.splice(index, 1);
            }
        },

        addTexture() {
            if (this.editingProduct) {
                this.editingProduct.availableTextures.push('pattern' + (this.editingProduct.availableTextures.length + 1));
            }
        },

        removeTexture(index) {
            if (this.editingProduct && this.editingProduct.availableTextures.length > 1) {
                this.editingProduct.availableTextures.splice(index, 1);
            }
        },

        addUploadPer() {
            // Handle upload per functionality
            console.log('Add upload per clicked');
        }
    }
}
</script>