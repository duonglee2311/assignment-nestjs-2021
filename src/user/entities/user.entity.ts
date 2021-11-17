import { RoleEnum } from './roles.enum';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, length: 100 })
  name: string;

  @Column({ nullable: false, length: 20 })
  username: string;

  @Column({ nullable: false, length: 100 })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @Column({ nullable: true, type: 'date' })
  birthday: string;

  @Column({ nullable: true, type: 'date' })
  role: RoleEnum;
}
