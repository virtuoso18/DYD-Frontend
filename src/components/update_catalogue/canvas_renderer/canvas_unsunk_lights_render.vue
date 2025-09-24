<template>
  <div style="display: flex;justify-content: center;align-items: center;height:100%;">

    <div>

      <h1>
        Un-sunk light 
      </h1>
      <p>pending developement </p>
    </div>
  </div>
  </template>

<script >
export default {
  name: "unsung-light",
  props:{
      baseImage: {
      type: String,
      required: true,
    },
    selectedlightuuid:{
      type: String,
      required: true,
    },
    depthMask: {
      type: String,
      default: null,
    },
  }
}
</script>


<style scoped>
</style> 
