<template>
    <div style="display:flex;justify-content: center;align-items: center;padding:20px" v-if="plan_details">
        <div style="max-width:900px;background:white;border-radius:12px;overflow:hidden">
            <a-row>
                <!-- Left Column: Plan Details -->
                <a-col :sm="24" :xs="24" :md="12" :lg="12" style="padding:40px;border-right:1px solid #f0f0f0">
                    <p style="color:#666;margin-bottom:8px;font-size:16px">Credit Top Up Plan</p>
                    <h1 style="font-size:32px;font-weight:600;margin:0;color:#333">${{plan_details.price}}</h1>
                    <p style="color:#999;margin-top:8px;font-size:14px">{{plan_details.credits_count}} Credits</p>
                    
                    <div v-if="plan_details.description" style="color:#666;margin-top:16px;font-size:14px">
                        {{plan_details.description}}
                    </div>
                    
                    <div style="margin-top:40px;padding-top:30px;border-top:1px solid #f0f0f0">
                        <div style="display:flex;justify-content:space-between;margin-bottom:15px">
                            <span style="color:#666">Plan: {{plan_details.name}}</span>
                            <span style="color:#333;font-weight:500">${{plan_details.price}}</span>
                        </div>
                        <p style="color:#999;font-size:12px;margin:0">{{plan_details.credits_count}} Credits</p>
                        
                        <div style="display:flex;justify-content:space-between;margin:20px 0 8px 0;padding-top:15px;border-top:1px solid #f0f0f0">
                            <span style="color:#666">Subtotal</span>
                            <span style="color:#333;font-weight:500">${{plan_details.price}}</span>
                        </div>
                        
                        <div style="display:flex;justify-content:space-between;margin-bottom:20px">
                            <span style="color:#666">Tax</span>
                            <span style="color:#333;font-weight:500">$0</span>
                        </div>
                        
                        <div style="display:flex;justify-content:space-between;padding-top:15px;border-top:1px solid #f0f0f0">
                            <span style="color:#333;font-weight:600;font-size:16px">Total due today</span>
                            <span style="color:#333;font-weight:600;font-size:16px">${{plan_details.price}}</span>
                        </div>
                    </div>
                </a-col>

                <!-- Right Column: Payment Form -->
                <a-col :sm="24" :xs="24" :md="12" :lg="12" style="padding:40px;background-color: #f5f5f5;border-radius:10px;">
                    <div style="margin-bottom:25px">
                        <h3 style="color:#333;margin-bottom:8px;font-size:16px;font-weight:500">Contact Information</h3>
                        <div style="margin-bottom:20px">
                            <label style="display:block;color:#666;margin-bottom:6px;font-size:14px">Email</label>
                            <input v-model="email" type="email" style="width:100%;padding:12px;border:1px solid #d9d9d9;border-radius:6px;font-size:14px" placeholder="johndoe@gmail.com">
                        </div>
                    </div>
                    
                    <div style="margin-bottom:25px">
                        <h3 style="color:#333;margin-bottom:15px;font-size:16px;font-weight:500">Payment method</h3>
                        <div style="margin-bottom:12px">
                            <label style="display:flex;align-items:center;padding:12px;border:2px solid #4F46E5;border-radius:8px;cursor:pointer;background:#f8faff">
                                <input type="radio" name="payment" value="card" v-model="paymentMethod" style="margin-right:10px">
                                <span style="color:#333;flex:1">Debit/Credit Card</span>
                                <div style="display:flex;gap:8px">
                                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%234285F4'/%3E%3Cpath d='M9.5 6h5v4h-5z' fill='%23fff'/%3E%3C/svg%3E" alt="Visa" style="width:24px;height:16px">
                                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Crect width='24' height='16' rx='2' fill='%23FF5F00'/%3E%3Ccircle cx='9' cy='8' r='4' fill='%23EB001B'/%3E%3Ccircle cx='15' cy='8' r='4' fill='%23F79E1B'/%3E%3C/svg%3E" alt="Mastercard" style="width:24px;height:16px">
                                </div>
                            </label>
                        </div>
                        <div>
                            <label style="display:flex;align-items:center;padding:12px;border:1px solid #d9d9d9;border-radius:8px;cursor:pointer">
                                <input type="radio" name="payment" value="paypal" v-model="paymentMethod" style="margin-right:10px">
                                <span style="color:#333;flex:1">PayPal</span>
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='16' viewBox='0 0 24 16'%3E%3Cpath d='M7.076 2.876c.62-.035 1.174.013 1.666.142.491.129.916.342 1.273.636.358.294.64.669.846 1.125.207.456.31.98.31 1.573 0 .764-.168 1.425-.503 1.983-.335.558-.82 1.015-1.456 1.371-.635.356-1.412.534-2.33.534H5.5l-.6 3.76h-1.8L4.5 2.876h2.576z' fill='%23003087'/%3E%3Cpath d='M14.076 2.876c.62-.035 1.174.013 1.666.142.491.129.916.342 1.273.636.358.294.64.669.846 1.125.207.456.31.98.31 1.573 0 .764-.168 1.425-.503 1.983-.335.558-.82 1.015-1.456 1.371-.635.356-1.412.534-2.33.534H12.5l-.6 3.76h-1.8L11.5 2.876h2.576z' fill='%23009cde'/%3E%3C/svg%3E" alt="PayPal" style="width:24px;height:16px">
                            </label>
                        </div>
                    </div>
                    
                    <div v-if="paymentMethod === 'card'" style="margin-bottom:25px">
                        <h3 style="color:#333;margin-bottom:15px;font-size:16px;font-weight:500">Payment details</h3>
                        <div style="margin-bottom:15px">
                            <label style="display:block;color:#666;margin-bottom:6px;font-size:14px">Credit card number</label>
                            <input v-model="cardNumber" type="text" style="width:100%;padding:12px;border:1px solid #d9d9d9;border-radius:6px;font-size:14px" placeholder="Input credit card number">
                        </div>
                        <div style="display:flex;gap:15px;margin-bottom:15px">
                            <div style="flex:1">
                                <label style="display:block;color:#666;margin-bottom:6px;font-size:14px">Valid until</label>
                                <input v-model="validUntil" type="text" style="width:100%;padding:12px;border:1px solid #d9d9d9;border-radius:6px;font-size:14px" placeholder="MM/YYYY">
                            </div>
                            <div style="flex:1">
                                <label style="display:block;color:#666;margin-bottom:6px;font-size:14px">CCV</label>
                                <input v-model="ccv" type="text" style="width:100%;padding:12px;border:1px solid #d9d9d9;border-radius:6px;font-size:14px" placeholder="000">
                            </div>
                        </div>
                    </div>
                    
                    <div style="padding:20px;background:#f8f9fa;border-radius:8px;margin-bottom:25px">
                        <div style="display:flex;justify-content:space-between;align-items:center">
                            <span style="color:#333;font-weight:500;font-size:16px">Total</span>
                            <div style="text-align:right">
                                <div style="color:#666;font-size:14px;margin-bottom:2px">Amount to pay</div>
                                <div style="color:#333;font-weight:600;font-size:18px">${{plan_details.price}}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom:20px">
                        <label style="display:flex;align-items:flex-start;font-size:12px;color:#666;cursor:pointer">
                            <input type="checkbox" v-model="agreeTerms" style="margin-right:8px;margin-top:2px">
                            <span>By confirming your payment, you allow us to charge you in accordance with their terms. You can always cancel your subscription.</span>
                        </label>
                    </div>
                    
                    <a-button 
                        @click="processPayment" 
                        size="large" 
                        type="primary" 
                        :disabled="!agreeTerms || loading" 
                        :loading="loading"
                        style="width:100%;border:none;border-radius:8px;font-size:16px;font-weight:500;cursor:pointer;" 
                        :style="{opacity: agreeTerms && !loading ? '1' : '0.5'}"
                    >
                        {{ loading ? 'Processing...' : 'Complete Payment' }}
                    </a-button>
                </a-col>
            </a-row>
        </div>

        <!-- Success Modal -->
        <a-modal
            v-model:visible="successModalVisible"
            :footer="null"
            :closable="false"
            centered
            width="450px"
        >
            <div style="text-align:center;padding:30px 20px">
                <div style="width:80px;height:80px;background:#52c41a;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h2 style="color:#333;font-size:24px;font-weight:600;margin-bottom:12px">Payment Successful!</h2>
                <p style="color:#666;font-size:16px;margin-bottom:30px">
                    Your credit top-up has been completed successfully.
                </p>
                <div v-if="purchase_successful" style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:30px;text-align:left">
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px">
                        <span style="color:#666">Plan:</span>
                        <span style="color:#333;font-weight:500">{{plan_details.name}}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px">
                        <span style="color:#666">Credits:</span>
                        <span style="color:#333;font-weight:500">{{plan_details.credits_count}}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px">
                        <span style="color:#666">Amount:</span>
                        <span style="color:#333;font-weight:500">${{plan_details.price}}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px">
                        <span style="color:#666">Transaction ID:</span>
                        <span style="color:#333;font-weight:500">{{purchase_successful.transaction_id}}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between">
                        <span style="color:#666">Email:</span>
                        <span style="color:#333;font-weight:500">{{email}}</span>
                    </div>
                </div>
                <a-button 
                    type="primary" 
                    size="large" 
                    @click="closeSuccessModal"
                    style="width:100%;border-radius:8px;font-size:16px;font-weight:500"
                >
                    Continue to Dashboard
                </a-button>
            </div>
        </a-modal>
    </div>
</template>

<script>
export default {
    name: "credit-topup-payment",
    data() {
        return {
            currentUser: null,
            email: '',            
            paymentMethod: 'card',
            cardNumber: '',
            validUntil: '',
            ccv: '',
            agreeTerms: false,
            plan_details: null,
            purchase_successful: null,
            successModalVisible: false,
            loading: false
        }
    },
    mounted() {
        this.getCurrentUser();
        this.fetchPlanDetails();
    },
    methods: {
        getCurrentUser() {
            try {
                this.currentUser = JSON.parse(localStorage.getItem('user'));
                if (this.currentUser && this.currentUser.email) {
                    this.email = this.currentUser.email;
                }
            } catch (error) {
                console.error('Error getting current user:', error);
            }
        },

        async fetchPlanDetails() {
            try {
                const planId = this.$route.params.uuid;
                console.log(`${this.$route.params}`)
                let headers = {
                    'Content-Type': 'application/json',
                };
                
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Token ${token}`;
                }

                const response = await fetch(
                    `${this.$store.state.root_api}subscription/api/${planId}/credit-top-up/`,
                    {
                        method: 'GET',
                        headers: headers
                    }
                );

                const result = await response.json();
                
                if (result.success) {
                    this.plan_details = result.data.plan;
                } else {
                    this.$message.error(result.message || 'Failed to load plan details');
                }
            } catch (error) {
                console.error('Error loading plan details:', error);
                this.$message.error('Failed to load plan details');
            }
        },

        async processPayment() {
            if (!this.agreeTerms) {
                this.$message.warning('Please agree to the terms and conditions');
                return;
            }

            if (!this.email) {
                this.$message.warning('Please enter your email');
                return;
            }

            if (this.paymentMethod === 'card') {
                if (!this.cardNumber || !this.validUntil || !this.ccv) {
                    this.$message.warning('Please fill in all card details');
                    return;
                }
            }

            this.loading = true;
            console.log(this.$route.params)
            try {
                const planId = this.$route.params.uuid;
                
                let headers = {
                    'Content-Type': 'application/json',
                };
                
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Token ${token}`;
                }

                const response = await fetch(
                    `${this.$store.state.root_api}subscription/api/${planId}/credit-top-up/`,
                    {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({
                            email: this.email,
                            paymentMethod: this.paymentMethod,
                            cardNumber: this.cardNumber,
                            validUntil: this.validUntil,
                            ccv: this.ccv,
                            agreeTerms: this.agreeTerms,
                        })
                    }
                );

                const result = await response.json();

                if (result.success) {
                    this.purchase_successful = result.data;
                    this.successModalVisible = true;
                } else {
                    this.$message.error(result.message || 'Payment failed. Please try again.');
                }
            } catch (error) {
                console.error('Error processing payment:', error);
                this.$message.error('An error occurred while processing your payment. Please try again.');
            } finally {
                this.loading = false;
            }
        },

        closeSuccessModal() {
            this.successModalVisible = false;
            // Redirect based on user type
            if (this.currentUser) {
                if (this.currentUser.user_type === 'User') {
                    this.$router.push('/user-dashboard/my-messages');
                } else if (this.currentUser.user_type === 'Business') {
                    this.$router.push('/business-dashboard/manage-subscription');
                } else if (this.currentUser.user_type === 'Professional') {
                    this.$router.push('/professional-dashboard/manage-subscription');
                }
            }
        }
    }
}
</script>