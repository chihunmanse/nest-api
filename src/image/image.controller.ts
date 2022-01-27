import { User } from './../users/users.schema';
import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogInUser } from 'src/common/decorators/user.decorator';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @LogInUser() user: User,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.imageService.uploadImageToS3(user._id, image);
  }
}
