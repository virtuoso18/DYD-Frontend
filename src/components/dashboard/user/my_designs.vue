<template>
  <div className="py-3">
     <div
    v-if="isLoading"
    class="spinner-sec w-full h-[80vh] flex justify-center items-center"
  >
    <a-spin tip="Loading..."> </a-spin>
  </div>
    <div
    v-else
      class="sm:main min-h-[100vh] md:min-h-[100vh] sm:border border-gray-300 bg-white sm:rounded-xl p-4 border-gray-200 xl:min-h-[100vh] 2xl:min-h-[100vh]"
    >
      <!-- {{ my_designes }} -->

      <a-row v-if="view_type == 'all'">
        <a-col :span="24"
          ><h2
            className="p-2 sm:!text-lg"
            style="
              font-family: Poppins;
              font-weight: 500;
              font-style: normal;
              font-size: 22px;
              line-height: 24px;
              letter-spacing: 0;
            "
          >
            My Designes
          </h2>
        </a-col>
        <!-- {{ my_designes }} -->
        <!-- Empty State -->
        <a-col
          :span="24"
          v-if="my_designes.length === 0"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80vh;
            text-align: center;
            padding: 60px 20px;
          "
        >
          <a-empty description="No designs available yet">
            <template #description>
              <p style="color: #666; font-size: 16px">
                You haven't created any designs yet.
              </p>
              <p style="color: #999; font-size: 14px">
                Start creating your first design!
              </p>
            </template>
          </a-empty>
        </a-col>

        <!-- Designs List -->
        <a-col
          :lg="8"
          :md="8"
          :xs="24"
          :sm="24"
          style="padding: 5px"
          v-for="design in my_designes"
          :key="design.id"
          v-if="my_designes"
        >
          <div
            style="
              border: 1px solid rgba(0, 0, 0, 0.1);
              padding: 5px;
              border-radius: 10px;
            "
          >
            <img
              :src="this.$store.state.root_media_api + design.image"
              style="
                width: 100%;
                border-radius: 10px;
                max-height: 200px;
                object-fit: cover;
              "
              alt=""
              @click="show_design_details(design.id)"
            />
            <a-row style="padding-top: 5px">
              <!-- {{ design }} -->
              <a-col :span="22">
                <a-tag>Room : {{ design.room_type }}</a-tag>
                <a-tag>Style : {{ design.room_design_type }}</a-tag>
              </a-col>
              <a-col :span="2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15px"
                  height="15px"
                  viewBox="0 0 16 16"
                  fill="#000000"
                  class="bi bi-three-dots-vertical"
                >
                  <path
                    d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
                  />
                </svg>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>

      <a-row v-if="view_type == 'details' && selected_design">
        <a-row>
          <a-col
            :span="24"
            style="display: flex; justify-content: space-between"
          >
            <a-button
              @click="goback"
              type="text"
              size="large"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <ArrowLeftOutlined style="margin-right: 8px" />
              <b>Back</b>
            </a-button>
            <!-- <div> -->

            <!-- <a-button @click="edit_Design" type="default"  v-if="!start_edit" >
                    <EditOutlined /> Edit
                </a-button> -->
            <!-- <a-button @click="save_Design" type="default"  v-if="start_edit" >
                    <SaveOutlined /> Save
                </a-button> -->
            <!-- <a-button @click="close_Design" type="secondary"  v-if="start_edit" >
                    <CloseOutlined />Close
                </a-button> -->
            <!-- &nbsp;
                 <a-button @click="delete_Design" type="text" danger>
                    <DeleteOutlined /> Delete
                </a-button> -->
            <!-- </div> -->
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" style="padding: 10px">
            <img
              :src="
                this.$store.state.root_media_api + selected_design.data.image
              "
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
            {{ selected_design.data.room_description }}

            <br /><br />
            <a-tag>{{ selected_design.data.room_type }}</a-tag>
            <a-tag>{{ selected_design.data.room_design_type }}</a-tag>
            <!-- {{ businessUrl(selected_design.data.business_slug) }} -->
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

            <!-- {{selected_design.data.business_banner_picture}}
                        {{selected_design.data.business_slug}} -->
          </a-col>
          <a-col
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            style="padding: 10px"
            v-else
          >
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
                  <a-option-select value="Industrial"
                    >Industrial</a-option-select
                  >
                  <a-option-select value="Minimalist"
                    >Minimalist</a-option-select
                  >
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
                ><strong>Products:</strong>
                {{ products_used.length }} items</span
              >
            </div>
          </a-col>

          <a-col :span="24">
            <p
              style="
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 4px;
                color: #666;
              "
            >
              Products used
            </p>
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
                    <div class="category-badge">
                      {{ product.category_name }}
                    </div>
                    <!-- AR Badge -->
                    <div class="ar-badge">AR</div>
                  </div>
                  <!-- {{ truncateText(product.description || 'No description available', 8) }} -->

                  <a-row>
                    <a-col span="24">
                      <b>{{ product.product_title }}</b>
                    </a-col>

                    <a-col span="18"> Color </a-col>

                    <a-col span="6" style="display: flex; justify-content: end">
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

                    <a-col span="12"> Price </a-col>

                    <a-col
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
                      <!-- {{ product }} -->
                      <a-button block @click="goto_product_Route(product)"
                        >Product Details</a-button
                      >
                    </a-col>

                    <a-col span="1"></a-col>
                    <a-col span="4">
                      <!-- {{product.is_favorited}} -->
                      <a-button
                        size="medium"
                        @click="toggleFavorite(product)"
                        style="
                          display: flex;
                          justify-content: center;
                          align-items: center;
                        "
                      >
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
  </div>
</template>
<script>
import {
  HeartOutlined,
  DeleteOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  HeartFilled,
  CloseOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "my_designes",
  data() {
    return {
      isLoading:true,
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
    HeartFilled,
    DeleteOutlined,
    EditOutlined,
    ArrowLeftOutlined,
    SaveOutlined,
    CloseOutlined,
  },
  mounted() {
    this.loadMyDesignes();
  },
  methods: {
    async toggleFavorite(product) {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem("token");
        if (!token) {
          this.$message.warning("Please login to add favorites");
          return;
        }

        product.favoriting = true;

        const response = await fetch(
          `${this.$store.state.root_api}likes/favorites/toggle/`,

          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: product.product_id,
              type: product.product_type,
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          // Toggle the favorite status
          product.is_favorited = !product.is_favorited;
          // this.loadMyDesignes()

          if (product.is_favorited) {
            this.$message.success("Added to favorites");
          } else {
            this.$message.success("Removed from favorites");
          }
        } else {
          this.$message.error(data.message || "Failed to update favorite");
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        this.$message.error("Failed to update favorite");
      } finally {
        product.favoriting = false;
      }
    },

    goto_product_Route(product) {
      //  debugger
      console.log(product);
      let product_type = product.product_type;
      if (product.product_type === "light") {
        product_type = "product";
      }
      if (product.product_type === "floor_texture") {
        product_type = "floor";
      }
      if (product.product_type === "wall_texture") {
        product_type = "wall";
      }
      this.$router.push({
        name: "buisness_product",
        params: {
          buisness_name: product.business_slug,
          product_type: product_type,
          product_id: product.product_id,
        },
      });
    },
    businessUrl(business_slug) {
      return window.location.origin + "/" + business_slug;
    },
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
            const url = `${this.$store.state.root_api}engine/free-user-my-designes/`;

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
        this.isLoading
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${this.$store.state.root_api}engine/free-user-my-designes/`,
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
      }finally {
        this.isLoading = false;
      }
    },

    show_design_details(design_id) {
      (this.view_type = "details"), console.log(design_id);
      this.loadDesignDetails(design_id);
    },

    async loadDesignDetails(design_id) {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${this.$store.state.root_api}engine/free-user-my-designes/`,
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
  },
};
</script>

<style scoped>
.main {
  margin-top: 10px;
  border-radius: 20px;
  border: 1px solid rgba(128, 128, 128, 0.167);
  padding: 10px;
  min-height: 100vh;
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
