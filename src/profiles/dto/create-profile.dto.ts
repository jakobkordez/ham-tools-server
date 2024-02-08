import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUppercase,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  profileName: string;

  @IsString()
  @IsUppercase()
  @MinLength(3)
  @Matches(/^[A-Z0-9\/]*$/i, {
    message: 'Callsign can only contain A-Z, 0-9 and /',
  })
  callsign: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  dxcc: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cqZone: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  ituZone: number;

  @IsOptional()
  @IsString()
  @Matches(/^[A-R]{2}(\d\d[A-X]{2})*(\d\d)?$/i)
  gridsquare: string;

  @IsOptional()
  @IsString()
  qth: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  country: string;
}
