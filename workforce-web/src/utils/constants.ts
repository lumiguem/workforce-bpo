/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Interpreter, InterpreterStatus, Wave } from '@/types';

export const LANGUAGES = ['English', 'Spanish', 'French'];

export const SPECIALTIES = [
  'Medical', 'Legal', 'Financial', 'Insurance', 'Government', 'Technical'
];

type MockWave = Wave & { averageCsat: number };

export const MOCK_WAVES: MockWave[] = Array.from({ length: 10 }, (_, i) => ({
  waveId: i + 1,
  waveName: `Wave ${i + 1}`,
  description: '',
  startDate: new Date(2025, 0, 1 + (i * 14)).toISOString().split('T')[0],
  currentStage: 'UPCOMING',
  interpreterCount: 5,
  stages: [],
  averageCsat: 0,
}));

const firstNames = ['Sofia', 'Jean', 'Elena', 'Li', 'Marco', 'Amira', 'Yuki', 'Carlos', 'Emma', 'Lukas', 'Aria', 'Mateo', 'Isabella', 'Gabriel', 'Zoe'];
const lastNames = ['Rodriguez', 'Picard', 'Petrova', 'Wei', 'Rossi', 'Hassan', 'Tanaka', 'Mendez', 'Smith', 'Muller', 'Chen', 'Garcia', 'Dubois', 'Kovacs', 'Silva'];
const statuses: InterpreterStatus[] = ['available', 'on-call', 'break', 'training', 'offline'];

const generateInterpreter = (index: number): Interpreter => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  // Distribute languages: all have English, then either Spanish or French
  const langPair = Math.random() > 0.5 ? ['English', 'Spanish'] : ['English', 'French'];
  
  const csat = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
  const ahtMinutes = Math.floor(Math.random() * 5) + 3;
  const ahtSeconds = Math.floor(Math.random() * 60);
  const aht = `${ahtMinutes.toString().padStart(2, '0')}:${ahtSeconds.toString().padStart(2, '0')}`;

  // Assign to one of the 10 waves
  const waveIndex = Math.floor(index / 5); // 5 per wave for 50 total
  const waveId = `WAVE-${waveIndex + 1}`;

  return {
    id: `INT-${1000 + index}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLocaleLowerCase()}.${lastName.toLocaleLowerCase()}@voxglobal.com`,
    status,
    languages: langPair,
    specialties: [SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)], SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)]],
    metrics: {
      aht,
      csat: parseFloat(csat),
      callsTaken: Math.floor(Math.random() * 2000) + 500,
    },
    lastActive: `${Math.floor(Math.random() * 60)}m ago`,
    waveId,
  };
};

export const MOCK_INTERPRETERS: Interpreter[] = Array.from({ length: 50 }, (_, i) => generateInterpreter(i));

// Update Wave stats based on assigned interpreters
MOCK_WAVES.forEach(wave => {
  const waveInterpreters = MOCK_INTERPRETERS.filter(i => i.waveId === `WAVE-${wave.waveId}`);
  wave.interpreterCount = waveInterpreters.length;
  wave.averageCsat = parseFloat((waveInterpreters.reduce((acc, i) => acc + i.metrics.csat, 0) / waveInterpreters.length).toFixed(2));
});
