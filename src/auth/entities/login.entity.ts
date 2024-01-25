import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Login {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.logins)
  user: User;

  @RelationId((login: Login) => login.user)
  userId: number;

  @Column()
  token: string;

  @Column({ nullable: true })
  data: string;
}
