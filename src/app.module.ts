import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017', {
      dbName: 'real-time-chat',
    }),
    ConversationModule,
  ],
  providers: [],
})
export class AppModule {}
