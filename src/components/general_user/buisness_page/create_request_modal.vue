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
    <a-row>
      <a-col :sm="24" :xs="24" :md="12" :lg="12" style="padding-top:10px">
        <!-- Room Photo Upload Section -->
        <div class="">
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
            placeholder="Describe how you'd like your room to look and which furniture you'd like to add."
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
  </a-modal>
</template>

<script>
import { InboxOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default {
  name: 'RequestCreateRoom',
  components: {
    InboxOutlined
  },
  props: {
    request_create_room: {
      type: Object,
      default: () => ({})
    },
    canMessageBusiness: {
      type: Object
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      modal_create_request_to_business: false,
      fileList: [],
      formData: {
        email: '',
        message: '',
        roomPhoto: null
      },
      emailError: ''
    }
  },
  computed: {
    hasToken() {
      return localStorage.getItem("token") !== null
    }
  },
  methods: {
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    beforeUpload(file) {
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
    },

    handleFileChange(info) {
      const { fileList: newFileList } = info
      this.fileList = newFileList.slice(-1) // Keep only the latest file
      
      if (newFileList.length > 0) {
        this.formData.roomPhoto = newFileList[0].originFileObj || newFileList[0]
      }
    },

    validateForm() {
      let isValid = true
      
      // Reset errors
      this.emailError = ''
      
      // Validate email
      if (!this.formData.email.trim()) {
        this.emailError = 'Email is required'
        isValid = false
      } else if (!this.validateEmail(this.formData.email)) {
        this.emailError = 'Please enter a valid email address'
        isValid = false
      }
      
      // Validate file upload
      if (!this.formData.roomPhoto) {
        message.error('Please upload a room photo')
        isValid = false
      }
      
      return isValid
    },

    handleSubmit() {
      // if (!this.validateForm()) {
      //   return
      // }

      const submitData = {
        email: this.formData.email,
        message: this.formData.message,
        roomPhoto: this.formData.roomPhoto
      }

      // Emit the form data to parent component
      this.$emit('submit', submitData)
      
      message.success('Room photo request submitted successfully!')
      this.CloseModal()
    },

    CloseModal() {
      // Reset form
      this.formData.email = ''
      this.formData.message = ''
      this.formData.roomPhoto = null
      this.fileList = []
      this.emailError = ''
      
      this.modal_create_request_to_business = false
      this.$emit('close')
    },

    openModal() {
      this.modal_create_request_to_business = true
    }
  }
}
</script>

<style scoped>
.upload-form {
  padding: 16px 0;
}

.upload-section,
.form-section {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
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