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
import { MainService } from './main.service';

@Controller()
export class MainController {
  constructor(
    private mainService: MainService,
    private filterService: FilterService,
  ) {}

  @Get()
  get(@Req() req: Request) {
    return this.mainService.find(this.filterService.parseOptions(req.query), {
      headerLang: this.getLanguageHeader(req),
    });
  }

  @Get(':id')
  getById(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.mainService.findById(id, {
      headerLang: this.getLanguageHeader(req),
    });
  }

  @Delete(':id')
  deleteAtm(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.mainService.deleteById(id);
  }

  @Post()
  @UsePipes(new ZodBodyValidationPipe(CreateAtmDtoSchema))
  create(@Req() req: Request, @Body() createAtmDto: CreateAtmDto) {
    return this.mainService.create(createAtmDto, {
      headerLang: this.getLanguageHeader(req),
    });
  }

  @Put(':id')
  @UsePipes(new ZodBodyValidationPipe(UpdateAtmDtoSchema))
  updateAtm(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAtmDto: UpdateAtmDto,
  ) {
    return this.mainService.update(id, updateAtmDto, {
      headerLang: this.getLanguageHeader(req),
    });
  }

  private getLanguageHeader(req: Request) {
    return req.headers['accept-language'];
  }
}
