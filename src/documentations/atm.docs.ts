import { ApiProperty } from '@nestjs/swagger';
import { AtmFunctionality, AtmType } from '../types';
import { ATM_FUNCTIONALITY, ATM_TYPES } from 'src/config/constants';

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

  @ApiProperty({ enum: ATM_FUNCTIONALITY })
  functionality: AtmFunctionality[];

  @ApiProperty({ enum: ATM_TYPES })
  type: AtmType;

  @ApiProperty({ nullable: true })
  workingHour?: string | undefined;
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
