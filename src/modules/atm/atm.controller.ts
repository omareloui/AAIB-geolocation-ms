import {
  Controller,
  Req,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { FilterService } from '../filter/filter.service';
import { AtmService } from './atm.service';
import { getLanguageHeader } from '../../utils/language';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  ATM_FUNCTIONALITY,
  ATM_TYPES,
  AVAILABLE_LANGUAGES,
} from 'src/config/constants';
import {
  AtmApiBadRequestResponse,
  AtmApiNotFoundResponse,
  AtmApiOkResponse,
  AtmWDistanceApiOkResponse,
} from '../../documentations/atm.docs';

@ApiHeader({
  name: 'Accept-Language',
  description:
    'Takes the language from this header if not specified explicitly.',
})
@Controller('atm')
export class AtmController {
  constructor(
    private atmService: AtmService,
    private filterService: FilterService,
  ) {}

  @ApiOkResponse({
    description: "Get all atms if didn't add filters.",
    type: [AtmApiOkResponse],
  })
  @ApiQuery({
    name: 'lat',
    description: 'Filter by the latitude property.',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'long',
    description: 'Filter by the longitude property.',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'function',
    description: 'Filter by the functionality property.',
    required: false,
    enum: ATM_FUNCTIONALITY,
  })
  @ApiQuery({
    name: 'type',
    description: 'Filter by the type property.',
    required: false,
    enum: ATM_TYPES,
  })
  @ApiQuery({
    name: 'gov',
    description: 'Filter by the governorateName property.',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'location',
    description: 'Filter by the location property.',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'name',
    description: 'Filter by the name property.',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'sr',
    description: 'Filter by the sr property.',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'atmId',
    description: 'Filter by the atmId property.',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'any',
    description: 'Filter by any property on the atms.',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'lang',
    description: 'Specify the language explicitly.',
    enum: AVAILABLE_LANGUAGES,
    required: false,
  })
  @Get()
  get(@Req() req: Request) {
    return this.atmService.find(this.filterService.parseOptions(req.query), {
      headerLang: getLanguageHeader(req),
    });
  }

  @ApiOkResponse({
    description: 'Gets the atm with that id',
    type: AtmApiOkResponse,
  })
  @ApiNotFoundResponse({
    description: "Didn't find the specified atm id.",
    type: AtmApiNotFoundResponse,
  })
  @ApiBadRequestResponse({
    description: "Can't parse the numeric id",
    type: AtmApiBadRequestResponse,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Specify the atmId you want to retrieve',
  })
  @Get(':id')
  getById(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.atmService.findById(id, {
      headerLang: getLanguageHeader(req),
    });
  }

  @ApiBadRequestResponse({
    description: "Can't parse the numeric id",
    type: AtmApiBadRequestResponse,
  })
  @ApiNotFoundResponse({
    description: "Didn't find the specified atm id.",
    type: AtmApiNotFoundResponse,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Specify the atmId you want to retrieve.',
  })
  @ApiOkResponse({
    description: 'Gets the atm with that id.',
    type: [AtmWDistanceApiOkResponse],
  })
  @ApiQuery({
    name: 'range',
    description: 'Specify the range (defaults to 5).',
    required: false,
    type: 'number',
  })
  @Get(':id/nearest')
  getNearest(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Query('range') range: string,
  ) {
    let finalRange = 5;
    const parsedRange = parseInt(range, 10);

    if (parsedRange && !Number.isNaN(parsedRange)) finalRange = parsedRange;

    return this.atmService.getNearest(id, finalRange, {
      headerLang: getLanguageHeader(req),
    });
  }

  // @Delete(':id')
  // deleteAtm(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
  //   return this.atmService.deleteById(id, {
  //     headerLang: getLanguageHeader(req),
  //   });
  // }

  // @Post()
  // @UsePipes(new ZodBodyValidationPipe(CreateAtmDtoSchema))
  // create(@Req() req: Request, @Body() createAtmDto: CreateAtmDto) {
  //   return this.atmService.create(createAtmDto, {
  //     headerLang: getLanguageHeader(req),
  //   });
  // }

  // @Put(':id')
  // @UsePipes(new ZodBodyValidationPipe(UpdateAtmDtoSchema))
  // updateAtm(
  //   @Req() req: Request,
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateAtmDto: UpdateAtmDto,
  // ) {
  //   return this.atmService.update(id, updateAtmDto, {
  //     headerLang: getLanguageHeader(req),
  //   });
  // }
}
