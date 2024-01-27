import { Profile } from 'src/profiles/profile.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Login } from '../../auth/entities/login.entity';
import { Qso } from 'src/qsos/entities/qso.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => Login, (login) => login.user)
  logins: Login[];

  @OneToMany(() => Profile, (profile) => profile.owner)
  profiles: Profile[];

  @OneToMany(() => Qso, (qso) => qso.owner)
  qsos: Qso[];
}
