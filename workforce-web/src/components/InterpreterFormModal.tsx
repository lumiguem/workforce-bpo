import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Globe, Layers, Save, Search, User, X } from 'lucide-react';
import { Employee, Wave } from '@/types';
import { LookupItem, metadataService } from '@/services/metadataService';
import { interpreterSetupService } from '@/services/interpreterSetupService';

interface InterpreterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employees: Employee[];
  waves: Wave[];
  languages: LookupItem[];
}

export function InterpreterFormModal({
  isOpen,
  onClose,
  onSuccess,
  employees,
  waves,
  languages,
}: InterpreterFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [waveId, setWaveId] = useState('');
  const [languageId, setLanguageId] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<LookupItem[]>(languages);

  useEffect(() => {
    if (!isOpen) return;

    setSearch('');
    setEmployeeId('');
    setWaveId('');
    setLanguageId('');
    setDropdownOpen(false);
    setAvailableLanguages(languages);
  }, [isOpen, languages]);

  useEffect(() => {
    if (!isOpen) return;

    if (languages.length > 0) {
      setAvailableLanguages(languages);
      return;
    }

    metadataService.getLanguages().then(setAvailableLanguages).catch(() => undefined);
  }, [isOpen, languages]);

  const interpreterEmployees = useMemo(
    () => employees.filter((employee) => employee.roleId === 1),
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    if (!searchLower) return interpreterEmployees;

    return interpreterEmployees.filter((employee) => {
      const fullName = `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim().toLowerCase();
      const email = (employee.companyEmail ?? '').toLowerCase();
      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        String(employee.employeeId).includes(searchLower)
      );
    });
  }, [interpreterEmployees, search]);

  const selectedEmployee = useMemo(
    () => interpreterEmployees.find((employee) => String(employee.employeeId) === employeeId) ?? null,
    [employeeId, interpreterEmployees],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!employeeId || !waveId || !languageId) return;

    setLoading(true);
    try {
      await interpreterSetupService.createInterpreterSetup({
        interpreterId: Number(employeeId),
        waveId: Number(waveId),
        languageId: Number(languageId),
        contractId: 1,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating interpreter:', error);
      alert('No se pudo crear el intérprete. Verifique los datos seleccionados.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-blue-400">Roster</p>
            <h2 className="mt-1 text-xl font-bold text-white">Crear intérprete</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(100vh-180px)] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <User size={14} />
                Buscar empleado intérprete
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder="Escribe nombre, email o id..."
                  className="w-full rounded-xl border border-white/10 bg-[#080C16] px-4 py-3 pr-10 text-white outline-none transition-colors focus:border-blue-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />

                {dropdownOpen && filteredEmployees.length > 0 && (
                  <div className="absolute z-10 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-white/10 bg-[#0A0F1A] shadow-2xl">
                    {filteredEmployees.map((employee) => (
                      <button
                        key={employee.employeeId}
                        type="button"
                        onClick={() => {
                          setEmployeeId(String(employee.employeeId));
                          setSearch(`${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim());
                          setDropdownOpen(false);
                        }}
                        className="flex w-full items-center justify-between gap-4 border-b border-white/5 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-white/5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {employee.firstName ?? '-'} {employee.lastName ?? '-'}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            #{employee.employeeId} {employee.companyEmail ?? ''}
                          </p>
                        </div>
                        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-300">
                          Role 1
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {dropdownOpen && search.trim().length > 0 && filteredEmployees.length === 0 && (
                  <div className="absolute z-10 mt-2 w-full rounded-2xl border border-white/10 bg-[#0A0F1A] px-4 py-3 text-sm text-slate-400 shadow-2xl">
                    No se encontraron empleados con roleId = 1.
                  </div>
                )}
              </div>
              {selectedEmployee && (
                <p className="text-xs text-slate-500">
                  Seleccionado: <span className="text-slate-300">{selectedEmployee.firstName} {selectedEmployee.lastName}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <Layers size={14} />
                Wave
              </label>
              <select
                required
                value={waveId}
                onChange={(event) => setWaveId(event.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-[#080C16] px-4 py-3 text-white outline-none transition-colors focus:border-blue-500"
              >
                <option value="">Selecciona una wave</option>
                {waves.map((wave) => (
                  <option key={wave.waveId} value={wave.waveId}>
                    {wave.waveName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <Globe size={14} />
                Idioma
              </label>
              <select
                required
                value={languageId}
                onChange={(event) => setLanguageId(event.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-[#080C16] px-4 py-3 text-white outline-none transition-colors focus:border-blue-500"
              >
                <option value="">Selecciona un idioma</option>
                {availableLanguages.map((language) => (
                  <option key={language.id} value={language.id}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <ChevronDown size={14} />
                Contract ID
              </label>
              <div className="rounded-xl border border-white/10 bg-[#080C16] px-4 py-3 text-sm text-slate-300">
                1
              </div>
              <p className="text-xs text-slate-500">Por ahora se asigna de forma fija.</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !employeeId || !waveId || !languageId}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-600/50"
            >
              {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={16} />}
              {loading ? 'Guardando...' : 'Crear intérprete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
