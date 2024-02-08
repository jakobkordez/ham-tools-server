import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Profile } from 'src/profiles/profile.entity';

@Entity()
export class Qso {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.qsos)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  callsign: string;

  @Column({ type: 'timestamp' })
  datetimeOn: Date;

  @Column()
  frequency: number;

  @Column()
  mode: string;

  @ManyToOne(() => Profile, (profile) => profile.qsos)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @Column({ nullable: true })
  profileId: number;

  @Column({ type: 'jsonb', nullable: true })
  otherFields: object;
}
