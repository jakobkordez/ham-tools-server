import { Qso } from 'src/qsos/entities/qso.entity';
import { User } from '../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.profiles)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

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
