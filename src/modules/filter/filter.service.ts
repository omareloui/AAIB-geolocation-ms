import { Injectable } from '@nestjs/common';
import { ATM_FUNCTIONALITY, ATM_TYPES } from '../../config/constants';
import { AtmFunctionality, AtmType, Language } from '../../types';
import { getLanguage } from '../../utils/language';
import { getNumber } from '../../utils/numbers';
import { capitalize } from '../../utils/text-case';

type IncommingFilterOptions = Partial<{
  any: string | boolean;
  language: string;
  lang: string;
  name: string;
  location: string;
  loc: string;
  governorateName: string;
  gov: string;
  latitude: string | number;
  lat: string | number;
  longitude: string | number;
  long: string | number;
  functionality: string;
  function: string;
  sr: string | number;
  atmId: string | number;
  atm: string | number;
  type: string;
}>;

export type FilterOptions = Partial<{
  sr: number;
  atmId: number;
  name: string;
  location: string;
  governorateName: string;
  googleLatitude: number;
  googleLongitude: number;
  functionality: AtmFunctionality;
  language: Language;
  type: AtmType;
  any: boolean;
}>;

@Injectable()
export class FilterService {
  parseOptions(options: IncommingFilterOptions): FilterOptions {
    const filter: FilterOptions = {};

    if (typeof options.any === 'string')
      return this.parseOptions(
        this.populateAll(options.any, options.language || options.lang),
      );

    filter.any = options.any;

    filter.language = getLanguage(
      options.language?.toLowerCase() || options.lang?.toLowerCase() || 'en',
    );

    filter.sr = getNumber(options.sr || '');
    filter.atmId = getNumber(options.atmId || options.atm || '');

    filter.name = options.name;
    filter.location = options.location || options.loc;
    filter.governorateName = options.governorateName || options.gov;

    filter.googleLatitude = getNumber(options.latitude || options.lat || '', {
      isFloat: true,
    });
    filter.googleLongitude = getNumber(
      options.longitude || options.long || '',
      { isFloat: true },
    );

    filter.type = ATM_TYPES.some(
      (x) => x.toLowerCase() === options.type?.toLowerCase(),
    )
      ? (capitalize(options.type!) as AtmType)
      : undefined;

    filter.functionality = ATM_FUNCTIONALITY.some(
      (x) =>
        x.toLowerCase() === options.functionality?.toLowerCase() ||
        x.toLowerCase() === options.function?.toLowerCase(),
    )
      ? (capitalize(
          options.functionality || options.function!,
        ) as AtmFunctionality)
      : undefined;

    // Remove unused options
    Object.keys(filter).forEach((k) => {
      if (filter[k] === undefined) delete filter[k];
    });

    return filter;
  }

  private populateAll(
    value: IncommingFilterOptions[keyof IncommingFilterOptions],
    language: string | undefined,
  ): Omit<IncommingFilterOptions, 'any'> & { any: boolean } {
    return {
      language,
      sr: value as string | number,
      functionality: value?.toString(),
      atmId: value as string | number,
      latitude: value as string | number,
      longitude: value as string | number,
      governorateName: value?.toString(),
      name: value?.toString(),
      type: value?.toString(),
      location: value?.toString(),
      any: true,
    };
  }
}
