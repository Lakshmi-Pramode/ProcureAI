// ============================================================
// ProcureAI — Unified Frontend API Client
// ============================================================
import type {
  Tender, Requirement, Vendor, VendorDocument,
  ComplianceResult, RiskAssessment, AuditEntry,
  DashboardStats, VendorScore, ComplianceStatus
} from '../types';

const BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('bidguard_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData, delete Content-Type to allow browser to set multipart boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.error || `Request failed with status ${response.status}`);
    }
    return json.data !== undefined ? json.data : json;
  } catch (err) {
    console.warn(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // --- Auth ---
  auth: {
    login: async (email: string, role: string) => {
      const data = await request<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, role })
      });
      if (data.token) sessionStorage.setItem('bidguard_token', data.token);
      return data;
    },
    me: () => request<any>('/auth/me'),
  },

  // --- Dashboard ---
  dashboard: {
    getStats: () => request<DashboardStats>('/dashboard/stats'),
  },

  // --- Tenders ---
  tenders: {
    getAll: () => request<Tender[]>('/tenders'),
    getById: (id: string) => request<Tender & { requirements: Requirement[]; vendors: Vendor[]; vendorScores: VendorScore[] }>(`/tenders/${id}`),
    create: (tender: Partial<Tender>) => request<Tender>('/tenders', {
      method: 'POST',
      body: JSON.stringify(tender)
    }),
    update: (id: string, tender: Partial<Tender>) => request<Tender>(`/tenders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tender)
    }),
    delete: (id: string) => request<{ success: boolean }>(`/tenders/${id}`, {
      method: 'DELETE'
    }),
    extractRequirements: (tenderId: string, text?: string) => request<Requirement[]>(`/tenders/${tenderId}/extract-requirements`, {
      method: 'POST',
      body: JSON.stringify({ text })
    }),
  },

  // --- Vendors ---
  vendors: {
    getAll: (tenderId?: string) => request<Vendor[]>(`/vendors${tenderId ? `?tenderId=${tenderId}` : ''}`),
    getById: (id: string, tenderId?: string) => request<Vendor & { documents: VendorDocument[]; complianceResults: ComplianceResult[]; riskAssessment?: RiskAssessment }>(`/vendors/${id}${tenderId ? `?tenderId=${tenderId}` : ''}`),
    create: (vendor: Partial<Vendor> & { tenderId?: string }) => request<Vendor>('/vendors', {
      method: 'POST',
      body: JSON.stringify(vendor)
    }),
    update: (id: string, vendor: Partial<Vendor>) => request<Vendor>(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vendor)
    }),
    getScores: (tenderId: string) => request<VendorScore[]>(`/vendors/scores/${tenderId}`),
  },

  // --- Documents ---
  documents: {
    upload: (formData: FormData) => request<VendorDocument>('/documents/upload', {
      method: 'POST',
      body: formData
    }),
    getAll: (vendorId?: string, tenderId?: string) => {
      const params = new URLSearchParams();
      if (vendorId) params.append('vendorId', vendorId);
      if (tenderId) params.append('tenderId', tenderId);
      const qs = params.toString();
      return request<VendorDocument[]>(`/documents${qs ? `?${qs}` : ''}`);
    },
    getById: (id: string) => request<VendorDocument>(`/documents/${id}`),
  },

  // --- AI Verification ---
  verification: {
    verify: (tenderId: string, vendorId?: string) => request<ComplianceResult[] | Record<string, ComplianceResult[]>>('/verification/verify', {
      method: 'POST',
      body: JSON.stringify({ tenderId, vendorId })
    }),
    getResults: (tenderId?: string, vendorId?: string) => {
      const params = new URLSearchParams();
      if (tenderId) params.append('tenderId', tenderId);
      if (vendorId) params.append('vendorId', vendorId);
      const qs = params.toString();
      return request<ComplianceResult[]>(`/verification/results${qs ? `?${qs}` : ''}`);
    },
    saveOverride: (resultId: string, status: ComplianceStatus, reason: string) => request<ComplianceResult>(`/verification/override/${resultId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason })
    }),
    getMatrix: (tenderId: string) => request<{
      tenderId: string;
      requirements: Requirement[];
      vendors: Vendor[];
      matrix: Array<{ requirement: Requirement; results: Record<string, ComplianceResult> }>;
    }>(`/verification/matrix/${tenderId}`),
  },

  // --- Risk Center ---
  risk: {
    getAll: (tenderId?: string) => request<RiskAssessment[]>(`/risk/assessments${tenderId ? `?tenderId=${tenderId}` : ''}`),
    getVendorRisk: (vendorId: string, tenderId?: string) => request<RiskAssessment>(`/risk/vendor/${vendorId}${tenderId ? `?tenderId=${tenderId}` : ''}`),
    recalculate: (tenderId: string, vendorId: string) => request<RiskAssessment>('/risk/recalculate', {
      method: 'POST',
      body: JSON.stringify({ tenderId, vendorId })
    }),
  },

  // --- Reports ---
  reports: {
    getSummary: (tenderId: string) => request<any>(`/reports/${tenderId}/summary`),
  },

  // --- Audit Trail ---
  audit: {
    getAll: (limit = 100, action?: string) => {
      const params = new URLSearchParams();
      if (limit) params.append('limit', String(limit));
      if (action) params.append('action', action);
      return request<AuditEntry[]>(`/audit?${params.toString()}`);
    },
    log: (entry: Partial<AuditEntry>) => request<AuditEntry>('/audit', {
      method: 'POST',
      body: JSON.stringify(entry)
    }),
  },

  // --- Config / Credentials ---
  config: {
    getStatus: () => request<{
      isMongoConnected: boolean;
      isGeminiConfigured: boolean;
      activeDatabase: string;
      activeAIEngine: string;
      geminiKeyPreview: string;
      mongoUriPreview: string;
    }>('/config/status'),
    updateConfig: (keys: { mongoUri?: string; geminiApiKey?: string }) => request<any>('/config/update', {
      method: 'POST',
      body: JSON.stringify(keys)
    }),
  },

  // --- AI Copilot ---
  ai: {
    chat: (query: string, tenderId?: string, vendorId?: string) => request<{ query: string; answer: string; timestamp: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ query, tenderId, vendorId })
    }),
  }
};
