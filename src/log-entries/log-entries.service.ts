import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogEntry, LogEntryDocument } from 'src/schemas/log-entry.schema';
import { CreateLogEntryDto } from './dto/create-log-entry.dto';
import { UpdateLogEntryDto } from './dto/update-log-entry.dto';

@Injectable()
export class LogEntriesService {
  constructor(
    @InjectModel(LogEntry.name) private logEntryModel: Model<LogEntryDocument>,
  ) {}

  create(createLogEntryDto: CreateLogEntryDto): Promise<LogEntry> {
    const logEntry = new this.logEntryModel(createLogEntryDto);
    logEntry.data = Object.fromEntries(
      Object.entries(logEntry.data).map(([key, value]) => [
        key.toUpperCase(),
        value,
      ]),
    );
    return logEntry.save();
  }

  createMany(createLogEntryDto: CreateLogEntryDto[]): Promise<LogEntry[]> {
    const logEntries = createLogEntryDto.map(
      (dto) => new this.logEntryModel(dto),
    );
    return this.logEntryModel.insertMany(logEntries);
  }

  findAll(): Promise<LogEntry[]> {
    return this.logEntryModel.find().exec();
  }

  findOne(id: string): Promise<LogEntry> {
    return this.logEntryModel.findById(id).exec();
  }

  update(id: string, updateLogEntryDto: UpdateLogEntryDto): Promise<LogEntry> {
    return this.logEntryModel
      .findByIdAndUpdate(id, updateLogEntryDto, { new: true })
      .exec();
  }

  remove(id: string): Promise<LogEntry> {
    return this.logEntryModel.findByIdAndRemove(id).exec();
  }
}
