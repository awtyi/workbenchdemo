// 项目数据类型
export interface ProjectStats {
  total: number
  planned: number
  inProgress: number
  overdue: number
  suspended: number
  terminated: number
 验收中: number
  待结项: number
}

// 里程碑数据类型
export interface MilestoneStats {
  monthlyPlanned: number
  monthlyCompleted: number
  totalUncompleted: number
}

// 函件数据类型
export interface LetterStats {
  totalReceived: number
  totalSent: number
  monthlyData: {
    month: string
    received: number
    sent: number
  }[]
}

// 风险数据类型
export interface RiskItem {
  id: string
  name: string
  level: 'high' | 'medium' | 'low'
  project: string
  status: '分析中' | '应对中' | '已关闭'
  date: string
}

export interface RiskStats {
  high: number
  medium: number
  low: number
  unhandled: number
  items: RiskItem[]
}

// 成本预算数据类型
export interface BudgetStats {
  totalBudget: number
  spent: number
  remaining: number
  monthlySpent: {
    month: string
    amount: number
    budget: number
  }[]
}

// 项目计划数据类型
export interface PlanStats {
  currentRate: number
  baseline: number
  monthlyRate: {
    month: string
    actual: number
    planned: number
  }[]
}

// 项目任务数据类型
export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  pending: number
  overdue: number
  byProject: {
    name: string
    completed: number
    inProgress: number
    pending: number
  }[]
}

// 工作台整体数据
export interface WorkbenchData {
  projectStats: ProjectStats
  letterStats: LetterStats
  riskStats: RiskStats
  budgetStats: BudgetStats
  planStats: PlanStats
  taskStats: TaskStats
  milestoneStats: MilestoneStats
  lastUpdated: string
}
