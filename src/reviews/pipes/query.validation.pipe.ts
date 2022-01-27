import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class QueryValidationPipe implements PipeTransform {
  transform(value: any) {
    const { rating, offset, limit } = value;

    if (rating < 0 || rating > 5)
      throw new BadRequestException('INVALID_RATING');

    if (offset < 0) throw new BadRequestException('INVALID_OFFSET');
    if (limit < 0) throw new BadRequestException('INVALID_LIMIT');

    return value;
  }
}
