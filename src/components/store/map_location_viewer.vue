<template>
    
  <div class="map-viewer-container">
    <!-- Map Container -->
    <div id="map" class="map" ref="mapElement"></div>
    <!-- Location Info Card (Optional) -->
    <div v-if="!readOnly" class="location-info-card">
      <div class="info-header">
        <h4>📍 Business Location</h4>
      </div>
      <div class="info-content">
        <div class="info-item">
          <span class="label">Latitude:</span>
          <span class="value">{{ latitude.toFixed(6) }}</span>
        </div>
        <div class="info-item">
          <span class="label">Longitude:</span>
          <span class="value">{{ longitude.toFixed(6) }}</span>
        </div>
        <div class="info-item" v-if="address">
          <span class="label">Address:</span>
          <span class="value">{{ address }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'MapLocationViewer',
  props: {
    latitude: {
      type: Number,
      required: true,
      default: 40.7128
    },
    longitude: {
      type: Number,
      required: true,
      default: -74.0060
    },
    address: {
      type: String,
      default: 'Business Location'
    },
    readOnly: {
      type: Boolean,
      default: true
    },
    zoom: {
      type: Number,
      default: 15
    }
  },
  data() {
    return {
      map: null,
      marker: null,
      isInitialized: false
    }
  },
  watch: {
    latitude(newVal) {
      this.updateMarkerPosition(newVal, this.longitude)
    },
    longitude(newVal) {
      this.updateMarkerPosition(this.latitude, newVal)
    },
    address(newVal) {
      if (this.marker) {
        this.marker.bindPopup(newVal).openPopup()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeMap()
    })
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
  },
  methods: {
    initializeMap() {
      try {
        // Initialize map with provided coordinates
        this.map = L.map(this.$refs.mapElement).setView(
          [this.latitude, this.longitude],
          this.zoom
        )

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: false,
          maxZoom: 19
        }).addTo(this.map)

        // Create custom marker icon
        const markerIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })

        // Add marker at business location
        this.marker = L.marker([this.latitude, this.longitude], {
          icon: markerIcon,
          draggable: false
        }).addTo(this.map)

        // Add popup with address
        // this.marker.bindPopup(this.address).openPopup()

        // Add circle overlay to highlight business area (optional)
        L.circle([this.latitude, this.longitude], {
          color: '#22c55e',
          fillColor: '#22c55e',
          fillOpacity: 0.1,
          radius: 200
        }).addTo(this.map)

        this.isInitialized = true
      } catch (err) {
        console.error('Error initializing map:', err)
      }
    },

    updateMarkerPosition(lat, lng) {
      if (this.marker && this.map) {
        this.marker.setLatLng([lat, lng])
        this.map.setView([lat, lng], this.zoom)
        this.marker.bindPopup(this.address).openPopup()
      }
    }
  }
}
</script>

<style scoped>
.map-viewer-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
}

.map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

:deep(.leaflet-attribution) {
  display: none !important;
}

:deep(.leaflet-bottom) {
  display: none !important;
}

:deep(.leaflet-control-zoom) {
  display: none !important;
}

.location-info-card {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: 260px;
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
}

.info-header {
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.info-header h4 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #262626;
}

.info-content {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 10px;
  font-size: 11px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  align-items: center;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #1890ff;
  font-weight: 500;
  word-break: break-all;
  text-align: right;
  flex: 1;
  margin-left: 8px;
  max-width: 120px;
}

/* Responsive design */
@media (max-width: 768px) {
  .location-info-card {
    width: 240px;
    bottom: 12px;
    right: 12px;
  }
}

@media (max-width: 480px) {
  .location-info-card {
    width: 100%;
    bottom: 0;
    right: 0;
    border-radius: 8px 8px 0 0;
  }
}

/* Custom scrollbar */
.location-info-card::-webkit-scrollbar {
  width: 4px;
}

.location-info-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.location-info-card::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.location-info-card::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>