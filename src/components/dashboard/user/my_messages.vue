<template>
  <div class="main">
    <a-row style="height: 100%; border-radius: 10px; overflow: hidden;">
      <!-- Contact List Sidebar -->
      <a-col :sm="24" :xs="24" :md="8" :lg="6" class="contact-sidebar">
        <div class="sidebar-header">
          <h2>Messages</h2>
          <a-input 
            placeholder="Search by name" 
            class="search-input"
            v-model:value="searchQuery"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </div>
        
        <div class="contact-list">
          <div 
            v-for="contact in filteredContacts" 
            :key="contact.id"
            :class="['contact-item', { 'active': selectedContact?.id === contact.id }]"
            @click="selectContact(contact)"
          >
            <div class="contact-avatar">
              <a-avatar :src="contact.avatar" />
            </div>
            <div class="contact-info">
              <h3>{{ contact.name }}</h3>
              <p>{{ contact.lastMessage }}</p>
            </div>
            <div class="contact-meta">
              <span class="time">{{ contact.time }}</span>
            </div>
          </div>
        </div>
      </a-col>

      <!-- Chat Area -->
      <a-col :sm="24" :xs="24" :md="16" :lg="18" class="chat-area">
        <div v-if="selectedContact" class="chat-container">
          <!-- Chat Header -->
          <div class="chat-header">
            <div class="chat-user-info">
              <a-avatar :src="selectedContact.avatar" />
              <div class="user-details">
                <h3>{{ selectedContact.name }}</h3>
                <p>{{ selectedContact.email }}</p>
              </div>
            </div>
          </div>

          <!-- Messages Container -->
          <div class="messages-container" ref="messagesContainer">
            <div 
              v-for="message in messages" 
              :key="message.id"
              :class="['message-wrapper', message.isOwn ? 'own-message' : 'received-message']"
            >
              <div class="message-bubble">
                <p>{{ message.text }}</p>
                <span class="message-time">{{ message.time }}</span>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="message-input-container">
            <a-input 
              v-model:value="newMessage"
              placeholder="Type here"
              class="message-input"
              @pressEnter="sendMessage"
            />
            <a-button 
              type="primary" 
              class="send-button"
              @click="sendMessage"
              :disabled="!newMessage.trim()"
            >
              <SendOutlined />
            </a-button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-chat">
          <div class="empty-content">
            <MessageOutlined style="font-size: 48px; color: #ccc; margin-bottom: 16px;" />
            <h3>Select a conversation</h3>
            <p>Choose from your existing conversations or start a new one</p>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { SearchOutlined, SendOutlined, MessageOutlined } from '@ant-design/icons-vue'

export default {
  name: 'ChatInterface',
  components: {
    SearchOutlined,
    SendOutlined,
    MessageOutlined
  },
  data() {
    return {
      searchQuery: '',
      newMessage: '',
      selectedContact: null,
      contacts: [
        {
          id: 1,
          name: 'Aluma',
          email: 'Sample@gmail.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aluma',
          lastMessage: 'Hi, how are you?',
          time: '1 day ago'
        },
        {
          id: 2,
          name: 'My Home Design',
          email: 'design@company.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design',
          lastMessage: 'Hi, how are you?',
          time: '1 day ago'
        },
        {
          id: 3,
          name: 'Tony Stark',
          email: 'tony@stark.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tony',
          lastMessage: 'Hi, how are you?',
          time: '1 day ago'
        }
      ],
      messages: []
    }
  },
  computed: {
    filteredContacts() {
      if (!this.searchQuery) return this.contacts
      return this.contacts.filter(contact => 
        contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    selectContact(contact) {
      this.selectedContact = contact
      this.loadMessages(contact.id)
    },
    loadMessages(contactId) {
      // Simulate loading messages for the selected contact
      const sampleMessages = [
        {
          id: 1,
          text: 'Korem ipsum dolor sit amet, consectetur adipiscing elit.',
          isOwn: false,
          time: '15 min ago'
        },
        {
          id: 2,
          text: 'Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
          isOwn: false,
          time: '15 min ago'
        },
        {
          id: 3,
          text: 'Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
          isOwn: true,
          time: '15 min ago'
        }
      ]
      this.messages = sampleMessages
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    sendMessage() {
      if (!this.newMessage.trim()) return
      
      const message = {
        id: Date.now(),
        text: this.newMessage,
        isOwn: true,
        time: 'now'
      }
      
      this.messages.push(message)
      this.newMessage = ''
      
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  },
  mounted() {
    // Auto-select first contact
    if (this.contacts.length > 0) {
      this.selectContact(this.contacts[0])
    }
  }
}
</script>

<style scoped>
.main {
  padding: 5px;
  height: 90vh;
  background-color: white;
  border-radius: 20px;
  margin-top: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Contact Sidebar Styles */
.contact-sidebar {
  background: white;
  height: 100%;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-header h2 {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
}

.search-input {
  border-radius: 20px;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f8f8f8;
}

.contact-item:hover {
  background-color: #f8f9fa;
}

.contact-item.active {
  background-color: #e6f7ff;
  border-right: 3px solid #1890ff;
}

.contact-avatar {
  margin-right: 12px;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-meta .time {
  font-size: 12px;
  color: #999;
}

/* Chat Area Styles */
.chat-area {
  background: #f3f2f2;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: white;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-user-info {
  display: flex;
  align-items: center;
}

.user-details {
  margin-left: 12px;
}

.user-details h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 500;
}

.user-details p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-wrapper {
  display: flex;
  margin-bottom: 8px;
}

.message-wrapper.received-message {
  justify-content: flex-start;
}

.message-wrapper.own-message {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.received-message .message-bubble {
  background: white;
  border-bottom-left-radius: 4px;
}

.own-message .message-bubble {
  background: #4f7df3;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble p {
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  display: block;
  text-align: right;
}

.message-input-container {
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  align-items: center;
}

.message-input {
  flex: 1;
  border-radius: 20px;
  border: 1px solid #d9d9d9;
}

.send-button {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.empty-chat {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-content {
  text-align: center;
  color: #666;
}

.empty-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.empty-content p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main {
    padding: 10px;
    margin-top: 10px;
  }
  
  .message-bubble {
    max-width: 85%;
  }
  
  .sidebar-header {
    padding: 16px;
  }
  
  .contact-item {
    padding: 10px 16px;
  }
}
</style>