import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  profile_name: string;

  @IsString()
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
  cq_zone: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  itu_zone: number;

  @IsOptional()
  @IsString()
  @Matches(/^[A-R]{2}(\d\d([A-X]{2})?)*$/i)
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
