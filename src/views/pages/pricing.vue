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
          <span class="credits-icon">⚡</span>
          <span class="credits-number">10</span>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="pricing-cards">
        <!-- Basic Plan -->
        <div class="pricing-card basic-card">
          <div class="card-header">
            <h3 class="plan-name">Basic</h3>
            <p class="plan-subtitle">Basic Plan</p>
          </div>
          <div class="price-section">
            <span class="currency">$</span>
            <span class="price">45</span>
            <p class="billing-period">1000 credits / month</p>
          </div>
          <button class="get-started-btn basic-btn">Get Started</button>
          <div class="features-list">
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>1000 monthly credits recharge</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>10 task working in queue</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>4 free retries per generation</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>Multi-view image to 3D</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>Download community models</span>
            </div>
          </div>
        </div>

        <!-- Pro Plan -->
        <div class="pricing-card pro-card">
          <div class="card-header">
            <h3 class="plan-name">Pro</h3>
            <p class="plan-subtitle">MOST POPULAR</p>
          </div>
          <div class="price-section">
            <span class="currency">$</span>
            <span class="price">75</span>
            <p class="billing-period">4000 credits / month</p>
          </div>
          <button class="get-started-btn pro-btn">Get Started</button>
          <div class="features-list">
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>4000 monthly credits recharge</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>30 task working in queue</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>8 free retries per generation</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>Multi-view image to 3D</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>Download community model</span>
            </div>
          </div>
        </div>

        <!-- Enterprise Plan -->
        <div class="pricing-card enterprise-card">
          <div class="card-header">
            <h3 class="plan-name">Enterprise</h3>
            <p class="plan-subtitle">For Organization</p>
          </div>
          <div class="price-section">
            <span class="currency">$</span>
            <span class="price">90</span>
            <p class="billing-period">Customizable credit / month</p>
          </div>
          <button class="get-started-btn enterprise-btn">Get Started</button>
          <div class="features-list">
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>Customizable balance</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>50+ task working in queue</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>20 free retries per generation</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>Multi-view image to 3D</span>
            </div>
            <div class="feature-item">
              <span class="checkmark">✓</span>
              <span>Download community model</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Credit Top Up Section -->
      <div class="credit-topup-section">
        <div class="topup-info">
          <div class="topup-icon">💳</div>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'pricing'
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.pricing-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f8f9ff;
  min-height: 100vh;
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

.header-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  font-weight: 400;
}

/* Pricing Section */
.pricing-section {
  padding: 0 20px 0px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  top: -60px;
}

/* Free Credits Banner */
.free-credits-banner {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
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
  background: #4F46E5;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  font-weight: 600;
}

.credits-icon {
  margin-right: 8px;
  font-size: 16px;
}

.credits-number {
  font-size: 24px;
  font-weight: 700;
}

/* Pricing Cards */
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.basic-card, .enterprise-card {
  background: #f8f9ff;
}

.pro-card {
  background: #4F46E5;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 8px 30px rgba(79, 70, 229, 0.3);
}

.card-header {
  text-align: center;
  margin-bottom: 24px;
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

.currency {
  font-size: 24px;
  font-weight: 600;
  vertical-align: top;
  margin-right: 4px;
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
}

.basic-card .billing-period, .enterprise-card .billing-period {
  color: #6b7280;
}

.pro-card .billing-period {
  color: rgba(255, 255, 255, 0.8);
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
  color: #4F46E5;
}

.pro-btn:hover {
  background: #f8f9ff;
}

.features-list {
  space-y: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.basic-card .feature-item, .enterprise-card .feature-item {
  color: #374151;
}

.pro-card .feature-item {
  color: rgba(255, 255, 255, 0.9);
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

/* Credit Top Up Section */
.credit-topup-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 60px;
}

.topup-info {
  display: flex;
  align-items: center;
}

.topup-icon {
  font-size: 24px;
  margin-right: 20px;
  background: #4F46E5;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: #4F46E5;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.buy-btn:hover {
  background: #4338CA;
}

/* Responsive Design */
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
}
</style>