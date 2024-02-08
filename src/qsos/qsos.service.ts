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
      order: { datetimeOn: 'DESC', id: 'DESC' },
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

  async stats(userId: string): Promise<any> {
    const byMode = await this.qsosRepository
      .createQueryBuilder('qso')
      .select('mode, COUNT(*) as count')
      .where('"ownerId" = :userId', { userId })
      .groupBy('mode')
      .getRawMany();

    // Bad code, but Fck it
    const byBandRaw = await this.qsosRepository
      .createQueryBuilder('qso')
      .select('(frequency / 1000000) as mhz, COUNT(*) as count')
      .where('"ownerId" = :userId', { userId })
      .groupBy('mhz')
      .orderBy('mhz')
      .getRawMany();

    const bands = {
      '160m': [1, 2],
      '80m': [3, 3],
      '60m': [5, 5],
      '40m': [7, 7],
      '30m': [10, 10],
      '20m': [14, 14],
      '17m': [18, 18],
      '15m': [21, 21],
      '12m': [24, 24],
      '10m': [28, 29],
      '6m': [50, 54],
      '4m': [70, 70],
      '2m': [144, 146],
      '70cm': [430, 440],
    };

    const byBand = [];
    for (const [name, [from, to]] of Object.entries(bands)) {
      const count = byBandRaw.reduce((acc, { mhz, count }) => {
        const freq = parseInt(mhz);
        if (freq >= from && freq <= to) {
          return acc + parseInt(count);
        }
        return acc;
      }, 0);
      byBand.push({ band: name, count });
    }

    return { byMode, byBand };
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
