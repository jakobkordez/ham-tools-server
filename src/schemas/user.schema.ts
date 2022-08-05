import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hashSync } from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  id: string;

  @Prop({
    required: true,
  })
  username: string;

  @Prop({
    required: true,
    transform: () => undefined,
    set: (value: string) => hashSync(value, 10),
  })
  password: string;

  @Prop()
  name: string;

  @Prop({ type: [String], default: [] })
  callsigns: string[];

  @Prop({ type: [String], default: [], transform: () => undefined })
  logins: string[];

  @Prop({ type: [String], default: ['user'] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
