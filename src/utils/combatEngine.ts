import type {
  Arena,
  Boss,
  ActiveCombatState,
  Skill,
  PlayerLoadout,
  CounterAction,
  FlashBounty,
} from '../types/game';
import { SKILL_CATALOG } from '../data/skills';

// Helper: Shuffle array
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate spontaneous Dokkaebi Flash Bounty
export function generateFlashBounty(turnNumber: number): FlashBounty {
  const bounties = [
    {
      title: '⚡ 3-HIT COMBO STREAK',
      description: 'Maintain a 3-Hit Combo Streak without getting hit to strip 40 Boss Poise & claim sponsor SOL!',
      rewardSol: 0.005,
      condition: 'combo3' as const,
    },
    {
      title: '🛡️ GUARDIAN PARRY CLASH',
      description: 'Execute a Perfect Parry against an incoming Boss Telegraph attack!',
      rewardSol: 0.004,
      condition: 'parry' as const,
    },
    {
      title: '💥 ARENA PROP DESTABILIZATION',
      description: 'Discharge an interactive arena hazard to disrupt the battlefield!',
      rewardSol: 0.003,
      condition: 'prop' as const,
    },
  ];

  const chosen = bounties[turnNumber % bounties.length];
  return {
    id: `bounty_${Date.now()}_${turnNumber}`,
    ...chosen,
    isCompleted: false,
    turnsRemaining: 2,
  };
}

// Initialize Combat State for a player
export function initializeCombatState(loadout: PlayerLoadout): ActiveCombatState {
  // Resolve equipped skills into 4 tactical moves
  const equippedSkills = loadout.equippedSkills
    .map((id) => SKILL_CATALOG.find((s) => s.id === id))
    .filter((s): s is Skill => s !== undefined);

  const activeHand = equippedSkills.length >= 4 ? equippedSkills.slice(0, 4) : equippedSkills;
  const maxHp = 200 + loadout.attributes.resonance * 4;
  const isDecoy = loadout.avatarArchetype === 'shadow_rogue';

  return {
    playerHp: maxHp,
    maxPlayerHp: maxHp,
    playerEnergy: 3,
    maxPlayerEnergy: 3,
    probabilityHeat: 0,
    sabotageEnergy: 0,
    stigmaMeter: 0,
    activeHand,
    deckDiscardPile: [],
    deckDrawPile: [],
    comboCount: 0,
    styleRating: 0,
    isAirborne: false,
    shieldPoints: 0,
    isStunned: false,
    turnCount: 1,
    avatarDecoyActive: isDecoy,
    activeStatus: null,
    setupBuff: null,
    narrativeDialogue: [
      `[SYSTEM: Incarnation ${loadout.name} stepped onto the Hero Pedestal.]`,
      `[OVERSEER: Channel #BI-7623 initialized. May the Constellations gaze upon your blood.]`,
    ],
    activeBounty: generateFlashBounty(1),
    incomingSabotage: null,
    combatLogs: [
      `[SYSTEM: Challenger ${loadout.name} entered the Star Stream Arena.]`,
      `[OVERSEER: Channel #BI-7623 initialized. May the Constellations gaze upon your blood.]`,
    ],
  };
}

// Draw up to 3 cards into hand
export function replenishHand(state: ActiveCombatState): ActiveCombatState {
  const needed = 3 - state.activeHand.length;
  if (needed <= 0) return state;

  let drawPile = [...state.deckDrawPile];
  let discardPile = [...state.deckDiscardPile];
  const newCards: Skill[] = [];

  for (let i = 0; i < needed; i++) {
    if (drawPile.length === 0) {
      if (discardPile.length === 0) break;
      drawPile = shuffleArray(discardPile);
      discardPile = [];
    }
    const card = drawPile.shift();
    if (card) newCards.push(card);
  }

  return {
    ...state,
    activeHand: [...state.activeHand, ...newCards],
    deckDrawPile: drawPile,
    deckDiscardPile: discardPile,
  };
}

// Execute player skill
export interface SkillExecutionResult {
  combatState: ActiveCombatState;
  bossState: Boss;
  arena: Arena;
  logs: string[];
}

export function executePlayerSkill(
  skillId: string,
  combatState: ActiveCombatState,
  bossState: Boss,
  arena: Arena,
  loadout: PlayerLoadout
): SkillExecutionResult {
  const skill = combatState.activeHand.find((s) => s.id === skillId);
  if (!skill) return { combatState, bossState, arena, logs: ['[ERROR: Skill not in active hand.]'] };

  if (combatState.playerEnergy < skill.energyCost) {
    return { combatState, bossState, arena, logs: ['[NOTICE: Insufficient Energy for this skill!]'] };
  }

  if (skill.isStigma && combatState.stigmaMeter < 100) {
    return { combatState, bossState, arena, logs: ['[NOTICE: Divine Stigma requires 100% Stigma Meter!]'] };
  }

  const logs: string[] = [];

  // Calculate damage scaling with attributes
  let damage = skill.baseDamage;
  if (skill.category === 'melee') {
    damage += Math.round(loadout.attributes.strength * 1.5);
  } else if (skill.category === 'elemental') {
    damage += Math.round(loadout.attributes.resonance * 1.5);
  }

  // Arena modifiers
  if (arena.theme === 'metro' && skill.category === 'melee') {
    damage = Math.round(damage * arena.environmentalModifier.meleeMultiplier);
    logs.push(`[ARENA PERK: Confined Quarters amplified ${skill.name} by +30%!]`);
  }

  if (arena.theme === 'flooded' && skill.element === 'lightning') {
    const isCrit = Math.random() < 0.55;
    if (isCrit) {
      damage = Math.round(damage * 1.6);
      logs.push(`[CRITICAL CONDUCTIVE SHOCK: ${skill.name} surged across floodwater!]`);
    }
  }

  // Stagger extra damage
  if (bossState.isStaggered) {
    damage = Math.round(damage * 1.5);
    logs.push(`[STAGGER BREAK: Boss is vulnerable! +50% Bonus Damage!]`);
  }

  // Active Combo Chaining Multiplier
  if (combatState.comboCount > 0 && skill.baseDamage > 0) {
    const comboBonusPercent = Math.min(60, combatState.comboCount * 15);
    const comboMultiplier = 1 + comboBonusPercent / 100;
    damage = Math.round(damage * comboMultiplier);
    logs.push(`[COMBO MULTIPLIER: Hit #${combatState.comboCount + 1} amplified damage by +${comboBonusPercent}%!]`);
  }

  // Calamity Minion Damage Interception
  let remainingDamage = damage;
  let updatedMinionHp = combatState.activeShieldMinionHp ?? 0;
  if (updatedMinionHp > 0 && remainingDamage > 0) {
    if (updatedMinionHp >= remainingDamage) {
      updatedMinionHp -= remainingDamage;
      logs.push(`[MINION DEFENSE: Calamity Drone intercepted ${remainingDamage} damage! (${updatedMinionHp} HP left)]`);
      remainingDamage = 0;
    } else {
      remainingDamage -= updatedMinionHp;
      logs.push(`[MINION DESTROYED: Calamity Drone absorbed ${updatedMinionHp} damage and was obliterated!]`);
      updatedMinionHp = 0;
    }
  }

  // Update Boss HP and Stagger
  const newBossHp = Math.max(0, bossState.currentHp - remainingDamage);
  let newStagger = bossState.staggerGauge;
  let isNowStaggered = bossState.isStaggered;
  let staggerTurns = bossState.staggerTurnsRemaining;

  if (!bossState.isStaggered) {
    newStagger = Math.max(0, bossState.staggerGauge - skill.staggerDamage);
    if (newStagger === 0) {
      isNowStaggered = true;
      staggerTurns = 2;
      logs.push(`[ARMOR BREAK! ${bossState.name} is staggered for 2 turns!]`);
    }
  }

  // Check Boss Phase 2 Enrage
  let bossPhase = bossState.phase;
  let isEnraged = bossState.enraged;
  if (bossPhase === 1 && newBossHp <= bossState.enrageThresholdHp) {
    bossPhase = 2;
    isEnraged = true;
    logs.push(`[PHASE 2 TRIGGERED: ${bossState.name} shattered its limits and entered ENRAGED state!]`);
    logs.push(`[ARENA ALERT: ${arena.phase2Hazard.warningText}]`);
  }

  // Update Player Resources
  const newEnergy = combatState.playerEnergy - skill.energyCost;
  const newHeat = Math.min(100, combatState.probabilityHeat + skill.heatGenerated);
  const newSabotage = Math.min(100, combatState.sabotageEnergy + skill.sabotageEnergyGain);
  const newStigma = skill.isStigma ? 0 : Math.min(100, combatState.stigmaMeter + 20);
  const newCombo = combatState.comboCount + 1;
  const styleGain = damage * 2 + newCombo * 50;
  const newStyle = combatState.styleRating + styleGain;

  logs.push(`[SKILL: ${skill.name} dealt ${damage} ${skill.element.toUpperCase()} damage!]`);

  // Move played card to discard, keep remaining hand
  const updatedHand = combatState.activeHand.filter((s) => s.id !== skillId);
  const updatedDiscard = [...combatState.deckDiscardPile, skill];

  // Check Flash Bounty: 3-Card Combo
  let currentBounty = combatState.activeBounty ? { ...combatState.activeBounty } : null;
  if (
    currentBounty &&
    !currentBounty.isCompleted &&
    currentBounty.condition === 'combo3' &&
    newCombo >= 3
  ) {
    currentBounty.isCompleted = true;
    newStagger = Math.max(0, newStagger - 40);
    if (newStagger === 0 && !isNowStaggered) {
      isNowStaggered = true;
      staggerTurns = 2;
    }
    logs.push(`[DOKKAEBI FLASH BOUNTY CLAIMED: +${currentBounty.rewardSol} SOL Awarded! Boss Stun Bar stripped -40!]`);
  }

  let nextCombatState: ActiveCombatState = {
    ...combatState,
    playerEnergy: newEnergy,
    probabilityHeat: newHeat,
    sabotageEnergy: newSabotage,
    stigmaMeter: newStigma,
    comboCount: newCombo,
    styleRating: newStyle,
    activeHand: updatedHand,
    deckDiscardPile: updatedDiscard,
    activeShieldMinionHp: updatedMinionHp,
    activeBounty: currentBounty,
    combatLogs: [...combatState.combatLogs, ...logs],
  };

  // Check Cosmic Backlash
  if (newHeat >= 100) {
    const backlashDamage = 35;
    nextCombatState.playerHp = Math.max(0, nextCombatState.playerHp - backlashDamage);
    nextCombatState.probabilityHeat = 30; // reset to 30 after explosion
    logs.push(`[COSMIC BACKLASH: Probability exceeded! Cosmic storm struck for ${backlashDamage} damage!]`);
  }

  const updatedBoss: Boss = {
    ...bossState,
    currentHp: newBossHp,
    staggerGauge: newStagger,
    isStaggered: isNowStaggered,
    staggerTurnsRemaining: staggerTurns,
    phase: bossPhase,
    enraged: isEnraged,
  };

  return {
    combatState: nextCombatState,
    bossState: updatedBoss,
    arena,
    logs,
  };
}

// React to Boss Telegraph Counter (Jump, Crouch, Parry)
export function executeCounterAction(
  action: CounterAction,
  combatState: ActiveCombatState,
  bossState: Boss
): { combatState: ActiveCombatState; bossState: Boss; success: boolean; message: string } {
  if (!bossState.activeTelegraph) {
    return { combatState, bossState, success: false, message: 'No active telegraph to counter!' };
  }

  const telegraph = bossState.activeTelegraph;
  const isMatch = action === telegraph.counterAction;

  if (isMatch) {
    // Successful counter
    let bonusStyle = 300;
    let extraLog = '';

    let bountyState = combatState.activeBounty ? { ...combatState.activeBounty } : null;
    if (action === 'parry') {
      const reflectDamage = Math.round(telegraph.damage * 0.5);
      const newBossHp = Math.max(0, bossState.currentHp - reflectDamage);
      bonusStyle = 500;
      extraLog = `[PERFECT PARRY! Reflected ${reflectDamage} damage back to ${bossState.name}!]`;
      bossState = { ...bossState, currentHp: newBossHp, staggerGauge: Math.max(0, bossState.staggerGauge - 35) };

      if (bountyState && !bountyState.isCompleted && bountyState.condition === 'parry') {
        bountyState.isCompleted = true;
        bonusStyle += 500;
        extraLog += ` [DOKKAEBI FLASH BOUNTY CLAIMED: +${bountyState.rewardSol} SOL Awarded!]`;
      }
    } else if (action === 'jump') {
      extraLog = `[LEAP OF FAITH! Jumped over ${telegraph.name} cleanly!]`;
    } else if (action === 'crouch') {
      extraLog = `[SLIDE EVASION! Slid underneath ${telegraph.name}!]`;
    }

    const nextState: ActiveCombatState = {
      ...combatState,
      styleRating: combatState.styleRating + bonusStyle,
      sabotageEnergy: Math.min(100, combatState.sabotageEnergy + 15),
      activeBounty: bountyState,
      combatLogs: [
        ...combatState.combatLogs,
        `[COUNTER SUCCESS: ${action.toUpperCase()} nullified ${telegraph.name}!]`,
        extraLog,
      ],
    };

    return {
      combatState: nextState,
      bossState: { ...bossState, activeTelegraph: null },
      success: true,
      message: 'Counter successful! Avoided damage.',
    };
  } else {
    // Failed counter - take damage
    const damage = telegraph.damage;
    const newPlayerHp = Math.max(0, combatState.playerHp - damage);

    const nextState: ActiveCombatState = {
      ...combatState,
      playerHp: newPlayerHp,
      comboCount: 0, // resets combo on hit
      combatLogs: [
        ...combatState.combatLogs,
        `[COUNTER FAILED: Needed ${telegraph.counterAction.toUpperCase()}, but used ${action.toUpperCase()}!]`,
        `[DAMAGE: Took ${damage} damage from ${telegraph.name}!]`,
      ],
    };

    return {
      combatState: nextState,
      bossState: { ...bossState, activeTelegraph: null },
      success: false,
      message: `Failed counter! Took ${damage} damage.`,
    };
  }
}

// End of Turn: Boss attack progression, hazard progression, energy replenish
export function resolveTurnCycle(
  combatState: ActiveCombatState,
  bossState: Boss,
  arena: Arena
): { combatState: ActiveCombatState; bossState: Boss; arena: Arena } {
  let nextCombatState = { ...combatState };
  let nextBoss = { ...bossState };
  let nextArena = { ...arena };
  const logs: string[] = [];

  // 1. Replenish Player Energy & reset turn combo
  nextCombatState.playerEnergy = nextCombatState.maxPlayerEnergy;
  nextCombatState.comboCount = 0;

  // 2. Replenish 3-card hand if needed
  nextCombatState = replenishHand(nextCombatState);

  // 3. Handle Stagger countdown
  if (nextBoss.isStaggered) {
    nextBoss.staggerTurnsRemaining -= 1;
    if (nextBoss.staggerTurnsRemaining <= 0) {
      nextBoss.isStaggered = false;
      nextBoss.staggerGauge = 100;
      logs.push(`[RECOVERY: ${nextBoss.name} recovered its iron armor posture!]`);
    } else {
      logs.push(`[STAGGER: ${nextBoss.name} remains immobilized for ${nextBoss.staggerTurnsRemaining} more turn!]`);
    }
  }

  // 4. Boss Telegraph / Attack logic (if not staggered)
  if (!nextBoss.isStaggered) {
    if (nextBoss.activeTelegraph) {
      // Telegraph was uncountered: execute damage!
      const damage = nextBoss.activeTelegraph.damage;
      nextCombatState.playerHp = Math.max(0, nextCombatState.playerHp - damage);
      nextCombatState.comboCount = 0;
      logs.push(`[UNOPPOSED HIT: ${nextBoss.name} landed ${nextBoss.activeTelegraph.name} for ${damage} damage!]`);
      nextBoss.activeTelegraph = null;
    } else {
      // Pick random next telegraph
      const possible = nextBoss.possibleAttacks;
      const chosen = possible[Math.floor(Math.random() * possible.length)];
      nextBoss.activeTelegraph = { ...chosen };
      logs.push(`[TELEGRAPH WARNING: ${nextBoss.name} is preparing ${chosen.name}! Counter with ${chosen.counterAction.toUpperCase()}!]`);
    }
  }

  // 5. Environmental Phase 2 Hazard countdown
  if (nextBoss.phase === 2) {
    const hazard = nextArena.phase2Hazard;
    hazard.turnsUntilHazard -= 1;
    if (hazard.turnsUntilHazard <= 0) {
      // Trigger hazard strike
      hazard.turnsUntilHazard = hazard.intervalTurns;
      const hazardDamage = Math.round(hazard.damage * 0.5); // chip damage
      nextCombatState.playerHp = Math.max(0, nextCombatState.playerHp - hazardDamage);
      logs.push(`[ENVIRONMENT HAZARD: ${hazard.name} struck the arena! Took ${hazardDamage} hazard damage!]`);
    } else {
      logs.push(`[HAZARD COUNTDOWN: ${hazard.name} impacts in ${hazard.turnsUntilHazard} turns!]`);
    }
  }

  // 6. Incoming Sabotage Resolution (Option B)
  if (nextCombatState.incomingSabotage) {
    nextCombatState.incomingSabotage.turnsUntilImpact -= 1;
    if (nextCombatState.incomingSabotage.turnsUntilImpact <= 0) {
      const sabType = nextCombatState.incomingSabotage.type;
      if (sabType === 'debris') {
        const dmg = 35;
        nextCombatState.playerHp = Math.max(0, nextCombatState.playerHp - dmg);
        logs.push(`[SABOTAGE IMPACT: Debris Barrage from opponent crushed your lane for ${dmg} damage!]`);
      } else if (sabType === 'heat') {
        nextCombatState.probabilityHeat = Math.min(100, nextCombatState.probabilityHeat + 35);
        logs.push(`[SABOTAGE IMPACT: Opponent overloaded your Probability Heat (+35%)!]`);
      } else if (sabType === 'minion') {
        nextCombatState.activeShieldMinionHp = (nextCombatState.activeShieldMinionHp ?? 0) + 60;
        logs.push(`[SABOTAGE IMPACT: Calamity Shield Minion (60 HP) spawned in your arena, protecting the boss!]`);
      }
      nextCombatState.incomingSabotage = null;
    }
  }

  // 7. Advance Turn Count and Dokkaebi Flash Bounty Progression
  nextCombatState.turnCount = (nextCombatState.turnCount || 1) + 1;
  if (nextCombatState.activeBounty) {
    if (nextCombatState.activeBounty.isCompleted) {
      nextCombatState.activeBounty = generateFlashBounty(nextCombatState.turnCount);
      logs.push(`[DOKKAEBI OVERSEER: New Flash Bounty issued: ${nextCombatState.activeBounty.title}!]`);
    } else {
      const remaining = nextCombatState.activeBounty.turnsRemaining - 1;
      if (remaining <= 0) {
        logs.push(`[DOKKAEBI: Flash Bounty expired! Rotating next bounty objective...]`);
        nextCombatState.activeBounty = generateFlashBounty(nextCombatState.turnCount);
      } else {
        nextCombatState.activeBounty = {
          ...nextCombatState.activeBounty,
          turnsRemaining: remaining,
        };
      }
    }
  } else {
    nextCombatState.activeBounty = generateFlashBounty(nextCombatState.turnCount);
  }

  nextCombatState.combatLogs = [...nextCombatState.combatLogs, ...logs];

  return {
    combatState: nextCombatState,
    bossState: nextBoss,
    arena: nextArena,
  };
}

// Trigger Interactive Arena Prop
export function triggerInteractiveProp(
  propId: string,
  combatState: ActiveCombatState,
  bossState: Boss,
  arena: Arena
): { combatState: ActiveCombatState; bossState: Boss; arena: Arena; success: boolean; message: string } {
  const prop = arena.props.find((p) => p.id === propId);
  if (!prop) return { combatState, bossState, arena, success: false, message: 'Prop not found.' };

  if (prop.isUsed) return { combatState, bossState, arena, success: false, message: 'Prop on cooldown!' };

  let logs: string[] = [];
  let updatedBoss = { ...bossState };
  let updatedCombat = { ...combatState };

  if (prop.effectType === 'steam_blind') {
    // Blinds boss and staggers for 1 turn
    updatedBoss.isStaggered = true;
    updatedBoss.staggerTurnsRemaining = 1;
    updatedBoss.activeTelegraph = null; // cancels current attack
    logs.push(`[INTERACTIVE PROP: ${prop.name} discharged! ${bossState.name} is blinded and immobilized!]`);
  } else if (prop.effectType === 'pillar_cover') {
    // If boss is charging, stuns boss
    if (bossState.activeTelegraph && bossState.activeTelegraph.counterAction === 'parry') {
      updatedBoss.isStaggered = true;
      updatedBoss.staggerTurnsRemaining = 2;
      updatedBoss.activeTelegraph = null;
      logs.push(`[INTERACTIVE PROP: ${bossState.name} charged directly into ${prop.name} and knocked itself out!]`);
    } else {
      updatedCombat.shieldPoints += 40;
      logs.push(`[INTERACTIVE PROP: Took cover behind ${prop.name}! Gained 40 Shield Points.]`);
    }
  } else if (prop.effectType === 'rail_shock' || prop.effectType === 'capacitor_zap') {
    // Heavy electrocution damage
    const zapDamage = 50;
    updatedBoss.currentHp = Math.max(0, updatedBoss.currentHp - zapDamage);
    updatedBoss.staggerGauge = Math.max(0, updatedBoss.staggerGauge - 40);
    logs.push(`[INTERACTIVE PROP: Zapped ${prop.name}! Discharged 10,000 Volts into ${bossState.name} for ${zapDamage} damage!]`);
  } else if (prop.effectType === 'lightning_rod') {
    // Calls down storm lightning
    const strikeDamage = 65;
    updatedBoss.currentHp = Math.max(0, updatedBoss.currentHp - strikeDamage);
    logs.push(`[INTERACTIVE PROP: Storm redirected! Giant lightning bolt struck ${bossState.name} for ${strikeDamage} damage!]`);
  } else if (prop.effectType === 'crate_hop') {
    updatedCombat.shieldPoints += 30;
    updatedCombat.styleRating += 200;
    logs.push(`[INTERACTIVE PROP: Hopped onto elevated platform! Height advantage gained (+30 Shield).]`);
  }

  // Check Flash Bounty: Prop
  if (
    updatedCombat.activeBounty &&
    !updatedCombat.activeBounty.isCompleted &&
    updatedCombat.activeBounty.condition === 'prop'
  ) {
    updatedCombat.activeBounty = {
      ...updatedCombat.activeBounty,
      isCompleted: true,
    };
    updatedCombat.sabotageEnergy = Math.min(100, updatedCombat.sabotageEnergy + 20);
    logs.push(`[DOKKAEBI FLASH BOUNTY CLAIMED: +${updatedCombat.activeBounty.rewardSol} SOL Awarded! +20 Sabotage Energy!]`);
  }

  // Mark prop as used
  const updatedProps = arena.props.map((p) =>
    p.id === propId ? { ...p, isUsed: true, currentCooldown: p.cooldownTurns } : p
  );

  updatedCombat.combatLogs = [...updatedCombat.combatLogs, ...logs];

  return {
    combatState: updatedCombat,
    bossState: updatedBoss,
    arena: { ...arena, props: updatedProps },
    success: true,
    message: `Triggered ${prop.name}!`,
  };
}

// ============================================================================
// POKÉMON x ORV TACTICAL TURN ENGINE (Speed, Priority, Status & Weakness)
// ============================================================================

export function calculateElementalMultiplier(
  attackElement: string,
  bossWeaknesses: string[] = [],
  bossResistances: string[] = []
): { multiplier: number; descriptor: 'super_effective' | 'resisted' | 'neutral' } {
  if (bossWeaknesses.includes(attackElement)) {
    return { multiplier: 2.0, descriptor: 'super_effective' };
  }
  if (bossResistances.includes(attackElement)) {
    return { multiplier: 0.5, descriptor: 'resisted' };
  }
  return { multiplier: 1.0, descriptor: 'neutral' };
}

export function determineTurnInitiative(
  playerMove: Skill,
  bossPriority: number,
  playerAgility: number,
  bossSpeed: number
): boolean {
  const pPriority = playerMove.priority ?? 0;
  if (pPriority > bossPriority) return true;
  if (pPriority < bossPriority) return false;
  return playerAgility >= bossSpeed;
}

export interface PokemonTurnResult {
  combatState: ActiveCombatState;
  bossState: Boss;
  arena: Arena;
  playerActedFirst: boolean;
  damageDealtByPlayer: number;
  damageDealtByBoss: number;
  isSuperEffective: boolean;
  isResisted: boolean;
  narrativeLogs: string[];
}

export function executePokemonStyleTurn(
  skillId: string,
  combatState: ActiveCombatState,
  bossState: Boss,
  arena: Arena,
  loadout: PlayerLoadout
): PokemonTurnResult {
  const skill = combatState.activeHand.find((s) => s.id === skillId);
  if (!skill) {
    return {
      combatState,
      bossState,
      arena,
      playerActedFirst: true,
      damageDealtByPlayer: 0,
      damageDealtByBoss: 0,
      isSuperEffective: false,
      isResisted: false,
      narrativeLogs: ['[ERROR: Move not found.]'],
    };
  }

  let nextCombat: ActiveCombatState = { ...combatState };
  let nextBoss: Boss = { ...bossState };
  let nextArena: Arena = { ...arena };
  const narrativeLogs: string[] = [];

  // 1. Determine Initiative (Speed & Priority)
  const bossMove = nextBoss.activeTelegraph;
  const bossPriority = bossMove?.priority ?? 0;
  const playerActedFirst = determineTurnInitiative(
    skill,
    bossPriority,
    loadout.attributes.agility,
    nextBoss.speed || 8
  );

  let totalPlayerDmg = 0;
  let totalBossDmg = 0;
  let isSuperEffective = false;
  let isResisted = false;

  // Sub-action: Player Executes Move
  const executePlayerMove = () => {
    narrativeLogs.push(`Incarnation ${loadout.name} used [${skill.name}]!`);

    // Check Setup Buff (Song of the Sword / swords dance)
    let attackMultiplier = 1.0;
    if (nextCombat.setupBuff && nextCombat.setupBuff.turnsRemaining > 0) {
      attackMultiplier = nextCombat.setupBuff.attackMultiplier;
      narrativeLogs.push(`[${nextCombat.setupBuff.name}] amplified damage by +60%!`);
    }

    // Check Elemental Effectiveness
    const elemResult = calculateElementalMultiplier(
      skill.element,
      nextBoss.weaknesses || [],
      nextBoss.resistances || []
    );

    if (elemResult.descriptor === 'super_effective') {
      isSuperEffective = true;
      narrativeLogs.push(`💥 IT'S SUPER EFFECTIVE! (2.0x DMG)`);
    } else if (elemResult.descriptor === 'resisted') {
      isResisted = true;
      narrativeLogs.push(`🛡️ It's not very effective... (0.5x DMG)`);
    }

    // Base damage calculation with Strength
    let dmg = skill.baseDamage;
    if (skill.baseDamage > 0) {
      dmg += Math.round(loadout.attributes.strength * 1.5);
      dmg = Math.round(dmg * attackMultiplier * elemResult.multiplier);

      // Staggered bonus (+50%)
      if (nextBoss.isStaggered) {
        dmg = Math.round(dmg * 1.5);
        narrativeLogs.push(`CRITICAL STUN PUNISH! (+50% DMG)`);
      }

      // Combo Streak bonus (+15% per consecutive hit, max +60%)
      nextCombat.comboCount = (nextCombat.comboCount || 0) + 1;
      if (nextCombat.comboCount > 1) {
        const comboBonus = Math.min(60, (nextCombat.comboCount - 1) * 15);
        dmg = Math.round(dmg * (1 + comboBonus / 100));
        narrativeLogs.push(`COMBO STREAK x${nextCombat.comboCount}: Damage amplified by +${comboBonus}%!`);
      }

      // Check Flash Bounty: 3-Hit Combo
      if (
        nextCombat.activeBounty &&
        !nextCombat.activeBounty.isCompleted &&
        nextCombat.activeBounty.condition === 'combo3' &&
        nextCombat.comboCount >= 3
      ) {
        nextCombat.activeBounty = { ...nextCombat.activeBounty, isCompleted: true };
        nextBoss.staggerGauge = Math.max(0, nextBoss.staggerGauge - 40);
        narrativeLogs.push(`DOKKAEBI FLASH BOUNTY CLAIMED: +${nextCombat.activeBounty.rewardSol} SOL! Stripped 40 Boss Poise!`);
      }

      totalPlayerDmg = dmg;
      nextBoss.currentHp = Math.max(0, nextBoss.currentHp - dmg);
      narrativeLogs.push(`Dealt ${dmg} ${skill.element.toUpperCase()} damage to ${nextBoss.name}!`);

      // Strip stagger gauge
      if (!nextBoss.isStaggered) {
        nextBoss.staggerGauge = Math.max(0, nextBoss.staggerGauge - skill.staggerDamage);
        if (nextBoss.staggerGauge === 0) {
          nextBoss.isStaggered = true;
          nextBoss.staggerTurnsRemaining = 2;
          narrativeLogs.push(`ARMOR SHATTERED! ${nextBoss.name} is Staggered for 2 turns!`);
        }
      }
    }

    // Setup Buff Application (e.g. Song of the Sword)
    if (skill.buffEffect) {
      if (skill.buffEffect.attackMultiplier) {
        nextCombat.setupBuff = {
          name: skill.name,
          attackMultiplier: skill.buffEffect.attackMultiplier,
          turnsRemaining: skill.buffEffect.duration,
        };
        narrativeLogs.push(`${loadout.name}'s combat intent surged! Next attacks deal +60% DMG!`);
      }
      if (skill.buffEffect.shieldBonus) {
        nextCombat.shieldPoints += skill.buffEffect.shieldBonus;
        narrativeLogs.push(`Gained +${skill.buffEffect.shieldBonus} Shield Points!`);
      }
    }

    // Status Ailment Infliction (Burn, Bleed, Paralyze, Concussion)
    if (skill.statusEffect) {
      const roll = Math.random();
      if (roll <= skill.statusEffect.chance) {
        nextBoss.activeStatus = {
          type: skill.statusEffect.type,
          durationTurns: skill.statusEffect.duration,
          damagePerTurn: skill.statusEffect.damagePerTurn,
        };
        narrativeLogs.push(`STATUS INFLICTED: ${nextBoss.name} was afflicted with [${skill.statusEffect.type.toUpperCase()}]!`);
      }
    }

    // Stigma & Heat tracking
    nextCombat.stigmaMeter = skill.isStigma ? 0 : Math.min(100, nextCombat.stigmaMeter + 20);
    nextCombat.probabilityHeat = Math.min(100, nextCombat.probabilityHeat + skill.heatGenerated);
    nextCombat.sabotageEnergy = Math.min(100, nextCombat.sabotageEnergy + skill.sabotageEnergyGain);
    nextCombat.styleRating += dmg * 2 + 100;
  };

  // Sub-action: Boss Executes Attack
  const executeBossMove = () => {
    // Check if Boss is Paralyzed or Staggered
    if (nextBoss.isStaggered) {
      narrativeLogs.push(`${nextBoss.name} is STAGGERED and cannot move!`);
      return;
    }

    if (nextBoss.activeStatus?.type === 'paralyze' && Math.random() < 0.4) {
      narrativeLogs.push(`${nextBoss.name} is PARALYZED! It couldn't move!`);
      return;
    }

    if (nextBoss.activeStatus?.type === 'concussion') {
      narrativeLogs.push(`${nextBoss.name} is CONCUSSED and flinched!`);
      return;
    }

    // Pick attack if none active
    const attacks = nextBoss.possibleAttacks;
    const attack = nextBoss.activeTelegraph || attacks[Math.floor(Math.random() * attacks.length)];
    narrativeLogs.push(`${nextBoss.name} executed [${attack.name}]!`);

    let bossDmg = attack.damage;

    // Check Avatar Decoy (Han Sooyoung clone absorbs 100%!)
    if (nextCombat.avatarDecoyActive) {
      nextCombat.avatarDecoyActive = false;
      narrativeLogs.push(`DECOY CLASH: The Shadow Avatar absorbed the entire strike cleanly!`);
      return;
    }

    // Check Counter Stance (Fourth Wall reflects 1.5x damage!)
    if (skill.priority === -1) {
      const reflected = Math.round(bossDmg * 1.5);
      const reduced = Math.round(bossDmg * 0.5);
      nextBoss.currentHp = Math.max(0, nextBoss.currentHp - reflected);
      narrativeLogs.push(`PERFECT COUNTER REVERSAL! Endured strike for ${reduced} DMG and reflected ${reflected} DMG back to ${nextBoss.name}!`);
      bossDmg = reduced;
    }

    // Apply damage to Player Shield first, then HP
    if (nextCombat.shieldPoints > 0) {
      if (nextCombat.shieldPoints >= bossDmg) {
        nextCombat.shieldPoints -= bossDmg;
        narrativeLogs.push(`Shield absorbed all ${bossDmg} damage!`);
        bossDmg = 0;
      } else {
        bossDmg -= nextCombat.shieldPoints;
        narrativeLogs.push(`Shield absorbed ${nextCombat.shieldPoints} damage and broke!`);
        nextCombat.shieldPoints = 0;
      }
    }

    totalBossDmg = bossDmg;
    nextCombat.playerHp = Math.max(0, nextCombat.playerHp - bossDmg);
    if (bossDmg > 0) {
      nextCombat.comboCount = 0;
      narrativeLogs.push(`${loadout.name} took ${bossDmg} damage!`);
    }

    // Cycle next telegraph
    nextBoss.activeTelegraph = attacks[Math.floor(Math.random() * attacks.length)];
  };

  // Execute in order of initiative
  if (playerActedFirst) {
    narrativeLogs.push(`SPEED INITIATIVE: ${loadout.name} moves first!`);
    executePlayerMove();
    if (nextBoss.currentHp > 0) {
      executeBossMove();
    } else {
      narrativeLogs.push(`VICTORY! ${nextBoss.name} was defeated before it could strike!`);
    }
  } else {
    narrativeLogs.push(`SPEED INITIATIVE: ${nextBoss.name} outspeeds and strikes first!`);
    executeBossMove();
    if (nextCombat.playerHp > 0) {
      executePlayerMove();
    }
  }

  // End-of-turn Status Ticks (Burn / Bleed)
  if (nextBoss.currentHp > 0 && nextBoss.activeStatus) {
    const status = nextBoss.activeStatus;
    if (status.type === 'burn' || status.type === 'bleed') {
      const tick = status.damagePerTurn || 15;
      nextBoss.currentHp = Math.max(0, nextBoss.currentHp - tick);
      narrativeLogs.push(`STATUS TICK: ${nextBoss.name} took ${tick} ${status.type.toUpperCase()} damage!`);
    }
    status.durationTurns -= 1;
    if (status.durationTurns <= 0) {
      narrativeLogs.push(`${nextBoss.name} recovered from ${status.type}!`);
      nextBoss.activeStatus = null;
    }
  }

  // Decrement Player Setup Buff
  if (nextCombat.setupBuff) {
    nextCombat.setupBuff.turnsRemaining -= 1;
    if (nextCombat.setupBuff.turnsRemaining <= 0) {
      nextCombat.setupBuff = null;
    }
  }

  // Decrement Boss Stagger
  if (nextBoss.isStaggered) {
    nextBoss.staggerTurnsRemaining -= 1;
    if (nextBoss.staggerTurnsRemaining <= 0) {
      nextBoss.isStaggered = false;
      nextBoss.staggerGauge = 100;
      narrativeLogs.push(`${nextBoss.name} recovered its posture!`);
    }
  }

  nextCombat.turnCount = (nextCombat.turnCount || 1) + 1;
  nextCombat.narrativeDialogue = narrativeLogs;
  nextCombat.combatLogs = [...nextCombat.combatLogs, ...narrativeLogs.map((l) => `[TURN ${nextCombat.turnCount}: ${l}]`)];

  return {
    combatState: nextCombat,
    bossState: nextBoss,
    arena: nextArena,
    playerActedFirst,
    damageDealtByPlayer: totalPlayerDmg,
    damageDealtByBoss: totalBossDmg,
    isSuperEffective,
    isResisted,
    narrativeLogs,
  };
}
