export type UserType = 'GUEST' | 'PARTICULAR' | 'PROFESSIONAL';

export interface UserProfile {
  id: string;
  type: UserType;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}

export interface ProfessionalProfile extends UserProfile {
  type: 'PROFESSIONAL';
  companyName: string;
  siret: string;
  siretValidated: boolean;
}