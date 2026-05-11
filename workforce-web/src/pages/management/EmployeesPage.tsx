import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Search, Mail, Phone, MapPin, ShieldCheck, UserCircle } from 'lucide-react';
import { Employee } from '@/types';
import { employeeService } from '@/services/employeeService';
import { EmployeeFormModal } from '@/components/EmployeeFormModal';

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.companyEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toString().includes(searchTerm)
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-blue-500" />
            Gestión de Personal
          </h1>
          <p className="text-slate-400">Administra los empleados y sus roles en el sistema.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20"
        >
          <UserPlus size={18} />
          Nuevo Empleado
        </button>
      </div>

      <div className="glass rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre, ID o email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-white/10">
                <th className="px-6 py-4">Empleado</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Ubicación</th>
                <th className="px-6 py-4">Rol / Estado</th>
                <th className="px-6 py-4">Reporta a</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Users size={48} className="mx-auto mb-4 opacity-20 animate-pulse" />
                    <p>Cargando lista de empleados...</p>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <p>No se encontraron empleados.</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.employeeId} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold border border-blue-500/20">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium">{employee.firstName} {employee.lastName}</p>
                          <p className="text-xs text-slate-500">ID: {employee.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Mail size={14} className="text-blue-500/70" />
                          <span>{employee.companyEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone size={14} />
                          <span>{employee.phoneNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin size={14} className="text-red-500/70" />
                        <span>{employee.cityName}, {employee.countryCode}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 ml-6">{employee.countryName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-emerald-500/70" />
                          <span className="text-xs font-medium text-slate-300">{employee.roleName}</span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                          employee.statusId === 1 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {employee.statusDescription}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {employee.reportsToName ? (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <UserCircle size={14} className="text-slate-500" />
                          <span>{employee.reportsToName}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">Sin supervisor</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadEmployees}
        employees={employees}
      />
    </div>
  );
}
