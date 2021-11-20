import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AutoMap } from '@automapper/classes';
import { RoleEnum } from './roles.enum';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;

  @Column({ nullable: true, length: 100 })
  @AutoMap()
  name: string;

  @Column({ nullable: false, length: 20 })
  @AutoMap()
  username: string;

  @Column({ nullable: false, length: 100 })
  @AutoMap()
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @Column({ nullable: true, type: 'date' })
  @AutoMap()
  birthday: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.Editor,
  })
  @AutoMap()
  role: RoleEnum;
}
