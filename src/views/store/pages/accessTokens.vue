<template>
  <!-- Create Token Modal -->
  <a-modal
    :open="create_token_modal"
    :title="t('settings.accessTokens.createModalTitle')"
    @ok="createAccessToken"
    @cancel="closeCreateTokenModal"
    :confirmLoading="createTokenLoading"
    :okText="t('settings.accessTokens.createButton')"
  >
    <div style="display: flex; flex-direction: column; gap: 15px; padding: 8px 0;">
      <div>
        <label style="display: block; margin-bottom: 5px; font-weight: 500;">
          {{ t('settings.accessTokens.labelField') }}
        </label>
        <a-input
          v-model:value="newToken.label"
          :placeholder="t('settings.accessTokens.labelPlaceholder')"
        />
      </div>
      
    </div>
  </a-modal>



  <!-- Access Tokens Section -->
  <div style="border: 1px solid rgba(0,0,0,0.2); padding: 15px; border-radius: 7px; margin-bottom: 20px;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <div>
        <h4 class="!text-gray-700" style="margin-bottom: 4px;">
          {{ t('settings.accessTokens.title') }}
        </h4>
        <p style="margin-bottom: 0;">
          {{ t('settings.accessTokens.description') }}
        </p>
      </div>
      <a-button type="primary" @click="openCreateTokenModal" :icon="h(PlusOutlined)" v-if="paginatedTokens.length===0">
        {{ t('settings.accessTokens.newButton') }}
      </a-button>
    </div>

    <!-- Loading -->
    <div v-if="tokensLoading" style="text-align: center; padding: 30px 0;">
      <a-spin />
    </div>

    <!-- Empty state -->
    <a-empty
      v-else-if="tokens.length === 0"
      :description="t('settings.accessTokens.empty')"
      style="padding: 20px 0;"
    />

    <!-- Token list -->
    <template v-else>
      <div
        v-for="token in paginatedTokens"
        :key="token.key"
        class="token-row"
        
        style="cursor: pointer;"
      >
        <div style="flex: 1; min-width: 0;">
          <!-- Label + status badges -->
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
            <span style="font-weight: 500; color: rgba(0,0,0,0.85); font-size: 14px;">
              {{ token.label || t('settings.accessTokens.unnamedToken') }}
            </span>
            <a-tag :color="token.is_active ? 'success' : 'default'" style="margin: 0;">
              {{ token.is_active ? t('settings.accessTokens.active') : t('settings.accessTokens.inactive') }}
            </a-tag>
            <a-tag v-if="isExpired(token)" color="error" style="margin: 0;">
              {{ t('settings.accessTokens.expired') }}
            </a-tag>
          </div>
          <!-- Key preview + meta -->
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <span style="font-family: monospace; font-size: 12px; color: rgba(0,0,0,0.45);">
              {{ maskKey(token.key) }}
            </span>
            <span style="font-size: 12px; color: rgba(0,0,0,0.45);">
              {{ t('settings.accessTokens.created') }}: {{ formatDate(token.created) }}
            </span>
            <span v-if="token.expires_at" style="font-size: 12px; color: rgba(0,0,0,0.45);">
              {{ t('settings.accessTokens.expires') }}: {{ formatDate(token.expires_at) }}
            </span>
            <span v-else style="font-size: 12px; color: rgba(0,0,0,0.45);">
              {{ t('settings.accessTokens.noExpiry') }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
            <a-button type="primary" size="small" @click="openTokenModal(token)" style="display:flex;justify-content: center;align-items: center;" ><EyeOutlined /></a-button>
        
          <a-popconfirm
            placement="left"
            :title="t('settings.accessTokens.deleteConfirm')"
            :ok-text="t('settings.accessTokens.deleteOk')"
            :cancel-text="t('settings.accessTokens.deleteCancel')"
            @confirm.stop="deleteToken(token.key)"
          >
            <a-button type="text" danger size="small" style="display:flex;justify-content: center;align-items: center;" ><DeleteOutlined/> </a-button>
          </a-popconfirm>
        </div>
      </div>

      <!-- Pagination -->
      <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
        <a-pagination
          v-model:current="currentPage"
          :total="tokens.length"
          :pageSize="pageSize"
          size="small"
          :showSizeChanger="false"
        />
      </div>
    </template>

  </div>
 <a-modal
  :open="view_token_modal"
  :title="null"
  @cancel="view_token_modal = false"
  :footer="null"
  :centered="true"
  width="700px"
  >
  <!-- class="integration-modal" -->
  <div class="modal-header">
    <h3>{{  'Integration Code' }}</h3>
    <p class="modal-description">Copy and paste the following code snippets to integrate the DYD in your Wix, Wordpress, Shopify site.</p>
  </div>

  <div class="snippets-container">
     <div class="snippet-item">
      <div class="snippet-label">
        <span class="label-text">Headers</span>
        <span class="label-badge"><button  @click="copyText( widgetSnippets.css+widgetSnippets.js )">
          <CopyOutlined />
          <span>Copy</span>
        </button></span>
      </div>
      <div style="line-height: 29px;margin-bottom:20px;width:100%;overflow-x: scroll;overflow-y: hidden;">
        <code class="snippet-code">{{ widgetSnippets.css }}</code>
        
        <code class="snippet-code">{{ widgetSnippets.js }}</code>
        
      </div>
    </div>


    <!-- CSS Snippet -->
    <!-- <div class="snippet-item">
      <div class="snippet-label">
        <span class="label-text">CSS</span>
        <span class="label-badge">Stylesheet</span>
      </div>
      <div class="snippet-content">
        <code class="snippet-code">{{ widgetSnippets.css }}</code>
        <button class="copy-btn" @click="copyText(widgetSnippets.css)">
          <CopyOutlined />
          <span>Copy</span>
        </button>
      </div>
    </div> -->

    <!-- JS Snippet -->
    <!-- <div class="snippet-item">
      <div class="snippet-label">
        <span class="label-text">JavaScript</span>
        <span class="label-badge">Module</span>
      </div>
      <div class="snippet-content">
        <code class="snippet-code">{{ widgetSnippets.js }}</code>
        <button class="copy-btn" @click="copyText(widgetSnippets.js)">
          <CopyOutlined />
          <span>Copy</span>
        </button>
      </div>
    </div> -->

    <!-- Widget DIV Snippet -->
    <div class="snippet-item">
      <div class="snippet-label">
        <span class="label-text">Widget Container</span>
        <span class="label-badge"><button  @click="copyText(widgetSnippets.div)">
          <CopyOutlined />
          <span>Copy</span>
        </button></span>
      </div>
      <div class="snippet-content multi-line">
        <code class="snippet-code multi-line">{{ widgetSnippets.div }}</code>
        
      </div>
    </div>
  </div>

  <div class="modal-footer">
    <a-button @click="view_token_modal = false">
      {{  'Close' }}
    </a-button>
  </div>
</a-modal>
</template>

<script>
import { h } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import { PlusOutlined, DeleteOutlined, CopyOutlined ,EyeOutlined} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

export default {
  name: 'AccessTokens',

  components: { PlusOutlined, DeleteOutlined, CopyOutlined,EyeOutlined },

  setup() {
    const { t } = useI18n();
    return { t, h, PlusOutlined, DeleteOutlined,EyeOutlined };
  },

  data() {
    return {
      tokens: [],
      tokensLoading: false,
      businessSlug: '',
      view_token_modal:false,
      selectedToken:null,
      // Pagination
      currentPage: 1,
      pageSize: 5,

      // Create modal
      create_token_modal: false,
      createTokenLoading: false,
      newToken: {
        label: '',
        expires_at: null,
      },

     
    };
  },

 computed: {
  paginatedTokens() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.tokens.slice(start, start + this.pageSize);
  }, // ✅ REQUIRED

  // widgetSnippets() {
  //   if (!this.selectedToken) return { css: '', js: '', div: '' };

  //   const token = this.selectedToken.key;
  //   const brand = this.businessSlug;

  //   return {
  //     css: `<link rel="stylesheet" href="http://localhost:5173/src/widget.css" />`,
  //     js: `<scr` + `ipt src="http://localhost:5173/src/widget.js" type="module"></scr` + `ipt>`,
  //     div: `<div data-my-widget
  //       data-brand="${brand}"
  //       data-label="Try in your room :"
  //       data-token="${token}"
  //       data-title="Visualize This Product"
  //       data-height="90vh"
  //       data-locale="en">
  //     </div>`
  //   };
  // }
  widgetSnippets() {
  if (!this.selectedToken) return { css: '', js: '', div: '' };

  const token = this.selectedToken.key;
  const brand = this.businessSlug;

  const baseUrl = window.location.origin;

  return {
    css: `<link rel="stylesheet" href="${baseUrl}/src/widget.css" />`,
    js: `<scr` + `ipt src="${baseUrl}/src/widget.js" type="module"></scr` + `ipt>`,
    div: `<div data-my-widget
      data-brand="${brand}"
      data-label="Try in your room :"
      data-token="${token}"
      data-title="Visualize This Product"
      data-height="90vh"
      data-locale="en">
    </div>`
  };
}
},
  mounted() {
    this.fetchTokens();
  },

  methods: {
    openTokenModal(token) {
    debugger
    this.selectedToken = token;
    this.view_token_modal = true;
    },
    async copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        message.success('Copied!');
    } catch {
        message.error('Copy failed');
    }
    },
    getAuthToken() {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return token;
    },

    async fetchTokens() {
      this.tokensLoading = true;
      try {
        const token = this.getAuthToken();
        const response = await fetch(
          this.$store.state.root_api + 'Auth/api/guest-tokens/',
          {
            method: 'GET',
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (!response.ok) throw new Error('Failed to fetch tokens');
        const data = await response.json();
        // Expect: { tokens: [...] }
        this.tokens = (data.tokens || []).map(t => ({ ...t, _toggling: false }));
        this.businessSlug = data?.business_slug;
      } catch (error) {
        console.error(error);
        message.error(this.t('settings.accessTokens.fetchFailed'));
      } finally {
        this.tokensLoading = false;
      }
    },

    openCreateTokenModal() {
      this.newToken = { label: '', expires_at: null };
      this.create_token_modal = true;
    },

    closeCreateTokenModal() {
      this.create_token_modal = false;
    },

    async createAccessToken() {
      this.createTokenLoading = true;
      try {
        const token = this.getAuthToken();
        const payload = {
          label: this.newToken.label || '',
          expires_at: this.newToken.expires_at
            ? dayjs(this.newToken.expires_at).toISOString()
            : null,
        };
        const response = await fetch(
          this.$store.state.root_api + 'Auth/api/guest-tokens/',
          {
            method: 'POST',
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          },
        );
         const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create token');
       
        // Expect: { token: { key, label, is_active, created, expires_at } }
        this.tokens.unshift({ ...data.token, _toggling: false });
        this.createdTokenKey = data.token.key;
        this.closeCreateTokenModal();
        // this.view_token_modal = true;
        this.copied = false;
      } catch (error) {
        console.error(error);
        message.error(error.message || this.t('settings.accessTokens.createFailed'));
      } finally {
        this.createTokenLoading = false;
      }
    },

    async toggleTokenActive(token, value) {
      token._toggling = true;
      try {
        const authToken = this.getAuthToken();
        const response = await fetch(
          this.$store.state.root_api + `Auth/api/guest-tokens/${token.key}/`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Token ${authToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_active: value }),
          },
        );
        if (!response.ok) throw new Error('Failed to update token');
        const data = await response.json();
        token.is_active = data.token.is_active;
        message.success(this.t('settings.accessTokens.updateSuccess'));
      } catch (error) {
        console.error(error);
        message.error(this.t('settings.accessTokens.updateFailed'));
      } finally {
        token._toggling = false;
      }
    },

    async deleteToken(key) {
      try {
        const authToken = this.getAuthToken();
        const response = await fetch(
          this.$store.state.root_api + `Auth/api/guest-tokens/${key}/`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Token ${authToken}`,
            },
          },
        );
        if (!response.ok) throw new Error('Failed to delete token');
        this.tokens = this.tokens.filter(t => t.key !== key);
        // reset page if current page is now empty
        const maxPage = Math.ceil(this.tokens.length / this.pageSize) || 1;
        if (this.currentPage > maxPage) this.currentPage = maxPage;
        message.success(this.t('settings.accessTokens.deleteSuccess'));
      } catch (error) {
        console.error(error);
        message.error(this.t('settings.accessTokens.deleteFailed'));
      }
    },

    async copyToken() {
      try {
        await navigator.clipboard.writeText(this.createdTokenKey);
        this.copied = true;
        setTimeout(() => { this.copied = false; }, 2000);
      } catch {
        message.error(this.t('settings.accessTokens.copyFailed'));
      }
    },

    maskKey(key) {
      if (!key) return '';
      return key.slice(0, 8) + '••••••••••••••••••••••••' + key.slice(-4);
    },

    formatDate(dateStr) {
      if (!dateStr) return '—';
      return dayjs(dateStr).format('DD MMM YYYY, HH:mm');
    },

    isExpired(token) {
      if (!token.expires_at) return false;
      return dayjs().isAfter(dayjs(token.expires_at));
    },

    disablePastDates(current) {
      return current && current < dayjs().startOf('day');
    },
  },
};
</script>

<style scoped>
.token-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.token-row:last-of-type {
  border-bottom: none;
}

label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
p {
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 0;
}
h4 {
  margin-bottom: 4px;
}

.integration-modal :deep(.ant-modal-content) {
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
}

.integration-modal :deep(.ant-modal-body) {
  padding: 0;
}

.modal-header {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
}

.modal-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.modal-description {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.snippets-container {
  /* padding: 20px 24px; */
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.snippet-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  transition: all 0.2s ease;
}

.snippet-item:hover {
  border-color: #d9d9d9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.snippet-label {
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  gap: 10px;
}

.label-text {
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
}

.label-badge {
  font-size: 11px;
  padding: 2px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.snippet-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
}

.snippet-content.multi-line {
  align-items: stretch;
}

.snippet-code {
  flex: 1;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #2c3e50;
  background: #f6f8fa;
  padding: 10px 12px;
  border-radius: 6px;
  margin: 0;
  overflow-x: auto;
  white-space: nowrap;
}

.snippet-code.multi-line {
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.copy-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
  background: #f0f7ff;
}

.copy-btn:active {
  transform: scale(0.98);
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e8e8e8;
  background: #fafafa;
  display: flex;
  justify-content: flex-end;
}

/* Scrollbar styling */
.snippets-container::-webkit-scrollbar {
  width: 6px;
}

.snippets-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.snippets-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.snippets-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 768px) {
  .integration-modal :deep(.ant-modal) {
    max-width: 100% !important;
    margin: 0;
    top: 0;
  }

  .integration-modal :deep(.ant-modal-content) {
    border-radius: 0;
    height: 100vh;
  }

  .snippets-container {
    max-height: calc(100vh - 200px);
  }

  .snippet-content {
    flex-direction: column;
  }

  .copy-btn {
    width: 100%;
    justify-content: center;
  }

  .snippet-code {
    width: 100%;
    font-size: 11px;
  }
}

</style>