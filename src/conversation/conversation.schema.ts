import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: () => Date.now() })
  timestamp: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
