import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { AppLayout } from '@/layouts/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RosterPage } from '@/pages/RosterPage';
import { WavesPage } from '@/pages/WavesPage';
import { EmployeesPage } from '@/pages/management/EmployeesPage';
import { WaveManagementPage } from '@/pages/management/WaveManagementPage';
import { LanguagesPage } from '@/pages/management/LanguagesPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/roster" replace />} />
        <Route path="roster" element={<RosterPage />} />
        <Route path="waves" element={<WavesPage />} />
        
        {/* Módulo de Gestión */}
        <Route path="management">
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="waves" element={<WaveManagementPage />} />
          <Route path="languages" element={<LanguagesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

