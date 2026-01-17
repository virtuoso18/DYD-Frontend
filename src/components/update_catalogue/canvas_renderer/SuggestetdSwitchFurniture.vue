<template>
  <div class="suggested-switch-furniture">
    <div
      class="product"
      :class="{
        'selected-product': selected_furniture?.id === product.id,
      }"
      @click="selectFurniture(product)"
    >
      <div class="product-image-container" @click="viewProduct(product)">
        <img
          :src="$store.state.root_media_api + product.primary_image"
          :alt="product.name"
          class="product-image"
        />
        <!-- Category Badge -->
        <div class="category-badge">{{ product.category.name }}</div>
        <!-- AR Badge -->
        <div class="ar-badge">AR</div>
      </div>

      <a-row>
        <a-col span="24">
          <b>{{ truncateText(product.name || "No name available", 19) }}</b>
        </a-col>

        <a-col span="18"> Color </a-col>

        <a-col span="6" style="display: flex; justify-content: end; gap: 2px">
          <div
            v-for="(colorObj, index) in product.colors_available.slice(0, 2)"
            :key="index"
            style="
              width: 20px;
              height: 20px;
              border-radius: 20px;
              border: 1px solid #ddd;
            "
            :style="{ backgroundColor: colorObj.color }"
            :title="colorObj.color"
          ></div>
          <div
            v-if="product.colors_available.length > 2"
            style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #e0e0e0;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
              color: #666;
            "
          >
            +{{ product.colors_available.length - 2 }}
          </div>
        </a-col>

        <a-col span="12"> Price </a-col>

        <a-col
          span="12"
          style="display: flex; justify-content: end; font-weight: 700"
        >
          ${{ product.pricing.price }}
        </a-col>

        <a-col span="17">
          <a-button block @click="viewProduct(product)" style="margin-top: 8px"
            >Product Details</a-button
          >
        </a-col>

        <a-col span="1"></a-col>
        <a-col span="6">
          <a-button
            style="margin-top: 8px; width: 100%"
            @click="toggleWishlist(product)"
          >
            <HeartOutlined
              :style="{
                color: product.isWishlisted ? '#ff4d4f' : 'currentColor',
              }"
            />
          </a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { HeartOutlined } from '@ant-design/icons-vue';

export default {
  name: "SuggestedSwitchFurniture",
  components: {
    HeartOutlined,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    selectFurniture:{
        type:Function,
        required:true
    },
    selected_furniture:{
        type:Object,
        required:true
    }
  },
  data() {
    return {};
  },
  methods: {
    truncateText(text, charLimit = 19) {
      if (!text) return "";
      if (text.length <= charLimit) return text;
      return text.slice(0, charLimit) + "...";
    },
    toggleWishlist(product) {
      product.isWishlisted = !product.isWishlisted;
      const message = product.isWishlisted
        ? "Added to wishlist"
        : "Removed from wishlist";
      this.$message.success(message);
    },
     viewProduct(){
        console.log("view product");
    }
  },
};
</script>

<style scoped>
/* .suggested-switch-furniture {
  padding: 16px;
} */
.product {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f3f2f4;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.products-list {
  padding-bottom: 20px;
}

.product-image-container {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.product-image-container:hover .product-image {
  transform: scale(1.05);
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
  z-index: 1;
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
  z-index: 1;
}

.product-responsive {
  width: 50%;
  flex: 0 0 50%;
}
.product.selected-product {
  border: 2px solid red;
}
</style>
