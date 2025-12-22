<template>
  <div class="cart-container">
    <!-- Header Section -->
    

    <div class="header-section">
      <div class="wave-pattern"></div>
      <div class="header-content">
        <h1 class="header-title">Cart</h1>
        <!-- <p class="header-subtitle">
          Use DYD AI for free. Upgrade to access additional features,<br>
          and increase limits design.
        </p> -->
      </div>
    </div>


    <div style="max-width: 1000px; margin: auto; padding: 20px;">
      <!-- Loading State -->
      <div v-if="loading" style="text-align: center; padding: 40px;">
        <div style="width: 40px; height: 40px; border: 4px solid #f0f0f0; border-top: 4px solid #1890ff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        <p style="color: #595959; margin-top: 16px;">Loading your cart...</p>
      </div>

      <!-- Empty Cart State -->
      <div v-else-if="cart.items && cart.items.length === 0" style="text-align: center;  padding: 60px 20px;">
        <svg style="margin:auto;width: 80px; height: 80px; margin-bottom: 16px; opacity: 0.5;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h2 style="font-size: 24px; color: #262626; margin-bottom: 8px;">Your cart is empty</h2>
        <p style="color: #8c8c8c; margin-bottom: 24px;">Add items to get started!</p>
        <button style="padding: 10px 16px; border: none; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; width: 100%; background-color: #1890ff; color: white;" @click="goToShop">Continue Shopping</button>
      </div>

      <!-- Cart Content -->
      <div v-else>
        <a-row>
          <!-- Products List Column -->
          <a-col :sm="24" :xs="24" :md="14" :lg="14" style="padding: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <h5 style="font-size: 14px; font-weight: 600; color: #000; margin: 0;">Product List ({{ cart.total_items }} items)</h5>
              <button 
                v-if="cart.items.length > 0"
                style="background: none; border: none; color: #ff4d4f; font-size: 13px; cursor: pointer; padding: 0; text-decoration: underline;"
                @click="clearCart"
                :disabled="loading"
              >
                Clear All
              </button>
            </div>

            <div>
              <!-- Product Card -->
           <div 
  v-for="item in cart.items" 
  :key="item.id"
  style="display: grid; grid-template-columns: 100px 1fr; gap: 16px; padding: 16px; border-radius: 8px; border: 1px solid #f0f0f0; background-color: #fff;margin-bottom:10px;"
>
  <!-- Product Image -->
  <div >
    <img :src="this.$store.state.root_media_api+item.product_image" style="width: 100px; border-radius: 4px; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);" />
  </div>

  <!-- Product Details -->
  <div style="display: flex; flex-direction: column; justify-content: space-between;">
    <!-- Header with Title and Delete -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
      <div>
        <h4 style="margin: 0; font-weight: 600; font-size: 16px; color: #262626;">{{ item.product_name }}</h4>
        <p style="margin: 4px 0 0 0; color: #8c8c8c; font-size: 12px; text-transform: capitalize;">{{ item.product_type.replace('_', ' ') }}</p>
        <!-- <div class="hover:bg-green-10 p-1 " style="display: flex;justify-content: start;gap:10px; cursor:pointer" @click="$router.push('/'+item.business_profile_slug)">
          <a-avatar style="border:1px solid rgba(0,0,0,0.2)" :src="this.$store.state.root_media_api+item.business_profile_banner_picture" alt="" />
          <h4>{{ item.business_profile_name }}</h4>
        </div> -->
      </div>
      
      <button 
        style="background: none; border: none; cursor: pointer; color: #ff4d4f; padding: 4px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;"
        @click="removeItem(item.id)"
        :disabled="loading"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4H3.33333H14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5.33333 4V2.66667C5.33333 2.48986 5.40357 2.32029 5.52859 2.19526C5.65362 2.07024 5.82319 2 6 2H10C10.1768 2 10.3464 2.07024 10.4714 2.19526C10.5964 2.32029 10.6667 2.48986 10.6667 2.66667V4M12.6667 4V12.6667C12.6667 13.0203 12.5262 13.3594 12.2762 13.6095C12.0261 13.8595 11.687 14 11.3333 14H4.66667C4.31304 14 3.97391 13.8595 3.72386 13.6095C3.47381 13.3594 3.33333 13.0203 3.33333 12.6667V4H12.6667Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.66667 7.33333V11.3333" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.33333 7.33333V11.3333" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <!-- {{item}} -->
    </div>

    <!-- Color/Details if needed -->
    <div v-if="item.product_type !== 'furniture'" style="font-size: 12px; color: #8c8c8c; margin-bottom: 12px;">
      Qty: <strong style="color: #262626;">{{ item.quantity }} sqm</strong>
    </div>

    <!-- Price and Controls -->
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
      <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #1890ff;">{{ formatPrice(item.line_total) }}</h3>

      <!-- Quantity Controls -->
      <div style="display: flex; gap: 0; align-items: center; border: 1px solid #d9d9d9; border-radius: 4px; overflow: hidden; background: #fafafa;">
        <button 
          style="background: none; border: none; width: 32px; height: 32px; cursor: pointer; font-size: 14px; color: #595959; display: flex; align-items: center; justify-content: center;"
          @click="decreaseQuantity(item.id)"
          :disabled="loading"
        >−</button>
        <span style="width: 40px; text-align: center; font-size: 12px; color: #262626; border-left: 1px solid #d9d9d9; border-right: 1px solid #d9d9d9; padding: 6px 0;">{{ item.quantity }}</span>
        <button 
          style="background: none; border: none; width: 32px; height: 32px; cursor: pointer; font-size: 14px; color: #595959; display: flex; align-items: center; justify-content: center;"
          @click="increaseQuantity(item.id)"
          :disabled="loading"
        >+</button>
      </div>
    </div>
  </div>
</div>
            </div>
          </a-col>

          <!-- Order Summary Column -->
          <a-col :sm="24" :xs="24" :md="10" :lg="10" style="padding: 10px;">
            <h5 style="font-size: 14px; font-weight: 600; color: #000; margin-bottom: 16px;">Order Summary</h5>
            <div style="border-radius: 8px; padding: 20px; background-color: #f8f8f8; border: 1px solid #f0f0f0; position: sticky; top: 20px;">
              <div style="display: flex; flex-direction: column; justify-content: space-between; min-height: 300px;">
                <!-- Payment Details -->
                <div>
                  <h4 style="font-size: 14px; font-weight: 600; color: #262626; margin: 0 0 16px 0;">Payment</h4>

                  <!-- Subtotal -->
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px; align-items: center;">
                    <span style="font-size: 13px; color: #595959; font-weight: 400;">Subtotal</span>
                    <span style="font-size: 13px; color: #262626; font-weight: 600;">{{ formatPrice(cart.subtotal) }}</span>
                  </div>

                  <!-- Shipping -->
                  <div style="display: flex; justify-content: space-between; margin-bottom: 16px; align-items: center;">
                    <span style="font-size: 13px; color: #595959; font-weight: 400;">Shipping</span>
                    <span style="font-size: 13px; color: #262626; font-weight: 600;">{{ formatPrice(cart.shipping_charges) }}</span>
                  </div>

                  <hr style="margin: 16px 0; border: none; border-top: 1px solid #e8e8e8;"/>

                  <!-- Total Payment -->
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <span style="font-size: 13px; color: #262626; font-weight: 600;">Total Payment</span>
                    <span style="font-size: 18px; color: #1890ff; font-weight: 700;">{{ formatPrice(cart.total_payment) }}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div>
                  <!-- WhatsApp Contact -->
                  <a-button type="default" block style="margin-bottom: 20px; display: flex;justify-content: center; align-items: center; gap: 8px; cursor: pointer; padding: 12px; border-radius: 6px; background:#f2f2f2; border: 1px solid #dcfce7;">
                    <svg width="20" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.40457 9.74668C0.404125 11.4044 0.8245 13.0231 1.62384 14.4499L0.328125 19.3246L5.16956 18.0165C6.50865 18.7677 8.00898 19.1613 9.53362 19.1614H9.53763C14.5708 19.1614 18.6679 14.9412 18.67 9.7541C18.671 7.24057 17.7219 4.877 15.9975 3.09879C14.2734 1.32072 11.9804 0.340991 9.53726 0.339844C4.50352 0.339844 0.406723 4.55978 0.404645 9.74668" fill="#25D366"/>
                      <path d="M7.17691 5.67261C6.99983 5.26706 6.81346 5.25887 6.64506 5.25176C6.50716 5.24564 6.34952 5.2461 6.19203 5.2461C6.03439 5.2461 5.77826 5.30721 5.56177 5.55078C5.34505 5.79459 4.73438 6.38376 4.73438 7.58206C4.73438 8.78036 5.58143 9.93851 5.69952 10.1012C5.81775 10.2635 7.33478 12.8013 9.73739 13.7776C11.7342 14.5889 12.1405 14.4276 12.5739 14.3869C13.0073 14.3463 13.9725 13.7979 14.1694 13.2291C14.3664 12.6604 14.3664 12.173 14.3073 12.0711C14.2483 11.9696 14.0906 11.9087 13.8542 11.7869C13.6178 11.6652 12.4556 11.0759 12.239 10.9946C12.0223 10.9133 11.8647 10.8728 11.7071 11.1167C11.5494 11.3602 11.0968 11.9087 10.9588 12.0711C10.821 12.2339 10.683 12.2542 10.4467 12.1324C10.2102 12.0102 9.4489 11.7533 8.54573 10.9236C7.84303 10.278 7.36862 9.48072 7.23072 9.23684C7.09282 8.99334 7.21595 8.86134 7.33448 8.73998C7.44069 8.63085 7.57094 8.45556 7.68925 8.31339C7.80711 8.17115 7.84644 8.06967 7.92526 7.90723C8.00416 7.74464 7.96467 7.6024 7.90567 7.48057C7.84644 7.35875 7.3871 6.15418 7.17691 5.67261Z" fill="white"/>
                    </svg>
                    <span style="color: #22c55e; font-size: 13px; font-weight: 500;">Connect on WhatsApp</span>
                  </a-button>

                  <!-- Buttons -->
                  <a-space >
                    <a-button type="text" block >
                      Add Furniture
                    </a-button>
                    <a-button type="primary"  block  @click="checkout" :disabled="loading">
                      <span v-if="!loading">Back To the Owner Web</span>
                      <span v-else>Processing...</span>
                    </a-button>
                      <!-- <a-button 
                        type="default" 
                        block 
                        :href="item.business_website_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        :disabled="!item.business_website_url"
                        class="business-link-btn"
                      >
                        <template v-if="item.business_website_url">
                          <LinkOutlined class="mr-2" />
                          Back To Owner Website
                        </template>
                        <template v-else>
                          <LockOutlined class="mr-2" />
                          No Website Available
                        </template>
                      </a-button> -->

                  </a-space>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import { ExclamationCircleOutlined,LinkOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

export default {
  name: 'CartPage',
  data() {
    return {
      cart: {
        id: '',
        user: '',
        items: [],
        total_items: 0,
        subtotal: '0.00',
        shipping_charges: '0.00',
        total_payment: '0.00',
        created_at: '',
        updated_at: ''
      },
      loading: false
    };
  },
  mounted() {
    this.fetchCart();
  },
  methods: {
    getApiUrl() {
      return this.$store.state.root_api;
    },

    getToken() {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    },

    async makeRequest(url, method = 'GET', data = null) {
      const headers = {
        'Authorization': `Token ${this.getToken()}`,
        'Content-Type': 'application/json'
      };

      const options = { method, headers };

      if (data) {
        options.body = JSON.stringify(data);
      }

      try {
        const response = await fetch(url, options);
        
        if (response.status === 401) {
          this.$notification.error({
            message: 'Unauthorized! Please login again.',
            placement: 'bottomRight',
            duration: 3,
          });
          window.location.href = '/login';
          return null;
        }

        const result = await response.json();
        
        if (!response.ok) {
          this.$notification.error({
            message: result.error || 'An error occurred',
            placement: 'bottomRight',
            duration: 3,
          });
          return null;
        }

        return result;
      } catch (error) {
        console.error('Request error:', error);
        this.$notification.error({
          message: 'Network error. Please try again.',
          placement: 'bottomRight',
          duration: 3,
        });
        return null;
      }
    },

    async fetchCart() {
      this.loading = true;
      const url = `${this.getApiUrl()}cart/`;
      const result = await this.makeRequest(url, 'GET');
      
      if (result) {
        this.cart = result;
      }
      
      this.loading = false;
    },

    async increaseQuantity(itemId) {
      this.loading = true;
      const url = `${this.getApiUrl()}cart/${itemId}/increase/`;
      const result = await this.makeRequest(url, 'POST', { amount: 1 });
      
      if (result) {
        await this.fetchCart();
        this.$notification.success({
          message: 'Quantity increased',
          placement: 'bottomRight',
          duration: 3,
        });
      }
      
      this.loading = false;
    },

    async decreaseQuantity(itemId) {
      this.loading = true;
      const url = `${this.getApiUrl()}cart/${itemId}/decrease/`;
      const result = await this.makeRequest(url, 'POST', { amount: 1 });
      
      if (result) {
        await this.fetchCart();
        this.$notification.success({
          message: 'Quantity decreased',
          placement: 'bottomRight',
          duration: 3,
        });
      }
      
      this.loading = false;
    },

    async removeItem(itemId) {
  this.$confirm({
    title: 'Delete Item from Cart',
    icon: h(ExclamationCircleOutlined,LinkOutlined),
    content: h(
      'div',
      { style: 'color: #262626;' },
      'Are you sure you want to remove this item from your cart?'
    ),
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      this.loading = true;
      const url = `${this.getApiUrl()}cart/${itemId}/remove/`;
      const result = await this.makeRequest(url, 'DELETE');
      
      if (result) {
        await this.fetchCart();
        this.$notification.success({
          message: 'Item removed from cart',
          placement: 'bottomRight',
          duration: 3,
        });
      }
      
      this.loading = false;
    },
    onCancel: () => {
      console.log('Delete cancelled');
    },
  });
},

    async clearCart() {
      if (!confirm('Are you sure you want to clear your entire cart?')) {
        return;
      }

      this.loading = true;
      const url = `${this.getApiUrl()}cart/clear/`;
      const result = await this.makeRequest(url, 'DELETE');
      
      if (result) {
        await this.fetchCart();
        this.$notification.success({
          message: 'Cart cleared',
          placement: 'bottomRight',
          duration: 3,
        });
      }
      
      this.loading = false;
    },

    checkout() {
      if (this.cart.items.length === 0) {
        this.$notification.error({
          message: 'Your cart is empty!',
          placement: 'bottomRight',
          duration: 3,
        });
        return;
      }
      
      this.$router.push('/checkout');
      this.$notification.success({
        message: 'Redirecting to checkout...',
        placement: 'bottomRight',
        duration: 3,
      });
    },

   
    goToShop() {
      // this.$router.push('/shop');
    },

    formatPrice(price) {
      const numPrice = parseFloat(price);
      return `$${numPrice.toFixed(2)}`;
    }
  }
};
</script>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.cart-container {
  min-height: 100vh;
  background-color: #ffffff;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  position: relative;
  padding: 80px 20px 120px;

  overflow: hidden;
}

.wave-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  background-repeat: no-repeat;
  background-size: cover;
  background-image: 
    url("../../assets/pricing-banner.png");
  opacity: 0.9;
}

.header-content {
  text-align: center;

  position: relative;
  z-index: 2;
}

.header-title {
    padding-top:50px;
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

</style>