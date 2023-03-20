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
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  AtmApiBadRequestResponse,
  AtmApiNotFoundResponse,
  AtmWDistanceApiOkResponse,
} from 'src/documentations/atm.docs';

@ApiHeader({
  name: 'Accept-Language',
  description:
    'Takes the language from this header if not specified explicitly.',
})
@Controller('nearest')
export class NearestController {
  constructor(
    private nearestService: NearestService,
    private atmService: AtmService,
  ) {}

  @ApiOkResponse({
    description:
      'Returns the atms in the range of the specified location (if passed no longitude or latitude will retrieve all atms).',
    type: [AtmWDistanceApiOkResponse],
  })
  @ApiQuery({
    name: 'longitude',
    description: 'Define the longitude',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'latitude',
    description: 'Define the latitude',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'lat',
    description: 'Same as "latitude" priority for latitude.',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'long',
    description: 'Same as "longitude" priority for longitude.',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'range',
    description: 'Specify the rage (defaults to 5).',
    required: false,
    type: 'number',
  })
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

  @ApiOkResponse({
    description: 'Returns the atms in the range of that atm id.',
    type: [AtmWDistanceApiOkResponse],
  })
  @ApiNotFoundResponse({
    description: "Didn't find the specified atm id.",
    type: AtmApiNotFoundResponse,
  })
  @ApiBadRequestResponse({
    description: "Can't parse the numeric id",
    type: AtmApiBadRequestResponse,
  })
  @Get(':id')
  getNearestWAtmId(@Param('id', ParseIntPipe) id: number) {
    return this.nearestService.getNearestByAtmId(id);
  }
}
