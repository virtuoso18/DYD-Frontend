<template>
  <div class="setpdes_sec">
    <div style="display:flex;justify-content: center;align-items: center;height:400px;flex-direction: column;background-color: #f3f3f3;padding:10px;border-radius:10px;">
      <img 
        class="step-banner" 
        :src="getCurrentStageData.imagePath" 
        :alt="getCurrentStageData.firstPara" 
        style="border-radius:10px;"
      />
      <p class="step-first-para">{{ getCurrentStageData.firstPara}}</p>
      <p v-if="getCurrentStageData.secondPara">{{ getCurrentStageData.secondPara}}</p>
      
      <!-- AR START BUTTON - ONLY SHOW ON STAGE 3 -->
      <button 
        v-if="currentStage === 3"
        class="start-ar-button"
        @click="handleStartAR"
      >
        📍 Start AR Experience
      </button>
    </div>
  </div>
</template>

<script>
import { stageData } from "./instruction_stages.config";

export default {
  name: "StageView",
  props: {
    currentStage: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      stageData: stageData,
    };
  },
  computed: {
    getCurrentStageData() {
      const item = this.stageData[this.currentStage];
      return item || {};
    },
  },
  methods: {
    handleStartAR() {
      console.log("📍 Emitting start-ar event");
      this.$emit("start-ar");
    },
  },
};
</script>

<style scoped>
.setpdes_sec {
  width: 100%;
  height: 100%;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.step-banner {
  width: 100%;
  max-height: 300px;
  margin: 10px 0px;
  object-fit: contain;
}

.step-first-para {
  font-size: 20px;
  font-weight: 600;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.start-ar-button {
  margin-top: 20px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.start-ar-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

.start-ar-button:active {
  transform: translateY(0);
}
</style>