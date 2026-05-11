import React from 'react';
import { Languages, Plus } from 'lucide-react';

export function LanguagesPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Languages className="text-blue-500" />
            Idiomas y Habilidades
          </h1>
          <p className="text-slate-400">Define los idiomas disponibles para los intérpretes.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
          <Plus size={18} />
          Agregar Idioma
        </button>
      </div>

      <div className="max-w-2xl">
        <div className="glass rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Idioma</th>
                <th className="px-6 py-4 font-semibold">Código</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-t border-white/5 hover:bg-white/5 transition-colors text-slate-300">
                <td className="px-6 py-4">English</td>
                <td className="px-6 py-4">EN</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-400 hover:text-blue-300 mr-3">Editar</button>
                  <button className="text-red-400 hover:text-red-300">Eliminar</button>
                </td>
              </tr>
              <tr className="border-t border-white/5 hover:bg-white/5 transition-colors text-slate-300">
                <td className="px-6 py-4">Spanish</td>
                <td className="px-6 py-4">ES</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-400 hover:text-blue-300 mr-3">Editar</button>
                  <button className="text-red-400 hover:text-red-300">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
