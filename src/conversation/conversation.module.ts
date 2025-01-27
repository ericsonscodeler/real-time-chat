import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';

import { JwtStrategy } from 'src/config/auth/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { ConversationSchema } from './conversation.schema';
import { UserSchema } from 'src/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Conversation', schema: ConversationSchema },
      { name: 'User', schema: UserSchema },
    ]),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [ConversationService, JwtStrategy],
  controllers: [ConversationController],
})
export class ConversationModule {}
