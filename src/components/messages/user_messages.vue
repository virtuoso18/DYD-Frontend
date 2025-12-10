<template>
  <div className="md:pt-3">

    <div class="p-1 bg-white rounded-2xl    border border-gray-200">
      <div class="flex h-screen overflow-auto bg-gray-50">
        <!-- Sidebar -->
        <div 
          :class="[
            'w-full md:w-[400px] bg-white border-r border-gray-200 flex flex-col',
            currentRoomId && isMobile ? 'hidden' : 'flex'
          ]"
        >
          <!-- Sidebar Header -->
          <div class="p-5 border-b border-gray-200">
            <!-- Back button for mobile -->
            <div v-if="isMobile" class="flex items-center gap-3 mb-4">
              <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-full">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 class="text-2xl font-medium text-gray-900">Messages</h2>
            </div>
            <h2 v-else class="text-2xl font-medium text-gray-900 mb-4">Messages</h2>
            
            <!-- Search -->
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search by name" 
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-3xl text-sm outline-none transition-all focus:bg-white focus:border-blue-500 focus:shadow-lg"
                v-model="searchQuery"
              >
            </div>
          </div>
  
          <!-- Conversations List -->
          <div class="flex-1 overflow-y-auto py-2">
            <div 
              v-for="room in filteredRooms" 
              :key="room.id"
              class="flex items-center px-6 py-3 cursor-pointer transition-all border-l-4 border-transparent hover:bg-gray-50"
              :class="{ 'bg-blue-50 !border-blue-500': currentRoomId === room.id }"
              @click="selectRoom(room.id, get_proper_user_avatar(room.userProfilsAvatar).first_name +' '+ get_proper_user_avatar(room.userProfilsAvatar).last_name, get_proper_user_avatar(room.userProfilsAvatar).avatar + '?t=' + new Date().getTime())"
            >
              <!-- Avatar -->
              <div class="mr-4 flex-shrink-0">
                <a-avatar 
                  size="large" 
                  :src="$store.state.root_media_api + get_proper_user_avatar(room.userProfilsAvatar).avatar"
                />
              </div>
  
              <!-- Conversation Info -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-1">
                  <h4 class="text-base font-medium text-gray-900 truncate">
                    {{ get_proper_user_avatar(room.userProfilsAvatar).first_name }} 
                    {{ get_proper_user_avatar(room.userProfilsAvatar).last_name }}
                  </h4>
                  <span class="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {{ room.lastMessageTime || '1 day ago' }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <p class="text-sm text-gray-500 truncate flex-1">
                    {{ room.lastMessage || 'Hi, how are you?' }}
                  </p>
                  <span 
                    v-if="room.unseenCount > 0"
                    class="bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs font-medium ml-2 flex-shrink-0"
                  >
                    {{ room.unseenCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Main Chat Area -->
        <div 
          :class="[
            'flex-1 flex flex-col bg-white',
            !currentRoomId && isMobile ? 'hidden' : 'flex'
          ]"
        >
          <!-- Chat Header -->
          <div v-if="currentRoomId" class="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div class="flex items-center">
              <!-- Back button for mobile -->
              <button 
                v-if="isMobile"
                @click="closeChatMobile"
                class="mr-3 p-2 hover:bg-gray-100 rounded-full"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
  
              <div class="mr-4">
                <a-avatar 
                  size="large" 
                  :src="$store.state.root_media_api + currentUserAvatar" 
                  class="border border-gray-200"
                />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ getCurrentChatName() }}</h3>
              </div>
            </div>
          </div>
  
          <!-- Messages Area -->
          <div class="flex-1 overflow-y-auto px-6 py-4" ref="messagesContainer">
            <!-- Empty State -->
            <div v-if="!currentRoomId" class="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <h3 class="text-lg font-medium text-gray-900 mb-2">Select a conversation to start chatting</h3>
              <p class="text-sm">Choose from your existing conversations or start a new one</p>
            </div>
            
            <!-- Messages List -->
            <div v-else class="flex flex-col gap-4">
              <div 
                v-for="message in messages" 
                :key="message.id || message.timestamp"
                class="flex"
                :class="message.user == currentUser.id ? 'justify-end' : 'justify-start'"
              >
                <div class="max-w-[70%]">
                  <div 
                    class="px-4 py-3 rounded-2xl break-words leading-relaxed"
                    :class="message.user == currentUser.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-900'"
                  >
                    {{ message.message }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1 text-right">
                    {{ formatTime(message.timestamp) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Message Input -->
          <div v-if="currentRoomId" class="px-6 py-4 border-t border-gray-200 bg-white">
            <div class="flex items-center gap-3 max-w-3xl">
              <input 
                type="text" 
                v-model="newMessage"
                placeholder="Type here" 
                class="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-3xl text-sm outline-none transition-all focus:bg-white focus:border-blue-500 focus:shadow-lg"
                @keypress.enter="sendMessage"
              >
              <button 
                @click="sendMessage" 
                class="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                :disabled="!newMessage.trim()"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'ChatInterface',
    data() {
        return {
            currentUser: JSON.parse(localStorage.getItem('user')),
            allUsers: [],
            userRooms: [],
            currentRoomId: null,
            currentRoomName: null,
            currentUserAvatar:null,
            messages: [],
            newMessage: '',
            selectedUserId: '',
            onlineUsers: [],
            searchQuery: '',
            websocket: null,
            isMobile: false,
            // API_BASE: 'http://127.0.0.1:8000/chat'
             API_BASE: this.$store.state.root_api+'chat'
        };
    },
    
  watch: {
  '$route.query.chatId'(newVal, oldVal) {
    if (newVal && newVal !== oldVal) {
      this.openRoomFromQuery()
    }
  }
},

    computed: {
        filteredUsers() {
            if (!this.searchQuery) return this.allUsers;
            return this.allUsers.filter(user => 
                `${user.first_name} ${user.last_name}`.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        filteredRooms() {
            let rooms = this.userRooms;
            if (this.searchQuery) {
                rooms = rooms.filter(room =>
                    this.getOtherUserName(room).toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
            return rooms.sort((a, b) => {
                const aTime = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp) : 0;
                const bTime = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp) : 0;
                return bTime - aTime;
            });
        }
    },
    methods: {
       async openRoomFromQuery() {
            const roomId = this.$route.query.chatId;
        console.log("calling the room id there",roomId)

            if (roomId) {
                await this.loadUserRooms(); // Ensure rooms are loaded
                this.selectRoom_by_query(roomId);
            }
        },
     async selectRoom_by_query(roomId) {
            console.log("calling the room id there",roomId)
            if (!roomId) return;

            // Make sure rooms are loaded
            if (!this.userRooms || this.userRooms.length === 0) {
                await this.loadUserRooms();
            }

            const room = this.userRooms.find(r => String(r.id) === String(roomId));
            if (!room) return;

            // Leave previous room
            if (this.currentRoomId && this.currentRoomId !== roomId) {
                this.leaveCurrentRoom();
            }

            let new_user=null
            if(room.userProfilsAvatar.user_1.id !== this.currentUser.id){
                new_user= room.userProfilsAvatar.user_1
            }else new_user= room.userProfilsAvatar.user_2

            console.log(room.member)
            this.currentRoomId = room.id;
            this.currentRoomName = new_user.first_name + ' ' + new_user.last_name ;
            this.currentUserAvatar=new_user.avatar;

            // Reset unseen count
            room.unseenCount = 0;
            this.$forceUpdate();

            // Join websocket room
            this.joinRoom(room.id);

            // Load messages
            await this.loadMessages(room.id);
        },

        async initializeChat() {
            await this.loadAllUsers();
            await this.loadUserRooms();
            this.setupWebSocket();
        },
        
        getOtherUserName(room) {
            if (!room.member) return '';
            const other = room.member.find(m => m.id !== this.currentUser.id);
            return other ? `${other.first_name} ${other.last_name}` : 'Unknown';
        },
        
        async loadAllUsers() {
            try {
                const response = await fetch(`${this.API_BASE}/users`);
                this.allUsers = await response.json();
            } catch (error) {
                console.error('Error loading users:', error);
            }
        },
        
        async loadUserRooms() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${this.API_BASE}/users/${this.currentUser.id}/chats`, {
                    method: 'GET',
                    headers: { 'Authorization': `Token ${token}` }
                });
                this.userRooms = await response.json();
            } catch (error) {
                console.error('Error loading rooms:', error);
            }
        },
        
        async selectRoom(roomId, roomName, user_avatar) {
            if (!roomId) return;
            
            if (this.currentRoomId && this.currentRoomId !== roomId) {
                this.leaveCurrentRoom();
            }
            
            this.currentRoomId = roomId;
            this.currentRoomName = roomName;
            this.currentUserAvatar=user_avatar;
            // Reset unseen count for this room IMMEDIATELY
                const room = this.userRooms.find(r => r.id === roomId);
                if (room) {
                    room.unseenCount = 0;
                    // Force Vue reactivity
                    this.$forceUpdate();
                }
            
            this.joinRoom(roomId);
            await this.loadMessages(roomId);
        },
        
        leaveCurrentRoom() {
            if (this.websocket?.readyState === WebSocket.OPEN && this.currentRoomId) {
                this.websocket.send(JSON.stringify({ action: "leave_room", roomId: this.currentRoomId }));
            }
        },
        
        joinRoom(roomId) {
            if (this.websocket?.readyState === WebSocket.OPEN) {
                this.websocket.send(JSON.stringify({ action: "join_room", roomId: roomId }));
            }
        },
        
        async loadMessages(roomId) {
            if (!roomId) return;
            try {
                const response = await fetch(`${this.API_BASE}/chats/${roomId}/messages`);
                const data = await response.json();
                this.messages = Array.isArray(data.results || data) ? (data.results || data).reverse() : [];
                await this.markMessages_seen(roomId);
                this.$nextTick(() => this.scrollToBottom());
            } catch (error) {
                console.error('Error loading messages:', error);
                this.messages = [];
            }
        },
        
        async markMessages_seen(roomId) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${this.API_BASE}/mark-recieved-all-messages-seen/`, {
                    method: 'POST',
                    headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ room_id: roomId })
                });
                const result = await response.json();
                if (result.success) {
                    await this.loadUserRooms();
                }
            } catch (error) {
                console.error('Error marking messages seen:', error);
            }
        },
        
        sendMessage() {
            const message = this.newMessage.trim();
            if (!message || !this.currentRoomId || this.websocket?.readyState !== WebSocket.OPEN) return;
            
            this.websocket.send(JSON.stringify({
                action: 'message',
                message: message,
                user: this.currentUser.id,
                roomId: this.currentRoomId,
                timestamp: new Date().toISOString()
            }));
            this.newMessage = '';
        },
        
     setupWebSocket() {
    if (!this.currentUser?.id) return;
    
    // Fix: Check if websocket exists AND is not closed before closing
    if (this.websocket && this.websocket.readyState !== WebSocket.CLOSED) {
        this.websocket.close();
    }
    
    const token = localStorage.getItem('token');
    console.log('Token check:', token ? 'EXISTS' : 'MISSING');
    
    if (!token) {
        console.error('No token in localStorage');
        return;
    }
    
    // const wsUrl = `ws://localhost:8000/ws/users/${this.currentUser.id}/chat/?token=${token}`;
     const wsUrl = `${this.$store.state.websockets_address}/ws/users/${this.currentUser.id}/chat/?token=${token}`;
    console.log('Connecting with token:', wsUrl.substring(0, 60) + '...');
    
    this.websocket = new WebSocket(wsUrl);
    
    this.websocket.onopen = () => {
        console.log('Connected');
        setTimeout(() => {
            this.userRooms.forEach(room => {
                if (room.id) {
                    this.websocket.send(JSON.stringify({ action: "join_room", roomId: room.id }));
                }
            });
        }, 500);
    };
    
    this.websocket.onmessage = (event) => {
        if (event.data) {
            try {
                this.handleWebSocketMessage(JSON.parse(event.data));
            } catch (error) {
                console.error('Parse error:', error);
            }
        }
    };
    
    this.websocket.onclose = (event) => {
        console.log('Closed:', event.code);
        if (event.code === 4001) {
            console.error('Auth failed');
            return;
        }
        if (event.code !== 1000) {
            setTimeout(() => this.setupWebSocket(), 3000);
        }
    };
    
    this.websocket.onerror = (error) => console.error('Error:', error);
},

        
        handleWebSocketMessage(data) {
            if (!data) return;
            
            switch (data.action) {
                case 'message':
                    this.handleIncomingMessage(data);
                    break;
                case 'onlineUser':
                    this.updateOnlineUsers(data.userList);
                    break;
                case 'messages_seen':
                    this.handleMessagesSeen(data);
                    break;
                case 'error':
                    console.error('WebSocket error:', data.message);
                    break;
            }
        },
        
        handleMessagesSeen(data) {
            // Update the room to show messages were seen
            const room = this.userRooms.find(r => String(r.id) === String(data.roomId));
            if (room) {
                // If this is for messages YOU sent, clear the unseen count
                room.unseenCount = 0;
            }
        },
                
        handleIncomingMessage(data) {
            if (!data.message || !data.user || !data.roomId) return;
            
            const messageObj = {
                id: data.messageId || `msg_${Date.now()}`,
                message: data.message,
                user: parseInt(data.user),
                timestamp: data.timestamp || new Date().toISOString(),
                roomId: data.roomId,
                userName: data.userName
            };
            
            if (String(data.roomId) === String(this.currentRoomId)) {
                this.appendMessageToCurrentChat(messageObj);
            } else {
                this.updateUnseenCount(data.roomId);
            }
            
            this.updateRoomLastMessage(messageObj);
        },
        
        appendMessageToCurrentChat(messageData) {
            const isDuplicate = this.messages.some(msg => 
                msg.id === messageData.id || 
                (msg.user === messageData.user && msg.message === messageData.message)
            );
            
            if (!isDuplicate) {
                this.messages.push(messageData);
                this.$nextTick(() => this.scrollToBottom());
            }
        },
        
        updateUnseenCount(roomId) {
            const room = this.userRooms.find(r => String(r.id) === String(roomId));
            if (room) {
                room.unseenCount = (room.unseenCount || 0) + 1;
            }
        },
        
        updateRoomLastMessage(messageData) {
            const room = this.userRooms.find(r => String(r.id) === String(messageData.roomId));
            if (room) {
                room.lastMessage = messageData.message;
                room.lastMessageTime = this.formatTime(messageData.timestamp);
                room.lastMessageTimestamp = messageData.timestamp;
                
                const index = this.userRooms.indexOf(room);
                if (index > 0) {
                    this.userRooms.splice(index, 1);
                    this.userRooms.unshift(room);
                }
            }
        },
        
        updateOnlineUsers(userList) {
            this.onlineUsers = this.allUsers.filter(user => userList.includes(user.id));
        },
        
        get_proper_user_avatar(getProper_user_avatar){
            if(getProper_user_avatar.user_1.id !== this.currentUser.id){
                return getProper_user_avatar.user_1
            }else return getProper_user_avatar.user_2
        },
        
        getInitials(name) {
            if (!name) return '';
            return name.includes('&') 
                ? name.split(' & ').map(p => p.charAt(0)).join('').toUpperCase()
                : name.split(' ').map(w => w.charAt(0)).join('').toUpperCase().slice(0, 2);
        },
        
        getCurrentChatName() {
            return this.currentRoomName || '';
        },
        
        getCurrentChatInitials() {
            return this.getInitials(this.getCurrentChatName());
        },
        
        getCurrentChatEmail() {
            return 'sample@gmail.com';
        },
        
        formatTime(timestamp) {
            if (!timestamp) return '';
            const now = new Date();
            const messageTime = new Date(timestamp);
            const diffMs = now - messageTime;
            const minutes = Math.floor(diffMs / 60000);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) return `${days}d ago`;
            if (hours > 0) return `${hours}h ago`;
            if (minutes > 0) return `${minutes}m ago`;
            return 'just now';
        },
        
        scrollToBottom() {
            if (this.$refs.messagesContainer) {
                this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
            }
        },
        
        checkMobile() {
            this.isMobile = window.innerWidth < 768;
        },
        
        closeChatMobile() {
            this.currentRoomId = null;
            this.currentRoomName = null;
            this.currentUserAvatar = null;
            this.messages = [];
        },
        
        goBack() {
            // Optional: Add navigation logic if needed
            this.$router.back();
        }
    },
    
    mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
        this.openRoomFromQuery()
        if (this.currentUser?.id) {
            this.initializeChat();
        }
    },
    
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
        if (this.websocket) {
            this.websocket.close(1000, 'Component unmounting');
        }
    }
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>