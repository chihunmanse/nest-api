import { SignUpRequestDto } from './dto/signup.request.dto';
import { User } from './users.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.userModel.exists({ email });
    return result;
  }

  async createUser(user: SignUpRequestDto): Promise<User> {
    return await this.userModel.create(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async findUserByIdWithoutPassword(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId).select('-password');
    return user;
  }
}
