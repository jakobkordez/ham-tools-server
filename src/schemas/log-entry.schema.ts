import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type LogEntryDocument = LogEntry & Document;

@Schema()
export class LogEntry {
  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner: User | string;

  @Prop({ required: true, default: () => new Date(Date.now()) })
  created_at: Date;

  @Prop({ type: Object, required: true })
  data: object;
}

export const LogEntrySchema = SchemaFactory.createForClass(LogEntry);
