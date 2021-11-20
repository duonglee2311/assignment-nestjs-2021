import { UserDto } from './../user/dto/user.dto';
import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

export interface IUserInfo {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  avatar?: string;
}
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserDto | undefined> {
    const result = await this.userService.validateUser(username, pass);
    return result;
  }

  async login(user: IUserInfo) {
    const payload = { ...user };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
