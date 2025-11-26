<!-- ===================================
     my-requests.vue - Access Requests Table
     ===================================
-->
<template>
    <div style="border-radius:15px;background-color:white;border:1px solid rgba(0,0,0,0.1);padding:20px;margin-top:10px">
        <div class="page-header">
            <a-row type="flex" justify="space-between" align="middle">
                <a-col>
                    <h2>Access Requests</h2>
                    <p style="color: #999; margin-top: 5px;">Manage your access requests to various businesses</p>
                </a-col>
            </a-row>
        </div>

        <a-tabs v-model:activeKey="activeTab" style="margin-top: 20px;">
            
            <!-- Pending Requests Tab -->
            <a-tab-pane key="pending" tab="Pending Requests">
                <a-spin :spinning="loadingPending">
                    <a-empty 
                        v-if="pendingRequests.length === 0 && !loadingPending" 
                        description="No pending access requests"
                        style="margin: 50px 0;"
                    />

                    <a-table
                        v-else
                        :columns="pendingColumns"
                        :data-source="pendingRequests"
                        :pagination="pendingPagination"
                        :loading="loadingPending"
                        rowKey="id"
                        size="middle"
                        :scroll="{ x: 1000 }"
                        @change="handleTableChange('pending', arguments[0])"
                    >
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'business_name'">
                                <strong v-if="record && record.business">{{ record.business.business_name }}</strong>
                                <span v-else>-</span>
                            </template>

                            <template v-else-if="column.key === 'owner_email'">
                                {{ record && record.business ? record.business.owner_email : '-' }}
                            </template>

                            <template v-else-if="column.key === 'created_at'">
                                {{ record && record.created_at ? formatDate(record.created_at) : '-' }}
                            </template>

                            <template v-else-if="column.key === 'access_type'">
                                <a-tag color="orange">Professional Access</a-tag>
                            </template>

                            <template v-else-if="column.key === 'actions'">
                                <a-space v-if="record">
                                    <a-button
                                        type="primary"
                                        size="small"
                                        @click="openAcceptModal(record)"
                                    >
                                        Accept
                                    </a-button>
                                    <a-button
                                        type="primary"
                                        danger
                                        size="small"
                                        @click="handleRejectRequest(record.id)"
                                    >
                                        Reject
                                    </a-button>
                                </a-space>
                            </template>
                        </template>
                    </a-table>
                </a-spin>
            </a-tab-pane>

            <!-- Accepted Requests Tab -->
            <a-tab-pane key="accepted" tab="Accepted Requests">
                <a-spin :spinning="loadingAccepted">
                    <a-empty 
                        v-if="acceptedRequests.length === 0 && !loadingAccepted" 
                        description="No accepted requests"
                        style="margin: 50px 0;"
                    />

                    <a-table
                        v-else
                        :columns="acceptedColumns"
                        :data-source="acceptedRequests"
                        :pagination="acceptedPagination"
                        :loading="loadingAccepted"
                        rowKey="id"
                        size="middle"
                        :scroll="{ x: 1000 }"
                        @change="handleTableChange('accepted', arguments[0])"
                    >
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'business_name'">
                                <strong v-if="record && record.business">{{ record.business.business_name }}</strong>
                                <span v-else>-</span>
                            </template>

                            <template v-else-if="column.key === 'owner_email'">
                                {{ record && record.business ? record.business.owner_email : '-' }}
                            </template>

                            <template v-else-if="column.key === 'created_at'">
                                {{ record && record.created_at ? formatDate(record.created_at) : '-' }}
                            </template>

                            <template v-else-if="column.key === 'task_count'">
                                <a-tag v-if="record && record.task_count > 0" color="blue">
                                    {{ record.task_count }} task(s)
                                </a-tag>
                                <span v-else style="color: #999;">No tasks</span>
                            </template>

                            <template v-else-if="column.key === 'actions'">
                                <a-space v-if="record">
                                    <router-link 
                                        :to="{ name: 'business-overview', query: { access_id: record.id } }"
                                    >
                                        <a-button
                                            type="primary"
                                            size="small"
                                        >
                                            View
                                        </a-button>
                                    </router-link>
                                    <a-button
                                        type="primary"
                                        danger
                                        size="small"
                                        @click="handleRevokeAccess(record.id)"
                                    >
                                        Revoke
                                    </a-button>
                                </a-space>
                            </template>
                        </template>
                    </a-table>
                </a-spin>
            </a-tab-pane>

            <!-- Rejected Requests Tab -->
            <a-tab-pane key="rejected" tab="Rejected Requests">
                <a-spin :spinning="loadingRejected">
                    <a-empty 
                        v-if="rejectedRequests.length === 0 && !loadingRejected" 
                        description="No rejected requests"
                        style="margin: 50px 0;"
                    />
                    
                    <a-table
                        v-else
                        :columns="rejectedColumns"
                        :data-source="rejectedRequests"
                        :pagination="rejectedPagination"
                        :loading="loadingRejected"
                        rowKey="id"
                        size="middle"
                        :scroll="{ x: 1000 }"
                    >
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'business_name'">
                                <strong v-if="record && record.business">{{ record.business.business_name }}</strong>
                                <span v-else>-</span>
                            </template>

                            <template v-else-if="column.key === 'owner_email'">
                                {{ record && record.business ? record.business.owner_email : '-' }}
                            </template>

                            <template v-else-if="column.key === 'created_at'">
                                {{ record && record.created_at ? formatDate(record.created_at) : '-' }}
                            </template>

                            <!-- <template v-else-if="column.key === 'actions'">
                                <a-button
                                    v-if="record"
                                    type="primary"
                                    size="small"
                                    @click="handleReactivateRequest(record.id)"
                                >
                                    Reconsider
                                </a-button>
                            </template> -->
                        </template>
                    </a-table>
                </a-spin>
            </a-tab-pane>

        </a-tabs>

        <!-- Accept Modal -->
        <a-modal
            v-model:open="showAcceptModal"
            title="Accept Access Request"
            centered
            width="500px"
            :confirmLoading="processingAccess"
            @ok="handleAcceptRequest"
        >
            <div v-if="selectedRequest && selectedRequest.business">
                <p style="margin-bottom: 16px;">
                    <strong>{{ selectedRequest.business.business_name }}</strong> is requesting access for you to work as a professional.
                </p>
                
                <a-form-item label="Response Message (Optional)">
                    <a-textarea
                        v-model:value="acceptanceMessage"
                        placeholder="Add any message or notes..."
                        :rows="3"
                    />
                </a-form-item>

                <a-alert
                    message="After accepting, you will be able to view tasks and work details from this business."
                    type="info"
                    show-icon
                    style="margin-top: 12px;"
                />
            </div>
        </a-modal>
    </div>
</template>

<script>
export default {
    name: 'my-requests',
    data() {
        return {
            activeTab: 'pending',
            
            pendingRequests: [],
            acceptedRequests: [],
            rejectedRequests: [],
            
            loadingPending: false,
            loadingAccepted: false,
            loadingRejected: false,
            processingAccess: false,
            
            showAcceptModal: false,
            selectedRequest: null,
            acceptanceMessage: '',

            // Table columns
            pendingColumns: [
                {
                    title: 'Business',
                    dataIndex: ['business', 'business_name'],
                    key: 'business_name',
                    width: '25%'
                },
                {
                    title: 'Owner Email',
                    dataIndex: ['business', 'owner_email'],
                    key: 'owner_email',
                    width: '25%'
                },
                {
                    title: 'Requested Date',
                    dataIndex: 'created_at',
                    key: 'created_at',
                    width: '20%',
                    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
                },
                {
                    title: 'Type',
                    dataIndex: 'access_type',
                    key: 'access_type',
                    width: '15%'
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    width: '15%',
                    fixed: 'right'
                }
            ],

            acceptedColumns: [
                {
                    title: 'Business',
                    dataIndex: ['business', 'business_name'],
                    key: 'business_name',
                    width: '25%'
                },
                {
                    title: 'Owner Email',
                    dataIndex: ['business', 'owner_email'],
                    key: 'owner_email',
                    width: '25%'
                },
                {
                    title: 'Accepted Date',
                    dataIndex: 'created_at',
                    key: 'created_at',
                    width: '20%',
                    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
                },
                {
                    title: 'Tasks',
                    dataIndex: 'task_count',
                    key: 'task_count',
                    width: '15%',
                    sorter: (a, b) => (a.task_count || 0) - (b.task_count || 0)
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    width: '15%',
                    fixed: 'right'
                }
            ],

            rejectedColumns: [
                {
                    title: 'Business',
                    dataIndex: ['business', 'business_name'],
                    key: 'business_name',
                    width: '30%'
                },
                {
                    title: 'Owner Email',
                    dataIndex: ['business', 'owner_email'],
                    key: 'owner_email',
                    width: '30%'
                },
                {
                    title: 'Rejected Date',
                    dataIndex: 'created_at',
                    key: 'created_at',
                    width: '25%',
                    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
                },
                // {
                //     title: 'Actions',
                //     dataIndex: 'actions',
                //     key: 'actions',
                //     width: '15%',
                //     fixed: 'right'
                // }
            ],

            pendingPagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: true,
                showTotal: total => `Total ${total} requests`
            },

            acceptedPagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: true,
                showTotal: total => `Total ${total} requests`
            },

            rejectedPagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: true,
                showTotal: total => `Total ${total} requests`
            }
        };
    },
    
    mounted() {
        this.fetchPendingRequests();
        this.fetchAcceptedRequests();
        // this.fetchRejectedRequests();
    },

    methods: {
        async fetchPendingRequests() {
            this.loadingPending = true;
            try {
                const response = await fetch(
                    `${this.$store.state.root_api}access-engine/api/professional-access/pending-requests/`,
                    {
                        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
                    }
                );

                const data = await response.json();
                if (!data.error && data.data) {
                    this.pendingRequests = Array.isArray(data.data) ? data.data : [];
                    this.rejectedRequests= Array.isArray(data.rejected_requests) ? data.rejected_requests : [];
                    this.pendingPagination.total = this.pendingRequests.length;
                } else {
                    this.pendingRequests = [];
                }
            } catch (error) {
                console.error('Error fetching pending requests:', error);
                this.$message.error('Failed to load pending requests');
                this.pendingRequests = [];
            } finally {
                this.loadingPending = false;
            }
        },

        async fetchAcceptedRequests() {
            this.loadingAccepted = true;
            try {
                const response = await fetch(
                    `${this.$store.state.root_api}access-engine/api/professional-access/my-businesses/`,
                    {
                        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
                    }
                );

                const data = await response.json();
                if (!data.error && data.data) {
                    this.acceptedRequests = Array.isArray(data.data) ? data.data : [];

                    this.acceptedPagination.total = this.acceptedRequests.length;
                } else {
                    this.acceptedRequests = [];
                }
            } catch (error) {
                console.error('Error fetching accepted requests:', error);
                this.$message.error('Failed to load accepted requests');
                this.acceptedRequests = [];
            } finally {
                this.loadingAccepted = false;
            }
        },

        // async fetchRejectedRequests() {
        //     this.loadingRejected = true;
        //     try {
        //         // Placeholder for rejected requests endpoint
        //         this.rejectedRequests = [];
        //         this.rejectedPagination.total = 0;
        //     } catch (error) {
        //         console.error('Error fetching rejected requests:', error);
        //         this.rejectedRequests = [];
        //     } finally {
        //         this.loadingRejected = false;
        //     }
        // },

        openAcceptModal(request) {
            this.selectedRequest = request;
            this.acceptanceMessage = '';
            this.showAcceptModal = true;
        },

        async handleAcceptRequest() {
            if (!this.selectedRequest) return;

            this.processingAccess = true;

            try {
                const response = await fetch(
                    `${this.$store.state.root_api}access-engine/api/professional-access/accept-access/${this.selectedRequest.id}/`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            response_message: this.acceptanceMessage
                        })
                    }   
                );

                const data = await response.json();

                if (!data.error) {
                    this.$message.success('Access accepted successfully!');
                    this.showAcceptModal = false;
                    
                    await this.fetchPendingRequests();
                    await this.fetchAcceptedRequests();
                    
                    this.selectedRequest = null;
                    this.acceptanceMessage = '';
                } else {
                    this.$message.error(data.message || 'Failed to accept request');
                }
            } catch (error) {
                console.error('Error accepting request:', error);
                this.$message.error('An error occurred while accepting the request');
            } finally {
                this.processingAccess = false;
            }
        },

        handleRejectRequest(requestId) {
            this.$confirm({
                title: 'Reject Access Request?',
                content: 'Are you sure you want to reject this access request?',
                okText: 'Yes, Reject',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: async () => {
                    try {
                        const response = await fetch(
                            `${this.$store.state.root_api}access-engine/api/professional-access/reject-access/${requestId}/`,
                            {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Token ${localStorage.getItem('token')}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        const data = await response.json();

                        if (!data.error) {
                            this.$message.success('Request rejected successfully');
                            await this.fetchPendingRequests();
                            // await this.fetchRejectedRequests();
                        } else {
                            this.$message.error(data.message || 'Failed to reject request');
                        }
                    } catch (error) {
                        console.error('Error rejecting request:', error);
                        this.$message.error('An error occurred while rejecting the request');
                    }
                }
            });
        },

        handleRevokeAccess(accessId) {
            this.$confirm({
                title: 'Revoke Access?',
                content: 'Are you sure you want to revoke access to this business?',
                okText: 'Yes, Revoke',
                okType: 'danger',
                cancelText: 'Cancel',
                onOk: async () => {
                    try {
                        const response = await fetch(
                            `${this.$store.state.root_api}access-engine/api/professional-access/reject-access/${accessId}/`,
                            {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Token ${localStorage.getItem('token')}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        const data = await response.json();

                        if (!data.error) {
                            this.$message.success('Access revoked successfully');
                            await this.fetchAcceptedRequests();
                        } else {
                            this.$message.error(data.message || 'Failed to revoke access');
                        }
                    } catch (error) {
                        console.error('Error revoking access:', error);
                        this.$message.error('An error occurred while revoking access');
                    }
                }
            });
        },

        handleReactivateRequest(requestId) {
            this.$confirm({
                title: 'Reconsider Request?',
                content: 'Do you want to accept this access request?',
                okText: 'Yes, Accept',
                cancelText: 'Cancel',
                onOk: async () => {
                    try {
                        const response = await fetch(
                            `${this.$store.state.root_api}access-engine/api/professional-access/accept-access/${requestId}/`,
                            {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Token ${localStorage.getItem('token')}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    response_message: ''
                                })
                            }
                        );

                        const data = await response.json();

                        if (!data.error) {
                            this.$message.success('Request accepted successfully');
                            // await this.fetchRejectedRequests();
                            await this.fetchAcceptedRequests();
                            await this.fetchPendingRequests();
                        } else {
                            this.$message.error(data.message || 'Failed to accept request');
                        }
                    } catch (error) {
                        console.error('Error accepting request:', error);
                        this.$message.error('An error occurred');
                    }
                }
            });
        },

        handleTableChange(type, pagination) {
            if (type === 'pending') {
                this.pendingPagination = { ...this.pendingPagination, ...pagination };
            } else if (type === 'accepted') {
                this.acceptedPagination = { ...this.acceptedPagination, ...pagination };
            } else {
                this.rejectedPagination = { ...this.rejectedPagination, ...pagination };
            }
        },

        formatDate(dateString) {
            if (!dateString) return '-';
            return new Date(dateString).toLocaleDateString();
        }
    }
};
</script>