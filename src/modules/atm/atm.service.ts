import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AVAILABLE_LANGUAGES } from '../../config/constants';
import { Atm, I18NObject, Language, ProvidedAtm } from '../../types';
import { getLanguage } from '../../utils/language';
import { DatabaseService } from '../database/database.service';
import { FilterOptions } from '../filter/filter.service';
import { NearestService } from '../nearest/nearest.service';
import { CreateAtmDto, UpdateAtmDto } from './dto/atm.dto';

type ResultOptions = { headerLang?: string | undefined };

@Injectable()
export class AtmService {
  constructor(
    private databaseService: DatabaseService,
    private nearestService: NearestService,
  ) {}

  find(filterOptions: FilterOptions, options: ResultOptions = {}) {
    const lang: Language =
      filterOptions.language ||
      this.parseLanguageFromHeaders(options.headerLang);

    const filterDB = this.databaseService.find(filterOptions);

    return filterDB.map((x) => this.resolveLanguage(x, lang));
  }

  findById(id: number, options: ResultOptions = {}) {
    const atm = this.databaseService.findById(id);
    if (!atm)
      throw new HttpException(
        { message: `Can't find the atm record for atmId '${id}'` },
        HttpStatus.NOT_FOUND,
      );

    return this.resolveLanguage(
      atm,
      this.parseLanguageFromHeaders(options.headerLang),
    );
  }

  getNearest(id: number, range = 5, options: ResultOptions) {
    const nearest = this.nearestService.getNearestByAtmId(id, range);
    return nearest.map((x) =>
      this.resolveLanguage(
        x,
        this.parseLanguageFromHeaders(options.headerLang),
      ),
    );
  }

  async deleteById(id: number, options: ResultOptions = {}) {
    const res = await this.databaseService.deleteEntryById(id);
    if (!res.isDeleted)
      throw new HttpException(
        { message: `Can't find the atm record for atmId '${id}'` },
        HttpStatus.NOT_FOUND,
      );

    return {
      isDeleted: res.isDeleted,
      deletedItem: this.resolveLanguage(
        res.deletedItem,
        this.parseLanguageFromHeaders(options.headerLang),
      ),
    };
  }

  async update(
    id: number,
    updateAtmDto: UpdateAtmDto,
    options: ResultOptions = {},
  ) {
    const I18N_FIELDS = ['name', 'location', 'governorateName'] as const;

    const atmToUpdate = this.databaseService.findById(id);

    if (!atmToUpdate)
      throw new HttpException(
        {
          message: `Can't find the atm record for atmId '${id}'`,
        },
        HttpStatus.NOT_FOUND,
      );

    const clonedAtm: Atm = JSON.parse(JSON.stringify(atmToUpdate));

    Object.keys(clonedAtm).forEach((key) => {
      const k = key as keyof typeof clonedAtm;

      if (
        k === 'functionality' &&
        'functionality' in updateAtmDto &&
        typeof updateAtmDto.functionality === 'string'
      ) {
        clonedAtm.functionality = [updateAtmDto.functionality];
      } else if (['name', 'location', 'governorateName'].some((x) => x === k)) {
        AVAILABLE_LANGUAGES.forEach((lang) => {
          if (
            lang in (clonedAtm[k] as I18NObject) &&
            k in updateAtmDto &&
            lang in updateAtmDto[k as (typeof I18N_FIELDS)[number]]!
          )
            clonedAtm[k as (typeof I18N_FIELDS)[number]]![lang] = updateAtmDto[
              k as (typeof I18N_FIELDS)[number]
            ]![lang] as string;
        });
      } else {
        if (k in updateAtmDto) (clonedAtm[k] as I18NObject) = updateAtmDto[k]!;
      }
    });

    await this.databaseService.updateEntry(id, clonedAtm);

    return this.resolveLanguage(
      this.databaseService.findById(id)!,
      this.parseLanguageFromHeaders(options.headerLang),
    );
  }

  async create(createAtmDto: CreateAtmDto, options: ResultOptions = {}) {
    const newAtm: Omit<Atm, 'sr'> = {
      ...createAtmDto,
      functionality:
        typeof createAtmDto.functionality === 'string'
          ? [createAtmDto.functionality]
          : createAtmDto.functionality,
    };
    const inserted = await this.databaseService.insertEntry(newAtm);
    return this.resolveLanguage(
      inserted,
      this.parseLanguageFromHeaders(options.headerLang),
    );
  }

  private parseLanguageFromHeaders(headerValue: string | undefined): Language {
    return getLanguage(headerValue?.toLowerCase() || 'en')!;
  }

  private resolveLanguage(atm: Atm, lang: Language): ProvidedAtm {
    return {
      ...atm,
      name: atm.name[lang],
      location: atm.location[lang],
      governorateName: atm.governorateName[lang],
    };
  }
}
