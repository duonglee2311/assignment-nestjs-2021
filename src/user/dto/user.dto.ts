import { RoleEnum } from './../entities/roles.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class UserDto {
  id: string;

  name: string;

  username: string;

  email: string;

  birthday: string;

  role: RoleEnum;
}
