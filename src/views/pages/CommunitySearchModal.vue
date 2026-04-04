<template>
  <a-modal
    :open="visible"
    :footer="null"
    :closable="false"
    :mask-closable="true"
    :width="620"
    centered
    wrap-class-name="search-modal-wrap"
    @cancel="handleClose"
  >
    <div class="sm-root">

      <!-- ── Header row ── -->
      <div class="sm-header">
        <div class="sm-input-wrap">
          <!-- Search icon -->
          <svg class="sm-search-icon" width="18" height="18" viewBox="0 0 24 24"
               fill="none" stroke="#9ca3af" stroke-width="2.2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>

          <!-- Main input -->
          <input
            ref="inputRef"
            v-model="query"
            class="sm-input"
            type="text"
            placeholder="Search designs, rooms, styles..."
            autocomplete="off"
            @input="onQueryInput"
            @keydown.escape="handleClose"
            @keydown.enter.prevent="onEnter"
          />

          <!-- Clear button -->
          <button v-if="query" class="sm-clear-btn" @click="clearQuery">
            <svg width="15" height="15" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Cancel -->
        <button class="sm-cancel-btn" @click="handleClose">Cancel</button>
      </div>

      <!-- ── Divider ── -->
      <div class="sm-divider" />

      <!-- ── Body ── -->
      <div class="sm-body">

        <!-- Loading -->
        <div v-if="loading" class="sm-state-box">
          <div class="sm-spinner" />
          <span class="sm-state-text">Searching…</span>
        </div>

        <!-- Results -->
        <template v-else-if="results.length > 0">
          <p class="sm-section-label">
            Results for
            <span class="sm-query-highlight">"{{ query }}"</span>
          </p>

          <ul class="sm-results-list">
            <li
              v-for="tag in results"
              :key="tag.id"
              class="sm-result-item"
              @click="selectTag(tag.name)"
            >
              <div class="sm-result-left">
                <span class="sm-hash">#</span>
                <span class="sm-tag-name">{{ tag.name }}</span>
              </div>
              <span class="sm-post-count">{{ formatCount(tag.post_count) }} posts</span>
            </li>
          </ul>

          <!-- View more -->
          <button
            v-if="hasNext"
            class="sm-view-more-btn"
            :disabled="loadingMore"
            @click="loadMore"
          >
            <span>{{ loadingMore ? 'Loading…' : 'View more results' }}</span>
            <svg v-if="!loadingMore" width="13" height="13" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </template>

        <!-- No results -->
        <div
          v-else-if="query.length >= 2 && !loading"
          class="sm-state-box"
        >
          <svg width="48" height="48" viewBox="0 0 24 24"
               fill="none" stroke="#d1d5db" stroke-width="1.4">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <p class="sm-empty-title">No results found</p>
          <p class="sm-empty-sub">
            Try "bedroom", "kitchen" or "modern"
          </p>
        </div>

        <!-- Default / Trending -->
        <!-- Default / Recent Tags -->
        <div v-else class="sm-trending">
        <p class="sm-section-label">Trending Searches</p>

        <!-- loading skeleton -->
        <div v-if="loadingRecent" class="sm-trend-tags">
            <span
            v-for="n in 5"
            :key="n"
            class="sm-trend-tag sm-trend-skeleton"
            />
        </div>

        <!-- populated -->
        <div v-else class="sm-trend-tags">
            <button
            v-for="tag in recentTags"
            :key="tag.id"
            class="sm-trend-tag"
            @click="applyTrend(tag.name)"
            >
            <svg width="11" height="11" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
            </svg>
            {{ tag.name }}
            </button>
        </div>
        </div>

      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "SearchModal",

  props: {
    
    visible: {
      type: Boolean,
      default: false,
    },
   
   
    /** Trending chips shown when the input is empty */
    trendingSearches: {
      type: Array,
      default: () => [
        "Modern Interior",
        "Kitchen setup",
        "Bedroom kids",
        "Dining room elegant",
        "Scandinavian",
      ],
    },
  },

  emits: ["update:visible", "select"],

  data() {
    return {
      query: "",
      results: [],
      hasNext: false,
      page: 1,
      pageSize: 8,
      loading: false,
      loadingMore: false,
      debounceTimer: null,
      recentTags: [],         
      loadingRecent: false,
    };
  },

  watch: {
    /** Auto-focus the input when the modal opens; reset on close */
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.inputRef?.focus();
        });
         this.fetchRecentTags();
      } else {
        this.resetState();
      }
    },
  },

  methods: {
    /* ─── query handling ─────────────────────────────────────── */
    async fetchRecentTags() {
  this.loadingRecent = true;
  try {
    const params = new URLSearchParams({ page: 1, page_size: 5 });
    const res = await fetch(
      `${this.$store.state.root_api}community/api/search-post-tags?${params}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    this.recentTags = json.data || [];
  } catch (err) {
    console.error("[SearchModal] fetchRecentTags error:", err);
  } finally {
    this.loadingRecent = false;
  }
},

    onQueryInput() {
      clearTimeout(this.debounceTimer);

      if (this.query.length < 2) {
        this.results = [];
        this.hasNext = false;
        return;
      }

      this.debounceTimer = setTimeout(() => {
        this.fetchTags(true);
      }, 300);
    },

    onEnter() {
      if (this.results.length > 0) {
        this.selectTag(this.results[0].name);
      }
    },

    applyTrend(trend) {
      this.query = trend;
      this.fetchTags(true);
    },

    clearQuery() {
      this.query = "";
      this.results = [];
      this.hasNext = false;
      this.$refs.inputRef?.focus();
    },

    /* ─── API ────────────────────────────────────────────────── */

    async fetchTags(reset = false) {
      if (reset) {
        this.page = 1;
        this.results = [];
        this.hasNext = false;
        this.loading = true;
      } else {
        this.loadingMore = true;
      }

      try {
        const params = new URLSearchParams({
          q: this.query,
          page: this.page,
          page_size: this.pageSize,
        });

        const res = await fetch(
          `${this.$store.state.root_api}community/api/search-post-tags?${params}`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const data = json.data || [];

        this.results = reset ? data : [...this.results, ...data];
        this.hasNext = json.pagination?.has_next ?? false;
      } catch (err) {
        console.error("[SearchModal] fetchTags error:", err);
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },

    loadMore() {
      if (!this.hasNext || this.loadingMore) return;
      this.page += 1;
      this.fetchTags(false);
    },

    /* ─── selection ──────────────────────────────────────────── */

    selectTag(tagName) {
      /** Emit to parent so the parent can navigate */
      this.$emit("select", tagName);
      this.handleClose();
    },

    /* ─── modal lifecycle ────────────────────────────────────── */

    handleClose() {
      this.$emit("update:visible", false);
    },

    resetState() {
      clearTimeout(this.debounceTimer);
      this.query = "";
      this.results = [];
      this.hasNext = false;
      this.page = 1;
      this.loading = false;
      this.loadingMore = false;
    },

    /* ─── helpers ────────────────────────────────────────────── */

    formatCount(n) {
      if (!n && n !== 0) return "0";
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
      if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
      return n.toLocaleString();
    },
  },
};
</script>

<style>
/* ── Ant Design modal overrides (not scoped so they reach the portal) ── */
.search-modal-wrap .ant-modal-content {
  border-radius: 20px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
}

.search-modal-wrap .ant-modal-body {
  padding: 0;
}
</style>

<style scoped>
/* ── Root ───────────────────────────────────────────────────────────── */
.sm-root {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ── Header ─────────────────────────────────────────────────────────── */
.sm-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
}

.sm-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f3f4f6;
  border-radius: 12px;
  padding: 10px 14px;
  transition: box-shadow 0.2s;
}

.sm-input-wrap:focus-within {
  box-shadow: 0 0 0 2px #3b63fb40;
  background: #f8f9ff;
}

.sm-search-icon {
  flex-shrink: 0;
}

.sm-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #1a1a1a;
  outline: none;
  line-height: 1.4;
}

.sm-input::placeholder {
  color: #9ca3af;
}

.sm-clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d1d5db;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  padding: 0;
  color: #6b7280;
  flex-shrink: 0;
  transition: background 0.15s;
}

.sm-clear-btn:hover {
  background: #9ca3af;
  color: #fff;
}

.sm-cancel-btn {
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #3b63fb;
  cursor: pointer;
  padding: 6px 4px;
  white-space: nowrap;
  transition: opacity 0.15s;
}

.sm-cancel-btn:hover {
  opacity: 0.75;
}

/* ── Divider ─────────────────────────────────────────────────────────── */
.sm-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 0 20px;
}

/* ── Body ────────────────────────────────────────────────────────────── */
.sm-body {
  padding: 16px 20px 20px;
  min-height: 220px;
  max-height: 420px;
  overflow-y: auto;
}

/* custom scrollbar */
.sm-body::-webkit-scrollbar {
  width: 4px;
}
.sm-body::-webkit-scrollbar-track {
  background: transparent;
}
.sm-body::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}

/* ── Section label ───────────────────────────────────────────────────── */
.sm-section-label {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
}

.sm-query-highlight {
  color: #3b63fb;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
}

/* ── Results list ────────────────────────────────────────────────────── */
.sm-results-list {
  list-style: none;
  padding: 0;
  margin: 0 0 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sm-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}

.sm-result-item:hover {
  background: #f0f4ff;
  transform: translateX(2px);
}

.sm-result-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sm-hash {
  font-size: 15px;
  font-weight: 700;
  color: #3b63fb;
  line-height: 1;
}

.sm-tag-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.sm-post-count {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

/* ── View more ───────────────────────────────────────────────────────── */
.sm-view-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  background: none;
  font-size: 13px;
  font-weight: 500;
  color: #3b63fb;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.sm-view-more-btn:hover:not(:disabled) {
  background: #f0f4ff;
  border-color: #3b63fb;
}

.sm-view-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── State boxes (loading / empty) ──────────────────────────────────── */
.sm-state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  text-align: center;
}

.sm-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b63fb;
  border-radius: 50%;
  animation: sm-spin 0.7s linear infinite;
}

@keyframes sm-spin {
  to { transform: rotate(360deg); }
}

.sm-state-text {
  font-size: 14px;
  color: #9ca3af;
}

.sm-empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.sm-empty-sub {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

/* ── Trending ────────────────────────────────────────────────────────── */
.sm-trending {
  padding-top: 4px;
}

.sm-trend-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sm-trend-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f3f4f6;
  border: none;
  border-radius: 20px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, transform 0.1s;
}

.sm-trend-tag:hover {
  background: #3b63fb;
  color: #ffffff;
  transform: translateY(-1px);
}

.sm-trend-tag svg {
  flex-shrink: 0;
}
.sm-trend-skeleton {
  width: 90px;
  background: #e5e7eb;
  color: transparent;
  pointer-events: none;
  animation: sm-pulse 1.2s ease-in-out infinite;
}

@keyframes sm-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

/* ── Mobile tweaks ───────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .sm-header {
    padding: 12px 14px;
  }

  .sm-body {
    padding: 12px 14px 16px;
    max-height: 360px;
  }

  .sm-cancel-btn {
    font-size: 13px;
  }
}
</style>