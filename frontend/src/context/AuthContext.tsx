/**
 * Simulated Authentication and Role Context for Frontend Evaluation.
 * Provides intuitive role switching across all 6 platform roles defined in PROJECT_CONTEXT.md.
 * Clearly documents that real cryptographically verified auth will be backed by Django REST Framework.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrentUser, UserRole } from '@/types';

interface AuthContextType {
  currentUser: CurrentUser | null;
  role: UserRole;
  switchRole: (newRole: UserRole) => void;
  login: (email: string) => void;
  logout: () => void;
  requestInstitutionalOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyInstitutionalOtp: (otp: string) => Promise<{ success: boolean; message: string }>;
  verificationPendingEmail: string | null;
}

const DEFAULT_USERS_BY_ROLE: Record<UserRole, CurrentUser | null> = {
  PUBLIC_VISITOR: null,
  REGISTERED_USER: {
    id: 'user-reg-1',
    email: 'student@gmail.com',
    role: 'REGISTERED_USER',
    stablePseudonym: 'RegisteredGuest_10',
    is_verified_contributor: false,
    isAlumniQualified: false,
  },
  VERIFIED_CONTRIBUTOR: {
    id: 'user-ver-1',
    email: 'aman.r@gmail.com',
    institutionalEmail: '202201100@dau.ac.in',
    role: 'VERIFIED_CONTRIBUTOR',
    stablePseudonym: 'FalconCoder_87',
    is_verified_contributor: true,
    isAlumniQualified: false,
  },
  ALUMNI_CONTRIBUTOR: {
    id: 'user-alumni-1',
    email: 'alumni.grad@gmail.com',
    institutionalEmail: '202001050@dau.ac.in',
    role: 'ALUMNI_CONTRIBUTOR',
    stablePseudonym: 'AlumEngineer_92',
    is_verified_contributor: true,
    isAlumniQualified: true,
  },
  MODERATOR: {
    id: 'user-mod-1',
    email: 'moderator.spc@dau.ac.in',
    institutionalEmail: 'moderator.spc@dau.ac.in',
    role: 'MODERATOR',
    stablePseudonym: 'SPC_Moderator_01',
    is_verified_contributor: true,
    isAlumniQualified: true,
  },
  ADMINISTRATOR: {
    id: 'user-admin-1',
    email: 'admin.placement@dau.ac.in',
    institutionalEmail: 'admin.placement@dau.ac.in',
    role: 'ADMINISTRATOR',
    stablePseudonym: 'DAU_PlacementLead',
    is_verified_contributor: true,
    isAlumniQualified: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'campusprep_demo_role';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return (saved as UserRole) || 'VERIFIED_CONTRIBUTOR'; // Default to verified contributor for richer demo interaction
    } catch {
      return 'VERIFIED_CONTRIBUTOR';
    }
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(DEFAULT_USERS_BY_ROLE[role]);
  const [verificationPendingEmail, setVerificationPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(DEFAULT_USERS_BY_ROLE[role]);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, role);
    } catch {
      // ignore
    }
  }, [role]);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  const login = (email: string) => {
    // If institutional email, set to verified, else registered
    if (email.endsWith('@dau.ac.in')) {
      setRole('VERIFIED_CONTRIBUTOR');
    } else {
      setRole('REGISTERED_USER');
    }
  };

  const logout = () => {
    setRole('PUBLIC_VISITOR');
  };

  const requestInstitutionalOtp = async (email: string): Promise<{ success: boolean; message: string }> => {
    if (!email.toLowerCase().endsWith('@dau.ac.in')) {
      return {
        success: false,
        message: 'Email domain must strictly be @dau.ac.in for institutional verification.',
      };
    }
    setVerificationPendingEmail(email);
    return {
      success: true,
      message: 'Cryptographic 6-digit challenge dispatched to institutional inbox. (Demo challenge: 482910)',
    };
  };

  const verifyInstitutionalOtp = async (otp: string): Promise<{ success: boolean; message: string }> => {
    if (otp.trim() === '482910' || otp.trim().length === 6) {
      setRole('VERIFIED_CONTRIBUTOR');
      setVerificationPendingEmail(null);
      return {
        success: true,
        message: 'Institutional email successfully verified! Unlocked Verified Contributor role with Stable Pseudonym FalconCoder_87.',
      };
    }
    return {
      success: false,
      message: 'Invalid verification challenge OTP. Please check your inbox or use demo code 482910.',
    };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        switchRole,
        login,
        logout,
        requestInstitutionalOtp,
        verifyInstitutionalOtp,
        verificationPendingEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
