import { ATM_FUNCTIONALITY, ATM_TYPES } from '../../../config/constants';
import { z } from 'zod';

const LanguageObject = z
  .object({
    ar: z.string().optional(),
    en: z.string().optional(),
  })
  .optional();

const RequiredLanguateObject = z.object({ ar: z.string(), en: z.string() });

export const UpdateAtmDtoSchema = z.object({
  name: LanguageObject,
  location: LanguageObject,
  governorateName: LanguageObject,

  googleLatitude: z.number().positive().optional(),
  googleLongitude: z.number().positive().optional(),

  type: z.enum(ATM_TYPES).optional(),
  functionality: z
    .enum(ATM_FUNCTIONALITY)
    .or(z.array(z.enum(ATM_FUNCTIONALITY)))
    .optional(),
});

export type UpdateAtmDto = z.infer<typeof UpdateAtmDtoSchema>;

export const CreateAtmDtoSchema = z.object({
  sr: z.number(),
  atmId: z.number(),

  name: RequiredLanguateObject,
  location: RequiredLanguateObject,
  governorateName: RequiredLanguateObject,

  googleLatitude: z.number().positive(),
  googleLongitude: z.number().positive(),

  type: z.enum(ATM_TYPES),
  functionality: z
    .enum(ATM_FUNCTIONALITY)
    .or(z.array(z.enum(ATM_FUNCTIONALITY))),
});

export type CreateAtmDto = z.infer<typeof CreateAtmDtoSchema>;
