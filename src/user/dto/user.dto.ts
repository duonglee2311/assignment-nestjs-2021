import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AutoMap } from '@automapper/classes';
import { RoleEnum } from './../entities/roles.enum';

export class UserDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  username: string;

  @AutoMap()
  email: string;

  @AutoMap()
  birthday: string;

  @AutoMap()
  role: RoleEnum;
}
