import { Qso } from 'src/qsos/entities/qso.entity';
import { User } from '../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.profiles)
  owner: User;

  @RelationId((profile: Profile) => profile.owner)
  ownerId: number;

  @Column()
  profile_name: string;

  @Column()
  callsign: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  dxcc: number;

  @Column({ nullable: true })
  cq_zone: number;

  @Column({ nullable: true })
  itu_zone: number;

  @Column({ nullable: true })
  gridsquare: string;

  @Column({ nullable: true })
  qth: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @OneToMany(() => Qso, (qso) => qso.profile)
  qsos: Qso[];
}
