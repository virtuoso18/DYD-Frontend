<template>
<h1>manage community post requests</h1>
{{ access_recieved.community }}
</template>
<script>
export default {
    name:'manage-site-community-post',
    props:{
        access_recieved:Object
    },
    
}
</script>