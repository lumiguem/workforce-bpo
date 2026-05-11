import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#E2E8F0] flex items-center justify-center p-6">
      <div className="w-full max-w-md glass rounded-3xl border border-white/5 p-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Iniciar sesión</h1>
        <p className="text-sm text-slate-400 mt-1">Accede con tu cuenta para ver el roster.</p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            setError(null);
            try {
              await login({ email, password });
              navigate('/roster', { replace: true });
            } catch (err: unknown) {
              setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email</label>
            <input
              className="w-full rounded-2xl bg-slate-900/50 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.email@empresa.com"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Password</label>
            <input
              type="password"
              className="w-full rounded-2xl bg-slate-900/50 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

