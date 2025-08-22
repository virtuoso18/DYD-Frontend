<template>
<business_user_dashboard/>
 <router-link :to="'/start-new-catalogue'">
    <a-float-button  > <template #icon>
      <FormatPainterOutlined />
    </template></a-float-button>
 </router-link>
</template>
<script>
import business_user_dashboard from '@/views/user/business/dashboard.vue'
import {FormatPainterOutlined} from '@ant-design/icons-vue';
export default {
    name:'dashboard',
    components:{
        business_user_dashboard,
        FormatPainterOutlined
    },
    data(){
        return {
            userType:'user'
        }
    },
    methods:{
        async fetchUserType(){

        }
    }
}
</script>