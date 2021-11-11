import {
  Length,
  IsEmail,
  IsDate,
  MinLength,
  IsString,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z]([_]?[a-zA-Z0-9]+)*$/, {
    message:
      'The first character of the username must be a alphabet char. Username must contains at least 4 characters',
  })
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsOptional()
  @ApiProperty()
  @IsDate()
  birthday: string;
}
