export interface WeaponRelic {
  id: string;
  name: string;
  koreanLoreRef: string;
  tier: 'Historic' | 'Legendary' | 'Mythic';
  description: string;
  bonusEffect: string;
  sabotageBonusRate: number; // multiplier e.g. 1.15
  bossDamageBonus: number; // percentage
  iconName: string;
}

export const WEAPON_RELICS: WeaponRelic[] = [
  {
    id: 'unbroken_faith',
    name: 'Unbroken Faith',
    koreanLoreRef: '하얗게 깨지지 않는 믿음',
    tier: 'Legendary',
    description: 'A pristine pure-white star blade that channels Ether into razor-sharp energy waves.',
    bonusEffect: '+15% Sabotage Energy generation rate on all successful combos.',
    sabotageBonusRate: 1.15,
    bossDamageBonus: 0,
    iconName: 'Sword',
  },
  {
    id: 'four_tiger_sword',
    name: 'Four Tiger Evil-Cutting Sword',
    koreanLoreRef: '사인참사검 (Four Tigers Blade)',
    tier: 'Legendary',
    description: 'An ancient exorcism sword inscribed with the celestial tiger constellation runes.',
    bonusEffect: '+25% bonus damage against Calamity Bosses and summoned shadow minions.',
    sabotageBonusRate: 1.0,
    bossDamageBonus: 25,
    iconName: 'Flame',
  },
  {
    id: 'white_star_dagger',
    name: 'White Pure Star Fluid Dagger',
    koreanLoreRef: '백청강기 (White Star Qi)',
    tier: 'Historic',
    description: 'Forged from solidified stellar fluid. Incredibly light with blistering strike velocity.',
    bonusEffect: 'Every 3rd basic attack triggers a guaranteed double-hit strike.',
    sabotageBonusRate: 1.1,
    bossDamageBonus: 10,
    iconName: 'Zap',
  },
  {
    id: 'infinite_space_coat',
    name: 'Infinite Dimension Space Coat',
    koreanLoreRef: '무한 차원의 외투',
    tier: 'Mythic',
    description: 'The iconic black trenchcoat of the Star Stream. Its inner lining connects to pocket dimensions.',
    bonusEffect: 'Reduces all incoming critical damage by 30% and increases starting shield by +35 HP.',
    sabotageBonusRate: 1.05,
    bossDamageBonus: 5,
    iconName: 'Shield',
  },
];
