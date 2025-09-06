<template>
    <br>
    <div style="padding:10px;background:white;border-radius:10px;border: 1px solid rgba(0,0,0,0.1)">
        <!-- Product List View -->
        <div v-if="currentView === 'list'">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 24px; font-weight: 600;">Manage Products <span style="color: #666; font-size: 16px;">({{ products.length }})</span></h2>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <div style="position: relative;">
                        <input 
                            type="text" 
                            placeholder="Search Product" 
                            v-model="searchQuery"
                            style="padding: 5px 12px 5px 35px; border: 1px solid #ddd; border-radius: 6px; width: 200px;outline:none">
                        <svg style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #999;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
            
            <a-table
  :columns="columns"
  :data-source="filteredProducts"
  row-key="id"
  :pagination="false"
  :scroll="{ x: 800 }"
  style="background: white; border-radius: 8px; overflow: hidden; cursor:pointer"
>
  <template #bodyCell="{ column, record, index }">
    <template v-if="column.key === 'serial'">
      <span style="font-weight: 600; color: #666;">{{ index + 1 }}</span>
    </template>
    
    <template v-if="column.key === 'product'">
      <div @click="viewProduct(record)" style="display: flex; gap: 12px; align-items: center; cursor: pointer;">
        <img :src="record.image" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">
        <div>
          <div style="font-weight: 600; color: #333; margin-bottom: 4px;">{{ record.name }}</div>
          <a href="#" style="color: #4F46E5; font-size: 12px; text-decoration: none;">Contact Info</a>
          <div style="font-size: 12px; color: #666; margin-top: 2px;">{{ record.description }}</div>
        </div>
      </div>
    </template>
    
    <template v-if="column.key === 'category'">
      <span>{{ record.category }}</span>
    </template>
    
    <template v-if="column.key === 'type'">
      <span>{{ record.type }}</span>
    </template>
    
    <template v-if="column.key === 'createDate'">
      <span>{{ record.createDate }}</span>
    </template>
    
    <template v-if="column.key === 'dimensions'">
      <span style="font-size: 12px;">{{ record.dimensions }}</span>
    </template>
    
    <template v-if="column.key === 'colors'">
      <div style="display: flex; gap: 3px;">
        <div v-for="color in record.colors" :key="color" 
             :style="{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: color }"></div>
      </div>
    </template>
    
    <template v-if="column.key === 'price'">
      <span style="font-weight: 600; color: #333;">${{ record.price }}</span>
    </template>
    
    <template v-if="column.key === 'actions'">
      <div style="display: flex; gap: 5px;">
        <button style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #64748b; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">AR</button>
        <button @click="editProduct(record)" style="background: #4F46E5; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button @click="deleteProduct(record)" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
          </svg>
        </button>
      </div>
    </template>
  </template>
</a-table>

        </div>

        <!-- Product Details View -->
        <div v-if="currentView === 'details'" style="max-width: 1200px;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <button @click="backToList" style="background: none; border: none; cursor: pointer; margin-right: 15px; padding: 5px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15,18 9,12 15,6"></polyline>
                    </svg>
                </button>
                <h2 style="margin: 0; font-size: 24px; font-weight: 600;">{{ selectedProduct.name }}</h2>
                <div style="margin-left: auto; display: flex; gap: 10px;">
                    <button style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #64748b; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px; vertical-align: middle;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                        Create Variation
                    </button>
                    <div style="width: 40px; height: 40px; background: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">A</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <!-- Left Column - Images and 3D -->
                <div>
                    <div style="position: relative; margin-bottom: 20px;">
                        <img :src="selectedProduct.image" style="width: 100%; height: 400px; object-fit: cover; border-radius: 12px; background: #f8f9fa;">
                        <div style="position: absolute; bottom: 15px; right: 15px; background: white; padding: 8px 12px; border-radius: 6px; border: 1px solid #e9ecef; font-size: 12px; font-weight: 600; cursor: pointer;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px; vertical-align: middle;">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                            3D View
                        </div>
                    </div>

                    <div>
                        <h4 style="margin-bottom: 10px; font-size: 16px;">Images used to create 3d model</h4>
                        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                            <img v-for="img in selectedProduct.gallery" :key="img" :src="img" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 2px solid #e9ecef;">
                        </div>
                        
                        <h4 style="margin-bottom: 10px; font-size: 16px;">Upload Image</h4>
                        <div style="width: 80px; height: 80px; border: 2px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #f8f9fa;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="#9ca3af">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Product Details -->
                <div>
                    <div style="background: #f1f5f9; color: #64748b; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 15px;">
                        Product Details:
                    </div>
                    
                    <h1 style="font-size: 32px; font-weight: 700; margin: 0 0 15px 0; color: #111827;">{{ selectedProduct.name }}</h1>
                    
                    <p style="color: #6b7280; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">{{ selectedProduct.longDescription }}</p>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                        <div>
                            <div style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">Category:</div>
                            <div style="font-weight: 600; color: #111827;">{{ selectedProduct.category }}</div>
                        </div>
                        <div>
                            <div style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">Type:</div>
                            <div style="font-weight: 600; color: #111827;">{{ selectedProduct.type }}</div>
                        </div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <div style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">Dimensions:</div>
                        <div style="font-weight: 600; color: #111827;">{{ selectedProduct.fullDimensions }}</div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                        <div>
                            <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Color:</div>
                            <div style="display: flex; gap: 8px;">
                                <div v-for="color in selectedProduct.colorOptions" :key="color.name" 
                                     :style="{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: color.hex, border: '2px solid #e5e7eb' }"></div>
                            </div>
                        </div>
                        <div>
                            <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Texture:</div>
                            <div style="display: flex; gap: 8px;">
                                <div v-for="texture in selectedProduct.textures" :key="texture" 
                                     style="width: 32px; height: 32px; border-radius: 4px; border: 2px solid #e5e7eb;    background-size: cover;"></div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <div style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">Price:</div>
                        <div style="font-size: 28px; font-weight: 700; color: #4F46E5;">${{ selectedProduct.price }}</div>
                    </div>

                    <div style="display: flex; gap: 12px;">
                        <button @click="editProduct(selectedProduct)" style="background: #4F46E5; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; flex: 1;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit Product
                        </button>
                        <button @click="deleteProduct(selectedProduct)" style="background: #ef4444; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; flex: 1;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                            </svg>
                            Delete Product
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Product View -->
        <div v-if="currentView === 'edit'" style="max-width: 1200px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div style="display: flex; align-items: center;">
                    <button @click="cancelEdit" style="background: none; border: none; cursor: pointer; margin-right: 15px; padding: 5px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                    </button>
                    <h2 style="margin: 0; font-size: 24px; font-weight: 600;">Edit Product</h2>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button @click="cancelEdit" style="background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500;">Cancel</button>
                    <button @click="saveProduct" style="background: #4F46E5; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500;">Save</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <!-- Left Column - Photo and Images -->
                <div>
                    <h3 style="margin-bottom: 15px; font-size: 18px; font-weight: 600;">Photo</h3>
                    <p style="color: #6b7280; margin-bottom: 15px; font-size: 14px;">Recommended to upload a minimum of 20 pictures from every angle around the object.</p>
                    
                    <div style="margin-bottom: 20px;">
                        <div style="width: 100%; height: 200px; border: 2px dashed #cbd5e1; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #f8f9fa; margin-bottom: 15px;">
                            <img v-if="editingProduct.image" :src="editingProduct.image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
                            <div v-else style="text-align: center; color: #9ca3af;">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom: 10px;">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21,15 16,10 5,21"></polyline>
                                </svg>
                                <div>Upload Main Image</div>
                            </div>
                        </div>
                    </div>

                    <h4 style="margin-bottom: 10px; font-size: 16px;">Images used to create 3d model</h4>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
                        <div v-for="(img, index) in editingProduct.gallery" :key="index" style="position: relative;">
                            <img :src="img" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 2px solid #e9ecef;">
                            <button @click="removeGalleryImage(index)" style="position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; border: none; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; font-size: 12px;">×</button>
                        </div>
                        <div @click="addGalleryImage" style="width: 80px; height: 80px; border: 2px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #f8f9fa;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="#9ca3af">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="width: 40px; height: 40px; background: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">A</div>
                        <div style="width: 40px; height: 40px; background: #4F46E5; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">S</div>
                    </div>
                </div>

                <!-- Right Column - Product Details Form -->
                <div>
                    <h3 style="margin-bottom: 20px; font-size: 18px; font-weight: 600;">Product Details</h3>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #374151;">Name</label>
                        <input v-model="editingProduct.name" type="text" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #374151;">Description</label>
                        <textarea v-model="editingProduct.longDescription" rows="4" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; resize: vertical;"></textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #374151;">Category</label>
                            <select v-model="editingProduct.category" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                                <option>Chair</option>
                                <option>Table</option>
                                <option>Sofa</option>
                                <option>Ottoman</option>
                                <option>Bookshelf</option>
                                <option>Desk</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #374151;">Type</label>
                            <select v-model="editingProduct.type" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                                <option>Modern</option>
                                <option>Contemporary</option>
                                <option>Classic</option>
                                <option>Rustic</option>
                                <option>Vintage</option>
                                <option>Industrial</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #374151;">Price</label>
                            <input v-model="editingProduct.price" type="number" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 10px; font-weight: 500; color: #374151;">Dimensions</label>
                        <div style="display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto; gap: 10px; align-items: end;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #6b7280;">Height</label>
                                <input v-model="editingProduct.height" type="number" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
                            </div>
                            <span style="font-size: 12px; color: #6b7280; padding-bottom: 8px;">cm</span>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #6b7280;">Length</label>
                                <input v-model="editingProduct.length" type="number" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
                            </div>
                            <span style="font-size: 12px; color: #6b7280; padding-bottom: 8px;">cm</span>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #6b7280;">Width</label>
                                <input v-model="editingProduct.width" type="number" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;">
                            </div>
                            <span style="font-size: 12px; color: #6b7280; padding-bottom: 8px;">cm</span>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: #374151;">Color</label>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <div v-for="(color, index) in editingProduct.availableColors" :key="index" style="position: relative;">
                                    <div :style="{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: color, border: '2px solid #e5e7eb', cursor: 'pointer' }" @click="removeColor(index)"></div>
                                </div>
                                <div @click="addColor" style="width: 32px; height: 32px; border: 2px dashed #cbd5e1; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #f8f9fa;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="#9ca3af">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: #374151;">Upload per</label>
                            <div @click="addUploadPer" style="width: 32px; height: 32px; border: 2px dashed #cbd5e1; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #f8f9fa;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="#9ca3af">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </div>
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 10px; font-weight: 500; color: #374151;">Texture</label>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <div v-for="(texture, index) in editingProduct.availableTextures" :key="index" style="position: relative;">
                                    <div :style="{ width: '32px', height: '32px', borderRadius: '6px', border: '2px solid #e5e7eb', cursor: 'pointer'}"  @click="removeTexture(index)"></div>
                                </div>
                                <div @click="addTexture" style="width: 32px; height: 32px; border: 2px dashed #cbd5e1; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #f8f9fa;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="#9ca3af">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Hidden file inputs for image uploads -->
        <input ref="mainImageInput" type="file" accept="image/*" style="display: none" @change="handleMainImageChange">
        <input ref="galleryImageInput" type="file" accept="image/*" multiple style="display: none" @change="handleGalleryImageChange">
    </div>
    <br>

</template>

<script>
export default {
    name: 'manage_products',
    data() {
        return {
            currentView: 'list', // 'list', 'details', 'edit'
            searchQuery: '',
            selectedProduct: null,
            editingProduct: null,
            originalProduct: null,
            
 columns : [
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
            products: [
                {
                    id: 1,
                    name: 'Decaly Coral',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc.',
                    longDescription: 'Living room lighting, interior lighting, pendant lighting. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
                    category: 'Chair',
                    type: 'Modern',
                    createDate: 'June 10, 2025',
                    dimensions: '24 in W x 50 H',
                    fullDimensions: '24 in W x 24 In D x 50 in H',
                    colors: ['#8B4513', '#D2B48C', '#F5DEB3'],
                    colorOptions: [
                        { name: 'Brown', hex: '#8B4513' },
                        { name: 'Light Brown', hex: '#D2B48C' },
                        { name: 'Beige', hex: '#F5DEB3' },
                        { name: 'Gray', hex: '#808080' }
                    ],
                    textures: ['pattern1', 'pattern2'],
                    price: 1200,
                    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    gallery: [
                        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
                        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
                        'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
                        'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    ],
                    height: 50,
                    length: 24,
                    width: 24,
                    availableColors: ['#8B4513', '#D2B48C', '#F5DEB3', '#808080'],
                    availableTextures: ['pattern1', 'pattern2']
                },
                {
                    id: 2,
                    name: 'Sapphire Blue',
                    description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
                    longDescription: 'Contemporary table design with modern aesthetics. Perfect for dining rooms and contemporary spaces.',
                    category: 'Table',
                    type: 'Contemporary',
                    createDate: 'July 15, 2025',
                    dimensions: '60 in W x 30 in D x 36 in H',
                    fullDimensions: '60 in W x 30 in D x 36 in H',
                    colors: ['#0066CC', '#4169E1', '#1E90FF'],
                    colorOptions: [
                        { name: 'Blue', hex: '#0066CC' },
                        { name: 'Royal Blue', hex: '#4169E1' },
                        { name: 'Dodger Blue', hex: '#1E90FF' }
                    ],
                    textures: ['pattern1'],
                    price: 850,
                    image: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    gallery: [
                        'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
                        'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    ],
                    height: 36,
                    length: 60,
                    width: 30,
                    availableColors: ['#0066CC', '#4169E1', '#1E90FF'],
                    availableTextures: ['pattern1']
                },
                {
                    id: 3,
                    name: 'Emerald Green',
                    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    longDescription: 'Classic sofa design with traditional craftsmanship. Comfortable seating for living rooms.',
                    category: 'Sofa',
                    type: 'Classic',
                    createDate: 'Aug 20, 2025',
                    dimensions: '84 in W x 32 in D x 30 in H',
                    fullDimensions: '84 in W x 32 in D x 30 in H',
                    colors: ['#50C878', '#228B22', '#32CD32'],
                    colorOptions: [
                        { name: 'Emerald', hex: '#50C878' },
                        { name: 'Forest Green', hex: '#228B22' },
                        { name: 'Lime Green', hex: '#32CD32' }
                    ],
                    textures: ['pattern1', 'pattern2'],
                    price: 1200,
                    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    gallery: [
                        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    ],
                    height: 30,
                    length: 84,
                    width: 32,
                    availableColors: ['#50C878', '#228B22', '#32CD32'],
                    availableTextures: ['pattern1', 'pattern2']
                },
                {
                    id: 4,
                    name: 'Crimson Red',
                    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                    longDescription: 'Rustic ottoman with authentic materials. Perfect accent piece for traditional interiors.',
                    category: 'Ottoman',
                    type: 'Rustic',
                    createDate: 'Sep 5, 2025',
                    dimensions: '36 in W x 36 in D x 18 in H',
                    fullDimensions: '36 in W x 36 in D x 18 in H',
                    colors: ['#DC143C', '#B22222', '#CD5C5C'],
                    colorOptions: [
                        { name: 'Crimson', hex: '#DC143C' },
                        { name: 'Fire Brick', hex: '#B22222' },
                        { name: 'Indian Red', hex: '#CD5C5C' }
                    ],
                    textures: ['pattern1'],
                    price: 320,
                    image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    gallery: [
                        'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    ],
                    height: 18,
                    length: 36,
                    width: 36,
                    availableColors: ['#DC143C', '#B22222', '#CD5C5C'],
                    availableTextures: ['pattern1']
                },
                {
                    id: 5,
                    name: 'Gold Leaf',
                    description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    longDescription: 'Vintage bookshelf with ornate details. Storage solution with classic appeal.',
                    category: 'Bookshelf',
                    type: 'Vintage',
                    createDate: 'Oct 10, 2025',
                    dimensions: '48 in W x 12 in D x 72 in H',
                    fullDimensions: '48 in W x 12 in D x 72 in H',
                    colors: ['#FFD700', '#DAA520', '#B8860B'],
                    colorOptions: [
                        { name: 'Gold', hex: '#FFD700' },
                        { name: 'Golden Rod', hex: '#DAA520' },
                        { name: 'Dark Golden Rod', hex: '#B8860B' }
                    ],
                    textures: ['pattern1', 'pattern2'],
                    price: 950,
                    image: 'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    gallery: [
                        'https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    ],
                    height: 72,
                    length: 48,
                    width: 12,
                    availableColors: ['#FFD700', '#DAA520', '#B8860B'],
                    availableTextures: ['pattern1', 'pattern2']
                },
                {
                    id: 6,
                    name: 'Charcoal Gray',
                    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
                    longDescription: 'Industrial desk with modern functionality. Perfect workspace solution for contemporary offices.',
                    category: 'Desk',
                    type: 'Industrial',
                    createDate: 'Nov 25, 2025',
                    dimensions: '60 in W x 30 in D x 30 in H',
                    fullDimensions: '60 in W x 30 in D x 30 in H',
                    colors: ['#36454F', '#708090', '#2F4F4F'],
                    colorOptions: [
                        { name: 'Charcoal', hex: '#36454F' },
                        { name: 'Slate Gray', hex: '#708090' },
                        { name: 'Dark Slate Gray', hex: '#2F4F4F' }
                    ],
                    textures: ['pattern1'],
                    price: 700,
                    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    gallery: [
                        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    ],
                    height: 30,
                    length: 60,
                    width: 30,
                    availableColors: ['#36454F', '#708090', '#2F4F4F'],
                    availableTextures: ['pattern1']
                },
                {
                    id: 7,
                    name: 'Slate Blue',
                    description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
                    longDescription: 'Modern chair with sleek design. Comfortable seating for contemporary spaces.',
                    category: 'Chair',
                    type: 'Modern',
                    createDate: 'Dec 15, 2025',
                    dimensions: '20 in W x 18 in D x 36 in H',
                    fullDimensions: '20 in W x 18 in D x 36 in H',
                    colors: ['#6A5ACD', '#483D8B', '#9370DB'],
                    colorOptions: [
                        { name: 'Slate Blue', hex: '#6A5ACD' },
                        { name: 'Dark Slate Blue', hex: '#483D8B' },
                        { name: 'Medium Purple', hex: '#9370DB' }
                    ],
                    textures: ['pattern1'],
                    price: 150,
                    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    gallery: [
                        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    ],
                    height: 36,
                    length: 20,
                    width: 18,
                    availableColors: ['#6A5ACD', '#483D8B', '#9370DB'],
                    availableTextures: ['pattern1']
                }
            ]
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
    methods: {
        viewProduct(product) {
            this.selectedProduct = product;
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
            const newId = Math.max(...this.products.map(p => p.id)) + 1;
            const newProduct = {
                id: newId,
                name: 'New Product',
                description: 'Product description',
                longDescription: 'Detailed product description',
                category: 'Chair',
                type: 'Modern',
                createDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                dimensions: '24 in W x 36 H',
                fullDimensions: '24 in W x 24 In D x 36 in H',
                colors: ['#8B4513'],
                colorOptions: [{ name: 'Brown', hex: '#8B4513' }],
                textures: ['pattern1'],
                price: 100,
                image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                gallery: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'],
                height: 36,
                length: 24,
                width: 24,
                availableColors: ['#8B4513'],
                availableTextures: ['pattern1']
            };
            
            this.products.push(newProduct);
            this.editProduct(newProduct);
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