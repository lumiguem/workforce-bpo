import { useEffect, useMemo, useState } from 'react';
import { InterpreterRosterItem, InterpreterStatus } from '@/types';
import * as interpretersService from '@/services/interpretersService';

export function useInterpreters(filters: { search: string; status: InterpreterStatus | 'all' }) {
  const [interpreters, setInterpreters] = useState<InterpreterRosterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    interpretersService
      .listInterpretersForRoster()
      .then((data) => {
        if (!isCancelled) setInterpreters(data);
      })
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : 'Error cargando intérpretes';
        if (!isCancelled) setError(message);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const searchLower = filters.search.toLowerCase();
    return interpreters.filter((interpreter) => {
      const fullName = `${interpreter.firstName ?? ''} ${interpreter.lastName ?? ''}`.trim().toLowerCase();
      const matchesSearch = fullName.includes(searchLower) ||
        String(interpreter.employeeId).includes(searchLower) ||
        (interpreter.companyEmail ?? '').toLowerCase().includes(searchLower) ||
        (interpreter.personalEmail ?? '').toLowerCase().includes(searchLower);
      const matchesStatus = filters.status === 'all' || interpreter.status === filters.status;
      return matchesSearch && matchesStatus;
    });
  }, [interpreters, filters.search, filters.status]);

  return { interpreters, filtered, isLoading, error };
}
