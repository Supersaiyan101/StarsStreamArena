// ============================================================================
// StarStream Arena - Core Game Types (ORV x Pokémon Tactical Engine)
// ============================================================================

export type ElementalType =
  | 'physical'
  | 'lightning'
  | 'ice'
  | 'fire'
  | 'void'
  | 'plasma'
  | 'dark'
  | 'holy'
  | 'blunt'
  | 'water';

export type SkillCategory = 'melee' | 'elemental' | 'tactical' | 'stigma' | 'strike' | 'setup' | 'priority';
export type MoveRole = 'strike' | 'setup' | 'priority' | 'stigma';
export type MovePriority = -1 | 0 | 1; // +1 = Strikes first (Quick Attack); 0 = Standard; -1 = Slow Counter (Bide)
export type TelegraphType = 'ground_red' | 'slash_yellow' | 'pierce_blue' | 'channel_ultimate';
export type CounterAction = 'jump' | 'crouch' | 'parry' | 'none';
export type StatusType = 'burn' | 'bleed' | 'paralyze' | 'concussion' | 'none';

export interface ActiveStatusEffect {
  type: StatusType;
  durationTurns: number;
  damagePerTurn?: number;
  attackReductionPercent?: number; // e.g. burn halves physical attack
  skipTurnChance?: number; // e.g. paralyze 35% chance to skip turn
}

export interface FablePassive {
  id: string;
  name: string;
  koreanLoreRef?: string;
  description: string;
  triggerCondition: 'low_hp' | 'battle_start' | 'lethal_hit';
  isTriggered?: boolean;
}

export interface BossChannelingAttack {
  name: string;
  damage: number;
  turnsLeft: number;
  breakShieldHp: number;
  maxBreakShieldHp: number;
  description: string;
}

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
  element?: ElementalType;
  priority?: MovePriority;
}

export interface Boss {
  id: string;
  name: string;
  subtitle: string;
  maxHp: number;
  currentHp: number;
  speed: number; // Speed stat compared against Player Agility for turn initiative
  elementalType: ElementalType;
  weaknesses: ElementalType[]; // Takes 2.0x Super Effective Damage!
  resistances: ElementalType[]; // Takes 0.5x Resisted Damage!
  staggerGauge: number; // 0 to 100
  isStaggered: boolean;
  staggerTurnsRemaining: number;
  phase: 1 | 2;
  enraged: boolean;
  activeStatus: ActiveStatusEffect | null;
  channelingAttack: BossChannelingAttack | null; // Raid boss DPS check shield
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
  moveRole?: MoveRole;
  element: ElementalType;
  priority?: MovePriority;
  energyCost: number;
  cooldown: number; // turns
  baseDamage: number;
  staggerDamage: number;
  sabotageEnergyGain: number;
  heatGenerated: number;
  statusEffect?: {
    type: StatusType;
    chance: number; // 0.0 to 1.0
    duration: number;
    damagePerTurn?: number;
  };
  buffEffect?: {
    attackMultiplier?: number;
    shieldBonus?: number;
    duration: number;
  };
  description: string;
  synergyText?: string;
  isStigma?: boolean;
}

export interface PlayerAttributes {
  strength: number; // Melee & physical damage
  agility: number; // Turn order Speed initiative, Dodge rate, crit multiplier
  resonance: number; // Elemental damage, shield potency, cooldown reduction
}

export interface PlayerLoadout {
  name: string;
  avatarArchetype: 'blade_disciple' | 'shadow_rogue' | 'titan_vanguard';
  attributes: PlayerAttributes; // must sum to 30
  equippedSkills: string[]; // exactly 4 or 5 skill IDs
  fablePassive?: FablePassive;
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
  activeHand: Skill[]; // dynamic cards / 4 tactical moves
  deckDiscardPile: Skill[];
  deckDrawPile: Skill[];
  comboCount: number;
  styleRating: number;
  isAirborne: boolean; // boss airborne for juggles
  shieldPoints: number;
  isStunned: boolean;
  turnCount: number;
  activeStatus?: ActiveStatusEffect | null;
  setupBuff?: {
    name: string;
    attackMultiplier: number;
    turnsRemaining: number;
  } | null;
  avatarDecoyActive?: boolean; // Han Sooyoung shadow clone
  counterStanceActive?: boolean; // Lee Hyunsung Kinetic Reversal ready
  activeShieldMinionHp?: number; // Calamity minion intercepting damage
  activeBounty?: FlashBounty | null;
  incomingSabotage: {
    type: 'debris' | 'minion' | 'heat';
    turnsUntilImpact: number;
  } | null;
  combatLogs: string[];
  narrativeDialogue?: string[]; // Pokemon-style battle log ticker
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

