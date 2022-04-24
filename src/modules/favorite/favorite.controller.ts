import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/libs/decorators/user.decorator';
import { IIAMUser } from 'src/utils/types';
import { AuthService } from '../auth/auth.service';
import { FavoriteInputDto } from './dto/input.dto';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly userService: AuthService,
  ) {}

  @Post()
  async createFavorite(
    @User() iamUser: IIAMUser,
    @Body() favoriteInput: FavoriteInputDto,
  ) {
    if (!iamUser?.id) return 'Unauthorization';
    const user = await this.userService.findById(iamUser.id);
    return await this.favoriteService.create({
      ...favoriteInput,
      user: user.id,
    });
  }

  @Post('toggle')
  async toggleFavorite(
    @User() iamUser: IIAMUser,
    @Body() favoriteInput: FavoriteInputDto,
  ) {
    if (!iamUser?.id) return 'Unauthorization';
    const user = await this.userService.findById(iamUser.id);
    if (!user) return 'Dont find user';
    return await this.favoriteService.toggleFavorite(
      user.id,
      favoriteInput.book,
    );
  }
}
