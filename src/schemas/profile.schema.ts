import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  owner: string;

  @Prop({ required: true })
  profile_name: string;

  @Prop({ required: true })
  callsign: string;

  @Prop()
  name: string;

  @Prop()
  dxcc: number;

  @Prop()
  cq_zone: number;

  @Prop()
  itu_zone: number;

  @Prop()
  gridsquare: string;

  @Prop()
  qth: string;

  @Prop()
  state: string;

  @Prop()
  country: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
