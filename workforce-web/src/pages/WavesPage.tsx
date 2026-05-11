import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { WaveCard } from '@/components/WaveCard';
import { Wave } from '@/types';
import { waveService } from '@/services/waveService';
import { Layers } from 'lucide-react';

export function WavesPage() {
  const [waves, setWaves] = useState<Wave[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [hoverLeft, setHoverLeft] = useState<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const labelWidthPx = 192; // Matches `w-48` label column before timeline bars.
    const axisWidth = Math.max(1, rect.width - labelWidthPx);
    const x = e.clientX - rect.left - labelWidthPx;
    const percentage = Math.max(0, Math.min(1, x / axisWidth));
    
    // Posición fluida
    setHoverLeft(percentage * 100);
    
    // Fecha discreta (día correspondiente)
    const dayIndex = Math.min(20, Math.floor(percentage * 21));
    const date = new Date(timelineStart.getTime() + (dayIndex * 24 * 60 * 60 * 1000));
    setHoverDate(date);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  // Calculate the 3-week window centered around the current week, with weeks starting on Monday.
  const today = new Date();
  
  // Helper to get the Monday of the week containing the given date
  const getMonday = (d: Date) => {
      const date = new Date(d);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      date.setDate(diff);
      date.setHours(0, 0, 0, 0);
      return date;
  };

  const currentMonday = getMonday(today);

  // Current week window (Monday -> Sunday)
  const currentWeekStart = new Date(currentMonday);
  const currentWeekEnd = new Date(currentMonday);
  currentWeekEnd.setDate(currentMonday.getDate() + 6);
  currentWeekEnd.setHours(23, 59, 59, 999);

  // timelineStart is the Monday of the week before the current week.
  const timelineStart = new Date(currentMonday.getFullYear(), currentMonday.getMonth(), currentMonday.getDate() - 7);
  timelineStart.setHours(0, 0, 0, 0);

  // timelineEnd is the Sunday of the week after the current week.
  // Exactly 21 days (3 weeks) after timelineStart.
  const timelineEnd = new Date(timelineStart.getTime() + (21 * 24 * 60 * 60 * 1000) - 1); 
  // Subtracting 1ms ensures it's the very end of the Sunday (23:59:59.999)

  useEffect(() => {
    const loadWaves = async () => {
      try {
        const data = await waveService.getAllWaves();
        setWaves(data);
      } catch (error) {
        console.error('Error loading waves:', error);
      } finally {
        setLoading(false);
      }
    };
    loadWaves();
  }, []);

  // Helper to parse 'YYYY-MM-DD' as UTC
  const parseUTCDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  };

  // Helper to get day index from timelineStart
  const getDayIndex = (dateString: string | null | undefined) => {
    if (!dateString) return 0;
    const parts = dateString.split('-');
    if (parts.length !== 3) return 0;
    const [y, m, d] = parts.map(Number);
    const s = new Date(y, m - 1, d);
    
    // Calcular diferencia en días usando medianoche local
    const diff = s.getTime() - timelineStart.getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  const getStageWidth = (start: string | null | undefined, end: string | null | undefined) => {
    const startDay = getDayIndex(start);
    const endDay = getDayIndex(end);
    
    const duration = Math.max(0, endDay - startDay + 1);
    return `${(duration / 21) * 100}%`;
  };

  const getStageLeft = (start: string | null | undefined) => {
    const startDay = getDayIndex(start);
    return `${(startDay / 21) * 100}%`;
  };

  const getTodayLeft = () => {
    // Normalizar hoy a 'YYYY-MM-DD' para usar la misma lógica de índice
    const todayStr = today.toISOString().split('T')[0];
    const todayIndex = getDayIndex(todayStr);
    return `${(todayIndex / 21) * 100}%`;
  };

  return (
    <>
      <header className="h-20 glass border-b border-[#1E293B] flex items-center justify-between px-8 sticky top-0 z-20 backdrop-blur-md">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Waves</div>
          <div className="text-2xl font-bold tracking-tighter text-white">Waves Productivas</div>
        </div>
      </header>

      <main className="p-8 space-y-12 flex-1">
        {/* Focused Timeline Section */}
        {!loading && waves.length > 0 && (
          <section className="glass p-8 rounded-3xl border border-white/5 overflow-hidden">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Layers size={16} className="text-blue-500" />
                  Cronograma Detallado (3 Semanas)
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase tracking-widest">
                  {timelineStart.toLocaleDateString()} — {timelineEnd.toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Training</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Nesting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Prod</span>
                </div>
              </div>
            </div>
            
            <div className="relative pt-6 min-h-[400px] flex flex-col" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverDate(null)}>
              {/* Daily Grid Lines */}
              <div className="absolute left-48 right-0 top-0 bottom-0 grid grid-cols-21 pointer-events-none">
                {Array.from({ length: 21 }).map((_, i) => {
                  const targetDate = new Date(timelineStart.getTime() + (i * 24 * 60 * 60 * 1000));
                  const isMay11 = targetDate.getUTCFullYear() === 2026 && targetDate.getUTCMonth() === 4 && targetDate.getUTCDate() === 11;
                  return (
                    <div 
                      key={i} 
                      className={`border-r border-white/[0.03] ${i === 6 || i === 13 ? 'border-r-white/10' : ''} ${isMay11 ? 'bg-white/10' : ''}`} 
                    />
                  );
                })}
              </div>
              
              {/* Hover Date Indicator */}
              {hoverDate && (
                <div className="absolute left-48 right-0 top-0 bottom-0 z-10 pointer-events-none">
                  <div 
                    className="absolute top-0 bottom-0 w-px bg-white/50"
                    style={{ left: `${hoverLeft}%` }}
                  >
                    <div className="absolute -top-6 left-1 text-[9px] font-bold text-white bg-slate-800 px-1 rounded whitespace-nowrap">
                      {formatDate(hoverDate)}
                    </div>
                  </div>
                </div>
              )}
              {/* Weekly Header Labels */}
              <div className="absolute -top-6 left-48 right-0 grid grid-cols-21 pointer-events-none text-[9px] font-bold uppercase tracking-tighter">
                <div className="col-span-7 text-slate-600 pl-2">Semana Pasada</div>
                <div className="col-span-7 text-blue-400 pl-2">Semana Actual</div>
                <div className="col-span-7 text-slate-600 pl-2">Semana Próxima</div>
              </div>

              {/* Today Indicator Line */}
              <div className="absolute left-48 right-0 top-0 bottom-0 z-20 pointer-events-none">
                <div 
                  className="absolute top-0 bottom-0 w-px bg-red-500"
                  style={{ left: getTodayLeft() }}
                >
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  <div className="absolute top-0 left-2 text-[8px] font-bold text-red-500 uppercase whitespace-nowrap bg-[#0D1117] px-1 rounded">Hoy</div>
                </div>
              </div>

              {/* Timeline Container */}
              <div className="space-y-4 relative z-10 py-4">
                {waves.map((wave, i) => (
                  <div key={wave.waveId} className="group flex items-center py-2 border-b border-white/[0.05] relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {i + 1}
                    </div>

                    <div className="w-48 flex-shrink-0 pr-4">
                      <p className="text-[10px] font-bold text-white truncate">{wave.waveName}</p>
                      <p className="text-[8px] text-slate-500 uppercase tracking-tighter">{wave.currentStage}</p>
                    </div>
                    
                    {/* Timeline Graphic Container (using absolute positioning) */}
                    <div className="relative h-6 flex-1 bg-white/5 rounded-md border border-white/5 box-border">
                      {wave.stages?.map((stage, idx) => {                        const startDay = getDayIndex(stage.startDate);
                        const endDay = getDayIndex(stage.endDate);
                        
                        const duration = Math.max(0, endDay - startDay + 1);
                        const width = (duration / 21) * 100;
                        const left = (startDay / 21) * 100;
                        
                        const color = stage.stageName === 'TRAINING' ? 'bg-amber-500' :
                                      stage.stageName === 'NESTING' ? 'bg-blue-500' :
                                      'bg-emerald-500';
                        
                        const isStageActiveInCurrentWeek = startDay <= 13 && endDay >= 7;
                        const highlightClass = isStageActiveInCurrentWeek ? 'opacity-100 ring-inset ring-1 ring-white/30' : 'opacity-40';
                        
                        return (
                          <div 
                            key={idx}
                            style={{ 
                              width: `${width}%`, 
                              left: `${left}%`, 
                              position: 'absolute' 
                            }}
                            className={`h-full ${color} ${highlightClass} flex items-center justify-center transition-all hover:opacity-90 rounded-sm`}
                            title={`${stage.stageName}: ${stage.startDate} a ${stage.endDate}`}
                          >
                            <span className="text-[7px] font-black text-white uppercase truncate px-1">
                              {stage.stageName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass h-64 rounded-3xl animate-pulse bg-white/5 border border-white/5" />
            ))
          ) : waves.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-500">
              <p>No hay waves productivas configuradas.</p>
            </div>
          ) : (
            waves.map((wave) => (
              <WaveCard key={wave.waveId} wave={wave} />
            ))
          )}
        </motion.section>
      </main>
    </>
  );
}
