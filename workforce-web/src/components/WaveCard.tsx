import React from 'react';
import { motion } from 'motion/react';
import { Globe, Star } from 'lucide-react';
import { Wave } from '@/types';

export const WaveCard: React.FC<{ wave: Wave }> = ({ wave }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 rounded-3xl border ${wave.isActive ? 'border-blue-500/20' : 'border-white/5'} space-y-6 relative overflow-hidden`}
    >
      {!wave.isActive && (
        <div className="absolute top-0 right-0 bg-slate-800 text-slate-400 text-[8px] font-bold uppercase px-3 py-1 rounded-bl-xl border-l border-b border-white/5">
          Inactiva
        </div>
      )}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold tracking-tighter text-white">{wave.waveName}</h3>
          <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mt-1">Inicio: {wave.startDate || 'Pendiente'}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${wave.isActive ? 'bg-blue-600/10 text-blue-500' : 'bg-slate-800 text-slate-500'}`}>
          <Globe size={20} />
        </div>
      </div>

      <p className="text-xs text-slate-400 line-clamp-2 h-8">
        {wave.description || 'Sin descripción adicional para esta wave.'}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Fin</p>
          <p className="text-sm font-bold text-white">{wave.endDate || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Estado</p>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${wave.isActive ? 'bg-emerald-500' : 'bg-slate-500'}`} />
            <p className="text-sm font-bold text-white">{wave.isActive ? 'Productiva' : 'Inactiva'}</p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 mb-2">
          <span>Ocupación Estimada</span>
          <span>{wave.isActive ? '85%' : '0%'}</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-500 ${wave.isActive ? 'bg-emerald-500 w-[85%]' : 'bg-slate-700 w-0'}`} />
        </div>
      </div>
    </motion.div>
  );
};
