import { Module } from '@nestjs/common';
import { LogEntriesService } from './log-entries.service';
import { LogEntriesController } from './log-entries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogEntry, LogEntrySchema } from 'src/schemas/log-entry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LogEntry.name, schema: LogEntrySchema },
    ]),
  ],
  controllers: [LogEntriesController],
  providers: [LogEntriesService],
})
export class LogEntriesModule {}
