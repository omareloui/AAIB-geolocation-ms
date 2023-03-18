import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AtmsWDistance } from 'src/types';
import { DatabaseService } from '../database/database.service';

type Location = { googleLatitude: number; googleLongitude: number };

@Injectable()
export class NearestService {
  constructor(private databaseService: DatabaseService) {}

  getNearest(location: Location, range = 5): AtmsWDistance {
    const filteredData: AtmsWDistance = [];

    this.databaseService.getAll().forEach((atm) => {
      const { googleLatitude, googleLongitude } = atm;
      const dist = this.calculateDistance(
        { googleLatitude, googleLongitude },
        location,
      );

      if (Number(dist) <= range)
        filteredData.push({ ...atm, distance: Number(dist.toFixed(1)) });
    });

    return filteredData.sort((x1, x2) => x1.distance - x2.distance);
  }

  getNearestByAtmId(atmId: number, range = 5) {
    const atm = this.databaseService.findById(atmId);
    if (!atm)
      throw new HttpException("Can't find the atm", HttpStatus.NOT_FOUND);
    const { googleLongitude, googleLatitude } = atm;
    return this.getNearest({ googleLongitude, googleLatitude }, range);
  }

  private calculateDistance(loc1: Location, loc2: Location): number {
    const isSameLocation =
      loc1.googleLongitude === loc2.googleLongitude &&
      loc1.googleLatitude === loc2.googleLatitude;

    if (isSameLocation) return 0;

    const radLat1 = (Math.PI * loc1.googleLatitude) / 180;
    const radLat2 = (Math.PI * loc2.googleLatitude) / 180;
    const theta = loc1.googleLongitude - loc2.googleLongitude;
    const radTheta = (Math.PI * theta) / 180;

    let dist =
      Math.sin(radLat1) * Math.sin(radLat2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);

    dist = Math.acos(dist);

    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344;

    return dist;
  }
}
