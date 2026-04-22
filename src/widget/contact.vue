<template>
  <Teleport to="body">
    <transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-1001 flex items-center justify-center backdrop-blur-xs p-4"
        style="background-color: rgba(0, 0, 0, 0.5);"
        @click="closeModal"
      >
        <!-- Desktop Modal -->
        <div 
          class="hidden md:block bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
          @click.stop
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Contact Details</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form Body -->
          <div class="p-6 max-h-[70vh] overflow-y-auto">
            <form @submit.prevent="submitForm" class="space-y-5">
              <!-- First Name & Last Name Row -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.firstName"
                    type="text"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    ]"
                    placeholder="Enter first name"
                  />
                  <p v-if="errors.firstName" class="mt-1 text-xs text-red-500">{{ errors.firstName }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.lastName"
                    type="text"
                    :class="[
                      'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    ]"
                    placeholder="Enter last name"
                  />
                  <p v-if="errors.lastName" class="mt-1 text-xs text-red-500">{{ errors.lastName }}</p>
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  :class="[
                    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  ]"
                  placeholder="Enter email address"
                />
                <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
              </div>

              <!-- Contact Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.contactNumber"
                  type="tel"
                  :class="[
                    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                    errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                  ]"
                  placeholder="Enter contact number"
                />
                <p v-if="errors.contactNumber" class="mt-1 text-xs text-red-500">{{ errors.contactNumber }}</p>
              </div>

              <!-- Submit Button -->
              <div class="pt-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  style="color:white"
                  class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isSubmitting ? 'Saving...' : 'Save Contact Details' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Mobile Modal (Simplified same as desktop but stacked) -->
        <div
          class="md:hidden bg-white rounded-t-3xl w-full flex flex-col absolute left-0 right-0 bottom-0 max-h-[90vh]"
          @click.stop
        >
          <div class="flex justify-center py-3">
            <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Contact Details</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <form @submit.prevent="submitForm" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.firstName"
                  type="text"
                  :class="[
                    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  ]"
                  placeholder="Enter first name"
                />
                <p v-if="errors.firstName" class="mt-1 text-xs text-red-500">{{ errors.firstName }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.lastName"
                  type="text"
                  :class="[
                    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  ]"
                  placeholder="Enter last name"
                />
                <p v-if="errors.lastName" class="mt-1 text-xs text-red-500">{{ errors.lastName }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  :class="[
                    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  ]"
                  placeholder="Enter email address"
                />
                <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.contactNumber"
                  type="tel"
                  :class="[
                    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                    errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                  ]"
                  placeholder="Enter contact number"
                />
                <p v-if="errors.contactNumber" class="mt-1 text-xs text-red-500">{{ errors.contactNumber }}</p>
              </div>
            </form>
          </div>

          <div class="border-t border-gray-200 p-4 bg-white">
            <button
              @click="submitForm"
              :disabled="isSubmitting"
              class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Contact Details' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: 'ContactModal',

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },

    
  },

  data() {
    return {
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: ''
      },
      errors: {
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: ''
      },
      isSubmitting: false
    };
  },

  watch: {
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
        this.resetForm();
      } else {
        document.body.style.overflow = '';
      }
    }
  },

  methods: {
    closeModal() {
      document.body.style.overflow = 'auto';
      this.$emit('close');
    },

    resetForm() {
      this.formData = {
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: ''
      };
      this.errors = {
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: ''
      };
    },

    validateForm() {
      let isValid = true;
      
      // Reset errors
      this.errors = {
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: ''
      };

      // Validate First Name
      if (!this.formData.firstName.trim()) {
        this.errors.firstName = 'First name is required';
        isValid = false;
      }

      // Validate Last Name
      if (!this.formData.lastName.trim()) {
        this.errors.lastName = 'Last name is required';
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.formData.email.trim()) {
        this.errors.email = 'Email address is required';
        isValid = false;
      } else if (!emailRegex.test(this.formData.email)) {
        this.errors.email = 'Please enter a valid email address';
        isValid = false;
      }

      // Validate Contact Number
      if (!this.formData.contactNumber.trim()) {
        this.errors.contactNumber = 'Contact number is required';
        isValid = false;
      } else if (this.formData.contactNumber.length < 10) {
        this.errors.contactNumber = 'Please enter a valid contact number';
        isValid = false;
      }

      return isValid;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      try {
        const payload = {
          first_name: this.formData.firstName,
          last_name: this.formData.lastName,
          email: this.formData.email,
          contact_number: this.formData.contactNumber,
          room_id:`${this.$route.params.id}`
        };

       
        const response = await fetch(
          `${this.$store.state.root_api}Auth/api/room-contacts/`,
          {
            method: 'POST',
            headers: {
              Authorization: `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (data.success) {
          this.$emit('success', data.data);
          alert('Contact details saved successfully!');
          this.closeModal();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (error) {
        console.error('Failed to submit contact details:', error);
        alert('Failed to save contact details. Please try again.');
        this.$emit('error', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .hidden.md\:block,
.modal-leave-to .hidden.md\:block {
  transform: scale(0.95);
}

.modal-enter-from .md\:hidden,
.modal-leave-to .md\:hidden {
  transform: translateY(100%);
}
</style>