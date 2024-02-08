import {
  IsDateString,
  IsISO8601,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateQsoDto {
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  createdAt: string;

  @IsString()
  @MinLength(3)
  callsign: string;

  @IsISO8601()
  datetimeOn: Date;

  @IsInt()
  frequency: number;

  @IsString()
  mode: string;

  @IsOptional()
  @IsInt()
  profileId: number;

  @IsOptional()
  @IsJSON()
  otherFields: object;
}
