<template>
  <a-card class="widget-card">
    <template #title>
      <span class="widget-title-dot" />项目状态分布
    </template>
    <template #extra>
      <a-tag color="blue">共 {{ stats.total }} 个项目</a-tag>
    </template>
    <div class="content-wrap">
      <!-- 环形图 -->
      <div class="chart-container">
        <v-chart v-show="ready" :option="chartOption" autoresize lazy-init style="height: 200px;" />
      </div>
      <!-- 下方 2×2 图例 -->
      <div class="legend-grid">
        <div v-for="item in statusList" :key="item.key" class="legend-item">
          <span class="legend-dot" :style="{ background: item.color }" />
          <span class="legend-name">{{ item.name }}</span>
          <span class="legend-sep">|</span>
          <span class="legend-value" :style="{ color: item.color }">{{ item.value }} 个</span>
          <span class="legend-percent">{{ getPercent(item.value) }}%</span>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { useWorkbenchStore } from '@/stores/workbench'

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

const store = useWorkbenchStore()
const stats = computed(() => store.projectStats)
const ready = ref(false)
onMounted(() => { ready.value = true })

const statusList = computed(() => [
  { key: 'inProgress', name: '进行中', value: stats.value.inProgress, color: '#1677FF' },
  { key: 'completed', name: '已完成', value: stats.value.completed, color: '#52C41A' },
  { key: 'overdue', name: '已逾期', value: stats.value.overdue, color: '#FF4D4F' },
  { key: 'suspended', name: '已暂停', value: stats.value.suspended, color: '#FAAD14' },
])

const getPercent = (val: number) => {
  return stats.value.total > 0 ? Math.round((val / stats.value.total) * 100) : 0
}

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} 个 ({d}%)',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e8ecf0',
    textStyle: { color: '#1D2129', fontSize: 12 },
  },
  series: [
    {
      type: 'pie',
      radius: ['48%', '72%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: () => `{total|${stats.value.total}}\n{sub|总项目}`,
        rich: {
          total: { fontSize: 28, fontWeight: 700, color: '#1D2129', lineHeight: 36 },
          sub: { fontSize: 12, color: '#86909C', lineHeight: 20 },
        },
      },
      emphasis: {
        label: { show: true },
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.1)' },
      },
      data: statusList.value.map(item => ({
        value: item.value,
        name: item.name,
        itemStyle: { color: item.color },
      })),
    },
  ],
}))
</script>

<style scoped>
.widget-card { height: 100%; }

.content-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-container {
  width: 100%;
}

/* 2×2 图例网格 */
.legend-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  width: 100%;
  margin-top: 12px;
  padding: 0 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 10px;
  background: #F8FAFE;
  border-radius: 8px;
  transition: background 0.2s;
}
.legend-item:hover { background: #EEF4FF; }

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.legend-name {
  flex: 1;
  font-size: 12px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}
.legend-sep {
  font-size: 11px;
  color: #E8ECF0;
}
.legend-value {
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}
.legend-percent {
  font-size: 11px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
}
</style>
