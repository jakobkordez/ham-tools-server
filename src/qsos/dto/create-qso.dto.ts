import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateQsoDto {
  @IsOptional()
  @IsInt()
  ownerId: number;

  @IsOptional()
  @IsDateString()
  created_at: string;

  @IsDateString()
  datetime_on: Date;

  @IsOptional()
  @IsDateString()
  datetime_off: Date;

  @IsString()
  @MinLength(3)
  callsign: string;

  @IsOptional()
  @IsString()
  operator: string;

  @IsInt()
  profileId: number;

  @IsInt()
  frequency: number;

  @IsString()
  mode: string;

  @IsOptional()
  @IsString()
  rst_sent: string;

  @IsOptional()
  @IsString()
  rst_rcvd: string;

  @IsOptional()
  @IsString()
  gridsquare: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsString()
  contest_id: string;

  @IsOptional()
  @IsInt()
  serial_received: number;

  @IsOptional()
  @IsInt()
  serial_sent: number;

  @IsOptional()
  @IsString()
  contest_info_received: string;

  @IsOptional()
  @IsString()
  contest_info_sent: string;
}
