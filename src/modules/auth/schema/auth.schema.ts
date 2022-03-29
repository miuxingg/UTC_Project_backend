import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar?: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  gender?: string;

  //   @Prop()
  //   identityCard?: string;

  //   @Prop()
  //   identityImgFrontside?: string;

  //   @Prop()
  //   identityImgBackside?: string;

  //   @Prop()
  //   linkFacebook?: string;

  //   @Prop({ default: true })
  //   needUpdateProfile?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
