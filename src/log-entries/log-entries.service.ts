import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
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
    return logEntry.save();
  }

  createMany(createLogEntryDto: CreateLogEntryDto[]): Promise<LogEntry[]> {
    const logEntries = createLogEntryDto.map(
      (dto) => new this.logEntryModel(dto),
    );
    return this.logEntryModel.insertMany(logEntries);
  }

  count({ owner, after, before }): Promise<number> {
    const q: FilterQuery<LogEntryDocument> = {};
    if (owner) {
      q.owner = owner;
    }
    if (after && before) {
      q.datetime_on = { $gte: after, $lte: before };
    } else if (after) {
      q.datetime_on = { $gt: after };
    } else if (before) {
      q.datetime_on = { $lt: before };
    }

    return this.logEntryModel.find(q).count().exec();
  }

  findAll({ owner, after, before }): Promise<LogEntry[]> {
    const q: FilterQuery<LogEntryDocument> = {};
    if (owner) {
      q.owner = owner;
    }
    if (after && before) {
      q.datetime_on = { $gte: after, $lte: before };
    } else if (after) {
      q.datetime_on = { $gt: after };
    } else if (before) {
      q.datetime_on = { $lt: before };
    }

    return this.logEntryModel.find(q).sort({ datetime_on: -1 }).exec();
  }

  async findOne(id: string): Promise<LogEntry> {
    const entry = await this.logEntryModel.findById(id).exec();
    if (!entry) throw new NotFoundException('Log entry not found');
    return entry;
  }

  async update(id: string, update: UpdateLogEntryDto): Promise<LogEntry> {
    const entry = await this.logEntryModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
    if (!entry) throw new NotFoundException('Log entry not found');
    return entry;
  }

  async remove(id: string): Promise<void> {
    const entry = await this.logEntryModel.findByIdAndRemove(id).exec();
    if (!entry) throw new NotFoundException('Log entry not found');
  }
}
