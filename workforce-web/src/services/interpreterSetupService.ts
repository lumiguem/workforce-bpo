import { http } from '@/api/http';

export interface CreateInterpreterSetupPayload {
  interpreterId: number;
  waveId: number;
  languageId: number;
  contractId?: number;
}

export const interpreterSetupService = {
  async createInterpreterSetup(payload: CreateInterpreterSetupPayload): Promise<void> {
    const contractId = payload.contractId ?? 1;
    await http.post(`/api/interpreters/${payload.interpreterId}/setup`, {
      waveId: payload.waveId,
      languageId: payload.languageId,
      contractId,
      startDate: null,
      nestingDate: null,
      productionStartDate: null,
    });
  },
};
