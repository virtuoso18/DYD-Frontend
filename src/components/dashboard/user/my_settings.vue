<template>
<div class="main">
    <div >
<HeartOutlined /> my settings
    </div>
</div>
</template>




<script>
import {HeartOutlined} from '@ant-design/icons-vue'
export default {
  name: 'my_settings',
  components:{
    HeartOutlined
  },
  data() {
    return {
      
    }
  },
  methods: {

  }
}
</script>


<style scoped>
.main{
  padding: 20px;
  display: flex;
  flex-direction: column ;
  align-items: center;
  justify-content: center;
  height: 90vh;
  background-color: white;;
  border-radius: 20px;
  margin-top:15px;
  border:1px solid rgba(0,0,0,0.1);
}
</style>