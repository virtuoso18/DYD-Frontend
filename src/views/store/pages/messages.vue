<template>

      <div class="main">

    <div class="chat-app">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-header">
                <h2>Messages</h2>
                <div class="search-container">
                    <input 
                        type="text" 
                        placeholder="Search by name" 
                        class="search-input"
                        v-model="searchQuery"
                    >
                </div>
            </div>

            <div class="sidebar-content">
                <!-- User Selection Dropdown -->
                <!-- <div class="new-chat-section">
                    <select v-model="selectedUserId" @change="startChatWithUser" class="user-select">
                        <option value="">Start new chat...</option>
                        <option 
                            v-for="user in filteredUsers" 
                            :key="user.id" 
                            :value="user.id"
                        >
                            {{ user.first_name }} {{ user.last_name }}
                        </option>
                    </select>
                </div> -->

                <!-- Conversations List -->
                <div class="conversations-list">
                    <div 
                        v-for="room in filteredRooms" 
                        :key="room.id"
                        class="conversation-item"
                        :class="{ active: currentRoomId === room.id }"
                        @click="selectRoom(room.id, get_proper_user_avatar(room.userProfilsAvatar).first_name +' '+ get_proper_user_avatar(room.userProfilsAvatar).last_name    ,  get_proper_user_avatar(room.userProfilsAvatar).avatar + '?t=' + new Date().getTime() )">
                        <!-- {{ get_proper_user_avatar(room.userProfilsAvatar) }} -->
                        <div class="avatar">
                            <a-avatar size="large" :src="this.$store.state.root_media_api+get_proper_user_avatar(room.userProfilsAvatar).avatar"></a-avatar>
                            <!-- <div class="avatar-circle">{{ getInitials(room.name) }}</div> -->
                        </div>
                        <div class="conversation-info">
                            <div class="conversation-header">
                                <!-- <h4 class="conversation-name">{{ room.name }}</h4> -->
                                <h4 class="conversation-name">{{ get_proper_user_avatar(room.userProfilsAvatar).first_name }} {{ get_proper_user_avatar(room.userProfilsAvatar).last_name }}</h4>

                                <span class="time">{{ room.lastMessageTime || '1 day ago' }}</span>
                            </div>
                            <div class="conversation-preview">
                                    <p>{{ room.lastMessage || 'Hi, how are you?' }}</p>
                                    <span 
                                        v-if="room.unseenCount > 0"
                                        class="unread-count"
                                    >
                                        {{ room.unseenCount }}
                                    </span>
                                </div>
                            <!-- <div class="conversation-preview">
                                <p>{{ room.lastMessage || 'Hi, how are you?' }}</p>
                                <span 
                                    v-if="unreadCounts[room.id] > 0"
                                    class="unread-count"
                                >
                                    {{ unreadCounts[room.id] }}
                                </span>
                                <span 
                                    v-else-if="room.unseenCount > 0"
                                    class="unread-count"
                                >
                                    {{ room.unseenCount }}
                                </span>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Main Chat Area -->
        <div class="main-chat">
            <!-- Chat Header -->
            <div v-if="currentRoomId" class="chat-header">
                <div class="chat-header-info">
                    <div class="header-avatar">
                        <a-avatar size="large" :src="this.$store.state.root_media_api +this.currentUserAvatar" style="border:1px solid rgba(0,0,0,0.1)"></a-avatar>

                        <!-- <div class="avatar-circle">{{ getCurrentChatInitials() }}</div> -->
                    </div>
                    <div class="header-details">
                        <h3>{{ getCurrentChatName() }}</h3>
                        <!-- <span class="user-email">{{ getCurrentChatEmail() }}</span> -->
                    </div>
                </div>
            </div>

            <!-- Messages Area -->
            <div class="messages-container" ref="messagesContainer">
                <div v-if="!currentRoomId" class="empty-state">
                    <h3>Select a conversation to start chatting</h3>
                    <p>Choose from your existing conversations or start a new one</p>
                </div>
                
                <div v-else class="messages-list">
                    <div 
                        v-for="message in messages" 
                        :key="message.id || message.timestamp"
                        class="message-wrapper"
                        :class="{ own: message.user == currentUser.id }"
                    >
                        <div class="message-bubble">
                            <div class="message-content">{{ message.message }}</div>
                            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Message Input -->
            <div v-if="currentRoomId" class="message-input-container">
                <div class="message-input-wrapper">
                    <input 
                        type="text" 
                        v-model="newMessage"
                        placeholder="Type here" 
                        class="message-input"
                        @keypress.enter="sendMessage"
                    >
                    <button @click="sendMessage" class="send-button">
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
            API_BASE: 'http://127.0.0.1:8000/chat'
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
            // {
            //     "id": "d9202fc1-c8fc-40f1-8018-0872980df559",
            //     "member": [
            //         {
            //             "id": 1,
            //             "first_name": "ashish",
            //             "last_name": "waykar",
            //             "email": "ashish@gmail.com"
            //         },
            //         {
            //             "id": 2,
            //             "first_name": "test-user-2",
            //             "last_name": "DYD",
            //             "email": "user2screpa@gmail.com"
            //         }
            //     ],
            //     "lastMessage": "hello",
            //     "lastMessageTimestamp": "2025-09-30T06:48:29.361756Z",
            //     "unseenCount": 0,
            //     "userProfilsAvatar": {
            //         "user_1": {
            //             "id": 1,
            //             "first_name": "ashish",
            //             "last_name": "waykar",
            //             "avatar": "/media/profiles/profile_pictures/1_404e944c2b50486087e66143852c6e39.jpg"
            //         },
            //         "user_2": {
            //             "id": 2,
            //             "first_name": "test-user-2",
            //             "last_name": "DYD",
            //             "avatar": "/media/profiles/85a4049d14d0b7abb95300d06ac0e6c18fdfd5ea.png"
            //         }
            //     },
            //     "type": "DM",
            //     "name": "test-user-2 & ashish"
            // }
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
        
        // async startChatWithUser() {
        //     if (!this.selectedUserId) return;
        //     const selectedUser = this.allUsers.find(user => user.id == this.selectedUserId);
        //     if (!selectedUser) return;
            
        //     try {
        //         const response = await fetch(`${this.API_BASE}/chats`, {
        //             method: 'POST',
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify({
        //                 type: 'DM',
        //                 members: [this.currentUser.id, parseInt(this.selectedUserId)],
        //                 name: `${this.currentUser.first_name} & ${selectedUser.first_name}`
        //             })
        //         });
                
        //         const data = await response.json();
        //         const room = data.room || data;
                
        //         if (data.created) this.userRooms.push(room);
        //         this.selectRoom(room.id, room.name);
                
        //         if (this.websocket?.readyState === WebSocket.OPEN) {
        //             this.websocket.send(JSON.stringify({ action: "join_room", roomId: room.id }));
        //         }
        //         this.selectedUserId = '';
        //     } catch (error) {
        //         console.error('Error creating room:', error);
        //     }
        // },
        
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
    
    const wsUrl = `ws://localhost:8000/ws/users/${this.currentUser.id}/chat/?token=${token}`;
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

        
        // handleWebSocketMessage(data) {
        //     if (!data) return;
            
        //     switch (data.action) {
        //         case 'message':
        //             this.handleIncomingMessage(data);
        //             break;
        //         case 'onlineUser':
        //             this.updateOnlineUsers(data.userList);
        //             break;
        //         case 'error':
        //             console.error('WebSocket error:', data.message);
        //             break;
        //     }
        // },
        handleWebSocketMessage(data) {
            if (!data) return;
            
            switch (data.action) {
                case 'message':
                    this.handleIncomingMessage(data);
                    break;
                case 'onlineUser':
                    this.updateOnlineUsers(data.userList);
                    break;
                case 'messages_seen':  // ADD THIS NEW CASE
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
        }
    },
    
    mounted() {
        this.openRoomFromQuery()
        if (this.currentUser?.id) {
            this.initializeChat();
        }
    },
    
    beforeUnmount() {
        if (this.websocket) {
            this.websocket.close(1000, 'Component unmounting');
        }
    }
}
</script>

<style scoped>
.main {
  padding: 5px;
  /* height: 90vh;*/
  background-color: white;
  border-radius: 20px;
  margin-top: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Your existing styles remain the same */
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#app {
    height: 100vh;
}

/* Authentication Styles */
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.auth-section {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
}

.auth-section h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;
}

.form-group input:focus {
    outline: none;
    border-color: #4285f4;
}

.auth-btn {
    width: 100%;
    padding: 12px;
    background: #4285f4;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.auth-btn:hover {
    background: #3367d6;
}

.error {
    color: #d93025;
    margin-top: 10px;
    font-size: 14px;
}

.success {
    color: #137333;
    margin-top: 10px;
    font-size: 14px;
}

/* Chat App Styles */
.chat-app {
    display: flex;
    height: 100vh;
    background: #f8f9fa;
}

/* Sidebar Styles */
.sidebar {
    width: 400px;
    background: white;
    border-right: 1px solid #e8eaed;
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e8eaed;
}

.sidebar-header h2 {
    margin: 0 0 16px 0;
    font-size: 24px;
    font-weight: 500;
    color: #202124;
}

.search-container {
    position: relative;
}

.search-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e8eaed;
    border-radius: 24px;
    background: #f8f9fa;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
}

.search-input:focus {
    background: white;
    border-color: #4285f4;
    box-shadow: 0 2px 5px 1px rgba(64,60,67,.16);
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
}

.new-chat-section {
    padding: 16px 24px;
    border-bottom: 1px solid #e8eaed;
}

.user-select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e8eaed;
    border-radius: 8px;
    background: white;
    font-size: 14px;
    cursor: pointer;
}

.conversations-list {
    padding: 8px 0;
}

.conversation-item {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-left: 3px solid transparent;
}

.conversation-item:hover {
    background: #f8f9fa;
}

.conversation-item.active {
    background: #e8f0fe;
    border-left-color: #4285f4;
}

.avatar {
    margin-right: 16px;
    flex-shrink: 0;
}

.avatar-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #4285f4;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 16px;
}

.conversation-info {
    flex: 1;
    min-width: 0;
}

.conversation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.conversation-name {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    color: #202124;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.time {
    font-size: 12px;
    color: #5f6368;
    flex-shrink: 0;
}

.conversation-preview {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.conversation-preview p {
    margin: 0;
    font-size: 14px;
    color: #5f6368;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}

.unread-count {
    background: #4285f4;
    color: white;
    border-radius: 10px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 500;
    margin-left: 8px;
    flex-shrink: 0;
}

/* Main Chat Area */
.main-chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: white;
}

.chat-header {
    padding: 16px 24px;
    border-bottom: 1px solid #e8eaed;
    background: white;
    position: sticky;
    top: 0;
    z-index: 10;
}

.chat-header-info {
    display: flex;
    align-items: center;
}

.header-avatar {
    margin-right: 16px;
}

.header-avatar .avatar-circle {
    width: 40px;
    height: 40px;
    font-size: 14px;
}

.header-details h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 500;
    color: #202124;
}

.user-email {
    font-size: 14px;
    color: #5f6368;
}

.messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: #5f6368;
}

.empty-state h3 {
    margin: 0 0 8px 0;
    color: #202124;
}

.empty-state p {
    margin: 0;
    font-size: 14px;
}

.messages-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.message-wrapper {
    display: flex;
    justify-content: flex-start;
}

.message-wrapper.own {
    justify-content: flex-end;
}

.message-bubble {
    max-width: 70%;
    position: relative;
}

.message-content {
    padding: 12px 16px;
    border-radius: 18px;
    background: #e8eaed;
    color: #202124;
    word-wrap: break-word;
    line-height: 1.4;
}

.message-wrapper.own .message-content {
    background: #4285f4;
    color: white;
}

.message-time {
    font-size: 11px;
    color: #5f6368;
    margin-top: 4px;
    text-align: right;
}

.message-wrapper.own .message-time {
    color: rgba(16, 16, 16, 0.7);
}

.message-input-container {
    padding: 16px 24px;
    border-top: 1px solid #e8eaed;
    background: white;
}

.message-input-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 800px;
}

.message-input {
    flex: 1;
    padding: 12px 20px;
    border: 1px solid #e8eaed;
    border-radius: 24px;
    outline: none;
    font-size: 14px;
    transition: all 0.2s;
    background: #f8f9fa;
}

.message-input:focus {
    background: white;
    border-color: #4285f4;
    box-shadow: 0 2px 5px 1px rgba(64,60,67,.16);
}

.send-button {
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background: #4285f4;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.send-button:hover {
    background: #3367d6;
}

.send-button:disabled {
    background: #e8eaed;
    cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
    .sidebar {
        width: 100%;
        max-width: 350px;
    }
    
    .main-chat {
        display: none;
    }
}
</style>