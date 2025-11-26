<template>
  <!-- {{floors}} -->
<!-- {{walls}} -->
<!-- {{furniture_products}} -->
<!-- {{lights}} -->
  <div>
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px; background: white; border-bottom: 1px solid #f0f0f0;">
      <span style="font-weight: 600;">AI Catalog</span>
      <a-button size="small" type="text" @click="$emit('see-all-products', true)">See all</a-button>
    </div>
    
    <!-- Search Bar -->
    <div style="display: flex; gap: 8px; padding: 12px 16px; background: white; border-bottom: 1px solid #f0f0f0;">
      <a-input v-model:value="searchText" placeholder="Search products..." allow-clear style="flex: 1;">
        <template #prefix>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#999" stroke-width="1.5"/>
            <path d="M14 14L11.1 11.1" stroke="#999" stroke-width="1.5"/>
          </svg>
        </template>
      </a-input>
      <a-button @click="showGrid = false" :type="!showGrid ? 'primary' : 'default'">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 10H15M2.5 5H17.5M7.5 15H12.5" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
      </a-button>
      <a-button @click="showGrid = true" :type="showGrid ? 'primary' : 'default'">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="3" width="6" height="6" stroke="currentcolor" stroke-width="1.5"/>
            <rect x="11" y="3" width="6" height="6" stroke="currentcolor" stroke-width="1.5"/>
            <rect x="3" y="11" width="6" height="6" stroke="currentcolor" stroke-width="1.5"/>
            <rect x="11" y="11" width="6" height="6" stroke="currentcolor" stroke-width="1.5"/>
          </svg>
      </a-button>
    </div>

    <!-- Scrollable Content -->
<div 
  class="overflow-y-auto p-[5px] bg-[#fafafa] md:h-[calc(76vh-120px)]"
>
      
      <!-- Floors -->
      <a-collapse v-model:activeKey="floorsActiveKey" style="margin-bottom: 12px;" v-if="floors.length>0">
        <a-collapse-panel key="floors">
          <template #header>
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <span>Floor Tiles</span>
              <a-badge :count="floors.length" />
            </div>
          </template>
          <a-empty v-if="!floors.length" :image="simpleImage" />
          <div v-else :class="showGrid ? 'grid' : 'list'">
            <div v-for="item in filterItems(floors)" :key="item.id" 
                 class="item" :class="{selected: selected_texture === item.id}"
                 @click="selectTexture('floor',item.id)">
              <img :src="$store.state.root_media_api + item.texture_image" :alt="item.title" />
              <div style="padding: 8px;">
                <div style="font-weight: 600; font-size: 13px;">{{ item.title }}</div>
                <div style="font-size: 11px; color: #999;">{{ truncate(item.description) }}</div>
              </div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>

      <!-- Walls -->
      <a-collapse v-model:activeKey="wallsActiveKey" style="margin-bottom: 12px;" v-if="walls.length>0">
        <a-collapse-panel key="walls">
          <template #header>
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <span>Wall Textures</span>
              <a-badge :count="walls.length" />
            </div>
          </template>
          <a-empty v-if="!walls.length" :image="simpleImage" />
          <div v-else :class="showGrid ? 'grid' : 'list'">
            <div v-for="item in filterItems(walls)" :key="item.id"
                 class="item" :class="{selected: selected_texture === item.id}"
                 @click="selectTexture('wall',item.id)">
              <img :src="$store.state.root_media_api + item.texture_image" :alt="item.title" />
              <div style="padding: 8px;">
                <div style="font-weight: 600; font-size: 13px;">{{ item.title }}</div>
                <div style="font-size: 11px; color: #999;">{{ truncate(item.description) }}</div>
              </div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>

      <!-- Furniture -->
      <a-collapse v-model:activeKey="productsActiveKey" style="margin-bottom: 12px;"  v-if="furniture_products.length>0">
        <a-collapse-panel key="products">
          <template #header>
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <span>Furniture</span>
              <a-badge :count="furniture_products.length" />
            </div>
          </template>
          <a-empty v-if="!furniture_products.length" :image="simpleImage" />
          <div v-else :class="showGrid ? 'grid' : 'list'">
            <div v-for="item in filterItems(furniture_products, 'name')" :key="item.id"
                 class="item" :class="{selected: selected_texture === item.id}"
                 @click="selectfurnitureProduct(type='product',id=item.id,model_url=item['3d_model'],dimensions=item.dimensions)">
                 <!-- {{ item['3d_model'] }} -->
                   <!-- {{item.dimensions}} -->
              <img :src="$store.state.root_media_api + item.primary_image" :alt="item.name" />
              <div style="padding: 8px;">
                <div style="font-weight: 600; font-size: 13px;">{{ item.name }}</div>
                <div style="font-size: 11px; color: #999;">{{ truncate(item.description) }}</div>
              </div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>

      <!-- Lights -->
      <a-collapse v-model:activeKey="lightsActiveKey" v-if="lights.length>0">
        <a-collapse-panel key="lights">
          <template #header>
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <span>Lights</span>
              <a-badge :count="lights.length" />
            </div>
          </template>
          <a-empty v-if="!lights.length" :image="simpleImage" />
          <div v-else :class="showGrid ? 'grid' : 'list'">
            <div v-for="item in filterItems(lights, 'name')" :key="item.id"
                 class="item" :class="{selected: selected_texture === item.d}"
                 @click="selectTexture(type='light',id=item.id,model_url=item['3d_model'],light_type=item.light_type)">
                 <!-- {{ item['3d_model'] }} -->
              <img :src="$store.state.root_media_api + item.primary_image" :alt="item.name" />
              <div style="padding: 8px;">
                <div style="font-weight: 600; font-size: 13px;">{{ item.name }}</div>
                <div style="font-size: 11px; color: #999;">{{ truncate(item.description) }}</div>
              </div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
      
    </div>
  </div>
</template>

<script>
import { Empty } from 'ant-design-vue';

export default {
  data() {
    return {
      searchText: '',
      showGrid: true,
      selected_texture: null,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      floors: [],
      walls: [],
      furniture_products: [],
      lights: [],
      floorsActiveKey: ['floors'],
      wallsActiveKey: ['walls'],
      productsActiveKey: ['products'],
      lightsActiveKey: ['lights'],
    };
  },
  mounted() {
    // Access the route
    const route = this.$route

    // Extract params and query
    this.catalogueId = route.params.id
    this.brand = route.query.brand

    // Conditional logic
    if (this.brand) {
      console.log('Loading catalogue for brand:', this.brand)
      this.fetchData(this.brand)
    } else {
      console.log('Loading self products')
      this.fetchData();
    }
    
  },
  methods: {
    async fetchData(brand = null) {
  let endpoints = [];

  if (brand) {
    endpoints = [
      { key: 'floors', url: 'room/api/load-brand-products/floors/' + brand },
      { key: 'walls', url: 'room/api/load-brand-products/walls/' + brand },
      { key: 'furniture_products', url: 'product/api/load-brand-products/3d-products/' + brand },
      { key: 'lights', url: 'product/api/load-brand-products/lights/' + brand }
    ];
  } else {
    endpoints = [
      { key: 'floors', url: 'room/api/floors/' },
      { key: 'walls', url: 'room/api/walls/' },
      { key: 'furniture_products', url: 'product/api/3d-products/' },
      { key: 'lights', url: 'product/api/lights/' }
    ];
  }

  // Use Promise.all to wait for all requests to complete
  const requests = endpoints.map(async ({ key, url }) => {
    try {
      const res = await fetch(`${this.$store.state.root_api}${url}`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      
      if (data?.data) {
        this[key] = data.data;
      }
    } catch (e) {
      console.error(`Failed to fetch ${key}:`, e);
    }
  });

  // Wait for all requests to complete
  await Promise.all(requests);

  // Now emit after all data is loaded
  this.$emit('brand-products', {
    'floors': this.floors,
    'walls': this.walls,
    'furniture_products': this.furniture_products,
    'lights': this.lights
  });

  // console.log('Data loaded - floors:', this.floors.length);
  // console.log('Data loaded - walls:', this.walls.length);
  // console.log('Data loaded - furniture_products:', this.furniture_products.length);
  // console.log('Data loaded - lights:', this.lights.length);
},

    filterItems(items, field = 'title') {
      if (!this.searchText) return items;
      const s = this.searchText.toLowerCase();
      return items.filter(i => 
        (i[field]?.toLowerCase().includes(s)) || 
        (i.description?.toLowerCase().includes(s))
      );
    },
    truncate(text) {
      if (!text) return '';
      const words = text.split(' ');
      return words.length > 10 ? words.slice(0, 10).join(' ') + '...' : text;
    },
    
    selectfurnitureProduct(type,id, model_url,dimensions=null) {
      this.selected_texture = id;
      // console.log("========================")
      // console.log("========================")
      // console.log(dimensions)
      
      // let type=type
      // floor
      // wall
      // product
      // light
      this.$emit('product-selected', {'id':id,'type':type,"model_url":model_url,'width':dimensions.width,'height':dimensions.height,'depth':dimensions.length});
    },

    selectTexture(type,id, model_url=null,light_type=null) {
      this.selected_texture = id;
      // let type=type
      // floor
      // wall
      // product
      // light
      this.$emit('product-selected', {'id':id,'type':type,"model_url":model_url,"light_type":light_type});
    }
  }
};
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.list { display: grid; grid-template-columns: 1fr; gap: 10px; }

.grid .item > div { display: none; }

.item { background: white; border: 2px solid #f0f0f0; border-radius: 8px; cursor: pointer; overflow: hidden; }
.item:hover { border-color: #1890ff; }
.item.selected { border-color: #1890ff; box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1); }

.grid .item { display: flex; flex-direction: column; }
.list .item { display: flex; flex-direction: row; align-items: center; }

.item img { width: 100%; height: 100px; object-fit: cover; }
.list .item img { width: 100px; flex-shrink: 0; }
</style>