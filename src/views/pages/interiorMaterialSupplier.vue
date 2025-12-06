<template>
  <div>
    <!-- Main Banner Section -->
    <HeroBanner
  bgImage="/interior.jpg"
  heading1="Delivering the Finest Materials to 
"
  heading2="Transform Spaces with Style"
  buttonText="Join Us"
/>
    
   
    
  
    

    
    <!-- Company Stats Banner -->
    
    
    <!-- Get Results Section -->
     
    <GetResults
  mainTitle="Digitalize Your Catalog with DYD AI"
  subText1="Turn your property photos into stunning visuals in three simple
."
  subText2="steps to attract buyers and enhance your listings"
/>
    <swapingcards/>
    <!-- Furniture Swap Swiper -->
    <FurnitureSwiper />
    
    <!-- Virtual Staging Section -->
<CompanyStats />    
    <!-- Customer Reviews -->
    <CustomerReviews />
    
    <!-- FAQ Section -->
    <FAQSection />
    
    <!-- Contact Form -->
  </div>
</template>

<script>
import CompanyStats from '../newhome/CompanyStats.vue';
import ContactForm from '../newhome/ContactForm.vue';
import CustomerReviews from '../newhome/CustomerReviews.vue';
import FAQSection from '../newhome/FAQSection.vue';
import FurnitureSwiper from '../newhome/FurnitureSwiper.vue';
import GetResults from '../newhome/GetResults.vue';
import HeroBanner from '../newhome/HeroBanner.vue';
import ServicesShowcase from '../newhome/ServicesShowcase.vue';
import SmartPlatform from '../newhome/SmartPlatform.vue';
import StatsCards from '../newhome/StatsCards.vue';
import Swapingcards from '../newhome/swapingcards.vue';
import UnlockPotential from '../newhome/UnlockPotential.vue';



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
    Swapingcards,
    ServicesShowcase,
    CustomerReviews,
    FAQSection,
  }
}
</script>
