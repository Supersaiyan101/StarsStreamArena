export interface AvatarArchetype {
  id: 'blade_disciple' | 'shadow_rogue' | 'titan_vanguard';
  name: string;
  title: string;
  description: string;
  defaultAttributes: {
    strength: number;
    agility: number;
    resonance: number;
  };
  preferredArena: 'metro' | 'flooded';
  accentColor: string;
  avatarIcon: string;
}

export const AVATAR_ARCHETYPES: AvatarArchetype[] = [
  {
    id: 'blade_disciple',
    name: 'Blade Disciple',
    title: 'Disciple of Breaking Sky',
    description: 'A disciplined swordmaster specializing in rapid fluid slashes, mid-air juggles, and relentless combo pressure.',
    defaultAttributes: {
      strength: 12,
      agility: 10,
      resonance: 8,
    },
    preferredArena: 'metro',
    accentColor: 'text-cyan-400 border-cyan-500/50',
    avatarIcon: 'Sword',
  },
  {
    id: 'shadow_rogue',
    name: 'Shadow Rogue',
    title: 'Phantom of the Seam',
    description: 'An evasive infiltrator who excels at micro-parries, smoke veils, and lightning-fast Sabotage Energy generation.',
    defaultAttributes: {
      strength: 8,
      agility: 14,
      resonance: 8,
    },
    preferredArena: 'flooded',
    accentColor: 'text-purple-400 border-purple-500/50',
    avatarIcon: 'Ghost',
  },
  {
    id: 'titan_vanguard',
    name: 'Titan Vanguard',
    title: 'Bulwark of the Nebula',
    description: 'An ironclad frontliner capable of absorbing massive punishment, breaking boss stagger shields, and generating heavy counter-force.',
    defaultAttributes: {
      strength: 11,
      agility: 7,
      resonance: 12,
    },
    preferredArena: 'metro',
    accentColor: 'text-amber-400 border-amber-500/50',
    avatarIcon: 'ShieldAlert',
  },
];
