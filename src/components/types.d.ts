import React from 'react';

interface LoginFormProps {
    onSubmit: (email: string, password: string, rememberMe: boolean) => void;
    isLoading: boolean;
    error: string | null;
    onForgotPassword: () => void;
    onRegister: () => void;
}

interface RegisterFormMultiStepProps {
    onSubmit: (data: {
      email: string;
      password: string;
      confirmPassword: string;
      name: string;
      role: 'power_unit' | 'multiple_units';
      companyId?: string;
      vehicleId?: string;
      vehicleType?: string;
      vehicleTireCount?: number;
      trailers?: Array<{ id: string; tireCount: number }>;
    }) => void;
    isLoading: boolean;
    error: string | null;
    onBackToLogin: () => void;
  }
  
interface RegisterLayoutProps {
    children: React.ReactNode;
    onBack: () => void;
    title: string;
    subtitle: string;
    progressPercentage: number;
    progressText: string;
    footerButton?: {
      label: string;
      onPress: () => void;
      disabled?: boolean;
      loading?: boolean;
    };
    isLoading?: boolean;
  }

interface RegisterSetupProps {
    onComplete: (data: {
        role: "power_unit" | "multiple_units";
        vehicleName?: string;
        towingType?: string;
        axleTowingType?: string;
        towables?: Array<{
        id: string;
        name: string;
        type: string;
        axle: string;
        tireCount: number;
        }>;
    }) => void;
    onBack: () => void;
    isLoading: boolean;
    error: string | null;
    initialData?: {
        role: "power_unit" | "multiple_units";
        vehicleName?: string;
        towingType?: string;
        axleTowingType?: string;
        towables?: Array<{
        id: string;
        name: string;
        type: string;
        axle: string;
        tireCount: number;
        }>;
    } | null;
}
  
interface RegisterSummaryProps {
    onNext: () => void;
    onBack: () => void;
    isLoading: boolean;
    error: string | null;
    setupData: {
    role: "power_unit" | "multiple_units";
    vehicleName?: string;
    towingType?: string;
    axleTowingType?: string;
    towables?: Array<{
        id: string;
        name: string;
        type: string;
        axle: string;
        tireCount: number;
    }>;
    };
}

interface RegisterSyncSensorProps {
    onComplete: () => void;
    onBack: () => void;
    isLoading: boolean;
    error: string | null;
    setupData: {
      role: 'power_unit' | 'multiple_units';
      vehicleName?: string;
      towingType?: string;
      axleTowingType?: string;
      towables?: Array<{
        id: string;
        name: string;
        type: string;
        axle: string;
        tireCount: number;
      }>;
    };
  }

interface RegisterUserProps {
    onNext: (data: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => void;
    isLoading: boolean;
    error: string | null;
    onBackToLogin: () => void;
  }

interface BadgeProps {
  text: string;
  isConnected: boolean;
  style?: any;
}