import { ReviewRequestDto } from './../dto/review.request.dto';
import { RatingValidationPipe } from './../pipes/rating.validation.pipe';
import { JwtAuthGuard } from './../../auth/jwt/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';
import { LogInUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/users.schema';
import { ObjectIdValidationPipe } from 'src/common/pipes/objectId.validation.pipe';
import { ReviewQueryDto } from '../dto/reviewByProduct.request.dto';
import { QueryValidationPipe } from '../pipes/query.validation.pipe';

@Controller('products/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':productId')
  async createReivew(
    @Param('productId', ObjectIdValidationPipe) productId: string,
    @Body() body: ReviewRequestDto,
    @Body('rating', ParseIntPipe, RatingValidationPipe) rating: number,
    @LogInUser() user: User,
  ) {
    const reviewDto = {
      product: productId,
      author: user._id,
      ...body,
    };
    return await this.reviewsService.createReview(reviewDto);
  }

  @Get(':productId')
  async getReivewByProduct(
    @Param('productId', ObjectIdValidationPipe) productId: string,
    @Query(QueryValidationPipe) query: ReviewQueryDto,
  ) {
    return await this.reviewsService.getReviewByProduct(productId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':reviewId')
  async updateReview(
    @Param('reviewId', ObjectIdValidationPipe) reviewId: string,
    @Body() body: ReviewRequestDto,
    @Body('rating', ParseIntPipe, RatingValidationPipe) rating: number,
    @LogInUser() user: User,
  ) {
    return await this.reviewsService.updateReview(reviewId, user._id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':reviewId')
  async deleteReview(
    @Param('reviewId', ObjectIdValidationPipe) reviewId: string,
    @LogInUser() user: User,
  ) {
    return await this.reviewsService.deleteReview(reviewId, user._id);
  }
}
