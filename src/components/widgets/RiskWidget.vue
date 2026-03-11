<template>
  <a-card class="widget-card">
    <template #title>
      <span class="widget-title-dot" />风险预警
    </template>
    <template #extra>
      <a-badge status="error" :text="`${stats.unhandled} 项待处理`" />
    </template>
    <div class="risk-content">
      <div class="chart-wrap">
        <v-chart v-show="ready" :option="chartOption" autoresize lazy-init style="height: 140px;" />
        <div class="risk-counts">
          <div class="risk-count-item high">
            <span class="count">{{ stats.high }}</span>
            <span class="label">高风险</span>
          </div>
          <div class="risk-count-item medium">
            <span class="count">{{ stats.medium }}</span>
            <span class="label">中风险</span>
          </div>
          <div class="risk-count-item low">
            <span class="count">{{ stats.low }}</span>
            <span class="label">低风险</span>
          </div>
        </div>
      </div>

      <!-- 循环滚动列表 -->
      <div
        class="scroll-wrap"
        @mouseenter="pauseScroll"
        @mouseleave="resumeScroll"
      >
        <div class="scroll-track" :style="scrollTrackStyle" ref="trackRef">
          <!-- 渲染两份数据实现无缝循环 -->
          <template v-for="pass in 2" :key="pass">
            <div v-for="item in stats.items" :key="`${pass}-${item.id}`" class="risk-item">
              <div class="risk-item-header">
                <span :class="['risk-tag', item.level]">{{ levelText[item.level] }}</span>
                <span class="risk-name">{{ item.name }}</span>
                <span :class="['risk-status', statusClass(item.status)]">{{ item.status }}</span>
              </div>
              <div class="risk-item-footer">
                <span class="risk-project">{{ item.project }}</span>
                <span class="risk-date">{{ item.date }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { useWorkbenchStore } from '@/stores/workbench'

use([PieChart, TooltipComponent, CanvasRenderer])

const store = useWorkbenchStore()
const stats = computed(() => store.riskStats)
const ready = ref(false)

const levelText: Record<string, string> = { high: '高', medium: '中', low: '低' }

const statusClass = (status: string) => {
  if (status === '分析中') return 'unhandled'
  if (status === '应对中') return 'handling'
  return 'handling'
}

// ---- 无缝循环滚动逻辑 ----
const trackRef = ref<HTMLElement | null>(null)
const translateY = ref(0)
let animFrame: number | null = null
let paused = false
const SPEED = 0.4 // px per frame，越大滚动越快

function scroll() {
  if (!paused && trackRef.value) {
    const halfHeight = trackRef.value.scrollHeight / 2
    translateY.value += SPEED
    if (translateY.value >= halfHeight) {
      translateY.value = 0
    }
  }
  animFrame = requestAnimationFrame(scroll)
}

const scrollTrackStyle = computed(() => ({
  transform: `translateY(-${translateY.value}px)`,
}))

const pauseScroll = () => { paused = true }
const resumeScroll = () => { paused = false }

onMounted(() => {
  ready.value = true
  animFrame = requestAnimationFrame(scroll)
})

onBeforeUnmount(() => {
  if (animFrame !== null) cancelAnimationFrame(animFrame)
})

// ---- ECharts 配置 ----
const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} 项 ({d}%)',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e8ecf0',
    textStyle: { color: '#1D2129', fontSize: 12 },
  },
  series: [
    {
      type: 'pie',
      radius: ['42%', '65%'],
      center: ['50%', '50%'],
      label: { show: false },
      emphasis: {
        itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.1)' },
      },
      data: [
        { value: stats.value.high, name: '高风险', itemStyle: { color: '#FF4D4F' } },
        { value: stats.value.medium, name: '中风险', itemStyle: { color: '#FAAD14' } },
        { value: stats.value.low, name: '低风险', itemStyle: { color: '#52C41A' } },
      ],
    },
  ],
}))
</script>

<style scoped>
.widget-card { height: 100%; }
.risk-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chart-wrap {
  display: flex;
  align-items: center;
}
.risk-counts {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 8px;
}
.risk-count-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 6px;
  min-width: 90px;
}
.risk-count-item.high   { background: rgba(255,  77,  79, 0.08); }
.risk-count-item.medium { background: rgba(250, 173,  20, 0.08); }
.risk-count-item.low    { background: rgba( 82, 196,  26, 0.08); }
.risk-count-item .count { font-size: 18px; font-weight: 700; line-height: 1; }
.risk-count-item.high   .count { color: #FF4D4F; }
.risk-count-item.medium .count { color: #FAAD14; }
.risk-count-item.low    .count { color: #52C41A; }
.risk-count-item .label { font-size: 12px; color: var(--color-text-secondary); }

/* 滚动容器 */
.scroll-wrap {
  height: 168px;
  overflow: hidden;
  border-radius: 6px;
  position: relative;
}

/* 渐隐遮罩，增强大屏质感 */
.scroll-wrap::before,
.scroll-wrap::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 28px;
  z-index: 1;
  pointer-events: none;
}
.scroll-wrap::before {
  top: 0;
  background: linear-gradient(to bottom, #ffffff, transparent);
}
.scroll-wrap::after {
  bottom: 0;
  background: linear-gradient(to top, #ffffff, transparent);
}

.scroll-track {
  display: flex;
  flex-direction: column;
  gap: 6px;
  will-change: transform;
}

.risk-item {
  padding: 8px 10px;
  background: #F8FAFE;
  border-radius: 6px;
  border-left: 3px solid transparent;
  flex-shrink: 0;
  transition: background 0.2s, border-left-color 0.2s;
}
.risk-item:hover {
  background: #EEF4FF;
  border-left-color: #1677FF;
}
.risk-item-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.risk-tag {
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}
.risk-tag.high   { background: rgba(255,  77,  79, 0.12); color: #FF4D4F; }
.risk-tag.medium { background: rgba(250, 173,  20, 0.12); color: #FAAD14; }
.risk-tag.low    { background: rgba( 82, 196,  26, 0.12); color: #52C41A; }
.risk-name {
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.risk-status {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 10px;
  flex-shrink: 0;
}
.risk-status.unhandled { background: rgba(255, 77, 79, 0.1);  color: #FF4D4F; }
.risk-status.handling  { background: rgba(250, 173, 20, 0.1); color: #FAAD14; }
.risk-item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.risk-project,
.risk-date { font-size: 11px; color: var(--color-text-tertiary); }
</style>
