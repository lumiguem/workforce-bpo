import { http } from '../api/http';
import { Wave } from '../types';

export const waveService = {
  async getAllWaves(): Promise<Wave[]> {
    const response = await http.get<Wave[]>('/api/waves');
    return response.data;
  },

  async getWaveById(id: number): Promise<Wave> {
    const response = await http.get<Wave>(`/api/waves/${id}`);
    return response.data;
  },

  async createWave(wave: Partial<Wave>): Promise<Wave> {
    const response = await http.post<Wave>('/api/waves', wave);
    return response.data;
  },

  async updateWave(id: number, wave: Partial<Wave>): Promise<Wave> {
    const response = await http.put<Wave>(`/api/waves/${id}`, wave);
    return response.data;
  },

  async deleteWave(id: number): Promise<void> {
    await http.delete(`/api/waves/${id}`);
  },
};
