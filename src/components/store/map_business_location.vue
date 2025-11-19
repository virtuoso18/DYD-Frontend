<template>
  <div class="map-container">
    <!-- Map Container -->
    <div id="map" class="map" ref="mapElement"></div>

    <!-- Location Info Card -->
    <div class="location-card">
      <div class="location-header">
        <h3>📍 Select Your Location</h3>
       
      </div>

      <div class="location-details">
        <!-- <div class="detail-item">
          <span class="label">Latitude:</span>
          <span class="value">{{ selectedLocation.lat.toFixed(6) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Longitude:</span>
          <span class="value">{{ selectedLocation.lng.toFixed(6) }}</span>
        </div> -->
        <div class="detail-item" v-if="selectedLocation.address">
          <span class="label">Address:</span>
          <span class="value">{{ selectedLocation.address }}</span>
        </div>
        <a-button block type="primary" size="medium" @click="requestDeviceLocation">
         📍 Current Location
       </a-button>
      </div>

      <a-alert
        v-if="errorMessage"
        :message="errorMessage"
        type="error"
        show-icon
        closable
        style="margin-top: 12px"
      />
    </div>

    <!-- Permission Modal -->
    <a-modal
      v-model:visible="permissionModalVisible"
      title="Location Permission"
      @ok="handlePermissionConfirm"
      @cancel="handlePermissionCancel"
      :okText="'Allow'"
      :cancelText="'Deny'"
      :closable="false"
      :maskClosable="false"
    >
      <div class="permission-modal-content">
        <a-alert
          message="This app needs your location"
          description="We'd like to access your device's current location to help you select the exact position on the map. Your location data will only be used for this purpose."
          type="info"
          show-icon
          style="margin-bottom: 12px"
        />
        <p style="margin-bottom: 0">
          <strong>Why we need this:</strong><br/>
          • To show your current location on the map<br/>
          • To help you select a precise location<br/>
          • To improve user experience
        </p>
      </div>
    </a-modal>

    <!-- Loading Spinner for Location -->
    <div v-if="isLocatingUser" class="locating-spinner">
      <a-spin size="small" />
      <span style="margin-left: 8px">Getting your location...</span>
    </div>
  </div>
  <br>
  <div class="location-actions">
    <a-button block @click="cancelSelection">Cancel</a-button>
    
    <a-button type="primary" block @click="confirmLocation" :loading="loadingConfirm" style="background-color: #22c55e ;display:flex;gap:10px">
       <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 17 24" fill="none" stroke="currentColor" stroke-width="2"  style="margin-right: 8px; vertical-align: middle;">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Confirm Location
    </a-button>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { message, Modal } from 'ant-design-vue'

export default {
  name: 'MapLocationSelector',
  data() {
    return {
      map: null,
      marker: null,
      selectedLocation: {
        lat: 0,
        lng: 0,
        address: ''
      },
      userLocation: {
        lat: 40.7128,
        lng: -74.0060
      },
      loadingConfirm: false,
      errorMessage: '',
      isInitialized: false,
      permissionModalVisible: false,
      isLocatingUser: false,
      isUsingDeviceLocation: false
    }
  },
  mounted() {
    this.initializeMap()
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
  },
  methods: {
    async initializeMap() {
      try {
        // Get user's IP-based location
        await this.getUserIPLocation()

        // Initialize map
        this.map = L.map(this.$refs.mapElement).setView(
          [this.userLocation.lat, this.userLocation.lng],
          13
        )

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: false,
          maxZoom: 19
        }).addTo(this.map)

        // Create custom marker icon
        const markerIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })

        // Add initial marker
        this.marker = L.marker([this.userLocation.lat, this.userLocation.lng], {
          icon: markerIcon,
          draggable: true
        }).addTo(this.map)

        this.selectedLocation = {
          lat: this.userLocation.lat,
          lng: this.userLocation.lng,
          address: 'IP-Based Location'
        }

        // Handle marker drag
        this.marker.on('dragend', () => {
          const position = this.marker.getLatLng()
          this.selectedLocation.lat = position.lat
          this.selectedLocation.lng = position.lng
          this.getAddressFromCoordinates(position.lat, position.lng)
        })

        // Handle map click
        this.map.on('click', (e) => {
          this.marker.setLatLng(e.latlng)
          this.selectedLocation.lat = e.latlng.lat
          this.selectedLocation.lng = e.latlng.lng
          this.getAddressFromCoordinates(e.latlng.lat, e.latlng.lng)
        })

        this.isInitialized = true
      } catch (err) {
        console.error('Error initializing map:', err)
        this.errorMessage = 'Failed to initialize map. Using default location.'
        this.initializeDefaultMap()
      }
    },

    async getUserIPLocation() {
      try {
        // Try to get location from IP
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()

        this.userLocation = {
          lat: data.latitude || 40.7128,
          lng: data.longitude || -74.0060
        }
      } catch (err) {
        console.warn('Could not fetch IP location, using default')
        // Default to New York
        this.userLocation = {
          lat: 40.7128,
          lng: -74.0060
        }
      }
    },

    requestDeviceLocation() {
      this.permissionModalVisible = true
    },

    handlePermissionConfirm() {
      this.permissionModalVisible = false
      this.getDeviceLocation()
    },

    handlePermissionCancel() {
      this.permissionModalVisible = false
      message.warning('Location permission denied. Using IP-based location.')
    },

    async getDeviceLocation() {
      if (!navigator.geolocation) {
        this.errorMessage = 'Geolocation is not supported by your browser.'
        message.error('Geolocation not supported')
        return
      }

      this.isLocatingUser = true

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          
          this.userLocation = {
            lat: latitude,
            lng: longitude
          }

          this.isUsingDeviceLocation = true

          // Update marker position
          this.marker.setLatLng([latitude, longitude])
          
          // Update map view
          this.map.setView([latitude, longitude], 16)

          // Update selected location
          this.selectedLocation.lat = latitude
          this.selectedLocation.lng = longitude
          this.getAddressFromCoordinates(latitude, longitude)

          this.isLocatingUser = false
          message.success('Device location accessed successfully!')
          this.errorMessage = ''
        },
        (error) => {
          this.isLocatingUser = false
          
          let errorMsg = 'Could not access device location.'
          
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = 'Location permission denied. Using IP-based location.'
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = 'Location information is unavailable.'
          } else if (error.code === error.TIMEOUT) {
            errorMsg = 'Location request timed out.'
          }

          this.errorMessage = errorMsg
          message.error(errorMsg)
          console.error('Geolocation error:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    },

    getAddressFromCoordinates(lat, lng) {
      // Simply display coordinates as address
      this.selectedLocation.address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    },

    initializeDefaultMap() {
      if (!this.map) {
        this.map = L.map(this.$refs.mapElement).setView([40.7128, -74.0060], 13)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: false,
          maxZoom: 19
        }).addTo(this.map)

        const markerIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })

        this.marker = L.marker([40.7128, -74.0060], {
          icon: markerIcon,
          draggable: true
        }).addTo(this.map)

        this.selectedLocation = {
          lat: 40.7128,
          lng: -74.0060,
          address: 'Default Location'
        }
      }
    },

    confirmLocation() {
      this.loadingConfirm = true
      
      setTimeout(() => {
        this.$emit('location-confirmed', {
          latitude: this.selectedLocation.lat,
          longitude: this.selectedLocation.lng,
          address: this.selectedLocation.address,
          isDeviceLocation: this.isUsingDeviceLocation
        })
        
        this.loadingConfirm = false
        message.success('Location confirmed successfully!')
      }, 500)
    },

    cancelSelection() {
      this.$emit('location-cancelled')
      message.info('Location selection cancelled')
    }
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.location-card {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: 280px;
  z-index: 10;
  max-height: 400px;
  overflow-y: auto;
}

.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.location-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.location-details {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
  font-size: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  align-items: center;
}

.detail-item:last-child {
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
}

.location-actions {
  display: flex;
  gap: 8px;
}

.location-actions :deep(.ant-btn) {
  flex: 1;
}

.permission-modal-content {
  padding: 8px 0;
}

.locating-spinner {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
}

/* Responsive design */
@media (max-width: 768px) {
  .map-container {
    height: 400px;
  }

  .location-card {
    width: 260px;
    bottom: 12px;
    right: 12px;
  }
}

@media (max-width: 480px) {
  .map-container {
    height: 300px;
  }

  .location-card {
    width: 100%;
    bottom: 0;
    right: 0;
    border-radius: 8px 8px 0 0;
  }

  .locating-spinner {
    font-size: 11px;
    padding: 10px 12px;
  }
}
</style>