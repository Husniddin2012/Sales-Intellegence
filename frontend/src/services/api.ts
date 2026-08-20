import {
  SalesSummaryDto,
  RootCauseDto,
  InstagramAnalyticsDto,
  AgentResponseOverviewDto,
  ProductOverviewDto,
  HotLeadsOverviewDto,
  RepeatPurchaseDto,
  SimulationRequestDto,
  SimulationResultDto,
  ActionResultDto,
  LoginRequestDto,
  RegisterRequestDto,
  ForgotPasswordRequestDto,
  VerifyOtpRequestDto,
  ResetPasswordRequestDto,
  AuthResponseDto,
  UserDto,
  ExecutiveBriefingResponseDto,
  AiAskRequestDto,
  AiAskResponseDto
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('sales_intel_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers || {})
    }
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg = data?.message || `Xatolik: ${res.status} ${res.statusText}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Sales Dashboard APIs
  getOverview: (): Promise<SalesSummaryDto> => fetchJson<SalesSummaryDto>('/dashboard/overview'),
  getRootCauses: (): Promise<RootCauseDto[]> => fetchJson<RootCauseDto[]>('/dashboard/root-causes'),
  getInstagram: (): Promise<InstagramAnalyticsDto> => fetchJson<InstagramAnalyticsDto>('/diagnostics/instagram'),
  getAgents: (): Promise<AgentResponseOverviewDto> => fetchJson<AgentResponseOverviewDto>('/diagnostics/agents'),
  getProductX: (): Promise<ProductOverviewDto> => fetchJson<ProductOverviewDto>('/diagnostics/product-x'),
  getHotLeads: (): Promise<HotLeadsOverviewDto> => fetchJson<HotLeadsOverviewDto>('/diagnostics/hot-leads'),
  getRetention: (): Promise<RepeatPurchaseDto> => fetchJson<RepeatPurchaseDto>('/diagnostics/retention'),
  runSimulation: (req: SimulationRequestDto): Promise<SimulationResultDto> =>
    fetchJson<SimulationResultDto>('/simulation/calculate', {
      method: 'POST',
      body: JSON.stringify(req)
    }),
  executeAction: (actionKey: string, targetId = '', note = ''): Promise<ActionResultDto> =>
    fetchJson<ActionResultDto>('/actions/execute', {
      method: 'POST',
      body: JSON.stringify({ actionKey, targetId, note })
    }),
  resetData: (): Promise<{ success: boolean; message: string }> =>
    fetchJson<{ success: boolean; message: string }>('/actions/reset', {
      method: 'POST'
    }),

  // Auth APIs
  login: (req: LoginRequestDto): Promise<AuthResponseDto> =>
    fetchJson<AuthResponseDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(req)
    }),

  register: (req: RegisterRequestDto): Promise<AuthResponseDto> =>
    fetchJson<AuthResponseDto>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(req)
    }),

  forgotPassword: (req: ForgotPasswordRequestDto): Promise<AuthResponseDto> =>
    fetchJson<AuthResponseDto>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(req)
    }),

  verifyOtp: (req: VerifyOtpRequestDto): Promise<AuthResponseDto> =>
    fetchJson<AuthResponseDto>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(req)
    }),

  resetPassword: (req: ResetPasswordRequestDto): Promise<AuthResponseDto> =>
    fetchJson<AuthResponseDto>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(req)
    }),

  getMe: (): Promise<UserDto> => fetchJson<UserDto>('/auth/me'),

  getUsers: (): Promise<UserDto[]> => fetchJson<UserDto[]>('/auth/users'),

  // AI Voice & Briefing APIs
  getBriefing: (): Promise<ExecutiveBriefingResponseDto> =>
    fetchJson<ExecutiveBriefingResponseDto>('/aiconsultant/briefing'),

  askAi: (req: AiAskRequestDto): Promise<AiAskResponseDto> =>
    fetchJson<AiAskResponseDto>('/aiconsultant/ask', {
      method: 'POST',
      body: JSON.stringify(req)
    })
};
