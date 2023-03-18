import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { NearestService } from './nearest.service';

import errors from '../../config/errors';

@Controller('nearest')
export class NearestController {
  constructor(private nearestService: NearestService) {}

  @Get()
  getNearest(
    @Query('long') long: string,
    @Query('longitude') longitude: string,
    @Query('lat') lat: string,
    @Query('latitude') latitude: string,
    @Query('range') range: string,
  ) {
    const finalLong = parseFloat(longitude || long);
    const finalLat = parseFloat(latitude || lat);

    if (
      !finalLong ||
      !finalLat ||
      Number.isNaN(finalLong) ||
      Number.isNaN(finalLat)
    )
      throw new BadRequestException(errors.validationFailed);

    let finalRange = 5;
    const parsedRange: number = parseInt(range, 10);

    if (parsedRange && !Number.isNaN(parsedRange)) finalRange = parsedRange;

    return this.nearestService.getNearest(
      { googleLatitude: finalLat, googleLongitude: finalLong },
      finalRange,
    );
  }

  @Get(':id')
  getNearestWAtmId(@Param('id', ParseIntPipe) id: number) {
    return this.nearestService.getNearestByAtmId(id);
  }
}
