<template>
  <div class="main ">
    <!-- Loading State -->
    <div v-if="loading" style="text-align: center; padding: 40px">
      <a-spin size="large" />
      <p style="margin-top: 16px; color: #666">Loading community posts...</p>
    </div>

    <!-- Posts Grid View -->
    <a-row v-if="selectedPost == null" :gutter="[16, 16]">
      <a-col :span="24">
        <a-tabs v-model:activeKey="active_tab">
          <a-tab-pane key="My Community">
            <template #tab>
              <span>
                <!-- <apple-outlined /> -->
                My Community
              </span>
            </template>
            <div>
              <!-- Empty State -->
              <div
                v-if="posts.length === 0 && !loading"
                style="text-align: center; padding: 60px 20px"
              >
                <div
                  style="font-size: 64px; color: #d9d9d9; margin-bottom: 16px"
                >
                  📝
                </div>
                <h3 style="color: #666; margin-bottom: 8px">No posts yet</h3>
                <p style="color: #999">
                  Start sharing your amazing designs with the community!
                </p>
                <a-button
                  type="primary"
                  style="margin-top: 16px"
                  @click="$router.push('/designs')"
                >
                  Create Your First Design
                </a-button>
              </div>
              <a-row v-else>
                <a-col
                  v-for="post in posts"
                  :key="post.id"
                  :lg="8"
                  :md="8"
                  :xs="24"
                  :sm="24"
                  ><div style="padding: 2px">
                    <div class="post-card">
                      <!-- Post Image -->
                      <div style="position: relative">
                        <img
                          :src="
                            $store.state.root_media_api + post.post_image ||
                            require('../../../assets/home_main_banner.jpg')
                          "
                          style="
                            width: 100%;
                            height: 200px;
                            object-fit: cover;
                            border-radius: 10px;padding:5px;
                            cursor: pointer;
                          "
                          :alt="post.title"
                          @click="viewPost(post)"
                        />

                        <!-- Tags - Fixed for string array -->
                        <div class="tags-overlay">
                          <template v-if="post.tags && post.tags.length > 0">
                            <a-tag
                              v-for="(tag, index) in post.tags.slice(0, 3)"
                              :key="index"
                              color="blue"
                              style="
                                margin: 2px;
                                border-radius: 12px;
                                font-size: 11px;
                              "
                            >
                              {{ tag }}
                            </a-tag>
                            <a-tag
                              v-if="post.tags.length > 3"
                              style="
                                margin: 2px;
                                border-radius: 12px;
                                font-size: 11px;
                                background: rgba(0, 0, 0, 0.6);
                                color: white;
                                border: none;
                              "
                            >
                              +{{ post.tags.length - 3 }}
                            </a-tag>
                          </template>
                        </div>

                        <!-- View Count Overlay -->
                        <div class="view-count-overlay">
                          <EyeOutlined style="margin-right: 4px" />
                          {{ formatNumber(post.view_count) }}
                        </div>

                        <!-- Pinned Badge -->
                        <div v-if="post.is_pinned" class="pinned-badge">
                          <PushpinOutlined />
                          Pinned
                        </div>
                      </div>

                      <!-- Post Content -->
                      <div style="padding: 5px">
                        <!-- Actions Row -->
                        <a-row style="align-items: center">
                          <a-col :span="14" style="display:flex;gap:10px;justify-content: start;align-items: center;">
                            <img
                              :src="
                                this.$store.state.root_media_api + post.user_profile
                              "
                              style="
                                width: 40px;
                                height: 40px;
                                border-radius: 100%;
                                border:1px solid rgba(0,0,0,0.2)
                              "
                              alt=""
                            />
                            <span style="font-size: 16px;font-weight:600">{{
                              truncateText(post.post_by, 15)
                            }}</span>
                          </a-col>
                          <a-col :span="10" style="display: flex">
                            <!-- Post Stats -->
                            <div class="post-stats">
                              <div class="stat-item" @click="toggleLike(post)">
                                <HeartFilled
                                  v-if="post.isLiked"
                                  style="color: #ff4d4f"
                                />
                                <HeartOutlined v-else />
                                <span>{{ formatNumber(post.like_count) }}</span>
                              </div>
                              <div
                                class="stat-item"
                                @click="openCommentsModal(post)"
                              >
                                <MessageOutlined />
                                <span>{{
                                  formatNumber(post.comment_count)
                                }}</span>
                              </div>
                              <div class="stat-item" @click="sharePost(post)">
                                <ShareAltOutlined />
                                <span>{{
                                  formatNumber(post.share_count)
                                }}</span>
                              </div>
                            </div>
                            <!-- More Actions Dropdown -->
                            <a-dropdown
                              :trigger="['click']"
                              placement="bottomRight"
                            >
                              <a-button
                                type="text"
                                size="small"
                                style="padding: 2px"
                              >
                                <MoreOutlined
                                  style="font-size: 16px; color: #666"
                                />
                              </a-button>
                              <template #overlay>
                                <a-menu>
                                  <a-menu-item @click="editPost(post)">
                                    <EditOutlined style="margin-right: 8px" />
                                    Edit Post
                                  </a-menu-item>
                                  <a-menu-item @click="sharePost(post)">
                                    <ShareAltOutlined
                                      style="margin-right: 8px"
                                    />
                                    Share
                                  </a-menu-item>
                                  <a-menu-divider />
                                  <a-menu-item
                                    @click="confirmDelete(post)"
                                    style="color: #ff4d4f"
                                  >
                                    <DeleteOutlined style="margin-right: 8px" />
                                    Delete Post
                                  </a-menu-item>
                                </a-menu>
                              </template>
                            </a-dropdown>
                          </a-col>
                        </a-row>
                      </div>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
          </a-tab-pane>
          <a-tab-pane key="User Generated content">
            <template #tab>
              <span>
                <!-- <android-outlined /> -->
                User Generated content
              </span>
            </template>
            <div>
              <!-- Empty State -->
              <div style="text-align: center; padding: 60px 20px">
                <div
                  style="font-size: 64px; color: #d9d9d9; margin-bottom: 16px"
                >
                  📝
                </div>
                <h3 style="color: #666; margin-bottom: 8px">No posts yet</h3>
                <p style="color: #999">
                  Start sharing your amazing designs with the community!
                </p>
                <a-button
                  type="primary"
                  style="margin-top: 16px"
                  @click="$router.push('/designs')"
                >
                  Create Your First Design
                </a-button>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>

    <!-- Post Detail View -->
    <div v-else class="relative bg-white min-h-screen">
    <!-- Header with Back Button -->
    <div class="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <a-button @click="closePostDetails" type="text" size="large" class="flex items-center gap-2">
          <ArrowLeftOutlined />
          <span class="font-bold">Back</span>
        </a-button>
        <div class="flex gap-2">
          <a-button @click="editPost(selectedPost)" type="default" class="flex items-center gap-2">
            <EditOutlined /> Edit
          </a-button>
          <a-button @click="confirmDelete(selectedPost)" type="text" danger class="flex items-center gap-2">
            <DeleteOutlined /> Delete
          </a-button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[calc(100vh-140px)]">
        
        <!-- Left Column - Post Details (Scrollable) -->
        <div class="lg:col-span-7 overflow-y-auto lg:pr-4">
          
          <!-- Post Image -->
          <div class="relative rounded-2xl overflow-hidden mb-4">
            <img
              :src="$store.state.root_media_api + selectedPost.post_image || require('../../../assets/home_main_banner.jpg')"
              :alt="selectedPost.title"
              class="w-full h-auto object-cover"
            />

            <!-- Pinned Badge -->
            <div v-if="selectedPost.is_pinned" class="absolute top-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm">
              <PushpinOutlined />
              <span>Pinned</span>
            </div>

            <!-- View Count -->
           
          </div>

          <!-- Stats Row - Likes, Comments, Shares -->
          <div class="flex items-center justify-between py-4 !px-4 border-b border-gray-200">

  <!-- Left Side: Views -->
  <div class="flex items-center gap-2 text-gray-600">
<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.5 4C0.5 4 2.5 0.5 6 0.5C9.5 0.5 11.5 4 11.5 4C11.5 4 9.5 7.5 6 7.5C2.5 7.5 0.5 4 0.5 4Z" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 5.3125C6.82843 5.3125 7.5 4.72487 7.5 4C7.5 3.27513 6.82843 2.6875 6 2.6875C5.17157 2.6875 4.5 3.27513 4.5 4C4.5 4.72487 5.17157 5.3125 6 5.3125Z" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    <span class="font-medium">{{ formatNumber(selectedPost.view_count) }}</span>
  </div>

  <!-- Right Side: Comments + Likes -->
  <div class="flex items-center gap-6">
    
    <!-- Comments -->
    <div
      class="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-blue-500 transition-colors"
      @click="scrollToComments"
    >
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.33594 3.99967C1.33594 3.29243 1.61689 2.61415 2.11699 2.11406C2.61708 1.61396 3.29536 1.33301 4.0026 1.33301H12.0026C12.7098 1.33301 13.3881 1.61396 13.8882 2.11406C14.3883 2.61415 14.6693 3.29243 14.6693 3.99967V9.33301C14.6693 10.0403 14.3883 10.7185 13.8882 11.2186C13.3881 11.7187 12.7098 11.9997 12.0026 11.9997H8.8706L5.0386 14.5543C4.93821 14.6211 4.82158 14.6595 4.70113 14.6652C4.58067 14.671 4.46091 14.644 4.3546 14.5871C4.24829 14.5301 4.15941 14.4455 4.09742 14.342C4.03544 14.2386 4.00267 14.1203 4.0026 13.9997V11.9997C3.29536 11.9997 2.61708 11.7187 2.11699 11.2186C1.61689 10.7185 1.33594 10.0403 1.33594 9.33301V3.99967ZM4.0026 2.66634C3.64898 2.66634 3.30984 2.80682 3.05979 3.05687C2.80975 3.30691 2.66927 3.64605 2.66927 3.99967V9.33301C2.66927 9.68663 2.80975 10.0258 3.05979 10.2758C3.30984 10.5259 3.64898 10.6663 4.0026 10.6663H4.66927C4.84608 10.6663 5.01565 10.7366 5.14068 10.8616C5.2657 10.9866 5.33594 11.1562 5.33594 11.333V12.7543L8.29994 10.7783C8.40931 10.7054 8.53781 10.6664 8.66927 10.6663H12.0026C12.3562 10.6663 12.6954 10.5259 12.9454 10.2758C13.1955 10.0258 13.3359 9.68663 13.3359 9.33301V3.99967C13.3359 3.64605 13.1955 3.30691 12.9454 3.05687C12.6954 2.80682 12.3562 2.66634 12.0026 2.66634H4.0026Z" fill="#4D4D4D"/>
</svg>
      <span class="font-medium">{{ formatNumber(selectedPost.comment_count) }}</span>
    </div>

    <!-- Likes -->
    <div 
      class="flex items-center gap-2 cursor-pointer transition-colors"
      @click="toggleLike(selectedPost)"
      :class="selectedPost.isLiked ? 'text-red-500' : 'text-gray-600'"
    >
      <HeartFilled v-if="selectedPost.isLiked" class="text-lg" />
      <HeartOutlined v-else class="text-lg" />
      <span class="font-medium">{{ formatNumber(selectedPost.like_count) }}</span>
    </div>

  </div>

</div>


          <!-- Post Description -->
          <div class="py-4">
            <h3 class="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
              {{ selectedPost.title }}
            </h3>
            <p v-if="selectedPost.content" class="text-sm text-gray-600 leading-relaxed mb-4">
              {{ selectedPost.content }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <a-tag
                v-for="(tag, index) in selectedPost.tags"
                :key="index"
                color="blue"
                class="px-3 py-1 rounded-full"
              >
                {{ tag }}
              </a-tag>
            </div>

            <!-- Meta Info -->
            <div class="flex flex-wrap gap-2 text-xs text-gray-400">
              <span>Created: {{ formatDate(selectedPost.created_at) }}</span>
              <span v-if="selectedPost.updated_at !== selectedPost.created_at">
                • Updated: {{ formatDate(selectedPost.updated_at) }}
              </span>
            </div>
          </div>

          <!-- Products Used Section -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="product in products_used_in_post"
                :key="product.id"
                class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <!-- Product Image -->
                <div class="relative rounded-lg overflow-hidden mb-3 h-48" @click="viewProduct(product)">
                  <img
                    :src="$store.state.root_media_api + product.product_image"
                    :alt="product.product_title"
                    class="w-full h-full object-cover"
                  />
                  
                  <!-- Category Badge -->
                  <div class="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {{ product.category_name }}
                  </div>
                  
                  <!-- AR Badge -->
                  <div class="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    AR
                  </div>
                </div>

                <!-- Product Info -->
                <div class="space-y-2">
                  <h4 class="font-semibold text-gray-900 text-sm truncate">
                    {{ product.product_title }}
                  </h4>

                  <!-- Color & Price Row -->
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Color</span>
                    <div class="flex gap-1">
                      <div
                        v-for="(color, index) in product.product_colors.slice(0, 2)"
                        :key="index"
                        class="w-5 h-5 rounded-full border border-gray-300"
                        :style="{ background: color.color_hex || color.color }"
                      ></div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Price</span>
                    <span class="font-bold text-gray-900">${{ product.product_price }}</span>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2 mt-3">
                    <a-button 
                      block 
                      @click="viewProduct(product)"
                      class="flex-1"
                    >
                      Product Details
                    </a-button>
                    <a-button class="w-10 flex items-center justify-center">
                      <HeartOutlined />
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Comments (Fixed Scrollable) -->
        <div class="lg:col-span-5 flex !h-[740px] flex-col bg-gray-50 rounded-2xl p-6 ">
          <!-- Comments Header -->
          <div class="pb-4 border-b border-gray-200">
            <h4 class="text-xl font-semibold text-gray-900">
              Comments ({{ selectedPost.comment_count }})
            </h4>
          </div>

          <!-- Comments List (Scrollable) -->
          <div class="flex-1 overflow-y-auto no-scrollbar py-4 pr-2" ref="commentsSection">
            <!-- Empty State -->
            <div 
              v-if="!comments.length" 
              class="flex flex-col items-center justify-center h-full min-h-[300px]"
            >
              <a-empty description="No Comments Available"></a-empty>
            </div>

            <!-- Comments -->
            <div v-else class="space-y-6">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="pb-6 border-b border-gray-200 last:border-0"
              >
                <div class="flex gap-3">
                  <!-- Avatar -->
                  <a-avatar
                    :size="40"
                    class="border border-gray-200 flex-shrink-0"
                    :src="$store.state.root_media_api + comment.comment_owner.user_profile"
                  />

                  <!-- Comment Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                      <h5 class="font-semibold text-sm text-gray-900">
                        {{ comment.comment_owner?.username || 'Anonymous' }}
                      </h5>
                      <span class="text-xs text-gray-400">
                        {{ formatDate(comment.created_at) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">
                      {{ comment.content }}
                    </p>

                    <!-- Replies -->
                    <div
                      v-if="comment.replies && comment.replies.length > 0"
                      class="mt-4 pl-4 border-l-2 border-gray-200 space-y-4"
                    >
                      <div
                        v-for="reply in comment.replies"
                        :key="reply.id"
                        class="flex gap-2"
                      >
                        <a-avatar
                          :size="32"
                          class="border border-gray-200 flex-shrink-0"
                          :src="$store.state.root_media_api + reply.comment_owner.user_profile"
                        />
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-semibold text-xs text-gray-900">
                              {{ reply.comment_owner?.username || 'Anonymous' }}
                            </span>
                            <span class="text-xs text-gray-400">
                              {{ formatDate(reply.created_at) }}
                            </span>
                          </div>
                          <p class="text-xs text-gray-600 leading-relaxed">
                            {{ reply.content }}
                          </p>
                        </div>
                      </div>

                      <!-- Load More Replies -->
                      <a-button
                        v-if="comment.reply_count > comment.replies.length"
                        type="link"
                        size="small"
                        @click="loadMoreReplies(comment)"
                        class="text-xs"
                      >
                        View {{ comment.reply_count - comment.replies.length }} more replies
                      </a-button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Load More Comments -->
              <div v-if="hasMoreComments" class="text-center pt-4">
                <a-button
                  type="link"
                  @click="loadMoreComments"
                  :loading="loadingComments"
                >
                  Load More Comments
                </a-button>
              </div>
            </div>
          </div>

          <!-- Add Comment Input (Fixed at Bottom) -->
          <div class="pt-4 border-t  border-gray-200 bg-gray-50">
            <div class="flex items-center   gap-2 w-full rounded-xl px-3 py-2">
  
  <!-- Textarea (Auto height, no resize) -->
  <a-textarea
    v-model:value="newComment"
    placeholder="Add a comment..."
    :rows="1"
    auto-size
    class="flex-1 border-none !h-2 shadow-md resize-none !p-1 !focus:ring-1 !focus:outline-none"
  />

  <!-- Send Button (SVG only) -->
  <button
    @click="addComment"
    :disabled="!newComment.trim()"
    class="w-10 h-10 flex items-center justify-center rounded-md disabled:opacity-30"
  >
    <svg width="18" height="18" viewBox="0 0 16 16" fill="#3B63FB">
      <path d="M3.721 7.63038L5.2073 8.12581C6.18973 8.45258 6.67989 8.61702 7.03196 8.96909C7.38403 9.32117 7.54847 9.81238 7.87525 10.7927L8.37068 12.279C9.1971 14.7604 9.61031 16 10.3703 16C11.1293 16 11.5435 14.7604 12.37 12.279L15.3615 3.30642C15.9434 1.56082 16.2343 0.688014 15.7737 0.227368C15.313 -0.233277 14.4402 0.0576566 12.6957 0.638471L3.71995 3.63214C1.24174 4.45751 0 4.87072 0 5.63073C0 6.39074 1.24069 6.80395 3.721 7.63038Z"/>
    </svg>
  </button>

</div>

          </div>
        </div>

      </div>
    </div>
  </div>

    <!-- Load More Button -->
    <div
      v-if="hasMore && posts.length > 0 && selectedPost == null"
      style="text-align: center; margin-top: 32px"
    >
      <a-button
        type="primary"
        :loading="loadingMore"
        @click="loadMorePosts"
        style="border-radius: 20px; padding: 0 24px"
      >
        Load More Posts
      </a-button>
    </div>

    <!-- Edit Post Modal -->
    <a-modal
      v-model:open="editModalVisible"
      title="Edit Post"
      width="600px"
      @ok="updatePost"
      :confirm-loading="updating"
    >
      <img
        :src="this.$store.state.root_media_api + editForm.img_src"
        alt=""
        style="width: 100%; border-radius: 10px"
      />
      <div style="padding: 16px 0">
        <div style="margin-bottom: 16px">
          <label style="display: block; margin-bottom: 8px; font-weight: 500"
            >Title</label
          >
          <a-input
            v-model:value="editForm.title"
            placeholder="Post title..."
            :maxlength="200"
            show-count
          />

        </div>
        <div>
            <a-input
            v-model:value="editForm.content"
            placeholder="Update Content"
            :maxlength="600"
            show-count
          />
        </div>
        <!-- Tags -->
      <div>
        <label style="display: block; margin-bottom: 8px; font-weight: 500">
          Tags
        </label>
        <a-select
          v-model:value="editForm.tag_ids"
          mode="tags"
          placeholder="Select or create tags..."
          style="width: 100%"
          :options="availableTags"
          :filter-option="filterTags"
          show-search
        />
      </div>
      </div>
    </a-modal>

    <!-- Comments Modal -->
    <a-modal
      v-model:open="commentsModalVisible"
      :title="null"
      width="800px"
      :footer="null"
      :closable="false"
      class="comments-modal"
    >
      <a-row>
        <a-col :span="12">
          <a-avatar
            :size="35"
            :src="$store.state.root_media_api + selectedPostForComments?.user_profile"
            style="border: 1px solid rgba(0, 0, 0, 0.4)"
          >
            {{
              selectedPostForComments?.post_by?.charAt(0).toUpperCase() || "U"
            }}
          </a-avatar>
          <span class="post-owner-name"
            >&nbsp;<b>{{
              selectedPostForComments?.post_by || "Anonymous"
            }}</b></span
          >
        </a-col>

        <a-col
          :span="12"
          style="
            display: flex;
            justify-content: space-between;
            padding-left: 10px;
          "
        >
          <span style="font-size: 16px; font-weight: bold">Comments</span>
          <a-button type="text" @click="closeCommentsModal" class="close-btn">
            <CloseOutlined />
          </a-button>
        </a-col>

        <a-col :span="12">
          <img
            :src="
              $store.state.root_media_api + selectedPostForComments?.post_image ||
              require('../../../assets/home_main_banner.jpg')
            "
            :alt="selectedPostForComments?.title"
            style="width: 100%; border-radius: 10px"
          />
          <!-- Post Stats -->

          <div
            style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              margin-top: 10px;
            "
          >
            <div
              style="
                display: flex;
                align-items: center;
                gap: 6px;
                background: rgba(0, 0, 0, 0.05);
                padding: 6px 12px;
                border-radius: 20px;
                color: #666;
                font-size: 14px;
                font-weight: 500;
              "
            >
              <EyeOutlined style="font-size: 14px" />
              <span>{{
                formatNumber(selectedPostForComments?.view_count)
              }}</span>
            </div>
            <div style="display: flex; gap: 12px">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  background: rgba(0, 0, 0, 0.05);
                  padding: 6px 12px;
                  border-radius: 20px;
                  color: #666;
                  font-size: 14px;
                  font-weight: 500;
                "
              >
                <HeartOutlined style="font-size: 14px" />
                <span>{{
                  formatNumber(selectedPostForComments?.like_count)
                }}</span>
              </div>
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  background: rgba(0, 0, 0, 0.05);
                  padding: 6px 12px;
                  border-radius: 20px;
                  color: #666;
                  font-size: 14px;
                  font-weight: 500;
                "
              >
                <MessageOutlined style="font-size: 14px" />
                <span>{{ formatNumber(modalComments.length) }}</span>
              </div>
            </div>
          </div>
          <p>{{ selectedPostForComments?.title }}</p>
          <a-tag
            v-for="(tag, index) in selectedPostForComments?.tags"
            :key="index"
            color="blue"
            style="margin: 2px; border-radius: 12px; font-size: 11px"
          >
            {{ tag }}
          </a-tag>
        </a-col>
        <a-col
          :span="12"
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <div style="max-height: 350px; overflow-y: scroll">
            <div v-if="!modalComments.length" style="display: flex;justify-content: center;align-items: center;height:100%;min-height:300px">
                <div>
                    <a-empty description="No Comments Available"></a-empty>
                    
                </div>
            </div>
            <div v-else
              v-for="comment in modalComments"
              :key="comment.id"
              style="padding: 10px"
            >
              <div style="display: flex; justify-content: space-between">
                <div style="display: flex">
                  <a-avatar
                    :size="32"
                    style="border: 1px solid rgba(0, 0, 0, 0.1)"
                    :src="
                      $store.state.root_media_api +
                      comment.comment_owner?.user_profile
                    "
                  >
                    {{
                      comment.comment_owner?.username
                        ?.charAt(0)
                        .toUpperCase() || "U"
                    }} </a-avatar
                  >&nbsp;
                  {{ comment.comment_owner?.username || "Anonymous" }}
                </div>
                {{ formatDate(comment.created_at) }}
              </div>
              <p style="margin-left: 20px">{{ comment.content }}</p>

              <!-- Replies if any -->
              <div
                v-if="comment.replies && comment.replies.length > 0"
                class="replies-section-modal"
              >
                <div
                  v-for="reply in comment.replies"
                  :key="reply.id"
                  class="reply-item-modal"
                >
                  <a-avatar :size="24" class="reply-avatar">
                    {{
                      reply.comment_owner?.username?.charAt(0).toUpperCase() ||
                      "U"
                    }}
                  </a-avatar>
                  <div class="reply-content-modal">
                    <span class="reply-author-modal">{{
                      reply.comment_owner?.username || "Anonymous"
                    }}</span>
                    <span class="reply-date-modal">{{
                      formatDate(reply.created_at)
                    }}</span>
                    <p class="reply-text-modal">{{ reply.content }}</p>
                  </div>
                </div>
              </div>

              <!-- Load More Comments -->
              <div v-if="hasMoreModalComments" class="load-more-comments">
                <a-button
                  type="link"
                  @click="loadMoreModalComments"
                  :loading="loadingModalComments"
                  class="load-more-btn"
                >
                  Load More Comments
                </a-button>
              </div>
            </div>
          </div>
          <div style="padding: 10px">
            <a-row>
              <a-col :span="20">
                <a-input
                  v-model:value="newModalComment"
                  placeholder="Type here"
                  style="width: 100%"
                  @keyup.enter="addModalComment"
                />
              </a-col>
              <a-col :span="4" style="padding-left: 10px">
                <a-button
                  type="primary"
                  @click="addModalComment"
                  :loading="addingModalComment"
                  :disabled="!newModalComment.trim()"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.721 7.63038L5.2073 8.12581C6.18973 8.45258 6.67989 8.61702 7.03196 8.96909C7.38403 9.32117 7.54847 9.81238 7.87525 10.7927L8.37068 12.279C9.1971 14.7604 9.61031 16 10.3703 16C11.1293 16 11.5435 14.7604 12.37 12.279L15.3615 3.30642C15.9434 1.56082 16.2343 0.688014 15.7737 0.227368C15.313 -0.233277 14.4402 0.0576566 12.6957 0.638471L3.71995 3.63214C1.24174 4.45751 0 4.87072 0 5.63073C0 6.39074 1.24069 6.80395 3.721 7.63038Z"
                      fill="currentColor"
                    />
                    <path
                      d="M3.721 7.63038L5.2073 8.12581C6.18973 8.45258 6.67989 8.61702 7.03196 8.96909C7.38403 9.32117 7.54847 9.81238 7.87525 10.7927L8.37068 12.279C9.1971 14.7604 9.61031 16 10.3703 16C11.1293 16 11.5435 14.7604 12.37 12.279L15.3615 3.30642C15.9434 1.56082 16.2343 0.688014 15.7737 0.227368C15.313 -0.233277 14.4402 0.0576566 12.6957 0.638471L3.71995 3.63214C1.24174 4.45751 0 4.87072 0 5.63073C0 6.39074 1.24069 6.80395 3.721 7.63038Z"
                      fill="currentColor"
                    />
                    <path
                      d="M5.65441 9.68062L3.48084 8.95644C3.32874 8.90574 3.16709 8.8904 3.00817 8.91159C2.84925 8.93278 2.69726 8.98994 2.56376 9.07872L1.41478 9.844C1.27877 9.93462 1.17202 10.0628 1.10752 10.213C1.04302 10.3631 1.02354 10.5288 1.05146 10.6898C1.07938 10.8509 1.15349 11.0003 1.26477 11.12C1.37606 11.2397 1.51973 11.3245 1.67831 11.364L3.73909 11.8784C3.83183 11.9016 3.91653 11.9495 3.98411 12.0171C4.0517 12.0847 4.09964 12.1694 4.12279 12.2621L4.63719 14.3229C4.67674 14.4815 4.76151 14.6252 4.8812 14.7364C5.00089 14.8477 5.15034 14.9218 5.31137 14.9498C5.47241 14.9777 5.63808 14.9582 5.78825 14.8937C5.93841 14.8292 6.0666 14.7225 6.15722 14.5864L6.9225 13.4375C7.01128 13.304 7.06844 13.152 7.08963 12.9931C7.11082 12.8341 7.09548 12.6725 7.04478 12.5204L6.32061 10.3468C6.26884 10.1917 6.1817 10.0508 6.06608 9.93514C5.95045 9.81952 5.80952 9.73238 5.65441 9.68062Z"
                      fill="currentColor"
                    />
                  </svg>
                </a-button>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import {
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
  name: "Community",
  components: {
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
  },
  data() {
    return {
      posts: [],
      loading: true,
      loadingMore: false,
      updating: false,
      hasMore: false,
      currentPage: 1,

      
      // Post details
      postDetailVisible: false,
      selectedPost: null,

      // active_tab
      active_tab: "My Community",

      // Comments
      comments: [],
      newComment: "",
      addingComment: false,
      loadingComments: false,
      hasMoreComments: false,
      commentsPage: 1,
      // products Used
      products_used_in_post: [],
      loadingProductsUsed: false,
      // Edit modal
      editModalVisible: false,
      editingPost: null,
      editForm: {
        img_src: "",
        title: "",
        content:"",
        tag_ids: [],
      },

      // Comments Modal specific
      commentsModalVisible: false,
      selectedPostForComments: null,
      modalComments: [],
      newModalComment: "",
      addingModalComment: false,
      loadingModalComments: false,
      hasMoreModalComments: false,
      modalCommentsPage: 1,

      // Tags
      availableTags: [],
    };
  },

  async mounted() {
    await this.loadPosts();
    await this.loadTags();
  },

  methods: {
    // Open comments modal (replace the viewPost call in comment icon click)
    async openCommentsModal(post) {
      this.selectedPostForComments = { ...post };
      this.modalComments = [];
      this.modalCommentsPage = 1;
      this.hasMoreModalComments = false;
      this.commentsModalVisible = true;

      // Load comments for modal
      await this.loadModalComments(post.id);
    },

    // Close comments modal
    closeCommentsModal() {
      this.commentsModalVisible = false;
      this.selectedPostForComments = null;
      this.modalComments = [];
      this.newModalComment = "";
    },

    // Load comments for modal
    async loadModalComments(postId, page = 1) {
      try {
        this.loadingModalComments = true;
        const response = await fetch(
          `${this.$store.state.root_api}community/api/comments/?post_id=${postId}&page=${page}`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          if (page === 1) {
            this.modalComments = data.data;
          } else {
            this.modalComments.push(...data.data);
          }
          this.hasMoreModalComments = page < data.total_pages;
          this.modalCommentsPage = page;
        }
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        this.loadingModalComments = false;
      }
    },

    // Load more comments in modal
    async loadMoreModalComments() {
      if (this.selectedPostForComments) {
        await this.loadModalComments(
          this.selectedPostForComments.id,
          this.modalCommentsPage + 1
        );
      }
    },

    // Add comment in modal
    async addModalComment() {
      if (!this.newModalComment.trim() || !this.selectedPostForComments) return;

      try {
        this.addingModalComment = true;
        const response = await fetch(
          `${this.$store.state.root_api}community/api/comments/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              post_id: this.selectedPostForComments.id,
              content: this.newModalComment.trim(),
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          // Clear input
          this.newModalComment = "";

          // Reload comments
          await this.loadModalComments(this.selectedPostForComments.id);

          // Update comment count in the main list
          this.selectedPostForComments.comment_count += 1;
          const postIndex = this.posts.findIndex(
            (p) => p.id === this.selectedPostForComments.id
          );
          if (postIndex !== -1) {
            this.posts[postIndex].comment_count =
              this.selectedPostForComments.comment_count;
          }

          this.$message.success("Comment added successfully!");
        }
      } catch (error) {
        console.error("Failed to add comment:", error);
        this.$message.error("Failed to add comment");
      } finally {
        this.addingModalComment = false;
      }
    },

    // Load community posts
    async loadPosts() {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}community/api/my-posts/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          // Process posts data to match backend structure
          this.posts = data.data.map((post) => ({
            ...post,
            isLiked: false, // You'll need to check user's likes separately
            tags: post.tags || [], // Backend returns string array
            like_count: post.like_count || 0,
            comment_count: post.comment_count || 0,
            share_count: post.share_count || 0,
            view_count: post.view_count || 0,
          }));

          // No pagination in MyPostsAPI currently
          this.hasMore = false;
        } else {
          throw new Error(data.message || "Failed to load posts");
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
        this.$message.error("Failed to load posts");
      } finally {
        this.loading = false;
      }
    },

    // Load more posts (if pagination is added to backend later)
    async loadMorePosts() {
      // Currently not implemented in backend API
      this.$message.info("Load more not available for personal posts");
    },

    // Load available tags
    async loadTags() {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}community/api/tags/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          this.availableTags = data.data.map((tag) => ({
            label: tag.name,
            value: tag.id,
          }));
        }
      } catch (error) {
        console.error("Failed to load tags:", error);
      }
    },

    // View post details
    async viewPost(post) {
      this.selectedPost = { ...post };
      this.comments = [];
      this.commentsPage = 1;
      this.hasMoreComments = false;

      // Load comments
      await this.loadComments(post.id);
      await this.loadUsedProducts(post.id);
      // Increment view count
      await this.incrementViewCount(post.id);
    },

    // Add this new method
    async incrementViewCount(postId) {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}community/api/posts/view/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              post_id: postId,
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          // Update view count in the posts list
          const postIndex = this.posts.findIndex((p) => p.id === postId);
          if (postIndex !== -1) {
            this.posts[postIndex].view_count = data.data.view_count;
          }

          // Update selected post view count
          if (this.selectedPost && this.selectedPost.id === postId) {
            this.selectedPost.view_count = data.data.view_count;
          }
        }
      } catch (error) {
        console.error("Failed to increment view count:", error);
      }
    },
    // Close post details
    closePostDetails() {
      this.selectedPost = null;
      this.comments = [];
      this.newComment = "";
    },

    // Load comments for post - CORRECTED to match backend API
    async loadComments(postId, page = 1) {
      try {
        this.loadingComments = true;
        const response = await fetch(
          `${this.$store.state.root_api}community/api/comments/?post_id=${postId}&page=${page}`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          if (page === 1) {
            this.comments = data.data;
          } else {
            this.comments.push(...data.data);
          }
          this.hasMoreComments = page < data.total_pages;
          this.commentsPage = page;
        }
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        this.loadingComments = false;
      }
    },

    // Load comments for post - CORRECTED to match backend API
    async loadUsedProducts(postId, page = 1) {
      try {
        this.loadingProductsUsed = true;
        const response = await fetch(
          `${this.$store.state.root_api}community/api/products-used-in-post/?post_id=${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          this.products_used_in_post = data.data;
        }
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        this.loadingProductsUsed = false;
      }
    },

    // Load more comments
    async loadMoreComments() {
      if (this.selectedPost) {
        await this.loadComments(this.selectedPost.id, this.commentsPage + 1);
      }
    },

    // Add comment - CORRECTED to match backend API
    async addComment() {
      if (!this.newComment.trim() || !this.selectedPost) return;

      try {
        this.addingComment = true;
        const response = await fetch(
          `${this.$store.state.root_api}community/api/comments/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              post_id: this.selectedPost.id,
              content: this.newComment.trim(),
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          // Clear the comment input BEFORE reloading
          this.newComment = "";

          // Reload comments to get the updated list
          await this.loadComments(this.selectedPost.id);

          // Update comment count
          this.selectedPost.comment_count += 1;
          const postIndex = this.posts.findIndex(
            (p) => p.id === this.selectedPost.id
          );
          if (postIndex !== -1) {
            this.posts[postIndex].comment_count =
              this.selectedPost.comment_count;
          }

          this.$message.success("Comment added successfully!");
        }
      } catch (error) {
        console.error("Failed to add comment:", error);
        this.$message.error("Failed to add comment");
      } finally {
        this.addingComment = false;
      }
    },
    // Scroll to comments section
    scrollToComments() {
      this.$nextTick(() => {
        if (this.$refs.commentsSection) {
          this.$refs.commentsSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    },

    // Toggle like/unlike
    async toggleLike(post) {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}community/api/posts/like/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
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

          // Update selected post if it's the same
          if (this.selectedPost && this.selectedPost.id === post.id) {
            this.selectedPost.isLiked = post.isLiked;
            this.selectedPost.like_count = post.like_count;
          }

          this.$message.success(`Post ${data.data.action}!`);
        }
      } catch (error) {
        console.error("Failed to toggle like:", error);
        this.$message.error("Failed to update like");
      }
    },

    // Share post
    async sharePost(post) {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}community/api/posts/share/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              post_id: post.id,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          post.share_count = data.data.share_count;

          // Update selected post if it's the same
          if (this.selectedPost && this.selectedPost.id === post.id) {
            this.selectedPost.share_count = post.share_count;
          }

          this.$message.success("Post shared successfully!");

          // Copy link to clipboard
          const shareUrl = `${window.location.origin}/community/post/${post.id}`;
          navigator.clipboard.writeText(shareUrl);
          this.$message.info("Post link copied to clipboard!");
        }
      } catch (error) {
        console.error("Failed to share post:", error);
        this.$message.error("Failed to share post");
      }
    },

    // Edit post
    editPost(post) {
      this.editingPost = post;
      this.editForm = {
        img_src: post.post_image,
        title: post.title,
        content: post.content,
        tag_ids: post.tags,
      };
      // You'll need to find the actual tag IDs from your availableTags
      if (post.tags && post.tags.length > 0) {
        this.editForm.tag_ids = post.tags
          .map((tagName) => {
            const foundTag = this.availableTags.find(
              (tag) => tag.label === tagName
            );
            return foundTag ? foundTag.value : null;
          })
          .filter((id) => id !== null);
      }

      this.editModalVisible = true;
    },

    // Update post
    async updatePost() {
      if (!this.editForm.title.trim()) {
        this.$message.error("Title is required");
        return;
      }

      this.updating = true;

      try {
        const response = await fetch(
          `${this.$store.state.root_api}community/api/posts/`,
          {
            method: "PUT",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              post_id: this.editingPost.id,
              ...this.editForm,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          // Update post in list
          const postIndex = this.posts.findIndex(
            (p) => p.id === this.editingPost.id
          );
          if (postIndex !== -1) {
            this.posts[postIndex] = {
              ...this.posts[postIndex],
              title: data.data.title,
              content: data.data.content,
              updated_at: data.data.updated_at,
            };
          }

          // Update selected post if it's being viewed
          if (
            this.selectedPost &&
            this.selectedPost.id === this.editingPost.id
          ) {
            this.selectedPost.title = data.data.title;
            this.selectedPost.content = data.data.content;
            this.selectedPost.updated_at = data.data.updated_at;
          }

          this.editModalVisible = false;
          this.$message.success("Post updated successfully!");
        } else {
          throw new Error(data.message || "Failed to update post");
        }
      } catch (error) {
        console.error("Failed to update post:", error);
        this.$message.error(error.message || "Failed to update post");
      } finally {
        this.updating = false;
      }
    },

    // Confirm delete
    confirmDelete(post) {
      this.$confirm({
        title: "Delete Post",
        content:
          "Are you sure you want to delete this post? This action cannot be undone.",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: () => this.deletePost(post),
      });
    },

    // Delete post
    async deletePost(post) {
      try {
        const response = await fetch(
          `${this.$store.state.root_api}community/api/posts/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              post_id: post.id,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          // Remove post from list
          this.posts = this.posts.filter((p) => p.id !== post.id);

          // Close post detail if it's the deleted post
          if (this.selectedPost && this.selectedPost.id === post.id) {
            this.closePostDetails();
          }

          this.$message.success("Post deleted successfully!");
        } else {
          throw new Error(data.message || "Failed to delete post");
        }
      } catch (error) {
        console.error("Failed to delete post:", error);
        this.$message.error(error.message || "Failed to delete post");
      }
    },

    // Utility methods
    formatNumber(num) {
      if (!num || num === 0) return "0";
      if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
      if (num >= 1000) return (num / 1000).toFixed(1) + "K";
      return num.toString();
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "Yesterday";
      if (diffDays <= 7) return `${diffDays} days ago`;
      if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString();
    },

    truncateText(text, length) {
      if (!text || text.length <= length) return text;
      return text.substring(0, length) + "...";
    },
    filterTags(inputValue, option) {
      // Case-insensitive substring match
      return option.label.toLowerCase().includes(inputValue.toLowerCase());
    },
  },
};
</script>

<style scoped>
.main {
  margin-top: 10px;
  border-radius: 20px;
  border: 1px solid rgba(128, 128, 128, 0.167);
  padding: 20px;
  /* min-height: 100vh; */
  background-color: white;
}

.post-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0px;
  border-radius: 12px;
  background: white;
  /* transition: all 0.3s ease; */
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* transform: translateY(-2px); */
}

/* Fixed tags overlay positioning */
.tags-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 70%;
  z-index: 2;
}

.view-count-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  z-index: 2;
}

.pinned-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #1890ff;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 2;
}

.post-stats {
  display: flex;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 16px;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: #666;
}

.stat-item:hover {
  background-color: #f5f5f5;
}

.stat-item.large {
  padding: 8px 16px;
  font-size: 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  margin: 0 8px 8px 0;
}

.stat-item.large:hover {
  background-color: #e9ecef;
}

.stat-item span {
  font-size: 13px;
  font-weight: 500;
}

.stat-item.large span {
  font-size: 14px;
  font-weight: 600;
}

/* Post Detail Modal Styles */

.post-image-container {
  position: relative;
  margin-bottom: 16px;
}

.post-detail-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 12px;
}

.post-detail-tags {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 60%;
}

.post-detail-actions {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 6px;
  padding: 0px 0;
  border-bottom: 1px solid #f0f0f0;
}

.post-description {
  padding: 0 0 20px 0;
}

.post-description h3 {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
  line-height: 1.3;
}

.post-description p {
  font-size: 16px;
  color: #595959;
  line-height: 1.6;
  margin-bottom: 16px;
}

.post-meta {
  font-size: 14px;
  color: #8c8c8c;
}

/* Comments Section */
.comments-section {
  height: 100%;
  /* max-height: 600px;
    overflow-y: auto; */
  padding: 0 16px;
}

.comments-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.add-comment {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.comments-list {
  space: 16px;
}

.comment-item {
  display: flex;
  margin-bottom: 16px;
  padding: 12px;
  background: #f2f2f2;
  /* border-radius: 12px; */
  /* border-left: 3px solid #1890ff; */
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.comment-author {
  font-weight: 600;
  font-size: 14px;
  color: #262626;
}

.comment-date {
  font-size: 12px;
  color: #8c8c8c;
}

.comment-text {
  font-size: 14px;
  color: #595959;
  line-height: 1.5;
  margin: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .main {
    padding: 12px;
    margin-top: 5px;
  }

  .post-card {
    padding: 10px;
  }

  .post-stats {
    gap: 12px;
  }

  .tags-overlay {
    max-width: 60%;
  }

  .post-detail-tags {
    max-width: 50%;
  }

  .post-detail-actions {
    justify-content: center;
  }

  .stat-item.large {
    padding: 6px 12px;
    font-size: 14px;
    margin: 0 4px 8px 0;
  }

  .comments-section {
    padding: 0 8px;
    margin-top: 20px;
  }

  .post-description h3 {
    font-size: 20px;
  }

  .post-description p {
    font-size: 14px;
  }
}

/* Custom scrollbar for comments */
.comments-section::-webkit-scrollbar {
  width: 6px;
}

.comments-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.comments-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.comments-section::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation for post cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-card {
  animation: fadeInUp 0.6s ease-out;
}

/* Loading states */
.ant-spin-container {
  transition: opacity 0.3s;
}

.ant-spin-blur {
  opacity: 0.5;
  pointer-events: none;
}

/* Tags styling improvements */
.ant-tag {
  font-size: 11px !important;
  padding: 2px 8px !important;
  border-radius: 12px !important;
  border: none !important;
  font-weight: 500 !important;
}

/* Modal improvements */
.ant-modal-content {
  border-radius: 16px;
  overflow: hidden;
}

.ant-modal-header {
  border-radius: 16px 16px 0 0;
  border-bottom: 1px solid #f0f0f0;
}

.ant-modal-body {
  padding: 0;
}

/* Improved hover effects */
.post-card img {
  transition: transform 0.3s ease;
}

.post-card:hover img {
  transform: scale(1.01);
}

/* Better button styling */
.ant-btn-primary {
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.ant-btn-primary:hover {
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transform: translateY(-1px);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE & Edge */
  scrollbar-width: none; /* Firefox */
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
    width: 33.33%;
    flex: 0 0 33.33%;
  }
}
</style>
