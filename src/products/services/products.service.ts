import { AllProductRequestDto } from '../dto/allProduct.request.dto';
import { ProductByKeywordRequestDto } from '../dto/productByKeyword.request.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductsRepository } from '../products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async getAllProduct(query: AllProductRequestDto) {
    const allProduct = await this.productsRepository.findAllProduct(query);
    return allProduct;
  }

  async getProductByKeyword(query: ProductByKeywordRequestDto) {
    const products = await this.productsRepository.findProductByKeyword(query);
    return products;
  }

  async getOneProduct(id: string) {
    const isProductExist = await this.productsRepository.existsById(id);

    if (!isProductExist) throw new BadRequestException('PRODUCT_NOT_FOUND');

    const product = await this.productsRepository.findById(id);
    return product;
  }

  async updateLikeUser(productId: string, userId: string) {
    const isProductExist = await this.productsRepository.existsById(productId);

    if (!isProductExist) throw new BadRequestException('INVALID_PRODUCT_ID');

    const isLikeExist = await this.productsRepository.existsLike(
      productId,
      userId,
    );

    if (!isLikeExist) {
      const result = await this.productsRepository.addLikeUser(
        productId,
        userId,
      );
      return result;
    } else {
      const result = await this.productsRepository.deleteLikeUser(
        productId,
        userId,
      );
      return result;
    }
  }

  async getLikeProduct(userId: string) {
    const likeProducts = await this.productsRepository.findLikeProduct(userId);
    return likeProducts;
  }
}
