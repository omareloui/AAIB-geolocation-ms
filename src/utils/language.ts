import { AVAILABLE_LANGUAGES } from '../config/constants';
import { Request } from 'express';
import {
  Atm,
  AtmWDistance,
  Language,
  ProvidedAtm,
  ProvidedAtmWDistance,
} from '../types';

export function getLanguage(text: string): Language | undefined {
  const regex = new RegExp(`\\b(${AVAILABLE_LANGUAGES.join('|')})\\b`);
  const match = text.match(regex);
  return match ? (match[1] as Language) : undefined;
}

export function isAvailableLanguage(lang: string): lang is Language {
  return AVAILABLE_LANGUAGES.some((x) => x === lang);
}

export function resolveLanguage<T extends Atm | AtmWDistance>(
  atm: T,
  lang: Language,
): T extends AtmWDistance ? ProvidedAtmWDistance : ProvidedAtm {
  // eslint-disable-next-line
  // @ts-ignore: has to ignore it because of the sucky type system
  return {
    ...atm,
    name: atm.name[lang],
    location: atm.location[lang],
    governorateName: atm.governorateName[lang],
  };
}

export function resolveLanguageFormHeaderValue<T extends Atm | AtmWDistance>(
  atm: T,
  headerValue: string | undefined,
): T extends AtmWDistance ? ProvidedAtmWDistance : ProvidedAtm {
  return resolveLanguage(atm, parseLanguageFromHeaders(headerValue));
}

export function getLanguageHeader(req: Request) {
  return req.headers['accept-language'];
}

export function parseLanguageFromHeaders(
  headerValue: string | undefined,
): Language {
  return getLanguage(headerValue?.toLowerCase() || 'en')!;
}
