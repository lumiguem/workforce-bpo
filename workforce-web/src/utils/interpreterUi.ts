import { InterpreterStatus } from '@/types';

export function getStatusBorderClass(status: InterpreterStatus) {
  switch (status) {
    case 'available': return 'border-emerald-500/50';
    case 'on-call': return 'border-amber-500/50';
    case 'break': return 'border-red-500/50';
    case 'training': return 'border-blue-500/50';
    case 'offline': return 'border-slate-800';
    default: return 'border-slate-800';
  }
}

export function getStatusBgClass(status: InterpreterStatus) {
  switch (status) {
    case 'available': return 'bg-emerald-500';
    case 'on-call': return 'bg-amber-500';
    case 'break': return 'bg-red-500';
    case 'training': return 'bg-blue-500';
    case 'offline': return 'bg-slate-500';
    default: return 'bg-slate-500';
  }
}

export function getStatusTextClass(status: InterpreterStatus) {
  switch (status) {
    case 'available': return 'text-emerald-400';
    case 'on-call': return 'text-amber-400';
    case 'break': return 'text-red-400';
    case 'training': return 'text-blue-400';
    case 'offline': return 'text-slate-500';
    default: return 'text-slate-500';
  }
}

