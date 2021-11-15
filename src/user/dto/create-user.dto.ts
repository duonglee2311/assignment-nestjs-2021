import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Cuong Zodinet' })
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty({ example: 'cuongzdn' })
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z]([_]?[a-zA-Z0-9]+)*$/, {
    message:
      'The first character of the username must be a alphabet char. Username must contains at least 4 characters',
  })
  username: string;

  @ApiProperty({ example: 'cuong@zodinet.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678' })
  @MinLength(8)
  @IsString()
  password: string;

  @IsOptional()
  @ApiProperty({ example: '01/01/1989' })
  @IsDate()
  birthday: string;
}
