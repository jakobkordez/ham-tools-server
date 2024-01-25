import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseArrayPipe,
  ParseIntPipe,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { QsosService } from './qsos.service';
import { CreateQsoDto } from './dto/create-qso.dto';
import { UpdateQsoDto } from './dto/update-qso.dto';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { QsosQuery } from './qsos-query';
import { UserTokenData } from 'src/interfaces/user-token-data.interface';
import { ProfilesService } from 'src/profiles/profiles.service';
import { DeleteQsosDto } from './dto/delete-qsos.dto';

@Controller('log')
export class QsosController {
  constructor(
    private readonly qsosService: QsosService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Post()
  async create(
    @RequestUser() user: UserTokenData,
    @Body() createQsoDto: CreateQsoDto,
  ) {
    if (createQsoDto.profileId) {
      const profile = await this.profilesService.findOne(
        createQsoDto.profileId,
      );
      if (!profile) throw new NotFoundException('Profile not found');
    }

    createQsoDto.ownerId = user.id;
    return this.qsosService.create(createQsoDto);
  }

  @Post('many')
  createMany(
    @RequestUser() user: UserTokenData,
    @Body(new ParseArrayPipe({ items: CreateQsoDto }))
    createQsoDto: CreateQsoDto[],
  ) {
    createQsoDto.forEach((entry) => {
      entry.ownerId = user.id;
    });
    return this.qsosService.createMany(createQsoDto);
  }

  @Get('count')
  count(@RequestUser() user: UserTokenData, @Query('all') all = false) {
    const userId = all ? undefined : user.id;

    return this.qsosService.count({ owner: userId });
  }

  @Get()
  findAll(@RequestUser() user: UserTokenData, @Query() query: QsosQuery) {
    const userId = query.all ? undefined : user.id;

    return this.qsosService.findAll({
      owner: userId,
      limit: query.limit,
      skip: query.skip,
    });
  }

  @Get(':id')
  async findOne(
    @RequestUser() user: UserTokenData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const qso = await this.qsosService.findOne(id, user.id);
    if (!qso) throw new NotFoundException('Qso not found');
    return qso;
  }

  @Patch(':id')
  async update(
    @RequestUser() user: UserTokenData,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQsoDto: UpdateQsoDto,
  ) {
    const qso = await this.qsosService.update(id, user.id, updateQsoDto);
    if (!qso) throw new NotFoundException('Qso not found');
    return qso;
  }

  @Delete(':id')
  async remove(
    @RequestUser() user: UserTokenData,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const res = await this.qsosService.remove(id, user.id);
    if (!res) throw new NotFoundException('Qso not found');
  }

  @Delete()
  removeMany(@RequestUser() user: UserTokenData, @Body() body: DeleteQsosDto) {
    const res = this.qsosService.removeMany(body.ids, user.id);
    return { deleted: res };
  }
}
