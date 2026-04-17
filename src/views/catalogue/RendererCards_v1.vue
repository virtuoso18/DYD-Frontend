<template>
  <div class="renderer-cards-wrapper">
    <!-- Stacked Cards Display -->
       <a-tooltip>
    <template #title>
        <div style="display:flex;gap:5px;justify-content: center;align-items: center;">
            
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="bottom:20px;background-color: white;border-radius:10px;border:1px solid rgba(0,0,0,0.1);">
                <circle cx="12" cy="12" r="9" stroke="black" stroke-width="1.8"/>
                <path d="M12 7v5l3 3" stroke="black" stroke-width="1.8" stroke-linecap="round"/>
            </svg>History
        </div>
        </template>

    <div class="cards-stack-container">
        <div class="cards-stack" @click="openModal" style="cursor:pointer">
            
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="position:absolute;z-index:10;right:-4px;bottom:20px;background-color: white;border-radius:10px;border:1px solid rgba(0,0,0,0.1);">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
              <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>

        <div class="stack-card stack-card--back">
          <div class="card-inner">
            <div class="card-placeholder">
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="44" height="44" rx="4" stroke="#c8b8a2" stroke-width="1.5" stroke-dasharray="4 3"/>
                <circle cx="22" cy="24" r="5" stroke="#c8b8a2" stroke-width="1.5"/>
                <path d="M8 40 L20 28 L30 36 L40 24 L52 38" stroke="#c8b8a2" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="stack-card stack-card--mid">
          <div class="card-inner">
            <div class="card-placeholder">
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="44" height="44" rx="4" stroke="#a89880" stroke-width="1.5" stroke-dasharray="4 3"/>
                <circle cx="22" cy="24" r="5" stroke="#a89880" stroke-width="1.5"/>
                <path d="M8 40 L20 28 L30 36 L40 24 L52 38" stroke="#a89880" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="stack-card stack-card--front">
          <div class="card-inner">
            <template v-if="latestImage">
              <img :src="getImageUrl(latestImage)" alt="Latest render" class="card-img" />
            </template>
            <template v-else>
              <div class="card-placeholder">
                <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="8" width="44" height="44" rx="4" stroke="#7a6a58" stroke-width="1.5" stroke-dasharray="4 3"/>
                  <circle cx="22" cy="24" r="5" stroke="#7a6a58" stroke-width="1.5"/>
                  <path d="M8 40 L20 28 L30 36 L40 24 L52 38" stroke="#7a6a58" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
                <span class="placeholder-label">No renders yet</span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- <button class="history-btn" @click="openModal">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
          <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        History
      </button> -->
    </div>
  </a-tooltip>

    <!-- ── History Modal ────────────────────────────────── -->
    <transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-panel">
          <div class="modal-header">
            <div class="modal-title-group">
              <h2 class="modal-title">Render History</h2>
              <span v-if="!loading" class="modal-count">
                {{ allImages.length }} image{{ allImages.length !== 1 ? 's' : '' }}
              </span>
            </div>
            <button class="modal-close" @click="closeModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="modal-state">
            <div class="loading-dots"><span></span><span></span><span></span></div>
            <p>Fetching renders…</p>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="modal-state">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#c0392b" stroke-width="1.5"/>
              <path d="M12 8v5M12 16v.5" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p>Failed to load renders.</p>
            <button class="retry-btn" @click="fetchRenderers">Retry</button>
          </div>

          <!-- Empty -->
          <div v-else-if="allImages.length === 0" class="modal-state">
            <svg width="48" height="48" viewBox="0 0 60 60" fill="none">
              <rect x="8" y="8" width="44" height="44" rx="6" stroke="#c8b8a2" stroke-width="1.5" stroke-dasharray="5 4"/>
              <circle cx="22" cy="26" r="5" stroke="#c8b8a2" stroke-width="1.5"/>
              <path d="M8 44 L22 30 L32 40 L42 26 L52 40" stroke="#c8b8a2" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            <p>No render history found.</p>
          </div>

          <!-- Grid -->
          <div v-else class="modal-grid">
            <div
              v-for="(img, index) in allImages"
              :key="img.id"
              class="grid-item"
              :style="{ animationDelay: `${index * 45}ms` }"
              @click="openLightbox(index)"
            >
              <img :src="getImageUrl(img.url)" :alt="img.title || 'Render'" class="grid-img" loading="lazy" />
              <div class="grid-item-overlay">
                <span class="grid-item-zoom">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
                    <path d="M20 20l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M11 8v6M8 11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </span>
                <span class="grid-item-title">{{ img.title || 'Render' }}</span>
                <span class="grid-item-date">{{ formatDate(img.created_at) }}</span>
              </div>
            </div>
          </div>
          <div v-if="!loading && allImages.length" style="padding: 12px; text-align:center;">
                <a-pagination
                  :current="currentPage"
                  :page-size="limit"
                  :total="total"
                  show-size-changer
                  :pageSizeOptions="['6', '10', '20', '50']"
                  @change="handlePageChange"
                  @showSizeChange="handlePageChange"
                />
            </div>
        </div>
      </div>
    </transition>

    <!-- ── Lightbox ─────────────────────────────────────── -->
    <transition name="lightbox-fade">
      <div v-if="lightboxIndex !== null" class="lightbox-overlay" @click.self="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <button
          class="lightbox-nav lightbox-nav--prev"
          :disabled="lightboxIndex === 0"
          @click="lightboxIndex--"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

       <div class="lightbox-body split-layout">
  
  <!-- LEFT: IMAGE -->
  <div class="lightbox-image-section">
    <transition name="img-switch" mode="out-in">
      <img
        :key="lightboxIndex"
        :src="getImageUrl(allImages[lightboxIndex].url)"
        class="lightbox-img"
      />
    </transition>
  </div>

  <!-- RIGHT: PRODUCT DETAILS -->
  <div class="lightbox-product-section" v-if="allImages[lightboxIndex].item"  @click="goto_product_Route(allImages[lightboxIndex].item)">
    
          <img
            v-if="allImages[lightboxIndex].item.image"
            :src="getImageUrl(allImages[lightboxIndex].item.image)"
            class="product-img"
          />

          <div class="product-info">
            <h3>{{ allImages[lightboxIndex].item.name }}</h3>
            
            <p class="product-type">
              {{ allImages[lightboxIndex].item.type }}
            </p>

            <p class="product-price">
              $ {{ allImages[lightboxIndex].item.unit_price }}
            </p>
          </div>
        </div>

      </div>

        <button
          class="lightbox-nav lightbox-nav--next"
          :disabled="lightboxIndex === allImages.length - 1"
          @click="lightboxIndex++"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'RendererCards',

  props: {
    rootApi: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      default: '6d4a139d-5d59-498e-aef4-a75625cfc91f',
    },
  },

  data() {
  return {
    isOpen: false,
    loading: false,
    error: false,
    renderers: [],
    lightboxIndex: null,

    // ✅ pagination
    total: 0,
    limit: 10,
    offset: 0,
    currentPage: 1,
  };
  },

  computed: {
    allImages() {
      const images = [];
      for (const renderer of this.renderers) {
        for (const file of renderer.result_files) {
          if (file.url) {
            images.push({
              id: file.id,
              url: file.url,
              title: renderer.title,
              created_at: file.created_at,

              // ✅ add this
              item: renderer.item,
            });
          }
        }
      }
      return images;
    },

    latestImage() {
      return this.allImages.length > 0 ? this.allImages[0].url : null;
    },
  },

  methods: {
    openModal() {
      this.isOpen = true;
      this.currentPage = 1;
      this.offset = 0;
      // if (!this.renderers.length) {
        this.fetchRenderers();
      // }
    },
   goto_product_Route(product) {
    console.log(product);

   
    let product_type_param = "product";
    const type = product.type; // 

    if (type === "light") {
      product_type_param = "product";
    } else if (type === "floor_texture") {
      product_type_param = "floor";
    } else if (type === "wall_texture") {
      product_type_param = "wall";
    } else if (type === "furniture") {
      product_type_param = "product";
    } else {
      product_type_param = type;
    }

    this.$router.push({
      name: "buisness_product",
      params: {
        buisness_name: product.business_slug,  // from backend
        product_type: product_type_param,
        product_id: product.product_id,        // from backend
      },
    });
  },


    closeModal() {
      this.isOpen = false;
      this.closeLightbox();
    },
    
    getImageUrl(imagePath) {
      console.log(`${this.$store.state.root_media_api}${imagePath}`)
      return `${this.$store.state.root_media_api}${imagePath}`;
    },

    openLightbox(index) {
      this.lightboxIndex = index;
    },

    closeLightbox() {
      this.lightboxIndex = null;
    },

    async fetchRenderers() {
        try {
          this.loading = true;
          this.error = false;

          const token = localStorage.getItem('token');
          const headers = token ? { Authorization: `Token ${token}` } : {};

          const response = await fetch(
            `${this.rootApi}renderer/renderer-queue/room/${this.roomId}/?limit=${this.limit}&offset=${this.offset}`,
            { method: 'GET', headers }
          );

          if (!response.ok) throw new Error('Failed to fetch');

          const result = await response.json();

          // ✅ IMPORTANT
          this.total = result.count || 0;
          this.renderers = result.results?.renderers || [];

        } catch (err) {
          console.error('Error fetching renderers:', err);
          this.error = true;
        } finally {
          this.loading = false;
        }
      },

    formatDate(isoString) {
      if (!isoString) return '';
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    },
    handlePageChange(page, pageSize) {
  this.currentPage = page;
  this.limit = pageSize;
  this.offset = (page - 1) * pageSize;

  this.fetchRenderers();
},
  },
};
</script>

<style scoped>
/* ── Wrapper ─────────────────────────────────────────── */
.renderer-cards-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Georgia', serif;
}

/* ── Stack ── Smaller cards ─────────────────────────── */
.cards-stack-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.cards-stack {
  position: relative;
  width: 70px;
  height: 110px;
}

.stack-card {
  position: absolute;
  width: 60px;
  height: 80px;
  border-radius: 8px;
  border: 1.5px solid #d4c4b0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.10);
  transition: transform 0.3s ease;
  overflow: hidden;
}

.stack-card--back  { top: 0; left: 0; transform: rotate(-8deg); z-index: 1; background: #f0ebe3; border-color: #c8b8a2; }
.stack-card--mid   { top: 2px; left: 6px; transform: rotate(-3deg); z-index: 2; background: #f7f2ec; border-color: #cbbda8; }
.stack-card--front { top: 4px; left: 12px; transform: rotate(1deg); z-index: 3; background: #fff; border-color: #b8a48e; }

.cards-stack:hover .stack-card--back  { transform: rotate(-11deg) translateY(4px); }
.cards-stack:hover .stack-card--mid   { transform: rotate(-4deg) translateY(2px); }
.cards-stack:hover .stack-card--front { transform: rotate(2deg) translateY(-2px); }

.card-inner { 
  width: 100%; 
  height: 100%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}

.card-img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}

.card-placeholder { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
  gap: 4px; 
  padding: 8px; 
}

.card-placeholder svg { 
  width: 35px; 
  height: 35px; 
  opacity: 0.6; 
}

.placeholder-label { 
  font-size: 8px; 
  color: #9a8a78; 
  letter-spacing: 0.03em; 
  text-align: center;
}

/* ── History Button ── Smaller ───────────────────────── */
.history-btn {
  display: inline-flex; 
  align-items: center; 
  gap: 5px;
  padding: 5px 12px;
  border: 1.5px solid #8a7a68; 
  border-radius: 5px;
  background: #fff; 
  color: #5a4a38;
  font-family: 'Georgia', serif; 
  font-size: 11px; 
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.history-btn:hover {
  background: #5a4a38; 
  color: #faf6f1; 
  border-color: #5a4a38;
  box-shadow: 0 2px 8px rgba(90,74,56,0.18);
}

/* ── Modal Overlay ───────────────────────────────────── */
.modal-overlay {
  position: fixed; 
  inset: 0;
  background: rgba(20,14,8,0.55);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex; 
  align-items: center; 
  justify-content: center;
  padding: 20px;
}

.modal-panel {
  background: #faf6f1;
  border-radius: 14px; 
  border: 1px solid #d4c4b0;
  width: 100%; 
  max-width: 1000px; 
  max-height: 86vh;
  display: flex; 
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0,0,0,0.26);
}

/* ── Modal Header ────────────────────────────────────── */
.modal-header {
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  padding: 18px 22px 14px;
  border-bottom: 1px solid #e4d8cc;
  flex-shrink: 0;
}

.modal-title-group { 
  display: flex; 
  align-items: baseline; 
  gap: 10px; 
}

.modal-title { 
  margin: 0; 
  font-size: 17px; 
  font-weight: normal; 
  color: #3a2e22; 
  letter-spacing: 0.02em; 
}

.modal-count {
  font-size: 11px; 
  color: #9a8a78;
  font-family: 'Courier New', monospace;
  border: 1px solid #d4c4b0; 
  padding: 2px 8px; 
  border-radius: 20px;
}

.modal-close {
  background: none; 
  border: none; 
  color: #9a8a78; 
  cursor: pointer;
  padding: 6px; 
  border-radius: 6px; 
  display: flex; 
  align-items: center;
  transition: color 0.2s, background 0.2s;
}

.modal-close:hover { 
  color: #3a2e22; 
  background: #ede6dc; 
}

/* ── States ──────────────────────────────────────────── */
.modal-state {
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
  gap: 12px; 
  padding: 60px 20px; 
  color: #9a8a78; 
  font-size: 14px;
}

.loading-dots { 
  display: flex; 
  gap: 6px; 
}

.loading-dots span {
  width: 8px; 
  height: 8px; 
  border-radius: 50%; 
  background: #b8a48e;
  animation: dot-bounce 1.2s infinite ease-in-out;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
  40% { transform: translateY(-8px); opacity: 1; }
}

.retry-btn {
  padding: 7px 18px; 
  border: 1.5px solid #8a7a68; 
  border-radius: 6px;
  background: transparent; 
  color: #5a4a38; 
  font-size: 13px; 
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.retry-btn:hover { 
  background: #5a4a38; 
  color: #faf6f1; 
}

/* ── Image Grid ── Proper responsive grid ────────────── */
.modal-grid {
  display: flex;                 /* instead of grid */
  flex-direction: row;
  gap: 16px;
  padding: 20px 24px;
  overflow-x: auto;              /* horizontal scroll */
  overflow-y: hidden;
  flex: 1;
  scroll-behavior: smooth;
}

.modal-grid::-webkit-scrollbar { 
  width: 6px; 
}

.modal-grid::-webkit-scrollbar-track { 
  background: #f0ebe3; 
}

.modal-grid::-webkit-scrollbar-thumb { 
  background: #c8b8a2; 
  border-radius: 3px; 
}

.grid-item {
  min-width: 220px;   /* key for horizontal layout */
  height: 160px;
  flex-shrink: 0;     /* prevent shrinking */
  
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: #ede6dc;
  border: 1px solid #d4c4b0;
  cursor: pointer;

  animation: grid-in 0.3s ease both;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.grid-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

@keyframes grid-in {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}

.grid-img {
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  display: block;
  transition: transform 0.3s ease;
}

.grid-item:hover .grid-img { 
  transform: scale(1.05); 
}

.grid-item-overlay {
  position: absolute; 
  inset: 0;
  background: rgba(15,10,5,0.7);
  display: flex; 
  flex-direction: column;
  align-items: center; 
  justify-content: center; 
  gap: 8px;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.grid-item:hover .grid-item-overlay { 
  opacity: 1; 
}

.grid-item-zoom {
  width: 36px; 
  height: 36px;
  border: 1.5px solid rgba(255,255,255,0.7); 
  border-radius: 50%;
  display: flex; 
  align-items: center; 
  justify-content: center;
  color: #fff; 
  margin-bottom: 6px;
  transition: transform 0.2s ease;
}

.grid-item:hover .grid-item-zoom {
  transform: scale(1.1);
}

.grid-item-title { 
  font-size: 12px; 
  color: #faf6f1; 
  text-align: center; 
  padding: 0 10px; 
  line-height: 1.3; 
  font-weight: 500;
}

.grid-item-date {  
  font-size: 10px; 
  color: #e0d0c0; 
  font-family: 'Courier New', monospace; 
}

/* ── Lightbox ────────────────────────────────────────── */
.lightbox-overlay {
  position: fixed; 
  inset: 0;
  background: rgba(8, 5, 2, 0.95);
  z-index: 2000;
  display: flex; 
  align-items: center; 
  justify-content: center;
  gap: 20px;
  padding: 24px 80px;
}

/* Remove flex-direction:column from lightbox-body — let split-layout handle it */
.lightbox-body {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: calc(100vw - 200px);
  max-height: 90vh;
}

.lightbox-img {
  max-width: 100%;
  max-height: 76vh;
  width: auto; 
  height: auto;
  border-radius: 12px;
  object-fit: contain;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  display: block;
}

.lightbox-close {
  position: fixed; 
  top: 20px; 
  right: 24px;
  background: rgba(255,255,255,0.1); 
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff; 
  border-radius: 50%; 
  width: 44px; 
  height: 44px;
  display: flex; 
  align-items: center; 
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.lightbox-close:hover { 
  background: rgba(255,255,255,0.2); 
  transform: scale(1.05);
}

.lightbox-nav {
  flex-shrink: 0;
  background: rgba(255,255,255,0.1); 
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff; 
  border-radius: 50%; 
  width: 50px; 
  height: 50px;
  display: flex; 
  align-items: center; 
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.lightbox-nav:hover:not(:disabled) { 
  background: rgba(255,255,255,0.2); 
  transform: scale(1.05);
}

.lightbox-nav:disabled { 
  opacity: 0.2; 
  cursor: default; 
}

.lightbox-caption {
  display: flex; 
  align-items: center; 
  gap: 12px;
  flex-wrap: wrap; 
  justify-content: center;
  background: rgba(0,0,0,0.5);
  padding: 10px 20px;
  border-radius: 40px;
  backdrop-filter: blur(8px);
}

.lightbox-title { 
  font-size: 14px; 
  color: #f0e8e0; 
  font-family: 'Georgia', serif; 
}

.lightbox-sep   { 
  color: #8a7a68; 
}

.lightbox-date  { 
  font-size: 12px; 
  color: #c8b8a2; 
  font-family: 'Courier New', monospace; 
}

.lightbox-counter {
  font-family: 'Courier New', monospace; 
  font-size: 11px;
  border-left: 1px solid rgba(255,255,255,0.2);
  padding-left: 12px;
  color: #c8b8a2;
}

.split-layout {
  display: flex;
  flex-direction: row;   /* ← was missing / being overridden */
  gap: 30px;
  align-items: center;
  width: 100%;
}

/* Left image */
.lightbox-image-section {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;          /* ← prevents flex overflow */
}

/* Right product panel */
.lightbox-product-section {
  flex: 0 0 260px;       /* ← fixed width, doesn't grow/shrink */
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  color: #fff;
  align-self: flex-end;  /* ← pins to bottom right */
  margin-bottom: 0;
}

/* Product image */
.product-img {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 15px;
  object-fit: cover;
}

/* Product text */
.product-info h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.product-type {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 8px;
  text-transform: capitalize;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
}

/* ── Responsive adjustments ─────────────────────────── */
@media (max-width: 768px) {
  .modal-grid {
    gap: 12px;
    padding: 16px;
  }

  .lightbox-overlay {
    padding: 12px 16px;
    gap: 10px;
    align-items: flex-start;
    overflow-y: auto;
  }

  .lightbox-nav {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }

  .lightbox-nav--prev {
    left: 8px;
  }

  .lightbox-nav--next {
    right: 8px;
  }

  /* Stack image + product vertically on mobile */
  .split-layout {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 50px 8px 20px; /* top padding clears the close button */
    overflow-y: auto;
    max-height: 100vh;
  }

  .lightbox-image-section {
    width: 100%;
    flex: none;
  }

  .lightbox-img {
    max-height: 45vh;
    width: 100%;
    object-fit: contain;
    border-radius: 10px;
  }

  /* Product panel goes below the image, full width */
  .lightbox-product-section {
    flex: none;
    width: 100%;
    max-width: 100%;
    align-self: stretch;
    display: flex;
    flex-direction: row;   /* image left, info right */
    gap: 12px;
    align-items: center;
    padding: 14px;
    border-radius: 10px;
  }

  .product-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .product-info h3 {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .product-type {
    font-size: 11px;
    margin-bottom: 4px;
  }

  .product-price {
    font-size: 14px;
  }

  .lightbox-body {
    max-width: 100%;
    max-height: none;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-grid {
    gap: 10px;
  }

  .lightbox-nav {
    width: 32px;
    height: 32px;
  }
}

/* ── Transitions ─────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.22s ease; }

.modal-fade-enter-active .modal-panel,
.modal-fade-leave-active .modal-panel { transition: transform 0.22s ease, opacity 0.22s ease; }

.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-panel { transform: translateY(14px) scale(0.97); opacity: 0; }
.modal-fade-leave-to .modal-panel   { transform: translateY(8px) scale(0.98);  opacity: 0; }

.lightbox-fade-enter-active,
.lightbox-fade-leave-active { transition: opacity 0.2s ease; }

.lightbox-fade-enter-from,
.lightbox-fade-leave-to { opacity: 0; }

.img-switch-enter-active,
.img-switch-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }

.img-switch-enter-from { opacity: 0; transform: scale(0.96); }
.img-switch-leave-to   { opacity: 0; transform: scale(1.03); }
.lightbox-product-section {
  transition: background 0.2s, transform 0.2s;
}

.lightbox-product-section:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}
</style>