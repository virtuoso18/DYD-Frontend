<template>
  <a-row class="ai-catalog-container" style="min-height: 100vh; margin: 0; background-color: #f5f5f5;">
    <!-- Sidebar -->
    <a-col :xs="0" :sm="0" :md="6" :lg="6" style="background: #fff; border-right: 1px solid #f0f0f0; padding: 24px; overflow-y: auto; max-height: 100vh;">
      <div style="padding-right: 8px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #000; margin-bottom: 24px; margin-top: 0;">AI Catalog</h1>

        <!-- Select Suppliers -->
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 13px; font-weight: 600; color: #262626; margin-bottom: 5px; margin-top: 0;">Select Suppliers</h3>
          <a-select
            v-model:value="selectedSupplier"
            placeholder="Choose a supplier"
            style="width: 100%"
          >
            <a-select-option v-for="supplier in suppliers" :key="supplier" :value="supplier">
              {{ supplier }}
            </a-select-option>
          </a-select>
        </div>

        <!-- Select Country -->
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 13px; font-weight: 600; color: #262626; margin-bottom: 5px; margin-top: 0;">Select Country</h3>
          <a-select
            v-model:value="selectedCountry"
            placeholder="Choose a country"
            style="width: 100%"
          >
            <a-select-option v-for="country in countries" :key="country" :value="country">
              {{ country }}
            </a-select-option>
          </a-select>
        </div>

        <!-- Select Store Categories -->
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 13px; font-weight: 600; color: #262626; margin-bottom: 5px; margin-top: 0;">Select Store Categories</h3>
          <a-select
            v-model:value="selectedCategory"
            placeholder="Choose a category"
            style="width: 100%"
          >
            <a-select-option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </a-select-option>
          </a-select>
        </div>

        <!-- Divider -->
        <a-divider />

        <!-- Checkboxes Filter -->
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 13px; font-weight: 600; color: #262626; margin-bottom: 12px; margin-top: 0;">Filter Categories</h3>
          <a-checkbox-group v-model:value="selectedFilters" style="width: 100%; display: flex; flex-direction: column; gap: 12px">
            <a-checkbox v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </a-checkbox>
          </a-checkbox-group>
        </div>
      </div>
    </a-col>

    <!-- Main Content -->
    <a-col :xs="24" :sm="24" :md="18" :lg="18" style="padding: 0; overflow-y: auto; max-height: 100vh;">
      <div style="padding: 24px; background-color: #f5f5f5;">
        <!-- Header with Search -->
        <div style="margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
            <h2 style="font-size: 28px; font-weight: 700; color: #000; margin: 0;">Products</h2>
            <a-input-search
              v-model:value="searchQuery"
              placeholder="Search Product"
              allow-clear
              style="width: 300px"
              @search="onSearch"
            />
          </div>
        </div>

        <!-- Products Grid -->
        <a-row :gutter="[24, 24]" style="margin: 0;">
          <a-col
            v-for="product in filteredProducts"
            :key="product.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
          >
            <a-card
              :bordered="false"
              style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); transition: all 0.3s ease; background: #fff; cursor: pointer;"
              :body-style="{ padding: '0' }"
              @mouseenter="$event.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)'"
              @mouseleave="$event.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)'"
            >
              <!-- Product Image -->
              <div style="position: relative; width: 100%; height: 200px; background: linear-gradient(135deg, #8b6239 0%, #5c3d1f 100%); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                <div style="position: absolute; width: 100%; height: 100%; background: repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.05) 2px, rgba(0, 0, 0, 0.05) 4px), repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.03) 1px, rgba(255, 255, 255, 0.03) 2px);"></div>
                <span style="position: absolute; top: 12px; left: 12px; background: #fff; color: #262626; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600; z-index: 2;">{{ product.type }}</span>
                <span style="position: absolute; bottom: 12px; left: 12px; background: #fff; color: #262626; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; z-index: 2;">{{ product.code }}</span>
              </div>

              <!-- Product Details -->
              <div style="padding: 16px;">
                <h4 style="font-size: 14px; font-weight: 600; color: #262626; margin: 0 0 12px 0;">{{ product.name }}</h4>

                <!-- Color and Price -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; color: #8a8a8a;">Color</span>
                    <div style="width: 16px; height: 16px; border-radius: 50%; border: 1px solid #d9d9d9; background-color: #3e2723;"></div>
                  </div>
                  <span style="font-size: 14px; font-weight: 700; color: #0066cc;">{{ product.price }}</span>
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 8px;">
                  <a-button type="default" style="flex: 1;">
                    Product Detail
                  </a-button>
                  <a-button
                    :type="favorites.includes(product.id) ? 'primary' : 'default'"
                    danger
                    @click="toggleFavorite(product.id)"
                    style="flex: 1;"
                  >
                    <HeartOutlined v-if="!favorites.includes(product.id)" />
                    <HeartFilled v-else />
                  </a-button>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <!-- Empty State -->
        <a-empty v-if="filteredProducts.length === 0" description="No products found" style="margin-top: 48px" />
      </div>
    </a-col>
  </a-row>
</template>

<script>
import { HeartOutlined, HeartFilled } from '@ant-design/icons-vue';

export default {
  name: 'ai_catalog',
  components: {
    HeartOutlined,
    HeartFilled,
  },
  data() {
    return {
      selectedSupplier: 'Aluma Design',
      selectedCountry: 'India',
      selectedCategory: 'Floor',
      selectedFilters: [],
      searchQuery: '',
      favorites: [],
      suppliers: ['Aluma Design', 'Supplier 2', 'Supplier 3', 'Supplier 4'],
      countries: ['India', 'USA', 'UK', 'Canada', 'Australia'],
      categories: [
        'Floor',
        'Sofa Sets',
        'Sole',
        'Beds',
        'Dining Sets',
        'Armchairs / TV Chairs',
        'Youth Sofasice',
        'Sofa Beds',
        'Kids & Youth',
        'Mattresses',
        'Wardrobes',
        'Coffee Tables & Sideboards',
        'Rugs',
        'Accent Furniture',
      ],
      products: [
        { id: 1, name: 'Rich Walnut Laminate', type: 'Modern Floor', price: '$660', color: 'Walnut', colorHex: '#3e2723', code: '3HD7' },
        { id: 2, name: 'Rich Walnut Laminate', type: 'Modern Floor', price: '$660', color: 'Walnut', colorHex: '#3e2723', code: '3HD7' },
        { id: 3, name: 'Rich Walnut Laminate', type: 'Modern Floor', price: '$660', color: 'Walnut', colorHex: '#3e2723', code: '3HD7' },
        { id: 4, name: 'Rich Walnut Laminate', type: 'Modern Floor', price: '$660', color: 'Walnut', colorHex: '#3e2723', code: '3HD7' },
        { id: 5, name: 'Rich Walnut Laminate', type: 'Modern Floor', price: '$660', color: 'Walnut', colorHex: '#3e2723', code: '3HD7' },
        { id: 6, name: 'Rich Walnut Laminate', type: 'Modern Floor', price: '$660', color: 'Walnut', colorHex: '#3e2723', code: '3HD7' },
        { id: 7, name: 'Rich Walnut Laminate', type: 'Modern Floor', price: '$660', color: 'Walnut', colorHex: '#3e2723', code: '3HD7' },
        { id: 8, name: 'Rich Walnut Laminate', type: 'Modern Floor', price: '$660', color: 'Walnut', colorHex: '#3e2723', code: '3HD7' },
        { id: 9, name: 'Rich Walnut Laminate', type: 'Modern Floor', price: '$660', color: 'Walnut', colorHex: '#3e2723', code: '3HD7' },
        { id: 10, name: 'Rich Walnut Laminate', type: 'Modern Floor', price: '$660', color: 'Walnut', colorHex: '#3e2723', code: '3HD7' },
      ],
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesSearch;
      });
    },
  },
  methods: {
    toggleFavorite(id) {
      const index = this.favorites.indexOf(id);
      if (index > -1) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(id);
      }
    },
    onSearch(value) {
      this.searchQuery = value;
    },
  },
};
</script>