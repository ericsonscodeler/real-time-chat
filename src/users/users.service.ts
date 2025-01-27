import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user-dto';

import * as bcrypt from 'bcrypt';
import { AuthUserDto } from './dto/auth-user-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    const saltOrRounds = 10;
    const passwordHashed = await bcrypt.hash(password, saltOrRounds);
    const createdUser = new this.userModel({
      name,
      email,
      password: passwordHashed,
    });
    return createdUser.save();
  }

  async auth(authUserDto: AuthUserDto): Promise<{ access_token: string }> {
    const { email, password } = authUserDto;

    const user = await this.userModel.find({ email }).exec();

    const isMatchPassword = await bcrypt.compare(password, user[0].password);

    if (!user || !isMatchPassword) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user[0]._id, email: user[0].email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
