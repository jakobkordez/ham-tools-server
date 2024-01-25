import { PartialType } from '@nestjs/mapped-types';
import { CreateQsoDto } from './create-qso.dto';

export class UpdateQsoDto extends PartialType(CreateQsoDto) {}
