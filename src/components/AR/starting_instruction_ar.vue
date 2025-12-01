<template>
  <div class="setpdes_sec">
    <div style="display:flex;justify-content: center;align-items: center;height:400px;flex-direction: column;background-color: #f3f3f3;padding:10px;border-radius:10px;;">
      <img class="step-banner" :src="getCurrentStageData.imagePath" :alt="getCurrentStageData.firstPara" style="border-radius:10px;"/>
      <p class="step-first-para">{{ getCurrentStageData.firstPara}}</p>
      <p v-if="getCurrentStageData.secondPara">{{ getCurrentStageData.secondPara}}</p>
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
    return {};
  },
  computed: {
    getCurrentStageData() {
      const item = stageData[this.currentStage];
      return item || "";
    },
  },
};
</script>
<style scoped>
 .setpdes_sec{
    width: 100%;
    height: 100%;
    color:black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
 }
 .step-banner{
    width: 100%;
    max-height: 300px;
    margin: 10px 0px;
    object-fit: contain;
 }
 .step-first-para{
    font-size: 20px;
    font-weight: 600;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
 }
</style>
