<template>
    <div v-if="planDetails === null || planDetails === undefined" style="text-align:center"> Loading... </div>
  <div v-else-if="isPlanBlocked" class="plan-blocked-overlay">
    <div class="plan-blocked-popup">
  <!-- {{ brand.brand_email }}
  {{ brand_data }} -->

      <!-- Icon -->
      <div class="popup-icon-wrap" :style="planIsExpired ? 'background:#FAEEDA' : 'background:#EEEDFE'">
        <svg v-if="planIsExpired" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#BA7517" stroke-width="1.5"/>
          <path d="M12 7v5.5l3 3" stroke="#BA7517" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="#533AB7" stroke-width="1.5"/>
          <path d="M7 11V7a5 5 0 0110 0v4" stroke="#533AB7" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="12" cy="16" r="1.2" fill="#533AB7"/>
        </svg>
      </div>

      <!-- Badge — same for all user types -->
      <span
        class="popup-badge"
        :style="planIsExpired ? 'background:#FAEEDA;color:#854F0B' : 'background:#EEEDFE;color:#3C3489'"
      >
        {{ planIsExpired ? 'Plan expired' : 'No active plan' }}
      </span>

      <!-- Title -->
      <p class="popup-title">{{ popupTitle }}</p>

      <!-- Body -->
      <p class="popup-body">{{ popupBody }}</p>

      <div class="popup-divider"></div>

      <!-- Visitor/Professional: message textarea + actions -->
      <template v-if="isVisitor">
        <div class="popup-form">
          <textarea
            v-model="message"
            rows="6"
            class="popup-input"
            placeholder="Your message"
          ></textarea>
        </div>

        <div class="popup-actions">
          <a-button type="primary" block :disabled="sendingNote" @click="startchat_with_buisness_user">
            {{ sendingNote ? 'Sending...' : 'Send them a note' }}
          </a-button>
          <a-button type="primary" block :disabled="sendingNote" @click="sendOwnerEmail">
            Email Business
          </a-button>
          <div class="popup-or">
            <span class="popup-or-line"></span>
            <span class="popup-or-text">or</span>
            <span class="popup-or-line"></span>
          </div>
          <a-button type="default" block @click="$router.back()">
            Go Back
          </a-button>
        </div>
      </template>

      <!-- Business owner: redirect to pricing -->
      <template v-else-if="isBusiness">
        <div class="popup-actions">
          <a-button type="primary" block @click="$router.push('/pricing')">
            Explore Subscription Plans
          </a-button>
          <a-button type="default" block @click="$router.back()">
            Go Back
          </a-button>
        </div>
      </template>

    </div>
  </div>
</template>
<script>
export default {
  name: 'PlanBlockedOverlay',

  props: {
    planDetails: { type: Object, default: null },
    planIsExpired: { type: Boolean, default: false },
    brand: { type: String, default: '' },
    brand_data: { type: Object},
  },

  data() {
    return {
      current_user: JSON.parse(localStorage.getItem('user')),
      message:
        "Hi, I was exploring your catalog and would love to simulate your products in my room. It looks like this feature is unavailable due to an expired or inactive subscription — could you please renew your DYD plan so I can get started?",
      sendingNote: false,
    };
  },

  computed: {
    isPlanBlocked() {
    // Wait until planDetails has actually loaded (not null/undefined)
    if (this.planDetails === null || this.planDetails === undefined) {
      return false; // Don't show anything while loading
    }
    // Now safely check if plan is missing or expired
    return !this.planDetails.plan_name || this.planIsExpired;
  },
    isBusiness() {
      return this.current_user?.user_type === 'Business';
    },
    isVisitor() {
      // Both regular Users and Professionals see the "notify the brand" flow
      return ['User', 'Professional'].includes(this.current_user?.user_type);
    },

    popupTitle() {
      if (this.isBusiness) {
        return this.planIsExpired
          ? 'Your subscription has expired'
          : "You haven't subscribed yet";
      }
      // Visitor / Professional
      return this.planIsExpired
        ? "This brand's plan has expired"
        : "This brand hasn't subscribed yet";
    },

    popupBody() {
      if (this.isBusiness) {
        return this.planIsExpired
          ? 'Renew your plan to let customers simulate your products in their rooms.'
          : 'Subscribe to a plan so customers can start simulating your products.';
      }
      // Visitor / Professional
      return this.planIsExpired
        ? "Let them know you'd like them to renew so you can simulate their products in your room."
        : "Send them a note — they'll be glad to know someone wants to explore their catalog.";
    },
  },

  methods: {
    async sendOwnerNote() {
      if (!this.message.trim()) {
        this.$message.warning('Please enter a message');
        return;
      }
      this.sendingNote = true;
      try {
        await fetch(`${this.$store.state.root_api}subscription/api/notify-owner/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            brand: this.brand,
            message: this.message,
          }),
        });
        this.$message.success('Your note has been sent!');
        this.message = '';
      } catch {
        this.$message.error('Failed to send. Please try again.');
      } finally {
        this.sendingNote = false;
      }
    },

      async startchat_with_buisness_user() {

            const payload = JSON.stringify({
                type: 'DM',
                members: [this.current_user.id, parseInt(this.brand.brand_id)],
                name: `${this.current_user.first_name} & ${this.brand.name}&${this.brand.email}`,
            })
            try {
                const response = await fetch(`${this.$store.state.root_api}chat/chats`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Token ' + localStorage.getItem('token'),
                    },
                    body: payload,
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                const room = data.room || data

                if (this.current_user.user_type === 'User') {
                    this.$router.push({
                        path: '/user-dashboard/my-messages',
                        query: { chatId: data.room_id ,message:this.message}
                    })
                }

                if (this.current_user.user_type === 'Business' ) {
                    this.$router.push({
                        path: '/my-store/messages',
                        query: { chatId: data.room_id ,message:this.message}
                    })
                }
                  if (this.current_user.user_type === 'Professional') {
                    this.$router.push({
                        path: '/professional-dashboard/my-messages',
                        query: { chatId: data.room_id ,message:this.message}
                    })
                }

            } catch (error) {
                console.error('Error creating/finding room:', error)
            }
        },


    sendOwnerEmail() {
      window.location.href = `mailto:${this.brand.brand_email}?subject=DYD Subscription&body=${encodeURIComponent(this.message)}`;
    },
  },
};
</script>

<style scoped>
.plan-blocked-overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: start;
  justify-content: center;
  padding: 16px;
  z-index: 100;
  border-radius: 8px;
  /* min-height ensures the overlay has enough room on mobile
     when the parent has no fixed height */
  /* min-height: 100%; */
  
}

.plan-blocked-popup {
  background: #ffffff;
  border-radius: 14px;
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 300px;
  padding: 20px 18px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
}

.popup-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.popup-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
}

.popup-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.4;
  margin: 0;
}

.popup-body {
  font-size: 12px;
  color: #666;
  line-height: 1.55;
  margin: 0;
}

.popup-divider {
  width: 100%;
  height: 0.5px;
  background: rgba(0, 0, 0, 0.1);
  margin: 4px 0;
}

.popup-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.popup-input {
  width: 100%;
  padding: 7px 10px;
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 12px;
  background: #f9f9f9;
  color: #1a1a1a;
  outline: none;
}

.popup-input:focus {
  border-color: #7F77DD;
}

.popup-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.popup-btn-primary {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: #533AB7;
  color: #EEEDFE;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
}

.popup-btn-primary:hover {
  opacity: 0.88;
}

.popup-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.popup-or {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.popup-or-line {
  flex: 1;
  height: 0.5px;
  background: rgba(0, 0, 0, 0.1);
}

.popup-or-text {
  font-size: 11px;
  color: #999;
}

.popup-btn-chat {
  width: 100%;
  padding: 8px;
  border: 0.5px solid #9FE1CB;
  border-radius: 6px;
  background: #E1F5EE;
  color: #0F6E56;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background 0.15s;
}

.popup-btn-chat:hover {
  background: #9FE1CB;
}
</style>