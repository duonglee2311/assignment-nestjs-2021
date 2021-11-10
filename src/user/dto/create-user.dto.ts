import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  MinLength,
  IsString,
  Matches,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z]([_]?[a-zA-Z0-9]+)*$/)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  @IsString()
  password: string;

  @IsDate()
  birthday: string;
}
