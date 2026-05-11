import React, { useEffect, useState } from 'react';
import { Layers, Plus, Search, Calendar, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Wave } from '@/types';
import { waveService } from '@/services/waveService';
import { WaveFormModal } from '@/components/WaveFormModal';

export function WaveManagementPage() {
  const [waves, setWaves] = useState<Wave[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWave, setSelectedWave] = useState<Wave | null>(null);

  useEffect(() => {
    loadWaves();
  }, []);

  const loadWaves = async () => {
    try {
      setLoading(true);
      const data = await waveService.getAllWaves();
      setWaves(data);
    } catch (error) {
      console.error('Error loading waves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (wave: Wave) => {
    setSelectedWave(wave);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta wave?')) {
      try {
        await waveService.deleteWave(id);
        loadWaves();
      } catch (error) {
        console.error('Error deleting wave:', error);
        alert('Error al eliminar la wave.');
      }
    }
  };

  const filteredWaves = waves.filter(wave => 
    wave.waveName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (wave.description && wave.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="text-blue-500" />
            Configuración de Waves
          </h1>
          <p className="text-slate-400">Crea y gestiona las ondas de contratación y entrenamiento.</p>
        </div>
        <button 
          onClick={() => { setSelectedWave(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          Nueva Wave
        </button>
      </div>

      <div className="glass rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar waves..." 
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
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Wave / Descripción</th>
                <th className="px-6 py-4">Fechas (Inicio - Fin)</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Layers size={48} className="mx-auto mb-4 opacity-20 animate-pulse" />
                    <p>Cargando waves...</p>
                  </td>
                </tr>
              ) : filteredWaves.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <p>No se encontraron waves configuradas.</p>
                  </td>
                </tr>
              ) : (
                filteredWaves.map((wave) => (
                  <tr key={wave.waveId} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">#{wave.waveId}</td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{wave.waveName}</p>
                      <p className="text-xs text-slate-500 truncate max-w-xs">{wave.description || 'Sin descripción'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar size={14} className="text-blue-500/70" />
                        <span>{wave.startDate || 'N/A'}</span>
                        <span className="text-slate-600">-</span>
                        <span>{wave.endDate || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ${
                          wave.currentStage === 'PRODUCTION' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          wave.currentStage === 'NESTING' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          wave.currentStage === 'TRAINING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          wave.currentStage === 'COMPLETED' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                          'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                          {wave.currentStage}
                        </span>
                      </div>
                      <div className="mt-2 flex gap-1 h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                        {['TRAINING', 'NESTING', 'PRODUCTION'].map(s => {
                          const stage = wave.stages?.find(st => st.stageName === s);
                          return (
                            <div 
                              key={s} 
                              className={`flex-1 h-full ${
                                stage?.isCurrent ? 'bg-blue-500' : 
                                (wave.stages?.findIndex(st => st.stageName === wave.currentStage) > wave.stages?.findIndex(st => st.stageName === s)) ? 'bg-slate-600' : 'bg-transparent'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(wave)}
                          className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(wave.waveId)}
                          className="p-1.5 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <WaveFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadWaves}
        wave={selectedWave}
      />
    </div>
  );
}
