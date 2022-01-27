import { ProductsRepository } from './../../products/products.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CartsRepository } from '../carts.repository';

@Injectable()
export class CartsService {
  constructor(
    private readonly cartsRepository: CartsRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async addCartItem(productId: string, quantity: number, userId: string) {
    const isProductExist = await this.productsRepository.existsById(productId);

    if (!isProductExist) throw new BadRequestException('INVALID_PRODUCT_ID');

    const existCartItem = await this.cartsRepository.existsCartItem(
      productId,
      userId,
    );

    if (existCartItem) {
      const updateItem = await this.cartsRepository.updateCartItem(
        productId,
        quantity,
        userId,
      );
      return updateItem;
    } else {
      const addItem = await this.cartsRepository.addCartItem(
        productId,
        quantity,
        userId,
      );
      return addItem;
    }
  }

  async updateCartItem(productId: string, quantity: number, userId: string) {
    const isItemExist = await this.cartsRepository.existsCartItem(
      productId,
      userId,
    );

    if (!isItemExist) throw new BadRequestException('DOES_NOT_EXIST_ITEM');

    const updateItem = await this.cartsRepository.updateItemQuantity(
      productId,
      quantity,
      userId,
    );

    return updateItem;
  }

  async deleteCartItem(productId: string, userId: string) {
    const isItemExist = await this.cartsRepository.existsCartItem(
      productId,
      userId,
    );

    if (!isItemExist) throw new BadRequestException('DOES_NOT_EXIST_ITEM');

    const deleteItem = await this.cartsRepository.deleteCartItem(
      productId,
      userId,
    );

    return deleteItem;
  }

  async getCart(userId: string) {
    const cart = await this.cartsRepository.findCartByUser(userId);
    if (!cart) {
      return cart;
    }
    const shipping = this.calculateShipping(cart.totalPrice);
    cart.shipping = shipping;
    cart.orderPrice = cart.totalPrice + shipping;
    return cart;
  }

  calculateShipping(totalPrice: number) {
    const FREE_SHIPPING = 30000;
    const SHIPPING = 3000;
    const shippingPrice =
      totalPrice >= FREE_SHIPPING || totalPrice == 0 ? 0 : SHIPPING;

    return shippingPrice;
  }
}
