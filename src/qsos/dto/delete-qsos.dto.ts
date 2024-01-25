import { IsArray, IsInt } from 'class-validator';

export class DeleteQsosDto {
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}
