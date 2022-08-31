import {
  IsBooleanString,
  IsDateString,
  IsMongoId,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class LogEntriesQuery {
  @IsOptional()
  @IsBooleanString()
  all: string = 'false';

  @IsOptional()
  @IsMongoId()
  cursorId: string;

  @IsOptional()
  @IsDateString()
  cursorDate: string;

  @IsOptional()
  @IsNumberString()
  limit: string = '1';
}
