import { QueryValidationPipe } from './../pipes/query.validation.pipe';
import { AllProductRequestDto } from '../dto/allProduct.request.dto';
import { ProductByKeywordRequestDto } from '../dto/productByKeyword.request.dto';
import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ObjectIdValidationPipe } from 'src/common/pipes/objectId.validation.pipe';
import { ProductsService } from '../services/products.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { LogInUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/users.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  async getAllProduct(@Query(QueryValidationPipe) query: AllProductRequestDto) {
    return await this.productsService.getAllProduct(query);
  }

  @Get('keyword')
  async getProductByKeyword(
    @Query(QueryValidationPipe) query: ProductByKeywordRequestDto,
  ) {
    return await this.productsService.getProductByKeyword(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('like')
  async updateLikeUser(
    @Body('productId', ObjectIdValidationPipe) productId: string,
    @LogInUser() user: User,
  ) {
    return this.productsService.updateLikeUser(productId, user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('like')
  async getLikeProduct(@LogInUser() user: User) {
    return this.productsService.getLikeProduct(user._id);
  }

  @Get(':id')
  async getOneProduct(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.productsService.getOneProduct(id);
  }
}
