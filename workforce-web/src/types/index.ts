/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type InterpreterStatus = 'available' | 'on-call' | 'break' | 'training' | 'offline';

export interface PerformanceMetrics {
  aht: string; // Average Handle Time (e.g., "04:12")
  csat: number; // Customer Satisfaction (0-5)
  callsTaken: number;
}

export interface WaveStage {
  waveStageId: number;
  stageName: 'TRAINING' | 'NESTING' | 'PRODUCTION';
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Wave {
  waveId: number;
  waveName: string;
  description: string;
  startDate: string;
  currentStage: 'TRAINING' | 'NESTING' | 'PRODUCTION' | 'COMPLETED' | 'UPCOMING';
  stages: WaveStage[];
}

export interface Interpreter {
  id: string;
  name: string;
  email: string;
  status: InterpreterStatus;
  languages: string[];
  specialties: string[];
  metrics: PerformanceMetrics;
  lastActive: string;
  waveId: string;
  avatar?: string;
}

export type InterpreterRosterItem = {
  employeeId: number;
  firstName: string | null;
  lastName: string | null;
  companyEmail: string | null;
  personalEmail: string | null;
  phoneNumber: string | null;
  roleId: number | null;
  cityId: number | null;
  countryId: number | null;
  statusId: number | null;
  reportsTo: number | null;
  waveId: number | null;
  startDate: string | null;
  nestingDate: string | null;
  productionStartDate: string | null;
  status: InterpreterStatus;
};

export interface RosterStats {
  total: number;
  available: number;
  onCall: number;
  onBreak: number;
  averageCsat: number;
}

export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  companyEmail: string;
  personalEmail: string;
  phoneNumber: string;
  roleId: number;
  roleName: string;
  cityId: number;
  cityName: string;
  countryId: number;
  countryName: string;
  countryCode: string;
  statusId: number;
  statusDescription: string;
  reportsTo: number | null;
  reportsToName: string | null;
  createdAt: string;
}
