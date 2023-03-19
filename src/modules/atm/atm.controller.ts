import {
  Controller,
  Req,
  Get,
  Param,
  Post,
  Delete,
  Put,
  ParseIntPipe,
  Body,
  UsePipes,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { FilterService } from '../filter/filter.service';
import {
  CreateAtmDtoSchema,
  UpdateAtmDtoSchema,
  type CreateAtmDto,
  type UpdateAtmDto,
} from './dto/atm.dto';
import { ZodBodyValidationPipe } from '../../pipes/validation.pipe';
import { AtmService } from './atm.service';
import { getLanguageHeader } from 'src/utils/language';

@Controller('atm')
export class AtmController {
  constructor(
    private atmService: AtmService,
    private filterService: FilterService,
  ) {}

  @Get()
  get(@Req() req: Request) {
    return this.atmService.find(this.filterService.parseOptions(req.query), {
      headerLang: getLanguageHeader(req),
    });
  }

  @Get(':id')
  getById(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.atmService.findById(id, {
      headerLang: getLanguageHeader(req),
    });
  }

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

  @Delete(':id')
  deleteAtm(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.atmService.deleteById(id, {
      headerLang: getLanguageHeader(req),
    });
  }

  @Post()
  @UsePipes(new ZodBodyValidationPipe(CreateAtmDtoSchema))
  create(@Req() req: Request, @Body() createAtmDto: CreateAtmDto) {
    return this.atmService.create(createAtmDto, {
      headerLang: getLanguageHeader(req),
    });
  }

  @Put(':id')
  @UsePipes(new ZodBodyValidationPipe(UpdateAtmDtoSchema))
  updateAtm(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAtmDto: UpdateAtmDto,
  ) {
    return this.atmService.update(id, updateAtmDto, {
      headerLang: getLanguageHeader(req),
    });
  }
}
