<template>
    <div class="container">
        <a-row>
            <a-col :span="10">
                <h3>{{ t('task.taskManagement') }}</h3>
            </a-col>
            <a-col :span="14">
                <div class="filter-tabs">
                    <button 
                        v-for="filter in statusFilters" 
                        :key="filter.value"
                        :class="['filter-btn', { active: activeFilter === filter.value }]"
                        @click="activeFilter = filter.value"
                    >
                        {{ filter.label }}
                    </button>
                </div>
            </a-col>
        </a-row>

        <div class="task-list">
            <div 
                v-for="task in filteredTasks" 
                :key="task.id" 
                class="task-item"
            >
                <div class="task-header">
                    <span 
                        class="status-badge"
                        :class="getStatusClass(task.status)"
                    >
                        {{ getStatusLabel(task.status) }}
                    </span>
                </div>

                <div class="task-content">
                    <div class="task-title">{{ task.title }}</div>
                    <div class="task-description">{{ task.description }}</div>
                    
                    <div class="task-meta">
                        <div class="meta-item">
                            <span class="meta-label">{{ t('task.createdAt') }}:</span>
                            <span class="meta-value">{{ formatDate(task.created_at) }}</span>
                        </div>
                    </div>
                </div>

                <div class="task-actions">
                    <!-- <button 
                        v-if="task.status === 'ToDo'" 
                        class="btn btn-start"
                        @click="startTask(task.id)"
                    >
                        {{ t('task.startTask') }}
                    </button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
    name: 'TaskManagement',

    setup() {
        const { t, locale } = useI18n();
        return { t, locale };
    },

    props: {
        tasks: {
            type: Array,
            default: () => []
        }
    },

    data() {
        return {
            activeFilter: 'All',
        };
    },

    computed: {
        statusFilters() {
            return [
                { value: 'All',        label: this.t('task.filter.all') },
                { value: 'ToDo',       label: this.t('task.filter.todo') },
                { value: 'InProgress', label: this.t('task.filter.inProgress') },
                { value: 'Completed',  label: this.t('task.filter.completed') },
            ];
        },

        filteredTasks() {
            const tasksList = this.tasks || [];
            if (this.activeFilter === 'All') {
                return tasksList;
            }
            return tasksList.filter(task => task.status === this.activeFilter);
        }
    },

    methods: {
        getStatusClass(status) {
            const statusMap = {
                'ToDo': 'status-todo',
                'InProgress': 'status-inprogress',
                'Completed': 'status-completed'
            };
            return statusMap[status] || 'status-todo';
        },

        getStatusLabel(status) {
            const labelMap = {
                'ToDo':        this.t('task.status.todo'),
                'InProgress':  this.t('task.status.inProgress'),
                'Completed':   this.t('task.status.completed'),
            };
            return labelMap[status] || status;
        },

        formatDate(dateString) {
            if (!dateString) return this.t('task.na');
            const date = new Date(dateString);
            return date.toLocaleDateString(
                this.locale === 'he' ? 'he-IL' : 'en-US',
                {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }
            );
        },

        startTask(taskId) {
            this.$emit('start-task', taskId);
            console.log(`Task ${taskId} started`);
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

h3 {
    color: #333;
    margin-bottom: 20px;
    font-size: 1.8em;
}

.filter-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.filter-btn {
    padding: 8px 16px;
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

.status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75em;
    font-weight: 600;
    text-transform: capitalize;
}

.status-todo { 
    background: #cfe2ff; 
    color: #084298; 
}

.status-inprogress { 
    background: #d1e7dd; 
    color: #0f5132; 
}

.status-completed { 
    background: #d1ecf1; 
    color: #055160; 
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

.btn-start {
    background: #007bff;
    color: white;
}

.btn-start:hover {
    background: #0056b3;
}
</style>