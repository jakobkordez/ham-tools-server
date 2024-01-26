import { Injectable, NotFoundException } from '@nestjs/common';
import { Qso } from 'src/qsos/entities/qso.entity';
import { CreateQsoDto } from './dto/create-qso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { UpdateQsoDto } from './dto/update-qso.dto';

@Injectable()
export class QsosService {
  constructor(@InjectRepository(Qso) private qsosRepository: Repository<Qso>) {}

  create(createQsoDto: CreateQsoDto): Promise<Qso> {
    const qso = new Qso();
    Object.assign(qso, createQsoDto);
    qso.profileId = createQsoDto.profileId;
    return this.qsosRepository.save(qso);
  }

  createMany(createQsoDto: CreateQsoDto[]): Promise<Qso[]> {
    const qsos = createQsoDto.map((dto) => {
      const qso = new Qso();
      qso.ownerId = dto.ownerId;
      Object.assign(qso, createQsoDto);
      return qso;
    });
    return this.qsosRepository.save(qsos);
  }

  count({ owner }): Promise<number> {
    const q: FindManyOptions<Qso> = {};
    if (owner) {
      q.where = { ownerId: owner };
    }

    return this.qsosRepository.count();
  }

  async findAll({ owner, skip, limit }): Promise<Qso[]> {
    let q: FindOptionsWhere<Qso> = {};
    if (owner) {
      q = { ownerId: owner };
    }
    // if (cursorId && cursorDate) {
    //   cursorDate = new Date(cursorDate);
    //   q.$or = [
    //     { datetime_on: { $lt: cursorDate } },
    //     {
    //       $and: [
    //         { datetime_on: { $eq: cursorDate } },
    //         { _id: { $lt: cursorId } },
    //       ],
    //     },
    //   ];
    // }

    const qsos = await this.qsosRepository.find({
      where: q,
      order: { datetime_on: 'DESC', id: 'DESC' },
      take: limit,
      skip,
    });
    return qsos;
  }

  async findOne(id: number, userId: number): Promise<Qso> {
    const entry = await this.qsosRepository.findOneBy({ id, ownerId: userId });
    if (!entry) throw new NotFoundException('Log entry not found');
    return entry;
  }

  async update(id: number, userId: number, update: UpdateQsoDto): Promise<Qso> {
    const entry = await this.qsosRepository.update(
      { id, ownerId: userId },
      update,
    );
    if (!entry.affected) null;
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const res = await this.qsosRepository.delete({ id, ownerId: userId });
    return !!res.affected;
  }

  async removeMany(ids: number[], userId: number): Promise<number> {
    const res = await this.qsosRepository.delete({
      id: In(ids),
      ownerId: userId,
    });
    return res.affected ?? 0;
  }
}
