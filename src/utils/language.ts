import { AVAILABLE_LANGUAGES } from '../config/constants';
import { Language } from '../types';

export function getLanguage(text: string): Language | undefined {
  const regex = new RegExp(`\\b(${AVAILABLE_LANGUAGES.join('|')})\\b`);
  const match = text.match(regex);
  return match ? (match[1] as Language) : undefined;
}

export function isAvailableLanguage(lang: string): lang is Language {
  return AVAILABLE_LANGUAGES.some((x) => x === lang);
}
