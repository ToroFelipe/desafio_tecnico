import type { MockUser } from '../types';
import { normalizeRut } from '../utils/rut';

const users: MockUser[] = [
  {
    id: 'usr_001',
    email: 'usr_001@test.cl',
    passwordHash: '$2a$10$YfK2LggL2tLm6c2hUXxl4eJaXv0pV2kI2c0NFmF7IfRjYIeUSaBr6',
    role: 'admin',
  },
  {
    id: 'usr_002',
    email: 'usr_002@test.cl',
    passwordHash: '$2a$10$GigtSFHyEoI.4.kd3FO18evXnFi8Gt64GdgmLnw4GUDqitM7GyHia',
    role: 'user',
    rut: '12.345.678-5',
  },
  {
    id: 'usr_003',
    email: 'usr_003@test.cl',
    passwordHash: '$2a$10$N.dk2p2Pw2uCWiRHVllbcujt.gSUa2LxoMaHubp0nGyTIn.plmOXy',
    role: 'user',
    rut: '18.756.066-7',
  },
];

export function findUserByEmail(email: string): MockUser | undefined {
  const target = email.trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === target);
}

export function getNormalizedRut(user: MockUser): string | undefined {
  return user.rut ? normalizeRut(user.rut) : undefined;
}