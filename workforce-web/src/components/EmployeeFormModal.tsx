import React, { useEffect, useState } from 'react';
import { X, Save, User, Mail, Phone, MapPin, Shield, UserCircle, Activity } from 'lucide-react';
import { Employee } from '@/types';
import { metadataService, LookupItem } from '@/services/metadataService';
import { employeeService } from '@/services/employeeService';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employees: Employee[]; // For reportsTo selection
}

export function EmployeeFormModal({ isOpen, onClose, onSuccess, employees }: EmployeeFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<LookupItem[]>([]);
  const [countries, setCountries] = useState<LookupItem[]>([]);
  const [cities, setCities] = useState<LookupItem[]>([]);
  const [statuses, setStatuses] = useState<LookupItem[]>([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyEmail: '',
    personalEmail: '',
    phoneNumber: '',
    roleId: '',
    countryId: '',
    cityId: '',
    statusId: '',
    reportsTo: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadMetadata();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.countryId) {
      loadCities(parseInt(formData.countryId));
    } else {
      setCities([]);
    }
  }, [formData.countryId]);

  const loadMetadata = async () => {
    try {
      const [r, co, s] = await Promise.all([
        metadataService.getRoles(),
        metadataService.getCountries(),
        metadataService.getStatus()
      ]);
      setRoles(r);
      setCountries(co);
      setStatuses(s);
    } catch (error) {
      console.error('Error loading metadata:', error);
    }
  };

  const loadCities = async (countryId: number) => {
    try {
      const c = await metadataService.getCities(countryId);
      setCities(c);
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        roleId: parseInt(formData.roleId),
        countryId: formData.countryId ? parseInt(formData.countryId) : null,
        cityId: formData.cityId ? parseInt(formData.cityId) : null,
        statusId: parseInt(formData.statusId),
        reportsTo: formData.reportsTo ? parseInt(formData.reportsTo) : null
      };
      await employeeService.createEmployee(payload as any);
      onSuccess();
      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        companyEmail: '',
        personalEmail: '',
        phoneNumber: '',
        roleId: '',
        countryId: '',
        cityId: '',
        statusId: '',
        reportsTo: ''
      });
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Error al crear el empleado. Por favor verifique los datos.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0D1117] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="text-blue-500" />
            Nuevo Empleado
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombres y Apellidos */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <User size={14} /> Nombres *
              </label>
              <input
                required
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Ej: Juan"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <User size={14} /> Apellidos *
              </label>
              <input
                required
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Ej: Perez"
              />
            </div>

            {/* Emails */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Mail size={14} /> Email Corporativo *
              </label>
              <input
                required
                type="email"
                value={formData.companyEmail}
                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="juan.perez@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Mail size={14} /> Email Personal
              </label>
              <input
                type="email"
                value={formData.personalEmail}
                onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="juan@gmail.com"
              />
            </div>

            {/* Teléfono y Rol */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Phone size={14} /> Teléfono
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="+57 300..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Shield size={14} /> Rol *
              </label>
              <select
                required
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
              >
                <option value="">Seleccione un rol</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>

            {/* País y Ciudad */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <MapPin size={14} /> País
              </label>
              <select
                value={formData.countryId}
                onChange={(e) => setFormData({ ...formData, countryId: e.target.value, cityId: '' })}
                className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
              >
                <option value="">Seleccione un país</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <MapPin size={14} /> Ciudad
              </label>
              <select
                value={formData.cityId}
                onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                disabled={!formData.countryId}
              >
                <option value="">Seleccione una ciudad</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            {/* Estado y Reporta a */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Activity size={14} /> Estado *
              </label>
              <select
                required
                value={formData.statusId}
                onChange={(e) => setFormData({ ...formData, statusId: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
              >
                <option value="">Seleccione un estado</option>
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <UserCircle size={14} /> Reporta a
              </label>
              <select
                value={formData.reportsTo}
                onChange={(e) => setFormData({ ...formData, reportsTo: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
              >
                <option value="">Seleccione un supervisor</option>
                {employees.map(emp => (
                  <option key={emp.employeeId} value={emp.employeeId}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-8 py-2 rounded-lg transition-colors font-bold shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? 'Guardando...' : 'Crear Empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
