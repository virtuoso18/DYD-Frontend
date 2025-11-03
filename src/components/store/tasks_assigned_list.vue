<template>
    {{ tasks }}
    <div class="container">
        <a-row>
            <a-col :span="10">

                <h3>Task Management</h3>
            </a-col>
            <a-col :span="14">
        <div class="filter-tabs">
            <button 
                v-for="filter in statusFilters" 
                :key="filter"
                :class="['filter-btn', { active: activeFilter === filter }]"
                @click="activeFilter = filter"
            >
                {{ filter }}
            </button>
        </div>
            </a-col>

        </a-row>
        
        <!-- Filter tabs -->
       

        <div class="task-list">
            <div 
                v-for="task in filteredTasks" 
                :key="task.id" 
                class="task-item"
            >
                <div class="task-header">
                    <span 
                        class="priority-badge"
                        :class="getPriorityClass(task.priority)"
                    >
                        {{ task.priority }}
                    </span>
                    <span 
                        class="status-badge"
                        :class="getStatusClass(task.status)"
                    >
                        {{ task.status }}
                    </span>
                    <span 
                        class="assignment-badge"
                        :class="getAssignmentClass(task.assignment_type)"
                    >
                        {{ task.assignment_type }}
                    </span>
                </div>

                <div class="task-content">
                    <div class="task-title">{{ task.title }}</div>
                    <div class="task-description">{{ task.description }}</div>
                    
                    <div class="task-meta">
                        <div class="meta-item">
                            <span class="meta-label">Assigned to:</span>
                            <span class="meta-value">{{ task.assigned_to }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Given by:</span>
                            <span class="meta-value">{{ task.task_given_by }}</span>
                        </div>
                        <div class="meta-item" v-if="task.due_date">
                            <span class="meta-label">Due date:</span>
                            <span class="meta-value">{{ formatDate(task.due_date) }}</span>
                        </div>
                        <div class="meta-item" v-if="task.estimated_hours">
                            <span class="meta-label">Estimated:</span>
                            <span class="meta-value">{{ task.estimated_hours }}h</span>
                        </div>
                    </div>
                </div>

                <div class="task-actions">
                    <button 
                        v-if="task.status === 'new'" 
                        class="btn btn-accept"
                        @click="acceptTask(task.id)"
                    >
                        Accept
                    </button>
                    <button 
                        v-if="task.status === 'new'" 
                        class="btn btn-reject"
                        @click="rejectTask(task.id)"
                    >
                        Reject
                    </button>
                    <button 
                        v-if="task.status === 'pending'" 
                        class="btn btn-start"
                        @click="startTask(task.id)"
                    >
                        Start
                    </button>
                    <button 
                        v-if="task.status === 'ongoing'" 
                        class="btn btn-complete"
                        @click="completeTask(task.id)"
                    >
                        Complete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TaskManagement',
    props:{
        tasks:Object
    },
    data() {
        return {
            activeFilter: 'All',
            statusFilters: ['All', 'new', 'pending', 'ongoing', 'completed', 'verified'],
            tasks_list: [
                {
                    id: '550e8400-e29b-41d4-a716-446655440001',
                    title: 'Fix critical security vulnerability',
                    description: 'Address SQL injection vulnerability in user login system',
                    priority: 'urgent',
                    status: 'ongoing',
                    assignment_type: 'platform_professional',
                    assigned_to: 'john.doe@example.com',
                    task_given_by: 'TechCorp Solutions',
                    // due_date: '2025-10-18T10:00:00Z',
                    // estimated_hours: 8.5,
                    acceptance_deadline: '2025-10-17T14:00:00Z',
                    created_at: '2025-10-16T14:00:00Z'
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440002',
                    title: 'Update product inventory database',
                    description: 'Sync inventory database with warehouse management system',
                    priority: 'high',
                    status: 'new',
                    assignment_type: 'internal_staff',
                    assigned_to: 'sarah.smith@example.com',
                    task_given_by: 'RetailHub Inc',
                    // due_date: '2025-10-20T17:00:00Z',
                    // estimated_hours: 4.0,
                    acceptance_deadline: '2025-10-17T14:00:00Z',
                    created_at: '2025-10-16T14:00:00Z'
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440003',
                    title: 'Prepare monthly sales report',
                    description: 'Generate and analyze sales data for Q4 presentation',
                    priority: 'medium',
                    status: 'pending',
                    assignment_type: 'internal_staff',
                    assigned_to: 'mike.johnson@example.com',
                    task_given_by: 'Business Analytics Co',
                    // due_date: '2025-10-25T09:00:00Z',
                    // estimated_hours: 6.0,
                    acceptance_deadline: '2025-10-17T14:00:00Z',
                    created_at: '2025-10-16T14:00:00Z'
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440004',
                    title: 'Optimize website images for performance',
                    description: 'Compress and convert all product images to WebP format',
                    priority: 'low',
                    status: 'completed',
                    assignment_type: 'platform_professional',
                    assigned_to: 'emma.wilson@example.com',
                    task_given_by: 'Digital Marketing Pro',
                    // due_date: '2025-10-19T16:00:00Z',
                    // estimated_hours: 3.5,
                    actual_hours: 4.0,
                    acceptance_deadline: '2025-10-17T14:00:00Z',
                    created_at: '2025-10-15T10:00:00Z',
                    completed_at: '2025-10-16T11:30:00Z'
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440005',
                    title: 'Server maintenance and updates',
                    description: 'Schedule and execute critical security patches on production servers',
                    priority: 'urgent',
                    status: 'new',
                    assignment_type: 'platform_professional',
                    assigned_to: 'alex.brown@example.com',
                    task_given_by: 'CloudTech Services',
                    // due_date: '2025-10-17T23:00:00Z',
                    // estimated_hours: 5.0,
                    acceptance_deadline: '2025-10-17T14:00:00Z',
                    created_at: '2025-10-16T14:00:00Z'
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440006',
                    title: 'Customer feedback analysis',
                    description: 'Review and categorize 500+ customer support tickets from last month',
                    priority: 'medium',
                    status: 'verified',
                    assignment_type: 'internal_staff',
                    assigned_to: 'lisa.anderson@example.com',
                    task_given_by: 'Customer Success Team',
                    // due_date: '2025-10-15T17:00:00Z',
                    // estimated_hours: 8.0,
                    actual_hours: 7.5,
                    acceptance_deadline: '2025-10-14T14:00:00Z',
                    created_at: '2025-10-13T09:00:00Z',
                    completed_at: '2025-10-15T15:00:00Z',
                    verified_at: '2025-10-15T16:30:00Z'
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440007',
                    title: 'Implement new payment gateway integration',
                    description: 'Integrate Stripe payment system with checkout process',
                    priority: 'high',
                    status: 'ongoing',
                    assignment_type: 'platform_professional',
                    assigned_to: 'david.lee@example.com',
                    task_given_by: 'E-commerce Platform',
                    // due_date: '2025-10-22T12:00:00Z',
                    // estimated_hours: 12.0,
                    acceptance_deadline: '2025-10-17T14:00:00Z',
                    created_at: '2025-10-14T10:00:00Z',
                    started_at: '2025-10-15T09:00:00Z'
                },
                {
                    id: '550e8400-e29b-41d4-a716-446655440008',
                    title: 'Update API documentation',
                    description: 'Revise API documentation to include new endpoints and deprecation notices',
                    priority: 'low',
                    status: 'pending',
                    assignment_type: 'internal_staff',
                    assigned_to: 'rachel.martinez@example.com',
                    task_given_by: 'Development Team',
                    // due_date: '2025-10-28T17:00:00Z',
                    // estimated_hours: 5.0,
                    acceptance_deadline: '2025-10-17T14:00:00Z',
                    created_at: '2025-10-16T11:00:00Z',
                    accepted_at: '2025-10-16T12:00:00Z'
                }
            ]
        };
    },
    computed: {
        filteredTasks() {
            if (this.activeFilter === 'All') {
                return this.tasks_list;
            }
            return this.tasks_list.filter(task => task.status === this.activeFilter);
        }
    },
    methods: {
        getPriorityClass(priority) {
            return `priority-${priority}`;
        },
        getStatusClass(status) {
            return `status-${status}`;
        },
        getAssignmentClass(assignmentType) {
            return `assignment-${assignmentType}`;
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        acceptTask(taskId) {
            const task = this.tasks_list.find(t => t.id === taskId);
            if (task && task.status === 'new') {
                task.status = 'pending';
                task.accepted_at = new Date().toISOString();
                console.log(`Task ${taskId} accepted`);
            }
        },
        rejectTask(taskId) {
            const task = this.tasks_list.find(t => t.id === taskId);
            if (task && task.status === 'new') {
                task.status = 'rejected';
                task.rejected_at = new Date().toISOString();
                console.log(`Task ${taskId} rejected`);
            }
        },
        startTask(taskId) {
            const task = this.tasks_list.find(t => t.id === taskId);
            if (task && task.status === 'pending') {
                task.status = 'ongoing';
                task.started_at = new Date().toISOString();
                console.log(`Task ${taskId} started`);
            }
        },
        completeTask(taskId) {
            const task = this.tasks_list.find(t => t.id === taskId);
            if (task && task.status === 'ongoing') {
                task.status = 'completed';
                task.completed_at = new Date().toISOString();
                console.log(`Task ${taskId} completed`);
            }
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-size: 2.5em;
}

.filter-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    justify-content: center;
}

.filter-btn {
    padding: 2px 10px;
    border: 2px solid #ddd;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    text-transform: capitalize;
}

.filter-btn:hover {
    border-color: #667eea;
    background: #f8f9ff;
}

.filter-btn.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.task-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.task-item {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 20px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.task-header {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    flex-wrap: wrap;
}

.priority-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.priority-urgent {
    background: #dc3545;
    color: white;
}

.priority-high {
    background: #fd7e14;
    color: white;
}

.priority-medium {
    background: #ffc107;
    color: #333;
}

.priority-low {
    background: #28a745;
    color: white;
}

.status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75em;
    font-weight: 600;
    text-transform: capitalize;
}

.status-new { 
    background: #cfe2ff; 
    color: #084298; 
}

.status-pending { 
    background: #fff3cd; 
    color: #664d03; 
}

.status-ongoing { 
    background: #d1e7dd; 
    color: #0f5132; 
}

.status-completed { 
    background: #d1ecf1; 
    color: #055160; 
}

.status-verified { 
    background: #d4edda; 
    color: #155724; 
}

.status-rejected {
    background: #f8d7da;
    color: #721c24;
}

.status-cancelled {
    background: #e2e3e5;
    color: #383d41;
}

.status-expired {
    background: #f5c6cb;
    color: #721c24;
}

.assignment-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75em;
    font-weight: 600;
}

.assignment-internal_staff {
    background: #e7f3ff;
    color: #0056b3;
}

.assignment-platform_professional {
    background: #f0e6ff;
    color: #6a1b9a;
}

.task-content {
    margin-bottom: 15px;
}

.task-title {
    font-size: 1.3em;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
}

.task-description {
    color: #666;
    font-size: 0.95em;
    line-height: 1.5;
    margin-bottom: 15px;
}

.task-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.meta-label {
    font-size: 0.75em;
    color: #6c757d;
    font-weight: 600;
    text-transform: uppercase;
}

.meta-value {
    font-size: 0.9em;
    color: #333;
    font-weight: 500;
}

.task-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9em;
}

.btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.btn-accept {
    background: #28a745;
    color: white;
}

.btn-accept:hover {
    background: #218838;
}

.btn-reject {
    background: #dc3545;
    color: white;
}

.btn-reject:hover {
    background: #c82333;
}

.btn-start {
    background: #007bff;
    color: white;
}

.btn-start:hover {
    background: #0056b3;
}

.btn-complete {
    background: #17a2b8;
    color: white;
}

.btn-complete:hover {
    background: #138496;
}
</style>