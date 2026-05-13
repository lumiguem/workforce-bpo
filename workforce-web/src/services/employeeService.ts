import { http } from '../api/http';
import { Employee } from '../types';

export const employeeService = {
  async getAllEmployees(params?: { roleId?: number }): Promise<Employee[]> {
    const response = await http.get<Employee[]>('/api/employees', { params });
    return response.data;
  },

  async getEmployeeById(id: number): Promise<Employee> {
    const response = await http.get<Employee>(`/api/employees/${id}`);
    return response.data;
  },

  async createEmployee(employee: Partial<Employee>): Promise<Employee> {
    const response = await http.post<Employee>('/api/employees', employee);
    return response.data;
  },

  async updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee> {
    const response = await http.put<Employee>(`/api/employees/${id}`, employee);
    return response.data;
  },

  async deleteEmployee(id: number): Promise<void> {
    await http.delete(`/api/employees/${id}`);
  },
};
