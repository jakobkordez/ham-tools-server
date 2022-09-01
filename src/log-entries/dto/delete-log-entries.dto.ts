import { IsArray, IsMongoId } from 'class-validator';

export class DeleteLogEntriesDto {
  @IsArray()
  @IsMongoId({ each: true })
  ids: string[];
}
