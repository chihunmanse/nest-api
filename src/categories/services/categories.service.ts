import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from '../categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getAllCategory() {
    const allCategory = await this.categoriesRepository.findAll();
    return allCategory;
  }

  async getOneCategory(id: string) {
    const isCategoryExist = await this.categoriesRepository.existsById(id);

    if (!isCategoryExist) throw new NotFoundException('CATEGORY_NOT_FOUND');

    const category = await this.categoriesRepository.findById(id);
    return category;
  }
}
