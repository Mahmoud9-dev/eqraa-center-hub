/**
 * @deprecated Import from '@/lib/i18n' instead.
 * This file is kept as a backward-compatibility shim so existing
 * consumers that import { Language, Translations, translations }
 * from '@/lib/translations' continue to work without changes.
 */
export type { Language } from './i18n/types';
export type { Translations } from './i18n/index';
export { translations } from './i18n/index';
