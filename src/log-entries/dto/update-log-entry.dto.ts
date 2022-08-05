import { PartialType } from '@nestjs/mapped-types';
import { CreateLogEntryDto } from './create-log-entry.dto';

export class UpdateLogEntryDto extends PartialType(CreateLogEntryDto) {}
