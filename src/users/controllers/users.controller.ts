import { User } from './../users.schema';
import { LogInUser } from './../../common/decorators/user.decorator';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ReviewQueryDto } from 'src/reviews/dto/reviewByProduct.request.dto';
import { QueryValidationPipe } from 'src/reviews/pipes/query.validation.pipe';
import { SignUpRequestDto } from '../dto/signup.request.dto';
import { UsersService } from '../services/users.service';
import { ReviewsService } from 'src/reviews/services/reviews.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Post('signup')
  async signUp(@Body() body: SignUpRequestDto) {
    return await this.usersService.signUp(body);
  }

  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('reviews')
  async getReivewByAuthor(
    @Query(QueryValidationPipe) query: ReviewQueryDto,
    @LogInUser() user: User,
  ) {
    return await this.reviewsService.getReviewByAuthor(user._id, query);
  }
}
