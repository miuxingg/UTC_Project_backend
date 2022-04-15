import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BaseQuery } from 'src/common/BaseDTO';
import { User } from 'src/libs/decorators/user.decorator';
import { IIAMUser } from 'src/utils/types';
import { AuthService } from '../auth/auth.service';
import { SocketsGateway } from '../socket/socket.gateway';
import { EventNames } from '../socket/types/eventName';
import { ReviewInputDto } from './dto/input.dto';
import { ReviewOutputDto } from './dto/output.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewService: ReviewsService,
    private readonly userService: AuthService,
    private readonly socketsGateway: SocketsGateway,
  ) {}

  @Get(':bookId')
  async getReviewOnBook(
    @Param('bookId') bookId: string,
    @Query() queries: BaseQuery,
  ) {
    const [response] = await this.reviewService.getReviewsOnBook(
      bookId,
      queries,
    );
    return {
      items: plainToClass(ReviewOutputDto, response?.items ?? []),
      total: response?.total ?? 0,
    };
  }

  @Post()
  async createReview(
    @User() iiamUser: IIAMUser,
    @Body() review: ReviewInputDto,
  ) {
    if (!iiamUser?.id) return;
    const user = await this.userService.findById(iiamUser.id);
    const data = await this.reviewService.create({
      ...review,
      userId: user.id,
    });
    if (data) {
      this.socketsGateway.sendEvent(EventNames.NewReview, {
        id: data._id,
        comment: data.comment,
        rating: data.rating,
        user: user,
        createdAt: new Date(),
      });
    }
    return plainToClass(ReviewOutputDto, data);
  }
}
