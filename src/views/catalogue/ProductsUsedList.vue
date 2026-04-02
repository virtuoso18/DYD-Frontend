<template>
  <a-row style="color: black">
    <a-col
      span="24"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 70vh;
      "
      v-if="!deduplicatedProducts.length"
    >
      <a-empty description="You have not used any product in this room here." />
    </a-col>

    <a-col
      :lg="4"
      :md="6"
      :sm="12"
      :xs="12"
      v-for="product in deduplicatedProducts"
      :key="product.product_id"
      class="product-responsive"
      style="padding: 5px; color: black"
    >
      <div class="product">
        <div class="product-image-container" @click="$emit('view-product', product)">
          <img
            :src="rootMediaApi + product.product_image"
            :alt="product.product_title"
            class="product-image"
          />
          <!-- Category Badge -->
          <div class="category-badge">{{ product.category_name }}</div>
          <!-- AR Badge -->
          <div class="ar-badge">AR</div>
          <!-- Frequency Badge -->
          <div v-if="product.frequency > 1" class="frequency-badge">
            ×{{ product.frequency }}
          </div>
        </div>

        <a-row>
          <a-col span="24">
            <b style="font-size: 13px;">
              {{ truncateText(product.product_title || 'No Name available', 2) }}
            </b>
          </a-col>

          <a-col span="18" style="color: black">Color</a-col>
          <a-col span="6" style="display: flex; justify-content: end">
            <div
              v-for="(color, index) in product.product_colors.slice(0, 2)"
              :key="index"
              style="
                width: 20px;
                height: 20px;
                border-radius: 20px;
                margin-left: 2px;
              "
              :style="'background:' + (color.color_hex ? color.color_hex : color.color)"
            />
          </a-col>

          <a-col span="12">Price</a-col>
          <a-col
            span="12"
            style="display: flex; justify-content: end; font-weight: 700"
          >
            ${{ product.product_price }}
          </a-col>

          <a-col span="17">
            <a-button
              block
              @click="$emit('go-to-product', product)"
            >
              Product Details
            </a-button>
          </a-col>

          <a-col span="1" />
          <a-col span="4">
            <a-button
              block
              type="default"
              style="
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                border: none;
              "
              @click="$emit('toggle-favorite', product, 'product')"
            >
              <HeartFilled
                v-if="product.is_favorited"
                style="color: red; font-size: 18px"
              />
              <HeartOutlined v-else style="font-size: 18px" />
            </a-button>
          </a-col>
        </a-row>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import { HeartFilled, HeartOutlined } from "@ant-design/icons-vue";

export default {
  name: "ProductsUsedList",

  components: { HeartFilled, HeartOutlined },

  props: {
    products: {
      type: Array,
      default: () => [],
    },
    rootMediaApi: {
      type: String,
      default: "",
    },
  },

  emits: ["view-product", "go-to-product", "toggle-favorite"],

  computed: {
    deduplicatedProducts() {
      const map = new Map();

      for (const product of this.products) {
        const key = product.product_id;
        if (map.has(key)) {
          map.get(key).frequency += 1;
        } else {
          map.set(key, { ...product, frequency: 1 });
        }
      }

      return Array.from(map.values());
    },
  },

  methods: {
    truncateText(text, wordLimit) {
      if (!text) return "";
      const words = text.split(" ");
      if (words.length <= wordLimit) return text;
      return words.slice(0, wordLimit).join(" ") + "...";
    },
  },
};
</script>

<style scoped>
.product {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f3f2f4;
}

.product-image-container {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  color: #0040a7;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.frequency-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #3b63fb;
  color: white;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(59, 99, 251, 0.4);
}

.product-responsive {
  width: 50%;
  flex: 0 0 50%;
}

@media (min-width: 576px) {
  .product-responsive {
    width: 50%;
    flex: 0 0 50%;
  }
}
@media (min-width: 768px) {
  .product-responsive {
    width: 33.333%;
    flex: 0 0 33.333%;
  }
}
@media (min-width: 992px) {
  .product-responsive {
    width: 25%;
    flex: 0 0 25%;
  }
}
@media (min-width: 1200px) {
  .product-responsive {
    width: 20%;
    flex: 0 0 20%;
  }
}
</style>