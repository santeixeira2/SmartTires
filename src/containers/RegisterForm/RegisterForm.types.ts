export interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    role: 'user' | 'admin';
    companyId?: string;
    vehicleId?: string;
    vehicleType?: string;
    vehicleTireCount?: number;
    trailers?: Array<{ id: string; tireCount: number }>;
}

export interface RegisterContainerProps {
    onRegisterSuccess: () => void;
    onBackToLogin: () => void;
}

export interface RegisterFormProps {
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
  
export interface RegisterLayoutProps {
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

export interface RegisterSetupProps {
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
  
export interface RegisterSummaryProps {
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

export interface RegisterSyncSensorProps {
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

export interface RegisterUserProps {
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

export interface RegisterSetupProps {
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