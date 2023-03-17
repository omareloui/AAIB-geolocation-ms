import url from 'node:url';
import { writeFile, readFile } from 'node:fs/promises';
import { atms } from './provided.db';
import type { Atm, Atms, Language, ProvidedAtms } from '../types';
import config from '../config/config';

export function getRestructured(providedAtms: ProvidedAtms): Atms {
  const atms: Atms = [];
  const languages = Object.keys(providedAtms) as Language[];

  for (const language of languages) {
    const lang = language as Language;
    const currentAtms = providedAtms[lang];

    currentAtms.forEach((x) => {
      const existingAtmIndex = atms.findIndex((y) => y.atmId === x.atmId);

      if (existingAtmIndex === -1)
        atms.push({
          sr: x.sr,
          atmId: x.atmId,
          googleLatitude: x.googleLatitude,
          googleLongitude: x.googleLongitude,
          functionality: x.functionality,
          // @ts-ignore
          name: {},
          // @ts-ignore
          location: {},
          // @ts-ignore
          governorateName: {},
          type: x.type,
        });

      setLanguageSpecificFields(atms.at(existingAtmIndex)!, lang, {
        name: x.name,
        location: x.location,
        governorateName: x.governorateName,
      });
    });
  }

  return atms;
}

function setLanguageSpecificFields(
  atm: Atm,
  lang: Language,
  values: { name: string; location: string; governorateName: string },
) {
  atm.name[lang] = values.name;
  atm.location[lang] = values.location;
  atm.governorateName[lang] = values.governorateName;
}

async function main() {
  const content = getRestructured(atms);
  const db = config().database.url;

  try {
    await readFile(db);
    console.log(
      '---------- The database already exists. If you want to override it you have to delete the old one first. ----------',
    );
  } catch (e) {
    // writeFile(db, JSON.stringify(content, null, 2));
    writeFile(db, JSON.stringify(content));
  }
}

if (require.main === module) main();
