import { Product } from 'src/products/products.schema';
import { ReviewDto } from './dto/review.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from './reviews.schema';
import { ReviewRequestDto } from './dto/review.request.dto';

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async createReview(reviewDto: ReviewDto): Promise<Review> {
    return await this.reviewModel.create(reviewDto);
  }

  async updateReview(
    reviewId: string,
    body: ReviewRequestDto,
  ): Promise<Review> {
    const { content, image, rating } = body;
    return await this.reviewModel.findOneAndUpdate(
      {
        _id: reviewId,
      },
      {
        $set: { content, image, rating },
      },
      {
        new: true,
      },
    );
  }

  async deleteReview(reviewId: string): Promise<Review> {
    return await this.reviewModel.findOneAndUpdate(
      {
        _id: reviewId,
      },
      {
        $set: { isDeleted: true },
      },
      {
        new: true,
      },
    );
  }

  async existsReview(reviewId: string, userId: string): Promise<boolean> {
    return await this.reviewModel.exists({
      _id: reviewId,
      author: userId,
    });
  }

  async addRecentReview(review: Review) {
    return await this.productModel.updateOne(
      {
        _id: review.product,
      },
      { $push: { reviews: review } },
      {
        new: true,
      },
    );
  }

  async removeRecentReview(productId: string) {
    return await this.productModel.updateOne(
      {
        _id: productId,
      },
      {
        $pop: { reviews: -1 },
      },
    );
  }

  async updateRecentReview(review: Review): Promise<Product> {
    return await this.productModel.findOneAndUpdate(
      {
        reviews: {
          $elemMatch: {
            _id: new Types.ObjectId(review._id),
            author: review.author,
          },
        },
      },
      {
        $set: { 'reviews.$[review]': review },
      },
      {
        arrayFilters: [{ 'review._id': new Types.ObjectId(review._id) }],
        new: true,
      },
    );
  }

  async deleteRecentReview(reviewId: string) {
    return await this.productModel.updateOne(
      {
        reviews: {
          $elemMatch: {
            _id: new Types.ObjectId(reviewId),
          },
        },
      },
      {
        $pull: { reviews: { _id: new Types.ObjectId(reviewId) } },
      },
      {
        new: true,
      },
    );
  }

  async countRecentReview(productId: string): Promise<number> {
    const countAggregation = await this.productModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(productId) },
      },
      {
        $project: {
          _id: 0,
          reviewCount: {
            $cond: {
              if: { $isArray: '$reviews' },
              then: { $size: '$reviews' },
              else: 0,
            },
          },
        },
      },
    ]);
    return countAggregation[0].reviewCount;
  }
}
