<template>
  <a-card class="widget-card">
    <template #title>
      <span class="widget-title-dot" />我的待办
    </template>
    <div class="todo-header">
      <div class="todo-tabs">
        <div class="todo-tab active">
          <span class="todo-tab-text">待办</span>
          <span class="todo-badge">{{ todoList.length }}</span>
        </div>
        <div class="todo-tab">
          <span class="todo-tab-text">已办</span>
        </div>
      </div>
      <div class="todo-total">
        <span>总共 {{ totalTasks }} 条</span>
      </div>
    </div>
    <div class="todo-list">
      <div v-for="item in todoList" :key="item.id" class="todo-item">
        <div class="todo-item-content">
          <div class="todo-item-title">{{ item.title }}</div>
          <div class="todo-item-meta">
            <span class="todo-item-initiator">发起人: {{ item.initiator }}</span>
          </div>
        </div>
        <div class="todo-item-right">
          <span class="todo-item-tag">常规</span>
          <div class="todo-item-deadline">
            <span class="todo-item-deadline-icon">📅</span>
            <span class="todo-item-deadline-text">{{ item.deadline }}</span>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// 模拟待办任务数据
const todoList = ref([
  {
    id: '1',
    title: '班组长审批',
    initiator: '系统',
    deadline: '2025/07/11 14:58截止',
    status: 'pending'
  },
  {
    id: '2',
    title: '班组长审批',
    initiator: '系统',
    deadline: '2025/07/11 15:01截止',
    status: 'pending'
  },
  {
    id: '3',
    title: '[PRQ12] 履约项目立项申请 待提交!',
    initiator: '系统',
    deadline: '2025/07/11 15:13截止',
    status: 'pending'
  },
  {
    id: '4',
    title: '履约项目立项申请【一重项目】待您审批',
    initiator: '系统',
    deadline: '2025/07/11 15:13截止',
    status: 'pending'
  },
  {
    id: '5',
    title: '新任务',
    initiator: '系统',
    deadline: '2025/07/11 15:21截止',
    status: 'pending'
  },
  {
    id: '6',
    title: '班组长审批',
    initiator: '系统',
    deadline: '2025/07/11 15:21截止',
    status: 'pending'
  }
])

const totalTasks = computed(() => 622)
</script>

<style scoped>
.widget-card { height: 100%; }
.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F2F5;
}
.todo-tabs {
  display: flex;
  gap: 24px;
}
.todo-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
}
.todo-tab.active {
  color: #1677FF;
  font-weight: 600;
}
.todo-tab-text {
  font-size: 14px;
}
.todo-badge {
  background: #FF4D4F;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}
.todo-total {
  font-size: 12px;
  color: #86909C;
}
.todo-list {
  max-height: 250px;
  overflow-y: auto;
}
.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #FFFFFF;
  border: 1px solid #F0F2F5;
  transition: all 0.3s;
}
.todo-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-color: #E8ECF0;
}
.todo-item-content {
  flex: 1;
  min-width: 0;
}
.todo-item-title {
  font-size: 14px;
  font-weight: 500;
  color: #1D2129;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.todo-item-meta {
  font-size: 12px;
  color: #86909C;
}
.todo-item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  margin-left: 16px;
}
.todo-item-tag {
  background: #E6F7FF;
  color: #1677FF;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}
.todo-item-deadline {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #FF4D4F;
}
.todo-item-deadline-icon {
  font-size: 14px;
}
</style>
