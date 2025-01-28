import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { SendMessageDto } from './dto/send-message-dto';
import { JwtAuthGuard } from 'src/config/auth/auth.config';

@Controller('conversation')
@UseGuards(JwtAuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('send-message')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.conversationService.sendMessage(sendMessageDto);
  }

  @Get()
  async getConversation(@Request() req, @Query('user') otherUser: string) {
    const authenticatedUser = req.user.email;
    return this.conversationService.getConversation(
      authenticatedUser,
      otherUser,
    );
  }
}
