<template>
  <div class="design-page">
    <!-- Header Section -->
    
    <div>

      <div class="header-section">
        <div class="wave-background"></div>
        <div class="header-content">
          <div class="hero-text">
            <h1 class="main-title">Discover the world's top<br>interior design inspiration</h1>
            <p class="subtitle">Explore the work of the most talented<br>designers to inspire your work.</p>
          </div>
        </div>
      </div>
        <div class="hero-images" style="position:absolute;bottom:100px;left:50px;">
          <div class="hero-image-left">
            <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Interior Design" />
          </div>
        </div>
        <div class="hero-images" style="position:absolute;bottom:200px;right:20px;">
          <div class="hero-image-right">
            <img src="https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Interior Design" />
          </div>
        </div>
    </div>


    <!-- Search Section -->
    <div class="search-section">
      <br><br><br><br><br><br></br>
      <div class="search-container">
        <div class="search-dropdown">
          <select v-model="selectedCategory" class="category-select" @change="onCategoryChange">
            <option value="">All Categories</option>
            <option v-for="tag in availableTags" :key="tag.id" :value="tag.name">{{ tag.name }}</option>
          </select>
        </div>
        <div class="search-input-container">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input 
            type="text" 
            placeholder="What are you looking for?"
            v-model="searchQuery"
            class="search-input"
            @keyup.enter="onSearch"
          />
        </div>
        <button class="search-btn" @click="onSearch">Search</button>
      </div>

      <!-- Trending Searches -->
      <div class="trending-section">
        <p class="trending-label">Popular Tags</p>
        <div class="trending-tags">
          <span 
            class="trending-tag" 
            v-for="tag in popularTags" 
            :key="tag.id"
            @click="filterByTag(tag.name)"
            :class="{ active: selectedCategory === tag.name }"
          >
            {{ tag.name }} ({{ tag.post_count }})
          </span>
        </div>
      </div>
    </div>

    <!-- Today's Top Designs -->
    <div class="designs-section">
      <h2 class="section-title">
        <span v-if="selectedCategory">{{ selectedCategory }} Designs</span>
        <span v-else>Today's Top Designs</span>
      </h2>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading amazing designs...</p>
      </div>
      
      <!-- Designs Grid -->
      <div v-else class="designs-grid">
        <div class="design-card" v-for="design in designs" :key="design.id" @click="openDesignDetail(design)">
          <div class="design-image-container">
            <img 
              :src="design.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'" 
              :alt="design.title" 
              class="design-image" 
            />
            <div class="design-tags">
              <span class="design-tag" v-for="tag in design.tags.slice(0, 2)" :key="tag">{{ tag }}</span>
            </div>
            <div class="design-stats">
              <div class="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>{{ design.views }}</span>
              </div>
              <div class="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>{{ design.comments }}</span>
              </div>
            </div>
          </div>
          <div class="design-footer">
            <div class="designer-info">
              <div class="designer-avatar">
                <img :src="design.designer.avatar" :alt="design.designer.name" />
              </div>
              <div class="designer-details">
                <span class="designer-name">{{ design.designer.name }}</span>
                <span class="design-title">{{ design.title }}</span>
              </div>
            </div>
            <div class="like-section">
              <svg 
                class="heart-icon" 
                :class="{ liked: design.liked }" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none"
                @click.stop="toggleLike(design)"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" :fill="design.liked ? '#ef4444' : 'none'" :stroke="design.liked ? '#ef4444' : 'currentColor'" stroke-width="2"/>
              </svg>
              <span class="like-count">{{ design.likes }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="!loading && hasMore" class="load-more-section">
        <button class="load-more-btn" @click="loadMoreDesigns" :disabled="loadingMore">
          <span v-if="loadingMore">Loading...</span>
          <span v-else>Load More Designs</span>
        </button>
      </div>

      <!-- No Results -->
      <div v-if="!loading && designs.length === 0" class="no-results">
        <div class="no-results-icon">🎨</div>
        <h3>No designs found</h3>
        <p v-if="selectedCategory">No designs found for "{{ selectedCategory }}". Try browsing other categories.</p>
        <p v-else>No designs available at the moment. Check back later!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InteriorDesignPage',
  data() {
    return {
      selectedCategory: '',
      searchQuery: '',
      designs: [],
      availableTags: [],
      popularTags: [],
      loading: true,
      loadingMore: false,
      hasMore: true,
      currentPage: 1,
      pageSize: 12
    }
  },
  methods: {
    async fetchTags() {
      try {
        const response = await fetch(`${this.$store.state.root_api}community/api/public/tags/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          this.availableTags = data.data;
          // Get top 5 popular tags for trending section
          this.popularTags = data.data.slice(0, 5);
        }
      } catch (error) {
        console.error('Failed to load tags:', error);
      }
    },

    async fetchDesigns(page = 1, append = false) {
      try {
        if (page === 1) {
          this.loading = true;
        } else {
          this.loadingMore = true;
        }

        const params = new URLSearchParams({
          page: page.toString(),
          page_size: this.pageSize.toString()
        });

        if (this.selectedCategory) {
          params.append('tag', this.selectedCategory);
        }

        const response = await fetch(
          `${this.$store.state.root_api}community/api/public/posts/?${params}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          const newDesigns = data.data;
          
          if (append) {
            this.designs = [...this.designs, ...newDesigns];
          } else {
            this.designs = newDesigns;
          }

          this.hasMore = data.pagination.has_next;
          this.currentPage = data.pagination.current_page;
        }
      } catch (error) {
        console.error('Failed to load designs:', error);
        this.$message?.error('Failed to load designs');
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },

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
      this.selectedCategory = tagName;
      this.onCategoryChange();
    },

    onSearch() {
      // For now, just filter by category
      // You can enhance this to include text search functionality
      this.onCategoryChange();
    },

    async toggleLike(design) {
      // Only allow liked if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        this.$message?.warning('Please login to like posts');
        return;
      }

      try {
        const response = await fetch(`${this.$store.state.root_api}community/api/posts/like/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            post_id: design.id
          })
        });

        const data = await response.json();
        if (data.success) {
          design.liked = data.data.action === 'liked';
          design.likes = data.data.like_count;
        }
      } catch (error) {
        console.error('Failed to toggle like:', error);
        this.$message?.error('Failed to update like');
      }
    },

    openDesignDetail(design) {
      // Navigate to design detail page or open modal
      this.$router.push(`/design/${design.id}`);
    }
  },

  async mounted() {
    await this.fetchTags();
    await this.fetchDesigns();
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.design-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f8f9ff;
  min-height: 100vh;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  position: relative;
  padding: 80px 20px 100px;
  overflow: hidden;
}

.wave-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: 
    url("../../assets/pricing-banner.png");
  opacity: 0.8;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.hero-images {
  display: flex;
  gap: 20px;
  flex: 1;
}

.hero-image-left,
.hero-image-right {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.hero-image-left {
  width: 280px;
  height: 200px;
}

.hero-image-right {
  width: 280px;
  height: 200px;
  margin-top: 40px;
}

.hero-image-left img,
.hero-image-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-text {
  flex: 1;
  text-align: center;
  padding: 0 40px;
  color: white;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
  line-height: 1.5;
  font-weight: 400;
}

/* Search Section */
.search-section {
  padding: 40px 20px 60px;
  position: relative;
  top: -40px;
  border-radius: 24px 24px 0 0;
  margin: 0 20px;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 30px;
}

.search-dropdown {
  position: relative;
}

.category-select {
  appearance: none;
  background: #f8f9ff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  min-width: 150px;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

.search-input-container {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  background: #f8f9ff;
  color: #374151;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #4F46E5;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-btn {
  background: #4F46E5;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-btn:hover {
  background: #4338CA;
}

.trending-section {
  text-align: center;
}

.trending-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  font-weight: 500;
}

.trending-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.trending-tag {
  background: #f3f4f6;
  color: #374151;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.trending-tag:hover,
.trending-tag.active {
  background: #4F46E5;
  color: white;
}

/* Designs Section */
.designs-section {
  padding: 60px 20px 80px;
  background: #f1f5f9;
}

.section-title {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 50px;
  letter-spacing: -0.5px;
}

/* Loading States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #4F46E5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  transform: translateY(-8px);
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



.design-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f8f9ff;
  min-height: 100vh;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  position: relative;
  padding: 80px 20px 100px;
  overflow: hidden;
}

.wave-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: 
    url("../../assets/pricing-banner.png");
  opacity: 0.8;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.hero-images {
  display: flex;
  gap: 20px;
  flex: 1;
}

.hero-image-left,
.hero-image-right {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.hero-image-left {
  width: 280px;
  height: 200px;
}

.hero-image-right {
  width: 280px;
  height: 200px;
  margin-top: 40px;
}

.hero-image-left img,
.hero-image-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-text {
  flex: 1;
  text-align: center;
  padding: 0 40px;
  color: white;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
  line-height: 1.5;
  font-weight: 400;
}

/* Search Section */
.search-section {
  /* background: white; */
  padding: 40px 20px 60px;
  position: relative;
  top: -40px;
  border-radius: 24px 24px 0 0;
  margin: 0 20px;
  /* box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1); */
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 30px;
}

.search-dropdown {
  position: relative;
}

.category-select {
  appearance: none;
  background: #f8f9ff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  min-width: 150px;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

.search-input-container {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  background: #f8f9ff;
  color: #374151;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #4F46E5;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-btn {
  background: #4F46E5;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-btn:hover {
  background: #4338CA;
}

.trending-section {
  text-align: center;
}

.trending-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  font-weight: 500;
}

.trending-tags {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.trending-tag {
  background: #f3f4f6;
  color: #374151;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.trending-tag:hover {
  background: #4F46E5;
  color: white;
}

/* Designs Section */
.designs-section {
  padding: 60px 20px 80px;
  background: #f1f5f9;
}

.section-title {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 50px;
  letter-spacing: -0.5px;
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
  transform: translateY(-8px);
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
  width: 32px;
  height: 32px;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 40px;
  }
  
  .hero-images {
    order: 2;
  }
  
  .hero-text {
    order: 1;
    padding: 0;
  }
  
  .main-title {
    font-size: 40px;
  }
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    gap: 16px;
  }
  
  .category-select,
  .search-input,
  .search-btn {
    width: 100%;
  }
  
  .hero-images {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-image-right {
    margin-top: 0;
  }
  
  .main-title {
    font-size: 32px;
  }
  
  .designs-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 60px 16px 80px;
  }
  
  .search-section {
    margin: 0 16px;
    padding: 30px 16px 40px;
  }
  
  .designs-section {
    padding: 40px 16px 60px;
  }
  
  .hero-image-left,
  .hero-image-right {
    width: 200px;
    height: 100px;
  }
  
  .main-title {
    font-size: 28px;
  }
  
  .section-title {
    font-size: 28px;
  }
}
</style>