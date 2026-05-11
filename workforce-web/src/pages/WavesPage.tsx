import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { WaveCard } from '@/components/WaveCard';
import { Wave } from '@/types';
import { waveService } from '@/services/waveService';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, History, Layers } from 'lucide-react';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 21;

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getMonday = (date: Date) => {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = next.getDate() - day + (day === 0 ? -6 : 1);
  next.setDate(diff);
  return next;
};

const clampDate = (date: Date, min: Date, max: Date) => {
  const time = date.getTime();
  return new Date(Math.min(Math.max(time, min.getTime()), max.getTime()));
};

export function WavesPage() {
  const [waves, setWaves] = useState<Wave[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [hoverLeft, setHoverLeft] = useState<number>(0);
  const [timelineStartAnchor, setTimelineStartAnchor] = useState<Date>(() => {
    const currentMonday = getMonday(new Date());
    return addDays(currentMonday, -7);
  });

  const today = new Date();
  const yearStart = startOfDay(new Date(today.getFullYear(), 0, 1));
  const yearEnd = endOfDay(new Date(today.getFullYear(), 11, 31));
  const latestTimelineStart = startOfDay(addDays(yearEnd, -(WINDOW_DAYS - 1)));

  const timelineStart = clampDate(timelineStartAnchor, yearStart, latestTimelineStart);
  const timelineEnd = endOfDay(addDays(timelineStart, WINDOW_DAYS - 1));
  const previousWeekStart = startOfDay(timelineStart);
  const previousWeekEnd = endOfDay(addDays(previousWeekStart, 6));
  const currentWeekStart = startOfDay(addDays(timelineStart, 7));
  const currentWeekEnd = endOfDay(addDays(currentWeekStart, 6));
  const nextWeekStart = startOfDay(addDays(timelineStart, 14));
  const nextWeekEnd = endOfDay(addDays(nextWeekStart, 6));
  const canGoBack = timelineStart.getTime() > yearStart.getTime();
  const canGoForward = timelineEnd.getTime() < yearEnd.getTime();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const formatDateRange = (start: Date, end: Date) => {
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const moveTimeline = (weeks: number) => {
    setTimelineStartAnchor((current) => clampDate(addDays(current, weeks * 7), yearStart, latestTimelineStart));
  };

  const goToStartOfYear = () => {
    setTimelineStartAnchor(yearStart);
  };

  const goToEndOfYear = () => {
    setTimelineStartAnchor(latestTimelineStart);
  };

  const goToCurrentWeek = () => {
    const currentMonday = getMonday(new Date());
    setTimelineStartAnchor(addDays(currentMonday, -7));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const labelWidthPx = 192;
    const axisWidth = Math.max(1, rect.width - labelWidthPx);
    const x = e.clientX - rect.left - labelWidthPx;
    const percentage = Math.max(0, Math.min(1, x / axisWidth));

    setHoverLeft(percentage * 100);

    const dayIndex = Math.min(WINDOW_DAYS - 1, Math.floor(percentage * WINDOW_DAYS));
    const date = new Date(timelineStart.getTime() + dayIndex * MS_PER_DAY);
    setHoverDate(date);
  };

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

  const getDayIndex = (dateString: string | null | undefined) => {
    if (!dateString) return 0;
    const parts = dateString.split('-');
    if (parts.length !== 3) return 0;
    const [y, m, d] = parts.map(Number);
    const date = new Date(y, m - 1, d);
    const diff = startOfDay(date).getTime() - timelineStart.getTime();
    return Math.round(diff / MS_PER_DAY);
  };

  const getDayIndexOrTimelineEnd = (dateString: string | null | undefined) => {
    if (!dateString) return WINDOW_DAYS - 1;
    const parts = dateString.split('-');
    if (parts.length !== 3) return WINDOW_DAYS - 1;
    const [y, m, d] = parts.map(Number);
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return WINDOW_DAYS - 1;
    const date = new Date(y, m - 1, d);
    const diff = startOfDay(date).getTime() - timelineStart.getTime();
    return Math.round(diff / MS_PER_DAY);
  };

  const getTodayLeft = () => {
    const todayIndex = Math.round((startOfDay(today).getTime() - timelineStart.getTime()) / MS_PER_DAY);
    return `${(todayIndex / WINDOW_DAYS) * 100}%`;
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
        {!loading && waves.length > 0 && (
          <section className="glass p-8 rounded-3xl border border-white/5 overflow-hidden">
            <div className="flex justify-between items-end mb-10 gap-6 flex-wrap">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Layers size={16} className="text-blue-500" />
                  Cronograma Detallado (3 Semanas)
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase tracking-widest">
                  {formatDateRange(timelineStart, timelineEnd)}
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap justify-end">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-xl bg-white/5 text-slate-200 text-[10px] font-bold uppercase tracking-wider border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => moveTimeline(-1)}
                    disabled={!canGoBack}
                    aria-label="Ir una semana atras"
                    title="Ir una semana atras"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded-xl bg-white/5 text-slate-200 text-[10px] font-bold uppercase tracking-wider border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={goToStartOfYear}
                    disabled={!canGoBack}
                    aria-label="Ir al inicio del ano"
                    title="Ir al inicio del ano"
                  >
                    <ChevronsLeft size={14} />
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded-xl bg-blue-500/15 text-blue-200 text-[10px] font-bold uppercase tracking-wider border border-blue-400/20 hover:bg-blue-500/25"
                    onClick={goToCurrentWeek}
                    aria-label="Volver a la semana actual"
                    title="Volver a la semana actual"
                  >
                    <History size={14} />
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded-xl bg-white/5 text-slate-200 text-[10px] font-bold uppercase tracking-wider border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={goToEndOfYear}
                    disabled={!canGoForward}
                    aria-label="Ir al fin del ano"
                    title="Ir al fin del ano"
                  >
                    <ChevronsRight size={14} />
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded-xl bg-white/5 text-slate-200 text-[10px] font-bold uppercase tracking-wider border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => moveTimeline(1)}
                    disabled={!canGoForward}
                    aria-label="Ir una semana adelante"
                    title="Ir una semana adelante"
                  >
                    <ChevronRight size={14} />
                  </button>
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
            </div>

            <div className="relative pt-6 min-h-[400px] flex flex-col" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverDate(null)}>
              <div className="absolute left-48 right-0 top-0 bottom-0 grid grid-cols-21 pointer-events-none">
                {Array.from({ length: WINDOW_DAYS }).map((_, i) => {
                  return (
                    <div key={i} className="border-r border-white/[0.03] last:border-r-0" />
                  );
                })}
              </div>

              <div className="absolute left-48 right-0 top-0 bottom-0 grid grid-cols-21 pointer-events-none">
                <div className="col-span-7" />
                <div className="col-span-7 rounded-md bg-blue-500/5 ring-1 ring-inset ring-blue-400/10" />
                <div className="col-span-7" />
              </div>

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

              <div className="absolute -top-6 left-48 right-0 grid grid-cols-21 pointer-events-none text-[9px] font-bold uppercase tracking-tighter">
                <div className="col-span-7 text-slate-600 pl-2">{formatDateRange(previousWeekStart, previousWeekEnd)}</div>
                <div className="col-span-7 text-blue-400 pl-2">{formatDateRange(currentWeekStart, currentWeekEnd)}</div>
                <div className="col-span-7 text-slate-600 pl-2">{formatDateRange(nextWeekStart, nextWeekEnd)}</div>
              </div>

              <div className="absolute left-48 right-0 top-0 bottom-0 z-20 pointer-events-none">
                <div
                  className="absolute top-0 bottom-0 w-px bg-red-500"
                  style={{ left: getTodayLeft() }}
                >
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  <div className="absolute top-0 left-2 text-[8px] font-bold text-red-500 uppercase whitespace-nowrap bg-[#0D1117] px-1 rounded">Hoy</div>
                </div>
              </div>

              <div className="space-y-4 relative z-10 py-4">
                {waves.map((wave) => (
                  <div key={wave.waveId} className="flex items-center py-2 relative">

                    <div className="w-48 flex-shrink-0 pr-4">
                      <p className="text-[10px] font-bold text-white truncate">{wave.waveName}</p>
                      <p className="text-[8px] text-slate-500 uppercase tracking-tighter">{wave.currentStage}</p>
                    </div>

                    <div className="relative h-6 flex-1 bg-white/5 rounded-md border border-white/5 box-border overflow-hidden">
                      {(() => {
                        const hasStages = (wave.stages?.length ?? 0) > 0;
                        if (!hasStages && wave.currentStage !== 'UPCOMING') return null;

                        const earliestStageStart = hasStages
                          ? Math.min(...wave.stages.map((stage) => getDayIndex(stage.startDate)))
                          : WINDOW_DAYS;

                        const upcomingWidthDays = Math.min(Math.max(earliestStageStart, 0), WINDOW_DAYS);
                        if (upcomingWidthDays <= 0) return null;

                        return (
                          <div
                            className="absolute left-0 top-0 h-full bg-slate-300/20 border-r border-white/10 opacity-30 flex items-center justify-center"
                            style={{ width: `${(upcomingWidthDays / WINDOW_DAYS) * 100}%` }}
                            title="UPCOMING"
                          >
                            <span className="text-[7px] font-black text-slate-100 uppercase tracking-[0.25em] px-1">
                              UPCOMING
                            </span>
                          </div>
                        );
                      })()}

                      {wave.stages?.map((stage, idx) => {
                        const startDay = getDayIndex(stage.startDate);
                        const hasFiniteEndDate = Boolean(stage.endDate && stage.endDate.includes('-'));
                        const endDay = stage.stageName === 'PRODUCTION' && !hasFiniteEndDate
                          ? WINDOW_DAYS - 1
                          : getDayIndexOrTimelineEnd(stage.endDate);

                        const duration = Math.max(0, endDay - startDay + 1);
                        const width = (duration / WINDOW_DAYS) * 100;
                        const left = (startDay / WINDOW_DAYS) * 100;
                        const isOutsideCurrentWeek = endDay < 7 || startDay > 13;

                        const color = stage.stageName === 'TRAINING'
                          ? 'bg-amber-500'
                          : stage.stageName === 'NESTING'
                            ? 'bg-blue-500'
                            : 'bg-emerald-500';

                        const isStageActiveInCurrentWeek = startDay <= 13 && endDay >= 7;
                        const highlightClass = isStageActiveInCurrentWeek ? 'opacity-100 ring-inset ring-1 ring-white/30' : 'opacity-40';
                        const rangeClass = isOutsideCurrentWeek ? 'opacity-[0.15]' : 'opacity-100';

                        return (
                          <div
                            key={idx}
                            style={{
                              width: `${width}%`,
                              left: `${left}%`,
                              position: 'absolute',
                            }}
                            className={`h-full ${color} ${highlightClass} ${rangeClass} flex items-center justify-center transition-all hover:opacity-90 rounded-sm`}
                            title={`${stage.stageName}: ${stage.startDate} a ${stage.stageName === 'PRODUCTION' && !hasFiniteEndDate ? 'indefinida' : stage.endDate}`}
                          >
                            <span className="text-[7px] font-black text-white uppercase truncate px-1">
                              {stage.stageName}
                            </span>
                            {stage.stageName === 'PRODUCTION' && !hasFiniteEndDate && (
                              <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-r from-transparent to-emerald-500/45 pointer-events-none" />
                            )}
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
