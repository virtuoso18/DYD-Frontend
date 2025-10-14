<template>
  <a-modal 
    v-model:open="modal_create_request_to_business" 
    centered 
    :closable="false"
    @close="CloseModal" 
    title="Upload your Room Photo" 
    @ok="handleSubmit"
    :ok-text="'Submit'"
    :cancel-text="'Cancel'"
    width="900px"
  >
    <!-- <div class="upload-form"> -->
        <a-row>
            <a-col :sm="24" :xs="24" :md="12" :lg="12" style="padding-top:10px" >
                <!-- Room Photo Upload Section -->
      <div class=""  >
        <h4>Upload Room Photo</h4>
        <a-upload-dragger
          v-model:fileList="fileList"
          name="roomPhoto"
          :multiple="false"
          :before-upload="beforeUpload"
          @change="handleFileChange"
          accept=".png,.jpg,.jpeg"
          :max-count="1"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined />
          </p>
          <p class="ant-upload-text">Drag and drop file here or click to upload</p>
          <p class="ant-upload-hint">
            Supported file format: png, jpeg<br>
            file size: 50MB
          </p>
        </a-upload-dragger>
      </div>
            </a-col>
            <a-col :sm="24" :xs="24" :md="12" :lg="12">
                
      <!-- Email Input Section -->
      <div class="form-section" v-if="!hasToken" style="padding-bottom:5px;">
        <h4>Enter Email</h4>
        <a-input 
          v-model:value="formData.email" 
          placeholder="Enter Email"
          type="email"
          :status="emailError ? 'error' : ''"
        />
        <div v-if="emailError" class="error-message">{{ emailError }}</div>
      </div>

      <!-- Message Section -->
      <div class="form-section" style="padding-top:0px;">
        <h4>Write a message</h4>
        <a-textarea 
          v-model:value="formData.message" 
          placeholder="Describe how you’d like your room to look and which furniture you’d like to add."
          :rows="6"
          :max-length="500"
          show-count
        />
      </div>

            </a-col>
        </a-row>
      

      <!-- Note Section -->
      <a-alert
        message="Note: Once your room photo is completed, we will notify you via register email address."
        description=""
        type="warning"
        show-icon
        class="note-alert"
      />
    <!-- </div> -->
  </a-modal>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'RequestCreateRoom',
  components: {
    InboxOutlined
  },
   computed: {
        hasToken() {
        return localStorage.getItem("token") !== null;
        }
    },
  props: {
    request_create_room: {
      type: Object,
      default: () => ({})
    },
    canMessageBusiness: {type: Object}
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const modal_create_request_to_business = ref(false)
    const fileList = ref([])
    
    const formData = reactive({
      email: '',
      message: '',
      roomPhoto: null
    })

    const emailError = ref('')

    // Email validation
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    // File upload validation
    const beforeUpload = (file) => {
      const isValidType = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
      if (!isValidType) {
        message.error('You can only upload PNG/JPEG files!')
        return false
      }
      
      const isValidSize = file.size / 1024 / 1024 < 50
      if (!isValidSize) {
        message.error('Image must be smaller than 50MB!')
        return false
      }
      
      return false // Prevent auto upload
    }

    const handleFileChange = (info) => {
      const { fileList: newFileList } = info
      fileList.value = newFileList.slice(-1) // Keep only the latest file
      
      if (newFileList.length > 0) {
        formData.roomPhoto = newFileList[0].originFileObj || newFileList[0]
      }
    }

    const validateForm = () => {
      let isValid = true
      
      // Reset errors
      emailError.value = ''
      
      // Validate email
      if (!formData.email.trim()) {
        emailError.value = 'Email is required'
        isValid = false
      } else if (!validateEmail(formData.email)) {
        emailError.value = 'Please enter a valid email address'
        isValid = false
      }
      
      // Validate file upload
      if (!formData.roomPhoto) {
        message.error('Please upload a room photo')
        isValid = false
      }
      
      return isValid
    }

    const handleSubmit = () => {
      if (!validateForm()) {
        return
      }

      const submitData = {
        email: formData.email,
        message: formData.message,
        roomPhoto: formData.roomPhoto
      }

      // Emit the form data to parent component
      emit('submit', submitData)
      
      message.success('Room photo request submitted successfully!')
      CloseModal()
    }

    const CloseModal = () => {
      // Reset form
      formData.email = ''
      formData.message = ''
      formData.roomPhoto = null
      fileList.value = []
      emailError.value = ''
      
      modal_create_request_to_business.value = false
      emit('close')
    }

    // Method to open modal (can be called from parent)
    const openModal = () => {
      modal_create_request_to_business.value = true
    }

    return {
      modal_create_request_to_business,
      fileList,
      formData,
      emailError,
      beforeUpload,
      handleFileChange,
      handleSubmit,
      CloseModal,
      openModal
    }
  }
})
</script>

<style scoped>
.upload-form {
  padding: 16px 0;
}

.upload-section,
.form-section {
    padding-left:10px;
    /* padding-bottom:10px; */
    padding-right:10px;
    padding-top:10px;
  /* margin-bottom: 24px; */
}

.upload-section h4,
.form-section h4 {
  margin-bottom: 8px;
  font-weight: 600;
  color: #262626;
}

.ant-upload-drag-icon {
  font-size: 48px;
  color: #1890ff;
}

.ant-upload-text {
  font-size: 16px;
  color: #262626;
  margin: 16px 0 8px 0;
}

.ant-upload-hint {
  font-size: 14px;
  color: #8c8c8c;
  line-height: 1.4;
}

.error-message {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 4px;
}

.note-alert {
  margin-top: 16px;
}

:deep(.ant-upload-dragger) {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  background: #fafafa;
  transition: border-color 0.3s;
}

:deep(.ant-upload-dragger:hover) {
  border-color: #1890ff;
}

:deep(.ant-upload-dragger.ant-upload-drag-hover) {
  border-color: #1890ff;
}
</style>