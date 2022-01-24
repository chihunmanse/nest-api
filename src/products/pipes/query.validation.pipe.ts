import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class QueryValidationPipe implements PipeTransform {
  transform(value: any) {
    const { category, offset, limit } = value;
    if (!isValidObjectId(category))
      throw new BadRequestException('INVALID_CATEGORY_ID');

    if (offset < 0) throw new BadRequestException('INVALID_OFFSET');
    if (limit < 0) throw new BadRequestException('INVALID_LIMIT');
    return value;
  }
}
