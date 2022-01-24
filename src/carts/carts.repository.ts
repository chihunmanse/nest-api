import { aggregateCartDto } from './dto/aggregate.cart.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './carts.schema';

@Injectable()
export class CartsRepository {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
  ) {}

  async existsCartItem(productId: string, userId: string): Promise<boolean> {
    const result = await this.cartModel.exists({
      user: userId,
      items: {
        $elemMatch: {
          product: new Types.ObjectId(productId),
        },
      },
    });
    return result;
  }

  async addCartItem(
    productId: string,
    quantity: number,
    userId: string,
  ): Promise<Cart> {
    const addItem = await this.cartModel.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          items: {
            product: new Types.ObjectId(productId),
            quantity: quantity,
          },
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return addItem;
  }

  async updateCartItem(
    productId: string,
    quantity: number,
    userId: string,
  ): Promise<Cart> {
    const updateItem = await this.cartModel.findOneAndUpdate(
      {
        user: userId,
        items: { $elemMatch: { product: new Types.ObjectId(productId) } },
      },
      {
        $inc: {
          'items.$.quantity': quantity,
        },
      },
      {
        new: true,
      },
    );

    return updateItem;
  }

  async updateItemQuantity(
    productId: string,
    quantity: number,
    userId: string,
  ): Promise<Cart> {
    const updateItem = await this.cartModel.findOneAndUpdate(
      {
        user: userId,
        items: { $elemMatch: { product: new Types.ObjectId(productId) } },
      },
      {
        $set: {
          'items.$.quantity': quantity,
        },
      },
      {
        new: true,
      },
    );

    return updateItem;
  }

  async deleteCartItem(productId: string, userId: string): Promise<Cart> {
    const deleteItem = await this.cartModel.findOneAndUpdate(
      {
        user: userId,
        items: { $elemMatch: { product: new Types.ObjectId(productId) } },
      },
      {
        $pull: {
          items: {
            product: new Types.ObjectId(productId),
          },
        },
      },
      {
        new: true,
      },
    );

    return deleteItem;
  }

  // populate 이용한 join
  // async findCartByUser(userId: string) {
  //   const cart = await this.cartModel
  //     .findOne({
  //       user: userId,
  //     })
  //     .populate({
  //       path: 'items.product',
  //       model: 'Product',
  //       select: ['-category', '-likeCount'],
  //     })
  //     .select('items');
  //   return cart;
  // }

  async findCartByUser(userId: string): Promise<aggregateCartDto> {
    const cart = await this.cartModel.aggregate([
      {
        $match: { user: userId },
      },
      {
        $unwind: { path: '$items' },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'items.product',
        },
      },
      {
        $unwind: { path: '$items.product' },
      },
      {
        $group: {
          _id: '$_id',
          items: {
            $push: '$items',
          },
        },
      },
      {
        $project: {
          'items.product.category': 0,
        },
      },
      {
        $addFields: {
          items: {
            $map: {
              input: '$items',
              as: 'item',
              in: {
                product: '$$item.product',
                quantity: '$$item.quantity',
                itemPrice: {
                  $multiply: ['$$item.product.price', '$$item.quantity'],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalQuantity: { $sum: '$items.quantity' },
          totalPrice: { $sum: '$items.itemPrice' },
        },
      },
    ]);
    return cart[0];
  }
}
