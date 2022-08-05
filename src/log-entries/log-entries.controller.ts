import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LogEntriesService } from './log-entries.service';
import { CreateLogEntryDto } from './dto/create-log-entry.dto';
import { UpdateLogEntryDto } from './dto/update-log-entry.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from 'src/schemas/user.schema';

@Controller('log')
export class LogEntriesController {
  constructor(private readonly logEntriesService: LogEntriesService) {}

  @Post()
  create(
    @RequestUser() user: User,
    @Body() createLogEntryDto: CreateLogEntryDto,
  ) {
    createLogEntryDto.owner = user.id;
    return this.logEntriesService.create(createLogEntryDto);
  }

  @Get()
  findAll() {
    return this.logEntriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.logEntriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateLogEntryDto: UpdateLogEntryDto,
  ) {
    return this.logEntriesService.update(id, updateLogEntryDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.logEntriesService.remove(id);
  }
}
