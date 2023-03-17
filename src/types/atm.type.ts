import {
  AVAILABLE_LANGUAGES,
  ATM_TYPES,
  ATM_FUNCTIONALITY,
} from '../config/constants';

export type AtmType = (typeof ATM_TYPES)[number];

export type AtmFunctionality = (typeof ATM_FUNCTIONALITY)[number];

export type Language = (typeof AVAILABLE_LANGUAGES)[number];

export type I18NObject = { [lang in Language]: string };

export type Atm = {
  sr: number;
  atmId: number;
  name: I18NObject;
  location: I18NObject;
  governorateName: I18NObject;
  googleLatitude: number;
  googleLongitude: number;
  functionality: AtmFunctionality[];
  type: AtmType;
};

export type Atms = Atm[];

export type ProvidedAtm = {
  sr: number;
  atmId: number;
  name: string;
  location: string;
  governorateName: string;
  googleLatitude: number;
  googleLongitude: number;
  functionality: AtmFunctionality[];
  type: AtmType;
};

export type ProvidedAtms = {
  [language in Language]: ProvidedAtm[];
};
