// Skill-Bee API Client for FastAPI Backend (http://127.0.0.1:8000)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'STUDENT' | 'FACULTY' | 'ADMIN';
    avatar: string;
    college?: string;
    classroom_code?: string;
    career_track?: string;
    latent_ability_theta?: number;
    streak_days?: number;
    daily_hours_done?: number;
    daily_hours_target?: number;
    xp_points?: number;
    preferred_modality?: string;
  };
}

export class ApiClient {
  private static tokenKey = 'skillbee_jwt_token';
  private static userKey = 'skillbee_user_profile';

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  static setSession(data: AuthResponse): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, data.access_token);
    localStorage.setItem(this.userKey, JSON.stringify(data.user));
  }

  static clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  static getSavedUser(): AuthResponse['user'] | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMsg = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.detail) errorMsg = errorData.detail;
      } catch {
        // use default error message
      }
      throw new Error(errorMsg);
    }

    return res.json();
  }

  // --- Auth Endpoints ---
  static async demoLogin(role: 'STUDENT' | 'FACULTY'): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    this.setSession(data);
    return data;
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setSession(data);
    return data;
  }

  static async register(userData: {
    email: string;
    password: string;
    name: string;
    role: 'STUDENT' | 'FACULTY';
    college?: string;
    classroom_code?: string;
    career_track?: string;
  }): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setSession(data);
    return data;
  }

  static async getMe(): Promise<AuthResponse['user']> {
    return this.request<AuthResponse['user']>('/auth/me');
  }

  static async checkBackendHealth(): Promise<boolean> {
    try {
      const res = await fetch('http://127.0.0.1:8000/', { method: 'GET', signal: AbortSignal.timeout(1500) });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- CAT Engine Endpoints ---
  static async evaluateCAT(responses: { question_id: string; is_correct: boolean; topic: string }[]) {
    return this.request<{
      theta: number;
      standard_error: number;
      confidence_interval: [number, number];
      mastery_level: string;
      topic_breakdown: Record<string, number>;
      next_recommended_question_id: string;
    }>('/cat/evaluate', {
      method: 'POST',
      body: JSON.stringify({ responses }),
    });
  }

  // --- Knowledge Graph DAG Endpoints ---
  static async getDAGGraph() {
    return this.request<any>('/dag/graph');
  }

  static async inspectDAGBlocker(nodeId: string) {
    return this.request<any>(`/dag/inspect-blocker?node_id=${encodeURIComponent(nodeId)}`);
  }

  // --- Faculty Triage & Interventions ---
  static async getFacultyCohort() {
    return this.request<any>('/faculty/cohort/triage');
  }

  static async executeIntervention(payload: {
    intervention_type: 'MICRO_BRIDGE' | 'AI_TA_OFFICE_HOUR' | 'PARENT_STUDENT_NUDGE';
    student_ids: string[];
    concept_key: string;
    note?: string;
  }) {
    return this.request<any>('/faculty/intervene', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}
