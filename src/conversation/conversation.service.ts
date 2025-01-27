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
    const { sender, receiver, content } = sendMessageDto;

    const senderExists = await this.userModel.findOne({ email: sender });
    if (!senderExists) {
      throw new NotFoundException(`Sender "${sender}" not found`);
    }

    const receiverExists = await this.userModel.findOne({ email: receiver });
    if (!receiverExists) {
      throw new NotFoundException(`Receiver "${receiver}" not found`);
    }
    const existingConversation = await this.conversationModel.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    if (existingConversation) {
      existingConversation.content += `\n${content}`;
      existingConversation.timestamp = new Date();
      return existingConversation.save();
    }

    // Criar uma nova conversa se não existir
    const newConversation = new this.conversationModel({
      sender,
      receiver,
      content,
      timestamp: new Date(),
    });

    return newConversation.save();
  }
}
