import { Session } from 'next-auth';

export enum UserRole {
  ADMIN = 'admin',
  PLANNER = 'planner',
  GUEST = 'guest'
}

export type UserRoleType = `${UserRole}`;

// Funções utilitárias para verificação de roles
export function isAdmin(session: Session): boolean {
  return session?.user.role === UserRole.ADMIN;
}

export function isPlanner(session: Session): boolean {
  return session?.user.role === UserRole.PLANNER;
}

export function isAdminOrPlanner(session: Session): boolean {
  return isAdmin(session) || isPlanner(session);
}

export function isGuest(session: Session): boolean {
  return session?.user.role === UserRole.GUEST;
} 

