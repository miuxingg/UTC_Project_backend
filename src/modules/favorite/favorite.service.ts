import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceBase } from 'src/common/ServiceBase';
import { Favorite, FavoriteDocument } from './schema/favorite.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class FavoriteService extends ServiceBase<FavoriteDocument> {
  constructor(
    @InjectModel(Favorite.name) favoriteModel: Model<FavoriteDocument>,
  ) {
    super(favoriteModel);
  }

  async toggleFavorite(userId: string, bookId: string) {
    const favoriteDocument = await this.model.findOne({
      book: bookId,
      user: userId,
    });
    if (!favoriteDocument) {
      try {
        const documentCreate = await this.model.create({
          user: userId,
          book: bookId,
        });
        return {
          status: true,
          bookId: documentCreate.book,
        };
      } catch {
        return {
          status: true,
          bookId: undefined,
        };
      }
    } else {
      try {
        await this.model.deleteOne({ user: userId, book: bookId });
        return {
          status: false,
          bookId: favoriteDocument.book,
        };
      } catch {
        return {
          status: false,
          bookId: undefined,
        };
      }
    }
  }
}
