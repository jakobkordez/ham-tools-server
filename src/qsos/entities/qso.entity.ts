import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Profile } from 'src/profiles/profile.entity';

@Entity()
export class Qso {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.qsos)
  owner: User;

  @RelationId((qso: Qso) => qso.owner)
  ownerId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  datetime_on: Date;

  @Column({ type: 'timestamp', nullable: true })
  datetime_off: Date;

  @Column()
  callsign: string;

  @Column({ nullable: true })
  operator: string;

  @ManyToOne(() => Profile, (profile) => profile.qsos, { nullable: true })
  profile: Profile;

  @RelationId((qso: Qso) => qso.profile)
  profileId: number;

  @Column()
  frequency: number;

  @Column()
  mode: string;

  @Column({ nullable: true })
  rst_sent: string;

  @Column({ nullable: true })
  rst_rcvd: string;

  @Column({ nullable: true })
  gridsquare: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ nullable: true })
  contest_id: string;

  @Column({ nullable: true })
  serial_received: number;

  @Column({ nullable: true })
  serial_sent: number;

  @Column({ nullable: true })
  contest_info_received: string;

  @Column({ nullable: true })
  contest_info_sent: string;
}
