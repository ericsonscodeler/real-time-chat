import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SendMessageDto } from './dto/send-message-dto';
import { Conversation } from './conversation.schema';
import { User } from 'src/users/users.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel('Conversation')
    private readonly conversationModel: Model<Conversation>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async sendMessage(sendMessageDto: SendMessageDto) {
    const { content, receiver, sender } = sendMessageDto;

    const senderExists = await this.userModel.find({ email: sender }).exec();
    if (!senderExists) {
      throw new NotFoundException(`Sender "${sender}" not found`);
    }

    const receiverExists = await this.userModel
      .find({ email: receiver })
      .exec();
    if (!receiverExists) {
      throw new NotFoundException(`Receiver "${receiver}" not found`);
    }

    const newMessage = {
      sender,
      receiver,
      content,
      timestamp: new Date(),
    };

    const conversation = await this.conversationModel.findOneAndUpdate(
      {
        participants: { $all: [sender, receiver] },
      },
      {
        $push: { messages: newMessage },
      },
      { new: true, upsert: true },
    );

    return conversation;
  }
  async getConversation(authenticatedUser: string, otherUser: string) {
    const participants = [authenticatedUser, otherUser].sort();

    console.log(participants);

    const conversation = await this.conversationModel
      .findOne({ participants })
      .exec();

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!conversation.participants.includes(authenticatedUser)) {
      throw new Error('You are not authorized to view this conversation');
    }

    return conversation.messages;
  }
}
