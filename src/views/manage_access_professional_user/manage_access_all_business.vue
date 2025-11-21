
<template>
    <div style="border-radius:15px;background-color:white;border:1px solid rgba(0,0,0,0.1);padding:20px;margin-top:10px;min-height:100vh">
        <div class="page-header">
            <a-row type="flex" justify="space-between" align="middle">
                <a-col>
                    <h2>My Businesses</h2>
                    <p style="color: #999; margin-top: 5px;">View all businesses you have access to</p>
                </a-col>
                <a-col>
                    <a-input-search
                        v-model:value="searchText"
                        placeholder="Search by business name or email"
                        style="width: 300px"
                        @search="handleSearch"
                    />
                </a-col>
            </a-row>
        </div>

        <a-spin :spinning="loadingAccepted">
          <!-- {{filteredAcceptedBusinesses}} -->
                    <a-empty 
                        v-if="filteredAcceptedBusinesses.length === 0 && !loadingAccepted" 
                        description="No accepted businesses"
                        style="margin: 50px 0;"
                        />
                    <a-table
                        v-else
                        :columns="acceptedColumns"
                        :data-source="filteredAcceptedBusinesses"
                        :pagination="acceptedPagination"
                        :loading="loadingAccepted"
                        rowKey="id"
                        size="middle"
                        :scroll="{ x: 1200 }"
                        @change="handleTableChange('accepted', arguments[0])"
                        :custom-row="customRowClick"
                    >
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'business_name'">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <img 
                                        v-if="record && record.business && record.business.banner_picture"
                                        :src="$store.state.root_media_api + record.business.banner_picture" 
                                        style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"
                                        alt="Business"
                                    />
                                    <span v-if="record && record.business">
                                        <strong>{{ record.business.business_name }}</strong>
                                        <br/>
                                        <small style="color: #999;">{{ record.business.owner_email }}</small>
                                    </span>
                                </div>
                            </template>

                            <template v-else-if="column.key === 'owner_name'">
                                {{ record && record.business ? record.business.owner_name : '-' }}
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
                                            Access Business
                                        </a-button>
                                    </router-link>
                                    <!-- <a-button
                                        type="primary"
                                        danger
                                        size="small"
                                        @click="handleRevoke(record.id)"
                                    >
                                        Revoke
                                    </a-button> -->
                                </a-space>
                            </template>
                        </template>
                    </a-table>
                </a-spin>

    </div>
</template>

<script>
export default {
    name: 'profesional_user_all_businesses',
    data() {
        return {
            activeTab: 'accepted',
            
            acceptedBusinesses: [],
            pendingBusinesses: [],
            
            loadingAccepted: false,
            loadingPending: false,
            processingAccess: false,
            
            searchText: '',
            
            showAcceptModal: false,
            selectedBusiness: null,
            acceptanceMessage: '',

            // Table columns for accepted businesses
            acceptedColumns: [
                {
                    title: 'Business Name',
                    dataIndex: ['business', 'business_name'],
                    key: 'business_name',
                    width: '20%'
                },
                {
                    title: 'Total Simu.',
                    // dataIndex: ['business', 'owner_name'],
                    dataIndex:'total_simulations_count',
                    key: 'total_simulations_count',
                    width: '7%'
                },
                {
                    title: 'Total Products',
                    dataIndex: 'total_products_count',
                    key: 'total_products_count',
                    width: '10%',
                    sorter: (a, b) => (a.total_products_count || 0) - (b.total_products_count || 0)

                },
                {
                    title: 'Tasks',
                    dataIndex: 'task_count',
                    key: 'task_count',
                    width: '15%',
                    sorter: (a, b) => (a.task_count || 0) - (b.task_count || 0)
                },
                {
                    title: 'Completed Tasks',
                    dataIndex: 'completed_tasks_count',
                    key: 'completed_tasks_count',
                    width: '15%',
                    sorter: (a, b) => (a.completed_tasks_count || 0) - (b.completed_tasks_count || 0)
                },
                 {
                    title: 'Pending Tasks',
                    dataIndex: 'pending_tasks_count',
                    key: 'pending_tasks_count',
                    width: '15%',
                    sorter: (a, b) => (a.pending_tasks_count || 0) - (b.pending_tasks_count || 0)
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    width: '10%',
                    fixed: 'right'
                }
            ],

            // Table columns for pending businesses
            pendingColumns: [
                {
                    title: 'Business Name',
                    dataIndex: ['business', 'business_name'],
                    key: 'business_name',
                    width: '30%'
                },
                {
                    title: 'Owner',
                    dataIndex: ['business', 'owner_name'],
                    key: 'owner_name',
                    width: '20%'
                },
                {
                    title: 'Requested Date',
                    dataIndex: 'created_at',
                    key: 'created_at',
                    width: '15%',
                    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: '15%'
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    width: '20%',
                    fixed: 'right'
                }
            ],

            acceptedPagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: total => `Total ${total} businesses`
            },

            pendingPagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: total => `Total ${total} requests`
            }
        };
    },
    
    computed: {
        filteredAcceptedBusinesses() {
            if (!this.searchText) {
                return this.acceptedBusinesses;
            }
            const search = this.searchText.toLowerCase();
            return this.acceptedBusinesses.filter(item => {
                if (!item.business) return false;
                return (
                    item.business.business_name.toLowerCase().includes(search) ||
                    item.business.owner_email.toLowerCase().includes(search)
                );
            });
        },

        filteredPendingBusinesses() {
            if (!this.searchText) {
                return this.pendingBusinesses;
            }
            const search = this.searchText.toLowerCase();
            return this.pendingBusinesses.filter(item => {
                if (!item.business) return false;
                return (
                    item.business.business_name.toLowerCase().includes(search) ||
                    item.business.owner_email.toLowerCase().includes(search)
                );
            });
        }
    },
    
    mounted() {
        this.fetchAcceptedBusinesses();
        
    },

    methods: {
      customRowClick(record) {
    return {
        onClick: () => {
            this.$router.push({
                name: 'business-overview',
                query: { access_id: record.id }
            })
        },
        style: {
            cursor: 'pointer'
        }
    }
},
        async fetchAcceptedBusinesses() {
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
                    this.acceptedBusinesses = Array.isArray(data.data) ? data.data : [];
                    this.acceptedPagination.total = this.acceptedBusinesses.length;
                } else {
                    this.acceptedBusinesses = [];
                }
            } catch (error) {
                console.error('Error fetching accepted businesses:', error);
                this.$message.error('Failed to load accepted businesses');
                this.acceptedBusinesses = [];
            } finally {
                this.loadingAccepted = false;
            }
        },


        openAcceptModal(business) {
            this.selectedBusiness = business;
            this.acceptanceMessage = '';
            this.showAcceptModal = true;
        },

        async handleAccept() {
            if (!this.selectedBusiness) return;

            this.processingAccess = true;

            try {
                const response = await fetch(
                    `${this.$store.state.root_api}access-engine/api/professional-access/accept-access/${this.selectedBusiness.id}/`,
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
                    
                    await this.fetchPendingBusinesses();
                    await this.fetchAcceptedBusinesses();
                    
                    this.selectedBusiness = null;
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

        handleReject(requestId) {
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
                            await this.fetchPendingBusinesses();
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

        handleRevoke(accessId) {
            this.$confirm({
                title: 'Revoke Access?',
                content: 'Are you sure you want to revoke access to this business? You will no longer be able to view tasks and details from this business.',
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
                            await this.fetchAcceptedBusinesses();
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

        handleSearch() {
            this.acceptedPagination.current = 1;
            this.pendingPagination.current = 1;
        },

        handleTableChange(type, pagination) {
            if (type === 'accepted') {
                this.acceptedPagination = { ...this.acceptedPagination, ...pagination };
            } else {
                this.pendingPagination = { ...this.pendingPagination, ...pagination };
            }
        },

        formatDate(dateString) {
            if (!dateString) return '-';
            return new Date(dateString).toLocaleDateString();
        }
    }
};
</script>