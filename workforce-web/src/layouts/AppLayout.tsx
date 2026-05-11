import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, Clock, Globe, Languages, Layers, LogOut, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#E2E8F0] font-sans selection:bg-blue-500/30 flex">
      <aside className="w-64 glass border-r border-[#1E293B] hidden lg:flex flex-col p-6 sticky top-0 h-screen overflow-y-auto">
        <Link to="/roster" className="flex items-center gap-3 mb-10 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">V</div>
          <h1 className="text-xl font-bold tracking-tight">VOX<span className="text-blue-500">LINK</span></h1>
        </Link>

        <nav className="flex-1 space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Operaciones</div>

          <NavLink
            to="/roster"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all relative group ${
                isActive ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-white/5'
              }`
            }
          >
            <Users size={18} />
            <span className="text-sm font-medium">Vista Roster</span>
          </NavLink>

          <NavLink
            to="/waves"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all relative group ${
                isActive ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-white/5'
              }`
            }
          >
            <Globe size={18} />
            <span className="text-sm font-medium group-hover:text-white">Waves Productivas</span>
          </NavLink>

          <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-white/5 transition-all group">
            <Activity size={18} className="group-hover:text-white" />
            <span className="text-sm font-medium group-hover:text-white">Métricas Globales</span>
          </a>
          
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 mt-8">Administración</div>

          <NavLink
            to="/management/employees"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all relative group ${
                isActive ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-white/5'
              }`
            }
          >
            <Users size={18} />
            <span className="text-sm font-medium">Personal</span>
          </NavLink>

          <NavLink
            to="/management/waves"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all relative group ${
                isActive ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-white/5'
              }`
            }
          >
            <Layers size={18} />
            <span className="text-sm font-medium">Config. Waves</span>
          </NavLink>

          <NavLink
            to="/management/languages"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-all relative group ${
                isActive ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-white/5'
              }`
            }
          >
            <Languages size={18} />
            <span className="text-sm font-medium">Idiomas</span>
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-white/10"
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

