<template>
  <div className="sm:py-4">
    <div
      class="sm:main sm:border border-gray-200 sm:rounded-2xl min-h-[100vh] md:min-h-[136vh] xl:min-h-[170vh] 2xl:min-h-[150vh] bg-white"
    >
      <div style="padding: 10px; border-radius: 15px; min-height: 100vh">
        <h3
          style="
            font-family: Poppins, sans-serif;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
            letter-spacing: 0;
          "
        >
          Liked Products & Rooms
        </h3>
        <a-tabs
          ref="tabsRef"
          v-model:activeKey="active_tab"
          :key="tabRefreshKey"
          @tabClick="handleTabClick"
        >
          <a-tab-pane key="Furniture" tab="Furniture">
            <div
              v-if="isLoading"
              class="spinner-sec w-full h-[80vh] flex justify-center items-center"
            >
              <a-spin tip="Loading..."> </a-spin>
            </div>
            <div v-else>
            <div
              v-if="!filteredProducts?.length"
              style="
                height: 70vh;
                gap: 20px;
                flex-direction: column;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <!-- <a-empty :description="'No Furniture Available'"></a-empty> -->

              <a-empty
                :description="'You have not added anything in your likes till yet '"
              >
              </a-empty>
            </div>

            <a-row v-else>
              <a-col
                v-for="product in filteredProducts"
                :key="product.id"
                class="product-responsive"
                style="padding: 5px"
              >
                <div class="product">
                  <div
                    class="product-image-container"
                    @click="goto_product_Route(product)"
                  >
                    <img
                      :src="$store.state.root_media_api + product.image"
                      :alt="product.name"
                      class="product-image"
                    />
                    <div class="category-badge">{{ product.category }}</div>
                  </div>

                  <a-row>
                        <a-col span="24">
                            <b
                              class="block w-full truncate"
                              :title="product.name"
                            >
                              {{ product.name || "No name available" }}
                            </b>
                          </a-col>

                          <a-col
                            span="16"
                            style="
                              font-family: 'Poppins', sans-serif;
                              font-size: 13px;
                              font-weight: 400;
                            "
                          >
                            Color
                          </a-col>

                          <a-col
                            span="8"
                            style="display: flex; justify-content: end"
                          >
                          <!-- {{product.product_colors}} -->
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
                              :style="'background:' + color.color_hex"
                            ></div>
                          </a-col>

                          <a-col
                            span="12"
                            style="
                              font-family: 'Poppins', sans-serif;
                              font-size: 13px;
                              font-weight: 400;
                            "
                          >
                            Price
                          </a-col>

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
                        <!-- {{ product }} -->
    
                        <a-col span="18">
                            <a-button block @click="goto_product_Route(product)">Product Details</a-button>
                        </a-col>
    
    
                        <!-- ❤️ Dynamic Favorite Button -->
                        <a-col span="6" style="display: flex;justify-content: end;">
                        <a-button @click="toggleFavorite(product)" style="display: flex;justify-content: center;align-items: center;">
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

            <div
              v-if="filteredProducts?.length > 0"
              style="
                display: flex;
                justify-content: center;
                margin-top: 20px;
                margin-bottom: 20px;
              "
            >
              <a-pagination
                v-model:current="productsPagination.currentPage"
                :total="productsPagination.totalCount"
                :page-size="productsPagination.pageSize"
                @change="handleProductsPageChange"
                show-total
                :show-size-changer="false"
              />
            </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="rooms" tab="rooms">
            <div
              v-if="isLoading"
              class="spinner-sec w-full h-[80vh] flex justify-center items-center"
            >
              <a-spin tip="Loading..."> </a-spin>
            </div>
            <div v-else>
              <div
                v-if="!filteredrooms?.length"
                style="
                  height: 70vh;
                  gap: 20px;
                  flex-direction: column;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <a-empty
                  :description="'You have not added any room in your likes till yet '"
                >
                </a-empty>
              </div>
              <a-row v-else>
                <a-col
                  v-for="product in filteredrooms"
                  :key="product.id"
                  class="product-responsive"
                  style="padding: 5px"
                >
                  <div class="product">
                    <!-- {{ product }} -->
                    <div
                      class="product-image-container"
                      @click="viewRoom(product)"
                    >
                      <img
                        :src="$store.state.root_media_api + product.image"
                        :alt="product.name"
                        class="product-image"
                      />
                      <!-- Category Badge -->
                      <div class="category-badge">{{ product.category }}</div>
                    </div>
                    <!-- {{ truncateText(product.description || 'No description available', 8) }} -->

                    <a-row>
                      <a-col span="24">
                        <!-- <b>{{product.name}}</b> -->
                        <b>{{
                          truncateText(product.name || "No name available", 19)
                        }}</b>
                      </a-col>

                      <a-col span="17">
                        <a-button block @click="viewRoom(product)"
                          >Product Details</a-button
                        >
                      </a-col>

                      <a-col span="1"></a-col>
                      <a-col span="4">
                        <a-button @click="toggleFavorite(product)">
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
              <div
                v-if="filteredrooms?.length > 0"
                style="
                  display: flex;
                  justify-content: center;
                  margin-top: 20px;
                  margin-bottom: 20px;
                "
              >
                <a-pagination
                  v-model:current="roomPagination.currentPage"
                  :total="roomPagination.totalCount"
                  :page-size="roomPagination.pageSize"
                  @change="handleRoomsPageChange"
                  show-total
                  :show-size-changer="false"
                />
              </div>
            </div>
          </a-tab-pane>
        
        </a-tabs>
      </div>
    </div>
  </div>
  <CommentsModal
    v-if="showModal && selectedPost"
    :isOpen="showModal"
    :post="selectedPost"
    @close="closeModal"
    @commentAdded="handleCommentAdded"
    @likeToggled="handleLikeToggled"
  />

  <RoomDetailsModal
    v-if="roomModalVisible"
    :visible="roomModalVisible"
    :room="selectedRoom || {}"
    :mediaBase="$store.state.root_media_api"
    @close="closeRoomModal"
  />
</template>
<script>
import CommentsModal from "@/views/pages/CommentsModal.vue";
import RoomDetailsModal from "@/views/pages/RoomDetailsModal.vue";
import {
  ExclamationCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  ShareAltOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  PushpinOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "likes",

  components: {
    ExclamationCircleOutlined,
    EyeOutlined,
    HeartOutlined,
    HeartFilled,
    MessageOutlined,
    ShareAltOutlined,
    CommentsModal,
    RoomDetailsModal,
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    PushpinOutlined,
    ArrowLeftOutlined,
    CloseOutlined,
  },

  data() {
    return {
      active_tab: "Furniture", // MUST initialize
      isLoading: true,
      products: [],
      rooms: [],
      roomModalVisible: false,
      selectedRoom: null,
      community_posts: [],
      tabRefreshKey: 0,
      showModal: false,
      selectedPost: null,

      // Pagination states for Products
      productsPagination: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
      },

      roomPagination: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
      },
    };
  },
  computed: {
    filteredProducts() {
      console.log("reached inside filtered products");
      if (!this.searchQuery) return this.products;
      return this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.category.name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          product.furniture_type
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
      );
    },

    filteredrooms() {
      console.log("reached inside filtered rooms");
      if (!this.searchQuery) return this.rooms;
      return this.rooms.filter((room) =>
        room.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },

  mounted() {
    this.fetchMyProducts();
    // this.fetchMyRooms();
    // this.fetchMyLikes();
  },

  methods: {
    handleTabChange(key) {
      this.active_tab = key;
      // Reset modal state when switching tabs
      this.showModal = false;
      this.selectedPost = null;
    },

    handleTabClick(key) {
      this.active_tab = key;
      if (key === "Furniture") {
        this.fetchMyProducts();
      } else if (key === "rooms") {
        this.fetchMyRooms();
      } else {
        this.fetchMyLikes();
      }
      this.tabRefreshKey++; // Force re-render
    },

    viewRoom(room) {
      // room object already looks like:
      // { added_at, is_favorited, id, name, image, category, type }
      this.selectedRoom = room;
      this.roomModalVisible = true;
    },
    closeRoomModal() {
      this.roomModalVisible = false;
      this.selectedRoom = null;
    },
    goto_product_Route(product) {
      let product_type = product.type;
      if (product.type === "light") {
        product_type = "product";
      }
      if (product.type === "floor_texture") {
        product_type = "floor";
      }
      if (product.type === "wall_texture") {
        product_type = "wall";
      }
      this.$router.push({
        name: "buisness_product",
        params: {
          buisness_name: product.business_slug,
          product_type: product_type,
          product_id: product.id,
        },
      });
    },
    viewPost(post) {
      // Transform your post data to match modal props
      this.selectedPost = {
        id: post.id,
        image: this.$store.state.root_media_api + post.post_image,
        userName: post.post_by,
        userAvatar: this.$store.state.root_media_api + post.user_profile,
        description: post.description || post.content || "",
        tags: post.tags || [],
        views: post.view_count,
        likes: post.like_count,
        is_liked: post.isLiked || false,
        comment_count: post.comment_count,
      };

      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedPost = null;

      // FORCE tabs to reset after modal closes
      this.$nextTick(() => {
        const tabs = this.$refs.tabsRef; // Add ref="tabsRef" to a-tabs
        if (tabs) {
          tabs.$forceUpdate();
        }
        this.tabRefreshKey++;
        this.active_tab = this.active_tab; // Trigger reactivity
      });
    },

    handleCommentAdded() {
      if (this.selectedPost) {
        const postIndex = this.community_posts.findIndex(
          (p) => p.id === this.selectedPost.id
        );
        if (postIndex !== -1) {
          this.community_posts[postIndex].comment_count++;
          this.selectedPost.comment_count++;
        }
      }
    },

    handleLikeToggled() {
      if (this.selectedPost) {
        const postIndex = this.community_posts.findIndex(
          (p) => p.id === this.selectedPost.id
        );
        if (postIndex !== -1) {
          this.community_posts[postIndex].isLiked = this.selectedPost.is_liked;
          this.community_posts[postIndex].like_count = this.selectedPost.likes;
        }
      }
    },

    formatNumber(num) {
      if (!num) return 0;
      if (num >= 1000) return (num / 1000).toFixed(1) + "k";
      return num;
    },

    truncateText(text, length) {
      if (!text) return "";
      return text.length > length ? text.substring(0, length) + "..." : text;
    },

    openCommentsModal(post) {
      this.viewPost(post);
    },

    // Utility methods
    formatNumber(num) {
      if (!num || num === 0) return "0";
      if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
      if (num >= 1000) return (num / 1000).toFixed(1) + "K";
      return num.toString();
    },

    truncateText(text, charLimit = 7) {
      if (!text) return "";
      if (text.length <= charLimit) return text;
      return text.slice(0, charLimit) + "...";
    },

    // Fetch Methods
    async fetchMyProducts(page = 1) {
      try {
        this.isLoading = true;
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}likes/favorites/?page=${page}&page_size=${this.productsPagination.pageSize}&item_type=product,wall_texture,floor_texture`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          console.log("result:- ", result.data);
          this.products = result.data;
          this.productsPagination.totalCount = result.total_count;
          this.productsPagination.totalPages = result.total_pages;
          this.productsPagination.currentPage = result.page;
        }
      } catch (error) {
        console.error("Error loading products:", error);
        this.$message.error("Error loading products");
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMyRooms(page = 1) {
      try {
        this.isLoading = true;
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}likes/favorites/?page=${page}&page_size=${this.roomPagination.pageSize}&item_type=room`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          this.rooms = result.data;
          this.roomPagination.totalCount = result.total_count;
          this.roomPagination.totalPages = result.total_pages;
          this.roomPagination.currentPage = result.page;
        }
      } catch (error) {
        console.error("Error loading room ", error);
        this.$message.error("Error loading room ");
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMyLikes(page = 1) {
      try {
        this.isLoading = true;
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}community/api/my-likes/?page=${page}&page_size=${this.roomPagination.pageSize}`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          this.community_posts = result.data;
        }
      } catch (error) {
        console.error("Error loading community posts ", error);
        this.$message.error("Error loading community posts");
      } finally {
        this.isLoading = false;
      }
    },

    // Toggle Methods
    async toggleFavorite(product) {
      try {
        const token = localStorage.getItem("token");
        console.log(product);
        const response = await fetch(
          `${this.$store.state.root_api}likes/favorites/toggle/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              id: product.id,
              type: product.type,
            }),
          }
        );

        const data = await response.json();
        product.is_favorited = data.favorited;

        // REMOVE the product from the list when unfavorited
        if (!product.is_favorited) {
          if (product.type !== "room") {
            this.products = this.products.filter((p) => p.id !== product.id);
          } else {
            this.rooms = this.rooms.filter((p) => p.id !== product.id);
          }
        }
      } catch (error) {
        console.error("Favorite toggle failed", error);
      }
    },

    async toggleLike(post) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${this.$store.state.root_api}community/api/posts/like/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              post_id: post.id,
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          post.isLiked = data.data.action === "liked";
          post.like_count = data.data.like_count;
          this.$message.success(`Post ${data.data.action}!`);
        }
      } catch (error) {
        console.error("Failed to toggle like:", error);
        this.$message.error("Failed to update like");
      }
    },

    // Pagination
    handleProductsPageChange(page) {
      this.fetchMyProducts(page);
    },

    handleRoomsPageChange(page) {
      this.fetchMyRooms(page);
    },
  },
};
</script>

<style scoped>
.main {
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
  border: 1px solid rgba(128, 128, 128, 0.167);
  padding: 20px;
  background-color: white;
}

/* Force remove modal backdrop interference */
:deep(.ant-modal-mask) {
  z-index: 1000 !important;
}

:deep(.ant-tabs-nav) {
  pointer-events: auto !important;
}

/* Ensure tabs clickable after modal */
.ant-tabs-top > .ant-tabs-nav {
  position: relative;
  z-index: 10;
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
