<template>
  <a-card class="widget-card">
    <template #title>
      <span class="widget-title-dot" />成本趋势
    </template>
    <template #extra>
      <div class="date-range-picker">
        <a-date-picker
          v-model:value="dateRange"
          type="month"
          mode="month"
          :picker-options="pickerOptions"
          format="YYYY-MM"
          placeholder="选择月份"
          @change="handleDateChange"
        />
        <span class="range-separator">~</span>
        <a-date-picker
          v-model:value="dateRangeEnd"
          type="month"
          mode="month"
          :picker-options="pickerOptions"
          format="YYYY-MM"
          placeholder="选择月份"
          @change="handleDateChange"
        />
      </div>
    </template>

    <v-chart v-show="ready" :option="chartOption" autoresize lazy-init style="height: 200px;" />
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { useWorkbenchStore } from '@/stores/workbench'

use([LineChart, TooltipComponent, GridComponent, CanvasRenderer])

const store = useWorkbenchStore()
const stats = computed(() => store.budgetStats)
const ready = ref(false)
onMounted(() => { ready.value = true })

// 日期选择
const dateRange = ref<any>(null)
const dateRangeEnd = ref<any>(null)

const pickerOptions = {
  disabledDate: (date: any) => {
    return date > new Date()
  }
}

// 处理日期变化
const handleDateChange = () => {
  // 这里可以添加日期范围过滤逻辑
  console.log('Date range changed:', dateRange.value, dateRangeEnd.value)
}



// 图表配置
const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e8ecf0',
    textStyle: { color: '#1D2129', fontSize: 12 },
    formatter: (params: any[]) => {
      let str = `<div style="font-weight:600;margin-bottom:4px;">${params[0].axisValue}</div>`
      params.forEach((p: any) => {
        str += `<div style="display:flex;justify-content:space-between;gap:16px;">
          <span>${p.marker}${p.seriesName}</span>
          <span style="font-weight:600;">${p.value} 万元</span>
        </div>`
      })
      return str
    },
  },
  grid: { top: 8, right: 10, bottom: 22, left: 46 },
  xAxis: {
    type: 'category',
    data: stats.value.monthlySpent.map(d => d.month),
    axisLine: { lineStyle: { color: '#E8ECF0' } },
    axisTick: { show: false },
    axisLabel: { color: '#86909C', fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#F0F2F5', type: 'dashed' } },
    axisLabel: { color: '#86909C', fontSize: 11, formatter: '{value}万' },
  },
  series: [
    {
      name: '月度预算',
      type: 'line',
      data: stats.value.monthlySpent.map(d => (d.budget / 10).toFixed(0)),
      smooth: true,
      lineStyle: { color: '#E0E8F5', width: 2, type: 'dashed' },
      itemStyle: { color: '#E0E8F5' },
      symbol: 'none',
    },
    {
      name: '月度支出',
      type: 'line',
      data: stats.value.monthlySpent.map(d => (d.amount / 10).toFixed(0)),
      smooth: true,
      lineStyle: { color: '#1677FF', width: 2.5 },
      itemStyle: { color: '#1677FF', borderWidth: 3, borderColor: '#fff' },
      areaStyle: {
        color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(22,119,255,0.2)' }, { offset: 1, color: 'rgba(22,119,255,0)' }] },
      },
    },
  ],
}))
</script>

<style scoped>
.widget-card { height: 100%; }
.date-range-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}
.range-separator {
  color: #86909C;
  font-size: 14px;
}
:deep(.ant-picker) {
  width: 120px;
}
</style>