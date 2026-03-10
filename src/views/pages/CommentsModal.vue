<template>
  <Teleport to="body">
    <transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-1001 flex items-center justify-center backdrop-blur-xs p-4"
        style="background-color: rgba(0, 0, 0, 0.5);"
        @click="closeModal"
      >
        <!-- Desktop Modal -->
        <div 
          class="hidden md:flex bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] overflow-hidden"
          @click.stop
        >
          <!-- Left Section - Image & Details -->
          <div class="w-1/2 overflow-y-auto no-scrollbar p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <img 
                  :src="post.userAvatar" 
                  alt="User" 
                  class="w-10 h-10 rounded-full"
                />
                <span class="font-medium text-gray-900">{{ post.userName }}</span>
              </div>
            </div>

            <div class="mb-4">
              <img 
                :src="post.image" 
                alt="Post" 
                class="w-[full] max-w-[250px] h-auto rounded-lg "
                style="margin:auto"
              />
            </div>

            <div class="flex justify-between items-center py-2 text-gray-600 w-full">
              <!-- LEFT SIDE (Views) -->
              <div class="flex items-center gap-6">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{{ post.views }}</span>
                </div>
              </div>

              <!-- RIGHT SIDE (Likes & Comments) -->
              <div className="flex flex-row gap-6">
                <div class="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.33594 3.9987C1.33594 3.29145 1.61689 2.61318 2.11699 2.11308C2.61708 1.61298 3.29536 1.33203 4.0026 1.33203H12.0026C12.7098 1.33203 13.3881 1.61298 13.8882 2.11308C14.3883 2.61318 14.6693 3.29145 14.6693 3.9987V9.33203C14.6693 10.0393 14.3883 10.7176 13.8882 11.2176C13.3881 11.7177 12.7098 11.9987 12.0026 11.9987H8.8706L5.0386 14.5534C4.93821 14.6202 4.82158 14.6585 4.70113 14.6643C4.58067 14.67 4.46091 14.643 4.3546 14.5861C4.24829 14.5292 4.15941 14.4445 4.09742 14.341C4.03544 14.2376 4.00267 14.1193 4.0026 13.9987V11.9987C3.29536 11.9987 2.61708 11.7177 2.11699 11.2176C1.61689 10.7176 1.33594 10.0393 1.33594 9.33203V3.9987ZM4.0026 2.66536C3.64898 2.66536 3.30984 2.80584 3.05979 3.05589C2.80975 3.30594 2.66927 3.64508 2.66927 3.9987V9.33203C2.66927 9.68565 2.80975 10.0248 3.05979 10.2748C3.30984 10.5249 3.64898 10.6654 4.0026 10.6654H4.66927C4.84608 10.6654 5.01565 10.7356 5.14068 10.8606C5.2657 10.9857 5.33594 11.1552 5.33594 11.332V12.7534L8.29994 10.7774C8.40931 10.7044 8.53781 10.6655 8.66927 10.6654H12.0026C12.3562 10.6654 12.6954 10.5249 12.9454 10.2748C13.1955 10.0248 13.3359 9.68565 13.3359 9.33203V3.9987C13.3359 3.64508 13.1955 3.30594 12.9454 3.05589C12.6954 2.80584 12.3562 2.66536 12.0026 2.66536H4.0026Z" fill="#4D4D4D"/>
                  </svg>
                  <span>{{ formatNumber(apiComments.length) }}</span>
                </div>
                <div class="flex items-center gap-2 cursor-pointer" @click="toggleLike">
                    <!-- Filled heart when liked -->
                    <svg 
                      v-if="localIsLiked" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="#EF4444" 
                      class="transition-colors duration-200"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M6.94307 13.3105C5.06222 11.904 1.33594 8.68856 1.33594 5.79499C1.33594 3.88245 2.73944 2.33203 4.66927 2.33203C5.66927 2.33203 6.66927 2.66536 8.0026 3.9987C9.33594 2.66536 10.3359 2.33203 11.3359 2.33203C13.2657 2.33203 14.6693 3.88245 14.6693 5.79499C14.6693 8.68856 10.943 11.904 9.06214 13.3105C8.4292 13.7838 7.576 13.7838 6.94307 13.3105Z" 
                        stroke="#EF4444" 
                        stroke-width="1.5" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                      />
                    </svg>
                    
                    <!-- Outlined heart when not liked -->
                    <svg 
                      v-else 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      stroke="#4D4D4D" 
                      stroke-width="1.5"
                      class="transition-colors duration-200 hover:stroke-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M6.94307 13.3105C5.06222 11.904 1.33594 8.68856 1.33594 5.79499C1.33594 3.88245 2.73944 2.33203 4.66927 2.33203C5.66927 2.33203 6.66927 2.66536 8.0026 3.9987C9.33594 2.66536 10.3359 2.33203 11.3359 2.33203C13.2657 2.33203 14.6693 3.88245 14.6693 5.79499C14.6693 8.68856 10.943 11.904 9.06214 13.3105C8.4292 13.7838 7.576 13.7838 6.94307 13.3105Z" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                      />
                    </svg>
                    
                    <span :class="localIsLiked ? 'text-red-500 font-medium' : 'text-gray-700'">
                      {{ formatNumber(localLikes) }}
                    </span>
                  </div>
              </div>
            </div>

            <p
              class="!font-[Poppins] !font-normal text-[8px] sm:text-[12px] !leading-[13px] !tracking-[0] text-gray-600 py-4"
            >
              {{ post.description }}
            </p>

            <div class="flex gap-2">
              <span 
                v-for="tag in post.tags" 
                :key="tag"
                class="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Right Section - Comments -->
          <div class="w-1/2 bg-white flex flex-col">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <!-- Left Side -->
              <h2 class="text-xl font-semibold text-gray-900">Comments</h2>

              <!-- Right Side -->
              <button 
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Comments List -->
<div class="flex-1 min-w-0 overflow-y-auto px-4 py-3">
              <!-- Loading State -->
              <div v-if="loadingComments" class="text-center py-8">
                <div class="loading-spinner mx-auto mb-2"></div>
                <p class="text-gray-500">Loading comments...</p>
              </div>

              <!-- Empty State -->
              <div v-else-if="apiComments.length === 0" class="text-center py-8">
                <p class="text-gray-500">No comments yet. Be the first to comment!</p>
              </div>

              <!-- Comments -->
              <div 
                v-else
                v-for="comment in apiComments" 
                :key="comment.id"
                class="mb-6 pb-6 border-b border-gray-100 last:border-0"
              >
               <div class="flex gap-3">
  <img 
    :src="comment.avatar" 
    alt="" 
    class="w-10 h-10 rounded-full flex-shrink-0"
  />

  <div class="flex-1 min-w-0">
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-semibold text-gray-900">
        {{ comment.name }}
      </h3>
      <span class="text-xs text-gray-400">
        {{ comment.time }}
      </span>
    </div>

   <!-- Desktop comment -->
<p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
  <span v-if="!expandedComments.has(comment.id)">
    {{ truncateComment(comment.text, 250) }}
    <span v-if="comment.text.length > 250" 
          class="text-gray-900 hover:text-blue-700 cursor-pointer font-medium ml-1"
          @click="toggleComment(comment.id)">
      ... Show more
    </span>
  </span>
  <span v-else>
    {{ comment.text }}
    <span class="text-gray-900 hover:text-blue-700 cursor-pointer font-medium ml-1"
          @click="toggleComment(comment.id)">
      Show less
    </span>
  </span>
</p>



  </div>
</div>

              </div>

              <!-- Load More Button -->
              <button 
                v-if="hasMoreComments && !loadingComments"
                @click="loadMoreComments"
                class="w-full py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                :disabled="loadingMoreComments"
              >
                {{ loadingMoreComments ? 'Loading...' : 'Load More Comments' }}
              </button>
            </div>

            <!-- Add Comment Section -->
            <div class="border-t border-gray-200 px-6 py-4">
              <div class="flex items-center gap-3">
                <input
                  v-model="newComment"
                  type="text"
                  maxlength="500"
                  placeholder="Type your comment..."
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @keyup.enter="addComment"
                  :disabled="addingComment"
                />
                <button 
                  @click="addComment"
                  class="p-2 text-white rounded-lg transition"
                  :disabled="!newComment.trim() || addingComment"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.721 7.63038L5.2073 8.12581C6.18973 8.45258 6.67989 8.61702 7.03196 8.96909C7.38403 9.32117 7.54847 9.81238 7.87525 10.7927L8.37068 12.279C9.1971 14.7604 9.61031 16 10.3703 16C11.1293 16 11.5435 14.7604 12.37 12.279L15.3615 3.30642C15.9434 1.56082 16.2343 0.688014 15.7737 0.227368C15.313 -0.233277 14.4402 0.0576566 12.6957 0.638471L3.71995 3.63214C1.24174 4.45751 0 4.87072 0 5.63073C0 6.39074 1.24069 6.80395 3.721 7.63038Z" fill="#3B63FB"/>
                    <path d="M3.721 7.63038L5.2073 8.12581C6.18973 8.45258 6.67989 8.61702 7.03196 8.96909C7.38403 9.32117 7.54847 9.81238 7.87525 10.7927L8.37068 12.279C9.1971 14.7604 9.61031 16 10.3703 16C11.1293 16 11.5435 14.7604 12.37 12.279L15.3615 3.30642C15.9434 1.56082 16.2343 0.688014 15.7737 0.227368C15.313 -0.233277 14.4402 0.0576566 12.6957 0.638471L3.71995 3.63214C1.24174 4.45751 0 4.87072 0 5.63073C0 6.39074 1.24069 6.80395 3.721 7.63038Z" fill="#3B63FB"/>
                    <path d="M5.65441 9.68062L3.48084 8.95644C3.32874 8.90574 3.16709 8.8904 3.00817 8.91159C2.84925 8.93278 2.69726 8.98994 2.56376 9.07872L1.41478 9.844C1.27877 9.93462 1.17202 10.0628 1.10752 10.213C1.04302 10.3631 1.02354 10.5288 1.05146 10.6898C1.07938 10.8509 1.15349 11.0003 1.26477 11.12C1.37606 11.2397 1.51973 11.3245 1.67831 11.364L3.73909 11.8784C3.83183 11.9016 3.91653 11.9495 3.98411 12.0171C4.0517 12.0847 4.09964 12.1694 4.12279 12.2621L4.63719 14.3229C4.67674 14.4815 4.76151 14.6252 4.8812 14.7364C5.00089 14.8477 5.15034 14.9218 5.31137 14.9498C5.47241 14.9777 5.63808 14.9582 5.78825 14.8937C5.93841 14.8292 6.0666 14.7225 6.15722 14.5864L6.9225 13.4375C7.01128 13.304 7.06844 13.152 7.08963 12.9931C7.11082 12.8341 7.09548 12.6725 7.04478 12.5204L6.32061 10.3468C6.26884 10.1917 6.1817 10.0508 6.06608 9.93514C5.95045 9.81952 5.80952 9.73238 5.65441 9.68062Z" fill="#3B63FB"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Modal - Updated with API data -->
      <!-- Mobile Modal - FULLY FIXED -->
<div
  class="md:hidden bg-white rounded-t-3xl w-full flex flex-col absolute left-0 right-0 click.stop"
  :class="isMobileExpanded ? 'bottom-0 h-[100vh]' : 'bottom-0 h-[80vh]'" 
   @click.stop  
>
  <!-- Handle (drag area) -->
  <div
    class="flex justify-center py-3 border-b border-gray-200"
    @touchstart="onHandleTouchStart"
    @touchmove="onHandleTouchMove"
    @touchend="onHandleTouchEnd"
  >
    <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
  </div>

  <!-- Header -->
  <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <img :src="post.userAvatar" alt="User" class="w-8 h-8 rounded-full" />
      <span class="font-medium text-gray-900">{{ post.userName }}</span>
    </div>
    <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  </div>

  <!-- Scrollable Content -->
  <div class="flex-1 min-w-0 overflow-hidden">
    
    <!-- Image + Stats (fixed height) -->
    <div class="px-4 py-4 border-b border-gray-200 max-h-[35vh] overflow-hidden">
      <img :src="post.image" alt="Post" class="w-full h-auto rounded-lg" />
      <!-- Stats -->
      <div class="flex items-center gap-4 mt-3">
        <button class="flex items-center gap-1 text-gray-700" @click="toggleLike">
          <!-- heart icons unchanged -->
        </button>
        <div class="flex items-center gap-1 text-gray-700">
          <!-- eye icon + views unchanged -->
        </div>
      </div>
    </div>

    <!-- Scrollable Description + Tags -->
    <div class="px-4 py-2 max-h-[15vh] overflow-y-auto no-scrollbar">
      <p class="text-gray-600 text-sm mb-3" v-html="post.description"></p>
      <div class="flex gap-2 mb-2">
        <span v-for="tag in post.tags" :key="tag" class="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">{{ tag }}</span>
      </div>
    </div>

    <!-- Comments Header + List (scrollable) -->
    <div class="flex-1 min-w-0 px-4 overflow-y-auto no-scrollbar max-h-[50vh]">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
      
      <!-- Loading -->
      <div v-if="loadingComments" class="text-center py-4">
        <p class="text-gray-500">Loading comments...</p>
      </div>
      
      <!-- Empty -->
      <div v-else-if="apiComments.length === 0" class="text-center py-4">
        <p class="text-gray-500">No comments yet.</p>
      </div>
      
      <!-- Comments -->
      <div v-else>
        <div v-for="comment in apiComments" :key="comment.id" class="mb-4 pb-4 border-b border-gray-100 last:border-b-0">
          <!-- comment structure unchanged -->
          <div class="flex gap-3 p-2">
            <img :src="comment.avatar" alt="" class="w-9 h-9 rounded-full flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-semibold text-sm text-gray-900">{{ comment.name }}</h4>
                <span class="text-xs text-gray-400">{{ comment.time }}</span>
              </div>
<p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
  <span v-if="!expandedComments.has(comment.id)">
    {{ truncateComment(comment.text, 250) }}
    <span v-if="comment.text.length > 250" 
          class="text-gray-900 hover:text-blue-700 cursor-pointer font-medium ml-1"
          @click="toggleComment(comment.id)">
      ... Show more
    </span>
  </span>
  <span v-else>
    {{ comment.text }}
    <span class="text-gray-900 hover:text-blue-700 cursor-pointer font-medium ml-1"
          @click="toggleComment(comment.id)">
      Show less
    </span>
  </span>
</p>            </div>
          </div>
        </div>
        
        <!-- Load More -->
        <button v-if="hasMoreComments && !loadingComments" @click="loadMoreComments" 
                class="w-full py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm">
          {{ loadingMoreComments ? 'Loading...' : 'Load More Comments' }}
        </button>
      </div>
    </div>
  </div>

  <!-- STICKY INPUT - ALWAYS VISIBLE -->
<div class="border-t border-gray-200 px-4 py-3 bg-white shrink-0" @click.stop>    <div class="flex items-center gap-3">
      <img :src="post.userAvatar" alt="" class="w-8 h-8 rounded-full flex-shrink-0"  />
      <input 
        v-model="newComment" 
        type="text" 
        maxlength="500"
        placeholder="Type your comment..." 
        class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @keyup.enter="addComment"
        :disabled="addingComment"
      />
      <button @click="addComment" 
              :disabled="!newComment.trim() || addingComment"
              class="p-2  text-white rounded-full hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
       
 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.721 7.63038L5.2073 8.12581C6.18973 8.45258 6.67989 8.61702 7.03196 8.96909C7.38403 9.32117 7.54847 9.81238 7.87525 10.7927L8.37068 12.279C9.1971 14.7604 9.61031 16 10.3703 16C11.1293 16 11.5435 14.7604 12.37 12.279L15.3615 3.30642C15.9434 1.56082 16.2343 0.688014 15.7737 0.227368C15.313 -0.233277 14.4402 0.0576566 12.6957 0.638471L3.71995 3.63214C1.24174 4.45751 0 4.87072 0 5.63073C0 6.39074 1.24069 6.80395 3.721 7.63038Z" fill="#3B63FB"/>
                    <path d="M3.721 7.63038L5.2073 8.12581C6.18973 8.45258 6.67989 8.61702 7.03196 8.96909C7.38403 9.32117 7.54847 9.81238 7.87525 10.7927L8.37068 12.279C9.1971 14.7604 9.61031 16 10.3703 16C11.1293 16 11.5435 14.7604 12.37 12.279L15.3615 3.30642C15.9434 1.56082 16.2343 0.688014 15.7737 0.227368C15.313 -0.233277 14.4402 0.0576566 12.6957 0.638471L3.71995 3.63214C1.24174 4.45751 0 4.87072 0 5.63073C0 6.39074 1.24069 6.80395 3.721 7.63038Z" fill="#3B63FB"/>
                    <path d="M5.65441 9.68062L3.48084 8.95644C3.32874 8.90574 3.16709 8.8904 3.00817 8.91159C2.84925 8.93278 2.69726 8.98994 2.56376 9.07872L1.41478 9.844C1.27877 9.93462 1.17202 10.0628 1.10752 10.213C1.04302 10.3631 1.02354 10.5288 1.05146 10.6898C1.07938 10.8509 1.15349 11.0003 1.26477 11.12C1.37606 11.2397 1.51973 11.3245 1.67831 11.364L3.73909 11.8784C3.83183 11.9016 3.91653 11.9495 3.98411 12.0171C4.0517 12.0847 4.09964 12.1694 4.12279 12.2621L4.63719 14.3229C4.67674 14.4815 4.76151 14.6252 4.8812 14.7364C5.00089 14.8477 5.15034 14.9218 5.31137 14.9498C5.47241 14.9777 5.63808 14.9582 5.78825 14.8937C5.93841 14.8292 6.0666 14.7225 6.15722 14.5864L6.9225 13.4375C7.01128 13.304 7.06844 13.152 7.08963 12.9931C7.11082 12.8341 7.09548 12.6725 7.04478 12.5204L6.32061 10.3468C6.26884 10.1917 6.1817 10.0508 6.06608 9.93514C5.95045 9.81952 5.80952 9.73238 5.65441 9.68062Z" fill="#3B63FB"/>
                  </svg>      </button>
    </div>
  </div>

</div>

      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: "CommentsModal",
  
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    post: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      newComment: '',
      apiComments: [],
      loadingComments: false,
      loadingMoreComments: false,
      addingComment: false,
      commentsPage: 1,
      isMobileExpanded: false,
      dragStartY: null,
    expandedComments: new Set(),
      mobileModalHeight: '85vh',
      hasMoreComments: false,
      totalPages: 1,
      localIsLiked: false,
      localLikes: 0
    }
  },

  watch: {
   isOpen: {
    immediate: true,
    handler(newVal) {
      console.log('isOpen watcher fired:', newVal);

      if (newVal) {
        document.body.style.overflow = 'hidden';
        this.localIsLiked = this.post.is_liked;
        this.localLikes = this.post.likes;
        this.loadComments();
      } else {
        document.body.style.overflow = '';
        this.resetComments();
      }
    }
  },
    post: {
    immediate: true,
    handler(newPost) {
      if (newPost) {
        this.localIsLiked = newPost.is_liked;
        this.localLikes = newPost.likes;
      }
    }
  }
  },

  mounted() {
  this.setupMobileKeyboard();
},

  methods: {
    closeModal() {
      document.body.style.overflow = 'auto'
      this.$emit('close');
    },

     onHandleTouchStart(e) {
    this.dragStartY = e.touches[0].clientY;
    },

   
  onHandleTouchMove(e) {
    if (this.dragStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = this.dragStartY - currentY; // positive = drag up

    // if user drags up more than 40px → expand
    if (diff > 60 && !this.isMobileExpanded) {
      this.isMobileExpanded = true;
    }

    // if user drags down more than 40px → collapse
    if (diff < -60 && this.isMobileExpanded) {
      this.isMobileExpanded = false;
    }
    },

     truncateComment(text, maxLength = 250) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) : text;
  },

  toggleComment(commentId) {
    if (this.expandedComments.has(commentId)) {
      this.expandedComments.delete(commentId);
    } else {
      this.expandedComments.add(commentId);
    }
  },

  onHandleTouchEnd() {
    this.dragStartY = null;
  },

     setupMobileKeyboard() {
    // Listen for keyboard show/hide
    window.visualViewport?.addEventListener('resize', this.handleViewportResize);
  },
  
  handleViewportResize() {
    const vh = window.visualViewport.height;
    this.mobileModalHeight = Math.max(vh * 0.85, '70vh'); // 85% of viewport
  },

    resetComments() {
      this.apiComments = [];
      this.commentsPage = 1;
      this.hasMoreComments = false;
      this.newComment = '';
    },

    async loadComments(page = 1) {
      
      if (page === 1) {
        this.loadingComments = true;
      } else {
        this.loadingMoreComments = true;
      }
      
      try {
        const response = await fetch(
          `${this.$store.state.root_api}community/api/comments/?post_id=${this.post.id}&page=${page}`,
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
          const comments = data.data.map(comment => ({
            id: comment.id,
            name: comment.comment_owner?.username || 'Anonymous',
            avatar: comment.comment_owner?.user_profile 
                    ? `${this.$store.state.root_media_api}${comment.comment_owner.user_profile}`
                    : 'https://via.placeholder.com/40',
            time: this.formatTime(comment.created_at),
            text: comment.content
          }));

          if (page === 1) {
            this.apiComments = comments;
          } else {
            this.apiComments.push(...comments);
          }

          this.hasMoreComments = page < data.total_pages;
          this.commentsPage = page;
          this.totalPages = data.total_pages;
        }
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        this.loadingComments = false;
        this.loadingMoreComments = false;
      }
    },

    async loadMoreComments() {
      if (this.hasMoreComments && !this.loadingMoreComments) {
        await this.loadComments(this.commentsPage + 1);
      }
    },

    async addComment() {
      if (!this.newComment.trim()) return;

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
              post_id: this.post.id,
              content: this.newComment.trim(),
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          // Clear input
          this.newComment = "";

          // Reload comments to show the new one
          await this.loadComments();

          // Emit event to parent to update comment count
          this.$emit('commentAdded');

          // Show success message
          this.$message?.success("Comment added successfully!");
        }
      } catch (error) {
        console.error("Failed to add comment:", error);
        this.$message?.error("Failed to add comment");
      } finally {
        this.addingComment = false;
      }
    },

    formatNumber(num) {
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
      return num;
    },

    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
      return date.toLocaleDateString();
    },
    
     async toggleLike() {
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
              post_id: this.post.id,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          this.localIsLiked = data.data.action === "liked";
          this.localLikes = data.data.like_count;
          this.$emit('likeToggled');
          this.$message.success(`Post ${data.data.action}!`);
        }
      } catch (error) {
        console.error("Failed to toggle like:", error);
        this.$message.error("Failed to update like");
      }
    },
  }
}
</script>

<style scoped>
/* Modal fade animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .hidden.md\:flex,
.modal-leave-to .hidden.md\:flex {
  transform: scale(0.95);
}

.modal-enter-from .md\:hidden,
.modal-leave-to .md\:hidden {
  transform: translateY(100%);
}

/* Scrollbar styling */
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

/* Loading spinner */
.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Mobile scrollbar hide */
.no-scrollbar::-webkit-scrollbar { width: 0; height: 0; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* iOS safe area */
@media (max-width: 768px) {
  .md:hidden {
    padding-bottom: env(safe-area-inset-bottom, 20px);
  }
}


@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>