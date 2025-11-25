<template>
  <div class="w-full bg-gray-100 py-16">
    <div class="max-w-8xl px-6">
      
      <!-- Header Section -->
      <div class="text-center mb-12 px-4">
        <h1
  class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900"
  style="
    font-family: 'Proza Libre';
    font-weight: 700;
    font-style: bold;
    font-size: 48px;
    line-height: 52px;
    letter-spacing: -0.02em;
  "
>
  Accelerate Your Success
</h1>

      </div>

      <!-- Mobile: Horizontal Scrollable -->
      <div class="lg:hidden overflow-x-auto scrollbar-hide px-4 -mx-4">
        <div class="flex gap-4 pb-4">
          <div 
            v-for="(card, index) in cards" 
            :key="index"
            class="flex-shrink-0 w-[280px] bg-white rounded-2xl shadow-md overflow-hidden"
            style="scroll-snap-align: start;"
          >
            <!-- Image -->
            <div class="relative overflow-hidden" style="height: 180px;">
              <img 
                :src="card.image" 
                :alt="card.title" 
                class="w-full h-full object-cover"
              />
            </div>
            
            <!-- Content -->
            <div class="p-4">
              <h3 class="text-base font-bold text-gray-900 mb-2">
                {{ card.title }}
              </h3>
              <p class="text-xs text-gray-600 leading-relaxed">
                {{ card.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop/Tablet: Grid Layout -->
<div class="hidden lg:grid lg:grid-cols-4 gap-6 px-12 mx-auto max-w-[1400px] justify-items-center">
        <div 
          v-for="(card, index) in cards" 
          :key="index"
          class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group cursor-pointer"
          @click="handleCardClick(card, index)"
        >
          <!-- Image -->
          <div class="relative overflow-hidden" style="height: 200px;">
            <img 
              :src="card.image" 
              :alt="card.title" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          <!-- Content -->
          <div class="p-2 flex-grow flex flex-col">
            <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {{ card.title }}
            </h3>
            <p class="text-xs text-gray-600 leading-relaxed flex-grow">
              {{ card.description }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'AccelerateSuccess',
  
  data() {
    return {
      cards: [
        {
          title: 'Listing Agents',
          description: 'A Listing Agent is a real estate professional who represents a property owner in selling their home, handling pricing, marketing, and negotiations with buyers.',
          image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
          type: 'listing'
        },
        {
          title: 'Buyer Agents',
          description: 'A Buyer Agent is a real estate professional who represents and guides the buyer through the process of finding, evaluating, and purchasing a property.',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
          type: 'buyer'
        },
        {
          title: 'Listing Agents',
          description: 'A Listing Agent is a real estate professional who represents a property owner in selling their home, handling pricing, marketing, and negotiations with buyers.',
          image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
          type: 'listing'
        },
        {
          title: 'Buyer Agents',
          description: 'A Buyer Agent is a real estate professional who represents and guides the buyer through the process of finding, evaluating, and purchasing a property.',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
          type: 'buyer'
        },
        {
          title: 'Listing Agents',
          description: 'A Listing Agent is a real estate professional who represents a property owner in selling their home, handling pricing, marketing, and negotiations with buyers.',
          image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
          type: 'listing'
        },
        {
          title: 'Buyer Agents',
          description: 'A Buyer Agent is a real estate professional who represents and guides the buyer through the process of finding, evaluating, and purchasing a property.',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
          type: 'buyer'
        },
        {
          title: 'Listing Agents',
          description: 'A Listing Agent is a real estate professional who represents a property owner in selling their home, handling pricing, marketing, and negotiations with buyers.',
          image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
          type: 'listing'
        },
        {
          title: 'Buyer Agents',
          description: 'A Buyer Agent is a real estate professional who represents and guides the buyer through the process of finding, evaluating, and purchasing a property.',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
          type: 'buyer'
        }
      ]
    }
  },

  methods: {
    handleCardClick(card, index) {
      console.log(`Card ${index} clicked:`, card.title);
      // Add your navigation or action logic here
      // this.$router.push(`/agents/${card.type}`)
      // this.$emit('card-selected', card)
    }
  }
}
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth scroll on mobile */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
