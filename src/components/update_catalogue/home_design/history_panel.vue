<template>
<div style="width:100%;height:90vh;background-color: white;padding:16px;overflow-y:auto;">
    <h2 style="font-size:18px;font-weight:600;color:#333;margin:0 0 16px 0;">Generate History</h2>
    
    <!-- Empty State -->
    <div v-if="historyList.length === 0" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60%;color:#999;">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="margin-bottom:12px;">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#ddd"/>
      </svg>
      <p style="font-size:14px;margin:0;">No generate history found</p>
    </div>

    <!-- History List -->
    <div v-else>
      <div v-for="(item, index) in historyList" :key="index" style="margin-bottom:24px;">
        
        <!-- Date Header -->
        <div style="font-size:14px;color:#666;margin-bottom:8px;font-weight:500;">
          {{ item.date }}
        </div>

        <!-- Single Image Entry -->
        <!-- <div v-if="item.images.length === 1" style="margin-bottom:16px;">
          <div style="width:104px;height:104px;border-radius:8px;overflow:hidden;margin-bottom:12px;">
            <img :src="item.images[0]" style="width:100%;height:100%;object-fit:cover;" />
          </div>
        </div> -->

        <!-- Multiple Images Entry -->
        <div  style="margin-bottom:16px;">
            <!-- main_image -->
        <img :src="item.input_image" style="width:100%;height:100%;object-fit:cover;width:76px;height:76px;border-radius:6px;overflow:hidden;margin-bottom:10px;;" />

          <!-- Image Grid -->
          <div style="background-color: #f2f2f2;padding:10px;border-radius:10px">
              <div style="display: flex;justify-content: space-between;"><b>Generate</b> {{ item.images.length }}</div>
              <div style="display:grid;grid-template-columns:repeat(3,76px);gap:4px;">
                <div v-for="(image, imgIndex) in item.images.slice(0, 3)" :key="imgIndex" 
                     style="width:76px;height:76px;border-radius:6px;overflow:hidden;">
                  <img :src="image" style="width:100%;height:100%;object-fit:cover;" />
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
    name:"history_panel",
    data() {
        return {
            historyList: [
                {
                    date: 'Sat Jul 19',
                    input_image:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
                    images: [
                        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop'
                    ]
                },
                {
                    date: 'Sat Jul 23',
                    input_image:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop',
                    images: [
                        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop',
                        'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=200&h=200&fit=crop',
                        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop'
                    ]
                },
                {
                    date:'Sat Jul 13',
                    input_image:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop',
                    images: [
                        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop',
                        'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=200&h=200&fit=crop'
                    ]
                }
            ]
        }
    }
}
</script>

<style scoped>
</style>