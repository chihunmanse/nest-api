import { UsersRepository } from './../users.repository';
import { HttpException, Injectable } from '@nestjs/common';
import { SignUpRequestDto } from '../dto/signup.request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(body: SignUpRequestDto) {
    const { email, name, password } = body;

    const isUserExist = await this.usersRepository.existsByEmail(email);
    if (isUserExist) throw new HttpException('DUPLICATE_EMAIL', 409);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.usersRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData;
  }
}
