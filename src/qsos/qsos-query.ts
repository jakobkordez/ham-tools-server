import { IsBooleanString, IsNumberString, IsOptional } from 'class-validator';

export class QsosQuery {
  @IsOptional()
  @IsBooleanString()
  all = 'false';

  @IsOptional()
  @IsNumberString()
  skip = '0';

  @IsOptional()
  @IsNumberString()
  limit = '1';
}
