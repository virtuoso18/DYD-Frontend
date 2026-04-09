<template>
  <div>
    <!-- Banner Section -->
    <div class="relative">
      <img
        src="../../assets/contact-us.jpg"
        alt="Contact Banner"
        class="w-full h-[494px] object-cover block"
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <h1
          class="text-center pb-12 text-black"
          style="
            font-family: 'Proza Libre';
            font-weight: 700;
            font-style: bold;
            font-size: 44px;
            line-height: 52px;
            letter-spacing: -0.02em;
          "
        >
          {{ t('contactUs.title') }}
        </h1>
      </div>
    </div>

    <!-- Contact Info + Form -->
    <div class="relative bg-white py-16 px-5 gap-10">
      <!-- Left Side: Contact Details -->
      <div class="space-y-6 mx-auto px-auto">
        <h3
          class="text-center mb-4 text-gray-800"
          style="
            font-family: 'Proza Libre';
            font-weight: 700;
            font-style: bold;
            font-size: 48px;
            line-height: 52px;
            letter-spacing: -0.02em;
          "
        >
          {{ t('contactUs.subtitle') }}
        </h3>

        <!-- Subtitle -->
        <div
          class="flex items-center justify-center text-gray-600 text-center font-[Poppins] font-normal text-[20px] leading-[28px] tracking-[-0.02em]"
        >
          {{ t('contactUs.description') }}
        </div>
      </div>

      <!-- Right Side: Contact Form -->
      <div class="flex justify-center items-center py-10">
        <div
          class="flex flex-col md:flex-row bg-white border-t-4 border-t-[#3B63FB] rounded-2xl shadow-[0_8px_40px_rgba(59,99,251,0.85)] overflow-hidden w-[90%] max-w-[1000px]"
        >
          <!-- Left Image Section -->
          <div class="md:w-1/2 w-full p-2 rounded-xl">
            <img
              src="../../assets/contactform.jpg"
              alt="Contact Us"
              class="w-full h-full object-cover rounded-xl"
            />
          </div>

          <!-- Right Form Section -->
          <div class="md:w-1/2 w-full p-8 flex flex-col justify-center">
            <h3
              class="text-center font-[Proza_Libre] font-bold text-[24px] text-gray-800 mb-6"
            >
              {{ t('contactUs.formTitle') }}
            </h3>

            <form class="flex flex-col gap-4" @submit.prevent="submitContactForm">
              <!-- Name and Email side by side -->
              <div class="flex flex-col sm:flex-row gap-4">
                <input
                  v-model="formData.name"
                  type="text"
                  :placeholder="t('contactUs.namePlaceholder')"
                  required
                  class="w-full border border-gray-300 rounded-md p-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  v-model="formData.email"
                  type="email"
                  :placeholder="t('contactUs.emailPlaceholder')"
                  required
                  class="w-full border border-gray-300 rounded-md p-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Message field -->
              <textarea
                v-model="formData.content"
                rows="4"
                :placeholder="t('contactUs.messagePlaceholder')"
                required
                class="w-full border border-gray-300 rounded-md p-3 resize-none text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              
              <!-- Attachments field -->
                <div class="w-full">
                  <label class="block text-sm text-gray-600 mb-1 font-[Poppins]">
                    {{ t('contactUs.attachmentsLabel') }} ({{ t('contactUs.optional') }})
                  </label>
                  <input
                    type="file"
                    multiple
                    ref="fileInput"
                    @change="handleFileChange"
                    class="w-full border border-gray-300 rounded-md p-2 text-[14px] text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 file:cursor-pointer cursor-pointer"
                  />
                  <!-- Selected files preview -->
                  <div v-if="formData.attachments.length" class="mt-2 flex flex-wrap gap-2">
                    <div
                      v-for="(file, index) in formData.attachments"
                      :key="index"
                      class="flex items-center gap-1 bg-blue-50 text-blue-700 text-[12px] px-2 py-1 rounded-full"
                    >
                      <span>{{ file.name }}</span>
                      <button
                        type="button"
                        @click="removeAttachment(index)"
                        class="ml-1 text-blue-400 hover:text-red-500 font-bold leading-none"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>
              <!-- Send button -->
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-[#3B63FB] !text-white py-3 rounded-md font-[Poppins] font-medium text-[16px] leading-[24px] tracking-[0em] text-center hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? t('contactUs.sending') : t('contactUs.sendButton') }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: "ContactUs",

  setup() {
    const { t, locale } = useI18n();
    return { t, locale };
  },

  data() {
    return {
      formData: {
        name: "",
        email: "",
        content: "",
        attachments: []
      },
      isSubmitting: false,
    };
  },
  methods: {
    handleFileChange(event) {
    const selected = Array.from(event.target.files);
    this.formData.attachments = [...this.formData.attachments, ...selected];

    this.$refs.fileInput.value = "";
  },
  removeAttachment(index) {
    this.formData.attachments.splice(index, 1);
  },
   async submitContactForm() {
  try {
    if (!this.formData.name || !this.formData.email || !this.formData.content) {
      this.$message.warning(this.t('contactUs.fillAllFields'));
      return;
    }

    this.isSubmitting = true;

    const payload = new FormData();
    payload.append('name', this.formData.name);
    payload.append('email', this.formData.email);
    payload.append('content', this.formData.content);

    for (const file of this.formData.attachments) {
      payload.append('attachments', file);  // key matches request.FILES.getlist('attachments')
    }

    const response = await fetch(
      `${this.$store.state.root_api}customer-support/enquiries/create/`,
      {
        method: "POST",
       
        body: payload,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await response.json();
    this.$message.success(this.t('contactUs.successMessage'));

    // Reset form
    this.formData = { name: "", email: "", content: "", attachments: [] };
    this.$refs.fileInput.value = "";

  } catch (error) {
    console.error("Contact form submission failed", error);
    this.$message.error(this.t('contactUs.errorMessage'));
  } finally {
    this.isSubmitting = false;
  }
},
  },
};
</script>