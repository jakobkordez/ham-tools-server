import { User } from 'src/schemas/user.schema';

export interface LoginData {
  user: User;
  refresh_token: string;
  access_token: string;
}
