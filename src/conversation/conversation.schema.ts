import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema()
export class Message {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  timestamp: Date;
}

const MessageSchema = SchemaFactory.createForClass(Message);

@Schema()
export class Conversation {
  @Prop({ required: true })
  participants: string[];

  @Prop({ type: [MessageSchema], default: [] })
  messages: Message[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
