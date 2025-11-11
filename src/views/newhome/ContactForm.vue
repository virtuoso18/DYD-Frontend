<template>
  <div>
    <br /><br />
    <div class="text-center">
      <h1>Feel free to contact us</h1>
      <h3>Revolutionizing Interior Design with Virtual Technology & AI</h3>
      <br />

      <div class="flex justify-center items-center">
        <div class="bg-white p-10 rounded-xl shadow-[0_20px_60px_rgba(59,130,246,0.4)] max-w-[450px] w-full border-t-[3px] border-blue-500">
          <form @submit.prevent="submitForm" class="flex flex-col gap-5">
            <div class="flex gap-4">
              <input
                type="text"
                placeholder="Enter name"
                v-model="form.name"
                class="flex-1 py-3 px-3.5 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <input
                type="email"
                placeholder="Your email"
                v-model="form.email"
                class="flex-1 py-3 px-3.5 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <textarea
              placeholder="Your text"
              v-model="form.message"
              class="w-full min-h-[120px] py-3 px-3.5 border border-gray-300 rounded-md text-sm resize-y outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            ></textarea>

            <button
              type="submit"
              class="bg-blue-500 text-white py-3.5 border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-300 w-full hover:bg-blue-600 active:scale-95"
            >
              Send now
            </button>
          </form>
        </div>
      </div>
      <br /><br />
      <br /><br />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactForm',
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: ""
      }
    }
  },
  methods: {
    submitForm() {
      console.log("Form submitted:", this.form)
      alert("Message sent!")
    }
  }
}
</script>
