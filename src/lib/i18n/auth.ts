import type { Language } from './types';

export interface AuthTranslations {
  login: {
    title: string;
    welcome: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    rememberMe: string;
    forgotPassword: string;
    submitButton: string;
    submitting: string;
    noAccount: string;
    signupLink: string;
    error: string;
    success: string;
  };
  signup: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    submitButton: string;
    submitting: string;
    hasAccount: string;
    loginLink: string;
    error: string;
    success: string;
    passwordMismatch: string;
    passwordTooShort: string;
    showPassword: string;
    hidePassword: string;
  };
  branding: {
    appName: string;
    tagline: string;
    copyright: string;
    allRightsReserved: string;
  };
  logout: string;
  logoutError: string;
  logoutSuccess: string;
}

export const auth: Record<Language, AuthTranslations> = {
  ar: {
    login: {
      title: 'تسجيل الدخول',
      welcome: 'مرحباً بعودتك',
      subtitle: 'أدخل بياناتك للوصول إلى حسابك',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'example@domain.com',
      passwordLabel: 'كلمة المرور',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور؟',
      submitButton: 'دخول',
      submitting: 'جارٍ الدخول...',
      noAccount: 'ليس لديك حساب؟',
      signupLink: 'إنشاء حساب',
      error: 'خطأ في تسجيل الدخول',
      success: 'تم تسجيل الدخول بنجاح',
    },
    signup: {
      title: 'إنشاء حساب جديد',
      nameLabel: 'الاسم',
      namePlaceholder: 'أدخل اسمك الكامل',
      emailLabel: 'البريد الإلكتروني',
      passwordLabel: 'كلمة المرور',
      confirmPasswordLabel: 'تأكيد كلمة المرور',
      submitButton: 'إنشاء حساب',
      submitting: 'جارٍ إنشاء الحساب...',
      hasAccount: 'لديك حساب بالفعل؟',
      loginLink: 'تسجيل الدخول',
      error: 'خطأ في إنشاء الحساب',
      success: 'تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن',
      passwordMismatch: 'كلمة المرور غير متطابقة',
      passwordTooShort: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
      showPassword: 'إظهار كلمة المرور',
      hidePassword: 'إخفاء كلمة المرور',
    },
    branding: {
      appName: 'إقراء',
      tagline: 'منصة متكاملة لإدارة حلقات تحفيظ القرآن الكريم ومتابعة تقدم الطلاب وتسهيل العملية التعليمية',
      copyright: '© {year} إقراء',
      allRightsReserved: 'جميع الحقوق محفوظة',
    },
    logout: 'خروج',
    logoutError: 'خطأ في تسجيل الخروج',
    logoutSuccess: 'تم تسجيل الخروج بنجاح',
  },
  en: {
    login: {
      title: 'Sign In',
      welcome: 'Welcome back',
      subtitle: 'Enter your credentials to access your account',
      emailLabel: 'Email',
      emailPlaceholder: 'example@domain.com',
      passwordLabel: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      submitButton: 'Sign In',
      submitting: 'Signing in...',
      noAccount: "Don't have an account?",
      signupLink: 'Sign up',
      error: 'Login failed',
      success: 'Logged in successfully',
    },
    signup: {
      title: 'Create Account',
      nameLabel: 'Name',
      namePlaceholder: 'Enter your full name',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      confirmPasswordLabel: 'Confirm Password',
      submitButton: 'Create Account',
      submitting: 'Creating account...',
      hasAccount: 'Already have an account?',
      loginLink: 'Sign in',
      error: 'Sign up failed',
      success: 'Account created successfully! You can sign in now',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
    },
    branding: {
      appName: 'Eqraa',
      tagline: 'A comprehensive platform for managing Quran memorization circles, tracking student progress, and streamlining the educational process',
      copyright: '© {year} Eqraa',
      allRightsReserved: 'All rights reserved',
    },
    logout: 'Logout',
    logoutError: 'Logout failed',
    logoutSuccess: 'Logged out successfully',
  },
};
