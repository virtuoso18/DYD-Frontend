<template>
  <div style="background-color:#f2f3f3;border-radius:10px">

    <a-row>
      <a-col :span="8" style="padding:5px">
        <div style="background-color:white;border-radius:10px">

          <a-steps :current="currentStep" finish-status="finish" size="small" style="margin-bottom: 20px;">
            <a-step title="Image" />
            <a-step title="Masks" />
            <a-step title="Text" />
            <a-step title="Save" />
          </a-steps>

          
        </div>
        </a-col>
      
      <a-col :span="16" style="height:100vh;display:flex;justify-content: center;;align-items: center;padding:10px;">
        <div style="background-color:white;border-radius:10px">
Canvas Here 
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  data (){ return {
    currentStep:"Image"
  }}
}
</script>