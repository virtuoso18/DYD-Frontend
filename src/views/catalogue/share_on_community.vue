<template>
  <!-- Enhanced Share on Community Modal -->
  <a-modal
    v-model:open="isOpen"
    title=""
    footer=""
    centered
    style="width: 100%; max-width: 900px"
    :closable="true"
    @cancel="closeModal"
    :destroyOnClose="true"
  >
    <div style="display: flex; align-items: center; flex-direction: column; justify-content: center;">
      <div style="width: 100%; text-align: start; margin-bottom: 20px;">
        <h3 style="margin: 0; font-size: 24px; font-weight: 600;">Share on Community</h3>
        <p style="margin: 5px 0; color: #666;">Share your amazing design with the community!</p>
      </div>
      
      <a-row style="width: 100%" :gutter="20">
        <!-- Image Preview -->
        <a-col :sm="24" :xs="24" :lg="10" :md="10">
          <div style="position: relative;">
            <img
              :src="imageUrl"
              style="border-radius: 12px; width: 100%; max-height: 400px; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
              alt="Room Design"
            />
            <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); border-radius: 8px; padding: 5px 10px; color: white; font-size: 12px;">
              Preview
            </div>
          </div>
        </a-col>

        <!-- Form Section -->
        <a-col
          :sm="24"
          :xs="24"
          :lg="14"
          :md="14"
          style="display: flex; justify-content: space-between; flex-direction: column; min-height: 400px;"
        >
          <div style="flex: 1;">
            <!-- Title Input -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">
                Post Title <span style="color: red;">*</span>
              </label>
              <a-input
                v-model:value="shareForm.title"
                placeholder="Give your design an attractive title..."
                size="large"
                :maxlength="200"
                show-count
                style="border-radius: 8px;"
              />
            </div>

            <!-- Tags Section -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">
                Tags
                <span style="color: #666; font-weight: 400; font-size: 12px;">(Help others discover your design)</span>
              </label>
              
              <!-- Tag Select -->
              <a-select
                v-model:value="shareForm.selectedTags"
                mode="tags"
                placeholder="Select existing tags or create new ones..."
                style="width: 100%; border-radius: 8px;"
                size="large"
                :options="availableTags"
                :loading="tagsLoading"
                @search="handleTagSearch"
                @select="handleTagSelect"
                :filter-option="false"
                :not-found-content="tagsLoading ? 'Loading...' : 'No tags found - type to create new'"
              >
                <template #tagRender="{ label, value, closable, onClose, option }">
                  <a-tag
                    :color="option?.color || getRandomTagColor()"
                    :closable="closable"
                    @close="onClose"
                    style="margin: 2px; padding: 4px 8px; border-radius: 6px;"
                  >
                    {{ label }}
                  </a-tag>
                </template>
              </a-select>
              
              <!-- Popular Tags -->
              <div v-if="popularTags.length > 0" style="margin-top: 10px;">
                <span style="font-size: 12px; color: #666; margin-bottom: 8px; display: block;">Popular tags:</span>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  <a-tag
                    v-for="tag in popularTags.slice(0, 8)"
                    :key="tag.value"
                    :color="tag.color"
                    style="cursor: pointer; border-radius: 12px; margin: 0;"
                    @click="addPopularTag(tag)"
                  >
                    {{ tag.label }}
                  </a-tag>
                </div>
              </div>
            </div>

            <!-- Room Info Display -->
            <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#666">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <span style="font-weight: 500; color: #333;">Room Details</span>
              </div>
              <div style="display: flex; gap: 15px; font-size: 14px; color: #666; flex-wrap: wrap;">
                <span v-if="roomType"><strong>Type:</strong> {{ roomType }}</span>
                <span v-if="roomDesignType"><strong>Style:</strong> {{ roomDesignType }}</span>
                <span v-if="productCount"><strong>Products:</strong> {{ productCount }} items</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px; margin-top: 20px;">
            <a-button 
              type="default" 
              size="large" 
              style="flex: 1; border-radius: 8px; height: 48px;"
              @click="closeModal"
            >
              Cancel
            </a-button>
            <a-button
              type="primary"
              size="large"
              :loading="shareLoading"
              :disabled="!shareForm.title.trim()"
              @click="handleShare"
              style="flex: 2; border-radius: 8px; height: 48px; display: flex; justify-content: center; align-items: center; gap: 8px;"
            >
              <svg v-if="!shareLoading" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.125 5.64648C17.125 6.95816 16.0617 8.02148 14.75 8.02148C13.4383 8.02148 12.375 6.95816 12.375 5.64648C12.375 4.33481 13.4383 3.27148 14.75 3.27148C16.0617 3.27148 17.125 4.33481 17.125 5.64648Z" stroke="white" stroke-width="1.5"/>
                <path d="M7.625 10C7.625 11.3117 6.56167 12.375 5.25 12.375C3.93833 12.375 2.875 11.3117 2.875 10C2.875 8.68829 3.93833 7.625 5.25 7.625C6.56167 7.625 7.625 8.68829 7.625 10Z" stroke="white" stroke-width="1.5"/>
                <path d="M17.125 14.3535C17.125 15.6652 16.0617 16.7285 14.75 16.7285C13.4383 16.7285 12.375 15.6652 12.375 14.3535C12.375 13.0418 13.4383 11.9785 14.75 11.9785C16.0617 11.9785 17.125 13.0418 17.125 14.3535Z" stroke="white" stroke-width="1.5"/>
                <path d="M7.40625 9.00937L12.5521 6.63477M7.40625 10.9889L12.5521 13.3635" stroke="white" stroke-width="1.5"/>
              </svg>
              {{ shareLoading ? 'Sharing...' : 'Share on Community' }}
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'ShareOnCommunity',
  props: {
    open: {
      type: Boolean,
      required: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    roomId: {
      type: [String, Number],
      default: null
    },
    roomType: {
      type: String,
      default: ''
    },
    roomDesignType: {
      type: String,
      default: ''
    },
    productCount: {
      type: Number,
      default: 0
    },
    apiBaseUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      shareForm: {
        title: '',
        selectedTags: []
      },
      availableTags: [],
      popularTags: [],
      tagsLoading: false,
      tagSearchTimeout: null,
      shareLoading: false,
      tagColors: [
        '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
        '#13c2c2', '#eb2f96', '#fa8c16', '#a0d911', '#2f54eb'
      ]
    };
  },
  computed: {
    isOpen: {
      get() {
        return this.open;
      },
      set(val) {
        this.$emit('update:open', val);
      }
    }
  },
  watch: {
    open(newVal) {
      if (newVal) {
        this.resetShareForm();
        // Only load tags when modal opens
        this.loadAvailableTags();
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:open', false);
    },

    resetShareForm() {
      this.shareForm = {
        title: this.roomType ? `My ${this.roomType} Design` : 'My Room Design',
        selectedTags: []
      };
    },

    async loadAvailableTags() {
      this.tagsLoading = true;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`${this.apiBaseUrl}community/api/tags/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          this.availableTags = data.data.map(tag => ({
            label: tag.name,
            value: tag.id,
            color: tag.color,
            post_count: tag.post_count || 0
          }));
          
          this.popularTags = this.availableTags
            .sort((a, b) => (b.post_count || 0) - (a.post_count || 0))
            .slice(0, 10);
            
          this.addSuggestedTags();
        }
      } catch (error) {
        console.error('Failed to load tags:', error);
        // Don't show error message, just continue with empty tags
        this.availableTags = [];
        this.popularTags = [];
      } finally {
        this.tagsLoading = false;
      }
    },
    
    addSuggestedTags() {
      const suggestedTags = [];
      
      if (this.roomType) {
        suggestedTags.push({
          label: this.roomType.toLowerCase().replace('_', ' '),
          value: `room_${this.roomType.toLowerCase()}`,
          color: this.getRandomTagColor(),
          isNew: true
        });
      }
      
      if (this.roomDesignType) {
        suggestedTags.push({
          label: this.roomDesignType.toLowerCase(),
          value: `style_${this.roomDesignType.toLowerCase()}`,
          color: this.getRandomTagColor(),
          isNew: true
        });
      }

      suggestedTags.forEach(tag => {
        if (!this.availableTags.some(t => t.label === tag.label)) {
          this.availableTags.unshift(tag);
        }
      });
    },
    
    handleTagSearch(value) {
      if (this.tagSearchTimeout) {
        clearTimeout(this.tagSearchTimeout);
      }
      
      this.tagSearchTimeout = setTimeout(() => {
        if (value && !this.availableTags.some(tag => 
          tag.label.toLowerCase().includes(value.toLowerCase())
        )) {
          const newTag = {
            label: value,
            value: `new_${Date.now()}`,
            color: this.getRandomTagColor(),
            isNew: true
          };
          
          this.availableTags.unshift(newTag);
        }
      }, 500);
    },

    handleTagSelect(value, option) {
      console.log('Selected tag:', value, option);
    },

    addPopularTag(tag) {
      if (!this.shareForm.selectedTags.includes(tag.value)) {
        this.shareForm.selectedTags.push(tag.value);
      }
    },

    getRandomTagColor() {
      return this.tagColors[Math.floor(Math.random() * this.tagColors.length)];
    },

    async handleShare() {
      if (!this.shareForm.title.trim()) {
        this.$message.error('Please enter a title for your post');
        return;
      }

      if (!this.roomId) {
        this.$message.error('Room ID is missing');
        return;
      }

      this.shareLoading = true;

      try {
        const tagIds = await this.createNewTags();

        const postData = {
          title: this.shareForm.title,
          room_id: this.roomId,
          tag_ids: tagIds
        };

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`${this.apiBaseUrl}community/api/posts/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });

        const data = await response.json();

        if (data.success) {
          this.$message.success('Your design has been shared on community!');
          this.$emit('success');
          this.closeModal();
        } else {
          throw new Error(data.message || 'Failed to share post');
        }

      } catch (error) {
        console.error('Failed to share on community:', error);
        this.$message.error(error.message || 'Failed to share your design');
      } finally {
        this.shareLoading = false;
      }
    },

    async createNewTags() {
      const tagIds = [];
      
      for (const tagValue of this.shareForm.selectedTags) {
        const existingTag = this.availableTags.find(t => t.value === tagValue);
        
        if (existingTag && !existingTag.isNew) {
          tagIds.push(existingTag.value);
        } else {
          try {
            const tagName = existingTag ? existingTag.label : tagValue;
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${this.apiBaseUrl}community/api/tags/`, {
              method: 'POST',
              headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: tagName,
                color: this.getRandomTagColor(),
                description: `Tag for ${tagName} designs`
              })
            });

            const data = await response.json();
            if (data.success) {
              tagIds.push(data.data.id);
            }
          } catch (error) {
            console.error('Failed to create tag:', error);
          }
        }
      }
      
      return tagIds;
    }
  }
};
</script>