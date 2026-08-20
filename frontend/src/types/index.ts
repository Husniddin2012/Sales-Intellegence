export interface SalesSummaryDto {
  currentPeriodSales: number;
  previousPeriodSales: number;
  percentageChange: number;
  lostRevenueEstimated: number;
  totalLeadsCurrent: number;
  totalLeadsPrevious: number;
  leadChangePercentage: number;
  overallConversionCurrent: number;
  overallConversionPrevious: number;
  periodLabel: string;
  aiSummaryText: string;
  waterfallBreakdown: WaterfallItem[];
  dailyTrends: DailySalesTrend[];
}

export interface WaterfallItem {
  cause: string;
  impactAmount: number;
  impactPercent: number;
  category: string;
  isNegative: boolean;
}

export interface DailySalesTrend {
  date: string;
  currentSales: number;
  previousSales: number;
  leadsCount: number;
}

export interface RootCauseDto {
  id: string;
  category: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  impactPercentage: number;
  lostRevenue: number;
  icon: string;
  shortDescription: string;
  detailedReason: string;
  keyMetricBefore: string;
  keyMetricAfter: string;
  actionKey: string;
  actionTitle: string;
  actionCompleted: boolean;
}

export interface InstagramAnalyticsDto {
  leadsThisMonth: number;
  leadsLastMonth: number;
  dropPercentage: number;
  adSpendThisMonth: number;
  adSpendLastMonth: number;
  costPerLeadCurrent: number;
  costPerLeadPrevious: number;
  ctrCurrent: number;
  ctrPrevious: number;
  aiAnalysis: string;
  campaigns: AdCampaignDto[];
  channels: LeadChannelComparison[];
}

export interface AdCampaignDto {
  name: string;
  status: string;
  spend: number;
  leads: number;
  cpl: number;
  ctr: number;
  diagnosis: string;
}

export interface LeadChannelComparison {
  channel: string;
  currentLeads: number;
  previousLeads: number;
  changePercent: number;
}

export interface AgentPerformanceDto {
  id: string;
  name: string;
  role: string;
  avatar: string;
  avgResponseTimeMinutes: number;
  targetResponseTimeMinutes: number;
  totalAssignedLeads: number;
  closedDeals: number;
  missedHotLeads: number;
  conversionRate: number;
  previousConversionRate: number;
  status: 'Critical' | 'Warning' | 'Top' | 'Normal';
  diagnosis: string;
}

export interface AgentResponseOverviewDto {
  totalAgents: number;
  laggingAgentsCount: number;
  avgTeamResponseTimeMinutes: number;
  targetResponseTimeMinutes: number;
  revenueLostDueToDelay: number;
  aiInsight: string;
  agents: AgentPerformanceDto[];
  slaDistribution: ResponseTimeSlaBucket[];
}

export interface ResponseTimeSlaBucket {
  range: string;
  leadCount: number;
  conversionRate: number;
  isAcceptable: boolean;
}

export interface ProductMetricDto {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  currentConversionRate: number;
  previousConversionRate: number;
  conversionChangePercent: number;
  lostRevenue: number;
  viewsCount: number;
  addToCartCount: number;
  checkoutCount: number;
  ordersCount: number;
  isAlerted: boolean;
  rootCauseNote: string;
}

export interface ProductOverviewDto {
  highlightedProblemProductId: string;
  aiAnalysis: string;
  products: ProductMetricDto[];
  problemProductFunnel: FunnelStep[];
}

export interface FunnelStep {
  stage: string;
  count: number;
  conversionFromPrevious: number;
  benchmarkRate: number;
}

export interface HotLeadDto {
  id: string;
  customerName: string;
  phone: string;
  instagramHandle: string;
  channel: string;
  productName: string;
  estimatedValue: number;
  createdAt: string;
  unansweredHours: number;
  status: 'Unanswered' | 'Reassigned' | 'Contacted';
  assignedAgentId: string;
  assignedAgentName: string;
  urgency: 'Critical' | 'High' | 'Medium';
  customerInquiry: string;
}

export interface HotLeadsOverviewDto {
  totalUnansweredCount: number;
  totalEstimatedLostValue: number;
  averageWaitTimeHours: number;
  aiPrescription: string;
  leads: HotLeadDto[];
}

export interface RepeatPurchaseDto {
  repeatRateCurrent: number;
  repeatRatePrevious: number;
  dropPercentage: number;
  lostLtvRevenue: number;
  churnedLoyalCustomersCount: number;
  inactiveDaysThreshold: number;
  aiDiagnosis: string;
  cohortHistory: CohortDataDto[];
  churnReasons: ChurnReasonDto[];
}

export interface CohortDataDto {
  month: string;
  retentionRate: number;
  customerCount: number;
}

export interface ChurnReasonDto {
  reason: string;
  percentage: number;
  recommendedSolution: string;
}

export interface SimulationRequestDto {
  reassignHotLeads: boolean;
  responseTimeImprovementMinutes: number;
  instagramBudgetIncreasePercent: number;
  productXDiscountPercent: number;
  triggerWinbackCampaign: boolean;
}

export interface SimulationResultDto {
  currentSales: number;
  baselineDeficit: number;
  projectedRecoveredRevenue: number;
  projectedNewTotalSales: number;
  projectedNewPercentageChange: number;
  impactBreakdown: SimulationBreakdownItem[];
  aiExecutiveSummary: string;
}

export interface SimulationBreakdownItem {
  lever: string;
  recoveredAmount: number;
  description: string;
}

export interface ActionResultDto {
  success: boolean;
  message: string;
  actionKey: string;
  executedAt: string;
  resultPayload?: any;
}

/* Auth DTOs */
export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  role: string;
  avatar: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface VerifyOtpRequestDto {
  email: string;
  otpCode: string;
}

export interface ResetPasswordRequestDto {
  email: string;
  otpCode: string;
  newPassword: string;
}

export interface AuthResponseDto {
  success: boolean;
  message: string;
  token?: string;
  user?: UserDto;
  sentToEmail?: string;
  debugOtpCode?: string;
}

/* AI Voice & Briefing DTOs */
export interface BriefingStepDto {
  stepNumber: number;
  id: string;
  title: string;
  narrationText: string;
  displayText: string;
  keyStat: string;
  category: string;
  impactAmount: number;
  recommendedAction: string;
}

export interface ExecutiveBriefingResponseDto {
  summaryTitle: string;
  totalEstimatedMinutes: number;
  totalLostRevenue: number;
  steps: BriefingStepDto[];
  conclusion: string;
}

export interface AiAskRequestDto {
  question: string;
  voiceSpeaker?: string;
  contextPage?: string;
}

export interface AiAskResponseDto {
  success: boolean;
  answerText: string;
  voiceScriptText: string;
  suggestedFollowUps: string[];
  relatedMetric?: string;
}
