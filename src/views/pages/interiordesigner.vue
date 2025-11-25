 <template>
  
    <!-- Main Banner Section -->
    <HeroBanner
  bgImage="/interiordesigner.svg"
  heading1="Turning Real Estate Dreams into Reality 


"
  heading2="with Expert Advice and Knowledge  "
  buttonText="Join Us"
/>
    
  <StatsCards/>  
  
  <TrustedSection/>

    
    <SmartPlatform /> 
     
<CompanyStats />

<ServicesShowcase/>
    
  
  
    

     
     

    
    <!-- Company Stats Banner -->
    
    
    <!-- Get Results Section -->
     
    <GetResults
  mainTitle="Get listing-ready results in seconds"
  subText1="Turn your property photos into stunning visuals in three simple

."
  subText2="steps to attract buyers and enhance your listings."
/>

<Accelerateyoursuccess/>

<TopBrokrage/>
    
    <!-- Furniture Swap Swiper -->
    <swapingcards/>
    <!-- Virtual Staging Section -->
   
    <!-- Customer Reviews -->
    <CustomerReviews />
    
    <!-- FAQ Section -->
    <FAQSection />
    
    <!-- Contact Form -->
  
</template>

<script>
import Accelerateyoursuccess from '../newhome/Accelerateyoursuccess.vue';
import CompanyStats from '../newhome/CompanyStats.vue';
import ContactForm from '../newhome/ContactForm.vue';
import CustomerReviews from '../newhome/CustomerReviews.vue';
import FAQSection from '../newhome/FAQSection.vue';
import FurnitureSwiper from '../newhome/FurnitureSwiper.vue';
import GetResults from '../newhome/GetResults.vue';
import HeroBanner from '../newhome/HeroBanner.vue';
import Homeinspiration from '../newhome/homeinspiration.vue';
import Oneclickfurniture from '../newhome/oneclickfurniture.vue';
import ServicesShowcase from '../newhome/ServicesShowcase.vue';
import SmartPlatform from '../newhome/SmartPlatform.vue';
import StatsCards from '../newhome/StatsCards.vue';
import Swapingcards from '../newhome/swapingcards.vue';
import TopBrokrage from '../newhome/TopBrokrage.vue';
import TrustedSection from '../newhome/TrustedSection.vue';
import UnlockPotential from '../newhome/UnlockPotential.vue';



export default {
  name: "NewHome",
  components: {
    HeroBanner,
    StatsCards,
    Oneclickfurniture,
    TopBrokrage,
    Accelerateyoursuccess,
    UnlockPotential,
    SmartPlatform,
    TrustedSection,
    CompanyStats,
    GetResults,
    FurnitureSwiper,
    Swapingcards,
    ServicesShowcase,
    CustomerReviews,
    Homeinspiration,
    FAQSection,
  }
}
</script>
