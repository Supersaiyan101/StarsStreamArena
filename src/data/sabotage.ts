import type { SabotageAction } from '../types/game';

export const SABOTAGE_ACTIONS: SabotageAction[] = [
  {
    id: 'debris_barrage',
    name: 'Debris Barrage',
    cost: 40,
    effectType: 'debris',
    description: 'Triggers a ceiling cave-in on opponent lane. Requires emergency evasion within 1.5s or deals 35 damage and staggers.',
    iconName: 'Rock',
  },
  {
    id: 'spawn_minion',
    name: 'Spawn Calamity Minion',
    cost: 70,
    effectType: 'minion',
    description: 'Summons an aggressive elite minion into opponent arena that intercepts attacks and shields their boss.',
    iconName: 'Skull',
  },
  {
    id: 'probability_overload',
    name: 'Probability Overload',
    cost: 100,
    effectType: 'heat',
    description: 'Spikes opponent Probability Heat meter by +35%, pushing them dangerously close to a catastrophic Cosmic Backlash!',
    iconName: 'Zap',
  },
];
