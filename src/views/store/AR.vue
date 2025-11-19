<template>
  <br><br>
{{this.model_url}}
{{ this.product_id  }}
<div class="ar-root" :data-mode="mode">
    <!-- Controls top -->
    <div class="controls top">
      <div class="ar_sec_navbar">
        <span @click="goBack" style="cursor: pointer; display: flex; align-items: center;">
          <svg
            width="6"
            height="10"
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="ar_sec_back_icon"
          >
            <path
              d="M4.75 0.75L0.75 4.75L4.75 8.75"
              stroke="#1A1A1A"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Back
        </span>
      </div>

      <button ref="startBtn" class="btn start">Start AR</button>

      <div class="right" v-if="placedModel">
        <label class="sr-only">Scale</label>
        <input
          type="range"
          min="0.2"
          max="3"
          step="0.01"
          v-model.number="scale"
          @input="applyScale"
          aria-label="Scale model"
        />
      </div>
    </div>

    <!-- Messages -->
    <div v-if="!isSecure" class="status error">
      Page must be served over HTTPS or localhost for AR.
    </div>
    <div v-else-if="!xrSupported" class="status error">
      WebXR immersive-ar not supported on this device/browser. Showing 3D preview.
    </div>
    <div v-else-if="!hitTestSupported" class="status error">
      ⚠️ Hit-test not supported — AR placement limited.
    </div>
    <div v-else-if="statusMessage" class="status info">{{ statusMessage }}</div>
    <div v-if="loadingModel" class="status loading">⏳ Loading model...</div>
    <div v-if="loadingProduct" class="status loading">⏳ Loading product...</div>

    <!-- Footer mode buttons -->
    <div class="footer-controls">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="{ active: mode === 'move' }"
        @click="setMode('move')"
        title="Move: tap reticle to move"
      >
        <path
          d="M7.57365 9.72704L4.46408 12.8086C4.04948 13.2017 3.30954 14.2273 3.22025 15.1668C3.12635 16.1547 4.09309 17.572 4.46408 18.1146C5.43111 19.5287 5.82048 20.3134 6.95174 21.6518C7.56609 22.3786 9.22561 23.8274 11.9271 24.01C13.9437 24.1462 15.9511 24.1335 16.9024 24.01C17.5555 23.9251 19.1412 23.6562 20.6338 22.2413C22.1265 20.8265 22.4996 18.5076 22.4996 17.525V8.09236C22.4996 7.50282 22.1265 6.32374 20.6338 6.32374C19.1412 6.32374 18.7681 7.50282 18.7681 8.09236V12.2192M7.57365 15.1668V5.7342C7.57365 5.14466 7.9468 3.96558 9.4394 3.96558C10.9319 3.96558 11.3052 5.14466 11.3052 5.7342M11.3052 5.7342V11.04M11.3052 5.7342V3.37604C11.3052 2.7865 11.6782 1.60742 13.1709 1.60742C14.6635 1.60742 15.0366 2.7865 15.0366 3.37604V5.7342M15.0366 5.7342V11.04M15.0366 5.7342C15.0366 5.14466 15.4098 3.96558 16.9024 3.96558C18.3949 3.96558 18.7681 5.14466 18.7681 5.7342V8.6819"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <svg
        width="24"
        height="21"
        viewBox="0 0 24 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="{ active: mode === 'rotate' }"
        @click="toggleRotateMode"
        title="Rotate: when active rotates Y only"
      >
        <path
          d="M20.5577 10.9888C23.7557 5.09219 22.2981 1.08962 16.8267 0.803711C12.8501 0.879632 8.74804 3.02224 5.47376 6.33692C2.72594 9.11864 0.0204015 13.1026 1.01361 16.8944C1.23292 17.7316 1.66052 18.3021 2.33602 18.8389C4.15129 20.2813 5.93307 20.4083 9.36476 19.5658C12.84 18.5098 14.9946 16.9189 16.8113 15.2912M16.8113 15.2912C16.8131 15.2895 16.815 15.2878 16.817 15.2861C16.8204 15.2831 16.8181 15.2773 16.8135 15.2773C16.8101 15.2773 16.8076 15.2809 16.8088 15.2841C16.8097 15.2865 16.8104 15.2889 16.8113 15.2912ZM16.8113 15.2912C17.2081 16.4647 16.9568 17.512 16.2735 19.5658"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :class="{ active: mode === 'zoom' }"
        @click="DofullScreenMode"
        title="Fullscreen"
      >
        <path
          d="M8.57101 3.31865C8.57101 3.31865 4.32145 2.93738 3.6294 3.62942C2.93734 4.32146 3.31868 8.57101 3.31868 8.57101"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.57101 22.3949C8.57101 22.3949 4.32145 22.7763 3.6294 22.0842C2.93734 21.3921 3.31868 17.1426 3.31868 17.1426"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17.1436 3.31865C17.1436 3.31865 21.3932 2.93738 22.0852 3.62942C22.7772 4.32146 22.3959 8.57101 22.3959 8.57101"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17.1436 22.3949C17.1436 22.3949 21.3932 22.7763 22.0852 22.0842C22.7772 21.3921 22.3959 17.1426 22.3959 17.1426"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M15.0117 10.7115L21.4957 4.22754"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.7118 15.0039L3.90039 21.8378"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.7111 10.7171L4.12012 4.13477"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14.9775 15.0039L21.9937 21.9638"
          stroke="#1A1A1A"
          stroke-width="1.60714"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <!-- Fallback 3D viewer -->
    <div v-if="!xrSupported || fallback" class="fallback" aria-hidden="false">
      <canvas ref="fallbackCanvas" class="fallback-canvas"></canvas>
      <div class="fallback-hint">Use mouse to rotate / wheel to zoom</div>
    </div>

    <!-- Invisible overlay for interaction -->
    <div
      class="interaction-layer"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @click="onClickLayer"
    ></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export default {
  name: 'ArViewer',
  props: {
    model_size: {
      type: Object,
      default: () => ({ width: 0.7, height: 1.2, depth: 0.6 })
    }
  },
  data() {
    return {
      openGallery: false,
      loadingModel: false,
      loadingProduct: false,
      statusMessage: "",
      xrSupported: true,
      hitTestSupported: true,
      fallback: false,
      isSecure: window.isSecureContext === true,
      placedModel: null,
      scale: 1.0,
      mode: "rotateFree",
      
      // Product data
      selectedProduct: null,
      product_id: null,
      product_type: null,
      model_url: null
    };
  },

  beforeCreate() {
    // Store Three.js objects outside of Vue's reactivity system
    this.$three = {
      ARbtn: null,
      bottomControl: null,
      renderer: null,
      scene: null,
      camera: null,
      reticle: null,
      shadowPlane: null,
      pivot: null,
      controller: null,
      hitTestSource: null,
      transientHitTestSource: null,
      referenceSpace: null,
      cachedGLTF: null,
      pointerDown: false,
      lastPointer: null
    };
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },

    async fetchProductDetails() {
      this.loadingProduct = true;
      try {
        // Get product ID and type from route params
        this.product_id = this.$route?.params?.product_id;

        if (!this.product_id) {
          throw new Error('Product ID not found in route');
        }

        // Construct API endpoint based on product type
        let url_product_details = `${this.$store.state.root_api}product/api/product-details/${this.product_id}/`;

        const token = localStorage.getItem('token');
        const response = await fetch(url_product_details, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();
        
        if (result.success) {
          this.selectedProduct = result.data;
          console.log(this.selectedProduct)
          // Extract 3D model URL from product data
          if (this.selectedProduct.glb_file) {
            this.model_url = this.selectedProduct.glb_file;
          } else if (this.selectedProduct.model_url) {
            this.model_url = this.selectedProduct.model_url;
          } else if (this.selectedProduct.file) {
            this.model_url = this.selectedProduct.file;
          }

          console.log('Product loaded:', this.selectedProduct);
          console.log('Model URL:', this.model_url);
          
          // Initialize AR after product is loaded
          await this.initAR();
        } else {
          throw new Error(result.message || 'Failed to fetch product details');
        }
      } catch (error) {
        console.error('Error loading product details:', error);
        this.statusMessage = 'Failed to load product. Please try again.';
      } finally {
        this.loadingProduct = false;
      }
    },

    fixMaterialEncoding(mat) {
      if (!mat) return;
      if (Array.isArray(mat)) return mat.forEach(this.fixMaterialEncoding);
      if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
      if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
    },

    async warmUrl(url) {
      try {
        await fetch(url, { method: "GET", mode: "cors", cache: "force-cache" });
      } catch (e) {
        console.warn('Could not warm URL:', e);
      }
    },

    async preloadGLTF(url) {
      if (!url) {
        throw new Error('Model URL is not available');
      }

      this.loadingModel = true;
      try {
        await this.warmUrl(url);
        const loader = new GLTFLoader();
        loader.setCrossOrigin("anonymous");
        
        const gltf = await new Promise((resolve, reject) =>
          loader.load(url, resolve, undefined, reject)
        );

        gltf.scene.traverse((c) => 
          c.isMesh && c.material && this.fixMaterialEncoding(c.material)
        );
        
        this.$three.cachedGLTF = gltf;
        console.log('GLTF loaded successfully');
        return gltf;
      } catch (error) {
        console.error('Error loading GLTF:', error);
        throw error;
      } finally {
        this.loadingModel = false;
      }
    },

    createPlaceholderModel() {
      const g = new THREE.Group();
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.8 })
      );
      mesh.castShadow = mesh.receiveShadow = true;
      g.add(mesh);
      return g;
    },

    initThree(domCanvas) {
      this.$three.scene = new THREE.Scene();
      this.$three.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: domCanvas || undefined,
      });
      this.$three.renderer.xr.enabled = true;
      this.$three.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.$three.renderer.setSize(window.innerWidth, window.innerHeight);
      this.$three.renderer.shadowMap.enabled = true;

      this.$three.camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        40
      );

      const pmrem = new THREE.PMREMGenerator(this.$three.renderer);
      this.$three.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      this.$three.scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
      this.$three.scene.add(new THREE.AmbientLight(0xffffff, 0.6));

      this.$three.pivot = new THREE.Group();
      this.$three.scene.add(this.$three.pivot);

      this.$three.shadowPlane = new THREE.Mesh(
        new THREE.CircleGeometry(0.35, 64).rotateX(-Math.PI / 2),
        new THREE.ShadowMaterial({ opacity: 0.45 })
      );
      this.$three.shadowPlane.receiveShadow = true;
      this.$three.shadowPlane.visible = false;
      this.$three.scene.add(this.$three.shadowPlane);

      this.$three.reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.08, 0.12, 64).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({
          color: 0x00ff66,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.95,
        })
      );
      this.$three.reticle.matrixAutoUpdate = false;
      this.$three.reticle.visible = true;
      this.$three.reticle.position.set(-2, 4, -1);
      this.$three.camera.add(this.$three.reticle);
      this.$three.scene.add(this.$three.camera);
    },

    async onSessionStart() {
      const session = this.$three.renderer.xr.getSession();
      try {
        this.$three.referenceSpace = await session.requestReferenceSpace("local-floor");
      } catch {
        this.$three.referenceSpace = await session.requestReferenceSpace("local");
      }

      this.$three.renderer.xr.setReferenceSpace(this.$three.referenceSpace);

      try {
        const viewer = await session.requestReferenceSpace("viewer");
        this.$three.hitTestSource = await session.requestHitTestSource({ space: viewer });
        this.hitTestSupported = !!this.$three.hitTestSource;
      } catch {
        this.$three.hitTestSource = null;
        this.hitTestSupported = false;
      }

      this.$three.controller = this.$three.renderer.xr.getController(0);
      this.$three.controller.addEventListener("select", this.onSelectTap);
      this.$three.bottomControl = document.getElementsByClassName("footer-controls")[0];
      if (this.$three.bottomControl) {
        this.$three.bottomControl.style.setProperty("display", "flex");
      }
      this.$three.scene.add(this.$three.controller);
      if (this.$three.ARbtn) {
        this.$three.ARbtn.style.setProperty("display", "none", "important");
        this.$three.ARbtn.style.setProperty("opacity", "0", "important");
        this.$three.ARbtn.style.setProperty("visibility", "hidden", "important");
        this.$three.ARbtn.style.setProperty("pointer-events", "none", "important");
      }
    },

    DofullScreenMode() {
      if (this.$three.bottomControl) {
        this.$three.bottomControl.style.setProperty("display", "none");
      }
    },

    async onSelectTap() {
      if (!this.$three.cachedGLTF) {
        try {
          await this.preloadGLTF(this.model_url);
        } catch {
          this.$three.cachedGLTF = { scene: this.createPlaceholderModel() };
        }
      }
      if (!this.placedModel) await this.placeModelFromReticle();
    },

    async placeModelFromReticle() {
      this.loadingModel = true;
      const modelGroup = this.$three.cachedGLTF?.scene?.clone(true) || this.createPlaceholderModel();
      modelGroup.position.set(0, 0, 0);
      modelGroup.rotation.set(0, 0, 0);
      modelGroup.scale.setScalar(this.scale);
      while (this.$three.pivot.children.length) this.$three.pivot.remove(this.$three.pivot.children[0]);
      this.$three.pivot.add(modelGroup);
      this.movePivotToReticle(true);
      this.placedModel = modelGroup;
      this.$three.shadowPlane.visible = true;
      this.loadingModel = false;
    },

    movePivotToReticle(forceApprox = false) {
      if (!this.$three.reticle.userData.worldMatrix) return;

      const wm = this.$three.reticle.userData.worldMatrix;
      this.$three.pivot.matrix.copy(wm);
      this.$three.pivot.matrix.decompose(this.$three.pivot.position, this.$three.pivot.quaternion, this.$three.pivot.scale);

      if (this.placedModel) {
        let minY = Infinity;

        this.placedModel.traverse((child) => {
          if (child.isMesh) {
            const geometry = child.geometry;
            if (!geometry) return;

            const pos = geometry.attributes.position;
            if (!pos) return;

            for (let i = 0; i < pos.count; i++) {
              const vertex = new THREE.Vector3().fromBufferAttribute(pos, i);
              vertex.applyMatrix4(child.matrixWorld);
              if (vertex.y < minY) minY = vertex.y;
            }
          }
        });

        if (minY !== Infinity) {
          this.$three.pivot.position.y -= minY;
          this.$three.pivot.position.y += 0.001;
        }
      }

      this.$three.shadowPlane.position.copy(this.$three.pivot.position);
      this.$three.shadowPlane.position.y -= 0.001;
      this.$three.shadowPlane.visible = true;
    },

    onPointerDown(e) {
      this.$three.pointerDown = true;
      this.$three.lastPointer = { x: e.clientX, y: e.clientY };
    },

    onPointerMove(e) {
      if (!this.$three.pointerDown || !this.placedModel) return;
      const dx = e.clientX - this.$three.lastPointer.x;
      this.$three.lastPointer.x = e.clientX;
      this.$three.lastPointer.y = e.clientY;

      const rotSensitivity = 0.0052;
      this.placedModel.rotation.y += dx * rotSensitivity;
    },

    onPointerUp() {
      this.$three.pointerDown = false;
      this.$three.lastPointer = null;
    },

    onClickLayer(e) {
      if (!this.$three.reticle.userData.worldMatrix) return;

      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.$three.camera);
      const intersects = raycaster.intersectObject(this.$three.reticle, true);
      if (intersects.length > 0) this.movePivotToReticle(true);
    },

    startRenderLoop() {
      this.$three.renderer.setAnimationLoop((time, frame) => {
        if (frame) {
          const xrRef = this.$three.renderer.xr.getReferenceSpace();
          let found = false;
          if (this.$three.hitTestSource) {
            const hits = frame.getHitTestResults(this.$three.hitTestSource);
            if (hits?.length) {
              const pose = hits[0].getPose(xrRef);
              if (pose) {
                const mat = new THREE.Matrix4().fromArray(pose.transform.matrix);
                if (this.$three.reticle.parent === this.$three.camera) {
                  this.$three.camera.remove(this.$three.reticle);
                  this.$three.scene.add(this.$three.reticle);
                }
                this.$three.reticle.userData.worldMatrix = mat;
                this.$three.reticle.matrix.copy(mat);
                this.$three.reticle.matrix.decompose(
                  this.$three.reticle.position,
                  this.$three.reticle.quaternion,
                  this.$three.reticle.scale
                );
                this.$three.reticle.visible = true;
                this.$three.shadowPlane.position.setFromMatrixPosition(mat);
                this.$three.shadowPlane.rotation.x = -Math.PI / 2;
                this.$three.shadowPlane.visible = true;
                found = true;
              }
            }
          }

          if (!found && this.$three.reticle.userData.worldMatrix)
            delete this.$three.reticle.userData.worldMatrix;
        }

        this.$three.renderer.render(this.$three.scene, this.$three.camera);
      });
    },

    applyScale() {
      if (this.placedModel) {
        const modelGroup = this.$three.cachedGLTF?.scene?.clone(true) || this.createPlaceholderModel();
        const { width, height, depth } = this.model_size;

        const box = new THREE.Box3().setFromObject(modelGroup);
        const size = box.getSize(new THREE.Vector3());

        const scaleX = width / size.x;
        const scaleY = height / size.y;
        const scaleZ = depth / size.z;

        this.placedModel.scale.set(scaleX, scaleY, scaleZ);
      }
    },

    setMode(newMode) {
      this.mode = newMode;
    },

    toggleRotateMode() {
      this.mode = this.mode === 'rotate' ? 'rotateFree' : 'rotate';
    },

    async initAR() {
      this.isSecure = window.isSecureContext === true;

      try {
        const supported =
          navigator.xr && (await navigator.xr.isSessionSupported("immersive-ar"));
        if (!supported) {
          this.xrSupported = false;
          this.fallback = true;
        }
      } catch {
        this.xrSupported = false;
        this.fallback = true;
      }

      this.initThree(this.$refs.fallbackCanvas);
      
      try {
        if (this.model_url) {
          await this.preloadGLTF(this.model_url);
        } else {
          console.warn('No model URL available, using placeholder');
          this.$three.cachedGLTF = { scene: this.createPlaceholderModel() };
        }
      } catch (error) {
        console.error('Error preloading GLTF:', error);
        this.$three.cachedGLTF = { scene: this.createPlaceholderModel() };
      }

      if (this.$refs.startBtn && typeof ARButton !== "undefined" && this.xrSupported) {
        this.$three.ARbtn = ARButton.createButton(this.$three.renderer, {
          requiredFeatures: ["hit-test"],
          optionalFeatures: [
            "dom-overlay",
            "local-floor",
            "transient-hit-test",
            "light-estimation",
          ],
          domOverlay: { root: document.body },
        });
        this.$three.ARbtn.style = "";
        this.$three.ARbtn.id = "ARButton";
        this.$refs.startBtn.replaceWith(this.$three.ARbtn);
      }

      this.$three.renderer.xr.addEventListener("sessionstart", this.onSessionStart);
      this.startRenderLoop();

      window.addEventListener("resize", () => {
        if (this.$three.renderer && this.$three.camera) {
          this.$three.camera.aspect = window.innerWidth / window.innerHeight;
          this.$three.camera.updateProjectionMatrix();
          this.$three.renderer.setSize(window.innerWidth, window.innerHeight);
        }
      });
    },

    cleanup() {
      try {
        this.$three.renderer?.xr?.getSession()?.end();
      } catch {}
      if (this.$three.controller) this.$three.controller.removeEventListener("select", this.onSelectTap);
      try {
        if (this.$three.renderer?.domElement && this.$three.renderer.domElement.parentNode)
          this.$three.renderer.domElement.parentNode.removeChild(this.$three.renderer.domElement);
      } catch {}
      this.$three.renderer?.setAnimationLoop(null);
      this.$three.renderer?.dispose?.();
      if (this.$three.scene)
        this.$three.scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose?.();
          if (obj.material) {
            Array.isArray(obj.material)
              ? obj.material.forEach((m) => m.dispose?.())
              : obj.material.dispose?.();
          }
        });
    }
  },

  mounted() {
    // Fetch product details and then initialize AR
    this.fetchProductDetails();
  },

  beforeUnmount() {
    this.cleanup();
  }
};
</script>

<style scoped>
.ar_sec_navbar {
  width: 100%;
  padding: 20px 20px;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: white;
  justify-content: center;
}

.ar_sec_back_icon {
  margin-right: 6px;
}

.hiddenARButton {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

.ar-root {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  touch-action: none;
  user-select: none;
}

.controls.top {
  position: fixed;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  z-index: 10001;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.btn {
  padding: 8px 12px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #ddd;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  display: block;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  background: #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.start {
  background: #00c16b;
  color: white;
  border: none;
}

.start:hover {
  background: #00a856;
}

.status {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 600;
  color: white;
  max-width: 90%;
  text-align: center;
}

.status.info {
  background: rgba(0, 0, 0, 0.6);
}

.status.loading {
  background: rgba(0, 0, 0, 0.85);
  animation: pulse 1.5s ease-in-out infinite;
}

.status.error {
  background: #ff4444;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.footer-controls {
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10003;
  background-color: white;
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: none;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.footer-controls svg {
  cursor: pointer;
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.footer-controls svg:hover {
  background: #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.footer-controls svg.active {
  background: rgba(0, 200, 100, 0.1);
  stroke: #00c16b;
}

.fallback {
  position: fixed;
  inset: 0;
  z-index: 9998;
}

.fallback-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.fallback-hint {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  z-index: 10000;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px 25px;
  border-radius: 8px;
  font-size: 14px;
}

.interaction-layer {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: transparent;
  touch-action: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.right input[type="range"] {
  width: 150px;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
}

.right input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #00c16b;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.right input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #00c16b;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>