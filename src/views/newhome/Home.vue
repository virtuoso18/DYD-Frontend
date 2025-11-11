<template>
  <div>
    <!-- Main Banner Section -->
    <HeroBanner />
    
    <!-- Stats Cards -->
    <StatsCards />
    
    <!-- Unlock Potential Section -->
    <UnlockPotential />
    
    <!-- Smart Platform Section -->
    <SmartPlatform />
    
    <!-- Company Stats Banner -->
    <CompanyStats />
    
    <!-- Get Results Section -->
    <GetResults />
    
    <!-- Furniture Swap Swiper -->
    <FurnitureSwiper />
    
    <!-- Virtual Staging Section -->
    <ServicesShowcase />
    
    <!-- Customer Reviews -->
    <CustomerReviews />
    
    <!-- FAQ Section -->
    <FAQSection />
    
    <!-- Contact Form -->
    <ContactForm />
  </div>
</template>

<script>
import HeroBanner from './HeroBanner.vue'
import StatsCards from './StatsCards.vue'
import UnlockPotential from './UnlockPotential.vue'
import SmartPlatform from './SmartPlatform.vue'
import CompanyStats from './CompanyStats.vue'
import GetResults from './GetResults.vue'
import FurnitureSwiper from './FurnitureSwiper.vue'
import ServicesShowcase from './ServicesShowcase.vue'
import CustomerReviews from './CustomerReviews.vue'
import FAQSection from './FAQSection.vue'
import ContactForm from './ContactForm.vue'

export default {
  name: "NewHome",
  components: {
    HeroBanner,
    StatsCards,
    UnlockPotential,
    SmartPlatform,
    CompanyStats,
    GetResults,
    FurnitureSwiper,
    ServicesShowcase,
    CustomerReviews,
    FAQSection,
    ContactForm
  }
}
</script>
