<template>
  <h1>Access Overview</h1>
  {{ access_recieved }}
</template>

<script>
export default {
  name: 'access_overview',
  data() { return { } },
  props:{
        access_recieved:Object
    }
}
</script>

<style scoped></style>