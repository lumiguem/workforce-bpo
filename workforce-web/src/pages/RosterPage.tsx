import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Activity, LayoutGrid, List, Plus, Search, Users } from 'lucide-react';
import { Employee, InterpreterRosterItem, InterpreterStatus, Wave } from '@/types';
import { useInterpreters } from '@/hooks/useInterpreters';
import { InterpreterCard } from '@/components/InterpreterCard';
import { getStatusBgClass, getStatusBorderClass, getStatusTextClass } from '@/utils/interpreterUi';
import { InterpreterFormModal } from '@/components/InterpreterFormModal';
import { employeeService } from '@/services/employeeService';
import { waveService } from '@/services/waveService';
import { metadataService, LookupItem } from '@/services/metadataService';

export function RosterPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InterpreterStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedInterpreter, setSelectedInterpreter] = useState<InterpreterRosterItem | null>(null);
  const [isInterpreterModalOpen, setIsInterpreterModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [waves, setWaves] = useState<Wave[]>([]);
  const [languages, setLanguages] = useState<LookupItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const { interpreters, filtered, isLoading, error } = useInterpreters({ search, status: statusFilter, refreshKey });

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [employeeData, waveData, languageData] = await Promise.all([
          employeeService.getAllEmployees({ roleId: 1 }),
          waveService.getAllWaves(),
          metadataService.getLanguages(),
        ]);

        setEmployees(employeeData);
        setWaves(waveData);
        setLanguages(languageData);
      } catch (metadataError) {
        console.error('Error loading form metadata:', metadataError);
      }
    };

    loadFormData();
  }, []);

  const stats = useMemo(() => {
    return {
      total: interpreters.length,
      available: interpreters.filter((i) => i.status === 'available').length,
      onCall: interpreters.filter((i) => i.status === 'on-call').length,
      onBreak: interpreters.filter((i) => i.status === 'break').length,
    };
  }, [interpreters]);

  return (
    <>
      <header className="h-20 glass border-b border-[#1E293B] flex items-center justify-between px-8 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex gap-12 items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total</span>
            <span className="text-2xl font-bold tracking-tighter">{stats.total}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Disponibles</span>
            <span className="text-2xl font-bold tracking-tighter text-emerald-400">{stats.available}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsInterpreterModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300 transition-colors hover:bg-blue-500/20 hover:text-white"
          >
            <Plus size={16} />
            Crear intérprete
          </button>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-none">Roster</p>
            <p className="text-[10px] text-blue-400 font-medium uppercase mt-1">Operaciones</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0">
            <Users className="text-slate-400" size={20} />
          </div>
        </div>
      </header>

      <main className="p-8 space-y-8 flex-1">
        {error && (
          <div className="glass border border-red-500/30 bg-red-500/5 rounded-2xl p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass rounded-3xl p-5 border border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Total</p>
            <p className="text-2xl font-bold tracking-tighter text-white">{stats.total}</p>
          </div>
          <div className="glass rounded-3xl p-5 border border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Disponibles</p>
            <p className="text-2xl font-bold tracking-tighter text-emerald-400">{stats.available}</p>
          </div>
          <div className="glass rounded-3xl p-5 border border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">En llamada</p>
            <p className="text-2xl font-bold tracking-tighter text-amber-400">{stats.onCall}</p>
          </div>
          <div className="glass rounded-3xl p-5 border border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Break</p>
            <p className="text-2xl font-bold tracking-tighter text-red-400">{stats.onBreak}</p>
          </div>
          <div className="glass rounded-3xl p-5 border border-white/5 hidden md:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Actividad</p>
            <div className="flex items-center gap-2 text-slate-300">
              <Activity size={16} className="text-blue-400" />
              <span className="text-sm font-bold">Live</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Buscar (nombre, id, emails)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium placeholder:text-slate-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto scrollbar-hide">
              {(['all', 'available', 'on-call', 'break', 'offline'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-1.5 text-[10px] uppercase font-bold rounded-lg transition-all whitespace-nowrap ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-slate-800 shrink-0" />

            <div className="flex gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-200'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-200'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.section
              key="grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {isLoading && <div className="text-sm text-slate-400">Cargando intérpretes...</div>}
              {filtered.map((interpreter) => (
                <InterpreterCard
                  key={interpreter.employeeId}
                  interpreter={interpreter}
                  onClick={() => setSelectedInterpreter(interpreter)}
                />
              ))}
            </motion.section>
          ) : (
            <motion.section
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass rounded-3xl overflow-hidden border border-slate-800"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-800">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">employeeId</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">firstName</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">lastName</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">companyEmail</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">personalEmail</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">phoneNumber</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">roleId</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">cityId</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">countryId</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">statusId</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">reportsTo</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">waveId</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">startDate</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">nestingDate</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">productionStartDate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {isLoading && (
                      <tr>
                        <td className="px-6 py-6 text-sm text-slate-400" colSpan={15}>
                          Cargando intérpretes...
                        </td>
                      </tr>
                    )}
                    {filtered.map((interpreter) => (
                      <tr
                        key={interpreter.employeeId}
                        onClick={() => setSelectedInterpreter(interpreter)}
                        className="hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4 font-mono text-[11px] text-slate-500 group-hover:text-blue-400">{interpreter.employeeId}</td>
                        <td className="px-6 py-4 text-[11px] text-slate-200">{interpreter.firstName ?? '-'}</td>
                        <td className="px-6 py-4 text-[11px] text-slate-200">{interpreter.lastName ?? '-'}</td>
                        <td className="px-6 py-4 text-[11px] text-slate-300">{interpreter.companyEmail ?? '-'}</td>
                        <td className="px-6 py-4 text-[11px] text-slate-300">{interpreter.personalEmail ?? '-'}</td>
                        <td className="px-6 py-4 text-[11px] text-slate-300 font-mono">{interpreter.phoneNumber ?? '-'}</td>
                        <td className="px-6 py-4 text-[11px] text-slate-300 font-mono">{interpreter.roleId ?? '-'}</td>
                        <td className="px-6 py-4 text-[11px] text-slate-300 font-mono">{interpreter.cityId ?? '-'}</td>
                        <td className="px-6 py-4 text-[11px] text-slate-300 font-mono">{interpreter.countryId ?? '-'}</td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full border ${getStatusBorderClass(
                              interpreter.status,
                            )} ${getStatusTextClass(interpreter.status)} bg-current/5`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusBgClass(interpreter.status)}`} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{interpreter.statusId ?? '-'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[11px] text-slate-300 font-mono">{interpreter.reportsTo ?? '-'}</td>
                        <td className="px-6 py-4 text-[11px] text-slate-300 font-mono">{interpreter.waveId ?? '-'}</td>
                        <td className="px-6 py-4 text-[11px] text-slate-300 font-mono">{interpreter.startDate ?? '-'}</td>
                        <td className="px-6 py-4 text-[11px] text-slate-300 font-mono">{interpreter.nestingDate ?? '-'}</td>
                        <td className="px-6 py-4 text-[11px] text-slate-300 font-mono">{interpreter.productionStartDate ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {selectedInterpreter && (
          <div className="text-xs text-slate-500">
            Seleccionado:{' '}
            <span className="text-slate-300 font-bold">
              {(selectedInterpreter.firstName ?? '').trim()} {(selectedInterpreter.lastName ?? '').trim()}
            </span>
          </div>
        )}
      </main>

      <InterpreterFormModal
        isOpen={isInterpreterModalOpen}
        onClose={() => setIsInterpreterModalOpen(false)}
        onSuccess={() => setRefreshKey((current) => current + 1)}
        employees={employees}
        waves={waves}
        languages={languages}
      />
    </>
  );
}
