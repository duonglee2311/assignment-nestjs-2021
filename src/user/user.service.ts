import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private _repository: Repository<UserEntity>,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {
    this.mapper.createMap(UserEntity, UserDto);
    console.log('init  UserService');
  }

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
    await this._repository.save(user);

    const userDto = this.mapper.map(user, UserDto, UserEntity);
    return userDto;
  }

  async findAll() {
    const entities = await this._repository.find();

    const dtos = this.mapper.mapArray(entities, UserDto, UserEntity);
    return dtos;
  }

  async findOneById(id: string) {
    const entity = await this._repository.findOne({ id });
    const userDto = this.mapper.map(entity, UserDto, UserEntity);
    return userDto;
  }

  async findOne(username: string) {
    const entity = await this._repository.findOne({ username: username });
    const userDto = this.mapper.map(entity, UserDto, UserEntity);
    return userDto;
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
      const userDto = this.mapper.map(user, UserDto, UserEntity);
      return userDto;
    }
    return null;
  }
}
