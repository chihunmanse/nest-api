import { IsNotEmpty } from 'class-validator';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
  versionKey: false,
};

@Schema(options)
export class Cart extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  })
  @IsNotEmpty()
  user: Types.ObjectId;

  @Prop({
    required: true,
  })
  items: [
    {
      product: {
        type: Types.ObjectId;
        ref: 'Product';
        required: true;
      };
      quantity: {
        type: number;
        required: true;
        default: 0;
      };
    },
  ];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
