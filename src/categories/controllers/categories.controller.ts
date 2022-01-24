import { Controller, Get, Param } from '@nestjs/common';
import { ObjectIdValidationPipe } from 'src/common/pipes/objectId.validation.pipe';
import { CategoriesService } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('')
  async getAllCategory() {
    return await this.categoriesService.getAllCategory();
  }

  @Get(':id')
  async getOneCategory(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.categoriesService.getOneCategory(id);
  }
}
