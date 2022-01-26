import { Product, ProductSchema } from 'src/products/products.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ReviewsController } from './controllers/reviews.controller';
import { ReviewsService } from './services/reviews.service';
import { Review, ReviewSchema } from './reviews.schema';
import { ReviewsRepository } from './reviews.repository';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ProductsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}
