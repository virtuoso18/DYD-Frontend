<!-- ScheduleMeeting.vue -->
<template>
  <div>
    <!-- Banner Section -->
    <div class="relative">
      <img
        src="../../assets/sechdulemeeting.svg"
        alt="Contact Banner"
        class="w-full h-[542px] object-cover block"
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <h1
          class="text-center pb-56 text-black font-bold text-3xl md:text-5xl leading-tight tracking-tight"
          style="font-family: 'Proza Libre';"
        >
          Schedule a Meeting
        </h1>
      </div>
    </div>

    <!-- Meeting Scheduler Section -->
    <div class="bg-gray-50 py-16 px-5 ">
      <div class="max-w-full ">
        <!-- Title -->
        <h3
          class="text-center mb-12 text-gray-800 font-bold text-3xl md:text-5xl leading-tight tracking-tight"
          style="font-family: 'Proza Libre';"
        >
          Redirected to google meet calender
        </h3>

        <!-- Main Grid: Calendar + Booking Form -->
        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Left: Calendar -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <button
                @click="previousMonth"
                class="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h2 class="text-2xl font-bold text-gray-800">
                {{ monthNames[currentMonth] }} {{ currentYear }}
              </h2>
              
              <button
                @click="nextMonth"
                class="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Days of Week -->
            <div class="grid grid-cols-7 gap-2 mb-2">
              <div
                v-for="day in daysOfWeek"
                :key="day"
                class="text-center text-sm font-semibold text-gray-600 py-2"
              >
                {{ day }}
              </div>
            </div>

            <!-- Calendar Days -->
            <div class="grid grid-cols-7 gap-2">
              <div
                v-for="(day, index) in calendarDays"
                :key="index"
                @click="selectDate(day)"
                :class="[
                  'aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all',
                  day.isCurrentMonth 
                    ? 'hover:bg-blue-50' 
                    : 'text-gray-300',
                  day.isToday 
                    ? 'bg-blue-100 font-bold' 
                    : '',
                  day.isSelected 
                    ? 'bg-blue-600 text-white font-bold hover:bg-blue-700' 
                    : '',
                  day.isPast 
                    ? 'opacity-50 cursor-not-allowed' 
                    : '',
                  day.hasBooking 
                    ? 'relative' 
                    : ''
                ]"
              >
                {{ day.date }}
                <span
                  v-if="day.hasBooking"
                  class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"
                ></span>
              </div>
            </div>

            <!-- Quick Month Navigation -->
            <div class="mt-6 grid grid-cols-4 gap-2">
              <button
                v-for="(month, index) in monthNames"
                :key="index"
                @click="jumpToMonth(index)"
                :class="[
                  'py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                  currentMonth === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                ]"
              >
                {{ month.substring(0, 3) }}
              </button>
            </div>
          </div>

          <!-- Right: Booking Form -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Meeting Details</h3>

            <!-- Selected Date Display -->
            <div v-if="selectedDate" class="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded">
              <p class="text-sm text-gray-600 mb-1">Selected Date</p>
              <p class="text-lg font-semibold text-gray-800">
                {{ formatSelectedDate(selectedDate) }}
              </p>
            </div>

            <!-- Time Slots -->
            <div v-if="selectedDate" class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3">
                Available Time Slots
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="slot in timeSlots"
                  :key="slot"
                  @click="selectedTime = slot"
                  :class="[
                    'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                    selectedTime === slot
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  ]"
                >
                  {{ slot }}
                </button>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  v-model="bookingForm.name"
                  type="text"
                  placeholder="Enter your name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  v-model="bookingForm.email"
                  type="email"
                  placeholder="your@email.com"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  v-model="bookingForm.phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Meeting Purpose
                </label>
                <select
                  v-model="bookingForm.purpose"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select purpose</option>
                  <option value="consultation">Consultation</option>
                  <option value="demo">Product Demo</option>
                  <option value="support">Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  v-model="bookingForm.notes"
                  rows="3"
                  placeholder="Any specific topics you'd like to discuss?"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button
                @click="submitBooking"
                :disabled="!isFormValid"
                :class="[
                  'w-full py-4 rounded-lg font-bold text-lg transition-all',
                  isFormValid
                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                <span v-if="!isSubmitting">Book Meeting</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Admin View: Bookings List -->
        <div v-if="isAdmin" class="pt-12 bg-white rounded-2xl translate-y-8  shadow-lg p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-800">Admin: Scheduled Meetings</h3>
            <span class="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
              {{ bookings.length }} bookings
            </span>
          </div>

          <div v-if="bookings.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-lg">No bookings yet</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(booking, index) in sortedBookings"
              :key="index"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                  <h4 class="font-bold text-lg text-gray-800">{{ booking.name }}</h4>
                  <p class="text-sm text-gray-600">{{ booking.email }}</p>
                  <p class="text-sm text-gray-600">{{ booking.phone }}</p>
                </div>
                <span class="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Confirmed
                </span>
              </div>
              
              <div class="grid md:grid-cols-2 gap-2 mt-3 text-sm">
                <div class="flex items-center gap-2 text-gray-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatBookingDate(booking.date) }}
                </div>
                <div class="flex items-center gap-2 text-gray-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ booking.time }}
                </div>
              </div>

              <div v-if="booking.purpose" class="mt-2">
                <span class="text-xs font-semibold text-gray-600">Purpose:</span>
                <span class="text-sm text-gray-700 ml-2 capitalize">{{ booking.purpose }}</span>
              </div>

              <div v-if="booking.notes" class="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {{ booking.notes }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      @click="showSuccessModal = false"
    >
      <div
        @click.stop
        class="bg-white rounded-2xl p-8 max-w-md w-full text-center transform transition-all"
      >
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Meeting Booked!</h3>
        <p class="text-gray-600 mb-6">
          Your meeting has been successfully scheduled. We'll send a confirmation email shortly.
        </p>
        <button
          @click="showSuccessModal = false"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScheduleMeeting",
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedDate: null,
      selectedTime: null,
      showSuccessModal: false,
      isSubmitting: false,
      isAdmin: true, // Set to true to see admin view, false for user view
      
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      
      timeSlots: [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '01:00 PM', '02:00 PM',
        '03:00 PM', '04:00 PM', '05:00 PM'
      ],
      
      bookingForm: {
        name: '',
        email: '',
        phone: '',
        purpose: '',
        notes: ''
      },
      
      bookings: [] // This would typically come from your backend/database
    }
  },
  
  computed: {
    calendarDays() {
      const days = []
      const firstDay = new Date(this.currentYear, this.currentMonth, 1)
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0)
      const prevLastDay = new Date(this.currentYear, this.currentMonth, 0)
      
      const firstDayOfWeek = firstDay.getDay()
      const lastDateOfMonth = lastDay.getDate()
      const prevLastDate = prevLastDay.getDate()
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // Previous month days
      for (let i = firstDayOfWeek; i > 0; i--) {
        const date = prevLastDate - i + 1
        const fullDate = new Date(this.currentYear, this.currentMonth - 1, date)
        days.push({
          date,
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          isPast: fullDate < today,
          hasBooking: this.hasBookingOnDate(fullDate),
          fullDate
        })
      }
      
      // Current month days
      for (let i = 1; i <= lastDateOfMonth; i++) {
        const fullDate = new Date(this.currentYear, this.currentMonth, i)
        const isToday = fullDate.getTime() === today.getTime()
        const isSelected = this.selectedDate && 
          fullDate.getTime() === this.selectedDate.getTime()
        
        days.push({
          date: i,
          isCurrentMonth: true,
          isToday,
          isSelected,
          isPast: fullDate < today,
          hasBooking: this.hasBookingOnDate(fullDate),
          fullDate
        })
      }
      
      // Next month days
      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        const fullDate = new Date(this.currentYear, this.currentMonth + 1, i)
        days.push({
          date: i,
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          isPast: false,
          hasBooking: this.hasBookingOnDate(fullDate),
          fullDate
        })
      }
      
      return days
    },
    
    isFormValid() {
      return this.selectedDate &&
        this.selectedTime &&
        this.bookingForm.name.trim() &&
        this.bookingForm.email.trim() &&
        this.bookingForm.phone.trim()
    },
    
    sortedBookings() {
      return [...this.bookings].sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      })
    }
  },
  
  methods: {
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11
        this.currentYear--
      } else {
        this.currentMonth--
      }
    },
    
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0
        this.currentYear++
      } else {
        this.currentMonth++
      }
    },
    
    jumpToMonth(monthIndex) {
      this.currentMonth = monthIndex
    },
    
    selectDate(day) {
      if (!day.isCurrentMonth || day.isPast) return
      this.selectedDate = day.fullDate
      this.selectedTime = null
    },
    
    formatSelectedDate(date) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    },
    
    formatBookingDate(dateString) {
      const date = new Date(dateString)
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    },
    
    hasBookingOnDate(date) {
      return this.bookings.some(booking => {
        const bookingDate = new Date(booking.date)
        return bookingDate.toDateString() === date.toDateString()
      })
    },
    
    async submitBooking() {
      if (!this.isFormValid) return
      
      this.isSubmitting = true
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const booking = {
        ...this.bookingForm,
        date: this.selectedDate.toISOString(),
        time: this.selectedTime,
        createdAt: new Date().toISOString()
      }
      
      this.bookings.push(booking)
      
      // Reset form
      this.bookingForm = {
        name: '',
        email: '',
        phone: '',
        purpose: '',
        notes: ''
      }
      this.selectedDate = null
      this.selectedTime = null
      this.isSubmitting = false
      this.showSuccessModal = true
      
      // In a real app, you would send this to your backend:
      // await this.$http.post('/api/bookings', booking)
      console.log('Booking saved:', booking)
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Proza+Libre:wght@400;600;700;800&display=swap');

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>