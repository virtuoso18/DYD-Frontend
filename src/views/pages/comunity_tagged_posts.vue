<template>
  <div class="w-full px-4 py-8">

    <!-- PAGE TITLE -->
    <h1 class="text-2xl font-semibold text-start mb-6">
      #{{ tag }}
    </h1>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-12 text-gray-500">
      Loading posts...
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="posts.length === 0" class="text-center py-12 text-gray-500">
      No posts found for this tag.
    </div>

    <!-- POSTS GRID -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
    >
    <!-- <div v-for="post in posts">
        {{ post }}
    </div> -->
      <a-row>
        <a-col v-for="post in posts" :sm="24" :xs="24" :md="24" :lg="24">
            <DesignCard
              :key="post.id"
              :image="this.$store.state.root_media_api+getPostImage(post)"
              :avatar="this.$store.state.root_media_api+getUserAvatar(post)"
              :tags="getPostTags(post)"
              :name="post.post_owner.username"
              :likes="post.like_count"
              :views="post.view_count"
              :comments="post.comment_count"
              :is_liked="post.is_liked"
              @click.stop="openPost(post)"
              />
        </a-col>
      </a-row>

        <!-- width="100%" -->
        <!-- height="250px" -->
    </div>

    <!-- PAGINATION -->
    <div
      v-if="totalCount > pageSize"
      class="flex justify-center mt-10"
    >
      <a-pagination
        :current="page"
        :pageSize="pageSize"
        :total="totalCount"
        show-less-items
        @change="onPageChange"
      />
    </div>

  </div>
</template>

<script>
    import DesignCard from "@/components/Includes/DesignCard_tag_comunity_post.vue";
    import CommentsModal from "./CommentsModal.vue";
export default {
  name: "community_posts_tagged",

   components: {
    DesignCard,
        CommentsModal,
  },
  data() {
    return {
      posts: [],
      loading: false,
      page: 1,
      pageSize: 12,
      totalCount: 0,
    }
  },

  computed: {
    tag() {
      return this.$route.params.tag
    },
  },

  mounted() {
    this.fetchCommunityPostsByTag()
  },

  watch: {
    // 🔁 refetch when tag changes
    "$route.params.tag"() {
      this.page = 1
      this.fetchCommunityPostsByTag()
    },
  },

  methods: {
    async fetchCommunityPostsByTag() {
      this.loading = true

      try {
        const response = await fetch(
            
          `${this.$store.state.root_api}community/api/all-posts-by-tag/${encodeURIComponent(this.tag)}/?tag=${encodeURIComponent(this.tag)}&page=${this.page}&page_size=${this.pageSize}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const res = await response.json()

        this.posts = res.data || []
        this.totalCount = res.pagination?.total_count || 0
      } catch (err) {
        console.error("Failed to load tagged posts", err)
        this.posts = []
      } finally {
        this.loading = false
      }
    },

    onPageChange(page) {
      this.page = page
      this.fetchCommunityPostsByTag()
    },

    /* ---------- helpers (adjust to your app) ---------- */
    getPostImage(post) {
      return post.post_image || post.images?.[0] || ""
    },

    getUserAvatar(post) {
      return post.post_owner?.avatar || ""
    },

    getPostTags(post) {
      return post.tags?.map(t => t.name) || []
    },

    openPost(post) {

    //   this.$router.push(`/community/post/${post.id}`)
    // open the community post model Here

    },
    
  },
}
</script>
