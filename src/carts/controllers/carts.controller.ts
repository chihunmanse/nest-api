import { ObjectIdValidationPipe } from 'src/common/pipes/objectId.validation.pipe';
import { CartsService } from './../services/carts.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { LogInUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/users.schema';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async addCartItem(
    @Body('productId', ObjectIdValidationPipe) productId: string,
    @Body('quantity') quantity: number,
    @LogInUser() user: User,
  ) {
    return this.cartsService.addCartItem(productId, quantity, user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  async updateCartItem(
    @Body('productId', ObjectIdValidationPipe) productId: string,
    @Body('quantity') quantity: number,
    @LogInUser() user: User,
  ) {
    return this.cartsService.updateCartItem(productId, quantity, user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('')
  async deleteCartItem(
    @Body('productId', ObjectIdValidationPipe) productId: string,
    @LogInUser() user: User,
  ) {
    return this.cartsService.deleteCartItem(productId, user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getCart(@LogInUser() user: User) {
    return this.cartsService.getCart(user._id);
  }
}
