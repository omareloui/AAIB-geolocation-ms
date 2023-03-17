import { writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AVAILABLE_LANGUAGES } from '../../config/constants';
import { Atm, AtmFunctionality, Atms, AtmType, Language } from '../../types';
import { sanatizeForRegex } from '../../utils/regex';
import { FilterOptions } from '../filter/filter.service';

type InputOption =
  | Language
  | AtmType
  | AtmFunctionality
  | string
  | number
  | undefined;

type UpdateOptions = { save: boolean };

@Injectable()
export class DatabaseService {
  private url: string;
  private db: Atms;
  private lastSr: number;

  constructor(private config: ConfigService) {
    this.url = this.config.getOrThrow<string>('database.url');
    const file = readFileSync(this.url, {
      encoding: 'utf-8',
    });

    if (!file)
      throw new Error(
        'Can\'t find the database file (you might need to run "npm run db:restructure")',
      );

    this.db = JSON.parse(file);
    this.lastSr = -Infinity;

    this.db.forEach((x) => {
      if (x.sr > this.lastSr) this.lastSr = x.sr;
    });
  }

  getAll() {
    return this.db;
  }

  find(options: FilterOptions): Atms {
    return this.db.filter((x) => {
      if (options.any)
        return Object.keys(options)
          .map((k: string) => compare(k as keyof typeof options))
          .some((x) => x);

      return Object.keys(options)
        .map((k: string) => compare(k as keyof typeof options))
        .every((x) => x);

      function compare(key: keyof typeof options): boolean {
        const value = options[key];

        const shouldIgnore = ['language', 'any'].some((x) => key === x);
        const hasLangFields = ['name', 'location', 'governorateName'].some(
          (x) => key === x,
        );
        const isArray = key === 'functionality';

        if (shouldIgnore) return !options.any;

        if (hasLangFields)
          return AVAILABLE_LANGUAGES.some((lang) => {
            const shouldMatch = x[key][lang];
            return compareValues(value as string, shouldMatch);
          });

        if (isArray)
          return x[key].some((shouldMatch: string) => {
            return compareValues(value as string, shouldMatch);
          });

        return compareValues(value as string | number, x[key]);
      }

      function compareValues<T extends InputOption>(
        value: T,
        shouldMatch: T,
      ): boolean {
        if (
          (typeof value === 'number' || typeof value === 'boolean') &&
          value === shouldMatch
        )
          return true;

        const regex = new RegExp(
          sanatizeForRegex(value?.toString() || ''),
          'i',
        );
        if (typeof value === 'string' && (shouldMatch as string).match(regex))
          return true;

        return false;
      }
    });
  }

  findById(atmId: number): Atm | undefined {
    return this.db.find((x) => x.atmId === atmId);
  }

  async updateEntry(
    atmId: number,
    newObject: Atm,
    options: UpdateOptions = { save: true },
  ) {
    this.db = this.db.map((x) => {
      if (x.atmId === atmId)
        return {
          ...newObject,
          sr: x.sr,
          atmId: x.atmId,
        };
      return x;
    });
    if (options.save) await this.save();
  }

  async insertEntry(
    atm: Omit<Atm, 'sr'>,
    options: UpdateOptions = { save: true },
  ): Promise<Atm> {
    const newSr = this.lastSr + 1;
    const newAtm: Atm = { ...atm, sr: newSr };
    this.db.push(newAtm);
    this.lastSr = newSr;
    if (options.save) await this.save();
    return newAtm;
  }

  async deleteEntryById(
    atmId: number,
    options: UpdateOptions = { save: true },
  ): Promise<{ isDeleted: false } | { isDeleted: true; deletedItem: Atm }> {
    const elToDelete = this.findById(atmId);
    if (!elToDelete) return { isDeleted: false };

    this.db = this.db.filter((x) => x.atmId !== atmId);

    if (options.save) await this.save();

    return { isDeleted: true, deletedItem: elToDelete };
  }

  save() {
    return writeFile(this.url, JSON.stringify(this.db));
  }
}