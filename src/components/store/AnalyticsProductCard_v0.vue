<template>
  <div class="product-card">
    <div class="product-image-sec">
      <div class="category-badge">{{ this.product.category }}</div>
      <img class="product-image" :src="this.$store.state.root_media_api+this.product.image" />
      <div class="ar-badge">AR</div>
    </div>
    <div class="product-description">
      <h4 class="product-title ellipsis">{{ this.product.name }}</h4>
      <p class="product-about ellipsis">{{ this.product.description }}</p>

      <div class="product-dimension-sec">
        <!-- <p class="product-dimension-heading">Dimensions(W,H,L) in meter</p> -->
        <div class="dimension-values">
          {{this.product.dimensions}}
          <!-- <span>{{ this.product.dimensions.width }}</span>,
          <span>{{ this.product.dimensions.height }}</span>,
          <span>{{ this.product.dimensions.length }}</span> -->
        </div>
      </div>

      <div class="price-sec-wrapper">
        <div class="price-sec">
          <p class="price-heading">Price </p>
          <p class="price-amount">${{ this.product.price }}</p>
        </div>
        <div class="price-sec">
          <p class="price-heading">Usage </p>
          <p class="price-amount usage-count">{{ this.product.usageCount }}</p>
        </div>
      </div>

      <div class="colour-sec">
        <p class="colour-heading">Colours</p>
        <div class="colour-box-sec">
          <div 
            v-for="(color, index) in this.product.colors" 
            :key="index"
            class="colour-box"
            :style="{ background: color }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnalyticsProductCard",
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      category: 'Chair',
      productTitle: 'chair title here',
      productAbout: 'product des',
      productImage: '../../assets/ch_2_home_page.png',
      dimensions: {
        width: 0.4,
        height: 0.8,
        length: 1,
      },
      price: 574,
      usage: 8,
      colors: [
        'rgb(128, 0, 0)',
        'rgb(230, 0, 0)',
        'rgb(51, 51, 51)',
      ],
    };
  },
};
</script>

<style scoped>
  .ellipsis {
  white-space: nowrap;      
  overflow: hidden;       
  text-overflow: ellipsis;
  max-width: 400px;


  /* max-width: 100%;         
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
}
.product-card {
  height: auto;
  padding: 8px;
  display: flex;
  gap: 16px;
  min-width: 350px;
  /* box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); */
  border:1px solid rgba(0,0,0,0.2);
  margin-bottom:5px;
  border-radius: 14px;
  background: white;
  font-family: poppins;
  transition: all 0.3s ease;
  width: 100%;
}

.product-card:hover {
  /* box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); */
  /* transform: translateY(-4px); */
}

.product-image-sec {
  width: 30%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
  /* background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%); */
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-badge {
  position: absolute;
  top: 8px;
  left: 8px;
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
  top: 8px;
  right: 8px;
  background: #e5e7eb;
  color: #374151;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  z-index: 1;
}

.product-image {
  height: 100%;
  width: 100%;
  object-fit: contain;
  /* padding: 8px; */
}

.product-description {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 70%;
  padding-right: 5px;
}

.product-title {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 700;
  color: rgb(51, 51, 51);
  text-align: start;
}

.product-about {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: rgb(102, 102, 102);
  text-align: start;
}

.product-dimension-sec {
  margin-bottom: 8px;
}

.product-dimension-heading {
  margin: 0 0 4px 0;
  font-size: 12px;
  font-weight: 700;
  color: rgb(51, 51, 51);
}

.dimension-values {
  font-size: 12px;
  font-weight: 600;
  color: rgb(51, 51, 51);
}

.dimension-values span {
  margin: 0 2px;
}

.price-sec-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.price-sec {
  flex: 1;
 /* background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%); */
 /* background-color: #e8ecf1; */
  padding: 8px 10px;
  border-radius: 8px;
}

.price-heading {
  margin: 0 0 4px 0;
  font-size: 11px;
  font-weight: 700;
  color: rgb(51, 51, 51);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-amount {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: rgb(51, 51, 51);
}

.usage-count {
  color: rgb(79, 70, 229);
}

.colour-sec {
}

.colour-heading {
  margin: 0 0 6px 0;
  font-size: 12px;
  font-weight: 700;
  color: rgb(51, 51, 51);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.colour-box-sec {
  display: flex;
  gap: 8px;
}

.colour-box {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.colour-box:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media screen and (max-width: 570px) {
  .product-card {
    flex-direction: column;
    height: auto;
    width: 49%;
    min-width: auto;
  }

  .product-image-sec {
    width: 100%;
    height: 150px;
  }

  .product-title {
    font-size: 14px;
  }
  .product-description {
    max-width: 100%;
    padding-right: 2px;
  }
  /* @media screen and (max-width: 440px) {
    .product-card {
      width: 100%;
    }
    
  } */
}
</style>