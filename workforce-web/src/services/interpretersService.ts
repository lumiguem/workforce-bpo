import { http } from '@/api/http';
import { InterpreterRosterItem, InterpreterStatus } from '@/types';

type InterpreterWithDetailsResponse = {
  employeeId: number;
  firstName: string | null;
  lastName: string | null;
  companyEmail: string | null;
  personalEmail: string | null;
  phoneNumber: string | null;
  roleId: number | null;
  cityId: number | null;
  countryId: number | null;
  statusId: number | null;
  reportsTo: number | null;
  createdAt: string | null;
  details: null | {
    interpreterId: number;
    waveId: number | null;
    contractId: number | null;
    startDate: string | null;
    nestingDate: string | null;
    productionStartDate: string | null;
  };
};

function statusFromStatusId(statusId: number | null): InterpreterStatus {
  switch (statusId) {
    case 1: return 'available';
    case 2: return 'on-call';
    case 3: return 'break';
    case 4: return 'training';
    default: return 'offline';
  }
}

function toRosterItem(dto: InterpreterWithDetailsResponse): InterpreterRosterItem {
  return {
    employeeId: dto.employeeId,
    firstName: dto.firstName,
    lastName: dto.lastName,
    companyEmail: dto.companyEmail,
    personalEmail: dto.personalEmail,
    phoneNumber: dto.phoneNumber,
    roleId: dto.roleId,
    cityId: dto.cityId,
    countryId: dto.countryId,
    statusId: dto.statusId,
    reportsTo: dto.reportsTo,
    waveId: dto.details?.waveId ?? null,
    startDate: dto.details?.startDate ?? null,
    nestingDate: dto.details?.nestingDate ?? null,
    productionStartDate: dto.details?.productionStartDate ?? null,
    status: statusFromStatusId(dto.statusId),
  };
}

export async function listInterpretersForRoster(): Promise<InterpreterRosterItem[]> {
  const response = await http.get<InterpreterWithDetailsResponse[]>('/api/interpreters');
  return response.data.map(toRosterItem);
}

