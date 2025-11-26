<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Desktop View (md and up) -->
    <div class="hidden md:flex h-screen">
      <!-- Left Section - Image & Details (Sticky) -->
      <div class="w-1/2 sticky top-0 h-screen overflow-hidden bg-white p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <img 
              src="https://via.placeholder.com/40" 
              alt="User" 
              class="w-10 h-10 rounded-full"
            />
            <span class="font-medium text-gray-900">John Doe</span>
          </div>
          <button class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <img 
            src="https://via.placeholder.com/40" 
            alt="Interior Design" 
            class="w-full h-auto rounded-lg"
          />
        </div>

        <div class="flex items-center gap-6 mb-4 text-gray-600">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>125</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>15k</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="red" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>1.2k</span>
          </div>
        </div>

        <p class="text-gray-600 text-sm mb-4">
          Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
        </p>

        <div class="flex gap-2">
          <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">Living Room</span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">Modern</span>
        </div>
      </div>

      <!-- Right Section - Comments (Scrollable - Desktop) -->
      <div class="w-1/2 bg-white border-l border-gray-200">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <h2 class="text-xl font-semibold text-gray-900">Comments</h2>
        </div>

        <div class="overflow-y-auto h-[calc(100vh-130px)] px-6 py-4">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="mb-6 pb-6 border-b border-gray-100 last:border-0"
          >
            <div class="flex gap-3">
              <img 
                :src="comment.avatar" 
                alt="" 
                class="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-gray-900">{{ comment.name }}</h3>
                  <span class="text-xs text-gray-400">{{ comment.time }}</span>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">
                  {{ comment.text }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div class="flex items-center gap-3">
            <input
              v-model="newComment"
              type="text"
              placeholder="Type here"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="addComment"
            />
            <button 
              @click="addComment"
              class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile View (below md) -->
    <div class="md:hidden min-h-screen bg-white">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img 
            src="https://via.placeholder.com/40" 
            alt="User" 
            class="w-8 h-8 rounded-full"
          />
          <span class="font-medium text-gray-900">John Doe</span>
        </div>
        <button class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Main Content -->
      <div class="overflow-y-auto pb-20">
        <!-- Image -->
        <div class="px-4 py-4">
          <img 
src="https://via.placeholder.com/40"             alt="Interior Design" 
            class="w-full h-auto rounded-lg"
          />
        </div>

        <!-- Action Buttons -->
        <div class="px-4 flex items-center gap-4 mb-4">
          <button class="flex items-center gap-1 text-gray-700">
            <svg class="w-6 h-6" fill="red" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span class="font-medium">1.2k</span>
          </button>
          
          <button 
            @click="openComments" 
            class="flex items-center gap-1 text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span class="font-medium">15k</span>
          </button>

          <button class="flex items-center gap-1 text-gray-700 ml-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span class="font-medium">125</span>
          </button>
        </div>

        <!-- Description -->
        <div class="px-4 mb-4">
          <p class="text-gray-600 text-sm mb-3">
            Vorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra.
          </p>
          <div class="flex gap-2">
            <span class="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">Living Room</span>
            <span class="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">Modern</span>
          </div>
        </div>

        <!-- Recent Comments Preview -->
        <div class="px-4 mb-4">
          <button 
            @click="openComments" 
            class="text-gray-500 text-sm"
          >
            View all {{ comments.length }} comments
          </button>
          
          <div 
            v-if="comments.length > 0"
            class="mt-3 flex gap-2"
          >
            <img 
              :src="comments[0].avatar" 
              alt="" 
              class="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div class="flex-1">
              <p class="text-sm">
                <span class="font-semibold text-gray-900">{{ comments[0].name }}</span>
                <span class="text-gray-600 ml-2">{{ comments[0].text.substring(0, 50) }}...</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments Bottom Drawer/Modal -->
      <transition name="slide-up">
        <div 
          v-if="commentsOpen" 
          class="fixed inset-0 z-50 bg-black bg-opacity-50"
          @click="closeComments"
        >
          <div 
            class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] flex flex-col"
            @click.stop
          >
            <!-- Drawer Handle -->
            <div class="flex justify-center py-3 border-b border-gray-200">
              <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <!-- Header -->
            <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Comments</h3>
              <button 
                @click="closeComments"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Comments List -->
            <div class="flex-1 overflow-y-auto px-4 py-4">
              <div 
                v-for="comment in comments" 
                :key="comment.id"
                class="mb-4 pb-4 border-b border-gray-100 last:border-0"
              >
                <div class="flex gap-3">
                  <img 
                    :src="comment.avatar" 
                    alt="" 
                    class="w-9 h-9 rounded-full flex-shrink-0"
                  />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <h4 class="font-semibold text-sm text-gray-900">{{ comment.name }}</h4>
                      <span class="text-xs text-gray-400">{{ comment.time }}</span>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">
                      {{ comment.text }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Comment Input -->
            <div class="border-t border-gray-200 px-4 py-3 bg-white">
              <div class="flex items-center gap-3">
                <img 
                  src="https://via.placeholder.com/40" 
                  alt="" 
                  class="w-8 h-8 rounded-full flex-shrink-0"
                />
                <input
                  v-model="newComment"
                  type="text"
                  placeholder="Type here"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @keyup.enter="addComment"
                />
                <button 
                  @click="addComment"
                  class="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentsPage",
  
  data() {
    return {
      commentsOpen: false,
      newComment: '',
      comments: [
        {
          id: 1,
          name: 'John Doe',
          avatar: 'https://via.placeholder.com/40',
          time: '1 day ago',
          text: 'Dorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.'
        },
        {
          id: 2,
          name: 'Jane Smith',
          avatar: 'https://via.placeholder.com/40',
          time: '2 days ago',
          text: 'Quisque facilisis lacus at nunc cursus, a porttitor nunc rutrum. Donec quismod dolor sit armet massa tincidunt, vitae aliquet metus facilisis.'
        },
        {
          id: 3,
          name: 'Michael Johnson',
          avatar: 'https://via.placeholder.com/40',
          time: '3 days ago',
          text: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere.'
        },
        {
          id: 4,
          name: 'Emily Davis',
          avatar: 'https://via.placeholder.com/40',
          time: '4 days ago',
          text: 'Sed nisl. Nulla quis sem at nibh elementum imperdiet. Duis sagittis. Praesent mauris. Fusce nec tellus sed augue semper porta.'
        }
      ]
    }
  },

  methods: {
    openComments() {
      this.commentsOpen = true;
      document.body.style.overflow = 'hidden';
    },

    closeComments() {
      this.commentsOpen = false;
      document.body.style.overflow = '';
    },

    addComment() {
      if (this.newComment.trim()) {
        this.comments.unshift({
          id: Date.now(),
          name: 'Current User',
          avatar: 'https://via.placeholder.com/40',
          time: 'Just now',
          text: this.newComment
        });
        this.newComment = '';
      }
    }
  }
}
</script>

<style scoped>
/* Desktop scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Slide up animation for mobile drawer */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s ease;
}

.slide-up-enter-active > div,
.slide-up-leave-active > div {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from > div,
.slide-up-leave-to > div {
  transform: translateY(100%);
}
</style>
