<template>
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
                      style="
                        width: 100%;
                        height: 200px;
                        object-fit: cover;
                        border-radius: 10px;
                        padding: 5px;
                      "
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
                    <!-- User Info & Actions -->
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
                          <div class="stat-item">
                            <HeartOutlined />
                            <span>{{ formatNumber(post.like_count) }}</span>
                          </div>
                          <div class="stat-item">
                            <MessageOutlined />
                            <span>{{ formatNumber(post.comment_count) }}</span>
                          </div>
                          <div class="stat-item">
                            <ShareAltOutlined />
                            <span>{{ formatNumber(post.share_count) }}</span>
                          </div>
                        </div>
                        <!-- Dropdown Menu -->
                        <a-dropdown :trigger="['click']" placement="bottomRight">
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
                        </a-dropdown>
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
              <a-button @click="editPost(selectedPostDetail)" type="default" style="margin-right: 8px">
                <EditOutlined /> Edit
              </a-button>
              <a-popconfirm
                title="Delete Post"
                description="Are you sure you want to delete this post?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="confirmDeletePost"
              >
                <a-button type="text" danger>
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

          <!-- Post Title and Description -->
          <div style="margin-bottom: 24px">
            <h2 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 600">
              {{ selectedPostDetail.title }}
            </h2>
            <!-- <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0">
              {{ selectedPostDetail.content || 'No description provided' }}
            </p> -->
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
              style="
                flex: 1;
                min-width: 100px;
                padding: 16px;
                background: #f8f9fa;
                border-radius: 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
              "
              @mouseenter="(e) => (e.currentTarget.style.background = '#e6f7ff')"
              @mouseleave="(e) => (e.currentTarget.style.background = '#f8f9fa')"
            >
              <EyeOutlined style="font-size: 24px; color: #1890ff; display: block; margin-bottom: 8px" />
              <p style="font-weight: 600; font-size: 18px; margin: 0">
                {{ formatNumber(selectedPostDetail.view_count) }}
              </p>
              <p style="font-size: 12px; color: #666; margin: 0">Views</p>
            </div>

            <div
              style="
                flex: 1;
                min-width: 100px;
                padding: 16px;
                background: #f8f9fa;
                border-radius: 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
              "
              @mouseenter="(e) => (e.currentTarget.style.background = '#fff1f0')"
              @mouseleave="(e) => (e.currentTarget.style.background = '#f8f9fa')"
            >
              <HeartOutlined style="font-size: 24px; color: #ff4d4f; display: block; margin-bottom: 8px" />
              <p style="font-weight: 600; font-size: 18px; margin: 0">
                {{ formatNumber(selectedPostDetail.like_count) }}
              </p>
              <p style="font-size: 12px; color: #666; margin: 0">Likes</p>
            </div>

            <div
              style="
                flex: 1;
                min-width: 100px;
                padding: 16px;
                background: #f8f9fa;
                border-radius: 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
              "
              @mouseenter="(e) => (e.currentTarget.style.background = '#fffbe6')"
              @mouseleave="(e) => (e.currentTarget.style.background = '#f8f9fa')"
            >
              <MessageOutlined style="font-size: 24px; color: #faad14; display: block; margin-bottom: 8px" />
              <p style="font-weight: 600; font-size: 18px; margin: 0">
                {{ formatNumber(selectedPostDetail.comment_count) }}
              </p>
              <p style="font-size: 12px; color: #666; margin: 0">Comments</p>
            </div>

            <div
              style="
                flex: 1;
                min-width: 100px;
                padding: 16px;
                background: #f8f9fa;
                border-radius: 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
              "
              @mouseenter="(e) => (e.currentTarget.style.background = '#f6ffed')"
              @mouseleave="(e) => (e.currentTarget.style.background = '#f8f9fa')"
            >
              <ShareAltOutlined style="font-size: 24px; color: #52c41a; display: block; margin-bottom: 8px" />
              <p style="font-weight: 600; font-size: 18px; margin: 0">
                {{ formatNumber(selectedPostDetail.share_count) }}
              </p>
              <p style="font-size: 12px; color: #666; margin: 0">Shares</p>
            </div>
          </div>

          <!-- Products Used Section -->
          <div>
            <h3 style="margin-bottom: 16px; font-size: 20px; font-weight: 600">Products Used to Create Room</h3>
            <a-empty v-if="!postsProducts || postsProducts.length === 0" description="No products available" style="padding: 40px 0" />
            <a-row v-else :gutter="[16, 16]">
              <a-col
                v-for="product in postsProducts"
                :key="product.product_id"
                :lg="8"
                :md="12"
                :xs="24"
                class="product-responsive"
              >
                <div class="product">
                  <div class="product-image-container">
                    <img
                      :src="$store.state.root_media_api + product.product_image"
                      :alt="product.product_title"
                      class="product-image"
                    />
                    <div class="category-badge">{{ product.category_name }}</div>
                    <div class="ar-badge">AR</div>
                  </div>

                  <div style="padding: 12px">
                    <p style="font-weight: 600; margin: 0 0 8px 0; font-size: 14px">
                      {{ product.product_title }}
                    </p>

                    <!-- Colors -->
                    <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 6px">
                      <span style="font-size: 12px; color: #666">Colors:</span>
                      <div style="display: flex; gap: 4px">
                        <div
                          v-for="(color, idx) in product.product_colors.slice(0, 2)"
                          :key="idx"
                          style="
                            width: 18px;
                            height: 18px;
                            border-radius: 50%;
                            border: 1px solid #ddd;
                          "
                          :style="'background: ' + (color.color_hex || color.color)"
                        />
                        <span v-if="product.product_colors.length > 2" style="font-size: 12px; color: #999">
                          +{{ product.product_colors.length - 2 }}
                        </span>
                      </div>
                    </div>

                    <!-- Price and Button -->
                    <a-row :gutter="8">
                      <a-col :span="12">
                        <p style="font-weight: 600; color: #1890ff; font-size: 16px; margin: 0">
                          ${{ product.product_price }}
                        </p>
                      </a-col>
                      <a-col :span="12">
                        <a-button type="primary" size="small" block>
                          Details
                        </a-button>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>

        <!-- Right Side - Comments (Empty for now) -->
        <a-col :lg="8" :md="24" :xs="24">
          {{selectedPostDetail.comment_count  }}
          <div style="padding: 16px; background: #f8f9fa; border-radius: 8px">
            <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600">
              Comments ({{ selectedPostDetail.comment_count }})
            </h4>
            
                <div v-if="!comments.length" style="display: flex;justify-content: center;align-items: center;min-height:300px">
                <div>
                    <a-empty description="No Comments Available"></a-empty>
                    
                </div>
            </div>

            <!-- Comments List -->
            <div class="comments-list" v-else>
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="comment-item"
              >
                <a-avatar
                  :size="32"
                  style="border: 1px solid rgb(0, 0, 0, 0.1); margin-right: 8px"
                  :src="
                    this.$store.state.root_media_api +
                    comment.comment_owner.user_profile
                  "
                >
                  <!-- {{ comment.comment_owner?.username?.charAt(0).toUpperCase() || 'U' }} -->
                  <!-- {{ comment.comment_owner?.username?.charAt(0).toUpperCase()}} -->
                </a-avatar>

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
                        style="background-color: #52c41a; margin-right: 6px"
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
                    <a-button
                      v-if="comment.reply_count > comment.replies.length"
                      type="link"
                      size="small"
                      @click="loadMoreReplies(comment)"
                    >
                      View
                      {{ comment.reply_count - comment.replies.length }} more
                      replies
                    </a-button>
                  </div>
                </div>
              </div>

              <!-- Load More Comments -->
              <div
                v-if="hasMoreComments"
                style="text-align: center; margin-top: 16px"
              >
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
            <div class="add-comment">
              <a-row>
                <a-col :span="24">
                  <a-space>
                    <a-textarea
                      v-model:value="newComment"
                      placeholder="Add a comment..."
                      :rows="2"
                      :cols="100"
                      style="height: 40px; margin-bottom: 8px"
                    />
                    <a-button
                      type="primary"
                      size="medium"
                      shapr="circle"
                      @click="addComment"
                      :loading="addingComment"
                      :disabled="!newComment.trim()"
                    >
                      <svg
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
                  </a-space>
                </a-col>
              </a-row>
            </div>
            
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- ========== DESIGN DETAIL VIEW ========== -->
    <div v-if="selectedDesignDetail && !selectedPostDetail">
      <a-row :gutter="24">
        <!-- Header with Back Button -->
        <a-col :span="24">
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
            <a-button @click="closeDesignDetail" type="text" size="large">
              <ArrowLeftOutlined style="margin-right: 8px" />
              <b>Back</b>
            </a-button>
            <div>
              <a-button @click="handlePostDesign(selectedDesignDetail)" type="primary" style="margin-right: 8px">
                <UploadOutlined /> Post to Community
              </a-button>
              <a-popconfirm
                title="Delete Design"
                description="Are you sure you want to delete this design?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="handleDeleteDesignConfirm"
              >
                <a-button type="text" danger>
                  <DeleteOutlined /> Delete
                </a-button>
              </a-popconfirm>
            </div>
          </div>
        </a-col>

        <!-- Left Side - Design Image -->
        <a-col :lg="14" :md="24" :xs="24">
          <div style="margin-bottom: 20px">
            <img
              :src="$store.state.root_media_api + selectedDesignDetail.image"
              :alt="selectedDesignDetail.room_type"
              style="width: 100%; border-radius: 12px; max-height: 500px; object-fit: cover"
            />
          </div>

          <!-- Design Description -->
          <div style="margin-bottom: 20px">
            <!-- {{ selectedDesignDetail }} -->
            <h2 style="margin: 0 0 12px 0">{{ selectedDesignDetail.room_type }} - {{ selectedDesignDetail.room_design_type }}</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6">
              {{ selectedDesignDetail.description || 'No description available' }}
            </p>
          </div>

          <!-- Design Info -->
          <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; margin-bottom: 20px">
            <div style="font-size: 14px; color: #666">
              <p>
                <strong>Room Type:</strong> {{ selectedDesignDetail.room_type }}
              </p>
              <p>
                <strong>Design Style:</strong> {{ selectedDesignDetail.room_design_type }}
              </p>
              <p>
                <strong>Created:</strong> {{ formatDate(selectedDesignDetail.created_at) }}
              </p>
              <p v-if="selectedDesignDetail.updated_at !== selectedDesignDetail.created_at">
                <strong>Updated:</strong> {{ formatDate(selectedDesignDetail.updated_at) }}
              </p>
            </div>
          </div>
        </a-col>

        <!-- Right Side - Products Used in Design -->
        <a-col :lg="10" :md="24" :xs="24">
          <h3 style="margin-bottom: 16px">Products Used in Design</h3>
          <a-empty v-if="!designProducts || designProducts.length === 0" description="No products available" />
          <a-row v-else :gutter="[12, 12]">
            <a-col :span="24" v-for="product in designProducts" :key="product.product_id" style="padding: 12px; border: 1px solid #f0f0f0; border-radius: 8px">
              <a-row :gutter="12">
                <a-col :span="6">
                  <img :src="$store.state.root_media_api + product.product_image" style="width: 100%; border-radius: 8px; object-fit: cover" />
                </a-col>
                <a-col :span="18">
                  <p style="font-weight: 600; margin: 0 0 4px 0">{{ product.product_title }}</p>
                  <p style="font-size: 12px; color: #666; margin: 0 0 4px 0">{{ product.category_name }}</p>
                  <div style="display: flex; gap: 4px; margin-bottom: 4px">
                    <div
                      v-for="(color, idx) in product.product_colors.slice(0, 3)"
                      :key="idx"
                      style="
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        border: 1px solid #ddd;
                      "
                      :style="'background: ' + (color.color_hex || color.color)"
                    />
                  </div>
                  <p style="font-weight: 600; color: #1890ff; margin: 0">${{ product.product_price }}</p>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  MoreOutlined,
  ArrowLeftOutlined,
  PushpinOutlined,
} from '@ant-design/icons-vue';

export default {
  name: 'manage-site-community-post',
  components: {
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
    EyeOutlined,
    HeartOutlined,
    MessageOutlined,
    ShareAltOutlined,
    MoreOutlined,
    ArrowLeftOutlined,
    PushpinOutlined,
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
    };
  },
  mounted() {
    this.fetchBusinessDesignes();
    this.fetchCommunityDesignes();
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


















    

    // POST DETAIL METHODS
    async showPostDetail(post) {
      this.selectedPostDetail = post;
      await this.loadPostProducts(post.id);
    },
    closePostDetail() {
      this.selectedPostDetail = null;
      this.postsProducts = [];
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

    // DESIGN DETAIL METHODS
    async showDesignDetail(design) {
      this.selectedDesignDetail = design;
      await this.loadDesignProducts(design.id);
    },
    closeDesignDetail() {
      this.selectedDesignDetail = null;
      this.designProducts = [];
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
    async handleDeleteDesign(design) {
      this.$confirm({
        title: 'Delete Design',
        content: 'Are you sure you want to delete this design?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          await this.handleDeleteDesignConfirm();
        },
      });
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
          `${this.$store.state.root_api}access-engine/api/business-community-posts/posts/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              room_id: design.id,
              title: design.room_type,
              content: design.description || '',
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

    // UTILITY METHODS
    editPost(post) {
      this.$message.info('Edit functionality - implement as needed');
    },
    sharePost(post) {
      this.$message.info('Post link copied to clipboard');
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

    formatNumber(num) {
      if (!num || num === 0) return '0';
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

.product {
  padding: 0;
  margin-bottom: 16px;
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
}

.ant-tag {
  font-size: 11px !important;
  padding: 2px 8px !important;
  border-radius: 12px !important;
  border: none !important;
  font-weight: 500 !important;
}
</style>