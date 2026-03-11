<template>
  <a-card class="widget-card">
    <template #title>
      <span class="widget-title-dot" />函件统计
    </template>
    <template #extra>
      <div class="legend-group">
        <span class="legend-item"><span class="legend-dot" style="background:#1677FF" />收函</span>
        <span class="legend-item"><span class="legend-dot" style="background:#52C41A" />发函</span>
      </div>
    </template>
    <div class="summary-row">
      <div class="summary-item">
        <span class="summary-num" style="color: #1677FF">{{ stats.totalReceived }}</span>
        <span class="summary-label">累计收函</span>
      </div>
      <div class="summary-divider" />
      <div class="summary-item">
        <span class="summary-num" style="color: #52C41A">{{ stats.totalSent }}</span>
        <span class="summary-label">累计发函</span>
      </div>
      <div class="summary-divider" />
      <div class="summary-item">
        <span class="summary-num" style="color: #722ED1">{{ stats.totalReceived + stats.totalSent }}</span>
        <span class="summary-label">函件总计</span>
      </div>
    </div>
    <v-chart v-show="ready" :option="chartOption" autoresize lazy-init style="height: 180px; margin-top: 4px;" />
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { useWorkbenchStore } from '@/stores/workbench'

use([BarChart, TooltipComponent, GridComponent, CanvasRenderer])

const store = useWorkbenchStore()
const stats = computed(() => store.letterStats)
const ready = ref(false)
onMounted(() => { ready.value = true })

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e8ecf0',
    textStyle: { color: '#1D2129', fontSize: 12 },
    formatter: (params: any[]) => {
      let str = `<div style="font-weight:600;margin-bottom:4px;">${params[0].axisValue}</div>`
      params.forEach((p: any) => {
        str += `<div style="display:flex;justify-content:space-between;gap:16px;">
          <span>${p.marker}${p.seriesName}</span>
          <span style="font-weight:600;">${p.value} 件</span>
        </div>`
      })
      return str
    },
  },
  grid: { top: 10, right: 10, bottom: 24, left: 40 },
  xAxis: {
    type: 'category',
    data: stats.value.monthlyData.map(d => d.month),
    axisLine: { lineStyle: { color: '#E8ECF0' } },
    axisTick: { show: false },
    axisLabel: { color: '#86909C', fontSize: 12 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#F0F2F5', type: 'dashed' } },
    axisLabel: { color: '#86909C', fontSize: 11 },
  },
  series: [
    {
      name: '收函',
      type: 'bar',
      data: stats.value.monthlyData.map(d => d.received),
      barMaxWidth: 22,
      barGap: '20%',
      itemStyle: {
        color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#4096FF' }, { offset: 1, color: '#1677FF' }] },
        borderRadius: [4, 4, 0, 0],
      },
    },
    {
      name: '发函',
      type: 'bar',
      data: stats.value.monthlyData.map(d => d.sent),
      barMaxWidth: 22,
      itemStyle: {
        color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#73D13D' }, { offset: 1, color: '#52C41A' }] },
        borderRadius: [4, 4, 0, 0],
      },
    },
  ],
}))
</script>

<style scoped>
.widget-card { height: 100%; }
.legend-group {
  display: flex;
  gap: 12px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--color-text-secondary);
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}
.summary-row {
  display: flex;
  align-items: center;
  padding: 12px 0 8px;
}
.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.summary-num {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}
.summary-label {
  font-size: 12px;
  color: var(--color-text-tertiary);
}
.summary-divider {
  width: 1px;
  height: 36px;
  background: #F0F2F5;
}
</style>
