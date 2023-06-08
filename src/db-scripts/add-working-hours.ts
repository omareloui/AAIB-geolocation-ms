import { readFile, writeFile } from 'node:fs/promises';
import xlsx from 'node-xlsx';

import config from '../config/config';
import { main as regenerateDB } from './restructure-db';

import type { Atms } from '../types';

const DEFAULT_WORKING_HOURS =
  'From 08:30 am till 03:00 pm - Sunday to Thursday';

async function main() {
  const db = (await getDB()) as Atms;
  const xlsxFileLocation = config().database.branchesWorkingHours;

  const parsedExcel = xlsx.parse(xlsxFileLocation);
  const sanitizedParsedData = parsedExcel[0].data.filter(
    (x, i) => i !== 0 && x.length > 0,
  );

  for (const entry of db) {
    if (entry.type !== 'Branch' || entry.workingHours) continue;
    const searchResult = sanitizedParsedData.filter((x) => {
      const [, branch] = x;
      return new RegExp(branch, 'i').test(
        entry.name.en.replace(/branch\.?/i, '').trim(),
      );
    });

    if (searchResult.length === 0) {
      entry.workingHours = DEFAULT_WORKING_HOURS;
      continue;
    }

    if (searchResult.length === 1) {
      entry.workingHours = searchResult[0][4];
      continue;
    }

    if (searchResult.length > 1) {
      const moreAccurateMatch = searchResult
        .map((x) => [x[1].length, x])
        .sort((x1, x2) => x2[0] - x1[0])[0][1];
      entry.workingHours = moreAccurateMatch[4];
      continue;
    }
  }

  await writeFile(
    config().database.withBranchesWorkingHours,
    JSON.stringify(db),
    { encoding: 'utf-8' },
  );
}

async function getDB() {
  const dbUrl = config().database.url;
  try {
    return JSON.parse(await readFile(dbUrl, { encoding: 'utf-8' }));
  } catch (e) {
    await regenerateDB();
    return JSON.parse(await readFile(dbUrl, { encoding: 'utf-8' }));
  }
}

if (require.main === module) main();
