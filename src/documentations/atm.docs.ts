import { ApiProperty } from '@nestjs/swagger';
import { AtmFunctionality, AtmType } from '../types';

export class AtmApiOkResponse {
  @ApiProperty()
  sr: number;

  @ApiProperty()
  atmId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  governorateName: string;

  @ApiProperty()
  googleLatitude: number;

  @ApiProperty()
  googleLongitude: number;

  @ApiProperty()
  functionality: AtmFunctionality[];

  @ApiProperty()
  type: AtmType;
}

export class AtmWDistanceApiOkResponse extends AtmApiOkResponse {
  @ApiProperty()
  distance: number;
}

export class AtmApiBadRequestResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error: 'Bad Request';
}

export class AtmApiNotFoundResponse {
  @ApiProperty()
  message: string;
}
