import type { Language } from './types';

export interface SuggestionsTranslations {
  pageTitle: string;
  form: {
    title: string;
    suggestionTitle: string;
    titlePlaceholder: string;
    details: string;
    detailsPlaceholder: string;
    submitter: string;
    submitterPlaceholder: string;
    priority: string;
    submit: string;
    submitting: string;
  };
  priorityLabels: Record<string, string>;
  statusLabels: Record<string, string>;
  list: {
    title: string;
    empty: string;
    submittedBy: string;
  };
  toast: {
    loadError: string;
    addError: string;
    addSuccess: string;
    updateStatusError: string;
    updateStatusSuccess: string;
  };
}

export const suggestions: Record<Language, SuggestionsTranslations> = {
  ar: {
    pageTitle: 'المقترحات والمشكلات',
    form: {
      title: 'إضافة مقترح جديد',
      suggestionTitle: 'عنوان المقترح',
      titlePlaceholder: 'أدخل عنوان المقترح',
      details: 'التفاصيل',
      detailsPlaceholder: 'اشرح المقترح أو المشكلة بالتفصيل',
      submitter: 'مقدم المقترح (اختياري)',
      submitterPlaceholder: 'اسم مقدم المقترح',
      priority: 'الأولوية',
      submit: 'إضافة المقترح',
      submitting: 'جاري الإضافة...',
    },
    priorityLabels: {
      'عالي': 'عالي',
      'متوسط': 'متوسط',
      'منخفض': 'منخفض',
    },
    statusLabels: {
      'تم': 'تم',
      'لم يتم': 'لم يتم',
    },
    list: {
      title: 'المقترحات المسجلة',
      empty: 'لا توجد مقترحات بعد. ابدأ بإضافة أول مقترح!',
      submittedBy: 'مقدم من:',
    },
    toast: {
      loadError: 'خطأ في تحميل المقترحات',
      addError: 'خطأ في إضافة المقترح',
      addSuccess: 'تم إضافة المقترح بنجاح',
      updateStatusError: 'خطأ في تحديث الحالة',
      updateStatusSuccess: 'تم تحديث الحالة بنجاح',
    },
  },
  en: {
    pageTitle: 'Suggestions & Issues',
    form: {
      title: 'Add New Suggestion',
      suggestionTitle: 'Suggestion Title',
      titlePlaceholder: 'Enter suggestion title',
      details: 'Details',
      detailsPlaceholder: 'Describe the suggestion or issue in detail',
      submitter: 'Submitted By (optional)',
      submitterPlaceholder: 'Name of submitter',
      priority: 'Priority',
      submit: 'Add Suggestion',
      submitting: 'Adding...',
    },
    priorityLabels: {
      'عالي': 'High',
      'متوسط': 'Medium',
      'منخفض': 'Low',
    },
    statusLabels: {
      'تم': 'Done',
      'لم يتم': 'Not Done',
    },
    list: {
      title: 'Registered Suggestions',
      empty: 'No suggestions yet. Start by adding the first one!',
      submittedBy: 'Submitted by:',
    },
    toast: {
      loadError: 'Failed to load suggestions',
      addError: 'Failed to add suggestion',
      addSuccess: 'Suggestion added successfully',
      updateStatusError: 'Failed to update status',
      updateStatusSuccess: 'Status updated successfully',
    },
  },
};
