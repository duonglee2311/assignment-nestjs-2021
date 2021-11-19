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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this._repository.save(user);

    return result;
  }

  async findAll() {
    const entities = await this._repository.find();
    return entities;
  }

  async findOneById(id: string) {
    const entity = await this._repository.findOne({ id });
    return entity;
  }
  async findOne(username: string) {
    const entity = await this._repository.findOne({ username: username });
    return entity;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const entity = await this._repository.findOne(id);
    if (!entity) {
      return false;
    }

    await this._repository.update(id, updateUserDto);

    return true;
  }

  async remove(id: string) {
    const entity = await this._repository.findOne(id);
    if (!entity) {
      return false;
    }

    await this._repository.remove(entity);

    return true;
  }
}
