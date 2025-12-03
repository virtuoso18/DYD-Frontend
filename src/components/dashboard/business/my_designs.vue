<template>
<div class="sm:main sm:border border-gray-200 bg-white !mb-5 sm:translate-y-3 sm:rounded-2xl min-h-[100vh] md:min-h-[136vh] xl:min-h-[170vh] 2xl:min-h-[150vh]">
    <a-row v-if="view_type=='all'">
    <a-col :span="24">


   <h2 className="!p-4 sm:p-0 !font-[Poppins] font-medium text-[16px] leading-[24px] text-gray-700 tracking-[0]">
  My Designes
</h2>


    
    
    
    </a-col>

    <!-- Empty State -->
    <a-col :span="24" v-if="my_designes.length === 0" style="display:flex;justify-content:center;align-items:center;height:80vh;text-align: center; padding: 60px 20px;">
        <a-empty description="No designs available yet">
            <template #description>
                <p style="color: #666; font-size: 16px;">You haven't created any designs yet.</p>
                <p style="color: #999; font-size: 14px;">Start creating your first design!</p>
            </template>
        </a-empty>
    </a-col>

    <!-- Designs List -->
    <a-col :lg="8" :md="8" :xs="24" :sm="24" style="padding:5px;" v-for="design in my_designes" :key="design.id" v-if="my_designes.length > 0">
        <div style="border:1px solid rgba(0,0,0,0.1);padding: 5px;border-radius:10px;">
            <img :src="this.$store.state.root_media_api+design.image" style="width:100%;border-radius:10px;max-height:200px;object-fit:cover" alt="" @click="show_design_details(design.id)">
            <a-row style="padding-top:5px">
                <a-col :span="22" >
                    <a-tag>Room : {{  design.room_type }}</a-tag>
                    <a-tag>Style : {{ design.room_design_type }}</a-tag>
                </a-col>
                <a-col :span="2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 16 16" fill="#000000" class="bi bi-three-dots-vertical">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    </svg>
                </a-col>
            </a-row>
        </div>
    </a-col>
</a-row>


    <a-row v-if="view_type == 'details' && selected_design">
      <a-row>
        <div class="w-full flex p-3 justify-between items-center">

  <!-- Back Button -->
  <button 
    @click="goback" 
    class="flex items-center gap-2 !text-gray-700 text-lg hover:text-black"
  >
    <!-- Icon -->
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a1 1 0 01-.7-.3l-7-7a1 1 0 010-1.4l7-7a1 1 0 111.4 1.4L4.42 9H18a1 1 0 110 2H4.42l6.28 6.3A1 1 0 0110 18z" clip-rule="evenodd"/>
    </svg>

    <b>Back</b>
  </button>

  <!-- Right Side Buttons -->
  <div class="flex items-center gap-3">

    <!-- Edit Button -->
    <button 
      v-if="!start_edit"
      @click="edit_Design"
      class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 border border-gray-300"
      style="font-family: var(--font-family-main); color: var(--text-color);"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"></path>
      </svg>
      Edit
    </button>

    <!-- Save Button -->
    <button 
      v-if="start_edit"
      @click="save_Design"
      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
      style="font-family: var(--font-family-main); color: var(--text-color);"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7"></path>
      </svg>
      Save
    </button>

    <!-- Close Button -->
    <button 
      v-if="start_edit"
      @click="close_Design"
      class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 flex items-center gap-2"
      style="font-family: var(--font-family-main); color: var(--text-color);"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M6 18L18 6M6 6l12 12"></path>
      </svg>
      Close
    </button>

    <!-- Delete Button -->
    <button 
      @click="delete_Design"
      class="px-4 py-2 !text-red-600 hover:text-red-700 border rounded-md flex items-center gap-2"
    >
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_6921_12619)">
<path d="M13.5938 3.75H1.40625C1.14375 3.75 0.9375 3.54375 0.9375 3.28125C0.9375 3.01875 1.14375 2.8125 1.40625 2.8125H13.5938C13.8562 2.8125 14.0625 3.01875 14.0625 3.28125C14.0625 3.54375 13.8562 3.75 13.5938 3.75Z" fill="#E33827"/>
<path d="M10.332 3.57344L9.91953 2.20469C9.89113 2.10732 9.83192 2.02179 9.75078 1.96094C9.66964 1.90008 9.57095 1.86719 9.46953 1.86719H5.53203C5.43061 1.86719 5.33192 1.90008 5.25078 1.96094C5.16964 2.02179 5.11043 2.10732 5.08203 2.20469L4.66953 3.57344L3.76953 3.30156L4.18203 1.93281C4.36016 1.33281 4.90391 0.929688 5.53203 0.929688H9.46953C10.0977 0.929688 10.632 1.33281 10.8195 1.93281L11.232 3.30156L10.332 3.57344Z" fill="#E33827"/>
<path d="M10.8086 14.0625H4.18984C3.43047 14.0625 2.81172 13.4625 2.78359 12.7031L2.46484 3.45L3.40234 3.42188L3.72109 12.675C3.72109 12.9281 3.93672 13.125 4.18984 13.125H10.818C11.0711 13.125 11.2773 12.9281 11.2867 12.675L11.6055 3.42188L12.543 3.45L12.2242 12.7031C12.1961 13.4625 11.5773 14.0625 10.818 14.0625H10.8086Z" fill="#E33827"/>
<path d="M6.09375 10.8945C5.83125 10.8945 5.625 10.6883 5.625 10.4258V6.67578C5.625 6.41328 5.83125 6.20703 6.09375 6.20703C6.35625 6.20703 6.5625 6.41328 6.5625 6.67578V10.4258C6.5625 10.6883 6.35625 10.8945 6.09375 10.8945ZM8.90625 10.8945C8.64375 10.8945 8.4375 10.6883 8.4375 10.4258V6.67578C8.4375 6.41328 8.64375 6.20703 8.90625 6.20703C9.16875 6.20703 9.375 6.41328 9.375 6.67578V10.4258C9.375 10.6883 9.16875 10.8945 8.90625 10.8945Z" fill="#E33827"/>
</g>
<defs>
<clipPath id="clip0_6921_12619">
<rect width="15" height="15" fill="white"/>
</clipPath>
</defs>
</svg>

      Delete
    </button>

  </div>
</div>

        <a-col :xs="24" :sm="24" :md="12" :lg="12" style="padding: 10px">
          <img
            :src="this.$store.state.root_media_api + selected_design.data.image"
            style="
              width: 100%;
              height: 100%;
              max-height: 400px;
              border-radius: 10px;
              object-fit: cover;
            "
            alt=""
          />
        </a-col>
        <a-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          style="padding: 10px"
          v-if="!start_edit"
        >
          <!-- {{ selected_design.data}} -->
            <span      style="
    font-family: var(--font-family-main);
         color:var(--text-color)
        "
    >

              {{ selected_design.data.room_description }}
            </span>
          

          <br /><br />
          <a-tag>{{ selected_design.data.room_type }}</a-tag>
          <a-tag>{{ selected_design.data.room_design_type }}</a-tag>

          <br />
          <br />
          <p
            style="
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 4px;
              color: #666;
            "
          >
            Created From
          </p>
          

          <router-link
            :to="'/' + selected_design.data.business_slug"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 6px 10px;
              border-radius: 6px;
              text-decoration: none;
              color: #333;
              font-weight: 600;
              transition: background 1.2s ease;
            "
          >
            <a-avatar
              :src="
                $store.state.root_media_api +
                selected_design.data.business_picture
              "
              style="flex-shrink: 0"
            />
            <span style="font-size: 15px; font-weight: 600">{{
              selected_design.data.business_name
            }}</span>
            
          </router-link>

          <div class="w-full max-w-xl mx-auto bg-gray-100 rounded-2xl border border-gray-200 !mt-4  p-6">
    <!-- Header -->
    <div class="flex items-start gap-4 mb-6">
      <!-- Image -->
      <div class="flex-shrink-0">
        <img 
          :src="projectImage" 
          alt="Project"
          class="w-24 h-24 rounded-lg object-cover"
        />
      </div>

      <!-- Text Content -->
      <div class="flex-1">
        <h2 class="text-xl font-bold text-gray-900 mb-2"
        
             style="
    font-family: var(--font-family-main);
         color:var(--text-color)
        "
    
        >
          Share your project
        </h2>
        <p class="text-gray-600 text-sm leading-relaxed">
          Tell your community about the project you created
        </p>
      </div>
    </div>

    <!-- Share Button -->
    <button 
      @click="shareOnCommunity"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg"
    >
      <svg 
        class="w-5 h-5" 
        fill="none" 
        stroke="white" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
      <span className="text-white"      style="
    font-family: var(--font-family-main);
        "
    >Share on community</span>
    </button>
  </div>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" style="padding: 10px" v-else>
          <div style="margin-bottom: 20px">
            <label
              style="
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #333;
              "
            >
              Describe Room <span style="color: red">*</span>
            </label>
            <a-textarea
              v-model:value="description_room"
              placeholder="Give your design an attractive descriptionhere ..."
              size="large"
              :rows="4"
              :maxlength="200"
              show-count
              style="border-radius: 8px"
            />
          </div>

          <div style="display: flex; gap: 15px; font-size: 14px; color: #666">
            <span
              ><strong>Style:</strong>
              <a-select v-model:value="room_design_type_select">
                <a-option-select value="Modern">Modern</a-option-select>
                <a-option-select value="Classic">Classic</a-option-select>
                <a-option-select value="Rustic">Rustic</a-option-select>
                <a-option-select value="Industrial">Industrial</a-option-select>
                <a-option-select value="Minimalist">Minimalist</a-option-select>
                <a-option-select value="Traditional"
                  >Traditional</a-option-select
                >
                <a-option-select value="Contemporary"
                  >Contemporary</a-option-select
                >
                <a-option-select value="Vintage">Vintage</a-option-select>
              </a-select>
              <!-- {{ room_type || 'Living Room' }} -->
            </span>
            <span
              ><strong>Room Type:</strong>
              <a-select v-model:value="room_type_select">
                <a-option-select value="Living Room"
                  >Living Room</a-option-select
                >
                <a-option-select value="Dinning Room"
                  >Dinning Room</a-option-select
                >
                <a-option-select value="Kitchen">Kitchen</a-option-select>
                <a-option-select value="Home Office"
                  >Home Office</a-option-select
                >
                <a-option-select value="Bedroom">Bedroom</a-option-select>
                <a-option-select value="Office">Office</a-option-select>
                <a-option-select value="Rest Room">Rest Room</a-option-select>
              </a-select>
              <!-- {{ room_design_type || 'Modern' }} -->
            </span>
            <span v-if="products_used"
              ><strong>Products:</strong> {{ products_used.length }} items</span
            >
          </div>
        </a-col>

        <a-col :span="24">
          <a-row>
            <a-col
              v-for="product in selected_design.data.products_used"
              :key="product.id"
              class="product-responsive"
              style="padding: 5px"
            >
              <!-- {{product.product_colors}} -->
              <div class="product">
                <div
                  class="product-image-container"
                  @click="viewProduct(product)"
                >
                  <img
                    :src="$store.state.root_media_api + product.product_image"
                    :alt="product.product_title"
                    class="product-image"
                  />
                  <!-- Category Badge -->
                  <div class="category-badge">{{ product.category_name }}</div>
                  <!-- AR Badge -->
                  <div class="ar-badge">AR</div>
                </div>
                <!-- {{ truncateText(product.description || 'No description available', 8) }} -->

                <a-row>
              <div
  class="overflow-x-auto whitespace-nowrap hide-scrollbar"
  style="max-width: 200px;"
>
  <b class="font-light !text-gray-700 inline-block">
    {{ product.product_title }}
  </b>
</div>



<a-col 
  span="18"
  
  class="font-light !text-gray-700"
>
  Color
</a-col>
                  <a-col  span="6" style="display: flex; justify-content: end">
                    <div
                      v-for="(color, index) in product.product_colors.slice(
                        0,
                        2
                      )"
                      :key="index"
                      style="
                        width: 20px;
                        height: 20px;
                        border-radius: 20px;
                        margin-left: 2px;
                      "
                      :style="
                        'background:' +
                        (color.color_hex ? color.color_hex : color.color)
                      "
                    >
                      <!-- {{ color }} -->
                    </div>
                  </a-col>

                  <a-col class="!text-gray-700" span="12"> Price </a-col>

                  <a-col
                  class="!text-gray-700"
                    span="12"
                    style="
                      display: flex;
                      justify-content: end;
                      font-weight: 700;
                    "
                  >
                    <!-- <del style="font-size: 10px;">${{ product.pricing.price }}</del> -->
                    ${{ product.product_price }}
                  </a-col>

                  <a-col span="17">
                    <a-button block @click="viewProduct(product)"
                      >Product Details</a-button
                    >
                  </a-col>

                  <a-col span="1"></a-col>
                  <a-col span="4">
                      <a-button @click="toggleFavorite(product.product_id,product.product_type,product)">
                                                                    <template v-if="product.is_favorited">
                                                                    <HeartFilled style="color: red" />
                                                                    </template>
                                                                    <template v-else>
                                                                    <HeartOutlined />
                                                                    </template>
                                                </a-button>
                  </a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-row>
  </div>
</template>
<script>
import {
  HeartOutlined,
  DeleteOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  CloseOutlined,
    HeartFilled,
} from "@ant-design/icons-vue";

export default {
  name: "my_designes",
  data() {
    return {
      my_designes: [],
      view_type: "all",
      selected_design: null,
      start_edit: false,
      description_room: "",
      room_design_type_select: "",
      room_type_select: "",
    };
  },
  components: {
    HeartOutlined,
    DeleteOutlined,
        HeartFilled,
    EditOutlined,
    ArrowLeftOutlined,
    SaveOutlined,
    CloseOutlined,
  },
  mounted() {
    this.loadMyDesignes();
  },
  methods: {
    async delete_Design() {
      console.log("Delete design button clicked");

      // Show confirmation dialog
      this.$confirm({
        title: "Delete Design",
        content:
          "Are you sure you want to delete this design? This action cannot be undone.",
        okText: "Yes, Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          this.loading = true;

          try {
            const url = `${this.$store.state.root_api}engine/my-rendered-designes/`;

            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                type: "delete_specific_design",
                design_id: this.selected_design.data.id,
              }),
            });

            if (!response.ok) {
              throw new Error(
                `HTTP ${response.status}: ${response.statusText}`
              );
            }

            const responseData = await response.json();

            if (responseData.success || responseData.status === "success") {
              this.$message.success("Design deleted successfully");
              // Go back to designs list and reload
              this.view_type = "all";
              this.selected_design = null;
              await this.loadMyDesignes(); // Reload the designs list
            } else {
              throw new Error(
                responseData.message || "Failed to delete design"
              );
            }
          } catch (error) {
            console.error("❌ Failed to delete design:", error);
            this.$message.error(error.message || "Failed to delete design");
          } finally {
            this.loading = false;
          }
        },
      });
    },

    async save_Design() {
      console.log("Save design button clicked");

      // Validate required fields
      if (!this.description_room.trim()) {
        this.$message.error("Please provide a room description");
        return;
      }

      if (!this.room_design_type_select) {
        this.$message.error("Please select a design style");
        return;
      }

      if (!this.room_type_select) {
        this.$message.error("Please select a room type");
        return;
      }

      this.loading = true;

      try {
        const url = `${this.$store.state.root_api}engine/my-rendered-designes/`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            type: "save_design_details",
            design_id: this.selected_design.data.id,
            description_room: this.description_room.trim(),
            room_design_type_select: this.room_design_type_select,
            room_type_select: this.room_type_select,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (responseData.success || responseData.status === "success") {
          this.$message.success("Design updated successfully");

          // Update the selected design data with new values
          this.selected_design.data.room_description =
            this.description_room.trim();
          this.selected_design.data.room_design_type =
            this.room_design_type_select;
          this.selected_design.data.room_type = this.room_type_select;

          // Exit edit mode
          this.start_edit = false;

          // Optionally reload the designs list to reflect changes
          await this.loadMyDesignes();
        } else {
          throw new Error(responseData.message || "Failed to save design");
        }
      } catch (error) {
        console.error("❌ Failed to save design:", error);
        this.$message.error(error.message || "Failed to save design changes");
      } finally {
        this.loading = false;
      }
    },
    edit_Design() {
      this.start_edit = true;
      console.log("edit_design Button Clicked ");
    },

    close_Design() {
      this.start_edit = false;
    },

    showError(title, message, retryCallback) {
      this.$notification.error({
        message: title,
        description: message,
        duration: 0,
      });
    },
    async loadMyDesignes() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${this.$store.state.root_api}engine/my-rendered-designes/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        console.log(result);
        if (result) {
          this.my_designes = result.data;
        } else {
          console.error("Failed to load business profile:", result.message);
          this.$message.error("Failed to load business profile");
        }
      } catch (error) {
        console.error("Error loading business profile:", error);
        this.$message.error("Network error while loading profile");
      }
    },

    show_design_details(design_id) {
      (this.view_type = "details"), this.loadDesignDetails(design_id);
    },

    async loadDesignDetails(design_id) {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${this.$store.state.root_api}engine/my-rendered-designes/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              design_id: design_id,
              type: "design_details",
            }),
          }
        );

        const result = await response.json();
        this.selected_design = result;

        this.description_room = this.selected_design.data.room_description;
        this.room_design_type_select = this.selected_design.data.room_type;
        this.room_type_select = this.selected_design.data.room_design_type;
      } catch (error) {
        console.error("Error loading business profile:", error);
        this.$message.error("Network error while loading profile");
      }
    },
    goback() {
      this.view_type = "all";
      this.selected_design = null;
    },
    async toggleFavorite(product_id,product_type,product) {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(
                
            `${this.$store.state.root_api}likes/favorites/toggle/`,
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`,
                },
                body: JSON.stringify({
                id: product_id,
                type: product_type,
                }),
            }
            );

            const data = await response.json();

            product.is_favorited = data.favorited;

        } catch (error) {
            console.error("Favorite toggle failed", error);
        }
        }
  },
};
</script>
<style scoped>
.main {
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
  border: 1px solid rgba(128, 128, 128, 0.167);
  padding: 10px;
  
  background-color: white;
}

.head-section {
  display: flex;
  justify-content: space-between;
}
.product {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f3f2f4;
}
.products-list {
  padding-bottom: 20px;
}
.product-image-container {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: 16px; */
}

.product-image {
  width: 100%;
  height: 100%;

  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hide-scrollbar {
  scrollbar-width: none;       /* Firefox */
  -ms-overflow-style: none;    /* IE/Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;               /* Chrome / Safari */
}


.ar-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #e5e7eb;
  color: #374151;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.product-responsive {
  width: 50%;
  flex: 0 0 50%;
}

@media (min-width: 576px) {
  .product-responsive {
    width: 50%;
    flex: 0 0 50%;
  }
}
@media (min-width: 768px) {
  .product-responsive {
    width: 33.333%;
    flex: 0 0 33.333%;
  }
}
@media (min-width: 992px) {
  .product-responsive {
    width: 25%;
    flex: 0 0 25%;
  }
}
@media (min-width: 1200px) {
  .product-responsive {
    width: 20%;
    flex: 0 0 20%;
  }
}
</style>
