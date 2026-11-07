// ============================================================================
// StarStream Arena - Core Game Types
// ============================================================================

export type ElementalType = 'physical' | 'lightning' | 'ice' | 'fire' | 'void';
export type SkillCategory = 'melee' | 'elemental' | 'tactical' | 'stigma';
export type TelegraphType = 'ground_red' | 'slash_yellow' | 'pierce_blue';
export type CounterAction = 'jump' | 'crouch' | 'parry' | 'none';

export interface ArenaInteractiveProp {
  id: string;
  name: string;
  description: string;
  actionText: string;
  effectType: 'steam_blind' | 'pillar_cover' | 'rail_shock' | 'capacitor_zap' | 'crate_hop' | 'lightning_rod';
  isUsed: boolean;
  cooldownTurns: number;
  currentCooldown: number;
}

export interface BossTelegraph {
  name: string;
  telegraphType: TelegraphType;
  counterAction: CounterAction;
  damage: number;
  description: string;
  warningTurns: number; // turns until impact
}

export interface Boss {
  id: string;
  name: string;
  subtitle: string;
  maxHp: number;
  currentHp: number;
  staggerGauge: number; // 0 to 100
  isStaggered: boolean;
  staggerTurnsRemaining: number;
  phase: 1 | 2;
  enraged: boolean;
  activeTelegraph: BossTelegraph | null;
  possibleAttacks: BossTelegraph[];
  enrageThresholdHp: number; // e.g. 50%
}

export interface Arena {
  id: string;
  name: string;
  subtitle: string;
  theme: 'metro' | 'flooded';
  description: string;
  environmentalModifier: {
    name: string;
    description: string;
    meleeMultiplier: number;
    rangedMultiplier: number;
    lightningCritMultiplier: number;
    fireDurationMultiplier: number;
  };
  phase2Hazard: {
    name: string;
    description: string;
    intervalTurns: number;
    turnsUntilHazard: number;
    damage: number;
    warningText: string;
  };
  props: ArenaInteractiveProp[];
  boss: Boss;
  backgroundGradient: string;
}

export interface Skill {
  id: string;
  name: string;
  koreanLoreRef?: string;
  category: SkillCategory;
  element: ElementalType;
  energyCost: number;
  cooldown: number; // turns
  baseDamage: number;
  staggerDamage: number;
  sabotageEnergyGain: number;
  heatGenerated: number;
  description: string;
  synergyText?: string;
  isStigma?: boolean;
}

export interface PlayerAttributes {
  strength: number; // Melee & physical damage
  agility: number; // Dodge rate, crit multiplier, sabotage energy gain
  resonance: number; // Elemental damage, shield potency, cooldown reduction
}

export interface PlayerLoadout {
  name: string;
  avatarArchetype: 'blade_disciple' | 'shadow_rogue' | 'titan_vanguard';
  attributes: PlayerAttributes; // must sum to 30
  equippedSkills: string[]; // exactly 5 skill IDs
  weapon: {
    name: string;
    koreanLoreRef?: string;
    description: string;
    bonusEffect: string;
  };
  sponsorContract: 'justice' | 'monkey_king' | 'black_dragon' | 'unsponsored';
}

export interface SabotageAction {
  id: string;
  name: string;
  cost: number; // 40, 70, 100 sabotage energy
  effectType: 'debris' | 'minion' | 'heat';
  description: string;
  iconName: string;
}

export interface FlashBounty {
  id: string;
  title: string;
  description: string;
  rewardSol: number;
  condition: 'combo3' | 'parry' | 'prop';
  isCompleted: boolean;
  turnsRemaining: number;
}

export interface ActiveCombatState {
  playerHp: number;
  maxPlayerHp: number;
  playerEnergy: number;
  maxPlayerEnergy: number;
  probabilityHeat: number; // 0 - 100%
  sabotageEnergy: number; // 0 - 100
  stigmaMeter: number; // 0 - 100%
  activeHand: Skill[]; // dynamic 3 cards drawn from equipped 5
  deckDiscardPile: Skill[];
  deckDrawPile: Skill[];
  comboCount: number;
  styleRating: number;
  isAirborne: boolean; // boss airborne for juggles
  shieldPoints: number;
  isStunned: boolean;
  activeShieldMinionHp?: number; // Calamity minion intercepting damage
  activeBounty?: FlashBounty | null;
  incomingSabotage: {
    type: 'debris' | 'minion' | 'heat';
    turnsUntilImpact: number;
  } | null;
  combatLogs: string[];
}

export interface SpectatorConstellation {
  walletAddress: string;
  customTitle: string; // User chooses their own moniker e.g. "Constellation 'Neon Phantom'"
  avatarColor: string;
  totalTippedSol: number;
}

export interface StarStreamChatMessage {
  id: string;
  senderTitle: string;
  message: string;
  tipAmountSol?: number;
  timestamp: string;
  type: 'chat' | 'tip' | 'system' | 'overseer';
}

export interface MirroredDuelState {
  matchId: string;
  circuitTier: 'bronze' | 'silver' | 'gold';
  stakeAmountSol: number;
  arena: Arena;
  channelA: {
    playerName: string;
    loadout: PlayerLoadout;
    combatState: ActiveCombatState;
    bossState: Boss;
    totalTipsReceivedSol: number;
  };
  channelB: {
    playerName: string;
    loadout: PlayerLoadout;
    combatState: ActiveCombatState;
    bossState: Boss;
    totalTipsReceivedSol: number;
  };
  winner: 'channelA' | 'channelB' | null;
  isMatchOver: boolean;
  activeSpectatorFocus: 'split' | 'channelA' | 'channelB';
}

export type AppScreen =
  | 'lobby'
  | 'challenger_select'
  | 'dispatch_arena'
  | 'combat_player'
  | 'spectator_hub'
  | 'spectator_theater';

export interface LiveBroadcastMatch {
  channelId: string;
  channelName: string;
  scenarioName: string;
  arenaId: string;
  mode: 'duel' | 'solo';
  fighterA: {
    name: string;
    archetype: string;
    relic: string;
    hp: number;
    maxHp: number;
  };
  fighterB?: {
    name: string;
    archetype: string;
    relic: string;
    hp: number;
    maxHp: number;
  };
  bossName: string;
  circuitTier: 'bronze' | 'silver' | 'gold';
  potSol: number;
  viewerCount: number;
}

