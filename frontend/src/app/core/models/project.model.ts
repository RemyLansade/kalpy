import { UserProfile } from './user.model';

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  owner: UserProfile;
}