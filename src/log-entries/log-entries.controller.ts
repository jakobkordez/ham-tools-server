import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { LogEntriesService } from './log-entries.service';
import { CreateLogEntryDto } from './dto/create-log-entry.dto';
import { UpdateLogEntryDto } from './dto/update-log-entry.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from 'src/schemas/user.schema';
import { MapLogEntryPipe } from 'src/pipes/map-log-entry.pipe';
import { MapLogEntryArrayPipe } from 'src/pipes/map-log-entry-array.pipe';
import { LogEntriesQuery } from './log-entries-query';
import { DeleteLogEntriesDto } from './dto/delete-log-entries.dto';

@Controller('log')
export class LogEntriesController {
  constructor(private readonly logEntriesService: LogEntriesService) {}

  @Post()
  create(
    @RequestUser() user: User,
    @Body(MapLogEntryPipe) createLogEntryDto: CreateLogEntryDto,
  ) {
    createLogEntryDto.owner = user.id;
    return this.logEntriesService.create(createLogEntryDto);
  }

  @Post('many')
  createMany(
    @RequestUser() user: User,
    @Body(
      new ParseArrayPipe({ items: CreateLogEntryDto }),
      MapLogEntryArrayPipe,
    )
    createLogEntryDto: CreateLogEntryDto[],
  ) {
    createLogEntryDto.forEach((entry) => {
      entry.owner = user.id;
    });
    return this.logEntriesService.createMany(createLogEntryDto);
  }

  @Get('count')
  count(@RequestUser() user: User, @Query('all') all: boolean = false) {
    var userId = user.id;
    if (all) {
      userId = undefined;
    }

    return this.logEntriesService.count({ owner: userId });
  }

  @Get()
  findAll(@RequestUser() user: User, @Query() query: LogEntriesQuery) {
    var userId = user.id;
    if (query.all) {
      userId = undefined;
    }

    return this.logEntriesService.findAll({
      owner: userId,
      cursorId: query.cursorId,
      cursorDate: query.cursorDate,
      limit: query.limit,
    });
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.logEntriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body(MapLogEntryPipe) updateLogEntryDto: UpdateLogEntryDto,
  ) {
    return this.logEntriesService.update(id, updateLogEntryDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.logEntriesService.remove(id);
  }

  @Delete()
  removeMany(@Body() ids: DeleteLogEntriesDto) {
    return this.logEntriesService.removeMany(ids.ids);
  }
}
