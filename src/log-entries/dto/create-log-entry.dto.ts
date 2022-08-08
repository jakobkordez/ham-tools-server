import { IsDateString, IsMongoId, IsObject, IsOptional } from 'class-validator';

export class CreateLogEntryDto {
  @IsOptional()
  @IsMongoId()
  owner: string;

  @IsOptional()
  @IsDateString()
  created_at: string;

  @IsObject()
  data: object;

  datetime_on: Date;
}
