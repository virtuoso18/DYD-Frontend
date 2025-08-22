<template>
<div class="main">
    
    
    <a-row>
        
        <a-col :lg="8" :md="8" :xs="24" :sm="24" style="padding:5px;">
        <div style="border:1px solid rgba(0,0,0,0.1);padding: 5px;border-radius:10px;">

            
            <img src="../../../assets/home_main_banner.jpg" style="width:100%;border-radius:10px" alt="">
            <a-row style="padding-top:5px">
                    <a-col :span="22" >
                        <a-tag>living room </a-tag>
                        <a-tag>modern</a-tag>
                    </a-col>
                    <a-col :span="2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 16 16" fill="#000000" class="bi bi-three-dots-vertical">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                    </a-col>
                </a-row>
                
            </div>
        </a-col>

    </a-row>
</div>
</template>
<script>
export default {
    name:'comunity'
} 
</script>
<style scoped >
.main{
    margin-top:10px;
    border-radius:20px;
    border:1px solid rgba(128, 128, 128, 0.167);
    padding:10px;
    min-height:100vh;
    background-color: white;
}
</style>