<template>
  <div class="pricing-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="wave-pattern"></div>
      <div class="header-content">
        <h1 class="header-title">Pricing</h1>
        <p class="header-subtitle">
          Use DYD AI for free. Upgrade to access additional features,<br>
          and increase limits design.
        </p>
      </div>
    </div>

    <!-- Pricing Cards Section -->
    <div class="pricing-section">
      <div class="free-credits-banner">
        <div class="credits-info">
          <h3>Get daily free credits</h3>
          <p>You will get 10 credits daily to generate image or create<br>3d models & edit image</p>
        </div>
        <div class="credits-badge">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20C15.523 20 20 15.523 20 10C20 4.477 15.523 0 10 0ZM10 1C10 3.38695 9.05179 5.67613 7.36396 7.36396C5.67613 9.05179 3.38695 10 1 10C3.38695 10 5.67613 10.9482 7.36396 12.636C9.05179 14.3239 10 16.6131 10 19C10 16.6131 10.9482 14.3239 12.636 12.636C14.3239 10.9482 16.6131 10 19 10C16.6131 10 14.3239 9.05179 12.636 7.36396C10.9482 5.67613 10 3.38695 10 1Z" fill="#3B63FB"/>
          </svg>
          <span class="credits-number">10</span>
        </div>
      </div>

      <!-- Logged In User Plans -->
      <div v-if="token && data !== null">
        <div class="pricing-cards">
          <div class="pricing-card basic-card">
            <div class="card-header">
              <h3 class="plan-name">Basic</h3>
              <p class="plan-subtitle">Basic Plan</p>
            </div>
            <div class="price-section">
              <span class="currency">$</span>
              <span class="price">{{ data.basic.monthly_charges }}</span>
              <p class="billing-period">{{data.basic.plan_credits}} credits / month</p>
            </div>
            <button class="get-started-btn basic-btn" @click="this.$router.push('/make-payment/'+'basic')">Get Started</button>
            <div class="features-list">
              <div class="feature-item"><span class="checkmark">✓</span><span>1000 monthly credits recharge</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>10 task working in queue</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>4 free retries per generation</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Multi-view image to 3D</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Download community models</span></div>
            </div>
          </div>

          <div class="pricing-card pro-card">
            <div class="card-header">
              <h3 class="plan-name">Pro</h3>
              <p class="plan-subtitle">MOST POPULAR</p>
            </div>
            <div class="price-section">
              <span class="currency">$</span>
              <span class="price">{{ data.pro.monthly_charges }}</span>
              <p class="billing-period">{{data.pro.plan_credits}} credits / month</p>
            </div>
            <button class="get-started-btn pro-btn" @click="this.$router.push('/make-payment/'+'pro')">Get Started</button>
            <div class="features-list">
              <div class="feature-item"><span class="checkmark">✓</span><span>4000 monthly credits recharge</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>30 task working in queue</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>8 free retries per generation</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Multi-view image to 3D</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Download community model</span></div>
            </div>
          </div>

          <div class="pricing-card enterprise-card">
            <div class="card-header">
              <h3 class="plan-name">Enterprise</h3>
              <p class="plan-subtitle">For Organization</p>
            </div>
            <div class="price-section">
              <span class="currency">$</span>
              <span class="price">{{ data.enterprise.monthly_charges }}</span>
              <p class="billing-period">{{data.enterprise.plan_credits}} Customizable credit / month</p>
            </div>
            <button class="get-started-btn enterprise-btn" @click="this.$router.push('/make-payment/'+'enterprise')">Get Started</button>
            <div class="features-list">
              <div class="feature-item"><span class="checkmark">✓</span><span>Customizable balance</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>50+ task working in queue</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>20 free retries per generation</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Multi-view image to 3D</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Download community model</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Guest User Plans with Toggle -->
      <div v-if="!token && data">
        <div class="plan-toggle-container">
          <button class="toggle-btn" :class="{ active: activePlanType === 'business' }" @click="activePlanType = 'business'">Business</button>
          <button class="toggle-btn" :class="{ active: activePlanType === 'professional' }" @click="activePlanType = 'professional'">Professional</button>
        </div>

        <div v-if="activePlanType === 'business'" class="pricing-cards">
          <div class="pricing-card basic-card">
            <div class="card-header">
              <h3 class="plan-name">Basic</h3>
              <p class="plan-subtitle">Basic Plan</p>
            </div>
            <div class="price-section">
              <span class="currency">$</span>
              <span class="price">{{ data.business_plan_list.basic.monthly_charges }}</span>
              <p class="billing-period">{{data.business_plan_list.basic.plan_credits}} credits / month</p>
            </div>
            <button class="get-started-btn basic-btn" @click="this.$router.push('/login')">Start 7-days Free Trial</button>
            <div class="features-list">
              <div class="feature-item"><span class="checkmark">✓</span><span>1000 monthly credits</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>10 task queue</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>4 free retries</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Multi-view image to 3D</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Download community models</span></div>
              <div class="feature-item disabled"><span class="crossmark">✕</span><span>Advanced analytics</span></div>
              <div class="feature-item disabled"><span class="crossmark">✕</span><span>Priority support</span></div>
            </div>
          </div>

          <div class="pricing-card pro-card featured">
            <div class="save-badge">Save 27%</div>
            <div class="card-header">
              <h3 class="plan-name"> Pro</h3>
              <p class="plan-subtitle">MOST POPULAR</p>
            </div>
            <div class="price-section">
              <span class="original-price">${{ calculateOriginalPrice(data.business_plan_list.pro.monthly_charges) }}</span>
              <span class="currency">$</span>
              <span class="price">{{ data.business_plan_list.pro.monthly_charges }}</span>
              <p class="billing-period">{{data.business_plan_list.pro.plan_credits}} credits / month</p>
            </div>
            <button class="get-started-btn pro-btn" @click="this.$router.push('/login')">Start 7-days Free Trial</button>
            <div class="features-list">
              <div class="feature-item"><span class="checkmark">✓</span><span>4000 monthly credits</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>30 task queue</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>8 free retries</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Multi-view image to 3D</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Download community model</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Advanced analytics</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Priority support</span></div>
            </div>
          </div>

          <div class="pricing-card enterprise-card">
            <div class="card-header">
              <h3 class="plan-name">Enterprise</h3>
              <p class="plan-subtitle">For Organization</p>
            </div>
            <div class="price-section">
              <span class="currency">$</span>
              <span class="price">{{ data.business_plan_list.enterprise.monthly_charges }}</span>
              <p class="billing-period">{{data.business_plan_list.enterprise.plan_credits}} credits / month</p>
            </div>
            <button class="get-started-btn enterprise-btn" @click="this.$router.push('/login')">Start 7-days Free Trial</button>
            <div class="features-list">
              <div class="feature-item"><span class="checkmark">✓</span><span>Customizable balance</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>50+ task queue</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>20 free retries</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Multi-view image to 3D</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Download community model</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Advanced analytics</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Priority support</span></div>
            </div>
          </div>
        </div>

        <div v-if="activePlanType === 'professional'" class="pricing-cards">
          <div class="pricing-card basic-card">
            <div class="card-header">
              <h3 class="plan-name">Basic</h3>
              <p class="plan-subtitle">Basic Plan</p>
            </div>
            <div class="price-section">
              <span class="currency">$</span>
              <span class="price">{{ data.professional_plan_list.basic.monthly_charges }}</span>
              <p class="billing-period">{{data.professional_plan_list.basic.plan_credits}} credits / month</p>
            </div>
            <button class="get-started-btn basic-btn" @click="this.$router.push('/login')">Start 7-days Free Trial</button>
            <div class="features-list">
              <div class="feature-item"><span class="checkmark">✓</span><span>1000 monthly credits</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>10 task queue</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>4 free retries</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Multi-view image to 3D</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Download community models</span></div>
              <div class="feature-item disabled"><span class="crossmark">✕</span><span>Advanced analytics</span></div>
              <div class="feature-item disabled"><span class="crossmark">✕</span><span>Priority support</span></div>
            </div>
          </div>

          <div class="pricing-card pro-card featured">
            <div class="save-badge">Save 27%</div>
            <div class="card-header">
              <h3 class="plan-name">Pro </h3>
              <p class="plan-subtitle">MOST POPULAR</p>
            </div>
            <div class="price-section">
              <span class="original-price">${{ calculateOriginalPrice(data.professional_plan_list.pro.monthly_charges) }}</span>
              <span class="currency">$</span>
              <span class="price">{{ data.professional_plan_list.pro.monthly_charges }}</span>
              <p class="billing-period">{{data.professional_plan_list.pro.plan_credits}} credits / month</p>
            </div>
            <button class="get-started-btn pro-btn" @click="this.$router.push('/login')">Start 7-days Free Trial</button>
            <div class="features-list">
              <div class="feature-item"><span class="checkmark">✓</span><span>4000 monthly credits</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>30 task queue</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>8 free retries</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Multi-view image to 3D</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Download community model</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Advanced analytics</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Priority support</span></div>
            </div>
          </div>

          <div class="pricing-card enterprise-card">
            <div class="card-header">
              <h3 class="plan-name">Enterprise</h3>
              <p class="plan-subtitle">For Organization</p>
            </div>
            <div class="price-section">
              <span class="currency">$</span>
              <span class="price">{{ data.professional_plan_list.enterprise.monthly_charges }}</span>
              <p class="billing-period">{{data.professional_plan_list.enterprise.plan_credits}} credits / month</p>
            </div>
            <button class="get-started-btn enterprise-btn" @click="this.$router.push('/login')">Start 7-days Free Trial</button>
            <div class="features-list">
              <div class="feature-item"><span class="checkmark">✓</span><span>Customizable balance</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>50+ task queue</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>20 free retries</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Multi-view image to 3D</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Download community model</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Advanced analytics</span></div>
              <div class="feature-item"><span class="checkmark">✓</span><span>Priority support</span></div>
            </div>
          </div>
        </div>
      </div>

      <br><br>
      <div class="credit-topup-section">
        <div class="topup-info">
          <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20C15.523 20 20 15.523 20 10C20 4.477 15.523 0 10 0ZM10 1C10 3.38695 9.05179 5.67613 7.36396 7.36396C5.67613 9.05179 3.38695 10 1 10C3.38695 10 5.67613 10.9482 7.36396 12.636C9.05179 14.3239 10 16.6131 10 19C10 16.6131 10.9482 14.3239 12.636 12.636C14.3239 10.9482 16.6131 10 19 10C16.6131 10 14.3239 9.05179 12.636 7.36396C10.9482 5.67613 10 3.38695 10 1Z" fill="#3B63FB"/>
          </svg>
          <div class="topup-text">
            <h3>Credit top up</h3>
            <p>This will not affect your monthly subscription plan and<br>will only be used after your monthly quota is exhausted</p>
          </div>
        </div>
        <div class="topup-offer">
          <div class="credits-amount">1,000 <span class="credits-label">credits</span></div>
          <button class="buy-btn">$50 Buy</button>
        </div>
      </div>
      <br><br>
    </div>
    <br><br>
  </div>
</template>

<script>
export default {
  name: 'pricing',
  data(){ 
    return {
      data: null,
      token: null,
      activePlanType: 'business'
    }
  },
  mounted(){
    this.token = localStorage.getItem('token')
    this.fetchPricingPlans()
  },
  methods: {
    async fetchPricingPlans(){
      try {
        let header = {}
        const token = this.token
        if (token){
          header['Authorization'] = `Token ${token}`
        }
        const response = await fetch(`${this.$store.state.root_api}subscription/api/get-all-plans/`, {
            method: 'GET',
            headers: header
        });
        const result = await response.json();
        if (result.success) {
            this.data = result.data;
        }
      } catch (error) {
          console.error('Error loading pricing plans:', error);
      }
    },
    calculateOriginalPrice(discountedPrice) {
      return (discountedPrice / 0.73).toFixed(0);
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.pricing-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8f9ff;
  min-height: 100vh;
}

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
  opacity: 0.9;
  
  background-image: 
    url("../../assets/pricing-banner.png");
}

.header-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.header-title {
  padding-top: 50px;
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  font-weight: 400;
}

.pricing-section {
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 20px;
}

.free-credits-banner {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.credits-info h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.credits-info p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.credits-badge {
  display: flex;
  align-items: center;
  color: #3B63FB;
  padding: 10px;
  border-radius: 50px;
  font-weight: 600;
}

.credits-number {
  font-size: 24px;
  font-weight: 700;
}

.plan-toggle-container {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 40px;
}

.toggle-btn {
  padding: 10px 28px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
}

.toggle-btn:hover {
  border-color: #4F46E5;
  color: #4F46E5;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #201b85 0%, #0d00ff 100%);;
  color: white;
  border-color: linear-gradient(135deg, #201b85 0%, #0d00ff 100%);;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.pricing-card {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  /* transition: all 0.3s ease; */
  position: relative;
}

.pricing-card:hover {
  /* transform: translateY(-2px); */
  /* box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12); */
}

.basic-card, .enterprise-card {
  background: #f8f9ff;
}

.pro-card {
  background: linear-gradient(135deg, #201b85 0%, #0d00ff 100%);;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 8px 30px rgba(45, 45, 45, 0.3);
}

.pro-card.featured {
  background: linear-gradient(135deg, #201b85 0%, #0d00ff 100%);
}

.save-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #fbbf24;
  color: #78350f;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.card-header {
  text-align: center;
  margin-bottom: 24px;
  margin-top: 10px;
}

.plan-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}

.basic-card .plan-name, .enterprise-card .plan-name {
  color: #1f2937;
}

.pro-card .plan-name {
  color: white;
}

.plan-subtitle {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.basic-card .plan-subtitle, .enterprise-card .plan-subtitle {
  color: #6b7280;
}

.pro-card .plan-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

.price-section {
  text-align: center;
  margin-bottom: 24px;
}

.original-price {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: line-through;
  margin-right: 8px;
}

.currency {
  font-size: 24px;
  font-weight: 600;
  vertical-align: top;
  margin-right: 2px;
}

.basic-card .currency, .enterprise-card .currency {
  color: #1f2937;
}

.pro-card .currency {
  color: white;
}

.price {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
}

.basic-card .price, .enterprise-card .price {
  color: #1f2937;
}

.pro-card .price {
  color: white;
}

.billing-period {
  font-size: 14px;
  margin-top: 8px;
  color: #6b7280;
}

.pro-card .billing-period {
  color: rgba(255, 255, 255, 0.7);
}

.get-started-btn {
  width: 100%;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.2s ease;
}

.basic-btn, .enterprise-btn {
  background: #4F46E5;
  color: white;
}

.basic-btn:hover, .enterprise-btn:hover {
  background: #4338CA;
}

.pro-btn {
  background: white;
  color: #2d2d2d;
}

.pro-btn:hover {
  background: #f0f0f0;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #374151;
}

.pro-card .feature-item {
  color: rgba(255, 255, 255, 0.9);
}

.feature-item.disabled {
  opacity: 0.6;
  color: #9ca3af;
}

.pro-card .feature-item.disabled {
  opacity: 0.5;
  color: rgba(255, 255, 255, 0.5);
}

.checkmark {
  color: #10b981;
  margin-right: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.pro-card .checkmark {
  color: #34d399;
}

.crossmark {
  color: #ef4444;
  margin-right: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.credit-topup-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 60px;
}

.topup-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.topup-text h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.topup-text p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.topup-offer {
  text-align: right;
}

.credits-amount {
  font-size: 32px;
  font-weight: 700;
  color: #4F46E5;
  margin-bottom: 12px;
}

.credits-label {
  font-size: 16px;
  font-weight: 400;
  color: #6b7280;
}

.buy-btn {
  padding: 10px 28px;
  background: #4F46E5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.buy-btn:hover {
  background: #4338CA;
}

@media (max-width: 768px) {
  .pricing-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .pro-card {
    transform: none;
  }
  
  .free-credits-banner,
  .credit-topup-section {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .header-title {
    font-size: 36px;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 60px 20px 100px;
  }
  
  .pricing-section {
    padding: 0 16px 60px;
  }
  
  .pricing-card {
    padding: 24px 20px;
  }
  
  .price {
    font-size: 36px;
  }
  
  .plan-toggle-container {
    margin-bottom: 30px;
  }
}
</style>