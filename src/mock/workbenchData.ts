import type { WorkbenchData } from '@/types/workbench'

export const mockWorkbenchData: WorkbenchData = {
  lastUpdated: '2026-03-11 09:45:00',

  projectStats: {
    total: 42,
    inProgress: 18,
    completed: 16,
    overdue: 5,
    suspended: 3,
  },

  letterStats: {
    totalReceived: 312,
    totalSent: 278,
    monthlyData: [
      { month: '10月', received: 48, sent: 42 },
      { month: '11月', received: 55, sent: 50 },
      { month: '12月', received: 43, sent: 38 },
      { month: '1月', received: 52, sent: 47 },
      { month: '2月', received: 38, sent: 35 },
      { month: '3月', received: 76, sent: 66 },
    ],
  },

  riskStats: {
    high: 8,
    medium: 15,
    low: 23,
    unhandled: 12,
    items: [
      { id: 'R001', name: '供应链延误导致进度滞后', level: 'high', project: '华东智能制造基地项目', status: '分析中', date: '2026-03-10' },
      { id: 'R002', name: '关键设备采购超预算', level: 'high', project: '北京数据中心扩建项目', status: '应对中', date: '2026-03-09' },
      { id: 'R003', name: '施工图纸变更频繁', level: 'medium', project: '广州港口自动化改造', status: '分析中', date: '2026-03-08' },
      { id: 'R004', name: '分包商资质审核延期', level: 'medium', project: '成都工业园区建设', status: '应对中', date: '2026-03-07' },
      { id: 'R005', name: '技术验收标准存在争议', level: 'low', project: '武汉新能源设备安装', status: '分析中', date: '2026-03-06' },
    ],
  },

  budgetStats: {
    totalBudget: 85600,
    spent: 52340,
    remaining: 33260,
    monthlySpent: [
      { month: '10月', amount: 7200, budget: 8000 },
      { month: '11月', amount: 8900, budget: 9000 },
      { month: '12月', amount: 6500, budget: 7500 },
      { month: '1月', amount: 9800, budget: 9500 },
      { month: '2月', amount: 7640, budget: 8000 },
      { month: '3月', amount: 12300, budget: 11000 },
    ],
  },

  planStats: {
    currentRate: 78.5,
    baseline: 82.0,
    monthlyRate: [
      { month: '10月', actual: 65, planned: 68 },
      { month: '11月', actual: 70, planned: 72 },
      { month: '12月', actual: 68, planned: 74 },
      { month: '1月', actual: 75, planned: 76 },
      { month: '2月', actual: 76, planned: 79 },
      { month: '3月', actual: 78.5, planned: 82 },
    ],
  },

  taskStats: {
    total: 256,
    completed: 148,
    inProgress: 62,
    pending: 35,
    overdue: 11,
    byProject: [
      { name: '华东智能制造', completed: 32, inProgress: 15, pending: 8 },
      { name: '北京数据中心', completed: 28, inProgress: 12, pending: 6 },
      { name: '广州港口改造', completed: 25, inProgress: 10, pending: 9 },
      { name: '成都工业园区', completed: 30, inProgress: 14, pending: 7 },
      { name: '武汉新能源', completed: 18, inProgress: 8, pending: 5 },
      { name: '深圳智慧工厂', completed: 15, inProgress: 3, pending: 0 },
    ],
  },
}
