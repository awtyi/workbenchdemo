import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockWorkbenchData } from '@/mock/workbenchData'
import type { WorkbenchData } from '@/types/workbench'

export const useWorkbenchStore = defineStore('workbench', () => {
  const data = ref<WorkbenchData>({ ...mockWorkbenchData })
  const loading = ref(false)
  const selectedProject = ref<string>('all')
  const selectedTimeRange = ref<string>('month')

  const projectStats = computed(() => data.value.projectStats)
  const letterStats = computed(() => data.value.letterStats)
  const riskStats = computed(() => data.value.riskStats)
  const budgetStats = computed(() => data.value.budgetStats)
  const planStats = computed(() => data.value.planStats)
  const taskStats = computed(() => data.value.taskStats)
  const lastUpdated = computed(() => data.value.lastUpdated)

  const taskCompletionRate = computed(() => {
    const { completed, total } = data.value.taskStats
    return total > 0 ? Math.round((completed / total) * 100) : 0
  })

  async function refreshData() {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 800))
    data.value = { ...mockWorkbenchData, lastUpdated: new Date().toLocaleString('zh-CN') }
    loading.value = false
  }

  return {
    data,
    loading,
    selectedProject,
    selectedTimeRange,
    projectStats,
    letterStats,
    riskStats,
    budgetStats,
    planStats,
    taskStats,
    lastUpdated,
    taskCompletionRate,
    refreshData,
  }
})
