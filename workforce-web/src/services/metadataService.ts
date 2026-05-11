import { http } from '../api/http';

export interface LookupItem {
  id: number;
  name: string;
}

export const metadataService = {
  async getRoles(): Promise<LookupItem[]> {
    try {
      const response = await http.get<any[]>('/api/roles');
      return response.data.map(item => ({ id: item.roleId, name: item.roleName }));
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },

  async getCountries(): Promise<LookupItem[]> {
    try {
      const response = await http.get<any[]>('/api/countries');
      return response.data.map(item => ({ id: item.countryId, name: item.countryName }));
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },

  async getCities(countryId?: number): Promise<LookupItem[]> {
    try {
      const params = countryId ? { countryId } : {};
      const response = await http.get<any[]>('/api/cities', { params });
      return response.data.map(item => ({ id: item.cityId, name: item.cityName }));
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  },

  async getStatus(): Promise<LookupItem[]> {
    try {
      const response = await http.get<any[]>('/api/status');
      return response.data.map(item => ({ id: item.statusId, name: item.description }));
    } catch (error) {
      console.error('Error fetching status:', error);
      return [];
    }
  },
};
