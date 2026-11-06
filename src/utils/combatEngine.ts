import type {
  Arena,
  Boss,
  ActiveCombatState,
  Skill,
  PlayerLoadout,
  CounterAction,
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

// Initialize Combat State for a player
export function initializeCombatState(loadout: PlayerLoadout): ActiveCombatState {
  // Resolve equipped skills
  const equippedSkills = loadout.equippedSkills
    .map((id) => SKILL_CATALOG.find((s) => s.id === id))
    .filter((s): s is Skill => s !== undefined);

  const shuffled = shuffleArray(equippedSkills);
  const activeHand = shuffled.slice(0, 3);
  const deckDrawPile = shuffled.slice(3);

  const maxHp = 200 + loadout.attributes.resonance * 4;

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
    deckDrawPile,
    comboCount: 0,
    styleRating: 0,
    isAirborne: false,
    shieldPoints: 0,
    isStunned: false,
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

  // Update Boss HP and Stagger
  const newBossHp = Math.max(0, bossState.currentHp - damage);
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

    if (action === 'parry') {
      const reflectDamage = Math.round(telegraph.damage * 0.5);
      const newBossHp = Math.max(0, bossState.currentHp - reflectDamage);
      bonusStyle = 500;
      extraLog = `[PERFECT PARRY! Reflected ${reflectDamage} damage back to ${bossState.name}!]`;
      bossState = { ...bossState, currentHp: newBossHp, staggerGauge: Math.max(0, bossState.staggerGauge - 35) };
    } else if (action === 'jump') {
      extraLog = `[LEAP OF FAITH! Jumped over ${telegraph.name} cleanly!]`;
    } else if (action === 'crouch') {
      extraLog = `[SLIDE EVASION! Slid underneath ${telegraph.name}!]`;
    }

    const nextState: ActiveCombatState = {
      ...combatState,
      styleRating: combatState.styleRating + bonusStyle,
      sabotageEnergy: Math.min(100, combatState.sabotageEnergy + 15),
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

  // 1. Replenish Player Energy
  nextCombatState.playerEnergy = nextCombatState.maxPlayerEnergy;

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
        logs.push(`[SABOTAGE IMPACT: Calamity Minion has spawned in your arena, protecting the boss!]`);
      }
      nextCombatState.incomingSabotage = null;
    }
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
