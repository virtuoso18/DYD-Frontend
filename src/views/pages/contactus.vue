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
          Contact Us
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
          Feel free to contact us
        </h3>

        <!-- Subtitle -->
        <div
          class="flex items-center justify-center text-gray-600 text-center font-[Poppins] font-normal text-[20px] leading-[28px] tracking-[-0.02em]"
        >
          Revolutionizing Interior Design with Virtual Technology & AI
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
              Fill the Information
            </h3>

            <form class="flex flex-col gap-4" @submit.prevent="submitContactForm">
              <!-- Name and Email side by side -->
              <div class="flex flex-col sm:flex-row gap-4">
                <input
                  v-model="formData.name"
                  type="text"
                  placeholder="Enter name"
                  required
                  class="w-full border border-gray-300 rounded-md p-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  v-model="formData.email"
                  type="email"
                  placeholder="Your email"
                  required
                  class="w-full border border-gray-300 rounded-md p-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Message field -->
              <textarea
                v-model="formData.content"
                rows="4"
                placeholder="Your text"
                required
                class="w-full border border-gray-300 rounded-md p-3 resize-none text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>

              <!-- Send button -->
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-[#3B63FB] !text-white py-3 rounded-md font-[Poppins] font-medium text-[16px] leading-[24px] tracking-[0em] text-center hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {{ isSubmitting ? "Sending..." : "Send Now" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactUs",
  data() {
    return {
      formData: {
        name: "",
        email: "",
        content: "",
      },
      isSubmitting: false,
    };
  },
  methods: {
    async submitContactForm() {
      try {
        // Validate form data
        if (!this.formData.name || !this.formData.email || !this.formData.content) {
          this.$message.warning("Please fill in all fields");
          return;
        }

        this.isSubmitting = true;

        const response = await fetch(
          `${this.$store.state.root_api}customer-support/enquiries/create/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: this.formData.name,
              email: this.formData.email,
              content: this.formData.content,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        this.$message.success("Your enquiry has been sent successfully!");
        
        // Reset form
        this.formData = {
          name: "",
          email: "",
          content: "",
        };
      } catch (error) {
        console.error("Contact form submission failed", error);
        this.$message.error("Failed to send enquiry. Please try again.");
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>