import { Product } from 'src/products/products.schema';
import { ReviewDto } from './dto/review.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from './reviews.schema';
import { ReviewRequestDto } from './dto/review.request.dto';
import { ReviewQueryDto } from './dto/reviewByProduct.request.dto';

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
      { $push: { recentReviews: review } },
    );
  }

  async removeRecentReview(productId: string) {
    return await this.productModel.updateOne(
      {
        _id: productId,
      },
      {
        $pop: { recentReviews: -1 },
      },
    );
  }

  async updateRecentReview(review: Review): Promise<Product> {
    return await this.productModel.findOneAndUpdate(
      {
        recentReviews: {
          $elemMatch: {
            _id: new Types.ObjectId(review._id),
            author: review.author,
          },
        },
      },
      {
        $set: { 'recentReviews.$[review]': review },
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
        recentReviews: {
          $elemMatch: {
            _id: new Types.ObjectId(reviewId),
          },
        },
      },
      {
        $pull: { recentReviews: { _id: new Types.ObjectId(reviewId) } },
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
              if: { $isArray: '$recentReviews' },
              then: { $size: '$recentReviews' },
              else: 0,
            },
          },
        },
      },
    ]);
    return countAggregation[0].reviewCount;
  }

  async countReview(productId: string): Promise<number> {
    return await this.reviewModel.countDocuments({
      product: productId,
      isDeleted: false,
    });
  }

  async calculateRatingAvg(productId: string): Promise<number> {
    const avgAggregation = await this.reviewModel.aggregate([
      {
        $match: { product: productId, isDeleted: false },
      },
      {
        $group: {
          _id: productId,
          ratingAvg: { $avg: { $sum: '$rating' } },
        },
      },
    ]);

    if (avgAggregation.length === 0) {
      return 0;
    }

    return avgAggregation[0].ratingAvg.toFixed(1);
  }

  async findReviewByProduct(productId: string, query: ReviewQueryDto) {
    const { sort, offset = 0, limit = 10, rating } = query;

    const sortBy = {
      recent: '-createdAt',
      old: 'createdAt',
      rating: '-rating',
    };

    const filterQuery = { product: productId, isDeleted: false };

    if (rating) {
      filterQuery['rating'] = rating;
    }

    return await this.reviewModel
      .find(filterQuery)
      .skip(offset)
      .limit(limit)
      .sort(sortBy[sort]);
  }

  async findReviewByAuthor(
    userId: string | Types.ObjectId,
    query: ReviewQueryDto,
  ) {
    const { sort, offset = 0, limit = 10, rating } = query;

    const sortBy = {
      recent: '-createdAt',
      old: 'createdAt',
      rating: '-rating',
    };

    const filterQuery = { author: userId, isDeleted: false };

    if (rating) {
      filterQuery['rating'] = rating;
    }

    return await this.reviewModel
      .find(filterQuery)
      .skip(offset)
      .limit(limit)
      .sort(sortBy[sort]);
  }
}
