<template>
  <div class="w-full bg-white py-16 px-4">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
          Trusted by 10,000 Agents from Top Brokerages
        </h1>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto rounded-2xl border border-gray-200" >
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b-2 border-gray-200">
              <th class="text-left py-6 px-6 text-base font-semibold text-gray-900">Services</th>
              <th 
                v-for="(service, index) in services" 
                :key="index"
                class="text-center py-6 px-6 text-base font-semibold text-gray-900"
                :class="{ 'bg-blue-50': service.highlighted }"
              >
                {{ service.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(feature, featureIndex) in features" 
              :key="featureIndex"
              class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              :class="{ 'bg-gray-50': featureIndex % 2 === 1 }"
            >
              <td class="py-6 px-6 text-gray-900 font-medium">{{ feature.name }}</td>
              <td 
                v-for="(service, serviceIndex) in services" 
                :key="serviceIndex"
                class="py-6 px-6 text-center"
                :class="{ 'bg-blue-50': service.highlighted && featureIndex % 2 === 0, 'bg-blue-100': service.highlighted && featureIndex % 2 === 1 }"
              >
                <!-- Checkmark or X -->
                <svg 
                  v-if="feature.type === 'boolean'"
                  class="w-6 h-6 mx-auto"
                  :class="feature.values[serviceIndex] ? 'text-green-500' : 'text-red-500'"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    v-if="feature.values[serviceIndex]"
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M5 13l4 4L19 7" 
                  />
                  <path 
                    v-else
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>

                <!-- Text Value -->
                <span 
                  v-else-if="feature.type === 'text'"
                  class="text-gray-900"
                  :class="{ 'font-semibold': feature.bold }"
                >
                  {{ feature.values[serviceIndex] }}
                </span>

                <!-- Rating Dots -->
                <div v-else-if="feature.type === 'rating'" class="flex justify-center gap-1">
                  <div 
                    v-for="dot in 5" 
                    :key="dot"
                    class="w-2.5 h-2.5 rounded-full"
                    :class="dot <= feature.values[serviceIndex] ? 'bg-blue-500' : 'bg-gray-300'"
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile: Horizontal Scrollable Cards -->
      <div class="md:hidden overflow-x-auto scrollbar-hide -mx-4">
        <div class="flex gap-4 px-4 pb-4" style="scroll-snap-type: x proximity;">
          <div 
            v-for="(service, index) in services" 
            :key="index"
            class="flex-shrink-0 w-[280px] bg-white border rounded-2xl p-6 shadow-sm"
            :class="service.highlighted ? 'border-2 border-blue-500 bg-blue-50' : 'border-gray-200'"
            style="scroll-snap-align: start;"
          >
            <h3 class="text-xl font-bold text-gray-900 mb-6 text-center">
              {{ service.name }}
            </h3>
            
            <div class="space-y-4">
              <div 
                v-for="(feature, featureIndex) in features" 
                :key="featureIndex"
                class="flex items-center justify-between pb-4"
                :class="{ 'border-b border-gray-200': featureIndex < features.length - 1 }"
              >
                <span class="text-sm text-gray-600">{{ feature.mobileLabel || feature.name }}</span>
                
                <!-- Boolean (Checkmark/X) -->
                <svg 
                  v-if="feature.type === 'boolean'"
                  class="w-5 h-5"
                  :class="feature.values[index] ? 'text-green-500' : 'text-red-500'"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    v-if="feature.values[index]"
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M5 13l4 4L19 7" 
                  />
                  <path 
                    v-else
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>

                <!-- Text -->
                <span 
                  v-else-if="feature.type === 'text'"
                  class="text-gray-900"
                  :class="{ 'font-semibold': feature.bold }"
                >
                  {{ feature.values[index] }}
                </span>

                <!-- Rating -->
                <div v-else-if="feature.type === 'rating'" class="flex gap-1">
                  <div 
                    v-for="dot in 5" 
                    :key="dot"
                    class="w-2 h-2 rounded-full"
                    :class="dot <= feature.values[index] ? 'bg-blue-500' : 'bg-gray-300'"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ComparisonTable',
  
  data() {
    return {
      services: [
        { name: 'Unstaged', highlighted: false },
        { name: 'Traditional Staging', highlighted: false },
        { name: 'Virtual Staging', highlighted: false },
        { name: 'DYD AI Staging', highlighted: true }
      ],
      features: [
        {
          name: 'Easily Edit & Update',
          mobileLabel: 'Easily Edit & Update',
          type: 'boolean',
          values: [false, false, false, true]
        },
        {
          name: 'Cost',
          mobileLabel: 'Cost',
          type: 'text',
          bold: true,
          values: ['$0', '$5K - $40K+', '$20/ room', '$0.15 / photo']
        },
        {
          name: 'Turnaround Time',
          mobileLabel: 'Turnaround Time',
          type: 'text',
          bold: false,
          values: ['Turnaround Time', 'Weeks', 'Days', 'Seconds']
        },
        {
          name: 'Customer Satisfaction',
          mobileLabel: 'Satisfaction',
          type: 'rating',
          values: [1, 1, 1, 1] // Rating out of 5
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Hide scrollbar */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth scroll */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

/* Table hover effect */
@media (min-width: 768px) {
  tbody tr {
    transition: background-color 0.2s ease;
  }
}
</style>
