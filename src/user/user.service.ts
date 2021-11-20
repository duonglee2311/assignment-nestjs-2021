import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private _repository: Repository<UserEntity>,
    @InjectMapper()
    private readonly mapper: Mapper,
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

    const dto = result as UserDto;
    return dto;
  }

  async findAll() {
    const entities = await this._repository.find();

    const dtos = entities.map((entity) => {
      const { password, ...rest } = entity;
      const dto = rest as UserDto;
      return dto;
    });
    return dtos;
  }

  async findOneById(id: string) {
    const entity = await this._repository.findOne({ id });
    const { password, ...rest } = entity;
    const dto = rest as UserDto;
    return dto;
  }

  async findOne(username: string) {
    const entity = await this._repository.findOne({ username: username });
    const { password, ...rest } = entity;
    const dto = rest as UserDto;
    return dto;
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

  async validateUser(username: string, pass: string) {
    const user = await this._repository.findOne({ username });
    if (user && bcrypt.compareSync(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      const dto = rest as UserDto;
      return dto;
    }
    return null;
  }
}
