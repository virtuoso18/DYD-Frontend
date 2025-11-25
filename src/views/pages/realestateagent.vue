 <template>
  
    <!-- Main Banner Section -->
    <HeroBanner
  bgImage="/realestateagent.svg"
  heading1="Turning Real Estate Dreams into Reality 


"
  heading2="with Expert Advice and Knowledge  "
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

     <h3
  class="text-center pt-12 text-black"
  style="
    font-family: 'Proza Libre';
    font-weight: 700;
    font-style: bold;
    font-size: 48px;
    line-height: 52px;
    letter-spacing: -0.02em;
  "
>
Trusted by 10,000 Agents from Top Brokerages</h3>

   <div class="bg-[#F9FAFB] py-12 ">
    <!-- 5 Static Cards -->
    <div
      class="flex  justify-center md:justify-between gap-6 overflow-x-auto pb-6"
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
    <div
      class="flex flex pt-6 justify-center md:justify-between gap-6 overflow-x-auto pb-6"
    >
      <img
        src="../../assets/card6.png"
        alt="Card 1"
        class="w-[242px] h-[130px] object-cover rounded-xl  flex-shrink-0 hover:scale-105 transition-transform duration-300"
      />
      <img
        src="../../assets/card7.png"
        alt="Card 2"
        class="w-[242px] h-[130px] object-cover rounded-xl  flex-shrink-0 hover:scale-105 transition-transform duration-300"
      />
      <img
        src="../../assets/card8.png"
        alt="Card 3"
        class="w-[242px] h-[130px] object-cover rounded-xl  flex-shrink-0 hover:scale-105 transition-transform duration-300"
      />
      <img
        src="../../assets/card9.png"
        alt="Card 4"
        class="w-[242px] h-[130px] object-cover rounded-xl flex-shrink-0 hover:scale-105 transition-transform duration-300"
      />
      <img
        src="../../assets/card10.png"
        alt="Card 5"
        class="w-[242px] h-[130px] object-cover rounded-xl  flex-shrink-0 hover:scale-105 transition-transform duration-300"
      />
    </div>

    
  </div>   

    <CompanyStats />
    <SmartPlatform /> 
     

    
  
  
    

     
     

    
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
