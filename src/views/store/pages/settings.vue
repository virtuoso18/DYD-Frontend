<template>
    <a-modal :open="change_password_modal" title="Change Your Passwoerd">
        <label for=""> Current Password</label>
        <a-input :value="currentPassword"></a-input>
        <label for=""> New Password</label>
        <a-input :value="newPassword"></a-input>
        <label for=""> Confirm New Password</label>
        <a-input :value="confirmPassword"></a-input>
    </a-modal>
    <div style="background-color: white;border-radius:15px;border:1px solid rgba(0,0,0,0.1);margin-top:15px;height:90vh;padding:10px">
        <h2>Settings</h2>
        <div style="border:1px solid rgba(0,0,0,0.2);padding:10px;border-radius:7px">
            <h4>Manage Watermark</h4>
            
            <a-row>
                <a-col :span="20"><p>To display your brand watermark on product images, turn on the toggle</p></a-col>
                <a-col :span="4" style="display: flex;justify-content: center;align-items:center;"><a-switch :value="watermark"></a-switch></a-col>
            </a-row>
            
        </div>
        <br>
        <div style="border:1px solid rgba(0,0,0,0.2);padding:10px;border-radius:7px">
           
            <a-row>
                <a-col :span="18">
                    <h4>Manage Password</h4>
            <p>Set a new password to keep your account safe.</p>
                </a-col>
                <a-col :span="6" @click="change_password_modal=true" style="display: flex;justify-content: center;align-items:center;"><a-button type="primary">Change Password</a-button></a-col>
            </a-row>
            
        </div>
    </div>
</template>
<script>
export default {
    name:'settings',
    data () { return {
        watermark:false,

        change_password_modal:false,
        currentPassword:'', 
        newPassword:'', 
        confirmPassword:'', 
    }},
    methods:{
        changePassword(){
            
        }
    }
}
</script>