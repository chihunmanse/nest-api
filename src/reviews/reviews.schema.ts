import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
  versionKey: false,
};

@Schema(options)
export class Review extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  })
  @IsNotEmpty()
  author: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'Product',
  })
  @IsNotEmpty()
  product: Types.ObjectId;

  @Prop()
  @IsString()
  content: string;

  @Prop()
  @IsString()
  image: string;

  @Prop({
    default: 0,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @Prop({
    default: false,
  })
  @IsBoolean()
  isDeleted: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
