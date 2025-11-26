<template>
  <div class="ar-app">
    <!-- Loading State -->
    <div v-show="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>{{ loadingMessage }}</p>
      <p style="font-size: 12px; margin-top: 20px; color: rgba(255,255,255,0.7);">
        Status: {{ debugStatus }}
      </p>
    </div>

    <!-- AR View -->
    <div v-show="!isLoading" class="ar-container">
      <!-- A-Frame Scene Container -->
      <div id="ar-scene-container" class="ar-scene"></div>

      <!-- Status Indicators -->
      <div class="ar-status">{{ arStatus }}</div>
      <div class="floor-detection">{{ floorDetection }}</div>

      <!-- Size Control Panel -->
      <div class="size-control">
        <div class="size-header">
          <p class="label">Size Control:</p>
          <div class="button-group">
            <button
              v-for="size in sizes"
              :key="size.value"
              @click="setSize(size.value)"
              :class="['size-btn', { active: modelScale === size.value }]"
            >
              {{ size.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Render Button -->
      <div class="render-section">
        <button class="render-btn" @click="placeModel">
          🎯 Place Model
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="error = null" class="close-error">×</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ARSpinosaurs',
        data() {
    return {
      isLoading: true,
      loadingMessage: 'Initializing AR...',
      debugStatus: 'Starting...',
      arStatus: 'Checking AR support...',
      floorDetection: 'Loading...',
      modelScale: 0.5,
      error: null,
      scene: null,
      dino: null,
      sizes: [
        { label: 'Full (1x)', value: 1 },
        { label: 'Medium (0.5x)', value: 0.5 },
        { label: 'Small (0.0625x)', value: 0.0625 }
      ],
      diamensions: {width:2.06,height:1.4,depth:0.7},
      modelUrl: 'https://cdn.glitch.com/324a5290-5aa7-4efc-92d6-ae0736433b12%2Fspinosaurus.glb',
      light: null,
      sceneInitialized: false,
      modelPlaced: false,
      fixedModelPosition: null,
      // Reticle JSON data with bin reference
      reticleJSON: {
        "asset": {
          "generator": "Khronos glTF Blender I/O v1.0.5",
          "version": "2.0"
        },
        "scene": 0,
        "scenes": [
          {
            "name": "Scene",
            "nodes": [0, 1, 2]
          }
        ],
        "nodes": [
          {
            "name": "Light",
            "rotation": [0.16907575726509094, 0.7558803558349609, -0.27217137813568115, 0.570947527885437],
            "translation": [4.076245307922363, 5.903861999511719, -1.0054539442062378]
          },
          {
            "name": "Camera",
            "rotation": [0.483536034822464, 0.33687159419059753, -0.20870360732078552, 0.7804827094078064],
            "translation": [7.358891487121582, 4.958309173583984, 6.925790786743164]
          },
          {
            "mesh": 0,
            "name": "Torus",
            "scale": [0.7128448486328125, 0.7128448486328125, 0.7128448486328125]
          }
        ],
        "materials": [
          {
            "doubleSided": true,
            "emissiveFactor": [0.27902206778526306, 0.5199682712554932, 1],
            "name": "Material.001",
            "pbrMetallicRoughness": {
              "baseColorFactor": [0.05667726323008537, 0.5679765939712524, 0.8000000715255737, 1],
              "metallicFactor": 0,
              "roughnessFactor": 1
            }
          }
        ],
        "meshes": [
          {
            "name": "Torus",
            "primitives": [
              {
                "attributes": {
                  "POSITION": 0,
                  "NORMAL": 1,
                  "TEXCOORD_0": 2
                },
                "indices": 3,
                "material": 0
              }
            ]
          }
        ],
        "accessors": [
          {
            "bufferView": 0,
            "componentType": 5126,
            "count": 150,
            "max": [0.1961740255355835, 0.020665571093559265, 0.1961740255355835],
            "min": [-0.1961740255355835, 0.0008523659780621529, -0.1961740255355835],
            "type": "VEC3"
          },
          {
            "bufferView": 1,
            "componentType": 5126,
            "count": 150,
            "type": "VEC3"
          },
          {
            "bufferView": 2,
            "componentType": 5126,
            "count": 150,
            "type": "VEC2"
          },
          {
            "bufferView": 3,
            "componentType": 5123,
            "count": 282,
            "type": "SCALAR"
          }
        ],
        "bufferViews": [
          {
            "buffer": 0,
            "byteLength": 1800,
            "byteOffset": 0
          },
          {
            "buffer": 0,
            "byteLength": 1800,
            "byteOffset": 1800
          },
          {
            "buffer": 0,
            "byteLength": 1200,
            "byteOffset": 3600
          },
          {
            "buffer": 0,
            "byteLength": 564,
            "byteOffset": 4800
          }
        ],
        "buffers": [
          {
            "byteLength": 5364,
            "uri": "/assets/reticle.bin"  // Points to your assets/reticle.bin file
          }
        ]
      }
    }
  },
  mounted() {
  this.debugStatus = 'Mounted, loading product...';
  // Load product FIRST, then wait for A-Frame
  this.fetchProductDetails().then(() => {
    console.log('✅ Product loaded, model URL ready:', this.modelUrl);
    this.waitForAFrame();
  }).catch((err) => {
    console.error('❌ Failed to fetch product:', err);
    this.isLoading = false;
  });
},


  beforeUnmount() {
    if (this.scene) {
      this.scene.pause();
    }
  },

  methods: {

waitForAFrame() {
  let attempts = 0;
  const maxAttempts = 50;

  const checkAFrame = setInterval(() => {
    attempts++;
    this.debugStatus = `Checking A-Frame (${attempts}/${maxAttempts})...`;

    if (window.AFRAME && window.AFRAME.version) {
      clearInterval(checkAFrame);
      this.debugStatus = 'A-Frame loaded!';
      console.log('✓ A-Frame loaded:', window.AFRAME.version);
      
      this.registerAFrameComponents();
      this.checkARSupport();
      
      setTimeout(() => {
        console.log('🎯 Creating scene with model URL:', this.modelUrl);
        this.createScene();
      }, 300);
    }

    if (attempts >= maxAttempts) {
      clearInterval(checkAFrame);
      this.error = 'A-Frame failed to load. Make sure it is in index.html';
      this.isLoading = false;
      this.debugStatus = 'ERROR: A-Frame not loaded';
      console.error('A-Frame not available');
    }
  }, 100);
},
async fetchProductDetails() {
  try {
    const productId = this.$route.params.product_id;
    
    if (!productId) {
      throw new Error('Product ID not found in route parameters');
    }

    let token = localStorage.getItem('token');
    const apiUrl = `${this.$store.state.root_api}product/api/product-details/${productId}/`;
    
    console.log('📡 Fetching from:', apiUrl);

    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: headers,
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to fetch product details');
    }

    // Extract dimensions
    const dimensions = result.data.dimensions || {};
    
    this.diamensions = {
      width: parseFloat(dimensions.width) || 0.7,
      height: parseFloat(dimensions.height) || 1.2,
      depth: parseFloat(dimensions.depth || dimensions.length) || 0.6
    };

    console.log('✅ Product Dimensions (meters):', this.diamensions);

    // Extract 3D model URL
    let modelUrl = null;
    
    if (result.data['3d_model']) {
      modelUrl = `${this.$store.state.root_media_api}${result.data['3d_model']}`;
    } else if (result.data.model_file) {
      modelUrl = `${this.$store.state.root_media_api}${result.data.model_file}`;
    } else if (result.data.glb_file) {
      modelUrl = result.data.glb_file;
    } else if (result.data.model_url) {
      modelUrl = result.data.model_url;
    } else if (result.data.file) {
      modelUrl = result.data.file;
    }

    if (!modelUrl) {
      console.error('Available fields in result.data:', Object.keys(result.data));
      throw new Error('No 3D model URL found in product data');
    }

    this.modelUrl = modelUrl;

    console.log('✅ Model URL:', this.modelUrl);
    console.log('✅ Product Data Loaded');

  } catch (error) {
    console.error('❌ Error loading product details:', error);
    this.error = error.message || 'Failed to load product. Please try again.';
  }
},
    waitForAFrame() {
      let attempts = 0;
      const maxAttempts = 50;

      const checkAFrame = setInterval(() => {
        attempts++;
        this.debugStatus = `Checking A-Frame (${attempts}/${maxAttempts})...`;

        if (window.AFRAME && window.AFRAME.version) {
          clearInterval(checkAFrame);
          this.debugStatus = 'A-Frame loaded!';
          console.log('✓ A-Frame loaded:', window.AFRAME.version);
          
          this.registerAFrameComponents();
          this.checkARSupport();
          
          setTimeout(() => {
            this.createScene();
          }, 300);
        }

        if (attempts >= maxAttempts) {
          clearInterval(checkAFrame);
          this.error = 'A-Frame failed to load. Make sure it is in index.html';
          this.isLoading = false;
          this.debugStatus = 'ERROR: A-Frame not loaded';
          console.error('A-Frame not available');
        }
      }, 100);
    },

    async checkARSupport() {
      try {
        this.debugStatus = 'Checking AR support...';
        if (navigator.xr) {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          if (supported) {
            this.arStatus = '✓ AR Supported';
            console.log('✓ AR is supported');
          } else {
            this.arStatus = '⚠ AR Not Supported';
            console.warn('AR not supported on this device');
          }
        } else {
          this.arStatus = '⚠ WebXR Not Available';
          console.warn('WebXR not available');
        }
      } catch (err) {
        this.arStatus = '✗ Error checking AR';
        console.error('AR check error:', err);
      }
    },

    registerAFrameComponents() {
      if (!window.AFRAME) return;

      const self = this;

      if (!AFRAME.components['stable-floor-plane']) {
        AFRAME.registerComponent('stable-floor-plane', {
          schema: { opacity: { default: 0.2 } },
          init: function () {
            this.el.sceneEl.addEventListener('enter-vr', (ev) => {
              if (this.el.sceneEl.is('ar-mode')) {
                this.el.setAttribute('visible', true);
                this.el.setAttribute('position', '0 -0.01 0');
              }
            });
            this.el.sceneEl.addEventListener('exit-vr', (ev) => {
              this.el.setAttribute('visible', false);
            });
          }
        });
      }

      if (!AFRAME.components['enhanced-ar-hit-test']) {
        AFRAME.registerComponent('enhanced-ar-hit-test', {
          init: function () {
            this.xrHitTestSource = null;
            this.viewerSpace = null;
            this.refSpace = null;
            this.lastValidPosition = null;
            this.smoothingFactor = 0.7;

            this.el.sceneEl.renderer.xr.addEventListener('sessionstart', (ev) => {
              let session = this.el.sceneEl.renderer.xr.getSession();
              let hitTestComponent = this;

              self.floorDetection = 'Initializing floor detection...';
              self.debugStatus = 'AR session started';

              session.addEventListener('select', function () {
                if (!self.modelPlaced) {
                  let reticlePos = document.getElementById('reticle-marker').getAttribute('position');
                  let dino = document.getElementById('dino');
                  let light = document.getElementById('light');
                  
                  console.log('Placing model at:', reticlePos);
                  
                  // Fix model position and store it
                  self.fixedModelPosition = { ...reticlePos };
                  self.modelPlaced = true;
                  
                  if (dino) {
                    dino.setAttribute('position', reticlePos);
                    console.log('Model FIXED at position:', reticlePos);
                  }
                  
                  if (light) {
                    light.setAttribute('position', {
                      x: (reticlePos.x - 2),
                      y: (reticlePos.y + 4),
                      z: (reticlePos.z + 2)
                    });
                  }
                  
                  self.floorDetection = '✓ Model FIXED at:\nX: ' + reticlePos.x.toFixed(2) + 
                                        '\nY: ' + reticlePos.y.toFixed(2) + 
                                        '\nZ: ' + reticlePos.z.toFixed(2) + 
                                        '\n\n[Tap again to reset]';
                } else {
                  // Reset model placement
                  self.modelPlaced = false;
                  self.fixedModelPosition = null;
                  self.floorDetection = 'Scanning for floor...\nPoint at a flat surface';
                }
              });

              session.requestReferenceSpace('viewer').then((space) => {
                hitTestComponent.viewerSpace = space;
                session.requestHitTestSource({ space: hitTestComponent.viewerSpace })
                  .then((hitTestSource) => {
                    hitTestComponent.xrHitTestSource = hitTestSource;
                    self.floorDetection = '✓ Floor detection active';
                  })
                  .catch((err) => {
                    self.floorDetection = '✗ Hit test failed';
                  });
              });

              session.requestReferenceSpace('local-floor').then((space) => {
                hitTestComponent.refSpace = space;
              }).catch((err) => {
                session.requestReferenceSpace('local').then((space) => {
                  hitTestComponent.refSpace = space;
                });
              });
            });

            this.el.sceneEl.renderer.xr.addEventListener('sessionend', (ev) => {
              this.viewerSpace = null;
              this.refSpace = null;
              this.xrHitTestSource = null;
              self.floorDetection = 'AR Session Ended';
            });
          },

          tick: function () {
            if (this.el.sceneEl.is('ar-mode')) {
              // If model is already placed, stop moving reticle
              if (self.modelPlaced) {
                return;
              }

              if (!this.viewerSpace || !this.refSpace) return;

              let frame = this.el.sceneEl.frame;
              let xrViewerPose = frame.getViewerPose(this.refSpace);

              if (this.xrHitTestSource && xrViewerPose) {
                let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);

                if (hitTestResults.length > 0) {
                  let pose = hitTestResults[0].getPose(this.refSpace);
                  let inputMat = new THREE.Matrix4();
                  inputMat.fromArray(pose.transform.matrix);

                  let position = new THREE.Vector3();
                  position.setFromMatrixPosition(inputMat);

                  if (this.lastValidPosition) {
                    position.x = THREE.MathUtils.lerp(this.lastValidPosition.x, position.x, 1 - this.smoothingFactor);
                    position.y = THREE.MathUtils.lerp(this.lastValidPosition.y, position.y, 1 - this.smoothingFactor);
                    position.z = THREE.MathUtils.lerp(this.lastValidPosition.z, position.z, 1 - this.smoothingFactor);
                  }

                  position.y = Math.max(position.y, 0.01);
                  
                  // Ensure reticle is visible and positioned
                  this.el.setAttribute('position', position);
                  this.el.setAttribute('visible', 'true');
                  this.lastValidPosition = position.clone();

                  console.log('Reticle positioned at:', position);
                  self.floorDetection = 
                    'Floor detected ✓\nX: ' + position.x.toFixed(2) + 
                    ' Y: ' + position.y.toFixed(2) + 
                    ' Z: ' + position.z.toFixed(2) +
                    '\n\n[Tap to place model]';
                } else {
                  self.floorDetection = 'Scanning for floor...\nPoint at a flat surface';
                  // Show reticle even when not on floor (for debugging)
                  this.el.setAttribute('position', { x: 0, y: -0.5, z: -2 });
                  this.el.setAttribute('visible', 'true');
                }
              }
            }
          }
        });
      }
    },

    createScene() {
      this.$nextTick(() => {
        const container = document.getElementById('ar-scene-container');
        if (!container) {
          console.log('Container not found, retrying...');
          setTimeout(() => this.createScene(), 500);
          return;
        }
        this.createSceneInContainer(container);
      });
    },

    createSceneInContainer(container) {
      this.debugStatus = 'Creating A-Frame scene...';
      this.loadingMessage = 'Creating 3D scene...';
      console.log('Container found, creating scene');
      console.log('Reticle JSON loaded:', JSON.stringify(this.reticleJSON).substring(0, 100));
      console.log('Model URL:', this.modelUrl);

      // Update bin path to absolute URL
      const reticleJSONUpdated = JSON.parse(JSON.stringify(this.reticleJSON));
      reticleJSONUpdated.buffers[0].uri = window.location.origin + '/assets/reticle.bin';
      
      console.log('Updated bin URI:', reticleJSONUpdated.buffers[0].uri);
      
      // Create data URL for reticle JSON with correct bin path
      const reticleJsonString = JSON.stringify(reticleJSONUpdated);
      const reticleDataUrl = 'data:application/json;base64,' + btoa(reticleJsonString);

      const sceneHTML = `
        <a-scene 
          webxr="requiredFeatures: hit-test,local-floor;"
          renderer="colorManagement: true; physicallyCorrectLights: true;"
        >
          <a-assets>
            <!-- Dinosaur Model -->
            <a-asset-item 
              id="spinosaurus" 
              src="${this.modelUrl}" 
              response-type="arraybuffer"
              crossorigin="anonymous">
            </a-asset-item>
            
            <!-- Reticle Model (from JSON data URL with bin reference) -->
            <a-asset-item 
              id="reticle" 
              src="${reticleDataUrl}" 
              response-type="json"
              crossorigin="anonymous">
            </a-asset-item>
          </a-assets>

          <a-camera position="0 1.2 0"></a-camera>

          <!-- Reticle: Moves with floor detection -->
          <a-entity 
            id="reticle-marker"
            position="0 -0.5 -2"
            gltf-model="#reticle" 
            scale="0.5 0.5 0.5"
            enhanced-ar-hit-test
            visible="true"
            shadow="cast: false; receive: false"
            rotation="0 0 0">
            <!-- Debug plane to show position -->
            <a-plane 
              position="0 0 0"
              rotation="-90 0 0"
              width="0.5"
              height="0.5"
              material="color: cyan; opacity: 0.3; transparent: true;">
            </a-plane>
          </a-entity>

          <!-- Model: Fixed in world space -->
          <a-entity id="dino" position="0 0 -5" scale="1 1 1">
            <a-entity 
              position="0 0 0" 
              rotation="0 0 0"
              gltf-model="#spinosaurus"
              animation-mixer
              shadow="cast: true; receive: false">
            </a-entity>
          </a-entity>

          <!-- Shadow receiver plane -->
          <a-plane 
            id="shadowPlane"
            height="100" 
            width="100" 
            rotation="-90 0 0"
            position="0 0 0"
            shadow="receive: true; cast: false"
            material="color: #ffffff; transparent: true; opacity: 0.001;">
          </a-plane>

          <!-- Hemisphere light for ambient -->
          <a-light 
            type="hemisphere" 
            intensity="1.2"
            color="#ffffff">
          </a-light>

          <!-- Directional light for shadows -->
          <a-light 
            type="directional" 
            id="light"
            target="dino" 
            position="5 8 5"
            intensity="1.5"
            light="
              castShadow: true;
              shadowMapHeight: 2048;
              shadowMapWidth: 2048;
              shadowCameraLeft: -15;
              shadowCameraRight: 15;
              shadowCameraBottom: -15;
              shadowCameraTop: 15;
              shadowCameraFar: 30;
              shadowCameraNear: 0.1;
              shadowBias: -0.0001;">
          </a-light>

          <!-- Fill light -->
          <a-light 
            type="directional"
            position="-5 6 -3"
            intensity="0.6">
          </a-light>
        </a-scene>
      `;

      try {
        console.log('Injecting scene HTML');
        container.innerHTML = sceneHTML;
        console.log('Scene HTML injected');
        this.sceneInitialized = true;

        setTimeout(() => {
          this.scene = document.querySelector('a-scene');
          this.dino = document.getElementById('dino');
          this.light = document.getElementById('light');
          this.shadowPlane = document.getElementById('shadowPlane');
          this.reticleMarker = document.getElementById('reticle-marker');

          const reticleAsset = document.getElementById('reticle');
          const dinoAsset = document.getElementById('spinosaurus');

          if (reticleAsset) {
            reticleAsset.addEventListener('error', (e) => {
              console.error('Failed to load reticle:', e);
              this.error = `Failed to load reticle. Check that /assets/reticle.bin exists.`;
            });
          }

          if (dinoAsset) {
            dinoAsset.addEventListener('error', (e) => {
              console.error('Failed to load dinosaur:', e);
              this.error = 'Failed to load dinosaur model';
            });
          }

          if (this.scene && this.scene.renderer) {
            this.scene.renderer.shadowMap.enabled = true;
            this.scene.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
          }

          if (this.scene) {
            this.debugStatus = 'Scene ready!';
            this.loadingMessage = 'AR Ready';
            this.isLoading = false;
            this.arStatus = '✓ AR Ready';
            this.floorDetection = 'Point camera at floor...';
            console.log('✓ AR Scene initialized successfully');
          } else {
            throw new Error('Scene element not found after injection');
          }
        }, 2000);
      } catch (err) {
        console.error('Error creating scene:', err);
        this.error = 'Error: ' + err.message;
        this.isLoading = false;
      }
    },

    toggleAR() {
      if (!this.scene) {
        this.error = 'AR scene not initialized yet';
        return;
      }

      try {
        if (this.scene.enterAR) {
          this.scene.enterAR();
        } else {
          this.error = 'Cannot enter AR mode. Use a mobile device with WebXR support.';
        }
      } catch (err) {
        this.error = 'Failed to enter AR: ' + err.message;
        console.error('AR Error:', err);
      }
    },

    placeModel() {
      this.toggleAR();
    },

    setSize(scale) {
      this.modelScale = scale;
      if (this.dino) {
        this.dino.setAttribute('scale', { x: scale, y: scale, z: scale });
      }
    }
  }
}
</script>

<style scoped>
.ar-app {
  width: 100%;
  height: 90vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  background: #000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ar-container {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #000;
  position: relative;
}

.ar-scene {
  flex: 1;
  background: #000;
  width: 100%;
}

.ar-status {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 13px;
  z-index: 100;
  pointer-events: none;
}

.floor-detection {
  position: absolute;
  top: 80px;
  left: 20px;
  background: rgba(0, 0, 0, 0.85);
  color: #00ff00;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 12px;
  font-family: monospace;
  z-index: 100;
  white-space: pre-line;
  pointer-events: none;
}

.size-control {
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 12px 16px;
  border-radius: 0;
  z-index: 50;
  width: 100%;
  flex-shrink: 0;
}

.size-header {
  margin-bottom: 0;
}

.label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.button-group {
  display: flex;
  gap: 8px;
}

.size-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: #f0f0f0;
  color: #333;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.size-btn:hover {
  background: #e0e0e0;
}

.size-btn.active {
  background: #2563eb;
  color: white;
}

.render-section {
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 12px 16px;
  border-radius: 0;
  z-index: 50;
  width: 100%;
  flex-shrink: 0;
}

.render-btn {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.render-btn:hover {
  background: #1d4ed8;
}

.error-message {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #dc2626;
  color: white;
  padding: 16px;
  border-radius: 8px;
  max-width: 300px;
  z-index: 101;
  animation: slideIn 0.3s ease-out;
  pointer-events: auto;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.close-error {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  float: right;
}
</style>