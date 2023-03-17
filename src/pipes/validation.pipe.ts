import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import errors from '../config/errors';
import { z } from 'zod';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (metadata.type === 'query') {
        const { error } = this.schema.query.validate(value);
        if (error) throw new Error(error);
      } else if (metadata.type === 'body') {
        const { error } = this.schema.body.validate(value);
        if (error) throw new Error(error);
      }
    } catch (e) {
      throw new BadRequestException(errors.validationFailed);
    }
    return value;
  }
}

@Injectable()
export class ZodBodyValidationPipe implements PipeTransform {
  constructor(private schema: ReturnType<typeof z.object>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;
    try {
      const parsed = this.schema.parse(value);
      return parsed;
    } catch (e) {
      throw new BadRequestException(errors.validationFailed);
    }
  }
}
