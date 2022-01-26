import { Product, ProductSchema } from './products.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { ProductsRepository } from './products.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsRepository],
})
export class ProductsModule {}
