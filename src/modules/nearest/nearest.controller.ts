import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { NearestService } from './nearest.service';

import { ProvidedAtm, ProvidedAtmsWDistance } from '../../types';
import { AtmService } from '../atm/atm.service';
import {
  getLanguageHeader,
  resolveLanguageFormHeaderValue,
} from '../../utils/language';
import { Request } from 'express';

@Controller('nearest')
export class NearestController {
  constructor(
    private nearestService: NearestService,
    private atmService: AtmService,
  ) {}

  @Get()
  getNearest(
    @Req() req: Request,
    @Query('long') long: string,
    @Query('longitude') longitude: string,
    @Query('lat') lat: string,
    @Query('latitude') latitude: string,
    @Query('range') range: string,
  ): ProvidedAtmsWDistance | ProvidedAtm[] {
    const finalLong = parseFloat(longitude || long);
    const finalLat = parseFloat(latitude || lat);

    if (
      !finalLong ||
      !finalLat ||
      Number.isNaN(finalLong) ||
      Number.isNaN(finalLat)
    ) {
      return this.atmService.find();
    }

    let finalRange = 5;
    const parsedRange: number = parseInt(range, 10);

    if (parsedRange && !Number.isNaN(parsedRange)) finalRange = parsedRange;

    const nearest = this.nearestService.getNearest(
      { googleLatitude: finalLat, googleLongitude: finalLong },
      finalRange,
    );

    return nearest.map((x) =>
      resolveLanguageFormHeaderValue(x, getLanguageHeader(req)),
    );
  }

  @Get(':id')
  getNearestWAtmId(@Param('id', ParseIntPipe) id: number) {
    return this.nearestService.getNearestByAtmId(id);
  }
}
