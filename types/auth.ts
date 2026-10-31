/**
 * GridMind Authentication & User Identity Domain Types
 * Defines strict interfaces for authentication flows, user profiles,
 * and provider integration boundaries.
 */

export type UserRole = "facility_manager" | "energy_engineer" | "operator" | "auditor";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  siteId: string;
  isMockUser: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
  isMockAuth: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  isMockResponse: boolean;
}

/**
 * Authentication Service Boundary
 * Implemented by both MockAuthService and future ApiAuthService (FastAPI/Supabase).
 */
export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  signup(credentials: SignupCredentials): Promise<AuthResult>;
  loginWithGoogle(): Promise<AuthResult>;
  requestPasswordReset(email: string): Promise<PasswordResetResponse>;
  getCurrentUser(): Promise<AuthUser | null>;
  logout(): Promise<void>;
  isGoogleConfigured(): boolean;
}

/**
 * Documentation of OAuth / OIDC Provider Requirements
 * For alignment with the backend FastAPI / Supabase team.
 */
export interface AuthProviderConfigDoc {
  provider: "supabase_auth" | "fastapi_oauth2";
  googleOidcEnabled: boolean;
  tokenStorageStrategy: "httpOnly_cookie" | "jwt_bearer";
  sessionDurationDays: number;
}
