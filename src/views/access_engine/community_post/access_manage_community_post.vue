<template>
  {{ access_recieved.community }}
  <div>
    <h1>Manage Community Post Requests</h1>

    <!-- Main Grid View -->
    <div v-if="!selectedPostDetail && !selectedDesignDetail">
      <a-tabs v-model:activeKey="active_tab_name">
        <!-- ========== POSTED DESIGNS TAB ========== -->
        <a-tab-pane key="posted" tab="Posted Community Designs">
          <a-row v-if="community_posted_designes.data && community_posted_designes.data.length > 0" :gutter="[16, 16]">
            <a-col
              v-for="post in community_posted_designes.data"
              :key="post.id"
              :lg="8"
              :md="8"
              :xs="24"
              :sm="24"
            >
              <div style="padding: 2px">
                <div class="post-card">
                  <!-- Post Image -->
                  <div style="position: relative; cursor: pointer" @click="showPostDetail(post)">
                    <img
                      :src="$store.state.root_media_api + post.post_image"
                      style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; padding: 5px"
                      :alt="post.title"
                    />
                    <!-- Tags -->
                    <div class="tags-overlay">
                      <template v-if="post.tags && post.tags.length > 0">
                        <a-tag
                          v-for="(tag, index) in post.tags.slice(0, 3)"
                          :key="index"
                          color="blue"
                          style="margin: 2px; border-radius: 12px; font-size: 11px"
                        >
                          {{ tag }}
                        </a-tag>
                        <a-tag
                          v-if="post.tags.length > 3"
                          style="margin: 2px; border-radius: 12px; font-size: 11px; background: rgba(0, 0, 0, 0.6); color: white; border: none"
                        >
                          +{{ post.tags.length - 3 }}
                        </a-tag>
                      </template>
                    </div>
                    <!-- View Count -->
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
                    <a-row style="align-items: center">
                      <a-col :span="14" style="display: flex; gap: 10px; justify-content: start; align-items: center">
                        <img
                          :src="$store.state.root_media_api + post.user_profile"
                          style="width: 40px; height: 40px; border-radius: 100%; border: 1px solid rgba(0, 0, 0, 0.2)"
                          alt=""
                        />
                        <span style="font-size: 16px; font-weight: 600">
                          {{ truncateText(post.post_by, 15) }}
                        </span>
                      </a-col>
                      <a-col :span="10" style="display: flex">
                        <!-- Stats -->
                        <div class="post-stats">
                          <div class="stat-item" @click="toggleLike(post)">
                            <HeartFilled v-if="post.isLiked" style="color: #ff4d4f" />
                            <HeartOutlined v-else />
                            <span>{{ formatNumber(post.like_count) }}</span>
                          </div>
                          <div class="stat-item" @click="openCommentsModal(post)">
                            <MessageOutlined />
                            <span>{{ formatNumber(post.comment_count) }}</span>
                          </div>
                          <div class="stat-item" @click="sharePost(post)">
                            <ShareAltOutlined />
                            <span>{{ formatNumber(post.share_count) }}</span>
                          </div>
                        </div>
                        <!-- Dropdown Menu -->
                        <!-- <a-dropdown :trigger="['click']" placement="bottomRight">
                          <a-button type="text" size="small" style="padding: 2px">
                            <MoreOutlined style="font-size: 16px; color: #666" />
                          </a-button>
                          <template #overlay>
                            <a-menu>
                              <a-menu-item @click="editPost(post)">
                                <EditOutlined style="margin-right: 8px" />
                                Edit Post
                              </a-menu-item>
                              <a-menu-item @click="sharePost(post)">
                                <ShareAltOutlined style="margin-right: 8px" />
                                Share
                              </a-menu-item>
                              <a-menu-divider />
                              <a-menu-item @click="confirmDelete(post)" style="color: #ff4d4f">
                                <DeleteOutlined style="margin-right: 8px" />
                                Delete Post
                              </a-menu-item>
                            </a-menu>
                          </template>
                        </a-dropdown> -->
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-empty v-else description="No Posted Designs" style="padding: 50px 0" />
        </a-tab-pane>

        <!-- ========== UNPOSTED DESIGNS TAB ========== -->
        <a-tab-pane key="un-posted" tab="Unposted Community Designs" force-render>
          <a-row v-if="business_designes.data && business_designes.data.length > 0" :gutter="[16, 16]">
            <a-col :lg="8" :md="8" :xs="24" :sm="24" style="padding: 5px" v-for="design in business_designes.data" :key="design.id">
              <div style="border: 1px solid rgba(0, 0, 0, 0.1); padding: 5px; border-radius: 10px">
                <img
                  :src="$store.state.root_media_api + design.image"
                  style="width: 100%; border-radius: 10px; max-height: 200px; object-fit: cover; cursor: pointer"
                  alt=""
                  @click="showDesignDetail(design)"
                />
                <a-row style="padding-top: 5px">
                  <a-col :span="22">
                    <a-tag>Room: {{ design.room_type }}</a-tag>
                    <a-tag>Style: {{ design.room_design_type }}</a-tag>
                  </a-col>
                  <a-col :span="2">
                    <a-dropdown :trigger="['click']" placement="bottomRight">
                      <MoreOutlined style="font-size: 16px; cursor: pointer" />
                      <template #overlay>
                        <a-menu>
                          <a-menu-item @click="handlePostDesign(design)">
                            <UploadOutlined style="margin-right: 8px" />
                            Post Design
                          </a-menu-item>
                          <a-menu-divider />
                          <a-menu-item @click="handleDeleteDesign(design)" style="color: #ff4d4f">
                            <DeleteOutlined style="margin-right: 8px" />
                            Delete
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>
          <a-empty v-else description="No Unposted Designs" style="padding: 50px 0" />
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- ========== POST DETAIL VIEW ========== -->
    <div v-if="selectedPostDetail && !selectedDesignDetail">
      <a-row :gutter="24">
        <!-- Header with Back Button -->
        <a-col :span="24">
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
            <a-button @click="closePostDetail" type="text" size="large">
              <ArrowLeftOutlined style="margin-right: 8px" />
              <b>Back</b>
            </a-button>
            <div>
              <a-button @click="editPost(selectedPostDetail)" type="default" style="margin-right: 8px" v-if="access_recieved.community.update">
                <EditOutlined /> Edit
              </a-button>
              <a-popconfirm
                title="Delete Post"
                description="Are you sure you want to delete this post?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="confirmDeletePost"
              >
                <a-button type="text" danger  v-if="access_recieved.community.delete">
                  <DeleteOutlined /> Delete
                </a-button>
              </a-popconfirm>
            </div>
          </div>
        </a-col>

        <!-- Left Side - Post Image and Engagement Stats -->
        <a-col :lg="16" :md="24" :xs="24">
          <!-- Post Image -->
          <div style="margin-bottom: 20px; position: relative">
            <img
              :src="$store.state.root_media_api + selectedPostDetail.post_image"
              :alt="selectedPostDetail.title"
              style="width: 100%; border-radius: 12px; max-height: 500px; object-fit: cover"
            />
            <!-- {{selectedPostDetail}} -->
            <!-- Tags -->
            <div style="position: absolute; top: 12px; left: 12px; display: flex; flex-wrap: wrap; gap: 6px">
              <a-tag
                v-for="(tag, index) in selectedPostDetail.tags"
                :key="index"
                color="blue"
                style="margin: 2px; border-radius: 12px"
              >
                {{ tag }}
              </a-tag>
            </div>
            <!-- View Count -->
            <div class="view-count-overlay">
              <EyeOutlined style="margin-right: 4px" />
              {{ formatNumber(selectedPostDetail.view_count) }}
            </div>
          </div>

          <!-- Post Title -->
          <div style="margin-bottom: 24px">
            <h2 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 600">
              {{ selectedPostDetail.title }}
            </h2>
          </div>

          <!-- Post Metadata -->
          <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; margin-bottom: 24px">
            <a-row :gutter="[16, 16]">
              <a-col :span="12">
                <p style="font-size: 12px; color: #999; margin: 0 0 4px 0">Posted by</p>
                <div style="display: flex; align-items: center; gap: 8px">
                  <img
                    :src="$store.state.root_media_api + selectedPostDetail.user_profile"
                    style="width: 32px; height: 32px; border-radius: 50%"
                  />
                  <span style="font-weight: 600">{{ selectedPostDetail.post_by }}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <p style="font-size: 12px; color: #999; margin: 0 0 4px 0">Posted</p>
                <span style="font-weight: 500">{{ formatDate(selectedPostDetail.created_at) }}</span>
              </a-col>
            </a-row>
          </div>

          <!-- Engagement Stats Row -->
          <div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap">
            <div
              class="engagement-stat"
              @click="toggleLike(selectedPostDetail)"
              style="cursor: pointer"
            >
              <HeartFilled v-if="selectedPostDetail.isLiked" style="font-size: 24px; color: #ff4d4f; display: block; margin-bottom: 8px" />
              <HeartOutlined v-else style="font-size: 24px; color: #1890ff; display: block; margin-bottom: 8px" />
              <p style="font-weight: 600; font-size: 18px; margin: 0">
                {{ formatNumber(selectedPostDetail.like_count) }}
              </p>
              <p style="font-size: 12px; color: #666; margin: 0">Likes</p>
            </div>

            <div
              class="engagement-stat"
              @click="scrollToComments"
              style="cursor: pointer"
            >
              <MessageOutlined style="font-size: 24px; color: #faad14; display: block; margin-bottom: 8px" />
              <p style="font-weight: 600; font-size: 18px; margin: 0">
                {{ formatNumber(selectedPostDetail.comment_count) }}
              </p>
              <p style="font-size: 12px; color: #666; margin: 0">Comments</p>
            </div>

            <div
              class="engagement-stat"
              @click="sharePost(selectedPostDetail)"
              style="cursor: pointer"
            >
              <ShareAltOutlined style="font-size: 24px; color: #52c41a; display: block; margin-bottom: 8px" />
              <p style="font-weight: 600; font-size: 18px; margin: 0">
                {{ formatNumber(selectedPostDetail.share_count) }}
              </p>
              <p style="font-size: 12px; color: #666; margin: 0">Shares</p>
            </div>

            <div class="engagement-stat">
              <EyeOutlined style="font-size: 24px; color: #1890ff; display: block; margin-bottom: 8px" />
              <p style="font-weight: 600; font-size: 18px; margin: 0">
                {{ formatNumber(selectedPostDetail.view_count) }}
              </p>
              <p style="font-size: 12px; color: #666; margin: 0">Views</p>
            </div>
          </div>

          <!-- Products Used Section -->
          <div>
            <h3 style="margin-bottom: 16px; font-size: 20px; font-weight: 600">Products Used to Create Room</h3>
            <a-empty v-if="!postsProducts || postsProducts.length === 0" description="No products available" style="padding: 40px 0" />
            <a-row v-else :gutter="[16, 16]">
             <a-col
              v-for="product in postsProducts"
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
                    <a-button block @click="viewProduct(product)"
                      >Product Details</a-button
                    >
                  </a-col>

                  <a-col span="1"></a-col>
                  <a-col span="4">
                    <a-button><HeartOutlined /></a-button>
                  </a-col>
                </a-row>
              </div>
            </a-col>
            
            </a-row>
          </div>
        </a-col>

        <!-- Right Side - Comments -->
        <a-col :lg="8" :md="24" :xs="24">
          <div class="comments-section" ref="commentsSection">
            <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600">
              Comments ({{ selectedPostDetail.comment_count }})
            </h4>

            <!-- Empty State -->
            <div v-if="!comments.length && !loadingComments" style="display: flex; justify-content: center; align-items: center; min-height: 300px">
              <a-empty description="No Comments Available"></a-empty>
            </div>

            <!-- Loading State -->
            <div v-else-if="loadingComments && comments.length === 0" style="display: flex; justify-content: center; align-items: center; min-height: 300px">
              <a-spin size="large" />
            </div>

            <!-- Comments List -->
            <div v-else class="comments-list">
              <div v-for="comment in comments" :key="comment.id" class="comment-item">
                <a-avatar
                  :size="32"
                  style="border: 1px solid rgb(0, 0, 0, 0.1); margin-right: 8px; flex-shrink: 0"
                  :src="$store.state.root_media_api + comment.comment_owner.user_profile"
                ></a-avatar>

                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{
                      comment.comment_owner?.username || "Anonymous"
                    }}</span>
                    <span class="comment-date">{{
                      formatDate(comment.created_at)
                    }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>

                  <!-- Replies if any -->
                  <div
                    v-if="comment.replies && comment.replies.length > 0"
                    class="replies-section"
                  >
                    <div
                      v-for="reply in comment.replies"
                      :key="reply.id"
                      class="reply-item"
                    >
                      <a-avatar
                        :size="24"
                        style="background-color: #52c41a; margin-right: 6px; flex-shrink: 0"
                      >
                        {{
                          reply.comment_owner?.username
                            ?.charAt(0)
                            .toUpperCase() || "U"
                        }}
                      </a-avatar>
                      <div class="reply-content">
                        <span class="reply-author">{{
                          reply.comment_owner?.username || "Anonymous"
                        }}</span>
                        <span class="reply-date">{{
                          formatDate(reply.created_at)
                        }}</span>
                        <p class="reply-text">{{ reply.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Load More Comments -->
              <div v-if="hasMoreComments" style="text-align: center; margin-top: 16px">
                <a-button
                  type="link"
                  @click="loadMoreComments"
                  :loading="loadingComments"
                >
                  Load More Comments
                </a-button>
              </div>
            </div>

        <!-- Add Comment -->
<div class="add-comment" v-if="selectedPostDetail" style="background: white; border-radius: 8px;  border: 1px solid #f0f0f0;">
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <textarea
      v-model="newComment"
      placeholder="Add a comment..."
      style="width: 100%; padding: 10px 12px; border: 1px solid #d9d9d9; border-radius: 6px; font-size: 13px; font-family: inherit; resize: vertical; min-height: 60px; outline: none; transition: all 0.2s;"
      @focus="$event.target.style.borderColor = '#1890ff'; $event.target.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.1)'"
      @blur="$event.target.style.borderColor = '#d9d9d9'; $event.target.style.boxShadow = 'none'"
    ></textarea>
    <button
      @click="addComment"
      :disabled="!newComment.trim() || addingComment"
      style="padding: 10px 16px; background-color: #1890ff; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; transition: all 0.2s;"
      :style="(!newComment.trim() || addingComment) ? 'background-color: #d9d9d9; cursor: not-allowed;' : 'background-color: #1890ff; hover: {background-color: #0050b3}'"
    >
      <svg
        v-if="!addingComment"
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.721 7.63038L5.2073 8.12581C6.18973 8.45258 6.67989 8.61702 7.03196 8.96909C7.38403 9.32117 7.54847 9.81238 7.87525 10.7927L8.37068 12.279C9.1971 14.7604 9.61031 16 10.3703 16C11.1293 16 11.5435 14.7604 12.37 12.279L15.3615 3.30642C15.9434 1.56082 16.2343 0.688014 15.7737 0.227368C15.313 -0.233277 14.4402 0.0576566 12.6957 0.638471L3.71995 3.63214C1.24174 4.45751 0 4.87072 0 5.63073C0 6.39074 1.24069 6.80395 3.721 7.63038Z"
          fill="currentColor"
        />
      </svg>
      <span>{{ addingComment ? 'Posting...' : 'Post Comment' }}</span>
    </button>
  </div>
</div>
          </div>
        </a-col>
      </a-row>
    </div>

<!-- ========== DESIGN DETAIL VIEW WITH EDIT PANEL ========== -->
<div v-if="selectedDesignDetail && !selectedPostDetail">
  <a-row :gutter="24">
    <!-- Header with Back Button -->
  
    <a-col :span="24">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px">
    <a-button @click="closeDesignDetail" type="text" size="large">
      <ArrowLeftOutlined style="margin-right: 8px" />
      <b>Back</b>
    </a-button>
    <div style="display: flex; gap: 8px; flex-wrap: wrap">
      <!-- Edit Design Button (Show when not editing) -->
      <a-button 
        v-if="access_recieved.community.update &&  !isEditingDesign" 
        @click="toggleEditDesign" 
        type="default" 
      >
        <EditOutlined /> Edit Design
      </a-button>

      <!-- Save Changes Button (Show in edit mode) -->
      <a-button 
        v-if="isEditingDesign"
        @click="saveDesignChanges" 
        type="primary" 
        :loading="savingDesign"
      >
        <SaveOutlined /> Save Changes
      </a-button>

      <!-- Cancel Button (Show in edit mode) -->
      <a-button 
        v-if="isEditingDesign"
        @click="cancelEditDesign" 
        type="default"
      >
        <CloseOutlined /> Cancel
      </a-button>

      <!-- Post to Community Button (Show when not editing and design is complete) -->
      <a-button 
        v-if="access_recieved.community.create && !isEditingDesign"
        @click="handlePostDesign(selectedDesignDetail)" 
        type="primary"
        style="background-color: #52c41a; border-color: #52c41a"
      >
        <UploadOutlined /> Publish post to Community
      </a-button>

      <!-- Post to Community Button - Disabled State -->
      <!-- <a-button 
        v-if="!isEditingDesign && !canPostDesign()"
        disabled
        type="primary"
        style="background-color: #d9d9d9; border-color: #d9d9d9"
        title="Complete all design details before posting"
      >
        <UploadOutlined /> Post to Community
      </a-button> -->

      <!-- Delete Button -->
      <a-popconfirm
        title="Delete Design"
        description="Are you sure you want to delete this design?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="handleDeleteDesignConfirm"
      >
        <a-button type="text" v-if="access_recieved.community.delete " danger>
          <DeleteOutlined /> Delete
        </a-button>
      </a-popconfirm>
    </div>
  </div>
</a-col>

    <!-- Left Side - Design Image -->
    <a-col :lg="14" :md="24" :xs="24">
      <img
        :src="$store.state.root_media_api + selectedDesignDetail.image"
        :alt="selectedDesignDetail.room_type"
        style="width: 100%; border-radius: 12px; max-height: 500px; object-fit: cover; margin-bottom: 20px"
      />

      <!-- Products Used Section -->
      <div>
        <h3 style="margin-bottom: 16px; font-size: 20px; font-weight: 600">Products Used in Design</h3>
        <a-empty v-if="!designProducts || designProducts.length === 0" description="No products available" />
        <a-row v-else :gutter="[16, 16]">
             <a-col
              v-for="product in designProducts"
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
                    <a-button block @click="viewProduct(product)"
                      >Product Details</a-button
                    >
                  </a-col>

                  <a-col span="1"></a-col>
                  <a-col span="4">
                    <a-button><HeartOutlined /></a-button>
                  </a-col>
                </a-row>
              </div>
            </a-col>
        </a-row>
      </div>
    </a-col>

    <!-- Right Side - Design Details / Edit Panel -->
    <a-col :lg="10" :md="24" :xs="24">
      <!-- VIEW MODE -->
       <!-- {{ selectedDesignDetail }} -->
      <div v-if="!isEditingDesign" style="padding: 20px; background: #f8f9fa; border-radius: 12px">
        <div style="margin-bottom: 24px">
          <h2 style="margin: 0 0 12px 0">{{ selectedDesignDetail.room_type }} - {{ selectedDesignDetail.room_design_type }}</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0">
            {{ selectedDesignDetail.description || 'No description available' }}
          </p>
        </div>

        <div style="padding: 16px; background: white; border-radius: 8px; margin-bottom: 16px">
          <div style="font-size: 14px; color: #666">
            <p style="margin-bottom: 12px">
              <strong style="color: #333">Room Type:</strong> 
              <span>{{ selectedDesignDetail.room_type }}</span>
            </p>
            <p style="margin-bottom: 12px">
              <strong style="color: #333">Design Style:</strong> 
              <span>{{ selectedDesignDetail.room_design_type }}</span>
            </p>
            <p style="margin-bottom: 12px">
              <strong style="color: #333">Created:</strong> 
              <span>{{ formatDate(selectedDesignDetail.created_at) }}</span>
            </p>
            <p v-if="selectedDesignDetail.updated_at !== selectedDesignDetail.created_at" style="margin: 0">
              <strong style="color: #333">Updated:</strong> 
              <span>{{ formatDate(selectedDesignDetail.updated_at) }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- EDIT MODE -->
      <div v-else style="padding: 20px; background: white; border-radius: 12px; border: 2px solid #1890ff">
        <h3 style="margin-bottom: 16px; color: #1890ff">Edit Design Details</h3>

        <!-- Description -->
        <div style="margin-bottom: 16px">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333">
            Describe Room <span style="color: red">*</span>
          </label>
          <a-textarea
            v-model:value="designEditForm.description"
            placeholder="Give your design an attractive description here..."
            size="large"
            :rows="4"
            :maxlength="500"
            show-count
            style="border-radius: 8px"
          />
        </div>

        <!-- Room Type -->
        <div style="margin-bottom: 16px">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333">
            Room Type <span style="color: red">*</span>
          </label>
          <a-select 
            v-model:value="designEditForm.room_type"
            placeholder="Select room type..."
            style="width: 100%"
          >
            <a-select-option value="Living Room">Living Room</a-select-option>
            <a-select-option value="Dining Room">Dining Room</a-select-option>
            <a-select-option value="Kitchen">Kitchen</a-select-option>
            <a-select-option value="Home Office">Home Office</a-select-option>
            <a-select-option value="Bedroom">Bedroom</a-select-option>
            <a-select-option value="Office">Office</a-select-option>
            <a-select-option value="Rest Room">Rest Room</a-select-option>
          </a-select>
        </div>

        <!-- Design Style -->
        <div style="margin-bottom: 16px">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333">
            Design Style <span style="color: red">*</span>
          </label>
          <a-select 
            v-model:value="designEditForm.room_design_type"
            placeholder="Select design style..."
            style="width: 100%"
          >
            <a-select-option value="Modern">Modern</a-select-option>
            <a-select-option value="Classic">Classic</a-select-option>
            <a-select-option value="Rustic">Rustic</a-select-option>
            <a-select-option value="Industrial">Industrial</a-select-option>
            <a-select-option value="Minimalist">Minimalist</a-select-option>
            <a-select-option value="Traditional">Traditional</a-select-option>
            <a-select-option value="Contemporary">Contemporary</a-select-option>
            <a-select-option value="Vintage">Vintage</a-select-option>
          </a-select>
        </div>

        <!-- Info Alert -->
        <a-alert
          message="Save your changes to update the design details"
          type="info"
          show-icon
          style="margin-top: 12px"
        />
      </div>
    </a-col>
  </a-row>
</div>

    <!-- ========== EDIT POST MODAL ========== -->
    <a-modal
      v-model:open="editModalVisible"
      title="Edit Post"
      width="600px"
      @ok="updatePost"
      :confirm-loading="updating"
    >
      <img
        :src="$store.state.root_media_api + editForm.post_image"
        alt=""
        style="width: 100%; border-radius: 10px; margin-bottom: 16px"
      />
      <div>
        <div style="margin-bottom: 16px">
          <label style="display: block; margin-bottom: 8px; font-weight: 500">Title</label>
          <a-input
            v-model:value="editForm.title"
            placeholder="Post title..."
            :maxlength="200"
            show-count
          />
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 500">Tags</label>
          <a-select
            v-model:value="editForm.tags"
            mode="tags"
            placeholder="Select or create tags..."
            style="width: 100%"
            :options="availableTags"
          />
        </div>
      </div>
    </a-modal>
    
  </div>
</template>

<script>
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  ShareAltOutlined,
  MoreOutlined,
  ArrowLeftOutlined,
  PushpinOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue';

export default {
  name: 'manage-site-community-post',
  components: {
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
    EyeOutlined,
    HeartOutlined,
    HeartFilled,
    MessageOutlined,
    ShareAltOutlined,
    MoreOutlined,
    ArrowLeftOutlined,
    PushpinOutlined,
    SaveOutlined,
    CloseOutlined,
  },
  props: {
    access_recieved: Object,
  },
  data() {
    return {
      business_designes: [],
      community_posted_designes: [],
      active_tab_name: 'posted',
      selectedPostDetail: null,
      selectedDesignDetail: null,
      postsProducts: [],
      designProducts: [],
      
      // Comments Management
      comments: [],
      newComment: '',
      addingComment: false,
      loadingComments: false,
      hasMoreComments: false,
      commentsPage: 1,
      
      // Post Edit Modal
      editModalVisible: false,
      editingPost: null,
      updating: false,
      editForm: {
        post_image: '',
        title: '',
        tags: [],
      },
      availableTags: [],
      
      // Design Edit Mode
      isEditingDesign: false,
      savingDesign: false,
      designEditForm: {
        id: null,
        image: '',
        description: '',
        room_type: '',
        room_design_type: '',
      },
    };
  },
  
  mounted() {
    this.fetchBusinessDesignes();
    this.fetchCommunityDesignes();
    this.loadTags();
  },
  
  methods: {
    // ========== DESIGN EDIT METHODS ==========
    
    /**
     * Toggle between view and edit mode for design
     */
    toggleEditDesign() {
      if (!this.isEditingDesign) {
        this.startEditDesign(this.selectedDesignDetail);
      }
    },

    /**
     * Start editing the selected design
     */
    startEditDesign(design) {
      this.isEditingDesign = true;
      this.designEditForm = {
        id: design.id,
        image: design.image,
        description: design.description || design.room_description || '',
        room_type: design.room_type || '',
        room_design_type: design.room_design_type || '',
      };
    },

    /**
     * Cancel edit mode without saving
     */
    cancelEditDesign() {
      this.isEditingDesign = false;
      this.designEditForm = {
        id: null,
        image: '',
        description: '',
        room_type: '',
        room_design_type: '',
      };
    },

    /**
     * Save design changes to backend
     */
    async saveDesignChanges() {
      // Validation
      if (!this.designEditForm.description.trim()) {
        this.$message.error('Please provide a room description');
        return;
      }

      if (!this.designEditForm.room_type) {
        this.$message.error('Please select a room type');
        return;
      }

      if (!this.designEditForm.room_design_type) {
        this.$message.error('Please select a design style');
        return;
      }

      this.savingDesign = true;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/business-community-posts/business-designes-apis/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'save_design_details',
              design_id: this.designEditForm.id,
              description_room: this.designEditForm.description.trim(),
              room_design_type_select: this.designEditForm.room_design_type,
              room_type_select: this.designEditForm.room_type,
            }),
          }
        );

        const data = await response.json();

        if (data.success || data.status === 'success') {
          // Update the selected design with new values
          this.selectedDesignDetail = {
            ...this.selectedDesignDetail,
            description: this.designEditForm.description,
            room_description: this.designEditForm.description,
            room_type: this.designEditForm.room_type,
            room_design_type: this.designEditForm.room_design_type,
          };

          // Update in the unposted designs list if it exists
          const designIndex = this.business_designes.data?.findIndex(
            (d) => d.id === this.designEditForm.id
          );

          if (designIndex !== -1 && designIndex !== undefined) {
            this.business_designes.data[designIndex] = {
              ...this.business_designes.data[designIndex],
              description: this.designEditForm.description,
              room_description: this.designEditForm.description,
              room_type: this.designEditForm.room_type,
              room_design_type: this.designEditForm.room_design_type,
            };
          }

          this.isEditingDesign = false;
          this.$message.success('Design updated successfully!');
        } else {
          throw new Error(data.message || 'Failed to update design');
        }
      } catch (error) {
        console.error('Failed to save design:', error);
        this.$message.error(error.message || 'Failed to save design changes');
      } finally {
        this.savingDesign = false;
      }
    },

    // ========== COMMENTS METHODS ==========
    
    async loadComments(postId, page = 1) {
      try {
        this.loadingComments = true;
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}community/api/comments/?post_id=${postId}&page=${page}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          if (page === 1) {
            this.comments = data.data || [];
          } else {
            this.comments.push(...(data.data || []));
          }
          this.hasMoreComments = page < data.total_pages;
          this.commentsPage = page;
        }
      } catch (error) {
        console.error('Failed to load comments:', error);
        this.$message.error('Failed to load comments');
      } finally {
        this.loadingComments = false;
      }
    },

    async loadMoreComments() {
      if (this.selectedPostDetail) {
        await this.loadComments(this.selectedPostDetail.id, this.commentsPage + 1);
      }
    },

    async addComment() {
      if (!this.newComment.trim() || !this.selectedPostDetail) return;

      try {
        this.addingComment = true;
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}community/api/comments/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              post_id: this.selectedPostDetail.id,
              content: this.newComment.trim(),
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          this.newComment = '';
          await this.loadComments(this.selectedPostDetail.id);
          this.selectedPostDetail.comment_count += 1;
          this.$message.success('Comment added successfully!');
        }
      } catch (error) {
        console.error('Failed to add comment:', error);
        this.$message.error('Failed to add comment');
      } finally {
        this.addingComment = false;
      }
    },

    async loadMoreReplies(comment) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}community/api/comments/${comment.id}/replies/`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          comment.replies = data.data || [];
        }
      } catch (error) {
        console.error('Failed to load replies:', error);
      }
    },

    // ========== POST DETAIL METHODS ==========
    
    async showPostDetail(post) {
      this.selectedPostDetail = { ...post, isLiked: false };
      this.comments = [];
      this.commentsPage = 1;
      this.hasMoreComments = false;
      this.newComment = '';
      
      await this.loadPostProducts(post.id);
      await this.loadComments(post.id);
    },

    closePostDetail() {
      this.selectedPostDetail = null;
      this.postsProducts = [];
      this.comments = [];
      this.newComment = '';
    },

    scrollToComments() {
      this.$nextTick(() => {
        if (this.$refs.commentsSection) {
          this.$refs.commentsSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    },

    async loadPostProducts(postId) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/business-community-posts/products-used-in-post/?post_id=${postId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          this.postsProducts = data.data || [];
        }
      } catch (error) {
        console.error('Error loading post products:', error);
      }
    },

    // ========== LIKE/SHARE METHODS ==========
    
    async toggleLike(post) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}community/api/posts/like/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              post_id: post.id,
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          post.isLiked = data.data.action === 'liked';
          post.like_count = data.data.like_count;

          if (this.selectedPostDetail && this.selectedPostDetail.id === post.id) {
            this.selectedPostDetail.isLiked = post.isLiked;
            this.selectedPostDetail.like_count = post.like_count;
          }

          this.$message.success(`Post ${data.data.action}!`);
        }
      } catch (error) {
        console.error('Failed to toggle like:', error);
        this.$message.error('Failed to update like');
      }
    },

    async sharePost(post) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}community/api/posts/share/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              post_id: post.id,
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          post.share_count = data.data.share_count;

          if (this.selectedPostDetail && this.selectedPostDetail.id === post.id) {
            this.selectedPostDetail.share_count = post.share_count;
          }

          this.$message.success('Post shared successfully!');
          const shareUrl = `${window.location.origin}/community/post/${post.id}`;
          navigator.clipboard.writeText(shareUrl);
          this.$message.info('Post link copied to clipboard!');
        }
      } catch (error) {
        console.error('Failed to share post:', error);
        this.$message.error('Failed to share post');
      }
    },

    // ========== POST EDIT/DELETE METHODS ==========
    
    editPost(post) {
      this.editingPost = post;
      this.editForm = {
        post_image: post.post_image,
        title: post.title,
        tags: post.tags || [],
      };
      this.editModalVisible = true;
    },

    async updatePost() {
      if (!this.editForm.title.trim()) {
        this.$message.error('Title is required');
        return;
      }

      this.updating = true;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/business-community-posts/posts/`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              post_id: this.editingPost.id,
              title: this.editForm.title,
              tags: this.editForm.tags,
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          const postIndex = this.community_posted_designes.data.findIndex(
            (p) => p.id === this.editingPost.id
          );
          if (postIndex !== -1) {
            this.community_posted_designes.data[postIndex].title = data.data.title;
            this.community_posted_designes.data[postIndex].tags = data.data.tags;
          }

          if (this.selectedPostDetail && this.selectedPostDetail.id === this.editingPost.id) {
            this.selectedPostDetail.title = data.data.title;
            this.selectedPostDetail.tags = data.data.tags;
          }

          this.editModalVisible = false;
          this.$message.success('Post updated successfully!');
        }
      } catch (error) {
        console.error('Failed to update post:', error);
        this.$message.error('Failed to update post');
      } finally {
        this.updating = false;
      }
    },

    confirmDelete(post) {
      this.$confirm({
        title: 'Delete Post',
        content: 'Are you sure you want to delete this post?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          this.selectedPostDetail = post;
          await this.confirmDeletePost();
        },
      });
    },

    async confirmDeletePost() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/business-community-posts/posts/`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post_id: this.selectedPostDetail.id }),
          }
        );
        const data = await response.json();
        if (data.success) {
          this.$message.success('Post deleted successfully');
          this.closePostDetail();
          this.fetchCommunityDesignes();
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        this.$message.error('Failed to delete post');
      }
    },

    openCommentsModal(post) {
      this.showPostDetail(post);
    },

    // ========== DESIGN DETAIL METHODS ==========
    
    async showDesignDetail(design) {
      this.selectedDesignDetail = design;
      this.isEditingDesign = false;
      await this.loadDesignProducts(design.id);
    },

    closeDesignDetail() {
      this.selectedDesignDetail = null;
      this.designProducts = [];
      this.isEditingDesign = false;
      this.designEditForm = {
        id: null,
        image: '',
        description: '',
        room_type: '',
        room_design_type: '',
      };
    },

    /**
     * Check if design can be posted (has all required fields)
     */
    canPostDesign() {
      return this.selectedDesignDetail && 
             this.selectedDesignDetail.room_type && 
             this.selectedDesignDetail.room_design_type && 
             (this.selectedDesignDetail.description || this.selectedDesignDetail.room_description);
    },

    async loadDesignProducts(designId) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/business-community-posts/business-designes-apis/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'design_details',
              design_id: designId,
            }),
          }
        );
        const data = await response.json();
        if (data.data && data.data.products_used) {
          this.designProducts = data.data.products_used || [];
        }
      } catch (error) {
        console.error('Error loading design products:', error);
      }
    },

    async handleDeleteDesignConfirm() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/business-community-posts/business-designes-apis/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'delete_specific_design',
              design_id: this.selectedDesignDetail.id,
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          this.$message.success('Design deleted successfully');
          this.closeDesignDetail();
          this.fetchBusinessDesignes();
        }
      } catch (error) {
        console.error('Error deleting design:', error);
        this.$message.error('Failed to delete design');
      }
    },

    async handlePostDesign(design) {
      this.$message.loading({
        content: 'Posting design to community...',
        duration: 2,
      });
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/business-community-posts/staff-publish-community-post/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              room_id: design.id,
              title: design.room_type,
              content: design.description || design.room_description || '',
              tag_ids: [],
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          this.$message.success('Design posted to community successfully');
          this.closeDesignDetail();
          this.fetchBusinessDesignes();
          this.fetchCommunityDesignes();
        }
      } catch (error) {
        console.error('Error posting design:', error);
        this.$message.error('Failed to post design');
      }
    },

    handleDeleteDesign(design) {
      this.$confirm({
        title: 'Delete Design',
        content: 'Are you sure you want to delete this design?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          this.selectedDesignDetail = design;
          await this.handleDeleteDesignConfirm();
        },
      });
    },

    // ========== FETCH METHODS ==========
    
    async fetchBusinessDesignes() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/business-community-posts/business-designes-apis/`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const responseData = await response.json();
        this.business_designes = responseData;
      } catch (error) {
        console.error('Error fetching business designs:', error);
        this.$message.error('Failed to load business designs');
      }
    },

    async fetchCommunityDesignes() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}access-engine/api/business-community-posts/business-posts/`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const responseData = await response.json();
        this.community_posted_designes = responseData;
      } catch (error) {
        console.error('Error fetching community designs:', error);
        this.$message.error('Failed to load community posts');
      }
    },

    async loadTags() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${this.$store.state.root_api}community/api/tags/`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
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
        console.error('Failed to load tags:', error);
      }
    },

    // ========== UTILITY METHODS ==========
    
    formatNumber(num) {
      if (!num || num === 0) return '0';
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays} days ago`;
      if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString();
    },

    truncateText(text, length) {
      if (!text || text.length <= length) return text;
      return text.substring(0, length) + '...';
    },
  },
};
</script>


<style scoped>
.post-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0px;
  border-radius: 12px;
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

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
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 16px;
  transition: background-color 0.2s ease;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.stat-item:hover {
  background-color: #f5f5f5;
}

.stat-item span {
  font-size: 12px;
  font-weight: 500;
}

.engagement-stat {
  flex: 1;
  min-width: 100px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}

/* Comments Section Styles */
.comments-section {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  min-height: 300px;
  max-height: 700px;
  overflow-y: auto;
}

.comments-list {
  margin-bottom: 16px;
}

.comment-item {
  display: flex;
  margin-bottom: 16px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #1890ff;
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
  font-size: 13px;
  color: #595959;
  line-height: 1.5;
  margin: 0;
  word-break: break-word;
}

.replies-section {
  margin-top: 12px;
  padding-left: 16px;
  border-left: 2px solid #e9ecef;
}

.reply-item {
  display: flex;
  margin-bottom: 12px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 6px;
}

.reply-content {
  flex: 1;
}

.reply-author {
  font-weight: 600;
  font-size: 12px;
  color: #262626;
}

.reply-date {
  font-size: 11px;
  color: #8c8c8c;
  margin-left: 8px;
}

.reply-text {
  font-size: 12px;
  color: #595959;
  margin: 4px 0 0 0;
  word-break: break-word;
}

.add-comment {
  padding: 12px;
  background: white;
  border-radius: 8px;
  border-top: 1px solid #e9ecef;
  margin-top: 12px;
}

/* Products Section */
.product {
  padding: 5px;
  border-radius: 8px;
  background: white;
  border: 1px solid #f0f0f0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  height: 180px;
  border-radius:5px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product:hover .product-image {
  transform: scale(1.05);
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
  width: 33.333%;
  flex: 0 0 33.333%;
}

@media (max-width: 1200px) {
  .product-responsive {
    width: 50%;
    flex: 0 0 50%;
  }
}

@media (max-width: 768px) {
  .product-responsive {
    width: 100%;
    flex: 0 0 100%;
  }

  .comments-section {
    max-height: 500px;
  }
}

.ant-tag {
  font-size: 11px !important;
  padding: 2px 8px !important;
  border-radius: 12px !important;
  border: none !important;
  font-weight: 500 !important;
}

/* Custom scrollbar */
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
</style>