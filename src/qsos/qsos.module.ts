import { Module } from '@nestjs/common';
import { QsosService } from './qsos.service';
import { QsosController } from './qsos.controller';
import { Qso } from 'src/qsos/entities/qso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Qso]), ProfilesModule],
  controllers: [QsosController],
  providers: [QsosService],
})
export class QsosModule {}
