 <template>
  
    <!-- Main Banner Section -->
    <HeroBanner
  bgImage="/furnitureretail.svg"
  heading1="Creating Innovative Designs That 

"
  heading2="Inspire and Transform Spaces "
  buttonText="Join Us"
/>
    
   <div
      class="flex flex justify-center md:justify-between pt-12 gap-6 overflow-x-auto pb-6"
    >
      <img
        src="../../assets/card11.png"
        alt="Card 1"
        class="w-[242px] h-[130px] object-cover rounded-xl  flex-shrink-0 hover:scale-105 transition-transform duration-300"
      />
      <img
        src="../../assets/card2.png"
        alt="Card 2"
        class="w-[242px] h-[130px] object-cover rounded-xl  flex-shrink-0 hover:scale-105 transition-transform duration-300"
      />
      <img
        src="../../assets/card3.png"
        alt="Card 3"
        class="w-[242px] h-[130px] object-cover rounded-xl  flex-shrink-0 hover:scale-105 transition-transform duration-300"
      />
      <img
        src="../../assets/card4.png"
        alt="Card 4"
        class="w-[242px] h-[130px] object-cover rounded-xl flex-shrink-0 hover:scale-105 transition-transform duration-300"
      />
      <img
        src="../../assets/card5.png"
        alt="Card 5"
        class="w-[242px] h-[130px] object-cover rounded-xl  flex-shrink-0 hover:scale-105 transition-transform duration-300"
      />
    </div>

    <Oneclickfurniture/>
     

    
  
  
    

     
     

    
    <!-- Company Stats Banner -->
    
    
    <!-- Get Results Section -->
     
    <GetResults
  mainTitle="Get listing-ready results in seconds"
  subText1="Turn your property photos into stunning visuals in three simple

."
  subText2="steps to attract buyers and enhance your listings."
/>
    
    <!-- Furniture Swap Swiper -->
    <swapingcards/>
    <!-- Virtual Staging Section -->
<CompanyStats />    
    <!-- Customer Reviews -->
    <CustomerReviews />
    
    <!-- FAQ Section -->
    <FAQSection />
    
    <!-- Contact Form -->
  
</template>

<script>
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
import UnlockPotential from '../newhome/UnlockPotential.vue';



export default {
  name: "NewHome",
  components: {
    HeroBanner,
    StatsCards,
    Oneclickfurniture,
    UnlockPotential,
    SmartPlatform,
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
