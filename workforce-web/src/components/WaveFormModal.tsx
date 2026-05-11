import React, { useEffect, useState } from 'react';
import { X, Save, Layers, Calendar, AlignLeft, Plus, Trash2 } from 'lucide-react';
import { Wave, WaveStage } from '@/types';
import { waveService } from '@/services/waveService';

interface WaveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  wave?: Wave | null;
}

export function WaveFormModal({ isOpen, onClose, onSuccess, wave }: WaveFormModalProps) {
  const [loading, setLoading] = useState(false);
  const isCreating = !wave;
  const [formData, setFormData] = useState({
    waveName: '',
    description: '',
    startDate: '',
    stages: [] as Partial<WaveStage>[]
  });

  useEffect(() => {
    if (wave) {
      setFormData({
        waveName: wave.waveName || '',
        description: wave.description || '',
        startDate: wave.startDate || '',
        stages: wave.stages ? [...wave.stages] : []
      });
    } else {
      setFormData({
        waveName: '',
        description: '',
        startDate: '',
        stages: [
          { stageName: 'TRAINING', startDate: '', endDate: '' },
          { stageName: 'NESTING', startDate: '', endDate: '' },
          { stageName: 'PRODUCTION', startDate: '', endDate: '' }
        ]
      });
    }
  }, [wave, isOpen]);

  const handleStageChange = (index: number, field: keyof WaveStage, value: string) => {
    const newStages = [...formData.stages];
    newStages[index] = { ...newStages[index], [field]: value };
    setFormData({ ...formData, stages: newStages });
  };

  const normalizeStagesForSubmit = () => {
    return formData.stages.map((stage) => {
      if (isCreating && stage.stageName === 'PRODUCTION') {
        return {
          ...stage,
          endDate: null
        };
      }

      return stage;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        stages: normalizeStagesForSubmit()
      };

      if (wave) {
        await waveService.updateWave(wave.waveId, payload as any);
      } else {
        await waveService.createWave(payload as any);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving wave:', error);
      alert('Error al guardar la wave y sus etapas.');
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
            <Layers className="text-blue-500" />
            {wave ? 'Gestionar Lifecycle' : 'Nueva Wave con Etapas'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Nombre de la Wave *</label>
                <input
                  required
                  type="text"
                  value={formData.waveName}
                  onChange={(e) => setFormData({ ...formData, waveName: e.target.value })}
                  className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Fecha Lanzamiento</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark] appearance-auto"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(egit) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none h-20"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Calendar size={14} /> Etapas del Ciclo de Vida
              </h3>
              
              <div className="space-y-3">
                {formData.stages.map((stage, index) => (
                  <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        stage.stageName === 'PRODUCTION' ? 'bg-emerald-500/10 text-emerald-500' :
                        stage.stageName === 'NESTING' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {stage.stageName}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Inicio</label>
                        <input
                          type="date"
                          value={stage.startDate || ''}
                          onChange={(e) => handleStageChange(index, 'startDate', e.target.value)}
                          className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500 [color-scheme:dark] appearance-auto"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Fin</label>
                        <input
                          type="date"
                          value={stage.endDate || ''}
                          disabled={isCreating && stage.stageName === 'PRODUCTION'}
                          onChange={(e) => handleStageChange(index, 'endDate', e.target.value)}
                          className="w-full bg-[#0A0C10] border border-white/10 rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500 [color-scheme:dark] appearance-auto disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                        {isCreating && stage.stageName === 'PRODUCTION' && (
                          <p className="text-[10px] text-slate-500">Se mantiene indefinido al entrar en producción.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-slate-400 hover:text-white transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-8 py-2 rounded-lg transition-colors font-bold"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
              {loading ? 'Guardando...' : wave ? 'Guardar Lifecycle' : 'Crear Lifecycle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
