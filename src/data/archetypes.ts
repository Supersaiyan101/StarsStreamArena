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
  defaultWeaponId: string;
  defaultSkillIds: string[];
  preferredArena: 'metro' | 'flooded';
  accentColor: string;
  avatarIcon: string;
}

export const AVATAR_ARCHETYPES: AvatarArchetype[] = [
  {
    id: 'blade_disciple',
    name: 'Blade Disciple',
    title: 'Combo Swordmaster',
    description: 'Rapid dual-blade slashes, aerial juggles, and relentless combo pressure. Dominates close-quarters arenas.',
    defaultAttributes: {
      strength: 12,
      agility: 10,
      resonance: 8,
    },
    defaultWeaponId: 'unbroken_faith',
    defaultSkillIds: [
      'plasma_cleave',
      'song_of_the_sword',
      'phase_shift',
      'heavens_retribution',
      'cyclone_shred',
    ],
    preferredArena: 'metro',
    accentColor: 'text-cyan-400 border-cyan-500/50',
    avatarIcon: 'Sword',
  },
  {
    id: 'shadow_rogue',
    name: 'Shadow Rogue',
    title: 'Evasive Assassin',
    description: 'Lightning-fast dodges, critical strikes, and rapid Sabotage Energy generation to disrupt rivals.',
    defaultAttributes: {
      strength: 8,
      agility: 14,
      resonance: 8,
    },
    defaultWeaponId: 'white_star_dagger',
    defaultSkillIds: [
      'phantom_lunge',
      'smoke_veil',
      'secretive_strike',
      'black_flame_annihilation',
      'volt_arc',
    ],
    preferredArena: 'flooded',
    accentColor: 'text-purple-400 border-purple-500/50',
    avatarIcon: 'Ghost',
  },
  {
    id: 'titan_vanguard',
    name: 'Titan Vanguard',
    title: 'Iron Bulwark',
    description: 'Heavy defense, shield absorptions, and crushing poise breaks to instantly shatter boss Stun bars.',
    defaultAttributes: {
      strength: 11,
      agility: 7,
      resonance: 12,
    },
    defaultWeaponId: 'infinite_space_coat',
    defaultSkillIds: [
      'kinetic_breaker',
      'glacial_aegis',
      'kinetic_deflector',
      'ruyi_jingu_bang',
      'infernal_ignition',
    ],
    preferredArena: 'metro',
    accentColor: 'text-amber-400 border-amber-500/50',
    avatarIcon: 'ShieldAlert',
  },
];

