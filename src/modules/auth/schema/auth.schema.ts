import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IAddress } from 'src/modules/address/types/address.type';
import { Roles } from '../../../configs/roles.config';
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

  @Prop({ type: Object })
  province?: IAddress;

  @Prop({ type: Object })
  district?: IAddress;

  @Prop({ type: Object })
  ward?: IAddress;

  @Prop()
  privateHome?: string;

  @Prop({
    enum: Object.values(Roles),
    default: Roles.Guest,
  })
  roles?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 'text', firstName: 'text', lastName: 'text' });
