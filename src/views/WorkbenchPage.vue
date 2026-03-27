<template>
  <WorkbenchLayout>
    <!-- 页面标题栏 -->
    <div class="page-header">
      <div class="page-title-area">
        <div class="page-title">
          <HomeOutlined class="title-icon" />
          工作台
        </div>
        <div class="page-subtitle">实时掌握履约项目各模块执行状态</div>
      </div>
      <div class="page-actions">
        <!-- 筛选栏 -->
        <div class="filter-bar">
          <span class="filter-label">项目筛选：</span>
          <a-select
            v-model:value="store.selectedProject"
            style="width: 160px;"
            size="small"
            :options="projectOptions"
          />
          <a-divider type="vertical" style="height: 20px; margin: 0 8px;" />
          <span class="filter-label">时间范围：</span>
          <a-segmented
            v-model:value="store.selectedTimeRange"
            :options="timeRangeOptions"
            size="small"
          />
        </div>
        <a-divider type="vertical" style="height: 20px; margin: 0 12px;" />
        <a-tooltip :title="`上次更新：${store.lastUpdated}`">
          <a-button
            size="small"
            :loading="store.loading"
            @click="store.refreshData()"
          >
            <template #icon><ReloadOutlined /></template>
            刷新数据
          </a-button>
        </a-tooltip>
        <span class="update-time">更新于 {{ store.lastUpdated }}</span>
      </div>
    </div>

    <!-- 顶部统计卡片 -->
    <div class="stats-overview">
      <div
        v-for="card in overviewCards"
        :key="card.key"
        class="stat-card"
        :style="{ '--card-color': card.color, '--card-bg': card.bg }"
      >
        <div class="stat-card-icon">
          <component :is="card.icon" />
        </div>
        <div class="stat-card-body">
          <div class="stat-card-value">{{ card.value }}</div>
          <div class="stat-card-label">{{ card.label }}</div>
        </div>
        <div class="stat-card-decorator" />
      </div>
    </div>

    <!-- 图表区域 - 第一行 -->
    <a-row :gutter="[16, 16]" class="widget-row">
      <a-col :span="8">
        <ProjectStatusWidget />
      </a-col>
      <a-col :span="8">
        <LetterStatsWidget />
      </a-col>
      <a-col :span="8">
        <RiskWidget />
      </a-col>
    </a-row>
    <div style="margin-top: 16px;"></div>
    <!-- 图表区域 - 第二行 -->
    <a-row :gutter="[16, 16]" class="widget-row">
      <a-col :span="8">
        <div class="budget-section">
          <BudgetWidget />
          <div style="margin-top: 16px;">
            <CostTrendWidget />
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <PlanWidget />
      </a-col>
      <a-col :span="8">
        <TaskWidget />
      </a-col>
    </a-row>

    <!-- 底部状态栏 -->
    <div class="page-footer">
      <span>工业互联网平台 · 履约项目管理系统</span>
      <span>数据实时同步中 <a-badge status="processing" /></span>
    </div>
  </WorkbenchLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  HomeOutlined,
  ReloadOutlined,
  WarningOutlined,
  CalendarOutlined,
  PauseCircleOutlined,
  ExclamationCircleOutlined,
  RocketOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue'
import WorkbenchLayout from '@/components/layout/WorkbenchLayout.vue'
import ProjectStatusWidget from '@/components/widgets/ProjectStatusWidget.vue'
import LetterStatsWidget from '@/components/widgets/LetterStatsWidget.vue'
import RiskWidget from '@/components/widgets/RiskWidget.vue'
import BudgetWidget from '@/components/widgets/BudgetWidget.vue'
import CostTrendWidget from '@/components/widgets/CostTrendWidget.vue'
import PlanWidget from '@/components/widgets/PlanWidget.vue'
import TaskWidget from '@/components/widgets/TaskWidget.vue'
import { useWorkbenchStore } from '@/stores/workbench'

const store = useWorkbenchStore()

const projectOptions = [
  { value: 'all', label: '全部项目' },
  { value: 'huadong', label: '华东智能制造基地' },
  { value: 'beijing', label: '北京数据中心扩建' },
  { value: 'guangzhou', label: '广州港口自动化改造' },
  { value: 'chengdu', label: '成都工业园区建设' },
  { value: 'wuhan', label: '武汉新能源设备安装' },
]

const timeRangeOptions = [
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'quarter', label: '本季度' },
  { value: 'year', label: '全年' },
]

const overviewCards = computed(() => {
  const { projectStats, riskStats, milestoneStats } = store
  
  // 计算未关闭风险数量
  const unclosedRisks = riskStats.high + riskStats.medium + riskStats.low

  return [
    {
      key: 'inProgress',
      label: '进行中项目',
      value: projectStats.inProgress,
      icon: CalendarOutlined,
      color: '#1677FF',
      bg: 'rgba(22,119,255,0.08)',
    },
    {
      key: 'suspended',
      label: '暂停项目',
      value: projectStats.suspended,
      icon: PauseCircleOutlined,
      color: '#13C2C2',
      bg: 'rgba(19,194,194,0.08)',
    },
    {
      key: 'overdue',
      label: '逾期项目',
      value: projectStats.overdue,
      icon: WarningOutlined,
      color: '#FF4D4F',
      bg: 'rgba(255,77,79,0.08)',
    },
    {
      key: 'unclosedRisks',
      label: '未关闭风险',
      value: unclosedRisks,
      icon: ExclamationCircleOutlined,
      color: '#FAAD14',
      bg: 'rgba(250,173,20,0.08)',
    },
    {
      key: 'monthlyPlannedMilestones',
      label: '当月计划完成里程碑',
      value: milestoneStats.monthlyPlanned,
      icon: RocketOutlined,
      color: '#52C41A',
      bg: 'rgba(82,196,26,0.08)',
    },
    {
      key: 'uncompletedMilestones',
      label: '当月未完成里程碑',
      value: milestoneStats.monthlyPlanned - milestoneStats.monthlyCompleted,
      icon: ClockCircleOutlined,
      color: '#722ED1',
      bg: 'rgba(114,46,209,0.08)',
    },
  ]
})
</script>

<style scoped>
/* ===== 页面头部 ===== */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.page-title-area {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  color: var(--color-primary);
  font-size: 18px;
}

.page-subtitle {
  font-size: 12px;
  color: var(--color-text-tertiary);
  padding-left: 26px;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.update-time {
  font-size: 11px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

/* ===== 统计概览卡片 ===== */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  position: relative;
  background: #FFFFFF;
  border-radius: 10px;
  padding: 16px 16px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  cursor: default;
  transition: all 0.25s ease;
  border-top: 3px solid var(--card-color);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.stat-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--card-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--card-color);
}

.stat-card-body {
  flex: 1;
}

.stat-card-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.1;
}

.stat-card-label {
  font-size: 12px;
  color: var(--color-text-tertiary);
  margin-top: 2px;
}



.stat-card-decorator {
  position: absolute;
  bottom: -12px;
  right: -12px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--card-bg);
  opacity: 0.6;
}

/* ===== 图表行 ===== */
.widget-row {
  margin-bottom: 0 !important;
}

.widget-row + .widget-row {
  margin-top: 0 !important;
}

/* ===== 底部状态栏 ===== */
.page-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding: 10px 16px;
  background: #FFFFFF;
  border-radius: 8px;
  font-size: 12px;
  color: var(--color-text-tertiary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
</style>
