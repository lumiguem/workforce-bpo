import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone } from 'lucide-react';
import { InterpreterRosterItem } from '@/types';
import { getStatusBgClass, getStatusBorderClass, getStatusTextClass } from '@/utils/interpreterUi';

export const InterpreterCard: React.FC<{ interpreter: InterpreterRosterItem; onClick: () => void }> = ({
  interpreter,
  onClick,
}) => {
  const fullName = `${interpreter.firstName ?? ''} ${interpreter.lastName ?? ''}`.trim() || `#${interpreter.employeeId}`;

  return (
    <motion.div
      layout
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-lg shrink-0">
            {fullName
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white tracking-tight truncate">{fullName}</h3>
            <p className="text-[11px] text-slate-500 font-mono truncate">employeeId: {interpreter.employeeId}</p>
          </div>
        </div>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusBorderClass(
            interpreter.status,
          )} ${getStatusTextClass(interpreter.status)} bg-current/5 shrink-0`}
        >
          <span className={`w-2 h-2 rounded-full ${getStatusBgClass(interpreter.status)}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest">statusId: {interpreter.statusId ?? '-'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-900/50 border border-white/3 p-3 rounded-2xl group-hover:border-white/10 transition-colors min-w-0">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mb-1">companyEmail</p>
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-tighter text-slate-300 min-w-0">
            <Mail size={14} className="text-slate-500 shrink-0" />
            <span className="truncate">{interpreter.companyEmail ?? '-'}</span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-white/3 p-3 rounded-2xl group-hover:border-white/10 transition-colors">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mb-1">waveId</p>
          <p className="text-[11px] font-bold text-white uppercase">{interpreter.waveId ?? '-'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/50 border border-white/3 p-3 rounded-2xl">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mb-1">phoneNumber</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono min-w-0">
            <Phone size={14} className="text-slate-500 shrink-0" />
            <span className="truncate">{interpreter.phoneNumber ?? '-'}</span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-white/3 p-3 rounded-2xl">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mb-1">dates</p>
          <p className="text-[10px] text-slate-300 font-mono truncate">startDate: {interpreter.startDate ?? '-'}</p>
          <p className="text-[10px] text-slate-300 font-mono truncate">nestingDate: {interpreter.nestingDate ?? '-'}</p>
          <p className="text-[10px] text-slate-300 font-mono truncate">
            productionStartDate: {interpreter.productionStartDate ?? '-'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

