import { Category } from './../categories/categories.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
  versionKey: false,
};

@Schema(options)
export class Product extends Document {
  @Prop({
    type: Category,
    required: true,
    ref: 'Category',
  })
  @IsNotEmpty()
  category: Category;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({
    required: false,
  })
  @IsString()
  thumbnailImage: string;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Prop({
    default: 0,
  })
  @IsNumber()
  likeCount: number;

  @Prop({
    type: Object,
  })
  @IsObject()
  likeUsers: object;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
