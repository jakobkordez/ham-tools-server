import { Injectable, NotFoundException } from '@nestjs/common';
import { Qso } from 'src/qsos/entities/qso.entity';
import { CreateQsoDto } from './dto/create-qso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { UpdateQsoDto } from './dto/update-qso.dto';

@Injectable()
export class QsosService {
  constructor(@InjectRepository(Qso) private qsosRepository: Repository<Qso>) {}

  create(userId: string, createQsoDto: CreateQsoDto): Promise<Qso> {
    const qso = new Qso();
    Object.assign(qso, createQsoDto);
    qso.ownerId = userId;
    return this.qsosRepository.save(qso);
  }

  createMany(userId: string, createQsoDto: CreateQsoDto[]): Promise<Qso[]> {
    const qsos = createQsoDto.map((dto) => {
      const qso = new Qso();
      qso.ownerId = userId;
      Object.assign(qso, dto);
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

  async findOne(id: number, userId: string): Promise<Qso> {
    const entry = await this.qsosRepository.findOneBy({ id, ownerId: userId });
    if (!entry) throw new NotFoundException('QSO not found');
    return entry;
  }

  async update(id: number, userId: string, update: UpdateQsoDto): Promise<Qso> {
    const entry = await this.qsosRepository.update(
      { id, ownerId: userId },
      update,
    );
    if (!entry.affected) null;
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: string): Promise<boolean> {
    const res = await this.qsosRepository.delete({ id, ownerId: userId });
    return !!res.affected;
  }

  async removeMany(ids: number[], userId: string): Promise<number> {
    const res = await this.qsosRepository.delete({
      id: In(ids),
      ownerId: userId,
    });
    return res.affected ?? 0;
  }
}
