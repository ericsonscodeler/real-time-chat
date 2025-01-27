import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017', {
      dbName: 'real-time-chat',
    }),
  ],
  providers: [],
})
export class AppModule {}
