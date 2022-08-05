import {
  IsAlphanumeric,
  IsArray,
  IsAscii,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(5, { message: 'Username must be at least 5 characters long' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsAscii({ each: true, message: 'Callsign contains non-ascii characters' })
  @IsOptional()
  callsigns: string[];
}
