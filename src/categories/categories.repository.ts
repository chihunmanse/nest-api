import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from './categories.schema';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find();
    return categories;
  }

  async existsById(id: string): Promise<boolean> {
    const result = this.categoryModel.exists({ _id: id });
    return result;
  }

  async findById(id: string | Types.ObjectId): Promise<Category | null> {
    const category = await this.categoryModel.findById(id);
    return category;
  }
}
