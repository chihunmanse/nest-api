import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogIn(data: LoginRequestDto) {
    const { email, password } = data;

    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) throw new UnauthorizedException('INVALID_EMAIL');

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated)
      throw new UnauthorizedException('INVALID_PASSWORD');

    const payload = { id: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
