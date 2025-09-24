<template>
<div class="main">
  <h2>Requests</h2>
     <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="All Requests">All Requests</a-tab-pane>
    <a-tab-pane key="2" tab="Pending" >Pending</a-tab-pane>
    <a-tab-pane key="3" tab="Completed">Completed</a-tab-pane>
    <a-tab-pane key="4" tab="Rejected">Rejected</a-tab-pane>
  </a-tabs>
</div>
</template>




<script>
import {HeartOutlined} from '@ant-design/icons-vue'
export default {
  name: 'my_requests',
  components:{
    HeartOutlined
  },
  data() {
    return {
      activeKey :'1',
      requests: [  ]
    }
  },
  methods: {

  }
}
</script>


<style scoped>
.main{
  padding: 20px;
  /* display: flex; */
  /* flex-direction: column ; */
  /* align-items: center; */
  /* justify-content: center; */
  height: 90vh;
  background-color: white;;
  border-radius: 20px;
  margin-top:15px;
  border:1px solid rgba(0,0,0,0.1);
}
</style>