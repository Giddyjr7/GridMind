import { envConfig } from "@/config/env";
import {
  IAuthService,
  LoginCredentials,
  SignupCredentials,
  AuthResult,
  AuthUser,
  PasswordResetResponse,
} from "@/types/auth";

/**
 * Mock User Profile for local demonstration
 * (Synthetic benchmark identity, clearly flagged as isMockUser: true)
 */
const DEMO_USER: AuthUser = {
  id: "usr_demo_facility_lead",
  email: "operator@krystalice.ng",
  fullName: "Engr. Tunde Adeyemi",
  role: "facility_manager",
  siteId: "site_krystal_ikeja_01",
  isMockUser: true,
  createdAt: "2024-01-15T08:00:00Z",
};

const simulateLatency = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockAuthService implements IAuthService {
  private currentUser: AuthUser | null = null;

  isGoogleConfigured(): boolean {
    return Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    await simulateLatency(400);

    const email = credentials.email.trim().toLowerCase();

    // Demonstration-mode validation
    if (!email || !credentials.password) {
      throw new Error("Email and password are required.");
    }

    if (!email.includes("@")) {
      throw new Error("Please enter a valid work email address.");
    }

    // Set demo user in memory without storing passwords anywhere
    const authenticatedUser: AuthUser = {
      ...DEMO_USER,
      email: email,
      fullName: email.startsWith("demo") ? "Demo Operations Lead" : DEMO_USER.fullName,
    };

    this.currentUser = authenticatedUser;

    return {
      success: true,
      user: authenticatedUser,
      token: "demo_mock_jwt_token_unauthenticated",
      message: "Signed in successfully using simulated facility credentials.",
      isMockAuth: true,
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResult> {
    await simulateLatency(450);

    const email = credentials.email.trim().toLowerCase();

    if (!credentials.fullName.trim()) {
      throw new Error("Full name is required.");
    }

    if (!email.includes("@")) {
      throw new Error("Please enter a valid work email address.");
    }

    if (!credentials.password || credentials.password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    if (credentials.password !== credentials.confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    if (!credentials.agreeToTerms) {
      throw new Error("You must agree to the Terms of Service and Privacy Policy.");
    }

    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      email: email,
      fullName: credentials.fullName.trim(),
      role: "facility_manager",
      siteId: "site_krystal_ikeja_01",
      isMockUser: true,
      createdAt: new Date().toISOString(),
    };

    this.currentUser = newUser;

    return {
      success: true,
      user: newUser,
      token: "demo_mock_signup_token",
      message: "Demo account initialized successfully.",
      isMockAuth: true,
    };
  }

  async loginWithGoogle(): Promise<AuthResult> {
    await simulateLatency(200);

    // Google Auth is not falsely simulated
    return {
      success: false,
      isMockAuth: true,
      message:
        "Google OAuth 2.0 / OIDC is not configured in this demonstration build. Connect a verified Google Client ID with the FastAPI/Supabase backend to enable one-click social authentication.",
    };
  }

  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    await simulateLatency(350);

    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }

    return {
      success: true,
      isMockResponse: true,
      message: `In a production deployment with verified SMTP/transactional mail (e.g. Resend/Postmark), a secure password reset link would be sent to "${email}". In this local demo, no email was dispatched.`,
    };
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.currentUser;
  }

  async logout(): Promise<void> {
    await simulateLatency(150);
    this.currentUser = null;
  }
}

export class ApiAuthService implements IAuthService {
  private baseUrl: string;
  private readonly tokenKey = "gridmind_api_session_token";

  constructor() {
    this.baseUrl = envConfig.apiBaseUrl;
  }

  isGoogleConfigured(): boolean {
    return Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Failed to authenticate with backend.");
    }

    const data = await response.json();
    this.storeToken(data.token, Boolean(credentials.rememberMe));
    return {
      success: true,
      user: data.user,
      token: data.token,
      isMockAuth: false,
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResult> {
    const response = await fetch(`${this.baseUrl}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create account with backend.");
    }

    const data = await response.json();
    this.storeToken(data.token, false);
    return {
      success: true,
      user: data.user,
      token: data.token,
      isMockAuth: false,
    };
  }

  async loginWithGoogle(): Promise<AuthResult> {
    if (!this.isGoogleConfigured()) {
      return {
        success: false,
        isMockAuth: false,
        message: "Google OAuth Client ID is not configured in backend environment.",
      };
    }
    // Redirect to backend OAuth2 initiation route
    window.location.href = `${this.baseUrl}/auth/google/authorize`;
    return { success: true, isMockAuth: false };
  }

  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Unable to request password reset.");
    }

    return response.json();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) return null;
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return response.json();
  }

  async logout(): Promise<void> {
    const token = this.getToken();
    await fetch(`${this.baseUrl}/auth/logout`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(this.tokenKey);
      window.localStorage.removeItem(this.tokenKey);
    }
  }

  private storeToken(token: string | undefined, rememberMe: boolean) {
    if (!token || typeof window === "undefined") return;
    window.sessionStorage.removeItem(this.tokenKey);
    window.localStorage.removeItem(this.tokenKey);
    const storage = rememberMe ? window.localStorage : window.sessionStorage;
    storage.setItem(this.tokenKey, token);
  }

  private getToken() {
    if (typeof window === "undefined") return null;
    return (
      window.sessionStorage.getItem(this.tokenKey) ||
      window.localStorage.getItem(this.tokenKey)
    );
  }
}

export const mockAuthService = new MockAuthService();
export const apiAuthService = new ApiAuthService();
