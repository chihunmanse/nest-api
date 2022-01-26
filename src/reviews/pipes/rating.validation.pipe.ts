import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class RatingValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value) {
      if (value < 0 || value > 5) {
        throw new BadRequestException('INVALID_RATING');
      }
    }
    return value;
  }
}
