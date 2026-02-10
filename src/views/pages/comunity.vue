<template>
  <div class="design-page">
    <!-- Header Section with Blue Background -->
    <div class="blue-section">
      <div class="hero-content hidden lg:block lg:-translate-y-16">
        <h1 class="hero-title">
          Discover the world's top<br />interior design inspiration
        </h1>
        <p class="hero-subtitle">
          Explore the work of the most talented designers to inspire your work.
        </p>
      </div>
      <div
        class="lg:hidden block max-w-[1200px] sm:translate-x-10 md:translate-x-40 md:-translate-y-24 text-center relative z-10"
      >
        <h1
          class="text-white text-2xl md:text-3xl font-semibold leading-tight mb-5 drop-shadow-md z-10"
        >
          Discover the world's top<br />interior design inspiration
        </h1>
        <p
          class="text-white/90 text-lg md:text-xl font-normal max-w-[500px] mx-auto relative z-10"
        >
          Explore the work of the most talented designers to inspire your work.
        </p>
      </div>

      <!-- Hero Images -->
      <div class="hero-images hidden sm:block">
  
  <!-- LEFT IMAGE -->
  <div class="image-card image-left sm:translate-y-60 relative" style="overflow:hidden;">
    
    <!-- Skeleton -->
    <div
      v-if="!imageLoadedMap['hero_left']"
      class="hero-skeleton"
    ></div>

    <!-- Preload image -->
    <img
      src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      style="position:absolute;width:0;height:0;opacity:0;"
      @load="onHeroImageLoad('hero_left')"
      alt=""
    />

    <!-- Visible image -->
    <img
      v-show="imageLoadedMap['hero_left']"
      src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      alt="Modern living room"
    />
  </div>

  <!-- RIGHT IMAGE -->
  <div class="image-card image-right -translate-y-10 relative" style="overflow:hidden;">
    
    <!-- Skeleton -->
    <div
      v-if="!imageLoadedMap['hero_right']"
      class="hero-skeleton"
    ></div>

    <!-- Preload image -->
    <img
      src="https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      style="position:absolute;width:0;height:0;opacity:0;"
      @load="onHeroImageLoad('hero_right')"
      alt=""
    />

    <!-- Visible image -->
    <img
      v-show="imageLoadedMap['hero_right']"
      src="https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      alt="Elegant interior"
    />
  </div>

</div>

      <div class="relative">
        <!-- Hero Images -->
        <div class="sm:hidden block">
          <!-- Left Image Card -->
          <div
            class="z-30 translate-y-20 -translate-x-26 rounded-2xl p-1 shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-105"
          >
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Modern living room"
              class="w-[200px] h-[150px] object-cover rounded-xl"
            />
          </div>

          <!-- Right Image Card -->
          <div
            class="translate-x-30 -translate-y-36 z-20 rounded-2xl p-1 shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-105"
          >
            <img
              src="https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Elegant interior"
              class="w-[200px] h-[170px] object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- White Section with Search -->
    <div class="white-section z-100 -translate-y-20 sm:translate-y-0">
      <div class="search-section">
        <div class="search-container relative">
          <!-- Custom Dropdown -->
          <div class="custom-dropdown" @click.stop="toggleDropdown">
            <div class="dropdown-selected">
              <img
                :src="selectedCategoryIcon"
                alt="Interior"
                class="selected-icon"
              />
              <span className="sm:hidden"
                ><svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.53125 0.53125L4.53125 4.53125L8.53125 0.53125"
                    stroke="#1A1A1A"
                    stroke-width="1.5"
                  />
                </svg>
              </span>
              <span class="selected-text text-gray-600">{{
                selectedCategoryText
              }}</span>
              <svg
                class="dropdown-arrow"
                :class="{ 'rotate-180': showDropdown }"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <ul class="dropdown-options" v-show="showDropdown">
              <li
                v-for="category in categoryOptions"
                :key="category.value"
                @click.stop="selectCategory(category)"
                :data-value="category.value"
              >
                {{ category.text }}
              </li>
            </ul>
          </div>

          <!-- <input
            type="text"
            class="search-input"
            placeholder="What are you looking for?"
            v-model="searchQuery"
            @keyup.enter="onSearch"
          /> -->
          <div style="width:100%">

            <input
    type="text"
     class="search-input"
     style="width:100%"
    placeholder="What are you looking for?"
    v-model="searchQuery"
    @focus="onInputFocus"
    @input="onInputChange"
    @keydown.enter.prevent="onSearch"
  />
   <div
  v-if="showTagDropdown && tagResults.length"
  style="border:1px solid rgba(0,0,0,0.2); border-top:none;border-radius:0 0  10px 10px;position:relative"
>
  <ul>
    <li v-if="tagLoading" class="px-4 py-2 text-sm text-gray-400">
  Searching tags…
</li>
    <li
      v-for="tag in tagResults"
      :key="tag.id"
      class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
      @click="goToTag(tag.name)"
      style="padding:10px"
    >
      <span class="font-medium text-gray-800">
        #{{ tag.name }}
      </span>
      <span class="text-xs text-gray-500">
        {{ tag.post_count }} posts
      </span>
    </li>
  </ul>

  <!-- VIEW MORE -->
  <div
    v-if="tagHasNext"
    class="px-4 py-2 text-center border-t cursor-pointer text-blue-600 text-sm hover:bg-gray-50"
    @click="loadMoreTags"
  >
    View more
  </div>
</div>
          </div>

          <a-button type="primary" style="width:100%;max-width:100px" @click="onSearch">Search</a-button>


          
<!-- {{ tagResults }} -->

        

        </div>
      
       




</div>
      

      <!-- Trending Section -->
      <div class="trending-section">
        <h3
          class="!font-space !font-normal !text-[18px] text-gray-800 !leading-none !tracking-[0] text-center"
        >
          Trending searches
        </h3>

        <div
          class="trending-tags text-gray-700 flex flex-wrap gap-2 justify-center mt-3"
        >
          <!-- Button 1 -->
          <button @click="this.$router.push('/comunity-posts/modern-interior')"
            class="bg-[#F2F2F2] !px-4 !py-1 rounded-md text-[12px] font-[400] leading-[100%] text-center font-space cursor-pointer"
          >
            Modern Interior
          </button>

          <!-- Button 2 -->
          <button @click="this.$router.push('/comunity-posts/modern-interior')"
            class="bg-[#F2F2F2] !px-4 !py-1 rounded-md text-[12px] font-[400] leading-[100%] text-center font-space  cursor-pointer"
          >
            Kitchen setup
          </button>

          <!-- Button 3 -->
          <button @click="this.$router.push('/comunity-posts/bedroom')"
            class="bg-[#F2F2F2] !px-4 !py-1 rounded-md text-[12px] font-[400] leading-[100%] text-center font-space  cursor-pointer"
          >
            Bedroom kids
          </button>

          <!-- Button 4 -->
          <button @click="this.$router.push('/comunity-posts/dining-room')"
            class="bg-[#F2F2F2] !px-4 !py-1 rounded-md text-[12px] font-[400] leading-[100%] text-center font-space  cursor-pointer"
          >
            Dining room elegant
          </button>

          <!-- Button 5 -->
          <button @click="this.$router.push('/comunity-posts/ccandinavian')"
            class="bg-[#F2F2F2] !px-4 !py-1 rounded-md text-[12px] font-[400] leading-[100%] text-center font-space  cursor-pointer"
          >
            Scandinavian
          </button>
        </div>
      </div>
    </div>

    <!-- <div className="bg-[#F2F2F2] !py-6">
      
       <div class="flex flex-row overflow-x-auto !p-4 no-scrollbar  gap-6">
        <DesignCard
          image="https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg"
          avatar="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg"
          :tags="['Living Room', 'Modern']"
          name="John Doe"
          :likes="15000"
          width="350px"
          height="270px"
        />
    
        <DesignCard
          image="https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg"
          avatar="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg"
          :tags="['Kitchen', 'Modern']"
          name="Alice"
          :likes="8200"
          width="350px"
          height="270px"
        />
    
        <DesignCard
          image="https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg"
          avatar="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg"
          :tags="['Kitchen', 'Modern']"
          name="Alice"
          :likes="8200"
          height="270px"
        />
    
        <DesignCard
          image="https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg"
          avatar="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg"
          :tags="['Kitchen', 'Modern']"
          :views="98"
          name="Alice"
          :likes="8200"
          width="350px"
          height="270px"
        />
    
        <DesignCard
          image="https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg"
          avatar="https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg"
          :tags="['Kitchen', 'Modern']"
          :views="98"
          name="Alice"
          :likes="8200"
          width="350px"
          height="270px"
        />
      </div> 
    </div> -->

    <div class="w-full mx-auto px-4">
      <!-- ==================== SECTION 1 ==================== -->
      <!-- <h1 class="text-4xl font-semibold text-center !py-10">Community</h1> -->

      <!-- Tabs -->
      <!-- <div class="flex gap-6 justify-center pb-8">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="changeTab(tab)"
          class="tab-text tab-btn"
          :class="activeTab === tab ? 'tab-active' : 'tab-inactive'"
        >
          {{ tab }}
        </button>
    </div> -->

      <!-- Desktop Grid -->
      <!-- <div class="grid grid-cols-4 sm:grid-cols-4 !pt-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 hidden sm:grid place-items-center !px-4 gap-x-10 gap-6 community-section">
      <DesignCard
        v-for="(card, index) in paginatedCards"
        :key="`card-${page}-${index}`"
        :image="card.image"
        :avatar="card.avatar"
        :tags="card.tags"
        :views="card.views"
        :name="card.name"
        :likes="card.likes"
        :comments="card.comments"
        width="328px"
        height="270px"
        @click.stop="openCommentsModal(card)"
        
      />
    </div> -->

      <!-- Mobile Grid -->
      <!-- <div class="grid grid-cols-2 gap-8 sm:grid-cols-2 !pt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:hidden block place-items-center !px-4 gap-x-10 gap-6 community-section">
      <DesignCard
        v-for="(card, index) in paginatedCards"
        :key="`card-${page}-${index}`"
        :image="card.image"
        :avatar="card.avatar"
        :tags="card.tags"
        :views="card.views"
        :name="card.name"
        :likes="card.likes"
        :comments="card.comments"
        width="178px"
        height="190px"
        imageWidth="178px"
        imageHeight="145px"
        @click.stop="openCommentsModal(card)"
      />
    </div> -->

      <!-- Today's Top Designs Section -->
      <div className="bg-[#F2F2F2] !py-6">
        <span
          class="!font-proza !font-semibold !text-[32px] leading-[40px] tracking-tight text-center text-gray-900 block"
        >
          Today's Top Designs
        </span>

        <div
          class="flex flex-row overflow-x-auto !p-4 no-scrollbar gap-6"
          v-if="topDesigns.length > 0"
        >
          <DesignCard
            v-for="(post, index) in topDesigns"
            :key="`top-${post.id}`"
            :image="getPostImage(post)"
            :avatar="getUserAvatar(post)"
            :tags="getPostTags(post)"
            :name="post.post_owner.username"
            :likes="post.like_count"
            :views="post.view_count"
            :comments="post.comment_count"
            :is_liked="post.is_liked"
            width="328px"
            height="270px"
            @click.stop="openCommentsModal(post)"
          />
        </div>
      </div>

      <!-- Community Section -->
      <div class="w-full mx-auto px-4">
        <h1 class="!text-[28px] sm:!text-4xl font-semibold !text-gray-700 text-center !py-10">
          Community
        </h1>

        <!-- Tabs -->
        <div class="flex gap-6 !text-gray-700 justify-center pb-8">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            @click="changeTab(tab)"
            class="tab-text tab-btn pb-2 border-b-2 transition-all duration-300"
            :class="
              activeTab === tab
                ? 'tab-active border-blue-600'
                : 'tab-inactive border-transparent'
            "
          >
            {{ tab }}
          </button>
        </div>

        <!-- Desktop Grid -->
        <div
          class="grid grid-cols-4 sm:grid-cols-4 !pt-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 hidden sm:grid place-items-center !px-4 gap-x-10 gap-6 community-section"
          v-if="apiData.length > 0"
        >
          <DesignCard
            v-for="(post, index) in paginatedCards"
            :key="`card-${page}-${post.id}`"
            :image="getPostImage(post)"
            :avatar="getUserAvatar(post)"
            :tags="getPostTags(post)"
            :views="post.view_count"
            :name="post.post_owner.username"
            :likes="post.like_count"
            :comments="post.comment_count"
            :is_liked="post.is_liked"
            :id="post.id"
            width="328px"
            height="270px"
            @click.stop="openCommentsModal(post)"
          />
        </div>

        <!-- Mobile Grid -->
        <div
          class="grid grid-cols-2 gap-6 sm:grid-cols-2 !pt-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:hidden block place-items-center !px-6 gap-x-10 gap-6 community-section"
          v-if="apiData.length > 0"
        >
          <DesignCard
            v-for="(post, index) in paginatedCards"
            :key="`card-${page}-${post.id}`"
            :image="getPostImage(post)"
            :avatar="getUserAvatar(post)"
            :tags="getPostTags(post)"
            :views="post.view_count"
            :name="post.post_owner.username"
            :likes="post.like_count"
            :comments="post.comment_count"
            width="178px"
            height="190px"
            imageWidth="178px"
            imageHeight="145px"
            @click.stop="openCommentsModal(post)"
          />
        </div>

        <!-- Loading State -->
        <!-- <div v-if="loading" class="text-center !py-12">
    <div class="loading-spinner"></div>
    <p class="text-gray-500 mt-4">Loading posts...</p>
  </div> -->

        <!-- Empty State -->
        <div v-if="!loading && apiData.length === 0" class="text-center !py-12">
          <p class="text-gray-500">No posts found.</p>
        </div>
      </div>

      <!-- Comments Modal -->
      <CommentsModal
        :isOpen="showCommentsModal"
        :post="selectedPost"
        @close="showCommentsModal = false"
        @commentAdded="onCommentAddedOrLiked"
        @likeToggled="onCommentAddedOrLiked"
      />
      <!-- Empty State -->
      <div v-if="paginatedCards.length === 0" class="text-center !py-12">
        <p class="text-gray-500">No designs found for this category.</p>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center gap-3 !py-10">
        <!-- Previous Button -->
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          :class="
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          "
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="15" cy="15" r="15" fill="#F2F2F2" />
            <path
              d="M18 8.4541L11 14.9999L18 21.5456"
              stroke="#666666"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <!-- {{pageNumbers}} -->
        <!-- Page Numbers -->
        <button
          v-for="n in pageNumbers"
          :key="n"
          class="w-8 h-8 rounded-full flex items-center justify-center"
          :class="currentPage === n ? 'bg-blue-600 !text-white' : 'border'"
          @click="goToPage(n)"
        >
          {{ n }}
        </button>

        <!-- Next Button -->
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          :class="
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          "
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="15"
              cy="15"
              r="15"
              transform="matrix(-1 0 0 1 30 0)"
              fill="#F2F2F2"
            />
            <path
              d="M12 8.4541L19 14.9999L12 21.5456"
              stroke="#666666"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <!-- Page Info -->
      <div class="text-center text-gray-600 text-sm !pb-2">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} -
        {{ Math.min(currentPage * itemsPerPage, totalCount) }} of
        {{ totalCount }} designs
      </div>

      <!-- Tap and Get credit -->
      <div class="flex justify-center">
        <button
          class="bg-[#3B63FB] !text-white !px-8 !py-2 rounded-xl font-medium shadow flex items-center gap-2"
        >
          <!-- SVG Icon -->
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.5013 1.41699C4.58918 1.41699 1.41797 4.5882 1.41797 8.50033C1.41797 12.4124 4.58918 15.5837 8.5013 15.5837C12.4134 15.5837 15.5846 12.4124 15.5846 8.50033C15.5846 4.5882 12.4134 1.41699 8.5013 1.41699ZM8.5013 2.12533C8.5013 3.81608 7.82965 5.43759 6.63411 6.63313C5.43856 7.82868 3.81706 8.50033 2.1263 8.50033C3.81706 8.50033 5.43856 9.17198 6.63411 10.3675C7.82965 11.5631 8.5013 13.1846 8.5013 14.8753C8.5013 13.1846 9.17295 11.5631 10.3685 10.3675C11.564 9.17198 13.1855 8.50033 14.8763 8.50033C13.1855 8.50033 11.564 7.82868 10.3685 6.63313C9.17295 5.43759 8.5013 3.81608 8.5013 2.12533Z"
              fill="white"
            />
          </svg>

          <!-- Text -->
          <span>Tap and Get credit</span>
        </button>
      </div>
    </div>

    <div style="max-width: 100%; margin: auto">
      <div
        style="
          padding: 40px 10px;
          text-align: center;
          overflow: hidden;
          position: relative;
        "
      >
        <h1
          class="!font-proza-libre !font-semibold !text-[28px] sm:!text-[38px] text-black !leading-none !tracking-[-0.02em] !text-center !mb-10"
        >
          Our Happy Customers
        </h1>
        <swiper
          style="
            margin-top: 20px;
            padding-bottom: 50px;
            overflow: visible;
            cursor: pointer;
          "
          :modules="modules"
          :slides-per-view="slidesPerView"
          :space-between="30"
          :centered-slides="true"
          navigation
          :initial-slide="2"
          :pagination="{ clickable: true }"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
        >
          <swiper-slide
            v-for="(review, index) in reviews"
            :key="index"
            class="!w-auto flex-shrink-0 px-3"
          >
            <div class="p-5 rounded-xl text-left w-full max-w-[280px] mx-auto">
              <div class="flex justify-center flex-col items-center">
                <img
                  :src="review.avatar"
                  alt=""
                  class="w-[80px] h-[80px] !mb-[-40px] z-10 bg-white rounded-full border border-gray-300"
                />

                <div
                  class="border border-black/20 rounded-2xl !pt-10 h-[240px] text-center"
                >
                  <h3 class="m-0 text-[16px] font-semibold text-[#111]">
                    {{ review.name }}
                  </h3>
                  <p class="m-0 text-[13px] text-[#666]">
                    {{ review.role }}
                  </p>

                  <a-rate :value="review.rating"></a-rate>

                  <p
                    class="text-[14px] leading-[1.5] text-[#333] m-0 text-center"
                  >
                    "{{ review.text }}"
                  </p>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>

        <div
          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 200px;
            height: 100%;
            background: linear-gradient(to right, #f3f3f3, transparent);
            z-index: 5;
            pointer-events: none;
          "
        ></div>
        <div
          style="
            position: absolute;
            top: 0;
            right: 0;
            width: 200px;
            height: 100%;
            background: linear-gradient(to left, #f3f3f3, transparent);
            z-index: 5;
            pointer-events: none;
          "
        ></div>
      </div>
    </div>

    <br />
    <div style="text-align: center">
      <h1>Top Businesses</h1>
      <br />
      <a-row>
        <a-col
          :sm="12"
          :xs="12"
          :md="8"
          :lg="6"
          style="padding: 4px"
          v-for="(business, index) in businesses"
          :key="index"
        >
          <div
            style="
              border: 1px solid rgba(0, 0, 0, 0.2);
              border-radius: 10px;
              padding: 10px;
              height: 90px;
              text-align: center;
            "
          >
            <a-row>
              <a-col :span="7">
                <img
                  :src="business.logo"
                  alt=""
                  style="
                    width: 60px;
                    height: 60px;
                    margin-bottom: -40px;
                    background: white;
                    border-radius: 100%;
                    border: 1px solid rgba(0, 0, 0, 0.2);
                  "
                />
              </a-col>
              <a-col :span="17" style="text-align: start; padding-top: 10px">
                <h3>{{ business.name }}</h3>
                <p
                  style="
                    display: flex;
                    justify-content: space-between;
                    font-size: 16px;
                  "
                >
                  Simulations:
                  <span
                    style="color: #3b63fb; font-weight: 700; font-size: 20px"
                    >{{ business.simulations }}</span
                  >
                </p>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </div>
    <br />
    <br />

    <div
      style="
        padding: 40px 10px;
        text-align: center;
        overflow: hidden;
        position: relative;
        background-color: #f3f3f3;
      "
    >
      <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 40px">
        Top Designers
      </h1>

      <swiper
        style="
          margin-top: 20px;
          padding-bottom: 50px;
          overflow: visible;
          cursor: pointer;
        "
        :modules="modules"
        :slides-per-view="designers_slidesPerView"
        :space-between="30"
        :centered-slides="true"
        navigation
        :initial-slide="3"
        :pagination="{ clickable: true }"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide
          v-for="(business, index) in designers"
          :key="index"
          class="!w-auto flex-shrink-0 px-4"
        >
          <div class="flex flex-col items-center">
            <img
              :src="business.logo"
              :alt="business.name"
              class="w-[60px] h-[60px] bg-white mb-2"
            />

            <h4 class="text-center">{{ business.name }}</h4>
          </div>
        </swiper-slide>
      </swiper>

      <div
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 200px;
          height: 100%;
          background: linear-gradient(to right, #f3f3f3, transparent);
          z-index: 5;
          pointer-events: none;
        "
      ></div>
      <div
        style="
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 100%;
          background: linear-gradient(to left, #f3f3f3, transparent);
          z-index: 5;
          pointer-events: none;
        "
      ></div>
    </div>
  </div>
</template>

<script>
import logo1 from "../../assets/business-logos/logo1.png";
import logo2 from "../../assets/business-logos/logo2.png";
import logo3 from "../../assets/business-logos/logo3.png";
import logo4 from "../../assets/business-logos/logo4.png";
import logo5 from "../../assets/business-logos/logo5.png";
import logo6 from "../../assets/business-logos/logo6.png";
import logo7 from "../../assets/business-logos/logo7.png";
import logo8 from "../../assets/business-logos/logo8.png";

import swiper_bg from "@/assets/bg-swiper.jpg";

import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import DesignCard from "@/components/Includes/DesignCard.vue";
import CommentsModal from "./CommentsModal.vue";

export default {
  name: "InteriorDesignCommunityPage",
  components: {
    Swiper,
    SwiperSlide,
    DesignCard,
    CommentsModal,
  },
  data() {
    return {

      searchQuery: "",

    // TAG SEARCH STATE
    tagResults: [],
    tagPage: 1,
    tagPageSize: 8,
    imageLoadedMap: {},
    tagHasNext: false,
    tagLoading: false,
    showTagDropdown: false,

    searchDebounceTimer: null,



      selectedCategory: "",
      selectedCategoryText: "Interior Design",
      selectedCategoryIcon:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80",
      searchQuery: "",
      showDropdown: false,
      showCommentsModal: false, // ADD THIS
      selectedPost: null, // ADD THIS
      categoryOptions: [
        {
          value: "interior",
          text: "Interior Design",
          icon: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80",
        },
        {
          value: "living-room",
          text: "Living Room",
          icon: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80",
        },
        {
          value: "bedroom",
          text: "Bedroom",
          icon: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80",
        },
        {
          value: "kitchen",
          text: "Kitchen",
          icon: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80",
        },
        {
          value: "bathroom",
          text: "Bathroom",
          icon: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80",
        },
      ],

      
      swiper_bg: swiper_bg,
      slidesPerView: window.innerWidth <= 768 ? 1 : 5,
      designers_slidesPerView: window.innerWidth <= 768 ? 3 : 8,
      topDesigns: [],
      trendingTags: [],
      statsLoading: false,
      tabs: ["All Type"],
      activeTab: "All Type",
      currentPage: 1,
      itemsPerPage: 20,
      allCards: [
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Living Room", "Modern"],
          views: 125,
          likes: 15000,
          comments: 1200,
          name: "John Doe",
          category: "Living Room",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice23",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice12",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },

        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
        {
          image:
            "https://kahedu.edu.in/n/wp-content/uploads/2021/07/6-SECRETS-FOR-MASTERING-THE-ART-OF-PUBLIC-SPEAKING-1-990x500.jpg",
          avatar:
            "https://www.svgrepo.com/show/382095/female-avatar-girl-face-woman-user-4.svg",
          tags: ["Kitchen", "Modern"],
          views: 98,
          likes: 8200,
          comments: 540,
          name: "Alice11",
          category: "Kitchen",
        },
      ],

      reviews: [
        {
          name: "Amy Lang",
          role: "Home Stager",
          rating: 4.5,
          text: "Even those who are not design-savvy can easily create realistic and inviting virtually staged spaces that attract potential buyers regularly.",
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s",
        },
        {
          name: "Troy Sinclair",
          role: "Real Estate Photographer",
          rating: 4.5,
          text: "It has taken our real estate marketing to the next level! Our buyers love the virtual staging.",
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s",
        },
        {
          name: "John Doe",
          role: "Interior Designer",
          rating: 4.5,
          text: "This tool made it so easy to stage homes and present them to clients with realistic visuals.",
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s",
        },
        {
          name: "Sarah Lee",
          role: "Realtor",
          rating: 4.5,
          text: "My listings now stand out. Clients are impressed with how professional everything looks.",
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s",
        },
        {
          name: "David Kim",
          role: "Architect",
          rating: 4.5,
          text: "An incredible platform for showcasing designs and spaces realistically.",
          avatar:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s",
        },
      ],
      businesses: [
        {
          id: 1,
          name: "Business name",
          logo: logo1,
          simulations: 65748,
        },
        {
          id: 2,
          name: "Business name",
          logo: logo2,
          simulations: 65748,
        },
        {
          id: 3,
          name: "Business name",
          logo: logo3,
          simulations: 65748,
        },
        {
          id: 4,
          name: "Business name",
          logo: logo4,
          simulations: 65748,
        },
        {
          id: 5,
          name: "Business name",
          logo: logo5,
          simulations: 65748,
        },
        {
          id: 6,
          name: "Business name",
          logo: logo6,
          simulations: 65748,
        },
        {
          id: 7,
          name: "Business name",
          logo: logo7,
          simulations: 65748,
        },
        {
          id: 8,
          name: "Business name",
          logo: logo8,
          simulations: 65748,
        },
      ],

      designers: [
        {
          id: 1,
          name: "Designer Name1",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s",
          simulations: 65748,
        },
        {
          id: 2,
          name: "Designer Name2",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s",
          simulations: 65748,
        },
        {
          id: 3,
          name: "Designer Name3",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s",
          simulations: 65748,
        },
        {
          id: 4,
          name: "Designer Name4",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s",
          simulations: 65748,
        },
        {
          id: 5,
          name: "Designer Name5",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s",
          simulations: 65748,
        },
        {
          id: 6,
          name: "Designer Name6",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s",
          simulations: 65748,
        },
        {
          id: 7,
          name: "Designer Name7",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2haw1278i40sszGwCvy7LKP3j2KqLTnPJg&s",
          simulations: 65748,
        },
      ],
      apiData: [],
      loading: false,
      totalPages: 1,
      totalCount: 0,

      // commentsModalVisible: false,
      // selectedPostForComments: null,
      modalComments: [],
      modalCommentsPage: 1,
      hasMoreModalComments: false,
      loadingModalComments: false,
      addingModalComment: false,
      newModalComment: "",
      postComments: [],
    };
  },
  watch: {
  searchQuery(newVal) {
    if (!newVal || newVal.length < 2) {
      this.resetTagSearch()
      return
    }

    clearTimeout(this.searchDebounceTimer)
    this.searchDebounceTimer = setTimeout(() => {
      this.searchTags(true)
    }, 300)
  }
},
  setup() {
    const onSwiper = (swiper) => {
      console.log(swiper);
    };
    const onSlideChange = () => {
      console.log("slide change");
    };
    return {
      onSwiper,
      onSlideChange,
      modules: [Navigation, Pagination, Scrollbar, A11y, Autoplay],
    };
  },
  computed: {
    // filteredCards() {
    //   if (this.activeTab === "All Type") return this.allCards;
    //   return this.allCards.filter((card) => card.category === this.activeTab);
    // },
    // totalPages() {
    //   return Math.ceil(this.filteredCards.length / this.itemsPerPage);
    // },
    // paginatedCards() {
    //   const start = (this.page - 1) * this.itemsPerPage;
    //   const end = start + this.itemsPerPage;
    //   return this.filteredCards.slice(start, end);
    // },
    // pageNumbers() {
    //   const pages = [];
    //   for (let i = 1; i <= this.totalPages; i++) {
    //     pages.push(i);
    //   }
    //   return pages;
    // }

    totalPages() {
      return Math.ceil(this.filteredCards.length / this.itemsPerPage);
    },

    filteredCards() {
      return this.apiData;
    },
    paginatedCards() {
      return this.apiData;
    },
    pageNumbers() {
      const pages = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(
        1,
        this.currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    resetTagSearch() {
    this.tagResults = []
    this.tagPage = 1
    this.tagHasNext = false
    this.showTagDropdown = false
  },

  async searchTags(reset = false) {
  if (this.tagLoading) return

  if (reset) {
    this.tagPage = 1
    this.tagResults = []
  }

  this.tagLoading = true

  try {
    const response = await fetch(
      `${this.$store.state.root_api}community/api/search-post-tags?q=${encodeURIComponent(this.searchQuery)}&page=${this.tagPage}&page_size=${this.tagPageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const res = await response.json()

    // ✅ payload mapping
    const data = res.data || []

    this.tagResults = reset
      ? data
      : [...this.tagResults, ...data]

    this.tagHasNext = res.pagination?.has_next ?? false
    this.showTagDropdown = true
  } catch (e) {
    console.error("Tag search failed", e)
  } finally {
    this.tagLoading = false
  }
},

 onHeroImageLoad(key) {
    this.imageLoadedMap[key] = false
    setTimeout(() => {
      this.imageLoadedMap[key] = true
    }, 2000)
  },


  loadMoreTags() {
    if (!this.tagHasNext) return
    this.tagPage += 1
    this.searchTags(false)
  },

  goToTag(tagName) {
    this.resetTagSearch()
    this.$router.push(`/comunity-posts/${encodeURIComponent(tagName)}`)
  },
    //     data() {
    //   return {
    //     // ... your existing data properties ...

    //     // Add these for comments modal functionality
    //     commentsModalVisible: false,
    //     selectedPostForComments: null,
    //     modalComments: [],
    //     modalCommentsPage: 1,
    //     hasMoreModalComments: false,
    //     loadingModalComments: false,
    //     addingModalComment: false,
    //     newModalComment: "",
    //     postComments: [] // Keep this for your existing CommentsModal if needed
    //   };
    // },
    // methods: {
    //   // ... your existing methods ...

    //   // Comments Modal Methods - Integrated from provided logic
    //   async openCommentsModal(post) {
    //     this.selectedPostForComments = { ...post };
    //     this.modalComments = [];
    //     this.modalCommentsPage = 1;
    //     this.hasMoreModalComments = false;
    //     this.commentsModalVisible = true;

    //     // Load comments for modal
    //     await this.loadModalComments(post.id);
    //   },

    //   // Close comments modal
    //   closeCommentsModal() {
    //     this.commentsModalVisible = false;
    //     this.selectedPostForComments = null;
    //     this.modalComments = [];
    //     this.newModalComment = "";
    //   },

    //   // Load comments for modal
    //   async loadModalComments(postId, page = 1) {
    //     try {
    //       this.loadingModalComments = true;
    //       const response = await fetch(
    //         `${this.$store.state.root_api}community/api/comments/?post_id=${postId}&page=${page}`,
    //         {
    //           method: "GET",
    //           headers: {
    //             Authorization: `Token ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //           },
    //         }
    //       );

    //       const data = await response.json();
    //       if (data.success) {
    //         if (page === 1) {
    //           this.modalComments = data.data;
    //         } else {
    //           this.modalComments.push(...data.data);
    //         }
    //         this.hasMoreModalComments = page < data.total_pages;
    //         this.modalCommentsPage = page;
    //       }
    //     } catch (error) {
    //       console.error("Failed to load comments:", error);
    //     } finally {
    //       this.loadingModalComments = false;
    //     }
    //   },

    //   // Load more comments in modal
    //   async loadMoreModalComments() {
    //     if (this.selectedPostForComments && this.hasMoreModalComments) {
    //       await this.loadModalComments(
    //         this.selectedPostForComments.id,
    //         this.modalCommentsPage + 1
    //       );
    //     }
    //   },

    //   // Add comment in modal
    //   async addModalComment() {
    //     if (!this.newModalComment.trim() || !this.selectedPostForComments) return;

    //     try {
    //       this.addingModalComment = true;
    //       const response = await fetch(
    //         `${this.$store.state.root_api}community/api/comments/`,
    //         {
    //           method: "POST",
    //           headers: {
    //             Authorization: `Token ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify({
    //             post_id: this.selectedPostForComments.id,
    //             content: this.newModalComment.trim(),
    //           }),
    //         }
    //       );

    //       const data = await response.json();
    //       if (data.success) {
    //         // Clear input
    //         this.newModalComment = "";

    //         // Reload comments
    //         await this.loadModalComments(this.selectedPostForComments.id);

    //         // Update comment count in the main list
    //         this.selectedPostForComments.comment_count += 1;
    //         const postIndex = this.apiData.findIndex(
    //           (p) => p.id === this.selectedPostForComments.id
    //         );
    //         if (postIndex !== -1) {
    //           this.apiData[postIndex].comment_count =
    //             this.selectedPostForComments.comment_count;
    //         }

    //         this.$message.success("Comment added successfully!");
    //       }
    //     } catch (error) {
    //       console.error("Failed to add comment:", error);
    //       this.$message.error("Failed to add comment");
    //     } finally {
    //       this.addingModalComment = false;
    //     }
    //   },

    //   // Update your existing fetchPostComments to use the new structure if needed
    //   async fetchPostComments(postId) {
    //     try {
    //       const response = await fetch(`http://localhost:8000/community/api/comments/?post_id=${postId}`, {
    //         method: 'GET',
    //         headers: {
    //           'Authorization': `Token ${localStorage.getItem("token")}`,
    //           'Content-Type': 'application/json',
    //         },
    //       });

    //       if (!response.ok) {
    //         throw new Error('Failed to fetch comments');
    //       }

    //       const data = await response.json();
    //       if (data.success) {
    //         this.postComments = data.data.map(comment => ({
    //           id: comment.id,
    //           name: comment.comment_owner?.username || 'Anonymous',
    //           avatar: comment.comment_owner?.user_profile
    //                   ? `http://localhost:8000${comment.comment_owner.user_profile}`
    //                   : 'https://via.placeholder.com/40',
    //           time: comment.created_at,
    //           text: comment.content
    //         }));
    //       }
    //     } catch (error) {
    //       console.error('Error fetching comments:', error);
    //       this.postComments = [];
    //     }
    //   },
    // },

    async fetchPosts(page = 1) {
      this.loading = true;
      this.currentPage = page;

      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: page.toString(),
          page_size: this.itemsPerPage.toString(),
        });

        // Add tags filter only if tab is not "All Type"
        if (this.activeTab !== "All Type") {
          // Convert tab name to match your tag format
          // You might need to adjust this based on your API's expected tag format
          const tagName = this.activeTab; // or keep as is
          params.append("tags", tagName);
        }

        const response = await fetch(
          `${this.$store.state.root_api}community/api/posts/?${params}`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.success) {
          console.log("get api executed successfully");
          this.apiData = data.data;
          this.totalPages = data.total_pages;
          this.totalCount = data.total_count;
          console.log("Fetched posts:", this.apiData);
          console.log("Pagination info:", {
            currentPage: data.current_page,
            totalPages: data.total_pages,
            totalCount: data.total_count,
            activeTab: this.activeTab,
          });
        } else {
          console.error("API returned error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Fallback to sample data if API fails
        this.apiData = this.getSampleDataFromAPIResponse();
        this.totalPages = 1;
        this.totalCount = this.apiData.length;
      } finally {
        this.loading = false;
      }
    },

    // Updated helper methods
    getPostImage(post) {
      return this.$store.state.root_media_api + post.post_image;
    },

    getUserAvatar(post) {
      return this.$store.state.root_media_api + post.post_owner.avatar;
    },

    getPostTags(post) {
      if (post.tags && Array.isArray(post.tags)) {
        return post.tags.map((tag) =>
          typeof tag === "string" ? tag : tag.name
        );
      }
      return [];
    },

    // Updated pagination methods
    goToPage(pageNum) {
      if (pageNum >= 1 && pageNum <= this.totalPages) {
        this.fetchPosts(pageNum);
        this.scrollToCommunity();
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.fetchPosts(this.currentPage + 1);
        this.scrollToCommunity();
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.fetchPosts(this.currentPage - 1);
        this.scrollToCommunity();
      }
    },

    changeTab(tab) {
      this.activeTab = tab;
      console.log("tab changes to ", this.activeTab);

      this.fetchPosts(1);
    },

    // Update the page info display
    getDisplayRange() {
      const start = (this.apiPage - 1) * this.apiPageSize + 1;
      const end = Math.min(this.apiPage * this.apiPageSize, this.totalCount);
      return { start, end };
    },

    // Update the openCommentsModal to work with API data
    async openCommentsModal(post) {
      this.selectedPost = {
        id: post.id,
        userName: post.post_owner.username,
        userAvatar: this.getUserAvatar(post),
        image: this.getPostImage(post),
        views: post.view_count,
        likes: post.like_count,
        comments: post.comment_count,
        title: post.title,
        content: post.content,
        description: post.content || "No description available.",
        tags: this.getPostTags(post),
        created_at: post.created_at,
        is_liked: post.is_liked,
      };
      // await this.fetchPostComments(post.id);
      this.showCommentsModal = true;
    },
    onCommentAddedOrLiked() {
      this.fetchPosts();
      this.fetchCommunityStats();
    },

    scrollToCommunity() {
      this.$nextTick(() => {
        const communitySection = document.querySelector(".community-section");
        if (communitySection) {
          communitySection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    },
    formatNumber(num) {
      return num.toLocaleString();
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    selectCategory(category) {
      this.selectedCategory = category.value;
      this.selectedCategoryText = category.text;
      this.showDropdown = false;
      this.onCategoryChange();
    },
    // async fetchTags() {
    //   try {
    //     const response = await fetch(`${this.$store.state.root_api}community/api/public/tags/`, {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });
    //     const data = await response.json();
    //     if (data.success) {
    //       this.availableTags = data.data;
    //       this.popularTags = data.data.slice(0, 5);
    //     }
    //   } catch (error) {
    //     console.error('Failed to load tags:', error);
    //   }
    // },
    // async fetchDesigns(page = 1, append = false) {
    //   try {
    //     if (page === 1) {
    //       this.loading = true;
    //     } else {
    //       this.loadingMore = true;
    //     }
    //     const params = new URLSearchParams({
    //       page: page.toString(),
    //       page_size: this.pageSize.toString()
    //     });
    //     if (this.selectedCategory) {
    //       params.append('tag', this.selectedCategory);
    //     }
    //     const response = await fetch(
    //       `${this.$store.state.root_api}community/api/public/posts/?${params}`,
    //       {
    //         method: 'GET',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //       }
    //     );
    //     const data = await response.json();
    //     if (data.success) {
    //       const newDesigns = data.data;
    //       if (append) {
    //         this.designs = [...this.designs, ...newDesigns];
    //       } else {
    //         this.designs = newDesigns;
    //       }
    //       this.hasMore = data.pagination.has_next;
    //       this.currentPage = data.pagination.current_page;
    //     }
    //   } catch (error) {
    //     console.error('Failed to load designs:', error);
    //     this.$message?.error('Failed to load designs');
    //   } finally {
    //     this.loading = false;
    //     this.loadingMore = false;
    //   }
    // },
    async loadMoreDesigns() {
      if (this.hasMore && !this.loadingMore) {
        await this.fetchDesigns(this.currentPage + 1, true);
      }
    },
    onCategoryChange() {
      this.currentPage = 1;
      this.hasMore = true;
      this.fetchDesigns();
    },
    filterByTag(tagName) {
      this.activeTab = tagName;
      this.selectedCategory = tagName.toLowerCase().replace(/\s+/g, "");
      this.selectedCategoryText = tagName;
      this.onCategoryChange();
    },
    onSearch() {
      this.onCategoryChange();
    },
    getImageUrl(imagePath) {
      if (!imagePath) {
        return "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
      }
      return imagePath.startsWith("http")
        ? imagePath
        : `${this.$store.state.root_media_api}${imagePath}`;
    },
    async toggleLike(design) {
      const token = localStorage.getItem("token");
      if (!token) {
        this.$message?.warning("Please login to like posts");
        return;
      }
      try {
        const response = await fetch(
          `${this.$store.state.root_api}community/api/posts/like/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              post_id: design.id,
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          design.liked = data.data.action === "liked";
          design.likes = data.data.like_count;
        }
      } catch (error) {
        console.error("Failed to toggle like:", error);
        this.$message?.error("Failed to update like");
      }
    },
    openDesignDetail(design) {
      this.$router.push(`/design/${design.id}`);
    },
    async fetchCommunityStats() {
      ;
      this.statsLoading = true;
      try {
        const response = await fetch(
          `${this.$store.state.root_api}community/api/stats/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch community stats");
        }

        const data = await response.json();

        if (data.success) {
          // Set top designs for "Today's Top Designs" section
          this.topDesigns = data.data.most_liked_posts;

          // Set trending tags and update tabs
          this.trendingTags = data.data.top_tags;

          // Update tabs with tag names (keep "All Type" as first tab)
          const tagNames = data.data.top_tags.map((tag) => tag.name);
          this.tabs = ["All Type", ...tagNames];

          console.log("Community stats loaded:", {
            topDesigns: this.topDesigns.length,
            trendingTags: this.trendingTags.length,
            tabs: this.tabs,
          });
        }
      } catch (error) {
        console.error("Error fetching community stats:", error);
        // Fallback to default tabs if API fails
        this.tabs = [
          "All Type",
          "Living Room",
          "Dinning Room",
          "Kitchen",
          "Home Office",
          "Bedroom",
        ];
      } finally {
        this.statsLoading = false;
      }
    },
  },

  async mounted() {
    await this.fetchPosts();
    await this.fetchCommunityStats();
    // await this.fetchTags();
    // await this.fetchDesigns();
    document.addEventListener("click", (e) => {
      if (!this.$el.querySelector(".custom-dropdown")?.contains(e.target)) {
        this.showDropdown = false;
      }
    });
  },

  // Update the trending tags section to use API data
  getTrendingTags() {
    return this.trendingTags.slice(0, 5); // Show top 5 tags
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.design-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: white;
}

/* Blue gradient background for top half - matches HTML exactly */
.design-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50vh;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  z-index: 0;
}

/* Decorative curved lines on #3B63FB background */
.design-page::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50vh;
  background-image: url("../../assets/pricing-banner.png");
  z-index: 0;
}

.blue-section {
  position: relative;
  height: 60vh;
  display: flex;
  align-items: center;
  z-index: 1;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  position: relative;
  z-index: 4;
}

.hero-title {
  color: white;
  font-size: 3.5rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 4;
}

.hero-skeleton {
  width: 100%;
  height: 100%;
  min-height: 200px; /* safe default for hero cards */
  border-radius: 8px;
  max-height: 200px;
    min-width: 250px;
     max-width: 250px;

  background: linear-gradient(
    110deg,
    #e5e7eb 8%,
    #f9fafb 18%,
    #e5e7eb 33%
  );
  background-size: 200% 100%;
  animation: hero-shimmer 1.6s infinite linear;
}

@keyframes hero-shimmer {
  to {
    background-position-x: -200%;
  }
}


.hero-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 400;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  z-index: 4;
}

.hero-images {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  z-index: 3;
}

.image-left {
  position: absolute;
  left: 50px;
  bottom: -15px;
  transform: none;
  z-index: 3;
}

.image-right {
  position: absolute;
  right: 50px;
  top: 54%;
  transform: none;
  z-index: 2;
}

.image-left:hover,
.image-right:hover {
  transform: scale(1.05);
}

.image-card {
  background: white;
  border-radius: 16px;
  padding: 4px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.image-card:hover {
  transform: scale(1.05);
}

.image-card img {
  width: 250px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
}

.white-section {
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 20px;
  position: relative;
}

.search-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: none;
  max-width: 1050px;
  width: 100%;
  position: relative;
  z-index: 2;
  margin-top: -20px;
  margin-bottom: 30px;
}

.search-container {
  display: flex;
  gap: 10px;
}

/* Custom dropdown wrapper - matches HTML exactly */
.custom-dropdown {
  position: relative;
  width: 250px;
  cursor: pointer;
  font-family: sans-serif;
}

.dropdown-selected {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border-radius: 8px;
  border: none; /* default: no border on mobile */
}

/* Add border only after sm (640px) */
@media (min-width: 640px) {
  .dropdown-selected {
    border: 1px solid #ccc;
  }
}

.dropdown-selected img {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-options li {
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-options li:hover {
  background: #f2f2f2;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  outline: none;
  background: #f8f9fa;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-button {
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  background-color: #2563eb;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background-color: #1d4ed8;
}

.trending-section {
  max-width: 950px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.trending-section h3 {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 15px;
}

.trending-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.tag {
  background: #f3f4f6;
  color: #374151;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.tag:hover {
  background: #4f46e5;
  color: white;
}

.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Designs Grid Section */
.designs-grid-section {
  padding: 60px 20px 80px;
  background: #f8f9ff;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 50px;
  letter-spacing: -0.5px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.designs-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.design-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.design-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.design-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.design-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.design-card:hover .design-image {
  transform: scale(1.05);
}

.design-tags {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
}

.design-tag {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

.design-stats {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.design-footer {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.designer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.designer-avatar {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  overflow: hidden;
}

.designer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.designer-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.like-section {
  display: flex;
  align-items: center;
  gap: 6px;
}

.heart-icon {
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s ease;
}

.heart-icon.liked {
  color: #ef4444;
}

.like-count {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.load-more-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.load-more-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.load-more-btn:hover {
  background: #4338ca;
}

.load-more-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-results h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .blue-section {
    height: auto;
    min-height: 50vh;
    padding: 40px 20px 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* base: 8px (important to ensure it wins when needed) */
  .tab-text {
    font-family: inherit;
    font-weight: 400;
    font-size: 12px !important; /* base size = 8px */
    line-height: 1 !important;
    text-align: center;
  }

  /* from sm (640px) and up => text-lg (1.125rem ≈ 18px) */
  @media (min-width: 640px) {
    .tab-text {
      font-size: 1.125rem !important; /* same as Tailwind text-lg */
      line-height: 1.25 !important; /* adjust if needed */
    }
  }

  /* optional styling for active/inactive states */
  .tab-btn {
    padding-bottom: 0.5rem; /* keep space for border-bottom */
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .tab-active {
    color: #2563eb; /* blue-600 */
    border-bottom: 2px solid #2563eb;
  }

  .tab-inactive {
    color: #6b7280; /* gray-500 */
  }

  .search-container {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .custom-dropdown {
    width: 40px;
  }

  .dropdown-selected {
    justify-content: center;
    padding: 6px;
    border-radius: 50%;
  }

  .dropdown-selected .selected-text {
    display: none !important;
  }

  .search-input {
    flex: 1;
    font-size: 14px;
    padding: 8px 12px;
  }

  .search-button {
    padding: 8px 14px;
    font-size: 13px;
  }

  .dropdown-options {
    width: 200px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .white-section {
    min-height: auto;
    padding: 20px;
  }

  .search-section {
    margin-top: 0;
  }

  .designs-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .image-card img {
    width: 160px;
    height: 130px;
  }

  .section-title {
    font-size: 2rem;
  }

  .designs-section {
    padding: 40px 16px 60px;
  }
}


.search-container {
  position: relative;
}

.search-dropdown {
  max-height: 280px;
  overflow-y: auto;
}
</style>
