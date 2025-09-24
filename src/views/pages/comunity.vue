<template>
  <div class="design-page">
    <!-- Header Section with Blue Background -->
    <div class="blue-section">
      <div class="hero-content">
        <h1 class="hero-title">Discover the world's top<br>interior design inspiration</h1>
        <p class="hero-subtitle">Explore the work of the most talented designers to inspire your work.</p>
      </div>
      
      <!-- Hero Images -->
      <div class="hero-images">
        <div class="image-card image-left">
          <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Modern living room">
        </div>
        
        <div class="image-card image-right">
          <img src="https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Elegant interior">
        </div>
      </div>
    </div>
    
    <!-- White Section with Search -->
    <div class="white-section">
      <div class="search-section">
        <div class="search-container">
          <!-- Custom Dropdown -->
          <div class="custom-dropdown" @click="toggleDropdown">
            <div class="dropdown-selected">
              <img :src="selectedCategoryIcon" alt="Interior" class="selected-icon">
              <span class="selected-text">{{ selectedCategoryText }}</span>
            </div>
            <ul class="dropdown-options" v-show="showDropdown">
              <li v-for="category in categoryOptions" :key="category.value" 
                  @click="selectCategory(category)"
                  :data-value="category.value">
                {{ category.text }}
              </li>
            </ul>
          </div>
          
          <input 
            type="text" 
            class="search-input" 
            placeholder="What are you looking for?"
            v-model="searchQuery"
            @keyup.enter="onSearch"
          >
          <button class="search-button" @click="onSearch">Search</button>
        </div>
      </div>
      
      <!-- Trending Section -->
      <div class="trending-section">
        <h3>Trending searches</h3>
        <div class="trending-tags">
          <a href="#" class="tag" v-for="tag in trendingTags" :key="tag" @click.prevent="filterByTag(tag)">
            {{ tag }}
          </a>
        </div>
      </div>
    </div>

    <!-- Designs Grid Section -->
    <div class="designs-grid-section">
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
              :src="getImageUrl(design.image)" 
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
                <img :src="getImageUrl(design.designer.avatar)" :alt="design.designer.name" />
              </div>
              <div class="designer-details">
                <span class="designer-name">{{ design.designer.name }}</span>
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
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                :fill="design.liked ? '#ef4444' : 'none'" 
                :stroke="design.liked ? '#ef4444' : 'currentColor'" 
                stroke-width="2"/>
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
  name: 'InteriorDesignCommunityPage',
  data() {
    return {
      // Search and filter data
      selectedCategory: '',
      selectedCategoryText: 'Interior Design',
      selectedCategoryIcon: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
      searchQuery: '',
      showDropdown: false,
      
      // Category options
      categoryOptions: [
        { value: 'interior', text: 'Interior Design' },
        { value: 'architecture', text: 'Architecture' },
        { value: 'furniture', text: 'Furniture' },
        { value: 'lighting', text: 'Lighting' }
      ],
      
      // Trending tags
      trendingTags: [
        'Modern Interior',
        'Kitchen setup', 
        'Bedroom kids',
        'Dining room elegant',
        'Scandinavian'
      ],
      
      // Design data
      designs: [],
      availableTags: [],
      popularTags: [],
      
      // Loading states
      loading: true,
      loadingMore: false,
      hasMore: true,
      currentPage: 1,
      pageSize: 12
    }
  },
  methods: {
    // Dropdown methods
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    
    selectCategory(category) {
      this.selectedCategory = category.value;
      this.selectedCategoryText = category.text;
      this.showDropdown = false;
      this.onCategoryChange();
    },
    
    // API methods
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

    // Filter and search methods
    onCategoryChange() {
      this.currentPage = 1;
      this.hasMore = true;
      this.fetchDesigns();
    },

    filterByTag(tagName) {
      this.selectedCategory = tagName.toLowerCase().replace(/\s+/g, '');
      this.selectedCategoryText = tagName;
      this.onCategoryChange();
    },

    onSearch() {
      this.onCategoryChange();
    },

    // Utility methods
    getImageUrl(imagePath) {
      if (!imagePath) {
        return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
      }
      return imagePath.startsWith('http') ? imagePath : `${this.$store.state.root_media_api}${imagePath}`;
    },

    async toggleLike(design) {
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
      this.$router.push(`/design/${design.id}`);
    }
  },

  async mounted() {
    await this.fetchTags();
    await this.fetchDesigns();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.querySelector('.custom-dropdown').contains(e.target)) {
        this.showDropdown = false;
      }
    });
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: white;
}

/* Blue gradient background for top half - matches HTML exactly */
.design-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50vh;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  z-index: 0;
}

/* Decorative curved lines on blue background */
.design-page::after {
  content: '';  
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50vh;
  background-image: 
      url("../../assets/pricing-banner.png");
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
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 4;
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
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
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
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
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
  width: 200px;
  cursor: pointer;
  font-family: sans-serif;
}

.dropdown-selected {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

  .hero-images {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
    width: 100%;
    top: auto;
    left: auto;
    right: auto;
    transform: none;
  }

  .hero-images .image-card {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    margin: 0 auto;
    flex: 1 1 45%;
    max-width: 200px;
  }

  .hero-images .image-card img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    display: block;
  }

  .search-container {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .custom-dropdown {
    width: 50px;
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
</style>