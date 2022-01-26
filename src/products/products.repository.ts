import { ProductByKeywordRequestDto } from './dto/productByKeyword.request.dto';
import { Product } from './products.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Query } from 'mongoose';
import { AllProductRequestDto } from './dto/allProduct.request.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async findAllProduct(query: AllProductRequestDto): Promise<Product[]> {
    const { sort, offset = 0, limit = 10 } = query;
    const sortBy = {
      lowPrice: 'price',
      highPrice: '-price',
      likeCount: '-likeCount',
    };
    const allProduct = await this.productModel
      .find()
      .select(['-category', '-likeUsers', '-reviews'])
      .skip(offset)
      .limit(limit)
      .sort(sortBy[sort]);

    return allProduct;
  }

  async findProductByKeyword(
    query: ProductByKeywordRequestDto,
  ): Promise<Product[]> {
    const { category, sort, offset = 0, limit = 10, search } = query;
    const sortBy = {
      lowPrice: 'price',
      highPrice: '-price',
      likeCount: '-likeCount',
    };
    const filterQuery = new Query();
    if (category) {
      filterQuery.find({ 'category._id': category });
    }
    const products = await this.productModel
      .find(filterQuery)
      .or([
        { name: new RegExp(search) },
        { 'category.name': new RegExp(search) },
      ])
      .select(['-category', '-likeUsers', '-reviews'])
      .skip(offset)
      .limit(limit)
      .sort(sortBy[sort]);

    return products;
  }

  async existsById(id: string): Promise<boolean> {
    const result = this.productModel.exists({ _id: id });
    return result;
  }

  async findById(id: string | Types.ObjectId): Promise<Product | null> {
    const product = await this.productModel.findById(id).select('-likeUsers');
    return product;
  }

  async existsLike(productId: string, userId: string): Promise<boolean> {
    const key = `likeUsers.${userId}`;
    const query = {
      _id: productId,
    };
    query[key] = true;

    const result = await this.productModel.exists(query);
    return result;
  }

  async addLikeUser(productId: string, userId: string): Promise<Product> {
    const key = `likeUsers.${userId}`;
    const query = {};
    query[key] = true;

    const result = await this.productModel
      .findOneAndUpdate(
        { _id: productId },
        {
          $set: query,
          $inc: { likeCount: 1 },
        },
        {
          new: true,
        },
      )
      .select('likeCount');
    return result;
  }

  async deleteLikeUser(productId: string, userId: string): Promise<Product> {
    const key = `likeUsers.${userId}`;
    const query = {};
    query[key] = true;

    const result = await this.productModel
      .findOneAndUpdate(
        { _id: productId },
        {
          $unset: query,
          $inc: { likeCount: -1 },
        },
        {
          new: true,
        },
      )
      .select('likeCount');
    return result;
  }

  async findLikeProduct(userId: string): Promise<Product[]> {
    const key = `likeUsers.${userId}`;
    const query = {};
    query[key] = true;

    const likeProducts = await this.productModel
      .find(query)
      .select(['-category', '-likeUsers']);
    return likeProducts;
  }
}
