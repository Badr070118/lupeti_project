import { Role } from '../../common/enums/role.enum';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface AuthResponseDto {
  accessToken: string;
  user: AuthenticatedUser;
}
