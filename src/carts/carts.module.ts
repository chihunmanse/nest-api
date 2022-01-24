import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from 'src/products/products.module';
import { CartsRepository } from './carts.repository';
import { Cart, CartSchema } from './carts.schema';
import { CartsController } from './controllers/carts.controller';
import { CartsService } from './services/carts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule,
  ],
  controllers: [CartsController],
  providers: [CartsService, CartsRepository],
})
export class CartsModule {}
