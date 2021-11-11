import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private _repository: Repository<UserEntity>,
  ) {}

  async findByUsernameOrEmail(
    params: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | undefined> {
    const queryBuilder = this._repository.createQueryBuilder('user');

    if (params.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: params.email,
      });
    }

    if (params.username) {
      queryBuilder.orWhere('user.username = :username', {
        username: params.username,
      });
    }

    return queryBuilder.getOne();
  }

  async create(createUserDto: CreateUserDto) {
    const foundUser = await this.findByUsernameOrEmail(createUserDto);
    if (foundUser) {
      return {
        result: false,
        error: 'user exists',
      };
    }

    const user = this._repository.create(createUserDto);

    user.password = bcrypt.hashSync(user.password, 10);

    return this._repository.save(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
