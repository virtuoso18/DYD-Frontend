<template>
  <div
    style="width: 100%; background-color: white; padding: 16px"
    class="Generated_history"
  >
    <h2
      style="font-size: 18px; font-weight: 600; color: #333; margin: 0 0 16px 0"
    >
      Generate History
    </h2>

    <!-- Empty State -->
    <div
      v-if="historyList.length === 0"
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 60%;
        color: #999;
      "
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        style="margin-bottom: 12px"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          fill="#ddd"
        />
      </svg>
      <p style="font-size: 14px; margin: 0">No generate history found</p>
    </div>

    <!-- History List -->
    <div v-else>
      <div
        v-for="(item, index) in historyList"
        :key="index"
        style="margin-bottom: 24px"
      >
        <!-- Date Header -->
        <div
          style="
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
            font-weight: 500;
            margin-bottom: 10px;
            margin-top: 10px;
            line-height: 15px;
          "
        >
          {{ item.date }}
        </div>
        <!-- {{ item }} -->

        <!-- Single Image Entry -->
        <!-- <div v-if="item.images.length === 1" style="margin-bottom:16px;">
          <div style="width:104px;height:104px;border-radius:8px;overflow:hidden;margin-bottom:12px;">
            <img :src="item.images[0]" style="width:100%;height:100%;object-fit:cover;" />
          </div>
        </div> -->

        <!-- Multiple Images Entry -->
        <div style="margin-bottom: 16px">
          <!-- main_image -->
          <!-- <img :src="this.$store.state.root_api+item.input_image" @click="clicked_history(item.images)" style="width:100%;height:100%;object-fit:cover;width:76px;height:76px;border-radius:6px;overflow:hidden;margin-bottom:10px;;" class="main-image"/> -->
          <img
            :src="`${$store.state.root_media_api}${item.input_image}?t=${Date.now()}&id=${index}`"
            @click="clicked_history(item.images, item.id, item.input_image)"
            style="
              width: 76px;
              height: 76px;
              object-fit: cover;
              border-radius: 6px;
              overflow: hidden;
              margin-bottom: 10px;
            "
            class="main-image"
          />

          <!-- Image Grid -->
          <div
            style="
              background-color: #f2f2f2;
              padding: 10px;
              border-radius: 10px;
            "
          >
            <div style="display: flex; justify-content: space-between">
              <b>Generate</b> {{ item.images.length }}
            </div>
            <div
              style="
                display: grid;
                grid-template-columns: repeat(4, 60px);
                gap: 4px;
              "
            >
              <div
                v-for="(image, imgIndex) in item.images.slice(0, 4)"
                :key="imgIndex"
                style="
                  width: 60px;
                  height: 60px;
                  border-radius: 6px;
                  overflow: hidden;
                "
              >
                <img
                  :src="this.$store.state.root_media_api + image"
                  style="width: 100%; height: 100%; object-fit: cover"
                />
              </div>
            </div>
          </div>

          <!-- Generate Button with Count -->
          <!-- <a-button type="text" style="padding:6px 12px;font-size:13px;color:#666;border:1px solid #e8e8e8;border-radius:6px;background:#f9f9f9;display:flex;align-items:center;gap:6px;">
            <span>Generate</span>
            <span style="background:#e8e8e8;padding:2px 6px;border-radius:4px;font-size:11px;min-width:20px;text-align:center;">
              {{ item.images.length }}
            </span>
          </a-button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "history_panel",
  data() {
    return {
      historyList: [],
      loading: false,
      error: null,
      roomId: null, // This should be set based on your app's current room
    };
  },

  async mounted() {
    // Initialize roomId - you might get this from route params, props, or store
    this.roomId = this.$route.params.id;

    if (this.roomId) {
      this.fetchGenerateHistory();
    }

    if (this.$route.query.home_design) {
      try {
        const item = await this.getHomeDesignItem(
          this.$route.query.home_design,
        );
        console.log(
          "========================================================-------------------",
        );
        console.log(item);
        // Pass only the images array, not the entire item
        this.clicked_history(item.images, id);
      } catch (error) {
        console.error("Error loading home design item:", error);
      }
    }
  },

  methods: {
    async getHomeDesignItem(home_design_id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          this.$store.state.root_api +
            "engine/get-home-design-history/" +
            home_design_id,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            // Remove body for GET request
          },
        );

        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        // Return the data if success is true
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || "Failed to fetch home design");
        }
      } catch (error) {
        console.error(
          "Error fetching history home design rendered Item:",
          error,
        );
        throw error; // Re-throw so caller can handle it
      } finally {
        this.loading = false;
      }
    },
    smoothMobileScrolltoTop() {
      if (window.innerWidth < 500) {
        const smoothScrollToTop = (duration = 800) => {
          const start = window.scrollY;
          const startTime = performance.now();

          const easeInOutCubic = (t) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, start * (1 - ease));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        };

        smoothScrollToTop(900); // 900ms = very smooth
      }
    },
    clicked_history(item, id, input_image) {
        console.log("DATAREacheddddddddd",item,id,input_image);
      this.smoothMobileScrolltoTop();
      this.$emit("home-design-history-clicked", item, id, input_image);
    },
    async fetchGenerateHistory() {
      if (!this.roomId) {
        this.error = "Room ID is required";
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const payload = {
          room_id: this.$route.params.id,
        };

        const response = await fetch(
          this.$store.state.root_api + "engine/get-home-design-history/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add authorization header if needed
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          },
        );

        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json(); // Added 'await' here
        console.log(result);

        if (result.success) {
          // Changed from result.data.success to result.success
          this.historyList = result.data;
        } else {
          this.error = result.message || "Failed to fetch history";
          console.error("API Error:", result.message);
        }
      } catch (error) {
        console.error("Error fetching history:", error);

        // Handle different types of errors for fetch API
        if (error.name === "TypeError") {
          // Network error
          this.error = "Network error - please check your connection";
        } else if (error.message.includes("HTTP error")) {
          // HTTP status error
          this.error = `Server error: ${error.message}`;
        } else {
          // Other errors
          this.error = "An unexpected error occurred";
        }
      } finally {
        this.loading = false;
      }
    },

    // Method to refresh history (can be called from parent component or on user action)
    refreshHistory() {
      this.fetchGenerateHistory();
    },

    // Method to update room ID and fetch new history
    updateRoom(newRoomId) {
      this.roomId = newRoomId;
      this.fetchGenerateHistory();
    },
  },

  watch: {
    // Watch for room ID changes (if it comes from props or route)
    "$route.params.id"(newRoomId) {
      // Changed from roomId to id to match your route param
      if (newRoomId && newRoomId !== this.roomId) {
        this.updateRoom(newRoomId);
      }
    },
  },
};
</script>

<style scoped>
.main-image {
  cursor: pointer;
  padding: 1px;
}
.main-image:hover {
  border: 1px solid blue;
}
.Generated_history {
  height: 90vh;
  /* overflow-y: auto; */
}

@media screen and (max-width: 500px) {
  .Generated_history {
    /* height: 100%; */
    /* overflow-y: none; */
  }
}
</style>
